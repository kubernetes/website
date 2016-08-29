---
assignees:
- derekwaynecarr

---

When several users or teams share a cluster with a fixed number of nodes,
there is a concern that one team could use more than its fair share of resources.

Resource quotas are a tool for administrators to address this concern.

A resource quota, defined by a `ResourceQuota` object, provides constraints that limit
aggregate resource consumption per namespace.  It can limit the quantity of objects that can
be created in a namespace by type, as well as the total amount of compute resources that may
be consumed by resources in that project.

Resource quotas work like this:

- Different teams work in different namespaces.  Currently this is voluntary, but
  support for making this mandatory via ACLs is planned.
- The administrator creates one or more Resource Quota objects for each namespace.
- Users create resources (pods, services, etc.) in the namespace, and the quota system
  tracks usage to ensure it does not exceed hard resource limits defined in a Resource Quota.
- If creating or updating a resource violates a quota constraint, the request will fail with HTTP
  status code `403 FORBIDDEN` with a message explaining the constraint that would have been violated.
- If quota is enabled in a namespace for compute resources like `cpu` and `memory`, users must specify
  requests or limits for those values; otherwise, the quota system may reject pod creation.  Hint: Use
  the LimitRange admission controller to force defaults for pods that make no compute resource requirements.
  See the [walkthrough](/docs/admin/resourcequota/walkthrough/) for an example to avoid this problem.

Examples of policies that could be created using namespaces and quotas are:

- In a cluster with a capacity of 32 GiB RAM, and 16 cores, let team A use 20 Gib and 10 cores,
  let B use 10GiB and 4 cores, and hold 2GiB and 2 cores in reserve for future allocation.
- Limit the "testing" namespace to using 1 core and 1GiB RAM.  Let the "production" namespace
  use any amount.

In the case where the total capacity of the cluster is less than the sum of the quotas of the namespaces,
there may be contention for resources.  This is handled on a first-come-first-served basis.

Neither contention nor changes to quota will affect already created resources.

## Enabling Resource Quota

Resource Quota support is enabled by default for many Kubernetes distributions.  It is
enabled when the apiserver `--admission-control=` flag has `ResourceQuota` as
one of its arguments.

Resource Quota is enforced in a particular namespace when there is a
`ResourceQuota` object in that namespace.  There should be at most one
`ResourceQuota` object in a namespace.

## Compute Resource Quota

The total sum of [compute resources](/docs/user-guide/compute-resources) requested by pods
in a namespace can be limited.  The following compute resource types are supported:

| Resource Name | Description |
| ------------ | ----------- |
| `cpu` | Across all pods in a non-terminal state, the sum of CPU requests cannot exceed this value. |
| `limits.cpu` | Across all pods in a non-terminal state, the sum of CPU limits cannot exceed this value. |
| `limits.memory` | Across all pods in a non-terminal state, the sum of memory limits cannot exceed this value. |
| `memory` | Across all pods in a non-terminal state, the sum of memory requests cannot exceed this value. |
| `requests.cpu` | Across all pods in a non-terminal state, the sum of CPU requests cannot exceed this value. |
| `requests.memory` | Across all pods in a non-terminal state, the sum of memory requests cannot exceed this value. |

## Object Count Quota

The number of objects of a given type can be restricted.  The following types
are supported:

| Resource Name | Description |
| ------------ | ----------- |
| `configmaps` | The total number of config maps that can exist in the namespace. |
| `persistentvolumeclaims` | The total number of [persistent volume claims](/docs/user-guide/persistent-volumes/#persistentvolumeclaims) that can exist in the namespace. |
| `pods` | The total number of pods in a non-terminal state that can exist in the namespace.  A pod is in a terminal state if `status.phase in (Failed, Succeeded)` is true.  |
| `replicationcontrollers` | The total number of replication controllers that can exist in the namespace. |
| `resourcequotas` | The total number of [resource quotas](/docs/admin/admission-controllers/#resourcequota) that can exist in the namespace. |
| `services` | The total number of services that can exist in the namespace. |
| `services.loadbalancers` | The total number of services of type load balancer that can exist in the namespace. |
| `services.nodeports` | The total number of services of type node port that can exist in the namespace. |
| `secrets` | The total number of secrets that can exist in the namespace. |

For example, `pods` quota counts and enforces a maximum on the number of `pods`
created in a single namespace.

You might want to set a pods quota on a namespace
to avoid the case where a user creates many small pods and exhausts the cluster's
supply of Pod IPs.

## Quota Scopes

Each quota can have an associated set of scopes.  A quota will only measure usage for a resource if it matches
the intersection of enumerated scopes.

When a scope is added to the quota, it limits the number of resources it supports to those that pertain to the scope.
Resources specified on the quota outside of the allowed set results in a validation error.

| Scope | Description |
| ----- | ----------- |
| `Terminating` | Match pods where `spec.activeDeadlineSeconds >= 0` |
| `NotTerminating` | Match pods where `spec.activeDeadlineSeconds is nil` |
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

## Requests vs Limits

When allocating compute resources, each container may specify a request and a limit value for either CPU or memory.
The quota can be configured to quota either value.

If the quota has a value specified for `requests.cpu` or `requests.memory`, then it requires that every incoming
container makes an explicit request for those resources.  If the quota has a value specified for `limits.cpu` or `limits.memory`,
then it requires that every incoming container specifies an explict limit for those resources.

## Viewing and Setting Quotas

Kubectl supports creating, updating, and viewing quotas:

```shell
$ kubectl create namespace myspace

$ cat <<EOF > compute-resources.yaml
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
EOF
$ kubectl create -f ./compute-resources.yaml --namespace=myspace

$ cat <<EOF > object-counts.yaml
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
$ kubectl create -f ./object-counts.yaml --namespace=myspace

$ kubectl get quota --namespace=myspace
NAME                    AGE
compute-resources       30s
object-counts           32s

$ kubectl describe quota compute-resources --namespace=myspace
Name:                  compute-resources
Namespace:             myspace
Resource               Used Hard
--------               ---- ----
limits.cpu             0    2
limits.memory          0    2Gi
pods                   0    4
requests.cpu           0    1
requests.memory        0    1Gi

$ kubectl describe quota object-counts --namespace=myspace
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

## Quota and Cluster Capacity

Resource Quota objects are independent of the Cluster Capacity. They are
expressed in absolute units.  So, if you add nodes to your cluster, this does *not*
automatically give each namespace the ability to consume more resources.

Sometimes more complex policies may be desired, such as:

  - proportionally divide total cluster resources among several teams.
  - allow each tenant to grow resource usage as needed, but have a generous
    limit to prevent accidental resource exhaustion.
  - detect demand from one namespace, add nodes, and increase quota.

Such policies could be implemented using ResourceQuota as a building-block, by
writing a 'controller' which watches the quota usage and adjusts the quota
hard limits of each namespace according to other signals.

Note that resource quota divides up aggregate cluster resources, but it creates no
restrictions around nodes: pods from several namespaces may run on the same node.

## Example

See a [detailed example for how to use resource quota](/docs/admin/resourcequota/walkthrough/).

## Read More

See [ResourceQuota design doc](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/design/admission_control_resource_quota.md) for more information.
