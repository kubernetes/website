---
title: Assign a PID Limit to a Pod
content_type: task
weight: 90
min-kubernetes-server-version: "1.38"
---

<!-- overview -->

{{< feature-state feature_gate_name="PerPodPIDLimit" >}}

This page shows how to set a process ID (PID) limit for a
{{< glossary_tooltip text="Pod" term_id="pod" >}}. A per-pod PID limit caps the
number of processes that all containers in the Pod can create together. This
protects the node from fork bombs and runaway processes in a single Pod.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

The `PerPodPIDLimit`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
must be enabled on the API server and on the kubelet.

Nodes must use [cgroup v2](/docs/concepts/architecture/cgroups/). The kubelet
rejects Pods that set a PID limit on nodes that use cgroup v1.

If the feature gate is enabled on only some nodes, for example during a rolling
upgrade, the scheduler places Pods that set a PID limit only on nodes with the
feature gate enabled. This uses
[Node Declared Features](/docs/concepts/scheduling-eviction/node-declared-features/),
which is enabled by default. The scheduler does not check the cgroup version.

{{< caution >}}
If the kubelet runs with `cgroupsPerQOS: false`, it does not create Pod-level
cgroups and the PID limit is not enforced, even though the Pod is admitted and
runs.
{{< /caution >}}

{{< note >}}
When the node has a positive `podPidsLimit`, the effective limit is
`min(node podPidsLimit, pod pids limit)`. If the node's `podPidsLimit` is lower
than the limit you set for the Pod, the node's limit applies. If the node's
`podPidsLimit` is `-1` (no node limit), the Pod's limit is applied directly.
{{< /note >}}

<!-- steps -->

## Set a PID limit for a Pod

To set a PID limit for a Pod, include `pids` under the Pod-level
`spec.resources.limits` field. You cannot set `pids` in a container's
`resources`, and you cannot set `requests.pids`.

Here is a manifest for a Pod with a PID limit of 1024:

{{% code_sample file="pods/resource/pod-level-pid-limit.yaml" %}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-pid-limit.yaml
```

Verify that the Pod is running:

```shell
kubectl get pod pid-limit-demo
```

View the Pod's specification:

```shell
kubectl get pod pid-limit-demo --output=yaml
```

The output shows the PID limit:

```yaml
spec:
  containers:
  - name: demo-container
    # ...
  resources:
    limits:
      pids: "1024"
```

## Verify the PID limit is enforced

The kubelet sets the limit in the `pids.max` file of the Pod's cgroup.

Get the Pod's UID and the node it runs on:

```shell
kubectl get pod pid-limit-demo -o jsonpath='{.metadata.uid}{"\n"}{.spec.nodeName}{"\n"}'
```

Then, on that node, read `pids.max` from the Pod's cgroup. The cgroup name
contains the Pod's UID. With the `systemd` cgroup driver, the dashes in the UID
are replaced with underscores. The following command finds the cgroup for
either cgroup driver:

```shell
# Replace <pod-uid> with the UID from the previous command
POD_UID=<pod-uid>
find /sys/fs/cgroup -type d \( -name "*pod${POD_UID}*" -o -name "*pod${POD_UID//-/_}*" \) \
  -exec cat {}/pids.max \; -quit
```

The output shows the effective limit:

```
1024
```

{{< note >}}
The PID limit is set on the Pod-level cgroup, not on each container's cgroup.
The path depends on the Pod's QoS class and the kubelet's cgroup driver. For
example, for a `BestEffort` Pod:

- with the `systemd` cgroup driver (dashes in the UID replaced with underscores):
  `/sys/fs/cgroup/kubepods.slice/kubepods-besteffort.slice/kubepods-besteffort-pod<pod-uid>.slice/pids.max`
- with the `cgroupfs` cgroup driver:
  `/sys/fs/cgroup/kubepods/besteffort/pod<pod-uid>/pids.max`
{{< /note >}}

## Check whether the limit was capped

If the Pod's limit is higher than the node's `podPidsLimit`, the kubelet applies
the node's limit and emits a `PIDLimitCapped` warning event. To check for it:

```shell
kubectl get events --field-selector involvedObject.name=pid-limit-demo,reason=PIDLimitCapped
```

If the limit was capped, the event message shows both values, for example:

```
Requested PID limit 8192 exceeds node podPidsLimit; capped to 4096
```

## Clean up

Delete the Pod:

```shell
kubectl delete pod pid-limit-demo
```

## {{% heading "whatsnext" %}}

### For app developers

* Learn about [Pod-level resources](/docs/concepts/configuration/manage-resources-containers/#pod-level-resource-specification).
* Read about [PID limiting](/docs/concepts/policy/pid-limiting/) for background information.

### For cluster administrators

* Configure [Pod PID limits](/docs/concepts/policy/pid-limiting/#pod-pid-limits)
  on nodes using the kubelet's `--pod-max-pids` flag or the `podPidsLimit`
  configuration field.
* Set up [PID based eviction](/docs/concepts/policy/pid-limiting/#pid-based-eviction)
  to terminate Pods that consume too many PIDs.
