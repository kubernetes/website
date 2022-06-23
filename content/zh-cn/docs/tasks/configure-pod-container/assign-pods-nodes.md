---
title: 将 Pod 分配给节点
content_type: task
weight: 120
---
<!--
title: Assign Pods to Nodes
content_type: task
weight: 120
-->

<!-- overview -->
<!--
This page shows how to assign a Kubernetes Pod to a particular node in a
Kubernetes cluster.
-->
此页面显示如何将 Kubernetes Pod 分配给 Kubernetes 集群中的特定节点。


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

<!--
## Add a label to a node

1. List the nodes in your cluster:
-->
## 给节点添加标签

1. 列出集群中的节点

   ```shell
   kubectl get nodes
   ```

   <!-- The output is similar to this: -->
   输出类似如下：

   ```
   NAME      STATUS    AGE     VERSION
   worker0   Ready     1d      v1.6.0+fff5156
   worker1   Ready     1d      v1.6.0+fff5156
   worker2   Ready     1d      v1.6.0+fff5156
   ```

<!--
1. Chose one of your nodes, and add a label to it:
-->
2. 选择其中一个节点，为它添加标签：

   ```shell
   kubectl label nodes <your-node-name> disktype=ssd
   ```

   <!--
   where `<your-node-name>` is the name of your chosen node.
   -->
   `<your-node-name>` 是你选择的节点的名称。

<!--
1. Verify that your chosen node has a `disktype=ssd` label:
-->
3. 验证你选择的节点是否有 `disktype=ssd` 标签：

   ```shell
   kubectl get nodes --show-labels
   ```

   <!--
   The output is similar to this:
   -->
   输出类似如下：

   ```
   NAME      STATUS    AGE     VERSION            LABELS
   worker0   Ready     1d      v1.6.0+fff5156     ...,disktype=ssd,kubernetes.io/hostname=worker0
   worker1   Ready     1d      v1.6.0+fff5156     ...,kubernetes.io/hostname=worker1
   worker2   Ready     1d      v1.6.0+fff5156     ...,kubernetes.io/hostname=worker2
   ```
   <!--
   In the preceding output, you can see that the `worker0` node has a
   `disktype=ssd` label.
   -->
   在前面的输出中，你可以看到 `worker0` 节点有 `disktype=ssd` 标签。

<!--
## Create a pod that gets scheduled to your chosen node

This pod configuration file describes a pod that has a node selector,
`disktype: ssd`. This means that the pod will get scheduled on a node that has
a `disktype=ssd` label.
-->
## 创建一个调度到你选择的节点的 pod

此 Pod 配置文件描述了一个拥有节点选择器 `disktype: ssd` 的 Pod。这表明该 Pod 将被调度到
有 `disktype=ssd` 标签的节点。

{{< codenew file="pods/pod-nginx.yaml" >}}

<!--
1. Use the configuration file to create a pod that will get scheduled on your
   chosen node:
-->
1. 使用该配置文件去创建一个 pod，该 pod 将被调度到你选择的节点上：

   ```shell
   kubectl create -f https://k8s.io/examples/pods/pod-nginx.yaml
   ```

<!--
1. Verify that the pod is running on your chosen node:
-->
2. 验证 pod 是不是运行在你选择的节点上：

   ```shell
   kubectl get pods --output=wide
   ```

   <!-- The output is similar to this: -->
   输出类似如下：

   ```
   NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
   nginx    1/1       Running   0          13s    10.200.0.4   worker0
   ```

## {{% heading "whatsnext" %}}

<!--
Learn more about
[labels and selectors](/docs/concepts/overview/working-with-objects/labels/).
-->
进一步了解[标签和选择器](/zh-cn/docs/concepts/overview/working-with-objects/labels/)

