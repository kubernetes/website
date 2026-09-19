---
title: Посилення безпеки динамічного розподілу ресурсів у вашому кластері
content_type: task
weight: 330
---

<!-- overview -->

Ця сторінка показує адміністраторам кластера, як зміцнити авторизацію для Динамічного Розподілу Ресурсів (DRA), з акцентом на доступ з мінімальними привілеями для оновлень статусу `ResourceClaim`.

<!-- prerequisites -->

## {{% heading "prerequisites" %}}

- {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
- У вашому кластері налаштовано Динамічний Розподіл Ресурсів (DRA).
- Ви можете редагувати ресурси RBAC та перезапускати або розгортати компоненти DRA.

<!-- steps -->

## Визначте компоненти DRA, які оновлюють статус {#identify-dra-components-that-write-status}

Визначте, які ідентичності (зазвичай ServiceAccounts) оновлюють статус ResourceClaim у вашому кластері. Типовими є:

- kube-scheduler або власний контролер розподілу
- драйвери DRA на вузлах
- багатовузлові контролери статусу DRA

## Надання мінімально необхідних дозволів для синтетичних субресурсів {#grant-least-privilege-permissions-for-synthetic-subresources}

Починаючи з Kubernetes v1.36, оновлення статусу DRA вимагають дозволів на синтетичні субресурси на додаток до `resourceclaims/status`.

### Надання дозволів для планувальника та контролера розподілу {#grant-scheduler-and-allocation-controller-permissions}

Застосуйте роль, яка дозволяє оновлення, повʼязані з привʼязкою:

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

### Надання дозволів для вузлових DRA драйверів {#grant-node-local-dra-driver-permissions}

Використовуйте вузлово-орієнтовані дієслова для драйверів, локальних для вузла:

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

### Надання дозволів для багатовузлового контролера лише за потреби {#grant-multi-node-controller-permissions-only-when-needed}

Використовуйте `arbitrary-node:*` лише для компонентів, які повинні оновлювати статус з будь-якого вузла:

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

## Привʼязка ролей до конкретних ідентичностей {#bind-roles-to-explicit-identities}

Створіть обʼєкти `ClusterRoleBinding` для кожної ідентичності компонента та уникайте спільного використання широкої ролі між несумісними компонентами DRA.

Обмежте правила `resourceclaims/driver` за допомогою `resourceNames`, де це можливо, щоб ідентичність могла оновлювати статус лише для конкретного драйвера DRA, яким вона керує.

## Перевірка та моніторинг {#validate-and-monitor}

1. Перевірте, що кожна ідентичність має лише необхідні дієслова та субресурси.
1. Підтвердіть, що оновлення статусу DRA працюють після розгортання.
1. Спостерігайте за подіями аудиту API-сервера для відхилених запитів `resourceclaims/binding` та `resourceclaims/driver`.

## {{% heading "whatsnext" %}}

- [Посібник із зміцнення безпеки — динамічний розподіл ресурсів](/docs/concepts/security/hardening-guide/dynamic-resource-allocation/)
- [Захист кластера](/docs/tasks/administer-cluster/securing-a-cluster/)
- [Авторизація](/docs/reference/access-authn-authz/authorization/)
