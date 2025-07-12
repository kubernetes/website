---
title: Управління доступом до API Kubernetes
weight: 30
no_list: true
---

Для ознайомлення з концепціями, як Kubernetes реалізує та контролює доступ до API, прочитайте [Керування доступом до API Kubernetes](/docs/concepts/security/controlling-access/).

Довідники:

- [Автентифікація](/docs/reference/access-authn-authz/authentication/)
   - [Автентифікація за допомогою Bootstrap-токенів](/docs/reference/access-authn-authz/bootstrap-tokens/)
- [Контролери допуску](/docs/reference/access-authn-authz/admission-controllers/)
   - [Динамічний контроль допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/)
- [Авторизація](/docs/reference/access-authn-authz/authorization/)
   - [Контроль доступу на основі ролей](/docs/reference/access-authn-authz/rbac/)
   - [Контроль доступу на основі атрибутів](/docs/reference/access-authn-authz/abac/)
   - [Авторизація вузла](/docs/reference/access-authn-authz/node/)
   - [Авторизація за допомогою вебхуків](/docs/reference/access-authn-authz/webhook/)
- [Запити на підпис сертифікатів](/docs/reference/access-authn-authz/certificate-signing-requests/)
   - включаючи [Схвалення запиту на підпис сертифіката](/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection) та [підпис сертифіката](/docs/reference/access-authn-authz/certificate-signing-requests/#signing)
- Службові облікові записи
  - [Посібник розробника](/docs/tasks/configure-pod-container/configure-service-account/)
  - [Адміністрування](/docs/reference/access-authn-authz/service-accounts-admin/)
- [Автентифікація та авторизація Kubelet](/docs/reference/access-authn-authz/kubelet-authn-authz/)
  - включаючи [TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
