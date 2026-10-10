---
layout: blog
title: "Enhancing Kubernetes one KEP at a Time"
date: 2022-08-11
slug: enhancing-kubernetes-one-kep-at-a-time
canonicalUrl: https://www.k8s.dev/blog/2022/08/11/enhancing-kubernetes-one-kep-at-a-time/
author: >
  Ryler Hockenbury (Mastercard)
---

Did you know that Kubernetes v1.24 has [46 enhancements](https://kubernetes.io/blog/2022/05/03/kubernetes-1-24-release-announcement/)? That's a lot of new functionality packed into a 4-month release cycle. The Kubernetes release team coordinates the logistics of the release, from remediating test flakes to publishing updated docs. It's a ton of work, but they always deliver.

The release team comprises around 30 people across six subteams - Bug Triage, CI Signal, Enhancements, Release Notes, Communications, and Docs.  Each of these subteams manages a component of the release. This post will focus on the role of the enhancements subteam and how you can get involved.

## What's the enhancements subteam?

Great question. We'll get to that in a second but first, let's talk about how features are managed in Kubernetes.

Each new feature requires a [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/blob/master/keps/README.md) - KEP for short. KEPs are small structured design documents that provide a way to propose and coordinate new features. The KEP author describes the motivation, design (and alternatives), risks, and tests - then community members provide feedback to build consensus.

KEPs are submitted and updated through a pull request (PR) workflow on the [k/enhancements repo](https://github.com/kubernetes/enhancements). Features start in alpha and move through a graduation process to beta and stable as they mature. For example, here's a cool KEP about [privileged container support on Windows Server](https://github.com/kubernetes/enhancements/blob/master/keps/sig-windows/1981-windows-privileged-container-support/kep.yaml).  It was introduced as alpha in Kubernetes v1.22 and graduated to beta in v1.23.

Now getting back to the question - the enhancements subteam coordinates the lifecycle tracking of the KEPs for each release. Each KEP is required to meet a set of requirements to be cleared for inclusion in a release. The enhancements subteam verifies each requirement for each KEP and tracks the status.

At the start of a release, [Kubernetes Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) submit their enhancements to opt into a release. A typical release might have from 60 to 90 enhancements at the beginning.  During the release, many enhancements will drop out. Some do not quite meet the KEP requirements, and others do not complete their implementation in code. About 60%-70% of the opted-in KEPs will make it into the final release.

## What does the enhancements subteam do?

Another great question, keep them coming! The enhancements team is involved in two crucial milestones during each release: enhancements freeze and code freeze.

#### Enhancements Freeze

Enhancements freeze is the deadline for a KEP to be complete in order for the enhancement to be included in a release. It's a quality gate to enforce alignment around maintaining and updating KEPs. The most notable requirements are a (1) [production readiness review ](https://github.com/kubernetes/community/blob/master/sig-architecture/production-readiness.md)(PRR) and a (2) [KEP file](https://github.com/kubernetes/enhancements/tree/master/keps/NNNN-kep-template) with a complete test plan and graduation criteria.

The enhancements subteam communicates to each KEP author through comments on the KEP issue on Github. As a first step, they'll verify the status and check if it meets the requirements.  The KEP gets marked as tracked after satisfying the requirements; otherwise, it's considered at risk. If a KEP is still at risk when enhancement freeze is in effect, the KEP is removed from the release.

This part of the cycle is typically the busiest for the enhancements subteam because of the large number of KEPs to groom, and each KEP might need to be visited multiple times to verify whether it meets requirements.

#### Code Freeze

Code freeze is the implementation deadline for all enhancements. The code must be implemented, reviewed, and merged by this point if a code change or update is needed for the enhancement. The latter third of the release is focused on stabilizing the codebase - fixing flaky tests, resolving various regressions, and preparing docs - and all the code needs to be in place before those steps can happen.

The enhancements subteam verifies that all PRs for an enhancement are merged into the [Kubernetes codebase](https://github.com/kubernetes/kubernetes) (k/k). During this period, the subteam reaches out to KEP authors to understand what PRs are part of the KEP, verifies that those PRs get merged, and then updates the status of the KEP. The enhancement is removed from the release if the code isn't all merged before the code freeze deadline.

## How can I get involved with the release team?

I'm glad you asked. The most direct way is to apply to be a [release team shadow](https://github.com/kubernetes/sig-release/blob/master/release-team/shadows.md). The shadow role is a hands-on apprenticeship intended to prepare individuals for leadership positions on the release team. Many shadow roles are non-technical and do not require prior contributions to the Kubernetes codebase.

With 3 Kubernetes releases every year and roughly 25 shadows per release, the release team is always in need of individuals wanting to contribute. Before each release cycle, the release team opens the application for the shadow program. When the application goes live, it's posted in the [Kubernetes Dev Mailing List](https://groups.google.com/a/kubernetes.io/g/dev).  You can subscribe to notifications from that list (or check it regularly!) to watch when the application opens. The announcement will typically go out in mid-April, mid-July, and mid-December - or roughly a month before the start of each release.

## How can I find out more?

Check out the [role handbooks](https://github.com/kubernetes/sig-release/tree/master/release-team/role-handbooks) if you're curious about the specifics of all the Kubernetes release subteams. The handbooks capture the logistics of each subteam, including a week-by-week breakdown of the subteam activities.  It's an excellent reference for getting to know each team better.

You can also check out the release-related Kubernetes slack channels - particularly #release, #sig-release, and #sig-arch. These channels have discussions and updates surrounding many aspects of the release.
