---
title: " High performance network policies in Kubernetes clusters "
date: 2016-09-21
slug: high-performance-network-policies-kubernetes
url: /blog/2016/09/High-Performance-Network-Policies-Kubernetes
author: >
  Juergen Brendel (Pani Networks),
  Pritesh Kothari  (Pani Networks),
  Chris Marin (Pani Networks)
---

**Network Policies**



Since the release of Kubernetes 1.3 back in July, users have been able to define and enforce network policies in their clusters. These policies are firewall rules that specify permissible types of traffic to, from and between pods. If requested, Kubernetes blocks all traffic that is not explicitly allowed. Policies are applied to groups of pods identified by common labels. Labels can then be used to mimic traditional segmented networks often used to isolate layers in a multi-tier application: You might identify your front-end and back-end pods by a specific “segment” label, for example. Policies control traffic between those segments and even traffic to or from external sources.



**Segmenting traffic**



What does this mean for the application developer? At last, Kubernetes has gained the necessary capabilities to provide "[defence in depth](https://en.wikipedia.org/wiki/Defense_in_depth_(computing))". Traffic can be segmented and different parts of your application can be secured independently. For example, you can very easily protect each of your services via specific network policies: All the pods identified by a [Replication Controller](/docs/user-guide/replication-controller/) behind a service are already identified by a specific label. Therefore, you can use this same label to apply a policy to those pods.



