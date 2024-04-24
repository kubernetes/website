---
layout: blog
title: "聚焦 SIG CLI"
date: 2023-07-20
slug: sig-cli-spotlight-2023
---

<!--
layout: blog
title: "Spotlight on SIG CLI"
date: 2023-07-20
slug: sig-cli-spotlight-2023
canonicalUrl: https://www.kubernetes.dev/blog/2023/07/13/sig-cli-spotlight-2023/
-->

<!--
**Author**: Arpit Agrawal
-->
**作者**：Arpit Agrawal

**译者**：Xin Li (Daocloud)

<!--
In the world of Kubernetes, managing containerized applications at
scale requires powerful and efficient tools. The command-line
interface (CLI) is an integral part of any developer or operator’s
toolkit, offering a convenient and flexible way to interact with a
Kubernetes cluster.
-->
在 Kubernetes 的世界中，大规模管理容器化应用程序需要强大而高效的工具。
命令行界面（CLI）是任何开发人员或操作人员工具包不可或缺的一部分，
其提供了一种方便灵活的方式与 Kubernetes 集群交互。

<!--
SIG CLI plays a crucial role in improving the [Kubernetes
CLI](https://github.com/kubernetes/community/tree/master/sig-cli)
experience by focusing on the development and enhancement of
`kubectl`, the primary command-line tool for Kubernetes.
-->
SIG CLI 通过专注于 Kubernetes 主要命令行工具 `kubectl` 的开发和增强，
在改善 [Kubernetes CLI](https://github.com/kubernetes/community/tree/master/sig-cli)
体验方面发挥着至关重要的作用。

<!--
In this SIG CLI Spotlight, Arpit Agrawal, SIG ContribEx-Comms team
member, talked with [Katrina Verey](https://github.com/KnVerey), Tech
Lead & Chair of SIG CLI,and [Maciej
Szulik](https://github.com/soltysh), SIG CLI Batch Lead, about SIG
CLI, current projects, challenges and how anyone can get involved.
-->
在本次 SIG CLI 聚焦中，SIG ContribEx-Comms 团队成员 Arpit Agrawal 与
SIG CLI 技术主管兼主席 [Katrina Verey](https://github.com/KnVerey)
和 SIG CLI Batch 主管 [Maciej Szulik](https://github.com/soltysh)
讨论了 SIG CLI 当前项目状态和挑战以及如何参与其中。

<!--
So, whether you are a seasoned Kubernetes enthusiast or just getting
started, understanding the significance of SIG CLI will undoubtedly
enhance your Kubernetes journey.
-->
因此，无论你是经验丰富的 Kubernetes 爱好者还是刚刚入门，了解
SIG CLI 的重要性无疑将增强你的 Kubernetes 之旅。

<!--
## Introductions

**Arpit**: Could you tell us a bit about yourself, your role, and how
you got involved in SIG CLI?
-->
## 简介

**Arpit**：你们能否向我们介绍一下你自己、你的角色以及你是如何参与 SIG CLI 的？

<!--
**Maciej**: I’m one of the technical leads for SIG-CLI. I was working
on Kubernetes in multiple areas since 2014, and in 2018 I got
appointed a lead.
-->
**Maciej**：我是 SIG-CLI 的技术负责人之一。自 2014 年以来，我一直在多个领域从事
Kubernetes 工作，并于 2018 年被任命为负责人。

<!--
**Katrina**: I’ve been working with Kubernetes as an end-user since
2016, but it was only in late 2019 that I discovered how well SIG CLI
aligned with my experience from internal projects. I started regularly
attending meetings and made a few small PRs, and by 2021 I was working
more deeply with the
[Kustomize](https://github.com/kubernetes-sigs/kustomize) team
specifically. Later that year, I was appointed to my current roles as
subproject owner for Kustomize and KRM Functions, and as SIG CLI Tech
Lead and Chair.
-->
**Katrina**：自 2016 年以来，我一直作为最终用户使用 Kubernetes，但直到 2019 年底，
我才发现 SIG CLI 与我在内部项目中的经验非常吻合。我开始定期参加会议并提交了一些小型 PR，
到 2021 年，我专门与 [Kustomize](https://github.com/kubernetes-sigs/kustomize)
团队进行了更深入的合作。同年晚些时候，我被任命担任目前的职务，担任 Kustomize 和
KRM Functions 的子项目 owner 以及 SIG CLI 技术主管和负责人。

<!--
## About SIG CLI

**Arpit**: Thank you! Could you share with us the purpose and goals of SIG CLI?
-->
## 关于 SIG CLI

**Arpit**：谢谢！你们能否与我们分享一下 SIG CLI 的宗旨和目标？

<!--
**Maciej**: Our
[charter](https://github.com/kubernetes/community/tree/master/sig-cli/)
has the most detailed description, but in few words, we handle all CLI
tooling that helps you manage your Kubernetes manifests and interact
with your Kubernetes clusters.
-->
**Maciej**：我们的[章程](https://github.com/kubernetes/community/tree/master/sig-cli/)有最详细的描述，
但简而言之，我们处理所有 CLI 工具，帮助你管理 Kubernetes 资源清单以及与 Kubernetes 集群进行交互。

<!--
**Arpit**: I see. And how does SIG CLI work to promote best-practices
for CLI development and usage in the cloud native ecosystem?
-->
**Arpit**：我明白了。请问 SIG CLI 如何致力于推广云原生生态系统中 CLI 开发和使用的最佳实践？

<!--
**Maciej**: Within `kubectl`, we have several on-going efforts that
try to encourage new contributors to align existing commands to new
standards. We publish several libraries which hopefully make it easier
to write CLIs that interact with Kubernetes APIs, such as cli-runtime
and
[kyaml](https://github.com/kubernetes-sigs/kustomize/tree/master/kyaml).
-->
**Maciej**：在 `kubectl` 中，我们正在进行多项努力，试图鼓励新的贡献者将现有命令与新标准保持一致。
我们发布了几个库，希望能够更轻松地编写与 Kubernetes API 交互的 CLI，例如 cli-runtime 和
[kyaml](https://github.com/kubernetes-sigs/kustomize/tree/master/kyaml)。

<!--
**Katrina**: We also maintain some interoperability specifications for
CLI tooling, such as the [KRM Functions
Specification](https://github.com/kubernetes-sigs/kustomize/blob/master/cmd/config/docs/api-conventions/functions-spec.md)
(GA) and the new ApplySet
Specification
(alpha).
-->
**Katrina**：我们还维护一些 CLI 工具的互操作性规范，例如
[KRM 函数规范](https://github.com/kubernetes-sigs/kustomize/blob/master/cmd/config/docs/api-conventions/functions-spec.md)（GA）
和新的 ApplySet 规范（Alpha）。

<!--
## Current projects and challenges

**Arpit**: Going through the README file, it’s clear SIG CLI has a
number of subprojects, could you highlight some important ones?
-->
## 当前的项目和挑战

**Arpit**：阅读了一遍 README 文件，发现 SIG CLI 有许多子项目，你能突出讲一些重要的子项目吗？

<!--
**Maciej**: The four most active subprojects that are, in my opinion,
worthy of your time investment would be:

* [`kubectl`](https://github.com/kubernetes/kubectl):  the canonical Kubernetes CLI.
* [Kustomize](https://github.com/kubernetes-sigs/kustomize): a
  template-free customization tool for Kubernetes yaml manifest files.
* [KUI](https://kui.tools) - a GUI interface to Kubernetes, think
   `kubectl` on steroids.
* [`krew`](https://github.com/kubernetes-sigs/krew): a plugin manager for `kubectl`.
-->
**Maciej**：在我看来，值得你投入时间的四个最活跃的子项目是：

* [`kubectl`](https://github.com/kubernetes/kubectl)：规范的 Kubernetes CLI。
* [Kustomize](https://github.com/kubernetes-sigs/kustomize)：Kubernetes yaml 清单文件的无模板定制工具。
* [KUI](https://kui.tools) - 一个针对 Kubernetes 的 GUI 界面，可以将其视为增强版的 `kubectl`。
* [`krew`](https://github.com/kubernetes-sigs/krew)：`kubectl` 的插件管理器。

<!--
**Arpit**: Are there any upcoming initiatives or developments that SIG
CLI is working on?

**Maciej**: There are always several initiatives we’re working on at
any given point in time. It’s best to join [one of our
calls](https://github.com/kubernetes/community/tree/master/sig-cli/#meetings)
to learn about the current ones.
-->
**Arpit**：SIG CLI 是否有任何正在开展或即将开展的计划或开发工作？

**Maciej**：在任何给定的时间点，我们总是在开展多项举措。
最好加入[我们的一个电话会议](https://github.com/kubernetes/community/tree/master/sig-cli/#meetings)来了解当前的情况。

<!--
**Katrina**: For major features, you can check out [our open
KEPs](https://www.kubernetes.dev/resources/keps/). For instance, in
1.27 we introduced alphas for [a new pruning mode in kubectl
apply](https://kubernetes.io/blog/2023/05/09/introducing-kubectl-applyset-pruning/),
and for kubectl create plugins. Exciting ideas that are currently
under discussion include an interactive mode for `kubectl` delete
([KEP
3895](https://kubernetes.io/blog/2023/05/09/introducing-kubectl-applyset-pruning))
and the `kuberc` user preferences file ([KEP
3104](https://kubernetes.io/blog/2023/05/09/introducing-kubectl-applyset-pruning)).
-->
对于主要功能，你可以查看[我们的开放 KEP](https://www.kubernetes.dev/resources/keps/)。
例如，在 1.27 中，我们为 [kubectl apply 中的新裁剪模式](https://kubernetes.io/blog/2023/05/09/introducing-kubectl-applyset-pruning/)
引入了新的 Alpha 特性，并为 kubectl 添加了插件。
目前正在讨论的令人兴奋的想法包括 `kubectl` 删除的交互模式（[KEP 3895](https://kubernetes.io/blog/2023/05/09/introducing-kubectl-applyset-pruning)）和
`kuberc` 用户首选项文件（[KEP 3104](https://kubernetes.io/blog/2023/05/09/introducing-kubectl-applyset-pruning)）。

<!--
**Arpit**: Could you discuss any challenges that SIG CLI faces in its
efforts to improve CLIs for cloud-native technologies? What are the
future efforts to solve them?
-->
**Arpit**：你们能否说说 SIG CLI 在改善云本地技术的 CLI 时面临的任何挑战？未来将采取哪些措施来解决这些问题？

<!--
**Katrina**: The biggest challenge we’re facing with every decision is
backwards compatibility and ensuring we don’t break existing users. It
frequently happens that fixing what's on the surface may seem
straightforward, but even fixing a bug could constitute a breaking
change for some users, which means we need to go through an extended
deprecation process to change it, or in some cases we can’t change it
at all. Another challenge is the need to balance customization with
usability in the flag sets we expose on our tools. For example, we get
many proposals for new flags that would certainly be useful to some
users, but not a large enough subset to justify the increased
complexity having them in the tool entails for everyone. The `kuberc`
proposal may help with some of these problems by giving individual
users the ability to set or override default values we can’t change,
and even create custom subcommands via aliases
-->
**Katrina**：我们每个决定面临的最大挑战是向后兼容性并确保我们不会影响现有用户。
经常发生的情况是，修复表面上的内容似乎很简单，但即使修复 bug 也可能对某些用户造成破坏性更改，
这意味着我们需要经历一个较长的弃用过程来更改它，或者在某些情况下我们不能完全改变它。
另一个挑战是我们需要在工具上公开 flag 的平衡定制和可用性。例如，我们收到了许多关于新标志的建议，
这些建议肯定对某些用户有用，但没有足够大的子集来证明，将它们添加到工具中对每个用户来说都会增加复杂性。
`kuberc` 提案可能会帮助个人用户设置或覆盖我们无法更改的默认值，甚至通过别名创建自定义子命令，
从而帮助解决其中一些问题。

<!--
**Arpit**: With every new version release of Kubernetes, maintaining
consistency and integrity is surely challenging: how does the SIG CLI
team tackle it?
-->
**Arpit**：随着 Kubernetes 的每个新版本的发布，保持一致性和完整性无疑是一项挑战：
SIG CLI 团队如何解决这个问题？

<!--
**Maciej**: This is mostly similar to the topic mentioned in the
previous question: every new change, especially to existing commands
goes through a lot of scrutiny to ensure we don’t break existing
users. At any point in time we have to keep a reasonable balance
between features and not breaking users.
-->
**Maciej**：这与上一个问题中提到的主题非常相似：每一个新的更改，尤其是对现有命令的更改，
都会经过大量的审查，以确保我们不会影响现有用户。在任何时候我们都必须在功能和不影响用户之间保持合理的平衡。

<!--
## Future plans and contribution

**Arpit**: How do you see the role of CLI tools in the cloud-native
ecosystem evolving in the future?
-->
## 未来计划及贡献

**Arpit**：你们如何看待 CLI 工具在未来云原生生态系统中的作用？

<!--
**Maciej**: I think that CLI tools were and will always be an
important piece of the ecosystem. Whether used by administrators on
remote machines that don’t have GUI or in every CI/CD pipeline, they
are irreplaceable.
-->
**Maciej**：我认为 CLI 工具曾经并将永远是生态系统的重要组成部分。
无论是管理员在没有 GUI 的远程计算机上还是在每个 CI/CD 管道中使用，它们都是不可替代的。

<!--
**Arpit**: Kubernetes is a community-driven project. Any
recommendation for anyone looking into getting involved in SIG CLI
work? Where should they start? Are there any prerequisites?

**Maciej**: There are no prerequisites other than a little bit of free
time on your hands and willingness to learn something new :-)
-->
**Arpit**：Kubernetes 是一个社区驱动的项目。对于想要参与 SIG CLI 工作的人有什么建议吗？
他们应该从哪里开始？有什么先决条件吗？

**Maciej**：除了有一点空闲时间和学习新东西的意愿之外，没有任何先决条件 :-)

<!--
**Katrina**: A working knowledge of [Go](https://go.dev/) often helps,
but we also have areas in need of non-code contributions, such as the
[Kustomize docs consolidation
project](https://github.com/kubernetes-sigs/kustomize/issues/4338).
-->
**Katrina**：[Go](https://go.dev/) 的实用知识通常会有所帮助，但我们也有需要非代码贡献的领域，
例如 [Kustomize 文档整合项目](https://github.com/kubernetes-sigs/kustomize/issues/4338)。
