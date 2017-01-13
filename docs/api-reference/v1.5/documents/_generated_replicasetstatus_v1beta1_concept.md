

-----------
# ReplicaSetStatus v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Extensions | v1beta1 | ReplicaSetStatus







ReplicaSetStatus represents the current status of a ReplicaSet.

<aside class="notice">
Appears In <a href="#replicaset-v1beta1">ReplicaSet</a> </aside>

Field        | Description
------------ | -----------
availableReplicas <br /> *integer*  | The number of available replicas (ready for at least minReadySeconds) for this replica set.
conditions <br /> *[ReplicaSetCondition](#replicasetcondition-v1beta1) array*  | Represents the latest available observations of a replica set's current state.
fullyLabeledReplicas <br /> *integer*  | The number of pods that have labels matching the labels of the pod template of the replicaset.
observedGeneration <br /> *integer*  | ObservedGeneration reflects the generation of the most recently observed ReplicaSet.
readyReplicas <br /> *integer*  | The number of ready replicas for this replica set.
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



replace status of the specified ReplicaSet

### HTTP Request

`PUT /apis/extensions/v1beta1/namespaces/{namespace}/replicasets/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the ReplicaSet
namespace  | object name and auth scope, such as for teams and projects

### Query Parameters

Parameter    | Description
------------ | -----------
pretty  | If 'true', then the output is pretty printed.

### Body Parameters

Parameter    | Description
------------ | -----------
body <br /> *[ReplicaSet](#replicaset-v1beta1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[ReplicaSet](#replicaset-v1beta1)*  | OK


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



partially update status of the specified ReplicaSet

### HTTP Request

`PATCH /apis/extensions/v1beta1/namespaces/{namespace}/replicasets/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the ReplicaSet
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
200 <br /> *[ReplicaSet](#replicaset-v1beta1)*  | OK



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



read status of the specified ReplicaSet

### HTTP Request

`GET /apis/extensions/v1beta1/namespaces/{namespace}/replicasets/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the ReplicaSet
namespace  | object name and auth scope, such as for teams and projects

### Query Parameters

Parameter    | Description
------------ | -----------
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[ReplicaSet](#replicaset-v1beta1)*  | OK




