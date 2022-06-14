---
api_metadata:
  apiVersion: "batch/v1"
  import: "k8s.io/api/batch/v1"
  kind: "CronJob"
content_type: "api_reference"
description: "CronJob 代表单个 cron 作业的配置。"
title: "CronJob"
weight: 10
auto_generated: true
---

<!--
---
api_metadata:
apiVersion: "batch/v1"
import: "k8s.io/api/batch/v1"
kind: "CronJob"
content_type: "api_reference"
description: "CronJob represents the configuration of a single cron job."
title: "CronJob"
weight: 10
auto_generated: true
---
-->

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

`apiVersion: batch/v1`

`import "k8s.io/api/batch/v1"`


## CronJob {#CronJob}

<!--
CronJob represents the configuration of a single cron job.
-->

CronJob 代表单个 cron 作业的配置。

<hr>

- **apiVersion**: batch/v1


- **kind**: CronJob


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

<!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->

  标准对象的元数据。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobSpec" >}}">CronJobSpec</a>)

<!--
  Specification of the desired behavior of a cron job, including the schedule. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->

  cron 作业所需的行为规范，包括计划。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status** (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobStatus" >}}">CronJobStatus</a>)

<!--
  Current status of a cron job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->
  cron 作业的当前状态。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## CronJobSpec {#CronJobSpec}

<!--
CronJobSpec describes how the job execution will look like and when it will actually run.
-->

CronJobSpec 描述了作业的执行方式和实际运行的时间。

<hr>

<!--
- **jobTemplate** (JobTemplateSpec), required

  Specifies the job that will be created when executing a CronJob.
-->

- **jobTemplate** (JobTemplateSpec), required

  指定执行 CronJob 时将创建的作业。

<!--
  <a name="JobTemplateSpec"></a>
  *JobTemplateSpec describes the data a Job should have when created from a template*

  - **jobTemplate.metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

    Standard object's metadata of the jobs created from this template. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

  - **jobTemplate.spec** (<a href="{{< ref "../workload-resources/job-v1#JobSpec" >}}">JobSpec</a>)

    Specification of the desired behavior of the job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **schedule** (string), required

  The schedule in Cron format, see https://en.wikipedia.org/wiki/Cron.

- **timeZone** (string)

  The time zone for the given schedule, see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones. If not specified, this will rely on the time zone of the kube-controller-manager process. ALPHA: This field is in alpha and must be enabled via the `CronJobTimeZone` feature gate.

- **concurrencyPolicy** (string)

  Specifies how to treat concurrent executions of a Job. Valid values are: - "Allow" (default): allows CronJobs to run concurrently; - "Forbid": forbids concurrent runs, skipping next run if previous run hasn't finished yet; - "Replace": cancels currently running job and replaces it with a new one
-->

  <a name="JobTemplateSpec"></a>
  *JobTemplateSpec 描述了从模板创建作业时应具有的数据*

  - **jobTemplate.metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

    从此模板创建的作业的标准对象元数据。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

  - **jobTemplate.spec** (<a href="{{< ref "../workload-resources/job-v1#JobSpec" >}}">JobSpec</a>)

    作业所需行为的规范。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **schedule** (string), required

  Cron 格式的时间表，请参阅 https://en.wikipedia.org/wiki/Cron.

- **timeZone** (string)

  给定时间表的时区，请参阅 https://en.wikipedia.org/wiki/List_of_tz_database_time_zones. If not specified, this will rely on the time zone of the kube-controller-manager process. ALPHA: This field is in alpha and must be enabled via the `CronJobTimeZone` feature gate.

- **concurrencyPolicy** (string)

  指定如何处理作业的并发执行。 有效值为： - "Allow" (default): allows CronJobs to run concurrently; - "Forbid": forbids concurrent runs, skipping next run if previous run hasn't finished yet; - "Replace": cancels currently running job and replaces it with a new one

<!--
  - **startingDeadlineSeconds** (int64)

  Optional deadline in seconds for starting the job if it misses scheduled time for any reason.  Missed jobs executions will be counted as failed ones.

- **suspend** (boolean)

  This flag tells the controller to suspend subsequent executions, it does not apply to already started executions.  Defaults to false.

- **successfulJobsHistoryLimit** (int32)

  The number of successful finished jobs to retain. Value must be non-negative integer. Defaults to 3.

- **failedJobsHistoryLimit** (int32)

  The number of failed finished jobs to retain. Value must be non-negative integer. Defaults to 1.
-->

- **startingDeadlineSeconds** (int64)

  如果由于任何原因错过预定时间，则启动作业的可选截止时间（秒）。未执行的作业将被视为失败的作业。

- **suspend** (boolean)

  这个标志告诉控制器暂停后续的执行，它不适用于已经开始的执行。默认为 false 。

- **successfulJobsHistoryLimit** (int32)

  要保留的成功完成作业数。值必须是非负整数。默认值为 3 。

- **failedJobsHistoryLimit** (int32)

  要保留的失败完成作业数。值必须是非负整数。默认值为 1 。





## CronJobStatus {#CronJobStatus}

<!--
CronJobStatus represents the current state of a cron job.

<hr>

- **active** ([]<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

  *Atomic: will be replaced during a merge*

  A list of pointers to currently running jobs.

- **lastScheduleTime** (Time)

  Information when was the last time the job was successfully scheduled.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

- **lastSuccessfulTime** (Time)

  Information when was the last time the job successfully completed.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
-->

CronJobStatus 表示一个 cron job 的当前状态。

<hr>

- **active** ([]<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

  *Atomic: 将在合并过程中被替换*

  指向当前正在运行的作业的指针列表。

- **lastScheduleTime** (Time)

  上次成功安排作业的时间信息。

  <a name="Time"></a>
  *Time 是对 time.Time 的封装，它支持对 YAML 和 JSON 的正确编排。为 time 包提供的许多工厂方法模式提供了包装器。*

- **lastSuccessfulTime** (Time)

  上次成功完成作业的时间信息。

  <a name="Time"></a>
  *Time 是对 time.Time 的封装，它支持对 YAML 和 JSON 的正确编排。为 time 包提供的许多工厂方法模式提供了包装器。*





## CronJobList {#CronJobList}

<!--
CronJobList is a collection of cron jobs.

<hr>

- **apiVersion**: batch/v1


- **kind**: CronJobList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>), required

  items is the list of CronJobs.
-->

CronJobList 是 cron 作业的集合。

<hr>

- **apiVersion**: batch/v1


- **kind**: CronJobList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准列表元数据。更多信息： https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>), required

  items 是 CronJobs 的列表。


<!--
## Operations {#Operations}
-->
## 操作 {#操作}



<hr>





<!--
### `get` read the specified CronJob

#### HTTP Request

GET /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### Parameters
-->

### `get` 查看指定的 CronJob

#### HTTP 请求

GET /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### 参数

<!--
- **name** (*in path*): string, required

  name of the CronJob


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **name** (*in path*): string, required

  CronJob 的名称


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!--
#### Response
-->

#### 响应

<!--
200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

401: Unauthorized
-->

200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

401: 未经授权

<!--
### `get` read status of the specified CronJob

#### HTTP Request

GET /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status

#### Parameters

-->

### `get` 查看指定 CronJob 的状态

#### HTTP 请求

GET /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status

#### 参数

<!--
- **name** (*in path*): string, required

  name of the CronJob


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **name** (*in path*): string, required

  CronJob 的名称


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

401: Unauthorized
-->


#### 响应


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

401: 未经授权

<!--
### `list` list or watch objects of kind CronJob

#### HTTP Request

GET /apis/batch/v1/namespaces/{namespace}/cronjobs

#### Parameters
-->

### `list` 查看并列出指定 namespaces 的 CronJob 类型的对象

#### HTTP 请求

GET /apis/batch/v1/namespaces/{namespace}/cronjobs

#### 参数


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobList" >}}">CronJobList</a>): OK

401: Unauthorized
-->


#### 响应


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobList" >}}">CronJobList</a>): OK

