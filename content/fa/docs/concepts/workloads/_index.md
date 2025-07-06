---
title: "بارکاری"
weight: 55
description: >
  پادها، کوچکترین شیء محاسباتی قابل استقرار در کوبرنتیز، و انتزاع‌های سطح بالاتری که به شما در اجرای آنها کمک می‌کنند را درک کنید.
no_list: true
card:
  title: بارکاری و پادها
  name: concepts
  weight: 60
---

{{< glossary_definition term_id="workload" length="short" >}}
چه وظیفهٔ شما یک مؤلفهٔ واحد باشد یا چندین مؤلفه که با هم کار می‌کنند، در کوبرنتیز آن را
درون مجموعه‌ای از [_Pods_](/docs/concepts/workloads/pods) اجرا می‌کنید.
در کوبرنتیز، یک Pod نمایانگر مجموعه‌ای از
{{< glossary_tooltip text="Containers" term_id="container" >}}
در حال اجرا روی کلاستر شماست.

Pods در کوبرنتیز یک [چرخهٔ عمر تعریف‌شده](/docs/concepts/workloads/pods/pod-lifecycle/) دارند.
برای مثال، وقتی یک Pod در کلاستر شما در حال اجراست، یک خطای بحرانی در
{{< glossary_tooltip text="Node" term_id="node" >}}
که آن Pod روی آن اجرا می‌شود، به معنای از کار افتادن همهٔ Podهای آن Node است.
کوبرنتیز این سطح از خطا را نهایی در نظر می‌گیرد: برای بازیابی باید یک Pod جدید ایجاد کنید،
حتی اگر آن Node بعداً سالم شود.

با این حال، برای ساده‌تر شدن کار، نیازی نیست هر Pod را مستقیماً مدیریت کنید.
در عوض می‌توانید از _Workload resources_ استفاده کنید که مجموعه‌ای از Pods را به نمایندگی از شما مدیریت می‌کنند.
این منابع {{< glossary_tooltip term_id="controller" text="Controllers" >}}
را پیکربندی می‌کنند تا مطمئن شوند تعداد مناسب و نوع صحیح Pod در حال اجرا باشد،
مطابق با حالتی که شما مشخص کرده‌اید.

کوبرنتیز چند منبع پیش‌فرض برای Workload فراهم می‌کند:

* [Deployment](/docs/concepts/workloads/controllers/deployment/) و [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)  
  (جایگزین منبع قدیمی  
  {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}).  
  Deployment برای مدیریت یک بار کاری بدون وضعیت (stateless) در کلاستر شما مناسب است،  
  جایی که هر Pod در این Deployment قابل تعویض بوده و در صورت لزوم می‌توان آن را جایگزین کرد.

* [StatefulSet](/docs/concepts/workloads/controllers/statefulset/)  
  به شما اجازه می‌دهد یک یا چند Pod مرتبط که به نوعی وضعیت (state) را دنبال می‌کنند، اجرا کنید.  
  برای مثال، اگر بار کاری شما داده‌ها را به‌صورت مداوم ثبت می‌کند، می‌توانید یک StatefulSet  
  اجرا کنید که هر Pod را به یک  
  [PersistentVolume](/docs/concepts/storage/persistent-volumes/)  
  اختصاص دهد. کد شما، که در Pods متعلق به آن StatefulSet اجرا می‌شود، می‌تواند داده‌ها را  
  بین سایر Pods در همان StatefulSet تکرار کند تا مقاومت کلی افزایش یابد.

