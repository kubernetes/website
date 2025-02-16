---
title: " Kubernetes 1.6: Multi-user, Multi-workloads at Scale "
date: 2017-03-28
slug: kubernetes-1.6-multi-user-multi-workloads-at-scale
url: /blog/2017/03/Kubernetes-1-6-Multi-User-Multi-Workloads-At-Scale
author: >
  Aparna Sinha (Google)
---
_This article is by Aparna Sinha on behalf of the Kubernetes 1.6 release team._

Today we’re announcing the release of Kubernetes 1.6. 

In this release the community’s focus is on scale and automation, to help you deploy multiple workloads to multiple users on a cluster. We are announcing that 5,000 node clusters are supported. We moved dynamic storage provisioning to _stable_. Role-based access control ([RBAC](/docs/reference/access-authn-authz/rbac/)), [kubefed](/docs/tutorials/federation/set-up-cluster-federation-kubefed/), [kubeadm](/docs/getting-started-guides/kubeadm/), and several scheduling features are moving to _beta_. We have also added intelligent defaults throughout to enable greater automation out of the box.  

**What’s New**  

**Scale and Federation** : Large enterprise users looking for proof of at-scale performance will be pleased to know that Kubernetes’ stringent scalability [SLO](https://kubernetes.io/blog/2016/03/1000-nodes-and-beyond-updates-to-Kubernetes-performance-and-scalability-in-12) now supports 5,000 node (150,000 pod) clusters. This 150% increase in total cluster size, powered by a new version of [etcd v3](https://coreos.com/blog/etcd3-a-new-etcd.html) by CoreOS, is great news if you are deploying applications such as search or games which can grow to consume larger clusters.  

For users who want to scale beyond 5,000 nodes or spread across multiple regions or clouds, [federation](/docs/concepts/cluster-administration/federation/) lets you combine multiple Kubernetes clusters and address them through a single API endpoint. In this release, the [kubefed](https://kubernetes.io//docs/tutorials/federation/set-up-cluster-federation-kubefed) command line utility graduated to _beta_ - with improved support for on-premise clusters. kubefed now [automatically configures](https://kubernetes.io//docs/tutorials/federation/set-up-cluster-federation-kubefed.md#kube-dns-configuration) kube-dns on joining clusters and can pass arguments to federated components.  

**Security and Setup** : Users concerned with security will find that [RBAC](/docs/reference/access-authn-authz/rbac), now _beta_ adds a significant security benefit through more tightly scoped default roles for system components. The default RBAC policies in 1.6 grant scoped permissions to control-plane components, nodes, and controllers. RBAC allows cluster administrators to selectively grant particular users or service accounts fine-grained access to specific resources on a per-namespace basis. RBAC users upgrading from 1.5 to 1.6 should view the guidance [here](/docs/reference/access-authn-authz/rbac#upgrading-from-1-5).&nbsp;

Users looking for an easy way to provision a secure cluster on physical or cloud servers can use [kubeadm](/docs/getting-started-guides/kubeadm/), which is now _beta_. kubeadm has been enhanced with a set of command line flags and a base feature set that includes RBAC setup, use of the [Bootstrap Token system](/docs/reference/access-authn-authz/bootstrap-tokens/) and an enhanced [Certificates API](/docs/tasks/tls/managing-tls-in-a-cluster/).  

**Advanced Scheduling** : This release adds a set of [powerful and versatile scheduling constructs](/docs/user-guide/node-selection/) to give you greater control over how pods are scheduled, including rules to restrict pods to particular nodes in heterogeneous clusters, and rules to spread or pack pods across failure domains such as nodes, racks, and zones.  

[Node affinity/anti-affinity](/docs/user-guide/node-selection/#node-affinity-beta-feature), now in _beta_, allows you to restrict pods to schedule only on certain nodes based on node labels. Use built-in or custom node labels to select specific zones, hostnames, hardware architecture, operating system version, specialized hardware, etc. The scheduling rules can be required or preferred, depending on how strictly you want the scheduler to enforce them.  

A related feature, called [taints and tolerations](/docs/user-guide/node-selection/#taints-and-tolerations-beta-feature), makes it possible to compactly represent rules for excluding pods from particular nodes. The feature, also now in _beta_, makes it easy, for example, to dedicate sets of nodes to particular sets of users, or to keep nodes that have special hardware available for pods that need the special hardware by excluding pods that don’t need it.  

Sometimes you want to co-schedule services, or pods within a service, near each other topologically, for example to optimize North-South or East-West communication. Or you want to spread pods of a service for failure tolerance, or keep antagonistic pods separated, or ensure sole tenancy of nodes. [Pod affinity and anti-affinity](/docs/user-guide/node-selection/#inter-pod-affinity-and-anti-affinity-beta-feature), now in _beta_, enables such use cases by letting you set hard or soft requirements for spreading and packing pods relative to one another within arbitrary topologies (node, zone, etc.).  

Lastly, for the ultimate in scheduling flexibility, you can run your own custom scheduler(s) alongside, or instead of, the default Kubernetes scheduler. Each scheduler is responsible for different sets of pods. [Multiple schedulers](/docs/admin/multiple-schedulers/) is _beta_ in this release.&nbsp;  

**Dynamic Storage Provisioning** : Users deploying stateful applications will benefit from the extensive storage automation capabilities in this release of Kubernetes.  

Since its early days, Kubernetes has been able to automatically attach and detach storage, format disk, mount and unmount volumes per the pod spec, and do so seamlessly as pods move between nodes. In addition, the PersistentVolumeClaim (PVC) and PersistentVolume (PV) objects decouple the request for storage from the specific storage implementation, making the pod spec portable across a range of cloud and on-premise environments. In this release [StorageClass](/docs/user-guide/persistent-volumes/#storageclasses) and [dynamic volume provisioning](/docs/user-guide/persistent-volumes/#dynamic) are promoted to _stable_, completing the automation story by creating and deleting storage on demand, eliminating the need to pre-provision.  

The design allows cluster administrators to define and expose multiple flavors of storage within a cluster, each with a custom set of parameters. End users can stop worrying about the complexity and nuances of how storage is provisioned, while still selecting from multiple storage options.  

In 1.6 Kubernetes comes with a set of built-in defaults to completely automate the storage provisioning lifecycle, freeing you to work on your applications. Specifically, Kubernetes now pre-installs system-defined StorageClass objects for AWS, Azure, GCP, OpenStack and VMware vSphere [by default](/docs/tasks/administer-cluster/change-default-storage-class). This gives Kubernetes users on these providers the benefits of dynamic storage provisioning without having to manually setup StorageClass objects. This is a [change in the default behavior](/docs/user-guide/persistent-volumes/index#class-1) of PVC objects on these clouds. Note that default behavior is that dynamically provisioned volumes are created with the “delete” [reclaim policy](/docs/user-guide/persistent-volumes#reclaim-policy). That means once the PVC is deleted, the dynamically provisioned volume is automatically deleted so users do not have the extra step of ‘cleaning up’.  

In addition, we have expanded the range of storage supported overall including:  

- ScaleIO Kubernetes [Volume Plugin](/docs/user-guide/persistent-volumes/index#scaleio) enabling pods to seamlessly access and use data stored on ScaleIO volumes.
- Portworx Kubernetes [Volume Plugin](/docs/user-guide/persistent-volumes/index#portworx-volume) adding the capability to use Portworx as a storage provider for Kubernetes clusters. Portworx pools your server capacity and turns your servers or cloud instances into converged, highly available compute and storage nodes.
- Support for NFSv3, NFSv4, and GlusterFS on clusters using the [COS node image](https://cloud.google.com/container-engine/docs/node-image-migration)&nbsp;
- Support for user-written/run dynamic PV provisioners. A golang library and examples can be found [here](http://github.com/kubernetes-incubator/external-storage).
- _Beta_ support for [mount options](/docs/user-guide/persistent-volumes/index.md#mount-options) in persistent volumes

**Container Runtime Interface, etcd v3 and Daemon set updates** : while users may not directly interact with the container runtime or the API server datastore, they are foundational components for user facing functionality in Kubernetes’. As such the community invests in expanding the capabilities of these and other system components.

- The Docker-CRI implementation is _beta_ and is enabled by default in kubelet. _Alpha_ support for other runtimes, [cri-o](https://github.com/kubernetes-incubator/cri-o/releases/tag/v0.1), [frakti](https://github.com/kubernetes/frakti/releases/tag/v0.1), [rkt](https://github.com/coreos/rkt/issues?q=is%3Aopen+is%3Aissue+label%3Aarea%2Fcri), has also been implemented.
- The default backend storage for the API server has been [upgraded](/docs/admin/upgrade-1-6/) to use [etcd v3](https://coreos.com/blog/etcd3-a-new-etcd.html) by default for new clusters. If you are upgrading from a 1.5 cluster, care should be taken to ensure continuity by planning a data migration window.&nbsp;
- Node reliability is improved as Kubelet exposes an admin configurable [Node Allocatable](https://kubernetes.io//docs/admin/node-allocatable.md#node-allocatable) feature to reserve compute resources for system daemons.
- [Daemon set updates](/docs/tasks/manage-daemon/update-daemon-set) lets you perform rolling updates on a daemon set



**Alpha features** : this release was mostly focused on maturing functionality, however, a few alpha features were added to support the roadmap


- [Out-of-tree cloud provider](/docs/concepts/overview/components#cloud-controller-manager) support adds a new cloud-controller-manager binary that may be used for testing the new out-of-core cloud provider flow
- [Per-pod-eviction](/docs/user-guide/node-selection/#per-pod-configurable-eviction-behavior-when-there-are-node-problems-alpha-feature) in case of node problems combined with tolerationSeconds, lets users tune the duration a pod stays bound to a node that is experiencing problems
- [Pod Injection Policy](/docs/user-guide/pod-preset/) adds a new API resource PodPreset to inject information such as secrets, volumes, volume mounts, and environment variables into pods at creation time.
- [Custom metrics](/docs/user-guide/horizontal-pod-autoscaling/#support-for-custom-metrics) support in the Horizontal Pod Autoscaler changed to use&nbsp;
- Multiple Nvidia [GPU support](https://vishh.github.io/docs/user-guide/gpus/) is introduced with the Docker runtime only



These are just some of the highlights in our first release for the year. For a complete list please visit the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md#v160).  

**Community**  
This release is possible thanks to our vast and open community. Together, we’ve pushed nearly 5,000 commits by some 275 authors. To bring our many advocates together, the community has launched a new program called [K8sPort](http://k8sport.org/), an online hub where the community can participate in gamified challenges and get credit for their contributions. Read more about the program [here](https://kubernetes.io/blog/2017/03/k8sport-engaging-the-kubernetes-community).


**Release Process**

A big thanks goes out to the [release team](https://github.com/kubernetes/features/blob/master/release-1.6/release_team.md) for 1.6 (lead by Dan Gillespie of CoreOS) for their work bringing the 1.6 release to light. This release team is an exemplar of the Kubernetes community’s commitment to community governance. Dan is the first non-Google release manager and he, along with the rest of the team, worked throughout the release (building on the 1.5 release manager, Saad Ali’s, great work) to uncover and document tribal knowledge, shine light on tools and processes that still require special permissions, and prioritize work to improve the Kubernetes release process. Many thanks to the team.



**User Adoption**

We’re continuing to see rapid adoption of Kubernetes in all sectors and sizes of businesses. Furthermore, adoption is coming from across the globe, from a startup in Tennessee, USA to a Fortune 500 company in China.&nbsp;


- JD.com, one of China's largest internet companies, uses Kubernetes in conjunction with their OpenStack deployment. They’ve move 20% of their applications thus far on Kubernetes and are already running 20,000 pods daily. Read more about their setup [here](https://kubernetes.io/blog/2017/02/inside-jd-com-shift-to-kubernetes-from-openstack).&nbsp;
- Spire, a startup based in Tennessee, witnessed their public cloud provider experience an outage, but suffered zero downtime because Kubernetes was able to move their workloads to different zones. Read their full experience [here](https://medium.com/spire-labs/mitigating-an-aws-instance-failure-with-the-magic-of-kubernetes-128a44d44c14).

> _“With Kubernetes, there was never a moment of panic, just a sense of awe watching the automatic mitigation as it happened.”_

- Share your Kubernetes use case story with the community [here](https://docs.google.com/a/google.com/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform).

**Availability**  
Kubernetes 1.6 is available for download [here](https://github.com/kubernetes/kubernetes/releases/tag/v1.6.0) on GitHub and via [get.k8s.io](http://get.k8s.io/). To get started with Kubernetes, try one of the these [interactive tutorials](/docs/tutorials/kubernetes-basics/).&nbsp;  


**Get Involved**  
[CloudNativeCon + KubeCon in Berlin](http://events.linuxfoundation.org/events/cloudnativecon-and-kubecon-europe) is this week March 29-30, 2017. We hope to get together with much of the community and share more there!



Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/blob/master/communication.md#weekly-meeting):&nbsp;

- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)&nbsp;
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Connect with the community on [Slack](http://slack.k8s.io/)

Many thanks for your contributions and advocacy!


_**PS: read this [series of in-depth articles](https://kubernetes.io/blog/2017/03/five-days-of-kubernetes-1-6) on what's new in Kubernetes 1.6**_
