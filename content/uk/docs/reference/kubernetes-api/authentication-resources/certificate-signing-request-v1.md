---
api_metadata:
  apiVersion: "certificates.k8s.io/v1"
  import: "k8s.io/api/certificates/v1"
  kind: "CertificateSigningRequest"
content_type: "api_reference"
description: "Обʼєкти CertificateSigningRequest надають механізм для отримання сертифікатів x509 шляхом подання запиту на підписання сертифіката та його асинхронного схвалення і видачі."
title: "CertificateSigningRequest"
weight: 4
auto_generated: false
---

`apiVersion: certificates.k8s.io/v1`

`import "k8s.io/api/certificates/v1"`

## CertificateSigningRequest {#CertificateSigningRequest}

Обʼєкти CertificateSigningRequest надають механізм для отримання сертифікатів x509 шляхом подання запиту на підписання сертифіката та його асинхронного схвалення і видачі.

Kubelets використовують цей API для отримання:

1. клієнтських сертифікатів для автентифікації до kube-apiserver (з використанням signerName "kubernetes.io/kube-apiserver-client-kubelet").
2. серверних сертифікатів для TLS-точок доступу, до яких kube-apiserver може підключатися безпечно (з використанням signerName "kubernetes.io/kubelet-serving").

Цей API може бути використаний для запиту клієнтських сертифікатів для автентифікації до kube-apiserver (з використанням signerName "kubernetes.io/kube-apiserver-client") або для отримання сертифікатів від нестандартних підписувачів, що не належать до Kubernetes.

---

- **apiVersion**: certificates.k8s.io/v1

- **kind**: CertificateSigningRequest

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

- **spec** (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequestSpec" >}}">CertificateSigningRequestSpec</a>), обовʼязково

  spec містить запит на сертифікат і є незмінним після створення. Тільки поля request, signerName, expirationSeconds та usages можуть бути встановлені під час створення. Інші поля визначаються Kubernetes і не можуть бути змінені користувачами.

- **status** (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequestStatus" >}}">CertificateSigningRequestStatus</a>)

  status містить інформацію про те, чи запит схвалено або відхилено, а також сертифікат, виданий підписувачем, або умови збою, які вказують на збій підписувача.

## CertificateSigningRequestSpec {#CertificateSigningRequestSpec}

CertificateSigningRequestSpec містить запит на сертифікат.

---

- **request** ([]byte), обовʼязково

  request містить x509 запит на підписання сертифіката, закодований у блоці PEM "CERTIFICATE REQUEST". При серіалізації у форматі JSON або YAML дані додатково кодуються в base64.

