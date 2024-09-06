---
title: دليل الاستخدام
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#بيئة-التعلم"
    title: بيئة التعلم
  - anchor: "#بيئة-الإنتاج"
    title: بيئة الإنتاج  
---

<!-- overview-->

يعرض هذا القسم الطرق المختلفه لإعداد وتشغيل عناقيد الكوبرناتيز. إختر الطريقة المناسبة للإعداد بناءً على متطلبات الصيانة والأمان والتحكم، والموارد المتاحة للتشغيل، والخبرة التقنية المتوفرة لإدارة العنقود.

يمكنك [تحميل كوبرناتيز](/releases/download/) وتثبيت عنقود كوبرناتيز على جهازك المحلي، أو في السحابة، أو على مركز البيانات الخاص بك.

يمكن أيضًا تشغيل عدة مكونات [كوبرناتيز](/docs/concepts/overview/components/) مثل {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} أو {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} [في الحاويات](/releases/download/#container-images) داخل العنقود.

**يستحسن** تشغيل مكونات كوبرناتيز كحاويات أينما كان ذلك ممكنًا، ليدير كوبرناتيز مكوناته بنفسه. لاحظ أن المكونات المسؤولة عن تشغيل الحاويات، مثل kubelet، لا يمكن تضمينها في تلك الفئة.


إذا كنت لا تريد إدارة العنقود بنفسك، يمكنك استخدام أحد [المنصات المعتمدة](/docs/setup/production-environment/turnkey-solutions/) لإدارة عنقودك. هناك أيضاً حلول متنوعة لإدارة العناقيد على جهازك الحقيقي وفي العديد من البيئات السحابية.

<!-- body -->

## بيئة التعلم

إذا كنت تتعلم كوبرناتيز، ينصح استخدام الأدوات المدعومة من قبل مجتمع كوبرناتيز أو الأدوات المتوفرة في بيئة التشغيل الخاصة بك لإعداد وتثبيت كوبرناتيز.
 انظر الي [تثبيت الأدوات](/docs/tasks/tools/).

## بيئة الإنتاج

عند تقييم الحل  [لبيئة الإنتاج](/docs/setup/production-environment/)، ضع في اعتبارك الجوانب التي تريد إدارتها بنفسك والتي تفضل تسليمها إلى مزود الخدمة.

لإدارة العنقود بنفسك، ينصح استخدام أداة النشر المدعومة رسميًا لكوبرناتيز وهي [kubeadm](/docs/setup/production-environment/tools/kubeadm/).

## {{% heading "الخطوات القادمه" %}}

- [تحميل كوبرناتيز](/releases/download/)
- [تثبيت الأدوات](/docs/tasks/tools/) بما فيها `kubectl`
- اختيار [بيئة تشغيل الحاويات](/docs/setup/production-environment/container-runtimes/) لعنقودك الجديد.
- التعرف على [أفضل الممارسات](/docs/concepts/overview/what-is-kubernetes/) لكوبرناتيز.

تم تصميم كوبرناتيز {{< glossary_tooltip term_id="control-plane" text="صطح التحكم" >}} ليعمل علي أنظمه لينكس. بإمكانك تشغيل أنظمة أخرى (مثل ويندوز) داخل العنقود بعد إعداده.

- تعرف على كيفية [تشغيل نظام ويندوز داخل حاويات كوبرناتيز](/docs/setup/production-environment/windows/user-guide-windows-containers/).
