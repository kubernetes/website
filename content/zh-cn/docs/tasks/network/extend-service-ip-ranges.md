---
reviewers:
- thockin
- dwinship
min-kubernetes-server-version: v1.29
title: 扩展 Service IP 范围
content_type: task
---
<!--
reviewers:
- thockin
- dwinship
min-kubernetes-server-version: v1.29
title: Extend Service IP Ranges
content_type: task
-->

<!-- overview -->

{{< feature-state feature_gate_name="MultiCIDRServiceAllocator" >}}

<!--
This document shares how to extend the existing Service IP range assigned to a cluster.
-->
本文将介绍如何扩展分配给集群的现有 Service IP 范围。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

<!-- steps -->

## API

<!--
Kubernetes clusters with kube-apiservers that have enabled the `MultiCIDRServiceAllocator`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) and the `networking.k8s.io/v1alpha1` API,
will create a new ServiceCIDR object that takes the well-known name `kubernetes`, and that uses an IP address range
based on the value of the `--service-cluster-ip-range` command line argument to kube-apiserver.
-->
如果 Kubernetes 集群的 kube-apiserver 启用了 `MultiCIDRServiceAllocator`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)和
`networking.k8s.io/v1alpha1` API，集群将创建一个新的 ServiceCIDR 对象，
该对象采用 `kubernetes` 这个众所周知的名称并基于 kube-apiserver 的 `--service-cluster-ip-range`
命令行参数的值来使用 IP 地址范围。

```sh
kubectl get servicecidr
```

```
NAME         CIDRS          AGE
kubernetes   10.96.0.0/28   17d
```

<!--
The well-known `kubernetes` Service, that exposes the kube-apiserver endpoint to the Pods, calculates
the first IP address from the default ServiceCIDR range and uses that IP address as its
cluster IP address.
-->
公认的 `kubernetes` Service 将 kube-apiserver 的端点暴露给 Pod，
计算出默认 ServiceCIDR 范围中的第一个 IP 地址，并将该 IP 地址用作其集群 IP 地址。

```sh
kubectl get service kubernetes
```

```
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   17d
```

<!--
The default Service, in this case, uses the ClusterIP 10.96.0.1, that has the corresponding IPAddress object.
-->
在本例中，默认 Service 使用具有对应 IPAddress 对象的 ClusterIP 10.96.0.1。

```sh
kubectl get ipaddress 10.96.0.1
```

```
NAME        PARENTREF
10.96.0.1   services/default/kubernetes
```

<!--
The ServiceCIDRs are protected with {{<glossary_tooltip text="finalizers" term_id="finalizer">}}, to avoid leaving Service ClusterIPs orphans;
the finalizer is only removed if there is another subnet that contains the existing IPAddresses or
there are no IPAddresses belonging to the subnet.
-->
ServiceCIDR 受到 {{<glossary_tooltip text="终结器" term_id="finalizer">}} 的保护，
以避免留下孤立的 Service ClusterIP；只有在存在包含现有 IPAddress 的另一个子网或者没有属于此子网的
IPAddress 时，才会移除终结器。

<!--
## Extend the number of available IPs for Services

There are cases that users will need to increase the number addresses available to Services, previously, increasing the Service range was a disruptive operation that could also cause data loss. With this new feature users only need to add a new ServiceCIDR to increase the number of available addresses.
-->
## 扩展 Service 可用的 IP 数量   {#extend-the-number-of-available-ips-for-services}

有时候用户需要增加可供 Service 使用的 IP 地址数量。
以前，增加 Service 范围是一个可能导致数据丢失的破坏性操作。
有了这个新的特性后，用户只需添加一个新的 ServiceCIDR 对象，便能增加可用地址的数量。

<!--
### Adding a new ServiceCIDR

On a cluster with a 10.96.0.0/28 range for Services, there is only 2^(32-28) - 2 = 14 IP addresses available. The `kubernetes.default` Service is always created; for this example, that leaves you with only 13 possible Services.
-->
### 添加新的 ServiceCIDR   {#adding-a-new-servicecidr}

