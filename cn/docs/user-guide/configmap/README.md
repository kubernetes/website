<!-- # ConfigMap example -->
# ConfigMap 示例



<!-- ## Step Zero: Prerequisites -->
## 第0步：先决条件

<!-- This example assumes you have a Kubernetes cluster installed and running, and that you have
installed the `kubectl` command line tool somewhere in your path. Please see [pick the right solution
started](/docs/setup/pick-right-solution/) for installation instructions for your platform. -->
本例假定您已经安装好一个 Kubernetes 集群并正在运行，并在您的路径中安装了 `kubectl` 命令行工具。 请访问 [选择正确的解决方案](/docs/setup/pick-right-solution/) 查看适合您的平台的安装说明。

<!-- ## Step One: Create the ConfigMap -->
## 第1步：创建 ConfigMap

<!-- A ConfigMap contains a set of named strings. -->
一个 ConfigMap 包含一组命名的字符串

<!-- Use the [`configmap.yaml`](configmap.yaml) file to create a ConfigMap: -->
使用 [`configmap.yaml`](configmap.yaml) 文件创建一个 ConfigMap ：

```shell
$ kubectl create -f docs/user-guide/configmap/configmap.yaml
```

<!-- You can use `kubectl` to see information about the ConfigMap: -->
您可以使用 `kubectl` 查看关于这个 ConfigMap 的信息：

```shell
$ kubectl get configmap
NAME                   DATA      AGE
test-configmap         2         6s

$ kubectl describe configMap test-configmap
Name:          test-configmap
Labels:        <none>
Annotations:   <none>

Data
====
data-1: 7 bytes
data-2: 7 bytes
```

<!-- View the values of the keys with `kubectl get`: -->
使用 `kubectl get` 查看 ConfigMap 中存储的键值对：

```shell
$ kubectl get configmaps test-configmap -o yaml
apiVersion: v1
data:
  data-1: value-1
  data-2: value-2
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T20:28:50Z
  name: test-configmap
  namespace: default
  resourceVersion: "1090"
  selfLink: /api/v1/namespaces/default/configmaps/test-configmap
  uid: 384bd365-d67e-11e5-8cd0-68f728db1985
```

<!-- ## Step Two: Create a pod that consumes a configMap in environment variables -->
## 第2步：创建一个 pod 并在其环境变量中使用 configMap

<!-- Use the [`env-pod.yaml`](env-pod.yaml) file to create a Pod that consumes the
ConfigMap in environment variables. -->
使用 [`env-pod.yaml`](env-pod.yaml) 文件创建一个 Pod 并在其环境变量中使用 ConfigMap ：

```shell
$ kubectl create -f docs/user-guide/configmap/env-pod.yaml
```

<!-- This pod runs the `env` command to display the environment of the container: -->
这个 pod 运行 `env` 命令来展示容器中的环境变量：

```shell
$ kubectl logs config-env-test-pod | grep KUBE_CONFIG
KUBE_CONFIG_1=value-1
KUBE_CONFIG_2=value-2
```

<!-- ## Step Three: Create a pod that sets the command line using ConfigMap -->
## 第3步：创建一个 pod 并使用 ConfigMap 设置其命令行

<!-- Use the [`command-pod.yaml`](command-pod.yaml) file to create a Pod with a container
whose command is injected with the keys of a ConfigMap: -->
使用 [`command-pod.yaml`](command-pod.yaml) 文件创建一个 Pod 并将 ConfigMap 的键注入容器的命令行：

```shell
$ kubectl create -f docs/user-guide/configmap/command-pod.yaml
```

<!-- This pod runs an `echo` command to display the keys: -->
这个 pod 运行 `echo` 命令来展示这些键对应的值：

```shell
$ kubectl logs config-cmd-test-pod
value-1 value-2
```

<!-- ## Step Four: Create a pod that consumes a configMap in a volume -->
## 第4步：创建一个在 volume 中使用 configMap 的 pod

<!-- Pods can also consume ConfigMaps in volumes.  Use the [`volume-pod.yaml`](volume-pod.yaml) file to create a Pod that consumes the ConfigMap in a volume. -->
Pod 也可以在 volume 中使用 ConfigMap 。使用 [`volume-pod.yaml`](volume-pod.yaml) 文件来创建一个 Pod 并在其 volume 中使用 ConfigMap ：

```shell
$ kubectl create -f docs/user-guide/configmap/volume-pod.yaml
```

<!-- This pod runs a `cat` command to print the value of one of the keys in the volume: -->
这个 pod 运行 `cat` 命令来打印 volume 中某个键对应的值：

```shell
$ kubectl logs config-volume-test-pod
value-1
```

<!-- Alternatively you can use [`mount-file-pod.yaml`](mount-file-pod.yaml) file to mount
only a file from ConfigMap, preserving original content of /etc directory. -->
或者您也可以使用 [`mount-file-pod.yaml`](mount-file-pod.yaml) 文件仅从 ConfigMap 中挂载一个文件，并保留 /etc 目录中其他原始内容。
