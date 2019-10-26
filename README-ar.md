# kubernetes مرجع المستخدم

[! [حالة البناء] (https://api.travis-ci.org/kubernetes/website.svg؟branch=master)] (https://travis-ci.org/kubernetes/website)
[! [إصدار GitHub] (https://img.shields.io/github/release/kubernetes/website.svg)] (https://github.com/kubernetes/website/releases/latest)

مرحبا! هنا يوجد كل مستلزمات [الموقع الإلكتروني و مرجع المستخدم ل kubernetes] (https://kubernetes.io/).
انه من دواعي سرورنا و جودك بيننا لتقديم المساعده

## المساهمة في المستندات

يمكنك النقر فوق الزر ** Fork ** في المنطقة العلوية اليمنى من الشاشة لإنشاء نسخة من هذا المستودع في حساب GitHub الخاص بك. هذه النسخة تسمى * شوكة *. قم بإجراء أي تغييرات تريدها في مفترق طرقك ، وعندما تكون مستعدًا لإرسال هذه التغييرات إلينا ، انتقل إلى مفترق الخاص بك وقم بإنشاء طلب سحب جديد لإعلامنا به.

بمجرد إنشاء طلب السحب ، سيتولى مراجع Kubernetes مسؤولية تقديم تعليقات واضحة وقابلة للتنفيذ. بصفتك مالك طلب السحب ، ** تقع على عاتقك مسؤولية تعديل طلب السحب الخاص بك لمعالجة التعليقات التي قدمها لك مراجع Kubernetes. ** أيضًا ، لاحظ أنه قد ينتهي بك الأمر إلى وجود أكثر من مراجع Kubernetes تقديم تعليقاتك أو قد ينتهي بك الأمر إلى تلقي تعليقات من مراجع Kubernetes الذي يختلف عن الذي تم تعيينه في البداية لتقديم ملاحظات لك. علاوة على ذلك ، في بعض الحالات ، قد يطلب أحد المراجعين مراجعة فنية من [Kubernetes tech review] (https://github.com/kubernetes/website/wiki/Tech-reviewers) عند الحاجة. سيبذل المراجعون قصارى جهدهم لتقديم ملاحظات في الوقت المناسب ولكن يمكن أن يختلف وقت الاستجابة حسب الظروف.

لمزيد من المعلومات حول المساهمة في وثائق Kubernetes ، راجع:

* [ابدأ المساهمة] (https://kubernetes.io/docs/contribute/start/)
* [تنظيم تغييرات المستندات الخاصة بك] (http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [باستخدام قوالب الصفحة] (http://kubernetes.io/docs/contribute/style/page-templates/)
* [دليل أنماط الوثائق] (http://kubernetes.io/docs/contribute/style/style-guide/)
* [تعريب وثائق Kubernetes] (https://kubernetes.io/docs/contribute/localization/)

## التوطين `README.md`
| | |
| --- | --- |
| [README French] (README-fr.md) | [Korean README] (README-ko.md) |
| [README الألمانية] (README-de.md) | [البرتغالية README] (README-pt.md) |
| [الهندية README] (README-hi.md) | [Spanish README] (README-es.md) |
| [README الاندونيسية] (README-id.md) | [README الصينية] (README-zh.md) |
| [README اليابانية] (README-ja.md) ||
|||

## تشغيل الموقع محليًا باستخدام Docker

تتمثل الطريقة الموصى بها لتشغيل موقع Kubernetes محليًا في تشغيل صورة متخصصة [Docker] (https://docker.com) تتضمن [Hugo] (https://gohugo.io) موقع ويب ثابت.

> إذا كنت تعمل على Windows ، فستحتاج إلى عدد قليل من الأدوات التي يمكنك تثبيتها باستخدام [Chocolatey] (https://chocoly.org). `تشوكو تثبيت جعل`

> إذا كنت تفضل تشغيل موقع الويب محليًا دون Docker ، راجع [تشغيل الموقع محليًا باستخدام Hugo] (# running-the-site-local-using-hugo) أدناه.

إذا كان لديك Docker [قيد التشغيل] (https://www.docker.com/get-started) ، فقم ببناء صورة `kubernetes-hugo` Docker محليًا:

`` `باش
جعل صورة عامل ميناء
`` `

بمجرد بناء الصورة ، يمكنك تشغيل موقع الويب محليًا:

`` `باش
جعل عامل تخدم
`` `

افتح متصفحك على http: // localhost: 1313 لعرض الموقع. أثناء قيامك بإجراء تغييرات على الملفات المصدر ، يقوم Hugo بتحديث موقع الويب ويفرض تحديث المتصفح.

## تشغيل الموقع محليًا باستخدام Hugo

راجع [وثائق Hugo الرسمية] (https://gohugo.io/getting-started/installing/) للحصول على إرشادات تثبيت Hugo. تأكد من تثبيت الإصدار الموسّع Hugo المحدد بواسطة متغير البيئة `HUGO_VERSION` في الملف [` netlify.toml`] (netlify.toml # L9).

لتشغيل موقع الويب محليًا عند تثبيت Hugo:

`` `باش
جعل خدمة
`` `

سيؤدي هذا إلى بدء تشغيل خادم Hugo المحلي على المنفذ 1313. افتح المتصفح الخاص بك على http: // localhost: 1313 لعرض موقع الويب. أثناء قيامك بإجراء تغييرات على الملفات المصدر ، يقوم Hugo بتحديث موقع الويب ويفرض تحديث المتصفح.

## المجتمع والمناقشة والمساهمة والدعم

تعرّف على كيفية التعامل مع مجتمع Kubernetes في [صفحة المجتمع] (http://kubernetes.io/community/).

يمكنك الوصول إلى مشرفي هذا المشروع على:

- [سلاك] (https://kubernetes.slack.com/messages/sig-docs)
- [قائمة المراسلات] (https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

### القواعد السلوكية

تخضع المشاركة في مجتمع Kubernetes لـ [مدونة سلوك Kubernetes] (code-of-conduct.md).

## شكرا جزيلا!

تزدهر Kubernetes بمشاركة المجتمع ، ونحن نقدر مساهماتك في موقعنا والوثائق الخاصة بنا!