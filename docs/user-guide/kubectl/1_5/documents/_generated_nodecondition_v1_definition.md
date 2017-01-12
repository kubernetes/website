## NodeCondition v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | NodeCondition

> Example yaml coming soon...



NodeCondition contains condition information for a node.

<aside class="notice">
Appears In  <a href="#nodestatus-v1">NodeStatus</a> </aside>

Field        | Description
------------ | -----------
lastHeartbeatTime <br /> *[Time](#time-unversioned)* | Last time we got an update on a given condition.
lastTransitionTime <br /> *[Time](#time-unversioned)* | Last time the condition transit from one status to another.
message <br /> *string* | Human readable message indicating details about last transition.
reason <br /> *string* | (brief) reason for the condition's last transition.
status <br /> *string* | Status of the condition, one of True, False, Unknown.
type <br /> *string* | Type of node condition.

