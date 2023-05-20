from rest_framework.serializers import ModelSerializer, ReadOnlyField, ValidationError
from .models import Comment, Notification

class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            'pk',
            'content_type',
            'object_id',
            'sender',
            'message',
            'reply_to',
            'reservation',
            'date']
        read_only_fields = ['pk', 'content_type', 'object_id', 'sender', 'reply_to', 'reservation', 'date']

class ListCommentPkSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            'pk']
        
class NotificationSerializer(ModelSerializer):
    
    class Meta:
        model = Notification
        fields = ['pk', 'user', 'message', 'read']
        read_only_fields = ['pk', 'user', 'message', 'read']
     