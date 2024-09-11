---
title: HorizontalPodAutoscaler 演练
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
[HorizontalPodAutoscaler](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/)（简称 HPA ）
自动更新工作负载资源（例如 {{< glossary_tooltip text="Deployment" term_id="deployment" >}} 或者
{{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}），
目的是自动扩缩工作负载以满足需求。

水平扩缩意味着对增加的负载的响应是部署更多的 {{< glossary_tooltip text="Pod" term_id="pod" >}}。
这与“垂直（Vertical）”扩缩不同，对于 Kubernetes，
垂直扩缩意味着将更多资源（例如：内存或 CPU）分配给已经为工作负载运行的 Pod。

<!--
If the load decreases, and the number of Pods is above the configured minimum,
the HorizontalPodAutoscaler instructs the workload resource (the Deployment, StatefulSet,
or other similar resource) to scale back down.

This document walks you through an example of enabling HorizontalPodAutoscaler to
automatically manage scale for an example web app. This example workload is Apache
httpd running some PHP code.
-->
如果负载减少，并且 Pod 的数量高于配置的最小值，
HorizontalPodAutoscaler 会指示工作负载资源（Deployment、StatefulSet 或其他类似资源）缩减。

本文档将引导你完成启用 HorizontalPodAutoscaler 以自动管理示例 Web 应用程序的扩缩的示例。
此示例工作负载是运行一些 PHP 代码的 Apache httpd。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
If you're running an older release of Kubernetes, refer to the version of the documentation for that release (see
[available documentation versions](/docs/home/supported-doc-versions/)).
-->
如果你运行的是旧版本的 Kubernetes，请参阅该版本的文档版本
（[可用的文档版本](/zh-cn/docs/home/supported-doc-versions/)）。

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
按照本演练进行操作，你需要一个部署并配置了
[Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme) 的集群。
Kubernetes Metrics Server 从集群中的 {{<glossary_tooltip term_id="kubelet" text="kubelets">}} 收集资源指标，
并通过 [Kubernetes API](/zh-cn/docs/concepts/overview/kubernetes-api/) 公开这些指标，
使用 [APIService](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) 添加代表指标读数的新资源。

