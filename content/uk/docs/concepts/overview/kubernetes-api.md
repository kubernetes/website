---
reviewers:
- chenopis
title: API Kubernetes
content_type: concept
weight: 40
description: >
  API Kubernetes дозволяє отримувати та маніпулювати станом обʼєктів в Kubernetes. Основа панелі управління Kubernetes — це сервер API та відкритий API HTTP, який він надає. Користувачі, різні частини вашого кластера та зовнішні компоненти взаємодіють одне з одним через сервер API.
card:
  name: concepts
  weight: 30
---

<!-- overview -->

Основа Kubernetes — це {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} з {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}. Сервер API використовує API HTTP, яке дозволяє кінцевим користувачам, різним частинам вашого кластера та зовнішнім компонентам спілкуватися один з одним.

API Kubernetes дозволяє вам отримувати та маніпулювати станом обʼєктів API в Kubernetes (наприклад: Pod, Namespace, ConfigMap та Event).

Більшість операцій можна виконати за допомогою інтерфейсу командного рядка [kubectl](/docs/reference/kubectl/) або інших інструментів командного рядка, таких як [kubeadm](/docs/reference/setup-tools/kubeadm/), які, своєю чергою, використовують API. Однак ви також можете отримати доступ до API безпосередньо за допомогою викликів REST. Розгляньте використання однієї з [клієнтських бібліотек](/docs/reference/using-api/client-libraries/), якщо ви пишете застосунок для користування API Kubernetes.

Кожен кластер Kubernetes публікує специфікацію своїх API, якими він оперує. Kubernetes використовує два механізми для публікації цих специфікацій API; обидва корисні для забезпечення автоматичної сумісності. Наприклад, інструмент `kubectl` отримує та кешує специфікацію API для увімкнення функціонала автозавершення командного рядка та інших функцій. Нижче наведено два підтримуваних механізми:

