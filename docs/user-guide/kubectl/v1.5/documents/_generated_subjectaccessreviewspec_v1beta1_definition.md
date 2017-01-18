## SubjectAccessReviewSpec v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | SubjectAccessReviewSpec

> Example yaml coming soon...



SubjectAccessReviewSpec is a description of the access request.  Exactly one of ResourceAuthorizationAttributes and NonResourceAuthorizationAttributes must be set

<aside class="notice">
Appears In  <a href="#localsubjectaccessreview-v1beta1">LocalSubjectAccessReview</a>  <a href="#subjectaccessreview-v1beta1">SubjectAccessReview</a> </aside>

Field        | Description
------------ | -----------
extra <br /> *object* | Extra corresponds to the user.Info.GetExtra() method from the authenticator.  Since that is input to the authorizer it needs a reflection here.
group <br /> *string array* | Groups is the groups you're testing for.
nonResourceAttributes <br /> *[NonResourceAttributes](#nonresourceattributes-v1beta1)* | NonResourceAttributes describes information for a non-resource access request
resourceAttributes <br /> *[ResourceAttributes](#resourceattributes-v1beta1)* | ResourceAuthorizationAttributes describes information for a resource access request
user <br /> *string* | User is the user you're testing for. If you specify "User" but not "Group", then is it interpreted as "What if User were not a member of any groups

