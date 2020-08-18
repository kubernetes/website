---
reviewers:
- fgrzadkowski
- jszczepkowski
- justinsb
- directxman12
title: Horizontal Pod Autoscaler演练
content_type: task
weight: 100
---

<!-- overview -->

<!--
Horizontal Pod Autoscaler automatically scales the number of pods
in a replication controller, deployment or replica set based on observed CPU utilization
(or, with beta support, on some other, application-provided metrics).
-->
Horizontal Pod Autoscaler 可以根据CPU利用率自动伸缩 replication controller、deployment 或者 replica set 中的Pod数量
（也可以基于其他应用程序提供的度量指标，目前这一功能处于 beta 版本）。

<!--
This document walks you through an example of enabling Horizontal Pod Autoscaler for the php-apache server.  For more information on how Horizontal Pod Autoscaler behaves, see the [Horizontal Pod Autoscaler user guide](/docs/tasks/run-application/horizontal-pod-autoscale/).
-->
本文将引导您了解如何为 php-apache 服务器配置和使用 Horizontal Pod Autoscaler。
更多 Horizontal Pod Autoscaler 的信息请参阅 [Horizontal Pod Autoscaler user guide](/docs/tasks/run-application/horizontal-pod-autoscale/)。





## {{% heading "prerequisites" %}}


