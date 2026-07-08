---
title: 用节点亲和性把 Pod 分配到节点
min-kubernetes-server-version: v1.10
content_type: task
weight: 160
---
<!--
title: Assign Pods to Nodes using Node Affinity
min-kubernetes-server-version: v1.10
content_type: task
weight: 160
-->

<!-- overview -->
<!--
This page shows how to assign a Kubernetes Pod to a particular node using Node Affinity in a
Kubernetes cluster.
-->
本页展示在 Kubernetes 集群中，如何使用节点亲和性把 Kubernetes Pod 分配到特定节点。

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

<!--
## Add a label to a node
-->
## 给节点添加标签

<!-- 
1. List the nodes in your cluster, along with their labels:
-->
1. 列出集群中的节点及其标签：

    ```shell
    kubectl get nodes --show-labels
    ```
    
    <!--
    The output is similar to this:
    -->

    输出类似于此：

    ```
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

<!--
1. Choose one of your nodes, and add a label to it:
-->
2. 选择一个节点，给它添加一个标签：

    ```shell
    kubectl label nodes <your-node-name> disktype=ssd
    ```

    <!--
    where `<your-node-name>` is the name of your chosen node.
    -->

    其中 `<your-node-name>` 是你所选节点的名称。

<!-- 
1. Verify that your chosen node has a `disktype=ssd` label:
-->
3. 验证你所选节点具有 `disktype=ssd` 标签：

    ```shell
    kubectl get nodes --show-labels
    ```

    <!--
    The output is similar to this:
    -->

    输出类似于此：

    ```
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,disktype=ssd,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

    <!--
    In the preceding output, you can see that the `worker0` node has a
    `disktype=ssd` label.
    -->

    在前面的输出中，可以看到 `worker0` 节点有一个 `disktype=ssd` 标签。

<!--
## Schedule a Pod using required node affinity

This manifest describes a Pod that has a `requiredDuringSchedulingIgnoredDuringExecution` node affinity,`disktype: ssd`. 
This means that the pod will get scheduled only on a node that has a `disktype=ssd` label. 
-->
## 依据强制的节点亲和性调度 Pod  {#schedule-a-Pod-using-required-node-affinity}

下面清单描述了一个 Pod，它有一个节点亲和性配置 `requiredDuringSchedulingIgnoredDuringExecution`，`disktype=ssd`。
这意味着 pod 只会被调度到具有 `disktype=ssd` 标签的节点上。

{{% code_sample file="pods/pod-nginx-required-affinity.yaml" %}}

<!--
1. Apply the manifest to create a Pod that is scheduled onto your
   chosen node:
-->
1. 执行（Apply）此清单来创建一个调度到所选节点上的 Pod：

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx-required-affinity.yaml
    ```

<!--
1. Verify that the pod is running on your chosen node:
-->
2. 验证 Pod 已经在所选节点上运行：

    ```shell
    kubectl get pods --output=wide
    ```

   <!--
    The output is similar to this:
   -->

    输出类似于此：

    ```
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```
    
<!--    
## Schedule a Pod using preferred node affinity

This manifest describes a Pod that has a `preferredDuringSchedulingIgnoredDuringExecution` node affinity,`disktype: ssd`. 
This means that the pod will prefer a node that has a `disktype=ssd` label. 
-->
## 使用首选的节点亲和性调度 Pod {#schedule-a-Pod-using-preferred-node-affinity}

本清单描述了一个 Pod，它有一个节点亲和性设置 `preferredDuringSchedulingIgnoredDuringExecution`，`disktype: ssd`。
这意味着 Pod 将首选具有 `disktype=ssd` 标签的节点。

{{% code_sample file="pods/pod-nginx-preferred-affinity.yaml" %}}

<!--
1. Apply the manifest to create a Pod that is scheduled onto your
   chosen node:
-->
1. 执行此清单创建一个会调度到所选节点上的 Pod：
    
    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx-preferred-affinity.yaml
    ```

<!--
1. Verify that the pod is running on your chosen node:
-->
2. 验证 Pod 是否在所选节点上运行：
   
    ```shell
    kubectl get pods --output=wide
    ```

    <!--
    The output is similar to this:
    -->

    输出类似于此：
    
    ```
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```



## {{% heading "whatsnext" %}}

<!--
Learn more about
[Node Affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity).
-->
进一步了解[节点亲和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)。
