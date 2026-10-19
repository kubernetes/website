---
title: "PowerShellの自動補完"
description: "PowerShellの自動補完に対するいくつかの補助的な設定。"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

PowerShellにおけるkubectlの補完スクリプトは`kubectl completion powershell`コマンドで生成できます。

すべてのシェルセッションでこれを行うには、次の行を`$PROFILE`ファイルに追加します。

```powershell
kubectl completion powershell | Out-String | Invoke-Expression
```

このコマンドは、PowerShellを起動する度に自動補完のスクリプトを再生成します。
生成されたスクリプトを直接`$PROFILE`ファイルに追加することもできます。

生成されたスクリプトを`$PROFILE`ファイルに追加するためには、PowerShellのプロンプトで次の行を実行します:

```powershell
kubectl completion powershell >> $PROFILE
```

シェルをリロードした後、kubectlの自動補完が機能します。
