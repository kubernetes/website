---
title: Downward API
content_type: concept
weight: 170
description: "Є два способи надати поля Podʼа та контейнера запущеному контейнеру: змінні середовища та файли, які заповнюються спеціальним типом тому. Разом ці два способи надання полів Podʼа та контейнера називають downward API."
---

<!-- overview -->

Іноді корисно, щоб контейнер мав інформацію про себе, не перебуваючи занадто повʼязаним із Kubernetes. _Downward API_ дозволяє контейнерам використовувати інформацію про себе чи кластер, не використовуючи клієнт Kubernetes або API-сервер.

Прикладом є наявний застосунок, який передбачає, що певна добре відома змінна середовища містить унікальний ідентифікатор. Можна обгорнути застосунок, але це виснажливо, схильне до помилок і суперечить меті слабкого звʼязку. Кращий варіант — використовувати назву Podʼа як ідентифікатор і передати її в цю змінну середовища.

У Kubernetes є два способи надати поля Podʼа та контейнера запущеному контейнеру:

* як [змінні середовища](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* як [файли в томі `downwardAPI`](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

Разом ці два способи надання полів Podʼа та контейнера називають _downward API_.

<!-- body -->

## Доступні поля {#available-fields}

Через _downward API_ доступні лише деякі поля API Kubernetes. У цьому розділі перелічено поля, які ви можете зробити доступними.

Ви можете передавати інформацію з доступних полів рівня Podʼа, використовуючи `fieldRef`. На рівні API `spec` для Podʼа завжди визначає принаймні один [Container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container). Ви можете передавати інформацію з доступних полів рівня Container, використовуючи
`resourceFieldRef`.

### Інформація, доступна за допомогою `fieldRef` {#downwardapi-fieldRef}

Деякі поля рівня Podʼа ви можете передати контейнеру як змінну середовища або через том `downwardAPI`. Через обидва механізми доступні такі поля:

`metadata.name`
: назва Podʼа

`metadata.namespace`
: {{< glossary_tooltip text="простір імен" term_id="namespace" >}} Podʼа

`metadata.uid`
: унікальний ідентифікатор Podʼа

`metadata.annotations['<KEY>']`
: значення {{< glossary_tooltip text="анотації" term_id="annotation" >}} Podʼа з назвою `<KEY>` (наприклад, `metadata.annotations['myannotation']`)

`metadata.labels['<KEY>']`
: текстове значення {{< glossary_tooltip text="мітки" term_id="label" >}} Podʼа з назвою `<KEY>` (наприклад, `metadata.labels['mylabel']`)

Така інформація доступна через змінні середовища, **але не як поле `fieldRef` у томі `downwardAPI`**:

`spec.serviceAccountName`
: назва {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}} Podʼа

`spec.nodeName`
: назва {{< glossary_tooltip term_id="node" text="вузла">}}, на якому виконується Pod

`status.hostIP`
: основна IP-адреса вузла, до якого призначено Pod

`status.hostIPs`
: IP-адреси — це версія подвійного стека `status.hostIP`, перша завжди така сама, як і `status.hostIP`.

`status.podIP`
: основна IP-адреса Podʼа (зазвичай, його IPv4-адреса)

`status.podIPs`
: IP-адреси — це версія подвійного стека `status.podIP`, перша завжди така сама, як і `status.podIP`

Така інформація доступна через `fieldRef` тому `downwardAPI`, **але не як змінні середовища**:

`metadata.labels`
: всі мітки Podʼа у форматі `label-key="escaped-label-value"` з однією міткою на рядок

`metadata.annotations`
: всі анотації Podʼа у форматі `annotation-key="escaped-annotation-value"` з однією анотацією на рядок

### Інформація, доступна за допомогою `resourceFieldRef` {#downwardapi-resourceFieldRef}

Ці поля рівня контейнера дозволяють надавати інформацію про [запити та обмеження](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) для ресурсів, таких як CPU та памʼять.

{{< note >}}
{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}
Ресурси CPU та памʼяті контейнера можуть бути змінені під час роботи контейнера. Якщо це станеться, буде оновлено том downward API, але змінні середовища не буде оновлено, доки контейнер не буде перезапущено. Докладніші відомості наведено у статті [Зміна розміру ресурсів CPU та памʼяті, призначених контейнерам](/docs/tasks/configure-pod-container/resize-container-resources/).
{{< /note >}}

`resource: limits.cpu`
: Обмеження CPU контейнера

`resource: requests.cpu`
: Запит CPU контейнера

`resource: limits.memory`
: Обмеження памʼяті контейнера

`resource: requests.memory`
: Запит памʼяті контейнера

`resource: limits.hugepages-*`
: Обмеження hugepages контейнера

`resource: requests.hugepages-*`
: Запит hugepages контейнера

`resource: limits.ephemeral-storage`
: Обмеження ефемерного сховища контейнера

`resource: requests.ephemeral-storage`
: Запит ефемерного сховища контейнера

#### Резервна інформація для обмежень ресурсів {#fallback-information-for-resource-limits}

Якщо обмеження CPU та памʼяті не вказані для контейнера, і ви намагаєтеся надати цю інформацію через _downward API_, kubelet стандартно надає максимальне доступне для розподілу значення CPU та памʼяті на основі розрахунку [ресурсів вузла, доступних для розподілу](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable).

## {{% heading "whatsnext" %}} {#whats-next}

Ви можете прочитати про [томи `downwardAPI`](/docs/concepts/storage/volumes/#downwardapi).

Ви можете спробувати використовувати _downward API_ щоб надати інформацію рівня контейнера чи Podʼа:

* як [змінні середовища](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* як [файли в томі `downwardAPI`](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)
