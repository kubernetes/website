

-----------
# PersistentVolumeStatus v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PersistentVolumeStatus







PersistentVolumeStatus is the current status of a persistent volume.

<aside class="notice">
Appears In <a href="#persistentvolume-v1">PersistentVolume</a> </aside>

Field        | Description
------------ | -----------
message <br /> *string*  | A human-readable message indicating details about why the volume is in this state.
phase <br /> *string*  | Phase indicates if a volume is available, bound to a claim, or released by a claim. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#phase
reason <br /> *string*  | Reason is a brief CamelCase string that describes any failure and is meant for machine parsing and tidy display in the CLI.





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



replace status of the specified PersistentVolume

### HTTP Request

`PUT /api/v1/persistentvolumes/{name}/status`

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



partially update status of the specified PersistentVolume

### HTTP Request

`PATCH /api/v1/persistentvolumes/{name}/status`

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



read status of the specified PersistentVolume

### HTTP Request

`GET /api/v1/persistentvolumes/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the PersistentVolume
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[PersistentVolume](#persistentvolume-v1)*  | OK




