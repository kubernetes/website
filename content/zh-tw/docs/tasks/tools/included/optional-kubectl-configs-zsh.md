---
title: "zsh 自動補全"
description: "zsh 自動補全的一些可選設定"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---
<!-- 
title: "zsh auto-completion"
description: "Some optional configuration for zsh auto-completion."
headless: true
-->

<!-- 
The kubectl completion script for Zsh can be generated with the command `kubectl completion zsh`. Sourcing the completion script in your shell enables kubectl autocompletion.

To do so in all your shell sessions, add the following to your `~/.zshrc` file:
-->
kubectl 通過命令 `kubectl completion zsh` 生成 Zsh 自動補全腳本。
在 Shell 中導入（Sourcing）該自動補全腳本，將啓動 kubectl 自動補全功能。

爲了在所有的 Shell 會話中實現此功能，請將下面內容加入到文件 `~/.zshrc` 中。

```zsh
source <(kubectl completion zsh)
```

<!-- 
If you have an alias for kubectl, kubectl autocompletion will automatically work with it.
-->
如果你爲 kubectl 定義了別名，kubectl 自動補全將自動使用它。

<!-- 
After reloading your shell, kubectl autocompletion should be working.

If you get an error like `complete:13: command not found: compdef`, then add the following to the beginning of your `~/.zshrc` file:
If you get an error like `2: command not found: compdef`, then add the following to the beginning of your `~/.zshrc` file:
-->
重新加載 Shell 後，kubectl 自動補全功能將立即生效。

如果你收到 `2: command not found: compdef` 這樣的錯誤提示，那請將下面內容添加到
`~/.zshrc` 文件的開頭：

```zsh
autoload -Uz compinit
compinit
```

