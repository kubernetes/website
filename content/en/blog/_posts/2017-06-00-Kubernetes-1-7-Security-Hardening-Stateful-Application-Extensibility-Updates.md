---
title: " Kubernetes 1.7: Security Hardening, Stateful Application Updates and Extensibility "
date: 2017-06-30
slug: kubernetes-1.7-security-hardening-stateful-application-extensibility-updates
url: /blog/2017/06/Kubernetes-1-7-Security-Hardening-Stateful-Application-Extensibility-Updates
author: >
   Aparna Sinha (Google),
   Ihor Dvoretskyi (Mirantis)
---
_This article is by Aparna Sinha and Ihor Dvoretskyi, on behalf of the Kubernetes 1.7 release team._

Today we’re announcing Kubernetes 1.7, a milestone release that adds security, storage and extensibility features motivated by widespread production use of Kubernetes in the most demanding enterprise environments.

At-a-glance, security enhancements in this release include encrypted secrets, network policy for pod-to-pod communication, node authorizer to limit kubelet access and client / server TLS certificate rotation.&nbsp;  

For those of you running scale-out databases on Kubernetes, this release has a major feature that adds automated updates to StatefulSets and enhances updates for DaemonSets. We are also announcing alpha support for local storage and a burst mode for scaling StatefulSets faster.&nbsp;  

Also, for power users, API aggregation in this release allows user-provided apiservers to be served along with the rest of the Kubernetes API at runtime. Additional highlights include support for extensible admission controllers, pluggable cloud providers, and container runtime interface (CRI) enhancements.  

**What’s New**  
Security:  

- [The Network Policy API](/docs/concepts/services-networking/network-policies/) is promoted to stable. Network policy, implemented through a network plug-in, allows users to set and enforce rules governing which pods can communicate with each other.&nbsp;
- [Node authorizer](/docs/reference/access-authn-authz/node/) and admission control plugin are new additions that restrict kubelet’s access to secrets, pods and other objects based on its node.
- [Encryption for Secrets](/docs/tasks/administer-cluster/encrypt-data/), and other resources in etcd, is now available as alpha.&nbsp;
- [Kubelet TLS bootstrapping](/docs/admin/kubelet-tls-bootstrapping/) now supports client and server certificate rotation.
- [Audit logs](/docs/tasks/debug/debug-cluster/audit/) stored by the API server are now more customizable and extensible with support for event filtering and webhooks. They also provide richer data for system audit.

Stateful workloads:  