401: 未授权

<!--
### `list` list or watch objects of kind CronJob

#### HTTP Request

GET /apis/batch/v1/cronjobs

#### Parameters
-->


### `list` 查看并列出 CronJob 类型的对象

#### HTTP 请求

GET /apis/batch/v1/cronjobs

#### 参数


- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobList" >}}">CronJobList</a>): OK

401: Unauthorized


### `create` create a CronJob

#### HTTP Request

POST /apis/batch/v1/namespaces/{namespace}/cronjobs

#### Parameters
-->


#### 响应


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobList" >}}">CronJobList</a>): OK

401: 未授权


### `create` 创建一个 CronJob

#### HTTP 请求

POST /apis/batch/v1/namespaces/{namespace}/cronjobs

#### 参数


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

202 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Accepted

401: Unauthorized


### `update` replace the specified CronJob

#### HTTP Request

PUT /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the CronJob
-->



#### 响应


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): 创建完成

202 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): 已接受

401: 未授权


### `update` 替换指定的 CronJob

#### HTTP 请求

PUT /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### 参数


- **name** (*in path*): string, required

  CronJob 的名称


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

401: Unauthorized


### `update` replace status of the specified CronJob

#### HTTP Request

PUT /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the CronJob
-->


#### 响应


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): 创建完成

401: 未授权


### `update` 替换指定 CronJob 的状态

#### HTTP 请求

PUT /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status

#### 参数


- **name** (*in path*): string, required

  CronJob 的名称


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

401: Unauthorized


### `patch` partially update the specified CronJob

#### HTTP Request

PATCH /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the CronJob
- 
-->


#### 响应


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): 创建完成

401: 未授权


### `patch` 部分更新指定的 CronJob

#### HTTP 请求

PATCH /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### 参数


- **name** (*in path*): string, required

  CronJob 的名称


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

401: Unauthorized


### `patch` partially update status of the specified CronJob

#### HTTP Request

PATCH /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status

#### Parameters

- **name** (*in path*): string, required

  name of the CronJob
-->


#### 响应


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): 创建完成

401: 未授权


### `patch` 部分更新指定 CronJob 的状态

#### HTTP 请求

PATCH /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status

#### 参数


- **name** (*in path*): string, required

  CronJob 的名称


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<--!
#### Response


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

401: Unauthorized


### `delete` delete a CronJob

#### HTTP Request

DELETE /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the CronJob
-->



#### 响应


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): 创建完成

401: 未授权


### `delete` 删除一个 CronJob

#### HTTP 请求

DELETE /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### 参数


- **name** (*in path*): string, required

  CronJob 的名称


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of CronJob

#### HTTP Request

DELETE /apis/batch/v1/namespaces/{namespace}/cronjobs

#### Parameters
-->



#### 响应


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): 创建完成

401: 未授权


### `deletecollection` 删除一组 CronJob

#### HTTP 请求

DELETE /apis/batch/v1/namespaces/{namespace}/cronjobs

#### 参数


- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

  


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>


- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<--
#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
-->



#### 响应


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: 未授权

