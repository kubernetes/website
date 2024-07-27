---
title: " 1000 nodes and beyond: updates to Kubernetes performance and scalability in 1.2 "
date: 2016-03-28
slug: 1000-nodes-and-beyond-updates-to-kubernetes-performance-and-scalability-in-12
url: /blog/2016/03/1000-Nodes-And-Beyond-Updates-To-Kubernetes-Performance-And-Scalability-In-12
author: >
   Wojciech Tyczynski (Google)
---
_**Editor's note:**  this is the first in a [series of in-depth posts](/blog/2016/03/five-days-of-kubernetes-12) on what's new in Kubernetes 1.2_  

We're proud to announce that with the [release of 1.2](https://kubernetes.io/blog/2016/03/kubernetes-1-2-even-more-performance-upgrades-plus-easier-application-deployment-and-management), Kubernetes now supports 1000-node clusters, with a reduction of 80% in 99th percentile tail latency for most API operations. This means in just six months, we've increased our overall scale by 10 times while maintaining a great user experience&nbsp;—&nbsp;the&nbsp;99th percentile pod startup times are less than 3 seconds, and 99th percentile latency of most API operations is tens of milliseconds (the exception being LIST operations, which take hundreds of milliseconds in very large clusters).

Words are fine, but nothing speaks louder than a demo. Check this out!  



In the above video, you saw the cluster scale up to 10 M queries per second (QPS) over 1,000 nodes, including a rolling update, with zero downtime and no impact to tail latency. That’s big enough to be one of the top 100 sites on the Internet!  

In this blog post, we’ll cover the work we did to achieve this result, and discuss some of our future plans for scaling even higher.  


### Methodology&nbsp;
We benchmark Kubernetes scalability against the following Service Level Objectives (SLOs):  

