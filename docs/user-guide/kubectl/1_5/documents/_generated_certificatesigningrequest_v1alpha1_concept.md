

-----------
# CertificateSigningRequest v1alpha1



Group        | Version     | Kind
------------ | ---------- | -----------
Certificates | v1alpha1 | CertificateSigningRequest







Describes a certificate signing request

<aside class="notice">
Appears In <a href="#certificatesigningrequestlist-v1alpha1">CertificateSigningRequestList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | 
spec <br /> *[CertificateSigningRequestSpec](#certificatesigningrequestspec-v1alpha1)*  | The certificate request itself and any additional information.
status <br /> *[CertificateSigningRequestStatus](#certificatesigningrequeststatus-v1alpha1)*  | Derived information about the request.


### CertificateSigningRequestSpec v1alpha1

<aside class="notice">
Appears In <a href="#certificatesigningrequest-v1alpha1">CertificateSigningRequest</a> </aside>

Field        | Description
------------ | -----------
groups <br /> *string array*  | 
request <br /> *string*  | Base64-encoded PKCS#10 CSR data
uid <br /> *string*  | 
username <br /> *string*  | Information about the requesting user (if relevant) See user.Info interface for details

### CertificateSigningRequestStatus v1alpha1

<aside class="notice">
Appears In <a href="#certificatesigningrequest-v1alpha1">CertificateSigningRequest</a> </aside>

Field        | Description
------------ | -----------
certificate <br /> *string*  | If request was approved, the controller will place the issued certificate here.
conditions <br /> *[CertificateSigningRequestCondition](#certificatesigningrequestcondition-v1alpha1) array*  | Conditions applied to the request, such as approval or denial.

### CertificateSigningRequestList v1alpha1



Field        | Description
------------ | -----------
items <br /> *[CertificateSigningRequest](#certificatesigningrequest-v1alpha1) array*  | 
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | 




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



create a CertificateSigningRequest

### HTTP Request

`POST /apis/certificates.k8s.io/v1alpha1/certificatesigningrequests`

### Path Parameters

Parameter    | Description
------------ | -----------
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[CertificateSigningRequest](#certificatesigningrequest-v1alpha1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[CertificateSigningRequest](#certificatesigningrequest-v1alpha1)*  | OK


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



replace the specified CertificateSigningRequest

### HTTP Request

`PUT /apis/certificates.k8s.io/v1alpha1/certificatesigningrequests/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the CertificateSigningRequest
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[CertificateSigningRequest](#certificatesigningrequest-v1alpha1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[CertificateSigningRequest](#certificatesigningrequest-v1alpha1)*  | OK


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



partially update the specified CertificateSigningRequest

### HTTP Request

`PATCH /apis/certificates.k8s.io/v1alpha1/certificatesigningrequests/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the CertificateSigningRequest
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
body <br /> *[Patch](#patch-unversioned)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[CertificateSigningRequest](#certificatesigningrequest-v1alpha1)*  | OK


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



delete a CertificateSigningRequest

### HTTP Request

`DELETE /apis/certificates.k8s.io/v1alpha1/certificatesigningrequests/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the CertificateSigningRequest
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



delete collection of CertificateSigningRequest

### HTTP Request

`DELETE /apis/certificates.k8s.io/v1alpha1/certificatesigningrequests`

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



read the specified CertificateSigningRequest

### HTTP Request

`GET /apis/certificates.k8s.io/v1alpha1/certificatesigningrequests/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
name  | name of the CertificateSigningRequest
pretty  | If 'true', then the output is pretty printed.

### Query Parameters

Parameter    | Description
------------ | -----------
exact  | Should the export be exact.  Exact export maintains cluster-specific fields like 'Namespace'
export  | Should this value be exported.  Export strips fields that a user can not specify.

### Response

Code         | Description
------------ | -----------
200 <br /> *[CertificateSigningRequest](#certificatesigningrequest-v1alpha1)*  | OK


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



list or watch objects of kind CertificateSigningRequest

### HTTP Request

`GET /apis/certificates.k8s.io/v1alpha1/certificatesigningrequests`

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
200 <br /> *[CertificateSigningRequestList](#certificatesigningrequestlist-v1alpha1)*  | OK


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



watch changes to an object of kind CertificateSigningRequest

### HTTP Request

`GET /apis/certificates.k8s.io/v1alpha1/watch/certificatesigningrequests/{name}`

### Path Parameters

Parameter    | Description
------------ | -----------
fieldSelector  | A selector to restrict the list of returned objects by their fields. Defaults to everything.
labelSelector  | A selector to restrict the list of returned objects by their labels. Defaults to everything.
name  | name of the CertificateSigningRequest
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



watch individual changes to a list of CertificateSigningRequest

### HTTP Request

`GET /apis/certificates.k8s.io/v1alpha1/watch/certificatesigningrequests`

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




