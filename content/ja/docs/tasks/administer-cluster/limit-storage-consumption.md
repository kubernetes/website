---
title: ストレージの消費を制限する
content_type: task
weight: 240
---

<!-- overview -->

この例では、名前空間内で消費されるストレージの量を制限する方法を示します。

このデモでは、[ResourceQuota](/docs/concepts/policy/resource-quotas/)、[LimitRange](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)、[PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/)を使用します。


## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->
## シナリオ: ストレージの消費を制限する {#scenario-limiting-storage-consumption}

クラスター管理者がユーザーの代わりにクラスターを運用しており、コストを管理するために単一の名前空間が消費できるストレージの量を制御したいと考えています。

管理者は以下を制限したいと考えています:

1. 名前空間内のPersistentVolumeClaimの数
2. 各クレームが要求できるストレージの量
3. 名前空間が持つことのできるストレージの合計量


## ストレージ要求を制限するLimitRange {#limitrange-to-limit-requests-for-storage}

名前空間に`LimitRange`を追加すると、ストレージ要求のサイズに最小値と最大値が適用されます。
ストレージは`PersistentVolumeClaim`を通じて要求されます。
LimitRangeを適用するアドミッションコントローラーは、管理者が設定した値を超えるまたは下回るPVCを拒否します。

この例では、10Giのストレージを要求するPVCは最大値の2Giを超えるため拒否されます。

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: storagelimits
spec:
  limits:
  - type: PersistentVolumeClaim
    max:
      storage: 2Gi
    min:
      storage: 1Gi
```

ストレージの最小要求は、基盤となるストレージプロバイダーが特定の最小値を必要とする場合に使用されます。
例えば、AWS EBSボリュームには1Giの最小要件があります。

## PVCの数と累積ストレージ容量を制限するResourceQuota {#resourcequota-to-limit-pvc-count-and-cumulative-storage-capacity}

管理者は名前空間内のPVCの数と、そのPVCの累積容量を制限することができます。
いずれかの最大値を超える新しいPVCは拒否されます。

この例では、名前空間内の6番目のPVCは最大数の5を超えるため拒否されます。
また、5Giの最大クォータと上記の2Giの最大制限を組み合わせた場合、それぞれ2Giの3つのPVCを持つことはできません。
5Giに制限された名前空間に対して6Giを要求することになるためです。

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: storagequota
spec:
  hard:
    persistentvolumeclaims: "5"
    requests.storage: "5Gi"
```

<!-- discussion -->

## まとめ {#summary}

LimitRangeは要求可能なストレージの上限を設定でき、ResourceQuotaはクレームの数と累積ストレージ容量を通じて名前空間が消費するストレージを効果的に制限できます。
これにより、クラスター管理者はどのプロジェクトも割り当てを超えるリスクなく、クラスターのストレージ予算を計画できます。
