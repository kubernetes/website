---
title: Checkpoint and Restore Pods
content_type: task
min-kubernetes-server-version: v1.37
weight: 415
---

<!-- overview -->

{{< feature-state feature_gate_name="PodLevelCheckpointRestore" >}}

This page shows how to create a checkpoint of a running Pod and then create a
new Pod from that checkpoint.

Pod-level checkpoint and restore is useful for workloads that are expensive to
initialize, such as services that load large models or applications that need a
long warm-up phase. A checkpoint captures the runtime state of a Pod. A restored
Pod starts from that captured state instead of starting from the container image
entrypoint.

{{< caution >}}
Pod checkpoint data can include process memory, environment variables, mounted
tokens, and other sensitive runtime state. Treat checkpoint artifacts as
sensitive data.
{{< /caution >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Enable the `PodLevelCheckpointRestore` feature gate on the kube-apiserver,
  kube-controller-manager, and kubelet.
* Use a container runtime that implements the Pod-level `CheckpointPod` and
  `RestorePod` CRI calls.
* Make sure the source Pod is running. All non-restartable init containers must
  have completed, and all regular containers and restartable init containers
  must be running.
* Make sure you are authorized to create `PodCheckpoint` objects in the source
  Pod's namespace.
* Make sure you are authorized to use the `restore` verb on the `PodCheckpoint`
  that you want to restore from.

<!-- steps -->

## Create a Pod checkpoint

Create a `PodCheckpoint` object in the same namespace as the source Pod:

```yaml
apiVersion: checkpoint.k8s.io/v1alpha1
kind: PodCheckpoint
metadata:
  name: example-checkpoint
  namespace: default
spec:
  sourcePodName: example-pod
  timeoutSeconds: 30
```

Apply the manifest:

```shell
kubectl apply -f podcheckpoint.yaml
```

The kubelet on the node that runs the source Pod observes the `PodCheckpoint`
object, asks the container runtime to checkpoint the Pod, and records the result
in the `PodCheckpoint` status.

Wait for the checkpoint to become ready:

```shell
kubectl wait podcheckpoints.checkpoint.k8s.io/example-checkpoint \
  --for='condition=Ready=True' \
  --timeout=5m
```

Check the recorded checkpoint location:

```shell
kubectl get podcheckpoints.checkpoint.k8s.io example-checkpoint -o yaml
```

A successful checkpoint has a `Ready` condition with reason
`CheckpointCompleted`. The status also records the node that holds the
checkpoint data and a node-local checkpoint location.

## Restore a Pod from a checkpoint

Create a new Pod that sets `spec.restoreFrom` to the name of the
`PodCheckpoint`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-pod-restored
  namespace: default
spec:
  restoreFrom: example-checkpoint
  containers:
  - name: app
    image: registry.example.com/example-app:v1
```

Apply the manifest:

```shell
kubectl apply -f restored-pod.yaml
```

When a Pod uses `spec.restoreFrom`, Kubernetes checks that the Pod spec matches
the Pod template captured in the checkpoint. The API server also adds a node
affinity rule so that, during alpha, the scheduler places the restored Pod on
the node that holds the checkpoint data.

Check the restored Pod:

```shell
kubectl get pod example-pod-restored
```

When restore succeeds, the Pod transitions to `Running`.

## Alpha limitations

In Kubernetes v1.37, Pod-level checkpoint and restore has these alpha
limitations:

* Restore is supported only on the same node where the checkpoint was created.
* The source Pod continues running after a checkpoint.
* Kubernetes does not preserve established TCP connections across checkpoint and
  restore.
* The restored Pod spec must match the Pod template captured in the checkpoint,
  except for fields introduced by the restore flow.
* Shared Pod resources such as volumes require support from the container
  runtime and the workload. Check the documentation for your runtime before
  relying on these resources across restore.
* Checkpointing temporarily freezes the source Pod. During that window, the Pod
  can be unavailable.

## {{% heading "whatsnext" %}}

* Learn more about the design in the Kubernetes Enhancement Proposal (KEP):
  [Pod-Level Checkpoint/Restore](https://github.com/kubernetes/enhancements/issues/5823).
* Learn about the existing container-level
  [Kubelet Checkpoint API](/docs/reference/node/kubelet-checkpoint-api/).
