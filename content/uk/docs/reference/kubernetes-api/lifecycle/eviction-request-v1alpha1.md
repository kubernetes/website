---
api_metadata:
  apiVersion: "lifecycle.k8s.io/v1alpha1"
  import: "k8s.io/api/lifecycle/v1alpha1"
  kind: "EvictionRequest"
content_type: "api_reference"
description: |
  EvictionRequest визначає запит, який має призвести до коректного виселення .spec.target (наприклад, завершення поду).

  Контролер evictionrequest відстежує наміри всіх запитів EvictionRequest і перетворює їх на об’єкти Eviction.

  - .spec.requester встановлюється як мітка об’єкта Eviction для полегшення пошуку.
  - Кожній цілі може бути призначено набір реагувальників. Об’єкти Eviction відстежуються цими реагувальниками, які реалізують логіку виселення та оновлюють статус об’єкта Eviction відповідно до прогресу.

  Існує звʼязок «багато-до-багатьох» між EvictionRequest та Eviction загалом. І «багато-до-одного», якщо ціллю є под.

  Якщо всі заявники відкликують свій намір виселення для спільної цілі, виселення буде скасовано. Видалення EvictionRequest також зараховується як відкликання. Після видалення всіх EvictionRequest для певної цілі відповідні Eviction врешті-решт будуть прибрані збирачем сміття.
title: "EvictionRequest"
weight: 20
auto_generated: false
---

`apiVersion: lifecycle.k8s.io/v1alpha1`

`import "k8s.io/api/lifecycle/v1alpha1"`

## EvictionRequest {#EvictionRequest}

EvictionRequest визначає запит, який має призвести до коректного виселення .spec.target (наприклад, завершення поду).

Контролер evictionrequest відстежує наміри всіх запитів EvictionRequest і перетворює їх на об’єкти Eviction.

- .spec.requester встановлюється як мітка на Eviction для полегшення пошуку.
- Кожній цілі може бути призначено набір реагувальників. Об’єкти Eviction відстежуються цими реагувальниками, які реалізують логіку виселення та оновлюють статус об’єкта Eviction відповідно до прогресу.

Існує звʼязок «багато-до-багатьох» між EvictionRequest та Eviction загалом. І «багато-до-одного», якщо ціллю є под.

Якщо всі заявники відкликують свій намір виселення для спільної цілі, виселення буде скасовано. Видалення EvictionRequest також зараховується як відкликання. Після видалення всіх EvictionRequest для певної цілі відповідні Eviction врешті-решт будуть прибрані збирачем сміття.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>apiVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/object-meta-v1-meta#ObjectMeta" >}}">ObjectMeta</a></em></td>
      <td>Стандартні метадані обʼєкта. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a>.</td>
    </tr>
    <tr>
      <td><code>spec</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#EvictionRequestSpec" >}}">EvictionRequestSpec</a></em></td>
      <td>spec визначає специфікацію запиту на виселення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status</a>.</td>
    </tr>
    <tr>
      <td><code>status</code><br/><em><a href="{{< ref "#EvictionRequestStatus" >}}">EvictionRequestStatus</a></em></td>
      <td>status представляє останній спостережений стан запиту на виселення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status</a>.</td>
    </tr>
  </tbody>
</table>

## EvictionRequestSpec {#EvictionRequestSpec}

EvictionRequestSpec — це специфікація EvictionRequest.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>intent</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>intent визначає дію, яку слід виконати для зазначеного обʼєкта.
      <ul>
        <li>Eviction означає, що запитувач зацікавлений у виселенні обʼєкта.</li>
        <li>Withdrawn означає, що запитувач більше не зацікавлений у виселенні обʼєкта. Якщо всі наміри запитувачів щодо спільного обʼєкта відкликано, виселення буде скасовано.</li>
      </ul>
      Наслідки скасування:
      <ul>
        <li>Неактивні виконавці ніколи не будуть запущені.</li>
        <li>Активні виконавці повинні скасувати виселення.</li>
        <li>Завершені або перервані виконавці не повинні вживати жодних дій.</li>
      </ul>
      Можливі значення enum:
      <ul>
        <li><code>"Eviction"</code> означає, що запитувач зацікавлений у виселенні обʼєкта.</li>
        <li><code>"Withdrawn"</code> означає, що запитувач більше не зацікавлений у виселенні обʼєкта. Якщо всі наміри запитувачів щодо спільного обʼєкта відкликано, виселення буде скасовано.</li>
      </ul>
      Наслідки скасування:
      <ul>
        <li>Неактивні виконавці ніколи не будуть запущені.</li>
        <li>Активні виконавці повинні скасувати виселення.</li>
        <li>Завершені або перервані виконавці не повинні вживати жодних дій.</li>
      </ul>
    </tr>
    <tr>
      <td><code>requester</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>requester дозволяє ідентифікувати сутність, яка запросила виселення цільового обʼєкта. Має бути дійсним ключем з доменним префіксом (наприклад, "acme.io/foo"). Імена доменів *.k8s.io та *.kubernetes.io зарезервовані. Це поле є обовʼязковим і незмінним.</td>
    </tr>
    <tr>
      <td><code>target</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "#EvictionRequestTarget" >}}">EvictionRequestTarget</a></em></td>
      <td>target містить посилання на обʼєкт (наприклад, под), який слід виселити. Це поле є обовʼязковим і незмінним.</td>
    </tr>
  </tbody>
