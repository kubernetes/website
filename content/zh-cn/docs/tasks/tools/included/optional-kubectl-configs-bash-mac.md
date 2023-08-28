---
title: "macOS 系统上的 bash 自动补全"
description: "在 macOS 上实现 Bash 自动补全的一些可选配置。"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---
<!-- 
title: "bash auto-completion on macOS"
description: "Some optional configuration for bash auto-completion on macOS."
headless: true
_build:
  list: never
  render: never
  publishResources: false
-->

<!-- 
### Introduction
-->
### 简介 {#introduction}

<!-- 
The kubectl completion script for Bash can be generated with `kubectl completion bash`.
Sourcing this script in your shell enables kubectl completion.

However, the kubectl completion script depends on
[**bash-completion**](https://github.com/scop/bash-completion) which you thus have to previously install.
-->
kubectl 的 Bash 补全脚本可以通过 `kubectl completion bash` 命令生成。
在你的 Shell 中导入（Sourcing）这个脚本即可启用补全功能。

此外，kubectl 补全脚本依赖于工具 [**bash-completion**](https://github.com/scop/bash-completion)，
所以你必须先安装它。

{{< warning>}}
<!-- 
There are two versions of bash-completion, v1 and v2. V1 is for Bash 3.2
(which is the default on macOS), and v2 is for Bash 4.1+. The kubectl completion
script **doesn't work** correctly with bash-completion v1 and Bash 3.2.
It requires **bash-completion v2** and **Bash 4.1+**. Thus, to be able to
correctly use kubectl completion on macOS, you have to install and use
Bash 4.1+ ([*instructions*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)).
The following instructions assume that you use Bash 4.1+
(that is, any Bash version of 4.1 or newer).
-->
bash-completion 有两个版本：v1 和 v2。v1 对应 Bash 3.2（也是 macOS 的默认安装版本），
v2 对应 Bash 4.1+。kubectl 的补全脚本**无法适配** bash-completion v1 和 Bash 3.2。
必须为它配备 **bash-completion v2** 和 **Bash 4.1+**。
有鉴于此，为了在 macOS 上使用 kubectl 补全功能，你必须要安装和使用 Bash 4.1+
（[**说明**](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)）。
后续说明假定你用的是 Bash 4.1+（也就是 Bash 4.1 或更新的版本）。
{{< /warning >}}

<!-- 
### Upgrade Bash
-->
### 升级 Bash {#upgrade-bash}

<!-- 
The instructions here assume you use Bash 4.1+. You can check your Bash's version by running:
-->
后续说明假定你已使用 Bash 4.1+。你可以运行以下命令检查 Bash 版本：

```bash
echo $BASH_VERSION
```

<!-- 
If it is too old, you can install/upgrade it using Homebrew:
-->
如果版本太旧，可以用 Homebrew 安装/升级：

```bash
brew install bash
```

<!-- 
Reload your shell and verify that the desired version is being used:
-->
重新加载 Shell，并验证所需的版本已经生效：

```bash
echo $BASH_VERSION $SHELL
```

<!-- 
Homebrew usually installs it at `/usr/local/bin/bash`.
-->
Homebrew 通常把它安装为 `/usr/local/bin/bash`。

<!-- 
### Install bash-completion
-->
### 安装 bash-completion {#install-bash-completion}

{{< note >}}
<!--
As mentioned, these instructions assume you use Bash 4.1+,
which means you will install bash-completion v2 (in contrast to Bash 3.2 and bash-completion v1,
in which case kubectl completion won't work).
-->
如前所述，本说明假定你使用的 Bash 版本为 4.1+，这意味着你要安装 bash-completion v2
（不同于 Bash 3.2 和 bash-completion v1，kubectl 的补全功能在该场景下无法工作）。
{{< /note >}}

<!-- 
You can test if you have bash-completion v2 already installed with `type _init_completion`.
If not, you can install it with Homebrew:
-->
你可以用命令 `type _init_completion` 测试 bash-completion v2 是否已经安装。
如未安装，用 Homebrew 来安装它：

```bash
brew install bash-completion@2
```

<!-- 
As stated in the output of this command, add the following to your `~/.bash_profile` file:
-->
如命令的输出信息所显示的，将如下内容添加到文件 `~/.bash_profile` 中：

```bash
brew_etc="$(brew --prefix)/etc" && [[ -r "${brew_etc}/profile.d/bash_completion.sh" ]] && . "${brew_etc}/profile.d/bash_completion.sh"
```

<!-- 
Reload your shell and verify that bash-completion v2 is correctly installed with `type _init_completion`.
-->
重新加载 Shell，并用命令 `type _init_completion` 验证 bash-completion v2 已经恰当的安装。

<!-- 
### Enable kubectl autocompletion
-->
### 启用 kubectl 自动补全功能 {#enable-kubectl-autocompletion}

<!-- 
You now have to ensure that the kubectl completion script gets sourced in all
your shell sessions. There are multiple ways to achieve this:

- Source the completion script in your `~/.bash_profile` file:
-->
你现在需要确保在所有的 Shell 环境中均已导入（sourced）kubectl 的补全脚本，
有若干种方法可以实现这一点：

- 在文件 `~/.bash_profile` 中导入（Source）补全脚本：

  ```bash
  echo 'source <(kubectl completion bash)' >>~/.bash_profile
  ```

<!-- 
- Add the completion script to the `/usr/local/etc/bash_completion.d` directory:
-->
- 将补全脚本添加到目录 `/usr/local/etc/bash_completion.d` 中：

  ```bash
  kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
  ```

<!-- 
- If you have an alias for kubectl, you can extend shell completion to work with that alias:
-->
- 如果你为 kubectl 定义了别名，则可以扩展 Shell 补全来兼容该别名：

  ```bash
  echo 'alias k=kubectl' >>~/.bash_profile
  echo 'complete -o default -F __start_kubectl k' >>~/.bash_profile
  ```

<!-- 
- If you installed kubectl with Homebrew (as explained
  [here](/docs/tasks/tools/install-kubectl-macos/#install-with-homebrew-on-macos)),
  then the kubectl completion script should already be in `/usr/local/etc/bash_completion.d/kubectl`.
  In that case, you don't need to do anything.
-->
- 如果你是用 Homebrew 安装的 kubectl
  （如[此页面](/zh-cn/docs/tasks/tools/install-kubectl-macos/#install-with-homebrew-on-macos)所描述），
  则 kubectl 补全脚本应该已经安装到目录 `/usr/local/etc/bash_completion.d/kubectl`
  中了。这种情况下，你什么都不需要做。

  {{< note >}}
  <!-- 
  The Homebrew installation of bash-completion v2 sources all the files in the
  `BASH_COMPLETION_COMPAT_DIR` directory, that's why the latter two methods work.
  -->
  用 Hommbrew 安装的 bash-completion v2 会初始化目录 `BASH_COMPLETION_COMPAT_DIR`
  中的所有文件，这就是后两种方法能正常工作的原因。
  {{< /note >}}

<!-- 
In any case, after reloading your shell, kubectl completion should be working.
-->
总之，重新加载 Shell 之后，kubectl 补全功能将立即生效。
