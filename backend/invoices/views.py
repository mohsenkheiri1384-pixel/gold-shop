from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Sum
from django.utils import timezone

from .models import Invoice
from .serializers import InvoiceSerializer, InvoiceCreateSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    """CRUD فاکتورها"""
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['invoice_type', 'karat']
    search_fields = ['invoice_number', 'customer_name', 'customer_phone']
    ordering_fields = ['created_at', 'total_price', 'weight']
    
    def get_permissions(self):
        if self.action in ['list','retrieve','stats','create','update','destroy']:
            return [AllowAny()]
        if self.action == 'clear_demo':
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user=self.request.user
        queryset = Invoice.objects.all()
        if not user.is_authenticated:
            queryset=queryset.filter(is_demo=True)
        elif not user.is_staff:
            queryset=queryset.filter(is_demo=True)
        invoice_type = self.request.query_params.get('type')
        if invoice_type in ['buy', 'sell']:
            queryset = queryset.filter(invoice_type=invoice_type)
        return queryset.order_by('-created_at')
    def perform_create(self,serializer):
        user = self.request.user
        if not user.is_authenticated or not user.is_staff:
            serializer.save(is_demo=True)
        else:
            serializer.save(is_demo=False)

    def create(self, request, *args, **kwargs):
        serializer = InvoiceCreateSerializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(
                InvoiceSerializer(serializer.instance).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        today = timezone.now().date()
        today_invoices = Invoice.objects.filter(created_at__date=today)

        total_buy = Invoice.objects.filter(invoice_type='buy').aggregate(
            Sum('total_price')
        )['total_price__sum'] or 0

        total_sell = Invoice.objects.filter(invoice_type='sell').aggregate(
            Sum('total_price')
        )['total_price__sum'] or 0

        return Response({
            'total_invoices': Invoice.objects.count(),
            'today_invoices': today_invoices.count(),
            'total_buy': total_buy,
            'total_sell': total_sell,
        })
    
    @action(detail=False,methods=['delete'],permission_classes=[IsAdminUser])
    def clear_demo(self,request):
        count,_=Invoice.objects.filter(is_demo=True).delete()
        return Response({
            'message': f'{count}فاکتور دمو پاک شد',
            'deleted_count':count
        })