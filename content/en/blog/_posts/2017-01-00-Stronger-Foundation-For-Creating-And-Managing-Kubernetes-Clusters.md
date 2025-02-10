---
title: " A Stronger Foundation for Creating and Managing Kubernetes Clusters "
date: 2017-01-12
slug: stronger-foundation-for-creating-and-managing-kubernetes-clusters
url: /blog/2017/01/Stronger-Foundation-For-Creating-And-Managing-Kubernetes-Clusters
author: >
   [Lucas Käldström](https://twitter.com/kubernetesonarm) (independent)
---
Last time you heard from us was in September, when we announced [kubeadm](https://kubernetes.io/blog/2016/09/how-we-made-kubernetes-easy-to-install). The work on making kubeadm a first-class citizen in the Kubernetes ecosystem has continued and evolved. Some of us also met before KubeCon and had a very productive meeting where we talked about what the scopes for our SIG, kubeadm, and kops are.&nbsp;  

**Continuing to Define SIG-Cluster-Lifecycle**  

**What is the scope for kubeadm?**  
We want kubeadm to be a common set of building blocks for all Kubernetes deployments; the piece that provides secure and recommended ways to bootstrap Kubernetes. Since there is no one true way to setup Kubernetes, kubeadm will support more than one method for each phase. We want to identify the phases every deployment of Kubernetes has in common and make configurable and easy-to-use kubeadm commands for those phases. If your organization, for example, requires that you distribute the certificates in the cluster manually or in a custom way, skip using kubeadm just for that phase. We aim to keep kubeadm usable for all other phases in that case. We want you to be able to pick which things you want kubeadm to do and let you do the rest yourself.  

Therefore, the scope for kubeadm is to be easily extendable, modular and very easy to use. Right now, with this v1.5 release we have, kubeadm can only do the “full meal deal” for you. In future versions that will change as kubeadm becomes more componentized, while still leaving the opportunity to do everything for you. But kubeadm will still only handle the bootstrapping of Kubernetes; it won’t ever handle provisioning of machines for you since that can be done in many more ways. In addition, we want kubeadm to work everywhere, even on multiple architectures, therefore we built in [multi-architecture support](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/multi-platform.md) from the beginning.  

**What is the scope for kops?**  
The scope for [kops](https://github.com/kubernetes/kops) is to automate full cluster operations: installation, reconfiguration of your cluster, upgrading kubernetes, and eventual cluster deletion. kops has a rich configuration model based on the Kubernetes API Machinery, so you can easily customize some parameters to your needs. kops (unlike kubeadm) handles provisioning of resources for you. kops aims to be the ultimate out-of-the-box experience on AWS (and perhaps other providers in the future). In the future kops will be adopting more and more of kubeadm for the bootstrapping phases that exist. This will move some of the complexity inside kops to a central place in the form of kubeadm.  

**What is the scope for SIG-Cluster-Lifecycle?**  
The [SIG-Cluster-Lifecycle](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle) actively tries to simplify the Kubernetes installation and management story. This is accomplished by modifying Kubernetes itself in many cases, and factoring out common tasks. We are also trying to address common problems in the cluster lifecycle (like the name says!). We maintain and are responsible for kubeadm and kops. We discuss problems with the current way to bootstrap clusters on AWS (and beyond) and try to make it easier. We hangout on Slack in the [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/) and #kubeadm channels. [We meet and discuss](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle) current topics once a week on Zoom. Feel free to come and say hi! Also, don’t be shy to [contribute](https://github.com/kubernetes/kubeadm/issues); we’d love your comments and insight!  

**Looking forward to v1.6**  

Our goals for v1.6 are centered around refactoring, stabilization and security.&nbsp;  

First and foremost, we want to get kubeadm and its composable configuration experience to beta. We will refactor kubeadm so each phase in the bootstrap process is invokable separately. We want to bring the TLS Bootstrap API, the Certificates API and the ComponentConfig API to beta, and to get kops (and other tools) using them.&nbsp;  

We will also graduate the token discovery we’re using now (aka. the gcr.io/google\_containers/kube-discovery:1.0 image) to beta by adding a new controller to the controller manager: the [BootstrapSigner](https://github.com/kubernetes/kubernetes/pull/36101). Using tokens managed as Secrets, that controller will sign the contents (a kubeconfig file) of a well known ConfigMap in a new kube-public namespace. This object will be available to unauthenticated users in order to enable a secure bootstrap with a simple and short shared token.You can read the full proposal [here](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/cluster-lifecycle/bootstrap-discovery.md).  

In addition to making it possible to invoke phases separately, we will also add a new phase for bringing up the control plane in a self-hosted mode (as opposed to the current static pod technique). The self-hosted technique was developed by CoreOS in the form of [bootkube](https://github.com/kubernetes-incubator/bootkube), and will now be incorporated as an alternative into an official Kubernetes product. Thanks to CoreOS for pushing that paradigm forward! This will be done by first setting up a temporary control plane with static pods, injecting the Deployments, ConfigMaps and DaemonSets as necessary, and lastly turning down the temporary control plane. For now, etcd will still be in a static pod by default.&nbsp;  

We are supporting self hosting, initially, because we want to support doing patch release upgrades with kubeadm. It should be easy to upgrade from v1.6.2 to v1.6.4 for instance. We consider the built-in upgrade support a critical capability for a real cluster lifecycle tool. It will still be possible to upgrade without self-hosting but it will require more manual work.  

On the stabilization front, we want to start running kubeadm e2e tests. In this v1.5 timeframe, we added unit tests and we will continue to increase that coverage. We want to expand this to per-PR e2e tests as well that spin up a cluster with _kubeadm init_ and _kubeadm join_; runs some kubeadm-specific tests and optionally the Conformance test suite.  

Finally, on the security front, we also want to kubeadm to be as secure as possible by default. We look to enable RBAC for v1.6, lock down what kubelet and built-in services like kube-dns and kube-proxy can do, and maybe create specific user accounts that have different permissions.  

Regarding releasing, we want to have the official kubeadm v1.6 binary in the kubernetes v1.6 tarball. This means syncing our release with the official one. More details on what we’ve done so far can be found [here](https://groups.google.com/d/msg/kubernetes-sig-cluster-lifecycle/P2oh5iHWBsA/ePeoil78BAAJ). As it becomes possible, we aim to move the kubeadm code out to the kubernetes/kubeadm repo (This is blocked on some Kubernetes code-specific infrastructure issues that may take some time to resolve.)  

Nice-to-haves for v1.6 would include an official CoreOS Container Linux installer container that does what the debs/rpms are doing for Ubuntu/CentOS. In general, it would be nice to extend the distro support. We also want to adopt [Kubelet Dynamic Settings](https://github.com/kubernetes/kubernetes/pull/29459) so configuration passed to kubeadm init flows down to nodes automatically (it requires manual configuration currently). We want it to be possible to test Kubernetes from HEAD by using kubeadm.  

**Through 2017 and beyond**  

Apart from everything mentioned above, we want kubeadm to simply be a production grade (GA) tool you can use for bootstrapping a Kubernetes cluster. We want HA/multi-master to be much easier to achieve generally than it is now across platforms (though kops makes this easy on AWS today!). We want cloud providers to be out-of-tree and installable separately. _kubectl apply -f my-cloud-provider-here.yaml_ should just work. The documentation should be more robust and should go deeper. Container Runtime Interface (CRI) and Federation should work well with kubeadm. Outdated getting started guides should be removed so new users aren’t mislead.  

**Refactoring the cloud provider integration plugins**  
Right now, the cloud provider integrations are built into the controller-manager, the kubelet and the API Server. This combined with the ever-growing interest for Kubernetes makes it unmaintainable to have the cloud provider integrations compiled into the core. Features that are clearly vendor-specific should not be a part of the core Kubernetes project, rather available as an addon from third party vendors. Everything cloud-specific should be moved into one controller, or a few if there’s need. This controller will be maintained by a third-party (usually the company behind the integration) and will implement cloud-specific features. This migration from in-core to out-of-core is disruptive yes, but it has very good side effects: leaner core, making it possible for more than the seven existing clouds to be integrated with Kubernetes and much easier installation. For example, you could run the cloud controller binary in a Deployment and install it with _kubectl apply_ easily.  

The plan for v1.6 is to make it possible to:  


- Create and run out-of-core cloud provider integration controllers
- Ship a new and temporary binary in the Kubernetes release: the cloud-controller-manager. This binary will include the seven existing cloud providers and will serve as a way of validating, testing and migrating to the new flow.
In a future release (v1.9 is proposed), the `--cloud-provider` flag will stop working, and the temporary cloud-controller-manager binary won’t be shipped anymore. Instead, a repository called something like kubernetes/cloud-providers will serve as a place for officially-validated cloud providers to evolve and exist, but all providers there will be independent to each other. (issue&nbsp;[#2770](https://github.com/kubernetes/kubernetes/issues/2770); proposal [#128](https://github.com/kubernetes/community/pull/128); code [#3473](https://github.com/kubernetes/kubernetes/pull/34273).)  



**Changelogs from v1.4 to v1.5**



**kubeadm** &nbsp;

v1.5 is a stabilization release for kubeadm. We’ve worked on making kubeadm more user-friendly, transparent and stable. Some new features have been added making it more configurable.



Here’s a very short extract of what’s changed:

- Made the _console output_ of kubeadm cleaner and more _user-friendly_ [#37568](https://github.com/kubernetes/kubernetes/pull/37568)
- Implemented _kubeadm reset_ and to drain and cleanup a node [#34807](https://github.com/kubernetes/kubernetes/pull/34807) and [#37831](https://github.com/kubernetes/kubernetes/pull/37831)
- _Preflight checks_ implementation that fails fast if the environment is invalid [#34341](https://github.com/kubernetes/kubernetes/pull/34341) and [#36334](https://github.com/kubernetes/kubernetes/pull/36334)
- _kubectl logs_ and _kubectl exec_ can now be used with kubeadm [#37568](https://github.com/kubernetes/kubernetes/pull/37568)
- and a lot of other improvements, please read the full [changelog](https://github.com/kubernetes/kubeadm/blob/master/CHANGELOG.md).



**kops**

Here’s a short extract of what’s changed:

- Support for CNI network plugins (Weave, Calico, Kope.io)
- Fully private deployments, where nodes and masters do not have public IPs
- Improved rolling update of clusters, in particular of HA clusters
- OS support for CentOS / RHEL / Ubuntu along with Debian, and support for sysdig & perf tools

Go and check out the [kops releases page](https://github.com/kubernetes/kops/releases) in order to get information about the latest and greatest kops release.



**Summary**



In short, we're excited on the roadmap ahead in bringing a lot of these improvements to you in the coming releases. Which we hope will&nbsp;make the experience to start much easier and&nbsp;lead to increased adoption of Kubernetes.



Thank you for all the feedback and contributions. I hope this has given you some insight in what we’re doing and encouraged&nbsp;you to join us at our meetings to say hi!

