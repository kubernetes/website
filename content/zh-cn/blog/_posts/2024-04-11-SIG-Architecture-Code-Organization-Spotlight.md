---
layout: blog
title: "SIG Architecture 特别报道：代码组织"
slug: sig-architecture-code-spotlight-2024
canonicalUrl: https://www.kubernetes.dev/blog/2024/04/11/sig-architecture-code-spotlight-2024
date: 2024-04-11
---

<!--
layout: blog
title: "Spotlight on SIG Architecture: Code Organization"
slug: sig-architecture-code-spotlight-2024
canonicalUrl: https://www.kubernetes.dev/blog/2024/04/11/sig-architecture-code-spotlight-2024
date: 2024-04-11
author: >
  Frederico Muñoz (SAS Institute)
-->

**作者:** Frederico Muñoz (SAS Institute)

**译者:** Xin Li (DaoCloud)

<!--
_This is the third interview of a SIG Architecture Spotlight series that will cover the different
subprojects. We will cover [SIG Architecture: Code Organization](https://github.com/kubernetes/community/blob/e44c2c9d0d3023e7111d8b01ac93d54c8624ee91/sig-architecture/README.md#code-organization)._

In this SIG Architecture spotlight I talked with [Madhav Jivrajani](https://github.com/MadhavJivrajani)
(VMware), a member of the Code Organization subproject.
-->
**这是 SIG Architecture Spotlight 系列的第三次采访，该系列将涵盖不同的子项目。
我们将介绍 [SIG Architecture：代码组织](https://github.com/kubernetes/community/blob/e44c2c9d0d3023e7111d8b01ac93d54c8624ee91/sig-architecture/README.md#code-organization)。**

在本次 SIG Architecture 聚焦中，我与代码组织子项目的成员
[Madhav Jivrajani](https://github.com/MadhavJivrajani)（VMware）进行了交谈。

<!--
## Introducing the Code Organization subproject

**Frederico (FSM)**: Hello Madhav, thank you for your availability. Could you start by telling us a
bit about yourself, your role and how you got involved in Kubernetes?
-->
## 介绍代码组织子项目

**Frederico (FSM)**：你好，Madhav，感谢你百忙之中接受我们的采访。你能否首先向我们介绍一下你自己、你的角色以及你是如何参与 Kubernetes 的？

<!--
**Madhav Jivrajani (MJ)**: Hello! My name is Madhav Jivrajani, I serve as a technical lead for SIG
Contributor Experience and a GitHub Admin for the Kubernetes project. Apart from that I also
contribute to SIG API Machinery and SIG Etcd, but more recently, I’ve been helping out with the work
that is needed to help Kubernetes [stay on supported versions of
Go](https://github.com/kubernetes/enhancements/tree/cf6ee34e37f00d838872d368ec66d7a0b40ee4e6/keps/sig-release/3744-stay-on-supported-go-versions),
and it is through this that I am involved with the Code Organization subproject of SIG Architecture.
-->
**Madhav Jivrajani (MJ)**：你好！我叫 Madhav Jivrajani，担任 SIG 贡献者体验的技术主管和 Kubernetes 项目的 GitHub 管理员。
除此之外，我还为 SIG API Machinery 和 SIG Etcd 做出贡献，但最近，我一直在帮助完成 Kubernetes
[保留受支持的 Go 版本](https://github.com/kubernetes/enhancements/tree/cf6ee34e37f00d838872d368ec66d7a0b40ee4e6/keps/sig-release/3744-stay-on-supported-go-versions) 所需的工作，
正是通过这一点，参与到了 SIG Architecture 的代码组织子项目中。

<!--
**FSM**: A project the size of Kubernetes must have unique challenges in terms of code organization
-- is this a fair assumption?  If so, what would you pick as some of the main challenges that are
specific to Kubernetes?
-->
**FSM**：像 Kubernetes 这样规模的项目在代码组织方面肯定会遇到独特的挑战 -- 这是一个合理的假设吗？
如果是这样，你认为 Kubernetes 特有的一些主要挑战是什么？

<!--
**MJ**: That’s a fair assumption! The first interesting challenge comes from the sheer size of the
Kubernetes codebase. We have ≅2.2 million lines of Go code (which is steadily decreasing thanks to
[dims](https://github.com/dims) and other folks in this sub-project!), and a little over 240
dependencies that we rely on either directly or indirectly, which is why having a sub-project
dedicated to helping out with dependency management is crucial: we need to know what dependencies
we’re pulling in, what versions these dependencies are at, and tooling to help make sure we are
managing these dependencies across different parts of the codebase in a consistent manner.
-->
**MJ**：这是一个合理的假设！第一个有趣的挑战来自 Kubernetes 代码库的庞大规模。
我们有大约 220 万行 Go 代码（由于 [dims](https://github.com/dims) 和这个子项目中的其他人的努力，该代码正在稳步减少！），
而且我们的依赖项（无论是直接还是间接）超过 240 个，这就是为什么拥有一个致力于帮助进行依赖项管理的子项目至关重要：
我们需要知道我们正在引入哪些依赖项，这些依赖项处于什么版本，
以及帮助确保我们能够以一致的方式管理代码库不同部分的依赖关系的工具。
以一致的方式管理代码库不同部分的这些依赖关系。

<!--
Another interesting challenge with Kubernetes is that we publish a lot of Go modules as part of the
Kubernetes release cycles, one example of this is
[`client-go`](https://github.com/kubernetes/client-go).However, we as a project would also like the
benefits of having everything in one repository to get the advantages of using a monorepo, like
atomic commits... so, because of this, code organization works with other SIGs (like SIG Release) to
automate the process of publishing code from the monorepo to downstream individual repositories
which are much easier to consume, and this way you won’t have to import the entire Kubernetes
codebase!
-->
Kubernetes 的另一个有趣的挑战是，我们在 Kubernetes 发布周期中发布了许多 Go 模块，其中一个例子是
[`client-go`](https://github.com/kubernetes/client-go)。
然而，作为一个项目，我们也希望将所有内容都放在一个仓库中，便获得使用单一仓库的优势，例如原子性的提交……
因此，代码组织与其他 SIG（例如 SIG Release）合作，以实现将代码从单一仓库发布到下游仓库的自动化过程，
下游仓库更容易使用，因为你就不必导入整个 Kubernetes 代码库！

<!--
## Code organization and Kubernetes

**FSM**: For someone just starting contributing to Kubernetes code-wise, what are the main things
they should consider in terms of code organization? How would you sum up the key concepts?

**MJ**: I think one of the key things to keep in mind at least as you’re starting off is the concept
of staging directories. In the [`kubernetes/kubernetes`](https://github.com/kubernetes/kubernetes)
repository, you will come across a directory called
[`staging/`](https://github.com/kubernetes/kubernetes/tree/master/staging). The sub-folders in this
directory serve as a bunch of pseudo-repositories. For example, the
[`kubernetes/client-go`](https://github.com/kubernetes/client-go) repository that publishes releases
for `client-go` is actually a [staging
repo](https://github.com/kubernetes/kubernetes/tree/master/staging/src/k8s.io/client-go).
-->
## 代码组织和 Kubernetes

**FSM**：对于刚刚开始为 Kubernetes 代码做出贡献的人来说，在代码组织方面他们应该考虑的主要事项是什么？
你认为有哪些关键概念？

**MJ**：我认为至少在开始时要记住的关键事情之一是 staging 目录的概念。
在 [`kubernetes/kubernetes`](https://github.com/kubernetes/kubernetes) 中，你会遇到一个名为
[`staging/`](https://github.com/kubernetes/kubernetes/tree/master/staging) 的目录。
该目录中的子文件夹充当一堆伪仓库。
例如，发布 `client-go` 版本的 [`kubernetes/client-go`](https://github.com/kubernetes/client-go)
仓库实际上是一个 [staging 仓库](https://github.com/kubernetes/kubernetes/tree/master/staging/src/k8s.io/client-go)。

<!--
**FSM**: So the concept of staging directories fundamentally impact contributions?

**MJ**: Precisely, because if you’d like to contribute to any of the staging repos, you will need to
send in a PR to its corresponding staging directory in `kubernetes/kubernetes`. Once the code merges
there, we have a bot called the [`publishing-bot`](https://github.com/kubernetes/publishing-bot)
that will sync the merged commits to the required staging repositories (like
`kubernetes/client-go`). This way we get the benefits of a monorepo but we also can modularly
publish code for downstream consumption. PS: The `publishing-bot` needs more folks to help out!

For more information on staging repositories, please see the [contributor
documentation](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/staging.md).
-->

**FSM**：那么 staging 目录的概念会从根本上影响贡献？

**MJ**：准确地说，因为如果你想为任何 staging 仓库做出贡献，你需要将 PR 发送到 `kubernetes/kubernetes` 中相应的 staging 目录。
一旦代码合并到那里，我们就会让一个名为 [`publishing-bot`](https://github.com/kubernetes/publishing-bot)
的机器人将合并的提交同步到必要的 staging 仓库（例如 `kubernetes/client-go`）中。
通过这种方式，我们可以获得单一仓库的好处，但我们也可以以模块化的形式发布代码以供下游使用。
PS：`publishing-bot` 需要更多人的帮助！

<!--
**FSM**: Speaking of contributions, the very high number of contributors, both individuals and
companies, must also be a challenge: how does the subproject operate in terms of making sure that
standards are being followed?
-->
**FSM**：说到贡献，贡献者数量非常多，包括个人和公司，也一定是一个挑战：这个子项目是如何运作的以确保大家都遵循标准呢？

<!--
**MJ**: When it comes to dependency management in the project, there is a [dedicated
team](https://github.com/kubernetes/org/blob/a106af09b8c345c301d072bfb7106b309c0ad8e9/config/kubernetes/org.yaml#L1329)
that helps review and approve dependency changes. These are folks who have helped lay the foundation
of much of the
[tooling](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/vendor.md)
that Kubernetes uses today for dependency management. This tooling helps ensure there is a
consistent way that contributors can make changes to dependencies. The project has also worked on
additional tooling to signal statistics of dependencies that is being added or removed:
[`depstat`](https://github.com/kubernetes-sigs/depstat)
-->
**MJ**：当涉及到项目中的依赖关系管理时，
有一个[专门团队](https://github.com/kubernetes/org/blob/a106af09b8c345c301d072bfb7106b309c0ad8e9/config/kubernetes/org.yaml#L1329)帮助审查和批准依赖关系更改。
这些人为目前 Kubernetes 用于管理依赖的许多[工具](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/vendor.md)做了开拓性的工作。
这些工具帮助我们确保贡献者可以以一致的方式更改依赖项。
这个子项目还开发了其他工具来基于被添加或删除的依赖项的统计信息发出通知：
[`depstat`](https://github.com/kubernetes-sigs/depstat)

<!--
Apart from dependency management, another crucial task that the project does is management of the
staging repositories. The tooling for achieving this (`publishing-bot`) is completely transparent to
contributors and helps ensure that the staging repos get a consistent view of contributions that are
submitted to `kubernetes/kubernetes`.

Code Organization also works towards making sure that Kubernetes [stays on supported versions of
Go](https://github.com/kubernetes/enhancements/tree/cf6ee34e37f00d838872d368ec66d7a0b40ee4e6/keps/sig-release/3744-stay-on-supported-go-versions). The
linked KEP provides more context on why we need to do this. We collaborate with SIG Release to
ensure that we are testing Kubernetes as rigorously and as early as we can on Go releases and
working on changes that break our CI as a part of this. An example of how we track this process can
be found [here](https://github.com/kubernetes/release/issues/3076).
-->
除了依赖管理之外，这个项目执行的另一项重要任务是管理 staging 仓库。
用于实现此目的的工具（`publishing-bot`）对贡献者完全透明，
有助于确保就提交给 `kubernetes/kubernetes` 的贡献而言，各个 staging 仓库获得的视图是一致的。

代码组织还致力于确保 Kubernetes
[一直在使用受支持的 Go 版本](https://github.com/kubernetes/enhancements/tree/cf6ee34e37f00d838872d368ec66d7a0b40ee4e6/keps/sig-release/3744-stay-on-supported-go-versions)。
链接所指向的 KEP 中包含更详细的背景信息，用来说明为什么我们需要这样做。
我们与 SIG Release 合作，确保我们在 Go 版本上尽可能严格、尽早地测试 Kubernetes；
作为这些工作的一部分，我们要处理会破坏我们的 CI 的那些变更。
我们如何跟踪此过程的示例可以在[此处](https://github.com/kubernetes/release/issues/3076)找到。

<!--
## Release cycle and current priorities

**FSM**: Is there anything that changes during the release cycle?

**MJ** During the release cycle, specifically before code freeze, there are often changes that go in
that add/update/delete dependencies, fix code that needs fixing as part of our effort to stay on
supported versions of Go.

Furthermore, some of these changes are also candidates for
[backporting](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/cherry-picks.md)
to our supported release branches.
-->
## 发布周期和当前优先级

**FSM**：在发布周期中有什么变化吗？

**MJ**：在发布周期内，特别是在代码冻结之前，通常会发生添加、更新、删除依赖项的变更，以及修复需要修复的代码等更改，
这些都是我们继续使用受支持的 Go 版本的努力的一部分。

此外，其中一些更改也可以[向后移植](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/cherry-picks.md)
到我们支持的发布分支。

<!--
**FSM**: Is there any major project or theme the subproject is working on right now that you would
like to highlight?

**MJ**: I think one very interesting and immensely useful change that
has been recently added (and I take the opportunity to specifically
highlight the work of [Tim Hockin](https://github.com/thockin) on
this) is the introduction of [Go workspaces to the Kubernetes
repo](https://www.kubernetes.dev/blog/2024/03/19/go-workspaces-in-kubernetes/). A lot of our
current tooling for dependency management and code publishing, as well
as the experience of editing code in the Kubernetes repo, can be
significantly improved by this change.
-->
**FSM**：就子项目中目前正在进行的主要项目或主题而言你有什么要特别强调的吗？

**MJ**：我认为最近添加的一个非常有趣且非常有用的变更（我借这个机会特别强调
[Tim Hockin](https://github.com/thockin) 在这方面的工作）是引入
[Go 工作空间的概念到Kubernetes 仓库中](https://www.kubernetes.dev/blog/2024/03/19/go-workspaces-in-kubernetes/)。
我们当前的许多依赖管理和代码发布工具，以及在 Kubernetes 仓库中编辑代码的体验，
都可以通过此更改得到显着改善。

<!--
## Wrapping up

**FSM**: How would someone interested in the topic start helping the subproject?

**MJ**: The first step, as is the first step with any project in Kubernetes, is to join our slack:
[slack.k8s.io](https://slack.k8s.io), and after that join the `#k8s-code-organization` channel. There is also a
[code-organization office
hours](https://github.com/kubernetes/community/tree/master/sig-architecture#meetings) that takes
place that you can choose to attend. Timezones are hard, so feel free to also look at the recordings
or meeting notes and follow up on slack!
-->
## 收尾

**FSM**：对这个主题感兴趣的人要怎样开始帮助这个子项目？

**MJ**：与 Kubernetes 中任何项目的第一步一样，第一步是加入我们的
Slack：[slack.k8s.io](https://slack.k8s.io)，然后加入 `#k8s-code-organization` 频道，
你还可以选择参加[代码组织办公时间](https://github.com/kubernetes/community/tree/master/sig-architecture#meetings)。
时区是个困难点，所以请随时查看录音或会议记录并跟进 Slack！

<!--
**FSM**: Excellent, thank you! Any final comments you would like to share?

**MJ**: The Code Organization subproject always needs help! Especially areas like the publishing
bot, so don’t hesitate to get involved in the `#k8s-code-organization` Slack channel.
-->
**FSM**：非常好，谢谢！最后你还有什么想分享的吗？

**MJ**：代码组织子项目总是需要帮助！特别是像发布机器人这样的领域，所以请不要犹豫，参与到 `#k8s-code-organization` Slack 频道中。
