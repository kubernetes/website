---
title: 在 Pod 中的容器之間共享程序名稱空間
min-kubernetes-server-version: v1.10
content_type: task
weight: 160
---
<!--
---
title: Share Process Namespace between Containers in a Pod
min-kubernetes-server-version: v1.10
reviewers:
- verb
- yujuhong
- dchen1107
content_type: task
weight: 160
---
-->

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.17" >}}

<!--
This page shows how to configure process namespace sharing for a pod. When
process namespace sharing is enabled, processes in a container are visible
to all other containers in that pod.
-->
此頁面展示如何為 pod 配置程序名稱空間共享。
當啟用程序名稱空間共享時，容器中的程序對該 pod 中的所有其他容器都是可見的。

<!--
You can use this feature to configure cooperating containers, such as a log
handler sidecar container, or to troubleshoot container images that don't
include debugging utilities like a shell.
-->
你可以使用此功能來配置協作容器，比如日誌處理 sidecar 容器，或者對那些不包含諸如 shell 等除錯實用工具的映象進行故障排查。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

<!--
## Configure a Pod
-->
## 配置 Pod

<!--
Process Namespace Sharing is enabled using the `ShareProcessNamespace` field of
`v1.PodSpec`. For example:
-->
程序名稱空間共享使用 `v1.PodSpec` 中的 `ShareProcessNamespace` 欄位啟用。例如：

{{< codenew file="pods/share-process-namespace.yaml" >}}

<!--
1. Create the pod `nginx` on your cluster:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/share-process-namespace.yaml
    ```

1. Attach to the `shell` container and run `ps`:

    ```shell
    kubectl attach -it nginx -c shell
    ```

    If you don't see a command prompt, try pressing enter.

    ```
    / # ps ax
    PID   USER     TIME  COMMAND
        1 root      0:00 /pause
        8 root      0:00 nginx: master process nginx -g daemon off;
       14 101       0:00 nginx: worker process
       15 root      0:00 sh
       21 root      0:00 ps ax
    ```
-->
1. 在叢集中建立 `nginx` pod：

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/share-process-namespace.yaml
    ```
1. 獲取容器 `shell`，執行 `ps`：

    ```shell
    kubectl attach -it nginx -c shell
    ```
    如果沒有看到命令提示符，請按 enter 回車鍵。

    ```
    / # ps ax
    PID   USER     TIME  COMMAND
        1 root      0:00 /pause
        8 root      0:00 nginx: master process nginx -g daemon off;
       14 101       0:00 nginx: worker process
       15 root      0:00 sh
       21 root      0:00 ps ax
    ```
<!--
You can signal processes in other containers. For example, send `SIGHUP` to
nginx to restart the worker process. This requires the `SYS_PTRACE` capability.
-->
你可以在其他容器中對程序發出訊號。例如，傳送 `SIGHUP` 到 nginx 以重啟工作程序。這需要 `SYS_PTRACE` 功能。

```
/ # kill -HUP 8
/ # ps ax
PID   USER     TIME  COMMAND
    1 root      0:00 /pause
    8 root      0:00 nginx: master process nginx -g daemon off;
   15 root      0:00 sh
   22 101       0:00 nginx: worker process
   23 root      0:00 ps ax
```

<!--
It's even possible to access another container image using the
`/proc/$pid/root` link.
-->
甚至可以使用 `/proc/$pid/root` 連結訪問另一個容器映象。

```
/ # head /proc/8/root/etc/nginx/nginx.conf

user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
```



<!-- discussion -->

<!--
## Understanding Process Namespace Sharing
-->
## 理解程序名稱空間共享

<!--
Pods share many resources so it makes sense they would also share a process
namespace. Some container images may expect to be isolated from other
containers, though, so it's important to understand these differences:
-->
Pod 共享許多資源，因此它們共享程序名稱空間是很有意義的。
不過，有些容器映象可能希望與其他容器隔離，因此瞭解這些差異很重要:

<!--
1. **The container process no longer has PID 1.** Some container images refuse
   to start without PID 1 (for example, containers using `systemd`) or run
   commands like `kill -HUP 1` to signal the container process. In pods with a
   shared process namespace, `kill -HUP 1` will signal the pod sandbox.
   (`/pause` in the above example.)

1. **Processes are visible to other containers in the pod.** This includes all
   information visible in `/proc`, such as passwords that were passed as arguments
   or environment variables. These are protected only by regular Unix permissions.

1. **Container filesystems are visible to other containers in the pod through the
   `/proc/$pid/root` link.** This makes debugging easier, but it also means
   that filesystem secrets are protected only by filesystem permissions.
-->

1. **容器程序不再具有 PID 1。** 在沒有 PID 1 的情況下，一些容器映象拒絕啟動（例如，使用 `systemd` 的容器)，或者拒絕執行 `kill -HUP 1` 之類的命令來通知容器程序。在具有共享程序名稱空間的 pod 中，`kill -HUP 1` 將通知 pod 沙箱（在上面的例子中是 `/pause`）。

2. **程序對 pod 中的其他容器可見。** 這包括 `/proc` 中可見的所有資訊，例如作為引數或環境變數傳遞的密碼。這些僅受常規 Unix 許可權的保護。

3. **容器檔案系統透過 `/proc/$pid/root` 連結對 pod 中的其他容器可見。** 這使除錯更加容易，但也意味著檔案系統安全性只受檔案系統許可權的保護。




