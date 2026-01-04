---
title: 執行滾動更新
weight: 10
---
<!--
title: Performing a Rolling Update
weight: 10
-->

## {{% heading "objectives" %}}

<!--
Perform a rolling update using kubectl.
-->
使用 kubectl 執行滾動更新。

<!--
## Updating an application
-->
## 更新應用

{{% alert %}}
<!--
_Rolling updates allow Deployments' update to take place with zero downtime by
incrementally updating Pods instances with new ones._
-->
**滾動更新通過增量式更新 Pod 實例並替換爲新的實例，允許在
Deployment 更新過程中實現零停機。**
{{% /alert %}}

<!--
Users expect applications to be available all the time, and developers are expected
to deploy new versions of them several times a day. In Kubernetes this is done with
rolling updates. A **rolling update** allows a Deployment update to take place with
zero downtime. It does this by incrementally replacing the current Pods with new ones.
The new Pods are scheduled on Nodes with available resources, and Kubernetes waits
for those new Pods to start before removing the old Pods.
-->
使用者希望應用程式始終可用，而開發人員則需要每天多次部署它們的新版本。
在 Kubernetes 中，這些是通過滾動更新（Rolling Update）完成的。 
**滾動更新**允許通過使用新的實例逐步更新 Pod 實例，實現零停機的 Deployment 更新。
新的 Pod 將被調度到具有可用資源的節點上。

<!--
In the previous module we scaled our application to run multiple instances. This
is a requirement for performing updates without affecting application availability.
By default, the maximum number of Pods that can be unavailable during the update
and the maximum number of new Pods that can be created, is one. Both options can
be configured to either numbers or percentages (of Pods). In Kubernetes, updates are
versioned and any Deployment update can be reverted to a previous (stable) version.
-->
在前面的模塊中，我們將擴大應用的規模以運行多個實例。這是在對不影響應用程式可用性的情況下執行更新的要求。
預設情況下，更新期間不可用的 Pod 的個數上限和可以創建的新 Pod 個數上限都是 1。
這兩個選項都可以設定爲（Pod）數字或百分比。
在 Kubernetes 中，更新是具有版本控制的，任何 Deployment 更新都可以恢復到以前的（穩定）版本。

<!--
## Rolling updates overview
-->
## 滾動更新概述

{{< tutorials/carousel id="myCarousel" interval="3000" >}}
  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates1.svg"
      active="true" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates2.svg" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates3.svg" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates4.svg" >}}
{{< /tutorials/carousel >}}

{{% alert %}}
<!--
_If a Deployment is exposed publicly, the Service will load-balance the traffic
only to available Pods during the update._
-->
**如果 Deployment 的訪問是公開的，Service
在更新期間僅將流量負載均衡到可用的 Pod。**
{{% /alert %}}

<!--
Similar to application Scaling, if a Deployment is exposed publicly, the Service
will load-balance the traffic only to available Pods during the update. An available
Pod is an instance that is available to the users of the application.

Rolling updates allow the following actions:
-->
與應用程式規模擴縮類似，如果 Deployment 的訪問是公開的，Service
在更新期間僅將流量負載均衡到可用的 Pod。可用的 Pod 是指對應用的使用者可用的實例。

滾動更新允許以下操作：

<!--
* Promote an application from one environment to another (via container image updates)
* Rollback to previous versions
* Continuous Integration and Continuous Delivery of applications with zero downtime

In the following interactive tutorial, we'll update our application to a new version,
and also perform a rollback.
-->
* 將應用程式從一個環境升級到另一個環境（通過容器映像檔更新）
* 回滾到以前的版本
* 持續集成和持續交付應用程式，無需停機

在以下交互式教程中，我們將更新我們的應用程式到新版本，並執行回滾。

<!--
### Update the version of the app

To list your Deployments, run the `get deployments` subcommand:
-->
### 更新應用的版本

要列出你的 Deployment，可以運行 `get deployments` 子命令：

```shell
kubectl get deployments
```

<!--
To list the running Pods, run the `get pods` subcommand:
-->
要列出正在運行的 Pod，可以運行 `get pods` 子命令：

```shell
kubectl get pods
```

<!--
To view the current image version of the app, run the `describe pods` subcommand
and look for the `Image` field:
-->
要查看應用程式當前的映像檔版本，可以運行 `describe pods` 子命令，
然後查找 `Image` 字段：

```shell
kubectl describe pods
```

<!--
To update the image of the application to version 2, use the `set image` subcommand,
followed by the deployment name and the new image version:
-->
要將應用程式的映像檔版本更新爲 v2，可以使用 `set image` 子命令，
後面跟着 Deployment 名稱和新版本的映像檔：

```shell
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=docker.io/jocatalin/kubernetes-bootcamp:v2
```