</table>

## EvictionRequestStatus {#EvictionRequestStatus}

EvictionRequestStatus представляє останній спостережуваний статус запиту на виселення.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>conditions</code><br/><em><a href="{{< ref "../definitions/condition-v1-meta#Condition" >}}">Condition array</a></em><br/><em>patch strategy: злиття за ключем <code>type</code></em></td>
      <td>conditions містять інформацію про запит на виселення. Специфічні для EvictionRequest умови: TargetEvicted або Failed (керуються evictionrequest-controller).
      <ul>
        <li>Failed означає, що запит на виселення більше не обробляється жодним відповідачем на виселення. Це може статися, якщо запит скасовано або якщо жоден відповідач не зміг виселити ціль (наприклад, завершити або видалити под).</li>
        <li>TargetEvicted означає, що ціль було виселено (наприклад, под було завершено або видалено). Ці умови можуть бути скинуті, якщо виселення було невдалим і було подано новий намір Eviction. Максимальна довжина списку умов — 100.</li>
      </ul></td>
    </tr>
    <tr>
      <td><code>observedGeneration</code><br/><em>integer</em></td>
      <td>observedGeneration — це .metadata.generation запиту EvictionRequest, спостережуваний evictionrequest-controller. Значення спостережуваного покоління не може бути відʼємним і може лише збільшуватися. Мінімальне значення — 1. Це поле керується evictionrequest-controller.</td>
    </tr>
  </tbody>
</table>

## EvictionRequestList {#EvictionRequestList}

EvictionRequestList містить список ресурсів EvictionRequest.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>apiVersion</code><br/><em>string</em></td>
      <td>apiVersion визначає версію схеми цього представлення обʼєкта. Сервери повинні конвертувати розпізнані схеми до останнього внутрішнього значення і можуть відхиляти нерозпізнані значення. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources</a></td>
    </tr>
    <tr>
      <td><code>items</code>&nbsp;<strong>*</strong><br/><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest array</a></em></td>
      <td>items — це список обʼєктів EvictionRequest.</td>
    </tr>
    <tr>
      <td><code>kind</code><br/><em>string</em></td>
      <td>kind визначає тип REST-ресурсу, який представляє цей обʼєкт. Сервери можуть визначати це з точки доступу, до якої клієнт надсилає запити. Не може бути оновлено. У CamelCase. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds</a></td>
    </tr>
    <tr>
      <td><code>metadata</code><br/><em><a href="{{< ref "../definitions/list-meta-v1-meta#ListMeta" >}}">ListMeta</a></em></td>
      <td>Стандартні метадані списку. Детальніше: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a></td>
    </tr>
  </tbody>
</table>

## EvictionRequestPodReference {#EvictionRequestPodReference}

EvictionRequestPodReference містить достатньо інформації для розташування підсиланного поду в межах того самого простору назв.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>name цілі. Це поле є обовʼязковим.</td>
    </tr>
    <tr>
      <td><code>uid</code>&nbsp;<strong>*</strong><br/><em>string</em></td>
      <td>uid цілі. Його можна знайти в .metadata.uid цілі; це UUID у нижньому регістрі у форматі 8-4-4-4-12. Це поле є обовʼязковим.</td>
    </tr>
  </tbody>
</table>

## EvictionRequestTarget {#EvictionRequestTarget}

EvictionRequestTarget містить посилання на обʼєкт, який слід виселити.

---

