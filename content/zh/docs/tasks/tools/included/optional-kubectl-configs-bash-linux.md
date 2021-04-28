---
title: "Linux 系统中的 bash 自动补全功能"
description: "Linux 系统中 bash 自动补全功能的一些可选配置。"
headless: true
---
<!-- 
---
title: "bash auto-completion on Linux"
description: "Some optional configuration for bash auto-completion on Linux."
headless: true
---
-->

<!-- 
### Introduction
-->
### 简介 {#introduction}

<!-- 
The kubectl completion script for Bash can be generated with the command `kubectl completion bash`. Sourcing the completion script in your shell enables kubectl autocompletion.

However, the completion script depends on [**bash-completion**](https://github.com/scop/bash-completion), which means that you have to install this software first (you can test if you have bash-completion already installed by running `type _init_completion`).
-->
kubectl 的 Bash 补全脚本可以用命令 `kubectl completion bash` 生成。
在 shell 中导入（Sourcing）补全脚本，将启用 kubectl 自动补全功能。

然而，补全脚本依赖于工具 [**bash-completion**](https://github.com/scop/bash-completion)，
所以要先安装它（可以用命令 `type _init_completion` 检查 bash-completion 是否已安装）。

<!-- 
### Install bash-completion
-->
### 安装 bash-completion {#install-bash-comletion}

<!-- 
bash-completion is provided by many package managers (see [here](https://github.com/scop/bash-completion#installation)). You can install it with `apt-get install bash-completion` or `yum install bash-completion`, etc.

The above commands create `/usr/share/bash-completion/bash_completion`, which is the main script of bash-completion. Depending on your package manager, you have to manually source this file in your `~/.bashrc` file.

To find out, reload your shell and run `type _init_completion`. If the command succeeds, you're already set, otherwise add the following to your `~/.bashrc` file:
-->
很多包管理工具均支持 bash-completion（参见[这里](https://github.com/scop/bash-completion#installation)）。
可以通过 `apt-get install bash-completion` 或 `yum install bash-completion` 等命令来安装它。

上述命令将创建文件 `/usr/share/bash-completion/bash_completion`，它是 bash-completion 的主脚本。
依据包管理工具的实际情况，你需要在 `~/.bashrc` 文件中手工导入此文件。

要查看结果，请重新加载你的 shell，并运行命令 `type _init_completion`。
如果命令执行成功，则设置完成，否则将下面内容添加到文件 `~/.bashrc` 中：

```bash
source /usr/share/bash-completion/bash_completion
```

<!-- 
Reload your shell and verify that bash-completion is correctly installed by typing `type _init_completion`.
-->
重新加载 shell，再输入命令 `type _init_completion` 来验证 bash-completion 的安装状态。

<!-- 
### Enable kubectl autocompletion
-->
### 启动 kubectl 自动补全功能 {#enable-kubectl-autocompletion}

<!-- 
You now need to ensure that the kubectl completion script gets sourced in all your shell sessions. There are two ways in which you can do this:
-->
你现在需要确保一点：kubectl 补全脚本已经导入（sourced）到 shell 会话中。
这里有两种验证方法：

<!-- 
- Source the completion script in your `~/.bashrc` file:
-->
- 在文件 `~/.bashrc` 中导入（source）补全脚本：

  ```bash
  echo 'source <(kubectl completion bash)' >>~/.bashrc
  ```

<!-- 
- Add the completion script to the `/etc/bash_completion.d` directory:
-->
- 将补全脚本添加到目录 `/etc/bash_completion.d` 中：

  ```bash
  kubectl completion bash >/etc/bash_completion.d/kubectl
  ```

<!-- 
If you have an alias for kubectl, you can extend shell completion to work with that alias:
-->
如果 kubectl 有关联的别名，你可以扩展 shell 补全来适配此别名：

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -F __start_kubectl k' >>~/.bashrc
```

{{< note >}}
<!-- 
bash-completion sources all completion scripts in `/etc/bash_completion.d`.
-->
bash-completion 负责导入 `/etc/bash_completion.d` 目录中的所有补全脚本。
{{< /note >}}

<!-- 
Both approaches are equivalent. After reloading your shell, kubectl autocompletion should be working.
-->
两种方式的效果相同。重新加载 shell 后，kubectl 自动补全功能即可生效。
