---
layout: blog
title: 'What’s Up with Pod Security Policies?'
date: 2021-02-04
slug: psp-update-2021
---

**Authors:** Contributor Comms Team
_The following is a brief overview of upcoming changes to Kubernetes. Bookmark and [keep an eye on our release site](https://www.kubernetes.dev/resources/release/) to see the latest news and other important updates._
Pod Security Policies (PSP), starting with the Kubernetes 1.21, will begin the [process of deprecation](/docs/reference/using-api/deprecation-policy/) with the intention to fully remove it in a future release. This bears the question: what will replace Pod Security Policies in the future? In short, [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/). For more details, keep reading.


## What do Pod Security Policies do now?

> A Pod Security Policy is a cluster-level resource that controls security sensitive aspects of the pod | specification. The [PodSecurityPolicy](/docs/reference/kubernetes-api/policies-resources/pod-security-policy-v1beta1/) object defines a set of conditions that a pod must run with in order to be accepted into the system, as well as defaults for the related fields. They allow an administrator to control a number of security-related functions.

The [PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/)
documentation explains this in more detail.


## Why are Pod Security Policies being deprecated? 

To watch an explanation of PSP removal, you can check out this session by SIG-Auth at KubeCon NA 2019:

{{< youtube "SFtHRmPuhEw?start=953" >}} 

In short, PSPs are part of the kubelet and API server. The tight coupling to these parts of Kubernetes makes PSPs cumbersome both for developers and for operators. Using PSPs is often unintuitive, and setting them up too often leads to unintended results. The initial design of PSPs did not foresee many of the use cases they’ve since tried to solve.

To quote the above video: "Various limitations and structural problems have prevented the PSP API from GA." Having objects in Kubernetes never reaching GA (“permabeta”) is a problem for administrators and organizations, as a non-GA feature is not considered to be ready for widespread use. Given the structural problems with the PSPs as they exist today, there is no real path for them to become GA. Per the deprecation issue, “the future of restricting pod security settings does not lie in PSP because compatibility restrictions will prevent the kinds of changes that are required.” As such, PSPs will be deprecated in Kubernetes 1.21, though they will not be fully removed until version 1.25.


## What will replace them? 

Securing your pods requires understanding how the pods are intended to run, and what types of behaviors or activities you seek to prevent. While Pod Security Policies have been one way to enforce security configurations, other tools in the cloud native ecosystem have security enforcement capabilities. The [Pod Security Standards](/docs/concepts/security/pod-security-standards/) page in the Kubernetes documentation aims “to detail recommended Pod security profiles, decoupled from any specific instantiation.”  This page is a useful reference for common pod security configurations, which can be implemented by native or external pod security enforcement tools.

While the scope of PSPs is beyond anything that will replace it, there are [a few tools in the ecosystem](https://landscape.cncf.io/card-mode?category=security-compliance&grouping=category) that can help enforce security policies through the management of Admission Controller Webhooks. We encourage you to assess the right tool for your needs. Pod Security Policies are one type of Admission Controller Webhook in Kubernetes, but there are a variety of available options. The blog post, [“A Guide to Kubernetes Admission Controllers”](/blog/2019/03/21/a-guide-to-kubernetes-admission-controllers/) from March 2019 gives a great overview of what admission controller webhooks can do.

While the exact capabilities and use of policy enforcement tools will vary, the community is engaged in working toward better and better solutions for enforcing security policies across your Kubernetes pods.


## Wrapping it up

Pod Security Policies were an early attempt to support users' needs with regard to securing pods. Since their creation, they have become unwieldy within the larger context of Kubernetes, making them both difficult to maintain and difficult for users to use.

The use cases around pod security have grown such that new solutions from other projects within the Cloud Native ecosystem may better serve users' needs. Thus, in version 1.21, the deprecation process for Pod Security Policies will begin, though they will not be fully removed from Kubernetes until version 1.25.

As pod security policies begin to phase out, users should expect to spend some time evaluating alternative options for solving the pod security challenges they face. Be sure to check the [Cloud Native landscape](https://landscape.cncf.io/card-mode?category=security-compliance&grouping=category) and follow projects which are addressing this space.

Deprecation Release Notes: [https://relnotes.k8s.io/?kinds=deprecation](https://relnotes.k8s.io/?kinds=deprecation)
