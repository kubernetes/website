---
title: IPv4/IPv6 雙協議棧
feature:
  title: IPv4/IPv6 雙協議棧
  description: >
    為 Pod 和 Service 分配 IPv4 和 IPv6 地址
content_type: concept
weight: 70
---

<!--
title: IPv4/IPv6 dual-stack
feature:
  title: IPv4/IPv6 dual-stack
  description: >
    Allocation of IPv4 and IPv6 addresses to Pods and Services
content_type: concept
reviewers:
- lachie83
- khenidak
- aramase
- bridgetkromhout
weight: 70
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

<!--
IPv4/IPv6 dual-stack networking enables the allocation of both IPv4 and IPv6 addresses to
{{< glossary_tooltip text="Pods" term_id="pod" >}} and {{< glossary_tooltip text="Services" term_id="service" >}}.
-->
IPv4/IPv6 雙協議棧網路能夠將 IPv4 和 IPv6 地址分配給
{{< glossary_tooltip text="Pod" term_id="pod" >}} 和
{{< glossary_tooltip text="Service" term_id="service" >}}。

<!--
IPv4/IPv6 dual-stack networking is enabled by default for your Kubernetes cluster starting in
1.21, allowing the simultaneous assignment of both IPv4 and IPv6 addresses.
-->
從 1.21 版本開始，Kubernetes 叢集預設啟用 IPv4/IPv6 雙協議棧網路，
以支援同時分配 IPv4 和 IPv6 地址。

<!-- body -->

<!--
## Supported Features
-->
## 支援的功能  {#supported-features}

<!--
IPv4/IPv6 dual-stack on your Kubernetes cluster provides the following features:
-->
Kubernetes 叢集的 IPv4/IPv6 雙協議棧可提供下面的功能：

<!--
* Dual-stack Pod networking (a single IPv4 and IPv6 address assignment per Pod)
* IPv4 and IPv6 enabled Services
* Pod off-cluster egress routing (eg. the Internet) via both IPv4 and IPv6 interfaces
-->
* 雙協議棧 pod 網路 (每個 pod 分配一個 IPv4 和 IPv6 地址)
* IPv4 和 IPv6 啟用的服務
* Pod 的叢集外出口透過 IPv4 和 IPv6 路由

<!--
## Prerequisites
-->
## 先決條件  {#prerequisites}

<!--
The following prerequisites are needed in order to utilize IPv4/IPv6 dual-stack Kubernetes clusters:
-->
為了使用 IPv4/IPv6 雙棧的 Kubernetes 叢集，需要滿足以下先決條件：

<!--
* Kubernetes 1.20 or later  
  For information about using dual-stack services with earlier
  Kubernetes versions, refer to the documentation for that version
  of Kubernetes.
* Provider support for dual-stack networking (Cloud provider or otherwise must be able to provide
  Kubernetes nodes with routable IPv4/IPv6 network interfaces)
* A [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) that
  supports dual-stack networking.
-->
* Kubernetes 1.20 版本或更高版本，有關更早 Kubernetes 版本的使用雙棧服務的資訊，
  請參考對應版本的 Kubernetes 文件。
* 提供商支援雙協議棧網路（雲提供商或其他提供商必須能夠為 Kubernetes
  節點提供可路由的 IPv4/IPv6 網路介面）
* 支援雙協議棧的[網路外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)

<!--
## Configure IPv4/IPv6 dual-stack
-->
## 配置 IPv4/IPv6 雙協議棧

<!--
To configure IPv4/IPv6 dual-stack, set dual-stack cluster network assignments:
-->
如果配置 IPv4/IPv6 雙棧，請分配雙棧叢集網路：
<!--
* kube-apiserver:
  * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
* kube-controller-manager:
  * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
  * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
  * `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6` defaults to /24 for IPv4 and /64 for IPv6
* kube-proxy:
  * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
