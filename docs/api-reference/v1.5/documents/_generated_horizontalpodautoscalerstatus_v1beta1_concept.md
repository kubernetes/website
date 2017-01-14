

-----------
# HorizontalPodAutoscalerStatus v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Extensions | v1beta1 | HorizontalPodAutoscalerStatus




<aside class="notice">Other api versions of this object exist: <a href="#horizontalpodautoscalerstatus-v1">v1</a> </aside>


current status of a horizontal pod autoscaler

<aside class="notice">
Appears In <a href="#horizontalpodautoscaler-v1beta1">HorizontalPodAutoscaler</a> </aside>

Field        | Description
------------ | -----------
currentCPUUtilizationPercentage <br /> *integer*  | current average CPU utilization over all pods, represented as a percentage of requested CPU, e.g. 70 means that an average pod is using now 70% of its requested CPU.
currentReplicas <br /> *integer*  | current number of replicas of pods managed by this autoscaler.
desiredReplicas <br /> *integer*  | desired number of replicas of pods managed by this autoscaler.
lastScaleTime <br /> *[Time](#time-unversioned)*  | last time the HorizontalPodAutoscaler scaled the number of pods; used by the autoscaler to control how often the number of pods is changed.
observedGeneration <br /> *integer*  | most recent generation observed by this autoscaler.





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



replace status of the specified HorizontalPodAutoscaler

### HTTP Request

`PUT /apis/extensions/v1beta1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the HorizontalPodAutoscaler
namespace  | object name and auth scope, such as for teams and projects

### Query Parameters

Parameter    | Description
------------ | -----------
pretty  | If 'true', then the output is pretty printed.

### Body Parameters

Parameter    | Description
------------ | -----------
body <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1beta1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1beta1)*  | OK


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



partially update status of the specified HorizontalPodAutoscaler

### HTTP Request

`PATCH /apis/extensions/v1beta1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the HorizontalPodAutoscaler
namespace  | object name and auth scope, such as for teams and projects

### Query Parameters

Parameter    | Description
------------ | -----------
pretty  | If 'true', then the output is pretty printed.

### Body Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1beta1)*  | OK



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



read status of the specified HorizontalPodAutoscaler

### HTTP Request

`GET /apis/extensions/v1beta1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the HorizontalPodAutoscaler
namespace  | object name and auth scope, such as for teams and projects

### Query Parameters

Parameter    | Description
------------ | -----------
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1beta1)*  | OK




