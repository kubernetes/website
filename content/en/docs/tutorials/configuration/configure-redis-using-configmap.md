---
reviewers:
- eparis
- pmorie
title: Configuring Redis using a ConfigMap
content_type: tutorial
weight: 30
---

<!-- overview -->

This sample demostrates how to configure Redits using a ConfigMap by building upon [Configuring a Pod to use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/). Redis - Remote Directory Server provides a flexible solution for managing different needs for different environments.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* This sample shown on this page works with `kubectl` 1.14 and above.


<!-- lessoncontent -->

## Configuring Redis using a ConfigMap


### Adding a ConfigMap to your Kubernetes cluster

Create an empty configuration block within a ConfigMap named `example-redis-config`.

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

Apply the ConfigMap and the following Redis pod manifest to your cluster.

```shell
kubectl apply -f example-redis-config.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

Once applied, review the Redis Pod manifest to understand how it configures Redis:

- A volume named `config` is defined at `spec.volumes[1]`
- The `key` and `path` located within `spec.volumes[1].configMap.items[0]` mount the `redis-config` key from the `example-redis-config` ConfigMap as `/redis-master/redis.conf`.
  - This volume is then mounted at `/redis-master` by `spec.containers[0].volumeMounts[1]`.

This exposes the contents of `data.redis-config` from the `example-redis-config` ConfigMap as a file named `redis.conf` inside the Pod's `/redis-master` directory.

{{% code_sample file="pods/config/redis-pod.yaml" %}}

Verify the objects created by the ConfigMap by running:

```shell
kubectl get pod/redis configmap/example-redis-config 
```

You should expect an output similar to what's shown below.

```shell
NAME        READY   STATUS    RESTARTS   AGE
pod/redis   1/1     Running   0          8s

NAME                             DATA   AGE
configmap/example-redis-config   1      14s
```

### Adjusting Redis Settings

Verify the initial configuration of your Redis deployment:

Inpsect the ConfigMap by running the following:

```shell
kubectl describe configmap/example-redis-config
```

Confirm that the `Data` section displays an empty `redis-config` key:

```shell
Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:
```

Use `kubectl exec` to access the Redis pod and check its current configuration using `redis-cli`:

```shell
kubectl exec -it redis -- redis-cli
```

Verify the default values for `maxmemory` and `maxmemory-policy`:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

Expect to see `0` and `noeviction` for `maxmemory` and `maxmemory-policy` respectively:

```shell
1) "maxmemory"
2) "0"
```

```shell
1) "maxmemory-policy"
2) "noeviction"
```

Update the `example-redis-config` to configure Redis with the specific settings using this YAML

{{% code_sample file="pods/config/example-redis-config.yaml" %}}

Apply the updated ConfigMap to your cluster:

```shell
kubectl apply -f example-redis-config.yaml
```

Confirm that the ConfigMap was updated by describing it again:

```shell
kubectl describe configmap/example-redis-config
```

The `Data` section should now include these settings:

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

// This should be a callout or anytype of alert suppored by the backend
Important: ConfigMap changes do not automatically propagate to any running pods. To apply the new configuration, delete and recreate the Redis Pod:

```shell
kubectl delete pod redis
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

If you 

Verify that the changes have been applied to the running Redis pod. Access the pod using `kubectl exec` and run `redis-cli`

```shell
kubectl exec -it redis -- redis-cli
```

Check `maxmemory` and `maxmemory-policy` to verify the updated settings are active:

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

You should see a value of `2097152`(representing 2MD) and `allkeys-lru` respectively for `maxmemory` and `maxmemory-policy`.

```shell
1) "maxmemory"
2) "2097152"
```

```shell
1) "maxmemory-policy"
2) "allkeys-lru"
```

To clean up, delete the created resources with the following command:

```shell
kubectl delete pod/redis configmap/example-redis-config
```

## {{% heading "whatsnext" %}}


* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Follow an example of [Updating configuration via a ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/).
