from django.db.models import F, Q
from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView, DestroyAPIView
from rest_framework.views import APIView
from .serializers import CommentSerializer, NotificationSerializer, ListCommentPkSerializer
from .models import Comment, Notification
from accounts.models import User
from reservations.models import Reservation
from properties.models import Property, PropertyRanges
from rest_framework.decorators import action
from rest_framework import viewsets
from .paginators import CommentPagination, NotificationPagination
import datetime
from django.shortcuts import redirect  
from django.contrib.contenttypes.models import ContentType


class PropertyComments(ListAPIView):
    serializer_class = CommentSerializer
    pagination_class = CommentPagination

    def get_queryset(self):
        # # try:
        # #     property = Property.objects.get(pk=self.kwargs['pk'])
        # # except Property.DoesNotExist:
        # #     return []
        
        # contenttype_obj = ContentType.objects.get(model='property')
        # print(self.kwargs['pk'])
        # return Comment.objects.filter(content_type=contenttype_obj, 
        #                               object_id=self.kwargs['pk'])
        # Get the property object
        property_obj = Property.objects.get(pk=self.kwargs['pk'])
        
        # Get the content type object for the Property model
        contenttype_obj = ContentType.objects.get_for_model(Property)
        
        # Get all comments related to the property
        comments = Comment.objects.filter(content_type=contenttype_obj, object_id=property_obj.id)
        
        new_comments = []
        for comment in comments:
            if comment.reply_to is None:
                new_comments.append(comment)
            else:
                for i, new_comment in enumerate(new_comments):
                    if new_comment.pk == comment.reply_to.pk:
                        new_comments.insert(i+1, comment)
                        break
        return new_comments
    
class UserComments(ListAPIView):
    serializer_class = CommentSerializer
    pagination_class = CommentPagination

    def get_queryset(self):
        # try:
        #     property = Property.objects.get(pk=self.kwargs['pk'])
        # except Property.DoesNotExist:
        #     return []
        
        contenttype_obj = ContentType.objects.get(model='user')
        print(self.kwargs['pk'])
        comments = Comment.objects.filter(content_type=contenttype_obj, 
                                      object_id=self.kwargs['pk'])
        new_comments = []
        for comment in comments:
            if comment.reply_to is None:
                new_comments.append(comment)
            else:
                for i, new_comment in enumerate(new_comments):
                    if new_comment.pk == comment.reply_to.pk:
                        new_comments.insert(i+1, comment)
                        break
        return new_comments

