

-----------
# LabelSelectorRequirement unversioned



Group        | Version     | Kind
------------ | ---------- | -----------
Core | unversioned | LabelSelectorRequirement







A label selector requirement is a selector that contains values, a key, and an operator that relates the key and values.

<aside class="notice">
Appears In <a href="#labelselector-unversioned">LabelSelector</a> </aside>

Field        | Description
------------ | -----------
key <br /> *string*  | key is the label key that the selector applies to.
operator <br /> *string*  | operator represents a key's relationship to a set of values. Valid operators ard In, NotIn, Exists and DoesNotExist.
values <br /> *string array*  | values is an array of string values. If the operator is In or NotIn, the values array must be non-empty. If the operator is Exists or DoesNotExist, the values array must be empty. This array is replaced during a strategic merge patch.






