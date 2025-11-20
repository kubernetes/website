---
title: "示例：使用 StatefulSet 部署 Cassandra"
content_type: tutorial
weight: 30
---

<!--
title: "Example: Deploying Cassandra with a StatefulSet"
reviewers:
- ahmetb
content_type: tutorial
weight: 30
-->

<!-- overview -->
<!--
This tutorial shows you how to run [Apache Cassandra](https://cassandra.apache.org/) on Kubernetes.
Cassandra, a database, needs persistent storage to provide data durability (application _state_).
In this example, a custom Cassandra seed provider lets the database discover new Cassandra instances as they join the Cassandra cluster.
-->
本教程描述瞭如何在 Kubernetes 上運行 [Apache Cassandra](https://cassandra.apache.org/)。
資料庫 Cassandra 需要永久性儲存提供資料持久性（應用**狀態**）。
在此示例中，自定義 Cassandra seed provider 使資料庫在接入 Cassandra 叢集時能夠發現新的 Cassandra 實例。

<!--
*StatefulSets* make it easier to deploy stateful applications into your Kubernetes cluster.
For more information on the features used in this tutorial, see
[StatefulSet](/docs/concepts/workloads/controllers/statefulset/).
-->
使用**StatefulSet**可以更輕鬆地將有狀態的應用程式部署到你的 Kubernetes 叢集中。
有關本教程中使用的功能的更多資訊，
請參閱 [StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/)。

{{< note >}}
<!--
Cassandra and Kubernetes both use the term _node_ to mean a member of a cluster. In this
tutorial, the Pods that belong to the StatefulSet are Cassandra nodes and are members
of the Cassandra cluster (called a _ring_). When those Pods run in your Kubernetes cluster,
the Kubernetes control plane schedules those Pods onto Kubernetes
{{< glossary_tooltip text="Nodes" term_id="node" >}}.
-->
Cassandra 和 Kubernetes 都使用術語**節點**來表示叢集的成員。
在本教程中，屬於 StatefulSet 的 Pod 是 Cassandra 節點，並且是 Cassandra 叢集的成員（稱爲 **ring**）。
當這些 Pod 在你的 Kubernetes 叢集中運行時，Kubernetes 控制平面會將這些 Pod 調度到 Kubernetes 的
{{< glossary_tooltip text="節點" term_id="node" >}}上。

<!--
When a Cassandra node starts, it uses a _seed list_ to bootstrap discovery of other
nodes in the ring.
This tutorial deploys a custom Cassandra seed provider that lets the database discover
new Cassandra Pods as they appear inside your Kubernetes cluster.
-->
當 Cassandra 節點啓動時，使用 **seed 列表**來引導發現 ring 中的其他節點。
本教程部署了一個自定義的 Cassandra seed provider，
使資料庫可以發現 Kubernetes 叢集中出現的新的 Cassandra Pod。
{{< /note >}}

## {{% heading "objectives" %}}

<!--
* Create and validate a Cassandra headless {{< glossary_tooltip text="Service" term_id="service" >}}.
* Use a {{< glossary_tooltip term_id="StatefulSet" >}} to create a Cassandra ring.
* Validate the StatefulSet.
* Modify the StatefulSet.
* Delete the StatefulSet and its {{< glossary_tooltip text="Pods" term_id="pod" >}}.
-->
* 創建並驗證 Cassandra 無頭（headless）{{< glossary_tooltip text="Service" term_id="service" >}}。
* 使用 {{< glossary_tooltip term_id="StatefulSet" >}} 創建一個 Cassandra ring。
* 驗證 StatefulSet。
* 修改 StatefulSet。
* 刪除 StatefulSet 及其 {{< glossary_tooltip text="Pod" term_id="pod" >}}。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
To complete this tutorial, you should already have a basic familiarity with
{{< glossary_tooltip text="Pods" term_id="pod" >}},
{{< glossary_tooltip text="Services" term_id="service" >}}, and
{{< glossary_tooltip text="StatefulSets" term_id="StatefulSet" >}}.
-->
要完成本教程，你應該已經熟悉 {{< glossary_tooltip text="Pod" term_id="pod" >}}、
{{< glossary_tooltip text="Service" term_id="service" >}} 和
{{< glossary_tooltip text="StatefulSet" term_id="StatefulSet" >}}。

<!--
### Additional Minikube setup instructions

{{< caution >}}
[Minikube](https://minikube.sigs.k8s.io/docs/) defaults to 2048MB of memory and 2 CPU.
Running Minikube with the default resource configuration results in insufficient resource
errors during this tutorial. To avoid these errors, start Minikube with the following settings:
{{< /caution >}}
-->
### 額外的 Minikube 設置說明

{{< caution >}}
[Minikube](https://minikube.sigs.k8s.io/docs/) 預設需要 2048MB 內存和 2 個 CPU。
在本教程中，使用預設資源設定運行 Minikube 會出現資源不足的錯誤。爲避免這些錯誤，請使用以下設置啓動 Minikube：

```shell
minikube start --memory 5120 --cpus=4
```

{{< /caution >}}

<!-- lessoncontent -->
<!--
## Creating a headless Service for Cassandra {#creating-a-cassandra-headless-service}

In Kubernetes, a {{< glossary_tooltip text="Service" term_id="service" >}} describes a set of
{{< glossary_tooltip text="Pods" term_id="pod" >}} that perform the same task.

The following Service is used for DNS lookups between Cassandra Pods and clients within your cluster:

Create a Service to track all Cassandra StatefulSet members from the `cassandra-service.yaml` file:
-->
## 爲 Cassandra 創建無頭（headless） Services {#creating-a-cassandra-headless-service}

在 Kubernetes 中，一個 {{< glossary_tooltip text="Service" term_id="service" >}}
描述了一組執行相同任務的 {{< glossary_tooltip text="Pod" term_id="pod" >}}。

以下 Service 用於在 Cassandra Pod 和叢集中的客戶端之間進行 DNS 查找：

{{% code_sample file="application/cassandra/cassandra-service.yaml" %}}

創建一個 Service 來跟蹤 `cassandra-service.yaml` 檔案中的所有 Cassandra StatefulSet：

```shell
kubectl apply -f https://k8s.io/examples/application/cassandra/cassandra-service.yaml
```

<!--
### Validating (optional) {#validating}

Get the Cassandra Service.
-->
### 驗證(可選) {#validating}

獲取 Cassandra Service。

```shell
kubectl get svc cassandra
```

<!-- 
The response is 
-->
響應是：

```
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
cassandra   ClusterIP   None         <none>        9042/TCP   45s
```

<!--
If you don't see a Service named `cassandra`, that means creation failed. Read
[Debug Services](/docs/tasks/debug/debug-application/debug-service/)
for help troubleshooting common issues.
-->
如果沒有看到名爲 `cassandra` 的服務，則表示創建失敗。
請閱讀[調試服務](/zh-cn/docs/tasks/debug/debug-application/debug-service/)，以解決常見問題。

<!--
## Using a StatefulSet to create a Cassandra ring

The StatefulSet manifest, included below, creates a Cassandra ring that consists of three Pods.

{{< note >}}
This example uses the default provisioner for Minikube.
Please update the following StatefulSet for the cloud you are working with.
{{< /note >}}
-->
## 使用 StatefulSet 創建 Cassandra Ring

下面包含的 StatefulSet 清單創建了一個由三個 Pod 組成的 Cassandra ring。

{{< note >}}
本示例使用 Minikube 的預設設定程式。
請爲正在使用的雲更新以下 StatefulSet。
{{< /note >}}

{{% code_sample file="application/cassandra/cassandra-statefulset.yaml" %}}

<!--
Create the Cassandra StatefulSet from the `cassandra-statefulset.yaml` file:
-->
使用 `cassandra-statefulset.yaml` 檔案創建 Cassandra StatefulSet：

```shell
# 如果你能未經修改地應用 cassandra-statefulset.yaml，請使用此命令
kubectl apply -f https://k8s.io/examples/application/cassandra/cassandra-statefulset.yaml
```

<!--
If you need to modify `cassandra-statefulset.yaml` to suit your cluster, download
https://k8s.io/examples/application/cassandra/cassandra-statefulset.yaml and then apply
that manifest, from the folder you saved the modified version into:
-->
如果你爲了適合你的叢集需要修改 `cassandra-statefulset.yaml`，
下載 https://k8s.io/examples/application/cassandra/cassandra-statefulset.yaml，
然後應用修改後的清單。

```shell
# 如果使用本地的 cassandra-statefulset.yaml ，請使用此命令
kubectl apply -f cassandra-statefulset.yaml
```

<!--
## Validating the Cassandra StatefulSet

1. Get the Cassandra StatefulSet:
-->
## 驗證 Cassandra StatefulSet

1. 獲取 Cassandra StatefulSet:

   ```shell
   kubectl get statefulset cassandra
   ```
   
   <!--
   The response should be similar to:
   -->
   響應應該與此類似：

   ```
   NAME        DESIRED   CURRENT   AGE
   cassandra   3         0         13s
   ```

   <!--
   The `StatefulSet` resource deploys Pods sequentially.
   -->
   `StatefulSet` 資源會按順序部署 Pod。

<!--
1. Get the Pods to see the ordered creation status:
-->
2. 獲取 Pod 查看已排序的創建狀態：
   
   ```shell
   kubectl get pods -l="app=cassandra"
   ```

   <!--
   The response should be similar to:
   -->
   響應應該與此類似：

   ```
   NAME          READY     STATUS              RESTARTS   AGE
   cassandra-0   1/1       Running             0          1m
   cassandra-1   0/1       ContainerCreating   0          8s
   ```

   <!--
   It can take several minutes for all three Pods to deploy. Once they are deployed, the same command
   returns output similar to:
   -->
   這三個 Pod 要花幾分鐘的時間才能部署。部署之後，相同的命令將返回類似於以下的輸出：

   ```
   NAME          READY     STATUS    RESTARTS   AGE
   cassandra-0   1/1       Running   0          10m
   cassandra-1   1/1       Running   0          9m
   cassandra-2   1/1       Running   0          8m
   ```
<!--
3. Run the Cassandra [nodetool](https://cwiki.apache.org/confluence/display/CASSANDRA2/NodeTool) inside the first Pod, to
   display the status of the ring.
-->
3. 運行第一個 Pod 中的 Cassandra [nodetool](https://cwiki.apache.org/confluence/display/CASSANDRA2/NodeTool)，
   以顯示 ring 的狀態。

   ```shell
   kubectl exec -it cassandra-0 -- nodetool status
   ```

   <!--
   The response should be similar to:
   -->
   響應應該與此類似：

   ```
   Datacenter: DC1-K8Demo
   ======================
   Status=Up/Down
   |/ State=Normal/Leaving/Joining/Moving
   --  Address     Load       Tokens       Owns (effective)  Host ID                               Rack
   UN  172.17.0.5  83.57 KiB  32           74.0%             e2dd09e6-d9d3-477e-96c5-45094c08db0f  Rack1-K8Demo
   UN  172.17.0.4  101.04 KiB  32           58.8%             f89d6835-3a42-4419-92b3-0e62cae1479c  Rack1-K8Demo
   UN  172.17.0.6  84.74 KiB  32           67.1%             a6a1e8c2-3dc5-4417-b1a0-26507af2aaad  Rack1-K8Demo
   ```

<!--
## Modifying the Cassandra StatefulSet

Use `kubectl edit` to modify the size of a Cassandra StatefulSet.

1. Run the following command:
-->
## 修改 Cassandra StatefulSet

使用 `kubectl edit` 修改 Cassandra StatefulSet 的大小。

1. 運行以下命令：

   ```shell
   kubectl edit statefulset cassandra
   ```

   <!--
   This command opens an editor in your terminal. The line you need to change is the `replicas` field.
   The following sample is an excerpt of the StatefulSet file:
   -->
   此命令你的終端中打開一個編輯器。需要更改的是 `replicas` 字段。下面是 StatefulSet 檔案的片段示例：

    ```yaml
    # 請編輯以下對象。以 '#' 開頭的行將被忽略，
    # 且空文件將放棄編輯。如果保存此文件時發生錯誤，
    # 將重新打開並顯示相關故障。
    apiVersion: apps/v1
    kind: StatefulSet
    metadata:
      creationTimestamp: 2016-08-13T18:40:58Z
      generation: 1
      labels:
      app: cassandra
      name: cassandra
      namespace: default
      resourceVersion: "323"
      uid: 7a219483-6185-11e6-a910-42010a8a0fc0
    spec:
      replicas: 3
    ```

<!--
1. Change the number of replicas to 4, and then save the manifest.

   The StatefulSet now scales to run with 4 Pods.

1. Get the Cassandra StatefulSet to verify your change:
-->
2. 將副本數（replicas）更改爲 4，然後保存清單。

   StatefulSet 現在可以擴展到運行 4 個 Pod。

3. 獲取 Cassandra StatefulSet 驗證更改：

   ```shell
   kubectl get statefulset cassandra
   ```

   <!--
   The response should be similar to:
   -->
   響應應該與此類似：

   ```
   NAME        DESIRED   CURRENT   AGE
   cassandra   4         4         36m
   ```

## {{% heading "cleanup" %}}

<!--
Deleting or scaling a StatefulSet down does not delete the volumes associated with the StatefulSet.
This setting is for your safety because your data is more valuable than automatically purging all related StatefulSet resources.
-->
刪除或縮小 StatefulSet 不會刪除與 StatefulSet 關聯的卷。
這個設置是出於安全考慮，因爲你的資料比自動清除所有相關的 StatefulSet 資源更有價值。

{{< warning >}}
<!--
Depending on the storage class and reclaim policy, deleting the *PersistentVolumeClaims* may cause the associated volumes
to also be deleted. Never assume you'll be able to access data if its volume claims are deleted.
-->
根據儲存類和回收策略，刪除 **PersistentVolumeClaims** 可能導致關聯的卷也被刪除。
千萬不要認爲其容量聲明被刪除，你就能訪問資料。
{{< /warning >}}

<!--
1. Run the following commands (chained together into a single command) to delete everything in the Cassandra StatefulSet:
-->
1. 運行以下命令（連在一起成爲一個單獨的命令）刪除 Cassandra StatefulSet 中的所有內容：

   ```shell
   grace=$(kubectl get pod cassandra-0 -o=jsonpath='{.spec.terminationGracePeriodSeconds}') \
     && kubectl delete statefulset -l app=cassandra \
     && echo "Sleeping ${grace} seconds" 1>&2 \
     && sleep $grace \
     && kubectl delete persistentvolumeclaim -l app=cassandra
   ```

<!--
1. Run the following command to delete the Service you set up for Cassandra:
-->
2. 運行以下命令，刪除你爲 Cassandra 設置的 Service：

   ```shell
   kubectl delete service -l app=cassandra
   ```

<!--
## Cassandra container environment variables

The Pods in this tutorial use the [`gcr.io/google-samples/cassandra:v13`](https://github.com/kubernetes/examples/blob/master/cassandra/image/Dockerfile)
image from Google's [container registry](https://cloud.google.com/container-registry/docs/).
The Docker image above is based on [debian-base](https://github.com/kubernetes/release/tree/master/images/build/debian-base)
and includes OpenJDK 8.

This image includes a standard Cassandra installation from the Apache Debian repo.
By using environment variables you can change values that are inserted into `cassandra.yaml`.
-->
## Cassandra 容器環境變量

本教程中的 Pod 使用來自 Google [容器映像檔庫](https://cloud.google.com/container-registry/docs/)
的 [`gcr.io/google-samples/cassandra:v13`](https://github.com/kubernetes/examples/blob/master/cassandra/image/Dockerfile)
映像檔。上面的 Docker 映像檔基於 [debian-base](https://github.com/kubernetes/release/tree/master/images/build/debian-base)，
並且包含 OpenJDK 8。

該映像檔包括來自 Apache Debian 儲存庫的標準 Cassandra 安裝。
通過使用環境變量，你可以更改插入到 `cassandra.yaml` 中的值。

| 環境變量                 | 預設值           |
| ------------------------ |:---------------: |
| `CASSANDRA_CLUSTER_NAME` | `'Test Cluster'` |
| `CASSANDRA_NUM_TOKENS`   | `32`             |
| `CASSANDRA_RPC_ADDRESS`  | `0.0.0.0`        |

## {{% heading "whatsnext" %}}

<!--
* Learn how to [Scale a StatefulSet](/docs/tasks/run-application/scale-stateful-set/).
* Learn more about the [*KubernetesSeedProvider*](https://github.com/kubernetes/examples/blob/master/cassandra/java/src/main/java/io/k8s/cassandra/KubernetesSeedProvider.java)
* See more custom [Seed Provider Configurations](https://git.k8s.io/examples/cassandra/java/README.md)
-->
* 瞭解如何[擴縮 StatefulSet](/zh-cn/docs/tasks/run-application/scale-stateful-set/)。
* 瞭解有關 [**KubernetesSeedProvider**](https://github.com/kubernetes/examples/blob/master/cassandra/java/src/main/java/io/k8s/cassandra/KubernetesSeedProvider.java) 的更多資訊
* 查看更多自定義 [Seed Provider Configurations](https://git.k8s.io/examples/cassandra/java/README.md)

