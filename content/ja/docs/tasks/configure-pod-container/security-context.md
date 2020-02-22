---
title: Podまたはコンテナにセキュリティコンテキストを設定する
content_template: templates/task
weight: 80
---

{{% capture overview %}}

セキュリティコンテキストでは、Podまたはコンテナに対する特権およびアクセスコントロールの設定を定義します。セキュリティコンテキストの設定には、以下が含まれます:

* 任意アクセス制御: ファイルのようなオブジェクトにアクセスするための権限は、[ユーザーID (UID) およびグループID (GID)](https://wiki.archlinux.org/index.php/users_and_groups) に基づきます

* [Security Enhanced Linux (SELinux)](https://ja.wikipedia.org/wiki/Security-Enhanced_Linux): オブジェクトにセキュリティラベルが割り当てられます


* 特権または非特権ユーザーでの実行

* [Linuxケーパビリティー](https://linux-audit.com/linux-capabilities-hardening-linux-binaries-by-removing-setuid/): プロセスにいくつかの特権を与えますが、ルートユーザーのすべての特権は与えません

* [AppArmor](/docs/tutorials/clusters/apparmor/): プログラムプロファイルを使用し、各プログラムの機能を制限します

* [Seccomp](https://en.wikipedia.org/wiki/Seccomp): プロセスのシステムコールを制限します

* AllowPrivilegeEscalation（特権昇格の許可）: プロセスが親プロセスよりも強い権限を得られるかどうかを制御します。このブール値は、コンテナプロセスにおいて[`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt)フラグを立てるかどうかを直接制御します。コンテナが次のような場合、AllowPrivilegeEscalationは常にtrueです: 1) 特権モードで実行されている場合、または 2) `CAP_SYS_ADMIN`を持っている場合

Linuxのセキュリティに関する仕組みの詳細な情報は、[Linuxカーネルのセキュリティ機能の概観](https://www.linux.com/learn/overview-linux-kernel-security-features)を参照してください。

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Podにセキュリティコンテキストを設定する

Podにセキュリティコンテキストを指定するには、Podの仕様に`securityContext`フィールドを含めます。
この`securityContext`フィールドは、[PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core)オブジェクトです。
Podに指定したこのセキュリティ設定は、Pod内のすべてのコンテナに適用されます。
以下に`securityContext`および`emptyDir`ボリュームを含むPodの設定ファイルを示します:

{{< codenew file="pods/security/security-context.yaml" >}}

この設定ファイルでは、`runAsUser`フィールドはPod内のコンテナにおいて、すべてのプロセスがユーザーID 1000として実行されるように指定しています。
`runAsGroup`フィールドはPod内のコンテナにおいて、すべてのプロセスがプライマリーグループID 3000となるよう指定しています。
このフィールドを省略した場合、コンテナのプライマリーグループIDはルート (0) となります。
`runAsGroup`を指定した場合、各ファイルは、ユーザーID 1000およびグループID 3000が所有者となるように作成されます。
`fsGroup`フィールドを指定しているため、コンテナ内のすべてのプロセスは補助グループID 2000に属します。`/data/demo`ボリュームおよびそのボリューム内で作成されたファイルの所有者はグループID 2000となります。

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context.yaml
```

Pod内のコンテナが実行されていることを確認します:

```shell
kubectl get pod security-context-demo
```

実行中のコンテナへのシェルを取得します:

```shell
kubectl exec -it security-context-demo -- sh
```

シェルにて、実行中のプロセスを一覧表示します:

```shell
ps
```

出力はプロセスがユーザーID 1000で実行されていることを示しており、これは`runAsUser`の値となります:

```shell
PID   USER     TIME  COMMAND
    1 1000      0:00 sleep 1h
    6 1000      0:00 sh
...
```

シェルにて、`/data`に移動し、ディレクトリを一覧表示します:

```shell
cd /data
ls -l
```

出力は`/data/demo`ディレクトリがグループID 2000であることを示しており、これは`fsGroup`の値となります。

```shell
drwxrwsrwx 2 root 2000 4096 Jun  6 20:08 demo
```

シェルにて、`/data/demo`に移動し、ファイルを作成します:

```shell
cd demo
echo hello > testfile
```

`/data/demo`ディレクトリ内のファイルを一覧表示します:

```shell
ls -l
```

出力は`testfile`がグループID 2000であることを示しており、これは`fsGroup`の値となります。

```shell
-rw-r--r-- 1 1000 2000 6 Jun  6 20:08 testfile
```

以下のコマンドを実行します:

```shell
$ id
uid=1000 gid=3000 groups=2000
```
gidが`runAsGroup`フィールドと同じ3000であることを確認できます。
`runAsGroup`を省略した場合、gidは0 (root) のままであり、プロセスはroot (0) グループが所有者であり、かつroot (0)グループに対して必要なグループ権限をもつファイルにアクセスできます。

シェルを終了します:

```shell
exit
```

## コンテナにセキュリティコンテキストを設定する

コンテナにセキュリティの設定を指定するには、`securityContext`フィールドをコンテナのマニフェストに含めます。
この`securityContext`フィールドは、[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)オブジェクトです。
コンテナに指定したこのセキュリティ設定は個別のコンテナに適用され、Podと重複する場合はPodで行なわれた設定を上書きします。

次に1つのコンテナをもつPodの設定ファイルを示します。Podおよびコンテナはどちらも`securityContext`フィールドがあります:

{{< codenew file="pods/security/security-context-2.yaml" >}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-2.yaml
```

Pod内のコンテナが実行されていることを確認します:

```shell
kubectl get pod security-context-demo-2
```

実行中のコンテナへのシェルを取得します:

```shell
kubectl exec -it security-context-demo-2 -- sh
```

シェルにて、実行中のプロセスを一覧表示します:

```
ps aux
```

出力はプロセスがユーザーID 2000で実行されていることを示しています。これは、コンテナに指定した`runAsUser`の値となり、Podに指定した1000という値を上書きしています。

```
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
2000         1  0.0  0.0   4336   764 ?        Ss   20:36   0:00 /bin/sh -c node server.js
2000         8  0.1  0.5 772124 22604 ?        Sl   20:36   0:00 node server.js
...
```

シェルを終了します:

```shell
exit
```

## コンテナにケーパビリティーを設定する

[Linuxケーパビリティー](http://man7.org/linux/man-pages/man7/capabilities.7.html)を使うことで、rootユーザーのすべての特権を付与せずに、特定の特権のみをプロセスに付与することができます。
コンテナにケーパビリティーを追加または削除するには、コンテナマニフェストの`securityContext`セクションに、`capabilities`フィールドを記述します。

まずは、`capabilities`フィールドを含めない場合になにが起こるかを確認しましょう。
以下はコンテナのケーパビリティーを追加したり削除をしない設定ファイルです:

{{< codenew file="pods/security/security-context-3.yaml" >}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-3.yaml
```

Pod内のコンテナが実行されていることを確認します:

```shell
kubectl get pod security-context-demo-3
```

実行中のコンテナへのシェルを取得します:

```shell
kubectl exec -it security-context-demo-3 -- sh
```

シェルにて、実行中のプロセスを一覧表示します:

```shell
ps aux
```

出力はコンテナのプロセスID (PID) を示しています:

```shell
USER  PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
root    1  0.0  0.0   4336   796 ?     Ss   18:17   0:00 /bin/sh -c node server.js
root    5  0.1  0.5 772124 22700 ?     Sl   18:17   0:00 node server.js
```

シェルにて、プロセス1のステータスを表示します:

```shell
cd /proc/1
cat status
```

出力はプロセスのケーパビリティービットマップを示しています:

```
...
CapPrm:	00000000a80425fb
CapEff:	00000000a80425fb
...
```

ケーパビリティービットマップを覚えておき、シェルを終了します:

```shell
exit
```

次に、追加のケーパビリティーが設定されていることを除き、以前のコンテナと同じコンテナを実行しましょう。

以下は単一のコンテナを含むPodの設定ファイルです。設定には、`CAP_NET_ADMIN`および`CAP_SYS_TIME`ケーパビリティーを追加しています。

{{< codenew file="pods/security/security-context-4.yaml" >}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-4.yaml
```

実行中のコンテナへのシェルを取得します:

```shell
kubectl exec -it security-context-demo-4 -- sh
```

シェルにて、プロセス1のステータスを表示します:

```shell
cd /proc/1
cat status
```

出力はプロセスのケーパビリティービットマップを示しています:

```shell
...
CapPrm:	00000000aa0435fb
CapEff:	00000000aa0435fb
...
```

2つのコンテナのケーパビリティーを比較します:

```
00000000a80425fb
00000000aa0435fb
```

最初のコンテナのケーパビリティービットマップにおいて、12ビットおよび25ビットは立っていません。
2つ目のコンテナにおいて、12ビットおよび25ビットは立っています。12ビットは`CAP_NET_ADMIN`、25ビットは`CAP_SYS_TIME`を表します。
ケーパビリティ定数に関する定義は、[capability.h](https://github.com/torvalds/linux/blob/master/include/uapi/linux/capability.h)を参照してください。

{{< note >}}
Linuxケーパビリティ定数は`CAP_XXX`という形式ですが、コンテナマニフェストにてケーパビリティーを記述する場合は、定数の`CAP_`の箇所を省略する必要があります。たとえば、`CAP_SYS_TIME`を追加する場合は、ケーパビリティーに`SYS_TIME`と記述します。
{{< /note >}}

## コンテナにSELinuxのラベル付けを行なう

コンテナにSELinuxのラベル付けを行なうには、Podまたはコンテナマニフェストの`securityContext`セクションに`seLinuxOptions`をフィールドを含めます。
`seLinuxOptions`フィールドは[SELinuxOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#selinuxoptions-v1-core)オブジェクトです。
以下にSELinuxレベルを設定する例を示します:

```yaml
...
securityContext:
  seLinuxOptions:
    level: "s0:c123,c456"
```

{{< note >}}
SELinuxのラベル付けを行なうには、SELinux Security Moduleをホストのオペレーティングシステムに導入する必要があります。
{{< /note >}}

## 議論

Podのセキュリティコンテキストは、コンテナおよび適用可能な場合にはボリュームに適用されます。
特に、`fsGroup`および`seLinuxOptions`は以下のようにボリュームに適用されます:

* `fsGroup`: 所有権の管理をサポートするボリュームは、`fsGroup`で指定されたGIDによって所有権および書き込み可能となるよう変更されます。詳細は、[所有権の管理に関するデザインドキュメント](https://git.k8s.io/community/contributors/design-proposals/storage/volume-ownership-management.md)を参照してください。

* `seLinuxOptions`: SELinuxのラベル付けをサポートするボリュームは、`seLinuxOptions`で指定されたラベルでアクセスできるよう、再度ラベル付けされます。通常は、`level`セクションを設定するだけです。これにより、Pod内のすべてのコンテナおよびボリュームに与えられる[Multi-Category Security (MCS)](https://selinuxproject.org/page/NB_MLS)ラベルが設定されます。

{{< warning >}}
PodにMCSラベルを指定したあとは、同じラベルを付与されたすべてのPodは同じボリュームにアクセスできます。Pod間の保護が必要な場合は、一意なMCSラベルを付与する必要があります。
{{< /warning >}}

## クリーンアップ

Podを削除します:

```shell
kubectl delete pod security-context-demo
kubectl delete pod security-context-demo-2
kubectl delete pod security-context-demo-3
kubectl delete pod security-context-demo-4
```

{{% /capture %}}

{{% capture whatsnext %}}

* [PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core)
* [SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
* [最新のセキュリティ拡張機能を利用してDockerを調整する](https://opensource.com/business/15/3/docker-security-tuning)
* [セキュリティコンテキストのデザインドキュメント](https://git.k8s.io/community/contributors/design-proposals/auth/security_context.md)
* [所有権の管理に関するデザインドキュメント](https://git.k8s.io/community/contributors/design-proposals/storage/volume-ownership-management.md)
* [Pod Security Policy](/docs/concepts/policy/pod-security-policy/)
* [AllowPrivilegeEscalationのデザインドキュメント](https://git.k8s.io/community/contributors/design-proposals/auth/no-new-privs.md)


{{% /capture %}}
