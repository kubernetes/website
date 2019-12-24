---
title: kubectl Cheat Sheet
content_template: templates/concept
card:
  name: reference
  weight: 30
---

{{% capture overview %}}

こちらも参照ください: [Kubectl 概要](/docs/reference/kubectl/overview/) 、 [JsonPath ガイド](/docs/reference/kubectl/jsonpath)。

このページは `kubectl` コマンドの概要です。

{{% /capture %}}

{{% capture body %}}

# kubectl - チートシート

## Kubectlコマンドの補完

### BASH

```bash
source <(kubectl completion bash) # 現在のbashシェルにコマンド補完を設定するには、最初にbash-completionパッケージをインストールする必要があります。
echo "source <(kubectl completion bash)" >> ~/.bashrc # bashシェルでのコマンド補完を永続化するために.bashrcに追記します。
```

また、エイリアスを使用している場合にも`kubectl`コマンドを補完することができます。

```bash
alias k=kubectl
complete -F __start_kubectl k
```

### ZSH

```bash
source <(kubectl completion zsh)  # 現在のzshシェルでコマンド補完を設定する
echo "if [ $commands[kubectl] ]; then source <(kubectl completion zsh); fi" >> ~/.zshrc # zshシェルでのコマンド補完を永続化するために.zshrcに追記します。
```

## Kubectlコンテキストの設定

`kubectl`がどのkubernetesクラスターと通信するかを設定します。
設定ファイル詳細については[kubeconfigを使用した複数クラスターとの認証](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)をご覧ください。

```bash
kubectl config view # マージされたkubeconfigの設定を表示。

# 複数のkubeconfigファイルを同時に読み込む場合はこのように記述します。
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2 

kubectl config view

# e2eユーザのパスワードを取得。
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

kubectl config view -o jsonpath='{.users[].name}'    # 最初のユーザ名ーを表示
kubectl config view -o jsonpath='{.users[*].name}'   # ユーザー名のリストを表示
kubectl config get-contexts                          # コンテキストのリストを表示 
kubectl config current-context                       # 現在のコンテキストを表示
kubectl config use-context my-cluster-name           # デフォルトのコンテキストをmy-cluster-nameに設定

# basic認証をサポートする新たなクラスターをkubeconfigに追加する
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# 現在のコンテキストでkubectlのサブコマンドのネームスペースを永続的に変更する
kubectl config set-context --current --namespace=ggckad-s2

# 特定のユーザー名と名前空間を使用してコンテキストを設定します
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce
 
kubectl config unset users.foo    # ユーザーfooを削除
```

## Apply

