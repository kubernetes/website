---
api_metadata:
  apiVersion: "certificates.k8s.io/v1beta1"
  import: "k8s.io/api/certificates/v1beta1"
  kind: "PodCertificateRequest"
content_type: "api_reference"
description: "PodCertificateRequest кодує pod, що запитує сертифікат від певного підписувача."
title: "PodCertificateRequest v1beta1"
weight: 7
auto_generated: true
---

`apiVersion: certificates.k8s.io/v1beta1`

`import "k8s.io/api/certificates/v1beta1"`

## PodCertificateRequest {#PodCertificateRequest}

PodCertificateRequest кодує pod, що запитує сертифікат від певного підписувача.

Kubelets використовують цей API для реалізації cпроєцьованих томів podCertificate.

---

- **apiVersion**: certificates.k8s.io/v1beta1

- **kind**: PodCertificateRequest

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  metadata містить метадані обʼєкта.

- **spec** (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequestSpec" >}}">PodCertificateRequestSpec</a>), обовʼязково

  spec містить детальну інформацію про сертифікат, який запитується.

- **status** (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequestStatus" >}}">PodCertificateRequestStatus</a>)

  статус містить виданий сертифікат та стандартний набір станів.

## PodCertificateRequestSpec {#PodCertificateRequestSpec}

PodCertificateRequestSpec описує запит на сертифікат.  Всі поля є незмінними після створення.

---

- **nodeName** (string), обовʼязково

  nodeName — це імʼя вузла, до якого приписано под.

- **nodeUID** (string), обовʼязково

  nodeUID — це UID вузла, до якого приписано под.

- **pkixPublicKey** ([]byte), обовʼязково

  pkixPublicKey — це серіалізований за PKIX відкритий ключ, якому підписувач видасть сертифікат.

  Ключ повинен бути одним із таких: RSA3072, RSA4096, ECDSAP256, ECDSAP384, ECDSAP521 або ED25519. Зверніть увагу, що цей перелік може бути розширений у майбутньому.

  Реалізації підписувача не повинні підтримувати всі типи ключів, що підтримуються kube-apiserver та kubelet.  Якщо підписувач не підтримує тип ключа, що використовується для даного PodCertificateRequest, він повинен відхилити запит, встановивши запис status.conditions з типом "Denied" та причиною "UnsupportedKeyType". Він також може запропонувати тип ключа, який він підтримує, у полі повідомлення.

- **podName** (string), обовʼязково

  podName is the name of the pod into which the certificate will be mounted.

- **podUID** (string), обовʼязково

  podUID — це UID пода, в який буде підключено сертифікат.

