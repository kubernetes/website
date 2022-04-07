---
api_metadata:
  apiVersion: "batch/v1"
  import: "k8s.io/api/batch/v1"
  kind: "CronJob"
content_type: "api_reference"
description: "CronJob 代表单个定时作业的配置。"
title: "CronJob"
weight: 10
auto_generated: false
---

<!--
api_metadata:
  apiVersion: "batch/v1"
  import: "k8s.io/api/batch/v1"
  kind: "CronJob"
content_type: "api_reference"
description: "CronJob represents the configuration of a single cron job."
title: "CronJob"
weight: 10
auto_generated: true
-->


`apiVersion: batch/v1`

`import "k8s.io/api/batch/v1"`


## CronJob {#CronJob}

CronJob 代表单个定时作业的配置。

<!--
## CronJob {#CronJob}

CronJob represents the configuration of a single cron job.
-->


<hr>

- **apiVersion**: batch/v1

<!--
<hr>

- **apiVersion**: batch/v1
-->

- **kind**: CronJob

<!-- - **kind**: CronJob-->

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准对象的元数据。
  更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  
<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->  

- **spec** (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobSpec" >}}">CronJobSpec</a>)

  指定 cron 作业所期望的行为，包含明细表。
  更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
- **spec** (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobSpec" >}}">CronJobSpec</a>)

  Specification of the desired behavior of a cron job, including the schedule. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->

- **status** (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobStatus" >}}">CronJobStatus</a>)
  cron 作业的当前状态。
  更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

<!--
- **status** (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobStatus" >}}">CronJobStatus</a>)

  Current status of a cron job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
-->




## CronJobSpec {#CronJobSpec}

CronJobSpec 描述了作业执行的样子以及实际运行的时间。

<hr>

<!--
## CronJobSpec {#CronJobSpec}

CronJobSpec describes how the job execution will look like and when it will actually run.

<hr>
-->

- **jobTemplate** (JobTemplateSpec)，必填

  指定执行 CronJob 时将创建的作业。
  
  <a name="JobTemplateSpec"></a>
  *JobTemplateSpec 描述了从模板创建作业时应具有的数据。*
  
<!--
- **jobTemplate** (JobTemplateSpec), required

  Specifies the job that will be created when executing a CronJob.
  
   <a name="JobTemplateSpec"></a>
   *JobTemplateSpec describes the data a Job should have when created from a template*
