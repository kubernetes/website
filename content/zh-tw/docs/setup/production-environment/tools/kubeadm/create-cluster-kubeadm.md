---
title: 使用 kubeadm 創建叢集
content_type: task
weight: 30
---
<!--
reviewers:
- sig-cluster-lifecycle
title: Creating a cluster with kubeadm
content_type: task
weight: 30
-->

<!-- overview -->

<!--
<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
Using `kubeadm`, you can create a minimum viable Kubernetes cluster that conforms to best practices.
In fact, you can use `kubeadm` to set up a cluster that will pass the
[Kubernetes Conformance tests](/blog/2017/10/software-conformance-certification/).
`kubeadm` also supports other cluster lifecycle functions, such as
[bootstrap tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) and cluster upgrades.
-->
<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
使用 `kubeadm`，你能創建一個符合最佳實踐的最小化 Kubernetes 叢集。
事實上，你可以使用 `kubeadm` 設定一個通過
[Kubernetes 一致性測試](/blog/2017/10/software-conformance-certification/)的叢集。
`kubeadm` 還支持其他叢集生命週期功能，
例如[啓動引導令牌](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)和叢集升級。

<!--
The `kubeadm` tool is good if you need:

- A simple way for you to try out Kubernetes, possibly for the first time.
- A way for existing users to automate setting up a cluster and test their application.
- A building block in other ecosystem and/or installer tools with a larger
  scope.
-->
`kubeadm` 工具很棒，如果你需要：

- 一個嘗試 Kubernetes 的簡單方法。
- 一個現有使用者可以自動設置叢集並測試其應用程序的途徑。
- 其他具有更大範圍的生態系統和/或安裝工具中的構建模塊。

<!--
You can install and use `kubeadm` on various machines: your laptop, a set
of cloud servers, a Raspberry Pi, and more. Whether you're deploying into the
cloud or on-premises, you can integrate `kubeadm` into provisioning systems such
as Ansible or Terraform.
-->
你可以在各種機器上安裝和使用 `kubeadm`：筆記本電腦、一組雲伺服器、Raspberry Pi 等。
無論是部署到雲還是本地，你都可以將 `kubeadm` 集成到 Ansible 或 Terraform 這類預設定系統中。

## {{% heading "prerequisites" %}}

<!--
To follow this guide, you need:

- One or more machines running a deb/rpm-compatible Linux OS; for example: Ubuntu or CentOS.
- 2 GiB or more of RAM per machine--any less leaves little room for your apps.
- At least 2 CPUs on the machine that you use as a control-plane node.
- Full network connectivity among all machines in the cluster. You can use either a
  public or a private network.
-->
要遵循本指南，你需要：

- 一臺或多臺運行兼容 deb/rpm 的 Linux 操作系統的計算機；例如：Ubuntu 或 CentOS。
- 每臺機器 2 GB 以上的內存，內存不足時應用會受限制。
- 用作控制平面節點的計算機上至少有 2 個 CPU。
- 叢集中所有計算機之間具有完全的網路連接。你可以使用公共網路或專用網路。

<!--
You also need to use a version of `kubeadm` that can deploy the version
of Kubernetes that you want to use in your new cluster.
-->
你還需要使用可以在新叢集中部署特定 Kubernetes 版本對應的 `kubeadm`。

