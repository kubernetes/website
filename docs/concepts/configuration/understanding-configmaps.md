---
title: Understanding ConfigMaps
---

{% capture overview %}

A `ConfigMap` lets you separate configuration data for a container image from the container image itself. Decoupling configuration artifacts from image content keeps your containerized applications portable.

{% endcapture %}

{% capture body %}

## Understanding ConfigMaps

The [ConfigMap API resource](/docs/api-reference/v1.6/#configmap-v1-core) stores configuration data as key-value pairs. The data can be consumed in pods or provide the configurations for system components, such as controllers. ConfigMap is similar to [Secrets](/docs/concepts/configuration/secret/), but provides a means of working with strings that don't contain sensitive information. Users and system components alike can store configuration data in a ConfigMap.

**Note:** ConfigMaps should reference properties files, not replace them.

A ConfigMap is similar to a Linux `/etc` directory and its contents. For example, if you create a [Kubernetes Volume](/docs/concepts/storage/volumes/) from a ConfigMap, each data item in the ConfigMap is represented by an individual file in the volume.

A ConfigMap's `data` field contains the configuration data. Assigning `data` values can be simple, defining individual properties using `--from-literal`. Assignments can also be complex, defining multiple properties from configuration files or JSON blobs using `--from-file`. The following example demonstrates simple and complex methods:

{% include code.html language="yaml" file="concept-configmap.yaml" ghlink="/docs/concepts/configuration/concept-configmap.yaml" %}

## ConfigMaps and Pods: Restrictions

You can use ConfigMaps to configure [pods](/docs/concepts/workloads/pods/pod/), but there are some restrictions:

1. Unless you mark the ConfigMap as "optional", you must create a ConfigMap before referencing it in a Pod specification.

  If you reference a ConfigMap that doesn't exist, the Pod doesn't start. Likewise, references in the ConfigMap to keys that don't exist prevent the pod from starting.

1. If you use `envFrom` to define environment variables from ConfigMaps, invalid keys will be skipped.

  The pod starts, but the invalid names are recorded in the event log (`InvalidVariableNames`). The log message lists each skipped key. For example:

   ```shell
   kubectl get events
   LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
   0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
   ```

1. ConfigMaps reside in a specific [namespace](/docs/user-guide/namespaces/).

  A ConfigMap can only be referenced by pods residing in the same namespace.

1. Kubelet doesn't support ConfigMaps for pods not found on the API server.

  This includes pods created using kubectl or indirectly with a replication controller. It does not include pods created via Kubelet's `--manifest-url` flag, `--config` flag, or the Kubelet REST API. (Note that these are uncommon ways to create pods.)

{% endcapture %}

{% capture whatsnext %}

- See [Configure Containers Using a ConfigMap](/docs/tasks/configure-pod-container/configmap/)
- See [Using ConfigMap Data in Pods](/docs/tasks/configure-pod-container/configure-pod-configmap).
- Follow a real world example of [Configuring Redis using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).

{% endcapture %}

{% include templates/concept.md %}
