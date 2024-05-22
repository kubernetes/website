---
title: "fishの自動補完"
description: "fishシェルの自動補完を有効にする補助的な設定。"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

{{< note >}}
Fishに対する自動補完はkubectl 1.23以降が必要です。
{{< /note >}}

Fishにおけるkubectlの補完スクリプトは`kubectl completion fish`コマンドで生成できます。
補完スクリプトをシェル内に読み込ませることでkubectlの自動補完が有効になります。

すべてのシェルセッションで使用するには、`~/.config/fish/config.fish`に以下を追記してください:

```shell
kubectl completion fish | source
```

シェルをリロードしたあとに、kubectlの自動補完が機能するはずです。
