---
title: "Посібник зі зміцнення безпеки — динамічне виділення ресурсів"
description: >
  Інформація про зміцнення безпеки авторизації та шаблонів доступу для динамічного виділення ресурсів (DRA).
content_type: concept
weight: 90
---

<!-- overview -->

Динамічне виділення ресурсів (DRA) додає потужні можливості планування та керування пристроями. Оскільки компоненти DRA оновлюють статус `ResourceClaim`, адміністратори кластера мають налаштувати авторизацію цих оновлень за допомогою явного RBAC з мінімальними привілеями.

{{< feature-state feature_gate_name="DRAResourceClaimGranularStatusAuthorization" >}}

Починаючи з Kubernetes v1.36, оновлення статусу DRA використовують синтетичні субресурси та, в деяких випадках, спеціалізовані дієслова з урахуванням вузла.

<!-- body -->

## Зміцнення дозволів на оновлення статусу DRA {#harden-dra-status-update-permissions}

Для оновлень статусу DRA, окрім надання дозволів `update` на субресурс `resourceclaims/status`, адміністратори кластера мають надавати дозволи на конкретні «синтетичні» субресурси залежно від того, які саме поля потрібно змінювати компоненту. Це застосовує принцип мінімальних привілеїв до планувальника, власних контролерів і драйверів DRA.

Перевірки авторизації DRA поділяються на два синтетичні субресурси:

- **`resourceclaims/binding`**
  - Потрібно для зміни `status.allocation` та `status.reservedFor`.
  - Зазвичай надається kube-scheduler та власним контролерам виділення.
  - Використовує стандартні дієслова `update` та `patch`.
- **`resourceclaims/driver`**
  - Потрібно для зміни `status.devices`.
  - Перевірка виконується для кожного драйвера, щоб запобігти втручанню драйверів у пристрої на різних вузлах та/або від інших драйверів.
  - Використовує дієслова з урахуванням вузла для суворішої області дії.

## Дієслова DRA з урахуванням вузла {#node-aware-dra-verbs}

Під час авторизації оновлень `resourceclaims/driver` використовуйте відповідний спеціалізований префікс дієслова:

- **`associated-node:<verb>`** (наприклад, `associated-node:update`)
  - Для драйверів, локальних для вузла.
  - API-сервер перевіряє звʼязок драйвера, що надсилає запит, із вузлом.
- **`arbitrary-node:<verb>`** (наприклад, `arbitrary-node:patch`)
  - Для контролерів панелі управління або багатовузлових контролерів, які можуть оновлювати заявки з будь-якого вузла.

## Приклади RBAC-шаблонів {#example-rbac-patterns}

### Дозволи для планувальника та контролера виділення {#scheduler-and-allocation-controller-permissions}

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: dra-binding-updater
rules:
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/status"]
    verbs: ["get", "patch", "update"]
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/binding"]
    verbs: ["patch", "update"]
```

### Дозволи для локальних на вузлі драйверів DRA {#node-local-dra-driver-permissions}

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: dra-node-driver-status-updater
rules:
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/status"]
    verbs: ["get", "patch", "update"]
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/driver"]
    verbs: ["associated-node:patch", "associated-node:update"]
    resourceNames: ["dra.example.com"]
```

### Дозволи для багатовузлового контролера статусу {#multi-node-status-controller-permissions}

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: dra-multinode-status-updater
rules:
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/status"]
    verbs: ["get", "patch", "update"]
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/driver"]
    verbs: ["arbitrary-node:patch", "arbitrary-node:update"]
    resourceNames: ["dra.example.com"]
```

## Повʼязане завдання адміністратора кластера {#related-cluster-administrator-task}

Щоб застосувати ці шаблони в запущеному кластері, дивіться [Зміцнення безпеки динамічного виділення ресурсів у вашому кластері](/docs/tasks/administer-cluster/hardening-dra/).

## {{% heading "whatsnext" %}} {#whats-next}

- [Авторизація](/docs/reference/access-authn-authz/authorization/)
- [Налаштування DRA в кластері](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)
- [Динамічне виділення ресурсів](/docs/concepts/resource-management/dynamic-resource-allocation/)
