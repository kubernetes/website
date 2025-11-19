---
title: 使用 telepresence 在本地開發和調試服務
content_type: task
---
<!--
title: Developing and debugging services locally using telepresence
content_type: task
-->

<!-- overview -->

{{% thirdparty-content %}}

<!--
Kubernetes applications usually consist of multiple, separate services,
each running in its own container. Developing and debugging these services
on a remote Kubernetes cluster can be cumbersome, requiring you to
[get a shell on a running container](/docs/tasks/debug/debug-application/get-shell-running-container/)
in order to run debugging tools.
-->
Kubernetes 應用程序通常由多個獨立的服務組成，每個服務都在自己的容器中運行。
在遠端的 Kubernetes 叢集上開發和調試這些服務可能很麻煩，
需要[在運行的容器上打開 Shell](/zh-cn/docs/tasks/debug/debug-application/get-shell-running-container/)，
以運行調試工具。

<!--
`telepresence` is a tool to ease the process of developing and debugging
services locally while proxying the service to a remote Kubernetes cluster.
Using `telepresence` allows you to use custom tools, such as a debugger and
IDE, for a local service and provides the service full access to ConfigMap,
secrets, and the services running on the remote cluster.
-->
`telepresence` 是一個工具，用於簡化本地開發和調試服務的過程，同時可以將服務代理到遠程 Kubernetes 叢集。
`telepresence` 允許你使用自定義工具（例如調試器和 IDE）調試本地服務，
並能夠讓此服務完全訪問 ConfigMap、Secret 和遠程叢集上運行的服務。

<!--
This document describes using `telepresence` to develop and debug services
running on a remote cluster locally.
-->
本文檔描述如何在本地使用 `telepresence` 開發和調試遠程叢集上運行的服務。

## {{% heading "prerequisites" %}}

<!--
* Kubernetes cluster is installed
* `kubectl` is configured to communicate with the cluster
* [Telepresence](https://www.telepresence.io/docs/latest/quick-start/) is installed
-->
* Kubernetes 叢集安裝完畢
* 設定好 `kubectl` 與叢集交互
* [Telepresence](https://www.telepresence.io/docs/latest/quick-start/) 安裝完畢

<!-- steps -->

<!--
## Connecting your local machine to a remote Kubernetes cluster
 
After installing `telepresence`, run `telepresence connect` to launch
its Daemon and connect your local workstation to the cluster.
-->
## 從本機連接到遠程 Kubernetes 叢集  {#connecting-your-local-machine-to-a-remote-cluster}

安裝 `telepresence` 後，運行 `telepresence connect` 來啓動它的守護進程並將本地工作站連接到遠程
Kubernetes 叢集。

```
$ telepresence connect
 
Launching Telepresence Daemon
...
Connected to context default (https://<cluster public IP>)
```

<!--
You can curl services using the Kubernetes syntax e.g. `curl -ik https://kubernetes.default`
-->
你可以通過 curl 使用 Kubernetes 語法訪問服務，例如：`curl -ik https://kubernetes.default`

<!--
## Developing or debugging an existing service

When developing an application on Kubernetes, you typically program
or debug a single service. The service might require access to other
services for testing and debugging. One option is to use the continuous
deployment pipeline, but even the fastest deployment pipeline introduces
a delay in the program or debug cycle.
-->
## 開發和調試現有的服務  {#developing-or-debugging-an-existing-service}

在 Kubernetes 上開發應用程序時，通常對單個服務進行編程或調試。
服務可能需要訪問其他服務以進行測試和調試。
一種選擇是使用連續部署流水線，但即使最快的部署流水線也會在程序或調試周期中引入延遲。

<!--
Use the `telepresence intercept $SERVICE_NAME --port $LOCAL_PORT:$REMOTE_PORT`
command to create an "intercept" for rerouting remote service traffic.

Where:

-   `$SERVICE_NAME`  is the name of your local service
-   `$LOCAL_PORT` is the port that your service is running on your local workstation
-   And `$REMOTE_PORT` is the port your service listens to in the cluster
-->
使用 `telepresence intercept $SERVICE_NAME --port $LOCAL_PORT:$REMOTE_PORT`
命令創建一個 "攔截器" 用於重新路由遠程服務流量。

環境變量：

- `$SERVICE_NAME` 是本地服務名稱
- `$LOCAL_PORT` 是服務在本地工作站上運行的端口
- `$REMOTE_PORT` 是服務在叢集中偵聽的端口

<!--
Running this command tells Telepresence to send remote traffic to your
local service instead of the service in the remote Kubernetes cluster.
Make edits to your service source code locally, save, and see the corresponding
changes when accessing your remote application take effect immediately.
You can also run your local service using a debugger or any other local development tool.
-->
運行此命令會告訴 Telepresence 將遠程流量發送到本地服務，而不是遠程 Kubernetes 叢集中的服務中。
在本地編輯保存服務源代碼，並在訪問遠程應用時查看相應變更會立即生效。
還可以使用調試器或任何其他本地開發工具運行本地服務。

<!--
## How does Telepresence work?

Telepresence installs a traffic-agent sidecar next to your existing
application's container running in the remote cluster. It then captures
all traffic requests going into the Pod, and instead of forwarding this
to the application in the remote cluster, it routes all traffic (when you
create a [global intercept](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#global-intercept)
or a subset of the traffic (when you create a
[personal intercept](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#personal-intercept))
to your local development environment.
-->
## Telepresence 是如何工作的？  {#how-does-telepresence-work}

Telepresence 會在遠程叢集中運行的現有應用程序容器旁邊安裝流量代理 Sidecar。
當它捕獲進入 Pod 的所有流量請求時，不是將其轉發到遠程叢集中的應用程序，
而是路由所有流量（當創建[全局攔截器](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#global-intercept)時）
或流量的一個子集（當創建[自定義攔截器](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#personal-intercept)時）
到本地開發環境。

## {{% heading "whatsnext" %}}

<!--
If you're interested in a hands-on tutorial, check out
[this tutorial](https://cloud.google.com/community/tutorials/developing-services-with-k8s)
that walks through locally developing the Guestbook application on Google Kubernetes Engine.
-->
如果你對實踐教程感興趣，
請查看[本教程](https://cloud.google.com/community/tutorials/developing-services-with-k8s)，
其中介紹瞭如何在 Google Kubernetes Engine 上本地開發 Guestbook 應用程序。

<!--
For further reading, visit the [Telepresence website](https://www.telepresence.io).
-->
如需進一步瞭解，請訪問 [Telepresence 官方網站](https://www.telepresence.io)。
