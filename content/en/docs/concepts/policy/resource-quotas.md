---
reviewers:
- derekwaynecarr
title: Resource Quotas
api_metadata:
- apiVersion: "v1"
  kind: "ResourceQuota"
content_type: concept
weight: 20
---

<!-- overview -->

When several users or teams share a cluster with a fixed number of nodes,
there is a concern that one team could use more than its fair share of resources.

_Resource quotas_ are a tool for administrators to address this concern.

A resource quota, defined by a ResourceQuota object, provides constraints that limit
aggregate resource consumption per {{< glossary_tooltip text="namespace" term_id="namespace" >}}. A ResourceQuota can also
limit the [quantity of objects that can be created in a namespace](#quota-on-object-count) by API kind, as well as the total
amount of {{< glossary_tooltip text="infrastructure resources" term_id="infrastructure-resource" >}} that may be consumed by
API objects found in that namespace.

{{< caution >}}
Neither contention nor changes to quota will affect already created resources.
{{< /caution >}}

<!-- body -->

## How Kubernetes ResourceQuotas work

ResourceQuotas work like this:

- Different teams work in different namespaces. This separation can be enforced with
  [RBAC](/docs/reference/access-authn-authz/rbac/) or any other [authorization](/docs/reference/access-authn-authz/authorization/)
  mechanism.

- A cluster administrator creates at least one ResourceQuota for each namespace.
  - To make sure the enforcement stays enforced, the cluster administrator should also restrict access to delete or update
    that ResourceQuota; for example, by defining a [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/).

- Users create resources (pods, services, etc.) in the namespace, and the quota system
  tracks usage to ensure it does not exceed hard resource limits defined in a ResourceQuota.

  You can apply a [scope](#quota-scopes) to a ResourceQuota to limit where it applies,

- If creating or updating a resource violates a quota constraint, the 
  {{< glossary_tooltip text="control plane" term_id="control-plane" >}} (specifically, the API server)
  rejects that request with HTTP status code `403 Forbidden`. The error includes a message explaining
  the constraint that would have been violated.

- If quotas are enabled in a namespace for {{< glossary_tooltip text="resource" term_id="infrastructure-resource" >}}
  such as `cpu` and `memory`, users must specify requests or limits for those values when they define a Pod; otherwise,
  the quota system may reject pod creation.

  The resource quota [walkthrough](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)
  shows an example of how to avoid this problem.

{{< note >}}
* You can define a [LimitRange](/docs/concepts/policy/limit-range/)
  to force defaults on pods that make no compute resource requirements (so that users don't have to remember to do that).
{{< /note >}}

You often do not create Pods directly; for example, you more usually create a [workload management](/docs/concepts/workloads/controllers/)
object such as a {{< glossary_tooltip term_id="deployment" >}}. If you create a Deployment that tries to use more
resources than are available, the creation of the Deployment (or other workload management object) **succeeds**, but
the Deployment may not be able to get all of the Pods it manages to exist. In that case you can check the status of
the Deployment, for example with `kubectl describe`, to see what has happened.

## Object naming

The name of a ResourceQuota object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

## Enabling ResourceQuota

ResourceQuota support is enabled by default for many Kubernetes distributions. It is
enabled when the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
`--enable-admission-plugins=` flag has `ResourceQuota` as
one of its arguments.

A resource quota is enforced in a particular namespace when there is a
ResourceQuota in that namespace.

## Resource limiting and Pods

ResourceQuota has special behavior for two kinds of infrastructure resource: `cpu` and `memory`.

For `cpu` and `memory` resources, ResourceQuotas enforce that **every**
(new) pod in that namespace sets a limit for that resource.
If you enforce a resource quota in a namespace for either `cpu` or `memory`,
you and other clients, **must** specify either `requests` or `limits` for that resource,
for every new Pod you submit. If you don't, the control plane may reject admission
for that Pod.

For other resources: ResourceQuota works and will ignore pods in the namespace without
setting a limit or request for that resource. It means that you can create a new pod
without limit/request for ephemeral storage if the resource quota limits the ephemeral
storage of this namespace.

You can use a [LimitRange](/docs/concepts/policy/limit-range/) to automatically set
a default request for these resources.


## Examples

Here's an example ResourceQuota:

```yaml
---
# Prevent Pods setting an aggregate memory limit higher than 1024 GiB.
# This can be one Pod that tries to use all 1TiB of available RAM, or many smaller
# Pods that use up to the configured limit.
#
# You can use a LimitRange or ValidatingAdmissionPolicy to ensure that Pods
# (in the relevant namespace) always have a memory limit either at the overall
# Pod level, or across each of their containers. However, Kubernetes automatically
# enforces a limit and rejects Pods that don't set a memory limit, because of
# the special treatment for resource types "cpu" and "memory".

apiVersion: v1
kind: ResourceQuota
metadata:
  name: example-memory-quota
spec:
  hard:
    limits.memory: "1024G"
```

### ResourceQuota as part of an overall enforcement design {#example-overall-enforcement}

Examples of policies that could be created using namespaces and quotas are:

- In a cluster with a capacity of 32 GiB RAM, and 16 CPU cores, let team A use 20 GiB and 10 CPU cores,
  let B use 10GiB and 4 CPU cores, and hold 2GiB and 2 CPU cores in reserve for future allocation.
- Limit the "testing" namespace to using 1 core and 1GiB RAM. Let the "production" namespace
  use any amount of infrastructure resources.

In the case where the total capacity of the cluster is less than the sum of the quotas of the namespaces,
there may be contention for resources. Kubernetes uses
[PriorityClasses](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass) to decide which
Pods are preferred for scheduling and which are the first to be removed (_preempted_) to make room for others.
Read [quota and cluster capacity](#quota-and-cluster-capacity) to learn more.

You can use a [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/) to
set fine-grained or custom policies on resource requests and limits. For example, you want to ensure
that a Pod never requests less than 50% of its limit for memory, and you also want the overall
amount of memory use to be below a limit that you define. ValidatingAdmissionPolicies never
provide enforcement of quotas across different objects of the same kind.

## Types of resource quota

The ResourceQuota mechanism lets you enforce different kinds of limits. This
section describes the types of limit that you can enforce.

### Quota for infrastructure resources {#compute-resource-quota}

You can limit the total sum of
[compute resources](/docs/concepts/configuration/manage-resources-containers/)
that can be requested in a given namespace.

The following resource types are supported:

| Resource Name | Description |
| ------------- | ----------- |
| `limits.cpu` | Across all pods in a non-terminal state, the sum of CPU limits cannot exceed this value. |
| `limits.memory` | Across all pods in a non-terminal state, the sum of memory limits cannot exceed this value. |
| `requests.cpu` | Across all pods in a non-terminal state, the sum of CPU requests cannot exceed this value. |
| `requests.memory` | Across all pods in a non-terminal state, the sum of memory requests cannot exceed this value. |
| `hugepages-<size>` | Across all pods in a non-terminal state, the number of huge page requests of the specified size cannot exceed this value. |
| `cpu` | Same as `requests.cpu` |
| `memory` | Same as `requests.memory` |

#### Quota for extended resources

You can set quota for
[extended resources](/docs/concepts/configuration/manage-resources-containers/#extended-resources).

As overcommit is not allowed for extended resources, it makes no sense to specify both `requests`
and `limits` for the same extended resource in a quota. So for extended resources, only quota items
with prefix `requests.` are allowed.

Take the GPU resource as an example, if the resource name is `vndr.example/gpu`, and you want to
limit the total number of GPUs requested in a namespace to 4, you can define a quota as follows:

* `requests.vndr.example/gpu: 4`

See [Viewing and Setting Quotas](#viewing-and-setting-quotas) for more details.

### Quota for storage

You can limit the total sum of [storage](/docs/concepts/storage/persistent-volumes/) for volumes
that can be requested in a given namespace.

In addition, you can limit consumption of storage resources based on associated
[StorageClass](/docs/concepts/storage/storage-classes/).

| Resource Name | Description |
| ------------- | ----------- |
| `requests.storage` | Across all persistent volume claims, the sum of storage requests cannot exceed this value. |
| `persistentvolumeclaims` | The total number of [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |
| `<storage-class-name>.storageclass.storage.k8s.io/requests.storage` | Across all persistent volume claims associated with the `<storage-class-name>`, the sum of storage requests cannot exceed this value. |
| `<storage-class-name>.storageclass.storage.k8s.io/persistentvolumeclaims` | Across all persistent volume claims associated with the `<storage-class-name>`, the total number of [persistent volume claims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |

For example, if you want to quota storage with `gold` StorageClass separate from
a `bronze` StorageClass, you can define a quota as follows:

* `gold.storageclass.storage.k8s.io/requests.storage: 500Gi`
* `bronze.storageclass.storage.k8s.io/requests.storage: 100Gi`

#### Quota for local ephemeral storage

{{< feature-state for_k8s_version="v1.8" state="alpha" >}}


| Resource Name | Description |
| ------------- | ----------- |
| `requests.ephemeral-storage` | Across all pods in the namespace, the sum of local ephemeral storage requests cannot exceed this value. |
| `limits.ephemeral-storage` | Across all pods in the namespace, the sum of local ephemeral storage limits cannot exceed this value. |
| `ephemeral-storage` | Same as `requests.ephemeral-storage`. |

{{< note >}}
When using a CRI container runtime, container logs will count against the ephemeral storage quota.
This can result in the unexpected eviction of pods that have exhausted their storage quotas.

Refer to [Logging Architecture](/docs/concepts/cluster-administration/logging/) for details.
{{< /note >}}

### Quota on object count

You can set quota for *the total number of one particular {{< glossary_tooltip text="resource" term_id="api-resource" >}} kind* in the Kubernetes API,
using the following syntax:

* `count/<resource>.<group>` for resources from non-core API groups
* `count/<resource>` for resources from the core API group

For example, the PodTemplate API is in the core API group and so if you want to limit the number of
PodTemplate objects in a namespace, you use `count/podtemplates`.

These types of quotas are useful to protect against exhaustion of control plane storage.

For example, a ConfigMap or a Secret can hold just under 1MiB of data. Knowing this, you may
want to limit the number of Secrets in a server. Many large Secrets in a cluster can actually prevent servers
and controllers from starting. (If you want to limit the _size_ that an individual Secret can be, you might
use a [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/)).

As another example, you can set a quota for Jobs to protect against a poorly configured CronJob.
CronJobs that create too many Jobs in their namespace can lead to a denial of service that affects the
wider cluster.

If you define a quota on object count, it applies to Kubernetes' APIs that are part of the API server, and
to any custom resources backed by a CustomResourceDefinition.
For example, to create a quota on a `widgets` custom resource in the `example.com` API group,
use `count/widgets.example.com`.
If you use [API aggregation](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) to
add additional, custom APIs that are not defined as CustomResourceDefinitions, the core Kubernetes
control plane does not enforce quota for the aggregated API. The extension API server is expected to
provide quota enforcement if that's appropriate for the custom API.

##### Generic syntax {#resource-quota-object-count-generic}

This is a list of common examples of object kinds that you may want to put under object count quota,
listed by the configuration string that you would use.

* `count/pods`
* `count/persistentvolumeclaims`
* `count/services`
* `count/secrets`
* `count/configmaps`
* `count/deployments.apps`
* `count/replicasets.apps`
* `count/statefulsets.apps`
* `count/jobs.batch`
* `count/cronjobs.batch`

##### Specialized syntax {#resource-quota-object-count-specialized}

There is another syntax only to set the same type of quota, that only works for certain API kinds.
The following types are supported:

| Resource Name | Description |
| ------------- | ----------- |
| `configmaps` | The total number of ConfigMaps that can exist in the namespace. |
| `persistentvolumeclaims` | The total number of [PersistentVolumeClaims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |
| `pods` | The total number of Pods in a non-terminal state that can exist in the namespace. A pod is in a terminal state if `.status.phase in (Failed, Succeeded)` is true. |
| `replicationcontrollers` | The total number of ReplicationControllers that can exist in the namespace. |
| `resourcequotas` | The total number of ResourceQuotas that can exist in the namespace. |
| `services` | The total number of Services that can exist in the namespace. |
| `services.loadbalancers` | The total number of Services of type `LoadBalancer` that can exist in the namespace. |
| `services.nodeports` | The total number of `NodePorts` allocated to Services of type `NodePort` or `LoadBalancer` that can exist in the namespace. |
| `secrets` | The total number of Secrets that can exist in the namespace. |

For example, `pods` quota counts and enforces a maximum on the number of `pods`
created in a single namespace that are not terminal. You might want to set a `pods`
quota on a namespace to avoid the case where a user creates many small pods and
exhausts the cluster's supply of Pod IPs.

You can find more examples on [Viewing and Setting Quotas](#viewing-and-setting-quotas).

## Viewing and setting ResourceQuotas

kubectl supports creating, updating, and viewing quotas:

```shell
kubectl create namespace myspace
```

```shell
cat <<EOF > compute-resources.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
spec:
  hard:
    requests.cpu: "1"
    requests.memory: "1Gi"
    limits.cpu: "2"
    limits.memory: "2Gi"
    requests.vndr.example/gpu: 4 # GPU from example vendor
EOF
```

```shell
kubectl create -f  --namespace=myspace
```

```shell
cat <<EOF > object-counts.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: object-counts
spec:
  hard:
    configmaps: "10"
    persistentvolumeclaims: "4"
    pods: "4"
    replicationcontrollers: "20"
    secrets: "10"
    services: "10"
    services.loadbalancers: "2"
EOF
```

```shell
kubectl create -f ./object-counts.yaml --namespace=myspace
```

```shell
kubectl get quota --namespace=myspace
```

```none
NAME                    AGE
compute-resources       30s
object-counts           32s
```

```shell
kubectl describe quota compute-resources --namespace=myspace
```

```none
Name:                      compute-resources
Namespace:                 myspace
Resource                   Used  Hard
--------                   ----  ----
limits.cpu                 0     2
limits.memory              0     2Gi
requests.cpu               0     1
requests.memory            0     1Gi
requests.vndr.example/gpu  0     4
```

```shell
kubectl describe quota object-counts --namespace=myspace
```

```none
Name:                   object-counts
Namespace:              myspace
Resource                Used    Hard
--------                ----    ----
configmaps              0       10
persistentvolumeclaims  0       4
pods                    0       4
replicationcontrollers  0       20
secrets                 1       10
services                0       10
services.loadbalancers  0       2
```

kubectl also supports object count quota for all standard namespaced resources
using the syntax `count/<resource>.<group>`:

```shell
# You can skip this if that namespace already exists
kubectl create namespace myspace
```

```shell
kubectl create quota test --hard=count/deployments.apps=2,count/replicasets.apps=4,count/pods=3,count/secrets=4 --namespace=myspace
```

```shell
kubectl create deployment nginx --image=nginx --namespace=myspace --replicas=2
```

```shell
kubectl describe quota --namespace=myspace
```

```
Name:                         test
Namespace:                    myspace
Resource                      Used  Hard
--------                      ----  ----
count/deployments.apps        1     2
count/pods                    2     3
count/replicasets.apps        1     4
count/secrets                 1     4
```


## Quota scopes

Each quota can have an associated set of `scopes`. A quota will only measure usage for a resource if it matches
the intersection of enumerated scopes.

When a scope is added to the quota, it limits the number of resources it supports to those that pertain to the scope.
Resources specified on the quota outside of the allowed set results in a validation error.

Kubernetes {{< skew currentVersion >}} supports the following scopes:

| Scope | Description |
| ----- | ----------- |
| [`BestEffort`](#quota-scope-best-effort) | Match pods that have best effort quality of service. |
| [`CrossNamespacePodAffinity`](#cross-namespace-pod-affinity-scope) | Match pods that have cross-namespace pod [(anti)affinity terms](/docs/concepts/scheduling-eviction/assign-pod-node). |
| [`NotBestEffort`](#quota-scope-non-best-effort) | Match pods that do not have best effort quality of service. |
| [`NotTerminating`](#quota-scope-non-terminating) | Match pods where `.spec.activeDeadlineSeconds`]() is `nil`]() |
| [`PriorityClass`](#resource-quota-per-priorityclass) | Match pods that references the specified [priority class](/docs/concepts/scheduling-eviction/pod-priority-preemption). |
| [`Terminating`](##quota-scope-terminating) | Match pods where `.spec.activeDeadlineSeconds`]() >= `0`]() |
| [`VolumeAttributesClass`](#quota-scope-volume-attributes-class) | Match PersistentVolumeClaims that reference the specified [VolumeAttributesClass](/docs/concepts/storage/volume-attributes-classes). |

ResourceQuotas with a scope set can also have a optional `scopeSelector` field. You define one or more _match expressions_
that specify an `operators` and, if relevant, a set of `values` to match. For example:

```yaml
  scopeSelector:
    matchExpressions:
      - scopeName: BestEffort # Match pods that have best effort quality of service
        operator: Exists # optional; "Exists" is implied for BestEffort scope
```

The `scopeSelector` supports the following values in the `operator` field:

* `In`
* `NotIn`
* `Exists`
* `DoesNotExist`

If the `operator` is `In` or `NotIn`, the `values` field must have at least
one value. For example:

```yaml
  scopeSelector:
    matchExpressions:
      - scopeName: PriorityClass
        operator: In
        values:
          - middle
```

If the `operator` is `Exists` or `DoesNotExist`, the `values` field must *NOT* be
specified.

### Best effort Pods scope {#quota-scope-best-effort}

This scope only tracks quota consumed by Pods.
It only matches pods that have the [best effort](/docs/concepts/workloads/pods/pod-qos/#besteffort)
[QoS class](/docs/concepts/workloads/pods/pod-qos/).

The `operator` for a `scopeSelector` must be `Exists`.

### Not-best-effort Pods scope {#quota-scope-non-best-effort}

This scope only tracks quota consumed by Pods.
It only matches pods that have the [Guaranteed](/docs/concepts/workloads/pods/pod-qos/#guaranteed)
or [Burstable](/docs/concepts/workloads/pods/pod-qos/#burstable)
[QoS class](/docs/concepts/workloads/pods/pod-qos/).

The `operator` for a `scopeSelector` must be `Exists`.

### Non-terminating Pods scope {#quota-scope-non-terminating}

This scope only tracks quota consumed by Pods that are not terminating. The `operator` for a `scopeSelector`
must be `Exists`.

A Pod is not terminating if the `.spec.activeDeadlineSeconds` field is unset.

You can use a ResourceQuota with this scope to manage the following resources:

* `count.pods`
* `pods`
* `cpu`
* `memory`
* `requests.cpu`
* `requests.memory`
* `limits.cpu`
* `limits.memory`

### Terminating Pods scope {#quota-scope-terminating}

This scope only tracks quota consumed by Pods that are terminating. The `operator` for a `scopeSelector`
must be `Exists`.

A Pod is considered as _terminating_ if the `.spec.activeDeadlineSeconds` field is set to any number.

You can use a ResourceQuota with this scope to manage the following resources:

* `count.pods`
* `pods`
* `cpu`
* `memory`
* `requests.cpu`
* `requests.memory`
* `limits.cpu`
* `limits.memory`

### Cross-namespace pod affinity scope
 
{{< feature-state for_k8s_version="v1.24" state="stable" >}}

You can use `CrossNamespacePodAffinity` [quota scope](#quota-scopes) to limit which namespaces are allowed to
have pods with affinity terms that cross namespaces. Specifically, it controls which pods are allowed
to set `namespaces` or `namespaceSelector` fields in pod [(anti)affinity terms](/docs/concepts/scheduling-eviction/assign-pod-node).

Preventing users from using cross-namespace affinity terms might be desired since a pod
with anti-affinity constraints can block pods from all other namespaces
from getting scheduled in a failure domain.

Using this scope, you (as a cluster administrator) can prevent certain namespaces - such as `foo-ns` in the example below -
from having pods that use cross-namespace pod affinity. You configure this creating a ResourceQuota object in
that namespace with `CrossNamespacePodAffinity` scope and hard limit of 0:

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: disable-cross-namespace-affinity
  namespace: foo-ns
spec:
  hard:
    pods: "0"
  scopeSelector:
    matchExpressions:
    - scopeName: CrossNamespacePodAffinity
      operator: Exists
```

If you want to disallow using `namespaces` and `namespaceSelector` by default, and
only allow it for specific namespaces, you could configure `CrossNamespacePodAffinity`
as a limited resource by setting the kube-apiserver flag `--admission-control-config-file`
to the path of the following configuration file:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: "ResourceQuota"
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: ResourceQuotaConfiguration
    limitedResources:
    - resource: pods
      matchScopes:
      - scopeName: CrossNamespacePodAffinity
        operator: Exists
```

With the above configuration, pods can use `namespaces` and `namespaceSelector` in pod affinity only
if the namespace where they are created have a resource quota object with
`CrossNamespacePodAffinity` scope and a hard limit greater than or equal to the number of pods using those fields.

### PriorityClass scope {#resource-quota-per-priorityclass}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

A ResourceQuota with a PriorityClass scope only matches Pods that have a particular
[priority class](/docs/concepts/scheduling-eviction/pod-priority-preemption), and only
if any `scopeSelector` in the quota spec selects a particular Pod.

Pods can be created at a specific [priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority).
You can control a pod's consumption of system resources based on a pod's priority, by using the `scopeSelector`
field in the quota spec.


When quota is scoped for PriorityClass using the `scopeSelector` field, the ResourceQuota
can only track (and limit) the following resources:

* `pods`
* `cpu`
* `memory`
* `ephemeral-storage`
* `limits.cpu`
* `limits.memory`
* `limits.ephemeral-storage`
* `requests.cpu`
* `requests.memory`
* `requests.ephemeral-storage`

#### Example {#quota-scope-priorityclass-example}

This example creates a ResourceQuota matches it with pods at specific priorities. The example
works as follows:

- Pods in the cluster have one of the three [PriorityClasses](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass), "low", "medium", "high".
  - If you want to try this out, use a testing cluster and set up those three PriorityClasses before you continue.
- One quota object is created for each priority.

Inspect this set of ResourceQuotas:

{{% code_sample file="policy/quota.yaml" %}}

Apply the YAML using `kubectl create`.

```shell
kubectl create -f https://k8s.io/examples/policy/quota.yaml
```

```
resourcequota/pods-high created
resourcequota/pods-medium created
resourcequota/pods-low created
```

Verify that `Used` quota is `0` using `kubectl describe quota`.

```shell
kubectl describe quota
```

```
Name:       pods-high
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     1k
memory      0     200Gi
pods        0     10


Name:       pods-low
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     5
memory      0     10Gi
pods        0     10


Name:       pods-medium
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     10
memory      0     20Gi
pods        0     10
```

Create a pod with priority "high".

{{% code_sample file="policy/high-priority-pod.yaml" %}}

To create the Pod:

```shell
kubectl create -f https://k8s.io/examples/policy/high-priority-pod.yaml

```

Verify that "Used" stats for "high" priority quota, `pods-high`, has changed and that
the other two quotas are unchanged.

```shell
kubectl describe quota
```

```
Name:       pods-high
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         500m  1k
memory      10Gi  200Gi
pods        1     10


Name:       pods-low
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     5
memory      0     10Gi
pods        0     10


Name:       pods-medium
Namespace:  default
Resource    Used  Hard
--------    ----  ----
cpu         0     10
memory      0     20Gi
pods        0     10
```

#### Limiting PriorityClass consumption by default

It may be desired that pods at a particular priority, such as "cluster-services",
should be allowed in a namespace, if and only if, a matching quota object exists.

With this mechanism, operators are able to restrict usage of certain high
priority classes to a limited number of namespaces and not every namespace
will be able to consume these priority classes by default.

To enforce this, `kube-apiserver` flag `--admission-control-config-file` should be
used to pass path to the following configuration file:

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: "ResourceQuota"
  configuration:
    apiVersion: apiserver.config.k8s.io/v1
    kind: ResourceQuotaConfiguration
    limitedResources:
    - resource: pods
      matchScopes:
      - scopeName: PriorityClass
        operator: In
        values: ["cluster-services"]
```

Then, create a resource quota object in the `kube-system` namespace:

{{% code_sample file="policy/priority-class-resourcequota.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/policy/priority-class-resourcequota.yaml -n kube-system
```

```none
resourcequota/pods-cluster-services created
```

In this case, a pod creation will be allowed if:

1. the Pod's `priorityClassName` is not specified.
1. the Pod's `priorityClassName` is specified to a value other than `cluster-services`.
1. the Pod's `priorityClassName` is set to `cluster-services`, it is to be created
   in the `kube-system` namespace, and it has passed the resource quota check.

A Pod creation request is rejected if its `priorityClassName` is set to `cluster-services`
and it is to be created in a namespace other than `kube-system`.

### VolumeAttributesClass scope {#quota-scope-volume-attributes-class}

{{< feature-state feature_gate_name="VolumeAttributesClass" >}}

This scope only tracks quota consumed by PersistentVolumeClaims.

PersistentVolumeClaims can be created with a specific
[VolumeAttributesClass](/docs/concepts/storage/volume-attributes-classes/), and might be modified after creation.
You can control a PVC's consumption of storage resources based on the associated
VolumeAttributesClasses, by using the `scopeSelector` field in the quota spec.

The PVC references the associated VolumeAttributesClass by the following fields:

* `spec.volumeAttributesClassName`
* `status.currentVolumeAttributesClassName`
* `status.modifyVolumeStatus.targetVolumeAttributesClassName`

A relevant ResourceQuota is matched and consumed only if the ResourceQuota has a `scopeSelector` that selects the PVC.

When the quota is scoped for the volume attributes class using the `scopeSelector` field, the quota object is restricted to track only the following resources:

* `persistentvolumeclaims`
* `requests.storage`

Read [use a ResourceQuota to limit storage use](/docs/tasks/administer-cluster/quota-storage/) to learn more about this.

## Requests compared to limits {#requests-vs-limits}

When allocating compute resources, each container may specify a request and a limit value for either CPU or memory.
The quota can be configured to quota either value.

If the quota has a value specified for `requests.cpu` or `requests.memory`, then it requires that every incoming
container makes an explicit request for those resources. If the quota has a value specified for `limits.cpu` or `limits.memory`,
then it requires that every incoming container specifies an explicit limit for those resources.

## Quota and cluster capacity

ResourceQuotas are independent of the cluster capacity. They are
expressed in absolute units. So, if you add nodes to your cluster, this does *not*
automatically give each namespace the ability to consume more resources.

Sometimes more complex policies may be desired, such as:

- Proportionally divide total cluster resources among several teams.
- Allow each tenant to grow resource usage as needed, but have a generous
  limit to prevent accidental resource exhaustion.
- Detect demand from one namespace, add nodes, and increase quota.

Such policies could be implemented using ResourceQuotas as building blocks, by
writing a that watches the quota usage and adjusts the quota
hard limits of each namespace according to other signals.

Note that resource quota divides up aggregate cluster resources, but it creates no
restrictions around nodes: pods from several namespaces may run on the same node.

Read [Pod priority and preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
to learn about how Kubernetes handles contention between Pods for infrastructure resources.


## {{% heading "whatsnext" %}}

- See a [detailed example for how to use resource quota](/docs/tasks/administer-cluster/quota-api-object/).
- Read the ResourceQuota [API reference](/docs/reference/kubernetes-api/policy-resources/resource-quota-v1/)
- Learn about [LimitRanges](/docs/concepts/policy/limit-range/)
- You can read the historical [ResourceQuota design document](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_resource_quota.md)
  for more information.
- You can also read the [Quota support for priority class design document](https://git.k8s.io/design-proposals-archive/scheduling/pod-priority-resourcequota.md).
