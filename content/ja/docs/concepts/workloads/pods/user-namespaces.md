---
title: ユーザー名前空間
content_type: concept
weight: 160
min-kubernetes-server-version: v1.25
---

<!-- overview -->
{{< feature-state for_k8s_version="v1.30" state="beta" >}}

このページでは、KubernetesのPodにおける{{< glossary_tooltip text="ユーザー名前空間" term_id="userns" >}}について説明します。
ユーザー名前空間はホストのユーザーとコンテナ内プロセスが利用するユーザーを隔離するものです。

ユーザー名前空間を使うと、コンテナ内でrootとして稼働するプロセスを、ホスト側の異なる(root以外の)ユーザーとして実行することができます。
言い換えれば、ユーザー名前空間内部のリソースの操作に特権をもつプロセスは、名前空間の外側では非特権のプロセスとなっています。

ホストや他のPodに危害を及ぼす、侵害されたコンテナによる被害を軽減するために、この機能を用いることができます。
**HIGH** ないしは **CRITICAL** にレートされた[いくつかの脆弱性][KEP-vulns]は、ユーザー名前空間が有効な場合には悪用できないものでした。
ユーザー名前空間は、将来の脆弱性を緩和することも期待できます。

[KEP-vulns]: https://github.com/kubernetes/enhancements/tree/217d790720c5aef09b8bd4d6ca96284a0affe6c2/keps/sig-node/127-user-namespaces#motivation


<!-- body -->
## {{% heading "prerequisites" %}}

{{% thirdparty-content %}}

この機能はLinux固有であり、Linuxのファイルシステムでidmapマウントがサポートされている必要があります。

* ノード上で`/var/lib/kubelet/pods/`(ないしはそのカスタムディレクトリとして設定した場所)でidmapマウントがサポートされている必要があります。
* Podのボリュームとして使われる全てのファイルシステムがidmapマウントをサポートしている必要があります。

これは、最低でもLinux 6.3以降を利用していて、かつidmapマウントをサポートするtmpfsが必要であることを意味します。
一般的に、いくつかのKubernetesの機能はtmpfsを利用しています。
(デフォルトでは、PodがサービスアカウントトークンやSecretをマウントする時にtmpfsを使っていたりします)。

Linux 6.3でidmapマウントをサポートするポピュラーなファイルシステムはbtrfs、ext4、xfs、fat、tmpfs、overlayfsです。

さらに、コンテナランタイムとその基盤であるOCIランタイムもユーザー名前空間をサポートしている必要があります。
次のOCIランタイムではサポートが提供されています。

