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
在上述清单中，你可以看到 `initContainer` 挂载一个 `emptyDir` 卷，
并将环境变量写入到其中的某个文件，
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

在容器初始化期间，kubelet 从 `emptyDir` 卷中指定的文件中获取环境变量，
并将这些环境变量暴露给容器。

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
## Env File syntax {#env-file-syntax}

The env file format used by Kubernetes is a well-defined subset of the environment variable semantics for POSIX-compliant bash. Any env file supported by Kubernetes will produce the same environment variables as when interpreted by a POSIX-compliant bash. However, POSIX-compliant bash supports some additional formats that Kubernetes does not accept.

Example:
-->
## Env 文件语法 {#env-file-syntax}

Kubernetes 使用的 Env 文件格式是符合 POSIX 标准的 Bash 环境变量语义的一个定义明确的子集。
Kubernetes 所支持的所有 Env 文件都会生成与被符合 POSIX 标准的 Bash
解释时相同的环境变量。但是，符合 POSIX 标准的 Bash 支持一些 Kubernetes 不接受的额外格式。

事例：

```
MY_VAR='my-literal-value'
```

<!--
### Rules

* Variable declaration: Use the form `VAR='value'`. Spaces surrounding `=` are ignored; leading spaces on a line are ignored; blank lines are ignored.
* Quoted values: Values must be enclosed in single quotes (`'`).
  * The content inside single quotes is preserved literally. No escape-sequence processing, whitespace folding, or character interpretation is applied.
  * Newlines inside single quotes are preserved (multi-line values are supported).
* Comments: Lines that begin with `#` are treated as comments and ignored. A `#` character inside a single-quoted value is not a comment.
-->
### 规则

* 变量声明：使用 `VAR='value'` 的形式。`=` 前后空格将被忽略；行首空格将被忽略；空行将被忽略。
* 带引号的值：值必须用单引号（`'`）括起来。 
  * 单引号内的内容将按原样保留。不会进行转义序列处理、空格折叠或字符解释。 
  * 单引号内的换行符将被保留（支持多行值）。
* 注释：以 `#` 开头的行将被视为注释并被忽略。单引号内的值中的 `#` 字符不是注释。

<!--
Examples:
-->
事例：

```
# comment
DB_ADDRESS='address'

MULTI='line1
line2'
```

<!--
### Unsupported forms
-->
### 不支持的表单

<!--
* Unquoted values are **prohibited**:
  * `VAR=value` — not supported.
* Double-quoted values are **prohibited**:
  * `VAR="value"` — not supported.
* Multiple adjacent quoted strings are **not** supported:
  * `VAR='val1''val2'` — not supported.
* Any form of interpolation, expansion, or concatenation is **not** supported:
  * `VAR='a'$OTHER` or `VAR=${OTHER}` — not supported.
-->
* 禁止使用未加引号的值：
  * `VAR=value` — 不支持。
* 禁止使用双引号的值：
  * `VAR="value"` — 不支持。
* 禁止使用多个相邻的带引号的字符串：
  * `VAR='val1''val2'` — 不支持。
* 禁止使用任何形式的插值、扩展或连接：
  * `VAR='a'$OTHER` 或 `VAR=${OTHER}` — 不支持。

<!--
The strict single-quote requirement ensures the value is taken literally by the kubelet when loading environment variables from files
-->
严格的单引号要求确保 kubelet 在从文件中加载环境变量时，能够按字面意思理解该值。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Read [Defining Environment Variables for a Container](/docs/tasks/inject-data-application/define-environment-variable-container/)
* Read [Expose Pod Information to Containers Through Environment Variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information)
-->
* 进一步学习[环境变量](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)。
* 阅读[为容器定义环境变量](/zh-cn/docs/tasks/inject-data-application/define-environment-variable-container/)。
* 阅读[通过环境变量向容器暴露 Pod 信息](/zh-cn/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)。
