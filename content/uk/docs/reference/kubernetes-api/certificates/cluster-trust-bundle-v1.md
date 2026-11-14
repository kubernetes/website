---
api_metadata:
  apiVersion: "certificates.k8s.io/v1"
  import: "k8s.io/api/certificates/v1"
  kind: "ClusterTrustBundle"
content_type: "api_reference"
description: |
  ClusterTrustBundle — це контейнер на рівні кластера для анкерів довіри X.509 (кореневих сертифікатів).

  Обʼєкти ClusterTrustBundle вважаються доступними для читання будь-яким автентифікованим користувачем у кластері, оскільки їх можна підключити до подів за допомогою проєкції `clusterTrustBundle`. Усі службові облікові записи зазвичай мають доступ на читання ClusterTrustBundles. Користувачі, які мають доступ до кластера лише на рівні простору імен, можуть читати ClusterTrustBundles, імітуючи службовий обліковий запис, до якого вони мають доступ.

  Він може бути опціонально повʼязаний з конкретним підписувачем, і в цьому випадку він містить один дійсний набір анкерів довіри для цього підписувача. Підписувачі можуть мати кілька повʼязаних ClusterTrustBundles; кожен з них є незалежним набором анкерів довіри для цього підписувача. Контроль доступу використовується для забезпечення того, щоб тільки користувачі з дозволами підписувача могли створювати або модифікувати відповідний пакет.
title: "ClusterTrustBundle"
weight: 20
auto_generated: false
---

`apiVersion: certificates.k8s.io/v1`

`import "k8s.io/api/certificates/v1"`

## ClusterTrustBundle {#ClusterTrustBundle}

ClusterTrustBundle — це контейнер на рівні кластера для анкерів довіри X.509 (кореневих сертифікатів).

Обʼєкти ClusterTrustBundle вважаються такими, що доступні для читання будь-якому автентифікованому користувачу в кластері, оскільки вони можуть бути змонтовані подами за допомогою проєкції `clusterTrustBundle`. Усі службові облікові записи типово мають доступ на читання ClusterTrustBundles. Користувачі, які мають доступ лише на рівні простору імен до кластера, можуть читати ClusterTrustBundles, імітуючи службовий обліковий запис, до якого вони мають доступ.

Він може бути повʼязаний з певним підписувачем, і в цьому випадку він містить один дійсний набір анкерів довіри для цього підписувача. Підписувачі можуть мати кілька повʼязаних ClusterTrustBundles; кожен є незалежним набором анкерів довіри для цього підписувача. Контроль доступу використовується для забезпечення того, щоб лише користувачі з дозволами підписувача могли створювати або змінювати відповідний пакет.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>APIVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>Kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>Метадані містять метадані обʼєкта.</td>
    </tr>
    <tr>
      <td><code>spec</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#ClusterTrustBundleSpec" >}}">ClusterTrustBundleSpec</a></em></td>
      <td>spec містить підписувача (якщо є) та анкери довіри.</td>
    </tr>
  </tbody>
</table>

## ClusterTrustBundleSpec {#ClusterTrustBundleSpec}

ClusterTrustBundleSpec містить підписувача та анкери довіри.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>signerName</code><br/><em>string</em></td>
      <td>signerName вказує на повʼязаного підписувача, якщо такий є. Щоб створити або оновити ClusterTrustBundle з встановленим signerName, ви повинні мати такий дозвіл на рівні кластеру: group=certificates.k8s.io resource=signers resourceName=&lt;назва підписувача&gt; verb=attest. Якщо signerName не порожній, обʼєкт ClusterTrustBundle повинен мати назву з префіксом підписувача (з перетворенням скісних на двокрапки). Наприклад, для назви підписувача <code>example.com/foo</code> допустимі назви обʼєктів ClusterTrustBundle включають <code>example.com:foo:abc</code> та <code>example.com:foo:v1</code>. Якщо signerName порожній, назва обʼєкта ClusterTrustBundle не повинна мати такого префіксу. Запити list/watch для ClusterTrustBundles можуть фільтрувати за цим полем за допомогою селектора полів <code>spec.signerName=NAME</code>.</td>
    </tr>
    <tr>
      <td><code>trustBundle</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>trustBundle містить окремі анкери довіри X.509 для цього пакету, у вигляді PEM-пакету PEM-обгорнутих сертифікатів X.509 у форматі DER. Дані повинні складатися лише з PEM-блоків сертифікатів, які аналізуються як дійсні сертифікати X.509. Кожен сертифікат повинен містити розширення базових обмежень з встановленим бітом CA. Сервер API відхилятиме обʼєкти, що містять дублікати сертифікатів або використовують заголовки PEM-блоків. Користувачі ClusterTrustBundle, включаючи Kubelet, можуть вільно переставляти та видаляти дублікати блоків сертифікатів у цьому файлі відповідно до власної логіки, а також видаляти заголовки PEM-блоків та дані між блоками.</td>
    </tr>
  </tbody>
