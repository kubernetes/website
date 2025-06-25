---
reviewers:
- eparis
- pmorie
title: Configuring Redis using a ConfigMap
content_type: tutorial
weight: 30
---

<!-- overview -->

As a developer responsible for configuring Kubernetes clusters, your service might require a cache such as {{< glossary_tooltip text="Redis" term_id="redis" >}} for efficiency. 

This page provides a real world example of how to create a Redis Pod that mounts using a {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}. This topic builds upon the [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) task document, so if you haven't reviewed that content or worked through the examples we recommend you complete that before continuing.


## {{% heading "objectives" %}}


* Create a ConfigMap with Redis configuration values.
* Create a Redis Pod and associate the ConfigMap to it.
* Verify that the configuration values are correctly applied.
* Update the configuration values in ConfigMap, apply them, and verify that they've been updated in the Redis Pod.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* `kubectl` version 1.14 or greater.
* Knowledge of how to use [kubectl](/docs/reference/kubectl) to issue commands to your working Kubernetes cluster.
* Knowledge of [ConfigMaps](docs/concepts/configuration/configmap/).
* Knowledge of how to [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).



<!-- lessoncontent -->


## Real World Example: Configuring Redis using a ConfigMap

Follow the steps below to configure a Redis cache using data stored in a ConfigMap.

1. Create a ConfigMap with an empty configuration block. We'll populate the empty configuration in later steps.

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

In this ConfigMap, the `metadata` property includes a value for the `name` for the ConfigMap. Here we've set the value to `example-redis-config`. In later steps when we configure the volumes for each Pod, we'll refer to this value. The `data` section defines name-value pairs, and here we've set a name to `redis-config` and its value to an empty string. At this point we're not concerned with this value, but in later steps we'll provide the path to the configuration file in the `redis-server` image.

2. Apply the ConfigMap you created in step 1 to the one or more Pods in your working Kubernetes cluster using `kubectl`.

```shell
kubectl apply -f example-redis-config.yaml
```

The expected response from `kubectl` is:

```shell
configmap/example-redis-config created
```

3. Apply the Redis Pod manifest we've provided.

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

The expected response from `kubectl` is:

```shell
pod/redis created
```

Let's take a closer look at the Redis Pod manifest we've provided.

{{% code_sample file="pods/config/redis-pod.yaml" %}}

The `spec` section schema includes a `volumes` array in which we can specify one or more {{< glossary_tooltip text="volumes" term_id="volume" >}}. We've defined two volumes: one named `data` and another named `config`. 

The `config` volume includes a `configMap` section that includes references to the ConfigMap you created in step 1. The `name` property is set to `example-redis-config`, which is the same `name` of our ConfigMap. The `items` array defines a single key-value pair. The key, `redis-config` references the key we defined in the `data` section of our ConfigMap. The `path` value specifies that when the Pod is created, a file named `redis.conf` is to be created using the contents of the ConfigMap.

Note the `command` array in the `containers` section. Notice that we've specified that the `redis-server` command take the path `/redis-master/redis.conf` as an argument when starting. Because we've associated our ConfigMap with this file and it contains our configuration data, it can be read by `redis-server`.

Let's use `kubectl` to verify that we've done everything correctly.

First, let's check that our Pod has been created.

```shell
  kubectl get pod/redis configmap/example-redis-config 
```

The expected response from `kubectl` is:

```shell
NAME        READY   STATUS    RESTARTS   AGE
pod/redis   1/1     Running   0          8s

NAME                             DATA   AGE
configmap/example-redis-config   1      14s
```

Recall that we set the value of the `redis-config` key in the ConfigMap blank an empty string. Let's confirm that there's no data associated with it in the Pod.

```shell
kubectl describe configmap/example-redis-config
```

The expected response from `kubectl` is:

```shell
Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:


BinaryData
====

Events:  <none>
```

Note the `Data` section and our `redis-config` with no associated value.

4. Check the `maxmemory` and `maxmemory-policy` configuration settings in the Redis Pod in preparation for update.

To determine which configuration values we can change, let's use `kubectl exec` to enter the pod and run the `redis-cli` tool to check the current configuration.

```shell
kubectl exec -it redis -- redis-cli
```

The expected response from `kubectl` is a command prompt with the IP address and port of our Pod:

```shell
127.0.0.1:6379>
```

Let's execute the `CONFIG` command in our pod to check the configuration property `maxmemory`. Note that if you're copying the command below, don't copy the command prompt `127.0.0.1:6379>`, copy `CONFIG GET maxmemory` only and paste that into your terminal window.

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

The expected response from `CONFIG GET maxmemory` is:

```shell
1) "maxmemory"
2) "0"
```

Similarly, check `maxmemory-policy`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

The expected response from `CONFIG GET maxmemory-policy` is:

```shell
1) "maxmemory-policy"
2) "noeviction"
```

We're done checking our configuration, so press *ctrl-c* to exit the `kubectl exec` process.

5. Update the `maxmemory` and `maxmemory-policy` configuration settings in the Redis Pod by updating the `data` field of the ConfigMap you created in step .

Note that this will overwrite the ConfigMap that you created in step 1, so if you want to keep that file, rename it to a different filename.

```shell
cat <<EOF >./example-redis-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: example-redis-config
data:
  redis-config: |
    maxmemory 2mb
    maxmemory-policy allkeys-lru
EOF
```

6. Apply the the updated ConfigMap.

```shell
kubectl apply -f example-redis-config.yaml
```

The expected response from `kubectl` is:

```shell
configmap/example-redis-config configured
```

7. Confirm that the ConfigMap was updated in the Redis Pod.

```shell
kubectl describe configmap/example-redis-config
```

The expected response from `kubectl` is:

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

Note that at this point, we have updated the ConfigMap in our Redis Pod *only*. This means that the existing configuration in the Pod has not yet been updated.

For example, enter the command line of the Redis Pod using `redis-cli` via `kubectl exec`:

```shell
kubectl exec -it redis -- redis-cli
```

And once again, execute the `CONFIG GET maxmemory` command:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

And the response is:

```shell
1) "maxmemory"
2) "0"
```

Similarly, `maxmemory-policy` remains at the `noeviction` default setting:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

And the response is:

```shell
1) "maxmemory-policy"
2) "noeviction"
```

8. Restart the Redis Pod to read the updated configuration values you created in step 5 and applied in step 6. 

```shell
kubectl delete pod redis
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

Let's confirm that our configuration values have been updated. First, enter the command line of the Redis Pod using `redis-cli` via `kubectl exec`.

```shell
kubectl exec -it redis -- redis-cli
```

Check `maxmemory`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

The expected response from `CONFIG GET maxmemory` is:

```shell
1) "maxmemory"
2) "2097152"
```

Next, let's check `maxmemory-policy`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

The expected response from `CONFIG GET maxmemory` is:

```shell
1) "maxmemory-policy"
2) "allkeys-lru"
```

8. If necessary, clean up your Kubernetes cluster by deleting the resources you've created.

```shell
kubectl delete pod/redis configmap/example-redis-config
```

## {{% heading "whatsnext" %}}


* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Follow an example of [Updating configuration via a ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/).
