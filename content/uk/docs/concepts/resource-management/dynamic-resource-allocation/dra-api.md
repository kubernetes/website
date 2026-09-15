---
title: Обʼєкти API DRA
content_type: concept
weight: 10
api_metadata:
- apiVersion: "resource.k8s.io/v1"
  kind: "ResourceClaim"
- apiVersion: "resource.k8s.io/v1"
  kind: "ResourceClaimTemplate"
- apiVersion: "resource.k8s.io/v1"
  kind: "DeviceClass"
- apiVersion: "resource.k8s.io/v1"
  kind: "ResourceSlice"
---

<!-- overview -->

Ця сторінка описує види API Kubernetes, які динамічне виділення ресурсів (DRA) використовує для категоризації, запиту та виділення пристроїв.

<!-- body -->

## Термінологія DRA {#terminology}

DRA використовує такі види API Kubernetes для забезпечення основної функціональності виділення ресурсів. Усі ці види API включені в{{< glossary_tooltip text="групу API" term_id="api-group" >}} `resource.k8s.io/v1` .

DeviceClass
: Визначає категорію пристроїв, які можуть бути запитані, і те, як вибрати конкретні атрибути пристроїв у заявках. Параметри DeviceClass можуть дорівнювати нулю або більше пристроїв у ResourceSlices. Щоб запитувати пристрої з DeviceClass, ResourceClaims вибирають певні атрибути пристрою.

ResourceClaim
: Описує запити на доступ до приєднаних ресурсів, таких як пристрої, у кластері. Вимоги до ресурсу надають Podʼам доступ до певного ресурсу. ResourceClaims можуть створюватися операторами робочого навантаження або генеруватися Kubernetes на основі шаблону ResourceClaimTemplate.

ResourceClaimTemplate
: Визначає шаблон, який Kubernetes використовує для створення запитів на ресурси (ResourceClaims) для робочого навантаження. Шаблони ResourceClaimTemplates надають Podʼам доступ до окремих схожих ресурсів. Кожний запит ресурсу, який Kubernetes генерує на основі шаблону, привʼязується до певного Podʼа. Коли Pod завершує роботу, Kubernetes видаляє відповідну заявку на ресурс.

ResourceSlice
: Представляє собою один або декілька ресурсів, приєднаних до вузлів, таких як пристрої. Драйвери створюють розділи ресурсу і керують ними у кластері. Коли ResourceClaim створюється і використовується у Podʼі, Kubernetes використовує ResourceSlices для пошуку вузлів, які мають доступ до заявлених ресурсів. Kubernetes виділяє ресурси для ResourceClaim і планує роботу Podʼа на вузлі, який може отримати доступ до ресурсів.

### DeviceClass {#deviceclass}

