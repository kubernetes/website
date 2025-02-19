---
layout: blog
title: "Spotlight on SIG Instrumentation"
slug: sig-instrumentation-spotlight-2023
date: 2023-02-03
canonicalUrl: https://www.kubernetes.dev/blog/2023/02/03/sig-instrumentation-spotlight-2023/
author: >
  Imran Noor Mohamed (Delivery Hero)
---

Observability requires the right data at the right time for the right consumer
(human or piece of software) to make the right decision. In the context of Kubernetes,
having best practices for cluster observability across all Kubernetes components is crucial.

SIG Instrumentation helps to address this issue by providing best practices and tools
that all other SIGs use to instrument Kubernetes components-like the *API server*,
*scheduler*, *kubelet* and *kube-controller-manager*.

In this SIG Instrumentation spotlight, [Imran Noor Mohamed](https://www.linkedin.com/in/imrannoormohamed/),
SIG ContribEx-Comms tech lead talked with [Elana Hashman](https://twitter.com/ehashdn),
and [Han Kang](https://www.linkedin.com/in/hankang), chairs of SIG Instrumentation,
on how the SIG is organized, what are the current challenges and how anyone can get involved and contribute.

## About SIG Instrumentation

**Imran (INM)**: Hello, thank you for the opportunity of learning more about SIG Instrumentation.
Could you tell us a bit about yourself, your role, and how you got involved in SIG Instrumentation?

**Han (HK)**: I started in SIG Instrumentation in 2018, and became a chair in 2020.
I primarily got involved with SIG instrumentation due to a number of upstream issues
with metrics which ended up affecting GKE in bad ways. As a result, we ended up
launching an initiative to stabilize our metrics and make metrics a proper API.

**Elana (EH)**: I also joined SIG Instrumentation in 2018 and became a chair at the
same time as Han. I was working as a site reliability engineer (SRE) on bare metal
Kubernetes clusters and was working to build out our observability stack.
I encountered some issues with label joins where Kubernetes metrics didn’t match
kube-state-metrics ([KSM](https://github.com/kubernetes/kube-state-metrics)) and
started participating in SIG meetings to improve things. I helped test performance
improvements to kube-state-metrics and ultimately coauthored a KEP for overhauling
metrics in the 1.14 release to improve usability.

**Imran (INM)**: Interesting! Does that mean SIG Instrumentation involves a lot of plumbing?

**Han (HK)**: I wouldn’t say it involves a ton of plumbing, though it does touch
basically every code base. We have our own dedicated directories for our metrics,
logs, and tracing frameworks which we tend to work out of primarily. We do have to
interact with other SIGs in order to propagate our changes which makes us more of
a horizontal SIG.

**Imran (INM)**: Speaking about interaction and coordination with other SIG could
you describe how the SIGs is organized?

**Elana (EH)**: In SIG Instrumentation, we have two chairs, Han and myself, as well
as two tech leads, David Ashpole and Damien Grisonnet. We all work together as the
SIG’s leads in order to run meetings, triage issues and PRs, review and approve KEPs,
plan for each release, present at KubeCon and community meetings, and write our annual
report. Within the SIG we also have a number of important subprojects, each of which is
stewarded by its subproject owners. For example, Marek Siarkowicz is a subproject owner
of [metrics-server](https://github.com/kubernetes-sigs/metrics-server).

Because we’re a horizontal SIG, some of our projects have a wide scope and require
coordination from a dedicated group of contributors. For example, in order to guide
the Kubernetes migration to structured logging, we chartered the
[Structured Logging](https://github.com/kubernetes/community/blob/master/wg-structured-logging/README.md)
Working Group (WG), organized by Marek and Patrick Ohly. The WG doesn’t own any code,
but helps with various components such as the *kubelet*, *scheduler*, etc. in migrating
their code to use structured logs.

**Imran (INM)**: Walking through the
[charter](https://github.com/kubernetes/community/blob/master/sig-instrumentation/charter.md)
alone it’s clear that SIG Instrumentation has a lot of sub-projects.
Could you highlight some important ones?

**Han (HK)**: We have many different sub-projects and we are in dire need of
people who can come and help shepherd them. Our most important projects in-tree
(that is, within the kubernetes/kubernetes repo) are metrics, tracing, and,
structured logging. Our most important projects out-of-tree are
(a) KSM (kube-state-metrics) and (b) metrics-server.

**Elana (EH)**: Echoing this, we would love to bring on more maintainers for
kube-state-metrics and metrics-server. Our friends at WG Structured Logging are
also looking for contributors. Other subprojects include klog, prometheus-adapter,
and a new subproject that we just launched for collecting high-fidelity, scalable
utilization metrics called [usage-metrics-collector](https://github.com/kubernetes-sigs/usage-metrics-collector).
All are seeking new contributors!

## Current status and ongoing challenges

**Imran (INM)**: For release [1.26](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.26)
we can see that there are a relevant number of metrics, logs, and tracing
[KEPs](https://www.k8s.dev/resources/keps/) in the pipeline. Would you like to
point out important things for last release (maybe alpha & stable milestone candidates?)

**Han (HK)**: We can now generate [documentation](/docs/reference/instrumentation/metrics/)
for every single metric in the main Kubernetes code base! We have a pretty fancy
static analysis pipeline that enables this functionality. We’ve also added feature
metrics so that you can look at your metrics to determine which features are enabled
in your cluster at a given time. Lastly, we added a component-sli endpoint, which
should make it easy for people to create availability SLOs for *control-plane* components.

**Elana (EH)**: We’ve also been working on tracing KEPs for both the *API server*
and *kubelet*, though neither graduated in 1.26. I’m also really excited about the
work Han is doing with WG Reliability to extend and improve our metrics stability framework.

**Imran (INM)**: What do you think are the Kubernetes-specific challenges tackled by
the SIG Instrumentation? What are the future efforts to solve them?

**Han (HK)**:  SIG instrumentation suffered a bit in the past from being a horizontal SIG.
We did not have an obvious location to put our code and did not have a good mechanism to
audit metrics that people would randomly add. We’ve fixed this over the years and now we
have dedicated spots for our code and a reliable mechanism for auditing new metrics.
We also now offer stability guarantees for metrics. We hope to have full-blown tracing
up and down the kubernetes stack, and metric support via exemplars.

**Elana (EH)**: I think SIG Instrumentation is a really interesting SIG because it
poses different kinds of opportunities to get involved than in other SIGs. You don’t
have to be a software developer to contribute to our SIG! All of our components and
subprojects are focused on better understanding Kubernetes and its performance in
production, which allowed me to get involved as one of the few SIG Chairs working as
an SRE at that time. I like that we provide opportunities for newcomers to contribute
through using, testing, and providing feedback on our subprojects, which is a lower
barrier to entry. Because many of these projects are out-of-tree, I think one of our
challenges is to figure out what’s in scope for core Kubernetes SIGs instrumentation
subprojects, what’s missing, and then fill in the gaps.

## Community and contribution

**Imran (INM)**: Kubernetes values community over products.  Any recommendation
for anyone looking into getting involved in SIG Instrumentation work? Where
should they start (new contributor-friendly areas within SIG?)

**Han(HK) and Elana (EH)**: Come to our bi-weekly triage
[meetings](https://github.com/kubernetes/community/tree/master/sig-instrumentation#meetings)!
They aren’t recorded and are a great place to ask questions and learn about our ongoing work.
We strive to be a friendly community and one of the easiest SIGs to get started with.
You can check out our latest KubeCon NA 2022 [SIG Instrumentation Deep Dive](https://youtu.be/JIzrlWtAA8Y)
to get more insight into our work. We also invite you to join our Slack channel #sig-instrumentation
and feel free to reach out to any of our SIG leads or subproject owners directly.

Thank you so much for your time and insights into the workings of SIG Instrumentation!
