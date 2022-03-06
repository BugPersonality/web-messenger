from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer


class RegisterAPIView(APIView):
    serializer_class = UserSerializer

    def post(self, request):
        try:
            data = request.data
            serializer = self.serializer_class(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            response = Response({'id': serializer.data.get("id", None)},
                                status=status.HTTP_201_CREATED)
        except ValidationError as e:
            response = Response({'error': e}, status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            response = Response({key: ["This field is required."] for key in e.args},
                                status=status.HTTP_400_BAD_REQUEST)
        return response


class LoginAPIView(APIView):

    def post(self, request):
        try:
            data = request.data
            user = authenticate(email=data['email'], password=data['password'])
            if user is not None:
                login(request, user)
                response = Response(status=status.HTTP_200_OK)
            else:
                response = Response({'error': 'Wrong email or password.'},
                                    status=status.HTTP_400_BAD_REQUEST)
        except KeyError as e:
            response = Response({key: ["This field is required."] for key in e.args},
                                status=status.HTTP_400_BAD_REQUEST)
        return response


class LogoutAPIView(APIView):

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)
