---
title: "PowerShell 自動補全"
description: "powershell 自動補全的一些可選設定。"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---
<!--
title: "PowerShell auto-completion"
description: "Some optional configuration for powershell auto-completion."
headless: true
-->

<!--
The kubectl completion script for PowerShell can be generated with the command `kubectl completion powershell`.

To do so in all your shell sessions, add the following line to your `$PROFILE` file:
-->
你可以使用命令 `kubectl completion powershell` 生成 PowerShell 的 kubectl 自動補全腳本。

如果需要自動補全在所有 Shell 會話中生效，請將以下命令添加到 `$PROFILE` 檔案中：

```powershell
kubectl completion powershell | Out-String | Invoke-Expression
```

<!--
This command will regenerate the auto-completion script on every PowerShell start up. You can also add the generated script directly to your `$PROFILE` file.
-->
此命令將在每次 PowerShell 啓動時重新生成自動補全腳本。你還可以將生成的自動補全腳本添加到 `$PROFILE` 檔案中。

<!--
To add the generated script to your `$PROFILE` file, run the following line in your powershell prompt:
-->
如果需要將自動補全腳本直接添加到 `$PROFILE` 檔案中，請在 PowerShell 命令列運行以下命令：

```powershell
kubectl completion powershell >> $PROFILE
```

<!--
After reloading your shell, kubectl autocompletion should be working.
-->
完成上述操作後重啓 Shell，kubectl 的自動補全就可以工作了。
