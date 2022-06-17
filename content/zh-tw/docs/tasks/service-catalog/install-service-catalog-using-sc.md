---
title: 使用 SC 安裝服務目錄
content_type: task
---
<!--
title: Install Service Catalog using SC
reviewers:
- chenopis
content_type: task
-->

<!-- overview -->
{{< glossary_definition term_id="service-catalog" length="all" prepend="服務目錄（Service Catalog）是" >}}

<!--
You can use the GCP [Service Catalog Installer](https://github.com/GoogleCloudPlatform/k8s-service-catalog#installation)
tool to easily install or uninstall Service Catalog on your Kubernetes cluster, linking it to
Google Cloud projects.

Service Catalog can work with any kind of managed service, not only Google Cloud.
-->
使用 GCP [服務目錄安裝程式](https://github.com/GoogleCloudPlatform/k8s-service-catalog#installation)
工具可以輕鬆地在 Kubernetes 叢集上安裝或解除安裝服務目錄，並將其連結到 Google Cloud 專案。

服務目錄不僅可以與 Google Cloud 一起使用，還可以與任何型別的託管服務一起使用。

## {{% heading "prerequisites" %}}

<!--
* Understand the key concepts of [Service Catalog](/docs/concepts/extend-kubernetes/service-catalog/).
* Install [Go 1.6+](https://golang.org/dl/) and set the `GOPATH`.
* Install the [cfssl](https://github.com/cloudflare/cfssl) tool needed for generating SSL artifacts.
* Service Catalog requires Kubernetes version 1.7+.
* [Install and setup kubectl](/docs/tasks/tools/) so that it is configured to connect to a Kubernetes v1.7+ cluster.
* The kubectl user must be bound to the *cluster-admin* role for it to install Service Catalog. To ensure that this is true, run the following command:

        kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=<user-name>
-->
* 瞭解[服務目錄](/zh-cn/docs/concepts/extend-kubernetes/service-catalog/)
  的主要概念。
* 安裝 [Go 1.6+](https://golang.org/dl/) 以及設定 `GOPATH`。
* 安裝生成 SSL 工件所需的 [cfssl](https://github.com/cloudflare/cfssl) 工具。
* 服務目錄需要 Kubernetes 1.7+ 版本。
* [安裝和設定 kubectl](/zh-cn/docs/tasks/tools/)，
  以便將其配置為連線到 Kubernetes v1.7+ 叢集。
* 要安裝服務目錄，kubectl 使用者必須繫結到 *cluster-admin* 角色。
  為了確保這是正確的，請執行以下命令：

  ```shell
  kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=<user-name>
  ```

<!-- steps -->
<!--
## Install `sc` in your local environment

The installer runs on your local computer as a CLI tool named `sc`.

Install using `go get`:
-->
## 在本地環境中安裝 `sc`    {#install-sc-in-your-local-environment}

安裝程式在你的本地計算機上以 CLI 工具的形式執行，名為 `sc`。

使用 `go get` 安裝：

```shell
go get github.com/GoogleCloudPlatform/k8s-service-catalog/installer/cmd/sc
```

<!--
`sc` should now be installed in your `GOPATH/bin` directory.
-->
現在，`sc` 應該已經被安裝在 `GOPATH/bin` 目錄中了。

<!--
## Install Service Catalog in your Kubernetes cluster

First, verify that all dependencies have been installed. Run:
-->
## 在 Kubernetes 叢集中安裝服務目錄    {#install-service-catalog-in-your-kubernetes-cluster}

首先，檢查是否已經安裝了所有依賴項。執行：

```shell
sc check
```

<!--
If the check is successful, it should return:
-->
如檢查透過，應輸出：

```
Dependency check passed. You are good to go.
```

<!--
Next, run the install command and specify the `storageclass` that you want to use for the backup:
-->
接下來，執行安裝命令並指定要用於備份的 `storageclass`：

```shell
sc install --etcd-backup-storageclass "standard"
```

<!--
## Uninstall Service Catalog

If you would like to uninstall Service Catalog from your Kubernetes cluster using the `sc` tool, run:
-->
## 解除安裝服務目錄    {#uninstall-service-catalog}

如果你想使用 `sc` 工具從 Kubernetes 叢集解除安裝服務目錄，請執行：

```shell
sc uninstall
```

## {{% heading "whatsnext" %}}

<!--
* View [sample service brokers](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers).
* Explore the [kubernetes-sigs/service-catalog](https://github.com/kubernetes-sigs/service-catalog) project.
-->
* 檢視[服務代理示例](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers)。
* 探索 [kubernetes-sigs/service-catalog](https://github.com/kubernetes-sigs/service-catalog) 專案。


