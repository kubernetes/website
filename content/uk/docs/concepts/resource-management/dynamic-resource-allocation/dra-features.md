---
title: Функції DRA
content_type: concept
weight: 40
---

<!-- overview -->

Ця сторінка описує необовʼязкові функції DRA для розширених випадків використання. Деякі з цих функцій вимагають підтримки з боку драйвера DRA. Для кожної функції зазначено її зрілість та функціональну можливість, яка її вмикає.

<!-- body -->

## Пристрої, що розділяються на розділи {#partitionable-devices}

{{< feature-state feature_gate_name="DRAPartitionableDevices" >}}

Пристрої, представлені в DRA, не обовʼязково мають бути єдиним блоком, підключеним до однієї машини, але також можуть бути логічним пристроєм, що складається з кількох пристроїв, підключених до кількох машин. Ці пристрої можуть використовувати ресурси базових фізичних пристроїв, що перекриваються, тобто коли один логічний пристрій виділяється, інші пристрої стають недоступними.

В API ResourceSlice це представлено як список іменованих CounterSets, кожен з яких містить набір іменованих лічильників. Лічильники представляють ресурси, доступні на фізичному пристрої, які використовуються логічними пристроями, опублікованими через DRA.

Логічні пристрої можуть вказувати список ConsumesCounters. Кожен запис містить посилання на CounterSet та набір іменованих лічильників із кількостями, які вони споживатимуть. Отже, щоб пристрій можна було виділити, згадані набори лічильників повинні мати достатню кількість для лічильників, на які посилається пристрій.

CounterSets мають бути вказані в окремих ResourceSlices від пристроїв. Пристрої можуть споживати лічильники з будь-якого CounterSet, визначеного в тому самому пулі ресурсів, що й пристрій.

Ось приклад двох пристроїв, кожен з яких споживає 6Gi памʼяті зі спільного лічильника з 8Gi памʼяті. Таким чином, лише один із пристроїв може бути виділений у будь-який момент часу. Планувальник обробляє це, і це прозоро для споживача, оскільки API ResourceClaim не змінюється.

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: resourceslice-with-countersets
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 2
  driver: dra.example.com
  sharedCounters:
  - name: gpu-1-counters
    counters:
      memory:
        value: 8Gi
---
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: resourceslice-with-devices
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 2
  driver: dra.example.com
  devices:
  - name: device-1
    consumesCounters:
    - counterSet: gpu-1-counters
      counters:
        memory:
          value: 6Gi
  - name: device-2
    consumesCounters:
    - counterSet: gpu-1-counters
      counters:
        memory:
          value: 6Gi
```

Пристрої, що розділяються на розділи, контролюються функціональною можливістю [`DRAPartitionableDevices`](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices) у `kube-apiserver` та `kube-scheduler`.

## Групи сумісності пристроїв {#device-compatibility-groups}

{{< feature-state feature_gate_name="DRADeviceCompatibilityGroups" >}}

Групи сумісності пристроїв дозволяють драйверу DRA оголошувати, які розділені пристрої можуть бути спільно виділені на тому самому фізичному обладнанні. Без цієї функції несумісні комбінації пристроїв виявляються лише тоді, коли kubelet готує Pod на вузлі — що призводить до невдалої підготовки. З групами сумісності планувальник відхиляє несумісні комбінації на етапі планування, до початку будь-якої роботи на стороні вузла.

Це найбільш корисно для обладнання, яке підтримує взаємовиключні режими роботи. Наприклад, GPU, який може працювати в режимі MIG або в режимі vGPU: пристрій у режимі MIG та пристрій у режимі vGPU не можуть бути спільно виділені, оскільки вони споживають ті самі фізичні ресурси несумісним чином. Оголошуючи `compatibilityGroups`, драйвер робить це обмеження видимим для планувальника.

Ця функція ґрунтується на [пристроях, що розділяються на розділи](#partitionable-devices): поле `compatibilityGroups` знаходиться в записах `device.consumesCounters[]`, які існують лише для пристроїв, що розділяються на розділи. Обидві функціональні можливості `DRADeviceCompatibilityGroups` та `DRAPartitionableDevices` мають бути увімкнені в `kube-apiserver` та `kube-scheduler`.

### Як це працює {#device-compatibility-groups-how-it-works}

Драйвер визначає список `compatibilityGroups` для кожного запису `device.consumesCounters[]` у ResourceSlice. Список містить щонайбільше 2 непрозорі рядкові назви, які представляють режим роботи або тип розділу цього пристрою на цьому конкретному наборі лічильників.

Коли планувальник виділяє кілька пристроїв, які використовують той самий набір лічильників, він обчислює перетин їхніх `compatibilityGroups`. Виділення успішне лише тоді, коли цей перетин не порожній — тобто кожен спільно виділений пристрій має принаймні одну спільну назву групи. Пристрої, які використовують різні набори лічильників, ніколи не порівнюються між собою.

Пристрій, який не оголошує жодних груп (невстановлений, nil або порожній список), розглядається як особливий випадок: він може бути спільно виділений лише з іншими пристроями без груп на тому самому наборі лічильників. Він ніколи не може бути спільно виділений з пристроєм, який оголошує одну або більше груп.

Обмеження застосовується до всіх заявок, що виділяються в одному циклі планування: якщо дві заявки кожна виділяє пристрій з того самого набору лічильників, перетин груп між заявками також забезпечується.

### Приклад {#device-compatibility-groups-example}

Розглянемо GPU, який може працювати в режимі MIG або в режимі vGPU. Драйвер публікує два пристрої, кожен з яких споживає 4 GiB з того самого спільного лічильника памʼяті обсягом 8 GiB. Лише на основі ємності лічильника обидва пристрої могли б бути виділені разом. Кожен пристрій оголошує свій режим роботи як групу сумісності, роблячи два режими взаємовиключними:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: gpu-counters
spec:
  nodeName: worker-1
  pool:
    name: gpu-pool
    generation: 1
    resourceSliceCount: 2
  driver: gpu.example.com
  sharedCounters:
  - name: gpu-0-memory
    counters:
      memory:
        value: 8Gi
---
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: gpu-devices
spec:
  nodeName: worker-1
  pool:
    name: gpu-pool
    generation: 1
    resourceSliceCount: 2
  driver: gpu.example.com
  devices:
  - name: gpu-0-mig
    consumesCounters:
    - counterSet: gpu-0-memory
      counters:
        memory:
          value: 4Gi
      compatibilityGroups:
      - mig
  - name: gpu-0-vgpu
    consumesCounters:
    - counterSet: gpu-0-memory
      counters:
        memory:
          value: 4Gi
      compatibilityGroups:
      - vgpu
```

