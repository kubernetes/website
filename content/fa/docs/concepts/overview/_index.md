---
reviewers:
- bgrant0607
- mikedanese
title: "نمای کلی"
description: >
  کوبرنتیز یک پلتفرم پرتابل٬ قابل توسعه و متن باز برای مدیریت حجم کار و سرویس های کانتینری است  که از دو پیکربندی اعلام شده و خودکار را آسان می کند. این پلتفرم یک اکوسیستم بزرگ و درحال رشد با سرعت بالا دارد. سرویس های کوبرنتیز٬ پشتیبانی٬ و ابزارهای آن به شکل گسترده در دسترس است.
content_type: مفهوم‌ها
weight: 20
card:
  name: concepts
  weight: 10
  anchors:
  - anchor: "#why-you-need-kubernetes-and-what-can-it-do"
    title: Why Kubernetes?
no_list: true
---

<!-- overview -->
این صفحه یک نمای کلی از کوبرنتیز است.


<!-- body -->

نام کوبرنتیز از ریشه یونانی٬ به معنی خلبان یا ناخدا است. K8s به عنوان مخفف حاصل شمارش ۸ حرف بین "K" و "s" ابتدا و انتهای Kubernetes است. گوگل پروژه کوبرنتیز را در سال ۲۰۱۴ متن باز کرد. کوبرنتیز حاصل [بیش از ۱۵ سال تجربه گوگل](/blog/2015/04/borg-predecessor-to-kubernetes/) در اجرای بارکاری محصولات در مقیاس بالا با ایده‌ها و عملکردهای بهترین-در-نوع-خود در جامعه است.

## چرا به کوبرنتیز نیاز دارید و چه‌کاری انجام می‌دهد؟ {#why-you-need-kubernetes-and-what-can-it-do}

کانتینر ها راه خوبی برای بسته بندی و اجرای اپلیکیشن‌های شما هستند. در یک محیط عملیاتی٬ شما نیاز  دارید تا کانتینر هایی که اپلیکیشن را اجرا می کنند٬ مدیریت کنید و مطمئن باشید هیچ زمان توقفی ندارد.
برای مثال٬ اگر یک کانتینر متوقف شود٬ یک کانتینر دیگر باید شروع به کار کند. اگر این کار توسط سیستم انجام شود٬ آسان‌تر نیست؟

اینجاست که کوبرنتیز برای نجات می‌آید! کوبرنتیز برای شما چارچوبی فراهم می کند که سیستم های توزیع شده را به صورت انعطاف پذیر مدیریت کنید. این ابزار مقیاس پذیری و تحمل خطا برنامه شما را پایش می‌کند٬ الگو های استقرار ارائه می کند و دیگر موارد. 
برای مثال: کوبرنتیز می تواند به سادگی یک انتشار تدریجی برای بروزرسانی برنامه شما فراهم کند.

کوبرنتیز موارد زیر را برای شما فراهم می کند:

* **پایش سرویس و توزیع بار**
  کوبرنتیز می‌تواند یک کانتینر را با استفاده از نام DNS یا استفاده از آدرس IP خودش نمایان کند.
  اگر ترافیک یک کانتیر زیاد است٬ کوبرنتیز قادر است ترافیک را توزیع و متعادل کند تا استقرار پایدار باشد.
* **ارکستراسیون فضای ذخیره سازی**
  کوبرنتیز به شما امکان می‌دهد تا به صورت خودکار فضای ذخیره سازی دلخواه٬ از جمله فضای داخلی٬ سرویس‌دهنده ابری و ... را متصل کنید.
* **رونمایی و عقبگرد خودکار**
  شما می‌توانید با استفاده از Kubernetes وضعیت مطلوب را برای کانتینرهای مستقر شده خود توصیف کنید و Kubernetes می‌تواند وضعیت واقعی را با سرعت کنترل شده به وضعیت مطلوب تغییر دهد.
  برای مثال٬ می‌توانید کوبرنتیز را خودکار کنید تا کانتینر های جدیدی برای استقرار شما ایجاد کند٬ کانتینر های موجود را حذف کند و تمام منابع آن‌ها را به کانتینر های جدید اختصاص دهد.
* **bin packing خودکار**
  شما به کوبرنتیز٬ کلاستری از نود ها را می‌دهید که می‌تواند برای انجام وظایف کانتینری شده از آن استفاده کند.
  شما میتوانید به کوبرنتیز بگویید چه میزان رم و CPU برای هر کانتینر نیاز است. کوبرنتیز می‌تواند کانتینر ها را برای بهترین مصرف منابع در نود های شما سامان‌دهی کند.