-->

  - **jobTemplate.metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

    从此模板创建的作业的标准对象元数据。
    更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
    
  <!--
  - **jobTemplate.metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  
      Standard object's metadata of the jobs created from this template. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->

  - **jobTemplate.spec** (<a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/workload-resources/job-v1#JobSpec" >}}">JobSpec</a>)

    作业所需行为的规范。
    更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
    
  <!--
   - **jobTemplate.spec** (<a href="{{< ref "../en/docs/reference/kubernetes-api/workload-resources/job-v1#JobSpec" >}}">JobSpec</a>)
   
       Specification of the desired behavior of the job. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->

- **schedule** (string)，必填

  Cron 格式的时间表，请参阅：https://en.wikipedia.org/wiki/Cron.
  
<!--
- **schedule** (string), required

  The schedule in Cron format, see https://en.wikipedia.org/wiki/Cron.
-->  

- **concurrencyPolicy** (string)

  指定如何处理作业的并发执行。
  有效值为： - "Allow"（默认）：允许 CronJobs 并发运行；- "Forbid"：禁止并发运行，如果上一次运行尚未完成则跳过下一次运行；- "Replace"：取消当前正在运行的作业并用新作业替换它。 
  <!--
    - **concurrencyPolicy** (string)

     Specifies how to treat concurrent executions of a Job. Valid values are: - "Allow" (default): allows CronJobs to run concurrently; - "Forbid": forbids concurrent runs, skipping next run if previous run hasn't finished yet; - "Replace": cancels currently running job and replaces it with a new one
   -->
   
  可能的枚举值:
   - `"Allow"` 允许 CronJobs 并发运行。
   - `"Forbid"` 禁止并发运行，如果上一次运行尚未完成则跳过下一次运行。
   - `"Replace"` 取消当前正在运行的作业并用新作业替换它。
   
   <!--
   Possible enum values:
    - `"Allow"` allows CronJobs to run concurrently.
    - `"Forbid"` forbids concurrent runs, skipping next run if previous hasn't finished yet.
    - `"Replace"` cancels currently running job and replaces it with a new one.
   -->

- **startingDeadlineSeconds** (int64)

  当错过预定时间时，开始作业的可选截止时间（以秒为单位）。
  错过的作业执行将被计为失败的作业。

<!--
- **startingDeadlineSeconds** (int64)

  Optional deadline in seconds for starting the job if it misses scheduled time for any reason.  Missed jobs executions will be counted as failed ones.
-->

- **suspend** (boolean)

  此标志告诉控制器暂停后续执行，它不适用于已经开始的执行。默认为假。
 
<!--
- **suspend** (boolean)

  This flag tells the controller to suspend subsequent executions, it does not apply to already started executions.  Defaults to false.
-->

- **successfulJobsHistoryLimit** (int32)

  要保留的成功完成作业的数量。值必须是非负整数。默认为 3。

<!--
- **successfulJobsHistoryLimit** (int32)

  The number of successful finished jobs to retain. Value must be non-negative integer. Defaults to 3.
-->

- **failedJobsHistoryLimit** (int32)

  要保留的失败的已完成作业的数量。值必须是非负整数。默认为 1。
 
<!--
- **failedJobsHistoryLimit** (int32)

  The number of failed finished jobs to retain. Value must be non-negative integer. Defaults to 1.
-->




## CronJobStatus {#CronJobStatus}

CronJobStatus 代表 cron 作业的当前状态。

<hr>

<!--
## CronJobStatus {#CronJobStatus}

CronJobStatus represents the current state of a cron job.

<hr>
-->

- **active** ([]<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

  *Atomic: 将在合并期间被替换。*
  
  指向当前正在运行的作业的指针列表。
  
<!--
- **active** ([]<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

  *Atomic: will be replaced during a merge*
  
  A list of pointers to currently running jobs.
-->

- **lastScheduleTime** (Time)

  上次成功安排作业的时间信息。
  
  <a name="Time"></a>
  *Time 是 time.Time 的包装器，它支持 YAML 和 JSON 格式。time 包提供的许多工厂方法都提供了包装器。*

<!--
- **lastScheduleTime** (Time)

  Information when was the last time the job was successfully scheduled.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
-->

- **lastSuccessfulTime** (Time)

  上次成功完成作业的时间信息。

  <a name="Time"></a>
  *Time 是 time.Time 的包装器，它支持 YAML 和 JSON 格式。time 包提供的许多工厂方法都提供了包装器。*
  
<!--
- **lastSuccessfulTime** (Time)

  Information when was the last time the job successfully completed.

  <a name="Time"></a>
  *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
-->  





## CronJobList {#CronJobList}

CronJobList 是 cron 作业的集合。

<hr>

<!--
## CronJobList {#CronJobList}

CronJobList is a collection of cron jobs.

<hr>
-->

- **apiVersion**: batch/v1


- **kind**: CronJobList

<!--
- **apiVersion**: batch/v1


- **kind**: CronJobList
-->

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  标准列表元数据。
  更多信息：https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  
<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->

- **items** ([]<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>)， 必填

  items 是 CronJobs 的列表。

<!--
- **items** ([]<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>), required

  items is the list of CronJobs.
-->



## Operations {#Operations}



<hr>

<!--
## Operations {#Operations}



<hr>
-->




### `get` 读取指定的 CronJob
<!-- ### `get` read the specified CronJob -->

#### HTTP 请求

GET /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

<!--
#### HTTP Request

GET /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}
-->

#### 参数
<!-- #### Parameters -->


- **name** （*路径参数*）: string，必填

  CronJob 名称
  
<!--
- **name** (*in path*): string, required

  name of the CronJob
-->


- **namespace** （*路径参数*）: string，必填

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>
  
<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>
-->


- **pretty** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>
  
<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>
-->


#### 响应
<!-- #### Response-->

200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>)：成功

401：未授权

<!--
200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

401: Unauthorized
-->


### `get` 读取特定 CronJob 的状态
<!-- ### `get` read status of the specified CronJob -->

#### HTTP 请求
<!-- #### HTTP Request-->

GET /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status
<!-- GET /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status-->

#### 参数
<!-- #### Parameters-->

- **name** （*路径参数*）: string，必填

  CronJob 名称。

<!--
- **name** (*in path*): string, required

  name of the CronJob
-->

- **namespace** （*路径参数*）: string，必填

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>
-->

- **pretty** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>
-->


#### 响应
<!-- #### Response-->


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>)：成功

401：未授权

<!--
200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

401: Unauthorized
-->


### `list` 列出或查看 CronJob 对象
<!-- ### `list` list or watch objects of kind CronJob-->

#### HTTP 请求

GET /apis/batch/v1/namespaces/{namespace}/cronjobs

#### 参数

<!--
#### HTTP Request

GET /apis/batch/v1/namespaces/{namespace}/cronjobs

#### Parameters
-->


- **namespace** （*路径参数*）: string，必填

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>
  
  <!--
  - **namespace** (*in path*): string，必填
  
    <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>
  -->


- **allowWatchBookmarks** （*查询参数*）: boolean

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>
-->

- **continue** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#continue" >}}">continue</a>
-->

- **fieldSelector** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->

- **limit** （*查询参数*）: integer

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **resourceVersion** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->

- **timeoutSeconds** （*查询参数*）: integer

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** （*查询参数*）: boolean

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#watch" >}}">watch</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#watch" >}}">watch</a>
-->

#### 响应


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobList" >}}">CronJobList</a>)：成功

