---
title: 使用 ConfigMap 來配置 Redis
content_type: tutorial
weight: 30
---
<!--
reviewers:
- eparis
- pmorie
title: Configuring Redis using a ConfigMap
content_type: tutorial
weight: 30
-->

<!-- overview -->

<!--
This page provides a real world example of how to configure Redis using a ConfigMap and
builds upon the [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) task.
-->
這篇文檔基於[配置 Pod 以使用 ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)
這個任務，提供了一個使用 ConfigMap 來配置 Redis 的真實案例。

## {{% heading "objectives" %}}

<!--
* Create a ConfigMap with Redis configuration values
* Create a Redis Pod that mounts and uses the created ConfigMap
* Verify that the configuration was correctly applied.
-->
* 使用 Redis 配置的值創建一個 ConfigMap
* 創建一個 Redis Pod，掛載並使用創建的 ConfigMap
* 驗證配置已經被正確應用

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* The example shown on this page works with `kubectl` 1.14 and above.
* Understand [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).
-->
* 此頁面上顯示的示例適用於 `kubectl` 1.14 及以上的版本。
* 理解[配置 Pod 以使用 ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)。

<!-- lessoncontent -->

<!--
## Real World Example: Configuring Redis using a ConfigMap

Follow the steps below to configure a Redis cache using data stored in a ConfigMap.

First create a ConfigMap with an empty configuration block:
-->
## 真實世界的案例：使用 ConfigMap 來配置 Redis    {#real-world-example-configuring-redis-using-a-configmap}

按照下面的步驟，使用 ConfigMap 中的數據來配置 Redis 緩存。

首先創建一個配置模塊爲空的 ConfigMap：

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

<!--
Apply the ConfigMap created above, along with a Redis pod manifest:
-->
應用上面創建的 ConfigMap 以及 Redis Pod 清單：

```shell
kubectl apply -f example-redis-config.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

<!--
Examine the contents of the Redis pod manifest and note the following:

* A volume named `config` is created by `spec.volumes[1]`
* The `key` and `path` under `spec.volumes[1].configMap.items[0]` exposes the `redis-config` key from the
  `example-redis-config` ConfigMap as a file named `redis.conf` on the `config` volume.
* The `config` volume is then mounted at `/redis-master` by `spec.containers[0].volumeMounts[1]`.

This has the net effect of exposing the data in `data.redis-config` from the `example-redis-config`
ConfigMap above as `/redis-master/redis.conf` inside the Pod.
-->
檢查 Redis pod 清單的內容，並注意以下幾點：

* 由 `spec.volumes[1]` 創建一個名爲 `config` 的卷。
* `spec.volumes[1].configMap.items[0]` 下的 `key` 和 `path` 會將來自 `example-redis-config`
  ConfigMap 中的 `redis-config` 鍵公開在 `config` 卷上一個名爲 `redis.conf` 的文件中。
* 然後 `config` 卷被 `spec.containers[0].volumeMounts[1]` 掛載在 `/redis-master`。

這樣做的最終效果是將上面 `example-redis-config` 配置中 `data.redis-config`
的數據作爲 Pod 中的 `/redis-master/redis.conf` 公開。

{{% code_sample file="pods/config/redis-pod.yaml" %}}

<!--
Examine the created objects:
-->
檢查創建的對象：

```shell
kubectl get pod/redis configmap/example-redis-config 
```

<!--
You should see the following output:
-->
你應該可以看到以下輸出：

```
NAME        READY   STATUS    RESTARTS   AGE
pod/redis   1/1     Running   0          8s

