---  
layout: blog
title: "Cluster API v1.12: Introducing In-place Updates and Chained Upgrades"
date: 2026-01-27T08:00:00-08:00
slug: cluster-api-v1-12-release
author: >
  Fabrizio Pandini (Broadcom)
---

[Cluster API](https://cluster-api.sigs.k8s.io/) brings declarative management to Kubernetes cluster lifecycle, allowing users and platform teams to define the desired state of clusters and rely on controllers to continuously reconcile toward it.

Similar to how you can use StatefulSets or Deployments in Kubernetes to manage a group of Pods, in Cluster API you can use KubeadmControlPlane to manage a set of control plane Machines, or you can use MachineDeployments to manage a group of worker Nodes.

The [Cluster API v1.12.0](https://github.com/kubernetes-sigs/cluster-api/releases/tag/v1.12.0) release expands what is possible in Cluster API, reducing friction in common lifecycle operations by introducing in-place updates and chained upgrades. 

## Emphasis on simplicity and usability

With v1.12.0, the Cluster API project demonstrates once again that this community is capable of delivering a great amount of innovation, while at the same time minimizing impact for Cluster API users.

What does this mean in practice?

Users simply have to change the [Cluster](https://cluster-api.sigs.k8s.io/user/concepts#cluster) or the [Machine](https://cluster-api.sigs.k8s.io/user/concepts#machine) spec (just as with previous Cluster API releases), and Cluster API will automatically trigger in-place updates or chained upgrades when possible and advisable.

## In-place Updates

Like Kubernetes does for Pods in Deployments, when the [Machine](https://cluster-api.sigs.k8s.io/user/concepts#machine) spec changes also Cluster API performs rollouts by creating a new Machine and deleting the old one.

This approach, inspired by the principle of immutable infrastructure, has a set of considerable advantages:

- It is simple to explain, predictable, consistent and easy to reason about with users and engineers.
- It is simple to implement, because it relies only on two core primitives, create and delete.
- Implementation does not depend on Machine-specific choices, like OS, bootstrap mechanism etc.

As a result, Machine rollouts drastically reduce the number of variables to be considered when managing the lifecycle of a host server that is hosting Nodes.

However, while advantages of immutability are not under discussion, both Kubernetes and Cluster API are undergoing a similar journey, introducing changes that allow users to minimize workload disruption whenever possible.

Over time, also Cluster API has introduced several improvements to immutable rollouts, including:

- Support for [in-place propagation of changes affecting Kubernetes resources only](https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20221003-In-place-propagation-of-Kubernetes-objects-only-changes.md), thus avoiding unnecessary rollouts
- A way to [Taint outdated nodes with PreferNoSchedule](https://github.com/kubernetes-sigs/cluster-api/pull/10223), thus reducing Pod churn by optimizing how Pods are rescheduled during rollouts.
- Support for the delete first rollout strategy, thus making it easier to do immutable rollouts on bare metal / environments with constrained resources.

The new [in-place update](https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20240807-in-place-updates.md) feature in Cluster API is the next step in this journey.

With the v1.12.0 release, Cluster API introduces support for [update extensions](https://cluster-api.sigs.k8s.io/tasks/experimental-features/runtime-sdk/implement-in-place-update-hooks) allowing users to make changes on existing machines in-place, without deleting and re-creating the Machines.

Both KubeadmControlPlane and MachineDeployments support in-place updates based on the new update extension, and this means that the boundary of what is possible in Cluster API is now changed in a significant way.

How do in-place updates work?

The simplest way to explain it is that once the user triggers an update by changing the desired state of Machines, then Cluster API chooses the best tool to achieve the desired state. 

The news is that now Cluster API can choose between immutable rollouts and in-place update extensions to perform required changes.

{{< figure src="in-place.svg" alt="In-place updates in Cluster API" >}}

Importantly, this is not immutable rollouts vs in-place updates; Cluster API considers both valid options and selects the most appropriate mechanism for a given change. 

From the perspective of the Cluster API maintainers, in-place updates are most useful for making changes that don't otherwise require a node drain or pod restart; for example: changing user credentials for the Machine. On the other hand, when the workload will be disrupted anyway, just do a rollout.

Nevertheless, Cluster API remains true to its extensible nature, and everyone can create their own update extension and decide when and how to use in-place updates by trading in some of the benefits of immutable rollouts.

For a deep dive into this feature, make sure to attend the session [In-place Updates with Cluster API: The Sweet Spot Between Immutable and Mutable Infrastructure](https://kccnceu2026.sched.com/event/2CW1r/in-place-updates-with-cluster-api-the-sweet-spot-between-immutable-and-mutable-infrastructure-fabrizio-pandini-stefan-buringer-broadcom?iframe=yes&w=100%&sidebar=yes&bg=no) at KubeCon EU in Amsterdam!  

## Chained Upgrades

[ClusterClass](https://cluster-api.sigs.k8s.io/tasks/experimental-features/cluster-class/) and managed topologies in Cluster API jointly provided a powerful and effective framework that acts as a building block for many platforms offering Kubernetes-as-a-Service.

Now with v1.12.0 this feature is making another important step forward, by allowing users to upgrade by more than one Kubernetes minor version in a single operation, commonly referred to as a [chained upgrade](https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20250513-chained-and-efficient-upgrades-for-clusters-with-managed-topologies.md).

This allows users to declare a target Kubernetes version and let Cluster API safely orchestrate the required intermediate steps, rather than manually managing each minor upgrade.

The simplest way to explain how chained upgrades work, is that once the user triggers an update by changing the desired version for a Cluster, Cluster API computes an upgrade plan, and then starts executing it. Rather than (for example) update the Cluster to v1.33.0 and then v1.34.0 and then v1.35.0, checking on progress at each step, a chained upgrade lets you go directly to v1.35.0.

Executing an upgrade plan means upgrading control plane and worker machines in a strictly controlled order, repeating this process as many times as needed to reach the desired state. The Cluster API is now capable of managing this for you.

Cluster API takes care of optimizing and minimizing the upgrade steps for worker machines, and in fact worker machines will skip upgrades to intermediate Kubernetes minor releases whenever allowed by the Kubernetes version skew policies.

{{< figure src="chained.svg" alt="Chained upgrades in Cluster API" >}}

Also in this case extensibility is at the core of this feature, and [upgrade plan runtime extensions](https://cluster-api.sigs.k8s.io/tasks/experimental-features/runtime-sdk/implement-upgrade-plan-hooks) can be used to influence how the upgrade plan is computed; similarly, [lifecycle hooks](https://cluster-api.sigs.k8s.io/tasks/experimental-features/runtime-sdk/implement-lifecycle-hooks) can be used to automate other tasks that must be performed during an upgrade, e.g. upgrading an addon after the control plane update completed.

From our perspective, chained upgrades are most useful for users that struggle to keep up with Kubernetes minor releases, and e.g. they want to upgrade only once per year and then upgrade by three versions (n-3 → n). But be warned: the fact that you can now easily upgrade by more than one minor version is not an excuse to not patch your cluster frequently!

## Release team

I would like to thank all the contributors, the maintainers, and all the engineers that volunteered for the release team.

The reliability and predictability of Cluster API releases, which is one of the most appreciated features from our users, is only possible with the support, commitment, and hard work of its community.

Kudos to the entire Cluster API community for the v1.12.0 release and all the great releases delivered in 2025!
​​
If you are interested in getting involved, learn about 
[Cluster API contributing guidelines](https://cluster-api.sigs.k8s.io/contributing).

## What’s next?

If you read the [Cluster API manifesto](https://cluster-api.sigs.k8s.io/user/manifesto), you can see how the Cluster API subproject claims the right to remain unfinished, recognizing the need to continuously evolve, improve, and adapt to the changing needs of Cluster API’s users and the broader Cloud Native ecosystem.

As Kubernetes itself continues to evolve, the Cluster API subproject will keep advancing alongside it, focusing on safer upgrades, reduced disruption, and stronger building blocks for platforms managing Kubernetes at scale.

Innovation remains at the heart of Cluster API, stay tuned for an exciting 2026!

---

Useful links:
- [Cluster API](https://cluster-api.sigs.k8s.io/)
- [Cluster API v1.12.0 release](https://github.com/kubernetes-sigs/cluster-api/releases/tag/v1.12.0)
- [In-place update proposal](https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20240807-in-place-updates.md)
- [Chained upgrade proposal](https://github.com/kubernetes-sigs/cluster-api/blob/main/docs/proposals/20250513-chained-and-efficient-upgrades-for-clusters-with-managed-topologies.md)
