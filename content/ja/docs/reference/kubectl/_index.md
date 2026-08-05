---
title: コマンドラインツール(kubectl)
content_type: reference
weight: 110
no_list: true
card:
  name: reference
  weight: 20
---

<!-- overview -->
{{< glossary_definition prepend="Kubernetesが提供する、" term_id="kubectl" length="short" >}}

このツールの名前は、`kubectl` です。

`kubectl`コマンドラインツールを使うと、Kubernetesクラスターを制御できます。環境設定のために、`kubectl`は、`$HOME/.kube`ディレクトリにある`config`という名前のファイルを探します。他の[kubeconfig](/ja/docs/concepts/configuration/organize-cluster-access-kubeconfig/)ファイルは、`KUBECONFIG`環境変数を設定するか、[`--kubeconfig`](/ja/docs/concepts/configuration/organize-cluster-access-kubeconfig/)フラグを設定することで指定できます。

この概要では、`kubectl`の構文を扱い、コマンド操作を説明し、一般的な例を示します。サポートされているすべてのフラグやサブコマンドを含め、各コマンドの詳細については、[kubectl](/docs/reference/generated/kubectl/kubectl-commands/)リファレンスドキュメントを参照してください。

インストール方法については、[kubectlのインストールおよびセットアップ](/ja/docs/tasks/tools/#kubectl)をご覧ください。クイックガイドは、[チートシート](/ja/docs/reference/kubectl/cheatsheet/)をご覧ください。`docker`コマンドラインツールに慣れている方は、[`kubectl` for Docker Users](/docs/reference/kubectl/docker-cli-to-kubectl/)でKubernetesの同等のコマンドを説明しています。

<!-- body -->

## 構文

ターミナルウィンドウから`kubectl`コマンドを実行するには、以下の構文を使用します。

```shell
kubectl [command] [TYPE] [NAME] [flags]
```

ここで、`command`、`TYPE`、`NAME`、`flags`は、以下を表します。

* `command`: 1つ以上のリソースに対して実行したい操作を指定します。例えば、`create`、`get`、`describe`、`delete`です。

* `TYPE`: [リソースタイプ](#resource-types)を指定します。リソースタイプは大文字と小文字を区別せず、単数形や複数形、省略形を指定できます。例えば、以下のコマンドは同じ出力を生成します。

   ```shell
   kubectl get pod pod1
   kubectl get pods pod1
   kubectl get po pod1
   ```

* `NAME`: リソースの名前を指定します。名前は大文字と小文字を区別します。`kubectl get pods`のように名前が省略された場合は、すべてのリソースの詳細が表示されます。

   複数のリソースに対して操作を行う場合は、各リソースをタイプと名前で指定するか、1つまたは複数のファイルを指定することができます。

   * リソースをタイプと名前で指定する場合

      * タイプがすべて同じとき、リソースをグループ化するには`TYPE1 name1 name2 name<#>`とします。<br/>
      例: `kubectl get pod example-pod1 example-pod2`

      * 複数のリソースタイプを個別に指定するには、`TYPE1/name1 TYPE1/name2 TYPE2/name3 TYPE<#>/name<#>`とします。<br/>
      例: `kubectl get pod/example-pod1 replicationcontroller/example-rc1`

   * リソースを1つ以上のファイルで指定する場合は、`-f file1 -f file2 -f file<#>`とします。

      * 特に設定ファイルについては、YAMLの方がより使いやすいため、[JSONではなくYAMLを使用してください](/ja/docs/concepts/configuration/overview/#一般的な設定のtips)。<br/>
     例: `kubectl get pod -f ./pod.yaml`

* `flags`: オプションのフラグを指定します。例えば、`-s`または`--server`フラグを使って、Kubernetes APIサーバーのアドレスやポートを指定できます。<br/>

{{< caution >}}
コマンドラインから指定したフラグは、デフォルト値および対応する任意の環境変数を上書きします。
{{< /caution >}}

ヘルプが必要な場合は、ターミナルウィンドウから`kubectl help`を実行してください。

## クラスター内認証と名前空間のオーバーライド {#in-cluster-authentication-and-namespace-overrides}

デフォルトでは、`kubectl`は最初にPod内で動作しているか、つまりクラスター内で動作しているかどうかを判断します。まず、`KUBERNETES_SERVICE_HOST`と`KUBERNETES_SERVICE_PORT`の環境変数を確認し、サービスアカウントのトークンファイルが`/var/run/secrets/kubernetes.io/serviceaccount/token`に存在するかどうかを確認します。3つともクラスター内で見つかった場合、クラスター内認証とみなされます。

後方互換性を保つため、クラスター内認証時に`POD_NAMESPACE`環境変数が設定されている場合には、サービスアカウントトークンのデフォルトの名前空間が上書きされます。名前空間のデフォルトに依存しているすべてのマニフェストやツールは、この影響を受けます。

**`POD_NAMESPACE`環境変数**

`POD_NAMESPACE`環境変数が設定されている場合、名前空間に属するリソースのCLI操作は、デフォルトで環境変数の値になります。例えば、変数に`seattle`が設定されている場合、`kubectl get pods`は、`seattle`名前空間のPodを返します。これは、Podが名前空間に属するリソースであり、コマンドで名前空間が指定されていないためです。`kubectl api-resources`の出力を見て、リソースが名前空間に属するかどうかを判断してください。

明示的に`--namespace <value>`を使用すると、この動作は上書きされます。

**kubectlによるServiceAccountトークンの処理方法**

以下の条件がすべて成立した場合、
* `/var/run/secrets/kubernetes.io/serviceaccount/token`にマウントされたKubernetesサービスアカウントのトークンファイルがある
* `KUBERNETES_SERVICE_HOST`環境変数が設定されている
* `KUBERNETES_SERVICE_PORT`環境変数が設定されている
* kubectlコマンドラインで名前空間を明示的に指定しない

kubectlはクラスター内で実行されているとみなして、そのServiceAccountの名前空間(これはPodの名前空間と同じです)を検索し、その名前空間に対して機能します。これは、クラスターの外の動作とは異なります。kubectlがクラスターの外で実行され、名前空間を指定しない場合、kubectlコマンドは、クライアント構成の現在のコンテキストに設定されている名前空間に対して動作します。kubectlのデフォルトの名前空間を変更するには、次のコマンドを使用できます。

```shell
kubectl config set-context --current --namespace=<namespace-name>
```

## 操作

以下の表に、`kubectl`のすべての操作の簡単な説明と一般的な構文を示します。

操作&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;       | 構文    |       説明
-------------------- | -------------------- | --------------------
`alpha`| `kubectl alpha SUBCOMMAND [flags]` | アルファ機能に該当する利用可能なコマンドを一覧表示します。これらの機能は、デフォルトではKubernetesクラスターで有効になっていません。
`annotate`    | <code>kubectl annotate (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | 1つ以上のリソースのアノテーションを、追加または更新します。
`api-resources`    | `kubectl api-resources [flags]` | 利用可能なAPIリソースを一覧表示します。
`api-versions`    | `kubectl api-versions [flags]` | 利用可能なAPIバージョンを一覧表示します。
`apply`            | `kubectl apply -f FILENAME [flags]`| ファイルまたは標準出力から、リソースの設定変更を適用します。
`attach`        | `kubectl attach POD -c CONTAINER [-i] [-t] [flags]` | 実行中のコンテナにアタッチして、出力ストリームを表示するか、コンテナ(標準入力)と対話します。
`auth`    | `kubectl auth [flags] [options]` | 認可を検査します。
`autoscale`    | <code>kubectl autoscale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu-percent=CPU] [flags]</code> | ReplicationControllerで管理されているPodのセットを、自動的にスケールします。
`certificate`    | `kubectl certificate SUBCOMMAND [options]` | 証明書のリソースを変更します。
`cluster-info`    | `kubectl cluster-info [flags]` | クラスター内のマスターとサービスに関するエンドポイント情報を表示します。
`completion`    | `kubectl completion SHELL [options]` | 指定されたシェル(bashまたはzsh)のシェル補完コードを出力します。
`config`        | `kubectl config SUBCOMMAND [flags]` | kubeconfigファイルを変更します。詳細は、個々のサブコマンドを参照してください。
`convert`    | `kubectl convert -f FILENAME [options]` | 異なるAPIバージョン間で設定ファイルを変換します。YAMLとJSONに対応しています。
`cordon`    | `kubectl cordon NODE [options]` | Nodeをスケジュール不可に設定します。
`cp`    | `kubectl cp <file-spec-src> <file-spec-dest> [options]` | コンテナとの間でファイルやディレクトリをコピーします。
`create`        | `kubectl create -f FILENAME [flags]` | ファイルまたは標準出力から、1つ以上のリソースを作成します。
`delete`        | <code>kubectl delete (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label &#124; --all]) [flags]</code> | ファイル、標準出力、またはラベルセレクター、リソースセレクター、リソースを指定して、リソースを削除します。
`describe`    | <code>kubectl describe (-f FILENAME &#124; TYPE [NAME_PREFIX &#124; /NAME &#124; -l label]) [flags]</code> | 1つ以上のリソースの詳細な状態を表示します。
`diff`        | `kubectl diff -f FILENAME [flags]`| ファイルまたは標準出力と、現在の設定との差分を表示します。
`drain`    | `kubectl drain NODE [options]` | メンテナンスの準備のためにNodeをdrainします。
`edit`        | <code>kubectl edit (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [flags]</code> | デファルトのエディタを使い、サーバー上の1つ以上のリソースリソースの定義を編集し、更新します。
`events`      | `kubectl events` | イベントを一覧表示します。
`exec`        | `kubectl exec POD [-c CONTAINER] [-i] [-t] [flags] [-- COMMAND [args...]]` | Pod内のコンテナに対して、コマンドを実行します。
`explain`    | `kubectl explain  [--recursive=false] [flags]` | 様々なリソースのドキュメントを取得します。例えば、Pod、Node、Serviceなどです。
`expose`        | <code>kubectl expose (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--port=port] [--protocol=TCP&#124;UDP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type] [flags]</code> | ReplicationController、Service、Podを、新しいKubernetesサービスとして公開します。
`get`        | <code>kubectl get (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label]) [--watch] [--sort-by=FIELD] [[-o &#124; --output]=OUTPUT_FORMAT] [flags]</code> | 1つ以上のリソースを表示します。
`kustomize`    | `kubectl kustomize <dir> [flags] [options]` | kustomization.yamlファイル内の指示から生成されたAPIリソースのセットを一覧表示します。引数はファイルを含むディレクトリのPath，またはリポジトリルートに対して同じ場所を示すパスサフィックス付きのgitリポジトリのURLを指定しなければなりません。
`label`        | <code>kubectl label (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | 1つ以上のリソースのラベルを、追加または更新します。
`logs`        | `kubectl logs POD [-c CONTAINER] [--follow] [flags]` | Pod内のコンテナのログを表示します。
`options`    | `kubectl options` | すべてのコマンドに適用されるグローバルコマンドラインオプションを一覧表示します。
`patch`        | <code>kubectl patch (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --patch PATCH [flags]</code> | Strategic Merge Patchの処理を使用して、リソースの1つ以上のフィールドを更新します。
`plugin`    | `kubectl plugin [flags] [options]` | プラグインと対話するためのユーティリティを提供します。
`port-forward`    | `kubectl port-forward POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N] [flags]` | 1つ以上のローカルポートを、Podに転送します。
`proxy`        | `kubectl proxy [--port=PORT] [--www=static-dir] [--www-prefix=prefix] [--api-prefix=prefix] [flags]` | Kubernetes APIサーバーへのプロキシを実行します。
`replace`        | `kubectl replace -f FILENAME` | ファイルや標準出力から、リソースを置き換えます。
`rollout`    | `kubectl rollout SUBCOMMAND [options]` | リソースのロールアウトを管理します。有効なリソースには、Deployment、DaemonSetとStatefulSetが含まれます。
`run`        | <code>kubectl run NAME --image=image [--env="key=value"] [--port=port] [--dry-run=server&#124;client&#124;none] [--overrides=inline-json] [flags]</code> | 指定したイメージを、クラスター上で実行します。
`scale`        | <code>kubectl scale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --replicas=COUNT [--resource-version=version] [--current-replicas=count] [flags]</code> | 指定したReplicationControllerのサイズを更新します。
`set`    | `kubectl set SUBCOMMAND [options]` | アプリケーションリソースを設定します。
`taint`    | `kubectl taint NODE NAME KEY_1=VAL_1:TAINT_EFFECT_1 ... KEY_N=VAL_N:TAINT_EFFECT_N [options]` | 1つ以上のNodeのtaintを更新します。
`top`    | `kubectl top [flags] [options]` | リソース(CPU/メモリー/ストレージ)の使用量を表示します。
`uncordon`    | `kubectl uncordon NODE [options]` | Nodeをスケジュール可に設定します。
`version`        | `kubectl version [--client] [flags]` | クライアントとサーバーで実行中のKubernetesのバージョンを表示します。
`wait`    | <code>kubectl wait ([-f FILENAME] &#124; resource.group/resource.name &#124; resource.group [(-l label &#124; --all)]) [--for=delete&#124;--for condition=available] [options]</code> | 実験中の機能: 1つ以上のリソースが特定の状態になるまで待ちます。

コマンド操作について詳しく知りたい場合は、[kubectl](/docs/reference/kubectl/kubectl/)リファレンスドキュメントを参照してください。

## リソースタイプ {#resource-types}

以下の表に、サポートされているすべてのリソースと、省略されたエイリアスの一覧を示します。

(この出力は`kubectl api-resources`から取得でき、Kubernetes 1.25.0時点で正確でした。)

| リソース名 | 短縮名 | APIバージョン | 名前空間に属するか | リソースの種類 |
|---|---|---|---|---|
| `bindings` |  | v1 | true | Binding |
| `componentstatuses` | `cs` | v1 | false | ComponentStatus |
| `configmaps` | `cm` | v1 | true | ConfigMap |
| `endpoints` | `ep` | v1 | true | Endpoints |
| `events` | `ev` | v1 | true | Event |
| `limitranges` | `limits` | v1 | true | LimitRange |
| `namespaces` | `ns` | v1 | false | Namespace |
| `nodes` | `no` | v1 | false | Node |
| `persistentvolumeclaims` | `pvc` | v1 | true | PersistentVolumeClaim |
| `persistentvolumes` | `pv` | v1 | false | PersistentVolume |
| `pods` | `po` | v1 | true | Pod |
| `podtemplates` |  | v1 | true | PodTemplate |
| `replicationcontrollers` | `rc` | v1 | true | ReplicationController |
| `resourcequotas` | `quota` | v1 | true | ResourceQuota |
| `secrets` |  | v1 | true | Secret |
| `serviceaccounts` | `sa` | v1 | true | ServiceAccount |
| `services` | `svc` | v1 | true | Service |
| `mutatingwebhookconfigurations` |  | admissionregistration.k8s.io/v1 | false | MutatingWebhookConfiguration |
| `validatingwebhookconfigurations` |  | admissionregistration.k8s.io/v1 | false | ValidatingWebhookConfiguration |
| `customresourcedefinitions` | `crd,crds` | apiextensions.k8s.io/v1 | false | CustomResourceDefinition |
| `apiservices` |  | apiregistration.k8s.io/v1 | false | APIService |
| `controllerrevisions` |  | apps/v1 | true | ControllerRevision |
| `daemonsets` | `ds` | apps/v1 | true | DaemonSet |
| `deployments` | `deploy` | apps/v1 | true | Deployment |
| `replicasets` | `rs` | apps/v1 | true | ReplicaSet |
| `statefulsets` | `sts` | apps/v1 | true | StatefulSet |
| `tokenreviews` |  | authentication.k8s.io/v1 | false | TokenReview |
| `localsubjectaccessreviews` |  | authorization.k8s.io/v1 | true | LocalSubjectAccessReview |
| `selfsubjectaccessreviews` |  | authorization.k8s.io/v1 | false | SelfSubjectAccessReview |
| `selfsubjectrulesreviews` |  | authorization.k8s.io/v1 | false | SelfSubjectRulesReview |
| `subjectaccessreviews` |  | authorization.k8s.io/v1 | false | SubjectAccessReview |
| `horizontalpodautoscalers` | `hpa` | autoscaling/v2 | true | HorizontalPodAutoscaler |
| `cronjobs` | `cj` | batch/v1 | true | CronJob |
| `jobs` |  | batch/v1 | true | Job |
| `certificatesigningrequests` | `csr` | certificates.k8s.io/v1 | false | CertificateSigningRequest |
| `leases` |  | coordination.k8s.io/v1 | true | Lease |
| `endpointslices` |  | discovery.k8s.io/v1 | true | EndpointSlice |
| `events` | `ev` | events.k8s.io/v1 | true | Event |
| `flowschemas` |  | flowcontrol.apiserver.k8s.io/v1beta2 | false | FlowSchema |
| `prioritylevelconfigurations` |  | flowcontrol.apiserver.k8s.io/v1beta2 | false | PriorityLevelConfiguration |
| `ingressclasses` |  | networking.k8s.io/v1 | false | IngressClass |
| `ingresses` | `ing` | networking.k8s.io/v1 | true | Ingress |
| `networkpolicies` | `netpol` | networking.k8s.io/v1 | true | NetworkPolicy |
| `runtimeclasses` |  | node.k8s.io/v1 | false | RuntimeClass |
| `poddisruptionbudgets` | `pdb` | policy/v1 | true | PodDisruptionBudget |
| `podsecuritypolicies` | `psp` | policy/v1beta1 | false | PodSecurityPolicy |
| `clusterrolebindings` |  | rbac.authorization.k8s.io/v1 | false | ClusterRoleBinding |
| `clusterroles` |  | rbac.authorization.k8s.io/v1 | false | ClusterRole |
| `rolebindings` |  | rbac.authorization.k8s.io/v1 | true | RoleBinding |
| `roles` |  | rbac.authorization.k8s.io/v1 | true | Role |
| `priorityclasses` | `pc` | scheduling.k8s.io/v1 | false | PriorityClass |
| `csidrivers` |  | storage.k8s.io/v1 | false | CSIDriver |
| `csinodes` |  | storage.k8s.io/v1 | false | CSINode |
| `csistoragecapacities` |  | storage.k8s.io/v1 | true | CSIStorageCapacity |
| `storageclasses` | `sc` | storage.k8s.io/v1 | false | StorageClass |
| `volumeattachments` |  | storage.k8s.io/v1 | false | VolumeAttachment |

## 出力オプション

ある特定のコマンドの出力に対してフォーマットやソートを行う方法については、以下の節を参照してください。どのコマンドが様々な出力オプションをサポートしているかについては、[kubectl](/docs/reference/kubectl/kubectl/)リファレンスドキュメントをご覧ください。

### 出力のフォーマット

すべての`kubectl`コマンドのデフォルトの出力フォーマットは、人間が読みやすいプレーンテキスト形式です。特定のフォーマットで、詳細をターミナルウィンドウに出力するには、サポートされている`kubectl`コマンドに`-o`または`--output`フラグのいずれかを追加します。

#### 構文

```shell
kubectl [command] [TYPE] [NAME] -o <output_format>
```

`kubectl`の操作に応じて、以下の出力フォーマットがサポートされています。

出力フォーマット | 説明
--------------| -----------
`-o custom-columns=<spec>` | [カスタムカラム](#custom-columns)のコンマ区切りのリストを使用して、テーブルを表示します。
`-o custom-columns-file=<filename>` | `<filename>`ファイル内の[カスタムカラム](#custom-columns)のテンプレートを使用して、テーブルを表示します。
`-o json`     | JSON形式のAPIオブジェクトを出力します。
`-o jsonpath=<template>` | [jsonpath](/ja/docs/reference/kubectl/jsonpath/)式で定義されたフィールドを表示します。
`-o jsonpath-file=<filename>` | `<filename>`ファイル内の[jsonpath](/ja/docs/reference/kubectl/jsonpath/)式で定義されたフィールドを表示します。
`-o name`     | リソース名のみを表示します。
`-o wide`     | 追加情報を含めて、プレーンテキスト形式で出力します。Podの場合は、Node名が含まれます。
`-o yaml`     | YAML形式のAPIオブジェクトを出力します。

##### 例

この例において、以下のコマンドは1つのPodの詳細を、YAML形式のオブジェクトとして出力します。

```shell
kubectl get pod web-pod-13je7 -o yaml
```

各コマンドでサポートされている出力フォーマットの詳細については、[kubectl](/docs/reference/kubectl/kubectl/)リファレンスドキュメントを参照してください。

#### カスタムカラム {#custom-columns}

カスタムカラムを定義して、必要な詳細のみをテーブルに出力するには、`custom-columns`オプションを使います。カスタムカラムをインラインで定義するか、`-o custom-columns=<spec>`または`-o custom-columns-file=<filename>`のようにテンプレートファイルを使用するかを選択できます。

##### 例

インラインで定義する例は、以下の通りです。

```shell
kubectl get pods <pod-name> -o custom-columns=NAME:.metadata.name,RSRC:.metadata.resourceVersion
```

テンプレートファイルを使用して定義する例は、以下の通りです。

```shell
kubectl get pods <pod-name> -o custom-columns-file=template.txt
```

ここで、`template.txt`には以下の内容が含まれます。

```
NAME          RSRC
metadata.name metadata.resourceVersion
```
どちらのコマンドを実行した場合でも、以下の結果を得ます。

```
NAME           RSRC
submit-queue   610995
```

#### サーバーサイドカラム

`kubectl`は、サーバーからオブジェクトに関する特定のカラム情報を受け取ることをサポートしています。
つまり、与えられた任意のリソースについて、サーバーはそのリソースに関連する列や行を返し、クライアントが表示できるようにします。
これにより、サーバーが表示の詳細をカプセル化することで、同一クラスターに対して使用されているクライアント間で、一貫した人間が読みやすい出力が可能です。

この機能は、デフォルトで有効になっています。無効にするには、`kubectl get`コマンドに`--server-print=false`フラグを追加します。

##### 例

Podの状態に関する情報を表示するには、以下のようなコマンドを使用します。

```shell
kubectl get pods <pod-name> --server-print=false
```

以下のように出力されます。

```
NAME       AGE
pod-name   1m
```

### オブジェクトリストのソート

ターミナルウィンドウで、オブジェクトをソートされたリストに出力するには、サポートされている`kubectl`コマンドに`--sort-by`フラグを追加します。`--sort-by`フラグで任意の数値フィールドや文字列フィールドを指定することで、オブジェクトをソートします。フィールドの指定には、[jsonpath](/ja/docs/reference/kubectl/jsonpath/)式を使用します。

#### 構文

```shell
kubectl [command] [TYPE] [NAME] --sort-by=<jsonpath_exp>
```

##### 例

名前でソートしたPodのリストを表示するには、以下のように実行します。

```shell
kubectl get pods --sort-by=.metadata.name
```

## 例: 一般的な操作

よく使われる`kubectl`の操作に慣れるために、以下の例を使用してください。

`kubectl apply` - ファイルや標準出力から、リソースの適用や更新を行います。

```shell
# example-service.yaml内の定義を使用して、Serviceを作成します。
kubectl apply -f example-service.yaml

# example-controller.yaml内の定義を使用して、ReplicationControllerを作成します。
kubectl apply -f example-controller.yaml

# <directory>ディレクトリ内の、任意の.yaml、.yml、.jsonファイルで定義されているオブジェクトを作成します。
kubectl apply -f <directory>
```

`kubectl get` - 1つ以上のリソースの一覧を表示します。

```shell
# すべてのPodの一覧をプレーンテキスト形式で表示します。
kubectl get pods

# すべてのPodの一覧を、ノード名などの追加情報を含めて、プレーンテキスト形式で表示します。
kubectl get pods -o wide

# 指定した名前のReplicationControllerの一覧をプレーンテキスト形式で表示します。'replicationcontroller'リソースタイプを短縮して、エイリアス'rc'で置き換えることもできます。
kubectl get replicationcontroller <rc-name>

# すべてのReplicationControllerとServiceの一覧をまとめてプレーンテキスト形式で表示します。
kubectl get rc,services

# すべてのDaemonSetの一覧をプレーンテキスト形式で表示します。
kubectl get ds

# server01ノードで実行中のPodの一覧をプレーンテキスト形式で表示します。
kubectl get pods --field-selector=spec.nodeName=server01
```

`kubectl describe` - 1つ以上のリソースの詳細な状態を、デフォルトでは初期化されないものも含めて表示します。

```shell
# Node <node-name>の詳細を表示します。
kubectl describe nodes <node-name>

# Pod <pod-name>の詳細を表示します。
kubectl describe pods/<pod-name>

# ReplicationController <rc-name>が管理しているすべてのPodの詳細を表示します。
# ReplicationControllerによって作成された任意のPodには、ReplicationControllerの名前がプレフィックスとして付与されます。
kubectl describe pods <rc-name>

# すべてのPodの詳細を表示します。
kubectl describe pods
```

{{< note >}}
`kubectl get`コマンドは通常、同じリソースタイプの1つ以上のリソースを取得するために使用します。豊富なフラグが用意されており、例えば`-o`や`--output`フラグを使って、出力フォーマットをカスタマイズできます。`-w`や`--watch`フラグを指定することで、特定のオブジェクトの更新を監視できます。`kubectl describe`コマンドは、指定されたリソースに関する多くの側面を説明することに重点を置いています。ユーザーに対してビューを構築するために、APIサーバーへ複数のAPIコールを呼び出すことができます。例えば、`kubectl describe node`コマンドは、Nodeに関する情報だけでなく、その上で動いているPodやNodeで生成されたイベントなどをまとめて表示します。
{{< /note >}}

`kubectl delete` - ファイル、標準出力、または指定したラベルセレクター、名前、リソースセレクター、リソースを指定して、リソースを削除します。

```shell
# pod.yamlファイルで指定されたタイプと名前を用いて、Podを削除します。
kubectl delete -f pod.yaml

# '<label-key>=<label-value>'というラベルを持つPodとServiceをすべて削除します。
kubectl delete pods,services -l <label-key>=<label-value>

# 初期化されていないPodを含む、すべてのPodを削除します。
kubectl delete pods --all
```

`kubectl exec` - Pod内のコンテナに対してコマンドを実行します。

```shell
# Pod <pod-name>から、'date'を実行している時の出力を取得します。デフォルトでは、最初のコンテナから出力されます。
kubectl exec <pod-name> -- date

# Pod <pod-name>のコンテナ <container-name>から、'date'を実行している時の出力を取得します。
kubectl exec <pod-name> -c <container-name> -- date

# インタラクティブな TTY を取得し、Pod <pod-name>から/bin/bashを実行します。デフォルトでは、最初のコンテナから出力されます。
kubectl exec -ti <pod-name> -- /bin/bash
```

`kubectl logs` - Pod内のコンテナのログを表示します。

```shell
# Pod <pod-name>のログのスナップショットを返します。
kubectl logs <pod-name>

# Pod <pod-name>から、ログのストリーミングを開始します。Linuxの'tail -f'コマンドと似ています。
kubectl logs -f <pod-name>
```

`kubectl diff` - 提案されたクラスターに対する更新の差分を表示します。

```shell
# pod.jsonに含まれるリソースの差分を表示します。
kubectl diff -f pod.json

# 標準出力から読み込んだファイルの差分を表示します。
cat service.yaml | kubectl diff -f -
```

## 例: プラグインの作成と使用

`kubectl`プラグインの書き方や使い方に慣れるために、以下の例を使用してください。

```shell
# 任意の言語でシンプルなプラグインを作成し、生成される実行可能なファイルに
# プレフィックス"kubectl-"で始まる名前を付けます。
cat ./kubectl-hello
```
```shell
#!/bin/sh

# このプラグインは、"hello world"という単語を表示します。
echo "hello world"
```
プラグインを書いたら、実行可能にします。
```bash
chmod a+x ./kubectl-hello

# さらに、PATH内の場所に移動させます。
sudo mv ./kubectl-hello /usr/local/bin
sudo chown root:root /usr/local/bin

# これでkubectlプラグインを作成し、"インストール"できました。
# 通常のコマンドのようにkubectlから呼び出すことで、プラグインを使用できます。
kubectl hello
```
```
hello world
```

```shell
# 配置したPATHのフォルダから削除することで、プラグインを"アンインストール"できます。
sudo rm /usr/local/bin/kubectl-hello
```

`kubectl`で利用可能なプラグインをすべて表示するには、`kubectl plugin list`サブコマンドを使用してください。

```shell
kubectl plugin list
```
出力は以下のようになります。
```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-hello
/usr/local/bin/kubectl-foo
/usr/local/bin/kubectl-bar
```

`kubectl plugin list`コマンドは、実行不可能なプラグインや、他のプラグインの影に隠れてしまっているプラグインなどについて、警告することもできます。例えば、以下のようになります。
```shell
sudo chmod -x /usr/local/bin/kubectl-foo # 実行権限を削除します。
kubectl plugin list
```
```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-hello
/usr/local/bin/kubectl-foo
  - warning: /usr/local/bin/kubectl-foo identified as a plugin, but it is not executable
/usr/local/bin/kubectl-bar

error: one plugin warning was found
```

プラグインは、既存の`kubectl`コマンドの上に、より複雑な機能を構築するための手段であると考えることができます。

```shell
cat ./kubectl-whoami
```
次の例では、下記の内容を含んだ`kubectl-whoami`が既に作成済であることを前提としています。
```shell
#!/bin/bash

# このプラグインは、`kubectl config`コマンドを使って
# 現在選択されているコンテキストに基づいて、現在のユーザーに関する情報を提供します。
kubectl config view --template='{{ range .contexts }}{{ if eq .name "'$(kubectl config current-context)'" }}Current user: {{ printf "%s\n" .context.user }}{{ end }}{{ end }}'
```

上記のコマンドを実行すると、KUBECONFIGファイル内のカレントコンテキストのユーザーを含んだ出力を得られます。

```shell
# ファイルを実行可能にします。
sudo chmod +x ./kubectl-whoami

# さらに、ファイルをPATHに移動します。
sudo mv ./kubectl-whoami /usr/local/bin

kubectl whoami
Current user: plugins-user
```

## {{% heading "whatsnext" %}}

* `kubectl`リファレンスドキュメントをお読みください。
  * kubectl[コマンドリファレンス](/docs/reference/kubectl/kubectl/)
  * [コマンドライン引数](/docs/reference/generated/kubectl/kubectl-commands/)リファレンス
* [`kubectl`の使用規則](/ja/docs/reference/kubectl/conventions/)について学習してください。
* kubectlの[JSONPathのサポート](/ja/docs/reference/kubectl/jsonpath/)についてお読みください。
* [プラグインを使用して kubectl を拡張する](/docs/tasks/extend-kubectl/kubectl-plugins)方法についてお読みください。
  * プラグインについてより詳しく知りたい場合は、[example CLI plugin](https://github.com/kubernetes/sample-cli-plugin)をご覧ください。
