

-----------
# Scale v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Scale




<aside class="notice">Other api versions of this object exist: <a href="#scale-v1beta1">v1beta1</a> </aside>


Scale represents a scaling request for a resource.



Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object metadata; More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata.
spec <br /> *[ScaleSpec](#scalespec-v1)*  | defines the behavior of the scale. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status.
status <br /> *[ScaleStatus](#scalestatus-v1)*  | current status of the scale. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status. Read-only.


### ScaleSpec v1

<aside class="notice">
Appears In <a href="#scale-v1">Scale</a> </aside>

Field        | Description
------------ | -----------
replicas <br /> *integer*  | desired number of instances for the scaled object.

### ScaleStatus v1

<aside class="notice">
Appears In <a href="#scale-v1">Scale</a> </aside>

Field        | Description
------------ | -----------
replicas <br /> *integer*  | actual number of observed instances of the scaled object.
selector <br /> *string*  | label query over pods that should match the replicas count. This is same as the label selector but in the string format to avoid introspection by clients. The string will be in the same format as the query-param syntax. More info about label selectors: http://kubernetes.io/docs/user-guide/labels#label-selectors




## <strong>Misc Operations</strong>

See supported operations below...

## Read Scale

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



read scale of the specified Scale

### HTTP Request

`GET /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/scale`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Scale
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Scale](#scale-v1)*  | OK


## Replace Scale

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



replace scale of the specified Scale

### HTTP Request

`PUT /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/scale`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Scale
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Scale](#scale-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Scale](#scale-v1)*  | OK


## Patch Scale

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



partially update scale of the specified Scale

### HTTP Request

`PATCH /api/v1/namespaces/{namespace}/replicationcontrollers/{name}/scale`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Scale
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Scale](#scale-v1)*  | OK




