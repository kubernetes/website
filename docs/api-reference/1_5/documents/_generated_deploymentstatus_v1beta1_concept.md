

-----------
# DeploymentStatus v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Extensions | v1beta1 | DeploymentStatus







DeploymentStatus is the most recently observed status of the Deployment.

<aside class="notice">
Appears In <a href="#deployment-v1beta1">Deployment</a> </aside>

Field        | Description
------------ | -----------
availableReplicas <br /> *integer*  | Total number of available pods (ready for at least minReadySeconds) targeted by this deployment.
conditions <br /> *[DeploymentCondition](#deploymentcondition-v1beta1) array*  | Represents the latest available observations of a deployment's current state.
observedGeneration <br /> *integer*  | The generation observed by the deployment controller.
replicas <br /> *integer*  | Total number of non-terminated pods targeted by this deployment (their labels match the selector).
unavailableReplicas <br /> *integer*  | Total number of unavailable pods targeted by this deployment.
updatedReplicas <br /> *integer*  | Total number of non-terminated pods targeted by this deployment that have the desired template spec.





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



replace status of the specified Deployment

### HTTP Request

`PUT /apis/extensions/v1beta1/namespaces/{namespace}/deployments/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Deployment
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Deployment](#deployment-v1beta1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Deployment](#deployment-v1beta1)*  | OK


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



partially update status of the specified Deployment

### HTTP Request

`PATCH /apis/extensions/v1beta1/namespaces/{namespace}/deployments/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Deployment
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[Deployment](#deployment-v1beta1)*  | OK



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



read status of the specified Deployment

### HTTP Request

`GET /apis/extensions/v1beta1/namespaces/{namespace}/deployments/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the Deployment
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Deployment](#deployment-v1beta1)*  | OK




