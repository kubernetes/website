---
title: 在 Pod 中的容器之間共享進程命名空間
content_type: task
weight: 200
---
<!--
---
title: Share Process Namespace between Containers in a Pod
reviewers:
- verb
- yujuhong
- dchen1107
content_type: task
weight: 200
---
-->

<!-- overview -->

<!--
This page shows how to configure process namespace sharing for a pod. When
process namespace sharing is enabled, processes in a container are visible
to all other containers in the same pod.
-->
此頁面展示如何爲 Pod 配置進程命名空間共享。
當啓用進程命名空間共享時，容器中的進程對同一 Pod 中的所有其他容器都是可見的。

<!--
You can use this feature to configure cooperating containers, such as a log
handler sidecar container, or to troubleshoot container images that don't
include debugging utilities like a shell.
-->
你可以使用此功能來配置協作容器，比如日誌處理 sidecar 容器，
或者對那些不包含諸如 shell 等調試實用工具的鏡像進行故障排查。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Configure a Pod
-->
## 配置 Pod

<!--
Process namespace sharing is enabled using the `shareProcessNamespace` field of
`.spec` for a Pod. For example:
-->
使用 Pod `.spec` 中的 `shareProcessNamespace` 字段可以啓用進程命名空間共享。例如：

{{% code_sample file="pods/share-process-namespace.yaml" %}}

<!--
1. Create the pod `nginx` on your cluster:
-->
1. 在集羣中創建 `nginx` Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/share-process-namespace.yaml
   ```

<!--
1. Attach to the `shell` container and run `ps`:
-->
2. 獲取容器 `shell`，執行 `ps`：

   ```shell
   kubectl exec -it nginx -c shell -- /bin/sh
   ```

   <!--
   If you don't see a command prompt, try pressing enter. In the container shell:

   ```shell
   # run this inside the "shell" container
   ps ax
   ```
   -->
   如果沒有看到命令提示符，請按 enter 回車鍵。在容器 shell 中：

   ```shell
   # 在 “shell” 容器中運行以下命令
   ps ax
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似於：

   ```none
   PID   USER     TIME  COMMAND
       1 root      0:00 /pause
       8 root      0:00 nginx: master process nginx -g daemon off;
      14 101       0:00 nginx: worker process
      15 root      0:00 sh
      21 root      0:00 ps ax
   ```

<!--
You can signal processes in other containers. For example, send `SIGHUP` to
`nginx` to restart the worker process. This requires the `SYS_PTRACE` capability.

```shell
# run this inside the "shell" container
kill -HUP 8   # change "8" to match the PID of the nginx leader process, if necessary
ps ax
```
-->
你可以在其他容器中對進程發出信號。例如，發送 `SIGHUP` 到 `nginx` 以重啓工作進程。
此操作需要 `SYS_PTRACE` 權能。

```shell
# 在 “shell” 容器中運行以下命令
kill -HUP 8   # 如有必要，更改 “8” 以匹配 nginx 領導進程的 PID
ps ax
```

<!--
The output is similar to this:
-->
輸出類似於：

```none
PID   USER     TIME  COMMAND
    1 root      0:00 /pause
    8 root      0:00 nginx: master process nginx -g daemon off;
   15 root      0:00 sh
   22 101       0:00 nginx: worker process
   23 root      0:00 ps ax
```

<!--
It's even possible to access the file system of another container using the
`/proc/$pid/root` link.

```shell
# run this inside the "shell" container
# change "8" to the PID of the Nginx process, if necessary
head /proc/8/root/etc/nginx/nginx.conf
```
-->
甚至可以使用 `/proc/$pid/root` 鏈接訪問另一個容器的文件系統。

```shell
# 在 “shell” 容器中運行以下命令
# 如有必要，更改 “8” 爲 Nginx 進程的 PID
head /proc/8/root/etc/nginx/nginx.conf
```

<!--
The output is similar to this:
-->
輸出類似於：

```none
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
```

<!-- discussion -->

<!--
## Understanding process namespace sharing
-->
## 理解進程命名空間共享

<!--
Pods share many resources so it makes sense they would also share a process
namespace. Some containers may expect to be isolated from others, though,
so it's important to understand the differences:
-->
Pod 共享許多資源，因此它們共享進程命名空間是很有意義的。
不過，有些容器可能希望與其他容器隔離，因此瞭解這些差異很重要:

<!--
1. **The container process no longer has PID 1.** Some containers refuse
   to start without PID 1 (for example, containers using `systemd`) or run
   commands like `kill -HUP 1` to signal the container process. In pods with a
   shared process namespace, `kill -HUP 1` will signal the pod sandbox
   (`/pause` in the above example).
-->
1. **容器進程不再具有 PID 1。** 在沒有 PID 1 的情況下，一些容器拒絕啓動
   （例如，使用 `systemd` 的容器)，或者拒絕執行 `kill -HUP 1` 之類的命令來通知容器進程。
   在具有共享進程命名空間的 Pod 中，`kill -HUP 1` 將通知 Pod 沙箱（在上面的例子中是 `/pause`）。

<!--
1. **Processes are visible to other containers in the pod.** This includes all
   information visible in `/proc`, such as passwords that were passed as arguments
   or environment variables. These are protected only by regular Unix permissions.
-->
2. **進程對 Pod 中的其他容器可見。** 這包括 `/proc` 中可見的所有信息，
   例如作爲參數或環境變量傳遞的密碼。這些僅受常規 Unix 權限的保護。

<!--
1. **Container filesystems are visible to other containers in the pod through the
   `/proc/$pid/root` link.** This makes debugging easier, but it also means
   that filesystem secrets are protected only by filesystem permissions.
-->
3. **容器文件系統通過 `/proc/$pid/root` 鏈接對 Pod 中的其他容器可見。** 這使調試更加容易，
   但也意味着文件系統安全性只受文件系統權限的保護。
