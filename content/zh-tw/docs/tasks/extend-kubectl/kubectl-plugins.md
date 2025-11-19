---
title: 用插件擴展 kubectl
description: 通過創建和安裝 kubectl 插件擴展 kubectl。
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
This guide demonstrates how to install and write extensions for [kubectl](/docs/reference/kubectl/kubectl/).
By thinking of core `kubectl` commands as essential building blocks for interacting with a Kubernetes cluster,
a cluster administrator can think of plugins as a means of utilizing these building blocks to create more complex behavior.
Plugins extend `kubectl` with new sub-commands, allowing for new and custom features not included in the main distribution of `kubectl`.
-->
本指南演示瞭如何爲 [kubectl](/zh-cn/docs/reference/kubectl/kubectl/) 安裝和編寫擴展。
通過將核心 `kubectl` 命令看作與 Kubernetes 集羣交互的基本構建塊，
集羣管理員可以將插件視爲一種利用這些構建塊創建更復雜行爲的方法。
插件用新的子命令擴展了 `kubectl`，允許新的和自定義的特性不包括在 `kubectl` 的主要發行版中。

## {{% heading "prerequisites" %}}

<!--
You need to have a working `kubectl` binary installed.
-->
你需要安裝一個可用的 `kubectl` 可執行文件。

<!-- steps -->

<!--
## Installing kubectl plugins

A plugin is a standalone executable file, whose name begins with `kubectl-`. To install a plugin, move its executable file to anywhere on your `PATH`.
-->
## 安裝 kubectl 插件  {#installing-kubectl-plugins}

插件是一個獨立的可執行文件，名稱以 `kubectl-` 開頭。
要安裝插件，將其可執行文件移動到 `PATH` 中的任何位置。

