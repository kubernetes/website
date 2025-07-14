---
title: "حاشیه‌نویسی‌های حسابرسی"
weight: 10
---

<!-- overview -->

این صفحه به عنوان مرجعی برای حاشیه‌نویسی‌های حسابرسی نیم اسپیس  kubernetes.io عمل می‌کند. این حاشیه‌نویسی‌ها برای شیء `Event` از گروه API `audit.k8s.io` اعمال می‌شوند.

{{< note >}}
حاشیه‌نویسی‌های زیر در API Kubernetes استفاده نمی‌شوند. وقتی شما در خوشه خود، حسابرسی را فعال می‌کنید، داده‌های رویداد حسابرسی با استفاده از `Event` از گروه API `audit.k8s.io` [enable auditing](/docs/tasks/debug/debug-cluster/audit/)نوشته می‌شوند. این حاشیه‌نویسی‌ها برای رویدادهای حسابرسی اعمال می‌شوند. رویدادهای حسابرسی با اشیاء موجود در [Event API](/docs/reference/kubernetes-api/cluster-resources/event-v1/) (API group `events.k8s.io`). متفاوت هستند.
{{< /note >}}

<!-- body -->

## k8s.io/deprecated

مثال: `k8s.io/deprecated: "true"`

مقدار **باید** "true" یا "false" باشد. مقدار "true" نشان می‌دهد که درخواست از یک نسخه API منسوخ شده استفاده کرده است.

## k8s.io/removed-release

مثال: `k8s.io/removed-release: "1.22"`

مقدار **باید** در قالب "\<MAJOR>\.\<MINOR>\" باشد. این مقدار طوری تنظیم شده است که نسخه حذف را هدف قرار دهد
در درخواست‌های ارسالی به نسخه‌های منسوخ API با نسخه حذف هدف.

## pod-security.kubernetes.io/exempt

Example: `pod-security.kubernetes.io/exempt: namespace`

مثال: `pod-security.kubernetes.io/exempt: namespace`

مقدار **باید** یکی از `user`، `namespace` یا `runtimeClass` باشد که مربوط به ابعاد `[Pod Security Exemption](/docs/concepts/security/pod-security-admission/#exemptions)` باشد. این حاشیه‌نویسی نشان می‌دهد که معافیت از اجرای PodSecurity بر اساس کدام بعد بوده است.


## pod-security.kubernetes.io/enforce-policy

مثال: `pod-security.kubernetes.io/enforce-policy: restricted:latest`

