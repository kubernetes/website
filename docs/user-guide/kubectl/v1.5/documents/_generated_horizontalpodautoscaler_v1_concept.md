

-----------
# HorizontalPodAutoscaler v1



Group        | Version     | Kind
------------ | ---------- | -----------
Autoscaling | v1 | HorizontalPodAutoscaler




<aside class="notice">Other api versions of this object exist: <a href="#horizontalpodautoscaler-v1beta1">v1beta1</a> </aside>


configuration of a horizontal pod autoscaler.

<aside class="notice">
Appears In <a href="#horizontalpodautoscalerlist-v1">HorizontalPodAutoscalerList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[HorizontalPodAutoscalerSpec](#horizontalpodautoscalerspec-v1)*  | behaviour of autoscaler. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status.
status <br /> *[HorizontalPodAutoscalerStatus](#horizontalpodautoscalerstatus-v1)*  | current information about the autoscaler.


### HorizontalPodAutoscalerSpec v1

<aside class="notice">
Appears In <a href="#horizontalpodautoscaler-v1">HorizontalPodAutoscaler</a> </aside>

Field        | Description
------------ | -----------
maxReplicas <br /> *integer*  | upper limit for the number of pods that can be set by the autoscaler; cannot be smaller than MinReplicas.
minReplicas <br /> *integer*  | lower limit for the number of pods that can be set by the autoscaler, default 1.
scaleTargetRef <br /> *[CrossVersionObjectReference](#crossversionobjectreference-v1)*  | reference to scaled resource; horizontal pod autoscaler will learn the current resource consumption and will set the desired number of pods by using its Scale subresource.
targetCPUUtilizationPercentage <br /> *integer*  | target average CPU utilization (represented as a percentage of requested CPU) over all the pods; if not specified the default autoscaling policy will be used.

### HorizontalPodAutoscalerStatus v1

<aside class="notice">
Appears In <a href="#horizontalpodautoscaler-v1">HorizontalPodAutoscaler</a> </aside>

Field        | Description
------------ | -----------
currentCPUUtilizationPercentage <br /> *integer*  | current average CPU utilization over all pods, represented as a percentage of requested CPU, e.g. 70 means that an average pod is using now 70% of its requested CPU.
currentReplicas <br /> *integer*  | current number of replicas of pods managed by this autoscaler.
desiredReplicas <br /> *integer*  | desired number of replicas of pods managed by this autoscaler.
lastScaleTime <br /> *[Time](#time-unversioned)*  | last time the HorizontalPodAutoscaler scaled the number of pods; used by the autoscaler to control how often the number of pods is changed.
observedGeneration <br /> *integer*  | most recent generation observed by this autoscaler.

### HorizontalPodAutoscalerList v1



Field        | Description
------------ | -----------
items <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1) array*  | list of horizontal pod autoscaler objects.
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata.




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



create a HorizontalPodAutoscaler

### HTTP Request

`POST /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers`

### Path Parameters

Parameter    | Description
------------ | -----------
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1)*  | OK


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



replace the specified HorizontalPodAutoscaler

### HTTP Request

`PUT /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the HorizontalPodAutoscaler
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1)*  | OK


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



partially update the specified HorizontalPodAutoscaler

### HTTP Request

`PATCH /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the HorizontalPodAutoscaler
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1)*  | OK


## Delete

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



delete a HorizontalPodAutoscaler

### HTTP Request

`DELETE /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the HorizontalPodAutoscaler
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[DeleteOptions](#deleteoptions-v1)*  | 
gracePeriodSeconds  | The duration in seconds before the object should be deleted. Value must be non-negative integer. The value zero indicates delete immediately. If this value is nil, the default grace period for the specified type will be used. Defaults to a per object value if not specified. zero means delete immediately.
orphanDependents  | Should the dependent objects be orphaned. If true/false, the "orphan" finalizer will be added to/removed from the object's finalizers list.

### Response

Code         | Description
------------ | -----------
200 <br /> *[Status](#status-unversioned)*  | OK


## Delete Collection

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



delete collection of HorizontalPodAutoscaler

### HTTP Request

`DELETE /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers`

### Path Parameters

Parameter    | Description
------------ | -----------
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
resourceVersion  | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history.
timeoutSeconds  | Timeout for the list/watch call.
watch  | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.

### Response

Code         | Description
------------ | -----------
200 <br /> *[Status](#status-unversioned)*  | OK



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



read the specified HorizontalPodAutoscaler

### HTTP Request

`GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the HorizontalPodAutoscaler
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
exact  | Should the export be exact.  Exact export maintains cluster-specific fields like 'Namespace'
export  | Should this value be exported.  Export strips fields that a user can not specify.

### Response

Code         | Description
------------ | -----------
200 <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1)*  | OK


## List

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



list or watch objects of kind HorizontalPodAutoscaler

### HTTP Request

`GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers`

### Path Parameters

Parameter    | Description
------------ | -----------
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
resourceVersion  | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history.
timeoutSeconds  | Timeout for the list/watch call.
watch  | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.

### Response

Code         | Description
------------ | -----------
200 <br /> *[HorizontalPodAutoscalerList](#horizontalpodautoscalerlist-v1)*  | OK


## List All Namespaces

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



list or watch objects of kind HorizontalPodAutoscaler

### HTTP Request

`GET /apis/autoscaling/v1/horizontalpodautoscalers`

### Path Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
pretty  | If 'true', then the output is pretty printed.
resourceVersion  | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history.
timeoutSeconds  | Timeout for the list/watch call.
watch  | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.


### Response

Code         | Description
------------ | -----------
200 <br /> *[HorizontalPodAutoscalerList](#horizontalpodautoscalerlist-v1)*  | OK


## Watch

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



watch changes to an object of kind HorizontalPodAutoscaler

### HTTP Request

`GET /apis/autoscaling/v1/watch/namespaces/{namespace}/horizontalpodautoscalers/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
name  | name of the HorizontalPodAutoscaler
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.
resourceVersion  | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history.
timeoutSeconds  | Timeout for the list/watch call.
watch  | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Event](#event-versioned)*  | OK


## Watch List

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



watch individual changes to a list of HorizontalPodAutoscaler

### HTTP Request

`GET /apis/autoscaling/v1/watch/namespaces/{namespace}/horizontalpodautoscalers`

### Path Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.
resourceVersion  | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history.
timeoutSeconds  | Timeout for the list/watch call.
watch  | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Event](#event-versioned)*  | OK


## Watch List All Namespaces

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



watch individual changes to a list of HorizontalPodAutoscaler

### HTTP Request

`GET /apis/autoscaling/v1/watch/horizontalpodautoscalers`

### Path Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
pretty  | If 'true', then the output is pretty printed.
resourceVersion  | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history.
timeoutSeconds  | Timeout for the list/watch call.
watch  | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Event](#event-versioned)*  | OK



## <strong>Status Operations</strong>

See supported operations below...

## Patch Status

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

`PATCH /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the HorizontalPodAutoscaler
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1)*  | OK


## Read Status

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

`GET /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the HorizontalPodAutoscaler
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1)*  | OK


## Replace Status

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

`PUT /apis/autoscaling/v1/namespaces/{namespace}/horizontalpodautoscalers/{name}/status`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the HorizontalPodAutoscaler
namespace  | object name and auth scope, such as for teams and projects
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[HorizontalPodAutoscaler](#horizontalpodautoscaler-v1)*  | OK




