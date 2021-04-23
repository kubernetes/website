---
title: ConfigMap
content_type: concept
weight: 20
---

<!-- overview -->

{{< glossary_definition term_id="configmap" prepend="ConfigMapは、" length="all" >}}

{{< caution >}}
ConfigMapは機密性や暗号化を提供しません。保存したいデータが機密情報である場合は、ConfigMapの代わりに{{< glossary_tooltip text="Secret" term_id="secret" >}}を使用するか、追加の(サードパーティー)ツールを使用してデータが非公開になるようにしてください。
{{< /caution >}}

<!-- body -->

## 動機

アプリケーションのコードとは別に設定データを設定するには、ConfigMapを使用します。

たとえば、アプリケーションを開発していて、(開発用時には)自分のコンピューター上と、(実際のトラフィックをハンドルするときは)クラウド上とで実行することを想像してみてください。あなたは、`DATABASE_HOST`という名前の環境変数を使用するコードを書きます。ローカルでは、この変数を`localhost`に設定します。クラウド上では、データベースコンポーネントをクラスター内に公開するKubernetesの{{< glossary_tooltip text="Service" term_id="service" >}}を指すように設定します。

こうすることで、必要であればクラウド上で実行しているコンテナイメージを取得することで、ローカルでも完全に同じコードを使ってデバッグができるようになります。

ConfigMapは、大量のデータを保持するようには設計されていません。ConfigMapに保存されるデータは1MiBを超えることはできません。この制限を超える設定を保存する必要がある場合は、ボリュームのマウントを検討するか、別のデータベースまたはファイルサービスを使用することを検討してください。

## ConfigMapオブジェクト

ConfigMapは、他のオブジェクトが使うための設定を保存できるAPI[オブジェクト](/ja/docs/concepts/overview/working-with-objects/kubernetes-objects/)です。ほとんどのKubernetesオブジェクトに`spec`セクションがあるのとは違い、ConfigMapには`data`および`binaryData`フィールドがあります。これらのフィールドは、キーとバリューのペアを値として受け入れます。`data`フィールドと` binaryData`フィールドはどちらもオプションです。`data`フィールドはUTF-8バイトシーケンスを含むように設計されていますが、` binaryData`フィールドはバイナリデータを含むように設計されています。

ConfigMapの名前は、有効な[DNSのサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)でなければなりません。

`data`または`binaryData`フィールドの各キーは、英数字、`-`、`_`、または`.`で構成されている必要があります。`data`に格納されているキーは、`binaryData`フィールドのキーと重複することはできません。

