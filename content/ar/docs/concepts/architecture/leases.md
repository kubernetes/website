---
title: الإجارات
api_metadata:
- apiVersion: "coordination.k8s.io/v1"
  kind: "Lease"
content_type: concept
weight: 30
---

<!-- overview -->

غالباً ما تحتاج الأنظمة الموزّعة إلى _إجارات_، وهي توفّر آلية لقفل الموارد المشتركة
وتنسيق النشاط بين أعضاء مجموعة ما.

وفي كوبيرنيتيس، يُمثَّل مفهوم الإيجار بواسطة كائنات
[Lease](/ar/docs/reference/kubernetes-api/cluster-resources/lease-v1/)
في مجموعة {{< glossary_tooltip text="API" term_id="api-group" >}} `coordination.k8s.io`،
وهي تُستخدم لقدرات حرجة على مستوى النظام مثل نبضات العقد وانتخاب القائد على مستوى
المكوّنات.

<!-- body -->

## نبضات العقد {#node-heart-beats}

يستخدم كوبيرنيتيس واجهة Lease لإبلاغ خادم API في كوبيرنيتيس بنبضات kubelet الخاصة
بالعُقد. ولكل `Node` كائن `Lease` مطابق الاسم في مساحة الأسماء `kube-node-lease`.
وداخلياً، يكون كل نبضة kubelet طلب **تحديث** لهذا الكائن `Lease`، يحدّث الحقل
`spec.renewTime` الخاص به. ويستخدم مستوى تحكم كوبيرنيتيس الطابع الزمني لهذا الحقل
لتحديد إتاحة `Node`.

