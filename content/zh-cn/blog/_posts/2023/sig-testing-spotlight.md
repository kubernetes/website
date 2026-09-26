---
layout: blog
title: "聚焦 SIG Testing"
slug: sig-testing-spotlight-2023
date: 2023-11-24
---
<!--
layout: blog
title: "Spotlight on SIG Testing"
slug: sig-testing-spotlight-2023
date: 2023-11-24
canonicalUrl: https://www.kubernetes.dev/blog/2023/11/24/sig-testing-spotlight-2023/
-->

**作者:** Sandipan Panda

**译者:** [Michael Yao](https://github.com/windsonsea)

<!--
Welcome to another edition of the _SIG spotlight_ blog series, where we
highlight the incredible work being done by various Special Interest
Groups (SIGs) within the Kubernetes project. In this edition, we turn
our attention to [SIG Testing](https://github.com/kubernetes/community/tree/master/sig-testing#readme),
a group interested in effective testing of Kubernetes and automating
away project toil. SIG Testing focus on creating and running tools and
infrastructure that make it easier for the community to write and run
tests, and to contribute, analyze and act upon test results.
-->
欢迎阅读又一期的 “SIG 聚光灯” 系列博客，这些博客重点介绍 Kubernetes
项目中各个特别兴趣小组（SIG）所从事的令人赞叹的工作。这篇博客将聚焦
[SIG Testing](https://github.com/kubernetes/community/tree/master/sig-testing#readme)，
这是一个致力于有效测试 Kubernetes，让此项目的繁琐工作实现自动化的兴趣小组。
SIG Testing 专注于创建和运行工具和基础设施，使社区更容易编写和运行测试，并对测试结果做贡献、分析和处理。

<!--
To gain some insights into SIG Testing, [Sandipan
Panda](https://github.com/sandipanpanda) spoke with [Michelle Shepardson](https://github.com/michelle192837),
a senior software engineer at Google and a chair of SIG Testing, and
[Patrick Ohly](https://github.com/pohly), a software engineer and architect at
Intel and a SIG Testing Tech Lead.
-->
为了深入了解 SIG Testing 的情况，
[Sandipan Panda](https://github.com/sandipanpanda)
采访了 Google 高级软件工程师兼 SIG Testing 主席
[Michelle Shepardson](https://github.com/michelle192837)
以及英特尔软件工程师、架构师兼 SIG Testing 技术负责人
[Patrick Ohly](https://github.com/pohly)。

<!--
## Meet the contributors

**Sandipan:** Could you tell us a bit about yourself, your role, and
how you got involved in the Kubernetes project and SIG Testing?
-->
## 会见贡献者   {#meet-the-contributors}

**Sandipan:** 你能简单介绍一下自己吗，谈谈你的职责角色以及你是如何参与
Kubernetes 项目和 SIG Testing 的？

<!--
**Michelle:** Hi! I'm Michelle, a senior software engineer at
Google. I first got involved in Kubernetes through working on tooling
for SIG Testing, like the external instance of TestGrid. I'm part of
oncall for TestGrid and Prow, and am now a chair for the SIG.
-->
**Michelle:** 嗨！我是 Michelle，是 Google 高级软件工程师。
我最初是为 SIG Testing 开发工具（如 TestGrid 的外部实例）而参与到 Kubernetes 项目的。
我是 TestGrid 和 Prow 的轮值人员，现在也是这个 SIG 的主席。

<!--
**Patrick:** Hello! I work as a software engineer and architect in a
team at Intel which focuses on open source Cloud Native projects. When
I ramped up on Kubernetes to develop a storage driver, my very first
question was "how do I test it in a cluster and how do I log
information?" That interest led to various enhancement proposals until
I had (re)written enough code that also took over official roles as
SIG Testing Tech Lead (for the [E2E framework](https://github.com/kubernetes-sigs/e2e-framework)) and
structured logging WG lead.
-->
**Patrick:** 你好！我在英特尔的一个团队中担任软件工程师和架构师，专注于开源云原生项目。
当我开始学习 Kubernetes 开发存储驱动时，我最初的问题是“如何在集群中进行测试以及如何记录信息？”
这个兴趣点引发了各种增强提案，直到我（重新）编写了足够多的代码，也正式担任了 SIG Testing 技术负责人
（负责 [E2E 框架](https://github.com/kubernetes-sigs/e2e-framework)）兼结构化日志工作组负责人。

<!--
## Testing practices and tools

**Sandipan:** Testing is a field in which multiple approaches and
tools exist; how did you arrive at the existing practices?
-->
## 测试实践和工具    {#testing-practices-and-tools}

**Sandipan:** 测试是一个存在多种方法和工具的领域，你们是如何形成现有实践方式的？

<!--
**Patrick:** I can’t speak about the early days because I wasn’t
around yet 😆, but looking back at some of the commit history it’s
pretty obvious that developers just took what was available and
started using it. For E2E testing, that was
[Ginkgo+Gomega](https://github.com/onsi/ginkgo). Some hacks were
necessary, for example around cleanup after a test run and for
categorising tests. Eventually this led to Ginkgo v2 and [revised best
practices for E2E testing](https://www.kubernetes.dev/blog/2023/04/12/e2e-testing-best-practices-reloaded/).
Regarding unit testing opinions are pretty diverse: some maintainers
prefer to use just the Go standard library with hand-written
checks. Others use helper packages like stretchr/testify. That
diversity is okay because unit tests are self-contained - contributors
just have to be flexible when working on many different areas.
Integration testing falls somewhere in the middle. It’s based on Go
unit tests, but needs complex helper packages to bring up an apiserver
and other components, then runs tests that are more like E2E tests.
-->
**Patrick:** 我没法谈论早期情况，因为那时我还未参与其中 😆，但回顾一些提交历史可以明显看出，
当时开发人员只是看看有什么可用的工具并开始使用这些工具。对于 E2E 测试来说，使用的是
[Ginkgo + Gomega](https://github.com/onsi/ginkgo)。集成一些黑科技是必要的，
例如在测试运行后进行清理和对测试进行分类。最终形成了 Ginkgo v2
和[重新修订的 E2E 测试最佳实践](https://www.kubernetes.dev/blog/2023/04/12/e2e-testing-best-practices-reloaded/)。
关于单元测试，意见非常多样化：一些维护者倾向于只使用 Go 标准库和手动检查。
而其他人使用 stretchr/testify 这类辅助工具包。这种多样性是可以接受的，因为单元测试是自包含的：
贡献者只需在处理许多不同领域时保持灵活。集成测试介于二者之间，它基于 Go 单元测试，
但需要复杂的辅助工具包来启动 API 服务器和其他组件，然后运行更像是 E2E 测试的测试。

<!--
## Subprojects owned by SIG Testing

**Sandipan:** SIG Testing is pretty diverse. Can you give a brief
overview of the various subprojects owned by SIG Testing?
-->
## SIG Testing 拥有的子项目    {#subprojects-owned-by-sig-testing}

**Sandipan:** SIG Testing 非常多样化。你能简要介绍一下 SIG Testing 拥有的各个子项目吗？

<!--
**Michelle:** Broadly, we have subprojects related to testing
frameworks, and infrastructure, though they definitely overlap.  So
for the former, there's
[e2e-framework](https://pkg.go.dev/sigs.k8s.io/e2e-framework) (used
externally),
[test/e2e/framework](https://pkg.go.dev/k8s.io/kubernetes/test/e2e/framework)
(used for Kubernetes itself) and kubetest2 for end-to-end testing,
as well as boskos (resource rental for e2e tests),
[KIND](https://kind.sigs.k8s.io/) (Kubernetes-in-Docker, for local
testing and development), and the cloud provider for KIND.  For the
latter, there's [Prow](https://docs.prow.k8s.io/) (K8s-based CI/CD and
chatops), and a litany of other tools and utilities for triage,
analysis, coverage, Prow/TestGrid config generation, and more in the
test-infra repo.
-->
**Michelle:** 广义上来说，我们拥有与测试框架相关的子项目和基础设施，尽管它们肯定存在重叠。
我们的子项目包括：

- [e2e-framework](https://pkg.go.dev/sigs.k8s.io/e2e-framework)（外部使用）
- [test/e2e/framework](https://pkg.go.dev/k8s.io/kubernetes/test/e2e/framework)
  （用于 Kubernetes 本身）
- kubetest2（用于端到端测试）
- boskos（用于 e2e 测试的资源租赁）
- [KIND](https://kind.sigs.k8s.io/)（在 Docker 中运行 Kubernetes，用于本地测试和开发）
- 以及 KIND 的云驱动。

我们的基础设施包括：

- [Prow](https://docs.prow.k8s.io/)（基于 K8s 的 CI/CD 和 chatops）
- test-infra 仓库中用于分类、分析、覆盖率、Prow/TestGrid 配置生成等的其他工具和实用程序。

<!--
*If you are willing to learn more and get involved with any of the SIG
Testing subprojects, check out the [SIG Testing README](https://github.com/kubernetes/community/tree/master/sig-testing#subprojects).*
-->
**如果你有兴趣了解更多并参与到 SIG Testing 的任何子项目中，查阅
[SIG Testing 的 README](https://github.com/kubernetes/community/tree/master/sig-testing#subprojects)。**

<!--
## Key challenges and accomplishments

**Sandipan:** What are some of the key challenges you face?
-->
## 主要挑战和成就    {#key-challenges-and-accomplishments}

**Sandipan:** 你们面临的一些主要挑战是什么？

<!--
**Michelle:** Kubernetes is a gigantic project in every aspect, from
contributors to code to users and more. Testing and infrastructure
have to meet that scale, keeping up with every change from every repo
under Kubernetes while facilitating developing, improving, and
releasing the project as much as possible, though of course, we're not
the only SIG involved in that.  I think another other challenge is
staffing subprojects. SIG Testing has a number of subprojects that
have existed for years, but many of the original maintainers for them
have moved on to other areas or no longer have the time to maintain
them. We need to grow long-term expertise and owners in those
subprojects.
-->
**Michelle:** Kubernetes 从贡献者到代码再到用户等各方面看都是一个庞大的项目。
测试和基础设施必须满足这种规模，跟上 Kubernetes 每个仓库的所有变化，
同时尽可能地促进开发、改进和发布项目，尽管当然我们并不是唯一参与其中的 SIG。
我认为另一个挑战是子项目的人员配置。SIG Testing 有一些已经存在多年的子项目，
但其中许多最初的维护者已经转到其他领域或者没有时间继续维护它们。
我们需要在这些子项目中培养长期的专业知识和 Owner。

<!--
**Patrick:** As Michelle said, the sheer size can be a challenge. It’s
not just the infrastructure, also our processes must scale with the
number of contributors. It’s good to document best practices, but not
good enough: we have many new contributors, which is good, but having
reviewers explain best practices doesn’t scale - assuming that the
reviewers even know about them! It also doesn’t help that existing
code cannot get updated immediately because there is so much of it, in
particular for E2E testing. The initiative to [apply stricter linting to new or modified code](https://groups.google.com/a/kubernetes.io/g/dev/c/myGiml72IbM/m/QdO5bgQiAQAJ)
while accepting that existing code doesn’t pass those same linter
checks helps a bit.
-->
**Patrick:** 正如 Michelle 所说，规模本身可能就是一个挑战。
不仅基础设施要与之匹配，我们的流程也必须与贡献者数量相匹配。
记录最佳实践是好的，但还不够好：我们有许多新的贡献者，这是好事，
但是让 Reviewer 靠人工解释最佳实践并不可行，这前提是 Reviewer 了解这些最佳实践！
如果现有代码不能被立即更新也无济于事，因为代码实在太多了，特别是对于 E2E 测试来说更是如此。
在接受现有代码无法通过同样的 linter 检查的同时，
[为新代码或代码修改应用更严格的 lint 检查](https://groups.google.com/a/kubernetes.io/g/dev/c/myGiml72IbM/m/QdO5bgQiAQAJ)对于改善情况会有所帮助。

<!--
**Sandipan:** Any SIG accomplishments that you are proud of and would
like to highlight?
-->
**Sandipan:** 有没有一些 SIG 成就使你感到自豪，想要重点说一下？

<!--
**Patrick:** I am biased because I have been driving this, but I think
that the [E2E framework](https://github.com/kubernetes-sigs/e2e-framework) and linting are now in a much better shape than
they used to be. We may soon be able to run integration tests with
race detection enabled, which is important because we currently only
have that for unit tests and those tend to be less complex.
-->
**Patrick:** 我有一些拙见，因为我一直在推动这个项目，但我认为现在
[E2E 框架](https://github.com/kubernetes-sigs/e2e-framework)和 lint 机制比以前好得多。
我们可能很快就能在启用竞争检测的情况下运行集成测试，这很重要，
因为目前我们只能对单元测试进行竞争检测，而那些往往不太复杂。

<!--
**Sandipan:** Testing is always important, but is there anything
specific to your work in terms of the Kubernetes release process?
-->
**Sandipan:** 测试始终很重要，但在 Kubernetes 发布过程中，你的工作是否有任何特殊之处？

<!--
**Patrick:** [test flakes](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-testing/flaky-tests.md)…
if we have too many of those, development velocity goes down because
PRs cannot be merged without clean test runs and those become less
likely. Developers also lose trust in testing and just "retest" until
they have a clean run, without checking whether failures might indeed
be related to a regression in their current change.
-->
**Patrick:** [测试不稳定](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-testing/flaky-tests.md)……
如果我们有太多这样的不稳定测试，开发速度就会下降，因为我们无法在没有干净测试运行环境的情况下合并 PR，
并且这些环境会越来越少。开发者也会失去对测试的信任，只是“重新测试”直到有了一个干净的运行环境为止，
而不会检查失败是否确实与当前更改中的回归有关。

<!--
## The people and the scope

**Sandipan:** What are some of your favourite things about this SIG?
-->
## 人员和范围    {#the-people-and-the-scope}

**Sandipan:** 这个 SIG 中有哪些让你热爱的？

<!--
**Michelle:** The people, of course 🙂. Aside from that, I like the
broad scope SIG Testing has. I feel like even small changes can make a
big difference for fellow contributors, and even if my interests
change over time, I'll never run out of projects to work on.
-->
**Michelle:** 当然是人 🙂。除此之外，我喜欢 SIG Testing 的宽广范围。
我觉得即使是小的改动也可以对其他贡献者产生重大影响，即使随着时间的推移我的兴趣发生变化，
我也永远不会缺少项目可供我参与。

<!--
**Patrick:** I can work on things that make my life and the life of my
fellow developers better, like the tooling that we have to use every
day while working on some new feature elsewhere.

**Sandipan:** Are there any funny / cool / TIL anecdotes that you
could tell us?
-->
**Patrick:** 我的工作是为了让我和其他开发人员的工作变得更好，
比如建设在其他地方开发新特性时每天必须使用的工具。

**Sandipan:** 你们有没有任何好玩/酷炫/日常趣事可以告诉我们？

<!--
**Patrick:** I started working on E2E framework enhancements five
years ago, then was less active there for a while. When I came back
and wanted to test some new enhancement, I asked about how to write
unit tests for the new code and was pointed to some existing tests
which looked vaguely familiar, as if I had *seen* them before. I
looked at the commit history and found that I had *written* them! I’ll
let you decide whether that says something about my failing long-term
memory or simply is normal… Anyway, folks, remember to write good
commit messages and comments; someone will need them at some point -
it might even be yourself!
-->
**Patrick:** 五年前，我开始致力于 E2E 框架的增强，然后在一段时间内参与活动较少。
当我回来并想要测试一些新的增强功能时，我询问如何为新代码编写单元测试，
并被指向了一些看起来有些熟悉的、好像以前**见过**的现有测试。
我查看了提交历史，发现这些测试是我自己**编写的**！
你可以决定这是否说明了我的长期记忆力衰退还是这很正常...
无论如何，伙计们，要谨记让每个 Commit 的消息和注释明确、友好；
某一刻会有人需要看这些消息和注释 - 甚至可能就是你自己！

<!--
## Looking ahead

**Sandipan:** What areas and/or subprojects does your SIG need help with?
-->
## 展望未来    {#looking-ahead}

**Sandipan:** 在哪些领域和/或子项目上，你们的 SIG 需要帮助？

<!--
**Michelle:** Some subprojects aren't staffed at the moment and could
use folks willing to learn more about
them. [boskos](https://github.com/kubernetes-sigs/boskos#boskos) and
[kubetest2](https://github.com/kubernetes-sigs/kubetest2#kubetest2)
especially stand out to me, since both are important for testing but
lack dedicated owners.
-->
**Michelle:** 目前有一些子项目没有人员配置，需要有意愿了解更多的人参与进来。
[boskos](https://github.com/kubernetes-sigs/boskos#boskos) 和
[kubetest2](https://github.com/kubernetes-sigs/kubetest2#kubetest2) 对我来说尤其突出，
因为它们对于测试非常重要，但却缺乏专门的负责人。

<!--
**Sandipan:** Are there any useful skills that new contributors to SIG
Testing can bring to the table? What are some things that people can
do to help this SIG if they come from a background that isn’t directly
linked to programming?
-->
**Sandipan:** 新的 SIG Testing 贡献者可以带来哪些有用的技能？
如果他们的背景与编程没有直接关联，有哪些方面可以帮助到这个 SIG？

<!--
**Michelle:** I think user empathy, writing clear feedback, and
recognizing patterns are really useful. Someone who uses the test
framework or tooling and can outline pain points with clear examples,
or who can recognize a wider issue in the project and pull data to
inform solutions for it.
-->
**Michelle:** 我认为具备用户共情、清晰反馈和识别模式的能力非常有用。
有人使用测试框架或工具，并能用清晰的示例概述痛点，或者能够识别项目中的更广泛的问题并提供数据来支持解决方案。

<!--
**Sandipan:** What’s next for SIG Testing?

**Patrick:** Stricter linting will soon become mandatory for new
code. There are several E2E framework sub-packages that could be
modernised, if someone wants to take on that work. I also see an
opportunity to unify some of our helper code for E2E and integration
testing, but that needs more thought and discussion.
-->
**Sandipan:** SIG Testing 的下一步是什么？

**Patrick:** 对于新代码，更严格的 lint 检查很快将成为强制要求。
如果有人愿意承担这项工作，我们可以对一些 E2E 框架的子工具包进行现代化改造。
我还看到一个机会，可以统一一些 E2E 和集成测试的辅助代码，但这需要更多的思考和讨论。

<!--
**Michelle:** I'm looking forward to making some usability
improvements for some of our tools and infra, and to supporting more
long-term contributions and growth of contributors into long-term
roles within the SIG. If you're interested, hit us up!
-->
**Michelle:** 我期待为我们的工具和基础设施进行一些可用性改进，
并支持更多长期贡献者的贡献和成长，使他们在 SIG 中担任长期角色。如果你有兴趣，请联系我们！

<!--
Looking ahead, SIG Testing has exciting plans in store. You can get in
touch with the folks at SIG Testing in their [Slack channel](https://kubernetes.slack.com/messages/sig-testing) or attend
one of their regular [bi-weekly meetings on Tuesdays](https://github.com/kubernetes/community/tree/master/sig-testing#meetings). If
you are interested in making it easier for the community to run tests
and contribute test results, to ensure Kubernetes is stable across a
variety of cluster configurations and cloud providers, join the SIG
Testing community today!
-->
展望未来，SIG Testing 有令人兴奋的计划。你可以通过他们的
[Slack 频道](https://kubernetes.slack.com/messages/sig-testing)与 SIG Testing 的人员取得联系，
或参加他们定期举行的[每两周的周二会议](https://github.com/kubernetes/community/tree/master/sig-testing#meetings)。
如果你有兴趣为社区更轻松地运行测试并贡献测试结果，确保 Kubernetes
在各种集群配置和云驱动中保持稳定，请立即加入 SIG Testing 社区！
