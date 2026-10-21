---
title: تنفيذ تحديث متدرّج
weight: 10
---

## {{% heading "objectives" %}}

نفّذ تحديثاً متدرّجاً باستخدام kubectl.

## {{% heading "prerequisites" %}}

وتستخدم أوامر shell في هذا الدليل صياغة POSIX، وهي مدعومة في الأصداف
الافتراضية في معظم أنظمة Linux وmacOS (مثل bash أو zsh أو sh). وعلى المستخدمين
في Windows استخدام shell متوافق مع POSIX مثل
[Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
أو [Git Bash](https://gitforwindows.org/) لتشغيل الأوامر كما هي مكتوبة. أما
الأوامر التي تستخدم `export` و`$()` وما شابهها ف**غير** متوافقة مع PowerShell
أو موجه أوامر Windows.


## تحديث تطبيق {#updating-an-application}

{{% alert %}}
_تتيح التحديثات المتدرّجة تحديث النُشرات دون أي انقطاع في الخدمة، عبر تحديث
نسخ الحُجيرات تدريجياً بنسخ جديدة._
{{% /alert %}}

يتوقع المستخدمون أن تكون التطبيقات متاحة في كل وقت، ويُتوقع من المطوّرين نشر
إصدارات جديدة منها عدة مرات في اليوم. وفي كوبيرنيتيس يتم ذلك عبر التحديثات
المتدرّجة. ويتيح **التحديث المتدرّج** تحديث النشر دون أي انقطاع في الخدمة،
وذلك باستبدال الحُجيرات الحالية تدريجياً بنسخ جديدة. وتُجدول الحُجيرات الجديدة
على عقد تتوافر عليها موارد كافية، وينتظر كوبيرنيتيس بدءها قبل إزالة الحُجيرات
القديمة.

وفي الوحدة السابقة وسّعنا تطبيقنا ليعمل بعدة نسخ. وهذا شرط لإجراء التحديثات
دون التأثير على إتاحة التطبيق. وافتراضياً، يكون الحد الأقصى لعدد الحُجيرات
التي قد تكون غير متاحة أثناء التحديث، والحد الأقصى لعدد الحُجيرات الجديدة
التي يمكن إنشاؤها، هو واحد. ويمكن ضبط الخيارين على أرقام أو نسب مئوية (من
الحُجيرات). وفي كوبيرنيتيس يُوثَّق كل تحديث بإصدار، ويمكن التراجع عن أي تحديث
للنشر إلى إصدار سابق (مستقر).

## نظرة عامة على التحديثات المتدرّجة {#rolling-updates-overview}

<!-- animation -->
{{< tutorials/carousel id="myCarousel" interval="3000" >}}
  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates1.svg"
      active="true" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates2.svg" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates3.svg" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates4.svg" >}}
{{< /tutorials/carousel >}}

{{% alert %}}
إذا كان النشر معرّضاً للعامة، فإن الخدمة سترسل حركة المرور فقط إلى الحُجيرات
القادرة على معالجة الطلبات.
وهذا يضمن استمرار وصول المستخدمين إلى التطبيق أثناء التحديث.
{{% /alert %}}

أثناء التحديث المتدرّج، يحافظ هذا السلوك على إتاحة التطبيق بتوجيه حركة المرور
فقط إلى الحُجيرات التي تخدم الطلبات.

وتتيح التحديثات المتدرّجة الإجراءات التالية:

* ترقية تطبيق من بيئة إلى أخرى (عبر تحديثات صور الحاويات)
* التراجع إلى إصدارات سابقة
* التكامل المستمر والنشر المستمر للتطبيقات دون أي انقطاع في الخدمة

وفي الدليل التفاعلي التالي، سنحدّث تطبيقنا إلى إصدار جديد، وننفّذ عملية تراجع
أيضاً.

### تحديث إصدار التطبيق {#update-the-version-of-the-app}

لعرض نُشراتك، نفّذ الأمر الفرعي `get deployments`:

```shell
kubectl get deployments
```

ولعرض الحُجيرات قيد التشغيل، نفّذ الأمر الفرعي `get pods`:

```shell
kubectl get pods
```

ولعرض إصدار صورة التطبيق الحالي، نفّذ الأمر الفرعي `describe pods` وابحث عن
الحقل `Image`:

```shell
kubectl describe pods
```

ولتحديث صورة التطبيق إلى الإصدار 2، استخدم الأمر الفرعي `set image` متبوعاً
باسم النشر وإصدار الصورة الجديد:

```shell
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=docker.io/jocatalin/kubernetes-bootcamp:v2
```

أُبلغ هذا الأمر النشر باستخدام صورة مختلفة لتطبيقك، وبدأ تحديثاً متدرّجاً.
تحقّق من حالة الحُجيرات الجديدة، وشاهد الحجيرة القديمة وهي تُنهى باستخدام
الأمر الفرعي `get pods`:

```shell
kubectl get pods
```

### التحقق من التحديث {#verify-an-update}

أولاً، تحقّق من أن الخدمة قيد التشغيل، فقد تكون حذفتها في خطوة من الدليل
السابق، عبر تنفيذ `describe services/kubernetes-bootcamp`. وإذا كانت مفقودة،
يمكنك إعادة إنشائها بـ:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080
```

أنشئ متغيّر بيئة اسمه `NODE_PORT` يحمل قيمة منفذ العقدة المخصصة:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo "NODE_PORT=$NODE_PORT"
```

ثم نفّذ `curl` على عنوان IP والمنفذ المكشوفين:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

في كل مرة تنفّذ فيها أمر `curl`، ستصيب حجيرة مختلفة. ولاحظ أن جميع الحُجيرات
تعمل الآن بأحدث إصدار (`v2`).

ويمكنك أيضاً تأكيد التحديث بتنفيذ الأمر الفرعي `rollout status`:

```shell
kubectl rollout status deployments/kubernetes-bootcamp
```

ولعرض إصدار صورة التطبيق الحالي، نفّذ الأمر الفرعي `describe pods`:

```shell
kubectl describe pods
```

وفي حقل `Image` من المخرجات، تأكّد أنك تعمل بأحدث إصدار من الصورة (`v2`).

### التراجع عن تحديث {#roll-back-an-update}

لننفّذ تحديثاً آخر، ونحاول نشر صورة موسومة بـ `v10`:

```shell
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=gcr.io/google-samples/kubernetes-bootcamp:v10
```

استخدم `get deployments` لعرض حالة النشر:

```shell
kubectl get deployments
```

لاحظ أن المخرجات لا تسرد العدد المطلوب من الحُجيرات المتاحة. نفّذ الأمر الفرعي
`get pods` لعرض جميع الحُجيرات:

```shell
kubectl get pods
```

ولاحظ أن بعض الحُجيرات حالتها `ImagePullBackOff`.

وللحصول على تفاصيل أكثر عن المشكلة، نفّذ الأمر الفرعي `describe pods`:

```shell
kubectl describe pods
```

وفي قسم `Events` من مخرجات الحُجيرات المتأثرة، لاحظ أن إصدار الصورة `v10` غير
موجود في المستودع.

وللتراجع عن النشر إلى آخر إصدار عمل، استخدم الأمر الفرعي `rollout undo`:

```shell
kubectl rollout undo deployments/kubernetes-bootcamp
```

يعيد الأمر `rollout undo` النشر إلى الحالة المعروفة السابقة (`v2` من الصورة).
ويمكنك الرجوع إلى أي حالة سابقة معروفة لأي نشر.

استخدم الأمر الفرعي `get pods` لعرض الحُجيرات مجدداً:

```shell
kubectl get pods
```

وللتحقق من الصورة المنشورة على الحُجيرات قيد التشغيل، استخدم الأمر الفرعي
`describe pods`:

```shell
kubectl describe pods
```

عاد النشر يستخدم إصداراً مستقراً من التطبيق (`v2`). وقد نجح التراجع.

وتذكّر أن تنظّف عنقودك المحلي.

```shell
kubectl delete deployments/kubernetes-bootcamp services/kubernetes-bootcamp
```

## {{% heading "whatsnext" %}}

* تعلَّم المزيد عن [النُشرات](/docs/concepts/workloads/controllers/deployment/).