راجع [كائنات Node Lease](/ar/docs/concepts/architecture/nodes/#node-heartbeats)
لمزيد من التفاصيل.

## انتخاب القائد

يستخدم كوبيرنيتيس أيضاً الإجارات لضمان تشغيل نسخة واحدة فقط من المكوّن في أي وقت.
ويُستخدم ذلك في مكوّنات مستوى التحكم مثل `kube-controller-manager` و`kube-scheduler`
في إعدادات التوافر العالي (HA)، حيث يجب أن تكون نسخة واحدة فقط من المكوّن نشطة
فعلاً بينما تكون النسخ الأخرى في حالة استعداد.

اقرأ [انتخاب القائد المنسّق](/ar/docs/concepts/cluster-administration/coordinated-leader-election)
لتتعلّم كيف يبني كوبيرنيتيس على واجهة Lease لاختيار نسخة المكوّن التي تتصرّف كقائد.

### تحرير قفل مدير المتحكّمات عند الخروج

{{< feature-state feature_gate_name="ControllerManagerReleaseLeaderElectionLockOnExit" >}}

عند تفعيل بوابة الميزة `ControllerManagerReleaseLeaderElectionLockOnExit`،
يحرّر `kube-controller-manager` قفل انتخاب القائد بفعالية أثناء انتقالات القيادة،
بدلاً من انتظار انتهاء صلاحية القفل (TTL). ويتيح ذلك انتخاب قائد جديد بسرعة أكبر،
فتقلّص زمن انتقال القيادة.

## هوية خادم API

{{< feature-state feature_gate_name="APIServerIdentity" >}}

اعتباراً من كوبيرنيتيس v1.26، يستخدم كل `kube-apiserver` واجهة Lease لنشر هويته على
بقية النظام. ورغم أنها ليست مفيدة بذاتها، إلا أنها توفّر آلية للعملاء لاكتشاف عدد
نسخ `kube-apiserver` التي تُدير مستوى تحكم كوبيرنيتيس. وتتيح وجود إجارات
kube-apiserver قدرات مستقبلية قد تتطلب تنسيقاً بين كل نسخ kube-apiserver.

يمكنك تفحّص الإجارات التي يملكها كل kube-apiserver بالبحث عن كائنات lease في مساحة
الأسماء `kube-system` باسم `apiserver-<sha256-hash>`. أو يمكنك استخدام مُحدِّد الوسم
`apiserver.kubernetes.io/identity=kube-apiserver`:

```shell
kubectl -n kube-system get lease -l apiserver.kubernetes.io/identity=kube-apiserver
```
```
NAME                                        HOLDER                                                                           AGE
apiserver-07a5ea9b9b072c4a5f3d1c3702        apiserver-07a5ea9b9b072c4a5f3d1c3702_0c8914f7-0f35-440e-8676-7844977d3a05        5m33s
apiserver-7be9e061c59d368b3ddaf1376e        apiserver-7be9e061c59d368b3ddaf1376e_84f2a85d-37c1-4b14-b6b9-603e62e4896f        4m23s
apiserver-1dfef752bcb36637d2763d1868        apiserver-1dfef752bcb36637d2763d1868_c5ffa286-8a9a-45d4-91e7-61118ed58d2e        4m43s

```

والبصمة SHA256 المستخدمة في اسم الإيجار مبنية على اسم مضيف نظام التشغيل كما يراه خادم
API ذلك. وينبغي أن يُهيَّأ كل kube-apiserver لاستخدام اسم مضيف فريد داخل العنقود.
والنسخ الجديدة من kube-apiserver التي تستخدم اسم المضيف نفسه تتولّى الإجارات
الموجودة باستخدام هوية حامل جديدة، بدلاً من إنشاء كائنات Lease جديدة. ويمكنك التحقق
من اسم المضيف الذي يستخدمه kube-apiserver بفحص قيمة الوسم
`kubernetes.io/hostname`:

```shell
kubectl -n kube-system get lease apiserver-07a5ea9b9b072c4a5f3d1c3702 -o yaml
```
```yaml
apiVersion: coordination.k8s.io/v1
kind: Lease
metadata:
  creationTimestamp: "2023-07-02T13:16:48Z"
  labels:
    apiserver.kubernetes.io/identity: kube-apiserver
    kubernetes.io/hostname: master-1
  name: apiserver-07a5ea9b9b072c4a5f3d1c3702
  namespace: kube-system
  resourceVersion: "334899"
  uid: 90870ab5-1ba9-4523-b215-e4d4e662acb1
spec:
  holderIdentity: apiserver-07a5ea9b9b072c4a5f3d1c3702_0c8914f7-0f35-440e-8676-7844977d3a05
  leaseDurationSeconds: 3600
  renewTime: "2023-07-04T21:58:48.065888Z"
```

أما الإجارات المنتهية الصلاحية الخاصة بـ kube-apiservers التي لم تعد موجودة فتُجمع
بواسطة kube-apiservers الجديدة بعد ساعة واحدة.

ويمكنك تعطيل إجارات هوية خادم API بتعطيل بوابة الميزة `APIServerIdentity`
[بوابة الميزة](/ar/docs/reference/command-line-tools-reference/feature-gates/).

## أحمال العمل {#custom-workload}

يمكن لحمل عملك أن يعرّف استخدامه الخاص للإجارات. فمثلاً، قد تشغّل
{{< glossary_tooltip term_id="controller" text="متحكّماً" >}} مخصّصاً تقوم فيه عضو
رئيسي أو قائد بتنفيذ عمليات لا يقوم بها أقرانها. وتعرّف Lease بحيث تتمكن نسخ
المتحكّم من اختيار قائد أو انتخابه، باستخدام واجهة API في كوبيرنيتيس للتنسيق.
وإذا استخدمت Lease، فمن المُستحسن أن تعرّف له اسماً واضح الارتباط بالمنتج أو
المكوّن. فمثلاً، إذا كان لديك مكوّن باسم Example Foo، فاستخدم Lease باسم
`example-foo`.

وإذا كان من الممكن لمشغّل العنقود أو مستخدم نهائي آخر أن ينشر عدة نسخ من مكوّن،
فاختر بادئة للاسم وآلية (مثل بصمة اسم الـ Deployment) لتفادي تعارض الأسماء في
الإجارات.

ويمكنك استخدام منهج آخر ما دام يحقق النتيجة نفسها: أن المنتجات البرمجية المختلفة لا
تتصارع فيما بينها.
