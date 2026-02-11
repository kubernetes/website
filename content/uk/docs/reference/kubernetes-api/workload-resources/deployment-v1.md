---
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "Deployment"
content_type: "api_reference"
description: "Deployment робить можливими декларативні оновлення для Podʼів та and ReplicaSet."
title: "Deployment"
weight: 6
auto_generated: false
---

`apiVersion: apps/v1`

`import "k8s.io/api/apps/v1"`

## Deployment {#Deployment}

Deployment робить можливими декларативні оновлення для Podʼів та ReplicaSet.

---

- **apiVersion**: apps/v1

- **kind**: Deployment

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Стандартні метадані обʼєкта. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/deployment-v1#DeploymentSpec" >}}">DeploymentSpec</a>)

  Специфікація бажаної поведінки Deployment.

- **status** (<a href="{{< ref "../workload-resources/deployment-v1#DeploymentStatus" >}}">DeploymentStatus</a>)

  Найбільш останній спостережуваний статус Deployment.

## DeploymentSpec {#DeploymentSpec}

DeploymentSpec є специфікацією бажаної поведінки Deployment.

---

- **selector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>), обовʼязково

  Селектор міток для Podʼів. Наявні ReplicaSets, чиї Podʼи вибрані за допомогою цього селектора, будуть ті, які будуть змінені цим Deployment. Він повинен відповідати міткам шаблону Podʼа.

