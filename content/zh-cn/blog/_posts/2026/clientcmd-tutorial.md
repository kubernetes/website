---
layout: blog
title: '使用 clientcmd 实现统一的 API 服务器访问'
date: 2026-01-19T10:00:00-08:00
slug: clientcmd-apiserver-access
author: >
  [Stephen Kitt](https://github.com/skitt) (Red Hat)
translator: >
  [Xin Li](https://github.com/my-git9)
---
<!--
layout: blog
title: 'Uniform API server access using clientcmd'
date: 2026-01-19T10:00:00-08:00
slug: clientcmd-apiserver-access
author: >
  [Stephen Kitt](https://github.com/skitt) (Red Hat)
-->

<!--
If you've ever wanted to develop a command line client for a Kubernetes API,
especially if you've considered making your client usable as a `kubectl` plugin,
you might have wondered how to make your client feel familiar to users of `kubectl`.
A quick glance at the output of `kubectl options` might put a damper on that:
"Am I really supposed to implement all those options?"
-->
如果你曾经想为 Kubernetes API 开发命令行客户端，
特别是如果你考虑过让你的客户端可用作 `kubectl` 插件，
你可能想知道如何让你的客户端让 `kubectl` 用户感到熟悉。
快速浏览一下 `kubectl options` 的输出可能会让你感到沮丧：
"我真的需要实现所有这些选项吗？"

<!--
Fear not, others have done a lot of the work involved for you.
In fact, the Kubernetes project provides two libraries to help you handle
`kubectl`-style command line arguments in Go programs:
[`clientcmd`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd) and
[`cli-runtime`](https://pkg.go.dev/k8s.io/cli-runtime)
(which uses `clientcmd`).
This article will show how to use the former.
-->
别担心，其他人已经为你做了很多相关工作。
实际上，Kubernetes 项目提供了两个库来帮助你在 Go 程序中处理
`kubectl` 风格的命令行参数：
[`clientcmd`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd) 和
[`cli-runtime`](https://pkg.go.dev/k8s.io/cli-runtime)（后者使用 `clientcmd`）。
本文将展示如何使用前者。

<!--
## General philosophy
-->
## 总体理念

<!--
As might be expected since it's part of `client-go`,
`clientcmd`'s ultimate purpose is to provide an instance of
[`restclient.Config`](https://pkg.go.dev/k8s.io/client-go/rest#Config)
that can issue requests to an API server.
-->
作为 `client-go` 的一部分，`clientcmd` 的最终目的是提供
[`restclient.Config`](https://pkg.go.dev/k8s.io/client-go/rest#Config)
的一个实例，该实例可以向 API 服务器发出请求。

<!--
It follows `kubectl` semantics:
* defaults are taken from `~/.kube` or equivalent;
* files can be specified using the `KUBECONFIG` environment variable;
* all of the above settings can be further overridden using command line arguments.
-->
它遵循 `kubectl` 语义：

* 默认值取自 `~/.kube` 或等效位置；
* 可以使用 `KUBECONFIG` 环境变量指定文件；
* 所有上述设置都可以通过命令行参数进一步覆盖。

<!--
It doesn't set up a `--kubeconfig` command line argument,
which you might want to do to align with `kubectl`;
you'll see how to do this
in the ["Bind the flags"](#bind-the-flags) section.
-->
它不会设置 `--kubeconfig` 命令行参数，
你可能希望这样做以与 `kubectl` 保持一致；
你将在["绑定标志"](#bind-the-flags)一节中看到如何做到这一点。

<!--
## Available features
-->
## 可用特性

<!--
`clientcmd` allows programs to handle
-->
`clientcmd` 允许程序处理。

<!--
* `kubeconfig` selection (using `KUBECONFIG`);
* context selection;
* namespace selection;
* client certificates and private keys;
* user impersonation;
* HTTP Basic authentication support (username/password).
-->
* `kubeconfig` 选择（使用 `KUBECONFIG`）；
* 上下文选择；
* 命名空间选择；
* 客户端证书和私钥；
* 用户模拟；
* HTTP 基本认证支持（用户名/密码）。

<!--
## Configuration merging
-->
## 配置合并

<!--
In various scenarios, `clientcmd` supports _merging_ configuration settings:
`KUBECONFIG` can specify multiple files whose contents are combined.
This can be confusing, because settings are merged in different directions
depending on how they are implemented.
If a setting is defined in a map, the first definition wins,
subsequent definitions are ignored.
If a setting is not defined in a map, the last definition wins.
-->
在各种场景中，`clientcmd` 支持**合并**配置设置：
`KUBECONFIG` 可以指定多个文件，其内容会被组合。
这可能令人困惑，因为设置根据实现方式的不同而以不同方向合并。
如果设置在 Map 中定义，第一个定义获胜，后续定义将被忽略。
如果设置不在 Map 中定义，最后一个定义获胜。

<!--
When settings are retrieved using `KUBECONFIG`,
missing files result in warnings only.
If the user explicitly specifies a path (in `--kubeconfig` style),
there must be a corresponding file.
-->
当使用 `KUBECONFIG` 检索设置时，缺失的文件只会导致警告。
如果用户显式指定路径（以 `--kubeconfig` 方式），则必须有相应的文件。

<!--
If `KUBECONFIG` isn't defined,
the default configuration file, `~/.kube/config`, is used instead,
if present.
-->
如果未定义 `KUBECONFIG`，
则使用默认配置文件 `~/.kube/config`（如果存在）。

<!--
### Overall process
-->
### 整体流程

<!--
The general usage pattern is succinctly expressed in
the [`clientcmd`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd) package documentation:
-->
一般使用模式在
[`clientcmd`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd)
包文档中有简洁的表达：

```go
loadingRules := clientcmd.NewDefaultClientConfigLoadingRules()
// if you want to change the loading rules (which files in which order), you can do so here

configOverrides := &clientcmd.ConfigOverrides{}
// if you want to change override values or bind them to flags, there are methods to help you

kubeConfig := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(loadingRules, configOverrides)
config, err := kubeConfig.ClientConfig()
if err != nil {
	// Do something
}
client, err := metav1.New(config)
// ...
```

<!--
In the context of this article, there are six steps:
-->
在本文的上下文中，有六个步骤：

<!--
1. [Configure the loading rules](#configure-the-loading-rules).
1. [Configure the overrides](#configure-the-overrides).
1. [Build a set of flags](#build-a-set-of-flags).
1. [Bind the flags](#bind-the-flags).
1. [Build the merged configuration](#build-the-merged-configuration).
1. [Obtain an API client](#obtain-an-api-client).
-->
1. [配置加载规则](#configure-the-loading-rules)。
1. [配置覆盖](#configure-the-overrides)。
1. [构建一组标志](#build-a-set-of-flags)。
1. [绑定标志](#bind-the-flags)。
1. [构建合并配置](#build-the-merged-configuration)。
1. [获取 API 客户端](#obtain-an-api-client)。

<!--
### Configure the loading rules
-->
### 配置加载规则

<!--
`clientcmd.NewDefaultClientConfigLoadingRules()` builds loading rules which will use either the contents of the `KUBECONFIG` environment variable,
or the default configuration file name (`~/.kube/config`).
In addition, if the default configuration file is used,
it is able to migrate settings from the (very) old default configuration file
(`~/.kube/.kubeconfig`).
-->
`clientcmd.NewDefaultClientConfigLoadingRules()` 构建加载规则，
该规则将使用 `KUBECONFIG` 环境变量的内容或默认配置文件名（`~/.kube/config`）。
此外，如果使用默认配置文件，
它能够从（非常）旧的默认配置文件（`~/.kube/.kubeconfig`）迁移设置。

<!--
You can build your own `ClientConfigLoadingRules`,
but in most cases the defaults are fine.
-->
你可以构建自己的 `ClientConfigLoadingRules`，
但在大多数情况下默认值就足够了。

<!--
### Configure the overrides
-->
### 配置覆盖

<!--
`clientcmd.ConfigOverrides` is a `struct` storing overrides which will be applied over the settings loaded from the configuration derived using the loading rules.
In the context of this article,
its primary purpose is to store values obtained from command line arguments.
These are handled using the [pflag](https://github.com/spf13/pflag) library,
which is a drop-in replacement for Go's [`flag`](https://pkg.go.dev/flag) package,
adding support for double-hyphen arguments with long names.
-->
`clientcmd.ConfigOverrides` 是一个 `struct`，存储将应用于从加载规则派生的配置中加载的设置的覆盖。
在本文的上下文中，其主要目的是存储从命令行参数获取的值。
这些使用 [pflag](https://github.com/spf13/pflag) 库处理，
该库是 Go 的 [`flag`](https://pkg.go.dev/flag) 包的直接替代品，
添加了对带长名称的双连字符参数的支持。

<!--
In most cases there's nothing to set in the overrides;
I will only bind them to flags.
-->
在大多数情况下，覆盖中没有什么需要设置的；我只会将它们绑定到标志上。

<!--
### Build a set of flags
-->
### 构建一组标志

<!--
In this context, a flag is a representation of a command line argument,
specifying its long name (such as `--namespace`),
its short name if any (such as `-n`),
its default value,
and a description shown in the usage information.
Flags are stored in instances of
the [`FlagInfo`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#FlagInfo) struct.
-->
在此上下文中，标志是命令行参数的表示，
指定其长名称（如 `--namespace`）、短名称（如 `-n`）、默认值以及使用信息中显示的描述。
标志存储在
[`FlagInfo`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#FlagInfo)
结构体的实例中。

<!--
Three sets of flags are available,
representing the following command line arguments:
-->
有三组标志可用，表示以下命令行参数：

<!--
* authentication arguments (certificates, tokens, impersonations, username/password);
* cluster arguments (API server, certificate authority, TLS configuration, proxy, compression)
* context arguments (cluster name, `kubeconfig` user name, namespace)
-->
* 认证参数（证书、令牌、模拟、用户名/密码）；
* 集群参数（API 服务器、证书机构、TLS 配置、代理、压缩）
* 上下文参数（集群名称、`kubeconfig` 用户名、命名空间）

<!--
The recommended selection includes all three with a named context selection argument and a timeout argument.
-->
推荐的选择包括所有三组，以及命名的上下文选择参数和超时参数。

<!--
These are all available using the `Recommended…Flags` functions.
The functions take a prefix, which is prepended to all the argument long names.
-->
这些都可以使用 `Recommended…Flags` 函数获得。
这些函数接受一个前缀，该前缀会添加到所有参数长名称之前。

<!--
So calling
[`clientcmd.RecommendedConfigOverrideFlags("")`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#RecommendedConfigOverrideFlags)
results in command line arguments such as `--context`, `--namespace`, and so on.
The `--timeout` argument is given a default value of 0,
and the `--namespace` argument has a corresponding short variant, `-n`.
-->
因此调用
[`clientcmd.RecommendedConfigOverrideFlags("")`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#RecommendedConfigOverrideFlags)
会产生诸如 `--context`、`--namespace` 等命令行参数。
`--timeout` 参数的默认值为 0，`--namespace` 参数有一个对应的短变体 `-n`。

<!--
Adding a prefix, such as `"from-"`, results in command line arguments such as
`--from-context`, `--from-namespace`, etc.
This might not seem particularly useful on commands involving a single API server,
but they come in handy when multiple API servers are involved,
such as in multi-cluster scenarios.
-->
添加前缀（如 `"from-"`）会产生诸如 `--from-context`、`--from-namespace` 等命令行参数。
这在涉及单个 API 服务器的命令上可能看起来不是特别有用，
但在涉及多个 API 服务器时（例如在多集群场景中）会派上用场。

<!--
There's a potential gotcha here: prefixes don't modify the short name,
so `--namespace` needs some care if multiple prefixes are used:
only one of the prefixes can be associated with the `-n` short name.
You'll have to clear the short names associated with the other prefixes'
`--namespace` , or perhaps all prefixes if there's no sensible
`-n` association.
Short names can be cleared as follows:
-->
这里有一个潜在的陷阱：前缀不会修改短名称，因此如果使用多个前缀，`--namespace` 需要小心：
只有一个前缀可以与 `-n` 短名称关联。
你必须清除与其他前缀的 `--namespace` 关联的短名称，
或者如果没有合理的 `-n` 关联，则清除所有前缀的短名称。
可以按以下方式清除短名称：

```go
kflags := clientcmd.RecommendedConfigOverrideFlags(prefix)
kflags.ContextOverrideFlags.Namespace.ShortName = ""
```

<!--
In a similar fashion, flags can be disabled entirely by clearing their long name:
-->
类似地，可以通过清除长名称来完全禁用标志：

```go
kflags.ContextOverrideFlags.Namespace.LongName = ""
```

<!--
### Bind the flags
-->
### 绑定标志

<!--
Once a set of flags has been defined,
it can be used to bind command line arguments to overrides using
[`clientcmd.BindOverrideFlags`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#BindOverrideFlags).
This requires a
[`pflag`](https://pkg.go.dev/github.com/spf13/pflag) `FlagSet`
rather than one from Go's `flag` package.
-->
一旦定义了一组标志，
就可以使用
[`clientcmd.BindOverrideFlags`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#BindOverrideFlags)
将命令行参数绑定到覆盖标志。
这需要一个 [`pflag`](https://pkg.go.dev/github.com/spf13/pflag) `FlagSet`，
而不是 Go 的 `flag` 包中的 FlagSet。

<!--
If you also want to bind `--kubeconfig`, you should do so now,
by binding `ExplicitPath` in the loading rules:
-->
如果你还想绑定 `--kubeconfig`，现在就应该这样做，
通过绑定加载规则中的 `ExplicitPath`：

```go
flags.StringVarP(&loadingRules.ExplicitPath, "kubeconfig", "", "", "absolute path(s) to the kubeconfig file(s)")
```

<!--
### Build the merged configuration
-->
### 构建合并配置

<!--
Two functions are available to build a merged configuration:
-->
有两个函数可用于构建合并配置：

<!--
* [`clientcmd.NewInteractiveDeferredLoadingClientConfig`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#NewInteractiveDeferredLoadingClientConfig)
* [`clientcmd.NewNonInteractiveDeferredLoadingClientConfig`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#NewNonInteractiveDeferredLoadingClientConfig)
-->
* [`clientcmd.NewInteractiveDeferredLoadingClientConfig`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#NewInteractiveDeferredLoadingClientConfig)
* [`clientcmd.NewNonInteractiveDeferredLoadingClientConfig`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#NewNonInteractiveDeferredLoadingClientConfig)

<!--
As the names suggest, the difference between the two is that the first
can ask for authentication information interactively,
using a provided reader,
whereas the second only operates on the information given to it by the caller.
-->
顾名思义，两者之间的区别在于第一个可以使用提供的阅读器交互式地请求认证信息，
而第二个仅根据调用者提供的信息进行操作。

<!--
The "deferred" mention in these function names refers to the fact that
the final configuration will be determined as late as possible.
This means that these functions can be called before the command line arguments are parsed,
and the resulting configuration will use whatever values have been parsed
by the time it's actually constructed.
-->
这些函数名称中的"延迟（deferred）"指的是最终配置将尽可能晚地确定。
这意味着这些函数可以在解析命令行参数之前调用，生成的配置将使用实际构建时已解析的任何值。

<!--
### Obtain an API client
-->
### 获取 API 客户端

<!--
The merged configuration is returned as a
[`ClientConfig`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#ClientConfig) instance.
An API client can be obtained from that by calling the `ClientConfig()` method.
-->
合并配置作为
[`ClientConfig`](https://pkg.go.dev/k8s.io/client-go/tools/clientcmd#ClientConfig) 实例返回。
可以通过调用 `ClientConfig()` 方法从中获取 API 客户端。

<!--
If no configuration is given
(`KUBECONFIG` is empty or points to non-existent files,
`~/.kube/config` doesn't exist,
and no configuration is given using command line arguments),
the default setup will return an obscure error referring to `KUBERNETES_MASTER`.
This is legacy behaviour;
several attempts have been made to get rid of it,
but it is preserved for the `--local` and `--dry-run` command line arguments in `--kubectl`.
You should check for "empty configuration" errors by calling `clientcmd.IsEmptyConfig()`
and provide a more explicit error message.
-->
如果没有提供配置
（`KUBECONFIG` 为空或指向不存在的文件、`~/.kube/config` 不存在、并且没有通过命令行参数提供配置），
默认设置将返回一个引用 `KUBERNETES_MASTER` 的模糊错误。
这是遗留行为；已经多次尝试摆脱它，但为了 `--kubectl` 中的 `--local` 和 `--dry-run` 命令行参数而保留。
你应该通过调用 `clientcmd.IsEmptyConfig()` 检**空配置**错误，并提供更明确的错误消息。

<!--
The `Namespace()` method is also useful:
it returns the namespace that should be used.
It also indicates whether the namespace was overridden by the user
(using `--namespace`).
-->
`Namespace()` 方法也很有用：
它返回应该使用的名字空间。
它还指示名字空间是否被用户覆盖（使用 `--namespace`）。

<!--
## Full example
-->
## 完整示例

<!--
Here's a complete example.
-->
这是一个完整的示例。

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/spf13/pflag"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

func main() {
	// Loading rules, no configuration
	loadingRules := clientcmd.NewDefaultClientConfigLoadingRules()

	// Overrides and flag (command line argument) setup
	configOverrides := &clientcmd.ConfigOverrides{}
	flags := pflag.NewFlagSet("clientcmddemo", pflag.ExitOnError)
	clientcmd.BindOverrideFlags(configOverrides, flags,
		clientcmd.RecommendedConfigOverrideFlags(""))
	flags.StringVarP(&loadingRules.ExplicitPath, "kubeconfig", "", "", "absolute path(s) to the kubeconfig file(s)")
	flags.Parse(os.Args)

	// Client construction
	kubeConfig := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(loadingRules, configOverrides)
	config, err := kubeConfig.ClientConfig()
	if err != nil {
		if clientcmd.IsEmptyConfig(err) {
			panic("Please provide a configuration pointing to the Kubernetes API server")
		}
		panic(err)
	}
	client, err := kubernetes.NewForConfig(config)
	if err != nil {
		panic(err)
	}

	// How to find out what namespace to use
	namespace, overridden, err := kubeConfig.Namespace()
	if err != nil {
		panic(err)
	}
	fmt.Printf("Chosen namespace: %s; overridden: %t\n", namespace, overridden)

	// Let's use the client
	nodeList, err := client.CoreV1().Nodes().List(context.TODO(), v1.ListOptions{})
	if err != nil {
		panic(err)
	}
	for _, node := range nodeList.Items {
		fmt.Println(node.Name)
	}
}
```

<!--
Happy coding, and thank you for your interest in implementing tools with
familiar usage patterns!
-->
祝你编码愉快，感谢你有兴趣实现具有熟悉使用模式的工具！
