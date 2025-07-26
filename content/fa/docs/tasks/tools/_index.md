---
title: "نصب ابزارها"
description: ابزارهای کوبرنتیز را روی رایانه خود تنظیم کنید.
weight: 10
no_list: true
card:
  name: tasks
  weight: 20
  anchors:
  - anchor: "#kubectl"
    title: Install kubectl
---

## kubectl

<!-- overview -->
ابزار خط فرمان کوبرنتیز، [kubectl](/docs/reference/kubectl/kubectl/)، به شما امکان می‌دهد دستوراتی را در خوشه های کوبرنتیز اجرا کنید. می‌توانید از kubectl برای استقرار برنامه‌ها، بازرسی و مدیریت منابع خوشه و مشاهده گزارش‌ها استفاده کنید. برای اطلاعات بیشتر، از جمله لیست کاملی از عملیات kubectl، به مستندات مرجع [`kubectl`](/docs/reference/kubectl/) مراجعه کنید.

kubectl روی انواع بسترهای لینوکس، macOS و ویندوز قابل نصب است. سیستم عامل مورد نظر خود را در زیر بیابید.

- [نصب kubectl در لینوکس](/docs/tasks/tools/install-kubectl-linux)
- [نصب kubectl روی macOS](/docs/tasks/tools/install-kubectl-macos)
- [نصب kubectl روی ویندوز](/docs/tasks/tools/install-kubectl-windows)

## kind

[`kind`](https://kind.sigs.k8s.io/) به شما امکان می‌دهد کوبرنتیز را روی رایانه محلی خود اجرا کنید. این ابزار مستلزم آن است که شما [Docker](https://www.docker.com/) یا [Podman](https://podman.io/) را نصب کرده باشید.

صفحه [شروع سریع](https://kind.sigs.k8s.io/docs/user/quick-start/) kind به شما نشان می‌دهد که برای شروع و راه‌اندازی kind چه کارهایی باید انجام دهید.

<a class="btn btn-primary" href="https://kind.sigs.k8s.io/docs/user/quick-start/" role="button" aria-label="View kind Quick Start Guide">View kind Quick Start Guide</a>

## minikube

مانند `kind`، [`minikube`](https://minikube.sigs.k8s.io/) ابزاری است که به شما امکان می‌دهد کوبرنتیز را به صورت محلی اجرا کنید. `minikube` یک خوشه کوبرنتیز محلی چند گره‌ای یا چند منظوره را روی رایانه شخصی شما (از جمله رایانه‌های شخصی ویندوز، macOS و لینوکس) اجرا می‌کند تا بتوانید کوبرنتیز را امتحان کنید یا برای کارهای توسعه روزانه از آن استفاده کنید.

اگر تمرکز شما روی نصب ابزار است، می‌توانید راهنمای رسمی [شروع کنید!](https://minikube.sigs.k8s.io/docs/start/) را دنبال کنید.

<a class="btn btn-primary" href="https://minikube.sigs.k8s.io/docs/start/" role="button" aria-label="View minikube Get Started! Guide">View minikube Get Started! Guide</a>

وقتی «minikube» را راه‌اندازی کردید، می‌توانید از آن برای [اجرای یک برنامه نمونه](/docs/tutorials/hello-minikube/) استفاده کنید.

## kubeadm

شما می‌توانید از ابزار {{< glossary_tooltip term_id="kubeadm" text="kubeadm" >}} برای ایجاد و مدیریت خوشه های کوبرنتیز استفاده کنید. این ابزار اقدامات لازم برای راه‌اندازی و اجرای حداقل یک خوشه امن و قابل اعتماد را به روشی کاربرپسند انجام می‌دهد.

[نصب kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) نحوه نصب kubeadm را به شما نشان می‌دهد. پس از نصب، می‌توانید از آن برای [ایجاد یک خوشه](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) استفاده کنید.

<a class="btn btn-primary" href="/docs/setup/production-environment/tools/kubeadm/install-kubeadm/" role="button" aria-label="View kubeadm Install Guide">View kubeadm Install Guide</a>
