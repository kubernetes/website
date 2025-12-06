---
api_metadata:
  apiVersion: "batch/v1"
  import: "k8s.io/api/batch/v1"
  kind: "CronJob"
content_type: "api_reference"
description: "CronJob являє собою конфігурацію одного завдання cron."
title: "CronJob"
weight: 11
auto_generated: false
---

`apiVersion: batch/v1`

`import "k8s.io/api/batch/v1"`

## CronJob {#CronJob}

CronJob являє собою конфігурацію одного завдання cron.

---

- **apiVersion**: batch/v1

- **kind**: CronJob

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>):

  Стандартні метадані обʼєкта. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobSpec" >}}">CronJobSpec</a>):

  Специфікація бажаної поведінки cron job, включаючи розклад. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobStatus" >}}">CronJobStatus</a>):

  Поточний статус cron job. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## CronJobSpec {#CronJobSpec}

CronJobSpec описує, як виглядатиме виконання завдання та коли воно буде запущено.

---

- **jobTemplate** (JobTemplateSpec), обовʼязково

  Вказує на шаблон задачі, яка буде створена під час виконання CronJob.

  <a name="JobTemplateSpec"></a>
  *JobTemplateSpec описує дані, які повинні бути у задачі при створенні з шаблону*

  - **jobTemplate.metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

    Стандартні метадані обʼєкта створених задач з цього шаблону. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

  - **jobTemplate.spec** (<a href="{{< ref "../workload-resources/job-v1#JobSpec" >}}">JobSpec</a>)

    Специфікація бажаної поведінки задачі. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **schedule** (string), обовʼязково

  Розклад у форматі Cron, див. https://uk.wikipedia.org/wiki/Cron.

- **timeZone** (string)

  Назва часового поясу для вказаного розкладу, див. https://en.wikipedia.org/wiki/List_of_tz_database_time_zones. Якщо не вказано, то буде використовуватись часовий пояс процесу kube-controller-manager. Допустимі назви часових поясів і зміщення завантажуються з системної бази даних часових поясів API-сервером під час валідації CronJob і контролером під час виконання. Якщо системна база даних часових поясів недоступна, використовується вбудована версія цієї бази. Якщо назва часового поясу стає недійсною протягом життєвого циклу CronJob або через зміну конфігурації хосту, контролер перестане створювати нові задачі та створить системну подію з причиною UnknownTimeZone. Додаткову інформацію можна знайти в [https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/#time-zones](/docs/concepts/workloads/controllers/cron-jobs/#time-zones).

- **concurrencyPolicy** (string)

  Визначає, як обробляти одночасні виконання задачі. Допустимі значення:

  - "Allow" (стандартно): дозволяє CronJobs запускати задачі одночасно;
  - "Forbid": забороняє одночасні виконання, пропускаючи наступний запуск, якщо попередній ще не завершився;
  - "Replace": скасовує поточну задачу і замінює її новою.

  Можливі значення переліку (enum):

  - `"Allow"` дозволяє одночасні виконання CronJobs.
  - `"Forbid"` забороняє одночасне виконання, пропускаючи наступне виконання, якщо попереднє ще не завершилося.
  - `"Replace"` скасовує поточне завдання і замінює його новим.

- **startingDeadlineSeconds** (int64)

  Необовʼязковий термін у секундах для запуску задачі, якщо вона пропустить запланований час з будь-якої причини. Пропущені виконання задач будуть вважатися неуспішними.

- **suspend** (boolean)

  Цей прапорець каже контролеру призупиняти подальші виконання, він не застосовується до вже запущених виконань. Стандартне значення — false.

- **successfulJobsHistoryLimit** (int32)

  Кількість успішно завершених задач, які потрібно зберегти. Значення повинно бути не відʼємним цілим числом. Стандартне значення — 3.

- **failedJobsHistoryLimit** (int32)

  Кількість невдало завершених задач, які потрібно зберегти. Значення повинно бути не відʼємним цілим числом. Стандартне значення — 1.

## CronJobStatus {#CronJobStatus}

CronJobStatus представляє поточний стан cron job.

---

- **active** ([]<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

  *Atomic: буде замінено під час злиття*

  Список посилань на запущені зараз задачі.

- **lastScheduleTime** (Time)

  Інформація про час останнього успішного запуску задачі.

  <a name="Time"></a>
  *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*

- **lastSuccessfulTime** (Time)

  Інформація про час останнього успішного завершення задачі.

  <a name="Time"></a>
  *Time — це обгортка навколо time.Time, яка підтримує коректне перетворення у YAML та JSON. Для багатьох з функцій, які пропонує пакет time, надаються обгортки.*


## CronJobList {#CronJobList}

CronJobList — це колекція cron job.

---

- **apiVersion**: batch/v1

- **kind**: CronJobList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Стандартні метадані списку. Додаткова інформація: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>), обовʼязково

  Список CronJobs.

## Операції {#operations}

---

### `get` отримати вказаний CronJob {#get-read-the-specified-cronjob}

#### HTTP-запит {#http-request}

GET /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### Параметри {#parameters}

- **name** (*в шляху*): string, обовʼязково

  назва CronJob

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response}

