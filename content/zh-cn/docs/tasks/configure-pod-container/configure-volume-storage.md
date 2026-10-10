---
title: 配置 Pod 以使用卷进行存储
content_type: task
weight: 80
---
<!--
title: Configure a Pod to Use a Volume for Storage
content_type: task
weight: 50
-->

<!-- overview -->
<!--
This page shows how to configure a Pod to use a Volume for storage.

A Container's file system lives only as long as the Container does. So when a
Container terminates and restarts, filesystem changes are lost. For more
consistent storage that is independent of the Container, you can use a
[Volume](/docs/concepts/storage/volumes/). This is especially important for stateful
applications, such as key-value stores (such as Redis) and databases.
-->
此页面展示了如何配置 Pod 以使用卷进行存储。

只要容器存在，容器的文件系统就会存在，因此当一个容器终止并重新启动，对该容器的文件系统改动将丢失。
对于独立于容器的持久化存储，你可以使用[卷](/zh-cn/docs/concepts/storage/volumes/)。
这对于有状态应用程序尤为重要，例如键值存储（如 Redis）和数据库。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Configure a volume for a Pod

In this exercise, you create a Pod that runs one Container. This Pod has a
Volume of type
[emptyDir](/docs/concepts/storage/volumes/#emptydir)
that lasts for the life of the Pod, even if the Container terminates and
restarts. Here is the configuration file for the Pod:
-->
## 为 Pod 配置卷   {#configure-a-volume-for-a-pod}

在本练习中，你将创建一个运行 Pod，该 Pod 仅运行一个容器并拥有一个类型为
[emptyDir](/zh-cn/docs/concepts/storage/volumes/#emptydir) 的卷，
在整个 Pod 生命周期中一直存在，即使 Pod 中的容器被终止和重启。以下是 Pod 的配置：

{{% code_sample file="pods/storage/redis.yaml" %}}

<!--
1. Create the Pod:
-->
1. 创建 Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/storage/redis.yaml
   ```

<!--
1. Verify that the Pod's Container is running, and then watch for changes to
   the Pod:
-->
2. 验证 Pod 中的容器是否正在运行，然后留意 Pod 的更改：

   ```shell
   kubectl get pod redis --watch
   ```

   <!--
   The output looks like this:
   -->

   输出如下：

   ```console
   NAME      READY     STATUS    RESTARTS   AGE
   redis     1/1       Running   0          13s
   ```

<!--
1. In another terminal, get a shell to the running Container:
-->
3. 在另一个终端，用 Shell 连接正在运行的容器：

   ```shell
   kubectl exec -it redis -- /bin/bash
   ```

<!--
1. In your shell, go to `/data/redis`, and then create a file:
-->
4. 在你的 Shell 中，切换到 `/data/redis` 目录下，然后创建一个文件：

   ```shell
   root@redis:/data# cd /data/redis/
   root@redis:/data/redis# echo Hello > test-file
   ```

<!--
1. In your shell, list the running processes:
-->
5. 在你的 Shell 中，列出正在运行的进程：

   ```shell
   root@redis:/data/redis# apt-get update
   root@redis:/data/redis# apt-get install procps
   root@redis:/data/redis# ps aux
   ```

   <!--
   The output is similar to this:
   -->

   输出类似于：

   ```console
   USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
   redis        1  0.1  0.1  33308  3828 ?        Ssl  00:46   0:00 redis-server *:6379
   root        12  0.0  0.0  20228  3020 ?        Ss   00:47   0:00 /bin/bash
   root        15  0.0  0.0  17500  2072 ?        R+   00:48   0:00 ps aux
   ```

<!--
1. In your shell, kill the Redis process:
-->
6. 在你的 Shell 中，结束 Redis 进程：

   ```shell
   root@redis:/data/redis# kill <pid>
   ```

   <!--
   where `<pid>` is the Redis process ID (PID).
   -->

   其中 `<pid>` 是 Redis 进程的 ID (PID)。

<!--
1. In your original terminal, watch for changes to the Redis Pod. Eventually,
   you will see something like this:
-->
7. 在你原先终端中，留意 Redis Pod 的更改。最终你将会看到和下面类似的输出：

   ```console
   NAME      READY     STATUS     RESTARTS   AGE
   redis     1/1       Running    0          13s
   redis     0/1       Completed  0         6m
   redis     1/1       Running    1         6m
   ```

<!--
At this point, the Container has terminated and restarted. This is because the
Redis Pod has a
[restartPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
of `Always`.
-->
此时，容器已经终止并重新启动。这是因为 Redis Pod 的
[restartPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
为 `Always`。

<!--
1. Get a shell into the restarted Container:
-->
1. 用 Shell 进入重新启动的容器中：

   ```shell
   kubectl exec -it redis -- /bin/bash
   ```

<!--
1. In your shell, go to `/data/redis`, and verify that `test-file` is still there.
-->
2. 在你的 Shell 中，进入到 `/data/redis` 目录下，并确认 `test-file` 文件是否仍然存在。

   ```shell
   root@redis:/data/redis# cd /data/redis/
   root@redis:/data/redis# ls
   test-file
   ```

<!--
1. Delete the Pod that you created for this exercise:
-->
3. 删除为此练习所创建的 Pod：

   ```shell
   kubectl delete pod redis
   ```

## {{% heading "whatsnext" %}}

<!--
- See [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core).

- See [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core).

- In addition to the local disk storage provided by `emptyDir`, Kubernetes
  supports many different network-attached storage solutions, including PD on
  GCE and EBS on EC2, which are preferred for critical data and will handle
  details such as mounting and unmounting the devices on the nodes. See
  [Volumes](/docs/concepts/storage/volumes/) for more details.
-->
- 参阅 [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)。
- 参阅 [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)。
- 除了 `emptyDir` 提供的本地磁盘存储外，Kubernetes 还支持许多不同的网络附加存储解决方案，
  包括 GCE 上的 PD 和 EC2 上的 EBS，它们是关键数据的首选，并将处理节点上的一些细节，
  例如安装和卸载设备。了解更多详情请参阅[卷](/zh-cn/docs/concepts/storage/volumes/)。
