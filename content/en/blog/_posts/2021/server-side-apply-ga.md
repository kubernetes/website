---
layout: blog
title: "Kubernetes 1.22: Server Side Apply moves to GA"
date: 2021-08-06
slug: server-side-apply-ga
author: >
  Jeffrey Ying (Google)
  Joe Betz (Google) 
---

Server-side Apply (SSA) has been promoted to GA in the Kubernetes v1.22 release. The GA milestone means you can depend on the feature and its API, without fear of future backwards-incompatible changes. GA features are protected by the Kubernetes [deprecation policy](/docs/reference/using-api/deprecation-policy/).

## What is Server-side Apply?

Server-side Apply helps users and controllers manage their resources through declarative configurations. Server-side Apply replaces the client side apply feature implemented by “kubectl apply” with a server-side implementation, permitting use by tools/clients other than kubectl. Server-side Apply is a new merging algorithm, as well as tracking of field ownership, running on the Kubernetes api-server. Server-side Apply enables new features like conflict detection, so the system knows when two actors are trying to edit the same field. Refer to the [Server-side Apply Documentation](/docs/reference/using-api/server-side-apply/) and [Beta 2 release announcement](https://kubernetes.io/blog/2020/04/01/kubernetes-1.18-feature-server-side-apply-beta-2/) for more information.

## What’s new since Beta?

Since the [Beta 2 release](https://kubernetes.io/blog/2020/04/01/kubernetes-1.18-feature-server-side-apply-beta-2/) subresources support has been added, and both client-go and Kubebuilder have added comprehensive support for Server-side Apply. This completes the Server-side Apply functionality required to make controller development practical.

### Support for subresources

Server-side Apply now fully supports subresources like `status` and `scale`. This is particularly important for [controllers](/docs/concepts/architecture/controller/), which are often responsible for writing to subresources.

## Server-side Apply support in client-go

Previously, Server-side Apply could only be called from the client-go typed client using the `Patch` function, with `PatchType` set to `ApplyPatchType`.  Now, `Apply` functions are included in the client to allow for a more direct and typesafe way of calling Server-side Apply. Each `Apply` function takes an "apply configuration" type as an argument, which is a structured representation of an Apply request. For example:

```go
import (
         ...
         v1ac "k8s.io/client-go/applyconfigurations/autoscaling/v1"
)

hpaApplyConfig := v1ac.HorizontalPodAutoscaler(autoscalerName, ns).
         WithSpec(v1ac.HorizontalPodAutoscalerSpec().
                  WithMinReplicas(0)
         )

return hpav1client.Apply(ctx, hpaApplyConfig, metav1.ApplyOptions{FieldManager: "mycontroller", Force: true})
```

Note in this example that `HorizontalPodAutoscaler` is imported from an "applyconfigurations" package. Each "apply configuration" type represents the same Kubernetes object kind as the corresponding go struct, but where all fields are pointers to make them optional, allowing apply requests to be accurately represented. For example, when the apply configuration in the above example is marshalled to YAML, it produces:

```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
    name: myHPA
    namespace: myNamespace
spec:
    minReplicas: 0
```

To understand why this is needed, the above YAML cannot be produced by the v1.HorizontalPodAutoscaler go struct. Take for example:

```go
hpa := v1.HorizontalPodAutoscaler{
         TypeMeta: metav1.TypeMeta{
                  APIVersion: "autoscaling/v1",
                  Kind:       "HorizontalPodAutoscaler",
         },
         ObjectMeta: ObjectMeta{
                  Namespace: ns,
                  Name:      autoscalerName,
         },
         Spec: v1.HorizontalPodAutoscalerSpec{
                  MinReplicas: pointer.Int32Ptr(0),
         },
}
```

The above code attempts to declare the same apply configuration as shown in the previous examples, but when marshalled to YAML, produces:

```yaml
kind: HorizontalPodAutoscaler
apiVersion: autoscaling/v1
metadata
  name: myHPA
  namespace: myNamespace
  creationTimestamp: null
spec:
  scaleTargetRef:
    kind: ""
    name: ""
  minReplicas: 0
  maxReplicas: 0
```

Which, among other things, contains `spec.maxReplicas` set to `0`. This is almost certainly not what the caller intended (the intended apply configuration says nothing about the `maxReplicas` field), and could have serious consequences on a production system: it directs the autoscaler to downscale to zero pods. The problem here originates from the fact that the go structs contain required fields that are zero valued if not set explicitly. The go structs work as intended for create and update operations, but are fundamentally incompatible with apply, which is why we have introduced the generated "apply configuration" types.

The "apply configurations" also have convenience `With<FieldName>` functions that make it easier to build apply requests. This allows developers to set fields without having to deal with the fact that all the fields in the "apply configuration" types are pointers, and are inconvenient to set using go. For example `MinReplicas: &0` is not legal go code, so without the `With` functions, developers would work around this problem by using a library, e.g. `MinReplicas: pointer.Int32Ptr(0)`, but string enumerations like `corev1.Protocol` are still a problem since they cannot be supported by a general purpose library. In addition to the convenience, the `With` functions also isolate developers from the underlying representation, which makes it safer for the underlying representation to be changed to support additional features in the future.

## Using Server-side Apply in a controller

You can use the new support for Server-side Apply no matter how you implemented your controller. However, the new client-go support makes it easier to use Server-side Apply in controllers.

When authoring new controllers to use Server-side Apply, a good approach is to have the controller recreate the apply configuration for an object each time it reconciles that object.  This ensures that the controller fully reconciles all the fields that it is responsible for. Controllers typically should unconditionally set all the fields they own by setting `Force: true` in the `ApplyOptions`. Controllers must also provide a `FieldManager` name that is unique to the reconciliation loop that apply is called from.

When upgrading existing controllers to use Server-side Apply the same approach often works well--migrate the controllers to recreate the apply configuration each time it reconciles any object. Unfortunately, the controller might have multiple code paths that update different parts of an object depending on various conditions. Migrating a controller like this to Server-side Apply can be risky because if the controller forgets to include any fields in an apply configuration that is included in a previous apply request, a field can be accidently deleted. To ease this type of migration, client-go apply support provides a way to replace any controller reconciliation code that performs a "read/modify-in-place/update" (or patch) workflow with a "extract/modify-in-place/apply" workflow. Here's an example of the new workflow:

```go
fieldMgr := "my-field-manager"
deploymentClient := clientset.AppsV1().Deployments("default")

// read, could also be read from a shared informer
deployment, err := deploymentClient.Get(ctx, "example-deployment", metav1.GetOptions{})
if err != nil {
  // handle error
}

// extract
deploymentApplyConfig, err := appsv1ac.ExtractDeployment(deployment, fieldMgr)
if err != nil {
  // handle error
}

// modify-in-place
deploymentApplyConfig.Spec.Template.Spec.WithContainers(corev1ac.Container().
	WithName("modify-slice").
	WithImage("nginx:1.14.2"),
)

// apply
applied, err := deploymentClient.Apply(ctx, deploymentApplyConfig, metav1.ApplyOptions{FieldManager: fieldMgr})
```

For developers using Custom Resource Definitions (CRDs), the Kubebuilder apply support will provide the same capabilities. Documentation will be included in the Kubebuilder book when available.

## Server-side Apply and CustomResourceDefinitions

It is strongly recommended that all [Custom Resource Definitions](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) (CRDs) have a schema. CRDs without a schema are treated as unstructured data by Server-side Apply. Keys are treated as fields in a struct and lists are assumed to be atomic.

CRDs that specify a schema are able to specify additional annotations in the schema. Please refer to the documentation on the full list of available annotations.

New annotations since beta:

**Defaulting:** Values for fields that appliers do not express explicit interest in should be defaulted. This prevents an applier from unintentionally owning a defaulted field that might cause conflicts with other appliers. If unspecified, the default value is nil or the nil equivalent for the corresponding type.

- Usage: see the [CRD Defaulting](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#defaulting) documentation for more details.
- Golang: `+default=<value>`
- OpenAPI extension: `default: <value>`


Atomic for maps and structs:

**Maps:** By default maps are granular. A different manager is able to manage each map entry. They can also be configured to be atomic such that a single manager owns the entire map.

- Usage: Refer to [Merge Strategy](/docs/reference/using-api/server-side-apply/#merge-strategy) for a more detailed overview
- Golang: `+mapType=granular/atomic`
- OpenAPI extension: `x-kubernetes-map-type: granular/atomic`

**Structs:** By default structs are granular and a separate applier may own each field. For certain kinds of structs, atomicity may be desired. This is most commonly seen in small coordinate-like structs such as Field/Object/Namespace Selectors, Object References, RGB values, Endpoints (Protocol/Port pairs), etc.

- Usage: Refer to [Merge Strategy](/docs/reference/using-api/server-side-apply/#merge-strategy) for a more detailed overview
- Golang: `+structType=granular/atomic`
- OpenAPI extension: `x-kubernetes-map-type:atomic/granular`

## What's Next?

After Server Side Apply, the next focus for the API Expression working-group is around improving the expressiveness and size of the published Kubernetes API schema. To see the full list of items we are working on, please join our working group and refer to the work items document.

## How to get involved?

The working-group for apply is [wg-api-expression](https://github.com/kubernetes/community/tree/master/wg-api-expression). It is available on slack [#wg-api-expression](https://kubernetes.slack.com/archives/C0123CNN8F3), through the [mailing list](https://groups.google.com/g/kubernetes-wg-api-expression) and we also meet every other Tuesday at 9.30 PT on Zoom.

We would also like to use the opportunity to thank the hard work of all the contributors involved in making this promotion to GA possible:

- Andrea Nodari
- Antoine Pelisse
- Daniel Smith
- Jeffrey Ying
- Jenny Buckley
- Joe Betz
- Julian Modesto
- Kevin Delgado
- Kevin Wiesmüller
- Maria Ntalla
