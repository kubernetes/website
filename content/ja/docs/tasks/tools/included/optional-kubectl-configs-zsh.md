---
title: "zshの自動補完"
description: "zshの自動補完に対するいくつかの補助的な設定。"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

Zshにおけるkubectlの補完スクリプトは`kubectl completion zsh`コマンドで生成できます。
補完スクリプトをシェル内に読み込ませることでkubectlの自動補完が有効になります。

すべてのシェルセッションで使用するには、`~/.zshrc`に以下を追記してください:

```zsh
source <(kubectl completion zsh)
```

kubectlにエイリアスを張っている場合でも、kubectlの自動補完は自動的に機能します。

シェルをリロードしたあとに、kubectlの自動補完が機能するはずです。

`2: command not found: compdef`のようなエラーが出力された場合は、以下を`~/.zshrc`の先頭に追記してください:

```zsh
autoload -Uz compinit
compinit
```