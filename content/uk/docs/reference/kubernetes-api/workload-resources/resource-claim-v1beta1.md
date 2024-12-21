---
api_metadata:
  apiVersion: "resource.k8s.io/v1beta1"
  import: "k8s.io/api/resource/v1beta1"
  kind: "ResourceClaim"
content_type: "api_reference"
description: "ResourceClaim описує запит на доступ до ресурсів у кластері для використання робочими навантаженнями."
title: "ResourceClaim v1beta1"
weight: 16
auto_generated: true
---

<!--
The file was copied and updated manually from the v1alpha3 API.
The content is not quite up-to-date, which needs to be fixed
by generating the file automatically.
-->

`apiVersion: resource.k8s.io/v1beta1`

`import "k8s.io/api/resource/v1beta1"`

## ResourceClaim {#ResourceClaim}

ResourceClaim описує запит на доступ до ресурсів у кластері, для використання робочими навантаженнями. Наприклад, якщо робоче навантаження потребує пристрою-акселератора з конкретними властивостями, ось як виражається цей запит. Розділ статусу відстежує, чи було задоволено цей запит і які саме ресурси були виділені.

Це альфа-тип і потребує увімкнення функціональної можливості DynamicResourceAllocation.

---

- **apiVersion**: resource.k8s.io/v1beta1

- **kind**: ResourceClaim

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта

- **spec** (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaimSpec" >}}">ResourceClaimSpec</a>), обовʼязково

  Spec описує, що запитується і як це налаштувати. Специфікація є незмінною.

- **status** (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaimStatus" >}}">ResourceClaimStatus</a>)

  Status описує, чи заявка готова до використання і що було виділено.

## ResourceClaimSpec {#ResourceClaimSpec}

ResourceClaimSpec визначає, що запитується в ResourceClaim і як це налаштувати.

---

- **controller** (string)

  Controller — це імʼя драйвера DRA, який призначений для обробки розподілу цієї заявки. Якщо поле порожнє, розподіл обробляється планувальником під час планування podʼа.

  Має бути піддоменом DNS і закінчуватися доменом DNS, що належить постачальнику драйвера.

  Це альфа-поле і вимагає активації функціональної можливості DRAControlPlaneController.

