from rest_framework import serializers
from .models import User,Skill




class SkillNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ("name",)

class ProfileSerializer(serializers.ModelSerializer):
    skills = SkillNameSerializer(many=True,read_only=True)
    class Meta:
        model = User
        fields = (
                  "id",
                  "username",
                  'first_name',
                  "last_name",
                  'email',
                  'bio',
                  'profile_picture',
                  'skills',)
        
class AccountSerializer(serializers.ModelSerializer):
    skills = SkillNameSerializer(many=True,read_only=True)
    class Meta:
        model = User
        fields = ("username",
                  'first_name',
                  "last_name",
                  'email',
                  'bio',
                  'profile_picture',
                  'skills',)


class RegistersSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
    
    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({'password': "Passwords don't match."})
        return data
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password1']
        )
        user.is_active = True
        user.save()
        return user

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('name',)
