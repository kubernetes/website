---
title: Розширення API Kubernetes за допомогою CustomResourceDefinitions
content_type: task
min-kubernetes-server-version: 1.16
weight: 20
---

<!-- overview -->
Ця сторінка показує, як встановити [власний ресурс](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) у API Kubernetes, створивши [CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1-apiextensions-k8s-io).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}} Якщо ви використовуєте старішу версію Kubernetes, яка все ще підтримується, використовуйте документацію для цієї версії, щоб отримати поради, які є відповідними для вашого кластера.

<!-- steps -->

## Створення CustomResourceDefinition {#create-a-customresourcedefinition}

При створенні нового CustomResourceDefinition (CRD) сервер API Kubernetes створює новий RESTful ресурсний шлях для кожної версії, яку ви вказуєте. Власний ресурс, створений з обʼєкта CRD, може бути або просторово обмеженим за іменем, або обмеженим на рівні кластера, як вказано в полі `spec.scope` CRD. Як і з наявними вбудованими обʼєктами, видалення простору імен видаляє всі власні обʼєкти в цьому просторі імен. CustomResourceDefinition самі за собою не мають простору імен і доступні для всіх просторів імен.

Наприклад, якщо ви збережете наступне визначення CustomResourceDefinition у `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # назва повинна відповідати полям специфікації нижче, і мати формат: <plural>.<group>
  name: crontabs.stable.example.com
spec:
  # назва групи, яка буде використана для REST API: /apis/<group>/<version>
  group: stable.example.com
  # список версій, підтримуваних цим визначенням власних ресурсів
  versions:
    - name: v1
      # Кожну версію можна ввімкнути/вимкнути за допомогою прапорця Served.
      served: true
      # Одна і лише одна версія повинна бути позначена як версія зберігання.
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
                replicas:
                  type: integer
  # або просторово обмежений за іменем, або на рівні кластера
  scope: Namespaced
  names:
    # назва множини, яка буде використана в URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # назва однини, яка буде використана як псевдонім у CLI та для показу
    singular: crontab
    # вид - зазвичай це тип у форматі CamelCased однини. Ваші маніфести ресурсів використовують це.
    kind: CronTab
    # короткі назви дозволяють мати збіг для скорочених рядків з вашим ресурсом у CLI
    shortNames:
    - ct
```

та створите його:

```shell
kubectl apply -f resourcedefinition.yaml
```

Тоді буде створено новий просторово обмежений RESTful API шлях за адресою:

```none
/apis/stable.example.com/v1/namespaces/*/crontabs/...
```

Цю URL-адресу шляху можна буде використовувати для створення та управління власними обʼєктами. `kind` цих обʼєктів буде `CronTab` зі специфікації обʼєкта CustomResourceDefinition, який ви створили вище.

Може знадобитися кілька секунд, щоб створити точку доступу. Ви можете спостерігати, що умова `Established` вашого CustomResourceDefinition стає true або спостерігати інформацію про відкриття сервера API для вашого ресурсу, щоб він зʼявився.

## Створення власних обʼєктів {#create-custom-objects}

Після створення обʼєкта CustomResourceDefinition ви можете створювати власні обʼєкти. Власні обʼєкти можуть містити власні поля. Ці поля можуть містити довільний JSON. У наступному прикладі поля `cronSpec` та `image` встановлені у власний обʼєкт типу `CronTab`. Тип `CronTab` походить зі специфікації обʼєкта CustomResourceDefinition, який ви створили вище.

Якщо ви збережете наступний YAML у `my-crontab.yaml`:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
```

і створите його:

```shell
kubectl apply -f my-crontab.yaml
```

Потім ви можете управляти вашими обʼєктами CronTab за допомогою kubectl. Наприклад:

```shell
kubectl get crontab
```

Повинен вивести список, подібний до такого:

```none
NAME                 AGE
my-new-cron-object   6s
```

Назви ресурсів нечутливі до регістру при використанні kubectl, і ви можете використовувати як однину, так і множину, визначені в CRD, а також будь-які короткі назви.

Ви також можете переглянути дані YAML:

```shell
kubectl get ct -o yaml
```

Ви повинні побачити, що він містить власні поля `cronSpec` та `image` з YAML, який ви використовували для його створення:

```yaml
apiVersion: v1
items:
- apiVersion: stable.example.com/v1
  kind: CronTab
  metadata:
    annotations:
      kubectl.kubernetes.io/last-applied-configuration: |
        {"apiVersion":"stable.example.com/v1","kind":"CronTab","metadata":{"annotations":{},"name":"my-new-cron-object","namespace":"default"},"spec":{"cronSpec":"* * * * */5","image":"my-awesome-cron-image"}}
    creationTimestamp: "2021-06-20T07:35:27Z"
    generation: 1
    name: my-new-cron-object
    namespace: default
    resourceVersion: "1326"
    uid: 9aab1d66-628e-41bb-a422-57b8b3b1f5a9
  spec:
    cronSpec: '* * * * */5'
    image: my-awesome-cron-image
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
```

## Видалення CustomResourceDefinition

Коли ви видаляєте CustomResourceDefinition, сервер деінсталює RESTful API шлях та видаляє всі власні обʼєкти, збережені в ньому.

```shell
kubectl delete -f resourcedefinition.yaml
kubectl get crontabs
```

```none
Error from server (NotFound): Unable to list {"stable.example.com" "v1" "crontabs"}: the server could not
find the requested resource (get crontabs.stable.example.com)
```

Якщо ви пізніше створите те саме CustomResourceDefinition, воно буде порожнім з початку.

## Визначення структурної схеми {#specifying-a-structural-schema}

CustomResources зберігають структуровані дані у власних полях (разом з вбудованими полями `apiVersion`, `kind` та `metadata`, які сервер API перевіряє неявно). З валідацією [OpenAPI v3.0](#validation) можна вказати схему, яка перевіряється під час створення та оновлення. Подивіться нижче для деталей та обмежень такої схеми.

З `apiextensions.k8s.io/v1` визначення структурної схеми є обовʼязковим для визначення власних ресурсів. У бета-версії CustomResourceDefinition структурна схема була необовʼязковою.

Структурна схема — це схема валідації [OpenAPI v3.0](#validation), яка:

1. вказує непорожній тип (за допомогою `type` в OpenAPI) для кореня, для кожного вказаного поля вузла обʼєкта (за допомогою `properties` або `additionalProperties` в OpenAPI) та для кожного елемента вузла масиву (за допомогою `items` в OpenAPI), за винятком:
   * вузла з `x-kubernetes-int-or-string: true`
   * вузла з `x-kubernetes-preserve-unknown-fields: true`
2. для кожного поля в обʼєкті та кожного елемента в масиві, які вказані всередині будь-якого з `allOf`, `anyOf`, `oneOf` або `not`, схема також вказує поле/елемент поза цими логічними виразами (порівняйте приклад 1 та 2).
3. не встановлює `description`, `type`, `default`, `additionalProperties`, `nullable` всередині `allOf`, `anyOf`, `oneOf` або `not`, за винятком двох шаблонів для `x-kubernetes-int-or-string: true` (див. нижче).
4. якщо вказано `metadata`, то дозволяються обмеження тільки на `metadata.name` та `metadata.generateName`.

Неструктурний приклад 1:

```yaml
allOf:
- properties:
    foo:
      # ...
```

суперечить правилу 2. Наступне було б правильним:

```yaml
properties:
  foo:
    # ...
allOf:
- properties:
    foo:
      # ...
```

Неструктурний приклад 2:

```yaml
allOf:
- items:
    properties:
      foo:
        # ...
```

суперечить правилу 2. Наступне було б правильним:

```yaml
items:
  properties:
    foo:
      # ...
allOf:
- items:
    properties:
      foo:
        # ...
```

Неструктурний приклад 3:

```yaml
properties:
  foo:
    pattern: "abc"
  metadata:
    type: object
    properties:
      name:
        type: string
        pattern: "^a"
      finalizers:
        type: array
        items:
          type: string
          pattern: "my-finalizer"
anyOf:
- properties:
    bar:
      type: integer
      minimum: 42
  required: ["bar"]
  description: "foo bar object"
```

не є структурною схемою через наступні порушення:

* тип у корені відсутній (правило 1).
* тип `foo` відсутній (правило 1).
* `bar` всередині `anyOf` не вказаний зовні (правило 2).
* тип `bar` в `anyOf` (правило 3).
* опис встановлено в `anyOf` (правило 3).
* `metadata.finalizers` можуть бути не обмежені (правило 4).

Натомість наступна відповідна схема є структурною:

```yaml
type: object
description: "foo bar object"
properties:
  foo:
    type: string
    pattern: "abc"
  bar:
    type: integer
  metadata:
    type: object
    properties:
      name:
        type: string
        pattern: "^a"
