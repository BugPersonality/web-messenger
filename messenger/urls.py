from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('api/', include('pages.urls')),
    path('api/', include('msgs.urls')),
    path('api/', include('authentication.urls')),
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
    path('dialogs/', TemplateView.as_view(template_name='message.html'), name='messages'),
    path('dialogs/<int:dialog>/', TemplateView.as_view(template_name='message.html'), name='message_dialog'),
    path('<int:page>/', TemplateView.as_view(template_name='index.html')),
    path('login/', TemplateView.as_view(template_name='login.html'), name='login'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
