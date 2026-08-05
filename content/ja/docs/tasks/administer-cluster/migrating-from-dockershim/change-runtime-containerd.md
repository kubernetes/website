---
title: ノードのコンテナランタイムをDocker Engineからcontainerdに変更する
weight: 10
content_type: task
---

このタスクでは、コンテナランタイムをDockerからcontainerdに更新するために必要な手順について説明します。
これは、Kubernetes 1.23以前を使用しているクラスターオペレーターに適用されます。
また、dockershimからcontainerdへの移行を行う際の具体的なシナリオ例も含まれています。
代替のコンテナランタイムについては、この[ページ](/docs/setup/production-environment/container-runtimes/)を参照してください。

## {{% heading "prerequisites" %}}

{{% thirdparty-content %}}

containerdをインストールします。
詳細については[containerdのインストールドキュメント](https://containerd.io/docs/getting-started/)を参照してください。
特定の前提条件については、[containerdガイド](/docs/setup/production-environment/container-runtimes/#containerd)を参照してください。

## ノードのドレイン

```shell
kubectl drain <node-to-drain> --ignore-daemonsets
```

`<node-to-drain>`は、ドレイン対象のノード名に置き換えてください。

## Dockerデーモンの停止

```shell
systemctl stop kubelet
systemctl disable docker.service --now
```

## containerdのインストール

containerdをインストールする手順の詳細については、[ガイド](/docs/setup/production-environment/container-runtimes/#containerd)を参照してください。

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Linux" %}}

1. 公式のDockerリポジトリから`containerd.io`パッケージをインストールします。
   各Linuxディストリビューション向けにDockerリポジトリを設定し、`containerd.io`パッケージをインストールする手順については、[Getting started with containerd](https://github.com/containerd/containerd/blob/main/docs/getting-started.md)を参照してください。

1. containerdを設定する:

   ```shell
   sudo mkdir -p /etc/containerd
   containerd config default | sudo tee /etc/containerd/config.toml
   ```

1. containerdを再起動する:

   ```shell
   sudo systemctl restart containerd
   ```

{{% /tab %}}
{{% tab name="Windows (PowerShell)" %}}

PowerShellセッションを開始し、`$Version`に目的のバージョンを設定します(例: `$Version="1.4.3"`)。
その後、次のコマンドを実行します:

1. containerdをダウンロードする:

   ```powershell
   curl.exe -L https://github.com/containerd/containerd/releases/download/v$Version/containerd-$Version-windows-amd64.tar.gz -o containerd-windows-amd64.tar.gz
   tar.exe xvf .\containerd-windows-amd64.tar.gz
   ```
2. 展開および設定:

   ```powershell
   Copy-Item -Path ".\bin\" -Destination "$Env:ProgramFiles\containerd" -Recurse -Force
   cd $Env:ProgramFiles\containerd\
   .\containerd.exe config default | Out-File config.toml -Encoding ascii

   # 設定内容を確認します。セットアップによっては、以下を調整する必要があります:
   # - sandbox_image(Kubernetesのpauseイメージ)
   # - cniのbin_dirおよびconf_dirの場所
   Get-Content config.toml

   # (オプションだが、強く推奨される)containerdをWindows Defenderのスキャン対象から除外する
   Add-MpPreference -ExclusionProcess "$Env:ProgramFiles\containerd\containerd.exe"
   ```

3. containerdを起動する:

   ```powershell
   .\containerd.exe --register-service
   Start-Service containerd
   ```

{{% /tab %}}
{{< /tabs >}}

## containerdをコンテナランタイムとして使用するためのkubeletの設定

`/var/lib/kubelet/kubeadm-flags.env`ファイルを編集し、フラグに`--container-runtime-endpoint=unix:///run/containerd/containerd.sock`を追加して、containerdランタイムを指定します。

kubeadmを使用しているユーザーは、`kubeadm`ツールが各ホストのCRIソケットを、そのホストのノードオブジェクトにアノテーションとして保存していることに注意してください。
これを変更するには、`/etc/kubernetes/admin.conf`ファイルが存在するマシン上で次のコマンドを実行します。

```shell
kubectl edit no <node-name>
```

これによりテキストエディタが起動し、ノードオブジェクトを編集できます。
使用するテキストエディタを指定するには、`KUBE_EDITOR`環境変数を設定してください。

- `kubeadm.alpha.kubernetes.io/cri-socket`の値を`/var/run/dockershim.sock`から、使用したいCRIソケットのパス(例: `unix:///run/containerd/containerd.sock`)に変更します。

  新しいCRIソケットのパスは、原則として`unix://`で始める必要がある点に注意してください。

- テキストエディタで変更を保存すると、ノードオブジェクトが更新されます。

## kubeletの再起動

```shell
systemctl start kubelet
```

## ノードが正常であることの確認

`kubectl get nodes -o wide`を実行し、先ほど変更したノードのランタイムとしてcontainerdが表示されていることを確認します。

## Docker Engineの削除

{{% thirdparty-content %}}

ノードが正常に見える場合は、Dockerを削除します。

{{< tabs name="tab-remove-docker-engine" >}}
{{% tab name="CentOS" %}}

```shell
sudo yum remove docker-ce docker-ce-cli
```
{{% /tab %}}
{{% tab name="Debian" %}}

```shell
sudo apt-get purge docker-ce docker-ce-cli
```
{{% /tab %}}
{{% tab name="Fedora" %}}

```shell
sudo dnf remove docker-ce docker-ce-cli
```
{{% /tab %}}
{{% tab name="Ubuntu" %}}

```shell
sudo apt-get purge docker-ce docker-ce-cli
```
{{% /tab %}}
{{< /tabs >}}

前述のコマンドは、ホスト上のイメージ、コンテナ、ボリューム、またはカスタマイズされた設定ファイルを削除しません。
これらを削除するには、Dockerの[Docker Engineのアンインストール](https://docs.docker.com/engine/install/ubuntu/#uninstall-docker-engine)手順に従ってください。

{{< caution >}}
Docker Engineのアンインストール手順には、containerdを削除してしまうリスクがあります。コマンドの実行には十分注意してください。
{{< /caution >}}

## ノードのuncordon

```shell
kubectl uncordon <node-to-uncordon>
```

`<node-to-uncordon>`は、以前にドレインしたノードの名前に置き換えてください。
