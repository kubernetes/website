---
title: 設定 Pod 以使用捲進行儲存
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
此頁面展示瞭如何設定 Pod 以使用捲進行儲存。

只要容器存在，容器的檔案系統就會存在，因此當一個容器終止並重新啓動，對該容器的檔案系統改動將丟失。
對於獨立於容器的持久化儲存，你可以使用[卷](/zh-cn/docs/concepts/storage/volumes/)。
這對於有狀態應用程式尤爲重要，例如鍵值儲存（如 Redis）和資料庫。

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
## 爲 Pod 設定卷   {#configure-a-volume-for-a-pod}

在本練習中，你將創建一個運行 Pod，該 Pod 僅運行一個容器並擁有一個類型爲
[emptyDir](/zh-cn/docs/concepts/storage/volumes/#emptydir) 的卷，
在整個 Pod 生命週期中一直存在，即使 Pod 中的容器被終止和重啓。以下是 Pod 的設定：

{{% code_sample file="pods/storage/redis.yaml" %}}

<!--
1. Create the Pod:
-->
1. 創建 Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/storage/redis.yaml
   ```

<!--
1. Verify that the Pod's Container is running, and then watch for changes to
   the Pod:
-->
2. 驗證 Pod 中的容器是否正在運行，然後留意 Pod 的更改：

   ```shell
   kubectl get pod redis --watch
   ```

   <!--
   The output looks like this:
   -->

   輸出如下：

   ```console
   NAME      READY     STATUS    RESTARTS   AGE
   redis     1/1       Running   0          13s
   ```

<!--
1. In another terminal, get a shell to the running Container:
-->
3. 在另一個終端，用 Shell 連接正在運行的容器：

   ```shell
   kubectl exec -it redis -- /bin/bash
   ```

<!--
1. In your shell, go to `/data/redis`, and then create a file:
-->
4. 在你的 Shell 中，切換到 `/data/redis` 目錄下，然後創建一個檔案：

   ```shell
   root@redis:/data# cd /data/redis/
   root@redis:/data/redis# echo Hello > test-file
   ```

<!--
1. In your shell, list the running processes:
-->
5. 在你的 Shell 中，列出正在運行的進程：

   ```shell
   root@redis:/data/redis# apt-get update
   root@redis:/data/redis# apt-get install procps
   root@redis:/data/redis# ps aux
   ```

   <!--
   The output is similar to this:
   -->

   輸出類似於：

   ```console
   USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
   redis        1  0.1  0.1  33308  3828 ?        Ssl  00:46   0:00 redis-server *:6379
   root        12  0.0  0.0  20228  3020 ?        Ss   00:47   0:00 /bin/bash
   root        15  0.0  0.0  17500  2072 ?        R+   00:48   0:00 ps aux
   ```

<!--
1. In your shell, kill the Redis process:
-->
6. 在你的 Shell 中，結束 Redis 進程：

   ```shell
   root@redis:/data/redis# kill <pid>
   ```

   <!--
   where `<pid>` is the Redis process ID (PID).
   -->

   其中 `<pid>` 是 Redis 進程的 ID (PID)。

<!--
1. In your original terminal, watch for changes to the Redis Pod. Eventually,
   you will see something like this:
-->
7. 在你原先終端中，留意 Redis Pod 的更改。最終你將會看到和下面類似的輸出：

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
此時，容器已經終止並重新啓動。這是因爲 Redis Pod 的
[restartPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
爲 `Always`。

<!--
1. Get a shell into the restarted Container:
-->
1. 用 Shell 進入重新啓動的容器中：

   ```shell
   kubectl exec -it redis -- /bin/bash
   ```

<!--
1. In your shell, go to `/data/redis`, and verify that `test-file` is still there.
-->
2. 在你的 Shell 中，進入到 `/data/redis` 目錄下，並確認 `test-file` 檔案是否仍然存在。

   ```shell
   root@redis:/data/redis# cd /data/redis/
   root@redis:/data/redis# ls
   test-file
   ```

<!--
1. Delete the Pod that you created for this exercise:
-->
3. 刪除爲此練習所創建的 Pod：

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
- 參閱 [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)。
- 參閱 [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)。
- 除了 `emptyDir` 提供的本地磁盤儲存外，Kubernetes 還支持許多不同的網路附加儲存解決方案，
  包括 GCE 上的 PD 和 EC2 上的 EBS，它們是關鍵資料的首選，並將處理節點上的一些細節，
  例如安裝和卸載設備。瞭解更多詳情請參閱[卷](/zh-cn/docs/concepts/storage/volumes/)。
