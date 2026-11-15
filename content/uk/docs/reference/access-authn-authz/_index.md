---
title: Керування доступом до API
weight: 30
no_list: true
---

Вступ до того, як Kubernetes реалізує доступ до API та керує ним, дивіться в [Контроль доступу до API Kubernetes](/docs/concepts/security/controlling-access/).

Довідкова документація:

- [Автентифікація](/docs/reference/access-authn-authz/authentication/)
  - [Автентифікація за допомогою Bootstrap-токенів](/docs/reference/access-authn-authz/bootstrap-tokens/)
- [Контролери допуску](/docs/reference/access-authn-authz/admission-controllers/)
  - [Динамічний контроль допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/)
  - [Контроль допуску на основі маніфесту](/docs/reference/access-authn-authz/manifest-admission-control/)
- [Авторизація](/docs/reference/access-authn-authz/authorization/)
  - [Контроль доступу на основі ролей](/docs/reference/access-authn-authz/rbac/)
  - [Контроль доступу на основі атрибутів](/docs/reference/access-authn-authz/abac/)
  - [Авторизація вузлів](/docs/reference/access-authn-authz/node/)
  - [Авторизація за допомогою вебхуків](/docs/reference/access-authn-authz/webhook/)
- [Запити на підпис сертифікатів](/docs/reference/access-authn-authz/certificate-signing-requests/)
  - включно зі [схваленням CSR](/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection) та [підписуванням сертифікатів](/docs/reference/access-authn-authz/certificate-signing-requests/#signing)
- Службові облікові записи
  - [Посібник розробника](/docs/tasks/configure-pod-container/configure-service-account/)
  - [Адміністрування](/docs/reference/access-authn-authz/service-accounts-admin/)
- [Автентифікація та авторизація kubelet](/docs/reference/access-authn-authz/kubelet-authn-authz/)
  - включно з [TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/) kubelet
