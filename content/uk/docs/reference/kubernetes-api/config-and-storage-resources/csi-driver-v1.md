---
api_metadata:
  apiVersion: "storage.k8s.io/v1"
  import: "k8s.io/api/storage/v1"
  kind: "CSIDriver"
content_type: "api_reference"
description: "CSIDriver збирає інформацію про драйвер тома Container Storage Interface (CSI), розгорнутий в кластері."
title: "CSIDriver"
weight: 3
auto_generated: false
---

`apiVersion: storage.k8s.io/v1`

`import "k8s.io/api/storage/v1"`

## CSIDriver {#CSIDriver}

CSIDriver збирає інформацію про драйвер тому Container Storage Interface (CSI), розгорнутий в кластері. Контролер приєднання та відʼєднання Kubernetes використовує цей обʼєкт для визначення необхідності приєднання. Kubelet використовує цей обʼєкт, щоб визначити, чи потрібно передавати інформацію про контейнер при монтуванні. Обʼєкти CSIDriver не має простору імен.

---

- **apiVersion**: storage.k8s.io/v1

- **kind**: CSIDriver

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. metadata.Name вказує назву драйвера CSI, до якого відноситься цей обʼєкт; вона МАЄ бути такою ж, як імʼя, яке повертає виклик CSI GetPluginName() для цього драйвера. Назва драйвера повинна бути не більше 63 символів, починатися і закінчуватися алфавітно-цифровим символом ([a-z0-9A-Z]), з тире (-), крапками (.) та алфавітно-цифровими символами між ними. Докладніше: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriverSpec" >}}">CSIDriverSpec</a>), обовʼязково

  spec представляє специфікацію драйвера CSI.

## CSIDriverSpec {#CSIDriverSpec}

CSIDriverSpec — це специфікація CSIDriver.

---

- **attachRequired** (boolean)

  attachRequired вказує, що цей драйвер томів CSI вимагає операцію приєднання (оскільки він реалізує метод CSI ControllerPublishVolume()), і що контролер приєднання та відʼєднання Kubernetes повинен викликати інтерфейс приєднання томів, який перевіряє статус VolumeAttachment і чекає, поки том буде приєднано, перед тим як перейти до монтування. Зовнішній attacher CSI координується з драйвером томів CSI та оновлює статус VolumeAttachment після завершення операції приєднання. Якщо увімкнено і значення встановлено на false, операція приєднання буде пропущена. В іншому випадку операція приєднання буде викликана.

  Це поле незмінне.

- **fsGroupPolicy** (string)

  fsGroupPolicy визначає, чи підтримує базовий том зміну власності та дозволів на том перед монтуванням. Додаткову інформацію дивіться у конкретних значеннях FSGroupPolicy.

  Це поле було незмінним в Kubernetes \< 1.29, тепер воно є змінним.

  Стандартне значення ReadWriteOnceWithFSType, що дозволяє перевірити кожен том, щоб визначити, чи повинен Kubernetes змінювати власність і дозволи на том. Зі стандартною політикою визначена fsGroup буде застосована лише, якщо визначено fstype і режим доступу тому містить ReadWriteOnce.

- **nodeAllocatableUpdatePeriodSeconds** (int64)

  nodeAllocatableUpdatePeriodSeconds визначає інтервал між періодичними оновленнями розподіляємої місткості CSINode для цього драйвера. Коли встановлено, обидва оновлення, періодичне та оновлення, що активується збоями, повʼязаними з місткістю, увімкнені. Якщо не встановлено, оновлення не відбуваються (жодні), а лічильник allocatable.count залишається статичним. Мінімально дозволене значення цього поля — 10 секунд.

  Це бета-функція та вимагає увімкнення функціональної можливості MutableCSINodeAllocatableCount.

  Це поле є змінюваним.

