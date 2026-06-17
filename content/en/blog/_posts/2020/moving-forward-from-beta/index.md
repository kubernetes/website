---
layout: blog
title: "Moving Forward From Beta"
date: 2020-08-21
slug: moving-forward-from-beta

# note to localizers: including this means you are marking
# the article as maintained. That should be fine, but if
# there is ever an update, you're committing to also updating
# the localized version.
# If unsure: omit this next field.
evergreen: true
author: >
   Tim Bannister (The Scale Factory)
---

In Kubernetes, features follow a defined
[lifecycle](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages).
First, as the twinkle of an eye in an interested developer. Maybe, then,
sketched in online discussions, drawn on the online equivalent of a cafe
napkin. This rough work typically becomes a
[Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-architecture/0000-kep-process/README.md#kubernetes-enhancement-proposal-process) (KEP), and
from there it usually turns into code.

For Kubernetes v1.20 and onwards, we're focusing on helping that code
graduate into stable features.

That lifecycle I mentioned runs as follows:

![Alpha → Beta → General Availability](feature_stages.svg)

Usually, alpha features aren't enabled by default. You turn them on by setting a feature
gate; usually, by setting a command line flag on each of the components that use the
feature.

(If you use Kubernetes through a managed service offering such as AKS, EKS, GKE, etc then
the vendor who runs that service may have decided what feature gates are enabled for you).

There's a defined process for graduating an existing, alpha feature into the beta phase.
This is important because **beta features are enabled by default**, with the feature flag still
there so cluster operators can opt out if they want.

A similar but more thorough set of graduation criteria govern the transition to general
availability (GA), also known as "stable". GA features are part of Kubernetes, with a
commitment that they are staying in place throughout the current major version.

Having beta features on by default lets Kubernetes and its contributors get valuable
real-world feedback. However, there's a mismatch of incentives. Once a feature is enabled
by default, people will use it. Even if there might be a few details to shake out,
the way Kubernetes' REST APIs and conventions work mean that any future stable API is going
to be compatible with the most recent beta API: your API objects won't stop working when
a beta feature graduates to GA.

For the API and its resources in particular, there's a much less strong incentive to move
features from beta to GA than from alpha to beta. Vendors who want a particular feature
have had good reason to help get code to the point where features are enabled by default,
and beyond that the journey has been less clear.

KEPs track more than code improvements. Essentially, anything that would need
communicating to the wider community merits a KEP. That said, most KEPs cover
Kubernetes features (and the code to implement them).

You might know that [Ingress](/docs/concepts/services-networking/ingress/)
has been in Kubernetes for a while, but did you realize that it actually went beta in 2015? To help
drive things forward, Kubernetes' Architecture Special Interest Group (SIG) have a new approach in
mind.

## Avoiding permanent beta

For Kubernetes REST APIs, when a new feature's API reaches beta, that starts a countdown.
The beta-quality API now has **three releases** (about nine calendar months) to either:
- reach GA, and deprecate the beta, or
- have a new beta version (_and deprecate the previous beta_).

To be clear, at this point **only REST APIs are affected**. For example, _APIListChunking_ is
a beta feature but isn't itself a REST API. Right now there are no plans to automatically
deprecate _APIListChunking_ nor any other features that aren't REST APIs.

If a beta API has not graduated to GA after three Kubernetes releases, then the
next Kubernetes release will deprecate that API version. There's no option for
the REST API to stay at the same beta version beyond the first Kubernetes
release to come out after the release window.

### What this means for you

If you're using Kubernetes, there's a good chance that you're using a beta feature. Like
I said, there are lots of them about.
As well as Ingress, you might be using [CronJob](/docs/concepts/workloads/controllers/cron-jobs/),
or [PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/), or others.
There's an even bigger chance that you're running on a control plane with at least one beta
feature enabled.

If you're using or generating Kubernetes manifests that use beta APIs like Ingress, you'll
need to plan to revise those. The current APIs are going to be deprecated following a
schedule (the 9 months I mentioned earlier) and after a further 9 months those deprecated
APIs will be removed. At that point, to stay current with Kubernetes, you should already
have migrated.

### What this means for Kubernetes contributors

The motivation here seems pretty clear: get features stable. Guaranteeing that beta
features will be deprecated adds a pretty big incentive so that people who want the
feature continue their effort until the code, documentation and tests are ready for this
feature to graduate to stable, backed by several Kubernetes' releases of evidence in
real-world use.

### What this means for the ecosystem

In my opinion, these harsh-seeming measures make a lot of sense, and are going to be
good for Kubernetes. Deprecating existing APIs, through a rule that applies across all
the different Special Interest Groups (SIGs), helps avoid stagnation and encourages
fixes.

Let's say that an API goes to beta and then real-world experience shows that it
just isn't right - that, fundamentally, the API has shortcomings. With that 9 month
countdown ticking, the people involved have the means and the justification to revise
and release an API that deals with the problem cases. Anyone who wants to live with
the deprecated API is welcome to - Kubernetes is open source - but their needs do not
have to hold up progress on the feature.
