---
title: رابط مجری کانتینر (CRI)
id: cri
date: 2021-11-24
full_link: /docs/concepts/architecture/cri
short_description: >
  پروتکلی برای ارتباط بین kubelet و مجری کانتینر محلی.

aka: ["CRI"]
tags:
  - fundamental
---

پروتکل اصلی برای ارتباط بین {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} و مجری کانتینر.

<!--more-->

رابط مجری کانتینر کوبرنتیز (CRI) پروتکل اصلی gRPC(https://grpc.io) را برای ارتباط بین اجزای گره(node) (/docs/concepts/architecture/#node-components) تعریف می‌کند. {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} و {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}.
