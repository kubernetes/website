---
reviewers:
- lavalamp
title: اجزای کوبرنتیز
content_type: مفهوم‌ها
description: >
  دیدکلی از اجزای تشکیل دهنده یک کلاستر کوبرنتیز.
weight: 10
card:
  title: اجزای کلاستر
  name: مفهوم‌ها
  weight: 20
---

<!-- overview -->

این صفحه یک مرور کلی سطح بالا از اجزای اساسی تشکیل دهنده یک کلاستر کوبرنتیز ارائه می‌دهد.

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Components of Kubernetes" caption="اجزای کلاستر کوبرنتیز" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

## اجزای اصلی

یک کلاستر کوبرنتیز از یک کنترل‌گر (control plane) و یک یا چند نود کارگر (worker node) تشکیل شده است.
نمای کلی مختصری از اجزای اصلی:

### اجزای Control Plane

مدیریت وضعیت کلی کلاستر:

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
: جز اصلی سرور که API HTTP کوبرنتیز را در معرض نمایش قرار می‌دهد. 

[etcd](/docs/concepts/architecture/#etcd)
: ذخیره‌ساز کلید-مقدار سازگار و با دسترسی بالا برای تمام داده‌های سرور API.

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: به دنبال پادهایی می‌گردد که هنوز به نودی متصل نشده‌اند و هر پاد را به یک گره مناسب اختصاص می‌دهد.

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: {{< glossary_tooltip text="controllers" term_id="controller" >}} را برای اجرای رفتار های API کوبرنتیز اجرا می‌کند.

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (اختیاری)
: با ارائه‌دهنده(های) ابریِ زیربنایی ادغام می‌شود.

### اجزای Node

روی هر نود اجرا می‌شود، پادهای در حال اجرا را حفظ می‌کند و محیط اجرایی کوبرنتیز را فراهم می‌کند:

[kubelet](/docs/concepts/architecture/#kubelet)
: مطمئن می‌شود پاد ها و کانتینرهای آن‌ها اجرا می‌شوند.

[kube-proxy](/docs/concepts/architecture/#kube-proxy) (اختیاری)
: قوانین شبکه را روی نودها برای پیاده‌سازی . {{< glossary_tooltip text="سرویس‌ها" term_id="service" >}} حفظ می‌کند.

[Container runtime](/docs/concepts/architecture/#container-runtime)
: نرم افزار مسئول اجرای کانتینر. برای اطلاعات بیش‌تر٬ 
  [Container Runtimes](/docs/setup/production-environment/container-runtimes/) را بخوانید.

{{% thirdparty-content single="true" %}}

کلاستر شما ممکن است نرم افزارهای بیش تری روی هر نود نیاز داشته باشد. برای مثال٬ شاید شما به 
 [systemd](https://systemd.io/) نیز روی یک نود لینوکسی برای سرپرستی اجزای لوکال نیاز داشته باشید.

## افزونه ها

افزونه‌ها عملکرد کوبرنتیز را بهبود می‌دهند. چند نمونه مهم شامل:

[DNS](/docs/concepts/architecture/#dns)
: برای تبدیل‌های DNS در سطح کلاستر.

[Web UI](/docs/concepts/architecture/#web-ui-dashboard) (Dashboard)
: برای مدیریت کلاستر با رابط کاربری وب.

[Container Resource Monitoring](/docs/concepts/architecture/#container-resource-monitoring)
: برای دریافت و ذخیره متریک های کانتینر.

[Cluster-level Logging](/docs/concepts/architecture/#cluster-level-logging)
: برای ذخیره لاگ‌های کانتینر در یک ذخیره ساز مرکزی.

## انعطاف در معماری

کوبرنتیز اجازه انعطاف در پیاده سازی و مدیریت این اجزا را می‌دهد.
معماری ممکن است بر اساس نیاز های متفاوت٬ متغیر باشد٬ از محیط توسعه کوچک تا 
پیاده سازی محصول با مقیاس بالا.

برای اطلاعات دقیق تر درباره هر جز و راه های پیکربندی معماری کلاستر خود٬ صفحه [معماری کلاستر](/docs/concepts/architecture/) را ببنید.