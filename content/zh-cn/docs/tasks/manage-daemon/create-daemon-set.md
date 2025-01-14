---
title: 构建一个基本的 DaemonSet  
content_type: task  
weight: 5  
---
<!--
title: Building a Basic DaemonSet  
content_type: task  
weight: 5
-->

<!-- overview -->

<!--
This page demonstrates how to build a basic {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} that runs a Pod on every node in a Kubernetes cluster.
It covers a simple use case of mounting a file from the host, logging its contents using
an [init container](/docs/concepts/workloads/pods/init-containers/), and utilizing a pause container.
-->
本页演示如何构建一个基本的 {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}，
用其在 Kubernetes 集群中的每个节点上运行 Pod。
这个简单的使用场景包含了从主机挂载一个文件，使用
[Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)记录文件的内容，
以及使用 `pause` 容器。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
A Kubernetes cluster with at least two nodes (one control plane node and one worker node) to demonstrate the behavior of DaemonSets.
-->
为了演示 DaemonSet 的行为，Kubernetes 集群至少需包含两个节点（一个控制平面节点和一个工作节点）。

<!--
## Define the DaemonSet

In this task, a basic DaemonSet is created which ensures that the copy of a Pod is scheduled on every node.
The Pod will use an init container to read and log the contents of `/etc/machine-id` from the host,
while the main container will be a `pause` container, which keeps the Pod running.
-->
## 定义 DaemonSet   {#define-the-daemonset}

在此任务中，将创建一个基本的 DaemonSet，确保 Pod 的副本被调度到每个节点上。
此 Pod 将使用 Init 容器从主机读取并记录 `/etc/machine-id` 的内容，
而主容器将是一个 `pause` 容器，用于保持 Pod 运行。

{{% code_sample file="application/basic-daemonset.yaml" %}}

<!--
1. Create a DaemonSet based on the (YAML) manifest:
-->
1. 基于（YAML）清单创建 DaemonSet：

   ```shell
   kubectl apply -f https://k8s.io/examples/application/basic-daemonset.yaml
   ```

<!--
1. Once applied, you can verify that the DaemonSet is running a Pod on every node in the cluster:
-->
2. 完成创建操作后，你可以验证 DaemonSet 是否在集群中的每个节点上运行 Pod：

   ```shell
   kubectl get pods -o wide
   ```

   <!--
   The output will list one Pod per node, similar to:
   -->

   输出将列出每个节点上有一个 Pod，类似于：

   ```
   NAME                                READY   STATUS    RESTARTS   AGE    IP       NODE
   example-daemonset-xxxxx             1/1     Running   0          5m     x.x.x.x  node-1
   example-daemonset-yyyyy             1/1     Running   0          5m     x.x.x.x  node-2
   ```

<!--
1. You can inspect the contents of the logged `/etc/machine-id` file by checking the log directory mounted from the host:
-->
3. 你可以通过检查从主机挂载的日志目录来查看 `/etc/machine-id` 文件的日志内容：

   ```shell
   kubectl exec <pod-name> -- cat /var/log/machine-id.log
   ```
  
   <!--
   Where `<pod-name>` is the name of one of your Pods.
   -->

   其中 `<pod-name>` 是某一个 Pod 的名称。

## {{% heading "cleanup" %}}

```shell
kubectl delete --cascade=foreground --ignore-not-found --now daemonsets/example-daemonset
```

<!--
This simple DaemonSet example introduces key components like init containers and host path volumes,
which can be expanded upon for more advanced use cases. For more details refer to
[DaemonSet](/docs/concepts/workloads/controllers/daemonset/).
-->
这个简单的 DaemonSet 例子介绍了 Init 容器和主机路径卷这类关键组件，
你可以在此基础上扩展以应对更高级的使用场景。有关细节参阅
[DaemonSet](/zh-cn/docs/concepts/workloads/controllers/daemonset/)。
