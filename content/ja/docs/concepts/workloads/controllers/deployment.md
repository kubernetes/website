---
title: Deployment
api_metadata:
- apiVersion: "apps/v1"
  kind: "Deployment"
feature:
  title: 自動化されたロールアウトとロールバック
  description: >
    Kubernetesはアプリケーションや設定への変更を段階的に行い、アプリケーションの状態を監視しながら、全てのインスタンスが同時停止しないようにします。
    更新に問題が起きたとき、Kubernetesは変更のロールバックを行います。
    進化を続けるDeploymentのエコシステムを活用してください。
description: >-
  Deploymentは、アプリケーションのワークロード(通常は状態を保持しないもの)を実行するための一連のPodを管理します。
content_type: concept
weight: 10
hide_summary: true # セクションのインデックスに個別に掲載される
---

<!-- overview -->

_Deployment_ は{{< glossary_tooltip text="Pod" term_id="pod" >}}と{{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}の宣言的なアップデート機能を提供します。

Deploymentにおいて _理想的な状態_ を記述すると、Deployment{{< glossary_tooltip text="コントローラー" term_id="controller" >}}は現在の状態を制御しながら理想的な状態に変更していきます。
Deploymentを定義することによって、新しいReplicaSetを作成したり、既存のDeploymentを削除し、その全てのリソースを新しいDeploymentに引き継いだりできます。

{{< note >}}
Deploymentによって所有されているReplicaSetを管理しないでください。
ご自身のユースケースが以下の項目に含まれない場合、メインのKubernetesリポジトリにIssueを作成することを検討してください。
{{< /note >}}

<!-- body -->

## ユースケース {#use-case}

以下の項目はDeploymentの典型的なユースケースです:

* [ReplicaSetをロールアウトするためにDeploymentの作成を行う](#creating-a-deployment)。
  ReplicaSetはバックグラウンドでPodを作成します。
  Podの作成が完了したかどうかは、ロールアウトのステータスを確認してください。
* DeploymentのPodTemplateSpecを更新することにより[Podの新しい状態を宣言する](#updating-a-deployment)。
  新しいReplicaSetが作成され、Deploymentは古いReplicaSetをスケールダウンしながら新しいReplicaSetを段階的にスケールアップすることで、Podを制御しながら置き換えます。
  新しいReplicaSetはそれぞれDeploymentのリビジョンを更新します。
* Deploymentの現在の状態が不安定な場合、[過去のDeploymentのリビジョンにロールバックする](#rolling-back-a-deployment)。
  ロールバックによる各更新作業は、Deploymentのリビジョンを更新します。
* [より多くの負荷をさばけるように、Deploymentをスケールアップする](#scaling-a-deployment)。
* PodTemplateSpecに対する複数の修正を適用するために[Deploymentのロールアウトを一時停止(Pause)し](#pausing-and-resuming-a-deployment)、それを再開して新しいロールアウトを開始する。
* ロールアウトが停止したサインとして、[Deploymentのステータスを利用する](#deployment-status)。
* 今後必要としない[古いReplicaSetのクリーンアップを行う](#clean-up-policy)。

## Deploymentの作成 {#creating-a-deployment}

以下は、Deploymentの例です。
これは`nginx` Podのレプリカを3つ持つReplicaSetを作成します:

{{% code_sample file="controllers/nginx-deployment.yaml" %}}

この例では、

* `.metadata.name`フィールドで示されるとおり、`nginx-deployment`という名前のDeploymentが作成されます。
  この名前は、後で作成されるReplicaSetやPodの名前のもとになります。
  詳しくは[Deployment Specの記述](#writing-a-deployment-spec)を参照してください。
* このDeploymentは`.spec.replicas`フィールドで示されるとおり、3つのレプリカPodを作成するReplicaSetを作成します。
* `.spec.selector`フィールドは、作成されるReplicaSetが管理対象のPodをどのように見つけるかを定義します。
  ここでは、Podテンプレートで定義されたラベル(`app: nginx`)を選択しています。
  ただし、Podテンプレート自体がルールを満たす限り、より高度な選択ルールの指定も可能です。

  {{< note >}}
  `.spec.selector.matchLabels`フィールドは{key,value}ペアのマップです。
  `matchLabels`マップ内の単一の{key,value}は、`key`フィールドの値が"key"、`operator`が"In"、`values`配列には"value"のみを含む`matchExpressions`の要素と等しくなります。
  条件に一致させるためには、`matchLabels`と`matchExpressions`の両方の要件を満たす必要があります。
  {{< /note >}}

* `.spec.template`フィールドは、以下のサブフィールドを持ちます:
  * Podは`.metadata.labels`フィールドによって指定された`app: nginx`というラベルがつけられます。
  * Podテンプレートの仕様、または`.spec`フィールドは、Podが`nginx`という名前で[Docker Hub](https://hub.docker.com/)にある`nginx`のバージョン1.14.2が動くコンテナを1つ動かすことを示します。
  * 1つのコンテナを作成し、`.spec.containers[0].name`フィールドを使って`nginx`という名前をつけます。

作成を始める前に、Kubernetesクラスターが稼働していることを確認してください。
上記のDeploymentを作成するためには以下のステップにしたがってください:

1. 以下のコマンドを実行してDeploymentを作成してください。

   ```shell
   kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
   ```

2. Deploymentが作成されたことを確認するために、`kubectl get deployments`を実行してください。

   Deploymentがまだ作成中の場合、コマンドの実行結果は以下のとおりです。
   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   0/3     0            0           1s
   ```
   クラスターにてDeploymentを調査するとき、以下のフィールドが出力されます。
   * `NAME`は、名前空間内にあるDeploymentの名前一覧です。
   * `READY`は、ユーザーが使用できるアプリケーションのレプリカの数です。
     使用可能な数/理想的な数の形式で表示されます。
   * `UP-TO-DATE`は、理想的な状態を満たすためにアップデートが完了したレプリカの数です。
   * `AVAILABLE`は、ユーザーが利用可能なレプリカの数です。
   * `AGE`は、アプリケーションが稼働してからの時間です。

   `.spec.replicas`フィールドの値によると、理想的なレプリカ数は3であることがわかります。

3. Deploymentのロールアウトステータスを確認するために、`kubectl rollout status deployment/nginx-deployment`を実行してください。

   コマンドの実行結果は以下のとおりです:

   ```
   Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
   deployment "nginx-deployment" successfully rolled out
   ```

4. 数秒後、再度`kubectl get deployments`を実行してください。
   コマンドの実行結果は以下のとおりです:

   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3/3     3            3           18s
   ```

   Deploymentが3つ全てのレプリカを作成して、全てのレプリカが最新(Podが最新のPodテンプレートを含んでいる)になり、利用可能となっていることを確認してください。

5. Deploymentによって作成されたReplicaSet(`rs`)を確認するには`kubectl get rs`を実行してください。
   コマンドの実行結果は以下のとおりです:

   ```
   NAME                          DESIRED   CURRENT   READY   AGE
   nginx-deployment-75675f5897   3         3         3       18s
   ```

   ReplicaSetの出力には次のフィールドが表示されます。

   * `NAME`は、名前空間内にあるReplicaSetの名前の一覧です。
   * `DESIRED`は、アプリケーションの理想的な _レプリカ_ の値です。
     これはDeploymentを作成したときに定義したもので、これが _理想的な状態_ と呼ばれるものです。
   * `CURRENT`は現在実行されているレプリカの数です。
   * `READY`は、ユーザーが使用できるアプリケーションのレプリカの数です。
   * `AGE`は、アプリケーションが稼働してからの時間です。

   ReplicaSetの名前は常に`[Deployment名]-[ハッシュ]`という形式になることに注意してください。
   この名前は、作成されるPodの名前のもとになります。

   この`ハッシュ`の文字列は、ReplicaSetの`pod-template-hash`ラベルと同じです。

6. 各Podに対して自動的に生成されたラベルを確認するには、`kubectl get pods --show-labels`を実行してください。
   コマンドの実行結果は以下のとおりです。
   ```
   NAME                                READY     STATUS    RESTARTS   AGE       LABELS
   nginx-deployment-75675f5897-7ci7o   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   nginx-deployment-75675f5897-kzszj   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   nginx-deployment-75675f5897-qqcnn   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
   ```
   作成されたReplicaSetは`nginx` Podを3つ作成することを保証します。

{{< note >}}
Deploymentに対して適切なセレクターとPodテンプレートのラベルを設定する必要があります(このケースでは`app: nginx`)。

ラベルやセレクターを他のコントローラーと重複させないでください(他のDeploymentやStatefulSetを含む)。
Kubernetesはユーザーがラベルを重複させることを阻止しないため、複数のコントローラーでセレクターの重複が発生すると、コントローラー間で衝突し予期せぬふるまいをすることになります。
{{< /note >}}

### pod-template-hashラベル {#pod-template-hash-label}

{{< caution >}}
このラベルを変更しないでください。
{{< /caution >}}

`pod-template-hash`ラベルはDeploymentコントローラーによってDeploymentが作成し適用した各ReplicaSetに対して追加されます。

このラベルはDeploymentが管理するReplicaSetが重複しないことを保証します。
このラベルはReplicaSetの`PodTemplate`をハッシュ化することにより生成され、生成されたハッシュ値はラベル値としてReplicaSetセレクター、Podテンプレートラベル、ReplicaSetが作成した全てのPodに対して追加されます。

## Deploymentの更新 {#updating-a-deployment}

{{< note >}}
Deploymentのロールアウトは、DeploymentのPodテンプレート(この場合`.spec.template`)が変更された場合にのみトリガーされます。
例えばテンプレートのラベルもしくはコンテナイメージが更新された場合です。
Deploymentのスケールのような更新では、ロールアウトはトリガーされません。
{{< /note >}}

Deploymentを更新するには以下のステップに従ってください:

1. nginxのPodで、`nginx:1.14.2`イメージの代わりに`nginx:1.16.1`を使うように更新します。

   ```shell
   kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.16.1
   ```

   または、次のコマンドを使用します:

   ```shell
   kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
   ```

   ここで、`deployment/nginx-deployment`はDeploymentを示し、`nginx`は更新が行われるコンテナを示し、`nginx:1.16.1`は新しいイメージとそのタグを示します。

   実行結果は以下のとおりです:

   ```
   deployment.apps/nginx-deployment image updated
   ```

   また、Deploymentを`編集`して、`.spec.template.spec.containers[0].image`を`nginx:1.14.2`から`nginx:1.16.1`に変更することもできます。

   ```shell
   kubectl edit deployment/nginx-deployment
   ```

   実行結果は以下のとおりです:

   ```
   deployment.apps/nginx-deployment edited
   ```

2. ロールアウトのステータスを確認するには、以下のコマンドを実行してください:

   ```shell
   kubectl rollout status deployment/nginx-deployment
   ```

   実行結果は以下のとおりです:

   ```
   Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
   ```

   もしくは

   ```
   deployment "nginx-deployment" successfully rolled out
   ```

更新されたDeploymentのさらなる情報を取得するには、以下を確認してください:

* ロールアウトが成功したあと、`kubectl get deployments`を実行してDeploymentを確認できます。
  実行結果は以下のとおりです:

  ```
  NAME               READY   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment   3/3     3            3           36s
  ```

* Deploymentが新しいReplicaSetを作成してPodを更新させたり、新しいReplicaSetのレプリカを3にスケールアップさせたり、古いReplicaSetのレプリカを0にスケールダウンさせるのを確認するには`kubectl get rs`を実行してください。

  ```shell
  kubectl get rs
  ```

  実行結果は以下のとおりです:

  ```
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-1564180365   3         3         3       6s
  nginx-deployment-2035384211   0         0         0       36s
  ```

* `get pods`を実行すると、新しいPodのみ確認できます:

  ```shell
  kubectl get pods
  ```

  実行結果は以下のとおりです:

  ```
  NAME                                READY     STATUS    RESTARTS   AGE
  nginx-deployment-1564180365-khku8   1/1       Running   0          14s
  nginx-deployment-1564180365-nacti   1/1       Running   0          14s
  nginx-deployment-1564180365-z9gth   1/1       Running   0          14s
  ```

  次回これらのPodを更新させたいときは、DeploymentのPodテンプレートを再度更新するだけです。

  Deploymentは、Podが更新されている間に特定の数のPodのみ停止状態になることを保証します。
  デフォルトでは、目標とするPod数の少なくとも75%が稼働状態であることを保証します(25% max unavailable)。

  また、DeploymentはPodが更新されている間に、目標とするPod数を特定の数まで超えてPodを稼働させることを保証します。
  デフォルトでは、目標とするPod数に対して最大でも125%までのPodを稼働させることを保証します(25% max surge)。

  例えば、上記で説明したDeploymentの状態を注意深く見ると、最初に新しいPodが作成され、次に古いPodが削除され、さらにもう1つ新しいPodが作成されるのを確認できます。
  十分な数の新しいPodが稼働するまでは、Deploymentは古いPodを削除しません。
  また十分な数の古いPodが削除されない限り、新しいPodは作成されません。
  少なくとも3つのPodが利用可能であること、そして合計で最大4つのPodが利用可能であることを保証します。
  4つのレプリカを持つDeploymentの場合、Podの数は3つから5つの間になります。

* Deploymentの詳細情報を取得します:

  ```shell
  kubectl describe deployments
  ```

  実行結果は以下のとおりです:

  ```
  Name:                   nginx-deployment
  Namespace:              default
  CreationTimestamp:      Thu, 30 Nov 2017 10:56:25 +0000
  Labels:                 app=nginx
  Annotations:            deployment.kubernetes.io/revision=2
  Selector:               app=nginx
  Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
  StrategyType:           RollingUpdate
  MinReadySeconds:        0
  RollingUpdateStrategy:  25% max unavailable, 25% max surge
  Pod Template:
    Labels:  app=nginx
     Containers:
      nginx:
        Image:        nginx:1.16.1
        Port:         80/TCP
        Environment:  <none>
        Mounts:       <none>
      Volumes:        <none>
    Conditions:
      Type           Status  Reason
      ----           ------  ------
      Available      True    MinimumReplicasAvailable
      Progressing    True    NewReplicaSetAvailable
    OldReplicaSets:  <none>
    NewReplicaSet:   nginx-deployment-1564180365 (3/3 replicas created)
    Events:
      Type    Reason             Age   From                   Message
      ----    ------             ----  ----                   -------
      Normal  ScalingReplicaSet  2m    deployment-controller  Scaled up replica set nginx-deployment-2035384211 to 3
      Normal  ScalingReplicaSet  24s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 1
      Normal  ScalingReplicaSet  22s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 2
      Normal  ScalingReplicaSet  22s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 2
      Normal  ScalingReplicaSet  19s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 1
      Normal  ScalingReplicaSet  19s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 3
      Normal  ScalingReplicaSet  14s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 0
  ```

  ここで、最初にDeploymentを作成したとき、ReplicaSet(nginx-deployment-2035384211)を作成し、それを直接3つのレプリカにスケールアップしたことがわかります。
  Deploymentを更新すると、新しいReplicaSet(nginx-deployment-1564180365)を作成し、それを1つにスケールアップして起動するのを待ちました。
  その後、古いReplicaSetを2つにスケールダウンし、新しいReplicaSetを2つにスケールアップしました。
  これは、常に少なくとも3つのPodが利用可能で、最大でも4つのPodが作成されている状態を保つためです。
  その後も同じローリングアップデート戦略で、新しいReplicaSetのスケールアップと古いReplicaSetのスケールダウンを続けました。
  最終的に、新しいReplicaSetに3つの利用可能なレプリカができ、古いReplicaSetは0にスケールダウンされます。

{{< note >}}
Kubernetesは`availableReplicas`の数を計算する際に、終了中(terminating)のPodをカウントしません。
`availableReplicas`の数は、`replicas - maxUnavailable`から`replicas + maxSurge`の間でなければなりません。
その結果、ロールアウト中に予想よりも多くのPodが存在することに気づくことがあります。
また、終了中のPodの`terminationGracePeriodSeconds`が経過するまで、Deploymentが消費するリソースの合計が`replicas + maxSurge`よりも多くなることがあります。
{{< /note >}}

### ロールオーバー(リアルタイムでの複数のPodの更新) {#rollover-aka-multiple-updates-in-flight}

Deploymentコントローラーは、新しいDeploymentを検知する度に、理想とする数のPodを起動するためのReplicaSetを作成します。
Deploymentが更新されると、既存のReplicaSetが管理するPodのラベルが`.spec.selector`にマッチするが、テンプレートが`.spec.template`にマッチしない場合はスケールダウンされます。
最終的に、新しいReplicaSetは`.spec.replicas`の値にスケールアップされ、古いReplicaSetは0にスケールダウンされます。

Deploymentのロールアウトが進行中にDeploymentを更新すると、Deploymentは更新する毎に新しいReplicaSetを作成してスケールアップさせ、以前にスケールアップしたReplicaSetのロールオーバーを行います。
Deploymentは更新前のReplicaSetを古いReplicaSetのリストに追加し、スケールダウンを開始します。

例えば、5つのレプリカを持つ`nginx:1.14.2`のDeploymentを作成し、`nginx:1.14.2`の3つのレプリカが作成されているときに5つのレプリカを持つ`nginx:1.16.1`に更新します。
このケースではDeploymentは作成済みの`nginx:1.14.2`の3つのPodをすぐに削除し、`nginx:1.16.1`のPodの作成を開始します。
`nginx:1.14.2`の5つのレプリカを全て作成するのを待つことはありません。

### ラベルセレクターの更新 {#label-selector-updates}

一般的に、ラベルセレクターの更新は推奨されておらず、事前にセレクターを計画しておくことが推奨されます。
Deploymentのラベルセレクターは作成後は**不変**であり、`kubectl patch`、`kubectl edit`、`kubectl apply`、または`helm upgrade`のようなツールで更新することはできません。

どうしてもセレクターを変更する必要がある場合は、Deploymentを削除して再作成する必要があります。
デフォルトでは、Deploymentを削除すると稼働中のPodも削除され、ダウンタイムが発生します。
Deploymentを再作成する間もそれらのPodを稼働させ続けたい場合は、`--cascade=orphan`を使用してください(ただし、以下の影響を参照してください)。
十分に注意を払い、以下の影響を確実に理解してください。

* **追加:** より狭いセレクターを持つ新しいDeploymentを作成する場合、その新しいDeploymentには適切なPodテンプレートも**必要です**。
  既存のマニフェストを編集してセレクターを狭める場合は、そのDeployment内のPodテンプレートのメタデータを編集し、一致するように新しいラベルを追加する必要があります。
  そうしないと、APIサーバーはバリデーションエラーを返します。
  これは _重複しない_ 変更です。
  新しいDeploymentは(新しいラベルを持たない)古いPodを「認識」しないため、古いReplicaSetが **孤児(orphaned)** となり、まったく新しいReplicaSetが作成されます。
* **値の更新:** セレクターキーの既存の値を変更する(例えば`v1`から`v2`へ)と、追加の場合と同じ動作(孤児化と再作成)になります。
* **削除:** Deploymentのセレクターから既存のキーを削除する場合、Podテンプレートのラベルを変更する必要はありません。
  これは _重複する_ 変更です。
  新しいより広いセレクターは古いPodに一致します。
  既存のReplicaSetは孤児にならず、新しいReplicaSetも作成されませんが、削除されたラベルは既存のPodとReplicaSetには残り続けることに注意してください。
  これは、Deploymentのロールアウトをトリガーすることでクリーンアップできます。

## Deploymentのロールバック {#rolling-back-a-deployment}

例えば、クラッシュループ状態などのようにDeploymentが不安定な場合においては、Deploymentをロールバックしたくなることがあります。
Deploymentの全てのロールアウト履歴は、いつでもロールバックできるようにデフォルトでシステムに保持されています(リビジョン履歴の上限は設定することで変更可能です)。

{{< note >}}
Deploymentのリビジョンは、Deploymentのロールアウトがトリガーされたときに作成されます。
これは、DeploymentのPodテンプレート(`.spec.template`)が変更されたとき、例えばテンプレートのラベルやコンテナイメージを更新したときにのみ、新しいリビジョンが作成されることを意味します。
Deploymentのスケーリングなど、他の種類の更新ではDeploymentのリビジョンは作成されません。
これは手動もしくはオートスケーリングを同時に行うことができるようにするためです。
これは過去のリビジョンにロールバックするとき、DeploymentのPodテンプレートの箇所のみロールバックされることを意味します。
{{< /note >}}

* `nginx:1.16.1`の代わりに`nginx:1.161`というイメージに更新して、Deploymentの更新中にタイプミスをしたと仮定します:

  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:1.161
  ```

  実行結果は以下のとおりです:

  ```
  deployment.apps/nginx-deployment image updated
  ```

* このロールアウトはうまくいきません。
  ロールアウトのステータスを見るとそれを確認できます:

  ```shell
  kubectl rollout status deployment/nginx-deployment
  ```

  実行結果は以下のとおりです:

  ```
  Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
  ```

* ロールアウトのステータスの確認は、Ctrl-Cを押すことで停止できます。
  ロールアウトがうまくいかないときは、[Deploymentのステータスを読んでください](#deployment-status)。

* 古いレプリカ数(`nginx-deployment-1564180365`と`nginx-deployment-2035384211`のレプリカ数を合計した数)が3であり、新しいレプリカ数(`nginx-deployment-3066724191`のレプリカ数)が1であることを確認できます。

  ```shell
  kubectl get rs
  ```

  実行結果は以下のとおりです:

  ```
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-1564180365   3         3         3       25s
  nginx-deployment-2035384211   0         0         0       36s
  nginx-deployment-3066724191   1         1         0       6s
  ```

* 作成されたPodを確認していると、新しいReplicaSetによって作成された1つのPodはコンテナイメージ取得に失敗し続けているのがわかります。

  ```shell
  kubectl get pods
  ```

  実行結果は以下のとおりです:

  ```
  NAME                                READY     STATUS             RESTARTS   AGE
  nginx-deployment-1564180365-70iae   1/1       Running            0          25s
  nginx-deployment-1564180365-jbqqo   1/1       Running            0          25s
  nginx-deployment-1564180365-hysrc   1/1       Running            0          25s
  nginx-deployment-3066724191-08mng   0/1       ImagePullBackOff   0          6s
  ```

  {{< note >}}
  Deploymentコントローラーは、この悪い状態のロールアウトを自動的に停止し、新しいReplicaSetのスケールアップを止めます。
  これはユーザーが指定したrollingUpdateのパラメーター(特に`maxUnavailable`)に依存します。
  デフォルトではKubernetesがこの値を25%に設定します。
  {{< /note >}}

* Deploymentの詳細情報を取得します:

  ```shell
  kubectl describe deployment
  ```

  実行結果は以下のとおりです:

  ```
  Name:           nginx-deployment
  Namespace:      default
  CreationTimestamp:  Tue, 15 Mar 2016 14:48:04 -0700
  Labels:         app=nginx
  Selector:       app=nginx
  Replicas:       3 desired | 1 updated | 4 total | 3 available | 1 unavailable
  StrategyType:       RollingUpdate
  MinReadySeconds:    0
  RollingUpdateStrategy:  25% max unavailable, 25% max surge
  Pod Template:
    Labels:  app=nginx
    Containers:
     nginx:
      Image:        nginx:1.161
      Port:         80/TCP
      Host Port:    0/TCP
      Environment:  <none>
      Mounts:       <none>
    Volumes:        <none>
  Conditions:
    Type           Status  Reason
    ----           ------  ------
    Available      True    MinimumReplicasAvailable
    Progressing    True    ReplicaSetUpdated
  OldReplicaSets:     nginx-deployment-1564180365 (3/3 replicas created)
  NewReplicaSet:      nginx-deployment-3066724191 (1/1 replicas created)
  Events:
    FirstSeen LastSeen    Count   From                    SubObjectPath   Type        Reason              Message
    --------- --------    -----   ----                    -------------   --------    ------              -------
    1m        1m          1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-2035384211 to 3
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 1
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 2
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 2
    21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 1
    21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 3
    13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 0
    13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-3066724191 to 1
  ```

  これを修正するために、Deploymentを安定した状態の過去のリビジョンにロールバックする必要があります。

### Deploymentのロールアウト履歴の確認 {#checking-rollout-history-of-a-deployment}

ロールアウトの履歴を確認するには、以下の手順に従ってください:

1. 最初に、Deploymentのリビジョンを確認します:

   ```shell
   kubectl rollout history deployment/nginx-deployment
   ```

   実行結果は以下のとおりです:

   ```
   deployments "nginx-deployment"
   REVISION    CHANGE-CAUSE
   1           <none>
   2           <none>
   3           <none>
   ```

   `CHANGE-CAUSE`は、リビジョンの作成時にDeploymentのアノテーション`kubernetes.io/change-cause`からリビジョンにコピーされます。
   以下の方法で`CHANGE-CAUSE`メッセージを指定できます。

   * `kubectl annotate deployment/nginx-deployment kubernetes.io/change-cause="image updated to 1.16.1"`を実行してDeploymentにアノテーションを付与する。
   * リソースのマニフェストを手動で編集する。
   * アノテーションを自動的に設定するツールを使用する。

   {{< note >}}
   古いバージョンのKubernetesでは、kubectlコマンドで`--record`フラグを使用して`CHANGE-CAUSE`フィールドを自動的に設定できました。
   このフラグは非推奨であり、将来のリリースで削除される予定です。
   {{< /note >}}

2. 各リビジョンの詳細を確認するためには以下のコマンドを実行してください:

   ```shell
   kubectl rollout history deployment/nginx-deployment --revision=2
   ```

   実行結果は以下のとおりです:

   ```
   deployments "nginx-deployment" revision 2
     Labels:       app=nginx
             pod-template-hash=1159050644
     Containers:
      nginx:
       Image:      nginx:1.16.1
       Port:       80/TCP
        QoS Tier:
           cpu:      BestEffort
           memory:   BestEffort
       Environment Variables:      <none>
     No volumes.
   ```

### 過去のリビジョンにロールバックする {#rolling-back-to-a-previous-revision}

現在のリビジョンから過去のリビジョン(リビジョン番号2)にロールバックさせるには、以下の手順に従ってください:

1. 現在のロールアウトを取り消して、過去のリビジョンにロールバックすることに決めたとします:

   ```shell
   kubectl rollout undo deployment/nginx-deployment
   ```

   実行結果は以下のとおりです:

   ```
   deployment.apps/nginx-deployment rolled back
   ```
   その他に、`--to-revision`を指定することにより特定のリビジョンにロールバックできます。

   ```shell
   kubectl rollout undo deployment/nginx-deployment --to-revision=2
   ```

   実行結果は以下のとおりです:

   ```
   deployment.apps/nginx-deployment rolled back
   ```

   ロールアウトに関連したコマンドのさらなる情報は[`kubectl rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout)を参照してください。

   Deploymentが過去の安定したリビジョンにロールバックされました。
   Deploymentコントローラーによって、リビジョン番号2にロールバックする`DeploymentRollback`イベントが作成されたのを確認できます。

2. ロールバックが成功し、Deploymentが想定どおりに稼働していることを確認するために、以下のコマンドを実行してください:

   ```shell
   kubectl get deployment nginx-deployment
   ```

   実行結果は以下のとおりです:

   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3/3     3            3           30m
   ```
3. Deploymentの詳細情報を取得します:

   ```shell
   kubectl describe deployment nginx-deployment
   ```

   実行結果は以下のとおりです:

   ```
   Name:                   nginx-deployment
   Namespace:              default
   CreationTimestamp:      Sun, 02 Sep 2018 18:17:55 -0500
   Labels:                 app=nginx
   Annotations:            deployment.kubernetes.io/revision=4
   Selector:               app=nginx
   Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
   StrategyType:           RollingUpdate
   MinReadySeconds:        0
   RollingUpdateStrategy:  25% max unavailable, 25% max surge
   Pod Template:
     Labels:  app=nginx
     Containers:
      nginx:
       Image:        nginx:1.16.1
       Port:         80/TCP
       Host Port:    0/TCP
       Environment:  <none>
       Mounts:       <none>
     Volumes:        <none>
   Conditions:
     Type           Status  Reason
     ----           ------  ------
     Available      True    MinimumReplicasAvailable
     Progressing    True    NewReplicaSetAvailable
   OldReplicaSets:  <none>
   NewReplicaSet:   nginx-deployment-c4747d96c (3/3 replicas created)
   Events:
     Type    Reason              Age   From                   Message
     ----    ------              ----  ----                   -------
     Normal  ScalingReplicaSet   12m   deployment-controller  Scaled up replica set nginx-deployment-75675f5897 to 3
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 1
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 2
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 2
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 1
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 3
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 0
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-595696685f to 1
     Normal  DeploymentRollback  15s   deployment-controller  Rolled back deployment "nginx-deployment" to revision 2
     Normal  ScalingReplicaSet   15s   deployment-controller  Scaled down replica set nginx-deployment-595696685f to 0
   ```

## Deploymentのスケーリング {#scaling-a-deployment}

以下のコマンドを実行させてDeploymentをスケールできます:

```shell
kubectl scale deployment/nginx-deployment --replicas=10
```

実行結果は以下のとおりです:

```
deployment.apps/nginx-deployment scaled
```

クラスターで[水平Podオートスケーリング](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/)が有効になっていると仮定すると、Deploymentのオートスケーラーを設定し、既存のPodのCPU使用率に基づいて、稼働させたいPodの最小数と最大数を選択できます。

```shell
kubectl autoscale deployment/nginx-deployment --min=10 --max=15 --cpu-percent=80%
```

実行結果は以下のとおりです:

```
deployment.apps/nginx-deployment scaled
```

### 比例スケーリング {#proportional-scaling}

RollingUpdate Deploymentは、同時に複数のバージョンのアプリケーションを稼働させることをサポートします。
ユーザーやオートスケーラーが、ロールアウトの途中(進行中もしくは一時停止中)にあるRollingUpdate Deploymentをスケーリングすると、Deploymentコントローラーはリスクを軽減するために、既存のアクティブなReplicaSet(Podを持つReplicaSet)内で追加されるレプリカのバランスを取ります。
これを*比例スケーリング* と呼びます。

レプリカ数が10、[maxSurge](#max-surge)=3、[maxUnavailable](#max-unavailable)=2であるDeploymentが稼働している例です。

* Deployment内で10のレプリカが稼働していることを確認します:

  ```shell
  kubectl get deploy
  ```

  実行結果は以下のとおりです:

  ```
  NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment     10        10        10           10          50s
  ```

* クラスター内からは解決できない新しいイメージに更新します:

  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:sometag
  ```

  実行結果は以下のとおりです:

  ```
  deployment.apps/nginx-deployment image updated
  ```

* イメージの更新は新しいReplicaSet nginx-deployment-1989198191へのロールアウトを開始させます。
  しかしロールアウトは、上述した`maxUnavailable`の要求によりブロックされます。
  ここでロールアウトのステータスを確認します:

  ```shell
  kubectl get rs
  ```

  実行結果は以下のとおりです:

  ```
  NAME                          DESIRED   CURRENT   READY     AGE
  nginx-deployment-1989198191   5         5         0         9s
  nginx-deployment-618515232    8         8         8         1m
  ```

* 次にDeploymentをスケーリングするための新しい要求が発生します。
  オートスケーラーはDeploymentのレプリカ数を15に増やします。
  Deploymentコントローラーは新しい5つのレプリカをどこに追加するか決める必要がでてきます。
  比例スケーリングを使用していない場合、5つのレプリカは全て新しいReplicaSetに追加されます。
  比例スケーリングでは、追加されるレプリカは全てのReplicaSetに分散されます。
  比例割合が大きいものはレプリカ数の大きいReplicaSetとなり、比例割合が小さいときはレプリカ数の小さいReplicaSetとなります。
  残っているレプリカはもっとも大きいレプリカ数を持つReplicaSetに追加されます。
  レプリカ数が0のReplicaSetはスケールアップされません。

上記の例では、3つのレプリカが古いReplicaSetに追加され、2つのレプリカが新しいReplicaSetに追加されました。
ロールアウトの処理では、新しいレプリカが正常になったと仮定すると、最終的に新しいReplicaSetに全てのレプリカを移動させます。
これを確認するためには以下のコマンドを実行してください:

```shell
kubectl get deploy
```

実行結果は以下のとおりです:

```
NAME                 DESIRED   CURRENT   UP-TO-DATE  AVAILABLE   AGE
nginx-deployment     15        18        7           8           7m
```

ロールアウトのステータスでレプリカがどのように各ReplicaSetに追加されたかを確認できます:

```shell
kubectl get rs
```

実行結果は以下のとおりです:

```
NAME                          DESIRED   CURRENT  READY     AGE
nginx-deployment-1989198191   7         7        0         7m
nginx-deployment-618515232    11        11       11        7m
```

## Deploymentのロールアウトの一時停止と再開 {#pausing-and-resuming-a-deployment}

Deploymentを更新するとき、または更新しようとするとき、1つ以上の更新をトリガーする前にそのDeploymentのロールアウトを一時停止できます。
変更を適用する準備ができたら、Deploymentのロールアウトを再開します。
この方法により、不要なロールアウトをトリガーすることなく、一時停止と再開の間に複数の修正を適用できます。

* 例えば、作成直後のDeploymentを考えます:

  Deploymentの詳細情報を確認します:

  ```shell
  kubectl get deploy
  ```

  実行結果は以下のとおりです:

  ```
  NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx     3         3         3            3           1m
  ```

  ロールアウトのステータスを確認します:

  ```shell
  kubectl get rs
  ```

  実行結果は以下のとおりです:

  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         1m
  ```

* 以下のコマンドを実行して一時停止を行います:

  ```shell
  kubectl rollout pause deployment/nginx-deployment
  ```

  実行結果は以下のとおりです:

  ```
  deployment.apps/nginx-deployment paused
  ```

* 次にDeploymentのイメージを更新します:

  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
  ```

  実行結果は以下のとおりです:

  ```
  deployment.apps/nginx-deployment image updated
  ```

* 新しいロールアウトが開始されていないことを確認します。
  ```shell
  kubectl rollout history deployment/nginx-deployment
  ```

  実行結果は以下のとおりです:

  ```
  deployments "nginx"
  REVISION  CHANGE-CAUSE
  1   <none>
  ```

* 既存のReplicaSetが変更されていないことを確認するために、ロールアウトのステータスを確認します:

  ```shell
  kubectl get rs
  ```

  実行結果は以下のとおりです:
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         2m
  ```

* 更新は何度でも実行できます。
  例えば、使用するリソースを更新します:

  ```shell
  kubectl set resources deployment/nginx-deployment -c=nginx --limits=cpu=200m,memory=512Mi
  ```

  実行結果は以下のとおりです:

  ```
  deployment.apps/nginx-deployment resource requirements updated
  ```

  一時停止する前のDeploymentの初期状態はその機能を継続しますが、Deploymentのロールアウトが一時停止されている間は、Deploymentへの新しい更新は反映されません。

* 最後に、Deploymentのロールアウトを再開させ、新しいReplicaSetが全ての新しい更新を反映して立ち上がるのを確認します:

  ```shell
  kubectl rollout resume deployment/nginx-deployment
  ```

  実行結果は以下のとおりです:

  ```
  deployment.apps/nginx-deployment resumed
  ```

* ロールアウトが完了するまで、その状態を{{< glossary_tooltip text="Watch" term_id="watch" >}}します。

  ```shell
  kubectl get rs --watch
  ```

  実行結果は以下のとおりです:

  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   2         2         2         2m
  nginx-3926361531   2         2         0         6s
  nginx-3926361531   2         2         1         18s
  nginx-2142116321   1         2         2         2m
  nginx-2142116321   1         2         2         2m
  nginx-3926361531   3         2         1         18s
  nginx-3926361531   3         2         1         18s
  nginx-2142116321   1         1         1         2m
  nginx-3926361531   3         3         1         18s
  nginx-3926361531   3         3         2         19s
  nginx-2142116321   0         1         1         2m
  nginx-2142116321   0         1         1         2m
  nginx-2142116321   0         0         0         2m
  nginx-3926361531   3         3         3         20s
  ```
* 最新のロールアウトのステータスを確認します:

  ```shell
  kubectl get rs
  ```

  実行結果は以下のとおりです:

  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   0         0         0         2m
  nginx-3926361531   3         3         3         28s
  ```

{{< note >}}
一時停止したDeploymentは、再開させない限りロールバックすることはできません。
{{< /note >}}

## Deploymentのステータス {#deployment-status}

Deploymentは、そのライフサイクルの間に様々な状態に遷移します。
新しいReplicaSetへのロールアウト中は[進行中](#progressing-deployment)になり、その後は[完了](#complete-deployment)し、また[進行に失敗](#failed-deployment)することもあります。

### Deploymentの更新処理 {#progressing-deployment}

以下のタスクのいずれかが実行されているとき、KubernetesはDeploymentの状態を _進行中_ にします。

* Deploymentが新しいReplicaSetを作成する。
* Deploymentが新しいReplicaSetをスケールアップしている。
* Deploymentが古いReplicaSetをスケールダウンしている。
* 新しいPodが準備中もしくは利用可能な状態になる(少なくとも[MinReadySeconds](#min-ready-seconds)の間は準備中になる)。

ロールアウトが「進行中(progressing)」になると、Deploymentコントローラーは以下の属性を持つConditionをDeploymentの`.status.conditions`に追加します。

* `type: Progressing`
* `status: "True"`
* `reason: NewReplicaSetCreated` | `reason: FoundNewReplicaSet` | `reason: ReplicaSetUpdated`

`kubectl rollout status`を実行すると、Deploymentの進行状況を監視できます。

### Deploymentの更新処理の完了 {#complete-deployment}

Deploymentが以下の状態になったとき、KubernetesはDeploymentのステータスを _完了_ にします。

* Deploymentの全てのレプリカが指定された最新のバージョンに更新され、指定した更新処理が完了したことを意味する。
* Deploymentの全てのレプリカが利用可能になる。
* Deploymentの古いレプリカが1つも稼働していない。

ロールアウトが「完了(complete)」になると、Deploymentコントローラーは以下の属性を持つConditionをDeploymentの`.status.conditions`に設定します。

* `type: Progressing`
* `status: "True"`
* `reason: NewReplicaSetAvailable`

この`Progressing` Conditionは、新しいロールアウトが開始されるまでステータス値`"True"`を保持し続けます。
レプリカの可用性が変化した場合でもこのConditionは保持されます(可用性の変化は代わりに`Available` Conditionに影響します)。

`kubectl rollout status`を実行して、Deploymentの更新が完了したことを確認できます。
ロールアウトが正常に完了すると、`kubectl rollout status`は終了コード0を返します。

```shell
kubectl rollout status deployment/nginx-deployment
```

実行結果は以下のとおりです:

```
Waiting for rollout to finish: 2 of 3 updated replicas are available...
deployment "nginx-deployment" successfully rolled out
```

そして`kubectl rollout`の終了ステータスが0となります(成功です):

```shell
echo $?
```

```
0
```

### Deploymentの更新処理の失敗 {#failed-deployment}

新しいReplicaSetのデプロイが完了せず、更新処理が止まる場合があります。
これは主に以下の要因によるものです:

* 不十分なクォータ
* ReadinessProbeの失敗
* コンテナイメージの取得エラー
* 不十分なパーミッション
* リソースリミットのレンジ
* アプリケーションランタイムの設定の不備

このような状況を検知する1つの方法として、Deploymentのリソース定義でデッドラインのパラメーターを指定します([`.spec.progressDeadlineSeconds`](#progress-deadline-seconds))。
`.spec.progressDeadlineSeconds`は、Deploymentの更新が停止したことを(Deploymentのステータスで)示す前にDeploymentコントローラーが待つ秒数を示します。

以下の`kubectl`コマンドでリソース定義に`progressDeadlineSeconds`を設定します。
これはDeploymentの更新が止まってから10分後に、コントローラーが進行の停止を通知させるためです。

```shell
kubectl patch deployment/nginx-deployment -p '{"spec":{"progressDeadlineSeconds":600}}'
```

実行結果は以下のとおりです:

```
deployment.apps/nginx-deployment patched
```

デッドラインを超過すると、Deploymentコントローラーは以下の属性を持つDeploymentConditionをDeploymentの`.status.conditions`に追加します:

* `type: Progressing`
* `status: "False"`
* `reason: ProgressDeadlineExceeded`

このConditionは、`ReplicaSetCreateError`のような理由により早期に失敗し、ステータス値`"False"`に設定されることもあります。
また、Deploymentのロールアウトが完了すると、デッドラインは考慮されなくなります。

ステータスの状態に関するさらなる情報は[Kubernetes APIの規則](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties)を参照してください。

{{< note >}}
Kubernetesは、`reason: ProgressDeadlineExceeded`のステータス状態を報告する以外に、停止状態のDeploymentに対して何のアクションも実行しません。
上位レベルのオーケストレーターはこれを利用して、状態に応じて行動できます。
例えば、前のバージョンへのDeploymentのロールバックが挙げられます。
{{< /note >}}

{{< note >}}
Deploymentのロールアウトを一時停止しても、Kubernetesは指定したデッドラインを超えたかどうかチェックしません。
ロールアウトの途中でもDeploymentのロールアウトを安全に一時停止でき、デッドラインを超えるためのConditionをトリガーすることなく再開できます。
{{< /note >}}

設定したタイムアウトの秒数が小さかったり、一時的なエラーとして扱える他の種類のエラーが原因となり、Deploymentで一時的なエラーが出る場合があります。
例えば、クォータが不十分な場合を考えます。
Deploymentの詳細情報を確認すると、以下のセクションが表示されます:

```shell
kubectl describe deployment nginx-deployment
```

実行結果は以下のとおりです:

```
<...>
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     True    ReplicaSetUpdated
  ReplicaFailure  True    FailedCreate
<...>
```

`kubectl get deployment nginx-deployment -o yaml`を実行すると、Deploymentのステータスは以下のようになります:

```
status:
  availableReplicas: 2
  conditions:
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: Replica set "nginx-deployment-4262182780" is progressing.
    reason: ReplicaSetUpdated
    status: "True"
    type: Progressing
  - lastTransitionTime: 2016-10-04T12:25:42Z
    lastUpdateTime: 2016-10-04T12:25:42Z
    message: Deployment has minimum availability.
    reason: MinimumReplicasAvailable
    status: "True"
    type: Available
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: 'Error creating: pods "nginx-deployment-4262182780-" is forbidden: exceeded quota:
      object-counts, requested: pods=1, used: pods=3, limited: pods=2'
    reason: FailedCreate
    status: "True"
    type: ReplicaFailure
  observedGeneration: 3
  replicas: 2
  unavailableReplicas: 2
```

最終的に、Deploymentの更新処理のデッドラインを超過すると、KubernetesはステータスとProgressing Conditionのreasonを更新します:

```
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     False   ProgressDeadlineExceeded
  ReplicaFailure  True    FailedCreate
```

Deploymentをスケールダウンする、稼働している他のコントローラーをスケールダウンする、または使用している名前空間のクォータを増やすことで、クォータ不足の問題に対処できます。
割り当て条件を満たしたあとにDeploymentコントローラーがDeploymentのロールアウトを完了させると、Deploymentのステータスが成功状態のConditionに更新されるのを確認できます(`status: "True"`と`reason: NewReplicaSetAvailable`)。

```
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
```

`status: "True"`の`type: Available`は、Deploymentが最小可用性を満たしていることを意味します。
最小可用性は、デプロイ戦略で指定されたパラメーターによって決まります。
`status: "True"`の`type: Progressing`は、Deploymentがロールアウトの途中で進行中であるか、またはロールアウトが正常に完了し、必要な最小数の新しいレプリカが利用可能であることを意味します(詳細についてはそのConditionのReasonを確認してください。
このケースでは、`reason: NewReplicaSetAvailable`はDeploymentが完了したことを意味します)。

`kubectl rollout status`を実行して、Deploymentが進行に失敗したかどうかを確認できます。
`kubectl rollout status`は、Deploymentが進行のデッドラインを超えた場合に0以外の終了コードを返します。

```shell
kubectl rollout status deployment/nginx-deployment
```

実行結果は以下のとおりです:

```
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
error: deployment "nginx" exceeded its progress deadline
```
そして`kubectl rollout`の終了ステータスが1となります(エラーを示しています):

```shell
echo $?
```

```
1
```

### 失敗したDeploymentの操作 {#operating-on-a-failed-deployment}

更新完了したDeploymentに適用した全てのアクションは、更新失敗したDeploymentに対しても適用されます。
スケールアップ、スケールダウンができ、前のリビジョンへのロールバックや、DeploymentのPodテンプレートに複数の修正を適用する必要があるときは一時停止もできます。

## クリーンアップポリシー {#clean-up-policy}

Deploymentが管理する古いReplicaSetをいくつ保持するかを指定するために、`.spec.revisionHistoryLimit`フィールドを設定できます。
この値を超えた古いReplicaSetはバックグラウンドでガベージコレクションの対象となって削除されます。
デフォルトではこの値は10です。

{{< note >}}
このフィールドを明示的に0に設定すると、Deploymentの全ての履歴を削除します。
従って、Deploymentはロールバックできなくなります。
{{< /note >}}

クリーンアップは、Deploymentが[完了状態](/docs/concepts/workloads/controllers/deployment/#complete-deployment)に達した**後**にのみ開始されます。
`.spec.revisionHistoryLimit`を0に設定した場合でも、ロールアウトはKubernetesが古いReplicaSetを削除する前に新しいReplicaSetの作成をトリガーします。

リビジョン履歴の上限が0以外であっても、設定した上限よりも多くのReplicaSetを持つことがあります。
例えば、Podがクラッシュループしていて、時間の経過とともに複数のローリングアップデートイベントがトリガーされた場合、Deploymentが完了状態に達しないため、`.spec.revisionHistoryLimit`よりも多くのReplicaSetができあがることがあります。

## カナリアデプロイ {#canary-deployment}

Deploymentを使って一部のユーザーやサーバーに対してリリースのロールアウトをしたい場合は、[リソースの管理](/docs/concepts/workloads/management/#canary-deployments)に記載されているカナリアパターンに従って、リリース毎に1つずつ、複数のDeploymentを作成できます。

## Deployment Specの記述 {#writing-a-deployment-spec}

他の全てのKubernetesの設定と同様に、Deploymentは`.apiVersion`、`.kind`、`.metadata`フィールドを必要とします。
設定ファイルの利用に関する一般的な情報については、[アプリケーションのデプロイ](/docs/tasks/run-application/run-stateless-application-deployment/)、コンテナの設定、および[リソースを管理するためのkubectlの使用](/docs/concepts/overview/working-with-objects/object-management/)のドキュメントを参照してください。

コントロールプレーンがDeployment用に新しいPodを作成するとき、Deploymentの`.metadata.name`がそれらのPodの名前付けのもとの一部になります。
Deploymentの名前は有効な[DNSサブドメイン名](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)である必要がありますが、これはPodのホスト名に予期しない結果をもたらすことがあります。
最良の互換性のために、名前はより制限の厳しい[DNSラベル名](/docs/concepts/overview/working-with-objects/names#dns-label-names)のルールに従う必要があります。

Deploymentは[`.spec`セクション](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)も必要とします。

### Podテンプレート {#pod-template}

`.spec.template`と`.spec.selector`は`.spec`における唯一の必須フィールドです。

`.spec.template`は[Podテンプレート](/docs/concepts/workloads/pods/#pod-templates)です。
これは`.spec`内でネストされていることと、`apiVersion`や`kind`を持たないことを除いては{{< glossary_tooltip text="Pod" term_id="pod" >}}と全く同じスキーマです。

Podの必須フィールドに加えて、Deployment内のPodテンプレートでは適切なラベルと適切な再起動ポリシーを設定しなくてはなりません。
ラベルは他のコントローラーと重複しないようにしてください。
ラベルについては、[セレクター](#selector)を参照してください。

[`.spec.template.spec.restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)が`Always`に等しいときのみ許可されます。
これは指定されていない場合のデフォルト値です。

### レプリカ数 {#replicas}

`.spec.replicas`は理想的なPodの数を指定するオプションのフィールドです。
デフォルトは1です。

`kubectl scale deployment deployment --replicas=X`のようにDeploymentを手動でスケールし、その後マニフェストに基づいてそのDeploymentを更新した場合(例えば`kubectl apply -f deployment.yaml`を実行した場合)、そのマニフェストの適用によって、以前に行った手動のスケーリングは上書きされます。

[HorizontalPodAutoscaler](/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/)(または水平スケーリングのための同様のAPI)がDeploymentのスケーリングを管理している場合、`.spec.replicas`を設定しないでください。

代わりに、Kubernetesの{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}が`.spec.replicas`フィールドを自動的に管理できるようにしてください。

### セレクター {#selector}

`.spec.selector`は必須フィールドで、Deploymentによって対象とされるPodの[ラベルセレクター](/docs/concepts/overview/working-with-objects/labels/)を指定します。

`.spec.selector`は`.spec.template.metadata.labels`と一致している必要があり、一致しない場合はAPIによって拒否されます。

`apps/v1`バージョンにおいて、`.spec.selector`と`.metadata.labels`が指定されていない場合、`.spec.template.metadata.labels`の値に初期化されません。
そのため`.spec.selector`と`.metadata.labels`を明示的に指定する必要があります。
また`apps/v1`のDeploymentにおいて`.spec.selector`は作成後に不変になります。

Deploymentのテンプレートが`.spec.template`と異なるラベルを持つPodや、`.spec.replicas`の値を超えて稼働しているPodがある場合、Deploymentはセレクターに一致するラベルを持つPodを削除することがあります。
Podの数が理想状態より少ない場合、Deploymentは`.spec.template`をもとに新しいPodを作成します。

{{< note >}}
このセレクターに一致するラベルを持つPodを、直接作成したり、他のDeploymentを作成したり、ReplicaSetやReplicationControllerのような他のコントローラーを作成したりして作るべきではありません。
作成してしまうと、最初のDeploymentがこれらの他のPodを作成したとみなしてしまいます。
ただし、Kubernetesはこれを行うことを止めません。
{{< /note >}}

セレクターが重複する複数のコントローラーを持つとき、そのコントローラーは互いに競合状態となり、正しくふるまいません。

### 更新戦略 {#strategy}

`.spec.strategy`は古いPodから新しいPodに置き換える際の更新戦略を指定します。
`.spec.strategy.type`は"Recreate"もしくは"RollingUpdate"を指定できます。
デフォルトは"RollingUpdate"です。

#### Deploymentの再作成 {#recreate-deployment}

`.spec.strategy.type==Recreate`と指定されているとき、既存の全てのPodは新しいPodが作成される前に削除されます。

{{< note >}}
これは、アップグレードの際に、Podの作成より前にPodが停止されることを保証するだけです。
Deploymentを更新する場合、古いリビジョンのPodは全てすぐに停止されます。
削除に成功するまでは、新しいリビジョンのPodは作成されません。
手動でPodを削除すると、ライフサイクルはReplicaSetによって制御されているため、すぐに置き換えが実施されます(たとえ古いPodがまだ停止中のステータスでも)。
Podに対して「最大稼働数」の保証が必要であれば、[StatefulSet](/docs/concepts/workloads/controllers/statefulset/)の使用を検討してください。
{{< /note >}}

#### Deploymentのローリングアップデート {#rolling-update-deployment}

`.spec.strategy.type==RollingUpdate`と指定されているとき、DeploymentはローリングアップデートによりPodを更新します(古いReplicaSetを段階的にスケールダウンし、新しいReplicaSetをスケールアップします)。
ローリングアップデートの処理をコントロールするために`maxUnavailable`と`maxSurge`を指定できます。

##### Max Unavailable {#max-unavailable}

`.spec.strategy.rollingUpdate.maxUnavailable`はオプションのフィールドで、更新処理において利用不可となる最大のPod数を指定します。
値は絶対数(例: 5)を指定するか、理想状態のPodのパーセンテージを指定します(例: 10%)。
パーセンテージを指定した場合、絶対数は小数切り捨てされて計算されます。
`.spec.strategy.rollingUpdate.maxSurge`が0に指定されている場合、この値を0にできません。
デフォルトでは25%です。

例えば、この値が30%と指定されているとき、ローリングアップデートが開始すると古いReplicaSetはすぐに理想状態の70%にスケールダウンされます。
一度新しいPodが稼働できる状態になると、古いReplicaSetはさらにスケールダウンされ、続いて新しいReplicaSetがスケールアップされます。
この間、利用可能なPodの総数は理想状態のPodの少なくとも70%以上になるように保証されます。

##### Max Surge {#max-surge}

`.spec.strategy.rollingUpdate.maxSurge`はオプションのフィールドで、理想状態のPod数を超えて作成できる最大のPod数を指定します。
値は絶対数(例: 5)を指定するか、理想状態のPodのパーセンテージを指定します(例: 10%)。
パーセンテージを指定した場合、絶対数は小数切り上げで計算されます。
`maxUnavailable`が0に指定されている場合、この値を0にできません。
デフォルトでは25%です。

例えば、この値が30%と指定されているとき、ローリングアップデートが開始すると新しいReplicaSetはすぐにスケールアップされます。
このとき古いPodと新しいPodの総数は理想状態の130%を超えないように更新されます。
一度古いPodが削除されると、新しいReplicaSetはさらにスケールアップされます。
この間、利用可能なPodの総数は理想状態のPodに対して最大130%になるように保証されます。

`maxUnavailable`と`maxSurge`を使用したローリングアップデートDeploymentの例をいくつか以下に示します:

{{< tabs name="tab_with_md" >}}
{{% tab name="Max Unavailable" %}}

 ```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
 ```

{{% /tab %}}
{{% tab name="Max Surge" %}}

 ```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
 ```

{{% /tab %}}
{{% tab name="Hybrid" %}}

 ```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
 ```

{{% /tab %}}
{{< /tabs >}}

### Progress Deadline Seconds {#progress-deadline-seconds}

`.spec.progressDeadlineSeconds`はオプションのフィールドで、システムがDeploymentの[進行に失敗](#failed-deployment)したと報告するまでに、Deploymentが進行するのを待つ秒数を指定します。
失敗は、リソースのステータスにおいて`type: Progressing`、`status: "False"`、`reason: ProgressDeadlineExceeded`を持つConditionとして表面化します。
DeploymentコントローラーはDeploymentのリトライを続けます。
デフォルト値は600です。

このフィールドを指定する場合、`.spec.minReadySeconds`より大きい値にする必要があります。

### Min Ready Seconds {#min-ready-seconds}

`.spec.minReadySeconds`はオプションのフィールドで、新しく作成されたPodが利用可能となるために、いずれのコンテナもクラッシュすることなく準備完了の状態を維持すべき最小秒数を指定するものです。
デフォルトでは0です(Podは準備完了になるとすぐに利用可能と判断されます)。
Podが利用可能と判断される場合についてさらに学ぶには、[コンテナのProbe](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)を参照してください。

### 終了中のPod {#terminating-pods}

{{< feature-state feature_gate_name="DeploymentReplicaSetTerminatingReplicas" >}}

終了中(terminating)のPodは、[APIサーバー](/docs/reference/command-line-tools-reference/kube-apiserver/)と[kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)で`DeploymentReplicaSetTerminatingReplicas`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)が有効になっている場合にのみ確認できます。

削除やスケールダウンによって終了中になったPodは、終了するまでに長い時間がかかることがあり、その間に追加のリソースを消費する可能性があります。
その結果、全Podの合計数が一時的に`.spec.replicas`を超えることがあります。
終了中のPodは、Deploymentの`.status.terminatingReplicas`フィールドを使用して追跡できます。

### リビジョン履歴の保持上限 {#revision-history-limit}

Deploymentのリビジョン履歴は、Deploymentが管理するReplicaSetに保持されています。

`.spec.revisionHistoryLimit`はオプションのフィールドで、ロールバックを可能にするために保持する古いReplicaSetの数を指定します。
この古いReplicaSetは`etcd`内のリソースを消費し、`kubectl get rs`の出力結果を見にくくします。
Deploymentの各リビジョンの設定はReplicaSetに保持されます。
このため一度古いReplicaSetが削除されると、そのリビジョンのDeploymentにロールバックすることができなくなります。
デフォルトでは10もの古いReplicaSetが保持されますが、この値の最適値は新しいDeploymentの更新頻度と安定性に依存します。

さらに詳しく言うと、この値を0にすると、レプリカ数が0の古いReplicaSetが全て削除されます。
このケースでは、リビジョン履歴が完全に削除されているため新しいDeploymentのロールアウトを元に戻すことができません。

### paused

`.spec.paused`はオプションのboolean値で、Deploymentの一時停止と再開のための値です。
一時停止されているものと、そうでないものとの違いは、一時停止されているDeploymentはPodTemplateSpecのいかなる変更があってもロールアウトがトリガーされないことです。
デフォルトではDeploymentは一時停止していない状態で作成されます。

## {{% heading "whatsnext" %}}

* [Pod](/docs/concepts/workloads/pods)について学ぶ。
* [Deploymentを使用してステートレスアプリケーションを実行する](/docs/tasks/run-application/run-stateless-application-deployment/)。
* Deployment APIを理解するために{{< api-reference page="apps/deployment-v1" >}}の仕様を読む。
* [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/)と、それを使用して停止中のアプリケーションの可用性を管理する方法について読む。
* kubectlを使用して[Deploymentを作成する](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)。
