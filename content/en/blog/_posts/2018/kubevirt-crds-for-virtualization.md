---
layout: blog
title:  'KubeVirt: Extending Kubernetes with CRDs for Virtualized Workloads'
date:   2018-07-27
author: >
  David Vossel (Red Hat)
---

## What is KubeVirt?

[KubeVirt](https://github.com/kubevirt/kubevirt) is a Kubernetes addon that provides users the ability to schedule traditional virtual machine workloads side by side with container workloads. Through the use of [Custom Resource Definitions](/docs/concepts/extend-Kubernetes/api-extension/custom-resources/) (CRDs) and other Kubernetes features, KubeVirt seamlessly extends existing Kubernetes clusters to provide a set of virtualization APIs that can be used to manage virtual machines.

## Why Use CRDs Over an Aggregated API Server?

Back in the middle of 2017, those of us working on KubeVirt were at a crossroads. We had to make a decision whether or not to extend Kubernetes using an aggregated API server or to make use of the new Custom Resource Definitions (CRDs) feature.

At the time, CRDs lacked much of the functionality we needed to deliver our feature set. The ability to create our own aggregated API server gave us all the flexibility we needed, but it had one major flaw. **An aggregated API server significantly increased the complexity involved with installing and operating KubeVirt.**

The crux of the issue for us was that aggregated API servers required access to etcd for object persistence. This meant that cluster admins would have to either accept that KubeVirt needs a separate etcd deployment which increases complexity, or provide KubeVirt with shared access to the Kubernetes etcd store which introduces risk.

We weren’t okay with this tradeoff. Our goal wasn’t to just extend Kubernetes to run virtualization workloads, it was to do it in the most seamless and effortless way possible. We felt that the added complexity involved with an aggregated API server sacrificed the part of the user experience involved with installing and operating KubeVirt.
 
**Ultimately we chose to go with CRDs and trust that the Kubernetes ecosystem would grow with us to meet the needs of our use case.** Our bets were well placed. At this point there are either solutions in place or solutions under discussion that solve every feature gap we encountered back in 2017 when were evaluating CRDs vs an aggregated API server. 

## Building Layered “Kubernetes like” APIs with CRDs

We designed KubeVirt’s API to follow the same patterns users are already familiar with in the Kubernetes core API. 

For example, in Kubernetes the lowest level unit that users create to perform work is a Pod. Yes, Pods do have multiple containers but logically the Pod is the unit at the bottom of the stack. A Pod represents a mortal workload. The Pod gets scheduled, eventually the Pod’s workload terminates, and that’s the end of the Pod’s lifecycle.

Workload controllers such as the ReplicaSet and StatefulSet are layered on top of the Pod abstraction to help manage scale out and stateful applications. From there we have an even higher level controller called a Deployment which is layered on top of ReplicaSets help manage things like rolling updates.

In KubeVirt, this concept of layering controllers is at the very center of our design. The KubeVirt VirtualMachineInstance (VMI) object is the lowest level unit at the very bottom of the KubeVirt stack. Similar in concept to a Pod, a VMI represents a single mortal virtualized workload that executes once until completion (powered off).

Layered on top of VMIs we have a workload controller called a VirtualMachine (VM). The VM controller is where we really begin to see the differences between how users manage virtualized workloads vs containerized workloads. Within the context of existing Kubernetes functionality, the best way to describe the VM controller’s behavior is to compare it to a StatefulSet of size one. This is because the VM controller represents a single stateful (immortal) virtual machine capable of persisting state across both node failures and multiple restarts of its underlying VMI. This object behaves in the way that is familiar to users who have managed virtual machines in AWS, GCE, OpenStack or any other similar IaaS cloud platform. The user can shutdown a VM, then choose to start that exact same VM up again at a later time. 

In addition to VMs, we also have a VirtualMachineInstanceReplicaSet (VMIRS) workload controller which manages scale out of identical VMI objects. This controller behaves nearly identically to the Kubernetes ReplicSet controller. The primary difference being that the VMIRS manages VMI objects and the ReplicaSet manages Pods. Wouldn’t it be nice if we could come up with a way to [use the Kubernetes ReplicaSet controller to scale out CRDs?](https://github.com/kubernetes/kubernetes/issues/65622)

Each one of these KubeVirt objects (VMI, VM, VMIRS) are registered with Kubernetes as a CRD when the KubeVirt install manifest is posted to the cluster. By registering our APIs as CRDs with Kubernetes, all the tooling involved with managing Kubernetes clusters (like kubectl) have access to the KubeVirt APIs just as if they are native Kubernetes objects.

## Dynamic Webhooks for API Validation

One of the responsibilities of the Kubernetes API server is to intercept and validate requests prior to allowing objects to be persisted into etcd. For example, if someone tries to create a Pod using a malformed Pod specification, the Kubernetes API server immediately catches the error and rejects the POST request. This all occurs before the object is persistent into etcd preventing the malformed Pod specification from making its way into the cluster.

This validation occurs during a process called admission control. Until recently, it was not possible to extend the default Kubernetes admission controllers without altering code and compiling/deploying an entirely new Kubernetes API server. This meant that if we wanted to perform admission control on KubeVirt’s CRD objects while they are posted to the cluster, we’d have to build our own version of the Kubernetes API server and convince our users to use that instead. That was not a viable solution for us.

Using the new [Dynamic Admission Control](/docs/reference/access-authn-authz/extensible-admission-controllers/) feature that first landed in Kubernetes 1.9, we now have a path for performing custom validation on KubeVirt API through the use of a [ValidatingAdmissionWebhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#external-admission-webhooks). This feature allows KubeVirt to dynamically register an HTTPS webhook with Kubernetes at KubeVirt install time. After registering the custom webhook, all requests related to KubeVirt API objects are forwarded from the Kubernetes API server to our HTTPS endpoint for validation. If our endpoint rejects a request for any reason, the object will not be persisted into etcd and the client receives our response outlining the reason for the rejection.

For example, if someone posts a malformed VirtualMachine object, they’ll receive an error indicating what the problem is. 

```
$ kubectl create -f my-vm.yaml 
Error from server: error when creating "my-vm.yaml": admission webhook "virtualmachine-validator.kubevirt.io" denied the request: spec.template.spec.domain.devices.disks[0].volumeName 'registryvolume' not found.
```

In the example output above, that error response is coming directly from KubeVirt’s admission control webhook. 

## CRD OpenAPIv3 Validation

In addition to the validating webhook, KubeVirt also uses the ability to provide an [OpenAPIv3 validation schema](/docs/tasks/access-kubernetes-API/extend-api-custom-resource-definitions/#advanced-topics) when registering a CRD with the cluster. While the OpenAPIv3 schema does not let us express some of the more advanced validation checks that the validation webhook provides, it does offer the ability to enforce simple validation checks involving things like required fields, max/min value lengths, and verifying that values are formatted in a way that matches a regular expression string.

## Dynamic Webhooks for “PodPreset Like” Behavior

The Kubernetes Dynamic Admission Control feature is not only limited to validation logic, it also provides the ability for applications like KubeVirt to both intercept and mutate requests as they enter the cluster. This is achieved through the use of a **MutatingAdmissionWebhook** object. In KubeVirt, we are looking to use a mutating webhook to support our VirtualMachinePreset (VMPreset) feature.

A VMPreset acts in a similar way to a PodPreset. Just like a PodPreset allows users to define values that should automatically be injected into pods at creation time, a VMPreset allows users to define values that should be injected into VMs at creation time. Through the use of a mutating webhook, KubeVirt can intercept a request to create a VM, apply VMPresets to the VM spec, and then validate that the resulting VM object. This all occurs before the VM object is persisted into etcd which allows KubeVirt to immediately notify the user of any conflicts at the time the request is made.

## Subresources for CRDs

When comparing the use of CRDs to an aggregated API server, one of the features CRDs lack is the ability to support subresources. Subresources are used to provide additional resource functionality. For example, the `pod/logs` and `pod/exec` subresource endpoints are used behind the scenes to provide the `kubectl logs` and `kubectl exec` command functionality.

Just like Kubernetes uses the `pod/exec` subresource to provide access to a pod’s environment, in KubeVirt we want subresources to provide serial-console, VNC, and SPICE access to a virtual machine. By adding virtual machine guest access through subresources, we can leverage RBAC to provide access control for these features.

So, given that the KubeVirt team decided to use CRD’s instead of an aggregated API server for custom resource support, how can we have subresources for CRDs when the CRD feature expiclity does not support subresources?

We created a workaround for this limitation by implementing a stateless aggregated API server that exists only to serve subresource requests. With no state, we don’t have to worry about any of the issues we identified earlier with regards to access to etcd. This means the KubeVirt API is actually supported through a combination of both CRDs for resources and an aggregated API server for stateless subresources.

This isn’t a perfect solution for us. Both aggregated API servers and CRDs require us to register an API GroupName with Kubernetes. This API GroupName field essentially namespaces the API’s REST path in a way that prevents API naming conflicts between other third party applications. Because CRDs and aggregated API servers can’t share the same GroupName, we have to register two separate GroupNames. One is used by our CRDs and the other is used by the aggregated API server for subresource requests. 

Having two GroupNames in our API is slightly inconvenient because it means the REST path for the endpoints that serve the KubeVirt subresource requests have a slightly different base path than the resources.

For example, the endpoint to create a VMI object is as follows.

**/apis/kubevirt.io/v1alpha2/namespaces/my-namespace/virtualmachineinstances/my-vm**

However, the subresource endpoint to access graphical VNC looks like this.

**/apis/subresources.kubevirt.io/v1alpha2/namespaces/my-namespace/virtualmachineinstances/my-vm/vnc**

Notice that the first request uses **kubevirt.io** and the second request uses **subresource.kubevirt.io**. We don’t like that, but that’s how we’ve managed to combine CRDs with a stateless aggregated API server for subresources.

One thing worth noting is that in Kubernetes 1.10 a very basic form of CRD subresource support was added in the form of the `/status` and `/scale` subresources. This support does not help us deliver the virtualization features we want subresources for. However, there have been discussions about exposing custom CRD subresources as webhooks in a future Kubernetes version. If this functionality lands, we will gladly transition away from our stateless aggregated API server workaround to use a subresource webhook feature.

## CRD Finalizers

A [CRD finalizer](/docs/tasks/access-kubernetes-API/extend-api-custom-resource-definitions/#advanced-topics) is a feature that lets us provide a pre-delete hook in order to perform actions before allowing a CRD object to be removed from persistent storage. In KubeVirt, we use finalizers to guarantee a virtual machine has completely terminated before we allow the corresponding VMI object to be removed from etcd.

## API Versioning for CRDs

The Kubernetes core APIs have the ability to support multiple versions for a single object type and perform conversions between those versions. This gives the Kubernetes core APIs a path for advancing the `v1alpha1` version of an object to a `v1beta1` version and so forth.

Prior to Kubernetes 1.11, CRDs did not have support for multiple versions. This meant when we wanted to progress a CRD from `kubevirt.io/v1alpha1` to `kubevirt.io/v1beta1`, the only path available to was to backup our CRD objects, delete the registered CRD from Kubernetes, register a new CRD with the updated version, convert the backed up CRD objects to the new version, and finally post the migrated CRD objects back to the cluster.

That strategy was not exactly a viable option for us.

Fortunately thanks to some recent [work to rectify this issue in Kubernetes](https://github.com/kubernetes/features/issues/544), the latest Kubernetes v1.11 now supports [CRDs with multiple versions](https://github.com/kubernetes/kubernetes/pull/63830). Note however that this initial multi version support is limited. While a CRD can now have multiple versions, the feature does not currently contain a path for performing conversions between versions. In KubeVirt, the lack of conversion makes it difficult us to evolve our API as we progress versions. Luckily, support for conversions between versions is underway and we look forward to taking advantage of that feature once it lands in a future Kubernetes release.