- **template** (<a href="{{< ref "../workload-resources/pod-template-v1#PodTemplateSpec" >}}">PodTemplateSpec</a>), обовʼязково

  Шаблон описує Podʼи, які будуть створені. Єдине допустиме значення для template.spec.restartPolicy — "Always".

- **replicas** (int32)

  Кількість бажаних Podʼів. Це вказівник для розрізнення між явним нулем і не вказаним значенням. Стандартне значення — 1.

- **minReadySeconds** (int32)

  Мінімальна кількість секунд, протягом яких новий створений Pod повинен бути готовим без збоїв жодного з його контейнерів, щоб його вважати доступним. Стандартне значення — 0 (Pod буде вважатися доступним, як тільки він буде готовий)

- **strategy** (DeploymentStrategy)

  *Patch strategy: retainKeys*

  Стратегія розгортання, яку слід використовувати для заміни наявних Podʼів на нові.

  <a name="DeploymentStrategy"></a>
  *DeploymentStrategy описує, як замінити наявні Podʼи новими.*

  - **strategy.type** (string)

    Тип розгортання. Може бути "Recreate" або "RollingUpdate". Стандартне значення — RollingUpdate.

    Можливі значення переліку (enum):
    - `"Recreate"` Видаляє всі наявні Podʼи перед створенням нових Podʼів.
    - `"RollingUpdate"` Замінює старі ReplicaSets новими за допомогою послідовного оновлення, тобто поступово зменшуючи старі ReplicaSets і збільшуючи нові.

  - **strategy.rollingUpdate** (RollingUpdateDeployment)

    Параметри конфігурації постійного оновлення. Присутні лише, якщо DeploymentStrategyType = RollingUpdate.

    <a name="RollingUpdateDeployment"></a>
    *Spec для управління бажаною поведінкою постійного оновлення.*

    - **strategy.rollingUpdate.maxSurge** (IntOrString)

      Максимальна кількість Podʼів, які можуть бути заплановані понад бажану кількість Podʼів. Значення може бути абсолютним числом (наприклад, 5) або відсотком від кількості бажаних Podʼів (наприклад, 10%). Це не може бути 0, якщо MaxUnavailable дорівнює 0. Абсолютне число обчислюється з відсотком, округленим вверх. Стандартне значення — 25%. Наприклад: якщо встановлено 30%, новий ReplicaSet може бути масштабований вгору відразу після початку постійного оновлення, так що загальна кількість старих і нових Podʼів не перевищує 130% від бажаних Podʼів. Після примусового завершення роботи старих Podʼів, новий ReplicaSet можна додатково масштабувати, гарантуючи, що загальна кількість Podʼів, запущених в будь-який момент під час оновлення, становить не більше 130% від бажаної кількості Podʼів

      <a name="IntOrString"></a>
      *IntOrString — це тип, який може містити int32 або рядок. При використанні перетворення з/в JSON або YAML він виробляє або споживає внутрішній тип. Це дозволяє вам мати, наприклад, поле JSON, яке може приймати імʼя або число.*

    - **strategy.rollingUpdate.maxUnavailable** (IntOrString)

      Максимальна кількість Podʼів, які можуть бути недоступні під час оновлення. Значення може бути абсолютним числом (наприклад, 5) або відсотком від бажаних Podʼів (наприклад, 10%). Абсолютне число обчислюється з відсотком шляхом округлення у меншу сторону. Це не може бути 0, якщо MaxSurge дорівнює 0. Стандартне значення — 25%. Наприклад: коли це встановлено на 30%, старий ReplicaSet може бути масштабований вниз до 70% від бажаних Podʼів відразу після початку постійного оновлення. Як тільки нові Podʼи готові, старий ReplicaSet може бути додатково масштабований вниз, разом з масштабованням вгору нового ReplicaSet, забезпечуючи, що загальна кількість Podʼів, доступних у будь-який час під час оновлення, становить принаймні 70% від кількості бажаних Podʼів.

      <a name="IntOrString"></a>
      *IntOrString — це тип, який може містити int32 або рядок. При використанні перетворення з/в JSON або YAML він виробляє або споживає внутрішній тип. Це дозволяє вам мати, наприклад, поле JSON, яке може приймати імʼя або число.*

- **revisionHistoryLimit** (int32)

  Кількість старих ReplicaSets, які слід зберігати для можливості відкату. Це вказівник для розрізнення між явним нулем і не вказаним значенням. Стандартне значення — 10.

- **progressDeadlineSeconds** (int32)

  Максимальний час у секундах для Deployment для досягнення прогресу, перш ніж вважати його невдалим. Контролер розгортання буде продовжувати обробляти невдалі Deployment, і у статусі Deployment буде сповіщено причину ProgressDeadlineExceeded. Зверніть увагу, що прогрес не буде оцінюватися під час паузи Deployment. Стандартне значення — 600 с.

- **paused** (boolean)

  Показує, що Deployment призупинено.

## DeploymentStatus {#DeploymentStatus}

DeploymentStatus — це найостанніший спостережуваний статус Deployment.

---

- **replicas** (int32)

  Загальна кількість Podʼів, що не завершили роботу, які є ціллю цього Deployment (їх мітки відповідають селектору).

- **availableReplicas** (int32)

  Загальна кількість доступних, що не завершили роботу, Podʼів (готових принаймні minReadySeconds), які є ціллю цього Deployment.

- **readyReplicas** (int32)

  Загальна еількість Podʼів, що не завершили роботу, які є ціллю цього Deployment в стані Ready.

- **unavailableReplicas** (int32)

  Загальна кількість недоступних Podʼів, які є ціллю цього Deployment. Це загальна кількість Podʼів, які все ще необхідні для того, щоб Deployment мав 100% доступну потужність. Вони можуть бути Podʼами, які працюють, але ще не доступні, або Podʼами, які ще не були створені.

- **updatedReplicas** (int32)

  Загальна кількість podʼів, що не завершили роботу, які є ціллю цього Deployment та мають бажаний шаблон специфікацій.

- **terminatingReplicas** (int32)

  Загальна кількість podʼів, що завершають роботу, кі є ціллю цього Deployment. Podʼи, що завершують роботу, мають ненульову позначку часу .metadata.deletionTimestamp і ще не досягли фази .status.phase Failed або Succeeded.

  Це бета-поле, яке вимагає увімкнення функції DeploymentReplicaSetTerminatingReplicas (стандартно увімкнена).

- **collisionCount** (int32)

  Кількість колізій хешів для Deployment. Контролер Deployment використовує це поле як механізм уникнення колізій, коли йому потрібно створити імʼя для нового ReplicaSet.

- **conditions** ([]DeploymentCondition)

  *Patch strategy: обʼєднання за ключем `type`*

  *Map: унікальні значення ключа type будуть збережені під час злиття*

  Представляє останні доступні спостереження про поточний стан Deployment.

  <a name="DeploymentCondition"></a>
  *DeploymentCondition описує стан Deployment в певний момент.*

  - **conditions.status** (string), обовʼязково

    Статус стану, одне з True, False, Unknown.

  - **conditions.type** (string), обовʼязково

    Тип стану Deployment.

  - **conditions.lastTransitionTime** (Time)

    Останній час, коли стан переходив з одного статусу в інший.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.lastUpdateTime** (Time)

    Останній раз, коли цей стан було оновлено.

    <a name="Time"></a>
    *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

  - **conditions.message** (string)

    Повідомлення, зрозуміле людині, із зазначенням деталей про перехід.

  - **conditions.reason** (string)

    Причина останнього зміни стану.

- **observedGeneration** (int64)

  Генерація, що спостерігається контролером Deployment.

## DeploymentList {#DeploymentList}

DeploymentList - це список обʼєктів Deployment.

---

- **apiVersion**: apps/v1

- **kind**: DeploymentList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку.

- **items** ([]<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>), обовʼязково

  Items — це список обʼєктів Deployment.

## Операції {#operations}

---

### `get` отримати вказаний Deployment {#get-read-the-specified-deployment}

#### HTTP Запит {#http-request}

GET /apis/apps/v1/namespaces/{namespace}/deployments/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  назва Deployment

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): ОК

