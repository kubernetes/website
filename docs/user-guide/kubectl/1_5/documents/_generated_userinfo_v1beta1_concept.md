

-----------
# UserInfo v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | UserInfo







UserInfo holds the information about the user needed to implement the user.Info interface.

<aside class="notice">
Appears In <a href="#tokenreviewstatus-v1beta1">TokenReviewStatus</a> </aside>

Field        | Description
------------ | -----------
extra <br /> *object*  | Any additional information provided by the authenticator.
groups <br /> *string array*  | The names of groups this user is a part of.
uid <br /> *string*  | A unique value that identifies this user across time. If this user is deleted and another user by the same name is added, they will have different UIDs.
username <br /> *string*  | The name that uniquely identifies this user among all active users.






