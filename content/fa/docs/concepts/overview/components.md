---
reviewers:
- xirehat
title: اجزای کوبرنتیز
content_type: concept
description: >
  مروری بر اجزای کلیدی که یک خوشه کوبرنتیز را تشکیل می‌دهند.
weight: 10
card:
  title: اجزای یک خوشه
  name: concepts
  weight: 20
---

<!-- overview -->

این صفحه نمایی سطح‌بالا از اجزای اساسی که یک خوشه کوبرنتیز را تشکیل می‌دهند ارائه می‌کند.

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="اجزای کوبرنتیز" caption="اجزای یک خوشه کوبرنتیز" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

## اجزای اصلی

یک خوشه کوبرنتیز از یک کنترل‌پلن و یک یا چند نود کاری تشکیل شده است.  
در ادامه، مرور کوتاهی بر اجزای اصلی داریم:

### اجزای control plane

وضعیت کلی خوشه را مدیریت می‌کنند:

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)  
: مولفه سروریِ اصلی که رابط HTTP کوبرنتیز را در دسترس قرار می‌دهد.

[etcd](/docs/concepts/architecture/#etcd)  
: یک مخزن کلید-مقدار سازگار و در دسترس‌بالا برای تمام داده‌های سرور API.

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)  
: پادهایی را که هنوز به نودی تخصیص نیافته‌اند جست‌وجو کرده و هر پاد را به نود مناسب می‌سپارد.

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)  
: {{< glossary_tooltip text="controllers" term_id="controller" >}} را برای پیاده‌سازی رفتار API کوبرنتیز اجرا می‌کند.

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (اختیاری)  
: با ارائه‌دهنده(های) ابری زیرساخت ادغام می‌شود.

### اجزای گره

روی هر نود اجرا می‌شوند، پادهای در حال اجرا را نگه می‌دارند و محیط اجرایی کوبرنتیز را فراهم می‌کنند:

[kubelet](/docs/concepts/architecture/#kubelet)  
: اطمینان حاصل می‌کند که پادها (و کانتینرهای‌شان) در حال اجرا هستند.

[kube-proxy](/docs/concepts/architecture/#kube-proxy) (اختیاری)  
: قواعد شبکه را روی نودها نگه می‌دارد تا {{< glossary_tooltip text="Services" term_id="service" >}} را پیاده‌سازی کند.

[Container runtime](/docs/concepts/architecture/#container-runtime)  
: نرم‌افزاری که مسئول اجرای کانتینرهاست. برای اطلاعات بیشتر  
  [زمان‌های اجرای کانتینر](/docs/setup/production-environment/container-runtimes/) را مطالعه کنید.

{{% thirdparty-content single="true" %}}

خوشه شما ممکن است به نرم‌افزارهای اضافی روی هر نود نیاز داشته باشد؛ به‌عنوان مثال، ممکن است روی یک نود لینوکسی  
[systemd](https://systemd.io/) را برای نظارت بر اجزای محلی اجرا کنید.

## افزونه‌ها

افزونه‌ها قابلیت‌های کوبرنتیز را گسترش می‌دهند. چند نمونه مهم عبارت‌اند از:

[DNS](/docs/concepts/architecture/#dns)  
: برای حل نام DNS در سراسر خوشه.

[رابط وب](/docs/concepts/architecture/#web-ui-dashboard) (داشبورد)  
: برای مدیریت خوشه از طریق رابط وب.

[پایش منابع کانتینر](/docs/concepts/architecture/#container-resource-monitoring)  
: برای جمع‌آوری و ذخیره داده‌های متریک کانتینرها.

[لاگ‌گیری در سطح خوشه](/docs/concepts/architecture/#cluster-level-logging)  
: برای ذخیره لاگ‌های کانتینرها در یک مخزن لاگ مرکزی.

## انعطاف در معماری

کوبرنتیز در چگونگی استقرار و مدیریت این اجزا انعطاف‌پذیر است.  
این معماری می‌تواند با نیازهای گوناگون — از محیط‌های توسعه کوچک تا استقرارهای تولیدی در مقیاس بزرگ — تطبیق یابد.

برای اطلاعات جزئی‌تر درباره هر جزء و روش‌های مختلف پیکربندی معماری خوشه،  
به صفحه [معماری خوشه](/docs/concepts/architecture/) مراجعه کنید.
