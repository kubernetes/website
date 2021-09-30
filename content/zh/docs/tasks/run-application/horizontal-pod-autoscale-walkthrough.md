---
title: Horizontal Pod Autoscaler 演练
content_type: task
weight: 100
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
-->

<!-- overview -->

<!--
Horizontal Pod Autoscaler automatically scales the number of pods
in a replication controller, deployment or replica set or statefulset based on observed CPU utilization
(or, with beta support, on some other, application-provided metrics).
-->
Horizontal Pod Autoscaler 可以根据 CPU 利用率自动扩缩 ReplicationController、
Deployment、ReplicaSet 或 StatefulSet 中的 Pod 数量
（也可以基于其他应用程序提供的度量指标，目前这一功能处于 beta 版本）。

<!--
This document walks you through an example of enabling Horizontal Pod Autoscaler for the php-apache server.
For more information on how Horizontal Pod Autoscaler behaves, see the
[Horizontal Pod Autoscaler user guide](/docs/tasks/run-application/horizontal-pod-autoscale/).
-->
本文将引领你了解如何为 php-apache 服务器配置和使用 Horizontal Pod Autoscaler。
与 Horizontal Pod Autoscaler 相关的更多信息请参阅
[Horizontal Pod Autoscaler 用户指南](/zh/docs/tasks/run-application/horizontal-pod-autoscale/)。

## {{% heading "prerequisites" %}}

