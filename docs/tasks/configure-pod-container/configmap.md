---
assignees:
- eparis
- pmorie
title: Configure Containers with a ConfigMap
redirect_from:
- "/docs/user-guide/configmap/index/"
- "/docs/user-guide/configmap/index.html"
---

{% capture overview %}

This page shows you how to configure an application with a ConfigMap.

{% endcapture %}

{% capture prerequisites %}

- {% include task-tutorial-prereqs.md %}
- Read and understand [ConfigMaps](/docs/concepts/concept-configmap)

{% endcapture %}

{% capture steps %}

## Create a ConfigMap with kubectl

You can use the `kubectl create configmap` command to create ConfigMaps from [literal values](#creating-configmaps-from-literal-values), [files](#creating-configmaps-from-files), or [directories](#creating-configmaps-from-directories). The `kubectl` syntax is:

```shell
kubectl create configmap <map-name> <data-source>
```

where \<map-name> is the name you assign the ConfigMap and \<data-source> is the source for the data: a literal value, file, or directory.

The data source corresponds to a key-value pair in the ConfigMap, where:

- the *key* is the file name or the key you provided on the command line; and
- the *value* is the file contents or the literal value you provided on the command line.

You can use [`kubectl describe`](docs/user-guide/kubectl/v1.6/#describe) or [`kubectl get`](docs/user-guide/kubectl/v1.6/#get) to retrieve information about a ConfigMap. The `kubectl describe` command shows a summary of the ConfigMap, while `kubectl get` returns the full contents of the ConfigMap.

### Create ConfigMaps from literal values

You can use `kubectl create configmap` with the `--from-literal` argument to define a literal value from the command line:

```shell
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

You can pass in multiple key-value pairs. Each pair provided at the command line is represented as a separate entry in the `data` section of the ConfigMap.

```shell
kubectl get configmaps special-config -o yaml
```

{% include code.html language="yaml" file="configmap-from-literal.yaml" ghlink="/docs/tasks/configure-pod-container/configmap-from-literal" %}

### Create ConfigMaps from files

With `kubectl create configmap`, you can create a ConfigMap from an individual file or from multiple files.

For example, this command:

```shell
kubectl create configmap game-config-2 --from-file=docs/user-guide/configmap/kubectl/game.properties
```

...produces the following ConfigMap:j

```shell
kubectl describe configmaps game-config-2
Name:           game-config
Namespace:      default
Labels:         <none>
Annotations:    <none>

Data
====
game.properties:        158 bytes
```

Including the  `--from-file` argument multiple times creates a ConfigMap from multiple data sources:

```shell
kubectl create configmap game-config-2 --from-file=docs/user-guide/configmap/kubectl/game.properties --from-file=docs/user-guide/configmap/kubectl/ui.properties

kubectl describe configmaps game-config-2
Name:           game-config
Namespace:      default
Labels:         <none>
Annotations:    <none>

Data
====
game.properties:        158 bytes
ui.properties:          83 bytes
```

#### Define a key to use when creating a ConfigMap from a file

The `--from-file` argument lets you define a key other than the file name for use in the `data` section of your ConfigMap:

```shell
kubectl create configmap game-config-3 --from-file=<my-key-name>=<path-to-file>
```

...where `<my-key-name>` is the key to use in the ConfigMap and `<path-to-file>` is the location of the data source file the key represents.

For example:

```shell
kubectl create configmap game-config-3 --from-file=game-special-key=docs/user-guide/configmap/kubectl/game.properties

kubectl get configmaps game-config-3 -o yaml
```

{% include code.html language="yaml" file="configmap-from-file-with-key.yaml" ghlink="/docs/tasks/configure-pod-container/configmap-from-file-with-key" %}

### Create ConfigMaps from directories

You can use `kubectl create configmap` to create a ConfigMap from multiple files in the same directory.

For example:

```shell
kubectl create configmap game-config --from-file=docs/user-guide/configmap/kubectl
```

...combines the contents of the `docs/user-guide/configmap/kubectl/` directory:

```shell
ls docs/user-guide/configmap/kubectl/
game.properties
ui.properties
```

...into the following ConfigMap:

```shell
kubectl describe configmaps game-config
Name:           game-config
Namespace:      default
Labels:         <none>
Annotations:    <none>

Data
====
game.properties:        158 bytes
ui.properties:          83 bytes
```

The `data` section of the ConfigMap represents the `game.properties` and `ui.properties` files in the directory `docs/user-guide/configmap/kubectl/`.

```shell
kubectl get configmaps game-config-2 -o yaml
```

{% include code.html language="yaml" file="configmap-from-directory.yaml" ghlink="/docs/tasks/configure-pod-container/configmap-from-directory" %}

{% endcapture %}

{% capture whatsnext %}
- See [Using ConfigMap Data in Pods](/docs/tasks/configure-pod-container/configure-pod-configmap).
- Follow a real world example of [Configuring Redis using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).
{% endcapture %}

{% include templates/task.md %}
