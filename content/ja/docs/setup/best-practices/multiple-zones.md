---
title: 複数のゾーンで動かす
weight: 10
content_type: concept
---

<!-- overview -->

This page describes how to run a cluster in multiple zones.



<!-- body -->

## 始めに

Kubernetes 1.2より、複数のゾーンにおいて単一のクラスターを運用するサポートが追加されました(GCEでは単純に"ゾーン"，AWSは"アベイラビリティゾーン"と呼びますが、ここでは"ゾーン"とします)。
これは、より範囲の広いCluster Federationの軽量バージョンです(以前は["Ubernetes"](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/multicluster/federation.md)の愛称で言及されていました)。
完全なCluster Federationでは、異なるリージョンやクラウドプロバイダー(あるいはオンプレミスデータセンター)内の独立したKubernetesクラスターをまとめることが可能になります。しかしながら、多くのユーザーは単に1つのクラウドプロバイダーの複数のゾーンでより可用性の高いKubernetesクラスターを運用したいと考えており、バージョン1.2におけるマルチゾーンサポート(以前は"Ubernetes Lite"の愛称で使用されていました)ではこれが可能になります。

マルチゾーンサポートは故意に限定されています: 1つのKubernetesクラスターは複数のゾーンで運用することができますが、同じリージョン(あるいはクラウドプロバイダー)のみです。現在はGCEとAWSのみが自動的にサポートされています(他のクラウドプロバイダーやベアメタル環境においても、単にノードやボリュームに追加する適切なラベルを用意して同様のサポートを追加することは容易ではありますが)。


## 機能性

ノードが開始された時、kubeletは自動的にそれらにゾーン情報を付したラベルを追加します。

Kubernetesはレプリケーションコントローラーやサービス内のPodをシングルゾーンクラスターにおけるノードにデプロイします(障害の影響を減らすため)。マルチゾーンクラスターでは、このデプロイの挙動はゾーンを跨いで拡張されます(障害の影響を減らすため)(これは`SelectorSpreadPriority`によって可能になります)。これはベストエフォートな配置であり、つまりもしクラスターのゾーンが異種である(例:異なる数のノード，異なるタイプのノードや異なるPodのリソース要件)場合、これはゾーンを跨いだPodのデプロイを完璧に防ぐことができます。必要であれば、同種のゾーン(同一の数及びタイプのノード)を利用して不平等なデプロイの可能性を減らすことができます。

永続ボリュームが作成されると、`PersistentVolumeLabel`アドミッションコントローラーがそれらにゾーンラベルを付与します。スケジューラーは`VolumeZonePredicate`を通じて与えられたボリュームを請求するPodがそのボリュームと同じゾーンにのみ配置されることを保証します、これはボリュームはゾーンを跨いでアタッチすることができないためです。

## 制限

マルチゾーンサポートにはいくつか重要な制限があります:

* 異なるゾーンはネットワーク内においてお互いに近接して位置していることが想定されているため、いかなるzone-aware routingも行われません。特に、トラフィックはゾーンを跨いだサービスを通じて行き来するため(サービスをサポートするいくつかのPodがクライアントと同じゾーンに存在していても)、これは追加のレイテンシやコストを生むかもしれません。

* Volume zone-affinityは`PersistentVolume`と共に動作し、例えばPodのスペックにおいてEBSボリュームを直接指定しても動作しません。

* クラスターはクラウドやリージョンを跨げません(この機能はフルフェデレーションサポートが必要です)。

*ノードは複数のゾーンに存在しますが、kube-upは現在デフォルトではシングルマスターノードでビルドします。サービスは高可用性でありゾーンの障害に耐えることができますが、コントロールプレーンは単一のゾーンに配置されます。高可用性コントロールプレーンを必要とするユーザーは[高可用性](/ja/docs/setup/production-environment/tools/kubeadm/high-availability/)の説明を参照してください。

### ボリュームの制限