v1.19以降、ConfigMapの定義に`immutable`フィールドを追加して、[イミュータブルなConfigMap](#configmap-immutable)を作成できます。

## ConfigMapとPod

ConfigMapを参照して、ConfigMap内のデータを元にしてPod内のコンテナの設定をするPodの`spec`を書くことができます。このとき、PodとConfigMapは同じ{{< glossary_tooltip text="名前空間" term_id="namespace" >}}内に存在する必要があります。

以下に、ConfigMapの例を示します。単一の値を持つキーと、Configuration形式のデータ片のような値を持つキーがあります。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
data:
  # プロパティーに似たキー。各キーは単純な値にマッピングされている
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"

  # ファイルに似たキー
  game.properties: |
    enemy.types=aliens,monsters
    player.maximum-lives=5
  user-interface.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
```

ConfigMapを利用してPod内のコンテナを設定する方法には、次の4種類があります。

1. コンテナ内のコマンドと引数
1. 環境変数をコンテナに渡す
1. 読み取り専用のボリューム内にファイルを追加し、アプリケーションがそのファイルを読み取る
1. Kubernetes APIを使用してConfigMapを読み込むコードを書き、そのコードをPod内で実行する

これらのさまざまな方法は、利用するデータをモデル化するのに役立ちます。最初の3つの方法では、{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}がPodのコンテナを起動する時にConfigMapのデータを使用します。

4番目の方法では、ConfigMapとそのデータを読み込むためのコードを自分自身で書く必要があります。しかし、Kubernetes APIを直接使用するため、アプリケーションはConfigMapがいつ変更されても更新イベントを受信でき、変更が発生したときにすぐに反応できます。この手法では、Kubernetes APIに直接アクセスすることで、別の名前空間にあるConfigMapにもアクセスできます。

以下に、Podを設定するために`game-demo`から値を使用するPodの例を示します。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-demo-pod
spec:
  containers:
    - name: demo
      image: alpine
      command: ["sleep", "3600"]
      env:
        # 環境変数を定義します。
        - name: PLAYER_INITIAL_LIVES # ここではConfigMap内のキーの名前とは違い
                                     # 大文字が使われていることに着目してください。
          valueFrom:
            configMapKeyRef:
              name: game-demo           # この値を取得するConfigMap。
              key: player_initial_lives # 取得するキー。
        - name: UI_PROPERTIES_FILE_NAME
          valueFrom:
            configMapKeyRef:
              name: game-demo
              key: ui_properties_file_name
      volumeMounts:
      - name: config
        mountPath: "/config"
        readOnly: true
  volumes:
    # Podレベルでボリュームを設定し、Pod内のコンテナにマウントします。
    - name: config
      configMap:
        # マウントしたいConfigMapの名前を指定します。
        name: game-demo
        # ファイルとして作成するConfigMapのキーの配列
        items:
        - key: "game.properties"
          path: "game.properties"
        - key: "user-interface.properties"
          path: "user-interface.properties"
```

ConfigMapは1行のプロパティの値と複数行のファイルに似た形式の値を区別しません。問題となるのは、Podや他のオブジェクトによる値の使用方法です。

この例では、ボリュームを定義して、`demo`コンテナの内部で`/config`にマウントしています。これにより、ConfigMap内には4つのキーがあるにもかかわらず、2つのファイル`/config/game.properties`および`/config/user-interface.properties`だけが作成されます。

これは、Podの定義が`volumes`セクションで`items`という配列を指定しているためです。もし`items`の配列を完全に省略すれば、ConfigMap内の各キーがキーと同じ名前のファイルになり、4つのファイルが作成されます。

## ConfigMapを使う

ConfigMapは、データボリュームとしてマウントできます。ConfigMapは、Podへ直接公開せずにシステムの他の部品として使うこともできます。たとえば、ConfigMapには、システムの他の一部が設定のために使用するデータを保存できます。

ConfigMapの最も一般的な使い方では、同じ名前空間にあるPod内で実行されているコンテナに設定を構成します。ConfigMapを独立して使用することもできます。

たとえば、ConfigMapに基づいて動作を調整する{{< glossary_tooltip text="アドオン" term_id="addons" >}}や{{< glossary_tooltip text="オペレーター" term_id="operator-pattern" >}}を見かけることがあるかもしれません。

### ConfigMapをPodからファイルとして使う

ConfigMapをPod内のボリュームで使用するには、次のようにします。

1. ConfigMapを作成するか、既存のConfigMapを使用します。複数のPodから同じConfigMapを参照することもできます。
1. Podの定義を修正して、`.spec.volumes[]`以下にボリュームを追加します。ボリュームに任意の名前を付け、`.spec.volumes[].configMap.name`フィールドにConfigMapオブジェクトへの参照を設定します。
1. ConfigMapが必要な各コンテナに`.spec.containers[].volumeMounts[]`を追加します。`.spec.containers[].volumeMounts[].readOnly = true`を指定して、`.spec.containers[].volumeMounts[].mountPath`には、ConfigMapのデータを表示したい未使用のディレクトリ名を指定します。
1. イメージまたはコマンドラインを修正して、プログラムがそのディレクトリ内のファイルを読み込むように設定します。ConfigMapの`data`マップ内の各キーが、`mountPath`以下のファイル名になります。

以下は、ボリューム内にConfigMapをマウントするPodの例です。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    configMap:
      name: myconfigmap
```

使用したいそれぞれのConfigMapごとに、`.spec.volumes`内で参照する必要があります。

Pod内に複数のコンテナが存在する場合、各コンテナにそれぞれ別の`volumeMounts`のブロックが必要ですが、`.spec.volumes`はConfigMapごとに1つしか必要ありません。

#### マウントしたConfigMapの自動的な更新

ボリューム内で現在使用中のConfigMapが更新されると、射影されたキーも最終的に(eventually)更新されます。kubeletは定期的な同期のたびにマウントされたConfigMapが新しいかどうか確認します。しかし、kubeletが現在のConfigMapの値を取得するときにはローカルキャッシュを使用します。キャッシュの種類は、[KubeletConfiguration構造体](https://github.com/kubernetes/kubernetes/blob/{{< param "docsbranch" >}}/staging/src/k8s.io/kubelet/config/v1beta1/types.go)の中の`ConfigMapAndSecretChangeDetectionStrategy`フィールドで設定可能です。ConfigMapは、監視(デフォルト)、ttlベース、またはすべてのリクエストを直接APIサーバーへ単純にリダイレクトする方法のいずれかによって伝搬されます。その結果、ConfigMapが更新された瞬間から、新しいキーがPodに射影されるまでの遅延の合計は、最長でkubeletの同期期間+キャッシュの伝搬遅延になります。ここで、キャッシュの伝搬遅延は選択したキャッシュの種類に依存します(監視の伝搬遅延、キャッシュのttl、または0に等しくなります)。

環境変数として使用されるConfigMapは自動的に更新されないため、ポッドを再起動する必要があります。
## イミュータブルなConfigMap {#configmap-immutable}

{{< feature-state for_k8s_version="v1.19" state="beta" >}}

Kubernetesのベータ版の機能である _イミュータブルなSecretおよびConfigMap_ は、個別のSecretやConfigMapをイミュータブルに設定するオプションを提供します。ConfigMapを広範に使用している(少なくとも数万のConfigMapがPodにマウントされている)クラスターでは、データの変更を防ぐことにより、以下のような利点が得られます。

- アプリケーションの停止を引き起こす可能性のある予想外の(または望まない)変更を防ぐことができる
- ConfigMapをイミュータブルにマークして監視を停止することにより、kube-apiserverへの負荷を大幅に削減し、クラスターの性能が向上する

この機能は、`ImmutableEmphemeralVolumes`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)によって管理されます。`immutable`フィールドを`true`に設定することで、イミュータブルなConfigMapを作成できます。次に例を示します。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  ...
data:
  ...
immutable: true
```

一度ConfigMapがイミュータブルに設定されると、この変更を元に戻したり、`data`または`binaryData`フィールドのコンテンツを変更することは*できません*。ConfigMapの削除と再作成のみ可能です。既存のPodは削除されたConfigMapのマウントポイントを保持するため、こうしたPodは再作成することをおすすめします。

## {{% heading "whatsnext" %}}

* [Secret](/docs/concepts/configuration/secret/)について読む。
* [Podを構成してConfigMapを使用する](/ja/docs/tasks/configure-pod-container/configure-pod-configmap/)を読む。
* コードを設定から分離する動機を理解するために[The Twelve-Factor App](https://12factor.net/ja/)を読む。
