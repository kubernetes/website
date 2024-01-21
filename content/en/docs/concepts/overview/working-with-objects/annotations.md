---
title: Annotations
content_type: concept
weight: 60
---

<!-- overview -->
You can use Kubernetes annotations to attach arbitrary non-identifying metadata
to {{< glossary_tooltip text="objects" term_id="object" >}}.
Clients such as tools and libraries can retrieve this metadata.

<!-- body -->
## Attaching metadata to objects

You can use either labels or annotations to attach metadata to Kubernetes
objects. Labels can be used to select objects and to find
collections of objects that satisfy certain conditions. In contrast, annotations
are not used to identify and select objects. The metadata
in an annotation can be small or large, structured or unstructured, and can
include characters not permitted by labels. It is possible to use labels as 
well as annotations in the metadata of the same object.

Annotations, like labels, are key/value maps:

```json
"metadata": {
  "annotations": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

{{<note>}}
The keys and the values in the map must be strings. In other words, you cannot use
numeric, boolean, list or other types for either the keys or the values.
{{</note>}}

Here are some examples of information that could be recorded in annotations:

* Fields managed by a declarative configuration layer. Attaching these fields
  as annotations distinguishes them from default values set by clients or
  servers, and from auto-generated fields and fields set by
  auto-sizing or auto-scaling systems.

* Build, release, or image information like timestamps, release IDs, git branch,
  PR numbers, image hashes, and registry address.

* Pointers to logging, monitoring, analytics, or audit repositories.

* Client library or tool information that can be used for debugging purposes:
  for example, name, version, and build information.

* User or tool/system provenance information, such as URLs of related objects
  from other ecosystem components.

* Lightweight rollout tool metadata: for example, config or checkpoints.

* Phone or pager numbers of persons responsible, or directory entries that
  specify where that information can be found, such as a team web site.

* Directives from the end-user to the implementations to modify behavior or
  engage non-standard features.

Instead of using annotations, you could store this type of information in an
external database or directory, but that would make it much harder to produce
shared client libraries and tools for deployment, management, introspection,
and the like.

## Syntax and character set

_Annotations_ are key/value pairs. Valid annotation keys have two segments: an optional prefix and name, separated by a slash (`/`). The name segment is required and must be 63 characters or less, beginning and ending with an alphanumeric character (`[a-z0-9A-Z]`) with dashes (`-`), underscores (`_`), dots (`.`), and alphanumerics between. The prefix is optional. If specified, the prefix must be a DNS subdomain: a series of DNS labels separated by dots (`.`), not longer than 253 characters in total, followed by a slash (`/`).

If the prefix is omitted, the annotation Key is presumed to be private to the user. Automated system components (e.g. `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubectl`, or other third-party automation) which add annotations to end-user objects must specify a prefix.

The `kubernetes.io/` and `k8s.io/` prefixes are reserved for Kubernetes core components.

For example, here's a manifest for a Pod that has the annotation `imageregistry: https://hub.docker.com/` :

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: annotations-demo
  annotations:
    imageregistry: "https://hub.docker.com/"
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

## {{% heading "whatsnext" %}}

- Learn more about [Labels and Selectors](/docs/concepts/overview/working-with-objects/labels/).
- Find [Well-known labels, Annotations and Taints](/docs/reference/labels-annotations-taints/)