- [Discovery API](#api-discovery) надає інформацію про API Kubernetes: назви API, ресурси, версії, та операції, які підтримуються. Цей термін є специфічним для Kubernetes, що відділяє API від Kubernetes OpenAPI. Він має на меті надавати опис доступних ресурсів, однак він не надає детальну специфікацію кожного ресурсу. Щоб отримати докладні відомості про схеми ресурсів звертайтесь до документації OpenAPI.
- [Документація Kubernetes OpenAPI](#openapi-interface-definition) надає детальну специфікацію [схем OpenAPI v2.0 та v3.0](https://www.openapis.org/) для всіх точок доступу API Kubernetes. OpenAPI v3.0 є бажаним методом для доступу до OpenAPI, оскільки він надає більш докладну та повну специфікацію API. Цей варіант містить всі можливі API-шляхи, так само як і всі ресурси, що використовуються та створюються для кожної операції на кожному endpoint. Тут також є розширювані компоненти, які підтримуються кластером. Дані містять повну специфікацію та значно перевищують за обсягом те, що надає Discovery API.

## Discovery API

Kubernetes оприлюднює перелік всіх груп версій та ресурсів які підтримуються через Discovery API, що включає для кожного ресурсу наступне:

- Назва
- Обсяг досяжності (`Namespace` або `Cluster`)
- URL Endpoint та підтримувані дії
- Альтернативні назви
- Group, version, kind

API доступний як в агрегованому, так і в не агрегованому вигляді. Агреговане виявлення обслуговує два endpointʼи, тоді як не агреговане — окремий endpoint для кожної групи версії.

### Агреговане виявлення {#aggregated-discovery}

{{< feature-state feature_gate_name="AggregatedDiscoveryEndpoint" >}}

Kubernetes надає підтримку _агрегованого виявлення_, публікуючи всі ресурси, які підтримує кластер, через два endpointʼи (`/api` та `/apis`) порівняно з одним для кожної групи версій. Надсилання запиту до цього endpoint різко зменшує кількість надісланих запитів для отримання даних про кластер Kubernetes. Ви можете отримати доступ до даних надсилаючи запити до відповідних endpointʼів з заголовком `Accept`, що є агрегованим виявленням ресурсів: `Accept: application/json;v=v2;g=apidiscovery.k8s.io;as=APIGroupDiscoveryList`.

Без зазначення типу ресурсів використання заголовка `Accept` стандартна відповідь для `/api` та `/apis` буде не агрегованим виявленням ресурсів.

[Документ виявлення](https://github.com/kubernetes/kubernetes/blob/release-{{< skew currentVersion >}}/api/discovery/aggregated_v2.json) для вбудованих ресурсів можна знайти в репозиторій Kubernetes GitHub. Цей документ Github можна використовувати як довідник базового набору доступних ресурсів, якщо кластер Kubernetes недоступний для запитів.

Точка доступу також підтримує кодування ETag і protobuf.

### Не агреговане виявлення {#unaggregated-discovery}

Без агрегації виявлення інформація публікується рівнями, де кореневі точки доступу публікують дані виявлення для підлеглих документів.

Список усіх версій груп, підтримуваних кластером, публікується в точках доступу `/api` та `/apis`. Наприклад:

```none
{
  "kind": "APIGroupList",
  "apiVersion": "v1",
  "groups": [
    {
      "name": "apiregistration.k8s.io",
      "versions": [
        {
          "groupVersion": "apiregistration.k8s.io/v1",
          "version": "v1"
        }
      ],
      "preferredVersion": {
        "groupVersion": "apiregistration.k8s.io/v1",
        "version": "v1"
      }
    },
    {
      "name": "apps",
      "versions": [
        {
          "groupVersion": "apps/v1",
          "version": "v1"
        }
      ],
      "preferredVersion": {
        "groupVersion": "apps/v1",
        "version": "v1"
      }
    },
    ...
  ]
}
```

Для отримання документа виявлення для кожної версії групи за адресою `/apis/<group>/<version>` (наприклад, `/apis/rbac.authorization.k8s.io/v1alpha1`) потрібні додаткові запити. Ці точки доступу оголошують список ресурсів, що обслуговуються певною версією групи. Ці точки доступу використовуються командою `kubectl` для отримання списку ресурсів, підтримуваних кластером.

<!-- body -->

<a id="#api-specification" />

## Інтерфейс OpenAPI {#openapi-interface-definition}

Докладніше про специфікації OpenAPI дивіться у [документації OpenAPI](https://www.openapis.org/).

Kubernetes працює як з OpenAPI v2.0, так і з OpenAPI v3.0. OpenAPI v3 є кращим методом доступу до OpenAPI, оскільки він пропонує повніше (без втрат) представлення ресурсів Kubernetes. Через обмеження OpenAPI версії 2 певні поля видалено з опублікованого OpenAPI, включаючи, але не обмежуючись, `default`, `nullable`, `oneOf`.

### OpenAPI V2

Сервер API Kubernetes надає агреговану специфікацію OpenAPI v2 через endpoint `/openapi/v2`. Ви можете запросити формат відповіді, використовуючи заголовки запиту наступним чином:

<table>
  <caption style="display:none">Дійсні значення заголовків запиту для запитів OpenAPI v2</caption>
  <thead>
     <tr>
        <th>Заголовок</th>
        <th style="min-width: 50%;">Можливі значення</th>
        <th>Примітки</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>не надання цього заголовка також допустиме</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v2@v1.0+protobuf</code></td>
        <td><em>головним чином для внутрішньокластерного використання</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>типово</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em>обслуговує </em><code>application/json</code></td>
     </tr>
  </tbody>
</table>

### OpenAPI V3

{{< feature-state feature_gate_name="OpenAPIV3" >}}

Kubernetes підтримує публікацію опису своїх API у форматі OpenAPI v3.

Надається endpoint `/openapi/v3` для перегляду списку всіх доступних груп/версій. Цей endpoint повертає лише JSON. Ці групи/версії вказані у наступному форматі:

```yaml
{
    "paths": {
        ...,
        "api/v1": {
            "serverRelativeURL": "/openapi/v3/api/v1?hash=CC0E9BFD992D8C59AEC98A1E2336F899E8318D3CF4C68944C3DEC640AF5AB52D864AC50DAA8D145B3494F75FA3CFF939FCBDDA431DAD3CA79738B297795818CF"
        },
        "apis/admissionregistration.k8s.io/v1": {
            "serverRelativeURL": "/openapi/v3/apis/admissionregistration.k8s.io/v1?hash=E19CC93A116982CE5422FC42B590A8AFAD92CDE9AE4D59B5CAAD568F083AD07946E6CB5817531680BCE6E215C16973CD39003B0425F3477CFD854E89A9DB6597"
        },
        ....
    }
}
```
<!-- для редакторів: свідомо використовуйте yaml замість json, щоб уникнути помилок виділення синтаксису. -->

Відносні URL вказують на незмінний опис OpenAPI для поліпшення кешування на стороні клієнта. Також API-сервер встановлює відповідні заголовки кешування HTTP (`Expires` на 1 рік вперед та `Cache-Control` на `immutable`). При використанні застарілого URL API-сервер повертає перенаправлення на новий URL.

API-сервер Kubernetes публікує специфікацію OpenAPI v3 для кожної групи версій Kubernetes через endpoint `/openapi/v3/apis/<group>/<version>?hash=<hash>`.

Дивіться таблицю нижче для прийнятних заголовків запиту.

<table>
  <caption style="display:none">Дійсні значення заголовків запиту для запитів OpenAPI v3</caption>
  <thead>
     <tr>
        <th>Заголовок</th>
        <th style="min-width: 50%;">Можливі значення</th>
        <th>Примітки</th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td><code>Accept-Encoding</code></td>
        <td><code>gzip</code></td>
        <td><em>не надання цього заголовка також допустиме</em></td>
     </tr>
     <tr>
        <td rowspan="3"><code>Accept</code></td>
        <td><code>application/com.github.proto-openapi.spec.v3@v1.0+protobuf</code></td>
        <td><em>головним чином для внутрішньокластерного використання</em></td>
     </tr>
     <tr>
        <td><code>application/json</code></td>
        <td><em>станадартно/em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em>обслуговує </em><code>application/json</code></td>
     </tr>
  </tbody>
</table>

Реалізація Golang для отримання OpenAPI V3 надається в пакунку [`k8s.io/client-go/openapi3`](https://pkg.go.dev/k8s.io/client-go/openapi3).

Kubernetes {{< skew currentVersion >}} публікує OpenAPI v2.0 та v3.0; найближчим часом підтримка 3.1 не планується.

### Серіалізація Protobuf {#protobuf-serialization}

Kubernetes реалізує альтернативний формат серіалізації на основі Protobuf, який призначений головним чином для комунікації всередині кластера. Докладніше про цей формат читайте в [пропозиції дизайну серіалізації Kubernetes Protobuf](https://git.k8s.io/design-proposals-archive/api-machinery/protobuf.md) та файлах мови опису інтерфейсу (IDL) для кожної схеми, які розташовані в пакунках Go, які визначають обʼєкти API.

## Постійність {#persistence}

Kubernetes зберігає серіалізований стан обʼєктів, записуючи їх у {{< glossary_tooltip term_id="etcd" >}}.

## Групи API та версіювання {#api-groups-and-versioning}

Щоб полегшити вилучення полів або перебудову представлень ресурсів, Kubernetes підтримує кілька версій API, кожна з різним API-шляхом, таким як `/api/v1` або `/apis/rbac.authorization.k8s.io/v1alpha1`.

Версіювання робиться на рівні API, а не на рівні ресурсу чи поля, щоб забезпечити чіткий, послідовний погляд на ресурси та поведінку системи, а також для можливості керування доступом до застарілих та/або експериментальних API.

Щоб полегшити еволюцію та розширення свого API, Kubernetes реалізує [API groups](/docs/reference/using-api/#api-groups), які можна [увімкнути або вимкнути](/docs/reference/using-api/#enabling-or-disabling).

Ресурси API розрізняються за їхньою API-групою, типом ресурсу, простором імен (для ресурсів з підтримкою просторів імен) та назвою. Сервер API обробляє конвертацію між версіями API прозоро: всі різні версії фактично є представленням тих самих даних. Сервер API може служити тими самими базовими даними для кількох версій API.

Наприклад, припустимо, є дві версії API, `v1` та `v1beta1`, для того самого ресурсу. Якщо ви спочатку створили обʼєкт, використовуючи версію `v1beta1` його API, ви можете згодом читати, оновлювати чи видаляти цей обʼєкт, використовуючи або версію API `v1beta1`, або версію `v1`, поки версія `v1beta1` не буде застарілою та видаленою. На цьому етапі ви можете продовжувати отримувати доступ та модифікувати обʼєкт, використовуючи API версії `v1`.

### Зміни в API {#api-changes}

Будь-яка система, яка досягла успіху, повинна рости та змінюватися, коли зʼявляються нові випадки її використання або змінюються поточні. Тому Kubernetes розробив своє API так, щоб він постійно змінювався та ріс. Проєкт Kubernetes має за мету _не_ порушувати сумісність з наявними клієнтами та забезпечити цю сумісність на тривалий час, щоб інші проєкти мали можливість адаптуватися.

Загалом можна часто та періодично додавати нові ресурси API та нові поля ресурсів. Усунення ресурсів чи полів вимагає дотримання [політики застарівання API](/docs/reference/using-api/deprecation-policy/).

Kubernetes твердо зобовʼязується підтримувати сумісність з офіційними API Kubernetes, як тільки вони досягнуть загальної доступності (GA), як правило, у версії API `v1`. Крім того, Kubernetes підтримує сумісність з даними, що зберігаються через _бета-версії_ API офіційних API Kubernetes, і гарантує, що дані можуть бути перетворені та доступні через версії GA API, коли функція стане стабільною.

Якщо ви використовуєте бета-версію API, вам слід перейти до наступної бета- або стабільної версії API, якщо це API набуло зрілості. Найкращий час для цього — під час періоду застарівання бета- API, оскільки обʼєкти одночасно доступні через обидві версії API. Як тільки бета- API завершить свій період застарівання і більше не буде обслуговуватися, слід використовувати версію API-замінник.

{{< note >}}
Попри те, що Kubernetes також ставить перед собою мету зберігати сумісність для версій _альфа_ API, в деяких випадках це неможливо. Якщо ви використовуєте будь-які альфа-версії API, перевірте примітки до випуску Kubernetes при оновленні кластера, в разі змін API, які можуть бути несумісними та вимагати видалення всіх наявних альфа-обʼєктів перед оновленням.
{{< /note >}}

Дивіться [довідник по версіях API](/docs/reference/using-api/#api-versioning) для отримання докладнішої інформації про визначення рівня API.

## Розширення API {#api-extension}

API Kubernetes можна розширити одним з двох способів:

1. [Власні ресурси](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) дозволяють декларативно визначити, як API-сервер повинен надавати вибраний вами ресурс API.
1. Ви також можете розширити API Kubernetes, реалізовуючи [шар агрегації](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).

## {{% heading "whatsnext" %}}

- Дізнайтеся, як розширити API Kubernetes, додаючи свій власний [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/).
- [Контроль доступу до Kubernetes API](/docs/concepts/security/controlling-access/) описує, як кластер керує автентифікацією та авторизацією для доступу до API.
- Дізнайтеся про endpointʼи API, типи ресурсів та зразки з [API Reference](/docs/reference/kubernetes-api/).
- Дізнайтеся про те, що є сумісною зміною та як змінити API, в [Зміни в API](https://git.k8s.io/community/contributors/devel/sig-architecture/api_changes.md#readme).