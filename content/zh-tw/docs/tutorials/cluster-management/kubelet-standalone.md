---
title: 以獨立模式運行 kubelet
content_type: tutorial
weight: 10
---
<!--
title: Running Kubelet in Standalone Mode
content_type: tutorial
weight: 10
-->

<!-- overview -->

<!--
This tutorial shows you how to run a standalone kubelet instance.

You may have different motivations for running a standalone kubelet.
This tutorial is aimed at introducing you to Kubernetes, even if you don't have
much experience with it. You can follow this tutorial and learn about node setup,
basic (static) Pods, and how Kubernetes manages containers.
-->
本教程將向你展示如何運行一個獨立的 kubelet 實例。

你可能會有不同的動機來運行一個獨立的 kubelet。
本教程旨在向你介紹 Kubernetes，即使你對此並沒有太多經驗也沒有關係。
你可以跟隨本教程學習節點設置、基本（靜態）Pod 以及 Kubernetes 如何管理容器。

<!--
Once you have followed this tutorial, you could try using a cluster that has a
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} to manage pods
and nodes, and other types of objects. For example,
[Hello, minikube](/docs/tutorials/hello-minikube/).

You can also run the kubelet in standalone mode to suit production use cases, such as
to run the control plane for a highly available, resiliently deployed cluster. This
tutorial does not cover the details you need for running a resilient control plane.
-->
你學習完本教程後，就可以嘗試使用帶一個{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}的叢集來管理
Pod、節點和其他類別的對象。例如，[你好，Minikube](/zh-cn/docs/tutorials/hello-minikube/)。

你還可以以獨立模式運行 kubelet 來滿足生產場景要求，例如爲高可用、彈性部署的叢集運行控制平面。
本教程不涵蓋運行彈性控制平面所需的細節。

## {{% heading "objectives" %}}

<!--
* Install `cri-o`, and `kubelet` on a Linux system and run them as `systemd` services.
* Launch a Pod running `nginx` that listens to requests on TCP port 80 on the Pod's IP address.
* Learn how the different components of the solution interact among themselves.
-->
* 在 Linux 系統上安裝 `cri-o` 和 `kubelet`，並將其作爲 `systemd` 服務運行。
* 啓動一個運行 `nginx` 的 Pod，監聽針對此 Pod 的 IP 地址的 TCP 80 端口的請求。
* 學習此方案中不同組件之間如何交互。

{{< caution >}}
<!--
The kubelet configuration used for this tutorial is insecure by design and should
_not_ be used in a production environment.
-->
本教程中所使用的 kubelet 設定在設計上是不安全的，**不**得用於生產環境中。
{{< /caution >}}

## {{% heading "prerequisites" %}}

<!--
* Admin (`root`) access to a Linux system that uses `systemd` and `iptables`
  (or nftables with `iptables` emulation).
