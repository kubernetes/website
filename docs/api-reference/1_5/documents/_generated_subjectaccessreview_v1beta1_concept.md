

-----------
# SubjectAccessReview v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Authorization | v1beta1 | SubjectAccessReview







SubjectAccessReview checks whether or not a user or group can perform an action.



Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | 
spec <br /> *[SubjectAccessReviewSpec](#subjectaccessreviewspec-v1beta1)*  | Spec holds information about the request being evaluated
status <br /> *[SubjectAccessReviewStatus](#subjectaccessreviewstatus-v1beta1)*  | Status is filled in by the server and indicates whether the request is allowed or not


### SubjectAccessReviewSpec v1beta1

<aside class="notice">
Appears In <a href="#localsubjectaccessreview-v1beta1">LocalSubjectAccessReview</a> <a href="#subjectaccessreview-v1beta1">SubjectAccessReview</a> </aside>

Field        | Description
------------ | -----------
extra <br /> *object*  | Extra corresponds to the user.Info.GetExtra() method from the authenticator.  Since that is input to the authorizer it needs a reflection here.
group <br /> *string array*  | Groups is the groups you're testing for.
nonResourceAttributes <br /> *[NonResourceAttributes](#nonresourceattributes-v1beta1)*  | NonResourceAttributes describes information for a non-resource access request
resourceAttributes <br /> *[ResourceAttributes](#resourceattributes-v1beta1)*  | ResourceAuthorizationAttributes describes information for a resource access request
user <br /> *string*  | User is the user you're testing for. If you specify "User" but not "Group", then is it interpreted as "What if User were not a member of any groups

### SubjectAccessReviewStatus v1beta1

<aside class="notice">
Appears In <a href="#localsubjectaccessreview-v1beta1">LocalSubjectAccessReview</a> <a href="#selfsubjectaccessreview-v1beta1">SelfSubjectAccessReview</a> <a href="#subjectaccessreview-v1beta1">SubjectAccessReview</a> </aside>

Field        | Description
------------ | -----------
allowed <br /> *boolean*  | Allowed is required.  True if the action would be allowed, false otherwise.
evaluationError <br /> *string*  | EvaluationError is an indication that some error occurred during the authorization check. It is entirely possible to get an error and be able to continue determine authorization status in spite of it. For instance, RBAC can be missing a role, but enough roles are still present and bound to reason about the request.
reason <br /> *string*  | Reason is optional.  It indicates why a request was allowed or denied.




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



create a SubjectAccessReview

### HTTP Request

`POST /apis/authorization.k8s.io/v1beta1/subjectaccessreviews`

### Path Parameters

Parameter    | Description
------------ | -----------
body <br /> *[SubjectAccessReview](#subjectaccessreview-v1beta1)*  | 
pretty  | If 'true', then the output is pretty printed.


### Response

Code         | Description
------------ | -----------
200 <br /> *[SubjectAccessReview](#subjectaccessreview-v1beta1)*  | OK




