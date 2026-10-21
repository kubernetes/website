---
title: تشغيل نسخ متعددة من تطبيقك
weight: 10
---

## {{% heading "objectives" %}}

* وسّع تطبيقاً موجوداً يدوياً باستخدام kubectl.

## {{% heading "prerequisites" %}}

وتستخدم أوامر shell في هذا الدليل صياغة POSIX، وهي مدعومة في الأصداف
الافتراضية في معظم أنظمة Linux وmacOS (مثل bash أو zsh أو sh). وعلى المستخدمين
في Windows استخدام shell متوافق مع POSIX مثل
[Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
أو [Git Bash](https://gitforwindows.org/) لتشغيل الأوامر كما هي مكتوبة. أما
الأوامر التي تستخدم `export` و`$()` وما شابهها ف**غير** متوافقة مع PowerShell
أو موجه أوامر Windows.



## توسيع تطبيق {#scaling-an-application}

{{% alert %}}
_يمكنك إنشاء نشر بعدة نسخ من البداية باستخدام المعامل --replicas في أمر
`kubectl create deployment`._
{{% /alert %}}

سبق أن أنشأنا [نشراً](/docs/concepts/workloads/controllers/deployment/)، ثم
أبرزناه للعامة عبر [خدمة](/docs/concepts/services-networking/service/). وأنشأ
النشر حجيرة واحدة فقط لتشغيل تطبيقنا. وعند زيادة حركة المرور، سنحتاج إلى توسيع
التطبيق لمواكبة طلب المستخدمين.

وإذا لم تكن قد تدرّبت على الأقسام السابقة، فابدأ من
[استخدام مينيكيوب لإنشاء عنقود](/ar/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/).

ويتم **التوسيع** عبر تغيير عدد النسخ في النشر.

{{< alert color="info" title="ملاحظة" >}}
إذا كنت تجرّب هذا بعد
[القسم السابق](/ar/docs/tutorials/kubernetes-basics/expose/expose-intro/)، فقد
تكون حذفت الخدمة التي أنشأتها، أو تكون قد أنشأت خدمة من `type: NodePort`.
ويُفترض في هذا القسم وجود خدمة من `type: LoadBalancer` لنشر kubernetes-bootcamp.

وإذا لم تكن قد حذفت الخدمة التي أُنشئت في
[القسم السابق](/ar/docs/tutorials/kubernetes-basics/expose/expose-intro)،
فاحذف تلك الخدمة أولاً، ثم نفّذ الأمر التالي لإنشاء خدمة جديدة يكون `type`
فيها `LoadBalancer`:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="LoadBalancer" --port 8080
```
{{< /alert >}}

## نظرة عامة على التوسيع {#scaling-overview}

<!-- animation -->
{{< tutorials/carousel id="myCarousel" interval="3000" >}}
  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling1.svg"
      active="true" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling2.svg" >}}
{{< /tutorials/carousel >}}

{{% alert %}}
_يتم التوسيع عبر تغيير عدد النسخ في النشر._
{{% /alert %}}

يضمن توسيع النشر إنشاء حُجيرات جديدة وجدولتها على عقد تتوافر عليها موارد
كافية. وسيزيد التوسيع عدد الحُجيرات ليصل إلى الحالة المطلوبة الجديدة. ويدعم
كوبيرنيتيس أيضاً [التوسع التلقائي](/docs/concepts/workloads/autoscaling/)
للحُجيرات، لكنه خارج نطاق هذا الدليل. ومن الممكن أيضاً التوسيع إلى الصفر، وعندها
تُنهى جميع حُجيرات النشر المحدّد.

ويتطلب تشغيل نسخ متعددة من التطبيق وسيلة لتوزيع حركة المرور عليها جميعاً.
وللخدمات موازن تحميل مدمج يوزّع حركة مرور الشبكة على جميع حُجيرات النشر
المكشوف. وتراقب الخدمات الحُجيرات قيد التشغيل باستمرار عبر نقاط النهاية، لضمان
إرسال حركة المرور إلى الحُجيرات المتاحة فقط.

وبعد أن يكون لديك عدة نسخ من التطبيق قيد التشغيل، تصبح قادراً على تنفيذ
التحديثات المتدرّجة دون انقطاع. وسنغطي ذلك في القسم التالي من الدليل. والآن،
فلننتقل إلى الطرفية ونوسّع تطبيقنا.

### توسيع النشر {#scaling-a-deployment}

لعرض نُشراتك، استخدم الأمر الفرعي `get deployments`:

```shell
kubectl get deployments
```

ويجب أن تكون المخرجات مشابهة لـ:

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   1/1     1            1           11m
```

ينبغي أن تكون لدينا حجيرة واحدة. وإن لم يكن كذلك، أعد تنفيذ الأمر. وهذه المخرجات
تبيّن:

* _NAME_ يسرد أسماء النُشرات في العنقود.
* _READY_ يعرض نسبة النسخ الحالية إلى النسخ المطلوبة
* _UP-TO-DATE_ يعرض عدد النسخ التي حُدِّثت للوصول إلى الحالة المطلوبة.
* _AVAILABLE_ يعرض عدد نسخ التطبيق المتاحة لمستخدميك.
* _AGE_ يعرض المدة التي ظل التطبيق يعمل خلالها.

ولعرض ReplicaSet الذي أنشأه النشر، نفّذ:

```shell
kubectl get rs
```

ولاحظ أن اسم ReplicaSet يأتي دائماً بالصيغة
<nobr>[DEPLOYMENT-NAME]-[RANDOM-STRING]</nobr>.
وتُولَّد السلسلة العشوائية عشوائياً وتستخدم pod-template-hash كبذرة.

وهناك عمودان مهمان في هذه المخرجات هما:

* _DESIRED_ يعرض العدد المطلوب من نسخ التطبيق، وهو ما تحدّده عند إنشاء النشر.
  وهذه هي الحالة المطلوبة.
* _CURRENT_ يعرض عدد النسخ التي تعمل حالياً.

والآن، لنوسّع النشر إلى 4 نسخ. سنستخدم أمر `kubectl scale` متبوعاً بنوع النشر
واسمه وعدد النسخ المطلوبة:

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=4
```

ولعرض نُشراتك مرة أخرى، استخدم `get deployments`:

```shell
kubectl get deployments
```

طُبِّق التغيير، ولدينا الآن 4 نسخ من التطبيق متاحة. والآن، لنتحقّق هل تغيّر عدد
الحُجيرات:

```shell
kubectl get pods -o wide
```

هناك الآن 4 حُجيرات، بعناوين IP مختلفة. وسُجِّل التغيير في سجل أحداث النشر.
وللتحقق من ذلك، استخدم الأمر الفرعي `describe`:

```shell
kubectl describe deployments/kubernetes-bootcamp
```

ويمكنك أيضاً أن ترى في مخرجات هذا الأمر أن عدد النسخ الآن 4.

### موازنة الحمل {#load-balancing}

لنتحقّق من أن الخدمة توازن الحمل على حركة المرور. ولتعرّف عنوان IP والمنفذ
المكشوفين، يمكننا استخدام `describe service` كما تعلّمنا في الجزء السابق من
الدليل:

```shell
kubectl describe services/kubernetes-bootcamp
```

أنشئ متغيّر بيئة اسمه NODE_PORT يحمل قيمة منفذ العقدة:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo NODE_PORT=$NODE_PORT
```

ثم سننفّذ `curl` على عنوان IP والمنفذ المكشوفين. نفّذ الأمر عدة مرات:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

نصيب حجيرة مختلفة مع كل طلب. وهذا يوضّح أن موازنة الحمل تعمل.

ويجب أن تكون المخرجات مشابهة لـ:

```
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-hs9dj | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
```

{{< alert color="info" title="ملاحظة" >}}
إذا كنت تشغّل مينيكيوب باستخدام Docker Desktop كسائق للحاويات، فستحتاج إلى نفق
minikube. والسبب أن الحاويات داخل Docker Desktop معزولة عن حاسوبك المضيف.

وفي نافذة طرفية منفصلة، نفّذ:

```shell
minikube service kubernetes-bootcamp --url
```

وتبدو المخرجات كالتالي:

```
http://127.0.0.1:51082
!  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

ثم استخدم العنوان المعطى للوصول إلى التطبيق:

```shell
curl 127.0.0.1:51082
```
{{< /alert >}}

### التصغير {#scale-down}

لتصغير النشر إلى نسختين، نفّذ الأمر الفرعي `scale` مرة أخرى:

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=2
```

واعرض النُشرات للتحقّق من أنه قد طُبِّق التغيير، باستخدام الأمر الفرعي
`get deployments`:

```shell
kubectl get deployments
```

انخفض عدد النسخ إلى 2. واعرض عدد الحُجيرات عبر `get pods`:

```shell
kubectl get pods -o wide
```

وهذا يؤكد إيقاف حجيرتين.

## {{% heading "whatsnext" %}}

* الدليل
[تنفيذ تحديث متدرّج](/ar/docs/tutorials/kubernetes-basics/update/update-intro/).
* تعلَّم المزيد عن [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/).
* تعلَّم المزيد عن [التوسع التلقائي](/docs/concepts/workloads/autoscaling/).
