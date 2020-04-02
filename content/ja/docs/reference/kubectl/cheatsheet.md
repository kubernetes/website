---
title: kubectlチートシート
content_template: templates/concept
card:
  name: reference
  weight: 30
---

{{% capture overview %}}

[Kubectl概要](/docs/reference/kubectl/overview/)と[JsonPathガイド](/docs/reference/kubectl/jsonpath)も合わせてご覧ください。

このページは`kubectl`コマンドの概要です。

{{% /capture %}}

{{% capture body %}}

# kubectl - チートシート

## Kubectlコマンドの補完

### BASH

```bash
source <(kubectl completion bash) # 現在のbashシェルにコマンド補完を設定するには、最初にbash-completionパッケージをインストールする必要があります。
echo "source <(kubectl completion bash)" >> ~/.bashrc # bashシェルでのコマンド補完を永続化するために.bashrcに追記します。
```

また、エイリアスを使用している場合にも`kubectl`コマンドを補完できます。

```bash
alias k=kubectl
complete -F __start_kubectl k
```

### ZSH

```bash
source <(kubectl completion zsh)  # 現在のzshシェルでコマンド補完を設定します
echo "if [ $commands[kubectl] ]; then source <(kubectl completion zsh); fi" >> ~/.zshrc # zshシェルでのコマンド補完を永続化するために.zshrcに追記します。
```

## Kubectlコンテキストの設定

`kubectl`がどのKubernetesクラスターと通信するかを設定します。
設定ファイル詳細については[kubeconfigを使用した複数クラスターとの認証](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)をご覧ください。

```bash
kubectl config view # マージされたkubeconfigの設定を表示します。

# 複数のkubeconfigファイルを同時に読み込む場合はこのように記述します。
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2 

kubectl config view

# e2eユーザのパスワードを取得します。
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

kubectl config view -o jsonpath='{.users[].name}'    # 最初のユーザー名を表示します
kubectl config view -o jsonpath='{.users[*].name}'   # ユーザー名のリストを表示します
kubectl config get-contexts                          # コンテキストのリストを表示します
kubectl config current-context                       # 現在のコンテキストを表示します
kubectl config use-context my-cluster-name           # デフォルトのコンテキストをmy-cluster-nameに設定します

# basic認証をサポートする新たなクラスターをkubeconfigに追加します
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# 現在のコンテキストでkubectlのサブコマンドのネームスペースを永続的に変更します
kubectl config set-context --current --namespace=ggckad-s2

# 特定のユーザー名と名前空間を使用してコンテキストを設定します
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce
 
kubectl config unset users.foo    # ユーザーfooを削除します
```

## Apply

