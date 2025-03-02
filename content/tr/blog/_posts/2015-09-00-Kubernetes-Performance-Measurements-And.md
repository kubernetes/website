---
title: " Kubernetes Performance Measurements and Roadmap "
date: 2015-09-10
slug: kubernetes-performance-measurements-and
url: /blog/2015/09/Kubernetes-Performance-Measurements-And
author: >
   Wojciech Tyczynski (Google)
---
No matter how flexible and reliable your container orchestration system is, ultimately, you have some work to be done, and you want it completed quickly. For big problems, a common answer is to just throw more machines at the problem. After all, more compute = faster, right?


Interestingly, adding more nodes is a little like the [tyranny of the rocket equation][4] \- in some systems, adding more machines can actually make your processing slower. However, unlike the rocket equation, we can do better. Kubernetes in v1.0 version supports clusters with up to 100 nodes. However, we have a goal to 10x the number of nodes we will support by the end of 2015. This blog post will cover where we are and how we intend to achieve the next level of performance.


##### What do we measure?

The first question we need to answer is: “what does it mean that Kubernetes can manage an N-node cluster?” Users expect that it will handle all operations “reasonably quickly,” but we need a precise definition of that. We decided to define performance and scalability goals based on the following two metrics:

1. 1.*“API-responsiveness”*: 99% of all our API calls return in less than 1 second

2. 2.*“Pod startup time”*: 99% of pods (with pre-pulled images) start within 5 seconds


Note that for “pod startup time” we explicitly assume that all images necessary to run a pod are already pre-pulled on the machine where it will be running. In our experiments, there is a high degree of variability (network throughput, size of image, etc) between images, and these variations have little to do with Kubernetes’ overall performance.


The decision to choose those metrics was made based on our experience spinning up 2 billion containers a week at Google. We explicitly want to measure the latency of user-facing flows since that’s what customers will actually care about.


##### How do we measure?

To monitor performance improvements and detect regressions we set up a continuous testing infrastructure. Every 2-3 hours we create a 100-node cluster from [HEAD][5] and run our scalability tests on it. We use a GCE n1-standard-4 (4 cores, 15GB of RAM) machine as a master and n1-standard-1 (1 core, 3.75GB of RAM) machines for nodes.


In scalability tests, we explicitly focus only on the full-cluster case (full N-node cluster is a cluster with 30 * N pods running in it) which is the most demanding scenario from a  performance point of view. To reproduce what a customer might actually do, we run through the following steps:

* Populate pods and replication controllers to fill the cluster

* Generate some load (create/delete additional pods and/or replication controllers, scale the existing ones, etc.) and record performance metrics

* Stop all running pods and replication controllers

* Scrape the metrics and check whether they match our expectations


It is worth emphasizing that the main parts of the test are done on full clusters (30 pods per node, 100 nodes) - starting a pod in an empty cluster, even if it has 100 nodes will be much faster.


To measure pod startup latency we are using very simple pods with just a single container running the “gcr.io/google_containers/pause:go” image, which starts and then sleeps forever. The container is guaranteed to be already pre-pulled on nodes (we use it as the so-called pod-infra-container).


##### Performance data

The following table contains percentiles (50th, 90th and 99th) of pod startup time in 100-node clusters which are 10%, 25%, 50% and 100% full.


|                |  10%-full |25%-full   | 50%-full  | 100%-full  |
| ------------ | ------------ | ------------ | ------------ | ------------ |
|50th percentile   |  .90s | 1.08s  | 1.33s  | 1.94s  |
|90th percentile   |  1.29s |  1.49s |  1.72s |  2.50s |
| 99th percentile  |  1.59s | 1.86s  | 2.56s  | 4.32s  |


As for api-responsiveness, the following graphs present 50th, 90th and 99th percentiles of latencies of API calls grouped by kind of operation and resource type. However, note that this also includes internal system API calls, not just those issued by users (in this case issued by the test itself).



![get.png][6]![put.png][7]



![delete.png][8]![post.png][9]

![list.png][10]


Some resources only appear on certain graphs, based on what was running during that operation (e.g. no namespace was put at that time).


