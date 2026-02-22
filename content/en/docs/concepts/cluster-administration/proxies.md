---
title: Proxies in Kubernetes
content_type: concept
weight: 100
---

<!-- overview -->
This page explains proxies used with Kubernetes.


<!-- body -->

## Proxies

There are several different proxies you may encounter when using Kubernetes:

1.  The [kubectl proxy](/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api):

    - runs on a user's desktop or in a pod
    - proxies from a localhost address to the Kubernetes apiserver
    - client to proxy uses HTTP
    - proxy to apiserver uses HTTPS
    - locates apiserver
    - adds authentication headers

1.  The [apiserver proxy](/docs/tasks/access-application-cluster/access-cluster-services/#discovering-builtin-services):

    - is a bastion built into the apiserver
    - connects a user outside of the cluster to cluster IPs which otherwise might not be reachable
    - runs in the apiserver processes
    - client to proxy uses HTTPS (or http if apiserver so configured)
    - proxy to target may use HTTP or HTTPS as chosen by proxy using available information
    - can be used to reach a Node, Pod, or Service
    - does load balancing when used to reach a Service

1.  The [kube proxy](/docs/concepts/services-networking/service/#ips-and-vips):

    - runs on each node
    - proxies UDP, TCP and SCTP
    - does not understand HTTP
    - provides load balancing
    - is only used to reach services

1.  A Proxy/Load-balancer in front of apiserver(s):

    - existence and implementation varies from cluster to cluster (e.g. nginx)
    - sits between all clients and one or more apiservers
    - acts as load balancer if there are several apiservers.

1.  Cloud Load Balancers on external services:

    - are provided by some cloud providers (e.g. AWS ELB, Google Cloud Load Balancer)
    - are created automatically when the Kubernetes service has type `LoadBalancer`
    - usually supports UDP/TCP only
    - SCTP support is up to the load balancer implementation of the cloud provider
    - implementation varies by cloud provider.

Kubernetes users will typically not need to worry about anything other than the first two types.  The cluster admin
will typically ensure that the latter types are set up correctly.

## Requesting redirects

Proxies have replaced redirect capabilities.  Redirects have been deprecated.




