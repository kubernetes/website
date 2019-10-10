---
approvers:
- eparis
- pmorie
title: 使用ConfigMap来配置Redis
content_template: templates/tutorial
---

{{% capture overview %}}

这篇文档基于[使用ConfigMap来配置Containers](/docs/tasks/configure-pod-container/configure-pod-configmap/) 这个任务，提供了一个使用ConfigMap来配置Redis的真实案例。

{{% /capture %}}

{{% capture objectives %}}

* 创建一个ConfigMap。
* 使用ConfigMap来配置pod参数。
* 创建pod。
* 验证是否配置成功。

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
* 理解[使用ConfigMap来配置Containers](/docs/tasks/configure-pod-container/configure-pod-configmap/)。

{{% /capture %}}

{{% capture lessoncontent %}}


## 真实世界的案例：使用ConfigMap来配置Redis

按照下面的步骤，您可以使用ConfigMap中的数据来配置Redis缓存。

1. 根据`docs/user-guide/configmap/redis/redis-config`来创建一个ConfigMap：

   ```shell
   kubectl create configmap example-redis-config --from-file=docs/user-guide/configmap/redis/redis-config

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
     uid: 460a2b6e-f6a3-11e5-8ae5-42010af00002
   ```

1. 使用ConfigMap来配置pod参数：

   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: redis
   spec:
     containers:
     - name: redis
       image: kubernetes/redis:v1
       env:
       - name: MASTER
         value: "true"
       ports:
       - containerPort: 6379
       resources:
         limits:
           cpu: "0.1"
       volumeMounts:
       - mountPath: /redis-master-data
         name: data
       - mountPath: /redis-master
         name: config
     volumes:
       - name: data
         emptyDir: {}
       - name: config
         configMap:
           name: example-redis-config
           items:
           - key: redis-config
             path: redis.conf
   ```
1. 创建pod:

   ```shell
   kubectl create -f docs/user-guide/configmap/redis/redis-pod.yaml
   ```

   In the example, the config volume is mounted at `/redis-master`.
   It uses `path` to add the `redis-config` key to a file named `redis.conf`.
   The file path for the redis config, therefore, is `/redis-master/redis.conf`.
   This is where the image will look for the config file for the redis master.

1. 使用`kubectl exec`命令进入pod后运行 `redis-cli` 工具来验证配置是否成功：

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

* 了解关于[ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/)的更多知识。

{{% /capture %}}


