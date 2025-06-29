---
reviewers:
- eparis
- pmorie
title: Configuring Redis using a ConfigMap
content_type: tutorial
weight: 30
---

<!-- overview -->

When you use Redis pods in Kubernetes, you often need to adjust how your Redis application behaves, such as setting its memory limits. This tutorial shows you how to use a Kubernetes tool called a [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) to store Redis settings separately from your Redis application. This way, you can update how your Redis pod behaves without having to rebuild or redeploy your whole application every time, making it easier to manage your Redis application in Kubernetes.


## {{% heading "objectives" %}}


* Create a ConfigMap with a custom Redis configuration.
* Deploy a Redis pod that mounts the ConfigMap.
* Update the Redis configuration, and apply the changes to the pod.
* Clean up your Kubernetes resources.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

This tutorial is designed to work with kubectl version 1.14 and above. Familiarity with how to [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) is helpful for deeper understanding, you can complete this tutorial on its own.



<!-- lessoncontent -->


## Creating a ConfigMap with Redis configuration

Start by defining your Redis configuration in a ConfigMap. This ConfigMap holds the `redis-config` key containing the Redis settings.

Use the `cat` command with an end of file `EOF` marker to create a Redis configuration file named `example-redis-config.yml`:

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

This command creates the `example-redis-config.yaml` file, defining a `ConfigMap` resource with an empty `redis-config` data field.

Run [kubectl apply](/docs/reference/kubectl/generated/kubectl_apply/) to create the ConfigMap in your cluster:

```shell
kubectl apply -f example-redis-config.yaml
```

You should see an output like:

```shell
configmap/example-redis-config created
```

## Deploy the Redis pod

Deploy the Redis pod manifest to make its contents available to the container. The pod manifest defines your Redis pod settings, such as memory size.

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

The manifest contains:

{{% code_sample file="pods/config/redis-pod.yaml" %}}

Look at the applied pod manifest and notice:

1. A volume named `config` is created
1. That volume takes data from the `redis-config` key in the ConfigMap
1. The data becomes the file `redis.conf` inside the pod under `/redis-master`

That means Redis will read its configuration from this file.

{{% code_sample file="pods/config/redis-pod.yaml" %}}

## Check that the pod and ConfigMap are running

To confirm that the Redis pod and the ConfigMap have been successfully created, run [kubectl get](/docs/reference/kubectl/generated/kubectl_get/):

```shell
kubectl get pod/redis configmap/example-redis-config 
```

You should see something like:

```shell
NAME        READY   STATUS    RESTARTS   AGE
pod/redis   1/1     Running   0          8s

NAME                             DATA   AGE
configmap/example-redis-config   1      14s
```

Now, check the ConfigMap details:

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

## Check the pod's default values

Use [kubectl exec](/docs/reference/kubectl/generated/kubectl_exec/) to run redis-cli commands inside your Redis pod and inspect its current configuration. Check the default values of your Redis pod:

```shell
kubectl exec -it redis -- redis-cli
```

Check the `maxmemory` setting:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

`maxmemory` should show the default value of `0`:

```shell
1) "maxmemory"
2) "0"
```

Now check `maxmemory-policy`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

This should now show `noeviction`, another default value:

```shell
1) "maxmemory-policy"
2) "noeviction"
```

## Update values in the ConfigMap

Update the `example-redis-config.yaml` file with the new Redis configuration settings:

{{% code_sample file="pods/config/example-redis-config.yaml" %}}

Save your changes, then apply it to your cluster:

```shell
kubectl apply -f example-redis-config.yaml
```

Verify the updated ConfigMap details:

```shell
kubectl describe configmap/example-redis-config
```

You should now see the `maxmemory` and `maxmemory-policy` values you added:

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

## Restart the pod to apply changes

To ensure the Redis pod picks up the updated configuration, you must restart it.

```shell
kubectl delete pod redis
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

## Confirm Redis changes

Access Redis again within the restarted pod:

```shell
kubectl exec -it redis -- redis-cli
```

Check the `maxmemory` value:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

It should now reflect the updated value:

```shell
1) "maxmemory"
2) "2097152"
```

Also check `maxmemory-policy`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

It should show the `noeviction` default setting.

Also check `maxmemory-policy`:

```shell
1) "maxmemory-policy"
2) "allkeys-lru"
```

It now shows `allkeys-lru`

## Cleaning up

When you are finished with the tutorial, delete the created resources:

```shell
kubectl delete pod/redis configmap/example-redis-config
```

## {{% heading "whatsnext" %}}


* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Follow an example of [Updating configuration via a ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/).
