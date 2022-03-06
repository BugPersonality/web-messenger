from rest_framework import status
from rest_framework.response import Response


def auth(func):
    def wrapped(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return func(self, request, *args, **kwargs)
        else:
            return Response({'error': 'You are not logged in.'},
                            status=status.HTTP_401_UNAUTHORIZED)

    return wrapped
