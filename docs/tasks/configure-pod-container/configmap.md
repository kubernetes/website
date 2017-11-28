---
approvers:
- eparis
- pmorie
title: Configure Containers Using a ConfigMap
---


{% capture overview %}

This page shows you how to configure an application using a ConfigMap. ConfigMaps allow you to decouple configuration artifacts from image content to keep containerized applications portable.

{% endcapture %}

{% capture prerequisites %}

* {% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

## Use kubectl to create a ConfigMap

Use the `kubectl create configmap` command to create configmaps from [directories](#create-configmaps-from-directories), [files](#create-configmaps-from-files), or [literal values](#create-configmaps-from-literal-values):

```shell
kubectl create configmap <map-name> <data-source>
```

where \<map-name> is the name you want to assign to the ConfigMap and \<data-source> is the directory, file, or literal value to draw the data from.

The data source corresponds to a key-value pair in the ConfigMap, where

* key = the file name or the key you provided on the command line, and
* value = the file contents or the literal value you provided on the command line.

You can use [`kubectl describe`](/docs/user-guide/kubectl/{{page.version}}/#describe) or
[`kubectl get`](/docs/user-guide/kubectl/{{page.version}}/#get) to retrieve information
about a ConfigMap.

### Create ConfigMaps from directories

You can use `kubectl create configmap` to create a ConfigMap from multiple files in the same directory.

For example:

```shell
kubectl create configmap game-config --from-file=docs/user-guide/configmap/kubectl
```

combines the contents of the `docs/user-guide/configmap/kubectl/` directory

```shell
ls docs/user-guide/configmap/kubectl/
game.properties
ui.properties
```

into the following ConfigMap:

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

The `game.properties` and `ui.properties` files in the `docs/user-guide/configmap/kubectl/` directory are represented in the `data` section of the ConfigMap.

```shell
kubectl get configmaps game-config -o yaml
```

```yaml
apiVersion: v1
data:
  game.properties: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
  ui.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
    how.nice.to.look=fairlyNice
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T18:52:05Z
  name: game-config
  namespace: default
  resourceVersion: "516"
  selfLink: /api/v1/namespaces/default/configmaps/game-config-2
  uid: b4952dc3-d670-11e5-8cd0-68f728db1985
```

### Create ConfigMaps from files

You can use `kubectl create configmap` to create a ConfigMap from an individual file, or from multiple files.

For example,

```shell
kubectl create configmap game-config-2 --from-file=docs/user-guide/configmap/kubectl/game.properties
```

would produce the following ConfigMap:

```shell
kubectl describe configmaps game-config-2
Name:           game-config-2
Namespace:      default
Labels:         <none>
Annotations:    <none>

Data
====
game.properties:        158 bytes
```

You can pass in the  `--from-file` argument multiple times to create a ConfigMap from multiple data sources.

```shell
kubectl create configmap game-config-2 --from-file=docs/user-guide/configmap/kubectl/game.properties --from-file=docs/user-guide/configmap/kubectl/ui.properties
```

```shell
kubectl describe configmaps game-config-2
Name:           game-config-2
Namespace:      default
Labels:         <none>
Annotations:    <none>

Data
====
game.properties:        158 bytes
ui.properties:          83 bytes
```

#### Define the key to use when creating a ConfigMap from a file

You can define a key other than the file name to use in the `data` section of your ConfigMap when using the `--from-file` argument:

```shell
kubectl create configmap game-config-3 --from-file=<my-key-name>=<path-to-file>
```

where `<my-key-name>` is the key you want to use in the ConfigMap and `<path-to-file>` is the location of the data source file you want the key to represent.

For example:

```shell
kubectl create configmap game-config-3 --from-file=game-special-key=docs/user-guide/configmap/kubectl/game.properties

kubectl get configmaps game-config-3 -o yaml
```

```yaml
apiVersion: v1
data:
  game-special-key: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T18:54:22Z
  name: game-config-3
  namespace: default
  resourceVersion: "530"
  selfLink: /api/v1/namespaces/default/configmaps/game-config-3
  uid: 05f8da22-d671-11e5-8cd0-68f728db1985
```

### Create ConfigMaps from literal values

You can use `kubectl create configmap` with the `--from-literal` argument to define a literal value from the command line:

```shell
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

You can pass in multiple key-value pairs. Each pair provided on the command line is represented as a separate entry in the `data` section of the ConfigMap.

```shell
kubectl get configmaps special-config -o yaml
```

```yaml
apiVersion: v1
data:
  special.how: very
  special.type: charm
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: special-config
  namespace: default
  resourceVersion: "651"
  selfLink: /api/v1/namespaces/default/configmaps/special-config
  uid: dadce046-d673-11e5-8cd0-68f728db1985
```

{% endcapture %}

{% capture discussion %}

## Understanding ConfigMaps

ConfigMaps allow you to decouple configuration artifacts from image content to keep containerized applications portable.
The ConfigMap API resource stores configuration data as key-value pairs. The data can be consumed in pods or provide the configurations for system components such as controllers. ConfigMap is similar to [Secrets](/docs/concepts/configuration/secret/), but provides a means of working with strings that don't contain sensitive information. Users and system components alike can store configuration data in ConfigMap.

**Note:** ConfigMaps should reference properties files, not replace them. Think of the ConfigMap as representing something similar to the Linux `/etc` directory and its contents. For example, if you create a [Kubernetes Volume](/docs/concepts/storage/volumes/) from a ConfigMap, each data item in the ConfigMap is represented by an individual file in the volume.
{: .note}

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

{% endcapture %}

{% capture whatsnext %}
* See [Using ConfigMap Data in Pods](/docs/tasks/configure-pod-container/configure-pod-configmap).
* Follow a real world example of [Configuring Redis using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).
{% endcapture %}

{% include templates/task.md %}
