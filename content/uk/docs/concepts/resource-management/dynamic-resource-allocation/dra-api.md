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

DRA використовує такі види API Kubernetes для забезпечення основної функціональності виділення ресурсів. Усі ці види API входять до {{< glossary_tooltip text="групи API" term_id="api-group" >}} `resource.k8s.io/v1`.

DeviceClass
: Визначає категорію пристроїв, які можна запитати, і те, як вибирати конкретні атрибути пристроїв у заявках. Параметри DeviceClass можуть відповідати нулю або більше пристроям у ResourceSlices. Щоб запитувати пристрої з DeviceClass, ResourceClaims вибирають певні атрибути пристроїв.

ResourceClaim
: Описує запит на доступ до приєднаних ресурсів, таких як пристрої, у кластері. ResourceClaims надають Podʼам доступ до певного ресурсу. ResourceClaims можуть створюватися операторами робочих навантажень або генеруватися Kubernetes на основі ResourceClaimTemplate.

ResourceClaimTemplate
: Визначає шаблон, який Kubernetes використовує для створення окремих ResourceClaims для кожного Podʼа робочого навантаження. ResourceClaimTemplates надають Podʼам доступ до окремих схожих ресурсів. Кожен ResourceClaim, який Kubernetes генерує на основі шаблону, привʼязаний до певного Podʼа. Коли Pod завершує роботу, Kubernetes видаляє відповідний ResourceClaim.

ResourceSlice
: Представляє один або декілька ресурсів, таких як пристрої, приєднаних до вузлів. Драйвери створюють ResourceSlices у кластері та керують ними. Коли ResourceClaim створюється і використовується в Podʼі, Kubernetes використовує ResourceSlices для пошуку вузлів, які мають доступ до заявлених ресурсів. Kubernetes виділяє ресурси для ResourceClaim і планує Pod на вузол, який має доступ до цих ресурсів.

### DeviceClass {#deviceclass}

