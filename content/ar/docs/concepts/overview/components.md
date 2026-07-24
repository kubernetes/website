---
title: Kubernetes مكونات كوبرنيتيس
content_type: concept
description: >
 هذة الصفحة توفر نظرة عامة عالية المستوى علي العناصر الضرورية التي تشكل عنقود كوبرنيتيس ` Kubernetes cluster`     
weight: 10
card:
  title: مكونات العنقود `cluster`
  name: concepts
  weight: 20
---

<!-- overview -->

 هذة الصفحة توفر نظرة عامة عالية المستوى علي العناصر الضرورية التي تشكل عنقود كوبرنيتيس ` Kubernetes cluster`

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Components of Kubernetes" caption="The components of a Kubernetes cluster" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

## المكونات الاساسية

عنقود الكوبرنيتيس `Kubernetes cluster` يتكون من لوحة التحكم `control plane` وواحد أو أكثر من عقد العمل `worker nodes`.
فيما يلي نظرة عامة موجزة علي المكونات الرئيسية:

### مكونات لوحة التحكم `control plane`


يدير الحالة العامة للعنقود `cluster`:

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
:الخادم الأساسي الذي يتيح الوصول إلى واجهة برمجة تطبيقات كوبرنيتيس ` Kubernetes API` عبر HTTP.

[etcd](/docs/concepts/architecture/#etcd)
: مخزن مفتاح-قيمة `key-value` موثوق وعالي التوافر تُحفَظ فيه جميع بيانات خادم واجهة برمجة التطبيقات

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: يبحث عن وحدات `pods` غير مرتبطة بعقدة`node` , و يعين كل وحدة `pod` الي عقدة `node` مناسبة

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: Runs {{< glossary_tooltip text="controllers" term_id="controller" >}} لتنفيذ سلوك واجهة برمجة تطبيقات كوبرنيتيس `Kubernetes API`.


[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (optional)
: يتكامل مع مزوّدي خدمات السحابة الذين تعمل فوقهم البنية التحتية.

### مكونات العقدة `Node`

تعمل على كل عقدة `Node`، تحافظ على تشغيل الوحدات `Pods`، وتوفر بيئة التشغيل الخاصة بكوبرنيتيس `Kubernetes`:

[kubelet](/docs/concepts/architecture/#kubelet)
: يتأكد من أن الوحدات `Pods` تعمل ,بما في ذلك حاوياتها `containers`.

[kube-proxy](/docs/concepts/architecture/#kube-proxy) (اختياري)
: يحافظ على قواعد الشبكة في العقد`nodes` لتنفيذ {{< glossary_tooltip text="Services" term_id="الخدمات`services`" >}}.

[`Container runtime`محرك الحاويات](/docs/concepts/architecture/#container-runtime)
: البرمجيات المسؤولة عن تشغيل الحاويات `containers`. اطلع علي
  [`Container Runtimes`محركات الحاويات](/docs/setup/production-environment/container-runtimes/) لتعرف اكثر.

{{% thirdparty-content single="true" %}}

قد يحتاج العنقود`cluster` الخاص بك برمجيات اضافية علي كل عقدة `node`;  علي سبيل المثال ربما تحتاج لتشغيل [systemd](https://systemd.io/) على عقدة لينكس `Linux node` للإشراف على المكونات المحلية.

## الاضافات

الإضافات توسع وظائف كوبرنيتيس `Kubernetes`. بعض الامثلة المهمة تشمل: 

[`DNS`أسماء النطاقات](/docs/concepts/architecture/#dns)
:  لحل أسماء النطاقات`DNS` على مستوى العنقود`cluster`.

[`Web UI`واجهة الويب](/docs/concepts/architecture/#web-ui-dashboard) (`Dashboard`لوحة التحكم)
: لإدارة العنقود `cluster` عبر واجهة ويب.

[مراقبة موارد الحاويات `containers`](/docs/concepts/architecture/#container-resource-monitoring)
: لجمع وتخزين مقاييس الحاويات `containers`.

[تسجيل البيانات على مستوى العنقود `cluster`](/docs/concepts/architecture/#cluster-level-logging)
: لحفظ سجلات الحاويات `containers` في متجر سجلات `log store`مركزي.

## المرونة في الهيكل المعماري

يتسم كوبرنيتيس `Kubernetes` بالمرونة في نشر وإدارة هذه المكونات.
يمكن تكييف هذه البنية لتلبية احتياجات مختلفة، بدءًا من بيئات التطوير الصغيرة وصولًا إلى عمليات النشر الإنتاجية واسعة النطاق.

لتفاصيل أكثر عن كل مكون وطرق تكوين هيكل العنقود `cluster` الخاص بك المختلفة، اطلع علي صفحة   [`Cluster Architecture` بنية العنقود](/docs/concepts/architecture/).