* [crun](https://github.com/containers/crun) バージョン1.9以上 (推奨バージョンは1.13以上).
* [runc](https://github.com/opencontainers/runc) バージョン1.2以上

{{< note >}}
いくつかのOCIランタイムには、LinuxのPodでユーザー名前空間を利用するのに必要なサポートが含まれていません。
マネージドKubernetesを利用している場合やOCIランタイムをパッケージとしてダウンロードしてセットアップした場合には、クラスタ内のノードがユーザー名前空間をサポートしない可能性があります。
{{< /note >}}

Kubernetesでユーザー名前空間を利用する際、Podでこの機能を使うためにはCRI{{< glossary_tooltip text="コンテナランタイム" term_id="container-runtime" >}} も必要です。

* containerd: バージョン2.0以上ではコンテナのユーザー名前空間をサポート。
* CRI-O: バージョン1.25以上でコンテナのユーザー名前空間をサポート。

ユーザー名前空間のサポート状況については、GitHubの[issue][CRI-dockerd-issue]で確認できます。

[CRI-dockerd-issue]: https://github.com/Mirantis/cri-dockerd/issues/74

## 導入

Linuxの機能であるユーザー名前空間を用いると、コンテナのユーザーをホスト側の異なるユーザーにマップすることができます。
さらに言えば、ユーザー名前空間においてPodに付与されたケーパビリティ(capability)は、ユーザー名前空間内においてのみ有効で、外側では無効です。

Podは`pod.spec.hostUsers`フィールドを`false`に設定することで、ユーザー名前空間を使えるようになります。

kubeletはPodに対応する(ホストの)UID/GIDを選択した上で、同一ノードの２つ以上のPodが同じ対応関係にならないよう保証するようにしつつ、ユーザーをマップします。

`pod.spec`における`runAsUser`や`runAsGroup`、`fsGroup`などのフィールドはコンテナ内のユーザーを指すものです。

この機能が有効化された場合、UID/GIDとして正しい値の範囲は0-65535です。
これはファイルとプロセスに対して適用されます。
(`runAsUser`や`runAsGroup`など)。

この範囲を超えるUID/GIDを利用するファイルはオーバーフローしたID(一般的には65534)に所属するように見えるでしょう。
(`/proc/sys/kernel/overflowuid`と`/proc/sys/kernel/overflowgid`で設定されます)。
ただし、これらのファイルは65534のユーザー/グループで稼働するプロセスであっても、編集することはできません。

rootとして動かす必要があるアプリケーションであっても、ホストにおける他のユーザー名前空間や他のリソースに対してアクセスしないものの多くは、ユーザー名前空間を有効化しても動かせますし、アプリケーションを修正しなくても問題なく動作するでしょう。


## Podにおけるユーザー名前空間を理解する {#pods-and-userns}

いくつかのコンテナランタイム(Docker Engineやcontainer、CRI-Oなど)は、デフォルトでユーザー名前空間を利用するように設定されています。

これらのランタイムとその他の既存技術を組み合わせて使うことも可能です。
(例えば、Kata ContainerはLinux名前空間の代わりにVMを利用します)。
このページの内容はLinux名前空間を隔離に使うコンテナランタイムに適用できるものです。

Podを作成する時、デフォルトでは、Podの隔離にいくつかの新しい名前空間が利用されます。
(コンテナネットワークの隔離のためのネットワーク名前空間、プロセスの見える範囲を隔離するためのPID名前空間など)。
ユーザー名前空間を利用する場合には、コンテナ内のユーザーをノードのユーザーと隔離します。

これは、コンテナがrootとしてプロセスを動かせる一方で、ホスト上では非rootユーザーとしてマップされていることを意味します。
コンテナ内部のプロセスはrootとして動作しているものと思っていることでしょう。
(したがって、`apt`や`yum`などは問題なく動作します)。
しかし、実際には、このプロセスにホスト上での特権はありません。
これを検証するには、例えばホスト上で`ps aux`を実行することで、コンテナのプロセスがどのユーザーを使用しているかを確認するとよいでしょう。
`ps`が示すユーザーは、コンテナ内で`id`を実行した場合に示されるユーザーとは異なっているはずです。

この分離によって、ホスト上で「起こせること」を制限できます。例えばコンテナ内プロセスのホストへのエスケープを処理する場合にこの制限が有効に働きます。
コンテナはホスト上で非特権のユーザーとして動作しているため、ホスト上でできることが制限されているのです。

さらに言えば、それぞれのPodのユーザーは、ホスト上においては異なるユーザーにマップされており、UID/GIDは重複しません。
他のPodに対してできることさえも制限されているのです。


Podに付与されたケーパビリティについても、Podのユーザー名前空間に制限されており、名前空間の外部においてはほとんどが効力を持たず、いくつかのケーパビリティは外部では完全に無効です。
2つの例を挙げます:
- `CAP_SYS_MODULE` がユーザー名前空間を使うPodに付与されている場合、Podはカーネルモジュールをロードできません。
- `CAP_SYS_ADMIN` はPodのユーザー名前空間の内部のみに制限され、名前空間の外部では無効です。

コンテナブレークアウトのケースについて考えてみます。
この場合、ユーザー名前空間を使用せずにコンテナをrootで稼働させていると、ノードのroot権限が取得されます。
さらに、ケーパビリティがコンテナに付与されていた場合には、そのケーパビリティはホスト上でも有効となっています。
ユーザー名前空間を利用していれば、これらはいずれも成立しません。

ユーザー名前空間を使う場合に何が変わるのかについて詳しく知りたい場合には、`man 7 user_namespaces`を参照してください。

## ユーザー名前空間をサポートするノードを設定する

ほとんどのLinuxディストリビューションで標準的なUIDである0-65535の範囲については、kubeletはホストのファイルやプロセスがこの範囲のUIDを利用しているものとみなし、デフォルトではこれよりも上のUID/GIDの値をPodに紐付けます。
言い換えれば、0-65535の範囲のIDをPodで使うことはできません。
このアプローチにより、PodとホストのUID/GIDが重複することを防ぎます。

Podによる潜在的な任意のファイル読み出しの脆弱性である[CVE-2021-25741][CVE-2021-25741]のような脆弱性の影響を緩和する上で、UID/GIDの重複を防ぐことは重要です。
PodとホストのUID/GIDが重複しなければ、Podができることは限定されます。
(PodのUID/GIDはホスト上のファイル所有者やグループと一致することがないのです)。

kubeletはPodに割り当てるユーザーIDとグループIDの範囲を変更することが可能です。カスタムの範囲を設定するには、ノードが次の条件を満たす必要があります。

 * ユーザー`kubelet`がシステム上に存在していること(他のユーザー名を使うことはできません)
 * `getsubids`バイナリ([shadow-utils][shadow-utils]の一部)がインストールされており、kubeletバイナリが参照する`PATH`に入っていること
 * `kubelet`ユーザーのsubordinate UID/GID ([`man 5 subuid`](https://man7.org/linux/man-pages/man5/subuid.5.html) および[`man 5 subgid`](https://man7.org/linux/man-pages/man5/subgid.5.html)を参照)

これはsubordinate UID/GIDの範囲に関する設定のみを示しており、`kubelet`を実行するユーザーは変更しません。

ユーザー`kubelet`に割り当てるsubordinate IDの範囲に関しては、いくつかの制約に従う必要があります。

* subordinate UIDの起点(つまりPodのUID範囲の開始位置)が65536の倍数に設定されていて、かつ65536以上であること( **必須** )。
言い換えると、0-65535の範囲をPodのUIDとして使うことはできません。
偶発的にインセキュアな設定がなされることを防ぐために、kubeletはこの制約を強制します。

* subordinate UID/GIDの個数が65536の倍数であること(必須)。

* subordinate UID/GIDの個数は最低でも`65536 x <最大Pod数>`であること(必須)。
`<最大Pod数>`
  はノードで稼働できるPodの数の最大値を表します。

* UIDとGIDとして同じ個数を割り当てること(必須)。
他のユーザーに対して、GIDの範囲と合致しないUID範囲を指定することは問題ありません。

* 割り当てられたUID/GID範囲は他の割当と重複しないこと(推奨)。

* subordinate UID/GIDの設定は単一行でなされること(必須)。
同一のユーザーに対して複数のUID/GID範囲を定義することはできません。

例えば、ユーザー`kubelet`のエントリについて、`/etc/subuid`と`/etc/subgid`に次のように定義することができます。

```
# フォーマットは次の通り
#   name:firstID:count
# この例における意味
# - firstIDは65536 (とりうる最小の値)
# - countは110 (デフォルトの制限値) * 65536
kubelet:65536:7208960
```

[CVE-2021-25741]: https://github.com/kubernetes/kubernetes/issues/104980
[shadow-utils]: https://github.com/shadow-maint/shadow

## Podセキュリティのアドミッション検証への統合

{{< feature-state state="alpha" for_k8s_version="v1.29" >}}

ユーザー名前空間を有効化したLinuxのPodでは、Kubernetesは[Pod Security Standards](/docs/concepts/security/pod-security-standards)で制御されるアプリケーションの制限を緩和します。
この挙動はエンドユーザーの早期オプトインを可能にするための`UserNamespacesPodSecurityStandards`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)で制御することが可能です。
このフィーチャーゲートを使う場合、クラスタ管理者はユーザー名前空間が全てのノードで有効化されていることを確実にする必要があります。

フィーチャーゲートを有効化した上でユーザー名前空間を使うPodを作成する場合、_Baseline_ないしは_Restricted_Podセキュリティ基準のセキュリティコンテキストが強制されていても、以下のフィールドによる制約がなされません。

- `spec.securityContext.runAsNonRoot`
- `spec.containers[*].securityContext.runAsNonRoot`
- `spec.initContainers[*].securityContext.runAsNonRoot`
- `spec.ephemeralContainers[*].securityContext.runAsNonRoot`
- `spec.securityContext.runAsUser`
- `spec.containers[*].securityContext.runAsUser`
- `spec.initContainers[*].securityContext.runAsUser`
- `spec.ephemeralContainers[*].securityContext.runAsUser`

##  制限

Podでユーザー名前空間を利用する際には、他のホスト名前空間を利用することはできません。
特に`hostUsers: false`を設定している場合、次の値を設定することはできません。

 * `hostNetwork: true`
 * `hostIPC: true`
 * `hostPID: true`

## {{% heading "whatsnext" %}}

* [Podでユーザー名前空間を利用する](/docs/tasks/configure-pod-container/user-namespaces/)を参照
