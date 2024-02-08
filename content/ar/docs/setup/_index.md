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

<!-- General overview-->

 يعرض هذا القسم الطرق المختلفه لاعداد وتشفيل كوبرناتيز. إختر الطريقة المناسبة للتثبيت بناءً على متطلبات الصيانة والأمان والتحكم، والموارد المتاحة للتشغيل، والخبرة التقنية المتوفرة لإدارة العنقود.

يمكنك [تحميل كوبرناتيز](/releases/download/) لنشر عنقود كوبرناتيز على جهاز محلي، أو في السحابة، أو لمركز البيانات الخاص بك.

يمكن أيضًا تشغيل عدة مكونات [كوبرناتيز](/docs/concepts/overview/components/) مثل {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} أو {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} [كصور الحاويات](/releases/download/#container-images) داخل العنقود.

**من المستحسن** تشغيل مكونات كوبرناتيز كصور حاويات أينما كان ذلك ممكنًا، والسماح لكوبرناتيز بإدارة تلك المكونات. لا يمكن تضمين المكونات التي تعمل على تشغيل الحاويات - على وجه الخصوص، kubelet - في هذه الفئة.


إذا كنت لا تريد إدارة العنقود بنفسك، يمكنك اختيار خدمة مُدارة، بما في ذلك [المنصات المعتمدة](/docs/setup/production-environment/turnkey-solutions/). هناك أيضًا حلول موحدة ومخصصة أخرى عبر مجموعة واسعة من البيئات السحابية والمعدنية الخام.

<!-- الجسم -->

## بيئة التعلم

إذا كنت تتعلم كوبرناتيز، استخدم الأدوات المدعومة من قبل مجتمع كوبرناتيز، أو الأدوات في النظام البيئي لإعداد عنقود كوبرناتيز على جهاز محلي.
 انظر الي [تثبيت الأدوات](/docs/tasks/tools/).

## بيئة الإنتاج

عند تقييم الحل  [لبيئة الإنتاج](/docs/setup/production-environment/)، ضع في اعتبارك الجوانب التي تريد إدارتها بنفسك والتي تفضل تسليمها إلى مزود الخدمة.

لعنقود تديره بنفسك، أداة النشر المدعومة رسميًا لكوبرناتيز هي [kubeadm](/docs/setup/production-environment/tools/kubeadm/).

## {{% heading "الخطوات القادمه" %}}

- [تحميل كوبرناتيز](/releases/download/)
- [تثبيت الأدوات](/docs/tasks/tools/) بما فيهم `kubectl`
- اختيار [بيئة تشغيل الحاوية](/docs/setup/production-environment/container-runtimes/) لعنقودك الجديد.
- التعرف على [أفضل الممارسات](/docs/concepts/overview/what-is-kubernetes/) لكوبرناتيز.

تم تصميم كوبرنتس {{< glossary_tooltip term_id="مستوى-التحكم" text="control plane" >}} لتعمل علي انظمه لينكس. يمكنك تشغيل تطبيقات علي انظمه الأخري، مثل ويندوز داخل عنقود كوبرناتيز،

- تعرف على كيفية [إعداد عناقيد مع عُقد ويندوز](/docs/setup/production-environment/windows/user-guide-windows-containers/).
