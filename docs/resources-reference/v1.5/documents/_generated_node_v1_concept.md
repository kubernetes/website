

-----------
# Node v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Node







Node is a worker node in Kubernetes. Each node will have a unique identifier in the cache (i.e. in etcd).

<aside class="notice">
Appears In <a href="#nodelist-v1">NodeList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[NodeSpec](#nodespec-v1)*  | Spec defines the behavior of a node. http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[NodeStatus](#nodestatus-v1)*  | Most recently observed status of the node. Populated by the system. Read-only. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status


### NodeSpec v1

<aside class="notice">
Appears In <a href="#node-v1">Node</a> </aside>

Field        | Description
------------ | -----------
externalID <br /> *string*  | External ID of the node assigned by some machine database (e.g. a cloud provider). Deprecated.
podCIDR <br /> *string*  | PodCIDR represents the pod IP range assigned to the node.
providerID <br /> *string*  | ID of the node assigned by the cloud provider in the format: <ProviderName>://<ProviderSpecificNodeID>
unschedulable <br /> *boolean*  | Unschedulable controls node schedulability of new pods. By default, node is schedulable. More info: http://releases.k8s.io/HEAD/docs/admin/node.md#manual-node-administration"

### NodeStatus v1

<aside class="notice">
Appears In <a href="#node-v1">Node</a> </aside>

Field        | Description
------------ | -----------
addresses <br /> *[NodeAddress](#nodeaddress-v1) array*  | List of addresses reachable to the node. Queried from cloud provider, if available. More info: http://releases.k8s.io/HEAD/docs/admin/node.md#node-addresses
allocatable <br /> *object*  | Allocatable represents the resources of a node that are available for scheduling. Defaults to Capacity.
capacity <br /> *object*  | Capacity represents the total resources of a node. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#capacity for more details.
conditions <br /> *[NodeCondition](#nodecondition-v1) array*  | Conditions is an array of current observed node conditions. More info: http://releases.k8s.io/HEAD/docs/admin/node.md#node-condition
daemonEndpoints <br /> *[NodeDaemonEndpoints](#nodedaemonendpoints-v1)*  | Endpoints of daemons running on the Node.
images <br /> *[ContainerImage](#containerimage-v1) array*  | List of container images on this node
nodeInfo <br /> *[NodeSystemInfo](#nodesysteminfo-v1)*  | Set of ids/uuids to uniquely identify the node. More info: http://releases.k8s.io/HEAD/docs/admin/node.md#node-info
phase <br /> *string*  | NodePhase is the recently observed lifecycle phase of the node. More info: http://releases.k8s.io/HEAD/docs/admin/node.md#node-phase The field is never populated, and now is deprecated.
volumesAttached <br /> *[AttachedVolume](#attachedvolume-v1) array*  | List of volumes that are attached to the node.
volumesInUse <br /> *string array*  | List of attachable volumes in use (mounted) by the node.

### NodeList v1



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[Node](#node-v1) array*  | List of nodes
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds





