---
title: 'Kubernetes 1.10: Stabilizing Storage, Security, and Networking'
date: 2018-03-26
modified_time: '2018-03-27T11:01:39.569-07:00'
slug: kubernetes-1.10-stabilizing-storage-security-networking
evergreen: true
author: >
  [Kubernetes v1.10 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.10/release_team.md)
---

We’re pleased to announce the delivery of Kubernetes 1.10, our first release
of 2018!

Today’s release continues to advance maturity, extensibility, and pluggability
of Kubernetes. This newest version stabilizes features in 3 key areas,
including storage, security, and networking. Notable additions in this release
include the introduction of external kubectl credential providers (alpha), the
ability to switch DNS service to CoreDNS at install time (beta), and the move
of Container Storage Interface (CSI) and persistent local volumes to beta.

Let’s dive into the key features of this release:

## Storage - CSI and Local Storage move to beta

This is an impactful release for [the Storage Special Interest Group
(SIG)](https://github.com/kubernetes/community/tree/master/sig-storage),
marking the culmination of their work on multiple features. The [Kubernetes
implementation](https://github.com/kubernetes/features/issues/178) of the
[Container Storage
Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md)
(CSI) moves to beta in this release: installing new volume plugins is now as
easy as deploying a pod. This in turn enables third-party storage providers to
develop their solutions independently outside of the core Kubernetes codebase.
This continues the thread of extensibility within the Kubernetes ecosystem.

[Durable (non-shared) local storage
management](https://github.com/kubernetes/features/issues/121) progressed to
beta in this release, making locally attached (non-network attached) storage
available as a persistent volume source. This means higher performance and
lower cost for distributed file systems and databases.

This release also includes many updates to Persistent Volumes. Kubernetes can
automatically [prevent deletion of Persistent Volume Claims that are in use by
a pod](https://github.com/kubernetes/features/issues/498) (beta) and [prevent
deletion of a Persistent Volume that is bound to a Persistent Volume Claim
](https://github.com/kubernetes/features/issues/499)(beta). This helps ensure
that storage API objects are deleted in the correct order.

## Security - External credential providers (alpha)

Kubernetes, which is
already highly extensible, gains another extension point in 1.10 with
[external kubectl credential
providers](https://github.com/kubernetes/features/issues/541) (alpha). Cloud
providers, vendors, and other platform developers can now release binary
plugins to handle authentication for specific cloud-provider IAM services, or
that integrate with in-house authentication systems that aren’t supported
in-tree, such as Active Directory. This complements the [Cloud Controller
Manager](/docs/tasks/administer-cluster/running-cloud-controller/)
feature added in 1.9.

## Networking - CoreDNS as a DNS provider (beta)

The ability to [switch the DNS
service](https://github.com/kubernetes/website/pull/7638) to CoreDNS at
[install time](/docs/tasks/administer-cluster/coredns/)
is now in beta. CoreDNS has fewer moving parts: it’s a single executable and a
single process, and supports additional use cases.

Each Special Interest Group (SIG) within the community continues to deliver
the most-requested enhancements, fixes, and functionality for their respective
specialty areas. For a complete list of inclusions by SIG, please visit the
[release
notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.10.md#110-release-notes).

## Availability

Kubernetes 1.10 is available for [download on
GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.10.0). To get
started with Kubernetes, check out these i[nteractive
tutorials](/docs/tutorials/).

## 2 Day Features Blog Series

If you’re interested in exploring these features
more in depth, check back next week for our 2 Days of Kubernetes series where
we’ll highlight detailed walkthroughs of the following features:

Day 1 - Container Storage Interface (CSI) for Kubernetes going Beta
Day 2 - Local Persistent Volumes for Kubernetes going Beta

## Release team

This release is made possible through the effort of hundreds of
individuals who contributed both technical and non-technical content. Special
thanks to the [release
team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.10/release_team.md)
led by Jaice Singer DuMars, Kubernetes Ambassador for Microsoft. The 10
individuals on the release team coordinate many aspects of the release, from
documentation to testing, validation, and feature completeness.

As the Kubernetes community has grown, our release process represents an
amazing demonstration of collaboration in open source software development.
Kubernetes continues to gain new users at a rapid clip. This growth creates a
positive feedback cycle where more contributors commit code creating a more
vibrant ecosystem.

## Project Velocity

The CNCF has continued refining an ambitious project to
visualize the myriad contributions that go into the project. [K8s
DevStats](https://devstats.k8s.io/) illustrates the breakdown of contributions
from major company contributors, as well as an impressive set of preconfigured
reports on everything from individual contributors to pull request lifecycle
times. Thanks to increased automation, issue count at the end of the release
was only slightly higher than it was at the beginning. This marks a major
shift toward issue manageability. With 75,000+ comments, Kubernetes remains
one of the most actively discussed projects on GitHub.

## User Highlights

According to a [recent CNCF
survey](https://www.cncf.io/blog/2018/03/26/cncf-survey-china/), more than 49%
of Asia-based respondents use Kubernetes in production, with another 49%
evaluating it for use in production. Established, global organizations are
using [Kubernetes in production](https://kubernetes.io/case-studies/) at
massive scale. Recently published user stories from the community include:
1. **Huawei**, the largest telecommunications equipment manufacturer in the
world, [moved its internal IT department’s applications to run on
Kubernetes](https://kubernetes.io/case-studies/huawei/). This resulted in the
global deployment cycles decreasing from a week to minutes, and the efficiency
of application delivery improved by tenfold.
1. **Jinjiang Travel International**, one of the top 5 largest OTA and hotel
companies, use Kubernetes to [speed up their software release
velocity](https://www.linux.com/blog/managing-production-systems-kubernetes-chinese-enterprises)
from hours to just minutes. Additionally, they leverage Kubernetes to increase
the scalability and availability of their online workloads.
1. **Haufe Group**, the Germany-based media and software company, utilized
Kubernetes to [deliver a new release in half an
hour](https://kubernetes.io/case-studies/haufegroup/) instead of days. The
company is also able to scale down to around half the capacity at night,
saving 30 percent on hardware costs.
1. **BlackRock**, the world’s largest asset manager, was able to move quickly
using Kubernetes and built an investor research web app from [inception to
delivery in under 100 days](https://kubernetes.io/case-studies/blackrock/).
Is Kubernetes helping your team? [Share your
story](https://docs.google.com/a/google.com/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
with the community.

## Ecosystem Updates

1. The CNCF is expanding its certification offerings to
include a Certified Kubernetes Application Developer exam. The CKAD exam
certifies an individual's ability to design, build, configure, and expose
cloud native applications for Kubernetes. The CNCF is looking for beta testers
for this new program. More information can be found
[here](https://www.cncf.io/blog/2018/03/16/cncf-announces-ckad-exam/).
1. Kubernetes documentation now features [user
journeys](https://k8s.io/docs/home/): specific pathways for learning based on
who readers are and what readers want to do. Learning Kubernetes is easier
than ever for beginners, and more experienced users can find task journeys
specific to cluster admins and application developers.
1. CNCF also offers [online
training](https://www.cncf.io/certification/training/) that teaches the skills
needed to create and configure a real-world Kubernetes cluster.

## KubeCon

The world’s largest Kubernetes gathering, [KubeCon +
CloudNativeCon](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2018/)
is coming to Copenhagen from May 2-4, 2018 and will feature technical
sessions, case studies, developer deep dives, salons and more! Check out the
[schedule](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2018/program/schedule/)
of speakers and
[register](https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2018/attend/register/)
today!

## Webinar

Join members of the Kubernetes 1.10 release team on April 10th at
10am PDT to learn about the major features in this release including Local
Persistent Volumes and the Container Storage Interface (CSI). Register
[here](https://www.cncf.io/event/webinar-kubernetes-1-10/).

## Get Involved

The simplest way to get involved with Kubernetes is by joining
one of the many [Special Interest
Groups](https://github.com/kubernetes/community/blob/master/sig-list.md)
(SIGs) that align with your interests. Have something you’d like to broadcast
to the Kubernetes community? Share your voice at our weekly [community
meeting](https://github.com/kubernetes/community/blob/master/communication.md#weekly-meeting),
and through the channels below.

Thank you for your continued feedback and support.
1. Post questions (or answer questions) on [Stack
Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
1. Join the community portal for advocates on [K8sPort](http://k8sport.org/)
1. Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for
latest updates
1. Chat with the community on [Slack](http://slack.k8s.io/)
1. Share your Kubernetes
[story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform).
