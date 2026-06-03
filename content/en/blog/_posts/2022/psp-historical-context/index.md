---
layout: blog
title: "PodSecurityPolicy: The Historical Context"
date: 2022-08-23T15:00:00-0800
slug: podsecuritypolicy-the-historical-context
evergreen: true
author: >
  Mahé Tardy (Quarkslab)
---

The PodSecurityPolicy (PSP) admission controller has been removed, as of
Kubernetes v1.25. Its deprecation was announced and detailed in the blog post
[PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/),
published for the Kubernetes v1.21 release.

This article aims to provide historical context on the birth and evolution of
PSP, explain why the feature never made it to stable, and show why it was
removed and replaced by Pod Security admission control.

PodSecurityPolicy, like other specialized admission control plugins, provided
fine-grained permissions on specific fields concerning the pod security settings
as a built-in policy API. It acknowledged that cluster administrators and
cluster users are usually not the same people, and that creating workloads in
the form of a Pod or any resource that will create a Pod should not equal being
"root on the cluster". It could also encourage best practices by configuring
more secure defaults through mutation and decoupling low-level Linux security
decisions from the deployment process.

## The birth of PodSecurityPolicy

PodSecurityPolicy originated from OpenShift's SecurityContextConstraints
(SCC) that were in the very first release of the Red Hat OpenShift Container Platform,
even before Kubernetes 1.0. PSP was a stripped-down version of the SCC.

The origin of the creation of PodSecurityPolicy is difficult to track, notably
because it was mainly added before Kubernetes Enhancements Proposal (KEP)
process, when design proposals were still a thing. Indeed, the archive of the final
[design proposal](https://github.com/kubernetes/design-proposals-archive/blob/main/auth/pod-security-policy.md)
is still available. Nevertheless, a [KEP issue number five](https://github.com/kubernetes/enhancements/issues/5) 
was created after the first pull requests were merged.

Before adding the first piece of code that created PSP, two main pull
requests were merged into Kubernetes, a [`SecurityContext` subresource](https://github.com/kubernetes/kubernetes/pull/7343)
that defined new fields on pods' containers, and the first iteration of the [ServiceAccount](https://github.com/kubernetes/kubernetes/pull/7101)
API.

Kubernetes 1.0 was released on 10 July 2015 without any mechanism to restrict the
security context and sensitive options of workloads, other than an alpha-quality
SecurityContextDeny admission plugin (then known as `scdeny`).
The [SecurityContextDeny plugin](/docs/reference/access-authn-authz/admission-controllers/#securitycontextdeny)
is still in Kubernetes today (as an alpha feature) and creates an admission controller that
prevents the usage of some fields in the security context.

The roots of the PodSecurityPolicy were added with
[the very first pull request on security policy](https://github.com/kubernetes/kubernetes/pull/7893),
which added the design proposal with the new PSP object, based on the SCC (Security Context Constraints). It
was a long discussion of nine months, with back and forth from OpenShift's SCC,
many rebases, and the rename to PodSecurityPolicy that finally made it to
upstream Kubernetes in February 2016. Now that the PSP object
had been created, the next step was to add an admission controller that could enforce
these policies. The first step was to add the admission
[without taking into account the users or groups](https://github.com/kubernetes/kubernetes/pull/7893#issuecomment-180410539).
A specific [issue to bring PodSecurityPolicy to a usable state](https://github.com/kubernetes/kubernetes/issues/23217)
was added to keep track of the progress and a first version of the admission
controller was merged in [pull request named PSP admission](https://github.com/kubernetes/kubernetes/pull/24600)
in May 2016. Then around two months later, Kubernetes 1.3 was released.

Here is a timeline that recaps the main pull requests of the birth of the
PodSecurityPolicy and its admission controller with 1.0 and 1.3 releases as
reference points.

{{< figure src="./timeline.svg" alt="Timeline of the PodSecurityPolicy creation pull requests" >}}

After that, the PSP admission controller was enhanced by adding what was initially
left aside. [The authorization mechanism](https://github.com/kubernetes/kubernetes/pull/33080),
merged in early November 2016 allowed administrators to use multiple policies
in a cluster to grant different levels of access for different types of users.
Later, a [pull request](https://github.com/kubernetes/kubernetes/pull/52849)
merged in October 2017 fixed [a design issue](https://github.com/kubernetes/kubernetes/issues/36184)
on ordering PodSecurityPolicies between mutating and alphabetical order, and continued to
build the PSP admission as we know it. After that, many improvements and fixes
followed to build the PodSecurityPolicy feature of recent Kubernetes releases.

## The rise of Pod Security Admission 

Despite the crucial issue it was trying to solve, PodSecurityPolicy presented
some major flaws:

- **Flawed authorization model** - users can create a pod if they have the
  **use** verb on the PSP that allows that pod or the pod's service account has
  the **use** permission on the allowing PSP.
- **Difficult to roll out** - PSP fail-closed. That is, in the absence of a policy,
  all pods are denied. It mostly means that it cannot be enabled by default and
  that users have to add PSPs for all workloads before enabling the feature,
  thus providing no audit mode to discover which pods would not be allowed by
  the new policy. The opt-in model also leads to insufficient test coverage and
  frequent breakage due to cross-feature incompatibility. And unlike RBAC,
  there was no strong culture of shipping PSP manifests with projects.
- **Inconsistent unbounded API** - the API has grown with lots of
  inconsistencies notably because of many requests for niche use cases: e.g.
  labels, scheduling, fine-grained volume controls, etc. It has poor
  composability with a weak prioritization model, leading to unexpected
  mutation priority. It made it really difficult to combine PSP with other
  third-party admission controllers.
- **Require security knowledge** - effective usage still requires an
  understanding of Linux security primitives. e.g. MustRunAsNonRoot +
  AllowPrivilegeEscalation.

The experience with PodSecurityPolicy concluded that most users care for two or three
policies, which led to the creation of the [Pod Security Standards](/docs/concepts/security/pod-security-standards/),
that define three policies:
- **Privileged** - unrestricted policy.
- **Baseline** - minimally restrictive policy, allowing the default pod
  configuration.
- **Restricted** - security best practice policy.

The replacement for PSP, the new [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
is an in-tree, stable for Kubernetes v1.25, admission plugin to enforce these
standards at the namespace level. It makes it easier to enforce basic pod
security without deep security knowledge. For more sophisticated use cases, you
might need a third-party solution that can be easily combined with Pod Security
Admission.

## What's next

For further details on the SIG Auth processes, covering PodSecurityPolicy removal and
creation of Pod Security admission, the
[SIG auth update at KubeCon NA 2019](https://www.youtube.com/watch?v=SFtHRmPuhEw)
and the [PodSecurityPolicy Replacement: Past, Present, and Future](https://www.youtube.com/watch?v=HsRRmlTJpls)
presentation at KubeCon NA 2021 records are available.

Particularly on the PSP removal, the
[PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)
blog post is still accurate.

And for the new Pod Security admission,
[documentation is available](/docs/concepts/security/pod-security-admission/).
In addition, the blog post
[Kubernetes 1.23: Pod Security Graduates to Beta](/blog/2021/12/09/pod-security-admission-beta/)
along with the KubeCon EU 2022 presentation
[The Hitchhiker's Guide to Pod Security](https://www.youtube.com/watch?v=gcz5VsvOYmI)
give great hands-on tutorials to learn.
