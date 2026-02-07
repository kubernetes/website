---
layout: blog
title: "Spotlight on SIG Architecture: API Governance"
slug: sig-architecture-api
date: 2026-12-31 # placeholder
draft: true
author: >
  [Frederico Muñoz](https://github.com/fsmunoz) (SAS Institute)"
---

_This is the fifth interview of a SIG Architecture Spotlight series that covers the different
subprojects, and we will be covering [SIG Architecture: API
Governance](https://github.com/kubernetes/community/blob/master/sig-architecture/README.md#architecture-and-api-governance-1)._

In this SIG Architecture spotlight we talked with [Jordan Liggitt](https://github.com/liggitt), lead
of the API Governance sub-project.

## Introduction

**FM: Hello Jordan, thank you for your availability. Tell us a bit about yourself, your role and how
you got involved in Kubernetes.**

**JL**: My name is Jordan Liggitt. I'm a Christian, husband, father of four, software engineer at
[Google](https://about.google/) by day, and [amateur musician](https://www.youtube.com/watch?v=UDdr-VIWQwo) by stealth. I was born in Texas (and still
like to claim it as my point of origin), but I've lived in North Carolina for most of my life.

I've been working on Kubernetes since 2014. At that time, I was working on authentication and
authorization at Red Hat, and my very first pull request to Kubernetes attempted to [add an OAuth
server](https://github.com/kubernetes/kubernetes/pull/2328) to the Kubernetes API server. It never
exited work-in-progress status. I ended up going with a different approach that layered on top of
the core Kubernetes API server in a different project (spoiler alert: this is foreshadowing), and I
closed it without merging six months later.

Undeterred by that start, I stayed involved, helped build Kubernetes authentication and
authorization capabilities, and got involved in the definition and evolution of the core Kubernetes
APIs from early beta APIs, like `v1beta3` to `v1`. I got tagged as an API reviewer in 2016 based on
those contributions, and was added as an API approver in 2017.

Today, I help lead the API Governance and code organization subprojects for SIG Architecture, and I
am a tech lead for SIG Auth.

**FM: And when did you get specifically involved in the API Governance project?**

**JL**: Around 2019.

## Goals and scope of API Governance

**FM:  How would you describe the main goals and areas of intervention of the subproject?**

The surface area includes all the various APIs Kubernetes has, and there are APIs that people do not
always realize are APIs: command-line flags, configuration files, how binaries are run, how they
talk to back-end components like the container runtime, and how they persist data. People often
think of "the API" as only the [REST API](https://kubernetes.io/docs/reference/using-api/)... that
is the biggest and most obvious one, and the one with the largest audience, but all of these other
surfaces are also APIs. Their audiences are narrower, so there is more flexibility there, but they
still require consideration.

The goals are to be stable while still enabling innovation. Stability is easy if you never change
anything, but that contradicts the goal of evolution and growth. So we balance "be stable" with
"allow change".

**FM: Speaking of changes, in terms of ensuring consistency and quality (which is clearly one of the
reasons this project exists), what are the specific quality gates in the lifecycle of a Kubernetes
change? Does API Governance get involved during the release cycle, prior to it through guidelines,
or somewhere in between? At what points do you ensure the intended role is fulfilled?**

**JL**: We have [guidelines and
conventions](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md),
both for APIs in general and for how to change an API. These are living documents that we update as
we encounter new scenarios. They are long and dense, so we also support them with involvement at
either the design stage or the implementation stage.

Sometimes, due to bandwidth constraints, teams move ahead with design work without feedback from [API Review](https://github.com/kubernetes/community/blob/master/sig-architecture/api-review-process.md). That’s fine, but it means that when implementation begins, the API review will happen then,
and there may be substantial feedback. So we get involved when a new API is created or an existing
API is changed, either at design or implementation.

**FM: Is this during the Kubernetes Enhancement Proposal (KEP) process? Since KEPs are mandatory for
enhancements, I assume part of the work intersects with API Governance?**

**JL**: It can. [KEPs](https://github.com/kubernetes/enhancements/blob/master/keps/README.md) vary
in how detailed they are. Some include literal API definitions. When they do, we can perform an API
review at the design stage. Then implementation becomes a matter of checking fidelity to the design.

Getting involved early is ideal. But some KEPs are conceptual and leave details to the
implementation. That’s not wrong; it just means the implementation will be more exploratory. Then
API Review gets involved later, possibly recommending structural changes.

There’s a trade-off regardless: detailed design upfront versus iterative discovery during
implementation. People and teams work differently, and we’re flexible and happy to consult early or
at implementation time.

**FM: This reminds me of what Fred Brooks wrote in "The Mythical Man-Month" about conceptual
integrity being central to product quality... No matter how you structure the process, there must be
a point where someone looks at what is coming and ensures conceptual integrity. Kubernetes uses APIs
everywhere -- externally and internally -- so API Governance is critical to maintaining that
integrity. How is this captured?**

**JL**: Yes, the conventions document captures patterns we’ve learned over time: what to do in
various situations. We also have automated linters and checks to ensure correctness around patterns
like spec/status semantics. These automated tools help catch issues even when humans miss them.

As new scenarios arise -- and they do constantly -- we think through how to approach them and fold
the results back into our documentation and tools. Sometimes it takes a few attempts before we
settle on an approach that works well.

**FM: Exactly. Each new interaction improves the guidelines.**

**JL**: Right. And sometimes the first approach turns out to be wrong. It may take two or three
iterations before we land on something robust.

## The impact of Custom Resource Definitions

**FM: Is there any particular change, episode, or domain that stands out as especially noteworthy,
complex, or interesting in your experience?**

**JL**: The watershed moment was [Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
Prior to that, every API was handcrafted by us and fully reviewed. There were inconsistencies, but
we understood and controlled every type and field.

When Custom Resources arrived, anyone could define anything. The first version did not even require
a schema. That made it extremely powerful -- it enabled change immediately -- but it left us playing
catch-up on stability and consistency.

When Custom Resources graduated to General Availability (GA), schemas became required, but escape
hatches still existed for backward compatibility. Since then, we’ve been working on giving CRD
authors validation capabilities comparable to built-ins. Built-in validation rules for CRDs have
only just reached GA in the last few releases.

So CRDs opened the "anything is possible" era. Built-in validation rules are the second major
milestone: bringing consistency back.

The three major themes have been defining schemas, validating data, and handling pre-existing
invalid data. With ratcheting validation (allowing data to improve without breaking existing
objects), we can now guide CRD authors toward conventions without breaking the world.

## API Governance in context

**FM: How does API Governance relate to SIG Architecture and API Machinery?**

**JL**: [API Machinery](https://github.com/kubernetes/apimachinery) provides the actual code and
tools that people build APIs on. They don’t review APIs for storage, networking, scheduling, etc.

SIG Architecture sets the overall system direction and works with API Machinery to ensure the system
supports that direction. API Governance works with other SIGs building on that foundation to define
conventions and patterns, ensuring consistent use of what API Machinery provides.

**FM: Thank you. That clarifies the flow. Going back to [release cycles](https://kubernetes.io/releases/release/): do release phases -- enhancements freeze, code
freeze -- change your workload? Or is API Governance mostly continuous?**

**JL**: We get involved in two places: design and implementation. Design involvement increases
before enhancements freeze; implementation involvement increases before code freeze. However, many
efforts span multiple releases, so there is always some design and implementation happening, even
for work targeting future releases. Between those intense periods, we often have time to work on
long-term design work.

An anti-pattern we see is teams thinking about a large feature for months and then presenting it
three weeks before enhancements freeze, saying, "Here is the design, please review." For big changes
with API impact, it’s much better to involve API Governance early.

And there are good times in the cycle for this -- between freezes -- when people have bandwidth.
That’s when long-term review work fits best.

## Getting involved

**FM: Clearly. Now, regarding team dynamics and new contributors: how can someone get involved in
API Governance? What should they focus on?**

**JL**: It’s usually best to follow a specific change rather than trying to learn everything at
once. Pick a small API change, perhaps one someone else is making or one you want to make, and
observe the full process: design, implementation, review.

High-bandwidth review -- live discussion over video -- is often very effective. If you’re making or
following a change, ask whether there’s a time to go over the design or PR together. Observing those
discussions is extremely instructive.

Start with a small change. Then move to a bigger one. Then maybe a new API. That builds
understanding of conventions as they are applied in practice.

**FM: Excellent. Any final comments, or anything we missed?**

**JL**: Yes... the reason we care so much about compatibility and stability is for our users. It’s
easy for contributors to see those requirements as painful obstacles preventing cleanup or requiring
tedious work... but users integrated with our system, and we made a promise to them: we want them to
trust that we won’t break that contract. So even when it requires more work, moves slower, or
involves duplication, we choose stability.

We are not trying to be obstructive; we are trying to make life good for users.

A lot of our questions focus on the future: you want to do something now... how will you evolve it
later without breaking it? We assume we will know more in the future, and we want the design to
leave room for that.

We also assume we will make mistakes. The question then is: how do we leave ourselves avenues to
improve while keeping compatibility promises?

**FM: Exactly. Jordan, thank you, I think we’ve covered everything. This has been an insightful view
into the API Governance project and its role in the wider Kubernetes project.**

**JL**: Thank you.
