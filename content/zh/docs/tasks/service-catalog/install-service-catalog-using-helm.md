---
title: 使用 Helm 安装 Service Catalog
content_type: task
---
<!--
title: Install Service Catalog using Helm
reviewers:
- chenopis
content_type: task
-->

<!-- overview -->
{{< glossary_definition term_id="service-catalog" length="all" prepend="服务目录（Service Catalog）是" >}}

<!--
Use [Helm](https://helm.sh/) to install Service Catalog on your Kubernetes cluster. Up to date information on this process can be found at the [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog/blob/master/docs/install.md) repo.
-->
使用 [Helm](https://helm.sh/) 在 Kubernetes 集群上安装 Service Catalog。
要获取有关此过程的最新信息，请浏览 [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog/blob/master/docs/install.md) 仓库。


## {{% heading "prerequisites" %}}

<!--
* Understand the key concepts of [Service Catalog](/docs/concepts/service-catalog/).
* Service Catalog requires a Kubernetes cluster running version 1.7 or higher.
* You must have a Kubernetes cluster with cluster DNS enabled.
    * If you are using a cloud-based Kubernetes cluster or {{< glossary_tooltip text="Minikube" term_id="minikube" >}}, you may already have cluster DNS enabled.
    * If you are using `hack/local-up-cluster.sh`, ensure that the `KUBE_ENABLE_CLUSTER_DNS` environment variable is set, then run the install script.
* [Install and setup kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) v1.7 or higher. Make sure it is configured to connect to the Kubernetes cluster.
* Install [Helm](http://helm.sh/) v2.7.0 or newer.
    * Follow the [Helm install instructions](https://github.com/kubernetes/helm/blob/master/docs/install.md).
    * If you already have an appropriate version of Helm installed, execute `helm init` to install Tiller, the server-side component of Helm.
-->
* 理解[服务目录](/zh/docs/concepts/extend-kubernetes/service-catalog/) 的关键概念。
* Service Catalog 需要 Kubernetes 集群版本在 1.7 或更高版本。
* 你必须启用 Kubernetes 集群的 DNS 功能。
    * 如果使用基于云的 Kubernetes 集群或 {{< glossary_tooltip text="Minikube" term_id="minikube" >}}，则可能已经启用了集群 DNS。
    * 如果你正在使用 `hack/local-up-cluster.sh`，请确保设置了 `KUBE_ENABLE_CLUSTER_DNS` 环境变量，然后运行安装脚本。
* [安装和设置 v1.7 或更高版本的 kubectl](/zh/docs/tasks/tools/install-kubectl/)，确保将其配置为连接到 Kubernetes 集群。
* 安装 v2.7.0 或更高版本的 [Helm](https://helm.sh/)。
    * 遵照 [Helm 安装说明](https://helm.sh/docs/intro/install/)。
    * 如果已经安装了适当版本的 Helm，请执行 `helm init` 来安装 Helm 的服务器端组件 Tiller。

<!-- steps -->
<!--
## Add the service-catalog Helm repository

Once Helm is installed, add the *service-catalog* Helm repository to your local machine by executing the following command:
-->
## 添加 service-catalog Helm 仓库

安装 Helm 后，通过执行以下命令将 *service-catalog* Helm 存储库添加到本地计算机：

```shell
helm repo add svc-cat https://svc-catalog-charts.storage.googleapis.com
```

<!--
Check to make sure that it installed successfully by executing the following command:
-->
通过执行以下命令进行检查，以确保安装成功：

```shell
helm search service-catalog
```

<!--
If the installation was successful, the command should output the following:
-->
如果安装成功，该命令应输出以下内容：

```
NAME            VERSION DESCRIPTION
svc-cat/catalog 0.0.1   service-catalog API server and controller-manag...
```

<!--
## Enable RBAC

Your Kubernetes cluster must have RBAC enabled, which requires your Tiller Pod(s) to have `cluster-admin` access.

If you are using Minikube, run the `minikube start` command with the following flag:
-->
## 启用 RBAC

你的 Kubernetes 集群必须启用 RBAC，这需要你的 Tiller Pod 具有 `cluster-admin` 访问权限。

如果你使用的是 Minikube，请使用以下参数运行 `minikube start` 命令：

```shell
minikube start --extra-config=apiserver.Authorization.Mode=RBAC
```

<!--
If you are using `hack/local-up-cluster.sh`, set the `AUTHORIZATION_MODE` environment variable with the following values:
-->
如果你使用 `hack/local-up-cluster.sh`，请使用以下值设置 `AUTHORIZATION_MODE` 环境变量：

```
AUTHORIZATION_MODE=Node,RBAC hack/local-up-cluster.sh -O
```

<!--
By default, `helm init` installs the Tiller Pod into the `kube-system` namespace, with Tiller configured to use the `default` service account.
-->
默认情况下，`helm init` 将 Tiller Pod 安装到 `kube-system` 命名空间，Tiller 配置为使用 `default` 服务帐户。

<!--
If you used the `--tiller-namespace` or `--service-account` flags when running `helm init`, the `--serviceaccount` flag in the following command needs to be adjusted to reference the appropriate namespace and ServiceAccount name.
-->
{{< note >}}
如果在运行 `helm init` 时使用了 `--tiller-namespace` 或 `--service-account` 参数，
则需要调整以下命令中的 `--serviceaccount` 参数以引用相应的名字空间和服务账号名称。
{{< /note >}}

<!--
Configure Tiller to have `cluster-admin` access:
-->
配置 Tiller 以获得 `cluster-admin` 访问权限：

```shell
kubectl create clusterrolebinding tiller-cluster-admin \
    --clusterrole=cluster-admin \
    --serviceaccount=kube-system:default
```

<!--
## Install Service Catalog in your Kubernetes cluster

Install Service Catalog from the root of the Helm repository using the following command:
-->
## 在 Kubernetes 集群中安装 Service Catalog

使用以下命令从 Helm 存储库的根目录安装 Service Catalog：

{{< tabs name="helm-versions" >}}
{{% tab name="Helm version 3" %}}
```shell
helm install catalog svc-cat/catalog --namespace catalog
```
{{% /tab %}}
{{% tab name="Helm version 2" %}}

```shell
helm install svc-cat/catalog --name catalog --namespace catalog
```
{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

<!--
* View [sample service brokers](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers).
* Explore the [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog) project.
-->
* 查看[示例服务代理](https://github.com/openservicebrokerapi/servicebroker/blob/mastergettingStarted.md#sample-service-brokers)。
* 探索 [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog) 项目。