* Access to the Internet to download the components needed for the tutorial, such as:
  * A {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
    that implements the Kubernetes {{< glossary_tooltip term_id="cri" text="(CRI)">}}.
  * Network plugins (these are often known as
    {{< glossary_tooltip text="Container Networking Interface (CNI)" term_id="cni" >}})
  * Required CLI tools: `curl`, `tar`, `jq`.
-->
* 對使用 `systemd` 和 `iptables`（或使用 `iptables` 仿真的 nftables）的 Linux
  系統具有管理員（`root`）訪問權限。
* 有權限訪問互聯網以下載本教程所需的組件，例如：
  * 實現 Kubernetes {{< glossary_tooltip term_id="cri" text="CRI">}}
    的{{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}。
  * 網路插件（通常稱爲 {{< glossary_tooltip text="容器網路介面（CNI）" term_id="cni" >}}）。
  * 必需的 CLI 工具：`curl`、`tar`、`jq`。

<!-- lessoncontent -->

<!--
## Prepare the system

### Swap configuration

By default, kubelet fails to start if swap memory is detected on a node.
This means that swap should either be disabled or tolerated by kubelet.
-->
## 準備好系統   {#prepare-the-system}

### 設定內存交換   {#swap-configuration}

預設情況下，如果在節點上檢測到內存交換，kubelet 將啓動失敗。
這意味着內存交換應該被禁用或被 kubelet 容忍。

{{< note >}}
<!--
If you configure the kubelet to tolerate swap, the kubelet still configures Pods (and the
containers in those Pods) not to use swap space. To find out how Pods can actually
use the available swap, you can read more about
[swap memory management](/docs/concepts/architecture/nodes/#swap-memory) on Linux nodes.
-->
如果你設定 kubelet 爲容忍內存交換，則 kubelet 仍會設定 Pod（以及這些 Pod 中的容器）不使用交換空間。
要了解 Pod 實際上可以如何使用可用的交換，你可以進一步閱讀 Linux
節點上[交換內存管理](/zh-cn/docs/concepts/architecture/nodes/#swap-memory)。
{{< /note >}}

<!--
If you have swap memory enabled, either disable it or add `failSwapOn: false` to the
kubelet configuration file.

To check if swap is enabled:
-->
如果你啓用了交換內存，則禁用它或在 kubelet 設定檔案中添加 `failSwapOn: false`。

要檢查交換內存是否被啓用：

```shell
sudo swapon --show
```

<!--
If there is no output from the command, then swap memory is already disabled.

To disable swap temporarily:
-->
如果此命令沒有輸出，則交換內存已被禁用。

臨時禁用交換內存：

```shell
sudo swapoff -a
```

<!--
To make this change persistent across reboots:

Make sure swap is disabled in either `/etc/fstab` or `systemd.swap`, depending how it was
configured on your system.

### Enable IPv4 packet forwarding

To check if IPv4 packet forwarding is enabled:
-->
要使此變更持續到重啓之後：

確保在 `/etc/fstab` 或 `systemd.swap` 中禁用交換內存，具體取決於它在你的系統上是如何設定的。

### 啓用 IPv4 資料包轉發   {#enable-ipv4-packet-forwarding}

檢查 IPv4 資料包轉發是否被啓用：

```shell
cat /proc/sys/net/ipv4/ip_forward
```

<!--
If the output is `1`, it is already enabled. If the output is `0`, then follow next steps.

To enable IPv4 packet forwarding, create a configuration file that sets the
`net.ipv4.ip_forward` parameter to `1`:
-->
如果輸出爲 `1`，則 IPv4 資料包轉發已被啓用。如果輸出爲 `0`，按照以下步驟操作。

要啓用 IPv4 資料包轉發，創建一個設定檔案，將 `net.ipv4.ip_forward` 參數設置爲 `1`：

```shell
sudo tee /etc/sysctl.d/k8s.conf <<EOF
net.ipv4.ip_forward = 1
EOF
```

<!--
Apply the changes to the system:
-->
將變更應用到系統：

```shell
sudo sysctl --system
```

<!--
The output is similar to:
-->
輸出類似於：

```
...
* Applying /etc/sysctl.d/k8s.conf ...
net.ipv4.ip_forward = 1
* Applying /etc/sysctl.conf ...
```

<!--
## Download, install, and configure the components
-->
## 下載、安裝和設定組件   {#download-install-and-configure-the-components}

{{% thirdparty-content %}}

<!--
### Install a container runtime {#container-runtime}

Download the latest available versions of the required packages (recommended).

This tutorial suggests installing the [CRI-O container runtime](https://github.com/cri-o/cri-o)
(external link).
-->
### 安裝容器運行時   {#container-runtime}

下載所需軟體包的最新可用版本（推薦）。

本教程建議安裝 [CRI-O 容器運行時](https://github.com/cri-o/cri-o)（外部鏈接）。

<!--
There are several [ways to install](https://github.com/cri-o/cri-o/blob/main/install.md)
the CRI-O container runtime, depending on your particular Linux distribution. Although
CRI-O recommends using either `deb` or `rpm` packages, this tutorial uses the
_static binary bundle_ script of the
[CRI-O Packaging project](https://github.com/cri-o/packaging/blob/main/README.md),
both to streamline the overall process, and to remain distribution agnostic.
-->
根據你安裝的特定 Linux 發行版，有幾種[安裝容器運行時的方式](https://github.com/cri-o/cri-o/blob/main/install.md)。
儘管 CRI-O 推薦使用 `deb` 或 `rpm` 包，但本教程使用
[CRI-O Packaging 項目](https://github.com/cri-o/packaging/blob/main/README.md)中的**靜態二進制包**腳本，
以簡化整個安裝過程，並保持與 Linux 發行版無關。

<!--
The script installs and configures additional required software, such as
[`cni-plugins`](https://github.com/containernetworking/cni), for container
networking, and [`crun`](https://github.com/containers/crun) and
[`runc`](https://github.com/opencontainers/runc), for running containers.

The script will automatically detect your system's processor architecture
(`amd64` or `arm64`) and select and install the latest versions of the software packages.
-->
此腳本安裝並設定更多必需的軟體，例如容器聯網所用的 [`cni-plugins`](https://github.com/containernetworking/cni)
以及運行容器所用的 [`crun`](https://github.com/containers/crun) 和 [`runc`](https://github.com/opencontainers/runc)。

此腳本將自動檢測系統的處理器架構（`amd64` 或 `arm64`），並選擇和安裝最新版本的軟體包。

<!--
### Set up CRI-O {#cri-o-setup}

Visit the [releases](https://github.com/cri-o/cri-o/releases) page (external link).

Download the static binary bundle script:
-->
### 設置 CRI-O   {#cri-o-setup}

查閱[發佈版本](https://github.com/cri-o/cri-o/releases)頁面（外部鏈接）。

下載靜態二進制包腳本：

```shell
curl https://raw.githubusercontent.com/cri-o/packaging/main/get > crio-install
```

<!--
Run the installer script:
-->
運行安裝器腳本：

```shell
sudo bash crio-install
```

<!--
Enable and start the `crio` service:
-->
啓用並啓動 `crio` 服務：

```shell
sudo systemctl daemon-reload
sudo systemctl enable --now crio.service
```

<!--
Quick test:
-->
快速測試：

```shell
sudo systemctl is-active crio.service
```

<!--
The output is similar to:
-->
輸出類似於：

```
active
```

<!--
Detailed service check:
-->
詳細的服務檢查：

```shell
sudo journalctl -f -u crio.service
```

<!--
### Install network plugins

The `cri-o` installer installs and configures the `cni-plugins` package. You can
verify the installation running the following command:
-->
### 安裝網路插件   {#install-network-plugins}

`cri-o` 安裝器安裝並設定 `cni-plugins` 包。你可以通過運行以下命令來驗證安裝包：

```shell
/opt/cni/bin/bridge --version
```

<!--
The output is similar to:
-->
輸出類似於：

```
CNI bridge plugin v1.5.1
CNI protocol versions supported: 0.1.0, 0.2.0, 0.3.0, 0.3.1, 0.4.0, 1.0.0
```

<!--
To check the default configuration:
-->
檢查預設設定：

```shell
cat /etc/cni/net.d/11-crio-ipv4-bridge.conflist
```

<!--
The output is similar to:
-->
輸出類似於：

```json
{
  "cniVersion": "1.0.0",
  "name": "crio",
  "plugins": [
    {
      "type": "bridge",
      "bridge": "cni0",
      "isGateway": true,
      "ipMasq": true,
      "hairpinMode": true,
      "ipam": {
        "type": "host-local",
        "routes": [
            { "dst": "0.0.0.0/0" }
        ],
        "ranges": [
            [{ "subnet": "10.85.0.0/16" }]
        ]
      }
    }
  ]
}
```

{{< note >}}
<!--
Make sure that the default `subnet` range (`10.85.0.0/16`) does not overlap with
any of your active networks. If there is an overlap, you can edit the file and change it
accordingly. Restart the service after the change.
-->
確保預設的 `subnet` 範圍（`10.85.0.0/16`）不會與你已經在使用的任一網路地址重疊。
如果出現重疊，你可以編輯此檔案並進行相應的更改。更改後重啓服務。
{{< /note >}}

<!--
### Download and set up the kubelet

Download the [latest stable release](/releases/download/) of the kubelet.
-->
### 下載並設置 kubelet   {#download-and-set-up-the-kubelet}

下載 kubelet 的[最新穩定版本](/zh-cn/releases/download/)。

{{< tabs name="download_kubelet" >}}
{{< tab name="x86-64" codelang="bash" >}}
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubelet"
{{< /tab >}}
{{< tab name="ARM64" codelang="bash" >}}
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubelet"
{{< /tab >}}
{{< /tabs >}}

<!--
Configure:
-->
設定：

```shell
sudo mkdir -p /etc/kubernetes/manifests
```

<!--
```shell
sudo tee /etc/kubernetes/kubelet.yaml <<EOF
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
authentication:
  webhook:
    enabled: false # Do NOT use in production clusters!
authorization:
  mode: AlwaysAllow # Do NOT use in production clusters!
enableServer: false
logging:
  format: text
address: 127.0.0.1 # Restrict access to localhost
readOnlyPort: 10255 # Do NOT use in production clusters!
staticPodPath: /etc/kubernetes/manifests
containerRuntimeEndpoint: unix:///var/run/crio/crio.sock
EOF
```
-->
```shell
sudo tee /etc/kubernetes/kubelet.yaml <<EOF
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
authentication:
  webhook:
    enabled: false # 請勿在生產集羣中使用！
authorization:
  mode: AlwaysAllow # 請勿在生產集羣中使用！
enableServer: false
logging:
  format: text
address: 127.0.0.1 # 限制對 localhost 的訪問
readOnlyPort: 10255 # 請勿在生產集羣中使用！
staticPodPath: /etc/kubernetes/manifests
containerRuntimeEndpoint: unix:///var/run/crio/crio.sock
EOF
```

{{< note >}}
<!--
Because you are not setting up a production cluster, you are using plain HTTP
(`readOnlyPort: 10255`) for unauthenticated queries to the kubelet's API.

The _authentication webhook_ is disabled and _authorization mode_ is set to `AlwaysAllow`
for the purpose of this tutorial. You can learn more about
[authorization modes](/docs/reference/access-authn-authz/authorization/#authorization-modules)
and [webhook authentication](/docs/reference/access-authn-authz/webhook/) to properly
configure kubelet in standalone mode in your environment.

See [Ports and Protocols](/docs/reference/networking/ports-and-protocols/) to
understand which ports Kubernetes components use.
-->
由於你搭建的不是一個生產叢集，所以你可以使用明文
HTTP（`readOnlyPort: 10255`）對 kubelet API 進行不做身份認證的查詢。

爲了順利完成本次教學，**身份認證 Webhook** 被禁用，**鑑權模式**被設置爲 `AlwaysAllow`。
你可以進一步瞭解[鑑權模式](/zh-cn/docs/reference/access-authn-authz/authorization/#authorization-modules)和
[Webhook 身份認證](/zh-cn/docs/reference/access-authn-authz/webhook/)，
以正確地設定 kubelet 在你的環境中以獨立模式運行。

參閱[端口和協議](/zh-cn/docs/reference/networking/ports-and-protocols/)以瞭解 Kubernetes 組件使用的端口。
{{< /note >}}

<!--
Install:
-->
安裝：

```shell
chmod +x kubelet
sudo cp kubelet /usr/bin/
```

<!--
Create a `systemd` service unit file:
-->
創建 `systemd` 服務單元檔案：

```shell
sudo tee /etc/systemd/system/kubelet.service <<EOF
[Unit]
Description=Kubelet

[Service]
ExecStart=/usr/bin/kubelet \
 --config=/etc/kubernetes/kubelet.yaml
Restart=always

[Install]
WantedBy=multi-user.target
EOF
```

<!--
The command line argument `--kubeconfig` has been intentionally omitted in the
service configuration file. This argument sets the path to a
[kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
file that specifies how to connect to the API server, enabling API server mode.
Omitting it, enables standalone mode.

Enable and start the `kubelet` service:
-->
服務設定檔案中故意省略了命令列參數 `--kubeconfig`。此參數設置
[kubeconfig](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
檔案的路徑，指定如何連接到 API 伺服器，以啓用 API 伺服器模式。省略此參數將啓用獨立模式。

啓用並啓動 `kubelet` 服務：

```shell
sudo systemctl daemon-reload
sudo systemctl enable --now kubelet.service
```

<!--
Quick test:
-->
快速測試：

```shell
sudo systemctl is-active kubelet.service
```

<!--
The output is similar to:
-->
輸出類似於：

```
active
```

<!--
Detailed service check:
-->
詳細的服務檢查：

```shell
sudo journalctl -u kubelet.service
```

<!--
Check the kubelet's API `/healthz` endpoint:
-->
檢查 kubelet 的 API `/healthz` 端點：

```shell
curl http://localhost:10255/healthz?verbose
```

<!--
The output is similar to:
-->
輸出類似於：

```
[+]ping ok
[+]log ok
[+]syncloop ok
healthz check passed
```

<!--
Query the kubelet's API `/pods` endpoint:
-->
查詢 kubelet 的 API `/pods` 端點：

```shell
curl http://localhost:10255/pods | jq '.'
```

<!--
The output is similar to:
-->
輸出類似於：

```json
{
  "kind": "PodList",
  "apiVersion": "v1",
  "metadata": {},
  "items": null
}
```

<!--
## Run a Pod in the kubelet

In standalone mode, you can run Pods using Pod manifests. The manifests can either
be on the local filesystem, or fetched via HTTP from a configuration source.

Create a manifest for a Pod:
-->
## 在 kubelet 中運行 Pod   {#run-a-pod-in-the-kubelet}

在獨立模式下，你可以使用 Pod 清單運行 Pod。這些清單可以放在本地檔案系統上，或通過 HTTP 從設定源獲取。

爲 Pod 創建一個清單：

```shell
cat <<EOF > static-web.yaml
apiVersion: v1
kind: Pod
metadata:
  name: static-web
spec:
  containers:
    - name: web
      image: nginx
      ports:
        - name: web
          containerPort: 80
          protocol: TCP
EOF
```

<!--
Copy the `static-web.yaml` manifest file to the `/etc/kubernetes/manifests` directory.
-->
將 `static-web.yaml` 清單檔案複製到 `/etc/kubernetes/manifests` 目錄。

```shell
sudo cp static-web.yaml /etc/kubernetes/manifests/
```

<!--
### Find out information about the kubelet and the Pod {#find-out-information}

The Pod networking plugin creates a network bridge (`cni0`) and a pair of `veth` interfaces
for each Pod (one of the pair is inside the newly made Pod, and the other is at the host level).

Query the kubelet's API endpoint at `http://localhost:10255/pods`:
-->
### 查找 kubelet 和 Pod 的資訊   {#find-out-information}

Pod 網路插件爲每個 Pod 創建一個網路橋（`cni0`）和一對 `veth` 介面
（這對介面的其中一個介面在新創建的 Pod 內，另一個介面在主機層面）。

查詢 kubelet 的 API 端點 `http://localhost:10255/pods`：

```shell
curl http://localhost:10255/pods | jq '.'
```

<!--
To obtain the IP address of the `static-web` Pod:
-->
要獲取 `static-web` Pod 的 IP 地址：

```shell
curl http://localhost:10255/pods | jq '.items[].status.podIP'
```

<!--
The output is similar to:
-->
輸出類似於：

```
"10.85.0.4"
```

<!--
Connect to the `nginx` server Pod on `http://<IP>:<Port>` (port 80 is the default), in this case:
-->
連接到 `nginx` 伺服器 Pod，地址爲 `http://<IP>:<Port>`（端口 80 是預設端口），在本例中爲：

```shell
curl http://10.85.0.4
```

<!--
The output is similar to:
-->
輸出類似於：

```html
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
```

<!--
## Where to look for more details

If you need to diagnose a problem getting this tutorial to work, you can look
within the following directories for monitoring and troubleshooting:
-->
## 瞭解更多細節   {#where-to-look-for-more-details}

如果你需要排查在學習本教程時遇到的問題，你可以在以下目錄中查找監控和故障排查資料：

```
/var/lib/cni
/var/lib/containers
/var/lib/kubelet

/var/log/containers
/var/log/pods
```

<!--
## Clean up

### kubelet
-->
## 清理   {#clean-up}

### kubelet

```shell
sudo systemctl disable --now kubelet.service
sudo systemctl daemon-reload
sudo rm /etc/systemd/system/kubelet.service
sudo rm /usr/bin/kubelet
sudo rm -rf /etc/kubernetes
sudo rm -rf /var/lib/kubelet
sudo rm -rf /var/log/containers
sudo rm -rf /var/log/pods
```

<!--
### Container Runtime
-->
### 容器運行時   {#container-runtime}

```shell
sudo systemctl disable --now crio.service
sudo systemctl daemon-reload
sudo rm -rf /usr/local/bin
sudo rm -rf /usr/local/lib
sudo rm -rf /usr/local/share
sudo rm -rf /usr/libexec/crio
sudo rm -rf /etc/crio
sudo rm -rf /etc/containers
```

<!--
### Network Plugins
-->
### 網路插件   {#network-plugins}

```shell
sudo rm -rf /opt/cni
sudo rm -rf /etc/cni
sudo rm -rf /var/lib/cni
```

<!--
## Conclusion

This page covered the basic aspects of deploying a kubelet in standalone mode.
You are now ready to deploy Pods and test additional functionality.

Notice that in standalone mode the kubelet does *not* support fetching Pod
configurations from the control plane (because there is no control plane connection).

You also cannot use a {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} or a
{{< glossary_tooltip text="Secret" term_id="secret" >}} to configure the containers
in a static Pod.
-->
## 結論   {#conclusion}

本頁涵蓋了以獨立模式部署 kubelet 的各個基本方面。你現在可以部署 Pod 並測試更多功能。

請注意，在獨立模式下，kubelet **不**支持從控制平面獲取 Pod 設定（因爲沒有控制平面連接）。

你還不能使用 {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}
或 {{< glossary_tooltip text="Secret" term_id="secret" >}} 來設定靜態 Pod 中的容器。

## {{% heading "whatsnext" %}}

<!--
* Follow [Hello, minikube](/docs/tutorials/hello-minikube/) to learn about running Kubernetes
  _with_ a control plane. The minikube tool helps you set up a practice cluster on your own computer.
* Learn more about [Network Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
* Learn more about [Container Runtimes](/docs/setup/production-environment/container-runtimes/)
* Learn more about [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
* Learn more about [static Pods](/docs/tasks/configure-pod-container/static-pod/)
-->
* 跟隨[你好，Minikube](/zh-cn/docs/tutorials/hello-minikube/)
  學習如何在**有**控制平面的情況下運行 Kubernetes。minikube 工具幫助你在自己的計算機上搭建一個練習叢集。
* 進一步瞭解[網路插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
* 進一步瞭解[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes/)
* 進一步瞭解 [kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
* 進一步瞭解[靜態 Pod](/zh-cn/docs/tasks/configure-pod-container/static-pod/)
