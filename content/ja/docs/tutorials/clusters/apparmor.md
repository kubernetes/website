---
title: AppArmorを使用してコンテナのリソースへのアクセスを制限する
content_type: tutorial
weight: 10
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.4" state="beta" >}}

AppArmorは、Linux標準のユーザー・グループをベースとしたパーミッションを補完するLinuxカーネルのセキュリティモジュールであり、プログラムのアクセスを限定されたリソースセットに制限するために利用されます。AppArmorを設定することで、任意のアプリケーションの攻撃サーフェイスとなりうる面を減らしたり、より優れた多重の防御を提供できます。AppArmorは、たとえばLinuxのcapability、ネットワークアクセス、ファイルのパーミッションなど、特定のプログラムやコンテナに必要なアクセスを許可するようにチューニングされたプロファイルにより設定を行います。各プロファイルは、許可されなかったリソースへのアクセスをブロックする*enforcing*モードと、ルール違反を報告するだけの*complain*モードのいずれかで実行できます。

AppArmorを利用すれば、コンテナに許可することを制限したりシステムログを通してよりよい監査を提供することで、デプロイをよりセキュアにする助けになります。しかし、AppArmorは銀の弾丸ではなく、アプリケーションコードの悪用からの防御を強化できるだけであることを心に留めておくことが重要です。制限の強い優れたプロファイルを提供し、アプリケーションとクラスターを別の角度から強化することが重要です。

## {{% heading "objectives" %}}

* プロファイルをノードに読み込む方法の例を見る
* Pod上でプロファイルを矯正する方法を学ぶ
* プロファイルが読み込まれたかを確認する方法を学ぶ
* プロファイルに違反した場合に何が起こるのかを見る
* プロファイルが読み込めなかった場合に何が起こるのかを見る

## {{% heading "prerequisites" %}}

以下のことを確認してください。

1. Kubernetesのバージョンがv1.4以上であること。KubernetesのAppArmorのサポートはv1.4で追加されました。v1.4より古いバージョンのKubernetesのコンポーネントは、新しいAppArmorのアノテーションを認識できないため、AppArmorの設定を与えたとしても**黙って無視されてしまいます**。Podが期待した保護を確実に受けられるようにするためには、次のようにノードのKubeletのバージョンを確認することが重要です。

   ```shell
   kubectl get nodes -o=jsonpath=$'{range .items[*]}{@.metadata.name}: {@.status.nodeInfo.kubeletVersion}\n{end}'
   ```
   ```
   gke-test-default-pool-239f5d02-gyn2: v1.4.0
   gke-test-default-pool-239f5d02-x1kf: v1.4.0
   gke-test-default-pool-239f5d02-xwux: v1.4.0
   ```

2. AppArmorカーネルモジュールが有効であること。LinuxカーネルがAppArmorプロファイルを強制するためには、AppArmorカーネルモジュールのインストールと有効化が必須です。UbuntuやSUSEなどのディストリビューションではデフォルトで有効化されますが、他の多くのディストリビューションでのサポートはオプションです。モジュールが有効になっているかチェックするには、次のように`/sys/module/apparmor/parameters/enabled`ファイルを確認します。

   ```shell
   cat /sys/module/apparmor/parameters/enabled
   Y
   ```

   KubeletがAppArmorをサポートしていれば(>= v1.4)、カーネルモジュールが有効になっていない場合にはAppArmorオプションが付いたPodを拒否します。

  {{< note >}}
  UbuntuはAppArmorに対して、アップストリームのLinuxにマージしていない多数のパッチを当てています。その中には、追加のフックや機能を加えるパッチも含まれます。Kubernetesはアップストリームのバージョンでのみテストされており、その他の機能に対するサポートを約束していません。
  {{< /note >}}

3. コンテナランタイムがAppArmorをサポートしていること。現在、Kubernetesがサポートするすべての一般的なコンテナランタイム、{{< glossary_tooltip term_id="docker">}}、{{< glossary_tooltip term_id="cri-o" >}}、{{< glossary_tooltip term_id="containerd" >}}などは、AppArmorをサポートしています。関連するランタイムのドキュメントを参照して、クラスターがAppArmorを利用するための要求を満たしているかどうかを検証してください。

