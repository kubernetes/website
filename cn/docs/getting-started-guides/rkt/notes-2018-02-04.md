---
approvers:
- dchen1107
- yifan-gu
title: Known Issues when Using rkt
---

The following features either are not supported or have large caveats when using the rkt container runtime. Increasing support for these items and others, including reasonable feature parity with the default container engine, is planned through future releases.

## Non-existent host volume paths

When mounting a host volume path that does not exist, rkt will error out. Under the Docker runtime, an empty directory will be created at the referenced path.

An example of a pod which will error out:

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    name: mount-dne
  name: mount-dne
spec:
  volumes:
  - name: does-not-exist
    hostPath:
      path: /does/not/exist
  containers:
    - name: exit
      image: busybox
      command: ["sh", "-c", "ls /test; sleep 60"]
      volumeMounts:
      - mountPath: /test
        name: does-not-exist
```

Also note that if `subPath` is specified in the container's volumeMounts and the `subPath` doesn't exist in the corresponding volume, the pod execution will fail as well.

## Kubectl attach

The `kubectl attach` command does not work under the rkt container runtime.
Because of this, some flags in `kubectl run` are not supported, including:

* `--attach=true`
* `--leave-stdin-open=true`
* `--rm=true`

## Port forwarding for kvm and fly stage1s

`kubectl port-forward` is not supported for pods that are executed with `stage1-kvm` or `stage1-fly`.

## Volume relabeling

Currently rkt supports only *per-pod* volume relabeling. After relabeling, the mounted volume is shared by all Containers in the pod. There is not yet a way to make the relabeled volume accessible to only one, or some subset, of Containers in the pod. [Kubernetes issue # 28187](https://github.com/kubernetes/kubernetes/issues/28187) has the details.

## kubectl get logs

Under rktnetes, `kubectl get logs` currently cannot get logs from applications that write them to directly to `/dev/stdout`. Currently such log messages are printed on the node's console.

## Init Containers

[Init Containers](/docs/concepts/workloads/pods/init-containers) are currently not supported.

## Container restart back-off

Exponential restart back-off for a failing container is currently not supported.

## Experimental NVIDIA GPU support

The `--feature-gates="Accelerators=true"` flag, and related [GPU features](https://git.k8s.io/community/contributors/design-proposals/resource-management/gpu-support.md) are not supported.

## QoS Classes

Under rkt, QoS classes do not adjust the `OOM Score` of Containers as occurs under Docker.

## HostPID and HostIPC namespaces

Setting the hostPID or hostIPC flags on a pod is not supported.

For example, the following pod will not run correctly:

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    name: host-ipc-pid
  name: host-ipc-pid
spec:
  hostIPC: true
  hostPID: true
  containers:
    ...
```

On the other hand, when running the pod with [stage1-fly](https://coreos.com/rkt/docs/latest/running-fly-stage1.html), the pod will be run in the host namespace.

## Container image updates (patch)

Patching a pod to change the image will result in the entire pod restarting, not just the container that was changed.

## ImagePullPolicy 'Always'

When the container's image pull policy is `Always`, rkt will always pull the image from remote even if the image has not changed at all.
This can add significant latency for large images.
The issue is tracked by rkt upstream at [#2937](https://github.com/coreos/rkt/issues/2937).
