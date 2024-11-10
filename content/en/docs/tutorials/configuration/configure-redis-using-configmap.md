---
reviewers:
- eparis
- pmorie
title: Configuring Redis using a ConfigMap
content_type: tutorial
weight: 30
---

[Redis](https://redis.io/) is a popular in-memory data store. Pairing Redis with Kubernetes can provide scalability, high availability, and increased efficiency when handling rapid data operations in containerized environments.

This guide shows how to configure a Redis Pod for Kubernetes using a [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).

## What you'll learn
In this tutorial, you'll learn how to do the following tasks:

* Create a ConfigMap with Redis configuration values.
* Create a Redis Pod that mounts and uses the created ConfigMap.
* Verify that the configuration was correctly applied.
* Update configuration values.

## Requirements

- You have a Kubernetes cluster running version 1.14 or above. To check your version, run `kubectl version`.
- You've configured the kubectl command-line tool to communicate with your cluster.
- You understand the basics of how to [Configure a Pod to use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).

	**Tip:** For this tutorial, it's recommended that you use a cluster with at least two nodes that aren't acting as control plane hosts. If you don't have a cluster, you can create one by using [minikube](https://minikube.sigs.k8s.io/docs/tutorials/multi_node/), or you can use one of these Kubernetes playgrounds:
	
	- [Killercoda](https://killercoda.com/playgrounds/scenario/kubernetes)
	- [Play with Kubernetes](https://labs.play-with-k8s.com/)

## Step 1: Create a ConfigMap

First use `cat` to create a ConfigMap with an empty configuration block:

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

## Step 2: Apply the ConfigMap and Redis Pod Manifest

Apply the ConfigMap you just created, along with this example [Redis Pod manifest](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml):

```shell
kubectl apply -f example-redis-config.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

### Understanding the Pod manifest

Take a look at the contents of the Redis Pod manifest we just applied:

{{% code_sample file="pods/config/redis-pod.yaml" %}}

Note the following:

* A volume named `config` is created by `spec.volumes[1]`
* The `key` and `path` under `spec.volumes[1].configMap.items[0]` expose the `redis-config` key from the 
  `example-redis-config` ConfigMap as a file named `redis.conf` on the `config` volume.
* The `config` volume is then mounted at `/redis-master` by `spec.containers[0].volumeMounts[1]`.

This exposes the data in `data.redis-config` from the `example-redis-config`
ConfigMap above as `/redis-master/redis.conf` inside the Pod.

### Examining the objects

Use `kubecetl get` to examine the objects you just created:

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

Use `kubectl describe` to examine the ConfigMap:

```shell
kubectl describe configmap/example-redis-config
```

Remember that we left the `redis-config` key in the `example-redis-config` ConfigMap blank, so the output should also show an empty `redis-config` key:

```shell
Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:
```

## Step 3: Check the Pod configuration

Use `kubectl exec` to enter the pod and run the `redis-cli` tool to check the current configuration:

```shell
kubectl exec -it redis -- redis-cli
```

Use `CONFIG GET` to check `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

It should return the default value, `0`:

```shell
1) "maxmemory"
2) "0"
```

Now check `maxmemory-policy`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

This should also return the default value, `noeviction`:

```shell
1) "maxmemory-policy"
2) "noeviction"
```

Run the `exit` command to exit the pod.

## Step 4: Update the ConfigMap

Now let's add some configuration values to the ConfigMap. Open the `example-redis-config.yaml` file in your editor of choice and update it so that it matches the ConfigMap below:

{{% code_sample file="pods/config/example-redis-config.yaml" %}}

## Step 5: Apply the updated ConfigMap

Run `kubectl apply` to apply the updated ConfigMap:

```shell
kubectl apply -f example-redis-config.yaml
```

Run `kubectl describe` to confirm that the ConfigMap was updated:

```shell
kubectl describe configmap/example-redis-config
```

You should see the configuration values you just added:

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

## Step 6: Restart the Pod

You've updated and applied the new ConfigMap, but if you checked the Pod configuration now you would see the same results as in Step 3. You need to restart the Pod so it can grab the updated values from the ConfigMap.

Run the following commands to delete and recreate the Pod:

```shell
kubectl delete pod redis
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

## Step 7: Verify the updated configuration

Next you'll repeat the procedure from Step 3 to verify that the configuration has been properly updated.

Run `kubectl exec` to enter the pod:

```shell
kubectl exec -it redis -- redis-cli
```

Check `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

It should now return the updated value `2097152`:

```shell
1) "maxmemory"
2) "2097152"
```

Check `maxmemory-policy` to make sure it's been updated as well:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

It should return the updated value `allkeys-lru`:

```shell
1) "maxmemory-policy"
2) "allkeys-lru"
```

Run the `exit` command to exit the pod.

## Step 8: Clean up

Clean up your work by deleting the resources you created:

```shell
kubectl delete pod/redis configmap/example-redis-config
```

## Next steps

* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Learn how to [Update configuration via a ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/).
