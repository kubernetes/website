## DaemonSet v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Extensions | v1beta1 | DaemonSet



DaemonSet represents the configuration of a daemon set.

<aside class="notice">
Appears In  <a href="#daemonsetlist-v1beta1">DaemonSetList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[DaemonSetSpec](#daemonsetspec-v1beta1)*  | Spec defines the desired behavior of this daemon set. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[DaemonSetStatus](#daemonsetstatus-v1beta1)*  | Status is the current status of this daemon set. This data may be out of date by some window of time. Populated by the system. Read-only. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status

