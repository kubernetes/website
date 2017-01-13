## Event v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Event

<aside class="notice">Other api versions of this object exist: <a href="#event-versioned">versioned</a> </aside>

Event is a report of an event somewhere in the cluster.

<aside class="notice">
Appears In  <a href="#eventlist-v1">EventList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
count <br /> *integer*  | The number of times this event has occurred.
firstTimestamp <br /> *[Time](#time-unversioned)*  | The time at which the event was first recorded. (Time of server receipt is in TypeMeta.)
involvedObject <br /> *[ObjectReference](#objectreference-v1)*  | The object that this event is about.
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
lastTimestamp <br /> *[Time](#time-unversioned)*  | The time at which the most recent occurrence of this event was recorded.
message <br /> *string*  | A human-readable description of the status of this operation.
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
reason <br /> *string*  | This should be a short, machine understandable string that gives the reason for the transition into the object's current status.
source <br /> *[EventSource](#eventsource-v1)*  | The component reporting this event. Should be a short machine understandable string.
type <br /> *string*  | Type of this event (Normal, Warning), new types could be added in the future