</table>

## ClusterTrustBundleList {#ClusterTrustBundleList}

ClusterTrustBundleList є колекцією обʼєктів ClusterTrustBundle

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>apiVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>items</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "cluster-trust-bundle-v1#ClusterTrustBundle" >}}">ClusterTrustBundle array</a></em></td>
      <td>Items є колекцією обʼєктів ClusterTrustBundle</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/list-meta-v1-meta#ListMeta" >}}">ListMeta</a></em></td>
      <td>Метадані містять метадані списку.</td>
    </tr>
  </tbody>
</table>

## Операції {#Operations}

---

### `post` Create

#### HTTP Запит {#http-request}

POST /apis/certificates.k8s.io/v1/clustertrustbundles

#### Параметри запиту {#query-parameters}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядача або інструмент командного рядка для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "cluster-trust-bundle-v1#ClusterTrustBundle" >}}">ClusterTrustBundle</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "cluster-trust-bundle-v1#ClusterTrustBundle" >}}">ClusterTrustBundle</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "cluster-trust-bundle-v1#ClusterTrustBundle" >}}">ClusterTrustBundle</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "cluster-trust-bundle-v1#ClusterTrustBundle" >}}">ClusterTrustBundle</a></em></td>
    </tr>
  </tbody>
</table>

### `patch` Patch

#### HTTP Запит {#http-request-1}

PATCH /apis/certificates.k8s.io/v1/clustertrustbundles/{name}

#### Параметри шляху {#path-parameters}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>назва ClusterTrustBundle</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядача або інструмент командного рядка для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>. Це поле є обовʼязковим для запитів apply (application/apply-patch), але необовʼязковим для типів patch, що не є apply (JsonPatch, MergePatch, StrategicMergePatch).</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>force</code></td>
      <td><em>boolean</em></td>
      <td>Force здійснює "примусове" виконання запитів Apply. Це означає, що користувач повторно отримає конфліктні поля, що належать іншим людям. Прапорець Force повинен бути не встановлений для запитів patch, що не є apply.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/patch-v1-meta#Patch" >}}">Patch</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-1}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "cluster-trust-bundle-v1#ClusterTrustBundle" >}}">ClusterTrustBundle</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "cluster-trust-bundle-v1#ClusterTrustBundle" >}}">ClusterTrustBundle</a></em></td>
    </tr>
  </tbody>
</table>

### `put` Replace

#### HTTP Запит {#http-request-2}

PUT /apis/certificates.k8s.io/v1/clustertrustbundles/{name}

