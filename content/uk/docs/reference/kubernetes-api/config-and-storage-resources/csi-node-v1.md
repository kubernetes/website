---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSINode"
content_type: "api_reference"
description: "CSINode містить інформацію про всі драйвери CSI, встановлені на вузлі."
title: "CSINode"
weight: 4
auto_generated: false
---

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## CSINode {#CSINode}

CSINode містить інформацію про всі драйвери CSI, встановлені на вузлі. Драйверам CSI не потрібно створювати обʼєкт CSINode безпосередньо. Якщо вони використовують sidecar контейнер node-driver-registrar, kubelet автоматично заповнить обʼєкт CSINode для драйвера CSI під час реєстрації втулка kubelet. CSINode має ту ж назву, що і вузол. Якщо обʼєкт відсутній, це означає, що або на вузлі немає доступних драйверів CSI, або версія Kubelet є достатньо низькою, щоб не створювати цей обʼєкт. CSINode має OwnerReference, яке вказує на відповідний обʼєкт вузла.

---

- **apiVersion**: storage.k8s.io/v1

- **kind**: CSINode

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. metadata.name має бути назвою вузла Kubernetes.

- **spec** (<a href="{{< ref "#CSINodeSpec" >}}">CSINodeSpec</a>)

  spec — це специфікація CSINode

## CSINodeSpec {#CSINodeSpec}

CSINodeSpec містить інформацію про специфікації всіх драйверів CSI, встановлених на вузлі.

---

- **drivers** ([]CSINodeDriver), обовʼязково

  *Patch strategy: обʼєднання за ключем `name`*

  *Map: унікальні значення ключа name будуть збережені під час злиття*

  drivers — це список інформації про всі драйвери CSI, які існують на вузлі. Якщо всі драйвери в списку видалено, цей список може бути порожнім.

  <a name="CSINodeDriver"></a>
  *CSINodeDriver містить інформацію про специфікацію одного драйвера CSI, встановленого на вузлі*

  - **drivers.name** (string), обовʼязково

    name представляє імʼя драйвера CSI, до якого відноситься цей обʼєкт. Це МАЄ бути те саме імʼя, яке повертає виклик CSI GetPluginName() для цього драйвера.

  - **drivers.nodeID** (string), обовʼязково

    nodeID вузла з погляду драйвера. Це поле дозволяє Kubernetes взаємодіяти з системами зберігання, які не використовують ту ж номенклатуру для вузлів. Наприклад, Kubernetes може називати вузол "node1", але система зберігання може називати той самий вузол "nodeA". Коли Kubernetes видає команду системі зберігання для приєднання тому до конкретного вузла, він може використовувати це поле для посилання на імʼя вузла за допомогою ID, який зрозуміє система зберігання, наприклад "nodeA" замість "node1". Це поле обовʼязкове.

  - **drivers.allocatable** (VolumeNodeResources)

    allocatable представляє ресурс тому вузла, доступний для планування. Це поле є бета-версією.

    <a name="VolumeNodeResources"></a>
    *VolumeNodeResources — це набір обмежень ресурсів для планування томів.*

    - **drivers.allocatable.count** (int32)

      count вказує максимальну кількість унікальних томів, що керуються драйвером CSI, які можна використовувати на вузлі. Том, який одночасно приєднаний і змонтований на вузлі, вважається використаним один раз, а не двічі. Те саме правило застосовується до унікального тому, який розділяється між кількома Podʼами на одному вузлі. Якщо це поле не вказано, то кількість підтримуваних томів на цьому вузлі не обмежена.

  - **drivers.topologyKeys** ([]string)

    *Atomic: буде замінено під час злиття*

    topologyKeys — це список ключів, підтримуваних драйвером. Коли драйвер ініціалізується в кластері, він надає набір ключів топології, які він розуміє (наприклад, "company.com/zone", "company.com/region"). Коли драйвер ініціалізується на вузлі, він надає ті самі ключі топології разом зі значеннями. Kubelet відображатиме ці ключі топології як мітки на своєму власному обʼєкті вузла. Коли Kubernetes виконує планування з урахуванням топології, він може використовувати цей список для визначення, які мітки він повинен отримати з обʼєкта вузла та передати назад драйверу. Для різних вузлів можуть використовуватися різні ключі топології. Це поле може бути порожнім, якщо драйвер не підтримує топологію.

## CSINodeList {#CSINodeList}

CSINodeList — це колекція обʼєктів CSINode.

---

- **apiVersion**: storage.k8s.io/v1

- **kind**: CSINodeList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>), обовʼязково

  items — це список CSINode.

## Операції {#operations}

---

### `get` отримати вказаний CSINode {#get-read-the-specified-csinode}

#### HTTP запит {#http-request}

GET /apis/storage.k8s.io/v1/csinodes/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  name of the CSINode

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу CSINode {#list-list-or-watch-objects-of-kind-csinode}

#### HTTP запит {#http-request-1}

GET /apis/storage.k8s.io/v1/csinodes

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINodeList" >}}">CSINodeList</a>): OK

401: Unauthorized

### `create` створення CSINode {#create-create-a-csinode}

#### HTTP запит {#http-request-2}

POST /apis/storage.k8s.io/v1/csinodes

#### Параметри {#parameters-2}

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): Accepted

401: Unauthorized

### `update` заміна вказаного CSINode {#update-replace-the-specified-csinode}

#### HTTP запит {#http-request-3}

PUT /apis/storage.k8s.io/v1/csinodes/{name}

#### Параметри {#parameters-3}

- **name** (*в шляху*): string, обовʼязково

  name of the CSINode

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного CSINode {#patch-partially-update-the-specified-csinode}

#### HTTP запит {#http-request-4}

PATCH /apis/storage.k8s.io/v1/csinodes/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  name of the CSINode

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): Created

401: Unauthorized

### `delete` видалення CSINode {#delete-delete-a-csinode}

#### HTTP запит {#http-request-5}

DELETE /apis/storage.k8s.io/v1/csinodes/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  name of the CSINode

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/csi-node-v1#CSINode" >}}">CSINode</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції CSINode {#deletecollection-delete-collection-of-csinode}

#### HTTP запит {#http-request-6}

DELETE /apis/storage.k8s.io/v1/csinodes

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
