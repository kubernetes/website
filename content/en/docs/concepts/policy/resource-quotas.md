---
reviewers:
- derekwaynecarr
title: Resource Quotas
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

When several users or teams share a cluster with a fixed number of nodes,
there is a concern that one team could use more than its fair share of resources.

Resource quotas are a tool for administrators to address this concern.

{{% /capture %}}


{{% capture body %}}

A resource quota, defined by a `ResourceQuota` object, provides constraints that limit
aggregate resource consumption per namespace.  It can limit the quantity of objects that can
be created in a namespace by type, as well as the total amount of compute resources that may
be consumed by resources in that project.

Resource quotas work like this:

- Different teams work in different namespaces.  Currently this is voluntary, but
  support for making this mandatory via ACLs is planned.
- The administrator creates one `ResourceQuota` for each namespace.
- Users create resources (pods, services, etc.) in the namespace, and the quota system
  tracks usage to ensure it does not exceed hard resource limits defined in a `ResourceQuota`.
- If creating or updating a resource violates a quota constraint, the request will fail with HTTP
  status code `403 FORBIDDEN` with a message explaining the constraint that would have been violated.
- If quota is enabled in a namespace for compute resources like `cpu` and `memory`, users must specify
  requests or limits for those values; otherwise, the quota system may reject pod creation.  Hint: Use
  the `LimitRanger` admission controller to force defaults for pods that make no compute resource requirements.
  See the [walkthrough](/docs/tasks/administer-cluster/quota-memory-cpu-namespace/) for an example of how to avoid this problem.

Examples of policies that could be created using namespaces and quotas are:

- In a cluster with a capacity of 32 GiB RAM, and 16 cores, let team A use 20 GiB and 10 cores,
  let B use 10GiB and 4 cores, and hold 2GiB and 2 cores in reserve for future allocation.
- Limit the "testing" namespace to using 1 core and 1GiB RAM.  Let the "production" namespace
  use any amount.

In the case where the total capacity of the cluster is less than the sum of the quotas of the namespaces,
there may be contention for resources.  This is handled on a first-come-first-served basis.

Neither contention nor changes to quota will affect already created resources.

## Enabling Resource Quota

Resource Quota support is enabled by default for many Kubernetes distributions.  It is
enabled when the apiserver `--enable-admission-plugins=` flag has `ResourceQuota` as
one of its arguments.

A resource quota is enforced in a particular namespace when there is a
`ResourceQuota` in that namespace.

## Compute Resource Quota

You can limit the total sum of [compute resources](/docs/user-guide/compute-resources) that can be requested in a given namespace.

The following resource types are supported:

| Resource Name | Description |
| --------------------- | ----------------------------------------------------------- |
| `limits.cpu` | Across all pods in a non-terminal state, the sum of CPU limits cannot exceed this value. |
| `limits.memory` | Across all pods in a non-terminal state, the sum of memory limits cannot exceed this value. |
| `requests.cpu` | Across all pods in a non-terminal state, the sum of CPU requests cannot exceed this value. |
| `requests.memory` | Across all pods in a non-terminal state, the sum of memory requests cannot exceed this value. |

### Resource Quota For Extended Resources

