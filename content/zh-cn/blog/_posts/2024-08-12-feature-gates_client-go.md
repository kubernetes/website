---
layout: blog
title: '向 Client-Go 引入特性门控：增强灵活性和控制力'
date: 2024-08-12
slug: feature-gates-in-client-go
author: >
 Ben Luddy (Red Hat),
 Lukasz Szaszkiewicz (Red Hat)
translator: >
  Xin Li (DaoCloud)
---
<!--
layout: blog
title: 'Introducing Feature Gates to Client-Go: Enhancing Flexibility and Control'
date: 2024-08-12
slug: feature-gates-in-client-go
author: >
 Ben Luddy (Red Hat),
 Lukasz Szaszkiewicz (Red Hat)
-->

<!--
Kubernetes components use on-off switches called _feature gates_ to manage the risk of adding a new feature.
The feature gate mechanism is what enables incremental graduation of a feature through the stages Alpha, Beta, and GA.
-->
Kubernetes 组件使用称为“特性门控（Feature Gates）”的开关来管理添加新特性的风险，
特性门控机制使特性能够通过 Alpha、Beta 和 GA 阶段逐步升级。

<!--
Kubernetes components, such as kube-controller-manager and kube-scheduler, use the client-go library to interact with the API. 
The same library is used across the Kubernetes ecosystem to build controllers, tools, webhooks, and more. client-go now includes 
its own feature gating mechanism, giving developers and cluster administrators more control over how they adopt client features.
-->
Kubernetes 组件（例如 kube-controller-manager 和 kube-scheduler）使用 client-go 库与 API 交互，
整个 Kubernetes 生态系统使用相同的库来构建控制器、工具、webhook 等。
client-go 现在包含自己的特性门控机制，使开发人员和集群管理员能够更好地控制如何使用客户端特性。

