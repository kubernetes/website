---
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "SelfSubjectReview"
content_type: "api_reference"
description: "SelfSubjectReview містить інформацію про користувача, яку має kube-apiserver про користувача, що робить цей запит."
title: "SelfSubjectReview"
weight: 6
auto_generated: false
---

`apiVersion: authentication.k8s.io/v1`

`import "k8s.io/api/authentication/v1"`

## SelfSubjectReview {#SelfSubjectReview}

SelfSubjectReview містить інформацію про користувача, яку має kube-apiserver про користувача, що робить цей запит. При використанні імперсоніфікації, користувачі отримають інформацію про користувача, якого вони імітують.  Якщо використовується імперсоніфікація або автентифікація заголовка запиту, будь-які додаткові ключі будуть ігноруватися і повертатися у нижньому регістрі.

---

- **apiVersion**: authentication.k8s.io/v1

- **kind**: SelfSubjectReview

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **status** (<a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReviewStatus" >}}">SelfSubjectReviewStatus</a>)

  Статус заповнюється сервером атрибутами користувача.

## SelfSubjectReviewStatus {#SelfSubjectReviewStatus}

SelfSubjectReviewStatus заповнюється kube-apiserver і відсилається користувачу.

---

- **userInfo** (UserInfo)

  Атрибути користувача, який робить цей запит.

  <a name="UserInfo"></a>
  *UserInfo містить інформацію про користувача, необхідну для реалізації інтерфейсу user.Info.*

  - **userInfo.extra** (map[string][]string)

    Будь-яка додаткова інформація, надана автентифікатором.

  - **userInfo.groups** ([]string)

    *Atomic: буде замінено під час злиття*

    Назви груп, до яких належить цей користувач.

  - **userInfo.uid** (string)

    Унікальне значення, що ідентифікує цього користувача з плином часу. Якщо цей користувач буде видалений і інший користувач з таким самим іменем буде доданий, вони матимуть різні UID.

  - **userInfo.username** (string)

    Імʼя, яке унікально ідентифікує цього користувача серед усіх активних користувачів.

## Операції {#Операції}

---

### `create` створення SelfSubjectReview {#create-create-a-selfsubjectreview}

#### HTTP запит {#http-request}

POST /apis/authentication.k8s.io/v1/selfsubjectreviews

#### Параметри {#parameters}

- **body**: <a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>, обовʼязково

- **dryRun** (*в запиті*): string
---dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>): OK

201 (<a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>): Created

202 (<a href="{{< ref "../authentication-resources/self-subject-review-v1#SelfSubjectReview" >}}">SelfSubjectReview</a>): Accepted

401: Unauthorized
