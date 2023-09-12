---
title: 在 Pod 中的容器之间共享进程命名空间
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
此页面展示如何为 Pod 配置进程命名空间共享。
当启用进程命名空间共享时，容器中的进程对同一 Pod 中的所有其他容器都是可见的。

<!--
You can use this feature to configure cooperating containers, such as a log
handler sidecar container, or to troubleshoot container images that don't
include debugging utilities like a shell.
-->
你可以使用此功能来配置协作容器，比如日志处理 sidecar 容器，
或者对那些不包含诸如 shell 等调试实用工具的镜像进行故障排查。

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
使用 Pod `.spec` 中的 `shareProcessNamespace` 字段可以启用进程命名空间共享。例如：

{{% code_sample file="pods/share-process-namespace.yaml" %}}

<!--
1. Create the pod `nginx` on your cluster:
-->
1. 在集群中创建 `nginx` Pod：

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/share-process-namespace.yaml
   ```

<!--
1. Attach to the `shell` container and run `ps`:
-->
2. 获取容器 `shell`，执行 `ps`：

   ```shell
   kubectl attach -it nginx -c shell
   ```

   <!--
   If you don't see a command prompt, try pressing enter. In the container shell:

   ```shell
   # run this inside the "shell" container
   ps ax
   ```
   -->
   如果没有看到命令提示符，请按 enter 回车键。在容器 shell 中：

   ```shell
   # 在 “shell” 容器中运行以下命令
   ps ax
   ```

   <!--
   The output is similar to this:
   -->
   输出类似于：

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
你可以在其他容器中对进程发出信号。例如，发送 `SIGHUP` 到 `nginx` 以重启工作进程。
此操作需要 `SYS_PTRACE` 权能。

```shell
# 在 “shell” 容器中运行以下命令
kill -HUP 8   # 如有必要，更改 “8” 以匹配 nginx 领导进程的 PID
ps ax
```

<!--
The output is similar to this:
-->
输出类似于：

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
甚至可以使用 `/proc/$pid/root` 链接访问另一个容器的文件系统。

```shell
# 在 “shell” 容器中运行以下命令
# 如有必要，更改 “8” 为 Nginx 进程的 PID
head /proc/8/root/etc/nginx/nginx.conf
```

<!--
The output is similar to this:
-->
输出类似于：

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
## 理解进程命名空间共享

<!--
Pods share many resources so it makes sense they would also share a process
namespace. Some containers may expect to be isolated from others, though,
so it's important to understand the differences:
-->
Pod 共享许多资源，因此它们共享进程命名空间是很有意义的。
不过，有些容器可能希望与其他容器隔离，因此了解这些差异很重要:

<!--
1. **The container process no longer has PID 1.** Some containers refuse
   to start without PID 1 (for example, containers using `systemd`) or run
   commands like `kill -HUP 1` to signal the container process. In pods with a
   shared process namespace, `kill -HUP 1` will signal the pod sandbox
   (`/pause` in the above example).
-->
1. **容器进程不再具有 PID 1。** 在没有 PID 1 的情况下，一些容器拒绝启动
   （例如，使用 `systemd` 的容器)，或者拒绝执行 `kill -HUP 1` 之类的命令来通知容器进程。
   在具有共享进程命名空间的 Pod 中，`kill -HUP 1` 将通知 Pod 沙箱（在上面的例子中是 `/pause`）。

<!--
1. **Processes are visible to other containers in the pod.** This includes all
   information visible in `/proc`, such as passwords that were passed as arguments
   or environment variables. These are protected only by regular Unix permissions.
-->
2. **进程对 Pod 中的其他容器可见。** 这包括 `/proc` 中可见的所有信息，
   例如作为参数或环境变量传递的密码。这些仅受常规 Unix 权限的保护。

<!--
1. **Container filesystems are visible to other containers in the pod through the
   `/proc/$pid/root` link.** This makes debugging easier, but it also means
   that filesystem secrets are protected only by filesystem permissions.
-->
3. **容器文件系统通过 `/proc/$pid/root` 链接对 Pod 中的其他容器可见。** 这使调试更加容易，
   但也意味着文件系统安全性只受文件系统权限的保护。
