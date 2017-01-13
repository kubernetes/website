

-----------
# StatefulSetStatus v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Apps | v1beta1 | StatefulSetStatus







StatefulSetStatus represents the current state of a StatefulSet.

<aside class="notice">
Appears In <a href="#statefulset-v1beta1">StatefulSet</a> </aside>

Field        | Description
------------ | -----------
observedGeneration <br /> *integer*  | most recent generation observed by this autoscaler.
replicas <br /> *integer*  | Replicas is the number of actual replicas.





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



replace status of the specified StatefulSet

### HTTP Request

`PUT /apis/apps/v1beta1/namespaces/{namespace}/statefulsets/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the StatefulSet
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[StatefulSet](#statefulset-v1beta1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[StatefulSet](#statefulset-v1beta1)*  | OK


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



partially update status of the specified StatefulSet

### HTTP Request

`PATCH /apis/apps/v1beta1/namespaces/{namespace}/statefulsets/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the StatefulSet
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[StatefulSet](#statefulset-v1beta1)*  | OK



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



read status of the specified StatefulSet

### HTTP Request

`GET /apis/apps/v1beta1/namespaces/{namespace}/statefulsets/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the StatefulSet
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[StatefulSet](#statefulset-v1beta1)*  | OK




