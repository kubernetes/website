---
title: 名前空間を使用してクラスターを共有する
content_type: task
weight: 340
---

<!-- overview -->
このページでは、{{< glossary_tooltip text="名前空間" term_id="namespace" >}}の確認、操作、削除の方法を説明します。
また、Kubernetesの名前空間を使用してクラスターを分割する方法についても説明します。

## {{% heading "prerequisites" %}}

* [既存のKubernetesクラスター](/docs/setup/)を用意していること。
* Kubernetesの{{< glossary_tooltip text="Pod" term_id="pod" >}}、{{< glossary_tooltip text="Service" term_id="service" >}}、{{< glossary_tooltip text="Deployment" term_id="deployment" >}}について基本的な理解があること。

<!-- steps -->

## 名前空間の確認　{#viewing-namespaces}

次のコマンドを使用して、クラスター内の現在の名前空間の一覧を表示します。

```shell
kubectl get namespaces
```
```console
NAME              STATUS   AGE
default           Active   11d
kube-node-lease   Active   11d
kube-public       Active   11d
kube-system       Active   11d
```

Kubernetesは初期状態で以下の4つの名前空間を持ちます。

* `default` 他に名前空間が指定されていないオブジェクトに対するデフォルトの名前空間です。
* `kube-node-lease` 各ノードに関連付けられた[リース](/docs/concepts/architecture/leases/)オブジェクトを保持する名前空間です。
  ノードのリースにより、kubeletは[ハートビート](/docs/concepts/architecture/nodes/#heartbeats)を送信でき、これによってコントロールプレーンはノードの障害を検知できます。
* `kube-public` この名前空間は自動的に作成され、すべてのユーザー(認証されていないユーザーを含む)が読み取り可能です。
  この名前空間は、クラスター全体で一部のリソースを公開・参照可能にする必要がある場合に備えて、主にクラスター用途として予約されています。
  この名前空間が公開されているのは慣習的なものであり、必須ではありません。
* `kube-system` Kubernetesシステムによって作成されるオブジェクト用の名前空間です。

次のコマンドを使用して、特定の名前空間の概要を取得することもできます。

```shell
kubectl get namespaces <name>
```

また、次のコマンドを使用して、詳細な情報を取得することもできます。

```shell
kubectl describe namespaces <name>
```
```console
Name:           default
Labels:         <none>
Annotations:    <none>
Status:         Active

No resource quota.

Resource Limits
 Type       Resource    Min Max Default
 ----               --------    --- --- ---
 Container          cpu         -   -   100m
```

これらの詳細には、リソースクォータ(存在する場合)とリソースのLimit Rangeの両方が表示される点に注意してください。

リソースクォータは、名前空間内のリソース使用量の合計を追跡し、クラスター管理者が名前空間で消費可能なリソース使用量に対して*ハード*制限を定義できるようにします。

Limit Rangeは、名前空間内で1つのエンティティが消費可能なリソース量の最小値および最大値の制約を定義します。

詳細については、[Admission control: 制限範囲](https://git.k8s.io/design-proposals-archive/resource-management/admission_control_limit_range.md)を参照してください。

名前空間は、次の2つのフェーズのいずれかの状態です。

* `Active` 名前空間が使用中の状態です。
* `Terminating` 名前空間が削除中の状態であり、新しいオブジェクトを作成できません。

詳細については、APIリファレンスの[名前空間](/docs/reference/kubernetes-api/cluster-resources/namespace-v1/)を参照してください。

## 新しい名前空間の作成 {#creating-a-new-namespace}

{{< note >}}
`kube-`という接頭辞を持つ名前空間の作成は、Kubernetesシステム用の名前空間として予約されているため避けてください。
{{< /note >}}

次の内容で`my-namespace.yaml`という新しいYAMLファイルを作成します。

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: <insert-namespace-name-here>
```

次に、以下を実行します。

```shell
kubectl create -f ./my-namespace.yaml
```

または、次のコマンドを使用して名前空間を作成できます。

```shell
kubectl create namespace <insert-namespace-name-here>
``` 

名前空間の名前は、有効な[DNSラベル](/docs/concepts/overview/working-with-objects/names#dns-label-names)である必要があります。

オプションのフィールド`finalizers`があり、これにより名前空間が削除される際にリソースをパージするオブザーバブルを設定できます。
存在しないfinalizerを指定した場合、名前空間自体は作成されますが、ユーザーが削除しようとすると`Terminating`状態のまま停止する点に注意してください。

`finalizers`に関する詳細は、名前空間の[デザインドキュメント](https://git.k8s.io/design-proposals-archive/architecture/namespaces.md#finalizers)を参照してください。

## 名前空間の削除 {#deleting-a-namespace}

次のコマンドで名前空間を削除します。

```shell
kubectl delete namespaces <insert-some-namespace-name>
```

{{< warning >}}
このコマンドは、その名前空間配下の _すべて_ のリソースを削除します！
{{< /warning >}}

この削除処理は非同期で行われるため、しばらくの間、名前空間は`Terminating`状態として表示されます。

## Kubernetesの名前空間を使用してクラスターを分割する {#subdividing-your-cluster-using-kubernetes-namespaces}

デフォルトでは、Kubernetesのクラスターはプロビジョニングときに、クラスターで使用されるデフォルトのPod、Service、Deploymentを格納するためのdefaultという名前空間を作成します。

新しく作成されたクラスターを前提とすると、次の手順で利用可能な名前空間を確認できます。

```shell
kubectl get namespaces
```
```console
NAME      STATUS    AGE
default   Active    13m
```

### 新しい名前空間の作成 {#create-new-namespaces}

この演習では、作業内容を格納するために、2つの追加のKubernetes名前空間を作成します。

Kubernetesクラスターを開発環境と本番環境の両方で使用しているオーガニゼーションのシナリオを考えてみます。

- 開発チームは、アプリケーションのビルドおよび実行に使用しているPod、Service、Deploymentの一覧を把握できるクラスター内のスペースを運営したいと考えています。
  このスペースでは、リソースは頻繁に作成・削除され、アジャイルな開発を可能にするため、リソースを変更できるユーザーに対する制限は比較的緩やかです。

- 運用チームは、本番環境で稼働するPod、Service、Deploymentの集合に対して、誰が操作できるかを厳密に管理するためのスペースをクラスター内に運営したいと考えています。

このような組織では、Kubernetesクラスターを`development`と`production`という2つの名前空間に分割するという設計パターンを採用できます。
それでは、作業用に2つの新しい名前空間を作成してみましょう。

kubectlを使用して`development`という名前空間を作成します。

```shell
kubectl create -f https://k8s.io/examples/admin/namespace-dev.json
```

続いて、kubectlを使用して`production`という名前空間を作成します。

```shell
kubectl create -f https://k8s.io/examples/admin/namespace-prod.json
```

正しく作成されたことを確認するために、クラスター内のすべての名前空間を一覧表示します。

```shell
kubectl get namespaces --show-labels
```

```console
NAME          STATUS    AGE       LABELS
default       Active    32m       <none>
development   Active    29s       name=development
production    Active    23s       name=production
```

### 各名前空間にPodを作成する {#create-pods-in-each-namespace}

Kubernetesの名前空間は、クラスター内におけるPod、Service、Deploymentのスコープを提供します。
ある名前空間とやり取りするユーザーは、別の名前空間の内容を見ることはできません。
これを確認するために、`development` 名前空間に簡単なDeploymentとPodを作成してみましょう。

```shell
kubectl create deployment snowflake \
  --image=registry.k8s.io/serve_hostname \
  -n=development --replicas=2
```

レプリカ数が2のDeploymentを作成し、ホストネームを返す基本的なコンテナを実行する`snowflake`というPodが起動されています。

```shell
kubectl get deployment -n=development
```
```console
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
snowflake    2/2     2            2           2m
```

```shell
kubectl get pods -l app=snowflake -n=development
```
```console
NAME                         READY     STATUS    RESTARTS   AGE
snowflake-3968820950-9dgr8   1/1       Running   0          2m
snowflake-3968820950-vgc4n   1/1       Running   0          2m
```

これにより、開発者は自由に作業を進めることができ、`production` 名前空間の内容に影響を与える心配はありません。

次に `production` 名前空間に切り替えて、ある名前空間のリソースが他の名前空間からは見えないことを確認します。
`production` 名前空間には何も存在しないはずで、以下のコマンドは何も返さないはずです。

```shell
kubectl get deployment -n=production
kubectl get pods -n=production
```

本番環境では、cattleの運用を想定しているため、いくつかのcattleというPodを作成してみましょう。

```shell
kubectl create deployment cattle --image=registry.k8s.io/serve_hostname -n=production
kubectl scale deployment cattle --replicas=5 -n=production

kubectl get deployment -n=production
```

```console
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
cattle       5/5     5            5           10s
```

```shell
kubectl get pods -l app=cattle -n=production
```
```console
NAME                      READY     STATUS    RESTARTS   AGE
cattle-2263376956-41xy6   1/1       Running   0          34s
cattle-2263376956-kw466   1/1       Running   0          34s
cattle-2263376956-n4v97   1/1       Running   0          34s
cattle-2263376956-p5p3i   1/1       Running   0          34s
cattle-2263376956-sxpth   1/1       Running   0          34s
```

この時点で、ある名前空間に作成されたリソースは、他の名前空間からは見えないことが明確になったはずです。

Kubernetesにおけるポリシー機能のサポートが進化するにつれて、このシナリオを拡張し、名前空間ごとに異なる認可ルールを提供する方法を紹介していく予定です。

<!-- discussion -->

## 名前空間を使用する動機の理解 {#understanding-the-motivation-for-using-namespaces}

1つのKubernetesクラスターは、複数のユーザー、またはユーザーグループ（本ドキュメントでは、以降これらを_ユーザーコミュニティ_と呼びます）の要件を満たせる必要があります。

Kubernetesの_名前空間_は、異なるプロジェクト、チーム、または顧客が1つのKubernetesクラスターを共有できるようにします。

これは、次の機能を提供することで実現されます。

1. [名前](/docs/concepts/overview/working-with-objects/names/)のスコープ
1. クラスターの一部に対して認可およびポリシーを関連付ける仕組み

複数の名前空間を使用することは必須ではありません。

各ユーザーコミュニティは、他のコミュニティから分離された状態で作業できることを望みます。
各ユーザーコミュニティは、次のものを独自に持ちます。

1. リソース（Pod、Service、ReplicationControllerなど）
1. ポリシー（誰がそのコミュニティ内で操作を行えるか行えないか）
1. 制約（そのコミュニティに許可されるクォータなど）

クラスター管理者は、各ユーザーコミュニティごとに名前空間を作成できます。

名前空間は、次のためのユニークなスコープを提供します。

1. 名前付きリソース（基本的な名前の衝突を防ぐため）
1. 信頼されたユーザーへの管理権限の委譲
1. コミュニティごとのリソース消費量を制限する機能

ユースケースは次のとおりです。

1. クラスター管理者として、1つのクラスター上で複数のユーザーコミュニティをサポートしたい
1. クラスター管理者として、クラスターの一部の管理権限を、各コミュニティ内の信頼されたユーザーに委譲したい
1. クラスター管理者として、クラスターを共有する他のコミュニティへの影響を抑えるために、各コミュニティが消費できるリソース量を制限したい
1. クラスター利用者として、他のユーザーコミュニティの活動から分離された上で、自分のコミュニティに関連するリソースのみを操作したい

## 名前空間とDNSの理解 {#understanding-namespaces-and-dns}

[Service](/docs/concepts/services-networking/service/)を作成すると、それに対応する[DNS エントリ](/docs/concepts/services-networking/dns-pod-service/)が作成されます。

このエントリは`<service-name>.<namespace-name>.svc.cluster.local`という形式になっています。
これは、コンテナ内で`<service-name>`を使用した場合、同じ名前空間内にあるServiceに名前解決されることを意味します。
これは、Development、Staging、Productionなど複数の名前空間で同一の設定を使用する際に便利です。
名前空間をまたいでServiceにアクセスしたい場合は、完全修飾ドメイン名(FQDN)を使用する必要があります。

## {{% heading "whatsnext" %}}

* [名前空間の規定値の設定](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference)について詳しく学ぶ。
* [リクエストに対する名前空間の設定](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-for-a-request)について詳しく学ぶ。
* [名前空間の設計](https://git.k8s.io/design-proposals-archive/architecture/namespaces.md)を参照する。