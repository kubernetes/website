---
title: HorizontalPodAutoscaler 演練
content_type: task
weight: 100
min-kubernetes-server-version: 1.23
---

<!--
reviewers:
- fgrzadkowski
- jszczepkowski
- justinsb
- directxman12
title: Horizontal Pod Autoscaler Walkthrough
content_type: task
weight: 100
min-kubernetes-server-version: 1.23
-->

<!-- overview -->

<!--
A [HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/)
(HPA for short)
automatically updates a workload resource (such as
a {{< glossary_tooltip text="Deployment" term_id="deployment" >}} or
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}), with the
aim of automatically scaling the workload to match demand.

Horizontal scaling means that the response to increased load is to deploy more
{{< glossary_tooltip text="Pods" term_id="pod" >}}.
This is different from _vertical_ scaling, which for Kubernetes would mean
assigning more resources (for example: memory or CPU) to the Pods that are already
running for the workload.
-->
[HorizontalPodAutoscaler](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/)（簡稱 HPA ）
自動更新工作負載資源（例如 {{< glossary_tooltip text="Deployment" term_id="deployment" >}} 或者
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}），
目的是自動擴縮工作負載以滿足需求。

水平擴縮意味着對增加的負載的響應是部署更多的 {{< glossary_tooltip text="Pod" term_id="pod" >}}。
這與“垂直（Vertical）”擴縮不同，對於 Kubernetes，
垂直擴縮意味着將更多資源（例如：內存或 CPU）分配給已經爲工作負載運行的 Pod。

<!--
If the load decreases, and the number of Pods is above the configured minimum,
the HorizontalPodAutoscaler instructs the workload resource (the Deployment, StatefulSet,
or other similar resource) to scale back down.

This document walks you through an example of enabling HorizontalPodAutoscaler to
automatically manage scale for an example web app. This example workload is Apache
httpd running some PHP code.
-->
如果負載減少，並且 Pod 的數量高於配置的最小值，
HorizontalPodAutoscaler 會指示工作負載資源（Deployment、StatefulSet 或其他類似資源）縮減。

本文檔將引導你完成啓用 HorizontalPodAutoscaler 以自動管理示例 Web 應用程序的擴縮的示例。
此示例工作負載是運行一些 PHP 代碼的 Apache httpd。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
If you're running an older release of Kubernetes, refer to the version of the documentation for that release (see
[available documentation versions](/docs/home/supported-doc-versions/)).
-->
如果你運行的是舊版本的 Kubernetes，請參閱該版本的文檔版本
（[可用的文檔版本](/zh-cn/docs/home/supported-doc-versions/)）。

<!--
To follow this walkthrough, you also need to use a cluster that has a
[Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme) deployed and configured.
The Kubernetes Metrics Server collects resource metrics from
the {{<glossary_tooltip term_id="kubelet" text="kubelets">}} in your cluster, and exposes those metrics
through the [Kubernetes API](/docs/concepts/overview/kubernetes-api/),
using an [APIService](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) to add
new kinds of resource that represent metric readings.

