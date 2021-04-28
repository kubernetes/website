---
reviewers:
- eparis
- pmorie
title: 使用 ConfigMap 来配置 Redis
content_type: tutorial
---

<!-- overview -->

<!--
This page provides a real world example of how to configure Redis using a ConfigMap and builds upon the [Configure Containers Using a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) task.
-->
这篇文档基于[使用 ConfigMap 来配置 Containers](/zh/docs/tasks/configure-pod-container/configure-pod-configmap/) 这个任务，提供了一个使用 ConfigMap 来配置 Redis 的真实案例。



## {{% heading "objectives" %}}


<!--
* * Create a `kustomization.yaml` file containing:
  * a ConfigMap generator
  * a Pod resource config using the ConfigMap
* Apply the directory by running `kubectl apply -k ./`
* Verify that the configuration was correctly applied.
-->

* * 创建一个包含以下内容的 `kustomization.yaml` 文件：
  * 一个 ConfigMap 生成器
  * 一个使用 ConfigMap 的 Pod 资源配置
* 使用 `kubectl apply -k ./` 应用整个路径的配置
* 验证配置已经被正确应用。





## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
<!--
* The example shown on this page works with `kubectl` 1.14 and above.
* Understand [Configure Containers Using a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).
-->
* 此页面上显示的示例适用于 `kubectl` 1.14和在其以上的版本。
* 理解[使用ConfigMap来配置Containers](/zh/docs/tasks/configure-pod-container/configure-pod-configmap/)。



<!-- lessoncontent -->


<!--
## Real World Example: Configuring Redis using a ConfigMap

You can follow the steps below to configure a Redis cache using data stored in a ConfigMap.

First create a `kustomization.yaml` containing a ConfigMap from the `redis-config` file:
-->
## 真实世界的案例：使用 ConfigMap 来配置 Redis

按照下面的步骤，您可以使用ConfigMap中的数据来配置Redis缓存。

1. 根据`docs/user-guide/configmap/redis/redis-config`来创建一个ConfigMap：


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

<!--
Add the pod resource config to the `kustomization.yaml`:
-->
将 pod 的资源配置添加到 `kustomization.yaml` 文件中：

{{< codenew file="pods/config/redis-pod.yaml" >}}

```shell
curl -OL https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/pods/config/redis-pod.yaml

cat <<EOF >>./kustomization.yaml
resources:
- redis-pod.yaml
EOF
```

<!--
Apply the kustomization directory to create both the ConfigMap and Pod objects:
-->
应用整个 kustomization 文件夹来创建 ConfigMap 和 Pod 对象：

```shell
kubectl apply -k .
```

<!--
Examine the created objects by
-->
使用以下命令检查创建的对象

```shell
> kubectl get -k .
NAME                                        DATA   AGE
configmap/example-redis-config-dgh9dg555m   1      52s

NAME        READY   STATUS    RESTARTS   AGE
pod/redis   1/1     Running   0          52s
```

<!--
In the example, the config volume is mounted at `/redis-master`.
It uses `path` to add the `redis-config` key to a file named `redis.conf`.
The file path for the redis config, therefore, is `/redis-master/redis.conf`.
This is where the image will look for the config file for the redis master.
-->
在示例中，配置卷挂载在 `/redis-master` 下。
它使用 `path` 将 `redis-config` 密钥添加到名为 `redis.conf` 的文件中。
因此，redis配置的文件路径为 `/redis-master/redis.conf`。
在这里，镜像将查找 redis master 的配置文件。

<!--
Use `kubectl exec` to enter the pod and run the `redis-cli` tool to verify that
the configuration was correctly applied:
-->
使用 `kubectl exec` 进入 pod 并运行 `redis-cli` 工具来验证配置已正确应用：

```shell
kubectl exec -it redis -- redis-cli
127.0.0.1:6379> CONFIG GET maxmemory
1) "maxmemory"
2) "2097152"
127.0.0.1:6379> CONFIG GET maxmemory-policy
1) "maxmemory-policy"
2) "allkeys-lru"
```

<!--
Delete the created pod:
-->
删除创建的 pod：
```shell
kubectl delete pod redis
```



## {{% heading "whatsnext" %}}


<!--
* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
-->
* 了解有关 [ConfigMaps](/zh/docs/tasks/configure-pod-container/configure-pod-configmap/)的更多信息。



