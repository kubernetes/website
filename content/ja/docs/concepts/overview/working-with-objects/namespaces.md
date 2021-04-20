---
title: Namespace(名前空間)
content_type: concept
weight: 30
---

<!-- overview -->

Kubernetesは、同一の物理クラスター上で複数の仮想クラスターの動作をサポートします。
この仮想クラスターをNamespaceと呼びます。




<!-- body -->

## 複数のNamespaceを使う時

Namespaceは、複数のチーム・プロジェクトにまたがる多くのユーザーがいる環境での使用を目的としています。
数人から数十人しかユーザーのいないクラスターに対して、あなたはNamespaceを作成したり、考える必要は全くありません。
Kubernetesが提供するNamespaceの機能が必要となった時に、Namespaceの使用を始めてください。

Namespaceは名前空間のスコープを提供します。リソース名は単一のNamespace内ではユニークである必要がありますが、Namespace全体ではその必要はありません。Namespaceは相互にネストすることはできず、各Kubernetesリソースは1つのNamespaceにのみ存在できます。

Namespaceは、複数のユーザーの間でクラスターリソースを分割する方法です。(これは[リソースクォータ](/docs/concepts/policy/resource-quotas/)を介して分割します。)

同じアプリケーションの異なるバージョンなど、少し違うリソースをただ分割するだけに、複数のNamespaceを使う必要はありません。
同一のNamespace内でリソースを区別するためには[ラベル](/ja/docs/concepts/overview/working-with-objects/labels/)を使用してください。

## Namespaceを利用する

Namespaceの作成と削除方法は[Namespaceの管理ガイドドキュメント](/docs/tasks/administer-cluster/namespaces/)に記載されています。

{{< note >}}
　　プレフィックス`kube-`を持つNamespaceは、KubernetesシステムのNamespaceとして予約されているため利用は避けてください。
{{< /note >}}

### Namespaceの表示

ユーザーは、以下の方法で単一クラスター内の現在のNamespaceの一覧を表示できます。

```shell
kubectl get namespace
```
```
NAME              STATUS   AGE
default           Active   1d
kube-node-lease   Active   1d
kube-system       Active   1d
kube-public       Active   1d
```

Kubernetesの起動時には4つの初期Namespaceが作成されています。

   * `default` 他にNamespaceを持っていないオブジェクトのためのデフォルトNamespace
   * `kube-system` Kubernetesシステムによって作成されたオブジェクトのためのNamespace
   * `kube-public` このNamespaceは自動的に作成され、全てのユーザーから読み取り可能です。(認証されていないユーザーも含みます。)
    このNamespaceは、リソースをクラスター全体を通じてパブリックに表示・読み取り可能にするため、ほとんどクラスターによって使用される用途で予約されます。 このNamespaceのパブリックな側面は単なる慣例であり、要件ではありません。
   * `kube-node-lease` クラスターのスケールに応じたノードハートビートのパフォーマンスを向上させる各ノードに関連したLeaseオブジェクトのためのNamespace。

### Namespaceの設定

現在のリクエストのNamespaceを設定するには、`--namespace`フラグを使用します。

例:

```shell
kubectl run nginx --image=nginx --namespace=<insert-namespace-name-here>
kubectl get pods --namespace=<insert-namespace-name-here>
```

### Namespace設定の永続化

ユーザーはあるコンテキストのその後のコマンドで使うために、コンテキスト内で永続的にNamespaceを保存できます。

```shell
kubectl config set-context --current --namespace=<insert-namespace-name-here>
# Validate it
kubectl config view --minify | grep namespace:
```

## NamespaceとDNS

ユーザーが[Service](/ja/docs/concepts/services-networking/service/)を作成するとき、Serviceは対応する[DNSエントリ](/ja/docs/concepts/services-networking/dns-pod-service/)を作成します。
このエントリは`<service-name>.<namespace-name>.svc.cluster.local`という形式になり、これはもしあるコンテナがただ`<service-name>`を指定していた場合、Namespace内のローカルのServiceに対して名前解決されます。
これはデベロップメント、ステージング、プロダクションといった複数のNamespaceをまたいで同じ設定を使う時に効果的です。
もしユーザーがNamespaceをまたいでアクセスしたい時、 完全修飾ドメイン名(FQDN)を指定する必要があります。

## すべてのオブジェクトはNamespaceに属しているとは限らない

ほとんどのKubernetesリソース(例えば、Pod、Service、ReplicationControllerなど)はいくつかのNamespaceにあります。
しかしNamespaceのリソースそれ自体は単一のNamespace内にありません。
そして[Node](/ja/docs/concepts/architecture/nodes/)やPersistentVolumeのような低レベルのリソースはどのNamespaceにも属していません。

どのKubernetesリソースがNamespaceに属しているか、属していないかを見るためには、以下のコマンドで確認できます。

```shell
# Namespaceに属しているもの
kubectl api-resources --namespaced=true

# Namespaceに属していないもの
kubectl api-resources --namespaced=false
```

## {{% heading "whatsnext" %}}
* [新しいNamespaceの作成](/docs/tasks/administer-cluster/namespaces/#creating-a-new-namespace)について学習してください。
* [Namespaceの削除](/docs/tasks/administer-cluster/namespaces/#deleting-a-namespace)について学習してください。