<!--
[Kubernetes' version and version skew support policy](/docs/setup/release/version-skew-policy/#supported-versions)
applies to `kubeadm` as well as to Kubernetes overall.
Check that policy to learn about what versions of Kubernetes and `kubeadm`
are supported. This page is written for Kubernetes {{< param "version" >}}.
-->
[Kubernetes 版本及版本偏差策略](/zh-cn/releases/version-skew-policy/#supported-versions)適用於
`kubeadm` 以及整個 Kubernetes。
查閱該策略以瞭解支持哪些版本的 Kubernetes 和 `kubeadm`。
該頁面是爲 Kubernetes {{< param "version" >}} 編寫的。

<!--
The `kubeadm` tool's overall feature state is General Availability (GA). Some sub-features are
still under active development. The implementation of creating the cluster may change
slightly as the tool evolves, but the overall implementation should be pretty stable.
-->
`kubeadm` 工具的整體特性狀態爲正式發佈（GA）。一些子特性仍在積極開發中。
隨着工具的發展，創建叢集的實現可能會略有變化，但總體實現應相當穩定。

{{< note >}}
<!--
Any commands under `kubeadm alpha` are, by definition, supported on an alpha level.
-->
根據定義，在 `kubeadm alpha` 下的所有命令均在 Alpha 級別上受支持。
{{< /note >}}

<!-- steps -->

<!--
## Objectives
-->
## 目標 {#objectives}

<!--
* Install a single control-plane Kubernetes cluster
* Install a Pod network on the cluster so that your Pods can
  talk to each other
-->
* 安裝單個控制平面的 Kubernetes 叢集
* 在叢集上安裝 Pod 網路，以便你的 Pod 可以相互連通

<!--
## Instructions
-->
## 操作指南 {#instructions}

<!--
### Preparing the hosts

#### Component installation
-->
### 主機準備  {#preparing-the-hosts}

#### 安裝組件   {#component-installation}

<!--
Install a {{< glossary_tooltip term_id="container-runtime" text="container runtime" >}}
and kubeadm on all the hosts. For detailed instructions and other prerequisites, see
[Installing kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
-->
在所有主機上安裝{{< glossary_tooltip term_id="container-runtime" text="容器運行時" >}}和 kubeadm。
詳細說明和其他前提條件，請參見[安裝 kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)。

{{< note >}}
<!--
If you have already installed kubeadm, see the first two steps of the
[Upgrading Linux nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes)
document for instructions on how to upgrade kubeadm.

When you upgrade, the kubelet restarts every few seconds as it waits in a crashloop for
kubeadm to tell it what to do. This crashloop is expected and normal.
After you initialize your control-plane, the kubelet runs normally.
-->
如果你已經安裝了 kubeadm，
請查看[升級 Linux 節點](/zh-cn/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes)文檔的前兩步，
瞭解如何升級 kubeadm 的說明。

升級時，kubelet 每隔幾秒鐘重新啓動一次，
在 crashloop 狀態中等待 kubeadm 發佈指令。crashloop 狀態是正常現象。
初始化控制平面後，kubelet 將正常運行。
{{< /note >}}

<!--
#### Network setup

kubeadm similarly to other Kubernetes components tries to find a usable IP on
the network interfaces associated with a default gateway on a host. Such
an IP is then used for the advertising and/or listening performed by a component.
-->
#### 網路設置   {#network-setup}

kubeadm 與其他 Kubernetes 組件類似，會嘗試在與主機默認網關關聯的網路接口上找到可用的 IP 地址。
這個 IP 地址隨後用於由某組件執行的公告和/或監聽。

<!--
To find out what this IP is on a Linux host you can use:

```shell
ip route show # Look for a line starting with "default via"
```
-->
要在 Linux 主機上獲得此 IP 地址，你可以使用以下命令：

```shell
ip route show # 查找以 "default via" 開頭的行
```

{{< note >}}
<!--
If two or more default gateways are present on the host, a Kubernetes component will
try to use the first one it encounters that has a suitable global unicast IP address.
While making this choice, the exact ordering of gateways might vary between different
operating systems and kernel versions.
-->
如果主機上存在兩個或多個默認網關，Kubernetes 組件將嘗試使用遇到的第一個具有合適全局單播 IP 地址的網關。
在做出這個選擇時，網關的確切順序可能因不同的操作系統和內核版本而有所差異。
{{< /note >}}

<!--
Kubernetes components do not accept custom network interface as an option,
therefore a custom IP address must be passed as a flag to all components instances
that need such a custom configuration.
-->
Kubernetes 組件不接受自定義網路接口作爲選項，因此必須將自定義 IP
地址作爲標誌傳遞給所有需要此自定義設定的組件實例。

{{< note >}}
<!--
If the host does not have a default gateway and if a custom IP address is not passed
to a Kubernetes component, the component may exit with an error.
-->
如果主機沒有默認網關，並且沒有將自定義 IP 地址傳遞給 Kubernetes 組件，此組件可能會因錯誤而退出。
{{< /note >}}

<!--
To configure the API server advertise address for control plane nodes created with both
`init` and `join`, the flag `--apiserver-advertise-address` can be used.
Preferably, this option can be set in the [kubeadm API](/docs/reference/config-api/kubeadm-config.v1beta4)
as `InitConfiguration.localAPIEndpoint` and `JoinConfiguration.controlPlane.localAPIEndpoint`.
-->
要爲使用 `init` 或 `join` 創建的控制平面節點設定 API 伺服器的公告地址，
你可以使用 `--apiserver-advertise-address` 標誌。
最好在 [kubeadm API](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4)中使用
`InitConfiguration.localAPIEndpoint` 和 `JoinConfiguration.controlPlane.localAPIEndpoint`
來設置此選項。

<!--
For kubelets on all nodes, the `--node-ip` option can be passed in
`.nodeRegistration.kubeletExtraArgs` inside a kubeadm configuration file
(`InitConfiguration` or `JoinConfiguration`).

For dual-stack see
[Dual-stack support with kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support).
-->
對於所有節點上的 kubelet，`--node-ip` 選項可以在 kubeadm 設定文件
（`InitConfiguration` 或 `JoinConfiguration`）的 `.nodeRegistration.kubeletExtraArgs`
中設置。

有關雙協議棧細節參見[使用 kubeadm 支持雙協議棧](/zh-cn/docs/setup/production-environment/tools/kubeadm/dual-stack-support)。

<!--
The IP addresses that you assign to control plane components become part of their X.509 certificates'
subject alternative name fields. Changing these IP addresses would require
signing new certificates and restarting the affected components, so that the change in
certificate files is reflected. See
[Manual certificate renewal](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal)
for more details on this topic.
-->
你分配給控制平面組件的 IP 地址將成爲其 X.509 證書的使用者備用名稱字段的一部分。
更改這些 IP 地址將需要簽署新的證書並重啓受影響的組件，以便反映證書文件中的變化。
有關此主題的更多細節參見[手動續期證書](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal)。

{{< warning >}}
<!--
The Kubernetes project recommends against this approach (configuring all component instances
with custom IP addresses). Instead, the Kubernetes maintainers recommend to setup the host network,
so that the default gateway IP is the one that Kubernetes components auto-detect and use.
On Linux nodes, you can use commands such as `ip route` to configure networking; your operating
system might also provide higher level network management tools. If your node's default gateway
is a public IP address, you should configure packet filtering or other security measures that
protect the nodes and your cluster.
-->
Kubernetes 項目不推薦此方法（使用自定義 IP 地址設定所有組件實例）。
Kubernetes 維護者建議設置主機網路，使默認網關 IP 成爲 Kubernetes 組件自動檢測和使用的 IP。
對於 Linux 節點，你可以使用諸如 `ip route` 的命令來設定網路；
你的操作系統可能還提供更高級的網路管理工具。
如果節點的默認網關是公共 IP 地址，你應設定數據包過濾或其他保護節點和叢集的安全措施。
{{< /warning >}}

<!--
### Preparing the required container images
-->
### 準備所需的容器映像檔 {#preparing-the-required-container-images}

<!--
This step is optional and only applies in case you wish `kubeadm init` and `kubeadm join`
to not download the default container images which are hosted at `registry.k8s.io`.

Kubeadm has commands that can help you pre-pull the required images
when creating a cluster without an internet connection on its nodes.
See [Running kubeadm without an internet connection](/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection)
for more details.

Kubeadm allows you to use a custom image repository for the required images.
See [Using custom images](/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images)
for more details.
-->
這個步驟是可選的，只適用於你希望 `kubeadm init` 和 `kubeadm join` 不去下載存放在
`registry.k8s.io` 上的默認容器映像檔的情況。

當你在離線的節點上創建一個叢集的時候，kubeadm 有一些命令可以幫助你預拉取所需的映像檔。
閱讀[離線運行 kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection)
獲取更多的詳情。

kubeadm 允許你給所需要的映像檔指定一個自定義的映像檔倉庫。
閱讀[使用自定義映像檔](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images)獲取更多的詳情。

<!--
### Initializing your control-plane node
-->
### 初始化控制平面節點 {#initializing-your-control-plane-node}

<!--
The control-plane node is the machine where the control plane components run, including
{{< glossary_tooltip term_id="etcd" >}} (the cluster database) and the
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
(which the {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} command line tool
communicates with).
-->
控制平面節點是運行控制平面組件的機器，
包括 {{< glossary_tooltip term_id="etcd" >}}（叢集數據庫）
和 {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}
（命令列工具 {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} 與之通信）。

<!--
1. (Recommended) If you have plans to upgrade this single control-plane `kubeadm` cluster
   to [high availability](/docs/setup/production-environment/tools/kubeadm/high-availability/)
   you should specify the `--control-plane-endpoint` to set the shared endpoint for all control-plane nodes.
   Such an endpoint can be either a DNS name or an IP address of a load-balancer.
1. Choose a Pod network add-on, and verify whether it requires any arguments to
   be passed to `kubeadm init`. Depending on which
   third-party provider you choose, you might need to set the `--pod-network-cidr` to
   a provider-specific value. See [Installing a Pod network add-on](#pod-network).
-->
1. （推薦）如果計劃將單個控制平面 kubeadm 叢集升級成[高可用](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)，
   你應該指定 `--control-plane-endpoint` 爲所有控制平面節點設置共享端點。
   端點可以是負載均衡器的 DNS 名稱或 IP 地址。
2. 選擇一個 Pod 網路插件，並驗證是否需要爲 `kubeadm init` 傳遞參數。
   根據你選擇的第三方網路插件，你可能需要設置 `--pod-network-cidr` 的值。
   請參閱[安裝 Pod 網路附加組件](#pod-network)。

<!--
1. (Optional) `kubeadm` tries to detect the container runtime by using a list of well
   known endpoints. To use different container runtime or if there are more than one installed
   on the provisioned node, specify the `--cri-socket` argument to `kubeadm`. See
   [Installing a runtime](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).
-->
3. （可選）`kubeadm` 試圖通過使用已知的端點列表來檢測容器運行時。
   使用不同的容器運行時或在預設定的節點上安裝了多個容器運行時，請爲 `kubeadm init` 指定 `--cri-socket` 參數。
   請參閱[安裝運行時](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime)。

<!--
To initialize the control-plane node run:
-->
要初始化控制平面節點，請運行：

```bash
kubeadm init <args>
```

<!--
### Considerations about apiserver-advertise-address and ControlPlaneEndpoint
-->
### 關於 apiserver-advertise-address 和 ControlPlaneEndpoint 的注意事項 {#considerations-about-apiserver-advertise-address-and-controlplaneendpoint}

<!--
While `--apiserver-advertise-address` can be used to set the advertised address for this particular
control-plane node's API server, `--control-plane-endpoint` can be used to set the shared endpoint
for all control-plane nodes.
-->
`--apiserver-advertise-address` 可用於爲控制平面節點的 API 伺服器設置廣播地址，
`--control-plane-endpoint` 可用於爲所有控制平面節點設置共享端點。

<!--
`--control-plane-endpoint` allows both IP addresses and DNS names that can map to IP addresses.
Please contact your network administrator to evaluate possible solutions with respect to such mapping.
-->
`--control-plane-endpoint` 允許 IP 地址和可以映射到 IP 地址的 DNS 名稱。
請與你的網路管理員聯繫，以評估有關此類映射的可能解決方案。

<!--
Here is an example mapping:
-->
這是一個示例映射：

```console
192.168.0.102 cluster-endpoint
```

<!--
Where `192.168.0.102` is the IP address of this node and `cluster-endpoint` is a custom DNS name that maps to this IP.
This will allow you to pass `--control-plane-endpoint=cluster-endpoint` to `kubeadm init` and pass the same DNS name to
`kubeadm join`. Later you can modify `cluster-endpoint` to point to the address of your load-balancer in a
high availability scenario.
-->
其中 `192.168.0.102` 是此節點的 IP 地址，`cluster-endpoint` 是映射到該 IP 的自定義 DNS 名稱。
這將允許你將 `--control-plane-endpoint=cluster-endpoint` 傳遞給 `kubeadm init`，
並將相同的 DNS 名稱傳遞給 `kubeadm join`。稍後你可以修改 `cluster-endpoint`
以指向高可用性方案中的負載均衡器的地址。

<!--
Turning a single control plane cluster created without `--control-plane-endpoint` into a highly available cluster
is not supported by kubeadm.
-->
kubeadm 不支持將沒有 `--control-plane-endpoint` 參數的單個控制平面叢集轉換爲高可用性叢集。

<!--
### More information
-->
### 更多信息 {#more-information}

<!--
For more information about `kubeadm init` arguments, see the [kubeadm reference guide](/docs/reference/setup-tools/kubeadm/).
-->
有關 `kubeadm init` 參數的更多信息，請參見 [kubeadm 參考指南](/zh-cn/docs/reference/setup-tools/kubeadm/)。

<!--
To configure `kubeadm init` with a configuration file see
[Using kubeadm init with a configuration file](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).
-->
要使用設定文件設定 `kubeadm init` 命令，
請參見[帶設定文件使用 kubeadm init](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file)。

<!--
To customize control plane components, including optional IPv6 assignment to liveness probe
for control plane components and etcd server, provide extra arguments to each component as documented in
[custom arguments](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).
-->
要自定義控制平面組件，包括可選的對控制平面組件和 etcd 伺服器的活動探針提供 IPv6 支持，
請參閱[自定義參數](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)。

<!--
To reconfigure a cluster that has already been created see
[Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).
-->
要重新設定一個已經創建的叢集，
請參見[重新設定一個 kubeadm 叢集](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure)。

<!--
To run `kubeadm init` again, you must first [tear down the cluster](#tear-down).
-->
要再次運行 `kubeadm init`，你必須首先[卸載叢集](#tear-down)。

<!--
If you join a node with a different architecture to your cluster, make sure that your deployed DaemonSets
have container image support for this architecture.
-->
如果將具有不同架構的節點加入叢集，
請確保已部署的 DaemonSet 對這種體系結構具有容器映像檔支持。

<!--
`kubeadm init` first runs a series of prechecks to ensure that the machine
is ready to run Kubernetes. These prechecks expose warnings and exit on errors. `kubeadm init`
then downloads and installs the cluster control plane components. This may take several minutes.
After it finishes you should see:
-->
`kubeadm init` 首先運行一系列預檢查以確保機器爲運行 Kubernetes 準備就緒。
這些預檢查會顯示警告並在錯誤時退出。然後 `kubeadm init`
下載並安裝叢集控制平面組件。這可能會需要幾分鐘。完成之後你應該看到：

```none
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

<!--
To make kubectl work for your non-root user, run these commands, which are
also part of the `kubeadm init` output:
-->
要使非 root 使用者可以運行 kubectl，請運行以下命令，
它們也是 `kubeadm init` 輸出的一部分：

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

<!--
Alternatively, if you are the `root` user, you can run:
-->
或者，如果你是 `root` 使用者，則可以運行：

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

{{< warning >}}
<!--
The kubeconfig file `admin.conf` that `kubeadm init` generates contains a certificate with
`Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. The group `kubeadm:cluster-admins`
is bound to the built-in `cluster-admin` ClusterRole.
Do not share the `admin.conf` file with anyone.
-->
`kubeadm init` 生成的 kubeconfig 文件 `admin.conf`
包含一個帶有 `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin` 的證書。
`kubeadm:cluster-admins` 組被綁定到內置的 `cluster-admin` ClusterRole 上。
不要與任何人共享 `admin.conf` 文件。

<!--
`kubeadm init` generates another kubeconfig file `super-admin.conf` that contains a certificate with
`Subject: O = system:masters, CN = kubernetes-super-admin`.
`system:masters` is a break-glass, super user group that bypasses the authorization layer (for example RBAC).
Do not share the `super-admin.conf` file with anyone. It is recommended to move the file to a safe location.
-->
`kubeadm init` 生成另一個 kubeconfig 文件 `super-admin.conf`，
其中包含帶有 `Subject: O = system:masters, CN = kubernetes-super-admin` 的證書。
`system:masters` 是一個緊急訪問、超級使用者組，可以繞過授權層（例如 RBAC）。
不要與任何人共享 `super-admin.conf` 文件，建議將其移動到安全位置。

<!--
See
[Generating kubeconfig files for additional users](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users)
on how to use `kubeadm kubeconfig user` to generate kubeconfig files for additional users.
-->
有關如何使用 `kubeadm kubeconfig user` 爲其他使用者生成 kubeconfig
文件，請參閱[爲其他使用者生成 kubeconfig 文件](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users)。
{{< /warning >}}

<!--
Make a record of the `kubeadm join` command that `kubeadm init` outputs. You
need this command to [join nodes to your cluster](#join-nodes).
-->
記錄 `kubeadm init` 輸出的 `kubeadm join` 命令。
你需要此命令[將節點加入叢集](#join-nodes)。

<!--
The token is used for mutual authentication between the control-plane node and the joining
nodes. The token included here is secret. Keep it safe, because anyone with this
token can add authenticated nodes to your cluster. These tokens can be listed,
created, and deleted with the `kubeadm token` command. See the
[kubeadm reference guide](/docs/reference/setup-tools/kubeadm/kubeadm-token/).
-->
令牌用於控制平面節點和加入節點之間的相互身份驗證。
這裏包含的令牌是密鑰。確保它的安全，
因爲擁有此令牌的任何人都可以將經過身份驗證的節點添加到你的叢集中。
可以使用 `kubeadm token` 命令列出，創建和刪除這些令牌。
請參閱 [kubeadm 參考指南](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-token/)。

<!--
### Installing a Pod network add-on {#pod-network}
-->
### 安裝 Pod 網路附加組件 {#pod-network}

{{< caution >}}
<!--
This section contains important information about networking setup and
deployment order.
Read all of this advice carefully before proceeding.
-->
本節包含有關網路設置和部署順序的重要信息。在繼續之前，請仔細閱讀所有建議。

<!--
**You must deploy a
{{< glossary_tooltip text="Container Network Interface" term_id="cni" >}}
(CNI) based Pod network add-on so that your Pods can communicate with each other.
Cluster DNS (CoreDNS) will not start up before a network is installed.**
-->
**你必須部署一個基於 Pod 網路插件的{{< glossary_tooltip text="容器網路接口" term_id="cni" >}}（CNI），
以便你的 Pod 可以相互通信。在安裝網路之前，叢集 DNS (CoreDNS) 將不會啓動。**

<!--
- Take care that your Pod network must not overlap with any of the host
  networks: you are likely to see problems if there is any overlap.
  (If you find a collision between your network plugin's preferred Pod
  network and some of your host networks, you should think of a suitable
  CIDR block to use instead, then use that during `kubeadm init` with
  `--pod-network-cidr` and as a replacement in your network plugin's YAML).
-->
- 注意你的 Pod 網路不得與任何主機網路重疊：如果有重疊，你很可能會遇到問題。
  （如果你發現網路插件的首選 Pod 網路與某些主機網路之間存在衝突，
  則應考慮使用一個合適的 CIDR 塊來代替，
  然後在執行 `kubeadm init` 時使用 `--pod-network-cidr` 參數並在你的網路插件的 YAML 中替換它）。

<!--
- By default, `kubeadm` sets up your cluster to use and enforce use of
  [RBAC](/docs/reference/access-authn-authz/rbac/) (role based access
  control).
  Make sure that your Pod network plugin supports RBAC, and so do any manifests
  that you use to deploy it.
-->
- 默認情況下，`kubeadm` 將叢集設置爲使用和強制使用
  [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)（基於角色的訪問控制）。
  確保你的 Pod 網路插件支持 RBAC，以及用於部署它的清單也是如此。

<!--
- If you want to use IPv6--either dual-stack, or single-stack IPv6 only
  networking--for your cluster, make sure that your Pod network plugin
  supports IPv6.
  IPv6 support was added to CNI in [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0).
-->
- 如果要爲叢集使用 IPv6（雙協議棧或僅單協議棧 IPv6 網路），
  請確保你的 Pod 網路插件支持 IPv6。
  IPv6 支持已在 CNI [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0) 版本中添加。
{{< /caution >}}

{{< note >}}
<!--
Kubeadm should be CNI agnostic and the validation of CNI providers is out of the scope of our current e2e testing.
If you find an issue related to a CNI plugin you should log a ticket in its respective issue
tracker instead of the kubeadm or kubernetes issue trackers.
-->
kubeadm 應該是與 CNI 無關的，對 CNI 驅動進行驗證目前不在我們的端到端測試範疇之內。
如果你發現與 CNI 插件相關的問題，應在其各自的問題跟蹤器中記錄而不是在 kubeadm
或 kubernetes 問題跟蹤器中記錄。
{{< /note >}}

<!--
Several external projects provide Kubernetes Pod networks using CNI, some of which also
support [Network Policy](/docs/concepts/services-networking/network-policies/).
-->
一些外部項目爲 Kubernetes 提供使用 CNI 的 Pod 網路，
其中一些還支持[網路策略](/zh-cn/docs/concepts/services-networking/network-policies/)。

<!--
See a list of add-ons that implement the
[Kubernetes networking model](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).
-->
請參閱實現
[Kubernetes 網路模型](/zh-cn/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)的附加組件列表。

<!--
Please refer to the [Installing Addons](/docs/concepts/cluster-administration/addons/#networking-and-network-policy)
page for a non-exhaustive list of networking addons supported by Kubernetes.
You can install a Pod network add-on with the following command on the
control-plane node or a node that has the kubeconfig credentials:
-->
請參閱[安裝插件](/zh-cn/docs/concepts/cluster-administration/addons/#networking-and-network-policy)頁面，
瞭解 Kubernetes 支持的網路插件的非詳盡列表。
你可以使用以下命令在控制平面節點或具有 kubeconfig 憑據的節點上安裝 Pod 網路附加組件：

```bash
kubectl apply -f <add-on.yaml>
```

{{< note >}}
<!--
Only a few CNI plugins support Windows. More details and setup instructions can be found
in [Adding Windows worker nodes](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/#network-config).
-->
只有少數 CNI 插件支持 Windows，
更多詳細信息和設置說明請參閱[添加 Windows 工作節點](/zh-cn/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/#network-config)。
{{< /note >}}

<!--
You can install only one Pod network per cluster.
-->
每個叢集只能安裝一個 Pod 網路。

<!--
Once a Pod network has been installed, you can confirm that it is working by
checking that the CoreDNS Pod is `Running` in the output of `kubectl get pods --all-namespaces`.
And once the CoreDNS Pod is up and running, you can continue by joining your nodes.
-->
安裝 Pod 網路後，你可以通過在 `kubectl get pods --all-namespaces` 輸出中檢查
CoreDNS Pod 是否 `Running` 來確認其是否正常運行。
一旦 CoreDNS Pod 啓用並運行，你就可以繼續加入節點。

<!--
If your network is not working or CoreDNS is not in the `Running` state, check out the
[troubleshooting guide](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)
for `kubeadm`.
-->
如果你的網路無法正常工作或 CoreDNS 不在 `Running` 狀態，請查看 `kubeadm`
的[故障排除指南](/zh-cn/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)。

<!--
### Managed node labels
-->
### 託管節點標籤   {#managed-node-labels}

<!--
By default, kubeadm enables the [NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
admission controller that restricts what labels can be self-applied by kubelets on node registration.
The admission controller documentation covers what labels are permitted to be used with the kubelet `--node-labels` option.
The `node-role.kubernetes.io/control-plane` label is such a restricted label and kubeadm manually applies it using
a privileged client after a node has been created. To do that manually you can do the same by using `kubectl label`
and ensure it is using a privileged kubeconfig such as the kubeadm managed `/etc/kubernetes/admin.conf`.
-->
默認情況下，kubeadm 啓用
[NodeRestriction](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
准入控制器來限制 kubelet 在節點註冊時可以應用哪些標籤。准入控制器文檔描述 kubelet `--node-labels` 選項允許使用哪些標籤。
其中 `node-role.kubernetes.io/control-plane` 標籤就是這樣一個受限制的標籤，
kubeadm 在節點創建後使用特權客戶端手動應用此標籤。
你可以使用一個有特權的 kubeconfig，比如由 kubeadm 管理的 `/etc/kubernetes/admin.conf`，
通過執行 `kubectl label` 來手動完成操作。

<!--
### Control plane node isolation
-->
### 控制平面節點隔離 {#control-plane-node-isolation}

<!--
By default, your cluster will not schedule Pods on the control plane nodes for security
reasons. If you want to be able to schedule Pods on the control plane nodes,
for example for a single machine Kubernetes cluster, run:
-->
默認情況下，出於安全原因，你的叢集不會在控制平面節點上調度 Pod。
如果你希望能夠在單機 Kubernetes 叢集等控制平面節點上調度 Pod，請運行：

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

<!--
The output will look something like:
-->
輸出看起來像：

```
node "test-01" untainted
...
```

<!--
This will remove the `node-role.kubernetes.io/control-plane:NoSchedule` taint
from any nodes that have it, including the control plane nodes, meaning that the
scheduler will then be able to schedule Pods everywhere.
-->
這將從任何擁有 `node-role.kubernetes.io/control-plane:NoSchedule`
污點的節點（包括控制平面節點）上移除該污點。
這意味着調度程序將能夠在任何地方調度 Pod。

<!--
Additionally, you can execute the following command to remove the
[`node.kubernetes.io/exclude-from-external-load-balancers`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-exclude-from-external-load-balancers) label
from the control plane node, which excludes it from the list of backend servers:
-->
此外，你可以執行以下命令從控制平面節點中刪除
[`node.kubernetes.io/exclude-from-external-load-balancers`](/zh-cn/docs/reference/labels-annotations-taints/#node-kubernetes-io-exclude-from-external-load-balancers)
標籤，這會將其從後端伺服器列表中排除：

```bash
kubectl label nodes --all node.kubernetes.io/exclude-from-external-load-balancers-
```

<!--
### Adding more control plane nodes

See [Creating Highly Available Clusters with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
for steps on creating a high availability kubeadm cluster by adding more control plane nodes.

### Adding worker nodes {#join-nodes}

The worker nodes are where your workloads run.

The following pages show how to add Linux and Windows worker nodes to the cluster by using
the `kubeadm join` command:

* [Adding Linux worker nodes](/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/)
* [Adding Windows worker nodes](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)
-->
### 添加更多控制平面節點   {#adding-more-control-plane-nodes}

請參閱[使用 kubeadm 創建高可用性叢集](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)，
瞭解通過添加更多控制平面節點創建高可用性 kubeadm 叢集的步驟。

### 添加工作節點 {#join-nodes}

<!--
The worker nodes are where your workloads run.

The following pages show how to add Linux and Windows worker nodes to the cluster by using
the `kubeadm join` command:

* [Adding Linux worker nodes](/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/)
* [Adding Windows worker nodes](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)
-->
工作節點是工作負載運行的地方。

以下頁面展示如何使用 `kubeadm join` 命令將 Linux 和 Windows 工作節點添加到叢集：

* [添加 Linux 工作節點](/zh-cn/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/)
* [添加 Windows 工作節點](/zh-cn/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)

<!--
### (Optional) Controlling your cluster from machines other than the control-plane node
-->
### （可選）從控制平面節點以外的計算機控制叢集 {#optional-controlling-your-cluster-from-machines-other-than-the-control-plane-node}

<!--
In order to get a kubectl on some other computer (e.g. laptop) to talk to your
cluster, you need to copy the administrator kubeconfig file from your control-plane node
to your workstation like this:
-->
爲了使 kubectl 在其他計算機（例如筆記本電腦）上與你的叢集通信，
你需要將管理員 kubeconfig 文件從控制平面節點複製到工作站，如下所示：

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
<!--
The example above assumes SSH access is enabled for root. If that is not the
case, you can copy the `admin.conf` file to be accessible by some other user
and `scp` using that other user instead.

The `admin.conf` file gives the user _superuser_ privileges over the cluster.
This file should be used sparingly. For normal users, it's recommended to
generate an unique credential to which you grant privileges. You can do
this with the `kubeadm kubeconfig user --client-name <CN>`
command. That command will print out a KubeConfig file to STDOUT which you
should save to a file and distribute to your user. After that, grant
privileges by using `kubectl create (cluster)rolebinding`.
-->
上面的示例假定爲 root 使用者啓用了 SSH 訪問。如果不是這種情況，
你可以使用 `scp` 將 `admin.conf` 文件複製給其他允許訪問的使用者。

admin.conf 文件爲使用者提供了對叢集的超級使用者特權。
該文件應謹慎使用。對於普通使用者，建議生成一個你爲其授予特權的唯一證書。
你可以使用 `kubeadm kubeconfig user --client-name <CN>` 命令執行此操作。
該命令會將 KubeConfig 文件打印到 STDOUT，你應該將其保存到文件並分發給使用者。
之後，使用 `kubectl create (cluster)rolebinding` 授予特權。
{{< /note >}}

<!--
### (Optional) Proxying API Server to localhost
-->
### （可選）將 API 伺服器代理到本地主機 {#optional-proxying-api-server-to-localhost}

<!--
If you want to connect to the API Server from outside the cluster, you can use
`kubectl proxy`:
-->
如果你要從叢集外部連接到 API 伺服器，則可以使用 `kubectl proxy`：

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

<!--
You can now access the API Server locally at `http://localhost:8001/api/v1`
-->
你現在可以在 `http://localhost:8001/api/v1` 從本地訪問 API 伺服器。

<!--
## Clean up {#tear-down}
-->
## 清理 {#tear-down}

<!--
If you used disposable servers for your cluster, for testing, you can
switch those off and do no further clean up. You can use
`kubectl config delete-cluster` to delete your local references to the
cluster.
-->
如果你在叢集中使用了一次性伺服器進行測試，則可以關閉這些伺服器，而無需進一步清理。
你可以使用 `kubectl config delete-cluster` 刪除對叢集的本地引用。

<!--
However, if you want to deprovision your cluster more cleanly, you should
first [drain the node](/docs/reference/generated/kubectl/kubectl-commands#drain)
and make sure that the node is empty, then deconfigure the node.
-->
但是，如果要更乾淨地取消設定叢集，
則應首先[清空節點](/docs/reference/generated/kubectl/kubectl-commands#drain)並確保該節點爲空，
然後取消設定該節點。

<!--
### Remove the node
-->
### 移除節點   {#remove-the-node}

<!--
Talking to the control-plane node with the appropriate credentials, run:

```bash
kubectl drain <node name> --delete-emptydir-data --force --ignore-daemonsets
```
-->
使用適當的憑據與控制平面節點通信，運行：

```bash
kubectl drain <節點名稱> --delete-emptydir-data --force --ignore-daemonsets
```

<!--
Before removing the node, reset the state installed by `kubeadm`:
-->
在移除節點之前，請重置 `kubeadm` 安裝的狀態：

```bash
kubeadm reset
```

<!--
The reset process does not reset or clean up iptables rules or IPVS tables.
If you wish to reset iptables, you must do so manually:
-->
重置過程不會重置或清除 iptables 規則或 IPVS 表。如果你希望重置 iptables，則必須手動進行：

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

<!--
If you want to reset the IPVS tables, you must run the following command:
-->
如果要重置 IPVS 表，則必須運行以下命令：

```bash
ipvsadm -C
```

<!--
Now remove the node:

```bash
kubectl delete node <node name>
```
-->
現在移除節點：

```bash
kubectl delete node <節點名稱>
```

<!--
If you wish to start over, run `kubeadm init` or `kubeadm join` with the
appropriate arguments.
-->
如果你想重新開始，只需運行 `kubeadm init` 或 `kubeadm join` 並加上適當的參數。

<!--
### Clean up the control plane
-->
### 清理控制平面 {#clean-up-the-control-plane}

<!--
You can use `kubeadm reset` on the control plane host to trigger a best-effort
clean up.
-->
你可以在控制平面主機上使用 `kubeadm reset` 來觸發盡力而爲的清理。

<!--
See the [`kubeadm reset`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
reference documentation for more information about this subcommand and its
options.
-->
有關此子命令及其選項的更多信息，請參見
[`kubeadm reset`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/) 參考文檔。

<!--
## Version skew policy {#version-skew-policy}
-->
## 版本偏差策略 {#version-skew-policy}

<!--
While kubeadm allows version skew against some components that it manages, it is recommended that you
match the kubeadm version with the versions of the control plane components, kube-proxy and kubelet.
-->
雖然 kubeadm 允許所管理的組件有一定程度的版本偏差，
但是建議你將 kubeadm 的版本與控制平面組件、kube-proxy 和 kubelet 的版本相匹配。

<!--
### kubeadm's skew against the Kubernetes version
-->
### kubeadm 中的 Kubernetes 版本偏差 {#kubeadm-s-skew-against-the-kubernetes-version}

<!--
kubeadm can be used with Kubernetes components that are the same version as kubeadm
or one version older. The Kubernetes version can be specified to kubeadm by using the
`--kubernetes-version` flag of `kubeadm init` or the
[`ClusterConfiguration.kubernetesVersion`](/docs/reference/config-api/kubeadm-config.v1beta4/)
field when using `--config`. This option will control the versions
of kube-apiserver, kube-controller-manager, kube-scheduler and kube-proxy.
-->
kubeadm 可以與 Kubernetes 組件一起使用，這些組件的版本與 kubeadm 相同，或者比它大一個版本。
Kubernetes 版本可以通過使用 `--kubeadm init` 的 `--kubernetes-version` 標誌或使用 `--config` 時的
[`ClusterConfiguration.kubernetesVersion`](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4/)
字段指定給 kubeadm。
這個選項將控制 kube-apiserver、kube-controller-manager、kube-scheduler 和 kube-proxy 的版本。

<!--
Example:
* kubeadm is at {{< skew currentVersion >}}
* `kubernetesVersion` must be at {{< skew currentVersion >}} or {{< skew currentVersionAddMinor -1 >}}
-->
例子：

* kubeadm 的版本爲 {{< skew currentVersion >}}。
* `kubernetesVersion` 必須爲 {{< skew currentVersion >}} 或者 {{< skew currentVersionAddMinor -1 >}}。

<!--
### kubeadm's skew against the kubelet
-->
### kubeadm 中 kubelet 的版本偏差 {#kubeadm-s-skew-against-the-kubelet}

<!--
Similarly to the Kubernetes version, kubeadm can be used with a kubelet version that is
the same version as kubeadm or three version older.
-->
與 Kubernetes 版本類似，kubeadm 可以使用與 kubeadm 相同版本的 kubelet，
或者比 kubeadm 老三個版本的 kubelet。

<!--
Example:

* kubeadm is at {{< skew currentVersion >}}
* kubelet on the host must be at {{< skew currentVersion >}}, {{< skew currentVersionAddMinor -1 >}},
  {{< skew currentVersionAddMinor -2 >}} or {{< skew currentVersionAddMinor -3 >}}
-->
例子：

* kubeadm 的版本爲 {{< skew currentVersion >}}。
* 主機上的 kubelet 必須爲 {{< skew currentVersion >}}、{{< skew currentVersionAddMinor -1 >}}、
  {{< skew currentVersionAddMinor -2 >}} 或 {{< skew currentVersionAddMinor -3 >}}。

<!--
### kubeadm's skew against kubeadm
-->
### kubeadm 支持的 kubeadm 的版本偏差 {#kubeadm-s-skew-against-kubeadm}

<!--
There are certain limitations on how kubeadm commands can operate on existing nodes or whole clusters
managed by kubeadm.
-->
kubeadm 命令在現有節點或由 kubeadm 管理的整個叢集上的操作有一定限制。

<!--
If new nodes are joined to the cluster, the kubeadm binary used for `kubeadm join` must match
the last version of kubeadm used to either create the cluster with `kubeadm init` or to upgrade
the same node with `kubeadm upgrade`. Similar rules apply to the rest of the kubeadm commands
with the exception of `kubeadm upgrade`.
-->
如果新的節點加入到叢集中，用於 `kubeadm join` 的 kubeadm 二進制文件必須與用 `kubeadm init`
創建叢集或用 `kubeadm upgrade` 升級同一節點時所用的 kubeadm 版本一致。
類似的規則適用於除了 `kubeadm upgrade` 以外的其他 kubeadm 命令。

<!--
Example for `kubeadm join`:
* kubeadm version {{< skew currentVersion >}} was used to create a cluster with `kubeadm init`
* Joining nodes must use a kubeadm binary that is at version {{< skew currentVersion >}}
-->
`kubeadm join` 的例子：

* 使用 `kubeadm init` 創建叢集時使用版本爲 {{< skew currentVersion >}} 的 kubeadm。
* 添加節點所用的 kubeadm 可執行文件爲版本 {{< skew currenttVersion >}}。

<!--
Nodes that are being upgraded must use a version of kubeadm that is the same MINOR
version or one MINOR version newer than the version of kubeadm used for managing the
node.
-->
對於正在升級的節點，所使用的的 kubeadm 必須與管理該節點的 kubeadm 具有相同的
MINOR 版本或比後者新一個 MINOR 版本。

<!--
Example for `kubeadm upgrade`:

* kubeadm version {{< skew currentVersionAddMinor -1 >}} was used to create or upgrade the node
* The version of kubeadm used for upgrading the node must be at {{< skew currentVersionAddMinor -1 >}}
  or {{< skew currentVersion >}}
-->
`kubeadm upgrade` 的例子：

* 用於創建或升級節點的 kubeadm 版本爲 {{< skew currentVersionAddMinor -1 >}}。
* 用於升級節點的 kubeadm 版本必須爲 {{< skew currentVersionAddMinor -1 >}} 或 {{< skew currentVersion >}}。

<!--
To learn more about the version skew between the different Kubernetes component see
the [Version Skew Policy](/releases/version-skew-policy/).
-->
要了解更多關於不同 Kubernetes 組件之間的版本偏差，
請參見[版本偏差策略](/zh-cn/releases/version-skew-policy/)。

<!--
## Limitations {#limitations}

### Cluster resilience {#resilience}
-->
## 侷限性 {#limitations}

### 叢集彈性 {#resilience}

<!--
The cluster created here has a single control-plane node, with a single etcd database
running on it. This means that if the control-plane node fails, your cluster may lose
data and may need to be recreated from scratch.
-->
此處創建的叢集具有單個控制平面節點，運行單個 etcd 數據庫。
這意味着如果控制平面節點發生故障，你的叢集可能會丟失數據並且可能需要從頭開始重新創建。

<!--
Workarounds:
-->
解決方法：

<!--
* Regularly [back up etcd](https://etcd.io/docs/v3.5/op-guide/recovery/). The
  etcd data directory configured by kubeadm is at `/var/lib/etcd` on the control-plane node.
-->
* 定期[備份 etcd](https://etcd.io/docs/v3.5/op-guide/recovery/)。
  kubeadm 設定的 etcd 數據目錄位於控制平面節點上的 `/var/lib/etcd` 中。

<!--
* Use multiple control-plane nodes. You can read
  [Options for Highly Available topology](/docs/setup/production-environment/tools/kubeadm/ha-topology/) to pick a cluster
  topology that provides [high-availability](/docs/setup/production-environment/tools/kubeadm/high-availability/).
-->
* 使用多個控制平面節點。
  你可以閱讀[可選的高可用性拓撲](/zh-cn/docs/setup/production-environment/tools/kubeadm/ha-topology/)選擇叢集拓撲提供的
  [高可用性](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)。

<!--
### Platform compatibility {#multi-platform}
-->
### 平臺兼容性 {#multi-platform}

<!--
kubeadm deb/rpm packages and binaries are built for amd64, arm (32-bit), arm64, ppc64le, and s390x
following the [multi-platform proposal](https://git.k8s.io/design-proposals-archive/multi-platform.md).
-->
kubeadm deb/rpm 軟件包和二進制文件是爲 amd64、arm (32-bit)、arm64、ppc64le 和 s390x
構建的遵循[多平臺提案](https://git.k8s.io/design-proposals-archive/multi-platform.md)。

<!--
Multiplatform container images for the control plane and addons are also supported since v1.12.
-->
從 v1.12 開始還支持用於控制平面和附加組件的多平臺容器映像檔。

<!--
Only some of the network providers offer solutions for all platforms. Please consult the list of
network providers above or the documentation from each provider to figure out whether the provider
supports your chosen platform.
-->
只有一些網路提供商爲所有平臺提供解決方案。
請查閱上方的網路提供商清單或每個提供商的文檔以確定提供商是否支持你選擇的平臺。

<!--
## Troubleshooting {#troubleshooting}
-->
## 故障排除 {#troubleshooting}

<!--
If you are running into difficulties with kubeadm, please consult our
[troubleshooting docs](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).
-->
如果你在使用 kubeadm 時遇到困難，
請查閱我們的[故障排除文檔](/zh-cn/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)。

<!-- discussion -->

<!--
## {{% heading "whatsnext" %}}
-->
## {{% heading "whatsnext" %}}

<!--
* Verify that your cluster is running properly with [Sonobuoy](https://github.com/heptio/sonobuoy)
* <a id="lifecycle" />See [Upgrading kubeadm clusters](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
  for details about upgrading your cluster using `kubeadm`.
* Learn about advanced `kubeadm` usage in the [kubeadm reference documentation](/docs/reference/setup-tools/kubeadm/)
* Learn more about Kubernetes [concepts](/docs/concepts/) and [`kubectl`](/docs/reference/kubectl/).
* See the [Cluster Networking](/docs/concepts/cluster-administration/networking/) page for a bigger list
  of Pod network add-ons.
* <a id="other-addons" />See the [list of add-ons](/docs/concepts/cluster-administration/addons/) to
  explore other add-ons, including tools for logging, monitoring, network policy, visualization &amp;
  control of your Kubernetes cluster.
* Configure how your cluster handles logs for cluster events and from
  applications running in Pods.
  See [Logging Architecture](/docs/concepts/cluster-administration/logging/) for
  an overview of what is involved.
-->
* 使用 [Sonobuoy](https://github.com/heptio/sonobuoy) 驗證叢集是否正常運行。
* <a id="lifecycle"/>有關使用 kubeadm 升級叢集的詳細信息，
  請參閱[升級 kubeadm 叢集](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。
* 在 [kubeadm 參考文檔](/zh-cn/docs/reference/setup-tools/kubeadm/)中瞭解有關 `kubeadm` 進階用法的信息。
* 瞭解有關 Kubernetes [概念](/zh-cn/docs/concepts/)和 [`kubectl`](/zh-cn/docs/reference/kubectl/)的更多信息。
* 有關 Pod 網路附加組件的更多列表，請參見[叢集網路](/zh-cn/docs/concepts/cluster-administration/networking/)頁面。
* <a id="other-addons" />請參閱[附加組件列表](/zh-cn/docs/concepts/cluster-administration/addons/)以探索其他附加組件，
  包括用於 Kubernetes 叢集的日誌記錄、監視、網路策略、可視化和控制的工具。
* 設定叢集如何處理叢集事件的日誌以及在 Pod 中運行的應用程序。
  有關所涉及內容的概述，請參見[日誌架構](/zh-cn/docs/concepts/cluster-administration/logging/)。

<!--
### Feedback {#feedback}
-->
### 反饋 {#feedback}

<!--
* For bugs, visit the [kubeadm GitHub issue tracker](https://github.com/kubernetes/kubeadm/issues)
* For support, visit the
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/) Slack channel
* General SIG Cluster Lifecycle development Slack channel:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG Cluster Lifecycle [SIG information](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle#readme)
* SIG Cluster Lifecycle mailing list:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
-->
* 有關漏洞，訪問 [kubeadm GitHub issue tracker](https://github.com/kubernetes/kubeadm/issues)
* 有關支持，訪問
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/) Slack 頻道
* 常規的 SIG Cluster Lifecycle 開發 Slack 頻道：
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG Cluster Lifecycle 的 [SIG 資料](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle#readme)
* SIG Cluster Lifecycle 郵件列表：
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
