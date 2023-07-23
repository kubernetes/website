---
layout: blog
title: "介绍 KWOK（Kubernetes WithOut Kubelet，没有 Kubelet 的 Kubernetes）"
date: 2023-03-01
slug: introducing-kwok
---
<!--
layout: blog
title: "Introducing KWOK: Kubernetes WithOut Kubelet"
date: 2023-03-01
slug: introducing-kwok
canonicalUrl: https://kubernetes.dev/blog/2023/03/01/introducing-kwok/
-->

<!--
**Author:** Shiming Zhang (DaoCloud), Wei Huang (Apple), Yibo Zhuang (Apple)
-->
**作者:** Shiming Zhang (DaoCloud), Wei Huang (Apple), Yibo Zhuang (Apple)

**译者:** Michael Yao (DaoCloud)

<img style="float: right; display: inline-block; margin-left: 2em; max-width: 15em;" src="/blog/2023/03/01/introducing-kwok/kwok.svg" alt="KWOK logo" />

<!--
Have you ever wondered how to set up a cluster of thousands of nodes just in seconds, how to simulate real nodes with a low resource footprint, and how to test your Kubernetes controller at scale without spending much on infrastructure?

If you answered "yes" to any of these questions, then you might be interested in KWOK, a toolkit that enables you to create a cluster of thousands of nodes in seconds.
-->
你是否曾想过在几秒钟内搭建一个由数千个节点构成的集群，如何用少量资源模拟真实的节点，
如何不耗费太多基础设施就能大规模地测试你的 Kubernetes 控制器？

如果你曾有过这些想法，那你可能会对 KWOK 有兴趣。
KWOK 是一个工具包，能让你在几秒钟内创建数千个节点构成的集群。

<!--
## What is KWOK?

KWOK stands for Kubernetes WithOut Kubelet. So far, it provides two tools:
-->
## 什么是 KWOK？   {#what-is-kwok}

KWOK 是 Kubernetes WithOut Kubelet 的缩写，即没有 Kubelet 的 Kubernetes。
到目前为止，KWOK 提供了两个工具：

<!--
`kwok`
: `kwok` is the cornerstone of this project, responsible for simulating the lifecycle of fake nodes, pods, and other Kubernetes API resources.

`kwokctl`
: `kwokctl` is a CLI tool designed to streamline the creation and management of clusters, with nodes simulated by `kwok`.
-->
`kwok`
: `kwok` 是这个项目的基石，负责模拟伪节点、Pod 和其他 Kubernetes API 资源的生命周期。

`kwokctl`
: `kwokctl` 是一个 CLI 工具，设计用于简化创建和管理由 `kwok` 模拟节点组成的集群。

<!--
## Why use KWOK?

KWOK has several advantages:
-->
## 为什么使用 KWOK？   {#why-use-kwok}

KWOK 具有下面几点优势：

<!--
- **Speed**: You can create and delete clusters and nodes almost instantly, without waiting for boot or provisioning.
- **Compatibility**: KWOK works with any tools or clients that are compliant with Kubernetes APIs, such as kubectl, helm, kui, etc.
- **Portability**: KWOK has no specific hardware or software requirements. You can run it using pre-built images, once Docker or Nerdctl is installed. Alternatively, binaries are also available for all platforms and can be easily installed.
- **Flexibility**: You can configure different node types, labels, taints, capacities, conditions, etc., and you can configure different pod behaviors, status, etc. to test different scenarios and edge cases.
- **Performance**: You can simulate thousands of nodes on your laptop without significant consumption of CPU or memory resources.
-->
- **速度**：你几乎可以实时创建和删除集群及节点，无需等待引导或制备过程。
- **兼容性**：KWOK 能够与兼容 Kubernetes API 的所有工具或客户端（例如 kubectl、helm、kui）协同作业。
- **可移植性**：KWOK 没有特殊的软硬件要求。一旦安装了 Docker 或 Nerdctl，你就可以使用预先构建的镜像来运行 KWOK。
  另外，二进制文件包适用于所有平台，安装简单。
- **灵活**：你可以配置不同类型的节点、标签、污点、容量、状况等，还可以配置不同的 Pod
  行为和状态来测试不同的场景和边缘用例。
- **性能**：你在自己的笔记本电脑上就能模拟数千个节点，无需大量消耗 CPU 或内存资源。

<!--
## What are the use cases?

KWOK can be used for various purposes:
-->
## 使用场景是什么？   {#what-are-use-cases}

KWOK 可用于各种用途：

