---
title: Linuxノードのセキュリティ
content_type: concept
weight: 40
---

<!-- overview -->

このページでは、Linuxオペレーティングシステムに固有のセキュリティ上の考慮事項とベストプラクティスについて説明します。

<!-- body -->

## ノード上のSecretデータの保護

Linuxノードでは、メモリベースのボリューム([`secret`](/docs/concepts/configuration/secret/)ボリュームマウントや、`medium: Memory`を指定した[`emptyDir`](/docs/concepts/storage/volumes/#emptydir)など)は`tmpfs`ファイルシステムで実装されています。

スワップが設定されており、古いLinuxカーネルを使用している場合(または現在のカーネルで、Kubernetesがサポートしていない設定を使用している場合)、**メモリ**ベースのボリュームのデータが永続ストレージに書き込まれる可能性があります。

Linuxカーネルはバージョン6.3から公式に`noswap`オプションをサポートしているため、ノードでスワップが有効になっている場合は、使用するカーネルバージョンを6.3以降にするか、バックポートにより`noswap`オプションをサポートするバージョンを使用することが推奨されます。

詳細については、[スワップメモリ管理](/docs/concepts/cluster-administration/swap-memory-management/#memory-backed-volumes)を参照してください。