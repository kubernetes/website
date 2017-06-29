---
title: Configure Pods Using ConfigMap Data
---

{% capture overview %}

This page demonstrates how to configure Pods using data stored in ConfigMaps.

{% endcapture %}

{% capture prerequisites %}
- {% include task-tutorial-prereqs.md %}
- Read and understand [Configure Containers Using a ConfigMap](/docs/tasks/configure-pod-container/configmap/)
{% endcapture %}

{% capture steps %}

## Define Pod environment variables using ConfigMap data

### Define a Pod environment variable using a single ConfigMap

1. Define an environment variable as a key-value pair in a ConfigMap:

   ```shell
   kubectl create configmap special-config --from-literal=special.how=very
   ```

1. Assign the `special.how` value defined in the ConfigMap to the `SPECIAL_LEVEL_KEY` environment variable in the Pod specification.  

    ```shell
    kubectl edit pod dapi-test-pod
    ```

{% include code.html language="yaml" file="pod-single-configmap.yaml" ghlink="/docs/tasks/configure-pod-container/pod-single-configmap" %}

1. Save the changes to the Pod specification.

    The Pod's output now includes `SPECIAL_LEVEL_KEY=very`.

### Define Pod environment variables using multiple ConfigMaps

1. Create multiple ConfigMaps.

    These commands:

    ```shell
    kubectl create configmap special-config --from-literal=special.how=very

    kubectl create configmap env-config --from-literal=log_level=INFO
    ```

    ...create these YAML files:

    {% include code.html language="yaml" file="pod-multiple-special-config.yaml" ghlink="/docs/tasks/configure-pod-container/pod-multiple-special-config" %}

    {% include code.html language="yaml" file="pod-multiple-env-config.yaml" ghlink="/docs/tasks/configure-pod-container/pod-multiple-env-config" %}

1. Define environment variables in the Pod specification.   

    {% include code.html language="yaml" file="pod-multiple-define.yaml" ghlink="/docs/tasks/configure-pod-container/pod-multiple-define" %}

1. Save the changes to the Pod specification.

  The Pod's output now includes `SPECIAL_LEVEL_KEY=very` and `LOG_LEVEL=info`.

## Configure all key-value pairs in a ConfigMap as Pod environment variables

**Note:** This functionality is only available with Kubernetes v1.6 and later.

Including `env-from` as an attribute in a ConfigMap lets you define the ConfigMap's data as Pod environment variables.

1. Create a ConfigMap containing multiple key-value pairs.

    ```shell
    kubectl create configmap special-config --from-literal=special_level=very --from-literal=special_type=charm
    ```

1. Add `env-from` to define all of the ConfigMap's data as Pod environment variables.

  The Pod uses the key from the ConfigMap as the environment variable name.

  {% include code.html language="yaml" file="pod-multiple-env-variables.yaml" ghlink="/docs/tasks/configure-pod-container/pod-multiple-env-variables" %}

1. Save the changes to the Pod specification.

  The Pod's output now includes `SPECIAL_LEVEL=very` and `SPECIAL_TYPE=charm`.

## Use ConfigMap-defined environment variables in Pod commands  

You can use ConfigMap-defined environment variables in the `command` section of the Pod specification using the `$(VAR_NAME)` Kubernetes substitution syntax.

For example, the following Pod specification:

{% include code.html language="yaml" file="pod-multiple-sub.yaml" ghlink="/docs/tasks/configure-pod-container/pod-multiple-sub" %}

...produces the following output in the `test-container` container:

```shell
very charm
```

## Add ConfigMap data to a Volume

When you [create a ConfigMap using `--from-file`](/docs/tasks/configure-pod-container/configmap/#create-configmaps-from-files), the filename becomes a key stored in the `data` section of the ConfigMap. The file contents become the key's value.

The examples in this section refer to a ConfigMap named `special-config`:

{% include code.html language="yaml" file="pod-volume-special-config.yaml" ghlink="/docs/tasks/configure-pod-container/pod-volume-special-config" %}

### Populate a Volume with data stored in a ConfigMap

1. Add the ConfigMap name under the `volumes` section of the Pod specification.

  This adds the ConfigMap data to the directory specified by the `volumeMounts.mountPath` attribute. In the following example, the specified directory is `/etc/config`.

  The `command` section references the `special.level` attribute in the ConfigMap.

  {% include code.html language="yaml" file="pod-volume-populate.yaml" ghlink="/docs/tasks/configure-pod-container/pod-volume-populate" %}

When the pod runs, the command `ls /etc/config/` produces the following output:

```shell
special.level
special.type
```

### Add ConfigMap data to a specific path in the Volume:

You can specify a file path for specific ConfigMap items using the `path` field.

In this example, the `special.level` item is mounted in the volume `config-volume` at `/etc/config/keys`.

{% include code.html language="yaml" file="pod-volume-path.yaml" ghlink="/docs/tasks/configure-pod-container/pod-volume-path" %}

When the pod runs, the command `cat /etc/config/keys` produces the following output:

```shell
very
```

### Project keys to specific paths and file permissions

You can project keys to specific paths and specific permissions on a per-file
basis. The [Secrets](/docs/concepts/configuration/secret#using-secrets-as-files-from-a-pod) user guide explains the syntax.

{% endcapture %}

{% capture whatsnext %}
- Learn more about [ConfigMaps](/docs/concepts/concept-configmap)
- See [Configure Containers with a ConfigMap](/docs/tasks/configure-pod-container/configmap/)
- Follow a real world example of [Configuring Redis using a ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/)

{% endcapture %}

{% include templates/task.md %}