مقدار **باید** به صورت `privileged:<version>`، `baseline:<version>`، `restricted:<version>` باشد که مربوط به سطوح [Pod Security
Standard](/docs/concepts/security/pod-security-standards) به همراه نسخه‌ای که **باید** `latest` یا یک نسخه معتبر Kubernetes با فرمت `v<MAJOR>.<MINOR>` باشد، می‌باشد. این حاشیه‌نویسی‌ها در مورد سطح اجرایی که `pod را در طول پذیرش PodSecurity مجاز یا غیرمجاز کرده است، اطلاع می‌دهد.

برای اطلاعات بیشتر به [استانداردهای امنیتی پاد](/docs/concepts/security/pod-security-standards/) مراجعه کنید.


## pod-security.kubernetes.io/audit-violations

مثال: `pod-security.kubernetes.io/audit-violations: would violation
PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container
"example" must set securityContext.allowPrivilegeEscalation=false), ...`

مقدار، جزئیات نقض سیاست حسابرسی را شرح می‌دهد، که شامل سطح [Pod Security Standard](/docs/concepts/security/pod-security-standards/) که از آن تخطی شده است و همچنین سیاست‌های خاص در فیلدهایی که از اجرای PodSecurity نقض شده‌اند، می‌باشد.

برای اطلاعات بیشتر به [Pod Security Standards](/docs/concepts/security/pod-security-standards/)مراجعه کنید.
Value details an audit policy violation, it contains the
## apiserver.latency.k8s.io/etcd

مثال: `apiserver.latency.k8s.io/etcd: "4.730661757s"`

این حاشیه‌نویسی، میزان تأخیر ایجاد شده در داخل لایه ذخیره‌سازی را نشان می‌دهد،
این حاشیه‌نویسی، زمان لازم برای ارسال داده‌ها به etcd و دریافت پاسخ کامل را محاسبه می‌کند.

مقدار این حاشیه‌نویسی حسابرسی، زمان صرف شده برای پذیرش یا اعتبارسنجی را شامل نمی‌شود.

## apiserver.latency.k8s.io/decode-response-object

مثال: `apiserver.latency.k8s.io/decode-response-object: "450.6649ns"`

این حاشیه‌نویسی، زمان لازم برای رمزگشایی پاسخ دریافتی از لایه ذخیره‌سازی (etcd) را ثبت می‌کند.

## apiserver.latency.k8s.io/apf-queue-wait

مثال: `apiserver.latency.k8s.io/apf-queue-wait: "100ns"`

این حاشیه‌نویسی، مدت زمانی را که یک درخواست به دلیل اولویت‌های سرور API در صف انتظار می‌ماند، ثبت می‌کند.

برای اطلاعات بیشتر در مورد این مکانیسم، به [API Priority and Fairness](/docs/concepts/cluster-administration/flow-control/) (APF) مراجعه کنید.

## authorization.k8s.io/decision

مثال: `authorization.k8s.io/decision: "forbid"`

مقدار باید **forbid** یا **allow** باشد. این حاشیه‌نویسی نشان می‌دهد که آیا یک درخواست
در گزارش‌های حسابرسی Kubernetes مجاز بوده است یا خیر.

برای اطلاعات بیشتر به [Auditing](/docs/tasks/debug/debug-cluster/audit/) مراجعه کنید.

## authorization.k8s.io/reason

مثال: `authorization.k8s.io/reason: "دلیل قابل خواندن توسط انسان برای تصمیم"`

این حاشیه‌نویسی دلیل [decision](#authorization-k8s-io-decision) را در گزارش‌های حسابرسی Kubernetes ارائه می‌دهد.

برای اطلاعات بیشتر به [Auditing](/docs/tasks/debug/debug-cluster/audit/) مراجعه کنید.

## missing-san.invalid-cert.kubernetes.io/$hostname

مثال: `missing-san.invalid-cert.kubernetes.io/example-svc.example-namespace.svc: "برای اعتبارسنجی موضوع، به جای پسوند SAN، به یک فیلد نام مشترک قدیمی متکی است"`

توسط Kubernetes نسخه v1.24 و بالاتر استفاده می‌شود.

این حاشیه‌نویسی نشان می‌دهد که یک وب‌هوک یا سرور API تجمیع‌شده از یک گواهی نامعتبر استفاده می‌کند که فاقد `subjectAltNames` است.

پشتیبانی از این گواهی‌ها به طور پیش‌فرض در Kubernetes 1.19 غیرفعال بود، و در Kubernetes 1.23 حذف شد.

درخواست‌ها به نقاط پایانی که از این گواهینامه‌ها استفاده می‌کنند، با شکست مواجه خواهند شد.

سرویس‌هایی که از این گواهینامه‌ها استفاده می‌کنند باید در اسرع وقت آنها را جایگزین کنند

تا از اختلال در هنگام اجرا در محیط‌های Kubernetes 1.23+ جلوگیری شود.

اطلاعات بیشتر در این مورد در مستندات Go وجود دارد:
[X.509 CommonName deprecation](https://go.dev/doc/go1.15#commonname).
## insecure-sha1.invalid-cert.kubernetes.io/$hostname

مثال: `insecure-sha1.invalid-cert.kubernetes.io/example-svc.example-namespace.svc: "از امضای SHA-1 ناامن استفاده می‌کند"`

توسط Kubernetes نسخه v1.24 و بالاتر استفاده می‌شود

این حاشیه‌نویسی نشان می‌دهد که یک وب‌هوک یا سرور API تجمیع‌شده
از یک گواهی ناامن امضا شده با هش SHA-1 استفاده می‌کند.

پشتیبانی از این گواهی‌های ناامن به طور پیش‌فرض در Kubernetes 1.24 غیرفعال است و در نسخه‌های آینده حذف خواهد شد.

سرویس‌هایی که از این گواهینامه‌ها استفاده می‌کنند باید در اسرع وقت آنها را جایگزین کنند تا از ایمن بودن اتصالات و جلوگیری از اختلال در نسخه‌های آینده اطمینان حاصل شود.

اطلاعات بیشتر در این مورد در مستندات Go وجود دارد:
[Rejecting SHA-1 certificates](https://go.dev/doc/go1.18#sha1).

## validation.policy.admission.k8s.io/validation_failure

مثال: `validation.policy.admission.k8s.io/validation_failure: '[{"message": "مقدار نامعتبر", {"policy": "policy.example.com", {"binding": "policybinding.example.com", {"expressionIndex": "1", {"validationActions": ["Audit"]}]'`

توسط Kubernetes نسخه v1.27 و بالاتر استفاده می‌شود.

این حاشیه‌نویسی نشان می‌دهد که اعتبارسنجی سیاست پذیرش برای یک درخواست API به صورت نادرست ارزیابی شده است، یا اینکه اعتبارسنجی منجر به خطایی شده است در حالی که سیاست با `failurePolicy: Fail` پیکربندی شده است.
مقدار حاشیه‌نویسی یک شیء JSON است. `message` در JSON پیامی در مورد شکست اعتبارسنجی ارائه می‌دهد.

`policy`، `binding` و `expressionIndex` در JSON به ترتیب نام `ValidatingAdmissionPolicy`، نام `ValidatingAdmissionPolicyBinding` و اندیس موجود در `validations` سیاست عبارات CEL که شکست خورده‌اند را مشخص می‌کنند.

«validationActions» نشان می‌دهد که چه اقداماتی برای این خطای اعتبارسنجی انجام شده است.
برای جزئیات بیشتر در مورد «validationActions» به [Validating Admission Policy](/docs/reference/access-authn-authz/validating-admission-policy/) مراجعه کنید.