anyOf:
- properties:
    bar:
      minimum: 42
  required: ["bar"]
```

Порушення правил структурної схеми повідомляються в умові `NonStructural` у CustomResourceDefinition.

### Обрізка полів {#field-pruning}

CustomResourceDefinitions зберігають перевірені дані ресурсів у сховищі постійного зберігання кластера, {{< glossary_tooltip term_id="etcd" text="etcd">}}.Так само як і з вбудованими ресурсами Kubernetes, такими як {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}, якщо ви вказуєте поле, яке сервер API не впізнає, невідоме поле _обрізається_ (видаляється) перед зберіганням.

CRD, перетворені з `apiextensions.k8s.io/v1beta1` на `apiextensions.k8s.io/v1`, можуть бути позбавлені структурних схем, і `spec.preserveUnknownFields` може бути встановлено в `true`.

Для застарілих обʼєктів власного визначення ресурсів, створених як `apiextensions.k8s.io/v1beta1` з `spec.preserveUnknownFields` встановленим в `true`, також вірно наступне:

* Обрізка не ввімкнена.
* Ви можете зберігати довільні дані.

Для сумісності з `apiextensions.k8s.io/v1` оновіть визначення своїх власних
ресурсів:

1. Використовуйте структурну схему OpenAPI.
2. Встановіть `spec.preserveUnknownFields` в `false`.

Якщо ви збережете наступний YAML у `my-crontab.yaml`:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
  someRandomField: 42
```

і створите його:

```shell
kubectl create --validate=false -f my-crontab.yaml -o yaml
```

Ваш вивід буде подібним до:

```yaml
apiVersion: stable.example.com/v1
kind: CronTab
metadata:
  creationTimestamp: 2017-05-31T12:56:35Z
  generation: 1
  name: my-new-cron-object
  namespace: default
  resourceVersion: "285"
  uid: 9423255b-4600-11e7-af6a-28d2447dc82b
spec:
  cronSpec: '* * * * */5'
  image: my-awesome-cron-image
```

Зверніть увагу, що поле `someRandomField` було обрізано.

