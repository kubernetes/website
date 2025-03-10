---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SelfSubjectRulesReview"
content_type: "api_reference"
description: "SelfSubjectRulesReview перелічує набір дій, які поточний користувач може виконувати в межах простору імен."
title: "SelfSubjectRulesReview"
weight: 3
auto_generated: true
---

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## SelfSubjectRulesReview {#SelfSubjectRulesReview}

SelfSubjectRulesReview перелічує набір дій, які поточний користувач може виконувати в межах простору імен. Отриманий список дій може бути неповним залежно від режиму авторизації сервера та будь-яких помилок, які виникли під час оцінки. SelfSubjectRulesReview слід використовувати інтерфейсами користувача для показу/приховування дій або швидкого надання кінцевому користувачеві можливості оцінити свої дозволи. Він НЕ ПОВИНЕН використовуватися зовнішніми системами для прийняття рішень щодо авторизації, оскільки це викликає проблеми з підміною, тривалістю життя кешу/відкликанням та правильністю. SubjectAccessReview і LocalAccessReview є правильним способом делегування рішень щодо авторизації до API сервера.

---

- **apiVersion**: authorization.k8s.io/v1

- **kind**: SelfSubjectRulesReview

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReviewSpec" >}}">SelfSubjectRulesReviewSpec</a>), обовʼязково

  Специфікація містить інформацію про запит, який оцінюється.

- **status** (SubjectRulesReviewStatus)

  Статус заповнюється сервером і вказує на набір дій, які користувач може виконувати.

  <a name="SubjectRulesReviewStatus"></a>
  *SubjectRulesReviewStatus містить результат перевірки правил. Ця перевірка може бути неповною залежно від набору авторизаторів, з якими налаштовано сервер, і будь-яких помилок, що виникли під час оцінки. Оскільки правила авторизації є адитивними, якщо правило зʼявляється у списку, можна безпечно припустити, що субʼєкт має цей дозвіл, навіть якщо цей список неповний.*

  - **status.incomplete** (boolean), обовʼязково

    Incomplete встановлюється у true, коли правила, повернуті цим викликом, є неповними. Це найчастіше зустрічається, коли авторизатор, такий як зовнішній авторизатор, не підтримує оцінку правил.

  - **status.nonResourceRules** ([]NonResourceRule), обовʼязково

    *Atomic: буде замінено під час злиття*

    NonResourceRules — це список дій, які субʼєкт має право виконувати щодо не-ресурсів. Порядок у списку не є значущим, може містити дублікати та, можливо, бути неповним.

    <a name="NonResourceRule"></a>
    *NonResourceRule містить інформацію, яка описує правило для не-ресурсу*

    - **status.nonResourceRules.verbs** ([]string), обовʼязково

      *Atomic: буде замінено під час злиття*

      Verb — це список дієслів API Kubernetes для не-ресурсів, таких як: get, post, put, delete, patch, head, options. "*" означає всі.

    - **status.nonResourceRules.nonResourceURLs** ([]string)

      *Atomic: буде замінено під час злиття*

      NonResourceURLs — це набір часткових URL-адрес, до яких користувач повинен мати доступ. \* допускаються, але лише як повний, кінцевий крок у шляху. "*" означає всі.

  - **status.resourceRules** ([]ResourceRule), обовʼязково

    *Atomic: буде замінено під час злиття*

    ResourceRules — це список дій, які субʼєкт має право виконувати щодо ресурсів. Порядок у списку не є значущим, може містити дублікати та, можливо, бути неповним.

    <a name="ResourceRule"></a>
    *ResourceRule — це список дій, які субʼєкт має право виконувати щодо ресурсів. Порядок у списку не є значущим, може містити дублікати та, можливо, бути неповним.*

    - **status.resourceRules.verbs** ([]string), обовʼязково

      *Atomic: буде замінено під час злиття*

      Verb — це список дієслів API ресурсу Kubernetes, таких як: get, list, watch, create, update, delete, proxy. "*" означає всі.

    - **status.resourceRules.apiGroups** ([]string)

      *Atomic: буде замінено під час злиття*

      APIGroups — це назва API-групи, яка містить ресурси. Якщо зазначено кілька API-груп, будь-яка дія, запитана для одного з перелічених ресурсів у будь-якій API-групі, буде дозволена. "*" означає всі.

    - **status.resourceRules.resourceNames** ([]string)

      *Atomic: буде замінено під час злиття*

      ResourceNames — це необовʼязковий білий список імен, до яких застосовується правило. Порожній набір означає, що дозволено все. "*" означає всі.

    - **status.resourceRules.resources** ([]string)

      *Atomic: буде замінено під час злиття*

      Resources — це список ресурсів, до яких застосовується це правило. "\*" означає всі в зазначених apiGroups. "\*/foo" представляє субресурс 'foo' для всіх ресурсів у зазначених apiGroups.

  - **status.evaluationError** (string)

    EvaluationError може зʼявитися разом із Rules. Це вказує на те, що під час оцінки правил сталася помилка, наприклад, авторизатор не підтримує оцінку правил, і що ResourceRules та/або NonResourceRules можуть бути неповними.

## SelfSubjectRulesReviewSpec {#SelfSubjectRulesReviewSpec}

SelfSubjectRulesReviewSpec визначає специфікацію для SelfSubjectRulesReview.

---

- **namespace** (string)

  Простір імен для оцінки правил. Обовʼязково.

## Операції {#Operations}

---

### `create` створення SelfSubjectRulesReview {#create-create-a-selfsubjectrulesreview}

#### HTTP запит {#http-request}

POST /apis/authorization.k8s.io/v1/selfsubjectrulesreviews

#### Параметри {#parameters}

- **body**: <a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReview" >}}">SelfSubjectRulesReview</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReview" >}}">SelfSubjectRulesReview</a>): OK

201 (<a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReview" >}}">SelfSubjectRulesReview</a>): Created

202 (<a href="{{< ref "../authorization-resources/self-subject-rules-review-v1#SelfSubjectRulesReview" >}}">SelfSubjectRulesReview</a>): Accepted

401: Unauthorized
