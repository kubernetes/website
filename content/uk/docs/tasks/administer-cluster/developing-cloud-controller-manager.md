---
title: Розробка Cloud Controller Manager
content_type: concept
weight: 190
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.11" state="beta" >}}

{{< glossary_definition term_id="cloud-controller-manager" length="all" prepend="Cloud Controller Manager (cloud-controller-manager) є">}}

<!-- body -->

## Контекст {#background}

Оскільки постачальники хмар розвиваються та випускаються іншим темпом порівняно з проєктом Kubernetes, абстрагування специфічного для постачальників коду в окремий бінарний файл `cloud-controller-manager` дозволяє хмарним постачальникам еволюціонувати незалежно від основного коду Kubernetes.

Проєкт Kubernetes надає кістяк коду `cloud-controller-manager` з інтерфейсами Go, щоб дозволити вам (або вашому постачальнику хмар) додати свої власні реалізації. Це означає, що постачальник хмар може реалізувати cloud-controller-manager, імпортуючи пакунки з ядра Kubernetes; кожен постачальник хмар буде реєструвати свій власний код, викликаючи `cloudprovider.RegisterCloudProvider`, щоб оновити глобальну змінну доступних постачальників хмар.

## Розробка {#developing}

### Зовнішня реалізація {#out-of-tree}

Для створення зовнішнього cloud-controller-manager для вашої хмари:

1. Створіть пакунок Go з реалізацією, яка задовольняє [cloudprovider.Interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go).
2. Використовуйте [`main.go` у cloud-controller-managerр](https://github.com/kubernetes/kubernetes/blob/master/cmd/cloud-controller-manager/main.go) з ядра Kubernetes як шаблон для свого `main.go`. Як зазначено вище, єдина відмінність полягатиме у пакунку хмари, який буде імпортуватися.
3. Імпортуйте свій пакунок хмари в `main.go`, переконайтеся, що ваш пакунок має блок `init` для запуску [`cloudprovider.RegisterCloudProvider`](https://github.com/kubernetes/cloud-provider/blob/master/plugins.go).

Багато постачальників хмар публікують свій код контролера як відкритий код. Якщо ви створюєте новий cloud-controller-manager з нуля, ви можете взяти наявний зовнішній cloud-controller-manager як вашу вихідну точку.

### У коді Kubernetes {#in-tree}

Для внутрішніх постачальників хмар ви можете запустити cloud-controller-managerу, що працює у внутрішньому коді, як {{< glossary_tooltip term_id="daemonset" >}} у вашому кластері. Див. [Адміністрування Cloud Controller Manager](/docs/tasks/administer-cluster/running-cloud-controller/) для отримання додаткової інформації.
