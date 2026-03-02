---
title: Втулки пристроїв
description: >
  Втулки пристроїв дозволяють налаштувати кластер із підтримкою пристроїв або ресурсів, які вимагають налаштування від постачальника, наприклад GPU, NIC, FPGA або енергонезалежної основної памʼяті.
content_type: concept
weight: 20
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Kubernetes надає фреймворк втулків пристроїв, який ви можете використовувати для оголошення системних апаратних
ресурсів {{< glossary_tooltip term_id="kubelet" >}}.

Замість того, щоб вносити зміни в код самого Kubernetes, вендори можуть реалізувати втулки пристроїв, які ви розгортаєте або вручну, або як {{< glossary_tooltip term_id="daemonset" >}}. Цільові пристрої включають GPU, мережеві інтерфейси високої продуктивності, FPGA, адаптери InfiniBand, та інші подібні обчислювальні ресурси, які можуть вимагати ініціалізації та налаштування від вендора.

<!-- body -->

## Реєстрація втулка пристрою {#device-plugin-registration}

kubelet надає службу `Registration` через gRPC:

```gRPC
service Registration {
	rpc Register(RegisterRequest) returns (Empty) {}
}
```

Втулок пристрою може зареєструвати себе в kubelet через цю службу gRPC. Під час реєстрації втулок пристрою повинен надіслати:

