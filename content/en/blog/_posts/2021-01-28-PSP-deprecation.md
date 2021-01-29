---
layout: blog
title: 'What deprecation of Pod Security Policies means'
date: 2021-01-28
slug: psp-deprecation
---

**Authors:** Matt Broberg (Red Hat), Kaslin Fields (Google), Chris Short (Red Hat)

Pod Security Policies (PSP), starting with the Kubernetes 1.21, will begin the [process of deprecation](https://kubernetes.io/docs/reference/using-api/deprecation-policy/) with the intention to fully remove it in a future release. This bears the question: what will replace Pod Security Policies in the future? In short, [Admission Controllers](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/). For more details, keep reading.


## What do Pod Security Policies do now?

> A Pod Security Policy is a cluster-level resource that controls security sensitive aspects of the pod | specification. The [PodSecurityPolicy](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.20/#podsecuritypolicy-v1beta1-policy) object defines a set of conditions that a pod must run with in order to be accepted into the system, as well as defaults for the related fields. They allow an administrator to control a number of security-related functions.

Doc: [https://kubernetes.io/docs/concepts/policy/pod-security-policy/](https://kubernetes.io/docs/concepts/policy/pod-security-policy/)


## Why are Pod Security Policies being deprecated? 

To watch an explanation of PSP removal, you can check out this session by SIG-Auth at KubeCon NA 2019:

{{< youtube "SFtHRmPuhEw?start=953" >}} 

In short, PSPs are part of the kubelet and API server. The tight coupling to these parts of Kubernetes makes PSPs cumbersome both for developers and for operators. Using PSPs is often unintuitive, and setting them up too often leads to unintended results. The initial design of PSPs did not foresee many of the use cases they’ve since tried to solve.

To quote the above video: "Various limitations and structural problems have prevented the PSP API from GA." Having objects in Kubernetes never reaching GA (“permabeta”) is a problem for administrators and organizations, as a non-GA feature is not considered to be ready for widespread use. Given the structural problems with the PSPs as they exist today, there is no real path for them to become GA. Per the deprecation issue, “the future of restricting pod security settings does not lie in PSP because compatibility restrictions will prevent the kinds of changes that are required.” As such, PSPs will be deprecated in Kubernetes 1.21, though they will not be fully removed until a future version.


## What will replace them? 

Securing your pods requires understanding how the pods are intended to run, and what types of behaviors or activities you seek to prevent. While Pod Security Policies have been one way to enforce security configurations, other tools in the cloud native ecosystem have security enforcement capabilities. The [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) page in the Kubernetes Documentation aims “to detail recommended Pod security profiles, decoupled from any specific instantiation.”  This page is a useful reference for common pod security configurations, which can be implemented by native or external pod security enforcement tools.

While the scope of PSPs is beyond anything that will replace it, there are [a few tools in the ecosystem](https://landscape.cncf.io/card-mode?category=security-compliance&grouping=category) that can help enforce security policies through the management of Admission Controller Webhooks. We encourage you to assess the right tool for your needs. Pod Security Policies are one type of Admission Controller Webhook in Kubernetes, but there are a variety of available options. The blog post, [“A Guide to Kubernetes Admission Controllers”](https://kubernetes.io/blog/2019/03/21/a-guide-to-kubernetes-admission-controllers/) from March 2019 gives a great overview of what admission controller webhooks can do.

While the exact capabilities and use of policy enforcement tools will vary, the community is engaged in working toward better and better solutions for enforcing security policies across your Kubernetes pods.


## Wrapping it up

Deprecation notices draw our attention to the wide range of work going on in the Kubernetes ecosystem that will change the way we operate Kubernetes clusters in the future. This work is taken quite seriously and goes through a detailed exploration process by related SIG leads to understand the implications.

The deprecation of PSP will begin with Kubernetes version 1.21, with its removal in a future version. As we approach that milestone, the Kubernetes community will be working to document viable alternatives.

The removal of PSP will pave the way for adoption of more extensible security policy enforcement options.

Deprecation Release Notes: [https://relnotes.k8s.io/?kinds=deprecation](https://relnotes.k8s.io/?kinds=deprecation)