У цьому прикладі:

- `gpu-0-mig` належить до групи `mig`.
- `gpu-0-vgpu` належить до групи `vgpu`.

Якщо Pod або PodGroup запитує два пристрої з цього пулу, планувальник перевіряє, чи мають два вибрані пристрої спільну групу сумісності на наборі лічильників `gpu-0-memory`. Оскільки `{"mig"} ∩ {"vgpu"} = ∅`, пара відхиляється — навіть якщо набір лічильників має достатньо памʼяті для обох. Обидва запити можуть бути задоволені лише двома пристроями MIG (або двома пристроями vGPU) з пулу, де такі пари існують.

### Обмеження {#device-compatibility-groups-constraints}

- Кожен запис `consumesCounters[]` може оголошувати щонайбільше **2** назви груп.
- Назви груп мають бути унікальними в межах одного запису.
- Назви груп є непрозорими для Kubernetes; вони мають значення лише в межах пулу драйвера, що їх публікує.
- Групи порівнюються для кожного набору лічильників окремо: групи на одному наборі лічильників не впливають на рішення про спільне виділення для іншого набору лічильників.

### Безпека при різниці версій {#device-compatibility-groups-version-skew}

Коли функціональну можливість `DRADeviceCompatibilityGroups` вимкнено (стандартно для альфа), kube-apiserver видаляє поле `compatibilityGroups` з будь-якого нового або оновленого ResourceSlice — якщо старий обʼєкт уже не мав цього поля встановленим. Тоді планувальник розглядає пристрої в будь-якому пулі, який раніше мав згруповані пристрої, як такі, що належать до неповного пулу, і повністю пропускає їх.

Лише непорожній список вважається встановленим полем: `compatibilityGroups: null` та `compatibilityGroups: []` обробляються так само, як і пропуск поля. Пристрої з ними поводяться точно так само, як пристрої без груп — вони не змушують планувальник вважати пул неповним.

Групи сумісності пристроїв контролюються функціональною можливістю [`DRADeviceCompatibilityGroups`](/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceCompatibilityGroups) у kube-apiserver та kube-scheduler. Функціональна можливість [`DRAPartitionableDevices`](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices) також має бути увімкнена.

## Споживча ємність {#consumable-capacity}

{{< feature-state feature_gate_name="DRAConsumableCapacity" >}}

Функція споживчої ємності дозволяє одним і тим самим пристроям споживатися кількома незалежними заявками на ресурси, при цьому планувальник Kubernetes керує тим, скільки ємності пристрою використовує кожна заявка. Це аналогічно тому, як Podʼи можуть спільно використовувати ресурси на вузлі; заявки на ресурси можуть спільно використовувати ресурси на пристрої.

