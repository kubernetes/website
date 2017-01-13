## SubjectAccessReview v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Authorization | v1beta1 | SubjectAccessReview

> Example yaml coming soon...



SubjectAccessReview checks whether or not a user or group can perform an action.



Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | 
spec <br /> *[SubjectAccessReviewSpec](#subjectaccessreviewspec-v1beta1)* | Spec holds information about the request being evaluated
status <br /> *[SubjectAccessReviewStatus](#subjectaccessreviewstatus-v1beta1)* | Status is filled in by the server and indicates whether the request is allowed or not

