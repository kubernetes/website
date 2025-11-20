---
title: 使用 kubeadm 支持雙協議棧
content_type: task
weight: 100
min-kubernetes-server-version: 1.21
---
<!--
title: Dual-stack support with kubeadm
content_type: task
weight: 100
min-kubernetes-server-version: 1.21
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

<!--
Your Kubernetes cluster includes [dual-stack](/docs/concepts/services-networking/dual-stack/)
networking, which means that cluster networking lets you use either address family.
In a cluster, the control plane can assign both an IPv4 address and an IPv6 address to a single
{{< glossary_tooltip text="Pod" term_id="pod" >}} or a {{< glossary_tooltip text="Service" term_id="service" >}}.
-->
你的叢集包含[雙協議棧](/zh-cn/docs/concepts/services-networking/dual-stack/)組網支持，
這意味着叢集網路允許你在兩種地址族間任選其一。在叢集中，控制面可以爲同一個
{{< glossary_tooltip text="Pod" term_id="pod" >}} 或者
{{< glossary_tooltip text="Service" term_id="service" >}}
同時賦予 IPv4 和 IPv6 地址。

<!-- body -->

## {{% heading "prerequisites" %}}

<!--
You need to have installed the {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}} tool,
following the steps from [Installing kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
-->
你需要已經遵從[安裝 kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)
中所給的步驟安裝了 {{< glossary_tooltip text="kubeadm" term_id="kubeadm" >}} 工具。

<!--
For each server that you want to use as a {{< glossary_tooltip text="node" term_id="node" >}},
make sure it allows IPv6 forwarding.
-->
針對你要作爲{{< glossary_tooltip text="節點" term_id="node" >}}使用的每臺伺服器，
確保其允許 IPv6 轉發。

<!--
### Enable IPv6 packet forwarding {#prerequisite-ipv6-forwarding}

To check if IPv6 packet forwarding is enabled:
-->
### 啓用 IPv6 資料包轉發   {#prerequisite-ipv6-forwarding}

檢查 IPv6 資料包轉發是否已被啓用：

```bash
sysctl net.ipv6.conf.all.forwarding
```

<!--
If the output is `net.ipv6.conf.all.forwarding = 1` it is already enabled. 
Otherwise it is not enabled yet.

To manually enable IPv6 packet forwarding:
-->
如果輸出爲 `net.ipv6.conf.all.forwarding = 1`，IPv6 資料包轉發已被啓用。
否則，IPv6 資料包轉發尚未被啓用。

手動啓用 IPv6 資料包轉發：

<!--
```bash
# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee -a /etc/sysctl.d/k8s.conf
net.ipv6.conf.all.forwarding = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```
-->
```bash
# 設置所需的 sysctl 參數，這些參數在重啓後仍然有效
cat <<EOF | sudo tee -a /etc/sysctl.d/k8s.conf
net.ipv6.conf.all.forwarding = 1
EOF

# 應用 sysctl 參數而無需重啓
sudo sysctl --system
```

<!--
You need to have an IPv4 and and IPv6 address range to use. Cluster operators typically
use private address ranges for IPv4. For IPv6, a cluster operator typically chooses a global
unicast address block from within `2000::/3`, using a range that is assigned to the operator.
You don't have to route the cluster's IP address ranges to the public internet.

The size of the IP address allocations should be suitable for the number of Pods and
Services that you are planning to run.
-->
你需要一個可以使用的 IPv4 和 IPv6 地址範圍。叢集操作人員通常對 IPv4 使用
私有的地址範圍。對於 IPv6，叢集操作人員通常會基於分配給他自己的地址範圍，
從 `2000::/3` 中選擇一個全局的單播地址塊。你不需要將叢集的 IP 地址範圍路由到公衆互聯網。

所分配的 IP 地址數量應該與你計劃運行的 Pod 和 Service 的數量相適應。

{{< note >}}
<!--
If you are upgrading an existing cluster with the `kubeadm upgrade` command,
`kubeadm` does not support making modifications to the pod IP address range
(“cluster CIDR”) nor to the cluster's Service address range (“Service CIDR”).
-->
如果你在使用 `kubeadm upgrade` 命令升級現有的叢集，`kubeadm` 不允許更改 Pod
的 IP 地址範圍（“叢集 CIDR”），也不允許更改叢集的 Service 地址範圍（“Service CIDR”）。
{{< /note >}}

<!--
### Create a dual-stack cluster

To create a dual-stack cluster with `kubeadm init` you can pass command line arguments
similar to the following example:
-->
### 創建雙協議棧叢集   {#create-a-dual-stack-cluster}

要使用 `kubeadm init` 創建一個雙協議棧叢集，你可以傳遞與下面的例子類似的命令列參數：

<!--
# These address ranges are examples
-->
```shell
# 這裏的地址範圍僅作示例使用
kubeadm init --pod-network-cidr=10.244.0.0/16,2001:db8:42:0::/56 --service-cidr=10.96.0.0/16,2001:db8:42:1::/112
```

<!--
To make things clearer, here is an example kubeadm
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` for the primary dual-stack control plane node.
-->
爲了更便於理解，參看下面的名爲 `kubeadm-config.yaml` 的 kubeadm
[設定檔案](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)，
該檔案用於雙協議棧控制面的主控制節點。

```yaml
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16,2001:db8:42:0::/56
  serviceSubnet: 10.96.0.0/16,2001:db8:42:1::/112
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: "10.100.0.1"
  bindPort: 6443
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::2"
```

<!--
`advertiseAddress` in InitConfiguration specifies the IP address that the API Server
will advertise it is listening on. The value of `advertiseAddress` equals the
`--apiserver-advertise-address` flag of `kubeadm init`.

Run kubeadm to initiate the dual-stack control plane node:
-->
InitConfiguration 中的 `advertiseAddress` 給出 API 伺服器將公告自身要監聽的
IP 地址。`advertiseAddress` 的取值與 `kubeadm init` 的標誌
`--apiserver-advertise-address` 的取值相同。

運行 kubeadm 來實例化雙協議棧控制面節點：

```shell
kubeadm init --config=kubeadm-config.yaml
```

<!--
The kube-controller-manager flags `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6`
are set with default values. See [configure IPv4/IPv6 dual stack](/docs/concepts/services-networking/dual-stack#configure-ipv4-ipv6-dual-stack).
-->
kube-controller-manager 標誌 `--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6`
是使用預設值來設置的。參見[設定 IPv4/IPv6 雙協議棧](/zh-cn/docs/concepts/services-networking/dual-stack#configure-ipv4-ipv6-dual-stack)。

{{< note >}}
<!--
The `--apiserver-advertise-address` flag does not support dual-stack.
-->
標誌 `--apiserver-advertise-address` 不支持雙協議棧。
{{< /note >}}

<!--
### Join a node to dual-stack cluster

Before joining a node, make sure that the node has IPv6 routable network interface and allows IPv6 forwarding.

Here is an example kubeadm [configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` for joining a worker node to the cluster.
-->
### 向雙協議棧叢集添加節點   {#join-a-node-to-dual-stack-cluster}

在添加節點之前，請確保該節點具有 IPv6 可路由的網路介面並且啓用了 IPv6 轉發。

下面的名爲 `kubeadm-config.yaml` 的 kubeadm
[設定檔案](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)示例用於向叢集中添加工作節點。

<!--
```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # change auth info above to match the actual token and CA certificate hash for your cluster
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::3"
```
-->
```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # 請更改上面的認證信息，使之與你的集羣中實際使用的令牌和 CA 證書匹配
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::3"
```

<!--
Also, here is an example kubeadm [configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` for joining another control plane node to the cluster.
-->
下面的名爲 `kubeadm-config.yaml` 的 kubeadm
[設定檔案](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)示例用於向叢集中添加另一個控制面節點。

<!--
```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
controlPlane:
  localAPIEndpoint:
    advertiseAddress: "10.100.0.2"
    bindPort: 6443
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # change auth info above to match the actual token and CA certificate hash for your cluster
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::4"
```
-->
```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
controlPlane:
  localAPIEndpoint:
    advertiseAddress: "10.100.0.2"
    bindPort: 6443
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # 請更改上面的認證信息，使之與你的集羣中實際使用的令牌和 CA 證書匹配
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::4"
```

<!--
`advertiseAddress` in JoinConfiguration.controlPlane specifies the IP address that the
API Server will advertise it is listening on. The value of `advertiseAddress` equals
the `--apiserver-advertise-address` flag of `kubeadm join`.
-->
JoinConfiguration.controlPlane 中的 `advertiseAddress` 設定 API 伺服器將公告自身要監聽的
IP 地址。`advertiseAddress` 的取值與 `kubeadm join` 的標誌
`--apiserver-advertise-address` 的取值相同。

```shell
kubeadm join --config=kubeadm-config.yaml
```

<!--
### Create a single-stack cluster
-->
### 創建單協議棧叢集    {#create-a-single-stack-cluster}

{{< note >}}
<!--
Dual-stack support doesn't mean that you need to use dual-stack addressing.
You can deploy a single-stack cluster that has the dual-stack networking feature enabled.
-->
雙協議棧支持並不意味着你需要使用雙協議棧來尋址。
你可以部署一個啓用了雙協議棧聯網特性的單協議棧叢集。
{{< /note >}}

<!--
To make things more clear, here is an example kubeadm
[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/)
`kubeadm-config.yaml` for the single-stack control plane node.
-->
爲了更便於理解，參看下面的名爲 `kubeadm-config.yaml` 的 kubeadm
[設定檔案](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)示例，
該檔案用於單協議棧控制面節點。

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/16
```

## {{% heading "whatsnext" %}}

<!--
* [Validate IPv4/IPv6 dual-stack](/docs/tasks/network/validate-dual-stack) networking
* Read about [Dual-stack](/docs/concepts/services-networking/dual-stack/) cluster networking
* Learn more about the kubeadm [configuration format](/docs/reference/config-api/kubeadm-config.v1beta4/)
-->
* [驗證 IPv4/IPv6 雙協議棧](/zh-cn/docs/tasks/network/validate-dual-stack)聯網
* 閱讀[雙協議棧](/zh-cn/docs/concepts/services-networking/dual-stack/)叢集網路
* 進一步瞭解 kubeadm [設定格式](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)
