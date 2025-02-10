---
title: " Visualize Kubelet Performance with Node Dashboard "
date: 2016-11-17
slug: visualize-kubelet-performance-with-node-dashboard
url: /blog/2016/11/Visualize-Kubelet-Performance-With-Node-Dashboard
author: >
  Zhou Fang (Google)
---

_Since this article was published, the Node Performance Dashboard was retired and is no longer available._

_This retirement happened in early 2019, as part of the_ `kubernetes/contrib`
_[repository deprecation](https://github.com/kubernetes-retired/contrib/issues/3007)_.

In Kubernetes 1.4, we introduced a new node performance analysis tool, called the _node performance dashboard_, to visualize and explore the behavior of the Kubelet in much richer details. This new feature will make it easy to understand and improve code performance for Kubelet developers, and lets cluster maintainer set configuration according to provided Service Level Objectives (SLOs).  

**Background**  

A Kubernetes cluster is made up of both master and worker nodes. The master node manages the cluster’s state, and the worker nodes do the actual work of running and managing pods. To do so, on each worker node, a binary, called [Kubelet](/docs/admin/kubelet/), watches for any changes in pod configuration, and takes corresponding actions to make sure that containers run successfully. High performance of the Kubelet, such as low latency to converge with new pod configuration and efficient housekeeping with low resource usage, is essential for the entire Kubernetes cluster. To measure this performance, Kubernetes uses [end-to-end (e2e) tests](https://github.com/kubernetes/kubernetes/blob/master/docs/devel/e2e-tests.md#overview) to continuously monitor benchmark changes of latest builds with new features.  

**Kubernetes SLOs are defined by the following benchmarks** :  

**\* API responsiveness** : 99% of all API calls return in less than 1s.  
**\* Pod startup time** : 99% of pods and their containers (with pre-pulled images) start within 5s.  

Prior to 1.4 release, we’ve only measured and defined these at the cluster level, opening up the risk that other factors could influence the results. Beyond these, we also want to have more performance related SLOs such as the maximum number of pods for a specific machine type allowing maximum utilization of your cluster. In order to do the measurement correctly, we want to introduce a set of tests isolated to just a node’s performance. In addition, we aim to collect more fine-grained resource usage and operation tracing data of Kubelet from the new tests.  

**Data Collection**  

The node specific density and resource usage tests are now added into e2e-node test set since 1.4. The resource usage is measured by a standalone cAdvisor pod for flexible monitoring interval (comparing with Kubelet integrated cAdvisor). The performance data, such as latency and resource usage percentile, are recorded in persistent test result logs. The tests also record time series data such as creation time, running time of pods, as well as real-time resource usage. Tracing data of Kubelet operations are recorded in its log stored together with test results.  

**Node Performance Dashboard**  

Since Kubernetes 1.4, we are continuously building the newest Kubelet code and running node performance tests. The data is collected by our new performance dashboard available at [node-perf-dash.k8s.io](http://node-perf-dash.k8s.io/). Figure 1 gives a preview of the dashboard. You can start to explore it by selecting a test, either using the drop-down list of short test names (region (a)) or by choosing test options one by one (region (b)). The test details show up in region (c) containing the full test name from Ginkgo (the Go test framework used by Kubernetes). Then select a node type (image and machine) in region (d).  

| ![](https://lh5.googleusercontent.com/xREqs-NpWw2isELQ3YekYYMXRsY0fTs0t8lBR5xbZDB02mOAfQAnidXo8AF9hOICBUFI20kD6BVvTR0vDS1ErgQ8fVxP530TWUkyZTeV_KziI9uHvZOrHk5E304MeiLfdEPG2fzz)|
| Figure 1. Select a test to display in node performance dashboard. |


The "BUILDS" page exhibits the performance data across different builds (Figure 2). The plots include pod startup latency, pod creation throughput, and CPU/memory usage of Kubelet and runtime (currently Docker). In this way it’s easy to monitor the performance change over time as new features are checked in.  



| ![](https://lh4.googleusercontent.com/lMNEuppUPvdzuLNPPAUSiuZJ7mB575sLJYsn1NlTaiibLPl8Ocyg3t0hcdKjCZVd1U61plZnK6WHJUtWTvIBqcZkGiEStL6kGHVwTzHKcmIWIVQHbGZl4SkKgQM6ygBTsaQul1nw) |
| Figure 2. Performance data across different builds. |


**Compare Different Node Configurations**  

It’s always interesting to compare the performance between different configurations, such as comparing startup latency of different machine types, different numbers of pods, or comparing resource usage of hosting different number of pods. The dashboard provides a convenient way to do this. Just click the "Compare it" button the right up corner of test selection menu (region (e) in Figure 1). The selected tests will be added to a comparison list in the "COMPARISON" page, as shown in Figure 3. Data across a series of builds are aggregated to a single value to facilitate comparison and are displayed in bar charts.  



| ![](https://lh4.googleusercontent.com/B0M-LCr8iVTVRFC5u8Ni08-sXCu7BJAHXXFRTrT_ecPYi4ZHr7ylhkmbUlqwewNvRPmxH63DadNe72AA7jthoGm3cWChZclX7ARPdSFxNQbKqkwSgVLK2y6as02Y2hlQ2kSIcfpn) |
| Figure 3. Compare different test configurations. |



**Time Series and Tracing: Diving Into Performance Data**



Pod startup latency is an important metric for Kubelet, especially when creating a large number of pods per node. Using the dashboard you can see the change of latency, for example, when creating 105 pods, as shown in Figure 4. When you see the highly variable lines, you might expect that the variance is due to different builds. However, as these test here were run against the same Kubernetes code, we can conclude the variance is due to performance fluctuation. The variance is close to 40s when we compare the 99% latency of build #162 and #173, which is very large. To drill into the source of the fluctuation, let’s check out the "TIME SERIES" page.



| ![](https://lh5.googleusercontent.com/4WM9bX-Vzn-h2otSaVcES4FBPDeTFuIueo_uRXDctpKPO_lFAANjRj9QmezSn5x81QLcDAq8ui_Gvbik1edyjUwPKWQNKjbW7uSNwCFnGg7Bd1KqqU1U7B1gvwzK_X6Wo7DJjYH3) |
| Figure 4. Pod startup latency when creating 105 pods. |


Looking specifically at build #162, we are able to see that the tracing data plotted in the pod creation latency chart (Figure 5). Each curve is an accumulated histogram of the number of pod operations which have already arrive at a certain tracing probe. The timestamp of tracing pod is either collected from the performance tests or by parsing the Kubelet log. Currently we collect the following tracing data:

- "create" (in test): the test creates pods through API client;
- "running" (in test): the test watches that pods are running from API server;
- "pod\_config\_change": pod config change detected by Kubelet SyncLoop;
- "runtime\_manager": runtime manager starts to create containers;
- "infra\_container\_start": the infra container of a pod starts;
- "container\_start': the container of a pod starts;
- "pod\_running": a pod is running;
- "pod\_status\_running": status manager updates status for a running pod;

The time series chart illustrates that it is taking a long time for the status manager to update pod status (the data of "running" is not shown since it overlaps with "pod\_status\_running"). We figure out this latency is introduced due to the query per second (QPS) limits of Kubelet to the API server (default is 5). After being aware of this, we find in additional tests that by increasing QPS limits, curve "running" gradually converges with "pod\_running', and results in much lower latency. Therefore the previous e2e test pod startup results reflect the combined latency of both Kubelet and time of uploading status, the performance of Kubelet is thus under-estimated.  


| ![](https://lh3.googleusercontent.com/_8y02WcgZ7ETvDTeZ893rZYNuIR2j32_jnl7O1Mj3cP9Y7I3C-gegDgSdYX1VtTpGDUo6JEouueSj8hGWPJSXj_5GcC9nE21tjIXgTIrwRXW-0jYpXdRh6oDSSdQ1XKPyXIf3yQu) |
| Figure 5. Time series page using data from build #162. |


Further, by comparing the time series data of build #162 (Figure 5) and build #173 (Figure 6), we find that the performance pod startup latency fluctuation actually happens during updating pod statuses. Build #162 has several straggler "pod\_status\_running" events with a long latency tails. It thus provides useful ideas for future optimization.&nbsp;  



| ![](https://lh5.googleusercontent.com/51IY9sNPEdtEe-HGz75Q4ggt73ngE0p9gsq6B0m6RDJ13MklYZ3s6xREFhWIxwJt0zFBiY6BvDHwLZ57G9UARfXy1wcAb1DwD48poUrXFHgcRVXUe3tfCoCSpZ477NGTA3A8Njrg) |
| Figure 6. Pod startup latency of build #173. |



In future we plan to use events in Kubernetes which has a fixed log format to collect tracing data more conveniently. Instead of extracting existing log entries, then you can insert your own tracing probes inside Kubelet and obtain the break-down latency of each segment.&nbsp;



You can check the latency between any two probes across different builds in the “TRACING” page, as shown in Figure 7. For example, by selecting "pod\_config\_change" as the start probe, and "pod\_status\_running' as the end probe, it gives the latency variance of Kubelet over continuous builds without status updating overhead. With this feature, developers are able to monitor the performance change of a specific part of code inside Kubelet.   


| ![](https://lh5.googleusercontent.com/nycM01gswI-Z_JxLqHiEjuJZRCg6fwiCiN7HjvKk_iNALN7KihiQB6zdfHDJpf7DLY16qVhIDr6b8qlzOJ9U77fIlBGs-F8eJ3El78pd0wKgNI73PkgEswMFCA5wBLGnYjZqF3PU) |
| Figure 7. Plotting latency between any two probes. |



**Future Work**



The [node performance dashboard](http://node-perf-dash.k8s.io/) is a brand new feature. It is still alpha version under active development. We will keep optimizing the data collecting and visualization, providing more tests, metrics and tools to the developers and the cluster maintainers.&nbsp;



Please join our community and help us build the future of Kubernetes! If you’re particularly interested in nodes or performance testing, participate by chatting with us in our [Slack channel](https://kubernetes.slack.com/messages/sig-scale/) or join our meeting which meets every Tuesday at 10 AM PT on this [SIG-Node Hangout](https://github.com/kubernetes/community/tree/master/sig-node).


- [Download](http://get.k8s.io/) Kubernetes
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)&nbsp;
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)&nbsp;
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
