---
title: 检查弃用 Dockershim 对你的影响
content_type: task 
weight: 20
---
<!-- 
title: Check whether Dockershim deprecation affects you
content_type: task 
reviewers:
- SergeyKanzhelev
weight: 20
-->

<!-- overview -->

<!-- 
The `dockershim` component of Kubernetes allows to use Docker as a Kubernetes's
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}.
Kubernetes' built-in `dockershim` component was deprecated in release v1.20.
-->
Kubernetes 的 `dockershim` 组件使得你可以把 Docker 用作 Kubernetes 的
{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}。
在 Kubernetes v1.20 版本中，内建组件 `dockershim` 被弃用。

<!-- 
This page explains how your cluster could be using Docker as a container runtime,
provides details on the role that `dockershim` plays when in use, and shows steps
you can take to check whether any workloads could be affected by `dockershim` deprecation.
-->
本页讲解你的集群把 Docker 用作容器运行时的运作机制，
并提供使用 `dockershim` 时，它所扮演角色的详细信息，
继而展示了一组验证步骤，可用来检查弃用 `dockershim` 对你的工作负载的影响。

<!-- 
## Finding if your app has a dependencies on Docker {#find-docker-dependencies} 
-->
## 检查你的应用是否依赖于 Docker {#find-docker-dependencies}

<!-- 
If you are using Docker for building your application containers, you can still
run these containers on any container runtime. This use of Docker does not count
as a dependency on Docker as a container runtime.
-->
虽然你通过 Docker 创建了应用容器，但这些容器却可以运行于所有容器运行时。
所以这种使用 Docker 容器运行时的方式并不构成对 Docker 的依赖。

<!-- 
When alternative container runtime is used, executing Docker commands may either
not work or yield unexpected output. This is how you can find whether you have a
dependency on Docker:
-->
当用了替代的容器运行时之后，Docker 命令可能不工作，甚至产生意外的输出。
这才是判定你是否依赖于 Docker 的方法。

<!-- 
1. Make sure no privileged Pods execute Docker commands.
2. Check that scripts and apps running on nodes outside of Kubernetes
   infrastructure do not execute Docker commands. It might be:
   - SSH to nodes to troubleshoot;
   - Node startup scripts;
   - Monitoring and security agents installed on nodes directly.
3. Third-party tools that perform above mentioned privileged operations. See
   [Migrating telemetry and security agents from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents)
   for more information.
4. Make sure there is no indirect dependencies on dockershim behavior.
   This is an edge case and unlikely to affect your application. Some tooling may be configured
   to react to Docker-specific behaviors, for example, raise alert on specific metrics or search for
   a specific log message as part of troubleshooting instructions.
   If you have such tooling configured, test the behavior on test
   cluster before migration.
 -->
1. 确认没有特权 Pod 执行 docker 命令。
2. 检查 Kubernetes 基础架构外部节点上的脚本和应用，确认它们没有执行 Docker 命令。可能的命令有：
   - SSH 到节点排查故障；
   - 节点启动脚本；
   - 直接安装在节点上的监视和安全代理。
3. 检查执行了上述特权操作的第三方工具。详细操作请参考:
   [从 dockershim 迁移遥测和安全代理](/zh/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/)
4. 确认没有对 dockershim 行为的间接依赖。这是一种极端情况，不太可能影响你的应用。
   一些工具很可能被配置为使用了 Docker 特性，比如，基于特定指标发警报，或者在故障排查指令的一个环节中搜索特定的日志信息。
   如果你有此类配置的工具，需要在迁移之前，在测试集群上完成功能验证。


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
[容器运行时](/zh/docs/concepts/containers/#container-runtimes)是一个软件，用来运行组成 Kubernetes Pod 的容器。
Kubernetes 负责编排和调度 Pod；在每一个节点上，
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
使用抽象的容器运行时接口，所以你可以任意选用兼容的容器运行时。

<!-- 
In its earliest releases, Kubernetes offered compatibility with just one container runtime: Docker.
Later in the Kubernetes project's history, cluster operators wanted to adopt additional container runtimes.
The CRI was designed to allow this kind of flexibility - and the kubelet began supporting CRI. However,
because Docker existed before the CRI specification was invented, the Kubernetes project created an
adapter component, `dockershim`. The dockershim adapter allows the kubelet to interact with Docker as
if Docker were a CRI compatible runtime.
 -->
在早期版本中，Kubernetes 提供的兼容性只支持一个容器运行时：Docker。
在 Kubernetes 发展历史中，集群运营人员希望采用更多的容器运行时。
于是 CRI 被设计出来满足这类灵活性需要 - 而 kubelet 亦开始支持 CRI。
然而，因为 Docker 在 CRI 规范创建之前就已经存在，Kubernetes 就创建了一个适配器组件：`dockershim`。
dockershim 适配器允许 kubelet 与 Docker交互，就好像 Docker 是一个 CRI 兼容的运行时一样。

<!-- 
You can read about it in [Kubernetes Containerd integration goes GA](/blog/2018/05/24/kubernetes-containerd-integration-goes-ga/) blog post.
 -->
你可以阅读博文
[Kubernetes 容器集成功能的正式发布](/zh/blog/2018/05/24/kubernetes-containerd-integration-goes-ga/)

<!-- Dockershim vs. CRI with Containerd -->
![Dockershim 和 Containerd CRI 的实现对比图](/images/blog/2018-05-24-kubernetes-containerd-integration-goes-ga/cri-containerd.png)

<!-- 
Switching to Containerd as a container runtime eliminates the middleman. All the
same containers can be run by container runtimes like Containerd as before. But
now, since containers schedule directly with the container runtime, they are not visible to Docker.
So any Docker tooling or fancy UI you might have used
before to check on these containers is no longer available.
 -->
切换到容器运行时 Containerd 可以消除掉中间环节。
所有以前遗留的容器可由 Containerd 这类容器运行时来运行和管理，操作体验也和以前一样。
但是现在，由于直接用容器运行时调度容器，所以它们对 Docker 来说是不可见的。
因此，你以前用来检查这些容器的 Docker 工具或漂亮的 UI 都不再可用。

<!-- 
You cannot get container information using `docker ps` or `docker inspect`
commands. As you cannot list containers, you cannot get logs, stop containers,
or execute something inside container using `docker exec`.
 -->
你不能再使用 `docker ps` 或 `docker inspect` 命令来获取容器信息。
由于你不能列出容器，因此你不能获取日志、停止容器，甚至不能通过 `docker exec` 在容器中执行命令。

<!-- 
If you're running workloads via Kubernetes, the best way to stop a container is through
the Kubernetes API rather than directly through the container runtime (this advice applies
for all container runtimes, not just Docker).
 -->
{{< note >}}

如果你用 Kubernetes 运行工作负载，最好通过 Kubernetes API停止容器，而不是通过容器运行时
（此建议适用于所有容器运行时，不仅仅是针对 Docker）。

{{< /note >}}

<!-- 
You can still pull images or build them using `docker build` command. But images
built or pulled by Docker would not be visible to container runtime and
Kubernetes. They needed to be pushed to some registry to allow them to be used
by Kubernetes.
 -->
你仍然可以下载镜像，或者用 `docker build` 命令创建它们。
但用 Docker 创建、下载的镜像，对于容器运行时和 Kubernetes，均不可见。
为了在 Kubernetes 中使用，需要把镜像推送（push）到某注册中心。
