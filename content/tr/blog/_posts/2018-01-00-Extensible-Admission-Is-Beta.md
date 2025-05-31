---
title: "Extensible Admission is Beta"
date: 2018-01-11
slug: extensible-admission-is-beta
url: /blog/2018/01/Extensible-Admission-Is-Beta
---
In this post we review a feature, available in the Kubernetes API server, that allows you to implement arbitrary control decisions and which has matured considerably in Kubernetes 1.9.  

The admission stage of API server processing is one of the most powerful tools for securing a Kubernetes cluster by restricting the objects that can be created, but it has always been limited to compiled code. In 1.9, we promoted webhooks for admission to beta, allowing you to leverage admission from outside the API server process.  



## What is Admission?
[Admission](/docs/reference/access-authn-authz/admission-controllers/#what-are-they) is the phase of [handling an API server request](https://blog.openshift.com/kubernetes-deep-dive-api-server-part-1/) that happens before a resource is persisted, but after authorization. Admission gets access to the same information as authorization (user, URL, etc) and the complete body of an API request (for most requests).  

[![](https://2.bp.blogspot.com/-p8WGg2BATsY/WlfywbD_tAI/AAAAAAAAAJw/mDqZV0dB4_Y0gXXQp_1tQ7CtMRSd6lHVwCK4BGAYYCw/s640/Screen%2BShot%2B2018-01-11%2Bat%2B3.22.07%2BPM.png)](https://2.bp.blogspot.com/-p8WGg2BATsY/WlfywbD_tAI/AAAAAAAAAJw/mDqZV0dB4_Y0gXXQp_1tQ7CtMRSd6lHVwCK4BGAYYCw/s1600/Screen%2BShot%2B2018-01-11%2Bat%2B3.22.07%2BPM.png)  

The admission phase is composed of individual plugins, each of which are narrowly focused and have semantic knowledge of what they are inspecting. Examples include: PodNodeSelector (influences scheduling decisions), PodSecurityPolicy (prevents escalating containers), and ResourceQuota (enforces resource allocation per namespace).  

Admission is split into two phases:  

1. Mutation, which allows modification of the body content itself as well as rejection of an API request.
2. Validation, which allows introspection queries and rejection of an API request.
An admission plugin can be in both phases, but all mutation happens before validation.



### Mutation
The mutation phase of admission allows modification of the resource content before it is persisted. Because the same field can be mutated multiple times while in the admission chain, the order of the admission plugins in the mutation matters.  

One example of a mutating admission plugin is the `PodNodeSelector` plugin, which uses an annotation on a namespace `namespace.annotations[“scheduler.alpha.kubernetes.io/node-selector”]` to find a label selector and add it to the `pod.spec.nodeselector` field. This positively restricts which nodes the pods in a particular namespace can land on, as opposed to taints, which provide negative restriction (also with an admission plugin).



### Validation
The validation phase of admission allows the enforcement of invariants on particular API resources. The validation phase runs after all mutators finish to ensure that the resource isn’t going to change again.  

One example of a validation admission plugin is also the `PodNodeSelector` plugin, which ensures that all pods’ `spec.nodeSelector` fields are constrained by the node selector restrictions on the namespace. Even if a mutating admission plugin tries to change the `spec.nodeSelector` field after the PodNodeSelector runs in the mutating chain, the PodNodeSelector in the validating chain prevents the API resource from being created because it fails validation.  


## What are admission webhooks?
Admission webhooks allow a Kubernetes installer or a cluster-admin to add mutating and validating admission plugins to the admission chain of `kube-apiserver` as well as any extensions apiserver based on k8s.io/apiserver 1.9, like [metrics](https://github.com/kubernetes/metrics), [service-catalog](https://github.com/kubernetes-incubator/service-catalog), or [kube-projects](https://github.com/openshift/kube-projects), without recompiling them. Both kinds of admission webhooks run at the end of their respective chains and have the same powers and limitations as compiled admission plugins.  


### What are they good for?
Webhook admission plugins allow for mutation and validation of any resource on any API server, so the possible applications are vast. Some common use-cases include:  

1. Mutation of resources like pods. Istio has talked about doing this to inject side-car containers into pods. You could also write a plugin which forcefully resolves image tags into image SHAs.
2. Name restrictions. On multi-tenant systems, reserving namespaces has emerged as a use-case.
3. Complex CustomResource validation. Because the entire object is visible, a clever admission plugin can perform complex validation on dependent fields (A requires B) and even external resources (compare to LimitRanges).
4. Security response. If you forced image tags into image SHAs, you could write an admission plugin that prevents certain SHAs from running.

### Registration
Webhook admission plugins of both types are registered in the API, and all API servers (kube-apiserver and all extension API servers) share a common config for them. During the registration process, a webhook admission plugin describes:  


1. How to connect to the webhook admission server
2. How to verify the webhook admission server (Is it really the server I expect?)
3. Where to send the data at that server (which URL path)
4. Which resources and which HTTP verbs it will handle
5. What an API server should do on connection failures (for example, if the admission webhook server goes down)
```
1 apiVersion: admissionregistration.k8s.io/v1beta1  
2 kind: ValidatingWebhookConfiguration  
3 metadata:  
4   name: namespacereservations.admission.online.openshift.io  
5 webhooks:  
6 - name: namespacereservations.admission.online.openshift.io  
7   clientConfig:  
8     service:  
9       namespace: default  
10      name: kubernetes  
11     path: /apis/admission.online.openshift.io/v1alpha1/namespacereservations  
12    caBundle: KUBE\_CA\_HERE  
13  rules:  
14  - operations:  
15    - CREATE  
16    apiGroups:  
17    - ""  
18    apiVersions:  
19    - "\*"  
20    resources:  
21    - namespaces  
22  failurePolicy: Fail
```
Line 6: `name` - the name for the webhook itself. For mutating webhooks, these are sorted to provide ordering.  
Line 7: `clientConfig` - provides information about how to connect to, trust, and send data to the webhook admission server.  
Line 13: `rules` - describe when an API server should call this admission plugin. In this case, only for creates of namespaces. You can specify any resource here so specifying creates of `serviceinstances.servicecatalog.k8s.io` is also legal.  
Line 22: `failurePolicy` - says what to do if the webhook admission server is unavailable. Choices are “Ignore” (fail open) or “Fail” (fail closed). Failing open makes for unpredictable behavior for all clients.



### Authentication and trust

Because webhook admission plugins have a lot of power (remember, they get to see the API resource content of any request sent to them and might modify them for mutating plugins), it is important to consider:  

- How individual API servers verify their connection to the webhook admission server
- How the webhook admission server authenticates precisely which API server is contacting it
- Whether that particular API server has authorization to make the request
There are three major categories of connection:  

1. From kube-apiserver or extension-apiservers to externally hosted admission webhooks (webhooks not hosted in the cluster)
2. From kube-apiserver to self-hosted admission webhooks
3. From extension-apiservers to self-hosted admission webhooks
To support these categories, the webhook admission plugins accept a kubeconfig file which describes how to connect to individual servers. For interacting with externally hosted admission webhooks, there is really no alternative to configuring that file manually since the authentication/authorization and access paths are owned by the server you’re hooking to.  

For the self-hosted category, a cleverly built webhook admission server and topology can take advantage of the safe defaulting built into the admission plugin and have a secure, portable, zero-config topology that works from any API server.



### Simple, secure, portable, zero-config topology
If you build your webhook admission server to also be an extension API server, it becomes possible to aggregate it as a normal API server. This has a number of advantages:  

- Your webhook becomes available like any other API under default kube-apiserver service `kubernetes.default.svc` (e.g. [https://kubernetes.default.svc/apis/admission.example.com/v1/mymutatingadmissionreviews](https://kubernetes.default.svc/apis/admission.example.com/v1/mymutatingadmissionreviews)). Among other benefits, you can test using `kubectl`.
- Your webhook automatically (without any config) makes use of the in-cluster authentication and authorization provided by kube-apiserver. You can restrict access to your webhook with normal RBAC rules.
- Your extension API servers and kube-apiserver automatically (without any config) make use of their in-cluster credentials to communicate with the webhook.
- Extension API servers do not leak their service account token to your webhook because they go through kube-apiserver, which is a secure front proxy.

 ![](https://lh6.googleusercontent.com/FeXoJLmbhf5exSBQu6Wxd2sIEqzkKPbRA_iv6T2QmJbhRsO4FyPtgAAbHdAmuTrE0jVEUzftfxcPndN8ACzstfsX9XTFdQFrioS1srvYgVP3l99R6x-vvd3RfBA4eWttaKRWj6iA)  
_Source: [https://drive.google.com/a/redhat.com/file/d/12nC9S2fWCbeX\_P8nrmL6NgOSIha4HDNp](https://drive.google.com/a/redhat.com/file/d/12nC9S2fWCbeX_P8nrmL6NgOSIha4HDNp)_   

In short: a secure topology makes use of all security mechanisms of API server aggregation and additionally requires no additional configuration.  

Other topologies are possible but require additional manual configuration as well as a lot of effort to create a secure setup, especially when extension API servers like service catalog come into play. The topology above is zero-config and portable to every Kubernetes cluster.



### How do I write a webhook admission server?
Writing a full server complete with authentication and authorization can be intimidating. To make it easier, there are projects based on Kubernetes 1.9 that provide a library for building your webhook admission server in 200 lines or less. Take a look at the [generic-admission-apiserver](https://github.com/openshift/generic-admission-server) and the [kubernetes-namespace-reservation](https://github.com/openshift/kubernetes-namespace-reservation) projects for the library and an example of how to build your own secure and portable webhook admission server.  

With the admission webhooks introduced in 1.9 we’ve made Kubernetes even more adaptable to your needs. We hope this work, driven by both Red Hat and Google, will enable many more workloads and support ecosystem components. (Istio is one example.) Now is a good time to give it a try!  

If you’re interested in giving feedback or contributing to this area, join us in the [SIG API machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery).
