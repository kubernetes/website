---
title: 使用埠轉發來訪問叢集中的應用
content_type: task
weight: 40
---

<!--
title: Use Port Forwarding to Access Applications in a Cluster
content_type: task
weight: 40
-->

<!-- overview -->
<!--
This page shows how to use `kubectl port-forward` to connect to a MongoDB
server running in a Kubernetes cluster. This type of connection can be useful
for database debugging.
-->
本文展示如何使用 `kubectl port-forward` 連線到在 Kubernetes 叢集中
執行的 MongoDB 服務。這種型別的連線對資料庫除錯很有用。

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
## 建立 MongoDB deployment 和服務

1. 建立一個執行 MongoDB 的 deployment：

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-deployment.yaml
   ```

   <!--
   The output of a successful command verifies that the deployment was created:
   -->
   成功執行的命令的輸出可以證明建立了 Deployment：

   ```
   deployment.apps/mongo created
   ```

   <!--
   View the pod status to check that it is ready:
   -->
   檢視 pod 狀態，檢查其是否準備就緒：

   ```shell
   kubectl get pods
   ```

   <!--
   The output displays the pod created:
   -->
   輸出顯示建立的 pod：

   ```
   NAME                     READY   STATUS    RESTARTS   AGE
   mongo-75f59d57f4-4nd6q   1/1     Running   0          2m4s
   ```

   <!--
   View the Deployment's status:
   -->
   檢視 Deployment 狀態：

   ```shell
   kubectl get deployment
   ```

   <!--
   The output displays that the Deployment was created:
   -->
   輸出顯示建立的 Deployment：

   ```
   NAME    READY   UP-TO-DATE   AVAILABLE   AGE
   mongo   1/1     1            1           2m21s
   ```

   <!--
   The Deployment automatically manages a ReplicaSet.
   View the ReplicaSet status using:
   -->
   該 Deployment 自動管理一個 ReplicaSet。檢視該 ReplicaSet 的狀態：

   ```shell
   kubectl get replicaset
   ```

   <!--
   The output displays that the ReplicaSet was created:
   -->
   輸出顯示 ReplicaSet 已被建立：

   ```
   NAME               DESIRED   CURRENT   READY   AGE
   mongo-75f59d57f4   1         1         1       3m12s
   ```

<!--
2. Create a Service to expose MongoDB on the network:
-->
2. 建立一個在網路上公開的 MongoDB 服務：

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-service.yaml
   ```

   <!--
   The output of a successful command verifies that the Service was created:
   -->
   成功執行的命令的輸出可以證明 Service 已經被建立：

   ```
   service/mongo created
   ```

   <!--
   Check the Service created:
   -->
   檢查所建立的 Service：

   ```shell
   kubectl get service mongo
   ```

   <!--   
   The output displays the service created:
   -->
   輸出顯示已被建立的 Service：

   ```
   NAME    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
   mongo   ClusterIP   10.96.41.183   <none>        27017/TCP   11s
   ```

<!--
3. Verify that the MongoDB server is running in the Pod, and listening on port 27017:
-->
3. 驗證 MongoDB 服務是否執行在 Pod 中並且在 27017 埠上監聽：

   <!--
   ```shell
   # Change mongo-75f59d57f4-4nd6q to the name of the Pod
   kubectl get pod mongo-75f59d57f4-4nd6q --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
   ```
   -->
   ```shell
   # 將 mongo-75f59d57f4-4nd6q 改為 Pod 的名稱
   kubectl get pod mongo-75f59d57f4-4nd6q --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
   ```

   <!--
   The output displays the port for MongoDB in that Pod:
   -->
   輸出應該顯示對應 Pod 中 MongoDB 的埠：

   ```
   27017
   ```

   <!--
   27017 is the TCP port allocated to MongoDB on the internet.
   -->
   27017 是分配給 MongoDB 的網際網路 TCP 埠。

<!--
## Forward a local port to a port on the Pod

1. `kubectl port-forward` allows using resource name, such as a pod name, to select a matching pod to port forward to.
-->
## 轉發一個本地埠到 Pod 埠

1. `kubectl port-forward` 允許使用資源名稱
   （例如 pod 名稱）來選擇匹配的 pod 來進行埠轉發。

   <!--
   ```shell
   # Change mongo-75f59d57f4-4nd6q to the name of the Pod
   kubectl port-forward mongo-75f59d57f4-4nd6q 28015:27017
   ```
   -->
   ```shell
   # 將 mongo-75f59d57f4-4nd6q 改為 Pod 的名稱
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
   `kubectl port-forward` 不會返回。你需要開啟另一個終端來繼續這個練習。
   {{< /note >}}


<!--
2. Start the MongoDB command line interface:
-->
2. 啟動 MongoDB 命令列介面：

   ```shell
   mongosh --port 28015
   ```

<!--
3.  At the MongoDB command line prompt, enter the `ping` command:
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
### （可選操作）讓 _kubectl_ 來選擇本地埠 {#let-kubectl-choose-local-port}

<!--
If you don't need a specific local port, you can let `kubectl` choose and allocate 
the local port and thus relieve you from having to manage local port conflicts, with 
the slightly simpler syntax:
-->
如果你不需要指定特定的本地埠，你可以讓 `kubectl` 來選擇和分配本地埠，
這樣你就不需要管理本地埠衝突。該命令使用稍微不同的語法：

```shell
kubectl port-forward deployment/mongo :27017
```

<!--
The `kubectl` tool finds a local port number that is not in use (avoiding low ports numbers,
because these might be used by other applications). The output is similar to:
-->
`kubectl` 工具會找到一個未被使用的本地埠號（避免使用低段位的埠號，
因為他們可能會被其他應用程式使用）。輸出類似於：

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

與本地 28015 埠建立的連線將被轉發到執行 MongoDB 伺服器的 Pod 的 27017 埠。
透過此連線，你可以使用本地工作站來除錯在 Pod 中執行的資料庫。

{{< note >}}
<!--
`kubectl port-forward` is implemented for TCP ports only.
The support for UDP protocol is tracked in
[issue 47862](https://github.com/kubernetes/kubernetes/issues/47862).
-->
`kubectl port-forward` 僅實現了 TCP 埠 支援。
在 [issue 47862](https://github.com/kubernetes/kubernetes/issues/47862)
中跟蹤了對 UDP 協議的支援。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
Learn more about [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward).
-->
進一步瞭解 [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward)。

