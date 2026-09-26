---
title: Podグループポリシー
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

[Workload](/docs/concepts/workloads/workload-api/)で定義される各Podグループは、スケジューリングポリシーを宣言する必要があります。
このポリシーは、スケジューラーがPodのグループをどのように扱うかを指定します。

<!-- body -->

## ポリシータイプ {#policy-types}

現在、APIは`basic`と`gang`の2つのポリシータイプをサポートしています。
各グループに対して、いずれか1つのポリシーを指定する必要があります。

### basicポリシー {#basic-policy}

`basic`ポリシーは、グループ内のすべてのPodを独立したエンティティとして扱い、標準的なKubernetesの動作でスケジューリングするようスケジューラーに指示します。

`basic`ポリシーを使用する主な理由は、Workload内のPodを整理して、可観測性と管理性を向上させることです。
このポリシーは、同時起動を必要としないが、論理的に同じアプリケーションに属するWorkloadのグループに使用できます。
また、将来的に「全か無か」の配置を意味しないグループ制約を追加する余地も残されています。

```yaml
policy:
  basic: {}
```

### gangポリシー {#gang-policy}

`gangポリシー`は、「全か無か」のスケジューリングを強制します。
これは、一部のPodだけが起動すると、デッドロックやリソースの浪費が発生する密結合したワークロードには必須です。

これは、すべてのワーカーが同時に実行されなければ処理が進まない[Job](/docs/concepts/workloads/controllers/job/)や、その他のバッチ処理に使用できます。

`gang`ポリシーには`minCount`パラメーターが必要です:

```yaml
policy:
  gang:
    # グループが受け入れられるために、
    # 同時にスケジュール可能である必要があるPodの数
    minCount: 4
```

## {{% heading "whatsnext" %}}

* [gangスケジューリング](/docs/concepts/scheduling-eviction/gang-scheduling/)アルゴリズムについて読む。
