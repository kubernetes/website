

-----------
# ResourceQuotaStatus v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ResourceQuotaStatus







ResourceQuotaStatus defines the enforced hard limits and observed use.

<aside class="notice">
Appears In <a href="#resourcequota-v1">ResourceQuota</a> </aside>

Field        | Description
------------ | -----------
hard <br /> *object*  | Hard is the set of enforced hard limits for each named resource. More info: http://releases.k8s.io/HEAD/docs/design/admission_control_resource_quota.md#admissioncontrol-plugin-resourcequota
used <br /> *object*  | Used is the current observed total usage of the resource in the namespace.





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



replace status of the specified ResourceQuota

### HTTP Request

`PUT /api/v1/namespaces/{namespace}/resourcequotas/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the ResourceQuota
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[ResourceQuota](#resourcequota-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[ResourceQuota](#resourcequota-v1)*  | OK


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



partially update status of the specified ResourceQuota

### HTTP Request

`PATCH /api/v1/namespaces/{namespace}/resourcequotas/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the ResourceQuota
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[ResourceQuota](#resourcequota-v1)*  | OK



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



read status of the specified ResourceQuota

### HTTP Request

`GET /api/v1/namespaces/{namespace}/resourcequotas/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the ResourceQuota
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[ResourceQuota](#resourcequota-v1)*  | OK




