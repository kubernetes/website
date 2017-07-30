---
title: Understanding ConfigMaps
---

{% capture overview %}

A `ConfigMap` lets you separate configuration data for a container image from the container image itself. Decoupling configuration data from image content keeps your containerized applications portable.

{% endcapture %}

ConfigMaps allow you to decouple configuration artifacts from image content to keep containerized applications portable.
The ConfigMap API resource stores configuration data as key-value pairs. The data can be consumed in pods or provide the configurations for system components such as controllers. ConfigMap is similar to [Secrets](/docs/concepts/configuration/secret/), but provides a means of working with strings that don't contain sensitive information. Users and system components alike can store configuration data in ConfigMap.

Note: ConfigMaps should reference properties files, not replace them. Think of the ConfigMap as representing something similar to the a Linux `/etc` directory and its contents. For example, if you create a [Kubernetes Volume](/docs/concepts/storage/volumes/) from a ConfigMap, each data item in the ConfigMap is represented by an individual file in the volume.

The ConfigMap's `data` field contains the configuration data. As shown in the example below, this can be simple -- like individual properties defined using `--from-literal` -- or complex -- like configuration files or JSON blobs defined using `--from-file`.

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: example-config
  namespace: default
data:
  # example of a simple property defined using --from-literal
  example.property.1: hello
  example.property.2: world
  # example of a complex property defined using --from-file
  example.property.file: |-
    property.1=value-1
    property.2=value-2
    property.3=value-3
```

{% capture whatsnext %}
* See [Using ConfigMap Data in Pods](/docs/tasks/configure-pod-container/configure-pod-configmap).
* Follow a real world example of [Configuring Redis using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).
{% endcapture %}

{% include templates/???.md %}
