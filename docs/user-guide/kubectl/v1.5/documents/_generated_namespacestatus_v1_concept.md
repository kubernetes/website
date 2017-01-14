

-----------
# NamespaceStatus v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | NamespaceStatus







NamespaceStatus is information about the current status of a Namespace.

<aside class="notice">
Appears In <a href="#namespace-v1">Namespace</a> </aside>

Field        | Description
------------ | -----------
phase <br /> *string*  | Phase is the current lifecycle phase of the namespace. More info: http://releases.k8s.io/HEAD/docs/design/namespaces.md#phases





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



replace status of the specified Namespace

### HTTP Request

`PUT /api/v1/namespaces/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Namespace
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Namespace](#namespace-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Namespace](#namespace-v1)*  | OK


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



partially update status of the specified Namespace

### HTTP Request

`PATCH /api/v1/namespaces/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Namespace
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Namespace](#namespace-v1)*  | OK



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



read status of the specified Namespace

### HTTP Request

`GET /api/v1/namespaces/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Namespace
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Namespace](#namespace-v1)*  | OK