- **proofOfPossession** ([]byte), обовʼязково

  proofOfPossession доводить, що kubelet, який надсилає запит, володіє приватним ключем, що відповідає pkixPublicKey.

  Він створюється шляхом підписання байтів ASCII UID pod за допомогою `pkixPublicKey`.

  kube-apiserver перевіряє доказ володіння під час створення PodCertificateRequest.

  Якщо ключ є ключем RSA, то підпис накладається на байти ASCII UID pod, використовуючи RSASSA-PSS з RFC 8017 (як реалізовано функцією golang crypto/rsa.SignPSS з опціями nil).

  Якщо ключ є ключем ECDSA, то підпис відповідає опису в [SEC 1, версія 2.0](https://www.secg.org/sec1-v2.pdf) (як реалізовано функцією бібліотеки golang crypto/ecdsa.SignASN1).

  Якщо ключ є ключем ED25519, підпис відповідає опису в [Специфікації ED25519](https://ed25519.cr.yp.to/) (як реалізовано в бібліотеці golang crypto/ed25519.Sign).

- **serviceAccountName** (string), обовʼязково

  serviceAccountName — це імʼя службового облікового запису, під яким працює под.

- **serviceAccountUID** (string), обовʼязково

  serviceAccountUID — це UID службового облікового запису, під яким працює под.

- **signerName** (string), обовʼязково

  signerName вказує на запитаного підписувача.

  Всі імена підписувачів, що починаються з `kubernetes.io`, зарезервовані для використання проєктом Kubernetes.  Наразі існує один відомий підписувач, задокументований проєктом Kubernetes, `kubernetes.io/kube-apiserver-client-pod`, який видаватиме клієнтські сертифікати, зрозумілі kube-apiserver.  Наразі він не реалізований.

- **maxExpirationSeconds** (int32)

  maxExpirationSeconds — максимальний термін дії сертифіката.

  Якщо це поле пропущено, kube-apiserver встановить значення 86400 (24 години). kube-apiserver відхилить значення, менші за 3600 (1 година).  Максимально допустиме значення — 7862400 (91 день).

  Після цього підписант може видавати сертифікати з будь-яким терміном дії, *коротшим* за MaxExpirationSeconds, але не коротшим за 3600 секунд (1 година).  Це обмеження застосовується kube-apiserver. Підписанти `kubernetes.io` ніколи не видають сертифікати з терміном дії, довшим за 24 години.

- **unverifiedUserAnnotations** (map[string]string)

  unverifiedUserAnnotations дозволяють авторам подів передавати додаткову інформацію до реалізації підписувача. Kubernetes жодним чином не обмежує та не перевіряє ці метадані.

  Записи підлягають тій самій перевірці, що й анотації метаданих обʼєктів, з тим доповненням, що всі ключі повинні мати префікс домену. На значення не накладаються жодні обмеження, за винятком загального обмеження розміру всього поля.

  Підписувачі повинні документувати ключі та значення, які вони підтримують.  Підписувачі повинні відхиляти запити, що містять ключі, які вони не розпізнають.

## PodCertificateRequestStatus {#PodCertificateRequestStatus}

PodCertificateRequestStatus описує стан запиту та містить дані сертифіката, якщо запит видано.

---

- **beginRefreshAt** (Time)

  beginRefreshAt — це час, коли kubelet повинен почати спробувати оновити сертифікат.  Це поле встановлюється через субресурс /status і повинно бути встановлено одночасно з certificateChain.  Після заповнення це поле є незмінним.

  Це поле є лише підказкою.  Kubelet може почати оновлення до або після цього часу, якщо це необхідно.

  <a name="Time"></a>
  *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

- **certificateChain** (string)

  certificateChain заповнюється сертифікатом, виданим підписувачем. Це поле встановлюється за допомогою субресурсу /status. Після заповнення це поле є незмінним.

  Якщо запит на підписання сертифіката відхилено, додається умова типу "Denied" (Відхилено), і це поле залишається порожнім. Якщо підписувач не може видати сертифікат, додається умова типу "Failed" (Не вдалося), і це поле залишається порожнім.

  Вимоги до перевірки:
  1. certificateChain повинен складатися з одного або декількох сертифікатів у форматі PEM.
  2. Кожен запис повинен бути дійсним сертифікатом ASN.1, обгорнутим у PEM та закодованим у DER, як описано в розділі 4 RFC5280.

  Якщо присутній більше ніж один блок, і визначення запитуваного spec.signerName не вказує на інше, перший блок є виданим сертифікатом, а наступні блоки повинні розглядатися як проміжні сертифікати і пред'являтися в TLS-рукостисканнях.  При проєціюванні ланцюжка в том пода, kubelet видалить будь-які дані між блоками PEM, а також будь-які заголовки блоків PEM.

- **conditions** ([]Condition)

  *Patch strategy: злиття за ключем `type`*

  *Map: унікальні значення за типом ключа будуть збережені під час злиття*

  conditions, що застосовуються до запиту.

  Типи "Issued", "Denied" та "Failed" мають особливий режим обробки.  Може бути присутнім не більше однієї з цих умов, і вони повинні мати статус "True".

  Якщо запит відхилено з причиною `Reason=UnsupportedKeyType`, підписувач може запропонувати тип ключа, який буде працювати в полі message.

  <a name="Condition"></a>
  *Condition містить детальну інформацію про один аспект поточного стану цього ресурсу API.*

  - **conditions.lastTransitionTime** (Time), обовʼязково

    lastTransitionTime — це останній час, коли стан змінився з одного на інший. Це має бути момент, коли змінився базовий стан.  Якщо це невідомо, то можна використовувати час, коли змінилося поле API.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string), обовʼязково

    message — це повідомлення, яке може прочитати людина, із детальною інформацією про перехід. Це може бути порожній рядок.

  - **conditions.reason** (string), обовʼязково

    reason містить програмний ідентифікатор, що вказує причину останнього переходу стану. Виробники конкретних типів станів можуть визначати очікувані значення та значення для цього поля, а також те, чи вважаються ці значення гарантованим API. Значення повинно бути рядком CamelCase. Це поле не може бути порожнім.

  - **conditions.status** (string), обовʼязково

    status стану, один з True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    type стану в форматі CamelCase або в foo.example.com/CamelCase.

  - **conditions.observedGeneration** (int64)

    observedGeneration представляє .metadata.generation, на основі якого було встановлено стан. Наприклад, якщо .metadata.generation наразі дорівнює 12, але .status.conditions[x].observedGeneration дорівнює 9, стан є застарілим стосовно поточного стану екземпляра.

- **notAfter** (Time)

  notAfter — це час, коли сертифікат втрачає чинність.  Значення повинно бути таким самим, як значення notAfter у кінцевому сертифікаті в certificateChain.  Це поле встановлюється за допомогою субресурсу /status.  Після заповнення воно є незмінним.  Підписувач повинен встановити це поле одночасно з certificateChain.

  <a name="Time"></a>
  *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

- **notBefore** (Time)

  notBefore — це час, з якого сертифікат стає дійсним. Значення повинно збігатися із значенням notBefore у кінцевому сертифікаті в certificateChain. Це поле встановлюється за допомогою субресурсу /status. Після заповнення воно є незмінним. Підписувач повинен встановити це поле одночасно із встановленням certificateChain.

  <a name="Time"></a>
  *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

## PodCertificateRequestList {#PodCertificateRequestList}

PodCertificateRequestList iє колекцією обʼєктів PodCertificateRequest

---

- **apiVersion**: certificates.k8s.io/v1beta1

- **kind**: PodCertificateRequestList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  metadata contains the list metadata.

- **items** ([]<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>), обовʼязково

  items — це колекція обʼєктів PodCertificateRequest.

## Operations {#Operations}

---

### `get` отримати статус вказаного PodCertificateRequest {#get-read-the-specified-podcertificaterequest}

#### HTTP запит {#HTTP-request}

GET /apis/certificates.k8s.io/v1beta1/namespaces/{namespace}/podcertificaterequests/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodCertificateRequest

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#responses}

200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>): OK