`apply`はKubernetesリソースを定義するファイルを通じてアプリケーションを管理します。`kubectl apply`を実行して、クラスター内のリソースを作成および更新します。これは、本番環境でKubernetesアプリケーションを管理する推奨方法です。
詳しくは[Kubectl Book](https://kubectl.docs.kubernetes.io)をご覧ください。


## Objectの作成

Kubernetesのマニフェストファイルは、jsonまたはyamlで定義できます。ファイル拡張子として、`.yaml`や`.yml`、`.json`が使えます。

```bash
kubectl apply -f ./my-manifest.yaml            # リソースを作成します
kubectl apply -f ./my1.yaml -f ./my2.yaml      # 複数のファイルからリソースを作成します
kubectl apply -f ./dir                         # dirディレクトリ内のすべてのマニフェストファイルからリソースを作成します
kubectl apply -f https://git.io/vPieo          # urlで公開されているファイルからリソースを作成します
kubectl create deployment nginx --image=nginx  # 単一のnginx Deploymentを作成します
kubectl explain pods,svc                       # PodおよびServiceマニフェストのドキュメントを取得します

# 標準入力から複数のYAMLオブジェクトを作成します

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

# いくつかの鍵を含むSecretを作成します

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
# Getコマンドで基本的な情報を確認します
kubectl get services                          # 現在のネームスペース上にあるすべてのサービスのリストを表示します
kubectl get pods --all-namespaces             # すべてのネームスペース上にあるすべてのPodのリストを表示します
kubectl get pods -o wide                      # 現在のネームスペース上にあるすべてのPodについてより詳細なリストを表示します
kubectl get deployment my-dep                 # 特定のDeploymentを表示します
kubectl get pods                              # 現在のネームスペース上にあるすべてのPodのリストを表示します
kubectl get pod my-pod -o yaml                # PodのYAMLを表示します
kubectl get pod my-pod -o yaml --export       # クラスター固有の情報を除いたPodのマニフェストをYAMLで表示します

# Describeコマンドで詳細な情報を確認します
kubectl describe nodes my-node
kubectl describe pods my-pod

# 名前順にソートしたリストを表示します
kubectl get services --sort-by=.metadata.name

# Restartカウント順にPodのリストを表示します
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# capacity順にソートしたtestネームスペースに存在するPodのリストを表示します
kubectl get pods -n test --sort-by=.spec.capacity.storage

# app=cassandraラベルのついたすべてのPodのversionラベルを表示します
kubectl get pods --selector=app=cassandra -o \
  jsonpath='{.items[*].metadata.labels.version}'

# すべてのワーカーノードを取得します（セレクターを使用して、
# 「node-role.kubernetes.io/master」という名前のラベルを持つ結果を除外します）
kubectl get node --selector='!node-role.kubernetes.io/master'

# 現在のネームスペースでrunning状態のPodをリストを表示します
kubectl get pods --field-selector=status.phase=Running

# すべてのノードのExternal IPをリストを表示します
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# 特定のRCに属するPodの名前のリストを表示します
# `jq`コマンドは複雑なjsonpathを変換する場合に便利であり、https://stedolan.github.io/jq/で見つけることが可能です

sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# すべてのPod(またはラベル付けをサポートする他のKubernetesオブジェクト)のラベルのリストを表示します

kubectl get pods --show-labels

# どのノードがready状態か確認します

JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# Podで現在使用中のSecretをすべて表示します

kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# タイムスタンプでソートされたEventのリストを表示します

kubectl get events --sort-by=.metadata.creationTimestamp
```

## リソースのアップデート

version 1.11で`rolling-update`は廃止されました、代わりに`rollout`コマンドをお使いください(詳しくはこちらをご覧ください [CHANGELOG-1.11.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.11.md))。

```bash
kubectl set image deployment/frontend www=image:v2               # frontend Deploymentのwwwコンテナイメージをv2にローリングアップデートします
kubectl rollout history deployment/frontend                      # frontend Deploymentの改訂履歴を確認します
kubectl rollout undo deployment/frontend                         # 1つ前のDeploymentにロールバックします
kubectl rollout undo deployment/frontend --to-revision=2         # 特定のバージョンにロールバックします
kubectl rollout status -w deployment/frontend                    # frontend Deploymentのローリングアップデートを状態をwatchします


# これらのコマンドは1.11から廃止されました
kubectl rolling-update frontend-v1 -f frontend-v2.json           # (廃止) frontend-v1 Podをローリングアップデートします
kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2  # (廃止) リソース名とイメージを変更します
kubectl rolling-update frontend --image=image:v2                 # (廃止) frontendのイメージを変更します
kubectl rolling-update frontend-v1 frontend-v2 --rollback        # (廃止) 現在実行中のローリングアップデートを中止します
cat pod.json | kubectl replace -f -                              # 標準入力から渡されたJSONに基づいてPodを置き換えます

# リソースを強制的に削除してから再生成し、置き換えます。サービスの停止が発生します
kubectl replace --force -f ./pod.json

# ReplicaSetリソースで作られたnginxについてServiceを作成します。これは、ポート80で提供され、コンテナへはポート8000で接続します
kubectl expose rc nginx --port=80 --target-port=8000

# 単一コンテナのPodイメージのバージョン(タグ)をv4に更新します
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # ラベルを追加します
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # アノテーションを追加します
kubectl autoscale deployment foo --min=2 --max=10                # "foo" Deploymentのオートスケーリングを行います
```

## リソースへのパッチ適用

```bash
# ノードを部分的に更新します
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'

# コンテナのイメージを更新します。spec.containers[*].nameはマージキーであるため必須です
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# ポテンシャル配列を含むJSONパッチを使用して、コンテナのイメージを更新します
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# ポテンシャル配列のJSONパッチを使用してDeploymentのlivenessProbeを無効にします
kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# ポテンシャル配列に新たな要素を追加します
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'
```

## リソースの編集

任意のエディターでAPIリソースを編集します。

```bash
kubectl edit svc/docker-registry                      # docker-registryという名前のサービスを編集します
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # エディターを指定します
```

## リソースのスケーリング

```bash
kubectl scale --replicas=3 rs/foo                                 # 「foo」という名前のレプリカセットを3にスケーリングします
kubectl scale --replicas=3 -f foo.yaml                            # 「foo.yaml」で指定されたリソースを3にスケーリングします
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # mysqlと名付けられたdeploymentの現在のサイズが2であれば、mysqlを3にスケーリングします
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # 複数のReplication controllerをスケーリングします
```

## リソースの削除

```bash
kubectl delete -f ./pod.json                                              # pod.jsonで指定されたタイプと名前を使用してPodを削除します
kubectl delete pod,service baz foo                                        # 「baz」と「foo」の名前を持つPodとServiceを削除します
kubectl delete pods,services -l name=myLabel                              # name=myLabelラベルを持つのPodとServiceを削除します
kubectl -n my-ns delete pod,svc --all                                     # 名前空間my-ns内のすべてのPodとServiceを削除します
# awkコマンドのpattern1またはpattern2に一致するすべてのPodを削除します。
kubectl get pods  -n mynamespace --no-headers=true | awk '/pattern1|pattern2/{print $1}' | xargs  kubectl delete -n mynamespace pod
```

## 実行中のポッドとの対話処理

```bash
kubectl logs my-pod                                 # Podのログをダンプします(標準出力)
kubectl logs -l name=myLabel                        # name=myLabelラベルの持つPodのログをダンプします(標準出力)
kubectl logs my-pod --previous                      # 以前に存在したコンテナのPodログをダンプします(標準出力)
kubectl logs my-pod -c my-container                 # 複数コンテナがあるPodで、特定のコンテナのログをダンプします(標準出力)
kubectl logs -l name=myLabel -c my-container        # name=mylabelラベルを持つPodのログをダンプします(標準出力) 
kubectl logs my-pod -c my-container --previous      # 複数コンテナがあるPodで、以前に作成した特定のコンテナのログをダンプします(標準出力)
kubectl logs -f my-pod                              # Podのログをストリームで確認します(標準出力)
kubectl logs -f my-pod -c my-container              # 複数のコンテナがあるPodで、特定のコンテナのログをストリームで確認します(標準出力)
kubectl logs -f -l name=myLabel --all-containers    # name-myLabelラベルを持つすべてのコンテナのログをストリームで確認します(標準出力)
kubectl run -i --tty busybox --image=busybox -- sh  # Podをインタラクティブシェルとして実行します
kubectl run nginx --image=nginx --restart=Never -n 
mynamespace                                         # 特定のネームスペースでnginx Podを実行します
kubectl run nginx --image=nginx --restart=Never     # nginx Podを実行し、マニフェストファイルををpod.yamlという名前で書き込みます
--dry-run -o yaml > pod.yaml
kubectl attach my-pod -i                            # 実行中のコンテナに接続します
kubectl port-forward my-pod 5000:6000               # ローカルマシンのポート5000を、my-podのポート6000に転送します
kubectl exec my-pod -- ls /                         # 既存のPodでコマンドを実行(単一コンテナの場合)
kubectl exec my-pod -c my-container -- ls /         # 既存のPodでコマンドを実行(複数コンテナがある場合)
kubectl top pod POD_NAME --containers               # 特定のPodとそのコンテナのメトリクスを表示します
```

## ノードおよびクラスターとの対話処理

```bash
kubectl cordon my-node                                                # my-nodeにスケーリングされないように設定します
kubectl drain my-node                                                 # メンテナンスの準備としてmy-nodeで動作中のPodを空にします
kubectl uncordon my-node                                              # my-nodeにスケーリングされるように設定します
kubectl top node my-node                                              # 特定のノードのメトリクスを表示します
kubectl cluster-info                                                  # Kubernetesクラスターのマスターとサービスのアドレスを表示します
kubectl cluster-info dump                                             # 現在のクラスター状態を標準出力にダンプします
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # 現在のクラスター状態を/path/to/cluster-stateにダンプします

# special-userキーとNoScheduleエフェクトを持つTaintが既に存在する場合、その値は指定されたとおりに置き換えられます
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

### リソースタイプ

サポートされているすべてのリソースタイプを、それらが[API group](/docs/concepts/overview/kubernetes-api/#api-groups)か[Namespaced](/docs/concepts/overview/working-with-objects/namespaces)、[Kind](/docs/concepts/overview/working-with-objects/kubernetes-objects)に関わらずその短縮名をリストします。

```bash
kubectl api-resources
```

APIリソースを探索するためのその他の操作: 

```bash
kubectl api-resources --namespaced=true      # 名前空間付きのすべてのリソースを表示します
kubectl api-resources --namespaced=false     # 名前空間のないすべてのリソースを表示します
kubectl api-resources -o name                # すべてのリソースを単純な出力(リソース名のみ)で表示します
kubectl api-resources -o wide                # すべてのリソースを拡張された形(別名 "wide")で表示します
kubectl api-resources --verbs=list,get       # "list"および"get"操作をサポートするすべてのリソースを表示します
kubectl api-resources --api-group=extensions # "extensions" APIグループのすべてのリソースを表示します
```

### 出力のフォーマット

特定の形式で端末ウィンドウに詳細を出力するには、サポートされている`kubectl`コマンドに`-o`または`--output`フラグを追加します。

出力フォーマット | 説明
---------------- | -----------
`-o=custom-columns=<spec>` | カスタムカラムを使用してコンマ区切りのテーブルを表示します
`-o=custom-columns-file=<filename>` | `<filename>`ファイル内のカスタムカラムテンプレートを使用してテーブルを表示します
`-o=json`     | JSON形式のAPIオブジェクトを出力します
`-o=jsonpath=<template>` | [jsonpath](/docs/reference/kubectl/jsonpath)式で定義されたフィールドを出力します
`-o=jsonpath-file=<filename>` | `<filename>`ファイル内の[jsonpath](/docs/reference/kubectl/jsonpath)式で定義されたフィールドを出力します
`-o=name`     | リソース名のみを出力し、それ以外は何も出力しません。
`-o=wide`     | 追加の情報を含むプレーンテキスト形式で出力します。Podの場合、Node名が含まれます。
`-o=yaml`     | YAML形式のAPIオブジェクトを出力します

### Kubectlのログレベルとデバッグ
kubectlのログレベルは、レベルを表す整数が後に続く`-v`または`--v`フラグで制御されます。一般的なKubernetesのログ記録規則と関連するログレベルについて、[こちら](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)で説明します。

ログレベル    | 説明
--------------| -----------
`--v=0`       | これは、クラスターオペレーターにログレベルが0であることを"常に"見えるようにするために役立ちます
`--v=1`       | 冗長性が必要ない場合は、妥当なデフォルトのログレベルです
`--v=2`       | サービスに関する重要な定常状態情報と、システムの重要な変更に関連する可能性がある重要なログメッセージを表示します。 これは、ほとんどのシステムで推奨されるデフォルトのログレベルです。
`--v=3`       | 変更に関するより詳細なログレベルを表示します
`--v=4`       | デバックにむいたログレベルで表示します
`--v=6`       | 要求されたリソースを表示します
`--v=7`       | HTTPリクエストのヘッダを表示します
`--v=8`       | HTTPリクエストのコンテンツを表示します
`--v=9`       | HTTPリクエストのコンテンツをtruncationなしで表示します

{{% /capture %}}

{{% capture whatsnext %}}

* kubectlについてより深く学びたい方は[kubectl概要](/docs/reference/kubectl/overview/)をご覧ください。

* オプションについては[kubectl](/docs/reference/kubectl/kubectl/) optionsをご覧ください。

* また[kubectlの利用パターン](/docs/reference/kubectl/conventions/)では再利用可能なスクリプトでkubectlを利用する方法を学べます。

* コミュニティ版[kubectlチートシート](https://github.com/dennyzhang/cheatsheet-kubernetes-A4)もご覧ください。

{{% /capture %}}
