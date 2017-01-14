## StatusCause unversioned

Group        | Version     | Kind
------------ | ---------- | -----------
Core | unversioned | StatusCause

> Example yaml coming soon...



StatusCause provides more information about an api.Status failure, including cases when multiple errors are encountered.

<aside class="notice">
Appears In  <a href="#statusdetails-unversioned">StatusDetails</a> </aside>

Field        | Description
------------ | -----------
field <br /> *string* | The field of the resource that has caused this error, as named by its JSON serialization. May include dot and postfix notation for nested attributes. Arrays are zero-indexed.  Fields may appear more than once in an array of causes due to fields having multiple errors. Optional.  Examples:   "name" - the field "name" on the current resource   "items[0].name" - the field "name" on the first array entry in "items"
message <br /> *string* | A human-readable description of the cause of the error.  This field may be presented as-is to a reader.
reason <br /> *string* | A machine-readable description of the cause of the error. If this value is empty there is no information available.

