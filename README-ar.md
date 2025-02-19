# توثيق Kubernetes

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

يحتوي هذا المستودع على الموارد اللازمة لبناء [موقع Kubernetes والتوثيق](https://kubernetes.io/). نحن سعداء لأنك تريد المساهمة!

- [المساهمة في التوثيق](#contributing-to-the-docs)
- [ملفات README المترجمة](#localization-readmemds)

## استخدام هذا المستودع

يمكنك تشغيل الموقع محليًا باستخدام [Hugo (الإصدار الممتد)](https://gohugo.io/)، أو يمكنك تشغيله في بيئة حاويات. نوصي بشدة باستخدام بيئة الحاويات، لأنها توفر اتساقًا في النشر مع الموقع المباشر.

## المتطلبات الأساسية

لاستخدام هذا المستودع، تحتاج إلى تثبيت الأدوات التالية محليًا:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (الإصدار الممتد)](https://gohugo.io/)
- بيئة حاويات مثل [Docker](https://www.docker.com/).

قبل البدء، قم بتثبيت الاعتمادات. استنسخ المستودع وانتقل إلى الدليل:

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

يستخدم موقع Kubernetes [موضوع Docsy لـ Hugo](https://github.com/google/docsy#readme). حتى لو كنت تخطط لتشغيل الموقع في حاوية، نوصي بشدة بسحب الوحدة الفرعية والاعتمادات الأخرى عن طريق تشغيل الأمر التالي:

### Windows

```powershell
# جلب اعتمادات الوحدة الفرعية
git submodule update --init --recursive --depth 1
```

### Linux / أنظمة Unix الأخرى

```bash
# جلب اعتمادات الوحدة الفرعية
make module-init
```

## تشغيل الموقع باستخدام حاوية

لبناء الموقع داخل حاوية، قم بتشغيل الأمر التالي:

```bash
# يمكنك ضبط $CONTAINER_ENGINE ليكون اسم أي أداة حاويات شبيهة بـ Docker
make container-serve
```

إذا رأيت أخطاء، فمن المحتمل أن الحاوية لم يكن لديها موارد حوسبة كافية. لحل المشكلة، قم بزيادة كمية وحدة المعالجة المركزية والذاكرة المسموح بها لـ Docker على جهازك ([MacOS](https://docs.docker.com/desktop/settings/mac/) و[Windows](https://docs.docker.com/desktop/settings/windows/)).

افتح متصفحك على <http://localhost:1313> لعرض الموقع. مع كل تغيير في الملفات المصدر، يقوم Hugo بتحديث الموقع ويجبر المتصفح على إعادة التحديث.

## تشغيل الموقع محليًا باستخدام Hugo

تأكد من تثبيت الإصدار الممتد من Hugo الذي تم تحديده في متغير البيئة `HUGO_VERSION` في ملف [`netlify.toml`](netlify.toml#L11).

لتثبيت الاعتمادات، نشر الموقع واختباره محليًا، قم بتشغيل:

- لنظام macOS وLinux
  
  ```bash
  npm ci
  make serve
  ```

- لنظام Windows (PowerShell)
  
  ```powershell
  npm ci
  hugo.exe server --buildFuture --environment development
  ```

سيبدأ هذا خادم Hugo المحلي على المنفذ 1313. افتح متصفحك على <http://localhost:1313> لعرض الموقع. مع كل تغيير في الملفات المصدر، يقوم Hugo بتحديث الموقع ويجبر المتصفح على إعادة التحديث.

## بناء صفحات مرجع API

تقع صفحات مرجع API في `content/en/docs/reference/kubernetes-api` ويتم بناؤها من مواصفات Swagger، والمعروفة أيضًا بمواصفات OpenAPI، باستخدام <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>.

لتحديث صفحات المرجع لإصدار جديد من Kubernetes، اتبع هذه الخطوات:

1. اسحب الوحدة الفرعية `api-ref-generator`:

   ```bash
   git submodule update --init --recursive --depth 1
   ```

2. قم بتحديث مواصفات Swagger:

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

3. في `api-ref-assets/config/`، قم بتعديل الملفات `toc.yaml` و `fields.yaml` لتعكس التغييرات في الإصدار الجديد.

4. بعد ذلك، قم ببناء الصفحات:

   ```bash
   make api-reference
   ```

   يمكنك اختبار النتائج محليًا عن طريق بناء الموقع وتشغيله من صورة الحاوية:

   ```bash
   make container-image
   make container-serve
   ```

   في متصفح الويب، انتقل إلى <http://localhost:1313/docs/reference/kubernetes-api/> لعرض مرجع API.

5. عندما يتم عكس جميع التغييرات في ملفات التكوين `toc.yaml` و `fields.yaml`، قم بإنشاء طلب سحب يحتوي على صفحات مرجع API المولدة حديثًا.

## استكشاف الأخطاء وإصلاحها

### الخطأ: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): هذه الميزة غير متاحة في إصدار Hugo الحالي

يتم شحن Hugo في مجموعتين من الملفات التنفيذية لأسباب تقنية. الموقع الحالي يعمل فقط بناءً على إصدار **Hugo Extended**. في [صفحة الإصدار](https://github.com/gohugoio/hugo/releases) ابحث عن الأرشيفات التي تحتوي على `extended` في الاسم. للتأكيد، قم بتشغيل `hugo version` وابحث عن كلمة `extended`.

### استكشاف الأخطاء وإصلاحها في macOS لعدد الملفات المفتوحة

إذا قمت بتشغيل `make serve` على macOS وتلقيت الخطأ التالي:

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

حاول التحقق من الحد الحالي للملفات المفتوحة:

`launchctl limit maxfiles`

ثم قم بتشغيل الأوامر التالية (مقتبسة من <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>):

```shell
#!/bin/sh

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

يعمل هذا على Catalina وكذلك Mojave macOS.

## الانضمام إلى SIG Docs

تعرف على المزيد حول مجتمع SIG Docs في Kubernetes والاجتماعات على [صفحة المجتمع](https://github.com/kubernetes/community/tree/master/sig-docs#meetings).

يمكنك أيضًا الوصول إلى مشرفي هذا المشروع عبر:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [احصل على دعوة لـ Slack](https://slack.k8s.io/)
- [قائمة البريد](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## المساهمة في التوثيق

يمكنك النقر على زر **Fork** في أعلى يمين الشاشة لإنشاء نسخة من هذا المستودع في حساب GitHub الخاص بك. هذه النسخة تسمى _fork_. قم بإجراء أي تغييرات تريدها في fork الخاص بك، وعندما تكون جاهزًا لإرسال هذه التغييرات إلينا، انتقل إلى fork الخاص بك وقم بإنشاء طلب سحب جديد لإعلامنا بذلك.

بمجرد إنشاء طلب السحب الخاص بك، سيتحمل مراجع Kubernetes مسؤولية تقديم تعليقات واضحة وقابلة للتنفيذ. بصفتك مالك طلب السحب، **مسؤوليتك هي تعديل طلب السحب الخاص بك لتلبية التعليقات المقدمة من مراجع Kubernetes.**

لاحظ أيضًا أنه قد ينتهي بك الأمر بالحصول على أكثر من مراجع واحد لـ Kubernetes يقدم لك التعليقات، أو قد تحصل على تعليقات من مراجع Kubernetes تختلف عن التعليقات المقدمة من المراجع الأول.

بالإضافة إلى ذلك، في بعض الحالات، قد يطلب أحد المراجعين مراجعة فنية من مراجع تقني في Kubernetes عند الحاجة. سيبذل المراجعون قصارى جهدهم لتقديم التعليقات في الوقت المناسب، ولكن وقت الاستجابة قد يختلف وفق

ًا للظروف.

لمزيد من المعلومات حول المساهمة في توثيق Kubernetes، راجع:

- [المساهمة في توثيق Kubernetes](https://kubernetes.io/docs/contribute/)
- [أنواع محتوى الصفحات](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [دليل أسلوب التوثيق](https://kubernetes.io/docs/contribute/style/style-guide/)
- [ترجمة توثيق Kubernetes](https://kubernetes.io/docs/contribute/localization/)

### سفراء المساهمين الجدد

إذا كنت بحاجة إلى مساعدة في أي وقت أثناء المساهمة، فإن [سفراء المساهمين الجدد](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) هم نقطة اتصال جيدة. هؤلاء هم مشرفو SIG Docs الذين تشمل مسؤولياتهم توجيه المساهمين الجدد ومساعدتهم في أول طلبات السحب. أفضل مكان للتواصل مع سفراء المساهمين الجدد هو [Slack الخاص بـ Kubernetes](https://slack.k8s.io/). سفراء المساهمين الجدد الحاليين لـ SIG Docs:

| الاسم                      | Slack                      | GitHub                     |
| -------------------------- | -------------------------- | -------------------------- |
| Arsh Sharma                | @arsh                      | @RinkiyaKeDad              |

## ملفات README المترجمة

| اللغة                      | اللغة                      |
| -------------------------- | -------------------------- |
| [الصينية](README-zh.md)    | [الكورية](README-ko.md)     |
| [الفرنسية](README-fr.md)    | [البولندية](README-pl.md)     |
| [الألمانية](README-de.md)    | [البرتغالية](README-pt.md) |
| [الهندية](README-hi.md)      | [الروسية](README-ru.md)    |
| [الإندونيسية](README-id.md) | [الإسبانية](README-es.md)    |
| [الإيطالية](README-it.md)    | [الأوكرانية](README-uk.md)  |
| [اليابانية](README-ja.md)   | [الفيتنامية](README-vi.md) |

## ميثاق السلوك

المشاركة في مجتمع Kubernetes محكومة بـ [ميثاق السلوك الخاص بـ CNCF](https://github.com/cncf/foundation/blob/main/code-of-conduct.md).

## شكرًا لك

تزدهر Kubernetes من خلال المشاركة المجتمعية، ونحن نقدر مساهماتك في موقعنا وتوثيقنا!
