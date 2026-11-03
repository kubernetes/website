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

Оскільки хмарні постачальники розробляють і випускають свої продукти в іншому темпі, ніж проєкт Kubernetes, винесення специфічного для постачальника коду в окремий бінарний файл `cloud-controller-manager` дає змогу хмарним постачальникам розвиватися незалежно від основного коду Kubernetes.

Проєкт Kubernetes надає кістяк коду `cloud-controller-manager` з інтерфейсами Go, щоб дозволити вам (або вашому постачальнику хмар) додати свої власні реалізації. Це означає, що постачальник хмар може реалізувати cloud-controller-manager, імпортуючи пакунки з ядра Kubernetes; кожен постачальник хмар буде реєструвати свій власний код, викликаючи `cloudprovider.RegisterCloudProvider`, щоб оновити глобальну змінну доступних постачальників хмар.

## Розробка {#developing}

### Зовнішня реалізація {#out-of-tree}

Для створення зовнішнього cloud-controller-manager для вашої хмари:

1. Створіть пакунок Go з реалізацією, яка задовольняє [cloudprovider.Interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go).
2. Використовуйте [`main.go` у cloud-controller-manager](https://github.com/kubernetes/kubernetes/blob/master/cmd/cloud-controller-manager/main.go) з ядра Kubernetes як шаблон для свого `main.go`. Як зазначено вище, єдина відмінність полягатиме у пакунку хмари, який буде імпортуватися.
3. Імпортуйте свій пакунок хмари в `main.go`, переконайтеся, що ваш пакунок має блок `init` для запуску [`cloudprovider.RegisterCloudProvider`](https://github.com/kubernetes/cloud-provider/blob/master/plugins.go).

Багато постачальників хмар публікують код свого менеджера контролерів як відкритий код. Якщо ви створюєте новий cloud-controller-manager з нуля, за відправну точку можна взяти наявний зовнішній cloud-controller-manager.

### У коді Kubernetes {#in-tree}

Для внутрішніх постачальників хмар можна запустити внутрішній cloud-controller-manager як {{< glossary_tooltip term_id="daemonset" >}} у вашому кластері. Докладніше дивіться [Адміністрування Cloud Controller Manager](/docs/tasks/administer-cluster/running-cloud-controller/).
