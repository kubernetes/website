## SelfSubjectAccessReview v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | SelfSubjectAccessReview



SelfSubjectAccessReview checks whether or the current user can perform an action.  Not filling in a spec.namespace means "in all namespaces".  Self is a special case, because users should always be able to check whether they can perform an action



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | 
spec <br /> *[SelfSubjectAccessReviewSpec](#selfsubjectaccessreviewspec-v1beta1)*  | Spec holds information about the request being evaluated.  user and groups must be empty
status <br /> *[SubjectAccessReviewStatus](#subjectaccessreviewstatus-v1beta1)*  | Status is filled in by the server and indicates whether the request is allowed or not

