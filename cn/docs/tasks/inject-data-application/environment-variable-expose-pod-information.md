---
title: 通过环境变量将Pod信息呈现给容器
---

{% capture overview %}

此页面显示了Pod如何使用环境变量把自己的信息呈现给pod中运行的容器。环境变量可以呈现pod的字段和容器字段。

有两种方式可以将Pod和Container字段呈现给运行中的容器：
环境变量 和[DownwardAPIVolumeFiles](/docs/resources-reference/{{page.version}}/#downwardapivolumefile-v1-core).
这两种呈现Pod和Container字段的方式都称为*Downward API*。

{% endcapture %}


{% capture prerequisites %}

{% include task-tutorial-prereqs.md %}

{% endcapture %}


{% capture steps %}

## Downward API

有两种方式可以将Pod和Container字段呈现给运行中的容器：

* 环境变量
* [DownwardAPIVolumeFiles](/docs/resources-reference/{{page.version}}/#downwardapivolumefile-v1-core)

这两种呈现Pod和Container字段的方式都称为*Downward API*。


## 用Pod字段作为环境变量的值

在这个练习中，你将创建一个包含一个容器的pod。这是该pod的配置文件：

{% include code.html language="yaml" file="dapi-envars-pod.yaml" ghlink="/cn/docs/tasks/inject-data-application/dapi-envars-pod.yaml" %}

这个配置文件中，你可以看到五个环境变量。`env`字段是一个[EnvVars](/docs/resources-reference/{{page.version}}/#envvar-v1-core)类型的数组。
数组中第一个元素指定`MY_NODE_NAME`这个环境变量从Pod的`spec.nodeName`字段获取变量值。同样，其它环境变量也是从Pod的字段获取它们的变量值。

**注意:** 本示例中的字段是Pod字段，不是Pod中容器的字段。
{: .note}

创建Pod：

```shell
kubectl create -f https://k8s.io/cn/docs/tasks/inject-data-application/dapi-envars-pod.yaml
```

验证Pod中的容器运行正常：

```
kubectl get pods
```

查看容器日志：

```
kubectl logs dapi-envars-fieldref
```

输出信息显示了所选择的环境变量的值：

```
minikube
dapi-envars-fieldref
default
172.17.0.4
default
```

要了解为什么这些值在日志中，请查看配置文件中的`command` 和 `args`字段。 当容器启动时，它将五个环境变量的值写入stdout。每十秒重复执行一次。

接下来，进入Pod中运行的容器，打开一个shell：

```
kubectl exec -it dapi-envars-fieldref -- sh
```

在shell中，查看环境变量：

```
/# printenv
```

输出信息显示环境变量已经指定为Pod的字段的值。

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

## 用容器字段作为环境变量的值

前面的练习中，你将Pod字段作为环境变量的值。接下来这个练习，你将用容器字段作为环境变量的值。这里是包含一个容器的pod的配置文件：

{% include code.html language="yaml" file="dapi-envars-container.yaml" ghlink="/cn/docs/tasks/inject-data-application/dapi-envars-container.yaml" %}

这个配置文件中，你可以看到四个环境变量。`env`字段是一个[EnvVars](/docs/resources-reference/{{page.version}}/#envvar-v1-core)
类型的数组。数组中第一个元素指定`MY_CPU_REQUEST`这个环境变量从容器的`requests.cpu`字段获取变量值。同样，其它环境变量也是从容器的字段获取它们的变量值。

创建Pod：

```shell
kubectl create -f https://k8s.io/cn/docs/tasks/inject-data-application/dapi-envars-container.yaml
```

验证Pod中的容器运行正常：

```
kubectl get pods
```

查看容器日志：

```
kubectl logs dapi-envars-resourcefieldref
```

输出信息显示了所选择的环境变量的值：

```
1
1
33554432
67108864
```

{% endcapture %}

{% capture whatsnext %}

* [给容器定义环境变量](/docs/tasks/configure-pod-container/define-environment-variable-container/)
* [PodSpec](/docs/resources-reference/{{page.version}}/#podspec-v1-core)
* [Container](/docs/resources-reference/{{page.version}}/#container-v1-core)
* [EnvVar](/docs/resources-reference/{{page.version}}/#envvar-v1-core)
* [EnvVarSource](/docs/resources-reference/{{page.version}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/resources-reference/{{page.version}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/resources-reference/{{page.version}}/#resourcefieldselector-v1-core)

{% endcapture %}


{% include templates/task.md %}
