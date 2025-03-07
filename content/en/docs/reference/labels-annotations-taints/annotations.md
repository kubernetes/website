---
title: Well-Known Annotations
content_type: concept
weight: 20
---

Kubernetes reserves all annotations in the `kubernetes.io` and `k8s.io` namespaces.

This document serves both as a reference to the values and as a coordination point for assigning values.

## Well-known annotations used on API objects

### alpha.kubernetes.io/provided-node-ip

Example: `alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

Used on: Node

Stage: Alpha

The kubelet can set this annotation on a Node to denote its configured IPv4 and/or IPv6 address.

When kubelet is started with the `--cloud-provider` flag set to any value (includes both external
and legacy in-tree cloud providers), it sets this annotation on the Node to denote an IP address
set from the command line flag (`--node-ip`). This IP is verified with the cloud provider as valid
by the cloud-controller-manager.

### apf.kubernetes.io/autoupdate-spec

Example: `apf.kubernetes.io/autoupdate-spec: "true"`

Used on: FlowSchema, PriorityLevelConfiguration

If this annotation is set to true on a FlowSchema or PriorityLevelConfiguration, the `spec` for that object
is managed by the kube-apiserver. If the API server does not recognize an APF object, and you annotate it
for automatic update, the API server deletes the entire object. Otherwise, the API server does not manage the
object spec.
For more details, read  [Maintenance of the Mandatory and Suggested Configuration Objects](/docs/concepts/cluster-administration/flow-control/#maintenance-of-the-mandatory-and-suggested-configuration-objects).

### applyset.kubernetes.io/additional-namespaces

Example: `applyset.kubernetes.io/additional-namespaces: "namespace1,namespace2"`

Used on: Objects being used as ApplySet parents.

Use of this annotation is Alpha.
For Kubernetes version {{< skew currentVersion >}}, you can use this annotation on Secrets,
ConfigMaps, or custom resources if the
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
defining them has the `applyset.kubernetes.io/is-parent-type` label.

Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
This annotation is applied to the parent object used to track an ApplySet to extend the scope of
the ApplySet beyond the parent object's own namespace (if any).
The value is a comma-separated list of the names of namespaces other than the parent's namespace
in which objects are found.

### applyset.kubernetes.io/contains-group-kinds

Example: `applyset.kubernetes.io/contains-group-kinds: "certificates.cert-manager.io,configmaps,deployments.apps,secrets,services"`

Used on: Objects being used as ApplySet parents.

Use of this annotation is Alpha.
For Kubernetes version {{< skew currentVersion >}}, you can use this annotation on Secrets, ConfigMaps,
or custom resources if the CustomResourceDefinition
defining them has the `applyset.kubernetes.io/is-parent-type` label.

Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
This annotation is applied to the parent object used to track an ApplySet to optimize listing of
ApplySet member objects. It is optional in the ApplySet specification, as tools can perform discovery
or use a different optimization. However, as of Kubernetes version {{< skew currentVersion >}},
it is required by kubectl. When present, the value of this annotation must be a comma separated list
of the group-kinds, in the fully-qualified name format, i.e. `<resource>.<group>`.

### applyset.kubernetes.io/tooling

Example: `applyset.kubernetes.io/tooling: "kubectl/v{{< skew currentVersion >}}"`

Used on: Objects being used as ApplySet parents.

Use of this annotation is Alpha.
For Kubernetes version {{< skew currentVersion >}}, you can use this annotation on Secrets,
ConfigMaps, or custom resources if the CustomResourceDefinitiondefining them has the
`applyset.kubernetes.io/is-parent-type` label.

Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
This annotation is applied to the parent object used to track an ApplySet to indicate which
tooling manages that ApplySet. Tooling should refuse to mutate ApplySets belonging to other tools.
The value must be in the format `<toolname>/<semver>`.

### batch.kubernetes.io/job-completion-index

Type: Annotation, Label

Example: `batch.kubernetes.io/job-completion-index: "3"`

Used on: Pod

The Job controller in the kube-controller-manager sets this as a label and annotation for Pods
created with Indexed [completion mode](/docs/concepts/workloads/controllers/job/#completion-mode).

Note the [PodIndexLabel](/docs/reference/command-line-tools-reference/feature-gates/)
feature gate must be enabled for this to be added as a pod **label**,
otherwise it will just be an annotation.

### batch.kubernetes.io/cronjob-scheduled-timestamp

Example: `batch.kubernetes.io/cronjob-scheduled-timestamp: "2016-05-19T03:00:00-07:00"`

Used on: Jobs and Pods controlled by CronJobs

This annotation is used to record the original (expected) creation timestamp for a Job,
when that Job is part of a CronJob.
The control plane sets the value to that timestamp in RFC3339 format. If the Job belongs to a CronJob
with a timezone specified, then the timestamp is in that timezone. Otherwise, the timestamp is in controller-manager's local time.

### cluster-autoscaler.kubernetes.io/enable-ds-eviction

Example: `cluster-autoscaler.kubernetes.io/enable-ds-eviction: "true"`

Used on: Pod

This annotation controls whether a DaemonSet pod should be evicted by a ClusterAutoscaler.
This annotation needs to be specified on DaemonSet pods in a DaemonSet manifest.
When this annotation is set to `"true"`, the ClusterAutoscaler is allowed to evict
a DaemonSet Pod, even if other rules would normally prevent that.
To disallow the ClusterAutoscaler from evicting DaemonSet pods,
you can set this annotation to `"false"` for important DaemonSet pods.
If this annotation is not set, then the ClusterAutoscaler follows its overall behavior
(i.e evict the DaemonSets based on its configuration).

{{< note >}}
This annotation only impacts DaemonSet Pods.
{{< /note >}}

### cluster-autoscaler.kubernetes.io/safe-to-evict

Example: `cluster-autoscaler.kubernetes.io/safe-to-evict: "true"`

Used on: Pod

When this annotation is set to `"true"`, the cluster autoscaler is allowed to evict a Pod
even if other rules would normally prevent that.
The cluster autoscaler never evicts Pods that have this annotation explicitly set to
`"false"`; you could set that on an important Pod that you want to keep running.
If this annotation is not set then the cluster autoscaler follows its Pod-level behavior.

### config.kubernetes.io/local-config

Example: `config.kubernetes.io/local-config: "true"`

Used on: All objects

This annotation is used in manifests to mark an object as local configuration that
should not be submitted to the Kubernetes API.

A value of `"true"` for this annotation declares that the object is only consumed by
client-side tooling and should not be submitted to the API server.

A value of `"false"` can be used to declare that the object should be submitted to
the API server even when it would otherwise be assumed to be local.

This annotation is part of the Kubernetes Resource Model (KRM) Functions Specification,
which is used by Kustomize and similar third-party tools.
For example, Kustomize removes objects with this annotation from its final build output.

### controller.kubernetes.io/pod-deletion-cost

Example: `controller.kubernetes.io/pod-deletion-cost: "10"`

Used on: Pod

This annotation is used to set
[Pod Deletion Cost](/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)
which allows users to influence ReplicaSet downscaling order.
The annotation value parses into an `int32` type.

### endpoints.kubernetes.io/last-change-trigger-time

Example: `endpoints.kubernetes.io/last-change-trigger-time: "2023-07-20T04:45:21Z"`

Used on: Endpoints

This annotation set to an [Endpoints](/docs/concepts/services-networking/service/#endpoints) object that
represents the timestamp (The timestamp is stored in RFC 3339 date-time string format. For example, '2018-10-22T19:32:52.1Z'). This is timestamp
of the last change in some Pod or Service object, that triggered the change to the Endpoints object.

### endpoints.kubernetes.io/over-capacity

Example: `endpoints.kubernetes.io/over-capacity:truncated`

Used on: Endpoints

The {{< glossary_tooltip text="control plane" term_id="control-plane" >}} adds this annotation to
an [Endpoints](/docs/concepts/services-networking/service/#endpoints) object if the associated
{{< glossary_tooltip term_id="service" >}} has more than 1000 backing endpoints.
The annotation indicates that the Endpoints object is over capacity and the number of endpoints
has been truncated to 1000.

If the number of backend endpoints falls below 1000, the control plane removes this annotation.



### ingressclass.kubernetes.io/is-default-class

Example: `ingressclass.kubernetes.io/is-default-class: "true"`

Used on: IngressClass

When a IngressClass resource has this annotation set to `"true"`, new Ingress resource
without a class specified will be assigned this default class.

### internal.config.kubernetes.io/* (reserved prefix)

Used on: All objects

This prefix is reserved for internal use by tools that act as orchestrators in accordance
with the Kubernetes Resource Model (KRM) Functions Specification.
Annotations with this prefix are internal to the orchestration process and are not persisted to
the manifests on the filesystem. In other words, the orchestrator tool should set these
annotations when reading files from the local filesystem and remove them when writing the output
of functions back to the filesystem.

A KRM function **must not** modify annotations with this prefix, unless otherwise specified for a
given annotation. This enables orchestrator tools to add additional internal annotations, without
requiring changes to existing functions.

### internal.config.kubernetes.io/index

Example: `internal.config.kubernetes.io/index: "2"`

Used on: All objects

This annotation records the zero-indexed position of the YAML document that contains the object
within the manifest file the object was loaded from. Note that YAML documents are separated by
three dashes (`---`) and can each contain one object. When this annotation is not specified, a
value of 0 is implied.

This annotation is part of the Kubernetes Resource Model (KRM) Functions Specification,
which is used by Kustomize and similar third-party tools.

A KRM Function **should not** modify this annotation on input objects unless it is modifying the
referenced files. A KRM Function **may** include this annotation on objects it generates.

### internal.config.kubernetes.io/path

Example: `internal.config.kubernetes.io/path: "relative/file/path.yaml"`

Used on: All objects

This annotation records the slash-delimited, OS-agnostic, relative path to the manifest file the
object was loaded from. The path is relative to a fixed location on the filesystem, determined by
the orchestrator tool.

This annotation is part of the Kubernetes Resource Model (KRM) Functions Specification, which is
used by Kustomize and similar third-party tools.

A KRM Function **should not** modify this annotation on input objects unless it is modifying the
referenced files. A KRM Function **may** include this annotation on objects it generates.

### kubectl.kubernetes.io/default-container

Example: `kubectl.kubernetes.io/default-container: "front-end-app"`

The value of the annotation is the container name that is default for this Pod.
For example, `kubectl logs` or `kubectl exec` without `-c` or `--container` flag
will use this default container.

### kubectl.kubernetes.io/last-applied-configuration

Example: _see following snippet_
```yaml
    kubectl.kubernetes.io/last-applied-configuration: >
      {"apiVersion":"apps/v1","kind":"Deployment","metadata":{"annotations":{},"name":"example","namespace":"default"},"spec":{"selector":{"matchLabels":{"app.kubernetes.io/name":foo}},"template":{"metadata":{"labels":{"app.kubernetes.io/name":"foo"}},"spec":{"containers":[{"image":"container-registry.example/foo-bar:1.42","name":"foo-bar","ports":[{"containerPort":42}]}]}}}}
