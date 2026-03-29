---
title: kOps (عملیات‌های کوبرنتیز)
id: kops
date: 2018-04-12
full_link: /docs/setup/production-environment/kops/
short_description: >
  kOps نه‌تنها به شما در ایجاد، حذف، ارتقا و نگه‌داری کلاستر کوبرنتیز در سطح تولید و با دسترس‌پذیری بالا کمک می‌کند، بلکه زیرساخت ابری لازم را نیز فراهم می‌سازد.
aka: 
tags:
- tool
- operation
---

`kOps` نه‌تنها به شما در ایجاد، حذف، ارتقا و نگه‌داری کلاستر کوبرنتیز در سطح تولید و با دسترس‌پذیری بالا کمک می‌کند، بلکه زیرساخت ابری لازم را نیز فراهم می‌سازد.

<!--more--> 

{{< note >}}
در حال حاضر AWS (Amazon Web Services) به‌صورت رسمی پشتیبانی می‌شود؛ DigitalOcean، GCE و OpenStack در مرحله‌ی بتا و Azure در مرحله‌ی آلفا هستند.
{{< /note >}}

`kOps` یک سامانه تهیه‌سازی خودکار (provisioning) است:
  * نصب کاملا خودکار
  * استفاده از DNS برای شناسایی کلاسترها
  * خودترمیمی: همه‌چیز در Auto Scaling Group‌ها اجرا می‌شود
  * پشتیبانی از چندین سیستم‌عامل (Amazon Linux، Debian، Flatcar، RHEL، Rocky و Ubuntu)
  * پشتیبانی از دسترس‌پذیری بالا (High-Availability)
  * امکان تهیه‌سازی مستقیم یا تولید مانیفست‌های Terraform
