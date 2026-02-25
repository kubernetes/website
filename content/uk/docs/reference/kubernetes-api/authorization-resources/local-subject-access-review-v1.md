---
api_metadata:
  apiVersion: "authorization.k8s.io/v1"
  import: "k8s.io/api/authorization/v1"
  kind: "LocalSubjectAccessReview"
content_type: "api_reference"
description: "LocalSubjectAccessReview перевіряє, чи може користувач або група виконати дію в заданому просторі імен."
title: "LocalSubjectAccessReview"
weight: 1
auto_generated: false
---

`apiVersion: authorization.k8s.io/v1`

`import "k8s.io/api/authorization/v1"`

## LocalSubjectAccessReview {#LocalSubjectAccessReview}

LocalSubjectAccessReview перевіряє, чи може користувач або група виконати дію в заданому просторі імен. Наявність ресурсу, обмеженого простором імен, значно полегшує надання політики, обмеженої простором імен, що включає перевірку дозволів.

---

- **apiVersion**: authorization.k8s.io/v1

- **kind**: LocalSubjectAccessReview

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані списку. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewSpec" >}}">SubjectAccessReviewSpec</a>), обовʼязково

  Специфікація містить інформацію про запит, який оцінюється. spec.namespace повинен дорівнювати простору імен, щодо якого зроблено запит. Якщо поле порожнє, встановлюється стандартне значення.

- **status** (<a href="{{< ref "../authorization-resources/subject-access-review-v1#SubjectAccessReviewStatus" >}}">SubjectAccessReviewStatus</a>)

  Статус заповнюється сервером і вказує, чи дозволено запит, чи ні.

## Операції {#Operations}

---

### `create` створення LocalSubjectAccessReview {#create-create-a-localsubjectaccessreview}

#### HTTP запит {#http-request}

POST /apis/authorization.k8s.io/v1/namespaces/{namespace}/localsubjectaccessreviews

#### Параметри {#parameters}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../authorization-resources/local-subject-access-review-v1#LocalSubjectAccessReview" >}}">LocalSubjectAccessReview</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../authorization-resources/local-subject-access-review-v1#LocalSubjectAccessReview" >}}">LocalSubjectAccessReview</a>): OK

201 (<a href="{{< ref "../authorization-resources/local-subject-access-review-v1#LocalSubjectAccessReview" >}}">LocalSubjectAccessReview</a>): Created

202 (<a href="{{< ref "../authorization-resources/local-subject-access-review-v1#LocalSubjectAccessReview" >}}">LocalSubjectAccessReview</a>): Accepted

401: Unauthorized
