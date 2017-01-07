

-----------
# Binding v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Binding







Binding ties one object to another. For example, a pod is bound to a node by a scheduler.



Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
target <br /> *[ObjectReference](#objectreference-v1)*  | The target object that you want to bind to the standard object.





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



create a Binding

### HTTP Request

`POST /api/v1/namespaces/{namespace}/bindings`

### Path Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Binding](#binding-v1)*  | 
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Binding](#binding-v1)*  | OK




