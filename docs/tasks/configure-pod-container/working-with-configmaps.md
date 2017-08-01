---
title: Working with ConfigMaps
redirect_from:
  - "/docs/tasks/configure-pod-container/configmap/"
  - "/docs/tasks/configure-pod-container/configure-pod-configmap/"
  - "/docs/user-guide/configmap/index/"
  - "/docs/user-guide/configmap/index.html"
---

{% capture overview %}

A `ConfigMap` lets you separate configuration data for a container image from the container image itself. Decoupling configuration data from image content keeps your containerized applications portable.

For more information about ConfigMaps, see "[Understanding ConfigMaps](/docs/concepts/configuration/understanding-configmaps)".

{% endcapture %}

{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

{% endcapture %}

{% capture steps %}

## Creating a ConfigMap

The `kubectl` command lets you create ConfigMaps from literal values, files, or directories with the following syntax:

```shell
kubectl create configmap <map-name> <data-source>
```

A `<map-name>` is a name you assign to the ConfigMap. A `<data-source>` can be:
- a literal value (including multiple values)
- a file or files
- a directory

The data source corresponds to a key-value pair in the ConfigMap, where:

- the *key* is the file name or the key you provided on the command line; and
- the *value* is the file contents or the literal value you provided on the command line.

### Getting information about a ConfigMap

The [`kubectl describe`](docs/user-guide/kubectl/v1.6/#describe) and [`kubectl get`](docs/user-guide/kubectl/v1.6/#get) commands retrieve information about a ConfigMap.

The `kubectl describe` command shows a summary of the ConfigMap, while `kubectl get` returns the full contents of the ConfigMap.

For more information, see [kubectl reference]().

## Configuring containers



## Configuring pods

{% endcapture %}

{% capture whatsnext %}
* See [Using ConfigMap Data in Pods](/docs/tasks/configure-pod-container/configure-pod-configmap).
* Follow a real world example of [Configuring Redis using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).
{% endcapture %}

{% include templates/task.md %}
