

-----------
# StatusDetails unversioned



Group        | Version     | Kind
------------ | ---------- | -----------
Core | unversioned | StatusDetails







StatusDetails is a set of additional properties that MAY be set by the server to provide additional information about a response. The Reason field of a Status object defines what attributes will be set. Clients must ignore fields that do not match the defined type of each attribute, and should assume that any attribute may be empty, invalid, or under defined.

<aside class="notice">
Appears In <a href="#status-unversioned">Status</a> </aside>

Field        | Description
------------ | -----------
causes <br /> *[StatusCause](#statuscause-unversioned) array*  | The Causes array includes more details associated with the StatusReason failure. Not all StatusReasons may provide detailed causes.
group <br /> *string*  | The group attribute of the resource associated with the status StatusReason.
kind <br /> *string*  | The kind attribute of the resource associated with the status StatusReason. On some operations may differ from the requested resource Kind. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
name <br /> *string*  | The name attribute of the resource associated with the status StatusReason (when there is a single name which can be described).
retryAfterSeconds <br /> *integer*  | If specified, the time in seconds before the operation should be retried.






