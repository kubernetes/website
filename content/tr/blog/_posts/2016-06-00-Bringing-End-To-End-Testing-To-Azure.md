---
title: " Bringing End-to-End Kubernetes Testing to Azure (Part 1) "
date: 2016-06-06
slug: bringing-end-to-end-testing-to-azure
url: /blog/2016/06/Bringing-End-To-End-Testing-To-Azure
author: >
  Travis Newhouse (AppFormix)
---

At [AppFormix](http://www.appformix.com/), continuous integration testing is part of our culture. We see many benefits to running end-to-end tests regularly, including minimizing regressions and ensuring our software works together as a whole. To ensure a high quality experience for our customers, we require the ability to run end-to-end testing not just for our application, but for the entire orchestration stack. Our customers are adopting Kubernetes as their container orchestration technology of choice, and they demand choice when it comes to where their containers execute, from private infrastructure to public providers, including Azure. After several weeks of work, we are pleased to announce we are contributing a nightly, continuous integration job that executes e2e tests on the Azure platform. After running the e2e tests each night for only a few weeks, we have already found and fixed two issues in Kubernetes. We hope our contribution of an e2e job will help the community maintain support for the Azure platform as Kubernetes evolves.    



In this blog post, we describe the journey we took to implement deployment scripts for the Azure platform. The deployment scripts are a prerequisite to the e2e test job we are contributing, as the scripts make it possible for our e2e test job to test the latest commits to the Kubernetes master branch. In a subsequent blog post, we will describe details of the e2e tests that will help maintain support for the Azure platform, and how to contribute federated e2e test results to the Kubernetes project.



**BACKGROUND**

While Kubernetes is designed to operate on any IaaS, and [solution guides](/docs/getting-started-guides/#table-of-solutions) exist for many platforms including [Google Compute Engine](/docs/getting-started-guides/gce/), [AWS](/docs/getting-started-guides/aws/), [Azure](/docs/getting-started-guides/coreos/azure/), and [Rackspace](/docs/getting-started-guides/rackspace/), the Kubernetes project refers to these as “versioned distros,” as they are only tested against a particular binary release of Kubernetes. On the other hand, “development distros” are used daily by automated, e2e tests for the latest Kubernetes source code, and serve as gating checks to code submission.



When we first surveyed existing support for Kubernetes on Azure, we found documentation for running Kubernetes on Azure using CoreOS and Weave. The documentation includes [scripts for deployment](/docs/getting-started-guides/coreos/azure/), but the scripts do not conform to the cluster/kube-up.sh framework for automated cluster creation required by a “development distro.” Further, there did not exist a continuous integration job that utilized the scripts to validate Kubernetes using the end-to-end test scenarios (those found in test/e2e  in the Kubernetes repository).



With some additional investigation into the project history (side note: git log --all --grep='azure' --oneline was quite helpful), we discovered that there previously existed a set of scripts that integrated with the cluster/kube-up.sh framework. These scripts were discarded on October 16, 2015 ([commit 8e8437d](https://github.com/kubernetes/kubernetes/pull/15790)) because the scripts hadn’t worked since before Kubernetes version 1.0. With these commits as a starting point, we set out to bring the scripts up to date, and create a supported continuous integration job that will aid continued maintenance.



**CLUSTER DEPLOYMENT SCRIPTS**

To setup a Kubernetes cluster with Ubuntu VMs on Azure, we followed the groundwork laid by the previously abandoned commit, and tried to leverage the existing code as much as possible. The solution uses SaltStack for deployment and OpenVPN for networking between the master and the minions. SaltStack is also used for configuration management by several other solutions, such as AWS, GCE, Vagrant, and Vsphere. Resurrecting the discarded commit was a starting point, but we soon realized several key elements that needed attention:

- Install Docker and Kubernetes on the nodes using SaltStack
- Configure authentication for services
- Configure networking

The cluster setup scripts ensure Docker is installed, copy the Kubernetes Docker images to the master and minions nodes, and load the images. On the master node, SaltStack launches kubelet, which in turn launches the following Kubernetes services running in containers: kube-api-server, kube-scheduler, and kube-controller-manager. On each of the minion nodes, SaltStack launches kubelet, which starts kube-proxy.



Kubernetes services must authenticate when communicating with each other. For example, minions register with the kube-api service on the master. On the master node, scripts generate a self-signed certificate and key that kube-api uses for TLS. Minions are configured to skip verification of the kube-api’s (self-signed) TLS certificate. We configure the services to use username and password credentials. The username and password are generated by the cluster setup scripts, and stored in the kubeconfig file on each node.



Finally, we implemented the networking configuration. To keep the scripts parameterized and minimize assumptions about the target environment, the scripts create a new Linux bridge device (cbr0), and ensure that all containers use that interface to access the network. To configure networking, we use OpenVPN to establish tunnels between master and minion nodes. For each minion, we reserve a /24 subnet to use for its pods. Azure assigned each node its own IP address. We also added the necessary routing table entries for this bridge to use OpenVPN interfaces. This is required to ensure pods in different hosts can communicate with each other. The routes on the master and minion are the following:





###### master
```
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface

10.8.0.0        10.8.0.2        255.255.255.0   UG    0      0        0 tun0

10.8.0.2        0.0.0.0         255.255.255.255 UH    0      0        0 tun0

10.244.1.0      10.8.0.2        255.255.255.0   UG    0      0        0 tun0

10.244.2.0      10.8.0.2        255.255.255.0   UG    0      0        0 tun0

172.18.0.0      0.0.0.0         255.255.0.0     U     0      0        0 cbr0
```

###### minion-1
```
10.8.0.0        10.8.0.5        255.255.255.0   UG    0      0        0 tun0

10.8.0.5        0.0.0.0         255.255.255.255 UH    0      0        0 tun0

10.244.1.0      0.0.0.0         255.255.255.0   U     0      0        0 cbr0

10.244.2.0      10.8.0.5        255.255.255.0   UG    0      0        0 tun0
```

###### minion-2
```
10.8.0.0        10.8.0.9        255.255.255.0   UG    0      0        0 tun0

10.8.0.9        0.0.0.0         255.255.255.255 UH    0      0        0 tun0

10.244.1.0      10.8.0.9        255.255.255.0   UG    0      0        0 tun0

10.244.2.0      0.0.0.0         255.255.255.0   U     0      0        0 cbr0  
```

 [![](https://3.bp.blogspot.com/-U2KYWNzJpFI/V3QMYbKRX8I/AAAAAAAAAks/SqEvCDJHJ8QtbB9hJVM8WAkFuAUlrFl8ACLcB/s400/Kubernetes%2BBlog%2BPost%2B-%2BKubernetes%2Bon%2BAzure%2B%2528Part%2B1%2529.png)](https://3.bp.blogspot.com/-U2KYWNzJpFI/V3QMYbKRX8I/AAAAAAAAAks/SqEvCDJHJ8QtbB9hJVM8WAkFuAUlrFl8ACLcB/s1600/Kubernetes%2BBlog%2BPost%2B-%2BKubernetes%2Bon%2BAzure%2B%2528Part%2B1%2529.png) |
| Figure 1 - OpenVPN network configuration |

**FUTURE WORK** With the deployment scripts implemented, a subset of e2e test cases are passing on the Azure platform. Nightly results are published to the [Kubernetes test history dashboard](http://storage.googleapis.com/kubernetes-test-history/static/index.html). Weixu Zhuang made a [pull request](https://github.com/kubernetes/kubernetes/pull/21207) on Kubernetes GitHub, and we are actively working with the Kubernetes community to merge the Azure cluster deployment scripts necessary for a nightly e2e test job. The deployment scripts provide a minimal working environment for Kubernetes on Azure. There are several next steps to continue the work, and we hope the community will get involved to achieve them.

- Only a subset of the e2e scenarios are passing because some cloud provider interfaces are not yet implemented for Azure, such as load balancer and instance information. To this end, we seek community input and help to define an Azure implementation of the cloudprovider interface (pkg/cloudprovider/). These interfaces will enable features such as Kubernetes pods being exposed to the external network and cluster DNS.
- Azure has new APIs for interacting with the service. The submitted scripts currently use the Azure Service Management APIs, [which are deprecated](https://azure.microsoft.com/en-us/documentation/articles/azure-classic-rm/). The Azure Resource Manager APIs should be used in the deployment scripts.
The team at AppFormix is pleased to contribute support for Azure to the Kubernetes community. We look forward to feedback about how we can work together to improve Kubernetes on Azure.



_Editor's Note: Want to _contribute to_ Kubernetes, get involved [here](https://github.com/kubernetes/kubernetes/issues?q=is%3Aopen+is%3Aissue+label%3Ahelp-wanted). Have your own Kubernetes story you’d like to tell, [let us know](https://docs.google.com/a/google.com/forms/d/1cHiRdmBCEmUH9ekHY2G-KDySk5YXRzALHcMNgzwXtPM/viewform)!_


Part II is available [here](https://kubernetes.io/blog/2016/07/bringing-end-to-end-kubernetes-testing-to-azure-2).
