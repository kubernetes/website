---
reviewers:
- mikedanese
- thockin
title: Object Names and IDs
content_type: concept
weight: 20
---

<!-- overview -->

Each object in your cluster has a [_Name_](#names) that is unique for that type of resource.
Every Kubernetes object also has a [_UID_](#uids) that is unique across your whole cluster.

For example, you can only have one Pod named `myapp-1234` within the same [namespace](/docs/concepts/overview/working-with-objects/namespaces/), but you can have one Pod and one Deployment that are each named `myapp-1234`.

For non-unique user-provided attributes, Kubernetes provides [labels](/docs/concepts/overview/working-with-objects/labels/) and [annotations](/docs/concepts/overview/working-with-objects/annotations/).



<!-- body -->

## Names

{{< glossary_definition term_id="name" length="all" >}}

{{< note >}}
In cases when objects represent a physical entity (like Node represent a physical host), when host is re-created under the same name without deleting and re-creating a Node, Kubernetes will treat it as a same thing, which may lead to inconsistencies.
{{< /note >}}

Below are three types of commonly used name constraints for resources.

### DNS Subdomain Names

Most resource types require a name that can be used as a DNS subdomain name
as defined in [RFC 1123](https://tools.ietf.org/html/rfc1123).
This means the name must:

- contain no more than 253 characters
- contain only lowercase alphanumeric characters, '-' or '.'
- start with an alphanumeric character
- end with an alphanumeric character

### DNS Label Names

Some resource types require their names to follow the DNS
label standard as defined in [RFC 1123](https://tools.ietf.org/html/rfc1123).
This means the name must:

- contain at most 63 characters
- contain only lowercase alphanumeric characters or '-'
- start with an alphanumeric character
- end with an alphanumeric character

### Path Segment Names

Some resource types require their names to be able to be safely encoded as a
path segment. In other words, the name may not be "." or ".." and the name may
not contain "/" or "%".

Here's an example manifest for a Pod named `nginx-demo`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-demo
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
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


## {{% heading "whatsnext" %}}

* Read about [labels](/docs/concepts/overview/working-with-objects/labels/) in Kubernetes.
* See the [Identifiers and Names in Kubernetes](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md) design document.

