---
title: " Kubernetes in the Enterprise with Fujitsu’s Cloud Load Control "
date: 2016-03-11
slug: kubernetes-in-enterprise-with-fujitsus
url: /blog/2016/03/Kubernetes-In-Enterprise-With-Fujitsus
author: >
  Florian Walker (FUJITSU)
---

Earlier this year, Fujitsu released its Kubernetes-based offering Fujitsu ServerView[Cloud Load Control](http://www.fujitsu.com/software/clc/) (CLC) to the public. Some might be surprised since Fujitsu’s reputation is not necessarily related to software development, but rather to hardware manufacturing and IT services. As a long-time member of the Linux foundation and founding member of the ​Open Container Initiative and the Cloud Native Computing Foundation, Fujitsu does not only build software, but is committed to open source software, and contributes to several projects, including Kubernetes. But we not only believe in Kubernetes as an open source project, we also chose it as the core of our offering, because it provides the best balance of feature set, resource requirements and complexity to run distributed applications at scale.

Today, we want to take you on a short tour explaining the background of our offering, why we think Kubernetes is the right fit for your customers and what value Cloud Load Control provides on top of it.
**A long long time ago…**  

In mid 2014 we looked at the challenges enterprises are facing in the context of digitization, where traditional enterprises experience that more and more competitors from the IT sector are pushing into the core of their markets. A big part of Fujitsu’s customers are such traditional businesses, so we considered how we could help them and came up with three basic principles:

- Decouple applications from infrastructure - Focus on where the value for the customer is: the application.
- Decompose applications - Build applications from smaller, loosely coupled parts. Enable reconfiguration of those parts depending on the needs of the business. Also encourage innovation by low-cost experiments.
- Automate everything - Fight the increasing complexity of the first two points by introducing a high degree of automation.

We found that Linux containers themselves cover the first point and touch the second. But at this time there was little support for creating distributed applications and running them managed automatically. We found Kubernetes as the missing piece.
**Not a free lunch**  

The general approach of Kubernetes in managing containerized workload is convincing, but as we looked at it with the eyes of customers, we realized that it’s not a free lunch. Many &nbsp;customers are medium-sized companies whose core business is often bound to strict data protection regulations. The top three requirements we identified are:

- On-premise deployments (with the option for hybrid scenarios)
- Efficient operations as part of a (much) bigger IT infrastructure
- Enterprise-grade support, potentially on global scale

We created Cloud Load Control with these requirements in mind. It is basically a distribution of Kubernetes targeted for on-premise use, primarily focusing on operational aspects of container infrastructure. We are committed to work with the community, and contribute all relevant changes and extensions upstream to the Kubernetes project.
**On-premise deployments**  

As Kubernetes core developer Tim Hockin often puts it in his[talks](https://speakerdeck.com/thockin), Kubernetes is "a story with two parts" where setting up a Kubernetes cluster is not the easy part and often challenging due to variations in infrastructure. This is in particular true when it comes to production-ready deployments of Kubernetes. In the public cloud space, a customer could choose a service like Google Container Engine (GKE) to do this job. Since customers have less options on-premise, often they have to consider the deployment by themselves.

Cloud Load Control addresses these issues. It enables customers to reliably and readily provision a production grade Kubernetes clusters on their own infrastructure, with the following benefits:

- Proven setup process, lowers risk of problems while setting up the cluster
- Reduction of provisioning time to minutes
- Repeatable process, relevant especially for large, multi-tenant environments

Cloud Load Control delivers these benefits for a range of platforms, starting from selected OpenStack distributions in the first versions of Cloud Load Control, and successively adding more platforms depending on customer demand. &nbsp;We are especially excited about the option to remove the virtualization layer and support Kubernetes bare-metal on Fujitsu servers in the long run. By removing a layer of complexity, the total cost to run the system would be decreased and the missing hypervisor would increase performance.

Right now we are in the process of contributing a generic provider to set up Kubernetes on OpenStack. As a next step in driving multi-platform support, Docker-based deployment of Kubernetes seems to be crucial. We plan to contribute to this feature to ensure it is going to be Beta in Kubernetes 1.3.
**Efficient operations**  

Reducing operation costs is the target of any organization providing IT infrastructure. This can be achieved by increasing the efficiency of operations and helping operators to get their job done. Considering large-scale container infrastructures, we found it is important to differentiate between two types of operations:

- Platform-oriented, relates to the overall infrastructure, often including various systems, one of which might be Kubernetes.
- Application-oriented, focusses rather on a single, or a small set of applications deployed on Kubernetes.

Kubernetes is already great for the application-oriented part. Cloud Load Control was created to help platform-oriented operators to efficiently manage Kubernetes as part of the overall infrastructure and make it easy to execute Kubernetes tasks relevant to them.

The first version of Cloud Load Control provides a user interface integrated in the OpenStack Horizon dashboard which enables the Platform ops to create and manage their Kubernetes clusters.

 ![](https://lh3.googleusercontent.com/s_ZBCL1arPc3SiO2vW6OYcNIp0ZPPoNboFQX1ly0ZB_m8LTJ5krzQZjR9_xyHBHc6k6KRHpTmzmoidUqhDiV4f6SMRR7wmb0-9CgXo1TRQQFa-4mwlOfri6QieHPYdHVg2B0K2oE)

Clusters are treated as first-class citizens of OpenStack. Their creation is as simple as the creation of a virtual machine. Operators do not need to learn a new system or method of provisioning, and the self-service approach enables large organizations to rapidly provide the Kubernetes infrastructure to their tenants.

An intuitive UI is crucial for the simplification of operations. This is why we heavily contributed to the[Kubernetes Dashboard](https://github.com/kubernetes/dashboard) project and ship it in Cloud Load Control. Especially for operators who don’t know the Kubernetes CLI by heart, because they have to care about other systems too, a great UI is perfectly suitable to get typical operational tasks done, such as checking the health of the system or deploying a new application.

Monitoring is essential. With the dashboard, it is possible to get insights on cluster level. To ensure that the OpenStack operators have a deep understanding of their platform, we will soon add an integration with[Monasca](https://wiki.openstack.org/wiki/Monasca), OpenStack’s monitoring-as-a-service project, so metrics of Kubernetes can be analyzed together with OpenStack metrics from a single point of access.
**Quality and enterprise-grade support**  

As a Japanese company, quality and customer focus have the highest priority in every product and service we ship. This is where the actual value of Cloud Cloud Control comes from: it provides a specific version of the open source software which has been intensively tested and hardened to ensure stable operations on a particular set of platforms.

Acknowledging that container technology and Kubernetes is new territory for a lot of enterprises, expert assistance is the key for setting up and running a production-grade container infrastructure. Cloud Load Control comes with a support service leveraging Fujitsu’s proven support structure. This enables support also for customers operating Kubernetes in different regions of the world, like Europe and Japan, as part of the same offering.
**Conclusion**  

2014 seems to be light years away, we believe the decision for Kubernetes was the right one. It is built from the ground-up to enable the creation of container-based, distributed applications, and best supports this use case.

With Cloud Load Control, we’re excited to enable enterprises to run Kubernetes in production environments and to help their operators to efficiently use it, so DevOps teams can build awesome applications on top of it.
