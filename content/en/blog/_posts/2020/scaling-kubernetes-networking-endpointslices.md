---
layout: blog
title: 'Scaling Kubernetes Networking With EndpointSlices'
date: 2020-09-02
slug: scaling-kubernetes-networking-with-endpointslices
author: >
  Rob Scott (Google)
---

EndpointSlices are an exciting new API that provides a scalable and extensible alternative to the Endpoints API. EndpointSlices track IP addresses, ports, readiness, and topology information for Pods backing a Service.

In Kubernetes 1.19 this feature is enabled by default with kube-proxy reading from [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) instead of Endpoints. Although this will mostly be an invisible change, it should result in noticeable scalability improvements in large clusters. It also enables significant new features in future Kubernetes releases like Topology Aware Routing.

## Scalability Limitations of the Endpoints API 
With the Endpoints API, there was only one Endpoints resource for a Service. That meant that it needed to be able to store IP addresses and ports (network endpoints) for every Pod that was backing the corresponding Service. This resulted in huge API resources. To compound this problem, kube-proxy was running on every node and watching for any updates to Endpoints resources. If even a single network endpoint changed in an Endpoints resource, the whole object would have to be sent to each of those instances of kube-proxy.

A further limitation of the Endpoints API is that it limits the number of network endpoints that can be tracked for a Service. The default size limit for an object stored in etcd is 1.5MB. In some cases that can limit an Endpoints resource to 5,000 Pod IPs. This is not an issue for most users, but it becomes a significant problem for users with Services approaching this size.

To show just how significant these issues become at scale it helps to have a simple example. Think about a Service which has 5,000 Pods, it might end up with a 1.5MB Endpoints resource. If even a single network endpoint in that list changes, the full Endpoints resource will need to be distributed to each Node in the cluster. This becomes quite an issue in a large cluster with 3,000 Nodes. Each update would involve sending 4.5GB of data (1.5MB Endpoints * 3,000 Nodes) across the cluster. That's nearly enough to fill up a DVD, and it would happen for each Endpoints change. Imagine a rolling update that results in all 5,000 Pods being replaced - that's more than 22TB (or 5,000 DVDs) worth of data transferred.

## Splitting endpoints up with the EndpointSlice API
The EndpointSlice API was designed to address this issue with an approach similar to sharding. Instead of tracking all Pod IPs for a Service with a single Endpoints resource, we split them into multiple smaller EndpointSlices. 

Consider an example where a Service is backed by 15 pods. We'd end up with a single Endpoints resource that tracked all of them. If EndpointSlices were configured to store 5 endpoints each, we'd end up with 3 different EndpointSlices:
![EndpointSlices](/images/blog/2020-09-02-scaling-kubernetes-networking-endpointslices/endpoint-slices.png)

By default, EndpointSlices  store as many as 100 endpoints each, though this can be configured with the `--max-endpoints-per-slice` flag on kube-controller-manager.

## EndpointSlices provide 10x scalability improvements
This API dramatically improves networking scalability. Now when a Pod is added or removed, only 1 small EndpointSlice needs to be updated. This difference becomes quite noticeable when hundreds or thousands of Pods are backing a single Service. 

Potentially more significant, now that all Pod IPs for a Service don't need to be stored in a single resource, we don't have to worry about the size limit for objects stored in etcd. EndpointSlices have already been used to scale Services beyond 100,000 network endpoints.

All of this is brought together with some significant performance improvements that have been made in kube-proxy. When using EndpointSlices at scale, significantly less data will be transferred for endpoints updates and kube-proxy should be faster to update iptables or ipvs rules. Beyond that, Services can now scale to at least 10 times beyond any previous limitations.

## EndpointSlices enable new functionality
Introduced as an alpha feature in Kubernetes v1.16, EndpointSlices were built to enable some exciting new functionality in future Kubernetes releases. This could include dual-stack Services, topology aware routing, and endpoint subsetting.

Dual-Stack Services are an exciting new feature that has been in development alongside EndpointSlices. They will utilize both IPv4 and IPv6 addresses for Services and rely on the addressType field on EndpointSlices to track these addresses by IP family. 

Topology aware routing will update kube-proxy to prefer routing requests within the same zone or region. This makes use of the topology fields stored for each endpoint in an EndpointSlice. As a further refinement of that, we're exploring the potential of endpoint subsetting. This would allow kube-proxy to only watch a subset of EndpointSlices. For example, this might be combined with topology aware routing so that kube-proxy would only need to watch EndpointSlices containing endpoints within the same zone. This would provide another very significant scalability improvement.

## What does this mean for the Endpoints API?
Although the EndpointSlice API is providing a newer and more scalable alternative to the Endpoints API, the Endpoints API will continue to be considered generally available and stable. The most significant change planned for the Endpoints API will involve beginning to truncate Endpoints that would otherwise run into scalability issues.

The Endpoints API is not going away, but many new features will rely on the EndpointSlice API. To take advantage of the new scalability and functionality that EndpointSlices provide, applications that currently consume Endpoints will likely want to consider supporting EndpointSlices in the future.
