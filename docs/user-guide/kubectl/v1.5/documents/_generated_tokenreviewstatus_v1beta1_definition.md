## TokenReviewStatus v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | TokenReviewStatus

> Example yaml coming soon...



TokenReviewStatus is the result of the token authentication request.

<aside class="notice">
Appears In  <a href="#tokenreview-v1beta1">TokenReview</a> </aside>

Field        | Description
------------ | -----------
authenticated <br /> *boolean* | Authenticated indicates that the token was associated with a known user.
error <br /> *string* | Error indicates that the token couldn't be checked
user <br /> *[UserInfo](#userinfo-v1beta1)* | User is the UserInfo associated with the provided token.

