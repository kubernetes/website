---
title: Динамічне виділення ресурсів
content_type: concept
weight: 65
api_metadata:
- apiVersion: "resource.k8s.io/v1alpha3"
  kind: "DeviceTaintRule"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceClaim"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceClaimTemplate"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "DeviceClass"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceSlice"
- apiVersion: "resource.k8s.io/v1beta2"
  kind: "ResourceClaim"
- apiVersion: "resource.k8s.io/v1beta2"
  kind: "ResourceClaimTemplate"
- apiVersion: "resource.k8s.io/v1beta2"
  kind: "DeviceClass"
- apiVersion: "resource.k8s.io/v1beta2"
  kind: "ResourceSlice"
---

<!-- overview -->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

Динамічне виділення ресурсів — це API для запиту та спільного використання ресурсів між Podʼами та контейнерами всередині Podʼа. Це узагальнення API для постійних томів для загальних ресурсів. Зазвичай ці ресурси є пристроями, такими як GPU.

Драйвери сторонніх ресурсів відповідають за відстеження та підготовку ресурсів, а виділення ресурсів здійснюється Kubernetes за допомогою _структурованих параметрів_ (введених у Kubernetes 1.30). Різні види ресурсів підтримують довільні параметри для визначення вимог та ініціалізації.

У версіях Kubernetes від 1.26 до 1.31 була реалізована (альфа) версія _classic DRA_, яка більше не підтримується. Ця документація для Kubernetes v{{< skew currentVersion >}}, пояснює поточний підхід до динамічного розподілу ресурсів у Kubernetes.

## {{% heading "prerequisites" %}}

