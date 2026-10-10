---
layout: blog
title: "Kubernetes Release Cadence Change: Here’s What You Need To Know"
date: 2021-07-20
slug: new-kubernetes-release-cadence
author: >
   Celeste Horgan,
   Adolfo García Veytia,
   James Laverack,
   Jeremy Rickard
---

On April 23, 2021, the Release Team merged a Kubernetes Enhancement Proposal (KEP) changing the Kubernetes release cycle from four releases a year (once a quarter) to three releases a year. 

This blog post provides a high level overview about what this means for the Kubernetes community's contributors and maintainers.

## What's changing and when

Starting with the [Kubernetes 1.22 release](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.22), a lightweight policy will drive the creation of each release schedule. This policy states:

* The first Kubernetes release of a calendar year should start at the second or third
   week of January to provide people more time for contributors coming back from the
   end of year holidays.
* The last Kubernetes release of a calendar year should be finished by the middle of
   December.
* A Kubernetes release cycle has a length of approximately 15 weeks.
* The week of KubeCon + CloudNativeCon is not considered a 'working week' for SIG Release. The Release Team will not hold meetings or make decisions in this period.
* An explicit SIG Release break of at least two weeks between each cycle will
   be enforced.

As a result, Kubernetes will follow a three releases per year cadence. Kubernetes 1.23 will be the final release of the 2021 calendar year. This new policy results in a very predictable release schedule, allowing us to forecast upcoming release dates:


*Proposed Kubernetes Release Schedule for the remainder of 2021*

| Week Number in Year | Release Number | Release Week | Note |
| -------- | -------- | -------- | -------- |
| 35 | 1.23 | 1 (August 23) | | 
| 50 | 1.23 | 16 (December 07) | KubeCon + CloudNativeCon NA Break (Oct 11-15) | 

*Proposed Kubernetes Release Schedule for 2022*

| Week Number in Year | Release Number | Release Week | Note |
| -------- | -------- | -------- | -------- |
| 1  | 1.24 | 1 (January 03) | |
| 15 | 1.24 | 15 (April 12) | | 
| 17 | 1.25 | 1 (April 26) | KubeCon + CloudNativeCon EU likely to occur |
| 32 | 1.25 | 15 (August 09) | |
| 34 | 1.26 | 1 (August 22 | KubeCon + CloudNativeCon NA likely to occur |
| 49 | 1.26 | 14 (December 06) |

These proposed dates reflect only the start and end dates, and they are subject to change. The Release Team will select dates for enhancement freeze, code freeze, and other milestones at the start of each release. For more information on these milestones, please refer to the [release phases](https://www.k8s.dev/resources/release/#phases) documentation. Feedback from prior releases will feed into this process.

## What this means for end users 

The major change end users will experience is a slower release cadence and a slower rate of enhancement graduation. Kubernetes release artifacts, release notes, and all other aspects of any given release will stay the same.

Prior to this change an enhancement could graduate from alpha to stable in 9 months. With the change in cadence, this will stretch to 12 months. Additionally, graduation of features over the last few releases has in some part been driven by release team activities.

With fewer releases, users can expect to see the rate of feature graduation slow. Users can also expect releases to contain a larger number of enhancements that they need to be aware of during upgrades. However, with fewer releases to consume per year, it's intended that end user organizations will spend less time on upgrades and gain more time on supporting their Kubernetes clusters. It also means that Kubernetes releases are in support for a slightly longer period of time, so bug fixes and security patches will be available for releases for a longer period of time.


## What this means for Kubernetes contributors 

With a lower release cadence, contributors have more time for project enhancements, feature development, planning, and testing. A slower release cadence also provides more room for maintaining their mental health, preparing for events like KubeCon + CloudNativeCon or work on downstream integrations.


## Why we decided to change the release cadence

The Kubernetes 1.19 cycle was far longer than usual. SIG Release extended it to lessen the burden on both Kubernetes contributors and end users due the COVID-19 pandemic. Following this extended release, the Kubernetes 1.20 release became the third, and final, release for 2020. 

As the Kubernetes project matures, the number of enhancements per cycle grows, along with the burden on contributors, the Release Engineering team.  Downstream consumers and integrators also face increased challenges keeping up with [ever more feature-packed releases](https://kubernetes.io/blog/2021/04/08/kubernetes-1-21-release-announcement/). A wider project adoption means the complexity of supporting a rapidly evolving platform affects a bigger downstream chain of consumers.

Changing the release cadence from four to three releases per year balances a variety of factors for stakeholders: while it's not strictly an LTS policy, consumers and integrators will get longer support terms for each minor version as the extended release cycles lead to the [previous three releases being supported](https://kubernetes.io/blog/2020/08/31/kubernetes-1-19-feature-one-year-support/) for a longer period. Contributors get more time to [mature enhancements](https://www.cncf.io/blog/2021/04/12/enhancing-the-kubernetes-enhancements-process/) and [get them ready for production](https://github.com/kubernetes/community/blob/master/sig-architecture/production-readiness.md). 

Finally, the management overhead for SIG Release and the Release Engineering team diminishes allowing the team to spend more time on improving the quality of the software releases and the tooling that drives them.

## How you can help

Join the [discussion](https://github.com/kubernetes/sig-release/discussions/1566) about communicating future release dates and be sure to be on the lookout for post release surveys. 

## Where you can find out more

-  Read the KEP [here](https://github.com/kubernetes/enhancements/tree/master/keps/sig-release/2572-release-cadence)
-  Join the [kubernetes-dev](https://groups.google.com/g/kubernetes-dev) mailing list
-  Join [Kubernetes Slack](https://slack.k8s.io) and follow the #announcements channel
