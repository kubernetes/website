---
title: "أحمال العمل"
weight: 55
description: >
  افهم الحُجيرات، أصغر كائن حوسبة قابل للنشر في كوبيرنيتيس، والتجريدات الأعلى مستوى التي تساعدك على تشغيلها.
no_list: true
card:
  title: أحمال العمل والحُجيرات
  name: concepts
  weight: 60
---

حمل العمل هو تطبيق يعمل في كوبيرنيتيس.
سواء كان حمل عملك مكوّناً واحداً أو عدة مكوّنات تعمل معاً، فإنك في كوبيرنيتيس
تشغّله داخل مجموعة من
[_حُجيرات_](/ar/docs/concepts/workloads/pods).
وفي كوبيرنيتيس، تمثّل الحجيرة مجموعة من
{{< glossary_tooltip text="الحاويات" term_id="container" >}} قيد التشغيل، واحدة أو أكثر،
على عنقودك.

وللحُجيرات في كوبيرنيتيس
[دورة حياة محدّدة](/ar/docs/concepts/workloads/pods/pod-lifecycle/). فمثلاً، بعد أن
تعمل حجيرة في عنقودك، فإن أي عطل حرج على
{{< glossary_tooltip text="عقدة" term_id="node" >}} التي تعمل عليها تلك الحجيرة
يعني أن كل الحُجيرات على تلك العقدة تفشل. ويعامل كوبيرنيتيس هذا المستوى من
الأعطال على أنه نهائي: ستحتاج إلى إنشاء حجيرة جديدة للتعافي، حتى لو أصبحت العقدة
لاحقاً سليمة.

غير أنه، ولتسهيل حياتك كثيراً، لا تحتاج إلى إدارة كل حجيرة على حدة. وبدلاً من ذلك،
يمكنك استخدام _موارد أحمال العمل_ التي تدير مجموعة من الحُجيرات نيابةً عنك. وهذه
الموارد تهيّئ {{< glossary_tooltip term_id="controller" text="المتحكّمات" >}} التي
تتأكّد من تشغيل العدد الصحيح من النوع الصحيح من الحُجيرات، مطابقاً للحالة التي
حدّدتها.

ويوفّر كوبيرنيتيس عدة موارد أحمال عمل مدمجة:

* [Deployment](/ar/docs/concepts/workloads/controllers/deployment/) و[ReplicaSet](/ar/docs/concepts/workloads/controllers/replicaset/)
  (بديلاً عن المورد القديم
  {{< glossary_tooltip text="ReplicationController" term_id="replication-controller" >}}).
  وDeployment مناسب لإدارة حمل عمل تطبيق عديم الحالة على عنقودك،
  إذ يمكن استبدال أي حجيرة في ذلك الـ Deployment بأخرى عند الحاجة.
* يتيح لك [StatefulSet](/ar/docs/concepts/workloads/controllers/statefulset/) تشغيل
  حجيرة واحدة أو أكثر ذات صلة تحتفظ بالحالة. فمثلاً، إذا كان حمل عملك
  يسجّل البيانات بصورة دائمة، يمكنك تشغيل StatefulSet يطابق كل حجيرة مع
  [PersistentVolume](/ar/docs/concepts/storage/persistent-volumes/). ويمكن لشيفرتك،
  التي تعمل داخل حُجيرات ذلك StatefulSet، أن تنسخ البيانات إلى حُجيرات أخرى في
  StatefulSet نفسه لتحسين المتانة الإجمالية.
* يعرّف [DaemonSet](/ar/docs/concepts/workloads/controllers/daemonset/) الحُجيرات التي
  توفّر تسهيلات محلية للعُقد.
  وكلما أضفت عقدة إلى عنقودك تطابق مواصفات DaemonSet،
  يجدول مستوى التحكم حجيرة لذلك DaemonSet على العقدة الجديدة.
  وتؤدي كل حجيرة في DaemonSet مهمة شبيهة بخدمة نظام على خادم Unix / POSIX كلاسيكي.
  وقد يكون DaemonSet أساسياً لعمل عنقودك، مثل إضافة تشغيل
  [شبكات العنقود](/ar/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)،
  أو قد يساعدك على إدارة العقدة،
  أو قد يوفّر سلوكاً اختيارياً يعزّز منصة الحاويات التي تعمل عليها.
