---
layout: blog
title: "7 个常见的 Kubernetes 坑（以及我是如何避开的）"
date: 2025-10-20T08:30:00-07:00
slug: seven-kubernetes-pitfalls-and-how-to-avoid
author: >
  Abdelkoddous Lhajouji
translator: >
  [Wenjun Lou](https://github.com/Eason1118)
---
<!--
layout: blog
title: "7 Common Kubernetes Pitfalls (and How I Learned to Avoid Them)"
date: 2025-10-20T08:30:00-07:00
slug: seven-kubernetes-pitfalls-and-how-to-avoid
author: >
  Abdelkoddous Lhajouji
-->

<!--
It's no secret that Kubernetes can be both powerful and frustrating at times. When I first started dabbling with container orchestration, I made more than my fair share of mistakes enough to compile a whole list of pitfalls. In this post, I want to walk through seven big gotchas I've encountered (or seen others run into) and share some tips on how to avoid them. Whether you're just kicking the tires on Kubernetes or already managing production clusters, I hope these insights help you steer clear of a little extra stress.
-->
Kubernetes 功能强大，但有时也会令人沮丧，这已不是什么秘密。
当我刚开始接触容器编排时，我犯了不少错误，足以列出一整张误区清单。
在这篇文章中，我想分享我遇到的（或看到其他人遇到的）七个常见误区，
以及如何避免它们的建议。
无论你只是刚开始尝试 Kubernetes，还是已经在管理生产集群，
我希望这些见解能帮助你避免一些额外的麻烦。

<!--
## 1. Skipping resource requests and limits
-->
## 1. 忽略资源 requests 和 limits {#1-skipping-resource-requests-and-limits}

<!--
**The pitfall**: Not specifying CPU and memory requirements in Pod specifications. This typically happens because Kubernetes does not require these fields, and workloads can often start and run without them—making the omission easy to overlook in early configurations or during rapid deployment cycles.
-->
**常见误区**：在 Pod 规约中未指定 CPU 和内存需求。
这种情况经常发生，原因是 Kubernetes 不要求这些字段必须设置，
工作负载通常可以在没有这些字段的情况下启动和运行——
这使得在早期配置或快速部署周期中很容易忽略这些设置。

<!--
**Context**:
In Kubernetes, resource requests and limits are critical for efficient cluster management. Resource requests ensure that the scheduler reserves the appropriate amount of CPU and memory for each pod, guaranteeing that it has the necessary resources to operate. Resource limits cap the amount of CPU and memory a pod can use, preventing any single pod from consuming excessive resources and potentially starving other pods.
When resource requests and limits are not set:
-->
**背景**：
在 Kubernetes 中，资源请求和限制对于高效的集群管理至关重要。
资源请求确保调度器为每个 Pod 预留适当数量的 CPU 和内存，
保证它有必要的资源来运行。
资源限制限制了 Pod 可以使用的 CPU 和内存数量，
防止任何单个 Pod 消耗过多资源而可能导致其他 Pod 资源不足。
当未设置资源请求和限制时：

<!--
 1. Resource Starvation: Pods may get insufficient resources, leading to degraded performance or failures. This is because Kubernetes schedules pods based on these requests. Without them, the scheduler might place too many pods on a single node, leading to resource contention and performance bottlenecks.
 2. Resource Hoarding: Conversely, without limits, a pod might consume more than its fair share of resources, impacting the performance and stability of other pods on the same node. This can lead to issues such as other pods getting evicted or killed by the Out-Of-Memory (OOM) killer due to lack of available memory.
-->
1. **资源不足**：Pod 可能未获得足够的资源，导致性能下降或运行失败。
   这是因为 Kubernetes 根据这些请求来调度 Pod。
   没有这些请求，调度器可能会在单个节点上放置过多的 Pod，导致资源竞争和性能瓶颈。
2. **资源囤积**：相反，没有设置限制值时，一个 Pod 可能会消耗过多的资源，
   影响同一节点上其他 Pod 的性能和稳定性。
   这可能导致其他 Pod 因内存不足而被驱逐或被 OOM（Out-Of-Memory）强制终止。

<!--
### How to avoid it:
- Start with modest `requests` (for example `100m` CPU, `128Mi` memory) and see how your app behaves.
- Monitor real-world usage and refine your values; the [HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/) can help automate scaling based on metrics.
- Keep an eye on `kubectl top pods` or your logging/monitoring tool to confirm you're not over- or under-provisioning.
-->
### 如何避免：

- 从适度的 `requests` 开始（例如 `100m` CPU、`128Mi` 内存），观察应用的行为。
- 监控实际使用情况并优化你的值；[Pod 水平自动扩缩](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/) 
  可以帮助基于指标自动扩缩容。
- 关注 `kubectl top pods` 或你的日志/监控工具，
  确认你没有过多或过少地配置资源。

<!--
**My reality check**: Early on, I never thought about memory limits. Things seemed fine on my local cluster. Then, on a larger environment, Pods got *OOMKilled* left and right. Lesson learned.
For detailed instructions on configuring resource requests and limits for your containers, please refer to [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
(part of the official Kubernetes documentation).
-->
**我的经验教训**：早期，我从未考虑过内存限制。
在我的本地集群上一切看起来都很好。
后来，在更大的环境中，Pod 被 **OOMKilled**（内存不足终止）的情况比比皆是。
教训深刻。有关为容器配置资源请求和限制的详细说明，
请参阅[为容器和 Pod 分配内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
（Kubernetes 官方文档的一部分）。

<!--
## 2. Underestimating liveness and readiness probes
-->
## 2. 低估了存活探针和就绪态探针的重要性 {#2-underestimating-liveness-and-readiness-probes}

<!--
**The pitfall**: Deploying containers without explicitly defining how Kubernetes should check their health or readiness. This tends to happen because Kubernetes will consider a container "running" as long as the process inside hasn't exited. Without additional signals, Kubernetes assumes the workload is functioning—even if the application inside is unresponsive, initializing, or stuck.
-->
**常见误区**：部署容器时未明确定义 Kubernetes 应如何检查其健康状态或就绪状态。
这通常发生在 Kubernetes 只要容器内的进程未退出就认为容器“正在运行”的情况下。
在没有额外的信号的情况下，Kubernetes 会假设工作负载正在运行——
即使内部的应用无响应、正在初始化或卡住。

<!--
**Context**:  
Liveness, readiness, and startup probes are mechanisms Kubernetes uses to monitor container health and availability. 

- **Liveness probes** determine if the application is still alive. If a liveness check fails, the container is restarted.
- **Readiness probes** control whether a container is ready to serve traffic. Until the readiness probe passes, the container is removed from Service endpoints.
- **Startup probes** help distinguish between long startup times and actual failures.
-->
**背景**：
存活态、就绪态和启动探针是 Kubernetes 用来监控容器健康状态和可用性的机制。

- **存活态探针**确定应用是否仍然存活。如果存活态检查失败，容器会被重启。
- **就绪态探针**控制容器是否准备好接收流量。
  在就绪态探针通过之前，容器会从 Service 端点中移除。
- **启动探针**帮助区分长时间启动和实际故障。

<!--
### How to avoid it:
- Add a simple HTTP `livenessProbe` to check a health endpoint (for example `/healthz`) so Kubernetes can restart a hung container.
- Use a `readinessProbe` to ensure traffic doesn't reach your app until it's warmed up.
- Keep probes simple. Overly complex checks can create false alarms and unnecessary restarts.
-->
### 如何避免：

- 添加一个简单的 HTTP `livenessProbe` 来检查健康端点（例如 `/healthz`），
  以便 Kubernetes 可以重启挂起的容器。
- 使用 `readinessProbe` 确保在应用预热完成之前流量不会到达应用。
- 保持探针简单。过于复杂的检查可能会产生误报和不必要的重启。

<!--
**My reality check**: I once forgot a readiness probe for a web service that took a while to load. Users hit it prematurely, got weird timeouts, and I spent hours scratching my head. A 3-line readiness probe would have saved the day.
-->
**我的经验教训**：我曾经忘记为一个需要一段时间才能加载的 Web 服务设置就绪态探针。
用户过早访问了它，遇到了奇怪的超时，我花了几个小时才找到问题。
一个 3 行的就绪态探针就能解决这个问题。

<!--
For comprehensive instructions on configuring liveness, readiness, and startup probes for containers, please refer to [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
in the official Kubernetes documentation.
-->
有关为容器配置存活态、就绪态和启动探针的全面说明，
请参阅 Kubernetes 官方文档中的[配置存活、就绪和启动探针](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)。

<!--
## 3. "We'll just look at container logs" (famous last words)
-->
## 3. "我们只需要查看容器日志"（著名的遗言） {#3-well-just-look-at-container-logs-famous-last-words}

<!--
**The pitfall**: Relying solely on container logs retrieved via `kubectl logs`. This often happens because the command is quick and convenient, and in many setups, logs appear accessible during development or early troubleshooting. However, `kubectl logs` only retrieves logs from currently running or recently terminated containers, and those logs are stored on the node's local disk. As soon as the container is deleted, evicted, or the node is restarted, the log files may be rotated out or permanently lost.
-->
**常见误区**：仅依赖通过 `kubectl logs` 检索的容器日志。
这种想法背后的原因通常是因为查看日志的命令既快速又便捷，
在许多集群环境中，日志在开发或早期故障排除时似乎可以访问。
然而，`kubectl logs` 只能从当前正在运行或最近终止的容器中检索日志，
这些日志存储在节点的本地磁盘上。
一旦容器被删除、驱逐或节点重启，日志文件可能会被轮换掉或永久丢失。

<!--
### How to avoid it:
- **Centralize logs** using CNCF tools like [Fluentd](https://kubernetes.io/docs/concepts/cluster-administration/logging/#sidecar-container-with-a-logging-agent) or [Fluent Bit](https://fluentbit.io/) to aggregate output from all Pods.
- **Adopt OpenTelemetry** for a unified view of logs, metrics, and (if needed) traces. This lets you spot correlations between infrastructure events and app-level behavior.
- **Pair logs with Prometheus metrics** to track cluster-level data alongside application logs. If you need distributed tracing, consider CNCF projects like [Jaeger](https://www.jaegertracing.io/).
-->
### 如何避免：

- **集中化日志**：使用 CNCF 工具如 [Fluentd](/zh-cn/docs/concepts/cluster-administration/logging/#sidecar-container-with-a-logging-agent)
  或 [Fluent Bit](https://fluentbit.io/) 来聚合所有 Pod 的输出。
- **采用 OpenTelemetry**：用于构造日志、指标和（如果需要）追踪的统一视图。
  这让你能够发现基础设施事件和应用级行为之间的关联。
- **将日志与 Prometheus 指标对应起来**：与应用日志同时跟踪集群级数据。
  如果你需要分布式追踪，可以考虑 [Jaeger](https://www.jaegertracing.io/) 这类 CNCF 项目。

<!--
**My reality check**: The first time I lost Pod logs to a quick restart, I realized how flimsy "kubectl logs" can be on its own. Since then, I've set up a proper pipeline for every cluster to avoid missing vital clues.
-->
**我的经验教训**：第一次因为快速重启而丢失 Pod 日志时，
我意识到仅依赖 "kubectl logs" 是多么不可靠。
从那时起，我为每个集群都搭建了完整的日志采集管道，
以避免错过任何关键线索。

<!--
## 4. Treating dev and prod exactly the same
-->
## 4. 将开发环境和生产环境视为完全相同 {#4-treating-dev-and-prod-exactly-the-same}

<!--
**The pitfall**: Deploying the same Kubernetes manifests with identical settings across development, staging, and production environments. This often occurs when teams aim for consistency and reuse, but overlook that environment-specific factors—such as traffic patterns, resource availability, scaling needs, or access control—can differ significantly. Without customization, configurations optimized for one environment may cause instability, poor performance, or security gaps in another.
-->
**常见误区**：在开发、预发布和生产环境中使用相同的 Kubernetes 清单和相同的设置进行部署。
在团队追求一致性和复用，
但忽略了环境特定的因素——如流量模式、资源可用性、扩缩容需求或访问控制——
可能显著不同时，常会发生这种情况。
如果略过定制这一步骤，针对一个环境优化的配置可能会导致负载在另一个环境下不稳定、
性能差或暴露安全漏洞。

<!--
### How to avoid it:
- Use environment overlays or [kustomize](https://kustomize.io/) to maintain a shared base while customizing resource requests, replicas, or config for each environment.
- Extract environment-specific configuration into ConfigMaps and / or Secrets. You can use a specialized tool such as [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) to manage confidential data.
- Plan for scale in production. Your dev cluster can probably get away with minimal CPU/memory, but prod might need significantly more.
-->
### 如何避免：

- 使用环境覆盖层或 [kustomize](https://kustomize.io/) 来维护共享基础，
  同时为每个环境定制资源请求、副本数或配置。
- 将环境特定的配置提取到 ConfigMap 和/或 Secret 中。
  你可以使用专门的工具如 [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) 来管理机密数据。
- 为生产环境中的扩缩需求做规划。
  你的开发集群可能只需要最少的 CPU/内存，但生产环境可能需要显著更多。

<!--
**My reality check**: One time, I scaled up `replicaCount` from 2 to 10 in a tiny dev environment just to "test." I promptly ran out of resources and spent half a day cleaning up the aftermath. Oops.
-->
**我的经验教训**：有一次，
我在一个很小的开发环境中将 `replicaCount` 从 2 扩展到 10，只是为了"测试"。
我立即耗尽了资源，花了半天时间清理后果。

<!--
## 5. Leaving old stuff floating around
-->
## 5. 遗留未清理的旧资源 {#5-leaving-old-stuff-floating-around}

<!--
**The pitfall**: Leaving unused or outdated resources—such as Deployments, Services, ConfigMaps, or PersistentVolumeClaims—running in the cluster. This often happens because Kubernetes does not automatically remove resources unless explicitly instructed, and there is no built-in mechanism to track ownership or expiration. Over time, these forgotten objects can accumulate, consuming cluster resources, increasing cloud costs, and creating operational confusion, especially when stale Services or LoadBalancers continue to route traffic.
-->
**常见误区**：在集群中遗留未使用或过时的资源——例如 Deployment、Service、ConfigMap 或 PersistentVolumeClaim。
这种情况经常发生，因为 Kubernetes 不会自动删除资源，除非明确指示；
同时系统也没有内建机制来追踪资源的归属或过期时间。
随着时间推移，这些被遗忘的对象可能不断累积，
占用集群资源、增加云成本，并造成运维上的混乱，
尤其是在陈旧的 Service 或 LoadBalancer 仍持续转发流量的情况下。


<!--
### How to avoid it:
- **Label everything** with a purpose or owner label. That way, you can easily query resources you no longer need.
- **Regularly audit** your cluster: run `kubectl get all -n <namespace>` to see what's actually running, and confirm it's all legit.
- **Adopt Kubernetes' Garbage Collection**: [K8s docs](/docs/concepts/workloads/controllers/garbage-collection/) show how to remove dependent objects automatically.
- **Leverage policy automation**: Tools like [Kyverno](https://kyverno.io/) can automatically delete or block stale resources after a certain period, or enforce lifecycle policies so you don't have to remember every single cleanup step.
-->
### 如何避免：

- **为所有资源添加标签**：使用用途或所有者标签。
  这样，你可以轻松查询不再需要的资源。
- **定期审计集群**：运行 `kubectl get all -n <namespace>` 查看实际运行的内容，
  并确认它们都是合法的。
- **采用 Kubernetes 的垃圾收集**：[K8s 文档](/zh-cn/docs/concepts/workloads/controllers/garbage-collection/)
  展示了如何自动删除依赖对象。
- **利用策略自动化**：像 [Kyverno](https://kyverno.io/) 这样的工具可以在一定时间后自动删除或阻止过期的资源，
  或强制执行生命周期策略，这样你就不必记住每个清理步骤。

<!--
**My reality check**: After a hackathon, I forgot to tear down a "test-svc" pinned to an external load balancer. Three weeks later, I realized I'd been paying for that load balancer the entire time. Facepalm.
-->
**我的经验教训**：在一次黑客松活动结束后，
我忘记删除一个绑定到外部负载均衡器的 "test-svc"。
三周后我才意识到，这段时间我一直在为那个负载均衡器付费。


<!--
## 6. Diving too deep into networking too soon
-->
## 6. 过早深入复杂的网络配置 {#6-diving-too-deep-into-networking-too-soon}

<!--
**The pitfall**: Introducing advanced networking solutions—such as service meshes, custom CNI plugins, or multi-cluster communication—before fully understanding Kubernetes' native networking primitives. This commonly occurs when teams implement features like traffic routing, observability, or mTLS using external tools without first mastering how core Kubernetes networking works: including Pod-to-Pod communication, ClusterIP Services, DNS resolution, and basic ingress traffic handling. As a result, network-related issues become harder to troubleshoot, especially when overlays introduce additional abstractions and failure points.
-->
**常见误区**：在完全理解 Kubernetes 原生网络原语之前引入高级网络解决方案——
如服务网格、自定义 CNI 插件或多集群通信。
这通常发生在团队使用外部工具实现流量路由、可观测性或 mTLS 等功能，
而没有首先掌握核心 Kubernetes 网络的工作原理：
包括 Pod 到 Pod 通信、ClusterIP Services、DNS 解析和基本 Ingress 流量处理。
因此，网络相关问题变得更难排查，
特别是当覆盖层引入额外的抽象和故障点时。

<!--
### How to avoid it:

- Start small: a Deployment, a Service, and a basic ingress controller such as one based on NGINX (e.g., Ingress-NGINX).
- Make sure you understand how traffic flows within the cluster, how service discovery works, and how DNS is configured.
- Only move to a full-blown mesh or advanced CNI features when you actually need them, complex networking adds overhead.
-->
### 如何避免：

- 从简单开始：部署一个 Deployment、一个 Service，
  以及一个基础的 Ingress 控制器（例如基于 NGINX 的 Ingress-NGINX）。
- 确保理解集群内的流量流向、服务发现机制以及 DNS 的配置方式。
- 仅在确实需要时再引入完整的服务网格或高级 CNI 功能，
  因为复杂的网络架构会带来额外开销。

<!--
**My reality check**: I tried Istio on a small internal app once, then spent more time debugging Istio itself than the actual app. Eventually, I stepped back, removed Istio, and everything worked fine.
-->
**我的经验教训**：我曾经在一个小的内部应用上尝试 Istio，
然后花在调试 Istio 本身上的时间比调试实际应用还多。
最终，我退了一步，移除了 Istio，一切运行正常。

<!--
## 7. Going too light on security and RBAC
-->
## 7. 对安全性和基于角色的访问控制 (RBAC) 重视不足 {#7-going-too-light-on-security-and-rbac}

<!--
**The pitfall**: Deploying workloads with insecure configurations, such as running containers as the root user, using the `latest` image tag, disabling security contexts, or assigning overly broad RBAC roles like `cluster-admin`. These practices persist because Kubernetes does not enforce strict security defaults out of the box, and the platform is designed to be flexible rather than opinionated. Without explicit security policies in place, clusters can remain exposed to risks like container escape, unauthorized privilege escalation, or accidental production changes due to unpinned images.
-->
**常见误区**：以不安全的方式配置部署工作负载，例如以 root 用户运行容器、使用 `latest` 镜像标签、
禁用安全上下文（security context），或分配过于宽泛的 RBAC 角色（如 `cluster-admin`）。
这些做法之所以普遍存在，是因为 Kubernetes 默认并不会强制实施严格的安全策略——
该平台在设计上追求灵活性而非强约束性。如果未显式配置安全策略，集群可能面临容器逃逸、
未经授权的权限提升或由于未固定镜像导致的意外生产变更等风险。

<!--
### How to avoid it:

- Use [RBAC](/docs/reference/access-authn-authz/rbac/) to define roles and permissions within Kubernetes. While RBAC is the default and most widely supported authorization mechanism, Kubernetes also allows the use of alternative authorizers. For more advanced or external policy needs, consider solutions like [OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/) (based on Rego), [Kyverno](https://kyverno.io/), or custom webhooks using policy languages such as CEL or [Cedar](https://cedarpolicy.com/).
- Pin images to specific versions (no more `:latest`!). This helps you know what's actually deployed.
- Look into [Pod Security Admission](/docs/concepts/security/pod-security-admission/) (or other solutions like Kyverno) to enforce non-root containers, read-only filesystems, etc.
-->
### 如何避免：

- 使用 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 定义在 Kubernetes 中的角色和权限。
  虽然 RBAC 是默认且最广泛支持的鉴权机制，Kubernetes 也允许使用替代性的鉴权组件。
  对于更高级或外部策略需求，可以考虑 [OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/)（基于 Rego）、
  [Kyverno](https://kyverno.io/) 或使用 CEL 或 [Cedar](https://cedarpolicy.com/) 等策略语言的自定义 Webhook 等解决方案。
- 将镜像固定到特定版本（不要再使用 `:latest`！）。这有助于你了解实际部署的内容。
- 查看 [Pod 安全准入](/zh-cn/docs/concepts/security/pod-security-admission/)（或 Kyverno 等其他解决方案）
  以强制执行非 root 容器、只读文件系统等。

<!--
**My reality check**: I never had a huge security breach, but I've heard plenty of cautionary tales. If you don't tighten things up, it's only a matter of time before something goes wrong.
-->
**我的经验教训**：我从未遇到过巨大的安全漏洞，但我听过很多警示故事。
如果你不加强安全措施，出问题只是时间问题。

<!--
## Final thoughts
-->
## 最后的话 {#final-thoughts}

<!--
Kubernetes is amazing, but it's not psychic, it won't magically do the right thing if you don't tell it what you need. By keeping these pitfalls in mind, you'll avoid a lot of headaches and wasted time. Mistakes happen (trust me, I've made my share), but each one is a chance to learn more about how Kubernetes truly works under the hood.
If you're curious to dive deeper, the [official docs](/docs/home/) and the [community Slack](http://slack.kubernetes.io/) are excellent next steps. And of course, feel free to share your own horror stories or success tips, because at the end of the day, we're all in this cloud native adventure together.
-->
Kubernetes 非常强大，但它并非全知全能——如果你不明确告知它你的需求，它不会"神奇地"自动做出正确的决策。
牢记这些常见误区，你就能避免许多麻烦和时间浪费。错误在所难免（相信我，我也犯过不少），但每一次失误，
都是深入理解 Kubernetes 内部工作机制的机会。如果你希望进一步探索，
可以查阅[官方文档](/zh-cn/docs/home/)或加入[社区 Slack](http://slack.kubernetes.io/)。
当然，也欢迎你分享自己的"踩坑经历"或成功经验——毕竟，在云原生这场旅程中，我们都在同行。

<!--
**Happy Shipping!**
-->
**祝你部署顺利！**