As you can see in the results, we are ahead of target for our 100-node cluster with pod startup time even in a fully-packed cluster occurring 14% faster in the 99th percentile than 5 seconds. It’s interesting to point out that  LISTing pods is significantly slower than any other operation. This makes sense: in a full cluster there are 3000 pods and each of pod is roughly few kilobytes of data, meaning megabytes of data that need to processed for each LIST.


#####Work done and some future plans

The initial performance work to make 100-node clusters stable enough to run any tests on them involved a lot of small fixes and tuning, including increasing the limit for file descriptors in the apiserver and reusing tcp connections between different requests to etcd.


However, building a stable performance test was just step one to increasing the number of nodes our cluster supports by tenfold. As a result of this work, we have already taken on significant effort to remove future bottlenecks, including:

* Rewriting controllers to be watch-based: Previously they were relisting objects of a given type every few seconds, which generated a huge load on the apiserver.

* Using code generators to produce conversions and deep-copy functions: Although the default implementation using Go reflections are very convenient, they proved to be extremely slow, as much as 10X in comparison to the generated code.

* Adding a cache to apiserver to avoid deserialization of the same data read from etcd multiple times

* Reducing frequency of updating statuses:  Given the slow changing nature of statutes, it only makes sense to update pod status only on change and node status only every 10 seconds.

* Implemented watch at the apiserver instead of redirecting the requests to etcd: We would prefer to avoid watching for the same data from etcd multiple times, since, in many cases, it was filtered out in apiserver anyway.


Looking further out to our 1000-node cluster goal, proposed improvements include:


* Moving events out from etcd: They are more like system logs and are neither part of system state nor are crucial for Kubernetes to work correctly.

* Using better json parsers: The default parser implemented in Go is very slow as it is based on reflection.

* Rewriting the scheduler to make it more efficient and concurrent

* Improving efficiency of communication between apiserver and Kubelets: In particular, we plan to reduce the size of data being sent on every update of node status.


This is by no means an exhaustive list. We will be adding new elements (or removing existing ones) based on the observed bottlenecks while running the existing scalability tests and newly-created ones. If there are particular use cases or scenarios that you’d like to see us address, please join in!

-  We have weekly meetings for our Kubernetes Scale Special Interest Group on Thursdays 11am PST where we discuss ongoing issues and plans for performance tracking and improvements.
- If you have specific performance or scalability questions before then,  please join our scalability special interest group on Slack: https://kubernetes.slack.com/messages/sig-scale
- General questions? Feel free to join our Kubernetes community on Slack: https://kubernetes.slack.com/messages/kubernetes-users/
- Submit a pull request or file an issue! You can do this in our GitHub repository. Everyone is also enthusiastically encouraged  to contribute with their own experiments (and their result) or PR contributions improving Kubernetes.

