

-----------
# PodStatus v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PodStatus







PodStatus represents information about the status of a pod. Status may trail the actual state of a system.

<aside class="notice">
Appears In <a href="#pod-v1">Pod</a> </aside>

Field        | Description
------------ | -----------
conditions <br /> *[PodCondition](#podcondition-v1) array*  | Current service state of pod. More info: http://kubernetes.io/docs/user-guide/pod-states#pod-conditions
containerStatuses <br /> *[ContainerStatus](#containerstatus-v1) array*  | The list has one entry per container in the manifest. Each entry is currently the output of `docker inspect`. More info: http://kubernetes.io/docs/user-guide/pod-states#container-statuses
hostIP <br /> *string*  | IP address of the host to which the pod is assigned. Empty if not yet scheduled.
message <br /> *string*  | A human readable message indicating details about why the pod is in this condition.
phase <br /> *string*  | Current condition of the pod. More info: http://kubernetes.io/docs/user-guide/pod-states#pod-phase
podIP <br /> *string*  | IP address allocated to the pod. Routable at least within the cluster. Empty if not yet allocated.
reason <br /> *string*  | A brief CamelCase message indicating details about why the pod is in this state. e.g. 'OutOfDisk'
startTime <br /> *[Time](#time-unversioned)*  | RFC 3339 date and time at which the object was acknowledged by the Kubelet. This is before the Kubelet pulled the container image(s) for the pod.





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



replace status of the specified Pod

### HTTP Request

`PUT /api/v1/namespaces/{namespace}/pods/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Pod
namespace  | object name and auth scope, such as for teams and projects

### Query Parameters

Parameter    | Description
------------ | -----------
pretty  | If 'true', then the output is pretty printed.

### Body Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Pod](#pod-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Pod](#pod-v1)*  | OK


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



partially update status of the specified Pod

### HTTP Request

`PATCH /api/v1/namespaces/{namespace}/pods/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Pod
namespace  | object name and auth scope, such as for teams and projects

### Query Parameters

Parameter    | Description
------------ | -----------
pretty  | If 'true', then the output is pretty printed.

### Body Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Pod](#pod-v1)*  | OK



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



read status of the specified Pod

### HTTP Request

`GET /api/v1/namespaces/{namespace}/pods/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Pod
namespace  | object name and auth scope, such as for teams and projects

### Query Parameters

Parameter    | Description
------------ | -----------
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Pod](#pod-v1)*  | OK




