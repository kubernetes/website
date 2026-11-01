---
layout: blog
title: "Announcing the Workload Conformance Working Group"
date: 2026-10-27T04:30:00+00:00
slug: announcing-workload-conformance-wg
canonicalUrl: https://www.kubernetes.dev/blog/2026/10/27/announcing-workload-conformance-wg/
author: >
  [Nabarun Pal](https://github.com/palnabarun) (Broadcom) on behalf of WG Workload Conformance
---

We are excited to announce that the Kubernetes community now has a [Workload Conformance Working Group](https://www.kubernetes.dev/community/community-groups/wg/workload-conformance/).
The working group is writing a shared standard for how [workloads](/docs/concepts/workloads/) behave at runtime on Kubernetes.
To get it right, we need input from the people who build those workloads and from the people who run the clusters they're deployed on.

## Why workloads need a shared standard

[Certified Kubernetes](https://www.cncf.io/training/certification/software-conformance/) tests the cluster, and [Kubernetes AI Conformance](https://github.com/cncf/k8s-ai-conformance) tests whether a cluster can run AI and ML workloads.
Nothing comparable exists for the workloads themselves, so cluster operators still check each application by hand before routine maintenance or a Kubernetes upgrade.

The problems they find are familiar. A routine [node drain](/docs/tasks/administer-cluster/safely-drain-node/) is often how you discover that an application can't tolerate disruption.
An upgrade can break an application that still depends on a [removed API version](/docs/reference/using-api/deprecation-guide/).
Others show up in day-to-day operation: workloads that ask for privileges they don't need, or reserve resources they never use.

Kubernetes already documents much of this, including [security](/docs/concepts/security/) and [handling disruptions](/docs/concepts/workloads/pods/disruptions/).
Even so, every cluster operator ends up repeating the same assessment, and application maintainers get the same questions from each environment they support.
A common specification with repeatable tests would give both groups the same baseline to start from.

## What the working group will deliver

The [charter](https://github.com/kubernetes/community/blob/main/wg-workload-conformance/charter.md) sets out three deliverables:

- A specification of workload behavior for each Kubernetes minor version.
- A method for testing each requirement against a running workload.
- Upstream conformance tooling that implements those tests.

The first step is deciding which workloads and behaviors the specification covers.
The scope includes security, resilience during disruptions, resource use, networking, storage, API usage, and observability, but the group hasn't yet agreed on specific requirements or on how to test them.
However, one rule is already set: every requirement needs an objective test that a test binary can run, so nothing subjective goes into the specification.

The specification covers how a workload runs, and importantly not what it does. Consequently, application logic is out of scope of workload conformance.
The binary won't retest anything [Certified Kubernetes](https://www.cncf.io/training/certification/software-conformance/) already covers, and it won't require a particular workload packaging format, or vendor tool like policy engine, security scanner, etc.

## How the work is organized

Two Special Interest Groups (SIGs) are sponsors for the working group.
- [SIG Architecture](https://www.kubernetes.dev/community/community-groups/sigs/architecture/) will own the specification and tooling through a subproject, which will be created once the first artifacts are proposed by the Working Group.
- [SIG Apps](https://www.kubernetes.dev/community/community-groups/sigs/apps/) will bring the application perspective.

Whenever a requirement touches another Kubernetes SIG's area, such as node behavior or networking, the working group will initiate conversations with those SIGs as well.

The working group is a forum where SIGs can get involved and shape the direction of Workload Conformance while the specification is being written.
We're aiming for a stable first specification and working tests within two to three Kubernetes release cycles.

## Get involved

The specification will and needs to be built from real examples, so we want to hear your experiences.
If you run clusters, tell us how you assess workloads today and what broke during your last upgrade or maintenance window.
If you maintain an application, tell us what it needs from the cluster and where the existing guidance left you guessing.

- Beyond examples, the work needs reviewers for proposed requirements and contributors to write the tests and tooling.
- When early versions of the tests are ready, we also want early testers to run the binary against your own workloads and tell us where the results differ between runs or environments.
- If a requirement touches your SIG's area, help us check its scope and the test behind it.
- And because the subproject will outlive the working group, we're also looking for people who want to maintain it for the long term.

You can find us in [`#wg-workload-conformance`](https://kubernetes.slack.com/messages/wg-workload-conformance) on Kubernetes Slack (visit [slack.k8s.io](https://slack.k8s.io/) for an invitation) and on the [mailing list](https://groups.google.com/a/kubernetes.io/g/wg-workload-conformance).
The working group meets every other Wednesday at 15:00 UTC.
The Zoom link and the agenda are in the [meeting notes](https://docs.google.com/document/d/16GPnmukPqbTkauWb3CtXzA3aEDUXoVKY34gA41YQmPk/edit).
If you want to raise a topic, add it to the agenda.
Joining the mailing list usually adds the meeting invite to your calendar.

Thanks to everyone who reviewed and supported the [working group proposal](https://github.com/kubernetes/community/pull/9139).
