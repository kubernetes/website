---
title: 使用 kubeadm 建立叢集
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
[Kubernetes Conformance tests](https://kubernetes.io/blog/2017/10/software-conformance-certification).
`kubeadm` also supports other cluster lifecycle functions, such as
[bootstrap tokens](/docs/reference/access-authn-authz/bootstrap-tokens/) and cluster upgrades.
-->
<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
使用 `kubeadm`，你能建立一個符合最佳實踐的最小化 Kubernetes 叢集。
事實上，你可以使用 `kubeadm` 配置一個透過
[Kubernetes 一致性測試](https://kubernetes.io/blog/2017/10/software-conformance-certification)的叢集。
`kubeadm` 還支援其他叢集生命週期功能，
例如[啟動引導令牌](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)和叢集升級。

<!--
The `kubeadm` tool is good if you need:

- A simple way for you to try out Kubernetes, possibly for the first time.
- A way for existing users to automate setting up a cluster and test their application.
- A building block in other ecosystem and/or installer tools with a larger
  scope.
-->
kubeadm 工具很棒，如果你需要：

- 一個嘗試 Kubernetes 的簡單方法。
- 一個現有使用者可以自動設定叢集並測試其應用程式的途徑。
- 其他具有更大範圍的生態系統和/或安裝工具中的構建模組。

<!--
You can install and use `kubeadm` on various machines: your laptop, a set
of cloud servers, a Raspberry Pi, and more. Whether you're deploying into the
cloud or on-premises, you can integrate `kubeadm` into provisioning systems such
as Ansible or Terraform.
-->
你可以在各種機器上安裝和使用 `kubeadm`：膝上型電腦，
一組雲伺服器，Raspberry Pi 等。無論是部署到雲還是本地，
你都可以將 `kubeadm` 整合到預配置系統中，例如 Ansible 或 Terraform。

## {{% heading "prerequisites" %}}

<!--
To follow this guide, you need:

- One or more machines running a deb/rpm-compatible Linux OS; for example: Ubuntu or CentOS.
- 2 GiB or more of RAM per machine--any less leaves little room for your
   apps.
- At least 2 CPUs on the machine that you use as a control-plane node.
- Full network connectivity among all machines in the cluster. You can use either a
  public or a private network.
-->
要遵循本指南，你需要：

- 一臺或多臺執行相容 deb/rpm 的 Linux 作業系統的計算機；例如：Ubuntu 或 CentOS。
- 每臺機器 2 GB 以上的記憶體，記憶體不足時應用會受限制。
- 用作控制平面節點的計算機上至少有2個 CPU。
- 叢集中所有計算機之間具有完全的網路連線。你可以使用公共網路或專用網路。

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
[Kubernetes 版本及版本偏差策略](/zh-cn/docs/setup/release/version-skew-policy/#supported-versions)適用於 `kubeadm` 以及整個 Kubernetes。
查閱該策略以瞭解支援哪些版本的 Kubernetes 和 `kubeadm`。
該頁面是為 Kubernetes {{< param "version" >}} 編寫的。

<!--
The `kubeadm` tool's overall feature state is General Availability (GA). Some sub-features are
still under active development. The implementation of creating the cluster may change
slightly as the tool evolves, but the overall implementation should be pretty stable.
-->
`kubeadm` 工具的整體功能狀態為一般可用性（GA）。一些子功能仍在積極開發中。
隨著工具的發展，建立叢集的實現可能會略有變化，但總體實現應相當穩定。

<!--
Any commands under `kubeadm alpha` are, by definition, supported on an alpha level.
-->
{{< note >}}
根據定義，在 `kubeadm alpha` 下的所有命令均在 alpha 級別上受支援。
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
-->
### 主機準備 {#preparing-the-hosts}

<!--
Install a {{< glossary_tooltip term_id="container-runtime" text="container runtime" >}} and kubeadm on all the hosts.
For detailed instructions and other prerequisites, see [Installing kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).
-->
在所有主機上安裝 {{< glossary_tooltip term_id="container-runtime" text="容器執行時" >}} 和 kubeadm。
詳細說明和其他前提條件，請參見[安裝 kubeadm](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)。

<!--
If you have already installed kubeadm, run `apt-get update &&
apt-get upgrade` or `yum update` to get the latest version of kubeadm.

When you upgrade, the kubelet restarts every few seconds as it waits in a crashloop for
kubeadm to tell it what to do. This crashloop is expected and normal.
After you initialize your control-plane, the kubelet runs normally.
-->
{{< note >}}
如果你已經安裝了kubeadm，執行 `apt-get update &&
apt-get upgrade` 或 `yum update` 以獲取 kubeadm 的最新版本。

升級時，kubelet 每隔幾秒鐘重新啟動一次，
在 crashloop 狀態中等待 kubeadm 釋出指令。crashloop 狀態是正常現象。
初始化控制平面後，kubelet 將正常執行。
{{< /note >}}

<!--
### Preparing the required container images
-->
### 準備所需的容器映象 {#preparing-the-required-container-images}

<!--
This step is optional and only applies in case you wish `kubeadm init` and `kubeadm join`
to not download the default container images which are hosted at `k8s.gcr.io`.

Kubeadm has commands that can help you pre-pull the required images
when creating a cluster without an internet connection on its nodes.
See [Running kubeadm without an internet connection](/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection) for more details.

Kubeadm allows you to use a custom image repository for the required images.
See [Using custom images](/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images)
for more details.
-->
這個步驟是可選的，只適用於你希望 `kubeadm init` 和 `kubeadm join` 不去下載存放在 `k8s.gcr.io` 上的預設的容器映象的情況。

當你在離線的節點上建立一個叢集的時候，Kubeadm 有一些命令可以幫助你預拉取所需的映象。
閱讀[離線執行 kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images)
獲取更多的詳情。

Kubeadm 允許你給所需要的映象指定一個自定義的映象倉庫。
閱讀[使用自定義映象](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images)
獲取更多的詳情。

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
控制平面節點是執行控制平面元件的機器，
包括 {{< glossary_tooltip term_id="etcd" >}} （叢集資料庫）
和 {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
（命令列工具 {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} 與之通訊）。

<!--
1. (Recommended) If you have plans to upgrade this single control-plane `kubeadm` cluster
to high availability you should specify the `--control-plane-endpoint` to set the shared endpoint
for all control-plane nodes. Such an endpoint can be either a DNS name or an IP address of a load-balancer.
1. Choose a Pod network add-on, and verify whether it requires any arguments to
be passed to `kubeadm init`. Depending on which
third-party provider you choose, you might need to set the `--pod-network-cidr` to
a provider-specific value. See [Installing a Pod network add-on](#pod-network).
-->
1. （推薦）如果計劃將單個控制平面 kubeadm 叢集升級成高可用，
   你應該指定 `--control-plane-endpoint` 為所有控制平面節點設定共享端點。
   端點可以是負載均衡器的 DNS 名稱或 IP 地址。
1. 選擇一個 Pod 網路外掛，並驗證是否需要為 `kubeadm init` 傳遞引數。
   根據你選擇的第三方網路外掛，你可能需要設定 `--pod-network-cidr` 的值。
   請參閱[安裝 Pod 網路附加元件](#pod-network)。

<!--
1. (Optional) `kubeadm` tries to detect the container runtime by using a list of well
known endpoints. To use different container runtime or if there are more than one installed
on the provisioned node, specify the `--cri-socket` argument to `kubeadm`. See
[Installing a runtime](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).
1. (Optional) Unless otherwise specified, `kubeadm` uses the network interface associated
with the default gateway to set the advertise address for this particular control-plane node's API server.
To use a different network interface, specify the `--apiserver-advertise-address=<ip-address>` argument
to `kubeadm init`. To deploy an IPv6 Kubernetes cluster using IPv6 addressing, you
must specify an IPv6 address, for example `--apiserver-advertise-address=fd00::101`
-->
1. （可選）`kubeadm` 試圖透過使用已知的端點列表來檢測容器執行時。
   使用不同的容器執行時或在預配置的節點上安裝了多個容器執行時，請為 `kubeadm init` 指定 `--cri-socket` 引數。
   請參閱[安裝執行時](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime)。
1. （可選）除非另有說明，否則 `kubeadm` 使用與預設閘道器關聯的網路介面來設定此控制平面節點 API server 的廣播地址。
   要使用其他網路介面，請為 `kubeadm init` 設定 `--apiserver-advertise-address=<ip-address>` 引數。
   要部署使用 IPv6 地址的 Kubernetes 叢集，
   必須指定一個 IPv6 地址，例如 `--apiserver-advertise-address=fd00::101`

<!--
To initialize the control-plane node run:
-->
要初始化控制平面節點，請執行：

```bash
kubeadm init <args>
```

<!--
### Considerations about apiserver-advertise-address and ControlPlaneEndpoint
-->
### 關於 apiserver-advertise-address 和 ControlPlaneEndpoint 的注意事項 {#considerations-about-apiserver-advertise-address-and-controlplaneendpoint}

<!--
While `--apiserver-advertise-address` can be used to set the advertise address for this particular
control-plane node's API server, `--control-plane-endpoint` can be used to set the shared endpoint
for all control-plane nodes.
-->
`--apiserver-advertise-address`  可用於為控制平面節點的 API server 設定廣播地址，
`--control-plane-endpoint` 可用於為所有控制平面節點設定共享端點。

<!--
`--control-plane-endpoint` allows both IP addresses and DNS names that can map to IP addresses.
Please contact your network administrator to evaluate possible solutions with respect to such mapping.
-->
`--control-plane-endpoint` 允許 IP 地址和可以對映到 IP 地址的 DNS 名稱。
請與你的網路管理員聯絡，以評估有關此類對映的可能解決方案。

<!--
Here is an example mapping:
-->
這是一個示例對映：

```console
192.168.0.102 cluster-endpoint
```

<!--
Where `192.168.0.102` is the IP address of this node and `cluster-endpoint` is a custom DNS name that maps to this IP.
This will allow you to pass `--control-plane-endpoint=cluster-endpoint` to `kubeadm init` and pass the same DNS name to
`kubeadm join`. Later you can modify `cluster-endpoint` to point to the address of your load-balancer in an
high availability scenario.
-->
其中 `192.168.0.102` 是此節點的 IP 地址，`cluster-endpoint` 是對映到該 IP 的自定義 DNS 名稱。
這將允許你將 `--control-plane-endpoint=cluster-endpoint` 傳遞給 `kubeadm init`，並將相同的 DNS 名稱傳遞給 `kubeadm join`。
稍後你可以修改 `cluster-endpoint` 以指向高可用性方案中的負載均衡器的地址。

<!--
Turning a single control plane cluster created without `--control-plane-endpoint` into a highly available cluster
is not supported by kubeadm.
-->
kubeadm 不支援將沒有 `--control-plane-endpoint` 引數的單個控制平面叢集轉換為高可用性叢集。

<!--
### More information
-->
### 更多資訊 {#more-information}

<!--
For more information about `kubeadm init` arguments, see the [kubeadm reference guide](/docs/reference/setup-tools/kubeadm/).
-->
有關 `kubeadm init` 引數的更多資訊，請參見 [kubeadm 參考指南](/zh-cn/docs/reference/setup-tools/kubeadm/)。

<!--
To configure `kubeadm init` with a configuration file see
[Using kubeadm init with a configuration file](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).
-->
要使用配置檔案配置 `kubeadm init` 命令，
請參見[帶配置檔案使用 kubeadm init](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file)。

<!--
To customize control plane components, including optional IPv6 assignment to liveness probe
for control plane components and etcd server, provide extra arguments to each component as documented in
[custom arguments](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).
-->
要自定義控制平面元件，包括可選的對控制平面元件和 etcd 伺服器的活動探針提供 IPv6 支援，
請參閱[自定義引數](/zh-cn/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)。

<!--
To reconfigure a cluster that has already been created see
[Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).
-->
要重新配置一個已經建立的叢集，請參見
[重新配置一個 kubeadm 叢集](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure)。

<!--
To run `kubeadm init` again, you must first [tear down the cluster](#tear-down).
-->
要再次執行 `kubeadm init`，你必須首先[解除安裝叢集](#tear-down)。

<!--
If you join a node with a different architecture to your cluster, make sure that your deployed DaemonSets
have container image support for this architecture.
-->
如果將具有不同架構的節點加入叢集，
請確保已部署的 DaemonSet 對這種體系結構具有容器映象支援。

<!--
`kubeadm init` first runs a series of prechecks to ensure that the machine
is ready to run Kubernetes. These prechecks expose warnings and exit on errors. `kubeadm init`
then downloads and installs the cluster control plane components. This may take several minutes.
After it finishes you should see:
-->
`kubeadm init` 首先執行一系列預檢查以確保機器
準備執行 Kubernetes。這些預檢查會顯示警告並在錯誤時退出。然後 `kubeadm init`
下載並安裝叢集控制平面元件。這可能會需要幾分鐘。
完成之後你應該看到：

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
要使非 root 使用者可以執行 kubectl，請執行以下命令，
它們也是 `kubeadm init` 輸出的一部分：

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

<!--
Alternatively, if you are the `root` user, you can run:
-->
或者，如果你是 `root` 使用者，則可以執行：

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

{{< warning >}}
<!--
Kubeadm signs the certificate in the `admin.conf` to have `Subject: O = system:masters, CN = kubernetes-admin`.
`system:masters` is a break-glass, super user group that bypasses the authorization layer (e.g. RBAC).
Do not share the `admin.conf` file with anyone and instead grant users custom permissions by generating
them a kubeconfig file using the `kubeadm kubeconfig user` command. For more details see
[Generating kubeconfig files for additional users](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users).
-->
kubeadm 對 `admin.conf` 中的證書進行簽名時，將其配置為
`Subject: O = system:masters, CN = kubernetes-admin`。
`system:masters` 是一個例外的、超級使用者組，可以繞過鑑權層（例如 RBAC）。
不要將 `admin.conf` 檔案與任何人共享，應該使用 `kubeadm kubeconfig user`
命令為其他使用者生成 kubeconfig 檔案，完成對他們的定製授權。
更多細節請參見[為其他使用者生成 kubeconfig 檔案](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users)。
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
這裡包含的令牌是金鑰。確保它的安全，
因為擁有此令牌的任何人都可以將經過身份驗證的節點新增到你的叢集中。
可以使用 `kubeadm token` 命令列出，建立和刪除這些令牌。
請參閱 [kubeadm 參考指南](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-token/)。

<!--
### Installing a Pod network add-on {#pod-network}
-->
### 安裝 Pod 網路附加元件 {#pod-network}

{{< caution >}}
<!--
This section contains important information about networking setup and
deployment order.
Read all of this advice carefully before proceeding.
-->
本節包含有關網路設定和部署順序的重要資訊。
在繼續之前，請仔細閱讀所有建議。

<!--
**You must deploy a
{{< glossary_tooltip text="Container Network Interface" term_id="cni" >}}
(CNI) based Pod network add-on so that your Pods can communicate with each other.
Cluster DNS (CoreDNS) will not start up before a network is installed.**
-->
**你必須部署一個基於 Pod 網路外掛的
{{< glossary_tooltip text="容器網路介面" term_id="cni" >}}
(CNI)，以便你的 Pod 可以相互通訊。
在安裝網路之前，叢集 DNS (CoreDNS) 將不會啟動。**

<!--
- Take care that your Pod network must not overlap with any of the host
  networks: you are likely to see problems if there is any overlap.
  (If you find a collision between your network plugin's preferred Pod
  network and some of your host networks, you should think of a suitable
  CIDR block to use instead, then use that during `kubeadm init` with
  `--pod-network-cidr` and as a replacement in your network plugin's YAML).
-->
- 注意你的 Pod 網路不得與任何主機網路重疊：
  如果有重疊，你很可能會遇到問題。
  （如果你發現網路外掛的首選 Pod 網路與某些主機網路之間存在衝突，
  則應考慮使用一個合適的 CIDR 塊來代替，
  然後在執行 `kubeadm init` 時使用 `--pod-network-cidr` 引數並在你的網路外掛的 YAML 中替換它）。

<!--
- By default, `kubeadm` sets up your cluster to use and enforce use of
  [RBAC](/docs/reference/access-authn-authz/rbac/) (role based access
  control).
  Make sure that your Pod network plugin supports RBAC, and so do any manifests
  that you use to deploy it.
-->
- 預設情況下，`kubeadm` 將叢集設定為使用和強制使用 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/)（基於角色的訪問控制）。
  確保你的 Pod 網路外掛支援 RBAC，以及用於部署它的 manifests 也是如此。

<!--
- If you want to use IPv6--either dual-stack, or single-stack IPv6 only
  networking--for your cluster, make sure that your Pod network plugin
  supports IPv6.
  IPv6 support was added to CNI in [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0).
-->
- 如果要為叢集使用 IPv6（雙協議棧或僅單協議棧 IPv6 網路），
  請確保你的 Pod 網路外掛支援 IPv6。
  IPv6 支援已在 CNI [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0) 版本中新增。
{{< /caution >}}

<!--
Kubeadm should be CNI agnostic and the validation of CNI providers is out of the scope of our current e2e testing.
If you find an issue related to a CNI plugin you should log a ticket in its respective issue
tracker instead of the kubeadm or kubernetes issue trackers.
-->
{{< note >}}
kubeadm 應該是與 CNI 無關的，對 CNI 驅動進行驗證目前不在我們的端到端測試範疇之內。
如果你發現與 CNI 外掛相關的問題，應在其各自的問題跟蹤器中記錄而不是在 kubeadm
或 kubernetes 問題跟蹤器中記錄。
{{< /note >}}

<!--
Several external projects provide Kubernetes Pod networks using CNI, some of which also
support [Network Policy](/docs/concepts/services-networking/network-policies/).
-->
一些外部專案為 Kubernetes 提供使用 CNI 的 Pod 網路，其中一些還支援[網路策略](/zh-cn/docs/concepts/services-networking/network-policies/)。

<!--
See a list of add-ons that implement the
[Kubernetes networking model](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model).
-->
請參閱實現 [Kubernetes 網路模型](/zh-cn/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model)的附加元件列表。

<!--
You can install a Pod network add-on with the following command on the
control-plane node or a node that has the kubeconfig credentials:
-->
你可以使用以下命令在控制平面節點或具有 kubeconfig 憑據的節點上安裝 Pod 網路附加元件：

```bash
kubectl apply -f <add-on.yaml>
```

<!--
You can install only one Pod network per cluster.
-->
每個叢集只能安裝一個 Pod 網路。

<!--
Once a Pod network has been installed, you can confirm that it is working by
checking that the CoreDNS Pod is `Running` in the output of `kubectl get pods --all-namespaces`.
And once the CoreDNS Pod is up and running, you can continue by joining your nodes.
-->
安裝 Pod 網路後，你可以透過在 `kubectl get pods --all-namespaces` 輸出中檢查 CoreDNS Pod 是否 `Running` 來確認其是否正常執行。
一旦 CoreDNS Pod 啟用並執行，你就可以繼續加入節點。

<!--
If your network is not working or CoreDNS is not in the `Running` state, check out the
[troubleshooting guide](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)
for `kubeadm`.
-->
如果你的網路無法正常工作或 CoreDNS 不在“執行中”狀態，請檢視 `kubeadm` 的
[故障排除指南](/zh-cn/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)。

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
預設情況下，kubeadm 啟用 [NodeRestriction](/zh-cn/docs/reference/access-authn-authz/admissiontrollers/#noderestriction)
准入控制器來限制 kubelets 在節點註冊時可以應用哪些標籤。准入控制器文件描述 kubelet `--node-labels` 選項允許使用哪些標籤。
其中 `node-role.kubernetes.io/control-plane` 標籤就是這樣一個受限制的標籤，
kubeadm 在節點建立後使用特權客戶端手動應用此標籤。
你可以使用一個有特權的 kubeconfig，比如由 kubeadm 管理的 `/etc/kubernetes/admin.conf`，
透過執行 `kubectl label` 來手動完成操作。

<!--
### Control plane node isolation
-->
### 控制平面節點隔離 {#control-plane-node-isolation}

<!--
By default, your cluster will not schedule Pods on the control plane nodes for security
reasons. If you want to be able to schedule Pods on the control plane nodes,
for example for a single machine Kubernetes cluster, run:
-->
預設情況下，出於安全原因，你的叢集不會在控制平面節點上排程 Pod。
如果你希望能夠在控制平面節點上排程 Pod，例如單機 Kubernetes 叢集，請執行:

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane- node-role.kubernetes.io/master-
```
<!--
The output will look something like:
-->
輸出看起來像：

```console
node "test-01" untainted
```

<!--
This will remove the `node-role.kubernetes.io/control-plane` and
`node-role.kubernetes.io/master` taints from any nodes that have them,
including the control plane nodes, meaning that the scheduler will then be able
to schedule Pods everywhere.
-->
這將從任何擁有 `node-role.kubernetes.io/control-plane` 和
`node-role.kubernetes.io/master` 汙點的節點上移除該汙點。

包括控制平面節點，這意味著排程程式將能夠在任何地方排程 Pods。

<!--
{{< note >}}
The `node-role.kubernetes.io/master` taint is deprecated and kubeadm will stop using it in version 1.25.
{{< /note >}}
-->

{{< note >}}
`node-role.kubernetes.io/master` 汙點已被廢棄，kubeadm 將在 1.25 版本中停止使用它。
{{< /note >}}

<!--
### Joining your nodes {#join-nodes}
-->
### 加入節點 {#join-nodes}

<!--
The nodes are where your workloads (containers and Pods, etc) run. To add new nodes to your cluster do the following for each machine:
-->
節點是你的工作負載（容器和 Pod 等）執行的地方。要將新節點新增到叢集，請對每臺計算機執行以下操作：

<!--
* SSH to the machine
* Become root (e.g. `sudo su -`)
* Run the command that was output by `kubeadm init`. For example:
-->
* SSH 到機器
* 成為 root （例如 `sudo su -`）
* 執行 `kubeadm init` 輸出的命令，例如：

  ```bash
  kubeadm join --token <token> <control-plane-host>:<control-plane-port> --discovery-token-ca-cert-hash sha256:<hash>
  ```

<!--
If you do not have the token, you can get it by running the following command on the control-plane node:
-->
如果沒有令牌，可以透過在控制平面節點上執行以下命令來獲取令牌：

```bash
kubeadm token list
```

<!--
The output is similar to this:
-->
輸出類似於以下內容：

```console
TOKEN                    TTL  EXPIRES              USAGES           DESCRIPTION            EXTRA GROUPS
8ewj1p.9r9hcjoqgajrj4gi  23h  2018-06-12T02:51:28Z authentication,  The default bootstrap  system:
                                                   signing          token generated by     bootstrappers:
                                                                    'kubeadm init'.        kubeadm:
                                                                                           default-node-token
```

<!--
By default, tokens expire after 24 hours. If you are joining a node to the cluster after the current token has expired,
you can create a new token by running the following command on the control-plane node:
-->
預設情況下，令牌會在 24 小時後過期。如果要在當前令牌過期後將節點加入叢集，
則可以透過在控制平面節點上執行以下命令來建立新令牌：

```bash
kubeadm token create
```
<!--
The output is similar to this:
-->
輸出類似於以下內容：

```console
5didvk.d09sbcov8ph2amjw
```

<!--
If you don't have the value of `--discovery-token-ca-cert-hash`, you can get it by running the following command chain on the control-plane node:
-->
如果你沒有 `--discovery-token-ca-cert-hash` 的值，則可以透過在控制平面節點上執行以下命令鏈來獲取它：

```bash
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | \
   openssl dgst -sha256 -hex | sed 's/^.* //'
```

<!--
The output is similar to:
-->
輸出類似於以下內容：

```console
8cb2de97839780a412b93877f8507ad6c94f73add17d5d7058e91741c9d5ec78
```

<!--
To specify an IPv6 tuple for `<control-plane-host>:<control-plane-port>`, IPv6 address must be enclosed in square brackets, for example: `[fd00::101]:2073`.
-->
{{< note >}}
要為 `<control-plane-host>:<control-plane-port>` 指定 IPv6 元組，必須將 IPv6 地址括在方括號中，例如：`[fd00::101]:2073`
{{< /note >}}

<!--
The output should look something like:
-->
輸出應類似於：

```console
[preflight] Running pre-flight checks

... (log output of join workflow) ...

Node join complete:
* Certificate signing request sent to control-plane and response
  received.
* Kubelet informed of new secure connection details.

Run 'kubectl get nodes' on control-plane to see this machine join.
```

<!--
A few seconds later, you should notice this node in the output from `kubectl get
nodes` when run on the control-plane node.
-->
幾秒鐘後，當你在控制平面節點上執行 `kubectl get nodes`，你會注意到該節點出現在輸出中。

<!--
As the cluster nodes are usually initialized sequentially, the CoreDNS Pods are likely to all run
on the first control-plane node. To provide higher availability, please rebalance the CoreDNS Pods
with `kubectl -n kube-system rollout restart deployment coredns` after at least one new node is joined.
-->
{{< note >}}
由於叢集節點通常是按順序初始化的，CoreDNS Pods 很可能都執行在第一個控制面節點上。
為了提供更高的可用性，請在加入至少一個新節點後
使用 `kubectl -n kube-system rollout restart deployment coredns` 命令，重新平衡 CoreDNS Pods。
{{< /note >}}

<!--
### (Optional) Controlling your cluster from machines other than the control-plane node
-->
### （可選）從控制平面節點以外的計算機控制叢集 {#optional-controlling-your-cluster-from-machines-other-than-the-control-plane-node}

<!--
In order to get a kubectl on some other computer (e.g. laptop) to talk to your
cluster, you need to copy the administrator kubeconfig file from your control-plane node
to your workstation like this:
-->
為了使 kubectl 在其他計算機（例如膝上型電腦）上與你的叢集通訊，
你需要將管理員 kubeconfig 檔案從控制平面節點複製到工作站，如下所示：

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```
<!--
The example above assumes SSH access is enabled for root. If that is not the
case, you can copy the `admin.conf` file to be accessible by some other user
and `scp` using that other user instead.

The `admin.conf` file gives the user _superuser_ privileges over the cluster.
This file should be used sparingly. For normal users, it's recommended to
generate an unique credential to which you grant privileges. You can do
this with the `kubeadm alpha kubeconfig user --client-name <CN>`
command. That command will print out a KubeConfig file to STDOUT which you
should save to a file and distribute to your user. After that, grant
privileges by using `kubectl create (cluster)rolebinding`.
-->
{{< note >}}
上面的示例假定為 root 使用者啟用了 SSH 訪問。如果不是這種情況，
你可以使用 `scp` 將 `admin.conf` 檔案複製給其他允許訪問的使用者。

admin.conf 檔案為使用者提供了對叢集的超級使用者特權。
該檔案應謹慎使用。對於普通使用者，建議生成一個你為其授予特權的唯一證書。
你可以使用 `kubeadm alpha kubeconfig user --client-name <CN>` 命令執行此操作。
該命令會將 KubeConfig 檔案列印到 STDOUT，你應該將其儲存到檔案並分發給使用者。
之後，使用 `kubectl create (cluster)rolebinding` 授予特權。
{{< /note >}}

<!--
### (Optional) Proxying API Server to localhost
-->
### （可選）將 API 伺服器代理到本地主機 {#optional-proxying-api-server-to-localhost}

<!--
If you want to connect to the API Server from outside the cluster you can use
`kubectl proxy`:
-->
如果要從叢集外部連線到 API 伺服器，則可以使用 `kubectl proxy`：

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```
<!--
You can now access the API Server locally at `http://localhost:8001/api/v1`
-->
你現在可以在本地訪問 API 伺服器 `http://localhost:8001/api/v1`。

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
如果你在叢集中使用了一次性伺服器進行測試，則可以關閉這些伺服器，而無需進一步清理。你可以使用 `kubectl config delete-cluster` 刪除對叢集的本地引用。

<!--
However, if you want to deprovision your cluster more cleanly, you should
first [drain the node](/docs/reference/generated/kubectl/kubectl-commands#drain)
and make sure that the node is empty, then deconfigure the node.
-->
但是，如果要更乾淨地取消配置叢集，
則應首先[清空節點](/docs/reference/generated/kubectl/kubectl-commands#drain)並確保該節點為空，
然後取消配置該節點。

<!--
### Remove the node
-->
### 刪除節點 {#remove-the-node}

<!--
Talking to the control-plane node with the appropriate credentials, run:
-->
使用適當的憑證與控制平面節點通訊，執行：

```bash
kubectl drain <node name> --delete-emptydir-data --force --ignore-daemonsets
```

<!--
Before removing the node, reset the state installed by `kubeadm`:
-->
在刪除節點之前，請重置 `kubeadm` 安裝的狀態：

```bash
kubeadm reset
```

<!--
The reset process does not reset or clean up iptables rules or IPVS tables. If you wish to reset iptables, you must do so manually:
-->
重置過程不會重置或清除 iptables 規則或 IPVS 表。如果你希望重置 iptables，則必須手動進行：

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

<!--
If you want to reset the IPVS tables, you must run the following command:
-->
如果要重置 IPVS 表，則必須執行以下命令：

```bash
ipvsadm -C
```
<!--
Now remove the node:
-->
現在刪除節點：

```bash
kubectl delete node <node name>
```

<!--
If you wish to start over, run `kubeadm init` or `kubeadm join` with the
appropriate arguments.
-->
如果你想重新開始，只需執行 `kubeadm init` 或 `kubeadm join` 並加上適當的引數。

<!--
### Clean up the control plane
-->
### 清理控制平面 {#clean-up-the-control-plane}

<!--
You can use `kubeadm reset` on the control plane host to trigger a best-effort
clean up.
-->
你可以在控制平面主機上使用 `kubeadm reset` 來觸發盡力而為的清理。

<!--
See the [`kubeadm reset`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
reference documentation for more information about this subcommand and its
options.
-->
有關此子命令及其選項的更多資訊，請參見 [`kubeadm reset`](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/) 參考文件。

<!-- discussion -->

<!--
## What's next {#whats-next}
-->
## 下一步 {#whats-next}

<!--
* Verify that your cluster is running properly with [Sonobuoy](https://github.com/heptio/sonobuoy)
* <a id="lifecycle" />See [Upgrading kubeadm clusters](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
  for details about upgrading your cluster using `kubeadm`.
* Learn about advanced `kubeadm` usage in the [kubeadm reference documentation](/docs/reference/setup-tools/kubeadm/kubeadm)
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
* 使用 [Sonobuoy](https://github.com/heptio/sonobuoy) 驗證叢集是否正常執行。
* <a id="lifecycle"/>有關使用 kubeadm 升級叢集的詳細資訊，請參閱[升級 kubeadm 叢集](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。
* 在 [kubeadm 參考文件](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm)中瞭解有關 `kubeadm` 進階用法的資訊。
* 瞭解有關 Kubernetes [概念](/zh-cn/docs/concepts/)和 [`kubectl`](/zh-cn/docs/reference/kubectl/)的更多資訊。
* 有關 Pod 網路附加元件的更多列表，請參見[叢集網路](/zh-cn/docs/concepts/cluster-administration/networking/)頁面。
* <a id="other-addons" />請參閱[附加元件列表](/zh-cn/docs/concepts/cluster-administration/addons/)以探索其他附加元件，
  包括用於 Kubernetes 叢集的日誌記錄，監視，網路策略，視覺化和控制的工具。
* 配置叢集如何處理叢集事件的日誌以及
   在 Pods 中執行的應用程式。
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
* 有關支援，訪問
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/) Slack 頻道
* General SIG 叢集生命週期開發 Slack 頻道:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG 叢集生命週期 [SIG information](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle#readme)
* SIG 叢集生命週期郵件列表:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)

<!--
## Version skew policy {#version-skew-policy}
-->
## 版本偏差策略 {#version-skew-policy}

<!--
While kubeadm allows version skew against some components that it manages, it is recommended that you
match the kubeadm version with the versions of the control plane components, kube-proxy and kubelet.
-->
雖然 kubeadm 允許所管理的元件有一定程度的版本偏差，
但是建議你將 kubeadm 的版本與控制平面元件、kube-proxy 和 kubelet 的版本相匹配。

<!--
### kubeadm's skew against the Kubernetes version
-->

### kubeadm 中的 Kubernetes 版本偏差 {#kubeadm-s-skew-against-the-kubernetes-version}

<!--
kubeadm can be used with Kubernetes components that are the same version as kubeadm
or one version older. The Kubernetes version can be specified to kubeadm by using the
`--kubernetes-version` flag of `kubeadm init` or the
[`ClusterConfiguration.kubernetesVersion`](/docs/reference/config-api/kubeadm-config.v1beta3/)
field when using `--config`. This option will control the versions
of kube-apiserver, kube-controller-manager, kube-scheduler and kube-proxy.
-->
kubeadm 可以與 Kubernetes 元件一起使用，這些元件的版本與 kubeadm 相同，或者比它大一個版本。
Kubernetes 版本可以透過使用 `--kubeadm init` 的 `--kubernetes-version` 標誌或使用 `--config` 時的
[`ClusterConfiguration.kubernetesVersion`](/zh-cn/docs/reference/configapi/kubeadm-config.v1beta3/)
欄位指定給 kubeadm。
這個選項將控制 kube-apiserver、kube-controller-manager、kube-scheduler 和 kube-proxy 的版本。

<!--
Example:
* kubeadm is at {{< skew latestVersion >}}
* `kubernetesVersion` must be at {{< skew latestVersion >}} or {{< skew prevMinorVersion >}}
-->
例子：
* kubeadm 的版本為 {{< skew latestVersion >}}。
* `kubernetesVersion` 必須為 {{< skew latestVersion >}} 或者 {{< skew prevMinorVersion >}}。

<!--
### kubeadm's skew against the kubelet
-->
### kubeadm 中 kubelet 的版本偏差 {#kubeadm-s-skew-against-the-kubelet}

<!--
Similarly to the Kubernetes version, kubeadm can be used with a kubelet version that is the same
version as kubeadm or one version older.
-->
與 Kubernetes 版本類似，kubeadm 可以使用與 kubeadm 相同版本的 kubelet，
或者比 kubeadm 老一個版本的 kubelet。

<!--
Example:
* kubeadm is at {{< skew latestVersion >}}
* kubelet on the host must be at {{< skew latestVersion >}} or {{< skew prevMinorVersion >}}
-->
例子：
* kubeadm 的版本為 {{< skew latestVersion >}}
* 主機上的 kubelet 版本必須為 {{< skew latestVersion >}} 或者 {{< skew prevMinorVersion >}}

<!--
### kubeadm's skew against kubeadm
-->
### kubeadm 支援的 kubeadm 的版本偏差 {#kubeadm-s-skew-against-kubeadm}

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
如果新的節點加入到叢集中，用於 `kubeadm join` 的 kubeadm 二進位制檔案必須與用 `kubeadm init`
建立叢集或用 `kubeadm upgrade` 升級同一節點時所用的 kubeadm 版本一致。
類似的規則適用於除了 `kubeadm upgrade` 以外的其他 kubeadm 命令。

<!--
Example for `kubeadm join`:
* kubeadm version {{< skew latestVersion >}} was used to create a cluster with `kubeadm init`
* Joining nodes must use a kubeadm binary that is at version {{< skew latestVersion >}}
-->
`kubeadm join` 的例子：
* 使用 `kubeadm init` 建立叢集時使用版本為 {{< skew latestVersion >}} 的 kubeadm。
* 加入的節點必須使用版本為 {{< skew latestVersion >}} 的 kubeadm 二進位制檔案。

<!--
Nodes that are being upgraded must use a version of kubeadm that is the same MINOR
version or one MINOR version newer than the version of kubeadm used for managing the
node.
-->
對於正在升級的節點，所使用的的 kubeadm 必須與管理該節點的 kubeadm 具有相同的
MINOR 版本或比後者新一個 MINOR 版本。

<!--
Example for `kubeadm upgrade`:
* kubeadm version {{< skew prevMinorVersion >}} was used to create or upgrade the node
* The version of kubeadm used for upgrading the node must be at {{< skew prevMinorVersion >}}
or {{< skew latestVersion >}}
-->
`kubeadm upgrade` 的例子:
* 用於建立或升級節點的 kubeadm 版本為 {{< skew prevMinorVersion >}}。
* 用於升級節點的 kubeadm 版本必須為 {{< skew prevMinorVersion >}} 或 {{< skew latestVersion >}}。

<!--
To learn more about the version skew between the different Kubernetes component see
the [Version Skew Policy](https://kubernetes.io/releases/version-skew-policy/).
-->
要了解更多關於不同 Kubernetes 元件之間的版本偏差，請參見
[版本偏差策略](https://kubernetes.io/releases/version-skew-policy/)。

<!--
## Limitations {#limitations}
-->
## 侷限性 {#limitations}

<!--
### Cluster resilience {#resilience}
-->
### 叢集彈性 {#resilience}

<!--
The cluster created here has a single control-plane node, with a single etcd database
running on it. This means that if the control-plane node fails, your cluster may lose
data and may need to be recreated from scratch.
-->
此處建立的叢集具有單個控制平面節點，執行單個 etcd 資料庫。
這意味著如果控制平面節點發生故障，你的叢集可能會丟失資料並且可能需要從頭開始重新建立。

<!--
Workarounds:
-->
解決方法：

<!--
* Regularly [back up etcd](https://coreos.com/etcd/docs/latest/admin_guide.html). The
  etcd data directory configured by kubeadm is at `/var/lib/etcd` on the control-plane node.
-->
* 定期[備份 etcd](https://coreos.com/etcd/docs/latest/admin_guide.html)。
  kubeadm 配置的 etcd 資料目錄位於控制平面節點上的 `/var/lib/etcd` 中。

<!--
* Use multiple control-plane nodes. You can read
  [Options for Highly Available topology](/docs/setup/production-environment/tools/kubeadm/ha-topology/) to pick a cluster
  topology that provides [high-availability](/docs/setup/production-environment/tools/kubeadm/high-availability/).
-->
* 使用多個控制平面節點。你可以閱讀
  [可選的高可用性拓撲](/zh-cn/docs/setup/production-environment/tools/kubeadm/ha-topology/)選擇叢集拓撲提供的
  [高可用性](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)。

<!--
### Platform compatibility {#multi-platform}
-->
### 平臺相容性 {#multi-platform}

<!--
kubeadm deb/rpm packages and binaries are built for amd64, arm (32-bit), arm64, ppc64le, and s390x
following the [multi-platform
proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/multi-platform.md).
-->
kubeadm deb/rpm 軟體包和二進位制檔案是為 amd64、arm (32-bit)、arm64、ppc64le 和 s390x 構建的遵循[多平臺提案](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/multi-platform.md)。

<!--
Multiplatform container images for the control plane and addons are also supported since v1.12.
-->
從 v1.12 開始還支援用於控制平面和附加元件的多平臺容器映象。

<!--
Only some of the network providers offer solutions for all platforms. Please consult the list of
network providers above or the documentation from each provider to figure out whether the provider
supports your chosen platform.
-->
只有一些網路提供商為所有平臺提供解決方案。請查閱上方的網路提供商清單或每個提供商的文件以確定提供商是否支援你選擇的平臺。

<!--
## Troubleshooting {#troubleshooting}
-->
## 故障排除 {#troubleshooting}

<!--
If you are running into difficulties with kubeadm, please consult our [troubleshooting docs](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).
-->
如果你在使用 kubeadm 時遇到困難，請查閱我們的[故障排除文件](/zh-cn/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)。
