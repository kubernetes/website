---
title: 通過 ConfigMap 更新設定
content_type: tutorial
weight: 20
---
<!--
title: Updating Configuration via a ConfigMap
content_type: tutorial
weight: 20
-->

<!-- overview -->
<!--
This page provides a step-by-step example of updating configuration within a Pod via a ConfigMap
and builds upon the [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) task.
At the end of this tutorial, you will understand how to change the configuration for a running application.
This tutorial uses the `alpine` and `nginx` images as examples.
-->
本頁提供了通過 ConfigMap 更新 Pod 中設定信息的分步示例，
本教程的前置任務是[設定 Pod 以使用 ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)。
在本教程結束時，你將瞭解如何變更運行中應用的設定。
本教程以 `alpine` 和 `nginx` 映像檔爲例。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You need to have the [curl](https://curl.se/) command-line tool for making HTTP requests from
the terminal or command prompt. If you do not have `curl` available, you can install it. Check the
documentation for your local operating system.
-->
你需要有 [curl](https://curl.se/) 命令列工具，用於從終端或命令列界面發出 HTTP 請求。
如果你沒有 `curl`，可以安裝此工具。請查閱你本地操作系統的文檔。

## {{% heading "objectives" %}}

<!--
* Update configuration via a ConfigMap mounted as a Volume
* Update environment variables of a Pod via a ConfigMap
* Update configuration via a ConfigMap in a multi-container Pod
* Update configuration via a ConfigMap in a Pod possessing a Sidecar Container
-->
* 通過作爲卷掛載的 ConfigMap 更新設定
* 通過 ConfigMap 更新 Pod 的環境變量
* 在多容器 Pod 中通過 ConfigMap 更新設定
* 在包含邊車容器的 Pod 中通過 ConfigMap 更新設定

<!-- lessoncontent -->

<!--
## Update configuration via a ConfigMap mounted as a Volume {#rollout-configmap-volume}

Use the `kubectl create configmap` command to create a ConfigMap from
[literal values](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):
-->
## 通過作爲卷掛載的 ConfigMap 更新設定   {#rollout-configmap-volume}

使用 `kubectl create configmap`
命令基於[字面值](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values)創建一個
ConfigMap：

```shell
kubectl create configmap sport --from-literal=sport=football
```

<!--
Below is an example of a Deployment manifest with the ConfigMap `sport` mounted as a
{{< glossary_tooltip text="volume" term_id="volume" >}} into the Pod's only container.
{{% code_sample file="deployments/deployment-with-configmap-as-volume.yaml" %}}

Create the Deployment:
-->
下面是一個 Deployment 清單示例，其中 ConfigMap `sport`
作爲{{< glossary_tooltip text="卷" term_id="volume" >}}掛載到 Pod 的唯一容器中。

{{% code_sample file="deployments/deployment-with-configmap-as-volume.yaml" %}}

創建此 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-as-volume.yaml
```

<!--
Check the pods for this Deployment to ensure they are ready (matching by
{{< glossary_tooltip text="selector" term_id="selector" >}}):
-->
檢查此 Deployment 的 Pod 以確保它們已就緒
（通過{{< glossary_tooltip text="選擇算符" term_id="selector" >}}進行匹配）：

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-volume
```

<!--
You should see an output similar to:
-->
你應該會看到類似以下的輸出：

```
NAME                                READY   STATUS    RESTARTS   AGE
configmap-volume-6b976dfdcf-qxvbm   1/1     Running   0          72s
configmap-volume-6b976dfdcf-skpvm   1/1     Running   0          72s
configmap-volume-6b976dfdcf-tbc6r   1/1     Running   0          72s
```

<!--
On each node where one of these Pods is running, the kubelet fetches the data for
that ConfigMap and translates it to files in a local volume.
The kubelet then mounts that volume into the container, as specified in the Pod template.
The code running in that container loads the information from the file
and uses it to print a report to stdout.
You can check this report by viewing the logs for one of the Pods in that Deployment:
-->
在運行這些 Pod 之一的每個節點上，kubelet 獲取該 ConfigMap 的數據，並將其轉換爲本地卷中的文件。
然後，kubelet 按照 Pod 模板中指定的方式將該卷掛載到容器中。
在該容器中運行的代碼從文件中加載信息，並使用它將報告打印到標準輸出。
你可以通過查看該 Deployment 中其中一個 Pod 的日誌來檢查此報告：

<!--
```shell
# Pick one Pod that belongs to the Deployment, and view its logs
kubectl logs deployments/configmap-volume
```

You should see an output similar to:
-->
```shell
# 選擇一個屬於該 Deployment 的 Pod，並查看其日誌
kubectl logs deployments/configmap-volume
```

你應該會看到類似以下的輸出：

```
Found 3 pods, using pod/configmap-volume-76d9c5678f-x5rgj
Thu Jan  4 14:06:46 UTC 2024 My preferred sport is football
Thu Jan  4 14:06:56 UTC 2024 My preferred sport is football
Thu Jan  4 14:07:06 UTC 2024 My preferred sport is football
Thu Jan  4 14:07:16 UTC 2024 My preferred sport is football
Thu Jan  4 14:07:26 UTC 2024 My preferred sport is football
```

<!--
Edit the ConfigMap:
-->
編輯 ConfigMap：

```shell
kubectl edit configmap sport
```

<!--
In the editor that appears, change the value of key `sport` from `football` to `cricket`. Save your changes.
The kubectl tool updates the ConfigMap accordingly (if you see an error, try again).

Here's an example of how that manifest could look after you edit it:
-->
在出現的編輯器中，將鍵 `sport` 的值從 `football` 變更爲 `cricket`。
保存你的變更。kubectl 工具會相應地更新 ConfigMap（如果報錯，請重試）。

以下是你編輯後該清單可能的樣子：

<!--
```yaml
apiVersion: v1
data:
  sport: cricket
kind: ConfigMap
# You can leave the existing metadata as they are.
# The values you'll see won't exactly match these.
metadata:
  creationTimestamp: "2024-01-04T14:05:06Z"
  name: sport
  namespace: default
  resourceVersion: "1743935"
  uid: 024ee001-fe72-487e-872e-34d6464a8a23
```
-->
```yaml
apiVersion: v1
data:
  sport: cricket
kind: ConfigMap
# 你可以保留現有的 metadata 不變。
# 你將看到的值與本例的值不會完全一樣。
metadata:
  creationTimestamp: "2024-01-04T14:05:06Z"
  name: sport
  namespace: default
  resourceVersion: "1743935"
  uid: 024ee001-fe72-487e-872e-34d6464a8a23
```

<!--
You should see the following output:
-->
你應該會看到以下輸出：

```
configmap/sport edited
```

<!--
Tail (follow the latest entries in) the logs of one of the pods that belongs to this Deployment:
-->
查看屬於此 Deployment 的 Pod 之一的日誌（並跟蹤最新寫入的條目）：

```shell
kubectl logs deployments/configmap-volume --follow
```

<!--
After few seconds, you should see the log output change as follows:
-->
幾秒鐘後，你應該會看到日誌輸出中的如下變化：

```
Thu Jan  4 14:11:36 UTC 2024 My preferred sport is football
Thu Jan  4 14:11:46 UTC 2024 My preferred sport is football
Thu Jan  4 14:11:56 UTC 2024 My preferred sport is football
Thu Jan  4 14:12:06 UTC 2024 My preferred sport is cricket
Thu Jan  4 14:12:16 UTC 2024 My preferred sport is cricket
```

<!--
When you have a ConfigMap that is mapped into a running Pod using either a
`configMap` volume or a `projected` volume, and you update that ConfigMap,
the running Pod sees the update almost immediately.
However, your application only sees the change if it is written to either poll for changes,
or watch for file updates.
An application that loads its configuration once at startup will not notice a change.
-->
當你有一個 ConfigMap 通過 `configMap` 卷或 `projected` 卷映射到運行中的 Pod，
並且你更新了該 ConfigMap 時，運行中的 Pod 幾乎會立即更新。
但是，你的應用只有在編寫爲輪詢變更或監視文件更新時才能看到變更。
啓動時一次性加載其設定的應用將不會注意到變更。

{{< note >}}
<!--
The total delay from the moment when the ConfigMap is updated to the moment when
new keys are projected to the Pod can be as long as kubelet sync period.
Also check [Mounted ConfigMaps are updated automatically](/docs/tasks/configure-pod-container/configure-pod-configmap/#mounted-configmaps-are-updated-automatically).
-->
從更新 ConfigMap 的那一刻到將新的鍵投射到 Pod 的那一刻，整個延遲可能與 kubelet 同步週期相同。
另請參閱[掛載的 ConfigMap 會被自動更新](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/#mounted-configmaps-are-updated-automatically)。
{{< /note >}}

<!--
## Update environment variables of a Pod via a ConfigMap {#rollout-configmap-env}

Use the `kubectl create configmap` command to create a ConfigMap from
[literal values](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):
-->
## 通過 ConfigMap 更新 Pod 的環境變量   {#rollout-configmap-env}

使用 `kubectl create configmap`
命令基於[字面值](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values)創建一個
ConfigMap：

```shell
kubectl create configmap fruits --from-literal=fruits=apples
```

<!--
Below is an example of a Deployment manifest with an environment variable configured via the ConfigMap `fruits`.
-->
下面是一個 Deployment 清單的示例，包含一個通過 ConfigMap `fruits` 設定的環境變量。

{{% code_sample file="deployments/deployment-with-configmap-as-envvar.yaml" %}}

<!--
Create the Deployment:
-->
創建此 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-as-envvar.yaml
```

<!--
Check the pods for this Deployment to ensure they are ready (matching by
{{< glossary_tooltip text="selector" term_id="selector" >}}):
-->
檢查此 Deployment 的 Pod 以確保它們已就緒（通過{{< glossary_tooltip text="選擇算符" term_id="selector" >}}進行匹配）：

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-env-var
```

<!--
You should see an output similar to:
-->
你應該會看到類似以下的輸出：

```
NAME                                 READY   STATUS    RESTARTS   AGE
configmap-env-var-59cfc64f7d-74d7z   1/1     Running   0          46s
configmap-env-var-59cfc64f7d-c4wmj   1/1     Running   0          46s
configmap-env-var-59cfc64f7d-dpr98   1/1     Running   0          46s
```

<!--
The key-value pair in the ConfigMap is configured as an environment variable in the container of the Pod.
Check this by viewing the logs of one Pod that belongs to the Deployment.
-->
ConfigMap 中的鍵值對被設定爲 Pod 容器中的環境變量。
通過查看屬於該 Deployment 的某個 Pod 的日誌來檢查這一點。

```shell
kubectl logs deployment/configmap-env-var
```

<!--
You should see an output similar to:
-->
你應該會看到類似以下的輸出：

```
Found 3 pods, using pod/configmap-env-var-7c994f7769-l74nq
Thu Jan  4 16:07:06 UTC 2024 The basket is full of apples
Thu Jan  4 16:07:16 UTC 2024 The basket is full of apples
Thu Jan  4 16:07:26 UTC 2024 The basket is full of apples
```

<!--
Edit the ConfigMap:
-->
編輯 ConfigMap：

```shell
kubectl edit configmap fruits
```

<!--
In the editor that appears, change the value of key `fruits` from `apples` to `mangoes`. Save your changes.
The kubectl tool updates the ConfigMap accordingly (if you see an error, try again).

Here's an example of how that manifest could look after you edit it:
-->
在出現的編輯器中，將鍵 `fruits` 的值從 `apples` 變更爲 `mangoes`。
保存你的變更。kubectl 工具會相應地更新 ConfigMap（如果報錯，請重試）。

以下是你編輯後該清單可能的樣子：

<!--
```yaml
apiVersion: v1
data:
  fruits: mangoes
kind: ConfigMap
# You can leave the existing metadata as they are.
# The values you'll see won't exactly match these.
metadata:
  creationTimestamp: "2024-01-04T16:04:19Z"
  name: fruits
  namespace: default
  resourceVersion: "1749472"
```
-->
```yaml
apiVersion: v1
data:
  fruits: mangoes
kind: ConfigMap
# 你可以保留現有的 metadata 不變。
# 你將看到的值與本例的值不會完全一樣。
metadata:
  creationTimestamp: "2024-01-04T16:04:19Z"
  name: fruits
  namespace: default
  resourceVersion: "1749472"
```

<!--
You should see the following output:
-->
你應該看到以下輸出：

```
configmap/fruits edited
```

<!--
Tail the logs of the Deployment and observe the output for few seconds:

```shell
# As the text explains, the output does NOT change
kubectl logs deployments/configmap-env-var --follow
```

Notice that the output remains **unchanged**, even though you edited the ConfigMap:
-->
查看此 Deployment 的日誌，並觀察幾秒鐘的輸出：

```shell
# 如上所述，輸出不會有變化
kubectl logs deployments/configmap-env-var --follow
```

請注意，即使你編輯了 ConfigMap，輸出仍然**沒有變化**：

```
Thu Jan  4 16:12:56 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:06 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:16 UTC 2024 The basket is full of apples
Thu Jan  4 16:13:26 UTC 2024 The basket is full of apples
```

{{< note >}}
<!--
Although the value of the key inside the ConfigMap has changed, the environment variable
in the Pod still shows the earlier value. This is because environment variables for a
process running inside a Pod are **not** updated when the source data changes; if you
wanted to force an update, you would need to have Kubernetes replace your existing Pods.
The new Pods would then run with the updated information.
-->
儘管 ConfigMap 中的鍵的取值已經變更，Pod 中的環境變量仍然顯示先前的值。
這是因爲當源數據變更時，在 Pod 內運行的進程的環境變量**不會**被更新；
如果你想強制更新，需要讓 Kubernetes 替換現有的 Pod。新 Pod 將使用更新的信息來運行。
{{< /note >}}

<!--
You can trigger that replacement. Perform a rollout for the Deployment, using
[`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/):

```shell
# Trigger the rollout
kubectl rollout restart deployment configmap-env-var

# Wait for the rollout to complete
kubectl rollout status deployment configmap-env-var --watch=true
```

Next, check the Deployment:
-->
你可以觸發該替換。使用 [`kubectl rollout`](/zh-cn/docs/reference/kubectl/generated/kubectl_rollout/)
爲 Deployment 執行上線操作：

```shell
# 觸發上線操作
kubectl rollout restart deployment configmap-env-var

# 等待上線操作完成
kubectl rollout status deployment configmap-env-var --watch=true
```

接下來，檢查 Deployment：

```shell
kubectl get deployment configmap-env-var
```

<!--
You should see an output similar to:
-->
你應該會看到類似以下的輸出：

```
NAME                READY   UP-TO-DATE   AVAILABLE   AGE
configmap-env-var   3/3     3            3           12m
```

<!--
Check the Pods:
-->
檢查 Pod：

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-env-var
```

<!--
The rollout causes Kubernetes to make a new {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}
for the Deployment; that means the existing Pods eventually terminate, and new ones are created.
After few seconds, you should see an output similar to:
-->
上線操作會導致 Kubernetes 爲 Deployment 新建一個 {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}；
這意味着現有的 Pod 最終會終止，並創建新的 Pod。幾秒鐘後，你應該會看到類似以下的輸出：

```
NAME                                 READY   STATUS        RESTARTS   AGE
configmap-env-var-6d94d89bf5-2ph2l   1/1     Running       0          13s
configmap-env-var-6d94d89bf5-74twx   1/1     Running       0          8s
configmap-env-var-6d94d89bf5-d5vx8   1/1     Running       0          11s
```

{{< note >}}
<!--
Please wait for the older Pods to fully terminate before proceeding with the next steps.
-->
請等待舊的 Pod 完全終止後再進行下一步。
{{< /note >}}

<!--
View the logs for a Pod in this Deployment:

```shell
# Pick one Pod that belongs to the Deployment, and view its logs
kubectl logs deployment/configmap-env-var
```

You should see an output similar to the below:
-->
查看此 Deployment 中某個 Pod 的日誌：

```shell
# 選擇屬於 Deployment 的一個 Pod，並查看其日誌
kubectl logs deployment/configmap-env-var
```

你應該會看到類似以下的輸出：

```
Found 3 pods, using pod/configmap-env-var-6d9ff89fb6-bzcf6
Thu Jan  4 16:30:35 UTC 2024 The basket is full of mangoes
Thu Jan  4 16:30:45 UTC 2024 The basket is full of mangoes
Thu Jan  4 16:30:55 UTC 2024 The basket is full of mangoes
```

<!--
This demonstrates the scenario of updating environment variables in a Pod that are derived
from a ConfigMap. Changes to the ConfigMap values are applied to the Pod during the subsequent
rollout. If Pods get created for another reason, such as scaling up the Deployment, then the new Pods
also use the latest configuration values; if you don't trigger a rollout, then you might find that your
app is running with a mix of old and new environment variable values.
-->
這個場景演示了在 Pod 中如何更新從 ConfigMap 派生的環境變量。ConfigMap
值的變更在隨後的上線操作期間被應用到 Pod。如果 Pod 由於其他原因（例如 Deployment 擴容）被創建，
那麼新 Pod 也會使用最新的設定值；
如果你不觸發上線操作，你可能會發現你的應用在運行過程中混用了新舊環境變量值。

<!--
## Update configuration via a ConfigMap in a multi-container Pod {#rollout-configmap-multiple-containers}

Use the `kubectl create configmap` command to create a ConfigMap from
[literal values](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):
-->
## 在多容器 Pod 中通過 ConfigMap 更新設定   {#rollout-configmap-multiple-containers}

使用 `kubectl create configmap`
命令基於[字面值](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values)創建一個
ConfigMap：

```shell
kubectl create configmap color --from-literal=color=red
```

<!--
Below is an example manifest for a Deployment that manages a set of Pods, each with two containers.
The two containers share an `emptyDir` volume that they use to communicate.
The first container runs a web server (`nginx`). The mount path for the shared volume in the
web server container is `/usr/share/nginx/html`. The second helper container is based on `alpine`,
and for this container the `emptyDir` volume is mounted at `/pod-data`. The helper container writes
a file in HTML that has its content based on a ConfigMap. The web server container serves the HTML via HTTP.
-->
下面是一個 Deployment 清單的示例，該 Deployment 管理一組 Pod，每個 Pod 有兩個容器。
這兩個容器共享一個 `emptyDir` 卷並使用此捲進行通信。第一個容器運行 Web 伺服器（`nginx`）。
在 Web 伺服器容器中共享卷的掛載路徑是 `/usr/share/nginx/html`。
第二個輔助容器基於 `alpine`，對於這個容器，`emptyDir` 卷被掛載在 `/pod-data`。
輔助容器生成一個 HTML 文件，其內容基於 ConfigMap。Web 伺服器容器通過 HTTP 提供此 HTML 文件。

{{% code_sample file="deployments/deployment-with-configmap-two-containers.yaml" %}}

<!--
Create the Deployment:
-->
創建此 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-two-containers.yaml
```

<!--
Check the pods for this Deployment to ensure they are ready (matching by
{{< glossary_tooltip text="selector" term_id="selector" >}}):
-->
檢查此 Deployment 的 Pod 以確保它們已就緒（通過{{< glossary_tooltip text="選擇算符" term_id="selector" >}}進行匹配）：

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-two-containers
```

<!--
You should see an output similar to:
-->
你應該會看到類似以下的輸出：

```
NAME                                        READY   STATUS    RESTARTS   AGE
configmap-two-containers-565fb6d4f4-2xhxf   2/2     Running   0          20s
configmap-two-containers-565fb6d4f4-g5v4j   2/2     Running   0          20s
configmap-two-containers-565fb6d4f4-mzsmf   2/2     Running   0          20s
```

<!--
Expose the Deployment (the `kubectl` tool creates a
{{<glossary_tooltip text="Service" term_id="service">}} for you):
-->
公開 Deployment（`kubectl` 工具會爲你創建 {{< glossary_tooltip text="Service" term_id="service" >}}）：

```shell
kubectl expose deployment configmap-two-containers --name=configmap-service --port=8080 --target-port=80
```

<!--
Use `kubectl` to forward the port:

```shell
# this stays running in the background
kubectl port-forward service/configmap-service 8080:8080 &
```

Access the service.
-->
使用 `kubectl` 轉發端口：

```shell
# 此命令將在後臺運行
kubectl port-forward service/configmap-service 8080:8080 &
```

訪問服務：

```shell
curl http://localhost:8080
```

<!--
You should see an output similar to:
-->
你應該會看到類似以下的輸出：

```
Fri Jan  5 08:08:22 UTC 2024 My preferred color is red
```

<!--
Edit the ConfigMap:
-->
編輯 ConfigMap：

```shell
kubectl edit configmap color
```

<!--
In the editor that appears, change the value of key `color` from `red` to `blue`. Save your changes.
The kubectl tool updates the ConfigMap accordingly (if you see an error, try again).

Here's an example of how that manifest could look after you edit it:
-->
在出現的編輯器中，將鍵 `color` 的值從 `red` 變更爲 `blue`。
保存你的變更。kubectl 工具會相應地更新 ConfigMap（如果報錯，請重試）。

以下是你編輯後該清單可能的樣子：

<!--
```yaml
apiVersion: v1
data:
  color: blue
kind: ConfigMap
# You can leave the existing metadata as they are.
# The values you'll see won't exactly match these.
metadata:
  creationTimestamp: "2024-01-05T08:12:05Z"
  name: color
  namespace: configmap
  resourceVersion: "1801272"
  uid: 80d33e4a-cbb4-4bc9-ba8c-544c68e425d6
```
-->
```yaml
apiVersion: v1
data:
  color: blue
kind: ConfigMap
# 你可以保留現有的 metadata 不變。
# 你將看到的值與本例的值不會完全一樣。
metadata:
  creationTimestamp: "2024-01-05T08:12:05Z"
  name: color
  namespace: configmap
  resourceVersion: "1801272"
  uid: 80d33e4a-cbb4-4bc9-ba8c-544c68e425d6
```

<!--
Loop over the service URL for few seconds.

```shell
# Cancel this when you're happy with it (Ctrl-C)
while true; do curl --connect-timeout 7.5 http://localhost:8080; sleep 10; done
```

You should see the output change as follows:
-->
循環訪問服務 URL 幾秒鐘。

```shell
# 當你滿意時可以取消此操作（Ctrl-C）
while true; do curl --connect-timeout 7.5 http://localhost:8080; sleep 10; done
```

你應該會看到如下的輸出變化：

```
Fri Jan  5 08:14:00 UTC 2024 My preferred color is red
Fri Jan  5 08:14:02 UTC 2024 My preferred color is red
Fri Jan  5 08:14:20 UTC 2024 My preferred color is red
Fri Jan  5 08:14:22 UTC 2024 My preferred color is red
Fri Jan  5 08:14:32 UTC 2024 My preferred color is blue
Fri Jan  5 08:14:43 UTC 2024 My preferred color is blue
Fri Jan  5 08:15:00 UTC 2024 My preferred color is blue
```

<!--
## Update configuration via a ConfigMap in a Pod possessing a sidecar container {#rollout-configmap-sidecar}

The above scenario can be replicated by using a [Sidecar Container](/docs/concepts/workloads/pods/sidecar-containers/)
as a helper container to write the HTML file.
As a Sidecar Container is conceptually an Init Container, it is guaranteed to start before the main web server container.
This ensures that the HTML file is always available when the web server is ready to serve it.
-->
## 在包含邊車容器的 Pod 中通過 ConfigMap 更新設定    {#rollout-configmap-sidecar}

要重現上述場景，可以使用[邊車容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)作爲輔助容器來寫入
HTML 文件。由於邊車容器在概念上是一個 Init 容器，因此保證會在主要 Web 伺服器容器啓動之前啓動。
這確保了當 Web 伺服器準備好提供服務時，HTML 文件始終可用。

<!--
If you are continuing from the previous scenario, you can reuse the ConfigMap named `color` for this scenario.
If you are executing this scenario independently, use the `kubectl create configmap` command to create a ConfigMap
from [literal values](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):
-->
如果你從前一個場景繼續操作，你可以在此場景中重用名爲 `color` 的 ConfigMap。
如果你是獨立執行此場景，請使用 `kubectl create configmap`
命令基於[字面值](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values)創建一個
ConfigMap：

```shell
kubectl create configmap color --from-literal=color=blue
```

<!--
Below is an example manifest for a Deployment that manages a set of Pods, each with a main container and
a sidecar container. The two containers share an `emptyDir` volume that they use to communicate.
The main container runs a web server (NGINX). The mount path for the shared volume in the web server container
is `/usr/share/nginx/html`. The second container is a Sidecar Container based on Alpine Linux which acts as
a helper container. For this container the `emptyDir` volume is mounted at `/pod-data`. The Sidecar Container
writes a file in HTML that has its content based on a ConfigMap. The web server container serves the HTML via HTTP.
-->
以下是一個 Deployment 清單示例，該 Deployment 管理一組 Pod，每個 Pod 有一個主容器和一個邊車容器。
這兩個容器共享一個 `emptyDir` 卷並使用此捲來通信。主容器運行 Web 伺服器（NGINX）。
在 Web 伺服器容器中共享卷的掛載路徑是 `/usr/share/nginx/html`。
第二個容器是基於 Alpine Linux 作爲輔助容器的邊車容器。對於這個輔助容器，`emptyDir` 卷被掛載在 `/pod-data`。
邊車容器寫入一個 HTML 文件，其內容基於 ConfigMap。Web 伺服器容器通過 HTTP 提供此 HTML 文件。

{{% code_sample file="deployments/deployment-with-configmap-and-sidecar-container.yaml" %}}

<!--
Create the Deployment:
-->
創建此 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-and-sidecar-container.yaml
```

<!--
Check the pods for this Deployment to ensure they are ready (matching by
{{< glossary_tooltip text="selector" term_id="selector" >}}):
-->
檢查此 Deployment 的 Pod 以確保它們已就緒（通過{{< glossary_tooltip text="選擇算符" term_id="selector" >}}進行匹配）：

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-sidecar-container
```

<!--
You should see an output similar to:
-->
你應該會看到類似以下的輸出：

```
NAME                                           READY   STATUS    RESTARTS   AGE
configmap-sidecar-container-5fb59f558b-87rp7   2/2     Running   0          94s
configmap-sidecar-container-5fb59f558b-ccs7s   2/2     Running   0          94s
configmap-sidecar-container-5fb59f558b-wnmgk   2/2     Running   0          94s
```

<!--
Expose the Deployment (the `kubectl` tool creates a
{{<glossary_tooltip text="Service" term_id="service">}} for you):
-->
公開 Deployment（`kubectl` 工具會爲你創建一個 {{< glossary_tooltip text="Service" term_id="service" >}}）：

```shell
kubectl expose deployment configmap-sidecar-container --name=configmap-sidecar-service --port=8081 --target-port=80
```

<!--
Use `kubectl` to forward the port:

```shell
# this stays running in the background
kubectl port-forward service/configmap-sidecar-service 8081:8081 &
```

Access the service.
-->
使用 `kubectl` 轉發端口：

```shell
# 此命令將在後臺運行
kubectl port-forward service/configmap-sidecar-service 8081:8081 &
```

訪問服務：

```shell
curl http://localhost:8081
```

<!--
You should see an output similar to:
-->
你應該看到類似以下的輸出：

```
Sat Feb 17 13:09:05 UTC 2024 My preferred color is blue
```

<!--
Edit the ConfigMap:
-->
編輯 ConfigMap：

```shell
kubectl edit configmap color
```

<!--
In the editor that appears, change the value of key `color` from `blue` to `green`. Save your changes.
The kubectl tool updates the ConfigMap accordingly (if you see an error, try again).

Here's an example of how that manifest could look after you edit it:
-->
在出現的編輯器中，將鍵 `color` 的值從 `blue` 變更爲 `green`。
保存你的變更。kubectl 工具會相應地更新 ConfigMap（如果報錯，請重試）。

以下是你編輯後該清單可能的樣子：

<!--
```yaml
apiVersion: v1
data:
  color: green
kind: ConfigMap
# You can leave the existing metadata as they are.
# The values you'll see won't exactly match these.
metadata:
  creationTimestamp: "2024-02-17T12:20:30Z"
  name: color
  namespace: default
  resourceVersion: "1054"
  uid: e40bb34c-58df-4280-8bea-6ed16edccfaa
```
-->
```yaml
apiVersion: v1
data:
  color: green
kind: ConfigMap
# 你可以保留現有的 metadata 不變。
# 你將看到的值與本例的值不會完全一樣。
metadata:
  creationTimestamp: "2024-02-17T12:20:30Z"
  name: color
  namespace: default
  resourceVersion: "1054"
  uid: e40bb34c-58df-4280-8bea-6ed16edccfaa
```

<!--
Loop over the service URL for few seconds.

```shell
# Cancel this when you're happy with it (Ctrl-C)
while true; do curl --connect-timeout 7.5 http://localhost:8081; sleep 10; done
```

You should see the output change as follows:
-->
循環訪問服務 URL 幾秒鐘。

```shell
# 當你滿意時可以取消此操作 (Ctrl-C)
while true; do curl --connect-timeout 7.5 http://localhost:8081; sleep 10; done
```

你應該會看到如下的輸出變化：

```
Sat Feb 17 13:12:35 UTC 2024 My preferred color is blue
Sat Feb 17 13:12:45 UTC 2024 My preferred color is blue
Sat Feb 17 13:12:55 UTC 2024 My preferred color is blue
Sat Feb 17 13:13:05 UTC 2024 My preferred color is blue
Sat Feb 17 13:13:15 UTC 2024 My preferred color is green
Sat Feb 17 13:13:25 UTC 2024 My preferred color is green
Sat Feb 17 13:13:35 UTC 2024 My preferred color is green
```

<!--
## Update configuration via an immutable ConfigMap that is mounted as a volume {#rollout-configmap-immutable-volume}
-->
## 通過作爲卷掛載的不可變 ConfigMap 更新設定   {#rollout-configmap-immutable-volume}

{{< note >}}
<!--
Immutable ConfigMaps are especially used for configuration that is constant and is **not** expected
to change over time. Marking a ConfigMap as immutable allows a performance improvement where the kubelet does not watch for changes.

If you do need to make a change, you should plan to either:

- change the name of the ConfigMap, and switch to running Pods that reference the new name
- replace all the nodes in your cluster that have previously run a Pod that used the old value
- restart the kubelet on any node where the kubelet previously loaded the old ConfigMap
-->
不可變 ConfigMap 專門用於恆定且預期**不會**隨時間變化的設定。
將 ConfigMap 標記爲不可變可以提高性能，因爲 kubelet 不會監視變更。

如果你確實需要進行變更，你應計劃：

- 變更 ConfigMap 的名稱，並轉而運行引用新名稱的 Pod
- 替換叢集中之前運行使用舊值的 Pod 的所有節點
- 在任何之前加載過舊 ConfigMap 的節點上重新啓動 kubelet
{{< /note >}}

<!--
An example manifest for an [Immutable ConfigMap](/docs/concepts/configuration/configmap/#configmap-immutable) is shown below.
{{% code_sample file="configmap/immutable-configmap.yaml" %}}

Create the Immutable ConfigMap:
-->
以下是一個[不可變 ConfigMap](/zh-cn/docs/concepts/configuration/configmap/#configmap-immutable)的示例清單。

{{% code_sample file="configmap/immutable-configmap.yaml" %}}

創建不可變 ConfigMap：

```shell
kubectl apply -f https://k8s.io/examples/configmap/immutable-configmap.yaml
```

<!--
Below is an example of a Deployment manifest with the Immutable ConfigMap `company-name-20150801` mounted as a
{{< glossary_tooltip text="volume" term_id="volume" >}} into the Pod's only container.
-->
下面是一個 Deployment 清單示例，其中不可變 ConfigMap `company-name-20150801`
作爲{{< glossary_tooltip text="卷" term_id="volume" >}}掛載到 Pod 的唯一容器中。

{{% code_sample file="deployments/deployment-with-immutable-configmap-as-volume.yaml" %}}

<!--
Create the Deployment:
-->
創建此 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-immutable-configmap-as-volume.yaml
```

<!--
Check the pods for this Deployment to ensure they are ready (matching by
{{< glossary_tooltip text="selector" term_id="selector" >}}):
-->
檢查此 Deployment 的 Pod 以確保它們已就緒（通過{{< glossary_tooltip text="選擇算符" term_id="selector" >}}進行匹配）：

```shell
kubectl get pods --selector=app.kubernetes.io/name=immutable-configmap-volume
```

<!--
You should see an output similar to:
-->
你應該看到類似以下的輸出：

```
NAME                                          READY   STATUS    RESTARTS   AGE
immutable-configmap-volume-78b6fbff95-5gsfh   1/1     Running   0          62s
immutable-configmap-volume-78b6fbff95-7vcj4   1/1     Running   0          62s
immutable-configmap-volume-78b6fbff95-vdslm   1/1     Running   0          62s
```

<!--
The Pod's container refers to the data defined in the ConfigMap and uses it to print a report to stdout.
You can check this report by viewing the logs for one of the Pods in that Deployment:

```shell
# Pick one Pod that belongs to the Deployment, and view its logs
kubectl logs deployments/immutable-configmap-volume
```

You should see an output similar to:
-->
Pod 的容器引用 ConfigMap 中所定義的數據，並使用它將報告打印到標準輸出。
你可以通過查看 Deployment 中某個 Pod 的日誌來檢查此報告：

```shell
# 選擇屬於該 Deployment 的一個 Pod，並查看其日誌
kubectl logs deployments/immutable-configmap-volume
```

你應該會看到類似以下的輸出：

```
Found 3 pods, using pod/immutable-configmap-volume-78b6fbff95-5gsfh
Wed Mar 20 03:52:34 UTC 2024 The name of the company is ACME, Inc.
Wed Mar 20 03:52:44 UTC 2024 The name of the company is ACME, Inc.
Wed Mar 20 03:52:54 UTC 2024 The name of the company is ACME, Inc.
```

{{< note >}}
<!--
Once a ConfigMap is marked as immutable, it is not possible to revert this change
nor to mutate the contents of the data or the binaryData field.
In order to modify the behavior of the Pods that use this configuration,
you will create a new immutable ConfigMap and edit the Deployment
to define a slightly different pod template, referencing the new ConfigMap.
-->
一旦 ConfigMap 被標記爲不可變，就無法撤銷此變更，也無法修改 `data` 或 `binaryData` 字段的內容。
爲了修改使用此設定的 Pod 的行爲，你需要創建一個新的不可變 ConfigMap，並編輯 Deployment
以定義一個稍有不同的 Pod 模板，引用新的 ConfigMap。
{{< /note >}}

<!--
Create a new immutable ConfigMap by using the manifest shown below:
-->
通過使用下面所示的清單創建一個新的不可變 ConfigMap：

{{% code_sample file="configmap/new-immutable-configmap.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/configmap/new-immutable-configmap.yaml
```

<!--
You should see an output similar to:
-->
你應該看到類似以下的輸出：

```
configmap/company-name-20240312 created
```

<!--
Check the newly created ConfigMap:
-->
檢查新建的 ConfigMap：

```shell
kubectl get configmap
```

<!--
You should see an output displaying both the old and new ConfigMaps:
-->
你應該看到輸出會同時顯示新舊 ConfigMap：

```
NAME                    DATA   AGE
company-name-20150801   1      22m
company-name-20240312   1      24s
```

<!--
Modify the Deployment to reference the new ConfigMap.

Edit the Deployment:
-->
修改 Deployment 以引用新的 ConfigMap。

編輯 Deployment：

```shell
kubectl edit deployment immutable-configmap-volume
```

<!--
In the editor that appears, update the existing volume definition to use the new ConfigMap.

```yaml
volumes:
- configMap:
    defaultMode: 420
    name: company-name-20240312 # Update this field
  name: config-volume
```
-->
在出現的編輯器中，更新現有的卷定義以使用新的 ConfigMap。

```yaml
volumes:
- configMap:
    defaultMode: 420
    name: company-name-20240312 # 更新此字段
  name: config-volume
```

<!--
You should see the following output:
-->
你應該看到以下輸出：

```
deployment.apps/immutable-configmap-volume edited
```

<!--
This will trigger a rollout. Wait for all the previous Pods to terminate and the new Pods to be in a ready state.

Monitor the status of the Pods:
-->
這將觸發一次上線操作。等待所有先前的 Pod 終止並且新的 Pod 處於就緒狀態。

監控 Pod 的狀態：

```shell
kubectl get pods --selector=app.kubernetes.io/name=immutable-configmap-volume
```

```
NAME                                          READY   STATUS        RESTARTS   AGE
immutable-configmap-volume-5fdb88fcc8-29v8n   1/1     Running       0          13s
immutable-configmap-volume-5fdb88fcc8-52ddd   1/1     Running       0          14s
immutable-configmap-volume-5fdb88fcc8-n5jx4   1/1     Running       0          15s
immutable-configmap-volume-78b6fbff95-5gsfh   1/1     Terminating   0          32m
immutable-configmap-volume-78b6fbff95-7vcj4   1/1     Terminating   0          32m
immutable-configmap-volume-78b6fbff95-vdslm   1/1     Terminating   0          32m
```

<!--
You should eventually see an output similar to:
-->
最終，你應該會看到類似以下的輸出：

```
NAME                                          READY   STATUS    RESTARTS   AGE
immutable-configmap-volume-5fdb88fcc8-29v8n   1/1     Running   0          43s
immutable-configmap-volume-5fdb88fcc8-52ddd   1/1     Running   0          44s
immutable-configmap-volume-5fdb88fcc8-n5jx4   1/1     Running   0          45s
```

<!--
View the logs for a Pod in this Deployment:

```shell
# Pick one Pod that belongs to the Deployment, and view its logs
kubectl logs deployment/immutable-configmap-volume
```

You should see an output similar to the below:
-->
查看此 Deployment 中某個 Pod 的日誌：

```shell
# 選擇屬於此 Deployment 的一個 Pod，並查看其日誌
kubectl logs deployment/immutable-configmap-volume
```

你應該會看到類似下面的輸出：

```
Found 3 pods, using pod/immutable-configmap-volume-5fdb88fcc8-n5jx4
Wed Mar 20 04:24:17 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
Wed Mar 20 04:24:27 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
Wed Mar 20 04:24:37 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
```

<!--
Once all the deployments have migrated to use the new immutable ConfigMap, it is advised to delete the old one.
-->
建議一旦所有 Deployment 都遷移到使用新的不可變 ConfigMap，刪除舊的 ConfigMap。

```shell
kubectl delete configmap company-name-20150801
```

<!--
## Summary

Changes to a ConfigMap mounted as a Volume on a Pod are available seamlessly after the subsequent kubelet sync.

Changes to a ConfigMap that configures environment variables for a Pod are available after the subsequent rollout for the Pod.
-->
## 總結   {#summary}

在 Pod 上作爲卷掛載的 ConfigMap 所發生的變更將在後續的 kubelet 同步後無縫生效。

設定爲 Pod 環境變量的 ConfigMap 所發生變更將在後續的 Pod 上線操作後生效。

<!--
Once a ConfigMap is marked as immutable, it is not possible to revert this change
(you cannot make an immutable ConfigMap mutable), and you also cannot make any change
to the contents of the `data` or the `binaryData` field. You can delete and recreate
the ConfigMap, or you can make a new different ConfigMap. When you delete a ConfigMap,
running containers and their Pods maintain a mount point to any volume that referenced
that existing ConfigMap.
-->
一旦 ConfigMap 被標記爲不可變，就無法撤銷此變更（你不能將不可變的 ConfigMap 改爲可變），
並且你也不能對 `data` 或 `binaryData` 字段的內容進行任何變更。你可以刪除並重新創建 ConfigMap，
或者你可以創建一個新的不同的 ConfigMap。當你刪除 ConfigMap 時，
運行中的容器及其 Pod 將保持對引用了現有 ConfigMap 的任何卷的掛載點。

## {{% heading "cleanup" %}}

<!--
Terminate the `kubectl port-forward` commands in case they are running.

Delete the resources created during the tutorial:
-->
終止正在運行的 `kubectl port-forward` 命令。

刪除以上教程中所創建的資源：

<!--
```shell
kubectl delete deployment configmap-volume configmap-env-var configmap-two-containers configmap-sidecar-container immutable-configmap-volume
kubectl delete service configmap-service configmap-sidecar-service
kubectl delete configmap sport fruits color company-name-20240312

kubectl delete configmap company-name-20150801 # In case it was not handled during the task execution
```
-->
```shell
kubectl delete deployment configmap-volume configmap-env-var configmap-two-containers configmap-sidecar-container immutable-configmap-volume
kubectl delete service configmap-service configmap-sidecar-service
kubectl delete configmap sport fruits color company-name-20240312

kubectl delete configmap company-name-20150801 # 如果在任務執行期間未被處理
```
