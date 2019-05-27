---
reviewers:
- tallclair
- dchen1107
- egernst
title: Pod Overhead
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.15" state="alpha" >}}

This page describes pod Overhead, as defined in RuntimeClass and pod.Spec, and mechanisms for applying this feature.

{{% /capture %}}


{{% capture body %}}

## Pod Overhead

Pod Overhead is a feature for applying an overhead to a pods definition at admission time depending on the RuntimeClass being utilized.

### Set Up

Ensure the PodOverhead feature gate is enabled (it is by default). See [Feature
Gates](/docs/reference/command-line-tools-reference/feature-gates/) for an explanation of enabling
feature gates. The `PodOverhead` feature gate must be enabled on scheduler, apiservers _and_ kubelets.

1. Configure basic RuntimeClass
2. Add a pod Overhead to the defined RuntimeClass

#### 1. Configure basic RuntimeClass


#### 2. Add pod Overhead to RuntimeClass definition


{{< note >}}
It is recommended that RuntimeClass write operations (create/update/patch/delete) be
restricted to the cluster administrator. This is typically the default. See [Authorization
Overview](/docs/reference/access-authn-authz/authorization/) for more details.
{{< /note >}}

