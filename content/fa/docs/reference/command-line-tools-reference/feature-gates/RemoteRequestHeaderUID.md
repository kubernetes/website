---
title: RemoteRequestHeaderUID
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.32"
---
سرور API را قادر می‌سازد تا UIDها (شناسه‌های کاربری) را از طریق احراز هویت هدر درخواست بپذیرد.
این امر همچنین باعث می‌شود که تجمیع‌کننده API مربوط به `kube-apiserver` هنگام ارسال درخواست‌ها به سرورهایی که API تجمیع‌شده را ارائه می‌دهند، UIDها را از طریق هدرهای استاندارد اضافه کند.