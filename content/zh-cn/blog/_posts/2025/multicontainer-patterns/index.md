---
layout: blog
title: "Kubernetes 多容器 Pod：概述"
date: 2025-04-22
draft: false
slug: multi-container-pods-overview
author: Agata Skorupka (The Scale Factory)
translator: Xin Li (Daocloud)
---
<!--
layout: blog
title: "Kubernetes Multicontainer Pods: An Overview"
date: 2025-04-22
draft: false
slug: multi-container-pods-overview
author: Agata Skorupka (The Scale Factory)
-->

<!--
As cloud-native architectures continue to evolve, Kubernetes has become the go-to platform for deploying complex, distributed systems. One of the most powerful yet nuanced design patterns in this ecosystem is the sidecar pattern—a technique that allows developers to extend application functionality without diving deep into source code.
-->
随着云原生架构的不断演进，Kubernetes 已成为部署复杂分布式系统的首选平台。
在这个生态系统中，最强大却又微妙的设计模式之一是边车（Sidecar）
模式 —— 一种允许开发者扩展应用功能而不深入源代码的技术。

<!--
## The origins of the sidecar pattern

Think of a sidecar like a trusty companion motorcycle attachment. Historically, IT infrastructures have always used auxiliary services to handle critical tasks. Before containers, we relied on background processes and helper daemons to manage logging, monitoring, and networking. The microservices revolution transformed this approach, making sidecars a structured and intentional architectural choice.
With the rise of microservices, the sidecar pattern became more clearly defined, allowing developers to offload specific responsibilities from the main service without altering its code. Service meshes like Istio and Linkerd have popularized sidecar proxies, demonstrating how these companion containers can elegantly handle observability, security, and traffic management in distributed systems.
-->
## 边车模式的起源   {#the-origins-of-the-sidecar-pattern}

想象一下边车就像一个可靠的伴侣摩托车附件。历史上，IT 基础设施总是使用辅助服务来处理关键任务。
在容器出现之前，我们依赖后台进程和辅助守护程序来管理日志记录、监控和网络。
微服务革命改变了这种方法，使边车成为一种结构化且有意图的架构选择。
随着微服务的兴起，边车模式变得更加明确，允许开发者从主服务中卸载特定职责而不改变其代码。
诸如 Istio 和 Linkerd 之类的服务网格普及了边车代理，
展示了这些伴侣容器如何优雅地处理分布式系统中的可观察性、安全性和流量管理。

<!--
## Kubernetes implementation

In Kubernetes, [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) operate within
the same Pod as the main application, enabling communication and resource sharing.
Does this sound just like defining multiple containers along each other inside the Pod? It actually does, and
this is how sidecar containers had to be implemented before Kubernetes v1.29.0, which introduced
native support for sidecars.
Sidecar containers  can now be defined within a Pod manifest using the `spec.initContainers` field. What makes
it a sidecar container is that you specify it with `restartPolicy: Always`. You can see an example of this below, which is a partial snippet of the full Kubernetes manifest:
-->
## Kubernetes 实现   {#kubernetes-implementation}

在 Kubernetes 中，[边车容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)与主应用位于同一个
Pod 内，实现通信和资源共享。这听起来就像是在 Pod 内一起定义多个容器一样？实际上确实如此，
这也是在 Kubernetes v1.29.0 引入对边车的本地支持之前实现边车容器的唯一方式。
现在，边车容器可以使用 `spec.initContainers` 字段在 Pod 清单中定义。
所指定容器之所以变成了边车容器，是因为你在规约中设置了 `restartPolicy: Always`
你可以在下面看到一个示例，这是完整 Kubernetes 清单的一个片段：

```yaml
initContainers:
  - name: logshipper
    image: alpine:latest
    restartPolicy: Always
  command: ['sh', '-c', 'tail -F /opt/logs.txt']
    volumeMounts:
    - name: data
        mountPath: /opt
```

<!--
That field name, `spec.initContainers` may sound confusing. How come when you want to define a sidecar container, you have to put an entry in the `spec.initContainers` array? `spec.initContainers` are run to completion just before main application starts, so they’re one-off, whereas sidecars often run in parallel to the main app container. It’s the `spec.initContainers` with `restartPolicy:Always` which differs classic [init containers](/docs/concepts/workloads/pods/init-containers/) from Kubernetes-native sidecar containers and ensures they are always up. 
-->
该字段名称 `spec.initContainers` 可能听起来令人困惑。为何在定义边车容器时，必须在
`spec.initContainers` 数组中添加条目？`spec.initContainers`
在主应用启动前运行至完成，因此它们是一次性的，而边车容器通常与主应用容器并行运行。
正是通过带有 `restartPolicy:Always` 的 `spec.initContainers` 区分了经典的
[Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)和
Kubernetes 原生的边车容器，并确保它们始终保持运行。

<!--
## When to embrace (or avoid) sidecars

While the sidecar pattern can be useful in many cases, it is generally not the preferred approach unless the use case justifies it. Adding a sidecar increases complexity, resource consumption, and potential network latency. Instead, simpler alternatives such as built-in libraries or shared infrastructure should be considered first.
-->
## 何时采用（或避免使用）边车   {#when-to-embrace-or-avoid-sidecars}

虽然边车模式在许多情况下非常有用，但除非使用场景证明其合理性，
否则通常不推荐优先采用这种方法。添加边车会增加复杂性、
资源消耗以及可能的网络延迟。因此，应首先考虑更简单的替代方案，
例如内置库或共享基础设施。

