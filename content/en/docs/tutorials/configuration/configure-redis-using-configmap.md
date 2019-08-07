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

* Create a `kustomization.yaml` file containing:
  * a ConfigMap generator
  * a Pod resource config using the ConfigMap
* Apply the directory by running `kubectl apply -k ./`
* Verify that the configuration was correctly applied.

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* The example shown on this page works with `kubectl` 1.14 and above.
* Understand [Configure Containers Using a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).

{{% /capture %}}

{{% capture lessoncontent %}}


## Real World Example: Configuring Redis using a ConfigMap

You can follow the steps below to configure a Redis cache using data stored in a ConfigMap.

First create a `kustomization.yaml` containing a ConfigMap from the `redis-config` file:

{{< codenew file="pods/config/redis-config" >}}

```shell
curl -OL https://k8s.io/examples/pods/config/redis-config

cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-redis-config
  files:
  - redis-config
EOF
```

Add the pod resource config to the `kustomization.yaml`:

{{< codenew file="pods/config/redis-pod.yaml" >}}

```shell
curl -OL https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/pods/config/redis-pod.yaml

cat <<EOF >>./kustomization.yaml
resources:
- redis-pod.yaml
EOF
```

Apply the kustomization directory to create both the ConfigMap and Pod objects:

```shell
kubectl apply -k .
```

Examine the created objects by
```shell
> kubectl get -k .
NAME                                        DATA   AGE
configmap/example-redis-config-dgh9dg555m   1      52s

NAME        READY   STATUS    RESTARTS   AGE
pod/redis   1/1     Running   0          52s
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

Delete the created pod:
```shell
kubectl delete pod redis
```

{{% /capture %}}

{{% capture whatsnext %}}

* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).

{{% /capture %}}