To learn how to deploy the Metrics Server, see the
[metrics-server documentation](https://github.com/kubernetes-sigs/metrics-server#deployment).
-->
按照本演練進行操作，你需要一個部署並配置了
[Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme) 的集羣。
Kubernetes Metrics Server 從集羣中的 {{<glossary_tooltip term_id="kubelet" text="kubelets">}} 收集資源指標，
並通過 [Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/) 公開這些指標，
使用 [APIService](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) 添加代表指標讀數的新資源。

要了解如何部署 Metrics Server，請參閱
[metrics-server 文檔](https://github.com/kubernetes-sigs/metrics-server#deployment)。

<!--
If you are running {{< glossary_tooltip term_id="minikube" >}}, run the following command to enable metrics-server:
-->
如果你正在運行 {{< glossary_tooltip term_id="minikube" >}}，運行以下命令以啓用 metrics-server：

```shell
minikube addons enable metrics-server
```

<!-- steps -->

<!--
## Run and expose php-apache server
-->
## 運行 php-apache 服務器並暴露服務 {#run-and-expose-php-apache-server}

<!--
To demonstrate a HorizontalPodAutoscaler, you will first start a Deployment that runs a container using the
`hpa-example` image, and expose it as a {{< glossary_tooltip term_id="service">}}
using the following manifest:
-->
爲了演示 HorizontalPodAutoscaler，你將首先啓動一個 Deployment 用 `hpa-example` 鏡像運行一個容器，
然後使用以下清單文件將其暴露爲一個 {{< glossary_tooltip term_id="service">}}：

{{% code_sample file="application/php-apache.yaml" %}}

<!--
To do so, run the following command:
-->
爲此，運行下面的命令：

```shell
kubectl apply -f https://k8s.io/examples/application/php-apache.yaml
```

```
deployment.apps/php-apache created
service/php-apache created
```

<!--
## Create the HorizontalPodAutoscaler {#create-horizontal-pod-autoscaler}

Now that the server is running, create the autoscaler using `kubectl`. The
[`kubectl autoscale`](/docs/reference/generated/kubectl/kubectl-commands#autoscale) subcommand,
part of `kubectl`, helps you do this.

You will shortly run a command that creates a HorizontalPodAutoscaler that maintains
between 1 and 10 replicas of the Pods controlled by the php-apache Deployment that
you created in the first step of these instructions.

Roughly speaking, the HPA {{<glossary_tooltip text="controller" term_id="controller">}} will increase and decrease
the number of replicas (by updating the Deployment) to maintain an average CPU utilization across all Pods of 50%.
The Deployment then updates the ReplicaSet - this is part of how all Deployments work in Kubernetes -
and then the ReplicaSet either adds or removes Pods based on the change to its `.spec`.

Since each pod requests 200 milli-cores by `kubectl run`, this means an average CPU usage of 100 milli-cores.
See [Algorithm details](/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details) for more details
on the algorithm.
-->
## 創建 HorizontalPodAutoscaler  {#create-horizontal-pod-autoscaler}

現在服務器正在運行，使用 `kubectl` 創建自動擴縮器。
[`kubectl autoscale`](/docs/reference/generated/kubectl/kubectl-commands#autoscale) 子命令是 `kubectl` 的一部分，
可以幫助你執行此操作。

你將很快運行一個創建 HorizontalPodAutoscaler 的命令，
該 HorizontalPodAutoscaler 維護由你在這些說明的第一步中創建的 php-apache Deployment 控制的 Pod 存在 1 到 10 個副本。

粗略地說，HPA {{<glossary_tooltip text="控制器" term_id="controller">}}將增加和減少副本的數量
（通過更新 Deployment）以保持所有 Pod 的平均 CPU 利用率爲 50%。
Deployment 然後更新 ReplicaSet —— 這是所有 Deployment 在 Kubernetes 中工作方式的一部分 ——
然後 ReplicaSet 根據其 `.spec` 的更改添加或刪除 Pod。

由於每個 Pod 通過 `kubectl run` 請求 200 milli-cores，這意味着平均 CPU 使用率爲 100 milli-cores。
有關算法的更多詳細信息，
請參閱[算法詳細信息](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details)。


<!-- 
Create the HorizontalPodAutoscaler:
 -->
創建 HorizontalPodAutoscaler：

```shell
kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=10
```

```
horizontalpodautoscaler.autoscaling/php-apache autoscaled
```

<!--
You can check the current status of the newly-made HorizontalPodAutoscaler, by running:
-->
你可以通過運行以下命令檢查新制作的 HorizontalPodAutoscaler 的當前狀態：

<!--# You can use "hpa" or "horizontalpodautoscaler"; either name works OK. -->
```shell
# 你可以使用 “hpa” 或 “horizontalpodautoscaler”；任何一個名字都可以。
kubectl get hpa
```

<!--
The output is similar to:
-->
輸出類似於：

```
NAME         REFERENCE                     TARGET    MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%  1         10        1          18s

```

<!--
(if you see other HorizontalPodAutoscalers with different names, that means they already existed,
and isn't usually a problem).
-->
（如果你看到其他具有不同名稱的 HorizontalPodAutoscalers，這意味着它們已經存在，這通常不是問題）。

<!--
Please note that the current CPU consumption is 0% as there are no clients sending requests to the server
(the ``TARGET`` column shows the average across all the Pods controlled by the corresponding deployment).
-->
請注意當前的 CPU 利用率是 0%，這是由於我們尚未發送任何請求到服務器
（``TARGET`` 列顯示了相應 Deployment 所控制的所有 Pod 的平均 CPU 利用率）。

<!--
## Increase the load {#increase-load}

Next, see how the autoscaler reacts to increased load.
To do this, you'll start a different Pod to act as a client. The container within the client Pod
runs in an infinite loop, sending queries to the php-apache service.
-->
## 增加負載  {#increase-load}

接下來，看看自動擴縮器如何對增加的負載做出反應。
爲此，你將啓動一個不同的 Pod 作爲客戶端。
客戶端 Pod 中的容器在無限循環中運行，向 php-apache 服務發送查詢。

<!--
# Run this in a separate terminal
# so that the load generation continues and you can carry on with the rest of the steps
-->
```shell
# 在單獨的終端中運行它
# 以便負載生成繼續，你可以繼續執行其餘步驟
kubectl run -i --tty load-generator --rm --image=busybox:1.28 --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://php-apache; done"
```

<!--
Now run:

Within a minute or so, you should see the higher CPU load; for example:
-->
現在執行：

<!-- # type Ctrl+C to end the watch when you're ready -->
```shell
# 準備好後按 Ctrl+C 結束觀察
kubectl get hpa php-apache --watch
```

一分鐘時間左右之後，通過以下命令，我們可以看到 CPU 負載升高了；例如：

```
NAME         REFERENCE                     TARGET      MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  1         10        1          3m
```

<!--
and then, more replicas. For example:
-->
然後，更多的副本被創建。例如：

```
NAME         REFERENCE                     TARGET      MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  1         10        7          3m
```

<!--
Here, CPU consumption has increased to 305% of the request.
As a result, the Deployment was resized to 7 replicas:
-->
這時，由於請求增多，CPU 利用率已經升至請求值的 305%。
可以看到，Deployment 的副本數量已經增長到了 7：

```shell
kubectl get deployment php-apache
```

<!--
You should see the replica count matching the figure from the HorizontalPodAutoscaler
-->
你應該會看到與 HorizontalPodAutoscaler 中的數字與副本數匹配

```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   7/7      7           7           19m
```

<!--
It may take a few minutes to stabilize the number of replicas. Since the amount
of load is not controlled in any way it may happen that the final number of replicas
will differ from this example.
-->
{{< note >}}
有時最終副本的數量可能需要幾分鐘才能穩定下來。由於環境的差異，
不同環境中最終的副本數量可能與本示例中的數量不同。
{{< /note >}}

<!--
## Stop generating load {#stop-load}

To finish the example, stop sending the load.

In the terminal where you created the Pod that runs a `busybox` image, terminate
the load generation by typing `<Ctrl> + C`.

Then verify the result state (after a minute or so):
-->
## 停止產生負載 {#stop-load}

要完成該示例，請停止發送負載。

在我們創建 `busybox` 容器的終端中，輸入 `<Ctrl> + C` 來終止負載的產生。

然後驗證結果狀態（大約一分鐘後）：

<!-- # type Ctrl+C to end the watch when you're ready -->
```shell
# 準備好後按 Ctrl+C 結束觀察
kubectl get hpa php-apache --watch
```

<!-- The output is similar to: -->
輸出類似於：

```
NAME         REFERENCE                     TARGET       MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%     1         10        1          11m
```

<!--
and the Deployment also shows that it has scaled down:
-->
Deployment 也顯示它已經縮小了：

```shell
kubectl get deployment php-apache
```

```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   1/1     1            1           27m
```

<!--
Once CPU utilization dropped to 0, the HPA automatically scaled the number of replicas back down to 1.
-->
一旦 CPU 利用率降至 0，HPA 會自動將副本數縮減爲 1。

<!--
Autoscaling the replicas may take a few minutes.
-->
自動擴縮完成副本數量的改變可能需要幾分鐘的時間。

<!-- discussion -->

<!--
## Autoscaling on multiple metrics and custom metrics

You can introduce additional metrics to use when autoscaling the `php-apache` Deployment
by making use of the `autoscaling/v2` API version.
-->
## 基於多項度量指標和自定義度量指標自動擴縮 {#autoscaling-on-multiple-metrics-and-custom-metrics}

利用 `autoscaling/v2` API 版本，你可以在自動擴縮 php-apache 這個
Deployment 時使用其他度量指標。

<!--
First, get the YAML of your HorizontalPodAutoscaler in the `autoscaling/v2` form:
-->
首先，將 HorizontalPodAutoscaler 的 YAML 文件改爲 `autoscaling/v2` 格式：

```shell
kubectl get hpa php-apache -o yaml > /tmp/hpa-v2.yaml
```

<!--
Open the `/tmp/hpa-v2.yaml` file in an editor, and you should see YAML which looks like this:
-->
在編輯器中打開 `/tmp/hpa-v2.yaml`，你應看到如下所示的 YAML 文件：

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
status:
  observedGeneration: 1
  lastScaleTime: <some-time>
  currentReplicas: 1
  desiredReplicas: 1
  currentMetrics:
  - type: Resource
    resource:
      name: cpu
      current:
        averageUtilization: 0
        averageValue: 0
```

<!--
Notice that the `targetCPUUtilizationPercentage` field has been replaced with an array called `metrics`.
The CPU utilization metric is a *resource metric*, since it is represented as a percentage of a resource
specified on pod containers.  Notice that you can specify other resource metrics besides CPU.  By default,
the only other supported resource metric is `memory`.  These resources do not change names from cluster
to cluster, and should always be available, as long as the `metrics.k8s.io` API is available.
-->
需要注意的是，`targetCPUUtilizationPercentage` 字段已經被名爲 `metrics` 的數組所取代。
CPU 利用率這個度量指標是一個 **resource metric**（資源度量指標），因爲它表示容器上指定資源的百分比。
除 CPU 外，你還可以指定其他資源度量指標。默認情況下，目前唯一支持的其他資源度量指標爲 `memory`。
只要 `metrics.k8s.io` API 存在，這些資源度量指標就是可用的，並且他們不會在不同的 Kubernetes 集羣中改變名稱。

<!--
You can also specify resource metrics in terms of direct values, instead of as percentages of the
requested value, by using a `target.type` of `AverageValue` instead of `Utilization`, and
setting the corresponding `target.averageValue` field instead of the `target.averageUtilization`.
-->
你還可以指定資源度量指標使用絕對數值，而不是百分比，你需要將 `target.type` 從
`Utilization` 替換成 `AverageValue`，同時設置 `target.averageValue`
而非 `target.averageUtilization` 的值。

```
  metrics:
  - type: Resource
    resource:
      name: memory
      target:
        type: AverageValue
        averageValue: 500Mi
```

<!--
There are two other types of metrics, both of which are considered *custom metrics*: pod metrics and
object metrics.  These metrics may have names which are cluster specific, and require a more
advanced cluster monitoring setup.
-->
還有兩種其他類型的度量指標，他們被認爲是 **custom metrics**（自定義度量指標）：
即 Pod 度量指標和 Object 度量指標。
這些度量指標可能具有特定於集羣的名稱，並且需要更高級的集羣監控設置。

<!--
The first of these alternative metric types is *pod metrics*.  These metrics describe Pods, and
are averaged together across Pods and compared with a target value to determine the replica count.
They work much like resource metrics, except that they *only* support a `target` type of `AverageValue`.
-->
第一種可選的度量指標類型是 **Pod 度量指標**。這些指標從某一方面描述了 Pod，
在不同 Pod 之間進行平均，並通過與一個目標值比對來確定副本的數量。
它們的工作方式與資源度量指標非常相像，只是它們**僅**支持 `target` 類型爲 `AverageValue`。

<!--
Pod metrics are specified using a metric block like this:
-->
Pod 度量指標通過如下代碼塊定義：

```yaml
type: Pods
pods:
  metric:
    name: packets-per-second
  target:
    type: AverageValue
    averageValue: 1k
```

<!--
The second alternative metric type is *object metrics*. These metrics describe a different
object in the same namespace, instead of describing Pods. The metrics are not necessarily
fetched from the object; they only describe it. Object metrics support `target` types of
both `Value` and `AverageValue`.  With `Value`, the target is compared directly to the returned
metric from the API. With `AverageValue`, the value returned from the custom metrics API is divided
by the number of Pods before being compared to the target. The following example is the YAML
representation of the `requests-per-second` metric.
-->
第二種可選的度量指標類型是對象 **（Object）度量指標**。
這些度量指標用於描述在相同名字空間中的別的對象，而非 Pod。
請注意這些度量指標不一定來自某對象，它們僅用於描述這些對象。
對象度量指標支持的 `target` 類型包括 `Value` 和 `AverageValue`。
如果是 `Value` 類型，`target` 值將直接與 API 返回的度量指標比較，
而對於 `AverageValue` 類型，API 返回的度量值將按照 Pod 數量拆分，
然後再與 `target` 值比較。
下面的 YAML 文件展示了一個表示 `requests-per-second` 的度量指標。

```yaml
type: Object
object:
  metric:
    name: requests-per-second
  describedObject:
    apiVersion: networking.k8s.io/v1
    kind: Ingress
    name: main-route
  target:
    type: Value
    value: 2k
```

<!--
If you provide multiple such metric blocks, the HorizontalPodAutoscaler will consider each metric in turn.
The HorizontalPodAutoscaler will calculate proposed replica counts for each metric, and then choose the
one with the highest replica count.
-->
如果你指定了多個上述類型的度量指標，HorizontalPodAutoscaler 將會依次考量各個指標。
HorizontalPodAutoscaler 將會計算每一個指標所提議的副本數量，然後最終選擇一個最高值。

<!--
For example, if you had your monitoring system collecting metrics about network traffic,
you could update the definition above using `kubectl edit` to look like this:
-->
比如，如果你的監控系統能夠提供網絡流量數據，你可以通過 `kubectl edit`
命令將上述 Horizontal Pod Autoscaler 的定義更改爲：

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
  - type: Pods
    pods:
      metric:
        name: packets-per-second
      target:
        type: AverageValue
        averageValue: 1k
  - type: Object
    object:
      metric:
        name: requests-per-second
      describedObject:
        apiVersion: networking.k8s.io/v1
        kind: Ingress
        name: main-route
      target:
        type: Value
        value: 10k
status:
  observedGeneration: 1
  lastScaleTime: <some-time>
  currentReplicas: 1
  desiredReplicas: 1
  currentMetrics:
  - type: Resource
    resource:
      name: cpu
    current:
      averageUtilization: 0
      averageValue: 0
  - type: Object
    object:
      metric:
        name: requests-per-second
      describedObject:
        apiVersion: networking.k8s.io/v1
        kind: Ingress
        name: main-route
      current:
        value: 10k
```

<!--
Then, your HorizontalPodAutoscaler would attempt to ensure that each pod was consuming roughly
50% of its requested CPU, serving 1000 packets per second, and that all pods behind the main-route
Ingress were serving a total of 10000 requests per second.
-->
這樣，你的 HorizontalPodAutoscaler 將會嘗試確保每個 Pod 的 CPU 利用率在 50% 以內，
每秒能夠服務 1000 個數據包請求，
並確保所有在 Ingress 後的 Pod 每秒能夠服務的請求總數達到 10000 個。

<!--
### Autoscaling on more specific metrics

Many metrics pipelines allow you to describe metrics either by name or by a set of additional
descriptors called _labels_. For all non-resource metric types (pod, object, and external,
described below), you can specify an additional label selector which is passed to your metric
pipeline. For instance, if you collect a metric `http_requests` with the `verb`
label, you can specify the following metric block to scale only on GET requests:
-->
### 基於更特別的度量值來擴縮   {#autoscaing-on-more-specific-metrics}

許多度量流水線允許你通過名稱或附加的**標籤**來描述度量指標。
對於所有非資源類型度量指標（Pod、Object 和後面將介紹的 External），
可以額外指定一個標籤選擇算符。例如，如果你希望收集包含 `verb` 標籤的
`http_requests` 度量指標，可以按如下所示設置度量指標塊，使得擴縮操作僅針對
GET 請求執行：

```yaml
type: Object
object:
  metric:
    name: http_requests
    selector: {matchLabels: {verb: GET}}
```

<!--
This selector uses the same syntax as the full Kubernetes label selectors. The monitoring pipeline
determines how to collapse multiple series into a single value, if the name and selector
match multiple series. The selector is additive, and cannot select metrics
that describe objects that are **not** the target object (the target pods in the case of the `Pods`
type, and the described object in the case of the `Object` type).
-->
這個選擇算符使用與 Kubernetes 標籤選擇算符相同的語法。
如果名稱和標籤選擇算符匹配到多個系列，監測管道會決定如何將多個系列合併成單個值。
選擇算符是可以累加的，它不會選擇目標以外的對象（類型爲 `Pods` 的目標 Pod 或者類型爲 `Object` 的目標對象）。

<!--
### Autoscaling on metrics not related to Kubernetes objects

Applications running on Kubernetes may need to autoscale based on metrics that don't have an obvious
relationship to any object in the Kubernetes cluster, such as metrics describing a hosted service with
no direct correlation to Kubernetes namespaces. In Kubernetes 1.10 and later, you can address this use case
with *external metrics*.
-->
### 基於與 Kubernetes 對象無關的度量指標執行擴縮   {#autoscaling-on-metrics-not-related-to-kubernetes-objects}

運行在 Kubernetes 上的應用程序可能需要基於與 Kubernetes
集羣中的任何對象沒有明顯關係的度量指標進行自動擴縮，
例如那些描述與任何 Kubernetes 名字空間中的服務都無直接關聯的度量指標。
在 Kubernetes 1.10 及之後版本中，你可以使用外部度量指標（external metrics）。

<!--
Using external metrics requires knowledge of your monitoring system; the setup is
similar to that required when using custom metrics. External metrics allow you to autoscale your cluster
based on any metric available in your monitoring system. Provide a `metric` block with a
`name` and `selector`, as above, and use the `External` metric type instead of `Object`.
If multiple time series are matched by the `metricSelector`,
the sum of their values is used by the HorizontalPodAutoscaler.
External metrics support both the `Value` and `AverageValue` target types, which function exactly the same
as when you use the `Object` type.
-->
使用外部度量指標時，需要了解你所使用的監控系統，相關的設置與使用自定義指標時類似。
外部度量指標使得你可以使用你的監控系統的任何指標來自動擴縮你的集羣。
你需要在 `metric` 塊中提供 `name` 和 `selector`，同時將類型由 `Object` 改爲 `External`。
如果 `metricSelector` 匹配到多個度量指標，HorizontalPodAutoscaler 將會把它們加和。
外部度量指標同時支持 `Value` 和 `AverageValue` 類型，這與 `Object` 類型的度量指標相同。

<!--
For example if your application processes tasks from a hosted queue service, you could add the following
section to your HorizontalPodAutoscaler manifest to specify that you need one worker per 30 outstanding tasks.
-->
例如，如果你的應用程序處理來自主機上消息隊列的任務，
爲了讓每 30 個任務有 1 個工作者實例，你可以將下面的內容添加到
HorizontalPodAutoscaler 的配置中。

```yaml
- type: External
  external:
    metric:
      name: queue_messages_ready
      selector:
        matchLabels:
          queue: "worker_tasks"
    target:
      type: AverageValue
      averageValue: 30
```

<!--
When possible, it's preferable to use the custom metric target types instead of external metrics, since it's
easier for cluster administrators to secure the custom metrics API.  The external metrics API potentially allows
access to any metric, so cluster administrators should take care when exposing it.
-->
如果可能，還是推薦定製度量指標而不是外部度量指標，因爲這便於讓系統管理員加固定制度量指標 API。
而外部度量指標 API 可以允許訪問所有的度量指標。
當暴露這些服務時，系統管理員需要仔細考慮這個問題。

<!--
## Appendix: Horizontal Pod Autoscaler Status Conditions

When using the `autoscaling/v2` form of the HorizontalPodAutoscaler, you will be able to see
*status conditions* set by Kubernetes on the HorizontalPodAutoscaler.  These status conditions indicate
whether or not the HorizontalPodAutoscaler is able to scale, and whether or not it is currently restricted
in any way.
-->
## 附錄：Horizontal Pod Autoscaler 狀態條件   {#appendix-horizontal-pod-autoscaler-status-conditions}

使用 `autoscaling/v2` 格式的 HorizontalPodAutoscaler 時，你將可以看到
Kubernetes 爲 HorizongtalPodAutoscaler 設置的狀態條件（Status Conditions）。
這些狀態條件可以顯示當前 HorizontalPodAutoscaler 是否能夠執行擴縮以及是否受到一定的限制。

<!--
The conditions appear in the `status.conditions` field.  To see the conditions affecting a HorizontalPodAutoscaler,
we can use `kubectl describe hpa`:
-->
`status.conditions` 字段展示了這些狀態條件。
可以通過 `kubectl describe hpa` 命令查看當前影響 HorizontalPodAutoscaler
的各種狀態條件信息：

```shell
kubectl describe hpa cm-test
```

```
Name:                           cm-test
Namespace:                      prom
Labels:                         <none>
Annotations:                    <none>
CreationTimestamp:              Fri, 16 Jun 2017 18:09:22 +0000
Reference:                      ReplicationController/cm-test
Metrics:                        ( current / target )
  "http_requests" on pods:      66m / 500m
Min replicas:                   1
Max replicas:                   4
ReplicationController pods:     1 current / 1 desired
Conditions:
  Type                  Status  Reason                  Message
  ----                  ------  ------                  -------
  AbleToScale           True    ReadyForNewScale        the last scale time was sufficiently old as to warrant a new scale
  ScalingActive         True    ValidMetricFound        the HPA was able to successfully calculate a replica count from pods metric http_requests
  ScalingLimited        False   DesiredWithinRange      the desired replica count is within the acceptable range
Events:
```

<!--
For this HorizontalPodAutoscaler, you can see several conditions in a healthy state.  The first,
`AbleToScale`, indicates whether or not the HPA is able to fetch and update scales, as well as
whether or not any backoff-related conditions would prevent scaling.  The second, `ScalingActive`,
indicates whether or not the HPA is enabled (i.e. the replica count of the target is not zero) and
is able to calculate desired scales. When it is `False`, it generally indicates problems with
fetching metrics.  Finally, the last condition, `ScalingLimited`, indicates that the desired scale
was capped by the maximum or minimum of the HorizontalPodAutoscaler.  This is an indication that
you may wish to raise or lower the minimum or maximum replica count constraints on your
HorizontalPodAutoscaler.
-->
對於上面展示的這個 HorizontalPodAutoscaler，我們可以看出有若干狀態條件處於健康狀態。
首先，`AbleToScale` 表明 HPA 是否可以獲取和更新擴縮信息，以及是否存在阻止擴縮的各種回退條件。
其次，`ScalingActive` 表明 HPA 是否被啓用（即目標的副本數量不爲零）以及是否能夠完成擴縮計算。
當這一狀態爲 `False` 時，通常表明獲取度量指標存在問題。
最後一個條件 `ScalingLimited` 表明所需擴縮的值被 HorizontalPodAutoscaler
所定義的最大或者最小值所限制（即已經達到最大或者最小擴縮值）。
這通常表明你可能需要調整 HorizontalPodAutoscaler 所定義的最大或者最小副本數量的限制了。

<!--
## Quantities

All metrics in the HorizontalPodAutoscaler and metrics APIs are specified using
a special whole-number notation known in Kubernetes as a
{{< glossary_tooltip term_id="quantity" text="quantity">}}.  For example,
the quantity `10500m` would be written as `10.5` in decimal notation.  The metrics APIs
will return whole numbers without a suffix when possible, and will generally return
quantities in milli-units otherwise.  This means you might see your metric value fluctuate
between `1` and `1500m`, or `1` and `1.5` when written in decimal notation.
-->
## 量綱    {#quantities}

HorizontalPodAutoscaler 和 度量指標 API 中的所有的度量指標使用 Kubernetes
中稱爲{{< glossary_tooltip term_id="quantity" text="量綱（Quantity）">}}的特殊整數表示。
例如，數量 `10500m` 用十進制表示爲 `10.5`。
如果可能的話，度量指標 API 將返回沒有後綴的整數，否則返回以千分單位的數量。
這意味着你可能會看到你的度量指標在 `1` 和 `1500m`（也就是在十進制記數法中的 `1` 和 `1.5`）之間波動。

<!--
## Other possible scenarios

### Creating the autoscaler declaratively
-->
## 其他可能的情況   {#other-possible-scenarios}

### 以聲明式方式創建 Autoscaler     {#creating-the-autoscaler-declaratively}

<!--
Instead of using `kubectl autoscale` command to create a HorizontalPodAutoscaler imperatively we
can use the following manifest to create it declaratively:
-->
除了使用 `kubectl autoscale` 命令，也可以使用以下清單以聲明方式創建 HorizontalPodAutoscaler：

{{% code_sample file="application/hpa/php-apache.yaml" %}}

<!--
Then, create the autoscaler by executing the following command:
-->
使用如下命令創建 Autoscaler：

```shell
kubectl create -f https://k8s.io/examples/application/hpa/php-apache.yaml
```

```
horizontalpodautoscaler.autoscaling/php-apache created
```
