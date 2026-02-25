---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "SelfSubjectAccessReview"
content_type: "api_reference"
description: "SelfSubjectAccessReview перевіряє, чи може поточний користувач виконати дію."
title: "SelfSubjectAccessReview"
weight: 2
auto_generated: false
---

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## SelfSubjectAccessReview {#SelfSubjectAccessReview}

SelfSubjectAccessReview перевіряє, чи може поточний користувач виконати дію. Незаповнення spec.namespace означає "в усіх просторах імен". Self є особливим випадком, оскільки користувачі завжди повинні мати змогу перевірити, чи можуть вони виконати дію.

---

- **apiVersion**: authorization.k8s.io/v1

- **kind**: SelfSubjectAccessReview

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReviewSpec" >}}">SelfSubjectAccessReviewSpec</a>), обовʼязково

  Специфікація містить інформацію про запит, який оцінюється. user та groups повинні бути порожніми.

- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)

  Статус заповнюється сервером і вказує, чи дозволено запит, чи ні.

## SelfSubjectAccessReviewSpec {#SelfSubjectAccessReviewSpec}

SelfSubjectAccessReviewSpec є описом запиту на доступ. Має бути встановлене щось одне з ResourceAuthorizationAttributes або NonResourceAuthorizationAttributes.

---

- **nonResourceAttributes** (NonResourceAttributes)

  NonResourceAttributes описує інформацію для запиту на доступ до не-ресурсів.

  <a name="NonResourceAttributes"></a>
  *NonResourceAttributes включає атрибути авторизації, доступні для запитів до інтерфейсу Authorizer, які не стосуються ресурсів.*

  - **nonResourceAttributes.path** (string)

    Path — це URL-шлях запиту.

  - **nonResourceAttributes.verb** (string)

    Verb — це стандартне HTTP-дієслово.

