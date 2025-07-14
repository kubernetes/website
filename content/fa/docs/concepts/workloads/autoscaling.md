---
title: مقیاس‌بندی خودکار بارهای کاری
description: >-
  با مقیاس‌بندی خودکار، می‌توانید بارهای کاری خود را به طور خودکار به یک روش یا روش دیگر به‌روزرسانی کنید. این به خوشه شما اجازه می‌دهد تا به تغییرات در تقاضای منابع، انعطاف‌پذیرتر و کارآمدتر واکنش نشان دهد.
content_type: concept
weight: 40
---

<!-- overview -->

در Kubernetes، می‌توانید بسته به تقاضای فعلی منابع، حجم کار را _مقیاس_ کنید.

این به خوشه شما اجازه می‌دهد تا به تغییرات در تقاضای منابع، انعطاف‌پذیرتر و کارآمدتر واکنش نشان دهد.

هنگامی که یک حجم کار را مقیاس‌بندی می‌کنید، می‌توانید تعداد کپی‌های مدیریت‌شده توسط حجم کار را افزایش یا کاهش دهید، یا منابع موجود برای کپی‌های موجود را تنظیم کنید.

رویکرد اول به عنوان _مقیاس‌بندی افقی_ و رویکرد دوم به عنوان _مقیاس‌بندی عمودی_ شناخته می‌شود.

بسته به مورد استفاده شما، روش‌های دستی و خودکار برای مقیاس‌بندی حجم کار شما وجود دارد.

<!-- body -->

## مقیاس‌بندی دستی بارهای کاری

کوبرنتیز از _مقیاس‌بندی دستی_ بارهای کاری پشتیبانی می‌کند. مقیاس‌بندی افقی را می‌توانید  
با استفاده از ابزار `kubectl` انجام دهید.  
برای مقیاس‌بندی عمودی، باید تعریف منبع بار کاری خود را _patch_ کنید.

مثال هر دو استراتژی را در ادامه ببینید:

- **مقیاس‌بندی افقی**: [اجرای چند نمونه از برنامه شما](/docs/tutorials/kubernetes-basics/scale/scale-intro/)  
- **مقیاس‌بندی عمودی**: [تغییر اندازه منابع CPU و حافظه اختصاص‌یافته به کانتینرها](/docs/tasks/configure-pod-container/resize-container-resources)

## مقیاس‌بندی خودکار بارهای کاری

کوبرنتیز همچنین از _مقیاس‌بندی خودکار_ بارهای کاری پشتیبانی می‌کند که موضوع این صفحه است.

مفهوم _Autoscaling_ در کوبرنتیز به توانایی به‌روزرسانی خودکار یک  
شیٔی که مجموعه‌ای از Pods را مدیریت می‌کند (برای مثال  
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}) اشاره دارد.  

### مقیاس‌بندی بارهای کاری به‌صورت افقی

در کوبرنتیز، می‌توانید به‌صورت خودکار بار کاری را به‌صورت افقی با استفاده از _HorizontalPodAutoscaler_ مقیاس‌بندی کنید.

این قابلیت به‌عنوان یک منبع API کوبرنتیز و یک {{< glossary_tooltip text="controller" term_id="controller" >}} پیاده‌سازی شده و به‌طور دوره‌ای تعداد {{< glossary_tooltip text="replicas" term_id="replica" >}} را در یک بار کاری تنظیم می‌کند تا با مصرف منابع مشاهده‌شده مانند استفاده از CPU یا حافظه هم‌خوانی داشته باشد.

یک [آموزش گام‌به‌گام](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough) برای پیکربندی _HorizontalPodAutoscaler_ برای یک Deployment وجود دارد.

### مقیاس‌بندی بارهای کاری به‌صورت عمودی

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

