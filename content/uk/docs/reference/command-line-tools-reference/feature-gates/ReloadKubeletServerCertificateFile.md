---
title: ReloadKubeletServerCertificateFile
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"

---

Дозволяє TLS-серверу kubelet оновлювати свій сертифікат, якщо вказаний файл сертифіката змінено.

Ця функція корисна при вказівці `tlsCertFile` і `tlsPrivateKeyFile` в конфігурації kubelet. Функція gate не впливає на інші випадки, такі як використання TLS bootstrap.
