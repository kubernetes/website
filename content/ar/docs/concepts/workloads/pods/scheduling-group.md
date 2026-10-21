---
title: مجموعة الجدولة
content_type: concept
weight: 90
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

يمكنك ربط `Pod` بـ [PodGroup](/ar/docs/concepts/workloads/podgroup-api/) للإشارة إلى
أن `Pod` ينتمي إلى مجموعة من `Pods` تُجدَّول معاً. ويتيح ذلك للمجدول تطبيق سياسات
على مستوى المجموعة، مثل جدولة الجماعة (gang scheduling)، بدلاً من التعامل مع كل
`Pod` على حدة.

<!-- body -->

## تحديد مجموعة الجدولة

عند تفعيل بوابة الميزة
[`GenericWorkload`](/ar/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)،
يمكنك تعيين الحقل `spec.schedulingGroup` في بيان `Pod` الخاص بك. ويؤسّس هذا الحقل
رابطاً بكائن `PodGroup` محدّد في مساحة الأسماء نفسها بالاسم.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: worker-0
  namespace: some-ns
spec:
  schedulingGroup:
    podGroupName: training-worker-0
  containers:
  - name: ml-worker
    image: training:v1
```

والحقل `schedulingGroup` غير قابل للتغيير. فبعد تعيينه، لا يمكن نقل `Pod` إلى
`PodGroup` آخر.

## السلوك

عند تعيين `spec.schedulingGroup`، يبحث المجدول عن
[PodGroup](/ar/docs/concepts/workloads/podgroup-api/) المُشار إليه ويطبّق
[سياسة الجدولة](/ar/docs/concepts/workloads/workload-api/policies/) المعرّفة فيه:

* إذا كان `PodGroup` يستخدم سياسة `basic`، فتُجدَّول كل `Pod` بشكل مستقل وفق سلوك
  كوبيرنيتيس المعتاد. ويُستخدم التجميع كوسم على مستوى المجموعة.
* إذا كان `PodGroup` يستخدم سياسة `gang`، تدخل `Pod` دورة حياة جدولة «كل شيء أو
  لا شيء». ويحاول المجدول توزيع `minCount` من `Pods` على الأقل في المجموعة في وقت
  واحد؛ ولا يرتبط أي منها بعُقد قبل استيفاء الحد الأدنى.

{{< feature-state feature_gate_name="CompositePodGroup" >}}

وعند تفعيل بوابة الميزة
[`CompositePodGroup`](/ar/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)،
يمكن لـ `PodGroup` أن يحدّد بدوره `CompositePodGroup` أباً. وفي أحمال العمل الهرمية،
تخضع الجدولة لسياسات معرّفة عبر شجرة المجموعة كلها (مثل جدولة الجماعة متعددة
المستويات أو قيود البنية الطوبولوجية).

## مراجع المجموعات المفقودة

إذا أشار `Pod` إلى `PodGroup` غير موجود بعد، تبقى `Pod` في حالة معلّقة. وبالمثل،
إذا حدّد `PodGroup` المُشار إليه `CompositePodGroup` أباً (عبر
`spec.parentCompositePodGroupName`) لم يُنشأ بعد، فلا تبدأ الجدولة وتبقى `Pod` في
حالة معلّقة حتى يتوفّر التسلسل الهرمي الكامل للمجموعة في العنقود.

ويعيد المجدول النظر في `Pod` تلقائياً بمجرد توفّر جميع موارد `PodGroup` و
`CompositePodGroup` المطلوبة.

## {{% heading "whatsnext" %}}

* تعرَّف على [واجهة PodGroup](/ar/docs/concepts/workloads/podgroup-api/) ودورة حياتها.
* اقرأ عن [واجهة CompositePodGroup](/ar/docs/concepts/workloads/compositepodgroup-api/).
* اقرأ عن [سياسات جدولة PodGroup](/ar/docs/concepts/workloads/workload-api/policies/).
* افهم خوارزمية [جدولة الجماعة](/ar/docs/concepts/scheduling-eviction/gang-scheduling/).
