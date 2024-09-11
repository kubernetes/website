---
title: " How we run Kubernetes in Kubernetes aka Kubeception "
date: 2017-01-20
slug: how-we-run-kubernetes-in-kubernetes-kubeception
url: /blog/2017/01/How-We-Run-Kubernetes-In-Kubernetes-Kubeception
author: >
  Hector Fernandez (Giant Swarm)
  Puja Abbassi (Giant Swarm)
---
[Giant Swarm](https://giantswarm.io/)’s container infrastructure started out with the goal to be an easy way for developers to deploy containerized microservices. Our first generation was extensively using [fleet](https://github.com/coreos/fleet) as a base layer for our infrastructure components as well as for scheduling user containers.  

In order to give our users a more powerful way to manage their containers we introduced Kubernetes into our stack in early 2016. However, as we needed a quick way to flexibly spin up and manage different users’ Kubernetes clusters resiliently we kept the underlying fleet layer.  

As we insist on running all our underlying infrastructure components in containers, fleet gave us the flexibility of using systemd unit files to define our infrastructure components declaratively. Our self-developed deployment tooling allowed us to deploy and manage the infrastructure without the need for imperative configuration management tools.  

However, fleet is just a distributed init and not a complete scheduling and orchestration system. Next to a lot of work on our tooling, it required significant improvements in terms of communication between peers, its reconciliation loop, and stability that we had to work on. Also the uptake in Kubernetes usage would ensure that issues are found and fixed faster.  

As we had made good experience with introducing Kubernetes on the user side and with recent developments like [rktnetes](https://kubernetes.io/blog/2016/07/rktnetes-brings-rkt-container-engine-to-Kubernetes) and [stackanetes](https://github.com/stackanetes/stackanetes) it felt like time for us to also move our base layer to Kubernetes.  



**Why Kubernetes in Kubernetes**



Now, you could ask, why would anyone want to run multiple Kubernetes clusters inside of a Kubernetes cluster? Are we crazy? The answer is advanced multi-tenancy use cases as well as operability and automation thereof.



Kubernetes comes with its own growing feature set for multi-tenancy use cases. However, we had the goal of offering our users a fully-managed Kubernetes without any limitations to the functionality they would get using any vanilla Kubernetes environment, including privileged access to the nodes. Further, in bigger enterprise scenarios a single Kubernetes cluster with its inbuilt isolation mechanisms is often not sufficient to satisfy compliance and security requirements. More advanced (firewalled) zoning or layered security concepts are tough to reproduce with a single installation.&nbsp;With namespace isolation both privileged access as well as firewalled zones can hardly be implemented without sidestepping security measures.



Now you could go and set up multiple completely separate (and federated)&nbsp;installations of Kubernetes. However, automating the deployment and management of these clusters would need additional tooling and complex monitoring setups. Further, we wanted to be able to spin clusters up and down on demand, scale them, update them, keep track of which clusters are available, and be able to assign them to organizations and teams flexibly.&nbsp;In fact this setup can be combined with a federation control plane to federate deployments to the clusters over one API endpoint.



And wouldn’t it be nice to have an API and frontend for that?



**Enter Giantnetes**



Based on the above requirements we set out to build what we call Giantnetes - or if you’re into movies, Kubeception. At the most basic abstraction it is an outer Kubernetes cluster (the actual Giantnetes), which is used to run and manage multiple completely isolated user Kubernetes clusters.  

 ![](https://lh6.googleusercontent.com/jWRQBd96sPwtiG6vE_4DPAvEWrRnXTWVfWE3O4_JeCXYzSaAZPpVQA-s5K8W-GTZdQBYeC-g3rS3LMB_vgz6h8-EVQps0JIcaxoeXI8T6aVOowWtWdxRB78b_K3bxzfvVWGb5cWM)



The physical machines are bootstrapped by using our CoreOS Container Linux bootstrapping tool, [Mayu](https://github.com/giantswarm/mayu). The Giantnetes components themselves are self-hosted, i.e. a kubelet is in charge of automatically bootstrapping the components that reside in a manifests folder. You could call this the first level of Kubeception.



Once the Giantnetes cluster is running we use it to schedule the user Kubernetes clusters as well as our tooling for managing and securing them.



We chose Calico as the Giantnetes network plugin to ensure security, isolation, and the right performance for all the applications running on top of Giantnetes.



Then, to create the inner Kubernetes clusters, we initiate a few pods, which configure the network bridge, create certificates and tokens, and launch virtual machines for the future cluster. To do so, we use lightweight technologies such as KVM and qemu to provision CoreOS Container Linux VMs that become the nodes of an inner Kubernetes cluster. You could call this the second level of Kubeception.&nbsp;



Currently this means we are starting Pods with Docker containers that in turn start VMs with KVM and qemu. However, we are looking into doing this with [rkt qemu-kvm](https://github.com/coreos/rkt/blob/master/Documentation/running-kvm-stage1.md), which would result in using a rktnetes setup for our Giantnetes.  


 ![](https://lh3.googleusercontent.com/fl8PIu5NgS4vRmUDuAGzni3uW-5RTYD0U22rF6fXr_UBfta4cLhQa2CsRNvDrmc2TiIZDRairTDYpn8QiU3Cjf6m8v74vFENCy9MHa3MgvNNEvvcwrwOxhvMe-pNITCDpV41bWBc)



The networking solution for the inner Kubernetes clusters has two levels. It on a combination of flannel’s server/client architecture model and Calico BGP. While a flannel client is used to create the network bridge between the VMs of each virtualized inner Kubernetes cluster, Calico is running inside the virtual machines to connect the different Kubernetes nodes and create a single network for the inner Kubernetes. By using Calico, we mimic the Giantnetes networking solution inside of each Kubernetes cluster and provide the primitives to secure and isolate workloads through the Kubernetes network policy API.



Regarding security, we aim for separating privileges as much as possible and making things auditable. Currently this means we use certificates to secure access to the clusters and encrypt communication between all the components that form a cluster is (i.e. VM to VM, Kubernetes components to each other, etcd master to Calico workers, etc). For this we create a PKI backend per cluster and then issue certificates per service in Vault on-demand. Every component uses a different certificate, thus, avoiding to expose the whole cluster if any of the components or nodes gets compromised. We further rotate the certificates on a regular basis.



For ensuring access to the API and to services of each inner Kubernetes cluster from the outside we run a multi-level HAproxy ingress controller setup in the Giantnetes that connects the Kubernetes VMs to hardware load balancers.



**Looking into Giantnetes with kubectl**



Let’s have a look at a minimal sample deployment of Giantnetes.  

 ![Screen Shot 2016-11-14 at 12.08.40 PM.png](https://lh6.googleusercontent.com/wX9sxvO2um5DeT-mjMpazRWZOvauARHLA2z5wRZC41d4V72nzNQORSxxRxq1dJxZ4Rvw3ji7_ThAntYv-iSUgZl_Eq3gSCNRRHafTuN5rdQ9eo1HwD64LP01GNsSL-SRMA5-RDGW)



In the above example you see a user Kubernetes cluster `customera` running in VM-containers on top of Giantnetes. We currently use Jobs for the network and certificate setups.  

Peeking inside the user cluster, you see the DNS pods and a helloworld running.  

 ![Screen Shot 2016-11-14 at 12.07.28 PM.png](https://lh3.googleusercontent.com/5o88zBSr5-JigMWvVnfN6nmMlKPtEt8-Gw5j_3Rq3QdsvLiHIVoOsow8WfgA5wd8WsA8M9C-MV4AdS04XDzLfzNR4T6ZXqPPAZc-Imbr-Um0B5QajGTtCqIwsMjsSAA9O-un3wvU)



Each one of these user clusters can be scheduled and used independently. They can be spun up and down on-demand.



**Conclusion**



To sum up, we could show how Kubernetes is able to easily not only self-host but also flexibly schedule a multitude of inner Kubernetes clusters while ensuring higher isolation and security aspects. A highlight in this setup is the composability and automation of the installation and the robust coordination between the Kubernetes components. This allows us to easily create, destroy, and reschedule clusters on-demand without affecting users or compromising the security of the infrastructure. It further allows us to spin up clusters with varying sizes and configurations or even versions by just changing some arguments at cluster creation.&nbsp;



This setup is still in its early days and our roadmap is planning for improvements in many areas such as transparent upgrades, dynamic reconfiguration and scaling of clusters, performance improvements, and (even more) security. Furthermore, we are looking forward to improve on our setup by making use of the ever advancing state of Kubernetes operations tooling and upcoming features, such as Init Containers, Scheduled Jobs, Pod and Node affinity and anti-affinity, etc.



Most importantly, we are working on making the inner Kubernetes clusters a third party resource that can then be managed by a custom controller. The result would be much like the [Operator concept by CoreOS](https://coreos.com/blog/introducing-operators.html). And to ensure that the community at large can benefit from this project we will be open sourcing this in the near future.

