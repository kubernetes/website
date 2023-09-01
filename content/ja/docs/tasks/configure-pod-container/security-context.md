---
title: Podとコンテナにセキュリティコンテキストを設定する
content_type: task
weight: 110
---

<!-- overview -->

セキュリティコンテキストはPod・コンテナの特権やアクセスコントロールの設定を定義します。
セキュリティコンテキストの設定には以下のものが含まれますが、これらに限定はされません。

* 任意アクセス制御: [user ID (UID) と group ID (GID)](https://wiki.archlinux.org/index.php/users_and_groups)に基づいて、ファイルなどのオブジェクトに対する許可を行います。

* [Security Enhanced Linux (SELinux)](https://ja.wikipedia.org/wiki/Security-Enhanced_Linux):
  オブジェクトにセキュリティラベルを付与します。

* 特権または非特権として実行します。

* [Linux Capabilities](https://linux-audit.com/linux-capabilities-hardening-linux-binaries-by-removing-setuid/):
  rootユーザーのすべての特権ではなく、一部の特権をプロセスに与えます。

* [AppArmor](/docs/tutorials/security/apparmor/):
  プロファイルを用いて、個々のプログラムのcapabilityを制限します。

* [Seccomp](/docs/tutorials/security/seccomp/): プロセスのシステムコールを限定します。

* `allowPrivilegeEscalation`: あるプロセスが親プロセスよりも多くの特権を得ることができるかを制御します。 この真偽値は、コンテナプロセスに
  [`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt)
  フラグが設定されるかどうかを直接制御します。
  コンテナが以下の場合、`allowPrivilegeEscalation`は常にtrueになります。
  - コンテナが特権で動いている
  - `CAP_SYS_ADMIN`を持っている

* `readOnlyRootFilesystem`: コンテナのルートファイルシステムが読み取り専用でマウントされます。

上記の項目は全てのセキュリティコンテキスト設定を記載しているわけではありません。
より広範囲なリストは[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)を確認してください。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Podにセキュリティコンテキストを設定する

Podにセキュリティ設定を行うには、Podの設定に`securityContext`フィールドを追加してください。
`securityContext`フィールドは[PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core)オブジェクトが入ります。
Podに設定したセキュリティ設定はPod内の全てのコンテナに適用されます。こちらは`securityContext`と`emptyDir`ボリュームを持ったPodの設定ファイルです。

{{< codenew file="pods/security/security-context.yaml" >}}

設定ファイルの中の`runAsUser`フィールドは、Pod内のコンテナに対して全てのプロセスをユーザーID 1000で実行するように指定します。
`runAsGroup`フィールドはPod内のコンテナに対して全てのプロセスをプライマリーグループID 3000で実行するように指定します。このフィールドが省略されたときは、コンテナのプライマリーグループIDはroot(0)になります。`runAsGroup`が指定されている場合、作成されたファイルもユーザー1000とグループ3000の所有物になります。
また`fsGroup`も指定されているため、全てのコンテナ内のプロセスは補助グループID 2000にも含まれます。`/data/demo`ボリュームとこのボリュームに作成されたファイルはグループID 2000になります。

Podを作成してみましょう。

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context.yaml
```

Podのコンテナが実行されていることを確認します。

```shell
kubectl get pod security-context-demo
```

実行中のコンテナでshellを取ります。

```shell
kubectl exec -it security-context-demo -- sh
```

shellで、実行中のプロセスの一覧を確認します。

```shell
ps
```

`runAsUser`で指定した値である、ユーザー1000でプロセスが実行されていることが確認できます。

```none
PID   USER     TIME  COMMAND
    1 1000      0:00 sleep 1h
    6 1000      0:00 sh
...
```

shellで`/data`に入り、ディレクトリの一覧を確認します。

```shell
cd /data
ls -l
```

`fsGroup`で指定した値であるグループID 2000で`/data/demo`ディレクトリが作成されていることが確認できます。

```none
drwxrwsrwx 2 root 2000 4096 Jun  6 20:08 demo
```

shellで`/data/demo`に入り、ファイルを作成します。

```shell
cd demo
echo hello > testfile
```

`/data/demo`ディレクトリでファイルの一覧を確認します。

```shell
ls -l
```

`fsGroup`で指定した値であるグループID 2000で`testfile`が作成されていることが確認できます。

```none
-rw-r--r-- 1 1000 2000 6 Jun  6 20:08 testfile
```

以下のコマンドを実行してください。

```shell
id
```

出力はこのようになります。

```none
uid=1000 gid=3000 groups=2000
```

出力から`runAsGroup`フィールドと同じく`gid`が3000になっていることが確認できるでしょう。`runAsGroup`が省略された場合、`gid`は0(root)になり、そのプロセスはグループroot(0)とグループroot(0)に必要なグループパーミッションを持つグループが所有しているファイルを操作することができるようになります。

shellから抜けましょう。

```shell
exit
```

## Podのボリュームパーミッションと所有権変更ポリシーを設定する

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

デフォルトでは、Kubernetesはボリュームがマウントされたときに、Podの`securityContext`で指定された`fsGroup`に合わせて再帰的に各ボリュームの中の所有権とパーミッションを変更します。
大きなボリュームでは所有権の確認と変更に時間がかかり、Podの起動が遅くなります。
`securityContext`の中の`fsGroupChangePolicy`フィールドを設定することで、Kubernetesがボリュームの所有権・パーミッションの確認と変更をどう行うかを管理することができます。

**fsGroupChangePolicy** - `fsGroupChangePolicy`は、ボリュームがPod内部で公開される前に所有権とパーミッションを変更するための動作を定義します。
  このフィールドは`fsGroup`で所有権とパーミッションを制御することができるボリュームタイプにのみ適用されます。このフィールドは以下の2つの値を取ります。

* _OnRootMismatch_: ルートディレクトリのパーミッションと所有権がボリュームに設定したパーミッションと一致しない場合のみ、パーミッションと所有権を変更します。ボリュームの所有権とパーミッションを変更するのにかかる時間が短くなる可能性があります。
* _Always_: ボリュームがマウントされたときに必ずパーミッションと所有権を変更します。

例：

```yaml
securityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: "OnRootMismatch"
```

{{< note >}}
このフィールドは
[`secret`](/docs/concepts/storage/volumes/#secret)、
[`configMap`](/docs/concepts/storage/volumes/#configmap)、
[`emptydir`](/docs/concepts/storage/volumes/#emptydir)
のようなエフェメラルボリュームタイプに対しては効果がありません。
{{< /note >}}

## CSIドライバーにボリュームパーミッションと所有権を移譲する

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

`VOLUME_MOUNT_GROUP` `NodeServiceCapability`をサポートしている[Container Storage Interface (CSI)](https://github.com/container-storage-interface/spec/blob/master/spec.md)ドライバーをデプロイした場合、`securityContext`の`fsGroup`で指定された値に基づいてKubernetesの代わりにCSIドライバーがファイルの所有権とパーミッションの設定処理を行います。
この場合Kubernetesは所有権とパーミッションの設定を行わないため`fsGroupChangePolicy`は無効となり、CSIで指定されている通りドライバーは`fsGroup`に従ってボリュームをマウントすると考えられるため、ボリュームは`fsGroup`に従って読み取り・書き込み可能になります。

## コンテナにセキュリティコンテキストを設定する

コンテナに対してセキュリティ設定を行うには、コンテナマニフェストに`securityContext`フィールドを含めてください。`securityContext`フィールドには[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)オブジェクトが入ります。
コンテナに指定したセキュリティ設定は個々のコンテナに対してのみ反映され、Podレベルの設定を上書きします。コンテナの設定はPodのボリュームに対しては影響しません。

こちらは一つのコンテナを持つPodの設定ファイルです。Podもコンテナも`securityContext`フィールドを含んでいます。

{{< codenew file="pods/security/security-context-2.yaml" >}}

Podを作成します。

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-2.yaml
```

Podのコンテナが実行されていることを確認します。

```shell
kubectl get pod security-context-demo-2
```

実行中のコンテナでshellを取ります。

```shell
kubectl exec -it security-context-demo-2 -- sh
```

shellの中で、実行中のプロセスの一覧を表示します。

```shell
ps aux
```

ユーザー2000として実行されているプロセスが表示されました。これはコンテナの`runAsUser`で指定された値です。Podで指定された値である1000を上書きしています。

```
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
2000         1  0.0  0.0   4336   764 ?        Ss   20:36   0:00 /bin/sh -c node server.js
2000         8  0.1  0.5 772124 22604 ?        Sl   20:36   0:00 node server.js
...
```

shellから抜けます。

```shell
exit
```

## コンテナにケーパビリティを設定する

[Linuxケーパビリティ](https://man7.org/linux/man-pages/man7/capabilities.7.html)を用いると、プロセスに対してrootユーザーの全権を渡すことなく特定の権限を与えることができます。
コンテナに対してLinuxケーパビリティを追加したり削除したりするには、コンテナマニフェストの`securityContext`セクションの`capabilities`フィールドに追加してください。

まず、`capabilities`フィールドを含まない場合どうなるかを見てみましょう。
こちらはコンテナに対してケーパビリティを渡していない設定ファイルです。

{{< codenew file="pods/security/security-context-3.yaml" >}}

Podを作成します。

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-3.yaml
```

Podが実行されていることを確認します。

```shell
kubectl get pod security-context-demo-3
```

実行中のコンテナでshellを取ります。

```shell
kubectl exec -it security-context-demo-3 -- sh
```

shellの中で、実行中のプロセスの一覧を表示します。

```shell
ps aux
```

コンテナのプロセスID(PID)が出力されます。

```
USER  PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
root    1  0.0  0.0   4336   796 ?     Ss   18:17   0:00 /bin/sh -c node server.js
root    5  0.1  0.5 772124 22700 ?     Sl   18:17   0:00 node server.js
```

shellの中で、プロセス1のステータスを確認します。

```shell
cd /proc/1
cat status
```

プロセスのケーパビリティビットマップが表示されます。

```
...
CapPrm:	00000000a80425fb
CapEff:	00000000a80425fb
...
```

ケーパビリティビットマップのメモを取った後、shellから抜けます。

```shell
exit
```

次に、追加のケーパビリティを除いて上と同じ設定のコンテナを実行します。

こちらは1つのコンテナを実行するPodの設定ファイルです。
`CAP_NET_ADMIN`と`CAP_SYS_TIME`ケーパビリティを設定に追加しました。

{{< codenew file="pods/security/security-context-4.yaml" >}}

Podを作成します。

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-4.yaml
```

実行中のコンテナでshellを取ります。

```shell
kubectl exec -it security-context-demo-4 -- sh
```

shellの中で、プロセス1のケーパビリティを確認します。

```shell
cd /proc/1
cat status
```

プロセスのケーパビリティビットマップが表示されます。

```
...
CapPrm:	00000000aa0435fb
CapEff:	00000000aa0435fb
...
```

2つのコンテナのケーパビリティを比較します。

```
00000000a80425fb
00000000aa0435fb
```

1つ目のコンテナのケーパビリティビットマップでは、12, 25ビット目がクリアされています。2つ目のコンテナでは12, 25ビット目がセットされています。12ビット目は`CAP_NET_ADMIN`、25ビット目は`CAP_SYS_TIME`です。
ケーパビリティの定数の定義は[capability.h](https://github.com/torvalds/linux/blob/master/include/uapi/linux/capability.h)を確認してください。

{{< note >}}
Linuxケーパビリティの定数は`CAP_XXX`形式です。
ただしコンテナのマニフェストでケーパビリティを記述する際は、定数の`CAP_`の部分を省いてください。
例えば、`CAP_SYS_TIME`を追加したい場合はケーパビリティに`SYS_TIME`を追加してください。
{{< /note >}}

## コンテナにSeccompプロフィールを設定する

コンテナにSeccompプロフィールを設定するには、Pod・コンテナマニフェストの`securityContext`に`seccompProfile`フィールドを追加してください。
`seccompProfile`フィールドは[SeccompProfile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#seccompprofile-v1-core)オブジェクトで、`type`と`localhostProfile`で構成されています。
`type`では`RuntimeDefault`、`Unconfined`、`Localhost`が有効です。
`localhostProfile`は`type: Localhost`のときのみ指定可能です。こちらはノード上で事前に設定されたプロファイルのパスを示していて、kubeletのSeccompプロファイルの場所(`--root-dir`フラグで設定したもの)からの相対パスです。

こちらはノードのコンテナランタイムのデフォルトプロフィールをSeccompプロフィールとして設定した例です。

```yaml
...
securityContext:
  seccompProfile:
    type: RuntimeDefault
```

こちらは`<kubelet-root-dir>/seccomp/my-profiles/profile-allow.json`で事前に設定したファイルをSeccompプロフィールに設定した例です。

```yaml
...
securityContext:
  seccompProfile:
    type: Localhost
    localhostProfile: my-profiles/profile-allow.json
```

## コンテナにSELinuxラベルをつける

コンテナにSELinuxラベルをつけるには、Pod・コンテナマニフェストの`securityContext`セクションに`seLinuxOptions`フィールドを追加してください。
`seLinuxOptions`フィールドは[SELinuxOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#selinuxoptions-v1-core)オブジェクトが入ります。
こちらはSELinuxレベルを適用する例です。

```yaml
...
securityContext:
  seLinuxOptions:
    level: "s0:c123,c456"
```

{{< note >}}
SELinuxラベルを適用するには、ホストOSにSELinuxセキュリティモジュールが含まれている必要があります。
{{< /note >}}

### 効率的なSELinuxのボリューム再ラベル付け

{{< feature-state for_k8s_version="v1.25" state="alpha" >}}

デフォルトでは、コンテナランタイムは全てのPodのボリュームの全てのファイルに再帰的にSELinuxラベルを付与します。処理速度を上げるために、Kubernetesはマウントオプションで`-o context=<label>`を使うことでボリュームのSELinuxラベルを即座に変更することができます。

この高速化の恩恵を受けるには、以下の全ての条件を満たす必要があります。

* Alphaフィーチャーゲートの`ReadWriteOncePod`と`SELinuxMountReadWriteOncePod`を有効にすること
* Podが`accessModes: ["ReadWriteOncePod"]`でPersistentVolumeClaimを使うこと
* Pod(またはPersistentVolumeClaimを使っている全てのコンテナ)に`seLinuxOptions`が設定されていること
* 対応するPersistentVolumeが{{< glossary_tooltip text="CSI" term_id="csi" >}}ドライバーを利用するボリュームか、レガシー`iscsi`ボリュームタイプを利用するボリュームであること
  * CSIドライバーを利用するボリュームを利用している場合、そのCSIドライバーがCSIドライバーインスタンスで`spec.seLinuxMount: true`を指定したときに`-o context`でマウントを行うとアナウンスしていること

それ以外のボリュームタイプでは、コンテナランタイムはボリュームに含まれる全てのinode(ファイルやディレクトリ)に対してSELinuxラベルを再帰的に変更します。
ボリューム内のファイルやディレクトリが増えるほど、ラベリングにかかる時間は増加します。

{{< note >}}
Kubernetes 1.25では、kubeletは再起動後にボリュームラベルを追跡できなくなります。言い換えると、kubeletはPodの中のラベルのコンフリクトが解消されるまで"conflicting
SELinux labels of volume"というようなエラーでPodの起動を拒否する可能性があるということです。Kubeletを再起動する前に必ずノードを[完全にdrain](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/)された状態にしてください。
{{< /note >}}

## 議論

PodのセキュリティコンテキストはPodのコンテナや、適用可能であればPodのボリュームに対しても適用されます。
特に`fsGroup`と`seLinuxOptions`は以下のようにボリュームに対して適用されます。

* `fsGroup`: 所有権管理をサポートしているボリュームは`fsGroup`で指定されているGIDで所有権・書き込み権限が設定されます。詳しくは[Ownership Management design document](https://git.k8s.io/design-proposals-archive/storage/volume-ownership-management.md)を確認してください。

* `seLinuxOptions`: SELinuxラベリングをサポートしているボリュームでは`seLinuxOptions`で指定されているラベルでアクセス可能になるように貼り直されます。通常、`level`セクションのみ設定する必要があります。
  これはPod内の全てのボリュームとコンテナに対し[Multi-Category Security (MCS)](https://selinuxproject.org/page/NB_MLS)ラベルを設定します。

{{< warning >}}
Podに対してMCSラベルを指定すると、同じラベルを持つ全てのPodがボリュームにアクセスすることができます。
Pod内の保護が必要な場合、それぞれのPodに対して一意なMCSラベルを割り当ててください。
{{< /warning >}}

## クリーンアップ

Podを削除します。

```shell
kubectl delete pod security-context-demo
kubectl delete pod security-context-demo-2
kubectl delete pod security-context-demo-3
kubectl delete pod security-context-demo-4
```

## {{% heading "whatsnext" %}}

* [PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core)
* [SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
* [最新の強化されたセキュリティでDockerを調整する](https://github.com/containerd/containerd/blob/main/docs/cri/config.md)
* [Security Contexts design document](https://git.k8s.io/design-proposals-archive/auth/security_context.md)
* [Ownership Management design document](https://git.k8s.io/design-proposals-archive/storage/volume-ownership-management.md)
* [PodSecurity Admission](/docs/concepts/security/pod-security-admission/)
* [AllowPrivilegeEscalation design document](https://git.k8s.io/design-proposals-archive/auth/no-new-privs.md)
* Linuxのセキュリティについてさらに知りたい場合は、[Overview of Linux Kernel Security Features](https://www.linux.com/learn/overview-linux-kernel-security-features)を確認してください(注: 一部の情報は古くなっています)。
