

-----------
# Binding v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Binding







Binding ties one object to another. For example, a pod is bound to a node by a scheduler.



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
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
namespace  | object name and auth scope, such as for teams and projects

### Query Parameters

Parameter    | Description
------------ | -----------
pretty  | If 'true', then the output is pretty printed.

### Body Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Binding](#binding-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Binding](#binding-v1)*  | OK




