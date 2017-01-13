## StatefulSet v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Apps | v1beta1 | StatefulSet

> Example yaml coming soon...



StatefulSet represents a set of pods with consistent identities. Identities are defined as:
 - Network: A single stable DNS and hostname.
 - Storage: As many VolumeClaims as requested.
The StatefulSet guarantees that a given network identity will always map to the same storage identity.

<aside class="notice">
Appears In  <a href="#statefulsetlist-v1beta1">StatefulSetList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | 
spec <br /> *[StatefulSetSpec](#statefulsetspec-v1beta1)* | Spec defines the desired identities of pods in this set.
status <br /> *[StatefulSetStatus](#statefulsetstatus-v1beta1)* | Status is the current status of Pods in this StatefulSet. This data may be out of date by some window of time.

