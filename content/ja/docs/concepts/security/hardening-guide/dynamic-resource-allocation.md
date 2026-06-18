---
title: "ハードニングガイド - Dynamic Resource Allocation"
description: >
  Dynamic Resource Allocation (DRA) の認可およびアクセスパターンを強化するための情報。
content_type: concept
weight: 90
---

<!-- overview -->

Dynamic Resource Allocation (DRA) は、強力なスケジューリング機能とデバイス管理機能を提供します。DRA コンポーネントは `ResourceClaim` の status を更新するため、クラスター管理者はこれらの更新に対する認可を、最小権限の原則に基づいた明示的な RBAC によって設定する必要があります。

{{< feature-state feature_gate_name="DRAResourceClaimGranularStatusAuthorization" >}}

Kubernetes v1.36 以降では、DRA の status 更新に合成サブリソース (synthetic subresources) が使用され、一部のケースではノード認識型の専用 verb が使用されます。

<!-- body -->

## DRA の status 更新権限を強化する

DRA の status 更新では、`resourceclaims/status` サブリソースに対する `update` 権限を付与することに加えて、コンポーネントが変更する必要のあるフィールドに応じた特定の「合成」サブリソースに対する権限を付与する必要があります。

これにより、scheduler、カスタムコントローラー、および DRA ドライバー間で最小権限の原則が適用されます。

DRA の認可チェックは、次の 2 つの合成サブリソースに分割されています。

- **`resourceclaims/binding`**
  - `status.allocation` および `status.reservedFor` を変更するために必要です。
  - 通常は kube-scheduler およびカスタム割り当てコントローラーに付与されます。
  - 標準の `update` および `patch` verb を使用します。
- **`resourceclaims/driver`**
  - `status.devices` を変更するために必要です。
  - このチェックはドライバーごとに実行され、異なるノード上のデバイスや他のドライバーが管理するデバイスに対する不正な変更を防ぎます。
  - より厳密なスコープ制御のためにノード認識型 verb を使用します。

## ノード認識型 DRA verb

`resourceclaims/driver` に対する更新を認可する際には、適切な専用 verb プレフィックスを使用します。

- **`associated-node:<verb>`**（例: `associated-node:update`）
  - ノードローカルなドライバー向けです。
  - API サーバーは、要求元ドライバーとノードとの関連付けを検証します。
- **`arbitrary-node:<verb>`**（例: `arbitrary-node:patch`）
  - 任意のノードから Claim を更新する可能性があるコントロールプレーンまたはマルチノードコントローラー向けです。

## RBAC パターンの例

### Scheduler および割り当てコントローラーの権限

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

### ノードローカル DRA ドライバーの権限

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

### マルチノード status コントローラーの権限

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

## 関連するクラスター管理者向けタスク

実行中のクラスターでこれらのパターンを適用する方法については、[クラスターで Dynamic Resource Allocation を強化する](/docs/tasks/administer-cluster/hardening-dra/) を参照してください。

## {{% heading "whatsnext" %}}

- [Authorization](/docs/reference/access-authn-authz/authorization/)
- [クラスターで DRA をセットアップする](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)
- [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
