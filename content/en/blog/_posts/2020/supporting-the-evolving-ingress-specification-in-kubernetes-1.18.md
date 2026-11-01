---
layout: blog
title: Supporting the Evolving Ingress Specification in Kubernetes 1.18
date: 2020-06-05
slug: Supporting-the-Evolving-Ingress-Specification-in-Kubernetes-1.18
author: >
  Alex Gervais (Datawire.io)
---

Earlier this year, the Kubernetes team released [Kubernetes 1.18](https://kubernetes.io/blog/2020/03/25/kubernetes-1-18-release-announcement/), which extended Ingress. In this blog post, we’ll walk through what’s new in the new Ingress specification, what it means for your applications, and how to upgrade to an ingress controller that supports this new specification.

### What is Kubernetes Ingress
When deploying your applications in Kubernetes, one of the first challenges many people encounter is how to get traffic into their cluster. [Kubernetes ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) is a collection of routing rules that govern how external users access services running in a Kubernetes cluster. There are [three general approaches](https://blog.getambassador.io/kubernetes-ingress-nodeport-load-balancers-and-ingress-controllers-6e29f1c44f2d) for exposing your application:

* Using a `NodePort` to expose your application on a port across each of your nodes
* Using a `LoadBalancer` service to create an external load balancer that points to a Kubernetes service in your cluster
* Using a Kubernetes Ingress resource

### What’s new in Kubernetes 1.18 Ingress
There are three significant additions to the Ingress API in Kubernetes 1.18:

* A new `pathType` field
* A new `IngressClass` resource
* Support for wildcards in hostnames

The new `pathType` field allows you to specify how Ingress paths should match.
The field supports three types: `ImplementationSpecific` (default), `exact`, and `prefix`. Explicitly defining the expected behavior of path matching will allow every ingress-controller to support a user’s needs and will increase portability between ingress-controller implementation solutions.

The `IngressClass` resource specifies how Ingresses should be implemented by controllers. This was added to formalize the commonly used but never standardized `kubernetes.io/ingress.class` annotation and allow for implementation-specific extensions and configuration.

You can read more about these changes, as well as the support for wildcards in hostnames in more detail in [a previous blog post](https://kubernetes.io/blog/2020/04/02/improvements-to-the-ingress-api-in-kubernetes-1.18/).

## Supporting Kubernetes ingress
[Ambassador](https://www.getambassador.io) is an open-source Envoy-based ingress controller. We believe strongly in supporting common standards such as Kubernetes ingress, which we adopted and [announced our initial support for back in 2019](https://blog.getambassador.io/ambassador-ingress-controller-better-config-reporting-updated-envoy-proxy-99dc9139e28f).

Every Ambassador release goes through rigorous testing. Therefore, we also contributed an [open conformance test suite](https://github.com/kubernetes-sigs/ingress-controller-conformance), supporting Kubernetes ingress. We wrote the initial bits of test code and will keep iterating over the newly added features and different versions of the Ingress specification as it evolves to a stable v1 GA release. Documentation and usage samples, is one of our top priorities. We understand how complex usage can be,  especially when transitioning from a previous version of an API.

Following a test-driven development approach, the first step we took in supporting Ingress improvements in Ambassador was to translate the revised specification -- both in terms of API and behavior -- into a comprehensible test suite. The test suite, although still under heavy development and going through multiple iterations, was rapidly added to the Ambassador CI infrastructure and acceptance criteria. This means every change to the Ambassador codebase going forward will be compliant with the Ingress API and be tested end-to-end in a lightweight [KIND cluster](https://kind.sigs.k8s.io/). Using KIND allowed us to make rapid improvements while limiting our cloud provider infrastructure bill and testing out unreleased Kubernetes features with pre-release builds.

### Adopting a new specification
With a global comprehension of additions to Ingress introduced in Kubernetes 1.18 and a test suite on hand, we tackled the task of adapting the Ambassador code so that it would support translating the high-level Ingress API resources into Envoy configurations and constructs. Luckily Ambassador already supported previous versions of ingress functionalities so the development effort was incremental.

We settled on a controller name of `getambassador.io/ingress-controller`. This value, consistent with Ambassador's domain and CRD versions, must be used to tie in an IngressClass `spec.controller` with an Ambassador deployment. The new IngressClass resource allows for extensibility by setting a `spec.parameters` field. At the moment Ambassador makes no use of this field and its usage is reserved for future development.

Paths can now define different matching behaviors using the `pathType` field. The field will default to a value of `ImplementationSpecific`, which uses the same matching rules as the [Ambassador Mappings](https://www.getambassador.io/docs/latest/topics/using/mappings/) prefix field and previous Ingress specification for backward compatibility reasons.

### Kubernetes Ingress Controllers
A comprehensive [list of Kubernetes ingress controllers](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) is available in the Kubernetes documentation. Currently, Ambassador is the only ingress controller that supports these new additions to the ingress specification. Powered by the [Envoy Proxy](https://www.envoyproxy.io), Ambassador is the fastest way for you to try out the new ingress specification today.

Check out the following resources:

* Ambassador on [GitHub](https://www.github.com/datawire/ambassador)
* The Ambassador [documentation](https://www.getambassador.io/docs)
* [Improvements to the Ingress API](https://kubernetes.io/blog/2020/04/02/improvements-to-the-ingress-api-in-kubernetes-1.18/)

Or join the community on [Slack](http://d6e.co/slack)!
