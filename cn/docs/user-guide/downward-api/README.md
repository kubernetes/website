<!--
Following these examples, you will create a pod with a container that consumes the pod's name,
namespace, and resource values using the [downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/).
-->
按照这些示例，您将创建有一个容器的 pod，该容器通过 [downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/) 获取 pod 的名字、命名空间和资源值。

<!--
## Step Zero: Prerequisites
-->
## 步骤 0：前提

<!--
This example assumes you have a Kubernetes cluster installed and running, and that you have
installed the `kubectl` command line tool somewhere in your path. Please see [pick the right solution](/docs/setup/pick-right-solution/) for installation instructions for your platform.
-->
该示例假定您已经拥有一个安装好且处于运行状态的 Kubernetes 集群，而且您已经在路径中的某个地方安装了 `kubectl` 命令行工具。请参考 [选择正确的解决方案](/docs/setup/pick-right-solution/) 来选择您的平台环境对应的安装说明。

<!--
## Step One: Create the pod
-->
## 步骤一：创建 pod

<!--
Containers consume the downward API using environment variables.  The downward API allows
containers to be injected with the name and namespace of the pod the container is in.
-->
容器通过环境变量访问 downward API。downward API 使得用户能够将容器所属 pod 的名称和命名空间注入容器中。

<!--
Use the [`dapi-pod.yaml`](dapi-pod.yaml) file to create a Pod with a container that consumes the
downward API.
-->
使用文件 [`dapi-pod.yaml`](dapi-pod.yaml) 创建拥有一个容器的 pod，该容器将访问 downward API。

```shell
$ kubectl create -f docs/user-guide/downward-api/dapi-pod.yaml
```

<!--
### Examine the logs
-->
### 检查日志

<!--
This pod runs the `env` command in a container that consumes the downward API.  You can grep
through the pod logs to see that the pod was injected with the correct values:
-->
在 pod 里的容器中运行 `env` 命令来访问 downward API。您可以通过对 pod 的日志执行 grep 操作来查看 pod 注入了正确的值：

```shell
$ kubectl logs dapi-test-pod | grep POD_
2015-04-30T20:22:18.568024817Z MY_POD_NAME=dapi-test-pod
2015-04-30T20:22:18.568087688Z MY_POD_NAMESPACE=default
2015-04-30T20:22:18.568092435Z MY_POD_IP=10.0.1.6
```

<!--
## Example of environment variables with container resources
-->
## 容器资源的环境变量示例

<!--
Use the [`dapi-container-resources.yaml`](dapi-container-resources.yaml) file to create a Pod
with a container that consumes the downward API exposing the container's resources.
-->
使用文件 [`dapi-container-resources.yaml`](dapi-container-resources.yaml) 创建拥有一个容器的 Pod，该容器将访问暴露容器资源的 downward API。

```shell
$ kubectl create -f docs/user-guide/downward-api/dapi-container-resources.yaml
```

<!--
### Examine the logs
-->
### 检查日志

<!--
Grep through the pod logs to see that the pod was injected with the correct values:
-->
通过对 pod 的日志执行 grep 操作来查看 pod 注入了正确的值：

```shell
$ kubectl logs dapi-test-pod | grep MY_
MY_MEM_LIMIT=67108864
MY_CPU_LIMIT=1
MY_MEM_REQUEST=33554432
MY_CPU_REQUEST=1
```