1. **API responsiveness** <sup>[1](https://www.blogger.com/blogger.g?blogID=112706738355446097#1)</sup> 99% of all API calls return in less than 1s&nbsp;
2. **Pod startup time** : 99% of pods and their containers (with pre-pulled images) start within 5s.&nbsp;
We say Kubernetes scales to a certain number of nodes only if both of these SLOs are met. We continuously collect and report the measurements described above as part of the project test framework. This battery of tests breaks down into two parts: API responsiveness and Pod Startup Time.  


### API responsiveness for user-level abstractions[2](https://www.blogger.com/blogger.g?blogID=112706738355446097#2)&nbsp;
Kubernetes offers high-level abstractions for users to represent their applications. For example, the ReplicationController is an abstraction representing a collection of [pods](/docs/user-guide/pods/). Listing all ReplicationControllers or listing all pods from a given ReplicationController is a very common use case. On the other hand, there is little reason someone would want to list all pods in the system&nbsp;—&nbsp;for example, 30,000 pods (1000 nodes with 30 pods per node) represent ~150MB of data (~5kB/pod \* 30k pods). So this test uses ReplicationControllers.  

For this test (assuming N to be number of nodes in the cluster), we:  

1. Create roughly 3xN ReplicationControllers of different sizes (5, 30 and 250 replicas), which altogether have 30xN replicas. We spread their creation over time (i.e. we don’t start all of them at once) and wait until all of them are running.&nbsp;

2. Perform a few operations on every ReplicationController (scale it, list all its instances, etc.), spreading those over time, and measuring the latency of each operation. This is similar to what a real user might do in the course of normal cluster operation.&nbsp;

3. Stop and delete all ReplicationControllers in the system.&nbsp;
For results of this test see the “Metrics for Kubernetes 1.2” section below.  

For the v1.3 release, we plan to extend this test by also creating Services, Deployments, DaemonSets, and other API objects.  


### Pod startup end-to-end latency[3](https://www.blogger.com/blogger.g?blogID=112706738355446097#3)&nbsp;
Users are also very interested in how long it takes Kubernetes to schedule and start a pod. This is true not only upon initial creation, but also when a ReplicationController needs to create a replacement pod to take over from one whose node failed.  

We (assuming N to be the number of nodes in the cluster):  

1. Create a single ReplicationController with 30xN replicas and wait until all of them are running. We are also running high-density tests, with 100xN replicas, but with fewer nodes in the cluster.&nbsp;

2. Launch a series of single-pod ReplicationControllers - one every 200ms. For each, we measure “total end-to-end startup time” (defined below).&nbsp;

3. Stop and delete all pods and replication controllers in the system.&nbsp;
We define “total end-to-end startup time” as the time from the moment the client sends the API server a request to create a ReplicationController, to the moment when “running & ready” pod status is returned to the client via watch. That means that “pod startup time” includes the ReplicationController being created and in turn creating a pod, scheduler scheduling that pod, Kubernetes setting up intra-pod networking, starting containers, waiting until the pod is successfully responding to health-checks, and then finally waiting until the pod has reported its status back to the API server and then API server reported it via watch to the client.  

While we could have decreased the “pod startup time” substantially by excluding for example waiting for report via watch, or creating pods directly rather than through ReplicationControllers, we believe that a broad definition that maps to the most realistic use cases is the best for real users to understand the performance they can expect from the system.  


### Metrics from Kubernetes 1.2&nbsp;

So what was the result?We run our tests on Google Compute Engine, setting the size of the master VM based on the size of the Kubernetes cluster. In particular for 1000-node clusters we use a n1-standard-32 VM for the master (32 cores, 120GB RAM).  


#### API responsiveness&nbsp;
The following two charts present a comparison of 99th percentile API call latencies for the Kubernetes 1.2 release and the 1.0 release on 100-node clusters. (Smaller bars are better)  

 ![](https://lh5.googleusercontent.com/ea2yIJitkQn0aPP9TnamEo9YybBE-r9GfhtOcbu57wG1oZvIUD8rL5_crbQrlUob4oX4G8jY1F0W4Qx2U3B8dPwyhc2gcKGBIVbl_4lJg1xUg91-Kg5HSmrUj-g92gMx7WdmfZVx)



We present results for LIST operations separately, since these latencies are significantly higher. Note that we slightly modified our tests in the meantime, so running current tests against v1.0 would result in higher latencies than they used to.  


 ![](https://lh6.googleusercontent.com/vMBFrgys0yEfFpftKN1Xg6iD5K9ONsBvYkLDe0lVQvtqYzmr8s7UG4O-hfIYd7otuqn1qeMFqfpHe0YyvOTYD8vS1A2M4JLf-Xi3dJZ6BEha9gM-bw5wkw3Ir5Wd2nnGuWEm8Egs)

We also ran these tests against 1000-node clusters. Note: We did not support clusters larger than 100 on GKE, so we do not have metrics to compare these results to. However, customers have reported running on 1,000+ node clusters since Kubernetes 1.0.  


 ![](https://lh4.googleusercontent.com/tTQyEvEU2x8xFPKVMMc9fLxtugUduo4Vw2RdV4DLFTJr3wnGolBDUkB4vfk9hrPwRpw8usQK8cq0AlIn5pbIOwEtKmsa33OJOhiTx6oKmS4lAk6o9RkhwRQiT0b-_qhfJxiu2YOG)


Since LIST operations are significantly larger, we again present them separately: All latencies, in both cluster sizes, are well within our 1 second SLO.  


 ![](https://lh4.googleusercontent.com/ch5-gMoeGWUDUjjMzurX-niiTMVg99wBx4rJI_tbeN-_3xSANB90BgfiNtP563a49TWQQOB-XXnoj3SOyxybQKMJmlhj5DUTGf47KNWJB3Ths_xLR9LCSjedksSjHYYWyXeb5eMb)


### Pod startup end-to-end latency&nbsp;
The results for “pod startup latency” (as defined in the “Pod-Startup end-to-end latency” section) are presented in the following graph. For reference we are presenting also results from v1.0 for 100-node clusters in the first part of the graph.  


 ![](https://lh4.googleusercontent.com/ecKvVkWZstjmKaitnEGHLFtauVdtG7v1zP1Zl0LZn05l47w7PgV_a0ufNWG-MSNFDWkbbvuSZJNNjLCmFFD_n-1JHbX4JeClteL6jMEqEnTY2y3TKyuKWQBNOXpK5J-zCKzk5Y5O)


As you can see, we substantially reduced tail latency in 100-node clusters, and now deliver low pod startup latency up to the largest cluster sizes we have measured. It is noteworthy that the metrics for 1000-node clusters, for both API latency and pod startup latency, are generally better than those reported for 100-node clusters just six months ago!  


### How did we make these improvements?&nbsp;

To make these significant gains in scale and performance over the past six months, we made a number of improvements across the whole system. Some of the most important ones are listed below.  


- _ **Created a “read cache” at the API server level&nbsp;** _  
([https://github.com/kubernetes/kubernetes/issues/15945](https://github.com/kubernetes/kubernetes/issues/15945) )  

Since most Kubernetes control logic operates on an ordered, consistent snapshot kept up-to-date by etcd watches (via the API server), a slight delay in that arrival of that data has no impact on the correct operation of the cluster. These independent controller loops, distributed by design for extensibility of the system, are happy to trade a bit of latency for an increase in overall throughput.  

In Kubernetes 1.2 we exploited this fact to improve performance and scalability by adding an API server read cache. With this change, the API server’s clients can read data from an in-memory cache in the API server instead of reading it from etcd. The cache is updated directly from etcd via watch in the background. Those clients that can tolerate latency in retrieving data (usually the lag of cache is on the order of tens of milliseconds) can be served entirely from cache, reducing the load on etcd and increasing the throughput of the server. This is a continuation of an optimization begun in v1.1, where we added support for serving watch directly from the API server instead of etcd:[https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/apiserver-watch.md](https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/apiserver-watch.md).&nbsp;

Thanks to contributions from Wojciech Tyczynski at Google and Clayton Coleman and Timothy St. Clair at Red Hat, we were able to join careful system design with the unique advantages of etcd to improve the scalability and performance of Kubernetes.&nbsp;
- **Introduce a “Pod Lifecycle Event Generator” (PLEG) in the Kubelet** ([https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/pod-lifecycle-event-generator.md](https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/pod-lifecycle-event-generator.md))&nbsp;  

Kubernetes 1.2 also improved density from a pods-per-node perspective&nbsp;—&nbsp;for v1.2 we test and&nbsp;advertise up to 100 pods on a single node (vs 30 pods in the 1.1 release). This improvement was possible because of diligent work by the Kubernetes community through an implementation of the Pod Lifecycle Event Generator (PLEG).  

The Kubelet (the Kubernetes node agent) has a worker thread per pod which is responsible for managing the pod’s lifecycle. In earlier releases each worker would periodically poll the underlying container runtime (Docker) to detect state changes, and perform any necessary actions to ensure the node’s state matched the desired state (e.g. by starting and stopping containers). As pod density increased, concurrent polling from each worker would overwhelm the Docker runtime, leading to serious reliability and performance issues (including additional CPU utilization which was one of the limiting factors for scaling up).  

To address this problem we introduced a new Kubelet subcomponent&nbsp;—&nbsp;the PLEG&nbsp;—&nbsp;to&nbsp;centralize&nbsp;state change detection and generate lifecycle events for the workers. With concurrent polling eliminated, we were able to lower the steady-state CPU usage of Kubelet and the container runtime by 4x. This also allowed us to adopt a shorter polling period, so as to detect and react to changes more quickly.&nbsp;
 ![](https://lh4.googleusercontent.com/TFTdd6TXdbvIiN2yGWCrDDSxqcgt1Chqbs4kzxnQJSTYLtT0TGznNfW3s8ZELlnr2KmDZMP2_tpQa-d2SKRqDN2gnBIoDVaJQAtG-VlH1624mHFxi1fHSSBhY53noHLiDhmyKK1v) ![](https://lh4.googleusercontent.com/sV7iqe-4aJsjcfXo2XenW3UhFkMNM-rVNMJAI00FNmD7dRg8wgK-NJQgRFtgeFsf5ekbNhoii6gSjupy8humK6jeHiSz93ZBmenHc72dYfqVRwgukWNH4LwmgcENRLyYx4lH1FOI)


- **Improved scheduler throughput** Kubernetes community members from CoreOS (Hongchao Deng and Xiang Li) helped to dive deep into the Kubernetes scheduler and dramatically improve throughput without sacrificing accuracy or flexibility. They cut total time to schedule 30,000 pods by nearly 1400%! You can read a great blog post on how they approached the problem here: [https://coreos.com/blog/improving-kubernetes-scheduler-performance.html](https://coreos.com/blog/improving-kubernetes-scheduler-performance.html)&nbsp;

- **A more efficient JSON parser** Go’s standard library includes a flexible and easy-to-use JSON parser that can encode and decode any Go struct using the reflection API. But that flexibility comes with a cost&nbsp;— reflection allocates lots of small objects that have to be tracked and garbage&nbsp;collected by the runtime. Our profiling bore that out, showing that a large chunk of both client and server time was spent in serialization. Given that our types don’t change frequently, we suspected that a significant amount of reflection could be bypassed through code generation.  

After surveying the Go JSON landscape and conducting some initial tests, we found the [ugorji codec](https://github.com/ugorji/go) library offered the most significant speedups - a 200% improvement in encoding and decoding JSON when using generated serializers, with a significant reduction in object allocations. After contributing fixes to the upstream library to deal with some of our complex structures, we switched Kubernetes and the go-etcd client library over. Along with some other important optimizations in the layers above and below JSON, we were able to slash the cost in CPU time of almost all API operations, especially reads.&nbsp;

- Other notable changes led to significant wins, including:&nbsp;

  - Reducing the number of broken TCP connections, which were causing unnecessary new TLS sessions: [https://github.com/kubernetes/kubernetes/issues/15664](https://github.com/kubernetes/kubernetes/issues/15664)

 ![resync.png](https://lh5.googleusercontent.com/JyjMps4dirKbPckos59nPIpX99nWyIFL0oWDQ2ykF888f9_N72FqmZsapU9qQf96p3nf1zEP-K2EWrHvMKiADCUuf9gM8tSpQihheHkA-Fa8TeTjksztrZlfmMlifq8okVUoVOWj)

  - Improving the performance of ReplicationController in large clusters:[https://github.com/kubernetes/kubernetes/issues/21672](https://github.com/kubernetes/kubernetes/issues/21672)

In both cases, the problem was debugged and/or fixed by Kubernetes community members, including Andy Goldstein and Jordan Liggitt from Red Hat, and Liang Mingqiang from NetEase.&nbsp;

### Kubernetes 1.3 and Beyond&nbsp;

Of course, our job is not finished. We will continue to invest in improving Kubernetes performance, as we would like it to scale to many thousands of nodes, just like Google’s [Borg](http://static.googleusercontent.com/media/research.google.com/en//pubs/archive/43438.pdf). Thanks to our investment in testing infrastructure and our focus on how teams use containers in production, we have already identified the next steps on our path to improving scale.&nbsp;



On deck for Kubernetes 1.3:&nbsp;

1. &nbsp;Our main bottleneck is still the API server, which spends the majority of its time just marshaling and unmarshaling JSON objects. We plan to [add support for protocol buffers](https://github.com/kubernetes/kubernetes/pull/22600) to the API as an optional path for inter-component communication and for storing objects in etcd. Users will still be able to use JSON to communicate with the API server, but since the majority of Kubernetes communication is intra-cluster (API server to node, scheduler to API server, etc.) we expect a significant reduction in CPU and memory usage on the master.&nbsp;

2. &nbsp;Kubernetes uses labels to identify sets of objects; For example, identifying which pods belong to a given ReplicationController requires iterating over all pods in a namespace and choosing those that match the controller’s label selector. The addition of an efficient indexer for labels that can take advantage of the existing API object cache will make it possible to quickly find the objects that match a label selector, making this common operation much faster.&nbsp;

3. Scheduling decisions are based on a number of different factors, including spreading pods based on requested resources, spreading pods with the same selectors (e.g. from the same Service, ReplicationController, Job, etc.), presence of needed container images on the node, etc. Those calculations, in particular selector spreading, have many opportunities for improvement&nbsp;—&nbsp;see [https://github.com/kubernetes/kubernetes/issues/22262](https://github.com/kubernetes/kubernetes/issues/22262) for just one suggested change.&nbsp;

4. We are also excited about the upcoming etcd v3.0 release, which was designed with Kubernetes use case in mind&nbsp;—&nbsp;it will both improve performance and introduce new features. Contributors&nbsp;from CoreOS have already begun laying the groundwork for moving Kubernetes to etcd v3.0 (see [https://github.com/kubernetes/kubernetes/pull/22604](https://github.com/kubernetes/kubernetes/pull/22604)).&nbsp;
While this list does not capture all the efforts around performance, we are optimistic we will achieve as big a performance gain as we saw going from Kubernetes 1.0 to 1.2.&nbsp;

### Conclusion&nbsp;

In the last six months we’ve significantly improved Kubernetes scalability, allowing v1.2 to run 1000-node clusters with the same excellent responsiveness (as measured by our SLOs) as we were previously achieving only on much smaller clusters. But that isn’t enough&nbsp;—&nbsp;we want to push Kubernetes even further and faster. Kubernetes v1.3 will improve the system’s scalability and responsiveness further, while continuing to add features that make it easier to build and run the most demanding container-based applications.&nbsp;



Please join our community and help us build the future of Kubernetes! There are many ways to participate. If you’re particularly interested in scalability, you’ll be interested in:&nbsp;

- Our [scalability slack channel](https://kubernetes.slack.com/messages/sig-scale/)
- The scalability “Special Interest Group”, which meets every Thursday at 9 AM Pacific Time at [SIG-Scale hangout](https://plus.google.com/hangouts/_/google.com/k8scale-hangout)&nbsp;
&nbsp;And of course for more information about the project in general, go to [www.kubernetes.io](http://www.kubernetes.io/)


* * *
[**1**](https://www.blogger.com/null)We exclude operations on “events” since these are more like system logs and are not required for the system to operate properly.  
[**2**](https://www.blogger.com/null)This is test/e2e/load.go from the Kubernetes github repository.  
[**3**](https://www.blogger.com/null)This is test/e2e/density.go test from the Kubernetes github repository&nbsp;  
[**4**](https://www.blogger.com/null)We are looking into optimizing this in the next release, but for now using a smaller master can result in significant (order of magnitude) performance degradation. We encourage anyone running benchmarking against Kubernetes or attempting to replicate these findings to use a similarly sized master, or performance will suffer.