* توفّر [Job](/ar/docs/concepts/workloads/controllers/job/) و
  [CronJob](/ar/docs/concepts/workloads/controllers/cron-jobs/) طريقتين مختلفتين
  لتحديد مهام تعمل حتى الاكتمال ثم تتوقف.
  يمكنك استخدام
  [Job](/ar/docs/concepts/workloads/controllers/job/) لتحديد مهمة تعمل حتى
  الاكتمال مرة واحدة. ويمكنك استخدام
  [CronJob](/ar/docs/concepts/workloads/controllers/cron-jobs/) لتشغيل
  المهمة نفسها عدة مرات وفق جدول زمني.

وفي منظومة كوبيرنيتيس الأوسع، تجد موارد أحمال عمل من طرف ثالث توفّر سلوكيات
إضافية. فباستخدام
[تعريف مورد مخصّص](/ar/docs/concepts/extend-kubernetes/api-extension/custom-resources/)،
يمكنك إضافة مورد أحمال عمل من طرف ثالث إذا أردت سلوكاً معيّناً ليس جزءاً من
نواة كوبيرنيتيس. فمثلاً، إن أردت تشغيل مجموعة من الحُجيرات لتطبيقك مع إيقاف العمل
إلا إذا كانت _كل_ الحُجيرات متاحة (ربما لمهمة موزّعة عالية الإنتاجية)،
فيمكنك تنفيذ امتداد أو تثبيته يوفّر تلك الميزة.

## توزيع أحمال العمل

{{< feature-state feature_gate_name="GenericWorkload" >}}

بينما تدير موارد أحمال العمل القياسية (مثل Deployments وJobs) دورة حياة الحُجيرات،
قد تكون لديك متطلبات جدولة معقّدة يجب أن تُعامل فيها مجموعات الحُجيرات كوحدة
واحدة.

تتيح لك [واجهة Workload API](/ar/docs/concepts/workloads/workload-api/) تحديد
`PodGroupTemplates` لتجميع الحُجيرات وتطبيق سياسات جدولة متقدمة عليها،
مثل [جدولة الجماعة](/ar/docs/concepts/scheduling-eviction/gang-scheduling/).
وتنشئ المتحكّمات كائنات
[PodGroup](/ar/docs/concepts/workloads/podgroup-api/) من هذه القوالب أثناء
التشغيل، وتشير `Pods` إلى `PodGroup` الخاص بها عبر
الحقل `spec.schedulingGroup`. وهذا مفيد تحديداً في أحمال المعالجة الدفعية وتعلّم
الآلة حيث يُشترط التوزيع «كل شيء أو لا شيء».

## {{% heading "whatsnext" %}}

إلى جانب قراءة كل نوع من الأنواع البرمجية لإدارة أحمال العمل، يمكنك قراءة كيفية
تنفيذ مهام بعينها:

* [تشغيل تطبيق عديم الحالة باستخدام Deployment](/ar/docs/tasks/run-application/run-stateless-application-deployment/)
* تشغيل تطبيق ذي حالة إما كـ[نسخة واحدة](/ar/docs/tasks/run-application/run-single-instance-stateful-application/)
  أو كـ[مجموعة منسوخة](/ar/docs/tasks/run-application/run-replicated-stateful-application/)
* [تشغيل مهام مؤتمتة عبر CronJob](/ar/docs/tasks/job/automated-tasks-with-cron-jobs/)

ولتتعلّم آليات كوبيرنيتيس في فصل الشيفرة عن الإعداد، زر
[الإعداد](/ar/docs/concepts/configuration/).

وهناك مفهومان مساندان يوفّران خلفية عن كيفية إدارة كوبيرنيتيس للحُجيرات الخاصة
بالتطبيقات:
* [جمع القمامة](/ar/docs/concepts/architecture/garbage-collection/) ينظّف الكائنات
  من عنقودك بعد إزالة _المورد المالك_ لها.
* يتحكّم [_المتحكّم بالعمر الافتراضي بعد الانتهاء_](/ar/docs/concepts/workloads/controllers/ttlafterfinished/)
  في حذف مهام Job بعد انقضاء مدة محددة من اكتمالها.

وبعد أن يعمل تطبيقك، قد ترغب في إتاحته على الإنترنت كـ
[خدمة](/ar/docs/concepts/services-networking/service/)، أو، في حالة تطبيقات الويب
فقط، باستخدام [Ingress](/ar/docs/concepts/services-networking/ingress).
