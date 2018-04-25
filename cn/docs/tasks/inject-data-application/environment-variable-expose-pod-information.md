---
title: 通过环境变量向容器暴露 Pod 信息
cn-approvers:
- chentao1596
---
<!--
---
title: Expose Pod Information to Containers Through Environment Variables
---
-->

{% capture overview %}

<!--
This page shows how a Pod can use environment variables to expose information
about itself to Containers running in the Pod. Environment variables can expose
Pod fields and Container fields.
-->
本页展示了 Pod 如何使用环境变量向 Pod 中运行的容器暴露有关自身的信息。环境变量可以暴露 Pod 字段和容器字段。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

<!--
## The Downward API
-->
## Downward API

<!--
There are two ways to expose Pod and Container fields to a running Container:
-->
有两种方式将 Pod 和容器字段暴露给运行中的容器：

<!--
* Environment variables
* [DownwardAPIVolumeFiles](/docs/api-reference/{{page.version}}/#downwardapivolumefile-v1-core)
-->
* 环境变量
* [DownwardAPIVolumeFiles](/docs/api-reference/{{page.version}}/#downwardapivolumefile-v1-core)

<!--
Together, these two ways of exposing Pod and Container fields are called the
*Downward API*.
-->
这两种暴露 Pod 和容器字段的方式被称为 *Downward API*。

<!--
## Use Pod fields as values for environment variables
-->
## 使用 Pod 字段作为环境变量的值

<!--
In this exercise, you create a Pod that has one Container. Here is the
configuration file for the Pod:
-->
在本练习中，您将创建一个有一个容器的 Pod。下面是POD的配置文件：

{% include code.html language="yaml" file="dapi-envars-pod.yaml" ghlink="/docs/tasks/inject-data-application/dapi-envars-pod.yaml" %}

<!--
In the configuration file, you can see five environment variables. The `env`
field is an array of
[EnvVars](/docs/api-reference/{{page.version}}/#envvar-v1-core).
The first element in the array specifies that the `MY_NODE_NAME` environment
variable gets its value from the Pod's `spec.nodeName` field. Similarly, the
other environment variables get their names from Pod fields.
-->
在配置文件中，您可以看到五个环境变量。`env` 字段是  [EnvVars](/docs/api-reference/{{page.version}}/#envvar-v1-core) 的数组。数组中的第一个元素指定 `MY_NODE_NAME` 环境变量从 Pod 的 `spec.nodeName` 字段中获取其值。类似地，其他环境变量从 Pod 字段中获取它们的名称。

<!--
**Note:** The fields in this example are Pod fields. They are not fields of the
Container in the Pod.
-->
**注意：** 示例中的字段是 Pod 的字段。它们不是 Pod 中的容器的字段。
{: .note}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/inject-data-application/dapi-envars-pod.yaml
```

<!--
Verify that the Container in the Pod is running:
-->
验证 Pod 中的容器是 running 状态：

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
输出显示选定的环境变量的值：

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
-->
想要知道为什么这些值会打印在日志中，请查看配置文件的 `command` 和 `args` 字段。当容器启动时，它将 5 个环境变量的值写到标准输出中。每十秒钟重复一次。

<!--
Next, get a shell into the Container that is running in your Pod:
-->
接下来，将一个 shell 放入正在您的 Pod 中运行的容器里面：

```
kubectl exec -it dapi-envars-fieldref -- sh
```

<!--
In your shell, view the environment variables:
-->
在 shell 中，查看环境变量：

```
/# printenv
```

<!--
The output shows that certain environment variables have been assigned the
values of Pod fields:
-->
输出结果显示，某些环境变量已被指定为 Pod 字段的值：

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
-->
## 使用容器字段作为环境变量的值

<!--
In the preceding exercise, you used Pod fields as the values for environment
variables. In this next exercise, you use Container fields as the values for
environment variables. Here is the configuration file for a Pod that has one
container:
-->
在前面的练习中，您使用 Pod 字段作为环境变量的值。在下一个练习中，您将使用容器字段用作环境变量的值。下面是一个 Pod 的配置文件，其中包含一个容器：

{% include code.html language="yaml" file="dapi-envars-container.yaml" ghlink="/docs/tasks/inject-data-application/dapi-envars-container.yaml" %}

<!--
In the configuration file, you can see four environment variables. The `env`
field is an array of
[EnvVars](/docs/api-reference/{{page.version}}/#envvar-v1-core).
The first element in the array specifies that the `MY_CPU_REQUEST` environment
variable gets its value from the `requests.cpu` field of a Container named
`test-container`. Similarly, the other environment variables get their values
from Container fields.
-->
在配置文件中，您可以看到四个环境变量。`env` 字段是 [EnvVars](/docs/api-reference/{{page.version}}/#envvar-v1-core) 的数组。数组中的第一个元素指定 `MY_CPU_REQUEST` 环境变量从名为 `test-container` 的容器的 `requests.cpu` 字段中获取其值。类似地，其他环境变量从容器字段中获取它们的值。

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl create -f https://k8s.io/docs/tasks/inject-data-application/dapi-envars-container.yaml
```

<!--
Verify that the Container in the Pod is running:
-->
验证 Pod 中的容器是 running 状态：

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
输出展示了选定环境变量的值：

```
1
1
33554432
67108864
```

{% endcapture %}

{% capture whatsnext %}

<!--
* [Defining Environment Variables for a Container](/docs/tasks/inject-data-application/define-environment-variable-container/)
-->
* [为容器定义环境变量](/docs/tasks/inject-data-application/define-environment-variable-container/)
* [PodSpec](/docs/api-reference/{{page.version}}/#podspec-v1-core)
* [Container](/docs/api-reference/{{page.version}}/#container-v1-core)
* [EnvVar](/docs/api-reference/{{page.version}}/#envvar-v1-core)
* [EnvVarSource](/docs/api-reference/{{page.version}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/api-reference/{{page.version}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/api-reference/{{page.version}}/#resourcefieldselector-v1-core)

{% endcapture %}


{% include templates/task.md %}