<!--
This example requires a running Kubernetes cluster and kubectl, version 1.2 or later.
[metrics-server](https://github.com/kubernetes-incubator/metrics-server/) monitoring needs to be deployed in the cluster
to provide metrics via the resource metrics API, as Horizontal Pod Autoscaler uses this API to collect metrics. The instructions for deploying this are on the GitHub repository of [metrics-server](https://github.com/kubernetes-incubator/metrics-server/), if you followed [getting started on GCE guide](/docs/setup/production-environment/turnkey/gce/),
metrics-server monitoring will be turned-on by default.
-->
本文示例需要一个1.2或者更高版本的可运行的 Kubernetes 集群以及 kubectl。 
[metrics-server](https://github.com/kubernetes-incubator/metrics-server/) 也需要部署到集群中，
它可以通过 resource metrics API 对外提供度量数据，Horizontal Pod Autoscaler 正是根据此 API 来获取度量数据，部署方法请参考 [metrics-server](https://github.com/kubernetes-incubator/metrics-server/) 。
如果你正在使用GCE，按照 [getting started on GCE guide](/docs/setup/production-environment/turnkey/gce/) 操作，metrics-server 会默认启动。

<!--
To specify multiple resource metrics for a Horizontal Pod Autoscaler, you must have a Kubernetes cluster
and kubectl at version 1.6 or later.  Furthermore, in order to make use of custom metrics, your cluster
must be able to communicate with the API server providing the custom metrics API. Finally, to use metrics
not related to any Kubernetes object you must have a Kubernetes cluster at version 1.10 or later, and
you must be able to communicate with the API server that provides the external metrics API.
See the [Horizontal Pod Autoscaler user guide](/docs/tasks/run-application/horizontal-pod-autoscale/#support-for-custom-metrics) for more details.
-->
如果需要为 Horizontal Pod Autoscaler 指定多种资源度量指标，您的 Kubernetes 集群以及 kubectl 至少需要达到1.6版本。 
此外，如果要使用自定义度量指标，您的Kubernetes 集群还必须能够与提供这些自定义指标的API服务器通信。
最后，如果要使用与 Kubernetes 对象无关的度量指标，则 Kubernetes 集群版本至少需要达到1.10版本，同样，需要保证集群能够与提供这些外部指标的API服务器通信。
更多详细信息，请参阅[Horizontal Pod Autoscaler user guide](/docs/tasks/run-application/horizontal-pod-autoscale/#support-for-custom-metrics)。



<!-- steps -->

<!--
## Run & expose php-apache server
-->
## 第一步：运行 php-apache 服务器并暴露服务

<!--
To demonstrate Horizontal Pod Autoscaler we will use a custom docker image based on the php-apache image.
The Dockerfile has the following content:
-->
为了演示 Horizontal Pod Autoscaler，我们将使用一个基于 php-apache 镜像的定制 Docker 镜像。
Dockerfile 内容如下： 

```
FROM php:5-apache
COPY index.php /var/www/html/index.php
RUN chmod a+rx index.php
```
<!--
It defines an index.php page which performs some CPU intensive computations:
-->
它定义一个 index.php 页面来执行一些 CPU 密集型计算：

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
First, we will start a deployment running the image and expose it as a service:
-->
首先，我们先启动一个 deployment 来运行这个镜像并暴露一个服务:

```shell
kubectl run php-apache --image=k8s.gcr.io/hpa-example --requests=cpu=200m --expose --port=80
```
```
service/php-apache created
deployment.apps/php-apache created
```

<!--
## Create Horizontal Pod Autoscaler
-->
## 创建 Horizontal Pod Autoscaler

<!--
Now that the server is running, we will create the autoscaler using
[kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands#autoscale).
The following command will create a Horizontal Pod Autoscaler that maintains between 1 and 10 replicas of the Pods
controlled by the php-apache deployment we created in the first step of these instructions.
Roughly speaking, HPA will increase and decrease the number of replicas
(via the deployment) to maintain an average CPU utilization across all Pods of 50%
(since each pod requests 200 milli-cores by [kubectl run](https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/docs/user-guide/kubectl/kubectl_run.md), this means average CPU usage of 100 milli-cores).
See [here](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#autoscaling-algorithm) for more details on the algorithm.
-->
现在，php-apache服务器已经运行，我们将通过 [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands#autoscale) 命令创建 Horizontal Pod Autoscaler。 
以下命令将创建一个 Horizontal Pod Autoscaler 用于控制我们上一步骤中创建的 deployment，使 Pod 的副本数量在维持在1到10之间。
大致来说，HPA 将通过增加或者减少 Pod 副本的数量（通过 Deployment ）以保持所有 Pod 的平均CPU利用率在50%以内
（由于每个 Pod 通过 [kubectl run](https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/docs/user-guide/kubectl/kubectl_run.md)
申请了200 milli-cores CPU，所以50%的 CPU 利用率意味着平均 CPU 利用率为100 milli-cores）。 
相关算法的详情请参阅[here](https://git.k8s.io/community/contributors/design-proposals/autoscaling/horizontal-pod-autoscaler.md#autoscaling-algorithm)。

```shell
kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=10
```
```
horizontalpodautoscaler.autoscaling/php-apache autoscaled
```

<!--
We may check the current status of autoscaler by running:
-->
我们可以通过以下命令查看 autoscaler 的状态：

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
请注意在上面的命令输出中，当前的CPU利用率是0%，这是由于我们尚未发送任何请求到服务器
（``CURRENT`` 列显示了相应 deployment 所控制的所有 Pod 的平均 CPU 利用率）。

<!--
## Increase load
-->
## 增加负载

<!--
Now, we will see how the autoscaler reacts to increased load.
We will start a container, and send an infinite loop of queries to the php-apache service (please run it in a different terminal):
-->
现在，我们将看到 autoscaler 如何对增加负载作出反应。 
我们将启动一个容器，并通过一个循环向 php-apache 服务器发送无限的查询请求（请在另一个终端中运行以下命令）：

```shell
kubectl run -i --tty load-generator --image=busybox /bin/sh

Hit enter for command prompt

while true; do wget -q -O- http://php-apache; done
```

<!--
Within a minute or so, we should see the higher CPU load by executing:
-->
在几分钟时间内，通过以下命令，我们可以看到CPU负载升高了：

```shell
kubectl get hpa
```
```
NAME         REFERENCE                     TARGET      CURRENT   MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  305%      1         10        1          3m

```

<!--
Here, CPU consumption has increased to 305% of the request.
As a result, the deployment was resized to 7 replicas:
-->
这时，由于请求增多，CPU利用率已经升至305%。 可以看到，deployment 的副本数量已经增长到了7：

```shell
kubectl get deployment php-apache
```
```
NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
php-apache   7         7         7            7           19m
```

<!--
{{< note >}}
It may take a few minutes to stabilize the number of replicas. Since the amount
of load is not controlled in any way it may happen that the final number of replicas
will differ from this example.
{{< /note >}}
-->
{{< note >}}
有时最终副本的数量可能需要几分钟才能稳定下来。 由于环境的差异，不同环境中最终的副本数量可能与本示例中的数量不同。
{{< /note >}}

<!--
## Stop load
-->
## 停止负载

<!--
We will finish our example by stopping the user load.

In the terminal where we created the container with `busybox` image, terminate
the load generation by typing `<Ctrl> + C`.

Then we will verify the result state (after a minute or so):
-->
我们将通过停止负载来结束我们的示例。

在我们创建 busybox 容器的终端中，输入`<Ctrl> + C`来终止负载的产生。

然后我们可以再次查看负载状态（等待几分钟时间）：

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
NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
php-apache   1         1         1            1           27m
```

<!--
Here CPU utilization dropped to 0, and so HPA autoscaled the number of replicas back down to 1.
-->
这时，CPU利用率已经降到0，所以 HPA 将自动缩减副本数量至1。

<!--
{{< note >}}
Autoscaling the replicas may take a few minutes.
{{< /note >}}
-->
{{< note >}}
自动伸缩完成副本数量的改变可能需要几分钟的时间。
{{< /note >}}



<!-- discussion -->

<!--
## Autoscaling on multiple metrics and custom metrics
-->
## 基于多项度量指标和自定义度量指标自动伸缩

<!--
You can introduce additional metrics to use when autoscaling the `php-apache` Deployment
by making use of the `autoscaling/v2beta2` API version.
-->
利用`autoscaling/v2beta2`API版本，您可以在自动伸缩 php-apache 这个 Deployment 时引入其他度量指标。

<!--
First, get the YAML of your HorizontalPodAutoscaler in the `autoscaling/v2beta2` form:
-->
首先，获取`autoscaling/v2beta2`格式的 HorizontalPodAutoscaler 的YAML文件：

```shell
kubectl get hpa.v2beta2.autoscaling -o yaml > /tmp/hpa-v2.yaml
```

<!--
Open the `/tmp/hpa-v2.yaml` file in an editor, and you should see YAML which looks like this:
-->
在编辑器中打开`/tmp/hpa-v2.yaml`：

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
CPU利用率这个度量指标是一个*resource metric*(资源度量指标)，因为它表示容器上指定资源的百分比。
除CPU外，您还可以指定其他资源度量指标。默认情况下，目前唯一支持的其他资源度量指标为内存。
只要`metrics.k8s.io` API存在，这些资源度量指标就是可用的，并且他们不会在不同的Kubernetes集群中改变名称。

<!--
You can also specify resource metrics in terms of direct values, instead of as percentages of the
requested value, by using a `target` type of `AverageValue` instead of `AverageUtilization`, and
setting the corresponding `target.averageValue` field instead of the `target.averageUtilization`.
-->
您还可以指定资源度量指标使用绝对数值，而不是百分比，你需要将`target`类型`AverageUtilization`替换成`AverageValue`，同时
将`target.averageUtilization`替换成`target.averageValue`并设定相应的值。

<!--
There are two other types of metrics, both of which are considered *custom metrics*: pod metrics and
object metrics.  These metrics may have names which are cluster specific, and require a more
advanced cluster monitoring setup.
-->
还有两种其他类型的度量指标，他们被认为是*custom metrics*（自定义度量指标）：
即 Pod 度量指标和对象度量指标（pod metrics and object metrics）。
这些度量指标可能具有特定于集群的名称，并且需要更高级的集群监控设置。

<!--
The first of these alternative metric types is *pod metrics*.  These metrics describe pods, and
are averaged together across pods and compared with a target value to determine the replica count.
They work much like resource metrics, except that they *only* support a `target` type of `AverageValue`.
-->
第一种可选的度量指标类型是 Pod 度量指标。这些指标从某一方面描述了Pod，在不同Pod之间进行平均，并通过与一个目标值比对来确定副本的数量。
它们的工作方式与资源度量指标非常相像，差别是它们仅支持`target` 类型为`AverageValue`。

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
object in the same namespace, instead of describing pods. The metrics are not necessarily
fetched from the object; they only describe it. Object metrics support `target` types of
both `Value` and `AverageValue`.  With `Value`, the target is compared directly to the returned
metric from the API. With `AverageValue`, the value returned from the custom metrics API is divided
by the number of pods before being compared to the target. The following example is the YAML
representation of the `requests-per-second` metric.
-->
第二种可选的度量指标类型是对象度量指标。相对于描述 Pod，这些度量指标用于描述一个在相同名字空间(namespace)中的其他对象。
请注意这些度量指标用于描述这些对象，并非从对象中获取。
对象度量指标支持的`target`类型包括`Value`和`AverageValue`。如果是`Value`类型，target值将直接与API返回的度量指标比较，
而`AverageValue`类型，API返回的度量指标将按照 Pod 数量拆分，然后再与target值比较。
下面的 YAML 文件展示了一个表示`requests-per-second`的度量指标。

```yaml
type: Object
object:
  metric:
    name: requests-per-second
  describedObject:
    apiVersion: networking.k8s.io/v1beta1
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
如果您指定了多个上述类型的度量指标，HorizontalPodAutoscaler 将会依次考量各个指标。
HorizontalPodAutoscaler 将会计算每一个指标所提议的副本数量，然后最终选择一个最高值。

<!--
For example, if you had your monitoring system collecting metrics about network traffic,
you could update the definition above using `kubectl edit` to look like this:
-->
比如，如果您的监控系统能够提供网络流量数据，您可以通过`kubectl edit`命令将上述 Horizontal Pod Autoscaler 的定义更改为：

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
      targetAverageValue: 1k
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
然后，您的 HorizontalPodAutoscaler 将会尝试确保每个Pod的CPU利用率在50%以内，每秒能够服务1000个数据包请求，
并确保所有在Ingress后的Pod每秒能够服务的请求总数达到10000个。

<!--
### Autoscaling on more specific metrics
-->
### 多个度量指标下伸缩

<!--
Many metrics pipelines allow you to describe metrics either by name or by a set of additional
descriptors called _labels_. For all non-resource metric types (pod, object, and external,
described below), you can specify an additional label selector which is passed to your metric
pipeline. For instance, if you collect a metric `http_requests` with the `verb`
label, you can specify the following metric block to scale only on GET requests:
-->
许多度量管道允许您通过名称或附加的_labels_来描述度量指标。对于所有非资源类型度量指标(pod、object和后面将介绍的external)，
，可以额外指定一个标签选择器。例如，如果你希望收集包含`verb`标签的`http_requests`度量指标，
你可以在 GET 请求中指定需要的度量指标，如下所示：

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
这个选择器使用与 Kubernetes 标签选择器相同的语法。
如果名称和标签选择器匹配到多个系列，监测管道会决定如何将多个系列合并成单个值。
选择器是附加的，它不会选择目标以外的对象（类型为`Pods`的目标和类型为`Object`的目标）。

<!--
### Autoscaling on metrics not related to Kubernetes objects
-->
### 基于Kubernetes以外的度量指标伸缩

<!--
Applications running on Kubernetes may need to autoscale based on metrics that don't have an obvious
relationship to any object in the Kubernetes cluster, such as metrics describing a hosted service with
no direct correlation to Kubernetes namespaces. In Kubernetes 1.10 and later, you can address this use case
with *external metrics*.
-->
运行在 Kubernetes 上的应用程序可能需要基于与 Kubernetes 集群中的任何对象没有明显关系的度量指标进行自动伸缩，
例如那些描述不在 Kubernetes 任何 namespaces 服务的度量指标。

<!--
Using external metrics requires knowledge of your monitoring system; the setup is
similar to that required when using custom metrics. External metrics allow you to autoscale your cluster
based on any metric available in your monitoring system. Just provide a `metric` block with a
`name` and `selector`, as above, and use the `External` metric type instead of `Object`.
If multiple time series are matched by the `metricSelector`,
the sum of their values is used by the HorizontalPodAutoscaler.
External metrics support both the `Value` and `AverageValue` target types, which function exactly the same
as when you use the `Object` type.
-->
使用外部的度量指标，需要了解你使用的监控系统，相关的设置与使用自定义试题指标类似。
External metrics 可以使用你的监控系统的任何指标来自动伸缩你的集群。你只需要在`metric`块中提供`name` 和 `selector`，同时将类型由`Object`改为`External`。
如果`metricSelector`匹配到多个度量指标，HorizontalPodAutoscaler 将会把它们加和。
External metrics 同时支持`Value`和`AverageValue`类型，这与`Object`类型的度量指标相同。

<!--
For example if your application processes tasks from a hosted queue service, you could add the following
section to your HorizontalPodAutoscaler manifest to specify that you need one worker per 30 outstanding tasks.
-->
例如，如果你的应用程序处理主机上的消息队列，
为了让每30个任务有1个worker，你可以将下面的内容添加到 HorizontalPodAutoscaler 的配置中。

```yaml
- type: External
  external:
    metric:
      name: queue_messages_ready
      selector: "queue=worker_tasks"
    target:
      type: AverageValue
      averageValue: 30
```

<!--
When possible, it's preferable to use the custom metric target types instead of external metrics, since it's
easier for cluster administrators to secure the custom metrics API.  The external metrics API potentially allows
access to any metric, so cluster administrators should take care when exposing it.
-->
如果可能，还是推荐 custom metric 而不是 external metrics，因为这便于让系统管理员加固 custom metrics API。
而 external metrics API 可以允许访问所有的度量指标，当暴露这些服务时，系统管理员需要仔细考虑这个问题。

<!--
## Appendix: Horizontal Pod Autoscaler Status Conditions
-->
## 附录：Horizontal Pod Autoscaler状态条件

<!--
When using the `autoscaling/v2beta2` form of the HorizontalPodAutoscaler, you will be able to see
*status conditions* set by Kubernetes on the HorizontalPodAutoscaler.  These status conditions indicate
whether or not the HorizontalPodAutoscaler is able to scale, and whether or not it is currently restricted
in any way.
-->
当使用`autoscaling/v2beta2`格式的 HorizontalPodAutoscaler 时，您将可以看到 Kubernetes 为 HorizongtalPodAutoscaler 设置的状态条件（status conditions）。
这些状态条件可以显示当前 HorizontalPodAutoscaler 是否能够执行伸缩以及是否受到一定的限制。

<!--
The conditions appear in the `status.conditions` field.  To see the conditions affecting a HorizontalPodAutoscaler,
we can use `kubectl describe hpa`:
-->
`status.conditions`字段展示了这些状态条件。
可以通过`kubectl describe hpa`命令查看当前影响 HorizontalPodAutoscaler 的各种状态条件信息：

```shell
kubectl describe hpa cm-test
```
```shell
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
首先，`AbleToScale` 表明 HPA 是否可以获取和更新伸缩信息，以及是否存在阻止伸缩的各种回退条件。
其次，`ScalingActive` 表明HPA是否被启用（即目标的副本数量不为零） 以及是否能够完成伸缩计算。
当这一状态为 `False` 时，通常表明获取度量指标存在问题。
最后一个条件 `ScalingLimitted` 表明所需伸缩的值被 HorizontalPodAutoscaler 所定义的最大或者最小值所限制（即已经达到最大或者最小伸缩值）。
这通常表明您可能需要调整 HorizontalPodAutoscaler 所定义的最大或者最小副本数量的限制了。

<!--
## Appendix: Quantities
-->
## 附录：Quantities

<!--
All metrics in the HorizontalPodAutoscaler and metrics APIs are specified using
a special whole-number notation known in Kubernetes as a *quantity*.  For example,
the quantity `10500m` would be written as `10.5` in decimal notation.  The metrics APIs
will return whole numbers without a suffix when possible, and will generally return
quantities in milli-units otherwise.  This means you might see your metric value fluctuate
between `1` and `1500m`, or `1` and `1.5` when written in decimal notation.  See the
[glossary entry on quantities](/docs/reference/glossary?core-object=true#term-quantity) for more information.
-->
HorizontalPodAutoscaler 和 metrics api 中的所有的度量指标使用 Kubernetes 中称为 *quantity* （）殊整数表示。
例如，数量`10500m`用十进制表示为`10.5`。
如果可能的话，metrics api 将返回没有后缀的整数，否则返回以千分单位的数量。
这意味着您可能会看到您的度量指标在`1`和`1500m`之间波动，或者在十进制记数法中的`1`和`1.5`。
更多信息，请参阅[度量术语](/docs/reference/glossary?core-object=true#term-quantity)

<!--
## Appendix: Other possible scenarios
-->
## 附录：其他可能的情况

<!--
### Creating the autoscaler declaratively
-->
### 使用YAML文件创建 autoscaler

<!--
Instead of using `kubectl autoscale` command to create a HorizontalPodAutoscaler imperatively we
can use the following file to create it declaratively:
-->
除了使用 `kubectl autoscale` 命令，也可以文件创建 HorizontalPodAutoscaler ：

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


