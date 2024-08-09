# مستندات Kubernetes

[![وضعیت Netlify](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![انتشار GitHub](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

این مخزن شامل دارایی‌های مورد نیاز برای ساخت [وبسایت و مستندات Kubernetes](https://kubernetes.io/) است. از اینکه می‌خواهید مشارکت کنید خوشحالیم!

- [مشارکت در مستندات](#contributing-to-the-docs)
- [فایل‌های README محلی سازی شده](#localization-readmes)

## استفاده از این مخزن

می‌توانید وبسایت را به صورت محلی با استفاده از [Hugo (نسخه گسترش یافته)](https://gohugo.io/) اجرا کنید، یا می‌توانید آن را در یک محیط اجرایی کانتینر اجرا کنید. ما به شدت توصیه می‌کنیم از محیط اجرایی کانتینر استفاده کنید، زیرا سازگاری با وبسایت زنده را فراهم می‌کند.

## پیش‌نیازها

برای استفاده از این مخزن، به موارد زیر به صورت محلی نیاز دارید:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (نسخه گسترش یافته)](https://gohugo.io/)
- [Docker](https://www.docker.com/) یک محیط اجرایی کانتینر، مانند 

> [!توجه]
مطمئن شوید نسخه Hugo گسترش یافته‌ای را که توسط متغیر محیطی `HUGO_VERSION` در فایل [`netlify.toml`](netlify.toml#L11) مشخص شده است نصب کنید.

قبل از شروع، وابستگی‌ها را نصب کنید. مخزن را کلون کرده و به دایرکتوری مربوطه بروید:

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

وبسایت Kubernetes از [تم Docsy Hugo](https://github.com/google/docsy#readme) استفاده می‌کند. حتی اگر قصد دارید وبسایت را در یک کانتینر اجرا کنید، به شدت توصیه می‌کنیم زیرمجموعه‌ها و سایر وابستگی‌های توسعه را با اجرای دستورات زیر دریافت کنید:

### ویندوز
```powershell
# دریافت وابستگی‌های زیرمجموعه
git submodule update --init --recursive --depth 1
```

### لینوکس / سایر یونیکس‌ها
```bash
# دریافت وابستگی‌های زیرمجموعه
make module-init
```

## اجرای وبسایت با استفاده از یک کانتینر

برای ساخت سایت در یک کانتینر، دستور زیر را اجرا کنید:

```bash
# می‌توانید $CONTAINER_ENGINE را به نام هر ابزاری مانند Docker تنظیم کنید
make container-serve
```

اگر خطا مشاهده کردید، احتمالاً به این معنی است که کانتینر Hugo منابع محاسباتی کافی در دسترس نداشته است. برای حل این مشکل، میزان استفاده از CPU و حافظه مجاز برای Docker را در دستگاه خود افزایش دهید ([MacOS](https://docs.docker.com/desktop/settings/mac/) و [Windows](https://docs.docker.com/desktop/settings/windows/)).

مرورگر خود را به <http://localhost:1313> باز کنید تا وبسایت را مشاهده کنید. همانطور که تغییراتی در فایل‌های منبع ایجاد می‌کنید، Hugo وبسایت را به روز می‌کند و یک بروزرسانی مرورگر را اجباری می‌کند.

## اجرای وبسایت به صورت محلی با استفاده از Hugo

برای نصب وابستگی‌ها، استقرار و تست سایت به صورت محلی، دستور زیر را اجرا کنید:

- برای macOS و لینوکس
  ```bash
  npm ci
  make serve
  ```
- برای ویندوز (PowerShell)
  ```powershell
  npm ci
  hugo.exe server --buildFuture --environment development
  ```

این کار سرور محلی Hugo را در پورت 1313 راه‌اندازی می‌کند. مرورگر خود را به <http://localhost:1313> باز کنید تا وبسایت را مشاهده کنید. همانطور که تغییراتی در فایل‌های منبع ایجاد می‌کنید، Hugo وبسایت را به روز می‌کند و یک بروزرسانی مرورگر را اجباری می‌کند.

## ساخت صفحات مرجع API

صفحات مرجع API که در `content/en/docs/reference/kubernetes-api` قرار دارند، از مشخصات Swagger، که به عنوان مشخصات OpenAPI نیز شناخته می‌شود، ساخته می‌شوند، با استفاده از <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>.

برای به‌روزرسانی صفحات مرجع برای نسخه جدید Kubernetes مراحل زیر را دنبال کنید:

1. زیرمجموعه `api-ref-generator` را دریافت کنید:

   ```bash
   git submodule update --init --recursive --depth 1
   ```

2. مشخصات Swagger را به‌روزرسانی کنید:

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

3. در `api-ref-assets/config/`، فایل‌های `toc.yaml` و `fields.yaml` را برای انعکاس تغییرات نسخه جدید تطبیق دهید.

4. سپس صفحات را بسازید:

   ```bash
   make api-reference
   ```

   می‌توانید نتایج را به صورت محلی با ساخت و سرو سایت از یک کانتینر تست کنید:

   ```bash
   make container-serve
   ```

   در یک مرورگر وب، به <http://localhost:1313/docs/reference/kubernetes-api/> بروید تا مرجع API را مشاهده کنید.

5. وقتی همه تغییرات نسخه جدید در فایل‌های پیکربندی `toc.yaml` و `fields.yaml` منعکس شدند، یک Pull Request با صفحات مرجع API جدید ایجاد کنید.

## عیب‌یابی

### خطا: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): این ویژگی در نسخه فعلی Hugo شما موجود نیست

Hugo به دلایل فنی در دو مجموعه باینری عرضه می‌شود. وبسایت فعلی فقط بر اساس نسخه **گسترش یافته Hugo** اجرا می‌شود. در [صفحه انتشار](https://github.com/gohugoio/hugo/releases) به دنبال آرشیوهایی با `extended` در نام باشید. برای تأیید، دستور `hugo version` را اجرا کنید و به دنبال کلمه `extended` بگردید.

### عیب‌یابی macOS برای تعداد زیاد فایل‌های باز

اگر دستور `make serve` را در macOS اجرا کنید و خطای زیر را دریافت کنید:

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

سعی کنید محدودیت فعلی برای فایل‌های باز را بررسی کنید:

`launchctl limit maxfiles`

سپس دستورات زیر را اجرا کنید (با تطبیق از <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>):

```shell
#!/bin/sh

# این‌ها لینک‌های اصلی گیت هستند که به گیت‌های من لینک شده‌اند.
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

این دستورات برای Catalina و همچنین macOS Mojave کار می‌کند.

## شرکت در SIG Docs

بیشتر درباره جامعه SIG Docs Kubernetes و جلسات در [صفحه جامعه](https://github.com/kubernetes/community/tree/master/sig-docs#meetings) بیاموزید.

همچنین می‌توانید با نگهداران این پروژه در ارتباط باشید:



- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [دعوت‌نامه برای این Slack](https://slack.k8s.io/)
- [لیست پستی](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## مشارکت در مستندات

می‌توانید با کلیک بر روی دکمه **Fork** در قسمت بالای راست صفحه، یک نسخه از این مخزن را در حساب GitHub خود ایجاد کنید. این نسخه یک _فورک_ نامیده می‌شود. هر تغییری که می‌خواهید در فورک خود اعمال کنید و وقتی آماده ارسال این تغییرات به ما شدید، به فورک خود بروید و یک درخواست Pull جدید ایجاد کنید تا ما را در جریان قرار دهید.

پس از ایجاد درخواست Pull شما، یک بازبینی‌کننده Kubernetes مسئولیت ارائه بازخوردهای واضح و قابل اجرا را بر عهده می‌گیرد. به عنوان مالک درخواست Pull، **مسئولیت شما این است که درخواست Pull خود را به منظور پاسخ‌گویی به بازخوردهای ارائه شده توسط بازبینی‌کننده Kubernetes تغییر دهید.**

همچنین توجه داشته باشید که ممکن است بیش از یک بازبینی‌کننده Kubernetes به شما بازخورد ارائه دهد یا ممکن است بازخوردی از یک بازبینی‌کننده Kubernetes دریافت کنید که با بازبینی‌کننده‌ای که در ابتدا مسئول ارائه بازخورد به شما بوده است متفاوت باشد.

علاوه بر این، در برخی موارد، یکی از بازبینی‌کنندگان شما ممکن است درخواست بررسی فنی از یک بازبینی‌کننده فنی Kubernetes کند. بازبینی‌کنندگان تمام تلاش خود را برای ارائه بازخورد به موقع خواهند کرد اما زمان پاسخ‌گویی می‌تواند بر اساس شرایط متفاوت باشد.

برای اطلاعات بیشتر درباره مشارکت در مستندات Kubernetes، به لینک‌های زیر مراجعه کنید:

- [مشارکت در مستندات Kubernetes](https://kubernetes.io/docs/contribute/)
- [انواع محتواهای صفحه](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [راهنمای سبک مستندات](https://kubernetes.io/docs/contribute/style/style-guide/)
- [محلی سازی مستندات Kubernetes](https://kubernetes.io/docs/contribute/localization/)
- [مقدمه‌ای بر مستندات Kubernetes](https://www.youtube.com/watch?v=pprMgmNzDcw)

### سفیران تازه وارد

اگر در هر مرحله از مشارکت نیاز به کمک دارید، [سفیران تازه وارد](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) یک نقطه تماس خوب هستند. این‌ها تأییدکنندگان SIG Docs هستند که مسئولیت راهنمایی تازه واردان و کمک به آن‌ها در طول چند درخواست Pull اولشان را بر عهده دارند. بهترین مکان برای تماس با سفیران تازه وارد در [Slack Kubernetes](https://slack.k8s.io/) است. سفیران تازه وارد فعلی برای SIG Docs:

| نام                        | Slack                       | GitHub                     |
| -------------------------- | -------------------------- | -------------------------- |
| Sreeram Venkitesh          | @sreeram.venkitesh         | @sreeram-venkitesh         |

## Localization READMEs
| Language                   | Language                   |
| -------------------------- | -------------------------- |
| [Bengali](README-bn.md)    | [Korean](README-ko.md)     |
| [Chinese](README-zh.md)    | [Polish](README-pl.md)     |
| [French](README-fr.md)     | [Portuguese](README-pt.md) |
| [German](README-de.md)     | [Russian](README-ru.md)    |
| [Hindi](README-hi.md)      | [Spanish](README-es.md)    |
| [Indonesian](README-id.md) | [Ukrainian](README-uk.md)  |
| [Italian](README-it.md)    | [Vietnamese](README-vi.md) |
| [Japanese](README-ja.md)   | [Persian](README-fa.md)    |

## کد رفتار

مشارکت در جامعه Kubernetes تحت حاکمیت [کد رفتار CNCF](https://github.com/cncf/foundation/blob/main/code-of-conduct.md) است.

## تشکر

Kubernetes بر پایه مشارکت جامعه شکل گرفته است و از کمک‌های شما به وبسایت و مستندات ما قدردانی می‌کنیم!
