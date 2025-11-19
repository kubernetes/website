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

{{< note >}}
<!--
While you can use this feature with an earlier version, the feature is only GA and officially supported since v1.33.
-->
虽然你可以在更早的版本中使用此特性，但此特性只有从 v1.33 版本开始才进阶至 GA（正式发布）并获得官方支持。
{{< /note >}}

<!-- steps -->

<!--
## Extend Service IP Ranges
-->
## 扩展 Service IP 范围   {#extend-service-ip-ranges}

<!--
Kubernetes clusters with kube-apiservers that have enabled the `MultiCIDRServiceAllocator`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) and have the
`networking.k8s.io/v1` API group active, will create a ServiceCIDR object that takes
the well-known name `kubernetes`, and that specifies an IP address range
based on the value of the `--service-cluster-ip-range` command line argument to kube-apiserver.
-->
如果 Kubernetes 集群的 kube-apiserver 启用了 `MultiCIDRServiceAllocator`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)且激活了
`networking.k8s.io/v1` API 组，集群将创建一个新的 ServiceCIDR 对象，
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
The ServiceCIDRs are protected with {{<glossary_tooltip text="finalizers" term_id="finalizer">}},
to avoid leaving Service ClusterIPs orphans; the finalizer is only removed if there is another subnet
that contains the existing IPAddresses or there are no IPAddresses belonging to the subnet.
-->
ServiceCIDR 受到 {{<glossary_tooltip text="终结器" term_id="finalizer">}} 的保护，
以避免留下孤立的 Service ClusterIP；只有在存在包含现有 IPAddress 的另一个子网或者没有属于此子网的
IPAddress 时，才会移除终结器。

<!--
## Extend the number of available IPs for Services

There are cases that users will need to increase the number addresses available to Services,
previously, increasing the Service range was a disruptive operation that could also cause data loss.
With this new feature users only need to add a new ServiceCIDR to increase the number of available addresses.
-->
## 扩展 Service 可用的 IP 数量   {#extend-the-number-of-available-ips-for-services}

有时候用户需要增加可供 Service 使用的 IP 地址数量。
以前，增加 Service 范围是一个可能导致数据丢失的破坏性操作。
有了这个新的特性后，用户只需添加一个新的 ServiceCIDR 对象，便能增加可用地址的数量。

<!--
### Adding a new ServiceCIDR

On a cluster with a 10.96.0.0/28 range for Services, there is only 2^(32-28) - 2 = 14
IP addresses available. The `kubernetes.default` Service is always created; for this example,
that leaves you with only 13 possible Services.
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
apiVersion: networking.k8s.io/v1
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
apiVersion: networking.k8s.io/v1
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

<!--
## Kubernetes Service CIDR Policies

Cluster administrators can implement policies to control the creation and
modification of ServiceCIDR resources within the cluster. This allows for
centralized management of the IP address ranges used for Services and helps
prevent unintended or conflicting configurations. Kubernetes provides mechanisms
like Validating Admission Policies to enforce these rules.
-->
## Kubernetes Service CIDR 策略   {#kubernetes-service-cidr-policies}

集群管理员可以实现策略来控制集群中 ServiceCIDR 资源的创建和修改。
这允许集中管理 Service 所使用的 IP 地址范围，有助于防止意外或冲突的配置。
Kubernetes 提供如验证准入策略（Validating Admission Policy）等机制来强制执行这些规则。

<!--
### Preventing Unauthorized ServiceCIDR Creation/Update using Validating Admission Policy

There can be situations that the cluster administrators want to restrict the
ranges that can be allowed or to completely deny any changes to the cluster
Service IP ranges.
-->
### 使用验证准入策略阻止未授权的 ServiceCIDR 创建或更新

在某些情况下，集群管理员可能希望限制允许的 IP 范围，或完全禁止对集群 Service IP 范围的更改。