Драйвер пристрою може встановити поле `allowMultipleAllocations`, додане в `.spec.devices` обʼєкта `ResourceSlice`, щоб дозволити виділення цього пристрою кільком незалежним заявкам на ресурси або кільком запитам у межах однієї заявки на ресурс.

Коли ви запитуєте рівно один вид пристрою в `ResourceClaim`, встановіть `spec.devices.requests[].exactly.capacity`, щоб вказати вимоги до ресурсів пристрою для кожного виділення. Для пріоритетного списку різних альтернатив встановіть `capacity` у
відповідних записах `spec.devices.requests[].firstAvailable[]`.

Для пристрою, який дозволяє кілька виділень, запитана ємність береться з, або споживається з, його загальної ємності, концепція, відома як **споживча ємність**. Тоді планувальник гарантує, що сукупна спожита ємність у всіх заявках не перевищує загальну ємність пристрою. Крім того, автори драйверів можуть використовувати обмеження `requestPolicy` для окремих ємностей пристроїв, щоб контролювати, як ці ємності споживаються. Наприклад, автор драйвера може вказати, що певна ємність споживається лише приростами по 1Gi.

Ось приклад мережевого пристрою, який дозволяє кілька виділень і містить споживчу ємність пропускної здатності.

```yaml
kind: ResourceSlice
apiVersion: resource.k8s.io/v1
metadata:
  name: resourceslice
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 1
  driver: dra.example.com
  devices:
  - name: eth1
    allowMultipleAllocations: true
    attributes:
      name:
        string: "eth1"
    capacity:
      bandwidth:
        requestPolicy:
          default: "1M"
          validRange:
            min: "1M"
            step: "8"
        value: "10G"
```

Споживчу ємність можна запитати, як показано в прикладі нижче.

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaimTemplate
metadata:
  name: bandwidth-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        exactly:
          deviceClassName: resource.example.com
          capacity:
            requests:
              bandwidth: 1G
```

Результат виділення міститиме спожиту ємність та ідентифікатор частки.

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
...
status:
  allocation:
    devices:
      results:
      - consumedCapacity:
          bandwidth: 1G
        device: eth1
        shareID: "a671734a-e8e5-11e4-8fde-42010af09327"
```

У цьому прикладі було вибрано пристрій, який допускає кілька виділень. Однак будь-який пристрій `resource.example.com` із принаймні запитаною пропускною здатністю 1G міг би задовольнити вимогу. Якби було вибрано пристрій, який не допускає кілька виділень, виділення призвело б до використання всього пристрою. Щоб примусово використовувати лише пристрої, які допускають кілька виділень, ви можете використати критерій CEL `device.allowMultipleAllocations == true`.

### Обмеження DistinctAttribute {#distinctattribute-constraint}

Коли ви запитуєте кілька пристроїв у заявці на ресурс, ви можете використати обмеження DistinctAttribute, щоб гарантувати, що кожен виділений пристрій має різне значення для вказаного атрибута. Це обмеження було введено разом із функцією споживчої ємності.

Обмеження DistinctAttribute особливо корисне під час роботи з пристроями, які допускають кілька виділень. Воно запобігає виділенню одного й того самого пристрою кілька разів у межах однієї заявки на ресурс, навіть якщо цей пристрій дозволяє кілька виділень.

Окрім запобігання дублюванню виділень, це обмеження допомагає оптимізувати продуктивність, гарантуючи розподіл пристроїв на основі їхніх атрибутів. Наприклад, ви можете використати його для розподілу пристроїв між різними NUMA-вузлами, щоб оптимізувати пропускну здатність памʼяті та зменшити конкуренцію.

## Авторизація на основі детального статусу {#granular-status-authorization}

{{< feature-state feature_gate_name="DRAResourceClaimGranularStatusAuthorization" >}}

Починаючи з Kubernetes v1.36, DRA застосовує детальні перевірки авторизації для оновлень статусу `ResourceClaim`, використовуючи синтетичні субресурси та дієслова, що враховують вузли.

Інструкції з посилення безпеки, включаючи приклади RBAC для планувальника та драйверів DRA, див. у
[Посібнику із зміцнення безпеки — динамічний розподіл ресурсів](/docs/concepts/security/hardening-guide/dynamic-resource-allocation/).

Покрокову процедуру для адміністратора кластера див. у [Посиленні безпеки динамічного розподілу ресурсів у вашому кластері](/docs/tasks/administer-cluster/hardening-dra/).

## Необовʼязкові операції з вузлами {#optional-node-operations}

{{< feature-state feature_gate_name="DRAOptionalNodeOperations" >}}

