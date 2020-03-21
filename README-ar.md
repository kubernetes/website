
<div dir="rtl">

# وثائق Kubernetes

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

أهلا بك! يضم هذا المستودع جميع الملفات المطلوبة لإنشاء [موقع Kubernetes و وثائقه](https://kubernetes.io/). نحن سعداء أنك تريد المساهمة!

## للمساهمة في كتابة الوثائق

يمكنك النقر فوق الزر **Fork** في المنطقة العلوية اليمنى من الشاشة لإنشاء نسخة من هذا المستودع في حساب GitHub الخاص بك. هذه النسخة تسمى *fork*. قم بإجراء أي تغييرات تريدها في فرعك الخاص ، وعندما تكون مستعدًا لإرسال هذه التغييرات إلينا ، انتقل إلى الفرع الخاص بك وقم بإنشاء طلب سحب جديد لإعلامنا به.

بمجرد إنشاء طلب السحب ، سيتولى مراجع Kubernetes مسؤولية تقديم تعليقات واضحة وقابلة للتنفيذ. بصفتك مالك طلب السحب، **تقع على عاتقك مسؤولية تعديل طلب السحب الخاص بك لمعالجة التعليقات التي قدمها لك مراجع Kubernetes.**  لاحظ أنه قد ينتهي الأمر إلى وجود أكثر من مراجع Kubernetes واحد قدم تعليقاته أو قد ينتهي بك الأمر إلى تلقي تعليقات من مراجع Kubernetes اخر الذي يختلف عن الذي تم تعيينه في البداية لتقديم ملاحظات لك. علاوة على ذلك ، في بعض الحالات ، قد يطلب أحد المراجعين مراجعة فنية من [Kubernetes tech review](https://github.com/kubernetes/website/wiki/Tech-reviewers) عند الحاجة. سيبذل المراجعون قصارى جهدهم لتقديم ملاحظات في الوقت المناسب ولكن يمكن أن يختلف وقت الاستجابة حسب الظروف.

لمزيد من المعلومات حول المساهمة في وثائق Kubernetes ، راجع:  

* [البدء في المساهمة](https://kubernetes.io/docs/contribute/start/)
* [تنظيم التغييرات وثائق الخاصة بك](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [استخدام قوالب الصفحات](http://kubernetes.io/docs/contribute/style/page-templates/)
* [دليل أسلوب التوثيق](http://kubernetes.io/docs/contribute/style/style-guide/)
* [ترجمة وثائق Kubernetes](https://kubernetes.io/docs/contribute/localization/)

## تشغيل الموقع محليًا باستخدام Docker

تمثل الطريقة الموصى بها لتشغيل موقع Kubernetes محليًا في تشغيل صورة [Docker](https://docker.com) تتضمن موقع ويب ثابت [Hugo](https://gohugo.io).
الطريقة الموصى بها لتشغيل موقع Kubernetes محليًا هي تشغيل صورة [Docker](https://docker.com) متخصصة تحتوي على مولد [Hugo](https://gohugo.io) الثابت.

> إذا كنت تعمل على Windows ، فستحتاج إلى عدد قليل من الأدوات التي يمكنك تثبيتها باستخدام [Chocolatey](https://chocoly.org).  
  
`choco install make`

> إذا كنت تفضل تشغيل موقع الويب محليًا دون Docker ، فراجع [تشغيل موقع الويب محليًا باستخدام Hugo](#running-the-site-local-using-hugo) أدناه.
إذا كان لديك Docker [قيد التشغيل](https://www.docker.com/get-started) ، فقم ببناء صورة `kubernetes-hugo` Docker محليًا

```bash
make docker-image
```

بمجرد بناء الصورة ، يمكنك تشغيل موقع الويب محليًا:

```bash
make docker-serve
```

افتح متصفحك على http://localhost:1313 لعرض الموقع. أثناء قيامك بإجراء تغييرات على الملفات المصدر ، يقوم Hugo بتحديث موقع الويب ويفرض تحديث المتصفح تلقائيا.

## تشغيل الموقع محليًا باستخدام Hugo

راجع [وثائق Hugo الرسمية](https://gohugo.io/getting-started/installing/) للحصول على إرشادات تثبيت Hugo. تأكد من تثبيت نسخة Hugo الموسعة المحددة بواسطة متغير البيئة `HUGO_VERSION` في  الملف [`netlify.toml`](netlify.toml#L9).  

لتشغيل موقع الويب محليًا عند تثبيت Hugo:

```bash
make serve
```

سيؤدي هذا إلى بدء تشغيل خادم Hugo المحلي على المنفذ 1313. افتح المتصفح الخاص بك على http://localhost:1313 لعرض موقع الويب. أثناء قيامك بإجراء تغييرات على ملفات المصدر ، يقوم Hugo بتحديث موقع الويب ويفرض تحديث المتصفح تلقائيا.

## المجتمع ، المناقشة ، المساهمة ، والدعم

تعرّف على كيفية التعامل مع مجتمع Kubernetes في [صفحة المجتمع](http://kubernetes.io/community/).

يمكنك الوصول إلى مشرفي هذا المشروع على:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [القائمة البريدية](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

### مدونة قواعد السلوك

تخضع المشاركة في مجتمع Kubernetesلـ [مدونة سلوك Kubernetes](code-of-conduct.md).

## شكرا لك!

تزدهر Kubernetes بمشاركة المجتمع ، ونحن نقدر مساهماتك في موقعنا والوثائق الخاصة بنا!

</div>
