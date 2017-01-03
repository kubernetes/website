

-----------
# ReplicationControllerStatus v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ReplicationControllerStatus







ReplicationControllerStatus represents the current status of a replication controller.

<aside class="notice">
Appears In <a href="#replicationcontroller-v1">ReplicationController</a> </aside>

Field        | Description
------------ | -----------
availableReplicas <br /> *integer*  | The number of available replicas (ready for at least minReadySeconds) for this replication controller.
conditions <br /> *[ReplicationControllerCondition](#replicationcontrollercondition-v1) array*  | Represents the latest available observations of a replication controller's current state.
fullyLabeledReplicas <br /> *integer*  | The number of pods that have labels matching the labels of the pod template of the replication controller.
observedGeneration <br /> *integer*  | ObservedGeneration reflects the generation of the most recently observed replication controller.
readyReplicas <br /> *integer*  | The number of ready replicas for this replication controller.
replicas <br /> *integer*  | Replicas is the most recently oberved number of replicas. More info: http://kubernetes.io/docs/user-guide/replication-controller#what-is-a-replication-controller





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



replace status of the specified ReplicationController

### HTTP Request

`PUT /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the ReplicationController
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[ReplicationController](#replicationcontroller-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[ReplicationController](#replicationcontroller-v1)*  | OK


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



partially update status of the specified ReplicationController

### HTTP Request

`PATCH /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the ReplicationController
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[ReplicationController](#replicationcontroller-v1)*  | OK



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



read status of the specified ReplicationController

### HTTP Request

`GET /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the ReplicationController
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[ReplicationController](#replicationcontroller-v1)*  | OK