У динамічному виділенні ресурсів (DRA) `kubelet` координується з локальним для вузла драйвером через gRPC, щоб підготувати виділені пристрої перед запуском контейнера (`NodePrepareResources`) та скасувати їх підготовку після завершення роботи Podʼа (`NodeUnprepareResources`). Хоча така схема є критичною для локального для вузла обладнання, такого як GPU або FPGA, деякі ресурси керуються повністю в панелі управління і не потребують жодної локальної настройки на вузлі.

Функція необовʼязкових операцій з вузлами дозволяє драйверам ресурсів оголошувати, що певні локальні для вузла операції gRPC можуть бути пропущені. Після налаштування `kubelet` оминає пошук драйвера та виклики gRPC для цих пристроїв, усуваючи потребу розгортати та підтримувати порожні локальні для вузла драйвери на кожному робочому вузлі.

### Конфігурація драйвера {#driver-configuration}

Автори драйверів можуть вказати поле `skipNodeOperations` у
`.spec.skipNodeOperations` обʼєкта ResourceSlice. Це поле є списком унікальних рядків, які вказують локальні для вузла операції, що мають бути пропущені для всіх пристроїв у цьому розділі.

Допустимі значення:

- `"NodePrepareResources"`: пропускає виклики gRPC `NodePrepareResources`. Це значення не можна вказати, якщо `"NodeUnprepareResources"` також не вказано (або не вказано `"*"`). Це обмеження запобігає застряганню Podʼів у стані Terminating, якщо локальний для вузла втулок відсутній, оскільки втулок не перевіряється під час запуску Podʼа, коли підготовку пропущено.
- `"NodeUnprepareResources"`: пропускає виклики gRPC `NodeUnprepareResources`.
- `"*"`: пропускає всі локальні для вузла операції з ресурсами.

Ось приклад ResourceSlice для ресурсу панелі управління, який пропускає всі локальні для вузла операції:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: control-plane-resources
spec:
  nodeName: worker-1
  pool:
    name: central-pool
    generation: 1
    resourceSliceCount: 1
  driver: control-plane.example.com
  skipNodeOperations:
  - "*"
  devices:
  - name: virtual-device-1
```

### Результат виділення та виконання {#allocation-result-and-execution}

Коли планувальник Kubernetes виділяє пристрій заявці на ресурс, він копіює список `skipNodeOperations` з ResourceSlice у результат виділення:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
...
status:
  allocation:
    devices:
      results:
      - device: virtual-device-1
        driver: control-plane.example.com
        pool: central-pool
        skipNodeOperations:
        - "*"
```

Коли Pod працює на вузлі, `kubelet` читає результати виділення. Якщо всі виділені пристрої для певного драйвера в межах заявки на ресурс пропускають конкретну операцію, `kubelet` повністю оминає виклик цього хука gRPC для цього драйвера.

### Експлуатаційні міркування {#operational-considerations}

#### Оновлення драйвера на місці {#in-place-driver-updates}

Оскільки налаштування `skipNodeOperations` копіюється з ResourceSlice у заявку на ресурс під час виділення, запущені Podʼи та активні виділення зберігають те налаштування, яке діяло на момент їх планування.

Якщо вимоги драйвера до операцій з вузлами оновлюються на місці (наприклад, змінюються з вимоги виконання операцій на їх пропуск), наявні заявки все ще використовуватимуть попередню конфігурацію. Щоб уникнути проблем, наприклад, зависання завершуваних Podʼів в очікуванні виведеного з експлуатації втулка вузла, адміністратори кластерів мають переконатися, що для драйвера не існує активних заявок, перш ніж змінювати його вимоги до операцій з вузлами або видаляти локальні для вузла DaemonSets драйвера.

#### Інтеграція з оголошеними функціями вузла {#node-declared-features-integration}

Щоб запобігти плануванню Podʼів на вузлах, де `kubelet` не підтримує пропуск операцій DRA (що призвело б до збою `kubelet` в очікуванні відсутнього втулка вузла), ця функція інтегрується з [Оголошеними функціями вузла](/docs/concepts/scheduling-eviction/node-declared-features/). Коли Pod використовує заявку на ресурс із налаштованим `skipNodeOperations`, планувальник Kubernetes перевіряє, що цільовий вузол оголошує підтримку функції `DRAOptionalNodeOperations` у своєму `.status.declaredFeatures`, перш ніж планувати Pod.

Необовʼязкові операції з вузлами контролюються функціональною можливістю [`DRAOptionalNodeOperations`](/docs/reference/command-line-tools-reference/feature-gates/#DRAOptionalNodeOperations) у `kube-apiserver`, `kube-scheduler` та `kubelet`.
