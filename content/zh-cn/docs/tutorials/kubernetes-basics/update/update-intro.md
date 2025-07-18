---
title: 执行滚动更新
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
使用 kubectl 执行滚动更新。

<!--
## Updating an application
-->
## 更新应用

{{% alert %}}
<!--
_Rolling updates allow Deployments' update to take place with zero downtime by
incrementally updating Pods instances with new ones._
-->
**滚动更新通过增量式更新 Pod 实例并替换为新的实例，允许在
Deployment 更新过程中实现零停机。**
{{% /alert %}}

<!--
Users expect applications to be available all the time, and developers are expected
to deploy new versions of them several times a day. In Kubernetes this is done with
rolling updates. A **rolling update** allows a Deployment update to take place with
zero downtime. It does this by incrementally replacing the current Pods with new ones.
The new Pods are scheduled on Nodes with available resources, and Kubernetes waits
for those new Pods to start before removing the old Pods.
-->
用户希望应用程序始终可用，而开发人员则需要每天多次部署它们的新版本。
在 Kubernetes 中，这些是通过滚动更新（Rolling Update）完成的。 
**滚动更新**允许通过使用新的实例逐步更新 Pod 实例，实现零停机的 Deployment 更新。
新的 Pod 将被调度到具有可用资源的节点上。

<!--
In the previous module we scaled our application to run multiple instances. This
is a requirement for performing updates without affecting application availability.
By default, the maximum number of Pods that can be unavailable during the update
and the maximum number of new Pods that can be created, is one. Both options can
be configured to either numbers or percentages (of Pods). In Kubernetes, updates are
versioned and any Deployment update can be reverted to a previous (stable) version.
-->
在前面的模块中，我们将扩大应用的规模以运行多个实例。这是在对不影响应用程序可用性的情况下执行更新的要求。
默认情况下，更新期间不可用的 Pod 的个数上限和可以创建的新 Pod 个数上限都是 1。
这两个选项都可以配置为（Pod）数字或百分比。
在 Kubernetes 中，更新是具有版本控制的，任何 Deployment 更新都可以恢复到以前的（稳定）版本。

<!--
## Rolling updates overview
-->
## 滚动更新概述

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
**如果 Deployment 的访问是公开的，Service
在更新期间仅将流量负载均衡到可用的 Pod。**
{{% /alert %}}

<!--
Similar to application Scaling, if a Deployment is exposed publicly, the Service
will load-balance the traffic only to available Pods during the update. An available
Pod is an instance that is available to the users of the application.

Rolling updates allow the following actions:
-->
与应用程序规模扩缩类似，如果 Deployment 的访问是公开的，Service
在更新期间仅将流量负载均衡到可用的 Pod。可用的 Pod 是指对应用的用户可用的实例。

滚动更新允许以下操作：

<!--
* Promote an application from one environment to another (via container image updates)
* Rollback to previous versions
* Continuous Integration and Continuous Delivery of applications with zero downtime

In the following interactive tutorial, we'll update our application to a new version,
and also perform a rollback.
-->
* 将应用程序从一个环境升级到另一个环境（通过容器镜像更新）
* 回滚到以前的版本
* 持续集成和持续交付应用程序，无需停机

在以下交互式教程中，我们将更新我们的应用程序到新版本，并执行回滚。

<!--
### Update the version of the app

To list your Deployments, run the `get deployments` subcommand:
-->
### 更新应用的版本

要列出你的 Deployment，可以运行 `get deployments` 子命令：

```shell
kubectl get deployments
```

<!--
To list the running Pods, run the `get pods` subcommand:
-->
要列出正在运行的 Pod，可以运行 `get pods` 子命令：

```shell
kubectl get pods
```

<!--
To view the current image version of the app, run the `describe pods` subcommand
and look for the `Image` field:
-->
要查看应用程序当前的镜像版本，可以运行 `describe pods` 子命令，
然后查找 `Image` 字段：

```shell
kubectl describe pods
```

<!--
To update the image of the application to version 2, use the `set image` subcommand,
followed by the deployment name and the new image version:
-->
要将应用程序的镜像版本更新为 v2，可以使用 `set image` 子命令，
后面跟着 Deployment 名称和新版本的镜像：

```shell
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=docker.io/jocatalin/kubernetes-bootcamp:v2
```

<!--
The command notified the Deployment to use a different image for your app and initiated
a rolling update. Check the status of the new Pods, and view the old one terminating
with the `get pods` subcommand:
-->
此命令通知 Deployment 为应用程序使用不同的镜像，并启动滚动更新。
要检查新 Pod 的状态，并查看旧 Pod 的终止状况，可以使用 `get pods` 子命令：

