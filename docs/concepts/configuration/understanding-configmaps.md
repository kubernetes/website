---
title: Understanding ConfigMaps
---

{% capture overview %}

A `ConfigMap` lets you separate configuration data for a container image from the container image itself. Decoupling configuration artifacts from image content keeps your containerized applications portable.

{% endcapture %}

{% capture body %}

## ConfigMaps

The [ConfigMap API resource](/docs/api-reference/v1.6/#configmap-v1-core) stores configuration data as key-value pairs. The data can be consumed in pods or provide the configurations for system components, such as controllers. ConfigMap is similar to [Secrets](/docs/concepts/configuration/secret/), but provides a means of working with strings that don't contain sensitive information. Users and system components alike can store configuration data in a ConfigMap.

**Note:** ConfigMaps should reference properties files, not replace them.

A ConfigMap is similar to a Linux `/etc` directory and its contents. For example, if you create a [Kubernetes Volume](/docs/concepts/storage/volumes/) from a ConfigMap, each data item in the ConfigMap is represented by an individual file in the volume.

A ConfigMap's `data` field contains the configuration data. Assigning `data` values can be simple, defining individual properties using `--from-literal`. Assignments can also be complex, defining multiple properties from configuration files or JSON blobs using `--from-file`. The following example demonstrates simple and complex methods:

{% include code.html language="yaml" file="concept-configmap.yaml" ghlink="/docs/concepts/configuration/concept-configmap.yaml" %}

{% endcapture %}

{% capture whatsnext %}

* See [Using ConfigMap Data in Pods](/docs/tasks/configure-pod-container/configure-pod-configmap).
* Follow a real world example of [Configuring Redis using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).

{% endcapture %}

{% include templates/concept.md %}
