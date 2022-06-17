---
title: 使用 Cilium 提供 NetworkPolicy
content_type: task
weight: 20
---

<!--
reviewers:
- danwent
- aanm
title: Use Cilium for NetworkPolicy
content_type: task
weight: 20
-->

<!-- overview -->
<!--
This page shows how to use Cilium for NetworkPolicy.

For background on Cilium, read the [Introduction to Cilium](https://docs.cilium.io/en/stable/intro).
-->
本頁展示如何使用 Cilium 提供 NetworkPolicy。

關於 Cilium 的背景知識，請閱讀 [Cilium 介紹](https://docs.cilium.io/en/stable/intro)。

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
## 在 Minikube 上部署 Cilium 用於基本測試

為了輕鬆熟悉 Cilium 你可以根據
[Cilium Kubernetes 入門指南](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/s)
在 minikube 中執行一個 cilium 的基本 DaemonSet 安裝。

要啟動 minikube，需要的最低版本為 1.5.2，使用下面的引數執行：

```shell
minikube version
```
```
minikube version: v1.5.2
```

```shell
minikube start --network-plugin=cni --memory=4096
```

<!--
For minikube you can install Cilium using its CLI tool. Cilium will
automatically detect the cluster configuration and will install the appropriate
components for a successful installation:
-->
對於 minikube 你可以使用 Cilium 的 CLI 工具安裝它。
Cilium 將自動檢測叢集配置併為成功的叢集部署選擇合適的元件。

```shell
curl -LO https://github.com/cilium/cilium-cli/releases/latest/download/cilium-linux-amd64.tar.gz
sudo tar xzvfC cilium-linux-amd64.tar.gz /usr/local/bin
rm cilium-linux-amd64.tar.gz
cilium install
```
```
🔮 Auto-detected Kubernetes kind: minikube
✨ Running "minikube" validation checks
✅ Detected minikube version "1.20.0"
ℹ️  Cilium version not set, using default version "v1.10.0"
🔮 Auto-detected cluster name: minikube
🔮 Auto-detected IPAM mode: cluster-pool
🔮 Auto-detected datapath mode: tunnel
🔑 Generating CA...
2021/05/27 02:54:44 [INFO] generate received request
2021/05/27 02:54:44 [INFO] received CSR
2021/05/27 02:54:44 [INFO] generating key: ecdsa-256
2021/05/27 02:54:44 [INFO] encoded CSR
2021/05/27 02:54:44 [INFO] signed certificate with serial number 48713764918856674401136471229482703021230538642
🔑 Generating certificates for Hubble...
2021/05/27 02:54:44 [INFO] generate received request
2021/05/27 02:54:44 [INFO] received CSR
2021/05/27 02:54:44 [INFO] generating key: ecdsa-256
2021/05/27 02:54:44 [INFO] encoded CSR
2021/05/27 02:54:44 [INFO] signed certificate with serial number 3514109734025784310086389188421560613333279574
🚀 Creating Service accounts...
🚀 Creating Cluster roles...
🚀 Creating ConfigMap...
🚀 Creating Agent DaemonSet...
🚀 Creating Operator Deployment...
⌛ Waiting for Cilium to be installed...
```

<!--
The remainder of the Getting Started Guide explains how to enforce both L3/L4
(i.e., IP address + port) security policies, as well as L7 (e.g., HTTP) security
policies using an example application.
-->
入門指南其餘的部分用一個示例應用說明了如何強制執行 L3/L4（即 IP 地址+埠）的安全策略
以及L7 （如 HTTP）的安全策略。

<!--
## Deploying Cilium for Production Use

For detailed instructions around deploying Cilium for production, see:
[Cilium Kubernetes Installation Guide](https://docs.cilium.io/en/stable/concepts/kubernetes/intro/)
This documentation includes detailed requirements, instructions and example
production DaemonSet files.
 -->
## 部署 Cilium 用於生產用途

關於部署 Cilium 用於生產的詳細說明，請見
[Cilium Kubernetes 安裝指南](https://docs.cilium.io/en/stable/concepts/kubernetes/intro/)
此文件包括詳細的需求、說明和生產用途 DaemonSet 檔案示例。

<!-- discussion -->

<!--
##  Understanding Cilium components

Deploying a cluster with Cilium adds Pods to the `kube-system` namespace. To see
this list of Pods run:
 -->
##  瞭解 Cilium 元件

部署使用 Cilium 的叢集會新增 Pods 到 `kube-system` 名稱空間。要檢視 Pod 列表，執行：

```shell
kubectl get pods --namespace=kube-system -l k8s-app=cilium
```

<!-- You'll see a list of Pods similar to this: -->
你將看到像這樣的 Pods 列表：

```console
NAME           READY   STATUS    RESTARTS   AGE
cilium-kkdhz   1/1     Running   0          3m23s
...
```

<!--
A `cilium` Pod runs on each node in your cluster and enforces network policy
on the traffic to/from Pods on that node using Linux BPF.
-->
你的叢集中的每個節點上都會執行一個 `cilium` Pod，透過使用 Linux BPF
針對該節點上的 Pod 的入站、出站流量實施網路策略控制。

## {{% heading "whatsnext" %}}

<!--
Once your cluster is running, you can follow the
[Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
to try out Kubernetes NetworkPolicy with Cilium.
Have fun, and if you have questions, contact us using the
[Cilium Slack Channel](https://cilium.herokuapp.com/).
-->
叢集執行後，你可以按照
[宣告網路策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)
試用基於 Cilium 的 Kubernetes NetworkPolicy。
玩得開心，如果你有任何疑問，請到 [Cilium Slack 頻道](https://cilium.herokuapp.com/)
聯絡我們。

