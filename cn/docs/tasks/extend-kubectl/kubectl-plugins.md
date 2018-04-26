---
title: 使用插件扩展 kubectl
approvers:
- fabianofranz
cn-approvers:
- pigletfly
description: 使用 kubectl 插件，您可以通过添加新的子命令来扩展 kubectl 命令的功能。
---
<!--
---
title: Extend kubectl with plugins
approvers:
- fabianofranz
description: With kubectl plugins, you can extend the functionality of the kubectl command by adding new subcommands.
---
-->
<!--
This guide shows you how to install and write extensions for [kubectl](/docs/user-guide/kubectl/). Usually called *plugins* or *binary extensions*, this feature allows you to extend the default set of commands available in `kubectl` by adding new subcommands to perform new tasks and extend the set of features available in the main distribution of `kubectl`.
-->
{% capture overview %}

{% include feature-state-alpha.md %}

本指南指导您如何为 [kubectl](/docs/user-guide/kubectl/) 安装和编写扩展。通常被称为 *插件* 或者 *二进制扩展* ，这个特性允许您通过添加新的子命令来扩展 `kubectl` 中可用的默认命令集，以执行新的任务，并扩展 `kubectl` 主发行版中可用的功能集。

{% endcapture %}
<!--
You need to have a working `kubectl` binary installed. Note that plugins were officially introduced as an alpha feature in the v1.8.0 release. So, while some parts of the plugins feature were already available in previous versions, a `kubectl` version of 1.8.0 or later is recommended.

Until a GA version is released, plugins will only be available under the `kubectl plugin` subcommand.
-->
{% capture prerequisites %}

您需要安装一个可用的 `kubectl` 二进制文件。 请注意，插件是在 v1.8.0 发行版中作为 alpha 功能正式引入的。 因此，尽管插件功能的某些部分已经在以前的版本中可用，建议使用 1.8.0 或更高版本的 `kubectl` 版本。

在 GA 版本发布之前，插件只能在 `kubectl plugin` 子命令下使用。

{% endcapture %}
<!--
## Installing kubectl plugins

A plugin is nothing more than a set of files: at least a **plugin.yaml** descriptor, and likely one or more binary, script, or assets files. To install a plugin, copy those files to one of the locations in the filesystem where `kubectl` searches for plugins.

Note that Kubernetes does not provide a package manager or something similar to install or update plugins, so it's your responsibility to place the plugin files in the correct location. We recommend that each plugin is located on its own directory, so installing a plugin that is distributed as a compressed file is as simple as extracting it to one of the locations specified in the [Plugin loader](#plugin-loader) section.
-->
{% capture steps %}

## 安装 kubectl 插件

一个插件只不过是一组文件：至少一个 **plugin.yaml** 描述符，以及可能有一个或多个二进制文件、脚本或资产文件。 要安装一个插件，将这些文件复制到 `kubectl` 搜索插件的文件系统中的某个位置。

