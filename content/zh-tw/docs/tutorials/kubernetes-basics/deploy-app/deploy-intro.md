---
title: 使用 kubectl 創建 Deployment
weight: 10
---
<!--
title: Using kubectl to Create a Deployment
weight: 10
-->

## {{% heading "objectives" %}}

<!--
* Learn about application Deployments.
* Deploy your first app on Kubernetes with kubectl.
-->
* 學習應用的部署。
* 使用 kubectl 在 Kubernetes 上部署第一個應用。

<!--
## Kubernetes Deployments
-->
## Kubernetes Deployment

{{% alert %}}
<!--
_A Deployment is responsible for creating and updating instances of your application._
-->
**Deployment 負責創建和更新應用的實例**
{{% /alert %}}

{{< note >}}
<!--
This tutorial uses a container that requires the AMD64 architecture. If you are using
minikube on a computer with a different CPU architecture, you could try using minikube with
a driver that can emulate AMD64. For example, the Docker Desktop driver can do this.
-->
本教程使用了一個需要 AMD64 架構的容器。如果你在使用 Minikube
的計算機上使用了不同的 CPU 架構，可以嘗試使用能夠模擬 AMD64
的 Minikube 驅動程序。例如，Docker Desktop 驅動程序可以實現這一點。
{{< /note >}}

<!--
Once you have a [running Kubernetes cluster](/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/),
you can deploy your containerized applications on top of it. To do so, you create a
Kubernetes **Deployment**. The Deployment instructs Kubernetes how to create and
update instances of your application. Once you've created a Deployment, the Kubernetes
control plane schedules the application instances included in that Deployment to run
on individual Nodes in the cluster.
-->
一旦[運行了 Kubernetes 叢集](/zh-cn/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/)，
就可以在其上部署容器化應用。爲此，你需要創建 Kubernetes **Deployment**。
Deployment 指揮 Kubernetes 如何創建和更新應用的實例。
創建 Deployment 後，Kubernetes 控制平面將 Deployment
中包含的應用實例調度到叢集中的各個節點上。

<!--
Once the application instances are created, a Kubernetes Deployment controller continuously
monitors those instances. If the Node hosting an instance goes down or is deleted,
the Deployment controller replaces the instance with an instance on another Node
in the cluster. **This provides a self-healing mechanism to address machine failure
or maintenance.**
-->
創建應用實例後，Kubernetes Deployment 控制器會持續監視這些實例。
如果託管實例的節點關閉或被刪除，則 Deployment 控制器會將該實例替換爲叢集中另一個節點上的實例。
**這提供了一種自我修復機制來解決機器故障維護問題。**

<!--
In a pre-orchestration world, installation scripts would often be used to start
applications, but they did not allow recovery from machine failure. By both creating
your application instances and keeping them running across Nodes, Kubernetes Deployments
provide a fundamentally different approach to application management.
-->
在沒有 Kubernetes 這種編排系統之前，安裝腳本通常用於啓動應用，
但它們不允許從機器故障中恢復。通過創建應用實例並使它們在節點之間運行，
Kubernetes Deployment 提供了一種與衆不同的應用管理方法。

<!--
## Deploying your first app on Kubernetes
-->
## 部署你在 Kubernetes 上的第一個應用

{{% alert %}}
<!--
_Applications need to be packaged into one of the supported container formats in
order to be deployed on Kubernetes._
-->
**應用需要打包成一種受支持的容器格式，以便部署在 Kubernetes 上。**
{{% /alert %}}

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_02_first_app.svg" class="diagram-medium" >}}

<!--
You can create and manage a Deployment by using the Kubernetes command line interface,
[kubectl](/docs/reference/kubectl/). `kubectl` uses the Kubernetes API to interact
with the cluster. In this module, you'll learn the most common `kubectl` commands
needed to create Deployments that run your applications on a Kubernetes cluster.

When you create a Deployment, you'll need to specify the container image for your
application and the number of replicas that you want to run. You can change that
information later by updating your Deployment; [Module 5](/docs/tutorials/kubernetes-basics/scale/scale-intro/)
and [Module 6](/docs/tutorials/kubernetes-basics/update/update-intro/) of the bootcamp
discuss how you can scale and update your Deployments.
-->
你可以使用 Kubernetes 命令列界面 `kubectl` 創建和管理 Deployment。
kubectl 使用 Kubernetes API 與叢集進行交互。在本單元中，你將學習創建在 Kubernetes
叢集上運行應用的 Deployment 所需的最常見的 kubectl 命令。

