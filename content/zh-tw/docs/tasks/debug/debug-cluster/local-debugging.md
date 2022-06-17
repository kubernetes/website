---
title: 使用 telepresence 在本地開發和除錯服務
content_type: task
---

<!--
title: Developing and debugging services locally using telepresence
content_type: task
-->

<!-- overview -->

{{% thirdparty-content %}}

<!--
Kubernetes applications usually consist of multiple, separate services, each running in its own container. Developing and debugging these services on a remote Kubernetes cluster can be cumbersome, requiring you to [get a shell on a running container](/docs/tasks/debug/debug-application/get-shell-running-container/) in order to run debugging tools.
-->

Kubernetes 應用程式通常由多個獨立的服務組成，每個服務都在自己的容器中執行。
在遠端的 Kubernetes 叢集上開發和除錯這些服務可能很麻煩，
需要[在執行的容器上開啟 Shell](/zh-cn/docs/tasks/debug/debug-application/get-shell-running-container/)，
以執行除錯工具。

<!--
`telepresence` is a tool to ease the process of developing and debugging services locally while proxying the service to a remote Kubernetes cluster. Using `telepresence` allows you to use custom tools, such as a debugger and IDE, for a local service and provides the service full access to ConfigMap, secrets, and the services running on the remote cluster.
-->

`telepresence` 是一個工具，用於簡化本地開發和除錯服務的過程，同時可以將服務代理到遠端 Kubernetes 叢集。
`telepresence` 允許你使用使用自定義工具（例如：偵錯程式 和 IDE）除錯服務，
並提供對 Configmap、Secret 和遠端叢集上執行的服務的完全訪問。


<!--
This document describes using `telepresence` to develop and debug services running on a remote cluster locally.
-->
本文件描述如何在本地使用 `telepresence` 開發和除錯遠端叢集上執行的服務。

## {{% heading "prerequisites" %}}

<!--
* Kubernetes cluster is installed
* `kubectl` is configured to communicate with the cluster
* [Telepresence](https://www.telepresence.io/docs/latest/install/) is installed
-->

* Kubernetes 叢集安裝完畢
* 配置好 `kubectl` 與叢集互動
* [Telepresence](https://www.telepresence.io/docs/latest/install/) 安裝完畢

<!-- steps -->

<!--
## Connecting your local machine to a remote Kubernetes cluster
 
After installing `telepresence`, run `telepresence connect` to launch its Daemon and connect your local workstation to the cluster.
-->

## 從本機連線到遠端 Kubernetes 叢集

安裝 `telepresence` 後，執行 `telepresence connect` 來啟動它的守護程序並將本地工作站連線到遠端 Kubernetes 叢集。

```
$ telepresence connect
 
Launching Telepresence Daemon
...
Connected to context default (https://<cluster public IP>)
```

<!--
You can curl services using the Kubernetes syntax e.g. `curl -ik https://kubernetes.default`
-->

你可以透過 curl 使用 Kubernetes 語法訪問服務，例如：`curl -ik https://kubernetes.default`

<!--
## Developing or debugging an existing service

When developing an application on Kubernetes, you typically program or debug a single service. The service might require access to other services for testing and debugging. One option is to use the continuous deployment pipeline, but even the fastest deployment pipeline introduces a delay in the program or debug cycle.
-->
## 開發和除錯現有的服務

在 Kubernetes 上開發應用程式時，通常對單個服務進行程式設計或除錯。
服務可能需要訪問其他服務以進行測試和除錯。
一種選擇是使用連續部署流水線，但即使最快的部署流水線也會在程式或調試周期中引入延遲。

<!--
Use the `telepresence intercept $SERVICE_NAME --port $LOCAL_PORT:REMOTE_PORT` command to create an "intercept" for rerouting remote service traffic.

Where:

-   `$SERVICE_NAME`  is the name of your local service
-   `$LOCAL_PORT` is the port that your service is running on your local workstation
-   And `$REMOTE_PORT` is the port your service listens to in the cluster
-->

使用 `telepresence intercept $SERVICE_NAME --port $LOCAL_PORT:REMOTE_PORT` 命令建立一個 "攔截器" 用於重新路由遠端服務流量。

環境變數：

- `$SERVICE_NAME` 是本地服務名稱
- `$LOCAL_PORT` 是服務在本地工作站上執行的埠
- `$REMOTE_PORT` 是服務在叢集中偵聽的埠

<!--
Running this command tells Telepresence to send remote traffic to your local service instead of the service in the remote Kubernetes cluster. Make edits to your service source code locally, save, and see the corresponding changes when accessing your remote application take effect immediately. You can also run your local service using a debugger or any other local development tool.
-->

執行此命令會告訴 Telepresence 將遠端流量傳送到的本地服務，而不是遠端 Kubernetes 叢集中的服務中。
在本地編輯儲存服務原始碼，並在訪問遠端應用時檢視相應變更會立即生效。
還可以使用偵錯程式或任何其他本地開發工具執行本地服務。

<!--
## How does Telepresence work?

Telepresence installs a traffic-agent sidecar next to your existing application's container running in the remote cluster. It then captures all traffic requests going into the Pod, and instead of forwarding this to the application in the remote cluster, it routes all traffic (when you create a [global intercept](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#global-intercept)) or a subset of the traffic (when you create a [personal intercept](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#personal-intercept)) to your local development environment.
-->

## Telepresence 是如何工作的？

Telepresence 會在遠端叢集中執行的現有應用程式容器旁邊安裝流量代理 sidecar。
當它捕獲進入 Pod 的所有流量請求時，不是將其轉發到遠端叢集中的應用程式，
而是路由所有流量（當建立[全域性攔截器](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#global-intercept)時）
或流量的一個子集（當建立[自定義攔截器](https://www.getambassador.io/docs/telepresence/latest/concepts/intercepts/#personal-intercept)時）
到本地開發環境。

## {{% heading "whatsnext" %}}

<!--
If you're interested in a hands-on tutorial, check out [this tutorial](https://cloud.google.com/community/tutorials/developing-services-with-k8s) that walks through locally developing the Guestbook application on Google Kubernetes Engine.
-->
如果你對實踐教程感興趣，請檢視[本教程](https://cloud.google.com/community/tutorials/developing-services-with-k8s)，其中介紹了在 Google Kubernetes Engine 上本地開發 Guestbook 應用程式。

<!--
For further reading, visit the [Telepresence website](https://www.telepresence.io).
-->

如需進一步瞭解，請訪問 [Telepresence 官方網站](https://www.telepresence.io)。
