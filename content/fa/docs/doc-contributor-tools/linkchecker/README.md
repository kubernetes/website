# ابزار بررسی پیوند ‌های داخلی

شما می‌توانید از [htmltest](https://github.com/wjdp/htmltest) برای بررسی پیوند‌های خراب در [`/content/en/`](https://git.k8s.io/website/content/en/) استفاده کنید. این ابزار هنگام بازسازی بخش‌هایی از محتوا، جابجایی صفحات یا تغییر نام فایل‌ها یا سرصفحه‌های صفحه مفید است

## نحوه عملکرد ابزار

`htmltest` پیوند ‌های موجود در فایل‌های HTML تولید شده از مخزن وب‌سایت کوبرنتیز را بررسی می‌کند. این ابزار با استفاده از دستور `make` اجرا می‌شود که کارهای زیر را انجام می‌دهد:

- سایت را می‌سازد و HTML خروجی را در دایرکتوری `/public` مخزن محلی `kubernetes/website` شما تولید می‌کند
- فایل ایمیج داکر `wdjp/htmltest` را دریافت می‌کند
- مخزن محلی `kubernetes/website` شما را روی ایمیج داکر نصب می‌کند
- فایل‌های تولید شده در دایرکتوری `/public` را بررسی می‌کند و در صورت مواجهه با پیوند ‌های داخلی خراب، خروجی خط فرمان ارائه می‌دهد

## چه چیزهایی را بررسی می‌کند و چه چیزهایی را بررسی نمی‌کند

بررسی‌کننده‌ی پیوند، فایل‌های HTML تولید شده را بررسی می‌کند، نه فایل‌های Markdown خام.

ابزار htmltest برای تعیین اینکه کدام محتوا را بررسی کند، به یک فایل پیکربندی، [`.htmltest.yml`](https://git.k8s.io/website/.htmltest.yml)، وابسته است

بررسی‌کننده پیوند موارد زیر را اسکن می‌کند:

- تمام محتوای تولید شده از Markdown در دایرکتوری [`/content/en/docs`](https://git.k8s.io/website/content/en/docs/) به استثنای:
  - مراجع API تولید شده، به عنوان مثال
https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18
- تمام پیوندهای داخلی، به جز:
  - هش‌های خالی (`<a href="#">` یا `[title](#)`) و hrefهای خالی (`<a href="">` یا `[title]()`)
  - پیوند ‌های داخلی به تصاویر و سایر فایل‌های رسانه‌ای

بررسی‌کننده پیوند موارد زیر را اسکن نمی‌کند:
- پیوندهای موجود در نوارهای ناوبری بالا و کناری، پیوندهای پاورقی یا پیوندهای موجود در بخش `<head>` صفحه، مانند پیوندهایی به شیوه‌نامه‌های CSS، اسکریپت‌ها و اطلاعات متا
- صفحات سطح بالا و فرزندان آنها، برای مثال: `/training`، `/community`، `/case-studies/adidas`
- پست های تارنگار
- مستندات مرجع API، به عنوان مثال
https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18
- Localizations

## پیش نیازها و نصب

موارد نصبی : 

* [Docker](https://docs.docker.com/get-docker/)
* [make](https://www.gnu.org/software/make/)

## اجرای بررسی‌کننده پیوند

برای اجرای بررسی‌کننده پیوند:

1. به دایرکتوری ریشه مخزن محلی `kubernetes/website` خود بروید.

2. دستور زیر را اجرا کنید:

   ```shell
   make container-internal-linkcheck
   ```

## درک خروجی

اگر بررسی‌کننده پیوند، پیوندهای خراب را پیدا کند، خروجی مشابه زیر خواهد بود:
```
tasks/access-kubernetes-api/custom-resources/index.html
  hash does not exist --- tasks/access-kubernetes-api/custom-resources/index.html --> #preserving-unknown-fields
  hash does not exist --- tasks/access-kubernetes-api/custom-resources/index.html --> #preserving-unknown-fields
```

این یک مجموعه از پیوند های خراب است. گزارش برای هر صفحه با پیوند‌های خراب، یک خروجی اضافه می‌کند.

در این خروجی، فایلی که پیوند ‌های خراب دارد، `tasks/access-kubernetes-api/custom-resources.md` است..

این ابزار دلیلش را این گونه بیان می‌کند: «هش وجود ندارد». در بیشتر موارد، می‌توانید این دلیل را نادیده بگیرید.
پیوند اینترنتی  مورد نظر `#preserving-unknown-fields` است.

یک راه برای رفع این مشکل این است که:

1. به فایل Markdown با پیوند خراب بروید.
1. با استفاده از یک ویرایشگر متن، یک جستجوی متن کامل (معمولاً Ctrl+F یا Command+F) برای URL پیوند خراب، `#preserving-unknown-fields` انجام دهید.
1. پیوند را اصلاح کنید. برای پیوند خراب هش صفحه (یا _anchor_)، بررسی کنید که آیا موضوع تغییر نام داده شده یا حذف شده است.

برای اطمینان از رفع پیوند‌های خراب، htmltest را اجرا کنید.