<table>
  <thead><tr><th>Поле</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>pod</code><br/><em><a href="{{< ref "#EvictionRequestPodReference" >}}">EvictionRequestPodReference</a></em></td>
      <td>pod посилається на под, який підлягає виселенню/завершенню. Поди, які є частиною PodGroup (встановлено .spec.schedulingGroup), не підтримуються.</td>
    </tr>
  </tbody>
</table>

## Операції {#Operations}

---

### `post` Create

#### HTTP Запит {#http-request}

POST /apis/lifecycle.k8s.io/v1alpha1/namespaces/{namespace}/evictionrequests

#### Параметри шляху {#path-parameters}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта та область автентифікації, наприклад для команд та проєктів</td>
    </tr>
  </tbody>
</table>

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
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest</a></em></td>
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
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest</a></em></td>
    </tr>
    <tr>
      <td>202</td>
      <td>Accepted</td>
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest</a></em></td>
    </tr>
  </tbody>
</table>

### `patch` Patch

#### HTTP Запит {#http-request-1}

PATCH /apis/lifecycle.k8s.io/v1alpha1/namespaces/{namespace}/evictionrequests/{name}

#### Параметри шляху {#path-parameters-1}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта EvictionRequest</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта та область автентифікації, наприклад для команд та проєктів</td>
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
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest</a></em></td>
    </tr>
  </tbody>
</table>

### `put` Replace

#### HTTP Запит {#http-request-2}

PUT /apis/lifecycle.k8s.io/v1alpha1/namespaces/{namespace}/evictionrequests/{name}

#### Параметри шляху {#path-parameters-2}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта EvictionRequest</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта та область автентифікації, наприклад для команд та проєктів</td>
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
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest</a></em></td>
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
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest</a></em></td>
    </tr>
  </tbody>
</table>

### `delete` Delete

#### HTTP Запит {#http-request-3}

DELETE /apis/lifecycle.k8s.io/v1alpha1/namespaces/{namespace}/evictionrequests/{name}

#### Параметри шляху {#path-parameters-3}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта EvictionRequest</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта та область автентифікації, наприклад для команд та проєктів</td>
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
      <td>якщо встановлено true, це запустить небезпечне видалення ресурсу у випадку, якщо звичайний процес вилення завершується помилкою пошкодженого обʼєкта. Ресурс вважається пошкодженим, якщо його не вдається успішно отримати з базового сховища через a) неможливість трансформації даних (наприклад, помилка розшифрування), або b) неможливість декодування в обʼєкт. ПРИМІТКА: небезпечне видалення ігнорує обмеження фіналізаторів, пропускає перевірки попередніх умов і видаляє обʼєкт зі сховища. ПОПЕРЕДЖЕННЯ: це може потенційно порушити кластер, якщо робоче навантаження, повʼязане з ресурсом, що видаляється небезпечним чином, покладається на звичайний процес вилення. Використовуйте лише якщо ВИ ПОВНІСТЮ розумієте, що робите. Стандартне значення — false, і користувач повинен погодитися на активацію.</td>
    </tr>
    <tr>
      <td><code>orphanDependents</code></td>
      <td><em>boolean</em></td>
      <td>Застаріле: будь ласка, використовуйте PropagationPolicy, це поле буде застарілим у версії 1.7. Чи повинні залежні обʼєкти бути осиротілими. Якщо true/false, фіналізатор "orphan" буде додано/видалено зі списку фіналізаторів обʼєкта. Може бути встановлено або це поле, або PropagationPolicy, але не обидва.</td>
    </tr>
    <tr>
      <td><code>propagationPolicy</code></td>
      <td><em>string</em></td>
      <td>Чи та як буде виконано збирання сміття. Може бути встановлено або це поле, або OrphanDependents, але не обидва. Стандартна політика визначається існуючим фіналізатором у metadata.finalizers та стандартною політикою для конкретного ресурсу. Допустимі значення: 'Orphan' — осиротити залежні обʼєкти; 'Background' — дозволити збирачу сміття видалити залежні обʼєкти у фоновому режимі; 'Foreground' — каскадна політика, яка видаляє всі залежні обʼєкти у передньому плані.</td>
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

DELETE /apis/lifecycle.k8s.io/v1alpha1/namespaces/{namespace}/evictionrequests

#### Параметри шляху {#path-parameters-4}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта та область автентифікації, наприклад для команд та проєктів</td>
    </tr>
  </tbody>
