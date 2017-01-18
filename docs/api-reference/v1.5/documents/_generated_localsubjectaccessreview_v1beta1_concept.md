

-----------
# LocalSubjectAccessReview v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Authorization | v1beta1 | LocalSubjectAccessReview







LocalSubjectAccessReview checks whether or not a user or group can perform an action in a given namespace. Having a namespace scoped resource makes it much easier to grant namespace scoped policy that includes permissions checking.



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | 
spec <br /> *[SubjectAccessReviewSpec](#subjectaccessreviewspec-v1beta1)*  | Spec holds information about the request being evaluated.  spec.namespace must be equal to the namespace you made the request against.  If empty, it is defaulted.
status <br /> *[SubjectAccessReviewStatus](#subjectaccessreviewstatus-v1beta1)*  | Status is filled in by the server and indicates whether the request is allowed or not





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



create a LocalSubjectAccessReview

### HTTP Request

`POST /apis/authorization.k8s.io/v1beta1/namespaces/{namespace}/localsubjectaccessreviews`

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
body <br /> *[LocalSubjectAccessReview](#localsubjectaccessreview-v1beta1)*  | 

### Response

Code         | Description
------------ | -----------
200 <br /> *[LocalSubjectAccessReview](#localsubjectaccessreview-v1beta1)*  | OK




