---
title: kubeadm config
content_type: concept
weight: 50
---

<!-- overview -->
`kubeadm init`の実行中、kubeadmはクラスターに対して、`kube-system`名前空間内の`kubeadm-config`という名前のConfigMapに`ClusterConfiguration`オブジェクトをアップロードします。
この設定は`kubeadm join`、`kubeadm reset`および`kubeadm upgrade`の実行中に読み込まれます。

`kubeadm config print`によって、kubeadmが`kubeadm init`や`kubeadm join`で使用する、デフォルトの静的な設定を表示することができます。

{{< note >}}
コマンドの出力は一例として提供されるものです。
自身のセットアップに合わせるためには、コマンドの出力を手動で編集する必要があります。
不明確なフィールドは削除してください。
kubeadmは実行時にホストを調べ、そのフィールドにデフォルト値を設定しようとします。
{{< /note >}}

`init`と`join`のより詳細な情報については、[設定ファイルを使ったkubeadm initの利用](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file)、または[設定ファイルを使ったkubeadm joinの利用](/docs/reference/setup-tools/kubeadm/kubeadm-join/#config-file)を参照してください。

kubeadmの設定APIの使用法に関するより詳細な情報については、[kubeadm APIを使ったコンポーネントのカスタマイズ](/ja/docs/setup/production-environment/tools/kubeadm/control-plane-flags)を参照してください。

非推奨のAPIバージョンを含んだ古い設定ファイルを、サポートされた新しいAPIバージョンに変換する際には、`kubeadm config migrate`コマンドを使用することができます。

設定ファイルを検証するためには、`kubeadm config validate`を使用することができます。

kubeadmが必要とするイメージを表示、取得するために、`kbueadm config images list`や`kubeadm config images pull`を使用することができます。

<!-- body -->
## kubeadm config print {#cmd-config-print}

{{< include "generated/kubeadm_config_print.md" >}}

## kubeadm config print init-defaults {#cmd-config-print-init-defaults}

{{< include "generated/kubeadm_config_print_init-defaults.md" >}}

## kubeadm config print join-defaults {#cmd-config-print-join-defaults}

{{< include "generated/kubeadm_config_print_join-defaults.md" >}}

## kubeadm config migrate {#cmd-config-migrate}

{{< include "generated/kubeadm_config_migrate.md" >}}

## kubeadm config validate {#cmd-config-validate}

{{< include "generated/kubeadm_config_validate.md" >}}

## kubeadm config images list {#cmd-config-images-list}

{{< include "generated/kubeadm_config_images_list.md" >}}

## kubeadm config images pull {#cmd-config-images-pull}

{{< include "generated/kubeadm_config_images_pull.md" >}}

## {{% heading "whatsnext" %}}

* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/)を使用すると、Kubernetesクラスターを最新のバージョンにアップグレードすることができます