- [StatefulSet Updates](/docs/tutorials/stateful-application/basic-stateful-set/#updating-statefulsets) is a new beta feature in 1.7, allowing automated updates of stateful applications such as Kafka, Zookeeper and etcd, using a range of update strategies including rolling updates.
- StatefulSets also now support faster scaling and startup for applications that do not require ordering through [Pod Management Policy](/docs/concepts/workloads/controllers/statefulset/#pod-management-policies). This can be a major performance improvement.&nbsp;
- [Local Storage](/docs/concepts/storage/volumes/#local) (alpha) was one of most frequently requested features for stateful applications. Users can now access local storage volumes through the standard PVC/PV interface and via StorageClasses in StatefulSets.
- DaemonSets, which create one pod per node already have an update feature, and in 1.7 have added smart [rollback and history](/docs/tasks/manage-daemon/rollback-daemon-set/) capability.
- A new [StorageOS Volume plugin](/docs/concepts/storage/volumes/#storageos) provides highly-available cluster-wide persistent volumes from local or attached node storage.

Extensibility:  

- [API aggregation](/docs/concepts/api-extension/apiserver-aggregation/) at runtime is the most powerful extensibility features in this release, allowing power users to add Kubernetes-style pre-built, 3rd party or user-created APIs to their cluster.

- [Container Runtime Interface](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md) (CRI) has been enhanced with New RPC calls to retrieve container metrics from the runtime. [Validation tests for the CRI](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/cri-validation.md) have been published and Alpha integration with [containerd](http://containerd.io/), which supports basic pod lifecycle and image management is now available. Read our previous [in-depth post introducing CRI](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes).

Additional Features:  

- Alpha support for [external admission controllers](/docs/reference/access-authn-authz/extensible-admission-controllers/) is introduced, providing two options for adding custom business logic to the API server for modifying objects as they are created and validating policy.&nbsp;
- [Policy-based Federated Resource Placement](/docs/tasks/federation/set-up-placement-policies-federation/) is introduced as Alpha providing placement policies for the federated clusters, based on custom requirements such as regulation, pricing or performance.

Deprecation:&nbsp;  


- Third Party Resource (TPR) has been replaced with Custom Resource Definitions (CRD) which provides a cleaner API, and resolves issues and corner cases that were raised during the beta period of TPR. If you use the TPR beta feature, you are encouraged to [migrate](/docs/tasks/access-kubernetes-api/migrate-third-party-resource/), as it is slated for removal by the community in Kubernetes 1.8.

The above are a subset of the feature highlights in Kubernetes 1.7. For a complete list please visit the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md#v170).  

**Adoption**  
This release is possible thanks to our vast and open community. Together, we’ve already pushed more than 50,000 commits in just three years, and that’s only in the main Kubernetes repo. Additional extensions to Kubernetes are contributed in associated repos bringing overall stability to the project. This velocity makes Kubernetes one of the fastest growing open source projects -- ever.&nbsp;  

Kubernetes adoption has been coming from every sector across the world. Recent user stories from the community include:&nbsp;  


- GolfNow, a member of the NBC Sports Group, migrated their application to Kubernetes giving them better resource utilization and[slashing their infrastructure costs in half](https://kubernetes.io/case-studies/golfnow).
- Bitmovin, provider of video infrastructure solutions, showed us how they’re using Kubernetes to do [multi-stage canary deployments](https://kubernetes.io/blog/2017/04/multi-stage-canary-deployments-with-kubernetes-in-the-cloud-onprem) in the cloud and on-prem.
- Ocado, world’s largest online supermarket, uses Kubernetes to create a distributed data center for their smart warehouses. Read about their full setup [here](http://ocadotechnology.com/blog/creating-a-distributed-data-centre-architecture-using-kubernetes-and-containers/).
- Is Kubernetes helping your team? [Share your story](https://docs.google.com/a/google.com/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform) with the community. See our growing resource of user case studies and learn from great companies like [Box](https://kubernetes.io/case-studies/box) that have adopted Kubernetes in their organization.&nbsp;

Huge kudos and thanks go out to the Kubernetes 1.7 [release team](https://github.com/kubernetes/features/blob/master/release-1.7/release_team.md), led by Dawn Chen of Google.&nbsp;  

**Availability**  
Kubernetes 1.7 is available for [download on GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.7.0). To get started with Kubernetes, try one of the these [interactive tutorials](/docs/tutorials/kubernetes-basics/).&nbsp;  

**Get Involved**  
Join the community at [CloudNativeCon + KubeCon](http://events.linuxfoundation.org/events/cloudnativecon-and-kubecon-north-america) in Austin Dec. 6-8 for the largest Kubernetes gathering ever. [Speaking submissions](http://events.linuxfoundation.org/events/cloudnativecon-and-kubecon-north-america/program/cfp) are open till August 21 and [discounted registration](https://www.regonline.com/registration/Checkin.aspx?EventID=1903774&_ga=2.224109086.464556664.1498490094-1623727562.1496428006) ends October 6.  

The simplest way to get involved is joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/blob/master/communication.md#weekly-meeting), and these channels:  


- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Join the community portal for advocates on [K8sPort](http://k8sport.org/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Connect with the community on [Slack](http://slack.k8s.io/)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform).&nbsp;

Many thanks to our vast community of contributors and supporters in making this and all releases possible.  

