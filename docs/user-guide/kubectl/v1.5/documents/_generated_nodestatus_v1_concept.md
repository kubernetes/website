

-----------
# NodeStatus v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | NodeStatus







NodeStatus is information about the current status of a node.

<aside class="notice">
Appears In <a href="#node-v1">Node</a> </aside>

Field        | Description
------------ | -----------
addresses <br /> *[NodeAddress](#nodeaddress-v1) array*  | List of addresses reachable to the node. Queried from cloud provider, if available. More info: http://releases.k8s.io/HEAD/docs/admin/node.md#node-addresses
allocatable <br /> *object*  | Allocatable represents the resources of a node that are available for scheduling. Defaults to Capacity.
capacity <br /> *object*  | Capacity represents the total resources of a node. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#capacity for more details.
conditions <br /> *[NodeCondition](#nodecondition-v1) array*  | Conditions is an array of current observed node conditions. More info: http://releases.k8s.io/HEAD/docs/admin/node.md#node-condition
daemonEndpoints <br /> *[NodeDaemonEndpoints](#nodedaemonendpoints-v1)*  | Endpoints of daemons running on the Node.
images <br /> *[ContainerImage](#containerimage-v1) array*  | List of container images on this node
nodeInfo <br /> *[NodeSystemInfo](#nodesysteminfo-v1)*  | Set of ids/uuids to uniquely identify the node. More info: http://releases.k8s.io/HEAD/docs/admin/node.md#node-info
phase <br /> *string*  | NodePhase is the recently observed lifecycle phase of the node. More info: http://releases.k8s.io/HEAD/docs/admin/node.md#node-phase The field is never populated, and now is deprecated.
volumesAttached <br /> *[AttachedVolume](#attachedvolume-v1) array*  | List of volumes that are attached to the node.
volumesInUse <br /> *string array*  | List of attachable volumes in use (mounted) by the node.





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



replace status of the specified Node

### HTTP Request

`PUT /api/v1/nodes/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Node
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Node](#node-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Node](#node-v1)*  | OK


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



partially update status of the specified Node

### HTTP Request

`PATCH /api/v1/nodes/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Node
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Node](#node-v1)*  | OK



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



read status of the specified Node

### HTTP Request

`GET /api/v1/nodes/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Node
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Node](#node-v1)*  | OK