- **signerName** (string), обовʼязково

  signerName вказує на запитуваного підписувача і є кваліфікованим імʼям.

  Запити List/watch для CertificateSigningRequests можуть фільтруватися за цим полем з використанням fieldSelector "spec.signerName=NAME".

  Добре відомі підписувачі Kubernetes:

  1. "kubernetes.io/kube-apiserver-client": видає клієнтські сертифікати, які можна використовувати для автентифікації до kube-apiserver. Запити для цього підписувача ніколи не затверджуються автоматично kube-controller-manager, можуть бути видані контролером "csrsigning" у kube-controller-manager.
  2. "kubernetes.io/kube-apiserver-client-kubelet": видає клієнтські сертифікати, які kubelets використовують для автентифікації до kube-apiserver. Запити для цього підписувача можуть бути автоматично затверджені контролером "csrapproving" у kube-controller-manager і можуть бути видані контролером "csrsigning" у kube-controller-manager.
  3. "kubernetes.io/kubelet-serving": видає серверні сертифікати, які kubelets використовують для обслуговування TLS-точок доступу, до яких kube-apiserver може підключатися безпечно. Запити для цього підписувача ніколи не затверджуються автоматично kube-controller-manager і можуть бути видані контролером "csrsigning" у kube-controller-manager.

  Докладніше: [https://k8s.io/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers](/docs/reference/access-authn-authz/certificate-signing-requests/#kubernetes-signers)

  Можуть також бути вказані нестандартні signerNames. Підписувач визначає:

  1. Розповсюдження довіри: як розповсюджуються довірчі пакети (CA bundles).
  2. Дозволені субʼєкти: та поведінка, коли запитується недозволений субʼєкт.
  3. Обовʼязкові, дозволені або заборонені розширення x509 у запиті (включаючи те, чи дозволені subjectAltNames, які типи, обмеження на дозволені значення) та поведінка при запиті недозволеного розширення.
  4. Обовʼязкові, дозволені або заборонені ключові використання / розширені ключові використання.
  5. Термін дії сертифіката: чи він фіксований підписувачем, налаштовується адміністратором.
  6. Чи дозволені запити на сертифікати CA.

- **expirationSeconds** (int32)

  expirationSeconds — це запитувана тривалість дії виданого сертифіката. Підписувач сертифіката може видати сертифікат з іншою тривалістю дії, тому клієнт повинен перевірити різницю між полями notBefore і notAfter у виданому сертифікаті, щоб визначити фактичну тривалість.

  Реалізації v1.22+ вбудованих підписувачів Kubernetes дотримуватимуться цього поля, якщо запитувана тривалість не перевищує максимальну тривалість, яку вони дозволяють відповідно до прапорця CLI `--cluster-signing-duration` для контролера Kubernetes.

  Підписувачі сертифікатів можуть не дотримуватися цього поля з різних причин:

  1. Старий підписувач, який не знає про це поле (наприклад, вбудовані реалізації до v1.22)
  2. Підписувач, чия налаштована максимальна тривалість коротша за запитувану тривалість
  3. Підписувач, чия налаштована мінімальна тривалість довша за запитувану тривалість

  Мінімальне дійсне значення для expirationSeconds — 600, тобто 10 хвилин.

- **extra** (map[string][]string)

  extra містить додаткові атрибути користувача, який створив CertificateSigningRequest. Заповнюється API-сервером при створенні та є незмінним.

- **groups** ([]string)

  *Atomic: буде замінено під час злиття*

  groups містить членство в групах користувача, який створив CertificateSigningRequest. Заповнюється API-сервером при створенні та є незмінним.

- **uid** (string)

  uid містить uid користувача, який створив CertificateSigningRequest. Заповнюється API-сервером при створенні та є незмінним.

- **usages** ([]string)

  *Atomic: буде замінено під час злиття*

  usages вказує набір запитуваних використань ключів у виданому сертифікаті.

  Запити на TLS клієнтські сертифікати зазвичай запитують: "digital signature", "key encipherment", "client auth".

  Запити на TLS серверні сертифікати зазвичай запитують: "key encipherment", "digital signature", "server auth".

  Дійсні значення: "signing", "digital signature", "content commitment", "key encipherment", "key agreement", "data encipherment", "cert sign", "crl sign", "encipher only", "decipher only", "any", "server auth", "client auth", "code signing", "email protection", "s/mime", "ipsec end system", "ipsec tunnel", "ipsec user", "timestamping", "ocsp signing", "microsoft sgc", "netscape sgc"

- **username** (string)

  username містить імʼя користувача, який створив CertificateSigningRequest. Заповнюється API-сервером при створенні та є незмінним.

## CertificateSigningRequestStatus {#CertificateSigningRequestStatus}

CertificateSigningRequestStatus містить умови, що використовуються для позначення статусу запиту (схвалено/відхилено/не вдалося), та виданий сертифікат.

---

- **certificate** ([]byte)

  certificate заповнюється виданим сертифікатом підписувача після наявності умови "Approved". Це поле встановлюється через субресурс /status. Після заповнення це поле є незмінним.

  Якщо запит на підписання сертифіката відхилено, додається умова типу "Denied", і це поле залишається порожнім. Якщо підписувач не може видати сертифікат, додається умова типу "Failed", і це поле залишається порожнім.

  Вимоги до валідації:
  1. certificate повинно містити один або більше PEM блоків.
  2. Усі PEM блоки повинні мати мітку "CERTIFICATE", не містити заголовків, а закодовані дані повинні бути структурою сертифіката BER-кодованого ASN.1, як описано в розділі 4 RFC5280.
  3. Не-PEM вміст може зʼявлятися до або після блоків PEM "CERTIFICATE" і не перевіряється, щоб дозволити пояснювальний текст, як описано в розділі 5.2 RFC7468.

  Якщо в наявності більше одного блоку PEM, і визначення запитуваного spec.signerName не вказує інше, перший блок є виданим сертифікатом, а наступні блоки слід розглядати як проміжні сертифікати та представлятись під час TLS-handshake.

  Сертифікат закодований у форматі PEM.

  При серіалізації у форматі JSON або YAML дані додатково кодуються в base64, тому вони складаються з:

      base64(
      -----BEGIN CERTIFICATE-----
      ...
      -----END CERTIFICATE-----
      )

- **conditions** ([]CertificateSigningRequestCondition)

  *Map: унікальні значення за ключем типу зберігатимуться під час злиття*

  conditions, застосовані до запиту. Відомі стани: "Approved", "Denied" та "Failed".

  <a name="CertificateSigningRequestCondition"></a>
  *CertificateSigningRequestCondition описує стан обʼєкта CertificateSigningRequest*

  - **conditions.status** (string), обовʼязково

    статус стану, одне з True, False, Unknown. Стани "Approved", "Denied" та "Failed" не можуть бути "False" або "Unknown".

  - **conditions.type** (string), обовʼязково

    тип стану. Відомі стани: "Approved", "Denied" та "Failed".

    Стан "Approved" додається через субресурс /approval, що вказує на те, що запит було схвалено і сертифікат повинен бути виданий підписувачем.

    Стан "Denied" додається через субресурс /approval, що вказує на те, що запит було відхилено і сертифікат не повинен бути виданий підписувачем.

    Стан "Failed" додається через субресурс /status, що вказує на те, що підписувачу не вдалося видати сертифікат.

    Стан "Approved" та "Denied" є взаємозаперечними. Стани "Approved", "Denied" та "Failed" не можуть бути видалені після додавання.

    Дозволено лише один стан певного типу.

  - **conditions.lastTransitionTime** (Time)

    lastTransitionTime - це час останньої зміни стану з одного статусу до іншого. Якщо не встановлено, коли додається новий тип стану або змінюється статус поточного стану, сервер стандартно встановлює цей час на поточний.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.lastUpdateTime** (Time)

    lastUpdateTime — це час останнього оновлення цього стану.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string)

    message містить зрозуміле для людини повідомлення з деталями про стан запиту.

  - **conditions.reason** (string)

    reason вказує коротку причину стану запиту.

