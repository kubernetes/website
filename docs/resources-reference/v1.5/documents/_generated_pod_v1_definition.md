## Pod v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Pod



Pod is a collection of containers that can run on a host. This resource is created by clients and scheduled onto hosts.

<aside class="notice">
Appears In  <a href="#podlist-v1">PodList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[PodSpec](#podspec-v1)*  | Specification of the desired behavior of the pod. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[PodStatus](#podstatus-v1)*  | Most recently observed status of the pod. This data may not be up to date. Populated by the system. Read-only. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status

