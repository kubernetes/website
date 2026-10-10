---
title: "例: Persistent Volumeを使用したWordpressとMySQLをデプロイする"
content_type: tutorial
weight: 20
card:
  name: tutorials
  weight: 40
  title: "ステートフルの例: Persistent Volumeを使用したWordpress"
---

<!-- overview -->
このチュートリアルでは、WordPressのサイトとMySQLデータベースをMinikubeを使ってデプロイする方法を紹介します。2つのアプリケーションとも、データを保存するためにPersistentVolumeとPersistentVolumeClaimを使用します。

[PersistentVolume](/ja/docs/concepts/storage/persistent-volumes/)(PV)とは、管理者が手動でプロビジョニングを行うか、[StorageClass](/docs/concepts/storage/storage-classes)を使ってKubernetesによって動的にプロビジョニングされた、クラスター内のストレージの一部です。[PersistentVolumeClaim](/ja/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)(PVC)は、PVによって満たすことができる、ユーザーによるストレージへのリクエストのことです。PersistentVolumeとPersistentVolumeClaimは、Podのライフサイクルからは独立していて、Podの再起動、Podの再スケジューリング、さらにはPodの削除が行われたとしても、その中のデータは削除されずに残ります。

{{< warning >}}
シングルインスタンスのWordPressとMySQLのPodを使用しているため、ここで行うデプロイは本番のユースケースには適しません。WordPressを本番環境にデプロイするときは、[WordPress Helm Chart](https://github.com/bitnami/charts/tree/master/bitnami/wordpress)を使用することを検討してください。
{{< /warning >}}

{{< note >}}
このチュートリアルで提供されるファイルは、GAとなっているDeployment APIを使用しているため、Kubernetesバージョン1.9以降のためのものになっています。もしこのチュートリアルを古いバージョンのKubernetesで使いたい場合は、APIのバージョンを適切にアップデートするか、このチュートリアルの古いバージョンを参照してください。
{{< /note >}}



## {{% heading "objectives" %}}

* PersistentVolumeClaimとPersistentVolumeを作成する
* 以下を含む`kustomization.yaml`を作成する
  * Secret generator
  * MySQLリソースの設定
  * WordPressリソースの設定
* kustomizationディレクトリを`kubectl apply -k ./`で適用する
* クリーンアップする



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
このページで示された例は、`kubectl` 1.14以降で動作します。

以下の設定ファイルをダウンロードします。

1. [mysql-deployment.yaml](/examples/application/wordpress/mysql-deployment.yaml)

1. [wordpress-deployment.yaml](/examples/application/wordpress/wordpress-deployment.yaml)



<!-- lessoncontent -->

## PersistentVolumeClaimとPersistentVolumeを作成する

MySQLとWordpressはそれぞれ、データを保存するためのPersistentVolumeを必要とします。各PersistentVolumeClaimはデプロイの段階で作成されます。

多くのクラスター環境では、デフォルトのStorageClassがインストールされています。StorageClassがPersistentVolumeClaim中で指定されていなかった場合、クラスターのデフォルトのStorageClassが代わりに使われます。

PersistentVolumeClaimが作成されるとき、StorageClassの設定に基づいてPersistentVolumeが動的にプロビジョニングされます。

{{< warning >}}
ローカルのクラスターでは、デフォルトのStorageClassには`hostPath`プロビジョナーが使われます。`hostPath`ボリュームは開発およびテストにのみ適しています。`hostPath`ボリュームでは、データはPodがスケジュールされたノード上の`/tmp`内に保存されます。そのため、もしPodが死んだり、クラスター上の他のノードにスケジュールされたり、ノードが再起動すると、データは失われます。
{{< /warning >}}

{{< note >}}
`hostPath`プロビジョナーを使用する必要があるクラスターを立ち上げたい場合は、`--enable-hostpath-provisioner`フラグを `controller-manager` コンポーネントで設定する必要があります。
{{< /note >}}

{{< note >}}
Google Kubernetes Engine上で動作するKubernetesクラスターを使っている場合は、[このガイド](https://cloud.google.com/kubernetes-engine/docs/tutorials/persistent-disk?hl=ja)に従ってください。
{{< /note >}}

## kustomization.yamlを作成する

### Secret generatorを追加する

[Secret](/docs/concepts/configuration/secret/)とは、パスワードやキーのような機密性の高いデータ片を保存するためのオブジェクトです。バージョン1.14からは、`kubectl`がkustomizationファイルを使用したKubernetesオブジェクトの管理をサポートしています。`kustomization.yaml`内のgeneratorによってSecretを作成することができます。

以下のコマンドを実行して、`kustomization.yaml`の中にSecret generatorを追加します。`YOUR_PASSWORD`の部分を使いたいパスワードに置換してください。

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: mysql-pass
  literals:
  - password=YOUR_PASSWORD
EOF
```

## MySQLとWordPressのためのリソースの設定を追加する

以下のマニフェストには、シングルインスタンスのMySQLのDeploymentが書かれています。MySQLコンテナはPersistentVolumeを`/var/lib/mysql`にマウントします。`MYSQL_ROOT_PASSWORD`環境変数には、Secretから得られたデータベースのパスワードが設定されます。

{{% codenew file="application/wordpress/mysql-deployment.yaml" %}}

以下のマニフェストには、シングルインスタンスのWordPressのDeploymentが書かれています。WordPressコンテナはPersistentVolumeをウェブサイトのデータファイルのために`/var/www/html`にマウントします。`WORDPRESS_DB_HOST`環境変数に上で定義したMySQLのServiceの名前を設定すると、WordPressはServiceによってデータベースにアクセスします。`WORDPRESS_DB_PASSWORD`環境変数には、kustomizeが生成したSecretから得たデータベースのパスワードが設定されます。


{{% codenew file="application/wordpress/wordpress-deployment.yaml" %}}

1. MySQLのDeploymentの設定ファイルをダウンロードします。

      ```shell
      curl -LO https://k8s.io/examples/application/wordpress/mysql-deployment.yaml
      ```

2. WordPressの設定ファイルをダウンロードします。

      ```shell
      curl -LO https://k8s.io/examples/application/wordpress/wordpress-deployment.yaml
      ```

3. これらを`kustomization.yaml`ファイルに追加します。

```shell
cat <<EOF >>./kustomization.yaml
resources:
  - mysql-deployment.yaml
  - wordpress-deployment.yaml
EOF
```

## 適用と確認

`kustomization.yaml`には、WordPressのサイトとMySQLデータベースのためのすべてのリソースが含まれています。次のコマンドでこのディレクトリを適用できます。

```shell
kubectl apply -k ./
```

これで、すべてのオブジェクトが存在していることを確認できます。

1. 次のコマンドを実行して、Secretが存在していることを確認します。

      ```shell
      kubectl get secrets
      ```

      結果は次のようになるはずです。

      ```shell
      NAME                    TYPE                                  DATA   AGE
      mysql-pass-c57bb4t7mf   Opaque                                1      9s
      ```

1. 次のコマンドを実行して、PersistentVolumeが動的にプロビジョニングされていることを確認します。

      ```shell
      kubectl get pvc
      ```

      {{< note >}}
      PVがプロビジョニングされてバインドされるまでに、最大で数分かかる場合があります。
      {{< /note >}}

      結果は次のようになるはずです。

      ```shell
      NAME             STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS       AGE
      mysql-pv-claim   Bound     pvc-8cbd7b2e-4044-11e9-b2bb-42010a800002   20Gi       RWO            standard           77s
      wp-pv-claim      Bound     pvc-8cd0df54-4044-11e9-b2bb-42010a800002   20Gi       RWO            standard           77s
      ```

3. 次のコマンドを実行して、Podが実行中であることを確認します。

      ```shell
      kubectl get pods
      ```

      {{< note >}}
      PodのStatusが`Running`の状態になる前に、最大で数分かかる場合があります。
      {{< /note >}}

      結果は次のようになるはずです。

      ```
      NAME                               READY     STATUS    RESTARTS   AGE
      wordpress-mysql-1894417608-x5dzt   1/1       Running   0          40s
      ```

4. 次のコマンドを実行して、Serviceが実行中であることを確認します。

      ```shell
      kubectl get services wordpress
      ```

      結果は次のようになるはずです。

      ```
      NAME        TYPE            CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
      wordpress   LoadBalancer    10.0.0.89    <pending>     80:32406/TCP   4m
      ```

      {{< note >}}
      MinikubeではServiceを`NodePort`経由でしか公開できません。EXTERNAL-IPは常にpendingのままになります。
      {{< /note >}}

5. 次のコマンドを実行して、WordPress ServiceのIPアドレスを取得します。

      ```shell
      minikube service wordpress --url
      ```

      結果は次のようになるはずです。

      ```
      http://1.2.3.4:32406
      ```

6. IPアドレスをコピーして、ブラウザーで読み込み、サイトを表示しましょう。

   WordPressによりセットアップされた次のスクリーンショットのようなページが表示されるはずです。

   ![wordpress-init](https://raw.githubusercontent.com/kubernetes/examples/master/mysql-wordpress-pd/WordPress.png)

{{< warning >}}
WordPressのインストールをこのページのまま放置してはいけません。もしほかのユーザーがこのページを見つけた場合、その人はインスタンス上にウェブサイトをセットアップして、悪意のあるコンテンツの配信に利用できてしまいます。<br/><br/>ユーザー名とパスワードを決めてWordPressをインストールするか、このインスタンスを削除してください。
{{< /warning >}}



## {{% heading "cleanup" %}}


1. 次のコマンドを実行して、Secret、Deployment、Service、およびPersistentVolumeClaimを削除します。

      ```shell
      kubectl delete -k ./
      ```



## {{% heading "whatsnext" %}}


* [イントロスペクションとデバッグ](/ja/docs/tasks/debug/debug-application/debug-running-pod/)についてさらに学ぶ
* [Job](/docs/concepts/workloads/controllers/job/)についてさらに学ぶ
* [Portフォワーディング](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)についてさらに学ぶ
* [コンテナへのシェルを取得する](/ja/docs/tasks/debug/debug-application/get-shell-running-container/)方法について学ぶ
