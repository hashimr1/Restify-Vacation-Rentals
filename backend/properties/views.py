from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView, RetrieveUpdateAPIView
from rest_framework.views import APIView
from .models import Property, PropertyRanges
from .serializers import PropertySerializer, PropertyRangesSerializer, ListPropertyRangesSerializer
from django.utils.dateparse import parse_date
from .paginators import PropertyPagination
# Create your views here.

AMENITIES = [
    "tv",
    "air_condition",
    "wifi",
    "kitchen",
    "hair_dryer",
    "heating",
    "iron",
    "workspace",
    "washer",
    "dryer",
    "pool",
    "free_parking",
    "crib",
    "grill",
    "hot_tub",
    "EV_charger",
    "gym",
    "indoor_fireplace",
    "breakfast",
    "smoking_allowed"
    ]


class AddAvailability(CreateAPIView):
    model = PropertyRanges
    serializer_class = PropertyRangesSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = self.request.POST
        property_pk = self.kwargs['pk']
        property_host_pk = Property.objects.filter(pk=property_pk)[0].host.pk
        if property_host_pk != self.request.user.pk:
            return Response("This property does not belong to you", status=403)
        start_date = parse_date(data.get("start_date"))
        end_date = parse_date(data.get("end_date"))
        date_ranges = PropertyRanges.objects.filter(property=self.kwargs['pk'])

        for date in date_ranges:
            if start_date >= date.start_date and start_date <= date.end_date:
                return Response("Date range must not overlap with pre-existing availabilities", status=404)
            if end_date <= date.end_date and end_date >= date.start_date:
                return Response("Date range must not overlap with pre-existing availabilities", status=404)
            
        return super().post(request, *args, **kwargs)
    
class ShowAvailability(ListAPIView):
    model = PropertyRanges
    serializer_class = ListPropertyRangesSerializer
    
    def get_queryset(self):
        property_pk = self.kwargs['pk']
        return PropertyRanges.objects.filter(property=self.kwargs['pk'])


class CreateProperty(CreateAPIView):
    model = Property
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # try:  
        #     if self.request.POST['host'] != str(self.request.user.pk):
        #         return Response("You cannot create properties for other users", status=403)
        # except:
        #     return Response("No host provided for property", status=400)
        # self.request.POST['host'] = str(self.request.user.pk)

        return super().post(request)
    
    def perform_create(self, serializer):
        serializer.save(host=self.request.user)
        


class UpdateProperty(UpdateAPIView):
    model = Property
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        
        property_pk = self.kwargs['pk']
        try:
            property_host_pk = Property.objects.filter(pk=property_pk)[0].host.pk
            if property_host_pk != self.request.user.pk:
                return Response("This property does not belong to you", status=403)
        except:
            return Response("This property does not exists", status=404)
        
        try:
            request.data.get('preview')
        except:
            request.data.preview = Property.objects.filter(pk=property_pk)[0].preview
        return super().put(request, pk)
    
    def perform_update(self, serializer):
        preview = self.request.data.get('preview')
        if preview is not None:
            serializer.save(preview=preview)
        else:
            serializer.save(update_fields=[f.name for f in self.model._meta.fields if f.name != 'photo'])
    
    def get_queryset(self):
        try:
            property = Property.objects.filter(pk=self.kwargs['pk'])
        except:
            return Response("This property does not exists", status=404)
        return property
    

class SearchProperty(ListAPIView):
    model = Property
    serializer_class = PropertySerializer
    pagination_class = PropertyPagination


    def get_queryset(self):
        data = self.request.query_params
 
        try:
            guests = int(data['guests'])
        except:
            guests = 0
        try:
            location = data['location']
        except:
            location = ""
        try:
            order_by = data['order_by']
        except:
            order_by = "None"
        
        pk = self.request.query_params.get('pk')

        amenities = ["False"] * 20
        

        for i, amenity in enumerate(AMENITIES):
            if amenity in data.keys():
                if data[amenity] == 'false':
                    amenities[i] = "False"

                elif data[amenity] == 'true':
                    amenities[i] = "True"
                
                elif data[amenity] != "":
                    amenities[i] = data[amenity]
 
     
        filtered_properties = Property.objects.filter(guests__gte=guests, address__contains=location,
                                                                tv__in=[amenities[0], "True"],
                                                                air_condition__in=[amenities[1], "True"], 
                                                                wifi__in=[amenities[2], "True"],
                                                                kitchen__in=[amenities[3], "True"], hair_dryer__in=[amenities[4], "True"],
                                                                heating__in=[amenities[5], "True"], iron__in=[amenities[6], "True"],
                                                                workspace__in=[amenities[7], "True"], washer__in=[amenities[8], "True"],
                                                                dryer__in=[amenities[9], "True"], pool__in=[amenities[10], "True"],
                                                                free_parking__in=[amenities[11], "True"], crib__in=[amenities[12], "True"],
                                                                grill__in=[amenities[13], "True"], hot_tub__in=[amenities[14], "True"],
                                                                EV_charger__in=[amenities[15], "True"], gym__in=[amenities[16], "True"],
                                                                indoor_fireplace__in=[amenities[17], "True"], 
                                                                breakfast__in=[amenities[18], "True"], 
                                                                smoking_allowed__in=[amenities[19], "True"]).distinct()
    
        if "start_date" in data.keys() and "end_date" in data.keys() and len(PropertyRanges.objects.all()) != 0:
            start_date = parse_date(data['start_date'])
            end_date = parse_date(data['end_date'])
            if start_date != None and end_date != None:

                for property in filtered_properties:
                    ranges1 = PropertyRanges.objects.filter(property=property.pk, start_date__gte=start_date, end_date__lte=end_date)
                    ranges2 = PropertyRanges.objects.filter(property=property.pk, start_date__lte=start_date, end_date__gte=end_date)
                
                    if len(ranges1) == 0 and len(ranges2) == 0:
                        filtered_properties = filtered_properties.exclude(pk=property.pk)
        if order_by == "Name":
            filtered_properties = filtered_properties.order_by('address')

        if order_by == "Price":
            filtered_properties = filtered_properties.order_by('propertyranges__price')


        if order_by == "Both":
            filtered_properties = filtered_properties.order_by('address', 'propertyranges__price')

        if "property_type" in data.keys():
            filtered_properties = filtered_properties.filter(property_type=data["property_type"])

        if pk != None:
            filtered_properties = filtered_properties.filter(pk=pk)
        return filtered_properties
    
   

class DeleteProperty(DestroyAPIView):
    model = Property
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        property_pk = self.kwargs['pk']
        try:
            property_host_pk = Property.objects.filter(pk=property_pk)[0].host.pk
        except:
            return Response("No property exists with the given primary key", status=404)
        if property_host_pk != self.request.user.pk:
            return Response("This property does not belong to you", status=403)
        return super().delete(request)
    
    def get_queryset(self):
        property = Property.objects.filter(pk=self.kwargs['pk'])
        return property

class DeletePropertyRange(DestroyAPIView):
    model = PropertyRanges
    serializer_class = ListPropertyRangesSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        property_range = self.kwargs['pk']
        try:
            property_host_pk = PropertyRanges.objects.filter(pk=property_range)[0].property.host.pk
        except:
            return Response("No property range exists with this pk", status=404)
        if property_host_pk != self.request.user.pk:
            return Response("This property does not belong to you", status=401)
        return super().delete(request)
    
    def get_queryset(self):
        return PropertyRanges.objects.filter(pk=self.kwargs['pk'])
    
class MyListings(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PropertySerializer

    def get_queryset(self):
        return Property.objects.filter(host=self.request.user)
    