</table>

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
      <td>якщо встановлено true, це запустить небезпечне видалення ресурсу у випадку, якщо звичайний процес вилення завершується помилкою пошкодженого обʼєкта. Ресурс вважається пошкодженим, якщо його не вдається успішно отримати з базового сховища через a) неможливість трансформації даних (наприклад, помилка розшифрування), або b) неможливість декодування в обʼєкт. ПРИМІТКА: небезпечне видалення ігнорує обмеження фіналізаторів, пропускає перевірки попередніх умов і видаляє обʼєкт зі сховища. ПОПЕРЕДЖЕННЯ: це може потенційно порушити кластер, якщо робоче навантаження, повʼязане з ресурсом, що видаляється небезпечним чином, покладається на звичайний процес вилення. Використовуйте лише якщо ВИ ПОВНІСТЮ розумієте, що робите. Стандартне значення — false, і користувач повинен погодитися на активацію.</td>
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
      <td>Чи та як буде виконано збирання сміття. Може бути встановлено або це поле, або OrphanDependents, але не обидва. Стандартна політика визначається існуючим фіналізатором у metadata.finalizers та стандартною політикою для конкретного ресурсу. Допустимі значення: 'Orphan' — осиротити залежні обʼєкти; 'Background' — дозволити збирачу сміття видалити залежні обʼєкти у фоновому режимі; 'Foreground' — каскадна політика, яка видаляє всі залежні обʼєкти у передньому плані.</td>
    </tr>
    <tr>
      <td><code>resourceVersion</code></td>
      <td><em>string</em></td>
      <td>resourceVersion встановлює обмеження щодо того, з яких версій ресурсу може обслуговуватися запит. Детальніше: <a href="https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Наполегливо рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Детальніше: <a href="https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td>Параметр <code>sendInitialEvents=true</code> може бути встановлений разом із <code>watch=true</code>. У цьому випадку потік спостереження почнеться із синтетичних подій, щоб відобразити поточний стан обʼєктів у колекції. Після того, як усі такі події буде надіслано, буде надіслано синтетичну подію "Bookmark". Ця подія повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Далі потік спостереження продовжиться як зазвичай, надсилаючи події, що відповідають змінам (після цієї RV) обʼєктів, за якими ведеться спостереження.<br/>Коли встановлено параметр <code>sendInitialEvents</code>, ми вимагаємо, щоб також був встановлений параметр <code>resourceVersionMatch</code>. Семантика запиту на спостереження така:<br/> - <code>resourceVersionMatch</code> = NotOlderThan інтерпретується як "дані принаймні такі ж нові, як наданий <code>resourceVersion</code>", і подія-bookmark надсилається, коли стан синхронізовано до <code>resourceVersion</code>, принаймні так само свіжого, як наданий у ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як "consistent read", і подія-bookmark надсилається, коли стан синхронізовано принаймні до моменту початку обробки запиту.<br/> - <code>resourceVersionMatch</code>, встановлений у будь-яке інше значення або не встановлений, повертає помилку Invalid. За замовчуванням true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань зворотної сумісності), і false в інших випадках.</td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список повернутих обʼєктів за допомогою виразу селектора шардів на основі CEL. Формат використовує функцію shardRange() разом із || (логічне АБО) для вказання одного або кількох діапазонів хешів:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Шляхи до полів використовують синтаксис із коренем в обʼєкті в стилі CEL (наприклад, "object.metadata.uid"), а НЕ формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:<br/>   - object.metadata.uid<br/>   - object.metadata.namespace<br/>hexStart і hexEnd є рядковими літералами CEL в одинарних лапках з префіксом '0x', що визначають інклюзивну нижню та ексклюзивну верхню межі в 64-бітному просторі хешів FNV-1a. Повний діапазон — [0x0, 0x10000000000000000), де ексклюзивна верхня межа дорівнює 2^64.<br/>Приклади:<br/>   Розділення на 2 шарди:<br/>     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>     шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>   Розділення на 4 шарди:<br/>     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>     шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>     шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>     шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')<br/>Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.</td>
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

GET /apis/lifecycle.k8s.io/v1alpha1/namespaces/{namespace}/evictionrequests/{name}

#### Параметри шляху {#path-parameters-5}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта EvictionRequest</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта та область автентифікації, наприклад для команд та проєктів</td>
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
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest</a></em></td>
    </tr>
  </tbody>
</table>

### `get` List

#### HTTP Запит {#http-request-6}

GET /apis/lifecycle.k8s.io/v1alpha1/namespaces/{namespace}/evictionrequests

#### Параметри шляху {#path-parameters-6}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта та область автентифікації, наприклад для команд та проєктів</td>
    </tr>
  </tbody>
