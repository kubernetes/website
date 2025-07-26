---
title: "تکمیل خودکار PowerShell"
description: "برخی از تنظیمات اختیاری برای تکمیل خودکار powershell."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

اسکریپت تکمیل kubectl برای PowerShell را می‌توان با دستور `kubectl completion powershell` ایجاد کرد.

برای انجام این کار در تمام جلسات پوسته خود، خط زیر را به پرونده `$PROFILE` خود اضافه کنید:

```powershell
kubectl completion powershell | Out-String | Invoke-Expression
```

این دستور اسکریپت تکمیل خودکار را در هر بار راه‌اندازی PowerShell دوباره تولید می‌کند. همچنین می‌توانید اسکریپت تولید شده را مستقیماً به پرونده `$PROFILE` خود اضافه کنید.

برای افزودن اسکریپت تولید شده به پرونده «$PROFILE» خود، خط زیر را در فرمان powershell خود اجرا کنید:

```powershell
kubectl completion powershell >> $PROFILE
```

پس از بارگذاری مجدد پوسته، تکمیل خودکار kubectl باید کار کند.
