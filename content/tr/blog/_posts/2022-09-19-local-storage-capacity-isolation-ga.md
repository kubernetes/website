---
layout: blog
title: "Kubernetes 1.25: Local Storage Capacity Isolation Reaches GA"
date: 2022-09-19
slug: local-storage-capacity-isolation-ga
author: >
  Jing Xu (Google)
---

Local ephemeral storage capacity isolation was introduced as a alpha feature in Kubernetes 1.7 and it went beta in 1.9. With Kubernetes 1.25 we are excited to announce general availability(GA) of this feature.

Pods use ephemeral local storage for scratch space, caching, and logs. The lifetime of local ephemeral storage does not extend beyond the life of the individual pod. It is exposed to pods using the container’s writable layer, logs directory, and `EmptyDir` volumes. Before this feature was introduced, there were issues related to the lack of local storage accounting and isolation, such as Pods not knowing how much local storage is available and being unable to request guaranteed local storage. Local storage is a best-effort resource and pods can be evicted due to other pods filling the local storage.

The [local storage capacity isolation feature](/docs/concepts/configuration/manage-resources-containers/#local-ephemeral-storage) allows users to manage local ephemeral storage in the same way as managing CPU and memory. It provides support for capacity isolation of shared storage between pods, such that a pod can be hard limited in its consumption of shared resources by evicting Pods if its consumption of shared storage exceeds that limit. It also allows setting ephemeral storage requests for resource reservation. The limits and requests for shared `ephemeral-storage` are similar to those for memory and CPU consumption.



### How to use local storage capacity isolation

A typical configuration for local ephemeral storage is to place all different kinds of ephemeral local data (emptyDir volumes, writeable layers, container images, logs) into one filesystem. Typically, both /var/lib/kubelet and /var/log are on the system's root filesystem. If users configure the local storage in different ways, kubelet might not be able to correctly measure disk usage and use this feature.


#### Setting requests and limits for local ephemeral storage
You can specify `ephemeral-storage` for managing local ephemeral storage. Each container of a Pod can specify either or both of the following:

* `spec.containers[].resources.limits.ephemeral-storage`
* `spec.containers[].resources.requests.ephemeral-storage`

In the following example, the Pod has two containers. The first container has a request of 8GiB of local ephemeral storage and a limit of 12GiB. The second container requests 2GiB of local storage, but no limit setting. Therefore, the Pod requests a total of 10GiB (8GiB+2GiB) of local ephemeral storage and enforces a limit of 12GiB of local ephemeral storage. It also sets emptyDir sizeLimit to 5GiB. With this setting in pod spec, it will affect how the scheduler makes a decision on scheduling pods and also how kubelet evict pods.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        ephemeral-storage: "8Gi"
      limits:
        ephemeral-storage: "12Gi"
    volumeMounts:
    - name: ephemeral
      mountPath: "/tmp"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        ephemeral-storage: "2Gi"
    volumeMounts:
    - name: ephemeral
      mountPath: "/tmp"
  volumes:
    - name: ephemeral
      emptyDir: {}
        sizeLimit: 5Gi
```

First of all, the scheduler ensures that the sum of the resource requests of the scheduled containers is less than the capacity of the node. In this case, the pod can be assigned to a node only if its available ephemeral storage (allocatable resource) has more than 10GiB.

Secondly, at container level, since one of the container sets resource limit, kubelet eviction manager will measure the disk usage of this container and evict the pod if the storage usage of the first container exceeds its limit (12GiB). At pod level,  kubelet works out an overall Pod storage limit by
adding up the limits of all the containers in that Pod. In this case, the total storage usage at pod level is the sum of the disk usage from all containers plus the Pod's `emptyDir` volumes. If this total usage exceeds the overall Pod storage limit (12GiB), then the kubelet also marks the Pod for eviction. 

Last, in this example, emptyDir volume sets its sizeLimit to 5Gi. It means that if this pod's emptyDir used up more local storage than 5GiB, the pod will be evicted from the node.

#### Setting resource quota and limitRange for local ephemeral storage

This feature adds two more resource quotas for storage. The request and limit set constraints on the total requests/limits of all containers’ in a namespace.
* `requests.ephemeral-storage`
* `limits.ephemeral-storage`

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: storage-resources
spec:
  hard:
    requests.ephemeral-storage: "10Gi"
    limits.ephemeral-storage: "20Gi"
```

Similar to CPU and memory, admin could use LimitRange to set default container’s local storage request/limit, and/or minimum/maximum resource constraints for a namespace. 

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: storage-limit-range
spec:
  limits:
  - default:
      ephemeral-storage: 10Gi
    defaultRequest:
      ephemeral-storage: 5Gi
    type: Container
```

Also, ephemeral-storage may be specified to reserve for kubelet or system. example, `--system-reserved=[cpu=100m][,][memory=100Mi][,][ephemeral-storage=10Gi][,][pid=1000] --kube-reserved=[cpu=100m][,][memory=100Mi][,][ephemeral-storage=5Gi][,][pid=1000]`. If your cluster node root disk capacity is 100Gi, after setting system-reserved and kube-reserved value, the available allocatable ephemeral storage would become 85Gi. The schedule will use this information to assign pods based on request and allocatable resources from each node. The eviction manager will also use allocatable resource to determine pod eviction. See more details from [Reserve Compute Resources for System Daemons](/docs/tasks/administer-cluster/reserve-compute-resources/).

### How do I get involved? 

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together.

We offer a huge thank you to all the contributors in [Kubernetes Storage SIG](https://github.com/kubernetes/community/tree/master/sig-storage) and CSI community who helped review the design and implementation of the project, including but not limited to the following:</p><ul><li>Benjamin Elder (<a href=https://github.com/BenTheElder>BenTheElder</a>)</li><li>Michelle Au (<a href=https://github.com/msau42>msau42</a>)</li><li>Tim Hockin (<a href=https://github.com/thockin>thockin</a>)</li><li>Jordan Liggitt (<a href=https://github.com/liggitt>liggitt</a>)</li><li>Xing Yang (<a href=https://github.com/xing-yang>xing-yang</a>)</li>
