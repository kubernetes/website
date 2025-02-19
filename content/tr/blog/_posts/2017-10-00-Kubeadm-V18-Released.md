---
title: "  kubeadm v1.8 Released: Introducing Easy Upgrades for Kubernetes Clusters "
date: 2017-10-25
slug: kubeadm-v18-released
url: /blog/2017/10/Kubeadm-V18-Released
author: >
  Lucas Käldström (Weaveworks)
---
_**Editor's note:** this post is part of a [series of in-depth articles](/blog/2017/10/five-days-of-kubernetes-18) on what's new in Kubernetes 1.8._

Since its debut in [September 2016](https://kubernetes.io/blog/2016/09/how-we-made-kubernetes-easy-to-install), the Cluster Lifecycle Special Interest Group (SIG) has established kubeadm as the easiest Kubernetes bootstrap method. Now, we’re releasing kubeadm v1.8.0 in tandem with the release of [Kubernetes v1.8.0](https://kubernetes.io/blog/2017/09/kubernetes-18-security-workloads-and). In this blog post, I’ll walk you through the changes we’ve made to kubeadm since the last update, the scope of kubeadm, and how you can contribute to this effort.  


## Security first: kubeadm v1.6 & v1.7
Previously, we discussed [planned updates for kubeadm v1.6](https://kubernetes.io/blog/2017/01/stronger-foundation-for-creating-and-managing-kubernetes-clusters). Our primary focus for v1.6 was security. We started enforcing role based access control (RBAC) as it graduated to beta, gave unique identities and locked-down privileges for different system components in the cluster, disabled the insecure `localhost:8080` API server port, started authorizing all API calls to the kubelets, and [improved the token discovery](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/cluster-lifecycle/bootstrap-discovery.md) method used formerly in v1.5. Token discovery (aka Bootstrap Tokens) graduated to beta in v1.8.  

In number of features, kubeadm v1.7.0 was a much smaller release compared to v1.6.0 and v1.8.0. The main additions were enforcing [the Node Authorizer](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/node/kubelet-authorizer.md), which significantly reduces the attack surface for a Kubernetes cluster, and initial, limited upgrading support from v1.6 clusters.  


## Easier upgrades, extensibility, and stabilization in v1.8

We had eight weeks between Kubernetes v1.7.0 and our stabilization period (code freeze) to implement new features and to stabilize the upcoming v1.8.0 release. Our goal for kubeadm v1.8.0 was to make it more extensible. We wanted to add a lot of new features and improvements in this cycle, and we succeeded.Upgrades along with better introspectability. The most important update in kubeadm v1.8.0 (and my favorite new feature) is **one-command upgrades** of the control plane. While v1.7.0 had the ability to upgrade clusters, the user experience was far from optimal, and the process was risky.  

Now, you can easily check to see if your system can handle an upgrade by entering:  



 ```  
$ kubeadm upgrade plan
  ```


This gives you information about which versions you can upgrade to, as well as the health of your cluster.  

You can examine the effects an upgrade will have on your system by specifying the --dry-run flag. In previous versions of kubeadm, upgrades were essentially blind in that you could only make assumptions about how an upgrade would impact your cluster. With the new dry run feature, there is no more mystery. You can see exactly what applying an upgrade would do before applying it.  

After checking to see how an upgrade will affect your cluster, you can apply the upgrade by typing:  



 ```  
$ kubeadm upgrade apply v1.8.0
  ```


This is a much cleaner and safer way of performing an upgrade than the previous version. As with any type of upgrade or downgrade, it’s a good idea to backup your cluster first using your preferred solution.  


## Self-hosting
Self-hosting in this context refers to a specific way of setting up the control plane. The self-hosting concept was initially developed by CoreOS in their [bootkube](https://github.com/kubernetes-incubator/bootkube) project. The long-term goal is to move this functionality (currently in an alpha stage) to the generic kubeadm toolbox. Self-hosting means that the control plane components, the API Server, Controller Manager and Scheduler are workloads themselves in the cluster they run. This means the control plane components can be managed using Kubernetes primitives, which has numerous advantages. For instance, leader-elected components like the scheduler and controller-manager will automatically be run on all masters when HA is implemented if they are run in a DaemonSet. Rolling upgrades in Kubernetes can be used for upgrades of the control plane components, and next to no extra code has to be written for that to work; it’s one of Kubernetes’ built-in primitives!  

Self-hosting won’t be the default until v1.9.0, but users can easily test the feature in experimental clusters. If you test this feature, we’d love your feedback!  

You can test out self-hosting by enabling its feature gate:  


 ```  
$ kubeadm init --feature-gates=SelfHosting=true
  ```



## Extensibility
We’ve added some new extensibility features. You can delegate some tasks, like generating certificates or writing control plane arguments to kubeadm, but still drive the control plane bootstrap process yourself. Basically, you can let kubeadm do some parts and fill in yourself where you need customizations. Previously, you could only use kubeadm init to perform “the full meal deal.” The inclusion of the kubeadm alpha phase command supports our aim to make kubeadm more modular, letting you invoke atomic sub-steps of the bootstrap process.  

In v1.8.0, kubeadm alpha phase is just that: an alpha preview. We hope that we can graduate the command to beta as kubeadm phase in v1.9.0. We can’t wait for feedback from the community on how to better improve this feature!  


## Improvements
Along with our new kubeadm features, we’ve also made improvements to existing ones. The Bootstrap Token feature that makes `kubeadm join` so short and sweet has graduated from alpha to beta and gained even more security features.  

If you made customizations to your system in v1.6 or v1.7, you had to remember what those customizations were when you upgraded your cluster. No longer: beginning with v1.8.0, kubeadm uploads your configuration to a ConfigMap inside of the cluster, and later reads that configuration when upgrading for a seamless user experience.  

The first certificate rotation feature has graduated to beta in v1.8, which is great to see. Thanks to the [Auth Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-auth), the Kubernetes node component kubelet can now [rotate its client certificate](https://github.com/kubernetes/features/issues/266) automatically. We expect this area to improve continuously, and will continue to be a part of this cross-SIG effort to easily rotate all certificates in any cluster.  

Last but not least, kubeadm is more resilient now. kubeadm init will detect even more faulty environments earlier, and time out instead of waiting forever for the expected condition.  


## The scope of kubeadm
As there are so many different end-to-end installers for Kubernetes, there is some fragmentation in the ecosystem. With each new release of Kubernetes, these installers naturally become more divergent. This can create problems down the line if users rely on installer-specific variations and hooks that aren’t standardized in any way. Our goal from the beginning has been to make kubeadm a building block for deploying Kubernetes clusters and to provide kubeadm init and kubeadm join as best-practice “fast paths” for new Kubernetes users. Ideally, using kubeadm as the basis of all deployments will make it easier to create conformant clusters.  

kubeadm performs the actions necessary to get a minimum viable cluster up and running. It only cares about bootstrapping, not about provisioning machines, by design. Likewise, installing various nice-to-have addons by default like the [Kubernetes Dashboard](https://github.com/kubernetes/dashboard), some monitoring solution, cloud provider-specific addons, etc. is not in scope. Instead, we expect higher-level and more tailored tooling to be built on top of kubeadm, that installs the software the end user needs.  


## v1.9.0 and beyond
What’s in store for the future of kubeadm?  


#### Planned features
We plan to address high availability (replicated etcd and multiple, redundant API servers and other control plane components) as an alpha feature in v1.9.0. This has been a regular request from our user base.  

Also, we want to make self-hosting the default way to deploy your control plane: Kubernetes becomes much easier to manage if we can rely on Kubernetes' own tools to manage the cluster components.  


#### Promoting kubeadm adoption and getting involved
The [kubeadm adoption working group](https://github.com/kubernetes/community/tree/master/wg-kubeadm-adoption) is an ongoing effort between SIG Cluster Lifecycle and other parties in the Kubernetes ecosystem. This working group focuses on making kubeadm more extensible in order to promote adoption of it for other end-to-end installers in the community. Everyone is welcome to join. So far, we’re glad to announce that [kubespray](https://github.com/kubernetes-incubator/kubespray) started using kubeadm under the hood, and gained new features at the same time! We’re excited to see others follow and make the ecosystem stronger.  

kubeadm is a great way to learn about Kubernetes: it binds all of Kubernetes’ components together in a single package. To learn more about what kubeadm really does under the hood, [this document](https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.8.md) describes kubeadm functions in v1.8.0.  

If you want to get involved in these efforts, join SIG Cluster Lifecycle. We [meet on Zoom](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle) once a week on Tuesdays at 16:00 UTC. For more information about what we talk about in our weekly meetings, [check out our meeting notes](https://docs.google.com/document/d/1deJYPIF4LmhGjDVaqrswErIrV7mtwJgovtLnPCDxP7U/edit#). Meetings are a great educational opportunity, even if you don’t want to jump in and present your own ideas right away. You can also sign up for our [mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle), join our [Slack channel,](https://kubernetes.slack.com/messages/sig-cluster-lifecycle) [o](https://kubernetes.slack.com/messages/sig-cluster-lifecycle)r check out the [video archive](https://www.youtube.com/playlist?list=PL69nYSiGNLP29D0nYgAGWt1ZFqS9Z7lw4&disable_polymer=true) of our past mee[t](https://kubernetes.slack.com/messages/sig-cluster-lifecycle)i[n](https://kubernetes.slack.com/messages/sig-cluster-lifecycle)g[s](https://kubernetes.slack.com/messages/sig-cluster-lifecycle). Even if you’re only interested in watching the video calls initially, we’re excited to welcome you as a new member to SIG Cluster Lifecycle!  

If you want to know what a kubeadm developer does at a given time in the Kubernetes release cycle, check out [this doc](https://github.com/kubernetes/kubeadm/blob/master/docs/release-cycle.md). Finally, don’t hesitate to join if any of our upcoming projects are of interest to you!  

