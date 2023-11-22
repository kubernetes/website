---
title: 通过环境变量将 Pod 信息呈现给容器
content_type: task
weight: 30
---
<!--
title: Expose Pod Information to Containers Through Environment Variables
content_type: task
weight: 30
-->
<!-- overview -->

<!--
This page shows how a Pod can use environment variables to expose information
about itself to containers running in the Pod, using the _downward API_.
You can use environment variables to expose Pod fields, container fields, or both.
-->
此页面展示 Pod 如何使用 **downward API** 通过环境变量把自身的信息呈现给 Pod 中运行的容器。
你可以使用环境变量来呈现 Pod 的字段、容器字段或两者。

<!--
In Kubernetes, there are two ways to expose Pod and container fields to a running container:

* _Environment variables_, as explained in this task
* [Volume files](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

Together, these two ways of exposing Pod and container fields are called the
downward API.

As Services are the primary mode of communication between containerized applications managed by Kubernetes, 
it is helpful to be able to discover them at runtime. 

Read more about accessing Services [here](/docs/tutorials/services/connect-applications-service/#accessing-the-service).
-->
在 Kubernetes 中有两种方式可以将 Pod 和容器字段呈现给运行中的容器：

* 如本任务所述的**环境变量**
* [卷文件](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)

这两种呈现 Pod 和容器字段的方式统称为 downward API。

Service 是 Kubernetes 管理的容器化应用之间的主要通信模式，因此在运行时能发现这些 Service 是很有帮助的。

在[这里](/zh-cn/docs/tutorials/services/connect-applications-service/#accessing-the-service)
阅读更多关于访问 Service 的信息。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

<!--
## Use Pod fields as values for environment variables

In this part of exercise, you create a Pod that has one container, and you
project Pod-level fields into the running container as environment variables.
-->
## 用 Pod 字段作为环境变量的值   {#use-pod-fields-as-values-for-env-var}

在这部分练习中，你将创建一个包含一个容器的 Pod。并将 Pod 级别的字段作为环境变量投射到正在运行的容器中。

{{% code_sample file="pods/inject/dapi-envars-pod.yaml" %}}

<!--
In that manifest, you can see five environment variables. The `env`
field is an array of
environment variable definitions.
The first element in the array specifies that the `MY_NODE_NAME` environment
variable gets its value from the Pod's `spec.nodeName` field. Similarly, the
other environment variables get their names from Pod fields.
-->
这个清单中，你可以看到五个环境变量。`env` 字段定义了一组环境变量。
数组中第一个元素指定 `MY_NODE_NAME` 这个环境变量从 Pod 的 `spec.nodeName` 字段获取变量值。
同样，其它环境变量也是从 Pod 的字段获取它们的变量值。

{{< note >}}
<!--
The fields in this example are Pod fields. They are not fields of the
container in the Pod.
-->
本示例中的字段是 Pod 字段，不是 Pod 中 Container 的字段。
{{< /note >}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-pod.yaml
```

<!--
Verify that the Container in the Pod is running:
-->
验证 Pod 中的容器运行正常：

```shell
# 如果新创建的 Pod 还是处于不健康状态，请重新运行此命令几次。
kubectl get pods
```

<!--
View the container's logs:
-->
查看容器日志：

```shell
kubectl logs dapi-envars-fieldref
```

<!--
The output shows the values of selected environment variables:
-->
输出信息显示了所选择的环境变量的值：

```
minikube
dapi-envars-fieldref
default
172.17.0.4
default
```

<!--
To see why these values are in the log, look at the `command` and `args` fields
in the configuration file. When the container starts, it writes the values of
five environment variables to stdout. It repeats this every ten seconds.

Next, get a shell into the container that is running in your Pod:
-->
要了解为什么这些值出现在日志中，请查看配置文件中的 `command` 和 `args` 字段。
当容器启动时，它将五个环境变量的值写入标准输出。每十秒重复执行一次。

接下来，进入 Pod 中运行的容器，打开一个 Shell：

```shell
kubectl exec -it dapi-envars-fieldref -- sh
```

<!--
In your shell, view the environment variables:
-->
在 Shell 中，查看环境变量：

```shell
# 在容器内的 `shell` 中运行
printenv
```

<!--
The output shows that certain environment variables have been assigned the
values of Pod fields:
-->
输出信息显示环境变量已经设置为 Pod 字段的值。

```
MY_POD_SERVICE_ACCOUNT=default
...
MY_POD_NAMESPACE=default
MY_POD_IP=172.17.0.4
...
MY_NODE_NAME=minikube
...
MY_POD_NAME=dapi-envars-fieldref
```

<!--
## Use container fields as values for environment variables

In the preceding exercise, you used information from Pod-level fields as the values
for environment variables.
In this next exercise, you are going to pass fields that are part of the Pod
definition, but taken from the specific
[container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)
rather than from the Pod overall.

Here is a manifest for another Pod that again has just one container:
-->
## 使用容器字段作为环境变量的值    {#use-container-fields-as-value-for-env-var}

前面的练习中，你将 Pod 级别的字段作为环境变量的值。
接下来这个练习中，你将传递属于 Pod 定义的字段，但这些字段取自特定容器而不是整个 Pod。

这里是只包含一个容器的 Pod 的清单：

{{% code_sample file="pods/inject/dapi-envars-container.yaml" %}}

<!--
In this manifest, you can see four environment variables. The `env`
field is an array of
environment variable definitions.
The first element in the array specifies that the `MY_CPU_REQUEST` environment
variable gets its value from the `requests.cpu` field of a container named
`test-container`. Similarly, the other environment variables get their values
from fields that are specific to this container.

Create the Pod:
-->
这个清单中，你可以看到四个环境变量。`env` 字段定义了一组环境变量。
数组中第一个元素指定 `MY_CPU_REQUEST` 这个环境变量从容器的 `requests.cpu`
字段获取变量值。同样，其它的环境变量也是从特定于这个容器的字段中获取它们的变量值。

创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-container.yaml
```

<!--
Verify that the container in the Pod is running:
-->
验证 Pod 中的容器运行正常：

```shell
# 如果新创建的 Pod 还是处于不健康状态，请重新运行此命令几次。
kubectl get pods
```

<!--
View the container's logs:
-->
查看容器日志：

```shell
kubectl logs dapi-envars-resourcefieldref
```

<!--
The output shows the values of selected environment variables:
-->
输出信息显示了所选择的环境变量的值：

```
1
1
33554432
67108864
```

## {{% heading "whatsnext" %}}

<!--
* Read [Defining Environment Variables for a Container](/docs/tasks/inject-data-application/define-environment-variable-container/)
* Read the [`spec`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
  API definition for Pod. This includes the definition of Container (part of Pod).
* Read the list of [available fields](/docs/concepts/workloads/pods/downward-api/#available-fields) that you
  can expose using the downward API.
-->
* 阅读[给容器定义环境变量](/zh-cn/docs/tasks/inject-data-application/define-environment-variable-container/)
* 阅读 Pod 的 [`spec`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
  API 包括容器（Pod 的一部分）的定义。
* 阅读可以使用 downward API 呈现的[可用字段](/zh-cn/docs/concepts/workloads/pods/downward-api/#available-fields)列表。

<!--
Read about Pods, containers and environment variables in the legacy API reference:

* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [EnvVar](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)
-->
在旧版 API 参考中阅读有关 Pod、容器和环境变量的信息：

* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [EnvVar](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)
