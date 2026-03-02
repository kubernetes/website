---
api_metadata:
  apiVersion: "authentication.k8s.io/v1"
  import: "k8s.io/api/authentication/v1"
  kind: "TokenRequest"
content_type: "api_reference"
description: "TokenRequest запитує токен для вказаного службового облікового запису."
title: "TokenRequest"
weight: 2
auto_generated: false
---

`apiVersion: authentication.k8s.io/v1`

`import "k8s.io/api/authentication/v1"`

## TokenRequest {#TokenRequest}

TokenRequest запитує токен для вказаного службового облікового запису.

---

- **apiVersion**: authentication.k8s.io/v1

- **kind**: TokenRequest

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequestSpec" >}}">TokenRequestSpec</a>), обовʼязково

  Spec містить інформацію про запит, що оцінюється.

- **status** (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequestStatus" >}}">TokenRequestStatus</a>)

  Status заповнюється сервером і вказує, чи може токен бути автентифікований.

## TokenRequestSpec {#TokenRequestSpec}

TokenRequestSpec містить параметри запиту токена, надані клієнтом.

---

- **audiences** ([]string), обовʼязково

  *Atomic: буде замінено під час злиття*

  Audiences — це цільові аудиторії токена. Отримувач токена повинен ідентифікувати себе за допомогою ідентифікатора зі списку аудиторій токена, інакше він повинен відхилити токен. Токен, виданий для кількох аудиторій, може бути використаний для автентифікації з будь-якою з вказаних аудиторій, що передбачає високий ступінь довіри між цільовими аудиторіями.

- **boundObjectRef** (BoundObjectReference)

  BoundObjectRef — це посилання на обʼєкт, до якого буде привʼязано токен. Токен буде дійсний лише до тих пір, поки існує привʼязаний обʼєкт. ПРИМІТКА: Точка доступу TokenReview сервера API перевірить BoundObjectRef, але інші аудиторії можуть цього не робити. Тримайте ExpirationSeconds маленьким, якщо ви хочете швидке відкликання.

  <a name="BoundObjectReference"></a>
  *BoundObjectReference — це посилання на обʼєкт, до якого привʼязано токен.*

  - **boundObjectRef.apiVersion** (string)

    Версія API посилання.

  - **boundObjectRef.kind** (string)

    Тип посилання. Дійсними типами є 'Pod' та 'Secret'.

  - **boundObjectRef.name** (string)

    Імʼя посилання.

  - **boundObjectRef.uid** (string)

    UID посилання.

- **expirationSeconds** (int64)

  ExpirationSeconds — це запитувана тривалість дії запиту. Видавець токенів може повернути токен з іншою тривалістю дії, тому клієнт повинен перевірити поле 'expiration' у відповіді.

## TokenRequestStatus {#TokenRequestStatus}

TokenRequestStatus — це результат запиту на отримання токена.

---

- **expirationTimestamp** (Time), обовʼязково

  ExpirationTimestamp — це час закінчення дії виданого токена.

  <a name="Time"></a>
  *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

- **token** (string), обовʼязково

  Token — це непрозорий токен на предʼявника.

## Операції {#operations}

---

### `create` створення токена ServiceAccount

#### HTTP запит {#http-request}

POST /api/v1/namespaces/{namespace}/serviceaccounts/{name}/token

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  name of the TokenRequest

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../authentication-resources/token-request-v1#TokenRequest" >}}">TokenRequest</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповіді {#responses}

200 (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequest" >}}">TokenRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequest" >}}">TokenRequest</a>): Created

202 (<a href="{{< ref "../authentication-resources/token-request-v1#TokenRequest" >}}">TokenRequest</a>): Accepted

401: Unauthorized
