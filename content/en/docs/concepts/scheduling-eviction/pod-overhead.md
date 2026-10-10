---
reviewers:
- dchen1107
- egernst
- tallclair
title: Pod Overhead
content_type: concept
weight: 30
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

When you run a Pod on a Node, the Pod itself takes an amount of system resources. These
resources are additional to the resources needed to run the container(s) inside the Pod.
In Kubernetes, _Pod Overhead_ is a way to account for the resources consumed by the Pod
infrastructure on top of the container requests & limits.

<!-- body -->

In Kubernetes, the Pod's overhead is set at
[admission](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
time according to the overhead associated with the Pod's
[RuntimeClass](/docs/concepts/containers/runtime-class/).

A pod's overhead is considered in addition to the sum of container resource requests when
scheduling a Pod. Similarly, the kubelet will include the Pod overhead when sizing the Pod cgroup,
and when carrying out Pod eviction ranking.

## Configuring Pod overhead {#set-up}

You need to make sure a `RuntimeClass` is utilized which defines the `overhead` field.

## Usage example

To work with Pod overhead, you need a RuntimeClass that defines the `overhead` field. As
an example, you could use the following RuntimeClass definition with a virtualization container
runtime (in this example, Kata Containers combined with the Firecracker virtual machine monitor)
that uses around 120MiB per Pod for the virtual machine and the guest OS:

```yaml
# You need to change this example to match the actual runtime name, and per-Pod
# resource overhead, that the container runtime is adding in your cluster.
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: kata-fc
handler: kata-fc
overhead:
  podFixed:
    memory: "120Mi"
    cpu: "250m"
```

Workloads which are created which specify the `kata-fc` RuntimeClass handler will take the memory and
cpu overheads into account for resource quota calculations, node scheduling, as well as Pod cgroup sizing.

Consider running the given example workload, test-pod:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  runtimeClassName: kata-fc
  containers:
  - name: busybox-ctr
    image: busybox:1.28
    stdin: true
    tty: true
    resources:
      limits:
        cpu: 500m
        memory: 100Mi
  - name: nginx-ctr
    image: nginx
    resources:
      limits:
        cpu: 1500m
        memory: 100Mi
```

{{< note >}}
If only `limits` are specified in the pod definition, kubelet will deduce `requests` from those limits and set them to be the same as the defined `limits`.
{{< /note >}}

At admission time the RuntimeClass [admission controller](/docs/reference/access-authn-authz/admission-controllers/)
updates the workload's PodSpec to include the `overhead` as described in the RuntimeClass. If the PodSpec already has this field defined,
the Pod will be rejected. In the given example, since only the RuntimeClass name is specified, the admission controller mutates the Pod
to include an `overhead`.

After the RuntimeClass admission controller has made modifications, you can check the updated
Pod overhead value:

```bash
kubectl get pod test-pod -o jsonpath='{.spec.overhead}'
```

The output is:

```
map[cpu:250m memory:120Mi]
```

If a [ResourceQuota](/docs/concepts/policy/resource-quotas/) is defined, the sum of container requests as well as the
`overhead` field are counted.

When the kube-scheduler is deciding which node should run a new Pod, the scheduler considers that Pod's
`overhead` as well as the sum of container requests for that Pod. For this example, the scheduler adds the
requests and the overhead, then looks for a node that has 2.25 CPU and 320 MiB of memory available.

Once a Pod is scheduled to a node, the kubelet on that node creates a new {{< glossary_tooltip
text="cgroup" term_id="cgroup" >}} for the Pod. It is within this pod that the underlying
container runtime will create containers.

If the resource has a limit defined for each container (Guaranteed QoS or Burstable QoS with limits defined),
the kubelet will set an upper limit for the pod cgroup associated with that resource (cpu.cfs_quota_us for CPU
and memory.limit_in_bytes memory). This upper limit is based on the sum of the container limits plus the `overhead`
defined in the PodSpec.

For CPU, if the Pod is Guaranteed or Burstable QoS, the kubelet will set `cpu.shares` based on the
sum of container requests plus the `overhead` defined in the PodSpec.

Looking at our example, verify the container requests for the workload:

```bash
kubectl get pod test-pod -o jsonpath='{.spec.containers[*].resources.limits}'
```

The total container requests are 2000m CPU and 200MiB of memory:

```
map[cpu: 500m memory:100Mi] map[cpu:1500m memory:100Mi]
```

Check this against what is observed by the node:

```bash
kubectl describe node | grep test-pod -B2
```

The output shows requests for 2250m CPU, and for 320MiB of memory. The requests include Pod overhead:

```
  Namespace    Name       CPU Requests  CPU Limits   Memory Requests  Memory Limits  AGE
  ---------    ----       ------------  ----------   ---------------  -------------  ---
  default      test-pod   2250m (56%)   2250m (56%)  320Mi (1%)       320Mi (1%)     36m
```

## Verify Pod cgroup limits

Check the Pod's memory cgroups on the node where the workload is running. In the following example,
[`crictl`](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)
is used on the node, which provides a CLI for CRI-compatible container runtimes. This is an
advanced example to show Pod overhead behavior, and it is not expected that users should need to check
cgroups directly on the node.

First, on the particular node, determine the Pod identifier:

```bash
# Run this on the node where the Pod is scheduled
POD_ID="$(sudo crictl pods --name test-pod -q)"
```

From this, you can determine the cgroup path for the Pod:

```bash
# Run this on the node where the Pod is scheduled
sudo crictl inspectp -o=json $POD_ID | grep cgroupsPath
```

The resulting cgroup path includes the Pod's `pause` container. The Pod level cgroup is one directory above.

```
  "cgroupsPath": "/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/7ccf55aee35dd16aca4189c952d83487297f3cd760f1bbf09620e206e7d0c27a"
```

In this specific case, the pod cgroup path is `kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2`.
Verify the Pod level cgroup setting for memory:

```bash
# Run this on the node where the Pod is scheduled.
# Also, change the name of the cgroup to match the cgroup allocated for your pod.
 cat /sys/fs/cgroup/memory/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/memory.limit_in_bytes
```

This is 320 MiB, as expected:

```
335544320
```

### Observability

Some `kube_pod_overhead_*` metrics are available in [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)
to help identify when Pod overhead is being utilized and to help observe stability of workloads
running with a defined overhead.

## {{% heading "whatsnext" %}}

* Learn more about [RuntimeClass](/docs/concepts/containers/runtime-class/)
* Read the [PodOverhead Design](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead)
  enhancement proposal for extra context