4. プロファイルが読み込まれていること。AppArmorがPodに適用されるのは、各コンテナが実行されるべきAppArmorプロファイルを指定したときです。もし指定されたプロファイルがまだカーネルに読み込まれていなければ、Kubelet(>= v1.4)はPodを拒否します。どのプロファイルがノードに読み込まれているのかを確かめるには、次のようなコマンドを実行して`/sys/kernel/security/apparmor/profiles`をチェックします。

   ```shell
   ssh gke-test-default-pool-239f5d02-gyn2 "sudo cat /sys/kernel/security/apparmor/profiles | sort"
   ```
   ```
   apparmor-test-deny-write (enforce)
   apparmor-test-audit-write (enforce)
   docker-default (enforce)
   k8s-nginx (enforce)
   ```

   ノード上でのプロファイルの読み込みの詳細については、[プロファイルを使用したノードのセットアップ](#setting-up-nodes-with-profiles)を参照してください。

KubeletのバージョンがAppArmorサポートに対応しているもの(>= v1.4)である限り、Kubeletは必要条件を1つでも満たさないAppArmorオプションが付けられたPodをリジェクトします。また、ノード上のAppArmorのサポートは、次のようにready conditionのメッセージで確認することもできます(ただし、この機能は将来のリリースで削除される可能性があります)。

```shell
kubectl get nodes -o=jsonpath=$'{range .items[*]}{@.metadata.name}: {.status.conditions[?(@.reason=="KubeletReady")].message}\n{end}'
```
```
gke-test-default-pool-239f5d02-gyn2: kubelet is posting ready status. AppArmor enabled
gke-test-default-pool-239f5d02-x1kf: kubelet is posting ready status. AppArmor enabled
gke-test-default-pool-239f5d02-xwux: kubelet is posting ready status. AppArmor enabled
```

<!-- lessoncontent -->

## Podをセキュアにする

{{< note >}}
AppArmorは現在beta版であるため、オプションはアノテーションとして指定します。将来サポートが一般利用可能(GA)になれば、アノテーションは第1級のフィールドで置き換えられます(詳細については、[一般利用可能(General Availability)への更新パス](#upgrade-path-to-general-availability)を参照してください)。
{{< /note >}}

AppArmorのプロファイルは*各コンテナごとに*指定します。Podのコンテナで実行するAppArmorのプロファイルを指定するには、Podのメタデータに次のようなアノテーションを追加します。

```yaml
container.apparmor.security.beta.kubernetes.io/<container_name>: <profile_ref>
```

ここで、`<container_name>`はプロファイルを適用するコンテナの名前であり、`<profile_ref>`には適用するプロファイルを指定します。`profile_ref`は次の値のうち1つを指定します。

* `runtime/default`: ランタイムのデフォルトのプロファイルを適用する
* `localhost/<profile_name>`: `<profile_name>`という名前でホストにロードされたプロファイルを適用する
* `unconfined`: いかなるプロファイルもロードされないことを示す

アノテーションとプロファイルの名前のフォーマットの詳細については、[APIリファレンス](#api-reference)を参照してください。

KubernetesのAppArmorの強制では、まずはじめにすべての前提条件が満たされているかどうかをチェックします。その後、強制を行うためにプロファイルの選択をコンテナランタイムに委ねます。前提条件が満たされなかった場合、Podはリジェクトされ、実行されません。

プロファイルが適用されたかどうか確認するには、AppArmor securityオプションがコンテナ作成イベントに一覧されているかどうかを確認します。

```shell
kubectl get events | grep Created
```
```
22s        22s         1         hello-apparmor     Pod       spec.containers{hello}   Normal    Created     {kubelet e2e-test-stclair-node-pool-31nt}   Created container with docker id 269a53b202d3; Security:[seccomp=unconfined apparmor=k8s-apparmor-example-deny-write]
```

proc attrを調べることで、コンテナのルートプロセスが正しいプロファイルで実行されているかどうかを直接確認することもできます。

```shell
kubectl exec <pod_name> cat /proc/1/attr/current
```
```
k8s-apparmor-example-deny-write (enforce)
```

## 例 {#example}

*この例は、クラスターがすでにAppArmorのサポート付きでセットアップ済みであることを前提としています。*

まず、使用したいプロファイルをノード上に読み込む必要があります。このプロファイルは、すべてのファイル書き込みを拒否します。

```shell
#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # Deny all file writes.
  deny /** w,
}
```

Podがどのノードにスケジュールされるかは予測できないため、プロファイルはすべてのノードに読み込ませる必要があります。この例では、単純にSSHを使ってプロファイルをインストールしますが、[プロファイルを使用したノードのセットアップ](#setting-up-nodes-with-profiles)では、他のアプローチについて議論しています。

```shell
NODES=(
    # SSHでアクセス可能なノードのドメイン名
    gke-test-default-pool-239f5d02-gyn2.us-central1-a.my-k8s
    gke-test-default-pool-239f5d02-x1kf.us-central1-a.my-k8s
    gke-test-default-pool-239f5d02-xwux.us-central1-a.my-k8s)
for NODE in ${NODES[*]}; do ssh $NODE 'sudo apparmor_parser -q <<EOF
#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # Deny all file writes.
  deny /** w,
}
EOF'
done
```

次に、deny-writeプロファイルを使用した単純な "Hello AppArmor" Podを実行します。

{{< codenew file="pods/security/hello-apparmor.yaml" >}}

```shell
kubectl create -f ./hello-apparmor.yaml
```

Podイベントを確認すると、PodコンテナがAppArmorプロファイル "k8s-apparmor-example-deny-write" を使用して作成されたことがわかります。

```shell
kubectl get events | grep hello-apparmor
```
```
14s        14s         1         hello-apparmor   Pod                                Normal    Scheduled   {default-scheduler }                           Successfully assigned hello-apparmor to gke-test-default-pool-239f5d02-gyn2
14s        14s         1         hello-apparmor   Pod       spec.containers{hello}   Normal    Pulling     {kubelet gke-test-default-pool-239f5d02-gyn2}   pulling image "busybox"
13s        13s         1         hello-apparmor   Pod       spec.containers{hello}   Normal    Pulled      {kubelet gke-test-default-pool-239f5d02-gyn2}   Successfully pulled image "busybox"
13s        13s         1         hello-apparmor   Pod       spec.containers{hello}   Normal    Created     {kubelet gke-test-default-pool-239f5d02-gyn2}   Created container with docker id 06b6cd1c0989; Security:[seccomp=unconfined apparmor=k8s-apparmor-example-deny-write]
13s        13s         1         hello-apparmor   Pod       spec.containers{hello}   Normal    Started     {kubelet gke-test-default-pool-239f5d02-gyn2}   Started container with docker id 06b6cd1c0989
```

コンテナがこのプロファイルで実際に実行されていることを確認するために、コンテナのproc attrをチェックします。

```shell
kubectl exec hello-apparmor cat /proc/1/attr/current
```
```
k8s-apparmor-example-deny-write (enforce)
```

最後に、ファイルへの書き込みを行おうとすることで、プロファイルに違反すると何が起こるか見てみましょう。

```shell
kubectl exec hello-apparmor touch /tmp/test
```
```
touch: /tmp/test: Permission denied
error: error executing remote command: command terminated with non-zero exit code: Error executing in Docker Container: 1
```

まとめとして、読み込まれていないプロファイルを指定しようとするとどうなるのか見てみましょう。

```shell
kubectl create -f /dev/stdin <<EOF
```
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: hello-apparmor-2
  annotations:
    container.apparmor.security.beta.kubernetes.io/hello: localhost/k8s-apparmor-example-allow-write
spec:
  containers:
  - name: hello
    image: busybox
    command: [ "sh", "-c", "echo 'Hello AppArmor!' && sleep 1h" ]
EOF
pod/hello-apparmor-2 created
```

```shell
kubectl describe pod hello-apparmor-2
```
```
Name:          hello-apparmor-2
Namespace:     default
Node:          gke-test-default-pool-239f5d02-x1kf/
Start Time:    Tue, 30 Aug 2016 17:58:56 -0700
Labels:        <none>
Annotations:   container.apparmor.security.beta.kubernetes.io/hello=localhost/k8s-apparmor-example-allow-write
Status:        Pending
Reason:        AppArmor
Message:       Pod Cannot enforce AppArmor: profile "k8s-apparmor-example-allow-write" is not loaded
IP:
Controllers:   <none>
Containers:
  hello:
    Container ID:
    Image:     busybox
    Image ID:
    Port:
    Command:
      sh
      -c
      echo 'Hello AppArmor!' && sleep 1h
    State:              Waiting
      Reason:           Blocked
    Ready:              False
    Restart Count:      0
    Environment:        <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-dnz7v (ro)
Conditions:
  Type          Status
  Initialized   True
  Ready         False
  PodScheduled  True
Volumes:
  default-token-dnz7v:
    Type:    Secret (a volume populated by a Secret)
    SecretName:    default-token-dnz7v
    Optional:   false
QoS Class:      BestEffort
Node-Selectors: <none>
Tolerations:    <none>
Events:
  FirstSeen    LastSeen    Count    From                        SubobjectPath    Type        Reason        Message
  ---------    --------    -----    ----                        -------------    --------    ------        -------
  23s          23s         1        {default-scheduler }                         Normal      Scheduled     Successfully assigned hello-apparmor-2 to e2e-test-stclair-node-pool-t1f5
  23s          23s         1        {kubelet e2e-test-stclair-node-pool-t1f5}             Warning        AppArmor    Cannot enforce AppArmor: profile "k8s-apparmor-example-allow-write" is not loaded
```

PodのステータスはPendingとなり、`Pod Cannot enforce AppArmor: profile
"k8s-apparmor-example-allow-write" is not loaded`(PodはAppArmorを強制できません: プロファイル "k8s-apparmor-example-allow-write" はロードされていません)という役に立つエラーメッセージが表示されています。同じメッセージのイベントも記録されています。

## 管理

### プロファイルを使用したノードのセットアップ {#setting-up-nodes-with-profiles}

現在、KubernetesはAppArmorのプロファイルをノードに読み込むネイティブの仕組みは提供していません。しかし、プロファイルをセットアップする方法は、以下のように様々な方法があります。

* 各ノード上に正しいプロファイルがロードされていることを保証するPodを実行する[DaemonSet](/ja/docs/concepts/workloads/controllers/daemonset/)を利用する方法。[ここ](https://git.k8s.io/kubernetes/test/images/apparmor-loader)に実装例があります。
* ノードの初期化時に初期化スクリプト(例: Salt、Ansibleなど)や初期化イメージを使用する。
* [例](#example)で示したような方法で、プロファイルを各ノードにコピーし、SSHで読み込む。

スケジューラーはどのプロファイルがどのノードに読み込まれているのかがわからないため、すべてのプロファイルがすべてのノードに読み込まれていなければなりません。もう1つのアプローチとしては、各プロファイル(あるいはプロファイルのクラス)ごとにノードラベルを追加し、[node selector](/ja/docs/concepts/scheduling-eviction/assign-pod-node/)を用いてPodが必要なプロファイルを読み込んだノードで実行されるようにする方法もあります。

### PodSecurityPolicyを使用したプロファイルの制限

PodSecurityPolicy extensionが有効になっている場合、クラスタ全体でAppArmorn制限が適用されます。PodSecurityPolicyを有効にするには、`apiserver`上で次のフラグを設定する必要があります。

```
--enable-admission-plugins=PodSecurityPolicy[,others...]
```

AppArmorのオプションはPodSecurityPolicy上でアノテーションとして指定します。

```yaml
apparmor.security.beta.kubernetes.io/defaultProfileName: <profile_ref>
apparmor.security.beta.kubernetes.io/allowedProfileNames: <profile_ref>[,others...]
```

defaultProfileNameオプションには、何も指定されなかった場合にコンテナにデフォルトで適用されるプロファイルを指定します。allowedProfileNamesオプションには、Podコンテナの実行が許可されるプロファイルのリストを指定します。両方のオプションが指定された場合、デフォルトは許可されなければいけません。プロファイルはコンテナ上で同じフォーマットで指定されます。完全な仕様については、[APIリファレンス](#api-reference)を参照してください。

### AppArmorの無効化

クラスタ上でAppArmorを利用可能にしたくない場合、次のコマンドラインフラグで無効化できます。

```
--feature-gates=AppArmor=false
```

無効化すると、AppArmorプロファイルを含むPodは"Forbidden"エラーで検証に失敗します。ただし、デフォルトのdockerは非特権Pod上では"docker-default"というプロファイルを常に有効化し(AppArmorカーネルモジュールが有効である場合)、フィーチャーゲートで無効化したとしても有効化し続けることに注意してください。AppArmorを無効化するオプションは、AppArmorが一般利用(GA)になったときに削除される予定です。

### AppArmorを使用するKubernetes v1.4にアップグレードする

クラスタをv1.4にアップグレードするために、AppArmorに関する操作は必要ありません。ただし、既存のPodがAppArmorのアノテーションを持っている場合、検証(またはPodSecurityPolicy admission)は行われません。もしpermissiveなプロファイルがノードに読み込まれていた場合、悪意のあるユーザーがPodの権限を上述のdocker-defaultより昇格させるために、permissiveなプロファイルを再適用する恐れがあります。これが問題となる場合、`apparmor.security.beta.kubernetes.io`のアノテーションを含むすべてのPodのクラスターをクリーンアップすることを推奨します。

### 一般利用可能(General Availability)への更新パス {#upgrade-path-to-general-availability}

AppArmorが一般利用可能(GA)になったとき、現在アノテーションで指定しているオプションはフィールドに変換されます。移行中のすべてのアップグレードとダウングレードの経路をサポートするのは非常に微妙であるため、以降が必要になったときに詳細に説明する予定です。最低2リリースの間はフィールドとアノテーションの両方がサポートされるようにする予定です。最低2リリースの後は、アノテーションは明示的に拒否されるようになります。

## Profilesの作成

AppArmorのプロファイルを正しく指定するのはやっかいな作業です。幸い、その作業を補助するツールがいくつかあります。

* `aa-genprof`および`aa-logprof`は、アプリケーションの動作とログを監視することによりプロファイルのルールを生成します。詳しい説明については、[AppArmor documentation](https://gitlab.com/apparmor/apparmor/wikis/Profiling_with_tools)を参照してください。
* [bane](https://github.com/jfrazelle/bane)は、Docker向けのAppArmorのプロファイル・ジェネレータです。簡略化されたプロファイル言語を使用しています。

プロファイルの生成には、アプリケーションを開発用ワークステーション上でDockerで実行することを推奨します。しかし、実際にPodが実行されるKubernetesノード上でツールを実行してはいけない理由はありません。

AppArmorに関する問題をデバッグするには、システムログをチェックして、特に何が拒否されたのかを確認できます。AppArmorのログは`dmesg`にverboseメッセージを送り、エラーは通常システムログまたは`journalctl`で確認できます。詳しい情報は、[AppArmor failures](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Failures)で提供されています。

## APIリファレンス {#api-reference}

### Podアノテーション

コンテナが実行するプロファイルを指定します。

- **key**: `container.apparmor.security.beta.kubernetes.io/<container_name>`
  ここで、`<container_name>`はPod内のコンテナの名前を一致させます。Pod内の各コンテナごとに別々のプロファイルを指定できます。
- **value**: 下で説明するプロファイルのリファレンス

### プロファイルのリファレンス

- `runtime/default`: デフォルトのランタイムプロファイルを指します。
  - (PodSecurityPolicyのデフォルトを設定せずに)プロファイルを指定しない場合と同等ですが、AppArmorを有効化する必要があります。
  - Dockerの場合、非特権コンテナでは[`docker-default`](https://docs.docker.com/engine/security/apparmor/)プロファイルが選択され、特権コンテナではunconfined(プロファイルなし)が選択されます。
- `localhost/<profile_name>`: 名前で指定されたノード(localhost)に読み込まれたプロファイルを指します。
  - 利用できるプロファイル名の詳細は[core policy reference](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Core_Policy_Reference#profile-names-and-attachment-specifications)で説明されています。
- `unconfined`: これは実質的にコンテナ上のAppArmorを無効化します。

これ以外のプロファイルリファレンスはすべて無効です。

### PodSecurityPolicyアノテーション

何も指定されなかった場合にコンテナに適用するデフォルトのプロファイルは、以下のように指定します。

* **key**: `apparmor.security.beta.kubernetes.io/defaultProfileName`
* **value**: 上で説明したプロファイルのリファレンス

Podコンテナが指定することを許可するプロファイルのリストは、以下のように指定します。

* **key**: `apparmor.security.beta.kubernetes.io/allowedProfileNames`
* **value**: カンマ区切りの上述のプロファイルリファレンスのリスト
  - プロファイル名ではエスケープしたカンマは不正な文字ではありませんが、ここでは明示的に許可されません。

## {{% heading "whatsnext" %}}

追加のリソースとしては以下のものがあります。

* [Quick guide to the AppArmor profile language](https://gitlab.com/apparmor/apparmor/wikis/QuickProfileLanguage)
* [AppArmor core policy reference](https://gitlab.com/apparmor/apparmor/wikis/Policy_Layout)
