---
title: سرویس (Service)
id: service
full_link: /docs/concepts/services-networking/service/
short_description: >
  روشی برای نمایش یک برنامه‌ی در حال اجرا روی مجموعه‌ای از Podها به‌عنوان یک سرویس شبکه‌ای.
tags:
- fundamental
- core-object
---
روشی برای نمایش یک برنامه‌ی شبکه‌ای که به‌صورت یک یا چند
{{< glossary_tooltip text="Pod" term_id="pod" >}} در کلاستر شما در حال اجراست.

<!--more-->

مجموعه‌ی Podهایی که یک Service به آن‌ها اشاره می‌کند، (معمولاً) توسط یک
{{< glossary_tooltip text="selector" term_id="selector" >}} تعیین می‌شود. اگر Podهای بیشتری اضافه یا حذف شوند،
مجموعه‌ی Podهای منطبق با selector تغییر می‌کند. Service تضمین می‌کند که ترافیک شبکه
می‌تواند به مجموعه‌ی فعلی Podهای مربوط به آن workload هدایت شود.

سرویس‌های Kubernetes یا از شبکه‌ی IP (IPv4، IPv6، یا هر دو) استفاده می‌کنند، یا به یک نام خارجی در
سیستم نام دامنه (DNS) ارجاع می‌دهند.

انتزاع Service مکانیزم‌های دیگری مانند Ingress و Gateway را امکان‌پذیر می‌سازد.