</table>

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
      <td>resourceVersion встановлює обмеження щодо того, з яких версій ресурсу може обслуговуватися запит. Детальніше: <a href="https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Наполегливо рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Детальніше: <a href="https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td>Параметр <code>sendInitialEvents=true</code> може бути встановлений разом із <code>watch=true</code>. У цьому випадку потік спостереження почнеться із синтетичних подій, щоб відобразити поточний стан обʼєктів у колекції. Після того, як усі такі події буде надіслано, буде надіслано синтетичну подію "Bookmark". Ця подія повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Далі потік спостереження продовжиться як зазвичай, надсилаючи події, що відповідають змінам (після цієї RV) обʼєктів, за якими ведеться спостереження.<br/>Коли встановлено параметр <code>sendInitialEvents</code>, ми вимагаємо, щоб також був встановлений параметр <code>resourceVersionMatch</code>. Семантика запиту на спостереження така:<br/> - <code>resourceVersionMatch</code> = NotOlderThan інтерпретується як "дані принаймні такі ж нові, як наданий <code>resourceVersion</code>", і подія-bookmark надсилається, коли стан синхронізовано до <code>resourceVersion</code>, принаймні так само свіжого, як наданий у ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як "consistent read", і подія-bookmark надсилається, коли стан синхронізовано принаймні до моменту початку обробки запиту.<br/> - <code>resourceVersionMatch</code>, встановлений у будь-яке інше значення або не встановлений, повертає помилку Invalid. За замовчуванням true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань зворотної сумісності), і false в інших випадках.</td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список повернутих обʼєктів за допомогою виразу селектора шардів на основі CEL. Формат використовує функцію shardRange() разом із || (логічне АБО) для вказання одного або кількох діапазонів хешів:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Шляхи до полів використовують синтаксис із коренем в обʼєкті в стилі CEL (наприклад, "object.metadata.uid"), а НЕ формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:<br/>   - object.metadata.uid<br/>   - object.metadata.namespace<br/>hexStart і hexEnd є рядковими літералами CEL в одинарних лапках з префіксом '0x', що визначають інклюзивну нижню та ексклюзивну верхню межі в 64-бітному просторі хешів FNV-1a. Повний діапазон — [0x0, 0x10000000000000000), де ексклюзивна верхня межа дорівнює 2^64.<br/>Приклади:<br/>   Розділення на 2 шарди:<br/>     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>     шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>   Розділення на 4 шарди:<br/>     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>     шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>     шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>     шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')<br/>Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.</td>
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
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequestList" >}}">EvictionRequestList</a></em></td>
    </tr>
  </tbody>
</table>

### `get` List All Namespaces

#### HTTP Запит {#http-request-7}

GET /apis/lifecycle.k8s.io/v1alpha1/evictionrequests

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
      <td>resourceVersion встановлює обмеження щодо того, з яких версій ресурсу може обслуговуватися запит. Детальніше: <a href="https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Наполегливо рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Детальніше: <a href="https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td>Параметр <code>sendInitialEvents=true</code> може бути встановлений разом із <code>watch=true</code>. У цьому випадку потік спостереження почнеться із синтетичних подій, щоб відобразити поточний стан обʼєктів у колекції. Після того, як усі такі події буде надіслано, буде надіслано синтетичну подію "Bookmark". Ця подія повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Далі потік спостереження продовжиться як зазвичай, надсилаючи події, що відповідають змінам (після цієї RV) обʼєктів, за якими ведеться спостереження.<br/>Коли встановлено параметр <code>sendInitialEvents</code>, ми вимагаємо, щоб також був встановлений параметр <code>resourceVersionMatch</code>. Семантика запиту на спостереження така:<br/> - <code>resourceVersionMatch</code> = NotOlderThan інтерпретується як "дані принаймні такі ж нові, як наданий <code>resourceVersion</code>", і подія-bookmark надсилається, коли стан синхронізовано до <code>resourceVersion</code>, принаймні так само свіжого, як наданий у ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як "consistent read", і подія-bookmark надсилається, коли стан синхронізовано принаймні до моменту початку обробки запиту.<br/> - <code>resourceVersionMatch</code>, встановлений у будь-яке інше значення або не встановлений, повертає помилку Invalid. За замовчуванням true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань зворотної сумісності), і false в інших випадках.</td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список повернутих обʼєктів за допомогою виразу селектора шардів на основі CEL. Формат використовує функцію shardRange() разом із || (логічне АБО) для вказання одного або кількох діапазонів хешів:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Шляхи до полів використовують синтаксис із коренем в обʼєкті в стилі CEL (наприклад, "object.metadata.uid"), а НЕ формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:<br/>   - object.metadata.uid<br/>   - object.metadata.namespace<br/>hexStart і hexEnd є рядковими літералами CEL в одинарних лапках з префіксом '0x', що визначають інклюзивну нижню та ексклюзивну верхню межі в 64-бітному просторі хешів FNV-1a. Повний діапазон — [0x0, 0x10000000000000000), де ексклюзивна верхня межа дорівнює 2^64.<br/>Приклади:<br/>   Розділення на 2 шарди:<br/>     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>     шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>   Розділення на 4 шарди:<br/>     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>     шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>     шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>     шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')<br/>Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.</td>
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
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequestList" >}}">EvictionRequestList</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Watch

