---
title: " AppFormix: Helping Enterprises Operationalize Kubernetes "
date: 2016-03-29
slug: appformix-helping-enterprises
url: /blog/2016/03/Appformix-Helping-Enterprises
author: >
   Sumeet Singh (AppFormix)
---

If you run clouds for a living, you’re well aware that the tools we've used since the client/server era for monitoring, analytics and optimization just don’t cut it when applied to the agile, dynamic and rapidly changing world of modern cloud infrastructure.  

And, if you’re an operator of enterprise clouds, you know that implementing containers and container cluster management is all about giving your application developers a more agile, responsive and efficient cloud infrastructure. Applications are being rewritten and new ones developed – not for legacy environments where relatively static workloads are the norm, but for dynamic, scalable cloud environments. The dynamic nature of cloud native applications coupled with the shift to continuous deployment means that the demands placed by the applications on the infrastructure are constantly changing.  

This shift necessitates infrastructure transparency and real-time monitoring and analytics. Without these key pieces, neither applications nor their underlying plumbing can deliver the low-latency user experience end users have come to expect.  
&nbsp;&nbsp;  
**AppFormix Architectural Review**  
From an operational standpoint, it is necessary to understand how applications are consuming infrastructure resources in order to maximize ROI and guarantee SLAs. AppFormix software empowers operators and developers to monitor, visualize, and control how physical resources are utilized by cloud workloads.&nbsp;  

At the center of the software, the AppFormix Data Platform provides a distributed analysis engine that performs configurable, real-time evaluation of in-depth, high-resolution metrics. On each host, the resource-efficient AppFormix Agent collects and evaluates multi-layer metrics from the hardware, virtualization layer, and up to the application. Intelligent agents offer sub-second response times that make it possible to detect and solve problems before they start to impact applications and users. The raw data is associated with the elements that comprise a cloud-native environment: applications, virtual machines, containers, hosts. The AppFormix Agent then publishes metrics and events to a Data Manager that stores and forwards the data to Analytics modules. Events are based on predefined or dynamic conditions set by users or infrastructure operators to make sure that SLAs and policies are being met.  


| ![](https://lh3.googleusercontent.com/sPfaXresP1wDPPVERwQC1eZHDKtwrD1buAmMhLcWxwbnPmJIgJql1VIn7mNoh_QSPxcMTzjraQulg3pSta6OM9VvJn0hgrQKSteP8ijIp14E9JAzJnUd5Ds_rvHQwj4IHPQ7Jhsr) |
| Figure 1: Roll-up summary view of the Kubernetes cluster. Operators and Users can define their SLA policies and AppFormix provides with a real-time view of the health of all elements in the Kubernetes cluster.&nbsp; |



| ![](https://lh6.googleusercontent.com/0kOaFmyX8LWqbvGGuyFFl08uM_TC3_uFrwQslkEdKmBHZHzrSAsqU7bDb0w0cHDMLCWJa6uz9rfFtsf6BOvoKgNkpUeh7wwPTveC69X9JZru0VpwrT_hzACr0JADjgDV5EM0UVyc) |
| Figure 2: Real-Time visualization of telemetry from a Kubernetes node provides a quick overview of resource utilization on the host as well as resources consumed by the pods and containers. The user defined Labels make is easy to capture namespaces, and other metadata. |

Additional subsystems are the Policy Controller and Analytics. The Policy Controller manages policies for resource monitoring, analysis, and control. It also provides role-based access control. The Analytics modules analyze metrics and events produced by Data Platform, enabling correlation across multiple elements to provide higher-level information to operators and developers. The Analytics modules may also configure policies in Policy Controller in response to conditions in the infrastructure.  

AppFormix organizes elements of cloud infrastructure around hosts and instances (either containers or virtual machines), and logical groups of such elements. AppFormix integrates with cloud platforms using Adapter modules that discover the physical and virtual elements in the environment and configure those elements into the Policy Controller.  

**Integrating AppFormix with Kubernetes**  
Enterprises often run many environments located on- or off-prem, as well as running different compute technologies (VMs, containers, bare metal). The analytics platform we’ve developed at AppFormix gives Kubernetes users a single pane of glass from which to monitor and manage container clusters in private and hybrid environments.  

The AppFormix Kubernetes Adapter leverages the REST-based APIs of Kubernetes to discover nodes, pods, containers, services, and replication controllers. With the relational information about each element, Kubernetes Adapter is able to represent all of these elements in our system. A pod is a group of containers. A service and a replication controller are both different types of pod groups. In addition, using the watch endpoint, Kubernetes Adapter stays aware of changes to the environment.  

**DevOps in the Enterprise with AppFormix**  
With AppFormix, developers and operators can work collaboratively to optimize applications and infrastructure. Users can access a self-service IT experience that delivers visibility into CPU, memory, storage, and network consumption by each layer of the stack: physical hardware, platform, and application software.&nbsp;  


- **Real-time multi-layer performance metrics** - In real-time, developers can view multi-layer metrics that show container resource consumption in context of the physical node on which it executes. With this context, developers can determine if application performance is limited by the physical infrastructure, due to contention or resource exhaustion, or by application design. &nbsp;
- **Proactive resource control** - AppFormix Health Analytics provides policy-based actions in response to conditions in the cluster. For example, when resource consumption exceeds threshold on a worker node, Health Analytics can remove the node from the scheduling pool by invoking Kubernetes REST APIs. This dynamic control is driven by real-time monitoring at each node.
- **Capacity planning** - Kubernetes will schedule workloads, but operators need to understand how the resources are being utilized. What resources have the most demand? How is demand trending over time? Operators can generate reports that provide necessary data for capacity planning.




As you can see, we’re working hard to give Kubernetes users a useful, performant toolset for both OpenStack and Kubernetes environments that allows operators to deliver self-service IT to their application developers. We’re excited to be partner contributing to the Kubernetes ecosystem and community.
