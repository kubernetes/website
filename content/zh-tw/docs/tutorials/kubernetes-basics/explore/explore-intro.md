---
title: 查看 Pod 和節點
weight: 10
---
<!--
title: Viewing Pods and Nodes
weight: 10
-->

## {{% heading "objectives" %}}

<!--
* Learn about Kubernetes Pods.
* Learn about Kubernetes Nodes.
* Troubleshoot deployed applications.
-->
* 瞭解 Kubernetes Pod。
* 瞭解 Kubernetes 節點。
* 對已部署的應用進行故障排查。

<!--
## Kubernetes Pods
-->
## Kubernetes Pod

{{% alert %}}
<!--
_A Pod is a group of one or more application containers (such as Docker) and includes
shared storage (volumes), IP address and information about how to run them._
-->
**Pod 是一個或多個應用容器（例如 Docker）的組合，並且包含共享的存儲（卷）、IP
地址和有關如何運行它們的信息。**
{{% /alert %}}

<!--
When you created a Deployment in [Module 2](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/),
Kubernetes created a **Pod** to host your application instance. A Pod is a Kubernetes
abstraction that represents a group of one or more application containers (such as Docker),
and some shared resources for those containers. Those resources include:

* Shared storage, as Volumes
* Networking, as a unique cluster IP address
* Information about how to run each container, such as the container image version
or specific ports to use
-->
在[模塊 2](/zh-cn/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)
中創建 Deployment 時，Kubernetes 創建了一個 **Pod** 來託管你的應用實例。
Pod 是 Kubernetes 抽象出來的，表示一組一個或多個應用容器（如 Docker），
以及這些容器的一些共享資源。這些資源包括：

* 卷形式的共享存儲
* 叢集內唯一的 IP 地址，用於聯網
* 有關每個容器如何運行的信息，例如容器映像檔版本或要使用的特定端口

<!--
A Pod models an application-specific "logical host" and can contain different application
containers which are relatively tightly coupled. For example, a Pod might include
both the container with your Node.js app as well as a different container that feeds
the data to be published by the Node.js webserver. The containers in a Pod share an
IP Address and port space, are always co-located and co-scheduled, and run in a shared
context on the same Node.
-->
Pod 爲特定於應用的“邏輯主機”建模，並且可以包含相對緊耦合的不同應用容器。
例如，Pod 可能既包含帶有 Node.js 應用的容器，也包含另一個不同的容器，
用於提供 Node.js 網路伺服器要發佈的數據。Pod 中的容器共享 IP 地址和端口，
始終位於同一位置並且共同調度，並在同一節點上的共享上下文中運行。

<!--
Pods are the atomic unit on the Kubernetes platform. When we create a Deployment
on Kubernetes, that Deployment creates Pods with containers inside them (as opposed
to creating containers directly). Each Pod is tied to the Node where it is scheduled,
and remains there until termination (according to restart policy) or deletion. In
case of a Node failure, identical Pods are scheduled on other available Nodes in
the cluster.
-->
Pod 是 Kubernetes 平臺上的原子單元。當我們在 Kubernetes 上創建 Deployment 時，
該 Deployment 會創建其中包含容器的 Pod（而不是直接創建容器）。
每個 Pod 都與被調度所在的節點綁定，並保持在那裏直到（根據重啓策略）終止或刪除。
如果節點發生故障，則相同的 Pod 會被調度到叢集中的其他可用節點上。

<!--
### Pods overview
-->
### Pod 概述

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_03_pods.svg" class="diagram-medium" >}}

{{% alert %}}
<!--
_Containers should only be scheduled together in a single Pod if they are tightly
coupled and need to share resources such as disk._
-->
**只有容器緊耦合並且需要共享磁盤等資源時，才應將其編排在一個 Pod 中。**
{{% /alert %}}

<!--
## Nodes

A Pod always runs on a **Node**. A Node is a worker machine in Kubernetes and may
be either a virtual or a physical machine, depending on the cluster. Each Node is
managed by the control plane. A Node can have multiple pods, and the Kubernetes
control plane automatically handles scheduling the pods across the Nodes in the
cluster. The control plane's automatic scheduling takes into account the available
resources on each Node.
-->
## 節點