* **خود درمانی**
  کوبرنتیز کانتینر های خطا خورده را ری-استارت می کند٬ کانتینر ها را جایگزین می کند٬ کانتینر هایی که به بررسی سلامت تعریف شده توسط کاربر پاسخ نمی‌دهند از بین می‌برد٬ و آن‌ها را تا زمانی که آماده خدمات‌دهی نباشند٬ ارایه نمی‌کند.
* **مدیریت Secret و پیکربندی**
  کوبرنتیز به شما امکان می دهد اطلاعات حساس مانند رمزعبور٬ توکن های احراز هویت و کلید های SSH را ذخیره سازی و مدیریت کنید.
  شما می‌توانید Secret ها و پیکربندی برنامه را بدون بازسازی image آن و بدون افشای Secret در بسته های پیکربندی٬ مستقر و بروزرسانی کنید.
* **اجرای دسته‌ای**
  علاوه بر سرویس٬ کوبرنتیز قادر است تا در صورت تمایل بارکاری دسته‌ای و CI شما را مدیریت و کانتینرهای خطا دار را جایگزین کند.
* **مقیاس بندی افقی**
  مقیاس برنامه خودرا با یک دستور ساده٬ از طریق رابط کاربری٬ یا به صورت خودکار بر اساس مصرف CPU بالا و پایین ببرید.
* **IPv4/IPv6 dual-stack**
  اختصاص دادن آدرس IPv4 و IPv6 به پاد ها و سرویس ها.
* **طراحی شده برای توسعه‌پذیری**
  بدون نیاز به تغییر کد منبع٬ قابلیت های دلخواه خودرا به کلاستر کوبرنتیز اضافه کنید.

## کوبرنتیز چی نیست

کوبرنتیز یک سیستم PaaS (Platform as a Service) سنتی شامل-همه-چیز نیست.
از آن‌جایی که کوبرنتیز در سطح کانتینر و نه در سطح سخت‌افزار کار می کند٬ برخی ویژگی های عمومی و رایج در ارائه دهندگان PaaS مانند استقرار٬ مقیاس‌بندی٬ توزیع بار ارائه می‌دهد و کابران را قادر می‌سازد تا ثبت وقایع٬ مانیتورینگ و راهکار های هشداردهی را ادغام کنند. با این‌حال٬ کوبرنتیز یکپارچه نیست و این راه‌کار های پیش‌فرض اختیاری و قابل اتصال هستند.
کوبرنتیز بلوک های سازنده برای ساخت پلتفرم های توسعه‌دهندگان را فراهم می کند٬ اما در مواردی که مهم است٬ انتخاب و راحتی کاربر را حفظ می کند.

کوبرنتیز:

