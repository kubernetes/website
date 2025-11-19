---
title: "fish 自動補全"
description: "啓用 fish 自動補全的可選配置。"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---
<!--
title: "fish auto-completion"
description: "Optional configuration to enable fish shell auto-completion."
headless: true
_build:
  list: never
  render: never
  publishResources: false
-->

{{< note >}}
<!--
Autocomplete for Fish requires kubectl 1.23 or later.
-->
自動補全 Fish 需要 kubectl 1.23 或更高版本。
{{< /note >}}

<!--
The kubectl completion script for Fish can be generated with the command `kubectl completion fish`. Sourcing the completion script in your shell enables kubectl autocompletion.

To do so in all your shell sessions, add the following line to your `~/.config/fish/config.fish` file:
-->
kubectl 通過命令 `kubectl completion fish` 生成 Fish 自動補全腳本。
在 shell 中導入（Sourcing）該自動補全腳本，將啓動 kubectl 自動補全功能。

爲了在所有的 shell 會話中實現此功能，請將下面內容加入到文件 `~/.config/fish/config.fish` 中。

```shell
kubectl completion fish | source
```

<!--
After reloading your shell, kubectl autocompletion should be working.
-->
重新加載 shell 後，kubectl 自動補全功能將立即生效。
