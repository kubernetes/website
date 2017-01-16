

-----------
# ServiceStatus v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ServiceStatus







ServiceStatus represents the current status of a service.

<aside class="notice">
Appears In <a href="#service-v1">Service</a> </aside>

Field        | Description
------------ | -----------
loadBalancer <br /> *[LoadBalancerStatus](#loadbalancerstatus-v1)*  | LoadBalancer contains the current status of the load-balancer, if one is present.





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



replace status of the specified Service

### HTTP Request

`PUT /api/v1/namespaces/{namespace}/services/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Service
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Service](#service-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Service](#service-v1)*  | OK


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



partially update status of the specified Service

### HTTP Request

`PATCH /api/v1/namespaces/{namespace}/services/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Service
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Service](#service-v1)*  | OK



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



read status of the specified Service

### HTTP Request

`GET /api/v1/namespaces/{namespace}/services/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Service
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Service](#service-v1)*  | OK




