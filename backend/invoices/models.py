from django.db import models


class Invoice(models.Model):
    """فاکتور خرید یا فروش"""
    INVOICE_TYPES = [
        ('buy', 'خرید'),
        ('sell', 'فروش'),
    ]

    # ═══ خودکار ═══
    invoice_number = models.CharField(
        max_length=20,
        unique=True,
        verbose_name="شماره فاکتور"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="زمان ثبت در سیستم"
    )

    # ═══ دستی ═══
    invoice_type = models.CharField(
        max_length=10,
        choices=INVOICE_TYPES,
        verbose_name="نوع فاکتور"
    )
    customer_name = models.CharField(
        max_length=100,
        verbose_name="نام مشتری"
    )
    customer_phone = models.CharField(
        max_length=20,
        verbose_name="شماره تماس"
    )
    jalali_date = models.CharField(
        max_length=10,
        verbose_name="تاریخ معامله (شمسی)"
    )
    karat = models.IntegerField(
        verbose_name="عیار"
    )
    weight = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        verbose_name="وزن (گرم)"
    )
    price_per_gram = models.DecimalField(
        max_digits=15,
        decimal_places=0,
        verbose_name="قیمت هر گرم طلا در زمان معامله"
    )
    wage = models.DecimalField(
        max_digits=15,
        decimal_places=0,
        default=0,
        verbose_name="اجرت"
    )
    total_price = models.DecimalField(
        max_digits=15,
        decimal_places=0,
        verbose_name="قیمت انجام شده معامله"
    )
    description = models.TextField(
        blank=True,
        verbose_name="توضیحات"
    )

    # ═══ جدید: حالت دمو ═══
    is_demo = models.BooleanField(
        default=False,
        verbose_name="حالت دمو",
    )

    class Meta:
        verbose_name = "فاکتور"
        verbose_name_plural = "فاکتورها"
        ordering = ['-created_at']

    def str(self):
        return f"{self.invoice_number} — {self.customer_name}"

    def save(self, *args, **kwargs):
        # ⭐ این خط مهمه: اگه شماره نداشت، بساز
        if not self.invoice_number:
            self.invoice_number = self.generate_invoice_number()
        super().save(*args, **kwargs)

    def generate_invoice_number(self):
        """شماره فاکتور یکتا"""
        import jdatetime
        year = jdatetime.datetime.now().year

        if self.is_demo:
            # دمو
            last = Invoice.objects.filter(
                invoice_number__startswith='DEMO-'
            ).order_by('-id').first()

            if last:
                try:
                    last_num = int(last.invoice_number.split('-')[1])
                    new_num = last_num + 1
                except (IndexError, ValueError):
                    new_num = 1
            else:
                new_num = 1

            return f"DEMO-{new_num:04d}"

        else:
            # واقعی
            last = Invoice.objects.filter(
                invoice_number__startswith=f'{year}-'
            ).order_by('-id').first()

            if last:
                try:
                    last_num = int(last.invoice_number.split('-')[1])
                    new_num = last_num + 1
                except (IndexError, ValueError):
                    new_num = 1
            else:
                new_num = 1

            return f"{year}-{new_num:04d}"