## CertificateSigningRequestList {#CertificateSigningRequestList}

CertificateSigningRequestList — це колекція обʼєктів CertificateSigningRequest.

---

- **apiVersion**: certificates.k8s.io/v1

- **kind**: CertificateSigningRequestList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

- **items** ([]<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>), обовʼязково

  items — це колекція обʼєктів CertificateSigningRequest.

## Операції {#Operations}

### `get` отримати вказаний CertificateSigningRequest {#get-read-the-specified-certificatesigningrequest}

#### HTTP запит {#http-request}

GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  name of the CertificateSigningRequest

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#responses}

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

401: Unauthorized

### `get` отримати схвалення вказаного CertificateSigningRequest {#get-read-approval-of-the-specified-certificatesigningrequest}

#### HTTP запит {#http-request-1}

GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/approval

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  name of the CertificateSigningRequest

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#responses-1}

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

401: Unauthorized

### `get` отримати статус вказаного CertificateSigningRequest {#get-read-status-of-the-specified-certificatesigningrequest}

#### HTTP запит {#http-request-2}

GET /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/status

#### Параметри {#parameters-2}

- **name** (*в шляху*): string, обовʼязково

  name of the CertificateSigningRequest

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#responses-2}

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу CertificateSigningRequest {#list-list-or-watch-objects-of-kind-certificatesigningrequest}

#### HTTP запит {#http-request-3}

GET /apis/certificates.k8s.io/v1/certificatesigningrequests

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

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequestList" >}}">CertificateSigningRequestList</a>): OK

401: Unauthorized

### `create` створення CertificateSigningRequest {#create-create-a-certificatesigningrequest}

#### HTTP запит {#http-request-4}

POST /apis/certificates.k8s.io/v1/certificatesigningrequests

#### Параметри {#parameters-4}

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#responses-4}

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

202 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Accepted

401: Unauthorized

### `update` заміна вказаного CertificateSigningRequest {#update-replace-the-specified-certificatesigningrequest}

#### HTTP запит {#http-request-5}

PUT /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#responses-5}

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized

### `update` заміна підтвердження вказаного CertificateSigningRequest {#update-replace-approval-of-the-specified-certificatesigningrequest}

#### HTTP запит {#http-request-6}

PUT /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/approval

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#responses-6}

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного CertificateSigningRequest {#update-replace-status-of-the-specified-certificatesigningrequest}

#### HTTP запит {#http-request-7}

PUT /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/status

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  name of the CertificateSigningRequest

- **body**: <a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#responses-7}

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного CertificateSigningRequest {#patch-partially-update-the-specified-certificatesigningrequest}

#### HTTP запит {#http-request-8}

PATCH /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  name of the CertificateSigningRequest

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

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized

### `patch` часткове оновлення затвердження вказаного CertificateSigningRequest {#patch-partially-update-approval-of-the-specified-certificatesigningrequest}

#### HTTP запит {#http-request-9}

PATCH /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/approval

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  name of the CertificateSigningRequest

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

#### Відповідь {#responses-9}

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного CertificateSigningRequest {#patch-partially-update-status-of-the-specified-certificatesigningrequest}

#### HTTP запит {#http-request-10}

PATCH /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}/status

#### Параметри {#parameters-10}

- **name** (*в шляху*): string, обовʼязково

  name of the CertificateSigningRequest

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

#### Відповідь {#responses-10}

200 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): OK

201 (<a href="{{< ref "../authentication-resources/certificate-signing-request-v1#CertificateSigningRequest" >}}">CertificateSigningRequest</a>): Created

401: Unauthorized

### `delete` видалення CertificateSigningRequest {#delete-delete-a-certificatesigningrequest}

#### HTTP запит {#http-request-11}

DELETE /apis/certificates.k8s.io/v1/certificatesigningrequests/{name}

#### Параметри {#parameters-11}

- **name** (*в шляху*): string, обовʼязково

  name of the CertificateSigningRequest

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

#### Відповідь {#responses-11}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції CertificateSigningRequest {#deletecollection-delete-collection-of-certificatesigningrequest}

#### HTTP запит {#http-request-12}

DELETE /apis/certificates.k8s.io/v1/certificatesigningrequests

#### Параметри {#parameters-12}

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

#### Відповідь {#responses-12}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
