---
layout: blog
title: 'Kubernetes v1.26: CPUManager goes GA'
date: 2022-12-27
slug: cpumanager-ga
author: >
  Francesco Romani (Red Hat)
---

The CPU Manager is a part of the kubelet, the Kubernetes node agent, which enables the user to allocate exclusive CPUs to containers.
Since Kubernetes v1.10, where it [graduated to Beta](/blog/2018/07/24/feature-highlight-cpu-manager/), the CPU Manager proved itself reliable and
fulfilled its role of allocating exclusive CPUs to containers, so adoption has steadily grown making it a staple component of performance-critical
and low-latency setups.  Over time, most changes were about bugfixes or internal refactoring, with the following noteworthy user-visible changes:

- [support explicit reservation of CPUs](https://github.com/Kubernetes/Kubernetes/pull/83592): it was already possible to request to reserve a given
  number of CPUs for system resources, including the kubelet itself, which will not be used for exclusive CPU allocation. Now it is possible to also
  explicitly select which CPUs to reserve instead of letting the kubelet pick them up automatically.
- [report the exclusively allocated CPUs](https://github.com/Kubernetes/Kubernetes/pull/97415) to containers, much like is already done for devices,
  using the kubelet-local [PodResources API](/docs/concepts/extend-Kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).
- [optimize the usage of system resources](https://github.com/Kubernetes/Kubernetes/pull/101771), eliminating unnecessary sysfs changes.

The CPU Manager reached the point on which it "just works", so in Kubernetes v1.26 it has graduated to generally available (GA).

## Customization options for CPU Manager {#cpu-managed-customization}

The CPU Manager supports two operation modes, configured using its _policies_. With the `none` policy, the CPU Manager allocates CPUs to containers
without any specific constraint except the (optional) quota set in the Pod spec.
With the `static` policy, then provided that the pod is in the Guaranteed QoS class and every container in that Pod requests an integer amount of vCPU cores,
then the CPU Manager allocates CPUs exclusively. Exclusive assignment means that other containers (whether from the same Pod, or from a different Pod) do not
get scheduled onto that CPU.

This simple operational model served the user base pretty well, but as the CPU Manager matured more and more, users started to look at more elaborate use
cases and how to better support them.

Rather than add more policies, the community realized that pretty much all the novel use cases are some variation of the behavior enabled by the `static`
CPU Manager policy. Hence, it was decided to add [options to tune the behavior of the static policy](https://github.com/Kubernetes/enhancements/tree/master/keps/sig-node/2625-cpumanager-policies-thread-placement#proposed-change).
The options have a varying degree of maturity, like any other Kubernetes feature, and in order to be accepted, each new option provides a backward
compatible behavior when disabled, and to document how to interact with each other, should they interact at all.

This enabled the Kubernetes project to graduate to GA the CPU Manager core component and core CPU allocation algorithms to GA,
while also enabling a new age of experimentation in this area.
In Kubernetes v1.26, the CPU Manager supports [three different policy options](/docs/tasks/administer-cluster/cpu-management-policies#static-policy-options):

`full-pcpus-only`
: restrict the CPU Manager core allocation algorithm to full physical cores only, reducing noisy neighbor issues from hardware technologies that allow sharing cores.

`distribute-cpus-across-numa`
: drive the CPU Manager to evenly distribute CPUs across NUMA nodes, for cases where more than one NUMA node is required to satisfy the allocation.

`align-by-socket`
: change how the CPU Manager allocates CPUs to a container:  consider CPUs to be aligned at the socket boundary, instead of NUMA node boundary.

## Further development

After graduating the main CPU Manager feature, each existing policy option will follow their graduation process, independent from CPU Manager and from each other option.
There is room for new options to be added, but there's also a growing demand for even more flexibility than what the CPU Manager, and its policy options, currently grant.

Conversations are in progress in the community about splitting the CPU Manager and the other resource managers currently part of the kubelet executable
into pluggable, independent kubelet plugins. If you are interested in this effort, please join the conversation on SIG Node communication channels (Slack, mailing list, weekly meeting).

## Further reading

Please check out the [Control CPU Management Policies on the Node](/docs/tasks/administer-cluster/cpu-management-policies/)
task page to learn more about the CPU Manager, and how it fits in relation to the other node-level resource managers.

## Getting involved

This feature is driven by the [SIG Node](https://github.com/Kubernetes/community/blob/master/sig-node/README.md) community.
Please join us to connect with the community and share your ideas and feedback around the above feature and
beyond. We look forward to hearing from you!
