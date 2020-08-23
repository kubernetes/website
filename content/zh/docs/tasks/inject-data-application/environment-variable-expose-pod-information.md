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
about itself to Containers running in the Pod. Environment variables can expose
Pod fields and Container fields.
-->
此页面展示 Pod 如何使用环境变量把自己的信息呈现给 Pod 中运行的容器。
环境变量可以呈现 Pod 的字段和容器字段。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Downward API

<!--
There are two ways to expose Pod and Container fields to a running Container:

* Environment variables
* [Volume Files](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#the-downward-api)

Together, these two ways of exposing Pod and Container fields are called the
*Downward API*.
-->

有两种方式可以将 Pod 和 Container 字段呈现给运行中的容器：

* 环境变量
* [卷文件](/docs/resources-reference/{{< param "version" >}}/#downwardapivolumefile-v1-core)

这两种呈现 Pod 和 Container 字段的方式统称为 *Downward API*。

<!--
## Use Pod fields as values for environment variables

In this exercise, you create a Pod that has one Container. Here is the
configuration file for the Pod:
-->
## 用 Pod 字段作为环境变量的值

在这个练习中，你将创建一个包含一个容器的 Pod。这是该 Pod 的配置文件：

{{< codenew file="pods/inject/dapi-envars-pod.yaml" >}}

<!--
In the configuration file, you can see five environment variables. The `env`
field is an array of
[EnvVars](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core).
The first element in the array specifies that the `MY_NODE_NAME` environment
variable gets its value from the Pod's `spec.nodeName` field. Similarly, the
other environment variables get their names from Pod fields.
-->
这个配置文件中，你可以看到五个环境变量。`env` 字段是一个
[EnvVars](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core).
对象的数组。
数组中第一个元素指定 `MY_NODE_NAME` 这个环境变量从 Pod 的 `spec.nodeName` 字段获取变量值。
同样，其它环境变量也是从 Pod 的字段获取它们的变量值。

<!--
The fields in this example are Pod fields. They are not fields of the
Container in the Pod.
-->
{{< note >}}
本示例中的字段是 Pod 字段，不是 Pod 中 Container 的字段。
{{< /note >}}

<!--
Create the Pod:
-->
创建Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-pod.yaml
```

<!--
Verify that the Container in the Pod is running:
-->
验证 Pod 中的容器运行正常：

```
kubectl get pods
```

<!--
View the Container's logs:
-->
查看容器日志：

```
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
in the configuration file. When the Container starts, it writes the values of
five environment variables to stdout. It repeats this every ten seconds.

Next, get a shell into the Container that is running in your Pod:
-->
要了解为什么这些值在日志中，请查看配置文件中的`command` 和 `args`字段。
当容器启动时，它将五个环境变量的值写入 stdout。每十秒重复执行一次。

接下来，通过打开一个 Shell 进入 Pod 中运行的容器：

```
kubectl exec -it dapi-envars-fieldref -- sh
```

<!--
In your shell, view the environment variables:
-->
在 Shell 中，查看环境变量：

```
/# printenv
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
## Use Container fields as values for environment variables

In the preceding exercise, you used Pod fields as the values for environment
variables. In this next exercise, you use Container fields as the values for
environment variables. Here is the configuration file for a Pod that has one
container:
-->
## 用 Container 字段作为环境变量的值

前面的练习中，你将 Pod 字段作为环境变量的值。
接下来这个练习中，你将用 Container 字段作为环境变量的值。这里是包含一个容器的 Pod 的配置文件：

{{< codenew file="pods/inject/dapi-envars-container.yaml" >}}

<!--
In the configuration file, you can see four environment variables. The `env`
field is an array of
[EnvVars](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core).
The first element in the array specifies that the `MY_CPU_REQUEST` environment
variable gets its value from the `requests.cpu` field of a Container named
`test-container`. Similarly, the other environment variables get their values
from Container fields.

The fields in this example are Pod fields. They are not fields of the
Container in the Pod.

Create the Pod:
-->
这个配置文件中，你可以看到四个环境变量。`env` 字段是一个
[EnvVars](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core).
对象的数组。数组中第一个元素指定 `MY_CPU_REQUEST` 这个环境变量从 Container 的 `requests.cpu`
字段获取变量值。同样，其它环境变量也是从 Container 的字段获取它们的变量值。

{{< note >}}
本例中使用的是 Container 的字段而不是 Pod 的字段。
{{< /note >}}

创建Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-container.yaml
```

<!--
Verify that the Container in the Pod is running:
-->
验证 Pod 中的容器运行正常：

```
kubectl get pods
```

<!--
View the Container's logs:
-->
查看容器日志：

```
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
* [Defining Environment Variables for a Container](/docs/tasks/inject-data-application/define-environment-variable-container/)
* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [EnvVar](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)
-->

* [给容器定义环境变量](/zh/docs/tasks/inject-data-application/define-environment-variable-container/)
* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [EnvVar](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)

