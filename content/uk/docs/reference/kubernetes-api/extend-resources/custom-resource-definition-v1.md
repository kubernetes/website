---
api_metadata:
  apiVersion: "apiextensions.k8s.io/v1"
  import: "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"
  kind: "CustomResourceDefinition"
content_type: "api_reference"
description: "CustomResourceDefinition представляє ресурс, який повинен бути експонований на сервері API."
title: "CustomResourceDefinition"
weight: 1
auto_generated: false
---

`apiVersion: apiextensions.k8s.io/v1`

`import "k8s.io/apiextensions-apiserver/pkg/apis/apiextensions/v1"`

## CustomResourceDefinition {#CustomResourceDefinition}

CustomResourceDefinition представляє ресурс, який повинен бути експонований на сервері API. Його імʼя повинно бути у форматі \<.spec.name>.\<.spec.group>.

---

- **apiVersion**: apiextensions.k8s.io/v1

- **kind**: CustomResourceDefinition

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinitionSpec" >}}">CustomResourceDefinitionSpec</a>), обовʼязково

  spec описує, як користувач хоче, щоб ресурси виглядали.

- **status** (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinitionStatus" >}}">CustomResourceDefinitionStatus</a>)

  status показує фактичний стан CustomResourceDefinition.

## CustomResourceDefinitionSpec {#CustomResourceDefinitionSpec}

CustomResourceDefinitionSpec визначає, як користувач хоче, щоб їхні ресурси виглядали

---

- **group** (string), обовʼязково

  group — це API-група визначеного власного ресурсу. Власні ресурси обслуговуються як `/apis/<group>/...`. Повинно відповідати імені CustomResourceDefinition у форматі `<names.plural>.<group>`.

- **names** (CustomResourceDefinitionNames), обовʼязково

  names вказують імена ресурсу та виду для власного ресурсу.

  <a name="CustomResourceDefinitionNames"></a>
  *CustomResourceDefinitionNames вказує імена для обслуговування цього CustomResourceDefinition*

  - **names.kind** (string), обовʼязково

    kind — серіалізована версія виду ресурсу. Зазвичай CamelCase та однина. Екземпляри власного ресурсу використовуватимуть це значення як атрибут `kind` у викликах API.

  - **names.plural** (string), обовʼязково

    plural — імʼя ресурсу в множині для обслуговування. Власні ресурси обслуговуються як `/apis/<group>/<version>/.../<plural>`. Повинно відповідати імені CustomResourceDefinition у форматі `<names.plural>.<group>`. Всі літери мають бути у нижньому регістрі.

  - **names.categories** ([]string)

    *Atomic: буде замінено під час злиття*

    categories — це список згрупованих ресурсів, до яких належить цей власний ресурс (наприклад, 'all'). Публікується в документах відкриття API та використовується клієнтами для підтримки викликів типу `kubectl get all`.

  - **names.listKind** (string)

    listKind — серіалізована версія списку для цього ресурсу. Стандартне значення "`kind`List".

  - **names.shortNames** ([]string)

    *Atomic: буде замінено під час злиття*

    shortNames — короткі імена ресурсу, відображені в документах відкриття API та використовувані клієнтами для підтримки викликів типу `kubectl get <shortname>`. Всі літери мають бути у нижньому регістрі.

  - **names.singular** (string)

    singular — назва ресурсу в однині. Всі літери мають бути у нижньому регістрі. Стандартно, це значення є приведеним до нижнього регістру `kind`.

- **scope** (string), обовʼязково

  scope вказує, чи має визначений власний ресурс область застосування, спільну для кластера або простору імен. Допустимі значення: `Cluster` і `Namespaced`.

