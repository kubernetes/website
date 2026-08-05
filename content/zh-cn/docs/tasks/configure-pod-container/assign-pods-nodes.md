---
title: 将 Pod 分配给节点
content_type: task
weight: 150
---
<!--
title: Assign Pods to Nodes
content_type: task
weight: 150
-->

<!-- overview -->
<!--
This page shows how to assign a Kubernetes Pod to a particular node in a
Kubernetes cluster.
-->
此页面显示如何将 Kubernetes Pod 指派给 Kubernetes 集群中的特定节点。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Add a label to a node

1. List the {{< glossary_tooltip term_id="node" text="nodes" >}} in your cluster, along with their labels:
-->
## 给节点添加标签  {#add-a-label-to-a-node}

1. 列出你的集群中的{{< glossary_tooltip term_id="node" text="节点" >}}，
   包括这些节点上的标签：

   ```shell
   kubectl get nodes --show-labels
   ```

   <!--
   The output is similar to this:
   -->
   输出类似如下：

   ```shell
   NAME      STATUS    ROLES    AGE     VERSION        LABELS
   worker0   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker0
   worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
   worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
   ```

<!--
1. Choose one of your nodes, and add a label to it:
-->
2. 从你的节点中选择一个，为它添加标签：

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
3. 验证你选择的节点确实带有 `disktype=ssd` 标签：

   ```shell
   kubectl get nodes --show-labels
   ```

   <!--
   The output is similar to this:
   -->
   输出类似如下：

   ```shell
   NAME      STATUS    ROLES    AGE     VERSION        LABELS
   worker0   Ready     <none>   1d      v1.13.0        ...,disktype=ssd,kubernetes.io/hostname=worker0
   worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
   worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
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
## 创建一个将被调度到你选择的节点的 Pod  {#create-a-pod-scheduled-to-chosen-node}

此 Pod 配置文件描述了一个拥有节点选择器 `disktype: ssd` 的 Pod。这表明该 Pod
将被调度到有 `disktype=ssd` 标签的节点。

{{% code_sample file="pods/pod-nginx.yaml" %}}

<!--
1. Use the configuration file to create a pod that will get scheduled on your
   chosen node:
-->
1. 使用该配置文件创建一个 Pod，该 Pod 将被调度到你选择的节点上：

   ```shell
   kubectl create -f https://k8s.io/examples/pods/pod-nginx.yaml
   ```

<!--
1. Verify that the pod is running on your chosen node:
-->
2. 验证 Pod 确实运行在你选择的节点上：

   ```shell
   kubectl get pods --output=wide
   ```

   <!--
   The output is similar to this:
   -->
   输出类似如下：

   ```shell
   NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
   nginx    1/1       Running   0          13s    10.200.0.4   worker0
   ```

<!--
## Create a pod that gets scheduled to specific node

You can also schedule a pod to one specific node via setting `nodeName`.
-->
## 创建一个会被调度到特定节点上的 Pod  {#create-a-pod-scheduled-to-specific-node}

你也可以通过设置 `nodeName` 将某个 Pod 调度到特定的节点。

{{% code_sample file="pods/pod-nginx-specific-node.yaml" %}}

<!--
Use the configuration file to create a pod that will get scheduled on `foo-node` only.
-->
使用此配置文件来创建一个 Pod，该 Pod 将只能被调度到 `foo-node` 节点。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [labels and selectors](/docs/concepts/overview/working-with-objects/labels/).
* Learn more about [nodes](/docs/concepts/architecture/nodes/).
-->
* 进一步了解[标签和选择算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/)
* 进一步了解[节点](/zh-cn/docs/concepts/architecture/nodes/)