要了解如何部署 Metrics Server，请参阅
[metrics-server 文档](https://github.com/kubernetes-sigs/metrics-server#deployment)。

<!--
If you are running {{< glossary_tooltip term_id="minikube" >}}, run the following command to enable metrics-server:
-->
如果你正在运行 {{< glossary_tooltip term_id="minikube" >}}，运行以下命令以启用 metrics-server：

```shell
minikube addons enable metrics-server
```

<!-- steps -->

<!--
## Run and expose php-apache server
-->
## 运行 php-apache 服务器并暴露服务 {#run-and-expose-php-apache-server}

<!--
To demonstrate a HorizontalPodAutoscaler, you will first start a Deployment that runs a container using the
`hpa-example` image, and expose it as a {{< glossary_tooltip term_id="service">}}
using the following manifest:
-->
为了演示 HorizontalPodAutoscaler，你将首先启动一个 Deployment 用 `hpa-example` 镜像运行一个容器，
然后使用以下清单文件将其暴露为一个 {{< glossary_tooltip term_id="service">}}：

{{% code_sample file="application/php-apache.yaml" %}}

<!--
To do so, run the following command:
-->
为此，运行下面的命令：

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
## 创建 HorizontalPodAutoscaler  {#create-horizontal-pod-autoscaler}

现在服务器正在运行，使用 `kubectl` 创建自动扩缩器。
[`kubectl autoscale`](/docs/reference/generated/kubectl/kubectl-commands#autoscale) 子命令是 `kubectl` 的一部分，
可以帮助你执行此操作。

你将很快运行一个创建 HorizontalPodAutoscaler 的命令，
该 HorizontalPodAutoscaler 维护由你在这些说明的第一步中创建的 php-apache Deployment 控制的 Pod 存在 1 到 10 个副本。

粗略地说，HPA {{<glossary_tooltip text="控制器" term_id="controller">}}将增加和减少副本的数量
（通过更新 Deployment）以保持所有 Pod 的平均 CPU 利用率为 50%。
Deployment 然后更新 ReplicaSet —— 这是所有 Deployment 在 Kubernetes 中工作方式的一部分 ——
然后 ReplicaSet 根据其 `.spec` 的更改添加或删除 Pod。

由于每个 Pod 通过 `kubectl run` 请求 200 milli-cores，这意味着平均 CPU 使用率为 100 milli-cores。
有关算法的更多详细信息，
请参阅[算法详细信息](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details)。


<!-- 
Create the HorizontalPodAutoscaler:
 -->
创建 HorizontalPodAutoscaler：

```shell
kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=10
```

```
horizontalpodautoscaler.autoscaling/php-apache autoscaled
```

<!--
You can check the current status of the newly-made HorizontalPodAutoscaler, by running:
-->
你可以通过运行以下命令检查新制作的 HorizontalPodAutoscaler 的当前状态：

<!--# You can use "hpa" or "horizontalpodautoscaler"; either name works OK. -->
```shell
# 你可以使用 “hpa” 或 “horizontalpodautoscaler”；任何一个名字都可以。
kubectl get hpa
```

<!--
The output is similar to:
-->
输出类似于：

```
NAME         REFERENCE                     TARGET    MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%  1         10        1          18s

```

<!--
(if you see other HorizontalPodAutoscalers with different names, that means they already existed,
and isn't usually a problem).
-->
（如果你看到其他具有不同名称的 HorizontalPodAutoscalers，这意味着它们已经存在，这通常不是问题）。

<!--
Please note that the current CPU consumption is 0% as there are no clients sending requests to the server
(the ``TARGET`` column shows the average across all the Pods controlled by the corresponding deployment).
-->
请注意当前的 CPU 利用率是 0%，这是由于我们尚未发送任何请求到服务器
（``TARGET`` 列显示了相应 Deployment 所控制的所有 Pod 的平均 CPU 利用率）。

<!--
## Increase the load {#increase-load}

Next, see how the autoscaler reacts to increased load.
To do this, you'll start a different Pod to act as a client. The container within the client Pod
runs in an infinite loop, sending queries to the php-apache service.
-->
## 增加负载  {#increase-load}

接下来，看看自动扩缩器如何对增加的负载做出反应。
为此，你将启动一个不同的 Pod 作为客户端。
客户端 Pod 中的容器在无限循环中运行，向 php-apache 服务发送查询。

<!--
# Run this in a separate terminal
# so that the load generation continues and you can carry on with the rest of the steps
-->
```shell
# 在单独的终端中运行它
# 以便负载生成继续，你可以继续执行其余步骤
kubectl run -i --tty load-generator --rm --image=busybox:1.28 --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://php-apache; done"
```

<!--
Now run:

Within a minute or so, you should see the higher CPU load; for example:
-->
现在执行：

<!-- # type Ctrl+C to end the watch when you're ready -->
```shell
# 准备好后按 Ctrl+C 结束观察
kubectl get hpa php-apache --watch
```

一分钟时间左右之后，通过以下命令，我们可以看到 CPU 负载升高了；例如：

```
NAME         REFERENCE                     TARGET      MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  1         10        1          3m
```

<!--
and then, more replicas. For example:
-->
然后，更多的副本被创建。例如：

```
NAME         REFERENCE                     TARGET      MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  1         10        7          3m
```

<!--
Here, CPU consumption has increased to 305% of the request.
As a result, the Deployment was resized to 7 replicas:
-->
这时，由于请求增多，CPU 利用率已经升至请求值的 305%。
可以看到，Deployment 的副本数量已经增长到了 7：

```shell
kubectl get deployment php-apache
```

<!--
You should see the replica count matching the figure from the HorizontalPodAutoscaler
-->
你应该会看到与 HorizontalPodAutoscaler 中的数字与副本数匹配

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
有时最终副本的数量可能需要几分钟才能稳定下来。由于环境的差异，
不同环境中最终的副本数量可能与本示例中的数量不同。
{{< /note >}}

<!--
## Stop generating load {#stop-load}

To finish the example, stop sending the load.

In the terminal where you created the Pod that runs a `busybox` image, terminate
the load generation by typing `<Ctrl> + C`.

Then verify the result state (after a minute or so):
-->
## 停止产生负载 {#stop-load}

要完成该示例，请停止发送负载。

在我们创建 `busybox` 容器的终端中，输入 `<Ctrl> + C` 来终止负载的产生。

然后验证结果状态（大约一分钟后）：

<!-- # type Ctrl+C to end the watch when you're ready -->
```shell
# 准备好后按 Ctrl+C 结束观察
kubectl get hpa php-apache --watch
```

<!-- The output is similar to: -->
输出类似于：

```
NAME         REFERENCE                     TARGET       MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%     1         10        1          11m
```

<!--
and the Deployment also shows that it has scaled down:
-->
Deployment 也显示它已经缩小了：

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
一旦 CPU 利用率降至 0，HPA 会自动将副本数缩减为 1。

<!--
Autoscaling the replicas may take a few minutes.
-->
自动扩缩完成副本数量的改变可能需要几分钟的时间。

<!-- discussion -->

<!--
## Autoscaling on multiple metrics and custom metrics

You can introduce additional metrics to use when autoscaling the `php-apache` Deployment
by making use of the `autoscaling/v2` API version.
-->
## 基于多项度量指标和自定义度量指标自动扩缩 {#autoscaling-on-multiple-metrics-and-custom-metrics}

利用 `autoscaling/v2` API 版本，你可以在自动扩缩 php-apache 这个
Deployment 时使用其他度量指标。

<!--
First, get the YAML of your HorizontalPodAutoscaler in the `autoscaling/v2` form:
-->
首先，将 HorizontalPodAutoscaler 的 YAML 文件改为 `autoscaling/v2` 格式：

```shell
kubectl get hpa php-apache -o yaml > /tmp/hpa-v2.yaml
```

<!--
Open the `/tmp/hpa-v2.yaml` file in an editor, and you should see YAML which looks like this:
-->
在编辑器中打开 `/tmp/hpa-v2.yaml`，你应看到如下所示的 YAML 文件：

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
需要注意的是，`targetCPUUtilizationPercentage` 字段已经被名为 `metrics` 的数组所取代。
CPU 利用率这个度量指标是一个 **resource metric**（资源度量指标），因为它表示容器上指定资源的百分比。
除 CPU 外，你还可以指定其他资源度量指标。默认情况下，目前唯一支持的其他资源度量指标为 `memory`。
只要 `metrics.k8s.io` API 存在，这些资源度量指标就是可用的，并且他们不会在不同的 Kubernetes 集群中改变名称。

<!--
You can also specify resource metrics in terms of direct values, instead of as percentages of the
requested value, by using a `target.type` of `AverageValue` instead of `Utilization`, and
setting the corresponding `target.averageValue` field instead of the `target.averageUtilization`.
-->
你还可以指定资源度量指标使用绝对数值，而不是百分比，你需要将 `target.type` 从
`Utilization` 替换成 `AverageValue`，同时设置 `target.averageValue`
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
还有两种其他类型的度量指标，他们被认为是 **custom metrics**（自定义度量指标）：
即 Pod 度量指标和 Object 度量指标。
这些度量指标可能具有特定于集群的名称，并且需要更高级的集群监控设置。

<!--
The first of these alternative metric types is *pod metrics*.  These metrics describe Pods, and
are averaged together across Pods and compared with a target value to determine the replica count.
They work much like resource metrics, except that they *only* support a `target` type of `AverageValue`.
-->
第一种可选的度量指标类型是 **Pod 度量指标**。这些指标从某一方面描述了 Pod，
在不同 Pod 之间进行平均，并通过与一个目标值比对来确定副本的数量。
它们的工作方式与资源度量指标非常相像，只是它们**仅**支持 `target` 类型为 `AverageValue`。

<!--
Pod metrics are specified using a metric block like this:
-->
Pod 度量指标通过如下代码块定义：

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
第二种可选的度量指标类型是对象 **（Object）度量指标**。
这些度量指标用于描述在相同名字空间中的别的对象，而非 Pod。
请注意这些度量指标不一定来自某对象，它们仅用于描述这些对象。
对象度量指标支持的 `target` 类型包括 `Value` 和 `AverageValue`。
如果是 `Value` 类型，`target` 值将直接与 API 返回的度量指标比较，
而对于 `AverageValue` 类型，API 返回的度量值将按照 Pod 数量拆分，
然后再与 `target` 值比较。
下面的 YAML 文件展示了一个表示 `requests-per-second` 的度量指标。

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
如果你指定了多个上述类型的度量指标，HorizontalPodAutoscaler 将会依次考量各个指标。
HorizontalPodAutoscaler 将会计算每一个指标所提议的副本数量，然后最终选择一个最高值。

<!--
For example, if you had your monitoring system collecting metrics about network traffic,
you could update the definition above using `kubectl edit` to look like this:
-->
比如，如果你的监控系统能够提供网络流量数据，你可以通过 `kubectl edit`
命令将上述 Horizontal Pod Autoscaler 的定义更改为：

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
这样，你的 HorizontalPodAutoscaler 将会尝试确保每个 Pod 的 CPU 利用率在 50% 以内，
每秒能够服务 1000 个数据包请求，
并确保所有在 Ingress 后的 Pod 每秒能够服务的请求总数达到 10000 个。

<!--
### Autoscaling on more specific metrics

Many metrics pipelines allow you to describe metrics either by name or by a set of additional
descriptors called _labels_. For all non-resource metric types (pod, object, and external,
described below), you can specify an additional label selector which is passed to your metric
pipeline. For instance, if you collect a metric `http_requests` with the `verb`
label, you can specify the following metric block to scale only on GET requests:
-->
### 基于更特别的度量值来扩缩   {#autoscaing-on-more-specific-metrics}

许多度量流水线允许你通过名称或附加的**标签**来描述度量指标。
对于所有非资源类型度量指标（Pod、Object 和后面将介绍的 External），
可以额外指定一个标签选择算符。例如，如果你希望收集包含 `verb` 标签的
`http_requests` 度量指标，可以按如下所示设置度量指标块，使得扩缩操作仅针对
GET 请求执行：

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
这个选择算符使用与 Kubernetes 标签选择算符相同的语法。
如果名称和标签选择算符匹配到多个系列，监测管道会决定如何将多个系列合并成单个值。
选择算符是可以累加的，它不会选择目标以外的对象（类型为 `Pods` 的目标 Pod 或者类型为 `Object` 的目标对象）。

<!--
### Autoscaling on metrics not related to Kubernetes objects

Applications running on Kubernetes may need to autoscale based on metrics that don't have an obvious
relationship to any object in the Kubernetes cluster, such as metrics describing a hosted service with
no direct correlation to Kubernetes namespaces. In Kubernetes 1.10 and later, you can address this use case
with *external metrics*.
-->
### 基于与 Kubernetes 对象无关的度量指标执行扩缩   {#autoscaling-on-metrics-not-related-to-kubernetes-objects}

运行在 Kubernetes 上的应用程序可能需要基于与 Kubernetes
集群中的任何对象没有明显关系的度量指标进行自动扩缩，
例如那些描述与任何 Kubernetes 名字空间中的服务都无直接关联的度量指标。
在 Kubernetes 1.10 及之后版本中，你可以使用外部度量指标（external metrics）。

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
使用外部度量指标时，需要了解你所使用的监控系统，相关的设置与使用自定义指标时类似。
外部度量指标使得你可以使用你的监控系统的任何指标来自动扩缩你的集群。
你需要在 `metric` 块中提供 `name` 和 `selector`，同时将类型由 `Object` 改为 `External`。
如果 `metricSelector` 匹配到多个度量指标，HorizontalPodAutoscaler 将会把它们加和。
外部度量指标同时支持 `Value` 和 `AverageValue` 类型，这与 `Object` 类型的度量指标相同。

<!--
For example if your application processes tasks from a hosted queue service, you could add the following
section to your HorizontalPodAutoscaler manifest to specify that you need one worker per 30 outstanding tasks.
-->
例如，如果你的应用程序处理来自主机上消息队列的任务，
为了让每 30 个任务有 1 个工作者实例，你可以将下面的内容添加到
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
如果可能，还是推荐定制度量指标而不是外部度量指标，因为这便于让系统管理员加固定制度量指标 API。
而外部度量指标 API 可以允许访问所有的度量指标。
当暴露这些服务时，系统管理员需要仔细考虑这个问题。

<!--
## Appendix: Horizontal Pod Autoscaler Status Conditions

When using the `autoscaling/v2` form of the HorizontalPodAutoscaler, you will be able to see
*status conditions* set by Kubernetes on the HorizontalPodAutoscaler.  These status conditions indicate
whether or not the HorizontalPodAutoscaler is able to scale, and whether or not it is currently restricted
in any way.
-->
## 附录：Horizontal Pod Autoscaler 状态条件   {#appendix-horizontal-pod-autoscaler-status-conditions}

使用 `autoscaling/v2` 格式的 HorizontalPodAutoscaler 时，你将可以看到
Kubernetes 为 HorizongtalPodAutoscaler 设置的状态条件（Status Conditions）。
这些状态条件可以显示当前 HorizontalPodAutoscaler 是否能够执行扩缩以及是否受到一定的限制。

<!--
The conditions appear in the `status.conditions` field.  To see the conditions affecting a HorizontalPodAutoscaler,
we can use `kubectl describe hpa`:
-->
`status.conditions` 字段展示了这些状态条件。
可以通过 `kubectl describe hpa` 命令查看当前影响 HorizontalPodAutoscaler
的各种状态条件信息：

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
对于上面展示的这个 HorizontalPodAutoscaler，我们可以看出有若干状态条件处于健康状态。
首先，`AbleToScale` 表明 HPA 是否可以获取和更新扩缩信息，以及是否存在阻止扩缩的各种回退条件。
其次，`ScalingActive` 表明 HPA 是否被启用（即目标的副本数量不为零）以及是否能够完成扩缩计算。
当这一状态为 `False` 时，通常表明获取度量指标存在问题。
最后一个条件 `ScalingLimited` 表明所需扩缩的值被 HorizontalPodAutoscaler
所定义的最大或者最小值所限制（即已经达到最大或者最小扩缩值）。
这通常表明你可能需要调整 HorizontalPodAutoscaler 所定义的最大或者最小副本数量的限制了。

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
## 量纲    {#quantities}

HorizontalPodAutoscaler 和 度量指标 API 中的所有的度量指标使用 Kubernetes
中称为{{< glossary_tooltip term_id="quantity" text="量纲（Quantity）">}}的特殊整数表示。
例如，数量 `10500m` 用十进制表示为 `10.5`。
如果可能的话，度量指标 API 将返回没有后缀的整数，否则返回以千分单位的数量。
这意味着你可能会看到你的度量指标在 `1` 和 `1500m`（也就是在十进制记数法中的 `1` 和 `1.5`）之间波动。

<!--
## Other possible scenarios

### Creating the autoscaler declaratively
-->
## 其他可能的情况   {#other-possible-scenarios}

### 以声明式方式创建 Autoscaler     {#creating-the-autoscaler-declaratively}

<!--
Instead of using `kubectl autoscale` command to create a HorizontalPodAutoscaler imperatively we
can use the following manifest to create it declaratively:
-->
除了使用 `kubectl autoscale` 命令，也可以使用以下清单以声明方式创建 HorizontalPodAutoscaler：

{{% code_sample file="application/hpa/php-apache.yaml" %}}

<!--
Then, create the autoscaler by executing the following command:
-->
使用如下命令创建 Autoscaler：

```shell
kubectl create -f https://k8s.io/examples/application/hpa/php-apache.yaml
```

```
horizontalpodautoscaler.autoscaling/php-apache created
```