- **versions** ([]CustomResourceDefinitionVersion), обовʼязково

  *Atomic: буде замінено під час злиття*

  versions — це список всіх API-версій визначеного власного ресурсу. Назви версій використовуються для визначення порядку в зазначених API-версіях. Якщо рядок версії є "kube-like", він буде вище не "kube-like" рядків версій, що упорядковуються лексикографічно. "Kube-like" версії починаються з "v", за яким слідує номер (головна версія), а потім необовʼязково рядок "alpha" або "beta" та інший номер (додаткова версія). Ці версії сортуються так: GA > beta > alpha (де GA - версія без суфікса, такого як beta або alpha), а потім порівнюються головна версія, а потім додаткова версія. Приклад відсортованого списку версій: v10, v2, v1, v11beta2, v10beta3, v3beta1, v12alpha1, v11alpha2, foo1, foo10.

  <a name="CustomResourceDefinitionVersion"></a>
  *CustomResourceDefinitionVersion описує версію для CRD.*

  - **versions.name** (string), обовʼязково

    name — це імʼя версії, наприклад "v1", "v2beta1" і т.д. Власні ресурси обслуговуються під цією версією за адресою `/apis/<group>/<version>/...`, якщо `served` встановлено в true.

  - **versions.served** (boolean), обовʼязково

    served — це прапорець, що дозволяє включити/відключити цю версію для обслуговування через REST API.

  - **versions.storage** (boolean), обовʼязково

    storage — вказує, що цю версію слід використовувати при збереженні власних ресурсів у сховищі. Повинна бути рівно одна версія з параметром `storage=true`.

  - **versions.additionalPrinterColumns** ([]CustomResourceColumnDefinition)

    *Atomic: буде замінено під час злиття*

    additionalPrinterColumns визначає додаткові стовпці, що повертаються в таблицях. Див. [https://kubernetes.io/docs/reference/using-api/api-concepts/#receiving-resources-as-tables](/docs/reference/using-api/api-concepts/#receiving-resources-as-tables) для деталей. Якщо стовпці не вказані, використовується один стовпець, що відображає вік власного ресурсу.

    <a name="CustomResourceColumnDefinition"></a>
    *CustomResourceColumnDefinition вказує стовпець для друку на стороні сервера.*

    - **versions.additionalPrinterColumns.jsonPath** (string), обовʼязково

      jsonPath — простий шлях JSON (тобто з нотацією масиву), який оцінюється для кожного власного ресурсу для створення значення цього стовпця.

    - **versions.additionalPrinterColumns.name** (string), обовʼязково

      name — імʼя для стовпця зрозуміле людині.

    - **versions.additionalPrinterColumns.type** (string), обовʼязково

      type — визначення типу OpenAPI для цього стовпця. Див. https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types для деталей.

    - **versions.additionalPrinterColumns.description** (string)

      description — опис цього стовпця зрозумілий людині.

    - **versions.additionalPrinterColumns.format** (string)

      format - є необовʼязковим визначенням типу OpenAPI для цього стовпця. Формат 'name' застосовується до стовпця первинного ідентифікатора, щоб допомогти клієнтам ідентифікувати стовпець — це імʼя ресурсу. Дивіться https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types для більш детальної інформації.

    - **versions.additionalPrinterColumns.priority** (int32)

      priority — ціле число, що визначає відносну важливість цього стовпчика порівняно з іншими. Менші числа вважаються більш пріоритетними. Стовпці, які можуть бути пропущені в сценаріях з обмеженим простором, повинні мати пріоритет, більший за 0.

  - **versions.deprecated** (boolean)

    deprecated вказує, що ця версія API для власних ресурсів застаріла. Якщо встановлено значення true, запити API до цієї версії отримають заголовок попередження у відповіді сервера. Стандартне значення — false.

  - **versions.deprecationWarning** (string)

    deprecationWarning перевизначає стандартне попередження, що повертається клієнтам API. Може бути встановлене лише тоді, коли `deprecated` встановлено в true. Стандартне попередження вказує на те, що ця версія застаріла і рекомендує використовувати останню доступну версію з рівною або більшою стабільністю, якщо така існує.

  - **versions.schema** (CustomResourceValidation)

    schema описує схему, яка використовується для валідації, обрізання та встановлення стандартних значень для цієї версії власного ресурсу.

    <a name="CustomResourceValidation"></a>
    *CustomResourceValidation є переліком методів валідації для CustomResource.*

    - **versions.schema.openAPIV3Schema** (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

      openAPIV3Schema визначає схему OpenAPI v3 для валідації та обрізання власного ресурсу.

  - **versions.selectableFields** ([]SelectableField)

    *Atomic: буде замінено під час злиття*

    `selectableFields` визначає шляхи до полів, які можуть бути використані як селектори полів. Дозволяється використовувати максимум 8 вибіркових полів. [https://kubernetes.io/docs/concepts/overview/working-with-objects/field-selectors](/docs/concepts/overview/working-with-objects/field-selectors)

    <a name="SelectableField"></a>
    *SelectableField вказує шлях JSON до поля, яке може бути використане з селекторами полів.*

    - **versions.selectableFields.jsonPath** (string), required

      `jsonPath` — це простий шлях JSON, який оцінюється для кожного власного ресурсу, щоб отримати значення селектора поля. Дозволяються лише JSON-шляхи без нотації масивів. Повинен вказувати на поле типу string, boolean або integer. Дозволяються типи з enum-значеннями та рядки з форматами. Якщо `jsonPath` посилається на відсутнє поле в ресурсі, він оцінюється як порожній рядок. Не повинен вказувати на поля метаданих. Обовʼязкове поле.

  - **versions.subresources** (CustomResourceSubresources)

    subresources вказують, які додаткові ресурси цієї версії визначеного власного ресурсу доступні.

    <a name="CustomResourceSubresources"></a>
    *CustomResourceSubresources вказує, як оброляти мастшатабування субресурсів для CustomResource.*

    - **versions.subresources.scale.specReplicasPath** (string), обовʼязково

      specReplicasPath визначає шлях JSON всередині власного ресурсу, який відповідає Scale `spec.replicas`. Допускаються тільки JSON-шляхи без нотації масиву. Повинен бути JSON-шлях у форматі `.spec`. Якщо у власному ресурсі немає значення за вказаним шляхом, субресурс `/scale` поверне помилку при виконанні GET.

    - **versions.subresources.scale.statusReplicasPath** (string), обовʼязково

      statusReplicasPath визначає шлях JSON всередині власного ресурсу, який відповідає Scale `status.replicas`. Допускаються лише JSON-шляхи без нотації масиву. Повинен бути JSON-шлях під `.status`. Якщо у власному ресурсі немає значення за вказаним шляхом, значення `status.replicas` у субресурсі `/scale` буде стандартно дорівнювати 0.

    - **versions.subresources.scale.labelSelectorPath** (string)

      labelSelectorPath визначає шлях JSON всередині власного ресурсу, який відповідає Scale `status.selector`. Допускаються лише JSON-шляхи без нотації масиву. Повинен бути JSON-шлях під `.status` або `.spec`. Має бути налаштований на роботу з HorizontalPodAutoscaler. Поле, на яке вказує цей JSON-шлях, має бути рядковим полем (не складною структурою селектора), яке містить серіалізований селектор міток у рядковій формі. Детальніше: [https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions#scale-subresource](/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions#scale-subresource) Якщо у власному ресурсі немає значення за вказаним шляхом, значення `status.selector` у субресурсі `/scale` буде стандартно дорівнювати порожньому рядку.

    - **versions.subresources.status** (CustomResourceSubresourceStatus)

      status вказує, що власний ресурс має обслуговувати субресурс `/status`. Коли ввімкнено:

      1. запити до первинної точки доступу власного ресурсу ігнорують зміни в розділі `status` обʼєкта.
      2. Запити до субресурсу `/status` власного ресурсу ігнорують зміни будь-чого, окрім строфи `status` обʼєкта.

      <a name="CustomResourceSubresourceStatus"></a>
      *CustomResourceSubresourceStatus визначає, як обслуговувати субресурс статусу для власних ресурсів. Статус представляється JSON-шляхом `.status` всередині власного ресурсу. Якщо встановлено,*

      - *відкриває субресурс /status для власного ресурсу*
      - *PUT-запити до субресурсу /status отримують обʼєкт власного ресурсу та ігнорують зміни у всьому, окрім рядка статусу*
      - *PUT/POST/PATCH запити до власного ресурсу ігнорують зміни у рядку стану*

- **conversion** (CustomResourceConversion)

  conversion визначає налаштування конвертації для CRD.

  <a name="CustomResourceConversion"></a>
  *CustomResourceConversion описує, як конвертувати різні версії CR.*

  - **conversion.strategy** (string), обовʼязково

    strategy визначає, як налаштовуються власні ресурси між версіями. Допустимі значення:

    - `"None"`: Конвертер змінює тільки apiVersion і не торкається інших полів у власному ресурсі.
    - `"Webhook"`: API Server викликає зовнішній webhook для виконання конвертації. Додаткова інформація потрібна для цього варіанту. Це вимагає, щоб spec.preserveUnknownFields було встановлено у false, а spec.conversion.webhook було налаштовано.

  - **conversion.webhook** (WebhookConversion)

    webhook описує, як викликати конвертаційний webhook. Обовʼязково, якщо `strategy` встановлено на `"Webhook"`.

    <a name="WebhookConversion"></a>
    *WebhookConversion описує, як викликати конвертаційний webhook*

    - **conversion.webhook.conversionReviewVersions** ([]string), обовʼязково

      *Atomic: буде замінено під час злиття*

      conversionReviewVersions — впорядкований список пріоритетних версій `ConversionReview`, які очікує Webhook. API сервер використовує першу версію зі списку, яку він підтримує. Якщо жодна з версій, зазначених у цьому списку, не підтримується API сервером, конвертація для власного ресурсу не відбудеться. Якщо збережена конфігурація Webhook визначає дозволені версії та не включає жодної версії, відомої API серверу, виклики до webhook не будуть успішними.

    - **conversion.webhook.clientConfig** (WebhookClientConfig)

      clientConfig містить інструкції щодо виклику webhook, якщо strategy є `Webhook`.

      <a name="WebhookClientConfig"></a>
      *WebhookClientConfig містить інформацію для встановлення TLS-зʼєднання з webhook.*

      - **conversion.webhook.clientConfig.caBundle** ([]byte)

        caBundle — PEM-кодований CA пакет, який буде використовуватися для перевірки сертифіката сервера webhook. Якщо не вказано, використовуються системні корені довіри на apiserver.

      - **conversion.webhook.clientConfig.service** (ServiceReference)

        service — це посилання на сервіс для цього webhook. Необхідно вказати або service, або url.

        Якщо webhook працює в межах кластера, слід використовувати `service`.

        <a name="ServiceReference"></a>
        *ServiceReference містить посилання на Service.legacy.k8s.io*

        - **conversion.webhook.clientConfig.service.name** (string), обовʼязково

          name — це імʼя сервісу. Обовʼязково

        - **conversion.webhook.clientConfig.service.namespace** (string), обовʼязково

          namespace — це простір імен сервісу. Обовʼязково

        - **conversion.webhook.clientConfig.service.path** (string)

          path — це необовʼязковий URL шлях, за яким буде контактуватися webhook.

        - **conversion.webhook.clientConfig.service.port** (int32)

          port — це необовʼязковий порт сервісу, за яким буде контактуватися webhook. `port` повинен бути дійсним номером порту (1-65535, включно). Стандартно встановлено 443 для зворотної сумісності.

      - **conversion.webhook.clientConfig.url** (string)

        url вказує місце розташування webhook у стандартній URL формі (`scheme://host:port/path`). Потрібно вказати точно один з `url` або `service`.

        `host` не повинен посилатися на сервіс, що працює в кластері; натомість використовуйте поле `service`. `host` може бути знайдений через зовнішній DNS на деяких apiservers (наприклад, `kube-apiserver` не може розвʼязати DNS у кластері, оскільки це було б порушенням рівнів). `host` також може бути IP-адресою.

        Зверніть увагу, що використання `localhost` або `127.0.0.1` як `host` ризиковано, якщо ви не вживаєте великої обережності, щоб запустити цей webhook на всіх хостах, які можуть потребувати викликів до цього webhook. Такі установки, ймовірно, будуть непереносними, тобто їх не легко переносити в новий кластер.

        Схема повинна бути "https"; URL повинен починатися з "https://".

        Шлях є необовʼязковим, і якщо присутній, може бути будь-яким рядком, допустимим в URL. Ви можете використовувати шлях для передачі довільного рядка до webhook, наприклад, ідентифікатора кластера.

        Спроба використати автентифікацію користувача або базову автентифікацію, наприклад, "user:password@" не дозволена. Фрагменти ("#...") та параметри запиту ("?...") також не дозволені.

- **preserveUnknownFields** (boolean)

  preserveUnknownFields вказує, що поля обʼєкта, які не зазначені в схемі OpenAPI, повинні зберігатися під час зберігання. apiVersion, kind, metadata та відомі поля всередині metadata завжди зберігаються. Це поле застаріле і замість нього слід встановлювати `x-preserve-unknown-fields` на true в `spec.versions[*].schema.openAPIV3Schema`. Деталі дивіться на [https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#field-pruning](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#field-pruning).

## JSONSchemaProps {#JSONSchemaProps}

JSONSchemaProps є JSON-схемою, яка відповідає Специфікації Draft 4 (http://json-schema.org/).

---

- **$ref** (string)

- **$schema** (string)

- **additionalItems** (JSONSchemaPropsOrBool)

  <a name="JSONSchemaPropsOrBool"></a>
  *JSONSchemaPropsOrBool представляє JSONSchemaProps або булеве значення. Стандартно встановлюється у true для булевого значення.*

- **additionalProperties** (JSONSchemaPropsOrBool)

  <a name="JSONSchemaPropsOrBool"></a>
  *JSONSchemaPropsOrBool представляє JSONSchemaProps або булеве значення. Стандартно встановлюється у true для булевого значення.*

- **allOf** ([]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

  *Atomic: буде замінено під час злиття*

- **anyOf** ([]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

  *Atomic: буде замінено під час злиття*

- **default** (JSON)

  default є стандартним значенням для невизначених полів обʼєкта. Використання стандартних значень є бета-функцією у функціональних можливостей CustomResourceDefaulting. Використання стандартних значень вимагає, щоб spec.preserveUnknownFields було встановлено у false.

  <a name="JSON"></a>
  *JSON представляє будь-яке допустиме значення JSON. Підтримуються такі типи: bool, int64, float64, string, []interface{}, map[string]interface{} та nil.*

- **definitions** (map[string]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

- **dependencies** (map[string]JSONSchemaPropsOrStringArray)

  <a name="JSONSchemaPropsOrStringArray"></a>
  *JSONSchemaPropsOrStringArray представляє JSONSchemaProps або масив рядків.*

- **description** (string)

- **enum** ([]JSON)

  *Atomic: буде замінено під час злиття*

  <a name="JSON"></a>
  *JSON представляє будь-яке допустиме значення JSON. Підтримуються такі типи: bool, int64, float64, string, []interface{}, map[string]interface{} та nil.*

- **example** (JSON)

  <a name="JSON"></a>
  *JSON представляє будь-яке допустиме значення JSON. Підтримуються такі типи: bool, int64, float64, string, []interface{}, map[string]interface{} та nil.*

- **exclusiveMaximum** (boolean)

- **exclusiveMinimum** (boolean)

- **externalDocs** (ExternalDocumentation)

  <a name="ExternalDocumentation"></a>
  *ExternalDocumentation дозволяє посилатися на зовнішній ресурс для розширеної документації.*

  - **externalDocs.description** (string)

  - **externalDocs.url** (string)

- **format** (string)

  format — це рядок формату OpenAPI v3. Невідомі формати ігноруються. Наступні формати перевіряються:

  - bsonobjectid: BSON Object ID, тобто 24-символьний шістнадцятковий рядок
  - uri: URI, який розбирається за допомогою Golang net/url.ParseRequestURI
  - email: адреса електронної пошти, яка розбирається за допомогою Golang net/mail.ParseAddress
  - hostname: дійсне представлення імені хоста в Інтернеті, визначене RFC 1034, розділ 3.1 [RFC1034]
  - ipv4: IPv4 IP, який розбирається за допомогою Golang net.ParseIP
  - ipv6: IPv6 IP, який розбирається за допомогою Golang net.ParseIP
  - cidr: CIDR, який розбирається за допомогою Golang net.ParseCIDR
  - Mac: MAC-адреса, яка розбирається за допомогою Golang net.ParseMAC
  - uuid: UUID, який дозволяє великі літери та визначається регулярним виразом `(?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$`
  - uuid3: UUID3, який дозволяє великі літери та визначається регулярним виразом `(?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?3[0-9a-f]{3}-?[0-9a-f]{4}-?[0-9a-f]{12}$`
  - uuid4: UUID4, який дозволяє великі літери та визначається регулярним виразом `(?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?4[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$`
  - uuid5: UUID5, який дозволяє великі літери та визначається регулярним виразом `(?i)^[0-9a-f]{8}-?[0-9a-f]{4}-?5[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$`
  - isbn: номер ISBN10 або ISBN13, наприклад, "0321751043" або "978-0321751041"
  - isbn10: номер ISBN10, наприклад, "0321751043"
  - isbn13: номер ISBN13, наприклад, "978-0321751041"
  - creditcard: номер кредитної картки, який визначається регулярним виразом `^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$` з будь-якими нецифровими символами
  - ssn: номер соціального страхування США, який відповідає регулярному виразу `^\d{3}[- ]?\d{2}[- ]?\d{4}$`
  - hexcolor: шістнадцятковий код кольору, наприклад, "#FFFFFF", який відповідає регулярному виразу `^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$`
  - rgbcolor: код кольору RGB, наприклад, "rgb(255,255,255)"
  - byte: двійкові дані, закодовані в base64
  - password: будь-який тип рядка
  - date: рядок дати, наприклад, "2006-01-02", як визначено у full-date у RFC3339
  - duration: рядок тривалості, наприклад, "22 ns", який розбирається за допомогою Golang time.ParseDuration або сумісний з форматом тривалості Scala
  - datetime: рядок дати і часу, наприклад, "2014-12-15T19:30:20.000Z", як визначено у date-time у RFC3339

- **id** (string)

- **items** (JSONSchemaPropsOrArray)

  <a name="JSONSchemaPropsOrArray"></a>
  *JSONSchemaPropsOrArray представляє значення, яке може бути JSONSchemaProps або масивом JSONSchemaProps. Переважно використовується для цілей серіалізації.*

- **maxItems** (int64)

- **maxLength** (int64)

- **maxProperties** (int64)

- **maximum** (double)

- **minItems** (int64)

- **minLength** (int64)

- **minProperties** (int64)

- **minimum** (double)

- **multipleOf** (double)

- **not** (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

- **nullable** (boolean)

- **oneOf** ([]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

*Atomic: буде замінено під час злиття*

- **pattern** (string)

- **patternProperties** (map[string]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

- **properties** (map[string]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#JSONSchemaProps" >}}">JSONSchemaProps</a>)

- **required** ([]string)

  *Atomic: буде замінено під час злиття*

- **title** (string)

- **type** (string)

- **uniqueItems** (boolean)

- **x-kubernetes-embedded-resource** (boolean)

  x-kubernetes-embedded-resource визначає, що значення є вбудованим обʼєктом Kubernetes runtime.Object, з TypeMeta та ObjectMeta. Тип має бути object. Дозволяється подальше обмеження вбудованого обʼєкта. kind, apiVersion та metadata перевіряються автоматично. x-kubernetes-preserve-unknown-fields може бути true, але це не обовʼязково, якщо обʼєкт повністю вказаний (аж до kind, apiVersion, metadata).

- **x-kubernetes-int-or-string** (boolean)

  x-kubernetes-int-or-string вказує, що це значення є або цілим числом, або рядком. Якщо це true, дозволено порожній тип, а тип як нащадок anyOf дозволений, якщо дотримується один з наступних шаблонів:

  1) anyOf:
     - type: integer
     - type: string
  2) allOf:
     - anyOf:
       - type: integer
       - type: string
     - ... нуль або більше

- **x-kubernetes-list-map-keys** ([]string)

  *Atomic: буде замінено під час злиття*

  x-kubernetes-list-map-keys анотує масив з типом списку x-kubernetes `map`, вказуючи ключі, які використовуються як індекс map.

  Цей теґ МАЄ використовуватися тільки для списків, які мають розширення "x-kubernetes-list-type" встановлене на "map". Також значення, вказані для цього атрибута, мають бути полем типу scalar структури нащадка (вкладення не підтримується).

  Властивості, зазначені у цьому полі, повинні бути або обовʼязковими, або мати стандартне значення, щоб забезпечити наявність цих властивостей для всіх елементів списку.

- **x-kubernetes-list-type** (string)

  x-kubernetes-list-type анотує масив, щоб більш детально описати його топологію. Це розширення має використовуватися тільки для списків і може мати 3 можливі значення:

  1) `atomic`: список розглядається як єдине ціле, як скаляр. Списки atomic будуть повністю замінені при оновленні. Це розширення може використовуватися для будь-якого типу списків (структур, скалярів тощо).
  2) `set`: Набори — це списки, які не повинні мати кілька елементів з однаковим значенням. Кожне значення повинно бути скаляром, обʼєктом з x-kubernetes-map-type `atomic` або масивом з x-kubernetes-list-type `atomic`.
  3) `map`: Ці списки схожі на map тим, що їх елементи мають неіндексований ключ, який використовується для їх ідентифікації. Порядок зберігається при злитті. Теґ map має використовуватися тільки для списків з елементами типу object. Стандартне значення для масивів — atomic.

- **x-kubernetes-map-type** (string)

  x-kubernetes-map-type анотує обʼєкт, щоб більш детально описати його топологію. Це розширення має використовуватися тільки, коли тип обʼєкта є object і може мати 2 можливі значення:

  1) `granular`: Ці maps є справжніми map (пари ключ-значення) і кожне поле незалежне одне від одного (їх можна маніпулювати окремими акторами). Це стандартн поведінка для всіх map.
  2) `atomic`: список розглядається як єдине ціле, як скаляр. Atomic maps будуть повністю замінені при оновленні.

- **x-kubernetes-preserve-unknown-fields** (boolean)

  x-kubernetes-preserve-unknown-fields зупиняє етап декодування на сервері API від видалення полів, які не вказані у схемі перевірки. Це впливає на поля рекурсивно, але повертається до нормальної поведінки видалення, якщо вкладені властивості або додаткові властивості вказані у схемі. Це може бути true або не визначено. Використання false заборонено.

- **x-kubernetes-validations**

  *Patch strategy: обʼєднання за ключем `rule`.*

  *Map: унікальні значення ключа rule будуть збережені під час злиття.*

  x-kubernetes-validations описує список правил валідації записаних мовою CEL.

  <a name="ValidationRule"></a>
  *ValidationRule описує правило валідації записане мовою CEL.*

  - **x-kubernetes-validations.rule** (string), обовʼязково

    Правило (rule) представляє вираз, який буде оцінюватися за допомогою CEL. Докладніше: https://github.com/google/cel-spec. Правило обмежується місцем розташування розширення x-kubernetes-validations у схемі. Змінна `self` у виразі CEL привʼязана до обмеженого значення. Приклад:

    - Правило обмежене коренем ресурсу з субресурсом status: {"rule": "self.status.actual \<= self.spec.maxDesired"}

    Якщо Правило обмежене обʼєктом з властивостями, доступні властивості обʼєкта вибираються через `self.field`, а наявність поля можна перевірити через `has(self.field)`. Поля з нульовим значенням розглядаються як відсутні поля у виразах CEL. Якщо Правило обмежене обʼєктом з additionalProperties (тобто map), значення map доступні через `self[mapKey]`, наявність ключа в map можна перевірити через `mapKey in self`, а всі записи map доступні через макроси та функції CEL, такі як `self.all(...)`. Якщо Правило обмежене масивом, елементи масиву доступні через `self[i]`, а також через макроси та функції. Якщо Правило обмежене скаляром, `self` привʼязується до значення скаляра. Приклади:

    - Правило обмежене картою обʼєктів: {"rule": "self.components['Widget'].priority \< 10"}
    - Правило обмежене списком цілих чисел: {"rule": "self.values.all(value, value >= 0 && value \< 100)"}
    - Правило обмежене рядковим значенням: {"rule": "self.startsWith('kube')"}

    `apiVersion`, `kind`, `metadata.name` та `metadata.generateName` завжди доступні з кореня обʼєкта та з будь-яких обʼєктів, позначених як x-kubernetes-embedded-resource. Жодні інші властивості метаданих не доступні.

    Невідомі дані, збережені у власних ресурсах через x-kubernetes-preserve-unknown-fields, не доступні у виразах CEL. Це включає:

    - Невідомі значення полів, що зберігаються схемами обʼєктів з x-kubernetes-preserve-unknown-fields.
    - Властивості обʼєкта, де схема властивості має "невідомий тип". "Невідомий тип" рекурсивно визначається як:

    - Схема без типу і з x-kubernetes-preserve-unknown-fields встановленим у true
    - Масив, де схема елементів має "невідомий тип"
    - Обʼєкт, де схема additionalProperties має "невідомий тип"

    Доступні лише імена властивостей формату `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*`. Доступні імена властивостей екрануються за наступними правилами, коли до них звертаються у виразі:

    - '__' екранується як '__underscores__'
    - '.' екранується як '__dot__'
    - '-' екранується як '__dash__'
    - '/' екранується як '__slash__'
    - Імена властивостей, які точно збігаються з зарезервованими ключовими словами CEL, екрануються як '__{keyword}__'. Ключові слова: "true", "false", "null", "in", "as", "break", "const", "continue", "else", "for", "function", "if", "import", "let", "loop", "package", "namespace", "return".

    Приклади:
    - Правило, яке звертається до властивості з імʼям "namespace": {"rule": "self.__namespace__ > 0"}
    - Правило, яке звертається до властивості з імʼям "x-prop": {"rule": "self.x__dash__prop > 0"}
    - Правило, яке звертається до властивості з імʼям "redact__d": {"rule": "self.redact__underscores__d > 0"}

    Рівність масивів з x-kubernetes-list-type 'set' або 'map' ігнорує порядок елементів, тобто [1, 2] == [2, 1]. Конкатенація масивів з x-kubernetes-list-type використовує семантику типу списку:
    - 'set': `X + Y` виконує обʼєднання, де позиції масиву всіх елементів у `X` зберігаються, а  елементи в `Y`, що не перетинаються, додаються зі збереженням їх часткового порядку.
    - 'map': `X + Y` виконує злиття, де позиції масиву всіх ключів у `X` зберігаються, але значення замінюються значеннями в `Y`, коли набори ключів `X` та `Y` перетинаються. Елементи в `Y` з ключами, що не перетинаються з ключами, додаються зі збереженням їх часткового порядку.

    Якщо в `rule` використовується змінна `oldSelf`, це неявно означає, що це "правило переходу" (transition rule).

    Стандартно, змінна `oldSelf` має той самий тип, що й `self`. Коли параметр `optionalOldSelf` встановлено як `true`, змінна `oldSelf` стає CEL-варіантом (optional), і її метод `value()` матиме той самий тип, що й `self`. Деталі можна знайти в документації до поля `optionalOldSelf`.

    Правила переходу стандартно застосовуються лише до запитів **UPDATE** і пропускаються, якщо старе значення не було знайдено. Ви можете налаштувати безумовну оцінку правила переходу, встановивши `optionalOldSelf` як `true`.

  - **x-kubernetes-validations.fieldPath** (string)

    fieldPath представляє шлях до поля, що повертається, коли перевірка не вдається. Він має бути відносним JSON шляхом (тобто з нотацією масиву), обмеженим місцем розташування цього розширення x-kubernetes-validations у схемі та посилатися на існуюче поле. Наприклад, коли перевірка перевіряє, чи існує певний атрибут `foo` в map `testMap`, fieldPath може бути встановлений як `.testMap.foo`. Якщо перевірка перевіряє, що два списки повинні мати унікальні атрибути, fieldPath може бути встановлений як будь-який зі списків: наприклад, `.testList`. Він не підтримує числовий індекс списку. Він підтримує операції з дочірніми елементами для посилання на існуюче поле. Для отримання додаткової інформації дивіться [Підтримка JSONPath у Kubernetes](/docs/reference/kubectl/jsonpath/). Числовий індекс масиву не підтримується. Для імені поля, що містить спеціальні символи, використовуйте `['specialName']` для посилання на імʼя поля. Наприклад, для атрибута `foo.34$`, що зʼявляється у списку `testList`, fieldPath може бути встановлений як `.testList['foo.34$']`.

  - **x-kubernetes-validations.message** (string)

    message представляє повідомлення, яке відображається, коли перевірка не вдається. Повідомлення є обовʼязковим, якщо у Правилі є розриви рядків. Повідомлення не повинно містити розривів рядків. Якщо не встановлено, повідомлення буде "failed rule: {Rule}". Наприклад, "must be a URL with the host matching spec.host".

- **x-kubernetes-validations.messageExpression** (string)

    messageExpression оголошує вираз CEL, який оцінюється як повідомлення про помилку перевірки, яке повертається, коли це правило не вдається. Оскільки messageExpression використовується як повідомлення про помилку, він повинен оцінюватися як рядок. Якщо і message, і messageExpression присутні у правилі, тоді messageExpression буде використаний у разі невдалої перевірки. Якщо messageExpression призводить до помилки під час виконання, ця помилка записується в лог, і повідомлення про помилку перевірки створюється так, ніби поле messageExpression не встановлено. Якщо messageExpression оцінюється як порожній рядок, рядок, що містить лише пробіли, або рядок, що містить розриви рядків, то повідомлення про помилку перевірки також створюється так, ніби поле messageExpression не встановлено, і факт того, що messageExpression створив порожній рядок/рядок з пробілами/рядок з розривами рядків, записується в лог. messageExpression має доступ до всіх тих же змінних, що й правило; єдина відмінність — тип значення, що повертається. Приклад: "x must be less than max ("+string(self.max)+")".

  - **x-kubernetes-validations.optionalOldSelf** (boolean)

    `optionalOldSelf` використовується для того, щоб активувати оцінку правила переходу навіть під час першого створення обʼєкта або коли старий обʼєкт не містить значення.

    Коли цей параметр увімкнено, змінна `oldSelf` стає CEL-варіантом (optional), значенням якого буде `None`, якщо старе значення відсутнє або обʼєкт створюється вперше.

    Ви можете перевірити наявність значення у `oldSelf` за допомогою методу `oldSelf.hasValue()` і розпакувати його після перевірки за допомогою `oldSelf.value()`. Більше інформації можна знайти в документації CEL щодо типів `Optional`: https://pkg.go.dev/github.com/google/cel-go/cel#OptionalTypes

    Цей параметр не може бути встановлений, якщо `oldSelf` не використовується в `rule`.

  - **x-kubernetes-validations.reason** (string)

    reason забезпечує машинозчитувану причину невдачі перевірки, яка повертається до абонента, коли запит не проходить це правило перевірки. Код стану HTTP, що повертається до абонента, буде відповідати причині першого невдалого правила перевірки. Поточні підтримувані причини: "FieldValueInvalid", "FieldValueForbidden", "FieldValueобовʼязково", "FieldValueDuplicate". Якщо не встановлено, стандартно використовується "FieldValueInvalid". Усі майбутні додані причини повинні прийматися клієнтами при читанні цього значення, а невідомі причини повинні оброблятися як FieldValueInvalid.

    Можливі значення переліку (enum):
    - `"FieldValueDuplicate"` використовується для повідомлення про колізії значень, які повинні бути унікальними (наприклад, унікальні ідентифікатори).
    - `"FieldValueForbidden"` використовується для повідомлення про дійсні (згідно з правилами форматування) значення, які можуть бути прийняті за певних умов, але які не дозволені поточними умовами (такі як політика безпеки).
    - `"FieldValueInvalid"` використовується для повідомлення про неправильно сформовані значення (наприклад, невдале зіставлення регулярного виразу, занадто довгі, поза межами допустимого).
    - `"FieldValueRequired"` використовується для повідомлення про обовʼязкові значення, які не надані (наприклад, порожні рядки, значення null або порожні масиви).

## CustomResourceDefinitionStatus {#CustomResourceDefinitionStatus}

CustomResourceDefinitionStatus вказує стан CustomResourceDefinition.

---

- **acceptedNames** (CustomResourceDefinitionNames)

  acceptedNames — це імена, які фактично використовуються для обслуговування виявлення ресурсів. Вони можуть відрізнятися від імен у специфікації.

  <a name="CustomResourceDefinitionNames"></a>
  *CustomResourceDefinitionNames вказує імена для обслуговування цього CustomResourceDefinition*

  - **acceptedNames.kind** (string), обовʼязково

    kind — серіалізоване імʼя типу ресурсу. Зазвичай CamelCase в однині. Екземпляри спеціальних ресурсів будуть використовувати це значення як атрибут `kind` у викликах API.

  - **acceptedNames.plural** (string), обовʼязково

    plural — імʼя ресурсу для обслуговування в множині. Спеціальні ресурси обслуговуються як `/apis/\<group>/\<version>/.../\<plural>`. Має відповідати імені CustomResourceDefinition (у формі `\<names.plural>.\<group>`). Має бути в нижньому регістрі.

  - **acceptedNames.categories** ([]string)

    *Atomic: буде замінено під час злиття*

    categories — це список згрупованих ресурсів, до яких належить цей власний ресурс (наприклад, 'all'). Публікується у документах виявлення API і використовується клієнтами для підтримки викликів типу `kubectl get all`.

  - **acceptedNames.listKind** (string)

    listKind — серіалізоване імʼя списку для цього ресурсу. Стандартне значення — "`kind`List".

  - **acceptedNames.shortNames** ([]string)

    *Atomic: буде замінено під час злиття*

    shortNames — короткі імена для ресурсу, які відображаються в документах виявлення API і використовуються клієнтами для підтримки викликів типу `kubectl get \<shortname>`. Мають бути в нижньому регістрі.

  - **acceptedNames.singular** (string)

    singular — імʼя ресурсу в однині. Має бути в нижньому регістрі. Стандартно використовується нижній регістр `kind`.

- **conditions** ([]CustomResourceDefinitionCondition)

  *Map: унікальні значення за типом ключа будуть збережені під час злиття*

  conditions — вказують стан для окремих аспектів CustomResourceDefinition

  <a name="CustomResourceDefinitionCondition"></a>
  *CustomResourceDefinitionCondition містить деталі поточного стану цього CustomResourceDefinition.*

  - **conditions.status** (string), обовʼязково

    status — статус стану. Може бути True, False або Unknown.

  - **conditions.type** (string), обовʼязково

    type — тип стану. Типи включають Established, NamesAccepted і Terminating.

  - **conditions.lastTransitionTime** (Time)

    lastTransitionTime — час останньої зміни стану з одного статусу в інший.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string)

    message — текст, зрощумілий людині, що вказує деталі останньої зміни стану.

  - **conditions.observedGeneration** (int64)

    observedGeneration представляє .metadata.generation, на основі якого було встановлено умову. Наприклад, якщо .metadata.generation наразі дорівнює 12, але .status.conditions[x].observedGeneration дорівнює 9, умова є застарілою стосовно поточного стану екземпляра.

  - **conditions.reason** (string)

    reason — унікальна однозначна причина в CamelCase для останньої зміни стану.

- **observedGeneration** (int64)

  Покоління, яке спостерігає контролер CRD.

- **storedVersions** ([]string)

  *Atomic: буде замінено під час злиття*

  storedVersions перераховує всі версії CustomResources, які коли-небудь зберігалися. Відстеження цих версій дозволяє визначити шлях міграції для збережених версій в etcd. Поле є змінним, тому контролер міграції може завершити міграцію до іншої версії (переконавшись, що у сховищі не залишилося старих обʼєктів), а потім видалити решту версій з цього списку. Версії не можна видаляти з `spec.versions`, доки вони існують у цьому списку.

## CustomResourceDefinitionList {#CustomResourceDefinitionList}

CustomResourceDefinitionList є списком обʼєктів CustomResourceDefinition.

---

- **items** ([]<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>), обовʼязково

  items - список окремих обʼєктів CustomResourceDefinition

- **apiVersion** (рядок)

  APIVersion визначає версійну схему цього представлення обʼєкта. Сервери повинні конвертувати визнані схеми у останнє внутрішнє значення і можуть відхиляти невизнані значення. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

- **kind** (рядок)

  Kind — рядкове значення, що представляє ресурс REST, який представляє цей обʼєкт. Сервери можуть виводити це значення з точки доступу, до якого клієнт надсилає запити. Не може бути оновлене. В CamelCase. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  metadata - стандартні метадані обʼєкта. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

## Операції {#operations}

---

### `get` отримати вказаний CustomResourceDefinition {#get-read-the-specified-customresourcedefinition}

#### HTTP запит {#http-request}

GET /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя CustomResourceDefinition

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

401: Unauthorized

### `get` отримати статус вказаного CustomResourceDefinition {#get-read-status-of-the-specified-customresourcedefinition}

#### HTTP запит {#http-request-1}

GET /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя CustomResourceDefinition

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу CustomResourceDefinition {#list-or-watch-objects-of-kind-customresourcedefinition}

#### HTTP запит {#http-request-2}

GET /apis/apiextensions.k8s.io/v1/customresourcedefinitions

#### Параметри {#parameters-2}

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

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinitionList" >}}">CustomResourceDefinitionList</a>): OK

401: Unauthorized

### `create` створення CustomResourceDefinition {#create-create-a-customresourcedefinition}

#### HTTP запит {#http-request-3}

POST /apis/apiextensions.k8s.io/v1/customresourcedefinitions

#### Параметри {#parameters-3}

- **body**: <a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

202 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Accepted

401: Unauthorized

### `update` заміна вказаного CustomResourceDefinition {#update-replace-the-specified-customresourcedefinition}

#### HTTP запит {#http-request-4}

PUT /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя CustomResourceDefinition

- **body**: <a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного CustomResourceDefinition {#update-replace-status-of-the-specified-customresourcedefinition}

#### HTTP запит {#http-request-5}

PUT /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}/status

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя CustomResourceDefinition

- **body**: <a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного CustomResourceDefinition {#patch-partially-update-the-specified-customresourcedefinition}

#### HTTP запит {#http-request-6}

PATCH /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя CustomResourceDefinition

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

#### Відповідь {#response-6}

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного CustomResourceDefinition {#patch-partially-update-status-of-the-specified-customresourcedefinition}

#### HTTP запит {#http-request-7}

PATCH /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}/status

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя CustomResourceDefinition

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

200 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): OK

201 (<a href="{{< ref "../extend-resources/custom-resource-definition-v1#CustomResourceDefinition" >}}">CustomResourceDefinition</a>): Created

401: Unauthorized

### `delete` видалення CustomResourceDefinition {#delete-delete-a-customresourcedefinition}

#### HTTP запит {#http-request-8}

DELETE /apis/apiextensions.k8s.io/v1/customresourcedefinitions/{name}

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя CustomResourceDefinition

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

#### Відповідь {#response-8}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції CustomResourceDefinition {#deletecollection-delete-collection-of-customresourcedefinition}

#### HTTP запит {#http-request-9}

DELETE /apis/apiextensions.k8s.io/v1/customresourcedefinitions

#### Параметри {#parameters-9}

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

#### Відповідь {#response-9}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
