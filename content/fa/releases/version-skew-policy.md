---
بررسی کنندگان:
- sig-api-machinery
- sig-architecture
- sig-cli
- sig-cluster-lifecycle
- sig-node
- sig-release
موضوع: سیاست اختلاف نسخه (Version Skew Policy)
نوع: مستندات 
توضیح: >
حداکثر اختلاف نسخه (version skew) پشتیبانی‌شده بین اجزای مختلف Kubernetes.
---
<div dir="rtl" style="text-align: right;">
<!-- overview -->
این مستندات حداکثر اختلاف نسخه (version skew) پشتیبانی‌شده بین اجزای مختلف Kubernetes را توضیح می‌دهد.
ابزارهای خاص استقرار کلاستر ممکن است محدودیت‌های بیشتری بر اختلاف نسخه اعمال کنند.

<!-- body -->

## ورژن های قابل پشتیبانی شده

نسخه‌های Kubernetes به صورت  **x.y.z** بیان می‌شوند، که در آن **x** نسخه اصلی (major)، **y** نسخه فرعی (minor) و **z** نسخه پچ (patch) است، مطابق با اصطلاحات [Semantic Versioning](https://semver.org/).
برای اطلاعات بیشتر، به [Kubernetes Release Versioning](https://git.k8s.io/sig-release/release-engineering/versioning.md#kubernetes-release-versioning) مراجعه کنید.


پروژه Kubernetes شاخه‌های انتشار (release branches) مربوط به سه نسخه فرعی (minor) اخیر را نگهداری می‌کند
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).
نسخه‌های 1.19 به بعد از[approximately 1 year of patch support](/releases/patch-releases/#support-period). Kubernetes حدوداً ۱ سال پشتیبانی پچ دریافت می‌کنند.
نسخه‌های 1.18 و قبل‌تر تقریباً ۹ ماه پشتیبانی پچ دریافت می‌کردند.

اصلاحات قابل اعمال، از جمله اصلاحات امنیتی، ممکن است بسته به شدت (severity) و امکان‌پذیری (feasibility) به آن سه شاخهٔ انتشار بازگردانده شوند (backport). نسخه‌های پچ از این شاخه‌ها در یک [regular cadence](/releases/patch-releases/#cadence) منتشر می‌شوند، به‌علاوه انتشارهای اضطراری اضافی در صورت نیاز.


گروه [Release Managers](/releases/release-managers/) مالک این تصمیم است.
برای اطلاعات بیشتر، به صفحهٔ [patch releases](/releases/patch-releases/) در Kubernetes مراجعه کنید.
## نسخه پشتیبانی شده skew

### kube-apiserver

در [highly-available (HA) clusters](/docs/setup/production-environment/tools/kubeadm/high-availability/)، جدیدترین و قدیمی‌ترین نمونه‌های  `kube-apiserver`  باید حداکثر یک نسخه فرعی (minor) اختلاف داشته باشند.

 مثال:

* نسخه جدید `kube-apiserver` در  **{{< skew currentVersion >}}**
* سایر نمونه‌های `kube-apiserver` در نسخه‌ی زیر پشتیبانی می‌شوند:**{{< skew currentVersion >}}** و **{{< skew currentVersionAddMinor -1 >}}**

### kubelet

* `kubelet` نبایدجدید تر از  `kube-apiserver`.
* `kubelet` ممکن است تا سه نسخه فرعی (minor) قدیمی‌تر از نسخهٔ زیر باشند `kube-apiserver` (`kubelet` < نسخهٔ 1.25 ممکن است حداکثر تا دو نسخه فرعی (minor) قدیمی‌تر از نسخهٔ زیر باشد: `kube-apiserver`).

مثال:

* `kube-apiserver` در  **{{< skew currentVersion >}}**
* `kubelet`پشتیبانی میشود در  **{{< skew currentVersion >}}**, **{{< skew currentVersionAddMinor -1 >}}**,
  **{{< skew currentVersionAddMinor -2 >}}**, و **{{< skew currentVersionAddMinor -3 >}}**

{{< توجه داشته باشید >}}
اگر اختلاف نسخه (version skew) بین نمونه‌های `kube-apiserver` در یک HA cluster وجود داشته باشد، این موضوع دامنهٔ نسخه‌های مجاز برای `kubelet` را محدود می‌کند.
{{</ note >}}
اگر نسخه skew بین 
مثال:

* نمونه‌های `kube-apiserver` در نسخه‌های **{{< skew currentVersion >}}** و **{{< skew currentVersionAddMinor -1 >}}** قرار دارند.
* `kubelet`پشتیبانی میشود در  **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**,
  و **{{< skew currentVersionAddMinor -3 >}}** (**{{< skew currentVersion >}}** پشتیبانی نمی شود به دلیل اینکه ممکن است نسخه جدیدتری نسبت به  `kube-apiserver` نمونه در نسخه  **{{< skew currentVersionAddMinor -1 >}}**)
پشتیبانی نمی شود به دلیل اینکه ممکن است نسخه جدیدتری نسبت به 
### kube-proxy

* `kube-proxy` نباید جدیدتر از `kube-apiserver`.
* `kube-proxy`ممکن است تا سه نسخه minor قدیمی‌تر از `kube-apiserver`
  (`kube-proxy` < 1.25 ممکن است فقط تا دو نسخه minor قدیمی‌تر از `kube-apiserver`).
* `kube-proxy` ممکن است تا سه نسخه minor قدیمی‌تر یا جدیدتر از `kubelet`مونه‌ای که در کنار آن اجرا می‌شود (برای مثال، `kube-proxy` نسخه‌های کمتر از 1.25 ممکن است حداکثر تا دو نسخه فرعی قدیمی‌تر یا جدیدتر از نمونه `kubelet` که کنار آن اجرا می‌شود باشد).

مثال:

* `kube-apiserver`در  **{{< skew currentVersion >}}**
* `kube-proxy` پشتیبانی میشود در **{{< skew currentVersion >}}**, **{{< skew currentVersionAddMinor -1 >}}**,
  **{{< skew currentVersionAddMinor -2 >}}**, و **{{< skew currentVersionAddMinor -3 >}}**

{{< توجه >}}
اگر اختلاف نسخه (version skew) بین نمونه‌های `kube-apiserver` در یک HA cluster وجود داشته باشد، این موضوع دامنه نسخه‌های مجاز برای `kube-proxy` را محدود می‌کند.
{{</ توجه >}}

مثال:

* `kube-apiserver` نمونه ها در  **{{< skew currentVersion >}}** و **{{< skew currentVersionAddMinor -1 >}}**
* `kube-proxy` پشتیبانی می شود در **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**,
  و **{{< skew currentVersionAddMinor -3 >}}** (**{{< skew currentVersion >}}** پشتیبانی نمی‌شود زیرا این نسخه جدیدتر از نمونه `kube-apiserver` در نسخه **{{< skew currentVersionAddMinor -1 >}}**) خواهد بود.

### kube-controller-manager, kube-scheduler, , cloud-controller-manager

`kube-controller-manager`, `kube-scheduler`, , `cloud-controller-manager` must not be newer than the
`kube-apiserver` instances they communicate with. They are expected to match the `kube-apiserver` minor version,
but may be up to one minor version older (to allow live upgrades).

`kube-controller-manager`، `kube-scheduler`و `cloud-controller-manager` نباید جدیدتر از نمونه‌های `kube-apiserver` که با آنها ارتباط دارند باشند. انتظار می‌رود که نسخه فرعی (minor) آنها با نسخه `kube-apiserver` مطابقت داشته باشد، اما ممکن است حداکثر تا یک نسخه فرعی قدیمی‌تر باشند (برای اجازه دادن به ارتقاء در لحظه)


مثال:

* `kube-apiserver` در **{{< skew currentVersion >}}**
* `kube-controller-manager`, `kube-scheduler`, و `cloud-controller-manager` در ایجا پشتیبانی میشود  **{{< skew currentVersion >}}** و **{{< skew currentVersionAddMinor -1 >}}**

{{< توجه >}}
اگر اختلاف نسخه (version skew) بین نمونه‌های `kube-apiserver` در یک HA cluster وجود داشته باشد و این اجزا بتوانند با هر نمونه kube-apiserver در کلاستر ارتباط برقرار کنند (مثلاً از طریق یک load balancer)، این موضوع دامنه نسخه‌های مجاز این اجزا را محدود می‌کند.
{{< /توجه >}}

مثال:

* نمونه‌های `kube-apiserver` در نسخه‌های **{{< skew currentVersion >}}** و **{{< skew currentVersionAddMinor -1 >}}** قرار دارن

* `kube-controller-manager`، `kube-scheduler` و `cloud-controller-manager` با یک load balancer ارتباط برقرار می‌کنند که می‌تواند درخواست‌ها را به هر نمونه‌ی `kube-apiserver` هدایت کند.
* `kube-controller-manager`, `kube-scheduler`, and `cloud-controller-manager` are supported at
  **{{< skew currentVersionAddMinor -1 >}}** (**{{< skew currentVersion >}}** is not supported
  because that would be newer than the `kube-apiserver` instance at version **{{< skew currentVersionAddMinor -1 >}}**)

 `kube-controller-manager`،`kube-scheduler` و `cloud-controller-manager` در نسخه   **{{< skew currentVersionAddMinor -1 >}}** پشتیبانی می‌شوند (نسخه (**{{< skew currentVersion >}}** پشتیبانی نمی‌شود زیرا جدیدتر از نمونه kube-apiserver در نسخه **{{< skew currentVersionAddMinor -1 >}}** خواهد بود).


### kubectl

`kubectl` در یک نسخه فرعی (minor) قبل یا بعد از `kube-apiserver` پشتیبانی می‌شود.

مثال:

* `kube-apiserver` در نسخه **{{< skew currentVersion >}}**
* `kubectl` در نسخه‌های **{{< skew currentVersionAddMinor 1 >}}**، **{{< skew currentVersion >}}** و **{{< skew currentVersionAddMinor -1 >}}**

{{< مثال >}}
اگر اختلاف نسخه (version skew) بین نمونه‌های `kube-apiserver` در یک HA cluster وجود داشته باشد، این موضوع نسخه‌های پشتیبانی شده kubectl را محدود می‌کند.
{{< /مثال >}}

مثال:

* نمونه‌های `kube-apiserver` در نسخه‌های **{{< skew currentVersion >}}** و **{{< skew currentVersionAddMinor -1 >}}** قرار دارند.
* `kubectl` در نسخه‌های **{{< skew currentVersion >}}** و **{{< skew currentVersionAddMinor -1 >}}** پشتیبانی می‌شود
(نسخه‌های دیگر بیش از یک نسخه فرعی (minor) با یکی از اجزای `kube-apiserver` اختلاف نسخه دارند)

## سفارش ارتقاء مؤلفه پشتیبانی شده

اختلاف نسخه (version skew) پشتیبانی شده بین اجزا تأثیراتی بر ترتیب به‌روزرسانی آن‌ها دارد.
این بخش ترتیب به‌روزرسانی اجزا را برای انتقال یک کلاستر موجود از نسخه **{{< skew currentVersionAddMinor -1 >}}** به نسخه **{{< skew currentVersion >}}** توضیح می‌دهد.

به طور اختیاری، هنگام آماده‌سازی برای ارتقا، پروژه Kubernetes توصیه می‌کند که موارد زیر را انجام دهید تا از بیشترین تعداد اصلاحات برگشتی (regression) و رفع اشکالات در طول فرآیند ارتقا بهره‌مند شوید:

* اطمینان حاصل کنید که اجزا در جدیدترین نسخه patch از نسخه فرعی (minor) فعلی شما قرار دارند.

* اجزای سیستم را به جدیدترین نسخه patch از نسخه فرعی (minor) هدف ارتقا دهید.

برای مثال، اگر در حال اجرای نسخه {{<skew currentVersionAddMinor -1>}} هستید، اطمینان حاصل کنید که از جدیدترین نسخه patch آن استفاده می‌کنید. سپس، به جدیدترین نسخه patch از {{<skew currentVersion>}} ارتقا دهید.

### kube-apiserver

پیش‌نیازها:

* در یک کلاستر تک‌نمونه‌ای (single-instance)، نمونه‌ی موجود `kube-apiserver` دارای نسخه **{{< skew currentVersionAddMinor -1 >}}** است.
*در یک کلاستر HA، تمام نمونه‌های kube-apiserver دارای نسخه **{{< skew currentVersionAddMinor -1 >}}** یا
**{{< skew currentVersion >}}** هستند (این موضوع اطمینان می‌دهد که اختلاف نسخه بین قدیمی‌ترین و جدیدترین نمونه‌ی `kube-apiserver` حداکثر یک نسخه‌ی جزئی است).
*نمونه‌های `kube-controller-manager`، `kube-scheduler` و `cloud-controller-manager` که با این سرور ارتباط دارند، در نسخه **{{< skew currentVersionAddMinor -1 >}}** قرار دارند
(این موضوع تضمین می‌کند که نسخه آن‌ها از نسخه فعلی سرور API جدیدتر نباشد و حداکثر یک نسخه جزئی با نسخه جدید سرور API اختلاف داشته باشند)
* نمونه‌های `kubelet` در تمام نودها در نسخه **{{< skew currentVersionAddMinor -1 >}}** یا **{{< skew currentVersionAddMinor -2 >}}** هستند.
(یعنی نسخه آن‌ها حداکثر یک یا دو نسخه جزئی پایین‌تر از نسخه جدید سرور API است).
 (این موضوع تضمین می‌کند که نسخه آن‌ها از نسخه فعلی سرور API جدیدتر نباشد و حداکثر دو نسخه جزئی با نسخه جدید سرور API اختلاف داشته باشند).
* وب‌هوک‌های پذیرش (admission webhooks) ثبت‌شده قادر هستند داده‌هایی را که نمونه جدید `kube-apiserver` برای آن‌ها ارسال می‌کند، پردازش کنند:
  * شیءهای ValidatingWebhookConfiguration و MutatingWebhookConfiguration به‌روزرسانی شده‌اند تا شامل هر نسخه جدیدی از منابع REST که در **{{< skew currentVersion >}}** اضافه شده‌اند باشند.
    (یا از گزینه [`matchPolicy: Equivalent` option](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy) که از نسخه v1.15 به بعد در دسترس است استفاده کنید)
  * وب‌هوک‌ها قادرند هر نسخه جدید از منابع REST که به آن‌ها ارسال می‌شود را پردازش کنند،
و همچنین هر فیلد جدیدی که به نسخه‌های موجود در **{{< skew currentVersion >}}** اضافه شده باشد را مدیریت نمایند.


`kube-apiserver`   اپدیت کنید **{{< skew currentVersion >}}**  به نسخه 
{{< توجه >}}
قوانین پروژه برای  [API deprecation](/docs/reference/using-api/deprecation-policy/) و
[API change guidelines](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)
require `kube-apiserver` to not skip minor versions when upgrading, even in single-instance clusters.
نیازمند این هست که `Kube-apiserver` در نسخه minor رد نشود در هنگام بروزرسانی، حتی در حالت یک کلاستر داریم 
{{< /توجه >}}

### kube-controller-manager, kube-scheduler, and cloud-controller-manager

نیازمندی ها:

* نمونه‌های kube-apiserver که این کامپوننت‌ها با آن‌ها ارتباط برقرار می‌کنند در نسخه {{< skew currentVersion >}} قرار دارند
(در خوشه‌های HA که این کامپوننت‌های کنترل پلین می‌توانند با هر نمونه‌ای از kube-apiserver در خوشه ارتباط برقرار کنند،
تمام نمونه‌های kube-apiserver باید قبل از ارتقاء این کامپوننت‌ها به‌روزرسانی شوند).

با ارتقا دادن `kube-controller-manager`, `kube-scheduler`, و
`cloud-controller-manager` to **{{< skew currentVersion >}}**. ترتیب مشخص و اجباری برای ارتقاء بین `kube-controller-manager`، `kube-scheduler` و `cloud-controller-manager` وجود ندارد.
می‌توانید این کامپوننت‌ها را به هر ترتیبی که می‌خواهید یا حتی به‌صورت همزمان ارتقاء دهید.

### kubelet

نیازمندی ها:

* نمونه‌های `kube-apiserver` که `kubelet` با آن‌ها ارتباط برقرار می‌کند، در نسخه **{{< skew currentVersion >}}** هستند.

اختیاری است که نمونه‌های `kubelet` را به نسخه **{{< skew currentVersion >}}** ارتقاء دهید
(یا می‌توان آن‌ها را در نسخه‌های **{{< skew currentVersionAddMinor -1 >}}**، **{{< skew currentVersionAddMinor -2 >}}**، یا **{{< skew currentVersionAddMinor -3 >}**} باقی گذاشت).

{{< توجه >}}
Before performing a minor version `kubelet` upgrade, [drain](/docs/tasks/administer-cluster/safely-drain-node/) pods from that node.
In-place minor version `kubelet` upgrades are not supported.

قبل از انجام ارتقاء نسخه minor `kubelet`، پادهای آن نود را خالی کنید [drain](/docs/tasks/administer-cluster/safely-drain-node/).
ارتقاء نسخه minor `kubelet` به صورت  (in-place) پشتیبانی نمی‌شود.

{{</ توجه >}}


{{< توجه >}}

اجرای یک کلاستر با نمونه‌های `kubelet` که به طور مداوم سه نسخه جزئی از `kube-apiserver` عقب‌تر هستند، به این معنی است که آن‌ها باید قبل از ارتقاء control plane به‌روزرسانی شوند.

{{</ توجه >}}

### kube-proxy

نیازمندی ها:

* نمونه‌های `kube-apiserver` که `kube-proxy` با آن‌ها ارتباط برقرار می‌کند در نسخه **{{< skew currentVersion >}}** قرار دارند.

اختیاری است که نمونه‌های `kube-proxy` را به نسخه **{{< skew currentVersion >}}** ارتقاء دهید
(یا می‌توان آن‌ها را در نسخه‌های **{{< skew currentVersionAddMinor -1 >}}**، **{{< skew currentVersionAddMinor -2 >}}**، یا **{{< skew currentVersionAddMinor -3 >}}** باقی گذاشت).


{{< توجه >}}
اجرای یک خوشه با نمونه‌های `kube-proxy` که به‌طور مداوم سه نسخه جزئی از `kube-apiserver` عقب‌تر هستند، به این معنی است که آن‌ها باید قبل از ارتقاء کنترل پلین، به‌روزرسانی شوند.
{{</ توجه >}}