- **devices** (DeviceClaim)

  Devices визначає як запитувати пристрої.

  <a name="DeviceClaim"></a>
  *DeviceClaim визначає, як запитувати пристрої за допомогою ResourceClaim.*

  - **devices.config** ([]DeviceClaimConfiguration)

    *Atomic: буде замінено під час злиття*

    Це поле містить конфігурацію для декількох потенційних драйверів, які можуть задовольнити запити у цій заявці. Воно ігнорується під час призначення заявки.

    <a name="DeviceClaimConfiguration"></a>
    *DeviceClaimConfiguration використовується для параметрів конфігурації у DeviceClaim.*

    - **devices.config.opaque** (OpaqueDeviceConfiguration)

      Opaque надає специфічні для драйвера параметри конфігурації.

      <a name="OpaqueDeviceConfiguration"></a>
      *OpaqueDeviceConfiguration містить параметри конфігурації драйвера у форматі, визначеному постачальником драйвера.*

      - **devices.config.opaque.driver** (string), обовʼязково

        Драйвер використовується для визначення того, якому втулку kubelet потрібно передати ці конфігураційні параметри.

        Політика допуску, надана розробником драйвера, може використовувати цей параметр, щоб вирішити, чи потрібно їх перевіряти.

        Має бути субдоменом DNS і закінчуватися на DNS-домені, що належить постачальнику драйвера.

      - **devices.config.opaque.parameters** (RawExtension), обовʼязково

        Параметри можуть містити довільні дані. Відповідальність за перевірку та керування версіями покладається на розробника драйверів. Зазвичай це включає самоідентифікацію та версію ("kind" + "apiVersion" для типів Kubernetes), а також конвертацію між різними версіями.

        <a name="RawExtension"></a>
        *RawExtension використовується для зберігання розширень у зовнішніх версіях.*

        Щоб використовувати це, створіть поле, яке має тип RawExtension у вашій зовнішній, версійованій структурі, і Object у вашій внутрішній структурі. Також потрібно зареєструвати ваші різні типи втулків.

        // Внутрішній пакунок:

          ```go
        	type MyAPIObject struct {
        		runtime.TypeMeta `json:",inline"`
        		MyPlugin runtime.Object `json:"myPlugin"`
        	}

        	type PluginA struct {
        		AOption string `json:"aOption"`
        	}
          ```

        // Зовнішній пакунок:

          ```go
        	type MyAPIObject struct {
        		runtime.TypeMeta `json:",inline"`
        		MyPlugin runtime.RawExtension `json:"myPlugin"`
        	}

        	type PluginA struct {
        		AOption string `json:"aOption"`
        	}
          ```

        // Готовий JSON буде виглядати приблизно так:

          ```json
        	{
        		"kind":"MyAPIObject",
        		"apiVersion":"v1",
        		"myPlugin": {
        			"kind":"PluginA",
        			"aOption":"foo",
        		},
        	}
          ```

        Що відбувається? Спочатку декодування використовує json або yaml для десеріалізації даних у ваш зовнішній MyAPIObject. Це призводить до зберігання необробленого JSON, але без розпакування. Наступний крок — копіювання (за допомогою pkg/conversion) у внутрішню структуру. Функції перетворення, встановлені в DefaultScheme пакета runtime, розпаковують JSON, збережений у RawExtension, перетворюючи його в правильний тип обʼєкта і зберігаючи його в Object. (TODO: У випадку, коли обʼєкт має невідомий тип, буде створено і збережено обʼєкт runtime.Unknown.)

    - **devices.config.requests** ([]string)

      *Atomic: буде замінено під час злиття*

      Requests перераховує назви запитів, до яких застосовується конфігурація. Якщо поле порожнє, конфігурація застосовується до всіх запитів.

  - **devices.constraints** ([]DeviceConstraint)

    *Atomic: буде замінено під час злиття*

    Ці обмеження повинні задовольнятися набором пристроїв, які виділяються для заявки.

    <a name="DeviceConstraint"></a>
    *DeviceConstraint повинен мати рівно одне поле, крім Requests.*

    - **devices.constraints.matchAttribute** (string)

      MatchAttribute вимагає, щоб усі пристрої, про які йдеться, мали цей атрибуту, а його тип і значення були однаковими для всіх цих пристроїв.

      Наприклад, якщо ви вказали "dra.example.com/numa" (гіпотетичний приклад!), то будуть обрані лише пристрої в одному й тому самому NUMA-вузлі. Пристрій, який не має цього атрибуту, не буде обраний. Усі пристрої повинні використовувати значення одного типу для цього атрибуту, оскільки це є частиною його специфікації, але якщо якийсь пристрій цього не робить, він також не буде обраний.

      Має включати доменний кваліфікатор.

    - **devices.constraints.requests** ([]string)

      *Atomic: буде замінено під час злиття*

      Requests — це список з одного або більше запитів у цій заявці, які мають спільно задовольняти цю умову. Якщо запит виконується кількома пристроями, то всі пристрої повинні відповідати цій умові. Якщо це не вказано, ця умова застосовується до всіх запитів у заявці.

  - **devices.requests** ([]DeviceRequest)

    *Atomic: буде замінено під час злиття*

    Requests представляють індивідуальні запити на окремі пристрої, які мають бути задоволені. Якщо список порожній, то не потрібно виділяти жодних ресурсів.

    <a name="DeviceRequest"></a>
    *DeviceRequest — це запит на пристрої, необхідні для заявки. Зазвичай це запит на один ресурс, такий як пристрій, але також може включати запит на кілька однакових пристроїв.*

    *Поле DeviceClassName наразі є обов’язковим. Клієнти повинні перевірити, чи воно дійсно встановлене. Його відсутність свідчить про зміни, які ще не підтримуються клієнтом, і в такому випадку клієнт повинен відмовитися від обробки запиту.*

    - **devices.requests.deviceClassName** (string), обовʼязково

      DeviceClassName посилається на конкретний DeviceClass, який може визначати додаткові налаштування та селектори, що будуть успадковані цим запитом.

      Клас є обов’язковим. Доступність класів залежить від кластера.

      Адміністратори можуть використовувати це, щоб обмежити доступні для запитів пристрої, встановлюючи класи лише з селекторами для дозволених пристроїв. Якщо користувачі можуть вільно запитувати будь-що без обмежень, адміністратори можуть створити порожній DeviceClass для використання користувачами.

    - **devices.requests.name** (string), обовʼязково

      Name може бути використане для посилання на цей запит у записі pod.spec.containers[].resources.claims та в умові заявки.

      Має бути міткою DNS.

    - **devices.requests.adminAccess** (boolean)

      AdminAccess вказує, що це заявка на адміністративний доступ до пристрою(їв). Заявки з AdminAccess очікується використовувати для моніторингу або інших сервісів управління пристроєм. Вони ігнорують усі звичайні заявки на пристрій щодо режимів доступу та будь-яких розподілів ресурсів.

    - **devices.requests.allocationMode** (string)

      AllocationMode та пов’язані з ним поля визначають, як пристрої виділяються для виконання цього запиту. Підтримувані значення:

      - ExactCount: Цей запит на конкретну кількість пристроїв. Це значення використовується стандартно. Точна кількість вказується в полі `count`.

      - All: Цей запит на всі пристрої, що відповідають умовам, у пулі. Виділення не вдасться, якщо деякі пристрої вже виділені, за винятком випадків, коли запитується adminAccess.

      Якщо AllocationMode не вказано, стандатний режим — ExactCount. Якщо режим — ExactCount і кількість не вказана, стандартна кількість один. Будь-які інші запити повинні вказати це поле.

      Можуть бути додані нові режими в майбутньому. Клієнти повинні відмовитися від обробки запитів із невідомими режимами.

    - **devices.requests.count** (int64)

      Поле Count використовується лише тоді, коли режим підрахунку — "ExactCount". Має бути більше нуля. Якщо AllocationMode встановлено як ExactCount і це поле не вказано, стандартне значення — один.

    - **devices.requests.selectors** ([]DeviceSelector)

      *Atomic: буде замінено під час злиття*

      Селектори визначають критерії, які має задовольнити конкретний пристрій, щоб він був розглянутий для цього запиту. Усі селектори повинні бути виконані, щоб пристрій був прийнятий до розгляду.

      <a name="DeviceSelector"></a>
      *DeviceSelector повинен мати рівно одне встановлене поле.*

      - **devices.requests.selectors.cel** (CELDeviceSelector)

        CEL містить вираз CEL для вибору пристрою.

        <a name="CELDeviceSelector"></a>
        *CELDeviceSelector містить CEL-вираз для вибору пристрою.*

        - **devices.requests.selectors.cel.expression** (string), обовʼязково

          Вираз є виразом CEL, який оцінює один пристрій. Він має оцінюватися як true, коли пристрій відповідає бажаним критеріям, і як false, коли не відповідає. Будь-який інший результат є помилкою і призводить до зупинки надання пристроїв.

          Вхідні дані виразу — це обʼєкт з назвою "device", який має наступні властивості:
          - driver (рядок): імʼя драйвера, який визначає цей пристрій.
          - attributes (map[string]object): атрибути пристрою, згруповані за префіксом (наприклад, device.attributes["dra.example.com"] оцінюється як обʼєкт з усіма атрибутами, які були префіксовані "dra.example.com").
          - capacity (map[string]object): обсяги пристрою, згруповані за префіксом.

          Приклад: Розглянемо пристрій з driver="dra.example.com", який надає два атрибути з назвою "model" та "ext.example.com/family" і один обсяг з назвою "modules". Вхідні дані для цього виразу будуть мати такі поля:

          ```none
          device.driver
          device.attributes["dra.example.com"].model
          device.attributes["ext.example.com"].family
          device.capacity["dra.example.com"].modules
          ```

          Поле device.driver можна використовувати для перевірки конкретного драйвера, або як загальну попередню умову (тобто ви хочете розглядати лише пристрої від цього драйвера), або як частину виразу з кількома умовами, який призначений для розгляду пристроїв з різних драйверів.

          Тип значення кожного атрибута визначається визначенням пристрою, і користувачі, які пишуть ці вирази, повинні звертатися до документації для своїх конкретних драйверів. Тип значення кожного обсягу — Quantity.

          Якщо невідомий префікс використовується для запиту в device.attributes або device.capacity, буде повернено порожній map. Будь-яке посилання на невідоме поле спричинить помилку оцінки і зупинку виділення.

          Робочий вираз має перевіряти наявність атрибутів перед їх використанням.

          Для зручності використання доступна функція cel.bind(), яка може бути використана для спрощення виразів, що звертаються до кількох атрибутів з одного домену. Наприклад:

          ```none
          cel.bind(dra, device.attributes["dra.example.com"], dra.someBool && dra.anotherBool)
          ```

