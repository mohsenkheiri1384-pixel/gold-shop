from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('invoices', views.InvoiceViewSet, basename='invoice')

urlpatterns = [
    path('invoices/stats/', views.InvoiceViewSet.as_view({'get': 'stats'}), name='invoice-stats'),
] + router.urls