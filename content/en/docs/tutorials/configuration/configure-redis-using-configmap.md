---
reviewers:
- eparis
- pmorie
title: Configuring Redis using a ConfigMap
content_type: tutorial
weight: 30
---

<!-- overview -->

After you [configure a Pod to use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/), you can then use a ConfigMap to configure Redis.

## What you'll learn

In this tutorial, you'll learn how to do the following tasks:

* Create a ConfigMap with Redis configuration values
* Create a Redis Pod that mounts and uses the created ConfigMap
* Verify that the configuration was correctly applied.

## Requirements

- Kubernetes cluster
- kubectl command-line tool (`kubectl` 1.14 and above) configured to communicate with your cluster.

  Run the following command to check the kubectl version:

  ```shell
  kubectl version
  ```
  > **_NOTE:_**   It is recommended to run this tutorial on a cluster with at least two nodes that are not acting as control plane hosts.

  {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- lessoncontent -->

## 1. Create a Redis ConfigMap

You could use data stored in a ConfigMap to configure a Redis cache.

1. Run the following command to create a ConfigMap with an empty configuration block:

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

2. Run the following commands to apply the ConfigMap created above, along with a Redis pod manifest:

```shell
kubectl apply -f example-redis-config.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

3. Examine the contents of the Redis pod manifest and note the following:

* A volume named `config` is created by `spec.volumes[1]`
* The `key` and `path` under `spec.volumes[1].configMap.items[0]` exposes the `redis-config` key from the
  `example-redis-config` ConfigMap as a file named `redis.conf` on the `config` volume.
* The `config` volume is then mounted at `/redis-master` by `spec.containers[0].volumeMounts[1]`.

This has the net effect of exposing the data in `data.redis-config` from the `example-redis-config`
ConfigMap above as `/redis-master/redis.conf` inside the Pod.

{{% code_sample file="pods/config/redis-pod.yaml" %}}

4. To confirm the objects were created correctly, run the following command:

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

5. Run the following command to print the `example-redis-config` ConfigMap, to confirm that the `redis-config` key is empty:

```shell
kubectl describe configmap/example-redis-config
```

You should see an empty `redis-config` key:

```shell
Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:
```

6. Run the following command, `kubectl exec` to enter the pod. Use the following option, `redis-cli` to check the current configuration:

```shell
kubectl exec -it redis -- redis-cli
```

7. Run the following command to confirm the value of the `maxmemory` key:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

The `maxmemory` key should have the default value of 0:

```shell
1) "maxmemory"
2) "0"
```

8. Run the following command to confirm the value of the `maxmemory-policy` key:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

The `maxmemory-policy` key should have the default value of `noeviction`:

```shell
1) "maxmemory-policy"
2) "noeviction"
```

## 2. Configure a Redis ConfigMap

After you create a blank Redis ConfigMap, you can use the following command to add configuration values to the `example-redis-config` ConfigMap:

{{% code_sample file="pods/config/example-redis-config.yaml" %}}

1. Run the following command to apply the updated ConfigMap:

```shell
kubectl apply -f example-redis-config.yaml
```

2. To confirm that the ConfigMap was updated, run the following command:

```shell
kubectl describe configmap/example-redis-config
```

You should see the configuration values we just added:

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

3. To confirm the configuration was applied, check the Redis Pod values. Run the following command, `kubectl exec` with the `redis-cli` key.

```shell
kubectl exec -it redis -- redis-cli
```

4. Run the following command to confirm the value of the `maxmemory` key:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

The `maxmemory` key should remain at the default value of 0:

```shell
1) "maxmemory"
2) "0"
```

5. Run the following command to confirm the value of the `maxmemory-policy` key remains at the default value of `noeviction`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

The `maxmemory-policy` key should remain at the default value of `noeviction`:

```shell
1) "maxmemory-policy"
2) "noeviction"
```
The configuration values do not grab updated values from the associated ConfigMaps until you restart the Pod.

6. Run the following command to delete and recreate the Pod:

```shell
kubectl delete pod redis
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

7. Run the following command to recheck the configuration values:

```shell
kubectl exec -it redis -- redis-cli
```

7. Run the following command to confirm the value of the `maxmemory` key:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

The `maxmemory` key should have a value of `2097152`:

```shell
1) "maxmemory"
2) "2097152"
```

8. Run the following command to confirm the value of the `maxmemory-policy` key:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

The `maxmemory-policy`should have the value of `allkeys-lru`:

```shell
1) "maxmemory-policy"
2) "allkeys-lru"
```

## 3. Clean up resources

After you complete this tutorial, you can run the following command delete all resources you've created:

```shell
kubectl delete pod/redis configmap/example-redis-config
```

## {{% heading "whatsnext" %}}


* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Learn how to [update configurations via ConfigMaps](/docs/tutorials/configuration/updating-configuration-via-a-configmap/).