* [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)  
  Pods‌ای را تعریف می‌کند که خدمات محلی (local) به هر Node ارائه می‌دهند.  
  هر بار که یک Node جدید به کلاستر شما اضافه شود و با مشخصات یک DaemonSet مطابقت داشته باشد،  
  کنترل‌پلن یک Pod از آن DaemonSet را روی Node جدید زمان‌بندی می‌کند.  
  هر Pod در یک DaemonSet کاری شبیه یک سرویس سیستم (system daemon) در سرورهای کلاسیک Unix/POSIX انجام می‌دهد.  
  یک DaemonSet ممکن است برای عملکرد کلاستر شما اساسی باشد، مانند افزونه‌ای برای اجرای  
  [شبکه‌بندی کلاستر](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)،  
  یا ممکن است به مدیریت Node کمک کند، یا رفتاری اختیاری فراهم کند که پلتفرم کانتینری شما را بهبود دهد.

* [Job](/docs/concepts/workloads/controllers/job/) و  
  [CronJob](/docs/concepts/workloads/controllers/cron-jobs/)  
  روش‌های متفاوتی برای تعریف وظایفی فراهم می‌کنند که تا پایان اجرا شده و سپس متوقف می‌شوند.  
  می‌توانید از [Job](/docs/concepts/workloads/controllers/job/)  
  برای تعریف یک وظیفه که یک بار و تا پایان اجرا شود استفاده کنید.  
  می‌توانید از [CronJob](/docs/concepts/workloads/controllers/cron-jobs/)  
  برای اجرای مکرر همان Job طبق یک زمان‌بندی مشخص استفاده کنید.

در اکوسیستم گسترده‌تر کوبرنتیز، می‌توانید منابع workload شخص ثالث را بیابید که رفتارهای اضافی ارائه می‌دهند.  
با استفاده از یک  
[Custom Resource Definition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)،  
می‌توانید منبع workload شخص ثالثی اضافه کنید اگر به رفتار خاصی نیاز دارید که در هسته کوبرنتیز موجود نیست.  
برای مثال، اگر می‌خواستید گروهی از Pods را برای برنامه‌تان اجرا کنید اما کار را تا زمانی که _همه_ Pods در دسترس نباشند متوقف کنید  
(شاید برای بعضی کارهای توزیع‌شده با توان بالا)،  
می‌توانید افزونه‌ای پیاده‌سازی یا نصب کنید که آن ویژگی را فراهم آورد.  

## {{% heading "whatsnext" %}}

هم‌چنین علاوه بر مطالعه هر نوع API برای مدیریت Workload، می‌توانید یاد بگیرید چگونه کارهای خاص را انجام دهید:

* [اجرای یک برنامه بدون وضعیت با استفاده از Deployment](/docs/tasks/run-application/run-stateless-application-deployment/)  
* اجرای یک برنامه با وضعیت به‌صورت [یک نمونهٔ واحد](/docs/tasks/run-application/run-single-instance-stateful-application/)  
  یا به‌صورت [مجموعهٔ تکرارشده](/docs/tasks/run-application/run-replicated-stateful-application/)  
* [اجرای وظایف خودکار با CronJob](/docs/tasks/job/automated-tasks-with-cron-jobs/)

برای آشنایی با مکانیزم‌های کوبرنتیز برای جدا کردن کد از پیکربندی، به [Configuration](/docs/concepts/configuration/) مراجعه کنید.

دو مفهوم پشتیبان وجود دارند که زمینهٔ نحوهٔ مدیریت Pods برای برنامه‌ها توسط کوبرنتیز را توضیح می‌دهند:
* [Garbage collection](/docs/concepts/architecture/garbage-collection/) اشیاء را پس از حذف _منبع مالک_ آن‌ها از بین می‌برد.  
* [_time-to-live after finished_ controller](/docs/concepts/workloads/controllers/ttlafterfinished/)  
  پس از گذشت زمان مشخصی از تکمیل Jobs، آن‌ها را حذف می‌کند.

پس از اجرای برنامهٔ شما، ممکن است بخواهید آن را به‌صورت یک [Service](/docs/concepts/services-networking/service/)  
در اینترنت در دسترس قرار دهید یا برای برنامه‌های وب فقط با استفاده از یک [Ingress](/docs/concepts/services-networking/ingress/) منتشر کنید.  

