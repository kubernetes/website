---
title: 使用 Helm 安裝 Service Catalog
content_type: task
---
<!--
title: Install Service Catalog using Helm
reviewers:
- chenopis
content_type: task
-->

<!-- overview -->
{{< glossary_definition term_id="service-catalog" length="all" prepend="服務目錄（Service Catalog）是" >}}

<!--
Use [Helm](https://helm.sh/) to install Service Catalog on your Kubernetes cluster. Up to date information on this process can be found at the [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog/blob/master/docs/install.md) repo.
-->
使用 [Helm](https://helm.sh/) 在 Kubernetes 叢集上安裝 Service Catalog。
要獲取有關此過程的最新資訊，請瀏覽 [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog/blob/master/docs/install.md) 倉庫。


## {{% heading "prerequisites" %}}

<!--
* Understand the key concepts of [Service Catalog](/docs/concepts/service-catalog/).
* Service Catalog requires a Kubernetes cluster running version 1.7 or higher.
* You must have a Kubernetes cluster with cluster DNS enabled.
    * If you are using a cloud-based Kubernetes cluster or {{< glossary_tooltip text="Minikube" term_id="minikube" >}}, you may already have cluster DNS enabled.
    * If you are using `hack/local-up-cluster.sh`, ensure that the `KUBE_ENABLE_CLUSTER_DNS` environment variable is set, then run the install script.
* [Install and setup kubectl](/docs/tasks/tools/) v1.7 or higher. Make sure it is configured to connect to the Kubernetes cluster.
* Install [Helm](http://helm.sh/) v2.7.0 or newer.
    * Follow the [Helm install instructions](https://github.com/kubernetes/helm/blob/master/docs/install.md).
    * If you already have an appropriate version of Helm installed, execute `helm init` to install Tiller, the server-side component of Helm.
-->
* 理解[服務目錄](/zh-cn/docs/concepts/extend-kubernetes/service-catalog/) 的關鍵概念。
* Service Catalog 需要 Kubernetes 叢集版本在 1.7 或更高版本。
* 你必須啟用 Kubernetes 叢集的 DNS 功能。
    * 如果使用基於雲的 Kubernetes 叢集或 {{< glossary_tooltip text="Minikube" term_id="minikube" >}}，則可能已經啟用了叢集 DNS。
    * 如果你正在使用 `hack/local-up-cluster.sh`，請確保設定了 `KUBE_ENABLE_CLUSTER_DNS` 環境變數，然後執行安裝指令碼。
* [安裝和設定 v1.7 或更高版本的 kubectl](/zh-cn/docs/tasks/tools/)，確保將其配置為連線到 Kubernetes 叢集。
* 安裝 v2.7.0 或更高版本的 [Helm](https://helm.sh/)。
    * 遵照 [Helm 安裝說明](https://helm.sh/docs/intro/install/)。
    * 如果已經安裝了適當版本的 Helm，請執行 `helm init` 來安裝 Helm 的伺服器端元件 Tiller。

<!-- steps -->
<!--
## Add the service-catalog Helm repository

Once Helm is installed, add the *service-catalog* Helm repository to your local machine by executing the following command:
-->
## 新增 service-catalog Helm 倉庫

安裝 Helm 後，透過執行以下命令將 *service-catalog* Helm 儲存庫新增到本地計算機：

```shell
helm repo add svc-cat https://kubernetes-sigs.github.io/service-catalog
```

<!--
Check to make sure that it installed successfully by executing the following command:
-->
透過執行以下命令進行檢查，以確保安裝成功：

```shell
helm search service-catalog
```

<!--
If the installation was successful, the command should output the following:
-->
如果安裝成功，該命令應輸出以下內容：

```
NAME            VERSION DESCRIPTION
svc-cat/catalog 0.0.1   service-catalog API server and controller-manag...
```

<!--
## Enable RBAC

Your Kubernetes cluster must have RBAC enabled, which requires your Tiller Pod(s) to have `cluster-admin` access.

If you are using Minikube, run the `minikube start` command with the following flag:
-->
## 啟用 RBAC

你的 Kubernetes 叢集必須啟用 RBAC，這需要你的 Tiller Pod 具有 `cluster-admin` 訪問許可權。

如果你使用的是 Minikube，請使用以下引數執行 `minikube start` 命令：

```shell
minikube start --extra-config=apiserver.Authorization.Mode=RBAC
```

<!--
If you are using `hack/local-up-cluster.sh`, set the `AUTHORIZATION_MODE` environment variable with the following values:
-->
如果你使用 `hack/local-up-cluster.sh`，請使用以下值設定 `AUTHORIZATION_MODE` 環境變數：

```
AUTHORIZATION_MODE=Node,RBAC hack/local-up-cluster.sh -O
```

<!--
By default, `helm init` installs the Tiller Pod into the `kube-system` namespace, with Tiller configured to use the `default` service account.
-->
預設情況下，`helm init` 將 Tiller Pod 安裝到 `kube-system` 名稱空間，Tiller 配置為使用 `default` 服務帳戶。

<!--
If you used the `--tiller-namespace` or `--service-account` flags when running `helm init`, the `--serviceaccount` flag in the following command needs to be adjusted to reference the appropriate namespace and ServiceAccount name.
-->
{{< note >}}
如果在執行 `helm init` 時使用了 `--tiller-namespace` 或 `--service-account` 引數，
則需要調整以下命令中的 `--serviceaccount` 引數以引用相應的名字空間和服務賬號名稱。
{{< /note >}}

<!--
Configure Tiller to have `cluster-admin` access:
-->
配置 Tiller 以獲得 `cluster-admin` 訪問許可權：

```shell
kubectl create clusterrolebinding tiller-cluster-admin \
    --clusterrole=cluster-admin \
    --serviceaccount=kube-system:default
```

<!--
## Install Service Catalog in your Kubernetes cluster

Install Service Catalog from the root of the Helm repository using the following command:
-->
## 在 Kubernetes 叢集中安裝 Service Catalog

使用以下命令從 Helm 儲存庫的根目錄安裝 Service Catalog：

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
* 檢視[示例服務代理](https://github.com/openservicebrokerapi/servicebroker/blob/mastergettingStarted.md#sample-service-brokers)。
* 探索 [kubernetes-incubator/service-catalog](https://github.com/kubernetes-incubator/service-catalog) 專案。
