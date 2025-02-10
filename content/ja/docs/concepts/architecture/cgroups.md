---
title: cgroup v2について
content_type: concept
weight: 50
---

<!-- overview -->

Linuxでは、{{< glossary_tooltip text="コントロールグループ" term_id="cgroup" >}}がプロセスに割り当てられるリソースを制限しています。

コンテナ化されたワークロードの、CPU/メモリーの要求と制限を含む[Podとコンテナのリソース管理](/docs/concepts/configuration/manage-resources-containers/)を強制するために、
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}と基盤となるコンテナランタイムはcgroupをインターフェースとして接続する必要があります。

Linuxではcgroup v1とcgroup v2の2つのバージョンのcgroupがあります。
cgroup v2は新世代の`cgroup` APIです。

<!-- body -->

## cgroup v2とは何か？ {#cgroup-v2}
{{< feature-state for_k8s_version="v1.25" state="stable" >}}

cgroup v2はLinuxの`cgroup` APIの次のバージョンです。
cgroup v2はリソース管理機能を強化した統合制御システムを提供しています。

以下のように、cgroup v2はcgroup v1からいくつかの点を改善しています。

- 統合された単一階層設計のAPI
- より安全なコンテナへのサブツリーの移譲
- [Pressure Stall Information](https://www.kernel.org/doc/html/latest/accounting/psi.html)などの新機能
- 強化されたリソース割り当て管理と複数リソース間の隔離
  - 異なるタイプのメモリー割り当ての統一(ネットワークメモリー、カーネルメモリーなど)
  - ページキャッシュの書き戻しといった、非即時のリソース変更

Kubernetesのいくつかの機能では、強化されたリソース管理と隔離のためにcgroup v2のみを使用しています。
例えば、[MemoryQoS](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2)機能はメモリーQoSを改善し、cgroup v2の基本的な機能に依存しています。

## cgroup v2を使う {#using-cgroupv2}

cgroup v2を使うおすすめの方法は、デフォルトでcgroup v2が有効で使うことができるLinuxディストリビューションを使うことです。

あなたのディストリビューションがcgroup v2を使っているかどうかを確認するためには、[Linux Nodeのcgroupバージョンを特定する](#check-cgroup-version)を参照してください。

### 必要要件 {#requirements}

cgroup v2を使うには以下のような必要要件があります。

* OSディストリビューションでcgroup v2が有効であること
* Linuxカーネルバージョンが5.8以上であること
* コンテナランタイムがcgroup v2をサポートしていること。例えば、
  * [containerd](https://containerd.io/) v1.4以降
  * [cri-o](https://cri-o.io/) v1.20以降
* kubeletとコンテナランタイムが[systemd cgroupドライバー](/ja/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)を使うように設定されていること

### Linuxディストリビューションのcgroup v2サポート

cgroup v2を使っているLinuxディストリビューションの一覧は[cgroup v2ドキュメント](https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md)をご覧ください。

<!-- 一覧は https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md と同期してください -->
* Container-Optimized OS (M97以降)
* Ubuntu (21.10以降, 22.04以降推奨)
* Debian GNU/Linux (Debian 11 bullseye以降)
* Fedora (31以降)
* Arch Linux (April 2021以降)
* RHEL and RHEL-like distributions (9以降)

あなたのディストリビューションがcgroup v2を使っているかどうかを確認するためには、あなたのディストリビューションのドキュメントを参照するか、[Linux Nodeのcgroupバージョンを特定する](#check-cgroup-version)の説明に従ってください。

カーネルのcmdlineの起動時引数を修正することで、手動であなたのLinuxディストリビューションのcgroup v2を有効にすることもできます。
あなたのディストリビューションがGRUBを使っている場合は、
`/etc/default/grub`の中の`GRUB_CMDLINE_LINUX`に`systemd.unified_cgroup_hierarchy=1`を追加し、`sudo update-grub`を実行してください。
ただし、おすすめの方法はデフォルトですでにcgroup v2が有効になっているディストリビューションを使うことです。

### cgroup v2への移行 {#migrating-cgroupv2}

cgroup v2に移行するには、[必要要件](#requirements)を満たすことを確認し、
cgroup v2がデフォルトで有効であるカーネルバージョンにアップグレードします。

kubeletはOSがcgroup v2で動作していることを自動的に検出し、それに応じて処理を行うため、追加設定は必要ありません。

ノード上やコンテナ内からユーザーが直接cgroupファイルシステムにアクセスしない限り、cgroup v2に切り替えたときのユーザー体験に目立った違いはないはずです。

cgroup v2はcgroup v1とは違うAPIを利用しているため、cgroupファイルシステムに直接アクセスしているアプリケーションはcgroup v2をサポートしている新しいバージョンに更新する必要があります。例えば、

* サードパーティーの監視またはセキュリティエージェントはcgroupファイルシステムに依存していることがあります。
 エージェントをcgroup v2をサポートしているバージョンに更新してください。
* Podやコンテナを監視するために[cAdvisor](https://github.com/google/cadvisor)をスタンドアローンのDaemonSetとして起動している場合、v0.43.0以上に更新してください。
* Javaアプリケーションをデプロイする場合は、完全にcgroup v2をサポートしているバージョンを利用してください：
    * [OpenJDK / HotSpot](https://bugs.openjdk.org/browse/JDK-8230305): jdk8u372、11.0.16、15以降
    * [IBM Semeru Runtimes](https://www.eclipse.org/openj9/docs/version0.33/#control-groups-v2-support): jdk8u345-b01、11.0.16.0、17.0.4.0、18.0.2.0以降
    * [IBM Java](https://www.ibm.com/docs/en/sdk-java-technology/8?topic=new-service-refresh-7#whatsnew_sr7__fp15): 8.0.7.15以降
* [uber-go/automaxprocs](https://github.com/uber-go/automaxprocs)パッケージを利用している場合は、利用するバージョンがv1.5.1以上であることを確認してください。

## Linux Nodeのcgroupバージョンを特定する {#check-cgroup-version}

cgroupバージョンは利用されているLinuxディストリビューションと、OSで設定されているデフォルトのcgroupバージョンに依存します。
あなたのディストリビューションがどちらのcgroupバージョンを利用しているのかを確認するには、`stat -fc %T /sys/fs/cgroup/`コマンドをノード上で実行してください。

```shell
stat -fc %T /sys/fs/cgroup/
```

cgroup v2では、`cgroup2fs`と出力されます。

cgroup v1では、`tmpfs`と出力されます。

## {{% heading "whatsnext" %}}

- [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)についてもっと学習しましょう。
- [コンテナランタイム](/ja/docs/concepts/architecture/cri)についてもっと学習しましょう。
- [cgroupドライバー](/ja/docs/setup/production-environment/container-runtimes#cgroup-drivers)についてもっと学習しましょう。
