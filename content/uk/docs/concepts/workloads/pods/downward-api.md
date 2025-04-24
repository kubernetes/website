---
title: Downward API
content_type: concept
weight: 170
description: "Є два способи використання полів обʼєкта Pod та контейнера у працюючому контейнері: як змінні середовища та як файли, які заповнюються спеціальним типом тома. Разом ці два способи використання полів обʼєкта Pod та контейнера називають Downward API."
---

<!-- overview -->

Іноді корисно, щоб контейнер мав інформацію про себе, не перебуваючи занадто повʼязаним із Kubernetes. _downward API_ дозволяє контейнерам використовувати інформацію про себе чи кластер, не використовуючи клієнт Kubernetes або API-сервер.

Наприклад, поточний застосунок, який передбачає, що відома змінна середовища містить унікальний ідентифікатор. Однією з можливостей є обгортання застосунку, але це нудно та помилкове, і воно суперечить меті вільного звʼязку. Кращий варіант — використовувати імʼя Podʼа як ідентифікатор та впровадити імʼя Podʼа у відому змінну середовища.

В Kubernetes існують два способи використання полів обʼєкта Pod та контейнера:

* як [змінні середовища](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* як [файли в томі `downwardAPI`](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

Разом ці два способи використання полів обʼєкта Pod та контейнера називають _downward API_.

<!-- body -->

## Доступні поля {#available-fields}

Через _downward API_ доступні не всі поля обʼєкта Kubernetes API. У цьому розділі перераховано доступні поля.

Ви можете передавати інформацію з доступних полів рівня Pod, використовуючи `fieldRef`. На рівні API `spec` для Pod завжди визначає принаймні один [Контейнер](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container). Ви можете передавати інформацію з доступних полів рівня Container, використовуючи
`resourceFieldRef`.

### Інформація, доступна за допомогою `fieldRef` {#downwardapi-fieldRef}

Для деяких полів рівня Pod ви можете передати їх контейнеру як змінні середовища або використовуючи том `downwardAPI`. Поля, доступні через обидва механізми, наступні:

`metadata.name`
: імʼя Pod

`metadata.namespace`
: {{< glossary_tooltip text="namespace" term_id="namespace" >}} Pod

`metadata.uid`
: унікальний ідентифікатор Pod

`metadata.annotations['<KEY>']`
: значення {{< glossary_tooltip text="аннотації" term_id="annotation" >}} Pod з іменем `<KEY>` (наприклад, `metadata.annotations['myannotation']`)

`metadata.labels['<KEY>']`
: текстове значення {{< glossary_tooltip text="мітки" term_id="label" >}} Pod з іменем `<KEY>` (наприклад, `metadata.labels['mylabel']`)

Наступна інформація доступна через змінні середовища, **але не як поле `fieldRef` тому `downwardAPI`**:

`spec.serviceAccountName`
: імʼя {{< glossary_tooltip text="service account" term_id="service-account" >}} Pod

`spec.nodeName`
: імʼя {{< glossary_tooltip term_id="node" text="вузла">}}, на якому виконується Pod

`status.hostIP`
: основна IP-адреса вузла, до якого призначено Pod

`status.hostIPs`
: IP-адреси — це версія подвійного стека `status.hostIP`, перша завжди така сама, як і `status.hostIP`.

`status.podIP`
: основна IP-адреса Pod (зазвичай, його IPv4-адреса)

`status.podIPs`
: IP-адреси — це версія подвійного стека `status.podIP`, перша завжди така сама, як і `status.podIP`

Наступна інформація доступна через том `downwardAPI` `fieldRef`, **але не як змінні середовища**:

`metadata.labels`
: всі мітки Pod, у форматі `label-key="escaped-label-value"` з однією міткою на рядок

`metadata.annotations`
: всі анотації поду, у форматі `annotation-key="escaped-annotation-value"` з однією анотацією на рядок

### Інформація, доступна за допомогою `resourceFieldRef` {#downwardapi-resourceFieldRef}

Ці поля рівня контейнера дозволяють надавати інформацію про [вимоги та обмеження](/docs/concepts/configuration/manage-resources-containers/#requests-and-limits) для ресурсів, таких як CPU та памʼять.

{{< note >}}
{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}
Ресурси CPU та памʼяті контейнера можуть бути змінені під час роботи контейнера. Якщо це станеться, буде оновлено том downward API, що зменшився, але змінні оточення не буде оновлено, доки контейнер не буде перезапущено. Докладніші відомості наведено у статті [Зміна розміру ресурсів процесора і памʼяті, призначених контейнерам](/docs/tasks/configure-pod-container/resize-container-resources/).
{{< /note >}}

`resource: limits.cpu`
: Обмеження CPU контейнера

`resource: requests.cpu`
: Вимога CPU контейнера

`resource: limits.memory`
: Обмеження памʼяті контейнера

`resource: requests.memory`
: Вимога памʼяті контейнера

`resource: limits.hugepages-*`
: Обмеження hugepages контейнера

`resource: requests.hugepages-*`
: Вимога hugepages контейнера

`resource: limits.ephemeral-storage`
: Обмеження ефемерних сховищ контейнера

`resource: requests.ephemeral-storage`
: Вимога ефемерних сховищ контейнера

#### Резервні інформаційні обмеження для ресурсів {#fallback-information-for-resource-limits}

Якщо ліміти CPU та памʼяті не вказані для контейнера, і ви використовуєте _downward API_ для спроби викриття цієї інформації, тоді kubelet типово використовує значення для CPU та памʼяті на основі розрахунку [розподілених вузлів](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable).

## {{% heading "whatsnext" %}}

Ви можете прочитати про [томи `downwardAPI`](/docs/concepts/storage/volumes/#downwardapi).

Ви можете спробувати використовувати _downward API_ для поширення інформації на рівні контейнера чи Pod:

* як [змінні середовища](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* як [файли в томі `downwardAPI`](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)
