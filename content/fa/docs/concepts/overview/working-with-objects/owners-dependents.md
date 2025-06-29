---
title: مالکان و تحت تکفل
content_type: concept
weight: 90
---

<!-- overview -->

در کوبرنتیز، برخی از {{< glossary_tooltip text="اشیاء" term_id="object" >}}  
*مالک* اشیای دیگر هستند.  
برای مثال، یک {{<glossary_tooltip text="ReplicaSet" term_id="replica-set">}}  
مالک مجموعه‌ای از پادها است. اشیایی که دارای مالک هستند، *وابسته* به آن مالک محسوب می‌شوند.

مالکیت با مکانیزم [برچسب‌ها و انتخابگرها](/docs/concepts/overview/working-with-objects/labels/) که برخی منابع نیز از آن استفاده می‌کنند تفاوت دارد.  
برای مثال، یک Service که اشیای `EndpointSlice` ایجاد می‌کند،  
از {{<glossary_tooltip text="برچسب‌ها" term_id="label">}} استفاده می‌کند تا control plane بتواند مشخص کند  
کدام اشیای `EndpointSlice` برای آن Service استفاده می‌شوند.  
علاوه بر برچسب‌ها، هر `EndpointSlice` که به نمایندگی از یک Service مدیریت می‌شود، دارای مرجع مالک است.  
مراجع مالک به بخش‌های مختلف کوبرنتیز کمک می‌کنند تا با اشیایی که کنترلشان را بر عهده ندارند تداخلی نداشته باشند.

## مراجع مالک در مشخصات شیء

اشیای وابسته دارای فیلدی به نام `metadata.ownerReferences` هستند  
که به شیء مالک آن‌ها ارجاع می‌دهد.  
یک مرجع مالک معتبر شامل نام شیء و یک {{<glossary_tooltip text="UID" term_id="uid">}}  
در همان {{<glossary_tooltip text="فضای نام" term_id="namespace">}}  
با شیء وابسته است.  
کوبرنتیز مقدار این فیلد را به‌صورت خودکار تنظیم می‌کند  
برای اشیایی که وابسته به منابعی مانند ReplicaSet، DaemonSet، Deployment، Job، CronJob و ReplicationController هستند.  
همچنین می‌توانید این روابط را به‌صورت دستی با تغییر مقدار این فیلد پیکربندی کنید،  
اما معمولاً نیازی به این کار نیست و می‌توان اجازه داد کوبرنتیز به‌صورت خودکار این روابط را مدیریت کند.

اشیای وابسته همچنین دارای فیلدی به نام `ownerReferences.blockOwnerDeletion` هستند  
که یک مقدار بولی می‌پذیرد و کنترل می‌کند آیا وابستهٔ خاصی می‌تواند  
از حذف شدن شیء مالک توسط مکانیزم garbage collection جلوگیری کند یا نه.  
کوبرنتیز این فیلد را به‌طور خودکار روی مقدار `true` قرار می‌دهد اگر  
یک {{<glossary_tooltip text="کنترلر" term_id="controller">}}  
(مثلاً کنترلر Deployment) مقدار فیلد `metadata.ownerReferences` را تنظیم کند.  
شما همچنین می‌توانید مقدار فیلد `blockOwnerDeletion` را به‌صورت دستی تنظیم کنید  
تا مشخص کنید کدام وابسته‌ها از حذف مالک جلوگیری کنند.

یک کنترل‌کنندهٔ پذیرش (admission controller) در کوبرنتیز، دسترسی کاربران برای تغییر این فیلد در منابع وابسته را کنترل می‌کند،  
بر اساس مجوز حذف شیء مالک.  
این کنترل باعث می‌شود کاربران غیرمجاز نتوانند حذف شیء مالک را به تأخیر بیندازند.

