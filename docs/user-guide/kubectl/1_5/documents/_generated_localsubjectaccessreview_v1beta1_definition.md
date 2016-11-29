## LocalSubjectAccessReview v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Authorization | v1beta1 | LocalSubjectAccessReview

> Example yaml coming soon...



LocalSubjectAccessReview checks whether or not a user or group can perform an action in a given namespace. Having a namespace scoped resource makes it much easier to grant namespace scoped policy that includes permissions checking.



Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | 
spec <br /> *[SubjectAccessReviewSpec](#subjectaccessreviewspec-v1beta1)* | Spec holds information about the request being evaluated.  spec.namespace must be equal to the namespace you made the request against.  If empty, it is defaulted.
status <br /> *[SubjectAccessReviewStatus](#subjectaccessreviewstatus-v1beta1)* | Status is filled in by the server and indicates whether the request is allowed or not

