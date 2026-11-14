---
title: Розширення API Kubernetes за допомогою CustomResourceDefinitions
content_type: task
min-kubernetes-server-version: 1.16
weight: 20
---

<!-- overview -->
Ця сторінка показує, як встановити [власний ресурс](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) у API Kubernetes, створивши [CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1-apiextensions-k8s-io).

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}} Якщо ви використовуєте старішу версію Kubernetes, яка все ще підтримується, використовуйте документацію для цієї версії, щоб отримати поради, які є відповідними для вашого кластера.

<!-- steps -->

## Створення CustomResourceDefinition {#create-a-customresourcedefinition}

Коли ви створюєте новий CustomResourceDefinition (CRD), API-сервер Kubernetes створює новий шлях ресурсу RESTful для кожної вказаної вами версії. Власний ресурс, створений з обʼєкта CRD, може бути або в просторі імен, або в області кластера, як вказано в полі `spec.scope` CRD. Як і з наявними вбудованими обʼєктами, видалення простору імен видаляє всі власні обʼєкти в цьому просторі імен. Самі CustomResourceDefinitions не належать до простору імен і доступні для всіх просторів імен.

Наприклад, якщо зберегти такий CustomResourceDefinition у `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # назва має збігатися з полями spec нижче й мати форму: <plural>.<group>
  name: crontabs.stable.example.com
spec:
  # назва групи для REST API: /apis/<group>/<version>
  group: stable.example.com
  # список версій, які підтримує цей CustomResourceDefinition
  versions:
    - name: v1
      # Кожну версію можна увімкнути або вимкнути прапорцем Served.
      served: true
      # Одна й лише одна версія має бути позначена як версія зберігання.
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
  # або Namespaced, або Cluster
  scope: Namespaced
  names:
    # назва в множині для URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # назва в однині для використання як псевдонім у CLI і для показу
    singular: crontab
    # kind — зазвичай тип в однині у CamelCase. Це використовують ваші маніфести ресурсів.
    kind: CronTab
    # shortNames дають змогу вказувати ресурс у CLI коротшим рядком
    shortNames:
    - ct
```

та створите його:

```shell
kubectl apply -f resourcedefinition.yaml
```

Тоді буде створено нову точку доступу RESTful API у просторі імен за адресою:

```
/apis/stable.example.com/v1/namespaces/*/crontabs/...
```

Цю URL-адресу точки доступу можна використовувати для створення власних обʼєктів і керування ними. `kind` цих обʼєктів буде `CronTab` зі специфікації обʼєкта CustomResourceDefinition, який ви створили вище.

Створення точки доступу може зайняти кілька секунд. Ви можете стежити, коли стан `Established` вашого CustomResourceDefinition стане true, або стежити за інформацією виявлення API-сервера, доки в ній не зʼявиться ваш ресурс.

## Створення власних обʼєктів {#create-custom-objects}

Після створення обʼєкта CustomResourceDefinition ви можете створювати власні обʼєкти. Власні обʼєкти можуть містити власні поля. Ці поля можуть містити довільний JSON. У наведеному нижче прикладі власні поля `cronSpec` і `image` встановлено у власному обʼєкті kind `CronTab`. Kind `CronTab` походить зі специфікації обʼєкта CustomResourceDefinition, який ви створили вище.

Якщо ви збережете такий YAML у `my-crontab.yaml`:

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

Потім ви можете керувати своїми обʼєктами CronTab за допомогою kubectl. Наприклад:

```shell
kubectl get crontab
```

Повинен вивести список, подібний до такого:

```none
NAME                 AGE
my-new-cron-object   6s
```

Під час використання kubectl назви ресурсів не чутливі до регістру, і ви можете використовувати як однину, так і множину, визначені в CRD, а також будь-які короткі назви.

Ви також можете переглянути необроблені дані YAML:

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

## Видалення CustomResourceDefinition {#delete-a-customresourcedefinition}

Коли ви видаляєте CustomResourceDefinition, сервер вилучає точку доступу RESTful API і видаляє всі збережені в ній власні обʼєкти.

```shell
kubectl delete -f resourcedefinition.yaml
kubectl get crontabs
```

```none
Error from server (NotFound): Unable to list {"stable.example.com" "v1" "crontabs"}: the server could not
find the requested resource (get crontabs.stable.example.com)
```

Якщо згодом ви знову створите той самий CustomResourceDefinition, він буде порожнім.

## Визначення структурної схеми {#specifying-a-structural-schema}