#### HTTP Запит {#http-request-8}

GET /apis/lifecycle.k8s.io/v1alpha1/watch/namespaces/{namespace}/evictionrequests/{name}

#### Параметри шляху {#path-parameters-7}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта EvictionRequest</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта та область автентифікації, наприклад для команд та проєктів</td>
    </tr>
  </tbody>
</table>

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
      <td>resourceVersion встановлює обмеження щодо того, з яких версій ресурсу може обслуговуватися запит. Детальніше: <a href="https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Наполегливо рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Детальніше: <a href="https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td>Параметр <code>sendInitialEvents=true</code> може бути встановлений разом із <code>watch=true</code>. У цьому випадку потік спостереження почнеться із синтетичних подій, щоб відобразити поточний стан обʼєктів у колекції. Після того, як усі такі події буде надіслано, буде надіслано синтетичну подію "Bookmark". Ця подія повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Далі потік спостереження продовжиться як зазвичай, надсилаючи події, що відповідають змінам (після цієї RV) обʼєктів, за якими ведеться спостереження.<br/>Коли встановлено параметр <code>sendInitialEvents</code>, ми вимагаємо, щоб також був встановлений параметр <code>resourceVersionMatch</code>. Семантика запиту на спостереження така:<br/> - <code>resourceVersionMatch</code> = NotOlderThan інтерпретується як "дані принаймні такі ж нові, як наданий <code>resourceVersion</code>", і подія-bookmark надсилається, коли стан синхронізовано до <code>resourceVersion</code>, принаймні так само свіжого, як наданий у ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як "consistent read", і подія-bookmark надсилається, коли стан синхронізовано принаймні до моменту початку обробки запиту.<br/> - <code>resourceVersionMatch</code>, встановлений у будь-яке інше значення або не встановлений, повертає помилку Invalid. За замовчуванням true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань зворотної сумісності), і false в інших випадках.</td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список повернутих обʼєктів за допомогою виразу селектора шардів на основі CEL. Формат використовує функцію shardRange() разом із || (логічне АБО) для вказання одного або кількох діапазонів хешів:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Шляхи до полів використовують синтаксис із коренем в обʼєкті в стилі CEL (наприклад, "object.metadata.uid"), а НЕ формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:<br/>   - object.metadata.uid<br/>   - object.metadata.namespace<br/>hexStart і hexEnd є рядковими літералами CEL в одинарних лапках з префіксом '0x', що визначають інклюзивну нижню та ексклюзивну верхню межі в 64-бітному просторі хешів FNV-1a. Повний діапазон — [0x0, 0x10000000000000000), де ексклюзивна верхня межа дорівнює 2^64.<br/>Приклади:<br/>   Розділення на 2 шарди:<br/>     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>     шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>   Розділення на 4 шарди:<br/>     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>     шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>     шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>     шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')<br/>Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.</td>
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

### `get` Watch List

#### HTTP Запит {#http-request-9}

GET /apis/lifecycle.k8s.io/v1alpha1/watch/namespaces/{namespace}/evictionrequests

