---
title: 通过 ConfigMap 更新配置
content_type: tutorial
weight: 20
---
<!--
title: Updating Configuration via a ConfigMap
content_type: tutorial
weight: 20
-->

<!-- overview -->
<!--
This page provides a step-by-step example of updating configuration within a Pod via a ConfigMap
and builds upon the [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) task.  
At the end of this tutorial, you will understand how to change the configuration for a running application.  
This tutorial uses the `alpine` and `nginx` images as examples.
-->
本页提供了通过 ConfigMap 更新 Pod 中配置信息的分步示例，
本教程的前置任务是[配置 Pod 以使用 ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)。  
在本教程结束时，你将了解如何变更运行中应用的配置。
本教程以 `alpine` 和 `nginx` 镜像为例。

## {{% heading "prerequisites" %}}
{{< include "task-tutorial-prereqs.md" >}}

<!--
You need to have the [curl](https://curl.se/) command-line tool for making HTTP requests from
the terminal or command prompt. If you do not have `curl` available, you can install it. Check the
documentation for your local operating system.
-->
你需要有 [curl](https://curl.se/) 命令行工具，用于从终端或命令行界面发出 HTTP 请求。
如果你没有 `curl`，可以安装此工具。请查阅你本地操作系统的文档。

## {{% heading "objectives" %}}

<!--
* Update configuration via a ConfigMap mounted as a Volume
* Update environment variables of a Pod via a ConfigMap
* Update configuration via a ConfigMap in a multi-container Pod
* Update configuration via a ConfigMap in a Pod possessing a Sidecar Container
-->
* 通过作为卷挂载的 ConfigMap 更新配置
* 通过 ConfigMap 更新 Pod 的环境变量
* 在多容器 Pod 中通过 ConfigMap 更新配置
* 在包含边车容器的 Pod 中通过 ConfigMap 更新配置

<!-- lessoncontent -->

<!--
## Update configuration via a ConfigMap mounted as a Volume {#rollout-configmap-volume}

Use the `kubectl create configmap` command to create a ConfigMap from
[literal values](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):
-->
## 通过作为卷挂载的 ConfigMap 更新配置   {#rollout-configmap-volume}

使用 `kubectl create configmap`
命令基于[字面值](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values)创建一个
ConfigMap：

```shell
kubectl create configmap sport --from-literal=sport=football
```

<!--
Below is an example of a Deployment manifest with the ConfigMap `sport` mounted as a
{{< glossary_tooltip text="volume" term_id="volume" >}} into the Pod's only container.
{{% code_sample file="deployments/deployment-with-configmap-as-volume.yaml" %}}

Create the Deployment:
-->
下面是一个 Deployment 清单示例，其中 ConfigMap `sport`
作为{{< glossary_tooltip text="卷" term_id="volume" >}}挂载到 Pod 的唯一容器中。

{{% code_sample file="deployments/deployment-with-configmap-as-volume.yaml" %}}

创建此 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-as-volume.yaml
```

<!--
Check the pods for this Deployment to ensure they are ready (matching by
{{< glossary_tooltip text="selector" term_id="selector" >}}):
-->
检查此 Deployment 的 Pod 以确保它们已就绪（通过{{< glossary_tooltip text="选择算符" term_id="selector" >}}进行匹配）：

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-volume
```

<!--
You should see an output similar to:
-->
你应该会看到类似以下的输出：

```
NAME                                READY   STATUS    RESTARTS   AGE
configmap-volume-6b976dfdcf-qxvbm   1/1     Running   0          72s
configmap-volume-6b976dfdcf-skpvm   1/1     Running   0          72s
configmap-volume-6b976dfdcf-tbc6r   1/1     Running   0          72s
```

<!--
On each node where one of these Pods is running, the kubelet fetches the data for
that ConfigMap and translates it to files in a local volume.
The kubelet then mounts that volume into the container, as specified in the Pod template.
The code running in that container loads the information from the file
and uses it to print a report to stdout.
You can check this report by viewing the logs for one of the Pods in that Deployment:
-->
在运行这些 Pod 之一的每个节点上，kubelet 获取该 ConfigMap 的数据，并将其转换为本地卷中的文件。
然后，kubelet 按照 Pod 模板中指定的方式将该卷挂载到容器中。
在该容器中运行的代码从文件中加载信息，并使用它将报告打印到标准输出。
你可以通过查看该 Deployment 中其中一个 Pod 的日志来检查此报告：

<!--
```shell
# Pick one Pod that belongs to the Deployment, and view its logs
kubectl logs deployments/configmap-volume
```

You should see an output similar to:
-->
```shell
# 选择一个属于该 Deployment 的 Pod，并查看其日志
kubectl logs deployments/configmap-volume
```

你应该会看到类似以下的输出：

```
Found 3 pods, using pod/configmap-volume-76d9c5678f-x5rgj
Thu Jan  4 14:06:46 UTC 2024 My preferred sport is football
Thu Jan  4 14:06:56 UTC 2024 My preferred sport is football
Thu Jan  4 14:07:06 UTC 2024 My preferred sport is football
Thu Jan  4 14:07:16 UTC 2024 My preferred sport is football
Thu Jan  4 14:07:26 UTC 2024 My preferred sport is football
```

<!--
Edit the ConfigMap:
-->
编辑 ConfigMap：

```shell
kubectl edit configmap sport
```

<!--
In the editor that appears, change the value of key `sport` from `football` to `cricket`. Save your changes.
The kubectl tool updates the ConfigMap accordingly (if you see an error, try again).

Here's an example of how that manifest could look after you edit it:
-->
在出现的编辑器中，将键 `sport` 的值从 `football` 变更为 `cricket`。
保存你的变更。kubectl 工具会相应地更新 ConfigMap（如果报错，请重试）。

以下是你编辑后该清单可能的样子：

<!--
# You can leave the existing metadata as they are.
# The values you'll see won't exactly match these.
-->
```yaml
apiVersion: v1
data:
  sport: cricket
kind: ConfigMap
# 你可以保留现有的 metadata 不变。
# 你将看到的值与本例的值不会完全一样。
metadata:
  creationTimestamp: "2024-01-04T14:05:06Z"
  name: sport
  namespace: default
  resourceVersion: "1743935"
  uid: 024ee001-fe72-487e-872e-34d6464a8a23
```

<!--
You should see the following output:
-->
你应该会看到以下输出：

```
configmap/sport edited
```

<!--
Tail (follow the latest entries in) the logs of one of the pods that belongs to this Deployment:
-->
查看属于此 Deployment 的 Pod 之一的日志（并跟踪最新写入的条目）：

```shell
kubectl logs deployments/configmap-volume --follow
```

<!--
After few seconds, you should see the log output change as follows:
-->
几秒钟后，你应该会看到日志输出中的如下变化：

```
Thu Jan  4 14:11:36 UTC 2024 My preferred sport is football
Thu Jan  4 14:11:46 UTC 2024 My preferred sport is football
Thu Jan  4 14:11:56 UTC 2024 My preferred sport is football
Thu Jan  4 14:12:06 UTC 2024 My preferred sport is cricket
Thu Jan  4 14:12:16 UTC 2024 My preferred sport is cricket
```

<!--
When you have a ConfigMap that is mapped into a running Pod using either a
`configMap` volume or a `projected` volume, and you update that ConfigMap,
the running Pod sees the update almost immediately.  
However, your application only sees the change if it is written to either poll for changes,
or watch for file updates.  
An application that loads its configuration once at startup will not notice a change.
-->
当你有一个 ConfigMap 通过 `configMap` 卷或 `projected` 卷映射到运行中的 Pod，
并且你更新了该 ConfigMap 时，运行中的 Pod 几乎会立即更新。  
但是，你的应用只有在编写为轮询变更或监视文件更新时才能看到变更。  
启动时一次性加载其配置的应用将不会注意到变更。

{{< note >}}
<!--
The total delay from the moment when the ConfigMap is updated to the moment when
new keys are projected to the Pod can be as long as kubelet sync period.  
Also check [Mounted ConfigMaps are updated automatically](/docs/tasks/configure-pod-container/configure-pod-configmap/#mounted-configmaps-are-updated-automatically).
-->
从更新 ConfigMap 的那一刻到将新的键投射到 Pod 的那一刻，整个延迟可能与 kubelet 同步周期相同。 
另请参阅[挂载的 ConfigMap 会被自动更新](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/#mounted-configmaps-are-updated-automatically)。
{{< /note >}}

<!--
## Update environment variables of a Pod via a ConfigMap {#rollout-configmap-env}

Use the `kubectl create configmap` command to create a ConfigMap from
[literal values](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):
-->
## 通过 ConfigMap 更新 Pod 的环境变量   {#rollout-configmap-env}

使用 `kubectl create configmap`
命令基于[字面值](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values)创建一个
ConfigMap：

```shell
kubectl create configmap fruits --from-literal=fruits=apples
```

<!--
Below is an example of a Deployment manifest with an environment variable configured via the ConfigMap `fruits`.
-->
下面是一个 Deployment 清单的示例，包含一个通过 ConfigMap `fruits` 配置的环境变量。

{{% code_sample file="deployments/deployment-with-configmap-as-envvar.yaml" %}}

<!--
Create the Deployment:
-->
创建此 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-as-envvar.yaml
```

<!--
Check the pods for this Deployment to ensure they are ready (matching by
{{< glossary_tooltip text="selector" term_id="selector" >}}):
-->
检查此 Deployment 的 Pod 以确保它们已就绪（通过{{< glossary_tooltip text="选择算符" term_id="selector" >}}进行匹配）：

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-env-var
```

<!--
You should see an output similar to:
-->
你应该会看到类似以下的输出：

```
NAME                                 READY   STATUS    RESTARTS   AGE
configmap-env-var-59cfc64f7d-74d7z   1/1     Running   0          46s
configmap-env-var-59cfc64f7d-c4wmj   1/1     Running   0          46s
configmap-env-var-59cfc64f7d-dpr98   1/1     Running   0          46s
```

<!--
The key-value pair in the ConfigMap is configured as an environment variable in the container of the Pod.
Check this by viewing the logs of one Pod that belongs to the Deployment.
-->
ConfigMap 中的键值对被配置为 Pod 容器中的环境变量。
通过查看属于该 Deployment 的某个 Pod 的日志来检查这一点。

```shell
kubectl logs deployment/configmap-env-var
```

<!--
You should see an output similar to:
-->
你应该会看到类似以下的输出：

```
Found 3 pods, using pod/configmap-env-var-7c994f7769-l74nq
Thu Jan  4 16:07:06 UTC 2024 The basket is full of apples
Thu Jan  4 16:07:16 UTC 2024 The basket is full of apples
Thu Jan  4 16:07:26 UTC 2024 The basket is full of apples
```

<!--
Edit the ConfigMap:
-->
编辑 ConfigMap：

```shell
kubectl edit configmap fruits
```

<!--
In the editor that appears, change the value of key `fruits` from `apples` to `mangoes`. Save your changes.
The kubectl tool updates the ConfigMap accordingly (if you see an error, try again).

Here's an example of how that manifest could look after you edit it:
-->
在出现的编辑器中，将键 `fruits` 的值从 `apples` 变更为 `mangoes`。
保存你的变更。kubectl 工具会相应地更新 ConfigMap（如果报错，请重试）。

以下是你编辑后该清单可能的样子：

<!--
# You can leave the existing metadata as they are.
# The values you'll see won't exactly match these.
-->
```yaml
apiVersion: v1
data:
  fruits: mangoes
kind: ConfigMap
# 你可以保留现有的 metadata 不变。
# 你将看到的值与本例的值不会完全一样。
metadata:
  creationTimestamp: "2024-01-04T16:04:19Z"
  name: fruits
  namespace: default
  resourceVersion: "1749472"
```

<!--
You should see the following output:
-->
你应该看到以下输出：

```
configmap/fruits edited
```

<!--
Tail the logs of the Deployment and observe the output for few seconds:

```shell
# As the text explains, the output does NOT change
kubectl logs deployments/configmap-env-var --follow
```

Notice that the output remains **unchanged**, even though you edited the ConfigMap:
-->
查看此 Deployment 的日志，并观察几秒钟的输出：

```shell
# 如上所述，输出不会有变化
kubectl logs deployments/configmap-env-var --follow
```

请注意，即使你编辑了 ConfigMap，输出仍然**没有变化**：

```
Thu Jan  4 16:12:56 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:06 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:16 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:26 UTC 2024 The basket is full of apples
```

{{< note >}}
<!--
Although the value of the key inside the ConfigMap has changed, the environment variable
in the Pod still shows the earlier value. This is because environment variables for a
process running inside a Pod are **not** updated when the source data changes; if you
wanted to force an update, you would need to have Kubernetes replace your existing Pods.
The new Pods would then run with the updated information.
-->
尽管 ConfigMap 中的键的取值已经变更，Pod 中的环境变量仍然显示先前的值。
这是因为当源数据变更时，在 Pod 内运行的进程的环境变量**不会**被更新；
如果你想强制更新，需要让 Kubernetes 替换现有的 Pod。新 Pod 将使用更新的信息来运行。
{{< /note >}}

<!--
You can trigger that replacement. Perform a rollout for the Deployment, using
[`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/):

```shell
# Trigger the rollout
kubectl rollout restart deployment configmap-env-var

# Wait for the rollout to complete
kubectl rollout status deployment configmap-env-var --watch=true
```

Next, check the Deployment:
-->
你可以触发该替换。使用 [`kubectl rollout`](/zh-cn/docs/reference/kubectl/generated/kubectl_rollout/)
为 Deployment 执行上线操作：

```shell
# 触发上线操作
kubectl rollout restart deployment configmap-env-var

# 等待上线操作完成
kubectl rollout status deployment configmap-env-var --watch=true
```

接下来，检查 Deployment：

```shell
kubectl get deployment configmap-env-var
```

<!--
You should see an output similar to:
-->
你应该会看到类似以下的输出：

```
NAME                READY   UP-TO-DATE   AVAILABLE   AGE
configmap-env-var   3/3     3            3           12m
```

<!--
Check the Pods:
-->
检查 Pod：

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-env-var
```

<!--
The rollout causes Kubernetes to make a new {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}
for the Deployment; that means the existing Pods eventually terminate, and new ones are created.
After few seconds, you should see an output similar to:
-->
上线操作会导致 Kubernetes 为 Deployment 新建一个 {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}；
这意味着现有的 Pod 最终会终止，并创建新的 Pod。几秒钟后，你应该会看到类似以下的输出：

```
NAME                                 READY   STATUS        RESTARTS   AGE
configmap-env-var-6d94d89bf5-2ph2l   1/1     Running       0          13s
configmap-env-var-6d94d89bf5-74twx   1/1     Running       0          8s
configmap-env-var-6d94d89bf5-d5vx8   1/1     Running       0          11s
```

{{< note >}}
<!--
Please wait for the older Pods to fully terminate before proceeding with the next steps.
-->
请等待旧的 Pod 完全终止后再进行下一步。
{{< /note >}}

<!--
View the logs for a Pod in this Deployment:

```shell
# Pick one Pod that belongs to the Deployment, and view its logs
kubectl logs deployment/configmap-env-var
```

You should see an output similar to the below:
-->
查看此 Deployment 中某个 Pod 的日志：

```shell
# 选择属于 Deployment 的一个 Pod，并查看其日志
kubectl logs deployment/configmap-env-var
```

你应该会看到类似以下的输出：

```
Found 3 pods, using pod/configmap-env-var-6d9ff89fb6-bzcf6
Thu Jan  4 16:30:35 UTC 2024 The basket is full of mangoes
Thu Jan  4 16:30:45 UTC 2024 The basket is full of mangoes
Thu Jan  4 16:30:55 UTC 2024 The basket is full of mangoes
```

<!--
This demonstrates the scenario of updating environment variables in a Pod that are derived
from a ConfigMap. Changes to the ConfigMap values are applied to the Pod during the subsequent
rollout. If Pods get created for another reason, such as scaling up the Deployment, then the new Pods
also use the latest configuration values; if you don't trigger a rollout, then you might find that your
app is running with a mix of old and new environment variable values.
-->
这个场景演示了在 Pod 中如何更新从 ConfigMap 派生的环境变量。ConfigMap
值的变更在随后的上线操作期间被应用到 Pod。如果 Pod 由于其他原因（例如 Deployment 扩容）被创建，
那么新 Pod 也会使用最新的配置值；
如果你不触发上线操作，你可能会发现你的应用在运行过程中混用了新旧环境变量值。

<!--
## Update configuration via a ConfigMap in a multi-container Pod {#rollout-configmap-multiple-containers}

Use the `kubectl create configmap` command to create a ConfigMap from
[literal values](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):
-->
## 在多容器 Pod 中通过 ConfigMap 更新配置   {#rollout-configmap-multiple-containers}

使用 `kubectl create configmap`
命令基于[字面值](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values)创建一个
ConfigMap：

```shell
kubectl create configmap color --from-literal=color=red
```

<!--
Below is an example manifest for a Deployment that manages a set of Pods, each with two containers.
The two containers share an `emptyDir` volume that they use to communicate.
The first container runs a web server (`nginx`). The mount path for the shared volume in the
web server container is `/usr/share/nginx/html`. The second helper container is based on `alpine`,
and for this container the `emptyDir` volume is mounted at `/pod-data`. The helper container writes
a file in HTML that has its content based on a ConfigMap. The web server container serves the HTML via HTTP.
-->
下面是一个 Deployment 清单的示例，该 Deployment 管理一组 Pod，每个 Pod 有两个容器。
这两个容器共享一个 `emptyDir` 卷并使用此卷进行通信。第一个容器运行 Web 服务器（`nginx`）。
在 Web 服务器容器中共享卷的挂载路径是 `/usr/share/nginx/html`。
第二个辅助容器基于 `alpine`，对于这个容器，`emptyDir` 卷被挂载在 `/pod-data`。
辅助容器生成一个 HTML 文件，其内容基于 ConfigMap。Web 服务器容器通过 HTTP 提供此 HTML 文件。

{{% code_sample file="deployments/deployment-with-configmap-two-containers.yaml" %}}

<!--
Create the Deployment:
-->
创建此 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-two-containers.yaml
```

<!--
Check the pods for this Deployment to ensure they are ready (matching by
{{< glossary_tooltip text="selector" term_id="selector" >}}):
-->
检查此 Deployment 的 Pod 以确保它们已就绪（通过{{< glossary_tooltip text="选择算符" term_id="selector" >}}进行匹配）：

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-two-containers
```

<!--
You should see an output similar to:
-->
你应该会看到类似以下的输出：

```
NAME                                        READY   STATUS    RESTARTS   AGE
configmap-two-containers-565fb6d4f4-2xhxf   2/2     Running   0          20s
configmap-two-containers-565fb6d4f4-g5v4j   2/2     Running   0          20s
configmap-two-containers-565fb6d4f4-mzsmf   2/2     Running   0          20s
```

<!--
Expose the Deployment (the `kubectl` tool creates a
{{<glossary_tooltip text="Service" term_id="service">}} for you):
-->
公开 Deployment（`kubectl` 工具会为你创建 {{< glossary_tooltip text="Service" term_id="service" >}}）：

```shell
kubectl expose deployment configmap-two-containers --name=configmap-service --port=8080 --target-port=80
```

<!--
Use `kubectl` to forward the port:

```shell
# this stays running in the background
kubectl port-forward service/configmap-service 8080:8080 &
```

Access the service.
-->
使用 `kubectl` 转发端口：

```shell
# 此命令将在后台运行
kubectl port-forward service/configmap-service 8080:8080 &
```

访问服务：

```shell
curl http://localhost:8080
```

<!--
You should see an output similar to:
-->
你应该会看到类似以下的输出：

```
Fri Jan  5 08:08:22 UTC 2024 My preferred color is red
```

<!--
Edit the ConfigMap:
-->
编辑 ConfigMap：

```shell
kubectl edit configmap color
```

<!--
In the editor that appears, change the value of key `color` from `red` to `blue`. Save your changes.
The kubectl tool updates the ConfigMap accordingly (if you see an error, try again).

Here's an example of how that manifest could look after you edit it:
-->
在出现的编辑器中，将键 `color` 的值从 `red` 变更为 `blue`。
保存你的变更。kubectl 工具会相应地更新 ConfigMap（如果报错，请重试）。

以下是你编辑后该清单可能的样子：

<!--
# You can leave the existing metadata as they are.
# The values you'll see won't exactly match these.
-->
```yaml
apiVersion: v1
data:
  color: blue
kind: ConfigMap
# 你可以保留现有的 metadata 不变。
# 你将看到的值与本例的值不会完全一样。
metadata:
  creationTimestamp: "2024-01-05T08:12:05Z"
  name: color
  namespace: configmap
  resourceVersion: "1801272"
  uid: 80d33e4a-cbb4-4bc9-ba8c-544c68e425d6
```

<!--
Loop over the service URL for few seconds.

```shell
# Cancel this when you're happy with it (Ctrl-C)
while true; do curl --connect-timeout 7.5 http://localhost:8080; sleep 10; done
```

You should see the output change as follows:
-->
循环访问服务 URL 几秒钟。

```shell
# 当你满意时可以取消此操作 (Ctrl-C)
while true; do curl --connect-timeout 7.5 http://localhost:8080; sleep 10; done
```

你应该会看到如下的输出变化：

```
Fri Jan  5 08:14:00 UTC 2024 My preferred color is red
Fri Jan  5 08:14:02 UTC 2024 My preferred color is red
Fri Jan  5 08:14:20 UTC 2024 My preferred color is red
Fri Jan  5 08:14:22 UTC 2024 My preferred color is red
Fri Jan  5 08:14:32 UTC 2024 My preferred color is blue
Fri Jan  5 08:14:43 UTC 2024 My preferred color is blue
Fri Jan  5 08:15:00 UTC 2024 My preferred color is blue
```

<!--
## Update configuration via a ConfigMap in a Pod possessing a sidecar container {#rollout-configmap-sidecar}

The above scenario can be replicated by using a [Sidecar Container](/docs/concepts/workloads/pods/sidecar-containers/)
as a helper container to write the HTML file.  
As a Sidecar Container is conceptually an Init Container, it is guaranteed to start before the main web server container.  
This ensures that the HTML file is always available when the web server is ready to serve it.  
Please see [Enabling sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/#enabling-sidecar-containers) to utilize this feature.
-->
## 在包含边车容器的 Pod 中通过 ConfigMap 更新配置    {#rollout-configmap-sidecar}

要重现上述场景，可以使用[边车容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)作为辅助容器来写入 HTML 文件。  
由于边车容器在概念上是一个 Init 容器，因此保证会在主要 Web 服务器容器启动之前启动。  
这确保了当 Web 服务器准备好提供服务时，HTML 文件始终可用。  
请参阅[启用边车容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/#enabling-sidecar-containers)以使用此特性。

<!--
If you are continuing from the previous scenario, you can reuse the ConfigMap named `color` for this scenario.  
If you are executing this scenario independently, use the `kubectl create configmap` command to create a ConfigMap
from [literal values](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):
-->
如果你从前一个场景继续操作，你可以在此场景中重用名为 `color` 的 ConfigMap。  
如果你是独立执行此场景，请使用 `kubectl create configmap`
命令基于[字面值](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values)创建一个
ConfigMap：

```shell
kubectl create configmap color --from-literal=color=blue
```

<!--
Below is an example manifest for a Deployment that manages a set of Pods, each with a main container and
a sidecar container. The two containers share an `emptyDir` volume that they use to communicate.
The main container runs a web server (NGINX). The mount path for the shared volume in the web server container
is `/usr/share/nginx/html`. The second container is a Sidecar Container based on Alpine Linux which acts as
a helper container. For this container the `emptyDir` volume is mounted at `/pod-data`. The Sidecar Container
writes a file in HTML that has its content based on a ConfigMap. The web server container serves the HTML via HTTP.
-->
以下是一个 Deployment 清单示例，该 Deployment 管理一组 Pod，每个 Pod 有一个主容器和一个边车容器。
这两个容器共享一个 `emptyDir` 卷并使用此卷来通信。主容器运行 Web 服务器（NGINX）。
在 Web 服务器容器中共享卷的挂载路径是 `/usr/share/nginx/html`。
第二个容器是基于 Alpine Linux 作为辅助容器的边车容器。对于这个辅助容器，`emptyDir` 卷被挂载在 `/pod-data`。
边车容器写入一个 HTML 文件，其内容基于 ConfigMap。Web 服务器容器通过 HTTP 提供此 HTML 文件。

{{% code_sample file="deployments/deployment-with-configmap-and-sidecar-container.yaml" %}}

<!--
Create the Deployment:
-->
创建此 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-and-sidecar-container.yaml
```

<!--
Check the pods for this Deployment to ensure they are ready (matching by
{{< glossary_tooltip text="selector" term_id="selector" >}}):
-->
检查此 Deployment 的 Pod 以确保它们已就绪（通过{{< glossary_tooltip text="选择算符" term_id="selector" >}}进行匹配）：

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-sidecar-container
```

<!--
You should see an output similar to:
-->
你应该会看到类似以下的输出：

```
NAME                                           READY   STATUS    RESTARTS   AGE
configmap-sidecar-container-5fb59f558b-87rp7   2/2     Running   0          94s
configmap-sidecar-container-5fb59f558b-ccs7s   2/2     Running   0          94s
configmap-sidecar-container-5fb59f558b-wnmgk   2/2     Running   0          94s
```

<!--
Expose the Deployment (the `kubectl` tool creates a
{{<glossary_tooltip text="Service" term_id="service">}} for you):
-->
公开 Deployment（`kubectl` 工具会为你创建一个 {{< glossary_tooltip text="Service" term_id="service" >}}）：

```shell
kubectl expose deployment configmap-sidecar-container --name=configmap-sidecar-service --port=8081 --target-port=80
```

<!--
Use `kubectl` to forward the port:

```shell
# this stays running in the background
kubectl port-forward service/configmap-sidecar-service 8081:8081 &
```

Access the service.
-->
使用 `kubectl` 转发端口：

```shell
# 此命令将在后台运行
kubectl port-forward service/configmap-sidecar-service 8081:80 &
```

访问服务：

```shell
curl http://localhost:8081
```

<!--
You should see an output similar to:
-->
你应该看到类似以下的输出：

```
Sat Feb 17 13:09:05 UTC 2024 My preferred color is blue
```

<!--
Edit the ConfigMap:
-->
编辑 ConfigMap：

```shell
kubectl edit configmap color
```

<!--
In the editor that appears, change the value of key `color` from `blue` to `green`. Save your changes.
The kubectl tool updates the ConfigMap accordingly (if you see an error, try again).

Here's an example of how that manifest could look after you edit it:
-->
在出现的编辑器中，将键 `color` 的值从 `blue` 变更为 `green`。
保存你的变更。kubectl 工具会相应地更新 ConfigMap（如果报错，请重试）。

以下是你编辑后该清单可能的样子：

<!--
# You can leave the existing metadata as they are.
# The values you'll see won't exactly match these.
-->
```yaml
apiVersion: v1
data:
  color: green
kind: ConfigMap
# 你可以保留现有的 metadata 不变。
# 你将看到的值与本例的值不会完全一样。
metadata:
  creationTimestamp: "2024-02-17T12:20:30Z"
  name: color
  namespace: default
  resourceVersion: "1054"
  uid: e40bb34c-58df-4280-8bea-6ed16edccfaa
```

<!--
Loop over the service URL for few seconds.

```shell
# Cancel this when you're happy with it (Ctrl-C)
while true; do curl --connect-timeout 7.5 http://localhost:8081; sleep 10; done
```

You should see the output change as follows:
-->
循环访问服务 URL 几秒钟。

```shell
# 当你满意时可以取消此操作 (Ctrl-C)
while true; do curl --connect-timeout 7.5 http://localhost:8081; sleep 10; done
```

你应该会看到如下的输出变化：

```
Sat Feb 17 13:12:35 UTC 2024 My preferred color is blue
Sat Feb 17 13:12:45 UTC 2024 My preferred color is blue
Sat Feb 17 13:12:55 UTC 2024 My preferred color is blue
Sat Feb 17 13:13:05 UTC 2024 My preferred color is blue
Sat Feb 17 13:13:15 UTC 2024 My preferred color is green
Sat Feb 17 13:13:25 UTC 2024 My preferred color is green
Sat Feb 17 13:13:35 UTC 2024 My preferred color is green
```

<!--
## Update configuration via an immutable ConfigMap that is mounted as a volume {#rollout-configmap-immutable-volume}
-->
## 通过作为卷挂载的不可变 ConfigMap 更新配置   {#rollout-configmap-immutable-volume}

{{< note >}}
<!--
Immutable ConfigMaps are especially used for configuration that is constant and is **not** expected
to change over time. Marking a ConfigMap as immutable allows a performance improvement where the kubelet does not watch for changes.

If you do need to make a change, you should plan to either:

- change the name of the ConfigMap, and switch to running Pods that reference the new name
- replace all the nodes in your cluster that have previously run a Pod that used the old value
- restart the kubelet on any node where the kubelet previously loaded the old ConfigMap
-->
不可变 ConfigMap 专门用于恒定且预期**不会**随时间变化的配置。
将 ConfigMap 标记为不可变可以提高性能，因为 kubelet 不会监视变更。

如果你确实需要进行变更，你应计划：

- 变更 ConfigMap 的名称，并转而运行引用新名称的 Pod
- 替换集群中之前运行使用旧值的 Pod 的所有节点
- 在任何之前加载过旧 ConfigMap 的节点上重新启动 kubelet
{{< /note >}}

<!--
An example manifest for an [Immutable ConfigMap](/docs/concepts/configuration/configmap/#configmap-immutable) is shown below.
{{% code_sample file="configmap/immutable-configmap.yaml" %}}

Create the Immutable ConfigMap:
-->
以下是一个[不可变 ConfigMap](/zh-cn/docs/concepts/configuration/configmap/#configmap-immutable)的示例清单。

{{% code_sample file="configmap/immutable-configmap.yaml" %}}

创建不可变 ConfigMap：

```shell
kubectl apply -f https://k8s.io/examples/configmap/immutable-configmap.yaml
```

<!--
Below is an example of a Deployment manifest with the Immutable ConfigMap `company-name-20150801` mounted as a
{{< glossary_tooltip text="volume" term_id="volume" >}} into the Pod's only container.
-->
下面是一个 Deployment 清单示例，其中不可变 ConfigMap `company-name-20150801`
作为{{< glossary_tooltip text="卷" term_id="volume" >}}挂载到 Pod 的唯一容器中。

{{% code_sample file="deployments/deployment-with-immutable-configmap-as-volume.yaml" %}}

<!--
Create the Deployment:
-->
创建此 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-immutable-configmap-as-volume.yaml
```

<!--
Check the pods for this Deployment to ensure they are ready (matching by
{{< glossary_tooltip text="selector" term_id="selector" >}}):
-->
检查此 Deployment 的 Pod 以确保它们已就绪（通过{{< glossary_tooltip text="选择算符" term_id="selector" >}}进行匹配）：

```shell
kubectl get pods --selector=app.kubernetes.io/name=immutable-configmap-volume
```

<!--
You should see an output similar to:
-->
你应该看到类似以下的输出：

```
NAME                                          READY   STATUS    RESTARTS   AGE
immutable-configmap-volume-78b6fbff95-5gsfh   1/1     Running   0          62s
immutable-configmap-volume-78b6fbff95-7vcj4   1/1     Running   0          62s
immutable-configmap-volume-78b6fbff95-vdslm   1/1     Running   0          62s
```

<!--
The Pod's container refers to the data defined in the ConfigMap and uses it to print a report to stdout.
You can check this report by viewing the logs for one of the Pods in that Deployment:

```shell
# Pick one Pod that belongs to the Deployment, and view its logs
kubectl logs deployments/immutable-configmap-volume
```

You should see an output similar to:
-->
Pod 的容器引用 ConfigMap 中所定义的数据，并使用它将报告打印到标准输出。
你可以通过查看 Deployment 中某个 Pod 的日志来检查此报告：

```shell
# 选择属于该 Deployment 的一个 Pod，并查看其日志
kubectl logs deployments/immutable-configmap-volume
```

你应该会看到类似以下的输出：

```
Found 3 pods, using pod/immutable-configmap-volume-78b6fbff95-5gsfh
Wed Mar 20 03:52:34 UTC 2024 The name of the company is ACME, Inc.
Wed Mar 20 03:52:44 UTC 2024 The name of the company is ACME, Inc.
Wed Mar 20 03:52:54 UTC 2024 The name of the company is ACME, Inc.
```

{{< note >}}
<!--
Once a ConfigMap is marked as immutable, it is not possible to revert this change
nor to mutate the contents of the data or the binaryData field.  
In order to modify the behavior of the Pods that use this configuration,
you will create a new immutable ConfigMap and edit the Deployment
to define a slightly different pod template, referencing the new ConfigMap.
-->
一旦 ConfigMap 被标记为不可变，就无法撤销此变更，也无法修改 `data` 或 `binaryData` 字段的内容。  
为了修改使用此配置的 Pod 的行为，你需要创建一个新的不可变 ConfigMap，并编辑 Deployment
以定义一个稍有不同的 Pod 模板，引用新的 ConfigMap。
{{< /note >}}

<!--
Create a new immutable ConfigMap by using the manifest shown below:
-->
通过使用下面所示的清单创建一个新的不可变 ConfigMap：

{{% code_sample file="configmap/new-immutable-configmap.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/configmap/new-immutable-configmap.yaml
```

<!--
You should see an output similar to:
-->
你应该看到类似以下的输出：

```
configmap/company-name-20240312 created
```

<!--
Check the newly created ConfigMap:
-->
检查新建的 ConfigMap：

```shell
kubectl get configmap
```

<!--
You should see an output displaying both the old and new ConfigMaps:
-->
你应该看到输出会同时显示新旧 ConfigMap：

```
NAME                    DATA   AGE
company-name-20150801   1      22m
company-name-20240312   1      24s
```

<!--
Modify the Deployment to reference the new ConfigMap.

Edit the Deployment:
-->
修改 Deployment 以引用新的 ConfigMap。

编辑 Deployment：

```shell
kubectl edit deployment immutable-configmap-volume
```

<!--
In the editor that appears, update the existing volume definition to use the new ConfigMap.

```yaml
volumes:
- configMap:
    defaultMode: 420
    name: company-name-20240312 # Update this field
  name: config-volume
```
-->
在出现的编辑器中，更新现有的卷定义以使用新的 ConfigMap。

```yaml
volumes:
- configMap:
    defaultMode: 420
    name: company-name-20240312 # 更新此字段
  name: config-volume
```

<!--
You should see the following output:
-->
你应该看到以下输出：

```
deployment.apps/immutable-configmap-volume edited
```

<!--
This will trigger a rollout. Wait for all the previous Pods to terminate and the new Pods to be in a ready state.

Monitor the status of the Pods:
-->
这将触发一次上线操作。等待所有先前的 Pod 终止并且新的 Pod 处于就绪状态。

监控 Pod 的状态：

```shell
kubectl get pods --selector=app.kubernetes.io/name=immutable-configmap-volume
```

```
NAME                                          READY   STATUS        RESTARTS   AGE
immutable-configmap-volume-5fdb88fcc8-29v8n   1/1     Running       0          13s
immutable-configmap-volume-5fdb88fcc8-52ddd   1/1     Running       0          14s
immutable-configmap-volume-5fdb88fcc8-n5jx4   1/1     Running       0          15s
immutable-configmap-volume-78b6fbff95-5gsfh   1/1     Terminating   0          32m
immutable-configmap-volume-78b6fbff95-7vcj4   1/1     Terminating   0          32m
immutable-configmap-volume-78b6fbff95-vdslm   1/1     Terminating   0          32m
```

<!--
You should eventually see an output similar to:
-->
最终，你应该会看到类似以下的输出：

```
NAME                                          READY   STATUS    RESTARTS   AGE
immutable-configmap-volume-5fdb88fcc8-29v8n   1/1     Running   0          43s
immutable-configmap-volume-5fdb88fcc8-52ddd   1/1     Running   0          44s
immutable-configmap-volume-5fdb88fcc8-n5jx4   1/1     Running   0          45s
```

<!--
View the logs for a Pod in this Deployment:

```shell
# Pick one Pod that belongs to the Deployment, and view its logs
kubectl logs deployment/immutable-configmap-volume
```

You should see an output similar to the below:
-->
查看此 Deployment 中某个 Pod 的日志：

```shell
# 选择属于此 Deployment 的一个 Pod，并查看其日志
kubectl logs deployment/immutable-configmap-volume
```

你应该会看到类似下面的输出：

```
Found 3 pods, using pod/immutable-configmap-volume-5fdb88fcc8-n5jx4
Wed Mar 20 04:24:17 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
Wed Mar 20 04:24:27 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
Wed Mar 20 04:24:37 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
```

<!--
Once all the deployments have migrated to use the new immutable ConfigMap, it is advised to delete the old one.
-->
建议一旦所有 Deployment 都迁移到使用新的不可变 ConfigMap，删除旧的 ConfigMap。

```shell
kubectl delete configmap company-name-20150801
```

<!--
## Summary

Changes to a ConfigMap mounted as a Volume on a Pod are available seamlessly after the subsequent kubelet sync.

Changes to a ConfigMap that configures environment variables for a Pod are available after the subsequent rollout for the Pod.
-->
## 总结   {#summary}

在 Pod 上作为卷挂载的 ConfigMap 所发生的变更将在后续的 kubelet 同步后无缝生效。

配置为 Pod 环境变量的 ConfigMap 所发生变更将在后续的 Pod 上线操作后生效。

<!--
Once a ConfigMap is marked as immutable, it is not possible to revert this change
(you cannot make an immutable ConfigMap mutable), and you also cannot make any change
to the contents of the `data` or the `binaryData` field. You can delete and recreate
the ConfigMap, or you can make a new different ConfigMap. When you delete a ConfigMap,
running containers and their Pods maintain a mount point to any volume that referenced
that existing ConfigMap.
-->
一旦 ConfigMap 被标记为不可变，就无法撤销此变更（你不能将不可变的 ConfigMap 改为可变），
并且你也不能对 `data` 或 `binaryData` 字段的内容进行任何变更。你可以删除并重新创建 ConfigMap，
或者你可以创建一个新的不同的 ConfigMap。当你删除 ConfigMap 时，
运行中的容器及其 Pod 将保持对引用了现有 ConfigMap 的任何卷的挂载点。

## {{% heading "cleanup" %}}

<!--
Terminate the `kubectl port-forward` commands in case they are running.

Delete the resources created during the tutorial:
-->
终止正在运行的 `kubectl port-forward` 命令。

删除以上教程中所创建的资源：

<!--
# In case it was not handled during the task execution
-->
```shell
kubectl delete deployment configmap-volume configmap-env-var configmap-two-containers configmap-sidecar-container immutable-configmap-volume
kubectl delete service configmap-service configmap-sidecar-service
kubectl delete configmap sport fruits color company-name-20240312

kubectl delete configmap company-name-20150801 # 如果在任务执行期间未被处理
```
