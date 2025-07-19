---
title: برچسب‌ها، حاشیه‌نویسی‌ها و رنگ‌های شناخته‌شده
content_type: مفهوم
weight: 40
no_list: true
card:
  name: مرجع
  weight: 30
  anchors:
  - anchor: "#برچسب‌ها-حاشیه‌نویسی‌ها-و-رنگ‌های-استفاده‌شده-روی-اشیاء-api"
    title: برچسب‌ها، حاشیه‌نویسی‌ها و رنگ‌آمیزی‌ها
---

<!-- overview -->

کوبرنتیز تمام برچسب‌ها، حاشیه‌نویسی‌ها و رنگ‌ها را در فضاهای نام `kubernetes.io` و `k8s.io` محفوظ می‌دارد.


این سند هم به عنوان مرجعی برای مقادیر و هم به عنوان نقطه هماهنگی برای تعیین مقادیر عمل می‌کند.

<!-- body -->

## برچسب‌ها، حاشیه‌نویسی‌ها و رنگ‌های استفاده‌شده در اشیاء API


### apf.kubernetes.io/autoupdate-spec

نوع: حاشیه‌نویسی


مثال: `apf.kubernetes.io/autoupdate-spec: "true"`

مورد استفاده در: اشیاء [`FlowSchema` و `PriorityLevelConfiguration`](/docs/concepts/cluster-administration/flow-control/#defaults)

اگر این حاشیه‌نویسی در FlowSchema یا PriorityLevelConfiguration روی true تنظیم شده باشد، `spec` آن شیء توسط kube-apiserver مدیریت می‌شود. اگر سرور API یک شیء APF را تشخیص ندهد و شما آن را برای به‌روزرسانی خودکار حاشیه‌نویسی کنید، سرور API کل شیء را حذف می‌کند. در غیر این صورت، سرور API مشخصات شیء را مدیریت نمی‌کند. برای جزئیات بیشتر، [Maintenance of the Mandatory and Suggested Configuration Objects](/docs/concepts/cluster-administration/flow-control/#maintenance-of-the-mandatory-and-suggested-configuration-objects). را مطالعه کنید.


### app.kubernetes.io/component

نوع: برچسب


مثال: `app.kubernetes.io/component: "database"`

مورد استفاده در: همه اشیاء (معمولاً در [workload resources](/docs/reference/kubernetes-api/workload-resources/) استفاده می‌شود).

مولفه درون معماری برنامه.

یکی از [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).



### app.kubernetes.io/created-by (deprecated)

نوع: برچسب


مثال: `app.kubernetes.io/created-by: "controller-manager"`

مورد استفاده در: همه اشیاء (معمولاً در [workload resources](/docs/reference/kubernetes-api/workload-resources/)).استفاده می‌شود.

کنترل‌کننده/کاربری که این منبع را ایجاد کرده است.



{{< note >}}
از نسخه ۱.۹ به بعد، این برچسب منسوخ شده است.
{{< /note >}}

### app.kubernetes.io/instance

نوع: برچسب

مثال: `app.kubernetes.io/instance: "mysql-abcxyz"`

مورد استفاده در: همه اشیاء (معمولاً در [workload resources](/docs/reference/kubernetes-api/workload-resources/)). استفاده می‌شود

نامی منحصر به فرد که نمونه یک برنامه را مشخص می‌کند.

برای اختصاص یک نام غیر منحصر به فرد، از [app.kubernetes.io/name](#app-kubernetes-io-name) استفاده کنید.

یکی از [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).


### app.kubernetes.io/managed-by

نوع: برچسب

مثال: `app.kubernetes.io/managed-by: "helm"`

مورد استفاده در: همه اشیاء (معمولاً در [workload resources](/docs/reference/kubernetes-api/workload-resources/)). استفاده می‌شود

ابزاری که برای مدیریت عملکرد یک برنامه استفاده می‌شود.

یکی از [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).



### app.kubernetes.io/name


نوع: برچسب

مثال: `app.kubernetes.io/name: "mysql"`

مورد استفاده در: همه اشیاء (معمولاً در [workload resources](/docs/reference/kubernetes-api/workload-resources/)). استفاده می‌شود

نام برنامه.

یکی از [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/part-of


نوع: برچسب

مثال: `app.kubernetes.io/part-of: "wordpress"`

مورد استفاده در: همه اشیاء (معمولاً در [workload resources](/docs/reference/kubernetes-api/workload-resources/)). استفاده می‌شود

نام یک برنامه سطح بالاتر که این شیء بخشی از آن است.

یکی از [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/version

نوع: برچسب

مثال: `app.kubernetes.io/version: "5.7.21"`

مورد استفاده در: همه اشیاء (معمولاً در [workload resources](/docs/reference/kubernetes-api/workload-resources/)). استفاده می‌شود

نسخه فعلی برنامه.

اشکال رایج مقادیر عبارتند از:

- [semantic version](https://semver.org/spec/v1.0.0.html)
- the Git [revision hash](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#_single_revisions)
  for the source code.

برای کد منبع.

یکی از [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).

نوع: حاشیه‌نویسی



مثال: `applyset.kubernetes.io/additional-namespaces: "namespace1,namespace2"`

مورد استفاده در: اشیاء به عنوان والدین ApplySet.
استفاده از این حاشیه‌نویسی Alpha است.
برای نسخه Kubernetes {{< skew currentVersion >}}، می‌توانید از این حاشیه‌نویسی روی Secrets، ConfigMaps یا منابع سفارشی استفاده کنید، اگر
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
تعریف آنها دارای برچسب `applyset.kubernetes.io/is-parent-type` باشد.

بخشی از مشخصات مورد استفاده برای پیاده‌سازی [هرس مبتنی بر ApplySet در kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).

این حاشیه‌نویسی به شیء والد مورد استفاده برای ردیابی یک ApplySet اعمال می‌شود تا دامنه ApplySet را فراتر از فضای نام خود شیء والد (در صورت وجود) گسترش دهد.

مقدار، فهرستی از نام‌های فضاهای نام غیر از فضای نام والد است که اشیاء در آن یافت می‌شوند و با کاما از هم جدا شده‌اند.

### applyset.kubernetes.io/contains-group-kinds (alpha) {#applyset-kubernetes-io-contains-group-kinds}

نوع: حاشیه‌نویسی

مورد استفاده در: اشیاء مورد استفاده به عنوان والدین ApplySet.

مورد استفاده در: اشیاء به عنوان والدین ApplySet.

مورد استفاده از این حاشیه‌نویسی Alpha است.

برای نسخه Kubernetes {{< skew currentVersion >}}، می‌توانید از این حاشیه‌نویسی روی Secrets، ConfigMaps یا منابع سفارشی استفاده کنید، اگر CustomResourceDefinition که آنها را تعریف می‌کند، دارای برچسب `applyset.kubernetes.io/is-parent-type` باشد.

بخشی از مشخصات مورد استفاده برای پیاده‌سازی [هرس مبتنی بر ApplySet در kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).

این حاشیه‌نویسی به شیء والد مورد استفاده برای ردیابی یک ApplySet جهت بهینه‌سازی فهرست اشیاء عضو ApplySet اعمال می‌شود. این مورد در مشخصات ApplySet اختیاری است، زیرا ابزارها می‌توانند عملیات کشف را انجام دهند یا از بهینه‌سازی متفاوتی استفاده کنند. با این حال، از نسخه Kubernetes {{< skew currentVersion >}}،

توسط kubectl الزامی است. در صورت وجود، مقدار این حاشیه‌نویسی باید لیستی از انواع گروه باشد که با کاما از هم جدا شده‌اند، در قالب نام کاملاً واجد شرایط، یعنی`<resource>.<group>`.

### applyset.kubernetes.io/contains-group-resources (deprecated) {#applyset-kubernetes-io-contains-group-resources}

نوع: حاشیه‌نویسی


مثال: `applyset.kubernetes.io/contains-group-resources: "certificates.cert-manager.io,configmaps,deployments.apps,secrets,services"`


مورد استفاده در: اشیاء مورد استفاده به عنوان والدین ApplySet.

برای نسخه Kubernetes {{< skew currentVersion >}}، می‌توانید از این حاشیه‌نویسی روی Secrets، ConfigMaps یا منابع سفارشی استفاده کنید، اگر CustomResourceDefinition که آنها را تعریف می‌کند، دارای برچسب `applyset.kubernetes.io/is-parent-type` باشد.

بخشی از مشخصات مورد استفاده برای پیاده‌سازی [هرس مبتنی بر ApplySet در kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
این حاشیه‌نویسی به شیء والد مورد استفاده برای ردیابی یک ApplySet جهت بهینه‌سازی فهرست اشیاء عضو ApplySet اعمال می‌شود. این مورد در مشخصات ApplySet اختیاری است، زیرا ابزارها می‌توانند عملیات کشف را انجام دهند یا از بهینه‌سازی متفاوتی استفاده کنند. با این حال، در نسخه Kubernetes {{< skew currentVersion >}}،
توسط kubectl الزامی است. در صورت وجود، مقدار این حاشیه‌نویسی باید لیستی از انواع گروه باشد که با کاما از هم جدا شده‌اند، در قالب نام کاملاً واجد شرایط، یعنی`<resource>.<group>`.
{{< note >}}
این حاشیه‌نویسی در حال حاضر منسوخ شده و با [`applyset.kubernetes.io/contains-group-kinds`](#applyset-kubernetes-io-contains-group-kinds) جایگزین شده است، پشتیبانی از این مورد در نسخه بتا یا عمومی applyset حذف خواهد شد.
{{< /note >}}

### applyset.kubernetes.io/id (alpha) {#applyset-kubernetes-io-id}

نوع: برچسب



مثال: `applyset.kubernetes.io/id: "applyset-0eFHV8ySqp7XoShsGvyWFQD3s96yqwHmzc4e0HR1dsY-v1"`

مورد استفاده در: اشیاء به عنوان والدین ApplySet.

مورد استفاده از این برچسب Alpha است.

برای نسخه Kubernetes {{< skew currentVersion >}}، می‌توانید از این برچسب روی Secrets، ConfigMaps یا منابع سفارشی استفاده کنید، اگر CustomResourceDefinition که آنها را تعریف می‌کند، دارای برچسب `applyset.kubernetes.io/is-parent-type` باشد.


بخشی از مشخصات مورد استفاده برای پیاده‌سازی [ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
این برچسب چیزی است که یک شیء را به شیء والد ApplySet تبدیل می‌کند.
مقدار آن، شناسه منحصر به فرد ApplySet است که از هویت خود شیء والد مشتق شده است. این شناسه **باید** کدگذاری base64 (با استفاده از کدگذاری امن URL از RFC4648) از هش group-kind-name-namespace شیء که روی آن قرار دارد، به شکل زیر باشد:
`<base64(sha256(<name>.<namespace>.<kind>.<group>))>`.
هیچ ارتباطی بین مقدار این برچسب و UID شیء وجود ندارد.


### applyset.kubernetes.io/is-parent-type (alpha) {#applyset-kubernetes-io-is-parent-type}

نوع: برچسب

مثال: `applyset.kubernetes.io/is-parent-type: "true"`

مورد استفاده در: تعریف منابع سفارشی (CRD)

مورد استفاده از این برچسب Alpha است.

بخشی از مشخصات مورد استفاده برای پیاده‌سازی
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).

شما می‌توانید این برچسب را روی یک CustomResourceDefinition (CRD) تنظیم کنید تا نوع منبع سفارشی که تعریف می‌کند (نه خود CRD) به عنوان والد مجاز برای یک ApplySet شناسایی شود.

تنها مقدار مجاز برای این برچسب `"true"` است؛ اگر می‌خواهید یک CRD را به عنوان والد معتبر برای ApplySets علامت‌گذاری کنید، این برچسب را حذف کنید.


### applyset.kubernetes.io/part-of (alpha) {#applyset-kubernetes-io-part-of}

نوع: برچسب

مثال: `applyset.kubernetes.io/part-of: "applyset-0eFHV8ySqp7XoShsGvyWFQD3s96yqwHmzc4e0HR1dsY-v1"`

مورد استفاده در: همه اشیاء.

مورد استفاده از این برچسب Alpha است.

بخشی از مشخصات مورد استفاده برای پیاده‌سازی
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).

این برچسب چیزی است که یک شیء را به عضوی از ApplySet تبدیل می‌کند.

مقدار برچسب **باید** با مقدار برچسب `applyset.kubernetes.io/id` روی شیء والد مطابقت داشته باشد.


### applyset.kubernetes.io/tooling (alpha) {#applyset-kubernetes-io-tooling}

نوع: حاشیه‌نویسی

مثال: `applyset.kubernetes.io/tooling: "kubectl/v{{< skew currentVersion >}}"`

مورد استفاده در: اشیاء مورد استفاده به عنوان والدین ApplySet.

مورد استفاده از این حاشیه‌نویسی Alpha است.

برای نسخه Kubernetes {{< skew currentVersion >}}، می‌توانید از این حاشیه‌نویسی روی Secrets، ConfigMaps یا منابع سفارشی استفاده کنید، اگر CustomResourceDefinition که آنها را تعریف می‌کند، دارای برچسب `applyset.kubernetes.io/is-parent-type` باشد.

بخشی از مشخصات مورد استفاده برای پیاده‌سازی 
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune). این حاشیه‌نویسی به شیء والد مورد استفاده برای ردیابی یک ApplySet اعمال می‌شود تا نشان دهد کدام ابزار، آن ApplySet را مدیریت می‌کند. ابزارسازی باید از تغییر ApplySetهای متعلق به ابزارهای دیگر خودداری کند. مقدار باید در قالب `<toolname>/<semver>` باشد.
### apps.kubernetes.io/pod-index (beta) {#apps-kubernetes.io-pod-index}

نوع: برچسب

مثال: `apps.kubernetes.io/pod-index: "0"`

مورد استفاده در: پاد

وقتی یک کنترلر StatefulSet یک پاد برای StatefulSet ایجاد می‌کند، این برچسب را روی آن پاد تنظیم می‌کند.

مقدار برچسب، اندیس ترتیبی پاد در حال ایجاد است.

برای جزئیات بیشتر به [Pod Index Label](/docs/concepts/workloads/controllers/statefulset/#pod-index-label) در مبحث StatefulSet مراجعه کنید.

به [PodIndexLabel](/docs/reference/command-line-tools-reference/feature-gates/) توجه داشته باشید.

برای اضافه شدن این برچسب به پادها، باید گیت ویژگی فعال باشد.

### resource.kubernetes.io/pod-claim-name

نوع: حاشیه‌نویسی

مثال: `resource.kubernetes.io/pod-claim-name: "my-pod-claim"`

مورد استفاده در: ResourceClaim

این حاشیه‌نویسی به ResourceClaims تولید شده اختصاص داده می‌شود.

مقدار آن با نام ادعای منبع در `.spec` هر Pod(هایی) که ResourceClaim برای آنها ایجاد شده است، مطابقت دارد.

این حاشیه‌نویسی، جزئیات پیاده‌سازی داخلی [dynamic resource allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/). است

شما نیازی به خواندن یا تغییر مقدار این حاشیه‌نویسی ندارید.


### cluster-autoscaler.kubernetes.io/safe-to-evict

نوع: حاشیه‌نویسی

مثال: `cluster-autoscaler.kubernetes.io/safe-to-evict: "true"`

مورد استفاده در: Pod

وقتی این حاشیه‌نویسی روی `"true"` تنظیم شود، مقیاس‌پذیر خودکار خوشه اجازه دارد یک Pod را حذف کند
حتی اگر سایر قوانین معمولاً از این کار جلوگیری کنند.
مقیاس‌پذیر خودکار خوشه هرگز Podهایی را که این حاشیه‌نویسی به صراحت روی `"false"` تنظیم شده است، حذف نمی‌کند. می‌توانید آن را روی یک Pod مهم که می‌خواهید به اجرا ادامه دهد، تنظیم کنید.

### config.kubernetes.io/local-config

نوع: حاشیه‌نویسی

مثال: `config.kubernetes.io/local-config: "true"`

مورد استفاده در: همه اشیاء

این حاشیه‌نویسی در مانیفست‌ها برای علامت‌گذاری یک شیء به عنوان پیکربندی محلی که نباید به API Kubernetes ارسال شود، استفاده می‌شود.

مقدار `"true"` برای این حاشیه‌نویسی اعلام می‌کند که شیء فقط توسط ابزارهای سمت کلاینت مصرف می‌شود و نباید به سرور API ارسال شود.

مقدار `"false"` می‌تواند برای اعلام اینکه شیء باید به سرور API ارسال شود، حتی زمانی که در غیر این صورت محلی فرض می‌شود، استفاده شود.

این حاشیه‌نویسی بخشی از مشخصات توابع Kubernetes Resource Model (KRM) است که توسط Kustomize و ابزارهای شخص ثالث مشابه استفاده می‌شود.

به عنوان مثال، Kustomize اشیاء دارای این حاشیه‌نویسی را از خروجی ساخت نهایی خود حذف می‌کند.


### container.apparmor.security.beta.kubernetes.io/* (deprecated) {#container-apparmor-security-beta-kubernetes-io}

نوع: حاشیه‌نویسی

مثال: `container.apparmor.security.beta.kubernetes.io/my-container: my-custom-profile`

مورد استفاده در: Pods

این حاشیه‌نویسی به شما امکان می‌دهد تا پروفایل امنیتی AppArmor را برای یک کانتینر درون یک Pod Kubernetes مشخص کنید. از Kubernetes نسخه ۱.۳۰، این باید با فیلد `appArmorProfile` تنظیم شود.

برای کسب اطلاعات بیشتر، به آموزش [AppArmor](/docs/tutorials/security/apparmor/) مراجعه کنید.

این آموزش استفاده از AppArmor را برای محدود کردن توانایی‌ها و دسترسی‌های یک کانتینر نشان می‌دهد.

پروفایل مشخص شده، مجموعه‌ای از قوانین و محدودیت‌هایی را که فرآیند کانتینر شده باید رعایت کند، تعیین می‌کند. این به اجرای سیاست‌های امنیتی و جداسازی کانتینرهای شما کمک می‌کند.

### internal.config.kubernetes.io/* (reserved prefix) {#internal.config.kubernetes.io-reserved-wildcard}

نوع: حاشیه‌نویسی

مورد استفاده در: همه اشیاء

این پیشوند برای استفاده داخلی توسط ابزارهایی که به عنوان هماهنگ‌کننده مطابق با مشخصات توابع Kubernetes Resource Model (KRM) عمل می‌کنند، رزرو شده است.

حاشیه‌نویسی‌های با این پیشوند برای فرآیند هماهنگ‌سازی داخلی هستند و در مانیفست‌های سیستم فایل ذخیره نمی‌شوند. به عبارت دیگر، ابزار هماهنگ‌کننده باید این حاشیه‌نویسی‌ها را هنگام خواندن فایل‌ها از سیستم فایل محلی تنظیم کند و هنگام نوشتن خروجی توابع به سیستم فایل، آنها را حذف کند.

یک تابع KRM **نباید** حاشیه‌نویسی‌های دارای این پیشوند را تغییر دهد، مگر اینکه برای یک حاشیه‌نویسی مشخص شده، طور دیگری مشخص شده باشد. این امر به ابزارهای هماهنگ‌کننده امکان می‌دهد حاشیه‌نویسی‌های داخلی اضافی را بدون نیاز به تغییر در توابع موجود اضافه کنند.

### internal.config.kubernetes.io/path

نوع: حاشیه‌نویسی

مثال: `internal.config.kubernetes.io/path: "relative/file/path.yaml"`

مورد استفاده در: همه اشیاء

این حاشیه‌نویسی، مسیر نسبی فایل مانیفست که شیء از آن بارگذاری شده است را با جداکننده اسلش، مستقل از سیستم‌عامل و با فاصله مشخص ثبت می‌کند. این مسیر نسبت به یک مکان ثابت در سیستم فایل است که توسط ابزار هماهنگ‌کننده تعیین می‌شود.

این حاشیه‌نویسی بخشی از مشخصات توابع Kubernetes Resource Model (KRM) است که توسط Kustomize و ابزارهای شخص ثالث مشابه استفاده می‌شود.

یک تابع KRM **نباید** این حاشیه‌نویسی را روی اشیاء ورودی تغییر دهد، مگر اینکه فایل‌های ارجاع‌شده را تغییر دهد. یک تابع KRM **ممکن است** این حاشیه‌نویسی را روی اشیاء تولید شده خود نیز شامل کند.
### internal.config.kubernetes.io/index

نوع: حاشیه‌نویسی

مثال: `internal.config.kubernetes.io/index: "2"`

مورد استفاده در: همه اشیاء

این حاشیه‌نویسی، موقعیت صفر-ایندکس‌شده سند YAML حاوی شیء را در فایل مانیفستی که شیء از آن بارگذاری شده است، ثبت می‌کند. توجه داشته باشید که اسناد YAML با سه خط تیره (`---`) از هم جدا می‌شوند و هر کدام می‌توانند شامل یک شیء باشند. وقتی این حاشیه‌نویسی مشخص نشده باشد، مقدار 0 به طور ضمنی در نظر گرفته می‌شود.

این حاشیه‌نویسی بخشی از مشخصات توابع Kubernetes Resource Model (KRM) است که توسط Kustomize و ابزارهای شخص ثالث مشابه استفاده می‌شود.

یک تابع KRM **نباید** این حاشیه‌نویسی را روی اشیاء ورودی تغییر دهد، مگر اینکه فایل‌های ارجاع‌شده را تغییر دهد. یک تابع KRM **ممکن است** این حاشیه‌نویسی را روی اشیاء تولید شده خود نیز شامل کند.

### kube-scheduler-simulator.sigs.k8s.io/bind-result

نوع: حاشیه‌نویسی

مثال: `kube-scheduler-simulator.sigs.k8s.io/bind-result: '{"DefaultBinder":"success"}'`

مورد استفاده در: پاد

این حاشیه‌نویسی نتیجه افزونه‌های زمان‌بندی اتصال را که توسط https://sigs.k8s.io/kube-scheduler-simulator استفاده می‌شود، ثبت می‌کند.

### kube-scheduler-simulator.sigs.k8s.io/filter-result

نوع: حاشیه‌نویسی

مثال:

```yaml
kube-scheduler-simulator.sigs.k8s.io/filter-result: >-
      {"node-282x7":{"AzureDiskLimits":"passed","EBSLimits":"passed","GCEPDLimits":"passed","InterPodAffinity":"passed","NodeAffinity":"passed","NodeName":"passed","NodePorts":"passed","NodeResourcesFit":"passed","NodeUnschedulable":"passed","NodeVolumeLimits":"passed","PodTopologySpread":"passed","TaintToleration":"passed","VolumeBinding":"passed","VolumeRestrictions":"passed","VolumeZone":"passed"},"node-gp9t4":{"AzureDiskLimits":"passed","EBSLimits":"passed","GCEPDLimits":"passed","InterPodAffinity":"passed","NodeAffinity":"passed","NodeName":"passed","NodePorts":"passed","NodeResourcesFit":"passed","NodeUnschedulable":"passed","NodeVolumeLimits":"passed","PodTopologySpread":"passed","TaintToleration":"passed","VolumeBinding":"passed","VolumeRestrictions":"passed","VolumeZone":"passed"}}
```

ورد استفاده در: پاد

این حاشیه‌نویسی نتیجه افزونه‌های زمان‌بندی فیلتر را که توسط https://sigs.k8s.io/kube-scheduler-simulator استفاده می‌شود، ثبت می‌کند.

### kube-scheduler-simulator.sigs.k8s.io/finalscore-result

نوع: حاشیه‌نویسی

مثال:

```yaml
kube-scheduler-simulator.sigs.k8s.io/finalscore-result: >-
      {"node-282x7":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"200","TaintToleration":"300","VolumeBinding":"0"},"node-gp9t4":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"200","TaintToleration":"300","VolumeBinding":"0"}}
```

مورد استفاده در: پاد

این حاشیه‌نویسی، نمرات نهایی را که زمان‌بند از نمرات افزونه‌های زمان‌بند نمره محاسبه می‌کند، ثبت می‌کند.

مورد استفاده توسط https://sigs.k8s.io/kube-scheduler-simulator.
### kube-scheduler-simulator.sigs.k8s.io/permit-result

نوع: حاشیه‌نویسی

مثال: `kube-scheduler-simulator.sigs.k8s.io/permit-result: '{"CustomPermitPlugin":"success"}'`

مورد استفاده در: پاد

این حاشیه‌نویسی نتیجه افزونه‌های زمان‌بندی مجوز را که توسط https://sigs.k8s.io/kube-scheduler-simulator استفاده می‌شود، ثبت می‌کند

### kube-scheduler-simulator.sigs.k8s.io/permit-result-timeout

نوع: حاشیه‌نویسی

مثال: `kube-scheduler-simulator.sigs.k8s.io/permit-result-timeout: '{"CustomPermitPlugin":"10s"}'`

مورد استفاده در: پاد

این حاشیه‌نویسی، زمان‌های انقضای بازگشتی از افزونه‌های زمان‌بندی مجوز را ثبت می‌کند که توسط https://sigs.k8s.io/kube-scheduler-simulator استفاده می‌شود.

### kube-scheduler-simulator.sigs.k8s.io/postfilter-result

Type: Annotation

نوع: حاشیه‌نویسی

مثال: `kube-scheduler-simulator.sigs.k8s.io/postfilter-result: '{"DefaultPreemption":"success"}'`

مورد استفاده در: پاد

این حاشیه‌نویسی نتیجه افزونه‌های زمان‌بندی postfilter را که توسط https://sigs.k8s.io/kube-scheduler-simulator استفاده می‌شود، ثبت می‌کند.

### kube-scheduler-simulator.sigs.k8s.io/prebind-result

نوع: حاشیه‌نویسی

مثال: `kube-scheduler-simulator.sigs.k8s.io/prebind-result: '{"VolumeBinding":"success"}'`

مورد استفاده در: پاد

این حاشیه‌نویسی نتیجه افزونه‌های زمان‌بندی پیش‌اتصال را که توسط https://sigs.k8s.io/kube-scheduler-simulator استفاده می‌شود، ثبت می‌کند.

### kube-scheduler-simulator.sigs.k8s.io/prefilter-result

نوع: حاشیه‌نویسی

مثال: `kube-scheduler-simulator.sigs.k8s.io/prebind-result: '{"VolumeBinding":"success"}'`

مورد استفاده در: پاد

این حاشیه‌نویسی نتیجه افزونه‌های زمان‌بندی پیش‌اتصال را که توسط https://sigs.k8s.io/kube-scheduler-simulator استفاده می‌شود، ثبت می‌کند.

### kube-scheduler-simulator.sigs.k8s.io/prefilter-result-status

نوع: حاشیه‌نویسی


مثال:

```yaml
kube-scheduler-simulator.sigs.k8s.io/prefilter-result-status: >-
      {"InterPodAffinity":"success","NodeAffinity":"success","NodePorts":"success","NodeResourcesFit":"success","PodTopologySpread":"success","VolumeBinding":"success","VolumeRestrictions":"success"}
```

مورد استفاده در: پاد

این حاشیه‌نویسی نتیجه افزونه‌های زمان‌بندی پیش‌فیلتر را که توسط https://sigs.k8s.io/kube-scheduler-simulator استفاده می‌شود، ثبت می‌کند.

### kube-scheduler-simulator.sigs.k8s.io/prescore-result

نوع: حاشیه‌نویسی

مثال:

```yaml
    kube-scheduler-simulator.sigs.k8s.io/prescore-result: >-
      {"InterPodAffinity":"success","NodeAffinity":"success","NodeNumber":"success","PodTopologySpread":"success","TaintToleration":"success"}
```

مورد استفاده در: پاد

این حاشیه‌نویسی نتیجه افزونه‌های زمان‌بندی پیش‌فیلتر را که توسط https://sigs.k8s.io/kube-scheduler-simulator استفاده می‌شود، ثبت می‌کند.

### kube-scheduler-simulator.sigs.k8s.io/reserve-result

نوع: حاشیه‌نویسی

مثال: `kube-scheduler-simulator.sigs.k8s.io/reserve-result: '{"VolumeBinding":"success"}'`

مورد استفاده در: پاد

این حاشیه‌نویسی نتیجه‌ی افزونه‌های زمان‌بندی رزرو را که توسط https://sigs.k8s.io/kube-scheduler-simulator استفاده می‌شود، ثبت می‌کند.

### kube-scheduler-simulator.sigs.k8s.io/result-history

نوع: حاشیه‌نویسی

مثال: `kube-scheduler-simulator.sigs.k8s.io/result-history: '[]'`

مورد استفاده در: پاد

این حاشیه‌نویسی تمام نتایج برنامه‌ریزی گذشته از افزونه‌های زمان‌بندی را که توسط https://sigs.k8s.io/kube-scheduler-simulator استفاده می‌شود، ثبت می‌کند.

### kube-scheduler-simulator.sigs.k8s.io/score-result

نوع: حاشیه‌نویسی


```yaml
    kube-scheduler-simulator.sigs.k8s.io/score-result: >-
      {"node-282x7":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"0","TaintToleration":"0","VolumeBinding":"0"},"node-gp9t4":{"ImageLocality":"0","InterPodAffinity":"0","NodeAffinity":"0","NodeNumber":"0","NodeResourcesBalancedAllocation":"76","NodeResourcesFit":"73","PodTopologySpread":"0","TaintToleration":"0","VolumeBinding":"0"}}
```

مورد استفاده در: پاد

این حاشیه‌نویسی نتیجه افزونه‌های زمان‌بندی امتیاز را ثبت می‌کند که توسط https://sigs.k8s.io/kube-scheduler-simulator استفاده می‌شود.

### kube-scheduler-simulator.sigs.k8s.io/selected-node

نوع: حاشیه‌نویسی

مثال: `kube-scheduler-simulator.sigs.k8s.io/selected-node: node-282x7`

مورد استفاده در: پاد

این حاشیه‌نویسی، گره‌ای را که توسط چرخه زمان‌بندی انتخاب می‌شود، ثبت می‌کند و توسط https://sigs.k8s.io/kube-scheduler-simulator استفاده می‌شود.

### kubernetes.io/arch

نوع: برچسب

مثال: `kubernetes.io/arch: "amd64"`

مورد استفاده در: Node

Kubelet این را با `runtime.GOARCH` مطابق تعریف Go پر می‌کند.

این می‌تواند در صورتی که گره‌های ARM و x86 را با هم ترکیب می‌کنید، مفید باشد.

### kubernetes.io/os

نوع: برچسب

مثال: `kubernetes.io/os: "linux"`

مورد استفاده در: Node، Pod

برای گره‌ها، kubelet این را با `runtime.GOOS` مطابق تعریف Go پر می‌کند. این می‌تواند در صورتی که در حال ترکیب سیستم‌های عامل در خوشه خود هستید (مثلاً: ترکیب گره‌های لینوکس و ویندوز) مفید باشد.

همچنین می‌توانید این برچسب را روی یک Pod تنظیم کنید. Kubernetes به شما امکان می‌دهد هر مقداری را برای این برچسب تنظیم کنید. اگر از این برچسب استفاده می‌کنید، با این وجود باید آن را روی رشته Go `runtime.GOOS` برای سیستم عاملی که این Pod در واقع با آن کار می‌کند، تنظیم کنید.

هنگامی که مقدار برچسب `kubernetes.io/os` برای یک Pod با مقدار برچسب روی یک Node مطابقت نداشته باشد، kubelet روی گره، Pod را نمی‌پذیرد. با این حال، kube-scheduler این موضوع را در نظر نمی‌گیرد. از طرف دیگر، kubelet از اجرای Pod که در آن یک Pod OS مشخص کرده‌اید، خودداری می‌کند، اگر این سیستم عامل با سیستم عامل گره‌ای که kubelet در آن اجرا می‌شود، یکسان نباشد. برای جزئیات بیشتر، فقط به دنبال [Pods OS](/docs/concepts/workloads/pods/#pod-os) باشید.

### kubernetes.io/metadata.name

نوع: برچسب

مثال: `kubernetes.io/metadata.name: "mynamespace"`

مورد استفاده در: فضاهای نام

سرور Kubernetes API (بخشی از {{< glossary_tooltip text="control plane" term_id="control-plane" >}})
این برچسب را روی همه فضاهای نام تنظیم می‌کند. مقدار برچسب
روی نام فضای نام تنظیم می‌شود. شما نمی‌توانید مقدار این برچسب را تغییر دهید.

این در صورتی مفید است که بخواهید یک فضای نام خاص را با برچسب
{{< glossary_tooltip text="selector" term_id="selector" >}} هدف قرار دهید.

### kubernetes.io/limit-ranger

نوع: حاشیه‌نویسی

مثال: `kubernetes.io/limit-ranger: "مجموعه افزونه LimitRanger: پردازنده، درخواست حافظه برای کانتینر nginx؛ پردازنده، محدودیت حافظه برای کانتینر nginx"`

مورد استفاده در: پاد

کوبرنتس به طور پیش‌فرض هیچ محدودیتی برای منابع ارائه نمی‌دهد، به این معنی که مگر اینکه صریحاً محدودیت‌ها را تعریف کنید، کانتینر شما می‌تواند CPU و حافظه نامحدودی مصرف کند.

شما می‌توانید یک درخواست پیش‌فرض یا محدودیت پیش‌فرض برای پادها تعریف کنید. این کار را با ایجاد یک LimitRange در فضای نام مربوطه انجام می‌دهید. پادهایی که پس از تعریف LimitRange مستقر می‌شوند، این محدودیت‌ها را خواهند داشت.

حاشیه‌نویسی `kubernetes.io/limit-ranger` ثبت می‌کند که پیش‌فرض‌های منابع برای پاد مشخص شده‌اند و با موفقیت اعمال شده‌اند.

برای جزئیات بیشتر، درباره [LimitRanges](/docs/concepts/policy/limit-range) بخوانید.

### kubernetes.io/config.hash

نوع: حاشیه‌نویسی

مثال: `kubernetes.io/config.hash: "df7cc47f8477b6b1226d7d23a904867b"`

مورد استفاده در: پاد

هنگامی که kubelet یک پاد استاتیک بر اساس یک مانیفست داده شده ایجاد می‌کند، این حاشیه‌نویسی را به پاد استاتیک متصل می‌کند. مقدار حاشیه‌نویسی، شناسه کاربری (UID) پاد است.

توجه داشته باشید که kubelet همچنین `.spec.nodeName` را روی نام گره فعلی تنظیم می‌کند، گویی پاد

برای گره برنامه‌ریزی شده است.

### kubernetes.io/config.mirror

نوع: حاشیه‌نویسی

مثال: `kubernetes.io/config.mirror: "df7cc47f8477b6b1226d7d23a904867b"`

مورد استفاده در: پاد

برای یک پاد استاتیک که توسط kubelet روی یک گره ایجاد شده است، یک {{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
در سرور API ایجاد می‌شود. kubelet یک حاشیه‌نویسی اضافه می‌کند تا نشان دهد که این پاد
در واقع یک پاد آینه‌ای است. مقدار حاشیه‌نویسی از حاشیه‌نویسی [`kubernetes.io/config.hash`](#kubernetes-io-config-hash)
کپی می‌شود که UID پاد است.

هنگام به‌روزرسانی یک پاد با این مجموعه حاشیه‌نویسی، حاشیه‌نویسی قابل تغییر یا حذف نیست. اگر یک Pod این حاشیه‌نویسی را نداشته باشد، نمی‌توان آن را در طول به‌روزرسانی Pod اضافه کرد.

### kubernetes.io/config.source

نوع: حاشیه‌نویسی

مثال: `kubernetes.io/config.source: "file"`

مورد استفاده در: پاد

این حاشیه‌نویسی توسط kubelet اضافه می‌شود تا نشان دهد پاد از کجا می‌آید.

برای پادهای استاتیک، مقدار حاشیه‌نویسی می‌تواند یکی از `file` یا `http` باشد، بسته به اینکه مانیفست پاد در کجا قرار دارد. برای پادی که در سرور API ایجاد شده و سپس در گره فعلی زمان‌بندی شده است، مقدار حاشیه‌نویسی `api` است.
### kubernetes.io/config.seen

نوع: حاشیه‌نویسی

مثال: `kubernetes.io/config.seen: "2023-10-27T04:04:56.011314488Z"`

مورد استفاده در: پاد

وقتی kubelet برای اولین بار یک پاد را می‌بیند، ممکن است این حاشیه‌نویسی را با مقداری از برچسب زمانی فعلی در قالب RFC3339 به پاد اضافه کند.

### addonmanager.kubernetes.io/mode

نوع: برچسب

مثال: `addonmanager.kubernetes.io/mode: "Reconcile"`

مورد استفاده در: همه اشیاء

برای مشخص کردن نحوه مدیریت یک افزونه، می‌توانید از برچسب `addonmanager.kubernetes.io/mode` استفاده کنید.

این برچسب می‌تواند یکی از سه مقدار زیر را داشته باشد: `Reconcile`، `EnsureExists` یا `Ignore`.

- `Reconcile`: منابع افزونه به صورت دوره‌ای با وضعیت مورد انتظار تطبیق داده می‌شوند.

در صورت وجود هرگونه اختلاف، مدیر افزونه منابع را در صورت نیاز دوباره ایجاد، پیکربندی یا حذف می‌کند. این حالت پیش‌فرض است اگر هیچ برچسبی مشخص نشده باشد.

- `EnsureExists`: منابع افزونه فقط از نظر وجود بررسی می‌شوند اما پس از ایجاد تغییر نمی‌کنند. مدیر افزونه منابع را زمانی که هیچ نمونه‌ای از منبع با آن نام وجود نداشته باشد، ایجاد یا دوباره ایجاد می‌کند.

- `Ignore`: منابع افزونه نادیده گرفته می‌شوند. این حالت برای افزونه‌هایی که با مدیر افزونه سازگار نیستند یا توسط کنترل‌کننده دیگری مدیریت می‌شوند، مفید است.

برای جزئیات بیشتر، به [Addon-manager](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/addon-manager/README.md) مراجعه کنید.

### beta.kubernetes.io/arch (deprecated)

نوع: برچسب

این برچسب منسوخ شده است. لطفاً به جای آن از [`kubernetes.io/arch`](#kubernetes-io-arch) استفاده کنید.

### beta.kubernetes.io/os (منسوخ شده)

نوع: برچسب

این برچسب منسوخ شده است. لطفاً به جای آن از [`kubernetes.io/os`](#kubernetes-io-os) استفاده کنید.

### kube-aggregator.kubernetes.io/automanaged {#kube-aggregator-kubernetesio-automanaged}

نوع: برچسب

مثال: `kube-aggregator.kubernetes.io/automanaged: "onstart"`

مورد استفاده در: APIService

`kube-apiserver` این برچسب را روی هر شیء APIService که سرور API به طور خودکار ایجاد کرده است، تنظیم می‌کند. این برچسب نحوه مدیریت آن APIService توسط صفحه کنترل را مشخص می‌کند. شما نباید خودتان این برچسب را اضافه، اصلاح یا حذف کنید.

{{< note >}}
اشیاء APIService مدیریت‌شده خودکار توسط kube-apiserver حذف می‌شوند زمانی که هیچ API منبع داخلی یا سفارشی مربوط به گروه/نسخه APIService نداشته باشد.
{{< /note >}}

دو مقدار ممکن وجود دارد:

- `onstart`: APIService باید هنگام راه‌اندازی یک سرور API تطبیق داده شود، اما در غیر این صورت خیر.
- `true`: سرور API باید این APIService را به طور مداوم تطبیق دهد.

### service.alpha.kubernetes.io/tolerate-unready-endpoints (deprecated)

نوع: حاشیه‌نویسی

مورد استفاده در: StatefulSet

این حاشیه‌نویسی در یک سرویس نشان می‌دهد که آیا کنترل‌کننده نقاط پایانی باید اقدام به ایجاد نقاط پایانی برای پادهای آماده‌نشده کند یا خیر. نقاط پایانی این سرویس‌ها رکوردهای DNS خود را حفظ می‌کنند و از لحظه‌ای که kubelet تمام کانتینرهای موجود در پاد را شروع می‌کند و آن را _Running_ علامت‌گذاری می‌کند، تا زمانی که kubelet تمام کانتینرها را متوقف کرده و پاد را از سرور API حذف کند، به دریافت ترافیک برای سرویس ادامه می‌دهند.

### autoscaling.alpha.kubernetes.io/behavior (deprecated) {#autoscaling-alpha-kubernetes-io-behavior}

نوع: حاشیه‌نویسی

مورد استفاده در: HorizontalPodAutoscaler

این حاشیه‌نویسی برای پیکربندی رفتار مقیاس‌بندی برای HorizontalPodAutoscaler (HPA) در نسخه‌های قبلی Kubernetes استفاده می‌شد.

این به شما امکان می‌داد مشخص کنید که HPA چگونه باید پادها را به بالا یا پایین مقیاس‌بندی کند، از جمله تنظیم پنجره‌های تثبیت و سیاست‌های مقیاس‌بندی.

تنظیم این حاشیه‌نویسی در هیچ یک از نسخه‌های پشتیبانی‌شده Kubernetes تأثیری ندارد.

### kubernetes.io/hostname {#kubernetesiohostname}

نوع: برچسب

مثال: `kubernetes.io/hostname: "ip-172-20-114-199.ec2.internal"`

مورد استفاده در: Node

Kubelet این برچسب را با نام میزبان گره پر می‌کند. توجه داشته باشید که نام میزبان
را می‌توان با ارسال پرچم `--hostname-override` به `kubelet` از نام میزبان "واقعی" تغییر داد.

این برچسب همچنین به عنوان بخشی از سلسله مراتب توپولوژی استفاده می‌شود.

برای اطلاعات بیشتر به [topology.kubernetes.io/zone](#topologykubernetesiozone) مراجعه کنید.

### kubernetes.io/change-cause {#change-cause}

نوع: حاشیه‌نویسی

مثال: `kubernetes.io/change-cause: "kubectl edit --record deployment foo"`

مورد استفاده در: همه اشیاء

این حاشیه‌نویسی بهترین حدس در مورد دلیل تغییر چیزی است.

هنگام اضافه کردن `--record` به دستور `kubectl` که ممکن است یک شیء را تغییر دهد، مقداردهی می‌شود.

### kubernetes.io/description {#description}

نوع: حاشیه‌نویسی

مثال: `kubernetes.io/description: "توضیحات شیء K8s."`

مورد استفاده در: همه اشیاء

این حاشیه‌نویسی برای توصیف رفتار خاص شیء مورد نظر استفاده می‌شود.

### kubernetes.io/enforce-mountable-secrets (deprecated) {#enforce-mountable-secrets}

نوع: حاشیه‌نویسی

مثال: `kubernetes.io/enforce-mountable-secrets: "true"`

مورد استفاده در: ServiceAccount

{{< note >}}
`kubernetes.io/enforce-mountable-secrets` از Kubernetes نسخه ۱.۳۲ منسوخ شده است. برای جداسازی دسترسی به secretهای mount شده، از namespaceهای جداگانه استفاده کنید.
{{< /note >}}

مقدار این حاشیه‌نویسی باید **true** باشد تا اعمال شود.
وقتی این حاشیه‌نویسی را روی «true» تنظیم می‌کنید، Kubernetes قوانین زیر را برای
Podهایی که به عنوان این ServiceAccount اجرا می‌شوند، اعمال می‌کند:

۱. اسراری که به عنوان ولوم‌ها (volumes) نصب شده‌اند باید در فیلد «اسرار» (secrets) سرویس‌اکانت (ServiceAccount) فهرست شوند.

۱. اسراری که در «envFrom» برای کانتینرها (شامل کانتینرهای سایدکار و کانتینرهای init) به آنها اشاره شده است، باید در فیلد اسرار سرویس‌اکانت نیز فهرست شوند.

اگر هر کانتینری در یک پاد به رازی اشاره کند که در فیلد «اسرار» سرویس‌اکانت فهرست نشده باشد (و حتی اگر این مرجع به عنوان «اختیاری» علامت‌گذاری شده باشد)، پاد شروع به کار نخواهد کرد، و خطایی مبنی بر عدم انطباق مرجع اسرار ایجاد خواهد شد.

۱. اسراری که در «imagePullSecrets» یک پاد به آنها اشاره شده است، باید در فیلد «imagePullSecrets» سرویس‌اکانت وجود داشته باشند، پاد شروع به کار نخواهد کرد، و خطایی مبنی بر عدم انطباق مرجع اسرار کشیدن تصویر ایجاد خواهد شد.

وقتی یک پاد ایجاد یا به‌روزرسانی می‌کنید، این قوانین بررسی می‌شوند. اگر پاد از آنها پیروی نکند، شروع به کار نمی‌کند و یک پیام خطا مشاهده خواهید کرد.

اگر یک پاد از قبل در حال اجرا باشد و حاشیه‌نویسی `kubernetes.io/enforce-mountable-secrets` را به true تغییر دهید، یا ServiceAccount مرتبط را ویرایش کنید تا ارجاع به یک راز که پاد از قبل از آن استفاده می‌کند را حذف کنید، پاد به اجرای خود ادامه می‌دهد.

### node.kubernetes.io/exclude-from-external-load-balancers

نوع: برچسب

مثال: `node.kubernetes.io/exclude-from-external-load-balancers`

مورد استفاده در: Node

شما می‌توانید به گره‌های کارگر خاص برچسب اضافه کنید تا آنها را از لیست سرورهای backend مورد استفاده توسط متعادل‌کننده‌های بار خارجی حذف کنید.

دستور زیر را می‌توان برای حذف یک گره کارگر از لیست سرورهای backend در یک مجموعه backend استفاده کرد:

```shell
kubectl label nodes <node-name> node.kubernetes.io/exclude-from-external-load-balancers=true
```

### controller.kubernetes.io/pod-deletion-cost {#pod-deletion-cost}
نوع: حاشیه‌نویسی

مثال: `controller.kubernetes.io/pod-deletion-cost: "10"`

مورد استفاده در: Pod

این حاشیه‌نویسی برای تنظیم [Pod Deletion Cost](/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost) استفاده می‌شود که به کاربران اجازه می‌دهد تا ترتیب کوچک‌سازی ReplicaSet را تحت تأثیر قرار دهند.

مقدار حاشیه‌نویسی به یک نوع `int32` تجزیه می‌شود.

### cluster-autoscaler.kubernetes.io/enable-ds-eviction

نوع: حاشیه‌نویسی

مثال: `cluster-autoscaler.kubernetes.io/enable-ds-eviction: "true"`

مورد استفاده در: پاد

این حاشیه‌نویسی کنترل می‌کند که آیا یک پاد DaemonSet باید توسط یک ClusterAutoscaler حذف شود یا خیر.

این حاشیه‌نویسی باید در پادهای DaemonSet در مانیفست DaemonSet مشخص شود.

وقتی این حاشیه‌نویسی روی `"true"` تنظیم شود، ClusterAutoscaler مجاز است یک پاد DaemonSet را حذف کند، حتی اگر سایر قوانین معمولاً مانع از این کار شوند.

برای اینکه ClusterAutoscaler نتواند پادهای DaemonSet را حذف کند، می‌توانید این حاشیه‌نویسی را برای پادهای مهم DaemonSet روی `"false"` تنظیم کنید. اگر این حاشیه‌نویسی تنظیم نشده باشد، ClusterAutoscaler از رفتار کلی خود پیروی می‌کند (یعنی DaemonSets را بر اساس پیکربندی خود حذف می‌کند).

{{< note >}}
این حاشیه‌نویسی فقط روی پادهای DaemonSet تأثیر می‌گذارد.
{{< /note >}}

### kubernetes.io/ingress-bandwidth

نوع: حاشیه‌نویسی

مثال: `kubernetes.io/ingress-bandwidth: 10M`

مورد استفاده در: پاد

شما می‌توانید شکل‌دهی ترافیک با کیفیت سرویس را به یک پاد اعمال کنید و پهنای باند موجود آن را به طور مؤثر محدود کنید. ترافیک ورودی به یک پاد با شکل‌دهی بسته‌های صف‌بندی شده برای مدیریت مؤثر داده‌ها مدیریت می‌شود. برای محدود کردن پهنای باند در یک پاد، یک فایل JSON با تعریف شیء بنویسید و سرعت ترافیک داده را با استفاده از حاشیه‌نویسی `kubernetes.io/ingress-bandwidth` مشخص کنید. واحد مورد استفاده برای تعیین نرخ ورودی، بیت در ثانیه است، به عنوان [مقدار](/docs/reference/kubernetes-api/common-definitions/quantity/). به عنوان مثال، `10M` به معنی 10 مگابیت در ثانیه است.

{{< note >}}
حاشیه‌نویسی شکل‌دهی ترافیک ورودی یک ویژگی آزمایشی است. اگر می‌خواهید پشتیبانی از شکل‌دهی ترافیک را فعال کنید، باید افزونه `bandwidth` را به فایل پیکربندی CNI خود (پیش‌فرض `/etc/cni/net.d`) اضافه کنید و مطمئن شوید که فایل باینری در پوشه CNI bin شما (پیش‌فرض `/opt/cni/bin`) گنجانده شده است.
hashiernevisi sheklde
{{< /note >}}

### kubernetes.io/egress-bandwidth

نوع: حاشیه‌نویسی

مثال: `kubernetes.io/egress-bandwidth: 10M`

مورد استفاده در: پاد

ترافیک خروجی از یک پاد توسط پلیس کنترل می‌شود، که به سادگی بسته‌های اضافی از نرخ پیکربندی شده را حذف می‌کند. محدودیت‌هایی که روی یک پاد اعمال می‌کنید، بر پهنای باند سایر پادها تأثیری ندارد.

برای محدود کردن پهنای باند روی یک پاد، یک فایل JSON تعریف شیء بنویسید و سرعت ترافیک داده را با استفاده از حاشیه‌نویسی `kubernetes.io/egress-bandwidth` مشخص کنید. واحد مورد استفاده برای تعیین نرخ خروجی، بیت در ثانیه است، به عنوان [مقدار](/docs/reference/kubernetes-api/common-definitions/quantity/).

به عنوان مثال، `10M` به معنی 10 مگابیت در ثانیه است.

{{< note >}}
حاشیه‌نویسی شکل‌دهی ترافیک خروجی یک ویژگی آزمایشی است. اگر می‌خواهید پشتیبانی از شکل‌دهی ترافیک را فعال کنید، باید افزونه‌ی `bandwidth` را به فایل پیکربندی CNI خود (پیش‌فرض `/etc/cni/net.d`) اضافه کنید و مطمئن شوید که فایل باینری در پوشه‌ی CNI bin شما (پیش‌فرض `/opt/cni/bin`) قرار دارد.
{{< /note >}}

### beta.kubernetes.io/instance-type (deprecated)

نوع: برچسب


{{< note >}}
از نسخه ۱.۱۷ به بعد، این برچسب منسوخ شده و به جای آن از ‎[node.kubernetes.io/instance-type](#nodekubernetesioinstance-type)‎ استفاده می‌شود.
{{< /note >}}

### node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

نوع: برچسب

مثال: `node.kubernetes.io/instance-type: "m3.medium"`

مورد استفاده در: Node

Kubelet این را با نوع نمونه‌ای که توسط ارائه‌دهنده ابر تعریف شده است، پر می‌کند.

این فقط در صورتی تنظیم می‌شود که از یک ارائه‌دهنده ابر استفاده کنید. این تنظیم مفید است

اگر می‌خواهید بارهای کاری خاصی را به انواع نمونه خاصی اختصاص دهید، اما معمولاً می‌خواهید

برای انجام برنامه‌ریزی مبتنی بر منابع به زمان‌بند Kubernetes تکیه کنید.

شما باید برنامه‌ریزی را بر اساس ویژگی‌ها انجام دهید نه بر اساس انواع نمونه

(برای مثال: به جای نیاز به یک `g2.2xlarge`، به یک GPU نیاز دارید).

### failure-domain.beta.kubernetes.io/region (deprecated) {#failure-domainbetakubernetesioregion}

نوع: برچسب

{{< note >}}
از نسخه ۱.۱۷ به بعد، این برچسب به نفع ‎[topology.kubernetes.io/region](#topologykubernetesioregion)‎ منسوخ شده است.
{{< /note >}}

### failure-domain.beta.kubernetes.io/zone (deprecated) {#failure-domainbetakubernetesiozone}

نوع: برچسب

{{< note >}}
از نسخه ۱.۱۷ به بعد، این برچسب به نفع برچسب [topology.kubernetes.io/zone](#topologykubernetesiozone) منسوخ شده است.
{{< /note >}}

### pv.kubernetes.io/bind-completed {#pv-kubernetesiobind-completed}

نوع: حاشیه‌نویسی
مثال: `pv.kubernetes.io/bind-completed: "yes"`

مورد استفاده در: PersistentVolumeClaim

هنگامی که این حاشیه‌نویسی روی یک PersistentVolumeClaim (PVC) تنظیم می‌شود، نشان می‌دهد که چرخه عمر PVC از تنظیمات اتصال اولیه عبور کرده است. در صورت وجود، این اطلاعات نحوه تفسیر وضعیت اشیاء PVC توسط صفحه کنترل را تغییر می‌دهد.

مقدار این حاشیه‌نویسی برای Kubernetes اهمیتی ندارد.

### pv.kubernetes.io/bound-by-controller {#pv-kubernetesioboundby-controller}

نوع: حاشیه‌نویسی

مثال: `pv.kubernetes.io/bound-by-controller: "yes"`

مورد استفاده در: PersistentVolume، PersistentVolumeClaim

اگر این حاشیه‌نویسی روی یک PersistentVolume یا PersistentVolumeClaim تنظیم شده باشد، نشان می‌دهد که یک اتصال ذخیره‌سازی (PersistentVolume → PersistentVolumeClaim، یا PersistentVolumeClaim → PersistentVolume) توسط {{< glossary_tooltip text="controller" term_id="controller" >}} نصب شده است.

اگر حاشیه‌نویسی تنظیم نشده باشد و یک اتصال ذخیره‌سازی وجود داشته باشد، عدم وجود آن حاشیه‌نویسی به این معنی است که اتصال به صورت دستی انجام شده است.

مقدار این حاشیه‌نویسی مهم نیست.

### pv.kubernetes.io/provisioned-by {#pv-kubernetesiodynamically-provisioned}

نوع: حاشیه‌نویسی

مثال: `pv.kubernetes.io/provisioned-by: "kubernetes.io/rbd"`

مورد استفاده در: PersistentVolume

این حاشیه‌نویسی به PersistentVolume(PV) که به صورت پویا توسط Kubernetes فراهم شده است، اضافه می‌شود.

مقدار آن نام افزونه volume است که volume را ایجاد کرده است. این annotation هم برای کاربران (برای نشان دادن اینکه یک PV از کجا می‌آید) و هم برای Kubernetes (برای تشخیص PVهای فراهم شده به صورت پویا در تصمیماتش) کاربرد دارد.

### pv.kubernetes.io/migrated-to {#pv-kubernetesio-migratedto}

نوع: حاشیه‌نویسی

مثال: `pv.kubernetes.io/migrated-to: pd.csi.storage.gke.io`

مورد استفاده در: PersistentVolume، PersistentVolumeClaim

این به PersistentVolume(PV) و PersistentVolumeClaim(PVC) اضافه می‌شود که قرار است توسط درایور CSI مربوطه از طریق دروازه ویژگی `CSIMigration` به صورت پویا تهیه/حذف شوند.

هنگامی که این حاشیه‌نویسی تنظیم می‌شود، اجزای Kubernetes "خاموش" می‌شوند و `external-provisioner` روی اشیاء عمل می‌کند.

### statefulset.kubernetes.io/pod-name {#statefulsetkubernetesiopod-name}

نوع: برچسب

مثال: `statefulset.kubernetes.io/pod-name: "mystatefulset-7"`

مورد استفاده در: Pod

هنگامی که یک کنترلر StatefulSet یک Pod برای StatefulSet ایجاد می‌کند، صفحه کنترل
این برچسب را روی آن Pod تنظیم می‌کند. مقدار برچسب، نام Pod در حال ایجاد است.

برای جزئیات بیشتر به [برچسب نام Pod](/docs/concepts/workloads/controllers/statefulset/#pod-name-label) در موضوع StatefulSet مراجعه کنید.
in the StatefulSet topic for more details.

### scheduler.alpha.kubernetes.io/node-selector {#schedulerkubernetesnode-selector}

نوع: حاشیه‌نویسی

مثال: `scheduler.alpha.kubernetes.io/node-selector: "name-of-node-selector"`

مورد استفاده در: فضای نام

[PodNodeSelector](/docs/reference/access-authn-authz/admission-controllers/#podnodeselector)

از این کلید حاشیه‌نویسی برای اختصاص انتخابگرهای گره به پادها در فضاهای نام استفاده می‌کند.

### topology.kubernetes.io/region {#topologykubernetesioregion}

نوع: برچسب

مثال: `topology.kubernetes.io/region: "us-east-1"`

مورد استفاده در: Node، PersistentVolume

به [topology.kubernetes.io/zone](#topologykubernetesiozone) مراجعه کنید.

### topology.kubernetes.io/zone {#topologykubernetesiozone}

نوع: برچسب

مثال: `topology.kubernetes.io/zone: "us-east-1c"`

مورد استفاده در: Node، PersistentVolume

**در Node**: `kubelet` یا `cloud-controller-manager` خارجی این را با اطلاعات ارائه دهنده ابر پر می‌کند. این فقط در صورتی تنظیم می‌شود که از یک ارائه دهنده ابر استفاده کنید. با این حال، اگر در توپولوژی شما منطقی باشد، می‌توانید تنظیم این را روی گره‌ها در نظر بگیرید.

**در PersistentVolume**: ارائه دهندگان حجم آگاه از توپولوژی به طور خودکار محدودیت‌های وابستگی گره را روی `PersistentVolume` تنظیم می‌کنند.

یک منطقه نشان دهنده یک دامنه خرابی منطقی است. برای خوشه‌های Kubernetes معمول است که برای افزایش دسترسی، چندین منطقه را در بر بگیرند. در حالی که تعریف دقیق یک منطقه به پیاده‌سازی‌های زیرساختی واگذار شده است، ویژگی‌های مشترک یک منطقه شامل موارد زیر است: تأخیر بسیار کم شبکه در یک منطقه، ترافیک شبکه بدون هزینه در یک منطقه و استقلال از خرابی از سایر مناطق. به عنوان مثال، گره‌های درون یک منطقه ممکن است یک سوئیچ شبکه را به اشتراک بگذارند، اما گره‌های مناطق مختلف نباید این کار را انجام دهند.

یک منطقه نشان دهنده یک دامنه بزرگتر است که از یک یا چند منطقه تشکیل شده است.

برای خوشه‌های Kubernetes غیرمعمول است که چندین منطقه را در بر بگیرند.

در حالی که تعریف دقیق یک منطقه یا منطقه به پیاده‌سازی زیرساخت‌ها واگذار شده است،

ویژگی‌های مشترک یک منطقه شامل تأخیر شبکه بالاتر بین آنها نسبت به درون آنها،

هزینه غیر صفر برای ترافیک شبکه بین آنها و عدم وابستگی به سایر مناطق یا مناطق در صورت خرابی است.

به عنوان مثال، گره‌های درون یک منطقه ممکن است زیرساخت برق (مثلاً یک UPS یا ژنراتور) را به اشتراک بگذارند،

اما گره‌های مناطق مختلف معمولاً این کار را نمی‌کنند.

Kubernetes چند فرض در مورد ساختار مناطق و مناطق در نظر می‌گیرد:



1. مناطق و زون‌ها سلسله مراتبی هستند: زون‌ها زیرمجموعه‌های دقیقی از مناطق هستند و هیچ منطقه‌ای نمی‌تواند در 2 منطقه باشد

2. نام مناطق در مناطق مختلف منحصر به فرد است؛ برای مثال، منطقه "africa-east-1" ممکن است از مناطق "africa-east-1a" و "africa-east-1b" تشکیل شده باشد.


می‌توان با اطمینان فرض کرد که برچسب‌های توپولوژی تغییر نمی‌کنند.
اگرچه برچسب‌ها کاملاً قابل تغییر هستند، مصرف‌کنندگان آنها می‌توانند فرض کنند که یک گره مشخص
بدون تخریب و ایجاد مجدد، بین مناطق جابجا نمی‌شود.


Kubernetes می‌تواند از این اطلاعات به روش‌های مختلفی استفاده کند.

برای مثال، زمانبند به طور خودکار سعی می‌کند Podها را در یک ReplicaSet در بین گره‌ها

در یک خوشه تک منطقه‌ای پخش کند (برای کاهش تأثیر خرابی گره‌ها، به [kubernetes.io/hostname](#kubernetesiohostname) مراجعه کنید).

با خوشه‌های چند منطقه‌ای، این رفتار پخش برای مناطق نیز اعمال می‌شود (برای کاهش تأثیر خرابی منطقه).

این امر از طریق _SelectorSpreadPriority_ حاصل می‌شود.



_SelectorSpreadPriority_ یک جایگذاری با بهترین تلاش است. اگر مناطق موجود در خوشه شما ناهمگن باشند (به عنوان مثال: تعداد گره‌های مختلف، انواع گره‌های مختلف یا نیازهای منابع مختلف pod)، این جایگذاری ممکن است از توزیع برابر podهای شما در مناطق جلوگیری کند. در صورت تمایل، می‌توانید از مناطق همگن (تعداد و نوع گره‌های یکسان) برای کاهش احتمال توزیع نابرابر استفاده کنید.



زمانبند (از طریق گزاره _VolumeZonePredicate_) همچنین تضمین می‌کند که پادهایی که یک حجم مشخص را در اختیار دارند، فقط در همان منطقه با آن حجم قرار گیرند. حجم‌ها را نمی‌توان بین مناطق مختلف متصل کرد.


اگر `PersistentVolumeLabel` از برچسب‌گذاری خودکار PersistentVolumeهای شما پشتیبانی نمی‌کند، باید اضافه کردن برچسب‌ها را به صورت دستی (یا اضافه کردن پشتیبانی از `PersistentVolumeLabel`) در نظر بگیرید.
با `PersistentVolumeLabel`، زمان‌بندی از نصب Podها در یک منطقه متفاوت جلوگیری می‌کند.
اگر زیرساخت شما این محدودیت را ندارد، اصلاً نیازی به اضافه کردن برچسب‌های منطقه به Volumeها ندارید.

### volume.beta.kubernetes.io/storage-provisioner (منسوخ شده)

نوع: حاشیه‌نویسی


مثال: `volume.beta.kubernetes.io/storage-provisioner: "k8s.io/minikube-hostpath"`

مورد استفاده در: PersistentVolumeClaim

این حاشیه‌نویسی از نسخه ۱.۲۳ منسوخ شده است. به [volume.kubernetes.io/storage-provisioner](#volume-kubernetes-io-storage-provisioner) مراجعه کنید.

### volume.beta.kubernetes.io/storage-class (منسوخ شده)

نوع: حاشیه‌نویسی

مثال: `volume.beta.kubernetes.io/storage-class: "example-class"`

مورد استفاده در: PersistentVolume، PersistentVolumeClaim

این حاشیه‌نویسی می‌تواند برای PersistentVolume(PV) یا PersistentVolumeClaim(PVC) استفاده شود تا نام [StorageClass](/docs/concepts/storage/storage-classes/) مشخص شود.
هنگامی که هم ویژگی `storageClassName` و هم حاشیه‌نویسی `volume.beta.kubernetes.io/storage-class` مشخص شده باشند، حاشیه‌نویسی `volume.beta.kubernetes.io/storage-class` بر ویژگی `storageClassName` اولویت دارد.

این حاشیه‌نویسی منسوخ شده است. در عوض، فیلد [`storageClassName`](/docs/concepts/storage/persistent-volumes/#class) را برای PersistentVolumeClaim یا PersistentVolume تنظیم کنید.

### volume.beta.kubernetes.io/mount-options (منسوخ شده) {#mount-options}

نوع: حاشیه‌نویسی

مثال : `volume.beta.kubernetes.io/mount-options: "ro,soft"`

 مورد استفاده در: PersistentVolume

یک مدیر Kubernetes می‌تواند گزینه‌های اضافی [mount options](/docs/concepts/storage/persistent-volumes/#mount-options) را برای زمانی که یک PersistentVolume روی یک گره mount می‌شود، مشخص کند.


### volume.kubernetes.io/storage-provisioner  {#volume-kubernetes-io-storage-provisioner}

نوع: حاشیه‌نویسی

Used on: PersistentVolumeClaim

This annotation is added to a PVC that is supposed to be dynamically provisioned.
Its value is the name of a volume plugin that is supposed to provision a volume
for this PVC.

### volume.kubernetes.io/selected-node



مورد استفاده در: PersistentVolumeClaim

این حاشیه‌نویسی به یک PVC اضافه می‌شود که توسط یک زمانبند فعال می‌شود تا به صورت پویا آماده‌سازی شود. مقدار آن نام گره انتخاب شده است.


### volumes.kubernetes.io/controller-managed-attach-detach

نوع: حاشیه‌نویسی

مورد استفاده در: گره


اگر یک گره دارای حاشیه‌نویسی `volumes.kubernetes.io/controller-managed-attach-detach` باشد، عملیات اتصال و جدا کردن حافظه آن توسط _volume attach/detach_ مدیریت می‌شود. {{< glossary_tooltip text="controller" term_id="controller" >}}

ارزش حاشیه‌نویسی مهم نیست.

### node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

نوع: برچسب

مثال :`node.kubernetes.io/windows-build: "10.0.17763"`

مورد استفاده در: Node

وقتی kubelet روی مایکروسافت ویندوز اجرا می‌شود، به‌طور خودکار گره خود را برچسب‌گذاری می‌کند تا نسخه ویندوز سرور مورد استفاده را ثبت کند.


مقدار برچسب در قالب "MajorVersion.MinorVersion.BuildNumber" است.

### storage.alpha.kubernetes.io/migrated-plugins {#storagealphakubernetesiomigrated-plugins}

نوع: حاشیه‌نویسی


مثال:`storage.alpha.kubernetes.io/migrated-plugins: "kubernetes.io/cinder"`


مورد استفاده در: CSINode (یک رابط برنامه‌نویسی API افزونه)
این حاشیه‌نویسی به طور خودکار برای شیء CSINode که به گره‌ای که CSIDriver را نصب می‌کند، نگاشت می‌شود، اضافه می‌شود. این حاشیه‌نویسی نام افزونه درون‌درختی افزونه منتقل شده را نشان می‌دهد. مقدار آن به نوع ذخیره‌سازی ارائه‌دهنده ابر درون‌درختی خوشه شما بستگی دارد.

برای مثال، اگر نوع ذخیره‌سازی ارائه‌دهنده ابر درون‌شاخه‌ای «CSIMigrationvSphere» باشد، نمونه CSINodes برای گره باید با این موارد به‌روزرسانی شود:
`storage.alpha.kubernetes.io/migrated-plugins: "kubernetes.io/vsphere-volume"`

### service.kubernetes.io/headless {#servicekubernetesioheadless}

نوع: برچسب


مثال: `service.kubernetes.io/headless: ""`

مورد استفاده در: Endpoints

صفحه کنترل این برچسب را به شیء Endpoints اضافه می‌کند وقتی که سرویس مالک Headless باشد.

برای کسب اطلاعات بیشتر، [Headless Services](/docs/concepts/services-networking/service/#headless-services) را مطالعه کنید.

### service.kubernetes.io/topology-aware-hints (منسوخ شده) {#servicekubernetesiotopology-aware-hints}

مثال: `service.kubernetes.io/topology-aware-hints: "Auto"`

مورد استفاده در: سرویس


این حاشیه‌نویسی برای فعال کردن _topology aware hints_ روی سرویس‌ها استفاده می‌شد. Topology aware hints از آن زمان تغییر نام داده است: این مفهوم اکنون [topology aware routing](/docs/concepts/services-networking/topology-aware-routing/) نامیده می‌شود.
تنظیم حاشیه‌نویسی روی `Auto`، روی یک سرویس، صفحه کنترل Kubernetes را پیکربندی کرد تا نکات توپولوژی را روی EndpointSlices مرتبط با آن سرویس اضافه کند. همچنین می‌توانید به صراحت حاشیه‌نویسی را روی `Disabled` تنظیم کنید.

اگر نسخه‌ای از Kubernetes قدیمی‌تر از {{< skew currentVersion >}} را اجرا می‌کنید، مستندات آن نسخه Kubernetes را بررسی کنید تا ببینید مسیریابی آگاه از توپولوژی در آن نسخه چگونه کار می‌کند.

هیچ مقدار معتبر دیگری برای این حاشیه‌نویسی وجود ندارد. اگر نمی‌خواهید نکات مربوط به توپولوژی برای یک سرویس وجود داشته باشد، این حاشیه‌نویسی را اضافه نکنید.

### service.kubernetes.io/topology-mode

نوع: حاشیه‌نویسی


مثال: `service.kubernetes.io/topology-mode: Auto`


مورد استفاده در: Service

این حاشیه‌نویسی روشی برای تعریف نحوه مدیریت توپولوژی شبکه توسط سرویس‌ها ارائه می‌دهد؛ برای مثال، می‌توانید یک سرویس را طوری پیکربندی کنید که Kubernetes ترجیح دهد ترافیک بین
کلاینت و سرور را در یک منطقه توپولوژی واحد نگه دارد.
در برخی موارد، این می‌تواند به کاهش هزینه‌ها یا بهبود عملکرد شبکه کمک کند.


برای جزئیات بیشتر به [Topology Aware Routing](/docs/concepts/services-networking/topology-aware-routing/) مراجعه کنید.

### kubernetes.io/service-name {#kubernetesioservice-name}

نوع: برچسب


مثال: `kubernetes.io/service-name: "my-website"`

مورد استفاده در: EndpointSlice

Kubernetes با استفاده از این برچسب، [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) را با [Services](/docs/concepts/services-networking/service/) مرتبط می‌کند.

این برچسب {{< glossary_tooltip term_id="name" text="name">}} از سرویسی را که EndpointSlice از آن پشتیبانی می‌کند، ثبت می‌کند. همه EndpointSliceها باید این برچسب را روی نام سرویس مرتبط خود تنظیم کنند.

### kubernetes.io/service-account.name

نوع: Annotation

مثال: `kubernetes.io/service-account.name: "sa-name"`

مورد استفاده در: راز

این حاشیه‌نویسی {{< glossary_tooltip term_id="name" text="name">}} از حساب سرویسی را ثبت می‌کند که توکن (ذخیره شده در راز از نوع `kubernetes.io/service-account-token`) نشان دهنده آن است.

### kubernetes.io/service-account.uid

نوع: Annotation

مثال: `kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da`

Used on: Secret

مورد استفاده در: Secret

این حاشیه‌نویسی {{< glossary_tooltip term_id="uid" text="unique ID" >}} از حساب سرویسی که توکن (ذخیره شده در راز از نوع `kubernetes.io/service-account-token`) نشان می‌دهد را ثبت می‌کند.

### kubernetes.io/legacy-token-last-used

Type: Label

نوع: Label

مثال: `kubernetes.io/legacy-token-last-used: 2022-10-24`

مورد استفاده در: راز

صفحه کنترل فقط این برچسب را به رازهایی اضافه می‌کند که نوع آنها `kubernetes.io/service-account-token` باشد.

مقدار این برچسب، تاریخ (فرمت ISO 8601، منطقه زمانی UTC) را ثبت می‌کند که صفحه کنترل
آخرین درخواستی را مشاهده کرده است که در آن کلاینت با استفاده از توکن حساب سرویس احراز هویت شده است.

اگر یک توکن قدیمی آخرین بار قبل از اینکه خوشه این ویژگی را دریافت کند (که در Kubernetes نسخه 1.26 اضافه شده است) استفاده شده باشد،

در این صورت برچسب تنظیم نشده است.

### kubernetes.io/legacy-token-invalid-since


نوع: Label

مثال: `kubernetes.io/legacy-token-invalid-since: 2023-10-27`

مورد استفاده در: راز

صفحه کنترل به طور خودکار این برچسب را به رازهای تولید شده خودکار که نوع `kubernetes.io/service-account-token` دارند اضافه می‌کند. این برچسب، توکن مبتنی بر راز را برای احراز هویت نامعتبر علامت‌گذاری می‌کند. مقدار این برچسب، تاریخ (فرمت ISO 8601، منطقه زمانی UTC) را ثبت می‌کند، زمانی که صفحه کنترل تشخیص می‌دهد که راز تولید شده خودکار برای مدت زمان مشخصی (به طور پیش‌فرض یک سال) استفاده نشده است.

### endpoints.kubernetes.io/managed-by (deprecated) {#endpoints-kubernetes-io-managed-by}

نوع: Label

مثال: `endpoints.kubernetes.io/managed-by: endpoint-controller`

مورد استفاده در: نقاط پایانی

این برچسب به صورت داخلی برای علامت‌گذاری اشیاء نقاط پایانی که توسط Kubernetes ایجاد شده‌اند (برخلاف نقاط پایانی ایجاد شده توسط کاربران یا کنترل‌کننده‌های خارجی) استفاده می‌شود.

{{< note >}}
API [Endpoints](/docs/reference/kubernetes-api/service-resources/endpoints-v1/) به نفع [EndpointSlice](/docs/reference/kubernetes-api/service-resources/endpoint-slice-v1/) منسوخ شده است.
{{< /note >}}

### endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

نوع: Label

مثال: `endpointslice.kubernetes.io/managed-by: endpointslice-controller.k8s.io`

مورد استفاده در: EndpointSlices

این برچسب برای نشان دادن کنترل‌کننده یا موجودیتی که EndpointSlice را مدیریت می‌کند، استفاده می‌شود. هدف این برچسب
فعال کردن مدیریت اشیاء EndpointSlice مختلف توسط کنترل‌کننده‌ها یا موجودیت‌های مختلف در یک خوشه است. مقدار `endpointslice-controller.k8s.io` نشان دهنده یک شیء EndpointSlice است که به طور خودکار توسط Kubernetes برای یک سرویس با {{< glossary_tooltip text="selectors" term_id="selector" >}} ایجاد شده است.

### endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}


نوع: Label

مثال: `endpointslice.kubernetes.io/skip-mirror: "true"`

مورد استفاده در: نقاط پایانی

این برچسب را می‌توان روی یک منبع Endpoints روی `"true"` تنظیم کرد تا نشان دهد که کنترلر EndpointSliceMirroring نباید این منبع را با EndpointSlices منعکس کند.



### service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}



نوع: Label

مثال: `service.kubernetes.io/service-proxy-name: "foo-bar"`

مورد استفاده در: سرویس

kube-proxy این برچسب را برای پروکسی سفارشی دارد که کنترل سرویس را به پروکسی سفارشی واگذار می‌کند.


### experimental.windows.kubernetes.io/isolation-type (deprecated) {#experimental-windows-kubernetes-io-isolation-type}

نوع: حاشیه‌نویسی

مثال: `experimental.windows.kubernetes.io/isolation-type: "hyperv"`

مورد استفاده در: پاد

این حاشیه‌نویسی برای اجرای کانتینرهای ویندوز با ایزوله‌سازی Hyper-V استفاده می‌شود.

{{< note >}}
از نسخه ۱.۲۰ به بعد، این حاشیه‌نویسی منسوخ شده است.

پشتیبانی آزمایشی از Hyper-V در نسخه ۱.۲۱ حذف شد.
{{< /note >}}

### ingressclass.kubernetes.io/is-default-class

Type: Annotation

نوع: حاشیه‌نویسی

مثال: `ingressclass.kubernetes.io/is-default-class: "true"`

مورد استفاده در: IngressClass

هنگامی که یک منبع IngressClass این حاشیه‌نویسی را روی `"true"` تنظیم کرده باشد، منبع جدید Ingress
بدون کلاس مشخص شده، این کلاس پیش‌فرض را به خود اختصاص خواهد داد.

### nginx.ingress.kubernetes.io/configuration-snippet

نوع: حاشیه‌نویسی

مثال: `nginx.ingress.kubernetes.io/configuration-snippet: " more_set_headers \"شناسه درخواست: $req_id\";\nmore_set_headers \"مثال: 42\";\n"`

مورد استفاده در: Ingress

شما می‌توانید از این حاشیه‌نویسی برای تنظیم پیکربندی اضافی روی Ingress که از [NGINX Ingress Controller](https://github.com/kubernetes/ingress-nginx/).استفاده می‌کند، استفاده کنید.

حاشیه‌ی `configuration-snippet` از نسخه‌ی ۱.۹.۰ کنترل‌کننده‌ی ingress به طور پیش‌فرض نادیده گرفته می‌شود.

برای استفاده از این حاشیه‌نویسی، باید تنظیمات `allow-snippet-annotations.` در کنترل‌کننده‌ی ingress NGINX به صراحت فعال شود.


### kubernetes.io/ingress.class (deprecated)

نوع: حاشیه‌نویسی

مورد استفاده در: Ingress

{{< note >}}

از نسخه ۱.۱۸ به بعد، این حاشیه‌نویسی به نفع `spec.ingressClassName` منسوخ شده است.
{{< /note >}}

### kubernetes.io/cluster-service (deprecated) {#kubernetes-io-cluster-service}

نوع: برچسب

مثال: `kubernetes.io/cluster-service: "true"`

مورد استفاده در: سرویس

این برچسب نشان می‌دهد که سرویس، در صورتی که مقدار آن روی true تنظیم شده باشد، به خوشه سرویس ارائه می‌دهد.

هنگامی که `kubectl cluster-info` را اجرا می‌کنید، ابزار برای سرویس‌هایی که این برچسب روی true تنظیم شده است، پرس‌وجو می‌کند.

با این حال، تنظیم این برچسب روی هر سرویسی منسوخ شده است.
### storageclass.kubernetes.io/is-default-class

نوع: حاشیه‌نویسی

مثال: `storageclass.kubernetes.io/is-default-class: "true"`

مورد استفاده در: StorageClass

هنگامی که یک منبع StorageClass واحد این حاشیه‌نویسی را روی `"true"` تنظیم کرده باشد، منبع جدید PersistentVolumeClaim بدون کلاس مشخص شده، این کلاس پیش‌فرض را به خود اختصاص خواهد داد.
n

### alpha.kubernetes.io/provided-node-ip (alpha) {#alpha-kubernetes-io-provided-node-ip}

نوع: حاشیه‌نویسی

مثال: `alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

مورد استفاده در: Node

kubelet می‌تواند این حاشیه‌نویسی را روی یک Node تنظیم کند تا آدرس IPv4 و/یا IPv6 پیکربندی شده آن را نشان دهد.

هنگامی که kubelet با پرچم `--cloud-provider` که روی هر مقداری تنظیم شده است (شامل ارائه دهندگان ابری خارجی و قدیمی درون درختی) شروع می‌شود، این حاشیه‌نویسی را روی Node تنظیم می‌کند تا یک آدرس IP را که از پرچم خط فرمان (`--node-ip`) تنظیم شده است، نشان دهد. این IP توسط ارائه دهنده ابر به عنوان معتبر تأیید می‌شود.

### batch.kubernetes.io/job-completion-index

نوع: حاشیه‌نویسی، برچسب

مثال: `batch.kubernetes.io/job-completion-index: "3"`

مورد استفاده در: Pod

کنترلر Job در kube-controller-manager این را به عنوان یک برچسب و حاشیه‌نویسی برای Podها تنظیم می‌کند
ایجاد شده با Indexed [completion mode](/docs/concepts/workloads/controllers/job/#completion-mode).

توجه داشته باشید که [PodIndexLabel](/docs/reference/command-line-tools-reference/feature-gates/)
برای اضافه شدن این به عنوان یک pod **label**، باید feature gate فعال باشد، در غیر این صورت فقط یک حاشیه‌نویسی خواهد بود.
### batch.kubernetes.io/cronjob-scheduled-timestamp

Type: Annotation

Example: `batch.kubernetes.io/cronjob-scheduled-timestamp: "2016-05-19T03:00:00-07:00"`

مورد استفاده در: کارها و پادهای کنترل‌شده توسط CronJobs

این حاشیه‌نویسی برای ثبت برچسب زمانی ایجاد اولیه (مورد انتظار) برای یک کار، زمانی که آن کار بخشی از یک CronJob است، استفاده می‌شود.

صفحه کنترل مقدار آن برچسب زمانی را با فرمت RFC3339 تنظیم می‌کند. اگر کار متعلق به یک CronJob با یک منطقه زمانی مشخص شده باشد، آنگاه برچسب زمانی در آن منطقه زمانی است. در غیر این صورت، برچسب زمانی در زمان محلی کنترلر-مدیر است.

### kubectl.kubernetes.io/default-container

نوع: حاشیه‌نویسی

مثال: `kubectl.kubernetes.io/default-container: "front-end-app"`

مقدار حاشیه‌نویسی، نام کانتینر پیش‌فرض برای این پاد است.

برای مثال، `kubectl logs` یا `kubectl exec` بدون فلگ `-c` یا `--container` از این کانتینر پیش‌فرض استفاده خواهد کرد.

### kubectl.kubernetes.io/default-logs-container (deprecated)

نوع: حاشیه‌نویسی

مثال: `kubectl.kubernetes.io/default-logs-container: "front-end-app"`

مقدار حاشیه‌نویسی، نام کانتینری است که کانتینر ثبت وقایع پیش‌فرض برای این پاد است. برای مثال، `kubectl logs` بدون فلگ `-c` یا `--container` از این کانتینر پیش‌فرض استفاده خواهد کرد.

{{< note >}}
این حاشیه‌نویسی منسوخ شده است. شما باید به جای آن از حاشیه‌نویسی [`kubectl.kubernetes.io/default-container`](#kubectl-kubernetes-io-default-container) استفاده کنید. نسخه‌های ۱.۲۵ و جدیدتر Kubernetes این حاشیه‌نویسی را نادیده می‌گیرند.
{{< /note >}}

### kubectl.kubernetes.io/last-applied-configuration

نوع: حاشیه‌نویسی

مثال: _see following snippet_
```yaml
    kubectl.kubernetes.io/last-applied-configuration: >
      {"apiVersion":"apps/v1","kind":"Deployment","metadata":{"annotations":{},"name":"example","namespace":"default"},"spec":{"selector":{"matchLabels":{"app.kubernetes.io/name":foo}},"template":{"metadata":{"labels":{"app.kubernetes.io/name":"foo"}},"spec":{"containers":[{"image":"container-registry.example/foo-bar:1.42","name":"foo-bar","ports":[{"containerPort":42}]}]}}}}
```

مورد استفاده در: همه اشیاء

ابزار خط فرمان kubectl از این حاشیه‌نویسی به عنوان یک مکانیسم قدیمی برای ردیابی تغییرات استفاده می‌کند. این مکانیسم توسط
[Server-side apply](/docs/reference/using-api/server-side-apply/) جایگزین شده است.

### kubectl.kubernetes.io/restartedAt {#kubectl-k8s-io-restart-at}

نوع: حاشیه‌نویسی

مثال: `kubectl.kubernetes.io/restartedAt: "2024-06-21T17:27:41Z"`

مورد استفاده در: Deployment، ReplicaSet، StatefulSet، DaemonSet، Pod

این حاشیه‌نویسی شامل آخرین زمان راه‌اندازی مجدد یک منبع (Deployment، ReplicaSet، StatefulSet یا DaemonSet) است،

جایی که kubectl یک راه‌اندازی مجدد را برای ایجاد اجباری Podهای جدید آغاز کرده است.

دستور `kubectl rollout restart <RESOURCE>` با وصله‌بندی فراداده‌های قالب تمام Podهای منبع با این حاشیه‌نویسی، راه‌اندازی مجدد را آغاز می‌کند. در مثال بالا، آخرین زمان راه‌اندازی مجدد به صورت 21 ژوئن 2024 ساعت 17:27:41 UTC نشان داده شده است.
نباید فرض کنید که این حاشیه‌نویسی، تاریخ/زمان جدیدترین به‌روزرسانی را نشان می‌دهد؛

ممکن است از آخرین به‌روزرسانی دستی، تغییر جداگانه‌ای ایجاد شده باشد.

اگر این حاشیه‌نویسی را به صورت دستی روی یک Pod تنظیم کنید، هیچ اتفاقی نمی‌افتد. اثر جانبی راه‌اندازی مجدد از

نحوه عملکرد مدیریت بار کاری و قالب‌بندی Pod ناشی می‌شود.

### endpoints.kubernetes.io/over-capacity

نوع: حاشیه‌نویسی

مثال: `endpoints.kubernetes.io/over-capacity:truncated`

مورد استفاده در: نقاط پایانی

اگر {{< glossary_tooltip text="control plane" term_id="control-plane" >}} مرتبط بیش از ۱۰۰۰ نقطه پایانی پشتیبان داشته باشد، {{< glossary_tooltip term_id="service" >}} این حاشیه‌نویسی را به یک شیء [Endpoints](/docs/concepts/service-networking/service/#endpoints) اضافه می‌کند.

### endpoints.kubernetes.io/last-change-trigger-time

نوع: حاشیه‌نویسی

مثال: `endpoints.kubernetes.io/last-change-trigger-time: "2023-07-20T04:45:21Z"`

مورد استفاده در: نقاط پایانی

این حاشیه‌نویسی روی یک شیء [Endpoints](/docs/concepts/services-networking/service/#endpoints) تنظیم شده است که

نشانگر مهر زمانی است (مهر زمانی در قالب رشته تاریخ-زمان RFC 3339 ذخیره می‌شود. به عنوان مثال، '2018-10-22T19:32:52.1Z'). این مهر زمانی

آخرین تغییر در یک شیء Pod یا Service است که باعث تغییر در شیء Endpoints شده است.

### control-plane.alpha.kubernetes.io/leader (deprecated) {#control-plane-alpha-kubernetes-io-leader}

نوع: حاشیه‌نویسی


مثال: `control-plane.alpha.kubernetes.io/leader={"holderIdentity":"controller-0","leaseDurationSeconds":15,"acquireTime":"2023-01-19T13:12:57Z","renewTime":"2023-01-19T13:13:54Z","leaderTransitions":1}`

مورد استفاده در: نقاط پایانی

قبلاً حاشیه‌نویسی {{< glossary_tooltip text="control plane" term_id="control-plane" >}} روی یک شیء [Endpoints](/docs/concepts/services-networking/service/#endpoints) تنظیم شده بود. این حاشیه‌نویسی جزئیات زیر را ارائه می‌داد:

- رهبر فعلی کیست.
- زمانی که رهبری فعلی به دست آمده است.
- مدت زمان اجاره (رهبری) به ثانیه.
- زمانی که اجاره فعلی (رهبری فعلی) باید تمدید شود.
- تعداد انتقال‌های رهبری که در گذشته اتفاق افتاده است.

کوبرنتیز اکنون از [Leases](/docs/concepts/architecture/leases/) برای مدیریت تخصیص رهبر برای صفحه کنترل کوبرنتیز استفاده می‌کند.

### batch.kubernetes.io/job-tracking (deprecated) {#batch-kubernetes-io-job-tracking}

نوع: حاشیه‌نویسی

مثال: `batch.kubernetes.io/job-tracking: ""`

مورد استفاده در: مشاغل

وجود این حاشیه‌نویسی در یک شغل نشان می‌دهد که صفحه کنترل در حال ردیابی وضعیت شغل با استفاده از نهایی‌سازها است (/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers).

اضافه کردن یا حذف این حاشیه‌نویسی دیگر تأثیری ندارد (Kubernetes نسخه ۱.۲۷ و بالاتر)

همه مشاغل با نهایی‌سازها ردیابی می‌شوند.

### job-name (deprecated) {#job-name}

نوع: برچسب
مثال: `job-name: "pi"`
مورد استفاده در: Jobها و Podهای کنترل‌شده توسط Jobها
{{< note >}}
از Kubernetes 1.27 به بعد، این برچسب منسوخ شده است.
Kubernetes 1.27 و جدیدتر این برچسب را نادیده می‌گیرند و از برچسب پیشوند `job-name` استفاده می‌کنند.
{{< /note >}}

### controller-uid (deprecated) {#controller-uid}

نوع: برچسب

مثال: `controller-uid: "$UID"`

مورد استفاده در: Jobها و Podهای کنترل‌شده توسط Jobها

{{< note >}}
از Kubernetes 1.27 به بعد، این برچسب منسوخ شده است.
Kubernetes 1.27 و جدیدتر این برچسب را نادیده می‌گیرند و از برچسب پیشوند `controller-uid` استفاده می‌کنند.
{{< /note >}}

### batch.kubernetes.io/job-name {#batchkubernetesio-job-name}

نوع: برچسب

مثال: `batch.kubernetes.io/job-name: "pi"`

مورد استفاده در: کارها و پادهای کنترل‌شده توسط کارها

این برچسب به عنوان روشی کاربرپسند برای دریافت پادهای مربوط به یک کار استفاده می‌شود.

`job-name` از `name` کار گرفته شده و روشی آسان برای دریافت پادهای مربوط به کار را فراهم می‌کند.
### batch.kubernetes.io/controller-uid {#batchkubernetesio-controller-uid}

نوع: برچسب

مثال: `batch.kubernetes.io/controller-uid: "$UID"`

مورد استفاده در: کارها و پادهای کنترل‌شده توسط کارها

این برچسب به عنوان یک روش برنامه‌نویسی برای دریافت تمام پادهای مربوط به یک کار استفاده می‌شود.

`controller-uid` یک شناسه منحصر به فرد است که در فیلد `selector` تنظیم می‌شود تا کنترل‌کننده کار بتواند تمام پادهای مربوطه را دریافت کند.

### scheduler.alpha.kubernetes.io/defaultTolerations {#scheduleralphakubernetesio-defaulttolerations}

نوع: حاشیه‌نویسی

مثال: `scheduler.alpha.kubernetes.io/defaultTolerations: '[{"operator": "Equal", "value": "value1", "effect": "NoSchedule", "key": "dedicated-node"}]'`

مورد استفاده در: فضای نام

این حاشیه‌نویسی نیاز به فعال بودن کنترل‌کننده پذیرش [PodTolerationRestriction](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction) دارد. این کلید حاشیه‌نویسی امکان اختصاص دادن تلرانس‌ها به یک نیم اسپیس را فراهم می‌کند و هر پاد جدیدی که در این نیم اسپیس ایجاد شود، این تلرانس‌ها را اضافه می‌کند.

### scheduler.alpha.kubernetes.io/tolerationsWhitelist {#schedulerkubernetestolerations-whitelist}

Type: Annotation

Example: `scheduler.alpha.kubernetes.io/tolerationsWhitelist: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'`

مورد استفاده در: نیم اسپیس 

این حاشیه‌نویسی فقط زمانی مفید است که (Alpha)
[PodTolerationRestriction](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
کنترل‌کننده پذیرش فعال باشد. مقدار حاشیه‌نویسی یک سند JSON است که لیستی از تحمل‌های مجاز را برای فضای نامی که حاشیه‌نویسی می‌کند، تعریف می‌کند. وقتی یک Pod ایجاد می‌کنید یا تحمل‌های آن را تغییر می‌دهید، سرور API تحمل‌ها را بررسی می‌کند تا ببیند آیا در لیست مجاز ذکر شده‌اند یا خیر.

Pod فقط در صورتی پذیرفته می‌شود که بررسی موفقیت‌آمیز باشد.

### scheduler.alpha.kubernetes.io/preferAvoidPods (deprecated) {#scheduleralphakubernetesio-preferavoidpods}

نوع: حاشیه‌نویسی

مورد استفاده در: Node

این حاشیه‌نویسی نیاز به فعال بودن [NodePreferAvoidPods scheduling plugin](/docs/reference/scheduling/config/#scheduling-plugins) دارد. این افزونه از Kubernetes 1.22 منسوخ شده است.
به جای آن از [Taints and Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/) استفاده کنید.


### node.kubernetes.io/not-ready

نوع: نقص

مثال: `node.kubernetes.io/not-ready: "NoExecute"`

مورد استفاده در: Node

کنترل‌کننده Node با نظارت بر سلامت یک Node، آماده بودن آن را تشخیص می‌دهد و بر این اساس، این نقص را اضافه یا حذف می‌کند.

### node.kubernetes.io/unreachable

نوع: taint

مثال: `node.kubernetes.io/unreachable: "NoExecute"`

مورد استفاده در: Node

کنترل‌کننده Node، taint را به گره‌ای که مطابق با `[NodeCondition](/docs/concepts/architecture/nodes/#condition) `Ready` `نامشخص` است، اضافه می‌کند.

### node.kubernetes.io/unschedulable

نوع: taint

مثال: `node.kubernetes.io/unschedulable: "NoSchedule"`

مورد استفاده در: Node

taint هنگام مقداردهی اولیه گره به آن اضافه می‌شود تا از شرایط رقابتی جلوگیری شود.

### node.kubernetes.io/memory-pressure

نوع: taint

مثال: `node.kubernetes.io/memory-pressure: "NoSchedule"`

مورد استفاده در: Node

kubelet فشار حافظه را بر اساس `memory.available` و `allocatableMemory.available` مشاهده شده در یک Node تشخیص می‌دهد. مقادیر مشاهده شده سپس با آستانه‌های مربوطه که می‌توان در kubelet تنظیم کرد مقایسه می‌شوند تا مشخص شود که آیا شرط Node و taint باید اضافه/حذف شوند یا خیر.

### node.kubernetes.io/disk-pressure

نوع: taint

مثال: `node.kubernetes.io/disk-pressure :"NoSchedule"`

مورد استفاده در: Node

kubelet فشار دیسک را بر اساس `imagefs.available`، `imagefs.inodesFree`، `nodefs.available` و `nodefs.inodesFree` (فقط لینوکس) مشاهده شده در یک Node تشخیص می‌دهد.

مقادیر مشاهده شده سپس با آستانه‌های مربوطه که می‌توانند در kubelet تنظیم شوند، مقایسه می‌شوند تا مشخص شود که آیا وضعیت Node و taint باید اضافه/حذف شوند یا خیر.

### node.kubernetes.io/network-unavailable

نوع: Taint

مثال: `node.kubernetes.io/network-unavailable: "NoSchedule"`

مورد استفاده در: Node

این مورد در ابتدا توسط kubelet تنظیم می‌شود، زمانی که ارائه‌دهنده ابری مورد استفاده، نیازی به پیکربندی شبکه اضافی نشان می‌دهد. تنها زمانی که مسیر روی ابر به درستی پیکربندی شود، آلودگی توسط ارائه‌دهنده ابری حذف خواهد شد.

### node.kubernetes.io/pid-pressure

نوع: taint

مثال: `node.kubernetes.io/pid-pressure: "NoSchedule"`

مورد استفاده در: Node

kubelet مقدار D اندازه `/proc/sys/kernel/pid_max` و PID های مصرف شده توسط Kubernetes روی یک گره را بررسی می‌کند تا تعداد PID های موجود را که به عنوان معیار `pid.available` شناخته می‌شوند، بدست آورد. سپس این معیار با آستانه مربوطه که می‌توان روی kubelet تنظیم کرد، مقایسه می‌شود تا مشخص شود که آیا شرایط گره و taint باید اضافه/حذف شوند یا خیر.

### node.kubernetes.io/out-of-service

نوع: taint

مثال: `node.kubernetes.io/out-of-service:NoExecute`

مورد استفاده در: Node

کاربر می‌تواند به صورت دستی taint را به یک Node اضافه کند و آن را خارج از سرویس علامت‌گذاری کند.

اگر یک Node با این taint خارج از سرویس علامت‌گذاری شود، Podهای روی Node

در صورت عدم وجود تلورانس‌های منطبق بر روی آن، به زور حذف می‌شوند و

عملیات جداسازی حجم برای Podهایی که در Node خاتمه می‌یابند، بلافاصله اتفاق می‌افتد.

این امر به Podهای روی Node خارج از سرویس اجازه می‌دهد تا به سرعت در یک Node دیگر بازیابی شوند.

{{< caution >}}
برای جزئیات بیشتر در مورد زمان و نحوه استفاده از این taint به [Non-graceful node shutdown](/docs/concepts/architecture/nodes/#non-graceful-node-shutdown) مراجعه کنید.
{{< /caution >}}

### node.cloudprovider.kubernetes.io/uninitialized

نوع: Taint

مثال: `node.cloudprovider.kubernetes.io/uninitialized: "NoSchedule"`

مورد استفاده در: گره

این نقص را روی یک گره تنظیم می‌کند تا وقتی که kubelet با ارائه‌دهنده ابری "خارجی" شروع می‌شود، آن را به عنوان غیرقابل استفاده علامت‌گذاری کند، تا زمانی که یک کنترل‌کننده از cloud-controller-manager این گره را مقداردهی اولیه کند و سپس نقص را حذف کند.

### node.cloudprovider.kubernetes.io/shutdown

نوع: Taint

مثال: `node.cloudprovider.kubernetes.io/shutdown: "NoSchedule"`

مورد استفاده در: گره

اگر یک گره در حالت خاموش شدن مشخص شده توسط ارائه دهنده ابری باشد، گره به طور متناسب با `node.cloudprovider.kubernetes.io/shutdown` و اثر آلودگی `NoSchedule` آلوده می‌شود.

### feature.node.kubernetes.io/*

نوع: Label

مثال: `feature.node.kubernetes.io/network-sriov.capable: "true"`

مورد استفاده در: Node

این برچسب‌ها توسط کامپوننت Node Feature Discovery (NFD) برای تبلیغ ویژگی‌های روی یک گره استفاده می‌شوند. همه برچسب‌های داخلی از فضای نام برچسب `feature.node.kubernetes.io` استفاده می‌کنند و فرمت `feature.node.kubernetes.io/<feature-name>: "true"` را دارند.

NFD دارای نقاط توسعه زیادی برای ایجاد برچسب‌های خاص فروشنده و برنامه است.

برای جزئیات بیشتر، به [customization guide](https://kubernetes-sigs.github.io/node-feature-discovery/v0.12/usage/customization-guide) مراجعه کنید.


### nfd.node.kubernetes.io/master.version

نوع: حاشیه‌نویسی

مثال: `nfd.node.kubernetes.io/master.version: "v0.6.0"`

مورد استفاده در: گره

برای گره(هایی) که کشف ویژگی گره (NFD) در [master](https://kubernetes-sigs.github.io/node-feature-discovery/stable/usage/nfd-master.html) برنامه‌ریزی شده است، این حاشیه‌نویسی نسخه NFD master را ثبت می‌کند.

این فقط برای استفاده اطلاعاتی استفاده می‌شود.


### nfd.node.kubernetes.io/worker.version

نوع: Annotation

مثال: `nfd.node.kubernetes.io/worker.version: "v0.4.0"`

مورد استفاده در: گره‌ها

این حاشیه‌نویسی، نسخه مربوط به یک گره کشف ویژگی را ثبت می‌کند. [worker](https://kubernetes-sigs.github.io/node-feature-discovery/stable/usage/nfd-worker.html)

اگر یکی روی یک گره در حال اجرا باشد. این فقط برای استفاده اطلاعاتی استفاده می‌شود.

### nfd.node.kubernetes.io/feature-labels

نوع: Annotation

مثال: `nfd.node.kubernetes.io/feature-labels: "cpu-cpuid.ADX,cpu-cpuid.AESNI,cpu-hardware_multithreading,kernel-version.full"`

مورد استفاده در: گره‌ها

این حاشیه‌نویسی فهرستی از برچسب‌های ویژگی‌های گره را که با کاما از هم جدا شده‌اند، ثبت می‌کند که توسط [Node Feature Discovery](https://kubernetes-sigs.github.io/node-feature-discovery/) (NFD) مدیریت می‌شود. NFD از این برای یک مکانیسم داخلی استفاده می‌کند. شما نباید خودتان این حاشیه‌نویسی را ویرایش کنید.

### nfd.node.kubernetes.io/extended-resources

نوع: Annotation

مثال: `nfd.node.kubernetes.io/extended-resources: "accelerator.acme.example/q500,example.com/coprocessor-fx5"`

مورد استفاده در: گره‌ها

این حاشیه‌نویسی فهرستی از منابع جدا شده با کاما را ثبت می‌کند.

[extended resources](/docs/concepts/configuration/manage-resources-containers/#extended-resources)

مدیریت شده توسط [Node Feature Discovery](https://kubernetes-sigs.github.io/node-feature-discovery/) (NFD).

NFD از این برای یک مکانیسم داخلی استفاده می‌کند. شما نباید خودتان این حاشیه‌نویسی را ویرایش کنید.

### nfd.node.kubernetes.io/node-name

نوع: Label

مثال: `nfd.node.kubernetes.io/node-name: node-1`
مورد استفاده در: گره‌ها
این مشخص می‌کند که شیء NodeFeature کدام گره را هدف قرار می‌دهد.
سازندگان اشیاء NodeFeature باید این برچسب را تنظیم کنند و

مصرف‌کنندگان اشیاء قرار است از این برچسب برای فیلتر کردن ویژگی‌های تعیین‌شده برای یک گره خاص استفاده کنند.

{{< note >}}
این برچسب‌ها یا حاشیه‌نویسی‌های کشف ویژگی گره (NFD) فقط برای گره‌هایی که NFD در آنها اجرا می‌شود، اعمال می‌شوند. برای کسب اطلاعات بیشتر در مورد NFD و اجزای آن، به [documentation] رسمی آن (https://kubernetes-sigs.github.io/node-feature-discovery/stable/get-started/) مراجعه کنید.
{{< /note >}}

### service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval (beta) {#service-beta-kubernetes-io-aws-load-balancer-access-log-emit-interval}

مثال: `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval: "5"`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، متعادل‌کننده بار را برای یک سرویس بر اساس این حاشیه‌نویسی پیکربندی می‌کند. این مقدار تعیین می‌کند که متعادل‌کننده بار هر چند وقت یکبار ورودی‌های لاگ را می‌نویسد. به عنوان مثال، اگر مقدار را روی 5 تنظیم کنید، نوشتن لاگ با فاصله 5 ثانیه اتفاق می‌افتد.

### service.beta.kubernetes.io/aws-load-balancer-access-log-enabled (beta) {#service-beta-kubernetes-io-aws-load-balancer-access-log-enabled}

مثال: `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "false"`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، متعادل‌کننده بار را برای یک سرویس بر اساس این حاشیه‌نویسی پیکربندی می‌کند. اگر حاشیه‌نویسی را روی "true" تنظیم کنید، ثبت دسترسی فعال می‌شود.

### service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name (beta) {#service-beta-kubernetes-io-aws-load-balancer-access-log-s3-bucket-name}

مثال: `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: example`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، متعادل‌کننده بار را برای یک سرویس بر اساس این حاشیه‌نویسی پیکربندی می‌کند. متعادل‌کننده بار، گزارش‌ها را در یک سطل S3 با نامی که شما مشخص می‌کنید، می‌نویسد.

### service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix (beta) {#service-beta-kubernetes-io-aws-load-balancer-access-log-s3-bucket-prefix}

مثال: `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled: "/example"`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، متعادل‌کننده بار را برای یک سرویس بر اساس این حاشیه‌نویسی پیکربندی می‌کند. متعادل‌کننده بار
اشیاء گزارش را با پیشوندی که شما مشخص می‌کنید می‌نویسد.

### service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags (beta) {#service-beta-kubernetes-io-aws-load-balancer-additional-resource-tags}

مثال: `service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags: "Environment=demo,Project=example"`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌کننده بار الاستیک AWS، برچسب‌هایی (یک مفهوم AWS) را برای متعادل‌کننده بار بر اساس جفت‌های کلید/مقدار جدا شده با کاما در مقدار این حاشیه‌نویسی پیکربندی می‌کند.

### service.beta.kubernetes.io/aws-load-balancer-alpn-policy (beta) {#service-beta-kubernetes-io-aws-load-balancer-alpn-policy}

مثال: `service.beta.kubernetes.io/aws-load-balancer-alpn-policy: HTTP2Optional`

مورد استفاده در: سرویس

[AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
از این حاشیه‌نویسی استفاده می‌کند.

به [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)

در مستندات کنترل‌کننده‌ی متعادل‌کننده‌ی بار AWS مراجعه کنید.

### service.beta.kubernetes.io/aws-load-balancer-attributes (beta) {#service-beta-kubernetes-io-aws-load-balancer-attributes}

مثال: `service.beta.kubernetes.io/aws-load-balancer-attributes: "deletion_protection.enabled=true"`

مورد استفاده در: سرویس

[AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
از این حاشیه‌نویسی استفاده می‌کند.

به [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/) در مستندات کنترل‌کننده‌ی متعادل‌کننده‌ی بار AWS مراجعه کنید.

### service.beta.kubernetes.io/aws-load-balancer-backend-protocol (beta) {#service-beta-kubernetes-io-aws-load-balancer-backend-protocol}

مثال: `service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، شنونده متعادل‌کننده بار را بر اساس مقدار این حاشیه‌نویسی پیکربندی می‌کند.

### service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled (beta) {#service-beta-kubernetes-io-aws-load-balancer-connection-draining-enabled}

مثال: `service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled: "false"`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، متعادل‌کننده بار را بر اساس این حاشیه‌نویسی پیکربندی می‌کند. تنظیم تخلیه اتصال متعادل‌کننده بار به مقداری که شما تعیین می‌کنید بستگی دارد.

### service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout (beta) {#service-beta-kubernetes-io-aws-load-balancer-connection-draining-timeout}


مثال: `service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout: "60"`

مورد استفاده در: سرویس

اگر [connection draining](#service-beta-kubernetes-io-aws-load-balancer-connection-draining-enabled) را برای سرویسی با `type: LoadBalancer` پیکربندی کنید و از ابر AWS استفاده کنید، یکپارچه‌سازی، دوره تخلیه را بر اساس این حاشیه‌نویسی پیکربندی می‌کند. مقداری که تعیین می‌کنید، زمان تخلیه را بر حسب ثانیه تعیین می‌کند.


### service.beta.kubernetes.io/aws-load-balancer-ip-address-type (beta) {#service-beta-kubernetes-io-aws-load-balancer-ip-address-type}

مثال: `service.beta.kubernetes.io/aws-load-balancer-ip-address-type: ipv4`

مورد استفاده در: سرویس

[AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
از این حاشیه‌نویسی استفاده می‌کند.

به [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/) در مستندات کنترل‌کننده‌ی متعادل‌کننده‌ی بار AWS مراجعه کنید.

Example: `service.beta.kubernetes.io/aws-load-balancer-ip-address-type: ipv4`

### service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout (beta) {#service-beta-kubernetes-io-aws-load-balancer-connection-idle-timeout}

مثال: `service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout: "60"`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، یک متعادل‌کننده بار را بر اساس این حاشیه‌نویسی پیکربندی می‌کند. متعادل‌کننده بار دارای یک دوره زمانی غیرفعال پیکربندی‌شده (برحسب ثانیه) است که برای اتصالات آن اعمال می‌شود. اگر تا زمانی که دوره زمانی غیرفعال سپری شود، هیچ داده‌ای ارسال یا دریافت نشده باشد، متعادل‌کننده بار اتصال را می‌بندد.

### service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled (beta) {#service-beta-kubernetes-io-aws-load-balancer-cross-zone-load-balancing-enabled}

مثال: `service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، یک متعادل‌کننده بار را بر اساس این حاشیه‌نویسی پیکربندی می‌کند. اگر این حاشیه‌نویسی را روی "true" تنظیم کنید، هر گره متعادل‌کننده بار، درخواست‌ها را به طور مساوی بین اهداف ثبت‌شده در تمام [مناطق دسترسی] فعال‌شده توزیع می‌کند [availability zones](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-availability-zones).

اگر متعادل‌سازی بار بین منطقه‌ای را غیرفعال کنید، هر گره متعادل‌کننده بار، درخواست‌ها را به طور مساوی بین اهداف ثبت‌شده فقط در منطقه دسترسی خود توزیع می‌کند.


### service.beta.kubernetes.io/aws-load-balancer-eip-allocations (beta) {#service-beta-kubernetes-io-aws-load-balancer-eip-allocations}

مثال: `service.beta.kubernetes.io/aws-load-balancer-eip-allocations: "eipalloc-01bcdef23bcdef456,eipalloc-def1234abc4567890"`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، یک متعادل‌کننده بار را بر اساس این حاشیه‌نویسی پیکربندی می‌کند. مقدار، فهرستی از شناسه‌های تخصیص آدرس IP الاستیک است که با کاما از هم جدا شده‌اند.

این حاشیه‌نویسی فقط برای سرویس‌هایی با `نوع: LoadBalancer` مرتبط است، که در آن
متعادل‌کننده بار، یک متعادل‌کننده بار شبکه AWS است.

### service.beta.kubernetes.io/aws-load-balancer-extra-security-groups (beta) {#service-beta-kubernetes-io-aws-load-balancer-extra-security-groups}

مثال: `service.beta.kubernetes.io/aws-load-balancer-extra-security-groups: "sg-12abcd3456,sg-34dcba6543"`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، یک متعادل‌کننده بار را بر اساس این حاشیه‌نویسی پیکربندی می‌کند. مقدار حاشیه‌نویسی، فهرستی از گروه‌های امنیتی اضافی AWS VPC است که با کاما از هم جدا شده‌اند تا برای متعادل‌کننده بار پیکربندی شوند.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-healthy-threshold (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-healthy-threshold}

مثال: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-healthy-threshold: "3"`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، یک متعادل‌کننده بار را بر اساس این حاشیه‌نویسی پیکربندی می‌کند. مقدار حاشیه‌نویسی تعداد بررسی‌های سلامت موفق و متوالی مورد نیاز برای سالم در نظر گرفته شدن یک backend برای ترافیک را مشخص می‌کند.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-interval}

مثال: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-interval: "30"`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، یک متعادل‌کننده بار را بر اساس این حاشیه‌نویسی پیکربندی می‌کند. مقدار حاشیه‌نویسی، فاصله زمانی، بر حسب ثانیه، بین بررسی‌های سلامت انجام شده توسط متعادل‌کننده بار را مشخص می‌کند.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-path (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-papth}

مثال: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-path: /healthcheck`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، متعادل‌کننده بار را بر اساس این حاشیه‌نویسی پیکربندی می‌کند. مقدار حاشیه‌نویسی، بخش مسیر URL را که برای بررسی‌های سلامت HTTP استفاده می‌شود، تعیین می‌کند.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-port (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-port}

مثال: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-port: "24"`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، یک متعادل‌کننده بار را بر اساس این حاشیه‌نویسی پیکربندی می‌کند. مقدار حاشیه‌نویسی تعیین می‌کند که متعادل‌کننده بار هنگام انجام بررسی‌های سلامت به کدام پورت متصل می‌شود.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-protocol (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-protocol}

مثال: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-protocol: TCP`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، یک متعادل‌کننده بار را بر اساس این حاشیه‌نویسی پیکربندی می‌کند. مقدار حاشیه‌نویسی تعیین می‌کند که چگونه متعادل‌کننده بار، سلامت اهداف backend را بررسی می‌کند.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-timeout (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-timeout}

مثال: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-timeout: "3"`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، متعادل‌کننده بار را بر اساس این حاشیه‌نویسی پیکربندی می‌کند. مقدار حاشیه‌نویسی تعداد ثانیه‌هایی را مشخص می‌کند که قبل از آن، کاوشگری که هنوز موفق نشده است، به طور خودکار به عنوان ناموفق در نظر گرفته می‌شود.

### service.beta.kubernetes.io/aws-load-balancer-healthcheck-unhealthy-threshold (beta) {#service-beta-kubernetes-io-aws-load-balancer-healthcheck-unhealthy-threshold}

مثال: `service.beta.kubernetes.io/aws-load-balancer-healthcheck-unhealthy-threshold: "3"`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، یک متعادل‌کننده بار را بر اساس این حاشیه‌نویسی پیکربندی می‌کند. مقدار حاشیه‌نویسی تعداد بررسی‌های سلامت ناموفق متوالی مورد نیاز برای اینکه یک backend برای ترافیک ناسالم در نظر گرفته شود را مشخص می‌کند.

### service.beta.kubernetes.io/aws-load-balancer-internal (beta) {#service-beta-kubernetes-io-aws-load-balancer-internal}

مثال: `service.beta.kubernetes.io/aws-load-balancer-internal: "true"`

مورد استفاده در: سرویس

ادغام مدیر کنترل‌کننده ابری با متعادل‌سازی بار الاستیک AWS، یک متعادل‌کننده بار را بر اساس این حاشیه‌نویسی پیکربندی می‌کند. وقتی این حاشیه‌نویسی را روی "true" تنظیم می‌کنید، این ادغام یک متعادل‌کننده بار داخلی را پیکربندی می‌کند.

اگر از [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/) استفاده می‌کنید، به [`service.beta.kubernetes.io/aws-load-balancer-scheme`](#service-beta-kubernetes-io-aws-load-balancer-scheme) مراجعه کنید.

### service.beta.kubernetes.io/aws-load-balancer-manage-backend-security-group-rules (beta) {#service-beta-kubernetes-io-aws-load-balancer-manage-backend-security-group-rules}


مثال: `service.beta.kubernetes.io/aws-load-balancer-manage-backend-security-group-rules: "true"`

مورد استفاده در: سرویس

[AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
از این حاشیه‌نویسی استفاده می‌کند.

به [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)

در مستندات کنترل‌کننده‌ی متعادل‌کننده‌ی بار AWS مراجعه کنید.

### service.beta.kubernetes.io/aws-load-balancer-name (beta) {#service-beta-kubernetes-io-aws-load-balancer-name}

مثال: `service.beta.kubernetes.io/aws-load-balancer-name: my-elb`

مورد استفاده در: سرویس

اگر این حاشیه‌نویسی را روی یک سرویس تنظیم کنید، و آن سرویس را با `service.beta.kubernetes.io/aws-load-balancer-type: "external"` نیز حاشیه‌نویسی کنید، و از [AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)` در خوشه خود استفاده کنید، آنگاه کنترل‌کننده‌ی متعادل‌کننده‌ی بار AWS نام آن متعادل‌کننده‌ی بار را روی مقداری که برای حاشیه‌نویسی _this_ تعیین کرده‌اید، قرار می‌دهد.

به [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)` در مستندات کنترل‌کننده‌ی متعادل‌کننده‌ی بار AWS مراجعه کنید.


### service.beta.kubernetes.io/aws-load-balancer-nlb-target-type (beta) {#service-beta-kubernetes-io-aws-load-balancer-nlb-target-type}

مثال: `service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: "true"`

مورد استفاده در: سرویس

[AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
از این حاشیه‌نویسی استفاده می‌کند.

به [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/)
در مستندات کنترل‌کننده‌ی متعادل‌کننده‌ی بار AWS مراجعه کنید.

### service.beta.kubernetes.io/aws-load-balancer-private-ipv4-addresses (beta) {#service-beta-kubernetes-io-aws-load-balancer-private-ipv4-addresses}

مثال: `service.beta.kubernetes.io/aws-load-balancer-private-ipv4-addresses: "198.51.100.0,198.51.100.64"`

مورد استفاده در: سرویس

[AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
از این حاشیه‌نویسی استفاده می‌کند.

به [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/) در مستندات کنترل‌کننده‌ی متعادل‌کننده‌ی بار AWS مراجعه کنید.

### service.beta.kubernetes.io/aws-load-balancer-proxy-protocol (beta) {#service-beta-kubernetes-io-aws-load-balancer-proxy-protocol}

مثال: `service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: "*"`

مورد استفاده در: سرویس

ادغام رسمی Kubernetes با متعادل‌سازی بار الاستیک AWS، یک متعادل‌کننده بار را بر اساس این حاشیه‌نویسی پیکربندی می‌کند. تنها مقدار مجاز `"*"` است، که نشان می‌دهد متعادل‌کننده بار باید اتصالات TCP را به backend Pod با پروتکل PROXY بپوشاند.

### service.beta.kubernetes.io/aws-load-balancer-scheme (beta) {#service-beta-kubernetes-io-aws-load-balancer-scheme}

مثال: `service.beta.kubernetes.io/aws-load-balancer-scheme: internal`

مورد استفاده در: سرویس

[AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
از این حاشیه‌نویسی استفاده می‌کند.

به [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/) در مستندات کنترل‌کننده‌ی متعادل‌کننده‌ی بار AWS مراجعه کنید.


### service.beta.kubernetes.io/aws-load-balancer-security-groups (deprecated) {#service-beta-kubernetes-io-aws-load-balancer-security-groups}

مثال: `service.beta.kubernetes.io/aws-load-balancer-security-groups: "sg-53fae93f,sg-8725gr62r"`

مورد استفاده در: سرویس

کنترل‌کننده‌ی متعادل‌کننده‌ی بار AWS از این حاشیه‌نویسی برای مشخص کردن لیستی از گروه‌های امنیتی که با کاما از هم جدا شده‌اند استفاده می‌کند

گروه‌های امنیتی که می‌خواهید به متعادل‌کننده‌ی بار AWS متصل کنید. هم نام و هم شناسه‌ی امنیتی

در جایی که نام با برچسب `Name` مطابقت دارد، پشتیبانی می‌شوند، نه ویژگی `groupName`.

وقتی این حاشیه‌نویسی به یک سرویس اضافه می‌شود، کنترل‌کننده‌ی متعادل‌کننده‌ی بار، گروه‌های امنیتی که توسط حاشیه‌نویسی به آنها ارجاع داده شده است را به متعادل‌کننده‌ی بار متصل می‌کند. اگر این حاشیه‌نویسی را حذف کنید، کنترل‌کننده‌ی متعادل‌کننده‌ی بار AWS به طور خودکار یک گروه امنیتی جدید ایجاد کرده و آن را به متعادل‌کننده‌ی بار متصل می‌کند.

{{< note >}}
Kubernetes نسخه ۱.۲۷ و بالاتر این حاشیه‌نویسی را مستقیماً تنظیم یا نمی‌خوانند. با این حال، کنترل‌کننده متعادل‌کننده بار AWS (بخشی از پروژه Kubernetes) هنوز از حاشیه‌نویسی `service.beta.kubernetes.io/aws-load-balancer-security-groups` استفاده می‌کند.
{{< /note >}}

### service.beta.kubernetes.io/load-balancer-source-ranges (deprecated) {#service-beta-kubernetes-io-load-balancer-source-ranges}

مثال: `service.beta.kubernetes.io/load-balancer-source-ranges: "192.0.2.0/25"`

مورد استفاده در: سرویس

[AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)

از این حاشیه نویسی استفاده می کند. شما باید به جای آن `.spec.loadBalancerSourceRanges` را برای سرویس تنظیم کنید.

### service.beta.kubernetes.io/aws-load-balancer-ssl-cert (beta) {#service-beta-kubernetes-io-aws-load-balancer-ssl-cert}

مثال: `service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-1234-123456789012"`

مورد استفاده در: سرویس

ادغام رسمی با متعادل‌سازی بار الاستیک AWS، TLS را برای سرویسی از نوع `LoadBalancer` بر اساس این حاشیه‌نویسی پیکربندی می‌کند. مقدار حاشیه‌نویسی، نام منبع AWS (ARN) گواهی X.509 است که شنونده متعادل‌کننده بار باید از آن استفاده کند.

(پروتکل TLS مبتنی بر فناوری قدیمی‌تری است که به اختصار SSL نامیده می‌شود.)

### service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy (beta) {#service-beta-kubernetes-io-aws-load-balancer-ssl-negotiation-policy}

مثال: `service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy: ELBSecurityPolicy-TLS-1-2-2017-01`

ادغام رسمی با متعادل‌سازی بار الاستیک AWS، TLS را برای سرویسی با نوع `LoadBalancer` بر اساس این حاشیه‌نویسی پیکربندی می‌کند. مقدار این حاشیه‌نویسی، نام یک سیاست AWS برای مذاکره TLS با یک کلاینت همتا است.

### service.beta.kubernetes.io/aws-load-balancer-ssl-ports (beta) {#service-beta-kubernetes-io-aws-load-balancer-ssl-ports}

مثال: `service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "*"`

ادغام رسمی با متعادل‌سازی بار الاستیک AWS، TLS را برای سرویسی با نوع `LoadBalancer` بر اساس این حاشیه‌نویسی پیکربندی می‌کند. مقدار این حاشیه‌نویسی یا `"*"` است، به این معنی که همه پورت‌های متعادل‌کننده بار باید از TLS استفاده کنند، یا لیستی از شماره پورت‌ها است که با کاما از هم جدا شده‌اند.

### service.beta.kubernetes.io/aws-load-balancer-subnets (beta) {#service-beta-kubernetes-io-aws-load-balancer-subnets}

مثال: `service.beta.kubernetes.io/aws-load-balancer-subnets: "private-a,private-b"`

ادغام رسمی Kubernetes با AWS از این حاشیه‌نویسی برای پیکربندی یک متعادل‌کننده بار و تعیین اینکه در کدام مناطق دسترسی AWS، سرویس متعادل‌کننده بار مدیریت‌شده مستقر شود، استفاده می‌کند. مقدار یا فهرستی از نام‌های زیرشبکه جدا شده با کاما است، یا فهرستی از شناسه‌های زیرشبکه که با کاما جدا شده‌اند.

### service.beta.kubernetes.io/aws-load-balancer-target-group-attributes (beta) {#service-beta-kubernetes-io-aws-load-balancer-target-group-attributes}

مثال: `service.beta.kubernetes.io/aws-load-balancer-target-group-attributes: "stickiness.enabled=true,stickiness.type=source_ip"`

مورد استفاده در: سرویس

[AWS load balancer controller](https://kubernetes-sigs.github.io/aws-load-balancer-controller/)
از این حاشیه‌نویسی استفاده می‌کند.

به [annotations](https://kubernetes-sigs.github.io/aws-load-balancer-controller/latest/guide/service/annotations/) در مستندات کنترل‌کننده‌ی متعادل‌کننده‌ی بار AWS مراجعه کنید.

### service.beta.kubernetes.io/aws-load-balancer-target-node-labels (beta) {#service-beta-kubernetes-io-aws-target-node-labels}

مثال: `service.beta.kubernetes.io/aws-load-balancer-target-node-labels: "kubernetes.io/os=Linux,topology.kubernetes.io/region=us-east-2"`

ادغام رسمی Kubernetes با AWS از این حاشیه‌نویسی برای تعیین اینکه کدام گره‌ها در خوشه شما باید به عنوان اهداف معتبر برای متعادل‌کننده بار در نظر گرفته شوند، استفاده می‌کند.

### service.beta.kubernetes.io/aws-load-balancer-type (beta) {#service-beta-kubernetes-io-aws-load-balancer-type}

مثال: `service.beta.kubernetes.io/aws-load-balancer-type: external`

ادغام‌های رسمی Kubernetes با AWS از این حاشیه‌نویسی برای تعیین اینکه آیا ادغام ارائه‌دهنده ابر AWS باید سرویسی با `نوع: LoadBalancer` را مدیریت کند یا خیر، استفاده می‌کنند.

دو مقدار مجاز وجود دارد:

`nlb`
: مدیر کنترل‌کننده ابری، متعادل‌کننده بار شبکه را پیکربندی می‌کند.

`external`
: مدیر کنترل‌کننده ابری هیچ متعادل‌کننده باری را پیکربندی نمی‌کند.

اگر سرویسی با `type: LoadBalancer` را در AWS مستقر کنید و هیچ حاشیه‌نویسی `service.beta.kubernetes.io/aws-load-balancer-type` تنظیم نکنید، یکپارچه‌سازی AWS یک متعادل‌کننده بار الاستیک کلاسیک را مستقر می‌کند. این رفتار، بدون حاشیه‌نویسی، پیش‌فرض است، مگر اینکه خلاف آن را مشخص کنید.

وقتی این حاشیه‌نویسی را روی سرویسی با نوع «LoadBalancer» روی «external» تنظیم می‌کنید، و خوشه شما یک استقرار فعال از کنترلر متعادل‌کننده بار AWS دارد، آنگاه کنترلر متعادل‌کننده بار AWS تلاش می‌کند تا یک متعادل‌کننده بار را بر اساس مشخصات سرویس مستقر کند.

{{< caution >}}
حاشیه‌نویسی `service.beta.kubernetes.io/aws-load-balancer-type` را در شیء سرویس موجود تغییر ندهید یا اضافه نکنید. برای جزئیات بیشتر به مستندات AWS در این مورد مراجعه کنید.
{{< /caution >}}

### service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset (deprecated) {#service-beta-kubernetes-azure-load-balancer-disble-tcp-reset}

مثال: `service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset: "false"`

مورد استفاده در: سرویس

این حاشیه‌نویسی فقط برای سرویس پشتیبانی‌شده با متعادل‌کننده بار استاندارد Azure کار می‌کند.

این حاشیه‌نویسی در سرویس استفاده می‌شود تا مشخص کند که آیا متعادل‌کننده بار
باید تنظیم مجدد TCP را در زمان بیکاری غیرفعال یا فعال کند. در صورت فعال بودن، به برنامه‌ها کمک می‌کند تا رفتار قابل پیش‌بینی‌تری داشته باشند، خاتمه اتصال را تشخیص دهند، اتصالات منقضی شده را حذف کرده و اتصالات جدید را آغاز کنند.

می‌توانید مقدار را روی درست یا نادرست تنظیم کنید.


برای اطلاعات بیشتر به [Load Balancer TCP Reset](https://learn.microsoft.com/en-gb/azure/load-balancer/load-balancer-tcp-reset) مراجعه کنید.
{{< note >}} 
این حاشیه‌نویسی منسوخ شده است.
{{< /note >}}

### pod-security.kubernetes.io/enforce

نوع: برچسب

مثال: `pod-security.kubernetes.io/enforce: "baseline"`

مورد استفاده در: فضای نام

مقدار **باید** یکی از سطوح `privileged`، `baseline` یا `restricted` باشد که با سطوح `[Pod Security Standard](/docs/concepts/security/pod-security-standards) مطابقت دارد.

به طور خاص، برچسب `enforce` ایجاد هرگونه Pod در فضای نام برچسب‌گذاری شده که الزامات مشخص شده در سطح مشخص شده را برآورده نمی‌کند، ممنوع می‌کند.

برای اطلاعات بیشتر به [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission) مراجعه کنید.


### pod-security.kubernetes.io/enforce-version

نوع: برچسب

مثال: `pod-security.kubernetes.io/enforce-version: "{{< skew currentVersion >}}"`

مورد استفاده در: فضای نام

مقدار **باید** `آخرین نسخه` یا یک نسخه معتبر Kubernetes با فرمت `v<major>.<minor>` باشد.

این مقدار، نسخه سیاست‌های [Pod Security Standard](/docs/concepts/security/pod-security-standards)` را که هنگام اعتبارسنجی یک Pod اعمال می‌شوند، تعیین می‌کند.

برای اطلاعات بیشتر به [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission) مراجعه کنید.

### pod-security.kubernetes.io/audit


نوع: برچسب

مثال: `pod-security.kubernetes.io/audit: "baseline"`

مورد استفاده در: فضای نام

مقدار **باید** یکی از سطوح `privileged`، `baseline` یا `restricted` باشد که با سطوح `[Pod Security Standard](/docs/concepts/security/pod-security-standards) مطابقت دارد.

به طور خاص، برچسب `audit` از ایجاد یک Pod در فضای نام برچسب‌گذاری شده که الزامات مشخص شده در سطح مشخص شده را برآورده نمی‌کند، جلوگیری نمی‌کند، اما یک حاشیه‌نویسی this به Pod اضافه می‌کند.

برای اطلاعات بیشتر به [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission) مراجعه کنید.


### pod-security.kubernetes.io/audit-version


نوع: برچسب

مثال: `pod-security.kubernetes.io/audit-version: "{{< skew currentVersion >}}"`

مورد استفاده در: فضای نام

مقدار **باید** `آخرین نسخه` یا یک نسخه معتبر Kubernetes با فرمت `v<major>.<minor>` باشد.

این مقدار، نسخه سیاست‌های `[Pod Security Standard](/docs/concepts/security/pod-security-standards)` را که هنگام اعتبارسنجی یک Pod اعمال می‌شوند، تعیین می‌کند.

برای اطلاعات بیشتر به [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission) مراجعه کنید.



### pod-security.kubernetes.io/warn

مثال: `pod-security.kubernetes.io/warn: "baseline"`

مورد استفاده در: فضای نام

مقدار **باید** یکی از سطوح `privileged`، `baseline` یا `restricted` باشد که با سطوح `[Pod Security Standard](/docs/concepts/security/pod-security-standards) مطابقت دارد.

به طور خاص، برچسب `warn` از ایجاد یک Pod در فضای نام برچسب‌گذاری شده که الزامات مشخص شده در سطح مشخص شده را برآورده نمی‌کند، جلوگیری نمی‌کند، اما پس از انجام این کار، یک هشدار به کاربر برمی‌گرداند.

توجه داشته باشید که هشدارها هنگام ایجاد یا به‌روزرسانی اشیاء حاوی الگوهای Pod، مانند Deployments، Jobs، StatefulSets و غیره نیز نمایش داده می‌شوند.

برای اطلاعات بیشتر به [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission) مراجعه کنید.


### pod-security.kubernetes.io/warn-version

نوع: برچسب

مثال: `pod-security.kubernetes.io/warn-version: "{{< skew currentVersion >}}"`

مورد استفاده در: فضای نام

مقدار **باید** `latest` یا یک نسخه معتبر Kubernetes با فرمت `v<major>.<minor>` باشد.

این مقدار، نسخه سیاست‌های [Pod Security Standard](/docs/concepts/security/pod-security-standards) را که هنگام اعتبارسنجی یک Pod ارسالی اعمال می‌شوند، تعیین می‌کند.

توجه داشته باشید که هنگام ایجاد یا به‌روزرسانی اشیاء حاوی الگوهای Pod، مانند Deployments، Jobs، StatefulSets و غیره، هشدارها نیز نمایش داده می‌شوند.

برای اطلاعات بیشتر به [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission) مراجعه کنید.


### rbac.authorization.kubernetes.io/autoupdate

نوع: حاشیه‌نویسی

مثال: `rbac.authorization.kubernetes.io/autoupdate: "false"`

مورد استفاده در: ClusterRole، ClusterRoleBinding، Role، RoleBinding

هنگامی که این حاشیه‌نویسی روی `"true"` در اشیاء پیش‌فرض RBAC ایجاد شده توسط سرور API تنظیم شود، آنها به طور خودکار در شروع سرور به‌روزرسانی می‌شوند تا مجوزها و موضوعات از دست رفته اضافه شوند
(مجوزها و موضوعات اضافی در جای خود باقی می‌مانند).

برای جلوگیری از به‌روزرسانی خودکار یک نقش یا اتصال نقش خاص، این حاشیه‌نویسی را روی `"false"` تنظیم کنید.

اگر اشیاء RBAC خود را ایجاد می‌کنید و این حاشیه‌نویسی را روی `"false"` تنظیم می‌کنید، `kubectl auth adjust`
(که امکان تطبیق اشیاء RBAC دلخواه را در یک {{< glossary_tooltip text="manifest" term_id="manifest" >}} فراهم می‌کند)

به این حاشیه‌نویسی احترام می‌گذارد و به طور خودکار مجوزها و موضوعات از دست رفته را اضافه نمی‌کند.

### kubernetes.io/psp (deprecated) {#kubernetes-io-psp}

نوع: حاشیه‌نویسی

مثال: `kubernetes.io/psp: restricted`

مورد استفاده در: پاد

این حاشیه‌نویسی فقط در صورتی مرتبط بود که از اشیاء
[PodSecurityPolicy](/docs/concepts/security/pod-security-policy/) استفاده می‌کردید.

Kubernetes v{{< skew currentVersion >}} از API PodSecurityPolicy پشتیبانی نمی‌کند.

هنگامی که کنترل‌کننده پذیرش PodSecurityPolicy یک پاد را پذیرفت، کنترل‌کننده پذیرش
پاد را برای داشتن این حاشیه‌نویسی اصلاح کرد.

مقدار حاشیه‌نویسی، نام PodSecurityPolicy بود که برای اعتبارسنجی استفاده می‌شد.

### seccomp.security.alpha.kubernetes.io/pod (non-functional) {#seccomp-security-alpha-kubernetes-io-pod}

نوع: حاشیه‌نویسی

مورد استفاده در: پاد

کوبرنتس قبل از نسخه ۱.۲۵ به شما امکان پیکربندی رفتار seccomp را با استفاده از این حاشیه‌نویسی می‌داد.

برای یادگیری روش پشتیبانی‌شده برای تعیین محدودیت‌های seccomp برای یک پاد، به [Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/) مراجعه کنید.



### container.seccomp.security.alpha.kubernetes.io/[NAME] (non-functional) {#container-seccomp-security-alpha-kubernetes-io}

نوع: حاشیه‌نویسی

مورد استفاده در: پاد

کوبرنتس قبل از نسخه ۱.۲۵ به شما امکان پیکربندی رفتار seccomp را با استفاده از این حاشیه‌نویسی می‌داد.

برای یادگیری روش پشتیبانی‌شده برای تعیین محدودیت‌های seccomp برای یک پاد، به [Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/) مراجعه کنید.


### snapshot.storage.kubernetes.io/allow-volume-mode-change

نوع: حاشیه‌نویسی

مثال: `snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"`

مورد استفاده در: VolumeSnapshotContent

مقدار می‌تواند `true` یا `false` باشد. این تعیین می‌کند که آیا کاربر می‌تواند حالت (mode) درایو منبع را هنگام ایجاد PersistentVolumeClaim از VolumeSnapshot تغییر دهد یا خیر

Refer to [Converting the volume mode of a Snapshot](/docs/concepts/storage/volume-snapshots/#convert-volume-mode)
and the [Kubernetes CSI Developer Documentation](https://kubernetes-csi.github.io/docs/)
for more information.

برای اطلاعات بیشتر به [Converting the volume mode of a Snapshot](/docs/concepts/storage/volume-snapshots/#convert-volume-mode) و [Kubernetes CSI Developer Documentation](https://kubernetes-csi.github.io/docs/)مراجعه کنید.
baraye etlaat bishtar 

### scheduler.alpha.kubernetes.io/critical-pod (deprecated)

نوع: حاشیه‌نویسی

مثال: `scheduler.alpha.kubernetes.io/critical-pod: ""`

مورد استفاده در: پاد

این حاشیه‌نویسی به صفحه کنترل Kubernetes اجازه می‌دهد تا از بحرانی بودن یک پاد مطلع شود

به طوری که برنامه‌ریز این پاد را حذف نکند.

{{< note >}}
از نسخه ۱.۱۶، این حاشیه‌نویسی به نفع
[Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/) حذف شد.
{{< /note >}}

### jobset.sigs.k8s.io/jobset-name

مثال: `jobset.sigs.k8s.io/jobset-name: "my-jobset"`

مورد استفاده در: Jobs، Pods

این برچسب/حاشیه‌نویسی برای ذخیره نام JobSet که یک Job یا Pod به آن تعلق دارد، استفاده می‌شود.

[JobSet](https://jobset.sigs.k8s.io) یک API افزونه است که می‌توانید در خوشه Kubernetes خود مستقر کنید.
### jobset.sigs.k8s.io/replicatedjob-replicas

مثال: `jobset.sigs.k8s.io/replicatedjob-replicas: "5"`

مورد استفاده در: Jobs، Pods

این برچسب/حاشیه‌نویسی تعداد کپی‌ها را برای یک ReplicatedJob مشخص می‌کند.
### jobset.sigs.k8s.io/replicatedjob-name

نوع: برچسب، حاشیه‌نویسی

مثال: `jobset.sigs.k8s.io/replicatedjob-name: "my-replicatedjob"`

مورد استفاده در: مشاغل، پادها

این برچسب یا حاشیه‌نویسی، نام کار تکثیر شده‌ای را که این کار یا پاد بخشی از آن است، ذخیره می‌کند.

### jobset.sigs.k8s.io/job-index

نوع: برچسب، حاشیه‌نویسی

مثال: `jobset.sigs.k8s.io/job-index: "0"`

مورد استفاده در: Jobs، Pods

این برچسب/حاشیه‌نویسی توسط کنترلر JobSet روی Jobها و Podهای فرزند تنظیم می‌شود. این برچسب حاوی اندیس کپی Job در داخل والد آن ReplicatedJob است.

### jobset.sigs.k8s.io/job-key

نوع: برچسب، حاشیه‌نویسی

مثال: `jobset.sigs.k8s.io/job-key: "0f1e93893c4cb372080804ddb9153093cb0d20cefdd37f653e739c232d363feb"`

مورد استفاده در: مشاغل، پادها

کنترلر JobSet این برچسب (و همچنین یک حاشیه‌نویسی با همان کلید) را روی مشاغل فرزند و پادهای یک JobSet تنظیم می‌کند. مقدار، هش SHA256 نام شغل با فضای نام است.

### alpha.jobset.sigs.k8s.io/exclusive-topology

نوع: حاشیه‌نویسی

مثال: `alpha.jobset.sigs.k8s.io/exclusive-topology: "zone"`

مورد استفاده در: JobSets، Jobs

شما می‌توانید این برچسب/حاشیه‌نویسی را روی یک [JobSet](https://jobset.sigs.k8s.io) تنظیم کنید تا از قرارگیری انحصاری شغل در هر گروه توپولوژی اطمینان حاصل شود. همچنین می‌توانید این برچسب یا حاشیه‌نویسی را روی یک الگوی شغل تکثیر شده تعریف کنید. برای کسب اطلاعات بیشتر، مستندات JobSet را مطالعه کنید.

### alpha.jobset.sigs.k8s.io/node-selector

نوع: حاشیه‌نویسی

مثال: `alpha.jobset.sigs.k8s.io/node-selector: "true"`

مورد استفاده در: Jobها، Podها

این برچسب/حاشیه‌نویسی می‌تواند روی یک JobSet اعمال شود. وقتی تنظیم شد، کنترل‌کننده JobSet با اضافه کردن انتخابگرهای گره و تلرانس‌ها، Jobها و Podهای مربوطه‌شان را تغییر می‌دهد. این امر قرارگیری انحصاری شغل در هر دامنه توپولوژی را تضمین می‌کند و زمان‌بندی این Podها را بر اساس استراتژی به گره‌های خاص محدود می‌کند.

### alpha.jobset.sigs.k8s.io/namespaced-job

نوع: برچسب

مثال: `alpha.jobset.sigs.k8s.io/namespaced-job: "default_myjobset-replicatedjob-0"`

مورد استفاده در: گره‌ها

این برچسب یا به صورت دستی یا خودکار (به عنوان مثال، یک مقیاس‌دهنده خودکار خوشه) روی گره‌ها تنظیم می‌شود. وقتی `alpha.jobset.sigs.k8s.io/node-selector` روی `"true"` تنظیم شود، کنترل‌کننده JobSet یک nodeSelector به این برچسب گره اضافه می‌کند (همراه با تلورانس به `alpha.jobset.sigs.k8s.io/no-schedule` که در مرحله بعد بررسی می‌شود).

### alpha.jobset.sigs.k8s.io/no-schedule
نوع: taint

مثال: `alpha.jobset.sigs.k8s.io/no-schedule: "NoSchedule"`

مورد استفاده در: گره‌ها

این taint یا به صورت دستی یا خودکار (به عنوان مثال، یک مقیاس‌دهنده خودکار خوشه) روی گره‌ها تنظیم می‌شود. وقتی `alpha.jobset.sigs.k8s.io/node-selector` روی `"true"` تنظیم شود، کنترل‌کننده JobSet یک تلرانس به این taint گره اضافه می‌کند (همراه با انتخابگر گره به برچسب `alpha.jobset.sigs.
### jobset.sigs.k8s.io/coordinator

وع: حاشیه‌نویسی، برچسب

مثال: `jobset.sigs.k8s.io/coordinator: "myjobset-workers-0-0.headless-svc"`

مورد استفاده در: مشاغل، پادها

این حاشیه‌نویسی/برچسب در مشاغل و پادها برای ذخیره یک نقطه پایانی شبکه پایدار استفاده می‌شود که در آن پاد هماهنگ‌کننده در صورتی که مشخصات [JobSet](https://jobset.sigs.k8s.io) فیلد `.spec.coordinator` را تعریف کند، قابل دسترسی است.

## Annotations used for audit

<!-- sorted by annotation -->
- [`authorization.k8s.io/decision`](/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-decision)
- [`authorization.k8s.io/reason`](/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-reason)
- [`insecure-sha1.invalid-cert.kubernetes.io/$hostname`](/docs/reference/labels-annotations-taints/audit-annotations/#insecure-sha1-invalid-cert-kubernetes-io-hostname)
- [`missing-san.invalid-cert.kubernetes.io/$hostname`](/docs/reference/labels-annotations-taints/audit-annotations/#missing-san-invalid-cert-kubernetes-io-hostname)
- [`pod-security.kubernetes.io/audit-violations`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-audit-violations)
- [`pod-security.kubernetes.io/enforce-policy`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-enforce-policy)
- [`pod-security.kubernetes.io/exempt`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-exempt)
- [`validation.policy.admission.k8s.io/validation_failure`](/docs/reference/labels-annotations-taints/audit-annotations/#validation-policy-admission-k8s-io-validation-failure)
  
جزئیات بیشتر را در [Audit Annotations](/docs/reference/labels-annotations-taints/audit-annotations/) ببینید.
jozeia

## kubeadm

### kubeadm.alpha.kubernetes.io/cri-socket

نوع: حاشیه‌نویسی

مثال: `kubeadm.alpha.kubernetes.io/cri-socket: unix:///run/containerd/container.sock`

مورد استفاده در: Node

حاشیه‌ای که kubeadm برای حفظ اطلاعات سوکت CRI داده شده به kubeadm در زمان `init`/`join` برای استفاده‌های بعدی استفاده می‌کند. kubeadm شیء Node را با این اطلاعات حاشیه‌نویسی می‌کند.

حاشیه‌نویسی "alpha" باقی می‌ماند، زیرا در حالت ایده‌آل، این باید یک فیلد در KubeletConfiguration باشد.

### kubeadm.kubernetes.io/etcd.advertise-client-urls

نوع: حاشیه‌نویسی

مثال: `kubeadm.kubernetes.io/etcd.advertise-client-urls: https://172.17.0.18:2379`

مورد استفاده در: پاد

حاشیه‌ای که kubeadm روی پادهای etcd که به صورت محلی مدیریت می‌شوند قرار می‌دهد تا فهرستی از URLهایی را که کلاینت‌های etcd باید به آنها متصل شوند، پیگیری کند.

این عمدتاً برای اهداف بررسی سلامت خوشه etcd استفاده می‌شود.

### kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint

نوع: حاشیه‌نویسی

مثال: `kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: https://172.17.0.18:6443`

مورد استفاده در: پاد

حاشیه‌ای که kubeadm روی پادهای `kube-apiserver` که به صورت محلی مدیریت می‌شوند قرار می‌دهد تا آدرس/پورت پایانی آشکار شده برای آن نمونه سرور API را پیگیری کند.

### kubeadm.kubernetes.io/component-config.hash

نوع: حاشیه‌نویسی

مثال: `kubeadm.kubernetes.io/component-config.hash: 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae`

مورد استفاده در: ConfigMap

حاشیه‌ای که kubeadm روی ConfigMaps که برای پیکربندی اجزا مدیریت می‌کند، قرار می‌دهد.

این شامل یک هش (SHA-256) است که برای تعیین اینکه آیا کاربر تنظیماتی متفاوت از پیش‌فرض‌های kubeadm برای یک جزء خاص اعمال کرده است یا خیر، استفاده می‌شود.

### node-role.kubernetes.io/control-plane

نوع: برچسب

مورد استفاده در: گره

یک برچسب نشانگر برای نشان دادن اینکه گره برای اجرای اجزای صفحه کنترل استفاده می‌شود.
ابزار kubeadm این برچسب را به گره‌های صفحه کنترلی که مدیریت می‌کند اعمال می‌کند.
سایر ابزارهای مدیریت خوشه نیز معمولاً این برچسب را تنظیم می‌کنند.

شما می‌توانید گره‌های صفحه کنترل را با این برچسب برچسب‌گذاری کنید تا برنامه‌ریزی Podها فقط روی این گره‌ها آسان‌تر شود، یا از اجرای Podها روی صفحه کنترل جلوگیری شود.

اگر این برچسب تنظیم شود، [EndpointSlice controller](/docs/concepts/services-networking/topology-aware-routing/#implementation-control-plane)

آن گره را هنگام محاسبه Topology Aware Hints نادیده می‌گیرد.

### node-role.kubernetes.io/*

نوع: برچسب

مثال: `node-role.kubernetes.io/gpu: gpu`

مورد استفاده در: Node

این برچسب اختیاری زمانی به یک گره اعمال می‌شود که می‌خواهید نقش یک گره را علامت‌گذاری کنید.

نقش گره (متن بعد از `/` در کلید برچسب) را می‌توان تنظیم کرد، تا زمانی که کلید کلی از قوانین [syntax](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set) برای برچسب‌های شیء پیروی کند.

کوبرنتیز یک نقش گره خاص، **control-plane**، را تعریف می‌کند. برچسبی که می‌توانید برای علامت‌گذاری آن نقش گره استفاده کنید، [`node-role.kubernetes.io/control-plane`](#node-role-kubernetes-io-control-plane) است.

### node-role.kubernetes.io/control-plane {#node-role-kubernetes-io-control-plane-taint}

نوع: taint

مثال: `node-role.kubernetes.io/control-plane:NoSchedule`

مورد استفاده در: گره

taint که kubeadm روی گره‌های صفحه کنترل اعمال می‌کند تا قرار دادن Podها را محدود کند و
فقط به Podهای خاص اجازه دهد روی آنها برنامه‌ریزی کنند.

اگر این taint اعمال شود، گره‌های صفحه کنترل فقط اجازه می‌دهند بارهای کاری حیاتی روی آنها برنامه‌ریزی شوند. می‌توانید این taint را با دستور زیر روی یک گره خاص به صورت دستی حذف کنید.

```shell
kubectl taint nodes <node-name> node-role.kubernetes.io/control-plane:NoSchedule-
```

### node-role.kubernetes.io/master (deprecated) {#node-role-kubernetes-io-master-taint}

نوع: TAINT

مورد استفاده در: Node

مثال: `node-role.kubernetes.io/master:NoSchedule`

TAINTی که kubeadm قبلاً روی گره‌های صفحه کنترل اعمال کرده بود تا فقط بارهای کاری بحرانی بتوانند روی آنها زمان‌بندی شوند. با TAINT [`node-role.kubernetes.io/control-plane`](#node-role-kubernetes-io-control-plane-taint) جایگزین شده است. kubeadm دیگر این TAINT منسوخ شده را تنظیم یا استفاده نمی‌کند.

### resource.k8s.io/admin-access {resource-k8s-io-admin-access}

نوع: برچسب

مثال: `resource.k8s.io/admin-access: "true"`

مورد استفاده در: فضای نام

برای اعطای دسترسی مدیریتی به انواع API خاص resource.k8s.io در یک فضای نام استفاده می‌شود. هنگامی که این برچسب روی یک فضای نام با مقدار `"true"` (حساس به حروف کوچک و بزرگ) تنظیم شود، امکان استفاده از `adminAccess: true` را در هر نوع API با فضای نام `resource.k8s.io` فراهم می‌کند. در حال حاضر، این مجوز برای اشیاء `ResourceClaim` و `ResourceClaimTemplate` اعمال می‌شود.
برای اطلاعات بیشتر به [Dynamic Resource Allocation Admin access](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#enabling-admin-access)مراجعه کنید.