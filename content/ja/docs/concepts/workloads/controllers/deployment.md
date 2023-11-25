---
title: Deployment
feature:
  title: 自動化されたロールアウトとロールバック
  description: >
    Kubernetesはアプリケーションや設定への変更を段階的に行い、アプリケーションの状態を監視しながら、全てのインスタンスが同時停止しないようにします。更新に問題が起きたとき、Kubernetesは変更のロールバックを行います。進化を続けるDeploymentのエコシステムを活用してください。

content_type: concept
weight: 10
---

<!-- overview -->

_Deployment_ は{{< glossary_tooltip text="Pod" term_id="pod" >}}と{{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}の宣言的なアップデート機能を提供します。

Deploymentにおいて _理想的な状態_ を記述すると、Deployment{{< glossary_tooltip text="コントローラー" term_id="controller" >}}は指定された頻度で現在の状態を理想的な状態に変更します。Deploymentを定義することによって、新しいReplicaSetを作成したり、既存のDeploymentを削除して新しいDeploymentで全てのリソースを適用できます。

{{< note >}}
Deploymentによって作成されたReplicaSetを管理しないでください。ご自身のユースケースが以下の項目に含まれない場合、メインのKubernetesリポジトリーにIssueを作成することを検討してください。
{{< /note >}}




<!-- body -->

## ユースケース

以下の項目はDeploymentの典型的なユースケースです。

* ReplicaSetをロールアウトするために[Deploymentの作成](#creating-a-deployment)を行う: ReplicaSetはバックグラウンドでPodを作成します。Podの作成が完了したかどうかは、ロールアウトのステータスを確認してください。
* DeploymentのPodTemplateSpecを更新することにより[Podの新しい状態を宣言する](#updating-a-deployment): 新しいReplicaSetが作成され、Deploymentは指定された頻度で古いReplicaSetから新しいReplicaSetへのPodの移行を管理します。新しいReplicaSetはDeploymentのリビジョンを更新します。
* Deploymentの現在の状態が不安定な場合、[Deploymentのロールバック](#rolling-back-a-deployment)をする: ロールバックによる各更新作業は、Deploymentのリビジョンを更新します。
* より多くの負荷をさばけるように、[Deploymentをスケールアップ](#scaling-a-deployment)する。
* PodTemplateSpecに対する複数の修正を適用するために[Deploymentを停止(Pause)し](#pausing-and-resuming-a-deployment)、それを再開して新しいロールアウトを開始します。
* [Deploymentのステータス](#deployment-status) をロールアウトが失敗したサインとして利用する。
* 今後必要としない[古いReplicaSetのクリーンアップ](#clean-up-policy)

## Deploymentの作成 {#creating-a-deployment}

以下はDeploymentの例です。これは`nginx`Podのレプリカを3つ持つReplicaSetを作成します。

{{% codenew file="controllers/nginx-deployment.yaml" %}}

この例では、

* `.metadata.name`フィールドで指定された`nginx-deployment`という名前のDeploymentが作成されます。
* このDeploymentは`.spec.replicas`フィールドで指定された通り、3つのレプリカPodを作成します。
* `.spec.selector`フィールドは、Deploymentが管理するPodのラベルを定義します。ここでは、Podテンプレートにて定義されたラベル(`app: nginx`)を選択しています。しかし、PodTemplate自体がそのルールを満たす限り、さらに洗練された方法でセレクターを指定することができます。

    {{< note >}}
    `.spec.selector.matchLabels`フィールドはキーバリューペアのマップです。
    `matchLabels`マップにおいて、{key, value}というペアは、keyというフィールドの値が"key"で、その演算子が"In"で、値の配列が"value"のみ含むような`matchExpressions`の要素と等しくなります。
    `matchLabels`と`matchExpressions`の両方が設定された場合、条件に一致するには両方とも満たす必要があります。
    {{< /note >}}

* `template`フィールドは、以下のサブフィールドを持ちます。:
  * Podは`.metadata.labels`フィールドによって指定された`app: nginx`というラベルがつけられます。
  * PodTemplate、または`.template.spec`フィールドは、Podが`nginx`という名前で[Docker Hub](https://hub.docker.com/)にある`nginx`のバージョン1.14.2が動くコンテナを1つ動かすことを示します。
  * 1つのコンテナを作成し、`.spec.template.spec.containers[0].name`フィールドを使って`nginx`という名前をつけます。

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
  * `NAME`は、クラスター内にあるDeploymentの名前一覧です。
  * `READY`は、ユーザーが使用できるアプリケーションのレプリカの数です。使用可能な数/理想的な数の形式で表示されます。
  * `UP-TO-DATE`は、理想的な状態を満たすためにアップデートが完了したレプリカの数です。
  * `AVAILABLE`は、ユーザーが利用可能なレプリカの数です。
  * `AGE`は、アプリケーションが稼働してからの時間です。

  `.spec.replicas`フィールドの値によると、理想的なレプリカ数は3であることがわかります。

3. Deploymentのロールアウトステータスを確認するために、`kubectl rollout status deployment.v1.apps/nginx-deployment`を実行してください。

  コマンドの実行結果は以下のとおりです。
  ```shell
  Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
  deployment "nginx-deployment" successfully rolled out
  ```

4. 数秒後、再度`kubectl get deployments`を実行してください。
  コマンドの実行結果は以下のとおりです。
  ```
  NAME               READY   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment   3/3     3            3           18s
  ```
  Deploymentが3つ全てのレプリカを作成して、全てのレプリカが最新(Podが最新のPodテンプレートを含んでいる)になり、利用可能となっていることを確認してください。

5. Deploymentによって作成されたReplicaSet(`rs`)を確認するには`kubectl get rs`を実行してください。コマンドの実行結果は以下のとおりです:
  ```
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-75675f5897   3         3         3       18s
  ```
  ReplicaSetの出力には次のフィールドが表示されます:

  * `NAME`は、名前空間内にあるReplicaSetの名前の一覧です。
  * `DESIRED`は、アプリケーションの理想的な _レプリカ_ の値です。これはDeploymentを作成したときに定義したもので、これが _理想的な状態_ と呼ばれるものです。
  * `CURRENT`は現在実行されているレプリカの数です。
  * `READY`は、ユーザーが使用できるアプリケーションのレプリカの数です。
  * `AGE`は、アプリケーションが稼働してからの時間です。

  ReplicaSetの名前は`[Deployment名]-[ランダム文字列]`という形式になることに注意してください。ランダム文字列はランダムに生成され、pod-template-hashをシードとして使用します。

6. 各Podにラベルが自動的に付けられるのを確認するには`kubectl get pods --show-labels`を実行してください。
  コマンドの実行結果は以下のとおりです:
  ```
  NAME                                READY     STATUS    RESTARTS   AGE       LABELS
  nginx-deployment-75675f5897-7ci7o   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
  nginx-deployment-75675f5897-kzszj   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
  nginx-deployment-75675f5897-qqcnn   1/1       Running   0          18s       app=nginx,pod-template-hash=75675f5897
  ```
  作成されたReplicaSetは`nginx`Podを3つ作成することを保証します。

{{< note >}}
Deploymentに対して適切なセレクターとPodテンプレートのラベルを設定する必要があります(このケースでは`app: nginx`)。

ラベルやセレクターを他のコントローラーと重複させないでください(他のDeploymentやStatefulSetを含む)。Kubernetesはユーザーがラベルを重複させることを阻止しないため、複数のコントローラーでセレクターの重複が発生すると、コントローラー間で衝突し予期せぬふるまいをすることになります。
{{< /note >}}

### pod-template-hashラベル

{{< caution >}}
このラベルを変更しないでください。
{{< /caution >}}

`pod-template-hash`ラベルはDeploymentコントローラーによってDeploymentが作成し適用した各ReplicaSetに対して追加されます。

このラベルはDeploymentが管理するReplicaSetが重複しないことを保証します。このラベルはReplicaSetの`PodTemplate`をハッシュ化することにより生成され、生成されたハッシュ値はラベル値としてReplicaSetセレクター、Podテンプレートラベル、ReplicaSetが作成した全てのPodに対して追加されます。

## Deploymentの更新 {#updating-a-deployment}

{{< note >}}
Deploymentのロールアウトは、DeploymentのPodテンプレート(この場合`.spec.template`)が変更された場合にのみトリガーされます。例えばテンプレートのラベルもしくはコンテナイメージが更新された場合です。Deploymentのスケールのような更新では、ロールアウトはトリガーされません。
{{< /note >}}

Deploymentを更新するには以下のステップに従ってください。

1. nginxのPodで、`nginx:1.14.2`イメージの代わりに`nginx:1.16.1`を使うように更新します。

    ```shell
    kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.16.1
    ```
    または単に次のコマンドを使用します。

    ```shell
    kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
    ```

    実行結果は以下のとおりです。
    ```
    deployment.apps/nginx-deployment image updated
    ```

    また、Deploymentを`編集`して、`.spec.template.spec.containers[0].image`を`nginx:1.14.2`から`nginx:1.16.1`に変更することができます。

    ```shell
    kubectl edit deployment.v1.apps/nginx-deployment
    ```

    実行結果は以下のとおりです。
    ```
    deployment.apps/nginx-deployment edited
    ```

2. ロールアウトのステータスを確認するには、以下のコマンドを実行してください。

    ```shell
    kubectl rollout status deployment.v1.apps/nginx-deployment
    ```

    実行結果は以下のとおりです。
    ```
    Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
    ```
    もしくは
    ```
    deployment "nginx-deployment" successfully rolled out
    ```

更新されたDeploymentのさらなる情報を取得するには、以下を確認してください。

* ロールアウトが成功したあと、`kubectl get deployments`を実行してDeploymentを確認できます。
    実行結果は以下のとおりです。
    ```
    NAME               READY   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   3/3     3            3           36s
    ```

* Deploymentが新しいReplicaSetを作成してPodを更新させたり、新しいReplicaSetのレプリカを3にスケールアップさせたり、古いReplicaSetのレプリカを0にスケールダウンさせるのを確認するには`kubectl get rs`を実行してください。

    ```shell
    kubectl get rs
    ```

    実行結果は以下のとおりです。
    ```
    NAME                          DESIRED   CURRENT   READY   AGE
    nginx-deployment-1564180365   3         3         3       6s
    nginx-deployment-2035384211   0         0         0       36s
    ```

* `get pods`を実行させると、新しいPodのみ確認できます。

    ```shell
    kubectl get pods
    ```

    実行結果は以下のとおりです。
    ```
    NAME                                READY     STATUS    RESTARTS   AGE
    nginx-deployment-1564180365-khku8   1/1       Running   0          14s
    nginx-deployment-1564180365-nacti   1/1       Running   0          14s
    nginx-deployment-1564180365-z9gth   1/1       Running   0          14s
    ```

    次にPodを更新させたいときは、DeploymentのPodテンプレートを再度更新するだけです。

    Deploymentは、Podが更新されている間に特定の数のPodのみ停止状態になることを保証します。デフォルトでは、目標とするPod数の少なくとも75%が稼働状態であることを保証します(25% max unavailable)。

    また、DeploymentはPodが更新されている間に、目標とするPod数を特定の数まで超えてPodを稼働させることを保証します。デフォルトでは、目標とするPod数に対して最大でも125%を超えてPodを稼働させることを保証します(25% max surge)。

    例えば、上記で説明したDeploymentの状態を注意深く見ると、最初に新しいPodが作成され、次に古いPodが削除されるのを確認できます。十分な数の新しいPodが稼働するまでは、Deploymentは古いPodを削除しません。また十分な数の古いPodが削除しない限り新しいPodは作成されません。少なくとも2つのPodが利用可能で、最大でもトータルで4つのPodが利用可能になっていることを保証します。

* Deploymentの詳細情報を取得します。
  ```shell
  kubectl describe deployments
  ```
  実行結果は以下のとおりです。
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
    最初にDeploymentを作成した時、ReplicaSet(nginx-deployment-2035384211)を作成してすぐにレプリカ数を3にスケールするのを確認できます。Deploymentを更新すると新しいReplicaSet(nginx-deployment-1564180365)を作成してレプリカ数を1にスケールアップし、古いReplicaSeetを2にスケールダウンさせます。これは常に最低でも2つのPodが利用可能で、かつ最大4つのPodが作成されている状態にするためです。Deploymentは同じローリングアップ戦略に従って新しいReplicaSetのスケールアップと古いReplicaSetのスケールダウンを続けます。最終的に新しいReplicaSetを3にスケールアップさせ、古いReplicaSetを0にスケールダウンさせます。

### ロールオーバー (リアルタイムでの複数のPodの更新)

Deploymentコントローラーにより、新しいDeploymentが観測される度にReplicaSetが作成され、理想とするレプリカ数のPodを作成します。Deploymentが更新されると、既存のReplicaSetが管理するPodのラベルが`.spec.selector`にマッチするが、テンプレートが`.spec.template`にマッチしない場合はスケールダウンされます。最終的に、新しいReplicaSetは`.spec.replicas`の値にスケールアップされ、古いReplicaSetは0にスケールダウンされます。

Deploymentのロールアウトが進行中にDeploymentを更新すると、Deploymentは更新する毎に新しいReplicaSetを作成してスケールアップさせ、以前にスケールアップしたReplicaSetのロールオーバーを行います。Deploymentは更新前のReplicaSetを古いReplicaSetのリストに追加し、スケールダウンを開始します。

例えば、5つのレプリカを持つ`nginx:1.14.2`のDeploymentを作成し、`nginx:1.14.2`の3つのレプリカが作成されているときに5つのレプリカを持つ`nginx:1.16.1`に更新します。このケースではDeploymentは作成済みの`nginx:1.14.2`の3つのPodをすぐに削除し、`nginx:1.16.1`のPodの作成を開始します。`nginx:1.14.2`の5つのレプリカを全て作成するのを待つことはありません。

### ラベルセレクターの更新

通常、ラベルセレクターを更新することは推奨されません。事前にラベルセレクターの使い方を計画しておきましょう。いかなる場合であっても更新が必要なときは十分に注意を払い、変更時の影響範囲を把握しておきましょう。

{{< note >}}
`apps/v1`API バージョンにおいて、Deploymentのラベルセレクターは作成後に不変となります。
{{< /note >}}

* セレクターの追加は、Deployment Specのテンプレートラベルも新しいラベルで更新する必要があります。そうでない場合はバリデーションエラーが返されます。この変更は重複がない更新となります。これは新しいセレクターは古いセレクターを持つReplicaSetとPodを選択せず、結果として古い全てのReplicaSetがみなし子状態になり、新しいReplicaSetを作成することを意味します。
* セレクターの更新により、セレクターキー内の既存の値が変更されます。これにより、セレクターの追加と同じふるまいをします。
* セレクターの削除により、Deploymentのセレクターから存在している値を削除します。これはPodテンプレートのラベルに関する変更を要求しません。既存のReplicaSetはみなし子状態にならず、新しいReplicaSetは作成されませんが、削除されたラベルは既存のPodとReplicaSetでは残り続けます。

## Deploymentのロールバック {#rolling-back-a-deployment}

例えば、クラッシュループ状態などのようにDeploymentが不安定な場合においては、Deploymentをロールバックしたくなることがあります。Deploymentの全てのロールアウト履歴は、いつでもロールバックできるようにデフォルトでシステムに保持されています(リビジョン履歴の上限は設定することで変更可能です)。

{{< note >}}
Deploymentのリビジョンは、Deploymentのロールアウトがトリガーされた時に作成されます。これはDeploymentのPodテンプレート(`.spec.template`)が変更されたときのみ新しいリビジョンが作成されることを意味します。Deploymentのスケーリングなど、他の種類の更新においてはDeploymentのリビジョンは作成されません。これは手動もしくはオートスケーリングを同時に行うことができるようにするためです。これは過去のリビジョンにロールバックするとき、DeploymentのPodテンプレートの箇所のみロールバックされることを意味します。
{{< /note >}}

* `nginx:1.16.1`の代わりに`nginx:1.161`というイメージに更新して、Deploymentの更新中にタイプミスをしたと仮定します。

    ```shell
    kubectl set image deployment/nginx-deployment nginx=nginx:1.161
    ```

    実行結果は以下のとおりです。
    ```
    deployment.apps/nginx-deployment image updated
    ```

* このロールアウトはうまくいきません。ロールアウトのステータスを見るとそれを確認できます。

    ```shell
    kubectl rollout status deployment.v1.apps/nginx-deployment
    ```

    実行結果は以下のとおりです。
    ```
    Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
    ```

* ロールアウトのステータスの確認は、Ctrl-Cを押すことで停止できます。ロールアウトがうまく行かないときは、[Deploymentのステータス](#deployment-status)を読んでさらなる情報を得てください。

* 古いレプリカ数(`nginx-deployment-1564180365` and `nginx-deployment-2035384211`)が2になっていることを確認でき、新しいレプリカ数(nginx-deployment-3066724191)は1になっています。

    ```shell
    kubectl get rs
    ```

    実行結果は以下のとおりです。
    ```
    NAME                          DESIRED   CURRENT   READY   AGE
    nginx-deployment-1564180365   3         3         3       25s
    nginx-deployment-2035384211   0         0         0       36s
    nginx-deployment-3066724191   1         1         0       6s
    ```

* 作成されたPodを確認していると、新しいReplicaSetによって作成された1つのPodはコンテナイメージのpullに失敗し続けているのがわかります。

    ```shell
    kubectl get pods
    ```

    実行結果は以下のとおりです。
    ```
    NAME                                READY     STATUS             RESTARTS   AGE
    nginx-deployment-1564180365-70iae   1/1       Running            0          25s
    nginx-deployment-1564180365-jbqqo   1/1       Running            0          25s
    nginx-deployment-1564180365-hysrc   1/1       Running            0          25s
    nginx-deployment-3066724191-08mng   0/1       ImagePullBackOff   0          6s
    ```

    {{< note >}}
    Deploymentコントローラーは、この悪い状態のロールアウトを自動的に停止し、新しいReplicaSetのスケールアップを止めます。これはユーザーが指定したローリングアップデートに関するパラメーター(特に`maxUnavailable`)に依存します。デフォルトではKubernetesがこの値を25%に設定します。
    {{< /note >}}

* Deploymentの詳細情報を取得します。
    ```shell
    kubectl describe deployment
    ```

    実行結果は以下のとおりです。
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

  これを修正するために、Deploymentを安定した状態の過去のリビジョンに更新する必要があります。

### Deploymentのロールアウト履歴の確認

ロールアウトの履歴を確認するには、以下の手順に従って下さい。

1. 最初に、Deploymentのリビジョンを確認します。
    ```shell
    kubectl rollout history deployment.v1.apps/nginx-deployment
    ```
    実行結果は以下のとおりです。
    ```
    deployments "nginx-deployment"
    REVISION    CHANGE-CAUSE
    1           kubectl apply --filename=https://k8s.io/examples/controllers/nginx-deployment.yaml
    2           kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.16.1
    3           kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.161
    ```

    `CHANGE-CAUSE`はリビジョンの作成時にDeploymentの`kubernetes.io/change-cause`アノテーションからリビジョンにコピーされます。以下の方法により`CHANGE-CAUSE`メッセージを指定できます。

    * `kubectl annotate deployment.v1.apps/nginx-deployment kubernetes.io/change-cause="image updated to 1.16.1"`の実行によりアノテーションを追加します。
    * リソースのマニフェストを手動で編集します。

2. 各リビジョンの詳細を確認するためには以下のコマンドを実行してください。
    ```shell
    kubectl rollout history deployment.v1.apps/nginx-deployment --revision=2
    ```

    実行結果は以下のとおりです。
    ```
    deployments "nginx-deployment" revision 2
      Labels:       app=nginx
              pod-template-hash=1159050644
      Annotations:  kubernetes.io/change-cause=kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.16.1
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
現在のリビジョンから過去のリビジョン(リビジョン番号2)にロールバックさせるには、以下の手順に従ってください。

1. 現在のリビジョンから過去のリビジョンにロールバックします。
    ```shell
    kubectl rollout undo deployment.v1.apps/nginx-deployment
    ```

    実行結果は以下のとおりです。
    ```
    deployment.apps/nginx-deployment rolled back
    ```
    その他に、`--to-revision`を指定することにより特定のリビジョンにロールバックできます。

    ```shell
    kubectl rollout undo deployment.v1.apps/nginx-deployment --to-revision=2
    ```

    実行結果は以下のとおりです。
    ```
    deployment.apps/nginx-deployment rolled back
    ```

    ロールアウトに関連したコマンドのさらなる情報は[`kubectl rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout)を参照してください。

    Deploymentが過去の安定したリビジョンにロールバックされました。Deploymentコントローラーによって、リビジョン番号2にロールバックする`DeploymentRollback`イベントが作成されたのを確認できます。

2. ロールバックが成功し、Deploymentが正常に稼働していることを確認するために、以下のコマンドを実行してください。
    ```shell
    kubectl get deployment nginx-deployment
    ```

    実行結果は以下のとおりです。
    ```
    NAME               READY   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   3/3     3            3           30m
    ```
3. Deploymentの詳細情報を取得します。
    ```shell
    kubectl describe deployment nginx-deployment
    ```
    実行結果は以下のとおりです。
    ```
    Name:                   nginx-deployment
    Namespace:              default
    CreationTimestamp:      Sun, 02 Sep 2018 18:17:55 -0500
    Labels:                 app=nginx
    Annotations:            deployment.kubernetes.io/revision=4
                            kubernetes.io/change-cause=kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.16.1
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
以下のコマンドを実行させてDeploymentをスケールできます。

```shell
kubectl scale deployment.v1.apps/nginx-deployment --replicas=10
```

実行結果は以下のとおりです。
```
deployment.apps/nginx-deployment scaled
```

クラスター内で[水平Podオートスケーラー](/ja/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)が有効になっていると仮定します。ここでDeploymentのオートスケーラーを設定し、稼働しているPodのCPU使用量に基づいて、稼働させたいPodのレプリカ数の最小値と最大値を設定できます。

```shell
kubectl autoscale deployment.v1.apps/nginx-deployment --min=10 --max=15 --cpu-percent=80
```
実行結果は以下のとおりです。
```
deployment.apps/nginx-deployment scaled
```

### 比例スケーリング

Deploymentのローリングアップデートは、同時に複数のバージョンのアプリケーションの稼働をサポートします。ユーザーやオートスケーラーがローリングアップデートをロールアウト中(更新中もしくは一時停止中)のDeploymentに対して行うと、Deploymentコントローラーはリスクを削減するために既存のアクティブなReplicaSetのレプリカのバランシングを行います。これを*比例スケーリング* と呼びます。

レプリカ数が10、[maxSurge](#max-surge)=3、[maxUnavailable](#max-unavailable)=2であるDeploymentが稼働している例です。

* Deployment内で10のレプリカが稼働していることを確認します。
  ```shell
  kubectl get deploy
  ```
  実行結果は以下のとおりです。

  ```
  NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment     10        10        10           10          50s
  ```

* クラスター内で、解決できない新しいイメージに更新します。
    ```shell
    kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:sometag
    ```

    実行結果は以下のとおりです。
    ```
    deployment.apps/nginx-deployment image updated
    ```

* イメージの更新は新しいReplicaSet nginx-deployment-1989198191へのロールアウトを開始させます。しかしロールアウトは、上述した`maxUnavailable`の要求によりブロックされます。ここでロールアウトのステータスを確認します。
    ```shell
    kubectl get rs
    ```

    実行結果は以下のとおりです。
    ```
    NAME                          DESIRED   CURRENT   READY     AGE
    nginx-deployment-1989198191   5         5         0         9s
    nginx-deployment-618515232    8         8         8         1m
    ```

* 次にDeploymentのスケーリングをするための新しい要求が発生します。オートスケーラーはDeploymentのレプリカ数を15に増やします。Deploymentコントローラーは新しい5つのレプリカをどこに追加するか決める必要がでてきます。比例スケーリングを使用していない場合、5つのレプリカは全て新しいReplicaSetに追加されます。比例スケーリングでは、追加されるレプリカは全てのReplicaSetに分散されます。比例割合が大きいものはレプリカ数の大きいReplicaSetとなり、比例割合が低いときはレプリカ数の小さいReplicaSetとなります。残っているレプリカはもっとも大きいレプリカ数を持つReplicaSetに追加されます。レプリカ数が0のReplicaSetはスケールアップされません。

上記の例では、3つのレプリカが古いReplicaSetに追加され、2つのレプリカが新しいReplicaSetに追加されました。ロールアウトの処理では、新しいレプリカ数のPodが正常になったと仮定すると、最終的に新しいReplicaSetに全てのレプリカを移動させます。これを確認するためには以下のコマンドを実行して下さい。

```shell
kubectl get deploy
```

実行結果は以下のとおりです。
```
NAME                 DESIRED   CURRENT   UP-TO-DATE  AVAILABLE   AGE
nginx-deployment     15        18        7           8           7m
```
ロールアウトのステータスでレプリカがどのように各ReplicaSetに追加されるか確認できます。
```shell
kubectl get rs
```

実行結果は以下のとおりです。
```
NAME                          DESIRED   CURRENT  READY     AGE
nginx-deployment-1989198191   7         7        0         7m
nginx-deployment-618515232    11        11       11        7m
```

## Deployment更新の一時停止と再開 {#pausing-and-resuming-a-deployment}

ユーザーは1つ以上の更新処理をトリガーする前に更新の一時停止と再開ができます。これにより、不必要なロールアウトを実行することなく一時停止と再開を行う間に複数の修正を反映できます。

* 例えば、作成直後のDeploymentを考えます。
  Deploymentの詳細情報を確認します。
  ```shell
  kubectl get deploy
  ```
  実行結果は以下のとおりです。
  ```
  NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx     3         3         3            3           1m
  ```
  ロールアウトのステータスを確認します。
  ```shell
  kubectl get rs
  ```
  実行結果は以下のとおりです。
  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         1m
  ```

* 以下のコマンドを実行して更新処理の一時停止を行います。
    ```shell
    kubectl rollout pause deployment.v1.apps/nginx-deployment
    ```

    実行結果は以下のとおりです。
    ```
    deployment.apps/nginx-deployment paused
    ```

* 次にDeploymentのイメージを更新します。
    ```shell
    kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.16.1
    ```

    実行結果は以下のとおりです。
    ```
    deployment.apps/nginx-deployment image updated
    ```

* 新しいロールアウトが開始されていないことを確認します。
    ```shell
    kubectl rollout history deployment.v1.apps/nginx-deployment
    ```

    実行結果は以下のとおりです。
    ```
    deployments "nginx"
    REVISION  CHANGE-CAUSE
    1   <none>
    ```
* Deploymentの更新に成功したことを確認するためにロールアウトのステータスを確認します。
    ```shell
    kubectl get rs
    ```
    実行結果は以下のとおりです。
    ```
    NAME               DESIRED   CURRENT   READY     AGE
    nginx-2142116321   3         3         3         2m
    ```

* 更新は何度でも実行できます。例えば、Deploymentが使用するリソースを更新します。
    ```shell
    kubectl set resources deployment.v1.apps/nginx-deployment -c=nginx --limits=cpu=200m,memory=512Mi
    ```

    実行結果は以下のとおりです。
    ```
    deployment.apps/nginx-deployment resource requirements updated
    ```
    一時停止する前の初期状態では更新処理は機能しますが、Deploymentが一時停止されている間は新しい更新処理は反映されません。

* 最後に、Deploymentの稼働を再開させ、新しいReplicaSetが更新内容を全て反映させているのを確認します。
    ```shell
    kubectl rollout resume deployment.v1.apps/nginx-deployment
    ```
    実行結果は以下のとおりです。
    ```
    deployment.apps/nginx-deployment resumed
    ```
* 更新処理が完了するまでロールアウトのステータスを確認します。
    ```shell
    kubectl get rs -w
    ```
    実行結果は以下のとおりです。
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
* 最新のロールアウトのステータスを確認します。
    ```shell
    kubectl get rs
    ```

    実行結果は以下のとおりです。
    ```
    NAME               DESIRED   CURRENT   READY     AGE
    nginx-2142116321   0         0         0         2m
    nginx-3926361531   3         3         3         28s
    ```
{{< note >}}
Deploymentの稼働を再開させない限り、一時停止したDeploymentをロールバックすることはできません。
{{< /note >}}

## Deploymentのステータス {#deployment-status}

Deploymentは、そのライフサイクルの間に様々な状態に遷移します。新しいReplicaSetへのロールアウト中は[進行中](#progressing-deployment)になり、その後は[完了](#complete-deployment)し、また[失敗](#failed-deployment)にもなります。

### Deploymentの更新処理 {#progressing-deployment}

以下のタスクが実行中のとき、KubernetesはDeploymentの状態を _進行中_ にします。

* Deploymentが新しいReplicaSetを作成します。
* Deploymentが新しいReplicaSetをスケールアップさせています。
* Deploymentが古いReplicaSetをスケールダウンさせています。
* 新しいPodが準備中もしくは利用可能な状態になります(少なくとも[MinReadySeconds](#min-ready-seconds)の間は準備中になります)。

`kubectl rollout status`を実行すると、Deploymentの進行状態を確認できます。

### Deploymentの更新処理の完了 {#complete-deployment}

Deploymentが以下の状態になったとき、KubernetesはDeploymentのステータスを _完了_ にします。

* Deploymentの全てのレプリカが、指定された最新のバージョンに更新されます。これは指定した更新処理が完了したことを意味します。
* Deploymentの全てのレプリカが利用可能になります。
* Deploymentの古いレプリカが1つも稼働していません。

`kubectl rollout status`を実行して、Deploymentの更新が完了したことを確認できます。ロールアウトが正常に完了すると`kubectl rollout status`の終了コードが0で返されます。

```shell
kubectl rollout status deployment.v1.apps/nginx-deployment
```
実行結果は以下のとおりです。
```
Waiting for rollout to finish: 2 of 3 updated replicas are available...
deployment "nginx-deployment" successfully rolled out
```
そして`kubectl rollout`の終了ステータスが0となります（成功です）:
```shell
echo $?
```
```
0
```

### Deploymentの更新処理の失敗 {#failed-deployment}

新しいReplicaSetのデプロイが完了せず、更新処理が止まる場合があります。これは主に以下の要因によるものです。

* 不十分なリソースの割り当て
* ReadinessProbeの失敗
* コンテナイメージの取得ができない
* 不十分なパーミッション
* リソースリミットのレンジ
* アプリケーションランタイムの設定の不備

このような状況を検知する1つの方法として、Deploymentのリソース定義でデッドラインのパラメーターを指定します([`.spec.progressDeadlineSeconds`](#progress-deadline-seconds))。`.spec.progressDeadlineSeconds`はDeploymentの更新が停止したことを示す前にDeploymentコントローラーが待つ秒数を示します。

以下の`kubectl`コマンドでリソース定義に`progressDeadlineSeconds`を設定します。これはDeploymentの更新が止まってから10分後に、コントローラーが失敗を通知させるためです。

```shell
kubectl patch deployment.v1.apps/nginx-deployment -p '{"spec":{"progressDeadlineSeconds":600}}'
```
実行結果は以下のとおりです。
```
deployment.apps/nginx-deployment patched
```
一度デッドラインを超過すると、DeploymentコントローラーはDeploymentの`.status.conditions`に以下のDeploymentConditionを追加します。

* Type=Progressing
* Status=False
* Reason=ProgressDeadlineExceeded

ステータスの状態に関するさらなる情報は[Kubernetes APIの規則](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties)を参照してください。

{{< note >}}
Kubernetesは停止状態のDeploymentに対して、ステータス状態を報告する以外のアクションを実行しません。高レベルのオーケストレーターはこれを利用して、状態に応じて行動できます。例えば、前のバージョンへのDeploymentのロールバックが挙げられます。
{{< /note >}}

{{< note >}}
Deploymentを停止すると、Kubernetesは指定したデッドラインを超えたかどうかチェックしません。
ロールアウトの途中でもDeploymentを安全に一時停止でき、デッドラインを超えたイベントをトリガーすることなく再開できます。
{{< /note >}}

設定したタイムアウトの秒数が小さかったり、一時的なエラーとして扱える他の種類のエラーが原因となり、Deploymentで一時的なエラーが出る場合があります。例えば、リソースの割り当てが不十分な場合を考えます。Deploymentの詳細情報を確認すると、以下のセクションが表示されます。

```shell
kubectl describe deployment nginx-deployment
```
実行結果は以下のとおりです。
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

`kubectl get deployment nginx-deployment -o yaml`を実行すると、Deploymentのステータスは以下のようになります。

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

最後に、一度Deploymentの更新処理のデッドラインを越えると、KubernetesはDeploymentのステータスと進行中の状態を更新します。

```
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     False   ProgressDeadlineExceeded
  ReplicaFailure  True    FailedCreate
```

Deploymentか他のリソースコントローラーのスケールダウンを行うか、使用している名前空間内でリソースの割り当てを増やすことで、リソースの割り当て不足の問題に対処できます。割り当て条件を満たすと、DeploymentコントローラーはDeploymentのロールアウトを完了させ、Deploymentのステータスが成功状態になるのを確認できます(`Status=True`と`Reason=NewReplicaSetAvailable`)。

```
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
```

`Status=True`の`Type=Available`は、Deploymentが最小可用性の状態であることを意味します。最小可用性は、Deploymentの更新戦略において指定されているパラメーターにより決定されます。`Status=True`の`Type=Progressing`は、Deploymentのロールアウトの途中で、更新処理が進行中であるか、更新処理が完了し、必要な最小数のレプリカが利用可能であることを意味します(各TypeのReason項目を確認してください。このケースでは、`Reason=NewReplicaSetAvailable`はDeploymentの更新が完了したことを意味します)。

`kubectl rollout status`を実行してDeploymentが更新に失敗したかどうかを確認できます。`kubectl rollout status`はDeploymentが更新処理のデッドラインを超えたときに0以外の終了コードを返します。

```shell
kubectl rollout status deployment.v1.apps/nginx-deployment
```
実行結果は以下のとおりです。
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

### 失敗したDeploymentの操作

更新完了したDeploymentに適用した全てのアクションは、更新失敗したDeploymentに対しても適用されます。スケールアップ、スケールダウンができ、前のリビジョンへのロールバックや、Deploymentのテンプレートに複数の更新を適用させる必要があるときは一時停止もできます。

## 古いリビジョンのクリーンアップポリシー {#clean-up-policy}

Deploymentが管理する古いReplicaSetをいくつ保持するかを指定するために、`.spec.revisionHistoryLimit`フィールドを設定できます。この値を超えた古いReplicaSetはバックグラウンドでガーベージコレクションの対象となって削除されます。デフォルトではこの値は10です。

{{< note >}}
このフィールドを明示的に0に設定すると、Deploymentの全ての履歴を削除します。従って、Deploymentはロールバックできません。
{{< /note >}}

## カナリアパターンによるデプロイ

Deploymentを使って一部のユーザーやサーバーに対してリリースのロールアウトをしたい場合、[リソースの管理](/ja/docs/concepts/cluster-administration/manage-deployment/#canary-deployments-カナリアデプロイ)に記載されているカナリアパターンに従って、リリース毎に1つずつ、複数のDeploymentを作成できます。

## Deployment Specの記述

他の全てのKubernetesの設定と同様に、Deploymentは`.apiVersion`、`.kind`や`.metadata`フィールドを必要とします。
設定ファイルの利用に関する情報は[アプリケーションのデプロイ](/ja/docs/tasks/run-application/run-stateless-application-deployment/)を参照してください。コンテナの設定に関しては[リソースを管理するためのkubectlの使用](/ja/docs/concepts/overview/working-with-objects/object-management/)を参照してください。
Deploymentオブジェクトの名前は、有効な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)でなければなりません。
Deploymentは[`.spec`セクション](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)も必要とします。

### Podテンプレート

`.spec.template`と`.spec.selector`は`.spec`における必須のフィールドです。

`.spec.template`は[Podテンプレート](/ja/docs/concepts/workloads/pods/#pod-templates)です。これは.spec内でネストされていないことと、`apiVersion`や`kind`を持たないことを除いては{{< glossary_tooltip text="Pod" term_id="pod" >}}と同じスキーマとなります。

Podの必須フィールドに加えて、Deployment内のPodテンプレートでは適切なラベルと再起動ポリシーを設定しなくてはなりません。ラベルは他のコントローラーと重複しないようにしてください。ラベルについては、[セレクター](#selector)を参照してください。

[`.spec.template.spec.restartPolicy`](/ja/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)が`Always`に等しいときのみ許可されます。これはテンプレートで指定されていない場合のデフォルト値です。

### レプリカ数

`.spec.replias`は理想的なPodの数を指定するオプションのフィールドです。デフォルトは1です。

### セレクター {#selector}

`.spec.selector`は必須フィールドで、Deploymentによって対象とされるPodの[ラベルセレクター](/ja/docs/concepts/overview/working-with-objects/labels/)を指定します。

`.spec.selector`は`.spec.template.metadata.labels`と一致している必要があり、一致しない場合はAPIによって拒否されます。

`apps/v1`バージョンにおいて、`.spec.selector`と`.metadata.labels`が指定されていない場合、`.spec.template.metadata.labels`の値に初期化されません。そのため`.spec.selector`と`.metadata.labels`を明示的に指定する必要があります。また`apps/v1`のDeploymentにおいて`.spec.selector`は作成後に不変になります。

Deploymentのテンプレートが`.spec.template`と異なる場合や、`.spec.replicas`の値を超えてPodが稼働している場合、Deploymentはセレクターに一致するラベルを持つPodを削除します。Podの数が理想状態より少ない場合Deploymentは`.spec.template`をもとに新しいPodを作成します。

{{< note >}}
Deploymentのセレクターに一致するラベルを持つPodを直接作成したり、他のDeploymentやReplicaSetやReplicationControllerによって作成するべきではありません。作成してしまうと、最初のDeploymentがラベルに一致する新しいPodを作成したとみなされます。こうなったとしても、Kubernetesは処理を止めません。
{{< /note >}}

セレクターが重複する複数のコントローラーを持つとき、そのコントローラーは互いに競合状態となり、正しくふるまいません。

### 更新戦略

`.spec.strategy`は古いPodから新しいPodに置き換える際の更新戦略を指定します。`.spec.strategy.type`は"Recreate"もしくは"RollingUpdate"を指定できます。デフォルトは"RollingUpdate"です。

#### Deploymentの再作成

`.spec.strategy.type==Recreate`と指定されているとき、既存の全てのPodは新しいPodが作成される前に削除されます。

{{< note >}}
これは更新のための作成の前にPodを停止する事を保証するだけです。Deploymentを更新する場合、古いリビジョンのPodは全てすぐに停止されます。削除に成功するまでは、新しいリビジョンのPodは作成されません。手動でPodを削除すると、ライフサイクルがReplicaSetに制御されているのですぐに置き換えが実施されます（たとえ古いPodがまだ停止中のステータスでも）。Podに"高々この程度の"保証を求めるならば[StatefulSet](/ja/docs/concepts/workloads/controllers/statefulset/)の使用を検討してください。
{{< /note >}}

#### Deploymentのローリングアップデート

`.spec.strategy.type==RollingUpdate`と指定されているとき、DeploymentはローリングアップデートによりPodを更新します。ローリングアップデートの処理をコントロールするために`maxUnavailable`と`maxSurge`を指定できます。

##### Max Unavailable {#max-unavailable}

`.spec.strategy.rollingUpdate.maxUnavailable`はオプションのフィールドで、更新処理において利用不可となる最大のPod数を指定します。値は絶対値(例: 5)を指定するか、理想状態のPodのパーセンテージを指定します(例: 10%)。パーセンテージを指定した場合、絶対値は小数切り捨てされて計算されます。`.spec.strategy.rollingUpdate.maxSurge`が0に指定されている場合、この値を0にできません。デフォルトでは25%です。

例えば、この値が30%と指定されているとき、ローリングアップデートが開始すると古いReplicaSetはすぐに理想状態の70%にスケールダウンされます。一度新しいPodが稼働できる状態になると、古いReplicaSetはさらにスケールダウンされ、続いて新しいReplicaSetがスケールアップされます。この間、利用可能なPodの総数は理想状態のPodの少なくとも70%以上になるように保証されます。

##### Max Surge {#max-surge}

`.spec.strategy.rollingUpdate.maxSurge`はオプションのフィールドで、理想状態のPod数を超えて作成できる最大のPod数を指定します。値は絶対値(例: 5)を指定するか、理想状態のPodのパーセンテージを指定します(例: 10%)。パーセンテージを指定した場合、絶対値は小数切り上げで計算されます。`MaxUnavailable`が0に指定されている場合、この値を0にできません。デフォルトでは25%です。

例えば、この値が30%と指定されているとき、ローリングアップデートが開始すると新しいReplicaSetはすぐに更新されます。このとき古いPodと新しいPodの総数は理想状態の130%を超えないように更新されます。一度古いPodが削除されると、新しいReplicaSetはさらにスケールアップされます。この間、利用可能なPodの総数は理想状態のPodに対して最大130%になるように保証されます。

### Progress Deadline Seconds

`.spec.progressDeadlineSeconds`はオプションのフィールドで、システムがDeploymentの[更新に失敗](#failed-deployment)したと判断するまでに待つ秒数を指定します。更新に失敗したと判断されたとき、リソースのステータスは`Type=Progressing`、`Status=False`かつ`Reason=ProgressDeadlineExceeded`となるのを確認できます。DeploymentコントローラーはDeploymentの更新のリトライし続けます。デフォルト値は600です。今後、自動的なロールバックが実装されたとき、更新失敗状態になるとすぐにDeploymentコントローラーがロールバックを行うようになります。

この値が指定されているとき、`.spec.minReadySeconds`より大きい値を指定する必要があります。

### Min Ready Seconds {#min-ready-seconds}

`.spec.minReadySeconds`はオプションのフィールドで、新しく作成されたPodが利用可能となるために、最低どれくらいの秒数コンテナがクラッシュすることなく稼働し続ければよいかを指定するものです。デフォルトでは0です(Podは作成されるとすぐに利用可能と判断されます)。Podが利用可能と判断された場合についてさらに学ぶために[Container Probes](/ja/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)を参照してください。

### リビジョン履歴の保持上限

Deploymentのリビジョン履歴は、Deploymentが管理するReplicaSetに保持されています。

`.spec.revisionHistoryLimit`はオプションのフィールドで、ロールバック可能な古いReplicaSetの数を指定します。この古いReplicaSetは`etcd`内のリソースを消費し、`kubectl get rs`の出力結果を見にくくします。Deploymentの各リビジョンの設定はReplicaSetに保持されます。このため一度古いReplicaSetが削除されると、そのリビジョンのDeploymentにロールバックすることができなくなります。デフォルトでは10もの古いReplicaSetが保持されます。しかし、この値の最適値は新しいDeploymentの更新頻度と安定性に依存します。

さらに詳しく言うと、この値を0にすると、0のレプリカを持つ古い全てのReplicaSetが削除されます。このケースでは、リビジョン履歴が完全に削除されているため新しいDeploymentのロールアウトを元に戻すことができません。

### paused

`.spec.paused`はオプションのboolean値で、Deploymentの一時停止と再開のための値です。一時停止されているものと、そうでないものとの違いは、一時停止されているDeploymentはPodTemplateSpecのいかなる変更があってもロールアウトがトリガーされないことです。デフォルトではDeploymentは一時停止していない状態で作成されます。
