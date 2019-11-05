---
reviewers:
- mikedanese
- thockin
title: Names
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

Each object in your cluster has a [_Name_](#names) that is unique for that type of resource.
Every Kubernetes object also has a [_UID_](#uids) that is unique across your whole cluster.

For example, you can only have one Pod named `myapp-1234` within the same [namespace](/docs/concepts/overview/working-with-objects/namespaces/), but you can have one Pod and one Deployment that are each named `myapp-1234`.

For non-unique user-provided attributes, Kubernetes provides [labels](/docs/concepts/overview/working-with-objects/labels/) and [annotations](/docs/concepts/overview/working-with-objects/annotations/).

{{% /capture %}}


{{% capture body %}}

## Names

{{< glossary_definition term_id="name" length="all" >}}

Kubernetes resources can have names up to 253 characters long. The characters allowed in names are: digits (0-9), lower case letters (a-z), `-`, and `.`.

Here’s an example manifest for a Pod named `nginx-demo`.

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

{{< note >}}
Some resource types have additional restrictions on their names.
{{< /note >}}

## UIDs

{{< glossary_definition term_id="uid" length="all" >}}

Kubernetes UIDs are universally unique identifiers (also known as UUIDs).
UUIDs are standardized as ISO/IEC 9834-8 and as ITU-T X.667.

{{% /capture %}}
{{% capture whatsnext %}}
* Read about [labels](/docs/concepts/overview/working-with-objects/labels/) in Kubernetes.
* See the [Identifiers and Names in Kubernetes](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md) design document.
{{% /capture %}}
