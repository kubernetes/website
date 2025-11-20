---
title: 將 Pod 分配給節點
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
此頁面顯示如何將 Kubernetes Pod 指派給 Kubernetes 叢集中的特定節點。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Add a label to a node

1. List the {{< glossary_tooltip term_id="node" text="nodes" >}} in your cluster, along with their labels:
-->
## 給節點添加標籤  {#add-a-label-to-a-node}

1. 列出你的叢集中的{{< glossary_tooltip term_id="node" text="節點" >}}，
   包括這些節點上的標籤：

   ```shell
   kubectl get nodes --show-labels
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似如下：

   ```shell
   NAME      STATUS    ROLES    AGE     VERSION        LABELS
   worker0   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker0
   worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
   worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
   ```

<!--
1. Choose one of your nodes, and add a label to it:
-->
2. 從你的節點中選擇一個，爲它添加標籤：

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
3. 驗證你選擇的節點確實帶有 `disktype=ssd` 標籤：

   ```shell
   kubectl get nodes --show-labels
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似如下：

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
   在前面的輸出中，你可以看到 `worker0` 節點有 `disktype=ssd` 標籤。

<!--
## Create a pod that gets scheduled to your chosen node

This pod configuration file describes a pod that has a node selector,
`disktype: ssd`. This means that the pod will get scheduled on a node that has
a `disktype=ssd` label.
-->
## 創建一個將被調度到你選擇的節點的 Pod  {#create-a-pod-scheduled-to-chosen-node}

此 Pod 設定檔案描述了一個擁有節點選擇器 `disktype: ssd` 的 Pod。這表明該 Pod
將被調度到有 `disktype=ssd` 標籤的節點。

{{% code_sample file="pods/pod-nginx.yaml" %}}

<!--
1. Use the configuration file to create a pod that will get scheduled on your
   chosen node:
-->
1. 使用該設定檔案創建一個 Pod，該 Pod 將被調度到你選擇的節點上：

   ```shell
   kubectl create -f https://k8s.io/examples/pods/pod-nginx.yaml
   ```

<!--
1. Verify that the pod is running on your chosen node:
-->
2. 驗證 Pod 確實運行在你選擇的節點上：

   ```shell
   kubectl get pods --output=wide
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似如下：

   ```shell
   NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
   nginx    1/1       Running   0          13s    10.200.0.4   worker0
   ```

<!--
## Create a pod that gets scheduled to specific node

You can also schedule a pod to one specific node via setting `nodeName`.
-->
## 創建一個會被調度到特定節點上的 Pod  {#create-a-pod-scheduled-to-specific-node}

你也可以通過設置 `nodeName` 將某個 Pod 調度到特定的節點。

{{% code_sample file="pods/pod-nginx-specific-node.yaml" %}}

<!--
Use the configuration file to create a pod that will get scheduled on `foo-node` only.
-->
使用此設定檔案來創建一個 Pod，該 Pod 將只能被調度到 `foo-node` 節點。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [labels and selectors](/docs/concepts/overview/working-with-objects/labels/).
* Learn more about [nodes](/docs/concepts/architecture/nodes/).
-->
* 進一步瞭解[標籤和選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/)
* 進一步瞭解[節點](/zh-cn/docs/concepts/architecture/nodes/)