class CreatePropertyComment(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Validation
        # Check that the reservation exists
        try:
            reservation = Reservation.objects.get(pk=self.kwargs['pk'])
        except Reservation.DoesNotExist:
            return Response("Reservation " + str(self.kwargs['pk']) + " does not exist", status=404)

        # Check that the user making the comment is authorized
        if request.user != reservation.guest:
            return Response("You are not the guest of this reservation", status=403)
        
        # Check that a comment has not already been left by this user
        if Comment.objects.filter(reservation=reservation, sender=request.user, reply_to=None).exists():
            return Response("You have already commented on this property for this reservation", status=403)
        
        # Check to make sure that the reservation is complete
        if reservation.status != "Completed":
            return Response("You can only comment once you have completed your stay", status=403)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
    
    def perform_create(self, serializer):
        reservation = Reservation.objects.get(pk=self.kwargs['pk'])
        sender = self.request.user
        content_type = ContentType.objects.get(model='property')
        object_id = reservation.property.pk

         # send notification to host
        message = "A guest left a comment on your property." 
        Notification(user=reservation.host, message=message).save()

        serializer.save(content_type=content_type, object_id=object_id, sender=sender, reservation=reservation)

class CreatePropertyReply(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Validation
        # Check that this message being replied to exists
        try:
            comment = Comment.objects.get(pk=self.kwargs['pk'])
        except Comment.DoesNotExist:
            return Response("Comment " + str(self.kwargs['pk']) + " does not exist", status=404)
        
        reservation = comment.reservation

        # Make sure they don't reply to themselves
        if comment.sender == request.user:
            return Response("You cannot reply to your own comment", status=403)

        content_type = ContentType.objects.get(model='property')
        # Check to make sure the comment replied to is a property comment
        if comment.content_type != content_type:
            return Response("This is not a property comment, you cannot reply with this url", status=400)

        if request.user == reservation.host:
            # Check that a reply has not already been made by the host
            if Comment.objects.filter(content_type=content_type, reservation=reservation, sender=request.user).exists():
                return Response("You have already replied to the user", status=403)
        elif request.user == reservation.guest:
            # then it is a guest replying to the host comment
            # Make sure that they have not already made a reply to the host
            if Comment.objects.filter(content_type=content_type, reservation=reservation, sender=request.user, reply_to=comment).exists():
                return Response("You have already replied on the property to the host", status=403)
            # Make sure that this comment is by the host
            if comment.sender != reservation.host:
                return Response("The comment you are replying to is not made by the host", status=400)
        else:
            return Response("You are not a guest or host of this reservation", status=403)

        self.perform_create(serializer, comment)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
    
    def perform_create(self, serializer, comment):
        reply_to = comment
        reservation = reply_to.reservation
        sender = self.request.user
        content_type = ContentType.objects.get(model='property')
        object_id = reservation.property.pk

        if sender != reservation.host:
         # send notification to host about the new reservation
            message = "A guest replied to you on your property." 
            Notification(user=reservation.host, message=message).save()

        serializer.save(content_type=content_type, object_id=object_id, sender=sender, reservation=reservation, reply_to=reply_to)
    

class CreateUserComment(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Validation
        # Check that the reservation exists
        try:
            reservation = Reservation.objects.get(pk=self.kwargs['pk'])
        except Reservation.DoesNotExist:
            return Response("Reservation " + str(self.kwargs['pk']) + " does not exist", status=404)

        # Check that the user making the comment is authorized
        if request.user != reservation.host:
            return Response("You are not the host of this reservation", status=403)
        
        # Check that a comment has not already been left by this user
        if Comment.objects.filter(reservation=reservation, sender=request.user, reply_to=None).exists():
            return Response("You have already commented on this user for this reservation", status=403)
        
        # Check to make sure that the reservation is complete
        if reservation.status != "Completed":
            return Response("You can only comment once the reservation is complete", status=403)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
    
    def perform_create(self, serializer):
        reservation = Reservation.objects.get(pk=self.kwargs['pk'])
        sender = self.request.user
        content_type = ContentType.objects.get(model='user')
        object_id = reservation.guest.pk

        serializer.save(content_type=content_type, object_id=object_id, sender=sender, reservation=reservation)

class CreateUserReply(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Validation
        # Check that this message being replied to exists
        try:
            comment = Comment.objects.get(pk=self.kwargs['pk'])
        except Comment.DoesNotExist:
            return Response("Comment " + str(self.kwargs['pk']) + " does not exist", status=404)
        
        reservation = comment.reservation

        # Make sure they don't reply to themselves
        if comment.sender == request.user:
            return Response("You cannot reply to your own comment", status=403)

        content_type = ContentType.objects.get(model='user')
        # Check to make sure the comment replied to is a property comment
        if comment.content_type != content_type:
            return Response("This is not a user comment, you cannot reply with this url", status=400)
        
        if request.user == reservation.guest:
            # then it is a guest replying to the host comment
            # Make sure that they have not already made a reply to the host
            if Comment.objects.filter(content_type=content_type, reservation=reservation, sender=request.user, reply_to=comment).exists():
                return Response("You have already replied to this host for this reservation", status=403)
        else:
            return Response("You are not the user this comment is for", status=403)

        self.perform_create(serializer, comment)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
    
    def perform_create(self, serializer, comment):
        reply_to = comment
        reservation = reply_to.reservation
        sender = self.request.user
        content_type = ContentType.objects.get(model='user')
        object_id = reservation.guest.pk

        serializer.save(content_type=content_type, object_id=object_id, sender=sender, reservation=reservation, reply_to=reply_to)


class UserNotifications(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    pagination_class = NotificationPagination

    def get_queryset(self):
        if "read" in self.request.query_params:
            read = self.request.query_params.get("read")
            return Notification.objects.filter(user=self.request.user, read=read).order_by('pk')
        return Notification.objects.filter(user=self.request.user).order_by('pk')


class ReadNotifications(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()

    def get(self, request, *args, **kwargs):
        pk = self.kwargs["pk"]
        notification = Notification.objects.get(pk=pk)
        notification.read = True
        notification.save()
        return super().get(request, *args, **kwargs)
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class DeleteNotification(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    def preform_destroy(self, instance):
        return instance.delete()
    
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)
        # return redirect('social:notifications')


class ClearNotifications(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        notifications = self.get_queryset()
        notifications.delete()
        return redirect('social:notifications')

    def get_queryset(self):
        if "read" in self.request.query_params:
            read = self.request.query_params.get("read")
            return Notification.objects.filter(user=self.request.user, read=read)
        return Notification.objects.filter(user=self.request.user)
    
class NoRepliesList(ListAPIView):
    serializer_class = ListCommentPkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        type_obj = self.kwargs['type']
        target_obj = self.kwargs['pk']
        max_count = 0
        curr_user = self.request.user
        if type_obj == "property":
            # Get the content type object for the Property model
            contenttype_obj = ContentType.objects.get_for_model(Property)
            max_count = 3
        else:
            max_count = 2
            # Get the content type object for the Property model
            contenttype_obj = ContentType.objects.get_for_model(User)
        
        # Get all comments related to the property
        comments = Comment.objects.filter(content_type=contenttype_obj, object_id=target_obj)
        
        noreps= []
        for comment in comments:
            res = comment.reservation
            comments_under_res = comments.filter(reservation=res)
            replies = comments.filter(reply_to=comment.pk)
            print(replies)
            if not replies and comments_under_res.count() < max_count:
                if comment.reservation.guest == curr_user or comment.reservation.host == curr_user:
                    if comment.sender != curr_user:
                        noreps.append(comment.pk)
        return noreps
    
    def get(self, request, *args, **kwargs):
        return Response(self.get_queryset())
