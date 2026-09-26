---
title: رابط محیط اجرای کانتینر (CRI)
id: cri
full_link: /docs/concepts/architecture/cri
short_description: >
  پروتکلی برای ارتباط بین kubelet و محیط اجرای کانتینر محلی.

aka: ["CRI"]
tags:
  - fundamental
---

پروتکل اصلی برای ارتباط بین {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} و محیط اجرای کانتینر.

<!--more-->

رابط محیط اجرای کانتینر کوبرنتیز (CRI) پروتکل اصلی [gRPC](https://grpc.io) را برای ارتباط بین [گره‌ها (Node)](/docs/concepts/architecture/#node-components) تعریف می‌کند: {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} و {{< glossary_tooltip text="محیط اجرای کانتینر" term_id="container-runtime" >}}.
