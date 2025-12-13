---
reviewers:
- thockin
- dwinship
min-kubernetes-server-version: v1.29
title: 擴展 Service IP 範圍
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
本文將介紹如何擴展分配給叢集的現有 Service IP 範圍。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

{{< note >}}
<!--
While you can use this feature with an earlier version, the feature is only GA and officially supported since v1.33.
-->
雖然你可以在更早的版本中使用此特性，但此特性只有從 v1.33 版本開始才進階至 GA（正式發佈）並獲得官方支持。
{{< /note >}}

<!-- steps -->

<!--
## Extend Service IP Ranges
-->
## 擴展 Service IP 範圍   {#extend-service-ip-ranges}

<!--
Kubernetes clusters with kube-apiservers that have enabled the `MultiCIDRServiceAllocator`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) and have the
`networking.k8s.io/v1` API group active, will create a ServiceCIDR object that takes
the well-known name `kubernetes`, and that specifies an IP address range
based on the value of the `--service-cluster-ip-range` command line argument to kube-apiserver.
-->
如果 Kubernetes 叢集的 kube-apiserver 啓用了 `MultiCIDRServiceAllocator`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)且激活了
`networking.k8s.io/v1` API 組，叢集將創建一個新的 ServiceCIDR 對象，
該對象採用 `kubernetes` 這個衆所周知的名稱並基於 kube-apiserver 的 `--service-cluster-ip-range`
命令列參數的值來使用 IP 地址範圍。

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
公認的 `kubernetes` Service 將 kube-apiserver 的端點暴露給 Pod，
計算出預設 ServiceCIDR 範圍中的第一個 IP 地址，並將該 IP 地址用作其叢集 IP 地址。

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
在本例中，預設 Service 使用具有對應 IPAddress 對象的 ClusterIP 10.96.0.1。

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
ServiceCIDR 受到 {{<glossary_tooltip text="終結器" term_id="finalizer">}} 的保護，
以避免留下孤立的 Service ClusterIP；只有在存在包含現有 IPAddress 的另一個子網或者沒有屬於此子網的
IPAddress 時，纔會移除終結器。

<!--
## Extend the number of available IPs for Services

There are cases that users will need to increase the number addresses available to Services,
previously, increasing the Service range was a disruptive operation that could also cause data loss.
With this new feature users only need to add a new ServiceCIDR to increase the number of available addresses.
-->
## 擴展 Service 可用的 IP 數量   {#extend-the-number-of-available-ips-for-services}

有時候使用者需要增加可供 Service 使用的 IP 地址數量。
以前，增加 Service 範圍是一個可能導致資料丟失的破壞性操作。
有了這個新的特性後，使用者只需添加一個新的 ServiceCIDR 對象，便能增加可用地址的數量。

<!--
### Adding a new ServiceCIDR

On a cluster with a 10.96.0.0/28 range for Services, there is only 2^(32-28) - 2 = 14
IP addresses available. The `kubernetes.default` Service is always created; for this example,
that leaves you with only 13 possible Services.
-->
### 添加新的 ServiceCIDR   {#adding-a-new-servicecidr}

對於 Service 範圍爲 10.96.0.0/28 的叢集，只有 2^(32-28) - 2 = 14 個可用的 IP 地址。
`kubernetes.default` Service 始終會被創建；在這個例子中，你只剩下了 13 個可能的 Service。

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
通過創建一個擴展或新增 IP 地址範圍的新 ServiceCIDR，你可以提高 Service 可用的 IP 地址數量。

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
這將允許你創建新的 Service，其 ClusterIP 將從這個新的範圍中選取。

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
### 刪除 ServiceCIDR   {#deleting-a-servicecidr}

如果存在依賴於 ServiceCIDR 的 IPAddress，你將無法刪除 ServiceCIDR。

```sh
kubectl delete servicecidr newcidr1
```

```
servicecidr.networking.k8s.io "newcidr1" deleted
```

<!--
Kubernetes uses a finalizer on the ServiceCIDR to track this dependent relationship.
-->
Kubernetes 在 ServiceCIDR 上使用一個終結器來跟蹤這種依賴關係。

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
移除一些 Service，這些 Service 包含阻止刪除 ServiceCIDR 的 IP 地址：

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
控制平面會注意到這種移除操作。控制平面隨後會移除其終結器，以便真正移除待刪除的 ServiceCIDR。

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

叢集管理員可以實現策略來控制叢集中 ServiceCIDR 資源的創建和修改。
這允許集中管理 Service 所使用的 IP 地址範圍，有助於防止意外或衝突的設定。
Kubernetes 提供如驗證准入策略（Validating Admission Policy）等機制來強制執行這些規則。

<!--
### Preventing Unauthorized ServiceCIDR Creation/Update using Validating Admission Policy

There can be situations that the cluster administrators want to restrict the
ranges that can be allowed or to completely deny any changes to the cluster
Service IP ranges.
-->
### 使用驗證准入策略阻止未授權的 ServiceCIDR 創建或更新

在某些情況下，叢集管理員可能希望限制允許的 IP 範圍，或完全禁止對叢集 Service IP 範圍的更改。

{{< note >}}
<!--
The default "kubernetes" ServiceCIDR is created by the kube-apiserver
to provide consistency in the cluster and is required for the cluster to work,
so it always must be allowed. You can ensure your `ValidatingAdmissionPolicy`
doesn't restrict the default ServiceCIDR by adding the clause:
-->
預設的 "kubernetes" ServiceCIDR 是由 kube-apiserver 創建的，用於在叢集中保證一致性，
並且是叢集正常運行所必需的，因此必須始終被允許。你可以通過在 `ValidatingAdmissionPolicy`
中添加以下條件來確保不會限制預設的 ServiceCIDR：

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
#### 限制 Service CIDR 範圍爲某些特定範圍

以下是一個 `ValidatingAdmissionPolicy` 的示例，它只允許在給定的 `allowed` 範圍內的子範圍創建 ServiceCIDR。
（因此示例的策略允許 ServiceCIDR 使用 `cidrs: ['10.96.1.0/24']` 或
`cidrs: ['2001:db8:0:0:ffff::/80', '10.96.0.0/20']`，但不允許 `cidrs: ['172.20.0.0/16']`。）  
你可以複製此策略，並將 `allowed` 的值更改爲適合你叢集的取值。

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
  # 對提交的 ServiceCIDR 對象的 spec.cidrs 中列出的所有 CIDR（newCIDR），
  # 檢查 VAP 的 `allowed` 列表中是否至少存在一個 CIDR（allowedCIDR），
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
如果你想要編寫自己的驗證 `expression`，參閱 [CEL 文檔](/zh-cn/docs/reference/using-api/cel/)以瞭解更多資訊。

#### 限制任何對 ServiceCIDR API 的使用

以下示例展示瞭如何使用 `ValidatingAdmissionPolicy` 及其綁定，
來限制創建任何新的 Service CIDR 範圍，但不包括預設的 "kubernetes" ServiceCIDR：

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