一個 Pod 總是運行在某個 **Node（節點）** 上。節點是 Kubernetes 中工作機器，
可以是虛擬機或物理計算機，具體取決於叢集。每個 Node 都由控制面管理。
節點可以有多個 Pod，Kubernetes 控制面會自動處理在叢集中的節點上調度 Pod。
控制面的自動調度考量了每個節點上的可用資源。

<!--
Every Kubernetes Node runs at least:

* Kubelet, a process responsible for communication between the Kubernetes control
plane and the Node; it manages the Pods and the containers running on a machine.

* A container runtime (like Docker) responsible for pulling the container image
from a registry, unpacking the container, and running the application.
-->
每個 Kubernetes 節點至少運行：

* kubelet，負責 Kubernetes 控制面和節點之間通信的進程；它管理機器上運行的 Pod 和容器。

* 容器運行時（如 Docker）負責從映像檔倉庫中拉取容器映像檔、解壓縮容器以及運行應用。

<!--
### Nodes overview
-->
### 節點概述

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_03_nodes.svg" class="diagram-medium" >}}

<!--
## Troubleshooting with kubectl

In [Module 2](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/), you used
the kubectl command-line interface. You'll continue to use it in Module 3 to get
information about deployed applications and their environments. The most common
operations can be done with the following kubectl subcommands:
-->
## 使用 kubectl 進行故障排查

在[模塊 2](/zh-cn/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/) 中，
你使用了 kubectl 命令列界面。你將繼續在第 3 個模塊中使用 kubectl
來獲取有關已部署應用及其環境的信息。最常見的操作可以使用以下 kubectl
子命令完成：

<!--
* `kubectl get` - list resources
* `kubectl describe` - show detailed information about a resource
* `kubectl logs`  - print the logs from a container in a pod
* `kubectl exec` - execute a command on a container in a pod
-->
* `kubectl get` - 列出資源
* `kubectl describe` - 顯示有關資源的詳細信息
* `kubectl logs` - 打印 Pod 中容器的日誌
* `kubectl exec` - 在 Pod 中的容器上執行命令

<!--
You can use these commands to see when applications were deployed, what their current
statuses are, where they are running and what their configurations are.

Now that we know more about our cluster components and the command line, let's
explore our application.
-->
你可以使用這些命令查看應用的部署時間、當前狀態、運行位置以及設定。

現在我們瞭解了有關叢集組件和命令列的更多信息，讓我們來探索一下我們的應用。

<!--
### Check application configuration

Let's verify that the application we deployed in the previous scenario is running.
We'll use the `kubectl get` command and look for existing Pods:
-->
### 檢查應用設定

讓我們驗證之前場景中部署的應用是否在運行。我們將使用 `kubectl get`
命令查看現存的 Pod：

```shell
kubectl get pods
```

<!--
If no pods are running, please wait a couple of seconds and list the Pods again.
You can continue once you see one Pod running.

Next, to view what containers are inside that Pod and what images are used to build
those containers we run the `kubectl describe pods` command:
-->
如果沒有 Pod 在運行，請等幾秒，讓 Pod 再次列出。一旦看到一個 Pod 在運行，就可以繼續操作。
接下來，要查看 Pod 內有哪些容器以及使用了哪些映像檔來構建這些容器，我們運行
`kubectl describe pods` 命令：

```shell
kubectl describe pods
```

<!--
We see here details about the Pod’s container: IP address, the ports used and a
list of events related to the lifecycle of the Pod.

The output of the `describe` subcommand is extensive and covers some concepts that
we didn’t explain yet, but don’t worry, they will become familiar by the end of this tutorial.
-->
我們在這裏看到了 Pod 的容器相關詳情：IP 地址、所使用的端口以及 Pod
生命期有關的事件列表。

`describe` 子命令的輸出寬泛，涵蓋了一些我們還未講到的概念，但不用擔心，
這節課結束時你就會熟悉這些概念了。

{{< note >}}
<!--
The `describe` subcommand can be used to get detailed information about most of the
Kubernetes primitives, including Nodes, Pods, and Deployments. The describe output is
designed to be human readable, not to be scripted against.
-->
`describe` 子命令可用於獲取有關大多數 Kubernetes 原語的詳細信息，
包括 Node、Pod 和 Deployment。describe 的輸出設計爲人類可讀的信息，
而不是腳本化的信息。
{{< /note >}}