以下の制限は[topology-aware volume binding](/docs/concepts/storage/storage-classes/#volume-binding-mode)に記載されています。

* 動的なプロビジョニングを使用する際のStatefulSetボリュームゾーンのデプロイは、現在Podのアフィニティあるいはアンチアフィニティと互換性がありません。

* StatefulSetの名前がダッシュ("-")を含む場合、ボリュームゾーンのデプロイはゾーンを跨いだストレージの均一な分配を提供しない可能性があります。

* DeploymentやPodのスペックにおいて複数のPVCを指定すると、StorageClassは特定の1つのゾーンに割り当てる必要があります、あるいはPVは特定のゾーンに静的にプロビジョンされる必要があります。もう一つの解決方法として、StatefulSetを使用すると、レプリカに対する全てのボリュームが同じゾーンにプロビジョンされます。

## 全体の流れ

GCEとAWSの両方にマルチゾーンのクラスターをセットアップし使用する手順について説明します。そのために、フルクラスターを用意し(`MULTIZONE=true`と指定する)、`kube-up`を再び実行して追加のゾーンにノードを追加します(`KUBE_USE_EXISTING_MASTER=true`と指定する)。

### クラスターの立ち上げ

通常と同様にクラスターを作成します、しかし複数のゾーンを管理するためにMULTIZONEをクラスターに設定します。ノードをus-central1-aに作成します。

GCE:

```shell
curl -sS https://get.k8s.io | MULTIZONE=true KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-a NUM_NODES=3 bash
```

AWS:

```shell
curl -sS https://get.k8s.io | MULTIZONE=true KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2a NUM_NODES=3 bash
```

このステップは通常と同様にクラスターを立ち上げ、1つのゾーンで動作しています(しかし、`MULTIZONE=true`によりマルチゾーン能力は有効になっています)。


### ノードはラベルが付与される

ノードを見てください。それらがゾーン情報と共にラベルされているのが分かります。
それら全ては今のところ`us-central1-a` (GCE)あるいは`us-west-2a` (AWS)にあります。ラベルは`topology.kubernetes.io/region`がリージョンに、`topology.kubernetes.io/zone`はゾーンに付けられています:


```shell
kubectl get nodes --show-labels
```

結果は以下のようになります:

```shell
NAME                     STATUS                     ROLES    AGE   VERSION          LABELS
kubernetes-master        Ready,SchedulingDisabled   <none>   6m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-1,topology.kubernetes.io/region=us-central1,topology.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-master
kubernetes-minion-87j9   Ready                      <none>   6m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,topology.kubernetes.io/region=us-central1,topology.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-87j9
kubernetes-minion-9vlv   Ready                      <none>   6m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,topology.kubernetes.io/region=us-central1,topology.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-a12q   Ready                      <none>   6m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,topology.kubernetes.io/region=us-central1,topology.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-a12q
```

### 2つ目のゾーンにさらにノードを追加

それでは、現存のマスターを再利用し、現存のクラスターの異なるゾーン(us-central1-bかus-west-2b)にもう1つのノードのセットを追加しましょう。
kube-upを再び実行します．しかし`KUBE_USE_EXISTING_MASTER=true`を指定することでkube-upは新しいマスターを作成せず、代わりに以前作成したものを再利用します。

GCE:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-b NUM_NODES=3 kubernetes/cluster/kube-up.sh
```


AWSではマスターの内部IPアドレスに加えて追加のサブネット用のネットワークCIDRを指定する必要があります:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2b NUM_NODES=3 KUBE_SUBNET_CIDR=172.20.1.0/24 MASTER_INTERNAL_IP=172.20.0.9 kubernetes/cluster/kube-up.sh
```


ノードをもう1度見てください。更なる3つのノードがus-central1-bに起動し、タグ付けられているはずです:

```shell
kubectl get nodes --show-labels
```

結果は以下のようになります:

```shell
NAME                     STATUS                     ROLES    AGE   VERSION           LABELS
kubernetes-master        Ready,SchedulingDisabled   <none>   16m   v1.13.0           beta.kubernetes.io/instance-type=n1-standard-1,topology.kubernetes.io/region=us-central1,topology.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-master
kubernetes-minion-281d   Ready                      <none>   2m    v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,topology.kubernetes.io/region=us-central1,topology.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-281d
kubernetes-minion-87j9   Ready                      <none>   16m   v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,topology.kubernetes.io/region=us-central1,topology.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-87j9
kubernetes-minion-9vlv   Ready                      <none>   16m   v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,topology.kubernetes.io/region=us-central1,topology.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-a12q   Ready                      <none>   17m   v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,topology.kubernetes.io/region=us-central1,topology.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-a12q
kubernetes-minion-pp2f   Ready                      <none>   2m    v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,topology.kubernetes.io/region=us-central1,topology.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-pp2f
kubernetes-minion-wf8i   Ready                      <none>   2m    v1.13.0           beta.kubernetes.io/instance-type=n1-standard-2,topology.kubernetes.io/region=us-central1,topology.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-wf8i
```

### ボリュームのアフィニティ

動的ボリュームを使用してボリュームを作成します(PersistentVolumeのみがゾーンアフィニティに対してサポートされています):

```bash
kubectl apply -f - <<EOF
{
  "apiVersion": "v1",
  "kind": "PersistentVolumeClaim",
  "metadata": {
    "name": "claim1",
    "annotations": {
        "volume.alpha.kubernetes.io/storage-class": "foo"
    }
  },
  "spec": {
    "accessModes": [
      "ReadWriteOnce"
    ],
    "resources": {
      "requests": {
        "storage": "5Gi"
      }
    }
  }
}
EOF
```

{{< note >}}
バージョン1.3以降のKubernetesは設定したゾーンを跨いでPVクレームを分配します。
バージョン1.2では動的永続ボリュームは常にクラスターのマスターがあるゾーンに作成されます。
(ここではus-central1-a / us-west-2a); このイシューは
([#23330](https://github.com/kubernetes/kubernetes/issues/23330))
にバージョン1.3以降で記載されています。
{{< /note >}}

それでは、KubernetesがPVが作成されたゾーン及びリージョンを自動的にラベルしているか確認しましょう。

```shell
kubectl get pv --show-labels
```

結果は以下のようになります:

```shell
NAME           CAPACITY   ACCESSMODES   RECLAIM POLICY   STATUS    CLAIM            STORAGECLASS    REASON    AGE       LABELS
pv-gce-mj4gm   5Gi        RWO           Retain           Bound     default/claim1   manual                    46s       topology.kubernetes.io/region=us-central1,topology.kubernetes.io/zone=us-central1-a
```

では永続ボリュームクレームを使用するPodを作成します。
GCE PD / AWS EBSボリュームはゾーンを跨いでアタッチできないため、これはこのPodがボリュームと同じゾーンにのみ作成されることを意味します:

```yaml
kubectl apply -f - <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: claim1
EOF
```

一般的にゾーンを跨いだアタッチはクラウドプロバイダーによって許可されていないため、Podは自動的にボリュームと同じゾーンに作成されることに注意してください:

```shell
kubectl describe pod mypod | grep Node
```

```shell
Node:        kubernetes-minion-9vlv/10.240.0.5
```

ノードのラベルをチェックします:

```shell
kubectl get node kubernetes-minion-9vlv --show-labels
```

```shell
NAME                     STATUS    AGE    VERSION          LABELS
kubernetes-minion-9vlv   Ready     22m    v1.6.0+fff5156   beta.kubernetes.io/instance-type=n1-standard-2,topology.kubernetes.io/region=us-central1,topology.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
```

### Podがゾーンをまたがって配置される

レプリケーションコントローラーやサービス内のPodは自動的にゾーンに跨いでデプロイされます。まず、3つ目のゾーンに更なるノードを立ち上げましょう:

GCE:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-f NUM_NODES=3 kubernetes/cluster/kube-up.sh
```

AWS:

```shell
KUBE_USE_EXISTING_MASTER=true MULTIZONE=true KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2c NUM_NODES=3 KUBE_SUBNET_CIDR=172.20.2.0/24 MASTER_INTERNAL_IP=172.20.0.9 kubernetes/cluster/kube-up.sh
```

3つのゾーンにノードがあることを確認します:

```shell
kubectl get nodes --show-labels
```

シンプルなWebアプリケーションを動作する、3つのRCを持つguestbook-goの例を作成します:

```shell
find kubernetes/examples/guestbook-go/ -name '*.json' | xargs -I {} kubectl apply -f {}
```

Podは3つの全てのゾーンにデプロイされているはずです:

```shell
kubectl describe pod -l app=guestbook | grep Node
```

```shell
Node:        kubernetes-minion-9vlv/10.240.0.5
Node:        kubernetes-minion-281d/10.240.0.8
Node:        kubernetes-minion-olsh/10.240.0.11
```

```shell
kubectl get node kubernetes-minion-9vlv kubernetes-minion-281d kubernetes-minion-olsh --show-labels
```

```shell
NAME                     STATUS    ROLES    AGE    VERSION          LABELS
kubernetes-minion-9vlv   Ready     <none>   34m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,topology.kubernetes.io/region=us-central1,topology.kubernetes.io/zone=us-central1-a,kubernetes.io/hostname=kubernetes-minion-9vlv
kubernetes-minion-281d   Ready     <none>   20m    v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,topology.kubernetes.io/region=us-central1,topology.kubernetes.io/zone=us-central1-b,kubernetes.io/hostname=kubernetes-minion-281d
kubernetes-minion-olsh   Ready     <none>   3m     v1.13.0          beta.kubernetes.io/instance-type=n1-standard-2,topology.kubernetes.io/region=us-central1,topology.kubernetes.io/zone=us-central1-f,kubernetes.io/hostname=kubernetes-minion-olsh
```


ロードバランサーはクラスター内の全てのゾーンにデプロイされています; guestbook-goの例は負荷分散サービスのサンプルを含みます:

```shell
kubectl describe service guestbook | grep LoadBalancer.Ingress
```

結果は以下のようになります:

```shell
LoadBalancer Ingress:   130.211.126.21
```

IPの上に設定します:

```shell
export IP=130.211.126.21
```

IPをcurlを通じて探索します:

```shell
curl -s http://${IP}:3000/env | grep HOSTNAME
```

結果は以下のようになります:

```shell
  "HOSTNAME": "guestbook-44sep",
```

再び、複数回探索します:

```shell
(for i in `seq 20`; do curl -s http://${IP}:3000/env | grep HOSTNAME; done)  | sort | uniq
```

結果は以下のようになります:

```shell
  "HOSTNAME": "guestbook-44sep",
  "HOSTNAME": "guestbook-hum5n",
  "HOSTNAME": "guestbook-ppm40",
```

ロードバランサーは、たとえPodが複数のゾーンに存在していても、全てのPodをターゲットします。

### クラスターの停止

終了したら、クリーンアップします:

GCE:

```shell
KUBERNETES_PROVIDER=gce KUBE_USE_EXISTING_MASTER=true KUBE_GCE_ZONE=us-central1-f kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=gce KUBE_USE_EXISTING_MASTER=true KUBE_GCE_ZONE=us-central1-b kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=gce KUBE_GCE_ZONE=us-central1-a kubernetes/cluster/kube-down.sh
```

AWS:

```shell
KUBERNETES_PROVIDER=aws KUBE_USE_EXISTING_MASTER=true KUBE_AWS_ZONE=us-west-2c kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=aws KUBE_USE_EXISTING_MASTER=true KUBE_AWS_ZONE=us-west-2b kubernetes/cluster/kube-down.sh
KUBERNETES_PROVIDER=aws KUBE_AWS_ZONE=us-west-2a kubernetes/cluster/kube-down.sh
```

