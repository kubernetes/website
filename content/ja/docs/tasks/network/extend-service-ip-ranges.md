---
min-kubernetes-server-version: v1.29
title: Service IPの範囲を拡張する
content_type: task
---

<!-- overview -->
{{< feature-state feature_gate_name="MultiCIDRServiceAllocator" >}}

このドキュメントはクラスターに割り当てられている既存のService IPの範囲を拡張する方法を説明します。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

<!-- steps -->

## API

APIサーバーで`MultiCIDRServiceAllocator`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)を有効にし、`networking.k8s.io/v1beta1`APIグループをアクティブにしているKubernetesクラスターは、`kubernetes`という名前の特別なServiceCIDRオブジェクトを作成します。このオブジェクトには、APIサーバーのコマンドライン引数`--service-cluster-ip-range`の値に基づいたIPアドレス範囲が指定されます。

```sh
kubectl get servicecidr
```

```
NAME         CIDRS          AGE
kubernetes   10.96.0.0/28   17d
```

APIサーバーのエンドポイントをPodに公開する`kubernetes`という特別なServiceは、デフォルトのServiceCIDRの範囲の最初のIPアドレスを算出し、そのIPアドレスをCluster IPとして使用します。

```sh
kubectl get service kubernetes
```

```
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   17d
```

この例では、デフォルトのServiceはClusterIPとして10.96.0.1を使用しており、対応するIPAddressオブジェクトがあります。

```sh
kubectl get ipaddress 10.96.0.1
```

```
NAME        PARENTREF
10.96.0.1   services/default/kubernetes
```

ServiceCIDRは{{<glossary_tooltip text="ファイナライザー" term_id="finalizer">}}によって保護されており、ServiceのClusterIPが孤立することを防ぎます。ファイナライザーが削除されるのは、既存の全IPAddressを含む別のサブネットがある場合またはサブネットに属するIPAddressがない場合のみです。

## Serviceに使用できるIPアドレスの個数を拡張する

ユーザーはServiceに使用できるアドレスの個数を増やしたい場合がありますが、従来はServiceの範囲を拡張することは破壊的な操作であり、データ損失につながる可能性もありました。この新しい機能を使用することで、ユーザーは新しいServiceCIDRを追加するだけで使用可能なアドレスを増やすことができます。

### 新しいServiceCIDRを追加する

Service用として10.96.0.0/28の範囲が設定されたクラスターでは、2^(32-28) - 2 = 14個のIPアドレスしか使用できません。`kubernetes.default`Serviceは常に作成されるため、この例では最大13個しかServiceを作れません。

```sh
for i in $(seq 1 13); do kubectl create service clusterip "test-$i" --tcp 80 -o json | jq -r .spec.clusterIP; done
```

```
10.96.0.11
10.96.0.5
10.96.0.12
10.96.0.13
10.96.0.14
10.96.0.2
10.96.0.3
10.96.0.4
10.96.0.6
10.96.0.7
10.96.0.8
10.96.0.9
error: failed to create ClusterIP service: Internal error occurred: failed to allocate a serviceIP: range is full
```

IPアドレス範囲を拡張または追加する新しいServiceCIDRを作成することで、Serviceに使用できるIPアドレスの個数を増やせます。

```sh
cat <EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1beta1
kind: ServiceCIDR
metadata:
  name: newcidr1
spec:
  cidrs:
  - 10.96.0.0/24
EOF
```

```
servicecidr.networking.k8s.io/newcidr1 created
```

これにより、新しいServiceを作成できるようになり、新しい範囲からClusterIPが割り当てられます。

```sh
for i in $(seq 13 16); do kubectl create service clusterip "test-$i" --tcp 80 -o json | jq -r .spec.clusterIP; done
```

```
10.96.0.48
10.96.0.200
10.96.0.121
10.96.0.144
```

### ServiceCIDRの削除

あるServiceCIDRに依存しているIPAddressが存在する場合、そのServiceCIDRは削除できません。

```sh
kubectl delete servicecidr newcidr1
```

```
servicecidr.networking.k8s.io "newcidr1" deleted
```

KubernetesはServiceCIDRのファイナライザーを使ってこの依存関係を追跡します。

```sh
kubectl get servicecidr newcidr1 -o yaml
```

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: ServiceCIDR
metadata:
  creationTimestamp: "2023-10-12T15:11:07Z"
  deletionGracePeriodSeconds: 0
  deletionTimestamp: "2023-10-12T15:12:45Z"
  finalizers:
  - networking.k8s.io/service-cidr-finalizer
  name: newcidr1
  resourceVersion: "1133"
  uid: 5ffd8afe-c78f-4e60-ae76-cec448a8af40
spec:
  cidrs:
  - 10.96.0.0/24
status:
  conditions:
  - lastTransitionTime: "2023-10-12T15:12:45Z"
    message: There are still IPAddresses referencing the ServiceCIDR, please remove
      them or create a new ServiceCIDR
    reason: OrphanIPAddress
    status: "False"
    type: Ready
```

ServiceCIDRの削除を止めているIPAddressを含むServiceを削除すると

```sh
for i in $(seq 13 16); do kubectl delete service "test-$i" ; done
```

```
service "test-13" deleted
service "test-14" deleted
service "test-15" deleted
service "test-16" deleted
```

コントロールプレーンがそれを検知します。そしてコントロールプレーンはファイナライザを削除し、削除が保留されているServiceCIDRが実際に削除されるようにします。

```sh
kubectl get servicecidr newcidr1
```

```
Error from server (NotFound): servicecidrs.networking.k8s.io "newcidr1" not found
```
