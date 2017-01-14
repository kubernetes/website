## TokenReview v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Authentication | v1beta1 | TokenReview

> Example yaml coming soon...



TokenReview attempts to authenticate a token to a known user. Note: TokenReview requests may be cached by the webhook token authenticator plugin in the kube-apiserver.



Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | 
spec <br /> *[TokenReviewSpec](#tokenreviewspec-v1beta1)* | Spec holds information about the request being evaluated
status <br /> *[TokenReviewStatus](#tokenreviewstatus-v1beta1)* | Status is filled in by the server and indicates whether the request can be authenticated.

