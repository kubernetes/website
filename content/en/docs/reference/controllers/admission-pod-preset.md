---
title: Pod preset controller
content_template: templates/concept
---

{{% capture overview %}}

The Pod preset admission controller injects configuration data into
{{< glossary_tooltip text="pods" term_id="pod" >}} when they are created.

The configuration data can include {{< glossary_tooltip text="Secrets" term_id="secret" >}},
{{< glossary_tooltip text="Volumes" term_id="volume" >}}, volume mounts,
and {{< glossary_tooltip text="environment variables" term_id="container-env-variables" >}}.

{{% /capture %}}

{{% capture body %}}

## Controller behavior

Pod preset is a mutating
[admission controller](/docs/reference/access-authn-authz/admission-controllers/#what-are-they)
that acts on Pod creation requests.

When a pod creation request arrives for processing, the controller:

1. Retrieves all `PodPresets` available for use.
1. Checks if the label selectors of any `PodPreset` matches the labels on the
   Pod being created.
1. Attempts to merge the various resources defined by the `PodPreset` into the
   Pod being created.
1. On error, throws an event documenting the merge error on the Pod, and then
   allows creation of the the Pod _without_ any injected resources from the `PodPreset`.
1. Annotates the resulting modified Pod spec to indicate that it has been
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

{{% /capture %}}

{{% capture whatsnext %}}

* Learn how to [enable PodPreset](/docs/concepts/workloads/pods/podpreset/#enable-pod-preset)
* Try to [inject information into Pods Using a PodPreset](/docs/tasks/inject-data-application/podpreset/)

{{% /capture %}}
