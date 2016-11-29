

-----------
# IngressStatus v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Extensions | v1beta1 | IngressStatus







IngressStatus describe the current state of the Ingress.

<aside class="notice">
Appears In <a href="#ingress-v1beta1">Ingress</a> </aside>

Field        | Description
------------ | -----------
loadBalancer <br /> *[LoadBalancerStatus](#loadbalancerstatus-v1)*  | LoadBalancer contains the current status of the load-balancer.





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



replace status of the specified Ingress

### HTTP Request

`PUT /apis/extensions/v1beta1/namespaces/{namespace}/ingresses/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Ingress
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Ingress](#ingress-v1beta1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Ingress](#ingress-v1beta1)*  | OK


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



partially update status of the specified Ingress

### HTTP Request

`PATCH /apis/extensions/v1beta1/namespaces/{namespace}/ingresses/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Ingress
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Ingress](#ingress-v1beta1)*  | OK



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



read status of the specified Ingress

### HTTP Request

`GET /apis/extensions/v1beta1/namespaces/{namespace}/ingresses/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Ingress
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Ingress](#ingress-v1beta1)*  | OK




