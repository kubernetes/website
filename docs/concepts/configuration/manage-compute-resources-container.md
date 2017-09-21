---
title: Managing Compute Resources for Containers
---

{% capture overview %}

When you specify a [Pod](/docs/user-guide/pods), you can optionally specify how
much CPU and memory (RAM) each Container needs. When Containers have resource
requests specified, the scheduler can make better decisions about which nodes to
place Pods on. And when Containers have their limits specified, contention for
resources on a node can be handled in a specified manner. For more details about
the difference between requests and limits, see
[Resource QoS](https://git.k8s.io/community/contributors/design-proposals/node/resource-qos.md).

{% endcapture %}


{% capture body %}

## Resource types

*CPU* and *memory* are each a *resource type*. A resource type has a base unit.
CPU is specified in units of cores, and memory is specified in units of bytes.

CPU and memory are collectively referred to as *compute resources*, or just
*resources*. Compute
resources are measurable quantities that can be requested, allocated, and
consumed. They are distinct from
[API resources](/docs/api/). API resources, such as Pods and
[Services](/docs/user-guide/services) are objects that can be read and modified
through the Kubernetes API server.

## Resource requests and limits of Pod and Container

Each Container of a Pod can specify one or more of the following:

* `spec.containers[].resources.limits.cpu`
* `spec.containers[].resources.limits.memory`
* `spec.containers[].resources.requests.cpu`
* `spec.containers[].resources.requests.memory`

Although requests and limits can only be specified on individual Containers, it
is convenient to talk about Pod resource requests and limits. A
*Pod resource request/limit* for a particular resource type is the sum of the
resource requests/limits of that type for each Container in the Pod.

## Meaning of CPU

Limits and requests for CPU resources are measured in *cpu* units.
One cpu, in Kubernetes, is equivalent to:

- 1 AWS vCPU
- 1 GCP Core
- 1 Azure vCore
- 1 *Hyperthread* on a bare-metal Intel processor with Hyperthreading

Fractional requests are allowed. A Container with
`spec.containers[].resources.requests.cpu` of `0.5` is guaranteed half as much
CPU as one that asks for 1 CPU.  The expression `0.1` is equivalent to the
expression `100m`, which can be read as "one hundred millicpu". Some people say
"one hundred millicores", and this is understood to mean the same thing. A
request with a decimal point, like `0.1`, is converted to `100m` by the API, and
precision finer than `1m` is not allowed. For this reason, the form `100m` might
be preferred.

CPU is always requested as an absolute quantity, never as a relative quantity;
0.1 is the same amount of CPU on a single-core, dual-core, or 48-core machine.

## Meaning of memory

Limits and requests for `memory` are measured in bytes. You can express memory as
a plain integer or as a fixed-point integer using one of these suffixes:
E, P, T, G, M, K. You can also use the power-of-two equivalents: Ei, Pi, Ti, Gi,
Mi, Ki. For example, the following represent roughly the same value:

```shell
128974848, 129e6, 129M, 123Mi
```

Here's an example.
The following Pod has two Containers. Each Container has a request of 0.25 cpu
and 64MiB (2<sup>26</sup> bytes) of memory. Each Container has a limit of 0.5
cpu and 128MiB of memory. You can say the Pod has a request of 0.5 cpu and 128
MiB of memory, and a limit of 1 cpu and 256MiB of memory.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: db
    image: mysql
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
  - name: wp
    image: wordpress
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

## How Pods with resource requests are scheduled

When you create a Pod, the Kubernetes scheduler selects a node for the Pod to
run on. Each node has a maximum capacity for each of the resource types: the
amount of CPU and memory it can provide for Pods. The scheduler ensures that,
for each resource type, the sum of the resource requests of the scheduled
Containers is less than the capacity of the node. Note that although actual memory
or CPU resource usage on nodes is very low, the scheduler still refuses to place
a Pod on a node if the capacity check fails. This protects against a resource
shortage on a node when resource usage later increases, for example, during a
daily peak in request rate.

## How Pods with resource limits are run

When the kubelet starts a Container of a Pod, it passes the CPU and memory limits
to the container runtime.

When using Docker:

- The `spec.containers[].resources.requests.cpu` is converted to its core value,
  which is potentially fractional, and multiplied by 1024. The greater of this number
  or 2 is used as the value of the
  [`--cpu-shares`](https://docs.docker.com/engine/reference/run/#/cpu-share-constraint)
  flag in the `docker run` command.

- The `spec.containers[].resources.limits.cpu` is converted to its millicore value and
  multiplied by 100. The resulting value is the total amount of CPU time that a container can use
  every 100ms. A container cannot use more than its share of CPU time during this interval.

  **Note**: The default quota period is 100ms. The minimum resolution of CPU quota is 1ms.
  {: .note}

- The `spec.containers[].resources.limits.memory` is converted to an integer, and
  used as the value of the
  [`--memory`](https://docs.docker.com/engine/reference/run/#/user-memory-constraints)
  flag in the `docker run` command.

If a Container exceeds its memory limit, it might be terminated. If it is
restartable, the kubelet will restart it, as with any other type of runtime
failure.

If a Container exceeds its memory request, it is likely that its Pod will
be evicted whenever the node runs out of memory.

A Container might or might not be allowed to exceed its CPU limit for extended
periods of time. However, it will not be killed for excessive CPU usage.

To determine whether a Container cannot be scheduled or is being killed due to
resource limits, see the
[Troubleshooting](#troubleshooting) section.

## Monitoring compute resource usage

The resource usage of a Pod is reported as part of the Pod status.

If [optional monitoring](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/cluster-monitoring/README.md)
is configured for your cluster, then Pod resource usage can be retrieved from
the monitoring system.

## Troubleshooting

### My Pods are pending with event message failedScheduling

If the scheduler cannot find any node where a Pod can fit, the Pod remains
unscheduled until a place can be found. An event is produced each time the
scheduler fails to find a place for the Pod, like this:

```shell
$ kubectl describe pod frontend | grep -A 3 Events
Events:
  FirstSeen LastSeen   Count  From          Subobject   PathReason      Message
  36s   5s     6      {scheduler }              FailedScheduling  Failed for reason PodExceedsFreeCPU and possibly others
```

In the preceding example, the Pod named "frontend" fails to be scheduled due to
insufficient CPU resource on the node. Similar error messages can also suggest
failure due to insufficient memory (PodExceedsFreeMemory). In general, if a Pod
is pending with a message of this type, there are several things to try:

- Add more nodes to the cluster.
- Terminate unneeded Pods to make room for pending Pods.
- Check that the Pod is not larger than all the nodes. For example, if all the
  nodes have a capacity of `cpu: 1`, then a Pod with a request of `cpu: 1.1` will
  never be scheduled.

You can check node capacities and amounts allocated with the
`kubectl describe nodes` command. For example:

```shell
$ kubectl describe nodes e2e-test-minion-group-4lw4
Name:            e2e-test-minion-group-4lw4
[ ... lines removed for clarity ...]
Capacity:
 alpha.kubernetes.io/nvidia-gpu:    0
 cpu:                               2
 memory:                            7679792Ki
 pods:                              110
Allocatable:
 alpha.kubernetes.io/nvidia-gpu:    0
 cpu:                               1800m
 memory:                            7474992Ki
 pods:                              110
[ ... lines removed for clarity ...]
Non-terminated Pods:        (5 in total)
  Namespace    Name                                  CPU Requests  CPU Limits  Memory Requests  Memory Limits
  ---------    ----                                  ------------  ----------  ---------------  -------------
  kube-system  fluentd-gcp-v1.38-28bv1               100m (5%)     0 (0%)      200Mi (2%)       200Mi (2%)
  kube-system  kube-dns-3297075139-61lj3             260m (13%)    0 (0%)      100Mi (1%)       170Mi (2%)
  kube-system  kube-proxy-e2e-test-...               100m (5%)     0 (0%)      0 (0%)           0 (0%)
  kube-system  monitoring-influxdb-grafana-v4-z1m12  200m (10%)    200m (10%)  600Mi (8%)       600Mi (8%)
  kube-system  node-problem-detector-v0.1-fj7m3      20m (1%)      200m (10%)  20Mi (0%)        100Mi (1%)
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  CPU Requests    CPU Limits    Memory Requests    Memory Limits
  ------------    ----------    ---------------    -------------
  680m (34%)      400m (20%)    920Mi (12%)        1070Mi (14%)
```

In the preceding output, you can see that if a Pod requests more than 1120m
CPUs or 6.23Gi of memory, it will not fit on the node.

By looking at the `Pods` section, you can see which Pods are taking up space on
the node.

The amount of resources available to Pods is less than the node capacity, because
system daemons use a portion of the available resources. The `allocatable` field
[NodeStatus](/docs/resources-reference/{{page.version}}/#nodestatus-v1-core)
gives the amount of resources that are available to Pods. For more information, see
[Node Allocatable Resources](https://git.k8s.io/community/contributors/design-proposals/node/node-allocatable.md).

The [resource quota](/docs/concepts/policy/resource-quotas/) feature can be configured
to limit the total amount of resources that can be consumed. If used in conjunction
with namespaces, it can prevent one team from hogging all the resources.

### My Container is terminated

Your Container might get terminated because it is resource-starved. To check
whether a Container is being killed because it is hitting a resource limit, call
`kubectl describe pod` on the Pod of interest:

```shell
[12:54:41] $ kubectl describe pod simmemleak-hra99
Name:                           simmemleak-hra99
Namespace:                      default
Image(s):                       saadali/simmemleak
Node:                           kubernetes-node-tf0f/10.240.216.66
Labels:                         name=simmemleak
Status:                         Running
Reason:
Message:
IP:                             10.244.2.75
Replication Controllers:        simmemleak (1/1 replicas created)
Containers:
  simmemleak:
    Image:  saadali/simmemleak
    Limits:
      cpu:                      100m
      memory:                   50Mi
    State:                      Running
      Started:                  Tue, 07 Jul 2015 12:54:41 -0700
    Last Termination State:     Terminated
      Exit Code:                1
      Started:                  Fri, 07 Jul 2015 12:54:30 -0700
      Finished:                 Fri, 07 Jul 2015 12:54:33 -0700
    Ready:                      False
    Restart Count:              5
Conditions:
  Type      Status
  Ready     False
Events:
  FirstSeen                         LastSeen                         Count  From                              SubobjectPath                       Reason      Message
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {scheduler }                                                          scheduled   Successfully assigned simmemleak-hra99 to kubernetes-node-tf0f
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    implicitly required container POD   pulled      Pod container image "gcr.io/google_containers/pause:0.8.0" already present on machine
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    implicitly required container POD   created     Created with docker id 6a41280f516d
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    implicitly required container POD   started     Started with docker id 6a41280f516d
  Tue, 07 Jul 2015 12:53:51 -0700   Tue, 07 Jul 2015 12:53:51 -0700  1      {kubelet kubernetes-node-tf0f}    spec.containers{simmemleak}         created     Created with docker id 87348f12526a
```

In the preceding example, the `Restart Count:  5` indicates that the `simmemleak`
Container in the Pod was terminated and restarted five times.

You can call `kubectl get pod` with the `-o go-template=...` option to fetch the status
of previously terminated Containers:

```shell{% raw %}
[13:59:01] $ kubectl get pod -o go-template='{{range.status.containerStatuses}}{{"Container Name: "}}{{.name}}{{"\r\nLastState: "}}{{.lastState}}{{end}}'  simmemleak-60xbc
Container Name: simmemleak
LastState: map[terminated:map[exitCode:137 reason:OOM Killed startedAt:2015-07-07T20:58:43Z finishedAt:2015-07-07T20:58:43Z containerID:docker://0e4095bba1feccdfe7ef9fb6ebffe972b4b14285d5acdec6f0d3ae8a22fad8b2]]{% endraw %}
```

You can see that the Container was terminated because of `reason:OOM Killed`,
where `OOM` stands for Out Of Memory.

## Opaque integer resources (Alpha feature)

Kubernetes version 1.5 introduces Opaque integer resources. Opaque
integer resources allow cluster operators to advertise new node-level
resources that would be otherwise unknown to the system.

Users can consume these resources in Pod specs just like CPU and memory.
The scheduler takes care of the resource accounting so that no more than the
available amount is simultaneously allocated to Pods.

**Note:** Opaque integer resources are Alpha in Kubernetes version 1.5.
Only resource accounting is implemented; node-level isolation is still
under active development.

Opaque integer resources are resources that begin with the prefix
`pod.alpha.kubernetes.io/opaque-int-resource-`. The API server
restricts quantities of these resources to whole numbers. Examples of
_valid_ quantities are `3`, `3000m` and `3Ki`. Examples of _invalid_
quantities are `0.5` and `1500m`.

There are two steps required to use opaque integer resources. First, the
cluster operator must advertise a per-node opaque resource on one or more
nodes. Second, users must request the opaque resource in Pods.

To advertise a new opaque integer resource, the cluster operator should
submit a `PATCH` HTTP request to the API server to specify the available
quantity in the `status.capacity` for a node in the cluster. After this
operation, the node's `status.capacity` will include a new resource. The
`status.allocatable` field is updated automatically with the new resource
asynchronously by the kubelet. Note that because the scheduler uses the
node `status.allocatable` value when evaluating Pod fitness, there may
be a short delay between patching the node capacity with a new resource and the
first pod that requests the resource to be scheduled on that node.

**Example:**

Here is an HTTP request that advertises five "foo" resources on node `k8s-node-1` whose master is `k8s-master`.

```http
PATCH /api/v1/nodes/k8s-node-1/status HTTP/1.1
Accept: application/json
Content-Type: application/json-patch+json
Host: k8s-master:8080

[
  {
    "op": "add",
    "path": "/status/capacity/pod.alpha.kubernetes.io~1opaque-int-resource-foo",
    "value": "5"
  }
]
```

```shell
curl --header "Content-Type: application/json-patch+json" \
--request PATCH \
--data '[{"op": "add", "path": "/status/capacity/pod.alpha.kubernetes.io~1opaque-int-resource-foo", "value": "5"}]' \
http://k8s-master:8080/api/v1/nodes/k8s-node-1/status
```

**Note**: In the preceding request, `~1` is the encoding for the character `/`
in the patch path. The operation path value in JSON-Patch is interpreted as a
JSON-Pointer. For more details, see
[IETF RFC 6901, section 3](https://tools.ietf.org/html/rfc6901#section-3).

To consume an opaque resource in a Pod, include the name of the opaque
resource as a key in the `spec.containers[].resources.requests` map.

The Pod is scheduled only if all of the resource requests are
satisfied, including cpu, memory and any opaque resources. The Pod will
remain in the `PENDING` state as long as the resource request cannot be met by
any node.

**Example:**

The Pod below requests 2 cpus and 1 "foo" (an opaque resource.)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-container
    image: myimage
    resources:
      requests:
        cpu: 2
        pod.alpha.kubernetes.io/opaque-int-resource-foo: 1
```

## Planned Improvements

Kubernetes version 1.5 only allows resource quantities to be specified on a
Container. It is planned to improve accounting for resources that are shared by
all Containers in a Pod, such as
[emptyDir volumes](/docs/concepts/storage/volumes/#emptydir).

Kubernetes version 1.5 only supports Container requests and limits for CPU and
memory. It is planned to add new resource types, including a node disk space
resource, and a framework for adding custom
[resource types](https://github.com/kubernetes/community/blob/{{page.githubbranch}}/contributors/design-proposals/scheduling/resources.md).

Kubernetes supports overcommitment of resources by supporting multiple levels of
[Quality of Service](http://issue.k8s.io/168).

In Kubernetes version 1.5, one unit of CPU means different things on different
cloud providers, and on different machine types within the same cloud providers.
For example, on AWS, the capacity of a node is reported in
[ECUs](http://aws.amazon.com/ec2/faqs/), while in GCE it is reported in logical
cores. We plan to revise the definition of the cpu resource to allow for more
consistency across providers and platforms.

{% endcapture %}


{% capture whatsnext %}

* Get hands-on experience
[assigning CPU and RAM resources to a container](/docs/tasks/configure-pod-container/assign-cpu-ram-container/).

* [Container](/docs/api-reference/{{page.version}}/#container-v1-core)

* [ResourceRequirements](/docs/resources-reference/{{page.version}}/#resourcerequirements-v1-core)

{% endcapture %}

{% include templates/concept.md %}
