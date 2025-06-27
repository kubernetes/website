---
title: دست به کار شوید
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: محیط آموزشی
  - anchor: "#production-environment"
    title: محیط عملیاتی  
---

<!-- overview -->

این بخش روش‌های مختلف راه‌اندازی و اجرای کوبرنتیز را شامل می شود.
هنگام نصب کوبرنتیز، نوع نصب را بر اساس: سهولت نگهداری، امنیت، کنترل، منابع موجود و تخصص لازم برای راه‌اندازی و مدیریت یک کلاستر انتخاب کنید.


شما می‌توانید با [دانلود کوبرنتیز](/releases/download/) یک کلاستر را روی ماشین محلی، در ابر، یا برای دیتاسنتر خود راه‌اندازی کنید.

Several [Kubernetes components](/docs/concepts/overview/components/) such as {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} or {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} can also be
deployed as [container images](/releases/download/#container-images) within the cluster.

It is **recommended** to run Kubernetes components as container images wherever
that is possible, and to have Kubernetes manage those components.
Components that run containers - notably, the kubelet - can't be included in this category.

If you don't want to manage a Kubernetes cluster yourself, you could pick a managed service, including
[certified platforms](/docs/setup/production-environment/turnkey-solutions/).
There are also other standardized and custom solutions across a wide range of cloud and
bare metal environments.

<!-- body -->

## محیط آموزشی

اگر در حال یادگیری کوبرنتیز هستید، از ابزارهایی استفاده کنید که توسط جامعه کوبرنتیز پشتیبانی می‌شوند یا از ابزارهای موجود در اکوسیستم برای راه‌اندازی یک کلاستر کوبرنتیز روی یک ماشین محلی بهره ببرید.
بازدید از صفحه [نصب ابزارها](/docs/tasks/tools/).

## محیط عملیاتی

هنگام ارزیابی یک راه‌حل برای [محیط عملیاتی](/docs/setup/production-environment/) هستید، در نظر بگیرید که کدام جنبه‌های مدیریت یک کلاستر کوبرنتیز را می‌خواهید خودتان مدیریت کنید و کدام بخش‌ها را ترجیح می‌دهید به یک ارائه‌دهنده سرویس رایانش ابری واگذار کنید.


نرم افزاری که ما رسما پشتیبانی میکنیم برای کلاستر هایی که خودتان می خواهید مدیریت کنید [کیوب ادم](/docs/setup/production-environment/tools/kubeadm/) (kubeadm) است.

## {{% heading "whatsnext" %}}

- [دانلود کوبرنتیز](/releases/download/)
- [دانلود](/docs/tasks/tools/) و نصب `kubectl` و ابزارهای مشابه
- انتخاب یک [محیط اجرای کانتینری](/docs/setup/production-environment/container-runtimes/) برای کلاستر شما
- یادگیری [بهترین روش ها](/docs/setup/best-practices/) برای پیکربندی یک کلاستر


طراحی کوبرنتیز به صورتی است که پنل مدیریتی آن تنها بر روی لینوکس اجرا می شود. اما کلاستر شما می تواند از نود های تشکیل شوند که سیستم عامل های گوناگونی دارند و به شما این امکان را بدهند تا برنامه های خود را بر روی سیستم عامل های دیگر همانند ویندوز هم اجرا کنید.

- یادگیری نحوه راه اندازی نود های [ویندوزی](/docs/concepts/windows/)
