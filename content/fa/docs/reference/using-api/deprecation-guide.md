---
title: "راهنمای مهاجرت API منسوخ‌شده"
weight: 45
content_type: reference
---

<!-- overview -->

با تکامل API کوبرنتیز، APIها به صورت دوره‌ای سازماندهی مجدد یا ارتقا می‌یابند.
هنگامی که APIها تکامل می‌یابند، API قدیمی منسوخ شده و در نهایت حذف می‌شود.
این صفحه حاوی اطلاعاتی است که هنگام مهاجرت از نسخه‌های API منسوخ شده به نسخه‌های API جدیدتر و پایدارتر باید بدانید.

<!-- body -->

## API های حذف شده با انتشار


### v1.32

نسخه **v1.32** ارائه نسخه‌های API منسوخ‌شده زیر را متوقف کرد:

#### Flow control resources {#flowcontrol-resources-v132}

نسخه API مربوط به FlowSchema و PriorityLevelConfiguration از نسخه ۱.۳۲ به بعد دیگر ارائه نمی‌شود. **flowcontrol.apiserver.k8s.io/v1beta3**

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **flowcontrol.apiserver.k8s.io/v1** که از نسخه ۱.۲۹ در دسترس است، منتقل کنید.

* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* تغییرات قابل توجه در **flowcontrol.apiserver.k8s.io/v1**:
* فیلد PriorityLevelConfiguration `spec.limited.nominalConcurrencyShares` فقط در صورت عدم تعیین، به طور پیش‌فرض روی ۳۰ قرار می‌گیرد و مقدار صریح ۰ به ۳۰ تغییر نمی‌کند.

### v1.29

نسخه **v1.29** ارائه نسخه‌های API منسوخ‌شده زیر را متوقف کرد:

#### Flow control resources {#flowcontrol-resources-v129}

نسخه API مربوط به FlowSchema و PriorityLevelConfiguration از نسخه ۱.۲۹ به بعد دیگر ارائه نمی‌شود. **flowcontrol.apiserver.k8s.io/v1beta2**

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **flowcontrol.apiserver.k8s.io/v1** که از نسخه ۱.۲۹ در دسترس است، یا نسخه API **flowcontrol.apiserver.k8s.io/v1beta3** که از نسخه ۱.۲۶ در دسترس است، منتقل کنید.
* همه اشیاء موجودِ ذخیره‌شده از طریق API جدید قابل دسترسی هستند

* تغییرات قابل توجه در **flowcontrol.apiserver.k8s.io/v1**:
* فیلد PriorityLevelConfiguration `spec.limited.assuredConcurrencyShares` به `spec.limited.nominalConcurrencyShares` تغییر نام داده است و فقط در صورت عدم تعیین مقدار پیش‌فرض آن 30 است و مقدار صریح 0 به 30 تغییر نمی‌کند.
* Notable changes in **flowcontrol.apiserver.k8s**. تغییرات قابل توجه در **flowcontrol.apiserver**.

k8s.io/v1beta3**:
* فیلد PriorityLevelConfiguration `spec.limited.assuredConcurrencyShares` به `spec.limited.nominalConcurrencyShares` تغییر نام داده است.

### v1.27

نسخه **v1.27** ارائه نسخه‌های API منسوخ‌شده زیر را متوقف کرد:

#### CSIStorageCapacity {#csistoragecapacity-v127}

نسخه API **storage.k8s.io/v1beta1** از CSIStorageCapacity از نسخه ۱.۲۷ دیگر ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **storage.k8s.io/v1** که از نسخه ۱.۲۴ در دسترس است، منتقل کنید.

* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* هیچ تغییر قابل توجهی وجود ندارد

### v1.26

The **v1.26** release stopped serving the following deprecated API versions:

#### Flow control resources {#flowcontrol-resources-v126}

نسخه API **flowcontrol.apiserver.k8s.io/v1beta1** از FlowSchema و PriorityLevelConfiguration از نسخه ۱.۲۶ دیگر ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **flowcontrol.apiserver.k8s.io/v1beta2** منتقل کنید.

* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* هیچ تغییر قابل توجهی وجود ندارد

#### HorizontalPodAutoscaler {#horizontalpodautoscaler-v126}

نسخه API **autoscaling/v2beta2** از HorizontalPodAutoscaler از نسخه ۱.۲۶ دیگر ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **autoscaling/v2** که از نسخه ۱.۲۳ در دسترس است، منتقل کنید.

* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* تغییرات قابل توجه:

* `targetAverageUtilization` با `target.averageUtilization` و `target.type: Utilization` جایگزین شده است. به [Autoscaling on multiple metrics and custom metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics) مراجعه کنید.
### v1.25

نسخه **v1.25** ارائه نسخه‌های API منسوخ‌شده زیر را متوقف کرد:

#### CronJob {#cronjob-v125}

نسخه API **batch/v1beta1** از CronJob دیگر از نسخه ۱.۲۵ ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **batch/v1** که از نسخه ۱.۲۱ در دسترس است، منتقل کنید.

* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* هیچ تغییر قابل توجهی وجود ندارد

#### EndpointSlice {#endpointslice-v125}

نسخه API **discovery.k8s.io/v1beta1** از EndpointSlice دیگر از نسخه ۱.۲۵ ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **discovery.k8s.io/v1** که از نسخه ۱.۲۱ در دسترس است، منتقل کنید.

* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* تغییرات قابل توجه در **discovery.k8s.io/v1**:

* استفاده از فیلد `nodeName` برای هر Endpoint به جای فیلد منسوخ شده `topology["kubernetes.io/hostname"]`

* استفاده از فیلد `zone` برای هر Endpoint به جای فیلد منسوخ شده `topology["topology.kubernetes.io/zone"]`

* `topology` با فیلد `deprecatedTopology` جایگزین شده است که در نسخه ۱ قابل نوشتن نیست.

#### Event {#event-v125}

نسخه API **events.k8s.io/v1beta1** از Event دیگر از نسخه ۱.۲۵ ارائه نمی‌شود.

* برای استفاده از نسخه API **events.k8s.io/v1** که از نسخه ۱.۱۹ در دسترس است، مانیفست‌ها و کلاینت‌های API را منتقل کنید. * همه اشیاء موجود از طریق API جدید قابل دسترسی هستند
* تغییرات قابل توجه در **events.k8s.io/v1**:
* `type` به `Normal` و `Warning` محدود شده است
* `involvedObject` به `regarding` تغییر نام داده است
* `action`، `reason`، `reportingController` و `reportingInstance` هنگام ایجاد رویدادهای جدید **events.k8s.io/v1** الزامی هستند
* به جای فیلد منسوخ شده `firstTimestamp` (که به `deprecatedFirstTimestamp` تغییر نام داده شده و در رویدادهای جدید **events.k8s.io/v1** مجاز نیست) از `eventTime` استفاده کنید
* به جای فیلد منسوخ شده `lastTimestamp` از `series.lastObservedTime` استفاده کنید
(که به `deprecatedLastTimestamp` تغییر نام داده شده و در رویدادهای جدید مجاز نیست) **events.k8s.io/v1** Events)
* به جای فیلد منسوخ شده `count` (که به `deprecatedCount` تغییر نام داده شده و در رویدادهای جدید **events.k8s.io/v1** مجاز نیست) از `series.count` استفاده کنید.

* به جای فیلد منسوخ شده `source.component` (که به `deprecatedSource.component` تغییر نام داده شده و در رویدادهای جدید **events.k8s.io/v1** مجاز نیست) از `reportingController` استفاده کنید.

* به جای فیلد منسوخ شده `source.host` (که به `deprecatedSource.host` تغییر نام داده شده و در رویدادهای جدید **events.k8s.io/v1** مجاز نیست) از `reportingInstance` استفاده کنید.

#### HorizontalPodAutoscaler {#horizontalpodautoscaler-v125}

