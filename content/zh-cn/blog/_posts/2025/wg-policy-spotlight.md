---
layout: blog
title: "聚焦策略工作组"
slug: wg-policy-spotlight-2025
date: 2025-10-18
author: Arujjwal Negi
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---  
<!--
---  
layout: blog
title: "Spotlight on Policy Working Group"
slug: wg-policy-spotlight-2025
date: 2025-10-18
author: Arujjwal Negi
---  
-->

<!--
*(Note: The Policy Working Group has completed its mission and is no longer active. This article reflects its work, accomplishments, and insights into how a working group operates.)*
-->
*（注：策略工作组已完成其使命并停止活动。本文反映了其工作、成就以及对工作组运作方式的见解。）*

<!--
In the complex world of Kubernetes, policies play a crucial role in managing and securing clusters. But have you ever wondered how these policies are developed, implemented, and standardized across the Kubernetes ecosystem? To answer that, let's take a look back at the work of the Policy Working Group.

The Policy Working Group was dedicated to a critical mission: providing an overall architecture that encompasses both current policy-related implementations and future policy proposals in Kubernetes. Their goal was both ambitious and essential: to develop a universal policy architecture that benefits developers and end-users alike.
-->
在复杂的 Kubernetes 世界中，策略在管理和保护集群方面发挥着至关重要的作用。
但你是否想过这些策略是如何在 Kubernetes 生态系统中开发、实施和标准化的？
为了回答这个问题，让我们回顾一下策略工作组的工作。

策略工作组致力于一项关键使命：提供一个总体架构，
涵盖 Kubernetes 中当前的策略相关实现和未来的策略提案。
他们的目标既雄心勃勃又至关重要：开发一个对开发者和最终用户都有益的通用策略架构。

<!--
Through collaborative methods, this working group strove to bring clarity and consistency to the often complex world of Kubernetes policies. By focusing on both existing implementations and future proposals, they ensured that the policy landscape in Kubernetes remains coherent and accessible as the technology evolves.

This blog post dives deeper into the work of the Policy Working Group, guided by insights from its former co-chairs:
-->
通过协作方法，这个工作组努力为通常复杂的 Kubernetes 策略世界带来清晰性和一致性。
通过关注现有实现和未来提案，他们确保随着技术的发展，Kubernetes 中的策略格局保持连贯和可访问。

本文在其前联合主席的见解指导下，深入探讨了策略工作组的工作：