In addition to the resources mentioned above, in release 1.10, quota support for
[extended resources](/docs/concepts/configuration/manage-compute-resources-container/#extended-resources) is added.

As overcommit is not allowed for extended resources, it makes no sense to specify both `requests`
and `limits` for the same extended resource in a quota. So for extended resources, only quota items
with prefix `requests.` is allowed for now.

Take the GPU resource as an example, if the resource name is `nvidia.com/gpu`, and you want to
limit the total number of GPUs requested in a namespace to 4, you can define a quota as follows:

* `requests.nvidia.com/gpu: 4`

See [Viewing and Setting Quotas](#viewing-and-setting-quotas) for more detail information.


## Storage Resource Quota

You can limit the total sum of [storage resources](/docs/concepts/storage/persistent-volumes/) that can be requested in a given namespace.

In addition, you can limit consumption of storage resources based on associated storage-class.

| Resource Name | Description |
| --------------------- | ----------------------------------------------------------- |
| `requests.storage` | Across all persistent volume claims, the sum of storage requests cannot exceed this value. |
| `persistentvolumeclaims` | The total number of [persistent volume claims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |
| `<storage-class-name>.storageclass.storage.k8s.io/requests.storage` | Across all persistent volume claims associated with the storage-class-name, the sum of storage requests cannot exceed this value. |
| `<storage-class-name>.storageclass.storage.k8s.io/persistentvolumeclaims` | Across all persistent volume claims associated with the storage-class-name, the total number of [persistent volume claims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |

For example, if an operator wants to quota storage with `gold` storage class separate from `bronze` storage class, the operator can
define a quota as follows:

* `gold.storageclass.storage.k8s.io/requests.storage: 500Gi`
* `bronze.storageclass.storage.k8s.io/requests.storage: 100Gi`

In release 1.8, quota support for local ephemeral storage is added as an alpha feature:

| Resource Name | Description |
| ------------------------------- |----------------------------------------------------------- |
| `requests.ephemeral-storage` | Across all pods in the namespace, the sum of local ephemeral storage requests cannot exceed this value. |
| `limits.ephemeral-storage` | Across all pods in the namespace, the sum of local ephemeral storage limits cannot exceed this value. |

## Object Count Quota

The 1.9 release added support to quota all standard namespaced resource types using the following syntax:

* `count/<resource>.<group>`

Here is an example set of resources users may want to put under object count quota:

* `count/persistentvolumeclaims`
* `count/services`
* `count/secrets`
* `count/configmaps`
* `count/replicationcontrollers`
* `count/deployments.apps`
* `count/replicasets.apps`
* `count/statefulsets.apps`
* `count/jobs.batch`
* `count/cronjobs.batch`
* `count/deployments.extensions`

When using `count/*` resource quota, an object is charged against the quota if it exists in server storage.
These types of quotas are useful to protect against exhaustion of storage resources.  For example, you may
want to quota the number of secrets in a server given their large size.  Too many secrets in a cluster can
actually prevent servers and controllers from starting!  You may choose to quota jobs to protect against
a poorly configured cronjob creating too many jobs in a namespace causing a denial of service.

Prior to the 1.9 release, it was possible to do generic object count quota on a limited set of resources.
In addition, it is possible to further constrain quota for particular resources by their type.

The following types are supported:

| Resource Name | Description |
| ------------------------------- | ------------------------------------------------- |
| `configmaps` | The total number of config maps that can exist in the namespace. |
| `persistentvolumeclaims` | The total number of [persistent volume claims](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |
| `pods` | The total number of pods in a non-terminal state that can exist in the namespace.  A pod is in a terminal state if `.status.phase in (Failed, Succeeded)` is true.  |
| `replicationcontrollers` | The total number of replication controllers that can exist in the namespace. |
| `resourcequotas` | The total number of [resource quotas](/docs/reference/access-authn-authz/admission-controllers/#resourcequota) that can exist in the namespace. |
| `services` | The total number of services that can exist in the namespace. |
| `services.loadbalancers` | The total number of services of type load balancer that can exist in the namespace. |
| `services.nodeports` | The total number of services of type node port that can exist in the namespace. |
| `secrets` | The total number of secrets that can exist in the namespace. |

For example, `pods` quota counts and enforces a maximum on the number of `pods`
created in a single namespace that are not terminal. You might want to set a `pods`
quota on a namespace to avoid the case where a user creates many small pods and
exhausts the cluster's supply of Pod IPs.

## Quota Scopes

Each quota can have an associated set of scopes.  A quota will only measure usage for a resource if it matches
the intersection of enumerated scopes.

When a scope is added to the quota, it limits the number of resources it supports to those that pertain to the scope.
Resources specified on the quota outside of the allowed set results in a validation error.

| Scope | Description |
| ----- | ----------- |
| `Terminating` | Match pods where `.spec.activeDeadlineSeconds >= 0` |
| `NotTerminating` | Match pods where `.spec.activeDeadlineSeconds is nil` |
| `BestEffort` | Match pods that have best effort quality of service. |
| `NotBestEffort` | Match pods that do not have best effort quality of service. |

The `BestEffort` scope restricts a quota to tracking the following resource: `pods`

The `Terminating`, `NotTerminating`, and `NotBestEffort` scopes restrict a quota to tracking the following resources:

* `cpu`
* `limits.cpu`
* `limits.memory`
* `memory`
* `pods`
* `requests.cpu`
* `requests.memory`

### Resource Quota Per PriorityClass

{{< feature-state for_k8s_version="1.12" state="beta" >}}

Pods can be created at a specific [priority](/docs/concepts/configuration/pod-priority-preemption/#pod-priority).
You can control a pod's consumption of system resources based on a pod's priority, by using the `scopeSelector`
field in the quota spec.

A quota is matched and consumed only if `scopeSelector` in the quota spec selects the pod.

This example creates a quota object and matches it with pods at specific priorities. The example
works as follows:

- Pods in the cluster have one of the three priority classes, "low", "medium", "high".
- One quota object is created for each priority.

Save the following YAML to a file `quota.yml`.

```yaml
apiVersion: v1
kind: List
items:
- apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: pods-high
  spec:
    hard:
      cpu: "1000"
      memory: 200Gi
      pods: "10"
    scopeSelector:
      matchExpressions:
      - operator : In
        scopeName: PriorityClass
        values: ["high"]
- apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: pods-medium
  spec:
    hard:
      cpu: "10"
      memory: 20Gi
      pods: "10"
    scopeSelector:
      matchExpressions:
      - operator : In
        scopeName: PriorityClass
        values: ["medium"]
- apiVersion: v1
  kind: ResourceQuota
  metadata:
    name: pods-low
  spec:
    hard:
      cpu: "5"
      memory: 10Gi
      pods: "10"
    scopeSelector:
      matchExpressions:
      - operator : In
        scopeName: PriorityClass
        values: ["low"]
```

Apply the YAML using `kubectl create`.

```shell
kubectl create -f ./quota.yml
```

```shell
resourcequota/pods-high created
resourcequota/pods-medium created
resourcequota/pods-low created
```

Verify that `Used` quota is `0` using `kubectl describe quota`.

```shell
kubectl describe quota
```

```shell
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

Create a pod with priority "high". Save the following YAML to a
file `high-priority-pod.yml`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: high-priority
spec:
  containers:
  - name: high-priority
    image: ubuntu
    command: ["/bin/sh"]
    args: ["-c", "while true; do echo hello; sleep 10;done"]
    resources:
      requests:
        memory: "10Gi"
        cpu: "500m"
      limits:
        memory: "10Gi"
        cpu: "500m"
  priorityClassName: high
```

Apply it with `kubectl create`.

```shell
kubectl create -f ./high-priority-pod.yml
```

Verify that "Used" stats for "high" priority quota, `pods-high`, has changed and that
the other two quotas are unchanged.

```shell
kubectl describe quota
```

```shell
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

`scopeSelector` supports the following values in the `operator` field:

* `In`
* `NotIn`
* `Exist`
* `DoesNotExist`

## Requests vs Limits

When allocating compute resources, each container may specify a request and a limit value for either CPU or memory.
The quota can be configured to quota either value.

If the quota has a value specified for `requests.cpu` or `requests.memory`, then it requires that every incoming
container makes an explicit request for those resources.  If the quota has a value specified for `limits.cpu` or `limits.memory`,
then it requires that every incoming container specifies an explicit limit for those resources.

## Viewing and Setting Quotas

Kubectl supports creating, updating, and viewing quotas:

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
    pods: "4"
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
    requests.nvidia.com/gpu: 4
EOF
```

```shell
kubectl create -f ./compute-resources.yaml --namespace=myspace
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

```shell
NAME                    AGE
compute-resources       30s
object-counts           32s
```

```shell
kubectl describe quota compute-resources --namespace=myspace
```

```shell
Name:                    compute-resources
Namespace:               myspace
Resource                 Used  Hard
--------                 ----  ----
limits.cpu               0     2
limits.memory            0     2Gi
pods                     0     4
requests.cpu             0     1
requests.memory          0     1Gi
requests.nvidia.com/gpu  0     4
```

```shell
kubectl describe quota object-counts --namespace=myspace
```

```shell
Name:                   object-counts
Namespace:              myspace
Resource                Used    Hard
--------                ----    ----
configmaps              0       10
persistentvolumeclaims  0       4
replicationcontrollers  0       20
secrets                 1       10
services                0       10
services.loadbalancers  0       2
```

Kubectl also supports object count quota for all standard namespaced resources
using the syntax `count/<resource>.<group>`:

```shell
kubectl create namespace myspace
```

```shell
kubectl create quota test --hard=count/deployments.extensions=2,count/replicasets.extensions=4,count/pods=3,count/secrets=4 --namespace=myspace
```

```shell
kubectl run nginx --image=nginx --replicas=2 --namespace=myspace
```

```shell
kubectl describe quota --namespace=myspace
```

```shell
Name:                         test
Namespace:                    myspace
Resource                      Used  Hard
--------                      ----  ----
count/deployments.extensions  1     2
count/pods                    2     3
count/replicasets.extensions  1     4
count/secrets                 1     4
```

## Quota and Cluster Capacity

`ResourceQuotas` are independent of the cluster capacity. They are
expressed in absolute units.  So, if you add nodes to your cluster, this does *not*
automatically give each namespace the ability to consume more resources.

Sometimes more complex policies may be desired, such as:

  - Proportionally divide total cluster resources among several teams.
  - Allow each tenant to grow resource usage as needed, but have a generous
    limit to prevent accidental resource exhaustion.
  - Detect demand from one namespace, add nodes, and increase quota.

Such policies could be implemented using `ResourceQuotas` as building blocks, by
writing a "controller" that watches the quota usage and adjusts the quota
hard limits of each namespace according to other signals.

Note that resource quota divides up aggregate cluster resources, but it creates no
restrictions around nodes: pods from several namespaces may run on the same node.

## Limit Priority Class consumption by default

It may be desired that pods at a particular priority, eg. "cluster-services", should be allowed in a namespace, if and only if, a matching quota object exists.

With this mechanism, operators will be able to restrict usage of certain high priority classes to a limited number of namespaces and not every namespace will be able to consume these priority classes by default.

To enforce this, kube-apiserver flag `--admission-control-config-file` should be used to pass path to the following configuration file:

```yaml
apiVersion: apiserver.k8s.io/v1alpha1
kind: AdmissionConfiguration
plugins:
- name: "ResourceQuota"
  configuration:
    apiVersion: resourcequota.admission.k8s.io/v1beta1
    kind: Configuration
    limitedResources:
    - resource: pods
      matchScopes:
      - scopeName: PriorityClass 
        operator: In
        values: ["cluster-services"]
```

Now, "cluster-services" pods will be allowed in only those namespaces where a quota object with a matching `scopeSelector` is present.
For example:
```yaml
    scopeSelector:
      matchExpressions:
      - scopeName: PriorityClass
        operator: In
        values: ["cluster-services"]
```

See [LimitedResources](https://github.com/kubernetes/kubernetes/pull/36765) and [Quota support for priority class design doc](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/pod-priority-resourcequota.md) for more information.

## Example

See a [detailed example for how to use resource quota](/docs/tasks/administer-cluster/quota-api-object/).

{{% /capture %}}

{{% capture whatsnext %}}

See [ResourceQuota design doc](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_resource_quota.md) for more information.

{{% /capture %}}
