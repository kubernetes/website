

-----------
# SubjectAccessReviewStatus v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | SubjectAccessReviewStatus







SubjectAccessReviewStatus

<aside class="notice">
Appears In <a href="#localsubjectaccessreview-v1beta1">LocalSubjectAccessReview</a> <a href="#selfsubjectaccessreview-v1beta1">SelfSubjectAccessReview</a> <a href="#subjectaccessreview-v1beta1">SubjectAccessReview</a> </aside>

Field        | Description
------------ | -----------
allowed <br /> *boolean*  | Allowed is required.  True if the action would be allowed, false otherwise.
evaluationError <br /> *string*  | EvaluationError is an indication that some error occurred during the authorization check. It is entirely possible to get an error and be able to continue determine authorization status in spite of it. For instance, RBAC can be missing a role, but enough roles are still present and bound to reason about the request.
reason <br /> *string*  | Reason is optional.  It indicates why a request was allowed or denied.