<!--
- **Learning**: You can use KWOK to learn about Kubernetes concepts and features without worrying about resource waste or other consequences. 
- **Development**: You can use KWOK to develop new features or tools for Kubernetes without accessing to a real cluster or requiring other components.
- **Testing**:
  - You can measure how well your application or controller scales with different numbers of nodes and(or) pods.
  - You can generate high loads on your cluster by creating many pods or services with different resource requests or limits.
  - You can simulate node failures or network partitions by changing node conditions or randomly deleting nodes.
  - You can test how your controller interacts with other components or features of Kubernetes by enabling different feature gates or API versions.
-->
- **学习**：你可以使用 KWOK 学习 Kubernetes 概念和特性，无需顾虑资源浪费或其他后果。
- **开发**：你可以使用 KWOK 为 Kubernetes 开发新特性或新工具，无需接入真实的集群，也不需要其他组件。
- **测试**：
  - 你可以衡量自己的应用程序或控制器在使用不同数量节点和 Pod 时的扩缩表现如何。
  - 你可以用不同的资源请求或限制创建大量 Pod 或服务，在集群上营造高负载的环境。
  - 你可以通过更改节点状况或随机删除节点来模拟节点故障或网络分区。
  - 你可以通过启用不同的特性门控或 API 版本来测试控制器如何与其他组件交互。

<!--
## What are the limitations?

KWOK is not intended to replace others completely. It has some limitations that you should be aware of:
-->
## 有哪些限制？   {#what-are-limiations}

KWOK 并非试图完整替代其他什么。当然也有一些限制需要你多加注意：

<!--
- **Functionality**: KWOK is not a kubelet and may exhibit different behaviors in areas such as pod lifecycle management, volume mounting, and device plugins. Its primary function is to simulate updates of node and pod status.
- **Accuracy**: It's important to note that KWOK doesn't accurately reflect the performance or behavior of real nodes under various workloads or environments. Instead, it approximates some behaviors using simple formulas.
- **Security**: KWOK does not enforce any security policies or mechanisms on simulated nodes. It assumes that all requests from the kube-apiserver are authorized and valid.
-->
- **功能性**：KWOK 不是 kubelet。KWOK 在 Pod 生命周期管理、卷挂载和设备插件方面所展现的行为与 kubelet 不同。
  KWOK 的主要功能是模拟节点和 Pod 状态的更新。
- **准确性**：需要重点注意 KWOK 还不能确切地反映各种工作负载或环境下真实节点的性能或行为。
  KWOK 只能使用一些公式来逼近真实的节点行为。
- **安全性**：KWOK 没有对模拟的节点实施任何安全策略或安全机制。
  KWOK 假定来自 kube-apiserver 的所有请求都是经过授权且是有效的。

<!--
## Getting started

If you are interested in trying out KWOK, please check its [documents] for more details.
-->
## 入门   {#getting-started}

如果你对试用 KWOK 感兴趣，请查阅 [KWOK 文档](https://kwok.sigs.k8s.io/)了解详情。

<!--
{{< figure src="/blog/2023/03/01/introducing-kwok/manage-clusters.svg" alt="Animation of a terminal showing kwokctl in use" caption="Using kwokctl to manage simulated clusters" >}}
-->
{{< figure src="/blog/2023/03/01/introducing-kwok/manage-clusters.svg" alt="在终端上使用 kwokctl 的动图" caption="使用 kwokctl 管理模拟的集群" >}}

<!--
## Getting Involved

If you're interested in participating in future discussions or development related to KWOK, there are several ways to get involved:
-->
## 欢迎参与   {#getting-involved}

如果你想参与讨论 KWOK 的未来或参与开发，可通过以下几种方式参与进来：

<!--
- Slack: [#kwok] for general usage discussion, [#kwok-dev] for development discussion. (visit [slack.k8s.io] for a workspace invitation)
- Open Issues/PRs/Discussions in [sigs.k8s.io/kwok]
-->
- Slack [#kwok] 讨论一般用法，Slack [#kwok-dev] 讨论开发问题（访问 [slack.k8s.io] 获取 KWOK 工作空间的邀请链接）
- 在 [sigs.k8s.io/kwok] 上提出 Issue/PR/Discussion

<!--
We welcome feedback and contributions from anyone who wants to join us in this exciting project.
-->
我们欢迎所有想要加入这个项目的贡献者，欢迎任何形式的反馈和贡献。

[documents]: https://kwok.sigs.k8s.io/
[sigs.k8s.io/kwok]: https://sigs.k8s.io/kwok/
[#kwok]: https://kubernetes.slack.com/messages/kwok/
[#kwok-dev]: https://kubernetes.slack.com/messages/kwok-dev/
[slack.k8s.io]: https://slack.k8s.io/
