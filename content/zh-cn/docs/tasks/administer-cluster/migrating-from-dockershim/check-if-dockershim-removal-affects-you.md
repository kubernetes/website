---
title: 检查移除 Dockershim 是否对你有影响
content_type: task
weight: 50
---
<!-- 
title: Check whether dockershim removal affects you
content_type: task
reviewers:
- SergeyKanzhelev
weight: 50
-->

<!-- overview -->

<!--
The `dockershim` component of Kubernetes allows the use of Docker as a Kubernetes's
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}.
Kubernetes' built-in `dockershim` component was removed in release v1.24.
-->

Kubernetes 的 `dockershim` 组件使得你可以把 Docker 用作 Kubernetes 的
{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}。
在 Kubernetes v1.24 版本中，内建组件 `dockershim` 被移除。

<!--
This page explains how your cluster could be using Docker as a container runtime,
provides details on the role that `dockershim` plays when in use, and shows steps
you can take to check whether any workloads could be affected by `dockershim` removal.
-->
本页讲解你的集群把 Docker 用作容器运行时的运作机制，
并提供使用 `dockershim` 时，它所扮演角色的详细信息，
继而展示了一组操作，可用来检查移除 `dockershim` 对你的工作负载是否有影响。

<!--
## Finding if your app has a dependencies on Docker {#find-docker-dependencies}
-->
## 检查你的应用是否依赖于 Docker {#find-docker-dependencies}

<!--
If you are using Docker for building your application containers, you can still
run these containers on any container runtime. This use of Docker does not count
as a dependency on Docker as a container runtime.
-->
即使你是通过 Docker 创建的应用容器，也不妨碍你在其他任何容器运行时上运行这些容器。
这种使用 Docker 的方式并不构成对 Docker 作为一个容器运行时的依赖。

<!--
When alternative container runtime is used, executing Docker commands may either
not work or yield unexpected output. This is how you can find whether you have a
dependency on Docker:
-->
当用了别的容器运行时之后，Docker 命令可能不工作，或者产生意外的输出。
下面是判定你是否依赖于 Docker 的方法。

<!--
1. Make sure no privileged Pods execute Docker commands (like `docker ps`),
   restart the Docker service (commands such as `systemctl restart docker.service`),
   or modify Docker-specific files such as `/etc/docker/daemon.json`.
1. Check for any private registries or image mirror settings in the Docker
   configuration file (like `/etc/docker/daemon.json`). Those typically need to
   be reconfigured for another container runtime.
1. Check that scripts and apps running on nodes outside of your Kubernetes
   infrastructure do not execute Docker commands. It might be:
   - SSH to nodes to troubleshoot;
   - Node startup scripts;
   - Monitoring and security agents installed on nodes directly.
-->
1. 确认没有特权 Pod 执行 Docker 命令（如 `docker ps`）、重新启动 Docker
   服务（如 `systemctl restart docker.service`）或修改 Docker 配置文件
   `/etc/docker/daemon.json`。
2. 检查 Docker 配置文件（如 `/etc/docker/daemon.json`）中容器镜像仓库的镜像（mirror）站点设置。
   这些配置通常需要针对不同容器运行时来重新设置。
3. 检查确保在 Kubernetes 基础设施之外的节点上运行的脚本和应用程序没有执行 Docker 命令。
   可能的情况有：
   - SSH 到节点排查故障；
   - 节点启动脚本；
   - 直接安装在节点上的监控和安全代理。
<!--
1. Third-party tools that perform above mentioned privileged operations. See
   [Migrating telemetry and security agents from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents)
   for more information.
1. Make sure there are no indirect dependencies on dockershim behavior.
   This is an edge case and unlikely to affect your application. Some tooling may be configured
   to react to Docker-specific behaviors, for example, raise alert on specific metrics or search for
   a specific log message as part of troubleshooting instructions.
   If you have such tooling configured, test the behavior on a test
   cluster before migration.
-->
4. 检查执行上述特权操作的第三方工具。
   详细操作请参考[从 dockershim 迁移遥测和安全代理](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents)。
5. 确认没有对 dockershim 行为的间接依赖。这是一种极端情况，不太可能影响你的应用。
   一些工具很可能被配置为使用了 Docker 特性，比如，基于特定指标发警报，
   或者在故障排查指令的一个环节中搜索特定的日志信息。
   如果你有此类配置的工具，需要在迁移之前，在测试集群上测试这类行为。

