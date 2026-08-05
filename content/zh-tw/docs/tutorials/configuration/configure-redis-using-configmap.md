---
title: 使用 ConfigMap 設定 Redis
content_type: tutorial
weight: 30
---

<!-- overview -->

<!--
This page provides a real world example of how to configure Redis using a ConfigMap and builds upon the [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) task. 
-->
本頁提供了一個實際範例，說明如何使用 ConfigMap 設定 Redis，並延伸自[設定 Pod 以使用 ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) 任務。



## {{% heading "objectives" %}}


<!--
* Create a ConfigMap with Redis configuration values
* Create a Redis Pod that mounts and uses the created ConfigMap
* Verify that the configuration was correctly applied.
-->
* 建立一個包含 Redis 設定值的 ConfigMap
* 建立一個掛載並使用該 ConfigMap 的 Redis Pod
* 驗證設定是否正確套用。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* The example shown on this page works with `kubectl` 1.14 and above.
* Understand [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).
-->
* 本頁範例需要 `kubectl` 1.14 或以上版本。
* 瞭解[設定 Pod 以使用 ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)。



<!-- lessoncontent -->

<!-- 
## Real World Example: Configuring Redis using a ConfigMap 
-->
## 實際範例：使用 ConfigMap 設定 Redis

<!--
Follow the steps below to configure a Redis cache using data stored in a ConfigMap.
-->
請按照以下步驟，使用 ConfigMap 中的資料設定 Redis 快取。

<!--
First create a ConfigMap with an empty configuration block:
-->
首先，建立一個設定區塊為空的 ConfigMap：

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
套用上述建立的 ConfigMap，以及 Redis Pod 的設定檔：

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
-->
查看 Redis Pod 設定檔的內容，並注意以下事項：

* `spec.volumes[1]` 建立了一個名為 `config` 的卷
* `spec.volumes[1].configMap.items[0]` 下的 `key` 與 `path`，將 `example-redis-config` ConfigMap 中的 `redis-config` 鍵，以名為 `redis.conf` 的檔案形式呈現在 `config` 卷中
* `spec.containers[0].volumeMounts[1]` 接著將 `config` 卷掛載至 `/redis-master`

<!--
This has the net effect of exposing the data in `data.redis-config` from the `example-redis-config`
ConfigMap above as `/redis-master/redis.conf` inside the Pod.
-->
結果會將 `example-redis-config` ConfigMap 中 `data.redis-config` 的資料，以 `/redis-master/redis.conf` 的形式於 Pod 內呈現。

{{% code_sample file="pods/config/redis-pod.yaml" %}}

<!--
Examine the created objects:
-->
查看已建立的物件：

```shell
kubectl get pod/redis configmap/example-redis-config
```

<!--
You should see the following output:
-->
您應該會看到以下輸出：

```
NAME        READY   STATUS    RESTARTS   AGE
pod/redis   1/1     Running   0          8s

NAME                             DATA   AGE
configmap/example-redis-config   1      14s
```

<!--
Recall that we left `redis-config` key in the `example-redis-config` ConfigMap blank:
-->
回想一下，我們先前將 `example-redis-config` ConfigMap 中的 `redis-config` 鍵留白：

```shell
kubectl describe configmap/example-redis-config
```

<!--
You should see an empty `redis-config` key:
-->
您應該會看到空的 `redis-config` 鍵：

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
使用 `kubectl exec` 進入 Pod，並執行 `redis-cli` 工具以確認目前的設定：

```shell
kubectl exec -it pod/redis -- redis-cli
```

<!--
Check `maxmemory`:
-->
確認 `maxmemory`：

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

<!--
It should show the default value of 0:
-->
應顯示預設值 0：

```shell
1) "maxmemory"
2) "0"
```

<!--
Similarly, check `maxmemory-policy`:
-->
同樣地，確認 `maxmemory-policy`：

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

<!--
Which should also yield its default value of `noeviction`:
-->
也應回傳其預設值 `noeviction`：

```shell
1) "maxmemory-policy"
2) "noeviction"
```

<!--
Now let's add some configuration values to the `example-redis-config` ConfigMap:
-->
現在，讓我們在 `example-redis-config` ConfigMap 中新增一些設定值：

{{% code_sample file="pods/config/example-redis-config.yaml" %}}

<!--
Apply the updated ConfigMap:
-->
套用更新後的 ConfigMap：

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
您應該會看到剛才新增的設定值：

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
再次透過 `kubectl exec` 使用 `redis-cli` 確認 Redis Pod 是否已套用設定：

```shell
kubectl exec -it pod/redis -- redis-cli
```

<!--
Check `maxmemory`:
-->
確認 `maxmemory`：

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

<!--
It remains at the default value of 0:
-->
它仍為在預設值 0：

```shell
1) "maxmemory"
2) "0"
```

<!--
Similarly, `maxmemory-policy` remains at the `noeviction` default setting:
-->
同樣地，`maxmemory-policy` 仍維持 `noeviction` 的預設設定：

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

<!--
Returns:
-->
回傳：

```shell
1) "maxmemory-policy"
2) "noeviction"
```

<!--
The configuration values have not changed because the Pod needs to be restarted to grab updated
values from associated ConfigMaps. Let's delete and recreate the Pod:
-->
設定值沒有改變是因為 Pod 需要重新啟動才能取得相關 ConfigMap 更新後的值。讓我們刪除 Pod 並重新建立：

```shell
kubectl delete pod redis
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/config/redis-pod.yaml
```

<!--
Now re-check the configuration values one last time:
-->
最後再次確認設定值：

```shell
kubectl exec -it pod/redis -- redis-cli
```

<!--
Check `maxmemory`:
-->
確認 `maxmemory`：

```shell
127.0.0.1:6379> CONFIG GET maxmemory
```

<!--
It should now return the updated value of 2097152:
-->
現在應回傳更新後的值 2097152：

```shell
1) "maxmemory"
2) "2097152"
```

<!--
Similarly, `maxmemory-policy` has also been updated:
-->
同樣地，`maxmemory-policy` 也已更新：

```shell
127.0.0.1:6379> CONFIG GET maxmemory-policy
```

<!--
It now reflects the desired value of `allkeys-lru`:
-->
現在已反映期望的值 `allkeys-lru`：

```shell
1) "maxmemory-policy"
2) "allkeys-lru"
```

<!--
Clean up your work by deleting the created resources:
-->
刪除已建立的資源以清理環境：

```shell
kubectl delete pod/redis configmap/example-redis-config
```

## {{% heading "whatsnext" %}}


<!--
* Learn more about [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/).
* Follow an example of [Updating configuration via a ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/).
-->
* 深入瞭解 [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)。
* 參考[透過 ConfigMap 更新設定](/docs/tutorials/configuration/updating-configuration-via-a-configmap/)的範例。
