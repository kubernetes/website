---
title: Концепції API Kubernetes
content_type: concept
weight: 20
---

<!-- overview -->

API Kubernetes — це програмний інтерфейс на основі ресурсів (RESTful), який надається через HTTP. Він підтримує отримання, створення, оновлення та видалення основних ресурсів за допомогою стандартних HTTP-дієслів (POST, PUT, PATCH, DELETE, GET).

Для деяких ресурсів API включає додаткові субресурси, що дозволяють детальніше налаштовувати авторизацію (наприклад, окремі представлення для деталей Pod та отримання логів), і може приймати та надавати ці ресурси в різних форматах для зручності або ефективності.

Kubernetes підтримує ефективні сповіщення про зміни ресурсів за допомогою *watches*.
{{< glossary_definition prepend="В API Kubernetes, watch це" term_id="watch" length="short" >}}
Kubernetes також забезпечує послідовні операції зі списками, щоб клієнти API могли ефективно кешувати, відстежувати та синхронізувати стан ресурсів.

Ви можете переглянути [Довідник API](/docs/reference/kubernetes-api/) онлайн або прочитати далі, щоб дізнатися про API загалом.

<!-- body -->

## Терміни API Kubernetes {#standard-api-terminology}

Kubernetes зазвичай використовує загальноприйняту термінологію RESTful для опису концепцій API:

* *Тип ресурсу* — це назва, що використовується в URL (`pods`, `namespaces`, `services`)
* Усі типи ресурсів мають конкретне представлення (їх схему обʼєкта), яке називається *kind*
* Список екземплярів типу ресурсу називається *колекцією*
* Окремий екземпляр типу ресурсу називається *ресурсом* і зазвичай представляє *обʼєкт*
* Для деяких типів ресурсів API включає один або більше *субресурсів*, які представлені як URI-шляхи після назви ресурсу

Більшість типів ресурсів API Kubernetes є {{< glossary_tooltip text="обʼєктами" term_id="object" >}} — вони представляють конкретний екземпляр концепції у кластері, як-от pod або namespace. Невелика кількість типів ресурсів API є *віртуальними*, оскільки вони часто представляють операції над обʼєктами, а не самі обʼєкти, такі як перевірка дозволів (використання POST із JSON-кодованим тілом `SubjectAccessReview` для ресурсу `subjectaccessreviews`), або субресурс `eviction` у Pod (використовується для запуску [виселення, ініційованого API](/docs/concepts/scheduling-eviction/api-eviction/)).

### Імена обʼєктів {#object-names}

Усі обʼєкти, які ви можете створити через API, мають унікальне {{< glossary_tooltip text="імʼя" term_id="name" >}}, що дозволяє ідемпотентне[^1] створення та отримання, за винятком віртуальних типів ресурсів, які можуть не мати унікальних імен, якщо вони не можуть бути отримані або не залежать від ідемпотентності. У межах {{< glossary_tooltip text="простору імен" term_id="namespace" >}} може бути лише один обʼєкт з вказаним іменем для даного виду. Однак, якщо ви видалите обʼєкт, ви можете створити новий обʼєкт з тим самим іменем. Деякі обʼєкти не мають простору імен (наприклад: Nodes), тому їх імена повинні бути унікальними у всьому кластері.

[^1]: Ідемпотентність означає, що ви можете повторно виконати операцію без змін у стані системи. <https://uk.wikipedia.org/wiki/Ідемпотентність>

### Дієслова API {#api-verbs}

Майже всі типи ресурсів підтримують стандартні HTTP-дієслова — GET, POST, PUT, PATCH, та DELETE. Kubernetes також використовує власні дієслова, які часто пишуться малими літерами, щоб відрізняти їх від HTTP-дієслів.