[1]: http://kubernetes.io/images/nav_logo.svg
[2]: http://kubernetes.io/docs/
[3]: https://kubernetes.io/blog/
[4]: http://www.nasa.gov/mission_pages/station/expeditions/expedition30/tryanny.html
[5]: https://github.com/kubernetes/kubernetes
[6]: https://lh4.googleusercontent.com/NrKLoz2iB-TNdOxISL7OcqquCKL-MijDBCokf-u4ASAqgmo6zT7ZU24mXDvIwUUlRsFSsL3KF17dEAfUT41TSgNPvId5HN5ELQTXJSSBF0dp9EOccx4Y4WZ9fC9v9B_kCA=s1600
[7]: https://lh4.googleusercontent.com/53AtIdoGQ477Ju0FD4S76xbZs490JnmibhSZh67aq1-MU4Jw4B-7FBgzvFoJXHcAMeSU9r3bzJHpBFAfcSf7FIS3JGZ4TiAiHucyjH3ErrarKrwYNFopvxYSBo0qxP-U0w=s1600
[8]: https://lh4.googleusercontent.com/-wsLEXPfgtXNlu-pDfM4c0Qvr8lU7-G2w_nSgVeqg04D7RnhgSzg6Z5-mVmIYOzTWF7XaJ0zsDZBBlyZLqj4R1fkwWq-uaKJJI8xLAQ1gYWbh5qKXr5-rzkjm6CT3kBU=s1600
[9]: https://lh6.googleusercontent.com/It8dH6iM2ZPypZ99KSUo_kJY4DnR2QD8yGJj26TiZ3U4owyf-WXoxrDfBAc1hcSn3i3LuxE3KGlUzQOaPgH6XVjSAU9Z2zMfZCKFAxEGtuCQiKlJPX4vH2JgQf3h1BXMRJQ=s1600
[10]: https://lh6.googleusercontent.com/6Gy-UKBZUoEwJ9iFytq-k_wrdvh6FsTJexSpn6nNnBwOvxv-Sp6PV7vmArCL22MUkz0tWH7MxhaIc-JE8YpEc0X4nDUMn-cKWF3ANHtgd2aJ5t3osoaezDe_xqjpi748Cbw=s1600
[11]: https://kubernetes.slack.com/messages/sig-scale/
[12]: https://kubernetes.io/blog/2015/09/kubernetes-performance-measurements-and "permanent link"
[13]: https://resources.blogblog.com/img/icon18_edit_allbkg.gif
[14]: https://www.blogger.com/post-edit.g?blogID=112706738355446097&postID=6564816295503649669&from=pencil "Edit Post"
[15]: https://www.blogger.com/share-post.g?blogID=112706738355446097&postID=6564816295503649669&target=email "Email This"
[16]: https://www.blogger.com/share-post.g?blogID=112706738355446097&postID=6564816295503649669&target=blog "BlogThis!"
[17]: https://www.blogger.com/share-post.g?blogID=112706738355446097&postID=6564816295503649669&target=twitter "Share to Twitter"
[18]: https://www.blogger.com/share-post.g?blogID=112706738355446097&postID=6564816295503649669&target=facebook "Share to Facebook"
[19]: https://www.blogger.com/share-post.g?blogID=112706738355446097&postID=6564816295503649669&target=pinterest "Share to Pinterest"
[20]: https://kubernetes.io/blog/search/label/containers
[21]: https://kubernetes.io/blog/search/label/k8s
[22]: https://kubernetes.io/blog/search/label/kubernetes
[23]: https://kubernetes.io/blog/search/label/performance
[24]: https://kubernetes.io/blog/2015/10/some-things-you-didnt-know-about-kubectl_28 "Newer Post"
[25]: https://kubernetes.io/blog/2015/08/using-kubernetes-namespaces-to-manage "Older Post"
[26]: https://kubernetes.io/blog/feeds/6564816295503649669/comments/default
[27]: https://img2.blogblog.com/img/widgets/arrow_dropdown.gif
[28]: https://img1.blogblog.com/img/icon_feed12.png
[29]: https://img1.blogblog.com/img/widgets/subscribe-netvibes.png
[30]: https://www.netvibes.com/subscribe.php?url=http%3A%2F%2Fblog.kubernetes.io%2Ffeeds%2Fposts%2Fdefault
[31]: https://img1.blogblog.com/img/widgets/subscribe-yahoo.png
[32]: https://add.my.yahoo.com/content?url=http%3A%2F%2Fblog.kubernetes.io%2Ffeeds%2Fposts%2Fdefault
[33]: https://kubernetes.io/blog/feeds/posts/default
[34]: https://www.netvibes.com/subscribe.php?url=http%3A%2F%2Fblog.kubernetes.io%2Ffeeds%2F6564816295503649669%2Fcomments%2Fdefault
[35]: https://add.my.yahoo.com/content?url=http%3A%2F%2Fblog.kubernetes.io%2Ffeeds%2F6564816295503649669%2Fcomments%2Fdefault
[36]: https://resources.blogblog.com/img/icon18_wrench_allbkg.png
[37]: //www.blogger.com/rearrange?blogID=112706738355446097&widgetType=Subscribe&widgetId=Subscribe1&action=editWidget§ionId=sidebar-right-1 "Edit"
[38]: https://twitter.com/kubernetesio
[39]: http://slack.k8s.io/
[40]: http://stackoverflow.com/questions/tagged/kubernetes
[41]: http://get.k8s.io/
[42]: //www.blogger.com/rearrange?blogID=112706738355446097&widgetType=HTML&widgetId=HTML2&action=editWidget§ionId=sidebar-right-1 "Edit"
[43]: javascript:void(0)
