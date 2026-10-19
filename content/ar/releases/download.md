---
title: تنزيل كوبيرنيتيس
type: docs
---

يوفّر كوبيرنيتيس ملفات تنفيذية لكل مكوّن، إلى جانب مجموعة قياسية من تطبيقات
العميل التي تُستخدم لتهيئة عنقود أو التفاعل معه. ويمكن تشغيل مكوّنات مثل خادم
API داخل صور حاويات تعمل ضمن العنقود، كما تُنشر هذه المكوّنات في صور حاويات
ضمن عملية الإصدار الرسمية. وتتوفر جميع الملفات التنفيذية وصور الحاويات لعدة
أنظمة تشغيل ومعماريات عتادية.

### kubectl

<!-- overview -->

تتيح لك أداة سطر الأوامر [kubectl](/docs/reference/kubectl/kubectl/) في
كوبيرنيتيس تنفيذ الأوامر على عناقيد كوبيرنيتيس.

ويمكنك استخدام kubectl لنشر التطبيقات، وفحص موارد العنقود وإدارتها، وعرض
السجلات. ولمزيد من المعلومات، بما في ذلك القائمة الكاملة لعمليات kubectl، راجع
[وثائق مرجع `kubectl`](/docs/reference/kubectl/).

يمكن تثبيت kubectl على مجموعة متنوعة من منصات لينكس وmacOS وويندوز. اختر نظام
التشغيل المفضّل لديك من القائمة أدناه.

- [تثبيت kubectl على لينكس](/docs/tasks/tools/install-kubectl-linux)
- [تثبيت kubectl على macOS](/docs/tasks/tools/install-kubectl-macos)
- [تثبيت kubectl على ويندوز](/docs/tasks/tools/install-kubectl-windows)

## صور الحاويات

تُنشر جميع صور حاويات كوبيرنيتيس في سجل صور الحاويات `registry.k8s.io`.

| صورة الحاوية                                                             | المعماريات المدعومة               |
| ------------------------------------------------------------------------ | --------------------------------- |
| registry.k8s.io/kube-apiserver:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-controller-manager:v{{< skew currentPatchVersion >}} | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-proxy:v{{< skew currentPatchVersion >}}              | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-scheduler:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}             | amd64, arm, arm64, ppc64le, s390x |

### معماريات صور الحاويات

تتوفر جميع صور الحاويات لعدة معماريات، وينبغي لبيئة تشغيل الحاويات أن تختار
المعمارية الصحيحة بحسب المنصة الأساسية. ويمكنك أيضاً سحب صورة مخصّصة لمعمارية
بعينها بإضافة لاحقة إلى اسم صورة الحاوية، على سبيل المثال
`registry.k8s.io/kube-apiserver-arm64:v{{< skew currentPatchVersion >}}`.

### توقيعات صور الحاويات

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

تكون صور الحاويات في كوبيرنيتيس {{< param "version" >}} موقَّعة باستخدام توقيعات
[sigstore](https://sigstore.dev):

وينشر مشروع كوبيرنيتيس قائمة بصور حاويات كوبيرنيتيس الموقَّعة بصيغة
[SPDX 2.3](https://spdx.dev/specifications/). ويمكنك جلب هذه القائمة باستخدام:

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" | grep "SPDXID: SPDXRef-Package-registry.k8s.io" |  grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/'
```

للتحقق يدوياً من صور الحاويات الموقَّعة الخاصة بمكوّنات كوبيرنيتيس الأساسية، راجع
[التحقق من صور الحاويات الموقَّعة](/docs/tasks/administer-cluster/verify-signed-artifacts).

وعند سحب صورة حاوية لمعمارية محددة، تُوقَّع الصورة أحادية المعمارية بالطريقة
نفسها المتبعة في قوائم المانيفست متعددة المعماريات.

## الملفات التنفيذية

{{< release-binaries >}}