```

Used on: All objects

The kubectl command line tool uses this annotation as a legacy mechanism
to track changes. That mechanism has been superseded by
[Server-side apply](/docs/reference/using-api/server-side-apply/).

### kubectl.kubernetes.io/restartedAt

Example: `kubectl.kubernetes.io/restartedAt: "2024-06-21T17:27:41Z"`

Used on: Deployment, ReplicaSet, StatefulSet, DaemonSet, Pod

This annotation contains the latest restart time of a resource (Deployment, ReplicaSet, StatefulSet or DaemonSet),
where kubectl triggered a rollout in order to force creation of new Pods.
The command `kubectl rollout restart <RESOURCE>` triggers a restart by patching the template
metadata of all the pods of resource with this annotation. In above example the latest restart time is shown as 21st June 2024 at 17:27:41 UTC.

You should not assume that this annotation represents the date / time of the most recent update;
a separate change could have been made since the last manually triggered rollout.

If you manually set this annotation on a Pod, nothing happens. The restarting side effect comes from
how workload management and Pod templating works.

### kubernetes.io/description

Example: `kubernetes.io/description: "Description of K8s object."`

Used on: All Objects

This annotation is used for describing specific behaviour of given object.

### kubernetes.io/change-cause

Example: `kubernetes.io/change-cause: "kubectl edit --record deployment foo"`

Used on: All Objects

This annotation is a best guess at why something was changed.

It is populated when adding `--record` to a `kubectl` command that may change an object.


### kubernetes.io/config.hash

Example: `kubernetes.io/config.hash: "df7cc47f8477b6b1226d7d23a904867b"`

Used on: Pod

When the kubelet creates a static Pod based on a given manifest, it attaches this annotation
to the static Pod. The value of the annotation is the UID of the Pod.
Note that the kubelet also sets the `.spec.nodeName` to the current node name as if the Pod
was scheduled to the node.

### kubernetes.io/config.mirror

Example: `kubernetes.io/config.mirror: "df7cc47f8477b6b1226d7d23a904867b"`

Used on: Pod

For a static Pod created by the kubelet on a node, a {{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
is created on the API server. The kubelet adds an annotation to indicate that this Pod is
actually a mirror Pod. The annotation value is copied from the [`kubernetes.io/config.hash`](#kubernetes-io-config-hash)
annotation, which is the UID of the Pod.

When updating a Pod with this annotation set, the annotation cannot be changed or removed.
If a Pod doesn't have this annotation, it cannot be added during a Pod update.

### kubernetes.io/config.seen

Example: `kubernetes.io/config.seen: "2023-10-27T04:04:56.011314488Z"`

Used on: Pod

When the kubelet sees a Pod for the first time, it may add this annotation to
the Pod with a value of current timestamp in the RFC3339 format.

### kubernetes.io/config.source

Example: `kubernetes.io/config.source: "file"`

Used on: Pod

This annotation is added by the kubelet to indicate where the Pod comes from.
For static Pods, the annotation value could be one of `file` or `http` depending
on where the Pod manifest is located. For a Pod created on the API server and then
scheduled to the current node, the annotation value is `api`.

### kubernetes.io/egress-bandwidth

Example: `kubernetes.io/egress-bandwidth: 10M`

Used on: Pod

Egress traffic from a Pod is handled by policing, which simply drops packets in excess of the
configured rate. The limits you place on a Pod do not affect the bandwidth of other Pods.
To limit the bandwidth on a Pod, write an object definition JSON file and specify the data traffic
speed using `kubernetes.io/egress-bandwidth` annotation. The unit used for specifying egress rate
is bits per second, as a [Quantity](/docs/reference/kubernetes-api/common-definitions/quantity/).
For example, `10M` means 10 megabits per second.

{{< note >}}
Egress traffic shaping annotation is an experimental feature.
If you want to enable traffic shaping support, you must add the `bandwidth` plugin to your CNI
configuration file (default `/etc/cni/net.d`) and ensure that the binary is included in your CNI
bin dir (default `/opt/cni/bin`).
{{< /note >}}

### kubernetes.io/ingress-bandwidth

Example: `kubernetes.io/ingress-bandwidth: 10M`

Used on: Pod

You can apply quality-of-service traffic shaping to a pod and effectively limit its available
bandwidth. Ingress traffic to a Pod is handled by shaping queued packets to effectively
handle data. To limit the bandwidth on a Pod, write an object definition JSON file and specify
the data traffic speed using `kubernetes.io/ingress-bandwidth` annotation. The unit used for
specifying ingress rate is bits per second, as a
[Quantity](/docs/reference/kubernetes-api/common-definitions/quantity/).
For example, `10M` means 10 megabits per second.

{{< note >}}
Ingress traffic shaping annotation is an experimental feature.
If you want to enable traffic shaping support, you must add the `bandwidth` plugin to your CNI
configuration file (default `/etc/cni/net.d`) and ensure that the binary is included in your CNI
bin dir (default `/opt/cni/bin`).
{{< /note >}}


### kubernetes.io/limit-ranger

Example: `kubernetes.io/limit-ranger: "LimitRanger plugin set: cpu, memory request for container nginx; cpu, memory limit for container nginx"`

Used on: Pod

Kubernetes by default doesn't provide any resource limit, that means unless you explicitly define
limits, your container can consume unlimited CPU and memory.
You can define a default request or default limit for pods. You do this by creating a LimitRange
in the relevant namespace. Pods deployed after you define a LimitRange will have these limits
applied to them.
The annotation `kubernetes.io/limit-ranger` records that resource defaults were specified for the Pod,
and they were applied successfully.
For more details, read about [LimitRanges](/docs/concepts/policy/limit-range).

### kubernetes.io/service-account.name

Example: `kubernetes.io/service-account.name: "sa-name"`

Used on: Secret

This annotation records the {{< glossary_tooltip term_id="name" text="name">}} of the
ServiceAccount that the token (stored in the Secret of type `kubernetes.io/service-account-token`)
represents.

### kubernetes.io/service-account.uid

Example: `kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da`

Used on: Secret

This annotation records the {{< glossary_tooltip term_id="uid" text="unique ID" >}} of the
ServiceAccount that the token (stored in the Secret of type `kubernetes.io/service-account-token`)
represents.

### nginx.ingress.kubernetes.io/configuration-snippet

Example: `nginx.ingress.kubernetes.io/configuration-snippet: "  more_set_headers \"Request-Id: $req_id\";\nmore_set_headers \"Example: 42\";\n"`

Used on: Ingress

You can use this annotation to set extra configuration on an Ingress that
uses the [NGINX Ingress Controller](https://github.com/kubernetes/ingress-nginx/).
The `configuration-snippet` annotation is ignored
by default since version 1.9.0 of the ingress controller.
The NGINX ingress controller setting `allow-snippet-annotations.`
has to be explicitly enabled to use this annotation.
Enabling the annotation can be dangerous in a multi-tenant cluster, as it can lead people with otherwise
limited permissions being able to retrieve all Secrets in the cluster.

### pv.kubernetes.io/bind-completed

Example: `pv.kubernetes.io/bind-completed: "yes"`

Used on: PersistentVolumeClaim

When this annotation is set on a PersistentVolumeClaim (PVC), that indicates that the lifecycle
of the PVC has passed through initial binding setup. When present, that information changes
how the control plane interprets the state of PVC objects.
The value of this annotation does not matter to Kubernetes.

### pv.kubernetes.io/bound-by-controller

Example: `pv.kubernetes.io/bound-by-controller: "yes"`

Used on: PersistentVolume, PersistentVolumeClaim

If this annotation is set on a PersistentVolume or PersistentVolumeClaim, it indicates that a
storage binding (PersistentVolume → PersistentVolumeClaim, or PersistentVolumeClaim → PersistentVolume)
was installed by the {{< glossary_tooltip text="controller" term_id="controller" >}}.
If the annotation isn't set, and there is a storage binding in place, the absence of that
annotation means that the binding was done manually.
The value of this annotation does not matter.

### pv.kubernetes.io/migrated-to

Example: `pv.kubernetes.io/migrated-to: pd.csi.storage.gke.io`

Used on: PersistentVolume, PersistentVolumeClaim

It is added to a PersistentVolume(PV) and PersistentVolumeClaim(PVC) that is supposed to be
dynamically provisioned/deleted by its corresponding CSI driver through the `CSIMigration` feature gate.
When this annotation is set, the Kubernetes components will "stand-down" and the
`external-provisioner` will act on the objects.

### pv.kubernetes.io/provisioned-by

Example: `pv.kubernetes.io/provisioned-by: "kubernetes.io/rbd"`

Used on: PersistentVolume

This annotation is added to a PersistentVolume(PV) that has been dynamically provisioned by Kubernetes.
Its value is the name of volume plugin that created the volume. It serves both users (to show where a PV
comes from) and Kubernetes (to recognize dynamically provisioned PVs in its decisions).

### rbac.authorization.kubernetes.io/autoupdate

Example: `rbac.authorization.kubernetes.io/autoupdate: "false"`

Used on: ClusterRole, ClusterRoleBinding, Role, RoleBinding

When this annotation is set to `"true"` on default RBAC objects created by the API server,
they are automatically updated at server start to add missing permissions and subjects
(extra permissions and subjects are left in place).
To prevent autoupdating a particular role or rolebinding, set this annotation to `"false"`.
If you create your own RBAC objects and set this annotation to `"false"`, `kubectl auth reconcile`
(which allows reconciling arbitrary RBAC objects in a {{< glossary_tooltip text="manifest" term_id="manifest" >}})
respects this annotation and does not automatically add missing permissions and subjects.

### resource.kubernetes.io/pod-claim-name

Example: `resource.kubernetes.io/pod-claim-name: "my-pod-claim"`

Used on: ResourceClaim

This annotation is assigned to generated ResourceClaims. 
Its value corresponds to the name of the resource claim in the `.spec` of any Pod(s)
for which the ResourceClaim was created.
This annotation is an internal implementation detail of
[dynamic resource allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/).
You should not need to read or modify the value of this annotation.

### scheduler.alpha.kubernetes.io/defaultTolerations

Example: `scheduler.alpha.kubernetes.io/defaultTolerations: '[{"operator": "Equal", "value": "value1", "effect": "NoSchedule", "key": "dedicated-node"}]'`

Used on: Namespace

This annotation requires the
[PodTolerationRestriction](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
admission controller to be enabled. This annotation key allows assigning tolerations to a
namespace and any new pods created in this namespace would get these tolerations added.

### scheduler.alpha.kubernetes.io/node-selector

Example: `scheduler.alpha.kubernetes.io/node-selector: "name-of-node-selector"`

Used on: Namespace

The [PodNodeSelector](/docs/reference/access-authn-authz/admission-controllers/#podnodeselector)
uses this annotation key to assign node selectors to pods in namespaces.

### scheduler.alpha.kubernetes.io/tolerationsWhitelist

Example: `scheduler.alpha.kubernetes.io/tolerationsWhitelist: '[{"operator": "Exists", "effect": "NoSchedule", "key": "dedicated-node"}]'`

Used on: Namespace

This annotation is only useful when the (Alpha)
[PodTolerationRestriction](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
admission controller is enabled. The annotation value is a JSON document that defines a list of
allowed tolerations for the namespace it annotates. When you create a Pod or modify its
tolerations, the API server checks the tolerations to see if they are mentioned in the allow list.
The pod is admitted only if the check succeeds.

### service.kubernetes.io/topology-mode

Example: `service.kubernetes.io/topology-mode: Auto`

Used on: Service

This annotation provides a way to define how Services handle network topology;
for example, you can configure a Service so that Kubernetes prefers keeping traffic between
a client and server within a single topology zone.
In some cases this can help reduce costs or improve network performance.

See [Topology Aware Routing](/docs/concepts/services-networking/topology-aware-routing/)
for more details.

### snapshot.storage.kubernetes.io/allow-volume-mode-change

Example: `snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"`