У цьому прикладі вимкнено перевірку на клієнтському боці, щоб показати поведінку сервера API, додавши параметр командного рядка `--validate=false`. Оскільки [схеми валідації OpenAPI також публікуються](#publish-validation-schema-in-openapi) для клієнтів, `kubectl` також перевіряє невідомі поля та відхиляє ці обʼєкти задовго до їх надсилання на сервер API.

#### Контроль обрізки полів {#controlling-pruning}

Типово усі невизначені поля власного ресурсу, у всіх версіях, обрізаються. Однак можна відмовитися від цього для певних піддерев полів, додавши `x-kubernetes-preserve-unknown-fields: true` у [структурну схему валідації OpenAPI v3](#specifying-a-structural-schema).

Наприклад:

```yaml
type: object
properties:
  json:
    x-kubernetes-preserve-unknown-fields: true
```

Поле `json` може зберігати будь-яке значення JSON, без обрізки.

Ви також можете частково вказати допустимий JSON; наприклад:

```yaml
type: object
properties:
  json:
    x-kubernetes-preserve-unknown-fields: true
    type: object
    description: this is arbitrary JSON
```

З цим дозволяються тільки значення типу `object`.

Обрізка знову ввімкнена для кожного вказаного властивості (або `additionalProperties`):

```yaml
type: object
properties:
  json:
    x-kubernetes-preserve-unknown-fields: true
    type: object
    properties:
      spec:
        type: object
        properties:
          foo:
            type: string
          bar:
            type: string
```

З цим значення:

```yaml
json:
  spec:
    foo: abc
    bar: def
    something: x
  status:
    something: x
```

обрізається до:

```yaml
json:
  spec:
    foo: abc
    bar: def
  status:
    something: x
```

Це означає, що поле `something` у вказаному обʼєкті `spec` обрізається, але все поза цим обʼєктом — ні.

### IntOrString

Вузли в схемі з `x-kubernetes-int-or-string: true` виключаються з правила 1, таким чином наступна схема є структурною:

```yaml
type: object
properties:
  foo:
    x-kubernetes-int-or-string: true
```

Також ці вузли частково виключаються з правила 3 у тому сенсі, що дозволяються наступні два шаблони (саме ці, без варіацій в порядку або додаткових полів):

```yaml
x-kubernetes-int-or-string: true
anyOf:
  - type: integer
  - type: string
...
```

та

```yaml
x-kubernetes-int-or-string: true
allOf:
  - anyOf:
      - type: integer
      - type: string
  - # ... нуль або більше
...
```

З однією з цих специфікацій, як ціле число, так і рядок будуть валідними.

У розділі [Публікація схеми валідації](#publish-validation-schema-in-openapi), `x-kubernetes-int-or-string: true` розгортається до одного з двох показаних вище шаблонів.

### RawExtension

RawExtensions (як у [`runtime.RawExtension`](/docs/reference//kubernetes-api/workload-resources/controller-revision-v1#RawExtension)) містять повні обʼєкти Kubernetes, тобто з полями `apiVersion` і `kind`.

Можна задати ці вбудовані обʼєкти (як повністю без обмежень, так і частково задані), встановивши `x-kubernetes-embedded-resource: true`. Наприклад:

```yaml
type: object
properties:
  foo:
    x-kubernetes-embedded-resource: true
    x-kubernetes-preserve-unknown-fields: true
```

Тут поле `foo` містить повний обʼєкт, наприклад:

```yaml
foo:
  apiVersion: v1
  kind: Pod
  spec:
    # ...
```

Оскільки поруч вказано `x-kubernetes-preserve-unknown-fields: true`, нічого не обрізається. Використання `x-kubernetes-preserve-unknown-fields: true` є опціональним.

З `x-kubernetes-embedded-resource: true` поля `apiVersion`, `kind` і `metadata` неявно задаються та перевіряються на валідність.

## Обслуговування декількох версій CRD {#serving-multiple-versions-of-a-crd}

Дивіться [версіювання визначення власних ресурсів](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/) для отримання додаткової інформації про обслуговування декількох версій вашого CustomResourceDefinition і міграцію ваших обʼєктів з однієї версії на іншу.

<!-- discussion -->

## Розширені теми {#advanced-topics}

### Завершувачі {#finalizers}

_Завершувачі_ дозволяють контролерам реалізовувати асинхронні гаки перед видаленням. Власні обʼєкти підтримують завершувачі, аналогічні вбудованим обʼєктам.

Ви можете додати завершувач до власного обʼєкта ось так:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  finalizers:
  - stable.example.com/finalizer
```

Ідентифікатори власних завершувачів складаються з імені домену, косої риски та назви завершувача. Будь-який контролер може додати завершувач до списку завершувачів будь-якого обʼєкта.

Перший запит на видалення обʼєкта з завершувачами встановлює значення для поля `metadata.deletionTimestamp`, але не видаляє його. Після встановлення цього значення можна лише видаляти записи у списку `finalizers`. Поки залишаються будь-які завершувачі, неможливо примусово видалити обʼєкт.

Коли поле `metadata.deletionTimestamp` встановлене, контролери, які стежать за обʼєктом, виконують будь-які завершувачі, які вони обробляють, і видаляють завершувач зі списку після завершення. Відповідальність за видалення свого завершувача зі списку лежить на кожному контролері.

Значення поля `metadata.deletionGracePeriodSeconds` контролює інтервал між оновленнями опитування.

Після того, як список завершувачів стане порожнім, тобто всі завершувачі будуть виконані, ресурс буде видалено Kubernetes.

### Валідація {#validation}

Власні ресурси перевіряються за допомогою [схем OpenAPI v3.0](https://github.com/OAI/OpenAPI-Specification/blob/3.0.0/versions/3.0.0.md#schema-object), за допомогою x-kubernetes-validations, коли функція [Правил валідації](#validation-rules) ввімкнена, і ви можете додати додаткову валідацію за допомогою [вебхуків допуску](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook).

Крім того, до схеми застосовуються такі обмеження:

* Ці поля не можна встановлювати:

  * `definitions`,
  * `dependencies`,
  * `deprecated`,
  * `discriminator`,
  * `id`,
  * `patternProperties`,
  * `readOnly`,
  * `writeOnly`,
  * `xml`,
  * `$ref`.

* Поле `uniqueItems` не можна встановлювати в `true`.
* Поле `additionalProperties` не можна встановлювати в `false`.
* Поле `additionalProperties` є взаємозаперечним із `properties`.

Розширення `x-kubernetes-validations` можна використовувати для перевірки власних ресурсів за допомогою [виразів загальної мови виразів (CEL)](https://github.com/google/cel-spec), коли функція [правил валідації](#validation-rules) увімкнена, а схема CustomResourceDefinition є [структурною схемою](#specifying-a-structural-schema).

Зверніться до розділу [структурних схем](#specifying-a-structural-schema) для інших обмежень та функцій CustomResourceDefinition.

Схема визначається у CustomResourceDefinition. У наведеному нижче прикладі CustomResourceDefinition застосовує такі перевірки до власного обʼєкта:

* `spec.cronSpec` повинен бути рядком і відповідати формі, описаній регулярним виразом.
* `spec.replicas` повинен бути цілим числом і мати мінімальне значення 1 та максимальне значення 10.

Збережіть CustomResourceDefinition у файл `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        # openAPIV3Schema - це схема для перевірки власних обʼєктів.
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                  pattern: '^(\d+|\*)(/\д+)?(\s+(\d+|\*)(/\д+)?){4}$'
                image:
                  type: string
                replicas:
                  type: integer
                  minimum: 1
                  maximum: 10
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
```

і створіть його:

```shell
kubectl apply -f resourcedefinition.yaml
```

Запит на створення власного обʼєкта типу CronTab буде відхилено, якщо поля містять недійсні значення. У наведеному нижче прикладі власний обʼєкт містить поля з недійсними значеннями:

* `spec.cronSpec` не відповідає регулярному виразу.
* `spec.replicas` більше 10.

Якщо ви збережете наступний YAML у файл `my-crontab.yaml`:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * *"
  image: my-awesome-cron-image
  replicas: 15
```

і спробуєте створити його:

```shell
kubectl apply -f my-crontab.yaml
```

то отримаєте помилку:

```console
The CronTab "my-new-cron-object" is invalid: []: Invalid value: map[string]interface {}{"apiVersion":"stable.example.com/v1", "kind":"CronTab", "metadata":map[string]interface {}{"name":"my-new-cron-object", "namespace":"default", "deletionTimestamp":interface {}(nil), "deletionGracePeriodSeconds":(*int64)(nil), "creationTimestamp":"2017-09-05T05:20:07Z", "uid":"e14d79e7-91f9-11e7-a598-f0761cb232d1", "clusterName":""}, "spec":map[string]interface {}{"cronSpec":"* * * *", "image":"my-awesome-cron-image", "replicas":15}}:
validation failure list:
spec.cronSpec in body should match '^(\d+|\*)(/\д+)?(\с+(\д+|\*)(/\д+)?){4}$'
spec.replicas in body should be less than or equal to 10
```

Якщо поля містять дійсні значення, запит на створення обʼєкта буде прийнято.

Збережіть наступний YAML у файл `my-crontab.yaml`:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
  replicas: 5
```

І створіть його:

```shell
kubectl apply -f my-crontab.yaml
crontab "my-new-cron-object" created
```

### Проковзування валідації {#validation-ratcheting}

{{< feature-state feature_gate_name="CRDValidationRatcheting" >}}

Якщо ви використовуєте версію Kubernetes старше v1.30, вам потрібно явно ввімкнути [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `CRDValidationRatcheting`, щоб використовувати цю поведінку, яка потім застосовується до всіх CustomResourceDefinitions у вашому кластері.

За умови увімкнення функціональної можливості, Kubernetes реалізує _проковзування валідації_ для CustomResourceDefinitions. API сервер готовий прийняти оновлення ресурсів, які є недійсними після оновлення, за умови, що кожна частина ресурсу, яка не пройшла валідацію, не була змінена операцією оновлення. Іншими словами, будь-яка недійсна частина ресурсу, яка залишається недійсною, вже повинна була бути неправильною. Ви не можете використовувати цей механізм для оновлення дійсного ресурсу, щоб він став недійсним.

Ця функція дозволяє авторам CRD впевнено додавати нові перевірки до схеми OpenAPIV3 за певних умов. Користувачі можуть безпечно оновлюватися до нової схеми без зміни версії обʼєкта або порушення робочих процесів.

Хоча більшість перевірок, розміщених у схемі OpenAPIV3 CRD, підтримують обмеження, є кілька винятків. Наступні перевірки схеми OpenAPIV3 не підтримуються обмеженнями у реалізації в Kubernetes {{< skew currentVersion >}} і якщо порушені, продовжуватимуть видавати помилку як зазвичай:

* Квантори
  * `allOf`
  * `oneOf`
  * `anyOf`
  * `not`
  * будь-які перевірки в нащадках одного з цих полів
* `x-kubernetes-validations` Для Kubernetes 1.28, [правила валідації](#validation-rules) CRD ігноруються обмеженнями. Починаючи з Alpha 2 у Kubernetes 1.29, `x-kubernetes-validations` обмежуються лише, якщо вони не посилаються на `oldSelf`.

  Перехідні правила ніколи не обмежуються: лише помилки, які виникають через правила, які не використовують `oldSelf`, автоматично обмежуються, якщо їх значення не змінені.

  Щоб написати власну логіку обмеження для виразів CEL, перегляньте [optionalOldSelf](#field-optional-oldself).
* `x-kubernetes-list-type` Помилки, що виникають через зміну типу списку у підсхемі, не будуть
  обмежені. Наприклад, додавання `set` до списку з дублікатів завжди призведе до помилки.
* `x-kubernetes-list-map-keys` Помилки, що виникають через зміну ключів карти у схемі списку, не будуть  обмежені.
* `required` Помилки, що виникають через зміну списку обовʼязкових полів, не будуть обмежені.
* `properties` Додавання/видалення/модифікація імен властивостей не обмежуються, але зміни до перевірок у схемах та підсхемах властивостей можуть бути обмежені, якщо імʼя властивості залишається незмінним.
* `additionalProperties` Видалення раніше вказаної валідації `additionalProperties` не буде
  обмежено.
* `metadata` Помилки, що виникають через вбудовану валідацію обʼєкта `metadata` у Kubernetes, не будуть обмежені (наприклад, імʼя обʼєкта або символи у значенні мітки). Якщо ви вказуєте свої власні додаткові правила для метаданих власного ресурсу, ця додаткова валідація буде обмежена.

### Правила валідації {#validation-rules}

{{< feature-state state="stable" for_k8s_version="v1.29" >}}

Правила валідації використовують [Common Expression Language (CEL)](https://github.com/google/cel-spec) для валідації значень власних ресурсів. Правила валідації включаються в схеми CustomResourceDefinition за допомогою розширення `x-kubernetes-validations`.

Правило обмежується місцем знаходження розширення `x-kubernetes-validations` у схемі. Змінна `self` у виразі CEL привʼязана до значення, що перевіряється.

Всі правила валідації обмежені поточним обʼєктом: ніякі міжобʼєктні або stateful правила валідації не підтримуються.

Наприклад:

```yaml
  # ...
  openAPIV3Schema:
    type: object
    properties:
      spec:
        type: object
        x-kubernetes-validations:
          - rule: "self.minReplicas <= self.replicas"
            message: "replicas should be greater than or equal to minReplicas."
          - rule: "self.replicas <= self.maxReplicas"
            message: "replicas should be smaller than or equal to maxReplicas."
        properties:
          # ...
          minReplicas:
            type: integer
          replicas:
            type: integer
          maxReplicas:
            type: integer
        required:
          - minReplicas
          - replicas
          - maxReplicas
```

відхилить запит на створення цього власного ресурсу:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  minReplicas: 0
  replicas: 20
  maxReplicas: 10
```

з відповіддю:

```none
The CronTab "my-new-cron-object" is invalid:
* spec: Invalid value: map[string]interface {}{"maxReplicas":10, "minReplicas":0, "replicas":20}: replicas should be smaller than or equal to maxReplicas.
```

`x-kubernetes-validations` може містити декілька правил. `rule` під `x-kubernetes-validations` представляє вираз, який буде оцінюватися CEL. `message` представляє повідомлення, що показується при невдачі валідації. Якщо повідомлення не встановлено, відповідь буде такою:

```none
The CronTab "my-new-cron-object" is invalid:
* spec: Invalid value: map[string]interface {}{"maxReplicas":10, "minReplicas":0, "replicas":20}: failed rule: self.replicas <= self.maxReplicas
```

{{< note >}}
Ви можете швидко перевірити вирази CEL на [CEL Playground](https://playcel.undistro.io).
{{< /note >}}

Правила валідації компілюються при створенні/оновленні CRD. Запит на створення/оновлення CRD буде відхилено, якщо компіляція правил валідації зазнає невдачі. Процес компіляції включає перевірку типів.

Помилки компіляції:

* `no_matching_overload`: ця функція не має перевантаження для типів аргументів.

  Наприклад, правило `self == true` для поля типу integer призведе до помилки:

  ```none
  Invalid value: apiextensions.ValidationRule{Rule:"self == true", Message:""}: compilation failed: ERROR: \<input>:1:6: found no matching overload for '_==_' applied to '(int, bool)'
  ```

* `no_such_field`: не містить бажаного поля.

  Наприклад, правило `self.nonExistingField > 0` для неіснуючого поля поверне наступну помилку:

  ```none
  Invalid value: apiextensions.ValidationRule{Rule:"self.nonExistingField > 0", Message:""}: compilation failed: ERROR: \<input>:1:5: undefined field 'nonExistingField'
  ```

* `invalid argument`: недійсний аргумент для макросів.

  Наприклад, правило `has(self)` поверне помилку:

  ```none
  Invalid value: apiextensions.ValidationRule{Rule:"has(self)", Message:""}: compilation failed: ERROR: <input>:1:4: invalid argument to has() macro
  ```

Приклади правил валідації:

| Правило                                                                           | Призначення                                                                          |
| ----------------                                                                  | ------------                                                                         |
| `self.minReplicas <= self.replicas && self.replicas <= self.maxReplicas`          | Перевірка, що три поля, які визначають репліки, впорядковані належним чином         |
| `'Available' in self.stateCounts`                                                 | Перевірка наявності запису з ключем 'Available' у map                               |
| `(size(self.list1) == 0) != (size(self.list2) == 0)`                              | Перевірка, що один з двох списків не порожній, але не обидва                         |
| <code>!('MY_KEY' in self.map1) &#124;&#124; self['MY_KEY'].matches('^[a-zA-Z]*$')</code>              | Перевірка значення map для конкретного ключа, якщо він у мапі                       |
| `self.envars.filter(e, e.name == 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$')` | Перевірка поля 'value' у списку map, де ключове поле 'name' дорівнює 'MY_ENV'       |
| `has(self.expired) && self.created + self.ttl < self.expired`                     | Перевірка, що дата 'expired' після дати 'create' плюс тривалість 'ttl'              |
| `self.health.startsWith('ok')`                                                    | Перевірка, що рядкове поле 'health' починається з префіксу 'ok'                     |
| `self.widgets.exists(w, w.key == 'x' && w.foo < 10)`                              | Перевірка, що властивість 'foo' елемента списку map з ключем 'x' менше 10            |
| `type(self) == string ? self == '100%' : self == 1000`                            | Перевірка поля int-or-string для обох випадків int і string                           |
| `self.metadata.name.startsWith(self.prefix)`                                      | Перевірка, що імʼя обʼєкта має префікс іншого поля значення                           |
| `self.set1.all(e, !(e in self.set2))`                                             | Перевірка, що два списки множин не перетинаються                                    |
| `size(self.names) == size(self.details) && self.names.all(n, n in self.details)`  | Перевірка, що мапа 'details' має ключі з елементів списку множин 'names'           |
| `size(self.clusters.filter(c, c.name == self.primary)) == 1`                      | Перевірка, що властивість 'primary' має лише одну появу у списку мап 'clusters'      |

Посилання: [Supported evaluation on CEL](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#evaluation)

* Якщо правило обмежене коренем ресурсу, воно може вибирати поля з будь-яких полів, оголошених у схемі OpenAPIv3 CRD, а також `apiVersion`, `kind`, `metadata.name` та `metadata.generateName`. Це включає вибір полів як у `spec`, так і в `status` в одному виразі:

  ```yaml
    # ...
    openAPIV3Schema:
      type: object
      x-kubernetes-validations:
        - rule: "self.status.availableReplicas >= self.spec.minReplicas"
      properties:
          spec:
            type: object
            properties:
              minReplicas:
                type: integer
              # ...
          status:
            type: object
            properties:
              availableReplicas:
                type: integer
  ```

* Якщо Rule обмежене обʼєктом з властивостями, доступні властивості обʼєкта можна вибирати за допомогою `self.field`, а наявність поля можна перевірити за допомогою `has(self.field)`. Поля зі значенням null трактуються як відсутні поля у виразах CEL.

  ```yaml
    # ...
    openAPIV3Schema:
      type: object
      properties:
        spec:
          type: object
          x-kubernetes-validations:
            - rule: "has(self.foo)"
          properties:
            ...
            foo:
              type: integer
  ```

* Якщо Rule обмежене обʼєктом з додатковими властивостями (тобто map), значення map доступні через `self[mapKey]`, наявність map можна перевірити за допомогою `mapKey in self`, а всі записи з map доступні за допомогою макросів і функцій CEL, таких як `self.all(...)`.

  ```yaml
    # ...
    openAPIV3Schema:
      type: object
      properties:
        spec:
          type: object
          x-kubernetes-validations:
            - rule: "self['xyz'].foo > 0"
          additionalProperties:
            ...
            type: object
            properties:
              foo:
                type: integer
  ```

* Якщо правило обмежене масивом, елементи масиву доступні через `self[i]` та також за допомогою макросів і функцій.

  ```yaml
    # ...
    openAPIV3Schema:
      type: object
      properties:
        # ...
        foo:
          type: array
          x-kubernetes-validations:
            - rule: "size(self) == 1"
          items:
            type: string
  ```

* Якщо правило обмежене скаляром, `self` привʼязується до значення скаляра.

  ```yaml
    # ...
    openAPIV3Schema:
      type: object
      properties:
        spec:
          type: object
          properties:
            # ...
            foo:
              type: integer
              x-kubernetes-validations:
              - rule: "self > 0"
  ```

Приклади:

|тип поля, для якого обмежено правило    | Приклад правила             |
| -----------------------| -----------------------|
| кореневий обʼєкт       | `self.status.actual <= self.spec.maxDesired` |
| map обʼєктів          | `self.components['Widget'].priority < 10` |
| список цілих чисел     | `self.values.all(value, value >= 0 && value < 100)` |
| рядок                  | `self.startsWith('kube')` |

`apiVersion`, `kind`, `metadata.name` та `metadata.generateName` завжди доступні з кореня обʼєкта та з будь-яких обʼєктів з анотацією `x-kubernetes-embedded-resource`. Інші властивості метаданих недоступні.

Невідомі дані, збережені у власниї ресурсах за допомогою `x-kubernetes-preserve-unknown-fields`, не доступні у виразах CEL. Це включає:

* Невідомі значення полів, які зберігаються у схемах обʼєктів з `x-kubernetes-preserve-unknown-fields`.
* Властивості обʼєктів, де схема властивостей має "unknown type". "Unknown type" визначається рекурсивно як:

  * Схема без типу і з встановленим `x-kubernetes-preserve-unknown-fields`
  * Масив, де схема елементів має "unknown type"
  * Обʼєкт, де схема additionalProperties має "unknown type"

Доступні лише назви властивостей форми `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*`. Доступні назви властивостей екрануються за наступними правилами при доступі у виразі:

| послідовність екранування   | еквівалент назви властивості  |
| -----------------------    | -----------------------       |
| `__underscores__`          | `__`                          |
| `__dot__`                  | `.`                           |
| `__dash__`                 | `-`                           |
| `__slash__`                | `/`                           |
| `__{keyword}__`            | [CEL RESERVED keyword](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#syntax) |

Примітка: зарезервоване ключове слово CEL повинно точно збігатися з назвою властивості, щоб бути екранованим (наприклад, int у слові sprint не буде екрановано).

Приклади екранування:

|назва властивості    | правило з екранованою назвою властивості     |
| ----------------| -----------------------             |
| namespace       | `self.__namespace__ > 0`            |
| x-prop          | `self.x__dash__prop > 0`            |
| redact__d       | `self.redact__underscores__d > 0`   |
| string          | `self.startsWith('kube')`           |

Рівність масивів з `x-kubernetes-list-type` типу `set` або `map` ігнорує порядок елементів, тобто `[1, 2] == [2, 1]`. Конкатенація масивів з x-kubernetes-list-type використовує семантику
типу списку:

* `set`: `X + Y` виконує обʼєднання, де зберігаються позиції елементів у `X`, а непересічні елементи у `Y` додаються, зберігаючи їх частковий порядок.

* `map`: `X + Y` виконує злиття, де зберігаються позиції всіх ключів у `X`, але значення перезаписуються значеннями у `Y`, коли ключі `X` та `Y` перетинаються. Елементи у `Y` з непересічними ключами додаються, зберігаючи їх частковий порядок.

Ось відповідність типів між OpenAPIv3 та CEL:

| Тип OpenAPIv3                                   | Тип CEL                                                                                                                     |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 'object' з Properties                           | object / "message type"                                                                                                     |
| 'object' з AdditionalProperties                 | map                                                                                                                         |
| 'object' з x-kubernetes-embedded-type           | object / "message type", 'apiVersion', 'kind', 'metadata.name' та 'metadata.generateName' неявно включені у схему           |
| 'object' з x-kubernetes-preserve-unknown-fields | object / "message type", невідомі поля НЕ доступні у виразі CEL                                                             |
| x-kubernetes-int-or-string                      | динамічний обʼєкт, який може бути або int, або string, `type(value)` можна використовувати для перевірки типу               |
| 'array                                          | list                                                                                                                        |
| 'array' з x-kubernetes-list-type=map            | list з порівнянням на основі map та гарантіями унікальності ключів                                                         |
| 'array' з x-kubernetes-list-type=set            | list з порівнянням на основі множини та гарантіями унікальності елементів                                                   |
| 'boolean'                                       | boolean                                                                                                                     |
| 'number' (всі формати)                          | double                                                                                                                      |
| 'integer' (всі формати)                         | int (64)                                                                                                                    |
| 'null'                                          | null_type                                                                                                                   |
| 'string'                                        | string                                                                                                                      |
| 'string' з format=byte (base64 encoded)         | bytes                                                                                                                       |
| 'string' з format=date                          | timestamp (google.protobuf.Timestamp)                                                                                       |
| 'string' з format=datetime                      | timestamp (google.protobuf.Timestamp)                                                                                       |
| 'string' з format=duration                      | duration (google.protobuf.Duration)                                                                                         |

посилання: [CEL types](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#values),
[OpenAPI types](https://swagger.io/specification/#data-types),
[Структурні схемм Kubernetes](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema).

#### Поле messageExpression {#the-messageexpression-field}

Поле `messageExpression`, аналогічно до поля `message`, визначає рядок, яким буде повідомлено про негативний результат правила валідації. Однак `messageExpression` дозволяє використовувати вираз CEL для побудови повідомлення, що дозволяє вставляти більш описову інформацію в повідомлення про невдачу валідації. `messageExpression` має оцінюватися як рядок і може використовувати ті ж змінні, що і поле `rule`. Наприклад:

```yaml
x-kubernetes-validations:
- rule: "self.x <= self.maxLimit"
  messageExpression: '"x перевищує максимальний ліміт " + string(self.maxLimit)'
```

Майте на увазі, що конкатенація рядків CEL (оператор `+`) автоматично не призводить до перетворення в рядок. Якщо у вас є скаляр, який не є рядком, використовуйте функцію `string(<значення>)` для перетворення скаляра в рядок, як показано в прикладі вище.

`messageExpression` повинен оцінюватися як рядок, і це перевіряється при створенні CRD. Зауважте, що можна встановити як `message`, так і `messageExpression` для одного правила, і якщо обидва присутні, буде використовуватися `messageExpression`. Однак, якщо `messageExpression` оцінюється як помилка, буде використовуватися рядок, визначений у `message`, і помилка `messageExpression` буде зафіксована. Це повернення до попереднього стану також відбудеться, якщо вираз CEL, визначений у `messageExpression`, генерує порожній рядок або рядок, що містить розриви рядків.

Якщо одна з вищезазначених умов виконується і `message` не було встановлено, то буде використовуватися стандартне повідомлення про негативний результат валідації.

`messageExpression` є виразом CEL, тому обмеження, зазначені в розділі [Використання ресурсів функціями валідації](#resource-use-by-validation-functions), застосовуються. Якщо оцінка зупиняється через обмеження ресурсів під час виконання `messageExpression`, жодні подальші правила валідації не будуть виконуватися.

Встановлення `messageExpression` є необовʼязковим.

#### Поле `message` {#field-message}

Якщо ви хочете встановити статичне повідомлення, ви можете передати `message` замість `messageExpression`. Значення `message` використовується як непрозорий рядок помилки, якщо перевірка не пройшла успішно.

Встановлення `message` є необовʼязковим.

#### Поле `reason` {#field-reason}

Ви можете додати машинно-читаєму причину негативного результату перевірки в межах `validation`, щоб повертати її, коли запит не відповідає цьому правилу перевірки.

Наприклад:

```yaml
x-kubernetes-validations:
- rule: "self.x <= self.maxLimit"
  reason: "FieldValueInvalid"
```

Код стану HTTP, повернутий абоненту, буде відповідати причині першої невдачі перевірки. Наразі підтримуються такі причини: "FieldValueInvalid", "FieldValueForbidden", "FieldValueRequired", "FieldValueDuplicate". Якщо причини не встановлені або невідомі, типово використовується "FieldValueInvalid".

Встановлення `reason` є необовʼязковим.

#### Поле `fieldPath` {#field-field-path}

Ви можете вказати шлях поля, який повертається, коли перевірка завершується негативним результатом.

Наприклад:

```yaml
x-kubernetes-validations:
- rule: "self.foo.test.x <= self.maxLimit"
  fieldPath: ".foo.test.x"
```

У вищенаведеному прикладі перевіряється значення поля `x`, яке повинно бути менше значення `maxLimit`. Якщо не вказано `fieldPath`, коли результат перевірки негативний , `fieldPath` буде типово відповідати місцю розташування `self`. З вказаним `fieldPath` повернена помилка буде мати `fieldPath`, який належним чином посилатиметься на місце поля `x`.

Значення `fieldPath` повинно бути відносним шляхом JSON, що обмежений місцем цього розширення x-kubernetes-validations у схемі. Крім того, воно повинно посилатися на існуюче поле в межах схеми. Наприклад, коли перевірка перевіряє, чи є певний атрибут `foo` у map `testMap`, ви можете встановити `fieldPath` на `".testMap.foo"` або `.testMap['foo']'`. Якщо для перевірки потрібно перевірити унікальні атрибути у двох списках, `fieldPath` можна встановити для будь-якого зі списків. Наприклад, його можна встановити на `.testList1` або `.testList2`. Наразі підтримується дочірня операція для посилання на існуюче поле. Для отримання додаткової інформації див. [Підтримка JSONPath у Kubernetes](/docs/reference/kubectl/jsonpath/). Поле `fieldPath` не підтримує індексування масивів числовими значеннями.

Встановлення `fieldPath` є необовʼязковим.

#### Поле `optionalOldSelf` {#field-optional-oldself}

{{< feature-state feature_gate_name="CRDValidationRatcheting" >}}

Якщо у вашому кластері не включено [проковзування перевірки CRD](#validation-ratcheting), API визначення власного ресурсу не містить цього поля, і спроба встановити його може призвести
до помилки.

Поле `optionalOldSelf` є булевим полем, яке змінює поведінку [Правил переходу](#transition-rules), описаних нижче. Зазвичай правило переходу не оцінюється, якщо `oldSelf` не може бути визначено: під час створення обʼєкта або коли нове значення вводиться під час оновлення.

Якщо `optionalOldSelf` встановлено в true, тоді правила переходу завжди будуть оцінюватися, і тип `oldSelf` буде змінено на тип CEL [`Optional`](https://pkg.go.dev/github.com/google/cel-go/cel#OptionalTypes).

`optionalOldSelf` корисно в тих випадках, коли автори схеми хочуть мати більше інструментів керування [ніж надається за стандартно на основі рівності](#validation-ratcheting), щоб ввести нові, зазвичай строгіші обмеження на нові значення, зазвичай більш жорсткі для нових значень, але все ще дозволяючи те, що старі значення можуть бути пропущені з використанням старих правил.

Example Usage:

| CEL                                     | Опис |
|-----------------------------------------|-------------|
| `self.foo == "foo" \|\| (oldSelf.hasValue() && oldSelf.value().foo != "foo")` | Проковзування правила. Якщо значення має значення «foo», воно повинно залишатися foo. Але якщо воно існувало до того, як було введено обмеження «foo», воно може використовувати будь-яке значення |
| `[oldSelf.orValue(""), self].all(x, ["OldCase1", "OldCase2"].exists(case, x == case)) \|\| ["NewCase1", "NewCase2"].exists(case, self == case) \|\| ["NewCase"].has(self)` | "Перевірка для вилучених випадків перерахування, якщо oldSelf використовував їх" |
| `oldSelf.optMap(o, o.size()).orValue(0) < 4 \|\| self.size() >= 4` | Перевірка нещодавно збільшеного мінімального розміру map або списку з проковзуванням |

#### Функції перевірки {#available-validation-functions}

Доступні функції включають:

* Стандартні функції CEL, визначені у [списку стандартних визначень](https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#list-of-standard-definitions)
* Стандартні [макроси CEL](https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#macros)
* Розширена бібліотека функцій рядків CEL ([extended string function library](https://pkg.go.dev/github.com/google/cel-go@v0.11.2/ext#Strings))
* Розширена бібліотека функцій CEL для Kubernetes ([CEL extension library](https://pkg.go.dev/k8s.io/apiextensions-apiserver@v0.24.0/pkg/apiserver/schema/cel/library#pkg-functions))

#### Правила переходу {#transition-rules}

Правило, яке містить вираз з посиланням на ідентифікатор `oldSelf`, неявно вважається правилом переходу. Правила переходу дозволяють авторам схеми запобігати певним переходам між двома в іншому випадку допустимими станами. Наприклад:

```yaml
type: string
enum: ["low", "medium", "high"]
x-kubernetes-validations:
- rule: "!(self == 'high' && oldSelf == 'low') && !(self == 'low' && oldSelf == 'high')"
  message: не можна переходити безпосередньо між 'low' та 'high'
```

На відміну від інших правил, правила переходу застосовуються тільки до операцій, що відповідають наступним критеріям:

* Операція оновлює існуючий обʼєкт. Правила переходу ніколи не застосовуються до операцій створення.

* Існують як старе, так і нове значення. Залишається можливим перевірити, чи було додано або вилучено значення, розмістивши правило переходу на батьківському вузлі. Правила переходу ніколи не застосовуються до створення власних ресурсів. Якщо вони розміщені в необовʼязковому полі, правило переходу не буде застосовуватися до операцій оновлення, які встановлюють або прибирають поле.

* Шлях до вузла схеми, який перевіряється правилом переходу, повинен розподілятися на вузол, який може порівнюватися між старим обʼєктом і новим обʼєктом. Наприклад, елементи списку та їх нащадки (`spec.foo[10].bar`) не обовʼязково будуть кореліювати між існуючим обʼєктом та пізнішим оновленням того ж обʼєкта.

Помилки будуть генеруватися при записі CRD, якщо вузол схеми містить правило переходу, яке ніколи не може бути застосоване, наприклад  "oldSelf не може бути використано на некорельованій частині схеми у межах _path_".

Правила переходу дозволені тільки для _корелятивних частин_ схеми. Частина схеми є корелятивною, якщо всі батьківські схеми масиву мають тип `x-kubernetes-list-type=map`; будь-які батьківські схеми масиву типу `set` чи `atomic` роблять неможливим однозначне корелювання між `self` та `oldSelf`.

Нижче наведено кілька прикладів правил переходу:

{{< table caption="Приклади правил переходу" >}}
| Використання                                          | Правило
| --------                                              | --------
| Незмінність                                           | `self.foo == oldSelf.foo`
| Запобігання модифікації/видаленню після присвоєння    | `oldSelf != 'bar' \|\| self == 'bar'` або `!has(oldSelf.field) \|\| has(self.field)`
| Тільки додавання до множини                           | `self.all(element, element in oldSelf)`
| Якщо попереднє значення було X, нове значення може бути лише A або B, не Y або Z | `oldSelf != 'X' \|\| self in ['A', 'B']`
| Монотонні (незменшувані) лічільники                   | `self >= oldSelf`
{{< /table >}}

#### Використання ресурсів функціями перевірки {#resource-use-by-validation-functions}

Коли ви створюєте або оновлюєте CustomResourceDefinition, що використовує правила перевірки, API сервер перевіряє можливий вплив виконання цих правил перевірки. Якщо правило оцінюється як надмірно витратне у виконанні, API сервер відхиляє операцію створення або оновлення та повертає повідомлення про помилку. Подібна система використовується під час виконання, яка спостерігає за діями інтерпретатора. Якщо інтерпретатор виконує занадто багато інструкцій, виконання правила буде припинено, і виникне помилка. Кожен CustomResourceDefinition також має певний ліміт ресурсів для завершення виконання всіх своїх правил перевірки. Якщо сумарна оцінка всіх правил перевищує цей ліміт під час створення, то також виникне помилка перевірки.

Ймовірність виникнення проблем з ресурсним бюджетом перевірки низька, якщо ви лише зазначаєте правила, які завжди займають однакову кількість часу незалежно від розміру вхідних даних. Наприклад, правило, яке стверджує, що `self.foo == 1`, само по собі не має ризику відхилення через ресурсний бюджет перевірки. Але якщо `foo` є рядком і ви визначаєте правило перевірки `self.foo.contains("someString")`, то це правило займає довше часу на виконання в залежності від довжини `foo`. Інший приклад: якщо `foo` є масивом, і ви вказали правило перевірки `self.foo.all(x, x > 5)`. Система оцінки завжди припускає найгірший сценарій, якщо не вказано ліміт на довжину `foo`, і це буде стосуватися будь-якого обʼєкта, який можна ітерувати (списки, мапи тощо).

Через це, вважається найкращою практикою встановлювати ліміт через `maxItems`, `maxProperties` і `maxLength` для будь-якого обʼєкта, який обробляється в правилі перевірки, щоб уникнути помилок перевірки під час оцінки витрат. Наприклад, якщо є наступна схема з одним правилом:

```yaml
openAPIV3Schema:
  type: object
  properties:
    foo:
      type: array
      items:
        type: string
      x-kubernetes-validations:
        - rule: "self.all(x, x.contains('a string'))"
```

то API сервер відхилить це правило через бюджет перевірки з помилкою:

```none
spec.validation.openAPIV3Schema.properties[spec].properties[foo].x-kubernetes-validations[0].rule: Forbidden:
CEL rule exceeded budget by more than 100x (try simplifying the rule, or adding maxItems, maxProperties, and
maxLength where arrays, maps, and strings are used)
```

Відхилення відбувається тому, що `self.all` передбачає виклик `contains()` для кожного рядка у `foo`, що в свою чергу перевіряє, чи містить даний рядок `'a string'`. Без обмежень, це дуже витратне правило.

Якщо ви не вказуєте жодного ліміту перевірки, оцінена вартість цього правила перевищить ліміт вартості для одного правила. Але якщо додати обмеження в потрібні місця, правило буде дозволено:

```yaml
openAPIV3Schema:
  type: object
  properties:
    foo:
      type: array
      maxItems: 25
      items:
        type: string
        maxLength: 10
      x-kubernetes-validations:
        - rule: "self.all(x, x.contains('a string'))"
```

Система оцінки витрат враховує кількість разів, коли правило буде виконане, крім оціненої вартості самого правила. Наприклад, наступне правило матиме таку ж оцінену вартість, як і попередній приклад (незважаючи на те, що правило тепер визначено для окремих елементів масиву):

```yaml
openAPIV3Schema:
  type: object
  properties:
    foo:
      type: array
      maxItems: 25
      items:
        type: string
        x-kubernetes-validations:
          - rule: "self.contains('a string'))"
        maxLength: 10
```

Якщо у списку всередині іншого списку є правило перевірки, яке використовує `self.all`, це значно дорожче, ніж правило для не вкладеного списку. Правило, яке було б дозволено для не вкладеного списку, може потребувати нижчих обмежень для обох вкладених списків, щоб бути дозволеним. Наприклад, навіть без встановлення обмежень, наступне правило дозволено:

```yaml
openAPIV3Schema:
  type: object
  properties:
    foo:
      type: array
      items:
        type: integer
    x-kubernetes-validations:
      - rule: "self.all(x, x == 5)"
```

Але те саме правило для наступної схеми (з доданим вкладеним масивом) викликає помилку перевірки:

```yaml
openAPIV3Schema:
  type: object
  properties:
    foo:
      type: array
      items:
        type: array
        items:
          type: integer
        x-kubernetes-validations:
          - rule: "self.all(x, x == 5)"
```

Це тому, що кожен елемент `foo` сам є масивом, і кожен підмасив викликає `self.all`. Уникайте вкладених списків і map, якщо це можливо, де використовуються правила перевірки.

### Встановлення станадартних значень {#defaulting}

{{< note >}}
Щоб використовувати встановлення стандартних значень, ваш CustomResourceDefinition повинен використовувати версію API `apiextensions.k8s.io/v1`.
{{< /note >}}

Встановлення стандартних значень дозволяє вказати такі значення у [схемі перевірки OpenAPI v3](#validation):

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        # openAPIV3Schema це схема для перевірки власних обʼєктів.
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                  pattern: '^(\d+|\*)(/\d+)?(\s+(\d+|\*)(/\д+)?){4}$'
                  default: "5 0 * * *"
                image:
                  type: string
                replicas:
                  type: integer
                  minimum: 1
                  maximum: 10
                  default: 1
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
```

Таким чином, і `cronSpec`, і `replicas` будуть мати стандартні значення:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  image: my-awesome-cron-image
```

приводить до

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "5 0 * * *"
  image: my-awesome-cron-image
  replicas: 1
```

Встановлення стандартних значень відбувається на обʼєкті

* в запиті до API сервера з використанням стандартних значень версії запиту,
* під час читання з etcd з використанням стандартних значень версії зберігання,
* після втулків для мутаційного допуску з невипадковими змінами з використанням стандартних значень версії веб-хука допуску.

Стандартне значення, застосовані під час читання даних з etcd, автоматично не записуються назад у etcd. Потрібен запит на оновлення через API для збереження цих стандартних значень у etcd.

Стандартні значення для невкладених полів мають бути обрізані (за винятком стандартних значень полів `metadata`) та відповідати схемі перевірки. Наприклад, у наведеному вище прикладі, стандартне значення `{"replicas": "foo", "badger": 1}` для поля `spec` буде недійсним, оскільки `badger` є невідомим полем, а `replicas` не є рядком.

Стандартні значення полів `metadata` вузлів `x-kubernetes-embedded-resources: true` (або частин типових значень з `metadata`) не будуть обрізані під час створення CustomResourceDefinition, але будуть обрізані під час оброки запитів.

### Стандартні значення та nullable {#defaulting-and-nullable}

Значення `null` для полів, які або не вказують прапорець `nullable`, або задають його значення як `false`, будуть видалені до того, як буде застосовано стандартне значення. Якщо стандартне значення присутнє, воно буде застосоване. Коли `nullable` дорівнює `true`, значення `null` будуть збережені і не будуть змінені на стандартні значення.

Наприклад, розглянемо наступну схему OpenAPI:

```yaml
type: object
properties:
  spec:
    type: object
    properties:
      foo:
        type: string
        nullable: false
        default: "default"
      bar:
        type: string
        nullable: true
      baz:
        type: string
```

створення обʼєкта зі значеннями `null` для `foo`, `bar` і `baz`:

```yaml
spec:
  foo: null
  bar: null
  baz: null
```

призведе до

```yaml
spec:
  foo: "default"
  bar: null
```

де `foo` буде обрізане та встановлене стандартне значення, оскільки поле є ненульовим, `bar` залишиться зі значенням `null` через `nullable: true`, а `baz` буде видалено, оскільки поле є ненульовим і не має стандартного значення.

### Публікація схеми валідації в OpenAPI {#publish-validation-schema-in-openapi}

[Схеми валідації OpenAPI v3](#validation) CustomResourceDefinition, які є [структурованими](#specifying-a-structural-schema) та [дозволяють обрізку](#field-pruning), публікуються як [OpenAPI v3](/docs/concepts/overview/kubernetes-api/#openapi-and-swagger-definitions) та OpenAPI v2 з сервера API Kubernetes. Рекомендується використовувати документ OpenAPI v3, оскільки він є представленням схеми валідації OpenAPI v3 для CustomResourceDefinition без втрат, тоді як OpenAPI v2 представляє перетворення з втратами.

[Kubectl](/docs/reference/kubectl/) використовує опубліковану схему для виконання клієнтської валідації (`kubectl create` та `kubectl apply`), пояснення схеми (`kubectl explain`) для власних ресурсів. Опублікована схема також може бути використана для інших цілей, таких як генерація клієнтів або документації.

#### Сумісність з OpenAPI V2 {#compatibility-with-openapi-v2}

Для сумісності з OpenAPI V2, схема валідації OpenAPI v3 виконує перетворення з втратамиу схему OpenAPI v2. Схема зʼявляється в полях `definitions` та `paths` у [специфікації OpenAPI v2](/docs/concepts/overview/kubernetes-api/#openapi-and-swagger-definitions).

Під час перетворення застосовуються наступні зміни для збереження зворотної сумісності з kubectl версії 1.13. Ці зміни запобігають занадто строгій роботі kubectl та відхиленню дійсних схем OpenAPI, які він не розуміє. Перетворення не змінює схему валідації, визначену в CRD, і тому не впливає на [валідацію](#validation) на сервері API.

1. Наступні поля видаляються, оскільки вони не підтримуються OpenAPI v2:

   * Поля `allOf`, `anyOf`, `oneOf` та `not` видаляються

2. Якщо встановлено `nullable: true`, ми видаляємо `type`, `nullable`, `items` та `properties`, оскільки OpenAPI v2 не може відобразити nullable. Це необхідно для того, щоб kubectl не відхиляв правильні обʼєкти.

### Додаткові колонки виводу {#additional-printer-columns}

Інструмент kubectl покладається на форматування виводу на стороні сервера. Сервер API вашого кластера вирішує, які колонки показуються командою `kubectl get`. Ви можете налаштувати ці колонки для CustomResourceDefinition. Наступний приклад додає колонки `Spec`, `Replicas` та `Age`.

Збережіть CustomResourceDefinition у файл `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
  versions:
  - name: v1
    served: true
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              cronSpec:
                type: string
              image:
                type: string
              replicas:
                type: integer
    additionalPrinterColumns:
    - name: Spec
      type: string
      description: The cron spec defining the interval a CronJob is run
      jsonPath: .spec.cronSpec
    - name: Replicas
      type: integer
      description: The number of jobs launched by the CronJob
      jsonPath: .spec.replicas
    - name: Age
      type: date
      jsonPath: .metadata.creationTimestamp
```

Створіть CustomResourceDefinition:

```shell
kubectl apply -f resourcedefinition.yaml
```

Створіть екземпляр, використовуючи `my-crontab.yaml` з попереднього розділу.

Викличте вивід на стороні сервера:

```shell
kubectl get crontab my-new-cron-object
```

Зверніть увагу на колонки `NAME`, `SPEC`, `REPLICAS` та `AGE` у виводі:

```none
NAME                 SPEC        REPLICAS   AGE
my-new-cron-object   * * * * *   1          7s
```

{{< note >}}
Колонка `NAME` є неявною і не потребує визначення в CustomResourceDefinition.
{{< /note >}}

#### Пріоритет {#priority}

Кожна колонка включає поле `priority`. Наразі пріоритет розрізняє стовпці, що показуються у стандартному вигляді або в розгорнутому (за допомогою прапорця `-o wide`).

* Колонки з пріоритетом `0` показані у стандартному вигляді.
* Колонки з пріоритетом більшим за `0` показані тільки у широкому (wide) вигляді.

#### Тип {#type}

Поле `type` колонки може бути одним з наступних (порівняйте [OpenAPI v3 data types](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#dataTypes)):

* `integer` — цілі числа без плаваючої точки
* `number` — числа з плаваючою точкою
* `string` — строки
* `boolean` — `true` або `false`
* `date` — виводиться диференційовано як час, що минув від цієї мітки.

Якщо значення всередині CustomResource не відповідає типу, зазначеному для колонки, значення буде пропущено. Використовуйте валідацію CustomResource, щоб переконатися, що типи значень правильні.

#### Формат {#format}

Поле `format` колонки може бути одним з наступних:

* `int32`
* `int64`
* `float`
* `double`
* `byte`
* `date`
* `date-time`
* `password`

Поле `format` колонки контролює стиль, який використовується при виводі значення за допомогою `kubectl`.

### Селектори полів {#field-selectors}

[Селектори полів](/docs/concepts/overview/working-with-objects/field-selectors/) дозволяють клієнтам вибирати власні ресурси на основі значення одного або декількох полів ресурсу.

Усі власні ресурси підтримують вибір полів `metadata.name` та `metadata.namespace`.

Поля, оголошені в {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}, також можуть бути використані з селектором полів, коли вони включені в поле `spec.versions[*].selectableFields` {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}.

#### Поля селекторів власних ресурсів {#crd-selectable-fields}

{{< feature-state feature_gate_name="CustomResourceFieldSelectors" >}}

Поле `spec.versions[*].selectableFields` у {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} може бути використане для оголошення, які інші поля у власному ресурсі можуть бути використані у селекторах полів з [функціональною можливісюь](/docs/reference/command-line-tools-reference/feature-gates/) `CustomResourceFieldSelectors` (Ця функція є стандартно увімкненою з Kubernetes v1.31). Ось приклад, який додає поля `.spec.color` та `.spec.size` як доступні для вибору.

Збережіть CustomResourceDefinition у файл `shirt-resource-definition.yaml`:

{{% code_sample file="customresourcedefinition/shirt-resource-definition.yaml" %}}

Створіть CustomResourceDefinition:

```shell
kubectl apply -f shirt-resource-definition.yaml
```

Визначте деякі сорочки (Shirts), редагуючи файл `shirt-resources.yaml`; наприклад:

{{% code_sample file="customresourcedefinition/shirt-resources.yaml" %}}

Створіть власні ресурси:

```shell
kubectl apply -f shirt-resources.yaml
```

Отримайте всі ресурси:

```shell
kubectl get shirts.stable.example.com
```

Вивід буде:

```none
NAME       COLOR  SIZE
example1   blue   S
example2   blue   M
example3   green  M
```

Отримайте сорочки синього кольору (отримайте сорочки у яких `color` має значення `blue`):

```shell
kubectl get shirts.stable.example.com --field-selector spec.color=blue
```

Повинен зʼявитися такий вивід:

```none
NAME       COLOR  SIZE
example1   blue   S
example2   blue   M
```

Отримайте лише ресурси з кольором `green` та розміром `M`:

```shell
kubectl get shirts.stable.example.com --field-selector spec.color=green,spec.size=M
```

Повинен зʼявитися такий вивід:

```none
NAME       COLOR   SIZE
example3   green   M
```

### Субресурси {#subresources}

Власні ресурси підтримують субресурси `/status` та `/scale`.

Субресурси status та scale можна опціонально увімкнути, визначивши їх у CustomResourceDefinition.

#### Субресурс Status {#status-subresource}

Коли субресурс статусу увімкнено, субресурс `/status` для власного ресурсу буде доступним.

* Стани `status` та `spec` представлені відповідно за допомогою JSONPath `.status` та `.spec` всередині власного ресурсу.
* Запити `PUT` до субресурсу `/status` приймають обʼєкт власного ресурсу і ігнорують зміни до будь-чого, крім стану `status`.
* Запити `PUT` до субресурсу `/status` лише перевіряють стан `status` власного ресурсу.
* Запити `PUT`/`POST`/`PATCH` до власного ресурсу ігнорують зміни до стану `status`.
* Значення `.metadata.generation` збільшується для всіх змін, за винятком змін у `.metadata` або `.status`.
* У корені схеми валідації OpenAPI CRD дозволяються тільки такі конструкції:

  * `description`
  * `example`
  * `exclusiveMaximum`
  * `exclusiveMinimum`
  * `externalDocs`
  * `format`
  * `items`
  * `maximum`
  * `maxItems`
  * `maxLength`
  * `minimum`
  * `minItems`
  * `minLength`
  * `multipleOf`
  * `pattern`
  * `properties`
  * `required`
  * `title`
  * `type`
  * `uniqueItems`

#### Субресурс Scale {#scale-subresource}

Коли субресурс масштабу увімкнено, субресурс `/scale` для власного ресурсу буде доступним.
Обʼєкт `autoscaling/v1.Scale` надсилається як навантаження для `/scale`.

Для увімкнення субресурсу масштабу наступні поля визначаються в CustomResourceDefinition.

* `specReplicasPath` визначає JSONPath всередині власного ресурсу, що відповідає `scale.spec.replicas`.

  * Це обовʼязкове значення.
  * Дозволяються тільки JSONPath під `.spec` і з позначенням через крапку.
  * Якщо у власному ресурсі немає значення під `specReplicasPath`, субресурс `/scale` поверне помилку при GET запиті.

* `statusReplicasPath` визначає JSONPath всередині власного ресурсу, що відповідає `scale.status.replicas`.

  * Це обовʼязкове значення.
  * Дозволяються тільки JSONPath під `.status` і з позначенням через крапку.
  * Якщо у власному ресурсі немає значення під `statusReplicasPath`, значення репліки статусу у субресурсі `/scale` стандартно дорівнюватиме 0.

* `labelSelectorPath` визначає JSONPath всередині власного ресурсу, що відповідає
  `Scale.Status.Selector`.

  * Це необовʼязкове значення.
  * Воно повинно бути встановлено для роботи з HPA та VPA.
  * Дозволяються тільки JSONPath під `.status` або `.spec` і з позначенням через крапку.
  * Якщо у власному ресурсі немає значення під `labelSelectorPath`, значення селектора статусу у субресурсі `/scale` стандартно буде порожнім рядком.
  * Поле, на яке вказує цей JSONPath, повинно бути рядковим полем (не комплексним селектором), що містить серіалізований селектор міток у вигляді рядка.

У наступному прикладі увімкнено обидва субресурси: статусу та масштабу.

Збережіть CustomResourceDefinition у файл `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
                replicas:
                  type: integer
            status:
              type: object
              properties:
                replicas:
                  type: integer
                labelSelector:
                  type: string
      # subresources описує субресурси для власних ресурсів.
      subresources:
        # status увімкнення субресурсу статусу.
        status: {}
        # scale увімкнення субресурсу масштабу.
        scale:
          # specReplicasPath визначає JSONPath всередині власного ресурсу, що відповідає Scale.Spec.Replicas.
          specReplicasPath: .spec.replicas
          # statusReplicasPath визначає JSONPath всередині власного ресурсу, що відповідає Scale.Status.Replicas.
          statusReplicasPath: .status.replicas
          # labelSelectorPath визначає JSONPath всередині власного ресурсу, що відповідає Scale.Status.Selector.
          labelSelectorPath: .status.labelSelector
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
```

І створіть його:

```shell
kubectl apply -f resourcedefinition.yaml
```

Після створення обʼєкта CustomResourceDefinition, ви можете створювати власні обʼєкти.

Якщо ви збережете наступний YAML у файл `my-crontab.yaml`:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
  replicas: 3
```

і створите його:

```shell
kubectl apply -f my-crontab.yaml
```

Тоді будуть створені нові RESTful API точки доступу на рівні простору імен:

```none
/apis/stable.example.com/v1/namespaces/*/crontabs/status
```

та

```none
/apis/stable.example.com/v1/namespaces/*/crontabs/scale
```

Власний ресурс можна масштабувати за допомогою команди `kubectl scale`. Наприклад, наступна команда встановлює `.spec.replicas` власного ресурсу, створеного вище, до 5:

```shell
kubectl scale --replicas=5 crontabs/my-new-cron-object
crontabs "my-new-cron-object" scaled

kubectl get crontabs my-new-cron-object -o jsonpath='{.spec.replicas}'
5
```

Ви можете використовувати [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/), щоб захистити власні ресурси, які мають увімкнений субресурс масштабу.

### Категорії {#categories}

Категорії — це список групованих ресурсів, до яких належить власний ресурс (наприклад, `all`). Ви можете використовувати `kubectl get <category-name>`, щоб вивести список ресурсів, що належать до категорії.

Наступний приклад додає `all` у список категорій у CustomResourceDefinition та ілюструє, як вивести власний ресурс за допомогою `kubectl get all`.

Збережіть наступний CustomResourceDefinition у файл `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
                replicas:
                  type: integer
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
    # categories - це список групованих ресурсів, до яких належить власний ресурс.
    categories:
    - all
```

і створіть його:

```shell
kubectl apply -f resourcedefinition.yaml
```

Після створення обʼєкта CustomResourceDefinition, ви можете створювати власні обʼєкти.

Збережіть наступний YAML у файл

 `my-crontab.yaml`:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
```

і створіть його:

```shell
kubectl apply -f my-crontab.yaml
```

Ви можете вказати категорію при використанні `kubectl get`:

```shell
kubectl get all
```

і це включатиме власні ресурси типу `CronTab`:

```none
NAME                          AGE
crontabs/my-new-cron-object   3s
```

## {{% heading "whatsnext" %}}

* Прочитайте про [власні ресурси](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

* Дивіться [CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1-apiextensions-k8s-io).

* Обслуговуйте [кілька версій](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/) CustomResourceDefinition.
