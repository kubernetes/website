---
layout: blog
title: "聚焦 SIG API Machinery"
slug: sig-api-machinery-spotlight-2024
date: 2024-08-07
author: "Frederico Muñoz (SAS Institute)"
translator: >
  [Michael Yao](https://github.com/windsonsea) (DaoCloud)
---
<!--
layout: blog
title: "Spotlight on SIG API Machinery"
slug: sig-api-machinery-spotlight-2024
canonicalUrl: https://www.kubernetes.dev/blog/2024/08/07/sig-api-machinery-spotlight-2024
date: 2024-08-07
author: "Frederico Muñoz (SAS Institute)"
-->

<!--
We recently talked with [Federico Bongiovanni](https://github.com/fedebongio) (Google) and [David
Eads](https://github.com/deads2k) (Red Hat), Chairs of SIG API Machinery, to know a bit more about
this Kubernetes Special Interest Group.
-->
我们最近与 SIG API Machinery 的主席
[Federico Bongiovanni](https://github.com/fedebongio)（Google）和
[David Eads](https://github.com/deads2k)（Red Hat）进行了访谈，
了解一些有关这个 Kubernetes 特别兴趣小组的信息。

<!--
## Introductions

**Frederico (FSM): Hello, and thank your for your time. To start with, could you tell us about
yourselves and how you got involved in Kubernetes?**
-->
## 介绍   {#introductions}

**Frederico (FSM)：你好，感谢你抽时间参与访谈。首先，你能做个自我介绍以及你是如何参与到 Kubernetes 的？**

<!--
**David**: I started working on
[OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift) (the Red Hat
distribution of Kubernetes) in the fall of 2014 and got involved pretty quickly in API Machinery. My
first PRs were fixing kube-apiserver error messages and from there I branched out to `kubectl`
(_kubeconfigs_ are my fault!), `auth` ([RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) and `*Review` APIs are ports
from OpenShift), `apps` (_workqueues_ and _sharedinformers_ for example). Don’t tell the others,
but API Machinery is still my favorite :)
-->
**David**：我在 2014 年秋天开始在
[OpenShift](https://www.redhat.com/zh/technologies/cloud-computing/openshift)
（Red Hat 的 Kubernetes 发行版）工作，很快就参与到 API Machinery 的工作中。
我的第一个 PR 是修复 kube-apiserver 的错误消息，然后逐渐扩展到 `kubectl`（_kubeconfigs_ 是我的杰作！），
`auth`（[RBAC](https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/rbac/)
和 `*Review` API 是从 OpenShift 移植过来的），`apps`（例如 _workqueues_ 和 _sharedinformers_）。
别告诉别人，但 API Machinery 仍然是我的最爱 :)

<!--
**Federico**: I was not as early in Kubernetes as David, but now it's been more than six years. At
my previous company we were starting to use Kubernetes for our own products, and when I came across
the opportunity to work directly with Kubernetes I left everything and boarded the ship (no pun
intended). I joined Google and Kubernetes in early 2018, and have been involved since.
-->
**Federico**：我加入 Kubernetes 没有 David 那么早，但现在也已经超过六年了。
在我之前的公司，我们开始为自己的产品使用 Kubernetes，当我有机会直接参与 Kubernetes 的工作时，
我放下了一切，登上了这艘船（无意双关）。我在 2018 年初加入 Google 从事 Kubernetes 的相关工作，
从那时起一直参与其中。

<!--
## SIG Machinery's scope

**FSM: It only takes a quick look at the SIG API Machinery charter to see that it has quite a
significant scope, nothing less than the Kubernetes control plane. Could you describe this scope in
your own words?**
-->
## SIG Machinery 的范围   {#sig-machinerys-scope}

**FSM：只需快速浏览一下 SIG API Machinery 的章程，就可以看到它的范围相当广泛，
不亚于 Kubernetes 的控制平面。你能用自己的话描述一下这个范围吗？**

<!--
**David**: We own the `kube-apiserver` and how to efficiently use it. On the backend, that includes
its contract with backend storage and how it allows API schema evolution over time.  On the
frontend, that includes schema best practices, serialization, client patterns, and controller
patterns on top of all of it.

**Federico**: Kubernetes has a lot of different components, but the control plane has a really
critical mission: it's your communication layer with the cluster and also owns all the extensibility
mechanisms that make Kubernetes so powerful. We can't make mistakes like a regression, or an
incompatible change, because the blast radius is huge.
-->
**David**：我们全权负责 `kube-apiserver` 以及如何高效地使用它。
在后端，这包括它与后端存储的契约以及如何让 API 模式随时间演变。
在前端，这包括模式的最佳实践、序列化、客户端模式以及在其之上的控制器模式。

**Federico**：Kubernetes 有很多不同的组件，但控制平面有一个非常关键的任务：
它是你与集群的通信层，同时也拥有所有使 Kubernetes 如此强大的可扩展机制。
我们不能犯像回归或不兼容变更这样的错误，因为影响范围太大了。

<!--
**FSM: Given this breadth, how do you manage the different aspects of it?**

**Federico**: We try to organize the large amount of work into smaller areas. The working groups and
subprojects are part of it. Different people on the SIG have their own areas of expertise, and if
everything fails, we are really lucky to have people like David, Joe, and Stefan who really are "all
terrain", in a way that keeps impressing me even after all these years.  But on the other hand this
is the reason why we need more people to help us carry the quality and excellence of Kubernetes from
release to release.
-->
**FSM：鉴于这个广度，你们如何管理它的不同方面？**

**Federico**：我们尝试将大量工作组织成较小的领域。工作组和子项目是其中的一部分。
SIG 中的各位贡献者有各自的专长领域，如果一切都失败了，我们很幸运有像 David、Joe 和 Stefan 这样的人，
他们真的是“全能型”，这种方式让我在这些年里一直感到惊叹。但另一方面，
这也是为什么我们需要更多人来帮助我们在版本变迁之时保持 Kubernetes 的质量和卓越。

<!--
## An evolving collaboration model

**FSM: Was the existing model always like this, or did it evolve with time - and if so, what would
you consider the main changes and the reason behind them?**

**David**: API Machinery has evolved over time both growing and contracting in scope.  When trying
to satisfy client access patterns it’s very easy to add scope both in terms of features and applying
them.
-->
## 不断演变的协作模式   {#an-evolving-collaboration-model}

**FSM：现有的模式一直是这样，还是随着时间的推移而演变的 - 如果是在演变的，你认为主要的变化以及背后的原因是什么？**

**David**：API Machinery 在随着时间的推移不断发展，既有扩展也有收缩。
在尝试满足客户端访问模式时，它很容易在特性和应用方面扩大范围。

<!--
A good example of growing scope is the way that we identified a need to reduce memory utilization by
clients writing controllers and developed shared informers.  In developing shared informers and the
controller patterns use them (workqueues, error handling, and listers), we greatly reduced memory
utilization and eliminated many expensive lists.  The downside: we grew a new set of capability to
support and effectively took ownership of that area from sig-apps.
-->
一个范围扩大的好例子是我们认识到需要减少客户端写入控制器时的内存使用率而开发了共享通知器。
在开发共享通知器和使用它们的控制器模式（工作队列、错误处理和列举器）时，
我们大大减少了内存使用率，并消除了许多占用资源较多的列表。
缺点是：我们增加了一套新的权能来提供支持，并有效地从 sig-apps 接管了该领域的所有权。

<!--
For an example of more shared ownership: building out cooperative resource management (the goal of
server-side apply), `kubectl` expanded to take ownership of leveraging the server-side apply
capability.  The transition isn’t yet complete, but [SIG
CLI](https://github.com/kubernetes/community/tree/master/sig-cli) manages that usage and owns it.
-->
一个更多共享所有权的例子是：构建出合作的资源管理（服务器端应用的目标），
`kubectl` 扩展为负责利用服务器端应用的权能。这个过渡尚未完成，
但 [SIG CLI](https://github.com/kubernetes/community/tree/master/sig-cli) 管理其使用情况并拥有它。

<!--
**FSM: And for the boundary between approaches, do you have any guidelines?**

**David**: I think much depends on the impact. If the impact is local in immediate effect, we advise
other SIGs and let them move at their own pace.  If the impact is global in immediate effect without
a natural incentive, we’ve found a need to press for adoption directly.

**FSM: Still on that note, SIG Architecture has an API Governance subproject, is it mostly
independent from SIG API Machinery or are there important connection points?**
-->
**FSM：对于方法之间的权衡，你们有什么指导方针吗？**

**David**：我认为这很大程度上取决于影响。如果影响在立即见效中是局部的，
我们会给其他 SIG 提出建议并让他们以自己的节奏推进。
如果影响在立即见效中是全局的且没有自然的激励，我们发现需要直接推动采用。

**FSM：仍然在这个话题上，SIG Architecture 有一个 API Governance 子项目，
它与 SIG API Machinery 是否完全独立，还是有重要的连接点？**

<!--
**David**: The projects have similar sounding names and carry some impacts on each other, but have
different missions and scopes.  API Machinery owns the how and API Governance owns the what.  API
conventions, the API approval process, and the final say on individual k8s.io APIs belong to API
Governance.  API Machinery owns the REST semantics and non-API specific behaviors.

**Federico**: I really like how David put it: *"API Machinery owns the how and API Governance owns
the what"*: we don't own the actual APIs, but the actual APIs live through us.
-->
**David**：这些项目有相似的名称并对彼此产生一些影响，但有不同的使命和范围。
API Machinery 负责“如何做”，而 API Governance 负责“做什么”。
API 约定、API 审批过程以及对单个 k8s.io API 的最终决定权属于 API Governance。
API Machinery 负责 REST 语义和非 API 特定行为。

**Federico**：我真得很喜欢 David 的说法：
**“API Machinery 负责‘如何做’，而 API Governance 负责‘做什么’”**：
我们并未拥有实际的 API，但实际的 API 依靠我们存在。

<!--
## The challenges of Kubernetes popularity

**FSM: With the growth in Kubernetes adoption we have certainly seen increased demands from the
Control Plane: how is this felt and how does it influence the work of the SIG?**

**David**: It’s had a massive influence on API Machinery.  Over the years we have often responded to
and many times enabled the evolutionary stages of Kubernetes.  As the central orchestration hub of
nearly all capability on Kubernetes clusters, we both lead and follow the community.  In broad
strokes I see a few evolution stages for API Machinery over the years, with constantly high
activity.
-->
## Kubernetes 受欢迎的挑战   {#the-challenge-of-kubernetes-popularity}

**FSM：随着 Kubernetes 的采用率上升，我们肯定看到了对控制平面的需求增加：你们对这点的感受如何，它如何影响 SIG 的工作？**

**David**：这对 API Machinery 产生了巨大的影响。多年来，我们经常响应并多次促进了 Kubernetes 的发展阶段。
作为几乎所有 Kubernetes 集群上权能的集中编排中心，我们既领导又跟随社区。
从广义上讲，我看到多年来 API Machinery 经历了一些发展阶段，活跃度一直很高。

<!--
1. **Finding purpose**: `pre-1.0` up until `v1.3` (up to our first 1000+ nodes/namespaces) or
   so. This time was characterized by rapid change.  We went through five different versions of our
   schemas and rose to meet the need.  We optimized for quick, in-tree API evolution (sometimes to
   the detriment of longer term goals), and defined patterns for the first time.

2. **Scaling to meet the need**: `v1.3-1.9` (up to shared informers in controllers) or so.  When we
   started trying to meet customer needs as we gained adoption, we found severe scale limitations in
   terms of CPU and memory. This was where we broadened API machinery to include access patterns, but
   were still heavily focused on in-tree types.  We built the watch cache, protobuf serialization,
   and shared caches.
-->
1. **寻找目标**：从 `pre-1.0` 到 `v1.3`（我们达到了第一个 1000+ 节点/命名空间）。
   这段时间以快速变化为特征。我们经历了五个不同版本的模式，并满足了需求。
   我们优化了快速、树内 API 的演变（有时以牺牲长期目标为代价），并首次定义了模式。

2. **满足需求的扩展**：`v1.3-1.9`（直到控制器中的共享通知器）。
   当我们开始尝试满足客户需求时，我们发现了严重的 CPU 和内存规模限制。
   这也是为什么我们将 API Machinery 扩展到包含访问模式，但我们仍然非常关注树内类型。
   我们构建了 watch 缓存、protobuf 序列化和共享缓存。

<!--
3. **Fostering the ecosystem**: `v1.8-1.21` (up to CRD v1) or so.  This was when we designed and wrote
   CRDs (the considered replacement for third-party-resources), the immediate needs we knew were
   coming (admission webhooks), and evolution to best practices we knew we needed (API schemas).
   This enabled an explosion of early adopters willing to work very carefully within the constraints
   to enable their use-cases for servicing pods.  The adoption was very fast, sometimes outpacing
   our capability, and creating new problems.
-->
3. **培育生态系统**：`v1.8-1.21`（直到 CRD v1）。这是我们设计和编写 CRD（视为第三方资源的替代品）的时间，
   满足我们知道即将到来的即时需求（准入 Webhook），以及我们知道需要的最佳实践演变（API 模式）。
   这促成了早期采用者的爆发式增长，他们愿意在约束内非常谨慎地工作，以实现服务 Pod 的用例。
   采用速度非常快，有时超出了我们的权能，并形成了新的问题。

<!--
4. **Simplifying deployments**: `v1.22+`.  In the relatively recent past, we’ve been responding to
   pressures or running kube clusters at scale with large numbers of sometimes-conflicting ecosystem
   projects using our extensions mechanisms.  Lots of effort is now going into making platform
   extensions easier to write and safer to manage by people who don't hold PhDs in kubernetes.  This
   started with things like server-side-apply and continues today with features like webhook match
   conditions and validating admission policies.
-->
4. **简化部署**：`v1.22+`。在不久之前，
   我们采用扩展机制来响应运行大规模的 Kubernetes 集群的压力，其中包含大量有时会发生冲突的生态系统项目。
   我们投入了许多努力，使平台更易于扩展，管理更安全，就算不是很精通 Kubernetes 的人也能做到。
   这些努力始于服务器端应用，并在如今延续到 Webhook 匹配状况和验证准入策略等特性。

<!--
Work in API Machinery has a broad impact across the project and the ecosystem.  It’s an exciting
area to work for those able to make a significant time investment on a long time horizon.

## The road ahead

**FSM: With those different evolutionary stages in mind, what would you pinpoint as the top
priorities for the SIG at this time?**
-->
API Machinery 的工作对整个项目和生态系统有广泛的影响。
对于那些能够长期投入大量时间的人来说，这是一个令人兴奋的工作领域。

## 未来发展   {#the-road-ahead}

**FSM：考虑到这些不同的发展阶段，你能说说这个 SIG 的当前首要任务是什么吗？**

<!--
**David:** **Reliability, efficiency, and capability** in roughly that order.

With the increased usage of our `kube-apiserver` and extensions mechanisms, we find that our first
set of extensions mechanisms, while fairly complete in terms of capability, carry significant risks
in terms of potential mis-use with large blast radius.  To mitigate these risks, we’re investing in
features that reduce the blast radius for accidents (webhook match conditions) and which provide
alternative mechanisms with lower risk profiles for most actions (validating admission policy).
-->
**David**：大致的顺序为**可靠性、效率和权能**。

随着 `kube-apiserver` 和扩展机制的使用增加，我们发现第一套扩展机制虽然在权能方面相当完整，
但在潜在误用方面存在重大风险，影响范围很大。为了减轻这些风险，我们正在致力于减少事故影响范围的特性
（Webhook 匹配状况）以及为大多数操作提供风险配置较低的替代机制（验证准入策略）。

<!--
At the same time, the increased usage has made us more aware of scaling limitations that we can
improve both server and client-side.  Efforts here include more efficient serialization (CBOR),
reduced etcd load (consistent reads from cache), and reduced peak memory usage (streaming lists).

And finally, the increased usage has highlighted some long existing
gaps that we’re closing.  Things like field selectors for CRDs which
the [Batch Working Group](https://github.com/kubernetes/community/blob/master/wg-batch/README.md)
is eager to leverage and will eventually form the basis for a new way
to prevent trampoline pod attacks from exploited nodes.
-->
同时，使用量的增加使我们更加意识到我们可以同时改进服务器端和客户端的扩缩限制。
这里的努力包括更高效的序列化（CBOR），减少 etcd 负载（从缓存中一致读取）和减少峰值内存使用量（流式列表）。

最后，使用量的增加突显了一些长期存在的、我们正在设法填补的差距。这些包括针对 CRD 的字段选择算符，
[Batch Working Group](https://github.com/kubernetes/community/blob/master/wg-batch/README.md)
渴望利用这些选择算符，并最终构建一种新的方法以防止从有漏洞的节点实施“蹦床式”的 Pod 攻击。

<!--
## Joining the fun

**FSM: For anyone wanting to start contributing, what's your suggestions?**

**Federico**: SIG API Machinery is not an exception to the Kubernetes motto: **Chop Wood and Carry
Water**. There are multiple weekly meetings that are open to everybody, and there is always more
work to be done than people to do it.
-->
## 加入有趣的我们   {#joining-the-fun}

**FSM：如果有人想要开始贡献，你有什么建议？**

**Federico**：SIG API Machinery 毫不例外也遵循 Kubernetes 的风格：**砍柴和挑水（踏实工作，注重细节）**。
有多个每周例会对所有人开放，总是有更多的工作要做，人手总是不够。

<!--
I acknowledge that API Machinery is not easy, and the ramp up will be steep. The bar is high,
because of the reasons we've been discussing: we carry a huge responsibility. But of course with
passion and perseverance many people has ramped up through the years, and we hope more will come.

In terms of concrete opportunities, there is the SIG meeting every two weeks. Everyone is welcome to
attend and listen, see what the group talks about, see what's going on in this release, etc.
-->
我承认 API Machinery 并不容易，入门的坡度会比较陡峭。门槛较高，就像我们所讨论的原因：我们肩负着巨大的责任。
当然凭借激情和毅力，多年来有许多人已经跟了上来，我们希望更多的人加入。

具体的机会方面，每两周有一次 SIG 会议。欢迎所有人参会和听会，了解小组在讨论什么，了解这个版本中发生了什么等等。

<!--
Also two times a week, Tuesday and Thursday, we have the public Bug Triage, where we go through
everything new from the last meeting. We've been keeping this practice for more than 7 years
now. It's a great opportunity to volunteer to review code, fix bugs, improve documentation,
etc. Tuesday's it's at 1 PM (PST) and Thursday is on an EMEA friendly time (9:30 AM PST).  We are
always looking to improve, and we hope to be able to provide more concrete opportunities to join and
participate in the future.
-->
此外，每周两次，周二和周四，我们有公开的 Bug 分类管理会，在会上我们会讨论上次会议以来的所有新内容。
我们已经保持这种做法 7 年多了。这是一个很好的机会，你可以志愿审查代码、修复 Bug、改进文档等。
周二的会议在下午 1 点（PST），周四是在 EMEA 友好时间（上午 9:30 PST）。
我们总是在寻找改进的机会，希望能够在未来提供更多具体的参与机会。

<!--
**FSM: Excellent, thank you! Any final comments you would like to share with our readers?**

**Federico**: As I mentioned, the first steps might be hard, but the reward is also larger. Working
on API Machinery is working on an area of huge impact (millions of users?), and your contributions
will have a direct outcome in the way that Kubernetes works and the way that it's used. For me
that's enough reward and motivation!
-->
**FSM：太好了，谢谢！你们还有什么想与我们的读者分享吗？**

**Federico**：正如我提到的，第一步可能较难，但回报也更大。
参与 API Machinery 的工作就是在加入一个影响巨大（百万用户？）的领域，
你的贡献将直接影响 Kubernetes 的工作方式和使用方式。对我来说，这已经足够作为回报和动力了！