401: Unauthorized

### `get` отримати статус вказаного Deployment {#get-read-the-status-of-the-specified-deployment}

#### HTTP Запит {#http-request-1}

GET /apis/apps/v1/namespaces/{namespace}/deployments/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  назва Deployment

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): ОК

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Deployment {#list-list-or-watch-objects-of-kind-deployment}

#### HTTP Запит {#http-request-2}

GET /apis/apps/v1/namespaces/{namespace}/deployments

#### Параметри {#parameters-2}

- **namespace** (*у шляху*): string, обовʼязково

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

#### Відповідь {#response-2}

200 (<a href="{{< ref "../workload-resources/deployment-v1#DeploymentList" >}}">DeploymentList</a>): ОК

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу Deployment {#list-list-or-watch-objects-of-kind-deployment-1}

#### HTTP Запит {#http-request-3}

GET /apis/apps/v1/deployments

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

#### Відповідь {#response-3}

200 (<a href="{{< ref "../workload-resources/deployment-v1#DeploymentList" >}}">DeploymentList</a>): ОК

401: Unauthorized

### `create` створення Deployment {#create-create-a-deployment}

#### HTTP Запит {#http-request-4}

POST /apis/apps/v1/namespaces/{namespace}/deployments

#### Параметри {#parameters-4}

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): ОК

201 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): Created

202 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): Accepted

401: Unauthorized

### `update` заміна вказаного Deployment {#update-replace-the-specified-deployment}

#### HTTP Запит {#http-request-5}

PUT /apis/apps/v1/namespaces/{namespace}/deployments/{name}

#### Параметри {#parameters-5}

- **name** (*у шляху*): string, обовʼязково

  імʼя Deployment

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): ОК

201 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного Deployment {#update-replace-status-of-the-specified-deployment}

#### HTTP Запит {#http-request-6}

PUT /apis/apps/v1/namespaces/{namespace}/deployments/{name}/status

#### Параметри {#parameters-6}

- **name** (*у шляху*): string, обовʼязково

  імʼя Deployment

- **namespace** (*у шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): ОК

201 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного Deployment {#patch-partially-update-the-specified-deployment}

#### HTTP Запит {#http-request-7}

PATCH /apis/apps/v1/namespaces/{namespace}/deployments/{name}

#### Параметри {#parameters-7}

- **name** (*у шляху*): string, обовʼязково

  імʼя Deployment

- **namespace** (*у шляху*): string, обовʼязково

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

#### Відповідь {#response-7}

200 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): ОК

201 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного Deployment {#patch-partially-update-status-of-the-specified-deployment}

#### HTTP Запит {#http-request-8}

PATCH /apis/apps/v1/namespaces/{namespace}/deployments/{name}/status

#### Параметри {#parameters-8}

- **name** (*у шляху*): string, обовʼязково

  імʼя Deployment

- **namespace** (*у шляху*): string, обовʼязково

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

#### Відповідь {#response-8}

200 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): ОК

201 (<a href="{{< ref "../workload-resources/deployment-v1#Deployment" >}}">Deployment</a>): Created

401: Unauthorized

### `delete` видалення Deployment {#delete-delete-a-deployment}

#### HTTP Запит {#http-request-9}

DELETE /apis/apps/v1/namespaces/{namespace}/deployments/{name}

#### Параметри {#parameters-9}

- **name** (*у шляху*): string, обовʼязково

  імʼя Deployment

- **namespace** (*у шляху*): string, обовʼязково

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

#### Відповідь {#response-9}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): ОК

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції Deployment {#deletecollection-delete-collection-of-deployments}

#### HTTP Запит {#http-request-10}

DELETE /apis/apps/v1/namespaces/{namespace}/deployments

#### Параметри {#parameters-10}

- **namespace** (*у шляху*): string, обовʼязково

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

#### Відповідь {#response-10}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): ОК

401: Unauthorized