* انواع اپلیکیشن های پشتیبانی شده را محدود نمی‌کند. کوبرنتیز قصد دار تا از انواع بسیار متنوعی از بارهای کاری٬ از جمله باوضعیت (statefull)٬ بدون وضعیت(stateless)٬ و پردازش داده٬ پشتیبانی کند. اگر برنامه ای روی کانتینر اجرا شده٬ باید به خوبی روی کوبرنتیز اجرا شود.
* کد های منبع را مستقر نمی‌کند و برنامه شما را نمی‌سازد. فرآیند ادغام٬ همرسانی و استقرار مستمر (continous Itegration, Delivery, Deployment) توسط فرهنگ و ترجیحات سازمانی و همچنین نیازمندی های فنی تعیین می‌شود.
* خدمات سطح اپلیکیشن از جمله میان-افزار (برای مثال٬ گذرگاه پیام)٬ فریم ورک پردازش داده(برای مثال٬ Spark)٬ پایگاه داده (برای مثال٬ MySQL)٬ کش ها و نه حتی فضای ذخیره سازی کلاستری (برای مثال٬ Ceph) را به عنوان سرویس درونی ندارد. چنین اجزایی می‌توانند روی کوبرنتیز اجرا شوند٬ و/یا می توانند توسط برنامه های اجرا شده روی کوبرنتیز از طریق مکانیزم های قابل حمل مانند [Open Service Broker](https://openservicebrokerapi.org/) مورد استفاده باشند.
* راهکارهای ثبت وقایع٬ مانیتورینگ و هشدار را اجبار نمی‌کند. برخی یکپارچه سازی ها را برای نمایش مفهوم٬ و مکانیزم های دریافت متریک را ارایه می کند.
* ه یک زبان یا سیستم پیکربندی (مانند Jsonnet) ارائه می‌دهد و نه استفاده از آن را الزامی می‌کند. در عوض، یک API اعلامی (Declarative API) فراهم می‌کند که می‌تواند توسط هر نوع مشخصات اعلامی مورد استفاده قرار گیرد.
* هیچ سیستم پیکربندی٬ نگهداری٬ مدیریت یا خوددرسمانی را ارائه یا اتخاذ نمی‌کند.
* به علاوه٬ کوبرنتیز تنها یک سیستم ارکستراسیون نیست. در واقع٬  نیاز به ارکستراسیون را از بین می‌برد. تعریف فنی ارکستراسیون٬ اجرای یک جریان کاری تعریف شده است:
اول الف را انجام بده٬ آنگاه ب آنگاه ث. در مقابل٬ کوبرنتیز شامل تعدادی .
In contrast, Kubernetes comprises a set of independent, composable
  control processes that continuously drive the current state towards the provided desired state.
  It shouldn't matter how you get from A to C. Centralized control is also not required. This
  results in a system that is easier to use and more powerful, robust, resilient, and extensible.

## Historical context for Kubernetes {#going-back-in-time}

Let's take a look at why Kubernetes is so useful by going back in time.

![Deployment evolution](/images/docs/Container_Evolution.svg)

**Traditional deployment era:**

Early on, organizations ran applications on physical servers. There was no way to define
resource boundaries for applications in a physical server, and this caused resource
allocation issues. For example, if multiple applications run on a physical server, there
can be instances where one application would take up most of the resources, and as a result,
the other applications would underperform. A solution for this would be to run each application
on a different physical server. But this did not scale as resources were underutilized, and it
was expensive for organizations to maintain many physical servers.

**Virtualized deployment era:**

As a solution, virtualization was introduced. It allows you
to run multiple Virtual Machines (VMs) on a single physical server's CPU. Virtualization
allows applications to be isolated between VMs and provides a level of security as the
information of one application cannot be freely accessed by another application.

Virtualization allows better utilization of resources in a physical server and allows
better scalability because an application can be added or updated easily, reduces
hardware costs, and much more. With virtualization you can present a set of physical
resources as a cluster of disposable virtual machines.

Each VM is a full machine running all the components, including its own operating
system, on top of the virtualized hardware.

**Container deployment era:**

Containers are similar to VMs, but they have relaxed
isolation properties to share the Operating System (OS) among the applications.
Therefore, containers are considered lightweight. Similar to a VM, a container
has its own filesystem, share of CPU, memory, process space, and more. As they
are decoupled from the underlying infrastructure, they are portable across clouds
and OS distributions.

Containers have become popular because they provide extra benefits, such as:

* Agile application creation and deployment: increased ease and efficiency of
  container image creation compared to VM image use.
* Continuous development, integration, and deployment: provides for reliable
  and frequent container image build and deployment with quick and efficient
  rollbacks (due to image immutability).
* Dev and Ops separation of concerns: create application container images at
  build/release time rather than deployment time, thereby decoupling
  applications from infrastructure.
* Observability: not only surfaces OS-level information and metrics, but also
  application health and other signals.
* Environmental consistency across development, testing, and production: runs
  the same on a laptop as it does in the cloud.
* Cloud and OS distribution portability: runs on Ubuntu, RHEL, CoreOS, on-premises,
  on major public clouds, and anywhere else.
* Application-centric management: raises the level of abstraction from running an
  OS on virtual hardware to running an application on an OS using logical resources.
* Loosely coupled, distributed, elastic, liberated micro-services: applications are
  broken into smaller, independent pieces and can be deployed and managed dynamically –
  not a monolithic stack running on one big single-purpose machine.
* Resource isolation: predictable application performance.
* Resource utilization: high efficiency and density.


## {{% heading "whatsnext" %}}

* Take a look at the [Kubernetes Components](/docs/concepts/overview/components/)
* Take a look at the [The Kubernetes API](/docs/concepts/overview/kubernetes-api/)
* Take a look at the [Cluster Architecture](/docs/concepts/architecture/)
* Ready to [Get Started](/docs/setup/)?
