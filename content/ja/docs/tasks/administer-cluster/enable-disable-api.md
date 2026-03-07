---
title: Kubernetes APIの有効化または無効化
content_type: task
weight: 200
---

<!-- overview -->
このページでは、クラスターの{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}から特定のAPIバージョンを有効化または無効化する方法について説明します。

<!-- steps -->


特定のAPIバージョンは、APIサーバーのコマンドライン引数として`--runtime-config=api/<version>`を渡すことで有効化または無効化できます。
この引数の値はカンマ区切りのAPIバージョンのリストで、後に定義された値が前に定義された値を上書きします。

また、`runtime-config`コマンドライン引数は、以下の2つの特殊なキーもサポートしています:

- `api/all`: すべての既知のAPIを表します。
- `api/legacy`: レガシーAPIのみを表します。
  レガシーAPIとは、明示的に[非推奨](/docs/reference/using-api/deprecation-policy/)とされたすべてのAPIを指します。

例えば、v1以外のすべてのAPIバージョンを無効にするには、`kube-apiserver`に`--runtime-config=api/all=false,api/v1=true`を渡します。

## {{% heading "whatsnext" %}}

`kube-apiserver`コンポーネントの[完全なドキュメント](/docs/reference/command-line-tools-reference/kube-apiserver/)を参照してください。
