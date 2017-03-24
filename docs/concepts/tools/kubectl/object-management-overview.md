---
title: Kubernetes 对象管理
---

{% capture overview %}
`kubectl` 命令行工具支持创建和管理 Kubernetes 对象的几种不同的方法. 本文档概述了不同的方法。
{% endcapture %}

{% capture body %}

## 管理技巧

**警告:** Kubernetes 对象应该只使用一种技术进行管理。混合使用不同的技术，会导致相同对象出现未定义的行为。

| 管理技术             | 操作         |推荐环境 | 支持撰写  | 学习曲线 |
|----------------------------------|----------------------|------------------------|--------------------|----------------|
| 命令式的命令              | 活动对象         | 开发项目   | 1+                 | 最低         |
| 命令式对象配置  | 单文件     | 生产项目    | 1                  | 中等       |
| 声明式对象配置 | 多文件目录 | 生产项目    | 1+                 | 最高        |

## 命令式的命令

当使用命令式的命令时，用户直接对集群中的活动对象进行操作。用户将 `kubectl` 命令作为参数或标记提供操作。

这是在集群中启动或运行一次性任务的最简单的方法。因为这种技术直接在活动对象上运行，所以它没有提供以前配置的历史记录。

### 例子

通过创建 Deployment 对象来运行 nginx 容器的实例:

```sh
kubectl run nginx --image nginx
```

使用不同的语法做同样的事情:

```sh
kubectl create deployment nginx --image nginx
```

### 权衡

与对象配置相比的优点:

- 命令简单易学，易于记忆。
- 命令只需要一个步骤即可对集群进行更改。

与对象配置相比的缺点:

- 命令不与变更审核流程整合。
- 命令不提供与更改相关联的审记跟踪。
- 除了活动对象之处，命令不提供记录来源。
- 命令不提供用于创建新对象的模板。

## 命令式对象配置

当使用命令式对象配置时，用户对本地存储的对象配置文件进行操作。对象配置文件定义 YAML 或 JSON 中的完整对象。

用户通过向 `kubectl` 提交一个或多个文件和标记，进行创建、替换、删除等操作。

使用此技术需要对 Kubernetes 对象定义有深入的了解。

**注意:** 虽然这种技术通过声明性配置文件来定义对象本身，但是操作还是必须的: 创建、替换、删除。

### 例子

创建对象定义配置文件:

```sh
kubectl create -f nginx.yaml
```

删除两个配置文件中定义的对象:

```sh
kubectl delete -f nginx.yaml -f redis.yaml
```

通过覆写实时配置更新配置文件中定义的对象:

```sh
kubectl replace -f nginx.yaml
```

### 权衡

与命令式的命令相比的优点:

- 对象配置可以存储在源码控制系统中，如 Git。
- 对象配置可以与进程集成，例如在推送和审计跟踪之前查看更改。
- 对象配置提供了一个用于创建新对象的模板。

与命令式的命令相比的缺点:

- 对象配置需要对对象模式有基本的了解。
- 对象配置需要编写 YAML 文件

与声明式对象配置相比的优势:

- 命令对象配置行为更简单易懂。
- 在 Kubernetes 1.5版本，命令式对象配置更为成熟 imperative object configuration is more mature.

与声明式对象配置相比的缺点:

- 命令式对象配置最适合于文件，而不是目录。
- 活动对象的更新必须反映在配置文件中，否则在下次替换时将丢失。

## 声明式对象配置

当使用声明式对象配置时，用户对本地存储的对象配置文件进行操作，但是用户没有定义要对文件执行的操作。通过 `kubectl` 自动每个对象的创建、更新和删除操作。这样可以在目录层级上工作，因为不同的对象可能需要不同的操作。

**注意:** 声明式对象配置保留由其他对象进行的更改，即使更改未合并到对象配置文件中。这可以通过使用 `patch` API 操作来写入观察到的差异，而不是使用`replace` API 操作来替换整个对象的配置。

### 例子

处理`configs` 目录中的所有对象配置文件，创建或修补(patch)活动对象:

```sh
kubectl apply -f configs/
```

递归处理目录:

```sh
kubectl apply -R -f configs/
```

### 权衡

与命令式对象配置相比的优点:

- 直接对活动对象进行的更改将被保留，即使它们未被并入到配置文件中。
- 声明式对象配置更好地支持目录操作，并自动检测每个对象的操作类型 (创建、修补，删除)。

与命令式对象配置相比的缺点:

- 声明式对象配置在意外情况下难以调试和了解结果。
- 使用差异的部分更新会创建复杂的合并和补丁操作。

{% endcapture %}

{% capture whatsnext %}
- [使用命令式的命令管理 Kubernetes 对象](/docs/concepts/tools/kubectl/object-management-using-imperative-commands/)
- [使用对象配置管理 Kubernetes 对象 (命令式)](/docs/concepts/tools/kubectl/object-management-using-imperative-config/)
- [使用对象配置管理 Kubernetes 对象 (声明式)](/docs/concepts/tools/kubectl/object-management-using-declarative-config/)
- [Kubectl 命令参考](/docs/user-guide/kubectl/v1.5/)
- [Kubernetes 对象模式参考](/docs/resources-reference/v1.5/)

{% comment %}
{% endcomment %}
{% endcapture %}

{% include templates/concept.md %}
