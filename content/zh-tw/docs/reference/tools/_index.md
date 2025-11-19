---
title: 其他工具
content_type: concept
weight: 150
no_list: true
---

<!-- 
title: Other Tools
reviewers:
- janetkuo
content_type: concept
weight: 150
no_list: true
-->

<!-- overview -->
<!-- 
Kubernetes contains several tools to help you work with the Kubernetes system.
-->
Kubernetes 包含多種工具來幫助你使用 Kubernetes 系統。


<!-- body -->

<!--  
[`crictl`](https://github.com/kubernetes-sigs/cri-tools) is a command-line
interface for inspecting and debugging {{<glossary_tooltip term_id="cri" text="CRI">}}-compatible
container runtimes.
-->
## crictl

[`crictl`](https://github.com/kubernetes-sigs/cri-tools)
是用於檢查和調試兼容 {{<glossary_tooltip term_id="cri" text="CRI">}} 的容器運行時的命令行接口。

<!-- 
## Dashboard

[`Dashboard`](/docs/tasks/access-application-cluster/web-ui-dashboard/), the web-based user interface of Kubernetes, allows you to deploy containerized applications
to a Kubernetes cluster, troubleshoot them, and manage the cluster and its resources itself.
-->
## 儀表盤   {#dashboard}

[`Dashboard`](/zh-cn/docs/tasks/access-application-cluster/web-ui-dashboard/)，
基於 Web 的 Kubernetes 用戶界面，
允許你將容器化的應用程序部署到 Kubernetes 集羣，
對它們進行故障排查，並管理集羣及其資源本身。

<!-- 
## Helm

[Helm](https://helm.sh/) is a tool for managing packages of pre-configured
Kubernetes resources. These packages are known as _Helm charts_.
-->
## Helm
{{% thirdparty-content single="true" %}}

[Helm](https://helm.sh/)
是一個用於管理預配置 Kubernetes 資源包的工具。這些包被稱爲“Helm 圖表”。

<!-- 
Use Helm to:

* Find and use popular software packaged as Kubernetes charts
* Share your own applications as Kubernetes charts
* Create reproducible builds of your Kubernetes applications
* Intelligently manage your Kubernetes manifest files
* Manage releases of Helm packages
-->
使用 Helm 來：

* 查找和使用打包爲 Kubernetes 圖表的流行軟件
* 將你自己的應用程序共享爲 Kubernetes 圖表
* 爲你的 Kubernetes 應用程序創建可重現的構建
* 智能管理你的 Kubernetes 清單文件
* 管理 Helm 包的發佈

<!-- 
## Kompose

[`Kompose`](https://github.com/kubernetes/kompose) is a tool to help Docker Compose users move to Kubernetes.
-->
## Kompose

[`Kompose`](https://github.com/kubernetes/kompose)
是一個幫助 Docker Compose 用戶遷移到 Kubernetes 的工具。

<!-- 
Use Kompose to:

* Translate a Docker Compose file into Kubernetes objects
* Go from local Docker development to managing your application via Kubernetes
* Convert v1 or v2 Docker Compose `yaml` files or [Distributed Application Bundles](https://docs.docker.com/compose/bundles/)
-->

使用 Kompose：

* 將 Docker Compose 文件翻譯成 Kubernetes 對象
* 從本地 Docker 開發轉到通過 Kubernetes 管理你的應用程序
* 轉換 Docker Compose v1 或 v2 版本的 `yaml` 文件或[分佈式應用程序包](https://docs.docker.com/compose/bundles/)

## Kui

<!--
[`Kui`](https://github.com/kubernetes-sigs/kui) is a GUI tool that takes your normal
`kubectl` command line requests and responds with graphics.
-->
[`Kui`](https://github.com/kubernetes-sigs/kui)
是一個接受你標準的 `kubectl` 命令行請求並以圖形響應的 GUI 工具。

<!--
Kui takes the normal `kubectl` command line requests and responds with graphics. Instead 
of ASCII tables, Kui provides a GUI rendering with tables that you can sort.
-->
Kui 接受標準的 `kubectl` 命令行工具並以圖形響應。
Kui 提供包含可排序表格的 GUI 渲染，而不是 ASCII 表格。

<!--
Kui lets you:

* Directly click on long, auto-generated resource names instead of copying and pasting
* Type in `kubectl` commands and see them execute, even sometimes faster than `kubectl` itself
* Query a {{< glossary_tooltip text="Job" term_id="job">}} and see its execution rendered
  as a waterfall diagram
* Click through resources in your cluster using a tabbed UI 
-->
Kui 讓你能夠：

* 直接點擊長的、自動生成的資源名稱，而不是複製和粘貼
* 輸入 `kubectl` 命令並查看它們的執行，有時甚至比 `kubectl` 本身更快
* 查詢 {{<glossary_tooltip text="Job" term_id="job">}} 並查看其執行渲染爲瀑布圖
* 使用選項卡式 UI 在集羣中單擊資源

## Minikube

<!--
[`minikube`](https://minikube.sigs.k8s.io/docs/) is a tool that
runs a single-node Kubernetes cluster locally on your workstation for
development and testing purposes.
-->
[`minikube`](https://minikube.sigs.k8s.io/docs/)
是一種在你的工作站上本地運行單節點 Kubernetes 集羣的工具，用於開發和測試。