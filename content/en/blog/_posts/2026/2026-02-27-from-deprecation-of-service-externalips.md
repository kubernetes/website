---
layout: blog
title: "Deprecation and removal of Service ExternalIPs"
draft: true # will be changed to date: YYYY-MM-DD before publication
slug: deprecation-and-removal-of-service-externalips # optional
author: >
  Dan Winship (Red Hat),
  Adrian Moisey (Independant),
---

The `externalIPs` field in `Service` was an early attempt to provide
cloud-load-balancer-like functionality for non-cloud clusters.
Unfortunately, the API assumes that every user in the cluster is fully
trusted, and in any situation where that is not the case, it enables
various security exploits, as described in
[CVE-2020-8554](https://www.cvedetails.com/cve/CVE-2020-8554/).

Since Kubernetes 1.21, we have recommended that all users disable
`externalIPs`, and provided an admission controller
(`denyservicexternalips`) that can be enabled to do this. At the time,
we felt that blocking the functionality by default was too large a
breaking change to consider.

However, the security problems are still there, and we're increasingly
unhappy with the "insecure by default" state of the feature.
Additionally, there are now several better alternatives for non-cloud
clusters wanting load-balancer-like functionality.

So, as of Kubernetes 1.36 we are declaring the Service `externalIPs`
field to be deprecated, and in a future release we plan to remove the
implementation of the feature from `kube-proxy`, and update the
Kubernetes Conformance criteria to require that it not be implemented
by other service proxies either.

## A note on terminology, and what we *aren't* deprecating

The phrase "external IP" is somewhat overloaded in Kubernetes:

  - The Service API has a field `.spec.externalIPs` which can be used
    to add additional IP addresses that a Service will respond on.

  - The Node API's `.status.addresses` field can list addresses of
    several different types, one of which is called `ExternalIP`.

  - Kubelet, when displaying information about a Service of type
    `LoadBalancer` in the default output format, will show the load
    balancer IP under the column heading `EXTERNAL-IP`.

This deprecation is about the first of those. If you are not setting
the field `externalIPs` in any of your Services, then it does not
apply to you.

## Alternatives to `externalIPs`

If you *are* using `externalIPs`, then there are several alternatives.

### Using manually-managed `LoadBalancer` Services instead of `externalIPs`

The easiest (but also worst) option is to just switch from using
`externalIPs` to using a `type: LoadBalancer` service, and assigning a
load balancer IP by hand. This is, essentially, exactly the same as
`externalIPs`, with one important difference: the load balancer IP is
part of the Service's `.status`, not its `.spec`, and in a cluster
with RBAC enabled, it can't be edited by ordinary users by default.
Thus, this replacement for `externalIPs` would only be available to
users who were given permission by the admins (although those users
would then be fully empowered to replicate CVE-2020-8554; there would
still not be any further checks to ensure that one user wasn't
stealing another user's IPs, etc.)

FIXME EXAMPLE
set `loadBalancerClass` to ensure LB controllers will ignore it
requires creating the service then patching the status as a second step?

FIXME, using VAP to limit users to particular CIDRs
(or not, if we don't want to encourage this approach?)

### Using a "bare metal" load balancer implementation

eg MetalLB FIXME

better because the lb controller implementation should handle IP
address management and make sure you aren't trying to steal IPs

### Using Gateway API

FIXME

full-featured, future-proof, extensible, but requires the most changes
to existing services.

## Timeline for `externalIPs` deprecation

FIXME
