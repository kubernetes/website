---
title: Управління доступом до API Kubernetes
weight: 30
no_list: true
---

Для ознайомлення з концепціями, як Kubernetes реалізує та контролює доступ до API, прочитайте [Керування доступом до API Kubernetes](/uk/docs/concepts/security/controlling-access/).

Довідники:

- [Автентифікація](/uk/docs/reference/access-authn-authz/authentication/)
   - [Автентифікація за допомогою Bootstrap-токенів](/uk/docs/reference/access-authn-authz/bootstrap-tokens/)
- [Контролери допуску](/uk/docs/reference/access-authn-authz/admission-controllers/)
   - [Динамічний контроль допуску](/uk/docs/reference/access-authn-authz/extensible-admission-controllers/)
- [Авторизація](/uk/docs/reference/access-authn-authz/authorization/)
   - [Контроль доступу на основі ролей](/uk/docs/reference/access-authn-authz/rbac/)
   - [Контроль доступу на основі атрибутів](/uk/docs/reference/access-authn-authz/abac/)
   - [Авторизація вузла](/uk/docs/reference/access-authn-authz/node/)
   - [Авторизація за допомогою вебхуків](/uk/docs/reference/access-authn-authz/webhook/)
- [Запити на підпис сертифікатів](/uk/docs/reference/access-authn-authz/certificate-signing-requests/)
   - включаючи [Схвалення запиту на підпис сертифіката](/uk/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection) та [підпис сертифіката](/uk/docs/reference/access-authn-authz/certificate-signing-requests/#signing)
- Службові облікові записи
  - [Посібник розробника](/uk/docs/tasks/configure-pod-container/configure-service-account/)
  - [Адміністрування](/uk/docs/reference/access-authn-authz/service-accounts-admin/)
- [Автентифікація та авторизація Kubelet](/uk/docs/reference/access-authn-authz/kubelet-authn-authz/)
  - включаючи [TLS bootstrapping](/uk/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
