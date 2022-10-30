---
title: 用插件扩展 kubectl
description: 通过创建和安装 kubectl 插件扩展 kubectl。
content_type: task
---

<!--
title: Extend kubectl with plugins
reviewers:
- juanvallejo
- soltysh
description: Extend kubectl by creating and installing kubectl plugins.
content_type: task
-->

<!-- overview -->
<!--
This guide demonstrates how to install and write extensions for [kubectl](/docs/reference/kubectl/kubectl/). By thinking of core `kubectl` commands as essential building blocks for interacting with a Kubernetes cluster, a cluster administrator can think
of plugins as a means of utilizing these building blocks to create more complex behavior. Plugins extend `kubectl` with new sub-commands, allowing for new and custom features not included in the main distribution of `kubectl`.
-->
本指南演示了如何为 [kubectl](/zh-cn/docs/reference/kubectl/kubectl/) 安装和编写扩展。
通过将核心 `kubectl` 命令看作与 Kubernetes 集群交互的基本构建块，
集群管理员可以将插件视为一种利用这些构建块创建更复杂行为的方法。
插件用新的子命令扩展了 `kubectl`，允许新的和自定义的特性不包括在 `kubectl` 的主要发行版中。

## {{% heading "prerequisites" %}}

<!--
You need to have a working `kubectl` binary installed.
-->
你需要安装一个可用的 `kubectl` 可执行文件。

<!-- steps -->

<!--
## Installing kubectl plugins

A plugin is a standalone executable file, whose name begins with `kubectl-`. To install a plugin, move its executable file to anywhere on your `PATH`.
-->
## 安装 kubectl 插件

插件是一个独立的可执行文件，名称以 `kubectl-` 开头。
要安装插件，将其可执行文件移动到 `PATH` 中的任何位置。

