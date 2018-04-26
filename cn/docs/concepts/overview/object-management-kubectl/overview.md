---
cn-approvers:
- lichuqiang
title: Kubernetes 对象管理
---
<!--
---
title: Kubernetes Object Management
---
-->

{% capture overview %}
<!--
The `kubectl` command-line tool supports several different ways to create and manage
Kubernetes objects. This document provides an overview of the different
approaches.
-->
`kubectl` 命令行工具支持多种不同的创建和管理 Kubernetes 对象的方法。
本文提供了对不同方法的概述。
{% endcapture %}

{% capture body %}

<!--
## Management techniques

**Warning:** A Kubernetes object should be managed using only one technique. Mixing
and matching techniques for the same object results in undefined behavior.
-->
## 管理技术

**警告：** 一种 Kubernetes 对象只应该用一种技术来管理。
针对同一对象的技术混合和竞争会导致未定义的行为。
<!--
| Management technique             | Operates on          |Recommended environment | Supported writers  | Learning curve |
|----------------------------------|----------------------|------------------------|--------------------|----------------|
| Imperative commands              | Live objects         | Development projects   | 1+                 | Lowest         |
| Imperative object configuration  | Individual files     | Production projects    | 1                  | Moderate       |
| Declarative object configuration | Directories of files | Production projects    | 1+                 | Highest        |
-->
| 管理技术        | 作用于     |推荐环境    | 支持的编写工具     | 学习曲线   |
|----------------|-----------|-----------|------------------|------------|
| 命令式的指令     | 活动对象   | 开发项目   | 1+               | 最低       |
| 命令式对象配置   | 单个文件   | 生产项目   | 1                | 中等       |
| 声明式对象配置   | 文件目录   | 生产项目   | 1+               | 最高       |

<!--
## Imperative commands

When using imperative commands, a user operates directly on live objects
in a cluster. The user provides operations to
the `kubectl` command as arguments or flags.
-->
##  命令式的指令

当使用命令式的指令时，用户直接在集群中的活动对象上操作。
用户提供操作，作为 `kubectl` 命令的参数或标记。

<!--
This is the simplest way to get started or to run a one-off task in
a cluster. Because this technique operates directly on live
objects, it provides no history of previous configurations.
-->
这是在集群中启动或运行一次性任务最简单的方法。
由于这种技术直接作用于活动对象，所以它不提供先前配置的历史。

<!--
### Examples

Run an instance of the nginx container by creating a Deployment object:
-->
### 示例

通过创建一个 Deployment 对象来运行一个 nginx 容器的实例：

```sh
kubectl run nginx --image nginx
```

<!--
Do the same thing using a different syntax:
-->
使用不同的语法做同样的事：

```sh
kubectl create deployment nginx --image nginx
```

<!--
### Trade-offs

Advantages compared to object configuration:
-->
### 权衡

与对象配置相比的优点：

<!--
- Commands are simple, easy to learn and easy to remember.
- Commands require only a single step to make changes to the cluster.
-->
- 命令简单，易于学习，易于记忆。
- 命令只需要一个步骤就可以完成对集群的修改。

<!--
Disadvantages compared to object configuration:

- Commands do not integrate with change review processes.
- Commands do not provide an audit trail associated with changes.
- Commands do not provide a source of records except for what is live.
- Commands do not provide a template for creating new objects.
-->
与对象配置相比的缺点：

- 命令没有与修改审查流程进行集成。
- 命令不提供与修改相关的审计跟踪。
- 除了活动对象，命令不提供记录来源。
- 命令不提供创建新对象的模板。

<!--
## Imperative object configuration

In imperative object configuration, the kubectl command specifies the
operation (create, replace, etc.), optional flags and at least one file
name. The file specified must contain a full definition of the object
in YAML or JSON format.
-->
## 命令式对象配置

在命令式对象配置中，kubectl 命令指定操作（创建、替换等）、可选参数和至少一个文件名称。
指定文件必须以 YAML 或 JSON 格式包含对象的完整定义。

<!--
See the [API reference](/docs/api-reference/{{page.version}}/)
for more details on object definitions.
-->
查看 [API 参考](/docs/api-reference/{{page.version}}/)
了解更多对象定义相关的详情。

<!--
**Warning:** The imperative `replace` command replaces the existing
spec with the newly provided one, dropping all changes to the object missing from
the configuration file.  This approach should not be used with resource
types whose specs are updated independently of the configuration file.
Services of type `LoadBalancer`, for example, have their `externalIPs` field updated
independently from the configuration by the cluster.
-->
**警告：** 命令式的 `replace` 命令会用新提供的 sepc 定义替换当前的 spec，
同时移除配置文件中缺失的所有对对象的修改。 该方法不应该被用于那些 spec 独立于配置文件进行更新的资源类型。
例如，`LoadBalancer` 类型的 Service 资源，它们的 `externalIPs` 字段是独立于配置，由集群进行更新的。

<!--
### Examples

Create the objects defined in a configuration file:
-->
### 示例

创建在配置文件中定义的对象：

```sh
kubectl create -f nginx.yaml
```

<!--
Delete the objects defined in two configuration files:
-->
删除两个配置文件中定义的对象：

```sh
kubectl delete -f nginx.yaml -f redis.yaml
```

<!--
Update the objects defined in a configuration file by overwriting
the live configuration:
-->
通过重写实时配置，更新配置文件中定义的对象。

