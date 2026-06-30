---
title: Assign per-pod PID limits
content_type: task
weight: 31
min-kubernetes-server-version: 1.37
---


<!-- overview -->

{{< feature-state feature_gate_name="PerPodPIDLimit" >}}

This page shows how to set a per-pod PID limit using `spec.resources.limits.pids`
in the Pod specification. By default, the kubelet enforces a node-level PID limit
(`PodPidsLimit`) uniformly across all Pods. With the `PerPodPIDLimit` feature gate
enabled, workload owners can choose an appropriate PID budget for individual Pods
without requiring cluster-wide configuration changes.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

The following feature gates must be enabled for your control plane and for all
nodes in your cluster:

- [`PerPodPIDLimit`](/docs/reference/command-line-tools-reference/feature-gates/)
- [`PodLevelResources`](/docs/reference/command-line-tools-reference/feature-gates/)
- [`PodLevelResourcesFixKubeletQOSClass`](/docs/reference/command-line-tools-reference/feature-gates/)

Nodes must be running with [cgroupsv2](/docs/concepts/architecture/cgroups/).
Nodes running cgroupsv1 will reject Pods that specify a PID limit.

## How it works

When a Pod specifies `spec.resources.limits.pids`, the kubelet applies the
**minimum** of the pod-specified limit and the node-level `PodPidsLimit`.
All containers in the Pod share the same PID pool, enforced by the pod-level
cgroup.

- If the Pod specifies **fewer** PIDs than the node allows, the Pod's limit is
  used.
- If the Pod specifies **more** PIDs than the node allows, the effective limit is
  capped to the node's `PodPidsLimit` and the kubelet emits a `PIDLimitCapped`
  warning event on the Pod.
- If the Pod does **not** specify a PID limit, the node-level `PodPidsLimit`
  applies as before.

## Constraints

- **Linux only:** Per-pod PID limits are supported on Linux nodes only.
- **cgroupsv2 required:** The node must be running with
  [cgroupsv2](/docs/concepts/architecture/cgroups/). Nodes running cgroupsv1
  will reject Pods that specify a PID limit.
- **Pod-level only:** PIDs can only be specified in `spec.resources.limits`
  (pod-level), not in `spec.containers[*].resources.limits` (container-level).
- **Limits only:** PIDs may only be specified in `limits`, not in `requests`.
  Setting `spec.resources.requests.pids` is forbidden by the API.
- **Valid range:** The PID limit must be an integer between 128 and 16384
  (inclusive).
- **No effect on QoS:** A PID limit does not influence the Pod's
  {{< glossary_tooltip text="Quality of Service" term_id="qos-class" >}} class.
  QoS is determined by CPU and memory specifications only.
- **LimitRange:** PIDs are not supported in
  [LimitRange](/docs/concepts/policy/limit-range/) objects. Cluster administrators
  cannot set default, minimum, or maximum PID values through LimitRange.
- **In-place resize:** In-place resize of PID limits is not supported.
  In-place resize currently supports only CPU and memory.
- **hostPID compatibility:** Pods with `hostPID: true` and a PID limit are
  fully supported. The PID namespace (process visibility) and the PID cgroup
  controller (process creation accounting) are independent kernel subsystems.
  Host processes are visible via `ps` but are not counted against the Pod's
  cgroup PID limit.
- **Pod Security Admission:** PID limits have no
  [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
  impact. Pods specifying PID limits are admitted under all PSA profiles
  (Privileged, Baseline, and Restricted) without triggering any policy
  violations.
- **Eviction:** Per-pod PID limits do not change the kubelet
  [eviction manager](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
  behavior. PID pressure detection continues to be based on node-level PID
  availability (`pid.available`) and operates independently of pod-level PID
  limits.
- **Scheduling:** The scheduler places Pods with a PID limit only on nodes that
  advertise the `PerPodPIDLimit`
  [declared feature](/docs/reference/node/node-status/#declaredfeatures).
  Nodes that have the feature gate disabled will not receive such Pods.
  On cgroupsv1 nodes with the feature gate enabled, the Pod is scheduled
  but rejected by the kubelet during admission.

<!-- steps -->

## Create a namespace

Create a namespace so that the resources you create in this exercise are
isolated from the rest of your cluster.

```shell
kubectl create namespace pod-resources-example
```

## Check the node-level PID limit

Before creating a Pod with a PID limit, you can check the node's `PodPidsLimit`
to understand the effective cap:

```shell
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/configz" | jq '.kubeletconfig.podPidsLimit'
```

{{< note >}}
The effective PID limit for a Pod is always `min(pod pids limit, node PodPidsLimit)`.
If the node's `PodPidsLimit` is lower than the value you specify in the Pod, the
kubelet caps the limit and emits a `PIDLimitCapped` warning event.
{{< /note >}}

## Create a Pod with a PID limit

The following Pod sets a PID limit of 2048:

{{% code_sample file="pods/resource/pod-level-pid-limit.yaml" %}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pod-level-pid-limit.yaml --namespace=pod-resources-example
```

Verify that the Pod is running:

```shell
kubectl get pod pid-demo --namespace=pod-resources-example
```

View detailed information about the Pod:

```shell
kubectl get pod pid-demo --output=yaml --namespace=pod-resources-example
```

The output shows that the Pod has a PID limit of 2048:

```yaml
...
spec:
  resources:
    limits:
      pids: "2048"
...
```

### Verify the effective PID limit

You can confirm the PID limit was accepted by describing the Pod:

```shell
kubectl describe pod pid-demo --namespace=pod-resources-example
```

Look for the pod-level `Resources` section in the output (separate from the
container-level resources):

```
Spec:
  Resources:
    Limits:
      pids:  2048
```

If you have direct access to the node (not available on managed clusters such as
GKE, EKS, or AKS), you can also verify the cgroup setting. First, get the Pod
UID and find the cgroup path:

```shell
POD_UID=$(kubectl get pod pid-demo --namespace=pod-resources-example -o jsonpath='{.metadata.uid}')
```

Then on the node where the Pod is running, find and read the `pids.max` file.
The exact cgroup path varies by QoS class and cgroup driver:

```shell
# On the node (requires cgroupsv2):
find /sys/fs/cgroup -name "pids.max" -path "*${POD_UID//-/_}*" -exec cat {} \;
```

The output should show `2048` (or the node's `PodPidsLimit` if that value is
lower). For multi-container Pods, you may see multiple `pids.max` files; the
pod-level cgroup entry shows the enforced limit.

### Check for PIDLimitCapped events

If the Pod's requested PID limit exceeds the node's `PodPidsLimit`, the kubelet
emits a `PIDLimitCapped` warning event. You can check for it with:

```shell
kubectl get events --namespace=pod-resources-example --field-selector reason=PIDLimitCapped
```

## Clean up

Delete your namespace:

```shell
kubectl delete namespace pod-resources-example
```

## {{% heading "whatsnext" %}}

- Learn about [Process ID Limits and Reservations](/docs/concepts/policy/pid-limiting/)
  for node-level PID configuration.
- Refer to the [Per-Pod PID Limit enhancement document](https://github.com/kubernetes/enhancements/issues/6063)
  for more information.
- Learn how to [Assign Pod-level CPU and memory resources](/docs/tasks/configure-pod-container/assign-pod-level-resources/).
- Read [Managing Resources for Containers](/docs/concepts/configuration/manage-resources-containers/).
- Learn about [cgroups](/docs/concepts/architecture/cgroups/) and how to verify
  your nodes are running cgroupsv2.
