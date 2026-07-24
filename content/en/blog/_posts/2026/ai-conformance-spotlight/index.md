---
layout: blog
title: "From Working Group to SIG Architecture: spotlight on AI Conformance"
slug: sig-arch-ai-conformance-2026
canonicalUrl: https://www.kubernetes.dev/blog/2026/07/30/sig-arch-ai-conformance-2026
date: 2026-07-09
draft: yes
author: "Frederico Muñoz (SAS Institute) and Kirti Goyal"
---

In this SIG Architecture spotlight we talked with [Janet Kuo](https://github.com/janetkuo) (Google)
and [Yuan Tang](https://github.com/terrytangyuan) (Red Hat) about the journey of AI Conformance in
Kubernetes, from the initial [Working
Group](https://github.com/kubernetes/community/blob/main/governance.md#working-groups) to the
integration [SIG Architecture](https://github.com/kubernetes/community/tree/main/sig-architecture#architecture-special-interest-group)
as a subproject.

## Introductions

**Frederico Muñoz and Kirti Goyal (FK): Hi Janet, Yuan, and thank you for the opportunity to learn a
bit more about AI Conformance. Can you tell us a bit about yourselves and how you got involved in
Kubernetes?**

**Janet Kuo**: I'm a Senior Staff Software Engineer at Google and have been a Kubernetes maintainer
since 2015, joining the community just as we were racing toward the 1.0 launch. I started my journey
writing the core workload controllers that standardized how applications are orchestrated on
Kubernetes. Today, I lead SIG Apps as a Co-chair & TL, and also lead the
[AI Conformance program](https://www.cncf.io/announcements/2025/11/11/cncf-launches-certified-kubernetes-ai-conformance-program-to-standardize-ai-workloads-on-kubernetes/).
My current focus is to ensure Kubernetes remains the best platform for the next generation of
workloads, such as AI.

**Yuan Tang**: I’m a Senior Principal Software Engineer at Red Hat, where I lead the development of
our AI platform and drive our upstream open source strategy. I became involved in Kubernetes early
on by fostering collaborations between the Kubernetes community and projects I was leading,
including Kubefolw, Argo, and KServe. I later helped found and lead [WG Serving](https://github.com/kubernetes-sigs/wg-serving) and the AI Conformance program, advancing
innovation and strengthening community collaboration around running AI workloads on Kubernetes.

## Program, Working Group, Subproject: the many shapes of AI Conformance

**FK: AI Conformance started as a CNCF Program, was it then you got involved?**

**Janet Kuo:** I was actually involved from day one since I pitched the original idea. It became
obvious then that everyone was starting to run AI on Kubernetes, but vendors were building their
infrastructure stacks in different ways. I got worried about ecosystem fragmentation. So I wrote up
the initial Kubernetes AI Conformance Proposal, took it to the CNCF leadership to get their buy-in,
and started the AI Conformance Program. Once we had the green light, I reached out to my fellow
co-chairs Yuan Tang, Rita Zhang, and Mario Fahlandt to get the community rallied around it.

**Yuan Tang:** Yes. I was a co-chair of WG Serving at that time and some of the initiatives such as
the [Gateway AI Inference Extension](https://gateway-api-inference-extension.sigs.k8s.io/) quickly
gained traction. There was a strong interest among the community to include inference related
requirements in the K8s AI Conformance program.

**FK: How would you describe the motivation behind the creation of the AI Conformance Working Group?**

**Janet and Yuan**: The motivation behind creating the Kubernetes AI Conformance [Working Group](https://github.com/kubernetes/community/blob/main/governance.md#working-groups) (AI WG) was
to address the rapid convergence of AI workloads onto Kubernetes while preventing ecosystem
fragmentation.

As AI adoption accelerated, organizations began running increasingly complex workloads, including
distributed training, large-scale inference, GPU-intensive pipelines, and emerging agentic AI
systems across many different Kubernetes platforms. However, vendors were implementing AI
infrastructure capabilities differently, especially around GPUs, networking, scheduling, and
inference orchestration. That created portability challenges, operational inconsistency, and growing
vendor lock-in concerns.

The AI WG was formed to bring the community together around:

* vendor-neutral AI infrastructure standards,
* interoperable Kubernetes-based AI platforms,
* consistent operational behavior for AI workloads,
* and common requirements for scalable AI deployment.

**FK: WGs are temporary by nature, based on outcomes: would you say the main goals of the WG were achieved?**

**Janet and Yuan**: Yes, the WG achieved its primary initial goals.

The WG has succeeded in moving the ecosystem from: fragmented, vendor-specific AI infrastructure
approaches to a shared, community-defined baseline for AI workloads on Kubernetes.

Some concrete indicators of success include:

* Launching the Certified Kubernetes AI Conformance Program
* Defining formal Kubernetes AI Requirements (KARs)
* Getting broad participation from major ecosystem players
* Growing certified platforms from 18 to 31 within a few months
* Aligning around newer Kubernetes primitives needed for AI workloads
* Establishing a roadmap for automated conformance verification

Most importantly, the WG created consensus that AI workloads are now a first-class Kubernetes use case.

{{< figure src="/blog/2026/sig-arch-ai-conformance-2026/ai_conf_kubecon.jpg" alt="AI Conformance at the KubeCon+CloudNativeCon NA 2025" >}}

**FK: AI Conformance was specifically highlighted at the latest KubeCon: is this a reflection of the
growing importance of AI throughout the project?**

**Janet and Yuan**: Yes, the prominence of AI Conformance at the latest [KubeCon + CloudNativeCon](https://www.cncf.io/kubecon-cloudnativecon-events/) is a strong reflection of how
central AI has become to the Kubernetes ecosystem overall.

A few years ago, AI workloads on Kubernetes were still viewed as somewhat specialized, mostly tied
to ML platforms or GPU-heavy research environments. What’s changed is that AI is now becoming a
mainstream infrastructure concern for nearly every large-scale platform operator.

That shift naturally elevates AI from an application running on Kubernetes to a core workload
category Kubernetes must optimize for.

The AI Conformance initiative reflects that evolution. It signals that the community now sees AI
infrastructure requirements, things like accelerator scheduling, high-performance networking,
workload-aware orchestration, and low-latency inference, as important enough to standardize at the
ecosystem level.

Its visibility at KubeCon also shows a broader strategic realization: if Kubernetes is going to
remain the universal control plane for modern infrastructure, it needs to provide a consistent
foundation for AI workloads across clouds, on-prem, and edge environments.

So the emphasis on AI Conformance is not just about chasing AI hype; it's about Kubernetes adapting
to a major shift in workload patterns and ensuring the ecosystem evolves cohesively rather than
fragmenting into vendor-specific AI stacks.

{{< figure src="/blog/2026/sig-arch-ai-conformance-2026/ai_conf_sponsors.jpg" alt="AI Conformance: initial adopters and major contributors (KubeCon NA 2025)" >}}

## From Working Group to SIG Architecture subproject

**FK: How would you describe the change from WG to SIG? Is it a reflection of AI as something that
requires ongoing architectural governance?**

**Janet and Yuan**: In Kubernetes, Working Groups are meant to be temporary. Our WG had a specific
goal to get the initial Kubernetes AI Conformance requirements published and get the certification
process off the ground. Once we hit those milestones, we [archived the WG](https://github.com/kubernetes/community/tree/main/archive/wg-ai-conformance) and moved AI
Conformance to be a [permanent subproject](https://github.com/kubernetes/community/tree/main/sig-architecture#subprojects) under
SIG Architecture.

Moving to SIG Architecture definitely proves that AI needs ongoing governance. AI isn’t just a
passing trend or a one-off workload. It has become a core part of what Kubernetes runs every day.
Because SIG Architecture already owns overall Kubernetes Conformance and API design principles,
housing the AI Conformance subproject there makes perfect sense. It makes sure our AI Conformance
requirements stay aligned with the rest of the Kubernetes ecosystem for the long haul.

**FK: And with that change, how would you describe the main goals and areas of intervention of the subproject?**

**Janet and Yuan**: Now that we’re a subproject, our main goal is to keep the AI Conformance
standards current, vendor-neutral, and standard-setting. We want to make sure Kubernetes captures
the latest advancements in AI infrastructure while keeping the ecosystem fair for everyone. When we
find gaps where no clear community pattern exists, we help foster and form new standards to solve
them.

## AI Conformance and Kubernetes

**FK: AI Infrastructure is evolving very quickly, while Kubernetes APIs are designed to remain
stable for years. Is this something you consider a challenge?**

**Janet and Yuan**: It’s definitely a tricky balance. AI moves very fast, while Kubernetes is
designed to be stable and boring. But we actually structured the program around this exact tension.

First, we use a tiered graduation model. When new AI infrastructure concepts emerge, we introduce
them as recommended SHOULD requirements. That gives the ecosystem room to experiment and agree on
best practices without locking Kubernetes into rigid APIs too early. Once those APIs stabilize and
with ecosystem adoption, we graduate them to mandatory MUST requirements.

Second, we intentionally keep our focus on the infrastructure layer. We test for core capabilities
like accelerator support through Dynamic Resource Allocation (DRA), rather than getting bogged down
in specific AI frameworks or model servers. That keeps the base platform stable while letting the AI
tooling evolve as fast as it needs to.

**FK: DRA has evolved, also due to the work of WG Device Management, as an important part of
Kubernetes (and especially so for AI workloads), with SIG Architecture having an important role in
how it’s integrated in Kubernetes: do you find any parallel in this? Specifically, do you think
there will be a heavier focus in the integration with the evolving Kubernetes architecture as part
of SIG Architecture?**

**Janet and Yuan**: There is a huge parallel there. Whenever we face a massive, complicated
challenge that touches multiple parts of the codebase and involves multiple SIGs, a Working Group is
the best place to start. It lets experts from different SIGs get together to figure out the problem,
and build consensus.

Being part of SIG Architecture means there will be a much heavier focus on how AI capabilities weave
into the evolving Kubernetes architecture. Instead of treating AI as an add-on layer, we’re looking
at how core Kubernetes primitives, like scheduling and resource allocation, need to adapt at a
foundational level to support the next decade of AI workloads.

## Final remarks

**FK: For interested contributors, what’s the best way to get involved with the AI Conformance subproject?**

**Janet and Yuan**: We're always looking for new contributors. The easiest way to get started is by checking out our
main repo at [kubernetes-sigs/ai-conformance](https://github.com/kubernetes-sigs/ai-conformance) and
join our [meetings](https://github.com/kubernetes/community/tree/main/sig-architecture#meetings). If
you're interested in defining new AI Conformance requirements, you can jump into PR reviews or
propose your own using our [KAR template](https://github.com/kubernetes-sigs/ai-conformance/tree/main/kars/NNNN-kar-template). If
you want to write code, we always need help expanding our automated Go test suites in the [test/ directory](https://github.com/kubernetes-sigs/ai-conformance/tree/main/test). For vendors looking to
certify their platforms, all the details are at
[cncf/k8s-ai-conformance](https://github.com/cncf/k8s-ai-conformance).

**FK: Any final comments you would like to share?** 

**Janet and Yuan**: We’ve been blown away by how
fast the community has rallied around this. When we first announced the AI Conformance program
during the keynote at [KubeCon NA 2025](https://www.cncf.io/reports/kubecon-cloudnativecon-north-america-2025/), we weren’t sure what
the response would be. But by the time we gave our update keynote at [KubeCon EU 2026](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/), we had grown from 18
certified platforms to 31 in just a few months.

That kind of growth shows just how much the industry wanted a unified, vendor-neutral standard. It
gives organizations the confidence that they can run their AI workloads on any certification
Kubernetes platform without getting locked into a proprietary stack.

If you’re a platform vendor, we’d love to see you get certified. If you’re a developer interested in
the intersection of AI and cloud-native infrastructure, come join us in SIG Architecture!

**FK: Excellent, thank you both for guiding us in this journey on AI and AI Conformance in Kubernetes.**
    
