---
layout: blog
title: "Spotlight on SIG Architecture: Production Readiness"
slug: sig-architecture-production-readiness-spotlight-2023
date: 2023-11-02
canonicalUrl: https://www.k8s.dev/blog/2023/11/02/sig-architecture-production-readiness-spotlight-2023/
author: >
  Frederico Muñoz (SAS Institute)
---

_This is the second interview of a SIG Architecture Spotlight series that will cover the different
subprojects. In this blog, we will cover the [SIG Architecture: Production Readiness
subproject](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#production-readiness-1)_.

In this SIG Architecture spotlight, we talked with [Wojciech Tyczynski](https://github.com/wojtek-t)
(Google), lead of the Production Readiness subproject.

## About SIG Architecture and the Production Readiness subproject

**Frederico (FSM)**: Hello Wojciech, could you tell us a bit about yourself, your role and how you
got involved in Kubernetes?

**Wojciech Tyczynski (WT)**: I started contributing to Kubernetes in January 2015. At that time,
Google (where I was and still am working) decided to start a Kubernetes team in the Warsaw office
(in addition to already existing teams in California and Seattle). I was lucky enough to be one of
the seeding engineers for that team.

After two months of onboarding and helping with different tasks across the project towards 1.0
launch, I took ownership of the scalability area and I was leading Kubernetes to support clusters
with 5000 nodes. I’m still involved in [SIG Scalability](https://github.com/kubernetes/community/blob/master/sig-scalability/README.md)
as its Technical Lead. That was the start of a journey since scalability is such a cross-cutting topic,
and I started contributing to many other areas including, over time, to SIG Architecture.

**FSM**: In SIG Architecture, why specifically the Production Readiness subproject? Was it something
you had in mind from the start, or was it an unexpected consequence of your initial involvement in
scalability?

**WT**: After reaching that milestone of [Kubernetes supporting 5000-node clusters](https://kubernetes.io/blog/2017/03/scalability-updates-in-kubernetes-1-6/),
one of the goals was to ensure that Kubernetes would not degrade its scalability properties over time. While
non-scalable implementation is always fixable, designing non-scalable APIs or contracts is
problematic. I was looking for a way to ensure that people are thinking about
scalability when they create new features and capabilities without introducing too much overhead.

This is when I joined forces with [John Belamaric](https://github.com/johnbelamaric) and
[David Eads](https://github.com/deads2k) and created a Production Readiness subproject within SIG
Architecture. While setting the bar for scalability was only one of a few motivations for it, it
ended up fitting quite well. At the same time, I was already involved in the overall reliability of
the system internally, so other goals of Production Readiness were also close to my heart.

**FSM**: To anyone new to how SIG Architecture works, how would you describe the main goals and
areas of intervention of the Production Readiness subproject?

**WT**: The goal of the Production Readiness subproject is to ensure that any feature that is added
to Kubernetes can be reliably used in production clusters. This primarily means that those features
are observable, scalable, supportable, can always be safely enabled and in case of production issues
also disabled.

## Production readiness and the Kubernetes project

**FSM**: Architectural consistency being one of the goals of the SIG, is this made more challenging
by the [distributed and open nature of Kubernetes](https://www.cncf.io/reports/kubernetes-project-journey-report/)?
Do you feel this impacts the approach that Production Readiness has to take?

**WT**: The distributed nature of Kubernetes certainly impacts Production Readiness, because it
makes thinking about aspects like enablement/disablement or scalability more challenging. To be more
precise, when enabling or disabling features that span multiple components you need to think about
version skew between them and design for it. For scalability, changes in one component may actually
result in problems for a completely different one, so it requires a good understanding of the whole
system, not just individual components. But it’s also what makes this project so interesting.

**FSM**: Those running Kubernetes in production will have their own perspective on things, how do
you capture this feedback?

**WT**: Fortunately, we aren’t talking about _"them"_ here, we’re talking about _"us"_: all of us are
working for companies that are managing large fleets of Kubernetes clusters and we’re involved in
that too, so we suffer from those problems ourselves.

So while we’re trying to get feedback (our annual PRR survey is very important for us), it rarely
reveals completely new problems - it rather shows the scale of them. And we try to react to it -
changes like "Beta APIs off by default" happen in reaction to the data that we observe.

**FSM**: On the topic of reaction, that made me think of how the [Kubernetes Enhancement Proposal (KEP)](https://github.com/kubernetes/enhancements/blob/master/keps/NNNN-kep-template/README.md)
template has a Production Readiness Review (PRR) section, which is tied to the graduation
process. Was this something born out of identified insufficiencies? How would you describe the
results?

**WT**: As mentioned above, the overall goal of the Production Readiness subproject is to ensure
that every newly added feature can be reliably used in production. It’s not possible to enforce that
by a central team - we need to make it everyone's problem.

To achieve it, we wanted to ensure that everyone designing their new feature is thinking about safe
enablement, scalability, observability, supportability, etc. from the very beginning. Which means
not when the implementation starts, but rather during the design. Given that KEPs are effectively
Kubernetes design docs, making it part of the KEP template was the way to achieve the goal.

**FSM**: So, in a way making sure that feature owners have thought about the implications of their
proposal.

**WT**: Exactly. We already observed that just by forcing feature owners to think through the PRR
aspects (via forcing them to fill in the PRR questionnaire) many of the original issues are going
away. Sure - as PRR approvers we’re still catching gaps, but even the initial versions of KEPs are
better now than they used to be a couple of years ago in what concerns thinking about
productionisation aspects, which is exactly what we wanted to achieve - spreading the culture of
thinking about reliability in its widest possible meaning.

**FSM**: We've been talking about the PRR process, could you describe it for our readers?

**WT**: The [PRR process](https://github.com/kubernetes/community/blob/master/sig-architecture/production-readiness.md)
is fairly simple - we just want to ensure that you think through the productionisation aspects of
your feature early enough. If you do your job, it’s just a matter of answering some questions in the
KEP template and getting approval from a PRR approver (in addition to regular SIG approval). If you
didn’t think about those aspects earlier, it may require spending more time and potentially revising
some decisions, but that’s exactly what we need to make the Kubernetes project reliable.

## Helping with Production Readiness

**FSM**: Production Readiness seems to be one area where a good deal of prior exposure is required
in order to be an effective contributor. Are there also ways for someone newer to the project to
contribute?

**WT**: PRR approvers have to have a deep understanding of the whole Kubernetes project to catch
potential issues. Kubernetes is such a large project now with so many nuances that people who are
new to the project can simply miss the context, no matter how senior they are.

That said, there are many ways that you may implicitly help. Increasing the reliability of
particular areas of the project by improving its observability and debuggability, increasing test
coverage, and building new kinds of tests (upgrade, downgrade, chaos, etc.) will help us a lot. Note
that the PRR subproject is focused on keeping the bar at the design level, but we should also care
equally about the implementation. For that, we’re relying on individual SIGs and code approvers, so
having people there who are aware of productionisation aspects, and who deeply care about it, will
help the project a lot.

**FSM**: Thank you! Any final comments you would like to share with our readers?

**WT**: I would like to highlight and thank all contributors for their cooperation. While the PRR
adds some additional work for them, we see that people care about it, and what’s even more
encouraging is that with every release the quality of the answers improves, and questions "do I
really need a metric reflecting if my feature works" or "is downgrade really that important" don’t
really appear anymore.
