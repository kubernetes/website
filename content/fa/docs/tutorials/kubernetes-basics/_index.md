---
title: یادگیری مبانی کوبرنتیز
main_menu: true
no_list: true
weight: 20
content_type: concept
card:
  name: tutorials
  weight: 20
  title: مرور گام‌به‌گام مبانی
---

## {{% heading "objectives" %}}

این آموزش شما را گام‌به‌گام با مبانی سیستم هماهنگ‌سازی کلاستر کوبرنتیز آشنا می‌کند.
هر ماژول شامل اطلاعات پیش‌زمینه درباره ویژگی‌ها و مفاهیم اصلی کوبرنتیز
و یک آموزش عملی است که می‌توانید همراه با آن پیش بروید.

با این آموزش‌ها یاد می‌گیرید چگونه:

* یک برنامه کانتینری‌شده را روی کلاستر مستقر کنید.
* مقیاس Deployment را تغییر دهید.
* برنامه کانتینری‌شده را با نسخه جدیدی از نرم‌افزار به‌روزرسانی کنید.
* برنامه کانتینری‌شده را اشکال‌زدایی کنید.

## کوبرنتیز چه کاری برای شما انجام می‌دهد؟ {#what-can-kubernetes-do-for-you}

در سرویس‌های وب مدرن، کاربران انتظار دارند برنامه‌ها به‌صورت شبانه‌روزی در دسترس باشند و توسعه‌دهندگان
انتظار دارند بتوانند نسخه‌های جدید این برنامه‌ها را چند بار در روز مستقر کنند. کانتینرسازی
به بسته‌بندی نرم‌افزار برای رسیدن به این اهداف کمک می‌کند و امکان انتشار و به‌روزرسانی برنامه‌ها را
بدون توقف سرویس فراهم می‌کند. کوبرنتیز کمک می‌کند مطمئن شوید این برنامه‌های کانتینری‌شده
هر جا و هر زمان که می‌خواهید اجرا می‌شوند و به آن‌ها کمک می‌کند منابع و ابزارهای لازم برای کارشان را پیدا کنند.
کوبرنتیز یک پلتفرم متن‌باز و آماده برای محیط عملیاتی است که بر پایه تجربه انباشته گوگل
در هماهنگ‌سازی کانتینرها و همراه با بهترین ایده‌های جامعه طراحی شده است.

## ماژول‌های مبانی کوبرنتیز {#kubernetes-basics-modules}

<!-- For translators, translate only the values of the ‘alt’ and ‘title’ keys -->
{{< tutorials/modules >}}
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_01.svg?v=1469803628347"
      alt="ماژول ۱"
      title="۱. ساخت یک کلاستر کوبرنتیز" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_02.svg?v=1469803628347"
      alt="ماژول ۲"
      title="۲. استقرار یک برنامه" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/explore/explore-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_03.svg?v=1469803628347"
      alt="ماژول ۳"
      title="۳. بررسی برنامه" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/expose/expose-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_04.svg?v=1469803628347"
      alt="ماژول ۴"
      title="۴. در دسترس عموم قرار دادن برنامه" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/scale/scale-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_05.svg?v=1469803628347"
      alt="ماژول ۵"
      title="۵. افزایش مقیاس برنامه" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/update/update-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_06.svg?v=1469803628347"
      alt="ماژول ۶"
      title="۶. به‌روزرسانی برنامه" >}}
{{< /tutorials/modules >}}

## {{% heading "whatsnext" %}}

* برای آشنایی بیشتر با کلاسترهای تمرینی و نحوه اجرای کلاستر خودتان، صفحه [محیط یادگیری](/docs/setup/learning-environment/) را ببینید.
* آموزش [استفاده از Minikube برای ساخت کلاستر](/docs/tutorials/kubernetes-basics/create-cluster/)
