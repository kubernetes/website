&#x202b;
# مستندات فارسی کوبرنتیز

&#x202b;
[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)


&#x202b;
خوش آمدید! این مخزن شامل محتویات لازم برای ساخت [تارنما کوبرنتیز فارسی و مستندات](https://kubernetes.io/fa/) آن است. خوشحال می‌شویم که در این مسیر با مشارکت کردن ما را همراهی کنید. 

&#x202b;
## نحوه مشارکت کردن در مستندسازی

&#x202b;
شما می‌توانید روی دکمه‌ی **Fork** در گوشه‌ی سمت راست بالای صفحه کلیک کنید تا یک رونوشت از این مخزن در حساب گیت‌هاب خود ایجاد کنید. این رونوشت *fork* نامیده می‌شود. تغییرات دلخواه را در fork خود اعمال کنید. وقتی آماده‌ی ارسال آن تغییرات به ما شدید، به fork خود بروید و یک درخواست ادغام جدید(PR) ایجاد کنید و به ما اطلاع دهید.

&#x202b;
پس از ایجاد درخواست ادغام از سمت شما، فرد بررسی‌کننده تیم مستندات فارسی کوبرنتیز مسئولیت ارائه بازخورد و بررسی درخواست شما را بر عهده می‌گیرد. به عنوان صاحب درخواست ادغام، مسئولیت اصلاح درخواست ادغام بر اساس بازخوردی که از بررسی‌کننده  تیم مستندات فارسی کوبرنتیز دریافت می‌کنید، بر عهده شماست. همچنین، توجه داشته باشید که ممکن است در نهایت بیش از یک بررسی‌کننده بازخورد ارائه دهند، یا ممکن است از فرد بررسی‌کننده جدید و متفاوت از کسی که در ابتدا برای ارائه بازخورد تعیین شده بود، بازخورد دریافت کنید. در برخی موارد، در صورت نیاز، یکی از بررسی‌کنندگان شما ممکن است از یک [بررسی‌کننده فنی کوبرنتیز](https://github.com/kubernetes/website/wiki/tech-reviewers) درخواست بررسی فنی کند. بررسی‌کنندگان تمام تلاش خود را می‌کنند تا بازخوردها را به موقع ارائه دهند، اما زمان پاسخگویی بسته به شرایط ممکن است متفاوت باشد.

&#x202b;
برای اطلاعات بیشتر در مورد مشارکت در مستندسازی کوبرنتیز به فارسی به پیوندهای زیر مراجعه کنید:

&#x202b;
* [شروع مشارکت](https://kubernetes.io/fa/docs/contribute/start/)
&#x202b;
* [انواع محتوای صفحه](https://kubernetes.io/fa/docs/contribute/style/page-content-types/)
&#x202b;
* [راهنمای سبک مستندسازی](https://kubernetes.io/fa/docs/contribute/style/style-guide/)
&#x202b;
* [بومی‌سازی مستندات کوبرنتیز](https://kubernetes.io/fa/docs/contribute/localization/)

&#x202b;
## مستندات بومی‌سازی کوبرنتیز

&#x202b;
### فارسی
&#x202b;
با تیم بومی سازی فارسی می‌توانید از طریق نشانی های زیر در ارتباط باشید:
&#x202b;
* محمدامین طاهری ([@xirehat](https://github.com/xirehat))
&#x202b;
* محمد زارعی ([@moh0ps](https://github.com/moh0ps))
&#x202b;
* به‌دین طالبی ([@behiuu](https://github.com/behiuu))
&#x202b;
* محمدرضا بهفر ([@mamrezb](https://github.com/mamrezb))
&#x202b;
* [کانال Slack](https://kubernetes.slack.com/messages/kubernetes-docs-fa)

&#x202b;
## اجرای تارنما با Docker

&#x202b;
برای اجرای تارنما کوبرنتیز، توصیه می‌شود آن را با [Docker](https://docker.com) اجرا کنید که شامل مولد تارنما استاتیک [Hugo](https://gohugo.io) باشد.

&#x202b;
> در ویندوز، به ابزارهای اضافی نیاز دارید که می‌توانید با [Chocolatey] (https://chocolatey.org) نصب کنید.
`choco install make`

&#x202b;
> اگر ترجیح می‌دهید تارنما را بدون Docker اجرا کنید، به [اجرای تارنما با Hugo](#اجرای-تارنما-با-Hugo) مراجعه کنید.

&#x202b;
قالب مورد نیاز [Docsy Hugo theme](https://github.com/google/docsy#readme) باید به عنوان یک زیرماژول git نصب شود:

```
git submodule update --init --recursive --depth 1
```

&#x202b;
اگر Docker را نصب کرده‌اید، image Docker `hugo` را ایجاد کنید:

```bash
make container-image
```

&#x202b;
پس از ایجاد image، می‌توانید تارنما را راه اندازی کنید:

```bash
make container-serve
```

&#x202b;
برای مشاهده تارنما، مرورگر خود را با نشانی http://localhost:1313 باز کنید. وقتی تغییراتی در پرونده‌های منبع ایجاد می‌کنید، Hugo تارنما را به‌روزرسانی کرده و مرورگر را مجبور به فراخوانی مجدد می‌کند.

&#x202b;
## اجرای تارنما با Hugo

&#x202b;
دستورالعمل‌های نصب Hugo را می‌توانید در [مستندات رسمی](https://gohugo.io/installation/) بیابید. مطمئن شوید که نسخه Hugo مشخص شده در متغیر محیطی `HUGO_VERSION` در فایل `netlify.toml` را نصب می‌کنید.

&#x202b;
قالب مورد نیاز [Docsy Hugo theme](https://github.com/google/docsy#readme) باید به عنوان یک زیرماژول git نصب شود:

```
git submodule update --init --recursive --depth 1
```

&#x202b;
برای اجرای تارنما در صورتی که Hugo را نصب کرده‌اید:

```bash
npm ci
make serve
```

&#x202b;
برای مشاهده تارنما، مرورگر خود را با نشانی http://localhost:1313 باز کنید. وقتی تغییراتی در پرونده‌های منبع ایجاد می‌کنید، Hugo تارنما را به‌روزرسانی کرده و مرورگر را مجبور به فراخوانی مجدد می‌کند.

&#x202b;
## جامعه، بحث، مشارکت و حمایت

&#x202b;
برای آشنایی با نحوه تعامل با انجمن کوبرنتیز به [صفحه انجمن](https://kubernetes.io/community/) مراجعه کنید.

&#x202b;
برای ارتباط با سرپرستان این پروژه می‌توانید از طریق نشانی زیر اقدام کنید:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

&#x202b;
### قوانین رفتاری

&#x202b;
مشارکت در جامعه کوبرنتیز تابع [آیین‌نامه رفتاری کوبرنتیز](https://github.com/kubernetes/website/blob/main/code-of-conduct.md) است.

&#x202b;
## سپاس گزاریم

&#x202b;
کوبرنتیز با مشارکت جامعه رونق می‌گیرد و ما از مشارکت‌های شما در تارنما و مستندات کوبرنتیز فارسی استقبال می‌کنیم. دمتون گرم!