#### Параметри шляху {#path-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>назва ClusterTrustBundle</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядача або інструмент командного рядка для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldManager</code></td>
      <td><em>string</em></td>
      <td>fieldManager є імʼям, повʼязаним з а́ктором або сутністю, яка вносить ці зміни. Значення повинно бути менше або дорівнювати 128 символам і містити лише друковані символи, як визначено в <a href="https://golang.org/pkg/unicode/#IsPrint">https://golang.org/pkg/unicode/#IsPrint</a>.</td>
    </tr>
    <tr>
      <td><code>fieldValidation</code></td>
      <td><em>string</em></td>
      <td>fieldValidation інструктує сервер, як обробляти обʼєкти в запиті (POST/PUT/PATCH), що містять невідомі або дубльовані поля. Дійсні значення:
      <ul>
        <li>Ignore: Ігнорує всі невідомі поля, які без попередження видаляються з обʼєкта, а також ігнорує всі дублікати полів, крім останнього, на які натрапляє декодер. Це стандартна поведінка до v1.23.</li>
        <li>Warn: Надсилає попередження через стандартний заголовок відповіді для кожного невідомого поля, яке видаляється з обʼєкта, і для кожного дубльованого поля, яке зустрічається. Запит все ще буде успішним, якщо немає інших помилок, і буде зберігатися лише останнє з будь-яких дубльованих полів. Це стандартна поведінка у v1.23+</li>
        <li>Strict: У цьому випадку запит завершиться з помилкою BadRequest, якщо з обʼєкта будуть вилучені невідомі поля або якщо будуть виявлені дублікати полів. Помилка, що повертається сервером, міститиме всі виявлені невідомі та дубльовані поля.</li>
      </ul></td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "cluster-trust-bundle-v1#ClusterTrustBundle" >}}">ClusterTrustBundle</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-2}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "cluster-trust-bundle-v1#ClusterTrustBundle" >}}">ClusterTrustBundle</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "cluster-trust-bundle-v1#ClusterTrustBundle" >}}">ClusterTrustBundle</a></em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete

#### HTTP Запит {#http-request-3}

DELETE /apis/certificates.k8s.io/v1/clustertrustbundles/{name}

#### Параметри шляху {#path-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>назва ClusterTrustBundle</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядача або інструмент командного рядка для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>gracePeriodSeconds</code></td>
      <td><em>integer</em></td>
      <td>Тривалість у секундах перед видаленням обʼєкта. Значення повинно бути невідʼємним цілим числом. Значення нуль вказує на негайне видалення. Якщо це значення дорівнює nil, буде використано стандартний період очікування для вказаного типу. Стандартно — значення для кожного обʼєкта, якщо не вказано. Нуль означає негайне видалення.</td>
    </tr>
    <tr>
      <td><code>ignoreStoreReadErrorWithClusterBreakingPotential</code></td>
      <td><em>boolean</em></td>
      <td>якщо встановлено true, це запустить небезпечне видалення ресурсу у випадку, якщо звичайний процес видалення завершується помилкою пошкодженого обʼєкта. Ресурс вважається пошкодженим, якщо його не вдається успішно отримати з базового сховища через a) неможливість трансформації даних (наприклад, помилка розшифрування), або b) неможливість декодування в обʼєкт. ПРИМІТКА: небезпечне видалення ігнорує обмеження фіналізаторів, пропускає перевірки попередніх умов і видаляє обʼєкт зі сховища. ПОПЕРЕДЖЕННЯ: це може потенційно порушити кластер, якщо робоче навантаження, повʼязане з ресурсом, що видаляється небезпечним чином, покладається на звичайний процес видалення. Використовуйте лише якщо ВИ ПОВНІСТЮ розумієте, що робите. Стандартне значення — false, і користувач повинен погодитися на активацію.</td>
    </tr>
    <tr>
      <td><code>orphanDependents</code></td>
      <td><em>boolean</em></td>
      <td>Застаріле: будь ласка, використовуйте PropagationPolicy, це поле буде застарілим у версії 1.7. Чи повинні залежні обʼєкти бути осиротілими. Якщо true/false, фіналізатор "orphan" буде додано/видалено зі списку фіналізаторів обʼєкта. Може бути встановлено або це поле, або PropagationPolicy, але не обидва.</td>
    </tr>
    <tr>
      <td><code>propagationPolicy</code></td>
      <td><em>string</em></td>
      <td>Чи та як буде виконано збирання сміття. Може бути встановлено або це поле, або OrphanDependents, але не обидва. Стандартна політика визначається наявним фіналізатором у metadata.finalizers та стандартною політикою для конкретного ресурсу. Допустимі значення: 'Orphan' — осиротити залежні обʼєкти; 'Background' — дозволити збирачу сміття видалити залежні обʼєкти у фоновому режимі; 'Foreground' — каскадна політика, яка видаляє всі залежні обʼєкти у передньому плані.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/delete-options-v1-meta#DeleteOptions" >}}">DeleteOptions</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-3}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/status-v1-meta#Status" >}}">Status</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "../definitions/status-v1-meta#Status" >}}">Status</a></em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete Collection

#### HTTP Запит {#http-request-4}

