---
title: "Kubernetes 1.3: Bridging Cloud Native and Enterprise Workloads"
date: 2016-07-06
slug: kubernetes-1.3-bridging-cloud-native-and-enterprise-workloads
url: /blog/2016/07/Kubernetes-1-3-Bridging-Cloud-Native-And-Enterprise-Workloads
evergreen: true
author: >
  Aparna Sinha (Google)
---

Nearly two years ago, when we officially kicked off the Kubernetes project, we wanted to simplify distributed systems management and provide the core technology required to everyone. The community’s response to this effort has blown us away. Today, thousands of customers, partners and developers are running clusters in production using Kubernetes and have joined the cloud native revolution.&nbsp;  

Thanks to the help of over 800 contributors, we are pleased to announce today the availability of Kubernetes 1.3, our most robust and feature-rich release to date.  

As our users scale their production deployments we’ve heard a clear desire to deploy services across cluster, zone and cloud boundaries. We’ve also heard a desire to run more workloads in containers, including stateful services. In this release, we’ve worked hard to address these two problems, while making it easier for new developers and enterprises to use Kubernetes to manage distributed systems at scale.  

Product highlights in Kubernetes 1.3 include the ability to bridge services across multiple clouds (including on-prem), support for multiple node types, integrated support for stateful services (such as key-value stores and databases), and greatly simplified cluster setup and deployment on your laptop. Now, developers at organizations of all sizes can build production scale apps more easily than ever before.  



## What’s new

- **Increased scale and automation** - Customers want to scale their services up and down automatically in response to application demand. In 1.3 we have made it easier to autoscale clusters up and down while doubling the maximum number of nodes per cluster. Customers no longer need to think about cluster size, and can allow the underlying cluster to respond to demand.

- **Cross-cluster federated services** - Customers want their services to span one or more (possibly remote) clusters, and for them to be reachable in a consistent manner from both within and outside their clusters. Services that span clusters have higher availability, provide geographic distribution and enable hybrid and multi-cloud scenarios. Kubernetes 1.3 introduces cross-cluster service discovery so containers, and external clients can consistently resolve to services irrespective of whether they are running partially or completely in other clusters.

- **Stateful applications** - Customers looking to use containers for stateful workloads (such as databases or key value stores) will find a new ‘PetSet’ object with raft of alpha features, including:

  - Permanent hostnames that persist across restarts
  - Automatically provisioned persistent disks per container that live beyond the life of a container
  - Unique identities in a group to allow for clustering and leader election
  - Initialization containers which are critical for starting up clustered applications
- **Ease of use for local development** - Developers want an easy way to learn to use Kubernetes. In Kubernetes 1.3 we are introducing [Minikube](https://github.com/kubernetes/minikube), where with one command a developer can start a local Kubernetes cluster on their laptop that is API compatible with a full Kubernetes cluster. This enable developers to test locally, and push to their Kubernetes clusters when they are ready.
- **Support for rkt and container standards OCI & CNI** - Kubernetes is an extensible and modular orchestration platform. Part of what has made Kubernetes successful is our commitment to giving customers access to the latest container technologies that best suit their environment. In Kubernetes 1.3 we support emerging standards such as the Container Network Interface ([CNI](https://github.com/containernetworking/cni)) natively, and have already taken steps to the Open Container Initiative ([OCI](https://github.com/opencontainers)), which is still being ratified. We are also introducing [rkt](https://github.com/coreos/rkt) as an alternative container runtime in Kubernetes node, with a first-class integration between rkt and the kubelet. This allows Kubernetes users to take advantage of some of rkt's unique features.
- **Updated Kubernetes dashboard UI** - Customers can now use the Kubernetes open source dashboard for the majority of interactions with their clusters, rather than having to use the CLI. The updated UI lets users control, edit and create all workload resources (including Deployments and PetSets).
- And many more. For a complete list of updates, see the [_release notes on GitHub_](https://github.com/kubernetes/kubernetes/releases/tag/v1.3.0).

## Community

We could not have achieved this milestone without the tireless effort of countless people that are part of the Kubernetes community. We have [19 different Special Interest Groups](https://github.com/kubernetes/community/blob/master/README.md#special-interest-groups-sig), and over 100 meetups around the world. Kubernetes is a community project, built in the open, and it truly would not be possible without the over 233 person-years of effort the community has put in to date. Woot!



## Availability

Kubernetes 1.3 is available for download at [get.k8s.io](http://get.k8s.io/)&nbsp;and via the open source repository hosted on [GitHub](http://github.com/kubernetes/kubernetes). To get started with Kubernetes try our [Hello World app](/docs/hellonode/).



To learn the latest about the project, we encourage everyone to [join the weekly community meeting](https://groups.google.com/forum/#!forum/kubernetes-community-video-chat) or [watch a recorded hangout](https://www.youtube.com/playlist?list=PL69nYSiGNLP1pkHsbPjzAewvMgGUpkCnJ).&nbsp;



## Connect

We’d love to hear from you and see you participate in this growing community:

- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)&nbsp;
- Post questions (or answer questions) on [Stackoverflow](https://stackoverflow.com/questions/tagged/kubernetes)&nbsp;
- Connect with the community on [Slack](http://slack.kubernetes.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates



Thank you for your support!
