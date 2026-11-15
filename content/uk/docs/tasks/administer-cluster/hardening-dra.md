---
title: Посилення безпеки динамічного виділення ресурсів у вашому кластері
content_type: task
weight: 330
---

<!-- overview -->

Ця сторінка показує адміністраторам кластера, як посилити авторизацію для динамічного виділення ресурсів (DRA) з акцентом на доступ з мінімальними привілеями для оновлень статусу `ResourceClaim`.

<!-- prerequisites -->

## {{% heading "prerequisites" %}} {#before-you-begin}

- {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
- У вашому кластері налаштовано динамічне виділення ресурсів.
- Ви можете редагувати ресурси RBAC та перезапускати або розгортати компоненти DRA.

<!-- steps -->

## Визначте компоненти DRA, які оновлюють статус {#identify-dra-components-that-write-status}

Задокументуйте, які ідентичності (зазвичай ServiceAccount) оновлюють статус ResourceClaim у вашому кластері. Типові компоненти, що записують статус:

- kube-scheduler або власний контролер виділення
- драйвери DRA, локальні для вузла
- багатовузлові контролери статусу DRA

## Надання мінімально необхідних дозволів для синтетичних субресурсів {#grant-least-privilege-permissions-for-synthetic-subresources}

Починаючи з Kubernetes v1.36, оновлення статусу DRA вимагають дозволів на синтетичні субресурси на додаток до `resourceclaims/status`.

### Надання дозволів для планувальника та контролера виділення {#grant-scheduler-and-allocation-controller-permissions}

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

### Надання дозволів для драйверів, локальних для вузла {#grant-node-local-driver-permissions}

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

Створіть обʼєкти `ClusterRoleBinding` для кожної ідентичності компонента та уникайте спільного використання широкої ролі між не повʼязаними між собою компонентами DRA.

Обмежте правила `resourceclaims/driver` за допомогою `resourceNames`, де це можливо, щоб ідентичність могла оновлювати статус лише для конкретного драйвера DRA, яким вона керує.

## Перевірка та моніторинг {#validate-and-monitor}

1. Перевірте, що кожна ідентичність має лише необхідні дієслова та субресурси.
1. Підтвердіть, що оновлення статусу DRA працюють після розгортання.
1. Спостерігайте за подіями аудиту API-сервера щодо відхилених запитів `resourceclaims/binding` та `resourceclaims/driver`.

## {{% heading "whatsnext" %}} {#what-s-next}

- [Посібник із зміцнення безпеки — динамічне виділення ресурсів](/docs/concepts/security/hardening-guide/dynamic-resource-allocation/)
- [Захист кластера](/docs/tasks/administer-cluster/securing-a-cluster/)
- [Авторизація](/docs/reference/access-authn-authz/authorization/)
