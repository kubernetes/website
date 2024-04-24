---
title: ネットワークポリシーを宣言する
min-kubernetes-server-version: v1.8
content_type: task
weight: 180
---

<!-- overview -->
このドキュメントでは、Pod同士の通信を制御するネットワークポリシーを定義するための、Kubernetesの[NetworkPolicy API](/docs/concepts/services-networking/network-policies/)を使い始める手助けをします。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

ネットワークポリシーをサポートしているネットワークプロバイダーが設定済みであることを確認してください。さまざまなネットワークプロバイダーがNetworkPolicyをサポートしています。次に挙げるのは一例です。

* [Calico](/docs/tasks/administer-cluster/network-policy-provider/calico-network-policy/)
* [Cilium](/docs/tasks/administer-cluster/network-policy-provider/cilium-network-policy/)
* [Kube-router](/docs/tasks/administer-cluster/network-policy-provider/kube-router-network-policy/)
* [Romana](/docs/tasks/administer-cluster/network-policy-provider/romana-network-policy/)
* [Weave Net](/docs/tasks/administer-cluster/network-policy-provider/weave-network-policy/)

{{< note >}}
上記のリストは製品名のアルファベット順にソートされていて、推奨順や好ましい順にソートされているわけではありません。このページの例は、Kubernetesクラスターでこれらのどのプロバイダーを使用していても有効です。
{{< /note >}}


<!-- steps -->

## `nginx` Deploymentを作成してService経由で公開する

Kubernetesのネットワークポリシーの仕組みを理解するために、まずは`nginx` Deploymentを作成することから始めましょう。

```console
kubectl create deployment nginx --image=nginx
```
```none
deployment.apps/nginx created
```

`nginx`という名前のService経由でDeploymentを公開します。

```console
kubectl expose deployment nginx --port=80
```

```none
service/nginx exposed
```

上記のコマンドを実行すると、nginx Podを持つDeploymentが作成され、そのDeploymentが`nginx`という名前のService経由で公開されます。`nginx`のPodおよびDeploymentは`default`名前空間の中にあります。

```console
kubectl get svc,pod
```

```none
NAME                        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
service/kubernetes          10.100.0.1    <none>        443/TCP    46m
service/nginx               10.100.0.16   <none>        80/TCP     33s

NAME                        READY         STATUS        RESTARTS   AGE
pod/nginx-701339712-e0qfq   1/1           Running       0          35s
```

## もう1つのPodからアクセスしてServiceを検証する

これで、新しい`nginx`サービスに他のPodからアクセスできるようになったはずです。`default`名前空間内の他のPodから`nginx` Serviceにアクセスするために、busyboxコンテナを起動します。

```console
kubectl run busybox --rm -ti --image=busybox -- /bin/sh
```

シェルの中で、次のコマンドを実行します。

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
remote file exists
```

## `nginx` Serviceへのアクセスを制限する

`nginx` Serviceへのアクセスを制限するために、`access: true`というラベルが付いたPodだけがクエリできるようにします。次の内容でNetworkPolicyオブジェクトを作成してください。

{{% codenew file="service/networking/nginx-policy.yaml" %}}

NetworkPolicyオブジェクトの名前は、有効な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)でなければなりません。

{{< note >}}
このNetworkPolicyには、ポリシーを適用するPodのグループを選択するための`podSelector`が含まれています。このポリシーは、ラベル`app=nginx`の付いたPodを選択していることがわかります。このラベルは、`nginx` Deployment内のPodに自動的に追加されたものです。空の`podSelector`は、その名前空間内のすべてのPodを選択します。
{{< /note >}}

## Serviceにポリシーを割り当てる

kubectlを使って、上記の`nginx-policy.yaml`ファイルからNetworkPolicyを作成します。

```console
kubectl apply -f https://k8s.io/examples/service/networking/nginx-policy.yaml
```

```none
networkpolicy.networking.k8s.io/access-nginx created
```

## accessラベルが定義されていない状態でServiceへのアクセスをテストする

`nginx` Serviceに正しいラベルが付いていないPodからアクセスを試してみると、リクエストがタイムアウトします。

```console
kubectl run busybox --rm -ti --image=busybox -- /bin/sh
```

シェルの中で、次のコマンドを実行します。

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
wget: download timed out
```

## accessラベルを定義して再テストする

正しいラベルが付いたPodを作成すると、リクエストが許可されるようになるのがわかります。

```console
kubectl run busybox --rm -ti --labels="access=true" --image=busybox -- /bin/sh
```

シェルの中で、次のコマンドを実行します。

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
remote file exists
```