<!--
To learn more about feature gates in Kubernetes, visit [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/).
-->
要了解有关 Kubernetes 中特性门控的更多信息，请参阅[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
## Motivation

In the absence of client-go feature gates, each new feature separated feature availability from enablement in its own way, if at all. 
Some features were enabled by updating to a newer version of client-go. Others needed to be actively configured in each program that used them. 
A few were configurable at runtime using environment variables. Consuming a feature-gated functionality exposed by the kube-apiserver sometimes 
required a client-side fallback mechanism to remain compatible with servers that don’t support the functionality due to their age or configuration. 
In cases where issues were discovered in these fallback mechanisms, mitigation required updating to a fixed version of client-go or rolling back.
-->
## 动机

在没有 client-go 特性门控的情况下，每个新特性都以自己的方式（如果有的话）将特性可用性与特性的启用分开。
某些特性可通过更新到较新版本的 client-go 来启用，其他特性则需要在每个使用它们的程序中进行主动配置，
其中一些可在运行时使用环境变量进行配置。使用 kube-apiserver 公开的特性门控功能时，有时需要客户端回退机制，
以保持与由于版本新旧或配置不同而不支持该特性服务器的兼容性。
如果在这些回退机制中发现问题，则缓解措施需要更新到 client-go 的固定版本或回滚。

<!--
None of these approaches offer good support for enabling a feature by default in some, but not all, programs that consume client-go. 
Instead of enabling a new feature at first only for a single component, a change in the default setting immediately affects the default 
for all Kubernetes components, which broadens the blast radius significantly.
-->
这些方法都无法很好地支持为某些（但不是全部）使用 client-go 的程序默认启用特性。
默认设置的更改不会首先仅为单个组件启用新特性，而是会立即影响所有 Kubernetes 组件的默认设置，从而大大扩大影响半径。

<!--
## Feature gates in client-go

To address these challenges, substantial client-go features will be phased in using the new feature gate mechanism. 
It will allow developers and users to enable or disable features in a way that will be familiar to anyone who has experience 
with feature gates  in the Kubernetes components.
-->
## client-go 中的特性门控

为了应对这些挑战，大量的 client-go 特性将使用新的特性门控机制来逐步引入。
这一机制将允许开发人员和用户以类似 Kubernetes 组件特性门控的管理方式启用或禁用特性。

<!--
Out of the box, simply by using a recent version of client-go, this offers several benefits.

For people who use software built with client-go:
-->
作为一种开箱即用的能力，用户只需使用最新版本的 client-go。这种设计带来多种好处。

对于使用通过 client-go 构建的软件的用户：

<!--
* Early adopters can enable a default-off client-go feature on a per-process basis.
* Misbehaving features can be disabled without building a new binary.
* The state of all known client-go feature gates is logged, allowing users to inspect it.
-->
* 早期采用者可以针对各个进程分别启用默认关闭的 client-go 特性。
* 无需构建新的二进制文件即可禁用行为不当的特性。
* 所有已知的 client-go 特性门控的状态都会被记录到日志中，允许用户检查。

<!--
For people who develop software built with client-go:

* By default, client-go feature gate overrides are read from environment variables. 
  If a bug is found in a client-go feature, users will be able to disable it without waiting for a new release.
* Developers can replace the default environment-variable-based overrides in a program to change defaults, 
  read overrides from another source, or disable runtime overrides completely. 
  The Kubernetes components use this customizability to integrate client-go feature gates with 
  the existing `--feature-gates` command-line flag, feature enablement metrics, and logging.
-->
对于开发使用 client-go 构建的软件的人员：

* 默认情况下，client-go 特性门控覆盖是从环境变量中读取的。
  如果在 client-go 特性中发现错误，用户将能够禁用它，而无需等待新版本发布。
* 开发人员可以替换程序中基于默认环境变量的覆盖值以更改默认值、从其他源读取覆盖值或完全禁用运行时覆盖值。
  Kubernetes 组件使用这种可定制性将 client-go 特性门控与现有的 `--feature-gates` 命令行标志、特性启用指标和日志记录集成在一起。

<!--
## Overriding client-go feature gates

**Note**: This describes the default method for overriding client-go feature gates at runtime. 
It can be disabled or customized by the developer of a particular program. 
In Kubernetes components, client-go feature gate overrides are controlled by the `--feature-gates` flag.

Features of client-go can be enabled or disabled by setting environment variables prefixed with `KUBE_FEATURE`. 
For example, to enable a feature named `MyFeature`, set the environment variable as follows:
-->
## 覆盖 client-go 特性门控

**注意**：这描述了在运行时覆盖 client-go 特性门控的默认方法，它可以由特定程序的开发人员禁用或自定义。
在 Kubernetes 组件中，client-go 特性门控覆盖由 `--feature-gates` 标志控制。

可以通过设置以 `KUBE_FEATURE` 为前缀的环境变量来启用或禁用 client-go 的特性。
例如，要启用名为 `MyFeature` 的特性，请按如下方式设置环境变量：

```shell
KUBE_FEATURE_MyFeature=true
```

<!--
To disable the feature, set the environment variable to `false`:
-->
要禁用特性，可将环境变量设置为 `false`：

```shell
KUBE_FEATURE_MyFeature=false
```

<!--
**Note**: Environment variables are case-sensitive on some operating systems. 
Therefore, `KUBE_FEATURE_MyFeature` and `KUBE_FEATURE_MYFEATURE` would be considered two different variables.
-->
**注意**：在某些操作系统上，环境变量区分大小写。
因此，`KUBE_FEATURE_MyFeature` 和 `KUBE_FEATURE_MYFEATURE` 将被视为两个不同的变量。

<!--
## Customizing client-go feature gates

The default environment-variable based mechanism for feature gate overrides can be sufficient for many programs in the Kubernetes ecosystem, 
and requires no special integration. Programs that require different behavior can replace it with their own custom feature gate provider. 
This allows a program to do things like force-disable a feature that is known to work poorly, 
read feature gates directly from a remote configuration service, or accept feature gate overrides through command-line options.
-->
## 自定义 client-go 特性门控

基于环境变量的默认特性门控覆盖机制足以满足 Kubernetes 生态系统中许多程序的需求，无需特殊集成。
需要不同行为的程序可以用自己的自定义特性门控提供程序替换它。
这允许程序执行诸如强制禁用已知运行不良的特性、直接从远程配置服务读取特性门控或通过命令行选项接受特性门控覆盖等操作。

<!--
The Kubernetes components replace client-go’s default feature gate provider with a shim to the existing Kubernetes feature gate provider. 
For all practical purposes, client-go feature gates are treated the same as other Kubernetes 
feature gates: they are wired to the `--feature-gates` command-line flag, included in feature enablement metrics, and logged on startup.
-->
Kubernetes 组件将 client-go 的默认特性门控提供程序替换为现有 Kubernetes 特性门控提供程序的转换层。
在所有实际应用场合中，client-go 特性门控与其他 Kubernetes 特性门控的处理方式相同：
它们连接到 `--feature-gates` 命令行标志，包含在特性启用指标中，并在启动时记录。

<!--
To replace the default feature gate provider, implement the Gates interface and call ReplaceFeatureGates 
at package initialization time, as in this simple example:
-->
要替换默认的特性门控提供程序，请实现 Gates 接口并在包初始化时调用 ReplaceFeatureGates，如以下简单示例所示：

```go
import (
 "k8s.io/client-go/features"
)

type AlwaysEnabledGates struct{}

func (AlwaysEnabledGates) Enabled(features.Feature) bool {
 return true
}

func init() {
 features.ReplaceFeatureGates(AlwaysEnabledGates{})
}
```

<!--
Implementations that need the complete list of defined client-go features can get it by implementing the Registry interface 
and calling `AddFeaturesToExistingFeatureGates`. 
For a complete example, refer to [the usage within Kubernetes](https://github.com/kubernetes/kubernetes/blob/64ba17c605a41700f7f4c4e27dca3684b593b2b9/pkg/features/kube_features.go#L990-L997).
-->
需要定义的 client-go 特性完整列表的实现可以通过实现 Registry 接口并调用 `AddFeaturesToExistingFeatureGates` 来获取它。
完整示例请参考
[Kubernetes 内部使用](https://github.com/kubernetes/kubernetes/blob/64ba17c605a41700f7f4c4e27dca3684b593b2b9/pkg/features/kube_features.go#L990-L997)。

<!--
## Summary

With the introduction of feature gates in client-go v1.30, rolling out a new client-go feature has become safer and easier. 
Users and developers can control the pace of their own adoption of client-go features. 
The work of Kubernetes contributors is streamlined by having a common mechanism for graduating features that span both sides of the Kubernetes API boundary.
-->
## 总结

随着 client-go v1.30 中特性门控的引入，推出新的 client-go 特性变得更加安全、简单。
用户和开发人员可以控制自己采用 client-go 特性的步伐。
通过为跨 Kubernetes API 边界两侧的特性提供一种通用的培育机制，Kubernetes 贡献者的工作得到了简化。

<!--
Special shoutout to [@sttts](https://github.com/sttts) and [@deads2k](https://github.com/deads2k) for their help in shaping this feature.
-->
特别感谢 [@sttts](https://github.com/sttts) 和 [@deads2k](https://github.com/deads2k) 对此特性提供的帮助。
