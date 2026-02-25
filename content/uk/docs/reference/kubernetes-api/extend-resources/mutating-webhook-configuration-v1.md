---
api_metadata:
  apiVersion: "admissionregistration.k8s.io/v1"
  import: "k8s.io/api/admissionregistration/v1"
  kind: "MutatingWebhookConfiguration"
content_type: "api_reference"
description: "MutatingWebhookConfiguration описує конфігурацію вебхука, який приймає або відхиляє і може змінювати обʼєкт."
title: "MutatingWebhookConfiguration"
weight: 3
auto_generated: false
---

`apiVersion: admissionregistration.k8s.io/v1`

`import "k8s.io/api/admissionregistration/v1"`

## MutatingWebhookConfiguration {#MutatingWebhookConfiguration}

MutatingWebhookConfiguration описує конфігурацію вебхука, який приймає або відхиляє і може змінювати обʼєкт.

---

- **apiVersion**: admissionregistration.k8s.io/v1

- **kind**: MutatingWebhookConfiguration

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартний обʼєкт метаданих; Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata.

- **webhooks** ([]MutatingWebhook)

  *Patch strategy: обʼєднання за ключем `name`*

  *Map: унікальні значення ключа name будуть збережені під час злиття*

  Webhooks — це список вебхуків та відповідних ресурсів і операцій.

  <a name="MutatingWebhook"></a>
  *MutatingWebhook описує вебхук допуску та ресурси й операції, до яких він застосовується.*

  - **webhooks.admissionReviewVersions** ([]string), обовʼязково

    *Atomic: буде замінено під час злиття*

    AdmissionReviewVersions — це впорядкований список версій `AdmissionReview`, які очікує вебхук. Сервер API спробує використати першу версію зі списку, яку він підтримує. Якщо жодна з вказаних версій не підтримується сервером API, перевірка цього обʼєкта зазнає невдачі. Якщо збережена конфігурація вебхука вказує дозволені версії, але не включає жодної версії, відомої серверу API, виклики до вебхука зазнають невдачі й підпадають під політику відмови.

  - **webhooks.clientConfig** (WebhookClientConfig), обовʼязково

    ClientConfig визначає, як спілкуватися з вебхуком. Обовʼязково.

    <a name="WebhookClientConfig"></a>
    *WebhookClientConfig містить інформацію для встановлення TLS-зʼєднання з вебхуком.*

    - **webhooks.clientConfig.caBundle** ([]byte)

      `caBundle` — це закодований у PEM набір сертифікатів CA, який використовуватиметься для перевірки сертифіката сервера вебхука. Якщо не вказано, використовуються системні корені довіри на сервері API.

    - **webhooks.clientConfig.service** (ServiceReference)

      `service` — це посилання на сервіс для цього вебхука. Необхідно вказати або `service`, або `url`.

      Якщо вебхук працює в межах кластера, то слід використовувати `service`.

      <a name="ServiceReference"></a>
      *ServiceReference містить посилання на Service.legacy.k8s.io.*

      - **webhooks.clientConfig.service.name** (string), обовʼязково

        `name` — це імʼя сервісу. Обовʼязково.

      - **webhooks.clientConfig.service.namespace** (string), обовʼязково

        `namespace` — це простір імен сервісу. Обовʼязково.

      - **webhooks.clientConfig.service.path** (string)

        `path` — це необовʼязковий URL шлях, який буде надіслано в будь-якому запиті до цього сервісу.

      - **webhooks.clientConfig.service.port** (int32)

        Якщо вказано, то це порт на сервісі, який є хостом вебхуку. Типово 443 для зворотної сумісності. `port` має бути дійсним номером порту (1-65535, включно).

    - **webhooks.clientConfig.url** (string)

      `url` вказує місце розташування вебхука в стандартній формі URL (`scheme://host:port/path`). Необхідно вказати або `url`, або `service`.

      `host` не повинен посилатися на сервіс, що працює в кластері; використовуйте поле `service` натомість. Хост може бути знайдений через зовнішній DNS в деяких серверах API (наприклад, `kube-apiserver` не може працювати з кластерним DNS, оскільки це було б порушенням розшарування). `host` може також бути IP-адресою.

      Зверніть увагу, що використання `localhost` або `127.0.0.1` як `host` є ризикованим, якщо ви не вживаєте великих заходів обережності, щоб запустити цей вебхук на всіх хостах, що запускають сервер API, який може потребувати викликів до цього вебхука. Такі встановлення, ймовірно, будуть непереносимими, тобто їх буде важко розгорнути в новому кластері.

      Схема має бути "https"; URL має починатися з "https://".

      Шлях є необовʼязковим, і, якщо він присутній, може бути будь-яким рядком, допустимим в URL. Ви можете використовувати шлях для передачі довільного рядка до вебхука, наприклад, ідентифікатора кластера.

      Спроба використання автентифікації користувача або базової автентифікації, наприклад, "user:password@", не дозволена. Також не дозволяються фрагменти ("#...") і параметри запиту ("?...").

  - **webhooks.name** (string), обовʼязково

    Імʼя вебхуку допуску. Імʼя має бути повністю кваліфікованим, наприклад, `imagepolicy.kubernetes.io`, де "imagepolicy" є назвою вебхука, а kubernetes.io — назвою організації. Обовʼязково.

  - **webhooks.sideEffects** (string), обовʼязково

    SideEffects вказує, чи має цей вебхук побічні ефекти. Допустимі значення: None, NoneOnDryRun (вебхуки, створені у v1beta1, також можуть вказати Some або Unknown). Вебхуки з побічними ефектами МАЮТЬ реалізувати систему узгодження, оскільки запит може бути відхилено на наступному етапі ланцюжка допуску, і побічні ефекти потрібно буде скасувати. Запити з атрибутом dryRun автоматично відхиляються, якщо вони відповідають вебхуку з sideEffects == Unknown або Some.

    Можливі значення переліку (enum):
    - `"None"` означає, що виклик вебхука не матиме побічних ефектів.
    - `"NoneOnDryRun"` означає, що виклик вебхука може мати побічні ефекти, але якщо запит, що розглядається, має атрибут dry-run, побічні ефекти будуть подавлені.
    - `"Some"` означає, що виклик вебхука може мати побічні ефекти. Якщо запит з атрибутом dry-run спробує викликати цей вебхук, запит замість цього завершиться невдачею.
    - `"Unknown"` означає, що немає інформації про побічні ефекти виклику вебхука. Якщо запит з атрибутом dry-run спробує викликати цей вебхук, запит замість цього завершиться невдачею.

  - **webhooks.failurePolicy** (string)

    FailurePolicy визначає, як обробляються нерозпізнані помилки від точки доступу допуску — дозволені значення: Ignore або Fail. Стандартне значення — Fail.

    Можливі значення переліку (enum):
    - `"Fail"` означає, що помилка виклику вебхука призводить до відмови в допуску.
    - `"Ignore"` означає, що помилка виклику вебхука ігнорується.

  - **webhooks.matchConditions** ([]MatchCondition)

    *Patch strategy: обʼєднання за ключем `name`*

    *Map: унікальні значення за ключем name будуть збережені під час злиття*

    MatchConditions — це список умов, які мають бути виконані для надсилання запиту до цього вебхука. Умови відповідності фільтрують запити, які вже були підібрані за правилами, namespaceSelector і objectSelector. Порожній список matchConditions відповідає всім запитам. Максимальна кількість умов відповідності — 64.

    Логіка точного збігу така (за порядком):
      1. Якщо БУДЬ-ЯКА умова відповідності оцінюється як FALSE, вебхук оминається.
      2. Якщо ВСІ умови відповідності оцінюються як TRUE, вебхук викликається.
      3. Якщо будь-яка умова відповідності оцінюється як помилка (але жодна не є FALSE):
         - Якщо failurePolicy=Fail, запит відхиляється
         - Якщо failurePolicy=Ignore, помилка ігнорується і вебхук оминається

    <a name="MatchCondition"></a>
    *MatchCondition представляє умову, яка має бути виконана для надсилання запиту до вебхука.*

    - **webhooks.matchConditions.expression** (string), обовʼязково

      Expression представляє вираз, який буде оцінено CEL. Результат обробки — bool. Вирази CEL мають доступ до вмісту AdmissionRequest і Authorizer, організованих у змінні CEL:

      'object' — Обʼєкт із вхідного запиту. Значення null для запитів DELETE. 'oldObject' — Наявний обʼєкт. Значення null для запитів CREATE. 'request' — Атрибути запиту допуску (/pkg/apis/admission/types.go#AdmissionRequest). 'authorizer' — CEL Authorizer. Може бути використано для виконання перевірок авторизації для виконавця (користувач або службового облікового запису) запиту. Див. https://pkg.go.dev/k8s.io/apiserver/pkg/cel/library#Authz  'authorizer.requestResource' — CEL ResourceCheck, створений з 'authorizer' і налаштований із ресурсом запиту. Документація щодо CEL: [https://kubernetes.io/docs/reference/using-api/cel/](/docs/reference/using-api/cel/)

      Обовʼязково.

    - **webhooks.matchConditions.name** (string), обовʼязково

      Name — це ідентифікатор цієї умови відповідності, використовується для стратегії злиття умов відповідності, а також для надання ідентифікатора для цілей логування. Хороша назва має бути описовою для повʼязаного виразу. Назва має бути кваліфікованою назвою, що складається з алфавітно-цифрових символів, '-', '_' або '.', і має починатися та закінчуватися алфавітно-цифровим символом (наприклад, 'MyName' або 'my.name' або '123-abc', регулярний вираз, що використовується для перевірки, — '([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]') з необовʼязковим префіксом DNS субдомену та '/' (наприклад, 'example.com/MyName').

      Обовʼязково.

  - **webhooks.matchPolicy** (string)

    matchPolicy визначає, як використовується список "rules" для відповідності вхідним запитам. Допустимі значення — "Exact" або "Equivalent".

    - Exact: відповідність запиту тільки в тому випадку, якщо він точно відповідає зазначеному правилу. Наприклад, якщо розгортання (deployments) можуть бути змінені через apps/v1, apps/v1beta1 і extensions/v1beta1, але "rules" включають тільки `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, запит до apps/v1beta1 або extensions/v1beta1 не буде надіслано до вебхука.

    - Equivalent: відповідність запиту, якщо він змінює ресурс, вказаний у правилах, навіть через іншу групу API або версію. Наприклад, якщо розгортання (deployments) можуть бути змінені через apps/v1, apps/v1beta1 і extensions/v1beta1, і "rules" включають тільки `apiGroups:["apps"], apiVersions:["v1"], resources: ["deployments"]`, запит до apps/v1beta1 або extensions/v1beta1 буде перетворений на apps/v1 і надісланий до вебхука.

    Стандартне значення — "Equivalent".

    Можливі значення переліку (enum):
    - `"Equivalent"` означає, що запити повинні надсилатися до вебхука, якщо вони змінюють ресурс, вказаний у правилах, через іншу групу API або версію.
    - `"Exact"` означає, що запити повинні надсилатися до вебхука, якщо вони точно відповідають зазначеному правилу.

  - **webhooks.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    NamespaceSelector визначає, чи буде вебхук працювати з обʼєктом на основі того, чи збігається простір імен для цього обʼєкта з селектором. Якщо обʼєкт сам є простором імен, перевірка збігу виконується за метаданими обʼєкта. Якщо обʼєкт є іншим ресурсом на рівні кластера, він ніколи не оминає вебхук.

    Наприклад, щоб запустити вебхук для будь-яких обʼєктів, чий простір імен не повʼязаний з "runlevel" 0 або 1, потрібно налаштувати селектор наступним чином:

    ```json
    "namespaceSelector": {
      "matchExpressions": [
        {
          "key": "runlevel",
          "operator": "NotIn",
          "values": [
            "0",
            "1"
          ]
        }
      ]
    }
    ```

    Якщо замість цього ви хочете запустити вебхук для будь-яких обʼєктів, чий простір імен повʼязаний з "environment" "prod" або "staging", потрібно налаштувати селектор наступним чином:

    ```json
    "namespaceSelector": {
      "matchExpressions": [
        {
          "key": "environment",
          "operator": "In",
          "values": [
            "prod",
            "staging"
          ]
        }
      ]
    }
    ```

    Див. [https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/](/docs/concepts/overview/working-with-objects/labels/) для отримання додаткових прикладів селекторів міток.

    Типове значення — порожній LabelSelector, який має збіг зі всім.

  - **webhooks.objectSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

    ObjectSelector визначає, чи буде вебхук працювати з обʼєктом на основі того, чи має обʼєкт відповідні мітки. ObjectSelector оцінюється як для oldObject, так і для newObject, які будуть надіслані до вебхука, і вважається відповідним, якщо будь-який з обʼєктів відповідає селектору. Нульовий обʼєкт (oldObject у випадку створення або newObject у випадку видалення) або обʼєкт, який не може мати міток (наприклад, DeploymentRollback або PodProxyOptions обʼєкт), не вважається таким, що має збіг. Використовуйте objectSelector лише якщо вебхук є опціональним, оскільки кінцеві користувачі можуть оминути вебхук допуску, встановивши мітки. Типове значення — порожній LabelSelector, який має збіг зі всім.

  - **webhooks.reinvocationPolicy** (string)

    reinvocationPolicy вказує, чи має цей вебхук викликатися кілька разів у рамках однієї оцінки допуску. Допустимі значення — "Never" і "IfNeeded".

    Never: вебхук не буде викликатися більше одного разу в рамках однієї оцінки допуску.

    IfNeeded: вебхук буде викликаний щонайменше один додатковий раз у рамках оцінки допуску, якщо обʼєкт, який допускаєтсья, змінюється іншими втулками допуску після початкового виклику вебхука. Вебхуки, які вказують цю опцію, *мають* бути ідемпотентними, здатними обробляти обʼєкти, які вони попередньо прийняли. Зверніть увагу:

    - не гарантується, що кількість додаткових викликів буде дорівнювати одному.
    - якщо додаткові виклики призводять до подальших змін обʼєкта, вебхуки не гарантуються до повторного виклику.
    - вебхуки, що використовують цю опцію, можуть бути впорядковані для мінімізації кількості додаткових викликів.
    - для перевірки обʼєкта після завершення всіх змін, використовуйте вебхук для валідації допуску.

    Стандартне значення — "Never".

    Можливі значення переліку:
- `"IfNeeded"` вказує, що мутація може бути викликана принаймні ще один раз у рамках оцінки допуску, якщо обʼєкт, що допускається, модифікується іншими втулками допуску після початкового виклику зміни.
- `"Never"` вказує, що зміна не повинна викликатися більше одного разу під час однієї оцінки допуску.

  - **webhooks.rules** ([]RuleWithOperations)

    *Atomic: буде замінено під час злиття*

    Rules описує, які операції з якими ресурсами/субресурсами цікавлять вебхук. Вебхук цікавить операція, якщо вона відповідає *будь-якому* правилу. Однак, щоб запобігти тому, що ValidatingAdmissionWebhooks і MutatingAdmissionWebhooks можуть привести кластер до стану, з якого неможливо відновитися без повного вимкнення втулка, ValidatingAdmissionWebhooks і MutatingAdmissionWebhooks ніколи не викликаються на запити допуску для обʼєктів ValidatingWebhookConfiguration і MutatingWebhookConfiguration.

    <a name="RuleWithOperations"></a>
    *RuleWithOperations — це кортеж операцій і ресурсів. Рекомендується переконатися, що всі розширення кортежу є дійсними.*

    - **webhooks.rules.apiGroups** ([]string)

      *Atomic: буде замінено під час злиття*

      APIGroups — це групи API, до яких належать ресурси. '\*' означає всі групи. Якщо присутній символ '\*', довжина списку має бути одиницею. Обовʼязково.

    - **webhooks.rules.apiVersions** ([]string)

      *Atomic: буде замінено під час злиття*

      APIVersions — це версії API, до яких належать ресурси. '\*' означає всі версії. Якщо присутній символ '\*', довжина списку має бути одиницею. Обовʼязково.

    - **webhooks.rules.operations** ([]string)

      *Atomic: буде замінено під час злиття*

      Operations — це операції, які цікавлять вебхук допуску — CREATE, UPDATE, DELETE, CONNECT або \* для всіх цих операцій і будь-яких майбутніх операцій допуску, які будуть додані. Якщо присутній символ '\*', довжина списку має бути одиницею. Обовʼязково.

    - **webhooks.rules.resources** ([]string)

      *Atomic: буде замінено під час злиття*

      Resources — це список ресурсів, до яких застосовується це правило.

      Наприклад, 'pods' означає Podʼи, 'pods/log' означає субресурс логу Podʼів. '\*' означає всі ресурси, але не субресурси. 'pods/\*' означає всі субресурси Podʼів. '\*/scale' означає всі субресурси масштабування. '\*/\*' означає всі ресурси та їх субресурси.

      Якщо присутній універсальний символ, правило валідації забезпечить відсутність перекриття ресурсів.

      Залежно від навколишнього обʼєкта, субресурси можуть бути недопустимими. Обовʼязково.

    - **webhooks.rules.scope** (string)

      scope визначає область застосування цього правила. Допустимі значення — "Cluster", "Namespaced" та "\*" "Cluster" означає, що правило буде застосовано тільки до ресурсів на рівні кластера. API обʼєкти простору імен є ресурсами на рівні кластера. "Namespaced" означає, що правило буде застосовано тільки до ресурсів простору імен. "\*" означає, що немає обмежень на область застосування. Субресурси відповідають області застосування свого батьківського ресурсу. Стандартне значення — "\*".

      Можливі значення переліку:
      - `"*"` означає, що включені всі області дії.
      - `"Cluster"` означає, що область дії обмежена обʼєктами в межах кластера. Обʼєкти простору імен мають область дії в межах кластера.
      - `"Namespaced"` означає, що область дії обмежена обʼєктами в просторі імен.

  - **webhooks.timeoutSeconds** (int32)

    TimeoutSeconds визначає тайм-аут для цього вебхука. Після закінчення тайм-ауту виклик вебхука буде проігноровано або виклик API завершиться невдачею залежно від політики відмови. Значення тайм-ауту має бути від 1 до 30 секунд. Стандартне значення — 10 секунд.

## MutatingWebhookConfigurationList {#MutatingWebhookConfigurationList}

MutatingWebhookConfigurationList — це список MutatingWebhookConfiguration.

---

- **apiVersion**: admissionregistration.k8s.io/v1

- **kind**: MutatingWebhookConfigurationList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **items** ([]<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>), обовʼязково

  Список MutatingWebhookConfiguration.

## Операції {#Operations}

---

### `get` отримати вказану MutatingWebhookConfiguration {#get-read-the-specified-mutatingwebhookconfiguration}

#### HTTP запит {#http-request}

GET /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  name of the MutatingWebhookConfiguration

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу MutatingWebhookConfiguration {#list-list-or-watch-objects-of-kind-mutatingwebhookconfiguration}

#### HTTP запит {#http-request-1}

GET /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations

#### Параметри {#parameters-1}

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

#### Відповідь {#response-1}

200 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfigurationList" >}}">MutatingWebhookConfigurationList</a>): OK

401: Unauthorized

### `create` створення MutatingWebhookConfiguration {#create-create-a-mutatingwebhookconfiguration}

#### HTTP запит {#http-request-2}

POST /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations

#### Параметри {#parameters-2}

- **body**: <a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): OK

201 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): Created

202 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): Accepted

401: Unauthorized

### `update` заміна вказаної MutatingWebhookConfiguration {#update-replace-the-specified-mutatingwebhookconfiguration}

#### HTTP запит {#http-request-3}

PUT /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/{name}

#### Параметри {#parameters-3}

- **name** (*в шляху*): string, обовʼязково

  name of the MutatingWebhookConfiguration

- **body**: <a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): OK

201 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаної MutatingWebhookConfiguration {#patch-partially-update-the-specified-mutatingwebhookconfiguration}

#### HTTP запит {#http-request-4}

PATCH /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  name of the MutatingWebhookConfiguration

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

#### Відповідь {#response-4}

200 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): OK

201 (<a href="{{< ref "../extend-resources/mutating-webhook-configuration-v1#MutatingWebhookConfiguration" >}}">MutatingWebhookConfiguration</a>): Created

401: Unauthorized

### `delete` видалення MutatingWebhookConfiguration {#delete-delete-a-mutatingwebhookconfiguration}

#### HTTP запит {#http-request-5}

DELETE /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  name of the MutatingWebhookConfiguration

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції MutatingWebhookConfiguration {#deletecollection-delete-collection-of-mutatingwebhookconfiguration}

#### HTTP запит {#http-request-6}

DELETE /apis/admissionregistration.k8s.io/v1/mutatingwebhookconfigurations

#### Параметри {#parameters-6}

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

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

#### Відповідь {#response-6}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
