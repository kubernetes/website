---
title: " Scaling Kubernetes deployments with Policy-Based Networking "
date: 2017-01-19
slug: scaling-kubernetes-deployments-with-policy-base-networking
url: /blog/2017/01/Scaling-Kubernetes-Deployments-With-Policy-Base-Networking
author: >
  Harmeet Sahni (Nuage Networks)
---
Although it’s just been eighteen-months since Kubernetes 1.0 was released, we’ve seen Kubernetes emerge as the leading container orchestration platform for deploying distributed applications. One of the biggest reasons for this is the vibrant open source community that has developed around it. The large number of Kubernetes contributors come from diverse backgrounds means we, and the community of users, are assured that we are investing in an open platform. Companies like Google (Container Engine), Red Hat (OpenShift), and CoreOS (Tectonic) are developing their own commercial offerings based on Kubernetes. This is a good thing since it will lead to more standardization and offer choice to the users.&nbsp;  

**Networking requirements for Kubernetes applications**  

For companies deploying applications on Kubernetes, one of biggest questions is how to deploy and orchestrate containers at scale. They’re aware that the underlying infrastructure, including networking and storage, needs to support distributed applications. Software-defined networking (SDN) is a great fit for such applications because the flexibility and agility of the networking infrastructure can match that of the applications themselves. The networking requirements of such applications include:  


- Network automation&nbsp;
- Distributed load balancing and service discovery
- Distributed security with fine-grained policies
- QoS Policies
- Scalable Real-time Monitoring
- Hybrid application environments with Services spread across Containers, VMs and Bare Metal Servers
- Service Insertion (e.g. firewalls)
- Support for Private and Public Cloud deployments

**Kubernetes Networking**  

Kubernetes provides a core set of platform services exposed through [APIs](/docs/api/). The platform can be extended in several ways through the extensions API, plugins and labels. This has allowed a wide variety integrations and tools to be developed for Kubernetes. Kubernetes recognizes that the network in each deployment is going to be unique. Instead of trying to make the core system try to handle all those use cases, Kubernetes chose to make the network pluggable.  

With [Nuage Networks](http://www.nuagenetworks.net/) we provide a scalable policy-based SDN platform. The platform is managed by a Network Policy Engine that abstracts away the complexity associated with configuring the system. There is a separate SDN Controller that comes with a very rich routing feature set and is designed to scale horizontally. Nuage uses the open source [Open vSwitch (OVS)](http://www.openvswitch.org/) for the data plane with some enhancements in the OVS user space. Just like Kubernetes, Nuage has embraced openness as a core tenet for its platform. Nuage provides open APIs that allow users to orchestrate their networks and integrate network services such as firewalls, load balancers, IPAM tools etc. Nuage is supported in a wide variety of cloud platforms like OpenStack and VMware as well as container platforms like Kubernetes and others.  

The Nuage platform implements a Kubernetes [network plugin](/docs/admin/network-plugins/) that creates VXLAN overlays to provide seamless policy-based networking between Kubernetes Pods and non-Kubernetes environments (VMs and bare metal servers). Each Pod is given an IP address from a network that belongs to a [Namespace](/docs/user-guide/namespaces/) and is not tied to the Kubernetes node.  

As cloud applications are built using microservices, the ability to control traffic among these microservices is a fundamental requirement. It is important to point out that these network policies also need to control traffic that is going to/coming from external networks and services. Nuage’s policy abstraction model makes it easy to declare fine-grained ingress/egress policies for applications. Kubernetes has a beta [Network Policy API](/docs/user-guide/networkpolicies/) implemented using the Kubernetes Extensions API. Nuage implements this Network Policy API to address a wide variety of policy use cases such as:  


- Kubernetes Namespace isolation
- Inter-Namespace policies
- Policies between groups of Pods (Policy Groups) for Pods in same or different Namespaces
- Policies between Kubernetes Pods/Namespaces and external Networks/Services



[![](https://3.bp.blogspot.com/-jJK65zh2wE8/WIE5o3HkXFI/AAAAAAAAA7U/QkoCoYnTWAEz60H0nyP4_wN0tVG3WVWAwCEw/s640/k8spolicy.png)](https://3.bp.blogspot.com/-jJK65zh2wE8/WIE5o3HkXFI/AAAAAAAAA7U/QkoCoYnTWAEz60H0nyP4_wN0tVG3WVWAwCEw/s1600/k8spolicy.png)

A key question for users to consider is the scalability of the policy implementation. Some networking setups require creating access control list (ACL) entries telling Pods how they can interact with one another. In most cases, this eventually leads to an n-squared pileup of ACL entries. The Nuage platform avoids this problem and can quickly assign a policy that applies to a whole group of Pods. The Nuage platform implements these policies using a fully distributed stateful firewall based on OVS.  

Being able to monitor the traffic flowing between Kubernetes Pods is very useful to both development and operations teams. The Nuage platform’s real-time analytics engine enables visibility and security monitoring for Kubernetes applications. Users can get a visual representation of the traffic flows between groups of Pods, making it easy to see how the network policies are taking effect. Users can also get a rich set of traffic and policy statistics. Further, users can set alerts to be triggered based on policy event thresholds.  


[![](https://4.bp.blogspot.com/-5VjajIIvq-A/WIE5qN2nsNI/AAAAAAAAA7U/mMfMQpeFvH85MHNbohJifEnW658l3w1agCEw/s640/k8spolicy2.png)](https://4.bp.blogspot.com/-5VjajIIvq-A/WIE5qN2nsNI/AAAAAAAAA7U/mMfMQpeFvH85MHNbohJifEnW658l3w1agCEw/s1600/k8spolicy2.png)


**Conclusion**    

Even though we started working on our integration with Kubernetes over a year ago, it feels we are just getting started. We have always felt that this is a truly open community and we want to be an integral part of it. You can find out more about our Kubernetes integration on our [GitHub page](https://github.com/nuagenetworks/nuage-kubernetes).  

