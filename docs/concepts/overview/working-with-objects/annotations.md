---
title: Annotations
---

{% capture overview %}
You can use Kubernetes annotations to attach arbitrary non-identifying metadata
to objects. Clients such as tools and libraries can retrieve this metadata.
{% endcapture %}

{% capture body %}
## Attaching metadata to objects

You can use either labels or annotations to attach metadata to Kubernetes
objects. Labels can be used to select objects and to find
collections of objects that satisfy certain conditions. In contrast, annotations
are not used to identify and select objects. The metadata
in an annotation can be small or large, structured or unstructured, and can
include characters not permitted by labels.

Annotations, like labels, are key/value maps:

    "annotations": {
      "key1" : "value1",
      "key2" : "value2"
    }

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

Instead of using annotations, you could store this type of information in an
external database or directory, but that would make it much harder to produce
shared client libraries and tools for deployment, management, introspection,
and the like.

{% endcapture %}

{% capture whatsnext %}
Learn more about [Labels and Selectors](/docs/concepts/overview/working-with-objects/labels/).
{% endcapture %}

{% include templates/concept.md %}