```shell
kubectl get pods
```

<!--
### Verify an update

First, check that the service is running, as you might have deleted it in previous
tutorial step, run `describe services/kubernetes-bootcamp`. If it's missing,
you can create it again with:
-->
### 验证更新

首先，检查 Service 是否正在运行，因为你可能在上一个教程步骤中删除了它。
运行 `describe services/kubernetes-bootcamp`，如果 Service 缺失，
你可以使用以下命令重新创建：

```shell
kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080
```

<!--
Create an environment variable called `NODE_PORT` that has the value of the Node
port assigned:
-->
创建名为 `NODE_PORT` 的环境变量，值为已被分配的 Node 端口：

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo "NODE_PORT=$NODE_PORT"
```

<!--
Next, do a `curl` to the exposed IP and port:
-->
接下来，针对所暴露的 IP 和端口执行 `curl`：

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

<!--
Every time you run the `curl` command, you will hit a different Pod. Notice that
all Pods are now running the latest version (`v2`).

You can also confirm the update by running the `rollout status` subcommand:
-->
你每次执行 `curl` 命令，都会命中不同的 Pod。注意现在所有的
Pod 都运行着最新版本（`v2`）。

你也可以通过运行 `rollout status` 子命令来确认此次更新：

```shell
kubectl rollout status deployments/kubernetes-bootcamp
```

<!--
To view the current image version of the app, run the describe pods subcommand:
-->
要查看应用程序当前的版本，请运行 `describe pods` 子命令：

```shell
kubectl describe pods
```

<!--
In the `Image` field of the output, verify that you are running the latest image
version (`v2`).
-->
在输出中，验证应用程序正在运行最新版本的镜像（`v2`）。

<!--
### Roll back an update

Let’s perform another update, and try to deploy an image tagged with `v10`:
-->
### 回滚更新

让我们执行另一次更新，并尝试部署一个标记为 `v10` 的镜像：

```shell
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=gcr.io/google-samples/kubernetes-bootcamp:v10
```

<!--
Use `get deployments` to see the status of the deployment:
-->
使用 `get deployments` 查看 Deployment 的状态：

```shell
kubectl get deployments
```

<!--
Notice that the output doesn't list the desired number of available Pods. Run the
`get pods` subcommand to list all Pods:
-->
注意输出中不会列出期望的可用 Pod 数。运行 `get pods` 子命令来列出所有 Pod：

```shell
kubectl get pods
```

<!--
Notice that some of the Pods have a status of `ImagePullBackOff`.

To get more insight into the problem, run the `describe pods` subcommand:
-->
注意输出中，某些 Pod 的状态为 `ImagePullBackOff`。

要获取关于这一问题的更多信息，可以运行 `describe pods` 子命令：

```shell
kubectl describe pods
```

<!--
In the `Events` section of the output for the affected Pods, notice that the `v10`
image version did not exist in the repository.

To roll back the deployment to your last working version, use the `rollout undo`
subcommand:
-->
在受影响的 Pod 的输出中，注意其 `Events` 部分包含 `v10` 版本的镜像在仓库中不存在的信息。

要回滚 Deployment 到你上一次工作版本的更新，可以运行 `rollout undo` 子命令：

```shell
kubectl rollout undo deployments/kubernetes-bootcamp
```

<!--
The `rollout undo` command reverts the deployment to the previous known state
(`v2` of the image). Updates are versioned and you can revert to any previously
known state of a Deployment.

Use the `get pods` subcommand to list the Pods again:
-->
`rollout undo` 命令会恢复 Deployment 到先前的已知状态（`v2` 的镜像）。
更新是有版本控制的，你可以恢复 Deployment 到任何先前已知状态。

使用 `get pods` 子命令再次列出 Pod：

```shell
kubectl get pods
```

<!--
To check the image deployed on the running Pods, use the `describe pods` subcommand:
-->
要检查正在运行的 Pod 上部署的镜像，请使用 `describe pods` 子命令：

```shell
kubectl describe pods
```

<!--
The Deployment is once again using a stable version of the app (`v2`). The rollback
was successful.

Remember to clean up your local cluster.
-->
Deployment 正在使用稳定的应用程序版本（`v2`）。回滚操作已成功完成。

记得清理本地集群：

```shell
kubectl delete deployments/kubernetes-bootcamp services/kubernetes-bootcamp
```

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Deployments](/docs/concepts/workloads/controllers/deployment/).
-->
* 详细了解 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)。