* kubelet:
  * when there is no `--cloud-provider` the administrator can pass a comma-separated pair of IP
    addresses via `--node-ip` to manually configure dual-stack `.status.addresses` for that Node.
    If a Pod runs on that node in HostNetwork mode, the Pod reports these IP addresses in its
    `.status.podIPs` field.
    All `podIPs` in a node match the IP family preference defined by the `.status.addresses`
    field for that Node.
-->
* kube-apiserver:
  * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
* kube-controller-manager:
  * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>` 
  * `--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>`
  * `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6` 對於 IPv4 預設為 /24，
    對於 IPv6 預設為 /64
* kube-proxy:
  * `--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>`
* kubelet:
  * 當沒有 `--cloud-provider` 時，管理員可以透過 `--node-ip` 來傳遞逗號分隔的 IP 地址，
    為該節點手動配置雙棧 `.status.addresses`。
    如果 Pod 以 HostNetwork 模式在該節點上執行，則 Pod 會用 `.status.podIPs` 欄位來報告它的 IP 地址。
    一個節點中的所有 `podIP` 都會匹配該節點的由 `.status.addresses` 欄位定義的 IP 組。

{{< note >}}
<!--
An example of an IPv4 CIDR: `10.244.0.0/16` (though you would supply your own address range)

An example of an IPv6 CIDR: `fdXY:IJKL:MNOP:15::/64` (this shows the format but is not a valid
address - see [RFC 4193](https://tools.ietf.org/html/rfc4193))
-->
IPv4 CIDR 的一個例子：`10.244.0.0/16`（儘管你會提供你自己的地址範圍）。

IPv6 CIDR 的一個例子：`fdXY:IJKL:MNOP:15::/64`
（這裡演示的是格式而非有效地址 - 請看 [RFC 4193](https://tools.ietf.org/html/rfc4193)）。
{{< /note >}}

<!--
## Services
-->
## 服務  {#services}

<!--
You can create {{< glossary_tooltip text="Services" term_id="service" >}} which can use IPv4, IPv6, or both.

The address family of a Service defaults to the address family of the first service cluster IP
range (configured via the `--service-cluster-ip-range` flag to the kube-apiserver).

When you define a Service you can optionally configure it as dual stack. To specify the behavior you want, you
set the `.spec.ipFamilyPolicy` field to one of the following values:
-->
你可以使用 IPv4 或 IPv6 地址來建立
{{< glossary_tooltip text="Service" term_id="service" >}}。

服務的地址族預設為第一個服務叢集 IP 範圍的地址族（透過 kube-apiserver 的
`--service-cluster-ip-range` 引數配置）。

當你定義服務時，可以選擇將其配置為雙棧。若要指定所需的行為，你可以設定
`.spec.ipFamilyPolicy` 欄位為以下值之一：

<!--
* `SingleStack`: Single-stack service. The control plane allocates a cluster IP for the Service,
  using the first configured service cluster IP range.
* `PreferDualStack`:
  * Allocates IPv4 and IPv6 cluster IPs for the Service.
* `RequireDualStack`: Allocates Service `.spec.ClusterIPs` from both IPv4 and IPv6 address ranges.
  * Selects the `.spec.ClusterIP` from the list of `.spec.ClusterIPs` based on the address family
    of the first element in the `.spec.ipFamilies` array.
-->
* `SingleStack`：單棧服務。控制面使用第一個配置的服務叢集 IP 範圍為服務分配叢集 IP。
* `PreferDualStack`：
  * 為服務分配 IPv4 和 IPv6 叢集 IP 地址。
* `RequireDualStack`：從 IPv4 和 IPv6 的地址範圍分配服務的 `.spec.ClusterIPs`
  * 從基於在 `.spec.ipFamilies` 陣列中第一個元素的地址族的 `.spec.ClusterIPs`
    列表中選擇 `.spec.ClusterIP` 

<!--
If you would like to define which IP family to use for single stack or define the order of IP
families for dual-stack, you can choose the address families by setting an optional field,
`.spec.ipFamilies`, on the Service. 
-->
如果你想要定義哪個 IP 族用於單棧或定義雙棧 IP 族的順序，可以透過設定
服務上的可選欄位 `.spec.ipFamilies` 來選擇地址族。

{{< note >}}
<!--
The `.spec.ipFamilies` field is immutable because the `.spec.ClusterIP` cannot be reallocated on a
Service that already exists. If you want to change `.spec.ipFamilies`, delete and recreate the
Service.
-->
`.spec.ipFamilies` 欄位是不可變的，因為系統無法為已經存在的服務重新分配
`.spec.ClusterIP`。如果你想改變 `.spec.ipFamilies`，則需要刪除並重新建立服務。
{{< /note >}}

<!--
You can set `.spec.ipFamilies` to any of the following array values:
-->
你可以設定 `.spec.ipFamily` 為以下任何陣列值：

<!--
- `["IPv4"]`
- `["IPv6"]`
- `["IPv4","IPv6"]` (dual stack)
- `["IPv6","IPv4"]` (dual stack)
-->
- `["IPv4"]`
- `["IPv6"]`
- `["IPv4","IPv6"]` （雙棧）
- `["IPv6","IPv4"]` （雙棧）

<!--
The first family you list is used for the legacy `.spec.ClusterIP` field.
-->
你所列出的第一個地址族用於原來的 `.spec.ClusterIP` 欄位。

<!--
### Dual-stack Service configuration scenarios

These examples demonstrate the behavior of various dual-stack Service configuration scenarios.
-->
### 雙棧服務配置場景   {#dual-stack-service-configuration-scenarios}

以下示例演示多種雙棧服務配置場景下的行為。

<!--
#### Dual-stack options on new Services
-->
#### 新服務的雙棧選項    {#dual-stack-options-on-new-services}

<!--
1. This Service specification does not explicitly define `.spec.ipFamilyPolicy`. When you create
   this Service, Kubernetes assigns a cluster IP for the Service from the first configured
   `service-cluster-ip-range` and sets the `.spec.ipFamilyPolicy` to `SingleStack`. ([Services
   without selectors](/docs/concepts/services-networking/service/#services-without-selectors) and
   [headless Services](/docs/concepts/services-networking/service/#headless-services) with selectors 
   will behave in this same way.)
-->
1. 此服務規約中沒有顯式設定 `.spec.ipFamilyPolicy`。當你建立此服務時，Kubernetes
   從所配置的第一個 `service-cluster-ip-range` 種為服務分配一個叢集IP，並設定
   `.spec.ipFamilyPolicy` 為 `SingleStack`。
   （[無選擇算符的服務](/zh-cn/docs/concepts/services-networking/service/#services-without-selectors)
   和[無頭服務](/zh-cn/docs/concepts/services-networking/service/#headless-services)的行為方式
   與此相同。）

   {{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

<!--
1. This Service specification explicitly defines `PreferDualStack` in `.spec.ipFamilyPolicy`. When
   you create this Service on a dual-stack cluster, Kubernetes assigns both IPv4 and IPv6
   addresses for the service. The control plane updates the `.spec` for the Service to record the IP
   address assignments. The field `.spec.ClusterIPs` is the primary field, and contains both assigned 
   IP addresses; `.spec.ClusterIP` is a secondary field with its value calculated from
   `.spec.ClusterIPs`.
   
   * For the `.spec.ClusterIP` field, the control plane records the IP address that is from the
     same address family as the first service cluster IP range. 
   * On a single-stack cluster, the `.spec.ClusterIPs` and `.spec.ClusterIP` fields both only list
     one address. 
   * On a cluster with dual-stack enabled, specifying `RequireDualStack` in `.spec.ipFamilyPolicy`
     behaves the same as `PreferDualStack`.
-->
2. 此服務規約顯式地將 `.spec.ipFamilyPolicy` 設定為 `PreferDualStack`。
   當你在雙棧叢集上建立此服務時，Kubernetes 會為該服務分配 IPv4 和 IPv6 地址。
   控制平面更新服務的 `.spec` 以記錄 IP 地址分配。
   欄位 `.spec.ClusterIPs` 是主要欄位，包含兩個分配的 IP 地址；`.spec.ClusterIP` 是次要欄位，
   其取值從 `.spec.ClusterIPs` 計算而來。

   * 對於 `.spec.ClusterIP` 欄位，控制面記錄來自第一個服務叢集 IP 範圍
     對應的地址族的 IP 地址。
   * 對於單協議棧的叢集，`.spec.ClusterIPs` 和 `.spec.ClusterIP` 欄位都
     僅僅列出一個地址。
   * 對於啟用了雙協議棧的叢集，將 `.spec.ipFamilyPolicy` 設定為
     `RequireDualStack` 時，其行為與 `PreferDualStack` 相同。

   {{< codenew file="service/networking/dual-stack-preferred-svc.yaml" >}}

<!--
1. This Service specification explicitly defines `IPv6` and `IPv4` in `.spec.ipFamilies` as well
   as defining `PreferDualStack` in `.spec.ipFamilyPolicy`. When Kubernetes assigns an IPv6 and
   IPv4 address in `.spec.ClusterIPs`, `.spec.ClusterIP` is set to the IPv6 address because that is
   the first element in the `.spec.ClusterIPs` array, overriding the default.
-->
3. 下面的服務規約顯式地在 `.spec.ipFamilies` 中指定 `IPv6` 和 `IPv4`，並
   將 `.spec.ipFamilyPolicy` 設定為 `PreferDualStack`。
   當 Kubernetes 為 `.spec.ClusterIPs` 分配一個 IPv6 和一個 IPv4 地址時，
   `.spec.ClusterIP` 被設定成 IPv6 地址，因為它是 `.spec.ClusterIPs` 陣列中的第一個元素，
   覆蓋其預設值。

   {{< codenew file="service/networking/dual-stack-preferred-ipfamilies-svc.yaml" >}}

<!--
#### Dual-stack defaults on existing Services
-->
#### 現有服務的雙棧預設值   {#dual-stack-defaults-on-existing-services}

<!--
These examples demonstrate the default behavior when dual-stack is newly enabled on a cluster
where Services already exist. (Upgrading an existing cluster to 1.21 or beyond will enable
dual-stack.)
-->
下面示例演示了在服務已經存在的叢集上新啟用雙棧時的預設行為。
（將現有叢集升級到 1.21 或者更高版本會啟用雙協議棧支援。）

<!--
1. When dual-stack is enabled on a cluster, existing Services (whether `IPv4` or `IPv6`) are
   configured by the control plane to set `.spec.ipFamilyPolicy` to `SingleStack` and set
   `.spec.ipFamilies` to the address family of the existing Service. The existing Service cluster IP
   will be stored in `.spec.ClusterIPs`.
-->
1. 在叢集上啟用雙棧時，控制面會將現有服務（無論是 `IPv4` 還是 `IPv6`）配置
   `.spec.ipFamilyPolicy` 為 `SingleStack` 並設定 `.spec.ipFamilies`
   為服務的當前地址族。

   {{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

   <!--
   You can validate this behavior by using kubectl to inspect an existing service.
   -->
   你可以透過使用 kubectl 檢查現有服務來驗證此行為。

   ```shell
   kubectl get svc my-service -o yaml
   ```

   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     labels:
       app: MyApp
     name: my-service
   spec:
     clusterIP: 10.0.197.123
     clusterIPs:
     - 10.0.197.123
     ipFamilies:
     - IPv4
     ipFamilyPolicy: SingleStack
     ports:
     - port: 80
       protocol: TCP
       targetPort: 80
     selector:
       app: MyApp
     type: ClusterIP
   status:
     loadBalancer: {}
   ```