DeviceClass дозволяє адміністраторам кластера або драйверам пристроїв визначати категорії пристроїв у кластері. Класи пристроїв вказують операторам, які пристрої вони можуть запитувати і як вони можуть запитувати ці пристрої. Ви можете використовувати [загальну мову виразів (CEL)](https://cel.dev) для вибору пристроїв на основі певних атрибутів. ResourceClaim, яка посилається на DeviceClass, може потім запитувати певні конфігурації в межах DeviceClass.

Щоб створити DeviceClass, див. [Налаштування DRA у кластері](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster).

### ResourceClaims та ResourceClaimTemplates {#resourceclaims-templates}

ResourceClaim визначає ресурси, які потрібні робочому навантаженню. Кожен ResourceClaim має _запити_ (_requests_), які посилаються на DeviceClass і вибирають пристрої з цього DeviceClass. ResourceClaims також можуть використовувати _селектори_ (_selectors_) для фільтрації пристроїв, які відповідають певним вимогам, і можуть використовувати _обмеження_ (_constraints_) для обмеження пристроїв, які можуть задовольнити запит. ResourceClaims можуть створюватися операторами робочого навантаження або генеруватися Kubernetes на основі шаблону ResourceClaimTemplate. Шаблон ResourceClaimTemplate визначає шаблон, який Kubernetes може використовувати для автоматичного створення ResourceClaims для Podʼів.

#### Використання ResourceClaims та ResourceClaimTemplates {#when-to-use-rc-rct}

Метод, який ви використовуєте, залежить від ваших вимог, як показано нижче:

* **ResourceClaim**: ви хочете, щоб кілька Podʼів мали спільний доступ до певних пристроїв. Ви вручну керуєте життєвим циклом ResourceClaims, які створюєте.
* **ResourceClaimTemplate**: ви хочете, щоб Podʼи мали незалежний доступ до окремих, схожих за конфігурацією пристроїв. Kubernetes генерує ResourceClaims з специфікації в ResourceClaimTemplate. Тривалість кожного згенерованого ResourceClaim привʼязується до тривалості існування відповідного Podʼа.
* [**PodGroup ResourceClaimTemplate**](#workload-resource-claims): ви хочете, щоб {{< glossary_tooltip text="PodGroups" term_id="podgroup" >}} мали незалежний доступ до окремих, схожих за конфігурацією пристроїв, які можуть бути спільно використані їхніми Podʼами. Kubernetes генерує один ResourceClaim для PodGroup з специфікації в ResourceClaimTemplate. Тривалість кожного згенерованого ResourceClaim привʼязується до тривалості існування відповідного PodGroup. Це вимагає, щоб функція [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims) була увімкнена.

Коли ви визначаєте робоче навантаження, ви можете використовувати {{< glossary_tooltip term_id="cel" text="Загальну мову виразів (CEL)" >}} для фільтрації за конкретними атрибутами пристроїв або ємністю. Доступні параметри для фільтрації залежать від пристрою та драйверів.

Якщо ви безпосередньо посилаєтеся на конкретний ResourceClaim у Pod, цей ResourceClaim повинен вже існувати в тому ж просторі імен, що й Pod. Якщо ResourceClaim не існує в просторі імен, Pod не буде заплановано. Ця поведінка подібна до того, як PersistentVolumeClaim повинен існувати в тому ж просторі імен, що й Pod, який посилається на нього.

Ви можете посилатися на автоматично згенерований ResourceClaim у Podʼі, але це не рекомендується, оскільки автоматично згенеровані ResourceClaims привʼязані до тривалості існування Podʼа або PodGroup, який викликав генерацію.

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

#### Workload ResourceClaims {#workload-resource-claims}

{{< feature-state feature_gate_name="DRAWorkloadResourceClaims" >}}

Коли ви організовуєте Podʼи за допомогою [Workload API](/docs/concepts/workloads/workload-api/), ви можете резервувати ResourceClaims для цілих {{< glossary_tooltip text="PodGroups" term_id="podgroup" >}} замість окремих Podʼів і генерувати ResourceClaimTemplates для PodGroup замість одного Podʼа, що дозволяє Podʼам у PodGroup спільно використовувати доступ до пристроїв, виділених для згенерованого ResourceClaim.

Ця функція вирішує дві проблеми:

* Список `status.reservedFor` API ResourceClaim може містити лише 256 елементів. Оскільки kube-scheduler записує в цей список лише окремі Podʼи, лише 256 Podʼів можуть спільно використовувати один ResourceClaim. Завдяки можливості запису PodGroups у `status.reservedFor`, ResourceClaim можуть спільно використовувати значно більше ніж 256 Podʼів.
* Podʼи можуть спільно використовувати ResourceClaim лише тоді, коли відома його точна назва. Для складних робочих навантажень, що реплікують _групи_ Podʼів, ResourceClaims, якими спільно користуються Podʼи в кожній групі, потрібно створювати та видаляти явно, коли набір груп масштабується вгору та вниз. Генеруючи ResourceClaims для кожної PodGroup, один ResourceClaimTemplate може стати основою для ResourceClaims, які автоматично реплікуються та можуть спільно використовуватися Podʼами у PodGroup.

API PodGroup визначає поле `spec.resourceClaims` з такою самою структурою та подібним значенням, як і поле `spec.resourceClaims` в API Pod:

```yaml
apiVersion: scheduling.k8s.io/v1beta1
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

Заявка PodGroup, що збігається з ResourceClaimTemplate, спонукає до створення ResourceClaim лише тоді, коли увімкнено функцію [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims). Замість створення окремих ResourceClaims для кожного Podʼа, коли функцію вимкнено, жоден ResourceClaim не створюється, щоб запобігти створенню помилкових окремих ResourceClaims під час оновлень кластера або розгортань/відкатів функції між `kube-apiserver` та `kube-controller-manager`.

ResourceClaims, згенеровані з ResourceClaimTemplate для PodGroup, слідують життєвому циклу PodGroup. ResourceClaim створюється, коли існують як PodGroup, так і його ResourceClaimTemplate. ResourceClaim видаляється після видалення PodGroup і коли ResourceClaim більше не зарезервований.

Розглянемо наступний приклад:

```yaml
apiVersion: scheduling.k8s.io/v1beta1
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

Повʼязування ResourceClaims з ресурсами Workload API контролюється функціональною можливістю [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims) у `kube-apiserver`, `kube-controller-manager`, `kube-scheduler` та `kubelet`.

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

Це дозволяє впливати на пріоритет розподілу ресурсів за допомогою імен, призначених пулам та ResourceSlices. Зверніть увагу, що пули без [умов привʼязки](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#device-binding-conditions) завжди оцінюються перед тими, що мають умови привʼязки, незалежно від їхніх імен.

Для драйверів, створених за допомогою пакунка Go `k8s.io/dynamic-resources/kubeletplugin` або контролера ResourceSlice з цього модуля, ці компоненти автоматично обробляють назви ResourceSlice, щоб забезпечити їх оцінку в порядку, визначеному драйвером.

## Адміністративний доступ {#admin-access}

{{< feature-state feature_gate_name="DRAAdminAccess" >}}

Ви можете позначити запит у ResourceClaim або ResourceClaimTemplate як такий, що має привілейовані можливості для завдань обслуговування та усунення несправностей. Запит з правами адміністратора надає доступ до пристроїв, які використовуються, і може увімкнути додаткові дозволи, якщо зробити пристрій доступним у контейнері:

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

Доступ адміністратора є привілейованим режимом, і його не слід надавати звичайним користувачам у кластерах з багатокористувацькою архітектурою. Поле `adminAccess` можуть використовувати лише ті користувачі, які мають дозвіл на створення обʼєктів ResourceClaim або ResourceClaimTemplate у просторах імен, позначених тегом `resource.kubernetes.io/admin-access: "true"` (з урахуванням регістру). Це гарантує, що користувачі, які не є адміністраторами, не зможуть зловживати цією функцією.

Доступ адміністратора контролюється функціональною можливістю [`DRAAdminAccess`](/docs/reference/command-line-tools-reference/feature-gates/#DRAAdminAccess) у `kube-apiserver`, `kube-scheduler` та `kubelet`.

## Атрибути типу список {#list-type-attributes}

{{< feature-state feature_gate_name="DRAListTypeAttributes" >}}

Ця функція покращує API ResourceSlice, дозволяючи драйверам DRA вказувати значення списків для атрибутів пристроїв замість лише скалярних значень. Це корисно для моделювання більш складних внутрішніх топологій вузлів, наприклад, коли CPU має суміжність з кількома коренями PCIe.

Для авторів ResourceClaim (кінцевих користувачів) це означає, що `matchAttribute` та `distinctAttribute` працюють краще для цих випадків.

* `matchAttribute` — два атрибути повинні мати _непорожній перетин списків_, а не бути ідентичними (скалярні значення розглядаються як списки з одним елементом). Це означає, що якщо один драйвер публікує одне значення, наприклад, для кореня PCIe, а інший драйвер публікує список, обмеження виконується, якщо одне значення зʼявляється десь у списку.
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

### Деталі для авторів драйверів DRA {#details-for-dra-driver-authors}

Зазвичай кожен `DeviceAttribute` містить точно одне скалярне значення: булеве, ціле число, рядок або рядок семантичної версії. Функція `DRAListTypeAttributes` розширює `DeviceAttribute` чотирма полями типу список, дозволяючи пристрою рекламувати кілька значень для одного атрибута:

* **`bools`** — список булевих значень
* **`ints`** — список 64-бітних цілих чисел
* **`strings`** — список рядків (кожен не більше 64 символів)
* **`versions`** — список рядків семантичних версій відповідно до специфікації semver.org 2.0.0 (кожен не більше 64 символів)

Загальна кількість окремих значень атрибутів на пристрій (скалярні поля плюс всі елементи списків разом) обмежена **48**. Коли будь-який пристрій у ResourceSlice використовує цю функцію або інші розширені функції, такі як taints, ResourceSlice буде обмежений максимум **64** пристроями. Використовуйте атрибути типу список або інші розширені функції, такі як taints.

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

Атрибути типу список контролюються функціональною можливістю [`DRAListTypeAttributes`](/docs/reference/command-line-tools-reference/feature-gates/#DRAListTypeAttributes) у `kube-apiserver` та `kube-scheduler`.

## Похідні атрибути {#derived-attributes}

{{< feature-state feature_gate_name="DRADerivedAttributes" >}}

Обмеження `matchAttribute` та `distinctAttribute` зазвичай вимагають, щоб пристрої публікували атрибути під точно такою ж назвою. Якщо драйвер GPU публікує `pcie_locality`, а драйвер NIC публікує `pcie_root` (або вбудовує ту саму інформацію в рядок на зразок `numa0-pcie1`), планувальник не має способу розпізнати, що вони представляють одне й те саме, тому пристрої від двох драйверів не можуть бути розміщені разом без попередньої домовленості про спільну назву атрибута.

`derivedAttributes` дозволяє вам подолати цю прогалину безпосередньо, не чекаючи, поки драйвери стандартизують спільні назви атрибутів. Додайте один або кілька записів `derivedAttributes` до запиту, у `.spec.devices.requests[].exactly` або `.spec.devices.requests[].firstAvailable[]`. Кожен запис визначає вираз CEL, який планувальник обчислює для кожного кандидата пристрою для цього запиту. Результат стає віртуальним атрибутом, на який можна посилатися з обмеження `matchAttribute` або `distinctAttribute` точно так само, як на атрибут пристрою, наданий драйвером.

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
metadata:
  name: gpu-nic-numa-alignment
spec:
  devices:
    requests:
    - name: gpu
      exactly:
        deviceClassName: gpu.example.com
        count: 1
        derivedAttributes:
        - name: derived/numa
          expression: device.attributes["gpu.example.com"].numa
    - name: nic
      exactly:
        deviceClassName: nic.example.com
        count: 1
        derivedAttributes:
        - name: derived/numa
          expression: device.attributes["nic.example.com"].numaNode
    constraints:
    - requests: ["gpu", "nic"]
      matchAttribute: derived/numa
```

У цьому прикладі драйвери `gpu` та `nic` публікують інформацію про топологію під різними назвами атрибутів (`numa` та `numaNode`). Кожен запит обчислює спільне значення `derived/numa` з атрибутів власного пристрою, а обмеження `matchAttribute` вирівнює два запити за цим віртуальним атрибутом, навіть якщо базові драйвери ніколи не домовлялися про спільну назву атрибута.

Кілька речей, які варто знати про `derivedAttributes`:

* **Іменування**: `name` має бути DNS-піддоменом, за яким слідує `/` та C-ідентифікатор, у тому ж форматі, що використовується для назв атрибутів, наданих драйвером (наприклад, `example.com/numaNode` або `derived/numaNode`). Якщо назва збігається з атрибутом, вже опублікованим драйвером, значення похідного атрибута затінює надане драйвером для зіставлення обмежень. Використовуйте префікс домену, який жоден драйвер не використовуватиме, наприклад `derived/`, якщо ви хочете уникнути ненавмисного затінення. Ви можете визначити до 32 похідних атрибутів на запит.
* **Повинен використовуватися обмеженням**: кожен похідний атрибут повинен бути згаданий принаймні в одному обмеженні `matchAttribute` або `distinctAttribute`, яке застосовується до запиту (або підзапиту), що його визначає. Інакше ResourceClaim не пройде перевірку.
* **Область та порядок обчислення**: `expression` обчислюється один раз для кожного кандидата пристрою, після того як власні селектори CEL запиту (`.selectors[].cel`) вже відфільтрували цей пристрій. Як результат, похідні атрибути не можуть бути використані у виразах селекторів і не доступні через `device.attributes` у середовищі CEL.
* **Тип результату**: `expression` має обчислюватися до скалярного значення (`string`, `int`, `bool` або семантичної версії) або, коли також увімкнено функціональну можливість `DRAListTypeAttributes`, до списку одного з цих скалярних типів.
* **Обмеження вартості**: кожен вираз має максимальну довжину та обмеження на оцінену вартість обчислення CEL. Крім того, сукупна оцінена вартість усіх виразів `derivedAttributes` у ResourceClaim також обмежена, щоб обмежити загальні накладні витрати, додані до однієї спроби планування. ResourceClaim відхиляється, якщо будь-яке з цих обмежень перевищено.
* **Помилки виконання переривають планування**: якщо обчислення виразу завершується помилкою для кандидата пристрою, наприклад, тому що він посилається на атрибут, якого цей пристрій не має, планувальник перериває виділення, і Pod не може бути запланований, замість того щоб мовчки пропустити цей пристрій. Пишіть вирази обережно, наприклад, перевіряючи, що атрибут існує, перед його читанням.

Похідні атрибути контролюються функціональною можливістю [`DRADerivedAttributes`](/docs/reference/command-line-tools-reference/feature-gates/#DRADerivedAttributes) у `kube-apiserver` та `kube-scheduler`.

Список стандартних атрибутів пристроїв, які можуть публікувати драйвери DRA, див. у довіднику [Стандартні атрибути пристроїв](/docs/reference/node/dra-standard-device-attributes/).

## Розширене виділення ресурсів за допомогою DRA {#extended-resource}

{{< feature-state feature_gate_name="DRAExtendedResource" >}}

Ви можете надати імʼя розширеного ресурсу для класу пристрою. Планувальник тоді вибере пристрої, які відповідають класу для запитів розширених ресурсів. Це дозволяє користувачам продовжувати використовувати запити розширених ресурсів у Podʼі для запиту або розширених ресурсів, наданих втулком пристрою, або пристроїв DRA. Той самий розширений ресурс може бути наданий або втулком пристрою, або DRA на одному єдиному вузлі кластера. Той самий розширений ресурс може бути наданий втулком пристрою на деяких вузлах, а DRA на інших вузлах у тому ж кластері.

У наведеному нижче прикладі класу пристрою надано `extendedResourceName` `example.com/gpu`. Якщо Pod запитує розширений ресурс `example.com/gpu: 2`, його можна запланувати на вузол з двома або більше пристроями, які відповідають класу пристрою.

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

На додачу, користувачі можуть використовувати спеціальний розширений ресурс для виділення пристроїв без необхідності явно створювати ResourceClaim. Використовуючи префікс імені розширеного ресурсу `deviceclass.resource.kubernetes.io/` та імʼя DeviceClass. Це працює для будь-якого DeviceClass, навіть якщо він не вказує на імʼя розширеного ресурсу. Кінцевий ResourceClaim міститиме запит на `ExactCount` вказаної кількості пристроїв цього DeviceClass.

Розширене виділення ресурсів DRA контролюється функціональною можливістю [`DRAExtendedResource`](/docs/reference/command-line-tools-reference/feature-gates/#DRAExtendedResource) у `kube-apiserver`, `kube-scheduler`, `kube-controller-manager` та `kubelet`.

Для практичного ознайомлення із запитом розширених ресурсів див. [Призначення розширених ресурсів контейнеру](/docs/tasks/configure-pod-container/extended-resource/).
