

-----------
# TokenReview v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | TokenReview







TokenReview attempts to authenticate a token to a known user. Note: TokenReview requests may be cached by the webhook token authenticator plugin in the kube-apiserver.



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | 
spec <br /> *[TokenReviewSpec](#tokenreviewspec-v1beta1)*  | Spec holds information about the request being evaluated
status <br /> *[TokenReviewStatus](#tokenreviewstatus-v1beta1)*  | Status is filled in by the server and indicates whether the request can be authenticated.


### TokenReviewSpec v1beta1

<aside class="notice">
Appears In <a href="#tokenreview-v1beta1">TokenReview</a> </aside>

Field        | Description
------------ | -----------
token <br /> *string*  | Token is the opaque bearer token.

### TokenReviewStatus v1beta1

<aside class="notice">
Appears In <a href="#tokenreview-v1beta1">TokenReview</a> </aside>

Field        | Description
------------ | -----------
authenticated <br /> *boolean*  | Authenticated indicates that the token was associated with a known user.
error <br /> *string*  | Error indicates that the token couldn't be checked
user <br /> *[UserInfo](#userinfo-v1beta1)*  | User is the UserInfo associated with the provided token.





