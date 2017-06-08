

-----------
# SelfSubjectAccessReview v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | SelfSubjectAccessReview







SelfSubjectAccessReview checks whether or the current user can perform an action.  Not filling in a spec.namespace means "in all namespaces".  Self is a special case, because users should always be able to check whether they can perform an action



Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | 
spec <br /> *[SelfSubjectAccessReviewSpec](#selfsubjectaccessreviewspec-v1beta1)*  | Spec holds information about the request being evaluated.  user and groups must be empty
status <br /> *[SubjectAccessReviewStatus](#subjectaccessreviewstatus-v1beta1)*  | Status is filled in by the server and indicates whether the request is allowed or not


### SelfSubjectAccessReviewSpec v1beta1

<aside class="notice">
Appears In <a href="#selfsubjectaccessreview-v1beta1">SelfSubjectAccessReview</a> </aside>

Field        | Description
------------ | -----------
nonResourceAttributes <br /> *[NonResourceAttributes](#nonresourceattributes-v1beta1)*  | NonResourceAttributes describes information for a non-resource access request
resourceAttributes <br /> *[ResourceAttributes](#resourceattributes-v1beta1)*  | ResourceAuthorizationAttributes describes information for a resource access request