<!--
1. When dual-stack is enabled on a cluster, existing
   [headless Services](/docs/concepts/services-networking/service/#headless-services) with selectors
   are configured by the control plane to set `.spec.ipFamilyPolicy` to `SingleStack` and set
   `.spec.ipFamilies` to the address family of the first service cluster IP range (configured via the
   `--service-cluster-ip-range` flag to the kube-apiserver) even though `.spec.ClusterIP` is set to
   `None`.
-->
2. 在叢集上啟用雙棧時，帶有選擇算符的現有
   [無頭服務](/zh-cn/docs/concepts/services-networking/service/#headless-services)
   由控制面設定 `.spec.ipFamilyPolicy` 為 `SingleStack`
   並設定 `.spec.ipFamilies` 為第一個服務叢集 IP 範圍的地址族（透過配置 kube-apiserver 的
   `--service-cluster-ip-range` 引數），即使 `.spec.ClusterIP` 的設定值為 `None` 也如此。

   {{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

   <!--
   You can validate this behavior by using kubectl to inspect an existing headless service with selectors.
   -->
   你可以透過使用 kubectl 檢查帶有選擇算符的現有無頭服務來驗證此行為。

   ```shell
   kubectl get svc my-service -o yaml
   ```

   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     labels:
       app: MyApp
     name: my-service
   spec:
     clusterIP: None
     clusterIPs:
     - None
     ipFamilies:
     - IPv4
     ipFamilyPolicy: SingleStack
     ports:
     - port: 80
       protocol: TCP
       targetPort: 80
     selector:
       app: MyApp
   ```

<!--
#### Switching Services between single-stack and dual-stack
-->
#### 在單棧和雙棧之間切換服務   {#switching-services-between-single-stack-and-dual-stack}

<!--
Services can be changed from single-stack to dual-stack and from dual-stack to single-stack.
-->
服務可以從單棧更改為雙棧，也可以從雙棧更改為單棧。

<!--
1. To change a Service from single-stack to dual-stack, change `.spec.ipFamilyPolicy` from
   `SingleStack` to `PreferDualStack` or `RequireDualStack` as desired. When you change this
   Service from single-stack to dual-stack, Kubernetes assigns the missing address family so that the
   Service now has IPv4 and IPv6 addresses.

   Edit the Service specification updating the `.spec.ipFamilyPolicy` from `SingleStack` to `PreferDualStack`.
-->
1. 要將服務從單棧更改為雙棧，根據需要將 `.spec.ipFamilyPolicy` 從 `SingleStack` 改為
   `PreferDualStack` 或 `RequireDualStack`。
   當你將此服務從單棧更改為雙棧時，Kubernetes 將分配缺失的地址族，
   以便現在該服務具有 IPv4 和 IPv6 地址。
   編輯服務規約將 `.spec.ipFamilyPolicy` 從 `SingleStack` 改為 `PreferDualStack`。

   <!--
   Before:
   -->
   之前：

   ```yaml
   spec:
     ipFamilyPolicy: SingleStack
   ```

   <!--
   After:
   -->
   之後：

   ```yaml
   spec:
     ipFamilyPolicy: PreferDualStack
   ```

<!--
1. To change a Service from dual-stack to single-stack, change `.spec.ipFamilyPolicy` from
   `PreferDualStack` or `RequireDualStack` to `SingleStack`. When you change this Service from
   dual-stack to single-stack, Kubernetes retains only the first element in the `.spec.ClusterIPs`
   array, and sets `.spec.ClusterIP` to that IP address and sets `.spec.ipFamilies` to the address
   family of `.spec.ClusterIPs`.
-->
2. 要將服務從雙棧更改為單棧，請將 `.spec.ipFamilyPolicy` 從 `PreferDualStack` 或
   `RequireDualStack` 改為 `SingleStack`。
   當你將此服務從雙棧更改為單棧時，Kubernetes 只保留 `.spec.ClusterIPs`
   陣列中的第一個元素，並設定 `.spec.ClusterIP` 為那個 IP 地址，
   並設定 `.spec.ipFamilies` 為 `.spec.ClusterIPs` 地址族。

<!--
### Headless Services without selector
-->
### 無選擇算符的無頭服務   {#headless-services-without-selector}

<!--
For [Headless Services without selectors](/docs/concepts/services-networking/service/#without-selectors)
and without `.spec.ipFamilyPolicy` explicitly set, the `.spec.ipFamilyPolicy` field defaults
to `RequireDualStack`.
-->
對於[不帶選擇算符的無頭服務](/zh-cn/docs/concepts/services-networking/service/#without-selectors)，
若沒有顯式設定 `.spec.ipFamilyPolicy`，則 `.spec.ipFamilyPolicy`
欄位預設設定為 `RequireDualStack`。

<!--
### Service type LoadBalancer
-->
### LoadBalancer 型別服務   {#service-type-loadbalancer}

<!--
To provision a dual-stack load balancer for your Service:

* Set the `.spec.type` field to `LoadBalancer`
* Set `.spec.ipFamilyPolicy` field to `PreferDualStack` or `RequireDualStack`
-->
要為你的服務提供雙棧負載均衡器：

* 將 `.spec.type` 欄位設定為 `LoadBalancer` 
* 將 `.spec.ipFamilyPolicy` 欄位設定為 `PreferDualStack` 或者 `RequireDualStack`

{{< note >}}
<!--
To use a dual-stack `LoadBalancer` type Service, your cloud provider must support IPv4 and IPv6
load balancers.
-->
為了使用雙棧的負載均衡器型別服務，你的雲驅動必須支援 IPv4 和 IPv6 的負載均衡器。
{{< /note >}}

<!--
## Egress traffic
-->
## 出站流量    {#egress-traffic}

<!--
If you want to enable egress traffic in order to reach off-cluster destinations (eg. the public
Internet) from a Pod that uses non-publicly routable IPv6 addresses, you need to enable the Pod to
use a publicly routed IPv6 address via a mechanism such as transparent proxying or IP
masquerading. The [ip-masq-agent](https://github.com/kubernetes-sigs/ip-masq-agent) project
supports IP masquerading on dual-stack clusters.
-->
如果你要啟用出站流量，以便使用非公開路由 IPv6 地址的 Pod 到達叢集外地址
（例如公網），則需要透過透明代理或 IP 偽裝等機制使 Pod 使用公共路由的
IPv6 地址。
[ip-masq-agent](https://github.com/kubernetes-sigs/ip-masq-agent)專案
支援在雙棧叢集上進行 IP 偽裝。

{{< note >}}
<!--
Ensure your {{< glossary_tooltip text="CNI" term_id="cni" >}} provider supports IPv6.
-->
確認你的 {{< glossary_tooltip text="CNI" term_id="cni" >}} 驅動支援 IPv6。
{{< /note >}}

<!--
## Windows support

Kubernetes on Windows does not support single-stack "IPv6-only" networking. However,
dual-stack IPv4/IPv6 networking for pods and nodes with single-family services
is supported.

You can use IPv4/IPv6 dual-stack networking with `l2bridge` networks.
-->
## Windows 支援   {#windows-support}

Windows 上的 Kubernetes 不支援單棧“僅 IPv6” 網路。 然而，
對於 Pod 和節點而言，僅支援單棧形式服務的雙棧 IPv4/IPv6 網路是被支援的。

你可以使用 `l2bridge` 網路來實現 IPv4/IPv6 雙棧聯網。

{{< note >}}
<!--
Overlay (VXLAN) networks on Windows **do not** support dual-stack networking.
-->
Windows 上的 Overlay (VXLAN) 網路**不**支援雙棧網路。
{{< /note >}}

<!--
You can read more about the different network modes for Windows within the
[Networking on Windows](/docs/concepts/services-networking/windows-networking#network-modes) topic.
-->
關於 Windows 的不同網路模式，你可以進一步閱讀
[Windows 上的網路](/zh-cn/docs/concepts/services-networking/windows-networking#network-modes)。

## {{% heading "whatsnext" %}}

<!--
* [Validate IPv4/IPv6 dual-stack](/docs/tasks/network/validate-dual-stack) networking
* [Enable dual-stack networking using kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/)
-->
* [驗證 IPv4/IPv6 雙協議棧](/zh-cn/docs/tasks/network/validate-dual-stack)網路
* [使用 kubeadm 啟用雙協議棧網路](/zh-cn/docs/setup/production-environment/tools/kubeadm/dual-stack-support/)