創建 Deployment 時，你需要指定應用的容器映像檔以及要運行的副本數。
你可以稍後通過更新 Deployment 來更改該信息；
[模塊 5](/zh-cn/docs/tutorials/kubernetes-basics/scale/scale-intro/)
和[模塊 6](/zh-cn/docs/tutorials/kubernetes-basics/update/update-intro/)
討論瞭如何擴展和更新 Deployment。

<!--
For your first Deployment, you'll use a hello-node application packaged in a Docker
container that uses NGINX to echo back all the requests. (If you didn't already try
creating a hello-node application and deploying it using a container, you can do
that first by following the instructions from the [Hello Minikube tutorial](/docs/tutorials/hello-minikube/).)
-->
對於你第一次部署，你將使用打包在 Docker 容器中的 hello-node 應用，該應用使用 NGINX 回顯所有請求。
（如果你尚未嘗試創建 hello-node 應用並使用容器進行部署，則可以首先按照
[Hello Minikube 教程](/zh-cn/docs/tutorials/hello-minikube/)中的說明進行操作）。

<!--
You will need to have installed kubectl as well. If you need to install it, visit
[install tools](/docs/tasks/tools/#kubectl).

Now that you know what Deployments are, let's deploy our first app!
-->
你也需要安裝好 kubectl。如果你需要安裝 kubectl，
參閱[安裝工具](/zh-cn/docs/tasks/tools/#kubectl)。

現在你已經瞭解了部署的內容，讓我們部署第一個應用！

<!--
### kubectl basics

The common format of a kubectl command is: `kubectl action resource`.

This performs the specified _action_ (like `create`, `describe` or `delete`) on the
specified _resource_ (like `node` or `deployment`. You can use `--help` after the
subcommand to get additional info about possible parameters (for example: `kubectl get nodes --help`).
-->
### kubectl 基礎知識

kubectl 命令的常見格式是：`kubectl action resource`。

這會對指定的**資源**（類似 `node` 或 `deployment`）執行指定的**操作**（類似
`create`、`describe` 或 `delete`）。
你可以在子命令之後使用 `--help` 獲取可能參數相關的更多信息
（例如：`kubectl get nodes --help`）。

<!--
Check that kubectl is configured to talk to your cluster, by running the `kubectl version` command.

Check that kubectl is installed and that you can see both the client and the server versions.

To view the nodes in the cluster, run the `kubectl get nodes` command.

You see the available nodes. Later, Kubernetes will choose where to deploy our
application based on Node available resources.
-->
通過運行 `kubectl version` 命令，查看 kubectl 是否被設定爲與你的叢集通信。

查驗 kubectl 是否已安裝，你能同時看到客戶端和伺服器版本。

要查看叢集中的節點，運行 `kubectl get nodes` 命令。

你可以看到可用的節點。稍後 Kubernetes 將根據節點可用的資源選擇在哪裏部署應用。

<!--
### Deploy an app

Let’s deploy our first app on Kubernetes with the `kubectl create deployment` command.
We need to provide the deployment name and app image location (include the full
repository url for images hosted outside Docker Hub).
-->
### 部署一個應用

讓我們使用 `kubectl create deployment` 命令在 Kubernetes 上部署第一個應用。
我們需要提供 Deployment 命令以及應用映像檔位置（包括託管在 Docker Hub
之外的映像檔的完整倉庫地址）。

```shell
kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1
```

<!--
Great! You just deployed your first application by creating a deployment. This performed a few things for you:

* searched for a suitable node where an instance of the application could be run (we have only 1 available node)
* scheduled the application to run on that Node
* configured the cluster to reschedule the instance on a new Node when needed

To list your deployments use the `kubectl get deployments` command:
-->
很好！你剛剛通過創建 Deployment 部署了第一個應用。這個過程中執行了以下一些操作：

* 搜索應用實例可以運行的合適節點（我們只有一個可用的節點）
* 調度應用在此節點上運行
* 設定叢集在需要時將實例重新調度到新的節點上

要列出你的 Deployment，使用 `kubectl get deployments` 命令：

```shell
kubectl get deployments
```

<!--
We see that there is 1 deployment running a single instance of your app. The instance
is running inside a container on your node.
-->
我們看到有 1 個 Deployment 運行應用的單個實例。這個實例運行在節點上的一個容器內。

<!--
### View the app

[Pods](/docs/concepts/workloads/pods/) that are running inside Kubernetes are running
on a private, isolated network. By default they are visible from other pods and services
within the same Kubernetes cluster, but not outside that network. When we use `kubectl`,
we're interacting through an API endpoint to communicate with our application.

We will cover other options on how to expose your application outside the Kubernetes
cluster later, in [Module 4](/docs/tutorials/kubernetes-basics/expose/).
Also as a basic tutorial, we're not explaining what `Pods` are in any
detail here, it will be covered in later topics.
-->
### 查看應用

在 Kubernetes 內運行的 [Pod](/zh-cn/docs/concepts/workloads/pods/) 
運行在一個私有的、隔離的網路上。
默認這些 Pod 可以從同一 Kubernetes 叢集內的其他 Pod 和服務看到，但超出這個網路後則看不到。
當我們使用 `kubectl` 時，我們通過 API 端點交互與應用進行通信。

<!--
The `kubectl proxy` command can create a proxy that will forward communications
into the cluster-wide, private network. The proxy can be terminated by pressing
control-C and won't show any output while it's running.

**You need to open a second terminal window to run the proxy.**
-->
`kubectl proxy` 命令可以創建一個代理，將通信轉發到叢集範圍的私有網路。
按下 Ctrl-C 此代理可以被終止，且在此代理運行期間不會顯示任何輸出。

**你需要打開第二個終端窗口來運行此代理。**

```shell
kubectl proxy
```

<!--
We now have a connection between our host (the terminal) and the Kubernetes cluster.
The proxy enables direct access to the API from these terminals.

You can see all those APIs hosted through the proxy endpoint. For example, we can
query the version directly through the API using the `curl` command:
-->
現在我們在主機（終端）和 Kubernetes 叢集之間有一個連接。此代理能夠從這些終端直接訪問 API。

你可以看到通過代理端點託管的所有 API。
例如，我們可以使用以下 `curl` 命令直接通過 API 查詢版本：

```shell
curl http://localhost:8001/version
```

{{< note >}}
<!--
If port 8001 is not accessible, ensure that the `kubectl proxy` that you started
above is running in the second terminal.
-->
如果 Port 8001 不可訪問，確保你上述啓動的 `kubectl proxy` 運行在第二個終端中。
{{< /note >}}

<!--
The API server will automatically create an endpoint for each pod, based on the
pod name, that is also accessible through the proxy.

First we need to get the Pod name, and we'll store it in the environment variable `POD_NAME`.
-->
API 伺服器將基於也能通過代理訪問的 Pod 名稱爲每個 Pod 自動創建端點。

首先我們需要獲取 Pod 名稱，我們將存儲到環境變量 `POD_NAME` 中：

```shell
export POD_NAME=$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')
echo Name of the Pod: $POD_NAME
```

<!--
You can access the Pod through the proxied API, by running:
-->
你可以運行以下命令通過代理的 API 訪問 Pod：

```shell
curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME:8080/proxy/
```

<!--
In order for the new Deployment to be accessible without using the proxy, a Service
is required which will be explained in [Module 4](/docs/tutorials/kubernetes-basics/expose/).
-->
爲了不使用代理也能訪問新的 Deployment，需要一個 Service，
這將在下一個[模塊 4](/zh-cn/docs/tutorials/kubernetes-basics/expose/)
中講述。

## {{% heading "whatsnext" %}}

<!--
* Tutorial [Viewing Pods and Nodes](/docs/tutorials/kubernetes-basics/explore/explore-intro/).
* Learn more about [Deployments](/docs/concepts/workloads/controllers/deployment/).
-->
* [查看 Pod 和節點](/zh-cn/docs/tutorials/kubernetes-basics/explore/explore-intro/)教程。
* 瞭解更多關於 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/) 的信息。
