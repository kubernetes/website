## LabelSelector unversioned

Group        | Version     | Kind
------------ | ---------- | -----------
Core | unversioned | LabelSelector

> Example yaml coming soon...



A label selector is a label query over a set of resources. The result of matchLabels and matchExpressions are ANDed. An empty label selector matches all objects. A null label selector matches no objects.

<aside class="notice">
Appears In  <a href="#daemonsetspec-v1beta1">DaemonSetSpec</a>  <a href="#deploymentspec-v1beta1">DeploymentSpec</a>  <a href="#jobspec-v1">JobSpec</a>  <a href="#networkpolicypeer-v1beta1">NetworkPolicyPeer</a>  <a href="#networkpolicyspec-v1beta1">NetworkPolicySpec</a>  <a href="#persistentvolumeclaimspec-v1">PersistentVolumeClaimSpec</a>  <a href="#poddisruptionbudgetspec-v1beta1">PodDisruptionBudgetSpec</a>  <a href="#replicasetspec-v1beta1">ReplicaSetSpec</a>  <a href="#statefulsetspec-v1beta1">StatefulSetSpec</a> </aside>

Field        | Description
------------ | -----------
matchExpressions <br /> *[LabelSelectorRequirement](#labelselectorrequirement-unversioned) array* | matchExpressions is a list of label selector requirements. The requirements are ANDed.
matchLabels <br /> *object* | matchLabels is a map of {key,value} pairs. A single {key,value} in the matchLabels map is equivalent to an element of matchExpressions, whose key field is "key", the operator is "In", and the values array contains only "value". The requirements are ANDed.

