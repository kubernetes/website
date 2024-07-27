---
title: " Challenges of a Remotely Managed, On-Premises, Bare-Metal Kubernetes Cluster "
date: 2016-08-02
slug: challenges-remotely-managed-onpremise-kubernetes-cluster
url: /blog/2016/08/Challenges-Remotely-Managed-Onpremise-Kubernetes-Cluster
author: >
  Bich Le (Platform9)
---

**Introduction**  

The recently announced [Platform9 Managed Kubernetes](https://platform9.com/press/platform9-makes-easy-deploy-docker-containers-production-scale/) (PMK) is an on-premises enterprise Kubernetes solution with an unusual twist: while clusters run on a user’s internal hardware, their provisioning, monitoring, troubleshooting and overall life cycle is managed remotely from the Platform9 SaaS application. While users love the intuitive experience and ease of use of this deployment model, this approach poses interesting technical challenges. In this article, we will first describe the motivation and deployment architecture of PMK, and then present an overview of the technical challenges we faced and how our engineering team addressed them.  

**Multi-OS bootstrap model**  

Like its predecessor, [Managed OpenStack](https://platform9.com/products/kvm/), PMK aims to make it as easy as possible for an enterprise customer to deploy and operate a “private cloud”, which, in the current context, means one or more&nbsp;Kubernetes&nbsp;clusters. To accommodate customers who standardize on a specific&nbsp;Linux distro, our installation process uses a “bare OS” or “bring your own OS” model, which means that an administrator deploys PMK to existing Linux nodes by installing a simple RPM or Deb package on their favorite OS (Ubuntu-14, CentOS-7, or RHEL-7). The package, which the administrator downloads from their Platform9 SaaS portal, starts an agent which is preconfigured with all the information and credentials needed to securely connect to and register itself with the customer’s Platform9 SaaS controller running on the WAN.  

**Node management**  

The first challenge was configuring&nbsp;Kubernetes&nbsp;nodes in the absence of a bare-metal cloud API and&nbsp;SSH access into nodes. We solved it using the _node pool_ concept and configuration management techniques. Every node running the agent automatically shows up in the SaaS portal, which allows the user to _authorize_ the node for use with&nbsp;Kubernetes. A newly&nbsp;authorized node automatically enters a _node pool_, indicating that it is available but not used in any clusters. Independently, the administrator can create one or more&nbsp;Kubernetes&nbsp;clusters,&nbsp;which start out empty. At any later time, he or she can request one or more nodes to be attached to any cluster. PMK fulfills the request by transferring the specified number of nodes from the pool to the cluster. When a node is authorized, its agent becomes a configuration management agent, polling for instructions from a CM server running in the SaaS application and capable of downloading and configuring software.  

Cluster creation and node attach/detach operations are exposed to administrators via a REST API, a CLI utility named _qb_, and the SaaS-based Web UI. The following screenshot shows the Web UI displaying one 3-node cluster named clus100, one empty cluster clus101, and the three nodes.  



 ![clusters_and_containervisors_view.png](https://lh3.googleusercontent.com/Tn67P9fhhPqCNF6xYl6mfVehG8AtLcLOM0NMW3YukBkWB5cSpYofkLQo1vrqsZiDBON05GC4ZQwWgEV9YBdoNA6Hzy_loS0cvT3BzkxmLesk6UsX_xugsrGppJD-Mc8fjHIF2QrU)


**Cluster initialization**  

The first time one or more nodes are attached to a cluster, PMK configures the nodes to form a complete&nbsp;Kubernetes&nbsp;cluster. Currently, PMK automatically decides the number and placement of&nbsp;Master and Worker nodes. In the future, PMK will give administrators an “advanced mode” option allowing them to override and customize those decisions. Through the CM server, PMK then sends to each node a configuration and a set of scripts to initialize each node according to the configuration. This includes installing or upgrading Docker to the required version; starting 2 docker daemons (bootstrap and main), creating the etcd K/V store, establishing the flannel network layer, starting kubelet, and running the&nbsp;Kubernetes&nbsp;appropriate for&nbsp;the node’s role (master vs. worker). The following diagram shows the component layout of a fully formed cluster.  



 ![architecture.png](https://lh6.googleusercontent.com/ZQZoFL6tDpkiberG_X1CREitwNIDCHnRajnOlJqByU-4HzRQi1RRoDlGj7pGRaqD2a7Yg4xBwQx7oHp_mR8ie96O5w_KMT84av-JMsPMHXeoBpVYn3iJKeGZkWG4q0J06OZMuLIe)


**Containerized kubelet?**  

Another hurdle we encountered resulted from our original decision to run kubelet as recommended by the [Multi-node Docker Deployment Guide](/docs/getting-started-guides/docker-multinode/). We discovered that this approach introduces complexities that led to many difficult-to-troubleshoot bugs that were sensitive to the combined versions of&nbsp;Kubernetes, Docker, and the node OS. Example: kubelet’s need to&nbsp;mount directories containing secrets into containers to support the [Service Accounts](/docs/user-guide/service-accounts/) mechanism. It turns out that [doing this from inside of a container is tricky](https://github.com/kubernetes/kubernetes/issues/6848), and requires a [complex sequence of steps](https://github.com/kubernetes/kubernetes/blob/release-1.0/pkg/util/mount/nsenter_mount.go#L37) that turned out to be fragile. After fixing a continuing stream of issues, we finally decided to run kubelet as a native program on the host OS, resulting in significantly better stability.  

**Overcoming networking hurdles**  

The Beta release of PMK currently uses [flannel with UDP back-end](https://github.com/coreos/flannel) for the network layer. In a&nbsp;Kubernetes&nbsp;cluster, many infrastructure services need to communicate across nodes using a variety of&nbsp;ports (443, 4001, etc..) and protocols (TCP and UDP). Often, customer nodes intentionally or unintentionally block some or all of the traffic, or run existing services that conflict with the required ports, resulting in non-obvious failures. To address this, we try to detect configuration problems early and inform the administrator immediately. PMK runs a “preflight” check on all nodes participating in a cluster before installing the&nbsp;Kubernetes&nbsp;software. This&nbsp;means running small test programs on each node to verify that (1) the required ports are available for binding and listening; and (2) nodes can connect to each other using all required ports and protocols. These checks run in parallel and take less than a couple of seconds before cluster initialization.  

**Monitoring**  

One of the values of a SaaS-managed private cloud is constant monitoring and early detection of problems by the SaaS team. Issues that can be addressed without intervention by the customer are handled automatically, while others trigger proactive communication with the customer via UI alerts, email, or real-time channels. Kubernetes monitoring is a huge topic worthy of its own blog post, so we’ll just briefly touch upon it. We broadly classify the problem into layers: (1) hardware & OS, (2) Kubernetes core (e.g. API server, controllers and kubelets), (3) add-ons (e.g. [SkyDNS](https://github.com/skynetservices/skydns) & [ServiceLoadbalancer](https://github.com/kubernetes/contrib/tree/master/service-loadbalancer)) and (4) applications. We are currently focused on layers 1-3. A major source of issues we’ve seen is add-on failures. If either DNS or the ServiceLoadbalancer reverse http proxy (soon to be upgraded to an [Ingress Controller](https://github.com/kubernetes/contrib/tree/master/ingress/controllers)) fails, application services will start failing. One way we detect such failures is by monitoring the components using the&nbsp;Kubernetes&nbsp;API itself, which is proxied into the SaaS&nbsp;controller, allowing the PMK support team to monitor any cluster resource. To detect service failure, one metric we pay attention to is _pod restarts_. A high restart count indicates that a service is continually failing.  

**Future topics**  

We faced complex challenges in other areas that deserve their own posts: (1) _Authentication and authorization with [Keystone](http://docs.openstack.org/developer/keystone/)_, the identity manager used by Platform9 products; (2) _Software upgrades_, i.e. how to make them brief and non-disruptive to applications; and (3) _Integration with customer’s external load-balancers_ (in the absence of good automation APIs).  

**Conclusion**  

[Platform9 Managed Kubernetes](https://platform9.com/products/docker/) uses a SaaS-managed model to try to hide the complexity of deploying, operating and maintaining bare-metal&nbsp;Kubernetes&nbsp;clusters in customers’ data centers.&nbsp;These requirements led to the development of a unique cluster deployment and management architecture, which in turn led to unique technical challenges.This article described an overview of some of those challenges and how we solved them. For more information on the motivation behind PMK, feel free to view Madhura Maskasky's [blog post](https://platform9.com/blog/containers-as-a-service-kubernetes-docker/).
