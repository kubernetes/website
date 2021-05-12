---
layout: blog
title: 'Kubernetes 1.20: The Raddest Release'
date: 2020-12-08
slug: kubernetes-1-20-release-announcement
---

**Authors:** [Kubernetes 1.20 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.20/release_team.md)

We’re pleased to announce the release of Kubernetes 1.20, our third and final release of 2020! This release consists of 42 enhancements: 11 enhancements have graduated to stable, 15 enhancements are moving to beta, and 16 enhancements are entering alpha.

The 1.20 release cycle returned to its normal cadence of 11 weeks following the previous extended release cycle. This is one of the most feature dense releases in a while: the Kubernetes innovation cycle is still trending upward. This release has more alpha than stable enhancements, showing that there is still much to explore in the cloud native ecosystem.

## Major Themes

### Volume Snapshot Operations Goes Stable

This feature provides a standard way to trigger volume snapshot operations and allows users to incorporate snapshot operations in a portable manner on any Kubernetes environment and supported storage providers.

Additionally, these Kubernetes snapshot primitives act as basic building blocks that unlock the ability to develop advanced, enterprise-grade, storage administration features for Kubernetes, including application or cluster level backup solutions.

Note that snapshot support requires Kubernetes distributors to bundle the Snapshot controller, Snapshot CRDs, and validation webhook. A CSI driver supporting the snapshot functionality must also be deployed on the cluster.

### Kubectl Debug Graduates to Beta

The `kubectl alpha debug` features graduates to beta in 1.20, becoming `kubectl debug`. The feature provides support for common debugging workflows directly from kubectl. Troubleshooting scenarios supported in this release of kubectl include:

* Troubleshoot workloads that crash on startup by creating a copy of the pod that uses a different container image or command.
* Troubleshoot distroless containers by adding a new container with debugging tools, either in a new copy of the pod or using an ephemeral container. (Ephemeral containers are an alpha feature that are not enabled by default.)
* Troubleshoot on a node by creating a container running in the host namespaces and with access to the host’s filesystem.

Note that as a new built-in command, `kubectl debug` takes priority over any kubectl plugin named “debug”. You must rename the affected plugin.