Kubernetes використовує термін **list** для опису дії отримання [колекції](#collections) ресурсів, щоб відрізняти її від дії отримання одного ресурсу, яка зазвичай називається **get**. Якщо ви надішлете HTTP-запит GET із параметром `?watch`, Kubernetes називає це **watch**, а не **get** (див. [Ефективне виявлення змін](#efficient-detection-of-changes) для деталей).

Для запитів PUT Kubernetes внутрішньо класифікує їх як **create** або **update** залежно від стану наявного обʼєкта. **Update** відрізняється від **patch**; HTTP-дієслово для **patch** - PATCH.

## URI ресурсів {#resource-uris}

Усі типи ресурсів або належать кластеру (`/apis/GROUP/VERSION/*`), або простору імен (`/apis/GROUP/VERSION/namespaces/NAMESPACE/*`). Тип ресурсу, що належить простору імен, буде видалений при видаленні простору імен, і доступ до цього типу ресурсу контролюється перевірками авторизації в межах простору імен.

Примітка: основні ресурси використовують `/api` замість `/apis` і пропускають сегмент GROUP.

Приклади:

* `/api/v1/namespaces`
* `/api/v1/pods`
* `/api/v1/namespaces/my-namespace/pods`
* `/apis/apps/v1/deployments`
* `/apis/apps/v1/namespaces/my-namespace/deployments`
* `/apis/apps/v1/namespaces/my-namespace/deployments/my-deployment`

Ви також можете отримати доступ до колекцій ресурсів (наприклад, переліку усіх Nodes). Наступні шляхи використовуються для отримання колекцій та ресурсів:

* Ресурси кластерного рівня:

  * `GET /apis/GROUP/VERSION/RESOURCETYPE` — повертає колекцію ресурсів вказаного типу ресурсу
  * `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME` — повертає ресурс з імʼям NAME вказаного типу ресурсу

* Ресурси рівня простору імен:

  * `GET /apis/GROUP/VERSION/RESOURCETYPE` — повертає колекцію всіх екземплярів вказаного типу ресурсу в усіх просторах імен
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE` — повертає колекцію всіх екземплярів вказаного типу ресурсу в просторі імен NAMESPACE
  * `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME` — повертає екземпляр вказаного типу ресурсу з імʼям NAME в просторі імен NAMESPACE

Оскільки простір імен є ресурсом кластерного рівня, ви можете отримати перелік ("колекцію") всіх просторів імен за допомогою `GET /api/v1/namespaces` та деталі про конкретний простір імен за допомогою `GET /api/v1/namespaces/NAME`.

* Субресурс кластерного рівня: `GET /apis/GROUP/VERSION/RESOURCETYPE/NAME/SUBRESOURCE`
* Субресурс рівня простору імен: `GET /apis/GROUP/VERSION/namespaces/NAMESPACE/RESOURCETYPE/NAME/SUBRESOURCE`

Підтримувані дієслова для кожного субресурсу будуть відрізнятися залежно від обʼєкта — див. [Довідник API](/docs/reference/kubernetes-api/) для отримання додаткової інформації. Немає можливості отримати доступ до субресурсів через декілька ресурсів — зазвичай використовується новий віртуальний тип ресурсу, якщо це стає необхідним.

## HTTP медіа-типи {#alternate-representations-of-resources}

Kubernetes підтримує кодування JSON, YAML, CBOR та Protobuf для передачі даних по HTTP.

Стандартно, Kubernetes повертає [серіалізовані об’єкти JSON](#json-encoding), використовуючи медіа-тип `application/json`. Хоча JSON є стандартним типом, клієнти можуть запитувати відповідь у форматі YAML, або більш ефективне двійкове подання у вигляді [Protobuf](#protobuf-encoding) для кращої продуктивності.

Kubernetes API реалізує стандартне узгодження типів вмісту HTTP: передача заголовка `Accept` у запиті `GET` вказує серверу спробувати повернути відповідь у бажаному медіа-типі. Якщо ви хочете надіслати об’єкт у форматі Protobuf на сервер для запиту `PUT` або `POST`, вам необхідно відповідно встановити заголовок запиту `Content-Type`.

Якщо ви запитуєте доступні медіа-типи, API-сервер повертає відповідь з відповідним заголовком `Content-Type`; якщо жоден із запитаних медіа-типів не підтримується, API-сервер поверне повідомлення про помилку `406 Not acceptable`. Усі вбудовані типи ресурсів підтримують медіа-тип `application/json`.

#### Часткове кодування колекцій {#chunked-encoding-of-collections}

Для кодування JSON та Protobuf Kubernetes реалізує власні кодувальники, які записують елементи по одному. Ця функція не змінює вихідні дані, але дозволяє API-серверу уникати завантаження всієї відповіді LIST в памʼять. Використання інших типів кодування (включаючи форматоване представлення JSON) слід уникати для великих колекцій ресурсів (>100MB), оскільки це може негативно вплинути на продуктивність.

### Кодування ресурсів у форматі JSON {#json-encoding}

API Kubernetes стандартно використовує [JSON](https://www.json.org/json-uk.html) для кодування тіла HTTP повідомлень.

Наприклад:

1. Вивести список усіх Podʼів в кластері без вказування бажаного формату

   ```none
   GET /api/v1/pods
   ```

   ```none
   200 OK
   Content-Type: application/json

   … Колекція Pod, закодована у форматі JSON (обʼєкт PodList)
   ```

2. Створити Pod, відправивши JSON на сервер та запросивши відповідь у форматі JSON.

   ```none
   POST /api/v1/namespaces/test/pods
   Content-Type: application/json
   Accept: application/json
   … Обʼєкт Pod, закодований у форматі JSON
   ```

   ```none
   200 OK
   Content-Type: application/json

   {
     "kind": "Pod",
     "apiVersion": "v1",
     …
   }
   ```

Ви також можете запросити представлення цього кодування у вигляді [таблиці](#table-fetches) та [тільки метаданих](#metadata-only-fetches).

### Кодування ресурсів у YAML {#yaml-encoding}

Kubernetes також підтримує медіатип [`application/yaml`](https://www.rfc-editor.org/rfc/rfc9512.html) для запитів та відповідей. [`YAML`](https://yaml.org/) може використовуватись для визначення маніфестів Kubernetes та взаємодії з API.

Наприклад:

1. Отримати список усіх podʼів у кластері у форматі YAML

   ```none
   GET /api/v1/pods
   Accept: application/yaml
   ```

   ```none
   200 OK
   Content-Type: application/yaml

   … YAML-кодована колекція Podʼів (обʼєкт PodList)
   ```

1. Створити pod, надіславши дані у форматі YAML на сервер і запросивши відповідь у форматі YAML:

   ```none
   POST /api/v1/namespaces/test/pods
   Content-Type: application/yaml
   Accept: application/yaml
   … YAML-кодований об'єкт Pod
   ```

   ```none
   200 OK
   Content-Type: application/yaml

   apiVersion: v1
   kind: Pod
   metadata:
     name: my-pod
     …
   ```

Ви також можете запросити представлення цього кодування у вигляді [таблиці](#table-fetches) та [тільки метаданих](#metadata-only-fetches).

### Кодування Kubernetes Protobuf {#protobuf-encoding}

Kubernetes використовує обгортку-конверт для кодування відповідей у форматі Protobuf. Ця обгортка починається з 4 байтів магічного числа, щоб допомогти ідентифікувати вміст на диску або в etcd як Protobuf (на відміну від JSON). Дані з магічним числом (4 байти) слідують за повідомленням, закодованим у форматі Protobuf, яке описує кодування та тип основного об’єкта. Усередині повідомлення Protobuf дані внутрішнього об’єкта записуються за допомогою поля `raw` Unknown (дивіться [IDL](#protobuf-encoding-idl) для докладної інформації).

Наприклад:

1. Вивести список усіх Pod в кластері у форматі Protobuf.

   ```none
   GET /api/v1/pods
   Accept: application/vnd.kubernetes.protobuf
   ```

   ```none
   200 OK
   Content-Type: application/vnd.kubernetes.protobuf

   … Колекція Pod, закодована у двійковому форматі (обʼєкт PodList)
   ```

1. Створити Pod, відправивши дані, закодовані у форматі Protobuf на сервер, але запросити відповідь у форматі JSON.

   ```none
   POST /api/v1/namespaces/test/pods
   Content-Type: application/vnd.kubernetes.protobuf
   Accept: application/json
   … двійково закодований обʼєкт Pod
   ---
   200 OK
   Content-Type: application/json

   {
     "kind": "Pod",
     "apiVersion": "v1",
     ...
   }
   ```

Ви можете використовувати обидві техніки разом і взаємодіяти з API Kubernetes, яке підтримує кодування Protobuf, для читання та запису даних. Лише деякі типи ресурсів API є сумісними з Protobuf.

<a id="protobuf-encoding-idl" />

Формат обгортки:

```none
Чотирибайтовий префікс магічного числа:
  Байти 0-3: "k8s\x00" [0x6b, 0x38, 0x73, 0x00]

Закодоване повідомлення Protobuf з наступним IDL:
  message Unknown {
    // typeMeta повинне містити значення рядків для "kind" та "apiVersion", як встановлено в обʼєкті
    JSON optional TypeMeta typeMeta = 1;

    // raw містить повний серіалізований обʼєкт у форматі protobuf.
    // Дивіться визначення protobuf у клієнтських бібліотеках для конкретного виду.
    optional bytes raw = 2;

    // contentEncoding — це кодування, яке використовується для raw даних.
    // Якщо не вказано, кодування відсутнє.
    optional string contentEncoding = 3;

    // contentType — це метод серіалізації, який використовується для серіалізації 'raw'.
    // Якщо не вказано, використовується application/vnd.kubernetes.protobuf, і зазвичай
    // цей параметр не вказується.
    optional string contentType = 4;
  }

  message TypeMeta {
    // apiVersion — це група/версія для цього типу
    optional string apiVersion = 1;
    // kind — це назва схеми обʼєкта. Має існувати визначення protobuf для цього обʼєкта.
    optional string kind = 2;
  }
```

{{< note >}}
Клієнти, які отримують відповідь у форматі `application/vnd.kubernetes.protobuf`, що не відповідає очікуваному префіксу, повинні відхилити відповідь, оскільки майбутні версії можуть змінити формат серіалізації на несумісний спосіб, і це буде зроблено шляхом зміни префіксу.
{{< /note >}}

Ви також можете запросити представлення цього кодування у вигляді [таблиці](#table-fetches) та [тільки метаданих](#metadata-only-fetches).

#### Сумісність із Kubernetes Protobuf {#protobuf-encoding-compatibility}

Не всі типи ресурсів API підтримують кодування Kubernetes у форматі Protobuf; зокрема, Protobuf не доступний для ресурсів, які визначені як {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}} або надаються через {{< glossary_tooltip text="шар агрегації" term_id="aggregation-layer" >}}.

Як клієнт, якщо вам може знадобитися працювати з розширеними типами, слід вказати кілька типів контенту в заголовку `Accept` запиту для підтримки резервного переходу на JSON. Наприклад:

```none
Accept: application/vnd.kubernetes.protobuf, application/json
```

### Кодування ресурсів CBOR {#cbor-encoding}

{{< feature-state feature_gate_name="CBORServingAndStorage" >}}

З увімкненою [функціональною можливістю](/docs/reference/command-line-tools-reference/feature-gates/) `CBORServingAndStorage` тіла запитів і відповідей для всіх вбудованих типів ресурсів і всіх ресурсів, визначених {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}, можуть бути закодовані у двійковий формат даних [CBOR](https://www.rfc-editor.org/rfc/rfc8949). CBOR також підтримується на рівні {{< glossary_tooltip text="aggregation layer" term_id="aggregation-layer" >}}, якщо він увімкнений на окремих агрегованих серверах API.

Клієнти повинні вказувати медіа-тип IANA `application/cbor` в заголовку HTTP-запиту `Content-Type`, коли тіло запиту містить один CBOR [закодований елемент даних](https://www.rfc-editor.org/rfc/rfc8949.html#section-1.2-4.2), і в заголовку HTTP-запиту `Accept`, коли вони готові прийняти CBOR-кодований елемент даних у відповіді. Сервери API будуть використовувати `application/cbor` в заголовку `Content-Type` HTTP-відповіді, коли тіло відповіді містить об'єкт, закодований CBOR.

Якщо сервер API кодує свою відповідь на [watch request](#efficient-detection-of-changes) за допомогою CBOR, тіло відповіді буде [CBOR Sequence](https://www.rfc-editor.org/rfc/rfc8742), а в заголовку `Content-Type` HTTP-відповіді буде використано медіа-тип IANA `application/cbor-seq`. Кожен елемент послідовності (якщо такий є) є окремою подією спостереження, закодованою CBOR.

На додаток до існуючого типу даних `application/apply-patch+yaml` для YAML-кодованих [конфігурацій додатків на стороні сервера](#patch-and-apply), сервери API, які підтримують CBOR, прийматимуть тип даних `application/apply-patch+cbor` для конфігурацій додатків на стороні сервера, закодованих CBOR. Для `application/json-patch+json` або `application/merge-patch+json`, або `application/strategic-merge-patch+json` не підтримується еквівалент CBOR.

Ви також можете запросити представлення цього кодування у вигляді [таблиці](#table-fetches) та [тільки метаданих](#metadata-only-fetches).

## Ефективне виявлення змін {#efficient-detection-of-changes}

API Kubernetes дозволяє клієнтам зробити початковий запит на обʼєкт або колекцію, а потім відстежувати зміни з моменту цього запиту: це **watch**. Клієнти можуть відправити **list** або **get** і потім зробити наступний запит **watch**.

Для реалізації цього відстеження змін кожен обʼєкт Kubernetes має поле `resourceVersion`, яке представляє версію цього ресурсу, що зберігається в постійному шарі збереження. При отриманні колекції ресурсів (як простору імен, так і кластерного рівня), відповідь від сервера API містить значення `resourceVersion`. Клієнт може використовувати це значення `resourceVersion` для ініціювання **watch** проти сервера API.

Коли ви надсилаєте запит **watch**, сервер API відповідає потоком змін. Ці зміни перераховують результати операцій (таких як **create**, **delete**, та **update**), що відбулись після `resourceVersion`, значення якого було вказане як параметр до запиту **watch**. Загальний механізм **watch** дозволяє клієнту отримати поточний стан і потім підписатися на подальші зміни, не пропускаючи жодної події.

Якщо клієнт **watch** відʼєднується, тоді цей клієнт може розпочати новий сеанс **watch** з останнього повернутого `resourceVersion`; клієнт також може виконати новий запити **get**/**list** і розпочати знову. Див. [Семантика версій ресурсів](#resource-versions) для отримання детальнішої інформації.

Наприклад:

1. Отримання списку всіх Podʼів у вказаному просторі імен.

   ```http
   GET /api/v1/namespaces/test/pods
   ---
   200 OK
   Content-Type: application/json

   {
     "kind": "PodList",
     "apiVersion": "v1",
     "metadata": {"resourceVersion":"10245"},
     "items": [...]
   }
   ```

1. Починаючи з версії ресурсу 10245, отримуйте сповіщення про будь-які операції API (такі як **create**, **delete**, **patch** або **update**), що впливають на Podʼи у просторі імен *test*. Кожне сповіщення про зміну — це документ JSON. Тіло відповіді HTTP (надається як `application/json`) складається із серії документів JSON.

   ```http
   GET /api/v1/namespaces/test/pods?watch=1&resourceVersion=10245
   ---
   200 OK
   Transfer-Encoding: chunked
   Content-Type: application/json

   {
     "type": "ADDED",
     "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "10596", ...}, ...}
   }
   {
     "type": "MODIFIED",
     "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "11020", ...}, ...}
   }
   ...
   ```

Сервер Kubernetes буде зберігати історичний запис змін лише протягом обмеженого часу. Кластери, що використовують etcd 3, стандартно зберігають зміни за останні 5 хвилин. Коли запитувані операції **watch** не вдаються через недоступність історичної версії цього ресурсу, клієнти повинні обробляти цей випадок, розпізнаючи код статусу `410 Gone`, очищаючи свій локальний кеш, виконуючи новий **get** або **list** запит, і починаючи **watch** з `resourceVersion`, яке було повернуто.

Для підписки на колекції бібліотеки клієнтів Kubernetes зазвичай пропонують певну форму стандартного інструменту для логіки **list**-потім-**watch**. (У бібліотеці клієнтів Go це називається `Reflector` і знаходиться в пакеті `k8s.io/client-go/tools/cache`).

### Закладки для Watch {#watch-bookmarks}

Щоб зменшити вплив короткого вікна історії, API Kubernetes надає подію спостереження під назвою `BOOKMARK`. Це особливий вид події, що позначає, що всі зміни до вказаної клієнтом `resourceVersion` вже були надіслані. Документ, що представляє подію `BOOKMARK`, має тип який отримується запитом, але включає лише поле `.metadata.resourceVersion`. Наприклад:

```http
GET /api/v1/namespaces/test/pods?watch=1&resourceVersion=10245&allowWatchBookmarks=true
---
200 OK
Transfer-Encoding: chunked
Content-Type: application/json

{
  "type": "ADDED",
  "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "10596", ...}, ...}
}
...
{
  "type": "BOOKMARK",
  "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "12746"} }
}
```

Як клієнт, ви можете запитувати події `BOOKMARK`, встановлюючи параметр запиту `allowWatchBookmarks=true` у запиті **watch**, але не слід припускати, що закладки будуть повертатися з певним інтервалом, і клієнти не можуть очікувати, що сервер API надішле будь-яку подію `BOOKMARK`, навіть якщо її було запитано.

## Потокові списки {#streaming-lists}

{{< feature-state feature_gate_name="WatchList" >}}

У великих кластерах отримання колекції деяких типів ресурсів може призвести до значного збільшення використання ресурсів (переважно RAM) панелі управління. Щоб зменшити вплив та спростити користування шаблоном **list** + **watch** у Kubernetes v1.32 переведено у бета-версію функцію, яка дозволяє запитувати початковий стан (який раніше запитувався за допомогою запиту **list**) як частину запиту **watch**.

На стороні клієнта початковий стан можна запросити, вказавши `sendInitialEvents=true` як параметр рядка запиту у запиті типу **watch**. Якщо встановлено, сервер API починає потік спостереження з синтетичних початкових подій (типу `ADDED`) для побудови всього стану всіх наявних обʼєктів, після чого йде подія [`BOOKMARK`](/docs/reference/using-api/api-concepts/#watch-bookmarks) (якщо запитано через параметр `allowWatchBookmarks=true`). Подія закладки включає версію ресурсу, до якої його було синхронізовано. Після надсилання події закладки сервер API продовжує роботу як для будь-якого іншого запиту **watch**.

Коли ви встановлюєте `sendInitialEvents=true` у рядку запиту, Kubernetes також вимагає, щоб ви встановили `resourceVersionMatch` до значення `NotOlderThan`. Якщо ви вказали `resourceVersion` у рядку запиту без значення або не вказали його взагалі, це інтерпретується як запит на *узгоджене читання* (*consistent read*); подія закладки надсилається, коли стан синхронізовано щонайменше до моменту узгодженого читання з моменту, коли запит почав оброблятися. Якщо ви вказуєте `resourceVersion` (у рядку запиту), подія закладки надсилається, коли стан синхронізовано щонайменше до вказаної версії ресурсу.

### Приклад {#example-streaming-lists}

Приклад: ви хочете спостерігати за колекцією Podʼів. Для цієї колекції поточна версія ресурсу
становить 10245, і є два Podʼи: `foo` та `bar`. Надсилання наступного запиту (який явно запитує узгоджене читання, встановлюючи порожню версію ресурсу за допомогою `resourceVersion=`) може призвести до наступної послідовності подій:

```http
GET /api/v1/namespaces/test/pods?watch=1&sendInitialEvents=true&allowWatchBookmarks=true&resourceVersion=&resourceVersionMatch=NotOlderThan
---
200 OK
Transfer-Encoding: chunked
Content-Type: application/json

{
  "type": "ADDED",
  "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "8467", "name": "foo"}, ...}
}
{
  "type": "ADDED",
  "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "5726", "name": "bar"}, ...}
}
{
  "type": "BOOKMARK",
  "object": {"kind": "Pod", "apiVersion": "v1", "metadata": {"resourceVersion": "10245"} }
}
...
<далі йде звичайний потік спостереження, починаючи з resourceVersion="10245">
```

## Стиснення відповідей {#response-compression}

{{< feature-state feature_gate_name="APIResponseCompression" >}}

Опція `APIResponseCompression` дозволяє серверу API стискати відповіді на запити **get** та **list**, зменшуючи використання мережевої пропускної здатності та покращуючи продуктивність у великих кластерах. Її стандартно увімкнено з Kubernetes 1.16 і її можна вимкнути додаванням `APIResponseCompression=false` у прапорець `--feature-gates` на сервері API.

Стиснення відповідей API може значно зменшити розмір відповіді, особливо для великих ресурсів або [колекцій](/docs/reference/using-api/api-concepts/#collections). Наприклад, запит **list** для Podʼів може повернути сотні кілобайт або навіть мегабайти даних, залежно від кількості Podʼів та їх атрибутів. Стиснення відповіді дозволяє зберегти мережеву пропускну здатність та зменшити затримки.

Щоб перевірити, чи працює `APIResponseCompression`, ви можете надіслати запит **get** або **list** на сервер API з заголовком `Accept-Encoding` та перевірити розмір відповіді та заголовки. Наприклад:

```http
GET /api/v1/pods
Accept-Encoding: gzip
---
200 OK
Content-Type: application/json
content-encoding: gzip
...
```

Заголовок `content-encoding` вказує, що відповідь стиснута за допомогою `gzip`.

## Отримання великих наборів результатів частинами {#returning-large-result-sets-in-chunks}

{{< feature-state feature_gate_name="APIListChunking" >}}

У великих кластерах отримання колекції деяких типів ресурсів може призвести до дуже великих відповідей, що може вплинути на сервер та клієнта. Наприклад, у кластері може бути десятки тисяч Podʼів, кожен з яких еквівалентний приблизно 2 КіБ у форматі JSON. Отримання всіх Podʼів через всі простори імен може призвести до дуже великої відповіді (10-20 МБ) та спожити багато ресурсів сервера.

Сервер API Kubernetes підтримує можливість розбиття одного великого запиту на колекцію на багато менших частин, зберігаючи при цьому узгодженість загального запиту. Кожна частина може бути повернута послідовно, що зменшує загальний розмір запиту і дозволяє клієнтам, орієнтованим на користувачів, показувати результати поетапно для покращення швидкості реагування.

Ви можете запитувати сервер API для обробки **list** запиту, використовуючи сторінки (які Kubernetes називає *chunks*). Щоб отримати одну колекцію частинами, підтримуються два параметри запиту `limit` та `continue` у запитах до колекцій, і поле відповіді `continue` повертається з усіх операцій **list** у полі `metadata` колекції. Клієнт повинен вказати максимальну кількість результатів, яку він бажає отримати у кожній частині за допомогою `limit`, і сервер поверне кількість ресурсів у результаті не більше `limit` та включить значення `continue`, якщо у колекції є більше ресурсів.

Як клієнт API, ви можете передати це значення `continue` серверу API у наступному запиті, щоб вказати серверу повернути наступну сторінку (*chunk*) результатів. Продовжуючи до тих пір, поки сервер не поверне порожнє значення `continue`, ви можете отримати всю колекцію.

Як і у випадку з операцією **watch**, токен `continue` закінчується через короткий проміжок часу (стандартно 5 хвилин) і повертає `410 Gone`, якщо більше результатів не може бути повернуто. У цьому випадку клієнт повинен буде почати з початку або опустити параметр `limit`.

Наприклад, якщо у кластері є 1,253 Podʼів і ви хочете отримувати частини по 500 Podʼів за раз, запитуйте ці частини наступним чином:

1. Отримати всі Podʼи в кластері, отримуючи до 500 Podʼів за раз.

   ```http
   GET /api/v1/pods?limit=500
   ---
   200 OK
   Content-Type: application/json

   {
     "kind": "PodList",
     "apiVersion": "v1",
     "metadata": {
       "resourceVersion":"10245",
       "continue": "ENCODED_CONTINUE_TOKEN",
       "remainingItemCount": 753,
       ...
     },
     "items": [...] // повертає Podʼи 1-500
   }
   ```

1. Продовжити попередній запит, отримуючи наступний набір з 500 Podʼів.

   ```http
   GET /api/v1/pods?limit=500&continue=ENCODED_CONTINUE_TOKEN
   ---
   200 OK
   Content-Type: application/json

   {
     "kind": "PodList",
     "apiVersion": "v1",
     "metadata": {
       "resourceVersion":"10245",
       "continue": "ENCODED_CONTINUE_TOKEN_2",
       "remainingItemCount": 253,
       ...
     },
     "items": [...] // повертає Podʼи 501-1000
   }
   ```

1. Продовжити попередній запит, отримуючи останні 253 Podʼів.

   ```http
   GET /api/v1/pods?limit=500&continue=ENCODED_CONTINUE_TOKEN_2
   ---
   200 OK
   Content-Type: application/json

   {
     "kind": "PodList",
     "apiVersion": "v1",
     "metadata": {
       "resourceVersion":"10245",
       "continue": "", // токен continue порожній, тому що ми досягли кінця списку
       ...
     },
     "items": [...] // повертає Podʼи 1001-1253
   }
   ```

Зверніть увагу, що `resourceVersion` колекції залишається постійним в кожному запиті, що вказує на те, що сервер показує вам узгоджену копію Podʼів. Podʼи, що створюються, оновлюються або видаляються після версії `10245`, не будуть показані, якщо ви не зробите окремий запит **list** без токена `continue`. Це дозволяє вам розбивати великі запити на менші частини, а потім виконувати операцію **watch** на повному наборі, не пропускаючи жодного оновлення.

Поле `remainingItemCount` вказує кількість наступних елементів у колекції, які не включені у цю відповідь. Якщо запит **list** містив мітки або поля {{< glossary_tooltip text="селектори" term_id="selector">}}, тоді кількість залишкових елементів невідома, і сервер API не включає поле `remainingItemCount` у свою відповідь. Якщо **list** запит завершено (або тому, що він не розбивається на частини, або тому, що це остання частина), то більше немає залишкових елементів, і сервер API не включає поле `remainingItemCount` у свою відповідь. Очікуване використання `remainingItemCount — оцінка розміру колекції.

## Колекції {#collections}

У термінології Kubernetes відповідь, яку ви отримуєте за допомогою **list**, є *колекцією*. Однак Kubernetes визначає конкретні види для колекцій різних типів ресурсів. Колекції мають вид, названий на честь виду ресурсу, з доданим `List`.

Коли ви надсилаєте запит API для певного типу, всі елементи, повернуті цим запитом, є цього типу. Наприклад, коли ви надсилаєте **list** Services, відповідь колекції має `kind`, встановлений на [`ServiceList`](/docs/reference/kubernetes-api/service-resources/service-v1/#ServiceList); кожен елемент у цій колекції представляє один Service. Наприклад:

```http
GET /api/v1/services
```

```json
{
  "kind": "ServiceList",
  "apiVersion": "v1",
  "metadata": {
    "resourceVersion": "2947301"
  },
  "items": [
    {
      "metadata": {
        "name": "kubernetes",
        "namespace": "default",
...
      "metadata": {
        "name": "kube-dns",
        "namespace": "kube-system",
...
```

Є десятки типів колекцій (таких як `PodList`, `ServiceList` та `NodeList`), визначених в API Kubernetes. Ви можете отримати більше інформації про кожен тип колекції з довідника [Kubernetes API](/docs/reference/kubernetes-api/).

Деякі інструменти, такі як `kubectl`, представляють механізм колекцій Kubernetes трохи інакше, ніж сам API Kubernetes. Оскільки вихідні дані `kubectl` можуть включати відповідь з декількох операцій **list** на рівні API, `kubectl` представляє список елементів, використовуючи `kind: List`. Наприклад:

```shell
kubectl get services -A -o yaml
```

```yaml
apiVersion: v1
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
items:
- apiVersion: v1
  kind: Service
  metadata:
    creationTimestamp: "2021-06-03T14:54:12Z"
    labels:
      component: apiserver
      provider: kubernetes
    name: kubernetes
    namespace: default
...
- apiVersion: v1
  kind: Service
  metadata:
    annotations:
      prometheus.io/port: "9153"
      prometheus.io/scrape: "true"
    creationTimestamp: "2021-06-03T14:54:14Z"
    labels:
      k8s-app: kube-dns
      kubernetes.io/cluster-service: "true"
      kubernetes.io/name: CoreDNS
    name: kube-dns
    namespace: kube-system
```

{{< note >}}
Памʼятайте, що API Kubernetes не має `kind` з іменем `List`.

`kind: List` є клієнтським внутрішнім деталям реалізації для обробки колекцій, які можуть бути різними типами обʼєктів. Уникайте залежності від `kind: List` в автоматизації або іншому коді.
{{< /note >}}

## Отримання ресурсів у вигляді таблиць {#table-fetches}

Коли ви запускаєте `kubectl get`, стандартний формат виводу є простою табличною репрезентацією одного або кількох екземплярів певного типу ресурсу. У минулому клієнти повинні були відтворювати табличний і описовий вивід, реалізований у `kubectl`, щоб виконувати прості списки обʼєктів. Деякі обмеження цього підходу включають нетривіальну логіку при роботі з певними обʼєктами. Крім того, типи, надані API агрегуванням або сторонніми ресурсами, не відомі під час компіляції. Це означає, що повинні бути реалізовані загальні механізми для типів, які не розпізнаються клієнтом.

Щоб уникнути можливих обмежень, описаних вище, клієнти можуть запитувати табличну репрезентацію обʼєктів, делегуючи серверу специфічні деталі виводу. API Kubernetes реалізує стандартні HTTP-узгодження щодо типу контенту: передача заголовка `Accept`, що містить значення `application/json;as=Table;g=meta.k8s.io;v=v1` з запитом `GET` попросить сервер повернути обʼєкти у форматі таблиці.

Наприклад, список усіх Podʼів у кластері у форматі таблиці.

```http
GET /api/v1/pods
Accept: application/json;as=Table;g=meta.k8s.io;v=v1
---
200 OK
Content-Type: application/json

{
    "kind": "Table",
    "apiVersion": "meta.k8s.io/v1",
    ...
    "columnDefinitions": [
        ...
    ]
}
```

Для типів ресурсів API, які не мають табличного визначення, відомого панелі управління, сервер API повертає стандартну таблицю, яка складається з полів `name` та `creationTimestamp` ресурсу.

```http
GET /apis/crd.example.com/v1alpha1/namespaces/default/resources
---
200 OK
Content-Type: application/json
...

{
    "kind": "Table",
    "apiVersion": "meta.k8s.io/v1",
    ...
    "columnDefinitions": [
        {
            "name": "Name",
            "type": "string",
            ...
        },
        {
            "name": "Created At",
            "type": "date",
            ...
        }
    ]
}
```

Не всі типи ресурсів API підтримують табличну відповідь; наприклад, {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}} можуть не визначати відповідність полів таблиці, а APIService, що [розширює основний API Kubernetes](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) може взагалі не обслуговувати табличні відповіді. Якщо ви створюєте клієнта, що використовує інформацію з таблиці та який повинен працювати з усіма типами ресурсів, включаючи розширення, ви повинні робити запити, які вказують кілька типів контенту у заголовку `Accept`. Наприклад:

```none
Accept: application/json;as=Table;g=meta.k8s.io;v=v1, application/json
```

Якщо клієнт вказує, що приймає тільки `...;as=Table;g=meta.k8s.io;v=v1`, сервери, які не підтримують табличні відповіді, повернуть код помилки 406.

Якщо в цьому випадку бажано повернутися до повних обʼєктів, клієнти можуть додати `,application/json` (або будь-яке інше підтримуване кодування) до свого заголовка Accept і обробляти таблиці або повні обʼєкти у відповіді:

```http
Accept: application/json;as=Table;g=meta.k8s.io;v=v1,application/json`
```

Для отримання додаткової інформації про узгодження типу вмісту див. [MDN Content Negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation).

## Отримання лише метаданих {#metadata-only-fetches}

Щоб отримати часткові метадані обʼєкта, ви можете запросити відповіді тільки з метаданими в заголовку `Accept`. API Kubernetes реалізує варіант узгодження типу вмісту HTTP. Як клієнт, ви можете надати заголовок `Accept` з бажаним типом медіа, а також параметрами, які вказують, що ви хочете отримати тільки метадані. Наприклад: `Accept: application/json;as=PartialObjectMetadata;g=meta.k8s.io;v=v1` для JSON.

Наприклад, щоб отримати перелік усіх подів у кластері, у всіх просторах імен, але повернути тільки метадані для кожного пода:

```http
GET /api/v1/pods
Accept: application/json;as=PartialObjectMetadata;g=meta.k8s.io;v=v1
---
200 OK
Content-Type: application/json

{
    "kind": "PartialObjectMetadataList",
    "apiVersion": "meta.k8s.io/v1",
    "metadata": {
        "resourceVersion": "...",
    },
    "items": [
        {
            "apiVersion": "meta.k8s.io/v1",
            "kind": "PartialObjectMetadata",
            "metadata": {
                "name": "pod-1",
                ...
            }
        },
        {
            "apiVersion": "meta.k8s.io/v1",
            "kind": "PartialObjectMetadata",
            "metadata": {
                "name": "pod-2",
                ...
            }
        }
    ]
}
```

На запит про колекцію сервер API повертає PartialObjectMetadataList. На запит про окремий обʼєкт сервер API повертає представлення PartialObjectMetadata цього обʼєкта. В обох випадках обʼєкти, що повертаються, містять лише поле `metadata`. Поля `spec` та `status` опускаються.

Ця функція корисна для клієнтів, яким потрібно лише перевірити наявність обʼєкта або прочитати його метадані. Вона може значно зменшити розмір відповіді від сервера API.

Ви можете запросити отримання тільки метаданих для всіх доступних типів медіа (JSON, YAML, CBOR і Kubernetes Protobuf). Для Protobuf заголовок `Accept` буде таким:
`application/vnd.kubernetes.protobuf;as=PartialObjectMetadata;g=meta.k8s.io;v=v1`.

Сервер API Kubernetes підтримує часткове отримання даних для майже всіх своїх вбудованих API. Однак ви можете використовувати Kubernetes для доступу до інших серверів API через {{< glossary_tooltip text="aggregation layer" term_id="aggregation-layer" >}}, і ці API можуть не підтримувати часткове отримання даних.

Якщо клієнт використовує заголовок `Accept`, щоб запросити відповідь **тільки** `...;as=PartialObjectMetadata;g=meta.k8s.io;v=v1`, і звертається до API, який не підтримує часткові відповіді, Kubernetes відповість помилкою HTTP 406.

Якщо в цьому випадку бажано повернутися до повних обʼєктів, клієнти можуть додати `,application/json` (або будь-яке інше підтримуване кодування) до свого заголовка Accept і обробляти або PartialObjectMetadata, або повні обʼєкти у відповіді. Рекомендується вказати, що перевага надається частковій відповіді, використовуючи параметр `q` (_quality_). Наприклад:

```http
Accept: application/json;as=PartialObjectMetadata;g=meta.k8s.io;v=v1, application/json;q=0.9
```

Для отримання додаткової інформації про узгодження типу вмісту див. [MDN Content Negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation).

## Видалення ресурсів {#resource-deletion}

Коли ви **видаляєте** ресурс, цей процес проходить у два етапи:

1. *Завершення (finalization)*
2. Видалення (removal)

```yaml
{
  "kind": "ConfigMap",
  "apiVersion": "v1",
  "metadata": {
    "finalizers": ["url.io/neat-finalization", "other-url.io/my-finalizer"],
    "deletionTimestamp": null,
  }
}
```

Коли клієнт вперше надсилає запит на **видалення** ресурсу, `.metadata.deletionTimestamp` встановлюється на поточний час. Після встановлення `.metadata.deletionTimestamp`, зовнішні контролери, які працюють з завершувачами (finalizers), можуть почати виконувати свою очистку в будь-який час, у будь-якому порядку.

Порядок **не** встановлюється примусово між завершувачами, оскільки це може призвести до значного ризику застрягання `.metadata.finalizers`.

Поле `.metadata.finalizers` є спільним: будь-який áктор з дозволом може змінювати його порядок.
Якби список завершувачів оброблявся по порядку, це могло б призвести до ситуації, коли компонент, відповідальний за перший завершувач у списку, чекає на якийсь сигнал (значення поля, зовнішню систему або інше), що створюється компонентом, відповідальним за завершувач пізніше у списку, що призводить до застярягання всього списку.

Без примусового впорядкування завершувачі можуть вільно визначати свій власний порядок і не є вразливими до змін у списку.

Після видалення останнього завершувача ресурс фактично видаляється з etcd.

### Примусове видалення {#force-deletion}

{{< feature-state feature_gate_name="AllowUnsafeMalformedObjectDeletion" >}}

{{< caution >}}
Це може порушити робоче навантаження, повʼязане з примусовим видаленням ресурсу, якщо воно покладається на звичайний потік видалення, що може призвести до руйнування кластера.
{{< /caution >}}

Увімкнувши опцію видалення `ignoreStoreReadErrorWithClusterBreakingPotential`, користувач може виконати небезпечну операцію примусового **видалення** нерозшифрованого/пошкодженого ресурсу. Ця опція знаходиться за функціональною можоивістю ALPHA, і стандартно вона вимкнена. Щоб скористатися цією опцією, оператор кластера повинен увімкнути її за допомогою параметра командного рядка `--feature-gates=AllowUnsafeMalformedObjectDeletion=true`.

{{< note >}}
Користувач, який виконує операцію примусового **видалення**, повинен мати привілеї на виконання обох дієслів **delete** і **unsafe-delete-ignore-read-errors** на даному ресурсі.
{{< /note >}}

Ресурс вважається пошкодженим, якщо він не може бути успішно вилучений зі сховища через а) помилку перетворення (наприклад, помилку розшифрування), або б) обʼєкт не вдалося декодувати. Сервер API спочатку намагається виконати звичайне видалення, і якщо це не вдається з помилкою _corrupt resource_, він запускає операцію примусового видалення. Операція примусового **видалення** є небезпечною, оскільки вона ігнорує обмеження фіналізатора і пропускає перевірку передумов.

Стандартне значення для цієї опції — `false`, це забезпечує зворотну сумісність. Для запиту **delete** з параметром `ignoreStoreReadErrorWithClusterBreakingPotential`, встановленим у значення `true`, поля `dryRun`, `gracePeriodSeconds`, `orphanDependents`, `preconditions` і `propagationPolicy` слід залишити не встановленими.

{{< note >}}
Якщо користувач надсилає запит **delete** зі значенням `ignoreStoreReadErrorWithClusterBreakingPotential`, встановленим у `true` для ресурсу, який інакше можна прочитати, сервер API перериває запит з помилкою.
{{< /note >}}

## API для одного ресурсу {#single-resource-api}

API Kubernetes з дієсловами **get**, **create**, **update**, **patch**, **delete** та **proxy** підтримують тільки одиничні ресурси. Ці дієслова з підтримкою одиничного ресурсу не підтримують надсилання кількох ресурсів разом в упорядкованому або неупорядкованому списку чи транзакції.

Коли клієнти (включаючи kubectl) виконують дії з набором ресурсів, клієнт робить серію одиничних API запитів до ресурсу, а потім, за потреби, агрегує відповіді.

На відміну від цього, API Kubernetes з дієсловами **list** і **watch** дозволяють отримувати кілька ресурсів, а **deletecollection** дозволяє видаляти кілька ресурсів.

## Валідація полів {#field-validation}

Kubernetes завжди перевіряє тип полів. Наприклад, якщо поле в API визначене як число, ви не можете встановити це поле в текстове значення. Якщо поле визначене як масив рядків, ви можете надати тільки масив. Деякі поля можна пропустити, інші поля є обовʼязковими. Пропуск обовʼязкового поля у запиті API є помилкою.

Якщо ви зробите запит з додатковим полем, яке не розпізнається панеллю управління кластера, тоді поведінка сервера API є складнішою.

Типово, сервер API видаляє поля, які він не розпізнає, з вхідних даних, які він отримує (наприклад, тіло JSON запиту `PUT`).

Є дві ситуації, коли сервер API видаляє поля, які ви надали у HTTP-запиті.

Ці ситуації такі:

1. Поле не розпізнається, оскільки воно не входить до схеми OpenAPI ресурсу. (Одним винятком є {{< glossary_tooltip term_id="CustomResourceDefinition" text="CRDs" >}}, які явно обирають не обрізати невідомі поля через `x-kubernetes-preserve-unknown-fields`).
1. Поле дублюється в обʼєкті.

### Валідація для нерозпізнаних або дубльованих полів {#setting-the-field-validation-level}

{{< feature-state feature_gate_name="ServerSideFieldValidation" >}}

З версії 1.25 і далі, нерозпізнані або дубльовані поля в обʼєкті виявляються через валідацію на сервері при використанні HTTP-дієслів, які можуть надсилати дані (`POST`, `PUT` та `PATCH`). Можливі рівні валідації: `Ignore`, `Warn` (стандартно) та `Strict`.

`Ignore`
: Сервер API успішно обробляє запит так, ніби у ньому немає неправильних полів, відкидаючи всі невідомі та дубльовані поля та не повідомляючи про це.

`Warn`
: (Стандартно) Сервер API успішно обробляє запит і надсилає клієнту попередження. Попередження надсилається за допомогою заголовка відповіді `Warning:`, додаючи один елемент попередження для кожного невідомого або дубльованого поля. Для отримання додаткової інформації про попередження та API Kubernetes дивіться статтю блогу [Warning: Helpful Warnings Ahead](/blog/2020/09/03/warnings/).

`Strict`
: Сервер API відхиляє запит з помилкою 400 Bad Request, коли виявляє будь-які невідомі або дубльовані поля. Повідомлення відповіді від сервера API вказує всі невідомі або дубльовані поля, які сервер API виявив.

Рівень валідації полів встановлюється параметром запиту `fieldValidation`.

{{< note >}}
Якщо ви надсилаєте запит, що вказує на нерозпізнане поле, яке також є недійсним з іншої причини (наприклад, запит надає рядкове значення, де API очікує цілого числа для відомого поля), тоді сервер API відповідає з помилкою 400 Bad Request, але не надасть жодної інформації про невідомі або дубльовані поля (тільки про ту фатальну помилку, яку він виявив першою).

У цьому випадку ви завжди отримаєте відповідь про помилку, незалежно від того, який рівень валідації полів ви запросили.
{{< /note >}}

Інструменти, які надсилають запити на сервер (такі як `kubectl`), можуть встановлювати свої власні типові значення, які відрізняються від рівня валідації `Warn`, що стандартно використовується сервером API.

Інструмент `kubectl` використовує прапорець `--validate` для встановлення рівня валідації полів. Він приймає значення `ignore`, `warn` та `strict`, а також приймає значення `true` (еквівалентно `strict`) і `false` (еквівалентно `ignore`). Станадртне налаштування валідації для kubectl — це `--validate=true`, що означає сувору валідацію полів на стороні сервера.

Коли kubectl не може підключитися до сервера API з валідацією полів (сервери API до Kubernetes 1.27), він повернеться до використання валідації на стороні клієнта. Валідація на стороні клієнта буде повністю видалена у майбутній версії kubectl.

{{< note >}}

До Kubernetes 1.25 прапорець `kubectl --validate` використовувався для перемикання валідації на стороні клієнта увімквимкання/вимиканнямнено булевого прапореця.

{{< /note >}}

Починаючи з версії 1.33, Kubernetes (включно з версією {{< skew currentVersion>}}) пропонує спосіб визначення перевірки полів за допомогою _декларативних теґів_. Це корисно для тих, хто бере участь у розробці самого Kubernetes, а також для тих, хто пише власний API з використанням бібліотек Kubernetes. Щоб дізнатися більше, див. [Декларативна перевірка API](/docs/reference/using-api/declarative-validation/).

## Dry-run

{{< feature-state feature_gate_name="DryRun" >}}

При використанні HTTP-дієслів, які можуть змінювати ресурси (`POST`, `PUT`, `PATCH` і `DELETE`), ви можете надіслати свій запит у режимі *dry run*. Режим dry run допомагає оцінити запит через типові етапи обробки запиту (ланцюг допумків, валідацію, конфлікти злиття) аж до збереження обʼєктів у сховищі. Тіло відповіді на запит є максимально наближеним до відповіді у режимі non-dry-run. Kubernetes гарантує, що dry-run запити не будуть збережені в сховищі і не матимуть жодних інших побічних ефектів.

### Виконання dry-run запиту {#make-a-dry-run-request}

Dry-run активується встановленням параметра запиту `dryRun`. Цей параметр є рядковим, діє як перерахування, і єдині прийнятні значення:

[без значення]
: Дозволити побічні ефекти. Ви запитуєте це за допомогою рядка запиту типу `?dryRun` або `?dryRun&pretty=true`. Відповідь є остаточним обʼєктом, який був би збережений, або помилкою, якщо запит не може бути виконаний.

`All`
: Кожен етап виконується як зазвичай, за винятком кінцевого етапу збереження, де побічні ефекти запобігаються.

Коли ви встановлюєте `?dryRun=All`, усі відповідні {{< glossary_tooltip text="контролерів допуску" term_id="admission-controller" >}} виконуються, перевіряючи запит після зміни, злиття виконується для `PATCH`, поля заповнюються станадартними значеннями, і проводиться валідація схеми. Зміни не зберігаються в базовому сховищі, але остаточний обʼєкт, який був би збережений, все ще повертається користувачеві разом із звичайним кодом статусу.

Якщо версія запиту без dry-run викликала б контролер доступу, який має побічні ефекти, запит буде відхилений, щоб уникнути небажаних побічних ефектів. Усі вбудовані втулки контролю доступу підтримують dry-run. Додатково, admission webhooks можуть оголосити у своїй [конфігураційній моделі](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#validatingwebhook-v1-admissionregistration-k8s-io), що вони не мають побічних ефектів, встановивши поле `sideEffects` на `None`.

{{< note >}}
Якщо вебхук дійсно має побічні ефекти, то поле `sideEffects` має бути встановлено на "NoneOnDryRun". Ця зміна є доречною за умови, що вебхук також модифіковано щоб він розумів поле `DryRun` у AdmissionReview і для запобігання побічним ефектам на будь-який запит, позначений як dry run.
{{< /note >}}

Приклад dry-run запиту, який використовує `?dryRun=All`:

```http
POST /api/v1/namespaces/test/pods?dryRun=All
Content-Type: application/json
Accept: application/json
```

Відповідь буде виглядати так само, як для запиту без dry-run, але значення деяких згенерованих полів можуть відрізнятися.

### Згенеровані значення {#generated-values}

Деякі значення обʼєкта зазвичай генеруються перед його збереженням. Важливо не покладатися на значення цих полів, встановлених dry-run запитом, оскільки ці значення, ймовірно, будуть відрізнятися в dry-run режимі від реального запиту. Деякі з цих полів:

* `name`: якщо встановлено `generateName`, `name` матиме унікальне випадкове імʼя
* `creationTimestamp` / `deletionTimestamp`: фіксує час створення/видалення
* `UID`: [унікально ідентифікує](/docs/concepts/overview/working-with-objects/names/#uids) обʼєкт і генерується випадково (недетерміновано)
* `resourceVersion`: відстежує збережену версію обʼєкта
* Будь-яке поле, встановлене мутаційним контролером допуску
* Для ресурсу `Service`: Порти або IP-адреси, які kube-apiserver надає обʼєктам Service

### Авторизація dry-run {#dry-run-authorization}

Авторизація для dry-run і non-dry-run запитів ідентична. Таким чином, щоб виконати dry-run запит, ви повинні мати дозвіл на виконання non-dry-run запиту.

Наприклад, щоб виконати dry-run **patch** для Deployment, ви повинні мати дозвіл на виконання цього **patch**. Ось приклад правила для Kubernetes {{< glossary_tooltip text="RBAC" term_id="rbac">}}, що дозволяє робити patch для Deployment:

```yaml
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["patch"]
```

Дивіться [Огляд авторизації](/docs/reference/access-authn-authz/authorization/).

## Оновлення наявних ресурсів {#patch-and-apply}

Kubernetes надає декілька способів оновлення наявних обʼєктів. Ви можете прочитати [вибір механізму оновлення](#update-mechanism-choose), щоб дізнатися, який підхід найкраще підходить для вашого випадку.

Ви можете перезаписати (**оновити**) наявний ресурс, наприклад, ConfigMap, використовуючи HTTP PUT. Для запиту PUT відповідальність за вказання `resourceVersion` (отриманого з обʼєкта, що оновлюється) лежить на клієнті. Kubernetes використовує інформацію `resourceVersion`, щоб сервер API міг виявити втрачені оновлення і відхилити запити від клієнта, який не актуальний для кластера. У разі зміни ресурсу (коли `resourceVersion`, надана клієнтом, застаріла), сервер API повертає відповідь з помилкою `409 Conflict`.

Замість надсилання запиту PUT клієнт може надіслати інструкцію серверу API для накладання **патчу** до наявного ресурсу. **Патч** зазвичай підходить, якщо зміна, яку клієнт хоче внести, не залежить від наявних даних. Клієнти, яким потрібне ефективне виявлення втрачених оновлень, повинні розглянути можливість зробити свій запит умовним до існуючого `resourceVersion` (або HTTP PUT, або HTTP PATCH), а потім обробити будь-які повтори, які можуть знадобитися у разі конфлікту.

API Kubernetes підтримує чотири різні операції PATCH, які визначаються відповідним заголовком HTTP `Content-Type`:

`application/apply-patch+yaml`
: Серверне застосування YAML (специфічне розширення Kubernetes, засноване на YAML). Всі документи JSON є дійсними в YAML, тому ви також можете надавати JSON, використовуючи цей тип медіа. Дивіться [серіалізація для серверного застосування](/docs/reference/using-api/server-side-apply/#serialization) для отримання додаткової інформації.  Для Kubernetes це операція **створення**, якщо обʼєкт не існує, або операція накладання **патчу**, якщо обʼєкт вже існує.

`application/json-patch+json`
: JSON Patch, як визначено в [RFC6902](https://tools.ietf.org/html/rfc6902). JSON патч — це послідовність операцій, які виконуються з ресурсом; наприклад, `{"op": "add", "path": "/a/b/c", "value": [ "foo", "bar" ]}`. Для Kubernetes це операція накладання **патчу**.  **Патч** з використанням `application/json-patch+json` може включати умови для перевірки консистентності, дозволяючи операції зазнати невдачі, якщо ці умови не виконуються (наприклад, щоб уникнути втрати оновлення).

`application/merge-patch+json`
: JSON Merge Patch, як визначено в [RFC7386](https://tools.ietf.org/html/rfc7386). JSON Merge Patch фактично є частковим представленням ресурсу. Поданий JSON комбінується з поточним ресурсом для створення нового, а потім новий зберігається.  Для Kubernetes це операція накладання **патчу**.

`application/strategic-merge-patch+json`
: Strategic Merge Patch (специфічне розширення Kubernetes на основі JSON). Strategic Merge Patch — це власна реалізація JSON Merge Patch. Ви можете використовувати Strategic Merge Patch лише з вбудованими API або з агрегованими серверами API, які мають спеціальну підтримку для цього. Ви не можете використовувати `application/strategic-merge-patch+json` з будь-яким API, визначеним за допомогою {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}.
  {{< note >}} Механізм *серверного застосування* Kubernetes замінив Strategic Merge Patch. {{< /note >}}

Функція [Серверного застосування](/docs/reference/using-api/server-side-apply/) Kubernetes дозволяє панелі управління відстежувати керовані поля для новостворених обʼєктів. SСерверне застосування забезпечує чітку схему для управління конфліктами полів, пропонує серверні операції **apply** і **update**, та замінює функціональність на стороні клієнта `kubectl apply`.

Для серверного застосування Kubernetes обробляє запит як **створення**, якщо обʼєкт ще не існує, і як **патч** в іншому випадку. Для інших запитів, які використовують PATCH на рівні HTTP, логічна операція Kubernetes завжди є **патч**.

Дивіться [Серверне застосування](/docs/reference/using-api/server-side-apply/) для отримання додаткової інформації.

### Вибір механізму оновлення {#update-mechanism-choose}

#### HTTP PUT для заміни наявного ресурсу {#update-mechanism-update}

Операція **оновлення** (HTTP `PUT`) проста у виконанні та гнучка, але має недоліки:

* Потрібно вирішувати конфлікти, де `resourceVersion` обʼєкта змінюється між моментом його читання клієнтом і спробою записувати назад. Kubernetes завжди виявляє конфлікт, але вам як авторові клієнта потрібно реалізувати повторні спроби.
* Ви можете випадково видаляти поля, якщо декодуєте обʼєкт локально (наприклад, використовуючи client-go, ви можете отримати поля, які ваш клієнт не вміє обробляти, і потім видаляти їх під час оновлення).
* Якщо на обʼєкт накладається багато конкурентних операцій (навіть на поле або набір полів, які ви не намагаєтеся редагувати), ви можете мати проблеми з надсиланням оновлення. Проблема гостріша для великих обʼєктів та для обʼєктів з багатьма полями.

#### HTTP PATCH з використанням JSON Patch {#update-mechanism-json-patch}

Оновлення **патчем** корисне через такі причини:

* Оскільки ви надсилаєте лише різницю, ви маєте менше даних для надсилання у запиті `PATCH`.
* Ви можете робити зміни, які ґрунтуються на наявних значеннях, наприклад, копіювати значення певного поля в анотацію.
* На відміну від **оновлення** (HTTP `PUT`), ваші зміни можуть відбуватися відразу навіть при частих змінах не повʼязаних полів: зазвичай вам не потрібно повторювати спроби.
  * Вам все ще може знадобитися вказати `resourceVersion` (щоб відповідати існуючому обʼєкту), якщо ви хочете бути особливо обережними, щоб уникнути втрати оновлень.
  * Все ж це хороша практика написати деяку логіку повторної спроби у випадку помилок.
* Ви можете використовувати тестові умови для обережного створення конкретних умов оновлення. Наприклад, ви можете збільшити лічильник без його читання, якщо існуюче значення відповідає вашим очікуванням. Ви можете це зробити без ризику втрати оновлення, навіть якщо обʼєкт змінився іншим чином з моменту вашого останнього запису до нього. (Якщо тестова умова не виконається, ви можете використовувати поточне значення і потім записати змінене число).

Проте:

* Вам потрібна більша локальна (клієнтська) логіка для створення патчу; дуже корисно мати реалізацію бібліотеки JSON Patch або навіть створення JSON Patch специально для Kubernetes.
* Як автору клієнтського програмного забезпечення, вам потрібно бути обережним при створенні патчу (тіла запиту HTTP), щоб не видаляти поля (порядок операцій має значення).

#### HTTP PATCH з використанням Server-Side Apply {#update-mechanism-server-side-apply}

Серверне застосування має чіткі переваги:

* Одноразовий прохід веред-назад: зазвичай спочатку не потребує виконання `GET` запиту.
  * і ви все ще можете виявляти конфлікти для неочікуваних змін
  * у вас є можливість примусово перезаписати конфлікт, якщо це доцільно
* Реалізація клієнта легка для створення.
* Ви отримуєте атомарну операцію створення або оновлення без додаткових зусиль (аналогічно `UPSERT` у деяких діалектах SQL).

Проте:

* Серверне застосування зовсім не працює для змін полів, які залежать від поточного значення обʼєкта.
* Ви можете застосовувати оновлення лише до обʼєктів. Деякі ресурси в HTTP API Kubernetes не є обʼєктами (вони не мають поля `.metadata`), а серверне застосування стосується лише обʼєктів Kubernetes.

## Версії ресурсів {#resource-versions}

Версії ресурсів — це рядки, які ідентифікують внутрішню версію обʼєкта на сервері. Версії ресурсів можуть використовуватися клієнтами для визначення змін в обʼєктах або для зазначення вимог до консистентності даних при отриманні, переліку та перегляді ресурсів. Версії ресурсів повинні бути передані на сервер без змін.

Рядки версій ресурсів можна впорядкувати як монотонно зростаючі цілі числа в межах одного типу ресурсів для всіх типів, що обслуговуються kube-apiserver. Сюди входять вбудовані типи API та типи, що підтримуються визначеннями власних ресурсів. Обидві версії ресурсів повинні бути з обʼєктів однієї групи API та одного типу ресурсів. Наприклад, можна порівняти версії ресурсів двох розгортань з групи API застосунків, але не можна порівняти версії ресурсів Pod і Deployment. За умови, що два об’єкти отримано з одного типу ресурсів API, їх можна порівняти, навіть якщо вони знаходяться в різних просторах імен.

Якщо ви використовуєте ресурси API, що обслуговуються сервером розширення API, клієнт повинен перевірити, чи рядок версії ресурсу розпізнається як десяткове число (більш детальна інформація про це наведена в наступних абзацах). Якщо будь-який із двох рядків версії ресурсу не розпізнається як десяткове число, ці два рядки можна перевірити на рівність, але **не можна** покладатися на порівняння для впорядкування.

Починаючи з Kubernetes 1.35, можливість впорядкування версій ресурсів для всіх типів Kubernetes включена до вимог [Certified Kubernetes](https://www.cncf.io/training/certification/software-conformance/). Базові обʼєкти API та власні ресурси користувача **повинні** бути упорядкованими як монотонно зростаюче ціле число для будь-якої реалізації APIServer 1.35+, щоб пройти тести на відповідність.

Щоб порівняти два рядки версій ресурсів:

Переконайтеся, що вони відповідають таким вимогам:

* Обидві версії ресурсів повинні бути одного типу, як описано вище
* Обидві повинні починатися з цифри 1-9 і містити тільки цифри 0-9
* Версії ресурсів порівнюються як довільні десяткові цілі числа з бітовим розміром

Щоб порівняти їх, не покладаючись на фіксований бітовий розмір, можна порівняти їх як рядки. Бітовий розмір не повинен вважатися фіксованою величиною.

Замість цього можна використовувати лексикографічне порівняння, як показано тут:

* Якщо вони не мають однакової довжини, більшою вважається довша (наприклад, "123" > "23")
* Якщо вони мають однакову довжину, більшою вважається лексикографічно більша (наприклад, "234" > "123")

Деякі приклади порівнянь версій ресурсів, які повинні працювати:

* "2345678901234567890123456789012345678901" > "345678901234567890123456789012345678901"
* "345678901234567890123456789012345678901" == "345678901234567890123456789012345678901"
* "345678901234567890123456789012345678900" < "345678901234567890123456789012345678901"

Для виконання цього порівняння доступний допоміжний метод для [client-go](https://pkg.go.dev/k8s.io/apimachinery/pkg/util/resourceversion#CompareResourceVersion).

### Поля `resourceVersion` в метаданих {#resourceversion-in-metadata}

Клієнти знаходять версії ресурсів в ресурсах, включаючи ресурси з потоку відповіді під час **спостереження (watch)** або при отримані **переліку (list)** ресурсів.

[v1.meta/ObjectMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectmeta-v1-meta) — `metadata.resourceVersion` екземпляра ресурсу ідентифікує версію ресурсу, на якій останній раз він був змінений.

[v1.meta/ListMeta](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#listmeta-v1-meta) — `metadata.resourceVersion` колекції ресурсів (відповідь на **перелік (list)**) ідентифікує версію ресурсу, на якій була створена колекція.

### Параметри `resourceVersion` у рядках запитів {#the-resourceversion-parameter}

Операції **отримання (get)**, **переліку (list)** та **спостереження (watch)** підтримують параметр `resourceVersion`. Починаючи з версії v1.19, сервери API Kubernetes також підтримують параметр `resourceVersionMatch` у запитах *list*.

Сервер API інтерпретує параметр `resourceVersion` по-різному, залежно від операції, яку ви запитуєте, та від значення `resourceVersion`. Якщо ви встановлюєте `resourceVersionMatch`, то це також впливає на спосіб порівняння.

### Семантика для операцій **get** та **list** {#semantics-for-get-and-list}

Для операцій **get** та **list**, семантика параметра `resourceVersion` така:

**get:**

| `resourceVersion` невстановлено | `resourceVersion="0"` | `resourceVersion="{значення, відмінне від 0}"` |
|-----------------------|---------------------|----------------------------------------|
| Найновіший            | Будь-яке            | Не старше                              |

**list:**

Починаючи з версії v1.19, сервери API Kubernetes підтримують параметр `resourceVersionMatch` у запитах *list*. Якщо ви встановлюєте як `resourceVersion`, так і `resourceVersionMatch`, то параметр `resourceVersionMatch` визначає, як сервер API інтерпретує `resourceVersion`.

Вам завжди слід встановлювати параметр `resourceVersionMatch`, коли ви встановлюєте `resourceVersion` у запиті **list**. Однак будьте готові обробляти випадок, де сервер API, що відповідає, не підтримує `resourceVersionMatch` та ігнорує його.

Крім випадків сильних вимог до консистентності, використання `resourceVersionMatch=NotOlderThan` та відомої `resourceVersion` є бажаним, оскільки це може забезпечити кращу продуктивність та масштабованість вашого кластеру, ніж залишати `resourceVersion` і `resourceVersionMatch` невстановленими, що вимагає отримання кворуму для обслуговування.

Встановлення параметра `resourceVersionMatch` без встановлення `resourceVersion` є недійсним.

Ця таблиця пояснює поведінку запитів **list** з різними комбінаціями `resourceVersion` та `resourceVersionMatch`:

{{< table caption="Параметри resourceVersionMatch та розбиття на сторінки для list" >}}

| Параметр `resourceVersionMatch`     | Параметри розбиття на сторінки            | `resourceVersion` не встановлено | `resourceVersion="0"` | `resourceVersion="{значення, відмінне від 0}"` |
|-------------------------------------|-------------------------------------------|----------------------------------|-----------------------|------------------------------------------------|
| **не встановлено**                  | **limit не встановлено**                  | Most Recent                      | Any                   | Not older than                                 |
| **не встановлено**                  | limit=\<n\>, **continue не встановлено**  | Most Recent                      | Any                   | Exact                                          |
| **не встановлено**                  | limit=\<n\>, continue=\<token\>           | Continuation                     | Continuation          | Invalid, HTTP `400 Bad Request`                |
| `resourceVersionMatch=Exact`        | **limit не встановлено**                  | Invalid                          | Invalid               | Exact                                          |
| `resourceVersionMatch=Exact`        | limit=\<n\>, **continue не встановлено**  | Invalid                          | Invalid               | Exact                                          |
| `resourceVersionMatch=NotOlderThan` | **limit не встановлено**                  | Invalid                          | Any                   | Not older than                                 |
| `resourceVersionMatch=NotOlderThan` | limit=\<n\>, **continue не встановлено**  | Invalid                          | Any                   | Not older than                                 |

{{< /table >}}

{{< note >}}
Якщо сервер API вашого кластера не враховує параметр `resourceVersionMatch`, поведінка буде такою самою, як і якщо ви його не встановили.
{{< /note >}}

Сенс семантики операцій **get** та **list** такий:

Any
: Повернути дані на будь-якій версії ресурсу. Вибирається найновіша доступна версія ресурсу, але не потрібна сильна консистентність; дані на будь-якій версії ресурсу можуть бути обслуговані. Є можливість отримати дані на значно старішій версії ресурсу, яку клієнт раніше спостерігав, особливо в конфігураціях високої доступності через розділи або застарілі кеші. Клієнти, які не можуть терпіти це, не повинні використовувати цю семантику. Завжди обслуговується з **кешу спостереження**, покращуючи продуктивність та зменшуючи навантаження на etcd.

Most recent
: Повернути дані на найновішій версії ресурсу. Повернені дані повинні бути консистентними (детально: обслуговуються з etcd за допомогою кворумного читання). Для etcd версій v3.4.31+ та v3.5.13+ Kubernetes {{< skew currentVersion >}} обслуговує "найсвіжіші" читання з *watch cache*: внутрішнього, вбудованого в памʼять сховища всередині API сервера, що кешує та відображає стан даних, збережених у etcd. Kubernetes запитує сповіщення про прогрес, щоб підтримувати консистентність кешу з шаром збереження даних (persistence layer) у etcd. Версії Kubernetes з v1.28 до v1.30 також підтримували цю функцію, але як Alpha, вона не рекомендувалася для використання в операційному середовищі і не була стандартно увімкненою до випуску v1.31.

NotOlderThan
: Повернути дані, які є принаймні так новими, як наданий `resourceVersion`. Вибирається найновіша доступна інформація, але будь-яка інформація, яка не старше наданої `resourceVersion`, може бути обслугована. Для запитів **list** до серверів, які підтримують параметр `resourceVersionMatch`, це гарантує, що `.metadata.resourceVersion` колекції не старше вказаної `resourceVersion`, але не надає гарантії щодо `.metadata.resourceVersion` будь-яких елементів у цій колекції. Завжди обслуговується з **кешу спостереження**, покращуючи продуктивність та зменшуючи навантаження на etcd.

Exact
: Повернути дані на точній версії ресурсу, яка надана. Якщо надана `resourceVersion` недоступна, сервер відповідає HTTP `410 Gone`. Для запитів **list** до серверів, які підтримують параметр `resourceVersionMatch`, це гарантує, що `.metadata.resourceVersion` колекції співпадає з `resourceVersion`, яку ви запросили у рядку запиту. Ця гарантія не поширюється на `.metadata.resourceVersion` будь-яких елементів у цій колекції.

  Зі стандартно увімкненою функціональною можливістю `ListFromCacheSnapshot` сервер API намагатиметься надіслати відповідь зі знімка кешу, якщо він доступний з версією `resourceVersion`, старішою за запитувану. Це покращує продуктивність і зменшує навантаження на etcd. Сервер API починає без знімків, створює новий знімок на кожну подію спостереження і зберігає їх, поки не виявить, що etcd був стиснутий, або якщо кеш заповнений подіями старшими за 75 секунд. Якщо надана `resourceVersion` недоступна, сервер повернеться до etcd.

Continuation
: Повертає наступну сторінку даних для запиту посторінкового списку, забезпечуючи узгодженість з точним значенням `resourceVersion`, встановленим початковим запитом у послідовності. Відповідь на **list** запити з обмеженням включає _continue token_, який кодує `resourceVersion` і останню спостережувану позицію, з якої можна продовжити список. Якщо `resourceVersion` у наданому _continue token_ недоступний, сервер відповідає HTTP `410 Gone`. Зі стандартно увімкненою функціональною можливістю `ListFromCacheSnapshot` сервер API намагатиметься надіслати відповідь зі знімка кешу, якщо він доступний з версією `resourceVersion`, старішою за запитувану. Це покращує продуктивність і зменшує навантаження на etcd. Сервер API починає без знімків, створює новий знімок на кожну подію спостереження і зберігає їх, поки не виявить, що etcd був стиснутий, або якщо кеш заповнений подіями старшими за 75 секунд. Якщо надана `resourceVersion` недоступна, сервер повернеться до etcd.

{{< note >}}
Коли ви перелічцєте (**list**) ресурси та отримуєте відповідь у вигляді колекції, відповідь містить [метадані списку](/docs/reference/generated/kubernetes-api/v{{<skew currentVersion >}}/#listmeta-v1-meta) колекції, а також [метадані обʼєктів](/docs/reference/generated/kubernetes-api/v{{<skew currentVersion >}}/#objectmeta-v1-meta) для кожного елемента у цій колекції. Для окремих обʼєктів, знайдених у відповіді колекції, `.metadata.resourceVersion` відстежує, коли цей обʼєкт був останній раз оновлений, а не те, наскільки актуальний обʼєкт, коли він обслуговується.
{{< /note >}}

При використанні `resourceVersionMatch=Не старше` та встановленому ліміті клієнти мають обробляти відповіді HTTP `410 Gone`. Наприклад, клієнт може повторно спробувати з новішою `resourceVersion` або використовувати `resourceVersion=""`.

При використанні `resourceVersionMatch=Точно` та не встановленому ліміті, клієнти мають перевірити, що `.metadata.resourceVersion` колекції співпадає з запитаною `resourceVersion`, і обробити випадок, коли це не так. Наприклад, клієнт може використовувати запит з встановленим лімітом.

### Семантика для операції **watch** {#semantics-for-watch}

Для операцій **watch**, семантика параметра `resourceVersion` така:

**watch:**

{{< table caption="resourceVersion для watch" >}}

| `resourceVersion` невстановлено           | `resourceVersion="0"`        | `resourceVersion="{значення, відмінне від 0}"` |
|-------------------------------------------|------------------------------|----------------------------------------|
| Отримати стан і почати з найновішого      | Отримати стан і почати з будь-якого | Почати точно з                      |

{{< /table >}}

Сенс цієї семантики для **watch** такий:

Отримати стан і почати з будь-якого
: Почати **watch** на будь-якій версії ресурсу; найбільш нова доступна версія є переважною, але не обовʼязковою. Дозволено будь-яку початкову версію ресурсу. Можливо, що **watch** почнеться на набагато старішій версії ресурсу, яку клієнт раніше спостерігав, особливо в конфігураціях високої доступності через розділи або застарілі кеші. Клієнти, які не можуть терпіти таке відмотування назад, не повинні починати **watch** з цією семантикою. Для встановлення початкового стану, **watch** починається з синтетичних подій "Added" для всіх екземплярів ресурсів, які існують на початковій версії ресурсу. Усі наступні події watch стосуються всіх змін, що сталися після початкової версії ресурсу, з якої почався **watch**.

  {{< caution >}}
  Ініціалізовані таким чином **watch** можуть повертати довільно застарілі дані. Будь ласка, перевірте цю семантику перед використанням і надайте перевагу іншій семантиці, де це можливо.
  {{< /caution >}}

Отримати стан і почати з найновішого
: Почати **watch** на найбільш новій версії ресурсу, яка повинна бути консистентною (детально: обслуговується з etcd за допомогою отримання кворуму). Для встановлення початкового стану **watch** починається з синтетичних подій "Added" для всіх екземплярів ресурсів, які існують на початковій версії ресурсу. Усі наступні події watch стосуються всіх змін, що сталися після початкової версії ресурсу, з якої почався **watch**.

Почати точно з
: Почати **watch** на точній версії ресурсу. Події watch стосуються всіх змін після наданої версії ресурсу. На відміну від "Отримати стан і почати з найновішого" та "Отримати стан і почати з будь-якого", **watch** не починається з синтетичних подій "Added" для наданої версії ресурсу. Вважається, що клієнт вже має початковий стан на стартовій версії ресурсу, оскільки клієнт надав цю версію ресурсу.

### Відповіді "410 Gone" {#410-gone-responses}

Сервери не зобовʼязані зберігати всі старі версії ресурсів і можуть повернути код HTTP `410 (Gone)`, якщо клієнт запитує `resourceVersion`, який старіший, ніж версія, збережена сервером. Клієнти повинні бути готові обробляти відповіді `410 (Gone)`. Дивіться розділ [Ефективне виявлення змін](#efficient-detection-of-changes) для отримання додаткової інформації про те, як обробляти відповіді `410 (Gone)` при спостереженні за ресурсами.

Якщо ви запитуєте `resourceVersion`, який знаходиться за межами допустимого діапазону, то, залежно від того, чи обслуговується запит з кешу чи ні, API-сервер може відповісти HTTP-відповіддю `410 Gone`.

### Недоступні версії ресурсів {#unavailable-resource-versions}

Сервери не зобовʼязані обслуговувати нерозпізнані версії ресурсів. Якщо ви запитуєте **list** або **get** для версії ресурсу, яку API-сервер не розпізнає, то API-сервер може або:

* почекати трохи, поки версія ресурсу не стане доступною, а потім завершити з тайм-аутом і відповіддю `504 (Gateway Timeout)`, якщо надана версія ресурсу не стане доступною в розумний термін;
* відповісти заголовком `Retry-After`, вказуючи, через скільки секунд клієнт повинен повторити запит.

Якщо ви запитуєте версію ресурсу, яку API-сервер не розпізнає, kube-apiserver додатково ідентифікує свої відповіді на помилки повідомленням `Too large resource version`.

Якщо ви робите запит **watch** для нерозпізнаної версії ресурсу, API-сервер може чекати невизначений час (до тайм-ауту запиту), поки версія ресурсу не стане доступною.
