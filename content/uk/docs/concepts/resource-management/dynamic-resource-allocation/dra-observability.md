---
title: Спостережуваність динамічних ресурсів
content_type: concept
weight: 30
api_metadata:
- apiVersion: "resource.k8s.io/v1alpha3"
  kind: "ResourcePoolStatusRequest"
---

<!-- overview -->

Ця сторінка описує, як спостерігати за статусом і справністю ресурсів, які динамічно виділяються за допомогою DRA.

<!-- body -->

## Спостережуваність динамічних ресурсів {#observability-dynamic-resources}

Ви можете перевірити статус динамічно виділених ресурсів, використовуючи будь-який із наступних методів:

* [метрики пристроїв kubelet](#monitoring-resources)
* [статус пристрою ResourceClaim](#resourceclaim-device-status)
* [моніторинг справності пристроїв](#device-health-monitoring)

### Метрики пристроїв kubelet {#monitoring-resources}

Служба gRPC `PodResourcesLister` kubelet дозволяє вам контролювати пристрої, що використовуються. Повідомлення `DynamicResource` надає інформацію, специфічну для динамічного виділення ресурсів, таку як назва пристрою та назва заявки. Детальніше див. [Моніторинг ресурсів втулків пристроїв](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).

### Статус пристрою ResourceClaim {#resourceclaim-device-status}

{{< feature-state feature_gate_name="DRAResourceClaimDeviceStatus" >}}

Драйвери DRA можуть повідомляти специфічні для драйвера дані [статусу пристрою](/docs/concepts/overview/working-with-objects/#object-spec-and-status) для кожного виділеного пристрою в полі `status.devices` заявки на ресурс. Наприклад, драйвер може перелічувати IP-адреси, призначені пристрою мережевого інтерфейсу. Оновлення цього поля вимагає спеціальних синтетичних дозволів RBAC, див. [Посібник із зміцнення безпеки — динамічний розподіл ресурсів](/docs/concepts/security/hardening-guide/dynamic-resource-allocation/) та [Посилення безпеки динамічного розподілу ресурсів у вашому кластері](/docs/tasks/administer-cluster/hardening-dra/).

Точність інформації, яку драйвер додає до поля `status.devices` заявки на ресурс, залежить від драйвера. Оцінюйте драйвери, щоб вирішити, чи можете ви покладатися на це поле як на єдине джерело інформації про пристрої.

Якщо ви вимкнете функціональну можливість [`DRAResourceClaimDeviceStatus`](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourceClaimDeviceStatus), поле `status.devices` автоматично очищається під час зберігання заявки на ресурс. Статус пристрою заявки на ресурс підтримується, коли з боку драйвера DRA можливо оновити наявну заявку на ресурс, у якій встановлено поле `status.devices`.

У наведеному нижче прикладі поле `status.devices` заявки на ресурс було заповнено драйвером (`resource-driver.example.com`), відповідальним за керування виділеним пристроєм:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
metadata:
  name: macvlan-eth0
spec:
...
status:
  allocation:
    devices:
      results:
      - device: eth0
        driver: resource-driver.example.com
        pool: nic-worker-a
        request: macvlan-eth0
        shareID: 8e7acdf9-0290-4ecd-a801-a654b021d2b7
        consumedCapacity:
          resource-driver.example.com/bandwidth: 1G
  devices:
  - conditions:
    - lastTransitionTime: "2025-10-21T08:38:17Z"
      message: Device successfully allocated and assigned to the pod
      reason: NetworkReady
      status: "True"
      type: NetworkReady
    device: eth0
    driver: resource-driver.example.com
    networkData:
      hardwareAddress: 00:01:ec:84:fb:51
      interfaceName: net1
      ips:
      - 10.10.1.2/24
      - 2001:db8::1/64
    pool: nic-worker-a
    shareID: 8e7acdf9-0290-4ecd-a801-a654b021d2b7
```

Якщо пристрій не було виділено, запит драйвера на оновлення поля `status.devices` заявки на ресурс із цим пристроєм відхиляється. Коли пристрій вивільняється (видаляється з `status.allocation.devices`), відповідний запис у `status.devices` автоматично видаляється.

Детальніше про поле `status.devices` див. у довіднику API {{< api-reference page="resource/resource-claim-v1" anchor="ResourceClaimStatus" text="ResourceClaim" >}}.

### Моніторинг справності пристроїв {#device-health-monitoring}

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

Kubernetes надає механізм для моніторингу та звітування про справність динамічно виділених ресурсів інфраструктури. Для  застосунків зі збереженям стану, що працюють на спеціалізованому обладнанні, критично важливо знати, коли пристрій вийшов з ладу або став несправним. Також корисно дізнаватися, чи відновлюється пристрій.

Щоб використовувати цю функціональність, функціональна можливість [`ResourceHealthStatus`](/docs/reference/command-line-tools-reference/feature-gates/resource-health-status/#ResourceHealthStatus) `ResourceHealthStatus` має бути увімкнена (бета та стандартно увімкнена з v1.36), а драйвер DRA має реалізовувати службу gRPC `DRAResourceHealth`.

Коли драйвер DRA виявляє, що виділений пристрій став несправним, він повідомляє цей статус назад до kubelet. Ця інформація про справність потім безпосередньо відображається в статусі Podʼа. kubelet заповнює поле `allocatedResourcesStatus` у статусі кожного контейнера, деталізуючи справність кожного пристрою, призначеного цьому контейнеру. Кожен запис про справність ресурсу може містити необовʼязкове поле `message` з додатковим контекстом, зрозумілим людині, про стан справності, наприклад, деталі помилки або причини збою.

Якщо kubelet не отримує оновлення про справність від драйвера DRA протягом періоду очікування, статус справності пристрою позначається як "Unknown". Драйвери DRA можуть налаштовувати цей період очікування для кожного пристрою окремо, встановлюючи поле `health_check_timeout_seconds` у повідомленні gRPC `DeviceHealth`. Якщо не вказано, kubelet використовує стандартний період очікування 30 секунд. Це дозволяє різним типам обладнання (наприклад, GPU, FPGA або пристроям зберігання) використовувати відповідні значення періоду очікування на основі їхніх характеристик звітування про справність.

Це забезпечує критично важливу видимість для користувачів і контролерів, щоб реагувати на збої обладнання. Для Podʼа, який зазнає збою, ви можете перевірити цей статус, щоб визначити, чи був збій повʼязаний із несправним пристроєм.

{{< note >}}
Статус справності пристрою не оновлюється в статусі Podʼа після завершення роботи Podʼа (наприклад, у стані Failed).
{{< /note >}}

## Статус пулу ресурсів {#resource-pool-status}

{{< feature-state feature_gate_name="DRAResourcePoolStatus" >}}

Ви можете запитувати доступність пристроїв у пулах ресурсів за допомогою API ResourcePoolStatusRequest. Це забезпечує видимість того, скільки пристроїв доступно, виділено або недоступно в пулах ресурсів DRA вашого кластера.

Щоб перевірити статус пулу ресурсів:

1. Створіть ResourcePoolStatusRequest, вказавши назву драйвера (обовʼязково) та, за бажанням, обмеження на кількість повернутих пулів. Ви також можете обмежити його одним пулом, вказавши назву пулу:

   ```yaml
   apiVersion: resource.k8s.io/v1alpha3
   kind: ResourcePoolStatusRequest
   metadata:
     name: check-gpus
   spec:
     driver: example.com/gpu
     # Optional: filter to a specific pool
     # poolName: my-pool
     # Optional: limit number of pools returned (default: 100, max: 1000)
     # limit: 10
   ```

1. Дочекайтеся, поки контролер обробить запит:

   ```shell
   kubectl wait --for=condition=Complete resourcepoolstatusrequest/check-gpus --timeout=30s
   ```

1. Прочитайте статус, щоб побачити доступність пулу:

   ```shell
   kubectl get resourcepoolstatusrequest/check-gpus -o yaml
   ```

   Статус включає:
   * `poolCount`: загальна кількість пулів, що відповідають фільтру (може перевищувати кількість перелічених пулів, якщо результат обрізано обмеженням).
   * `pools`: список деталей пулів, кожен з яких містить:
     * `driver` та `poolName`: ідентифікують пул.
     * `generation`: останнє покоління пулу, яке спостерігалось в ResourceSlices.
     * `resourceSliceCount`: кількість ResourceSlices, що складають пул.
     * `totalDevices`: загальна кількість пристроїв у пулі.
     * `allocatedDevices`: пристрої, наразі виділені заявкам.
     * `availableDevices`: пристрої, доступні для виділення
       (totalDevices - allocatedDevices - unavailableDevices).
     * `unavailableDevices`: пристрої, недоступні через позначки taint або інші стани.
     * `nodeName`: вузол, повʼязаний із пулом, якщо такий є.
     * `validationError`: встановлюється, коли дані пулу не вдалося повністю перевірити (наприклад, під час розгортання покоління). Коли встановлено, поля кількості пристроїв можуть бути невстановленими.
     * `partitionSummary`: для пулів з [пристроями, що розділяються на розділи](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices), можливість виділення за типом розділу (див. [Підсумок розділів](#resource-pool-partition-summary)).
     * `shareableSummary`: для пулів з [пристроями, що можуть спільно використовуватися](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity), сукупне використання ємності (див. [Підсумок спільного використання](#resource-pool-shareable-summary)).
   * `conditions`: включає типи умов `Complete` (успіх) або `Failed` (помилка).

1. Видаліть запит, коли закінчите:

   ```shell
   kubectl delete resourcepoolstatusrequest/check-gpus
   ```

Обʼєкти ResourcePoolStatusRequest обробляються один раз контролером у kube-controller-manager. Специфікація є незмінною після створення, а весь обʼєкт стає незмінним після заповнення статусу. Щоб отримати оновлені дані про доступність, видаліть і перестворіть запит. Завершені запити автоматично очищаються через 1 годину.

Ця функція вимагає явних дозволів RBAC на ресурс ResourcePoolStatusRequest. Жодна стандартна ClusterRole не включає цей дозвіл.

Статус пулу ресурсів контролюється функціональною можливістю [`DRAResourcePoolStatus`](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus) у `kube-apiserver` та `kube-controller-manager`.

### Підсумок розділу {#resource-pool-partition-summary}

{{< feature-state feature_gate_name="DRAPartitionableDevicesType" >}}

Один фізичний пристрій, такий як GPU, може бути опублікований як кілька типів розділів (наприклад, повний GPU проти половинного розділу MIG), які використовують ті самі спільні лічильники. Оскільки ці розділи конкурують за ту саму базову ємність, проста кількість пристроїв не показує, скільки пристроїв кожного типу ще можна виділити. Для пулів з [пристроями, що розділяються на розділи](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices) представлення `partitionSummary` відповідає на це питання. Для кожного типу розділу воно повідомляє:

* `attribute`: повне імʼя атрибута пристрою, значення якого групує цей запис. Це `spec.partitionTypeAttribute` обʼєкта ResourceSlice або `spec.defaultPartitionTypeAttribute` запиту, коли розділ не оголошує жодного.
* `type`: значення цього атрибута на пристрої (наприклад, `Full` або `Half`).
* `total`: кількість пристроїв цього типу розділу в пулі.
* `allocatable`: скільки *додаткових* пристроїв цього типу розділу ще можна було б виділити з урахуванням поточного споживання спільних лічильників.

Названий атрибут має бути рядковим атрибутом. Якщо атрибут типу розділу пристрою, що розділяється на розділи, відсутній або не є рядком (наприклад, ціле число, булеве значення або версія), пул повідомляє про помилку перевірки замість підсумку розділів. Немає спеціальної обробки для [атрибутів типу список](/docs/reference/command-line-tools-reference/feature-gates/#DRAListTypeAttributes); не-рядковий атрибут просто не є дійсним атрибутом типу розділу.

Щоб створити це представлення, драйвер позначає кожен пристрій, що розділяється на розділи, рядковим атрибутом, значення якого називає тип розділу, і вказує цей атрибут у полі `partitionTypeAttribute` обʼєкта ResourceSlice:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
# ...
spec:
  # Кожен пристрій, що підтримує розділення на розділи, у цьому сегменті має цей атрибут; пристрої,
  # які мають однакове значення, несуть однакові витрати на спільний лічильник.
  partitionTypeAttribute: gpu.example.com/profile
```

Якщо драйвер ще не оновлено для оголошення `partitionTypeAttribute`, запит все одно може отримати підсумок розділів, вказавши резервний атрибут у своїй специфікації. Власний `partitionTypeAttribute` розділу завжди має перевагу; стандартне значення на рівні запиту застосовується лише до пристроїв, чий розділ не оголошує його:

```yaml
apiVersion: resource.k8s.io/v1alpha3
kind: ResourcePoolStatusRequest
metadata:
  name: check-gpu-partitions
spec:
  driver: gpu.example.com
  # Запасний атрибут групування для фрагментів, у яких він не вказаний.
  defaultPartitionTypeAttribute: gpu.example.com/profile
```

Коли ні розділ, ні запит не вказують атрибут, пул з пристроями, що розділяються на розділи, не повідомляє `partitionSummary`.

Представлення `partitionSummary` контролюється функціональною можливістю [`DRAPartitionableDevicesType`](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevicesType) у `kube-apiserver` та `kube-controller-manager`, яка, своєю чергою, вимагає увімкнення функціональних можливостей [`DRAResourcePoolStatus`](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus) та [`DRAPartitionableDevices`](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices).

### Підсумок спільного використання {#resource-pool-shareable-summary}

Для пулів, що містять [пристрої, які можуть спільно використовуватися](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity) (пристрої, які встановлюють `allowMultipleAllocations` і можуть споживатися кількома заявками), `shareableSummary` повідомляє сукупне використання ємності в межах пулу:

* `fullyAvailableDevices`: пристрої, що можуть спільно використовуватися, з неспожитою ємністю.
* `partiallyAvailableDevices`: пристрої, що можуть спільно використовуватися, з частково спожитою ємністю.
* `capacity`: для кожної назви ємності сукупні обсяги `total`, `consumed` та `available` (`total` мінус `consumed`, ніколи не відʼємне) у межах пулу.

`shareableSummary` заповнюється лише тоді, коли принаймні один пристрій у пулі може спільно використовуватися. Він є частиною функції [статусу пулу ресурсів](#resource-pool-status) (функціональна можливість [`DRAResourcePoolStatus`](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus)) і не вимагає `DRAPartitionableDevicesType`; пристрої, що можуть спільно використовуватися, які він підсумовує, походять із функції [споживчої ємності](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#consumable-capacity).

## Метадані пристроїв DRA в контейнерах {#device-metadata}

{{< feature-state state="beta" for_k8s_version="v1.37" >}}

Драйвери DRA можуть надавати метадані пристроїв, такі як атрибути пристроїв (адреси шини PCI або UUID медійованих пристроїв) та мережеву конфігурацію, безпосередньо контейнерам у вигляді JSON-файлів. Це дозволяє застосункам дізнаватися інформацію про виділені пристрої без запитів до API Kubernetes або використання власних контролерів.

KEP-5304 визначає [протокол метаданих пристроїв](#device-metadata-protocol), якого драйвери мають дотримуватися, щоб застосунки бачили узгоджену структуру в різних драйверах і кластерах. [Бібліотека втулка kubelet DRA](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin) реалізує цей протокол.

Метадані пристроїв підпорядковуються тим самим правилам, що й доступ до пристроїв: вони доступні всередині контейнера лише тоді, коли цей контейнер запитує пристрій. Детальніше див. [Запит пристроїв у робочих навантаженнях за допомогою DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/#request-devices-workloads).

### Протокол метаданих пристроїв {#device-metadata-protocol}

Протокол складається з чотирьох правил:

1. **Шляхи до файлів.** Файли метаданих розташовані всередині контейнерів у `/var/run/kubernetes.io/dra-device-attributes`. Для безпосередньо згаданої заявки на ресурс шлях має вигляд `resourceclaims/<claimName>/<requestName>/<driverName>-metadata.json`. Для заявки, створеної з шаблону заявки на ресурс, шлях має вигляд `resourceclaimtemplates/<podClaimName>/<requestName>/<driverName>-metadata.json`, де `podClaimName` — це `pod.spec.resourceClaims[].name`.

   Коли запит використовує [список пріоритетів](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#prioritized-list), для сегмента шляху `<requestName>` використовується лише назва запиту верхнього рівня. Поле `requests[].name` у файлі містить повне посилання `<request>/<subrequest>`, наприклад `gpu/high-memory`.

   Константи шляхів визначені в [`k8s.io/dynamic-resource-allocation/api/metadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata).

1. **JSON API.** Кожен файл є потоком одного або кількох обʼєктів [`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1beta1#DeviceMetadata). Кожен обʼєкт має `apiVersion` та `kind`, відповідно до домовленостей API Kubernetes. Ті самі метадані кодуються один раз для кожної налаштованої версії API в порядку, вибраному драйвером. Споживачі використовують першу версію, яку вони можуть декодувати, і пропускають невідомі версії. Пошкоджений обʼєкт у відомій версії є помилкою.

1. **Покоління.** Початковий файл має `metadata.generation`, встановлене на `1`. Кожне оновлення збільшує покоління, щоб споживачі могли виявляти зміни.

1. **Надання контейнеру.** Бібліотека втулка kubelet DRA використовує {{< glossary_tooltip text="CDI" term_id="cdi" >}} для bind-mount кожного файлу лише для читання. Інші реалізації можуть використовувати інший механізм, якщо файл зʼявляється за необхідним шляхом і є доступним лише для читання.

### Увімкнення метаданих пристроїв у драйвері {#device-metadata-enable}

Метадані пристроїв — це функція на стороні драйвера. Вона не має функціональної можливості Kubernetes і стандартно вимкнена у бібліотеці втулка kubelet DRA. Драйвер має увімкнути
функцію та явно вибрати версії, які він записує:

```go
kubeletplugin.EnableDeviceMetadata(true, []schema.GroupVersion{
	metadatav1beta1.SchemeGroupVersion,
	metadatav1alpha1.SchemeGroupVersion,
})
```

Версія `v1beta1` є обовʼязковою. Драйвер також може записувати `v1alpha1` для сумісності зі старішими споживачами. Порядок у зрізі є порядком у потоці метаданих; фреймворк не сортує версії. Драйвери мають ставити найновішу версію першою. Увімкнення метаданих пристроїв без версій, без `v1beta1` або з невідомою версією призводить до збою втулка під час запуску.

Для кожного підготовленого пристрою драйвер може заповнити [`Device.Metadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#Device) за допомогою [`kubeletplugin.DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#DeviceMetadata). Драйвери мають включати атрибути, які вони публікують для цього пристрою в його ResourceSlice, щоб робочі навантаження бачили ту саму інформацію під час виконання. Драйвери можуть також включати атрибути, які мають значення лише під час виконання. Для мережевих пристроїв, драйвери можуть додавати назви інтерфейсів, IP-адреси та апаратні адреси після конфігурації CNI, викликаючи [`UpdateRequestMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#Helper.UpdateRequestMetadata).

Посилання на API втулка kubelet вище описують інтеграцію для авторів драйверів. Фреймворк DRA не визначає універсального прапора командного рядка, тому оператори кластерів вмикають функцію через конфігурацію розгортання, надану їхнім драйвером.

Коли увімкнено, бібліотека втулка kubelet DRA записує файли метаданих під час підготовки виділених пристроїв. Вона також записує специфікації CDI до `/var/run/cdi` за замовчуванням. Середовище виконання контейнерів має бути налаштоване на виявлення специфікацій CDI з цього каталогу. Бібліотека визначає мінімальну версію специфікації CDI, необхідну для кожної згенерованої специфікації.

Коли один запит виділяє пристрої від кількох драйверів DRA, кожен драйвер записує власний файл метаданих. Споживачі, які знають назву драйвера, мають побудувати точний шлях із назв заявки, запиту та драйвера. Споживачі Go можуть використовувати [`ReadResourceClaimMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata#ReadResourceClaimMetadata) або [`ReadResourceClaimTemplateMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata#ReadResourceClaimTemplateMetadata), щоб прочитати та обʼєднати всі файли кожного драйвера для запиту.

### Схема метаданих {#device-metadata-schema}

Кожен обʼєкт у файлі метаданих відповідає API [`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1beta1#DeviceMetadata) (`metadata.resource.k8s.io/v1beta1`).

Схема містить:

* Стандартні метадані обʼєкта для заявки на ресурс, включаючи її назву, простір імен, UID та покоління метаданих.
* Необовʼязкове `podClaimName` для заявки, згенерованої з шаблону заявки на ресурс.
* Список запитів. Кожен запит має обовʼязкову назву та список виділених пристроїв.
* Драйвер, пул та назву для кожного пристрою.
* Необовʼязкові атрибути пристроїв та мережеві дані.

Значення атрибутів використовують те саме представлення, що й атрибути пристроїв ResourceSlice. Кожен атрибут має рівно одне скалярне значення (`int`, `bool`, `string` або `version`) або значення списку (`ints`, `bools`, `strings` або `versions`). Значення ємності пристроїв не включаються в метадані пристроїв.

Мережеві дані можуть містити `interfaceName`, `ips` та `hardwareAddress`. Про обмеження полів див. [документацію API `DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1beta1#DeviceMetadata).

Наведений нижче приклад показує один обʼєкт у потоці метаданих для пристрою GPU, виділеного через шаблон заявки на ресурс:

```json
{
  "kind": "DeviceMetadata",
  "apiVersion": "metadata.resource.k8s.io/v1beta1",
  "metadata": {
    "name": "pod0-gpu-2kqrd",
    "namespace": "gpu-test1",
    "uid": "c7e7b22e-239b-4498-b27c-7f1344481e14",
    "generation": 1
  },
  "podClaimName": "gpu",
  "requests": [
    {
      "name": "gpu",
      "devices": [
        {
          "driver": "gpu.example.com",
          "pool": "worker-0",
          "name": "gpu-0",
          "attributes": {
            "driverVersion": {
              "version": "1.0.0"
            },
            "index": {
              "int": 0
            },
            "model": {
              "string": "LATEST-GPU-MODEL"
            },
            "uuid": {
              "string": "gpu-18db0e85-99e9-c746-8531-ffeb86328b39"
            }
          }
        }
      ]
    }
  ]
}
```

Втулок kubelet DRA не перевіряє метадані перед їх записом. Споживачі Go можуть увімкнути згенеровану перевірку під час декодування потоку. Декодування та перевірка мають окремі результати: помилка перевірки не перешкоджає поверненню успішно декодованого обʼєкта. Про використання див. [Доступ до метаданих пристроїв DRA](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/#read-metadata-application).

### Негайні та відкладені метадані {#device-metadata-lifecycle}

Для негайних метаданих драйвер надає атрибути або мережеві дані під час підготовки заявки. Втулок kubelet DRA записує файл із поколінням `1` до запуску контейнера, що споживає.

Для відкладених метаданих драйвер може підготувати пристрій без атрибутів або мережевих даних. Початковий файл із поколінням `1` містить ідентичність пристрою. Пізніше драйвер викликає `UpdateRequestMetadata`, щоб атомарно замінити повний потік і збільшити покоління. Оновлення вимагає існування початкового файлу. Якщо підготовка пристрою не повертає жодних пристроїв для запиту, фреймворк не створює ні файлу метаданих, ні пристрою CDI метаданих для цього запиту.

Метадані залишаються доступними для кожного контейнера, що їх споживає, протягом усього життєвого циклу цього контейнера. Фреймворк видаляє файли метаданих та специфікації CDI після скасування підготовки заявки.

Щоб дізнатися, як використовувати метадані пристроїв у ваших робочих навантаженнях, див. [Доступ до метаданих пристроїв DRA](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/).

### Власні драйвери {#device-metadata-custom-drivers}

Власні драйвери, які не використовують бібліотеку втулка kubelet DRA, мають самостійно реалізувати [протокол метаданих пристроїв](#device-metadata-protocol). Це включає запис версіонованого потоку `DeviceMetadata` за правильними шляхами, збільшення `metadata.generation` при кожному оновленні та надання файлів лише для читання через CDI або еквівалентний механізм.