CustomResources зберігають структуровані дані у власних полях (поряд із вбудованими полями `apiVersion`, `kind` і `metadata`, які API-сервер перевіряє неявно). За допомогою [валідації OpenAPI v3.0](#validation) можна вказати схему, яка перевіряється під час створення та оновлень; подробиці й обмеження такої схеми дивіться нижче.

З `apiextensions.k8s.io/v1` визначення структурної схеми є обовʼязковим для CustomResourceDefinitions. У бета-версії CustomResourceDefinition структурна схема була необовʼязковою.

Структурна схема — це схема валідації [OpenAPI v3.0](#validation), яка:

1. вказує непорожній тип (за допомогою `type` в OpenAPI) для кореня, для кожного вказаного поля вузла обʼєкта (за допомогою `properties` або `additionalProperties` в OpenAPI) та для кожного елемента вузла масиву (за допомогою `items` в OpenAPI), за винятком:
   * вузла з `x-kubernetes-int-or-string: true`
   * вузла з `x-kubernetes-preserve-unknown-fields: true`
2. для кожного поля в обʼєкті та кожного елемента в масиві, вказаних усередині будь-якого з `allOf`, `anyOf`, `oneOf` або `not`, схема також вказує поле чи елемент поза цими логічними операторами (порівняйте приклади 1 і 2).
3. не встановлює `description`, `type`, `default`, `additionalProperties`, `nullable` всередині `allOf`, `anyOf`, `oneOf` або `not`, за винятком двох шаблонів для `x-kubernetes-int-or-string: true` (див. нижче).
4. якщо вказано `metadata`, то дозволяються обмеження тільки на `metadata.name` та `metadata.generateName`.

Неструктурний приклад 1:

```yaml
allOf:
- properties:
    foo:
      # ...
```

суперечить правилу 2. Правильним було б таке:

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

суперечить правилу 2. Правильним було б таке:

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

не є структурною схемою через такі порушення:

* тип у корені відсутній (правило 1).
* тип `foo` відсутній (правило 1).
* `bar` всередині `anyOf` не вказаний зовні (правило 2).
* `type` поля `bar` міститься в `anyOf` (правило 3).
* опис встановлено в `anyOf` (правило 3).
* `metadata.finalizers` не можна обмежувати (правило 4).

Натомість наведена нижче відповідна схема є структурною:

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

Порушення правил структурної схеми повідомляються в стані `NonStructural` у CustomResourceDefinition.

### Обрізання полів {#field-pruning}

CustomResourceDefinitions зберігають перевірені дані ресурсів у постійному сховищі кластера, {{< glossary_tooltip term_id="etcd" text="etcd">}}. Як і для вбудованих ресурсів Kubernetes, таких як {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}, якщо ви вказуєте поле, яке API-сервер не розпізнає, невідоме поле _обрізається_ (вилучається) перед збереженням.

CRD, конвертовані з `apiextensions.k8s.io/v1beta1` в `apiextensions.k8s.io/v1`, можуть не мати структурних схем, а `spec.preserveUnknownFields` може мати значення `true`.

Для застарілих обʼєктів CustomResourceDefinition, створених як `apiextensions.k8s.io/v1beta1` з `spec.preserveUnknownFields`, встановленим у `true`, також справедливо таке:

* Обрізання не ввімкнено.
* Ви можете зберігати довільні дані.

Для сумісності з `apiextensions.k8s.io/v1` оновіть визначення своїх власних
ресурсів:

1. Використовуйте структурну схему OpenAPI.
2. Встановіть `spec.preserveUnknownFields` в `false`.

Якщо ви збережете такий YAML у `my-crontab.yaml`:

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

Вивід подібний до такого:

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

У цьому прикладі вимкнено валідацію на боці клієнта, щоб показати поведінку API-сервера, додавши параметр командного рядка `--validate=false`. Оскільки [схеми валідації OpenAPI також публікуються](#publish-validation-schema-in-openapi) для клієнтів, `kubectl` також перевіряє невідомі поля й відхиляє такі обʼєкти задовго до того, як їх буде надіслано на API-сервер.

#### Керування обрізанням {#controlling-pruning}

Стандартно всі невказані поля власного ресурсу в усіх версіях обрізаються. Однак можна відмовитися від цього для певних піддерев полів, додавши `x-kubernetes-preserve-unknown-fields: true` у [структурну схему валідації OpenAPI v3](#specifying-a-structural-schema).

Наприклад:

```yaml
type: object
properties:
  json:
    x-kubernetes-preserve-unknown-fields: true
```

Поле `json` може зберігати будь-яке значення JSON без обрізання.

Ви також можете частково вказати допустимий JSON; наприклад:

```yaml
type: object
properties:
  json:
    x-kubernetes-preserve-unknown-fields: true
    type: object
    description: this is arbitrary JSON
```

Так дозволено лише значення типу `object`.

Обрізання знову ввімкнено для кожної вказаної властивості (або `additionalProperties`):

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

Тоді значення:

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

Вузли в схемі з `x-kubernetes-int-or-string: true` виключаються з правила 1, тож така схема є структурною:

```yaml
type: object
properties:
  foo:
    x-kubernetes-int-or-string: true
```

Також ці вузли частково виключаються з правила 3 у тому сенсі, що дозволено такі два шаблони (саме ці, без варіацій в порядку або додаткових полів):

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

З будь-якою з цих специфікацій валідацію проходять і ціле число, і рядок.

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

Оскільки поруч вказано `x-kubernetes-preserve-unknown-fields: true`, нічого не обрізається. Однак використання `x-kubernetes-preserve-unknown-fields: true` необовʼязкове.

З `x-kubernetes-embedded-resource: true` поля `apiVersion`, `kind` і `metadata` неявно задаються та перевіряються на валідність.

## Обслуговування кількох версій CRD {#serving-multiple-versions-of-a-crd}

Докладніше про обслуговування кількох версій вашого CustomResourceDefinition і міграцію обʼєктів з однієї версії на іншу дивіться в розділі [Версії у CustomResourceDefinitions](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/).

<!-- discussion -->

## Розширені теми {#advanced-topics}

### Завершувачі {#finalizers}

_Завершувачі_ дають змогу контролерам реалізовувати асинхронні хуки перед видаленням. Власні обʼєкти підтримують завершувачі так само, як вбудовані обʼєкти.

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

Власні ресурси перевіряються за допомогою [схем OpenAPI v3.0](https://github.com/OAI/OpenAPI-Specification/blob/3.0.0/versions/3.0.0.md#schema-object), за допомогою x-kubernetes-validations, коли ввімкнено [можливість Validation Rules](#validation-rules), а додаткову валідацію можна додати за допомогою [вебхуків допуску](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook).

Крім того, до схеми застосовуються такі обмеження:

- Ці поля не можна встановлювати:

  - `definitions`,
  - `dependencies`,
  - `deprecated`,
  - `discriminator`,
  - `id`,
  - `patternProperties`,
  - `readOnly`,
  - `writeOnly`,
  - `xml`,
  - `$ref`.

- Поле `uniqueItems` не можна встановлювати в `true`.
- Поле `additionalProperties` не можна встановлювати в `false`.
- Поле `additionalProperties` є взаємовиключним із `properties`.

Розширення `x-kubernetes-validations` можна використовувати для валідації власних ресурсів за допомогою виразів [Common Expression Language (CEL)](https://github.com/google/cel-spec), коли ввімкнено можливість [Validation rules](#validation-rules), а схема CustomResourceDefinition є [структурною схемою](#specifying-a-structural-schema).

Інші обмеження та можливості CustomResourceDefinition дивіться в розділі [Структурні схеми](#specifying-a-structural-schema).

Схема визначається у CustomResourceDefinition. У наведеному нижче прикладі CustomResourceDefinition застосовує такі перевірки до власного обʼєкта:

- `spec.cronSpec` повинен бути рядком і відповідати формі, описаній регулярним виразом.
- `spec.replicas` повинен бути цілим числом і мати мінімальне значення 1 та максимальне значення 10.

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
        # openAPIV3Schema — це схема для валідації власних обʼєктів.
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                  pattern: '^(\d+|\*)(/\d+)?(\s+(\d+|\*)(/\d+)?){4}$'
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

- `spec.cronSpec` не відповідає регулярному виразу.
- `spec.replicas` більше 10.

Якщо ви збережете такий YAML у файл `my-crontab.yaml`:

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
spec.cronSpec in body should match '^(\d+|\*)(/\d+)?(\s+(\d+|\*)(/\d+)?){4}$'
spec.replicas in body should be less than or equal to 10
```

Якщо поля містять дійсні значення, запит на створення обʼєкта буде прийнято.

Збережіть такий YAML у файл `my-crontab.yaml`:

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

### Ratcheting валідації {#validation-ratcheting}

{{< feature-state feature_gate_name="CRDValidationRatcheting" >}}

Якщо ви використовуєте версію Kubernetes, старішу за v1.30, вам потрібно явно ввімкнути функціональну можливість [`CRDValidationRatcheting`](/docs/reference/command-line-tools-reference/feature-gates/#CRDValidationRatcheting), щоб використовувати цю поведінку, яка потім застосовується до всіх CustomResourceDefinitions у вашому кластері.

Якщо функціональну можливість увімкнено, Kubernetes реалізує _ratcheting валідації_ для CustomResourceDefinitions. API-сервер приймає оновлення ресурсів, які після оновлення недійсні, за умови, що кожну частину ресурсу, яка не пройшла валідацію, не було змінено операцією оновлення. Іншими словами, будь-яка недійсна частина ресурсу, що залишається недійсною, мала бути неправильною вже раніше. Цей механізм не можна використовувати, щоб оновити дійсний ресурс так, щоб він став недійсним.

Ця можливість дає змогу авторам CRD впевнено додавати нові перевірки до схеми OpenAPIV3 за певних умов. Користувачі можуть безпечно оновитися до нової схеми без підвищення версії обʼєкта чи порушення робочих процесів.

Хоча більшість перевірок у схемі OpenAPIV3 CRD підтримують ratcheting, є кілька винятків. Наведені нижче перевірки схеми OpenAPIV3 не підтримують ratcheting у реалізації Kubernetes {{< skew currentVersion >}} і в разі порушення, як і раніше, призводитимуть до помилки:

- Квантори
  - `allOf`
  - `oneOf`
  - `anyOf`
  - `not`
  - будь-які перевірки в нащадках одного з цих полів
- `x-kubernetes-validations` У Kubernetes 1.28 [правила валідації](#validation-rules) CRD ігноруються механізмом ratcheting. Починаючи з Alpha 2 у Kubernetes 1.29, до `x-kubernetes-validations` застосовується ratcheting, лише якщо вони не посилаються на `oldSelf`.

  До правил переходу ratcheting ніколи не застосовується: автоматично ratcheting застосовується лише до помилок правил, які не використовують `oldSelf`, якщо їхні значення не змінилися.

  Щоб написати власну логіку ratcheting для виразів CEL, дивіться [optionalOldSelf](#field-optional-oldself).
- `x-kubernetes-list-type` До помилок, спричинених зміною типу списку в підсхемі, ratcheting не застосовується. Наприклад, додавання `set` до списку з дублікатами завжди призводитиме до помилки.
- `x-kubernetes-list-map-keys` До помилок, спричинених зміною ключів map у схемі списку, ratcheting не застосовується.
- `required` До помилок, спричинених зміною списку обовʼязкових полів, ratcheting не застосовується.
- `properties` До додавання, вилучення чи зміни назв властивостей ratcheting не застосовується, але до змін перевірок у схемах і підсхемах кожної властивості ratcheting може застосовуватися, якщо назва властивості не змінюється.
- `additionalProperties` До вилучення раніше вказаної валідації `additionalProperties` ratcheting не застосовується.
- `metadata` До помилок вбудованої валідації `metadata` обʼєкта в Kubernetes ratcheting не застосовується (наприклад, назва обʼєкта або символи у значенні мітки). Якщо ви вказуєте власні додаткові правила для метаданих власного ресурсу, до цієї додаткової валідації ratcheting застосовуватиметься.

### Правила валідації {#validation-rules}

{{< feature-state state="stable" for_k8s_version="v1.29" >}}

Правила валідації використовують [Common Expression Language (CEL)](https://github.com/google/cel-spec) для валідації значень власних ресурсів. Правила валідації включаються в схеми CustomResourceDefinition за допомогою розширення `x-kubernetes-validations`.

Правило обмежене місцем розташування розширення `x-kubernetes-validations` у схемі. Змінна `self` у виразі CEL привʼязана до значення в цій області.

Усі правила валідації обмежені поточним обʼєктом: правила валідації між обʼєктами або зі збереженням стану не підтримуються.

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

```
The CronTab "my-new-cron-object" is invalid:
* spec: Invalid value: map[string]interface {}{"maxReplicas":10, "minReplicas":0, "replicas":20}: replicas should be smaller than or equal to maxReplicas.
```

`x-kubernetes-validations` може містити кілька правил. `rule` у `x-kubernetes-validations` — це вираз, який обчислює CEL. `message` — це повідомлення, що показується, коли валідація не проходить. Якщо повідомлення не задано, наведена вище відповідь була б такою:

```
The CronTab "my-new-cron-object" is invalid:
* spec: Invalid value: map[string]interface {}{"maxReplicas":10, "minReplicas":0, "replicas":20}: failed rule: self.replicas <= self.maxReplicas
```

{{< note >}}
Ви можете швидко перевірити вирази CEL на [CEL Playground](https://playcel.undistro.io).
{{< /note >}}

Правила валідації компілюються під час створення або оновлення CRD. Запит на створення чи оновлення CRD завершиться збоєм, якщо компіляція правил валідації не вдасться. Процес компіляції також включає перевірку типів.

Помилки компіляції:

- `no_matching_overload`: ця функція не має перевантаження для типів аргументів.

  Наприклад, правило `self == true` для поля типу integer призведе до помилки:

  ```none
  Invalid value: apiextensions.ValidationRule{Rule:"self == true", Message:""}: compilation failed: ERROR: \<input>:1:6: found no matching overload for '_==_' applied to '(int, bool)'
  ```

- `no_such_field`: не містить бажаного поля.

  Наприклад, правило `self.nonExistingField > 0` для ненаявного поля поверне таку помилку:

  ```none
  Invalid value: apiextensions.ValidationRule{Rule:"self.nonExistingField > 0", Message:""}: compilation failed: ERROR: \<input>:1:5: undefined field 'nonExistingField'
  ```

- `invalid argument`: недійсний аргумент для макросів.

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

Див. також: [Supported evaluation on CEL](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#evaluation)

- Якщо правило обмежене коренем ресурсу, воно може вибирати поля з будь-яких полів, оголошених у схемі OpenAPIv3 CRD, а також `apiVersion`, `kind`, `metadata.name` та `metadata.generateName`. Це включає вибір полів як у `spec`, так і в `status` в одному виразі:

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

- Якщо правило обмежене обʼєктом з властивостями, доступні властивості обʼєкта можна вибирати за допомогою `self.field`, а наявність поля можна перевірити за допомогою `has(self.field)`. Поля зі значенням null трактуються як відсутні поля у виразах CEL.

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
            # ...
            foo:
              type: integer
  ```

- Якщо правило обмежене обʼєктом з додатковими властивостями (тобто map), значення map доступні через `self[mapKey]`, наявність ключа в map можна перевірити за допомогою `mapKey in self`, а всі записи з map доступні за допомогою макросів і функцій CEL, таких як `self.all(...)`.

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
            # ...
            type: object
            properties:
              foo:
                type: integer
  ```

- Якщо правило обмежене масивом, елементи масиву доступні через `self[i]` та також за допомогою макросів і функцій.

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

- Якщо правило обмежене скаляром, `self` привʼязується до значення скаляра.

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

Невідомі дані, збережені у власних ресурсах за допомогою `x-kubernetes-preserve-unknown-fields`, не доступні у виразах CEL. Це включає:

- Невідомі значення полів, які зберігаються у схемах обʼєктів з `x-kubernetes-preserve-unknown-fields`.
- Властивості обʼєктів, де схема властивостей має "unknown type". "Unknown type" визначається рекурсивно як:

  - Схема без типу і з `x-kubernetes-preserve-unknown-fields`, встановленим у true
  - Масив, де схема елементів має "unknown type"
  - Обʼєкт, де схема additionalProperties має "unknown type"

Доступні лише назви властивостей вигляду `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*`. Під час доступу у виразі доступні назви властивостей екрануються за такими правилами:

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

- `set`: `X + Y` виконує обʼєднання, де зберігаються позиції елементів у `X`, а непересічні елементи у `Y` додаються, зберігаючи їх частковий порядок.

- `map`: `X + Y` виконує злиття, де зберігаються позиції всіх ключів у `X`, але значення перезаписуються значеннями у `Y`, коли ключі `X` та `Y` перетинаються. Елементи у `Y` з непересічними ключами додаються, зберігаючи їх частковий порядок.

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

Див. також: [CEL types](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#values), [OpenAPI types](https://swagger.io/specification/#data-types), [Структурні схеми Kubernetes](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema).

#### Поле messageExpression {#the-messageexpression-field}

Подібно до поля `message`, яке визначає рядок, що повідомляється в разі невдачі правила валідації, `messageExpression` дає змогу використовувати вираз CEL для побудови рядка повідомлення. Так у повідомлення про невдачу валідації можна вставити описовішу інформацію. `messageExpression` має обчислюватися в рядок і може використовувати ті самі змінні, що й поле `rule`. Наприклад:

```yaml
x-kubernetes-validations:
- rule: "self.x <= self.maxLimit"
  messageExpression: '"x exceeded max limit of " + string(self.maxLimit)'
```

Майте на увазі, що конкатенація рядків CEL (оператор `+`) автоматично не призводить до перетворення в рядок. Якщо у вас є скаляр, який не є рядком, використовуйте функцію `string(<value>)` для перетворення скаляра в рядок, як показано в прикладі вище.

`messageExpression` має обчислюватися в рядок, і це перевіряється під час запису CRD. Зверніть увагу, що для одного правила можна задати і `message`, і `messageExpression`; якщо присутні обидва, використовується `messageExpression`. Однак якщо обчислення `messageExpression` завершується помилкою, натомість використовується рядок, визначений у `message`, а помилка `messageExpression` записується в лог. Таке повернення до `message` відбувається також, якщо вираз CEL у `messageExpression` повертає порожній рядок або рядок із розривами рядка.

Якщо одна з вищезазначених умов виконується і `message` не було встановлено, то буде використовуватися стандартне повідомлення про негативний результат валідації.

`messageExpression` — це вираз CEL, тож до нього застосовуються обмеження, наведені в розділі [Використання ресурсів функціями валідації](#resource-use-by-validation-functions). Якщо обчислення зупиняється через обмеження ресурсів під час виконання `messageExpression`, подальші правила валідації не виконуються.

Встановлення `messageExpression` є необовʼязковим.

#### Поле `message` {#field-message}

Якщо ви хочете встановити статичне повідомлення, ви можете передати `message` замість `messageExpression`. Значення `message` використовується як непрозорий рядок помилки, якщо перевірка не пройшла успішно.

Встановлення `message` є необовʼязковим.

#### Поле `reason` {#field-reason}

Ви можете додати машиночитану причину невдачі валідації в межах `validation`, яка повертатиметься щоразу, коли запит не проходить це правило валідації.

Наприклад:

```yaml
x-kubernetes-validations:
- rule: "self.x <= self.maxLimit"
  reason: "FieldValueInvalid"
```

Код статусу HTTP, повернутий клієнту, відповідатиме причині першого правила валідації, що не пройшло. Наразі підтримуються такі причини: "FieldValueInvalid", "FieldValueForbidden", "FieldValueRequired", "FieldValueDuplicate". Якщо причину не задано або вона невідома, стандартно використовується "FieldValueInvalid".

Встановлення `reason` є необовʼязковим.

#### Поле `fieldPath` {#field-field-path}

Ви можете вказати шлях поля, який повертається, коли перевірка завершується негативним результатом.

Наприклад:

```yaml
x-kubernetes-validations:
- rule: "self.foo.test.x <= self.maxLimit"
  fieldPath: ".foo.test.x"
```

У наведеному вище прикладі валідація перевіряє, що значення поля `x` менше за значення `maxLimit`. Якщо `fieldPath` не вказано, у разі невдачі валідації fieldPath стандартно вказуватиме на область `self`. Якщо `fieldPath` вказано, повернена помилка матиме `fieldPath`, що коректно вказує на розташування поля `x`.

Значення `fieldPath` повинно бути відносним шляхом JSON, що обмежений місцем цього розширення x-kubernetes-validations у схемі. Крім того, воно повинно посилатися на наявне поле в межах схеми. Наприклад, коли перевірка перевіряє, чи є певний атрибут `foo` у map `testMap`, ви можете встановити `fieldPath` на `".testMap.foo"` або `.testMap['foo']'`. Якщо для перевірки потрібно перевірити унікальні атрибути у двох списках, `fieldPath` можна встановити для будь-якого зі списків. Наприклад, його можна встановити на `.testList1` або `.testList2`. Наразі підтримується дочірня операція для посилання на наявне поле. Для отримання додаткової інформації дивіться [Підтримка JSONPath у Kubernetes](/docs/reference/kubectl/jsonpath/). Поле `fieldPath` не підтримує індексування масивів числовими значеннями.

Встановлення `fieldPath` є необовʼязковим.

#### Поле `optionalOldSelf` {#field-optional-oldself}

{{< feature-state feature_gate_name="CRDValidationRatcheting" >}}

Якщо у вашому кластері не ввімкнено [ratcheting валідації CRD](#validation-ratcheting), API CustomResourceDefinition не містить цього поля, і спроба встановити його може призвести до помилки.

Поле `optionalOldSelf` є булевим полем, яке змінює поведінку [Правил переходу](#transition-rules), описаних нижче. Зазвичай правило переходу не оцінюється, якщо `oldSelf` не може бути визначено: під час створення обʼєкта або коли нове значення вводиться під час оновлення.

Якщо `optionalOldSelf` встановлено в true, тоді правила переходу завжди будуть оцінюватися, і тип `oldSelf` буде змінено на тип CEL [`Optional`](https://pkg.go.dev/github.com/google/cel-go/cel#OptionalTypes).

`optionalOldSelf` корисне, коли авторам схеми потрібен інструмент з більшим контролем, [ніж надає стандартна поведінка на основі рівності](#validation-ratcheting), щоб запровадити новіші, зазвичай суворіші обмеження для нових значень, водночас дозволяючи старим значенням проходити за старою валідацією (grandfathered) або з ratcheting.

Example Usage:

| CEL                                     | Опис |
|-----------------------------------------|-------------|
| <code>self.foo == "foo" &#124;&#124; (oldSelf.hasValue() && oldSelf.value().foo != "foo")</code> | Правило з ratcheting. Щойно значення встановлено в "foo", воно має залишатися foo. Але якщо воно існувало до запровадження обмеження "foo", воно може мати будь-яке значення |
| <code>[oldSelf.orValue(""), self].all(x, ["OldCase1", "OldCase2"].exists(case, x == case)) &#124;&#124; ["NewCase1", "NewCase2"].exists(case, self == case) &#124;&#124; ["NewCase"].has(self)</code> | "Ratcheting валідації для вилучених варіантів enum, якщо oldSelf їх використовував" |
| <code>oldSelf.optMap(o, o.size()).orValue(0) < 4 &#124;&#124; self.size() >= 4</code> | Ratcheting валідації нещодавно збільшеного мінімального розміру map або списку |

#### Функції перевірки {#available-validation-functions}

Доступні функції включають:

- Стандартні функції CEL, визначені у [списку стандартних визначень](https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#list-of-standard-definitions)
- Стандартні [макроси CEL](https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#macros)
- [Розширена бібліотека рядкових функцій](https://pkg.go.dev/github.com/google/cel-go@v0.11.2/ext#Strings) CEL
- [Бібліотека розширень CEL](https://pkg.go.dev/k8s.io/apiextensions-apiserver@v0.24.0/pkg/apiserver/schema/cel/library#pkg-functions) Kubernetes

#### Правила переходу {#transition-rules}

Правило, що містить вираз з посиланням на ідентифікатор `oldSelf`, неявно вважається _правилом переходу_. Правила переходу дають змогу авторам схеми запобігати певним переходам між двома станами, кожен з яких окремо допустимий. Наприклад:

```yaml
type: string
enum: ["low", "medium", "high"]
x-kubernetes-validations:
- rule: "!(self == 'high' && oldSelf == 'low') && !(self == 'low' && oldSelf == 'high')"
  message: cannot transition directly between 'low' and 'high'
```

На відміну від інших правил, правила переходу застосовуються тільки до операцій, що відповідають таким критеріям:

- Операція оновлює наявний обʼєкт. Правила переходу ніколи не застосовуються до операцій створення.

- Існують як старе, так і нове значення. Залишається можливим перевірити, чи було додано або вилучено значення, розмістивши правило переходу на батьківському вузлі. Правила переходу ніколи не застосовуються до створення власних ресурсів. Якщо вони розміщені в необовʼязковому полі, правило переходу не буде застосовуватися до операцій оновлення, які встановлюють або прибирають поле.

- Шлях до вузла схеми, який перевіряє правило переходу, має вказувати на вузол, який можна зіставити між старим і новим обʼєктом. Наприклад, елементи списку та їхні нащадки (`spec.foo[10].bar`) не обовʼязково можна зіставити між наявним обʼєктом і пізнішим оновленням того самого обʼєкта.

Під час запису CRD генеруватимуться помилки, якщо вузол схеми містить правило переходу, яке ніколи не можна застосувати, наприклад "oldSelf cannot be used on the uncorrelatable portion of the schema within *path*".

Правила переходу дозволені лише для _зіставних частин_ схеми. Частина схеми є зіставною, якщо всі батьківські схеми `array` мають тип `x-kubernetes-list-type=map`; будь-які батьківські схеми масиву `set` або `atomic` унеможливлюють однозначне зіставлення `self` з `oldSelf`.

Нижче наведено кілька прикладів правил переходу:

{{< table caption="Приклади правил переходу" >}}
| Використання                                          | Правило
| --------                                              | --------
| Незмінність                                           | `self.foo == oldSelf.foo`
| Запобігання модифікації/видаленню після присвоєння    | `oldSelf != 'bar' \|\| self == 'bar'` або `!has(oldSelf.field) \|\| has(self.field)`
| Тільки додавання до множини                           | `self.all(element, element in oldSelf)`
| Якщо попереднє значення було X, нове значення може бути лише A або B, не Y або Z | `oldSelf != 'X' \|\| self in ['A', 'B']`
| Монотонні (незменшувані) лічильники                   | `self >= oldSelf`
{{< /table >}}

#### Використання ресурсів функціями перевірки {#resource-use-by-validation-functions}

Коли ви створюєте або оновлюєте CustomResourceDefinition, що використовує правила валідації, API-сервер перевіряє ймовірний вплив виконання цих правил. Якщо виконання правила оцінюється як надмірно витратне, API-сервер відхиляє операцію створення чи оновлення та повертає повідомлення про помилку. Під час виконання використовується подібна система, яка спостерігає за діями інтерпретатора. Якщо інтерпретатор виконує забагато інструкцій, виконання правила зупиняється й виникає помилка. Кожному CustomResourceDefinition також дозволено певний обсяг ресурсів для завершення виконання всіх його правил валідації. Якщо під час створення сумарна оцінка його правил перевищує це обмеження, також виникне помилка валідації.

Навряд чи у вас виникнуть проблеми з бюджетом ресурсів для валідації, якщо ви вказуєте лише правила, які завжди виконуються за однаковий час незалежно від розміру вхідних даних. Наприклад, правило `self.foo == 1` саме по собі не має ризику відхилення через бюджет ресурсів валідації. Але якщо `foo` — рядок і ви визначаєте правило валідації `self.foo.contains("someString")`, виконання цього правила триває довше залежно від довжини `foo`. Інший приклад — якщо `foo` є масивом і ви вказали правило валідації `self.foo.all(x, x > 5)`. Система оцінки вартості завжди припускає найгірший сценарій, якщо обмеження довжини `foo` не задано, і це стосується всього, що можна ітерувати (списки, map тощо).

Тому рекомендовано задавати обмеження через `maxItems`, `maxProperties` і `maxLength` для всього, що обробляється в правилі валідації, щоб уникнути помилок валідації під час оцінки вартості. Наприклад, для такої схеми з одним правилом:

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

API-сервер відхилить це правило через бюджет валідації з помилкою:

```
spec.validation.openAPIV3Schema.properties[spec].properties[foo].x-kubernetes-validations[0].rule: Forbidden:
CEL rule exceeded budget by more than 100x (try simplifying the rule, or adding maxItems, maxProperties, and
maxLength where arrays, maps, and strings are used)
```

Відхилення відбувається тому, що `self.all` передбачає виклик `contains()` для кожного рядка у `foo`, що в свою чергу перевіряє, чи містить даний рядок `'a string'`. Без обмежень, це дуже витратне правило.

Якщо ви не вкажете жодного обмеження для валідації, оцінена вартість цього правила перевищить обмеження вартості на одне правило. Але якщо додати обмеження в потрібних місцях, правило буде дозволено:

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

Система оцінки вартості враховує, скільки разів правило буде виконано, на додачу до оціненої вартості самого правила. Наприклад, таке правило матиме ту саму оцінену вартість, що й у попередньому прикладі (хоча тепер правило визначено для окремих елементів масиву):

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

Якщо у списку всередині іншого списку є правило перевірки, яке використовує `self.all`, це значно дорожче, ніж правило для не вкладеного списку. Правило, яке було б дозволено для не вкладеного списку, може потребувати нижчих обмежень для обох вкладених списків, щоб бути дозволеним. Наприклад, навіть без встановлення обмежень, таке правило дозволено:

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

Але те саме правило для такої схеми (з доданим вкладеним масивом) викликає помилку перевірки:

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

### Встановлення стандартних значень {#defaulting}

{{< note >}}
Щоб використовувати встановлення стандартних значень, ваш CustomResourceDefinition повинен використовувати версію API `apiextensions.k8s.io/v1`.
{{< /note >}}

Встановлення стандартних значень дає змогу вказувати стандартні значення у [схемі валідації OpenAPI v3](#validation):

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
        # openAPIV3Schema — це схема для валідації власних обʼєктів.
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                  pattern: '^(\d+|\*)(/\d+)?(\s+(\d+|\*)(/\d+)?){4}$'
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

призводить до

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

* в запиті до API-сервера з використанням стандартних значень версії запиту,
* під час читання з etcd з використанням стандартних значень версії зберігання,
* після втулків mutating admission з непорожніми патчами, з використанням стандартних значень версії обʼєкта вебхука допуску.

Стандартні значення, застосовані під час читання даних з etcd, не записуються автоматично назад в etcd. Щоб зберегти ці стандартні значення в etcd, потрібен запит на оновлення через API.

Стандартні значення для полів, що не є листовими, мають бути обрізані (за винятком стандартних значень для полів `metadata`) і мають проходити валідацію за наданою схемою. Наприклад, у наведеному вище прикладі стандартне значення `{"replicas": "foo", "badger": 1}` для поля `spec` було б недійсним, оскільки `badger` — невідоме поле, а `replicas` не є рядком.

Стандартні значення для полів `metadata` вузлів `x-kubernetes-embedded-resources: true` (або частин стандартного значення, що охоплюють `metadata`) не обрізаються під час створення CustomResourceDefinition, а обрізаються на кроці обрізання під час обробки запитів.

#### Встановлення стандартних значень і nullable {#defaulting-and-nullable}

Значення null для полів, які або не вказують прапорець nullable, або задають йому значення `false`, обрізаються до встановлення стандартних значень. Якщо є стандартне значення, його буде застосовано. Коли nullable дорівнює `true`, значення null зберігаються й не замінюються стандартними.

Наприклад, розгляньмо таку схему OpenAPI:

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

де `foo` обрізано й отримує стандартне значення, оскільки поле не допускає null, `bar` зберігає значення null через `nullable: true`, а `baz` обрізано, оскільки поле не допускає null і не має стандартного значення.

### Публікація схеми валідації в OpenAPI {#publish-validation-schema-in-openapi}

[Схеми валідації OpenAPI v3](#validation) CustomResourceDefinition, які є [структурними](#specifying-a-structural-schema) та [дозволяють обрізання](#field-pruning), публікуються API-сервером Kubernetes як [OpenAPI v3](/docs/concepts/overview/kubernetes-api/#openapi-and-swagger-definitions) та OpenAPI v2. Рекомендовано використовувати документ OpenAPI v3, оскільки він подає схему валідації OpenAPI v3 для CustomResourceDefinition без втрат, тоді як OpenAPI v2 — це перетворення з втратами.

Інструмент командного рядка [kubectl](/docs/reference/kubectl/) використовує опубліковану схему для валідації на боці клієнта (`kubectl create` і `kubectl apply`) та пояснення схеми (`kubectl explain`) для власних ресурсів. Опубліковану схему також можна використовувати для інших цілей, наприклад для генерування клієнтів або документації.

#### Сумісність з OpenAPI V2 {#compatibility-with-openapi-v2}

Для сумісності з OpenAPI V2, схема валідації OpenAPI v3 виконує перетворення з втратами в схему OpenAPI v2. Схема зʼявляється в полях `definitions` та `paths` у [специфікації OpenAPI v2](/docs/concepts/overview/kubernetes-api/#openapi-and-swagger-definitions).

Під час перетворення застосовуються такі зміни для збереження зворотної сумісності з kubectl версії 1.13. Ці зміни запобігають занадто строгій роботі kubectl та відхиленню дійсних схем OpenAPI, які він не розуміє. Перетворення не змінює схему валідації, визначену в CRD, і тому не впливає на [валідацію](#validation) на API-сервері.

1. Наведені нижче поля вилучаються, оскільки OpenAPI v2 їх не підтримує.

   - Поля `allOf`, `anyOf`, `oneOf` та `not` видаляються

2. Якщо встановлено `nullable: true`, ми видаляємо `type`, `nullable`, `items` та `properties`, оскільки OpenAPI v2 не може відобразити nullable. Це необхідно для того, щоб kubectl не відхиляв правильні обʼєкти.

### Додаткові стовпці виводу {#additional-printer-columns}

Інструмент kubectl покладається на форматування виводу на боці сервера. API-сервер вашого кластера вирішує, які стовпці показує команда `kubectl get`. Ви можете налаштувати ці стовпці для CustomResourceDefinition. У наведеному нижче прикладі додаються стовпці `Spec`, `Replicas` і `Age`.

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

Зверніть увагу на стовпці `NAME`, `SPEC`, `REPLICAS` і `AGE` у виводі:

```
NAME                 SPEC        REPLICAS   AGE
my-new-cron-object   * * * * *   1          7s
```

{{< note >}}
Стовпець `NAME` неявний, і його не потрібно визначати в CustomResourceDefinition.
{{< /note >}}

#### Пріоритет {#priority}

Кожен стовпець має поле `priority`. Наразі пріоритет розрізняє стовпці, показані у стандартному поданні або в розширеному поданні (з прапорцем `-o wide`).

- Стовпці з пріоритетом `0` показуються у стандартному поданні.
- Стовпці з пріоритетом, більшим за `0`, показуються лише в розширеному поданні.

#### Тип {#type}

Поле `type` стовпця може мати одне з таких значень (порівняйте з [OpenAPI v3 data types](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#dataTypes)):

- `integer` — числа не з рухомою комою
- `number` — числа з рухомою комою
- `string` — рядки
- `boolean` — `true` або `false`
- `date` — показується як час, що минув від цієї позначки часу.

Якщо значення всередині CustomResource не відповідає типу, вказаному для стовпця, значення пропускається. Використовуйте валідацію CustomResource, щоб переконатися, що типи значень правильні.

#### Формат {#format}

Поле `format` стовпця може мати одне з таких значень:

- `int32`
- `int64`
- `float`
- `double`
- `byte`
- `date`
- `date-time`
- `password`

Поле `format` стовпця визначає стиль, який `kubectl` використовує під час виведення значення.

### Селектори полів {#field-selectors}

[Селектори полів](/docs/concepts/overview/working-with-objects/field-selectors/) дозволяють клієнтам вибирати власні ресурси на основі значення одного або кількох полів ресурсу.

Усі власні ресурси підтримують селектори полів `metadata.name` і `metadata.namespace`.

Поля, оголошені в {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}, також можуть бути використані з селектором полів, коли вони включені в поле `spec.versions[*].selectableFields` {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}.

#### Поля власних ресурсів, доступні для вибору {#crd-selectable-fields}

{{< feature-state feature_gate_name="CustomResourceFieldSelectors" >}}

Поле `spec.versions[*].selectableFields` у {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} можна використовувати, щоб оголосити, які інші поля власного ресурсу можна використовувати в селекторах полів, за допомогою функціональної можливості [`CustomResourceFieldSelectors`](/docs/reference/command-line-tools-reference/feature-gates/#CustomResourceFieldSelectors) (ця можливість стандартно ввімкнена з Kubernetes v1.31). У наведеному нижче прикладі поля `.spec.color` і `.spec.size` додаються як поля, доступні для вибору.

Збережіть CustomResourceDefinition у файл `shirt-resource-definition.yaml`:

{{% code_sample file="customresourcedefinition/shirt-resource-definition.yaml" %}}

Створіть CustomResourceDefinition:

```shell
kubectl apply -f https://k8s.io/examples/customresourcedefinition/shirt-resource-definition.yaml
```

Визначте деякі сорочки (Shirts), редагуючи файл `shirt-resources.yaml`; наприклад:

{{% code_sample file="customresourcedefinition/shirt-resources.yaml" %}}

Створіть власні ресурси:

```shell
kubectl apply -f https://k8s.io/examples/customresourcedefinition/shirt-resources.yaml
```

Отримайте всі ресурси:

```shell
kubectl get shirts.stable.example.com
```

Вивід:

```
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

```
NAME       COLOR  SIZE
example1   blue   S
example2   blue   M
```

Отримайте лише ресурси з кольором `green` та розміром `M`:

```shell
kubectl get shirts.stable.example.com --field-selector spec.color=green,spec.size=M
```

Повинен зʼявитися такий вивід:

```
NAME       COLOR   SIZE
example3   green   M
```

### Субресурси {#subresources}

Власні ресурси підтримують субресурси `/status` та `/scale`.

Субресурси status і scale можна за потреби ввімкнути, визначивши їх у CustomResourceDefinition.

#### Субресурс Status {#status-subresource}

Коли субресурс status увімкнено, для власного ресурсу відкривається доступ до субресурсу `/status`.

- Розділи status і spec подаються всередині власного ресурсу JSONPath `.status` і `.spec` відповідно.
- Запити `PUT` до субресурсу `/status` приймають обʼєкт власного ресурсу та ігнорують зміни будь-чого, крім розділу status.
- Запити `PUT` до субресурсу `/status` перевіряють лише розділ status власного ресурсу.
- Запити `PUT`/`POST`/`PATCH` до власного ресурсу ігнорують зміни розділу status.
- Значення `.metadata.generation` збільшується для всіх змін, за винятком змін у `.metadata` або `.status`.
- У корені схеми валідації OpenAPI CRD дозволяються тільки такі конструкції:

  - `description`
  - `example`
  - `exclusiveMaximum`
  - `exclusiveMinimum`
  - `externalDocs`
  - `format`
  - `items`
  - `maximum`
  - `maxItems`
  - `maxLength`
  - `minimum`
  - `minItems`
  - `minLength`
  - `multipleOf`
  - `pattern`
  - `properties`
  - `required`
  - `title`
  - `type`
  - `uniqueItems`

#### Субресурс Scale {#scale-subresource}

Коли субресурс scale увімкнено, для власного ресурсу відкривається доступ до субресурсу `/scale`. Обʼєкт `autoscaling/v1.Scale` надсилається як вміст для `/scale`.

Щоб увімкнути субресурс scale, у CustomResourceDefinition визначаються такі поля.

- `specReplicasPath` визначає JSONPath всередині власного ресурсу, що відповідає `scale.spec.replicas`.

  - Це обовʼязкове значення.
  - Дозволяються тільки JSONPath під `.spec` і з позначенням через крапку.
  - Якщо у власному ресурсі немає значення за `specReplicasPath`, субресурс `/scale` поверне помилку на запит GET.

- `statusReplicasPath` визначає JSONPath всередині власного ресурсу, що відповідає `scale.status.replicas`.

  - Це обовʼязкове значення.
  - Дозволяються тільки JSONPath під `.status` і з позначенням через крапку.
  - Якщо у власному ресурсі немає значення під `statusReplicasPath`, значення репліки статусу у субресурсі `/scale` стандартно дорівнюватиме 0.

- `labelSelectorPath` визначає JSONPath всередині власного ресурсу, що відповідає
  `Scale.Status.Selector`.

  - Це необовʼязкове значення.
  - Воно повинно бути встановлено для роботи з HPA та VPA.
  - Дозволяються тільки JSONPath під `.status` або `.spec` і з позначенням через крапку.
  - Якщо у власному ресурсі немає значення під `labelSelectorPath`, значення селектора статусу у субресурсі `/scale` стандартно буде порожнім рядком.
  - Поле, на яке вказує цей JSONPath, має бути рядковим полем (а не складною структурою селектора), що містить серіалізований селектор міток у рядковій формі.

У наведеному нижче прикладі ввімкнено обидва субресурси: status і scale.

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
      # subresources описує субресурси власних ресурсів.
      subresources:
        # status вмикає субресурс status.
        status: {}
        # scale вмикає субресурс scale.
        scale:
          # specReplicasPath визначає JSONPath усередині власного ресурсу, що відповідає Scale.Spec.Replicas.
          specReplicasPath: .spec.replicas
          # statusReplicasPath визначає JSONPath усередині власного ресурсу, що відповідає Scale.Status.Replicas.
          statusReplicasPath: .status.replicas
          # labelSelectorPath визначає JSONPath усередині власного ресурсу, що відповідає Scale.Status.Selector.
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

Якщо ви збережете такий YAML у файл `my-crontab.yaml`:

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

Тоді буде створено нові точки доступу RESTful API у просторі імен за адресами:

```none
/apis/stable.example.com/v1/namespaces/*/crontabs/status
```

та

```none
/apis/stable.example.com/v1/namespaces/*/crontabs/scale
```

Власний ресурс можна масштабувати за допомогою команди `kubectl scale`. Наприклад, наведена нижче команда встановлює `.spec.replicas` створеного вище власного ресурсу на 5:

```shell
kubectl scale --replicas=5 crontabs/my-new-cron-object
crontabs "my-new-cron-object" scaled

kubectl get crontabs my-new-cron-object -o jsonpath='{.spec.replicas}'
5
```

Ви можете використовувати [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/), щоб захистити власні ресурси, які мають увімкнений субресурс масштабу.

### Категорії {#categories}

Категорії — це список групованих ресурсів, до яких належить власний ресурс (наприклад, `all`). Ви можете використовувати `kubectl get <category-name>`, щоб вивести список ресурсів, що належать до категорії.

У наведеному нижче прикладі до списку категорій у CustomResourceDefinition додається `all` і показано, як вивести власний ресурс за допомогою `kubectl get all`.

Збережіть такий CustomResourceDefinition у файл `resourcedefinition.yaml`:

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
    # categories — це список згрупованих ресурсів, до яких належить власний ресурс.
    categories:
    - all
```

і створіть його:

```shell
kubectl apply -f resourcedefinition.yaml
```

Після створення обʼєкта CustomResourceDefinition, ви можете створювати власні обʼєкти.

Збережіть такий YAML у `my-crontab.yaml`:

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

Ви можете вказати категорію під час використання `kubectl get`:

```shell
kubectl get all
```

і це включатиме власні ресурси kind `CronTab`:

```none
NAME                          AGE
crontabs/my-new-cron-object   3s
```

## {{% heading "whatsnext" %}} {#what-s-next}

* Прочитайте про [власні ресурси](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

* Дивіться [CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1-apiextensions-k8s-io).

* Обслуговуйте [кілька версій](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/) CustomResourceDefinition.
