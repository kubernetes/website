---
title: " How Weave built a multi-deployment solution for Scope using Kubernetes "
date: 2015-12-12
slug: how-weave-built-a-multi-deployment-solution-for-scope-using-kubernetes
url: /blog/2015/12/How-Weave-Built-A-Multi-Deployment-Solution-For-Scope-Using-Kubernetes
author: >
  Peter Bourgon (Weaveworks)
---

Earlier this year at Weaveworks we launched [Weave Scope](http://weave.works/product/scope/index.html), an open source solution for visualization and monitoring of containerised apps and services. Recently we released a hosted Scope service into an [Early Access Program](http://blog.weave.works/2015/10/08/weave-the-fastest-path-to-docker-on-amazon-ec2-container-service/). Today, we want to walk you through how we initially prototyped that service, and how we ultimately chose and deployed Kubernetes as our platform.  


##### A cloud-native architecture&nbsp;

Scope already had a clean internal line of demarcation between data collection and user interaction, so it was straightforward to split the application on that line, distribute probes to customers, and host frontends in the cloud. We built out a small set of microservices in the [12-factor model](http://12factor.net/), which includes:  


* A users service, to manage and authenticate user accounts&nbsp;
* A provisioning service, to manage the lifecycle of customer Scope instances&nbsp;
* A UI service, hosting all of the fancy HTML and JavaScript content&nbsp;
* A frontend service, to route requests according to their properties&nbsp;
* A monitoring service, to introspect the rest of the system&nbsp;



All services are built as Docker images, [FROM scratch](https://medium.com/@kelseyhightower/optimizing-docker-images-for-static-binaries-b5696e26eb07#.qqjkud6i0) where possible. We knew that we wanted to offer at least 3 deployment environments, which should be as near to identical as possible.&nbsp;


* An "Airplane Mode" local environment, on each developer's laptop&nbsp;
* A development or staging environment, on the same infrastructure that hosts production, with different user credentials&nbsp;
* The production environment itself&nbsp;



These were our application invariants. Next, we had to choose our platform and deployment model.  


##### Our first prototype&nbsp;
There are a seemingly infinite set of choices, with an infinite set of possible combinations. After surveying the landscape in mid-2015, we decided to make a prototype with  


* [Amazon EC2](https://aws.amazon.com/ec2/) as our cloud platform, including RDS for persistence&nbsp;
* [Docker Swarm](https://docs.docker.com/swarm/) as our "scheduler"&nbsp;
* [Consul](https://consul.io/) for service discovery when bootstrapping Swarm&nbsp;
* [Weave Net](https://www.weave.works/oss/net/) for our network and service discovery for the application itself&nbsp;
* [Terraform](https://terraform.io/) as our provisioner&nbsp;



This setup was fast to define and fast to deploy, so it was a great way to validate the feasibility of our ideas. But we quickly hit problems.&nbsp;



* Terraform's support for [Docker as a provisioner](https://terraform.io/docs/providers/docker) is barebones, and we uncovered [some bugs](https://github.com/hashicorp/terraform/issues/3526) when trying to use it to drive Swarm.&nbsp;
* Largely as a consequence of the above, managing a zero-downtime deploy of Docker containers with Terraform was very difficult.&nbsp;
* Swarm's _raison d'être_ is to abstract the particulars of multi-node container scheduling behind the familiar Docker CLI/API commands. But we concluded that the API is insufficiently expressive for the kind of operations that are necessary at scale in production.&nbsp;
* Swarm provides no fault tolerance in the case of e.g. node failure.&nbsp;



We also made a number of mistakes when designing our workflow.  


* We tagged each container with its target environment at build time, which simplified our Terraform definitions, but effectively forced us to manage our versions via image repositories. That responsibility belongs in the scheduler, not the artifact store.&nbsp;
* As a consequence, every deploy required artifacts to be pushed to all hosts. This made deploys slow, and rollbacks unbearable.&nbsp;
* Terraform is designed to provision infrastructure, not cloud applications. The process is slower and more deliberate than we’d like. Shipping a new version of something to prod took about 30 minutes, all-in.&nbsp;



When it became clear that the service had potential, we re-evaluated the deployment model with an eye towards the long-term.  


##### Rebasing on Kubernetes&nbsp;
It had only been a couple of months, but a lot had changed in the landscape.  


* HashiCorp released [Nomad](https://nomadproject.io/)&nbsp;
* [Kubernetes](https://kubernetes.io/) hit 1.0&nbsp;
* Swarm was soon to hit 1.0&nbsp;



While many of our problems could be fixed without making fundamental architectural changes, we wanted to capitalize on the advances in the industry, by joining an existing ecosystem, and leveraging the experience and hard work of its contributors.&nbsp;  

After some internal deliberation, we did a small-scale audition of Nomad and Kubernetes. We liked Nomad a lot, but felt it was just too early to trust it with our production service. Also, we found the Kubernetes developers to be the most responsive to issues on GitHub. So, we decided to go with Kubernetes.  


##### Local Kubernetes&nbsp;

First, we would replicate our Airplane Mode local environment with Kubernetes. Because we have developers on both Mac and Linux laptops, it’s important that the local environment is containerised. So, we wanted the Kubernetes components themselves (kubelet, API server, etc.) to run in containers.  

We encountered two main problems. First, and most broadly, creating Kubernetes clusters from scratch is difficult, as it requires deep knowledge of how Kubernetes works, and quite some time to get the pieces to fall in place together. [local-cluster-up.sh](http://local-cluster-up.sh/) seems like a Kubernetes developer’s tool and didn’t leverage containers, and the third-party solutions we found, like [Kubernetes Solo](https://github.com/rimusz/coreos-osx-kubernetes-solo), require a dedicated VM or are platform-specific.  

Second, containerised Kubernetes is still missing several important pieces. Following the [official Kubernetes Docker guide](https://github.com/kubernetes/kubernetes/blob/master/docs/getting-started-guides/docker.md) yields a barebones cluster without certificates or service discovery. We also encountered a couple of usability issues ([#16586](https://github.com/kubernetes/kubernetes/issues/16586), [#17157](https://github.com/kubernetes/kubernetes/issues/17157)), which we resolved by [submitting a patch](https://github.com/kubernetes/kubernetes/pull/17159) and building our own [hyperkube image](https://hub.docker.com/r/2opremio/hyperkube/) from master.  

In the end, we got things working by creating our own provisioning script. It needs to do things like [generate the PKI keys and certificates](https://github.com/kubernetes/kubernetes/blob/master/docs/admin/authentication.md#creating-certificates) and [provision the DNS add-on](https://github.com/kubernetes/kubernetes/tree/master/cluster/addons/dns), which took a few attempts to get right. We’ve also learned of a [commit to add certificate generation to the Docker build](https://github.com/kubernetes/kubernetes/commit/ce90b83689f08cb5ebb6b632dab7f95a48060425), so things will likely get easier in the near term.  


##### Kubernetes on AWS&nbsp;

Next, we would deploy Kubernetes to AWS, and wire it up with the other AWS components. We wanted to stand up the service in production quickly, and we only needed to support Amazon, so we decided to do so without Weave Net and to use a pre-existing provisioning solution. But we’ll definitely revisit this decision in the near future, leveraging Weave Net via Kubernetes plugins.  

Ideally we would have used Terraform resources, and we found a couple: [kraken](https://github.com/Samsung-AG/kraken) (using Ansible), [kubestack](https://github.com/kelseyhightower/kubestack) (coupled to GCE), [kubernetes-coreos-terraform](https://github.com/bakins/kubernetes-coreos-terraform) (outdated Kubernetes) and [coreos-kubernetes](https://github.com/coreos/coreos-kubernetes). But they all build on CoreOS, which was an extra moving part we wanted to avoid in the beginning. (On our next iteration, we’ll probably audition CoreOS.) If you use Ansible, there are [playbooks available](https://github.com/kubernetes/contrib/tree/master/ansible) in the main repo. There are also community-drive [Chef cookbooks](https://github.com/evilmartians/chef-kubernetes) and [Puppet modules](https://forge.puppetlabs.com/cristifalcas/kubernetes). I’d expect the community to grow quickly here.  

The only other viable option seemed to be kube-up, which is a collection of scripts that provision Kubernetes onto a variety of cloud providers. By default, kube-up onto AWS puts the master and minion nodes into their own VPC, or Virtual Private Cloud. But our RDS instances were provisioned in the region-default VPC, which meant that communication from a Kubernetes minion to the DB would be possible only via [VPC peering](http://ben.straub.cc/2015/08/19/kubernetes-aws-vpc-peering/) or by opening the RDS VPC's firewall rules manually.  

To get traffic to traverse a VPC peer link, your destination IP needs to be in the target VPC's private address range. But [it turns out](https://forums.aws.amazon.com/thread.jspa?messageID=681125) that resolving the RDS instance's hostname from anywhere outside the same VPC will yield the public IP. And performing the resolution is important, because RDS reserves the right to change the IP for maintenance. This wasn't ever a concern in the previous infrastructure, because our Terraform scripts simply placed everything in the same VPC. So I thought I'd try the same with Kubernetes; the kube-up script ostensibly supports installing to an existing VPC by specifying a VPC\_ID environment variable, so I tried installing Kubernetes to the RDS VPC. kube-up appeared to succeed, but [service integration via ELBs broke](https://github.com/kubernetes/kubernetes/issues/17647) and[teardown via kube-down stopped working](https://github.com/kubernetes/kubernetes/issues/17219). After some time, we judged it best to let kube-up keep its defaults, and poked a hole in the RDS VPC.  

This was one hiccup among several that we encountered. Each one could be fixed in isolation, but the inherent fragility of using a shell script to provision remote state seemed to be the actual underlying cause. We fully expect the Terraform, Ansible, Chef, Puppet, etc. packages to continue to mature, and hope to switch soon.  

Provisioning aside, there are great things about the Kubernetes/AWS integration. For example, Kubernetes [services](http://kubernetes.io/v1.1/docs/user-guide/services.html) of the correct type automatically generate ELBs, and Kubernetes does a great job of lifecycle management there. Further, the Kubernetes domain model—services, [pods](http://kubernetes.io/v1.1/docs/user-guide/pods.html), [replication controllers](http://kubernetes.io/v1.1/docs/user-guide/replication-controller.html), the [labels and selector model](http://kubernetes.io/v1.1/docs/user-guide/labels.html), and so on—is coherent, and seems to give the user the right amount of expressivity, though the definition files do [tend to stutter needlessly](https://github.com/kubernetes/kubernetes/blob/643cb7a1c7499df4e569f4f0fbd3b18c0c4e63ce/examples/guestbook/redis-master-controller.yaml). The kubectl tool is good, albeit [daunting at first glance](http://i.imgur.com/nEyTWej.png). The [rolling-update](http://kubernetes.io/v1.1/docs/user-guide/update-demo/README.html) command in particular is brilliant: exactly the semantics and behavior I'd expect from a system like this. Indeed, once Kubernetes was up and running, _it just worked_, and exactly as I expected it to. That’s a huge thing.  


##### Conclusions&nbsp;

After a couple weeks of fighting with the machines, we were able to resolve all of our integration issues, and have rolled out a reasonably robust Kubernetes-based system to production.  


* **Provisioning Kubernetes is difficult** , owing to a complex architecture and young provisioning story. This shows all signs of improving.&nbsp;
* Kubernetes’ non-optional **security model takes time to get right**.&nbsp;
* The Kubernetes **domain language is a great match** to the problem domain.&nbsp;
* We have **a lot more confidence** in operating our application (It's a lot faster, too.).&nbsp;
* And we're **very happy to be part of a growing Kubernetes userbase** , contributing issues and patches as we can and benefitting from the virtuous cycle of open-source development that powers the most exciting software being written today.&nbsp;

_Weave Scope is an open source solution for visualization and monitoring of containerised apps and services. For a hosted Scope service, request an invite to Early Access program at scope.weave.works._
