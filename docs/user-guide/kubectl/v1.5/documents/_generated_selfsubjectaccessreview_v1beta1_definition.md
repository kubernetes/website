## SelfSubjectAccessReview v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Authorization | v1beta1 | SelfSubjectAccessReview

> Example yaml coming soon...



SelfSubjectAccessReview checks whether or the current user can perform an action.  Not filling in a spec.namespace means "in all namespaces".  Self is a special case, because users should always be able to check whether they can perform an action



Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | 
spec <br /> *[SelfSubjectAccessReviewSpec](#selfsubjectaccessreviewspec-v1beta1)* | Spec holds information about the request being evaluated.  user and groups must be empty
status <br /> *[SubjectAccessReviewStatus](#subjectaccessreviewstatus-v1beta1)* | Status is filled in by the server and indicates whether the request is allowed or not

