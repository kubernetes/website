---
title: リース
content_type: concept
weight: 30
---

<!-- overview -->

しばしば分散システムでは共有リソースをロックしたりノード間の活動を調整する機構として"リース"が必要になります。
Kubernetesでは、"リース"のコンセプトは`coordination.k8s.io`APIグループの`Lease`オブジェクトに表されていて、ノードのハートビートやコンポーネントレベルのリーダー選出といったシステムにとって重要な機能に利用されています。

<!-- body -->

## ノードハートビート

Kubernetesでは、kubeletのノードハートビートをKubernetes APIサーバーに送信するのにLease APIが使われています。
各`Node`ごとに、`kube-node-lease`名前空間にノードとマッチする名前の`Lease`オブジェクトが存在します。
内部的には、kubeletのハートビートはこの`Lease`オブジェクトに対するUPDATEリクエストであり、Leaseの`spec.renewTime`フィールドを更新しています。
Kubernetesのコントロールプレーンはこのフィールドのタイムスタンプを見て、`Node`が利用可能かを判断しています。

詳しくは[Node Leaseオブジェクト](/ja/docs/concepts/architecture/nodes/#node-heartbeats)をご覧ください。

## リーダー選出

Kubernetesでは、あるコンポーネントのインスタンスが常に一つだけ実行されていることを保証するためにもリースが利用されています。
これは`kube-controller-manager`や`kube-scheduler`といったコントロールプレーンのコンポーネントで、一つのインスタンスのみがアクティブに実行され、その他のインスタンスをスタンバイ状態とする必要があるような冗長構成を組むために利用されています。

## APIサーバーのアイデンティティー

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

Kubernetes v1.26から、各`kube-apiserver`はLease APIを利用して自身のアイデンティティーをその他のシステムに向けて公開するようになりました。
それ自体は特に有用ではありませんが、何台の`kube-apiserver`がKubernetesコントロールプレーンを稼働させているのかをクライアントが知るためのメカニズムを提供します。
kube-apiserverリースが存在することで、各kube-apiserver間の調整が必要となる可能性がある将来の機能が使えるようになります。

`kube-system`名前空間の`kube-apiserver-<sha256-hash>`という名前のリースオブジェクトを確認することで、各kube-apiserverが所有しているLeaseを確認することができます。
また、`k8s.io/component=kube-apiserver`ラベルセレクターを利用することもできます。

```shell
$ kubectl -n kube-system get lease -l k8s.io/component=kube-apiserver
NAME                                        HOLDER                                                                           AGE
kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a   kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a_9cbf54e5-1136-44bd-8f9a-1dcd15c346b4   5m33s
kube-apiserver-dz2dqprdpsgnm756t5rnov7yka   kube-apiserver-dz2dqprdpsgnm756t5rnov7yka_84f2a85d-37c1-4b14-b6b9-603e62e4896f   4m23s
kube-apiserver-fyloo45sdenffw2ugwaz3likua   kube-apiserver-fyloo45sdenffw2ugwaz3likua_c5ffa286-8a9a-45d4-91e7-61118ed58d2e   4m43s
```

リースの名前に使われているSHA256ハッシュはkube-apiserverのOSホスト名に基づいています。各kube-apiserverはクラスター内で一意なホスト名を使用するように構成する必要があります。 
同じホスト名を利用する新しいkube-apiserverインスタンスは、新しいリースオブジェクトを作成せずに、既存のLeaseを新しいインスタンスのアイデンティティーを利用して引き継ぎます。

kube-apiserverが使用するホスト名は`kubernetes.io/hostname`ラベルの値で確認できます。

```shell
$ kubectl -n kube-system get lease kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a -o yaml
```

```yaml
apiVersion: coordination.k8s.io/v1
kind: Lease
metadata:
  creationTimestamp: "2022-11-30T15:37:15Z"
  labels:
    k8s.io/component: kube-apiserver
    kubernetes.io/hostname: kind-control-plane
  name: kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a
  namespace: kube-system
  resourceVersion: "18171"
  uid: d6c68901-4ec5-4385-b1ef-2d783738da6c
spec:
  holderIdentity: kube-apiserver-c4vwjftbvpc5os2vvzle4qg27a_9cbf54e5-1136-44bd-8f9a-1dcd15c346b4
  leaseDurationSeconds: 3600
  renewTime: "2022-11-30T18:04:27.912073Z"
```

すでに存在しなくなったkube-apiserverの期限切れリースは、1時間後に新しいkube-apiserverによってガベージコレクションされます。
