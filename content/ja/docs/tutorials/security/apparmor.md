---
title: AppArmorを使用してコンテナのリソースへのアクセスを制限する
content_type: tutorial
weight: 30
---

<!-- overview -->

{{< feature-state feature_gate_name="AppArmor" >}}

このページでは、ノードでAppArmorプロファイルを読み込み、それらのプロファイルをPodに適用する方法を説明します。
AppArmorを使用してPodを制限するKubernetesの仕組みについて詳しく知りたい場合は、[PodとコンテナのためのLinuxカーネルのセキュリティ制約](/docs/concepts/security/linux-kernel-security-constraints/#apparmor)をご覧ください。

## {{% heading "objectives" %}}


* プロファイルをノードに読み込む方法の例を見る
* Pod上でプロファイルを強制する方法を学ぶ
* プロファイルが読み込まれたかを確認する方法を学ぶ
* プロファイルに違反した場合に何が起こるのかを見る
* プロファイルが読み込めなかった場合に何が起こるのかを見る



## {{% heading "prerequisites" %}}


AppArmorはカーネルモジュールおよびKubernetesのオプション機能です。
そのため、先に進む前にノード上でAppArmorがサポートされていることを確認してください:

1. AppArmorカーネルモジュールが有効であること。
   LinuxカーネルがAppArmorプロファイルを強制するためには、AppArmorカーネルモジュールのインストールと有効化が必須です。
   UbuntuやSUSEなどのディストリビューションではデフォルトで有効化されますが、他の多くのディストリビューションでのサポートはオプションです。
   モジュールが有効になっているかどうかを確認するためには、`/sys/module/apparmor/parameters/enabled`ファイルを確認します:

   ```shell
   cat /sys/module/apparmor/parameters/enabled
   Y
   ```

   Kubeletは、AppArmorが明示的に設定されたPodを受け入れる前にホスト上でAppArmorが有効になっているかどうかを検証します。

1. コンテナランタイムがAppArmorをサポートしていること。
   Kubernetesがサポートする{{< glossary_tooltip term_id="containerd">}}や{{< glossary_tooltip term_id="cri-o" >}}などのすべての一般的なコンテナランタイムは、AppArmorをサポートしています。
   関連するランタイムのドキュメントを参照して、クラスターがAppArmorを利用するための要求を満たしているかどうかを検証してください。

1. プロファイルが読み込まれていること。
   AppArmorがPodに適用されるのは、各コンテナが実行するAppArmorプロファイルを指定したときです。
   もし指定されたプロファイルがまだカーネルに読み込まれていなければ、KubeletはPodを拒否します。
   どのプロファイルがノードに読み込まれているのかを確かめるには、`/sys/kernel/security/apparmor/profiles`を確認します。
   例えば:

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

<!-- lessoncontent -->

## Podをセキュアにする

{{< note >}}
Kubernetes v1.30より前では、AppArmorはアノテーションを通じて指定されていました。
この非推奨となったAPIに関するドキュメントを表示するには、ドキュメントのバージョンセレクターを使用してください。
{{< /note >}}

AppArmorプロファイルは、Podレベルまたはコンテナレベルで指定することができます。
コンテナのAppArmorプロファイルは、Podのプロファイルよりも優先されます。

```yaml
securityContext:
  appArmorProfile:
    type: <profile_type>
```

ここで、`<profile_type>`には次の値のうち1つを指定します:

* `RuntimeDefault`: ランタイムのデフォルトのプロファイルを適用します。
* `Localhost`: ホストに読み込まれたプロファイルを適用します(下記を参照してください)。
* `unconfined`: AppArmorなしで実行します。

AppArmorプロファイルAPIの詳細については、[AppArmorによる制限の指定](#specifying-apparmor-confinement)を参照してください。

プロファイルが適用されたかどうかを確認するには、proc attrを調べることでコンテナのルートプロセスが正しいプロファイルで実行されているかどうかを確認します:

```shell
kubectl exec <pod_name> -- cat /proc/1/attr/current
```

出力は以下のようになるはずです:

```
cri-containerd.apparmor.d (enforce)
```

## 例 {#example}

*この例は、クラスターがすでにAppArmorのサポート付きでセットアップ済みであることを前提としています。*

まず、使用したいプロファイルをノード上に読み込む必要があります。
このプロファイルは、すべてのファイル書き込みを拒否します:

```
#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # Deny all file writes.
  deny /** w,
}
```

Podがどのノードにスケジュールされるかは予測できないため、プロファイルはすべてのノードに読み込ませる必要があります。
この例では、単純にSSHを使ってプロファイルをインストールしますが、[プロファイルを使用したノードのセットアップ](#setting-up-nodes-with-profiles)では、他のアプローチについて議論しています。

```shell
# この例では、ノード名がホスト名と一致し、SSHで到達可能であることを前提としています。
NODES=($( kubectl get node -o jsonpath='{.items[*].status.addresses[?(.type == "Hostname")].address}' ))

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

次に、deny-writeプロファイルを使用した単純な"Hello AppArmor" Podを実行します。

{{% code_sample file="pods/security/hello-apparmor.yaml" %}}

```shell
kubectl create -f hello-apparmor.yaml
```

`/proc/1/attr/current`を確認することで、コンテナがこのプロファイルで実際に実行されていることを検証できます:

```shell
kubectl exec hello-apparmor -- cat /proc/1/attr/current
```

出力は以下のようになるはずです:
```
k8s-apparmor-example-deny-write (enforce)
```

最後に、ファイルへの書き込みを行おうとすることで、プロファイルに違反すると何が起こるか見てみましょう:

```shell
kubectl exec hello-apparmor -- touch /tmp/test
```
```
touch: /tmp/test: Permission denied
error: error executing remote command: command terminated with non-zero exit code: Error executing in Docker Container: 1
```

まとめとして、読み込まれていないプロファイルを指定しようとするとどうなるのか見てみましょう:

```shell
kubectl create -f /dev/stdin <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: hello-apparmor-2
spec:
  securityContext:
    appArmorProfile:
      type: Localhost
      localhostProfile: k8s-apparmor-example-allow-write
  containers:
  - name: hello
    image: busybox:1.28
    command: [ "sh", "-c", "echo 'Hello AppArmor!' && sleep 1h" ]
EOF
```
```
pod/hello-apparmor-2 created
```

Podは正常に作成されましたが、さらに調査すると、PodがPendingで止まっていることがわかります:

```shell
kubectl describe pod hello-apparmor-2
```
```
Name:          hello-apparmor-2
Namespace:     default
Node:          gke-test-default-pool-239f5d02-x1kf/10.128.0.27
Start Time:    Tue, 30 Aug 2016 17:58:56 -0700
Labels:        <none>
Annotations:   container.apparmor.security.beta.kubernetes.io/hello=localhost/k8s-apparmor-example-allow-write
Status:        Pending
... 
Events:
  Type     Reason     Age              From               Message
  ----     ------     ----             ----               -------
  Normal   Scheduled  10s              default-scheduler  Successfully assigned default/hello-apparmor to gke-test-default-pool-239f5d02-x1kf
  Normal   Pulled     8s               kubelet            Successfully pulled image "busybox:1.28" in 370.157088ms (370.172701ms including waiting)
  Normal   Pulling    7s (x2 over 9s)  kubelet            Pulling image "busybox:1.28"
  Warning  Failed     7s (x2 over 8s)  kubelet            Error: failed to get container spec opts: failed to generate apparmor spec opts: apparmor profile not found k8s-apparmor-example-allow-write
  Normal   Pulled     7s               kubelet            Successfully pulled image "busybox:1.28" in 90.980331ms (91.005869ms including waiting)
```

イベントにはエラーメッセージとその理由が表示されます。
具体的な文言はランタイムによって異なります:
```
  Warning  Failed     7s (x2 over 8s)  kubelet            Error: failed to get container spec opts: failed to generate apparmor spec opts: apparmor profile not found 
```

## 管理

### プロファイルを使用したノードのセットアップ {#setting-up-nodes-with-profiles}

Kubernetes {{< skew currentVersion >}}は、AppArmorプロファイルをノードに読み込むネイティブの仕組みは提供していません。
プロファイルは、カスタムインフラストラクチャーや[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator)などのツールを通じて読み込むことができます。

スケジューラーはどのプロファイルがどのノードに読み込まれているのかがわからないため、すべてのプロファイルがすべてのノードに読み込まれていなければなりません。
もう1つのアプローチとしては、各プロファイル(あるいはプロファイルのクラス)ごとにノードラベルを追加し、[ノードセレクター](/ja/docs/concepts/scheduling-eviction/assign-pod-node/)を用いてPodが必要なプロファイルを読み込んだノードで実行されるようにする方法もあります。

## Profilesの作成

AppArmorプロファイルを正しく指定するのはやっかいな作業です。
幸い、その作業を補助するツールがいくつかあります:

* `aa-genprof`および`aa-logprof`は、アプリケーションの動作とログを監視し、実行されるアクションを許可することで、プロファイルのルールを生成します。
  詳しい説明については、[AppArmor documentation](https://gitlab.com/apparmor/apparmor/wikis/Profiling_with_tools)を参照してください。
* [bane](https://github.com/jfrazelle/bane)は、Docker向けのAppArmorプロファイル・ジェネレーターです。簡略化されたプロファイル言語を使用しています。

AppArmorに関する問題をデバッグするには、システムログを確認して、特に何が拒否されたのかを確認できます。
AppArmorのログは`dmesg`にverboseメッセージを送り、エラーは通常システムログまたは`journalctl`で確認できます。
詳しい情報は、[AppArmor failures](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Failures)で提供されています。


## AppArmorによる制限の指定 {#specifying-apparmor-confinement}

{{< caution >}}
Kubernetes v1.30より前では、AppArmorはアノテーションを通じて指定されていました。
この非推奨となったAPIに関するドキュメントを表示するには、ドキュメントのバージョンセレクターを使用してください。
{{< /caution >}}

### セキュリティコンテキスト内のAppArmorプロファイル {#appArmorProfile}

`appArmorProfile`は、コンテナの`securityContext`またはPodの`securityContext`のいずれかで指定できます。
プロファイルがPodレベルで設定されている場合、Pod内のすべてのコンテナ(initコンテナ、サイドカーコンテナ、およびエフェメラルコンテナを含む)のデフォルトのプロファイルとして使用されます。
Podとコンテナの両方でAppArmorプロファイルが設定されている場合は、コンテナのプロファイルが使用されます。

AppArmorプロファイルには2つのフィールドがあります:

`type` _(必須)_ - 適用されるAppArmorプロファイルの種類を示します。
有効なオプションは以下の通りです:

`Localhost`
: ノードに事前に読み込まれているプロファイル(`localhostProfile`で指定します)。

`RuntimeDefault`
: コンテナランタイムのデフォルトのプロファイル。

`Unconfined`
: AppArmorによる制限を適用しません。

`localhostProfile` - ノード上に読み込まれている、使用すべきプロファイルの名前。
このプロファイルは、ノード上であらかじめ設定されている必要があります。
このオプションは、`type`が`Localhost`の場合にのみ指定する必要があります。


## {{% heading "whatsnext" %}}


追加のリソースとしては以下のものがあります:

* [Quick guide to the AppArmor profile language](https://gitlab.com/apparmor/apparmor/wikis/QuickProfileLanguage)
* [AppArmor core policy reference](https://gitlab.com/apparmor/apparmor/wikis/Policy_Layout)
