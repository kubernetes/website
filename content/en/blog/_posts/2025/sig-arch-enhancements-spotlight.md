---
layout: blog
title: "Spotlight on SIG Architecture: Enhancements"
slug: sig-architecture-enhancements
canonicalUrl: https://www.kubernetes.dev/blog/2025/01/21/sig-architecture-enhancements
date: 2025-01-21
author: "Frederico Muñoz (SAS Institute)"
---

_This is the fourth interview of a SIG Architecture Spotlight series that will cover the different
subprojects, and we will be covering [SIG Architecture:
Enhancements](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#enhancements)._

In this SIG Architecture spotlight we talked with [Kirsten
Garrison](https://github.com/kikisdeliveryservice), lead of the Enhancements subproject.

## The Enhancements subproject

**Frederico (FSM): Hi Kirsten, very happy to have the opportunity to talk about the Enhancements
subproject. Let's start with some quick information about yourself and your role.**

**Kirsten Garrison (KG)**: I’m a lead of the Enhancements subproject of SIG-Architecture and
currently work at Google. I first got involved by contributing to the service-catalog project with
the help of [Carolyn Van Slyck](https://github.com/carolynvs). With time, [I joined the Release
team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.17/release_team.md),
eventually becoming the Enhancements Lead and a Release Lead shadow. While on the release team, I
worked on some ideas to make the process better for the SIGs and Enhancements team (the opt-in
process) based on my team’s experiences. Eventually, I started attending Subproject meetings and
contributing to the Subproject’s work.

**FSM: You mentioned the Enhancements subproject: how would you describe its main goals and areas of
intervention?**

**KG**: The [Enhancements
Subproject](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#enhancements)
primarily concerns itself with the [Kubernetes Enhancement
Proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-architecture/0000-kep-process/README.md)
(_KEP_ for short)—the "design" documents required for all features and significant changes
to the Kubernetes project.

## The KEP and its impact

**FSM: The improvement of the KEP process was (and is) one in which SIG Architecture was heavily
involved. Could you explain the process to those that aren’t aware of it?**

**KG**: [Every release](https://kubernetes.io/releases/release/#the-release-cycle), the SIGs let the
Release Team know which features they intend to work on to be put into the release. As mentioned
above, the prerequisite for these changes is a KEP - a standardized design document that all authors
must fill out and approve in the first weeks of the release cycle. Most features [will move
through 3
phases](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/#feature-stages):
alpha, beta and finally GA so approving a feature represents a significant commitment for the SIG.

The KEP serves as the full source of truth of a feature. The [KEP
template](https://github.com/kubernetes/enhancements/blob/master/keps/NNNN-kep-template/README.md)
has different requirements based on what stage a feature is in, but it generally requires a detailed
discussion of the design and the impact as well as providing artifacts of stability and
performance. The KEP takes quite a bit of iterative work between authors, SIG reviewers, api review
team and the Production Readiness Review team[^1] before it is approved. Each set of reviewers is
looking to make sure that the proposal meets their standards in order to have a stable and
performant Kubernetes release. Only after all approvals are secured, can an author go forth and
merge their feature in the Kubernetes code base.


**FSM: I see, quite a bit of additional structure was added. Looking back, what were the most
significant improvements of that approach?**

**KG**: In general, I think that the improvements with the most impact had to do with focusing on
the core intent of the KEP. KEPs exist not just to memorialize designs, but provide a structured way
to discuss and come to an agreement about different facets of the change. At the core of the KEP
process is communication and consideration.

To that end, some of the significant changes revolve around a more detailed and accessible KEP
template. A significant amount of work was put in over time to get the
[k/enhancements](https://github.com/kubernetes/enhancements) repo into its current form -- a
directory structure organized by SIG with the contours of the modern KEP template (with
Proposal/Motivation/Design Details subsections). We might take that basic structure for granted
today, but it really represents the work of many people trying to get the foundation of this process
in place over time.

As Kubernetes matures, we’ve needed to think about more than just the end goal of getting a single
feature merged. We need to think about things like: stability, performance, setting and meeting user
expectations. And as we’ve thought about those things the template has grown more detailed. The
addition of the Production Readiness Review was major as well as the enhanced testing requirements
(varying at different stages of a KEP’s lifecycle).

## Current areas of focus

**FSM: Speaking of maturing, we’ve [recently released Kubernetes
v1.31](https://kubernetes.io/blog/2024/08/13/kubernetes-v1-31-release/), and work on v1.32 [has
started](https://github.com/fsmunoz/sig-release/tree/release-1.32/releases/release-1.32). Are there
any areas that the Enhancements sub-project is currently addressing that might change the way things
are done?**

**KG**: We’re currently working on two things:

  1) _Creating a Process KEP template._ Sometimes people want to harness the KEP process for
  significant changes that are more process oriented rather than feature oriented. We want to
  support this because memorializing changes is important and giving people a better tool to do so
  will only encourage more discussion and transparency.
  2) _KEP versioning._ While our template changes aim to be as non-disruptive as possible, we
  believe that it will be easier to track and communicate those changes to the community better with
  a versioned KEP template and the policies that go alongside such versioning.

Both features will take some time to get right and fully roll out (just like a KEP feature) but we
believe that they will both provide improvements that will benefit the community at large.

**FSM: You mentioned improvements: I remember when project boards for Enhancement tracking were
introduced in recent releases, to great effect and unanimous applause from release team members. Was
this a particular area of focus for the subproject?**

**KG**: The Subproject provided support to the Release Team’s Enhancement team in the migration away
from using the spreadsheet to a project board. The collection and tracking of enhancements has
always been a logistical challenge. During my time on the Release Team, I helped with the transition
to an opt-in system of enhancements, whereby the SIG leads "opt-in" KEPs for release tracking. This
helped to enhance communication between authors and SIGs before any significant work was undertaken
on a KEP and removed toil from the Enhancements team. This change used the existing tools to avoid
introducing too many changes at once to the community. Later, the Release Team approached the
Subproject with an idea of leveraging GitHub Project Boards to further improve the collection
process. This was to be a move away from the use of complicated spreadsheets to using repo-native
labels on [k/enhancement](https://github.com/kubernetes/enhancements) issues and project boards.

**FSM: That surely adds an impact on simplifying the workflow...**

**KG**: Removing sources of friction and promoting clear communication is very important to the
Enhancements Subproject.  At the same time, it’s important to give careful consideration to
decisions that impact the community as a whole. We want to make sure that changes are balanced to
give an upside and while not causing any regressions and pain in the rollout. We supported the
Release Team in ideation as well as through the actual migration to the project boards. It was a
great success and exciting to see the team make high impact changes that helped everyone involved in
the KEP process!

## Getting involved

**FSM: For those reading that might be curious and interested in helping, how would you describe the
required skills for participating in the sub-project?**

**KG**: Familiarity with KEPs either via experience or taking time to look through the
kubernetes/enhancements repo is helpful. All are welcome to participate if interested - we can take
it from there.

**FSM: Excellent! Many thanks for your time and insight -- any final comments you would like to
share with our readers?**

**KG**: The Enhancements process is one of the most important parts of Kubernetes and requires
enormous amounts of coordination and collaboration of people and teams across the project to make it
successful. I’m thankful and inspired by everyone’s continued hard work and dedication to making the
project great. This is truly a wonderful community.


[^1]: For more information, check the [Production Readiness Review spotlight
    interview](https://kubernetes.io/blog/2023/11/02/sig-architecture-production-readiness-spotlight-2023/)
    in this series.
