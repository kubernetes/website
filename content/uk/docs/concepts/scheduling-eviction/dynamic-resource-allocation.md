---
title: Динамічне виділення ресурсів
content_type: concept
weight: 65
api_metadata:
- apiVersion: "resource.k8s.io/v1alpha3"
  kind: "ResourcePoolStatusRequest"
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
  kind: "DeviceTaintRule"
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

На цій сторінці описано _динамічне виділення ресурсів (DRA)_ у Kubernetes.

<!-- body -->

## Про DRA {#about-dra}

{{< glossary_definition prepend="DRA is" term_id="dra" length="all" >}}

Виділення ресурсів за допомогою DRA схоже на [динамічне надання томів](/docs/concepts/storage/dynamic-provisioning/), в якому ви використовуєте PersistentVolumeClaims, щоб вимагати том сховища від класів сховища і запитувати заявлений том у ваших Podʼах.

### Переваги DRA {#dra-benefits}

DRA надає гнучкий спосіб категоризації, запиту та використання пристроїв у вашому кластері. Використання DRA має такі переваги:

* **Гнучке фільтрування пристроїв**: використовуйте загальну мову виразів (CEL) для виконання детального фільтрування за конкретними атрибутами пристроїв.
* **Спільне використання пристроїв**: діліться одним і тим же ресурсом між кількома контейнерами або Podʼами, посилаючись на відповідну заявку на ресурс.
* **Централізована категоризація пристроїв**: драйвери пристроїв і адміністратори кластерів можуть використовувати класи пристроїв, щоб надати операторам додатків категорії апаратного забезпечення, які оптимізовані для різних випадків використання. Наприклад, ви можете створити клас пристроїв, оптимізований для загальних робочих навантажень, і клас пристроїв високої продуктивності для критичних завдань.
* **Спрощені запити Podʼів**: за допомогою DRA операторам застосунків не потрібно вказувати кількість пристроїв у запитах ресурсів Podʼа. Замість цього Pod посилається на заявку на ресурс, а конфігурація пристроїв у цій заяві застосовується до Podʼа.

Ці переваги забезпечують значні поліпшення в робочому процесі виділення пристроїв у порівнянні з [втулками пристроїв](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/), які вимагають запитів пристроїв для кожного контейнера, не підтримують спільне використання пристроїв і не підтримують фільтрацію пристроїв на основі виразів.

### Типи користувачів DRA {#dra-user-types}

Процес використання DRA для виділення пристроїв включає такі типи користувачів:

* **Власник пристрою**: відповідає за пристрої. Власники пристроїв можуть бути комерційними постачальниками, адміністратором кластера або іншою сутністю. Щоб використовувати DRA, пристрої повинні мати драйвери, сумісні з DRA, які виконують такі дії:

  * Створюють ResourceSlices, які надають Kubernetes інформацію про вузли та ресурси.
  * Оновлюють ResourceSlices, коли змінюється ємність ресурсів у кластері.
  * За бажанням створюють DeviceClasses, які оператори робочих навантажень можуть використовувати для заявки на пристрої.

* **Адміністратор кластера**: відповідає за налаштування кластерів і вузлів, підключення пристроїв, установку драйверів та подібні завдання. Щоб використовувати DRA, адміністратори кластерів виконують такі дії:

  * Підключають пристрої до вузлів.
  * Встановлюють драйвери пристроїв, які підтримують DRA.
  * За бажанням створюють DeviceClasses, які оператори робочих навантажень можуть використовувати для заявки на пристрої.

* **Оператор робочих навантажень**: відповідає за розгортання та управління робочими навантаженнями в кластері. Щоб використовувати DRA для виділення пристроїв для Podʼів, оператори робочих навантажень виконують такі дії:

  * Створюють ResourceClaims або ResourceClaimTemplates, щоб запитати конкретні конфігурації в межах DeviceClasses.
  * Розгортають робочі навантаження, які використовують конкретні ResourceClaims або ResourceClaimTemplates.

## Термінологія DRA {#terminology}

DRA використовує такі види API Kubernetes для забезпечення основної функціональності виділення. Усі ці види API включені в `resource.k8s.io/v1` {{< glossary_tooltip text="група API" term_id="api-group" >}}.

DeviceClass
: Визначає категорію пристроїв, які можуть бути запитані, і те, як вибрати конкретні атрибути пристроїв у заявках. Параметри DeviceClass можуть дорівнювати нулю або більше пристроїв у ResourceSlices. Щоб запитувати пристрої з DeviceClass, ResourceClaims вибирають певні атрибути пристрою.

ResourceClaim
: Описує запити на доступ до приєднаних ресурсів, таких як пристрої, у кластері. Вимоги до ресурсу надають Podʼам доступ до певного ресурсу. ResourceClaims можуть створюватися операторами робочого навантаження або генеруватися Kubernetes на основі шаблону ResourceClaimTemplate.

ResourceClaimTemplate
: Визначає шаблон, який Kubernetes використовує для створення запитів на ресурси (ResourceClaims) для робочого навантаження. Шаблони ResourceClaimTemplates надають бодам доступ до окремих схожих ресурсів. Кожний запи ресурсу, яку Kubernetes генерує на основі шаблону, привʼязується до певного Podʼа. Коли Pod завершує роботу, Kubernetes видаляє відповідну заявку на ресурс.

ResourceSlice
: Представляє собою один або декілька ресурсів, приєднаних до вузлів, таких як пристрої. Драйвери створюють фрагменти ресурсів і керують ними у кластері. Коли ResourceClaim створюється і використовується у Podʼі, Kubernetes використовує ResourceSlices для пошуку вузлів, які мають доступ до заявлених ресурсів. Kubernetes виділяє ресурси для ResourceClaim і планує роботу Podʼа на вузлі, який може отримати доступ до ресурсів.

### DeviceClass {#deviceclass}

