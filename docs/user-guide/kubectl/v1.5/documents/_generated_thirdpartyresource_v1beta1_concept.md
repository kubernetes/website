

-----------
# ThirdPartyResource v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Extensions | v1beta1 | ThirdPartyResource







A ThirdPartyResource is a generic representation of a resource, it is used by add-ons and plugins to add new resource types to the API.  It consists of one or more Versions of the api.

<aside class="notice">
Appears In <a href="#thirdpartyresourcelist-v1beta1">ThirdPartyResourceList</a> </aside>

Field        | Description
------------ | -----------
description <br /> *string*  | Description is the description of this object.
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object metadata
versions <br /> *[APIVersion](#apiversion-v1beta1) array*  | Versions are versions for this third party object


### ThirdPartyResourceList v1beta1



Field        | Description
------------ | -----------
items <br /> *[ThirdPartyResource](#thirdpartyresource-v1beta1) array*  | Items is the list of ThirdPartyResources.
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



create a ThirdPartyResource

### HTTP Request

`POST /apis/extensions/v1beta1/thirdpartyresources`

### Path Parameters

Parameter    | Description
------------ | -----------
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[ThirdPartyResource](#thirdpartyresource-v1beta1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[ThirdPartyResource](#thirdpartyresource-v1beta1)*  | OK


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



replace the specified ThirdPartyResource

### HTTP Request

`PUT /apis/extensions/v1beta1/thirdpartyresources/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the ThirdPartyResource
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[ThirdPartyResource](#thirdpartyresource-v1beta1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[ThirdPartyResource](#thirdpartyresource-v1beta1)*  | OK


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



partially update the specified ThirdPartyResource

### HTTP Request

`PATCH /apis/extensions/v1beta1/thirdpartyresources/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the ThirdPartyResource
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[ThirdPartyResource](#thirdpartyresource-v1beta1)*  | OK


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



delete a ThirdPartyResource

### HTTP Request

`DELETE /apis/extensions/v1beta1/thirdpartyresources/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the ThirdPartyResource
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



delete collection of ThirdPartyResource

### HTTP Request

`DELETE /apis/extensions/v1beta1/thirdpartyresources`

### Path Parameters

Parameter    | Description
------------ | -----------
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



read the specified ThirdPartyResource

### HTTP Request

`GET /apis/extensions/v1beta1/thirdpartyresources/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the ThirdPartyResource
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
exact  | Should the export be exact.  Exact export maintains cluster-specific fields like 'Namespace'
export  | Should this value be exported.  Export strips fields that a user can not specify.

### Response

Code         | Description
------------ | -----------
200 <br /> *[ThirdPartyResource](#thirdpartyresource-v1beta1)*  | OK


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



list or watch objects of kind ThirdPartyResource

### HTTP Request

`GET /apis/extensions/v1beta1/thirdpartyresources`

### Path Parameters

Parameter    | Description
------------ | -----------
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
200 <br /> *[ThirdPartyResourceList](#thirdpartyresourcelist-v1beta1)*  | OK


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



watch changes to an object of kind ThirdPartyResource

### HTTP Request

`GET /apis/extensions/v1beta1/watch/thirdpartyresources/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
name  | name of the ThirdPartyResource
pretty  | If 'true', then the output is pretty printed.
resourceVersion  | When specified with a watch call, shows changes that occur after that particular version of a resource. Defaults to changes from the beginning of history.
timeoutSeconds  | Timeout for the list/watch call.
watch  | Watch for changes to the described resources and return them as a stream of add, update, and remove notifications. Specify resourceVersion.


### Response

Code         | Description
------------ | -----------
200 <br /> *[Event](#event-versioned)*  | OK




