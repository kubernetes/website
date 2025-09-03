---
layout: blog
title: "Spotlight on SIG Scheduling"
slug: sig-scheduling-spotlight-2024
canonicalUrl: https://www.kubernetes.dev/blog/2024/09/24/sig-scheduling-spotlight-2024
date: 2024-09-24
author: "Arvind Parekh"
---

In this SIG Scheduling spotlight we talked with [Kensei Nakada](https://github.com/sanposhiho/), an
approver in SIG Scheduling.

## Introductions

**Arvind:** **Hello, thank you for the opportunity to learn more about SIG Scheduling! Would you
like to introduce yourself and tell us a bit about your role, and how you got involved with
Kubernetes?**

**Kensei**: Hi, thanks for the opportunity! I’m Kensei Nakada
([@sanposhiho](https://github.com/sanposhiho/)), a software engineer at
[Tetrate.io](https://tetrate.io/). I have been contributing to Kubernetes in my free time for more
than 3 years, and now I’m an approver of SIG Scheduling in Kubernetes. Also, I’m a founder/owner of
two SIG subprojects,
[kube-scheduler-simulator](https://github.com/kubernetes-sigs/kube-scheduler-simulator) and
[kube-scheduler-wasm-extension](https://github.com/kubernetes-sigs/kube-scheduler-wasm-extension).

## About SIG Scheduling

**AP: That's awesome! You've been involved with the project since a long time. Can you provide a
brief overview of SIG Scheduling and explain its role within the Kubernetes ecosystem?**

**KN**: As the name implies, our responsibility is to enhance scheduling within
Kubernetes. Specifically, we develop the components that determine which Node is the best place for
each Pod. In Kubernetes, our main focus is on maintaining the
[kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/), along
with other scheduling-related components as part of our SIG subprojects.

**AP: I see, got it! That makes me curious--what recent innovations or developments has SIG
Scheduling introduced to Kubernetes scheduling?**

**KN**: From a feature perspective, there have been
[several enhancements](/blog/2023/04/17/fine-grained-pod-topology-spread-features-beta/)
to `PodTopologySpread` recently. `PodTopologySpread` is a relatively new feature in the scheduler,
and we are still in the process of gathering feedback and making improvements.

Most recently, we have been focusing on a new internal enhancement called
[QueueingHint](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/4247-queueinghint/README.md)
which aims to enhance scheduling throughput. Throughput is one of our crucial metrics in
scheduling. Traditionally, we have primarily focused on optimizing the latency of each scheduling
cycle. QueueingHint takes a different approach, optimizing when to retry scheduling, thereby
reducing the likelihood of wasting scheduling cycles.

**A: That sounds interesting! Are there any other interesting topics or projects you are currently
working on within SIG Scheduling?**

**KN**: I’m leading the development of `QueueingHint` which I just shared. Given that it’s a big new
challenge for us, we’ve been facing many unexpected challenges, especially around the scalability,
and we’re trying to solve each of them to eventually enable it by default.

And also, I believe
[kube-scheduler-wasm-extension](https://github.com/kubernetes-sigs/kube-scheduler-wasm-extension)
(a SIG subproject) that I started last year would be interesting to many people. Kubernetes has
various extensions from many components. Traditionally, extensions are provided via webhooks
([extender](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/scheduler_extender.md)
in the scheduler) or Go SDK ([Scheduling Framework](/docs/concepts/scheduling-eviction/scheduling-framework/)
in the scheduler). However, these come with drawbacks - performance issues with webhooks and the need to
rebuild and replace schedulers with Go SDK, posing difficulties for those seeking to extend the
scheduler but lacking familiarity with it. The project is trying to introduce a new solution to
this general challenge - a [WebAssembly](https://webassembly.org/) based extension. Wasm allows
users to build plugins easily, without worrying about recompiling or replacing their scheduler, and
sidestepping performance concerns.

Through this project, SIG Scheduling has been learning valuable insights about WebAssembly's
interaction with large Kubernetes objects. And I believe the experience that we’re gaining should be
useful broadly within the community, beyond SIG Scheduling.

**A: Definitely! Now, there are 8 subprojects inside SIG Scheduling. Would you like to
talk about them? Are there some interesting contributions by those teams you want to highlight?**

**KN**: Let me pick up three subprojects: Kueue, KWOK and descheduler.

[Kueue](https://github.com/kubernetes-sigs/kueue)
: Recently, many people have been trying to manage batch workloads with Kubernetes, and in 2022,
  Kubernetes community founded
  [WG-Batch](https://github.com/kubernetes/community/blob/master/wg-batch/README.md) for better
  support for such batch workloads in Kubernetes. [Kueue](https://github.com/kubernetes-sigs/kueue)
  is a project that takes a crucial role for it. It’s a job queueing controller, deciding when a job
  should wait, when a job should be admitted to start, and when a job should be preempted. Kueue aims
  to be installed on a vanilla Kubernetes cluster while cooperating with existing matured controllers
  (scheduler, cluster-autoscaler, kube-controller-manager, etc).

[KWOK](https://github.com/kubernetes-sigs/kwok)
: KWOK is a component in which you can create a cluster of thousands of Nodes in seconds. It’s
  mostly useful for simulation/testing as a lightweight cluster, and actually another SIG sub
  project [kube-scheduler-simulator](https://github.com/kubernetes-sigs/kube-scheduler-simulator)
  uses KWOK background.

[descheduler](https://github.com/kubernetes-sigs/descheduler)
: Descheduler is a component recreating pods that are running on undesired Nodes. In Kubernetes,
  scheduling constraints (`PodAffinity`, `NodeAffinity`, `PodTopologySpread`, etc) are honored only at
  Pod schedule, but it’s not guaranteed that the contrtaints are kept being satisfied afterwards.
  Descheduler evicts Pods violating their scheduling constraints (or other undesired conditions) so
  that they’re recreated and rescheduled.

[Descheduling Framework](https://github.com/kubernetes-sigs/descheduler/blob/master/keps/753-descheduling-framework/README.md)
: One very interesting on-going project, similar to
  [Scheduling Framework](/docs/concepts/scheduling-eviction/scheduling-framework/) in the
  scheduler, aiming to make descheduling logic extensible and allow maintainers to focus on building
  a core engine of descheduler.

**AP: Thank you for letting us know! And I have to ask, what are some of your favorite things about
this SIG?**

**KN**: What I really like about this SIG is how actively engaged everyone is. We come from various
companies and industries, bringing diverse perspectives to the table. Instead of these differences
causing division, they actually generate a wealth of opinions. Each view is respected, and this
makes our discussions both rich and productive.

I really appreciate this collaborative atmosphere, and I believe it has been key to continuously
improving our components over the years.

## Contributing to SIG Scheduling

**AP: Kubernetes is a community-driven project. Any recommendations for new contributors or
beginners looking to get involved and contribute to SIG scheduling? Where should they start?**

**KN**: Let me start with a general recommendation for contributing to any SIG: a common approach is to look for
[good-first-issue](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22).
However, you'll soon realize that many people worldwide are trying to contribute to the Kubernetes
repository.

I suggest starting by examining the implementation of a component that interests you. If you have
any questions about it, ask in the corresponding Slack channel (e.g., #sig-scheduling for the
scheduler, #sig-node for kubelet, etc). Once you have a rough understanding of the implementation,
look at issues within the SIG (e.g.,
[sig-scheduling](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Asig%2Fscheduling)),
where you'll find more unassigned issues compared to good-first-issue ones. You may also want to
filter issues with the
[kind/cleanup](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue++label%3Akind%2Fcleanup+)
label, which often indicates lower-priority tasks and can be starting points.

Specifically for SIG Scheduling, you should first understand the
[Scheduling Framework](/docs/concepts/scheduling-eviction/scheduling-framework/), which is
the fundamental architecture of kube-scheduler. Most of the implementation is found in
[pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/master/pkg/scheduler).
I suggest starting with
[ScheduleOne](https://github.com/kubernetes/kubernetes/blob/0590bb1ac495ae8af2a573f879408e48800da2c5/pkg/scheduler/schedule_one.go#L66)
function and then exploring deeper from there.

Additionally, apart from the main kubernetes/kubernetes repository, consider looking into
sub-projects. These typically have fewer maintainers and offer more opportunities to make a
significant impact. Despite being called "sub" projects, many have a large number of users and a
considerable impact on the community.

And last but not least, remember contributing to the community isn’t just about code. While I
talked a lot about the implementation contribution, there are many ways to contribute, and each one
is valuable. One comment to an issue, one feedback to an existing feature, one review comment in PR,
one clarification on the documentation; every small contribution helps drive the Kubernetes
ecosystem forward.

**AP: Those are some pretty useful tips! And if I may ask, how do you assist new contributors in
getting started, and what skills are contributors likely to learn by participating in SIG Scheduling?**

**KN**: Our maintainers are available to answer your questions in the #sig-scheduling Slack
channel. By participating, you'll gain a deeper understanding of Kubernetes scheduling and have the
opportunity to collaborate and network with maintainers from diverse backgrounds. You'll learn not
just how to write code, but also how to maintain a large project, design and discuss new features,
address bugs, and much more.

## Future Directions

**AP: What are some Kubernetes-specific challenges in terms of scheduling? Are there any particular
pain points?**

**KN**: Scheduling in Kubernetes can be quite challenging because of the diverse needs of different
organizations with different business requirements. Supporting all possible use cases in
kube-scheduler is impossible. Therefore, extensibility is a key focus for us. A few years ago, we
rearchitected kube-scheduler with [Scheduling Framework](/docs/concepts/scheduling-eviction/scheduling-framework/),
which offers flexible extensibility for users to implement various scheduling needs through plugins. This
allows maintainers to focus on the core scheduling features and the framework runtime.

Another major issue is maintaining sufficient scheduling throughput. Typically, a Kubernetes cluster
has only one kube-scheduler, so its throughput directly affects the overall scheduling scalability
and, consequently, the cluster's scalability. Although we have an internal performance test
([scheduler_perf](https://github.com/kubernetes/kubernetes/tree/master/test/integration/scheduler_perf)),
unfortunately, we sometimes overlook performance degradation in less common scenarios. It’s
difficult as even small changes, which look irrelevant to performance, can lead to degradation.

**AP: What are some upcoming goals or initiatives for SIG Scheduling? How do you envision the SIG evolving in the future?**

**KN**: Our primary goal is always to build and maintain _extensible_ and _stable_ scheduling
runtime, and I bet this goal will remain unchanged forever.

As already mentioned, extensibility is key to solving the challenge of the diverse needs of
scheduling. Rather than trying to support every different use case directly in kube-scheduler, we
will continue to focus on enhancing extensibility so that it can accommodate various use
cases. [kube-scheduler-wasm-extension](https://github.com/kubernetes-sigs/kube-scheduler-wasm-extension)
that I mentioned is also part of this initiative.

Regarding stability, introducing new optimizations like QueueHint is one of our
strategies. Additionally, maintaining throughput is also a crucial goal towards the future. We’re
planning to enhance our throughput monitoring
([ref](https://github.com/kubernetes/kubernetes/issues/124774)), so that we can notice degradation
as much as possible on our own before releasing. But, realistically, we can't cover every possible
scenario. We highly appreciate any attention the community can give to scheduling throughput and
encourage feedback and alerts regarding performance issues!

## Closing Remarks

**AP: Finally, what message would you like to convey to those who are interested in learning more
about SIG Scheduling?**

**KN**: Scheduling is one of the most complicated areas in Kubernetes, and you may find it difficult
at first. But, as I shared earlier, you can find many opportunities for contributions, and many
maintainers are willing to help you understand things. We know your unique perspective and skills
are what makes our open source so powerful 😊

Feel free to reach out to us in Slack
([#sig-scheduling](https://kubernetes.slack.com/archives/C09TP78DV)) or
[meetings](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md#meetings).
I hope this article interests everyone and we can see new contributors!

**AP: Thank you so much for taking the time to do this! I'm confident that many will find this
information invaluable for understanding more about SIG Scheduling and for contributing to the SIG.**
