from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.views import APIView
from .serializers import ReservationSerializer
from .models import Reservation
from social.models import Notification
from properties.models import Property, PropertyRanges
from .paginators import ReservationPagination
import datetime

class GuestReservations(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationSerializer
    pagination_class = ReservationPagination

    def get_queryset(self):
        CheckStatusReservations()
        all_user_res = Reservation.objects.filter(guest=self.request.user).order_by('-start_date')
        if "status" in self.request.query_params:
            status = self.request.query_params.get("status")
            return Reservation.objects.filter(guest=self.request.user, status=status).order_by('-start_date')
        if "tab" in self.request.query_params:
            tab = self.request.query_params.get("tab")
            if tab == "requests":
                return all_user_res.filter(status="Pending")
            elif tab == "upcoming":
                return all_user_res.filter(status="Approved") | all_user_res.filter(status="Cancellation_Request")
            else:
                return all_user_res.filter(status="Canceled") | all_user_res.filter(status="Terminated") | all_user_res.filter(status="Expired") | all_user_res.filter(status="Completed") | all_user_res.filter(status="Denied")
        return all_user_res
    
class HostReservations(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationSerializer
    pagination_class = ReservationPagination

    def get_queryset(self):
        CheckStatusReservations()
        all_host_res = Reservation.objects.filter(host=self.request.user).order_by('-start_date')
        if "status" in self.request.query_params:
            status = self.request.query_params.get("status")
            return Reservation.objects.filter(host=self.request.user, status=status)
        if "tab" in self.request.query_params:
            tab = self.request.query_params.get("tab")
            if tab == "pending":
                return all_host_res.filter(status="Pending")
            elif tab == "approved":
                return all_host_res.filter(status="Approved") | all_host_res.filter(status="Cancellation_Request") | all_host_res.filter(status="Completed")
            else:
                return all_host_res.filter(status="Canceled") | all_host_res.filter(status="Terminated") | all_host_res.filter(status="Expired") | all_host_res.filter(status="Denied")
        return Reservation.objects.filter(host=self.request.user)

class CreateReservation(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ReservationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            # Check if a valid property has been chosen 
            property = Property.objects.get(pk=self.kwargs['pk'])
            start_date = serializer.validated_data['start_date']
            end_date = serializer.validated_data['end_date']

            # Check if the user trying to reserve is the host
            if request.user == property.host:
                return Response("You cannot reserve your own property", status=403)
            
            # # Check if there is a date range for this reservation
            # if not PropertyRanges.objects.filter(property=property).filter(start_date__lte=serializer.validated_data['start_date']).filter(end_date__gte=serializer.validated_data['end_date']).exists():
            #     return Response("Your date range is not available for this property", status=404)
            
            ranges = PropertyRanges.objects.filter(property=property).order_by('start_date')
            matching_ranges = []
            for i, range in enumerate(ranges):
                if (range.start_date <= start_date <= range.end_date) and (range.start_date <= end_date <= range.end_date):
                    matching_ranges.append(range)
                elif (range.start_date <= start_date <= range.end_date) or (range.start_date <= end_date <= range.end_date) or (start_date <= range.start_date and end_date >= range.end_date):
                    if i == 0:
                        if range.end_date + datetime.timedelta(days=1) == ranges[i+1].start_date:
                            matching_ranges.append(range)
                    elif i == len(ranges)-1:
                        if range.start_date == ranges[i-1].end_date + datetime.timedelta(days=1):
                            matching_ranges.append(range)
                    else:
                        if range.start_date == ranges[i-1].end_date + datetime.timedelta(days=1) and range.end_date + datetime.timedelta(days=1) == ranges[i+1].start_date:
                            matching_ranges.append(range)

            if not matching_ranges:
                return Response("Your date range is not available for this property", status=404)


            # Check if a reservation for dates in this range already exists
            if Reservation.objects.filter(start_date__lte=end_date, end_date__gte=start_date, status="Approved", property=property).exists():
                return Response("Part of your date range is unavailable", status=400)
            
            # Check if a request has already been made by this user for this range
            if Reservation.objects.filter(start_date__lte=end_date, end_date__gte=start_date, guest=request.user, property=property, status__in=("Approved", "Pending", "Completed")).exists():
                return Response("You already have a request for this property for this date range", status=400)
        
        except Property.DoesNotExist:
            return Response("Property " + str(self.kwargs['pk']) + " does not exist", status=404)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
    
    def perform_create(self, serializer):
        guest = self.request.user
        try:
            property = Property.objects.get(pk=self.kwargs['pk'])
            host = property.host
            serializer.save(guest=guest, host=host, property=property, status='Pending')

            # send notification to host about the new reservation
            message = "A new reservation was requested on property " + str(self.kwargs['pk']) + " by guest " + str(guest.pk) + " ." 
            Notification(user=host, message=message).save()

        except Property.DoesNotExist:
            Response(status=404)

class CancelReservation(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        CheckStatusReservations()
        # Check if the reservation exists
        try:
            reservation = Reservation.objects.get(pk=pk)
        except Reservation.DoesNotExist:
            return Response("Reservation " + str(pk) + " does not exist", status=404)

        if reservation.guest == request.user:
            if reservation.status == "Pending":
                reservation.status = "Canceled"
                reservation.save()

                # send notification to host about canceled reservation
                message = "Reservation " + str(self.kwargs['pk']) + " on property " + str(reservation.property.pk) + " was canceled by guest." 
                Notification(user=reservation.host, message=message).save()

                return Response("You have successfully cancelled reservation " + str(pk), status=200)
            elif reservation.status == "Approved":
                reservation.status = "Cancellation_Request"
                reservation.save()

                # send notification to host about cancelation request
                message = "Cancelation request for reservation " + str(self.kwargs['pk']) + " on property " + str(reservation.property.pk) + " ." 
                Notification(user=reservation.host, message=message).save()

                return Response("You have successfully sent a request to cancel reservation " + str(pk), status=200)
            else:
                return Response("You cannot cancel this reservation", status=400)
        elif reservation.host == request.user:
            if reservation.status == "Pending" or reservation.status == "Approved":
                reservation.status = "Canceled"
                reservation.save()

                # send notification to guest about canceled reservation
                message = "Reservation " + str(self.kwargs['pk']) + " on property " + str(reservation.property.pk) + " was canceled by host." 
                Notification(user=reservation.guest, message=message).save()

            elif reservation.status == "Cancellation_Request":
                reservation.status = "Canceled"
                reservation.save()

                # send notification to guest about approved cancelation request
                message = "Your cancelation request was approved for reservation " + str(self.kwargs['pk']) + " on property " + str(reservation.property) + " ." 
                Notification(user=reservation.guest, message=message).save()

            else:
                return Response("You cannot cancel this reservation", status=400)
            return Response("You have successfully cancelled reservation " + str(pk), status=200)
        else:
            return Response("You are not the host or guest of this reservation", status=403)

class ApproveReservation(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        CheckStatusReservations()
        try:
            reservation = Reservation.objects.get(pk=pk)
        except Reservation.DoesNotExist:
            return Response("Reservation " + str(pk) + " does not exist", status=404)
        
        if reservation.host == request.user:
            if reservation.status == "Pending":
                reservation.status = "Approved"
                reservation.save()

                # send notification to guest about approved reservation
                message = "Reservation " + str(self.kwargs['pk']) + " on property " + str(reservation.property.pk) + " was approved." 
                Notification(user=reservation.guest, message=message).save()

                return Response("You have approved reservation " + str(pk), status=200)  
            else:
                return Response("Reservation " + str(pk) + " is not pending, you cannot approve it", status=400)
        else:
            return Response("You cannot approve this reservation because you are not the host", status=403)

class DenyReservation(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        CheckStatusReservations()
        try:
            reservation = Reservation.objects.get(pk=pk)
        except Reservation.DoesNotExist:
            return Response("Reservation " + str(pk) + " does not exist", status=404)
        
        if reservation.host == request.user:
            if reservation.status == "Pending":
                reservation.status = "Denied"
                reservation.save()

                # send notification to guest about denied reservation
                message = "Reservation " + str(self.kwargs['pk']) + " on property " + str(reservation.property.pk) + " was denied." 
                Notification(user=reservation.guest, message=message).save()

                return Response("You have denied reservation " + str(pk), status=200)
            else:
                return Response("Reservation " + str(pk) + " is not pending, you cannot deny it", status=400)
        else:
            return Response("You cannot deny this reservation because you are not the host", status=403)

class TerminateReservation(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        CheckStatusReservations()
        try:
            reservation = Reservation.objects.get(pk=pk)
        except Reservation.DoesNotExist:
            return Response("Reservation " + str(pk) + " does not exist", status=404)
        
        if reservation.host == request.user:
            if reservation.status == "Approved":
                reservation.status = "Terminated"
                reservation.save()
                return Response("You have terminated reservation " + str(pk), status=200)
            else:
                return Response("Reservation " + str(pk) + " is not approved, you cannot terminate it", status=400)
        else:
            return Response("You cannot terminate this reservation because you are not the host", status=403)

def CheckStatusReservations():
    for reservation in Reservation.objects.all():
        if reservation.status == "Pending":
            if reservation.start_date <= datetime.date.today():
                reservation.status = "Expired"
                reservation.save()
        elif reservation.status == "Approved" or reservation.status == "Cancellation_Request":
            if datetime.date.today() > reservation.end_date:
                reservation.status = "Completed"
                reservation.save()
            
