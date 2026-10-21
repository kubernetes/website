---
reviewers:
- sig-api-machinery
- sig-architecture
- sig-cli
- sig-cluster-lifecycle
- sig-node
- sig-release
title: سياسة انحراف الإصدارات
type: docs
description: >
  أقصى انحراف في الإصدارات مدعوم بين مكوّنات كوبيرنيتيس المختلفة.
---

<!-- overview -->
تصف هذه الوثيقة أقصى انحراف في الإصدارات مدعوم بين مكوّنات كوبيرنيتيس المختلفة.
وقد تفرض أدوات نشر العناقيد المحددة قيوداً إضافية على انحراف الإصدارات.

<!-- body -->

## الإصدارات المدعومة {#supported-versions}

تُعبَّر إصدارات كوبيرنيتيس بالصيغة **x.y.z**، حيث **x** هو الإصدار الرئيسي،
و**y** هو الإصدار الثانوي، و**z** هو الإصدار التصحيحي، وفق مصطلحات
[الإصدار الدلالي](https://semver.org/). ولمزيد من المعلومات، راجع
[ترقيم إصدارات كوبيرنيتيس](https://git.k8s.io/sig-release/release-engineering/versioning.md#kubernetes-release-versioning).

يحافظ مشروع كوبيرنيتيس على فروع إصدارات لأحدث ثلاثة إصدارات ثانوية
({{< skew latestVersion >}}، {{< skew prevMinorVersion >}}، {{< skew oldestMinorVersion >}}).
ويحصل كوبيرنيتيس 1.19 والإصدارات الأحدث على
[دعم تصحيحي لنحو سنة واحدة](/ar/releases/patch-releases/#support-period).
وقد حصل كوبيرنيتيس 1.18 والإصدارات الأقدم على دعم تصحيحي لنحو تسعة أشهر.

قد تُرجَّع الإصلاحات المنطبقة، بما فيها إصلاحات الأمان، إلى فروع الإصدارات
الثلاثة تلك، بحسب درجة الخطورة وإمكانية التنفيذ. وتُصدر الإصدارات التصحيحية من
تلك الفروع وفق [وتيرة منتظمة](/ar/releases/patch-releases/#cadence)، إضافة إلى
إصدارات عاجلة إضافية عند الحاجة.

وتتخذ [مجموعة مديري الإصدارات](/ar/releases/release-managers/) القرار بشأن ذلك.

ولمزيد من المعلومات، راجع صفحة
[الإصدارات التصحيحية](/ar/releases/patch-releases/) في كوبيرنيتيس.

## انحراف الإصدارات المدعوم {#supported-version-skew}

### kube-apiserver

في [العناقيد عالية التوافر (HA)](/docs/setup/production-environment/tools/kubeadm/high-availability/)،
يجب أن تكون نسخ `kube-apiserver` الأحدث والأقدم ضمن إصدار ثانوي واحد.

مثال:

* أحدث `kube-apiserver` عند **{{< skew currentVersion >}}**
* نسخ `kube-apiserver` الأخرى مدعومة عند **{{< skew currentVersion >}}** و**{{< skew currentVersionAddMinor -1 >}}**

### kubelet

* يجب ألا يكون `kubelet` أحدث من `kube-apiserver`.
* يمكن أن يكون `kubelet` أقدم من `kube-apiserver` بما يصل إلى ثلاثة إصدارات ثانوية
  (و`kubelet` الأقدم من 1.25 يمكن أن يكون أقدم بما يصل إلى إصدارين ثانويين فقط).

مثال:

* `kube-apiserver` عند **{{< skew currentVersion >}}**
* `kubelet` مدعوم عند **{{< skew currentVersion >}}**، و**{{< skew currentVersionAddMinor -1 >}}**،
  و**{{< skew currentVersionAddMinor -2 >}}**، و**{{< skew currentVersionAddMinor -3 >}}**

{{< note >}}
إذا كان هناك انحراف في الإصدارات بين نسخ `kube-apiserver` في عنقود HA، فإن ذلك يضيّق
نطاق إصدارات `kubelet` المسموح بها.
{{</ note >}}

مثال:

* نسخ `kube-apiserver` عند **{{< skew currentVersion >}}** و**{{< skew currentVersionAddMinor -1 >}}**
* `kubelet` مدعوم عند **{{< skew currentVersionAddMinor -1 >}}**، و**{{< skew currentVersionAddMinor -2 >}}**،
  و**{{< skew currentVersionAddMinor -3 >}}** (**{{< skew currentVersion >}}** غير مدعوم لأن ذلك
  سيكون أحدث من نسخة `kube-apiserver` عند الإصدار **{{< skew currentVersionAddMinor -1 >}}**)

### kube-proxy

* يجب ألا يكون `kube-proxy` أحدث من `kube-apiserver`.
* يمكن أن يكون `kube-proxy` أقدم من `kube-apiserver` بما يصل إلى ثلاثة إصدارات
  ثانوية (و`kube-proxy` الأقدم من 1.25 يمكن أن يكون أقدم بما يصل إلى إصدارين
  ثانويين فقط).
* يمكن أن يكون `kube-proxy` أقدم أو أحدث من نسخة `kubelet` التي يعمل بجانبها بما
  يصل إلى ثلاثة إصدارات ثانوية (و`kube-proxy` الأقدم من 1.25 يمكن أن يكون أقدم أو
  أحدث من نسخة `kubelet` التي يعمل بجانبها بما يصل إلى إصدارين ثانويين فقط).

مثال:

* `kube-apiserver` عند **{{< skew currentVersion >}}**
* `kube-proxy` مدعوم عند **{{< skew currentVersion >}}**، و**{{< skew currentVersionAddMinor -1 >}}**،
  و**{{< skew currentVersionAddMinor -2 >}}**، و**{{< skew currentVersionAddMinor -3 >}}**

{{< note >}}
إذا كان هناك انحراف في الإصدارات بين نسخ `kube-apiserver` في عنقود HA، فإن ذلك يضيّق
نطاق إصدارات `kube-proxy` المسموح بها.
{{</ note >}}

مثال:

* نسخ `kube-apiserver` عند **{{< skew currentVersion >}}** و**{{< skew currentVersionAddMinor -1 >}}**
* `kube-proxy` مدعوم عند **{{< skew currentVersionAddMinor -1 >}}**، و**{{< skew currentVersionAddMinor -2 >}}**،
  و**{{< skew currentVersionAddMinor -3 >}}** (**{{< skew currentVersion >}}** غير مدعوم لأن ذلك سيكون
  أحدث من نسخة `kube-apiserver` عند الإصدار **{{< skew currentVersionAddMinor -1 >}}**)

### kube-controller-manager، kube-scheduler، و cloud-controller-manager
{#kube-controller-manager-kube-scheduler-and-cloud-controller-manager}

يجب ألا تكون `kube-controller-manager` و`kube-scheduler` و`cloud-controller-manager`
أحدث من نسخ `kube-apiserver` التي تتواصل معها. ويُتوقّع أن تطابق الإصدار الثانوي
لـ `kube-apiserver`، لكن يمكن أن تكون أقدم بما يصل إلى إصدار ثانوي واحد (لإتاحة
الترقية أثناء التشغيل).

مثال:

* `kube-apiserver` عند **{{< skew currentVersion >}}**
* `kube-controller-manager` و`kube-scheduler` و`cloud-controller-manager` مدعومة
  عند **{{< skew currentVersion >}}** و**{{< skew currentVersionAddMinor -1 >}}**

{{< note >}}
إذا كان هناك انحراف في الإصدارات بين نسخ `kube-apiserver` في عنقود HA، وكانت هذه
المكوّنات قادرة على التواصل مع أي نسخة `kube-apiserver` في العنقود (مثلاً عبر موازن
حمل)، فإن ذلك يضيّق نطاق إصدارات هذه المكوّنات المسموح بها.
{{< /note >}}

مثال:

* نسخ `kube-apiserver` عند **{{< skew currentVersion >}}** و**{{< skew currentVersionAddMinor -1 >}}**
* `kube-controller-manager` و`kube-scheduler` و`cloud-controller-manager` تتواصل مع موازن
  حمل يمكنه التوجيه إلى أي نسخة `kube-apiserver`
* `kube-controller-manager` و`kube-scheduler` و`cloud-controller-manager` مدعومة عند
  **{{< skew currentVersionAddMinor -1 >}}** (**{{< skew currentVersion >}}** غير مدعوم
  لأن ذلك سيكون أحدث من نسخة `kube-apiserver` عند الإصدار **{{< skew currentVersionAddMinor -1 >}}**)

### kubectl

`kubectl` مدعوم ضمن إصدار ثانوي واحد (أقدم أو أحدث) من `kube-apiserver`.

مثال:

* `kube-apiserver` عند **{{< skew currentVersion >}}**
* `kubectl` مدعوم عند **{{< skew currentVersionAddMinor 1 >}}**، و**{{< skew currentVersion >}}**،
  و**{{< skew currentVersionAddMinor -1 >}}**

{{< note >}}
إذا كان هناك انحراف في الإصدارات بين نسخ `kube-apiserver` في عنقود HA، فإن ذلك يضيّق
نطاق إصدارات `kubectl` المدعومة.
{{< /note >}}

مثال:

* نسخ `kube-apiserver` عند **{{< skew currentVersion >}}** و**{{< skew currentVersionAddMinor -1 >}}**
* `kubectl` مدعوم عند **{{< skew currentVersion >}}** و**{{< skew currentVersionAddMinor -1 >}}**
  (أي إصدارات أخرى تكون أكثر من إصدار ثانوي انحرافاً عن أحد مكوّنات `kube-apiserver`)

## ترتيب ترقية المكوّنات المدعوم {#supported-component-upgrade-order}

للانحراف في الإصدارات المدعوم بين المكوّنات آثار على الترتيب الذي يجب
أن تُرقّى به المكوّنات. ويصف هذا القسم الترتيب الواجب اتباعه في ترقية المكوّنات
لانتقال عنقود قائم من الإصدار **{{< skew currentVersionAddMinor -1 >}}** إلى الإصدار
**{{< skew currentVersion >}}**.

وبشكل اختياري، عند التحضير للترقية، يوصي مشروع كوبيرنيتيس بما يلي للاستفادة من
أكبر عدد ممكن من إصلاحات الانحدار والأخطاء أثناء ترقية:

* التأكّد من أن المكوّنات على أحدث إصدار تصحيحي من الإصدار الثانوي الحالي.
* ترقية المكوّنات إلى أحدث إصدار تصحيحي من الإصدار الثانوي الهدف.

على سبيل المثال، إذا كنت تشغّل الإصدار {{<skew currentVersionAddMinor -1>}}،
فتأكّد من أنك على أحدث إصدار تصحيحي. ثم رقِّ إلى أحدث إصدار تصحيحي من
{{<skew currentVersion>}}.

### kube-apiserver

المتطلبات السابقة:

* في عنقود بنسخة واحدة، تكون نسخة `kube-apiserver` القائمة عند **{{< skew currentVersionAddMinor -1 >}}**
* في عنقود HA، تكون جميع نسخ `kube-apiserver` عند **{{< skew currentVersionAddMinor -1 >}}** أو
  **{{< skew currentVersion >}}** (وهذا يضمن أقصى انحراف بإصدار ثانوي واحد بين أقدم نسخة
  `kube-apiserver` وأحدثها)
* نسخ `kube-controller-manager` و`kube-scheduler` و`cloud-controller-manager` التي
  تتواصل مع هذا الخادم عند الإصدار **{{< skew currentVersionAddMinor -1 >}}**
  (وهذا يضمن أنها ليست أحدث من إصدار خادم API القائم، وأنها ضمن إصدار ثانوي واحد من
  إصدار خادم API الجديد)
* نسخ `kubelet` على كل العقد عند الإصدار **{{< skew currentVersionAddMinor -1 >}}** أو **{{< skew currentVersionAddMinor -2 >}}**
  (وهذا يضمن أنها ليست أحدث من إصدار خادم API القائم، وأنها ضمن إصدارين ثانويين من
  إصدار خادم API الجديد)
* الـ webhooks المسجّلة للقبول (admission) قادرة على معالجة البيانات التي سترسلها نسخة
  `kube-apiserver` الجديدة إليها:
  * تُحدَّث كائنات `ValidatingWebhookConfiguration` و`MutatingWebhookConfiguration`
    لتشمل أي إصدارات جديدة من موارد REST أُضيفت في **{{< skew currentVersion >}}**
    (أو استخدم [الخيار `matchPolicy: Equivalent`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy) المتاح منذ v1.15+)
  * الـ webhooks للقبول (admission) قادرة على معالجة أي إصدارات جديدة من موارد REST ستُرسل
    إليها، وأي حقول جديدة أُضيفت إلى الإصدارات القائمة في **{{< skew currentVersion >}}**

رقِّ `kube-apiserver` إلى **{{< skew currentVersion >}}**

{{< note >}}
تفرض سياسات المشروع الخاصة بـ[إهمال API](/docs/reference/using-api/deprecation-policy/)
و[إرشادات تغييرات API](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-architecture/api_changes.md)
عدم تخطّي `kube-apiserver` إصدارات ثانوية عند الترقية، حتى في العناقيد ذات النسخة
الواحدة.
{{< /note >}}

### kube-controller-manager، kube-scheduler، و cloud-controller-manager
{#kube-controller-manager-kube-scheduler-and-cloud-controller-manager}

المتطلبات السابقة:

* نسخ `kube-apiserver` التي تتواصل معها هذه المكوّنات عند **{{< skew currentVersion >}}**
  (وفي عناقيد HA حيث يمكن لمكوّنات مستوى التحكم هذه التواصل مع أي نسخة
  `kube-apiserver` في العنقود، يجب ترقية جميع نسخ `kube-apiserver` قبل ترقية هذه
  المكوّنات)

رقِّ `kube-controller-manager` و`kube-scheduler` و`cloud-controller-manager` إلى
**{{< skew currentVersion >}}**. ولا يوجد ترتيب ترقية مطلوب بين
`kube-controller-manager` و`kube-scheduler` و`cloud-controller-manager`. يمكنك ترقية
هذه المكوّنات بأي ترتيب، أو حتى في وقت واحد.

### kubelet

المتطلبات السابقة:

* نسخ `kube-apiserver` التي يتواصل معها `kubelet` عند **{{< skew currentVersion >}}**

ويمكن اختيارياً ترقية نسخ `kubelet` إلى **{{< skew currentVersion >}}** (أو تركها عند
**{{< skew currentVersionAddMinor -1 >}}**، أو **{{< skew currentVersionAddMinor -2 >}}**،
أو **{{< skew currentVersionAddMinor -3 >}}**)

{{< note >}}
قبل إجراء ترقية لإصدار ثانوي من `kubelet`، [صرّف](/docs/tasks/administer-cluster/safely-drain-node/)
الحُجيرات من تلك العقدة. ولا تُدعم ترقيات `kubelet` للإصدار الثانوي في المكان نفسه.
{{</ note >}}

{{< warning >}}
تشغيل عنقود تكون فيه نسخ `kubelet` متأخرة باستمرار بثلاثة إصدارات ثانوية عن
`kube-apiserver` يعني أنه يجب ترقيتها قبل إمكانية ترقية مستوى التحكم.
{{</ warning >}}

### kube-proxy

المتطلبات السابقة:

* نسخ `kube-apiserver` التي يتواصل معها `kube-proxy` عند **{{< skew currentVersion >}}**

ويمكن اختيارياً ترقية نسخ `kube-proxy` إلى **{{< skew currentVersion >}}**
(أو تركها عند **{{< skew currentVersionAddMinor -1 >}}**، أو **{{< skew currentVersionAddMinor -2 >}}**،
أو **{{< skew currentVersionAddMinor -3 >}}**)

{{< warning >}}
تشغيل عنقود تكون فيه نسخ `kube-proxy` متأخرة باستمرار بثلاثة إصدارات ثانوية عن
`kube-apiserver` يعني أنه يجب ترقيتها قبل إمكانية ترقية مستوى التحكم.
{{</ warning >}}
