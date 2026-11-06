---
title: Втулки пристроїв
description: >
  Втулки пристроїв дозволяють налаштувати кластер із підтримкою пристроїв або ресурсів, які потребують специфічного для постачальника налаштування, наприклад GPU, NIC, FPGA або енергонезалежної основної памʼяті.
content_type: concept
weight: 20
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Kubernetes надає фреймворк втулків пристроїв, який ви можете використовувати для оголошення системних апаратних ресурсів для {{< glossary_tooltip term_id="kubelet" >}}.

Замість того, щоб змінювати код самого Kubernetes, постачальники можуть реалізувати втулок пристроїв, який ви розгортаєте вручну або як {{< glossary_tooltip term_id="daemonset" >}}. До цільових пристроїв належать GPU, високопродуктивні NIC, FPGA, адаптери InfiniBand та інші подібні обчислювальні ресурси, які можуть потребувати специфічної для постачальника ініціалізації та налаштування.

<!-- body -->

## Реєстрація втулка пристроїв {#device-plugin-registration}

kubelet надає сервіс gRPC `Registration`:

```gRPC
service Registration {
	rpc Register(RegisterRequest) returns (Empty) {}
}
```

Втулок пристроїв може зареєструвати себе в kubelet через цей сервіс gRPC. Під час реєстрації втулок пристроїв повинен надіслати:

