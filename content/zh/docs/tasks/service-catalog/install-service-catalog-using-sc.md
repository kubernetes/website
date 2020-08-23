---
title: 使用 SC 安装服务目录
reviewers:
- chenopis
content_type: task
---

<!--
title: Install Service Catalog using SC
reviewers:
- chenopis
content_type: task
-->

<!-- overview -->
{{< glossary_definition term_id="service-catalog" length="all" prepend="服务目录（Service Catalog）是" >}}

<!--
Use the [Service Catalog Installer](https://github.com/GoogleCloudPlatform/k8s-service-catalog#installation) tool to easily install or uninstall Service Catalog on your Kubernetes cluster. This CLI tool is installed as `sc` in your local environment.
-->
使用[服务目录安装程序](https://github.com/GoogleCloudPlatform/k8s-service-catalog#installation)
工具可以轻松地在 Kubernetes 集群上安装或卸载服务目录。
这个 CLI 工具以 `sc` 命令形式被安装在您的本地环境中。


## {{% heading "prerequisites" %}}

<!--
* Understand the key concepts of [Service Catalog](/docs/concepts/service-catalog/).
* Install [Go 1.6+](https://golang.org/dl/) and set the `GOPATH`.
* Install the [cfssl](https://github.com/cloudflare/cfssl) tool needed for generating SSL artifacts.
* Service Catalog requires Kubernetes version 1.7+.
* [Install and setup kubectl](/docs/tasks/tools/install-kubectl/) so that it is configured to connect to a Kubernetes v1.7+ cluster.
* The kubectl user must be bound to the *cluster-admin* role for it to install Service Catalog. To ensure that this is true, run the following command:

        kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=<user-name>
-->
* 了解[服务目录](/zh/docs/concepts/service-catalog/)的主要概念。
* 安装 [Go 1.6+](https://golang.org/dl/) 以及设置 `GOPATH`。
* 安装生成 SSL 工件所需的 [cfssl](https://github.com/cloudflare/cfssl) 工具。
* 服务目录需要 Kubernetes 1.7+ 版本。
* [安装和设置 kubectl](/zh/docs/tasks/tools/install-kubectl/)，以便将其配置为连接到 Kubernetes v1.7+ 集群。
* 要安装服务目录，kubectl 用户必须绑定到 *cluster-admin* 角色。为了确保这是正确的，请运行以下命令：

  ```
  kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=<user-name>
  ```

<!-- steps -->
<!--
## Install `sc` in your local environment

Install the `sc` CLI tool using the `go get` command:
-->
## 在本地环境中安装 `sc`

使用 `go get` 命令安装 `sc` CLI 工具：

```Go
go get github.com/GoogleCloudPlatform/k8s-service-catalog/installer/cmd/sc
```

<!--
After running the above command, `sc` should be installed in your `GOPATH/bin` directory.
-->
执行上述命令后，`sc` 应被安装在 `GOPATH/bin` 目录中了。

<!--
## Install Service Catalog in your Kubernetes cluster

First, verify that all dependencies have been installed. Run:
-->
## 在 Kubernetes 集群中安装服务目录

首先，检查是否已经安装了所有依赖项。运行：

```shell
sc check
```

<!--
If the check is successful, it should return:
-->
如检查通过，应输出：

```
Dependency check passed. You are good to go.
```

<!--
Next, run the install command and specify the `storageclass` that you want to use for the backup:
-->
接下来，运行安装命令并指定要用于备份的 `storageclass`：

```shell
sc install --etcd-backup-storageclass "standard"
```

<!--
## Uninstall Service Catalog

If you would like to uninstall Service Catalog from your Kubernetes cluster using the `sc` tool, run:
-->
## 卸载服务目录

如果您想使用 `sc` 工具从 Kubernetes 集群卸载服务目录，请运行：

```shell
sc uninstall
```

## {{% heading "whatsnext" %}}

<!--
* View [sample service brokers](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers).
* Explore the [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog) project.
-->
* 查看 [服务代理示例](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers)。
* 探索 [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog) 项目。


