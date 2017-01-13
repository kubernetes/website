

-----------
# PodTemplate v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PodTemplate







PodTemplate describes a template for creating copies of a predefined pod.

<aside class="notice">
Appears In <a href="#podtemplatelist-v1">PodTemplateList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
template <br /> *[PodTemplateSpec](#podtemplatespec-v1)*  | Template defines the pods that will be created from this pod template. http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status


### PodTemplateSpec v1

<aside class="notice">
Appears In <a href="#daemonsetspec-v1beta1">DaemonSetSpec</a> <a href="#deploymentspec-v1beta1">DeploymentSpec</a> <a href="#jobspec-v1">JobSpec</a> <a href="#podtemplate-v1">PodTemplate</a> <a href="#replicasetspec-v1beta1">ReplicaSetSpec</a> <a href="#replicationcontrollerspec-v1">ReplicationControllerSpec</a> <a href="#statefulsetspec-v1beta1">StatefulSetSpec</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[PodSpec](#podspec-v1)*  | Specification of the desired behavior of the pod. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status

### PodTemplateList v1



Field        | Description
------------ | -----------
items <br /> *[PodTemplate](#podtemplate-v1) array*  | List of pod templates
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds





