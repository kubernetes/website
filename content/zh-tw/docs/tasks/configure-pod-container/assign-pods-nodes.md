---
title: 將 Pod 分配給節點
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
此頁面顯示如何將 Kubernetes Pod 分配給 Kubernetes 叢集中的特定節點。


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

<!--
## Add a label to a node

1. List the nodes in your cluster:
-->
## 給節點新增標籤

1. 列出叢集中的節點

   ```shell
   kubectl get nodes
   ```

   <!-- The output is similar to this: -->
   輸出類似如下：

   ```
   NAME      STATUS    AGE     VERSION
   worker0   Ready     1d      v1.6.0+fff5156
   worker1   Ready     1d      v1.6.0+fff5156
   worker2   Ready     1d      v1.6.0+fff5156
   ```

<!--
1. Chose one of your nodes, and add a label to it:
-->
2. 選擇其中一個節點，為它新增標籤：

   ```shell
   kubectl label nodes <your-node-name> disktype=ssd
   ```

   <!--
   where `<your-node-name>` is the name of your chosen node.
   -->
   `<your-node-name>` 是你選擇的節點的名稱。

<!--
1. Verify that your chosen node has a `disktype=ssd` label:
-->
3. 驗證你選擇的節點是否有 `disktype=ssd` 標籤：

   ```shell
   kubectl get nodes --show-labels
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似如下：

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
   在前面的輸出中，你可以看到 `worker0` 節點有 `disktype=ssd` 標籤。

<!--
## Create a pod that gets scheduled to your chosen node

This pod configuration file describes a pod that has a node selector,
`disktype: ssd`. This means that the pod will get scheduled on a node that has
a `disktype=ssd` label.
-->
## 建立一個排程到你選擇的節點的 pod

此 Pod 配置檔案描述了一個擁有節點選擇器 `disktype: ssd` 的 Pod。這表明該 Pod 將被排程到
有 `disktype=ssd` 標籤的節點。

{{< codenew file="pods/pod-nginx.yaml" >}}

<!--
1. Use the configuration file to create a pod that will get scheduled on your
   chosen node:
-->
1. 使用該配置檔案去建立一個 pod，該 pod 將被排程到你選擇的節點上：

   ```shell
   kubectl create -f https://k8s.io/examples/pods/pod-nginx.yaml
   ```

<!--
1. Verify that the pod is running on your chosen node:
-->
2. 驗證 pod 是不是執行在你選擇的節點上：

   ```shell
   kubectl get pods --output=wide
   ```

   <!-- The output is similar to this: -->
   輸出類似如下：

   ```
   NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
   nginx    1/1       Running   0          13s    10.200.0.4   worker0
   ```

## {{% heading "whatsnext" %}}

<!--
Learn more about
[labels and selectors](/docs/concepts/overview/working-with-objects/labels/).
-->
進一步瞭解[標籤和選擇器](/zh-cn/docs/concepts/overview/working-with-objects/labels/)