- [Jim Bugwadia](https://twitter.com/JimBugwadia)
- [Poonam Lamba](https://twitter.com/poonam_lamba)
- [Andy Suderman](https://twitter.com/sudermanjr)

<!--
_Interviewed by [Arujjwal Negi](https://twitter.com/arujjval)._

These co-chairs explained what the Policy Working Group was all about.
-->
**采访者：[Arujjwal Negi](https://twitter.com/arujjval)**

这些联合主席解释了策略工作组的全部内容。

<!--
## Introduction  
-->
## 介绍

<!--
**Hello, thank you for the time! Let's start with some introductions, could you tell us a bit about yourself, your role, and how you got involved in Kubernetes?**

**Jim Bugwadia**: My name is Jim Bugwadia, and I am a co-founder and the CEO at Nirmata which provides solutions that automate security and compliance for cloud-native workloads. At Nirmata, we have been working with Kubernetes since it started in 2014. We initially built a Kubernetes policy engine in our commercial platform and later donated it to CNCF as the Kyverno project. I joined the CNCF Kubernetes Policy Working Group to help build and standardize various aspects of policy management for Kubernetes and later became a co-chair.
-->
**你好，感谢你抽出时间！让我们从一些介绍开始，你能告诉我们一些关于你自己、你的角色以及你如何参与 Kubernetes 的信息吗？**

**Jim Bugwadia**：我叫 Jim Bugwadia，是 Nirmata 的联合创始人兼首席执行官，
Nirmata 提供自动化云原生工作负载安全和合规的解决方案。
在 Nirmata，我们从 2014 年 Kubernetes 诞生之初就一直在使用它。
我们最初在商业平台中构建了一个 Kubernetes 策略引擎，后来将其作为 Kyverno 项目捐赠给了 CNCF。
我加入了 CNCF Kubernetes 策略工作组，帮助构建和标准化 Kubernetes 策略管理的各个方面，后来成为联合主席。


<!--
**Andy Suderman**: My name is Andy Suderman and I am the CTO of Fairwinds, a managed Kubernetes-as-a-Service provider. I began working with Kubernetes in 2016 building a web conferencing platform. I am an author and/or maintainer of several Kubernetes-related open-source projects such as Goldilocks, Pluto, and Polaris. Polaris is a JSON-schema-based policy engine, which started Fairwinds' journey into the policy space and my involvement in the Policy Working Group.

**Poonam Lamba**: My name is Poonam Lamba, and I currently work as a Product Manager for Google Kubernetes Engine (GKE) at Google. My journey with Kubernetes began back in 2017 when I was building an SRE platform for a large enterprise, using a private cloud built on Kubernetes. Intrigued by its potential to revolutionize the way we deployed and managed applications at the time, I dove headfirst into learning everything I could about it. Since then, I've had the opportunity to build the policy and compliance products for GKE. I lead and contribute to GKE CIS benchmarks. I am involved with the Gatekeeper project as well as I have contributed to Policy-WG for over 2 years and served as a co-chair for the group.

*Responses to the following questions represent an amalgamation of insights from the former co-chairs.*
-->
**Andy Suderman**：我叫 Andy Suderman，是 Fairwinds 的首席技术官，
Fairwinds 是一家托管 Kubernetes-as-a-Service 提供商。
我从 2016 年开始使用 Kubernetes 构建网络会议平台。
我是几个 Kubernetes 相关开源项目的作者和/或维护者，例如 Goldilocks、Pluto 和 Polaris。
Polaris 是一个基于 JSON 模式的策略引擎，它开启了 Fairwinds 在策略领域的旅程以及我在策略工作组的参与。

**Poonam Lamba**：我叫 Poonam Lamba，目前在 Google 担任 Google Kubernetes Engine (GKE) 的产品经理。
我与 Kubernetes 的旅程始于 2017 年，当时我正在为一家大型企业构建 SRE 平台，
使用基于 Kubernetes 的私有云。当时我被它改变应用程序部署和管理方式的潜力所吸引，
全身心投入学习它的一切。从那时起，我有机会为 GKE 构建策略和合规产品。
我领导并贡献了 GKE CIS 基准测试。我参与了 Gatekeeper 项目，并为 Policy-WG 贡献了超过 2 年的时间，
并担任该小组的联合主席。

**以下问题的回答代表了前联合主席见解的融合。**

<!--
## About Working Groups

**One thing even I am not aware of is the difference between a working group and a SIG. Can you help us understand what a working group is and how it is different from a SIG?**

Unlike SIGs, working groups are temporary and focused on tackling specific, cross-cutting issues or projects that may involve multiple SIGs. Their lifespan is defined, and they disband once they've achieved their objective. Generally, working groups don't own code or have long-term responsibility for managing a particular area of the Kubernetes project.

(To know more about SIGs, visit the [list of Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md))
 -->
## 关于工作组

**有一件事我甚至不知道，那就是工作组和 SIG 之间的区别。
你能帮助我们理解什么是工作组以及它与 SIG 的区别吗？**

与 SIG 不同，工作组是临时的，专注于解决特定的、跨领域的问题或项目，这些问题或项目可能涉及多个 SIG。
它们的生命周期是明确的，一旦实现目标就会解散。通常，工作组不拥有代码，也没有长期负责管理 Kubernetes 项目特定领域的责任。

（要了解更多关于 SIG 的信息，请访问
[Special Interest Groups 列表](https://github.com/kubernetes/community/blob/master/sig-list.md)）

<!--
**You mentioned that Working Groups involve multiple SIGS. What SIGS was the Policy WG closely involved with, and how did you coordinate with them?**

The group collaborated closely with Kubernetes SIG Auth throughout our existence, and more recently, the group also worked with SIG Security since its formation. Our collaboration occurred in a few ways. We provided periodic updates during the SIG meetings to keep them informed of our progress and activities. Additionally, we utilize other community forums to maintain open lines of communication and ensured our work aligned with the broader Kubernetes ecosystem. This collaborative approach helped the group stay coordinated with related efforts across the Kubernetes community.
-->
**你提到工作组涉及多个 SIG。策略 WG 与哪些 SIG 密切合作，你如何与它们协调？**

该小组在整个存在期间与 Kubernetes SIG Auth 密切合作，
最近，该小组还与 SIG Security 自成立以来进行了合作。我们的合作以几种方式进行。
我们在 SIG 会议期间提供定期更新，让他们了解我们的进展和活动。
此外，我们利用其他社区论坛保持开放的沟通渠道，并确保我们的工作与更广泛的 Kubernetes 生态系统保持一致。
这种协作方法帮助该小组与 Kubernetes 社区的相关努力保持协调。

<!--
## Policy WG

**Why was the Policy Working Group created?**

To enable a broad set of use cases, we recognize that Kubernetes is powered by a highly declarative, fine-grained, and extensible configuration management system. We've observed that a Kubernetes configuration manifest may have different portions that are important to various stakeholders. For example, some parts may be crucial for developers, while others might be of particular interest to security teams or address operational concerns. Given this complexity, we believe that policies governing the usage of these intricate configurations are essential for success with Kubernetes.

Our Policy Working Group was created specifically to research the standardization of policy definitions and related artifacts. We saw a need to bring consistency and clarity to how policies are defined and implemented across the Kubernetes ecosystem, given the diverse requirements and stakeholders involved in Kubernetes deployments.
 -->
## 策略 WG

**为什么创建策略工作组？**

为了支持广泛的用例，我们认识到 Kubernetes 由高度声明式、细粒度和可扩展的配置管理系统提供动力。
我们观察到 Kubernetes 配置清单可能有不同的部分，这些部分对不同的利益相关者很重要。
例如，某些部分可能对开发者至关重要，而其他部分可能对安全团队特别感兴趣或解决运营问题。
鉴于这种复杂性，我们认为管理这些复杂配置使用的策略对于 Kubernetes 的成功至关重要。

我们的策略工作组策略定义和相关策略定义和相关工件的标准化。
 Kubernetes 部署涉及的多样化需求和利益相关者，
 我们认为有必要为 Kubernetes 生态系统中策略的定义和实施方式带来一致性和清晰度。

<!--
**Can you give me an idea of the work you did in the group?**

We worked on several Kubernetes policy-related projects. Our initiatives included:

- We worked on a Kubernetes Enhancement Proposal (KEP) for the Kubernetes Policy Reports API. This aims to standardize how policy reports are generated and consumed within the Kubernetes ecosystem.
- We conducted a CNCF survey to better understand policy usage in the Kubernetes space. This helped gauge the practices and needs across the community at the time.
- We wrote a paper that will guide users in achieving PCI-DSS compliance for containers. This is intended to help organizations meet important security standards in their Kubernetes environments.
- We also worked on a paper highlighting how shifting security down can benefit organizations. This focuses on the advantages of implementing security measures earlier in the development and deployment process.
-->
**你能给我一个关于你在小组中所做工作的想法吗？**

我们参与了多个 Kubernetes 策略相关项目。我们的举措包括：

- 我们为 Kubernetes Policy Reports API 编写了 Kubernetes Enhancement Proposal (KEP)。
  这旨在标准化 Kubernetes 生态系统中策略报告的生成和消费方式。
- 我们进行了一项 CNCF 调查，以更好地了解 Kubernetes 领域的策略使用情况。这有助于衡量当时社区的实践和需求。
- 我们撰写了一篇论文，指导用户实现容器的 PCI-DSS 合规。这旨在帮助组织在其 Kubernetes 环境中满足重要的安全标准。
- 我们还撰写了一篇论文，强调将安全措施前移如何使组织受益。这侧重于在开发和部署过程早期实施安全措施的优势。

<!--
**Can you tell us what were the main objectives of the Policy Working Group and some of your key accomplishments?**

The charter of the Policy WG was to help standardize policy management for Kubernetes and educate the community on best practices.

To accomplish this we updated the Kubernetes documentation ([Policies | Kubernetes](https://kubernetes.io/docs/concepts/policy)), produced several whitepapers ([Kubernetes Policy Management](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/policy/CNCF_Kubernetes_Policy_Management_WhitePaper_v1.pdf), [Kubernetes GRC](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/policy_grc/Kubernetes_Policy_WG_Paper_v1_101123.pdf)), and created the Policy Reports API ([API reference](https://github.com/kubernetes-retired/wg-policy-prototypes/blob/master/policy-report/docs/api-docs.md)) which standardizes reporting across various tools. Several popular tools such as Falco, Trivy, Kyverno, kube-bench, and others support the Policy Report API. A major milestone for the Policy WG was promoting the Policy Reports API to a SIG-level API or finding it a stable home.
-->
**你能告诉我们策略工作组的主要目标和一些关键成就吗？**

策略 WG 的章程是帮助标准化 Kubernetes 的策略管理，并教育社区了解最佳实践。

为实现这一目标，我们更新了 Kubernetes 文档（[Policies | Kubernetes](https://kubernetes.io/docs/concepts/policy)），
制作了多篇白皮书（[Kubernetes Policy Management](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/policy/CNCF_Kubernetes_Policy_Management_WhitePaper_v1.pdf)、
[Kubernetes GRC](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/policy_grc/Kubernetes_Policy_WG_Paper_v1_101123.pdf)），
并创建了 Policy Reports API（[API reference](https://github.com/kubernetes-retired/wg-policy-prototypes/blob/master/policy-report/docs/api-docs.md)），
该 API 标准化了各种工具的报告。Falco、Trivy、Kyverno、kube-bench 等多个流行工具都支持
Policy Report API。策略 WG 的一个重要里程碑是将 Policy Reports API 提升为 SIG 级 API
或为其找到一个稳定的归宿。

<!--
Beyond that, as [ValidatingAdmissionPolicy](https://kubernetes.io/docs/reference/access-authn-authz/validating-admission-policy/) and [MutatingAdmissionPolicy](https://kubernetes.io/docs/reference/access-authn-authz/mutating-admission-policy/) approached GA in Kubernetes, a key goal of the WG was to guide and educate the community on the tradeoffs and appropriate usage patterns for these built-in API objects and other CNCF policy management solutions like OPA/Gatekeeper and Kyverno.
-->
除此之外，随着 [ValidatingAdmissionPolicy](https://kubernetes.io/docs/reference/access-authn-authz/validating-admission-policy/)
和 [MutatingAdmissionPolicy](https://kubernetes.io/docs/reference/access-authn-authz/mutating-admission-policy/)
在 Kubernetes 中接近 GA，WG 的一个关键目标是指导和教育社区了解这些内置 API
对象以及其他 CNCF 策略管理解决方案（如 OPA/Gatekeeper 和 Kyverno）的权衡和适当使用模式。

<!--
## Challenges

**What were some of the major challenges that the Policy Working Group worked on?**

During our work in the Policy Working Group, we encountered several challenges:

- One of the main issues we faced was finding time to consistently contribute. Given that many of us have other professional commitments, it can be difficult to dedicate regular time to the working group's initiatives.

- Another challenge we experienced was related to our consensus-driven model. While this approach ensures that all voices are heard, it can sometimes lead to slower decision-making processes. We valued thorough discussion and agreement, but this can occasionally delay progress on our projects.
-->
## 挑战

**策略工作组遇到的一些主要挑战是什么？**

在策略工作组的工作期间，我们遇到了几个挑战：

- 我们面临的主要问题之一是找到时间持续贡献。鉴于我们许多人有其他专业承诺，很难为工作组的举措投入定期时间。

- 我们遇到的另一个挑战与我们的共识驱动模式有关。虽然这种方法确保所有声音都被听到，但有时会导致决策过程变慢。
  我们重视深入讨论和达成一致，但这有时会延迟我们项目的进展。

<!--
- We've also encountered occasional differences of opinion among group members. These situations require careful navigation to ensure that we maintain a collaborative and productive environment while addressing diverse viewpoints.

- Lastly, we've noticed that newcomers to the group may find it difficult to contribute effectively without consistent attendance at our meetings. The complex nature of our work often requires ongoing context, which can be challenging for those who aren't able to participate regularly.
-->
- 我们也遇到了小组成员之间偶尔出现的意见分歧。这些情况需要谨慎处理，
  以确保我们在解决不同观点的同时保持协作和高效的环境。

- 最后，我们注意到，新来的成员如果不能持续参加我们的会议，可能会发现难以有效贡献。
  我们工作的复杂性通常需要持续的上下文，这对于不能定期参与的人来说可能是个挑战。

<!--
**Can you tell me more about those challenges? How did you discover each one? What has the impact been? What were some strategies you used to address them?**

There are no easy answers, but having more contributors and maintainers greatly helps! Overall the CNCF community is great to work with and is very welcoming to beginners. So, if folks out there are hesitating to get involved, I highly encourage them to attend a WG or SIG meeting and just listen in.

It often takes a few meetings to fully understand the discussions, so don't feel discouraged if you don't grasp everything right away. We made a point to emphasize this and encouraged new members to review documentation as a starting point for getting involved.

Additionally, differences of opinion were valued and encouraged within the Policy-WG. We adhered to the CNCF core values and resolve disagreements by maintaining respect for one another. We also strove to timebox our decisions and assign clear responsibilities to keep things moving forward.
-->
**你能告诉我更多关于这些挑战的信息吗？你是如何发现每个挑战的？影响是什么？你使用了哪些策略来解决它们？**

没有简单的答案，但拥有更多的贡献者和维护者会有很大帮助！
总体而言，CNCF 社区非常适合合作，并且非常欢迎初学者。
所以，如果有人在犹豫是否参与，我强烈鼓励他们参加 WG 或 SIG 会议，只是旁听。

通常需要几次会议才能完全理解讨论内容，所以如果你不能立即掌握所有内容，
请不要气馁。我们特别强调这一点，并鼓励新成员将查阅文档作为参与的起点。

此外，在 Policy-WG 中，意见分歧受到重视和鼓励。
我们遵守 CNCF 核心价值观，并通过保持相互尊重来解决分歧。
我们还努力为决策设定时间限制并分配明确的责任，以保持工作向前推进。

---

<!--
This is where our discussion about the Policy Working Group ends. The working group, and especially the people who took part in this article, hope this gave you some insights into the group's aims and workings. You can get more info about Working Groups [here](https://github.com/kubernetes/community/blob/master/committee-steering/governance/wg-governance.md).
-->
我们关于策略工作组的讨论到此结束。工作组，特别是参与本文的人员，希望这能让你对该小组的目标和运作方式有所了解。
你可以在[此处](https://github.com/kubernetes/community/blob/master/committee-steering/governance/wg-governance.md)
获取有关工作组的更多信息 。
