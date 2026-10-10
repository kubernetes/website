---
title: "PowerShell 自动补全"
description: "powershell 自动补全的一些可选配置。"
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
你可以使用命令 `kubectl completion powershell` 生成 PowerShell 的 kubectl 自动补全脚本。

如果需要自动补全在所有 Shell 会话中生效，请将以下命令添加到 `$PROFILE` 文件中：

```powershell
kubectl completion powershell | Out-String | Invoke-Expression
```

<!--
This command will regenerate the auto-completion script on every PowerShell start up. You can also add the generated script directly to your `$PROFILE` file.
-->
此命令将在每次 PowerShell 启动时重新生成自动补全脚本。你还可以将生成的自动补全脚本添加到 `$PROFILE` 文件中。

<!--
To add the generated script to your `$PROFILE` file, run the following line in your powershell prompt:
-->
如果需要将自动补全脚本直接添加到 `$PROFILE` 文件中，请在 PowerShell 命令行运行以下命令：

```powershell
kubectl completion powershell >> $PROFILE
```

<!--
After reloading your shell, kubectl autocompletion should be working.
-->
完成上述操作后重启 Shell，kubectl 的自动补全就可以工作了。