نسخه API **autoscaling/v2beta1** از HorizontalPodAutoscaler از نسخه ۱.۲۵ دیگر ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **autoscaling/v2** که از نسخه ۱.۲۳ در دسترس است، منتقل کنید.

* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* تغییرات قابل توجه:

* `targetAverageUtilization` با `target.averageUtilization` و `target.type: Utilization` جایگزین شده است. به [Autoscaling on multiple metrics and custom metrics](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/#autoscaling-on-multiple-metrics-and-custom-metrics) مراجعه کنید.

#### PodDisruptionBudget {#poddisruptionbudget-v125}

نسخه API **policy/v1beta1** از PodDisruptionBudget دیگر از نسخه ۱.۲۵ ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **policy/v1** که از نسخه ۱.۲۱ در دسترس است، منتقل کنید.

* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* تغییرات قابل توجه در **policy/v1**:

* یک `spec.selector` خالی (`{}`) که در `policy/v1` نوشته شده است، همه پادها را در فضای نام انتخاب می‌کند (در `policy/v1beta1` یک `spec.selector` خالی هیچ پادی را انتخاب نکرده است).

یک `spec.selector` تنظیم نشده، هیچ پادی را در هیچ یک از نسخه‌های API انتخاب نمی‌کند.

#### سیاست امنیتی پاد {#psp-v125}


سیاست امنیتی پاد در نسخه API **policy/v1beta1** از نسخه ۱.۲۵ دیگر ارائه نمی‌شود و کنترل‌کننده پذیرش سیاست امنیتی پاد حذف خواهد شد.

به [Pod Security Admission](/docs/concepts/security/pod-security-admission/) یا یک [3rd party admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/). مهاجرت کنید.

برای راهنمای مهاجرت، به [Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp/) مراجعه کنید. برای اطلاعات بیشتر در مورد منسوخ شدن، به [Migrate from PodSecurityPolicy to the Built-In PodSecurity Admission Controller](/docs/tasks/configure-pod-container/migrate-from-psp/). مراجعه کنید.

PodSecurityPolicy in the **policy/v1beta1** API version is no longer served as of v1.25,
and the PodSecurityPolicy admission controller will be removed.

#### RuntimeClass {#runtimeclass-v125}

کلاس RuntimeClass در نسخه API **node.k8s.io/v1beta1** از نسخه ۱.۲۵ دیگر ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **node.k8s.io/v1** که از نسخه ۱.۲۰ در دسترس است، منتقل کنید.

* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* هیچ تغییر قابل توجهی وجود ندارد

### v1.22

نسخه **v1.22** ارائه نسخه‌های API منسوخ‌شده زیر را متوقف کرد:

#### منابع وب‌هوک {#webhook-resources-v122}


نسخه API مربوط به MutatingWebhookConfiguration و ValidatingWebhookConfiguration از نسخه ۱.۲۲ دیگر ارائه نمی‌شود. **admissionregistration.k8s.io/v1beta1**

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **admissionregistration.k8s.io/v1** که از نسخه ۱.۱۶ در دسترس است، منتقل کنید. * همه اشیاء موجود از طریق API های جدید قابل دسترسی هستند
* تغییرات قابل توجه:
* مقدار پیش‌فرض `webhooks[*].failurePolicy` برای نسخه ۱ از `Ignore` به `Fail` تغییر کرد.
* مقدار پیش‌فرض `webhooks[*].matchPolicy` از `Exact` به `Equivalent` برای نسخه ۱ تغییر کرد.
* مقدار پیش‌فرض `webhooks[*].timeoutSeconds` از `30s` به `10s` برای نسخه ۱ تغییر کرد.
* مقدار پیش‌فرض `webhooks[*].sideEffects` حذف شد و فیلد مورد نیاز شد، و فقط `None` و `NoneOnDryRun` برای نسخه ۱ مجاز هستند.
* مقدار پیش‌فرض `webhooks[*].admissionReviewVersions` حذف شد و فیلد مورد نیاز شد. (نسخه‌های پشتیبانی شده برای AdmissionReview عبارتند از `v1` و `v1beta1`)
* مقدار پیش‌فرض `webhooks[*].name` باید باشد. برای اشیاء ایجاد شده از طریق `admissionregistration.k8s.io/v1` در لیست منحصر به فرد باشد

#### CustomResourceDefinition {#customresourcedefinition-v122}

نسخه API مربوط به CustomResourceDefinition با شناسه **apiextensions.k8s.io/v1beta1** از نسخه ۱.۲۲ دیگر ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **apiextensions.k8s.io/v1** که از نسخه ۱.۱۶ در دسترس است، منتقل کنید.
* تمام اشیاء موجودِ ذخیره‌شده از طریق API جدید قابل دسترسی هستند.
* تغییرات قابل توجه:
  * مقدار پیش‌فرض `spec.scope` دیگر `Namespaced` نیست و باید صریحاً مشخص شود.
  * `spec.version` در نسخه ۱ حذف شده است؛ به جای آن از `spec.versions` استفاده کنید
  * `spec.validation` در نسخه ۱ حذف شده است؛ به جای آن از `spec.versions[*].schema` استفاده کنید.
  * `spec.subresources` در نسخه ۱ حذف شده است؛ به جای آن از `spec.versions[*].subresources` استفاده کنید
  * `spec.additionalPrinterColumns` در نسخه ۱ حذف شده است؛ به جای آن از `spec.versions[*].additionalPrinterColumns` استفاده کنید.
  * `spec.conversion.webhookClientConfig` در نسخه ۱ به `spec.conversion.webhook.clientConfig` منتقل شده است.
  * `spec.conversion.conversionReviewVersions` در نسخه ۱ به `spec.conversion.webhook.conversionReviewVersions` منتقل شده است.
  * `spec.versions[*].schema.openAPIV3Schema` اکنون هنگام ایجاد اشیاء نسخه ۱ CustomResourceDefinition مورد نیاز است، و باید یک [structural schema](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema) باشد.
  * هنگام ایجاد اشیاء نسخه ۱ CustomResourceDefinition، `spec.preserveUnknownFields: true` مجاز نیست؛ باید در تعاریف طرحواره به صورت `x-kubernetes-preserve-unknown-fields: true` مشخص شود.
  * در آیتم‌های `additionalPrinterColumns`، فیلد `JSONPath` در نسخه ۱ به `jsonPath` تغییر نام داد. (رفع مشکل [#66531](https://github.com/kubernetes/kubernetes/issues/66531))

#### APIService {#apiservice-v122}

نسخه API **apiregistration.k8s.io/v1beta1** از APIService دیگر از نسخه ۱.۲۲ ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **apiregistration.k8s.io/v1** که از نسخه ۱.۱۰ در دسترس است، منتقل کنید.
* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* هیچ تغییر قابل توجهی وجود ندارد
#### TokenReview {#tokenreview-v122}

نسخه API **authentication.k8s.io/v1beta1** از TokenReview از نسخه ۱.۲۲ دیگر ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **authentication.k8s.io/v1** که از نسخه ۱.۶ در دسترس است، منتقل کنید.
* تغییر قابل توجهی رخ نداده است

#### SubjectAccessReview resources {#subjectaccessreview-resources-v122}

نسخه API **authorization.k8s.io/v1beta1** از LocalSubjectAccessReview، SelfSubjectAccessReview، SubjectAccessReview و SelfSubjectRulesReview از نسخه ۱.۲۲ دیگر ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **authorization.k8s.io/v1** که از نسخه ۱.۶ در دسترس است، منتقل کنید.
* تغییرات قابل توجه:
  * `spec.group` در نسخه ۱ به `spec.groups` تغییر نام داد (رفع مشکلات [#32709](https://github.com/kubernetes/kubernetes/issues/32709))

#### CertificateSigningRequest {#certificatesigningrequest-v122}

نسخه API مربوط به CertificateSigningRequest از نسخه ۱.۲۲ به بعد دیگر ارائه نمی‌شود. **certificates.k8s.io/v1beta1**


* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **certificates.k8s.io/v1** که از نسخه ۱.۱۹ در دسترس است، منتقل کنید.
* تمام اشیاء موجودِ ذخیره‌شده از طریق API جدید قابل دسترسی هستند.
* تغییرات قابل توجه در `certificates.k8s.io/v1`:
  *برای کلاینت‌های API که درخواست گواهینامه می‌کنند:
    * اکنون `spec.signerName` مورد نیاز است (به [امضاکنندگان شناخته‌شده Kubernetes](/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers) مراجعه کنید)، و درخواست‌های `kubernetes.io/legacy-unknown` از طریق API `certificates.k8s.io/v1` مجاز به ایجاد نیستند.
    * `spec.usages` اکنون الزامی است، نمی‌تواند حاوی مقادیر تکراری باشد و فقط باید شامل کاربردهای شناخته شده باشد.
* برای کلاینت‌های API که گواهی‌ها را تأیید یا امضا می‌کنند:
    * `status.conditions` ممکن است شامل انواع تکراری نباشد
    * `status.conditions[*].status` اکنون مورد نیاز است
    * `status.certificate` باید با PEM کدگذاری شده باشد و فقط شامل بلوک‌های `CERTIFICATE` باشد.

#### Lease {#lease-v122}

نسخه API **coordination.k8s.io/v1beta1** از Lease دیگر از نسخه ۱.۲۲ ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **coordination.k8s.io/v1** که از نسخه ۱.۱۴ در دسترس است، منتقل کنید.
* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* هیچ تغییر قابل توجهی وجود ندارد


#### Ingress {#ingress-v122}

نسخه‌های **extensions/v1beta1** و **networking.k8s.io/v1beta1** از رابط برنامه‌نویسی Ingress از نسخه ۱.۲۲ دیگر ارائه نمی‌شوند.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **networking.k8s.io/v1** که از نسخه ۱.۱۹ در دسترس است، منتقل کنید.

* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* تغییرات قابل توجه:

* `spec.backend` به `spec.defaultBackend` تغییر نام داده شده است.
* فیلد `serviceName` در backend به `service.name` تغییر نام داده شده است.
* فیلدهای عددی `servicePort` در backend به `service.port.number` تغییر نام داده شده‌اند.
* فیلدهای رشته‌ای `servicePort` در backend به `service.port.name` تغییر نام داده شده‌اند.
* `pathType` اکنون برای هر مسیر مشخص شده الزامی است. گزینه‌ها عبارتند از `Prefix`، `Exact` و `ImplementationSpecific`. برای مطابقت با رفتار تعریف نشده‌ی `v1beta1`، از `ImplementationSpecific` استفاده کنید.

#### IngressClass {#ingressclass-v122}

نسخه API **networking.k8s.io/v1beta1** از IngressClass از نسخه ۱.۲۲ دیگر ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **networking.k8s.io/v1** که از نسخه ۱.۱۹ در دسترس است، منتقل کنید.
* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* هیچ تغییر قابل توجهی وجود ندارد

#### RBAC resources {#rbac-resources-v122}

نسخه **rbac.authorization.k8s.io/v1beta1** API از ClusterRole، ClusterRoleBinding،
Role، و RoleBinding از نسخه ۱.۲۲ دیگر ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **rbac.authorization.k8s.io/v1** که از نسخه ۱.۸ در دسترس است، منتقل کنید.
* همه اشیاء موجود از طریق APIهای جدید قابل دسترسی هستند.
* هیچ تغییر قابل توجهی وجود ندارد

#### PriorityClass {#priorityclass-v122}

نسخه API **scheduling.k8s.io/v1beta1** از PriorityClass دیگر از نسخه ۱.۲۲ ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **scheduling.k8s.io/v1** که از نسخه ۱.۱۴ در دسترس است، منتقل کنید.
* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* هیچ تغییر قابل توجهی وجود ندارد

#### Storage resources {#storage-resources-v122}

نسخه API **storage.k8s.io/v1beta1** از CSIDriver، CSINode، StorageClass و VolumeAttachment از نسخه ۱.۲۲ دیگر ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **storage.k8s.io/v1** مهاجرت دهید.
* CSIDriver از نسخه ۱.۱۹ در **storage.k8s.io/v1** موجود است.
* CSINode از نسخه ۱.۱۷ در **storage.k8s.io/v1** موجود است.
* StorageClass از نسخه ۱.۶ در **storage.k8s.io/v1** موجود است.
* VolumeAttachment در **storage.k8s.io/v1** نسخه ۱.۱۳ موجود است.
* همه اشیاء دائمی موجود از طریق APIهای جدید قابل دسترسی هستند.
* هیچ تغییر قابل توجهی وجود ندارد.

### v1.16

نسخه **v1.16** ارائه نسخه‌های API منسوخ‌شده زیر را متوقف کرد:

#### NetworkPolicy {#networkpolicy-v116}

نسخه API **extensions/v1beta1** از NetworkPolicy از نسخه ۱.۱۶ دیگر ارائه نمی‌شود.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **networking.k8s.io/v1** که از نسخه ۱.۸ در دسترس است، منتقل کنید.
* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.

#### DaemonSet {#daemonset-v116}

نسخه‌های API **extensions/v1beta1** و **apps/v1beta2** از DaemonSet دیگر از نسخه ۱.۱۶ ارائه نمی‌شوند.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **apps/v1** که از نسخه ۱.۹ در دسترس است، منتقل کنید.
* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* تغییرات قابل توجه:
* `spec.templateGeneration` حذف شده است.
* `spec.selector` اکنون پس از ایجاد مورد نیاز و تغییرناپذیر است. از برچسب‌های قالب موجود به عنوان انتخابگر برای ارتقاءهای یکپارچه استفاده کنید.
* `spec.updateStrategy.type` اکنون به طور پیش‌فرض روی `RollingUpdate` تنظیم شده است. (پیش‌فرض در `extensions/v1beta1`، `OnDelete` بود.)

#### Deployment {#deployment-v116}

نسخه‌های **extensions/v1beta1**، **apps/v1beta1** و **apps/v1beta2** از API مربوط به Deployment از نسخه ۱.۱۶ دیگر ارائه نمی‌شوند.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **apps/v1** که از نسخه ۱.۹ در دسترس است، منتقل کنید.
* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* تغییرات قابل توجه:
* `spec.rollbackTo` حذف شده است.
* `spec.selector` اکنون پس از ایجاد، الزامی و غیرقابل تغییر است. از برچسب‌های قالب موجود به عنوان انتخابگر برای ارتقاءهای یکپارچه استفاده کنید. * `spec.progressDeadlineSeconds` اکنون به طور پیش‌فرض روی `600` ثانیه است. (پیش‌فرض در `extensions/v1beta1` بدون مهلت بود)
* `spec.revisionHistoryLimit` اکنون به طور پیش‌فرض روی `10` است. (پیش‌فرض در `apps/v1beta1` `2` بود، پیش‌فرض در `extensions/v1beta1` حفظ همه بود)
* `maxSurge` و `maxUnavailable` اکنون به طور پیش‌فرض روی `25٪` هستند. (پیش‌فرض در `extensions/v1beta1` `1` بود)

#### StatefulSet {#statefulset-v116}

نسخه‌های API **apps/v1beta1** و **apps/v1beta2** از StatefulSet دیگر از نسخه ۱.۱۶ ارائه نمی‌شوند.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **apps/v1** که از نسخه ۱.۹ در دسترس است، منتقل کنید.
* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* تغییرات قابل توجه:
* `spec.selector` اکنون پس از ایجاد مورد نیاز و تغییرناپذیر است.
از برچسب‌های قالب موجود به عنوان انتخابگر برای ارتقاءهای یکپارچه استفاده کنید.
* `spec.updateStrategy.type` اکنون به طور پیش‌فرض روی `RollingUpdate` تنظیم شده است. (پیش‌فرض در `apps/v1beta1`، `OnDelete` بود.)

#### ReplicaSet {#replicaset-v116}

نسخه‌های **extensions/v1beta1**، **apps/v1beta1** و **apps/v1beta2** از API مربوط به ReplicaSet از نسخه ۱.۱۶ دیگر ارائه نمی‌شوند.

* مانیفست‌ها و کلاینت‌های API را برای استفاده از نسخه API **apps/v1** که از نسخه ۱.۹ در دسترس است، منتقل کنید.
* همه اشیاء موجود از طریق API جدید قابل دسترسی هستند.
* تغییرات قابل توجه:
* `spec.selector` اکنون پس از ایجاد، الزامی و غیرقابل تغییر است؛ از برچسب‌های الگوی موجود به عنوان انتخابگر برای ارتقاءهای یکپارچه استفاده کنید.

#### سیاست امنیتی پاد {#psp-v116}

نسخه API **extensions/v1beta1** از سیاست امنیتی پاد از نسخه ۱.۱۶ دیگر ارائه نمی‌شود.

* برای استفاده از نسخه API **policy/v1beta1** که از نسخه ۱.۱۰ در دسترس است، مانیفست‌ها و کلاینت API را منتقل کنید.
* توجه داشته باشید که نسخه API **policy/v1beta1** از سیاست امنیتی پاد در نسخه ۱.۲۵ حذف خواهد شد.

## چه باید کرد

### تست با API های منسوخ غیرفعال

شما می‌توانید خوشه‌های خود را با راه‌اندازی یک سرور API با نسخه‌های API خاص غیرفعال، آزمایش کنید تا حذف‌های آینده را شبیه‌سازی کنید. پرچم زیر را به آرگومان‌های راه‌اندازی سرور API اضافه کنید:

`--runtime-config=<group>/<version>=false`

به عنوان مثال:

`--runtime-config=admissionregistration.k8s.io/v1beta1=false,apiextensions.k8s.io/v1beta1,...`

### استفاده از API های منسوخ شده را پیدا کنید

برای یافتن محل استفاده از APIهای منسوخ‌شده، از [هشدارهای مشتری، معیارها و اطلاعات حسابرسی موجود در 1.19+](/blog/2020/09/03/warnings/#deprecation-warnings) استفاده کنید.

### مهاجرت به API های منسوخ نشده

* به‌روزرسانی یکپارچه‌سازی‌ها و کنترلرهای سفارشی برای فراخوانی APIهای منسوخ‌نشده
* تغییر فایل‌های YAML برای ارجاع به APIهای منسوخ‌نشده

شما می‌توانید از دستور `kubectl convert` برای تبدیل خودکار یک شیء موجود استفاده کنید:

  `kubectl convert -f <file> --output-version <group>/<version>`.

برای مثال، برای تبدیل یک Deployment قدیمی‌تر به `apps/v1`، می‌توانید دستور زیر را اجرا کنید:

  `kubectl convert -f ./my-deployment.yaml --output-version apps/v1`

این تبدیل ممکن است از مقادیر پیش‌فرض غیر ایده‌آل استفاده کند. برای کسب اطلاعات بیشتر در مورد یک منبع خاص، Kubernetes  [API reference](/docs/reference/kubernetes-api/). را بررسی کنید.
  
  {{< note >}}
ابزار `kubectl convert` به طور پیش‌فرض نصب نشده است، اگرچه در واقع زمانی بخشی از خود `kubectl` بود. برای جزئیات بیشتر، می‌توانید [مشکل منسوخ شدن و حذف](https://github.com/kubernetes/kubectl/issues/725) را برای زیردستور داخلی مطالعه کنید.
  
برای یادگیری نحوه‌ی راه‌اندازی  `kubectl convert` روی رایانه‌تان، به صفحه‌ای که مناسب سیستم عامل شماست مراجعه کنید:

  [Linux](/docs/tasks/tools/install-kubectl-linux/#install-kubectl-convert-plugin),
  [macOS](/docs/tasks/tools/install-kubectl-macos/#install-kubectl-convert-plugin), or
  [Windows](/docs/tasks/tools/install-kubectl-windows/#install-kubectl-convert-plugin).
  {{< /note >}}