401: Unauthorized

### `get` отримати статус вказаного PodCertificateRequest {#get-read-status-of-the-specified-podcertificaterequest}

#### HTTP запит {#HTTP-request-1}

GET /apis/certificates.k8s.io/v1beta1/namespaces/{namespace}/podcertificaterequests/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodCertificateRequest

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#responses-1}

200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу PodCertificateRequest {#list-or-watch-objects-of-kind-podcertificaterequest-in-a-namespace}

#### HTTP запит {#HTTP-request-2}

GET /apis/certificates.k8s.io/v1beta1/namespaces/{namespace}/podcertificaterequests

#### Параметри {#parameters-2}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#responses-2}

200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequestList" >}}">PodCertificateRequestList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу PodCertificateRequest {#list-or-watch-objects-of-kind-podcertificaterequest}

#### HTTP запит {#HTTP-request-3}

GET /apis/certificates.k8s.io/v1beta1/podcertificaterequests

#### Параметри {#parameters-3}

- **allowWatchBookmarks** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

#### Відповідь {#responses-3}

200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequestList" >}}">PodCertificateRequestList</a>): OK

401: Unauthorized

### `create` створення PodCertificateRequest {#create-create-a-podcertificaterequest}

#### HTTP запит {#HTTP-request-4}

POST /apis/certificates.k8s.io/v1beta1/namespaces/{namespace}/podcertificaterequests

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#responses-4}

200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>): Created

202 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>): Accepted

401: Unauthorized

### `update` заміна вказаного PodCertificateRequest {#update-replace-the-specified-podcertificaterequest}

#### HTTP запит {#HTTP-request-5}

PUT /apis/certificates.k8s.io/v1beta1/namespaces/{namespace}/podcertificaterequests/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodCertificateRequest

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#responses-5}

200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного PodCertificateRequest {#update-replace-status-of-the-specified-podcertificaterequest}

#### HTTP запит {#HTTP-request-6}

PUT /apis/certificates.k8s.io/v1beta1/namespaces/{namespace}/podcertificaterequests/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodCertificateRequest

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#responses-6}

200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного PodCertificateRequest {#patch-partially-update-the-specified-podcertificaterequest}

#### HTTP запит {#HTTP-request-7}

PATCH /apis/certificates.k8s.io/v1beta1/namespaces/{namespace}/podcertificaterequests/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodCertificateRequest

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#responses-7}

200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного PodCertificateRequest {#patch-partially-update-status-of-the-specified-podcertificaterequest}

#### HTTP запит {#HTTP-request-8}

PATCH /apis/certificates.k8s.io/v1beta1/namespaces/{namespace}/podcertificaterequests/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodCertificateRequest

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#responses-8}

200 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/pod-certificate-request-v1beta1#PodCertificateRequest" >}}">PodCertificateRequest</a>): Created

401: Unauthorized

### `delete` видалення PodCertificateRequest {#delete-delete-a-podcertificaterequest}

#### HTTP запит {#HTTP-request-9}

DELETE /apis/certificates.k8s.io/v1beta1/namespaces/{namespace}/podcertificaterequests/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  імʼя PodCertificateRequest

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

#### Відповідь {#responses-9}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції PodCertificateRequest {#deletecollection-delete-collection-of-podcertificaterequest}

#### HTTP запит {#HTTP-request-10}

DELETE /apis/certificates.k8s.io/v1beta1/namespaces/{namespace}/podcertificaterequests

#### Параметри {#parameters-10}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*в запиті*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*в запиті*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

#### Відповідь {#responses-10}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
