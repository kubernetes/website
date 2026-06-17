---
title: 透過 ConfigMap 更新設定
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

本頁提供一個逐步範例，說明如何透過 ConfigMap 更新 Pod 內的設定，
並以[設定 Pod 使用 ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) 這項任務為基礎。
完成本教學後，您將了解如何變更執行中應用程式的設定。
本教學以 `alpine` 和 `nginx` 映像檔為例。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
You need to have the [curl](https://curl.se/) command-line tool for making HTTP requests from
the terminal or command prompt. If you do not have `curl` available, you can install it. Check the
documentation for your local operating system.
-->

您需要有 [curl](https://curl.se/) 命令列工具，才能從終端機或命令提示字元發出 HTTP 請求。
如果您的環境中沒有 `curl`，可以安裝此工具。請查看您本機作業系統的文件。

## {{% heading "objectives" %}}

<!--
* Update configuration via a ConfigMap mounted as a Volume
* Update environment variables of a Pod via a ConfigMap
* Update configuration via a ConfigMap in a multi-container Pod
* Update configuration via a ConfigMap in a Pod possessing a Sidecar Container
-->

- 透過掛載為卷的 ConfigMap 更新設定
- 透過 ConfigMap 更新 Pod 的環境變數
- 在多容器 Pod 中透過 ConfigMap 更新設定
- 在具備 Sidecar 容器的 Pod 中透過 ConfigMap 更新設定

<!-- lessoncontent -->

<!--
## Update configuration via a ConfigMap mounted as a Volume {#rollout-configmap-volume}

Use the `kubectl create configmap` command to create a ConfigMap from
[literal values](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):
-->

## 透過掛載為卷的 ConfigMap 更新設定 {#rollout-configmap-volume}

使用 `kubectl create configmap` 命令，從
[字面值](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values)
建立 ConfigMap：

```shell
kubectl create configmap sport --from-literal=sport=football
```

<!--
Below is an example of a Deployment manifest with the ConfigMap `sport` mounted as a
{{< glossary_tooltip text="volume" term_id="volume" >}} into the Pod's only container.
{{% code_sample file="deployments/deployment-with-configmap-as-volume.yaml" %}}

Create the Deployment:
-->

以下是一個 Deployment 設定檔範例，其中 ConfigMap `sport` 會以
{{< glossary_tooltip text="卷" term_id="volume" >}} 形式掛載到 Pod 中唯一的容器。

{{% code_sample file="deployments/deployment-with-configmap-as-volume.yaml" %}}

建立 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-as-volume.yaml
```

<!--
Check the pods for this Deployment to ensure they are ready (matching by
{{< glossary_tooltip text="selector" term_id="selector" >}}):
-->

檢查此 Deployment 的 Pod，確認它們已就緒（透過
{{< glossary_tooltip text="選擇器" term_id="selector" >}} 進行比對）：

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-volume
```

<!--
You should see an output similar to:
-->

您應該會看到類似以下的輸出：

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

在每個執行其中一個 Pod 的節點上，kubelet 會取得該 ConfigMap 的資料，
並將其轉換為本機卷中的檔案。
接著 kubelet 會依照 Pod 範本中的指定方式，將該卷掛載到容器。
在該容器中執行的程式碼會從檔案載入資訊，
並用這些資訊將報告列印到標準輸出。
您可以檢視該 Deployment 中某個 Pod 的日誌來檢查這份報告：

<!--
```shell
# Pick one Pod that belongs to the Deployment, and view its logs
kubectl logs deployments/configmap-volume
```

You should see an output similar to:
-->

```shell
# 選擇屬於此 Deployment 的其中一個 Pod，並檢視其日誌
kubectl logs deployments/configmap-volume
```

您應該會看到類似以下的輸出：

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

在出現的編輯器中，將鍵 `sport` 的值從 `football` 變更為 `cricket`。儲存您的變更。
kubectl 工具會相應地更新 ConfigMap（如果看到錯誤，請再試一次）。

以下是編輯後該設定檔可能呈現的樣子：

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
# 您可以保留既有 metadata 不變。
# 您會看到的值不會與這些範例值完全相同。
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

您應該會看到以下輸出：

```
configmap/sport edited
```

<!--
Tail (follow the latest entries in) the logs of one of the pods that belongs to this Deployment:
-->

追蹤屬於此 Deployment 的某個 Pod 的日誌（持續查看最新寫入的項目）：

```shell
kubectl logs deployments/configmap-volume --follow
```

<!--
After few seconds, you should see the log output change as follows:
-->

幾秒鐘後，您應該會看到日誌輸出如下變化：

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

當某個 ConfigMap 透過 `configMap` 卷或 `projected` 卷映射到執行中的 Pod，
而您更新該 ConfigMap 時，執行中的 Pod 幾乎會立即看到更新。
不過，只有當您的應用程式會輪詢變更或監看檔案更新時，才會看到這項變更。
如果應用程式只在啟動時載入一次設定，就不會察覺這項變更。

{{< note >}}

<!--
The total delay from the moment when the ConfigMap is updated to the moment when
new keys are projected to the Pod can be as long as kubelet sync period.
Also check [Mounted ConfigMaps are updated automatically](/docs/tasks/configure-pod-container/configure-pod-configmap/#mounted-configmaps-are-updated-automatically).
-->

從 ConfigMap 更新到新的鍵被投射到 Pod 之間的總延遲，最長可能長達 kubelet 的同步週期。
另請參閱[掛載的 ConfigMap 會自動更新](/docs/tasks/configure-pod-container/configure-pod-configmap/#mounted-configmaps-are-updated-automatically)。
{{< /note >}}

<!--
## Update environment variables of a Pod via a ConfigMap {#rollout-configmap-env}

Use the `kubectl create configmap` command to create a ConfigMap from
[literal values](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):
-->

## 透過 ConfigMap 更新 Pod 的環境變數 {#rollout-configmap-env}

使用 `kubectl create configmap` 命令，從
[字面值](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values)
建立 ConfigMap：

```shell
kubectl create configmap fruits --from-literal=fruits=apples
```

<!--
Below is an example of a Deployment manifest with an environment variable configured via the ConfigMap `fruits`.
-->

以下是一個 Deployment 設定檔範例，其中包含透過 ConfigMap `fruits` 設定的環境變數。

{{% code_sample file="deployments/deployment-with-configmap-as-envvar.yaml" %}}

<!--
Create the Deployment:
-->

建立 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-as-envvar.yaml
```

<!--
Check the pods for this Deployment to ensure they are ready (matching by
{{< glossary_tooltip text="selector" term_id="selector" >}}):
-->

檢查此 Deployment 的 Pod，確認它們已就緒（透過
{{< glossary_tooltip text="選擇器" term_id="selector" >}} 進行比對）：

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-env-var
```

<!--
You should see an output similar to:
-->

您應該會看到類似以下的輸出：

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

ConfigMap 中的鍵值對會被設定為 Pod 內容器的環境變數。
請檢視屬於該 Deployment 的某個 Pod 的日誌來確認。

```shell
kubectl logs deployment/configmap-env-var
```

<!--
You should see an output similar to:
-->

您應該會看到類似以下的輸出：

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

在出現的編輯器中，將鍵 `fruits` 的值從 `apples` 變更為 `mangoes`。儲存您的變更。
kubectl 工具會相應地更新 ConfigMap（如果看到錯誤，請再試一次）。

以下是編輯後該設定檔可能呈現的樣子：

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
# 您可以保留既有 metadata 不變。
# 您會看到的值不會與這些範例值完全相同。
metadata:
  creationTimestamp: "2024-01-04T16:04:19Z"
  name: fruits
  namespace: default
  resourceVersion: "1749472"
```

<!--
You should see the following output:
-->

您應該會看到以下輸出：

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

追蹤 Deployment 的日誌，並觀察幾秒鐘的輸出：

```shell
# 如文字所述，輸出不會變更
kubectl logs deployments/configmap-env-var --follow
```

請注意，即使您已經編輯 ConfigMap，輸出仍然**不變**：

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

雖然 ConfigMap 中鍵的值已經變更，Pod 中的環境變數仍會顯示先前的值。
這是因為當來源資料變更時，Pod 內執行中程式的環境變數**不會**更新；
如果您想要強制更新，就需要讓 Kubernetes 替換既有的 Pod。
新的 Pod 會使用更新後的資訊執行。
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

您可以觸發這項替換。使用
[`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/)
對 Deployment 執行 rollout：

```shell
# 觸發 rollout
kubectl rollout restart deployment configmap-env-var

# 等待 rollout 完成
kubectl rollout status deployment configmap-env-var --watch=true
```

接著，檢查 Deployment：

```shell
kubectl get deployment configmap-env-var
```

<!--
You should see an output similar to:
-->

您應該會看到類似以下的輸出：

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

rollout 會使 Kubernetes 為 Deployment 建立新的
{{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}；
這表示既有 Pod 最終會終止，並建立新的 Pod。
幾秒鐘後，您應該會看到類似以下的輸出：

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

請等待較舊的 Pod 完全終止後，再繼續下一步。
{{< /note >}}

<!--
View the logs for a Pod in this Deployment:

```shell
# Pick one Pod that belongs to the Deployment, and view its logs
kubectl logs deployment/configmap-env-var
```

You should see an output similar to the below:
-->

檢視此 Deployment 中某個 Pod 的日誌：

```shell
# 選擇屬於此 Deployment 的其中一個 Pod，並檢視其日誌
kubectl logs deployment/configmap-env-var
```

您應該會看到類似以下的輸出：

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

這示範了更新 Pod 中由 ConfigMap 衍生而來的環境變數的情境。
ConfigMap 值的變更會在後續 rollout 期間套用到 Pod。
如果 Pod 因其他原因而被建立，例如擴展 Deployment，新的 Pod 也會使用最新的設定值；
如果您沒有觸發 rollout，可能會發現您的應用程式正在混用新舊環境變數值。

<!--
## Update configuration via a ConfigMap in a multi-container Pod {#rollout-configmap-multiple-containers}

Use the `kubectl create configmap` command to create a ConfigMap from
[literal values](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):
-->

## 在多容器 Pod 中透過 ConfigMap 更新設定 {#rollout-configmap-multiple-containers}

使用 `kubectl create configmap` 命令，從
[字面值](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values)
建立 ConfigMap：

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

以下是一個 Deployment 設定檔範例，該 Deployment 管理一組 Pod，每個 Pod 都有兩個容器。
這兩個容器共享一個 `emptyDir` 卷，並透過此卷互相通訊。
第一個容器執行 Web 伺服器（`nginx`）。在 Web 伺服器容器中，共享卷的掛載路徑是
`/usr/share/nginx/html`。第二個輔助容器以 `alpine` 為基礎，
且這個容器會將 `emptyDir` 卷掛載到 `/pod-data`。
輔助容器會寫入一個 HTML 檔案，其內容依據 ConfigMap 產生。
Web 伺服器容器會透過 HTTP 提供這個 HTML。

{{% code_sample file="deployments/deployment-with-configmap-two-containers.yaml" %}}

<!--
Create the Deployment:
-->

建立 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-two-containers.yaml
```

<!--
Check the pods for this Deployment to ensure they are ready (matching by
{{< glossary_tooltip text="selector" term_id="selector" >}}):
-->

檢查此 Deployment 的 Pod，確認它們已就緒（透過
{{< glossary_tooltip text="選擇器" term_id="selector" >}} 進行比對）：

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-two-containers
```

<!--
You should see an output similar to:
-->

您應該會看到類似以下的輸出：

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

公開 Deployment（`kubectl` 工具會為您建立
{{<glossary_tooltip text="Service" term_id="service">}}）：

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

使用 `kubectl` 轉送連接埠：

```shell
# 此命令會持續在背景執行
kubectl port-forward service/configmap-service 8080:8080 &
```

存取此服務。

```shell
curl http://localhost:8080
```

<!--
You should see an output similar to:
-->

您應該會看到類似以下的輸出：

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

在出現的編輯器中，將鍵 `color` 的值從 `red` 變更為 `blue`。儲存您的變更。
kubectl 工具會相應地更新 ConfigMap（如果看到錯誤，請再試一次）。

以下是編輯後該設定檔可能呈現的樣子：

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
# 您可以保留既有 metadata 不變。
# 您會看到的值不會與這些範例值完全相同。
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

輪尋訪問服務 URL 幾秒鐘。

```shell
# 當您覺得可以時取消此操作（Ctrl-C）
while true; do curl --connect-timeout 7.5 http://localhost:8080; sleep 10; done
```

您應該會看到輸出如下變化：

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

If you are continuing from the previous scenario, you can reuse the ConfigMap named `color` for this scenario.
If you are executing this scenario independently, use the `kubectl create configmap` command to create a ConfigMap
from [literal values](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values):
-->

## 在具備 Sidecar 容器的 Pod 中透過 ConfigMap 更新設定 {#rollout-configmap-sidecar}

上述情境可以使用 [Sidecar 容器](/docs/concepts/workloads/pods/sidecar-containers/)
作為輔助容器來寫入 HTML 檔案，以重現相同效果。
由於 Sidecar 容器在概念上是一種 Init 容器，因此保證會在主要 Web 伺服器容器之前啟動。
這可確保當 Web 伺服器準備好提供服務時，HTML 檔案一律可用。

如果您是接續前一個情境操作，可以在此情境中重複使用名為 `color` 的 ConfigMap。
如果您是獨立執行此情境，請使用 `kubectl create configmap` 命令，從
[字面值](/docs/tasks/configure-pod-container/configure-pod-configmap/#create-configmaps-from-literal-values)
建立 ConfigMap：

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

以下是一個 Deployment 設定檔範例，該 Deployment 管理一組 Pod，
每個 Pod 都有一個主要容器和一個 Sidecar 容器。
這兩個容器共享一個 `emptyDir` 卷，並透過此卷互相通訊。
主要容器執行 Web 伺服器（NGINX）。在 Web 伺服器容器中，共享卷的掛載路徑是
`/usr/share/nginx/html`。第二個容器是以 Alpine Linux 為基礎的 Sidecar 容器，並作為輔助容器。
對於這個容器，`emptyDir` 卷會掛載到 `/pod-data`。
Sidecar 容器會寫入一個 HTML 檔案，其內容依據 ConfigMap 產生。
Web 伺服器容器會透過 HTTP 提供這個 HTML。

{{% code_sample file="deployments/deployment-with-configmap-and-sidecar-container.yaml" %}}

<!--
Create the Deployment:
-->

建立 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-configmap-and-sidecar-container.yaml
```

<!--
Check the pods for this Deployment to ensure they are ready (matching by
{{< glossary_tooltip text="selector" term_id="selector" >}}):
-->

檢查此 Deployment 的 Pod，確認它們已就緒（透過
{{< glossary_tooltip text="選擇器" term_id="selector" >}} 進行比對）：

```shell
kubectl get pods --selector=app.kubernetes.io/name=configmap-sidecar-container
```

<!--
You should see an output similar to:
-->

您應該會看到類似以下的輸出：

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

公開 Deployment（`kubectl` 工具會為您建立
{{<glossary_tooltip text="Service" term_id="service">}}）：

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

使用 `kubectl` 轉送連接埠：

```shell
# 此命令會持續在背景執行
kubectl port-forward service/configmap-sidecar-service 8081:8081 &
```

存取此服務。

```shell
curl http://localhost:8081
```

<!--
You should see an output similar to:
-->

您應該會看到類似以下的輸出：

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

在出現的編輯器中，將鍵 `color` 的值從 `blue` 變更為 `green`。儲存您的變更。
kubectl 工具會相應地更新 ConfigMap（如果看到錯誤，請再試一次）。

以下是編輯後該設定檔可能呈現的樣子：

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
# 您可以保留既有 metadata 不變。
# 您會看到的值不會與這些範例值完全相同。
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

對服務 URL 執行幾秒鐘的輪詢。

```shell
# 確認結果後可取消此命令（Ctrl-C）
while true; do curl --connect-timeout 7.5 http://localhost:8081; sleep 10; done
```

您應該會看到輸出如下變化：

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

## 透過掛載為卷的不可變 ConfigMap 更新設定 {#rollout-configmap-immutable-volume}

{{< note >}}

<!--
Immutable ConfigMaps are especially used for configuration that is constant and is **not** expected
to change over time. Marking a ConfigMap as immutable allows a performance improvement where the kubelet does not watch for changes.

If you do need to make a change, you should plan to either:

- change the name of the ConfigMap, and switch to running Pods that reference the new name
- replace all the nodes in your cluster that have previously run a Pod that used the old value
- restart the kubelet on any node where the kubelet previously loaded the old ConfigMap
-->

不可變 ConfigMap 特別適合用於固定且預期**不會**隨時間變更的設定。
將 ConfigMap 標記為不可變可提升效能，因為 kubelet 不需要監看變更。

如果您確實需要進行變更，應規劃採取以下其中一種做法：

- 變更 ConfigMap 的名稱，並改為執行參照新名稱的 Pod
- 替換叢集中所有曾執行使用舊值之 Pod 的節點
- 在先前載入舊 ConfigMap 的任何節點上重新啟動 kubelet
  {{< /note >}}

<!--
An example manifest for an [Immutable ConfigMap](/docs/concepts/configuration/configmap/#configmap-immutable) is shown below.
{{% code_sample file="configmap/immutable-configmap.yaml" %}}

Create the Immutable ConfigMap:
-->

以下顯示一個[不可變 ConfigMap](/docs/concepts/configuration/configmap/#configmap-immutable) 的設定檔範例。

{{% code_sample file="configmap/immutable-configmap.yaml" %}}

建立不可變 ConfigMap：

```shell
kubectl apply -f https://k8s.io/examples/configmap/immutable-configmap.yaml
```

<!--
Below is an example of a Deployment manifest with the Immutable ConfigMap `company-name-20150801` mounted as a
{{< glossary_tooltip text="volume" term_id="volume" >}} into the Pod's only container.

{{% code_sample file="deployments/deployment-with-immutable-configmap-as-volume.yaml" %}}

Create the Deployment:
-->

以下是一個 Deployment 設定檔範例，其中不可變 ConfigMap `company-name-20150801`
會以 {{< glossary_tooltip text="卷" term_id="volume" >}} 形式掛載到 Pod 中唯一的容器。

{{% code_sample file="deployments/deployment-with-immutable-configmap-as-volume.yaml" %}}

建立 Deployment：

```shell
kubectl apply -f https://k8s.io/examples/deployments/deployment-with-immutable-configmap-as-volume.yaml
```

<!--
Check the pods for this Deployment to ensure they are ready (matching by
{{< glossary_tooltip text="selector" term_id="selector" >}}):
-->

檢查此 Deployment 的 Pod，確認它們已就緒（透過
{{< glossary_tooltip text="選擇器" term_id="selector" >}} 進行比對）：

```shell
kubectl get pods --selector=app.kubernetes.io/name=immutable-configmap-volume
```

<!--
You should see an output similar to:
-->

您應該會看到類似以下的輸出：

```
NAME                                          READY   STATUS    RESTARTS   AGE
immutable-configmap-volume-78b6fbff95-5gsfh   1/1     Running   0          62s
immutable-configmap-volume-78b6fbff95-7vcj4   1/1     Running   0          62s
immutable-configmap-volume-78b6fbff95-vdslm   1/1     Running   0          62s
```

<!--
The Pod's container refers to the data defined in the ConfigMap and uses it to print a report to stdout.
You can check this report by viewing the logs for one of the Pods in that Deployment:
-->

Pod 的容器會參照 ConfigMap 中定義的資料，並用這些資料將報告列印到標準輸出。
您可以檢視該 Deployment 中某個 Pod 的日誌來檢查這份報告：

<!--
```shell
# Pick one Pod that belongs to the Deployment, and view its logs
kubectl logs deployments/immutable-configmap-volume
```

You should see an output similar to:
-->

```shell
# 選擇屬於此 Deployment 的其中一個 Pod，並檢視其日誌
kubectl logs deployments/immutable-configmap-volume
```

您應該會看到類似以下的輸出：

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

一旦 ConfigMap 被標記為不可變，就無法還原這項變更，
也無法修改 `data` 或 `binaryData` 欄位的內容。
若要修改使用此設定之 Pod 的行為，
您需要建立新的不可變 ConfigMap，並編輯 Deployment
以定義略有不同的 Pod 範本，讓它參照新的 ConfigMap。
{{< /note >}}

<!--
Create a new immutable ConfigMap by using the manifest shown below:

{{% code_sample file="configmap/new-immutable-configmap.yaml" %}}
-->

使用以下所示的設定檔建立新的不可變 ConfigMap：

{{% code_sample file="configmap/new-immutable-configmap.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/configmap/new-immutable-configmap.yaml
```

<!--
You should see an output similar to:
-->

您應該會看到類似以下的輸出：

```
configmap/company-name-20240312 created
```

<!--
Check the newly created ConfigMap:
-->

檢查新建立的 ConfigMap：

```shell
kubectl get configmap
```

<!--
You should see an output displaying both the old and new ConfigMaps:
-->

您應該會看到同時顯示舊 ConfigMap 與新 ConfigMap 的輸出：

```
NAME                    DATA   AGE
company-name-20150801   1      22m
company-name-20240312   1      24s
```

<!--
Modify the Deployment to reference the new ConfigMap.

Edit the Deployment:
-->

修改 Deployment，使其參照新的 ConfigMap。

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

在出現的編輯器中，更新既有的卷定義以使用新的 ConfigMap。

```yaml
volumes:
  - configMap:
      defaultMode: 420
      name: company-name-20240312 # 更新此欄位
    name: config-volume
```

<!--
You should see the following output:
-->

您應該會看到以下輸出：

```
deployment.apps/immutable-configmap-volume edited
```

<!--
This will trigger a rollout. Wait for all the previous Pods to terminate and the new Pods to be in a ready state.

Monitor the status of the Pods:
-->

這會觸發 rollout。請等待所有先前的 Pod 終止，並等待新的 Pod 進入就緒狀態。

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

您最後應該會看到類似以下的輸出：

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

檢視此 Deployment 中某個 Pod 的日誌：

```shell
# 選擇屬於此 Deployment 的其中一個 Pod，並檢視其日誌
kubectl logs deployment/immutable-configmap-volume
```

您應該會看到類似以下的輸出：

```
Found 3 pods, using pod/immutable-configmap-volume-5fdb88fcc8-n5jx4
Wed Mar 20 04:24:17 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
Wed Mar 20 04:24:27 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
Wed Mar 20 04:24:37 UTC 2024 The name of the company is Fiktivesunternehmen GmbH
```

<!--
Once all the deployments have migrated to use the new immutable ConfigMap, it is advised to delete the old one.
-->

所有 Deployment 都遷移為使用新的不可變 ConfigMap 後，建議刪除舊的 ConfigMap。

```shell
kubectl delete configmap company-name-20150801
```

<!--
## Summary

Changes to a ConfigMap mounted as a Volume on a Pod are available seamlessly after the subsequent kubelet sync.

Changes to a ConfigMap that configures environment variables for a Pod are available after the subsequent rollout for the Pod.

Once a ConfigMap is marked as immutable, it is not possible to revert this change
(you cannot make an immutable ConfigMap mutable), and you also cannot make any change
to the contents of the `data` or the `binaryData` field. You can delete and recreate
the ConfigMap, or you can make a new different ConfigMap. When you delete a ConfigMap,
running containers and their Pods maintain a mount point to any volume that referenced
that existing ConfigMap.
-->

## 摘要

若 ConfigMap 以卷形式掛載至 Pod，其變更會在後續 kubelet 同步後自動可用。

用來設定 Pod 環境變數的 ConfigMap，其變更會在後續 rollout 後套用至新的 Pod。。

一旦 ConfigMap 被標記為不可變，就無法還原這項變更
（您無法讓不可變 ConfigMap 再次變為可變），也無法對 `data` 或 `binaryData` 欄位的內容進行任何變更。
您可以刪除並重新建立 ConfigMap，或建立另一個不同的 ConfigMap。
當您刪除 ConfigMap 時，執行中的容器及其 Pod 會維持對任何曾參照該既有 ConfigMap 之卷的掛載點。

## {{% heading "cleanup" %}}

<!--
Terminate the `kubectl port-forward` commands in case they are running.

Delete the resources created during the tutorial:
-->

如果 `kubectl port-forward` 命令仍在執行，請終止它們。

刪除本教學期間建立的資源：

```shell
kubectl delete deployment configmap-volume configmap-env-var configmap-two-containers configmap-sidecar-container immutable-configmap-volume
kubectl delete service configmap-service configmap-sidecar-service
kubectl delete configmap sport fruits color company-name-20240312

kubectl delete configmap company-name-20150801 # 若在任務執行期間尚未處理
```