- **resourceAttributes** (ResourceAttributes)

  ResourceAuthorizationAttributes описує інформацію для запиту на доступ до ресурсу.

  <a name="ResourceAttributes"></a>
  *ResourceAttributes включає атрибути авторизації, доступні для запитів до інтерфейсу Authorizer, що стосуються ресурсів.*

  - **resourceAttributes.fieldSelector** (FieldSelectorAttributes)

    fieldSelector описує обмеження доступу на основі поля. Він може лише обмежувати доступ, але не розширювати його.

    <a name="FieldSelectorAttributes"></a>
    *FieldSelectorAttributes вказує на доступ, обмежений за полем. Автори вебхуків заохочуються до таких дій:*
    - *переконатися, що rawSelector і requirements не встановлені одночасно;*
    - *розглядати поле requirements, якщо воно встановлене;*
    - *не намагатися парсити або враховувати поле rawSelector, якщо воно встановлене. Це робиться для запобігання ще одній уразливості типу CVE-2022-2880 (тобто домогтися, щоб різні системи погодилися щодо того, як саме парсити запит, — це не те, чого ми прагнемо), більше деталей дивіться за посиланням https://www.oxeye.io/resources/golang-parameter-smuggling-attack.*

    Для точок доступу *SubjectAccessReview* kube-apiserver:
    - *Якщо rawSelector порожній, а requirements порожні, запит не обмежується.*
    - *Якщо rawSelector присутній, а requirements порожні, rawSelector буде парситися та обмежуватися, якщо парсинг вдасться.*
    - *Якщо rawSelector порожній, а requirements присутні, слід враховувати вимоги.*
    - *Якщо rawSelector присутній і requirements присутні, запит є недійсним.*

    - **resourceAttributes.fieldSelector.rawSelector** (string)

      rawSelector — це серіалізація селектора поля, який буде включено в параметр запиту. Реалізаціям вебхуків рекомендується ігнорувати rawSelector. *SubjectAccessReview* у kube-apiserver буде парсити rawSelector, якщо поле requirements відсутнє.

    - **resourceAttributes.fieldSelector.requirements** ([]FieldSelectorRequirement)

      *Atomic: буде замінено під час злиття*

      requirements — це інтерпретація селектора поля після парсингу. Усі вимоги повинні бути виконані, щоб ресурс відповідав селектору. Реалізації вебхуків повинні обробляти requirements, але як саме їх обробляти — залишається на розсуд вебхука. Оскільки requirements можуть лише обмежувати запит, безпечно авторизувати запит як необмежений, якщо вимоги не зрозумілі.

      <a name="FieldSelectorRequirement"></a>
      *FieldSelectorRequirement — це селектор, який містить значення, ключ та оператор, який повʼязує ключ та значення.*

      - **resourceAttributes.fieldSelector.requirements.key** (string), обовʼязково

        key — це ключ-селектор поля, до якого застосовується вимога.

      - **resourceAttributes.fieldSelector.requirements.operator** (string), обовʼязково

        operator представляє стосунок ключа до набору значень. Дійсні оператори: In, NotIn, Exists, DoesNotExist. Список операторів може розширюватися в майбутньому.

      - **resourceAttributes.fieldSelector.requirements.values** ([]string)

        *Atomic: буде замінено під час злиття*

        values — це масив строкових значень. Якщо оператор — In або NotIn, масив values не може бути порожнім. Якщо ж оператор — Exists або DoesNotExist, масив values повинен бути порожнім.

  - **resourceAttributes.group** (string)

    Group — це API-група ресурсу. "*" означає всі.

  - **resourceAttributes.labelSelector** (LabelSelectorAttributes)

    labelSelector описує обмеження доступу на основі міток. Він може лише обмежувати доступ, але не розширювати його.

    <a name="LabelSelectorAttributes"></a>
    *LabelSelectorAttributes вказує на доступ, обмежений за мітками. Автори вебхуків заохочуються до таких дій:*
    - *переконатися, що rawSelector і requirements не встановлені одночасно;*
    - *розглядати поле requirements, якщо воно встановлене;*
    - *не намагатися парсити або враховувати поле rawSelector, якщо воно встановлене. Це робиться для запобігання ще одній уразливості типу CVE-2022-2880 (тобто домогтися, щоб різні системи погодилися щодо того, як саме парсити запит, — це не те, чого ми прагнемо), більше деталей дивіться за посиланням https://www.oxeye.io/resources/golang-parameter-smuggling-attack.*

    Для точок доступу *SubjectAccessReview* kube-apiserver:
    - *Якщо rawSelector порожній, а requirements порожні, запит не обмежується.*
    - *Якщо rawSelector присутній, а requirements порожні, rawSelector буде парситися та обмежуватися, якщо парсинг вдасться.*
    - *Якщо rawSelector порожній, а requirements присутні, слід враховувати вимоги.*
    - *Якщо rawSelector присутній і requirements присутні, запит є недійсним.*

    - **resourceAttributes.labelSelector.rawSelector** (string)

      rawSelector — це серіалізація селектора поля, яка буде включена в параметр запиту. Реалізаціям вебхуків рекомендується ігнорувати rawSelector. *SubjectAccessReview* у kube-apiserver буде парсити rawSelector, якщо поле requirements відсутнє.

    - **resourceAttributes.labelSelector.requirements** ([]LabelSelectorRequirement)

      *Atomic: буде замінено під час злиття*

      requirements — це інтерпретація селектора мітки після парсингу. Усі вимоги повинні бути виконані, щоб ресурс відповідав селектору. Реалізації вебхуків повинні обробляти requirements, але спосіб обробки залишається на розсуд вебхука. Оскільки requirements можуть лише обмежувати запит, безпечно авторизувати запит як необмежений, якщо вимоги не зрозумілі.

      <a name="LabelSelectorRequirement"></a>
      *Вимога до селектора мітки — це селектор, який містить значення, ключ і оператор, який повʼязує ключ і значення.*

      - **resourceAttributes.labelSelector.requirements.key** (string), обовʼязково

        key — це ключ мітки, до якого застосовується селектор.

      - **resourceAttributes.labelSelector.requirements.operator** (string), обовʼязково

        operator представляє стосунок ключа до набору значень. Дійсні оператори: In, NotIn, Exists та DoesNotExist.

      - **resourceAttributes.labelSelector.requirements.values** ([]string)

        *Atomic: буде замінено під час злиття*

        values — це масив строкових значень. Якщо оператор — In або NotIn, масив values не може бути порожнім. Якщо ж оператор — Exists або DoesNotExist, масив values повинен бути порожнім. Цей масив замінюється під час стратегічного злиття патчу.

  - **resourceAttributes.name** (string)

    Name — це назва ресурсу, який запитується для "отримання" ("get") або видалення для "delete". "" (порожня) означає всі.

  - **resourceAttributes.namespace** (string)

    Namespace — це простір імен дії, що запитується. Наразі немає різниці між відсутністю простору імен та всіма просторами імен "" (порожньо) стандартно встановлюється з для LocalSubjectAccessReviews "" (порожньо) означає відсутність для кластерних ресурсів "" (порожньо) означає "всі" для ресурсів, обмежених простором імен, з SubjectAccessReview або SelfSubjectAccessReview.

  - **resourceAttributes.resource** (string)

    Resource — це один з наявних типів ресурсів. "*" означає всі.

  - **resourceAttributes.subresource** (string)

    Subresource — це один з наявних типів субресурсів. "" означає відсутність.

  - **resourceAttributes.verb** (string)

    Verb — це дієслово API ресурсу Kubernetes, таке як: get, list, watch, create, update, delete, proxy. "*" означає всі.

  - **resourceAttributes.version** (string)

    Version — це версія API ресурсу. "*" означає всі.

## Операції {#Operations}

---

### `create` створення SelfSubjectAccessReview {#create-create-a-selfsubjectaccessreview}

#### HTTP запит {#http-request}

POST /apis/authorization.k8s.io/v1/selfsubjectaccessreviews

#### Параметри {#parameters}

- **body**: <a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>): OK

201 (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>): Created

202 (<a href="{{< ref "../authorization-resources/self-subject-access-review-v1#SelfSubjectAccessReview" >}}">SelfSubjectAccessReview</a>): Accepted

401: Unauthorized
