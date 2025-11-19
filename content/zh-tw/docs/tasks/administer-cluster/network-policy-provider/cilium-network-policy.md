---
title: 使用 Cilium 提供 NetworkPolicy
content_type: task
weight: 30
---

<!--
reviewers:
- danwent
- aanm
title: Use Cilium for NetworkPolicy
content_type: task
weight: 30
-->

<!-- overview -->
<!--
This page shows how to use Cilium for NetworkPolicy.

For background on Cilium, read the [Introduction to Cilium](https://docs.cilium.io/en/stable/overview/intro).
-->
本頁展示如何使用 Cilium 提供 NetworkPolicy。

關於 Cilium 的背景知識，請閱讀 [Cilium 介紹](https://docs.cilium.io/en/stable/overview/intro)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Deploying Cilium on Minikube for Basic Testing

To get familiar with Cilium easily you can follow the
[Cilium Kubernetes Getting Started Guide](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/)
to perform a basic DaemonSet installation of Cilium in minikube.

To start minikube, minimal version required is >= v1.5.2, run the with the
following arguments:
-->
## 在 Minikube 上部署 Cilium 用於基本測試   {#deploying-cilium-on-minikube-for-basic-testing}

爲了輕鬆熟悉 Cilium，你可以根據
[Cilium Kubernetes 入門指南](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/s)
在 minikube 中執行一個 Cilium 的基本 DaemonSet 安裝。

要啓動 minikube，需要的最低版本爲 1.5.2，使用下面的參數運行：

```shell
minikube version
```
```
minikube version: v1.5.2
```

```shell
minikube start --network-plugin=cni
```

<!--
For minikube you can install Cilium using its CLI tool. To do so, first download the latest
version of the CLI with the following command:
-->
對於 minikube 你可以使用 Cilium 的 CLI 工具安裝它。
爲此，先用以下命令下載最新版本的 CLI：

```shell
curl -LO https://github.com/cilium/cilium-cli/releases/latest/download/cilium-linux-amd64.tar.gz
```

<!--
Then extract the downloaded file to your `/usr/local/bin` directory with the following command:
-->
然後用以下命令將下載的文件解壓縮到你的 `/usr/local/bin` 目錄：

```shell
sudo tar xzvfC cilium-linux-amd64.tar.gz /usr/local/bin
rm cilium-linux-amd64.tar.gz
```

<!--
After running the above commands, you can now install Cilium with the following command:
-->
運行上述命令後，你現在可以用以下命令安裝 Cilium：

```shell
cilium install
```

<!--
Cilium will then automatically detect the cluster configuration and create and
install the appropriate components for a successful installation.
The components are:

- Certificate Authority (CA) in Secret `cilium-ca` and certificates for Hubble (Cilium's observability layer).
- Service accounts.
- Cluster roles.
- ConfigMap.
- Agent DaemonSet and an Operator Deployment.
-->
隨後 Cilium 將自動檢測叢集設定，並創建和安裝合適的組件以成功完成安裝。
這些組件爲：

- Secret `cilium-ca` 中的證書機構 (CA) 和 Hubble（Cilium 的可觀測層）所用的證書。
- 服務賬號。
- 叢集角色。
- ConfigMap。
- Agent DaemonSet 和 Operator Deployment。

<!--
After the installation, you can view the overall status of the Cilium deployment with the `cilium status` command.
See the expected output of the `status` command
[here](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/#validate-the-installation). 
-->
安裝之後，你可以用 `cilium status` 命令查看 Cilium Deployment 的整體狀態。
[在此處](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/#validate-the-installation)查看
`status` 命令的預期輸出。

<!--
The remainder of the Getting Started Guide explains how to enforce both L3/L4
(i.e., IP address + port) security policies, as well as L7 (e.g., HTTP) security
policies using an example application.
-->
入門指南其餘的部分用一個示例應用說明了如何強制執行 L3/L4（即 IP 地址 + 端口）的安全策略以及
L7 （如 HTTP）的安全策略。

<!--
## Deploying Cilium for Production Use

For detailed instructions around deploying Cilium for production, see:
[Cilium Kubernetes Installation Guide](https://docs.cilium.io/en/stable/network/kubernetes/concepts/)
This documentation includes detailed requirements, instructions and example
production DaemonSet files.
 -->
## 部署 Cilium 用於生產用途   {#deployment-cilium-for-production-use}

關於部署 Cilium 用於生產的詳細說明，請參見
[Cilium Kubernetes 安裝指南](https://docs.cilium.io/en/stable/network/kubernetes/concepts/)。
此文檔包括詳細的需求、說明和生產用途 DaemonSet 文件示例。

<!-- discussion -->

<!--
##  Understanding Cilium components

Deploying a cluster with Cilium adds Pods to the `kube-system` namespace. To see
this list of Pods run:
-->
## 瞭解 Cilium 組件   {#understanding-cilium-components}

部署使用 Cilium 的叢集會添加 Pod 到 `kube-system` 命名空間。要查看 Pod 列表，運行：

```shell
kubectl get pods --namespace=kube-system -l k8s-app=cilium
```

<!--
You'll see a list of Pods similar to this:
-->
你將看到像這樣的 Pod 列表：

```console
NAME           READY   STATUS    RESTARTS   AGE
cilium-kkdhz   1/1     Running   0          3m23s
...
```

<!--
A `cilium` Pod runs on each node in your cluster and enforces network policy
on the traffic to/from Pods on that node using Linux BPF.
-->
你的叢集中的每個節點上都會運行一個 `cilium` Pod，通過使用 Linux BPF
針對該節點上的 Pod 的入站、出站流量實施網路策略控制。

## {{% heading "whatsnext" %}}

<!--
Once your cluster is running, you can follow the
[Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
to try out Kubernetes NetworkPolicy with Cilium.
Have fun, and if you have questions, contact us using the
[Cilium Slack Channel](https://cilium.herokuapp.com/).
-->
叢集運行後，
你可以按照[聲明網路策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)試用基於
Cilium 的 Kubernetes NetworkPolicy。玩得開心，如果你有任何疑問，請到
[Cilium Slack 頻道](https://cilium.herokuapp.com/)聯繫我們。

