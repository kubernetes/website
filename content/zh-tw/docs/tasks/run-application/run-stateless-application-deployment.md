---
title: 使用 Deployment 運行一個無狀態應用
min-kubernetes-server-version: v1.9
content_type: tutorial
weight: 10
---

<!-- overview -->

<!--
This page shows how to run an application using a Kubernetes Deployment object.
-->
本文介紹如何通過 Kubernetes Deployment 對象去運行一個應用。

## {{% heading "objectives" %}}

<!--
- Create an nginx deployment.
- Use kubectl to list information about the deployment.
- Update the deployment.
-->
- 創建一個 nginx Deployment。
- 使用 kubectl 列舉該 Deployment 的相關信息。
- 更新該 Deployment。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- lessoncontent -->

<!--
## Creating and exploring an nginx deployment

You can run an application by creating a Kubernetes Deployment object, and you
can describe a Deployment in a YAML file. For example, this YAML file describes
a Deployment that runs the nginx:1.14.2 Docker image:
-->
## 創建並瞭解一個 nginx Deployment

你可以通過創建一個 Kubernetes Deployment 對象來運行一個應用, 且你可以在一個
YAML 文件中描述 Deployment。例如，下面這個 YAML 文件描述了一個運行 nginx:1.14.2
Docker 映像檔的 Deployment：

{{% code_sample file="application/deployment.yaml" %}}

<!--
1. Create a Deployment based on the YAML file:
-->
1. 通過 YAML 文件創建一個 Deployment：

   ```shell
   kubectl apply -f https://k8s.io/examples/application/deployment.yaml
   ```

<!--
1. Display information about the Deployment:
-->
2. 顯示該 Deployment 的相關信息：

   ```shell
   kubectl describe deployment nginx-deployment
   ```

   <!-- 
   The output is similar to this:
   -->
   輸出類似於這樣：

   ```
   Name:     nginx-deployment
   Namespace:    default
   CreationTimestamp:  Tue, 30 Aug 2016 18:11:37 -0700
   Labels:     app=nginx
   Annotations:    deployment.kubernetes.io/revision=1
   Selector:   app=nginx
   Replicas:   2 desired | 2 updated | 2 total | 2 available | 0 unavailable
   StrategyType:   RollingUpdate
   MinReadySeconds:  0
   RollingUpdateStrategy:  1 max unavailable, 1 max surge
   Pod Template:
     Labels:       app=nginx
     Containers:
       nginx:
       Image:              nginx:1.14.2
       Port:               80/TCP
       Environment:        <none>
       Mounts:             <none>
     Volumes:              <none>
   Conditions:
     Type          Status  Reason
     ----          ------  ------
     Available     True    MinimumReplicasAvailable
     Progressing   True    NewReplicaSetAvailable
   OldReplicaSets:   <none>
   NewReplicaSet:    nginx-deployment-1771418926 (2/2 replicas created)
   No events.
   ```

<!--
1. List the Pods created by the deployment:
-->
3. 列出該 Deployment 創建的 Pod：

   ```shell
   kubectl get pods -l app=nginx
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似於這樣：

   ```
   NAME                                READY     STATUS    RESTARTS   AGE
   nginx-deployment-1771418926-7o5ns   1/1       Running   0          16h
   nginx-deployment-1771418926-r18az   1/1       Running   0          16h
   ```

<!--
1. Display information about a Pod:
-->
4. 展示某一個 Pod 信息：

   ```shell
   kubectl describe pod <pod-name>
   ```

   <!--
   where `<pod-name>` is the name of one of your Pods.
   -->
   這裏的 `<pod-name>` 是某一 Pod 的名稱。

<!--
## Updating the deployment

You can update the deployment by applying a new YAML file. This YAML file
specifies that the deployment should be updated to use nginx 1.16.1.
-->
## 更新 Deployment

你可以通過應用一個新的 YAML 文件來更新 Deployment。下面的 YAML 文件指定該
Deployment 映像檔更新爲 nginx 1.16.1。

{{% code_sample file="application/deployment-update.yaml" %}}

<!--
1. Apply the new YAML file:
-->
1. 應用新的 YAML：

   ```shell
   kubectl apply -f https://k8s.io/examples/application/deployment-update.yaml
   ```

<!--
1. Watch the deployment create pods with new names and delete the old pods:
-->
2. 查看該 Deployment 以新的名稱創建 Pod 同時刪除舊的 Pod：

   ```shell
   kubectl get pods -l app=nginx
   ```

<!--
## Scaling the application by increasing the replica count

You can increase the number of Pods in your Deployment by applying a new YAML
file. This YAML file sets `replicas` to 4, which specifies that the Deployment
should have four Pods:
-->
## 通過增加副本數來擴縮應用

你可以通過應用新的 YAML 文件來增加 Deployment 中 Pod 的數量。
下面的 YAML 文件將 `replicas` 設置爲 4，指定該 Deployment 應有 4 個 Pod：

{{% code_sample file="application/deployment-scale.yaml" %}}

<!--
1. Apply the new YAML file:
-->
1. 應用新的 YAML 文件：

   ```shell
   kubectl apply -f https://k8s.io/examples/application/deployment-scale.yaml
   ```

<!--
1. Verify that the Deployment has four Pods:
-->
2. 驗證該 Deployment 有 4 個 Pod：

   ```shell
   kubectl get pods -l app=nginx
   ```

   <!--
   The output is similar to this:
   -->
   輸出的結果類似於：

   ```
   NAME                               READY     STATUS    RESTARTS   AGE
   nginx-deployment-148880595-4zdqq   1/1       Running   0          25s
   nginx-deployment-148880595-6zgi1   1/1       Running   0          25s
   nginx-deployment-148880595-fxcez   1/1       Running   0          2m
   nginx-deployment-148880595-rwovn   1/1       Running   0          2m
   ```

<!--
## Deleting a deployment

Delete the deployment by name:
-->
## 刪除 Deployment

基於名稱刪除 Deployment：

```shell
kubectl delete deployment nginx-deployment
```

<!--
## ReplicationControllers -- the Old Way

The preferred way to create a replicated application is to use a Deployment,
which in turn uses a ReplicaSet. Before the Deployment and ReplicaSet were
added to Kubernetes, replicated applications were configured using a
[ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/).
-->
## ReplicationController —— 舊的方式

創建一個多副本應用首選方法是使用 Deployment，該 Deployment 內部將輪流使用 ReplicaSet。
在 Deployment 和 ReplicaSet 被引入到 Kubernetes 之前，多副本應用通過
[ReplicationController](/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/)
來設定。

## {{% heading "whatsnext" %}}

<!--
- Learn more about [Deployment objects](/docs/concepts/workloads/controllers/deployment/).
-->
- 進一步瞭解 [Deployment 對象](/zh-cn/docs/concepts/workloads/controllers/deployment/)。
