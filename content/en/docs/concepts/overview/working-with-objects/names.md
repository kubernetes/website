---
reviewers:
- mikedanese
- thockin
title: Names
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

All objects in the Kubernetes REST API are unambiguously identified by a Name and a UID.

For non-unique user-provided attributes, Kubernetes provides [labels](/docs/user-guide/labels) and [annotations](/docs/concepts/overview/working-with-objects/annotations/).

See the [identifiers design doc](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md) for the precise syntax rules for Names and UIDs.

{{% /capture %}}


{{% capture body %}}

## Names

{{< glossary_definition term_id="name" length="all" >}}

By convention, the names of Kubernetes resources should be up to maximum length of 253 characters and consist of lower case alphanumeric characters, `-`, and `.`, but certain resources have more specific restrictions.

For example, here’s the configuration file with a Pod name as `nginx-demo` and a Container name as `nginx`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-demo
spec:
  containers:
  - name: nginx
    image: nginx:1.7.9
    ports:
    - containerPort: 80
```

## UIDs

{{< glossary_definition term_id="uid" length="all" >}}

{{% /capture %}}