## ResourceClaimStatus {#ResourceClaimStatus}

ResourceClaimStatus відстежує, чи було виділено ресурс і яким був результат.

---

- **allocation** (AllocationResult)

  Allocation встановлюється після успішного розподілу заявки.

  <a name="AllocationResult"></a>
  *AllocationResult містить атрибути виділеного ресурсу.*

  - **allocation.controller** (string)

    controller — це імʼя драйвера DRA, який обробив виділення. Цей драйвер також відповідає за деалокацію заявки. Воно порожнє, коли заявку можна деалокувати без залучення драйвера.

    Драйвер може виділяти пристрої, надані іншими драйверами, тому імʼя цього драйвера може відрізнятися від імен драйверів, зазначених у результатах.

    Це альфа-поле і вимагає активації функціональної можливості DRAControlPlaneController.

  - **allocation.devices** (DeviceAllocationResult)

    Devices є результатом виділення пристроїів.

    <a name="DeviceAllocationResult"></a>
    *DeviceAllocationResult — результат виділення пристроїв.*

    - **allocation.devices.config** ([]DeviceAllocationConfiguration)

      *Atomic: буде замінено під час злиття*

      Це поле є комбінацією всіх параметрів конфігурації заявки та класу. Драйвери можуть розрізняти ці параметри за допомогою прапорця.

      Воно включає параметри конфігурації для драйверів, які не мають виділених пристроїв у результаті, оскільки драйвери самостійно визначають, які параметри конфігурації вони підтримують. Вони можуть мовчки ігнорувати невідомі параметри конфігурації.

      <a name="DeviceAllocationConfiguration"></a>
      *DeviceAllocationConfiguration gets embedded in an AllocationResult.*

      - **allocation.devices.config.source** (string), обовʼязково

        Source вказує, чи конфігурація походить з класу і, отже, не є чимось, що звичайний користувач міг би встановити, чи з заявки.

      - **allocation.devices.config.opaque** (OpaqueDeviceConfiguration)

        Opaque надає специфічні для драйвера параметри конфігурації.

        <a name="OpaqueDeviceConfiguration"></a>
        *OpaqueDeviceConfiguration містить параметри конфігурації драйвера у форматі, визначеному постачальником драйвера.*

        - **allocation.devices.config.opaque.driver** (string), обовʼязково

          Драйвер використовується для визначення того, якому втулку kubelet потрібно передати ці конфігураційні параметри.

          Політика допуску, надана розробником драйвера, може використовувати цей параметр, щоб вирішити, чи потрібно їх перевіряти.

          Має бути субдоменом DNS і закінчуватися на DNS-домені, що належить постачальнику драйвера.

        - **allocation.devices.config.opaque.parameters** (RawExtension), обовʼязково

          Параметри можуть містити довільні дані. Відповідальність за перевірку та керування версіями покладається на розробника драйверів. Зазвичай це включає самоідентифікацію та версію ("kind" + "apiVersion" для типів Kubernetes), а також конвертацію між різними версіями.

          <a name="RawExtension"></a>
          *RawExtension використовується для зберігання розширень у зовнішніх версіях.*

          Щоб використовувати це, створіть поле, яке має тип RawExtension у вашій зовнішній, версійованій структурі, і Object у вашій внутрішній структурі. Також потрібно зареєструвати ваші різні типи втулків.

          // Внутрішній пакунок:

            ```go
          	type MyAPIObject struct {
          		runtime.TypeMeta `json:",inline"`
          		MyPlugin runtime.Object `json:"myPlugin"`
          	}

          	type PluginA struct {
          		AOption string `json:"aOption"`
          	}
            ```

          // Зовнішній пакунок:

            ```go
          	type MyAPIObject struct {
          		runtime.TypeMeta `json:",inline"`
          		MyPlugin runtime.RawExtension `json:"myPlugin"`
          	}

          	type PluginA struct {
          		AOption string `json:"aOption"`
          	}
            ```

          // Готовий JSON буде виглядати приблизно так:

            ```json
          	{
          		"kind":"MyAPIObject",
          		"apiVersion":"v1",
          		"myPlugin": {
          			"kind":"PluginA",
          			"aOption":"foo",
          		},
          	}
            ```

          Що відбувається? Спочатку декодування використовує json або yaml для десеріалізації даних у ваш зовнішній MyAPIObject. Це призводить до зберігання необробленого JSON, але без розпакування. Наступний крок — копіювання (за допомогою pkg/conversion) у внутрішню структуру. Функції перетворення, встановлені в DefaultScheme пакета runtime, розпаковують JSON, збережений у RawExtension, перетворюючи його в правильний тип обʼєкта і зберігаючи його в Object. (TODO: У випадку, коли обʼєкт має невідомий тип, буде створено і збережено обʼєкт runtime.Unknown.)

      - **allocation.devices.config.requests** ([]string)

        *Atomic: буде замінено під час злиття*

        Requests перераховує назви запитів, до яких застосовується конфігурація. Якщо поле порожнє, конфігурація застосовується до всіх запитів.

    - **allocation.devices.results** ([]DeviceRequestAllocationResult)

      *Atomic: буде замінено під час злиття*

      Results — перелік віділених пристроїв.

      <a name="DeviceRequestAllocationResult"></a>
      *DeviceRequestAllocationResult містить результат розподілу для одного запиту.*

      - **allocation.devices.results.device** (string), обовʼязково

        Device посилається на один екземпляр пристрою за його імʼям в ресурсному пулі драйвера. Має бути міткою DNS.

      - **allocation.devices.results.driver** (string), обовʼязково

        Driver вказує імʼя драйвера DRA, чий втулок kubelet слід викликати для обробки виділення, коли заявка потрібна на вузлі.

        Має бути піддоменом DNS і закінчуватися доменом DNS, що належить постачальнику драйвера.

      - **allocation.devices.results.pool** (string), обовʼязково

        Це імʼя разом з імʼям драйвера та полем імені пристрою ідентифікує, який пристрій був виділений (`\<імʼя драйвера>/\<імʼя пулу>/\<імʼя пристрою>`).

        Не повинно перевищувати 253 символи і може містити один або більше піддоменів DNS, розділених косими рисками.

      - **allocation.devices.results.request** (string), обовʼязково

        Request — це імʼя запиту в заявці, який спричинив виділення цього пристрою. Для одного запиту може бути виділено кілька пристроїв.

  - **allocation.nodeSelector** (NodeSelector)

    NodeSelector визначає, де доступні виділені ресурси. Якщо не встановлено, ресурси доступні скрізь.

    <a name="NodeSelector"></a>
    *Селектор вузлів представляє об'єднання результатів одного або кількох запитів міток над набором вузлів; тобто, він представляє логічне OR селекторів, які представлені термінами селектора вузлів.*

    - **allocation.nodeSelector.nodeSelectorTerms** ([]NodeSelectorTerm), обовʼязково

      *Atomic: буде замінено під час злиття*

      Обов’язкове поле. Список термінів селектора вузлів. Термінів застосовується логічне OR.

      <a name="NodeSelectorTerm"></a>
      *Null або порожній термін селектора вузла не відповідає жодному об'єкту. Вимоги до них складаються за принципом AND. Тип TopologySelectorTerm реалізує підмножину NodeSelectorTerm.*

      - **allocation.nodeSelector.nodeSelectorTerms.matchExpressions** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        *Atomic: буде замінено під час злиття*

        Список вимог селектора вузлів за мітками вузлів.

      - **allocation.nodeSelector.nodeSelectorTerms.matchFields** ([]<a href="{{< ref "../common-definitions/node-selector-requirement#NodeSelectorRequirement" >}}">NodeSelectorRequirement</a>)

        *Atomic: буде замінено під час злиття*

        Список вимог селектора вузлів за полями вузлів.

- **deallocationRequested** (boolean)

  Вказує на те, що заявку потрібно деалокувати. Поки це поле встановлене, нові споживачі не можуть бути додані до ReservedFor.

  Використовується лише у випадках, коли заявку потрібно деалокувати за допомогою драйвера DRA. Цей драйвер повинен деалокувати заявку та скинути це поле разом із очищенням поля Allocation.

  Це альфа-поле і вимагає активації функціональної можливості DRAControlPlaneController.

- **reservedFor** ([]ResourceClaimConsumerReference)

  *Patch strategy: злиття за ключем `uid`*

  *Map: унікальні значення ключа uid будуть збережені під час злиття*

  ReservedFor вказує, які сутності в даний момент можуть використовувати заявку. Pod, який посилається на ResourceClaim, що не зарезервована для цього Podʼа, не буде запущений. Заявка, яка використовується або може бути використана, оскільки вона зарезервована, не повинна бути деалокована.

  У кластері з кількома екземплярами планувальника два podʼи можуть бути заплановані одночасно різними планувальниками. Коли вони посилаються на один і той же ResourceClaim, який вже досяг максимального числа споживачів, лише один pod може бути запланований.

  Обидва планувальники намагаються додати свій pod до поля claim.status.reservedFor, але лише оновлення, яке досягає API-сервера першим, зберігається. Інше оновлення зазнає помилки, і планувальник, який його надіслав, знає, що потрібно повернути pod у чергу, чекаючи, поки ResourceClaim знову стане доступним.

  Може бути не більше 32 таких резервувань. Це число може бути збільшено в майбутньому, але не зменшено.

  <a name="ResourceClaimConsumerReference"></a>
  *ResourceClaimConsumerReference містить достатньо інформації, щоб знайти споживача ResourceClaim. Користувач має бути ресурсом в тому ж просторі імен, що і ResourceClaim.*

  - **reservedFor.name** (string), обовʼязково

    Name — це імʼя ресурсу, на який посилаються.

  - **reservedFor.resource** (string), обовʼязково

    Resource — це тип ресурсу, на який посилаються, наприклад, "pods".

  - **reservedFor.uid** (string), обовʼязково

    UID ідентифікує саме одну інкарнацію ресурсу.

  - **reservedFor.apiGroup** (string)

    APIGroup — це група для ресурсу, на який посилаються. Вона порожня для основного API. Це відповідає групі в APIVersion, яка використовується при створенні ресурсів.

## ResourceClaimList {#ResourceClaimList}

ResourceClaimList — це колекція заявок.

---

- **apiVersion**: resource.k8s.io/v1beta1

- **kind**: ResourceClaimList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку

- **items** ([]<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>), обовʼязково

  Items — це список вимог на ресурси.

## Операції {#Operations}

---

### `get` отримати вказаний ResourceClaim {#get-read-the-specified-resourceclaim}

#### HTTP запит {#http-request}

GET /apis/resource.k8s.io/v1beta1/namespaces/{namespace}/resourceclaims/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  name of the ResourceClaim

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>): OK

401: Unauthorized

### `get` отримати статус вказаного ResourceClaim {#get-read-status-of-the-specified-resourceclaim}

#### HTTP запит {#http-request-1}

GET /apis/resource.k8s.io/v1beta1/namespaces/{namespace}/resourceclaims/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  name of the ResourceClaim

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ResourceClaim {#list-list-or-watch-objects-of-kind-resourceclaim}

#### HTTP запит {#http-request-2}

GET /apis/resource.k8s.io/v1beta1/namespaces/{namespace}/resourceclaims

#### Параметри {#parameters-2}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaimList" >}}">ResourceClaimList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ResourceClaim {#list-list-or-watch-objects-of-kind-resourceclaim-1}

#### HTTP запит {#http-request-3}

GET /apis/resource.k8s.io/v1beta1/resourceclaims

#### Параметри {#parameters-3}

- **allowWatchBookmarks** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaimList" >}}">ResourceClaimList</a>): OK

401: Unauthorized

### `create` створення ResourceClaim {#create-create-a-resourceclaim}

#### HTTP запит {#http-request-4}

POST /apis/resource.k8s.io/v1beta1/namespaces/{namespace}/resourceclaims

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>): Created

202 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>): Accepted

401: Unauthorized

### `update` заміна вказаного ResourceClaim {#update-replace-the-specified-resourceclaim}

