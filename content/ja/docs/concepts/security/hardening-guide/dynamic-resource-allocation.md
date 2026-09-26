---
title: "堅牢化ガイド - 動的リソース割り当て"
description: >
  動的リソース割り当て(DRA)の認可とアクセスパターンの堅牢化に関する情報。
content_type: concept
weight: 90
---

<!-- overview -->

動的リソース割り当て(DRA)は、強力なスケジューリング機能とデバイス管理機能を提供します。
DRAのコンポーネントは`ResourceClaim`のステータスを更新するため、クラスター管理者は、明示的かつ最小権限のRBACを用いて、それらの更新に対する認可を設定する必要があります。

{{< feature-state feature_gate_name="DRAResourceClaimGranularStatusAuthorization" >}}

Kubernetes v1.36以降、DRAのステータス更新では合成サブリソース(synthetic subresource)が使用され、場合によってはノードを認識する特別なverbも使用されます。

<!-- body -->

## DRAのステータス更新権限の堅牢化 {#harden-dra-status-update-permissions}

DRAのステータス更新では、`resourceclaims/status`サブリソースに対する`update`権限の付与に加えて、クラスター管理者は、コンポーネントが変更する必要のある具体的なフィールドに応じて、特定の「合成」サブリソースに対する権限を付与する必要があります。
これにより、スケジューラー、カスタムコントローラー、DRAドライバーの間で最小権限の原則が徹底されます。

DRAの認可チェックは、2つの合成サブリソースに分かれています:

- **`resourceclaims/binding`**
  - `status.allocation`と`status.reservedFor`を変更するために必要です。
  - 通常、kube-schedulerやカスタムの割り当てコントローラーに付与されます。
  - 標準の`update`および`patch` verbを使用します。
- **`resourceclaims/driver`**
  - `status.devices`を変更するために必要です。
  - このチェックはドライバーごとに実行され、ドライバーが別のノード上のデバイスや、他のドライバーのデバイスを改ざんすることを防ぎます。
  - より厳密なスコープのために、ノードを認識するverbを使用します。

## ノードを認識するDRAのverb {#node-aware-dra-verbs}

`resourceclaims/driver`への更新を認可する際は、適切で特別なverbプレフィックスを使用してください:

- **`associated-node:<verb>`**(例: `associated-node:update`)
  - ノードローカルなドライバー向けです。
  - APIサーバーは、リクエスト元のドライバーとノードの関連付けを検証します。
- **`arbitrary-node:<verb>`**(例: `arbitrary-node:patch`)
  - 任意のノードからクレームを更新する可能性がある、コントロールプレーンまたは複数ノードにまたがるコントローラー向けです。

## RBACパターンの例 {#example-rbac-patterns}

### スケジューラーと割り当てコントローラーの権限 {#scheduler-and-allocation-controller-permissions}

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: dra-binding-updater
rules:
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/status"]
    verbs: ["get", "patch", "update"]
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/binding"]
    verbs: ["patch", "update"]
```

### ノードローカルなDRAドライバーの権限 {#node-local-dra-driver-permissions}

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: dra-node-driver-status-updater
rules:
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/status"]
    verbs: ["get", "patch", "update"]
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/driver"]
    verbs: ["associated-node:patch", "associated-node:update"]
    resourceNames: ["dra.example.com"]
```

### 複数ノードにまたがるステータスコントローラーの権限 {#multi-node-status-controller-permissions}

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: dra-multinode-status-updater
rules:
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/status"]
    verbs: ["get", "patch", "update"]
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/driver"]
    verbs: ["arbitrary-node:patch", "arbitrary-node:update"]
    resourceNames: ["dra.example.com"]
```

## 関連するクラスター管理者向けタスク {#related-cluster-administrator-task}

稼働中のクラスターにこれらのパターンを適用するには、[クラスターにおける動的リソース割り当ての堅牢化](/docs/tasks/administer-cluster/hardening-dra/)を参照してください。

## {{% heading "whatsnext" %}}

- [認可](/docs/reference/access-authn-authz/authorization/)
- [クラスターでDRAをセットアップする](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)
- [動的リソース割り当て](/docs/concepts/resource-management/dynamic-resource-allocation/)
