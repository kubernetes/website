---
reviewers:
- jessfraz
title: Pod Preset
content_template: templates/concept
weight: 50
---

{{% capture overview %}}
This page provides an overview of PodPresets, which are objects for injecting
certain information into pods at creation time. The information can include
secrets, volumes, volume mounts, and environment variables.
{{% /capture %}}


{{% capture body %}}
## Understanding Pod Presets

A `Pod Preset` is an API resource for injecting additional runtime requirements
into a Pod at creation time.
You use [label selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
to specify the Pods to which a given Pod Preset applies.

Using a Pod Preset allows pod template authors to not have to explicitly provide
all information for every pod. This way, authors of pod templates consuming a
specific service do not need to know all the details about that service.

For more information about the background, see the [design proposal for PodPreset](https://git.k8s.io/community/contributors/design-proposals/service-catalog/pod-preset.md).

## How It Works

Kubernetes provides an admission controller (`PodPreset`) which, when enabled,
applies Pod Presets to incoming pod creation requests.
When a pod creation request occurs, the system does the following:

1. Retrieve all `PodPresets` available for use.
1. Check if the label selectors of any `PodPreset` matches the labels on the
   pod being created.
1. Attempt to merge the various resources defined by the `PodPreset` into the
   Pod being created.
1. On error, throw an event documenting the merge error on the pod, and create
   the pod _without_ any injected resources from the `PodPreset`.
1. Annotate the resulting modified Pod spec to indicate that it has been
   modified by a `PodPreset`. The annotation is of the form
   `podpreset.admission.kubernetes.io/podpreset-<pod-preset name>: "<resource version>"`.

Each Pod can be matched by zero or more Pod Presets; and each `PodPreset` can be
applied to zero or more pods. When a `PodPreset` is applied to one or more
Pods, Kubernetes modifies the Pod Spec. For changes to `Env`, `EnvFrom`, and
`VolumeMounts`, Kubernetes modifies the container spec for all containers in
the Pod; for changes to `Volume`, Kubernetes modifies the Pod Spec.

{{< note >}}
A Pod Preset is capable of modifying the following fields in a Pod spec when appropriate:
- The `.spec.containers` field.
- The `initContainers` field (requires Kubernetes version 1.14.0 or later).
{{< /note >}}

### Disable Pod Preset for a Specific Pod

There may be instances where you wish for a Pod to not be altered by any Pod
Preset mutations. In these cases, you can add an annotation in the Pod Spec
of the form: `podpreset.admission.kubernetes.io/exclude: "true"`.

## Enable Pod Preset

In order to use Pod Presets in your cluster you must ensure the following:

1.  You have enabled the API type `settings.k8s.io/v1alpha1/podpreset`. For
    example, this can be done by including `settings.k8s.io/v1alpha1=true` in
    the `--runtime-config` option for the API server. In minikube add this flag
    `--extra-config=apiserver.runtime-config=settings.k8s.io/v1alpha1=true` while
    starting the cluster.
1.  You have enabled the admission controller `PodPreset`. One way to doing this
    is to include `PodPreset` in the `--enable-admission-plugins` option value specified
    for the API server. In minikube add this flag
    
    ```shell
    --extra-config=apiserver.enable-admission-plugins=NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,NodeRestriction,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota,PodPreset
    ```
    
    while starting the cluster.
1.  You have defined your Pod Presets by creating `PodPreset` objects in the
    namespace you will use.

{{% /capture %}}

{{% capture whatsnext %}}

* [Injecting data into a Pod using PodPreset](/docs/tasks/inject-data-application/podpreset/)

{{% /capture %}}
