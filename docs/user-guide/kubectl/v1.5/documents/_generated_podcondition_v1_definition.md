## PodCondition v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PodCondition

> Example yaml coming soon...



PodCondition contains details for the current condition of this pod.

<aside class="notice">
Appears In  <a href="#podstatus-v1">PodStatus</a> </aside>

Field        | Description
------------ | -----------
lastProbeTime <br /> *[Time](#time-unversioned)* | Last time we probed the condition.
lastTransitionTime <br /> *[Time](#time-unversioned)* | Last time the condition transitioned from one status to another.
message <br /> *string* | Human-readable message indicating details about last transition.
reason <br /> *string* | Unique, one-word, CamelCase reason for the condition's last transition.
status <br /> *string* | Status is the status of the condition. Can be True, False, Unknown. More info: http://kubernetes.io/docs/user-guide/pod-states#pod-conditions
type <br /> *string* | Type is the type of the condition. Currently only Ready. More info: http://kubernetes.io/docs/user-guide/pod-states#pod-conditions