<!--
The command notified the Deployment to use a different image for your app and initiated
a rolling update. Check the status of the new Pods, and view the old one terminating
with the `get pods` subcommand:
-->
此命令通知 Deployment 爲應用程式使用不同的映像檔，並啓動滾動更新。
要檢查新 Pod 的狀態，並查看舊 Pod 的終止狀況，可以使用 `get pods` 子命令：

```shell
kubectl get pods
```

<!--
### Verify an update

First, check that the service is running, as you might have deleted it in previous
tutorial step, run `describe services/kubernetes-bootcamp`. If it's missing,
you can create it again with:
-->
### 驗證更新

首先，檢查 Service 是否正在運行，因爲你可能在上一個教程步驟中刪除了它。
運行 `describe services/kubernetes-bootcamp`，如果 Service 缺失，
你可以使用以下命令重新創建：

```shell
kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080
```

<!--
Create an environment variable called `NODE_PORT` that has the value of the Node
port assigned:
-->
創建名爲 `NODE_PORT` 的環境變量，值爲已被分配的 Node 端口：

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo "NODE_PORT=$NODE_PORT"
```

<!--
Next, do a `curl` to the exposed IP and port:
-->
接下來，針對所暴露的 IP 和端口執行 `curl`：

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

<!--
Every time you run the `curl` command, you will hit a different Pod. Notice that
all Pods are now running the latest version (`v2`).

You can also confirm the update by running the `rollout status` subcommand:
-->
你每次執行 `curl` 命令，都會命中不同的 Pod。注意現在所有的
Pod 都運行着最新版本（`v2`）。

你也可以通過運行 `rollout status` 子命令來確認此次更新：

```shell
kubectl rollout status deployments/kubernetes-bootcamp
```

<!--
To view the current image version of the app, run the describe pods subcommand:
-->
要查看應用程式當前的版本，請運行 `describe pods` 子命令：

```shell
kubectl describe pods
```

<!--
In the `Image` field of the output, verify that you are running the latest image
version (`v2`).
-->
在輸出中，驗證應用程式正在運行最新版本的映像檔（`v2`）。

<!--
### Roll back an update

Let’s perform another update, and try to deploy an image tagged with `v10`:
-->
### 回滾更新

讓我們執行另一次更新，並嘗試部署一個標記爲 `v10` 的映像檔：

```shell
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=gcr.io/google-samples/kubernetes-bootcamp:v10
```

<!--
Use `get deployments` to see the status of the deployment:
-->
使用 `get deployments` 查看 Deployment 的狀態：

```shell
kubectl get deployments
```

<!--
Notice that the output doesn't list the desired number of available Pods. Run the
`get pods` subcommand to list all Pods:
-->
注意輸出中不會列出期望的可用 Pod 數。運行 `get pods` 子命令來列出所有 Pod：

```shell
kubectl get pods
```

<!--
Notice that some of the Pods have a status of `ImagePullBackOff`.

To get more insight into the problem, run the `describe pods` subcommand:
-->
注意輸出中，某些 Pod 的狀態爲 `ImagePullBackOff`。

要獲取關於這一問題的更多資訊，可以運行 `describe pods` 子命令：

```shell
kubectl describe pods
```

<!--
In the `Events` section of the output for the affected Pods, notice that the `v10`
image version did not exist in the repository.

To roll back the deployment to your last working version, use the `rollout undo`
subcommand:
-->
在受影響的 Pod 的輸出中，注意其 `Events` 部分包含 `v10` 版本的映像檔在倉庫中不存在的資訊。

要回滾 Deployment 到你上一次工作版本的更新，可以運行 `rollout undo` 子命令：

```shell
kubectl rollout undo deployments/kubernetes-bootcamp
```

<!--
The `rollout undo` command reverts the deployment to the previous known state
(`v2` of the image). Updates are versioned and you can revert to any previously
known state of a Deployment.

Use the `get pods` subcommand to list the Pods again:
-->
`rollout undo` 命令會恢復 Deployment 到先前的已知狀態（`v2` 的映像檔）。
更新是有版本控制的，你可以恢復 Deployment 到任何先前已知狀態。

使用 `get pods` 子命令再次列出 Pod：

```shell
kubectl get pods
```

<!--
To check the image deployed on the running Pods, use the `describe pods` subcommand:
-->
要檢查正在運行的 Pod 上部署的映像檔，請使用 `describe pods` 子命令：

```shell
kubectl describe pods
```

<!--
The Deployment is once again using a stable version of the app (`v2`). The rollback
was successful.

Remember to clean up your local cluster.
-->
Deployment 正在使用穩定的應用程式版本（`v2`）。回滾操作已成功完成。

記得清理本地叢集：

```shell
kubectl delete deployments/kubernetes-bootcamp services/kubernetes-bootcamp
```

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Deployments](/docs/concepts/workloads/controllers/deployment/).
-->
* 詳細瞭解 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)。