<!--
You can also discover and install kubectl plugins available in the open source
using [Krew](https://krew.dev/). Krew is a plugin manager maintained by
the Kubernetes SIG CLI community.
-->
你也可以使用 [Krew](https://krew.dev/) 来发现和安装开源的 kubectl 插件。
Krew 是一个由 Kubernetes SIG CLI 社区维护的插件管理器。

<!--
Kubectl plugins available via the Krew [plugin index](https://krew.sigs.k8s.io/plugins/)
are not audited for security. You should install and run third-party plugins at your
own risk, since they are arbitrary programs running on your machine.
-->
{{< caution >}}
Krew [插件索引](https://krew.sigs.k8s.io/plugins/) 所维护的 kubectl 插件并未经过安全性审查。
你要了解安装和运行第三方插件的安全风险，因为它们本质上时是一些在你的机器上
运行的程序。
{{< /caution >}}

<!--
### Discovering plugins

`kubectl` provides a command `kubectl plugin list` that searches your `PATH` for valid plugin executables.
Executing this command causes a traversal of all files in your `PATH`. Any files that are executable, and begin with `kubectl-` will show up *in the order in which they are present in your `PATH`* in this command's output.
A warning will be included for any files beginning with `kubectl-` that are *not* executable.
A warning will also be included for any valid plugin files that overlap each other's name.

You can use [Krew](https://krew.dev/) to discover and install `kubectl`
plugins from a community-curated
[plugin index](https://krew.sigs.k8s.io/plugins/).
-->
### 发现插件

`kubectl` 提供一个命令 `kubectl plugin list`，用于搜索 `PATH` 查找有效的插件可执行文件。
执行此命令将遍历 `PATH` 中的所有文件。任何以 `kubectl-` 开头的可执行文件都将在这个命令的输出中**以它们在
`PATH` 中出现的顺序**显示。
任何以 `kubectl-` 开头的文件如果`不可执行`，都将包含一个警告。
对于任何相同的有效插件文件，都将包含一个警告。

你可以使用 [Krew](https://krew.dev/) 从社区策划的[插件索引](https://krew.sigs.k8s.io/plugins/)
中发现和安装 `kubectl` 插件。

<!--
#### Limitations

It is currently not possible to create plugins that overwrite existing `kubectl` commands. For example, creating a plugin `kubectl-version` will cause that plugin to never be executed, as the existing `kubectl version` command will always take precedence over it. Due to this limitation, it is also *not* possible to use plugins to add new subcommands to existing `kubectl` commands. For example, adding a subcommand `kubectl create foo` by naming your plugin `kubectl-create-foo` will cause that plugin to be ignored.

`kubectl plugin list` shows warnings for any valid plugins that attempt to do this.
-->
#### 限制

目前无法创建覆盖现有 `kubectl` 命令的插件。
例如，创建一个插件 `kubectl-version` 将导致该插件永远不会被执行，
因为现有的 `kubectl version` 命令总是优先于它执行。
由于这个限制，也不可能使用插件将新的子命令添加到现有的 `kubectl` 命令中。
例如，通过将插件命名为 `kubectl-create-foo` 来添加子命令 `kubectl create foo` 将导致该插件被忽略。

对于任何试图这样做的有效插件 `kubectl plugin list` 的输出中将显示警告。

<!--
## Writing kubectl plugins

You can write a plugin in any programming language or script that allows you to write command-line commands.
-->
## 编写 kubectl 插件

你可以用任何编程语言或脚本编写插件，允许你编写命令行命令。

<!--
There is no plugin installation or pre-loading required. Plugin executables receive
the inherited environment from the `kubectl` binary.
A plugin determines which command path it wishes to implement based on its name.
For example, a plugin named `kubectl-foo` provides a command `kubectl foo`. You must
install the plugin executable somewhere in your `PATH`.
-->
不需要安装插件或预加载，插件可执行程序从 `kubectl` 二进制文件接收继承的环境，
插件根据其名称确定它希望实现的命令路径。
例如，名为 `kubectl-foo` 的插件提供了命令 `kubectl foo`。
必须将插件的可执行文件安装在 `PATH` 中的某个位置。

<!--
### Example plugin
-->
### 示例插件

```
#!/bin/bash

# 可选的参数处理
if [[ "$1" == "version" ]]
then
    echo "1.0.0"
    exit 0
fi

# 可选的参数处理
if [[ "$1" == "config" ]]
then
    echo $KUBECONFIG
    exit 0
fi

echo "I am a plugin named kubectl-foo"
```

<!--
### Using a plugin
-->
### 使用插件

<!--
To use a plugin, make the plugin executable:
-->
要使用某插件，先要使其可执行：

```shell
sudo chmod +x ./kubectl-foo
```

<!--
and place it anywhere in your `PATH`:
-->
并将它放在你的 `PATH` 中的任何地方：

```shell
sudo mv ./kubectl-foo /usr/local/bin
```

<!--
You may now invoke your plugin as a `kubectl` command:
-->
你现在可以调用你的插件作为 `kubectl` 命令：

```shell
kubectl foo
```

```
I am a plugin named kubectl-foo
```

<!--
All args and flags are passed as-is to the executable:
-->
所有参数和标记按原样传递给可执行文件：

```shell
kubectl foo version
```

```
1.0.0
```

<!--
All environment variables are also passed as-is to the executable:
-->
所有环境变量也按原样传递给可执行文件：

```bash
export KUBECONFIG=~/.kube/config
kubectl foo config
```

```
/home/<user>/.kube/config
```

```shell
KUBECONFIG=/etc/kube/config kubectl foo config
```

```
/etc/kube/config
```

<!--
Additionally, the first argument that is passed to a plugin will always be the full path to the location where it was invoked (`$0` would equal `/usr/local/bin/kubectl-foo` in the example above).
-->
此外，传递给插件的第一个参数总是调用它的位置的绝对路径（在上面的例子中，`$0` 将等于 `/usr/local/bin/kubectl-foo`）。

<!--
### Naming a plugin

As seen in the example above, a plugin determines the command path that it will implement based on its filename. Every sub-command in the command path that a plugin targets, is separated by a dash (`-`).
For example, a plugin that wishes to be invoked whenever the command `kubectl foo bar baz` is invoked by the user, would have the filename of `kubectl-foo-bar-baz`.
-->
### 命名插件

如上面的例子所示，插件根据文件名确定要实现的命令路径，插件所针对的命令路径中的每个子命令都由破折号（`-`）分隔。
例如，当用户调用命令 `kubectl foo bar baz` 时，希望调用该命令的插件的文件名为 `kubectl-foo-bar-baz`。

<!--
#### Flags and argument handling
-->
#### 参数和标记处理

<!--
The plugin mechanism does _not_ create any custom, plugin-specific values or environment variables for a plugin process.

An older kubectl plugin mechanism provided environment variables such as `KUBECTL_PLUGINS_CURRENT_NAMESPACE`; that no longer happens.
-->
{{< note >}}
插件机制**不会**为插件进程创建任何定制的、特定于插件的值或环境变量。

较老的插件机制会提供环境变量（例如 `KUBECTL_PLUGINS_CURRENT_NAMESPACE`）；这种机制已被废弃。
{{< /note >}}

<!--
kubectl plugins must parse and validate all of the arguments passed to them.
See [using the command line runtime package](#using-the-command-line-runtime-package) for details of a Go library aimed at plugin authors.

Here are some additional cases where users invoke your plugin while providing additional flags and arguments. This builds upon the `kubectl-foo-bar-baz` plugin from the scenario above.
-->
kubectl 插件必须解析并检查传递给它们的所有参数。
参阅[使用命令行运行时包](#using-the-command-line-runtime-package)了解针对
插件开发人员的 Go 库的细节。

这里是一些用户调用你的插件的时候提供额外标志和参数的场景。
这些场景时基于上述案例中的 `kubectl-foo-bar-baz` 插件的。

<!--
If you run `kubectl foo bar baz arg1 --flag=value arg2`, kubectl's plugin mechanism will first try to find the plugin with the longest possible name, which in this case
would be `kubectl-foo-bar-baz-arg1`. Upon not finding that plugin, kubectl then treats the last dash-separated value as an argument (`arg1` in this case), and attempts to find the next longest possible name, `kubectl-foo-bar-baz`.
Upon having found a plugin with this name, kubectl then invokes that plugin, passing all args and flags after the plugin's name as arguments to the plugin process.
-->

如果你运行 `kubectl foo bar baz arg1 --flag=value arg2`，kubectl 的插件机制将首先尝试找到
最长可能名称的插件，在本例中是 `kubectl-foo-bar-baz-arg1`。
当没有找到这个插件时，kubectl 就会将最后一个以破折号分隔的值视为参数（在本例中为 `arg1`），
并尝试找到下一个最长的名称 `kubectl-foo-bar-baz`。
在找到具有此名称的插件后，它将调用该插件，并在其名称之后将所有参数和标志传递给插件进程。

<!-- Example: -->
示例：

```bash
# 创建一个插件
echo -e '#!/bin/bash\n\necho "My first command-line argument was $1"' > kubectl-foo-bar-baz
sudo chmod +x ./kubectl-foo-bar-baz

# 将插件放到 PATH 下完成"安装"
sudo mv ./kubectl-foo-bar-baz /usr/local/bin

# 确保 kubectl 能够识别我们的插件
kubectl plugin list
```

```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-foo-bar-baz
```

```shell
# 测试通过 "kubectl" 命令来调用我们的插件时可行的
# 即使我们给插件传递一些额外的参数或标志
kubectl foo bar baz arg1 --meaningless-flag=true
```

```
My first command-line argument was arg1
```

<!--
As you can see, your plugin was found based on the `kubectl` command specified by a user, and all extra arguments and flags were passed as-is to the plugin executable once it was found.
-->
正如你所看到的，你的插件是基于用户指定的 `kubectl` 命令找到的，
所有额外的参数和标记都是按原样传递给插件可执行文件的。

<!--
#### Names with dashes and underscores

Although the `kubectl` plugin mechanism uses the dash (`-`) in plugin filenames to separate the sequence of sub-commands processed by the plugin, it is still possible to create a plugin
command containing dashes in its commandline invocation by using underscores (`_`) in its filename.
-->
#### 带有破折号和下划线的名称

虽然 `kubectl` 插件机制在插件文件名中使用破折号（`-`）分隔插件处理的子命令序列，
但是仍然可以通过在文件名中使用下划线（`_`）来创建命令行中包含破折号的插件命令。

<!-- Example: -->
例子：

```bash
# 创建文件名中包含下划线的插件
echo -e '#!/bin/bash\n\necho "I am a plugin with a dash in my name"' > ./kubectl-foo_bar
sudo chmod +x ./kubectl-foo_bar
  
# 将插件放到 PATH 下
sudo mv ./kubectl-foo_bar /usr/local/bin

# 现在可以通过 kubectl 来调用插件
kubectl foo-bar
```
```
I am a plugin with a dash in my name
```

<!--
Note that the introduction of underscores to a plugin filename does not prevent you from having commands such as `kubectl foo_bar`.
The command from the above example, can be invoked using either a dash (`-`) or an underscore (`_`):
-->
请注意，在插件文件名中引入下划线并不会阻止你使用 `kubectl foo_bar` 之类的命令。
可以使用破折号（`-`）或下划线（`_`）调用上面示例中的命令:

```shell
# 我们的插件也可以用破折号来调用
kubectl foo-bar
```

```
I am a plugin with a dash in my name
```

```shell
# 你也可以使用下划线来调用我们的定制命令
kubectl foo_bar
```

```
I am a plugin with a dash in my name
```

<!--
#### Name conflicts and overshadowing

It is possible to have multiple plugins with the same filename in different locations throughout your `PATH`.
For example, given a `PATH` with the following value: `PATH=/usr/local/bin/plugins:/usr/local/bin/moreplugins`, a copy of plugin `kubectl-foo` could exist in `/usr/local/bin/plugins` and `/usr/local/bin/moreplugins`,
such that the output of the `kubectl plugin list` command is:
-->
#### 命名冲突和弊端

可以在 `PATH` 的不同位置提供多个文件名相同的插件，
例如，给定一个 `PATH` 为: `PATH=/usr/local/bin/plugins:/usr/local/bin/moreplugins`，
在 `/usr/local/bin/plugins` 和 `/usr/local/bin/moreplugins` 中可以存在一个插件
`kubectl-foo` 的副本，这样 `kubectl plugin list` 命令的输出就是:

```bash
PATH=/usr/local/bin/plugins:/usr/local/bin/moreplugins kubectl plugin list
```

```
The following kubectl-compatible plugins are available:
  
/usr/local/bin/plugins/kubectl-foo
/usr/local/bin/moreplugins/kubectl-foo
  - warning: /usr/local/bin/moreplugins/kubectl-foo is overshadowed by a similarly named plugin: /usr/local/bin/plugins/kubectl-foo
  
error: one plugin warning was found
```

<!--
In the above scenario, the warning under `/usr/local/bin/moreplugins/kubectl-foo` tells you that this plugin will never be executed. Instead, the executable that appears first in your `PATH`, `/usr/local/bin/plugins/kubectl-foo`, will always be found and executed first by the `kubectl` plugin mechanism.
-->
在上面的场景中 `/usr/local/bin/moreplugins/kubectl-foo` 下的警告告诉你这个插件永远不会被执行。
相反，首先出现在你 `PATH` 中的可执行文件 `/usr/local/bin/plugins/kubectl-foo` 
总是首先被 `kubectl` 插件机制找到并执行。

<!--
A way to resolve this issue is to ensure that the location of the plugin that you wish to use with `kubectl` always comes first in your `PATH`. For example, if you want to always use `/usr/local/bin/moreplugins/kubectl-foo` anytime that the `kubectl` command `kubectl foo` was invoked, change the value of your `PATH` to be `/usr/local/bin/moreplugins:/usr/local/bin/plugins`.
-->
解决这个问题的一种方法是你确保你希望与 `kubectl` 一起使用的插件的位置总是在你的 `PATH` 中首先出现。
例如，如果你总是想使用 `/usr/local/bin/moreplugins/kubectl foo`，
那么在调用 `kubectl` 命令 `kubectl foo` 时，你只需将路径的值更改为 `/usr/local/bin/moreplugins:/usr/local/bin/plugins`。

<!--
#### Invocation of the longest executable filename

There is another kind of overshadowing that can occur with plugin filenames. Given two plugins present in a user's `PATH`: `kubectl-foo-bar` and `kubectl-foo-bar-baz`, the `kubectl` plugin mechanism will always choose the longest possible plugin name for a given user command. Some examples below, clarify this further:
-->
#### 调用最长的可执行文件名

对于插件文件名而言还有另一种弊端，给定用户 `PATH` 中的两个插件 `kubectl-foo-bar` 和 `kubectl-foo-bar-baz`，
`kubectl` 插件机制总是为给定的用户命令选择尽可能长的插件名称。下面的一些例子进一步的说明了这一点：

```bash
# 对于给定的 kubectl 命令，最长可能文件名的插件是被优先选择的
kubectl foo bar baz
```

```
Plugin kubectl-foo-bar-baz is executed
```

```bash
kubectl foo bar
```

```
Plugin kubectl-foo-bar is executed
```

```bash
kubectl foo bar baz buz
```

```
Plugin kubectl-foo-bar-baz is executed, with "buz" as its first argument
```

```bash
kubectl foo bar buz
```

```
Plugin kubectl-foo-bar is executed, with "buz" as its first argument
```

<!--
This design choice ensures that plugin sub-commands can be implemented across multiple files, if needed, and that these sub-commands can be nested under a "parent" plugin command:
-->
这种设计选择确保插件子命令可以跨多个文件实现，如果需要，这些子命令可以嵌套在"父"插件命令下：

```bash
ls ./plugin_command_tree
```

```
kubectl-parent
kubectl-parent-subcommand
kubectl-parent-subcommand-subsubcommand
```

<!--
### Checking for plugin warnings

You can use the aforementioned `kubectl plugin list` command to ensure that your plugin is visible by `kubectl`, and verify that there are no warnings preventing it from being called as a `kubectl` command.
-->
### 检查插件警告

你可以使用前面提到的 `kubectl plugin list` 命令来确保你的插件可以被 `kubectl` 看到，
并且验证没有警告防止它被称为 `kubectl` 命令。

```bash
kubectl plugin list
```

```
The following kubectl-compatible plugins are available:
  
test/fixtures/pkg/kubectl/plugins/kubectl-foo
/usr/local/bin/kubectl-foo
  - warning: /usr/local/bin/kubectl-foo is overshadowed by a similarly named plugin: test/fixtures/pkg/kubectl/plugins/kubectl-foo
plugins/kubectl-invalid
  - warning: plugins/kubectl-invalid identified as a kubectl plugin, but it is not executable

error: 2 plugin warnings were found
```

<!--
### Using the command line runtime package

If you're writing a plugin for kubectl and you're using Go, you can make use
of the
[cli-runtime](https://github.com/kubernetes/cli-runtime) utility libraries.

These libraries provide helpers for parsing or updating a user's
[kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
file, for making REST-style requests to the API server, or to bind flags
associated with configuration and printing.

See the [Sample CLI Plugin](https://github.com/kubernetes/sample-cli-plugin) for
an example usage of the tools provided in the CLI Runtime repo.
-->
### 使用命令行运行时包  {#using-the-command-line-runtime-package}

如果你在编写 kubectl 插件，而且你选择使用 Go 语言，你可以利用
[cli-runtime](https://github.com/kubernetes/cli-runtime) 工具库。

这些库提供了一些辅助函数，用来解析和更新用户的
[kubeconfig](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
文件，向 API 服务器发起 REST 风格的请求，或者将参数绑定到某配置上，
抑或将其打印输出。

关于 CLI Runtime 仓库所提供的工具的使用实例，可参考
[CLI 插件示例](https://github.com/kubernetes/sample-cli-plugin) 项目。

<!--
## Distributing kubectl plugins

If you have developed a plugin for others to use, you should consider how you
package it, distribute it and deliver updates to your users.
-->
## 分发 kubectl 插件

如果你开发了一个插件给别人使用，你应该考虑如何为其封装打包、如何分发软件
以及将来的更新到用户。

<!--
### Krew {#distributing-krew}

[Krew](https://krew.dev/) offers a cross-platform way to package and
distribute your plugins. This way, you use a single packaging format for all
target platforms (Linux, Windows, macOS etc) and deliver updates to your users.
Krew also maintains a [plugin
index](https://krew.sigs.k8s.io/plugins/) so that other people can
discover your plugin and install it.
-->
### Krew {#distributing-krew}

[Krew](https://krew.dev/) 提供了一种对插件进行打包和分发的跨平台方式。
基于这种方式，你会在所有的目标平台（Linux、Windows、macOS 等）使用同一
种打包形式，包括为用户提供更新。
Krew 也维护一个[插件索引（plugin index）](https://krew.sigs.k8s.io/plugins/)
以便其他人能够发现你的插件并安装之。

<!--
### Native / platform specific package management {#distributing-native}

Alternatively, you can use traditional package managers such as, `apt` or `yum`
on Linux, Chocolatey on Windows, and Homebrew on macOS. Any package
manager will be suitable if it can place new executables placed somewhere
in the user's `PATH`.
As a plugin author, if you pick this option then you also have the burden
of updating your kubectl plugin's distribution package across multiple
platforms for each release.
-->
### 原生的与特定平台的包管理     {#distributing-native}

另一种方式是，你可以使用传统的包管理器（例如 Linux 上 的 `apt` 或 `yum`，
Windows 上的 Chocolatey、macOs 上的 Homebrew）。
只要能够将新的可执行文件放到用户的 `PATH` 路径上某处，这种包管理器就符合需要。
作为一个插件作者，如果你选择这种方式来分发，你就需要自己来管理和更新
你的 kubectl 插件的分发包，包括所有平台和所有发行版本。

<!--
### Source code {#distributing-source-code}

You can publish the source code; for example, as a Git repository. If you
choose this option, someone who wants to use that plugin must fetch the code,
set up a build environment (if it needs compiling), and deploy the plugin.
If you also make compiled packages available, or use Krew, that will make
installs easier.
-->
### 源代码   {#distributing-source-code}

你也可以发布你的源代码，例如，发布为某个 Git 仓库。
如果你选择这条路线，希望使用该插件的用户必须取回代码、配置一个构造环境
（如果需要编译的话）并部署该插件。
如果你也提供编译后的软件包，或者使用 Krew，那就会大大简化安装过程了。

## {{% heading "whatsnext" %}}

<!--
* Check the Sample CLI Plugin repository for a
  [detailed example](https://github.com/kubernetes/sample-cli-plugin) of a
  plugin written in Go.
  In case of any questions, feel free to reach out to the
  [SIG CLI team](https://github.com/kubernetes/community/tree/master/sig-cli).
* Read about [Krew](https://krew.dev/), a package manager for kubectl plugins.
-->
* 查看 CLI 插件库示例，查看用 Go 编写的插件的[详细示例](https://github.com/kubernetes/sample-cli-plugin)
* 如有任何问题，请随时联系 [SIG CLI 团队](https://github.com/kubernetes/community/tree/master/sig-cli)
* 了解 [Krew](https://krew.dev/)，一个 kubectl 插件管理器。