<!--
## Dependency on Docker explained {#role-of-dockershim}
-->
## Docker 依赖详解 {#role-of-dockershim}

<!--
A [container runtime](/docs/concepts/containers/#container-runtimes) is software that can
execute the containers that make up a Kubernetes pod. Kubernetes is responsible for orchestration
and scheduling of Pods; on each node, the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
uses the container runtime interface as an abstraction so that you can use any compatible
container runtime.
-->
[容器运行时](/zh-cn/docs/concepts/containers/#container-runtimes)是一个软件，
用来运行组成 Kubernetes Pod 的容器。
Kubernetes 负责编排和调度 Pod；在每一个节点上，{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
使用抽象的容器运行时接口，所以你可以任意选用兼容的容器运行时。

<!--
In its earliest releases, Kubernetes offered compatibility with one container runtime: Docker.
Later in the Kubernetes project's history, cluster operators wanted to adopt additional container runtimes.
The CRI was designed to allow this kind of flexibility - and the kubelet began supporting CRI. However,
because Docker existed before the CRI specification was invented, the Kubernetes project created an
adapter component, `dockershim`. The dockershim adapter allows the kubelet to interact with Docker as
if Docker were a CRI compatible runtime.
-->
在早期版本中，Kubernetes 提供的兼容性支持一个容器运行时：Docker。
在 Kubernetes 后来的发展历史中，集群运营人员希望采用别的容器运行时。
于是 CRI 被设计出来满足这类灵活性需求 - 而 kubelet 亦开始支持 CRI。
然而，因为 Docker 在 CRI 规范创建之前就已经存在，Kubernetes 就创建了一个适配器组件 `dockershim`。
dockershim 适配器允许 kubelet 与 Docker 交互，就好像 Docker 是一个 CRI 兼容的运行时一样。

<!--
You can read about it in [Kubernetes Containerd integration goes GA](/blog/2018/05/24/kubernetes-containerd-integration-goes-ga/) blog post.
-->
你可以阅读博文
[Kubernetes 正式支持集成 Containerd](/blog/2018/05/24/kubernetes-containerd-integration-goes-ga/)。

<!--
![Dockershim vs. CRI with Containerd](/images/blog/2018-05-24-kubernetes-containerd-integration-goes-ga/cri-containerd.png)
-->
![Dockershim 和 Containerd CRI 的实现对比图](/images/blog/2018-05-24-kubernetes-containerd-integration-goes-ga/cri-containerd.png)

<!--
Switching to Containerd as a container runtime eliminates the middleman. All the
same containers can be run by container runtimes like Containerd as before. But
now, since containers schedule directly with the container runtime, they are not visible to Docker.
So any Docker tooling or fancy UI you might have used
before to check on these containers is no longer available.
-->
切换到 Containerd 容器运行时可以消除掉中间环节。
所有相同的容器都可由 Containerd 这类容器运行时来运行。
但是现在，由于直接用容器运行时调度容器，它们对 Docker 是不可见的。
因此，你以前用来检查这些容器的 Docker 工具或漂亮的 UI 都不再可用。

<!--
You cannot get container information using `docker ps` or `docker inspect`
commands. As you cannot list containers, you cannot get logs, stop containers,
or execute something inside a container using `docker exec`.
-->
你不能再使用 `docker ps` 或 `docker inspect` 命令来获取容器信息。
由于你不能列出容器，因此你不能获取日志、停止容器，甚至不能通过 `docker exec` 在容器中执行命令。

{{< note >}}
<!-- 
If you're running workloads via Kubernetes, the best way to stop a container is through
the Kubernetes API rather than directly through the container runtime (this advice applies
for all container runtimes, not only Docker).
-->
如果你在用 Kubernetes 运行工作负载，最好通过 Kubernetes API 停止容器，
而不是通过容器运行时来停止它们（此建议适用于所有容器运行时，不仅仅是针对 Docker）。
{{< /note >}}

<!--
You can still pull images or build them using `docker build` command. But images
built or pulled by Docker would not be visible to container runtime and
Kubernetes. They needed to be pushed to some registry to allow them to be used
by Kubernetes.
 -->
你仍然可以下载镜像，或者用 `docker build` 命令创建它们。
但用 Docker 创建、下载的镜像，对于容器运行时和 Kubernetes，均不可见。
为了在 Kubernetes 中使用，需要把镜像推送（push）到某镜像仓库。

<!--
## Known issues
-->
## 已知问题  {#known-issues}

<!--
### Some filesystem metrics are missing and the metrics format is different
-->
### 一些文件系统指标缺失并且指标格式不同  {#some-filesystem-metrics-are-missing-and-the-metrics-format-is-different}

<!--
The Kubelet `/metrics/cadvisor` endpoint provides Prometheus metrics,
as documented in [Metrics for Kubernetes system components](/docs/concepts/cluster-administration/system-metrics/).
If you install a metrics collector that depends on that endpoint, you might see the following issues:
-->
Kubelet `/metrics/cadvisor` 端点提供 Prometheus 指标，
如 [Kubernetes 系统组件指标](/zh-cn/docs/concepts/cluster-administration/system-metrics/) 中所述。
如果你安装了一个依赖该端点的指标收集器，你可能会看到以下问题：

<!--
- The metrics format on the Docker node is `k8s_<container-name>_<pod-name>_<namespace>_<pod-uid>_<restart-count>`
  but the format on other runtime is different. For example, on containerd node it is `<container-id>`.
- Some filesystem metrics are missing, as follows:
-->
- Docker 节点上的指标格式为 `k8s_<container-name>_<pod-name>_<namespace>_<pod-uid>_<restart-count>`，
  但其他运行时的格式不同。例如，在 containerd 节点上它是 `<container-id>`。
- 一些文件系统指标缺失，如下所示：

  ```
  container_fs_inodes_free
  container_fs_inodes_total
  container_fs_io_current
  container_fs_io_time_seconds_total
  container_fs_io_time_weighted_seconds_total
  container_fs_limit_bytes
  container_fs_read_seconds_total
  container_fs_reads_merged_total
  container_fs_sector_reads_total
  container_fs_sector_writes_total
  container_fs_usage_bytes
  container_fs_write_seconds_total
  container_fs_writes_merged_total
  ```

<!--
#### Workaround
-->
#### 解决方法  {#workaround}

<!--
You can mitigate this issue by using [cAdvisor](https://github.com/google/cadvisor) as a standalone daemonset.
-->
你可以通过使用 [cAdvisor](https://github.com/google/cadvisor) 作为一个独立的守护程序来缓解这个问题。

<!--
1. Find the latest [cAdvisor release](https://github.com/google/cadvisor/releases)
   with the name pattern `vX.Y.Z-containerd-cri` (for example, `v0.42.0-containerd-cri`).
2. Follow the steps in [cAdvisor Kubernetes Daemonset](https://github.com/google/cadvisor/tree/master/deploy/kubernetes) to create the daemonset.
3. Point the installed metrics collector to use the cAdvisor `/metrics` endpoint
   which provides the full set of
   [Prometheus container metrics](https://github.com/google/cadvisor/blob/master/docs/storage/prometheus.md).
-->
1. 找到名称格式为 `vX.Y.Z-containerd-cri` 的最新
   [cAdvisor 版本](https://github.com/google/cadvisor/releases)（例如 `v0.42.0-containerd-cri`）。
2. 按照 [cAdvisor Kubernetes Daemonset](https://github.com/google/cadvisor/tree/master/deploy/kubernetes)
   中的步骤来创建守护进程。
3. 将已安装的指标收集器指向使用 cAdvisor 的 `/metrics` 端点。
   该端点提供了全套的 [Prometheus 容器指标](https://github.com/google/cadvisor/blob/master/docs/storage/prometheus.md)。

<!--
Alternatives:

- Use alternative third party metrics collection solution.
- Collect metrics from the Kubelet summary API that is served at `/stats/summary`.
-->
替代方案：

- 使用替代的第三方指标收集解决方案。
- 从 Kubelet 摘要 API 收集指标，该 API 在 `/stats/summary` 提供服务。

## {{% heading "whatsnext" %}}

<!--
- Read [Migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/) to understand your next steps
- Read the [dockershim deprecation FAQ](/blog/2020/12/02/dockershim-faq/) article for more information.
-->
- 阅读[从 dockershim 迁移](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/)，
  以了解你的下一步工作。
- 阅读[弃用 Dockershim 的常见问题](/zh-cn/blog/2020/12/02/dockershim-faq/)，了解更多信息。