{{< note >}}
ارجاع به مالک در فضای نام متفاوت (cross-namespace owner references) به‌صورت طراحی‌شده مجاز نیستند.  
وابسته‌های دارای فضای نام می‌توانند مالک‌های خوشه‌ای (cluster-scoped) یا دارای فضای نام را مشخص کنند.  
یک مالک دارای فضای نام **باید** در همان فضای نام با شیء وابسته وجود داشته باشد.  
در غیر این صورت، مرجع مالک بی‌اعتبار تلقی می‌شود و شیء وابسته در صورت غیبت تمام مالک‌ها، حذف خواهد شد.

وابسته‌هایی که در سطح خوشه هستند، تنها می‌توانند به مالک‌هایی در سطح خوشه ارجاع دهند.  
از نسخهٔ 1.20 به بعد، اگر یک وابستهٔ خوشه‌ای، نوعی با فضای نام را به‌عنوان مالک مشخص کند،  
این مرجع مالک غیرقابل حل در نظر گرفته می‌شود و آن شیء قابل جمع‌آوری توسط garbage collector نخواهد بود.

در نسخهٔ 1.20 و بالاتر، اگر garbage collector یک `ownerReference` نامعتبر از نوع cross-namespace شناسایی کند،  
یا وابستهٔ خوشه‌ای باشد که مرجع مالک آن به نوعی namespaced اشاره دارد،  
یک Event هشدار با دلیل `OwnerRefInvalidNamespace` و شیء نامعتبر به‌عنوان `involvedObject` ثبت می‌شود.  
می‌توانید برای بررسی چنین Eventهایی این دستور را اجرا کنید:  
`kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`
{{< /note >}}

## مالکیت و پایان‌دهنده‌ها (Finalizers)

وقتی به کوبرنتیز دستور می‌دهید که یک منبع (Resource) را حذف کند، سرور API به کنترل‌کنندهٔ مدیریت‌کننده اجازه می‌دهد  
تا هرگونه [قانون پایان‌دهنده (finalizer)](/docs/concepts/overview/working-with-objects/finalizers/) برای آن منبع را پردازش کند.  
{{<glossary_tooltip text="پایان‌دهنده‌ها" term_id="finalizer">}} از حذف تصادفی منابعی که خوشه ممکن است هنوز به آن‌ها نیاز داشته باشد جلوگیری می‌کنند.  
برای مثال، اگر بخواهید یک [PersistentVolume](/docs/concepts/storage/persistent-volumes/) را حذف کنید که هنوز توسط یک Pod در حال استفاده است،  
حذف فوراً انجام نمی‌شود، زیرا آن `PersistentVolume` دارای پایان‌دهندهٔ `kubernetes.io/pv-protection` است.  
در عوض، [حجم](/docs/concepts/storage/volumes/) در وضعیت `Terminating` باقی می‌ماند تا زمانی که کوبرنتیز پایان‌دهنده را حذف کند،  
که تنها پس از آن اتفاق می‌افتد که `PersistentVolume` دیگر به هیچ Pod متصل نباشد.

کوبرنتیز همچنین هنگام استفاده از [حذف آبشاری foreground یا orphan](/docs/concepts/architecture/garbage-collection/#cascading-deletion)،  
به منبع مالک پایان‌دهنده‌هایی اضافه می‌کند.  
در حذف foreground، پایان‌دهندهٔ `foreground` افزوده می‌شود تا کنترل‌کننده ملزم شود  
منابع وابسته‌ای که `ownerReferences.blockOwnerDeletion=true` دارند را قبل از حذف منبع مالک، حذف کند.  
اگر سیاست حذف orphan را مشخص کنید، کوبرنتیز پایان‌دهندهٔ `orphan` را اضافه می‌کند  
تا کنترل‌کننده پس از حذف شیء مالک، منابع وابسته را نادیده بگیرد.

## {{% heading "whatsnext" %}}

* اطلاعات بیشتری دربارهٔ [پایان‌دهنده‌های کوبرنتیز](/docs/concepts/overview/working-with-objects/finalizers/) کسب کنید.
* دربارهٔ [جمع‌آوری زباله (Garbage Collection)](/docs/concepts/architecture/garbage-collection) بیاموزید.
* مرجع API مربوط به [metadata اشیاء](/docs/reference/kubernetes-api/common-definitions/object-meta/#System) را مطالعه کنید.