401：未授权

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobList" >}}">CronJobList</a>): OK

401: Unauthorized
-->

### `list` 列出或查看 CronJob 对象

#### HTTP 请求

GET /apis/batch/v1/cronjobs

#### 参数

<!--
### `list` list or watch objects of kind CronJob

#### HTTP Request

GET /apis/batch/v1/cronjobs

#### Parameters
-->

- **allowWatchBookmarks** （*查询参数*）: boolean

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#continue" >}}">continue</a>
-->

- **fieldSelector** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **labelSelector** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->

- **limit** （*查询参数*）: integer

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **resourceVersion** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->

- **timeoutSeconds** （*查询参数*）: integer

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** （*查询参数*）: boolean

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#watch" >}}">watch</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#watch" >}}">watch</a>
-->

#### 响应


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobList" >}}">CronJobList</a>)：成功

401：未授权

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJobList" >}}">CronJobList</a>): OK

401: Unauthorized
-->

### `create` 创建一个 CronJob

#### HTTP 请求

POST /apis/batch/v1/namespaces/{namespace}/cronjobs

#### 参数

<!--
### `create` create a CronJob

#### HTTP Request

POST /apis/batch/v1/namespaces/{namespace}/cronjobs

#### Parameters
-->


- **namespace** (*in path*): string，必填

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>, required

<!--
- **namespace** （*路径参数*）: string，必填

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>，必填
-->  


- **dryRun** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->

- **fieldValidation** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

#### 响应


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

202 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Accepted

401：未授权

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

202 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Accepted

401: Unauthorized
-->

### `update` 更新特定的 CronJob

#### HTTP 请求

PUT /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### 参数

<!--
### `update` replace the specified CronJob

#### HTTP Request

PUT /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### Parameters
-->

- **name** （*路径参数*）: string，必填

  CronJob 名称

<!--
- **name** (*in path*): string, required

  name of the CronJob
-->

- **namespace** （*路径参数*）: string，必填

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>，必填

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>, required
-->
  


- **dryRun** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->

- **fieldValidation** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

#### 响应


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

401：未授权

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

401: Unauthorized
-->

### `update` 更新指定 CronJob 状态

#### HTTP 请求

PUT /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status

#### 参数

<!--
### `update` replace status of the specified CronJob