#### Параметри шляху {#path-parameters-8}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта та область автентифікації, наприклад для команд та проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-9}

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
      <td>resourceVersion встановлює обмеження щодо того, з яких версій ресурсу може обслуговуватися запит. Детальніше: <a href="https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Наполегливо рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Детальніше: <a href="https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td>Параметр <code>sendInitialEvents=true</code> може бути встановлений разом із <code>watch=true</code>. У цьому випадку потік спостереження почнеться із синтетичних подій, щоб відобразити поточний стан обʼєктів у колекції. Після того, як усі такі події буде надіслано, буде надіслано синтетичну подію "Bookmark". Ця подія повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Далі потік спостереження продовжиться як зазвичай, надсилаючи події, що відповідають змінам (після цієї RV) обʼєктів, за якими ведеться спостереження.<br/>Коли встановлено параметр <code>sendInitialEvents</code>, ми вимагаємо, щоб також був встановлений параметр <code>resourceVersionMatch</code>. Семантика запиту на спостереження така:<br/> - <code>resourceVersionMatch</code> = NotOlderThan інтерпретується як "дані принаймні такі ж нові, як наданий <code>resourceVersion</code>", і подія-bookmark надсилається, коли стан синхронізовано до <code>resourceVersion</code>, принаймні так само свіжого, як наданий у ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як "consistent read", і подія-bookmark надсилається, коли стан синхронізовано принаймні до моменту початку обробки запиту.<br/> - <code>resourceVersionMatch</code>, встановлений у будь-яке інше значення або не встановлений, повертає помилку Invalid. За замовчуванням true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань зворотної сумісності), і false в інших випадках.</td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список повернутих обʼєктів за допомогою виразу селектора шардів на основі CEL. Формат використовує функцію shardRange() разом із || (логічне АБО) для вказання одного або кількох діапазонів хешів:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Шляхи до полів використовують синтаксис із коренем в обʼєкті в стилі CEL (наприклад, "object.metadata.uid"), а НЕ формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:<br/>   - object.metadata.uid<br/>   - object.metadata.namespace<br/>hexStart і hexEnd є рядковими літералами CEL в одинарних лапках з префіксом '0x', що визначають інклюзивну нижню та ексклюзивну верхню межі в 64-бітному просторі хешів FNV-1a. Повний діапазон — [0x0, 0x10000000000000000), де ексклюзивна верхня межа дорівнює 2^64.<br/>Приклади:<br/>   Розділення на 2 шарди:<br/>     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>     шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>   Розділення на 4 шарди:<br/>     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>     шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>     шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>     шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')<br/>Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.</td>
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

#### Відповідь {#response-9}

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

### `get` Watch List All Namespaces

#### HTTP Запит {#http-request-10}

GET /apis/lifecycle.k8s.io/v1alpha1/watch/evictionrequests