200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

401: Unauthorized

### `get` отримати статус вказаного CronJob {#get-read-the-status-of-the-specified-cronjob}

#### HTTP-запит {#http-request-1}

GET /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status

#### Параметри {#parameters-1}

- **name** (*в шляху*): string, обовʼязково

  назва CronJob

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-1}

200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу CronJob {#list-list-or-watch-objects-of-kind-cronjob}

#### HTTP-запит {#http-request-2}

GET /apis/batch/v1/namespaces/{namespace}/cronjobs

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

#### Відповідь {#response-2}

200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobList" >}}">CronJobList</a>): OK

401: Unauthorized

### `list` перелік або перегляд обʼєктів типу CronJob {#list-list-or-watch-objects-of-kind-cronjob-1}

#### HTTP-запит {#http-request-3}

GET /apis/batch/v1/cronjobs

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

200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobList" >}}">CronJobList</a>): OK

401: Unauthorized

### `create` створення CronJob {#create-create-a-cronjob}

#### HTTP-запит {#http-request-4}

POST /apis/batch/v1/namespaces/{namespace}/cronjobs

#### Параметри {#parameters-4}

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-4}

200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

202 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Accepted

401: Unauthorized

### `update` заміна вказаного CronJob {#update-replace-the-specified-cronjob}

#### HTTP-запит {#http-request-5}

PUT /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### Параметри {#parameters-5}

- **name** (*в шляху*): string, обовʼязково

  назва CronJob

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-5}

200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

401: Unauthorized

### `update` заміна статусу вказаного CronJob {#update-replace-the-status-of-the-specified-cronjob}

#### HTTP-запит {#http-request-6}

PUT /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status

#### Параметри {#parameters-6}

- **name** (*в шляху*): string, обовʼязково

  назва CronJob

- **namespace** (*в шляху*): string, обовʼязково

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>, обовʼязково

- **dryRun** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*в запиті*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

#### Відповідь {#response-6}

200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

401: Unauthorized

### `patch` часткове оновлення вказаного CronJob {#patch-partially-update-the-specified-cronjob}

#### HTTP-запит {#http-request-7}

PATCH /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### Параметри {#parameters-7}

- **name** (*в шляху*): string, обовʼязково

  назва CronJob

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

#### Відповідь {#response-7}

200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

401: Unauthorized

### `patch` часткове оновлення статусу вказаного CronJob {#patch-partially-update-the-status-of-the-specified-cronjob}

#### HTTP-запит {#http-request-8}

PATCH /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status

#### Параметри {#parameters-8}

- **name** (*в шляху*): string, обовʼязково

  назва CronJob

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

#### Відповідь {#response-8}

200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

401: Unauthorized

### `delete` видалення CronJob {#delete-delete-a-cronjob}

#### HTTP-запит {#http-request-9}

DELETE /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### Параметри {#parameters-9}

- **name** (*в шляху*): string, обовʼязково

  назва CronJob

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

#### Відповідь {#response-9}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

### `deletecollection` видалення колекції CronJob {#deletecollection-delete-collection-of-cronjob}

#### HTTP-запит {#http-request-10}

DELETE /apis/batch/v1/namespaces/{namespace}/cronjobs

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

#### Відповідь {#response-10}

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
