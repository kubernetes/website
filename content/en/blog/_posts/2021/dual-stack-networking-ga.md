---
layout: blog
title: 'Kubernetes 1.23: Dual-stack IPv4/IPv6 Networking Reaches GA'
date: 2021-12-08
slug: dual-stack-networking-ga
author: >
   Bridget Kromhout (Microsoft)
---

"When will Kubernetes have IPv6?" This question has been asked with increasing frequency ever since alpha support for IPv6 was first added in k8s v1.9. While Kubernetes has supported IPv6-only clusters since v1.18, migration from IPv4 to IPv6 was not yet possible at that point. At long last, [dual-stack IPv4/IPv6 networking](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/563-dual-stack/) has reached general availability (GA) in Kubernetes v1.23.

What does dual-stack networking mean for you? Let’s take a look…


## Service API updates

[Services](/docs/concepts/services-networking/service/) were single-stack before 1.20, so using both IP families meant creating one Service per IP family. The user experience was simplified in 1.20, when Services were re-implemented to allow both IP families, meaning a single Service can handle both IPv4 and IPv6 workloads. Dual-stack load balancing is possible between services running any combination of IPv4 and IPv6.

The Service API now has new fields to support dual-stack, replacing the single ipFamily field.
* You can select your choice of IP family by setting `ipFamilyPolicy` to one of three options: SingleStack, PreferDualStack, or RequireDualStack. A service can be changed between single-stack and dual-stack (within some limits).
* Setting `ipFamilies` to a list of families assigned allows you to set the order of families used.
* `clusterIPs` is inclusive of the previous `clusterIP` but allows for multiple entries, so it’s no longer necessary to run duplicate services, one in each of the two IP families. Instead, you can assign cluster IP addresses in both IP families.

Note that Pods are also dual-stack. For a given pod, there is no possibility of setting multiple IP addresses in the same family.


## Default behavior remains single-stack


Starting in 1.20 with the re-implementation of dual-stack services as alpha, the underlying networking for Kubernetes has included dual-stack whether or not a cluster was configured with the feature flag to enable dual-stack.

Kubernetes 1.23 removed that feature flag as part of graduating the feature to stable. Dual-stack networking is always available if you want to configure it. You can set your cluster network to operate as single-stack IPv4, as single-stack IPv6, or as dual-stack IPv4/IPv6.

While Services are set according to what you configure, Pods default to whatever the CNI plugin sets. If your CNI plugin assigns single-stack IPs, you will have single-stack unless `ipFamilyPolicy` specifies PreferDualStack or RequireDualStack. If your CNI plugin assigns dual-stack IPs, `pod.status.PodIPs` defaults to dual-stack.

Even though dual-stack is possible, it is not mandatory to use it. Examples in the documentation show the variety possible in [dual-stack service configurations](/docs/concepts/services-networking/dual-stack/#dual-stack-service-configuration-scenarios).


## Try dual-stack right now

While upstream Kubernetes now supports [dual-stack networking](/docs/concepts/services-networking/dual-stack/) as a GA or stable feature, each provider’s support of dual-stack Kubernetes may vary. Nodes need to be provisioned with routable IPv4/IPv6 network interfaces. Pods need to be dual-stack. The [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) is what assigns the IP addresses to the Pods, so it's the network plugin being used for the cluster that needs to support dual-stack. Some Container Network Interface (CNI) plugins support dual-stack, as does kubenet.

Ecosystem support of dual-stack is increasing; you can create [dual-stack clusters with kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/), try a [dual-stack cluster locally with KIND](https://kind.sigs.k8s.io/docs/user/configuration/#ip-family), and deploy dual-stack clusters in cloud providers (after checking docs for CNI or kubenet availability).

## Get involved with SIG Network

SIG-Network wants to learn from community experiences with dual-stack networking to find out more about evolving needs and your use cases. The [SIG-network update video from KubeCon NA 2021](https://www.youtube.com/watch?v=uZ0WLxpmBbY&list=PLj6h78yzYM2Nd1U4RMhv7v88fdiFqeYAP&index=4) summarizes the SIG’s recent updates, including dual-stack going to stable in 1.23.

The current SIG-Network [KEPs](https://github.com/orgs/kubernetes/projects/10) and [issues](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Asig%2Fnetwork) on GitHub illustrate the SIG’s areas of emphasis. The [dual-stack API server](https://github.com/kubernetes/enhancements/issues/2438) is one place to consider contributing.

[SIG-Network meetings](https://github.com/kubernetes/community/tree/master/sig-network#meetings) are a friendly, welcoming venue for you to connect with the community and share your ideas. Looking forward to hearing from you!

## Acknowledgments

The dual-stack networking feature represents the work of many Kubernetes contributors. Thanks to all who contributed code, experience reports, documentation, code reviews, and everything in between. Bridget Kromhout details this community effort in [Dual-Stack Networking in Kubernetes](https://containerjournal.com/features/dual-stack-networking-in-kubernetes/). KubeCon keynotes by Tim Hockin & Khaled (Kal) Henidak in 2019 ([The Long Road to IPv4/IPv6 Dual-stack Kubernetes](https://www.youtube.com/watch?v=o-oMegdZcg4)) and by Lachlan Evenson in 2021 ([And Here We Go: Dual-stack Networking in Kubernetes](https://www.youtube.com/watch?v=lVrt8F2B9CM)) talk about the dual-stack journey, spanning five years and a great many lines of code.

