---
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "TokenReview"
content_type: "api_reference"
description: "TokenReview намагається автентифікувати токен вже відомому користувачу."
title: "TokenReview"
weight: 3
auto_generated: false
---

`apiVersion: authentication.k8s.io/v1`

`import "k8s.io/api/authentication/v1"`

## TokenReview {#TokenReview}

TokenReview намагається автентифікувати токен вже відомому користувачу. Примітка: запити TokenReview можуть кешуватися dnekrjv автентифікації вебхука в kube-apiserver.

---

- **apiVersion**: authentication.k8s.io/v1

- **kind**: TokenReview

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  metadata — стандартні метадані обʼєкта. Докладніше: <https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata>

- **spec** (<a href="{{< ref "../authentication-resources/token-review-v1#TokenReviewSpec" >}}">TokenReviewSpec</a>), обовʼязково

  spec містить інформацію про запит, що оцінюється

- **status** (<a href="{{< ref "../authentication-resources/token-review-v1#TokenReviewStatus" >}}">TokenReviewStatus</a>)

  status заповнюється сервером і вказує, чи можна автентифікувати запит.

## TokenReviewSpec {#TokenReviewSpec}

TokenReviewSpec є описом запиту автентифікації токена.

---

- **token** (string), обовʼязково

  token — це непрозорий токен на предʼявника.

- **audiences** ([]string)

  *Atomic: буде замінено під час злиття*

  audiences — це список ідентифікаторів, які сервер ресурсів, представлений токеном, розпізнає як. Автентифікатори токенів, що володіють інформацією про аудиторію, перевірять, що токен був призначений принаймні для однієї з аудиторій у цьому списку. Якщо аудиторії не надані, типово використовується аудиторія Kubernetes apiserver.

## TokenReviewStatus {#TokenReviewStatus}

TokenReviewStatus — це результат запиту автентифікації токена.

---

- **audiences** ([]string)

  *Atomic: буде замінено під час злиття*

  audiences — це ідентифікатори аудиторії, обрані автентифікатором, які сумісні як з TokenReview, так і з токеном. Ідентифікатор є будь-яким ідентифікатором у перетині аудиторій TokenReviewSpec та аудиторій токена. Клієнт TokenReview API, який встановлює поле spec.audiences, повинен перевірити, що сумісний ідентифікатор аудиторії повертається в полі status.audiences, щоб переконатися, що сервер TokenReview враховує аудиторію. Якщо TokenReview повертає порожнє поле status.audience, де status.authenticated є "true", токен дійсний для аудиторії Kubernetes API server.

- **authenticated** (boolean)

  authenticated вказує, що токен був повʼязаний з відомим користувачем.

- **error** (string)

  error вказує, що токен не вдалося перевірити

- **user** (UserInfo)

  user — це UserInfo, повʼязаний із наданим токеном.

  <a name="UserInfo"></a>
  *UserInfo містить інформацію про користувача, необхідну для реалізації інтерфейсу user.Info.*

  - **user.extra** (map[string][]string)

    extra — будь-яка додаткова інформація, надана автентифікатором.

  - **user.groups** ([]string)

    *Atomic: буде замінено під час злиття*

    groups — назви груп, до яких належить цей користувач.

  - **user.uid** (string)

    uid — унікальне значення, яке ідентифікує цього користувача з плином часу. Якщо цього користувача видаляють і додають іншого користувача з тим же імʼям, вони матимуть різні UID.

  - **user.username** (string)

    username — імʼя, яке унікально ідентифікує цього користувача серед усіх активних користувачів.

## Операції {#Operations}

### `create` створення TokenReview {#create-create-a-tokenreview}

#### HTTP запит {#http-request}

POST /apis/authentication.k8s.io/v1/tokenreviews

#### Параметри запиту

- **body**: <a href="{{< ref "../authentication-resources/token-review-v1#TokenReview" >}}">TokenReview</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../authentication-resources/token-review-v1#TokenReview" >}}">TokenReview</a>): OK

201 (<a href="{{< ref "../authentication-resources/token-review-v1#TokenReview" >}}">TokenReview</a>): Created

202 (<a href="{{< ref "../authentication-resources/token-review-v1#TokenReview" >}}">TokenReview</a>): Accepted

401: Unauthorized
