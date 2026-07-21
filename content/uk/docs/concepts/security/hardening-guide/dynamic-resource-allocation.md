---
title: "Посібник із зміцнення безпеки — динамічний розподіл ресурсів"
description: >
  Інформація про зміцнення безпеки авторизації та шаблонів доступу для динамічного розподілу ресурсів (DRA).
content_type: concept
weight: 90
---

<!-- overview -->

Dynamic Resource Allocation (DRA) додає потужні можливості планування та управління пристроями. Оскільки компоненти DRA оновлюють статус `ResourceClaim`, адміністратори кластера повинні налаштувати авторизацію для цих оновлень з явним RBAC з мінімальними привілеями.

{{< feature-state feature_gate_name="DRAResourceClaimGranularStatusAuthorization" >}}

Починаючи з Kubernetes v1.36, оновлення статусу DRA використовують синтетичні субресурси і, в деяких випадках, спеціалізовані вузлово-орієнтовані дієслова.

<!-- body -->

## Зміцнення дозволів на оновлення статусу DRA {#harden-dra-status-update-permissions}

Для оновлень статусу DRA, крім надання дозволів на `update` для субресурсу `resourceclaims/status`, адміністратори кластера повинні надавати дозволи на конкретні "синтетичні" субресурси на основі точних полів, які компонент потребує змінити. Це забезпечує принцип мінімальних привілеїв між планувальником, власними контролерами, та драйверами DRA.

Перевірки авторизації DRA поділяються на два синтетичні субресурси:

- **`resourceclaims/binding`**
  - Потрібно для зміни `status.allocation` та `status.reservedFor`.
  - Зазвичай надається kube-scheduler та власним контролерам розподілу.
  - Використовує стандартні дієслова `update` та `patch`.
- **`resourceclaims/driver`**
  - Потрібно для зміни `status.devices`.
  - Перевірка виконується для кожного драйвера, щоб запобігти втручанню драйверів у пристрої на різних вузлах та/або від інших драйверів.
  - Використовує вузлово-орієнтовані дієслова для більш суворого обсягу.

## Вузлово-орієнтовані дієслова DRA {#node-aware-dra-verbs}

При авторизації оновлень `resourceclaims/driver` використовуйте відповідний спеціалізований префікс дієслова:

- **`associated-node:<verb>`** (наприклад, `associated-node:update`)
  - Для драйверів, локальних для вузла.
  - API-сервер перевіряє асоціацію вузла для драйвера, що робить запит.
- **`arbitrary-node:<verb>`** (наприклад, `arbitrary-node:patch`)
  - Для контролерів контрольної площини або багатовузлових контролерів, які можуть оновлювати заявки з будь-якого вузла.

## Приклади RBAC-шаблонів {#example-rbac-patterns}

### Дозволи для планувальника та контролера розподілу {#scheduler-and-allocation-controller-permissions}

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

### Дозволи для вузлових DRA драйверів {#node-local-dra-driver-permissions}

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

## Повʼязані завдання адміністратора кластера {#related-cluster-administrator-task}

Щоб застосувати ці шаблони в працюючому кластері, дивіться [Посилення безпеки динамічного розподілу ресурсів у вашому кластері](/docs/tasks/administer-cluster/hardening-dra/).

## {{% heading "whatsnext" %}}

- [Авторизація](/docs/reference/access-authn-authz/authorization/)
- [Налаштування DRA в кластері](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)
- [Динамічне виділення ресурсів](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
