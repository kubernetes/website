---
title: 使用端口轉發來訪問叢集中的應用
content_type: task
weight: 40
min-kubernetes-server-version: v1.10
---

<!--
title: Use Port Forwarding to Access Applications in a Cluster
content_type: task
weight: 40
min-kubernetes-server-version: v1.10
-->

<!-- overview -->
<!--
This page shows how to use `kubectl port-forward` to connect to a MongoDB
server running in a Kubernetes cluster. This type of connection can be useful
for database debugging.
-->
本文展示如何使用 `kubectl port-forward` 連接到在 Kubernetes 叢集中運行的 MongoDB 服務。
這種類型的連接對資料庫調試很有用。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
<!--
* Install [MongoDB Shell](https://www.mongodb.com/try/download/shell).
-->
* 安裝 [MongoDB Shell](https://www.mongodb.com/try/download/shell)。

<!-- steps -->

<!--
## Creating MongoDB deployment and service

1. Create a Deployment that runs MongoDB:
-->
## 創建 MongoDB Deployment 和服務   {#creating-mongodb-deployment-and-service}

1. 創建一個運行 MongoDB 的 Deployment：

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-deployment.yaml
   ```

   <!--
   The output of a successful command verifies that the deployment was created:
   -->
   成功執行的命令的輸出可以證明創建了 Deployment：

   ```
   deployment.apps/mongo created
   ```

   <!--
   View the pod status to check that it is ready:
   -->
   查看 Pod 狀態，檢查其是否準備就緒：

   ```shell
   kubectl get pods
   ```

   <!--
   The output displays the pod created:
   -->
   輸出顯示創建的 Pod：

   ```
   NAME                     READY   STATUS    RESTARTS   AGE
   mongo-75f59d57f4-4nd6q   1/1     Running   0          2m4s
   ```

   <!--
   View the Deployment's status:
   -->
   查看 Deployment 狀態：

   ```shell
   kubectl get deployment
   ```

   <!--
   The output displays that the Deployment was created:
   -->
   輸出顯示創建的 Deployment：

   ```
   NAME    READY   UP-TO-DATE   AVAILABLE   AGE
   mongo   1/1     1            1           2m21s
   ```

   <!--
   The Deployment automatically manages a ReplicaSet.
   View the ReplicaSet status using:
   -->
   該 Deployment 自動管理一個 ReplicaSet。查看該 ReplicaSet 的狀態：

   ```shell
   kubectl get replicaset
   ```

   <!--
   The output displays that the ReplicaSet was created:
   -->
   輸出顯示 ReplicaSet 已被創建：

   ```
   NAME               DESIRED   CURRENT   READY   AGE
   mongo-75f59d57f4   1         1         1       3m12s
   ```

<!--
2. Create a Service to expose MongoDB on the network:
-->
2. 創建一個在網路上公開的 MongoDB 服務：

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-service.yaml
   ```

   <!--
   The output of a successful command verifies that the Service was created:
   -->
   成功執行的命令的輸出可以證明 Service 已經被創建：

   ```
   service/mongo created
   ```

   <!--
   Check the Service created:
   -->
   檢查所創建的 Service：

   ```shell
   kubectl get service mongo
   ```

   <!--   
   The output displays the service created:
   -->
   輸出顯示已被創建的 Service：

   ```
   NAME    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
   mongo   ClusterIP   10.96.41.183   <none>        27017/TCP   11s
   ```

<!--
3. Verify that the MongoDB server is running in the Pod, and listening on port 27017:
-->
3. 驗證 MongoDB 服務是否運行在 Pod 中並且在監聽 27017 端口：

   <!--
   ```shell
   # Change mongo-75f59d57f4-4nd6q to the name of the Pod
   kubectl get pod mongo-75f59d57f4-4nd6q --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
   ```
   -->
   ```shell
   # 將 mongo-75f59d57f4-4nd6q 改爲 Pod 的名稱
   kubectl get pod mongo-75f59d57f4-4nd6q --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
   ```

   <!--
   The output displays the port for MongoDB in that Pod:
   -->
   輸出應該顯示對應 Pod 中 MongoDB 的端口：

   ```
   27017
   ```

   <!--
   27017 is the official TCP port for MongoDB.
   -->
   27017 是 MongoDB 的官方 TCP 端口。

<!--
## Forward a local port to a port on the Pod

1. `kubectl port-forward` allows using resource name, such as a pod name, to select a matching pod to port forward to.
-->
## 轉發一個本地端口到 Pod 端口   {#forward-a-local-port-to-a-port-on-the-pod}

1. `kubectl port-forward` 允許使用資源名稱
   （例如 Pod 名稱）來選擇匹配的 Pod 來進行端口轉發。

   <!--
   ```shell
   # Change mongo-75f59d57f4-4nd6q to the name of the Pod
   kubectl port-forward mongo-75f59d57f4-4nd6q 28015:27017
   ```
   -->
   ```shell
   # 將 mongo-75f59d57f4-4nd6q 改爲 Pod 的名稱
   kubectl port-forward mongo-75f59d57f4-4nd6q 28015:27017
   ```

   <!--
   which is the same as
   -->
   這相當於

   ```shell
   kubectl port-forward pods/mongo-75f59d57f4-4nd6q 28015:27017
   ```

   <!-- or -->
   或者

   ```shell
   kubectl port-forward deployment/mongo 28015:27017
   ```

   <!-- or -->
   或者

   ```shell
   kubectl port-forward replicaset/mongo-75f59d57f4 28015:27017
   ```

   <!-- or -->
   或者

   ```shell
   kubectl port-forward service/mongo 28015:27017
   ```

   <!--
   Any of the above commands works. The output is similar to this:
   -->
   以上所有命令都有效。輸出類似於：

   ```
   Forwarding from 127.0.0.1:28015 -> 27017
   Forwarding from [::1]:28015 -> 27017
   ```

   {{< note >}}
   <!--
   `kubectl port-forward` does not return. To continue with the exercises, you will need to open another terminal.
   -->
   `kubectl port-forward` 不會返回。你需要打開另一個終端來繼續這個練習。
   {{< /note >}}


<!--
2. Start the MongoDB command line interface:
-->
2. 啓動 MongoDB 命令列介面：

   ```shell
   mongosh --port 28015
   ```

<!--
3. At the MongoDB command line prompt, enter the `ping` command:
-->
3. 在 MongoDB 命令列提示符下，輸入 `ping` 命令：

   ```
   db.runCommand( { ping: 1 } )
   ```

   <!--
   A successful ping request returns:
   -->
   成功的 ping 請求應該返回：

   ```
   { ok: 1 }
   ```

<!--
### Optionally let _kubectl_ choose the local port {#let-kubectl-choose-local-port}
-->
### （可選操作）讓 _kubectl_ 來選擇本地端口 {#let-kubectl-choose-local-port}

<!--
If you don't need a specific local port, you can let `kubectl` choose and allocate 
the local port and thus relieve you from having to manage local port conflicts, with 
the slightly simpler syntax:
-->
如果你不需要指定特定的本地端口，你可以讓 `kubectl` 來選擇和分配本地端口，
這樣你就不需要管理本地端口衝突。該命令使用稍微不同的語法：

```shell
kubectl port-forward deployment/mongo :27017
```

<!--
The `kubectl` tool finds a local port number that is not in use (avoiding low ports numbers,
because these might be used by other applications). The output is similar to:
-->
`kubectl` 工具會找到一個未被使用的本地端口號（避免使用低段位的端口號，
因爲他們可能會被其他應用程式使用）。輸出類似於：

```
Forwarding from 127.0.0.1:63753 -> 27017
Forwarding from [::1]:63753 -> 27017
```

<!-- discussion -->

<!--
## Discussion

Connections made to local port 28015 are forwarded to port 27017 of the Pod that
is running the MongoDB server. With this connection in place, you can use your
local workstation to debug the database that is running in the Pod.
-->
## 討論  {#discussion}

與本地 28015 端口建立的連接將被轉發到運行 MongoDB 伺服器的 Pod 的 27017 端口。
通過此連接，你可以使用本地工作站來調試在 Pod 中運行的資料庫。

{{< note >}}
<!--
`kubectl port-forward` is implemented for TCP ports only.
The support for UDP protocol is tracked in
[issue 47862](https://github.com/kubernetes/kubernetes/issues/47862).
-->
`kubectl port-forward` 僅實現了 TCP 端口 支持。
在 [issue 47862](https://github.com/kubernetes/kubernetes/issues/47862)
中跟蹤了對 UDP 協議的支持。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
Learn more about [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward).
-->
進一步瞭解 [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward)。

