---
title: Well-Known Labels
content_type: concept
weight: 10
---

Kubernetes reserves all labels in the `kubernetes.io` and `k8s.io` namespaces.

This document serves both as a reference to the values and
as a coordination point for assigning values.

<!--body-->

<!--For docs contributors: please ensure the labels are in alphabeta order.-->

## Well-known labels used on API objects

### addonmanager.kubernetes.io/mode

Example: `addonmanager.kubernetes.io/mode: "Reconcile"`

Used on: All objects

To specify how an add-on should be managed, you can use the `addonmanager.kubernetes.io/mode` label.
This label can have one of three values: `Reconcile`, `EnsureExists`, or `Ignore`.

- `Reconcile`: Addon resources will be periodically reconciled with the expected state.
  If there are any differences, the add-on manager will recreate, reconfigure or delete
  the resources as needed. This is the default mode if no label is specified.
- `EnsureExists`: Addon resources will be checked for existence only but will not be modified
  after creation. The add-on manager will create or re-create the resources when there is
  no instance of the resource with that name.
- `Ignore`: Addon resources will be ignored. This mode is useful for add-ons that are not
  compatible with the add-on manager or that are managed by another controller.

For more details, see [Addon-manager](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/addon-manager/README.md).

### app.kubernetes.io/component

Example: `app.kubernetes.io/component: "database"`

Used on: All Objects

This label is typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/).

The component within the application architecture.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/instance

Example: `app.kubernetes.io/instance: "mysql-abcxyz"`

Used on: All Objects

This label is typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/).

The value is a unique name identifying the instance of an application.
To assign a non-unique name, use [app.kubernetes.io/name](#app-kubernetes-io-name).

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/managed-by

Example: `app.kubernetes.io/managed-by: "helm"`

Used on: All Objects

This label is typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/).

The value is the tool being used to manage the operation of an application.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/name

Example: `app.kubernetes.io/name: "mysql"`

Used on: All Objects

This label is typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/).

The value is the name of the application.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/part-of

Example: `app.kubernetes.io/part-of: "wordpress"`

Used on: All Objects.

This label is typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/).
The value is the name of a higher-level application this object is part of.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### app.kubernetes.io/version

Example: `app.kubernetes.io/version: "5.7.21"`

Used on: All Objects

This label is typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/).
The value is the current version of the application.

Common forms of values include:

