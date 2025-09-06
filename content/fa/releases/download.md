---
title: دانلود کوبرنتیز 
type: docs
---
کوبرنتیز باینری‌هایی را برای هر مؤلفه، همراه با مجموعه‌ای استاندارد از برنامه‌های کلاینت برای راه‌اندازی (bootstrap) یا تعامل با یک خوشه ارائه می‌دهد.
مؤلفه‌هایی مانند API Server قابلیت اجرا در قالب image کانتینری داخل خوشه (cluster) را دارند.
این مؤلفه‌ها همچنین به‌عنوان بخشی از فرآیند انتشار رسمی، در قالب image کانتینری نیز عرضه می‌شوند.
تمام باینری‌ها و image‌های کانتینری برای سیستم‌عامل‌ها و معماری‌های سخت‌افزاری مختلف در دسترس هستند.

### kubectl

<!-- overview -->

ابزار خط فرمان کوبرنتیز، یعنی [kubectl](/docs/reference/kubectl/kubectl/)، این امکان را به شما می‌دهد که دستورات را علیه خوشه های کوبرنتیز اجرا کنید.

شما می‌توانید از kubectl برای استقرار (deploy) برنامه‌ها، بررسی و مدیریت منابع خوشه، و مشاهده لاگ‌ها استفاده کنید.
برای اطلاعات بیشتر، از جمله فهرست کامل عملیات‌های kubectl، به مستندات مرجع [`kubectl` مستندات مرجع](/docs/reference/kubectl/). مراجعه کنید.


ابزار kubectl قابل نصب روی انواع پلتفرم‌های لینوکس، macOS و ویندوز است.
سیستم‌عامل مورد نظر خود را از لیست زیر انتخاب کنید.

- [نصب kubectl  بر روی سیستم عامل لینوکس](/docs/tasks/tools/install-kubectl-linux) 
- [نصب kubectl  بر روی سیستم عامل مک](/docs/tasks/tools/install-kubectl-macos)
- [نصب kubectl  بر روی سیستم عامل ویندوز](/docs/tasks/tools/install-kubectl-windows)

## image های  کانتینری

تمام image های کانتینری کوبرنتیز در رجیستری image کانتینری `registry.k8s.io` منتشر می‌شوند.

| image‌های کانتینری                                                         |معماری های قابل پشتیبانی         |
| ------------------------------------------------------------------------- | --------------------------------- |
| registry.k8s.io/kube-apiserver:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-controller-manager:v{{< skew currentPatchVersion >}} | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-proxy:v{{< skew currentPatchVersion >}}              | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-scheduler:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}             | amd64, arm, arm64, ppc64le, s390x |

###  معماری image کانتینری

تمام image‌های کانتینری برای معماری‌های مختلف در دسترس هستند، و runtime کانتینر باید بر اساس پلتفرم زیرساختی، image مناسب را انتخاب کند.
همچنین این امکان وجود دارد که یک معماری خاص را به‌طور مستقیم فراخوانی (pull) کنید، با افزودن پسوند به نام image کانتینر؛ برای مثال:
`registry.k8s.io/kube-apiserver-arm64:v{{< skew currentPatchVersion >}}`.

### امضای image های کانتینری

{{< feature-state for_k8s_version="v1.26" state="beta" >}}


برای کوبرنتیز نسخه {{< param "version" >}}،
image‌های کانتینری با استفاده از امضاهای [sigstore](https://sigstore.dev)امضا می‌شوند:

{{< note >}}
امضاهای sigstore مربوط به image‌های کانتینری در حال حاضر در مکان‌های جغرافیایی مختلف یکسان نیستند.
اطلاعات بیشتر درباره این مشکل در issue مربوطه در [مشکلات در گیتهاب](https://github.com/kubernetes/registry.k8s.io/issues/187). موجود است.
{{< /note >}}

پروژه کوبرنتیز فهرستی از image‌ های کانتینری امضاشده کوبرنتیز را در قالب [SPDX 2.3](https://spdx.dev/specifications/) منتشر می‌کند.
شما می‌توانید این فهرست را با استفاده از دستور زیر دریافت کنید:

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" | grep "SPDXID: SPDXRef-Package-registry.k8s.io" |  grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/'
```

برای تأیید دستی image‌های کانتینری امضاشده مؤلفه‌های اصلی کوبرنتیز، [تایید image های کانتینری](/docs/tasks/administer-cluster/verify-signed-artifacts).به مطلب تأیید image‌های کانتینری امضاشده مراجعه کنید.

اگر image کانتینری را برای یک معماری خاص دریافت (pull) کنید، image تک‌معماری به همان شیوه‌ای که برای لیست‌های manifest چندمعماری امضا می‌شود، امضا خواهد شد.

## باینری ها

{{< release-binaries >}}
