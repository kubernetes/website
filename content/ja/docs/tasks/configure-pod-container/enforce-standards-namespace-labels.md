---
title: 名前空間のラベルを使用してPodセキュリティスタンダードを強制する
content_type: task
weight: 250
---

名前空間にラベルを付与することで、[Podセキュリティスタンダード](/docs/concepts/security/pod-security-standards)を強制できます。
[privileged](/docs/concepts/security/pod-security-standards/#privileged)、[baseline](/docs/concepts/security/pod-security-standards/#baseline)、[restricted](/docs/concepts/security/pod-security-standards/#restricted)の3つのポリシーはセキュリティの幅広い範囲をカバーしており、[Podセキュリティ](/docs/concepts/security/pod-security-admission/){{< glossary_tooltip text="アドミッションコントローラー" term_id="admission-controller" >}}によって実装されています。

## {{% heading "prerequisites" %}}

Podセキュリティアドミッションは、Kubernetes v1.23でベータとしてデフォルトで利用可能になりました。
バージョン1.25以降、Podセキュリティアドミッションは正式リリース(GA)されています。

{{% version-check %}}

## 名前空間のラベルを使用して`baseline` Podセキュリティスタンダードを要求する {#requiring-the-baseline-pod-security-standard-with-namespace-labels}

以下のマニフェストは、`my-baseline-namespace`という名前空間を定義します。
この名前空間は:

- `baseline`ポリシーの要件を満たさないPodを _ブロック_ します。
- `restricted`ポリシーの要件を満たさないPodが作成された場合、ユーザー向けの警告を生成し、監査アノテーションを追加します。
- `baseline`および`restricted`ポリシーのバージョンをv{{< skew currentVersion >}}に固定します。

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-baseline-namespace
  labels:
    pod-security.kubernetes.io/enforce: baseline
    pod-security.kubernetes.io/enforce-version: v{{< skew currentVersion >}}

    # 望ましい`enforce`レベルに設定しています。
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/audit-version: v{{< skew currentVersion >}}
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/warn-version: v{{< skew currentVersion >}}
```

## `kubectl label`を使用して既存の名前空間にラベルを付与する {#add-labels-to-existing-namespaces-with-kubectl-label}

{{< note >}}
`enforce`ポリシー(またはバージョン)のラベルが追加または変更されると、アドミッションプラグインは名前空間内の各Podを新しいポリシーに対してテストします。
違反は警告としてユーザーに返されます。
{{< /note >}}

名前空間に対するセキュリティプロファイルの変更を最初に評価する際は、`--dry-run`フラグを使用すると便利です。
Podセキュリティスタンダードのチェックは _dry run_ モードでも実行されるため、実際にポリシーを更新することなく、新しいポリシーが既存のPodにどのように適用されるかを確認できます。

```shell
kubectl label --dry-run=server --overwrite ns --all \
    pod-security.kubernetes.io/enforce=baseline
```

### すべての名前空間に適用する {#applying-to-all-namespaces}

Podセキュリティスタンダードを使い始める場合、最初のステップとしてすべての名前空間に`baseline`のようなより厳格なレベルの監査アノテーションを設定するのが適切です:

```shell
kubectl label --overwrite ns --all \
  pod-security.kubernetes.io/audit=baseline \
  pod-security.kubernetes.io/warn=baseline
```

ここではenforceレベルを設定していないことに注意してください。
これにより、まだ明示的に評価されていない名前空間を区別できます。
enforceレベルが明示的に設定されていない名前空間は、次のコマンドで一覧表示できます:

```shell
kubectl get namespaces --selector='!pod-security.kubernetes.io/enforce'
```

### 単一の名前空間に適用する {#applying-to-a-single-namespace}

特定の名前空間を更新することもできます。
次のコマンドは`my-existing-namespace`に`enforce=restricted`ポリシーを追加し、restrictedポリシーのバージョンをv{{< skew currentVersion >}}に固定します。

```shell
kubectl label --overwrite ns my-existing-namespace \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/enforce-version=v{{< skew currentVersion >}}
```