- [semantic version](https://semver.org/spec/v1.0.0.html)
- the Git [revision hash](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#_single_revisions)
  for the source code.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).

### applyset.kubernetes.io/id

Stage: Alpha

Example: `applyset.kubernetes.io/id: "applyset-0eFHV8ySqp7XoShsGvyWFQD3s96yqwHmzc4e0HR1dsY-v1"`

Used on: Objects being used as ApplySet parents.

For Kubernetes version {{< skew currentVersion >}}, you can use this label on Secrets, ConfigMaps,
or custom resources if the CustomResourceDefinition
defining them has the `applyset.kubernetes.io/is-parent-type` label.

Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
This label is what makes an object an ApplySet parent object.
Its value is the unique ID of the ApplySet, which is derived from the identity of the parent
object itself. This ID **must** be the base64 encoding (using the URL safe encoding of RFC4648) of
the hash of the group-kind-name-namespace of the object it is on, in the form:
`<base64(sha256(<name>.<namespace>.<kind>.<group>))>`.
There is no relation between the value of this label and object UID.

### applyset.kubernetes.io/is-parent-type

Stage: Alpha

Example: `applyset.kubernetes.io/is-parent-type: "true"`

Used on: Custom Resource Definition (CRD)

Use of this label is Alpha.
Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
You can set this label on a CustomResourceDefinition (CRD) to identify the custom resource type it
defines (not the CRD itself) as an allowed parent for an ApplySet.
The only permitted value for this label is `"true"`; if you want to mark a CRD as
not being a valid parent for ApplySets, omit this label.

### applyset.kubernetes.io/part-of

Stage: Alpha

Example: `applyset.kubernetes.io/part-of: "applyset-0eFHV8ySqp7XoShsGvyWFQD3s96yqwHmzc4e0HR1dsY-v1"`

Used on: All objects.

Use of this label is Alpha.
Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
This label is what makes an object a member of an ApplySet.
The value of the label **must** match the value of the `applyset.kubernetes.io/id`
label on the parent object.

### apps.kubernetes.io/pod-index

Stage: Beta

Example: `apps.kubernetes.io/pod-index: "0"`

Used on: Pod

When a StatefulSet controller creates a Pod for the StatefulSet, it sets this label on that Pod. 
The value of the label is the ordinal index of the pod being created.

See [Pod Index Label](/docs/concepts/workloads/controllers/statefulset/#pod-index-label)
in the StatefulSet topic for more details.
Note the [PodIndexLabel](/docs/reference/command-line-tools-reference/feature-gates/)
feature gate must be enabled for this label to be added to pods.

### batch.kubernetes.io/job-name

Example: `batch.kubernetes.io/job-name: "pi"`

Used on: Job, Pod ojbects controlled by a Job

This label is used as a user-friendly way to get Pods corresponding to a Job.
The `job-name` comes from the `name` of the Job and allows for an easy way to
get Pods corresponding to the Job.

### batch.kubernetes.io/controller-uid

Example: `batch.kubernetes.io/controller-uid: "$UID"`

Used on: Job, Pod objects controlled by a Job

This label is used as a programmatic way to get all Pods corresponding to a Job.  
The `controller-uid` is a unique identifier that gets set in the `selector` field so the Job
controller can get all the corresponding Pods.

### endpointslice.kubernetes.io/managed-by

Example: `endpointslice.kubernetes.io/managed-by: endpointslice-controller.k8s.io`

Used on: EndpointSlices

The label is used to indicate the controller or entity that manages the EndpointSlice.
This label aims to enable different EndpointSlice objects to be managed by
different controllers or entities within the same cluster.

### endpointslice.kubernetes.io/skip-mirror

Example: `endpointslice.kubernetes.io/skip-mirror: "true"`

Used on: Endpoints

The label can be set to `"true"` on an Endpoints resource to indicate that
the EndpointSliceMirroring controller should not mirror this resource with EndpointSlices.

### kubernetes.io/arch

Example: `kubernetes.io/arch: "amd64"`

Used on: Node

The Kubelet populates this with `runtime.GOARCH` as defined by Go.
This can be handy if you are mixing ARM and x86 nodes.

### kubernetes.io/hostname

Example: `kubernetes.io/hostname: "ip-172-20-114-199.ec2.internal"`

Used on: Node

The Kubelet populates this label with the hostname of the node.
Note that the hostname can be changed from the "actual" hostname by
passing the `--hostname-override` flag to the `kubelet`.

This label is also used as part of the topology hierarchy.
See [topology.kubernetes.io/zone](#topologykubernetesiozone) for more information.

### kubernetes.io/legacy-token-invalid-since

Example: `kubernetes.io/legacy-token-invalid-since: 2023-10-27`

Used on: Secret

The control plane automatically adds this label to auto-generated Secrets that
have the type `kubernetes.io/service-account-token`.
This label marks the Secret-based token as invalid for authentication.
The value of this label records the date (ISO 8601 format, UTC time zone)
when the control plane detects that the auto-generated Secret has not been used
for a specified duration (defaults to one year).

### kubernetes.io/legacy-token-last-used

Example: `kubernetes.io/legacy-token-last-used: 2022-10-24`

Used on: Secret

The control plane only adds this label to Secrets that have the type
`kubernetes.io/service-account-token`.
The value of this label records the date (ISO 8601 format, UTC time zone)
when the control plane last saw a request where the client authenticated
using the service account token.

If a legacy token was last used before the cluster gained the feature
(added in Kubernetes v1.26), then the label isn't set.

### kubernetes.io/metadata.name

Example: `kubernetes.io/metadata.name: "mynamespace"`

Used on: Namespace

The Kubernetes API server (part of the {{< glossary_tooltip text="control plane" term_id="control-plane" >}})
sets this label on all namespaces.
The label value is set to the name of the namespace.
You can't change this label's value.

This is useful if you want to target a specific namespace with a label
{{< glossary_tooltip text="selector" term_id="selector" >}}.

### kubernetes.io/os

Example: `kubernetes.io/os: "linux"`

Used on: Node, Pod

For nodes, the kubelet populates this with `runtime.GOOS` as defined by Go.
This can be handy if you are mixing operating systems in your cluster
(for example: mixing Linux and Windows nodes).

You can also set this label on a Pod. Kubernetes allows you to set any value for this label;
if you use this label, you should nevertheless set it to the Go `runtime.GOOS` string
for the operating system that this Pod actually works with.

When the `kubernetes.io/os` label value for a Pod does not match the label value on a Node,
the kubelet on the node will not admit the Pod.
However, this is not taken into account by the kube-scheduler.
Alternatively, the kubelet refuses to run a Pod where you have specified a Pod OS,
if this isn't the same as the operating system for the node where that kubelet is running.
Just look for [Pod OS](/docs/concepts/workloads/pods/#pod-os) for more details.

### kubernetes.io/service-name

Example: `kubernetes.io/service-name: "my-website"`

Used on: EndpointSlice

Kubernetes associates [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/)
with [Service](/docs/concepts/services-networking/service/)s using this label.

This label records the {{< glossary_tooltip term_id="name" text="name">}}
of the Service that the EndpointSlice is backing.
All EndpointSlices should have this label set to the name of their associated Service.

### kube-aggregator.kubernetes.io/automanaged

Example: `kube-aggregator.kubernetes.io/automanaged: "onstart"`

Used on: APIService

The `kube-apiserver` sets this label on any APIService object that
the API server has created automatically.
The label marks how the control plane should manage that APIService.
You should not add, modify, or remove this label by yourself.

{{< note >}}
Automanaged APIService objects are deleted by kube-apiserver when it has no built-in
or custom resource API corresponding to the API group/version of the APIService.
{{< /note >}}

There are two possible values:

- `onstart`: The APIService should be reconciled when an API server starts up, but not otherwise.
- `true`: The API server should reconcile this APIService continuously.

### node.kubernetes.io/exclude-from-external-load-balancers

Example: `node.kubernetes.io/exclude-from-external-load-balancers`

Used on: Node

You can add labels to particular worker nodes to exclude them from the list of
backend servers used by external load balancers.
The following command can be used to exclude a worker node from the list of
backend servers in a backend set:

```shell
kubectl label nodes <node-name> node.kubernetes.io/exclude-from-external-load-balancers=true
```

### node.kubernetes.io/instance-type

Example: `node.kubernetes.io/instance-type: "m3.medium"`

Used on: Node

The Kubelet populates this with the instance type as defined by the cloud provider.
This will be set only if you are using a cloud provider.
This setting is handy if you want to target certain workloads to certain instance types,
but typically you want to rely on the Kubernetes scheduler to perform resource-based scheduling.
You should aim to schedule based on properties rather than on instance types
(for example: require a GPU, instead of requiring a `g2.2xlarge`).

### node.kubernetes.io/windows-build

Example: `node.kubernetes.io/windows-build: "10.0.17763"`

Used on: Node

When the kubelet is running on Microsoft Windows, it automatically labels its Node
to record the version of Windows Server in use.

The label's value is in the format "MajorVersion.MinorVersion.BuildNumber".

### node-role.kubernetes.io/control-plane

Used on: Node

A marker label to indicate that the node is used to run control plane components.
The kubeadm tool applies this label to the control plane nodes that it manages.
Other cluster management tools typically also set this taint.

You can label control plane nodes with this label to make it easier to schedule Pods
only onto these nodes, or to avoid running Pods on the control plane.
If this label is set, the
[EndpointSlice controller](/docs/concepts/services-networking/topology-aware-routing/#implementation-control-plane)
ignores that node while calculating Topology Aware Hints.

### node-role.kubernetes.io/*

Example: `node-role.kubernetes.io/gpu: gpu`

Used on: Node

This optional label is applied to a node when you want to mark a node role. 
The node role (text following `/` in the label key) can be set,
as long as the overall key follows the
[syntax](/docs/concepts/overview/working-with-objects/labels/#syntax-and-character-set)
rules for object labels.

Kubernetes defines one specific node role, **control-plane**.
A label you can use to mark that node role is
[`node-role.kubernetes.io/control-plane`](#node-role-kubernetes-io-control-plane).

### pod-security.kubernetes.io/audit

Example: `pod-security.kubernetes.io/audit: "baseline"`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels.
Specifically, the `audit` label does not prevent the creation of a Pod in the labeled
Namespace which does not meet the requirements outlined in the indicated level,
but adds this label to the Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.

### pod-security.kubernetes.io/audit-version

Example: `pod-security.kubernetes.io/audit-version: "{{< skew currentVersion >}}"`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<major>.<minor>`.
This determines the version of the
[Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.

### pod-security.kubernetes.io/enforce

Example: `pod-security.kubernetes.io/enforce: "baseline"`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels.
Specifically, the `enforce` label _prohibits_ the creation of any Pod in the labeled
Namespace which does not meet the requirements outlined in the indicated level.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.

### pod-security.kubernetes.io/enforce-version

Example: `pod-security.kubernetes.io/enforce-version: "{{< skew currentVersion >}}"`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<major>.<minor>`.
This determines the version of the
[Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.

### pod-security.kubernetes.io/warn

Example: `pod-security.kubernetes.io/warn: "baseline"`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels.
Specifically, the `warn` label does not prevent the creation of a Pod in the labeled
Namespace which does not meet the requirements outlined in the indicated level,
but returns a warning to the user after doing so.
Note that warnings are also displayed when creating or updating objects that contain
Pod templates, such as Deployments, Job, StatefulSets, etc.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.

### pod-security.kubernetes.io/warn-version

Example: `pod-security.kubernetes.io/warn-version: "{{< skew currentVersion >}}"`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<major>.<minor>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a submitted Pod.
Note that warnings are also displayed when creating or updating objects that contain
Pod templates, such as Deployments, Job, StatefulSets, etc.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.

### statefulset.kubernetes.io/pod-name

Example: `statefulset.kubernetes.io/pod-name: "mystatefulset-7"`

Used on: Pod

When a StatefulSet controller creates a Pod for the StatefulSet,
the control plane sets this label on that Pod.
The value of the label is the name of the Pod being created.

See [Pod Name Label](/docs/concepts/workloads/controllers/statefulset/#pod-name-label)
in the StatefulSet topic for more details.

### service.kubernetes.io/headless

Example: `service.kubernetes.io/headless: ""`

Used on: Endpoints

The control plane adds this label to an Endpoints object
when the owning Service is headless.
To learn more, read
[Headless Services](/docs/concepts/services-networking/service/#headless-services).

### service.kubernetes.io/service-proxy-name

Example: `service.kubernetes.io/service-proxy-name: "foo-bar"`

Used on: Service

The kube-proxy has this label for custom proxy, which delegates
Service control to custom proxy.

### topology.kubernetes.io/region

Example: `topology.kubernetes.io/region: "us-east-1"`

Used on: Node, PersistentVolume

See [topology.kubernetes.io/zone](#topology-kubernetes-io-zone).

### topology.kubernetes.io/zone

Example: `topology.kubernetes.io/zone: "us-east-1c"`

Used on: Node, PersistentVolume

**On Node**: The `kubelet` or the external `cloud-controller-manager` populates this
with the information from the cloud provider.
This will be set only if you are using a cloud provider.
However, you can consider setting this on nodes if it makes sense in your topology.

**On PersistentVolume**: topology-aware volume provisioners will automatically set
node affinity constraints on a `PersistentVolume`.

A zone represents a logical failure domain.
It is common for Kubernetes clusters to span multiple zones for increased availability.
While the exact definition of a zone is left to infrastructure implementations,
common properties of a zone include very low network latency within a zone,
no-cost network traffic within a zone, and failure independence from other zones.
For example, nodes within a zone might share a network switch, but nodes in different
zones should not.

A region represents a larger domain, made up of one or more zones.
It is uncommon for Kubernetes clusters to span multiple regions,
While the exact definition of a zone or region is left to infrastructure implementations,
common properties of a region include higher network latency between them than within them,
non-zero cost for network traffic between them, and failure independence from other zones or regions.
For example, nodes within a region might share power infrastructure (e.g. a UPS or generator),
but nodes in different regions typically would not.

Kubernetes makes a few assumptions about the structure of zones and regions:

1. regions and zones are hierarchical: zones are strict subsets of regions and
   no zone can be in 2 regions
1. zone names are unique across regions; for example region "africa-east-1" might be comprised
   of zones "africa-east-1a" and "africa-east-1b"

It should be safe to assume that topology labels do not change.
Even though labels are strictly mutable, consumers of them can assume that a given node
is not going to be moved between zones without being destroyed and recreated.

Kubernetes can use this information in various ways.
For example, the scheduler automatically tries to spread the Pods in a ReplicaSet across nodes
in a single-zone cluster (to reduce the impact of node failures, see
[kubernetes.io/hostname](#kubernetes-io-hostname)).
With multiple-zone clusters, this spreading behavior also applies to zones
(to reduce the impact of zone failures).
This is achieved via _SelectorSpreadPriority_.

_SelectorSpreadPriority_ is a best effort placement.
If the zones in your cluster are heterogeneous (for example: different numbers of nodes,
different types of nodes, or different pod resource requirements),
this placement might prevent equal spreading of your Pods across zones.
If desired, you can use homogeneous zones (same number and types of nodes)
to reduce the probability of unequal spreading.

The scheduler (through the _VolumeZonePredicate_ predicate) also will ensure that Pods,
that claim a given volume, are only placed into the same zone as that volume.
Volumes cannot be attached across zones.

If `PersistentVolumeLabel` does not support automatic labeling of your PersistentVolumes,
you should consider adding the labels manually (or adding support for `PersistentVolumeLabel`).
With `PersistentVolumeLabel`, the scheduler prevents Pods from mounting volumes in a different zone.
If your infrastructure doesn't have this constraint, you don't need to add the zone labels to the volumes at all.

## Deprecated labels

### app.kubernetes.io/created-by

Example: `app.kubernetes.io/created-by: "controller-manager"`

Used on: All Objects

This label is typically used on
[workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The value is the controller/user who created this resource.

{{< note >}}
Starting from v1.9, this label is deprecated.
{{< /note >}}

### beta.kubernetes.io/arch

Used On: Node

This label has been deprecated. Please use
[`kubernetes.io/arch`](#kubernetes-io-arch) instead.

### beta.kubernetes.io/os

Used On: Node

This label has been deprecated. Please use
[`kubernetes.io/os`](#kubernetes-io-os) instead.

### beta.kubernetes.io/instance-type

Used on: Node

{{< note >}}
Starting in v1.17, this label is deprecated in favor of
[node.kubernetes.io/instance-type](#node-kubernetes-io-instance-type).
{{< /note >}}

### controller-uid

Example: `controller-uid: "$UID"`

Used on: Job and Pods controlled by Job

{{< note >}}
Starting from Kubernetes 1.27, this label is deprecated.
Kubernetes 1.27 and newer ignore this label and use the prefixed `controller-uid` label.
{{< /note >}}

### failure-domain.beta.kubernetes.io/region

Used on: Node

{{< note >}}
Starting in v1.17, this label is deprecated in favor of
[topology.kubernetes.io/region](#topology-kubernetes-io-region).
{{< /note >}}

### failure-domain.beta.kubernetes.io/zone

Used on: Node

{{< note >}}
Starting in v1.17, this label is deprecated in favor of
[topology.kubernetes.io/zone](#topology-kubernetes-io-zone).
{{< /note >}}

### job-name

Example: `job-name: "pi"`

Used on: Job and Pods controlled by Job

{{< note >}}
Starting from Kubernetes 1.27, this label is deprecated.
Kubernetes 1.27 and newer ignore this label and use the prefixed `job-name` label.
{{< /note >}}

### kubernetes.io/cluster-service

Example: `kubernetes.io/cluster-service: "true"`

Used on: Service

This label indicates that the Service provides a service to the cluster,
if the value is set to true.
When you run `kubectl cluster-info`, the tool queries for Services with this label set to true.

