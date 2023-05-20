from django.shortcuts import render
from rest_framework.generics import CreateAPIView, UpdateAPIView, RetrieveAPIView
from .models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import UserSerializer, ViewUserSerializer

class Signup(CreateAPIView):
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)    


class EditProfile(UpdateAPIView):
    model = User
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = self.get_serializer(data=request.data, instance=user)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=200)    

    def get_queryset(self):
        return self.request.user

class ViewProfile(RetrieveAPIView):
    model = User
    serializer_class = ViewUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.request.user.username
        return User.objects.filter(username=user_id)[0]

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except (User.DoesNotExist, KeyError):
            return Response({"error": "Requested user does not exist"}, status=404)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
class ViewProfile(RetrieveAPIView):
    model = User
    serializer_class = ViewUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.request.user.username
        return User.objects.filter(username=user_id)[0]

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except (User.DoesNotExist, KeyError):
            return Response({"error": "Requested user does not exist"}, status=404)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
class GetProfile(RetrieveAPIView):
    model = User
    serializer_class = ViewUserSerializer

    def get_object(self):
        user_id = self.kwargs['id']
        return User.objects.filter(pk=user_id)[0]

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except (User.DoesNotExist, KeyError):
            return Response({"error": "Requested user does not exist"}, status=404)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


    