* Назву свого Unix сокету.
* Версію API втулка пристрою, під яку він був зібраний.
* `ResourceName`, яке він хоче оголошувати. Тут `ResourceName` повинно відповідати [розширеній схемі найменування ресурсів](/docs/concepts/configuration/manage-resources-containers/#extended-resources) у вигляді `vendor-domain/resourcetype`. (Наприклад, NVIDIA GPU рекламується як `nvidia.com/gpu`.)

Після успішної реєстрації втулок пристрою надсилає kubelet список пристроїв, якими він керує, і тоді kubelet стає відповідальним за оголошення цих ресурсів на сервері API як частини оновлення стану вузла. Наприклад, після того, як втулок пристрою зареєструє `hardware-vendor.example/foo` в kubelet і повідомить про наявність двох пристроїв на вузлі, статус вузла оновлюється для оголошення того, що на вузлі встановлено 2 пристрої "Foo" і вони доступні для використання.

Після цього користувачі можуть запитувати пристрої як частину специфікації Podʼа (див. [`container`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)). Запит розширених ресурсів схожий на те, як ви керуєте запитами та лімітами для інших ресурсів, з такими відмінностями:

* Розширені ресурси підтримуються лише як цілочисельні ресурси та не можуть бути перевищені.
* Пристрої не можуть бути спільно використані між контейнерами.

### Приклад {#example-pod}

Припустимо, що в кластері Kubernetes працює втулок пристрою, який оголошує ресурс `hardware-vendor.example/foo` на певних вузлах. Ось приклад Podʼа, який використовує цей ресурс для запуску демонстраційного завдання:

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: demo-pod
spec:
  containers:
    - name: demo-container-1
      image: registry.k8s.io/pause:3.8
      resources:
        limits:
          hardware-vendor.example/foo: 2
#
# Цей Pod потребує 2 пристроїв hardware-vendor.example/foo
# і може бути розміщений тільки на Вузлі, який може задовольнити
# цю потребу.
#
# Якщо на Вузлі доступно більше 2 таких пристроїв, то
# залишок буде доступний для використання іншими Podʼами.
```

## Імплементація втулка пристрою {#device-plugin-implementation}

Загальний робочий процес втулка пристрою включає наступні кроки:

1. Ініціалізація. Під час цієї фази втулок пристрою виконує ініціалізацію та налаштування, специфічні для вендора, щоб забезпечити те, що пристрої перебувають в готовому стані.

2. Втулок запускає службу gRPC з Unix сокетом за шляхом хоста `/var/lib/kubelet/device-plugins/`, що реалізує наступні інтерфейси:

   ```gRPC
   service DevicePlugin {
         // GetDevicePluginOptions повертає параметри, що будуть передані до Менеджера пристроїв.
         rpc GetDevicePluginOptions(Empty) returns (DevicePluginOptions) {}

         // ListAndWatch повертає потік списку пристроїв
         // Кожного разу, коли змінюється стан пристрою або пристрій зникає, ListAndWatch
         // повертає новий список
         rpc ListAndWatch(Empty) returns (stream ListAndWatchResponse) {}

         // Allocate викликається під час створення контейнера, щоб втулок
         // пристрою міг виконати операції, специфічні для пристрою, та підказати kubelet
         // кроки для доступу до пристрою в контейнері
         rpc Allocate(AllocateRequest) returns (AllocateResponse) {}

         // GetPreferredAllocation повертає набір пріоритетних пристроїв для виділення
         // зі списку доступних. Остаточне пріоритетне виділення не гарантується,
         // це буде зроблене devicemanager. Це призначено лише для допомоги devicemanager у
         // прийнятті більш обізнаних рішень про виділення, коли це можливо.
         rpc GetPreferredAllocation(PreferredAllocationRequest) returns (PreferredAllocationResponse) {}

         // PreStartContainer викликається, якщо це вказано втулком пристрою під час фази реєстрації,
         // перед кожним запуском контейнера. Втулок пристроїв може виконати певні операції
         // такі як перезаватаження пристрою перед забезпеченням доступу до пристроїв в контейнері.
         rpc PreStartContainer(PreStartContainerRequest) returns (PreStartContainerResponse) {}
   }
   ```

   {{< note >}}
   Втулки не обовʼязково повинні надавати корисні реалізації для
   `GetPreferredAllocation()` або `PreStartContainer()`. Прапорці, що вказують на доступність цих викликів, якщо такі є, повинні бути встановлені в повідомленні `DevicePluginOptions`, відправленому через виклик `GetDevicePluginOptions()`. `kubelet` завжди викликає `GetDevicePluginOptions()`, щоб побачити, які необовʼязкові функції доступні, перед тим як викликати будь-яку з них безпосередньо.
   {{< /note >}}

3. Втулок реєструється з kubelet через Unix сокет за шляхом хосту `/var/lib/kubelet/device-plugins/kubelet.sock`.

   {{< note >}}
   Послідовність робочого процесу є важливою. Втулок МАЄ почати обслуговування служби gRPC перед реєстрацією з kubelet для успішної реєстрації.
   {{< /note >}}

4. Після успішної реєстрації втулок працює в режимі обслуговування, під час якого він постійно відстежує стан пристроїв та повідомляє kubelet про будь-які зміни стану пристрою. Він також відповідальний за обслуговування запитів gRPC `Allocate`. Під час `Allocate` втулок пристрою може виконувати підготовку, специфічну для пристрою; наприклад, очищення GPU або ініціалізація QRNG. Якщо операції успішно виконуються, втулок повертає відповідь `AllocateResponse`, яка містить конфігурації контейнера для доступу до виділених пристроїв. Kubelet передає цю інформацію середовищу виконання контейнерів.

   `AllocateResponse` містить нуль або більше обʼєктів `ContainerAllocateResponse`. У цих обʼєктах втулок визначає зміни, які потрібно внести в опис контейнера для забезпечення
   доступу до пристрою. Ці зміни включають:

   * [анотації](/docs/concepts/overview/working-with-objects/annotations/)
   * вузли пристроїв
   * змінні середовища
   * монтування
   * повні імена пристроїв CDI

   {{< note >}}
   Обробка повних імен пристроїв CDI Менеджером пристроїв потребує, щоб [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `DevicePluginCDIDevices` було увімкнено як для kubelet, так і для kube-apiserver. Це було додано як альфа-функція в Kubernetes v1.28 і було підняте до бета у v1.29 та GA у v1.31.
   {{< /note >}}

### Обробка перезапусків kubelet {#handling-kubelet-restarts}

Очікується, що втулок пристрою виявлятиме перезапуски kubelet і повторно реєструватиметься з новим екземпляром kubelet. Новий екземпляр kubelet видаляє всі наявні Unix-сокети під `/var/lib/kubelet/device-plugins`, коли він стартує. Втулок пристрою може відстежувати вилучення своїх Unix-сокетів та повторно реєструватися після цієї події.

### Втулок пристроїв та несправні пристрої {#device-plugin-and-unhealthy-devices}

Існують випадки, коли пристрої виходять з ладу або вимикаються. Відповідальність втулку пристроїв у такому випадку полягає в тому, щоб повідомити kubelet про ситуацію за допомогою API `ListAndWatchResponse`.

Після того, як пристрій позначено як несправний, kubelet зменшить кількість виділених ресурсів для цього ресурсу на Вузлі, щоб відобразити, скільки пристроїв можна використовувати для планування нових Podʼів. Загальна величина кількості для ресурсу не змінюватиметься.

Podʼи, які були призначені несправним пристроям, залишаться призначеними до цього пристрою. Зазвичай код, що покладається на пристрій, почне виходити з ладу, і Pod може перейти у фазу Failed, якщо `restartPolicy` для Podʼа не був `Always`, або увійти в цикл збоїв в іншому випадку.

До Kubernetes v1.31, щоб дізнатися, чи повʼязаний Pod із несправним пристроєм, потрібно було використовувати [PodResources API](#monitoring-device-plugin-resources).

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

Увімкнувши функціональну можливість `ResourceHealthStatus`, до кожного статусу контейнера в полі `.status` для кожного Pod буде додано поле `allocatedResourcesStatus`. Поле `allocatedResourcesStatus` надає інформацію про стан справності для кожного пристрою, призначеного контейнеру.

Для несправного Pod або коли ви підозрюєте несправність, ви можете використовувати цей статус, щоб зрозуміти, чи може поведінка Podʼа бути повʼязаною з несправністю пристрою. Наприклад, якщо прискорювач повідомляє про подію перегріву, поле `allocatedResourcesStatus` може відобразити цю інформацію.

## Розгортання втулка пристрою {#device-plugin-deployment}

Ви можете розгорнути втулок пристрою як DaemonSet, як пакунок для операційної системи вузла або вручну.

Канонічна тека `/var/lib/kubelet/device-plugins` потребує привілейованого доступу, тому втулок пристрою повинен працювати у привілейованому контексті безпеки. Якщо ви розгортаєте втулок пристрою як DaemonSet, тека `/var/lib/kubelet/device-plugins` має бути змонтована як {{< glossary_tooltip term_id="volume" >}} у [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) втулка.

Якщо ви обираєте підхід з використанням DaemonSet, ви можете розраховувати на Kubernetes щодо: розміщення Podʼа втулка пристрою на Вузлах, перезапуску Podʼа демона після відмови та автоматизації оновлень.

## Сумісність API {#api-compatibility}

Раніше схема керування версіями вимагала, щоб версія API втулка пристрою точно відповідала версії Kubelet. З моменту переходу цієї функції до бета-версії у версії 1.12 це більше не є жорсткою вимогою. API має версію і є стабільним з моменту випуску бета-версії цієї функції. Через це оновлення kubelet повинні бути безперебійними, але все ще можуть бути зміни в API до стабілізації, що робить оновлення не гарантовано непорушними.

{{< note >}}
Хоча компонент Kubernetes, Device Manager, є загальнодоступною функцією, _API втулка пристроїв_ не є стабільним. Щоб отримати інформацію про API втулка пристрою та сумісність версій, прочитайте [Версії API втулка пристрою](/docs/reference/node/device-plugin-api-versions/).
{{< /note >}}

Як проєкт, Kubernetes рекомендує розробникам втулка пристрою:

* Слідкувати за змінами API втулка пристрою у майбутніх релізах.
* Підтримувати кілька версій API втулка пристрою для забезпечення зворотної/майбутньої сумісності.

Для запуску втулка пристрою на вузлах, які потрібно оновити до випуску Kubernetes з новішою версією API втулка пристрою, оновіть ваші втулки пристроїв, щоб підтримувати обидві версії перед оновленням цих вузлів. Такий підхід забезпечить безперервну роботу виділення пристроїв під час оновлення.

## Моніторинг ресурсів втулка пристрою {#monitoring-device-plugin-resources}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

Для моніторингу ресурсів, наданих втулками пристроїв, агенти моніторингу повинні мати змогу виявляти набір пристроїв, які використовуються на вузлі, та отримувати метадані, щоб описати, з яким контейнером повʼязаний показник метрики. Метрики [Prometheus](https://prometheus.io/), експоновані агентами моніторингу пристроїв, повинні відповідати [Рекомендаціям щодо інструментування Kubernetes](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/metric-instrumentation.md), ідентифікуючи контейнери за допомогою міток prometheus `pod`, `namespace` та `container`.

Kubelet надає gRPC-сервіс для виявлення використовуваних пристроїв та надання метаданих для цих пристроїв:

```gRPC
// PodResourcesLister — це сервіс, який надається kubelet, який надає інформацію про
// ресурси вузла, використані контейнерами та Podʼами на вузлі
service PodResourcesLister {
    rpc List(ListPodResourcesRequest) returns (ListPodResourcesResponse) {}
    rpc GetAllocatableResources(AllocatableResourcesRequest) returns (AllocatableResourcesResponse) {}
    rpc Get(GetPodResourcesRequest) returns (GetPodResourcesResponse) {}
}
```

### Точка доступу gRPC `List` {#grpc-endpoint-list}

Точка доступу `List` надає інформацію про ресурси запущених Podʼів, з деталями, такими як ідентифікатори виключно виділених ЦП, ідентифікатор пристрою так, як він був повідомлений втулками пристроїів, і ідентифікатор NUMA-вузла, де ці пристрої розміщені. Крім того, для машин, що базуються на NUMA, вона містить інформацію про памʼять та великі сторінки, призначені для контейнера.

Починаючи з Kubernetes v1.27, точка доступу `List` може надавати інформацію про ресурси запущених Podʼів, виділені в `ResourceClaims` за допомогою API `DynamicResourceAllocation`. Починаючи з Kubernetes v1.34, ця функціє є стандартно увімкненою. Щоб її вимкнути, `kubelet` повинен бути запущений з наступними прапорцями:

```sh
--feature-gates=KubeletPodResourcesDynamicResources=false
```

```gRPC
// ListPodResourcesResponse — це відповідь, повернута функцією List
message ListPodResourcesResponse {
    repeated PodResources pod_resources = 1;
}

// PodResources містить інформацію про ресурси вузла, призначені для Podʼа
message PodResources {
    string name = 1;
    string namespace = 2;
    repeated ContainerResources containers = 3;
}

// ContainerResources містить інформацію про ресурси, призначені для контейнера
message ContainerResources {
    string name = 1;
    repeated ContainerDevices devices = 2;
    repeated int64 cpu_ids = 3;
    repeated ContainerMemory memory = 4;
    repeated DynamicResource dynamic_resources = 5;
}

// ContainerMemory містить інформацію про памʼять та великі сторінки, призначені для контейнера
message ContainerMemory {
    string memory_type = 1;
    uint64 size = 2;
    TopologyInfo topology = 3;
}

// Topology описує апаратну топологію ресурсу
message TopologyInfo {
        repeated NUMANode nodes = 1;
}

// NUMA представлення NUMA-вузла
message NUMANode {
        int64 ID = 1;
}

// ContainerDevices містить інформацію про пристрої, призначені для контейнера
message ContainerDevices {
    string resource_name = 1;
    repeated string device_ids = 2;
    TopologyInfo topology = 3;
}

// DynamicResource містить інформацію про пристрої, призначені для контейнера за допомогою Dynamic Resource Allocation
message DynamicResource {
    string class_name = 1;
    string claim_name = 2;
    string claim_namespace = 3;
    repeated ClaimResource claim_resources = 4;
}

// ClaimResource містить інформацію про ресурси у втулках
message ClaimResource {
    repeated CDIDevice cdi_devices = 1 [(gogoproto.customname) = "CDIDevices"];
}

// CDIDevice визначає інформацію про пристрій CDI
message CDIDevice {
    // Повністю кваліфіковане імʼя пристрою CDI
    // наприклад: vendor.com/gpu=gpudevice1
    // див. більше деталей в специфікації CDI:
    // https://github.com/container-orchestrated-devices/container-device-interface/blob/main/SPEC.md
    string name = 1;
}
```

{{< note >}}
cpu_ids у `ContainerResources` у точці доступу `List` відповідають виключно виділеним ЦП, призначеним для певного контейнера. Якщо мета — оцінити ЦП, які належать до загального пула, точку доступу `List` необхідно використовувати разом з точкою доступу`GetAllocatableResources`, як пояснено
нижче:

1. Викликайте `GetAllocatableResources`, щоб отримати список всіх доступних для виділення ЦП.
2. Викликайте `GetCpuIds` на всі `ContainerResources` у системі.
3. Відніміть всі ЦП з викликів `GetCpuIds` з виклику `GetAllocatableResources`.
{{< /note >}}

### Точка доступу gRPC `GetAllocatableResources` {#grpc-endpoint-getallocatableresources}

{{< feature-state state="stable" for_k8s_version="v1.28" >}}

Точка доступу `GetAllocatableResources` надає інформацію про ресурси, що спочатку доступні на робочому вузлі. Вона надає більше інформації, ніж kubelet експортує в APIServer.

{{< note >}}
`GetAllocatableResources` слід використовувати лише для оцінки [виділених](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) ресурсів на вузлі. Якщо мета - оцінити вільні/невикористані ресурси, її слід використовувати разом з точкою доступу List(). Результат, отриманий за допомогою `GetAllocatableResources`, залишиться таким самим, якщо ресурси, які експонуються для kubelet, не змінюються. Це відбувається рідко, але коли це відбувається (наприклад: hotplug/hotunplug, зміни стану пристроїв), очікується, що клієнт викличе точку доступу `GetAllocatableResources`.

Однак виклик точки доступу `GetAllocatableResources` не є достатнім у випадку оновлення ЦП та/або памʼяті, і для відображення правильної кількості та виділення ресурсів Kubelet повинен бути перезавантажений.
{{< /note >}}

```gRPC
// AllocatableResourcesResponses містить інформацію про всі пристрої, відомі kubelet
message AllocatableResourcesResponse {
    repeated ContainerDevices devices = 1;
    repeated int64 cpu_ids = 2;
    repeated ContainerMemory memory = 3;
}
```

`ContainerDevices` дійсно викладають інформацію про топологію, що вказує, до яких NUMA-клітин пристрій прикріплений. NUMA-клітини ідентифікуються за допомогою прихованого цілочисельного ідентифікатора, значення якого відповідає тому, що втулки пристроїв повідомляють [коли вони реєструються у kubelet](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager).

Сервіс gRPC обслуговується через unix-сокет за адресою `/var/lib/kubelet/pod-resources/kubelet.sock`. Агенти моніторингу для ресурсів втулків пристроїв можуть бути розгорнуті як демони, або як DaemonSet. Канонічна тека `/var/lib/kubelet/pod-resources` вимагає привілейованого доступу, тому агенти моніторингу повинні працювати у привілейованому контексті безпеки. Якщо агент моніторингу пристроїв працює як DaemonSet, `/var/lib/kubelet/pod-resources` має бути підключена як {{< glossary_tooltip term_id="volume" >}} у PodSpec агента моніторингу пристроїв [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

{{< note >}}

При доступі до `/var/lib/kubelet/pod-resources/kubelet.sock` з DaemonSet або будь-якого іншого застосунку, розгорнутого як контейнер на вузлі, який монтує сокет як том, це є доброю практикою монтувати теку `/var/lib/kubelet/pod-resources/` замість `/var/lib/kubelet/pod-resources/kubelet.sock`. Це забезпечить можливість перепідключення контейнера до цього сокету після перезавантаження kubelet.

Записи контейнера керуються за допомогою inode, що посилається на сокет або теку, залежно від того, що було змонтовано. Після перезапуску kubelet сокет видаляється і створюється новий сокет, тоді як тека залишається недоторканою. Таким чином, оригінальний inode для сокета стає непридатним для використання. inode для теки продовжить працювати.

{{< /note >}}

### Точка доступу gRPC `Get` {#grpc-endpoint-get}

{{< feature-state state="beta" for_k8s_version="v1.34" >}}

Точка доступу `Get` надає інформацію про ресурси робочого Pod. Вона експонує інформацію, аналогічну тій, що описана в точці доступу `List`. Точка доступу `Get` вимагає `PodName` і `PodNamespace` робочого Pod.

```gRPC
// GetPodResourcesRequest містить інформацію про Pod
message GetPodResourcesRequest {
    string pod_name = 1;
    string pod_namespace = 2;
}
```

Для вимкнення цієї функції вам потрібно запустити ваші служби kubelet з такими прапорцями:

```sh
--feature-gates=KubeletPodResourcesGet=false
```

Точка доступу `Get` може надавати інформацію про Pod, повʼязану з динамічними ресурсами, виділеними за допомогою API динамічного виділення ресурсів. Починаючи з версії Kubernetes v1.34, ця функція є стандартно увімкненою. Щоб її вимкнути, `kubelet` повинен бути запущений з наступними прапорцями:

```sh
--feature-gates=KubeletPodResourcesDynamicResources=false
```

### Інтеграція втулка пристрою з Менеджером Топології {#device-plugin-integration-with-the-topology-manager}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

Менеджер Топології (Topology Manager) є компонентом Kubelet, який дозволяє координувати ресурси в манері, орієнтованій на топологію. Для цього API втулка пристрою (Device Plugin API) було розширено, щоб включити структуру `TopologyInfo`.

```gRPC
message TopologyInfo {
    repeated NUMANode nodes = 1;
}

message NUMANode {
    int64 ID = 1;
}
```

Втулки пристроїв, які хочуть використовувати Менеджер Топології, можуть надсилати заповнену структуру `TopologyInfo` як частину реєстрації пристрою, разом з ідентифікаторами пристроїв та станом справності пристрою. Менеджер пристроїв потім використовуватиме цю інформацію для консультації з Менеджером Топології та прийняття рішень щодо призначення ресурсів.

`TopologyInfo` підтримує встановлення поля `nodes` або у `nil`, або у список вузлів NUMA. Це дозволяє Втулку Пристрою оголошувати пристрій, який охоплює кілька вузлів NUMA.

Встановлення `TopologyInfo` в `nil` або надання порожнього списку вузлів NUMA для даного пристрою вказує на те, що Втулок Пристрою не має переваги щодо спорідненості NUMA для цього пристрою.

Приклад структури `TopologyInfo`, заповненої для пристрою Втулком Пристрою:

```none
pluginapi.Device{ID: "25102017", Health: pluginapi.Healthy, Topology:&pluginapi.TopologyInfo{Nodes: []*pluginapi.NUMANode{&pluginapi.NUMANode{ID: 0,},}}}
```

## Приклади втулків пристроїв {#examples}

{{% thirdparty-content %}}

Ось деякі приклади реалізації втулків пристроїв:

* [Akri](https://github.com/project-akri/akri) дозволяє легко використовувати різнорідні пристрої вузла (такі як IP-камери та USB-пристрої).
* [Втулок пристрою AMD GPU](https://github.com/ROCm/k8s-device-plugin)
* [Загальний втулок пристрою](https://github.com/squat/generic-device-plugin) для загальних пристроїв Linux та USB пристроїв
* [HAMi](https://github.com/Project-HAMi/HAMi) для гетерогенного проміжного програмного забезпечення для віртуалізації обчислень ШІ (наприклад, NVIDIA, Cambricon, Hygon, Iluvatar, MThreads, Ascend, Metax)
* [Втулки пристроїв Intel](https://github.com/intel/intel-device-plugins-for-kubernetes) для пристроїв Intel GPU, FPGA, QAT, VPU, SGX, DSA, DLB і IAA
* [Втулки пристроїв KubeVirt](https://github.com/kubevirt/kubernetes-device-plugins) для апаратної підтримки віртуалізації
* The [Втулок пристрою NVIDIA GPU](https://github.com/NVIDIA/k8s-device-plugin), Офіційний втулок для пристроїв від NVIDIA, який експонує графічні процесори NVIDIA та відстежує стан графічних процесорів
* [Втулок пристрою NVIDIA GPU для Container-Optimized OS](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* [Втулок пристрою RDMA](https://github.com/hustcat/k8s-rdma-device-plugin)
* [Втулок пристрою SocketCAN](https://github.com/collabora/k8s-socketcan)
* [Втулок пристрою Solarflare](https://github.com/vikaschoudhary16/sfc-device-plugin)
* [Втулок мережевого пристрою SR-IOV](https://github.com/intel/sriov-network-device-plugin)
* [Втулки пристроїв Xilinx FPGA](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-device-plugin) для пристроїв Xilinx FPGA

## {{% heading "whatsnext" %}}

* Дізнайтеся про [планування ресурсів GPU](/docs/tasks/manage-gpus/scheduling-gpus/) за допомогою втулків пристроїв
* Дізнайтеся про [оголошення розширених ресурсів](/docs/tasks/administer-cluster/extended-resource-node/) на вузлі
* Дізнайтеся про [Менеджер Топології](/docs/tasks/administer-cluster/topology-manager/)
* Прочитайте про використання [апаратного прискорення для TLS ingress](/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/) з Kubernetes
* Дізнайтеся більше про [Розширене виділення ресурсів за допомогою DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#extended-resource)