<!--
This example requires a running Kubernetes cluster and kubectl, version 1.2 or later.
[metrics-server](https://github.com/kubernetes-incubator/metrics-server/) monitoring needs to be deployed
in the cluster to provide metrics through the [Metrics API](https://github.com/kubernetes/metrics).
Horizontal Pod Autoscaler uses this API to collect metrics. To learn how to deploy the metrics-server,
see the [metrics-server documentation](https://github.com/kubernetes-sigs/metrics-server#deployment).
-->
本文示例需要一个运行中的 Kubernetes 集群以及 kubectl，版本为 1.2 或更高。
[Metrics 服务器](https://github.com/kubernetes-incubator/metrics-server/)
需要被部署到集群中，以便通过 [Metrics API](https://github.com/kubernetes/metrics)
提供度量数据。
Horizontal Pod Autoscaler 根据此 API 来获取度量数据。
要了解如何部署 metrics-server，请参考
[metrics-server 文档](https://github.com/kubernetes-incubator/metrics-server/) 。

<!--
To specify multiple resource metrics for a Horizontal Pod Autoscaler, you must have a
Kubernetes cluster and kubectl at version 1.6 or later. To make use of custom metrics, your cluster
must be able to communicate with the API server providing the custom metrics API.
Finally, to use metrics not related to any Kubernetes object you must have a
Kubernetes cluster at version 1.10 or later, and you must be able to communicate with
the API server that provides the external metrics API.
See the [Horizontal Pod Autoscaler user guide](/docs/tasks/run-application/horizontal-pod-autoscale/#support-for-custom-metrics) for more details.
-->
如果需要为 Horizontal Pod Autoscaler 指定多种资源度量指标，你的 Kubernetes
集群以及 kubectl 至少需要达到 1.6 版本。 
此外，如果要使用自定义度量指标，你的 Kubernetes 集群还必须能够与提供这些自定义指标
的 API 服务器通信。
最后，如果要使用与 Kubernetes 对象无关的度量指标，则 Kubernetes 集群版本至少需要
达到 1.10 版本，同样，需要保证集群能够与提供这些外部指标的 API 服务器通信。
更多详细信息，请参阅
[Horizontal Pod Autoscaler 用户指南](/zh/docs/tasks/run-application/horizontal-pod-autoscale/#support-for-custom-metrics)。

<!-- steps -->

<!--
## Run & expose php-apache server
-->
## 运行 php-apache 服务器并暴露服务

<!--
To demonstrate Horizontal Pod Autoscaler we will use a custom docker image based on the php-apache image.
The Dockerfile has the following content:
-->
为了演示 Horizontal Pod Autoscaler，我们将使用一个基于 php-apache 镜像的
定制 Docker 镜像。Dockerfile 内容如下： 

```
FROM php:5-apache
COPY index.php /var/www/html/index.php
RUN chmod a+rx index.php
```

<!--
It defines an index.php page which performs some CPU intensive computations:
-->
该文件定义了一个 index.php 页面来执行一些 CPU 密集型计算：

```
<?php
  $x = 0.0001;
  for ($i = 0; $i <= 1000000; $i++) {
    $x += sqrt($x);
  }
  echo "OK!";
?>
```

<!--
First, we will start a deployment running the image and expose it as a service
using the following configuration:
-->
首先，我们使用下面的配置启动一个 Deployment 来运行这个镜像并暴露一个服务：

{{< codenew file="application/php-apache.yaml" >}}

<!--
Run the following command:
-->
运行下面的命令：

```shell
kubectl apply -f https://k8s.io/examples/application/php-apache.yaml
```

```
deployment.apps/php-apache created
service/php-apache created
```

<!--
## Create Horizontal Pod Autoscaler

Now that the server is running, we will create the autoscaler using
[kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands#autoscale).
The following command will create a Horizontal Pod Autoscaler that maintains between 1 and 10 replicas of the Pods
controlled by the php-apache deployment we created in the first step of these instructions.
Roughly speaking, HPA will increase and decrease the number of replicas
(via the deployment) to maintain an average CPU utilization across all Pods of 50%
(since each pod requests 200 milli-cores by `kubectl run`), this means average CPU usage of 100 milli-cores).
See [here](/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details) for more details on the algorithm.
-->
## 创建 Horizontal Pod Autoscaler  {#create-horizontal-pod-autoscaler}

现在，php-apache 服务器已经运行，我们将通过
[kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands#autoscale)
命令创建 Horizontal Pod Autoscaler。 
以下命令将创建一个 Horizontal Pod Autoscaler 用于控制我们上一步骤中创建的
Deployment，使 Pod 的副本数量维持在 1 到 10 之间。
大致来说，HPA 将（通过 Deployment）增加或者减少 Pod 副本的数量以保持所有 Pod
的平均 CPU 利用率在 50% 左右（由于每个 Pod 请求 200 毫核的 CPU，这意味着平均
CPU 用量为 100 毫核）。
算法的详情请参阅[相关文档](/zh/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details)。

```shell
kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=10
```

```
horizontalpodautoscaler.autoscaling/php-apache autoscaled
```

<!--
We may check the current status of autoscaler by running:
-->
我们可以通过以下命令查看 Autoscaler 的状态：

```shell
kubectl get hpa
```

```
NAME         REFERENCE                     TARGET    MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%  1         10        1          18s

```

<!--
Please note that the current CPU consumption is 0% as we are not sending any requests to the server
(the ``CURRENT`` column shows the average across all the pods controlled by the corresponding deployment).
-->
请注意当前的 CPU 利用率是 0%，这是由于我们尚未发送任何请求到服务器
（``CURRENT`` 列显示了相应 Deployment 所控制的所有 Pod 的平均 CPU 利用率）。

<!--
## Increase load

Now, we will see how the autoscaler reacts to increased load.
We will start a container, and send an infinite loop of queries to the php-apache service (please run it in a different terminal):
-->
## 增加负载  {#increase-load}

现在，我们将看到 Autoscaler 如何对增加负载作出反应。 
我们将启动一个容器，并通过一个循环向 php-apache 服务器发送无限的查询请求
（请在另一个终端中运行以下命令）：

```shell
kubectl run -i --tty load-generator --rm --image=busybox --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://php-apache; done"
```

<!--
Within a minute or so, we should see the higher CPU load by executing:
-->
一分钟时间左右之后，通过以下命令，我们可以看到 CPU 负载升高了：

```shell
kubectl get hpa
```

```
NAME         REFERENCE                     TARGET      MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  1         10        1          3m
```

<!--
Here, CPU consumption has increased to 305% of the request.
As a result, the deployment was resized to 7 replicas:
-->
这时，由于请求增多，CPU 利用率已经升至请求值的 305%。
可以看到，Deployment 的副本数量已经增长到了 7：

```shell
kubectl get deployment php-apache
```

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
## Stop load

We will finish our example by stopping the user load.

In the terminal where we created the container with `busybox` image, terminate
the load generation by typing `<Ctrl> + C`.

Then we will verify the result state (after a minute or so):
-->
## 停止负载

我们将通过停止负载来结束我们的示例。

在我们创建 busybox 容器的终端中，输入`<Ctrl> + C` 来终止负载的产生。

然后我们可以再次检查负载状态（等待几分钟时间）：

```shell
kubectl get hpa
```

```
NAME         REFERENCE                     TARGET       MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%     1         10        1          11m
```

```shell
kubectl get deployment php-apache
```

```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   1/1     1            1           27m
```

<!--
Here CPU utilization dropped to 0, and so HPA autoscaled the number of replicas back down to 1.
-->
这时，CPU 利用率已经降到 0，所以 HPA 将自动缩减副本数量至 1。

<!--
Autoscaling the replicas may take a few minutes.
-->
{{< note >}}
自动扩缩完成副本数量的改变可能需要几分钟的时间。
{{< /note >}}

<!-- discussion -->

<!--
## Autoscaling on multiple metrics and custom metrics

You can introduce additional metrics to use when autoscaling the `php-apache` Deployment
by making use of the `autoscaling/v2beta2` API version.
-->
## 基于多项度量指标和自定义度量指标自动扩缩 {#autoscaling-on-multiple-metrics-and-custom-metrics}

利用 `autoscaling/v2beta2` API 版本，你可以在自动扩缩 php-apache 这个
Deployment 时使用其他度量指标。

<!--
First, get the YAML of your HorizontalPodAutoscaler in the `autoscaling/v2beta2` form:
-->
首先，将 HorizontalPodAutoscaler 的 YAML 文件改为 `autoscaling/v2beta2` 格式：

```shell
kubectl get hpa php-apache -o yaml > /tmp/hpa-v2.yaml
```

<!--
Open the `/tmp/hpa-v2.yaml` file in an editor, and you should see YAML which looks like this:
-->
在编辑器中打开 `/tmp/hpa-v2.yaml`：

```yaml
apiVersion: autoscaling/v2beta2
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
the only other supported resource metric is memory.  These resources do not change names from cluster
to cluster, and should always be available, as long as the `metrics.k8s.io` API is available.
-->
需要注意的是，`targetCPUUtilizationPercentage` 字段已经被名为 `metrics` 的数组所取代。
CPU 利用率这个度量指标是一个 *resource metric*（资源度量指标），因为它表示容器上指定资源的百分比。
除 CPU 外，你还可以指定其他资源度量指标。默认情况下，目前唯一支持的其他资源度量指标为内存。
只要 `metrics.k8s.io` API 存在，这些资源度量指标就是可用的，并且他们不会在不同的 Kubernetes 集群中改变名称。

<!--
You can also specify resource metrics in terms of direct values, instead of as percentages of the
requested value, by using a `target.type` of `AverageValue` instead of `Utilization`, and
setting the corresponding `target.averageValue` field instead of the `target.averageUtilization`.
-->
你还可以指定资源度量指标使用绝对数值，而不是百分比，你需要将 `target.type` 从
`Utilization` 替换成 `AverageValue`，同时设置 `target.averageValue`
而非 `target.averageUtilization` 的值。

<!--
There are two other types of metrics, both of which are considered *custom metrics*: pod metrics and
object metrics.  These metrics may have names which are cluster specific, and require a more
advanced cluster monitoring setup.
-->
还有两种其他类型的度量指标，他们被认为是 *custom metrics*（自定义度量指标）：
即 Pod 度量指标和 Object 度量指标。
这些度量指标可能具有特定于集群的名称，并且需要更高级的集群监控设置。

<!--
The first of these alternative metric types is *pod metrics*.  These metrics describe pods, and
are averaged together across pods and compared with a target value to determine the replica count.
They work much like resource metrics, except that they *only* support a `target` type of `AverageValue`.
-->
第一种可选的度量指标类型是 Pod 度量指标。这些指标从某一方面描述了 Pod，
在不同 Pod 之间进行平均，并通过与一个目标值比对来确定副本的数量。
它们的工作方式与资源度量指标非常相像，只是它们仅支持 `target` 类型为 `AverageValue`。

<!--
Pod metrics are specified using a metric block like this:
-->
pod 度量指标通过如下代码块定义：

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
object in the same namespace, instead of describing pods. The metrics are not necessarily
fetched from the object; they only describe it. Object metrics support `target` types of
both `Value` and `AverageValue`.  With `Value`, the target is compared directly to the returned
metric from the API. With `AverageValue`, the value returned from the custom metrics API is divided
by the number of pods before being compared to the target. The following example is the YAML
representation of the `requests-per-second` metric.
-->
第二种可选的度量指标类型是对象（Object）度量指标。这些度量指标用于描述
在相同名字空间中的别的对象，而非 Pods。
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
比如，如果你的监控系统能够提供网络流量数据，你可以通过 `kubectl edit` 命令
将上述 Horizontal Pod Autoscaler 的定义更改为：

```yaml
apiVersion: autoscaling/v2beta1
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
        type: AverageUtilization
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
        apiVersion: networking.k8s.io/v1beta1
        kind: Ingress
        name: main-route
      target:
        kind: Value
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
        apiVersion: networking.k8s.io/v1beta1
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

许多度量流水线允许你通过名称或附加的 _标签_ 来描述度量指标。
对于所有非资源类型度量指标（Pod、Object 和后面将介绍的 External），
可以额外指定一个标签选择算符。例如，如果你希望收集包含 `verb` 标签的
`http_requests` 度量指标，可以按如下所示设置度量指标块，使得扩缩操作仅针对
GET 请求执行：

```yaml
type: Object
object:
  metric:
    name: `http_requests`
    selector: `verb=GET`
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
选择算符是可以累加的，它不会选择目标以外的对象（类型为 `Pods` 的目标 Pods 或者
类型为 `Object` 的目标对象）。

<!--
### Autoscaling on metrics not related to Kubernetes objects

Applications running on Kubernetes may need to autoscale based on metrics that don't have an obvious
relationship to any object in the Kubernetes cluster, such as metrics describing a hosted service with
no direct correlation to Kubernetes namespaces. In Kubernetes 1.10 and later, you can address this use case
with *external metrics*.
-->
### 基于与 Kubernetes 对象无关的度量指标执行扩缩

运行在 Kubernetes 上的应用程序可能需要基于与 Kubernetes 集群中的任何对象
没有明显关系的度量指标进行自动扩缩，
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

When using the `autoscaling/v2beta2` form of the HorizontalPodAutoscaler, you will be able to see
*status conditions* set by Kubernetes on the HorizontalPodAutoscaler.  These status conditions indicate
whether or not the HorizontalPodAutoscaler is able to scale, and whether or not it is currently restricted
in any way.
-->
## 附录：Horizontal Pod Autoscaler 状态条件

使用 `autoscaling/v2beta2` 格式的 HorizontalPodAutoscaler 时，你将可以看到
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
For this HorizontalPodAutoscaler, we can see several conditions in a healthy state.  The first,
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
其次，`ScalingActive` 表明 HPA 是否被启用（即目标的副本数量不为零） 以及是否能够完成扩缩计算。
当这一状态为 `False` 时，通常表明获取度量指标存在问题。
最后一个条件 `ScalingLimitted` 表明所需扩缩的值被 HorizontalPodAutoscaler
所定义的最大或者最小值所限制（即已经达到最大或者最小扩缩值）。
这通常表明你可能需要调整 HorizontalPodAutoscaler 所定义的最大或者最小副本数量的限制了。

<!--
## Appendix: Quantities

All metrics in the HorizontalPodAutoscaler and metrics APIs are specified using
a special whole-number notation known in Kubernetes as a
{{< glossary_tooltip term_id="quantity" text="quantity">}}.  For example,
the quantity `10500m` would be written as `10.5` in decimal notation.  The metrics APIs
will return whole numbers without a suffix when possible, and will generally return
quantities in milli-units otherwise.  This means you might see your metric value fluctuate
between `1` and `1500m`, or `1` and `1.5` when written in decimal notation.
-->
## 附录：量纲    {#appendix-quantities}

HorizontalPodAutoscaler 和 度量指标 API 中的所有的度量指标使用 Kubernetes 中称为
{{< glossary_tooltip term_id="quantity" text="量纲（Quantity）">}}
的特殊整数表示。
例如，数量 `10500m` 用十进制表示为 `10.5`。
如果可能的话，度量指标 API 将返回没有后缀的整数，否则返回以千分单位的数量。
这意味着你可能会看到你的度量指标在 `1` 和 `1500m` （也就是在十进制记数法中的 `1` 和 `1.5`）之间波动。

<!--
## Appendix: Other possible scenarios

### Creating the autoscaler declaratively
-->
## 附录：其他可能的情况   {#appendix-other-possible-scenarios}

### 以声明式方式创建 Autoscaler     {#creating-the-autoscaler-declaratively}

<!--
Instead of using `kubectl autoscale` command to create a HorizontalPodAutoscaler imperatively we
can use the following file to create it declaratively:
-->
除了使用 `kubectl autoscale` 命令，也可以文件创建 HorizontalPodAutoscaler：

{{< codenew file="application/hpa/php-apache.yaml" >}}

<!--
We will create the autoscaler by executing the following command:
-->
使用如下命令创建 autoscaler：

```shell
kubectl create -f https://k8s.io/examples/application/hpa/php-apache.yaml
```

```
horizontalpodautoscaler.autoscaling/php-apache created
```

