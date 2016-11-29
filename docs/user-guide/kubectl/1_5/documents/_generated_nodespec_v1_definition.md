## NodeSpec v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | NodeSpec

> Example yaml coming soon...



NodeSpec describes the attributes that a node is created with.

<aside class="notice">
Appears In  <a href="#node-v1">Node</a> </aside>

Field        | Description
------------ | -----------
externalID <br /> *string* | External ID of the node assigned by some machine database (e.g. a cloud provider). Deprecated.
podCIDR <br /> *string* | PodCIDR represents the pod IP range assigned to the node.
providerID <br /> *string* | ID of the node assigned by the cloud provider in the format: <ProviderName>://<ProviderSpecificNodeID>
unschedulable <br /> *boolean* | Unschedulable controls node schedulability of new pods. By default, node is schedulable. More info: http://releases.k8s.io/HEAD/docs/admin/node.md#manual-node-administration"`