DeviceClass дозволяє адміністраторам кластера або драйверам пристроїв визначати категорії пристроїв у кластері. Класи пристроїв вказують операторам, які пристрої вони можуть запитувати і як вони можуть запитувати ці пристрої. Ви можете використовувати [загальну мову виразів (CEL)](https://cel.dev) для вибору пристроїв на основі певних атрибутів. ResourceClaim, яка посилається на DeviceClass, може потім запитувати певні конфігурації в межах DeviceClass.

Щоб створити DeviceClass, див. [Налаштування DRA у кластері](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster).

### ResourceClaims та ResourceClaimTemplates {#resourceclaims-templates}

ResourceClaim визначає ресурси, які потрібні робочому навантаженню. Кожен ResourceClaim має _запити_ (_requests_), які посилаються на DeviceClass і вибирають пристрої з цього DeviceClass. ResourceClaims також можуть використовувати _селектори_ (_selectors_) для фільтрації пристроїв, які відповідають певним вимогам, і можуть використовувати _обмеження_ (_constraints_) для обмеження пристроїв, які можуть задовольнити запит. ResourceClaims можуть створюватися операторами робочого навантаження або генеруватися Kubernetes на основі шаблону ResourceClaimTemplate. Шаблон ResourceClaimTemplate визначає шаблон, який Kubernetes може використовувати для автоматичного створення ResourceClaims для Pods.

#### Використання ResourceClaims та ResourceClaimTemplates {#when-to-use-rc-rct}

Метод, який ви використовуєте, залежить від ваших вимог, як показано нижче:

* **ResourceClaim**: ви хочете, щоб кілька Podʼів мали спільний доступ до певних пристроїв. Ви вручну керуєте життєвим циклом ResourceClaims, які створюєте.
* **ResourceClaimTemplate**: ви хочете, щоб Podʼи мали незалежний доступ до окремих, схожих за конфігурацією пристроїв. Kubernetes генерує ResourceClaims з специфікації в ResourceClaimTemplate. Тривалість кожного згенерованого ResourceClaim привʼязується до тривалості існування відповідного Podʼа.
* [**PodGroup ResourceClaimTemplate**](#workload-resourceclaims): ви хочете, щоб {{< glossary_tooltip text="PodGroups" term_id="podgroup" >}} мали незалежний доступ до окремих, схожих за конфігурацією пристроїв, які можуть бути спільно використані їхніми Podʼами. Kubernetes генерує один ResourceClaim для PodGroup з специфікації в ResourceClaimTemplate. Тривалість кожного згенерованого ResourceClaim привʼязується до тривалості існування відповідного PodGroup. Це вимагає, щоб функція [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims) була увімкнена.

Коли ви визначаєте робоче навантаження, ви можете використовувати {{< glossary_tooltip term_id="cel" text="Загальну мову виразів (CEL)" >}} для фільтрації за конкретними атрибутами пристроїв або ємністю. Доступні параметри для фільтрації залежать від пристрою та драйверів.

Якщо ви безпосередньо посилаєтеся на конкретний ResourceClaim у Pod, цей ResourceClaim повинен вже існувати в тому ж просторі імен, що й Pod. Якщо ResourceClaim не існує в просторі імен, Pod не буде заплановано. Ця поведінка подібна до того, як PersistentVolumeClaim повинен існувати в тому ж просторі імен, що й Pod, який посилається на нього.

Ви можете посилатися на автоматично згенерований ResourceClaim у Pod, але це не рекомендується, оскільки автоматично згенеровані ResourceClaims привʼязані до тривалості існування Podʼа або PodGroup, який викликав генерацію.

Щоб дізнатися, як запитувати ресурси за допомогою одного з цих методів, див. [Виділення пристроїв для робочих навантажень з DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/).

#### Список пріоритетів {#prioritized-list}

{{< feature-state feature_gate_name="DRAPrioritizedList" >}}

Ви можете надати список пріоритетів підзапитів для запитів у ResourceClaim або ResourceClaimTemplate. Планувальник вибере перший підзапит, який можна виконати. Це дозволяє користувачам вказувати альтернативні пристрої, які можуть бути використані робочим навантаженням, якщо первинний вибір недоступний.

У наведеному нижче прикладі ResourceClaimTemplate запитує пристрій з кольором чорний і розміром великий. Якщо пристрій з цими атрибутами недоступний, Pod не може бути заплановано. Завдяки функції списку пріоритетів можна вказати другий варіант, який запитує два пристрої з кольором білий і розміром малий. Великий чорний пристрій буде наданий, якщо він доступний. Якщо ні, але два маленькі білі пристрої доступні, Pod все ще зможе працювати.

```yaml
apiVersion: resource.k8s.io/v1
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

Якщо под відповідає вимогам для декількох вузлів у кластері, планувальник використовуватиме індекс обраних субзапитів із будь-яких пріоритетних списків як один із вхідних параметрів під час оцінки кожного вузла. Отже, вузли, які можуть виділити пристрої, запитувані в субзапиті з вищим рейтингом, мають більшу ймовірність бути обраними, ніж вузли, які можуть виділити пристрої лише для субзапитів з нижчим рейтингом.

Рішення приймається для кожного Podʼа окремо, тому якщо Pod є членом ReplicaSet або подібної групи, ви не можете розраховувати на те, що всі члени групи матимуть однаковий субзапит. Ваше навантаження повинно бути здатним пристосуватися до цього.

#### Workload ResourceClaims

{{< feature-state feature_gate_name="DRAWorkloadResourceClaims" >}}

Коли ви організовуєте Podʼи за допомогою [Workload API](/docs/concepts/workloads/workload-api/), ви можете резервувати ResourceClaims для цілих {{< glossary_tooltip text="PodGroups" term_id="podgroup" >}} замість окремих Podʼів і генерувати ResourceClaimTemplates для PodGroup замість одного Pod, що дозволяє Podʼам у PodGroup спільно використовувати доступ до пристроїв, виділених для згенерованого ResourceClaim.

Ця функція вирішує дві проблеми:

* Список `status.reservedFor` API ResourceClaim може містити лише 256 елементів. Оскільки kube-scheduler записує в цей список лише окремі Podʼи, лише 256 Podʼів можуть спільно використовувати один ResourceClaim. Завдяки можливості запису PodGroups у `status.reservedFor`, ResourceClaim можуть спільно використовувати значно більше ніж 256 Podʼів.
* Podʼи можуть спільно використовувати ResourceClaim лише тоді, коли відома його точна назва. Для складних робочих навантажень, що реплікують _групи_ Podʼів, ResourceClaims, якими спільно користуються Podʼи в кожній групі, потрібно створювати та видаляти явно, коли набір груп масштабується вгору та вниз. Генеруючи ResourceClaims для кожної PodGroup, один ResourceClaimTemplate може стати основою для ResourceClaims, які автоматично реплікуються та можуть спільно використовуватися Podʼами у PodGroup.

API PodGroup визначає поле `spec.resourceClaims` з такою самою структурою та подібним значенням, як і поле `spec.resourceClaims` в API Pod:

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-group
  namespace: some-ns
spec:
  ...
  resourceClaims:
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
```

Як і заявки, зроблені Podʼами, заявки для PodGroup, що визначають `resourceClaimName`, посилаються на ResourceClaim за іменем. Заявки, що визначають `resourceClaimTemplateName`, посилаються на ResourceClaimTemplate, який реплікується в один ResourceClaim для всієї PodGroup, який може бути спільно використаний її Podʼами.

Коли Pod визначає заявку з `name`, `resourceClaimName` та `resourceClaimTemplateName`, які всі збігаються з однією з `spec.resourceClaims` його PodGroup, kube-scheduler резервує ResourceClaim для PodGroup замість Podʼа. Якщо заявка Podʼа не збігається з жодною заявкою його PodGroup, kube-scheduler резервує ResourceClaim для Podʼа. У будь-якому випадку резервування записується в `status.reservedFor` ResourceClaim. Резервування PodGroup та відповідне виділення ресурсів зберігаються в ResourceClaim до видалення PodGroup, навіть якщо група більше не має Podʼа.

Коли заявка Podʼа, що збігається з заявкою PodGroup, визначає `resourceClaimTemplateName`, тоді для PodGroup генерується один ResourceClaim. Інші Podʼи в групі, які визначають ту ж саму заявку, будуть використовувати цей згенерований ResourceClaim замість того, щоб створювати новий ResourceClaim для кожного Podʼа. Незалежно від того, чи збігається заявка `resourceClaimTemplateName` з заявкою PodGroup, імʼя згенерованого ResourceClaim записується в `status.resourceClaimStatuses` Podʼа.

ResourceClaims, згенеровані з ResourceClaimTemplate для PodGroup, слідують життєвому циклу PodGroup. ResourceClaim створюється, коли існують як PodGroup, так і його ResourceClaimTemplate. ResourceClaim видаляється після видалення PodGroup і коли ResourceClaim більше не зарезервований.

Розглянемо наступний приклад:

```yaml
apiVersion: scheduling.k8s.io/v1alpha2
kind: PodGroup
metadata:
  name: training-group
  namespace: some-ns
spec:
  ...
  resourceClaims:
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
---
apiVersion: v1
kind: Pod
metadata:
  name: training-group-pod-1
  namespace: some-ns
spec:
  ...
  schedulingGroup:
    podGroupName: training-group
  resourceClaims:
  - name: pod-claim
    resourceClaimName: my-pod-claim
  - name: pod-claim-template
    resourceClaimTemplateName: my-pod-template
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
```

У цьому прикладі PodGroup `training-group` має один Pod на імʼя `training-group-pod-1`. Заявки Podʼа `pod-claim` та `pod-claim-template` не збігаються з жодною заявкою PodGroup, тому ці заявки не впливають на PodGroup: ResourceClaim `my-pod-claim` стає зарезервованим для Podʼа, а ResourceClaim, згенерований з ResourceClaimTemplate `my-pod-template`, також стає зарезервованим для Podʼа. Заявки `pg-claim` та `pg-claim-template` збігаються з заявками PodGroup. ResourceClaim `my-pg-claim` стає зарезервованим для PodGroup, а ResourceClaim, згенерований з ResourceClaimTemplate `my-pg-template`, також стає зарезервованим для PodGroup.

Повʼязування ResourceClaims з ресурсами Workload API є _alpha-функцією_ і увімкнено лише тоді, коли функціональну можливість [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims) увімкнено в kube-apiserver, kube-controller-manager, kube-scheduler та kubelet.

### ResourceSlice {#resourceslice}

Кожен ResourceSlice представляє один або декілька {{< glossary_tooltip term_id="device" text="пристроїв" >}} у пулі. Пулом керує драйвер пристрою, який створює та керує ResourceSlices. Ресурси у пулі можуть бути представлені одним ResourceSlice або охоплювати декілька ResourceSlice.

ResourceSlices надають корисну інформацію користувачам пристроїв і планувальнику, а також мають вирішальне значення для динамічного розподілу ресурсів. Кожен ResourceSlice повинен містити наступну інформацію:

* **Resource pool**: група з одного або декількох ресурсів, якими керує драйвер. Пул може охоплювати більше ніж один ResourceSlice. Зміни в ресурсах пулу повинні бути поширені на всі ResourceSlices у цьому пулі. Драйвер пристрою, який керує пулом, відповідає за забезпечення цього.
* **Devices**: пристрої в керованому пулі. ResourceSlice може перераховувати кожен пристрій у пулі або підмножину пристроїв у пулі. ResourceSlice визначає інформацію про пристрій, таку як атрибути, версії та ємність. Користувачі пристроїв можуть вибирати пристрої для виділення, фільтруючи за інформацією про пристрої в ResourceClaims або в DeviceClasses.
* **Nodes**: вузли, які можуть отримувати доступ до ресурсів. Драйвери можуть вибирати, які вузли можуть отримувати доступ до ресурсів, чи це всі вузли в кластері, один названий вузол або вузли, які мають специфічні мітки вузлів.

Драйвери використовують {{< glossary_tooltip text="контролер" term_id="controller" >}} для узгодження ResourceSlices у кластері з інформацією, яку має опублікувати драйвер. Цей контролер перезаписує будь-які ручні зміни, такі як створення або модифікація ResourceSlices користувачами кластера.

Розгляньте наступний приклад ResourceSlice:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: cat-slice
spec:
  driver: "resource-driver.example.com"
  pool:
    generation: 1
    name: "black-cat-pool"
    resourceSliceCount: 1
  # Поле allNodes визначає, чи може будь-який вузол кластера отримати доступ до пристрою.
  allNodes: true
  devices:
  - name: "large-black-cat"
    attributes:
      color:
        string: "black"
      size:
        string: "large"
      cat:
        bool: true
```

Цим ResourceSlice керує драйвер `resource-driver.example.com` у пулі `black-cat-pool`. Поле `allNodes: true` вказує на те, що будь-який вузол кластера може отримати доступ до пристроїв. У ResourceSlice є один пристрій на імʼя `large-black-cat` з наступними атрибутами:

* `color`: `black`
* `size`: `large`
* `cat`: `true`

DeviceClass може вибрати цей ResourceSlice за допомогою цих атрибутів, а ResourceClaim може відфільтрувати певні пристрої у цьому DeviceClass.

#### Іменування та пріоритизація {#resourceslice-naming-and-prioritization}

Порядок, у якому планувальник Kubernetes оцінює пристрої для виділення, визначається лексикографічним сортуванням імен ResourceSlice та пулів ресурсів. Планувальник використовує стратегію першого підходящого варіанту, що означає, що він вибирає перший доступний пристрій, який задовольняє вимоги заявки.

Це дозволяє впливати на пріоритет розподілу ресурсів за допомогою імен, призначених пулам та ResourceSlices. Зверніть увагу, що пули без [умов привʼязки](#device-binding-conditions) завжди оцінюються перед тими, що мають умови привʼязки, незалежно від їхніх імен.

Для драйверів, створених за допомогою пакета Go `k8s.io/dynamic-resources/kubeletplugin` або контролера ResourceSlice з цього модуля, ці компоненти автоматично обробляють назви ResourceSlice, щоб забезпечити їх оцінку в порядку, визначеному драйвером.

## Як працює розподіл ресурсів з DRA {#how-it-works}

Наступні розділи описують робочий процес для різних [типів користувачів DRA](#dra-user-types) та для системи Kubernetes під час динамічного розподілу ресурсів.

### Робочий процес для користувачів {#user-workflow}

1. **Створення драйвера**: власники пристроїв або сторонні організації створюють драйвери, які можуть створювати та керувати ResourceSlices у кластері. Ці драйвери за бажанням також створюють DeviceClasses, які визначають категорію пристроїв та як їх запитувати.
1. **Конфігурація кластера**: адміністратори кластера створюють кластери, підключають пристрої до вузлів і встановлюють драйвери пристроїв DRA. Адміністратори кластера за бажанням створюють DeviceClasses, які визначають категорії пристроїв та як їх запитувати.
1. **Запити на ресурси**: оператори навантаження створюють ResourceClaimTemplates або ResourceClaims, які запитують конкретні конфігурації пристроїв у межах DeviceClass. На тому ж етапі оператори навантаження модифікують свої Kubernetes маніфести, щоб запитувати ці ResourceClaimTemplates або ResourceClaims.

### Робочий процес для Kubernetes {#kubernetes-workflow}

1. **Створення ResourceSlice**: драйвери в кластері створюють ResourceSlices, які представляють один або кілька пристроїв у керованому пулі подібних пристроїв.
2. **Створення навантаження**: панель управління кластера перевіряє нові навантаження на наявність посилань на ResourceClaimTemplates або на конкретні ResourceClaims.

   * Якщо навантаження використовує ResourceClaimTemplate, контролер з імʼям `resourceclaim-controller` генерує ResourceClaims у навантаженні.
   * Якщо навантаження використовує конкретний ResourceClaim, Kubernetes перевіряє, чи існує цей ResourceClaim у кластері. Якщо ResourceClaim не існує, Podʼи не будуть розгорнуті.

3. **Фільтрація ResourceSlice**: для кожного Podʼа Kubernetes перевіряє ResourceSlices у кластері, щоб знайти пристрій, який задовольняє всі наступні критерії:

   * Вузли, які можуть отримати доступ до ресурсів, мають право запускати Pod.
   * ResourceSlice має нераціоналізовані ресурси, які відповідають вимогам ResourceClaim Pod.

4. **Виділення ресурсів**: після знаходження відповідного ResourceSlice для ResourceClaim Pod, планувальник Kubernetes оновлює ResourceClaim з деталями виділення ресурсів. Планувальник використовує стратегію першого підходящого варіанту та оцінює пули та ResourceSlices у лексикографічному порядку за їхніми іменами. Драйвери можуть пріоритизувати конкретні slices або пули, відповідно називаючи їх. Для отримання додаткової інформації див. [Іменування та пріоритизація](#resourceslice-naming-and-prioritization).
5. **Планування Podʼів**: коли виділення ресурсів завершено, планувальник розміщує Podʼи на вузлі, який може отримати доступ до виділеного ресурсу. Драйвер пристрою та kubelet на цьому вузлі налаштовують пристрій і доступ Podʼів до пристрою.

## Спостережуваність динамічних ресурсів {#observability-dynamic-resources}

Ви можете перевірити стан динамічно виділених ресурсів будь-яким з наведених нижче способів:

* [Метрики kubelet ресурсів](#monitoring-resources)
* [Статус ResourceClaim](#resourceclaim-device-status)
* [Моніторинг справності пристроїів](#device-health-monitoring)

### Метрики kubelet ресурсів {#monitoring-resources}

Служба gRPC `PodResourcesLister` kubelet дозволяє вам контролювати використовувані пристрої. Повідомлення `DynamicResource` надає інформацію, яка є специфічною для динамічного виділення ресурсів, таку як імʼя пристрою та імʼя запиту. Для отримання додаткової інформації див. [Моніторинг ресурсів втулка пристроїв](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).

### Статус ResourceClaim пристрою {#resourceclaim-device-status}

{{< feature-state feature_gate_name="DRAResourceClaimDeviceStatus" >}}

Драйвери DRA можуть повідомляти специфічні для драйвера дані [стану пристрою](/docs/concepts/overview/working-with-objects/#object-spec-and-status) для кожного виділеного пристрою у полі `status.devices` у заявці на ресурс. Наприклад, драйвер може перелічити IP-адреси, призначені пристрою мережевого інтерфейсу. Оновлення цього поля вимагає спеціальних синтетичних дозволів RBAC, див. [Посібник із зміцнення безпеки — динамічний розподіл ресурсів](/docs/concepts/security/hardening-guide/dynamic-resource-allocation/) та [Посилення безпеки динамічного розподілу ресурсів у вашому кластері](/docs/tasks/administer-cluster/hardening-dra/).

Точність інформації, яку драйвер додає до поля `status.devices` у ResourceClaim, залежить від драйвера. Оцініть драйвери, щоб вирішити, чи можете ви покладатися на це поле як єдине джерело інформації про пристрій.

Якщо ви вимкнете функціональну можливість [`DRAResourceClaimDeviceStatus`](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourceClaimDeviceStatus), поле `status.devices` автоматично очищається під час зберігання ResourceClaim. Статус пристрою ResourceClaim підтримується, коли з DRA драйвера можливо оновити наявний ResourceClaim, де поле `status.devices` встановлено.

Детальніше про поле `status.devices` дивіться {{< api-reference page="workload-resources/resource-claim-v1beta1" anchor="ResourceClaimStatus" text="ResourceClaim" >}} в довілнику API.

### Моніторинг справності пристроїв {#device-health-monitoring}

{{< feature-state feature_gate_name="ResourceHealthStatus" >}}

Kubernetes надає механізм для моніторингу та звітування про стан динамічно виділених інфраструктурних ресурсів. Для stateful застосунків, що працюють на спеціалізованому обладнанні, критично важливо знати, коли пристрій вийшов з ладу або став несправним. Також корисно дізнатися, чи відновився пристрій.

Щоб увімкнути цю функціональність, необхідно активувати функціональну можливість[`ResourceHealthStatus`](/docs/reference/command-line-tools-reference/feature-gates/resource-health-status/) (бета, стандартно увімкнено починаючи з v1.36), а драйвер DRA повинен реалізувати gRPC-сервіс `DRAResourceHealth`.

Коли драйвер DRA виявляє, що виділений пристрій став несправним, він повідомляє про цей статус назад до kubelet. Ця інформація про стан потім безпосередньо відображається в статусі Podʼа. Kubelet заповнює поле `allocatedResourcesStatus` у статусі кожного контейнера, детально описуючи стан кожного пристрою, призначеного цьому контейнеру. Кожен запис про справність ресурсу може містити необов’язкове поле `message` із додатковою інформацією про стан, зрозумілою для людини, наприклад, деталями помилки або причинами збою.

Якщо kubelet не отримує оновлення стану від драйвера DRA протягом періоду очікування, стан пристрою позначається як «Unknown». Драйвери DRA можуть налаштовувати цей час очікування для кожного пристрою окремо, встановлюючи поле `health_check_timeout_seconds` у повідомленні gRPC `DeviceHealth`. Якщо це не вказано, kubelet використовує стандартний час очікування 30 секунд. Це дозволяє різним типам апаратного забезпечення (наприклад, GPU, FPGA або пристроям зберігання даних) використовувати відповідні значення часу очікування, виходячи з їхніх характеристик звітування про стан.

Це забезпечує критичну видимість для користувачів і контролерів, щоб реагувати на апаратні збої. Для Pod, який зазнає збою, ви можете перевірити цей статус, щоб визначити, чи був збій повʼязаний з несправним пристроєм.

{{< note >}}
Стан справності пристрою не оновлюється в статусі Podʼа після завершення роботи Podʼа (наприклад, у стані Failed).
{{< /note >}}

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

## Обмеження {#limitations}

* Планувальник Kubernetes не підтримує [випередження](/docs/concepts/scheduling-eviction/pod-priority-preemption/) для ресурсів DRA. Це означає, що наявний Pod, який працює на вузлі і використовує ресурси DRA, не може бути випереджений Podʼом з вищим пріоритетом, який також потребує ресурси DRA. Pod з високим пріоритетом залишатиметься в стані очікування, поки пристрій не стане доступним, що відбувається, коли конфліктуючий Pod завершує роботу або видаляється вручну.

## Бета-функції DRA {#beta-features}

У наступних розділах описано функції DRA, що підтримують розширені сценарії використання. Їх використання є необов’язковим і може бути актуальним лише для драйверів DRA, які їх підтримують.

Деякі з них доступні в Альфа чи Бета [функціональних можливостях](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages). Це залежить від увімкнення функціональних можливостей та може залежати від додаткових {{< glossary_tooltip text="груп API" term_id="api-group" >}}. Для отримання додаткової інформації дивіться [Налаштування DRA в кластері](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/).

## Адміністративний доступ {#admin-access}

{{< feature-state feature_gate_name="DRAAdminAccess" >}}

Ви можете позначити запит у ResourceClaim або ResourceClaimTemplate як такий, що має привілейовані можливості. Запит з правами адміністратора надає доступ до пристроїв, які використовуються, і
може увімкнути додаткові дозволи, якщо зробити пристрій доступним у
контейнері:

```yaml
apiVersion: resource.k8s.io/v1
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

Доступ адміністратора є привілейованим режимом, і його не слід надавати звичайним користувачам у кластерах з багатокористувацькою архітектурою. Поле `adminAccess` можуть використовувати лише ті користувачі, які мають дозвіл на створення об’єктів ResourceClaim або ResourceClaimTemplate у просторах імен, позначених тегом `resource.kubernetes.io/admin-access: "true"` (з урахуванням регістру). Це гарантує, що користувачі, які не є адміністраторами, не зможуть зловживати цією функцією.

Доступ адміністратора є _бета-функцією_ і є стандартно увімкненою за допомогою функціональної можливості [`DRAAdminAccess`](/docs/reference/command-line-tools-reference/feature-gates/#DRAAdminAccess) у kube-apiserver, kube-scheduler та kubelet.

### Авторизація на основі детального статусу {#granular-status-authorization}

{{< feature-state feature_gate_name="DRAResourceClaimGranularStatusAuthorization" >}}

Починаючи з Kubernetes v1.36, DRA застосовує детальні перевірки авторизації для оновлень статусу `ResourceClaim` за допомогою синтетичних субресурсів і дієслів, орієнтованих на вузли.

Для рекомендацій щодо підвищення безпеки, включаючи приклади RBAC для планувальника та драйверів DRA, дивіться [Посібник із зміцнення безпеки — динамічний розподіл ресурсів](/docs/concepts/security/hardening-guide/dynamic-resource-allocation/).

Для покрокової процедури для адміністратора кластера дивіться [Посилення безпеки динамічного розподілу ресурсів у вашому кластері](/docs/tasks/administer-cluster/hardening-dra/).

## Альфа-функції DRA {#alpha-features}

Наступні розділи описують функції DRA, які доступні в Альфа [функціональних можливостях](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages). Вони залежать від увімкнення функціональнимх можливостей та можуть залежати від додаткових {{< glossary_tooltip text="груп API" term_id="api-group" >}}. Для отримання додаткової інформації дивіться [Налаштування DRA в кластері](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/).

### Розширене виділення ресурсів за допомогою DRA {#extended-resource}

{{< feature-state feature_gate_name="DRAExtendedResource" >}}

Ви можете надати імʼя розширеного ресурсу для класу пристрою. Планувальник тоді вибере пристрої, які відповідають класу для запитів розширених ресурсів. Це дозволяє користувачам продовжувати використовувати запити розширених ресурсів у поді для запиту або розширених ресурсів, наданих втулком пристрою, або пристроїв DRA. Той самий розширений ресурс може бути наданий або втулком пристрою, або DRA на одному єдиному вузлі кластера. Той самий розширений ресурс може бути наданий втулком пристрою на деяких вузлах, а DRA на інших вузлах у тому ж кластері.

У наведеному нижче прикладі класу пристрою надано `extendedResourceName` `example.com/gpu`. Якщо под запитує розширений ресурс `example.com/gpu: 2`, його можна запланувати на вузол з двома або більше пристроями, які відповідають класу пристрою.

```yaml
apiVersion: resource.k8s.io/v1
kind: DeviceClass
metadata:
  name: gpu.example.com
spec:
  selectors:
  - cel:
      expression: device.driver == 'gpu.example.com' && device.attributes['gpu.example.com'].type
        == 'gpu'
  extendedResourceName: example.com/gpu
```

На додачу, користувачі можуть використовувати спеціальний розширений ресурс для виділення пристроїв без необхідності явно створювати ResourceClaim. Використовуючи префікс імені розширеного ресурсу `deviceclass.resource.kubernetes.io/` та імʼя DeviceClass. Це працює для будь-якого DeviceClass, навіть якщо він не вказує на імʼя розширеного ресурсу. Результуючий ResourceClaim міститиме запит на `ExactCount` вказаної кількості пристроїв цього DeviceClass.

Розширене виділення ресурсів DRA є _альфа-функцією_ і вмикається лише тоді, коли функціональна можливість [`DRAExtendedResource`](/docs/reference/command-line-tools-reference/feature-gates/#DRAExtendedResource) увімкнена в kube-apiserver, kube-scheduler та kubelet.

## Пристрої, що розділяються на розділи {#partitionable-devices}

{{< feature-state feature_gate_name="DRAPartitionableDevices" >}}

Пристрої, представлені в DRA, не обовʼязково мають бути одним пристроєм, підключеним до одного компʼютера, але також можуть бути логічними пристроями, що складаються з декількох пристроїв, підключених до декількох компʼютерів. Ці пристрої можуть споживати ресурси фізичних пристроїв, що перекриваються, а це означає, що при виділенні одного логічного пристрою інші пристрої будуть недоступні.

У ResourceSlice API це представлено у вигляді списку іменованих наборів CounterSets, кожен з яких містить набір іменованих лічильників. Лічильники представляють ресурси, доступні на фізичному пристрої, які використовуються логічними пристроями, оголошеними через DRA.

Логічні пристрої можуть вказувати список ConsumesCounters. Кожен запис містить посилання на CounterSet і набір іменованих лічильників з кількістю, яку вони будуть споживати. Отже, щоб пристрій можна було призначити, набори лічильників, на які є посилання, повинні мати достатню кількість для лічильників, на які посилається пристрій.

CounterSets повинні бути вказані в окремих від пристроїв ResourceSlices. Пристрої можуть використовувати лічильники з будь-якого CounterSet, визначеного в тому ж пулі ресурсів, що і пристрій.

Наведемо приклад двох пристроїв, кожен з яких споживає по 6 гігабайтів памʼяті зі спільного лічильника з 8 гігабайтами памʼяті. Таким чином, тільки один з пристроїв може бути виділений у будь-який момент часу. Планувальник обробляє це, і це прозоро для споживача, оскільки API ResourceClaim не зачіпається.

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

Пристрої, що розділяються на розділи, є _бета-версією_ і вмикаються лише тоді, коли у kube-apiserver та kube-scheduler увімкнено функціональну можливість [`DRAPartitionableDevices`](/docs/reference/command-line-tools-reference/feature-gates/#DRAPartitionableDevices).

### Споживча ємність {#consumable-capacity}

{{< feature-state feature_gate_name="DRAConsumableCapacity" >}}

Функція споживчої ємності дозволяє використовувати ті самі пристрої кількома незалежними ResourceClaims, при цьому планувальник Kubernetes керує тим, скільки ємності пристрою використовується кожним запитом. Це аналогічно тому, як Podʼи можуть разом використовувати ресурси вузла; ResourceClaims можуть ділитися ресурсами на пристрої.

Драйвер пристрою може встановити поле `allowMultipleAllocations`, додане в `.spec.devices` розділу `ResourceSlice`, щоб дозволити виділення цього пристрою кільком незалежним ResourceClaims або кільком запитам у межах одного ResourceClaim.

Користувачі можуть встановити поле `capacity`, додане в `spec.devices.requests` розділу `ResourceClaim`, щоб вказати вимоги до ресурсів пристрою для кожного виділення.

Для пристрою, який дозволяє кілька виділень, запитувана ємність береться з його загальної ємності, концепції, відомої як **споживча ємність**. Потім планувальник забезпечує, щоб загальна споживана ємність усіх запитів не перевищувала загальну ємність пристрою. Крім того, автори драйверів можуть використовувати обмеження `requestPolicy` на окремі можливості пристроїв, щоб контролювати, як ці можливості споживаються. Наприклад, автор драйвера може вказати, що певна можливість споживається лише інкрементами по 1Gi.

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

Споживча ємність може бути запитана, як показано в наведеному нижче прикладі.

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

Результат виділення включатиме споживану ємність і ідентифікатор частки.

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

В цьому прикладі було обрано пристрій з можливістю множинного виділення. Однак будь-який пристрій `resource.example.com` з принаймні запитуваною пропускною здатністю 1G міг би задовольнити вимогу. Якщо б було обрано пристрій без можливості множинного виділення, виділення призвело б до використання всього пристрою. Щоб примусити використовувати лише пристрої з можливістю множинного виділення, ви можете використовувати критерій CEL `device.allowMultipleAllocations == true`.

#### Обмеження DistinctAttribute {#distinctattribute-constraint}

При запиті на кілька пристроїв у ResourceClaim можна використовувати обмеження DistinctAttribute, щоб гарантувати, що кожен виділений пристрій має відмінне значення для вказаного атрибута. Це обмеження було введено разом із функцією споживаної ємності.

Обмеження DistinctAttribute є особливо корисним під час роботи з пристроями, які можна виділяти кілька разів. Воно запобігає тому, щоб планувальник виділяв один і той самий пристрій кілька разів у межах одного ResourceClaim, навіть якщо цей пристрій дозволяє багаторазове виділення.

Окрім запобігання дублюванню виділень, це обмеження допомагає оптимізувати продуктивність, гарантуючи розподіл пристроїв на основі їхніх атрибутів. Наприклад, ви можете використовувати його для розподілу пристроїв між різними вузлами NUMA, щоб оптимізувати пропускну здатність пам'яті та зменшити конфлікти.

### Позначки taint та толерування їх пристроями {#device-taints-and-tolerations}

{{< feature-state feature_gate_name="DRADeviceTaints" >}}

Позначки taint пристроїв подібні до позначок вузлів: позначка має рядок-ключ, рядок-значення та ефект. Ефект застосовується до ResourceClaim, який використовує познапчений пристрій, і до всіх Podʼів, що посилаються на цей ResourceClaim. Ефект “NoSchedule" запобігає плануванню цих Podʼів. Позначені пристрої ігноруються при спробі виділити ResourceClaim, тому що їх використання перешкоджає плануванню для Podʼів.

Ефект "NoExecute” означає "NoSchedule" і, крім того, спричиняє виселення всіх Podʼів, які вже були заплановані. Це виселення реалізовано у контролері виселення позначених пристроїв у kube-controller-manager шляхом видалення відповідних Podʼів.

Ефект «None» ігнорується планувальником і контролером виселення. Драйвери DRA можуть використовувати його для повідомлення адміністраторам або іншим контролерам про винятки, наприклад про погіршення стану пристрою. Адміністратори також можуть використовувати його для пробного виселення подів у DeviceTaintRules (докладніше про це нижче).

ResourceClaims можуть толерантно ставитися до позначок. Якщо позначка толерується, її ефект не застосовується. Порожня толерантність відповідає всім позначкам. Толерантність може бути обмежена певними ефектами та/або відповідати певним парам ключ/значення. Толерантність може перевіряти існування певного ключа, незалежно від того, яке значення він має, або перевіряти конкретні значення ключа. Для отримання додаткової інформації про таке зіставлення див. [концепції поначення вузлів](/docs/concepts/scheduling-eviction/taint-and-toleration#concepts).

Виселення може бути відкладено за допомогою толерантності до позначки протягом певного часу. Ця затримка починається з моменту додавання позначки на пристрій, що записується у полі taint.

Позначки застосовуються, як описано вище, також до ResourceClaims, що виділяють «всі» ("all") пристрої на вузлі. Всі пристрої не повинні бути позначені, або всі їхні позначки повинні бути толеровані. Виділення пристрою з доступом адміністратора (описано [вище](#admin-access)) також не є винятком. Адміністратор, який використовує цей режим, повинен явно толерантно ставитися до всіх позначок, щоб отримати доступ до позначених пристроїв.

Додавання позначок taint пристроям та їх толерування є _бета-версією_ і вмикається лише тоді, коли увімкнено функціональну можливість [`DRADeviceTaints`](/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceTaints) в kube-apiserver, kube-controller-manager та kube-scheduler. Щоб використовувати DeviceTaintRules, необхідно ввімкнути версію API `resource.k8s.io/v1beta2` разом із функціональною можливостю [`DRADeviceTaintRules`](/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceTaintRules). На відміну від `DRADeviceTaints`, `DRADeviceTaintRules` зазвичай вимкнено через залежність від бета-групи API, яка стандартно має бути вимкнена.

Ви можете додавати позначки до пристроїв наступними способами, використовуючи тип API DeviceTaintRule.

#### Позначки встановлені драйвером {#taints-set-by-the-driver}

Драйвер DRA може додавати позначки до інформації про пристрій, яку він публікує у ResourceSlices. Зверніться до документації драйвера DRA, щоб дізнатися, чи використовує він позначки і які їхні ключі та значення.

#### Позначки встановлені адміністратором {#taints-set-by-an-admin}

{{< feature-state feature_gate_name="DRADeviceTaintRules" >}}

Адміністратор або компонент панелі управління може додавати позначуи на пристрої без необхідності вказувати драйверу DRA включати позначки до інформації про пристрій у ResourceSlices. Вони роблять це шляхом створення DeviceTaintRules. Кожне DeviceTaintRule додає одну позначку до пристроїв, які відповідають селектору пристрою. Без такого селектора жоден пристрій не буде позначений. Це ускладнює випадкове виселення всіх пристроїв за допомогою ResourceClaims, якщо помилково не вказати селектор.

Пристрої можна вибрати, вказавши імʼя класу DeviceClass, драйвера, пулу та/або пристрою. Клас пристроїв вибирає всі пристрої, які вибрані селекторами у цьому класі пристроїв. Маючи лише імʼя драйвера, адміністратор може позначити всі пристрої, що керуються цим драйвером, наприклад, під час виконання певного виду обслуговування цього драйвера у всьому кластері. Додавання назви пулу може обмежити позначення до одного вузла, якщо драйвер керує локальними пристроями вузла.

Нарешті, додаванням назви пристрою можна вибрати один конкретний пристрій. За бажанням, назву пристрою і назву пулу можна використовувати окремо. Наприклад, драйверам для локальних пристроїв рекомендується використовувати назву вузла як назву пулу. У такому разі позначення з таким іменем пулу автоматично призведе до позначення усіх пристроїв на вузлі.

Драйвери можуть використовувати стабільні назви на зразок «gpu-0», які приховують, який саме пристрій наразі призначено для цієї назви. Для підтримки позначення певного екземпляра обладнання у правилі DeviceTaintRule можна використовувати селектори CEL, які відповідатимуть унікальному атрибуту ідентифікатора виробника, якщо драйвер підтримує такий атрибут для свого обладнання.

Позначення застосовується доти, доки існує правило DeviceTaintRule. Його можна будь-коли змінити або вилучити. Ось один із прикладів DeviceTaintRule для вигаданого драйвера DRA:

```yaml
apiVersion: resource.k8s.io/v1beta2
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

kube-apiserver автоматично відстежує час створення цієї позначки, встановлюючи поле `timeAdded` у `spec`. Період толерування починається з цієї позначки часу. Під час оновлень, що змінюють ефект (див. імітований процес витіснення нижче), kube-apiserver автоматично оновлює позначку часу. Користувачі можуть явно керувати позначкою часу, встановлюючи це поле під час створення DeviceTaintRule та змінюючи його на інше значення під час оновлення.

Статус містить умову, додану контролером виселення:

```sh
kubectl describe devicetaintrules
```

```none
Name:         example
...
Spec:
  Device Selector:
    Driver:  dra.example.com
  Taint:
    Effect:      NoExecute
    Key:         dra.example.com/unhealthy
    Time Added:  2025-11-05T18:15:37Z
    Value:       Broken
Status:
  Conditions:
    Last Transition Time:  2025-11-05T18:15:37Z
    Message:               1 pod evicted since starting the controller.
    Observed Generation:   1
    Reason:                Completed
    Status:                False
    Type:                  EvictionInProgress
Events:                    <none>
```

Поди виселяються шляхом їх видалення. Зазвичай це відбувається дуже швидко, за винятком випадків, коли толерантність до taint затримує цей процес на певний період або коли потрібно виселити дуже багато подів. Якщо це займає більше часу, повідомлення надає інформацію про поточний стан:

```none
2 pods need to be evicted in 2 different namespaces. 1 pod evicted since starting the controller.
```

Ця умова може бути використана для перевірки, чи є виселення активним на даний момент:

```sh
kubectl wait --for=condition=EvictionInProgress=false DeviceTaintRule/example
```

Слід бути обережним щодо потенційного стану перегонів між планувальником і контролером, які спостерігають за новим taint у різний час, що може призвести до того, що поди все ще будуть заплановані в той час, коли контролер вважає, що немає жодного, який потрібно виселити, і тому встановлює цей стан на `False`. На практиці такий стан перегонів є дуже малоймовірним, оскільки оновлення стану відбувається лише після навмисної затримки в кілька секунд.

Для `effect: None` повідомлення надає інформацію про кількість уражених пристроїв, скільки з них виділено і скільки подів буде виселено, якщо ефект буде `NoExecute`. Це можна використовувати для пробного запуску перед фактичним запуском виселення:

* Створіть DeviceTaintRule з бажаними селекторами та `effect: None`.

* Перегляньте повідомлення:

  ```none
  3 published devices selected. 1 allocated device selected.
  1 pod would be evicted in 1 namespace if the effect was NoExecute.
  This information will not be updated again. Recreate the DeviceTaintRule to trigger an update.
  ```

  Опубліковані пристрої — це пристрої, перелічені в ResourceSlices. Позначення їх taint запобігає виділенню нових подів. Тільки виділені пристрої спричиняють виселення подів, які їх використовують.

* Відредагуйте DeviceTaintRule і змініть ефект на `NoExecute`.

### Статус пулу ресурсів {#resource-pool-status}

{{< feature-state feature_gate_name="DRAResourcePoolStatus" >}}

Ви можете перевірити доступність пристроїв у пулах ресурсів за допомогою API ResourcePoolStatusRequest. Це надає видимість того, скільки пристроїв доступно, виділено або недоступно у пулах ресурсів DRA вашого кластера.

Щоб перевірити статус пулу ресурсів:

1. Створіть ResourcePoolStatusRequest, вказавши імʼя драйвера (обовʼязково) та необовʼязково обмежте кількість пулів, що повертаються. Ви також можете обмежити його до одного пулу, вказавши імʼя пулу:

   ```yaml
   apiVersion: resource.k8s.io/v1beta2
   kind: ResourcePoolStatusRequest
   metadata:
     name: check-gpus
   spec:
     driver: example.com/gpu
     # Опціонально: обмежте до конкретного пулу
     # poolName: my-pool
     # Опціонально: обмежте кількість повернутих пулів (за замовчуванням: 100, максимум: 1000)
     # limit: 10
   ```

2. Зачекайте, поки контролер обробить запит:

   ```shell
   kubectl wait --for=condition=Complete resourcepoolstatusrequest/check-gpus --timeout=30s
   ```

3. Прочитайте статус, щоб побачити доступність пулу:

   ```shell
   kubectl get resourcepoolstatusrequest/check-gpus -o yaml
   ```

   Статуси включають:
   * `poolCount`: загальна кількість пулів, що відповідають фільтру (може перевищувати кількість пулів, зазначених у списку, якщо обмежено ліміт).
   * `pools`: список деталей пулу, кожен з яких містить:
     * `driver` та `poolName`: ідентифікують пул.
     * `generation`: останнє покоління пулу, спостережуване через ResourceSlices.
     * `resourceSliceCount`: кількість ResourceSlices, що складають пул.
     * `totalDevices`: загальна кількість пристроїв у пулі.
     * `allocatedDevices`: пристрої, які наразі виділені для запитів.
     * `availableDevices`: пристрої, доступні для виділення (totalDevices - allocatedDevices - unavailableDevices).
     * `unavailableDevices`: пристрої, недоступні через taints або інші умови.
     * `nodeName`: вузол, повʼязаний з пулом, якщо є.
     * `validationError`: встановлюється, коли дані пулу не можуть бути повністю перевірені (наприклад, під час розгортання покоління). Коли встановлено, поля підрахунку пристроїв можуть бути не встановлені.
   * `conditions`: включає типи умов `Complete` (успіх) або `Failed` (помилка).

4. Видаліть запит після завершення:

   ```shell
   kubectl delete resourcepoolstatusrequest/check-gpus
   ```

Обʼєкти ResourcePoolStatusRequest обробляються контролером у kube-controller-manager лише один раз. Специфікація є незмінною після створення, і весь обʼєкт стає незмінним після заповнення статусу. Щоб отримати оновлені дані про доступність, видаліть і створіть запит заново. Завершені запити автоматично очищуються через 1 годину.

Ця функція вимагає явних дозволів RBAC на ресурс ResourcePoolStatusRequest. Жодна з стандартних ClusterRoles не включає цей дозвіл.

Статус пулу ресурсів є _alpha-функцією_ і її увімкнено лише тоді, коли функціональну можливість [`DRAResourcePoolStatus`](/docs/reference/command-line-tools-reference/feature-gates/#DRAResourcePoolStatus) увімкнено в kube-apiserver та kube-controller-manager.

### Умови привʼязки пристрою {#device-binding-conditions}

{{< feature-state feature_gate_name="DRADeviceBindingConditions" >}}

Умови привʼязки пристрою дозволяють планувальнику Kubernetes затримувати привʼязку Podʼа до тих пір, поки зовнішні ресурси, такі як GPU з підключенням до фабрики або перепрограмовані FPGA, не будуть підтверджені як готові.

Ця поведінка очікування реалізована в [фазі PreBind](/docs/concepts/scheduling-eviction/scheduling-framework/#pre-bind) фреймворку планування. Під час цієї фази планувальник перевіряє, чи всі необхідні умови пристрою є виконаними, перш ніж продовжити з привʼязкою.

Це покращує надійність планування, уникаючи передчасної привʼязки, і дозволяє координацію з зовнішніми контролерами пристроїв.

Щоб використовувати цю функцію, драйвери пристроїв (зазвичай керовані власниками драйверів) повинні опублікувати наступні поля в розділі `Device` `ResourceSlice`. Адміністратори кластерів повинні увімкнути функціональні можливості `DRADeviceBindingConditions` і `DRAResourceClaimDeviceStatus`, щоб планувальник міг враховувати ці поля.

`bindingConditions`
: Список типів станів, які повинні бути встановлені в True в полі status.conditions асоційованого ResourceClaim, перш ніж Pod може бути привʼязаний. Це зазвичай представляє сигнали готовності, такі як "DeviceAttached" або "DeviceInitialized".

`bindingFailureConditions`
: Список типів станів, які, якщо встановлені в True в полі status.conditions асоційованого ResourceClaim, вказують на стан збою. Якщо будь-який з цих станів є True, планувальник скасує привʼязку та перенаправить Pod.

`bindsToNode`
: якщо встановлено в `true`, планувальник записує вибране імʼя вузла в полі status.allocation.nodeSelector асоційованого ResourceClaim. Це не впливає на `spec.nodeSelector` Podʼа. Натомість він встановлює селектор вузла всередині ResourceClaim, який зовнішні контролери можуть використовувати для виконання специфічних для вузла операцій, таких як підключення або підготовка пристроїв.

Усі типи станів, перераховані в bindingConditions і bindingFailureConditions, оцінюються з поля `status.conditions` асоційованого ResourceClaim. Зовнішні контролери відповідають за оновлення цих станів, використовуючи стандартну семантику станів Kubernetes (`type`, `status`, `reason`, `message`, `lastTransitionTime`).

Планувальник чекає до **600 секунд** (стандартно), щоб усі `bindingConditions` стали `True`. Якщо тайм-аут досягається або будь-які `bindingFailureConditions` є `True`, планувальник очищає виділення та перенаправляє Pod. Адміністратор кластера може налаштувати тривалість цього тайм-ауту, редагуючи файл конфігурації kube-scheduler.

Приклад налаштування цього тайм-ауту в `KubeSchedulerConfiguration` наведено нижче:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
- schedulerName: default-scheduler
  pluginConfig:
  - name: DynamicResources
    args:
      apiVersion: kubescheduler.config.k8s.io/v1
      kind: DynamicResourcesArgs
      bindingTimeout: 60s
```

#### Приклад {#device-binding-conditions-example}

Нижче наведено приклад ResourceSlice, який ви можете побачити в кластері, де використовується драйвер DRA, і цей драйвер підтримує умови привʼязки:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: gpu-slice-1
spec:
  driver: dra.example.com
  nodeSelector:
    nodeSelectorTerms:
    - matchExpressions:
      - key: accelerator-type
        operator: In
        values:
        - "high-performance"
  pool:
    name: gpu-pool
    generation: 1
    resourceSliceCount: 1
  devices:
    - name: gpu-1
      attributes:
        vendor:
          string: "example"
        model:
          string: "example-gpu"
      bindsToNode: true
      bindingConditions:
        - dra.example.com/is-prepared
      bindingFailureConditions:
        - dra.example.com/preparing-failed
```

Цей приклад ResourceSlice має такі властивості:

* ResourceSlice націлений на вузли з міткою `accelerator-type=high-performance`, щоб планувальник використовував лише певний набір допустимих вузлів.
* Планувальник вибирає один вузол з обраної групи (наприклад, `node-3`) і встановлює поле `status.allocation.nodeSelector` в ResourceClaim на це імʼя вузла.
* Умова привʼязки `dra.example.com/is-prepared` вказує на те, що пристрій `gpu-1` повинен бути підготовлений (умова `is-prepared` має статус `True`) перед привʼязкою.
* Якщо підготовка пристрою `gpu-1` не вдалася (умова `preparing-failed` має статус `True`), планувальник скасовує привʼязку.
* Планувальник чекає до 600 секунд (стандартно), щоб пристрій став готовим.
* Зовнішні контролери можуть використовувати селектор вузла в ResourceClaim для виконання операцій, специфічних для вузла, на вибраному вузлі.

Умови привʼязки пристроїв є _бета-функцією_ і вона стандартно увімкнена, а її робота регулюється функціональною можливістю [`DRADeviceBindingConditions`](/docs/reference/command-line-tools-reference/feature-gates/#DRADeviceBindingConditions) у kube-apiserver та kube-scheduler.

### Ресурси вузла, доступні для виділення {#node-allocatable-resources}

{{< feature-state feature_gate_name="DRANodeAllocatableResources" >}}

Пристрої, що управляються DRA, можуть мати базову конфігурацію, яка складається з ресурсів, що розподіляються на рівні вузлів, таких як `cpu`, `memory`, `hugepages` або `ephemeral-storage`. Ця функція інтегрує ці запити на основі DRA у стандартний розрахунок планувальника поряд зі звичайними запитами `spec` Podʼа на ці ресурси.

Користувачі (автори PodSpec) можуть використовувати комбінацію ресурсів на рівні Podʼа, ресурсів на рівні контейнера та ресурсних запитів з повʼязаними ресурсами вузла. Ці пристрої представляють ресурси, такі як CPU або памʼять безпосередньо, або вони можуть бути прискорювачами, мережевими інтерфейсними картами або іншими пристроями, які потребують деяких ресурсів хоста при виділенні. Драйвер DRA заповнює інформацію в ResourceSlice, яка повідомляє планувальнику, як обчислити ресурси вузла, доступні для виділення, коли пристрій виділяється для ResourceClaim. Авторам PodSpec не потрібно робити ці обчислення самостійно.

При створенні PodSpec з використанням запитів для цих типів пристроїв, слід враховувати кілька моментів:

* Коли використовуються ресурси на рівні Podʼа, сума всіх ресурсів контейнера та запитів не повинна перевищувати ресурси на рівні Podʼа; в іншому випадку Pod не зможе бути запланований.
* Загальна потреба контейнера в ресурсах є сумою його ресурсів на рівні контейнера та будь-яких ресурсів вузла з повʼязаних запитів.
* Запити, що споживають ресурси вузла, не можуть бути спільними між Podʼами.

#### Деталі для авторів драйверів DRA {#details-for-dra-driver-authors}

Драйвери DRA оголошують обсяг ресурсів, що можуть бути виділені на цьому вузлі, за допомогою поля `nodeAllocatableResourceMappings` для пристроїв у ResourceSlice. Це зіставлення перетворює запитуваний пристрій DRA або його ємність у стандартні ресурси, які відстежуються у полі `status.allocatable` вузла (зверніть увагу, що розширені ресурси для цього зіставлення не підтримуються). Це корисно як для драйверів, які безпосередньо надають доступ до власних ресурсів (наприклад, драйвери DRA для процесора або памʼяті), так і для пристроїв, які потребують допоміжних залежностей від вузла (наприклад, прискорювач, якому потрібна памʼять на хості).

Це зіставлення визначає перетворення запитуваного пристрою DRA або одиниць ємності на відповідну кількість ресурсу, доступного для виділення на вузлі. Планувальник обчислює точну кількість за допомогою:

* **Масштабування на основі пристрою:** Якщо `capacityKey` не встановлено, `allocationMultiplier` множить кількість пристроїв, виділених для запиту. `allocationMultiplier` зазвичай дорівнює 1, якщо не вказано.
* **Масштабування на основі ємності:** Якщо `capacityKey` встановлено, він посилається на назву ємності, визначену в мапі `capacity` пристрою. Планувальник перевіряє кількість цієї ємності, спожитої запитом, і множить її на `allocationMultiplier`.

##### Приклад: CPU DRA Driver (Масштабування на основі ємності) {#example-cpu-dra-driver-capacity-based-scaling}

Ось приклад, де драйвер CPU DRA відкриває сокет CPU як пул з 128 CPU, використовуючи [споживчу ємність DRA](#consumable-capacity). `capacityKey` повʼязує споживану ємність `cpu.example.com/cpu` безпосередньо зі стандартним ресурсом `cpu`, доступним на вузлі:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: my-node-cpus
spec:
  driver: cpu.example.com
  nodeName: my-node
  pool:
    name: socket-cpus
    generation: 1
    resourceSliceCount: 1
  devices:
  - name: socket0cpus
    allowMultipleAllocations: true
    capacity:
      "cpu.example.com/cpu": "128"
    nodeAllocatableResourceMappings:
      cpu:
        capacityKey: "cpu.example.com/cpu"
        # allocationMultiplier зазвичай дорівнює 1, якщо не вказано
  - name: socket1cpus
    allowMultipleAllocations: true
    capacity:
      "cpu.example.com/cpu": "128"
    nodeAllocatableResourceMappings:
      cpu:
        capacityKey: "cpu.example.com/cpu"
        # allocationMultiplier зазвичай дорівнює 1, якщо не вказано
```

##### Приклад: Прискорювач з допоміжними ресурсами (Масштабування на основі пристрою) {#example-accelerator-with-auxiliary-resources-device-based-scaling}

Ось приклад, де ресурсний слайс вимагає додаткових 8Gi памʼяті на кожен екземпляр пристрою для функціонування:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: my-node-xpus
spec:
  driver: xpu.example.com
  nodeName: my-node
  pool:
    name: xpu-pool
    generation: 1
    resourceSliceCount: 1
  devices:
  - name: xpu-model-x-001
    attributes:
      example.com/model:
        string: "model-x"
    nodeAllocatableResourceMappings:
      memory:
        allocationMultiplier: "8Gi"
```

Після того як Pod було успішно привʼязано до вузла, точні кількості ресурсів, доступних на вузлі, виділених через DRA, включаються у поле `status.nodeAllocatableResourceClaimStatuses` Pod.

Ресурси, що розподіляються на рівні вузлів, є функцією в стадії альфа-тестування і активуються, коли в kube-apiserver, kube-scheduler та kubelet увімкнено функціональну можливість [`DRANodeAllocatableResources`](/docs/reference/command-line-tools-reference/feature-gates/#DRANodeAllocatableResources). На етапі альфа-тестування kubelet не враховує ці ресурси під час визначення класів QoS, налаштування cgroups або прийняття рішень щодо витіснення.

### Метадані пристроїв DRA в контейнерах {#device-metadata}

{{< feature-state state="alpha" for_k8s_version="v1.36" >}}

Драйвери DRA можуть надавати метадані пристроїв, такі як атрибути пристроїв (адреси PCI або mdevUUID для опосередкованих пристроїв) або конфігурацію мережі безпосередньо в контейнери у вигляді JSON-файлів. Це дозволяє застосунками всередині контейнера дізнаватися інформацію про виділені пристрої без запитів до Kubernetes API або створення власних контролерів.

KEP-5304 визначає [протокол метаданих пристроїв](#device-metadata-protocol), якого повинні дотримуватися драйвери, щоб застосунки всередині контейнера бачили узгоджене розташування даних на різних драйверах і кластерах. [Бібліотека втулків kubelet для DRA](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin) реалізує цей протокол для вас; решта цього розділу описує, як його використовувати.

Метадані пристрою дотримуються тих самих правил, що й доступ до пристроїв: вони доступні всередині контейнера лише тоді, коли цей контейнер запитує пристрій у своїй специфікації контейнера, і ні в якому іншому випадку. Щоб дізнатися, як запитувати пристрої DRA в Podʼах і контейнерах, див. [Запитування пристроїв у робочих навантаженнях за допомогою DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/#request-devices-workloads).

#### Протокол метаданих пристроїв {#device-metadata-protocol}

Протокол складається з чотирьох правил:

1. **Шляхи до файлів.** Файли метаданих знаходяться всередині контейнерів у теці `/var/run/kubernetes.io/dra-device-attributes`. Для безпосередньо вказаного ResourceClaim шлях виглядає як `resourceclaims/<claimName>/<requestName>/<driverName>-metadata.json`; для заявки, створеної з ResourceClaimTemplate, шлях виглядає як `resourceclaimtemplates/<podClaimName>/<requestName>/<driverName>-metadata.json` (де `podClaimName` — це `pod.spec.resourceClaims[].name`).

   У випадках, коли запит ResourceClaim використовує функцію [пріоритетного списку](#prioritized-list), для сегмента шляху `<requestName>` використовується лише імʼя верхнього рівня запиту (тобто частина `/<subrequest>` опускається). Всередині JSON-файлу поле `requests[].name` містить повне посилання `<request>/<subrequest>` (наприклад, `gpu/high-memory`), щоб споживачі могли визначити, яка альтернатива була виділена.

   Константи шляхів визначені в [`k8s.io/dynamic-resource-allocation/api/metadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata).

1. **JSON API.** Кожен файл є потоком одного або кількох обʼєктів [`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1alpha1#DeviceMetadata), серіалізованих у версіонований JSON з `apiVersion` та `kind`, відповідно до домовленостей Kubernetes API. Ті самі метадані кодуються один раз для кожної підтримуваної версії API (спочатку найновіша). Усі обʼєкти в потоці семантично еквівалентні; споживачі повинні використовувати перший обʼєкт, який вони можуть декодувати.

1. **Генерація.** Коли драйвер оновлює файл метаданих, вбудоване поле `metadata.generation` повинно збільшуватися, щоб споживачі могли виявляти зміни.

1. **Відображення в контейнері.** Файли зазвичай відображаються через {{< glossary_tooltip text="CDI" term_id="cdi" >}} bind-mounts, але дозволяються й інші механізми, якщо файл зʼявляється за правильним шляхом і є доступним лише для читання всередині контейнера.

#### Як працюють метадані пристроїв {#device-metadata-how-it-works}

Метадані пристроїв є функцією на стороні драйвера, яка не потребує змін у Kubernetes API або увімкнення функціональних можливостей. Використання бібліотеки втулків DRA kubelet є поширеним способом реалізації драйвера, але драйвери можна створювати й іншими способами. Драйвери, які використовують втулок kubelet, активують цю функцію, передаючи [параметри](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin#Option) `EnableDeviceMetadata` та `MetadataVersions` під час запуску втулка. `MetadataVersions` вказує, які версії API серіалізуються у файл метаданих і повинні бути явно встановлені драйвером. Перевірте документацію вашого драйвера DRA, щоб дізнатися, чи підтримуються метадані пристроїв і як їх увімкнути.

Коли метадані пристроїв увімкнено, драйвер генерує файли метаданих і специфікації CDI bind-mount під час підготовки виділених пристроїв для поду, перед запуском контейнерів, що їх споживають. Метадані зʼявляються всередині контейнерів за відомими шляхами, як [визначено вище](#device-metadata-protocol).

Коли один запит виділяє пристрої від кількох драйверів DRA, кожен драйвер записує свій власний файл метаданих. Контейнери перераховують файли `*-metadata.json` у теці запиту, щоб виявити всі пристрої.

Пакунок Go [`k8s.io/dynamic-resource-allocation/devicemetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/devicemetadata) надає утиліти для читання та декодування цих файлів метаданих застосунками всередині контейнера.

#### Схема метаданих {#device-metadata-schema}

Кожен файл метаданих відповідає API [`DeviceMetadata`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/api/metadata/v1alpha1#DeviceMetadata) (`metadata.resource.k8s.io/v1alpha1`). Наступний приклад показує файл метаданих для GPU-пристрою, виділеного через ResourceClaimTemplate:

```json
{
  "kind": "DeviceMetadata",
  "apiVersion": "metadata.resource.k8s.io/v1alpha1",
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

#### Негайні та відкладені метадані {#device-metadata-lifecycle}

Драйвери надають метадані одним із двох способів:

Негайно
: Драйвер заповнює метадані під час підготовки запиту на вузлі та записує файл метаданих перед запуском контейнера. Це типово для драйверів GPU, де інформація про пристрій відома під час підготовки.

Відкладено
: У деяких випадках, наприклад для мережевого драйвера, інформація про пристрій недоступна під час виділення пристрою, але стає доступною після створення пісочниці середовища Podʼа. У таких випадках драйвер створює CDI-монтування з порожнім файлом метаданих і записує фактичні метадані пізніше через NRI-хук, який виконується перед запуском контейнера. Це гарантує, що застосунки ніколи не бачать відсутній або частково записаний файл. Кожне оновлення повинно збільшувати `metadata.generation`, щоб споживачі могли виявляти зміни. API `MetadataUpdater` у бібліотеці втулків DRA kubelet автоматично обробляє ведення поколінь для авторів драйверів.

В обох випадках метадані залишаються доступними для кожного контейнера, що їх використовує, протягом усього часу життя цього контейнера. Файли метаданих видаляються після завершення роботи всіх контейнерів у Podʼі.

Щоб дізнатися, як використовувати метадані пристроїв у ваших робочих навантаженнях, див. [Доступ до метаданих пристроїв DRA](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/).

#### Власні драйвери {#device-metadata-custom-drivers}

Власні, створені вручну драйвери, які не використовують бібліотеку втулків DRA kubelet, повинні самостійно реалізувати [протокол метаданих пристроїв](#device-metadata-protocol). Це означає запис `DeviceMetadata` у форматі JSON у правильні шляхи файлів, збільшення `metadata.generation` при кожному оновленні та надання файлів лише для читання всередині контейнера через CDI або еквівалентний механізм.

### Атрибути типу список {#list-type-attributes}

{{< feature-state feature_gate_name="DRAListTypeAttributes" >}}

Ця функція покращує API ResourceSlice, дозволяючи драйверам DRA вказувати значення списків для атрибутів пристроїв замість лише скалярних значень. Це корисно для моделювання більш складних внутрішніх топологій вузлів, наприклад, коли CPU має суміжність з кількома коренями PCIe.

Для авторів ResourceClaim (кінцевих користувачів) це означає, що `matchAttribute` та `distinctAttribute` працюють краще для цих випадків.

* `matchAttribute` — два атрибути повинні мати _непорожній перетин списків_, а не бути ідентичними (скалярні значення розглядаються як списки з одним елементом). Це означає, що якщо один драйвер публікує одне значення, наприклад, для кореня PCIe, а інший драйвер публікує список, обмеження виконується, якщо одне значення з'являється десь у списку.
* `distinctAttribute` — значення атрибутів повинні бути _попарно незʼєднаними_ (жодне значення не є спільним між будь-якими двома пристроями)

Щоб допомогти авторам ResourceClaim використовувати атрибути, які можуть бути списками, у виразах CEL, ця функція також запроваджує функцію CEL `includes()`.

```cel
# Scalar attribute (backward compatible)
# assume: device.attributes["dra.example.com"].model = "model-a"
device.attributes["dra.example.com"].model.includes("model-a")  # true
device.attributes["dra.example.com"].model.includes("model-b")  # false

# List-type attribute (requires DRAListTypeAttributes)
# assume: device.attributes["dra.example.com"].supported-models= ["model-a", "model-b"]
device.attributes["dra.example.com"].supported-models.includes("model-a")  # true
device.attributes["dra.example.com"].supported-models.includes("model-c")  # false
```

#### Деталі для авторів драйверів DRA {#details-for-dra-driver-authors-1}

Зазвичай кожен `DeviceAttribute` містить точно одне скалярне значення: булеве, ціле число, рядок або рядок семантичної версії. Функція `DRAListTypeAttributes` розширює `DeviceAttribute` чотирма полями типу список, дозволяючи пристрою рекламувати кілька значень для одного атрибута:

* **`bools`** — список булевих значень
* **`ints`** — список 64-бітних цілих чисел
* **`strings`** — список рядків (кожен не більше 64 символів)
* **`versions`** — список рядків семантичних версій відповідно до специфікації semver.org 2.0.0 (кожен не більше 64 символів)

Загальна кількість окремих значень атрибутів на пристрій (скалярні поля плюс всі елементи списків разом) обмежена **48**. Коли будь-який пристрій у ResourceSlice використовує цю функцію або інші розширені функції, такі як taints, ResourceSlice буде обмежений максимум **64** пристроями.

Ось приклад пристрою, який оголошує кілька підтримуваних моделей за допомогою атрибута рядка типу список:

```yaml
kind: ResourceSlice
apiVersion: resource.k8s.io/v1
metadata:
  name: example-resourceslice
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 1
  driver: dra.example.com
  devices:
  - name: gpu-0
    attributes:
      dra.example.com/supported-models:
        strings:
        - model-a
        - model-b
```

Атрибути типу список є _alpha-функцією_ і увімкнені лише тоді, коли `DRAListTypeAttributes` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) увімкнено в kube-apiserver та kube-scheduler.

## {{% heading "whatsnext" %}}

* [Налаштування DRA у кластері](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)
* [Виділення пристроїв для робочих навантажень за допомогою DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/)
* [Доступ до метаданих пристроїв DRA](/docs/tasks/configure-pod-container/assign-resources/access-dra-device-metadata/)
* Для отримання додаткової інформації про дизайн дивіться KEP: [Dynamic Resource Allocation with Structured Parameters](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters).