NAME                             DATA   AGE
configmap/example-redis-config   1      14s
```

<!--
Recall that we left `redis-config` key in the `example-redis-config` ConfigMap blank:
-->
回顧一下，我們在 `example-redis-config` ConfigMap 保留了空的 `redis-config` 鍵：

```shell
kubectl describe configmap/example-redis-config
```

<!--
You should see an empty `redis-config` key:
-->
你應該可以看到一個空的 `redis-config` 鍵：

```shell
Name:         example-redis-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
redis-config:
```

<!--
Use `kubectl exec` to enter the pod and run the `redis-cli` tool to check the current configuration:
-->
使用 `kubectl exec` 進入 pod，運行 `redis-cli` 工具檢查當前配置：

```shell
kubectl exec -it pod/redis -- redis-cli
```

<!--
Check `maxmemory`:
-->
查看 `maxmemory`：

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

<!--
It should show the default value of 0:
-->
它應該顯示默認值 0：

```shell
1) "maxmemory"
2) "0"
```

<!--
Similarly, check `maxmemory-policy`:
-->
同樣，查看 `maxmemory-policy`：

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

<!--
Which should also yield its default value of `noeviction`:
-->
它也應該顯示默認值 `noeviction`：

```shell
1) "maxmemory-policy"
2) "noeviction"
```

<!--
Now let's add some configuration values to the `example-redis-config` ConfigMap:
-->
現在，向 `example-redis-config` ConfigMap 添加一些配置：

{{% code_sample file="pods/config/example-redis-config.yaml" %}}

<!--
Apply the updated ConfigMap:
-->
應用更新的 ConfigMap：

```shell
kubectl apply -f example-redis-config.yaml
```

<!--
Confirm that the ConfigMap was updated:
-->
確認 ConfigMap 已更新：

```shell
kubectl describe configmap/example-redis-config
```

<!--
You should see the configuration values we just added:
-->
你應該可以看到我們剛剛添加的配置：

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

<!--
Check the Redis Pod again using `redis-cli` via `kubectl exec` to see if the configuration was applied:
-->
通過 `kubectl exec` 使用 `redis-cli` 再次檢查 Redis Pod，查看是否已應用配置：

```shell
kubectl exec -it pod/redis -- redis-cli
```

<!--
Check `maxmemory`:
-->
查看 `maxmemory`：

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

<!--
It remains at the default value of 0:
-->
它保持默認值 0：

```shell
1) "maxmemory"
2) "0"
```

<!--
Similarly, `maxmemory-policy` remains at the `noeviction` default setting:
-->
同樣，`maxmemory-policy` 保留爲默認設置 `noeviction`：

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

<!--
Returns:
-->
返回：

```shell
1) "maxmemory-policy"
2) "noeviction"
```

<!--
The configuration values have not changed because the Pod needs to be restarted to grab updated
values from associated ConfigMaps. Let's delete and recreate the Pod:
-->
配置值未更改，因爲需要重新啓動 Pod 才能從關聯的 ConfigMap 中獲取更新的值。
讓我們刪除並重新創建 Pod：

```shell
kubectl delete pod redis
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

<!--
Now re-check the configuration values one last time:
-->
現在，最後一次重新檢查配置值：

```shell
kubectl exec -it pod/redis -- redis-cli
```

<!--
Check `maxmemory`:
-->
查看 `maxmemory`：

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

<!--
It should now return the updated value of 2097152:
-->
現在，它應該返回更新後的值 2097152：

```shell
1) "maxmemory"
2) "2097152"
```

<!--
Similarly, `maxmemory-policy` has also been updated:
-->
同樣，`maxmemory-policy` 也已更新：

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

<!--
It now reflects the desired value of `allkeys-lru`:
-->
現在它反映了期望值 `allkeys-lru`：

```shell
1) "maxmemory-policy"
2) "allkeys-lru"
```

<!--
Clean up your work by deleting the created resources:
-->
刪除創建的資源，清理你的工作：

```shell
kubectl delete pod/redis configmap/example-redis-config
```

## {{% heading "whatsnext" %}}

<!--
* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Follow an example of [Updating configuration via a ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/).
-->
* 瞭解有關 [ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/) 的更多信息。
* 學習[通過 ConfigMap 更新配置](/zh-cn/docs/tutorials/configuration/updating-configuration-via-a-configmap/)的示例。
