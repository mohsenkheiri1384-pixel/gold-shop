from rest_framework import serializers
from .models import Invoice


class InvoiceSerializer(serializers.ModelSerializer):
    """نمایش فاکتور"""
    invoice_type_display = serializers.CharField(
        source='get_invoice_type_display',
        read_only=True
    )

    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'invoice_type', 'invoice_type_display',
            'customer_name', 'customer_phone', 'jalali_date',
            'karat', 'weight', 'price_per_gram', 'wage', 'total_price',
            'description','is_demo', 'created_at'
        ]
        read_only_fields = ['invoice_number','is_demo', 'created_at']


class InvoiceCreateSerializer(serializers.ModelSerializer):
    """ساخت فاکتور جدید"""
    class Meta:
        model = Invoice
        fields = [
            'invoice_type', 'customer_name', 'customer_phone',
            'jalali_date', 'karat', 'weight', 'price_per_gram',
            'wage', 'total_price', 'description'
        ]