请注意，Kubernetes 不提供包管理器或类似的东西来安装或更新插件，因此您有责任将插件文件放在正确的位置。我们建议每个插件都位于自己的目录下，因此安装一个以压缩文件形式发布的插件就像将其解压到 [插件加载器](#插件加载器) 部分指定的某个位置一样简单。

<!--
### Plugin loader

The plugin loader is responsible for searching plugin files in the filesystem locations specified below, and checking if the plugin provides the minimum amount of information required for it to run. Files placed in the right location that don't provide the minimum amount of information, for example an incomplete *plugin.yaml* descriptor, are ignored.
-->
### 插件加载器

插件加载器负责在下面指定的文件系统位置搜索插件文件，并检查插件是否提供运行所需的最小信息量。放在正确位置但未提供最少信息的文件将被忽略，例如没有不完整的 *plugin.yaml* 描述符。

<!--
#### Search order

The plugin loader uses the following search order:

1. `${KUBECTL_PLUGINS_PATH}` If specified, the search stops here.
2. `${XDG_DATA_DIRS}/kubectl/plugins`
3. `~/.kube/plugins`

If the `KUBECTL_PLUGINS_PATH` environment variable is present, the loader uses it as the only location to look for plugins.
The `KUBECTL_PLUGINS_PATH` environment variable is a list of directories. In Linux and Mac, the list is colon-delimited. In
Windows, the list is semicolon-delimited.

If `KUBECTL_PLUGINS_PATH` is not present, the loader searches these additional locations:

First, one or more directories specified according to the
[XDG System Directory Structure](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)
specification. Specifically, the loader locates the directories specified by the `XDG_DATA_DIRS` environment variable,
and then searches `kubectl/plugins` directory inside of those.
If `XDG_DATA_DIRS` is not specified, it defaults to `/usr/local/share:/usr/share`.

Second, the `plugins` directory under the user's kubeconfig dir. In most cases, this is `~/.kube/plugins`.

```shell
# Loads plugins from both /path/to/dir1 and /path/to/dir2
KUBECTL_PLUGINS_PATH=/path/to/dir1:/path/to/dir2 kubectl plugin -h
```
-->
#### 插件搜索顺序

插件加载器使用以下搜索顺序：

1. 如果指定了 `${KUBECTL_PLUGINS_PATH}` ，搜索在这里停止。
2. `${XDG_DATA_DIRS}/kubectl/plugins`
3. `~/.kube/plugins`

如果存在 `KUBECTL_PLUGINS_PATH` 环境变量，则加载器将其用作查找插件的唯一位置。
`KUBECTL_PLUGINS_PATH` 环境变量是一个目录列表。在 Linux 和 Mac 中，列表是冒号分隔的。在
Windows 中，列表是以分号分隔的。

如果 `KUBECTL_PLUGINS_PATH` 不存在，加载器将搜索这些额外的位置：

首先，根据指定的一个或多个目录
[XDG系统目录结构]（https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html）
规范。具体来说，加载器定位由 `XDG_DATA_DIRS` 环境变量指定的目录，
然后在里面搜索 `kubectl/plugins` 目录。
如果未指定 `XDG_DATA_DIRS` ，则默认为 `/usr/local/share:/usr/share` 。

其次，用户的 kubeconfig 目录下的 `plugins` 目录。在大多数情况下，就是 `~/.kube/plugins` 。

```shell
# Loads plugins from both /path/to/dir1 and /path/to/dir2
KUBECTL_PLUGINS_PATH=/path/to/dir1:/path/to/dir2 kubectl plugin -h
```

<!--
## Writing kubectl plugins

You can write a plugin in any programming language or script that allows you to write command-line commands.
A plugin does not necessarily need to have a binary component. It could rely entirely on operating system utilities
like `echo`, `sed`, or `grep`. Or it could rely on the `kubectl` binary.

The only strong requirement for a `kubectl` plugin is the `plugin.yaml` descriptor file. This file is responsible for declaring at least the minimum attributes required to register a plugin and must be located under one of the locations specified in the [Search order](#search-order) section. 
-->
## 编写 kubectl 插件

您可以使用任何允许编写命令行命令的编程语言或脚本编写插件。
一个插件不一定需要有一个二进制组件。 它完全可以依靠操作系统实用程序
像` echo`、`sed` 或 `grep` 。或者可以依靠 `kubectl` 二进制文件。

`kubectl` 插件的唯一的强需求是 `plugin.yaml` 描述符文件。该文件负责声明注册插件所需的最小属性，并且必须位于 [插件搜索顺序](#插件搜索顺序) 部分指定的其中一个位置下。

<!--
### The plugin.yaml descriptor

The descriptor file supports the following attributes:

```
name: "targaryen"                 # REQUIRED: the plugin command name, to be invoked under 'kubectl'
shortDesc: "Dragonized plugin"    # REQUIRED: the command short description, for help
longDesc: ""                      # the command long description, for help
example: ""                       # command example(s), for help
command: "./dracarys"             # REQUIRED: the command, binary, or script to invoke when running the plugin
flags:                            # flags supported by the plugin
  - name: "heat"                  # REQUIRED for each flag: flag name
    shorthand: "h"                # short version of the flag name
    desc: "Fire heat"             # REQUIRED for each flag: flag description
    defValue: "extreme"           # default value of the flag
tree:                             # allows the declaration of subcommands
  - ...                           # subcommands support the same set of attributes
```

The preceding descriptor declares the `kubectl plugin targaryen` plugin, which has one flag named `-h | --heat`.
When the plugin is invoked, it calls the `dracarys` binary or script, which is located in the same directory as the descriptor file. The [Accessing runtime attributes](#accessing-runtime-attributes) section describes how the `dracarys` command accesses the flag value and other runtime context.
-->
### plugin.yaml 描述符

描述符文件支持以下属性：

```
name: "targaryen"                 # 必须项：插件命令名称，在 'kubectl' 下调用
shortDesc: "Dragonized plugin"    # 必须项: 该命令的简短描述，以获得帮助
longDesc: ""                      # the command long description, for help
example: ""                       # 该命令的长描述，寻求帮助
command: "./dracarys"             # 必须项：运行插件时要调用的命令、二进制文件或脚本
flags:                            # 插件支持的参数
  - name: "heat"                  # 每个参数的必须项：参数名称
    shorthand: "h"                # 参数名称的简短版本
    desc: "Fire heat"             # 每个参数的必须项：参数描述
    defValue: "extreme"           # 参数的默认值
tree:                             # 允许子命令的声明
  - ...                           # 子命令支持相同的一组属性
```

上面的描述符声明了 `kubectl plugin targaryen` 插件，它有一个名为 `-h | --heat` 的参数。
当插件被调用时，它会调用与描述符文件位于同一目录中的 `dracarys` 二进制文件或脚本。 [访问运行时属性](#访问运行时属性) 部分描述了 `dracarys` 命令如何访问参数值和其他运行时上下文。

<!--
### Recommended directory structure

It is recommended that each plugin has its own subdirectory in the filesystem, preferably with the same name as the plugin command. The directory must contain the `plugin.yaml` descriptor and any binary, script, asset, or other dependency it might require.

For example, the directory structure for the `targaryen` plugin could look like this:

```
~/.kube/plugins/
└── targaryen
    ├── plugin.yaml
    └── dracarys
```
-->
### 推荐的目录结构

建议每个插件在文件系统中都有自己的子目录，最好使用与插件命令相同的名称。该目录必须包含 `plugin.yaml` 描述符以及它可能需要的任何二进制文件、脚本、资产或其他依赖项。

例如，`targaryen` 插件的目录结构可能如下所示：

```
~/.kube/plugins/
└── targaryen
    ├── plugin.yaml
    └── dracarys
```
<!--
### Accessing runtime attributes

In most use cases, the binary or script file you write to support the plugin must have access to some contextual information provided by the plugin framework. For example, if you declared flags in the descriptor file, your plugin must have access to the user-provided flag values at runtime. The same is true for global flags. The plugin framework is responsible for doing that, so plugin writers don't need to worry about parsing arguments. This also ensures the best level of consistency between plugins and regular `kubectl` commands.

Plugins have access to runtime context attributes through environment variables. So to access the value provided through a flag, for example, just look for the value of the proper environment variable using the appropriate function call for your binary or script. 

The supported environment variables are:
-->
### 访问运行时属性

在大多数使用情况下，您为编写插件而编写的二进制文件或脚本文件必须能够访问由插件框架提供的一些上下文信息。例如，如果您在描述符文件中声明了参数，则您的插件必须能够在运行时访问用户提供的参数值。全局标志也是如此。插件框架负责做这件事，所以插件编写者不需要担心解析参数。这也确保了插件和常规 `kubectl` 命令之间的最佳一致性。

插件可以通过环境变量访问运行时上下文属性。因此，要访问通过参数提供的值，只需使用适当的函数调用二进制文件或脚本查找适当环境变量的值即可。

支持的环境变量是：
<!--
* `KUBECTL_PLUGINS_CALLER`: The full path to the `kubectl` binary that was used in the current command invocation.
As a plugin writer, you don't have to implement logic to authenticate and access the Kubernetes API. Instead, you can invoke `kubectl` to obtain the information you need, through something like `kubectl get --raw=/apis`.

* `KUBECTL_PLUGINS_CURRENT_NAMESPACE`: The current namespace that is the context for this call. This is the actual namespace to be used, meaning it was already processed in terms of the precedence between what was provided through the kubeconfig, the `--namespace` global flag, environment variables, and so on.

* `KUBECTL_PLUGINS_DESCRIPTOR_*`: One environment variable for every attribute declared in the `plugin.yaml` descriptor.
For example, `KUBECTL_PLUGINS_DESCRIPTOR_NAME`, `KUBECTL_PLUGINS_DESCRIPTOR_COMMAND`.

* `KUBECTL_PLUGINS_GLOBAL_FLAG_*`: One environment variable for every global flag supported by `kubectl`.
For example, `KUBECTL_PLUGINS_GLOBAL_FLAG_NAMESPACE`, `KUBECTL_PLUGINS_GLOBAL_FLAG_V`.

* `KUBECTL_PLUGINS_LOCAL_FLAG_*`: One environment variable for every local flag declared in the `plugin.yaml` descriptor. For example, `KUBECTL_PLUGINS_LOCAL_FLAG_HEAT` in the preceding `targaryen` example.

-->

* `KUBECTL_PLUGINS_CALLER`: 在当前命令调用中使用的 `kubectl` 二进制文件的完整路径。作为一个插件编写者，您不必实现逻辑来认证和访问 Kubernetes API。相反，您可以通过像 `kubectl get --raw=/apis` 这样的命令来调用 `kubectl` 来获得您需要的信息。

* `KUBECTL_PLUGINS_CURRENT_NAMESPACE`: 当前名称空间是此调用的上下文。这是要使用的实际名称空间，这意味着它已经通过kubeconfig、`--namespace` 全局参数、环境变量等提供的优先级处理。

* `KUBECTL_PLUGINS_DESCRIPTOR_*`: 在 `plugin.yaml` 描述符中声明的每个属性对应的一个环境变量。
例如，`KUBECTL_PLUGINS_DESCRIPTOR_NAME` ， `KUBECTL_PLUGINS_DESCRIPTOR_COMMAND`。

* `KUBECTL_PLUGINS_GLOBAL_FLAG_*`: `kubectl` 支持的每个全局参数对应的一个环境变量。
例如，`KUBECTL_PLUGINS_GLOBAL_FLAG_NAMESPACE` ， `KUBECTL_PLUGINS_GLOBAL_FLAG_V`。

* `KUBECTL_PLUGINS_LOCAL_FLAG_*`: `plugin.yaml` 描述符中声明的每个本地参数对应的一个环境变量。例如，前面的 `targaryen` 示例中的 `KUBECTL_PLUGINS_LOCAL_FLAG_HEAT`。

{% endcapture %}
<!--
* Check the repository for [some more examples](https://github.com/kubernetes/kubernetes/tree/master/pkg/kubectl/plugins/examples) of plugins.
* In case of any questions, feel free to reach out to the [CLI SIG team](https://github.com/kubernetes/community/tree/master/sig-cli).
* Binary plugins is still an alpha feature, so this is the time to contribute ideas and improvements to the codebase. We're also excited to hear about what you're planning to implement with plugins, so [let us know](https://github.com/kubernetes/community/tree/master/sig-cli)!
-->
{% capture whatsnext %}

* 去这个仓库查看更多插件的示例 [更多的例子](https://github.com/kubernetes/kubernetes/tree/master/pkg/kubectl/plugins/examples) 。
* 如果有任何问题，请随时和 [CLI SIG team](https://github.com/kubernetes/community/tree/master/sig-cli) 联系。
* 二进制插件仍然是一个 alpha 功能，所以现在是时候向代码库贡献想法和改进了。我们也很高兴想知道您打算用插件实现什么东西， 所以 [让我们知道](https://github.com/kubernetes/community/tree/master/sig-cli)!

{% endcapture %}

{% include templates/task.md %}
