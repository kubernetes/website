---
title: Podを構成してConfigMapを使用する
content_type: task
weight: 150
card:
  name: tasks
  weight: 50
---

<!-- overview -->
ConfigMapを使用すると、設定をイメージのコンテンツから切り離して、コンテナ化されたアプリケーションの移植性を維持できます。このページでは、ConfigMapを作成し、ConfigMapに保存されているデータを使用してPodを構成する一連の使用例を示します。


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->


## ConfigMapを作成する
`kubectl create configmap`または`kustomization.yaml`のConfigMap generatorを使用すると、ConfigMapを作成できます。`kubectl`が`kustomization.yaml`をサポートをしているのは1.14からである点に注意してください。

### kubectl create configmapを使用してConfigMapを作成する

`kubectl create configmap`を使用してConfigMapを[ディレクトリ](#create-configmaps-from-directories)、[ファイル](#create-configmaps-from-files)、または[リテラル値](#create-configmaps-from-literal-values)から作成します:

```shell
kubectl create configmap <map-name> <data-source>
```

\<map-name>の部分はConfigMapに割り当てる名前で、\<data-source>はデータを取得するディレクトリ、ファイル、またはリテラル値です。ConfigMapの名前は有効な[DNSサブドメイン名](/ja/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names)である必要があります。

ファイルをベースにConfigMapを作成する場合、\<data-source> のキーはデフォルトでファイル名になり、値はデフォルトでファイルの中身になります。

[`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe)または
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get)を使用すると、ConfigMapに関する情報を取得できます。

#### ディレクトリからConfigMapを作成する{#create-configmaps-from-directories}

`kubectl create configmap`を使用すると、同一ディレクトリ内にある複数のファイルから1つのConfigMapを作成できます。ディレクトリをベースにConfigMapを作成する場合、kubectlはディレクトリ内でベース名が有効なキーであるファイルを識別し、それらのファイルを新たなConfigMapにパッケージ化します。ディレクトリ内にある通常のファイルでないものは無視されます(例: サブディレクトリ、シンボリックリンク、デバイス、パイプなど)。

例えば:

```shell
# ローカルディレクトリを作成します
mkdir -p configure-pod-container/configmap/

# `configure-pod-container/configmap/`ディレクトリにサンプルファイルをダウンロードします
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-container/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties

# ConfigMapを作成します
kubectl create configmap game-config --from-file=configure-pod-container/configmap/
```

上記のコマンドは各ファイルをパッケージ化します。この場合、`configure-pod-container/configmap/` ディレクトリの`game.properties` と `ui.properties`をgame-config ConfigMapにパッケージ化します。 以下のコマンドを使用すると、ConfigMapの詳細を表示できます:

```shell
kubectl describe configmaps game-config
```

出力結果は以下のようになります:
```
Name:         game-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
ui.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```

`configure-pod-container/configmap/` ディレクトリの`game.properties` と `ui.properties` ファイルはConfigMapの`data`セクションに表示されます。

```shell
kubectl get configmaps game-config -o yaml
```
出力結果は以下のようになります:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T18:52:05Z
  name: game-config
  namespace: default
  resourceVersion: "516"
  uid: b4952dc3-d670-11e5-8cd0-68f728db1985
data:
  game.properties: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
  ui.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
    how.nice.to.look=fairlyNice
```

#### ファイルからConfigMapを作成する{#create-configmaps-from-files}

`kubectl create configmap`を使用して、個別のファイルまたは複数のファイルからConfigMapを作成できます。

例えば、

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties
```

は、以下のConfigMapを生成します:

```shell
kubectl describe configmaps game-config-2
```

出力結果は以下のようになります:

```
Name:         game-config-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
```

`--from-file`引数を複数回渡し、ConfigMapを複数のデータソースから作成できます。

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties --from-file=configure-pod-container/configmap/ui.properties
```

以下のコマンドを使用すると、ConfigMap`game-config-2`の詳細を表示できます:

```shell
kubectl describe configmaps game-config-2
```

出力結果は以下のようになります:

```
Name:         game-config-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
ui.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```

`--from-env-file`オプションを利用してConfigMapをenv-fileから作成します。例えば:

```shell
# Env-filesは環境編集のリストを含んでいます。
# 以下のシンタックスルールが適用されます:
#   envファイルの各行はVAR=VALの形式である必要がある。
#   #で始まる行 (例えばコメント)は無視される。
#   空の行は無視される。
#   クオーテーションマークは特別な扱いは処理をしない(例えばConfigMapの値の一部になる).

# `configure-pod-container/configmap/`ディレクトリにサンプルファイルをダウンロードします
wget https://kubernetes.io/examples/configmap/game-env-file.properties -O configure-pod-container/configmap/game-env-file.properties

# env-file `game-env-file.properties`は以下のようになります
cat configure-pod-container/configmap/game-env-file.properties
enemies=aliens
lives=3
allowed="true"

# このコメントと上記の空の行は無視されます
```

```shell
kubectl create configmap game-config-env-file \
       --from-env-file=configure-pod-container/configmap/game-env-file.properties
```

は、以下のConfigMapを生成します:

```shell
kubectl get configmap game-config-env-file -o yaml
```

出力結果は以下のようになります:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2017-12-27T18:36:28Z
  name: game-config-env-file
  namespace: default
  resourceVersion: "809965"
  uid: d9d1ca5b-eb34-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  enemies: aliens
  lives: "3"
```

{{< caution >}}
`--from-env-file`を複数回渡してConfigMapを複数のデータソースから作成する場合、最後のenv-fileのみが使用されます。
{{< /caution >}}

`--from-env-file`を複数回渡す場合の挙動は以下のように示されます:

```shell
# `configure-pod-container/configmap/`ディレクトリにサンブルファイルをダウンロードします
wget https://kubernetes.io/examples/configmap/ui-env-file.properties -O configure-pod-container/configmap/ui-env-file.properties

# ConfigMapを作成します
kubectl create configmap config-multi-env-files \
        --from-env-file=configure-pod-container/configmap/game-env-file.properties \
        --from-env-file=configure-pod-container/configmap/ui-env-file.properties
```

は、以下のConfigMapを生成します:

```shell
kubectl get configmap config-multi-env-files -o yaml
```

出力結果は以下のようになります:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2017-12-27T18:38:34Z
  name: config-multi-env-files
  namespace: default
  resourceVersion: "810136"
  uid: 252c4572-eb35-11e7-887b-42010a8002b8
data:
  color: purple
  how: fairlyNice
  textmode: "true"
```

#### ファイルからConfigMap作成する場合は使用するキーを定義する

`--from-file`引数を使用する場合、ConfigMapの`data` セクションでキーにファイル名以外を定義できます:

```shell
kubectl create configmap game-config-3 --from-file=<my-key-name>=<path-to-file>
```

`<my-key-name>`の部分はConfigMapで使うキー、`<path-to-file>` はキーで表示したいデータソースファイルの場所です。

例えば:

```shell
kubectl create configmap game-config-3 --from-file=game-special-key=configure-pod-container/configmap/game.properties
```

は、以下のConfigMapを生成します:
```
kubectl get configmaps game-config-3 -o yaml
```

出力結果は以下のようになります:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T18:54:22Z
  name: game-config-3
  namespace: default
  resourceVersion: "530"
  uid: 05f8da22-d671-11e5-8cd0-68f728db1985
data:
  game-special-key: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
```

#### リテラル値からConfigMapを作成する{#create-configmaps-from-literal-values}

`--from-literal`引数を指定して`kubectl create configmap`を使用すると、コマンドラインからリテラル値を定義できます:

```shell
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

複数のキーバリューペアを渡せます。CLIに提供された各ペアは、ConfigMapの`data`セクションで別のエントリーとして表示されます。

```shell
kubectl get configmaps special-config -o yaml
```

出力結果は以下のようになります:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: special-config
  namespace: default
  resourceVersion: "651"
  uid: dadce046-d673-11e5-8cd0-68f728db1985
data:
  special.how: very
  special.type: charm
```

### ジェネレーターからConfigMapを作成する
`kubectl`は`kustomization.yaml`を1.14からサポートしています。
ジェネレーターからConfigMapを作成して適用すると、APIサーバー上でオブジェクトを作成できます。ジェネレーターはディレクトリ内の`kustomization.yaml`で指定する必要があリます。

#### ファイルからConfigMapを生成する
例えば、ファイル`configure-pod-container/configmap/game.properties`からConfigMapを生成するには、
```shell
# ConfigMapGeneratorを含むkustomization.yamlファイルを作成する
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-4
  files:
  - configure-pod-container/configmap/game.properties
EOF
```

ConfigMapを作成するためにkustomizationディレクトリを適用します。
```shell
kubectl apply -k .
configmap/game-config-4-m9dm2f92bt created
```

ConfigMapが作成されたことを以下のようにチェックできます:

```shell
kubectl get configmap
NAME                       DATA   AGE
game-config-4-m9dm2f92bt   1      37s


kubectl describe configmaps/game-config-4-m9dm2f92bt
Name:         game-config-4-m9dm2f92bt
Namespace:    default
Labels:       <none>
Annotations:  kubectl.kubernetes.io/last-applied-configuration:
                {"apiVersion":"v1","data":{"game.properties":"enemies=aliens\nlives=3\nenemies.cheat=true\nenemies.cheat.level=noGoodRotten\nsecret.code.p...

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
Events:  <none>
```

生成されたConfigMapの名前は、コンテンツをハッシュ化したサフィックスを持つことに注意してください。これにより、コンテンツが変更されるたびに新しいConfigMapが生成されます。

#### ファイルからConfigMapを生成する場合に使用するキーを定義する
ConfigMapジェネレーターで使用するキーはファイルの名前以外を定義できます。
例えば、ファイル`configure-pod-container/configmap/game.properties`からキー`game-special-key`を持つConfigMapを作成する場合

```shell
# ConfigMapGeneratorを含むkustomization.yamlファイルを作成する
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-5
  files:
  - game-special-key=configure-pod-container/configmap/game.properties
EOF
```

kustomizationディレクトリを適用してConfigMapを作成します。
```shell
kubectl apply -k .
configmap/game-config-5-m67dt67794 created
```

#### リテラルからConfigMapを作成する
リテラル`special.type=charm`と`special.how=very`からConfigMapを作成する場合は、
以下のように`kustomization.yaml`のConfigMapジェネレーターで指定できます。
```shell
# ConfigMapGeneratorを含むkustomization.yamlファイルを作成します
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: special-config-2
  literals:
  - special.how=very
  - special.type=charm
EOF
```
kustomizationディレクトリを適用してConfigMapを作成します。
```shell
kubectl apply -k .
configmap/special-config-2-c92b5mmcf2 created
```

## ConfigMapデータを使用してコンテナ環境変数を定義する

### 単一のConfigMapのデータを使用してコンテナ環境変数を定義する

1.  ConfigMapに環境変数をキーバリューペアとして定義します:

    ```shell
    kubectl create configmap special-config --from-literal=special.how=very
    ```

2.  ConfigMapに定義された値`special.how`をPod specificationの環境変数`SPECIAL_LEVEL_KEY`に割り当てます。

   {{< codenew file="pods/pod-single-configmap-env-variable.yaml" >}}

   Podを作成します:

 ```shell
 kubectl create -f https://kubernetes.io/examples/pods/pod-single-configmap-env-variable.yaml
 ```

   すると、Podの出力結果に環境変数`SPECIAL_LEVEL_KEY=very`が含まれています。

### 複数のConfigMapのデータを使用してコンテナ環境変数を定義する

 * 先ほどの例の通り、まずはConfigMapを作成します。

   {{< codenew file="configmap/configmaps.yaml" >}}

   ConfigMapを作成します:

 ```shell
 kubectl create -f https://kubernetes.io/examples/configmap/configmaps.yaml
 ```

* Pod specificationの環境変数を定義します

  {{< codenew file="pods/pod-multiple-configmap-env-variable.yaml" >}}

  Podを作成します:

 ```shell
 kubectl create -f https://kubernetes.io/examples/pods/pod-multiple-configmap-env-variable.yaml
 ```
   すると、Podの出力結果に環境変数`SPECIAL_LEVEL_KEY=very` and `LOG_LEVEL=INFO`が含まれています。

## ConfigMapの全てのキーバリューペアをコンテナ環境変数として構成する

{{< note >}}
この機能はKubernetes v1.6以降で利用可能です。
{{< /note >}}

* 複数のキーバリューペアを含むConfigMapを作成します。

  {{< codenew file="configmap/configmap-multikeys.yaml" >}}

  ConfigMapを作成します:

 ```shell
 kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
 ```

* `envFrom`を利用して全てのConfigMapのデータをコンテナ環境変数として定義します。ConfigMapからのキーがPodの環境変数名になります。

 {{< codenew file="pods/pod-configmap-envFrom.yaml" >}}

 Podを作成します:

 ```shell
 kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-envFrom.yaml
 ```

 すると、Podの出力結果は環境変数`SPECIAL_LEVEL=very`と`SPECIAL_TYPE=charm`が含まれています。


## PodのコマンドでConfigMapに定義した環境変数を使用する

ConfigMapに環境変数を定義し、Pod specificationの`command` セクションで`$(VAR_NAME)`Kubernetes置換構文を介して使用できます。

例えば以下のPod specificationは

{{< codenew file="pods/pod-configmap-env-var-valueFrom.yaml" >}}

以下コマンドの実行で作成され、

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-env-var-valueFrom.yaml
```

`test-container`コンテナで以下の出力結果を表示します:

```shell
very charm
```

## ボリュームにConfigMapデータを追加する

[ファイルからConfigMapを作成する](#create-configmaps-from-files)で説明したように、``--from-file``を使用してConfigMapを作成する場合は、ファイル名がConfigMapの`data`セクションに保存されるキーになり、ファイルのコンテンツがキーの値になります。

このセクションの例は以下に示されているspecial-configと名付けれたConfigMapについて言及したものです。

{{< codenew file="configmap/configmap-multikeys.yaml" >}}

ConfigMapを作成します:

```shell
kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
```

### ConfigMapに保存されているデータをボリュームに入力する

ConfigMap名をPod specificationの`volumes`セクション配下に追加します。
これによりConfigMapデータが`volumeMounts.mountPath`で指定されたディレクトリに追加されます (このケースでは、`/etc/config`に)。`command`セクションはConfigMapのキーに合致したディレクトリファイルを名前別でリスト表示します。

{{< codenew file="pods/pod-configmap-volume.yaml" >}}

Podを作成します:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume.yaml
```

Podが稼働していると、`ls /etc/config/`は以下の出力結果を表示します:

```shell
SPECIAL_LEVEL
SPECIAL_TYPE
```

{{< caution >}}
`/etc/config/`ディレクトリに何かファイルがある場合、それらは削除されます。
{{< /caution >}}

{{< note >}}
テキストデータはUTF-8文字エンコーディングを使用しているファイルとして公開されます。他の文字エンコーディングを使用する場合は、バイナリデータを使用してください。
{{< /note >}}

### ConfigMapデータをボリュームの特定のパスに追加する

`path`フィールドを利用して特定のConfigMapのアイテム向けに希望のファイルパスを指定します。
このケースでは`SPECIAL_LEVEL`アイテムが`/etc/config/keys`の`config-volume`ボリュームにマウントされます。

{{< codenew file="pods/pod-configmap-volume-specific-key.yaml" >}}

Podを作成します:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume-specific-key.yaml
```

Podが稼働していると、 `cat /etc/config/keys`は以下の出力結果を表示します:

```shell
very
```

{{< caution >}}
先ほどのように、`/etc/config/` ディレクトリのこれまでのファイルは全て削除されます
{{< /caution >}}

### キーを特定のパスとファイルアクセス許可に投影する

キーをファイル単位で特定のパスとアクセス許可に投影できます。[Secret](/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod)のユーザーガイドで構文が解説されています。

### マウントされたConfigMapは自動的に更新される

ボリュームで使用されているConfigMapが更新されている場合、投影されているキーも同じく結果的に更新されます。kubeletは定期的な同期ごとにマウントされているConfigMapが更新されているかチェックします。しかし、これはローカルのttlを基にしたキャッシュでConfigMapの現在の値を取得しています。その結果、新しいキーがPodに投影されてからConfigMapに更新されるまでのトータルの遅延はkubeletで、kubeletの同期期間(デフォルトで1分) + ConfigMapキャッシュのttl(デフォルトで1分)の長さになる可能性があります。Podのアノテーションを1つ更新すると即時のリフレッシュをトリガーできます。

{{< note >}}
ConfigMapを[subPath](/docs/concepts/storage/volumes/#using-subpath)ボリュームとして利用するコンテナはConfigMapの更新を受け取りません。
{{< /note >}}


<!-- discussion -->

## ConfigMapとPodsを理解する

ConfigMap APIリソースは構成情報をキーバリューペアとして保存します。データはPodで利用したり、コントローラーなどのシステムコンポーネントに提供できます。ConfigMapは[Secret](/docs/concepts/configuration/secret/)に似ていますが、機密情報を含まない文字列を含まない操作する手段を提供します。ユーザーとシステムコンポーネントはどちらも構成情報をConfigMapに保存できます。

{{< note >}}
ConfigMapはプロパティーファイルを参照するべきであり、置き換えるべきではありません。ConfigMapをLinuxの`/etc`ディレクトリとそのコンテンツのように捉えましょう。例えば、[Kubernetes Volume](/docs/concepts/storage/volumes/)をConfigMapから作成した場合、ConfigMapのデータアイテムはボリューム内で個別のファイルとして表示されます。
{{< /note >}}

ConfigMapの`data`フィールドは構成情報を含みます。下記の例のように、シンプルに個別のプロパティーを`--from-literal`で定義、または複雑に構成ファイルまたはJSON blobsを`--from-file`で定義できます。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: example-config
  namespace: default
data:
  # --from-literalを使用してシンプルにプロパティーを定義する例
  example.property.1: hello
  example.property.2: world
  # --from-fileを使用して複雑にプロパティーを定義する例
  example.property.file: |-
    property.1=value-1
    property.2=value-2
    property.3=value-3
```

### 制限事項

- ConfigMapはPod specificationを参照させる前に作成する必要があります(ConfigMapを"optional"として設定しない限り)。存在しないConfigMapを参照させた場合、Podは起動しません。同様にConfigMapに存在しないキーを参照させた場合も、Podは起動しません。

- ConfigMapで`envFrom`を使用して環境変数を定義した場合、無効と判断されたキーはスキップされます。Podは起動されますが、無効な名前はイベントログに(`InvalidVariableNames`)と記録されます。ログメッセージはスキップされたキーごとにリスト表示されます。例えば:

   ```shell
   kubectl get events
   ```

   出力結果は以下のようになります:
   ```
   LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
   0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
   ```

- ConfigMapは特定の{{< glossary_tooltip term_id="namespace" >}}に属します。ConfigMapは同じ名前空間に属するPodからのみ参照できます。

- {{< glossary_tooltip text="static pods" term_id="static-pod" >}}はKubeletがサポートしていないため、ConfigMapに使用できません。


## {{% heading "whatsnext" %}}
* 実践例[ConfigMapを使ったRedisの設定](/ja/docs/tutorials/configuration/configure-redis-using-configmap/)を続けて読む。