<!--
### Show the app in the terminal

Recall that Pods are running in an isolated, private network - so we need to proxy access
to them so we can debug and interact with them. To do this, we'll use the `kubectl proxy`
command to run a proxy in a **second terminal**. Open a new terminal window, and
in that new terminal, run:
-->
### 在終端中顯示應用

回想一下，Pod 運行在隔離的、私有的網路中 —— 因此我們需要代理訪問它們，這樣才能進行調試和交互。
爲了做到這一點，我們將使用 `kubectl proxy` 命令在**第二個終端**中運行一個代理。
打開一個新的終端窗口，在這個新的終端中運行以下命令：

```shell
kubectl proxy
```

<!--
Now again, we'll get the Pod name and query that pod directly through the proxy.
To get the Pod name and store it in the `POD_NAME` environment variable:
-->
現在我們再次獲取 Pod 名稱並直接通過代理查詢該 Pod。
要獲取 Pod 命令並將其存到 `POD_NAME` 環境變量中，
運行以下命令：

```shell
export POD_NAME="$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')"
echo Name of the Pod: $POD_NAME
```

<!--
To see the output of our application, run a `curl` request:
-->
要查看應用的輸出，執行一個 `curl` 請求：

```shell
curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME:8080/proxy/
```

<!--
The URL is the route to the API of the Pod.
-->
URL 是到 Pod API 的路由。

{{< note >}}
<!--
We don't need to specify the container name, because we only have one container inside the pod.
-->
我們不需要指定容器名稱，因爲在 Pod 內只有一個容器。
{{< /note >}}

<!--
### Executing commands on the container
-->
### 在容器上執行命令

<!--
We can execute commands directly on the container once the Pod is up and running.
For this, we use the `exec` subcommand and use the name of the Pod as a parameter.
Let’s list the environment variables:
-->
一旦 Pod 啓動並運行，我們就可以直接在容器上執行命令。
爲此，我們使用 `exec` 子命令，並將 Pod 的名稱作爲參數。
讓我們列出環境變量：

```shell
kubectl exec "$POD_NAME" -- env
```

<!--
Again, it's worth mentioning that the name of the container itself can be omitted
since we only have a single container in the Pod.

Next let’s start a bash session in the Pod’s container:
-->
另外值得一提的是，由於 Pod 中只有一個容器，所以容器本身的名稱可以被省略。

接下來，讓我們在 Pod 的容器中啓動一個 bash 會話：

```shell
kubectl exec -ti $POD_NAME -- bash
```

<!--
We have now an open console on the container where we run our NodeJS application.
The source code of the app is in the `server.js` file:
-->
現在我們有了一個在運行 Node.js 應用的容器上打開的控制檯。
該應用的源代碼位於 `server.js` 文件中：

```shell
cat server.js
```

<!--
You can check that the application is up by running a curl command:
-->
你可以通過運行 `curl` 命令查看應用是否啓動：

```shell
curl http://localhost:8080
```

{{< note >}}
<!--
Here we used `localhost` because we executed the command inside the NodeJS Pod.
If you cannot connect to `localhost:8080`, check to make sure you have run the
`kubectl exec` command and are launching the command from within the Pod.
-->
在這裏我們使用了 `localhost`，因爲我們在 NodeJS Pod 內執行了此命令。
如果你無法連接到 `localhost:8080`，請確保你已經運行了 `kubectl exec`
命令，並且是從 Pod 內啓動的該命令。
{{< /note >}}

<!--
To close your container connection, type `exit`.
-->
要關閉你的容器連接，鍵入 `exit`。

## {{% heading "whatsnext" %}}

<!--
* Tutorial
[Using A Service To Expose Your App](/docs/tutorials/kubernetes-basics/expose/expose-intro/).
* Learn more about [Pods](/docs/concepts/workloads/pods/).
* Learn more about [Nodes](/docs/concepts/architecture/nodes/).
-->
* [使用 Service 來公開你的應用](/zh-cn/docs/tutorials/kubernetes-basics/expose/expose-intro/)教程。
* 進一步瞭解 [Pod](/zh-cn/docs/concepts/workloads/pods/)。
* 進一步瞭解[節點](/zh-cn/docs/concepts/architecture/nodes/)的。