```sh
kubectl replace -f nginx.yaml
```

<!--
### Trade-offs

Advantages compared to imperative commands:

- Object configuration can be stored in a source control system such as Git.
- Object configuration can integrate with processes such as reviewing changes before push and audit trails.
- Object configuration provides a template for creating new objects.
-->
### 权衡

与命令式指令相比的优点：

- 对象配置可以存储在类似 Git 的源代码控制系统中。
- 对象配置可以和类似推送前的审查，以及审计跟踪等流程进行集成。
- 对象配置提供了创建新对象的模板。

<!--
Disadvantages compared to imperative commands:

- Object configuration requires basic understanding of the object schema.
- Object configuration requires the additional step of writing a YAML file.
-->
与命令式指令相比的缺点：

- 对象配置需要对对象模式有基本的了解。
- 对象配置需要编写 YAML 文件的额外步骤。

<!--
Advantages compared to declarative object configuration:

- Imperative object configuration behavior is simpler and easier to understand.
- As of Kubernetes version 1.5, imperative object configuration is more mature.
-->
与声明式对象配置相比的优点：

- 命令式对象配置行为更简单，更易于理解。
- 在 Kubernetes 1.5 版本中，命令式对象配置更加成熟。

<!--
Disadvantages compared to declarative object configuration:

- Imperative object configuration works best on files, not directories.
- Updates to live objects must be reflected in configuration files, or they will be lost during the next replacement.
-->
与声明式对象配置相比的缺点：

- 命令式对象配置最适合于文件，而不是目录。
- 活动对象的更新必须反映在配置文件中，否则它们将在下次替换时丢失。

<!--
## Declarative object configuration

When using declarative object configuration, a user operates on object
configuration files stored locally, however the user does not define the
operations to be taken on the files. Create, update, and delete operations
are automatically detected per-object by `kubectl`. This enables working on
directories, where different operations might be needed for different objects.
-->
## 声明式对象配置

使用声明式对象配置时，用户操作本地存储的对象配置文件，然而用户不会定义对文件的操作。
创建、更新和删除操作由 `kubectl` 逐个对象自动进行检测。 这使得该技术能够作用于目录，
目录中的不同对象可能需要不同的操作。

<!--
**Note:** Declarative object configuration retains changes made by other
writers, even if the changes are not merged back to the object configuration file.
This is possible by using the `patch` API operation to write only
observed differences, instead of using the `replace`
API operation to replace the entire object configuration.
-->
**注意：** 声明式对象配置保留了其他修改者所做的修改，即使这些修改没有合并到对象配置文件中。
通过使用 `patch` API 操作来只写入观察到的差异，而不是使用 `replace` API
操作来替换整个对象配置，可以做到这一点。

<!--
### Examples

Process all object configuration files in the `configs` directory, and
create or patch the live objects:
-->
### 示例

处理 `configs` 目录中的所有对象配置文件，并创建或对活动对象打补丁（patch）:

```sh
kubectl apply -f configs/
```

<!--
Recursively process directories:
-->
递归地处理目录：

```sh
kubectl apply -R -f configs/
```

<!--
### Trade-offs

Advantages compared to imperative object configuration:

- Changes made directly to live objects are retained, even if they are not merged back into the configuration files.
- Declarative object configuration has better support for operating on directories and automatically detecting operation types (create, patch, delete) per-object.
-->
### 权衡

与命令式对象配置相比的优点：

- 直接对活动对象进行的修改被保留，即使这些修改没有合并到对象配置文件中。
- 声明式对象配置可以更好地支持对目录的操作，并自动逐个对象检测操作类型（创建、 打补丁或删除）。

<!--
Disadvantages compared to imperative object configuration:

- Declarative object configuration is harder to debug and understand results when they are unexpected.
- Partial updates using diffs create complex merge and patch operations.
-->
与命令式对象配置相比的缺点：

- 在意想不到的情况下，声明式对象配置很难调试，其结果也很难理解。
- 使用区别对比进行部分更新，造成了复杂的合并和打补丁操作。

{% endcapture %}

{% capture whatsnext %}
<!--
- [Managing Kubernetes Objects Using Imperative Commands](/docs/concepts/overview/object-management-kubectl/imperative-command/)
- [Managing Kubernetes Objects Using Object Configuration (Imperative)](/docs/concepts/overview/object-management-kubectl/imperative-config/)
- [Managing Kubernetes Objects Using Object Configuration (Declarative)](/docs/concepts/overview/object-management-kubectl/declarative-config/)
- [Kubectl Command Reference](/docs/user-guide/kubectl/{{page.version}}/)
- [Kubernetes API Reference](/docs/api-reference/{{page.version}}/)
-->
- [使用命令式指令管理 Kubernetes 对象](/docs/concepts/overview/object-management-kubectl/imperative-command/)
- [使用对象配置（命令式）管理 Kubernetes 对象](/docs/concepts/overview/object-management-kubectl/imperative-config/)
- [使用对象配置（声明式）管理 Kubernetes 对象](/docs/concepts/overview/object-management-kubectl/declarative-config/)
- [Kubectl 命令参考](/docs/user-guide/kubectl/{{page.version}}/)
- [Kubernetes API 参考](/docs/api-reference/{{page.version}}/)

{% comment %}
{% endcomment %}
{% endcapture %}

{% include templates/concept.md %}
