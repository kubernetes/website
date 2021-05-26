---
title: "zsh 自动补全"
description: "zsh 自动补全的一些可选配置"
headless: true
---
<!-- 
---
title: "zsh auto-completion"
description: "Some optional configuration for zsh auto-completion."
headless: true
---
-->

<!-- 
The kubectl completion script for Zsh can be generated with the command `kubectl completion zsh`. Sourcing the completion script in your shell enables kubectl autocompletion.

To do so in all your shell sessions, add the following to your `~/.zshrc` file:
-->
kubectl 通过命令 `kubectl completion zsh` 生成 Zsh 自动补全脚本。
在 shell 中导入（Sourcing）该自动补全脚本，将启动 kubectl 自动补全功能。

为了在所有的 shell 会话中实现此功能，请将下面内容加入到文件 `~/.zshrc` 中。

```zsh
source <(kubectl completion zsh)
```

<!-- 
If you have an alias for kubectl, you can extend shell completion to work with that alias:
-->
如果你为 kubectl 定义了别名，可以扩展脚本补全，以兼容该别名。

```zsh
echo 'alias k=kubectl' >>~/.zshrc
echo 'complete -F __start_kubectl k' >>~/.zshrc
```

<!-- 
After reloading your shell, kubectl autocompletion should be working.

If you get an error like `complete:13: command not found: compdef`, then add the following to the beginning of your `~/.zshrc` file:
-->
重新加载 shell 后，kubectl 自动补全功能将立即生效。

如果你收到 `complete:13: command not found: compdef` 这样的错误提示，那请将下面内容添加到 `~/.zshrc` 文件的开头：

```zsh
autoload -Uz compinit
compinit
```
