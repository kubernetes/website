

-----------
# JobStatus v1



Group        | Version     | Kind
------------ | ---------- | -----------
Batch | v1 | JobStatus




<aside class="notice">Other api versions of this object exist: <a href="#jobstatus-v1beta1">v1beta1</a> </aside>


JobStatus represents the current state of a Job.

<aside class="notice">
Appears In <a href="#job-v1">Job</a> </aside>

Field        | Description
------------ | -----------
active <br /> *integer*  | Active is the number of actively running pods.
completionTime <br /> *[Time](#time-unversioned)*  | CompletionTime represents time when the job was completed. It is not guaranteed to be set in happens-before order across separate operations. It is represented in RFC3339 form and is in UTC.
conditions <br /> *[JobCondition](#jobcondition-v1) array*  | Conditions represent the latest available observations of an object's current state. More info: http://kubernetes.io/docs/user-guide/jobs
failed <br /> *integer*  | Failed is the number of pods which reached Phase Failed.
startTime <br /> *[Time](#time-unversioned)*  | StartTime represents time when the job was acknowledged by the Job Manager. It is not guaranteed to be set in happens-before order across separate operations. It is represented in RFC3339 form and is in UTC.
succeeded <br /> *integer*  | Succeeded is the number of pods which reached Phase Succeeded.





## <strong>Write Operations</strong>

See supported operations below...

## Replace

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

Coming Soon

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

Coming Soon

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

Coming Soon

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

Coming Soon

```



replace status of the specified Job

### HTTP Request

`PUT /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Job
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Job](#job-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Job](#job-v1)*  | OK


## Patch

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

Coming Soon

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

Coming Soon

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

Coming Soon

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

Coming Soon

```



partially update status of the specified Job

### HTTP Request

`PATCH /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Job
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Job](#job-v1)*  | OK



## <strong>Read Operations</strong>

See supported operations below...

## Read

>bdocs-tab:kubectl `kubectl` Command

```bdocs-tab:kubectl_shell

Coming Soon

```

>bdocs-tab:curl `curl` Command (*requires `kubectl proxy` to be running*)

```bdocs-tab:curl_shell

Coming Soon

```

>bdocs-tab:kubectl Output

```bdocs-tab:kubectl_json

Coming Soon

```
>bdocs-tab:curl Response Body

```bdocs-tab:curl_json

Coming Soon

```



read status of the specified Job

### HTTP Request

`GET /apis/batch/v1/namespaces/{namespace}/jobs/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Job
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Job](#job-v1)*  | OK