- **podInfoOnMount** (boolean)

  podInfoOnMount вказує, що цей драйвер томів CSI вимагає додаткову інформацію про Pod (наприклад, podName, podUID тощо) під час операцій монтування, якщо встановлено true. Якщо встановлено false, інформація про Pod не буде передаватися під час монтування. Стандартне значення — false.

  Драйвер CSI визначає podInfoOnMount як частину розгортання драйвера. Якщо true, Kubelet передаватиме інформацію про Pod як VolumeContext у викликах CSI NodePublishVolume(). Драйвер CSI відповідає за розбір та перевірку інформації, переданої як VolumeContext.

  Наступний VolumeContext буде передано, якщо podInfoOnMount встановлено в true. Цей список може розширюватися, але буде використовуватися префікс. "csi.storage.k8s.io/pod.name": pod.Name "csi.storage.k8s.io/pod.namespace": pod.Namespace "csi.storage.k8s.io/pod.uid": string(pod.UID) "csi.storage.k8s.io/ephemeral": "true", якщо том є ефемерним інлайн-томом, визначеним CSIVolumeSource, в іншому випадку "false"

  "csi.storage.k8s.io/ephemeral" — це нова функція в Kubernetes 1.16. Вона потрібна лише для драйверів, які підтримують як "Persistent", так і "Ephemeral" VolumeLifecycleMode. Інші драйвери можуть залишити інформацію про Podʼи вимкненою та/або ігнорувати це поле. Оскільки Kubernetes 1.15 не підтримує це поле, драйвери можуть підтримувати лише один режим під час розгортання на такому кластері, і Deployment визначає, який режим це буде, наприклад, через параметр командного рядка драйвера.

  Це поле було незмінним в Kubernetes \< 1.29, тепер воно є змінним.

- **requiresRepublish** (boolean)

  requiresRepublish вказує, що драйвер CSI хоче, щоб `NodePublishVolume` періодично викликали, щоб відобразити будь-які можливі зміни у змонтованому томі. Стандартне значення цього поля — false.

  Примітка: після успішного початкового виклику NodePublishVolume наступні виклики NodePublishVolume повинні лише оновлювати вміст тому. Нові точки монтування не будуть видимі для запущеного контейнера.

- **seLinuxMount** (boolean)

  seLinuxMount визначає, чи підтримує драйвер CSI опцію монтування "-o context".

  Коли "true", драйвер CSI повинен забезпечити, щоб усі томи, надані цим драйвером CSI, могли монтуватися окремо з різними параметрами `-o context`. Це типово для сховищ, які надають томи як файлові системи на блокових пристроях або як незалежні загальні томи. Kubernetes викликатиме NodeStage / NodePublish з параметром монтування "-o context=xyz" при монтуванні тому ReadWriteOncePod, який використовується в Pod, що явно встановив контекст SELinux. У майбутньому це може бути розширено до інших режимів доступу до томів. У будь-якому випадку Kubernetes забезпечить, щоб том монтувався лише з одним контекстом SELinux.

  Коли "false", Kubernetes не передаватиме жодних спеціальних параметрів монтування SELinux драйверу. Це типово для томів, які представляють підтеки більшої спільної файлової системи.

  Стандартне значення — "false".

- **serviceAccountTokenInSecrets** (boolean)

  serviceAccountTokenInSecrets — це опція для драйверів CSI, яка вказує, що токени службового облікового запису слід передавати через поле Secrets у NodePublishVolumeRequest замість поля VolumeContext. Специфікація CSI передбачає спеціальне поле Secrets для конфіденційної інформації, такої як токени, що є відповідним механізмом для обробки облікових даних. Це вирішує проблеми безпеки, коли конфіденційні токени реєструвалися як частина контексту тому.

  Якщо значення "true", kubelet передаватиме токени тільки в полі Secrets із ключем "csi.storage.k8s.io/serviceAccount.tokens". Драйвер CSI потрібно оновити, щоб він читав токени з поля Secrets замість VolumeContext.

  Якщо значення "false" або не встановлено, kubelet передаватиме токени в VolumeContext із ключем "csi.storage.k8s.io/serviceAccount.tokens" (наявна поведінка). Це забезпечує зворотну сумісність із наявними драйверами CSI.

  Це поле можна встановити лише тоді, коли налаштовано TokenRequests. Сервер API відхилятиме специфікації CSIDriver, які встановлюють це поле без TokenRequests.

  Стандартно, якщо поле не встановлено, токени передаються в полі VolumeContext.

- **storageCapacity** (boolean)

  storageCapacity вказує, що драйвер томів CSI хоче, щоб планування Podʼів враховувало обсяг сховища, який буде повідомлено під час розгортання драйвера шляхом створення обʼєктів CSIStorageCapacity з інформацією про місткість, якщо встановлено true.

  Перевірку можна ввімкнути відразу під час розгортання драйвера. У цьому випадку створення нових томів з відкладеним привʼязуванням зупиниться, доки Deployment драйвера не опублікує деякий відповідний обʼєкт CSIStorageCapacity.

  Альтернативно, драйвер можна розгорнути з невстановленим або false полем, і його можна змінити пізніше, коли буде опубліковано інформацію про місткість сховища.

  Це поле було незмінним у Kubernetes \<= 1.22 і тепер воно є змінним.

