---
reviewers:
- eparis
- pmorie
title: Configuring Redis using a ConfigMap
content_template: templates/tutorial
---

{{% capture overview %}}

This page provides a real world example of how to configure Redis using a ConfigMap and builds upon the [Configure Containers Using a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) task. 

{{% /capture %}}

{{% capture objectives %}}

* Create a ConfigMap.
* Create a pod specification using the ConfigMap.
* Create the pod.
* Verify that the configuration was correctly applied.

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* Understand [Configure Containers Using a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).

{{% /capture %}}

{{% capture lessoncontent %}}


## Real World Example: Configuring Redis using a ConfigMap

You can follow the steps below to configure a Redis cache using data stored in a ConfigMap.

First create a ConfigMap from the `redis-config` file:

{{< codenew file="pods/config/redis-config" >}}

```shell
curl -OL https://k8s.io/examples/pods/config/redis-config
kubectl create configmap example-redis-config --from-file=redis-config
```

```shell
configmap/example-redis-config created
```

Examine the created ConfigMap:

```shell
kubectl get configmap example-redis-config -o yaml
```

```yaml
apiVersion: v1
data:
  redis-config: |
    maxmemory 2mb
    maxmemory-policy allkeys-lru
kind: ConfigMap
metadata:
  creationTimestamp: 2016-03-30T18:14:41Z
  name: example-redis-config
  namespace: default
  resourceVersion: "24686"
  selfLink: /api/v1/namespaces/default/configmaps/example-redis-config
  uid: 460a2b6e-f6a3-11e5-8ae5-42010af00002
```

Now create a pod specification that uses the config data stored in the ConfigMap:

{{< codenew file="pods/config/redis-pod.yaml" >}}

Create the pod:

```shell
kubectl create -f https://k8s.io/examples/pods/config/redis-pod.yaml
```

In the example, the config volume is mounted at `/redis-master`.
It uses `path` to add the `redis-config` key to a file named `redis.conf`.
The file path for the redis config, therefore, is `/redis-master/redis.conf`.
This is where the image will look for the config file for the redis master.

Use `kubectl exec` to enter the pod and run the `redis-cli` tool to verify that
the configuration was correctly applied:

```shell
kubectl exec -it redis redis-cli
127.0.0.1:6379> CONFIG GET maxmemory
1) "maxmemory"
2) "2097152"
127.0.0.1:6379> CONFIG GET maxmemory-policy
1) "maxmemory-policy"
2) "allkeys-lru"
```

{{% /capture %}}

{{% capture whatsnext %}}

* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).

{{% /capture %}}


