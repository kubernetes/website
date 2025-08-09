---
title: رابط زمان اجرای کانتینر (CRI)
id: cri
date: 2021-11-24
full_link: /docs/concepts/architecture/cri
short_description: >
  پروتکلی برای ارتباط بین kubelet و محیط اجرایی کانتینر محلی.

aka:
tags:
  - fundamental
---

پروتکل اصلی برای ارتباط بین {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} و زمان‌اجرای کانتینر.

<!--more-->

رابط زمان‌اجرای کانتینر کوبرنتس (CRI) پروتکل اصلی [gRPC](https://grpc.io) را برای ارتباط بین {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} و {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}، از جمله [کامپوننت‌های Node](/docs/concepts/architecture/#node-components)، تعریف می‌کند.