Invocations using `kubectl alpha debug` are now deprecated and will be removed in a subsequent release. Update your scripts to use `kubectl debug`. For more information about `kubectl debug`, see [Debugging Running Pods](https://kubernetes.io/docs/tasks/debug-application-cluster/debug-running-pod/).

### Beta: API Priority and Fairness

Introduced in 1.18, Kubernetes 1.20 now enables API Priority and Fairness (APF) by default. This allows `kube-apiserver` to categorize incoming requests by priority levels.

### Alpha with updates: IPV4/IPV6

The IPv4/IPv6 dual stack has been reimplemented to support dual stack services based on user and community feedback. This allows both IPv4 and IPv6 service cluster IP addresses to be assigned to a single service, and also enables a service to be transitioned from single to dual IP stack and vice versa.

### GA: Process PID Limiting for Stability

Process IDs (pids) are a fundamental resource on Linux hosts. It is trivial to hit the task limit without hitting any other resource limits and cause instability to a host machine.

Administrators require mechanisms to ensure that user pods cannot induce pid exhaustion that prevents host daemons (runtime, kubelet, etc) from running. In addition, it is important to ensure that pids are limited among pods in order to ensure they have limited impact to other workloads on the node.
After being enabled-by-default for a year, SIG Node graduates PID Limits to GA on both `SupportNodePidsLimit` (node-to-pod PID isolation) and `SupportPodPidsLimit` (ability to limit PIDs per pod).

### Alpha: Graceful node shutdown

Users and cluster administrators expect that pods will adhere to expected pod lifecycle including pod termination. Currently, when a node shuts down, pods do not follow the expected pod termination lifecycle and are not terminated gracefully which can cause issues for some workloads.
The `GracefulNodeShutdown` feature is now in Alpha. `GracefulNodeShutdown` makes the kubelet aware of node system shutdowns, enabling graceful termination of pods during a system shutdown.

## Major Changes

### Dockershim Deprecation

Dockershim, the container runtime interface (CRI) shim for Docker is being deprecated. Support for Docker is deprecated and will be removed in a future release. Docker-produced images will continue to work in your cluster with all CRI compliant runtimes as Docker images follow the Open Container Initiative (OCI) image specification.
The Kubernetes community has written a [detailed blog post about deprecation](https://blog.k8s.io/2020/12/02/dont-panic-kubernetes-and-docker/) with [a dedicated FAQ page for it](https://blog.k8s.io/2020/12/02/dockershim-faq/).

### Exec Probe Timeout Handling

A longstanding bug regarding exec probe timeouts that may impact existing pod definitions has been fixed. Prior to this fix, the field `timeoutSeconds` was not respected for exec probes. Instead, probes would run indefinitely, even past their configured deadline, until a result was returned. With this change, the default value of `1 second` will be applied if a value is not specified and existing pod definitions may no longer be sufficient if a probe takes longer than one second. A feature gate, called `ExecProbeTimeout`, has been added with this fix that enables cluster operators to revert to the previous behavior, but this will be locked and removed in subsequent releases. In order to revert to the previous behavior, cluster operators should set this feature gate to `false`.

Please review the updated documentation regarding [configuring probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes) for more details.

## Other Updates

### Graduated to Stable

* [RuntimeClass](https://github.com/kubernetes/enhancements/issues/585)
* [Built-in API Types Defaults](https://github.com/kubernetes/enhancements/issues/1929)
* [Add Pod-Startup Liveness-Probe Holdoff](https://github.com/kubernetes/enhancements/issues/950)
* [Support CRI-ContainerD On Windows](https://github.com/kubernetes/enhancements/issues/1001)
* [SCTP Support for Services](https://github.com/kubernetes/enhancements/issues/614)
* [Adding AppProtocol To Services And Endpoints](https://github.com/kubernetes/enhancements/issues/1507)

### Notable Feature Updates

* [CronJobs](https://github.com/kubernetes/enhancements/issues/19)

# Release notes

You can check out the full details of the 1.20 release in the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.20.md).

# Availability of release

Kubernetes 1.20 is available for [download on GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.20.0). There are some great resources out there for getting started with Kubernetes. You can check out some [interactive tutorials](https://kubernetes.io/docs/tutorials/) on the main Kubernetes site, or run a local cluster on your machine using Docker containers with [kind](https://kind.sigs.k8s.io). If you’d like to try building a cluster from scratch, check out the [Kubernetes the Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) tutorial by Kelsey Hightower.

# Release Team

This release was made possible by a very dedicated group of individuals, who came together as a team in the midst of a lot of things happening out in the world. A huge thank you to the release lead Jeremy Rickard, and to everyone else on the release team for supporting each other, and working so hard to deliver the 1.20 release for the community.

# Release Logo

![Kubernetes 1.20 Release Logo](/images/blog/2020-12-08-kubernetes-1.20-release-announcement/laser.png)

[raddest](https://www.dictionary.com/browse/rad): *adjective*, Slang. excellent; wonderful; cool:

> The Kubernetes 1.20 Release has been the raddest release yet.

2020 has been a challenging year for many of us, but Kubernetes contributors have delivered a record-breaking number of enhancements in this release. That is a great accomplishment, so the release lead wanted to end the year with a little bit of levity and pay homage to [Kubernetes 1.14 - Caturnetes](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.14) with a "rad" cat named Humphrey.

Humphrey is the release lead's cat and has a permanent [`blep`](https://www.inverse.com/article/42316-why-do-cats-blep-science-explains). *Rad* was pretty common slang in the 1990s in the United States, and so were laser backgrounds. Humphrey in a 1990s style school picture felt like a fun way to end the year. Hopefully, Humphrey and his *blep* bring you a little joy at the end of 2020!

The release logo was created by [Henry Hsu - @robotdancebattle](https://www.instagram.com/robotdancebattle/).

# User Highlights

- Apple is operating multi-thousand node Kubernetes clusters in data centers all over the world. Watch [Alena Prokharchyk's KubeCon NA Keynote](https://youtu.be/Tx8qXC-U3KM) to learn more about their cloud native journey.

# Project Velocity

The [CNCF K8s DevStats project](https://k8s.devstats.cncf.io/) aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing, and is a neat illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.20 release cycle, which ran for 11 weeks (September 25 to December 9), we saw contributions from [967 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.19.0%20-%20now&var-metric=contributions) and [1335 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.19.0%20-%20now&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All) ([44 of whom](https://k8s.devstats.cncf.io/d/52/new-contributors?orgId=1&from=1601006400000&to=1607576399000&var-repogroup_name=Kubernetes) made their first Kubernetes contribution) from [26 countries](https://k8s.devstats.cncf.io/d/50/countries-stats?orgId=1&from=1601006400000&to=1607576399000&var-period_name=Quarter&var-countries=All&var-repogroup_name=Kubernetes&var-metric=rcommitters&var-cum=countries).

# Ecosystem Updates

- KubeCon North America just wrapped up three weeks ago, the second such event to be virtual! All talks are [now available to all on-demand](https://www.youtube.com/playlist?list=PLj6h78yzYM2Pn8RxfLh2qrXBDftr6Qjut) for anyone still needing to catch up!
- In June, the Kubernetes community formed a new working group as a direct response to the Black Lives Matter protests occurring across America. WG Naming's goal is to remove harmful and unclear language in the Kubernetes project as completely as possible and to do so in a way that is portable to other CNCF projects. A great introductory talk on this important work and how it is conducted was given [at KubeCon 2020 North America](https://sched.co/eukp), and the initial impact of this labor [can actually be seen in the v1.20 release](https://github.com/kubernetes/enhancements/issues/2067).
- Previously announced this summer, [The Certified Kubernetes Security Specialist (CKS) Certification](https://www.cncf.io/announcements/2020/11/17/kubernetes-security-specialist-certification-now-available/) was released during Kubecon NA for immediate scheduling!  Following the model of CKA and CKAD, the CKS is a performance-based exam, focused on security-themed competencies and domains.  This exam is targeted at current CKA holders, particularly those who want to round out their baseline knowledge in securing cloud workloads (which is all of us, right?).

# Event Updates

KubeCon + CloudNativeCon Europe 2021 will take place May 4 - 7, 2021! Registration will open on January 11. You can find more information about the conference [here](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/). Remember that [the CFP](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/program/cfp/) closes on Sunday, December 13, 11:59pm PST!

# Upcoming release webinar

Stay tuned for the upcoming release webinar happening this January.

# Get Involved

If you’re interested in contributing to the Kubernetes community, Special Interest Groups (SIGs) are a great starting point. Many of them may align with your interests! If there are things you’d like to share with the community, you can join the weekly community meeting, or use any of the following channels:

* Find out more about contributing to Kubernetes at the new [Kubernetes Contributor website](https://www.kubernetes.dev/)
* Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
