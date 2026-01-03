---
title: " Updates to Performance and Scalability in Kubernetes 1.3 -- 2,000 node 60,000 pod clusters "
date: 2016-07-07
slug: update-on-kubernetes-for-windows-server-containers
url: /blog/2016/07/Update-On-Kubernetes-For-Windows-Server-Containers
author: >
   Wojciech Tyczynski (Google)
---
We are proud to announce that with the [release of version 1.3](https://kubernetes.io/blog/2016/07/kubernetes-1-3-bridging-cloud-native-and-enterprise-workloads/), Kubernetes now supports 2000-node clusters with even better end-to-end pod startup time. The latency of our API calls are within our one-second [Service Level Objective (SLO)](https://en.wikipedia.org/wiki/Service_level_objective) and most of them are even an order of magnitude better than that. It is possible to run larger deployments than a 2,000 node cluster, but performance may be degraded and it may not meet our strict SLO.

In this blog post we discuss the detailed performance results from Kubernetes 1.3 and what changes we made from version 1.2 to achieve these results. We also describe Kubemark, a performance testing tool that we’ve integrated into our continuous testing framework to detect performance and scalability regressions.  

**Evaluation Methodology**  

We have described our test scenarios in a [previous blog post](https://kubernetes.io/blog/2016/03/1000-nodes-and-beyond-updates-to-Kubernetes-performance-and-scalability-in-12). The biggest change since the 1.2 release is that in our API responsiveness tests we now create and use multiple namespaces. In particular for the 2000-node/60000 pod cluster tests we create 8 namespaces. The change was done because we believe that users of such very large clusters are likely to use many namespaces, certainly at least 8 in the cluster in total.  

**Metrics from Kubernetes 1.3**  

So, what is the performance of Kubernetes version 1.3? The following graph shows the end-to-end pod startup latency with a 2000 and 1000 node cluster. For comparison we show the same metric from Kubernetes 1.2 with a 1000-node cluster.  



 ![](https://lh4.googleusercontent.com/muN6ySMhN7XhmNU_cuEu7CJbcnNuun_FeNidcvv1QVqtpWxTJUZVnKNDwXj9ttAsLBPDBlMi6l_-_sBxEWYvfK7SVp9bjxVa91VrR60v6Y8P8c5AQEl01Bt1cDTj4uVRPOUBn89e "Wykres")
The next graphs show API response latency for a v1.3 2000-node cluster.  



 ![](https://lh5.googleusercontent.com/3wVH7grZXIlhtNNvzXXRMcqMtHhQUASnNSpu_EHOsQg4QrEAZvr_QeWmYWO0tLo3B-5uW1SThkod3eRauZcWprZn_Wlu14B1NSCRH3DI-IzqyLwC11IDfhNiskUqy4bOdHb9i1JY "Wykres")





 ![](https://lh6.googleusercontent.com/U786KhDmaKjQPjPcN4bSLTgeAkdUp-X8sngo0pLVJzznb0ruo2elL10gjYnSaRq7EuCfvuJi-ab9PX0BloOArad-22uXVgPQ4kjq4cw2Zx1k0xsQl1FOLBPDbrRrMn9yX5NaEhap "Wykres")

**How did we achieve these improvements?**  

The biggest change that we made for scalability in Kubernetes 1.3 was adding an efficient [Protocol Buffer](https://developers.google.com/protocol-buffers/)-based serialization format to the API as an alternative to JSON. It is primarily intended for communication between Kubernetes control plane components, but all API server clients can use this format. All Kubernetes control plane components now use it for their communication, but the system continues to support JSON for backward compatibility.  

We didn’t change the format in which we store cluster state in etcd to Protocol Buffers yet, as we’re still working on the upgrade mechanism. But we’re very close to having this ready, and we expect to switch the storage format to Protocol Buffers in Kubernetes 1.4. Our experiments show that this should reduce pod startup end-to-end latency by another 30%.  

**How do we test Kubernetes at scale?**  

Spawning clusters with 2000 nodes is expensive and time-consuming. While we need to do this at least once for each release to collect real-world performance and scalability data, we also need a lighter-weight mechanism that can allow us to quickly evaluate our ideas for different performance improvements, and that we can run continuously to detect performance regressions. To address this need we created a tool call “Kubemark.”  

**What is “Kubemark”?**  

Kubemark is a performance testing tool which allows users to run experiments on emulated clusters. We use it for measuring performance in large clusters.  

A Kubemark cluster consists of two parts: a real master node running the normal master components, and a set of “hollow” nodes. The prefix “hollow” means an implementation/instantiation of a component with some “moving parts” mocked out. The best example is hollow-kubelet, which pretends to be an ordinary Kubelet, but doesn’t start any containers or mount any volumes. It just claims it does, so from master components’ perspective it behaves like a real Kubelet.  

Since we want a Kubemark cluster to be as similar to a real cluster as possible, we use the real Kubelet code with an injected fake Docker client. Similarly hollow-proxy (KubeProxy equivalent) reuses the real KubeProxy code with injected no-op Proxier interface (to avoid mutating iptables).  



Thanks to those changes  


- many hollow-nodes can run on a single machine, because they are not modifying the environment in which they are running
- without real containers running and the need for a container runtime (e.g. Docker), we can run up to 14 hollow-nodes on a 1-core machine.
- yet hollow-nodes generate roughly the same load on the API server as their “whole” counterparts, so they provide a realistic load for performance testing [the only fundamental difference is that we are not simulating any errors that can happens in reality (e.g. failing containers) - adding support for this is a potential extension to the framework in the future]

**How do we set up Kubemark clusters?**  



To create a Kubemark cluster we use the power the Kubernetes itself gives us - we run Kubemark clusters on Kubernetes. Let’s describe this in detail.  

In order to create a N-node Kubemark cluster, we:  


- create a regular Kubernetes cluster where we can run N hollow-nodes&nbsp;[e.g. to create 2000-node Kubemark cluster, we create a regular Kubernetes cluster with 22 8-core nodes]
- create a dedicated VM, where we start all master components for our Kubemark cluster (etcd, apiserver, controllers, scheduler, …).&nbsp;
- schedule N “hollow-node” pods on the base Kubernetes cluster. Those hollow-nodes are configured to talk to the Kubemark API server running on the dedicated VM
- finally, we create addon pods (currently just Heapster) by scheduling them on the base cluster and configuring them to talk to the Kubemark API server
Once this done, you have a usable Kubemark cluster that you can run your (performance) tests on.&nbsp;We have scripts for doing all of this on Google Compute Engine (GCE). For more details, take a look at our [guide](https://github.com/kubernetes/kubernetes/blob/release-1.3/docs/devel/kubemark-guide.md#starting-a-kubemark-cluster).  


One thing worth mentioning here is that while running Kubemark, underneath we’re also testing Kubernetes correctness. Obviously your Kubemark cluster will not work correctly if the base Kubernetes cluster under it doesn’t work.&nbsp;  

**Performance measured in real clusters vs Kubemark**  


Crucially, the performance of Kubemark clusters is mostly similar to the performance of real clusters. For the pod startup end-to-end latency, as shown in the graph below, the difference is negligible:  

 ![](https://lh6.googleusercontent.com/_pC-6DKVzZZoL7ek8sHhYqBi7Mmxw0aHU057RfYYam_qOIv0xtKc0dq6XfY9RXeoxMkLnYbg1RWwPAbwJEccAPIBEldwBMoFv8ZDcSiMFBhNuHxe9kSvN0UUHsVJTX4f7UH_APwi "Wykres")

For the API-responsiveness, the differences are higher, though generally less than 2x. However, trends are exactly the same: an improvement/regression in a real cluster is visible as a similar percentage drop/increase in metrics in Kubemark.  

 ![](https://lh3.googleusercontent.com/-2zrDvCks-LwStyskBlcIVUETPwEopcpvHGRxbaf0fIb0stsP-XuRo5PRs3dWO3qojcyf89QNzY5HIt5X0AuOKgMqOCl4r4gI2_h9cNre2RonNGyB8PvksBNOeONuwu6gXYGV4w- "Wykres")
**Conclusion**  

We continue to improve the performance and scalability of Kubernetes. In this blog post we&nbsp;  
showed that the 1.3 release scales to 2000 nodes while meeting our responsiveness SLOs  
explained the major change we made to improve scalability from the 1.2 release, and&nbsp;  
described Kubemark, our emulation framework that allows us to quickly evaluate the performance impact of code changes, both when experimenting with performance improvement ideas and to detect regressions as part of our continuous testing infrastructure.  

Please join our community and help us build the future of Kubernetes! If you’re particularly interested in scalability, participate by:  


- chatting with us on our [Slack channel](https://kubernetes.slack.com/messages/sig-scale/)
- joining the scalability [Special Interest Group](https://github.com/kubernetes/community/blob/master/README.md#special-interest-groups-sig), which meets every Thursday at 9 AM Pacific Time on this [SIG-Scale Hangout](https://plus.google.com/hangouts/_/google.com/k8scale-hangout)

For more information about the Kubernetes project, visit [kubernetes.io](http://kubernetes.io/) and follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio).