* Назву свого Unix-сокета.
* Версію API втулків пристроїв, для якої його було зібрано.
* `ResourceName`, який він хоче оголошувати. Тут `ResourceName` повинен відповідати [схемі іменування розширених ресурсів](/docs/concepts/configuration/manage-resources-containers/#extended-resources) у вигляді `vendor-domain/resourcetype`. (Наприклад, NVIDIA GPU оголошується як `nvidia.com/gpu`.)

Після успішної реєстрації втулок пристроїв надсилає kubelet список пристроїв, якими він керує, і тоді kubelet відповідає за оголошення цих ресурсів API-серверу як частини оновлення стану вузла. Наприклад, після того як втулок пристроїв зареєструє `hardware-vendor.example/foo` в kubelet і повідомить про два справні пристрої на вузлі, статус вузла оновлюється, щоб оголосити, що на вузлі встановлено 2 пристрої "Foo" і вони доступні.

Після цього користувачі можуть запитувати пристрої як частину специфікації Podʼа (див. [`container`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)). Запит розширених ресурсів схожий на те, як ви керуєте запитами та обмеженнями для інших ресурсів, з такими відмінностями:

* Розширені ресурси підтримуються лише як цілочисельні ресурси, і для них неможливий overcommit.
* Пристрої не можна спільно використовувати між контейнерами.

### Приклад {#example-pod}

Припустимо, що в кластері Kubernetes працює втулок пристроїв, який оголошує ресурс `hardware-vendor.example/foo` на певних вузлах. Ось приклад Podʼа, який запитує цей ресурс для запуску демонстраційного робочого навантаження:

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
# і може бути запланований лише на вузол, який може задовольнити
# цю потребу.
#
# Якщо на вузлі доступно більше 2 таких пристроїв, то
# залишок буде доступний для використання іншими Podʼами.
```

## Реалізація втулка пристроїв {#device-plugin-implementation}

Загальний робочий процес втулка пристроїв складається з таких кроків:

1. Ініціалізація. Під час цієї фази втулок пристроїв виконує специфічні для постачальника ініціалізацію та налаштування, щоб пристрої перебували в стані готовності.

1. Втулок запускає сервіс gRPC з Unix-сокетом за шляхом хоста `/var/lib/kubelet/device-plugins/` (цей шлях жорстко закодовано, і на нього не впливають `--root-dir` kubelet або будь-яка інша конфігурація), який реалізує такі інтерфейси:

   ```gRPC
   service DevicePlugin {
         // GetDevicePluginOptions повертає параметри для передавання менеджеру пристроїв.
         rpc GetDevicePluginOptions(Empty) returns (DevicePluginOptions) {}

         // ListAndWatch повертає потік списку пристроїв
         // Кожного разу, коли змінюється стан пристрою або пристрій зникає, ListAndWatch
         // повертає новий список
         rpc ListAndWatch(Empty) returns (stream ListAndWatchResponse) {}

         // Allocate викликається під час створення контейнера, щоб втулок
         // пристроїв міг виконати операції, специфічні для пристрою, і повідомити kubelet
         // про кроки, потрібні, щоб зробити пристрій доступним у контейнері
         rpc Allocate(AllocateRequest) returns (AllocateResponse) {}

         // GetPreferredAllocation повертає набір пріоритетних пристроїв для виділення
         // зі списку доступних. Не гарантується, що отримане пріоритетне виділення
         // буде тим, яке зрештою виконає devicemanager. Воно лише допомагає devicemanager
         // приймати обґрунтованіші рішення про виділення, коли це можливо.
         rpc GetPreferredAllocation(PreferredAllocationRequest) returns (PreferredAllocationResponse) {}

         // PreStartContainer викликається, якщо це вказано втулком пристроїв під час фази реєстрації,
         // перед кожним запуском контейнера. Втулок пристроїв може виконати специфічні для пристрою операції,
         // такі як скидання пристрою перед наданням пристроїв контейнеру.
         rpc PreStartContainer(PreStartContainerRequest) returns (PreStartContainerResponse) {}
   }
   ```

   {{< note >}}
   Втулки не зобовʼязані надавати корисні реалізації `GetPreferredAllocation()` або `PreStartContainer()`. Прапорці, що вказують на доступність цих викликів, якщо такі є, слід встановлювати в повідомленні `DevicePluginOptions`, яке повертає виклик `GetDevicePluginOptions()`. `kubelet` завжди викликатиме `GetDevicePluginOptions()`, щоб дізнатися, які необовʼязкові функції доступні, перш ніж викликати будь-яку з них безпосередньо.
   {{< /note >}}

1. Втулок реєструється в kubelet через Unix-сокет за шляхом хоста `/var/lib/kubelet/device-plugins/kubelet.sock`.

   {{< note >}}
   Послідовність робочого процесу є важливою. Для успішної реєстрації втулок МАЄ почати обслуговування сервісу gRPC до реєстрації в kubelet.
   {{< /note >}}

1. Після успішної реєстрації втулок пристроїв працює в режимі обслуговування, під час якого він постійно відстежує справність пристроїв і повідомляє kubelet про будь-які зміни стану пристрою. Він також відповідає за обслуговування запитів gRPC `Allocate`. Під час `Allocate` втулок пристроїв може виконувати підготовку, специфічну для пристрою; наприклад, очищення GPU або ініціалізацію QRNG. Якщо операції успішні, втулок пристроїв повертає `AllocateResponse`, який містить конфігурації середовища виконання контейнерів для доступу до виділених пристроїв. kubelet передає цю інформацію середовищу виконання контейнерів.

   `AllocateResponse` містить нуль або більше обʼєктів `ContainerAllocateResponse`. У них втулок пристроїв визначає зміни, які потрібно внести у визначення контейнера, щоб надати доступ до пристрою. Ці зміни включають:

   * [Анотації](/docs/concepts/overview/working-with-objects/annotations/)
   * вузли пристроїв
   * змінні середовища
   * монтування
   * повні назви пристроїв CDI

   {{< note >}}
   Обробка повних назв пристроїв CDI менеджером пристроїв потребує, щоб функціональну можливість [`DevicePluginCDIDevices`](/docs/reference/command-line-tools-reference/feature-gates-removed/#DevicePluginCDIDevices) було увімкнено і для kubelet, і для kube-apiserver. Її було додано як альфа-можливість у Kubernetes v1.28, вона перейшла до бета у v1.29 і до GA у v1.31.
   {{< /note >}}

### Обробка перезапусків kubelet {#handling-kubelet-restarts}

Очікується, що втулок пристроїв виявлятиме перезапуски kubelet і повторно реєструватиметься в новому екземплярі kubelet. Новий екземпляр kubelet під час запуску видаляє всі наявні Unix-сокети в `/var/lib/kubelet/device-plugins` (жорстко закодований шлях для втулків пристроїв). Втулок пристроїв може відстежувати видалення свого Unix-сокета й повторно реєструватися після такої події.

### Втулок пристроїв та несправні пристрої {#device-plugin-and-unhealthy-devices}

Бувають випадки, коли пристрої виходять з ладу або вимикаються. Обовʼязок втулка пристроїв у такому випадку — повідомити kubelet про ситуацію за допомогою API `ListAndWatchResponse`.

Після того як пристрій позначено як несправний, kubelet зменшить кількість доступних для розподілу одиниць цього ресурсу на вузлі, щоб показати, скільки пристроїв можна використовувати для планування нових Podʼів. Кількість місткості для цього ресурсу не зміниться.

Podʼи, які були призначені несправним пристроям, і далі залишатимуться призначеними цьому пристрою. Зазвичай код, що покладається на пристрій, почне збоїти, і Pod може перейти у фазу Failed, якщо `restartPolicy` для Podʼа не був `Always`, а інакше увійти в цикл збоїв.

До Kubernetes v1.31, щоб дізнатися, чи повʼязаний Pod із несправним пристроєм, потрібно було використовувати [PodResources API](#monitoring-device-plugin-resources).

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

Коли функціональна можливість `ResourceHealthStatus` увімкнена (бета, стандартно увімкнена з v1.36), до статусу кожного контейнера в `.status` кожного Podʼа додається поле `allocatedResourcesStatus`. Поле `allocatedResourcesStatus` надає інформацію про справність кожного пристрою, призначеного контейнеру. Кожен запис про справність ресурсу може містити необовʼязкове поле `message` з додатковим зрозумілим для людини контекстом про стан справності, наприклад подробиці помилок або причини відмови.

Для Podʼа, що завершився збоєм, або коли ви підозрюєте несправність, ви можете використовувати цей статус, щоб зрозуміти, чи може поведінка Podʼа бути повʼязана зі збоєм пристрою. Наприклад, якщо прискорювач повідомляє про перегрів, поле `allocatedResourcesStatus` може про це повідомити.

## Розгортання втулка пристроїв {#device-plugin-deployment}

Ви можете розгорнути втулок пристроїв як DaemonSet, як пакунок для операційної системи вузла або вручну.

Канонічна тека `/var/lib/kubelet/device-plugins` (жорстко закодована в kubelet) потребує привілейованого доступу, тому втулок пристроїв повинен працювати у привілейованому контексті безпеки. Якщо ви розгортаєте втулок пристроїв як DaemonSet, теку `/var/lib/kubelet/device-plugins` потрібно змонтувати як {{< glossary_tooltip term_id="volume" >}} у [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) втулка.

Якщо ви обираєте підхід із DaemonSet, ви можете покластися на Kubernetes, щоб розміщувати Pod втулка пристроїв на вузлах, перезапускати Pod демона після збою та допомагати автоматизувати оновлення.

## Сумісність API {#api-compatibility}

Раніше схема керування версіями вимагала, щоб версія API втулків пристроїв точно відповідала версії kubelet. Відтоді як у v1.12 ця можливість перейшла до бета, це більше не є жорсткою вимогою. API має версії й залишається стабільним із переходу цієї можливості до бета. Завдяки цьому оновлення kubelet мають бути безшовними, але до стабілізації в API все ще можуть відбуватися зміни, тож не гарантовано, що оновлення нічого не зламають.

{{< note >}}
Хоча компонент Kubernetes Device Manager є загальнодоступною можливістю, _API втулків пристроїв_ не є стабільним. Інформацію про API втулків пристроїв та сумісність версій дивіться на сторінці [Версії API втулків пристроїв](/docs/reference/node/device-plugin-api-versions/).
{{< /note >}}

Як проєкт, Kubernetes рекомендує розробникам втулків пристроїв:

* Стежити за змінами API втулків пристроїв у майбутніх випусках.
* Підтримувати кілька версій API втулків пристроїв для зворотної та прямої сумісності.

Щоб запускати втулки пристроїв на вузлах, які потрібно оновити до випуску Kubernetes з новішою версією API втулків пристроїв, оновіть свої втулки пристроїв до підтримки обох версій, перш ніж оновлювати ці вузли. Такий підхід забезпечить безперервну роботу виділення пристроїв під час оновлення.

## Моніторинг ресурсів втулка пристроїв {#monitoring-device-plugin-resources}

{{< feature-state for_k8s_version="v1.28" state="stable" >}}

Для моніторингу ресурсів, наданих втулками пристроїв, агенти моніторингу повинні мати змогу виявляти набір пристроїв, які використовуються на вузлі, та отримувати метадані, що описують, з яким контейнером має бути повʼязана метрика. Метрики [Prometheus](https://prometheus.io/), які надають агенти моніторингу пристроїв, мають відповідати [настановам щодо інструментування Kubernetes](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-instrumentation/metric-instrumentation.md), ідентифікуючи контейнери за допомогою міток prometheus `pod`, `namespace` та `container`.

kubelet надає сервіс gRPC для виявлення пристроїв, що використовуються, та надання метаданих про ці пристрої:

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

Точка доступу `List` надає інформацію про ресурси запущених Podʼів із такими подробицями, як ідентифікатори виключно виділених CPU, ідентифікатор пристрою, яким його повідомили втулки пристроїв, та ідентифікатор вузла NUMA, де виділено ці пристрої. Також для машин на базі NUMA вона містить інформацію про памʼять і великі сторінки (hugepages), зарезервовані для контейнера.

Починаючи з Kubernetes v1.27, точка доступу `List` може надавати інформацію про ресурси запущених Podʼів, виділені в `ResourceClaims` через API `DynamicResourceAllocation`. Починаючи з Kubernetes v1.34, ця можливість стандартно увімкнена.

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
cpu_ids у `ContainerResources` у точці доступу `List` відповідають виключно виділеним CPU, призначеним певному контейнеру. Якщо мета — оцінити CPU, які належать до спільного пулу, точку доступу `List` потрібно використовувати разом із точкою доступу `GetAllocatableResources`, як пояснено нижче:

1. Викличте `GetAllocatableResources`, щоб отримати список усіх доступних для розподілу CPU
2. Викличте `GetCpuIds` для всіх `ContainerResources` у системі
3. Відніміть усі CPU з викликів `GetCpuIds` від результату виклику `GetAllocatableResources`
{{< /note >}}

### Точка доступу gRPC `GetAllocatableResources` {#grpc-endpoint-getallocatableresources}

{{< feature-state state="stable" for_k8s_version="v1.28" >}}

`GetAllocatableResources` надає інформацію про ресурси, початково доступні на робочому вузлі. Вона надає більше інформації, ніж kubelet експортує в APIServer.

{{< note >}}
`GetAllocatableResources` слід використовувати лише для оцінки [доступних для розподілу](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) ресурсів на вузлі. Якщо мета — оцінити вільні/нерозподілені ресурси, її слід використовувати разом із точкою доступу List(). Результат, отриманий від `GetAllocatableResources`, залишатиметься тим самим, доки не зміняться базові ресурси, доступні kubelet. Це відбувається рідко, але коли відбувається (наприклад, hotplug/hotunplug, зміни справності пристроїв), клієнт має викликати точку доступу `GetAllocatableResources`.

Однак виклику точки доступу `GetAllocatableResources` недостатньо в разі оновлення CPU та/або памʼяті: щоб відобразити правильні значення місткості та доступних для розподілу ресурсів, kubelet потрібно перезапустити.
{{< /note >}}

```gRPC
// AllocatableResourcesResponses містить інформацію про всі пристрої, відомі kubelet
message AllocatableResourcesResponse {
    repeated ContainerDevices devices = 1;
    repeated int64 cpu_ids = 2;
    repeated ContainerMemory memory = 3;
}
```

`ContainerDevices` справді надають інформацію про топологію, вказуючи, до яких комірок NUMA привʼязаний пристрій. Комірки NUMA ідентифікуються за допомогою непрозорого цілочисельного ідентифікатора, значення якого відповідає тому, що повідомляють втулки пристроїв, [коли реєструються в kubelet](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager).

Сервіс gRPC обслуговується через unix-сокет `pod-resources/kubelet.sock` у кореневій теці kubelet (зазвичай `/var/lib/kubelet/pod-resources/kubelet.sock`). Агенти моніторингу ресурсів втулків пристроїв можна розгортати як демон або як DaemonSet. Канонічна тека `pod-resources` у кореневій теці kubelet (зазвичай `/var/lib/kubelet/pod-resources`) потребує привілейованого доступу, тому агенти моніторингу повинні працювати у привілейованому контексті безпеки. Якщо агент моніторингу пристроїв працює як DaemonSet, теку `pod-resources` потрібно змонтувати як {{< glossary_tooltip term_id="volume" >}} у [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) агента моніторингу пристроїв.

{{< note >}}

Під час доступу до `pod-resources/kubelet.sock` з DaemonSet або будь-якого іншого застосунку, розгорнутого як контейнер на хості, який монтує сокет як том, доброю практикою є монтувати теку `pod-resources`, а не сам файл сокета. Це гарантує, що після перезапуску kubelet контейнер зможе повторно підключитися до цього сокета.

На типовому вузлі Linux це означає монтування `/var/lib/kubelet/pod-resources/` замість `/var/lib/kubelet/pod-resources/kubelet.sock`.

Монтуваннями контейнера керують через inode, що посилається на сокет або теку, залежно від того, що було змонтовано. Під час перезапуску kubelet сокет видаляється і створюється новий, а тека залишається недоторканою. Тому початковий inode сокета стає непридатним для використання. inode теки продовжує працювати.

{{< /note >}}

### Точка доступу gRPC `Get` {#grpc-endpoint-get}

{{< feature-state state="beta" for_k8s_version="v1.34" >}}

Точка доступу `Get` надає інформацію про ресурси запущеного Podʼа. Вона надає інформацію, подібну до описаної для точки доступу `List`. Точка доступу `Get` потребує `PodName` і `PodNamespace` запущеного Podʼа.

```gRPC
// GetPodResourcesRequest містить інформацію про Pod
message GetPodResourcesRequest {
    string pod_name = 1;
    string pod_namespace = 2;
}
```

Точка доступу `Get` може надавати інформацію про Pod, повʼязану з динамічними ресурсами, виділеними через API динамічного виділення ресурсів. Починаючи з Kubernetes v1.34, ця можливість стандартно увімкнена.

## Інтеграція втулка пристроїв з менеджером топології {#device-plugin-integration-with-the-topology-manager}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

Менеджер топології (Topology Manager) — це компонент kubelet, який дозволяє координувати ресурси з урахуванням топології. Для цього API втулків пристроїв (Device Plugin API) було розширено структурою `TopologyInfo`.

```gRPC
message TopologyInfo {
    repeated NUMANode nodes = 1;
}

message NUMANode {
    int64 ID = 1;
}
```

Втулки пристроїв, які хочуть використовувати менеджер топології, можуть надсилати заповнену структуру TopologyInfo як частину реєстрації пристрою разом з ідентифікаторами пристроїв та станом їхньої справності. Потім менеджер пристроїв використає цю інформацію, щоб проконсультуватися з менеджером топології та прийняти рішення щодо призначення ресурсів.

`TopologyInfo` підтримує встановлення поля `nodes` у `nil` або у список вузлів NUMA. Це дозволяє втулку пристроїв оголошувати пристрій, який охоплює кілька вузлів NUMA.

Встановлення `TopologyInfo` у `nil` або надання порожнього списку вузлів NUMA для певного пристрою вказує на те, що втулок пристроїв не має переваг щодо спорідненості NUMA для цього пристрою.

Приклад структури `TopologyInfo`, заповненої для пристрою втулком пристроїв:

```none
pluginapi.Device{ID: "25102017", Health: pluginapi.Healthy, Topology:&pluginapi.TopologyInfo{Nodes: []*pluginapi.NUMANode{&pluginapi.NUMANode{ID: 0,},}}}
```

## Приклади втулків пристроїв {#examples}

{{% thirdparty-content %}}

Ось деякі приклади реалізації втулків пристроїв:

* [Akri](https://github.com/project-akri/akri), який дозволяє легко надавати доступ до різнорідних кінцевих пристроїв (таких як IP-камери та USB-пристрої).
* [Втулок пристроїв AMD GPU](https://github.com/ROCm/k8s-device-plugin)
* [Загальний втулок пристроїв](https://github.com/squat/generic-device-plugin) для загальних пристроїв Linux та USB-пристроїв
* [HAMi](https://github.com/Project-HAMi/HAMi) — проміжне програмне забезпечення для віртуалізації гетерогенних обчислень ШІ (наприклад, NVIDIA, Cambricon, Hygon, Iluvatar, MThreads, Ascend, Metax)
* [Втулки пристроїв Intel](https://github.com/intel/intel-device-plugins-for-kubernetes) для пристроїв Intel GPU, FPGA, QAT, VPU, SGX, DSA, DLB і IAA
* [Втулки пристроїв KubeVirt](https://github.com/kubevirt/kubernetes-device-plugins) для апаратно підтримуваної віртуалізації
* [Втулок пристроїв NVIDIA GPU](https://github.com/NVIDIA/k8s-device-plugin), офіційний втулок пристроїв NVIDIA, який надає доступ до GPU NVIDIA та відстежує їхню справність
* [Втулок пристроїв NVIDIA GPU для Container-Optimized OS](https://github.com/GoogleCloudPlatform/container-engine-accelerators/tree/master/cmd/nvidia_gpu)
* [Втулок пристроїв RDMA](https://github.com/hustcat/k8s-rdma-device-plugin)
* [Втулок пристроїв SocketCAN](https://github.com/collabora/k8s-socketcan)
* [Втулок пристроїв Solarflare](https://github.com/vikaschoudhary16/sfc-device-plugin)
* [Втулок мережевих пристроїв SR-IOV](https://github.com/intel/sriov-network-device-plugin)
* [Втулки пристроїв Xilinx FPGA](https://github.com/Xilinx/FPGA_as_a_Service/tree/master/k8s-device-plugin) для пристроїв Xilinx FPGA

## {{% heading "whatsnext" %}} {#whats-next}

* Дізнайтеся про [планування ресурсів GPU](/docs/tasks/manage-gpus/scheduling-gpus/) за допомогою втулків пристроїв
* Дізнайтеся про [оголошення розширених ресурсів](/docs/tasks/administer-cluster/extended-resource-node/) на вузлі
* Дізнайтеся про [менеджер топології](/docs/tasks/administer-cluster/topology-manager/)
* Прочитайте про використання [апаратного прискорення для TLS ingress](/blog/2019/04/24/hardware-accelerated-ssl/tls-termination-in-ingress-controllers-using-kubernetes-device-plugins-and-runtimeclass/) з Kubernetes
* Дізнайтеся більше про [виділення розширених ресурсів за допомогою DRA](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#extended-resource)
