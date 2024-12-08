---
reviewers:
- eparis
- pmorie
title: Configure Redis using a ConfigMap
content_type: tutorial
weight: 30
---

<!-- overview -->

 ConfigMaps let you inject configuration data into application pods during an application's initialization or during runtime. In this tutorial, you'll use a real world example to learn how to configure and mount a Redis Pod using a ConfigMap. This tutorial builds on the [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) task. 

## What you'll learn

In this tutorial, you'll learn how to do the following tasks:

* Configure Redis using a ConfigMap.
* Add configuration values.
* Verify that the configuration was applied.

## Requirements

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Understand [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).

<!-- lessoncontent -->

## Step 1: Configure Redis using a ConfigMap

To configure Redis using data stored in a ConfigMap:

1. Create a ConfigMap with an empty configuration block:

```shell
cat <<EOF >./example-redis-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-redis-config
data:
  redis-config: ""
EOF
```

1. Apply the ConfigMap created in the previous step, along with a Redis Pod manifest:

```shell
kubectl apply -f example-redis-config.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

1. Examine the contents of the Redis Pod manifest:

  {{% code_sample file="pods/config/redis-pod.yaml" %}}

 Note the following:

* A volume named `config` is created by `spec.volumes[1]`
* The `key` and `path` under `spec.volumes[1].configMap.items[0]` exposes the `redis-config` key from the 
  `example-redis-config` ConfigMap as a file named `redis.conf` on the `config` volume.
* The `config` volume is then mounted at `/redis-master` by `spec.containers[0].volumeMounts[1]`.

This has the net effect of exposing the data in `data.redis-config` from the `example-redis-config`
ConfigMap as `/redis-master/redis.conf` inside the Pod.

1. Get the created objects:

  ```shell
  kubectl get pod/redis configmap/example-redis-config 
  ```

Returns:

  ```
  NAME        READY   STATUS    RESTARTS   AGE
  pod/redis   1/1     Running   0          8s

  NAME                             DATA   AGE
  configmap/example-redis-config   1      14s
  ```

1. Verify that the `redis-config` key is blank in the `example-redis-config` ConfigMap:

  ```shell
  kubectl describe configmap/example-redis-config
  ```

  Returns:

  ```shell
  Name:         example-redis-config
  Namespace:    default
  Labels:       <none>
  Annotations:  <none>

  Data
  ====
  redis-config:
  ```

1. Use `kubectl exec` to enter the Pod and run the `redis-cli` tool to check the current configuration:

  ```shell
  kubectl exec -it redis -- redis-cli
  ```

1. Check `maxmemory`:

  ```shell
  127.0.0.1:6379> CONFIG GET maxmemory
  ```

  It returns the default value of 0:

  ```shell
  1) "maxmemory"
  2) "0"
  ```

1. Check `maxmemory-policy`:

  ```shell
  127.0.0.1:6379> CONFIG GET maxmemory-policy
  ```

  It returns the default value of `noeviction`:

  ```shell
  1) "maxmemory-policy"
  2) "noeviction"
  ```

## Step 2: Add configuation values

To add and apply some configuration changes:

1. Add some configuration values to the `example-redis-config` ConfigMap:

  {{% code_sample file="pods/config/example-redis-config.yaml" %}}

1. Apply the updated ConfigMap:

  ```shell
  kubectl apply -f example-redis-config.yaml
  ```

1. Confirm that the ConfigMap was updated:

  ```shell
  kubectl describe configmap/example-redis-config
  ```

  It returns the configuration values that you just added:

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
  ```

## Step 3: Verify the configuration was applied

To verify that your configuration values were applied:

1. Check the Redis Pod again using `redis-cli` via `kubectl exec`:

  ```shell
  kubectl exec -it redis -- redis-cli
  ```

1. Check `maxmemory`:

  ```shell
  127.0.0.1:6379> CONFIG GET maxmemory
  ```

  It remains at the default value of 0:

  ```shell
  1) "maxmemory"
  2) "0"
  ```

1. Check `maxmemory-policy`:

  ```shell
  127.0.0.1:6379> CONFIG GET maxmemory-policy
  ```

  It remains at the `noeviction` default setting:

  ```shell
  1) "maxmemory-policy"
  2) "noeviction"
  ```

The configuration values haven't changed because the Pod needs to be restarted to get the updated values from the associated ConfigMap.

1. Delete and recreate the Pod to apply the updated configuration values:

  ```shell
  kubectl delete pod redis
  kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
  ```

1. Check the configuration values:

  ```shell
  kubectl exec -it redis -- redis-cli
  ```

1. Check `maxmemory`:

  ```shell
  127.0.0.1:6379> CONFIG GET maxmemory
  ```

  It returns the updated value of 2097152:

  ```shell
  1) "maxmemory"
  2) "2097152"
  ```

1. Check `maxmemory-policy`:

  ```shell
  127.0.0.1:6379> CONFIG GET maxmemory-policy
  ```

  It returns the updated value of `allkeys-lru`:

  ```shell
  1) "maxmemory-policy"
  2) "allkeys-lru"
  ```

1. Clean up your work by deleting the created resources:

  ```shell
  kubectl delete pod/redis configmap/example-redis-config
  ```

## {{% heading "whatsnext" %}}


* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Follow an example of [Updating configuration via a ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/).
