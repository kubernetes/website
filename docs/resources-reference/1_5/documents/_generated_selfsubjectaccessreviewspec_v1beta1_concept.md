

-----------
# SelfSubjectAccessReviewSpec v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | SelfSubjectAccessReviewSpec







SelfSubjectAccessReviewSpec is a description of the access request.  Exactly one of ResourceAuthorizationAttributes and NonResourceAuthorizationAttributes must be set

<aside class="notice">
Appears In <a href="#selfsubjectaccessreview-v1beta1">SelfSubjectAccessReview</a> </aside>

Field        | Description
------------ | -----------
nonResourceAttributes <br /> *[NonResourceAttributes](#nonresourceattributes-v1beta1)*  | NonResourceAttributes describes information for a non-resource access request
resourceAttributes <br /> *[ResourceAttributes](#resourceattributes-v1beta1)*  | ResourceAuthorizationAttributes describes information for a resource access request






