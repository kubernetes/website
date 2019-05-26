---
title: ネームスペース(名前空間)
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

Kubernetesは、同一の物理クラスター上で複数の仮想クラスターの動作をサポートします。  
この仮想クラスターをネームスペースと呼びます。  

{{% /capture %}}


{{% capture body %}}

## 複数のネームスペースを使う時

ネームスペースは、複数のチーム・プロジェクトにまたがる多くのユーザーがいる環境での使用を目的としています。  
数ユーザーから数十人のユーザーがいるクラスターに対して、あなたはネームスペースを作成したり、考えるべきではありません。  
Kubernetesが提供するネームスペースの機能が必要となった時に、ネームスペースの使用を始めてください。  

ネームスペースは名前空間のスコープを提供します。リソース名は単一のネームスペース内ではユニークである必要がありますが、ネームスペース全体ではその必要はありません。  

ネームスペースは、複数のユーザーの間でクラスターリソースを分割する方法です。(これは[リソースクォータ](/docs/concepts/policy/resource-quotas/)を介して分割します。)  

Kubernetesの将来的なバージョンにおいて、同一のネームスペース内のオブジェクトは、デフォルトで同一のアクセスコントロールポリシーが適用されます。

同じアプリケーションの異なるバージョンなど、少し違うリソースをただ分割するだけに、複数のネームスペースを使う必要はありません。  
同一のネームスペース内でリソースを区別するためには[ラベル](/docs/user-guide/labels)を使用してください。  

## ネームスペースを利用する

ネームスペースの作成と削除方法は[ネームスペースの管理ガイドドキュメント](/docs/admin/namespaces)に記載されています。  

### ネームスペースの表示

ユーザーは、以下の方法で単一クラスター内の現在のネームスペースの一覧を表示できます。  

```shell
kubectl get namespaces
```
```
NAME          STATUS    AGE
default       Active    1d
kube-system   Active    1d
kube-public   Active    1d
```

Kubernetesの起動時には3つの初期ネームスペースが作成されています。

   * `default` 他にネームスペースを持っていないオブジェクトのためのデフォルトネームスペース  
   * `kube-system` Kubernetesシステムによって作成されたオブジェクトのためのネームスペース  
   * `kube-public` このネームスペースは自動的に作成され、全てのユーザーから読み取り可能です。(認証されていないユーザーも含みます。)   
    このネームスペースは、リソースをクラスター全体を通じてパブリックに表示・読み取り可能にするため、ほとんどクラスターによって使用される用途で予約されます。 このネームスペースのパブリックな側面は単なる慣例であり、要件ではありません。

### ネームスペースの設定

一時的な要求のためにネームスペースを設定したい場合、`--namespace`フラグを使用します。  
例:

```shell
kubectl --namespace=<insert-namespace-name-here> run nginx --image=nginx
kubectl --namespace=<insert-namespace-name-here> get pods
```

### ネームスペース設定の永続化

ユーザーはあるコンテキストのその後のコマンドで使うために、コンテキスト内で永続的にネームスペースを保存できます。  

```shell
kubectl config set-context $(kubectl config current-context) --namespace=<insert-namespace-name-here>
# Validate it
kubectl config view | grep namespace:
```

## ネームスペースとDNS

ユーザーが[Service](/docs/user-guide/services)を作成するとき、Serviceは対応する[DNSエントリ](/docs/concepts/services-networking/dns-pod-service/)を作成します。  
このエントリは`<service-name>.<namespace-name>.svc.cluster.local`という形式になり,これはもしあるコンテナがただ`<service-name>`を指定していた場合、ネームスペース内のローカルのServiceに対して名前解決されます。  
これはデベロップメント、ステージング、プロダクションといって複数のネームスペースをまたいで同じ設定を使う時に効果的です。  
もしユーザーがネームスペースをまたいでアクセスしたい時、 完全修飾ドメイン名(FQDN)を指定する必要があります。  

## すべてのオブジェクトはネームスペースに属していない。  

ほとんどのKubernetesリソース(例えば、Pod、Service、ReplicationControllerなど)はいくつかのネームスペースにあります。  
しかしネームスペースのリソースそれ自体は単一のネームスペース内にありません。  
そして[Node](/docs/admin/node)のようなローレベルのリソースと、パーシステントボリュームはどのネームスペースにも属していません。 

どのKubernetesリソースがネームスペースに属しているか、属していないかを見るためには、以下のコマンドで確認できます。  
To see which Kubernetes resources are and aren't in a namespace:

```shell
# ネームスペースに属しているもの
kubectl api-resources --namespaced=true

# ネームスペースに属していないもの
kubectl api-resources --namespaced=false
```

{{% /capture %}}
