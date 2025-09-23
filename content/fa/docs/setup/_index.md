---
#reviewers:
#- brendandburns
#- erictune
#- mikedanese
title: شروع کنید
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: محیط یادگیری
  - anchor: "#production-environment"
    title: محیط عملیاتی  
---

<!-- overview -->

این بخش روش‌های مختلف راه‌اندازی و اجرای کوبرنتیز را فهرست می‌کند.
هنگام نصب کوبرنتیز، نوع نصب را بر اساس موارد زیر انتخاب کنید: سهولت نگهداری، امنیت، کنترل، منابع موجود و تخصص مورد نیاز برای راه‌اندازی و مدیریت یک خوشه (cluster).

می‌توانید با [دانلود کوبرنتیز](/releases/download/) یک خوشه کوبرنتیز را روی ماشین محلی، در فضای ابری یا در مرکز داده خودتان مستقر کنید.

چندین [مؤلفه کوبرنتیز](/docs/concepts/overview/components/) مانند {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} یا {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} نیز می‌توانند به‌صورت [ایمیج کانتینر](/releases/download/#container-images) در داخل خوشه مستقر شوند.

**توصیه می‌شود** هرجا امکان‌پذیر است، مؤلفه‌های کوبرنتیز را به‌شکل ایمیج‌های کانتینری اجرا کرده و مدیریت آن‌ها را به خود کوبرنتیز بسپارید.  
مؤلفه‌هایی که کانتینرها را اجرا می‌کنند—به‌ویژه kubelet—در این دسته قرار نمی‌گیرند.

اگر نمی‌خواهید خودتان یک خوشه کوبرنتیز را مدیریت کنید، می‌توانید یک سرویس مدیریت‌شده، از جمله [بسترهای تأییدشده](/docs/setup/production-environment/turnkey-solutions/) را انتخاب کنید.  
همچنین راهکارهای استاندارد و سفارشی دیگری در طیف گسترده‌ای از محیط‌های ابری و سرورهای فیزیکی (bare metal) وجود دارد.

<!-- body -->

## محیط یادگیری {#learning-environment}

اگر در حال یادگیری کوبرنتیز هستید، از ابزارهای پشتیبانی شده توسط جامعه کوبرنتیز یا ابزارهای موجود در بوم‌سازگان برای راه‌اندازی یک خوشه کوبرنتیز روی یک دستگاه محلی استفاده کنید. به [نصب ابزارها](/docs/tasks/tools/) مراجعه کنید.

## محیط عملیاتی {#production-environment}

هنگام ارزیابی یک راهکار برای یک
[محیط عملیاتی](/docs/setup/production-environment/)، در نظر بگیرید کدام جنبه‌های
عملیاتی یک خوشه کوبرنتیز را می‌خواهید خودتان مدیریت کنید و
کدام‌ها را ترجیح می‌دهید به یک ارائه‌دهنده بسپارید.

برای خوشه‌ای که خودتان مدیریت می‌کنید، ابزار رسمیِ پشتیبانی‌شده برای استقرار
کوبرنتیز، [kubeadm](/docs/setup/production-environment/tools/kubeadm/) است.

## {{% heading "whatsnext" %}}

- [دانلود کوبرنتیز](/releases/download/)
- ابزارها را دانلود کرده و [نصب کنید](/docs/tasks/tools/) از جمله `kubectl`
- برای خوشه جدید خود یک [برنامه مجری کانتینر](/docs/setup/production-environment/container-runtimes/) انتخاب کنید
- درباره [بهترین شیوه‌ها](/docs/setup/best-practices/) برای راه‌اندازی خوشه بیاموزید

کوبرنتیز طوری طراحی شده است که {{< glossary_tooltip term_id="control-plane" text="Control Plane" >}} آن روی لینوکس اجرا شود. درون خوشه خود می‌توانید برنامه‌ها را روی لینوکس یا سیستم عامل های دیگر، از جمله ویندوز، اجرا کنید.

- نحوه [راه‌اندازی خوشه با گره‌های(Node) ویندوز](/docs/concepts/windows/) را بیاموزید