{{< note >}}
<!--
The default "kubernetes" ServiceCIDR is created by the kube-apiserver
to provide consistency in the cluster and is required for the cluster to work,
so it always must be allowed. You can ensure your `ValidatingAdmissionPolicy`
doesn't restrict the default ServiceCIDR by adding the clause:
-->
默认的 "kubernetes" ServiceCIDR 是由 kube-apiserver 创建的，用于在集群中保证一致性，
并且是集群正常运行所必需的，因此必须始终被允许。你可以通过在 `ValidatingAdmissionPolicy`
中添加以下条件来确保不会限制默认的 ServiceCIDR：

```yaml
  matchConditions:
  - name: 'exclude-default-servicecidr'
    expression: "object.metadata.name != 'kubernetes'"
```

<!--
as in the examples below.
-->
如下例所示。

{{</ note >}}

<!--
#### Restrict Service CIDR ranges to some specific ranges

The following is an example of a `ValidatingAdmissionPolicy` that only allows
ServiceCIDRs to be created if they are subranges of the given `allowed` ranges.
(So the example policy would allow a ServiceCIDR with `cidrs: ['10.96.1.0/24']`
or `cidrs: ['2001:db8:0:0:ffff::/80', '10.96.0.0/20']` but would not allow a
ServiceCIDR with `cidrs: ['172.20.0.0/16']`.) You can copy this policy and change
the value of `allowed` to something appropriate for you cluster.
-->
#### 限制 Service CIDR 范围为某些特定范围

以下是一个 `ValidatingAdmissionPolicy` 的示例，它只允许在给定的 `allowed` 范围内的子范围创建 ServiceCIDR。
（因此示例的策略允许 ServiceCIDR 使用 `cidrs: ['10.96.1.0/24']` 或
`cidrs: ['2001:db8:0:0:ffff::/80', '10.96.0.0/20']`，但不允许 `cidrs: ['172.20.0.0/16']`。）  
你可以复制此策略，并将 `allowed` 的值更改为适合你集群的取值。

<!--
# For all CIDRs (newCIDR) listed in the spec.cidrs of the submitted ServiceCIDR
# object, check if there exists at least one CIDR (allowedCIDR) in the `allowed`
# list of the VAP such that the allowedCIDR fully contains the newCIDR.
-->
```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "servicecidrs.default"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["networking.k8s.io"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["servicecidrs"]
  matchConditions:
  - name: 'exclude-default-servicecidr'
    expression: "object.metadata.name != 'kubernetes'"
  variables:
  - name: allowed
    expression: "['10.96.0.0/16','2001:db8::/64']"
  validations:
  - expression: "object.spec.cidrs.all(newCIDR, variables.allowed.exists(allowedCIDR, cidr(allowedCIDR).containsCIDR(newCIDR)))"
  # 对提交的 ServiceCIDR 对象的 spec.cidrs 中列出的所有 CIDR（newCIDR），
  # 检查 VAP 的 `allowed` 列表中是否至少存在一个 CIDR（allowedCIDR），
  # 使 allowedCIDR 完全包含 newCIDR。
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "servicecidrs-binding"
spec:
  policyName: "servicecidrs.default"
  validationActions: [Deny,Audit]
```

<!--
Consult the [CEL documentation](https://kubernetes.io/docs/reference/using-api/cel/)
to learn more about CEL if you want to write your own validation `expression`.

#### Restrict any usage of the ServiceCIDR API

The following example demonstrates how to use a `ValidatingAdmissionPolicy` and
its binding to restrict the creation of any new Service CIDR ranges, excluding the default "kubernetes" ServiceCIDR:
-->
如果你想要编写自己的验证 `expression`，参阅 [CEL 文档](/zh-cn/docs/reference/using-api/cel/)以了解更多信息。

#### 限制任何对 ServiceCIDR API 的使用

以下示例展示了如何使用 `ValidatingAdmissionPolicy` 及其绑定，
来限制创建任何新的 Service CIDR 范围，但不包括默认的 "kubernetes" ServiceCIDR：

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "servicecidrs.deny"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["networking.k8s.io"]
      apiVersions: ["v1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["servicecidrs"]
  validations:
  - expression: "object.metadata.name == 'kubernetes'"
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "servicecidrs-deny-binding"
spec:
  policyName: "servicecidrs.deny"
  validationActions: [Deny,Audit]
```