<!--
You can also discover and install kubectl plugins available in the open source
using [Krew](https://krew.dev/). Krew is a plugin manager maintained by
the Kubernetes SIG CLI community.
-->
你也可以使用 [Krew](https://krew.dev/) 來發現和安裝開源的 kubectl 插件。
Krew 是一個由 Kubernetes SIG CLI 社區維護的插件管理器。

<!--
Kubectl plugins available via the Krew [plugin index](https://krew.sigs.k8s.io/plugins/)
are not audited for security. You should install and run third-party plugins at your
own risk, since they are arbitrary programs running on your machine.
-->
{{< caution >}}
Krew [插件索引](https://krew.sigs.k8s.io/plugins/) 所維護的 kubectl 插件並未經過安全性審查。
你要了解安裝和運行第三方插件的安全風險，因爲它們本質上時是一些在你的機器上
運行的程序。
{{< /caution >}}

<!--
### Discovering plugins

`kubectl` provides a command `kubectl plugin list` that searches your `PATH` for valid plugin executables.
Executing this command causes a traversal of all files in your `PATH`. Any files that are executable, and
begin with `kubectl-` will show up *in the order in which they are present in your `PATH`* in this command's output.
A warning will be included for any files beginning with `kubectl-` that are *not* executable.
A warning will also be included for any valid plugin files that overlap each other's name.

You can use [Krew](https://krew.dev/) to discover and install `kubectl`
plugins from a community-curated
[plugin index](https://krew.sigs.k8s.io/plugins/).
-->
### 發現插件  {#discovering-plugins}

`kubectl` 提供一個命令 `kubectl plugin list`，用於搜索 `PATH` 查找有效的插件可執行文件。
執行此命令將遍歷 `PATH` 中的所有文件。任何以 `kubectl-` 開頭的可執行文件都將在這個命令的輸出中**以它們在
`PATH` 中出現的順序**顯示。
任何以 `kubectl-` 開頭的文件如果`不可執行`，都將包含一個警告。
對於任何相同的有效插件文件，都將包含一個警告。

你可以使用 [Krew](https://krew.dev/) 從社區策劃的[插件索引](https://krew.sigs.k8s.io/plugins/)
中發現和安裝 `kubectl` 插件。

<!--
#### Create plugins

`kubectl` allows plugins to add custom create commands of the shape `kubectl create something` by providing a `kubectl-create-something` binary in the `PATH`.
-->
#### 創建插件  {#create-plugins}

通過在 `PATH` 中提供一個 `kubectl-create-something` 二進制文件，`kubectl` 允許插件添加形如 `kubectl create something` 的自定義創建命令。

<!--
#### Limitations

It is currently not possible to create plugins that overwrite existing `kubectl` commands or extend commands other than `create`.
For example, creating a plugin `kubectl-version` will cause that plugin to never be executed, as the existing `kubectl version`
command will always take precedence over it.
Due to this limitation, it is also *not* possible to use plugins to add new subcommands to existing `kubectl` commands.
For example, adding a subcommand `kubectl attach vm` by naming your plugin `kubectl-attach-vm` will cause that plugin to be ignored.

`kubectl plugin list` shows warnings for any valid plugins that attempt to do this.
-->
#### 限制  {#limitations}

目前無法創建覆蓋現有 `kubectl` 命令或擴展除 `create` 命令之外的插件。
例如，創建一個插件 `kubectl-version` 將導致該插件永遠不會被執行，
因爲現有的 `kubectl version` 命令總是優先於它執行。
由於這個限制，也不可能使用插件將新的子命令添加到現有的 `kubectl` 命令中。
例如，通過將插件命名爲 `kubectl-attach-vm` 來添加子命令 `kubectl attach vm` 將導致該插件被忽略。

對於任何試圖這樣做的有效插件 `kubectl plugin list` 的輸出中將顯示警告。

<!--
## Writing kubectl plugins

You can write a plugin in any programming language or script that allows you to write command-line commands.
-->
## 編寫 kubectl 插件  {#writing-kubectl-plugins}

你可以用任何編程語言或腳本編寫插件，允許你編寫命令行命令。

<!--
There is no plugin installation or pre-loading required. Plugin executables receive
the inherited environment from the `kubectl` binary.
A plugin determines which command path it wishes to implement based on its name.
For example, a plugin named `kubectl-foo` provides a command `kubectl foo`. You must
install the plugin executable somewhere in your `PATH`.
-->
不需要安裝插件或預加載，插件可執行程序從 `kubectl` 二進制文件接收繼承的環境，
插件根據其名稱確定它希望實現的命令路徑。
例如，名爲 `kubectl-foo` 的插件提供了命令 `kubectl foo`。
必須將插件的可執行文件安裝在 `PATH` 中的某個位置。

<!--
### Example plugin
-->
### 示例插件  {#example-plugin}

```
#!/bin/bash

# 可選的參數處理
if [[ "$1" == "version" ]]
then
    echo "1.0.0"
    exit 0
fi

# 可選的參數處理
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
### 使用插件  {#using-a-plugin}

<!--
To use a plugin, make the plugin executable:
-->
要使用某插件，先要使其可執行：

```shell
sudo chmod +x ./kubectl-foo
```

<!--
and place it anywhere in your `PATH`:
-->
並將它放在你的 `PATH` 中的任何地方：

```shell
sudo mv ./kubectl-foo /usr/local/bin
```

<!--
You may now invoke your plugin as a `kubectl` command:
-->
你現在可以調用你的插件作爲 `kubectl` 命令：

```shell
kubectl foo
```

```
I am a plugin named kubectl-foo
```

<!--
All args and flags are passed as-is to the executable:
-->
所有參數和標記按原樣傳遞給可執行文件：

```shell
kubectl foo version
```

```
1.0.0
```

<!--
All environment variables are also passed as-is to the executable:
-->
所有環境變量也按原樣傳遞給可執行文件：

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
此外，傳遞給插件的第一個參數總是調用它的位置的絕對路徑（在上面的例子中，`$0` 將等於 `/usr/local/bin/kubectl-foo`）。

<!--
### Naming a plugin

As seen in the example above, a plugin determines the command path that it will implement based on its filename. Every sub-command in the command path that a plugin targets, is separated by a dash (`-`).
For example, a plugin that wishes to be invoked whenever the command `kubectl foo bar baz` is invoked by the user, would have the filename of `kubectl-foo-bar-baz`.
-->
### 命名插件  {#naming-a-plugin}

如上面的例子所示，插件根據文件名確定要實現的命令路徑，插件所針對的命令路徑中的每個子命令都由破折號（`-`）分隔。
例如，當用戶調用命令 `kubectl foo bar baz` 時，希望調用該命令的插件的文件名爲 `kubectl-foo-bar-baz`。

<!--
#### Flags and argument handling
-->
#### 參數和標記處理  {#flags-and-argument-handling}

<!--
The plugin mechanism does _not_ create any custom, plugin-specific values or environment variables for a plugin process.

An older kubectl plugin mechanism provided environment variables such as `KUBECTL_PLUGINS_CURRENT_NAMESPACE`; that no longer happens.
-->
{{< note >}}
插件機制**不會**爲插件進程創建任何定製的、特定於插件的值或環境變量。

較老的插件機制會提供環境變量（例如 `KUBECTL_PLUGINS_CURRENT_NAMESPACE`）；這種機制已被廢棄。
{{< /note >}}

<!--
kubectl plugins must parse and validate all of the arguments passed to them.
See [using the command line runtime package](#using-the-command-line-runtime-package) for details of a Go library aimed at plugin authors.

Here are some additional cases where users invoke your plugin while providing additional flags and arguments. This builds upon the `kubectl-foo-bar-baz` plugin from the scenario above.
-->
kubectl 插件必須解析並檢查傳遞給它們的所有參數。
參閱[使用命令行運行時包](#using-the-command-line-runtime-package)瞭解針對
插件開發人員的 Go 庫的細節。

這裏是一些用戶調用你的插件的時候提供額外標誌和參數的場景。
這些場景時基於上述案例中的 `kubectl-foo-bar-baz` 插件的。

<!--
If you run `kubectl foo bar baz arg1 --flag=value arg2`, kubectl's plugin mechanism will first try to find the plugin with the longest possible name, which in this case
would be `kubectl-foo-bar-baz-arg1`. Upon not finding that plugin, kubectl then treats the last dash-separated value as an argument (`arg1` in this case), and attempts to find the next longest possible name, `kubectl-foo-bar-baz`.
Upon having found a plugin with this name, kubectl then invokes that plugin, passing all args and flags after the plugin's name as arguments to the plugin process.
-->

如果你運行 `kubectl foo bar baz arg1 --flag=value arg2`，kubectl 的插件機制將首先嚐試找到
最長可能名稱的插件，在本例中是 `kubectl-foo-bar-baz-arg1`。
當沒有找到這個插件時，kubectl 就會將最後一個以破折號分隔的值視爲參數（在本例中爲 `arg1`），
並嘗試找到下一個最長的名稱 `kubectl-foo-bar-baz`。
在找到具有此名稱的插件後，它將調用該插件，並在其名稱之後將所有參數和標誌傳遞給插件進程。

<!-- Example: -->
示例：

```bash
# 創建一個插件
echo -e '#!/bin/bash\n\necho "My first command-line argument was $1"' > kubectl-foo-bar-baz
sudo chmod +x ./kubectl-foo-bar-baz

# 將插件放到 PATH 下完成"安裝"
sudo mv ./kubectl-foo-bar-baz /usr/local/bin

# 確保 kubectl 能夠識別我們的插件
kubectl plugin list
```

```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-foo-bar-baz
```

```shell
# 測試通過 "kubectl" 命令來調用我們的插件時可行的
# 即使我們給插件傳遞一些額外的參數或標誌
kubectl foo bar baz arg1 --meaningless-flag=true
```

```
My first command-line argument was arg1
```

<!--
As you can see, your plugin was found based on the `kubectl` command specified by a user, and all extra arguments and flags were passed as-is to the plugin executable once it was found.
-->
正如你所看到的，你的插件是基於用戶指定的 `kubectl` 命令找到的，
所有額外的參數和標記都是按原樣傳遞給插件可執行文件的。

<!--
#### Names with dashes and underscores

Although the `kubectl` plugin mechanism uses the dash (`-`) in plugin filenames to separate the sequence of sub-commands processed by the plugin, it is still possible to create a plugin
command containing dashes in its commandline invocation by using underscores (`_`) in its filename.
-->
#### 帶有破折號和下劃線的名稱  {#names-with-dashes-and-underscores}

雖然 `kubectl` 插件機制在插件文件名中使用破折號（`-`）分隔插件處理的子命令序列，
但是仍然可以通過在文件名中使用下劃線（`_`）來創建命令行中包含破折號的插件命令。

<!-- Example: -->
例子：

```bash
# 創建文件名中包含下劃線的插件
echo -e '#!/bin/bash\n\necho "I am a plugin with a dash in my name"' > ./kubectl-foo_bar
sudo chmod +x ./kubectl-foo_bar
  
# 將插件放到 PATH 下
sudo mv ./kubectl-foo_bar /usr/local/bin

# 現在可以通過 kubectl 來調用插件
kubectl foo-bar
```
```
I am a plugin with a dash in my name
```

<!--
Note that the introduction of underscores to a plugin filename does not prevent you from having commands such as `kubectl foo_bar`.
The command from the above example, can be invoked using either a dash (`-`) or an underscore (`_`):
-->
請注意，在插件文件名中引入下劃線並不會阻止你使用 `kubectl foo_bar` 之類的命令。
可以使用破折號（`-`）或下劃線（`_`）調用上面示例中的命令:

```shell
# 我們的插件也可以用破折號來調用
kubectl foo-bar
```

```
I am a plugin with a dash in my name
```

```shell
# 你也可以使用下劃線來調用我們的定製命令
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
#### 命名衝突和弊端  {#name-conflicts-and-overshadowing}

可以在 `PATH` 的不同位置提供多個文件名相同的插件，
例如，給定一個 `PATH` 爲: `PATH=/usr/local/bin/plugins:/usr/local/bin/moreplugins`，
在 `/usr/local/bin/plugins` 和 `/usr/local/bin/moreplugins` 中可以存在一個插件
`kubectl-foo` 的副本，這樣 `kubectl plugin list` 命令的輸出就是:

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
在上面的場景中 `/usr/local/bin/moreplugins/kubectl-foo` 下的警告告訴你這個插件永遠不會被執行。
相反，首先出現在你 `PATH` 中的可執行文件 `/usr/local/bin/plugins/kubectl-foo` 
總是首先被 `kubectl` 插件機制找到並執行。

<!--
A way to resolve this issue is to ensure that the location of the plugin that you wish to use with `kubectl` always comes first in your `PATH`. For example, if you want to always use `/usr/local/bin/moreplugins/kubectl-foo` anytime that the `kubectl` command `kubectl foo` was invoked, change the value of your `PATH` to be `/usr/local/bin/moreplugins:/usr/local/bin/plugins`.
-->
解決這個問題的一種方法是你確保你希望與 `kubectl` 一起使用的插件的位置總是在你的 `PATH` 中首先出現。
例如，如果你總是想使用 `/usr/local/bin/moreplugins/kubectl foo`，
那麼在調用 `kubectl` 命令 `kubectl foo` 時，你只需將路徑的值更改爲 `/usr/local/bin/moreplugins:/usr/local/bin/plugins`。

<!--
#### Invocation of the longest executable filename

There is another kind of overshadowing that can occur with plugin filenames. Given two plugins present in a user's `PATH`: `kubectl-foo-bar` and `kubectl-foo-bar-baz`, the `kubectl` plugin mechanism will always choose the longest possible plugin name for a given user command. Some examples below, clarify this further:
-->
#### 調用最長的可執行文件名  {#invocation-of-the-longest-executable-filename}

對於插件文件名而言還有另一種弊端，給定用戶 `PATH` 中的兩個插件 `kubectl-foo-bar` 和 `kubectl-foo-bar-baz`，
`kubectl` 插件機制總是爲給定的用戶命令選擇儘可能長的插件名稱。下面的一些例子進一步的說明了這一點：

```bash
# 對於給定的 kubectl 命令，最長可能文件名的插件是被優先選擇的
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
這種設計選擇確保插件子命令可以跨多個文件實現，如果需要，這些子命令可以嵌套在"父"插件命令下：

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
### 檢查插件警告  {#checking-for-plugin-warnings}

你可以使用前面提到的 `kubectl plugin list` 命令來確保你的插件可以被 `kubectl` 看到，
並且驗證沒有警告防止它被稱爲 `kubectl` 命令。

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
### 使用命令行運行時包  {#using-the-command-line-runtime-package}

如果你在編寫 kubectl 插件，而且你選擇使用 Go 語言，你可以利用
[cli-runtime](https://github.com/kubernetes/cli-runtime) 工具庫。

這些庫提供了一些輔助函數，用來解析和更新用戶的
[kubeconfig](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
文件，向 API 服務器發起 REST 風格的請求，或者將參數綁定到某配置上，
抑或將其打印輸出。

關於 CLI Runtime 倉庫所提供的工具的使用實例，可參考
[CLI 插件示例](https://github.com/kubernetes/sample-cli-plugin) 項目。

<!--
## Distributing kubectl plugins

If you have developed a plugin for others to use, you should consider how you
package it, distribute it and deliver updates to your users.
-->
## 分發 kubectl 插件  {#distributing-kubectl-plugins}

如果你開發了一個插件給別人使用，你應該考慮如何爲其封裝打包、如何分發軟件
以及將來的更新到用戶。

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

[Krew](https://krew.dev/) 提供了一種對插件進行打包和分發的跨平臺方式。
基於這種方式，你會在所有的目標平臺（Linux、Windows、macOS 等）使用同一
種打包形式，包括爲用戶提供更新。
Krew 也維護一個[插件索引（plugin index）](https://krew.sigs.k8s.io/plugins/)
以便其他人能夠發現你的插件並安裝之。

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
### 原生的與特定平臺的包管理     {#distributing-native}

另一種方式是，你可以使用傳統的包管理器（例如 Linux 上 的 `apt` 或 `yum`，
Windows 上的 Chocolatey、macOs 上的 Homebrew）。
只要能夠將新的可執行文件放到用戶的 `PATH` 路徑上某處，這種包管理器就符合需要。
作爲一個插件作者，如果你選擇這種方式來分發，你就需要自己來管理和更新
你的 kubectl 插件的分發包，包括所有平臺和所有發行版本。

<!--
### Source code {#distributing-source-code}

You can publish the source code; for example, as a Git repository. If you
choose this option, someone who wants to use that plugin must fetch the code,
set up a build environment (if it needs compiling), and deploy the plugin.
If you also make compiled packages available, or use Krew, that will make
installs easier.
-->
### 源代碼   {#distributing-source-code}

你也可以發佈你的源代碼，例如，發佈爲某個 Git 倉庫。
如果你選擇這條路線，希望使用該插件的用戶必須取回代碼、配置一個構造環境
（如果需要編譯的話）並部署該插件。
如果你也提供編譯後的軟件包，或者使用 Krew，那就會大大簡化安裝過程了。

## {{% heading "whatsnext" %}}

<!--
* Check the Sample CLI Plugin repository for a
  [detailed example](https://github.com/kubernetes/sample-cli-plugin) of a
  plugin written in Go.
  In case of any questions, feel free to reach out to the
  [SIG CLI team](https://github.com/kubernetes/community/tree/master/sig-cli).
* Read about [Krew](https://krew.dev/), a package manager for kubectl plugins.
-->
* 查看 CLI 插件庫示例，查看用 Go 編寫的插件的[詳細示例](https://github.com/kubernetes/sample-cli-plugin)
* 如有任何問題，請隨時聯繫 [SIG CLI 團隊](https://github.com/kubernetes/community/tree/master/sig-cli)
* 瞭解 [Krew](https://krew.dev/)，一個 kubectl 插件管理器。
