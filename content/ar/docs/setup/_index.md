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

<!-- نظره عامه -->

 يعرض هذا القسم الطرق المختلفه لاعداد وتشفيل كوبرنيتس. إختر الطريقة المناسبة للتثبيت بناءً على متطلبات الصيانة والأمان والتحكم، والموارد المتاحة للتشغيل، والخبرة التقنية المتوفرة لإدارة العنقود.

يمكنك [تنزيل كوبرنيتس](/releases/download/) لنشر عنقود كوبرنيتس على جهاز محلي، أو في السحابة، أو لمركز البيانات الخاص بك.

يمكن أيضًا تشغيل عدة مكونات [كوبرنيتس](/docs/concepts/overview/components/) مثل {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} أو {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} [كصور الحاويات](/releases/download/#container-images) داخل العنقود.

**من المستحسن** تشغيل مكونات كوبرنيتس كصور حاويات أينما كان ذلك ممكنًا، والسماح لكوبرنيتس بإدارة تلك المكونات. لا يمكن تضمين المكونات التي تعمل على تشغيل الحاويات - على وجه الخصوص، kubelet - في هذه الفئة.


إذا كنت لا تريد إدارة عنقود كوبرنيتس بنفسك، يمكنك اختيار خدمة مُدارة، بما في ذلك [المنصات المعتمدة](/docs/setup/production-environment/turnkey-solutions/). هناك أيضًا حلول موحدة ومخصصة أخرى عبر مجموعة واسعة من البيئات السحابية والمعدنية الخام.

<!-- الجسم -->

## بيئة التعلم

إذا كنت تتعلم كوبرنيتس، استخدم الأدوات المدعومة من قبل مجتمع كوبرنيتس، أو الأدوات في النظام البيئي لإعداد عنقود كوبرنيتس على جهاز محلي.
 انظر الي [تثبيت الأدوات](/docs/tasks/tools/).

## بيئة الإنتاج

عند تقييم الحل  [لبيئة الإنتاج](/docs/setup/production-environment/)، ضع في اعتبارك الجوانب التي تريد إدارتها بنفسك والتي تفضل تسليمها إلى مزود الخدمة.

لعنقود تديره بنفسك، أداة النشر المدعومة رسميًا لكوبرنيتس هي [kubeadm](/docs/setup/production-environment/tools/kubeadm/).

## {{% heading "الخطوات القادمه" %}}

- [تحميل كوبرنيتس](/releases/download/)
- [تثبيت الأدوات](/docs/tasks/tools/) بما فيهم `kubectl`
- اختيار [بيئة تشغيل الحاوية](/docs/setup/production-environment/container-runtimes/) لعنقودك الجديد.
- التعرف على [أفضل الممارسات](/docs/concepts/overview/what-is-kubernetes/) لكوبرنيتس.

تم تصميم كوبرنتس {{< glossary_tooltip term_id="مستوى-التحكم" text="control plane" >}} لتعمل علي انظمه لينكس. يمكنك تشغيل تطبيقات علي انظمه الأخري، مثل ويندوز داخل عنقود كوبرنيتس،

- تعرف على كيفية [إعداد عناقيد مع عُقد ويندوز](/docs/setup/production-environment/windows/user-guide-windows-containers/).
