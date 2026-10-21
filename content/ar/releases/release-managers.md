---
title: مديرو الإصدارات
type: docs
---

«مديرو الإصدارات» (Release Managers) مصطلح شامل يضم مجموعة المساهمين في
كوبيرنيتيس الذين يتحملون مسؤولية صيانة فروع الإصدارات وإنشاء الإصدارات
باستخدام الأدوات التي يوفّرها SIG Release.

وتُشرح مسؤوليات كل دور أدناه.

- [التواصل](#contact)
  - [سياسة الحظر الأمني](#security-embargo-policy)
- [الكتيبات المرجعية](#handbooks)
- [مديرو الإصدارات](#release-managers)
  - [كيف تصبح مدير إصدارات](#becoming-a-release-manager)
- [مساعدو مديري الإصدارات](#release-manager-associates)
  - [كيف تصبح مساعداً لمدير الإصدارات](#becoming-a-release-manager-associate)
- [قيادة SIG Release](#sig-release-leads)
  - [الرئيسان](#chairs)
  - [القادة التقنيون](#technical-leads)

## التواصل {#contact}

| قائمة البريد | Slack | مستوى الظهور | الاستخدام | العضوية |
| --- | --- | --- | --- | --- |
| [release-managers@kubernetes.io](mailto:release-managers@kubernetes.io) | [#release-management](https://kubernetes.slack.com/messages/CJH2GBF7Y) (قناة) / @release-managers (مجموعة مستخدمين) | عام | نقاش عام لمديري الإصدارات | جميع مديري الإصدارات (بما في ذلك المساعدون ورؤساء SIG) |
| [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) | غير متاح | خاص | نقاش خاص لمديري الإصدارات من ذوي الامتيازات | مديرو الإصدارات وقيادة SIG Release |
| [security-release-team@kubernetes.io](mailto:security-release-team@kubernetes.io) | [#security-release-team](https://kubernetes.slack.com/archives/G0162T1RYHG) (قناة) / @security-rel-team (مجموعة مستخدمين) | خاص | تنسيق إصدارات الأمان مع لجنة الاستجابة الأمنية | [security-discuss-private@kubernetes.io](mailto:security-discuss-private@kubernetes.io)، [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) |

### سياسة الحظر الأمني {#security-embargo-policy}

تخضع بعض المعلومات الخاصة بالإصدارات لحظر، وقد وضعنا سياسة تحدد كيفية وضع هذا
الحظر. لمزيد من المعلومات، راجع
[سياسة الحظر الأمني](https://github.com/kubernetes/committee-security-response/blob/main/private-distributors-list.md#embargo-policy).

## الكتيبات المرجعية {#handbooks}

**ملاحظة: سيُزال التكرار بين دليل فريق الإصدارات التصحيحية ودليل مديري الفروع في وقت لاحق.**

- [فريق الإصدارات التصحيحية](https://git.k8s.io/sig-release/release-engineering/role-handbooks/patch-release-team.md)
- [مديرو الفروع](https://git.k8s.io/sig-release/release-engineering/role-handbooks/branch-manager.md)

## مديرو الإصدارات {#release-managers}

**ملاحظة:** قد تذكر الوثائق فريق الإصدارات التصحيحية ودور إدارة الفروع. وقد تم
دمج الدورين في دور مديري الإصدارات.

والمتطلبات الدنيا لمديري الإصدارات ومساعدي مديري الإصدارات هي:

- الإلمام بالأوامر الأساسية لـ Unix والقدرة على تصحيح أخطاء سكربتات shell.
- الإلمام بسير عمل الشيفرة المتفرعة عبر `git` واستدعاءات `git` من سطر الأوامر.
- معرفة عامة بـ Google Cloud (Cloud Build و Cloud Storage).
- الانفتاح على طلب المساعدة والتواصل بوضوح.
- [عضوية](https://git.k8s.io/community/community-membership.md#member) مجتمع كوبيرنيتيس.

ومديرو الإصدارات مسؤولون عن:

- تنسيق إصدارات كوبيرنيتيس وإصدارها:
  - الإصدارات التصحيحية (`x.y.z`، حيث `z` > 0)
  - الإصدارات الثانوية (`x.y.z`، حيث `z` = 0)
  - الإصدارات التمهيدية (ألفا وبيتا والإصدارات المرشحة)
  - العمل مع [فريق الإصدار](https://git.k8s.io/sig-release/release-team/README.md) في كل
    دورة إصدار
  - [تحديد الجدول الزمني ووتيرة الإصدارات التصحيحية](/releases/patch-releases/)
- صيانة تفرعات الإصدارات:
  - مراجعة طلبات cherry pick
  - التأكد من بقاء فرع الإصدار سليمًا وعدم ضم أي تصحيح غير مقصود
- إرشاد [مجموعة مساعدي مديري الإصدارات](#release-manager-associates)
- تطوير الميزات بنشاط وصيانة الشيفرة في k/release
- دعم مساعدي مديري الإصدارات والمساهمين عبر المشاركة الفعّالة في برنامج Buddy
  - التواصل الشهري مع المساعدين وتفويض مهام إليهم وتمكينهم من إصدار الإصدارات
    بأنفسهم، مع إرشادهم
  - البقاء متاحين لدعم المساعدين في استيعاب المساهمين الجدد، مثلاً بالإجابة عن
    الأسئلة واقتراح أعمال مناسبة لهم للقيام بها

وتعمل هذه المجموعة أحيانًا بالتعاون الوثيق مع
[لجنة الاستجابة الأمنية](https://git.k8s.io/community/committee-security-response/README.md)،
وعليه ينبغي أن تلتزم بالمبادئ الواردة في
[عملية الإصدار الأمني](https://git.k8s.io/security/security-release-process.md).

صلاحيات الوصول على GitHub: [@kubernetes/release-managers](https://github.com/orgs/kubernetes/teams/release-managers)

الإشارات على GitHub: @kubernetes/release-engineering

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Cici Huang ([@cici37](https://github.com/cici37))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Marko Mudrinić ([@xmudrii](https://github.com/xmudrii))
- Nabarun Pal ([@palnabarun](https://github.com/palnabarun))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))
- Verónica López ([@verolop](https://github.com/verolop))

### كيف تصبح مدير إصدارات {#becoming-a-release-manager}

لكي تصبح مدير إصدارات، عليك أن تعمل أولاً مساعداً لمدير الإصدارات. ويتخرّج
المساعدون إلى مديري إصدارات من خلال العمل بنشاط على الإصدارات عبر عدة دورات
إصدار، مع:

- إظهار الاستعداد لقيادة العملية
- العمل الثنائي مع مديري الإصدارات في الإصدارات التصحيحية، وصولاً إلى إصدار
  إصدار مستقل
  - ولأن عدد الإصدارات محدود، فإننا نأخذ في الحسبان أيضاً المساهمات الجوهرية
    في الترويج للصور وفي مهام هندسة الإصدارات الأساسية الأخرى
- طرح التساؤلات حول طريقة عمل المساعدين، واقتراح التحسينات، وجمع الملاحظات،
  وقيادة التغيير
- الالتزام بالموثوقية والاستجابة السريعة
- الانخراط في الأعمال المتقدمة التي تتطلب وصول وامتيازات بمستوى مدير الإصدارات
  لإتمامها

## مساعدو مديري الإصدارات {#release-manager-associates}

مساعدو مديري الإصدارات هم المتدربون لدى مديري الإصدارات، وقد كانوا يُعرفون
سابقاً بـ«مساعدي مديري الإصدارات الظلّيين». وهم مسؤولون عن:

- أعمال الإصدارات التصحيحية ومراجعة طلبات cherry pick
- المساهمة في k/release: تحديث التبعيات والتعوّد على الشيفرة المصدرية
- المساهمة في التوثيق: صيانة الكتيبات المرجعية والتأكد من توثيق عمليات الإصدار
- بمساعدة من مدير إصدارات: العمل مع فريق الإصدار خلال دورة الإصدار وإصدار
  إصدارات كوبيرنيتيس
- البحث عن فرص للمساعدة في تحديد الأولويات والتواصل
  - إرسال إعلانات مسبقة وتحديثات حول الإصدارات التصحيحية
  - تحديث التقويم، والمساعدة في تحديد تواريخ الإصدارات ومحطّاتها من
    [الجدول الزمني لدورة الإصدار](https://git.k8s.io/sig-release/releases)
- عبر برنامج Buddy، استيعاب المساهمين الجدد والعمل معهم على المهام

الإشارات على GitHub: @kubernetes/release-engineering

- Arnaud Meukam ([@ameukam](https://github.com/ameukam))
- Jim Angel ([@jimangel](https://github.com/jimangel))
- Joseph Sandoval ([@jrsapi](https://github.com/jrsapi))
- Xander Grzywinski([@salaxander](https://github.com/salaxander))

### كيف تصبح مساعداً لمدير الإصدارات {#becoming-a-release-manager-associate}

يمكن للمساهمين أن يصبحوا مساعدين من خلال إظهار ما يلي:

- مشاركة منتظمة، بما في ذلك من 6 إلى 12 شهراً من العمل النشط المتعلق بهندسة
  الإصدارات
- خبرة في تسلّم دور القائد التقني في فريق الإصدار خلال دورة إصدار
  - وتوفّر هذه الخبرة خط أساس متين لفهم طريقة عمل SIG Release إجمالاً، بما في ذلك
    توقعاتنا بشأن المهارات التقنية والاستجابة للتواصل والموثوقية
- العمل على مهام k/release التي تحسّن تفاعلنا مع Testgrid، وتنظيف المكتبات، وما
  شابه
  - وتتطلب هذه الجهود تفاعلاً وعملاً جماعياً مع مديري الإصدارات ومساعديهم

## قيادة SIG Release {#sig-release-leads}

رئيسا SIG Release والقادة التقنيون مسؤولون عن:

- حوكمة SIG Release
- قيادة جلسات تبادل المعرفة لمديري الإصدارات ومساعديهم
- الإرشاد في القيادة وتحديد الأولويات

هم مذكورون صراحةً هنا لأنهم مالكو قنوات التواصل المختلفة ومجموعات الصلاحيات
(فرق GitHub، ووصول GCP) لكل دور. ولأنهم من أعضاء المجتمع ذوي الامتيازات
العالية، فإنهم على اطلاع على بعض المراسلات الخاصة، وقد تتعلق أحياناً
بإفصاحات أمنية في كوبيرنيتيس.

فريق GitHub: [@kubernetes/sig-release-leads](https://github.com/orgs/kubernetes/teams/sig-release-leads)

### الرئيسان {#chairs}

- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))

### القادة التقنيون {#technical-leads}

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Verónica López ([@verolop](https://github.com/verolop))

---

يمكن العثور على مديري الفروع السابقين في [مجلد الإصدارات](https://git.k8s.io/sig-release/releases)
في مستودع kubernetes/sig-release ضمن الملف `release-x.y/release_team.md`.

مثال: [فريق إصدار 1.15](https://git.k8s.io/sig-release/releases/release-1.15/release_team.md)
