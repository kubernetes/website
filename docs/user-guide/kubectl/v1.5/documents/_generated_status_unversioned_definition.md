## Status unversioned

Group        | Version     | Kind
------------ | ---------- | -----------
Core | unversioned | Status

> Example yaml coming soon...



Status is a return value for calls that don't return other objects.



Field        | Description
------------ | -----------
code <br /> *integer* | Suggested HTTP return code for this status, 0 if not set.
details <br /> *[StatusDetails](#statusdetails-unversioned)* | Extended data associated with the reason.  Each reason may define its own extended details. This field is optional and the data returned is not guaranteed to conform to any schema except that defined by the reason type.
message <br /> *string* | A human-readable description of the status of this operation.
metadata <br /> *[ListMeta](#listmeta-unversioned)* | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
reason <br /> *string* | A machine-readable description of why this operation is in the "Failure" status. If this value is empty there is no information available. A Reason clarifies an HTTP status code but does not override it.
status <br /> *string* | Status of the operation. One of: "Success" or "Failure". More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status