#### HTTP запит {#http-request-5}
PUT /apis/resource.k8s.io/v1beta1/namespaces/{namespace}/resourceclaims/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  назва ResourceClaim

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного ResourceClaim {#update-replace-status-of-the-specified-resourceclaim}

#### HTTP запит {#http-request-6}

PUT /apis/resource.k8s.io/v1beta1/namespaces/{namespace}/resourceclaims/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  назва ResourceClaim

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного ResourceClaim {#patch-partially-update-the-specified-resourceclaim}

#### HTTP запит {#http-request-7}

PATCH /apis/resource.k8s.io/v1beta1/namespaces/{namespace}/resourceclaims/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  назва ResourceClaim

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-7}

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного ResourceClaim {#patch-partially-update-status-of-the-specified-resourceclaim}

#### HTTP запит {#http-request-8}


PATCH /apis/resource.k8s.io/v1beta1/namespaces/{namespace}/resourceclaims/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  name of the ResourceClaim

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-8}

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>): OK

201 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>): Created

401: Unauthorized

### `delete` видалення ResourceClaim {#delete-delete-a-resourceclaim}

#### HTTP запит {#http-request-9}

DELETE /apis/resource.k8s.io/v1beta1/namespaces/{namespace}/resourceclaims/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  назва ResourceClaim

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

#### Відповідь {#response-9}

200 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>): OK

202 (<a href="{{< ref "../workload-resources/resource-claim-v1beta1#ResourceClaim" >}}">ResourceClaim</a>): Accepted

401: Unauthorized

### `deletecollection` видалення of ResourceClaim {#deletecollection-delete-collection-of-resourceclaim}

#### HTTP запит {#http-request-10}

DELETE /apis/resource.k8s.io/v1beta1/namespaces/{namespace}/resourceclaims

#### Параметри {#parameters-10}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

#### Відповідь {#response-10}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