Used on: VolumeSnapshotContent

Value can either be `true` or `false`. This determines whether a user can modify
the mode of the source volume when a PersistentVolumeClaim is being created from
a VolumeSnapshot.

Refer to [Converting the volume mode of a Snapshot](/docs/concepts/storage/volume-snapshots/#convert-volume-mode)
and the [Kubernetes CSI Developer Documentation](https://kubernetes-csi.github.io/docs/)
for more information.

### storage.alpha.kubernetes.io/migrated-plugins

Example:`storage.alpha.kubernetes.io/migrated-plugins: "kubernetes.io/cinder"`

Used on: CSINode

This annotation is automatically added for the CSINode object that maps to a node that
installs CSIDriver. This annotation shows the in-tree plugin name of the migrated plugin. Its
value depends on your cluster's in-tree cloud provider storage type.

For example, if the in-tree cloud provider storage type is `CSIMigrationvSphere`, the CSINodes instance for the node should be updated with:
`storage.alpha.kubernetes.io/migrated-plugins: "kubernetes.io/vsphere-volume"`

### storageclass.kubernetes.io/is-default-class

Example: `storageclass.kubernetes.io/is-default-class: "true"`

Used on: StorageClass

When a single StorageClass resource has this annotation set to `"true"`, new PersistentVolumeClaim
resource without a class specified will be assigned this default class.

### volumes.kubernetes.io/controller-managed-attach-detach

Used on: Node

If a node has the annotation `volumes.kubernetes.io/controller-managed-attach-detach`,
its storage attach and detach operations are being managed by the _volume attach/detach_
{{< glossary_tooltip text="controller" term_id="controller" >}}.

The value of the annotation isn't important.

### volume.kubernetes.io/selected-node

Used on: PersistentVolumeClaim

This annotation is added to a PVC that is triggered by a scheduler to be
dynamically provisioned. Its value is the name of the selected node.

### volume.kubernetes.io/storage-provisioner

Used on: PersistentVolumeClaim

This annotation is added to a PVC that is supposed to be dynamically provisioned.
Its value is the name of a volume plugin that is supposed to provision a volume
for this PVC.

## Deprecated Annotations

### applyset.kubernetes.io/contains-group-resources

Example: `applyset.kubernetes.io/contains-group-resources: "certificates.cert-manager.io,configmaps,deployments.apps,secrets,services"`

Used on: Objects being used as ApplySet parents.

For Kubernetes version {{< skew currentVersion >}}, you can use this annotation on Secrets, ConfigMaps,
or custom resources if the CustomResourceDefinition
defining them has the `applyset.kubernetes.io/is-parent-type` label.

Part of the specification used to implement
[ApplySet-based pruning in kubectl](/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune).
This annotation is applied to the parent object used to track an ApplySet to optimize listing of
ApplySet member objects. It is optional in the ApplySet specification, as tools can perform discovery
or use a different optimization. However, in Kubernetes version {{< skew currentVersion >}},
it is required by kubectl. When present, the value of this annotation must be a comma separated list
of the group-kinds, in the fully-qualified name format, i.e. `<resource>.<group>`.

{{< note >}}
This annotation is currently deprecated and replaced by
[`applyset.kubernetes.io/contains-group-kinds`](#applyset-kubernetes-io-contains-group-kinds),
support for this will be removed in applyset beta or GA.
{{< /note >}}

### autoscaling.alpha.kubernetes.io/behavior

Used on: HorizontalPodAutoscaler

This annotation was used to configure the scaling behavior for a
HorizontalPodAutoscaler (HPA) in earlier Kubernetes versions.
It allowed you to specify how the HPA should scale pods up or down,
including setting stabilization windows and scaling policies.
Setting this annotation has no effect in any supported release of Kubernetes.

### batch.kubernetes.io/job-tracking

Example: `batch.kubernetes.io/job-tracking: ""`

Used on: Jobs

The presence of this annotation on a Job used to indicate that the control plane is
[tracking the Job status using finalizers](/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers).
Adding or removing this annotation no longer has an effect (Kubernetes v1.27 and later)
All Jobs are tracked with finalizers.

### container.apparmor.security.beta.kubernetes.io/* 

Example: `container.apparmor.security.beta.kubernetes.io/my-container: my-custom-profile`

Used on: Pods

This annotation allows you to specify the AppArmor security profile for a container within a
Kubernetes pod. As of Kubernetes v1.30, this should be set with the `appArmorProfile` field instead.
To learn more, see the [AppArmor](/docs/tutorials/security/apparmor/) tutorial.
The tutorial illustrates using AppArmor to restrict a container's abilities and access.

The profile specified dictates the set of rules and restrictions that the containerized process must
adhere to. This helps enforce security policies and isolation for your containers.

### container.seccomp.security.alpha.kubernetes.io/[NAME]

Used on: Pod

Note: Non-functional

Kubernetes before v1.25 allowed you to configure seccomp behavior using this annotation.
See [Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/) to
learn the supported way to specify seccomp restrictions for a Pod.


### control-plane.alpha.kubernetes.io/leader

Example: `control-plane.alpha.kubernetes.io/leader={"holderIdentity":"controller-0","leaseDurationSeconds":15,"acquireTime":"2023-01-19T13:12:57Z","renewTime":"2023-01-19T13:13:54Z","leaderTransitions":1}`

Used on: Endpoints

The {{< glossary_tooltip text="control plane" term_id="control-plane" >}} previously set annotation on
an [Endpoints](/docs/concepts/services-networking/service/#endpoints) object. This annotation provided
the following detail:

- Who is the current leader.
- The time when the current leadership was acquired.
- The duration of the lease (of the leadership) in seconds.
- The time the current lease (the current leadership) should be renewed.
- The number of leadership transitions that happened in the past.

Kubernetes now uses [Leases](/docs/concepts/architecture/leases/) to
manage leader assignment for the Kubernetes control plane.


### experimental.windows.kubernetes.io/isolation-type

Example: `experimental.windows.kubernetes.io/isolation-type: "hyperv"`

Used on: Pod

The annotation is used to run Windows containers with Hyper-V isolation.

{{< note >}}
Starting from v1.20, this annotation is deprecated.
Experimental Hyper-V support was removed in 1.21.
{{< /note >}}

### kubectl.kubernetes.io/default-logs-container

Example: `kubectl.kubernetes.io/default-logs-container: "front-end-app"`

The value of the annotation is the container name that is the default logging container for this
Pod. For example, `kubectl logs` without `-c` or `--container` flag will use this default
container.

{{< note >}}
This annotation is deprecated. You should use the
[`kubectl.kubernetes.io/default-container`](#kubectl-kubernetes-io-default-container)
annotation instead. Kubernetes versions 1.25 and newer ignore this annotation.
{{< /note >}}



### kubernetes.io/enforce-mountable-secrets

Example: `kubernetes.io/enforce-mountable-secrets: "true"`

Used on: ServiceAccount

{{< note >}}
`kubernetes.io/enforce-mountable-secrets` is deprecated since Kubernetes v1.32.
Use separate namespaces to isolate access to mounted secrets.
{{< /note >}}

The value for this annotation must be **true** to take effect.
When you set this annotation  to "true", Kubernetes enforces the following rules for
Pods running as this ServiceAccount:

1. Secrets mounted as volumes must be listed in the ServiceAccount's `secrets` field.
1. Secrets referenced in `envFrom` for containers (including sidecar containers and init containers)
   must also be listed in the ServiceAccount's secrets field.
   If any container in a Pod references a Secret not listed in the ServiceAccount's `secrets` field
   (and even if the reference is marked as `optional`), then the Pod will fail to start,
   and an error indicating the non-compliant secret reference will be generated.
1. Secrets referenced in a Pod's `imagePullSecrets` must be present in the
   ServiceAccount's `imagePullSecrets` field, the Pod will fail to start,
   and an error indicating the non-compliant image pull secret reference will be generated.

When you create or update a Pod, these rules are checked.
If a Pod doesn't follow them, it won't start and you'll see an error message.
If a Pod is already running and you change the `kubernetes.io/enforce-mountable-secrets`
annotation to true, or you edit the associated ServiceAccount to remove the reference to
a Secret that the Pod is already using, the Pod continues to run.

### kubernetes.io/ingress.class

Used on: Ingress

{{< note >}}
Starting in v1.18, this annotation is deprecated in favor of `spec.ingressClassName`.
{{< /note >}}

### kubernetes.io/psp

Example: `kubernetes.io/psp: restricted`

Used on: Pod

This annotation was only relevant if you were using
[PodSecurityPolicy](/docs/concepts/security/pod-security-policy/) objects.
Kubernetes v{{< skew currentVersion >}} does not support the PodSecurityPolicy API.

When the PodSecurityPolicy admission controller admitted a Pod, the admission controller
modified the Pod to have this annotation.
The value of the annotation was the name of the PodSecurityPolicy that was used for validation.

### scheduler.alpha.kubernetes.io/critical-pod

Example: `scheduler.alpha.kubernetes.io/critical-pod: ""`

Used on: Pod

This annotation lets Kubernetes control plane know about a Pod being a critical Pod
so that the descheduler will not remove this Pod.

{{< note >}}
Starting in v1.16, this annotation was removed in favor of
[Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
{{< /note >}}



### scheduler.alpha.kubernetes.io/preferAvoidPods

Used on: Node

This annotation requires the
[NodePreferAvoidPods scheduling plugin](/docs/reference/scheduling/config/#scheduling-plugins)
to be enabled. The plugin is deprecated since Kubernetes 1.22.
Use [Taints and Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/) instead.

### seccomp.security.alpha.kubernetes.io/pod

Used on: Po

Note: Non-functional

Kubernetes before v1.25 allowed you to configure seccomp behavior using this annotation.
See [Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/) to
learn the supported way to specify seccomp restrictions for a Pod.


### service.alpha.kubernetes.io/tolerate-unready-endpoints

Used on: StatefulSet

This annotation on a Service denotes if the Endpoints controller should go ahead and create
Endpoints for unready Pods. Endpoints of these Services retain their DNS records and continue
receiving traffic for the Service from the moment the kubelet starts all containers in the pod
and marks it _Running_, til the kubelet stops all containers and deletes the pod from
the API server.

### service.kubernetes.io/topology-aware-hints

Example: `service.kubernetes.io/topology-aware-hints: "Auto"`

Used on: Service

This annotation was used for enabling _topology aware hints_ on Services.
Topology aware hints have since been renamed: the concept is now called
[topology aware routing](/docs/concepts/services-networking/topology-aware-routing/).
Setting the annotation to `Auto`, on a Service, configured the Kubernetes control plane to
add topology hints on EndpointSlices associated with that Service.
You can also explicitly set the annotation to `"Disabled"`.

If you are running a version of Kubernetes older than {{< skew currentVersion >}},
check the documentation for that Kubernetes version to see how topology aware routing
works in that release.

There are no other valid values for this annotation.
If you don't want topology aware hints for a Service, don't add this annotation.

### volume.beta.kubernetes.io/mount-options

Example : `volume.beta.kubernetes.io/mount-options: "ro,soft"`

Used on: PersistentVolume

A Kubernetes administrator can specify additional
[mount options](/docs/concepts/storage/persistent-volumes/#mount-options)
for when a PersistentVolume is mounted on a node.

### volume.beta.kubernetes.io/storage-class

Example: `volume.beta.kubernetes.io/storage-class: "example-class"`

Used on: PersistentVolume, PersistentVolumeClaim

This annotation can be used for PersistentVolume(PV) or PersistentVolumeClaim(PVC)
to specify the name of [StorageClass](/docs/concepts/storage/storage-classes/).
When both the `storageClassName` attribute and the `volume.beta.kubernetes.io/storage-class`
annotation are specified, the annotation `volume.beta.kubernetes.io/storage-class`
takes precedence over the `storageClassName` attribute.

This annotation has been deprecated. Instead, set the
[`storageClassName` field](/docs/concepts/storage/persistent-volumes/#class)
for the PersistentVolumeClaim or PersistentVolume.

### volume.beta.kubernetes.io/storage-provisioner

Example: `volume.beta.kubernetes.io/storage-provisioner: "k8s.io/minikube-hostpath"`

Used on: PersistentVolumeClaim

This annotation has been deprecated since v1.23.
See [volume.kubernetes.io/storage-provisioner](#volume-kubernetes-io-storage-provisioner).