<!--
**Deploy a sidecar when:**

1. You need to extend application functionality without touching the original code
1. Implementing cross-cutting concerns like logging, monitoring or security
1. Working with legacy applications requiring modern networking capabilities
1. Designing microservices that demand independent scaling and updates
-->
**在以下情况部署边车：**

1. 你需要扩展应用功能，而无需修改原始代码
1. 实现日志记录、监控或安全等跨领域关注点
1. 处理需要现代网络功能的遗留应用
1. 设计需要独立扩展和更新的微服务

<!--
**Proceed with caution if:**

1. Resource efficiency is your primary concern
1. Minimal network latency is critical
1. Simpler alternatives exist
1. You want to minimize troubleshooting complexity
-->
**谨慎行事，如果：**

1. 资源效率是你的首要考虑
1. 最小网络延迟至关重要
1. 存在更简单的替代方案
1. 你希望最小化故障排查的复杂性

<!--
## Four essential multi-container patterns

### Init container pattern

The **Init container** pattern is used to execute (often critical) setup tasks before the main application container starts. Unlike regular containers, init containers run to completion and then terminate, ensuring that preconditions for the main application are met.
-->
## 四个基本的多容器模式   {#four-essential-multi-container-patterns}

### Init 容器模式   {#init-container-pattern}

**Init 容器**模式用于在主应用容器启动之前执行（通常是关键的）设置任务。
与常规容器不同，Init 容器会运行至完成然后终止，确保满足主应用的前提条件。

<!--
**Ideal for:**

1. Preparing configurations
1. Loading secrets
1. Verifying dependency availability
1. Running database migrations

The init container ensures your application starts in a predictable, controlled environment without code modifications.
-->
**适合于：**

1. 准备配置
1. 加载密钥
1. 验证依赖项的可用性
1. 运行数据库迁移

Init 容器确保你的应用在一个可预测、受控的环境中启动，而无需修改代码。

<!--
### Ambassador pattern

An ambassador container provides Pod-local helper services that expose a simple way to access a network service. Commonly, ambassador containers send network requests on behalf of a an application container and
take care of challenges such as service discovery, peer identity verification, or encryption in transit.
-->
### Ambassador 模式   {#ambassador-pattern}

一个大使（Ambassador）容器提供了 Pod 本地的辅助服务，这些服务暴露了一种访问网络服务的简单方式。
通常，Ambassador 容器代表应用容器发送网络请求，并处理诸如服务发现、对等身份验证或传输中加密等挑战。

<!--
**Perfect when you need to:**

1. Offload client connectivity concerns
1. Implement language-agnostic networking features
1. Add security layers like TLS
1. Create robust circuit breakers and retry mechanisms
-->
**能够完美地处理以下需求：**

1. 卸载客户端连接问题
1. 实现语言无关的网络功能
1. 添加如 TLS 的安全层
1. 创建强大的断路器和重试机制

<!--
### Configuration helper

A _configuration helper_ sidecar provides configuration updates to an application dynamically, ensuring it always has access to the latest settings without disrupting the service. Often the helper needs to provide an initial
configuration before the application would be able to start successfully.
-->
### 配置助手   {#configuration-helper}

一个**配置助手**边车容器动态地向应用提供配置更新，
确保它始终可以访问最新的设置而不会中断服务。
通常，助手需要在应用能够成功启动之前提供初始配置。

<!--
**Use cases:**

1. Fetching environment variables and secrets
1. Polling configuration changes
1. Decoupling configuration management from application logic
-->
**使用场景：**

1. 获取环境变量和密钥
1. 轮询配置更改
1. 将配置管理与应用逻辑解耦

<!--
### Adapter pattern

An _adapter_ (or sometimes _façade_) container enables interoperability between the main application container and external services. It does this by translating data formats, protocols, or APIs.
-->
### 适配器模式   {#adapter-pattern}

一个**适配器（adapter）**（有时也称为**切面（façade）**）容器使主应用容器与外部服务之间能够互操作。
它通过转换数据格式、协议或 API 来实现这一点。

<!--
**Strengths:**

1. Transforming legacy data formats
1. Bridging communication protocols
1. Facilitating integration between mismatched services
-->
**优点：**

1. 转换遗留数据格式
1. 搭建通信协议桥梁
1. 帮助不匹配服务之间的集成

<!--
## Wrap-up

While sidecar patterns offer tremendous flexibility, they're not a silver bullet. Each added sidecar introduces complexity, consumes resources, and potentially increases operational overhead. Always evaluate simpler alternatives first.
The key is strategic implementation: use sidecars as precision tools to solve specific architectural challenges, not as a default approach. When used correctly, they can improve security, networking, and configuration management in containerized environments.
Choose wisely, implement carefully, and let your sidecars elevate your container ecosystem.
-->
## 总结   {#wrap-up}

尽管边车模式提供了巨大的灵活性，但它不是万能的。所添加的每个边车容器都会引入复杂性、
消耗资源，并可能增加操作负担。始终首先评估更简单的替代方案。
关键在于战略性实施：将边车用作解决特定架构挑战的精准工具，而不是默认选择。
正确使用时，它们可以提升容器化环境中的安全性、网络和配置管理。
明智地选择，谨慎地实施，让你的边车提升你的容器生态系统。