DELETE /apis/certificates.k8s.io/v1/clustertrustbundles

#### Параметри запиту {#query-parameters-4}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядача або інструмент командного рядка для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Параметр continue слід встановлювати при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не визнає. Якщо вказане значення continue більше не дійсне через термін дії (зазвичай від пʼяти до пʼятнадцяти хвилин) або зміну конфігурації на сервері, сервер поверне помилку 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, його необхідно перезапустити без поля continue. В іншому випадку клієнт може надіслати інший запит на отримання списку з токеном, отриманим з помилкою 410, і сервер поверне список, починаючи з наступного ключа, але з останнього знімка, що є непослідовним з попередніми результатами списку — обʼєкти, створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, поки їхні ключі знаходяться після "наступного ключа".  Це поле не підтримується, коли watch дорівнює true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>dryRun</code></td>
      <td><em>string</em></td>
      <td>Коли параметр присутній, це вказує, що зміни не повинні зберігатися. Неправильна або нерозпізнана директива dryRun призведе до помилки та припинення обробки запиту. Дійсні значення:
      <ul>
        <li>All: всі етапи dry run будуть виконані</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку повернутих обʼєктів за їхніми полями. Стандартно — все.</td>
    </tr>
    <tr>
      <td><code>gracePeriodSeconds</code></td>
      <td><em>integer</em></td>
      <td>Тривалість у секундах перед видаленням обʼєкта. Значення повинно бути невідʼємним цілим числом. Значення нуль вказує на негайне видалення. Якщо це значення дорівнює nil, буде використано стандартний період очікування для вказаного типу. Стандартно — значення для кожного обʼєкта, якщо не вказано. Нуль означає негайне видалення.</td>
    </tr>
    <tr>
      <td><code>ignoreStoreReadErrorWithClusterBreakingPotential</code></td>
      <td><em>boolean</em></td>
      <td>якщо встановлено true, це запустить небезпечне видалення ресурсу у випадку, якщо звичайний процес видалення завершується помилкою пошкодженого обʼєкта. Ресурс вважається пошкодженим, якщо його не вдається успішно отримати з базового сховища через a) неможливість трансформації даних (наприклад, помилка розшифрування), або b) неможливість декодування в обʼєкт. ПРИМІТКА: небезпечне видалення ігнорує обмеження фіналізаторів, пропускає перевірки попередніх умов і видаляє обʼєкт зі сховища. ПОПЕРЕДЖЕННЯ: це може потенційно порушити кластер, якщо робоче навантаження, повʼязане з ресурсом, що видаляється небезпечним чином, покладається на звичайний процес видалення. Використовуйте лише якщо ВИ ПОВНІСТЮ розумієте, що робите. Стандартне значення — false, і користувач повинен погодитися на активацію.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку повернутих обʼєктів за їхніми мітками. Стандартно — все.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit — це максимальна кількість відповідей для повернення у виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення ліміту може повернути менше запитаної кількості елементів (до нуля елементів), якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати наявність поля continue для визначення наявності додаткових результатів. Сервери можуть не підтримувати аргумент limit і повертатимуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що додаткові результати відсутні. Це поле не підтримується, якщо watch дорівнює true.  Гарантується, що обʼєкти, повернуті при використанні continue, будуть ідентичними одноразовому виклику списку без ліміту — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені у наступні запити з continue. Це іноді називається послідовним знімком і забезпечує клієнту, який використовує limit для отримання менших частин дуже великого результату, можливість побачити всі можливі обʼєкти. Якщо обʼєкти оновлюються під час розбитого на частини списку, повертається версія обʼєкта, яка була на момент розрахунку першого результату списку.</td>
    </tr>
    <tr>
      <td><code>orphanDependents</code></td>
      <td><em>boolean</em></td>
      <td>Застаріле: будь ласка, використовуйте PropagationPolicy, це поле буде застарілим у версії 1.7. Чи повинні залежні обʼєкти бути осиротілими. Якщо true/false, фіналізатор "orphan" буде додано/видалено зі списку фіналізаторів обʼєкта. Може бути встановлено або це поле, або PropagationPolicy, але не обидва.</td>
    </tr>
    <tr>
      <td><code>propagationPolicy</code></td>
      <td><em>string</em></td>
      <td>Чи та як буде виконано збирання сміття. Може бути встановлено або це поле, або OrphanDependents, але не обидва. Стандартна політика визначається наявним фіналізатором у metadata.finalizers та стандартною політикою для конкретного ресурсу. Допустимі значення: 'Orphan' — осиротити залежні обʼєкти; 'Background' — дозволити збирачу сміття видалити залежні обʼєкти у фоновому режимі; 'Foreground' — каскадна політика, яка видаляє всі залежні обʼєкти у передньому плані.</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження щодо того, з яких версій ресурсу може обслуговуватися запит. Детальніше: <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Наполегливо рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Детальніше: <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:<br/> - <code>resourceVersionMatch</code> = NotOlderThan інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.<br/> - <code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список повернутих обʼєктів за допомогою виразу селектора шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для визначення одного або кількох діапазонів хешів:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Шляхи до полів використовують синтаксис CEL з коренем обʼєкта (наприклад, "object.metadata.uid"), а НЕ формат fieldSelector ("metadata.uid"). Наразі підтримуються шляхи:   - object.metadata.uid   - object.metadata.namespace  hexStart та hexEnd — одинарні рядкові літерали CEL з префіксом '0x', що визначають включну нижню та виключну верхню межі простору хешів FNV-1a розміром 64 біти. Повний діапазон — [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:   Розщеплення на 2 шарди:     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   Розщеплення на 4 шарди:     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  Це альфа-поле і потребує увімкнення функціональної можливості ShardedListAndWatch.</td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику списку/спостереження. Це обмежує тривалість виклику, незалежно від активності чи бездіяльності.</td>
    </tr>
  </tbody>
</table>

#### Параметри тіла запиту {#body-parameters-4}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "../definitions/delete-options-v1-meta#DeleteOptions" >}}">DeleteOptions</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-4}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/status-v1-meta#Status" >}}">Status</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Read

#### HTTP Запит {#http-request-5}

GET /apis/certificates.k8s.io/v1/clustertrustbundles/{name}

#### Параметри шляху {#path-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>назва ClusterTrustBundle</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-5}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядача або інструмент командного рядка для роботи з HTTP (curl та wget).</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-5}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "cluster-trust-bundle-v1#ClusterTrustBundle" >}}">ClusterTrustBundle</a></em></td>
    </tr>
  </tbody>
</table>

### `get` List

#### HTTP Запит {#http-request-6}

GET /apis/certificates.k8s.io/v1/clustertrustbundles

#### Параметри запиту {#query-parameters-6}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядача або інструмент командного рядка для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>Дозволяє запити подій спостереження з типом "BOOKMARK". Сервери, які не реалізовують закладки, можуть ігнорувати цей прапорець, а закладки надсилаються на розсуд сервера. Клієнти не повинні припускати, що закладки повертаються через будь-який конкретний інтервал, а також не повинні припускати, що сервер надсилатиме будь-яку подію BOOKMARK під час сеансу. Якщо це не спостереження, це поле ігнорується.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Параметр continue слід встановлювати при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не визнає. Якщо вказане значення continue більше не дійсне через термін дії (зазвичай від пʼяти до пʼятнадцяти хвилин) або зміну конфігурації на сервері, сервер поверне помилку 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, його необхідно перезапустити без поля continue. В іншому випадку клієнт може надіслати інший запит на отримання списку з токеном, отриманим з помилкою 410, і сервер поверне список, починаючи з наступного ключа, але з останнього знімка, що є непослідовним з попередніми результатами списку — обʼєкти, створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, поки їхні ключі знаходяться після "наступного ключа".  Це поле не підтримується, коли watch дорівнює true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку повернутих обʼєктів за їхніми полями. Стандартно — все.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку повернутих обʼєктів за їхніми мітками. Стандартно — все.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit — це максимальна кількість відповідей для повернення у виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення ліміту може повернути менше запитаної кількості елементів (до нуля елементів), якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати наявність поля continue для визначення наявності додаткових результатів. Сервери можуть не підтримувати аргумент limit і повертатимуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що додаткові результати відсутні. Це поле не підтримується, якщо watch дорівнює true.  Гарантується, що обʼєкти, повернуті при використанні continue, будуть ідентичними одноразовому виклику списку без ліміту — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені у наступні запити з continue. Це іноді називається послідовним знімком і забезпечує клієнту, який використовує limit для отримання менших частин дуже великого результату, можливість побачити всі можливі обʼєкти. Якщо обʼєкти оновлюються під час розбитого на частини списку, повертається версія обʼєкта, яка була на момент розрахунку першого результату списку.</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження щодо того, з яких версій ресурсу може обслуговуватися запит. Детальніше: <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Наполегливо рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Детальніше: <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:<br/> - <code>resourceVersionMatch</code> = NotOlderThan інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.<br/> - <code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список повернутих обʼєктів за допомогою виразу селектора шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для визначення одного або кількох діапазонів хешів:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Шляхи до полів використовують синтаксис CEL з коренем обʼєкта (наприклад, "object.metadata.uid"), а НЕ формат fieldSelector ("metadata.uid"). Наразі підтримуються шляхи:   - object.metadata.uid   - object.metadata.namespace  hexStart та hexEnd — одинарні рядкові літерали CEL з префіксом '0x', що визначають включну нижню та виключну верхню межі простору хешів FNV-1a розміром 64 біти. Повний діапазон — [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:   Розщеплення на 2 шарди:     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   Розщеплення на 4 шарди:     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  Це альфа-поле і потребує увімкнення функціональної можливості ShardedListAndWatch.</td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику списку/спостереження. Це обмежує тривалість виклику, незалежно від активності чи бездіяльності.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Спостерігати за змінами описаних ресурсів і повертати їх як потік сповіщень про додавання, оновлення та видалення. Вкажіть resourceVersion.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-6}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "cluster-trust-bundle-v1#ClusterTrustBundleList" >}}">ClusterTrustBundleList</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Watch

#### HTTP Запит {#http-request-7}

GET /apis/certificates.k8s.io/v1/watch/clustertrustbundles/{name}

#### Параметри шляху {#path-parameters-4}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>назва ClusterTrustBundle</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-7}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>Дозволяє запити подій спостереження з типом "BOOKMARK". Сервери, які не реалізовують закладки, можуть ігнорувати цей прапорець, а закладки надсилаються на розсуд сервера. Клієнти не повинні припускати, що закладки повертаються через будь-який конкретний інтервал, а також не повинні припускати, що сервер надсилатиме будь-яку подію BOOKMARK під час сеансу. Якщо це не спостереження, це поле ігнорується.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Параметр continue слід встановлювати при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не визнає. Якщо вказане значення continue більше не дійсне через термін дії (зазвичай від пʼяти до пʼятнадцяти хвилин) або зміну конфігурації на сервері, сервер поверне помилку 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, його необхідно перезапустити без поля continue. В іншому випадку клієнт може надіслати інший запит на отримання списку з токеном, отриманим з помилкою 410, і сервер поверне список, починаючи з наступного ключа, але з останнього знімка, що є непослідовним з попередніми результатами списку — обʼєкти, створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, поки їхні ключі знаходяться після "наступного ключа".  Це поле не підтримується, коли watch дорівнює true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку повернутих обʼєктів за їхніми полями. Стандартно — все.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку повернутих обʼєктів за їхніми мітками. Стандартно — все.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit — це максимальна кількість відповідей для повернення у виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення ліміту може повернути менше запитаної кількості елементів (до нуля елементів), якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати наявність поля continue для визначення наявності додаткових результатів. Сервери можуть не підтримувати аргумент limit і повертатимуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що додаткові результати відсутні. Це поле не підтримується, якщо watch дорівнює true.  Гарантується, що обʼєкти, повернуті при використанні continue, будуть ідентичними одноразовому виклику списку без ліміту — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені у наступні запити з continue. Це іноді називається послідовним знімком і забезпечує клієнту, який використовує limit для отримання менших частин дуже великого результату, можливість побачити всі можливі обʼєкти. Якщо обʼєкти оновлюються під час розбитого на частини списку, повертається версія обʼєкта, яка була на момент розрахунку першого результату списку.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядача або інструмент командного рядка для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження щодо того, з яких версій ресурсу може обслуговуватися запит. Детальніше: <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Наполегливо рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Детальніше: <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:<br/> - <code>resourceVersionMatch</code> = NotOlderThan інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.<br/> - <code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список повернутих обʼєктів за допомогою виразу селектора шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для визначення одного або кількох діапазонів хешів:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Шляхи до полів використовують синтаксис CEL з коренем обʼєкта (наприклад, "object.metadata.uid"), а НЕ формат fieldSelector ("metadata.uid"). Наразі підтримуються шляхи:   - object.metadata.uid   - object.metadata.namespace  hexStart та hexEnd — одинарні рядкові літерали CEL з префіксом '0x', що визначають включну нижню та виключну верхню межі простору хешів FNV-1a розміром 64 біти. Повний діапазон — [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:   Розщеплення на 2 шарди:     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   Розщеплення на 4 шарди:     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  Це альфа-поле і потребує увімкнення функціональної можливості ShardedListAndWatch.</td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику списку/спостереження. Це обмежує тривалість виклику, незалежно від активності чи бездіяльності.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Спостерігати за змінами описаних ресурсів і повертати їх як потік сповіщень про додавання, оновлення та видалення. Вкажіть resourceVersion.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-7}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/watch-event-v1-meta#WatchEvent" >}}">WatchEvent</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Watch List

#### HTTP Запит {#http-request-8}

GET /apis/certificates.k8s.io/v1/watch/clustertrustbundles

#### Параметри запиту {#query-parameters-8}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>allowWatchBookmarks</code></td>
      <td><em>boolean</em></td>
      <td>Дозволяє запити подій спостереження з типом "BOOKMARK". Сервери, які не реалізовують закладки, можуть ігнорувати цей прапорець, а закладки надсилаються на розсуд сервера. Клієнти не повинні припускати, що закладки повертаються через будь-який конкретний інтервал, а також не повинні припускати, що сервер надсилатиме будь-яку подію BOOKMARK під час сеансу. Якщо це не спостереження, це поле ігнорується.</td>
    </tr>
    <tr>
      <td><code>continue</code></td>
      <td><em>string</em></td>
      <td>Параметр continue слід встановлювати при отриманні додаткових результатів від сервера. Оскільки це значення визначається сервером, клієнти можуть використовувати значення continue лише з попереднього результату запиту з ідентичними параметрами запиту (крім значення continue), і сервер може відхилити значення continue, яке він не визнає. Якщо вказане значення continue більше не дійсне через термін дії (зазвичай від пʼяти до пʼятнадцяти хвилин) або зміну конфігурації на сервері, сервер поверне помилку 410 ResourceExpired разом з токеном continue. Якщо клієнту потрібен послідовний список, його необхідно перезапустити без поля continue. В іншому випадку клієнт може надіслати інший запит на отримання списку з токеном, отриманим з помилкою 410, і сервер поверне список, починаючи з наступного ключа, але з останнього знімка, що є непослідовним з попередніми результатами списку — обʼєкти, створені, змінені або видалені після першого запиту списку, будуть включені у відповідь, поки їхні ключі знаходяться після "наступного ключа".  Це поле не підтримується, коли watch дорівнює true. Клієнти можуть почати спостереження з останнього значення resourceVersion, повернутого сервером, і не пропустити жодних змін.</td>
    </tr>
    <tr>
      <td><code>fieldSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку повернутих обʼєктів за їхніми полями. Стандартно — все.</td>
    </tr>
    <tr>
      <td><code>labelSelector</code></td>
      <td><em>string</em></td>
      <td>Селектор для обмеження списку повернутих обʼєктів за їхніми мітками. Стандартно — все.</td>
    </tr>
    <tr>
      <td><code>limit</code></td>
      <td><em>integer</em></td>
      <td>limit — це максимальна кількість відповідей для повернення у виклику списку. Якщо існує більше елементів, сервер встановить поле <code>continue</code> у метаданих списку на значення, яке можна використовувати з тим самим початковим запитом для отримання наступного набору результатів. Встановлення ліміту може повернути менше запитаної кількості елементів (до нуля елементів), якщо всі запитані обʼєкти відфільтровані, і клієнти повинні використовувати наявність поля continue для визначення наявності додаткових результатів. Сервери можуть не підтримувати аргумент limit і повертатимуть усі доступні результати. Якщо limit вказано, а поле continue порожнє, клієнти можуть припустити, що додаткові результати відсутні. Це поле не підтримується, якщо watch дорівнює true.  Гарантується, що обʼєкти, повернуті при використанні continue, будуть ідентичними одноразовому виклику списку без ліміту — тобто жодні обʼєкти, створені, змінені або видалені після першого запиту, не будуть включені у наступні запити з continue. Це іноді називається послідовним знімком і забезпечує клієнту, який використовує limit для отримання менших частин дуже великого результату, можливість побачити всі можливі обʼєкти. Якщо обʼєкти оновлюються під час розбитого на частини списку, повертається версія обʼєкта, яка була на момент розрахунку першого результату списку.</td>
    </tr>
    <tr>
      <td><code>pretty</code></td>
      <td><em>string</em></td>
      <td>Якщо 'true', то вихідні дані форматуються у зручному для читання вигляді. Зазвичай 'false', якщо user-agent не вказує оглядача або інструмент командного рядка для роботи з HTTP (curl та wget).</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження щодо того, з яких версій ресурсу може обслуговуватися запит. Детальніше: <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Наполегливо рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Детальніше: <a href="/uk/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td><code>sendInitialEvents=true</code> може бути встановлено разом з <code>watch=true</code>. У цьому випадку потік спостереження почнеться з синтетичних подій для відтворення поточного стану обʼєктів у колекції. Після надсилання всіх таких подій буде надіслано синтетичну подію "Bookmark". Закладка повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Після цього потік спостереження продовжиться як зазвичай, надсилаючи події спостереження, що відповідають змінам (після RV) для спостережуваних обʼєктів. Коли встановлено опцію <code>sendInitialEvents</code>, ми вимагаємо також встановлення опції <code>resourceVersionMatch</code>. Семантика запиту спостереження наступна:<br/> - <code>resourceVersionMatch</code> = NotOlderThan інтерпретується як «дані, що є принаймні такими ж новими, як зазначена <code>resourceVersion</code>», і подія bookmark надсилається, коли стан синхронізується з <code>resourceVersion</code>, яка є принаймні такою ж актуальною, як та, що вказана в ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як «послідовне читання», і подія bookmark надсилається, коли стан синхронізується принаймні до моменту, коли почалася обробка запиту.<br/> - <code>resourceVersionMatch</code>, встановлений на будь-яке інше значення або не встановлений — повертається помилка Invalid. Стандартне значення true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань сумісності) і false в іншому випадку.</td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список повернутих обʼєктів за допомогою виразу селектора шардів на основі CEL. Формат використовує функцію shardRange() у поєднанні з || (логічне АБО) для визначення одного або кількох діапазонів хешів:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Шляхи до полів використовують синтаксис CEL з коренем обʼєкта (наприклад, "object.metadata.uid"), а НЕ формат fieldSelector ("metadata.uid"). Наразі підтримуються шляхи:   - object.metadata.uid   - object.metadata.namespace  hexStart та hexEnd — одинарні рядкові літерали CEL з префіксом '0x', що визначають включну нижню та виключну верхню межі простору хешів FNV-1a розміром 64 біти. Повний діапазон — [0x0, 0x10000000000000000), де виключна верхня межа дорівнює 2^64.  Приклади:   Розщеплення на 2 шарди:     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')     шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')   Розщеплення на 4 шарди:     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')     шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')     шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')     шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')  Це альфа-поле і потребує увімкнення функціональної можливості ShardedListAndWatch.</td>
    </tr>
    <tr>
      <td><code>timeoutSeconds</code></td>
      <td><em>integer</em></td>
      <td>Час очікування для виклику списку/спостереження. Це обмежує тривалість виклику, незалежно від активності чи бездіяльності.</td>
    </tr>
    <tr>
      <td><code>watch</code></td>
      <td><em>boolean</em></td>
      <td>Спостерігати за змінами описаних ресурсів і повертати їх як потік сповіщень про додавання, оновлення та видалення. Вкажіть resourceVersion.</td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-8}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "../definitions/watch-event-v1-meta#WatchEvent" >}}">WatchEvent</a></em></td>
    </tr>
  </tbody>
</table>
