---
title: "fish 自動補全"
description: "啟用 fish 自動補全的可選配置。"
headless: true
---
<!--
---
title: "fish auto-completion"
description: "Optional configuration to enable fish shell auto-completion."
headless: true
---
-->

<!--
The kubectl completion script for Fish can be generated with the command `kubectl completion fish`. Sourcing the completion script in your shell enables kubectl autocompletion.

To do so in all your shell sessions, add the following line to your `~/.config/fish/config.fish` file:
-->
kubectl 透過命令 `kubectl completion fish` 生成 Fish 自動補全指令碼。
在 shell 中匯入（Sourcing）該自動補全指令碼，將啟動 kubectl 自動補全功能。

為了在所有的 shell 會話中實現此功能，請將下面內容加入到檔案 `~/.config/fish/config.fish` 中。

```shell
kubectl completion fish | source
```

<!--
After reloading your shell, kubectl autocompletion should be working.
-->
重新載入 shell 後，kubectl 自動補全功能將立即生效。
