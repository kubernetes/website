

-----------
# PersistentVolume v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PersistentVolume


<aside class="notice">These are assigned to <a href="#pod-v1">Pods</a> using <a href="#persistentvolumeclaim-v1">PersistentVolumeClaims</a>.</aside>




PersistentVolume (PV) is a storage resource provisioned by an administrator. It is analogous to a node. More info: http://kubernetes.io/docs/user-guide/persistent-volumes

<aside class="notice">
Appears In <a href="#persistentvolumelist-v1">PersistentVolumeList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[PersistentVolumeSpec](#persistentvolumespec-v1)*  | Spec defines a specification of a persistent volume owned by the cluster. Provisioned by an administrator. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#persistent-volumes
status <br /> *[PersistentVolumeStatus](#persistentvolumestatus-v1)*  | Status represents the current information/status for the persistent volume. Populated by the system. Read-only. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#persistent-volumes


### PersistentVolumeSpec v1

<aside class="notice">
Appears In <a href="#persistentvolume-v1">PersistentVolume</a> </aside>

Field        | Description
------------ | -----------
accessModes <br /> *string array*  | AccessModes contains all ways the volume can be mounted. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#access-modes
capacity <br /> *object*  | A description of the persistent volume's resources and capacity. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#capacity
claimRef <br /> *[ObjectReference](#objectreference-v1)*  | ClaimRef is part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim. Expected to be non-nil when bound. claim.VolumeName is the authoritative bind between PV and PVC. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#binding
persistentVolumeReclaimPolicy <br /> *string*  | What happens to a persistent volume when released from its claim. Valid options are Retain (default) and Recycle. Recycling must be supported by the volume plugin underlying this persistent volume. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#recycling-policy

### PersistentVolumeStatus v1

<aside class="notice">
Appears In <a href="#persistentvolume-v1">PersistentVolume</a> </aside>

Field        | Description
------------ | -----------
message <br /> *string*  | A human-readable message indicating details about why the volume is in this state.
phase <br /> *string*  | Phase indicates if a volume is available, bound to a claim, or released by a claim. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#phase
reason <br /> *string*  | Reason is a brief CamelCase string that describes any failure and is meant for machine parsing and tidy display in the CLI.

### PersistentVolumeList v1



Field        | Description
------------ | -----------
items <br /> *[PersistentVolume](#persistentvolume-v1) array*  | List of persistent volumes. More info: http://kubernetes.io/docs/user-guide/persistent-volumes
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds




## <strong>Write Operations</strong>

See supported operations below...

## Create

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



create a PersistentVolume

### HTTP Request

`POST /api/v1/persistentvolumes`

### Path Parameters

Parameter    | Description
------------ | -----------
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[PersistentVolume](#persistentvolume-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[PersistentVolume](#persistentvolume-v1)*  | OK


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



replace the specified PersistentVolume

### HTTP Request

`PUT /api/v1/persistentvolumes/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the PersistentVolume
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[PersistentVolume](#persistentvolume-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[PersistentVolume](#persistentvolume-v1)*  | OK


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



partially update the specified PersistentVolume

### HTTP Request

`PATCH /api/v1/persistentvolumes/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the PersistentVolume
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[PersistentVolume](#persistentvolume-v1)*  | OK


## Delete

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



delete a PersistentVolume

### HTTP Request

`DELETE /api/v1/persistentvolumes/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the PersistentVolume
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[DeleteOptions](#deleteoptions-v1)*  | 
gracePeriodSeconds  | The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.
orphanDependents  | Should the dependent objects be orphaned. If true/false, the "orphan" finalizer will be added to/removed from the object's finalizers list.

### Response

Code         | Description
------------ | -----------
200 <br /> *[Status](#status-unversioned)*  | OK


## Delete Collection

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



delete collection of PersistentVolume

### HTTP Request

`DELETE /api/v1/persistentvolumes`

### Path Parameters

Parameter    | Description
------------ | -----------
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
resourceVersion  | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history.
timeoutSeconds  | Timeout for the list/watch call.
watch  | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.

### Response

Code         | Description
------------ | -----------
200 <br /> *[Status](#status-unversioned)*  | OK



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



read the specified PersistentVolume

### HTTP Request

`GET /api/v1/persistentvolumes/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the PersistentVolume
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
exact  | Should the export be exact.  Exact export maintains cluster-specific fields like 'Namespace'
export  | Should this value be exported.  Export strips fields that a user can not specify.

### Response

Code         | Description
------------ | -----------
200 <br /> *[PersistentVolume](#persistentvolume-v1)*  | OK


## List

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



list or watch objects of kind PersistentVolume

### HTTP Request

`GET /api/v1/persistentvolumes`

### Path Parameters

Parameter    | Description
------------ | -----------
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
resourceVersion  | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history.
timeoutSeconds  | Timeout for the list/watch call.
watch  | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.

### Response

Code         | Description
------------ | -----------
200 <br /> *[PersistentVolumeList](#persistentvolumelist-v1)*  | OK


## Watch

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



watch changes to an object of kind PersistentVolume

### HTTP Request

`GET /api/v1/watch/persistentvolumes/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
name  | name of the PersistentVolume
pretty  | If 'true', then the output is pretty printed.
resourceVersion  | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history.
timeoutSeconds  | Timeout for the list/watch call.
watch  | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Event](#event-versioned)*  | OK


## Watch List

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



watch individual changes to a list of PersistentVolume

### HTTP Request

`GET /api/v1/watch/persistentvolumes`

### Path Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
pretty  | If 'true', then the output is pretty printed.
resourceVersion  | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history.
timeoutSeconds  | Timeout for the list/watch call.
watch  | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Event](#event-versioned)*  | OK




