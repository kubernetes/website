---
title: 使用 Init 容器定义环境变量值
content_type: task
min-kubernetes-server-version: v1.34
weight: 30
---
<!--
title: Define Environment Variable Values Using An Init Container
content_type: task
min-kubernetes-server-version: v1.34
weight: 30
-->

<!-- overview -->

{{< feature-state feature_gate_name="EnvFiles" >}}

<!--
This page show how to configure environment variables for containers in a Pod via file.
-->
本页展示如何通过文件为 Pod 中的容器配置环境变量。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{% version-check %}}

<!-- steps -->

<!--
## How the design works

In this exercise, you will create a Pod that sources environment variables from files, 
projecting these values into the running container.
-->
## 设计原理  {#how-the-design-works}

在本练习中，你将创建从文件中获取环境变量的 Pod，并将这些环境变量值投射到正在运行的容器中。

{{% code_sample file="pods/inject/envars-file-container.yaml" %}}

<!--
In this manifest, you can see the `initContainer` mounts an `emptyDir` volume and writes environment variables to a file within it,
and the regular containers reference both the file and the environment variable key 
through the `fileKeyRef` field without needing to mount the volume. 
When `optional` field is set to false, the specified `key` in `fileKeyRef` must exist in the environment variables file.
-->
在上述清单中，你可以看到 `initContainer` 挂载一个 `emptyDir` 卷，并将环境变量写入到其中的某个文件，
而普通容器无需挂载卷，通过 `fileKeyRef` 字段引用此文件和环境变量键。
当 `optional` 字段设置为 false 时，`fileKeyRef` 中指定的 `key` 必须存在于环境变量文件中。

<!--
The volume will only be mounted to the container that writes to the file
(`initContainer`), while the consumer container that consumes the environment variable will not have the volume mounted.

The env file format adheres to the [kubernetes env file standard](/docs/tasks/inject-data-application/define-environment-variable-via-file/#env-file-syntax).

During container initialization, the kubelet retrieves environment variables 
from specified files in the `emptyDir` volume and exposes them to the container.
-->
此卷只会挂载到写入文件的容器（`initContainer`）中，而使用环境变量的容器将不挂载此卷。

环境变量文件格式遵循
[Kubernetes Env 文件标准](/zh-cn/docs/tasks/inject-data-application/define-environment-variable-via-file/#env-file-syntax)。

在容器初始化期间，kubelet 从 `emptyDir` 卷中指定的文件中获取环境变量，并将这些环境变量暴露给容器。

{{< note >}}
<!--
All container types (initContainers, regular containers, sidecars containers,
and ephemeral containers) support environment variable loading from files.

While these environment variables can store sensitive information, 
`emptyDir` volumes don't provide the same protection mechanisms as
dedicated Secret objects. Therefore, exposing confidential environment variables 
to containers through this feature is not considered a security best practice.
-->
所有类型的容器（initContainers、普通容器、边车容器和临时容器）都支持从文件加载环境变量。

虽然这些环境变量可以存储敏感信息，但 `emptyDir` 卷并不提供与专用 Secret 对象相同的保护机制。
因此，通过此特性向容器暴露机密环境变量不被视为安全最佳实践。
{{< /note >}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/envars-file-container.yaml
```

<!--
Verify that the container in the Pod is running:

```shell
# If the new Pod isn't yet healthy, rerun this command a few times.
kubectl get pods
```
-->
验证 Pod 中的容器是否在运行：

```shell
# 如果新 Pod 尚未就绪，多次运行此命令。
kubectl get pods
```

<!--
Check container logs for environment variables:
-->
检查容器日志中的环境变量：

```shell
kubectl logs dapi-test-pod -c use-envfile | grep DB_ADDRESS
```

<!--
The output shows the values of selected environment variables:
-->
输出显示所选环境变量的值：

```
DB_ADDRESS=address
```

<!--
## Env File Syntax {#env-file-syntax}

The format of Kubernetes env files originates from `.env` files.

In a shell environment, `.env` files are typically loaded using the `source .env` command.

For Kubernetes, the defined env file format adheres to stricter syntax rules:
-->
## Env 文件语法 {#env-file-syntax}

Kubernetes Env 文件格式源自 `.env` 文件。

在 Shell 环境中，`.env` 文件通常使用 `source .env` 命令加载。

对于 Kubernetes，定义的 Env 文件格式遵循更严格的语法规则：

<!--
* Blank Lines: Blank lines are ignored.

* Leading Spaces: Leading spaces on all lines are ignored.

* Variable Declaration: Variables must be declared as `VAR=VAL`. Spaces surrounding `=` and trailing spaces are ignored.
-->
* 空行：空行会被忽略。
* 行首空格：所有行的行首空格会被忽略。
* 变量声明：变量必须声明为 `VAR=VAL`。`=` 两侧的空格和行尾空格会被忽略。

  ```
  VAR=VAL → VAL
  ```

<!--
* Comments: Lines beginning with # are treated as comments and ignored.

  ```
  # comment
  VAR=VAL → VAL

  VAR=VAL # not a comment → VAL # not a comment
  ```
-->
* 注释：以 # 开头的行被视为注释并忽略。

  ```
  # 注释
  VAR=VAL → VAL

  VAR=VAL # 不是注释 → VAL # 不是注释
  ```

<!--
* Line Continuation: A backslash (`\`) at the end of a variable declaration line indicates the value continues on the next line. The lines are joined with a single space.
-->
* 换行续行：在变量声明行末使用反斜杠 (`\`) 表示值在下一行继续。行与行之间用单个空格连接。

  ```
  VAR=VAL \
  VAL2
  → VAL VAL2
  ```

## {{% heading "whatsnext" %}}

<!--
* Learn more about [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Read [Defining Environment Variables for a Container](/docs/tasks/inject-data-application/define-environment-variable-container/)
* Read [Expose Pod Information to Containers Through Environment Variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information)
-->
* 进一步学习[环境变量](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)。
* 阅读[为容器定义环境变量](/zh-cn/docs/tasks/inject-data-application/define-environment-variable-container/)。
* 阅读[通过环境变量向容器暴露 Pod 信息](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)。
