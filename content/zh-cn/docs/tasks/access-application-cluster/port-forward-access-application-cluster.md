---
title: 使用端口转发来访问集群中的应用
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
本文展示如何使用 `kubectl port-forward` 连接到在 Kubernetes 集群中运行的 MongoDB 服务。
这种类型的连接对数据库调试很有用。

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
<!--
* Install [MongoDB Shell](https://www.mongodb.com/try/download/shell).
-->
* 安装 [MongoDB Shell](https://www.mongodb.com/try/download/shell)。

<!-- steps -->

<!--
## Creating MongoDB deployment and service

1. Create a Deployment that runs MongoDB:
-->
## 创建 MongoDB Deployment 和服务   {#creating-mongodb-deployment-and-service}

1. 创建一个运行 MongoDB 的 Deployment：

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-deployment.yaml
   ```

   <!--
   The output of a successful command verifies that the deployment was created:
   -->
   成功执行的命令的输出可以证明创建了 Deployment：

   ```
   deployment.apps/mongo created
   ```

   <!--
   View the pod status to check that it is ready:
   -->
   查看 Pod 状态，检查其是否准备就绪：

   ```shell
   kubectl get pods
   ```

   <!--
   The output displays the pod created:
   -->
   输出显示创建的 Pod：

   ```
   NAME                     READY   STATUS    RESTARTS   AGE
   mongo-75f59d57f4-4nd6q   1/1     Running   0          2m4s
   ```

   <!--
   View the Deployment's status:
   -->
   查看 Deployment 状态：

   ```shell
   kubectl get deployment
   ```

   <!--
   The output displays that the Deployment was created:
   -->
   输出显示创建的 Deployment：

   ```
   NAME    READY   UP-TO-DATE   AVAILABLE   AGE
   mongo   1/1     1            1           2m21s
   ```

   <!--
   The Deployment automatically manages a ReplicaSet.
   View the ReplicaSet status using:
   -->
   该 Deployment 自动管理一个 ReplicaSet。查看该 ReplicaSet 的状态：

   ```shell
   kubectl get replicaset
   ```

   <!--
   The output displays that the ReplicaSet was created:
   -->
   输出显示 ReplicaSet 已被创建：

   ```
   NAME               DESIRED   CURRENT   READY   AGE
   mongo-75f59d57f4   1         1         1       3m12s
   ```

<!--
2. Create a Service to expose MongoDB on the network:
-->
2. 创建一个在网络上公开的 MongoDB 服务：

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-service.yaml
   ```

   <!--
   The output of a successful command verifies that the Service was created:
   -->
   成功执行的命令的输出可以证明 Service 已经被创建：

   ```
   service/mongo created
   ```

   <!--
   Check the Service created:
   -->
   检查所创建的 Service：

   ```shell
   kubectl get service mongo
   ```

   <!--   
   The output displays the service created:
   -->
   输出显示已被创建的 Service：

   ```
   NAME    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
   mongo   ClusterIP   10.96.41.183   <none>        27017/TCP   11s
   ```

<!--
3. Verify that the MongoDB server is running in the Pod, and listening on port 27017:
-->
3. 验证 MongoDB 服务是否运行在 Pod 中并且在监听 27017 端口：

   <!--
   ```shell
   # Change mongo-75f59d57f4-4nd6q to the name of the Pod
   kubectl get pod mongo-75f59d57f4-4nd6q --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
   ```
   -->
   ```shell
   # 将 mongo-75f59d57f4-4nd6q 改为 Pod 的名称
   kubectl get pod mongo-75f59d57f4-4nd6q --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
   ```

   <!--
   The output displays the port for MongoDB in that Pod:
   -->
   输出应该显示对应 Pod 中 MongoDB 的端口：

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
## 转发一个本地端口到 Pod 端口   {#forward-a-local-port-to-a-port-on-the-pod}

1. `kubectl port-forward` 允许使用资源名称
   （例如 Pod 名称）来选择匹配的 Pod 来进行端口转发。

   <!--
   ```shell
   # Change mongo-75f59d57f4-4nd6q to the name of the Pod
   kubectl port-forward mongo-75f59d57f4-4nd6q 28015:27017
   ```
   -->
   ```shell
   # 将 mongo-75f59d57f4-4nd6q 改为 Pod 的名称
   kubectl port-forward mongo-75f59d57f4-4nd6q 28015:27017
   ```

   <!--
   which is the same as
   -->
   这相当于

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
   以上所有命令都有效。输出类似于：

   ```
   Forwarding from 127.0.0.1:28015 -> 27017
   Forwarding from [::1]:28015 -> 27017
   ```

   {{< note >}}
   <!--
   `kubectl port-forward` does not return. To continue with the exercises, you will need to open another terminal.
   -->
   `kubectl port-forward` 不会返回。你需要打开另一个终端来继续这个练习。
   {{< /note >}}


<!--
2. Start the MongoDB command line interface:
-->
2. 启动 MongoDB 命令行接口：

   ```shell
   mongosh --port 28015
   ```

<!--
3. At the MongoDB command line prompt, enter the `ping` command:
-->
3. 在 MongoDB 命令行提示符下，输入 `ping` 命令：

   ```
   db.runCommand( { ping: 1 } )
   ```

   <!--
   A successful ping request returns:
   -->
   成功的 ping 请求应该返回：

   ```
   { ok: 1 }
   ```

<!--
### Optionally let _kubectl_ choose the local port {#let-kubectl-choose-local-port}
-->
### （可选操作）让 _kubectl_ 来选择本地端口 {#let-kubectl-choose-local-port}

<!--
If you don't need a specific local port, you can let `kubectl` choose and allocate 
the local port and thus relieve you from having to manage local port conflicts, with 
the slightly simpler syntax:
-->
如果你不需要指定特定的本地端口，你可以让 `kubectl` 来选择和分配本地端口，
这样你就不需要管理本地端口冲突。该命令使用稍微不同的语法：

```shell
kubectl port-forward deployment/mongo :27017
```

<!--
The `kubectl` tool finds a local port number that is not in use (avoiding low ports numbers,
because these might be used by other applications). The output is similar to:
-->
`kubectl` 工具会找到一个未被使用的本地端口号（避免使用低段位的端口号，
因为他们可能会被其他应用程序使用）。输出类似于：

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
## 讨论  {#discussion}

与本地 28015 端口建立的连接将被转发到运行 MongoDB 服务器的 Pod 的 27017 端口。
通过此连接，你可以使用本地工作站来调试在 Pod 中运行的数据库。

{{< note >}}
<!--
`kubectl port-forward` is implemented for TCP ports only.
The support for UDP protocol is tracked in
[issue 47862](https://github.com/kubernetes/kubernetes/issues/47862).
-->
`kubectl port-forward` 仅实现了 TCP 端口 支持。
在 [issue 47862](https://github.com/kubernetes/kubernetes/issues/47862)
中跟踪了对 UDP 协议的支持。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
Learn more about [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward).
-->
进一步了解 [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward)。

