---
layout: blog
title: 'Kubernetes 1.28: Node podresources API Graduates to GA'
date: 2023-08-23
slug: kubelet-podresources-api-GA
author: >
  Francesco Romani (Red Hat)
---

The podresources API is an API served by the kubelet locally on the node, which exposes the compute resources exclusively
allocated to containers. With the release of Kubernetes 1.28, that API is now Generally Available.

## What problem does it solve?

The kubelet can allocate exclusive resources to containers, like
[CPUs, granting exclusive access to full cores](/docs/tasks/administer-cluster/cpu-management-policies/)
or [memory, either regions or hugepages](/docs/tasks/administer-cluster/memory-manager/).
Workloads which require high performance, or low latency (or both) leverage these features.
The kubelet also can assign [devices to containers](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/).
Collectively, these features which enable exclusive assignments are known as "resource managers".

Without an API like podresources, the only possible option to learn about resource assignment was to read the state files the
resource managers use. While done out of necessity, the problem with this approach is the path and the format of these file are
both internal implementation details. Albeit very stable, the project reserves the right to change them freely.
Consuming the content of the state files is thus fragile and unsupported, and projects doing this are recommended to consider
moving to podresources API or to other supported APIs.

## Overview of the API

The podresources API was [initially proposed to enable device monitoring](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).
In order to enable monitoring agents, a key prerequisite is to enable introspection of device assignment, which is performed by the kubelet.
Serving this purpose was the initial goal of the API. The first iteration of the API only had a single function implemented, `List`,
to  return information about the assignment of devices to containers.
The API is used by [multus CNI](https://github.com/k8snetworkplumbingwg/multus-cni) and by
[GPU monitoring tools](https://github.com/NVIDIA/dcgm-exporter).

Since its inception, the podresources API increased its scope to cover other resource managers than device manager.
Starting from Kubernetes 1.20, the `List` API reports also CPU cores and memory regions (including hugepages); the API also
reports the NUMA locality of the devices, while the locality of CPUs and memory can be inferred from the system.

In Kubernetes 1.21, the API [gained](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2403-pod-resources-allocatable-resources/README.md)
the `GetAllocatableResources` function.
This newer API complements the existing `List` API and enables monitoring agents to determine the unallocated resources,
thus enabling new features built on top of the podresources API like a
[NUMA-aware scheduler plugin](https://github.com/kubernetes-sigs/scheduler-plugins/blob/master/pkg/noderesourcetopology/README.md).

Finally, in Kubernetes 1.27, another function, `Get` was introduced to be more friendly with CNI meta-plugins, to make it simpler to access resources
allocated to a specific pod, rather than having to filter through resources for all pods on the node. The `Get` function is currently alpha level.

## Consuming the API

The podresources API is served by the kubelet locally, on the same node on which is running.
On unix flavors, the endpoint is served over a unix domain socket; the default path is `/var/lib/kubelet/pod-resources/kubelet.sock`.
On windows, the endpoint is served over a named pipe; the default path is `npipe://\\.\pipe\kubelet-pod-resources`.

In order for the containerized monitoring application consume the API, the socket should be mounted inside the container.
A good practice is to mount the directory on which the podresources socket endpoint sits rather than the socket directly.
This will ensure that after a kubelet restart, the containerized monitor application will be able to re-connect to the socket.

An example manifest for a hypothetical monitoring agent consuming the podresources API and deployed as a DaemonSet could look like:

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: podresources-monitoring-app
  namespace: monitoring
spec:
  selector:
    matchLabels:
      name: podresources-monitoring
  template:
    metadata:
      labels:
        name: podresources-monitoring
    spec:
      containers:
      - args:
        - --podresources-socket=unix:///host-podresources/kubelet.sock
        command:
        - /bin/podresources-monitor
        image: podresources-monitor:latest  # just for an example
        volumeMounts:
        - mountPath: /host-podresources
          name: host-podresources
      serviceAccountName: podresources-monitor
      volumes:
      - hostPath:
          path: /var/lib/kubelet/pod-resources
          type: Directory
        name: host-podresources
```

I hope you find it straightforward to consume the podresources API  programmatically.
The kubelet API package provides the protocol file and the go type definitions; however, a client package is not yet available from the project,
and the existing code should not be used directly.
The [recommended](https://github.com/kubernetes/kubernetes/blob/v1.28.0-rc.0/pkg/kubelet/apis/podresources/client.go#L32)
approach is to reimplement the client in your projects, copying and pasting the related functions like for example
the multus project is [doing](https://github.com/k8snetworkplumbingwg/multus-cni/blob/v4.0.2/pkg/kubeletclient/kubeletclient.go).

When operating the containerized monitoring application consuming the podresources API, few points are worth highlighting to prevent "gotcha" moments:

- Even though the API only exposes data, and doesn't allow by design clients to mutate the kubelet state, the gRPC request/response model requires
  read-write access to the podresources API socket. In other words, it is not possible to limit the container mount to `ReadOnly`.
- Multiple clients are allowed to connect to the podresources socket and consume the API, since it is stateless.
- The kubelet has [built-in rate limits](https://github.com/kubernetes/kubernetes/pull/116459) to mitigate local Denial of Service attacks from
  misbehaving or malicious consumers. The consumers of the API must tolerate rate limit errors returned by the server. The rate limit is currently
  hardcoded and global, so misbehaving clients can consume all the quota and potentially starve correctly behaving clients.

## Future enhancements

For historical reasons, the podresources API has a less precise specification than typical kubernetes APIs (such as the Kubernetes HTTP API, or the container runtime interface).
This leads to unspecified behavior in corner cases.
An [effort](https://issues.k8s.io/119423) is ongoing to rectify this state and to have a more precise specification.

The [Dynamic Resource Allocation (DRA)](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/3063-dynamic-resource-allocation) infrastructure
is a major overhaul of the resource management.
The [integration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/3695-pod-resources-for-dra) with the podresources API
is already ongoing.

An [effort](https://issues.k8s.io/119817) is ongoing to recommend or create a reference client package ready to be consumed.

## Getting involved

This feature is driven by [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md).
Please join us to connect with the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!
