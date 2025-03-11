---
title: 複数のスケジューラーを設定する
content_type: task
weight: 20
---

<!-- overview -->

Kubernetesには[こちら](/docs/reference/command-line-tools-reference/kube-scheduler/)で説明されているデフォルトのスケジューラーが付属します。
もしデフォルトのスケジューラーがあなたの要求を満たさない場合、独自にスケジューラーを実装できます。
さらに、デフォルトのスケジューラーと一緒に複数のスケジューラーを同時に実行し、どのPodにどのスケジューラーを使うかKubernetesに指示できます。
具体例を見ながらKubernetesで複数のスケジューラーを実行する方法を学びましょう。

スケジューラーの実装方法の詳細は本ドキュメントの範囲外です。
標準的な例としてKubernetesのソースディレクトリの[pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/master/pkg/scheduler)にあるkube-schedulerの実装が参照できます。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## スケジューラーをパッケージ化する

スケジューラーのバイナリをコンテナイメージとしてパッケージ化します。
例として、デフォルトのスケジューラー(kube-scheduler)を2つ目のスケジューラーとして使用します。
[GitHubからKubernetesのソースコード](https://github.com/kubernetes/kubernetes)をクローンし、ビルドします。

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make
```

kube-schedulerバイナリを含むコンテナイメージを作成します。
そのための`Dockerfile`は次のとおりです:

```docker
FROM busybox
ADD ./_output/local/bin/linux/amd64/kube-scheduler /usr/local/bin/kube-scheduler
```

これを`Dockerfile`として保存し、イメージをビルドしてレジストリにプッシュします。
次の例では[Google Container Registry (GCR)](https://cloud.google.com/container-registry/)を使用します。
詳細はGCRの[ドキュメント](https://cloud.google.com/container-registry/docs/)から確認できます。
代わりに[Docker Hub](https://hub.docker.com/search?q=)を使用することもできます。
Docker Hubの詳細は[ドキュメント](https://docs.docker.com/docker-hub/repos/create/#create-a-repository)から確認できます。

```shell
docker build -t gcr.io/my-gcp-project/my-kube-scheduler:1.0 .     # The image name and the repository
gcloud docker -- push gcr.io/my-gcp-project/my-kube-scheduler:1.0 # used in here is just an example
```

## スケジューラー用のKubernetes Deploymentを定義する

スケジューラーをコンテナイメージとして用意できたら、それ用のPodの設定を作成してクラスター上で動かします。
この例では、直接Podをクラスターに作成する代わりに、[Deployment](/ja/docs/concepts/workloads/controllers/deployment/)を使用します。
[Deployment](/ja/docs/concepts/workloads/controllers/deployment/)は[ReplicaSet](/ja/docs/concepts/workloads/controllers/replicaset/)を管理し、そのReplicaSetがPodを管理することで、スケジューラーを障害に対して堅牢にします。
`my-scheduler.yaml`として保存するDeploymentの設定を示します:

{{% code_sample file="admin/sched/my-scheduler.yaml" %}}

上に示したマニフェストでは、[KubeSchedulerConfiguration](/ja/docs/reference/scheduling/config/)を使用してあなたのスケジューラー実装の振る舞いを変更できます。
この設定ファイルは`kube-scheduler`の初期化時に`--config`オプションから渡されます。
この設定ファイルは`my-scheduler-config` ConfigMapに格納されており、`my-scheduler` DeploymentのPodは`my-scheduler-config` ConfigMapをボリュームとしてマウントします。

前述のスケジューラー設定において、あなたのスケジューラー実装は[KubeSchedulerProfile](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile)を使って表現されます。
{{< note >}}
特定のPodをどのスケジューラーが処理するかを指定するには、PodTemplateやPodのマニフェストにある`spec.schedulerName`フィールドを`KubeSchedulerProfile`の`schedulerName`フィールドに一致させます。
クラスターで動作させるすべてのスケジューラーの名前は一意的である必要があります。
{{< /note >}}

また、専用のサービスアカウント`my-scheduler`を作成して`system:kube-scheduler` ClusterRoleに紐づけを行い、スケジューラーに`kube-scheduler`と同じ権限を付与している点に注意します。

その他のコマンドライン引数の詳細は[kube-schedulerのドキュメント](/docs/reference/command-line-tools-reference/kube-scheduler/)から、その他の変更可能な`kube-scheduler`の設定は[スケジューラー設定のリファレンス](/docs/reference/config-api/kube-scheduler-config.v1/)から確認できます。

## クラスターで2つ目のスケジューラーを実行する

2つ目のスケジューラーをクラスター上で動かすには、前述のDeploymentをKubernetesクラスターに作成します:

```shell
kubectl create -f my-scheduler.yaml
```

スケジューラーのPodが実行中であることを確認します:

```shell
kubectl get pods --namespace=kube-system
```

```
NAME                                           READY     STATUS    RESTARTS   AGE
....
my-scheduler-lnf4s-4744f                       1/1       Running   0          2m
...
```

このリストにはデフォルトのkube-schedulerのPodに加えて、my-schedulerのPodが「Running」になっているはずです。

### リーダー選出を有効にする

リーダー選出を有効にして複数のスケジューラーを実行するには、次の対応が必要です:

YAMLファイルにある`my-scheduler-config` ConfigMap内の`KubeSchedulerConfiguration`の次のフィールドを更新します:

* `leaderElection.leaderElect`を`true`に設定します
* `leaderElection.resourceNamespace`を`<lock-object-namespace>`に設定します
* `leaderElection.resourceName`を`<lock-object-name>`に設定します

{{< note >}}
ロックオブジェクトはコントロールプレーンが自動的に作成しますが、使用するNamespaceはあらかじめ存在している必要があります。
`kube-system` Namespaceを使うこともできます。
{{< /note >}}

クラスターでRBACが有効になっている場合、`system:kube-scheduler` ClusterRoleを更新し、`endpoints`と`leases`リソースに適用されるルールのresourceNamesにスケジューラー名を追加します。
例を示します:

```shell
kubectl edit clusterrole system:kube-scheduler
```

{{% code_sample file="admin/sched/clusterrole.yaml" %}}

## Podにスケジューラーを指定する

2つ目のスケジューラーが動作している状態で、Podをいくつか作成し、デフォルトのスケジューラーまたは新しいスケジューラーのどちらで配置するか指定します。
あるPodを特定のスケジューラーで配置するには、Podのspecにスケジューラー名を指定します。
3つの例を確認しましょう。

- スケジューラー名を指定しないPodの設定

  {{% code_sample file="admin/sched/pod1.yaml" %}}

  スケジューラー名が指定されていない場合、Podは自動的にdefault-schedulerによって配置されます。

  このファイルを`pod1.yaml`として保存し、Kubernetesクラスターに投入します。

  ```shell
  kubectl create -f pod1.yaml
  ```

- `default-scheduler`を指定するPodの設定

  {{% code_sample file="admin/sched/pod2.yaml" %}}

  使用するスケジューラーは`spec.schedulerName`の値にスケジューラー名を与えることで指定します。
  この場合、デフォルトのスケジューラーである`default-scheduler`を指定します。

  このファイルを`pod2.yaml`として保存し、Kubernetesクラスターに投入します。

  ```shell
  kubectl create -f pod2.yaml
  ```

- `my-scheduler`を指定するPodの設定

  {{% code_sample file="admin/sched/pod3.yaml" %}}

  この場合、前述の手順でデプロイした`my-scheduler`を使用してPodを配置することを指定します。
  `spec.schedulerName`の値は`KubeSchedulerProfile`の`schedulerName`フィールドに設定した名前と一致する必要があります。

  このファイルを`pod3.yaml`として保存し、クラスターに投入します。

  ```shell
  kubectl create -f pod3.yaml
  ```

  3つのPodがすべて実行中であることを確認します。

  ```shell
  kubectl get pods
  ```

<!-- discussion -->

### Podが目的のスケジューラーによって配置されたことを確認する

わかりやすさのため、前述の例ではPodが実際に指定したスケジューラーによって配置されたことを確認していません。
確認したい場合はPodとDeploymentの設定の適用順序を変えてみてください。
もしPodの設定をすべて先に適用し、その後にスケジューラーのDeploymentを適用した場合、`annotation-second-scheduler` Podは「Pending」のままになり、他の2つのPodが先に配置されることを確認できます。
その後にスケジューラーのDeploymentを適用して新しいスケジューラーが動作すると、`annotation-second-scheduler` Podも配置されます。

あるいは、イベントログの「Scheduled」の項目を見ることで、どのPodがどのスケジューラーによって配置されたかを確認できます。

```shell
kubectl get events
```

クラスターのメインのスケジューラーについては、[独自のスケジューラー設定](/ja/docs/reference/scheduling/config/#multiple-profiles)を適用することや、関連するコントロールプレーンノードにある静的Podのマニフェストを変更し独自のコンテナイメージを使うことができます。