DeviceClass дозволяє адміністраторам кластера або драйверам пристроїв визначати категорії пристроїв у кластері. DeviceClasses вказують операторам, які пристрої вони можуть запитувати і як вони можуть запитувати ці пристрої. Ви можете використовувати [загальну мову виразів (CEL)](https://cel.dev) для вибору пристроїв на основі певних атрибутів. ResourceClaim, який посилається на DeviceClass, може потім запитувати певні конфігурації в межах DeviceClass.

Щоб створити DeviceClass, див. [Налаштування DRA у кластері](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster).

### ResourceClaims та ResourceClaimTemplates {#resourceclaims-templates}

ResourceClaim визначає ресурси, які потрібні робочому навантаженню. Кожен ResourceClaim має _запити_ (_requests_), які посилаються на DeviceClass і вибирають пристрої з цього DeviceClass. ResourceClaims також можуть використовувати _селектори_ (_selectors_) для фільтрації пристроїв, які відповідають певним вимогам, і можуть використовувати _обмеження_ (_constraints_) для обмеження пристроїв, які можуть задовольнити запит. ResourceClaims можуть створюватися операторами робочих навантажень або генеруватися Kubernetes на основі ResourceClaimTemplate. ResourceClaimTemplate визначає шаблон, який Kubernetes може використовувати для автоматичного створення ResourceClaims для Podʼів.

#### Варіанти використання ResourceClaims та ResourceClaimTemplates {#when-to-use-rc-rct}

Метод, який ви використовуєте, залежить від ваших вимог, як показано нижче:

* **ResourceClaim**: ви хочете, щоб кілька Podʼів мали спільний доступ до певних пристроїв. Ви вручну керуєте життєвим циклом ResourceClaims, які створюєте.
* **ResourceClaimTemplate**: ви хочете, щоб Podʼи мали незалежний доступ до окремих, схожих за конфігурацією пристроїв. Kubernetes генерує ResourceClaims зі специфікації в ResourceClaimTemplate. Час існування кожного згенерованого ResourceClaim привʼязаний до часу існування відповідного Podʼа.
* [**PodGroup ResourceClaimTemplate**](#workload-resource-claims): ви хочете, щоб {{< glossary_tooltip text="PodGroups" term_id="podgroup" >}} мали незалежний доступ до окремих, схожих за конфігурацією пристроїв, які можуть спільно використовувати їхні Podʼи. Kubernetes генерує один ResourceClaim для PodGroup зі специфікації в ResourceClaimTemplate. Час існування кожного згенерованого ResourceClaim привʼязаний до часу існування відповідного PodGroup. Для цього потрібно, щоб функцію [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims) було увімкнено.

Коли ви визначаєте робоче навантаження, ви можете використовувати {{< glossary_tooltip term_id="cel" text="загальну мову виразів (CEL)" >}} для фільтрації за конкретними атрибутами пристроїв або ємністю. Доступні параметри для фільтрації залежать від пристрою та драйверів.

Якщо ви безпосередньо посилаєтеся на конкретний ResourceClaim у Podʼі, цей ResourceClaim повинен вже існувати в тому ж просторі імен, що й Pod. Якщо ResourceClaim не існує в цьому просторі імен, Pod не буде заплановано. Ця поведінка подібна до того, як PersistentVolumeClaim повинен існувати в тому ж просторі імен, що й Pod, який посилається на нього.

Ви можете посилатися на автоматично згенерований ResourceClaim у Podʼі, але це не рекомендується, оскільки автоматично згенеровані ResourceClaims привʼязані до часу існування Podʼа або PodGroup, який спричинив їх генерацію.

Щоб дізнатися, як запитувати ресурси за допомогою одного з цих методів, див. [Виділення пристроїв для робочих навантажень з DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/).

#### Пріоритетний список {#prioritized-list}

{{< feature-state feature_gate_name="DRAPrioritizedList" >}}

Ви можете надати пріоритетний список підзапитів для запитів у ResourceClaim або ResourceClaimTemplate. Тоді планувальник вибере перший підзапит, для якого можна виконати виділення. Це дозволяє користувачам вказувати альтернативні пристрої, які може використовувати робоче навантаження, якщо основний варіант недоступний.

У наведеному нижче прикладі ResourceClaimTemplate запитує пристрій чорного кольору та великого розміру. Якщо пристрій з цими атрибутами недоступний, Pod не може бути запланований. Завдяки функції пріоритетного списку можна вказати другу альтернативу, яка запитує два пристрої білого кольору та малого розміру. Великий чорний пристрій буде виділено, якщо він доступний. Якщо ні, але доступні два малі білі пристрої, Pod все одно зможе працювати.

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

Якщо Pod може бути запланований на декілька вузлів у кластері, планувальник використовуватиме індекс вибраних підзапитів із будь-яких пріоритетних списків як один із вхідних параметрів під час оцінювання кожного вузла. Тому вузли, які можуть виділити пристрої, запитані в підзапиті з вищим рангом, мають більше шансів бути вибраними, ніж вузли, які можуть виділити пристрої лише для підзапитів з нижчим рангом.

Рішення приймається для кожного Podʼа окремо, тому якщо Pod є членом ReplicaSet або подібної групи, ви не можете розраховувати на те, що для всіх членів групи буде вибрано той самий підзапит. Ваше робоче навантаження повинно бути здатним це враховувати.

#### Workload ResourceClaims {#workload-resource-claims}

{{< feature-state feature_gate_name="DRAWorkloadResourceClaims" >}}

Коли ви організовуєте Podʼи за допомогою [Workload API](/docs/concepts/workloads/workload-api/), ви можете резервувати ResourceClaims для цілих {{< glossary_tooltip text="PodGroups" term_id="podgroup" >}} замість окремих Podʼів і генерувати ResourceClaimTemplates для PodGroup замість одного Podʼа, що дозволяє Podʼам у PodGroup спільно використовувати доступ до пристроїв, виділених для згенерованого ResourceClaim.

Ця функція вирішує дві проблеми:

- Список `status.reservedFor` в API ResourceClaim може містити лише 256 елементів. Оскільки kube-scheduler записує в цей список лише окремі Podʼи, лише 256 Podʼів можуть спільно використовувати один ResourceClaim. Завдяки можливості записувати PodGroups у `status.reservedFor` один ResourceClaim можуть спільно використовувати значно більше ніж 256 Podʼів.
- Podʼи можуть спільно використовувати ResourceClaim лише тоді, коли відома його точна назва. Для складних робочих навантажень, що реплікують _групи_ Podʼів, ResourceClaims, якими спільно користуються Podʼи в кожній групі, потрібно явно створювати та видаляти, коли набір груп масштабується вгору чи вниз. Завдяки генеруванню ResourceClaims для кожного PodGroup один ResourceClaimTemplate може стати основою для ResourceClaims, які і автоматично реплікуються, і можуть спільно використовуватися Podʼами в PodGroup.

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

Як і заявки, зроблені Podʼами, заявки для PodGroups, що визначають `resourceClaimName`, посилаються на ResourceClaim за іменем. Заявки, що визначають `resourceClaimTemplateName`, посилаються на ResourceClaimTemplate, з якого генерується один ResourceClaim для всього PodGroup, і цей ResourceClaim можуть спільно використовувати його Podʼи.

Коли Pod визначає заявку з `name`, `resourceClaimName` та `resourceClaimTemplateName`, які всі збігаються з однією із заявок у `spec.resourceClaims` його PodGroup, kube-scheduler резервує ResourceClaim для PodGroup замість Podʼа. Якщо заявка Podʼа не збігається з жодною заявкою його PodGroup, kube-scheduler резервує ResourceClaim для Podʼа. В обох випадках резервування записується в `status.reservedFor` ResourceClaim. Резервування PodGroup та відповідне виділення ресурсів зберігаються в ResourceClaim до видалення PodGroup, навіть якщо в групі більше немає жодного Podʼа.

Коли заявка Podʼа, що збігається із заявкою PodGroup, визначає `resourceClaimTemplateName`, для PodGroup генерується один ResourceClaim. Інші Podʼи в групі, які визначають ту саму заявку, спільно використовуватимуть цей згенерований ResourceClaim, а не спричинятимуть генерування нового ResourceClaim для кожного Podʼа. Незалежно від того, чи збігається заявка з `resourceClaimTemplateName` із заявкою PodGroup, імʼя згенерованого ResourceClaim записується в `status.resourceClaimStatuses` Podʼа.

Відповідна заявка PodGroup для ResourceClaimTemplate спричиняє створення ResourceClaim лише тоді, коли увімкнено функцію [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims). Коли функцію вимкнено, замість створення окремих ResourceClaims для кожного Podʼа жоден ResourceClaim не створюється, щоб запобігти створенню зайвих ResourceClaims для окремих Podʼів під час оновлень кластера або розгортань/відкатів функції між `kube-apiserver` та `kube-controller-manager`.

ResourceClaims, згенеровані з ResourceClaimTemplate для PodGroup, слідують життєвому циклу PodGroup. ResourceClaim вперше створюється, коли існують і PodGroup, і його ResourceClaimTemplate. ResourceClaim видаляється після того, як PodGroup видалено і ResourceClaim більше не зарезервований.

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

У цьому прикладі PodGroup `training-group` має один Pod з іменем `training-group-pod-1`. Заявки Podʼа `pod-claim` та `pod-claim-template` не збігаються з жодною заявкою PodGroup, тому PodGroup на ці заявки не впливає: ResourceClaim `my-pod-claim` резервується для Podʼа, а з ResourceClaimTemplate `my-pod-template` генерується ResourceClaim, який також резервується для Podʼа. Заявки `pg-claim` та `pg-claim-template` збігаються із заявками PodGroup. ResourceClaim `my-pg-claim` резервується для PodGroup, а з ResourceClaimTemplate `my-pg-template` генерується ResourceClaim, який також резервується для PodGroup.

Повʼязування ResourceClaims з ресурсами Workload API контролюється функціональною можливістю [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims) у `kube-apiserver`, `kube-controller-manager`, `kube-scheduler` та `kubelet`.

### ResourceSlice {#resourceslice}

Кожен ResourceSlice представляє один або декілька {{< glossary_tooltip term_id="device" text="пристроїв" >}} у пулі. Пулом керує драйвер пристрою, який створює ResourceSlices і керує ними. Ресурси в пулі можуть бути представлені одним ResourceSlice або охоплювати декілька ResourceSlices.

ResourceSlices надають корисну інформацію користувачам пристроїв і планувальнику та є ключовими для динамічного виділення ресурсів. Кожен ResourceSlice повинен містити таку інформацію:

* **Пул ресурсів**: група з одного або декількох ресурсів, якими керує драйвер. Пул може охоплювати більше ніж один ResourceSlice. Зміни ресурсів у пулі повинні поширюватися на всі ResourceSlices цього пулу. Драйвер пристрою, який керує пулом, відповідає за те, щоб це поширення відбувалося.
* **Пристрої**: пристрої в керованому пулі. ResourceSlice може перелічувати кожен пристрій у пулі або підмножину пристроїв у пулі. ResourceSlice визначає інформацію про пристрій, таку як атрибути, версії та ємність. Користувачі пристроїв можуть вибирати пристрої для виділення, фільтруючи за інформацією про пристрої в ResourceClaims або в DeviceClasses.
* **Вузли**: вузли, які мають доступ до ресурсів. Драйвери можуть вибирати, які вузли мають доступ до ресурсів: усі вузли в кластері, один вузол із зазначеним імʼям або вузли з певними мітками вузлів.

Драйвери використовують {{< glossary_tooltip text="контролер" term_id="controller" >}} для узгодження ResourceSlices у кластері з інформацією, яку драйвер має опублікувати. Цей контролер перезаписує будь-які ручні зміни, наприклад створення або модифікацію ResourceSlices користувачами кластера.

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
Цим ResourceSlice керує драйвер `resource-driver.example.com` у пулі `black-cat-pool`. Поле `allNodes: true` вказує на те, що будь-який вузол кластера може отримати доступ до пристроїв. У ResourceSlice є один пристрій з іменем `large-black-cat` з такими атрибутами:

* `color`: `black`
* `size`: `large`
* `cat`: `true`

DeviceClass може вибрати цей ResourceSlice за допомогою цих атрибутів, а ResourceClaim може фільтрувати певні пристрої в цьому DeviceClass.

#### Іменування та пріоритизація {#resourceslice-naming-and-prioritization}

Порядок, у якому планувальник Kubernetes оцінює пристрої для виділення, визначається лексикографічним сортуванням імен ResourceSlice та пулів ресурсів. Планувальник використовує стратегію першого підходящого варіанту, тобто вибирає перший доступний пристрій, який задовольняє вимоги заявки.

Це дозволяє впливати на пріоритет виділення ресурсів за допомогою імен, призначених пулам та ResourceSlices. Зверніть увагу, що пули без [умов привʼязки](/docs/concepts/resource-management/dynamic-resource-allocation/how-dra-works/#device-binding-conditions) завжди оцінюються перед пулами з умовами привʼязки, незалежно від їхніх імен.

Для драйверів, створених за допомогою пакунка Go `k8s.io/dynamic-resources/kubeletplugin` або контролера ResourceSlice з цього модуля, ці компоненти автоматично обробляють іменування ResourceSlice, щоб забезпечити їх оцінювання в порядку, визначеному драйвером.

## Адміністративний доступ {#admin-access}

{{< feature-state feature_gate_name="DRAAdminAccess" >}}

Ви можете позначити запит у ResourceClaim або ResourceClaimTemplate як такий, що має привілейовані функції для завдань обслуговування та усунення несправностей. Запит з адміністративним доступом надає доступ до пристроїв, які вже використовуються, і може вмикати додаткові дозволи, коли пристрій стає доступним у контейнері:

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

Адміністративний доступ є привілейованим режимом, і його не слід надавати звичайним користувачам у багатокористувацьких кластерах. Поле `adminAccess` можуть використовувати лише користувачі, які мають дозвіл створювати обʼєкти ResourceClaim або ResourceClaimTemplate у просторах імен з міткою `resource.kubernetes.io/admin-access: "true"` (з урахуванням регістру). Це гарантує, що користувачі без прав адміністратора не зможуть зловживати цією функцією.

Адміністративний доступ контролюється функціональною можливістю [`DRAAdminAccess`](/docs/reference/command-line-tools-reference/feature-gates/#DRAAdminAccess) у `kube-apiserver`, `kube-scheduler` та `kubelet`.

## Атрибути типу список {#list-type-attributes}

{{< feature-state feature_gate_name="DRAListTypeAttributes" >}}

Ця функція покращує API ResourceSlice, дозволяючи драйверам DRA вказувати для атрибутів пристроїв списки значень, а не лише скалярні значення. Це корисно для моделювання складніших внутрішніх топологій вузлів, наприклад, коли CPU суміжний з кількома коренями PCIe.

Для авторів ResourceClaim (кінцевих користувачів) це означає, що `matchAttribute` та `distinctAttribute` краще працюють у таких випадках.

- `matchAttribute` — два атрибути повинні мати *непорожній перетин списків*, а не бути ідентичними (скалярні значення розглядаються як списки з одного елемента). Це лише означає, що якщо один драйвер публікує одне значення, скажімо, для кореня PCIe, а інший драйвер публікує список, обмеження виконується, якщо це одне значення є десь у списку.
- `distinctAttribute` — значення атрибутів повинні бути *попарно неперетинними* (жодне значення не є спільним для будь-яких двох пристроїв)

Щоб допомогти авторам ResourceClaim використовувати у виразах CEL атрибути, які можуть бути списками, ця функція також запроваджує функцію CEL `includes()`.

```
# Скалярний атрибут (зворотно сумісний)
# припустимо: device.attributes["dra.example.com"].model = "model-a"
device.attributes["dra.example.com"].model.includes("model-a")  # true
device.attributes["dra.example.com"].model.includes("model-b")  # false

# Атрибут типу список (потребує DRAListTypeAttributes)
# припустимо: device.attributes["dra.example.com"].supported-models= ["model-a", "model-b"]
device.attributes["dra.example.com"].supported-models.includes("model-a")  # true
device.attributes["dra.example.com"].supported-models.includes("model-c")  # false
```

### Подробиці для авторів драйверів DRA {#details-for-dra-driver-authors}

Типово кожен `DeviceAttribute` містить рівно одне скалярне значення: булеве значення, ціле число, рядок або рядок семантичної версії. Функціональна можливість `DRAListTypeAttributes` розширює `DeviceAttribute` чотирма полями типу список, дозволяючи пристрою оголошувати кілька значень для одного атрибута:

- **`bools`** — список булевих значень
- **`ints`** — список 64-бітних цілих чисел
- **`strings`** — список рядків (кожен не більше 64 символів)
- **`versions`** — список рядків семантичних версій відповідно до специфікації semver.org 2.0.0
  (кожен не більше 64 символів)

Загальна кількість окремих значень атрибутів на пристрій (скалярні поля плюс усі елементи списків разом) обмежена значенням **48**. Коли будь-який пристрій у ResourceSlice використовує цю функцію або інші розширені функції, такі як taints, ResourceSlice може містити щонайбільше **64** пристрої.

Ось приклад пристрою, який оголошує кілька підтримуваних моделей за допомогою рядкового атрибута типу список:

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

Обмеження `matchAttribute` та `distinctAttribute` зазвичай вимагають, щоб пристрої публікували атрибути під точно такою самою назвою. Якщо драйвер GPU публікує `pcie_locality`, а драйвер NIC публікує `pcie_root` (або вбудовує ту саму інформацію в рядок на зразок `numa0-pcie1`), планувальник не має змоги розпізнати, що вони означають одне й те саме, тому пристрої від цих двох драйверів не можуть бути розміщені разом без попередньої домовленості про спільну назву атрибута.

`derivedAttributes` дозволяє подолати цю прогалину безпосередньо в запиті, не чекаючи, поки драйвери узгодять спільні назви атрибутів. Додайте один або кілька записів `derivedAttributes` до запиту, у `.spec.devices.requests[].exactly` або `.spec.devices.requests[].firstAvailable[]`. Кожен запис визначає вираз CEL, який планувальник обчислює для кожного пристрою-кандидата для цього запиту. Результат стає віртуальним атрибутом, на який можна посилатися з обмеження `matchAttribute` або `distinctAttribute` точно так само, як на атрибут пристрою, наданий драйвером.

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

У цьому прикладі драйвери `gpu` та `nic` публікують інформацію про топологію під різними назвами атрибутів (`numa` та `numaNode`). Кожен запит обчислює спільне значення `derived/numa` з атрибутів власного пристрою, а обмеження `matchAttribute` узгоджує два запити за цим віртуальним атрибутом, хоча базові драйвери так і не домовилися про спільну назву атрибута.

Кілька речей, які варто знати про `derivedAttributes`:

- **Іменування**: `name` має бути DNS-піддоменом, за яким слідує `/` та C-ідентифікатор, у тому ж форматі, що використовується для назв атрибутів, наданих драйвером (наприклад, `example.com/numaNode` або `derived/numaNode`). Якщо назва збігається з атрибутом, який драйвер уже опублікував, значення похідного атрибута затінює значення, надане драйвером, під час зіставлення обмежень. Використовуйте префікс домену, який жоден драйвер не використовуватиме, наприклад `derived/`, якщо хочете уникнути ненавмисного затінення. Ви можете визначити до 32 похідних атрибутів на запит.
- **Повинен використовуватися обмеженням**: на кожен похідний атрибут повинно посилатися принаймні одне обмеження `matchAttribute` або `distinctAttribute`, яке застосовується до запиту (або підзапиту), що його визначає. Інакше ResourceClaim не пройде перевірку.
- **Область та порядок обчислення**: `expression` обчислюється один раз для кожного пристрою-кандидата, після того як власні селектори CEL запиту (`.selectors[].cel`) вже відфільтрували цей пристрій. Тому на похідні атрибути не можна посилатися з виразів селекторів, і вони недоступні через `device.attributes` у середовищі CEL.
- **Тип результату**: `expression` має обчислюватися в скалярне значення (`string`, `int`, `bool` або семантичну версію) або, коли також увімкнено функціональну можливість `DRAListTypeAttributes`, у список значень одного з цих скалярних типів.
- **Обмеження вартості**: кожен вираз має максимальну довжину та обмеження на оцінену вартість обчислення CEL. Крім того, сукупна оцінена вартість усіх виразів `derivedAttributes` у ResourceClaim також обмежена, щоб обмежити загальні накладні витрати, додані до однієї спроби планування. ResourceClaim відхиляється, якщо будь-яке з цих обмежень перевищено.
- **Помилки виконання переривають планування**: якщо обчислення виразу для пристрою-кандидата завершується помилкою, наприклад, тому що вираз посилається на атрибут, якого цей пристрій не має, планувальник перериває виділення, і Pod не вдається запланувати, замість того щоб мовчки пропустити цей пристрій. Пишіть вирази обачно, наприклад, перевіряючи, що атрибут існує, перед його читанням.

Похідні атрибути контролюються функціональною можливістю [`DRADerivedAttributes`](/docs/reference/command-line-tools-reference/feature-gates/#DRADerivedAttributes) у `kube-apiserver` та `kube-scheduler`.

Список стандартних атрибутів пристроїв, які можуть публікувати драйвери DRA, див. у довіднику [Стандартні атрибути пристроїв](/docs/reference/node/dra-standard-device-attributes/).

## Розширене виділення ресурсів за допомогою DRA {#extended-resource}

{{< feature-state feature_gate_name="DRAExtendedResource" >}}

Ви можете вказати імʼя розширеного ресурсу для DeviceClass. Тоді планувальник вибиратиме пристрої, що відповідають класу, для запитів розширених ресурсів. Це дозволяє користувачам і надалі використовувати запити розширених ресурсів у Podʼі, щоб запитувати або розширені ресурси, надані втулком пристроїв, або пристрої DRA. Той самий розширений ресурс може бути наданий або втулком пристроїв, або DRA на одному вузлі кластера. Той самий розширений ресурс може бути наданий втулком пристроїв на одних вузлах і DRA на інших вузлах того самого кластера.

У наведеному нижче прикладі DeviceClass отримує extendedResourceName `example.com/gpu`. Якщо Pod запитує розширений ресурс `example.com/gpu: 2`, його можна запланувати на вузол із двома або більше пристроями, що відповідають DeviceClass.

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

Крім того, користувачі можуть використовувати спеціальний розширений ресурс для виділення пристроїв без необхідності явно створювати ResourceClaim. Для цього використовується префікс імені розширеного ресурсу `deviceclass.resource.kubernetes.io/` та імʼя DeviceClass. Це працює для будь-якого DeviceClass, навіть якщо в ньому не вказано імʼя розширеного ресурсу. Отриманий ResourceClaim міститиме запит `ExactCount` на вказану кількість пристроїв цього DeviceClass.

Розширене виділення ресурсів за допомогою DRA контролюється функціональною можливістю [`DRAExtendedResource`](/docs/reference/command-line-tools-reference/feature-gates/#DRAExtendedResource) у `kube-apiserver`, `kube-scheduler`, `kube-controller-manager` та `kubelet`.

Для практичного ознайомлення із запитом розширених ресурсів див. [Призначення розширених ресурсів контейнеру](/docs/tasks/configure-pod-container/extended-resource/).
