## Node v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Node

> Example yaml coming soon...



Node is a worker node in Kubernetes. Each node will have a unique identifier in the cache (i.e. in etcd).

<aside class="notice">
Appears In  <a href="#nodelist-v1">NodeList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[NodeSpec](#nodespec-v1)* | Spec defines the behavior of a node. http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[NodeStatus](#nodestatus-v1)* | Most recently observed status of the node. Populated by the system. Read-only. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status