Defense in depth has long been recommended as best [practice](https://kubernetes.io/blog/2016/08/security-best-practices-kubernetes-deployment). This kind of isolation between different parts or layers of an application is easily achieved on AWS and OpenStack by applying security groups to VMs.



However, prior to network policies, this kind of isolation for containers was not possible. VXLAN overlays can provide simple network isolation, but application developers need more fine grained control over the traffic accessing pods. As you can see in this simple example, Kubernetes network policies can manage traffic based on source and origin, protocol and port.





```
apiVersion: extensions/v1beta1  
kind: NetworkPolicy  
metadata:  
 name: pol1  
spec:  
 podSelector:  
   matchLabels:  
     role: backend  
 ingress:  
 - from:  
   - podSelector:  
      matchLabels:  
       role: frontend  
   ports:  
   - protocol: tcp  
     port: 80
 ```





**Not all network backends support policies**



Network policies are an exciting feature, which the Kubernetes community has worked on for a long time. However, it requires a networking backend that is capable of applying the policies. By themselves, simple routed networks or the commonly used [flannel](https://github.com/coreos/flannel) network driver, for example, cannot apply network policy.



There are only a few policy-capable networking backends available for Kubernetes today: Romana, [Calico](http://projectcalico.org/), and [Canal](https://github.com/tigera/canal); with [Weave](http://www.weave.works/) indicating support in the near future. Red Hat’s OpenShift includes network policy features as well.



We chose Romana as the back-end for these tests because it configures pods to use natively routable IP addresses in a full L3 configuration. Network policies, therefore, can be applied directly by the host in the Linux kernel using iptables rules. This results is a high performance, easy to manage network.



**Testing performance impact of network policies**



After network policies have been applied, network packets need to be checked against those policies to verify that this type of traffic is permissible. But what is the performance penalty for applying a network policy to every packet? Can we use all the great policy features without impacting application performance? We decided to find out by running some tests.



Before we dive deeper into these tests, it is worth mentioning that ‘performance’ is a tricky thing to measure, network performance especially so.



_Throughput_ (i.e. data transfer speed measured in Gpbs) and _latency_ (time to complete a request) are common measures of network performance. The performance impact of running an overlay network on throughput and latency has been examined previously [here](https://smana.kubespray.io/index.php/posts/kubernetes-net-bench) and [here](http://machinezone.github.io/research/networking-solutions-for-kubernetes/). What we learned from these tests is that Kubernetes networks are generally pretty fast, and servers have no trouble saturating a 1G link, with or without an overlay. It's only when you have 10G networks that you need to start thinking about the overhead of encapsulation.



This is because during a typical network performance benchmark, there’s no application logic for the host CPU to perform, leaving it available for whatever network processing is required. **_For this reason we ran our tests in an operating range that did not saturate the link, or the CPU. This has the effect of isolating the impact of processing network policy rules on the host_**. For these tests we decided to measure latency as measured by the average time required to complete an HTTP request across a range of response sizes.





**Test setup**

- Hardware: Two servers with Intel Core i5-5250U CPUs (2 core, 2 threads per core) running at 1.60GHz, 16GB RAM and 512GB SSD. NIC: Intel Ethernet Connection I218-V (rev 03)
- Ubuntu 14.04.5
- Kubernetes 1.3 for data collection (verified samples on [v1.4.0-beta.5](http://v1.4.0-beta.5/))
- Romana v0.9.3.1
- Client and server load test [software](https://github.com/paninetworks/testing-tools)

For the tests we had a client pod send 2,000 HTTP requests to a server pod. HTTP requests were sent by the client pod at a rate that ensured that neither the server nor network ever saturated. We also made sure each request started a new TCP session by disabling persistent connections (i.e. HTTP [keep-alive](https://en.wikipedia.org/wiki/HTTP_persistent_connection)). We ran each test with different response sizes and measured the average request duration time (how long does it take to complete a request of that size). Finally, we repeated each set of measurements with different policy configurations.



Romana detects Kubernetes network policies when they’re created, translates them to Romana’s own policy format, and then applies them on all hosts. Currently, Kubernetes network policies only apply to ingress traffic. This means that outgoing traffic is not affected.

First, we conducted the test without any policies to establish a baseline. We then ran the test again, increasing numbers of policies for the test's network segment. The policies were of the common “allow traffic for a given protocol and port” format. To ensure packets had to traverse all the policies, we created a number of policies that did not match the packet, and finally a policy that would result in acceptance of the packet.



The table below shows the results, measured in milliseconds for different request sizes and numbers of policies:



Response Size

|Policies |.5k |1k |10k |100k |1M |
|---|---|---|---|---|
|0 |0.732 |0.738 |1.077 |2.532 |10.487 |
|10 |0.744 |0.742 |1.084 |2.570 |10.556 |
|50 |0.745 |0.755 |1.086 |2.580 |10.566 |
|100 |0.762 |0.770 |1.104 |2.640 |10.597 |
|200 |0.783 |0.783 |1.147 |2.652 |10.677 |



What we see here is that, as the number of policies increases, processing network policies introduces a very small delay, never more than 0.2ms, even after applying 200 policies. For all practical purposes, no meaningful delay is introduced when network policy is applied. Also worth noting is that doubling the response size from 0.5k to 1.0k had virtually no effect. This is because for very small responses, the fixed overhead of creating a new connection dominates the overall response time (i.e. the same number of packets are transferred).



 ![](https://lh3.googleusercontent.com/2M6D3zIPSiBE1LUZ3I5oVlZtfVVGP-aK6P3Qsb_siG0Jy16zeE1pNIZGLxeRh4SLCNUKY53A0Qbcm-dwwqz6ResSLjdb1oosXywOK5oK_uU6inVWQTPtztj9cv_6JK-EESVeeoq9)





Note: .5k and 1k lines overlap at ~.8ms in the chart above



Even as a percentage of baseline performance, the impact is still very small. The table below shows that for the smallest response sizes, the worst case delay remains at 7%, or less, up to 200 policies. For the larger response sizes the delay drops to about 1%.





Response Size

|Policies | .5k | 1k | 10k | 100k | 1M |
|---|---|---|---|---|----|
| 0 | 0.0% | 0.0% | 0.0% | 0.0% | 0.0% |
| 10 | -1.6% | -0.5% | -0.6% | -1.5% | -0.7% |
| 50 | -1.8% | -2.3% | -0.8% | -1.9% | -0.8% |
| 100 | -4.1% | -4.3% | -2.5% | -4.3% | -1.0% |
| 200 | -7.0% | -6.1% | -6.5% | -4.7% | -1.8% |



 ![](https://lh6.googleusercontent.com/Bwpuko0UBaTQrL0h9_wDtnmsa0ijk6KD82BDVtHCCMuM4zATPppHKLv9lDoWBYvTbO89nPqIIA5jLYMfdxv7O6jIwRqHg_chVvBOz0-yZ_j2YhXop5Tg2a-a86swu_tBQhEPVGH3)







What is also interesting in these results is that as the number of policies increases, we notice that larger requests experience a smaller relative (i.e. percentage) performance degradation.



This is because when Romana installs iptables rules, it ensures that packets belonging to established connection are evaluated first. The full list of policies only needs to be traversed for the first packets of a connection. After that, the connection is considered ‘established’ and the connection’s state is stored in a fast lookup table. For larger requests, therefore, most packets of the connection are processed with a quick lookup in the ‘established’ table, rather than a full traversal of all rules. This iptables optimization results in performance that is largely independent of the number of network policies.



Such ‘flow tables’ are common optimizations in network equipment and it seems that iptables uses the same technique quite effectively.



Its also worth noting that in practise, a reasonably complex application may configure a few dozen rules per segment. It is also true that common network optimization techniques like Websockets and persistent connections will improve the performance of network policies even further (especially for small request sizes), since connections are held open longer and therefore can benefit from the established connection optimization.



These tests were performed using Romana as the backend policy provider and other network policy implementations may yield different results. However, what these tests show is that for almost every application deployment scenario, network policies can be applied using Romana as a network back end without any negative impact on performance.



If you wish to try it for yourself, we invite you to check out Romana. In our GitHub repo you can find an easy to use installer, which works with AWS, Vagrant VMs or any other servers. You can use it to quickly get you started with a Romana powered Kubernetes or OpenStack cluster.
