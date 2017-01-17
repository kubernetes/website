## JobCondition v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | JobCondition

> Example yaml coming soon...

<aside class="notice">Other api versions of this object exist: <a href="#jobcondition-v1">v1</a> </aside>

JobCondition describes current state of a job.

<aside class="notice">
Appears In  <a href="#jobstatus-v1beta1">JobStatus</a> </aside>

Field        | Description
------------ | -----------
lastProbeTime <br /> *[Time](#time-unversioned)* | Last time the condition was checked.
lastTransitionTime <br /> *[Time](#time-unversioned)* | Last time the condition transit from one status to another.
message <br /> *string* | Human readable message indicating details about last transition.
reason <br /> *string* | (brief) reason for the condition's last transition.
status <br /> *string* | Status of the condition, one of True, False, Unknown.
type <br /> *string* | Type of job condition, Complete or Failed.

