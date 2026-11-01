---
layout: blog
title: "Spotlight on SIG Apps"
slug: sig-apps-spotlight
canonicalUrl: https://www.kubernetes.dev/blog/2026/09/22/sig-apps-spotlight/
date: 2026-09-22T10:00:00-08:00
author: "Natalie Fisher (VMware by Broadcom)" 
---


As Kubernetes adoption has grown, the conversation has shifted beyond running containers to managing increasingly complex application lifecycles. Modern platforms support stateless web services, stateful databases, batch processing, AI workloads, and platform services. At the same time, they must remain reliable during upgrades, scaling events, and infrastructure failures.

Every Kubernetes user relies on SIG Apps, whether they realize it or not. Deployments, StatefulSets, DaemonSets, Jobs, and CronJobs form the foundation of how applications are deployed, updated, scaled, and operated across the Kubernetes ecosystem.

SIG Apps is focused on improving workload resilience, refining application lifecycle management, and addressing the operational challenges that emerge when applications encounter node failures, rollout disruptions, and increasingly complex infrastructure environments.

In this spotlight, we sit down with two of the three SIG Apps chairs [**Janet Kuo**](https://github.com/janetkuo) and [**Maciej Szulik**](https://github.com/soltysh) to discuss the evolution of Kubernetes workload management, the challenges of balancing application reliability with operational simplicity, and the future of application lifecycle management within one of Kubernetes’ most influential Special Interest Groups.

## Introducing SIG Apps

**Natalie Fisher: Can you introduce yourself, your role, and how you got involved in SIG Apps?**

Janet Kuo: I'm a Senior Staff Software Engineer at Google and have been a Kubernetes maintainer since 2015, joining the community just as we were racing toward the 1.0 launch. In those early days, my focus was on building the core Workloads API, specifically developing controllers like Deployment, ReplicaSet, StatefulSet, and DaemonSet, defining their rollout behaviors, and bringing them from initial designs to GA. That hands-on work was my entry point into SIG Apps.

Since then, I've stayed deeply involved in both the technical and community sides of Kubernetes. I have led SIG Apps as Co-Chair and Tech Lead since 2019. Currently, in addition to maintaining the workloads API, I am driving new subprojects like the [Agent Sandbox](https://github.com/kubernetes-sigs/agent-sandbox) to ensure Kubernetes is ready for next-generation agentic and AI workloads.

Maciej Szulik: I started contributing to Kubernetes all the way [back in 2014](https://github.com/kubernetes/kubernetes/pull/3065). Since then, I've worked across various areas of the project: controllers, kubectl, and apimachinery, which eventually led me to become one of the Chairs and Tech Leads for SIG Apps. My current focus is reliability of the workload controllers under the SIG Apps umbrella and stability and ease of use of kubectl as part of my SIG CLI Tech Lead role. I also care about overall community health and growth as part of my Steering Committee role. Outside of Kubernetes, I work as a Staff Platform Engineer at Defense Unicorns, where I'm helping make Kubernetes more airgap-native with a project called [zarf](https://zarf.dev/).

## The problem and the solution

SIG Apps is responsible for the core workload APIs that power how applications run on Kubernetes. From Deployments and StatefulSets to Jobs and CronJobs, these controllers determine how workloads are created, updated, scaled, and recovered when things go wrong.

As Kubernetes expands to support increasingly diverse workloads – including AI, batch processing, and large-scale distributed applications – SIG Apps continues to evolve these APIs while balancing reliability, backward compatibility, and operational simplicity.

**NF: For readers who may not be familiar, what is SIG Apps, and what role does it play within the broader Kubernetes ecosystem?**

MS: SIG Apps is the Kubernetes Special Interest Group responsible for the workloads APIs. CronJob and Job help running batch workloads, whereas DaemonSet, Deployment, ReplicaSet, and StatefulSet serve the majority of other applications. More broadly, SIG Apps owns the layer most developers actually touch day-to-day: the controllers that turn a workload specification into running, self-healing pods. It's the group deciding how Deployments roll out, how Jobs retry, how DaemonSets place a pod per node. 

JK: Adding to what Maciej described, as the industry shifts, we are seeing a massive demand to run complex, non-traditional workloads like distributed AI training, batch computing, and dynamic agent environments. Our role is expanding: we aren't just maintaining the classic workloads API, but we are actively evolving it and establishing new patterns (like the [Agent Sandbox](https://github.com/kubernetes-sigs/agent-sandbox)) to make sure Kubernetes remains the best platform for the next generation of workloads, such as AI.

**NF: Looking at the workload APIs owned by SIG Apps (Deployments, StatefulSets, DaemonSets, Jobs, and CronJobs), which areas are receiving the most attention from maintainers and contributors?**

MS: After a long stretch focused on making batch workloads run smoothly on Kubernetes, we’ve shifted attention to make sure serving workloads (DaemonSets, StatefulSets, etc) aren’t left behind. This means performance and high-scale improvements to rollout and scaling behavior, plus working through our backlog of user-reported issues, prioritizing the ones with the strongest support from the user base.

## Current focus areas

As Kubernetes workloads grow in scale and complexity, the challenges facing workload controllers evolve as well. We asked the SIG Apps chairs where contributors are focusing their efforts today and which resilience problems they believe are the highest priorities.

**NF: From your perspective, what are the most important workload resilience problems SIG Apps is trying to solve today?**

MS: Node lifecycle challenges have come up repeatedly across SIG Apps, SIG Node, and SIG Autoscaling discussions. DaemonSets and Jobs are just where the pain is most visible, since they're the workloads most directly bound to node state. Rather than solve it piecemeal within one SIG, we've settled on spinning up a dedicated [Node Lifecycle Working Group](https://github.com/kubernetes/community/blob/main/wg-node-lifecycle/README.md) to focus on this properly and hopefully land long-term solutions instead of one-off patches.

JK: From an AI perspective, resilience is critical. When you are running a massive distributed LLM training job that spans hundreds of GPUs, a single node failure can halt the entire pipeline. Similarly, if a DaemonSet that runs your logging or GPU monitoring agent gets stuck on a bad node, it impacts the entire cluster's health. 

In addition to the work in the Node Lifecycle WG to handle infrastructure-level degradation, SIG Apps is addressing this at the orchestration layer through subprojects like [JobSet](https://github.com/kubernetes-sigs/jobset/) (for distributed training) and [LeaderWorkerSet (LWS)](https://github.com/kubernetes-sigs/lws/) (for sharded LLM inference). These APIs introduce patterns like "all-or-nothing" failure handling, where a single pod or job failure triggers a coordinated group-level restart to resume from the last clean checkpoint, rather than letting stuck workloads hang in an inconsistent state.

## Real-world impact

The work happening within SIG Apps extends far beyond controller implementations and API design. We wanted to understand what these improvements mean in practice for platform teams operating Kubernetes clusters in production.

**NF: For platform teams operating Kubernetes in production, what practical improvements would they notice if the node lifecycle and workload resilience work currently under discussion is successfully delivered?**

MS: I’m mostly looking from the sidelines, the folks actually in the [Node Lifecycle Working Group](https://github.com/kubernetes/community/blob/main/wg-node-lifecycle/README.md) would give you a sharper answer. But from where I sit, I’m hoping their work translates into fewer 3am pages that turn out to be “a DaemonSet rollout got stuck because node X was flaky, and someone had to manually cordon/delete/restart to unstick it.” 

JK: \+1 to what Maciej said, and beyond reducing manual intervention, platform teams will also see much better resource predictability and cost efficiency. For example, in AI workloads where GPU idle time is extremely expensive, having Kubernetes automatically detect a degraded node and reschedule the training coordinator or agent before the job crashes means less wasted compute and more stable job execution.

## Challenges and trade-offs

Evolving APIs that millions of workloads rely on requires careful engineering and even more careful decision-making. We asked the SIG Apps chairs about the technical and operational trade-offs they weigh when introducing changes to Kubernetes’ core workload controllers.

**NF: What are some of the hardest technical or operational trade-offs SIG Apps encounters when evolving core workload controllers?**

MS: Honestly, a few tensions keep coming up: how aggressively a controller should give up on stuck pods, and what signals it actually needs to make that call correctly. At the same time, we always have to think about backward compatibility. Deployment, DaemonSet, and Job behavior has been depended on for a decade \[by Kubernetes users, tooling, automation, and higher-level controllers\], so even a change that’s clearly “more correct” can break automation people built around the old behavior without meaning to.

JK: One of our hardest trade-offs is resisting the urge to make "elegant" design changes that break backward compatibility. Instead, we have to design opt-in features that let users adopt new behaviors without forcing them on legacy workloads. When we need to support completely new paradigms, we prefer introducing them as CRDs first rather than bloating the core APIs, like we are doing with Agent Sandbox, JobSet, and LWS.

## Looking ahead

While much of SIG Apps’ work focuses on maintaining the stability of existing workload APIs, the group is also shaping the future of Kubernetes through new enhancements and proposals. We concluded by asking about one proposal that recently returned to active development and what it represents for the future of workload management.

**NF: The SIG recently discussed reviving KEP-4443 with a target release of Kubernetes 1.38. What opportunities or challenges does this proposal aim to address, and why is now the right time to revisit it?**

[KEP-4443](https://www.kubernetes.dev/resources/keps/4443/) addresses a small but real gap in the Job API: a [PodFailurePolicy](https://kubernetes.io/docs/concepts/workloads/controllers/job/#pod-failure-policy) can be configured to add a condition reason to the JobFailed condition, but different pod failure policy rules targeting different container exit codes all produce that same generic reason. The proposal is simple: an optional Name field on each PodFailurePolicyRule, which gets appended to the JobFailed condition reason, so higher-level tools like JobSet can finally react differently depending on which rule triggered the failure.

As for timing, the answer is as simple as it always is in open source: we lost the original contributor who was driving this. Now we’ve got someone new interested in picking it up, that’s why we’re targeting the next release. 

## Getting Involved

**NF: For someone interested in contributing to SIG Apps, where would you recommend they start, especially if they are not yet a Kubernetes maintainer?**

MS: The best place to start is the [\#sig-apps](https://www.kubernetes.dev/community/community-groups/sigs/apps/) slack channel and our regular [SIG Apps meetings](https://github.com/kubernetes/community/blob/main/sig-apps/README.md#meetings). We’ve all started there, and if it feels intimidating, or nobody replies right away, that’s completely normal. Everyone's busy. It's not personal.

JK: In addition to what Maciej answered, I'd suggest looking at our newer subprojects and initiatives. Contributing to stable APIs like Deployment or StatefulSet can be daunting because the barrier for making changes is very high due to backward compatibility, and there is much less low-hanging fruit.

If you are new to the community, projects like the [Agent Sandbox](https://github.com/kubernetes-sigs/agent-sandbox) are fantastic entry points. They are actively evolving, have a friendly group of maintainers, and offer plenty of greenfield development opportunities where you can make a significant impact quickly.

## Summary

SIG Apps has shaped how Kubernetes applications are deployed and operated since the project’s earliest days. While users often interact with Deployments, StatefulSets, Jobs, and DaemonSets without thinking about the controllers behind them, the work within SIG Apps continues to shape the reliability and scalability of workloads across the Kubernetes ecosystem.

From improving workload resilience and node lifecycle behavior to enabling new patterns for AI and distributed computing, the SIG is evolving Kubernetes while remaining committed to one of the project’s core principles: preserving the stability and backward compatibility that users depend on. Whether you’re interested in core workload APIs, emerging projects like Agent Sandbox, or helping improve the operational experience of Kubernetes users everywhere, SIG Apps offers many opportunities to get involved.
