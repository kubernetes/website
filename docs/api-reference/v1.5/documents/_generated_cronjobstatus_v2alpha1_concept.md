

-----------
# CronJobStatus v2alpha1



Group        | Version     | Kind
------------ | ---------- | -----------
Batch | v2alpha1 | CronJobStatus







CronJobStatus represents the current state of a cron job.

<aside class="notice">
Appears In <a href="#cronjob-v2alpha1">CronJob</a> </aside>

Field        | Description
------------ | -----------
active <br /> *[ObjectReference](#objectreference-v1) array*  | Active holds pointers to currently running jobs.
lastScheduleTime <br /> *[Time](#time-unversioned)*  | LastScheduleTime keeps information of when was the last time the job was successfully scheduled.





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



replace status of the specified CronJob

### HTTP Request

`PUT /apis/batch/v2alpha1/namespaces/{namespace}/cronjobs/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the CronJob
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[CronJob](#cronjob-v2alpha1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[CronJob](#cronjob-v2alpha1)*  | OK


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



partially update status of the specified CronJob

### HTTP Request

`PATCH /apis/batch/v2alpha1/namespaces/{namespace}/cronjobs/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the CronJob
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[CronJob](#cronjob-v2alpha1)*  | OK



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



read status of the specified CronJob

### HTTP Request

`GET /apis/batch/v2alpha1/namespaces/{namespace}/cronjobs/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the CronJob
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[CronJob](#cronjob-v2alpha1)*  | OK




