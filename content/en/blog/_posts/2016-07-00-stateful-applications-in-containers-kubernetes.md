---
title: " Stateful Applications in Containers!? Kubernetes 1.3 Says “Yes!” "
date: 2016-07-13
slug: stateful-applications-in-containers-kubernetes
url: /blog/2016/07/stateful-applications-in-containers-kubernetes
---

_Editor's note: today’s guest post is from Mark Balch, VP of Products at Diamanti, who’ll share more about the contributions they’ve made to Kubernetes._    

Congratulations to the Kubernetes community on another [value-packed release](https://kubernetes.io/blog/2016/07/kubernetes-1.3-bridging-cloud-native-and-enterprise-workloads). A focus on stateful applications and federated clusters are two reasons why I’m so excited about 1.3. Kubernetes support for stateful apps such as Cassandra, Kafka, and MongoDB is critical. Important services rely on databases, key value stores, message queues, and more. Additionally, relying on one data center or container cluster simply won’t work as apps grow to serve millions of users around the world. Cluster federation allows users to deploy apps across multiple clusters and data centers for scale and resiliency.  

You may have [heard me say before](https://www.diamanti.com/blog/the-next-great-application-platform/) that containers are the next great application platform. Diamanti is accelerating container adoption for stateful apps in production - where performance and ease of deployment really matter.&nbsp;  

**Apps Need More Than Cattle**  

Beyond stateless containers like web servers (so-called “cattle” because they are interchangeable), users are increasingly deploying stateful workloads with containers to benefit from “build once, run anywhere” and to improve bare metal efficiency/utilization. These “pets” (so-called because each requires special handling) bring new requirements including longer life cycle, configuration dependencies, stateful failover, and performance sensitivity. Container orchestration must address these needs to successfully deploy and scale apps.  

Enter [Pet Set](/docs/user-guide/petset/), a new object in Kubernetes 1.3 for improved stateful application support. Pet Set sequences through the startup phase of each database replica (for example), ensuring orderly master/slave configuration. Pet Set also simplifies service discovery by leveraging ubiquitous DNS SRV records, a well-recognized and long-understood mechanism.  

Diamanti’s [FlexVolume contribution](https://github.com/kubernetes/kubernetes/pull/13840) to Kubernetes enables stateful workloads by providing persistent volumes with low-latency storage and guaranteed performance, including enforced quality-of-service from container to media.  

**A Federalist**  

Users who are planning for application availability must contend with issues of failover and scale across geography. Cross-cluster federated services allows containerized apps to easily deploy across multiple clusters. Federated services tackles challenges such as managing multiple container clusters and coordinating service deployment and discovery across federated clusters.  

Like a strictly centralized model, federation provides a common app deployment interface. With each cluster retaining autonomy, however, federation adds flexibility to manage clusters locally during network outages and other events. Cross-cluster federated services also applies consistent service naming and adoption across container clusters, simplifying DNS resolution.  

It’s easy to imagine powerful multi-cluster use cases with cross-cluster federated services in future releases. An example is scheduling containers based on governance, security, and performance requirements. Diamanti’s scheduler extension was developed with this concept in mind. Our [first implementation](https://github.com/kubernetes/kubernetes/pull/13580) makes the Kubernetes scheduler aware of network and storage resources local to each cluster node. Similar concepts can be applied in the future to broader placement controls with cross-cluster federated services.&nbsp;  

**Get Involved**  

With interest growing in stateful apps, work has already started to further enhance Kubernetes storage. The Storage Special Interest Group is discussing proposals to support local storage resources. Diamanti is looking forward to extend FlexVolume to include richer APIs that enable local storage and storage services including data protection, replication, and reduction. We’re also working on proposals for improved app placement, migration, and failover across container clusters through Kubernetes cross-cluster federated services.  

Join the conversation and contribute! Here are some places to get started:  


- Product Management [group](https://groups.google.com/forum/#!forum/kubernetes-sig-pm)
- Kubernetes [Storage SIG](https://groups.google.com/forum/#!forum/kubernetes-sig-storage)&nbsp;
- Kubernetes [Cluster Federation SIG](https://groups.google.com/forum/#!forum/kubernetes-sig-federation)


_-- Mark Balch, VP Products, [Diamanti](https://diamanti.com/). Twitter [@markbalch](https://twitter.com/markbalch)_  