`apply`はkubernetesリソースを定義するファイルを通じてアプリケーションを管理します。 `kubectl apply`を実行して、クラスター内のリソースを作成および更新します。 これは、本番環境でkubernetesアプリケーションを管理する推奨方法です。
詳しくは[Kubectl Book](https://kubectl.docs.kubernetes.io)をご覧ください。


## Objectの作成

kubernetesのマニフェストファイルは、jsonまたはyamlで定義できます。ファイル拡張子として、`.yaml`や`.yml`、`.json`が使えます。

```bash
kubectl apply -f ./my-manifest.yaml            # リソースの作成する
kubectl apply -f ./my1.yaml -f ./my2.yaml      # 複数のファイルからリソースを作成する
kubectl apply -f ./dir                         # dirディレクトリに存在するマニフェストファイルからリソースを作成する
kubectl apply -f https://git.io/vPieo          # urlで公開されているファイルからリソースを作成する
kubectl create deployment nginx --image=nginx  # 単一のnginx Deploymentを作成します
kubectl explain pods,svc                       # PodおよびServiceマニフェストのドキュメントを取得します。

# 標準入力から複数のYAMLオブジェクトを作成する

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep-less
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000"
EOF

# いくつかの鍵を含むsecretを作成する

cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: $(echo -n "s33msi4" | base64 -w0)
  username: $(echo -n "jane" | base64 -w0)
EOF

```

## リソースの検索と閲覧

```bash
# Getコマンドで基本的な情報を確認する
kubectl get services                          # 現在のネームスペース上にある全てのサービスのリストを表示する
kubectl get pods --all-namespaces             # 全てのネームスペース上にある全てのPodのリストを表示する
kubectl get pods -o wide                      # 現在のネームスペース上にある全てのPodについてより詳細なリストを表示する
kubectl get deployment my-dep                 # 特定のDeploymentを表示する
kubectl get pods                              # 現在のネームスペース上にある全てのPodのリストを表示する
kubectl get pod my-pod -o yaml                # PodのYAMLを表示する
kubectl get pod my-pod -o yaml --export       # クラスター固有の情報を除いたPodのマニフェストをYAMLで表示する

# Describeコマンドで詳細な情報を確認する
kubectl describe nodes my-node
kubectl describe pods my-pod

# 名前順にソートしたリストを表示する
kubectl get services --sort-by=.metadata.name

# Restartカウント順にPodのリストを表示する
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# capacity順にソートしたtestネームスペースに存在するPodのリストを表示する
kubectl get pods -n test --sort-by=.spec.capacity.storage

# app=cassandraラベルのついた全てのPodのversionラベルを表示する
kubectl get pods --selector=app=cassandra -o \
  jsonpath='{.items[*].metadata.labels.version}'

# 全てのワーカーノードを取得します（セレクターを使用して、
# 「node-role.kubernetes.io/master」という名前のラベルを持つ結果を除外します）
kubectl get node --selector='!node-role.kubernetes.io/master'

# 現在のネームスペースでrunning状態のPodをリストを表示する
kubectl get pods --field-selector=status.phase=Running

# 全てのノードのExternal IPをリストを表示する
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# 特定のRCに属するポッドの名前のリストを表示する
# `jq`コマンドは複雑なjsonpathを変換する場合に便利であり，https://stedolan.github.io/jq/で見つけることが可能です。

sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# すべてのPod（またはラベル付けをサポートする他のkubernetesオブジェクト）のラベルをリストを表示する

kubectl get pods --show-labels

# どのノードがready状態か確認する

JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# Podに現在使用されているSecretsを全てリストを表示する

kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# タイムスタンプでソートされたEventsをリストを表示する

kubectl get events --sort-by=.metadata.creationTimestamp
```

## リソースのアップデート

version 1.11で`rolling-update`は廃止されました、代わりに`rollout`コマンドをお使いください(詳しくはこちらをご覧ください [CHANGELOG-1.11.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.11.md))。

```bash
kubectl set image deployment/frontend www=image:v2               # frontend Deploymentのwwwコンテナイメージをv2にローリングアップデートする
kubectl rollout history deployment/frontend                      # frontend Deploymentの改訂履歴を確認する
kubectl rollout undo deployment/frontend                         # 一つ前のDeploymentにロールバックする
kubectl rollout undo deployment/frontend --to-revision=2         # 特定のバージョンにロールバックする
kubectl rollout status -w deployment/frontend                    # frontend Deploymentのローリングアップデートを状態をwatchする


# これらのコマンドは1.11から廃止されました
kubectl rolling-update frontend-v1 -f frontend-v2.json           # (廃止) frontend-v1 Podのローリングアップデート
kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2  # (廃止) リソース名とイメージの変更
kubectl rolling-update frontend --image=image:v2                 # (廃止) frontendのイメージを変更する
kubectl rolling-update frontend-v1 frontend-v2 --rollback        # (廃止) 現在実行中のローリングアップデートを中止する
cat pod.json | kubectl replace -f -                              # 標準入力から渡されたJSONに基づいてPodを置き換える

# リソースを強制的に削除してから再生成し、置き換えます。サービスの停止が発生します
kubectl replace --force -f ./pod.json

# Replicasetリソースで作られたnginxについてServiceを作成します。これは、ポート80で提供され、コンテナーへはポート8000で接続します
kubectl expose rc nginx --port=80 --target-port=8000

# 単一コンテナのPodイメージのバージョン(タグ)をv4に更新する
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # ラベルを追加する
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # アノテーションを追加する
kubectl autoscale deployment foo --min=2 --max=10                # "foo" Deploymentのオートスケーリング
```

## リソースへのパッチ適用

```bash
# ノードを部分的に更新する
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'

# コンテナのイメージを更新します。spec.containers[*].nameはマージキーであるため必須です。
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# ポテンシャル配列を含むJSONパッチを使用して、コンテナーのイメージを更新します
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# ポテンシャル配列のJSONパッチを使用してDeploymentのlivenessProbeを無効にする
kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# ポテンシャル配列に新たな要素を追加します
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'
```

## リソースの編集

任意のエディターでAPIリソースを編集します。

```bash
kubectl edit svc/docker-registry                      # docker-registryという名前のサービスを編集します
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # エディターを指定する
```

## リソースのスケーリング

```bash
kubectl scale --replicas=3 rs/foo                                 # 「foo」という名前のレプリカセットを3にスケーリングします。
kubectl scale --replicas=3 -f foo.yaml                            # 「foo.yaml」で指定されたリソースを3にスケーリングします。
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # mysqlの現在のサイズというデプロイメントが2の場合、mysqlを3にスケーリングします。
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # 複数のReplication controllerをスケーリングします。
```

## リソースの削除

```bash
kubectl delete -f ./pod.json                                              # pod.jsonで指定されたタイプと名前を使用してポッドを削除します。
kubectl delete pod,service baz foo                                        # 「baz」と「foo」の名前を持つPodとServiceを削除します。
kubectl delete pods,services -l name=myLabel                              # name=myLabelラベルを持つのPodとServiceを削除します。
kubectl -n my-ns delete pod,svc --all                                     # 名前空間my-ns内のすべてのPodとServiceを削除します。
# awkコマンドのpattern1またはpattern2に一致するすべてのポッドを削除します。
kubectl get pods  -n mynamespace --no-headers=true | awk '/pattern1|pattern2/{print $1}' | xargs  kubectl delete -n mynamespace pod
```

## 実行中のポッドとの対話処理

```bash
kubectl logs my-pod                                 # Podのログのダンプ(標準出力)
kubectl logs -l name=myLabel                        # name=myLabelラベルの持つPodのログをダンプ(標準出力)
kubectl logs my-pod --previous                      # 以前に存在したコンテナのPodログをダンプ(標準出力)
kubectl logs my-pod -c my-container                 # 複数コンテナがあるPodで、特定のコンテナのログをダンプ(標準出力)
kubectl logs -l name=myLabel -c my-container        # name=mylabelラベルを持つPodのログをダンプする(標準出力) 
kubectl logs my-pod -c my-container --previous      # 複数コンテナがあるPodで、以前に作成した特定のコンテナのログをダンプ(標準出力)
kubectl logs -f my-pod                              # Podのログをストリームで確認する(標準出力)
kubectl logs -f my-pod -c my-container              # 複数のコンテナがあるPodで、特定のコンテナのログをストリームで確認する(標準出力)
kubectl logs -f -l name=myLabel --all-containers    # name-myLabelラベルを持つ全てのコンテナのログをストリームで確認する(標準出力)
kubectl run -i --tty busybox --image=busybox -- sh  # Podをインタラクティブシェルとして実行する
kubectl run nginx --image=nginx --restart=Never -n 
mynamespace                                         # 特定のネームスペースでnginx Podを実行する
kubectl run nginx --image=nginx --restart=Never     # nginx Podを実行し、マニフェストファイルををpod.yamlという名前で書き込みます
--dry-run -o yaml > pod.yaml
kubectl attach my-pod -i                            # 実行中のコンテナに接続する
kubectl port-forward my-pod 5000:6000               # ローカルマシンのポート5000を、my-podのポート6000に転送します
kubectl exec my-pod -- ls /                         # 既存のPodでコマンドを実行（単一コンテナの場合）
kubectl exec my-pod -c my-container -- ls /         # 既存のPodでコマンドを実行 (複数コンテナがある場合)
kubectl top pod POD_NAME --containers               # 特定のPodとそのコンテナのメトリクスを表示します
```

## ノードおよびクラスターとの対話処理

```bash
kubectl cordon my-node                                                # my-nodeにスケーリングされないように設定
kubectl drain my-node                                                 # メンテナンスの準備としてmy-nodeで動作中のPodを空にする
kubectl uncordon my-node                                              # my-nodeにスケーリングされるように設定
kubectl top node my-node                                              # 特定のノードのメトリクスを表示
kubectl cluster-info                                                  # kubernetesクラスターのマスターとサービスのアドレスを表示します
kubectl cluster-info dump                                             # 現在のクラスター状態を標準出力にダンプします
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # 現在のクラスター状態を/path/to/cluster-stateにダンプします

# special-userキーとNoScheduleエフェクトを持つTaintが既に存在する場合、その値は指定されたとおりに置き換えられます。
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

### リソースタイプ

サポートされているすべてのリソースタイプを、それらが[API group](/docs/concepts/overview/kubernetes-api/#api-groups)か[Namespaced](/docs/concepts/overview/working-with-objects/namespaces)、[Kind](/docs/concepts/overview/working-with-objects/kubernetes-objects)に関わらずその短縮名をリストします。

```bash
kubectl api-resources
```

APIリソースを探索するためのその他の操作: 

```bash
kubectl api-resources --namespaced=true      # 名前空間付きの全てのリソースを表示
kubectl api-resources --namespaced=false     # 名前空間のないすべてのリソースを表示
kubectl api-resources -o name                # 全てのリソースを単純な出力(リソース名のみ)で表示
kubectl api-resources -o wide                # 全てのリソースを拡張された形(別名 "wide")で表示
kubectl api-resources --verbs=list,get       # "list"および"get"操作をサポートする全てのリソースを表示
kubectl api-resources --api-group=extensions # "extensions" APIグループの全てのリソースを表示
```

### 出力のフォーマット

特定の形式で端末ウィンドウに詳細を出力するには、サポートされている`kubectl`コマンドに`-o`または`--output`フラグを追加します。

出力フォーマット | 説明
---------------- | -----------
`-o=custom-columns=<spec>` | カスタムカラムを使用してコンマ区切りのテーブルを表示します
`-o=custom-columns-file=<filename>` | `<filename>`ファイル内のカスタムカラムテンプレートを使用してテーブルを表示します
`-o=json`     | JSON形式のAPIオブジェクトを出力する
`-o=jsonpath=<template>` | [jsonpath](/docs/reference/kubectl/jsonpath)式で定義されたフィールドを出力します
`-o=jsonpath-file=<filename>` | `<filename>`ファイル内の[jsonpath](/docs/reference/kubectl/jsonpath)式で定義されたフィールドを出力します
`-o=name`     | リソース名のみを出力し、それ以外は何も出力しません。
`-o=wide`     | 追加の情報を含むプレーンテキスト形式で出力します。Podの場合、Node名が含まれます。
`-o=yaml`     | YAML形式のAPIオブジェクトを出力する

### Kubectl output verbosity and debugging
### Kubectlのログレベルとデバッグ
kubectlのログレベルは、レベルを表す整数が後に続く `-v`または` --v`フラグで制御されます。 一般的なkubernetesのログ記録規則と関連するログレベルについて、[こちら](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)で説明します。

ログレベル    | 説明
--------------| -----------
`--v=0`       | これは、クラスターオペレーターにログレベルが0であることを"常に"見えるようにするために役立ちます
`--v=1`       | 冗長性が必要ない場合は、妥当なデフォルトのログレベルです
`--v=2`       | サービスに関する重要な定常状態情報と、システムの重要な変更に関連する可能性がある重要なログメッセージを表示する。 これは、ほとんどのシステムで推奨されるデフォルトのログレベルです。
`--v=3`       | 変更に関するより詳細なログレベルを表示する
`--v=4`       | デバックにむいたログレベルで表示する
`--v=6`       | 要求されたリソースを表示する
`--v=7`       | HTTPリクエストのヘッダを表示する
`--v=8`       | HTTPリクエストのコンテンツを表示する
`--v=9`       | HTTPリクエストのコンテンツをtruncationなしで表示する

{{% /capture %}}

{{% capture whatsnext %}}

* kubectlについてより深く学びたい方はこちら [Overview of kubectl](/docs/reference/kubectl/overview/)。

* オプションについては[kubectl](/docs/reference/kubectl/kubectl/) optionsをご覧ください。

* また[kubectl Usage Conventions](/docs/reference/kubectl/conventions/)では再利用可能なスクリプトでkubectlを利用する方法を学べます。

* コミュニティ版[kubectl cheatsheets](https://github.com/dennyzhang/cheatsheet-kubernetes-A4)もご覧ください。

{{% /capture %}}
