---
layout: blog
title: 'Kubernetes v1.31: Accelerating Cluster Performance with Consistent Reads from Cache'
date: 2024-08-15
slug: consistent-read-from-cache-beta
author: >
  Marek Siarkowicz (Google)
---

Kubernetes is renowned for its robust orchestration of containerized applications,
but as clusters grow, the demands on the control plane can become a bottleneck.
A key challenge has been ensuring strongly consistent reads from the etcd datastore,
requiring resource-intensive quorum reads.

Today, the Kubernetes community is excited to announce a major improvement:
_consistent reads from cache_, graduating to Beta in Kubernetes v1.31.

### Why consistent reads matter

Consistent reads are essential for ensuring that Kubernetes components have an accurate view of the latest cluster state.
Guaranteeing consistent reads is crucial for maintaining the accuracy and reliability of Kubernetes operations,
enabling components to make informed decisions based on up-to-date information.
In large-scale clusters, fetching and processing this data can be a performance bottleneck,
especially for requests that involve filtering results.
While Kubernetes can filter data by namespace directly within etcd,
any other filtering by labels or field selectors requires the entire dataset to be fetched from etcd and then filtered in-memory by the Kubernetes API server.
This is particularly impactful for components like the kubelet,
which only needs to list pods scheduled to its node - but previously required the API Server and etcd to process all pods in the cluster.

### The breakthrough: Caching with confidence

Kubernetes has long used a watch cache to optimize read operations.
The watch cache stores a snapshot of the cluster state and receives updates through etcd watches.
However, until now, it couldn't serve consistent reads directly, as there was no guarantee the cache was sufficiently up-to-date.

The _consistent reads from cache_ feature addresses this by leveraging etcd's
[progress notifications](https://etcd.io/docs/v3.5/dev-guide/interacting_v3/#watch-progress)
mechanism.
These notifications inform the watch cache about how current its data is compared to etcd.
When a consistent read is requested, the system first checks if the watch cache is up-to-date.
If the cache is not up-to-date, the system queries etcd for progress notifications until it's confirmed that the cache is sufficiently fresh.
Once ready, the read is efficiently served directly from the cache,
which can significantly improve performance,
particularly in cases where it would require fetching a lot of data from etcd.
This enables requests that filter data to be served from the cache,
with only minimal metadata needing to be read from etcd.

**Important Note:** To benefit from this feature, your Kubernetes cluster must be running etcd version 3.4.31+ or 3.5.13+.
For older etcd versions, Kubernetes will automatically fall back to serving consistent reads directly from etcd.

### Performance gains you'll notice

This seemingly simple change has a profound impact on Kubernetes performance and scalability:

* **Reduced etcd Load:** Kubernetes v1.31 can offload work from etcd,
  freeing up resources for other critical operations.
* **Lower Latency:** Serving reads from cache is significantly faster than fetching
  and processing data from etcd. This translates to quicker responses for components,
  improving overall cluster responsiveness.
* **Improved Scalability:** Large clusters with thousands of nodes and pods will
  see the most significant gains, as the reduction in etcd load allows the
  control plane to handle more requests without sacrificing performance.

**5k Node Scalability Test Results:** In recent scalability tests on 5,000 node
clusters, enabling consistent reads from cache delivered impressive improvements:

* **30% reduction** in kube-apiserver CPU usage
* **25% reduction** in etcd CPU usage
* **Up to 3x reduction** (from 5 seconds to 1.5 seconds) in 99th percentile pod LIST request latency

### What's next?

With the graduation to beta, consistent reads from cache are enabled by default,
offering a seamless performance boost to all Kubernetes users running a supported
etcd version.

Our journey doesn't end here. Kubernetes community is actively exploring
pagination support in the watch cache, which will unlock even more performance
optimizations in the future.

### Getting started

Upgrading to Kubernetes v1.31 and ensuring you are using etcd version 3.4.31+ or
3.5.13+ is the easiest way to experience the benefits of consistent reads from
cache.
If you have any questions or feedback, don't hesitate to reach out to the Kubernetes community.

**Let us know how** _consistent reads from cache_ **transforms your Kubernetes experience!**

Special thanks to @ah8ad3 and @p0lyn0mial for their contributions to this feature!