对于 Service 范围为 10.96.0.0/28 的集群，只有 2^(32-28) - 2 = 14 个可用的 IP 地址。
`kubernetes.default` Service 始终会被创建；在这个例子中，你只剩下了 13 个可能的 Service。

```sh
for i in $(seq 1 13); do kubectl create service clusterip "test-$i" --tcp 80 -o json | jq -r .spec.clusterIP; done
```

```
10.96.0.11
10.96.0.5
10.96.0.12
10.96.0.13
10.96.0.14
10.96.0.2
10.96.0.3
10.96.0.4
10.96.0.6
10.96.0.7
10.96.0.8
10.96.0.9
error: failed to create ClusterIP service: Internal error occurred: failed to allocate a serviceIP: range is full
```

<!--
You can increase the number of IP addresses available for Services, by creating a new ServiceCIDR
that extends or adds new IP address ranges.
-->
通过创建一个扩展或新增 IP 地址范围的新 ServiceCIDR，你可以提高 Service 可用的 IP 地址数量。

```sh
cat <EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1alpha1
kind: ServiceCIDR
metadata:
  name: newcidr1
spec:
  cidrs:
  - 10.96.0.0/24
EOF
```

```
servicecidr.networking.k8s.io/newcidr1 created
```

<!--
and this will allow you to create new Services with ClusterIPs that will be picked from this new range.
-->
这将允许你创建新的 Service，其 ClusterIP 将从这个新的范围中选取。

```sh
for i in $(seq 13 16); do kubectl create service clusterip "test-$i" --tcp 80 -o json | jq -r .spec.clusterIP; done
```

```
10.96.0.48
10.96.0.200
10.96.0.121
10.96.0.144
```

<!--
### Deleting a ServiceCIDR

You cannot delete a ServiceCIDR if there are IPAddresses that depend on the ServiceCIDR.
-->
### 删除 ServiceCIDR   {#deleting-a-servicecidr}

如果存在依赖于 ServiceCIDR 的 IPAddress，你将无法删除 ServiceCIDR。

```sh
kubectl delete servicecidr newcidr1
```

```
servicecidr.networking.k8s.io "newcidr1" deleted
```

<!--
Kubernetes uses a finalizer on the ServiceCIDR to track this dependent relationship.
-->
Kubernetes 在 ServiceCIDR 上使用一个终结器来跟踪这种依赖关系。

```sh
kubectl get servicecidr newcidr1 -o yaml
```

```yaml
apiVersion: networking.k8s.io/v1alpha1
kind: ServiceCIDR
metadata:
  creationTimestamp: "2023-10-12T15:11:07Z"
  deletionGracePeriodSeconds: 0
  deletionTimestamp: "2023-10-12T15:12:45Z"
  finalizers:
    - networking.k8s.io/service-cidr-finalizer
  name: newcidr1
  resourceVersion: "1133"
  uid: 5ffd8afe-c78f-4e60-ae76-cec448a8af40
spec:
  cidrs:
    - 10.96.0.0/24
status:
  conditions:
    - lastTransitionTime: "2023-10-12T15:12:45Z"
      message:
        There are still IPAddresses referencing the ServiceCIDR, please remove
        them or create a new ServiceCIDR
      reason: OrphanIPAddress
      status: "False"
      type: Ready
```

<!--
By removing the Services containing the IP addresses that are blocking the deletion of the ServiceCIDR
-->
移除一些 Service，这些 Service 包含阻止删除 ServiceCIDR 的 IP 地址：

```sh
for i in $(seq 13 16); do kubectl delete service "test-$i" ; done
```

```
service "test-13" deleted
service "test-14" deleted
service "test-15" deleted
service "test-16" deleted
```

<!--
the control plane notices the removal. The control plane then removes its finalizer,
so that the ServiceCIDR that was pending deletion will actually be removed.
-->
控制平面会注意到这种移除操作。控制平面随后会移除其终结器，以便真正移除待删除的 ServiceCIDR。

```sh
kubectl get servicecidr newcidr1
```

```
Error from server (NotFound): servicecidrs.networking.k8s.io "newcidr1" not found
```
