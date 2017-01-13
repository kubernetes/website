## Node v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Node



Node is a worker node in Kubernetes. Each node will have a unique identifier in the cache (i.e. in etcd).

<aside class="notice">
Appears In  <a href="#nodelist-v1">NodeList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[NodeSpec](#nodespec-v1)*  | Spec defines the behavior of a node. http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[NodeStatus](#nodestatus-v1)*  | Most recently observed status of the node. Populated by the system. Read-only. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status

