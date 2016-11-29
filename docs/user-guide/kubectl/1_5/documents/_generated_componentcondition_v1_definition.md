## ComponentCondition v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ComponentCondition

> Example yaml coming soon...



Information about the condition of a component.

<aside class="notice">
Appears In  <a href="#componentstatus-v1">ComponentStatus</a> </aside>

Field        | Description
------------ | -----------
error <br /> *string* | Condition error code for a component. For example, a health check error code.
message <br /> *string* | Message about the condition for a component. For example, information about a health check.
status <br /> *string* | Status of the condition for a component. Valid values for "Healthy": "True", "False", or "Unknown".
type <br /> *string* | Type of condition for a component. Valid value: "Healthy"

