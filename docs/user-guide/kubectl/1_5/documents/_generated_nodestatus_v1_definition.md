## NodeStatus v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | NodeStatus

> Example yaml coming soon...



NodeStatus is information about the current status of a node.

<aside class="notice">
Appears In  <a href="#node-v1">Node</a> </aside>

Field        | Description
------------ | -----------
addresses <br /> *[NodeAddress](#nodeaddress-v1) array* | List of addresses reachable to the node. Queried from cloud provider, if available. More info: http://releases.k8s.io/HEAD/docs/admin/node.md#node-addresses
allocatable <br /> *object* | Allocatable represents the resources of a node that are available for scheduling. Defaults to Capacity.
capacity <br /> *object* | Capacity represents the total resources of a node. More info: http://kubernetes.io/docs/user-guide/persistent-volumes#capacity for more details.
conditions <br /> *[NodeCondition](#nodecondition-v1) array* | Conditions is an array of current observed node conditions. More info: http://releases.k8s.io/HEAD/docs/admin/node.md#node-condition
daemonEndpoints <br /> *[NodeDaemonEndpoints](#nodedaemonendpoints-v1)* | Endpoints of daemons running on the Node.
images <br /> *[ContainerImage](#containerimage-v1) array* | List of container images on this node
nodeInfo <br /> *[NodeSystemInfo](#nodesysteminfo-v1)* | Set of ids/uuids to uniquely identify the node. More info: http://releases.k8s.io/HEAD/docs/admin/node.md#node-info
phase <br /> *string* | NodePhase is the recently observed lifecycle phase of the node. More info: http://releases.k8s.io/HEAD/docs/admin/node.md#node-phase The field is never populated, and now is deprecated.
volumesAttached <br /> *[AttachedVolume](#attachedvolume-v1) array* | List of volumes that are attached to the node.
volumesInUse <br /> *string array* | List of attachable volumes in use (mounted) by the node.

