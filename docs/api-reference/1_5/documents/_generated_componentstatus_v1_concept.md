

-----------
# ComponentStatus v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ComponentStatus







ComponentStatus (and ComponentStatusList) holds the cluster validation info.

<aside class="notice">
Appears In <a href="#componentstatuslist-v1">ComponentStatusList</a> </aside>

Field        | Description
------------ | -----------
conditions <br /> *[ComponentCondition](#componentcondition-v1) array*  | List of component conditions observed
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata


### ComponentStatusList v1



Field        | Description
------------ | -----------
items <br /> *[ComponentStatus](#componentstatus-v1) array*  | List of ComponentStatus objects.
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds




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



read the specified ComponentStatus

### HTTP Request

`GET /api/v1/componentstatuses/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the ComponentStatus
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[ComponentStatus](#componentstatus-v1)*  | OK


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



list objects of kind ComponentStatus

### HTTP Request

`GET /api/v1/componentstatuses`

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
200 <br /> *[ComponentStatusList](#componentstatuslist-v1)*  | OK