- **tokenRequests** ([]TokenRequest)

  *Atomic: буде замінено під час злиття*

  tokenRequests вказує, що драйвер CSI потребує токенів службових облікових записів Podʼів, для яких він монтує том, для необхідної автентифікації. Kubelet передасть токени у VolumeContext у викликах CSI NodePublishVolume. Драйвер CSI повинен розбирати та перевіряти наступний VolumeContext:

  ```json
  "csi.storage.k8s.io/serviceAccount.tokens": {
    "<audience>": {
      "token": <token>,
      "expirationTimestamp": <expiration timestamp in RFC3339>,
    },
    ...
  }
  ```

  Примітка: Аудиторія в кожному запиті токена повинна бути різною, і не більше одного токена має бути пустим рядком. Для отримання нового токена після закінчення терміну дії можна використовувати RequiresRepublish для періодичного виклику NodePublishVolume.

  <a name="TokenRequest"></a>
  *TokenRequest містить параметри токена службового облікового запису.*

  - **tokenRequests.audience** (string), обовʼязково

    audience — це призначена аудиторія токена в "TokenRequestSpec". Стандартно це аудиторії kube apiserver.

  - **tokenRequests.expirationSeconds** (int64)

    expirationSeconds — це тривалість дії токена в "TokenRequestSpec". Має таке ж стандартне значення, як "ExpirationSeconds" у "TokenRequestSpec".

- **volumeLifecycleModes** ([]string)

  *Set: унікальні значення будуть збережені під час злиття*

  volumeLifecycleModes визначає, які типи томів підтримує цей драйвер томів CSI. Стандартно, якщо список порожній, це "Persistent", що визначено специфікацією CSI та реалізовано в Kubernetes через звичайний механізм PV/PVC.

  Інший режим — "Ephemeral". У цьому режимі томи визначаються інлайн у специфікації Podʼа за допомогою CSIVolumeSource, і їх життєвий цикл повʼязаний з життєвим циклом цього Podʼа. Драйвер повинен бути обізнаний про це, оскільки він отримає лише виклик NodePublishVolume для такого тому.

  Для отримання додаткової інформації про реалізацію цього режиму див. https://kubernetes-csi.github.io/docs/ephemeral-local-volumes.html. Драйвер може підтримувати один або кілька цих режимів, і в майбутньому можуть бути додані інші режими.

  Це поле знаходиться у стадії бета. Це поле незмінне.

## CSIDriverList {#CSIDriverList}

CSIDriverList — це колекція обʼєктів CSIDriver.

---

- **apiVersion**: storage.k8s.io/v1

- **kind**: CSIDriverList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Більше інформації: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>), обовʼязково

  items — це список CSIDriver.

## Операції {#operations}

---

### `get` отримати вказаний CSIDriver {#get-read-the-specified-csidriver}

#### HTTP запит {#http-request}

GET /apis/storage.k8s.io/v1/csidrivers/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  імʼя CSIDriver

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу CSIDriver {#list-list-or-watch-objects-of-kind-csidriver}

#### HTTP запит {#http-request-1}

GET /apis/storage.k8s.io/v1/csidrivers

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriverList" >}}">CSIDriverList</a>): OK

401: Unauthorized

### `create` створення CSIDriver {#create-create-a-csidriver}

#### HTTP запит {#http-request-2}

POST /apis/storage.k8s.io/v1/csidrivers

#### Параметри {#parameters-2}

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-2}

200 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): Accepted

401: Unauthorized

### `update` заміна вказаного CSIDriver {#update-replace-the-specified-csidriver}

#### HTTP запит {#http-request-3}

PUT /apis/storage.k8s.io/v1/csidrivers/{name}

#### Параметри {#parameters-3}

- **name** (*в шляху*): string, обовʼязково

  імʼя CSIDriver

- **body**: <a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-3}

200 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного CSIDriver {#patch-partially-update-the-specified-csidriver}

#### HTTP запит {#http-request-4}

PATCH /apis/storage.k8s.io/v1/csidrivers/{name}

#### Параметри {#parameters-4}

- **name** (*в шляху*): string, обовʼязково

  імʼя CSIDriver

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): Created

401: Unauthorized

### `delete` видалення CSIDriver {#delete-delete-a-csidriver}

#### HTTP запит {#http-request-5}

DELETE /apis/storage.k8s.io/v1/csidrivers/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  імʼя CSIDriver

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

200 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): OK

202 (<a href="{{< ref "../config-and-storage-resources/csi-driver-v1#CSIDriver" >}}">CSIDriver</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції CSIDriver {#deletecollection-delete-collection-of-csidriver}

#### HTTP запит {#http-request-6}

DELETE /apis/storage.k8s.io/v1/csidrivers

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
