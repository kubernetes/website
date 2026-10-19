---
layout: blog
title: "Announcing the Kubernetes bug bounty program"
date: 2020-01-14T09:00:00-08:00
slug: kubernetes-bug-bounty-announcement
---

**Authors:** Maya Kaczorowski and Tim Allclair, Google, on behalf of the [Kubernetes Product Security Committee](https://github.com/kubernetes/community/tree/master/committee-product-security)


Today, the [Kubernetes Product Security Committee](https://github.com/kubernetes/community/tree/master/committee-product-security) is launching a [new bug bounty program](https://hackerone.com/kubernetes), funded by the [CNCF](https://www.cncf.io/), to reward researchers finding security vulnerabilities in Kubernetes.

## Setting up a new bug bounty program

We aimed to set up this bug bounty program as transparently as possible, with [an initial proposal](https://docs.google.com/document/d/1dvlQsOGODhY3blKpjTg6UXzRdPzv5y8V55RD_Pbo7ag/edit#heading=h.7t1efwpev42p), [evaluation of vendors](https://github.com/kubernetes/kubernetes/issues/73079), and [working draft of the components in scope](https://github.com/kubernetes/community/blob/master/contributors/guide/bug-bounty.md). Once we onboarded the selected bug bounty program vendor, [HackerOne](https://www.hackerone.com/), these documents were further refined based on the feedback from HackerOne, as well as what was learned in the recent [Kubernetes security audit](https://github.com/kubernetes/community/blob/master/wg-security-audit/findings/Kubernetes%20Final%20Report.pdf). The bug bounty program has been in a private release for several months now, with invited researchers able to submit bugs and help us test the triage process. After almost two years since the initial proposal, the program is now ready for all security researchers to contribute!

What’s exciting is that this is rare: a bug bounty for an open-source infrastructure tool. Some open-source bug bounty programs exist, such as the [Internet Bug Bounty](https://internetbugbounty.org/), this mostly covers core components that are consistently deployed across environments; but most bug bounties are still for hosted web apps. In fact, with more than[ 100 certified distributions of Kubernetes](https://www.cncf.io/certification/kcsp/), the bug bounty program needs to apply to the Kubernetes code that powers all of them. By far, the most time-consuming challenge here has been ensuring that the program provider (HackerOne) and their researchers who do the first line triage have the awareness of Kubernetes and the ability to easily test the validity of a reported bug. As part of the bootstrapping process, HackerOne had their team pass the [Certified Kubernetes Administrator](https://www.cncf.io/certification/cka/) (CKA) exam.

## What’s in scope

The bug bounty scope covers code from the main Kubernetes organizations on GitHub, as well as continuous integration, release, and documentation artifacts. Basically, most content you’d think of as ‘core’ Kubernetes, included at [https://github.com/kubernetes](https://github.com/kubernetes), is in scope. We’re particularly interested in cluster attacks, such as privilege escalations, authentication bugs, and remote code execution in the kubelet or API server. Any information leak about a workload, or unexpected permission changes is also of interest. Stepping back from the cluster admin’s view of the world, you’re also encouraged to look at the Kubernetes supply chain, including the build and release processes, which would allow any unauthorized access to commits, or the ability to publish unauthorized artifacts.

Notably out of scope is the community management tooling, e.g., the Kubernetes mailing lists or Slack channel. Container escapes, attacks on the Linux kernel, or other dependencies, such as etcd, are also out of scope and should be reported to the appropriate party. We would still appreciate that any Kubernetes vulnerability, even if not in scope for the bug bounty, be [disclosed privately](https://kubernetes.io/docs/reference/issues-security/security/#report-a-vulnerability) to the Kubernetes Product Security Committee. See the full scope on the [program reporting page](https://hackerone.com/kubernetes).

## How Kubernetes handles vulnerabilities and disclosures

Kubernetes’ [Product Security Committee](https://github.com/kubernetes/community/tree/master/committee-product-security) is a group of security-focused maintainers who are responsible for receiving and responding to reports of security issues in Kubernetes. This follows the documented [security vulnerability response process](https://kubernetes.io/docs/reference/issues-security/security/), which includes initial triage, assessing impact, generating and rolling out a fix.

With our bug bounty program, initial triage and initial assessment are handled by the bug bounty provider, in this case, HackerOne, enabling us better scale our limited Kubernetes security experts to handle only valid reports. Nothing else in this process is changing - the Product Security Committee will continue to develop fixes, build private patches, and coordinate special security releases. New releases with security patches will be announced at [kubernetes-security-announce@googlegroups.com](https://groups.google.com/forum/#!forum/kubernetes-security-announce).

If you want to report a bug, you don’t need to use the bug bounty - you can still follow the [existing process](https://kubernetes.io/docs/reference/issues-security/security/#report-a-vulnerability) and report what you’ve found at [security@kubernetes.io](mailto:security@kubernetes.io).

## Get started

Just as many organizations support open source by hiring developers, paying bug bounties directly supports security researchers. This bug bounty is a critical step for Kubernetes to build up its community of security researchers and reward their hard work.

If you’re a security researcher, and new to Kubernetes, check out these resources to learn more and get started bug hunting:



*   **Hardening guides**
    *   Kubernetes.io: [https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/](https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/)
*   **Frameworks**
    *   CIS benchmarks: [https://www.cisecurity.org/benchmark/kubernetes/](https://www.cisecurity.org/benchmark/kubernetes/)
    *   NIST 800-190: [https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-190.pdf](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-190.pdf)
*   **Talks**
    *   The Devil in the Details: Kubernetes’ First Security Assessment (KubeCon NA 2019): [https://www.youtube.com/watch?v=vknE5XEa_Do](https://www.youtube.com/watch?v=vknE5XEa_Do)
    *   Crafty Requests: Deep Dive into Kubernetes CVE-2018-1002105 (KubeCon EU 2019): [https://www.youtube.com/watch?v=VjSJqc13PNk](https://www.youtube.com/watch?v=VjSJqc13PNk)
    *   A Hacker’s Guide to Kubernetes and the Cloud (KubeCon EU 2018): [https://www.youtube.com/watch?v=dxKpCO2dAy8](https://www.youtube.com/watch?v=dxKpCO2dAy8)
    *   Shipping in pirate-infested waters (KubeCon NA 2017): [https://www.youtube.com/watch?v=ohTq0no0ZVU](https://www.youtube.com/watch?v=ohTq0no0ZVU)
    *   Hacking and Hardening Kubernetes clusters by example (KubeCon NA 2017): [https://www.youtube.com/watch?v=vTgQLzeBfRU](https://www.youtube.com/watch?v=vTgQLzeBfRU)

If you find something, please report a security bug to the Kubernetes bug bounty at [https://hackerone.com/kubernetes](https://hackerone.com/kubernetes).


<!-- Docs to Markdown version 1.0β17 -->
