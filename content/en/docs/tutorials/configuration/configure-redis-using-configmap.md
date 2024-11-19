---
reviewers:
- eparis
- pmorie
title: Configure a Redis Pod using a ConfigMap
content_type: tutorial
weight: 30
---

<!-- overview -->
<!-- Add a light intro to ConfigMaps and some links. -->
<!-- Goal: Add additional context. -->
<!-- This may be the first page a user lands on. -->
[ConfigMaps](/docs/concepts/configuration/configmap/) let you inject
environment-specific configuration data into a
[Pod](https://kubernetes.io/docs/concepts/workloads/pods/).

In this tutorial, you'll configure a Redis Pod using a ConfigMap. The tutorial
is a real-world example of how to [Configure a Pod to Use a
ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).



## What you'll learn

In this tutorial, you'll learn how to:

* Create a ConfigMap with configuration values.
* Create a Redis Pod that uses a ConfigMap.
* Verify a ConfigMap was correctly applied.



## Requirements


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- I generally try to avoid linking to anchors, but this seemed
like the best fit. -->
* You're using [`kubectl`](/docs/tasks/tools/#kubectl) 1.14 or above.


<!-- lessoncontent -->

<!-- I restructured these sections to better mirror the learning objectives. -->
<!-- Loosely based on https://shopify.dev/docs/apps/build/scaffold-app -->
## Step 1: Create and apply a ConfigMap

You can use `kubectl` to create a ConfigMap and apply it to a cluster:

<!-- I switched this for a kubectl command, but it still think this is a bit weird. -->
<!-- How would a user typically create this file in production? -->
1. Create a ConfigMap with an empty configuration:

    ```shell
    kubectl create configmap example-redis-config \
      --from-literal=redis-config="" \
      --dry-run=client \
      --output=yaml > example-redis-config.yaml
    ```

2. Apply the ConfigMap and an example Redis Pod manifest to your cluster:

    ```shell
    kubectl apply -f example-redis-config.yaml
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
    ```

    <!-- I removed the embedded YAML file as I didn't think it added much. -->
    The Pod manifest:

    * Creates and runs a Redis Pod.
    * Creates a `config` volume from the `redis-config` key in the
      `example-redis-config` ConfigMap.
    * Mounts the `config` volume at `/redis-master`. The
      volume makes `redis-config` available as a file at
      `/redis-master/redis.conf`.

## Step 2: Verify the ConfigMap and Pod

Next, verify the ConfigMap's configuration was applied to the Redis Pod's
settings:

1. Verify the Redis Pod is running and the ConfigMap is mounted:

    ```shell
    kubectl get pod redis
    kubectl get configmap example-redis-config
    ```

    Output:

    ```
    NAME        READY   STATUS    RESTARTS   AGE
    pod/redis   1/1     Running   0          8s

    NAME                             DATA   AGE
    example-redis-config             1      14s
    ```

2. Confirm the `redis-config` key is empty:

    ```shell
    kubectl describe configmap/example-redis-config
    ```

    The `redis-config` key has no value:

    ```shell
    Name:         example-redis-config
    Namespace:    default
    Labels:       <none>
    Annotations:  <none>

    Data
    ====
    redis-config:
    ----



    BinaryData
    ====

    Events:  <none>
    ```

<!-- TODO: Double-check that "Enter the Pod" is okay language here.  -->
3. Confirm the Redis Pod is using default settings. Use `kubectl exec`  to enter
   the Pod, and run `redis-cli` to check the configuration:

    ```shell
    kubectl exec -it redis -- redis-cli
    ```

4. In the Pod, check `maxmemory`:

    ```shell
    127.0.0.1:6379> CONFIG GET maxmemory
    ```

    `maxmemory` is set to `0`, the default:

    ```shell
    1) "maxmemory"
    2) "0"
    ```

5. Check `maxmemory-policy`:

    ```shell
    127.0.0.1:6379> CONFIG GET maxmemory-policy
    ```

    `maxmemory-policy` uses the default `noeviction` policy:

    ```shell
    1) "maxmemory-policy"
    2) "noeviction"
    ```
<!-- TODO: Verify whether this is an OS-specific thing. -->
6. Press Ctrl + C to exit the Pod.

## Step 3: Update the ConfigMap

Edit the ConfigMap to include Redis-specific settings and
update the ConfigMap.

1. In a text editor, update `example-redis-config.yaml` with the following:

    {{% code_sample file="pods/config/example-redis-config.yaml" %}}

2. Apply the updated ConfigMap:

    ```shell
    kubectl apply -f example-redis-config.yaml
    ```

3. Confirm the ConfigMap was updated:

    ```shell
    kubectl describe configmap/example-redis-config
    ```

    `redis-config` should now contain the settings from the updated ConfigMap:

    ```shell
    Name:         example-redis-config
    Namespace:    default
    Labels:       <none>
    Annotations:  <none>

    Data
    ====
    redis-config:
    ----
    maxmemory 2mb
    maxmemory-policy allkeys-lru



    BinaryData
    ====

    Events:  <none>
    ```

## Step 4: Restart and apply changes

To apply the updated ConfigMap, restart the Redis Pod.

1. Delete and recreate the Pod:

    ```shell
    kubectl delete pod redis
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
    ```

2. Enter the Pod to check its configuration using the `redis-cli`:

    ```shell
    kubectl exec -it redis -- redis-cli
    ```

3. In the Pod, check `maxmemory`:

    ```shell
    127.0.0.1:6379> CONFIG GET maxmemory
    ```

    The setting now uses the updated `maxmemory` value from the ConfigMap:

    ```shell
    1) "maxmemory"
    2) "2097152"
    ```

4.  Check `maxmemory-policy`:

    ```shell
    127.0.0.1:6379> CONFIG GET maxmemory-policy
    ```

    The setting now uses the `maxmemory-policy` value from the ConfigMap:

    ```shell
    1) "maxmemory-policy"
    2) "allkeys-lru"
    ```

5. Press Ctrl + C to exit the Pod.

## Step 5: Clean up

When you're done, delete the Redis Pod and ConfigMap to clean up
the cluster:

```shell
kubectl delete pod redis
kubectl delete configmap example-redis-config
```

## Next steps

<!-- These next steps seem to link to basic info. -->
<!-- Are there more advanced tutorials or concepts we can point users toward? -->
<!-- The first link is a former requirement for this tutorial. -->
* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Follow an example of [Updating configuration via a ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/).