می‌توانید به‌صورت خودکار بار کاری را به‌صورت عمودی با استفاده از _VerticalPodAutoscaler_ مقیاس‌بندی کنید. بر خلاف HPA، VPA به‌طور پیش‌فرض همراه کوبرنتیز عرضه نمی‌شود، بلکه یک پروژه مستقل است که در [GitHub](https://github.com/kubernetes/autoscaler/tree/9f87b78df0f1d6e142234bb32e8acbd71295585a/vertical-pod-autoscaler) در دسترس قرار دارد.

پس از نصب، می‌توانید برای بارهای کاری خود {{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}} (CRD) ایجاد کنید که تعریف می‌کنند _چگونه_ و _چه زمانی_ منابع نسخه‌های مدیریت‌شده را مقیاس‌بندی کنند.

{{< note >}}
برای کارکرد VPA نیاز است که [Metrics Server](https://github.com/kubernetes-sigs/metrics-server) در خوشه شما نصب شده باشد.
{{< /note >}}

در حال حاضر، VPA می‌تواند در چهار حالت مختلف کار کند:

{{< table caption="حالت‌های مختلف VPA" >}}
حالت | توضیحات
:----|:-----------
`Auto` | در حال حاضر `Recreate`. ممکن است در آینده به به‌روزرسانی درجا (in-place) تغییر یابد.
`Recreate` | VPA درخواست‌های منابع را هنگام ایجاد پاد تنظیم می‌کند و همچنین با بیرون‌کردن پادهای موجود، آن‌ها را به‌روزرسانی می‌کند وقتی درخواست منابع به‌طور قابل توجهی با پیشنهاد جدید متفاوت باشد.
`Initial` | VPA تنها هنگام ایجاد پاد درخواست‌های منابع را تنظیم می‌کند و پس از آن هرگز آن‌ها را تغییر نمی‌دهد.
`Off` | VPA به‌صورت خودکار نیازمندی‌های منابع پادها را تغییر نمی‌دهد. پیشنهادها محاسبه می‌شوند و می‌توان آن‌ها را در شی VPA بررسی کرد.
{{< /table >}}

#### مقیاس‌بندی عمودی پاد درجا

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

از زمان Kubernetes {{< skew currentVersion >}}، VPA از تغییر اندازه پادها درجا پشتیبانی نمی‌کند، اما این ادغام در دست کار است.  
برای تغییر اندازه دستی پادها درجا، به [Resize Container Resources In-Place](/docs/tasks/configure-pod-container/resize-container-resources/) مراجعه کنید.

### مقیاس‌بندی خودکار بر اساس اندازه خوشه

برای بارهای کاری که نیاز به مقیاس‌بندی بر اساس اندازه خوشه دارند (برای مثال `cluster-dns` یا سایر اجزای سیستمی)، می‌توانید از  
[_Cluster Proportional Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler) استفاده کنید.  
مانند VPA، این ابزار بخشی از هسته کوبرنتیز نیست و به‌صورت یک پروژه مستقل در GitHub میزبانی می‌شود.

Cluster Proportional Autoscaler تعداد {{< glossary_tooltip text="Nodes" term_id="node" >}} قابل زمان‌بندی و هسته‌ها را پایش کرده و  
تعداد Replicaهای بار کاری هدف را بر همان اساس تنظیم می‌کند.

اگر قرار است تعداد Replicaها ثابت بماند، می‌توانید بارهای کاری خود را به‌صورت عمودی بر اساس اندازه خوشه مقیاس دهید  
با استفاده از [_Cluster Proportional Vertical Autoscaler_](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler).  
این پروژه **در حال حاضر در مرحله بتا** قرار دارد و در GitHub در دسترس است.

در حالی که Cluster Proportional Autoscaler تعداد Replicaهای یک بار کاری را مقیاس می‌دهد،  
Cluster Proportional Vertical Autoscaler درخواست‌های منابع (برای مثال در یک Deployment یا DaemonSet) را  
بر اساس تعداد Nodes و/یا هسته‌ها در خوشه تنظیم می‌کند.

### مقیاس‌بندی خودکار مبتنی بر رویداد

همچنین امکان مقیاس‌بندی بارهای کاری بر اساس رویدادها وجود دارد، برای مثال با استفاده از  
[_Kubernetes Event Driven Autoscaler_ (**KEDA**)](https://keda.sh/).

KEDA یک پروژه فارغ‌التحصیل‌شده از CNCF است که به شما امکان می‌دهد بارهای کاری خود را  
بر اساس تعداد رویدادهای قابل پردازش—مثلاً تعداد پیام‌ها در یک صف—مقیاس دهید.  
برای منابع رویداد مختلف، آداپتورهای متنوعی در دسترس هستند.

### مقیاس‌بندی خودکار بر اساس زمان‌بندی‌ها

استراتژی دیگری برای مقیاس‌بندی بارهای کاری شما این است که عملیات مقیاس‌بندی را **زمان‌بندی** کنید، برای مثال جهت کاهش مصرف منابع در ساعات کم‌بار.

مشابه مقیاس‌بندی خودکار مبتنی بر رویداد، این رفتار را می‌توان با استفاده از KEDA همراه با  
[`Cron` scaler](https://keda.sh/docs/latest/scalers/cron/)  
دستیابی کرد.  
`Cron` scaler به شما امکان می‌دهد زمان‌بندی‌ها (و مناطق زمانی) را برای مقیاس دادن بارهای کاری خود به داخل یا خارج تعریف کنید.

## مقیاس‌بندی زیرساخت خوشه

اگر مقیاس‌بندی بارهای کاری برای رفع نیازهای شما کافی نیست، می‌توانید زیرساخت خوشه خود را نیز مقیاس دهید.

مقیاس‌بندی زیرساخت خوشه به‌طور معمول افزودن یا حذف {{< glossary_tooltip text="nodes" term_id="node" >}} را شامل می‌شود.  
برای اطلاعات بیشتر، [Node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/) را ببینید.

## {{% heading "whatsnext" %}}

- یادگیری بیشتر درباره مقیاس‌بندی افقی  
  - [مقیاس یک StatefulSet](/docs/tasks/run-application/scale-stateful-set/)  
  - [آموزش گام‌به‌گام HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)  
- [تغییر اندازه منابع کانتینر به‌صورت درجا](/docs/tasks/configure-pod-container/resize-container-resources/)  
- [مقیاس‌بندی خودکار سرویس DNS در خوشه](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)  
- آشنایی با [Node autoscaling](/docs/concepts/cluster-administration/node-autoscaling/)  
