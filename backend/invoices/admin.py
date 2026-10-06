from django.contrib import admin
from .models import Invoice


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = [
        'invoice_number',
        'invoice_type',
        'customer_name',
        'customer_phone',
        'jalali_date',
        'karat',
        'weight',
        'price_per_gram',
        'wage',
        'is_demo',
        'total_price',
    ]
    list_filter = ['invoice_type','is_demo', 'karat', 'jalali_date']
    search_fields = ['invoice_number', 'customer_name', 'customer_phone']
    readonly_fields = ['invoice_number', 'created_at']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    actions=['delete_demo_invoices']
    
    @admin.action(description='پاک کردن فاکتور های دمو')
    def delete_demo_invoices(self,request,queryset):
        count =queryset.filter(is_demo=True).delete()
        self.message_user(request,f'{count}فاکتور دمو پاک شد')