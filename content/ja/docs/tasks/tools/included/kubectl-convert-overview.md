---
title: "kubectl-convertの概要"
description: >-
  Kubernetes APIのあるバージョンから別のバージョンにマニフェストを変換することができるkubectlプラグイン。
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

異なるAPIバージョン間でマニフェストを変換できる、Kubernetesコマンドラインツール`kubectl`のプラグインです。
これは特に、新しいKubernetesのリリースで、非推奨ではないAPIバージョンにマニフェストを移行する場合に役に立ちます。
詳細については[非推奨ではないAPIへの移行](/docs/reference/using-api/deprecation-guide/#migrate-to-non-deprecated-apis)を参照してください。
