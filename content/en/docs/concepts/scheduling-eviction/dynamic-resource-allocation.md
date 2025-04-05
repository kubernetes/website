---
reviewers:
- klueska
- pohly
title: Dynamic Resource Allocation
content_type: concept
weight: 65
api_metadata:
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceClaim"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceClaimTemplate"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "DeviceClass"
- apiVersion: "resource.k8s.io/v1beta1"
  kind: "ResourceSlice"
---

<!-- overview -->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

Dynamic resource allocation is an API for requesting and sharing resources
between pods and containers inside a pod. It is a generalization of the
persistent volumes API for generic resources. Typically those resources
are devices like GPUs.

Third-party resource drivers are
responsible for tracking and preparing resources, with allocation of
resources handled by Kubernetes via _structured parameters_ (introduced in Kubernetes 1.30).
Different kinds of resources support arbitrary parameters for defining requirements and
initialization.

Kubernetes v1.26 through to 1.31 included an (alpha) implementation of _classic DRA_,
which is no longer supported. This documentation, which is for Kubernetes
v{{< skew currentVersion >}}, explains the current approach to dynamic resource
allocation within Kubernetes.

## {{% heading "prerequisites" %}}

Kubernetes v{{< skew currentVersion >}} includes cluster-level API support for
dynamic resource allocation, but it [needs to be enabled](#enabling-dynamic-resource-allocation)
explicitly. You also must install a resource driver for specific resources that
are meant to be managed using this API. If you are not running Kubernetes
v{{< skew currentVersion>}}, check the documentation for that version of Kubernetes.

<!-- body -->

## API

The `resource.k8s.io/v1beta1`
{{< glossary_tooltip text="API group" term_id="api-group" >}} provides these types:

ResourceClaim
: Describes a request for access to resources in the cluster,
  for use by workloads. For example, if a workload needs an accelerator device
  with specific properties, this is how that request is expressed. The status
  stanza tracks whether this claim has been satisfied and what specific
  resources have been allocated.

ResourceClaimTemplate
: Defines the spec and some metadata for creating
  ResourceClaims. Created by a user when deploying a workload.
  The per-Pod ResourceClaims are then created and removed by Kubernetes
  automatically.

DeviceClass
: Contains pre-defined selection criteria for certain devices and
  configuration for them. DeviceClasses are created by a cluster administrator
  when installing a resource driver. Each request to allocate a device
  in a ResourceClaim must reference exactly one DeviceClass.

ResourceSlice
: Used by DRA drivers to publish information about resources (typically devices)
  that are available in the cluster.

DeviceTaintRule
: Used by admins or control plane components to add device taints
  to the devices described in ResourceSlices.

All parameters that select devices are defined in the ResourceClaim and
DeviceClass with in-tree types. Configuration parameters can be embedded there.
Which configuration parameters are valid depends on the DRA driver -- Kubernetes
only passes them through without interpreting them.

The `core/v1` `PodSpec` defines ResourceClaims that are needed for a Pod in a
`resourceClaims` field. Entries in that list reference either a ResourceClaim
or a ResourceClaimTemplate. When referencing a ResourceClaim, all Pods using
this PodSpec (for example, inside a Deployment or StatefulSet) share the same
ResourceClaim instance. When referencing a ResourceClaimTemplate, each Pod gets
its own instance.

The `resources.claims` list for container resources defines whether a container gets
access to these resource instances, which makes it possible to share resources
between one or more containers.

Here is an example for a fictional resource driver. Two ResourceClaim objects
will get created for this Pod and each container gets access to one of them.

```yaml
apiVersion: resource.k8s.io/v1beta1
kind: DeviceClass
name: resource.example.com
spec:
  selectors:
  - cel:
      expression: device.driver == "resource-driver.example.com"
---
apiVersion: resource.k8s.io/v1beta1
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        deviceClassName: resource.example.com
        selectors:
        - cel:
           expression: |-
              device.attributes["resource-driver.example.com"].color == "black" &&
              device.attributes["resource-driver.example.com"].size == "large"
–--
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  containers:
  - name: container0
    image: ubuntu:20.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-0
  - name: container1
    image: ubuntu:20.04
    command: ["sleep", "9999"]
    resources:
      claims:
      - name: cat-1
  resourceClaims:
  - name: cat-0
    resourceClaimTemplateName: large-black-cat-claim-template
  - name: cat-1
    resourceClaimTemplateName: large-black-cat-claim-template
```

## Scheduling

The scheduler is responsible for allocating resources to a ResourceClaim whenever a pod needs
them. It does so by retrieving the full list of available resources from
ResourceSlice objects, tracking which of those resources have already been
allocated to existing ResourceClaims, and then selecting from those resources
that remain.

The only kind of supported resources at the moment are devices. A device
instance has a name and several attributes and capacities. Devices get selected
through CEL expressions which check those attributes and capacities. In
addition, the set of selected devices also can be restricted to sets which meet
certain constraints.

The chosen resource is recorded in the ResourceClaim status together with any
vendor-specific configuration, so when a pod is about to start on a node, the
resource driver on the node has all the information it needs to prepare the
resource.

By using structured parameters, the scheduler is able to reach a decision
without communicating with any DRA resource drivers. It is also able to
schedule multiple pods quickly by keeping information about ResourceClaim
allocations in memory and writing this information to the ResourceClaim objects
in the background while concurrently binding the pod to a node.

## Monitoring resources

The kubelet provides a gRPC service to enable discovery of dynamic resources of
running Pods. For more information on the gRPC endpoints, see the
[resource allocation reporting](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).

## Pre-scheduled Pods

When you - or another API client - create a Pod with `spec.nodeName` already set, the scheduler gets bypassed.
If some ResourceClaim needed by that Pod does not exist yet, is not allocated
or not reserved for the Pod, then the kubelet will fail to run the Pod and
re-check periodically because those requirements might still get fulfilled
later.

Such a situation can also arise when support for dynamic resource allocation
was not enabled in the scheduler at the time when the Pod got scheduled
(version skew, configuration, feature gate, etc.). kube-controller-manager
detects this and tries to make the Pod runnable by reserving the required
ResourceClaims. However, this only works if those were allocated by
the scheduler for some other pod.

It is better to avoid bypassing the scheduler because a Pod that is assigned to a node
blocks normal resources (RAM, CPU) that then cannot be used for other Pods
while the Pod is stuck. To make a Pod run on a specific node while still going
through the normal scheduling flow, create the Pod with a node selector that
exactly matches the desired node:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-cats
spec:
  nodeSelector:
    kubernetes.io/hostname: name-of-the-intended-node
  ...
```

You may also be able to mutate the incoming Pod, at admission time, to unset
the `.spec.nodeName` field and to use a node selector instead.

## Admin access

{{< feature-state feature_gate_name="DRAAdminAccess" >}}

You can mark a request in a ResourceClaim or ResourceClaimTemplate as having privileged features.
A request with admin access grants access to devices which are in use and
may enable additional permissions when making the device available in a
container:

```yaml
apiVersion: resource.k8s.io/v1beta1
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        deviceClassName: resource.example.com
        adminAccess: true
```

If this feature is disabled, the `adminAccess` field will be removed
automatically when creating such a ResourceClaim.

Admin access is a privileged mode which should not be made available to normal
users in a multi-tenant cluster. Cluster administrators can restrict usage of
this feature by installing a validating admission policy similar to the following
example. Cluster administrators need to adapt at least the names and replace
"dra.example.com".

```yaml
# Permission to use admin access is granted only in namespaces which have the
# "admin-access.dra.example.com" label. Other ways of making that decision are
# also possible.

apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: resourceclaim-policy.dra.example.com
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["resource.k8s.io"]
      apiVersions: ["v1alpha3", "v1beta1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["resourceclaims"]
  validations:
    - expression: '! object.spec.devices.requests.exists(e, has(e.adminAccess) && e.adminAccess)'
      reason: Forbidden
      messageExpression: '"admin access to devices not enabled"'
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: resourceclaim-binding.dra.example.com
spec:
  policyName:  resourceclaim-policy.dra.example.com
  validationActions: [Deny]
  matchResources:
    namespaceSelector:
      matchExpressions:
      - key: admin-access.dra.example.com
        operator: DoesNotExist
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: resourceclaimtemplate-policy.dra.example.com
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["resource.k8s.io"]
      apiVersions: ["v1alpha3", "v1beta1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["resourceclaimtemplates"]
  validations:
    - expression: '! object.spec.spec.devices.requests.exists(e, has(e.adminAccess) && e.adminAccess)'
      reason: Forbidden
      messageExpression: '"admin access to devices not enabled"'
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: resourceclaimtemplate-binding.dra.example.com
spec:
  policyName:  resourceclaimtemplate-policy.dra.example.com
  validationActions: [Deny]
  matchResources:
    namespaceSelector:
      matchExpressions:
      - key: admin-access.dra.example.com
        operator: DoesNotExist
```

## ResourceClaim Device Status

{{< feature-state feature_gate_name="DRAResourceClaimDeviceStatus" >}}

The drivers can report driver-specific device status data for each allocated device
in a resource claim. For example, IPs assigned to a network interface device can be 
reported in the ResourceClaim status.

The drivers setting the status, the accuracy of the information depends on the implementation 
of those DRA Drivers. Therefore, the reported status of the device may not always reflect the 
real time changes of the state of the device.

When the feature is disabled, that field automatically gets cleared when storing the ResourceClaim. 

A ResourceClaim device status is supported when it is possible, from a DRA driver, to update an 
existing ResourceClaim where the `status.devices` field is set. 

## Device taints and tolerations

{{< feature-state feature_gate_name="DRADeviceTaints" >}}

Device taints are similar to node taints: a taint has a string key, a string
value, and an effect. The effect is applied to the ResourceClaim which is
using a tainted device and to all Pods referencing that ResourceClaim.
The "NoSchedule" effect prevents scheduling those Pods.
Tainted devices are ignored when trying to allocate a ResourceClaim
because using them would prevent scheduling of Pods.

The "NoExecute" effect implies "NoSchedule" and in addition causes eviction
of all Pods which have been scheduled already. This eviction is implemented
in the device taint eviction controller in kube-controller-manager by
deleting affected Pods.

ResourceClaims can tolerate taints. If a taint is tolerated, its effect does
not apply. An empty toleration matches all taints. A toleration can be limited to
certain effects and/or match certain key/value pairs. A toleration can check
that a certain key exists, regardless which value it has, or it can check
for specific values of a key.
For more information on this matching see the
[node taint concepts](/docs/concepts/scheduling-eviction/taint-and-toleration#concepts).

Eviction can be delayed by tolerating a taint for a certain duration.
That delay starts at the time when a taint gets added to a device, which is recorded in a field
of the taint.

Taints apply as described above also to ResourceClaims allocating "all" devices on a node.
All devices must be untainted or all of their taints must be tolerated.
Allocating a device with admin access (described [below](#admin-access))
is not exempt either. An admin using that mode must explicitly tolerate all taints
to access tainted devices.

Taints can be added to devices in two different ways:

### Taints set by the driver

A DRA driver can add taints to the device information that it publishes in ResourceSlices.
Consult the documentation of a DRA driver to learn whether the driver uses taints and what
their keys and values are.

### Taints set by an admin

An admin or a control plane component can taint devices without having to tell
the DRA driver to include taints in its ResourceSlices. They do that by
creating ResourceSliceRules. Each ResourceSliceRule adds one taint to devices which
match the device selector. Without such a selector, no devices are tainted. This
makes it harder to accidentally evict all pods using ResourceClaims when leaving out
the selector by mistake.

Devices can be selected by giving the name of a DeviceClass, driver, pool,
and/or device. The DeviceClass selects all devices that are selected by the
selectors in that DeviceClass. With just the driver name, an admin can taint
all devices managed by that driver, for example while doing some kind of
maintenance of that driver across the entire cluster. Adding a pool name can
limit the taint to a single node, if the driver manages node-local devices.

Finally, adding the device name can select one specific device. The device name
and pool name can also be used alone, if desired. For example, drivers for node-local
devices are encouraged to use the node name as their pool name. Then tainting with
that pool name automatically taints all devices on a node.

Drivers might use stable names like "gpu-0" that hide which specific device is
currently assigned to that name. To support tainting a specific hardware
instance, CEL selectors can be used in a ResourceSliceRule to match a vendor-specific
unique ID attribute, if the driver supports one for its hardware.

The taint applies as long as the DeviceTaintRule exists. It can be modified and
and removed at any time. Here is one example of a DeviceTaintRule for a fictional
DRA driver:

```yaml
apiVersion: resource.k8s.io/v1alpha3
kind: DeviceTaintRule
metadata:
  name: example
spec:
  # The entire hardware installation for this
  # particular driver is broken.
  # Evict all pods and don't schedule new ones.
  deviceSelector:
    driver: dra.example.com
  taint:
    key: dra.example.com/unhealthy
    value: Broken
    effect: NoExecute
```

## Enabling dynamic resource allocation

Dynamic resource allocation is a *beta feature* which is off by default and only enabled when the
`DynamicResourceAllocation` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
and the `resource.k8s.io/v1beta1` {{< glossary_tooltip text="API group" term_id="api-group" >}}
are enabled. For details on that, see the `--feature-gates` and `--runtime-config`
[kube-apiserver parameters](/docs/reference/command-line-tools-reference/kube-apiserver/).
kube-scheduler, kube-controller-manager and kubelet also need the feature gate.

When a resource driver reports the status of the devices, then the
`DRAResourceClaimDeviceStatus` feature gate has to be enabled in addition to
`DynamicResourceAllocation`.

A quick check whether a Kubernetes cluster supports the feature is to list
DeviceClass objects with:

```shell
kubectl get deviceclasses
```

If your cluster supports dynamic resource allocation, the response is either a
list of DeviceClass objects or:

```
No resources found
```

If not supported, this error is printed instead:

```
error: the server doesn't have a resource type "deviceclasses"
```

The default configuration of kube-scheduler enables the "DynamicResources"
plugin if and only if the feature gate is enabled and when using
the v1 configuration API. Custom configurations may have to be modified to
include it.

In addition to enabling the feature in the cluster, a resource driver also has to
be installed. Please refer to the driver's documentation for details.

### Enabling admin access

[Admin access](#admin-access) is an *alpha feature* and only enabled when the
`DRAAdminAccess` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in the kube-apiserver and kube-scheduler.

### Enabling Device Status

[ResourceClaim Device Status](#resourceclaim-device-status) is an *alpha feature* 
and only enabled when the `DRAResourceClaimDeviceStatus` 
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in the kube-apiserver.

### Enabling device taints and tolerations

[Device taints and tolerations](#device-taints-and-tolerations) is an *alpha feature* and only enabled when the
`DRADeviceTaints` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is enabled in the kube-apiserver and kube-scheduler. To use ResourceSliceRules, the
resource.k8s.io/v1alpha3 API version must be enabled.

## {{% heading "whatsnext" %}}

- For more information on the design, see the
  [Dynamic Resource Allocation with Structured Parameters](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/4381-dra-structured-parameters)
  KEP.
