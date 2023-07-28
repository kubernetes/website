# توثيق Kubernetes

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

يحتوي هذا المستودع على المصادر المطلوبة لبناء [موقع ووثائق Kubernetes](https://kubernetes.io/). يسعدنا أنك تريد المساهمة!

- [المساهمة في التوثيق](#contributing-to-the-docs)
- [ترجمة ReadMes](#localization-readmemds)

## استخدام هذا المستودع

يمكنك تشغيل الموقع محليًا باستخدام [(نسخة موسعة) Hugo](https://gohugo.io/), أو يمكنك تشغيله على شكل حاوية. ننصح باستخدام الحاوية، لأنه يوفر تناسقًا في النشر مع موقع الويب النهائي.

## المتطلبات الأساسية

لاستخدام هذا المستودع، تحتاج إلى تثبيت ما يلي محليًا:

- برنامج [npm](https://www.npmjs.com/)
- بيئة التطوير [Go](https://go.dev/)
- إطار العمل [Hugo (نسخة موسعة)](https://gohugo.io/)
- مشغل حاويات، مثل [Docker](https://www.docker.com/).

قبل أن تبدأ، قم بتثبيت البرامج الضرورية لتشغيل الموقع. نزل المستودع لجهازك الخاص وانتقل إلى الدليل:

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

يستخدم موقع Kubernetes ثيمة [Docsy Hugo theme](https://github.com/google/docsy#readme). حتى إذا كنت تخطط لتشغيل موقع الويب في حاوية، فإننا نوصي بتنزيل الوحدة الجزئية و البرامج الضرورية الأخرى عبر تنفيذ ما يلي:

### ويندوز
```powershell
# fetch submodule dependencies
git submodule update --init --recursive --depth 1
```

### لينكس / يونكس
```bash
# fetch submodule dependencies
make module-init
```

## تشغيل الموقع باستخدام حاوية

لتشغيل الموقع في حاوية، قم بما يلي:

```bash
# You can set $CONTAINER_ENGINE to the name of any Docker-like container tool
make container-serve
```

إذا لاحظت أعطابا تقنية، فربما يعني ذلك أن حاوية Hugo لم تتوفر على موارد حوسبة كافية. لحل هذه المشاكل، قم بزيادة مقدار وحدة المعالجة المركزية والذاكرة المستخدمة و المسموح بها لـ Docker على جهازك ([MacOSX](https://docs.docker.com/docker-for-mac/#resources) و [Windows](https://docs.docker.com/docker-for-windows/#resources)).

افتح المتصفح الخاص بك إلى <http://localhost:1313> لعرض الموقع. أثناء إجراء تغييرات على الملفات المصدر، يقوم Hugo بتحديث موقع الويب ويفرض تحديث المتصفح.

## تشغيل الموقع محليًا باستخدام Hugo

تأكد من تثبيت إصدار Hugo الموسع المحدد بواسطة متغير البيئة `HUGO_VERSION` في ملف [`netlify.toml`](netlify.toml#L10).

لتكوين الموقع واختباره محليًا، قم بما يلي:

```bash
# install dependencies
npm ci
make serve
```

هذا سيبدأ خادم Hugo المحلي على رقم المنفذ 1313. افتح المتصفح على <http://localhost:1313> لعرض موقع الويب. أثناء إجراء تغييرات على الملفات المصدر، يقوم Hugo بتحديث موقع الويب و المتصفح.

## تأليف الصفحات المرجعية ل API

تم إنشاء الصفحات المرجعية ل API الموجودة في `content/en/docs/reference/kubernetes-api` إنطلاقا من مواصفات Swagger, يُعرف أيضًا باسم مواصفات OpenAPI, باستخدام <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>.

لتحديث الصفحات المرجعية لإصدار جديد من Kubernetes، اتبع الخطوات التالية:

أولا قم بسحب الوحدة الفرعية `api-ref-generator`:

   ```bash
   git submodule update --init --recursive --depth 1
   ```

ثانيا قم بتحديث مواصفات Swagger :

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

ثالتاً في مجلد `api-ref-assets/config/`, غير الملفات `toc.yaml` و `fields.yaml` لتعكس التغييرات في الإصدار الجديد.

ثم قم ببناء الصفحات :

   ```bash
   make api-reference
   ```

   يمكنك اختبار النتائج محليًا عن طريق إنشاء الموقع و تقديمه انطلاقًا من صورة الحاوية :

   ```bash
   make container-image
   make container-serve
   ```

   في متصفح الويب، انتقل إلى <http://localhost:1313/docs/reference/kubernetes-api/> لعرض مرجع API.

عندما تنعكس جميع تغييرات العقد الجديد في ملفات الإعدادات `toc.yaml` و `fields.yaml`, قم بإنشاء طلب سحب PR مع صفحات مرجع API التي تم إنشاؤها حديثًا.

## استكشاف الأخطاء وإصلاحها

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

يرتكز الموقع على إطار العمل **Hugo Extended** في نسخته الموسعة فقط. في [صفحة الإصدار](https://github.com/gohugoio/hugo/releases) ابحث في الإسم عن أرشيفات ل `extended`. لكي تتأكد, قم بتشغيل الأمر `hugo version` وابحث عن الكلمة `extended`.

### تحليل أخطاء MACOS عند فتح عدد كبير من الملفات

إذا قمت بتشغيل الأمر `make serve` على macOS وتلقيت الخطأ التالي :

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

حاول التحقق من الحد الحالي للملفات المفتوحة :

`launchctl limit maxfiles`

ثم قم بتشغيل الأوامر التالية (مقتبس من
<https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>):

```shell
#!/bin/sh

# These are the original gist links, linking to my gists now.
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxfiles.plist
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxproc.plist

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

يعمل هذا الحل مع أنظمة التشغيل Catalina و Mojave macOS.

## انخرط مع SIG Docs

تعرف على المزيد حول مجتمع SIG Docs Kubernetes والاجتماعات على [صفحة مجتمع المساهمين](https://github.com/kubernetes/community/tree/master/sig-docs#meetings).

يمكنك أيضًا التواصل مع القائمين على هذا المشروع على :

[تطبيق Slack](https://kubernetes.slack.com/messages/sig-docs)

[احصل على دعوة Slack](https://slack.k8s.io/)

[لائحة المراسلة](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## المساهمة في المستندات {#contributing-to-the-docs}

يمكنك النقر على الزر **Fork**  في أقصى يمين الشاشة لإنشاء نسخة من هذا المستودع في حسابك الخاص GitHub. هذه النسخة تسمى _fork_. قم بإجراء أي تغييرات تريدها في مستودعك، وعندما تكون مستعدًا لإرسال هذه التغييرات إلينا، انتقل إلى مستودعك وقم بإنشاء طلب سحب PR لإعلامنا بذلك.

بمجرد إنشاء طلب السحب، سيتحمل أحد أفراد فريق Kubernetes مسؤولية مراجعته و تقديم ملاحظات واضحة وقابلة للتنفيذ. بصفتك مالك طلب السحب ،**تقع على عاتقك مسؤولية تعديله لتصحيح الملاحظات التي قدمها لك مراجع Kubernetes.**

لاحظ أيضًا أنه قد ينتهي بك الأمر إلى وجود أكثر من مراجع واحد من Kubernetes يقدم لك تعليقات أو قد ينتهي بك الأمر بالحصول على تعليقات من مراجع Kubernetes يختلف عن ذلك الذي تم تعيينه في البداية لتقديم ملاحظات لك.

علاوة على ذلك، في بعض الحالات، قد يطلب أحد المراجعين مراجعة فنية من مراجع تقني Kubernetes عند الحاجة. سيبذل المراجعون قصارى جهدهم لتقديم الملاحظات في الوقت المناسب ولكن وقت الاستجابة يمكن أن يختلف بناءً على الظروف.

لمزيد من المعلومات حول المساهمة في وثائق Kubernetes، راجع:

- [المساهمة في وثائق Kubernetes](https://kubernetes.io/docs/contribute/)
- [أنواع محتويات الصفحة](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [دليل أسلوب التوثيق](https://kubernetes.io/docs/contribute/style/style-guide/)
- [ترجمة وثائق Kubernetes](https://kubernetes.io/docs/contribute/localization/)

### السفراء المساهمون الجدد

إذا كنت بحاجة إلى مساعدة في أي وقت عند المساهمة، فإن [السفراء المساهمون الجدد](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) هي نقطة اتصال جيدة. هؤلاء هم مراجعو مستندات SIG الذين تشمل مسؤولياتهم توجيه المساهمين الجدد ومساعدتهم من خلال طلبات السحب الأولى. أفضل وسيلة للاتصال بالسفراء المساهمين الجدد سيكون على [Kubernetes Slack](https://slack.k8s.io/). السفراء المساهمون الجدد الحاليون لـ SIG Docs هم :

| Name                       | Slack                      | GitHub                     |                   
| -------------------------- | -------------------------- | -------------------------- |
| Mohammed BOUKHALFA         | @mboukhalfa                | @mboukhalfa                |
| Salah Eddine Laamimech     | @Salah Eddine              | @selaamimech               |

## ترجمة `README.md`'s {#localization-readmemds}

| Language                   | Language                   |
| -------------------------- | -------------------------- |
| [Chinese](README-zh.md)    | [Korean](README-ko.md)     |
| [French](README-fr.md)     | [Polish](README-pl.md)     |
| [German](README-de.md)     | [Portuguese](README-pt.md) |
| [Hindi](README-hi.md)      | [Russian](README-ru.md)    |
| [Indonesian](README-id.md) | [Spanish](README-es.md)    |
| [Italian](README-it.md)    | [Ukrainian](README-uk.md)  |
| [Japanese](README-ja.md)   | [Vietnamese](README-vi.md) |
| [Arabic](README-ar.md)     |                            |

## مدونة لقواعد السلوك

تخضع المشاركة في مجتمع Kubernetes لـ
[مدونة لقواعد السلوك CNCF](https://github.com/cncf/foundation/blob/main/code-of-conduct.md).

## شكرًا

مشروع Kubernetes يزدهر من خلال مشاركة جميع الفاعلين داخل المجتمع، ونحن نقدر مساهماتك في موقعنا على الويب ووثائقنا!
