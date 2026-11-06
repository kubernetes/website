---
title: Assign a PID Limit to a Pod
content_type: task
weight: 90
---

<!-- overview -->

This page shows how to set a process ID (PID) limit for a {{< glossary_tooltip text="Pod" term_id="pod" >}}.
Per-pod PID limits allow you to control the maximum number of processes that can run within a pod,
providing protection against fork bombs and resource exhaustion at a pod level.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

Your cluster must have the `PerPodPIDLimit`, `PodLevelResources`, and `PodLevelResourcesFixKubeletQOSClass`
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/) enabled.

Nodes must be running with [cgroupsv2](/docs/concepts/architecture/cgroups/). Per-pod PID limits
are not supported on nodes running cgroupsv1.

{{< note >}}
Before setting a per-pod PID limit, check your node's PID limit configuration.
The effective limit will be `min(node podPidsLimit, pod pids limit)`.
If your node's `podPidsLimit` is lower than your desired pod limit, the node limit will take precedence.
{{< /note >}}

<!-- steps -->

## Set a PID limit for a pod

To specify a PID limit for a pod, include the `resources:limits:pids` field in the pod specification.

Here is an example manifest for a Pod that has one container with a PID limit of 1024:

{{% code_sample file="pods/resource/pod-level-pid-limit.yaml" %}}

Create the Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/pid-limit-pod.yaml
```

Verify that the Pod's container is running:

```shell
kubectl get pod pid-limit-demo
```

View detailed information about the Pod:

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

You can verify that the cgroup PID limit is correctly applied by checking the pod's cgroup `pids.max` file.

First, get the pod's UID:

```shell
kubectl get pod pid-limit-demo -o jsonpath='{.metadata.uid}'
```

Then, on the node where the pod is running, check the cgroup limit.
For a pod running in the `default` namespace with QoS class `BestEffort`, the cgroup path would be:

```shell
# Replace POD_UID with your pod's UID
cat /sys/fs/cgroup/kubelet.slice/kubelet-besteffort.slice/kubelet-besteffort-pod<POD_UID>.slice/pids.max
```

{{< note >}}
The exact cgroup path depends on your pod's QoS class (`BestEffort`, `Burstable`, or `Guaranteed`)
and your kubelet's cgroup driver configuration. The PID limit is set at the pod-level cgroup,
not the container level.
{{< /note >}}

The output should show your specified limit (or the node's `podPidsLimit` if it's lower):

```
1024
```

## Clean up

Delete the Pod:

```shell
kubectl delete pod pid-limit-demo
```

## {{% heading "whatsnext" %}}

### For app developers

* Learn about [pod-level resources](/docs/concepts/configuration/manage-resources-containers/#pod-level-resources).
* Read about [PID limiting](/docs/concepts/policy/pid-limiting/) for background information.

### For cluster administrators

* Configure [node-level PID limits](/docs/concepts/policy/pid-limiting/#pod-pid-limits)
  using kubelet's `--pod-max-pids` flag or `PodPidsLimit` configuration.
* Set up [PID-based eviction](/docs/concepts/policy/pid-limiting/#pid-based-eviction)
  to terminate pods that consume excessive PIDs.
