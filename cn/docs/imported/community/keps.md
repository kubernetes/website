---
title: Kubernetes增强方案过程
cn-approvers:
- fatalc
---
<!---
title: Kubernetes Enhancement Proposal Process
--->

---
kep-number: 1
title: Kubernetes Enhancement Proposal Process
authors:
  - "@calebamiles"
  - "@jbeda"
owning-sig: sig-architecture
participating-sigs:
  - kubernetes-wide
reviewers:
  - name: "@timothysc"
approvers:
  - name: "@bgrant0607"
editor:
  name: "@jbeda"
creation-date: 2017-08-22
status: implementable
---

<!-- # Kubernetes Enhancement Proposal Process -->
# Kubernetes增强方案过程

<!-- ## Table of Contents -->
## 目录

<!-- 
* [Kubernetes Enhancement Proposal Process](#kubernetes-enhancement-proposal-process)
  * [Metadata](#metadata)
  * [Table of Contents](#table-of-contents)
  * [Summary](#summary)
  * [Motivation](#motivation)
  * [Reference-level explanation](#reference-level-explanation)
      * [What type of work should be tracked by a KEP](#what-type-of-work-should-be-tracked-by-a-kep)
      * [KEP Template](#kep-template)
      * [KEP Metadata](#kep-metadata)
      * [KEP Workflow](#kep-workflow)
      * [Git and GitHub Implementation](#git-and-github-implementation)
      * [KEP Editor Role](#kep-editor-role)
      * [Important Metrics](#important-metrics)
      * [Prior Art](#prior-art)
  * [Graduation Criteria](#graduation-criteria)
  * [Drawbacks](#drawbacks)
  * [Alternatives](#alternatives)
  * [Unresolved Questions](#unresolved-questions)
  * [Mentors](#mentors)
-->

* [Kubernetes增强方案过程](#Kubernetes增强方案过程)
  * [Metadata](#metadata)
  * [Table of Contents](#table-of-contents)
  * [概要](#概要)
  * [动机](#动机)
  * [参考及解释](#r参考及解释)
      * [KEP应该跟踪什么类型的工作](#KEP应该跟踪什么类型的工作)
      * [KEP模板](#KEP模板)
      * [KEP元数据](#KEP元数据)
      * [KEP工作流](#KEP工作流)
      * [Git和GitHub实现](#Git和GitHub实现)
      * [KEP编者角色](#KEP编者角色)
      * [重要指标](#重要指标)
      * [Prior Art](#prior-art)
  * [Graduation Criteria](#graduation-criteria)
  * [缺点](#缺点)
  * [备择方案](#备择方案)
  * [未解决的问题](#未解决的问题)
  * [导师](#导师)

<!-- ## Summary -->
## 概要

<!-- A standardized development process for Kubernetes is proposed in order to -->
Kubernetes标准化开发过程的提出用以：

<!--
- provide a common structure for proposing changes to Kubernetes
- ensure that the motivation for a change is clear
- allow for the enumeration stability milestones and stability graduation
  criteria
- persist project information in a Version Control System (VCS) for future
  Kubernauts
- support the creation of _high value user facing_ information such as:
  - an overall project development roadmap
  - motivation for impactful user facing changes
- reserve GitHub issues for tracking work in flight rather than creating "umbrella"
  issues
- ensure community participants are successfully able to drive changes to
  completion across one or more releases while stakeholders are adequately
  represented throughout the process
  -->
- 为向Kubernetes提出更改提供一个通用结构
- 确保这个更改的动机是明确的
- 考虑枚举稳定性里程碑和稳定性毕业标准则
(allow for the enumeration stability milestones and stability graduation criteria)
- 继续对将来的Kubernetes使用版本控制系统（VCS）中的项目信息
- 支持创建 _high value user facing_ 信息，如：
  - 一个整体项目发展路线图
  - 有影响力的用户对于更改的动机
- 保留GitHub issues来跟踪进行中的工作，而不是创建“umbrella”issues
- 确保社区参与者能够成功地通过一个或多个版本推动变更完成，同时在整个流程中充分体现相关受益者

<!-- This process is supported by a unit of work called a Kubernetes Enhancement Proposal or KEP.
A KEP attempts to combine aspects of a -->
这个过程由一个称为Kubernetes Enhancement Proposal或KEP的工作单元支持。
KEP尝试将各个方面结合起来:

<!-- 
- feature, and effort tracking document
- a product requirements document
- design document 
-->
- 功能和进度跟踪文档
- 产品需求文档
- 设计文档

<!--
into one file which is created incrementally in collaboration with one or more
Special Interest Groups (SIGs).
-->
与一个或多个特殊兴趣小组(SIG)合作，逐步创建一个文件。

<!-- ## Motivation -->
## 动机

<!--
For cross project SIGs such as SIG PM and SIG Release an abstraction beyond a
single GitHub Issue or Pull request seems to be required in order to understand
and communicate upcoming changes to Kubernetes.  In a blog post describing the
[road to Go 2][], Russ Cox explains
-->
对于像SIG PM和SIG Release这样的跨项目SIG，似乎需要跨越单个GitHub issues或Pull request，
以便了解和传达即将到来的对Kubernetes的更改。
Russ Cox在一篇博客文章[road to Go 2][]中描述了

<!--
> that it is difficult but essential to describe the significance of a problem
> in a way that someone working in a different environment can understand
-->

> 以一种在不同环境中工作的人能够理解的方式来描述一个问题的意义是困难的，但是非常必要的

<!-- 
as a project it is vital to be able to track the chain of custody for a proposed
enhancement from conception through implementation.
-->
作为一个项目，能够追踪一个增强提议从概念到实施的链(演变)至关重要。

<!--
Without a standardized mechanism for describing important enhancements our
talented technical writers and product managers struggle to weave a coherent
narrative explaining why a particular release is important. Additionally for
critical infrastructure such as Kubernetes adopters need a forward looking road
map in order to plan their adoption strategy.
-->
如果没有用于描述重要增强的标准化机制，
我们有才华的技术作者和产品经理就会努力编制一个相关的故事来解释特定版本的重要性。
此外，对于关键基础设施，例如Kubernetes采用者需要一个前瞻性路线图，以规划他们的采用策略。

<!--
The purpose of the KEP process is to reduce the amount of "tribal knowledge" in
our community. By moving decisions from a smattering of mailing lists, video
calls and hallway conversations into a well tracked artifact this process aims
to enhance communication and discoverability.
-->
KEP过程的目的是减少社区“部落知识(tribal knowledge)”的数量。
通过将决定从一小堆邮件列表，视频通话和走廊对话转移到一个良好跟踪的工具，此过程旨在增强沟通和可发现性。

<!--
A KEP is broken into sections which can be merged into source control
incrementally in order to support an iterative development process. An important
goal of the KEP process is ensuring that the process for submitting the content
contained in [design proposals][] is both clear and efficient. The KEP process
is intended to create high quality uniform design and implementation documents
for SIGs to deliberate.
-->
一个KEP被分成几个部分，可以逐步合并到源代码控制中，以支持迭代开发过程。
KEP过程的一个重要目标是确保[design proposals][]中提交内容的过程清晰且高效。
KEP流程旨在为SIG制定高质量的统一设计和实施文档。

[road to Go 2]: https://blog.golang.org/toward-go2
[design proposals]: /contributors/design-proposals


<!-- ## Reference-level explanation -->
## 参考级解释

<!-- ### What type of work should be tracked by a KEP -->
### KEP应该跟踪什么类型的工作

<!--
The definition of what constitutes an "enhancement" is a foundational concern
for the Kubernetes project. Roughly any Kubernetes user or operator facing
enhancement should follow the KEP process: if an enhancement would be described
in either written or verbal communication to anyone besides the KEP author or
developer then consider creating a KEP.
-->
对构成“增强”的定义是Kubernetes项目的基本关注点。
大概任何Kubernetes用户或操作员面对增强都应遵循KEP流程：
如果一个增强能被除了KEP作者或开发者之外的任何人以书面或口头方式向其他人描述，则考虑创建KEP。

<!--
Similarly, any technical effort (refactoring, major architectural change) that
will impact a large section of the development community should also be
communicated widely. The KEP process is suited for this even if it will have
zero impact on the typical user or operator.
-->
同样, 任何会影响大部分开发社区的技术工作（重构，主要架构变更）也应广泛传播。
KEP过程适用于此，即使它对典型用户或操作员没有影响。

<!--
As the local bodies of governance, SIGs should have broad latitude in describing
what constitutes an enhancement which should be tracked through the KEP process.
SIGs may find that helpful to enumerate what _does not_ require a KEP rather
than what does. SIGs also have the freedom to customize the KEP template
according to their SIG specific concerns. For example the KEP template used to
track API changes will likely have different subsections than the template for
proposing governance changes. However, as changes start impacting other SIGs or
the larger developer community outside of a SIG, the KEP process should be used
to coordinate and communicate.
-->
作为地方治理机构, SIG在描述应通过KEP流程追踪哪些增强时应具有广泛的自由度。
SIG可能会发现有助于列举什么 _不需要_ KEP而什么需要。 
SIG还可以根据自己的SIG特定问题自由定制KEP模板。
例如，用于跟踪API更改的KEP模板可能与用于提出治理更改的模板有不同的子部分。
但是，当变更开始影响其他SIG或SIG以外的更大的开发者社区时，应该使用KEP过程来协调和沟通。

<!--
Enhancements that have major impacts on multiple SIGs should use the KEP process.
A single SIG will own the KEP but it is expected that the set of approvers will span the impacted SIGs.
The KEP process is the way that SIGs can negotiate and communicate changes that cross boundaries.
-->
对多个SIG有重大影响的增强应该使用KEP流程。
单个SIG将拥有KEP，但期望于审阅者会跨越受影响的SIG。
KEP流程是SIG可以通过协商和交流跨越边界的变更的方式。

<!--
KEPs will also be used to drive large changes that will cut across all parts of the project.
These KEPs will be owned by SIG-architecture and should be seen as a way to communicate the most fundamental aspects of what Kubernetes is.
-->
KEP还将用于推动将会穿越项目所有部分的大型变更。
这些KEP将由SIG架构拥有，应该被看作是Kubernetes沟通的最基本的一种方式。

<!-- ### KEP Template -->
### KEP模板

The template for a KEP is precisely defined [here](https://github.com/kubernetes/community/tree/master/keps/0000-kep-template.md)
KEP的模板精确定义[在这里](https://github.com/kubernetes/community/tree/master/keps/0000-kep-template.md)

<!-- ### KEP Metadata -->
### KEP元数据

每个KEP中都有一个具有标准元数据的YAML文档。
这将用于支持过滤和显示工具。
清楚地传达KEP的状态也很重要。

<!-- Metadata items: -->
元数据项:
<!--
* **kep-number** Required
  * Each proposal has a number.  This is to make all references to proposals as
    clear as possible.  This is especially important as we create a network
    cross references between proposals.
  * Before having the `Approved` status, the number for the KEP will be in the
    form of `draft-YYYYMMDD`.  The `YYYYMMDD` is replaced with the current date
    when first creating the KEP.  The goal is to enable fast parallel merges of
    pre-acceptance KEPs.
  * On acceptance a sequential dense number will be assigned.  This will be done
    by the editor and will be done in such a way as to minimize the chances of
    conflicts.  The final number for a KEP will have no prefix.
* **title** Required
  * The title of the KEP in plain language.  The title will also be used in the
    KEP filename.  See the template for instructions and details.
    -->
* **kep-number** 需要
  * 每个提案都有一个数字， 这是为了尽可能清楚地提及提案的所有参考。这在我们创建提案之间的网络交叉引用时尤为重要。
  * 在 `Approved` 状态之前, KEP的编号将采用`draft-YYYYMMDD`的形式。
   `YYYYMMDD`被第一次创建KEP时的当前日期替换, 目标是实现预接受KEP的快速并行合并。
  * 在接受时，将分配顺序密集号码。 这将由编辑完成，并将以最大限度减少冲突的可能性的方式完成。
   KEP的最终号码没有前缀。
* **title** 需要
  * 简明语言中KEP的标题, 该标题也将用于KEP文件名。有关说明和详细信息，请参阅模板。
    
<!-- 
* **status** Required
  * The current state of the KEP.
  * Must be one of `provisional`, `implementable`, `implemented`, `deferred`, `rejected`, `withdrawn`, or `replaced`.
* **authors** Required
  * A list of authors for the KEP.
    This is simply the github ID.
    In the future we may enhance this to include other types of identification.
* **owning-sig** Required
  * The SIG that is most closely associated with this KEP. If there is code or
    other artifacts that will result from this KEP, then it is expected that
    this SIG will take responsibility for the bulk of those artifacts.
  * Sigs are listed as `sig-abc-def` where the name matches up with the
    directory in the `kubernetes/community` repo.
    -->
* **status** 需要
  * KEP的当前状态。
  * 必须是 `provisional`, `implementable`, `implemented`, `deferred`, `rejected`, `withdrawn`, `replaced`中的一个
* **authors** 需要
  * KEP的作者列表。
  只支持github ID。
  将来我们可能会加强这一点，以支持其他类型的标识。
* **owning-sig** 需要
  * 与此KEP关系最密切的SIG。
  如果存在由此KEP产生的代码或其他组件，则希望SIG将对这些组件的大部分负责
  * Sigs被列为`sig-abc-def`，其名称与`kubernetes/community`库中的目录相匹配。
  
<!--
* **participating-sigs** Optional
  * A list of SIGs that are involved or impacted by this KEP.
  * A special value of `kubernetes-wide` will indicate that this KEP has impact
    across the entire project.
* **reviewers** Required
  * Reviewer(s) chosen after triage according to proposal process
  * If not yet chosen replace with `TBD`
  * Same name/contact scheme as `authors`
  * Reviewers should be a distinct set from authors.
* **approvers** Required
  * Approver(s) chosen after triage according to proposal process
  * Approver(s) are drawn from the impacted SIGs.
    It is up to the individual SIGs to determine how they pick approvers for KEPs impacting them.
    The approvers are speaking for the SIG in the process of approving this KEP.
    The SIGs in question can modify this list as necessary.
  * The approvers are the individuals that make the call to move this KEP to the `approved` state.
  * Approvers should be a distinct set from authors.
  * If not yet chosen replace with `TBD`
  * Same name/contact scheme as `authors`
  -->
* **participating-sigs** 可选
  * 本KEP涉及或影响的SIG列表。
  * 特殊值`kubernetes-wide`将表明该KEP对整个项目都有影响。
* **reviewers** 可选
  * 根据提案流程进行分类选择后的校对人
  * 如果尚未选择，则用`TBD`替换
  * 与`authors`相同的名称/联系方案
  * 校对(reviewer)应该与作者有区别。
* **approvers** 需要
  * 根据提案流程进行分类后选择后的审阅者(approvers)
  * 来自受影响的SIG的审阅者(approvers)
    由单个SIG决定他们如何挑选审阅者来影响KEP。
    在批准该KEP的过程中正在为SIG发言的审阅者。
    有问题的SIG可以根据需要修改此列表。
  * 批准者是指将此KEP移至`approved`状态的个人。
  * 批准者应该与作者分离。
  * 如果尚未选择，则用`TBD`替换
  * 与`authors`相同的名称/联系方案

<!--
* **editor** Required
  * Someone to keep things moving forward.
  * If not yet chosen replace with `TBD`
  * Same name/contact scheme as `authors`
* **creation-date** Required
  * The date that the KEP was first submitted in a PR.
  * In the form `yyyy-mm-dd`
  * While this info will also be in source control, it is helpful to have the set of KEP files stand on their own.
* **last-updated** Optional
  * The date that the KEP was last changed significantly.
  * In the form `yyyy-mm-dd`
* **see-also** Optional
  * A list of other KEPs that are relevant to this KEP.
  * In the form `KEP-123`
* **replaces** Optional
  * A list of KEPs that this KEP replaces.  Those KEPs should list this KEP in
    their `superseded-by`.
  * In the form `KEP-123`
* **superseded-by**
  * A list of KEPs that supersede this KEP. Use of this should be paired with
    this KEP moving into the `Replaced` status.
  * In the form `KEP-123`
-->
* **editor** 需要
  * 让事情继续推进的人。
  * 如果尚未选择，则用`TBD`替换
  * 与`authors`相同的名称/联系方案
* **creation-date** 需要
  * KEP首次在PR中提交的日期。
  * 形式为`yyyy-mm-dd`
  * 虽然此信息也将在源代码管理中，但让KEP文件集独立运行会很有帮助。
* **last-updated** 可选
  * KEP发生变化的最后日期。
  * 形式为`yyyy-mm-dd`
* **see-also** 可选
  * 与此KEP相关的其他KEP列表。
  * 形式为`KEP-123`
* **replaces** 可选
  * 这个KEP取代的KEP列表。那些被取代的KEP应该将这个KEP列入他们的`superseded-by`。
  * 形式为`KEP-123`
* **superseded-by**
  * 取代此KEP的KEP列表。使用这个应该与这个KEP进入`Replaced`状态。
  * 形式为`KEP-123`


<!-- ### KEP Workflow -->
### KEP工作流

<!-- A KEP has the following states -->
KEP具有以下状态

<!--
- `provisional`: The KEP has been proposed and is actively being defined.
  This is the starting state while the KEP is being fleshed out and actively defined and discussed.
  The owning SIG has accepted that this is work that needs to be done.
- `implementable`: The approvers have approved this KEP for implementation.
- `implemented`: The KEP has been implemented and is no longer actively changed.
- `deferred`: The KEP is proposed but not actively being worked on.
- `rejected`: The approvers and authors have decided that this KEP is not moving forward.
  The KEP is kept around as a historical document.
- `withdrawn`: The KEP has been withdrawn by the authors.
- `replaced`: The KEP has been replaced by a new KEP.
  The `superseded-by` metadata value should point to the new KEP.
  -->
- `provisional`: KEP已经提出并正在积极地定义。
  这是KEP正在充实并积极定义和讨论的起始状态。
  拥有的SIG已经接受了这是需要完成的工作。
- `implementable`: 批准者已批准该KEP进行实现
- `implemented`: KEP已经实现，不再积极改变。
- `deferred`: KEP被提出，但没有积极地开展工作。
- `rejected`: 批准人和作者已经决定，这个KEP不会再前进
   这个KEP作为一个历史文件被保留。
- `withdrawn`: KEP已被作者撤回。
- `replaced`: KEP已被新的KEP取代。
  `superseded-by` 元数据值应该指向新的KEP。

<!-- ### Git and GitHub Implementation -->
### Git和GitHub实现
<!--
KEPs are checked into the community repo under the `/kep` directory.
In the future, as needed we can add SIG specific subdirectories.
KEPs in SIG specific subdirectories have limited impact outside of the SIG and can leverage SIG specific OWNERS files.
-->
KEP签入到社区库的`/kep`目录下。
将来，根据需要，我们可以添加SIG特定的子目录。
SIG特定子目录中的KEP对SIG以外的影响有限，并可以利用SIG特定的OWNERS文件。

<!--
New KEPs can be checked in with a file name in the form of `draft-YYYYMMDD-my-title.md`.
As significant work is done on the KEP the authors can assign a KEP number.
This is done by taking the next number in the NEXT_KEP_NUMBER file, incrementing that number, and renaming the KEP.
No other changes should be put in that PR so that it can be approved quickly and minimize merge conflicts.
The KEP number can also be done as part of the initial submission if the PR is likely to be uncontested and merged quickly.
-->
可以使用`draft-YYYYMMDD-my-title.md`形式的文件名签入新的KEP。
由于重要的工作是在KEP上完成的，作者可以分配一个KEP编号。
这是通过获取NEXT_KEP_NUMBER文件中的下一个数字，增加该数字并重命名KEP来完成的。
PR中不应该有其他更改，以便可以快速批准并最小化合并冲突。
如果PR可能无争议并迅速合并，KEP编号也可作为首次提交的一部分。

<!-- ### KEP Editor Role -->
### KEP编者角色

<!--
Taking a cue from the [Python PEP process][], we define the role of a KEP editor.
The job of an KEP editor is likely very similar to the [PEP editor responsibilities][] and will hopefully provide another opportunity for people who do not write code daily to contribute to Kubernetes.
-->
从[Python PEP process][]中获得一个提示，我们定义KEP编者的角色。
KEP编辑的工作可能与[PEP editor responsibilities][]非常相似，并且有望为不每天编写代码的人向Kubernetes贡献机会。

<!-- In keeping with the PEP editors which -->
与PEP编辑保持一致

<!--
> Read the PEP to check if it is ready: sound and complete. The ideas must make
> technical sense, even if they don't seem likely to be accepted.
> The title should accurately describe the content.
> Edit the PEP for language (spelling, grammar, sentence structure, etc.), markup
> (for reST PEPs), code style (examples should match PEP 8 & 7).
-->
> 阅读PEP以检查它是否准备就绪：完好无损。这些想法必须采用
> 技术上的意义，即使他们似乎不太可能被接受。
> 标题应该准确地描述内容。
> 编辑PEP的语言(拼写,语法,句子结构)，标记
> (对于reST PEP)代码风格(例子应该与PEP 8 和 7 匹配)。

<!-- 
KEP editors should generally not pass judgement on a KEP beyond editorial corrections.
KEP editors can also help inform authors about the process and otherwise help things move smoothly.
-->
KEP编辑通常不应该通过编辑纠错之外进行KEP判断。
KEP编辑还可以帮助通知作者有关过程并帮助其顺利进行。

[Python PEP process]: https://www.python.org/dev/peps/pep-0001/
[PEP editor responsibilities]: https://www.python.org/dev/peps/pep-0001/#pep-editor-responsibilities-workflow

<!-- ### Important Metrics -->
### 重要指标

<!-- 
It is proposed that the primary metrics which would signal the success or
failure of the KEP process are
-->
可以表明KEP过程成功或失败的主要指标的建议：

<!--
- how many "enhancements" are tracked with a KEP
- distribution of time a KEP spends in each state
- KEP rejection rate
- PRs referencing a KEP merged per week
- number of issued open which reference a KEP
- number of contributors who authored a KEP
- number of contributors who authored a KEP for the first time
- number of orphaned KEPs
- number of retired KEPs
- number of superseded KEPs
-->
- 用KEP跟踪多少“增强(enhancements)”
- KEP花费在每个状态的时间分配
- KEP拒绝率
- KEP有关的PR每周合并
- 参考KEP的issued open数量
- 撰写KEP的贡献者数量
- 第一次撰写KEP的贡献者数量
- 孤立(orphaned)KEP的数量
- 退休(retired)KEP的数量
- 被取代(superseded)的KEP的数量

<!-- ### Prior Art -->
### Prior Art

<!--
The KEP process as proposed was essentially stolen from the [Rust RFC process][] which
itself seems to be very similar to the [Python PEP process][]
-->
所提出的KEP过程实质上是从 [Rust RFC process][] 中盗取的，它本身似乎与 [Python PEP process][] 非常相似。

[Rust RFC process]: https://github.com/rust-lang/rfcs

<!-- ## Drawbacks -->
## 缺点

<!--
Any additional process has the potential to engender resentment within the
community. There is also a risk that the KEP process as designed will not
sufficiently address the scaling challenges we face today. PR review bandwidth is
already at a premium and we may find that the KEP process introduces an unreasonable
bottleneck on our development velocity.
-->
任何额外的过程都有可能引起社区内的不满。
还有一个风险就是设计的KEP过程不足以充分解决我们今天面临的挑战。
PR的带宽已经很高，我们可能会发现KEP过程对我们的发展速度造成了不合理的瓶颈。

<!--
It certainly can be argued that the lack of a dedicated issue/defect tracker
beyond GitHub issues contributes to our challenges in managing a project as large
as Kubernetes, however, given that other large organizations, including GitHub
itself, make effective use of GitHub issues perhaps the argument is overblown.
-->
可以肯定的是，除了GitHub issues之外，缺乏专用的问题/缺陷跟踪程序会对管理像Kubernetes这样大的项目带来挑战。
然而，考虑到其他大型组织（包括GitHub本身）有效使用GitHub issues, 争论被夸大了。

<!--
The centrality of Git and GitHub within the KEP process also may place too high
a barrier to potential contributors, however, given that both Git and GitHub are
required to contribute code changes to Kubernetes today perhaps it would be reasonable
to invest in providing support to those unfamiliar with this tooling.
-->
Git和GitHub在KEP过程中的中心地位也可能给潜在的贡献者带来太高的障碍。
然而，鉴于Git和GitHub都需要对Kubernetes进行代码更改，可能有必要投资于为这些不熟悉这个工具贡献者提供支持。

<!--
Expanding the proposal template beyond the single sentence description currently
required in the [features issue template][] may be a heavy burden for non native
English speakers and here the role of the KEP editor combined with kindness and
empathy will be crucial to making the process successful.
-->
将提案模板扩展到 [features issue template][]中目前要求的单个句子描述之外可能是非英语母语人士的沉重负担，
并且在这里，KEP编辑的角色以及善良和同情心对于使该过程成功变得至关重要。

[features issue template]: https://git.k8s.io/features/ISSUE_TEMPLATE.md

<!-- ## Alternatives -->
## 备择方案

<!--
This KEP process is related to
- the generation of a [architectural roadmap][]
- the fact that the [what constitutes a feature][] is still undefined
- [issue management][]
- the difference between an [accepted design and a proposal][]
- [the organization of design proposals][]
-->
这个KEP过程与此有关
-  [architectural roadmap][]的生成
- [what constitutes a feature][]的事实仍未定义
- [issue management][]
-  [accepted design and a proposal][] 之间的差异
- [the organization of design proposals][]

<!-- this proposal attempts to place these concerns within a general framework. -->
这个提议试图将这些关注放在一个总体框架内。

[architectural roadmap]: https://github.com/kubernetes/community/issues/952
[what constitutes a feature]: https://github.com/kubernetes/community/issues/531
[issue management]: https://github.com/kubernetes/community/issues/580
[accepted design and a proposal]: https://github.com/kubernetes/community/issues/914
[the organization of design proposals]: https://github.com/kubernetes/community/issues/918

<!-- ### Github issues vs. KEPs -->
### Github issues vs. KEPs

<!--
The use of GitHub issues when proposing changes does not provide SIGs good
facilities for signaling approval or rejection of a proposed change to Kubernetes
since anyone can open a GitHub issue at any time. Additionally managing a proposed
change across multiple releases is somewhat cumbersome as labels and milestones
need to be updated for every release that a change spans. These long lived GitHub
issues lead to an ever increasing number of issues open against
`kubernetes/features` which itself has become a management problem.
-->
在提出变更时使用GitHub issues不会为SIG对Kubernetes提出更改批准或拒绝时的信号提供良好的支持，
因为任何人都可以随时打开GitHub issues。
此外，跨越多个版本管理建议的更改会比较麻烦，因为标签和里程碑需要针对每次发布的版本进行更新。
这些长期存在的GitHub问题导致越来越多的问题针对`kubernetes/features`开放，这本身就成为一个管理问题。

<!--
In addition to the challenge of managing issues over time, searching for text
within an issue can be challenging. The flat hierarchy of issues can also make
navigation and categorization tricky. While not all community members might
not be comfortable using Git directly, it is imperative that as a community we
work to educate people on a standard set of tools so they can take their
experience to other projects they may decide to work on in the future. While
git is a fantastic version control system (VCS), it is not a project management
tool nor a cogent way of managing an architectural catalog or backlog; this
proposal is limited to motivating the creation of a standardized definition of
work in order to facilitate project management. This primitive for describing
a unit of work may also allow contributors to create their own personalized
view of the state of the project while relying on Git and GitHub for consistency
and durable storage.
-->
除了随时间管理问题的挑战之外，在问题中搜索文本可能具有挑战性。
问题的扁平层次也会使导航和分类变得棘手。
虽然并非所有的社区成员都可能不适合直接使用Git，但作为一个社区，我们必须努力教人们使用一套标准工具，
以便他们可以将他们的经验带到他们可能决定在未来开展工作的其他项目中。
虽然git是一个梦幻般的版本控制系统（VCS），但它不是一个项目管理工具，也不是一个管理建筑目录或积压的有效方法;
该提案仅限于激励创建标准化的工作定义，以促进项目管理。
用于描述工作单元的这个原语也可以允许贡献者创建他们自己的项目状态的个性化视图，同时依靠Git和GitHub实现一致性和持久存储。

<!-- ## Unresolved Questions -->
## 未解决的问题

<!--
- How reviewers and approvers are assigned to a KEP
- Approval decision process for a KEP
- Example schedule, deadline, and time frame for each stage of a KEP
- Communication/notification mechanisms
- Review meetings and escalation procedure
- Decision on where development should occur
-->
- 评估者(reviewers)和批准者(approvers)如何分配给KEP
- KEP的审批决定流程
- KEP每个阶段的示例时间表，截止日期和时间范围
- 沟通/通知机制
- 审查会议和升级程序
- 决定改进应该发生在哪里

<!-- ## Mentors -->
## 导师

- caleb miles
  - github: [calebamiles](https://github.com/calebamiles/)
  - slack: [calebamiles](https://coreos.slack.com/team/caleb.miles)
  - email: [caleb.miles@coreos.com](mailto:caleb.miles@coreos.com)
  - pronoun: "he"
