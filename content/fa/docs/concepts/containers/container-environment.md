---
reviewers:
- xirehat
title: محیط کانتینر
content_type: concept
weight: 20
---

<!-- overview -->

این صفحه منابع موجود برای کانتینرها در محیط کانتینر را شرح می‌دهد.




<!-- body -->

## محیط کانتینر

محیط کانتینر در کوبرنتیز چند منبع مهم را در اختیار کانتینرها قرار می‌دهد:

* یک فایل‌سیستم، که ترکیبی از یک [ایمیج](/docs/concepts/containers/images/) و یک یا چند [ولوم](/docs/concepts/storage/volumes/) است.  
* اطلاعات مربوط به خود کانتینر.  
* اطلاعات درباره سایر اشیاء در خوشه.  

### اطلاعات کانتینر

*نام میزبان* (hostname) یک کانتینر، همان نام پادی است که کانتینر در آن اجرا می‌شود.  
این مقدار از طریق فرمان `hostname` یا فراخوانی تابع  
[`gethostname`](https://man7.org/linux/man-pages/man2/gethostname.2.html)  
در libc در دسترس است.

نام پاد و فضای نام (namespace) به‌صورت متغیرهای محیطی از طریق  
[API پایین‌رو](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)  
در دسترس کانتینر قرار می‌گیرند.

متغیرهای محیطی تعریف‌شده توسط کاربر در تعریف پاد نیز برای کانتینر قابل دسترسی هستند،  
و همچنین هر متغیر محیطی که به‌طور ایستا در ایمیج کانتینر مشخص شده باشد.

### اطلاعات خوشه

لیستی از تمامی سرویس‌هایی که هنگام ایجاد یک کانتینر در حال اجرا بودند، به‌صورت متغیرهای محیطی در اختیار آن کانتینر قرار می‌گیرد.  
این لیست محدود به سرویس‌های درون همان فضای نام (namespace) پاد کانتینر جدید و سرویس‌های صفحه کنترل کوبرنتیز است.

برای سرویسی به نام *foo* که به کانتینری به نام *bar* نگاشت می‌شود،  
متغیرهای زیر تعریف می‌شوند:

```shell
FOO_SERVICE_HOST=<the host the service is running on>
FOO_SERVICE_PORT=<the port the service is running on>
```

سرویس‌ها دارای آدرس‌های IP اختصاصی هستند و در صورت فعال بودن [افزونه DNS](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/)، از طریق DNS برای کانتینر قابل دسترسی‌اند. 



## {{% heading "whatsnext" %}}


* برای آشنایی بیشتر با [قلاب‌های چرخه عمر کانتینر](/docs/concepts/containers/container-lifecycle-hooks/) مطالعه کنید.  
* تجربه عملی کسب کنید و با [اضافه کردن هندلر به رویدادهای چرخه عمر کانتینر](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/) کار کنید.


