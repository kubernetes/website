

-----------
# DeploymentCondition v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | DeploymentCondition







DeploymentCondition describes the state of a deployment at a certain point.

<aside class="notice">
Appears In <a href="#deploymentstatus-v1beta1">DeploymentStatus</a> </aside>

Field        | Description
------------ | -----------
lastTransitionTime <br /> *[Time](#time-unversioned)*  | Last time the condition transitioned from one status to another.
lastUpdateTime <br /> *[Time](#time-unversioned)*  | The last time this condition was updated.
message <br /> *string*  | A human readable message indicating details about the transition.
reason <br /> *string*  | The reason for the condition's last transition.
status <br /> *string*  | Status of the condition, one of True, False, Unknown.
type <br /> *string*  | Type of deployment condition.






