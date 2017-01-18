## DaemonSetSpec v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | DaemonSetSpec

> Example yaml coming soon...



DaemonSetSpec is the specification of a daemon set.

<aside class="notice">
Appears In  <a href="#daemonset-v1beta1">DaemonSet</a> </aside>

Field        | Description
------------ | -----------
selector <br /> *[LabelSelector](#labelselector-unversioned)* | Selector is a label query over pods that are managed by the daemon set. Must match in order to be controlled. If empty, defaulted to labels on Pod template. More info: http://kubernetes.io/docs/user-guide/labels#label-selectors
template <br /> *[PodTemplateSpec](#podtemplatespec-v1)* | Template is the object that describes the pod that will be created. The DaemonSet will create exactly one copy of this pod on every node that matches the template's node selector (or on every node if no node selector is specified). More info: http://kubernetes.io/docs/user-guide/replication-controller#pod-template

