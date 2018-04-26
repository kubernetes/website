---
title: Kubernetes贡献者指南
cn-approvers:
- fatalc
owner: sig-contributor-experience
notitle: true
---
<!---
title: Kubernetes Contributor Guide
owner: sig-contributor-experience
notitle: true
--->

<!-- # Kubernetes Contributor Guide -->
# Kubernetes 贡献者指南

<!-- ## Disclaimer -->
## Disclaimer

<!--
Hello! This is the starting point for our brand new contributor guide, currently underway as per [issue#6102](https://github.com/kubernetes/website/issues/6102) and is in need of help. 
Please be patient, or fix a section below that needs improvement, and submit a pull request! Feel free to browse the [open issues](https://github.com/kubernetes/community/issues?q=is%3Aissue+is%3Aopen+label%3Aarea%2Fcontributor-guide) and file new ones, all feedback welcome! 
-->
你好！这是我们新贡献者指南的起点，目前正在按照[issue#6102](https://github.com/kubernetes/website/issues/6102)进行并且需要帮助。
请耐心等待，或者修复以下需要改进的部分，并提交pull request！浏览一下[open issues](https://github.com/kubernetes/community/issues?q=is%3Aissue+is%3Aopen+label%3Aarea%2Fcontributor-guide)并提交新文件，欢迎所有反馈！


<!--
# Welcome
-->
# 欢迎


<!-- Welcome to Kubernetes! This document is the single source of truth for how to contribute to the code base. Please leave comments / suggestions if you find something is missing or incorrect. -->
欢迎来到Kubernetes！本文件是如何为代码库作出贡献的来源。如果您发现有遗漏或不正确的地方，请留下意见或者建议。

-   [开始之前](#开始之前)
    -   [签署CLA](#签署CLA)
    -   [行为守则](#行为守则)
    -   [设置你的开发环境](#设置你的开发环境)
    -   [社区期望和角色](#社区期望和角色)
        -   [致谢](#致谢)
-   [第一个贡献](#第一个贡献)
    -   [找到一些工作](#找到一些工作)
        -   [寻找一个好的第一个话题](#寻找一个好的第一话题)
        -   [了解SIG](#了解SIG)
        -   [提出问题](#提出问题)
-   [贡献](#贡献)
    -   [通讯](#通讯)
    -   [GitHub工作流程](#GitHub工作流程)
    -   [打开一个Pull Request](#打开Pull Request)
    -   [代码审查](#代码审查)
    -   [测试](#测试)
    -   [安全](#安全)
    -   [文档](#文档)
    -   [问题管理或分类](#问题管理或分类)
-   [社区](#社区)
    -   [通讯](#通讯-1)
    -   [活动](#活动)
        -   [聚会](#聚会)
    -   [合作伙伴](#合作伙伴)

<!-- # Before you get started -->
# 开始之前

<!-- ## Sign the CLA -->
## 签署CLA

<!-- Before you can contribute, you will need to sign the [Contributor License Agreement](https://github.com/kubernetes/community/tree/master/CLA.md).-->
在你做出贡献之前, 您需要签署[参与者许可协议](https://github.com/kubernetes/community/tree/master/CLA.md).

<!-- ## Code of Conduct -->
## 行为守则

<!-- Please make sure to read and observe our [Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md). -->
请务必阅读并遵守我们的[行为准则](https://github.com/cncf/foundation/blob/master/code-of-conduct.md).

<!-- ## Setting up your development environment -->
## 设置你的开发环境

<!-- If you haven’t set up your environment, please find resources [here](https://github.com/kubernetes/community/tree/master/contributors/devel). -->
如果你还没有建立你的开发环境，请到[这里](https://github.com/kubernetes/community/tree/master/contributors/devel)找资源。

<!-- ## Community Expectations and Roles -->
## 社区期望和角色

<!-- Kubernetes is a community project. Consequently, it is wholly dependent on its community to provide a productive, friendly and collaborative environment. -->
Kubernetes是一个社区项目。因此，它完全依赖它的社区来提供一个高效，友好和协作的环境。

<!--
- Read and review the [Community Expectations](https://github.com/kubernetes/community/tree/master/contributors/guide/community-expectations.md) for an understand of code and review expectations. 
- See [Community Membership](https://github.com/kubernetes/community/tree/master/community-membership.md) for a list the various responsibilities of contributor roles. You are encouraged to move up this contributor ladder as you gain experience.  
-->
- 阅读[社区期望(Community Expectations)](https://github.com/kubernetes/community/tree/master/contributors/guide/community-expectations.md) 了解代码和审查期望。
- [社区会员(Community Membership)](https://github.com/kubernetes/community/tree/master/community-membership.md) 列出贡献者角色的各种责任。当你获得经验时，鼓励你提升这个贡献者阶梯。  

<!-- # Your First Contribution-->
# 第一个贡献

<!-- Have you ever wanted to contribute to the coolest cloud technology? We will help you understand the organization of the Kubernetes project and direct you to the best places to get started. You'll be able to pick up issues, write code to fix them, and get your work reviewed and merged. -->
你有没有想过向最酷的云技术进行贡献？ 我们将帮助您了解Kubernetes项目的组织结构，并将您引导至最佳入门地点。您可以选择issues，编写代码来修复它们，检查并合并到代码库。

<!-- Please be aware that due to the large number of issues our triage team deals with, we cannot offer technical support in GitHub issues. If you have questions about the development process, feel free to jump into our [Slack Channel](http://slack.k8s.io/) or join our [mailing list](https://groups.google.com/forum/#!forum/kubernetes-dev). You can also ask questions on [ServerFault](https://serverfault.com/questions/tagged/kubernetes) or [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes). The Kubernetes team scans Stack Overflow on a regular basis and will try to ensure your questions don't go unanswered. -->
请注意，由于我们的分流团队处理大量问题，因此我们无法为GitHub issues提供技术支持。如果您对开发过程有疑问，请随时跳到我们的[Slack频道](http://slack.k8s.io/)或加入我们的[邮件列表](https://groups.google.com/forum/#!forum/kubernetes-dev)。
你也可以在[ServerFault](https://serverfault.com/questions/tagged/kubernetes)或[Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)上提问。
Kubernetes团队定期查看Stack Overflow，并尝试确保您的问题不会悬而未决。

<!-- ## Find something to work on -->
## 找到一些工作

<!--
Help is always welcome! For example, documentation (like the text you are reading now) can always use improvement. There's always code that can be clarified and variables or functions that can be renamed or commented. There's always a need for more test coverage.
You get the idea - if you ever see something you think should be fixed, you should own it. Here is how you get started.
-->
随时欢迎帮助！例如，总是有文档（如您正在阅读的文本）可以改进。总是有可以优化(clarified)的代码以及可以重命名或注释的变量或函数。
总是需要更多的测试覆盖率。你明白了——如果你看到一些你认为应该修复的东西，你应该解决它。以下是你如何开始。

<!-- ### Find a good first topic -->
### 寻找一个好的第一话题

<!--
There are multiple repositories within the Kubernetes community and a full list of repositories can be found [here](https://github.com/kubernetes/).
Each repository in the Kubernetes organization has beginner-friendly issues that provide a good first issue. For example, [kubernetes/kubernetes](https://git.k8s.io/kubernetes) has [help wanted issues](https://go.k8s.io/help-wanted) that should not need deep knowledge of the system.
Another good strategy is to find a documentation improvement, such as a missing/broken link, which will give you exposure to the code submission/review process without the added complication of technical depth. Please see [Contributing](#contributing) below for the workflow.
-->
Kubernetes社区内有多个版本库，可以在[这里](https://github.com/kubernetes/)找到完整的版本库列表。
Kubernetes组织中的每个存储库都有对初学者友好的问题，提供了一个很好的第一个问题(first issue)。例如[kubernetes/kubernetes](https://git.k8s.io/kubernetes)有[help wanted issues](https://go.k8s.io/help-wanted)，它们不需要深入了解系统的问题。
另一个好的策略是找到一个文档改进，比如缺失/断开的链接，这会让你接触到代码提交/审查过程，而不会增加技术深度的复杂性。请参阅下面的[贡献](#贡献)以了解工作流程。

<!-- ### Learn about SIGs -->
### 了解SIG

<!-- #### Sig structure -->
#### Sig结构

<!-- You may have noticed that some repositories in the Kubernetes Organization are owned by Special Interest Groups, or SIGs. We organize the Kubernetes community into SIGs in order to improve our workflow and more easily manage what is a very large community project. The developers within each SIG have autonomy and ownership over that SIG's part of Kubernetes. -->
您可能已经注意到，Kubernetes组织中的一些存储库归特别兴趣小组或SIG所有。
我们将Kubernetes社区组织成SIG，以改善我们的工作流程并更轻松地管理一个非常大的社区项目。
每个SIG内的开发人员都拥有对SIG部分Kubernetes的自主权和所有权。

<!-- Some SIGs also have their own `CONTRIBUTING.md` files, which may contain extra information or guidelines in addition to these general ones. These are located in the SIG-specific community directories. For example: the contributor's guide for SIG CLI is located in the *kubernetes/community* repo, as [`/sig-cli/CONTRIBUTING.md`](https://github.com/kubernetes/community/tree/master/sig-cli/CONTRIBUTING.md). -->
一些SIG也有他们自己的`CONTRIBUTING.md`文件，除了这些常规文件之外，它们可能包含额外的信息或准则。
这些位于SIG特定的社区目录中。 例如：SIG CLI的贡献者指南位于*kubernetes/community*repo中，如[`/sig-cli/CONTRIBUTING.md`](https://github.com/kubernetes/community/tree/master/sig-cli/CONTRIBUTING.md)。

<!-- Like everything else in Kubernetes, a SIG is an open, community, effort. Anybody is welcome to jump into a SIG and begin fixing issues, critiquing design proposals and reviewing code. SIGs have regular [video meetings](https://kubernetes.io/community/) which everyone is welcome to. Each SIG has a kubernetes slack channel that you can join as well. -->
就像Kubernetes的其他一切一样，SIG是一个开放的社区努力。
欢迎任何人加入SIG并开始解决问题，批评设计方案并审查代码。 SIG有定期[视频会议](https://kubernetes.io/community/)，欢迎所有人参加。每个SIG都有一个可以加入的kubernetes slack 频道。

<!--
There is an entire SIG ([sig-contributor-experience](https://github.com/kubernetes/community/tree/master/sig-contributor-experience/README.md)) devoted to improving your experience as a contributor.
Contributing to Kubernetes should be easy. If you find a rough edge, let us know! Better yet, help us fix it by joining the SIG; just
show up to one of the [bi-weekly meetings](https://docs.google.com/document/d/1qf-02B7EOrItQgwXFxgqZ5qjW0mtfu5qkYIF1Hl4ZLI/edit).
-->
有一个完整的SIG([sig-contributor-experience](https://github.com/kubernetes/community/tree/master/sig-contributor-experience/README.md))致力于改善您作为贡献者的体验。
贡献给Kubernetes应该很容易。如果你发现一个粗糙的边缘，请让我们知道！更好的是，通过加入SIG帮助我们解决问题。
仅需要展示给其中一个[双周会议](https://docs.google.com/document/d/1qf-02B7EOrItQgwXFxgqZ5qjW0mtfu5qkYIF1Hl4ZLI/edit)。

<!-- #### Find a SIG that is related to your contribution -->
#### 找到一个与你的贡献相关的SIG

<!-- Finding the appropriate SIG for your contribution and adding a SIG label will help you ask questions in the correct place and give your contribution higher visibility and a faster community response. -->
为您的贡献找到合适的SIG并添加SIG标签将有助于您在正确的地方提问，并为您的贡献提供更高的可视性和更快的社区响应。

<!--  For Pull Requests, the automatically assigned reviewer will add a SIG label if you haven't done so. See [Open A Pull Request](#open-a-pull-request) below. -->
对于合并请求，如果您没有这样做，自动分配的审阅者将添加一个SIG标签。请参阅下面的[打开pull request](#打开pull-request)。

<!-- For Issues, we are still working on a more automated workflow. Since SIGs do not directly map onto Kubernetes subrepositories, it may be difficult to find which SIG your contribution belongs in. Here is the [list of SIGs](https://github.com/kubernetes/community/tree/master/sig-list.md). Determine which is most likely related to your contribution. -->
对于问题，我们仍在研究更加自动化的工作流程。由于SIG不直接映射到Kubernetes子库，因此可能很难找到您的贡献属于哪个SIG。
下面是[SIG列表](https://github.com/kubernetes/community/tree/master/sig-list.md)。 确定哪一个最有可能与你的贡献有关。

<!-- *Example:* if you are filing a cni issue, you should choose the [Network SIG](http://git.k8s.io/community/sig-network). Add the SIG label in a comment like so: -->
*例:* 如果你正在提交cni问题，你应该选择 [Network SIG](http://git.k8s.io/community/sig-network). 在注释中添加SIG标签，如下所示：
```
/sig network
```

<!-- Follow the link in the SIG name column to reach each SIGs README. Most SIGs will have a set of GitHub Teams with tags that can be mentioned in a comment on issues and pull requests for higher visibility. If you are not sure about the correct SIG for an issue, you can try SIG-contributor-experience [here](https://github.com/kubernetes/community/tree/master/sig-contributor-experience#github-teams), or [ask in Slack](http://slack.k8s.io/). -->
按照SIG名称列中的链接访问每个SIG自述文件。大多数SIG将拥有一组GitHub团队，其中的标签可以在对问题发表评论时提及，并提出更高可见度的请求。
如果您不确定问题的正确SIG，您可以尝试查看[SIG-贡献者-经验](https://github.com/kubernetes/community/tree/master/sig-contributor-experience#github-teams)或[询问Slack](http://slack.k8s.io/)。

<!-- ### File an Issue -->
### 提出问题

<!--
Not ready to contribute code, but see something that needs work? While the community encourages everyone to contribute code, it is also appreciated when someone reports an issue (aka problem). Issues should be filed under the appropriate Kubernetes subrepository.
Check the [issue triage guide](https://github.com/kubernetes/community/tree/master/contributors/guide/./issue-triage.md) for more information. 
-->
没有准备好贡献代码，但看到需要改进的东西？虽然社区鼓励每个人都贡献代码，但是当有人报告问题时(issue)，也会受到赞赏。问题应该在适当的Kubernetes子库中提交。
查看[问题分类指南](https://github.com/kubernetes/community/tree/master/contributors/guide/./issue-triage.md)了解更多信息。 

<!-- *Example:* a documentation issue should be opened to [kubernetes/website](https://github.com/kubernetes/website/issues). -->
*例:* 一个文档问题应该在[kubernetes/website](https://github.com/kubernetes/website/issues)上打开.

<!-- Make sure to adhere to the prompted submission guidelines while opening an issue. -->
确保在打开问题时遵循提示提交准则。

<!--# Contributing-->
# 贡献

<!-- Kubernetes is open source, but many of the people working on it do so as their day job. In order to avoid forcing people to be "at work" effectively 24/7, we want to establish some semi-formal protocols around development. Hopefully, these rules make things go more smoothly. If you find that this is not the case, please complain loudly. -->
Kubernetes是开源的，但许多从事这项工作的人都是他们的日常工作。为了避免强迫人们24小时/7天都“在工作”，我们希望制定一些关于发展的半正式协议。希望这些规则让事情更顺利, 如果您发现情况并非如此，请大声的说出来。

<!-- As a potential contributor, your changes and ideas are welcome at any hour of the day or night, weekdays, weekends, and holidays. Please do not ever hesitate to ask a question or send a pull request. -->
作为潜在的贡献者，您的改变和想法在白天或晚上，平日，周末和假期的任何时间都受到欢迎。请不要犹豫提问或发送pull request。

<!-- Our community guiding principles on how to create great code as a big group are found [here](https://github.com/kubernetes/community/tree/master/contributors/devel/collab.md). --> 
我们的社区关于如何创建优秀代码的指导原则可以在[这里](https://github.com/kubernetes/community/tree/master/contributors/devel/collab.md)找到。

<!-- Beginner focused information can be found below in [Open a Pull Request](#open-a-pull-request) and [Code Review](#code-review). -->
初学者的重点信息可以在下面找到 [打开pull request](#打开pull-request) 和 [代码审查](#代码审查).

<!-- For quick reference on contributor resources, we have a handy [contributor cheatsheet](https://github.com/kubernetes/community/tree/master/contributors/guide/./contributor-cheatsheet.md) -->
为了快速查看贡献者资源，我们有一个方便的[贡献者备忘录](https://github.com/kubernetes/community/tree/master/contributors/guide/./contributor-cheatsheet.md)

<!-- ### Communication -->
### 通讯

<!-- It is best to contact your [SIG](#learn-about-sigs) for issues related to the SIG's topic. Your SIG will be able to help you much more quickly than a general question would. -->
与SIG的主题相关的问题最好联系您的[SIG](#了解sig)。
您的SIG能够比一般问题更快地为您提供帮助。

<!-- For general questions and troubleshooting, use the [kubernetes standard lines of communication](https://github.com/kubernetes/community/tree/master/communication.md) and work through the [kubernetes troubleshooting guide](https://kubernetes.io/docs/tasks/debug-application-cluster/troubleshooting/). -->
有关一般问题和疑难解答，请使用[kubernetes标准通信线路](https://github.com/kubernetes/community/tree/master/communication.md)，
并通过[kubernetes疑难解答指南](https://kubernetes.io/docs/tasks/debug-application-cluster/troubleshooting/)。

<!-- ## GitHub workflow -->
## GitHub工作流程

<!-- To check out code to work on, please refer to [this guide](https://github.com/kubernetes/community/tree/master/contributors/guide/./github-workflow.md). -->
要查看可以使用的代码，请参阅[本指南](https://github.com/kubernetes/community/tree/master/contributors/guide/./github-workflow.md)。

<!-- ## Open a Pull Request -->
## 打开Pull Request

<!-- Pull requests are often called simply "PR".  Kubernetes generally follows the standard [github pull request](https://help.github.com/articles/about-pull-requests/) process, but there is a layer of additional kubernetes specific (and sometimes SIG specific) differences: -->
拉请求通常简称为“PR”。 Kubernetes通常遵循标准的[github pull request](https://help.github.com/articles/about-pull-requests/)流程，但是还有一层额外的kubernetes特定的(有时是SIG特定的)差异：

<!-- - [Kubernetes-specific github workflow](https://github.com/kubernetes/community/tree/master/contributors/guide/pull-requests.md#the-testing-and-merge-workflow). -->
- [Kubernetes特定的github工作流程](https://github.com/kubernetes/community/tree/master/contributors/guide/pull-requests.md#the-testing-and-merge-workflow).

<!-- The first difference you'll see is that a bot will begin applying structured labels to your PR. -->
您将看到的第一个区别是，机器人将开始向您的PR应用结构化标签。

<!-- The bot may also make some helpful suggestions for commands to run in your PR to facilitate review.  These `/command` options can be entered in comments to trigger auto-labeling and notifications.  The command reference is [here](https://go.k8s.io/bot-commands). -->
机器人还可以提供一些有用的建议，让您在公关中运行命令以便于审查。这些`/command`选项可以输入注释以触发自动标记和通知。[命令参考](https://go.k8s.io/bot-commands)。

<!-- Common new contributor PR issues are: -->
常见的新贡献者PR问题是：

<!--
* not having correctly signed the CLA ahead of your first PR (see [Sign the CLA](#sign-the-cla) section)
* finding the right SIG or reviewer(s) for the PR (see [Code Review](#code-review) section) and following any SIG specific contributing guidelines
* dealing with test cases which fail on your PR, unrelated to the changes you introduce (see [Test Flakes](http://velodrome.k8s.io/dashboard/db/bigquery-metrics?orgId=1))
* Not following [scalability good practices](https://github.com/kubernetes/community/tree/master/contributors/guide/scalability-good-practices.md)
-->
* 在第一次PR之前没有正确签署CLA (查看 [签署CLA](#签署CLA) 节)
* 为PR寻找正确的SIG或审阅者(查看 [代码审查](#代码审查) 节) 并遵循任何SIG特定的贡献准则
* 处理您的PR上失败的测试案例，与您描述无关的更改 (查看[Test Flakes](http://velodrome.k8s.io/dashboard/db/bigquery-metrics?orgId=1))
* 不遵循[可扩展性良好实践](https://github.com/kubernetes/community/tree/master/contributors/guide/scalability-good-practices.md)

<!-- ## Code Review -->
## 代码审查

<!-- For a brief description of the importance of code review, please read [On Code Review](https://github.com/kubernetes/community/tree/master/contributors/guide/community-expectations.md#code-review).  There are two aspects of code review: giving and receiving. -->
有关代码审查重要性的简要说明，请阅读[关于代码审查](https://github.com/kubernetes/community/tree/master/contributors/guide/community-expectations.md#code-review)。
代码审查有两个方面：给予和接受(giving and receiving)。

<!-- To make it easier for your PR to receive reviews, consider the reviewers will need you to: -->
为了让您的PR更容易获得评论，请考虑审阅者需要您：

<!--
* follow the project [coding conventions](https://github.com/kubernetes/community/tree/master/contributors/guide/coding-conventions.md)
* write [good commit messages](https://chris.beams.io/posts/git-commit/)
* break large changes into a logical series of smaller patches which individually make easily understandable changes, and in aggregate solve a broader issue
* label PRs with appropriate SIGs and reviewers: to do this read the messages the bot sends you to guide you through the PR process
-->
* 遵循项目[编码约定](https://github.com/kubernetes/community/tree/master/contributors/guide/coding-conventions.md)
* 编写[良好的commit message](https://chris.beams.io/posts/git-commit/)
* 将大的变化分解为一系列较小的修补程序，这些修补程序单独进行易于理解的更改，并总体解决更广泛的问题
* 用合适的SIG和审核人标签PR：读取bot发送给你的信息，引导你完成PR过程

<!-- Reviewers, the people giving the review, are highly encouraged to revisit the [Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md) and must go above and beyond to promote a collaborative, respectful Kubernetes community.  When reviewing PRs from others [The Gentle Art of Patch Review](http://sage.thesharps.us/2014/09/01/the-gentle-art-of-patch-review/) suggests an iterative series of focuses which is designed to lead new contributors to positive collaboration without inundating them initially with nuances: -->
审阅人员高度鼓励重新审视[行为准则](https://github.com/cncf/foundation/blob/master/code-of-conduct.md)，并且必须超越, 促进合作，尊重Kubernetes社区。
当审查来自其他人的PR [补丁审阅的温柔艺术](http://sage.thesharps.us/2014/09/01/the-gentle-art-of-patch-review/)时，建议了一系列重复的焦点，它们, 旨在引导新的贡献者进行积极的合作，而不会忽视他们的初衷：

<!--
* Is the idea behind the contribution sound?
* Is the contribution architected correctly?
* Is the contribution polished?
-->
* 这个贡献背后的想法是什么？
* 贡献构架是否正确？
* 贡献是否被优雅？

<!-- ## Testing -->
## 测试

<!-- Testing is the responsibility of all contributors and is in part owned by all sigs, but is also coordinated by [sig-testing](https://github.com/kubernetes/community/tree/master/sig-testing). -->
测试是所有贡献者的责任，部分属于所有sig，但也由[sig-testing](https://github.com/kubernetes/community/tree/master/sig-testing)进行协调。

<!-- The main testing overview document is [here](https://github.com/kubernetes/community/tree/master/contributors/devel/testing.md). -->
主要测试概览文件是[here](https://github.com/kubernetes/community/tree/master/contributors/devel/testing.md)。

<!-- There are three types of test in kubernetes.  The location of the test code varies with type, as does the specifics of the environment needed to successfully run the test: -->
在kubernetes中有三种类型的测试。, 测试代码的位置因类型而异，成功运行测试所需的环境细节也是如此：

<!--
* Unit: These confirm that a particular function behaves as intended.  Golang includes a native ability for unit testing via the [testing](https://golang.org/pkg/testing/) package.  Unit test source code can be found adjacent to the corresponding source code within a given package.  For example: functions defined in [kubernetes/cmd/kubeadm/app/util/version.go](https://git.k8s.io/kubernetes/cmd/kubeadm/app/util/version.go) will have unit tests in [kubernetes/cmd/kubeadm/app/util/version_test.go](https://git.k8s.io/kubernetes/cmd/kubeadm/app/util/version_test.go).  These are easily run locally by any developer on any OS.
* Integration: These tests cover interactions of package components or interactions between kubernetes components and some other non-kubernetes system resource (eg: etcd).  An example would be testing whether a piece of code can correctly store data to or retrieve data from etcd.  Integration tests are stored in [kubernetes/test/integration/](https://git.k8s.io/kubernetes/test/integration).  Running these can require the developer set up additional functionality on their development system.
* End-to-end ("e2e"): These are broad tests of overall kubernetes system behavior and coherence.  These are more complicated as they require a functional kubernetes cluster built from the sources to be tested.  A separate document [here](https://github.com/kubernetes/community/tree/master/contributors/devel/e2e-tests.md) details e2e testing and test cases themselves can be found in [kubernetes/test/e2e/](https://git.k8s.io/kubernetes/test/e2e).
-->
* 单元：这些确认一个特定功能的行为如预期。Golang包含通过[testing](https://golang.org/pkg/testing/)包进行单元测试的原生能力。单元测试源代码可以在给定包内的相应源代码附近找到。例如：[kubernetes/cmd/kubeadm/app/util/version.go](https://git.k8s.io/kubernetes/cmd/kubeadm/app/util/version.go)中定义的函数将进行单元测试, 在[kubernetes/cmd/kubeadm/app/util/version_test.go](https://git.k8s.io/kubernetes/cmd/kubeadm/app/util/version_test.go)。这些很容易在任何操作系统上由任何开发人员在本地运行
* 集成: 这些测试涵盖了软件包组件或kubernetes组件与其他非kubernetes系统资源（例如：etcd）之间的交互。一个例子是测试一段代码是否可以正确地将数据存储到etcd或从中检索数据。集成测试存储在[kubernetes/test/integration/](https://git.k8s.io/kubernetes/test/integration)中。运行这些可能需要开发人员在其开发系统上设置其他功能。
* 端到端 ("e2e"): 这些是整体kubernetes系统行为和一致性的广泛测试。这些更复杂，因为它们需要从源构建的功能kubernetes集群进行测试。单独的文档[这里](https://github.com/kubernetes/community/tree/master/contributors/devel/e2e-tests.md)详细介绍e2e测试和测试用例本身可以在[kubernetes/test/e2e/](https://git.k8s.io/kubernetes/test/e2e)。

<!-- Continuous integration will run these tests either as pre-submits on PRs, post-submits against master/release branches, or both.  The results appear on [testgrid](https://testgrid.k8s.io). -->
持续集成将运行这些测试，既可以在PR上提交，也可以在主/发行分支上提交，或者两者兼而有之。结果显示在[testgrid](https://testgrid.k8s.io)上。

<!-- sig-testing is responsible for that official infrastructure and CI.  The associated automation is tracked in the [test-infra repo](https://git.k8s.io/test-infra).  If you're looking to run e2e tests on your own infrastructure, [kubetest](https://git.k8s.io/test-infra/kubetest) is the mechanism. -->
sig-testing负责该官方基础架构和CI。相关的自动化在[test-infra repo](https://git.k8s.io/test-infra)中进行跟踪。如果你想在自己的基础设施上运行e2e测试，[kubetest](https://git.k8s.io/test-infra/kubetest)就是机制。

<!-- ## Security -->
## 安全


* Please help write this section.

<!-- ## Documentation -->
## 文档

<!-- - [Contributing to Documentation](https://kubernetes.io/editdocs/) -->
- [向文档贡献](https://kubernetes.io/editdocs/)

<!-- ## Issues Management or Triage -->
## 问题管理或分类

<!-- Have you ever noticed the total number of [open issues](https://issues.k8s.io)? This number at any given time is typically high. Helping to manage or triage these open issues can be a great contribution to the Kubernetes project. This is also a great opportunity to learn about the various areas of the project. Refer to the [Kubernetes Issue Triage Guidelines](https://github.com/kubernetes/community/tree/master/contributors/devel/issues.md) for more information. -->
你有没有注意到[未解决的问题]的总数(https://issues.k8s.io)？这个数字在任何时候通常都很高。
帮助管理或分类这些未解决的问题可能会对Kubernetes项目做出巨大贡献。这也是了解项目各个领域的绝佳机会。有关更多信息，请参阅[Kubernetes问题分类指南](https://github.com/kubernetes/community/tree/master/contributors/devel/issues.md)。

<!-- # Community -->
# 社区

<!-- If you haven't noticed by now, we have a large, lively, and friendly open-source community. We depend on new people becoming members and regular code contributors, so we would like you to come join us. To find out more about our community structure, different levels of membership and code contributors, please [explore here](https://github.com/kubernetes/community/tree/master/community-membership.md). -->
如果你现在还没有注意到，我们拥有一个大型，活泼，友好的开源社区。我们依靠新成员和常规代码贡献者，所以我们希望您加入我们。要详细了解我们的社区结构，不同级别的成员和代码贡献者，请[查看](https://github.com/kubernetes/community/tree/master/community-membership.md)。

<!-- ## Communication -->
## 通讯-1

<!-- - [General Information](https://github.com/kubernetes/community/tree/master/communication) --> 
- [基本信息](https://github.com/kubernetes/community/tree/master/communication) 

<!-- ## Events -->
## 活动

<!-- Kubernetes is the main focus of CloudNativeCon/KubeCon, held twice per year in EMEA and in North America. Information about these and other community events is available on the CNCF [events](https://www.cncf.io/events/) pages. -->
Kubernetes是CloudNativeCon/KubeCon的主要重点，每年在EMEA和北美举办两次。关于这些和其他社区活动的信息可以在CNCF [活动](https://www.cncf.io/events/)页面上找到。

<!-- ### Meetups -->
### 聚会

<!-- We follow the general [Cloud Native Computing Foundation guidelines](https://github.com/cncf/meetups) for Meetups. You may also contact Paris Pittman via direct message on Kubernetes Slack (@paris) or by email (parispittman@google.com) -->
我们遵循Meetups的一般[Cloud Native Computing Foundation准则](https://github.com/cncf/meetups)。
您也可以通过Kubernetes Slack(@paris)或电子邮件(parispittman@google.com)直接与Paris Pittman联系，

<!-- ## Mentorship -->
## 合作伙伴

<!-- Please learn about our mentoring initiatives [here](http://git.k8s.io/community/mentoring/README.md). -->
请了解我们的指导活动[这里](http://git.k8s.io/community/mentoring/README.md)。

<!-- # Advanced Topics -->
# 高级主题

<!-- This section includes things that need to be documented, but typical contributors do not need to interact with regularly. -->
本节包含需要记录的事项，但典型的贡献者不需要定期进行交互。

<!--
- [OWNERS files](https://github.com/kubernetes/community/tree/master/contributors/guide/owners.md) - The Kubernetes organizations are managed with OWNERS files, which outline which parts of the code are owned by what groups. 
EMEA and in North America. Information about these and other community events is available on the CNCF [events](https://www.cncf.io/events/) pages.
-->
- [OWNERS 文件](https://github.com/kubernetes/community/tree/master/contributors/guide/owners.md) - Kubernetes组织由OWNERS文件进行管理，该文件概述哪些部分代码属于哪些组。 
EMEA和北美。关于这些和其他社区活动的信息可以在CNCF [活动](https://www.cncf.io/events/)页面上找到。


（译者注: 以下内容原文未完成，暂不翻译）
### Meetups

_Improvements needed_
* include link to meetups
* information on CNCF support for founding a Meetup

### KubeCon

_Improvements needed_
* write friendly blurb about KubeCon, and include links

## Mentorship

_Improvements needed_
* Link and mini description for Kubernetes Pilots should go here.
