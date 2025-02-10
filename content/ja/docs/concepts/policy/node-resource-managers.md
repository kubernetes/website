---
title: ノードリソースマネージャー 
content_type: concept
weight: 50
---

<!-- overview -->

レイテンシーが致命的なワークロードや高スループットのワークロードをサポートするために、Kubernetesは一連のリソースマネージャーを提供します。リソースマネージャーはCPUやデバイス、メモリ(hugepages)などのリソースの特定の要件が設定されたPodのためにノードリソースの調整と最適化を目指しています。

<!-- body -->

メインのマネージャーであるトポロジーマネージャーは[ポリシー](/ja/docs/tasks/administer-cluster/topology-manager/)に沿って全体のリソース管理プロセスを調整するKubeletコンポーネントです。

個々のマネージャーの設定は下記のドキュメントで詳しく説明されてます。

- [CPUマネージャーポリシー](/docs/tasks/administer-cluster/cpu-management-policies/)
- [デバイスポリシー](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager)
- [メモリマネージャーポリシー](/docs/tasks/administer-cluster/memory-manager/)