Kubernetes v{{< skew currentVersion >}} включає підтримку API на рівні кластера для динамічного виділення ресурсів, але це [потрібно](#enabling-dynamic-resource-allocation) включити явно. Ви також повинні встановити драйвер ресурсів для конкретних ресурсів, які мають бути керовані за допомогою цього API. Якщо ви не використовуєте Kubernetes v{{< skew currentVersion>}}, перевірте документацію для цієї версії Kubernetes.

<!-- body -->

## API

{{< glossary_tooltip text="Групи API" term_id="api-group" >}} `resource.k8s.io/v1beta1` та `resource.k8s.io/v1beta2` надають наступні типи:

ResourceClaim
: Визначає запит на доступ до ресурсів у кластері для використання робочими навантаженнями. Наприклад, якщо робоче навантаження потребує пристрою прискорювача з певними властивостями, саме так виражається цей запит. Розділ статусу відстежує, чи було виконано цей запит і які конкретні ресурси було виділено.

ResourceClaimTemplate
: Визначає специфікацію та деякі метадані для створення ResourceClaims. Створюється користувачем під час розгортання робочого навантаження. Kubernetes автоматично створює та видаляє ResourceClaims для кожного Podʼа.

DeviceClass
: Містить заздалегідь визначені критерії вибору для певних пристроїв та їх конфігурацію. DeviceClass створюється адміністратором кластера під час встановлення драйвера ресурсів. Кожен запит на виділення пристрою в ResourceClaim повинен посилатися на один конкретний DeviceClass.

ResourceSlice
: Використовується драйверами DRA для публікації інформації про ресурси (в основному пристрої), які доступні у кластері.

DeviceTaintRule
: Використовується адміністраторами або компонентами панелі управління для додавання позначок taint до пристроїв, описаних у ResourceSlices.

Всі параметри які використовуються для вибору пристроїв визначаються ResourceClaim та DeviceClass за вбудованими типами. Параметри конфігурації можна вбудувати тут. Який параметр є валідним визначається драйвером DRA, Kubernetes лише передає їх без їх інтерпретації.

`PodSpec` `core/v1` визначає ResourceClaims, які потрібні для Podʼа в полі `resourceClaims`. Записи в цьому списку посилаються або на ResourceClaim, або на ResourceClaimTemplate. При посиланні на ResourceClaim всі Podʼи, які використовують цей PodSpec (наприклад, всередині Deployment або StatefulSet), спільно використовують один екземпляр ResourceClaim. При посиланні на ResourceClaimTemplate, кожен Pod отримує свій власний екземпляр.

Список `resources.claims` для ресурсів контейнера визначає, чи отримує контейнер доступ до цих екземплярів ресурсів, що дозволяє спільне використання ресурсів між одним або кількома контейнерами.

Нижче наведено приклад для умовного драйвера ресурсів. Для цього Podʼа буде створено два обʼєкти ResourceClaim, і кожен контейнер отримає доступ до одного з них.

```yaml
apiVersion: resource.k8s.io/v1beta2
kind: DeviceClass
metadata:
  name: resource.example.com
spec:
  selectors:
  - cel:
      expression: device.driver == "resource-driver.example.com"
---
apiVersion: resource.k8s.io/v1beta2
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        exactly:
          deviceClassName: resource.example.com
          selectors:
          - cel:
             expression: |-
                device.attributes["resource-driver.example.com"].color == "black" &&
                device.attributes["resource-driver.example.com"].size == "large"
---
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  containers:
  - name: container0
    image: ubuntu:20.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-0
  - name: container1
    image: ubuntu:20.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-1
  resourceClaims:
  - name: cat-0
    resourceClaimTemplateName: large-black-cat-claim-template
  - name: cat-1
    resourceClaimTemplateName: large-black-cat-claim-template
```

## Планування {#scheduling}

Планувальник відповідає за виділення ресурсів для ResourceClaim, коли Pod потребує їх. Він робить це, отримуючи повний список доступних ресурсів з обʼєктів ResourceSlice, відстежуючи, які з цих ресурсів вже були виділені наявним ResourceClaim, а потім вибираючи з тих ресурсів, що залишилися.

Єдиний тип підтримуваних ресурсів зараз — це пристрої. Пристрій має імʼя та кілька атрибутів та можливостей. Вибір пристроїв здійснюється за допомогою виразів CEL, які перевіряють ці атрибути та можливості. Крім того, набір вибраних пристроїв також може бути обмежений наборами, які відповідають певним обмеженням.

Обраний ресурс фіксується у статусі ResourceClaim разом з будь-якими вендор-специфічними налаштуваннями, тому коли Pod збирається запуститися на вузлі, драйвер ресурсу на вузлі має всю необхідну інформацію для підготовки ресурсу.

За допомогою структурованих параметрів планувальник може приймати рішення без спілкування з будь-якими драйверами ресурсів DRA. Він також може швидко планувати кілька Podʼів, зберігаючи інформацію про виділення ресурсів для ResourceClaim у памʼяті та записуючи цю інформацію в обʼєкти ResourceClaim у фоні, одночасно з привʼязкою Podʼа до вузла.

## Моніторинг ресурсів {#monitoring-resources}

Kubelet надає службу gRPC для забезпечення виявлення динамічних ресурсів запущених Podʼів. Для отримання додаткової інформації про точки доступу gRPC дивіться [звіт про виділення ресурсів](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).

## Попередньо заплановані Podʼи {#pre-scheduled-pods}

Коли ви, або інший клієнт API, створюєте Pod із вже встановленим `spec.nodeName`, планувальник пропускається. Якщо будь-який ResourceClaim, потрібний для цього Podʼа, ще не існує, не виділений або не зарезервований для Podʼа, то kubelet не зможе запустити Pod і періодично перевірятиме це, оскільки ці вимоги можуть бути задоволені пізніше.

Така ситуація також може виникнути, коли підтримка динамічного виділення ресурсів не була увімкнена в планувальнику на момент планування Podʼа (різниця версій, конфігурація, feature gate і т. д.). kube-controller-manager виявляє це і намагається зробити Pod працюючим, шляхом отримання потрібних ResourceClaims. Однак, це працює якщо вони були виділені планувальником для якогось іншого podʼа.

Краще уникати цього оминаючи планувальник, оскільки Pod, який призначений для вузла, блокує нормальні ресурси (ОЗП, ЦП), які потім не можуть бути використані для інших Podʼів, поки Pod є застряглим. Щоб запустити Pod на певному вузлі, при цьому проходячи через звичайний потік планування, створіть Pod із селектором вузла, який точно відповідає бажаному вузлу:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  nodeSelector:
    kubernetes.io/hostname: назва-призначеного-вузла
  ...
```

Можливо, ви також зможете змінити вхідний Pod під час допуску, щоб скасувати поле `.spec.nodeName` і використовувати селектор вузла замість цього.

## Адміністративний доступ {#admin-access}

{{< feature-state feature_gate_name="DRAAdminAccess" >}}

Ви можете позначити запит у ResourceClaim або ResourceClaimTemplate як такий, що має привілейовані можливості. Запит з правами адміністратора надає доступ до пристроїв, які використовуються, і
може увімкнути додаткові дозволи, якщо зробити пристрій доступним у
контейнері:

```yaml
apiVersion: resource.k8s.io/v1beta2
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        exactly:
          deviceClassName: resource.example.com
          allocationMode: All
          adminAccess: true
```

Якщо цю функцію вимкнено, поле `adminAccess` буде видалено автоматично при створенні такої вимоги до ресурсу.

Доступ адміністратора є привілейованим режимом і не повинен надаватися звичайним користувачам у багатокористувацьких кластерах. Починаючи з Kubernetes v1.33, лише користувачі, яким дозволено створювати обʼєкти ResourceClaim або ResourceClaimTemplate у просторах імен, позначених `resource.k8s.io/admin-access: "true"` (з урахуванням регістру) можуть використовувати поле `adminAccess`. Це гарантує, що користувачі, які не мають прав адміністратора, не зможуть зловживати цією можливістю.

## Статус пристрою ResourceClaim {#resourceclaim-device-status}

Драйвери можуть повідомляти дані про стан конкретного пристрою для кожного виділеного пристрою у вимозі на ресурс. Наприклад, IP-адреси, призначені пристрою мережевого інтерфейсу, можуть бути вказані у статусі ResourceClaim.

Драйвери встановлюють статус, точність інформації залежить від реалізації цих драйверів DRA. Тому стан пристрою, про який повідомляється, не завжди може відображати зміни стану пристрою в реальному часі.

Якщо цю функцію вимкнено, це поле автоматично очищується при збереженні ResourceClaim.

Статус пристрою в ResourceClaim підтримується, коли з драйвера DRA можна оновити наявний ResourceClaim, в якому встановлено поле `status.devices`.

## Список пріоритетів {#prioritized-list}

{{< feature-state feature_gate_name="DRAPrioritizedList" >}}

Ви можете надати пріоритетний список підзапитів для запитів у ResourceClaim. Потім планувальник вибере перший підзапит, який може бути розміщений. Це дозволяє користувачам вказати альтернативні пристрої, які можуть бути використані робочим навантаженням, якщо основний вибір недоступний.

У наведеному нижче прикладі шаблон ResourceClaimTemplate запросив пристрій чорного кольору і великого розміру. Якщо пристрій з цими атрибутами недоступний, він не може бути запланований. За допомогою функції пріоритетного списку можна вказати другу альтернативу, яка запитує два пристрої з білим кольором і маленьким розміром. Великий чорний пристрій буде призначено, якщо він доступний. Але якщо його немає, а два маленьких білих пристрої доступні, то pod все одно зможе працювати.

```yaml
apiVersion: resource.k8s.io/v1beta2
kind: ResourceClaimTemplate
metadata:
  name: prioritized-list-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        firstAvailable:
        - name: large-black
          deviceClassName: resource.example.com
          selectors:
          - cel:
              expression: |-
                device.attributes["resource-driver.example.com"].color == "black" &&
                device.attributes["resource-driver.example.com"].size == "large"
        - name: small-white
          deviceClassName: resource.example.com
          selectors:
          - cel:
              expression: |-
                device.attributes["resource-driver.example.com"].color == "white" &&
                device.attributes["resource-driver.example.com"].size == "small"
          count: 2
```

## Пристрої, що розділяються на розділи {#partitionable-devices}

{{< feature-state feature_gate_name="DRAPartitionableDevices" >}}

Пристрої, представлені в DRA, не обовʼязково мають бути одним пристроєм, підключеним до одного компʼютера, але також можуть бути логічними пристроями, що складаються з декількох пристроїв, підключених до декількох компʼютерів. Ці пристрої можуть споживати ресурси фізичних пристроїв, що перекриваються, а це означає, що при виділенні одного логічного пристрою інші пристрої будуть недоступні.

У ResourceSlice API це представлено у вигляді списку іменованих наборів CounterSets, кожен з яких містить набір іменованих лічильників. Лічильники представляють ресурси, доступні на фізичному пристрої, які використовуються логічними пристроями, оголошеними через DRA.

Логічні пристрої можуть вказувати список ConsumesCounters. Кожен запис містить посилання на CounterSet і набір іменованих лічильників з кількістю, яку вони будуть споживати. Отже, щоб пристрій можна було призначити, набори лічильників, на які є посилання, повинні мати достатню кількість для лічильників, на які посилається пристрій.

Наведемо приклад двох пристроїв, кожен з яких споживає по 6 гігабайтів памʼяті зі спільного лічильника з 8 гігабайтами памʼяті. Таким чином, тільки один з пристроїв може бути виділений у будь-який момент часу. Планувальник обробляє це, і це прозоро для споживача, оскільки API ResourceClaim не зачіпається.

```yaml
kind: ResourceSlice
apiVersion: resource.k8s.io/v1beta2
metadata:
  name: resourceslice
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 1
  driver: dra.example.com
  sharedCounters:
  - name: gpu-1-counters
    counters:
      memory:
        value: 8Gi
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

## Позначки taint та толерування їх пристроями {#device-taints-and-tolerations}

{{< feature-state feature_gate_name="DRADeviceTaints" >}}

Позначки taint пристроїв подібні до позначок вузлів: позначка має рядок-ключ, рядок-значення та ефект. Ефект застосовується до ResourceClaim, який використовує познапчений пристрій, і до всіх Podʼів, що посилаються на цей ResourceClaim. Ефект “NoSchedule" запобігає плануванню цих Podʼів. Позначені пристрої ігноруються при спробі виділити ResourceClaim, тому що їх використання перешкоджає плануванню для Podʼів.

Ефект "NoExecute” означає "NoSchedule" і, крім того, спричиняє виселення всіх Podʼів, які вже були заплановані. Це виселення реалізовано у контролері виселення позначених пристроїв у kube-controller-manager шляхом видалення відповідних Podʼів.

ResourceClaims можуть толерантно ставитися до позначок. Якщо позначка толерується, її ефект не застосовується. Порожня толерантність відповідає всім позначкам. Толерантність може бути обмежена певними ефектами та/або відповідати певним парам ключ/значення. Толерантність може перевіряти існування певного ключа, незалежно від того, яке значення він має, або перевіряти конкретні значення ключа. Для отримання додаткової інформації про таке зіставлення див. [концепції поначення вузлів](/docs/concepts/scheduling-eviction/taint-and-toleration#concepts).

Виселення може бути відкладено за допомогою толерантності до позначки протягом певного часу. Ця затримка починається з моменту додавання позначки на пристрій, що записується у полі taint.

Позначки застосовуються, як описано вище, також до ResourceClaims, що виділяють «всі» ("all") пристрої на вузлі. Всі пристрої не повинні бути позначені, або всі їхні позначки повинні бути толеровані. Виділення пристрою з доступом адміністратора (описано [вище](#admin-access)) також не є винятком. Адміністратор, який використовує цей режим, повинен явно толерантно ставитися до всіх позначок, щоб отримати доступ до позначених пристроїв.

Позначки можуть бути додані до пристроїв двома різними способами:

### Позначки встановлені драйвером {#taints-set-by-the-driver}

Драйвер DRA може додавати позначки до інформації про пристрій, яку він публікує у ResourceSlices. Зверніться до документації драйвера DRA, щоб дізнатися, чи використовує він позначки і які їхні ключі та значення.

### Позначки встановлені адміністратором {#taints-set-by-an-admin}

Адміністратор або компонент панелі управління може додавати позначуи на пристрої без необхідності вказувати драйверу DRA включати позначки до інформації про пристрій у ResourceSlices. Вони роблять це шляхом створення DeviceTaintRules. Кожне DeviceTaintRule додає одну позначку до пристроїв, які відповідають селектору пристрою. Без такого селектора жоден пристрій не буде позначений. Це ускладнює випадкове виселення всіх пристроїв за допомогою ResourceClaims, якщо помилково не вказати селектор.

Пристрої можна вибрати, вказавши імʼя класу DeviceClass, драйвера, пулу та/або пристрою. Клас пристроїв вибирає всі пристрої, які вибрані селекторами у цьому класі пристроїв. Маючи лише імʼя драйвера, адміністратор може позначити всі пристрої, що керуються цим драйвером, наприклад, під час виконання певного виду обслуговування цього драйвера у всьому кластері. Додавання назви пулу може обмежити позначення до одного вузла, якщо драйвер керує локальними пристроями вузла.

Нарешті, додаванням назви пристрою можна вибрати один конкретний пристрій. За бажанням, назву пристрою і назву пулу можна використовувати окремо. Наприклад, драйверам для локальних пристроїв рекомендується використовувати назву вузла як назву пулу. У такому разі позначення з таким іменем пулу автоматично призведе до позначення усіх пристроїв на вузлі.

Драйвери можуть використовувати стабільні назви на зразок «gpu-0», які приховують, який саме пристрій наразі призначено для цієї назви. Для підтримки позначення певного екземпляра обладнання у правилі DeviceTaintRule можна використовувати селектори CEL, які відповідатимуть унікальному атрибуту ідентифікатора виробника, якщо драйвер підтримує такий атрибут для свого обладнання.

Позначення застосовується доти, доки існує правило DeviceTaintRule. Його можна будь-коли змінити або вилучити. Ось один із прикладів DeviceTaintRule для вигаданого драйвера DRA:

```yaml
apiVersion: resource.k8s.io/v1alpha3
kind: DeviceTaintRule
metadata:
  name: example
spec:
  # Усе апаратне забезпечення для цього
  # конкретного драйвера зламано.
  # Виселити всі підсистеми і не планувати нові.
  deviceSelector:
    driver: dra.example.com
  taint:
    key: dra.example.com/unhealthy
    value: Broken
    effect: NoExecute
```

## Увімкнення динамічного виділення ресурсів {#enabling-dynamic-resource-allocation}

Динамічне виділення ресурсів є _бета-функцією_, яка стандартно вимкнена, та увімкнена коли увімкнуто [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `DynamicResourceAllocation` та {{< glossary_tooltip text="групу API" term_id="api-group" >}} `resource.k8s.io/v1beta1` та `resource.k8s.io/v1beta2`. Для отримання деталей щодо цього дивіться параметри [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/) `--feature-gates` та `--runtime-config`. Також варто увімкнути цю функцію в kube-scheduler, kube-controller-manager та kubelet.

Коли драйвер ресурсу повідомляє про стан пристроїв, то слід увімкнути функцію `DRAResourceClaimDeviceStatus` на додаток до `DynamicResourceAllocation`.

Швидка перевірка того, чи підтримує кластер Kubernetes цю функцію, полягає у виведенні обʼєктів DeviceClass за допомогою наступної команди:

```shell
kubectl get deviceclasses
```

Якщо ваш кластер підтримує динамічне виділення ресурсів, відповідь буде або список обʼєктів DeviceClass, або:

```none
No resources found
```

Якщо це не підтримується, буде виведено помилку:

```none
error: the server doesn't have a resource type "deviceclasses"
```

Типова конфігурація kube-scheduler вмикає втулок "DynamicResources" лише в разі увімкнення функціональної можливості та при використанні конфігурації API v1. Налаштування конфігурації може змінюватися, щоб включити його.

Крім увімкнення функції в кластері, також потрібно встановити драйвер ресурсів. Для отримання додаткової інформації звертайтеся до документації драйвера.

### Увімкнення адміністративного доступу {#enabling-admin-access}

[Адміністративний доступ](#admin-access) є _альфа-функцією_ і вмикається лише тоді, коли у kube-apiserver та kube-планувальнику увімкнено [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `DRAAdminAccess`.

### Увімкнення Device Status {#enabling-device-status}

[ResourceClaim Device Status](#resourceclaim-device-status) є _альфа-функцією_ і вмикається лише тоді, коли [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `DRAResourceClaimDeviceStatus` увімкнено у kube-apiserver.

### Увімкнення Prioritized List {#enabling-prioritized-list}

[Prioritized List](#prioritized-list) є _альфа-функцією_ і вмикається лише тоді, коли у kube-apiserver та kube-scheduler увімкнено [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `DRAPrioritizedList`. Також потрібно, щоб було увімкнено [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `DynamicResourceAllocation`.

### Увімкнення Partitionable Devices {#enabling-prioritized-list}

[Partitionable Devices](#partitionable-devices) - це _альфа-функція_, яку увімкнено лише тоді, коли у kube-apiserver та kube-scheduler увімкнено [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `DRAPartitionableDevices`.

### Увімкнення позначення та толерування позначок taint пристроїів {#enabling-device-taints-and-tolerations}

[Позначення та толерування позначок taint пристроїв](#device-taints-and-tolerations) є *альфа-функцією* і вмикається лише тоді, коли увімкнено [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `DRADeviceTaints` у kube-apiserver, kube-controller-manager та kube-scheduler. Для використання DeviceTaintRules має бути увімкнена версія API `resource.k8s.io/v1alpha3`.

## {{% heading "whatsnext" %}}

- Для отримання додаткової інформації про дизайн дивіться KEP: [Dynamic Resource Allocation with Structured Parameters](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters).