#### Параметри запиту {#query-parameters-10}

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
      <td>resourceVersion встановлює обмеження щодо того, з яких версій ресурсу може обслуговуватися запит. Детальніше: <a href="https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>resourceVersionMatch</code></td>
      <td><em>string</em></td>
      <td>resourceVersionMatch визначає, як resourceVersion застосовується до викликів списку. Наполегливо рекомендується встановлювати resourceVersionMatch для викликів списку, де встановлено resourceVersion. Детальніше: <a href="https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions">https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions</a>.  Стандартно — не встановлено</td>
    </tr>
    <tr>
      <td><code>sendInitialEvents</code></td>
      <td><em>boolean</em></td>
      <td>Параметр <code>sendInitialEvents=true</code> може бути встановлений разом із <code>watch=true</code>. У цьому випадку потік спостереження почнеться із синтетичних подій, щоб відобразити поточний стан обʼєктів у колекції. Після того, як усі такі події буде надіслано, буде надіслано синтетичну подію "Bookmark". Ця подія повідомить ResourceVersion (RV), що відповідає набору обʼєктів, і буде позначена анотацією <code>"k8s.io/initial-events-end": "true"</code>. Далі потік спостереження продовжиться як зазвичай, надсилаючи події, що відповідають змінам (після цієї RV) обʼєктів, за якими ведеться спостереження.<br/>Коли встановлено параметр <code>sendInitialEvents</code>, ми вимагаємо, щоб також був встановлений параметр <code>resourceVersionMatch</code>. Семантика запиту на спостереження така:<br/> - <code>resourceVersionMatch</code> = NotOlderThan інтерпретується як "дані принаймні такі ж нові, як наданий <code>resourceVersion</code>", і подія-bookmark надсилається, коли стан синхронізовано до <code>resourceVersion</code>, принаймні так само свіжого, як наданий у ListOptions. Якщо <code>resourceVersion</code> не встановлено, це інтерпретується як "consistent read", і подія-bookmark надсилається, коли стан синхронізовано принаймні до моменту початку обробки запиту.<br/> - <code>resourceVersionMatch</code>, встановлений у будь-яке інше значення або не встановлений, повертає помилку Invalid. За замовчуванням true, якщо <code>resourceVersion=""</code> або <code>resourceVersion="0"</code> (з міркувань зворотної сумісності), і false в інших випадках.</td>
    </tr>
    <tr>
      <td><code>shardSelector</code></td>
      <td><em>string</em></td>
      <td>shardSelector обмежує список повернутих обʼєктів за допомогою виразу селектора шардів на основі CEL. Формат використовує функцію shardRange() разом із || (логічне АБО) для вказання одного або кількох діапазонів хешів:    shardRange(object.metadata.uid, '0x0', '0x8000000000000000')   shardRange(object.metadata.uid, '0x0', '0x8000000000000000') || shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')  Шляхи до полів використовують синтаксис із коренем в обʼєкті в стилі CEL (наприклад, "object.metadata.uid"), а НЕ формат fieldSelector ("metadata.uid"). Наразі підтримуються такі шляхи:<br/>   - object.metadata.uid<br/>   - object.metadata.namespace<br/>hexStart і hexEnd є рядковими літералами CEL в одинарних лапках з префіксом '0x', що визначають інклюзивну нижню та ексклюзивну верхню межі в 64-бітному просторі хешів FNV-1a. Повний діапазон — [0x0, 0x10000000000000000), де ексклюзивна верхня межа дорівнює 2^64.<br/>Приклади:<br/>   Розділення на 2 шарди:<br/>     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x8000000000000000')<br/>     шард 1: shardRange(object.metadata.uid, '0x8000000000000000', '0x10000000000000000')<br/>   Розділення на 4 шарди:<br/>     шард 0: shardRange(object.metadata.uid, '0x0000000000000000', '0x4000000000000000')<br/>     шард 1: shardRange(object.metadata.uid, '0x4000000000000000', '0x8000000000000000')<br/>     шард 2: shardRange(object.metadata.uid, '0x8000000000000000', '0xc000000000000000')<br/>     шард 3: shardRange(object.metadata.uid, '0xc000000000000000', '0x10000000000000000')<br/>Це альфа-поле і вимагає увімкнення функціональної можливості ShardedListAndWatch.</td>
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

#### Відповідь {#response-10}

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

### `patch` Patch Status

#### HTTP Запит {#http-request-11}

PATCH /apis/lifecycle.k8s.io/v1alpha1/namespaces/{namespace}/evictionrequests/{name}/status

#### Параметри шляху {#path-parameters-9}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта EvictionRequest</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта та область автентифікації, наприклад для команд та проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-11}

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

#### Параметри тіла запиту {#body-parameters-5}

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

#### Відповідь {#response-11}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest</a></em></td>
    </tr>
  </tbody>
</table>

### `get` Read Status

#### HTTP Запит {#http-request-12}

GET /apis/lifecycle.k8s.io/v1alpha1/namespaces/{namespace}/evictionrequests/{name}/status

#### Параметри шляху {#path-parameters-10}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта EvictionRequest</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта та область автентифікації, наприклад для команд та проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-12}

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

#### Відповідь {#response-12}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest</a></em></td>
    </tr>
  </tbody>
</table>

### `put` Replace Status

#### HTTP Запит {#http-request-13}

PUT /apis/lifecycle.k8s.io/v1alpha1/namespaces/{namespace}/evictionrequests/{name}/status

#### Параметри шляху {#path-parameters-11}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта EvictionRequest</td>
    </tr>
    <tr>
      <td><code>namespace</code></td>
      <td><em>string</em></td>
      <td>назва обʼєкта та область автентифікації, наприклад для команд та проєктів</td>
    </tr>
  </tbody>
</table>

#### Параметри запиту {#query-parameters-13}

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

#### Параметри тіла запиту {#body-parameters-6}

<table>
  <thead><tr><th>Назва</th><th>Тип</th><th>Опис</th></tr></thead>
  <tbody>
    <tr>
      <td><code>body</code></td>
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest</a></em></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Відповідь {#response-13}

<table>
  <thead><tr><th>Статус</th><th>Опис</th><th>Відповідь</th></tr></thead>
  <tbody>
    <tr>
      <td>200</td>
      <td>OK</td>
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest</a></em></td>
    </tr>
    <tr>
      <td>201</td>
      <td>Created</td>
      <td><em><a href="{{< ref "eviction-request-v1alpha1#EvictionRequest" >}}">EvictionRequest</a></em></td>
    </tr>
  </tbody>
</table>
