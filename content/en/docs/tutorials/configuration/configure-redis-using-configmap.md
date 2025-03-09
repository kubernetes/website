---
reviewers:
- eparis
- pmorie
title: Configuring Redis Memory using a ConfigMap
content_type: tutorial
weight: 30
---

<!-- overview -->

This page provides a real-world example of how to configure Redis and its memory requirements, using a ConfigMap. It builds upon the [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) task. 



## {{% heading "objectives" %}}


* Set Redis configuration values by creating a ConfigMap.
* Create a Redis Pod that mounts and uses the created ConfigMap.
* Adjust `maxmemory` and `maxmemory-policy` values to support the Redis cache.
* Verify that the Pod correctly applies the configuration.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* The example shown on this page works with `kubectl` 1.14 and above.
* Understand the configuration injection model in [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).

<!-- lessoncontent -->


## Real-world example: Configuring Redis memory requirements using a ConfigMap {#overview}

<!-- Query: ^ Could we eliminate this redundant h2? This would allow us to promote all the h3's to h2's, making them visible in the right nav. -->

Follow the steps below to configure memory for a Redis cache, using data stored in a ConfigMap.

### Create a ConfigMap shell {#create}

First, create a ConfigMap with an empty configuration block:

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

### Apply the empty ConfigMap and examine the manifest {#manifest}

Apply the ConfigMap created above, along with a Redis Pod manifest:

```shell
kubectl apply -f example-redis-config.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

Examine the Redis Pod manifest below, and note the following:

* A volume named `config` is created by `spec.volumes[1]`.
* The `key` and `path` under `spec.volumes[1].configMap.items[0]` expose the `redis-config` key from the 
  `example-redis-config` ConfigMap, with the path value set to a file named `redis.conf` on the `config` volume.
* The `config` volume is then mounted at `/redis-master` by `spec.containers[0].volumeMounts[1]`.

<!-- Query: ^ I'd like to avoid the passive voice above, and the indexes aren't visible in the displayed manifest. Can we omit them, and instead just say "at <element-name>"?? -->

Inside the Pod, this exposes the `data.redis-config` data (from the `example-redis-config`
ConfigMap above) as `/redis-master/redis.conf`.

{{% code_sample file="pods/config/redis-pod.yaml" %}}

### Verify the created objects {#objects}

Examine the created objects with this command:

```shell
kubectl get pod/redis configmap/example-redis-config 
```

You should see the following output:

```
NAME        READY   STATUS    RESTARTS   AGE
pod/redis   1/1     Running   0          8s

NAME                             DATA   AGE
configmap/example-redis-config   1      14s
```

Recall that in the `example-redis-config` ConfigMap, the `redis-config` key was blank. You can verify this with this command:

```shell
kubectl describe configmap/example-redis-config
```

You should see an empty `redis-config` key, which you will populate later:

```shell
Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:
```

### Verify the Pod's configuration {#pod-baseline}

Before adding config keys, verify the Pod's baseline configuration. Use `kubectl exec` to enter the Pod, and run the `redis-cli` tool in the same command:

```shell
kubectl exec -it redis -- redis-cli
```

Check `maxmemory` with this command:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

It should show the default value of `0`:

```shell
1) "maxmemory"
2) "0"
```

Also check `maxmemory-policy`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

This should similarly its default value of `noeviction`:

```shell
1) "maxmemory-policy"
2) "noeviction"
```

The next step is to change both values to support the Redis cache.

### Reconfigure memory {#config-memory}

Next, add these configuration values to the `example-redis-config` ConfigMap:

{{% code_sample file="pods/config/example-redis-config.yaml" %}}

Setting `maxmemory` to `2mb` gives the cache a reasonable upper memory limit. Setting `maxmemory-policy` to `allkeys-lru` enables loading new keys when the memory limit is reached, by removing least-recently-used (lru) keys.

### Reapply and verify the ConfigMap {#reapply}

Apply the updated ConfigMap with this command:

```shell
kubectl apply -f example-redis-config.yaml
```

Next, confirm that the ConfigMap was updated:

```shell
kubectl describe configmap/example-redis-config
```

You should see the configuration values you  just added:

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

### Re-check the Pod's configuration (this won't work) {#pod-re-check}

Check the Redis Pod again, using `kubectl exec` with `redis-cli`, to see if the configuration was applied:

```shell
kubectl exec -it redis -- redis-cli
```

Check `maxmemory` with this command:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

It remains at the default value of `0`:

```shell
1) "maxmemory"
2) "0"
```

Similarly, verify that `maxmemory-policy` remains at its `noeviction` default setting:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

This should return:

```shell
1) "maxmemory-policy"
2) "noeviction"
```

Why didn't these configuration values change? The Pod needs to be restarted to grab updated
values from associated ConfigMaps. 

### Restart the Pod {#pod-restart}

Delete and re-create the Pod, using these commands:

```shell
kubectl delete pod redis
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

Now re-check the configuration values one last time:

```shell
kubectl exec -it redis -- redis-cli
```

Check `maxmemory` with this command:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

It should now return the updated value of `2097152` bytes:

```shell
1) "maxmemory"
2) "2097152"
```

Similarly, use this command to verify that `maxmemory-policy` has also been updated:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

It should now reflect the desired value of `allkeys-lru`:

```shell
1) "maxmemory-policy"
2) "allkeys-lru"
```

### Wrap up {#wrap-up}

In this tutorial, you created a basic ConfigMap, applied it to a Redis Pod, and verified the Pod's initial configuration. Next, you updated the ConfigMap with realistic `maxmemory` and `maxmemory-policy` values to support the Redis cache, reapplied the ConfigMap, and restarted the Pod to verify that your configuration took effect.

Now, you can clean up your work by deleting the created resources:

```shell
kubectl delete pod/redis configmap/example-redis-config
```

## {{% heading "whatsnext" %}}


* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Follow an example of [Updating Configuration via a ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/).