#### HTTP Request

PUT /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status

#### Parameters
-->

- **name** （*路径参数*）: string，必填

  CronJob 名称

<!--
- **name** (*in path*): string, required

  name of the CronJob
-->

- **namespace** （*路径参数*）: string，必填

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>，必填

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>, required
-->

- **dryRun** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->

- **fieldValidation** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

#### 响应


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

401：未授权

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

401: Unauthorized
-->


### `patch` 部分更新指定的 CronJob

#### HTTP 请求

PATCH /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### 参数

<!--
### `patch` partially update the specified CronJob

#### HTTP Request

PATCH /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### Parameters
-->


- **name** （*路径参数*）: string，必填

  CronJob 名称
  
<!--
- **name** (*in path*): string, required

  name of the CronJob
-->  


- **namespace** （*路径参数*）: string，必填

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必填

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
  


- **dryRun** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
  
<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->  


- **fieldValidation** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** （*查询参数*）: boolean

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#force" >}}">force</a>


- **pretty** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

#### 响应


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

401：未授权
<!--
#### Response


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

401: Unauthorized
-->

### `patch` 部分更新指定 CronJob 的状态

#### HTTP 请求

PATCH /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status

#### 参数

<!--
### `patch` partially update status of the specified CronJob

#### HTTP Request

PATCH /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}/status

#### Parameters
-->

- **name** （*路径参数*）: string，必填

  CronJob 名称

<!--
- **name** (*in path*): string, required
    
      name of the CronJob
-->

- **namespace** （*路径参数*）: string，必填

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必填

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->  


- **dryRun** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->

- **fieldValidation** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** （*查询参数*）: boolean

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#force" >}}">force</a>


- **pretty** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

#### 响应


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

401：未授权

<!--
#### Response


200 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): OK

201 (<a href="{{< ref "../workload-resources/cron-job-v1#CronJob" >}}">CronJob</a>): Created

401: Unauthorized
-->

### `delete` 删除一个 CronJob

#### HTTP 请求

DELETE /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### 参数
<!--
### `delete` delete a CronJob

#### HTTP Request

DELETE /apis/batch/v1/namespaces/{namespace}/cronjobs/{name}

#### Parameters
-->


- **name** （*路径参数*）: string，必填

  CronJob 名称

<!--
- **name** (*in path*): string, required

  name of the CronJob
-->

- **namespace** （*路径参数*）: string，必填

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->  


- **dryRun** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **gracePeriodSeconds** （*查询参数*）: integer

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->

- **pretty** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->


#### 响应


200 (<a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-definitions/status#Status" >}}">Status</a>): Accepted

401：未授权

<!--
#### Response


200 (<a href="{{< ref "../en/docs/reference/kubernetes-api/common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../en/docs/reference/kubernetes-api/common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized
-->

### `deletecollection` 删除 CronJob 集合

#### HTTP 请求

DELETE /apis/batch/v1/namespaces/{namespace}/cronjobs

#### 参数

<!--
### `deletecollection` delete collection of CronJob

#### HTTP Request

DELETE /apis/batch/v1/namespaces/{namespace}/cronjobs

#### Parameters
-->

- **namespace** （*路径参数*）: string，必填

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#namespace" >}}">namespace</a>


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->  


- **continue** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#continue" >}}">continue</a>


- **dryRun** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#continue" >}}">continue</a>


- **dryRun** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->

- **fieldSelector** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **gracePeriodSeconds** （*查询参数*）: integer

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->

- **labelSelector** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** （*查询参数*）: integer

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#limit" >}}">limit</a>
-->

- **pretty** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->

- **resourceVersion** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** （*查询参数*）: string

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->

- **timeoutSeconds** （*查询参数*）: integer

  <a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../en/docs/reference/kubernetes-api/common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->


#### 响应


200 (<a href="{{< ref "../../../../../en/docs/reference/kubernetes-api/common-definitions/status#Status" >}}">Status</a>): OK

401：未授权

<!--
#### Response


200 (<a href="{{< ref "../en/docs/reference/kubernetes-api/common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
-->