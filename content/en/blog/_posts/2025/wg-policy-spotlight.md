---
layout: blog
title: "Spotlight on Policy Working Group"
slug: wg-policy-spotlight-2025
date: 2025-10-18
author: Arujjwal Negi
---  

*(Note: The Policy Working Group has completed its mission and is no longer active. This article reflects its work, accomplishments, and insights into how a working group operates.)*

In the complex world of Kubernetes, policies play a crucial role in managing and securing clusters. But have you ever wondered how these policies are developed, implemented, and standardized across the Kubernetes ecosystem? To answer that, let's take a look back at the work of the Policy Working Group.

The Policy Working Group was dedicated to a critical mission: providing an overall architecture that encompasses both current policy-related implementations and future policy proposals in Kubernetes. Their goal was both ambitious and essential: to develop a universal policy architecture that benefits developers and end-users alike.

Through collaborative methods, this working group strove to bring clarity and consistency to the often complex world of Kubernetes policies. By focusing on both existing implementations and future proposals, they ensured that the policy landscape in Kubernetes remains coherent and accessible as the technology evolves.

This blog post dives deeper into the work of the Policy Working Group, guided by insights from its former co-chairs:

-   [Jim Bugwadia](https://twitter.com/JimBugwadia)
-   [Poonam Lamba](https://twitter.com/poonam_lamba)
-   [Andy Suderman](https://twitter.com/sudermanjr)

_Interviewed by [Arujjwal Negi](https://twitter.com/arujjval)._

These co-chairs explained what the Policy Working Group was all about.

## Introduction  

**Hello, thank you for the time! Let’s start with some introductions, could you tell us a bit about yourself, your role, and how you got involved in Kubernetes?**

**Jim Bugwadia**: My name is Jim Bugwadia, and I am a co-founder and the CEO at Nirmata which provides solutions that automate security and compliance for cloud-native workloads. At Nirmata, we have been working with Kubernetes since it started in 2014. We initially built a Kubernetes policy engine in our commercial platform and later donated it to CNCF as the Kyverno project. I joined the CNCF Kubernetes Policy Working Group to help build and standardize various aspects of policy management for Kubernetes and later became a co-chair.

**Andy Suderman**: My name is Andy Suderman and I am the CTO of Fairwinds, a managed Kubernetes-as-a-Service provider. I began working with Kubernetes in 2016 building a web conferencing platform. I am an author and/or maintainer of several Kubernetes-related open-source projects such as Goldilocks, Pluto, and Polaris. Polaris is a JSON-schema-based policy engine, which started Fairwinds' journey into the policy space and my involvement in the Policy Working Group.

**Poonam Lamba**: My name is Poonam Lamba, and I currently work as a Product Manager for Google Kubernetes Engine (GKE) at Google. My journey with Kubernetes began back in 2017 when I was building an SRE platform for a large enterprise, using a private cloud built on Kubernetes. Intrigued by its potential to revolutionize the way we deployed and managed applications at the time, I dove headfirst into learning everything I could about it. Since then, I've had the opportunity to build the policy and compliance products for GKE. I lead and contribute to GKE CIS benchmarks. I am involved with the Gatekeeper project as well as I have contributed to Policy-WG for over 2 years and served as a co-chair for the group.

*Responses to the following questions represent an amalgamation of insights from the former co-chairs.*

## About Working Groups

**One thing even I am not aware of is the difference between a working group and a SIG. Can you help us understand what a working group is and how it is different from a SIG?**

Unlike SIGs, working groups are temporary and focused on tackling specific, cross-cutting issues or projects that may involve multiple SIGs. Their lifespan is defined, and they disband once they've achieved their objective. Generally, working groups don't own code or have long-term responsibility for managing a particular area of the Kubernetes project.

(To know more about SIGs, visit the [list of Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md))
 
**You mentioned that Working Groups involve multiple SIGS. What SIGS was the Policy WG closely involved with, and how did you coordinate with them?**

The group collaborated closely with Kubernetes SIG Auth throughout our existence, and more recently, the group also worked with SIG Security since its formation. Our collaboration occurred in a few ways. We provided periodic updates during the SIG meetings to keep them informed of our progress and activities. Additionally, we utilize other community forums to maintain open lines of communication and ensured our work aligned with the broader Kubernetes ecosystem. This collaborative approach helped the group stay coordinated with related efforts across the Kubernetes community.

## Policy WG
  
**Why was the Policy Working Group created?**

To enable a broad set of use cases, we recognize that Kubernetes is powered by a highly declarative, fine-grained, and extensible configuration management system. We've observed that a Kubernetes configuration manifest may have different portions that are important to various stakeholders. For example, some parts may be crucial for developers, while others might be of particular interest to security teams or address operational concerns. Given this complexity, we believe that policies governing the usage of these intricate configurations are essential for success with Kubernetes.

Our Policy Working Group was created specifically to research the standardization of policy definitions and related artifacts. We saw a need to bring consistency and clarity to how policies are defined and implemented across the Kubernetes ecosystem, given the diverse requirements and stakeholders involved in Kubernetes deployments.
 
**Can you give me an idea of the work you did in the group?**

We worked on several Kubernetes policy-related projects. Our initiatives included:

- We worked on a Kubernetes Enhancement Proposal (KEP) for the Kubernetes Policy Reports API. This aims to standardize how policy reports are generated and consumed within the Kubernetes ecosystem.
- We conducted a CNCF survey to better understand policy usage in the Kubernetes space. This helped gauge the practices and needs across the community at the time.
- We wrote a paper that will guide users in achieving PCI-DSS compliance for containers. This is intended to help organizations meet important security standards in their Kubernetes environments.
- We also worked on a paper highlighting how shifting security down can benefit organizations. This focuses on the advantages of implementing security measures earlier in the development and deployment process.


**Can you tell us what were the main objectives of the Policy Working Group and some of your key accomplishments?**

The charter of the Policy WG was to help standardize policy management for Kubernetes and educate the community on best practices.

To accomplish this we updated the Kubernetes documentation ([Policies | Kubernetes](https://kubernetes.io/docs/concepts/policy)), produced several whitepapers ([Kubernetes Policy Management](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/policy/CNCF_Kubernetes_Policy_Management_WhitePaper_v1.pdf), [Kubernetes GRC](https://github.com/kubernetes/sig-security/blob/main/sig-security-docs/papers/policy_grc/Kubernetes_Policy_WG_Paper_v1_101123.pdf)), and created the Policy Reports API ([API reference](https://github.com/kubernetes-retired/wg-policy-prototypes/blob/master/policy-report/docs/api-docs.md)) which standardizes reporting across various tools. Several popular tools such as Falco, Trivy, Kyverno, kube-bench, and others support the Policy Report API. A major milestone for the Policy WG was promoting the Policy Reports API to a SIG-level API or finding it a stable home.

Beyond that, as [ValidatingAdmissionPolicy](https://kubernetes.io/docs/reference/access-authn-authz/validating-admission-policy/) and [MutatingAdmissionPolicy](https://kubernetes.io/docs/reference/access-authn-authz/mutating-admission-policy/) approached GA in Kubernetes, a key goal of the WG was to guide and educate the community on the tradeoffs and appropriate usage patterns for these built-in API objects and other CNCF policy management solutions like OPA/Gatekeeper and Kyverno.

## Challenges

**What were some of the major challenges that the Policy Working Group worked on?**

During our work in the Policy Working Group, we encountered several challenges:

- One of the main issues we faced was finding time to consistently contribute. Given that many of us have other professional commitments, it can be difficult to dedicate regular time to the working group's initiatives.

- Another challenge we experienced was related to our consensus-driven model. While this approach ensures that all voices are heard, it can sometimes lead to slower decision-making processes. We valued thorough discussion and agreement, but this can occasionally delay progress on our projects.

- We've also encountered occasional differences of opinion among group members. These situations require careful navigation to ensure that we maintain a collaborative and productive environment while addressing diverse viewpoints.

- Lastly, we've noticed that newcomers to the group may find it difficult to contribute effectively without consistent attendance at our meetings. The complex nature of our work often requires ongoing context, which can be challenging for those who aren't able to participate regularly.

**Can you tell me more about those challenges? How did you discover each one? What has the impact been? What were some strategies you used to address them?**

There are no easy answers, but having more contributors and maintainers greatly helps! Overall the CNCF community is great to work with and is very welcoming to beginners. So, if folks out there are hesitating to get involved, I highly encourage them to attend a WG or SIG meeting and just listen in.

It often takes a few meetings to fully understand the discussions, so don't feel discouraged if you don't grasp everything right away. We made a point to emphasize this and encouraged new members to review documentation as a starting point for getting involved.

Additionally, differences of opinion were valued and encouraged within the Policy-WG. We adhered to the CNCF core values and resolve disagreements by maintaining respect for one another. We also strove to timebox our decisions and assign clear responsibilities to keep things moving forward.


---

This is where our discussion about the Policy Working Group ends. The working group, and especially the people who took part in this article, hope this gave you some insights into the group's aims and workings. You can get more info about Working Groups [here](https://github.com/kubernetes/community/blob/master/committee-steering/governance/wg-governance.md).
