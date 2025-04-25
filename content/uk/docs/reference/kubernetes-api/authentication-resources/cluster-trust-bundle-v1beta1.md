---
api_metadata:
  apiVersion: "certificates.k8s.io/v1beta1"
  import: "k8s.io/api/certificates/v1beta1"
  kind: "ClusterTrustBundle"
content_type: "api_reference"
description: "ClusterTrustBundle — це кластерний контейнер для X."
title: "ClusterTrustBundle v1beta1"
weight: 5
auto_generated: false
---

`apiVersion: certificates.k8s.io/v1beta1`

`import "k8s.io/api/certificates/v1beta1"`

## ClusterTrustBundle {#ClusterTrustBundle}

ClusterTrustBundle — це кластерний контейнер для довірчих якорів X.509 (кореневих сертифікатів).

Обʼєкти ClusterTrustBundle вважаються доступними для читання будь-яким автентифікованим користувачем у кластері, оскільки їх можна монтувати в Pod за допомогою проєкції `clusterTrustBundle`. Усі службові облікові записи типово мають доступ на читання ClusterTrustBundles. Користувачі, які мають доступ лише на рівні простору імен у кластері, можуть читати ClusterTrustBundles, використовуючи serviceaccount, до якого вони мають доступ.

Він може бути опціонально повʼязаний з певним підписувачем, у такому випадку він містить один дійсний набір довірчих якорів для цього підписувача. Підписувачі можуть мати кілька повʼязаних ClusterTrustBundles; кожен з них є незалежним набором довірчих якорів для цього підписувача. Контроль доступу використовується для забезпечення того, що лише користувачі з правами підписувача можуть створювати або змінювати відповідний набір.

---

- **apiVersion**: certificates.k8s.io/v1beta1

- **kind**: ClusterTrustBundle

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  metadata містить метадані обʼєкта.

- **spec** (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundleSpec" >}}">ClusterTrustBundleSpec</a>), обовʼязково

  spec містить підписувача (якщо є) та довірчі якорі.

## ClusterTrustBundleSpec {#ClusterTrustBundleSpec}

ClusterTrustBundleSpec містить інформацію про підписувача та довірчі якорі.

---

- **trustBundle** (string), обовʼязково

  trustBundle містить окремі довірчі якорі X.509 для цього набору, у вигляді PEM-пакета PEM-обгорток, DER-форматованих сертифікатів X.509.

  Дані повинні складатися лише з PEM-блоків сертифікатів, які розпізнаються як дійсні сертифікати X.509. Кожен сертифікат повинен містити розширення базових обмежень з встановленою позначкою CA. Сервер API відхилить обʼєкти, що містять дублюючі сертифікати або використовують заголовки блоків PEM.

  Користувачі ClusterTrustBundle, включаючи Kubelet, вільні переупорядковувати та видаляти дублікати блоків сертифікатів у цьому файлі за власною логікою, а також видаляти заголовки блоків PEM та міжблокові дані.

- **signerName** (string)

  signerName вказує повʼязаного підписувача, якщо такий є.

  Щоб створити або оновити ClusterTrustBundle з встановленим signerName, вам потрібно мати наступні дозволи на рівні кластера: group=certificates.k8s.io resource=signers resourceName=\<імʼя підписувача> verb=attest.

  Якщо signerName не порожній, тоді обʼєкт ClusterTrustBundle повинен мати імʼя, що починається з імені підписувача як префікс (перекладаючи косі на двокрапки). Наприклад, для імені підписувача `example.com/foo`, допустимі імена обʼєктів ClusterTrustBundle включають `example.com:foo:abc` та `example.com:foo:v1`.

  Якщо signerName порожній, тоді імʼя обʼєкта ClusterTrustBundle не повинно мати такого префікса.

  Запити на список/перегляд ClusterTrustBundle можуть фільтрувати за цим полем, використовуючи селектор поля `spec.signerName=NAME`.

## ClusterTrustBundleList {#ClusterTrustBundleList}

ClusterTrustBundleList — це колекція обʼєктів ClusterTrustBundle.

---

- **apiVersion**: certificates.k8s.io/v1beta1

- **kind**: ClusterTrustBundleList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  metadata містить метадані списку.

- **items** ([]<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>), обовʼязково

  items — це колекція обʼєктів ClusterTrustBundle.

## Операції {#Operations}

---

### `get` отримати вказаний ClusterTrustBundle {#get-read-the-specified-clustertrustbundle}

#### HTTP запит {#http-request}

GET /apis/certificates.k8s.io/v1beta1/clustertrustbundles/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  name of the ClusterTrustBundle

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу ClusterTrustBundle {#list-list-or-watch-objects-of-kind-clustertrustbundle}

#### HTTP запит {#http-request-1}

GET /apis/certificates.k8s.io/v1beta1/clustertrustbundles

#### Параметри {#parameters-1}

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

#### Відповідь {#response-1}

200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundleList" >}}">ClusterTrustBundleList</a>): OK

401: Unauthorized

### `create` створення ClusterTrustBundle {#create-create-a-clustertrustbundle}

#### HTTP запит {#http-request-2}

POST /apis/certificates.k8s.io/v1beta1/clustertrustbundles

#### Параметри {#parameters-2}

- **body**: <a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

201 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Created

202 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Accepted

401: Unauthorized

### `update` заміна вказаного ClusterTrustBundle {#update-replace-the-specified-clustertrustbundle}

#### HTTP запит {#http-request-3}

PUT /apis/certificates.k8s.io/v1beta1/clustertrustbundles/{name}

#### Параметри {#parameters-3}

- **name** (*в шляху*): string, обовʼязково

  name of the ClusterTrustBundle

- **body**: <a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

201 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного ClusterTrustBundle {#patch-partially-update-the-specified-clustertrustbundle}

#### HTTP запит {#http-request-4}

PATCH /apis/certificates.k8s.io/v1beta1/clustertrustbundles/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  name of the ClusterTrustBundle

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

#### Відповідь {#response-4}

200 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): OK

201 (<a href="{{< ref "../authentication-resources/cluster-trust-bundle-v1beta1#ClusterTrustBundle" >}}">ClusterTrustBundle</a>): Created

401: Unauthorized

### `delete` видалення ClusterTrustBundle {#delete-delete-a-clustertrustbundle}

#### HTTP запит {#http-request-5}

DELETE /apis/certificates.k8s.io/v1beta1/clustertrustbundles/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  name of the ClusterTrustBundle

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

#### Відповідь {#response-5}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції ClusterTrustBundle {#deletecollection-delete-collection-of-clustertrustbundle}

#### HTTP запит {#http-request-6}

DELETE /apis/certificates.k8s.io/v1beta1/clustertrustbundles

#### Параметри {#parameters-6}

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

#### Відповідь {#response-6}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
