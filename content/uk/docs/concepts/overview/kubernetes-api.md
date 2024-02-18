---
reviewers:
- chenopis
title: API Kubernetes
content_type: concept
weight: 40
description: >
  API Kubernetes дозволяє отримувати та маніпулювати станом обʼєктів в Kubernetes. Основа панелі управління Kubernetes — це сервер API та відкритий API HTTP, який він надає. Користувачі, різні частини вашого кластера та зовнішні компоненти взаємодіють одне з одним через сервер API.
card:
  name: концепції
  weight: 30
---

<!-- overview -->

Основа Kubernetes — це {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} з {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}. Сервер API використовує API HTTP, яке дозволяє кінцевим користувачам, різним частинам вашого кластера та зовнішнім компонентам спілкуватися один з одним.

API Kubernetes дозволяє вам отримувати та маніпулювати станом обʼєктів API в Kubernetes (наприклад: Pod, Namespace, ConfigMap та Event).

Більшість операцій можна виконати за допомогою інтерфейсу командного рядка [kubectl](/docs/reference/kubectl/) або інших інструментів командного рядка, таких як [kubeadm](/docs/reference/setup-tools/kubeadm/), які, своєю чергою, використовують API. Однак ви також можете отримати доступ до API безпосередньо за допомогою викликів REST.

Розгляньте використання однієї з [клієнтських бібліотек](/docs/reference/using-api/client-libraries/), якщо ви пишете застосунок для користування API Kubernetes.

<!-- body -->

## Специфікація OpenAPI {#api-specification}

Повні відомості про API задокументовано за допомогою [OpenAPI](https://www.openapis.org/).

### OpenAPI V2

Сервер API Kubernetes надає обʼєднану специфікацію OpenAPI v2 через endpoint `/openapi/v2`. Ви можете запросити формат відповіді, використовуючи заголовки запиту наступним чином:

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

Kubernetes реалізує альтернативний формат серіалізації на основі Protobuf, який призначений головним чином для комунікації всередині кластера. Докладніше про цей формат читайте в [пропозиції дизайну серіалізації Kubernetes Protobuf](https://git.k8s.io/design-proposals-archive/api-machinery/protobuf.md) та файлах мови опису інтерфейсу (IDL) для кожної схеми, які розташовані в пакунках Go, які визначають обʼєкти API.

### OpenAPI V3

{{< feature-state state="stable" for_k8s_version="v1.27" >}}

Kubernetes підтримує публікацію опису своїх API у форматі OpenAPI v3.

Надається endpoint `/openapi/v3` для перегляду списку всіх доступних груп/версій. Цей endpoint повертає лише JSON. Ці групи/версії вказані у наступному форматі:

```yaml
{
    "paths": {
        ...,
        "api/v1": {
            "serverRelativeURL": "/openapi/v3/api/v1?hash=CC0E9BFD992D8C59

AEC98A1E2336F899E8318D3CF4C68944C3DEC640AF5AB52D864AC50DAA8D145B3494F75FA3CFF939FCBDDA431DAD3CA79738B297795818CF"
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
        <td><em>за замовчуванням</em></td>
     </tr>
     <tr>
        <td><code>*</code></td>
        <td><em>обслуговує </em><code>application/json</code></td>
     </tr>
  </tbody>
</table>

Для отримання OpenAPI V3 використовуйте реалізацію Golang, яка надається у пакунку `k8s.io/client-go/openapi3`.

## Стійкість {#persistence}

Kubernetes зберігає серіалізований стан обʼєктів, записуючи їх у {{< glossary_tooltip term_id="etcd" >}}.

## Виявлення API {#api-discovery}

Список всіх груп версій, які підтримує кластер, публікується через кінцеві точки `/api` та `/apis`. Кожна група версій також оголошує список ресурсів, які підтримуються через `/apis/<group>/<version>` (наприклад: `/apis/rbac.authorization.k8s.io/v1alpha1`). Ці кінцеві точки використовуються kubectl для отримання списку ресурсів, які підтримує кластер.

### Сукупне виявлення {#aggregated-discovery}

{{< feature-state state="beta" for_k8s_version="v1.27" >}}

Kubernetes надає бета-підтримку сукупного виявлення, публікуючи всі ресурси, які підтримує кластер, через два endpointʼи (`/api` та `/apis`) порівняно з одним для кожної групи версій. Надсилання запиту до цієї кінцевої точки різко зменшує кількість надісланих запитів для отримання виявлення середнього кластера Kubernetes. Це можна здійснити, запросивши відповідні кінцеві точки із заголовком Accept, що вказує на сукупне виявлення ресурсів: `Accept: application/json;v=v2beta1;g=apidiscovery.k8s.io;as=APIGroupDiscoveryList`.

Цей endpoint також підтримує ETag та кодування Protobuf.

## Групи API та версіювання {#api-groups-and-versioning}

{{< feature-state state="stable" for_k8s_version="v1.8" >}}

Щоб полегшити вилучення полів або перебудову представлень ресурсів, Kubernetes підтримує кілька версій API, кожна з різним API-шляхом, таким як `/api/v1` або `/apis/rbac.authorization.k8s.io/v1alpha1`.

Версіювання робиться на рівні API, а не на рівні ресурсу чи поля, щоб забезпечити чіткий, послідовний погляд на ресурси та поведінку системи, а також для можливості керування доступом до застарілих та/або експериментальних API.

Щоб полегшити еволюцію та розширення свого API, Kubernetes реалізує [API groups](/docs/reference/using-api/#api-groups), які можна [увімкнути або вимкнути](/docs/reference/using-api/#enabling-or-disabling).

Ресурси API розрізняються за їхньою API-групою, типом ресурсу, простором імен (для ресурсів з підтримкою просторів імен) та назвою. Сервер API обробляє конвертацію між версіями API прозоро: всі різні версії фактично є представленням тих самих даних. Сервер API може служити тими самими базовими даними через кілька версій API.

Наприклад, припустимо, є дві версії API, `v1` та `v1beta1`, для того самого ресурсу. Якщо ви спочатку створили обʼєкт, використовуючи версію `v1beta1` його API, ви можете згодом читати, оновлювати чи видаляти цей обʼєкт, використовуючи або версію API `v1beta1`, або версію `v1`, поки версія `v1beta1` не буде застарілою та видаленою. На цьому етапі ви можете продовжувати отримувати доступ та модифікувати обʼєкт, використовуючи API версії `v1`.

### Зміни в API {#api-changes}

{{< feature-state state="stable" for_k8s_version="v1.8" >}}

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
