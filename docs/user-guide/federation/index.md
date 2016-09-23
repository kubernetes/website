---
---

This guide explains how we can manage multiple kubernetes clusters using
federation.
[Federation proposal](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/proposals/federation.md)
details the use cases motivating cluster federation.


* TOC
{:toc}

## Setup

To be able to federate multiple clusters, we first need to setup a federation
control plane.
Follow the [setup guide](/docs/admin/federation/) to setup the
federation control plane.

## Hybrid cloud capabilities

Federations of Kubernetes Clusters can include clusters running in
different cloud providers (e.g. Google Cloud, AWS), and on-premises
(e.g. on OpenStack). Simply create all of the clusters that you
require, in the appropriate cloud providers and/or locations, and
register each cluster's API endpoint and credentials with your
Federation API Server (See the
[federation admin guide](/docs/admin/federation/) for details).

Thereafter, your API resources can span different clusters
and cloud providers.

## API resources

Once we have the control plane setup, we can start creating federation API
resources.
The following guides explain some of the resources in detail:

* [Events](/docs/user-guide/federation/events/)
* [Ingress](/docs/user-guide/federation/federated-ingress/)
* [Namespaces](/docs/user-guide/federation/namespaces/)
* [ReplicaSets](/docs/user-guide/federation/replicasets/)
* [Secrets](/docs/user-guide/federation/secrets/)
* [Services](/docs/user-guide/federation/federated-services/)
<!-- TODO: Add more guides here -->

[API reference docs](/federation/docs/api-reference/readme/) lists all the
resources supported by federation apiserver.
