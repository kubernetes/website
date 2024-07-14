---
title: Linux上でのkubectlのインストールおよびセットアップ
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

kubectlのバージョンは、クラスターのマイナーバージョンとの差分が1つ以内でなければなりません。
たとえば、クライアントがv{{< skew currentVersion >}}であれば、v{{< skew currentVersionAddMinor -1 >}}、v{{< skew currentVersionAddMinor 0 >}}、v{{< skew currentVersionAddMinor 1 >}}のコントロールプレーンと通信できます。
最新の互換性のあるバージョンのkubectlを使うことで、不測の事態を避けることができるでしょう。

## Linuxへkubectlをインストールする

Linuxへkubectlをインストールするには、次の方法があります:

- [curlを使用してLinuxへkubectlのバイナリをインストールする](#install-kubectl-binary-with-curl-on-linux)
- [ネイティブなパッケージマネージャーを使用してインストールする](#install-using-native-package-management)
- [他のパッケージマネージャーを使用してインストールする](#install-using-other-package-management)

### curlを使用してLinuxへkubectlのバイナリをインストールする{#install-kubectl-binary-with-curl-on-linux}

1. 次のコマンドにより、最新リリースをダウンロードしてください:

   {{< tabs name="download_binary_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   特定のバージョンをダウンロードする場合、コマンドの`$(curl -L -s https://dl.k8s.io/release/stable.txt)`の部分を特定のバージョンに書き換えてください。

   たとえば、Linux x86-64へ{{< skew currentPatchVersion >}}のバージョンをダウンロードするには、次のコマンドを入力します:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64/kubectl
   ```

   そして、Linux ARM64に対しては、次のコマンドを入力します:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/arm64/kubectl
   ```

   {{< /note >}}

1. バイナリを検証してください(オプション)

   kubectlのチェックサムファイルをダウンロードします:

   {{< tabs name="download_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   チェックサムファイルに対してkubectlバイナリを検証します:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
   ```

   正しければ、出力は次のようになります:

   ```console
   kubectl: OK
   ```

   チェックに失敗すると、`sha256`は0以外のステータスで終了し、次のような出力を表示します:

   ```console
   kubectl: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   同じバージョンのバイナリとチェックサムをダウンロードしてください。
   {{< /note >}}

1. kubectlをインストールしてください

   ```bash
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

   {{< note >}}
   ターゲットシステムにルートアクセスを持っていない場合でも、`~/.local/bin`ディレクトリにkubectlをインストールできます:

   ```bash
   chmod +x kubectl
   mkdir -p ~/.local/bin
   mv ./kubectl ~/.local/bin/kubectl
   # そして ~/.local/bin を $PATH の末尾 (または先頭) に追加します
   ```

   {{< /note >}}

1. インストールしたバージョンが最新であることを確認してください:

   ```bash
   kubectl version --client
   ```

   または、バージョンの詳細を表示するために次を使用します:

   ```cmd
   kubectl version --client --output=yaml
   ```

### ネイティブなパッケージマネージャーを使用してインストールする{#install-using-native-package-management}

{{< tabs name="kubectl_install" >}}
{{% tab name="Debianベースのディストリビューション" %}}

1. `apt`のパッケージ一覧を更新し、Kubernetesの`apt`リポジトリを利用するのに必要なパッケージをインストールしてください:

   ```shell
   sudo apt-get update
   # apt-transport-httpsはダミーパッケージの可能性があります。その場合、そのパッケージはスキップできます
   sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
   ```

2. Kubernetesパッケージリポジトリの公開署名キーをダウンロードしてください。
すべてのリポジトリに同じ署名キーが使用されるため、URL内のバージョンは無視できます:

   ```shell
   # `/etc/apt/keyrings`フォルダーが存在しない場合は、curlコマンドの前に作成する必要があります。下記の備考を参照してください。
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   sudo chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg # 特権のないAPTプログラムがこのkeyringを読めるようにします
   ```
   
{{< note >}}
Debian 12とUbuntu 22.04より古いリリースでは、`/etc/apt/keyrings`フォルダーは既定では存在しないため、curlコマンドの前に作成する必要があります。
{{< /note >}}

3. 適切なKubernetesの`apt`リポジトリを追加してください。
{{< param "version" >}}とは異なるKubernetesバージョンを利用したい場合は、以下のコマンドの{{< param "version" >}}を目的のマイナーバージョンに置き換えてください:

   ```shell
   # これにより、/etc/apt/sources.list.d/kubernetes.listにある既存の設定が上書きされます
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   sudo chmod 644 /etc/apt/sources.list.d/kubernetes.list   # command-not-foundのようなツールが正しく動作するようにします
   ```

{{< note >}}
kubectlを他のマイナーリリースにアップグレードするためには、`apt-get update`と`apt-get upgrade`を実行する前に、`/etc/apt/sources.list.d/kubernetes.list`の中のバージョンを上げる必要があります。
この手順については[Changing The Kubernetes Package Repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/)に詳細が記載されています。
{{< /note >}}

4. `apt`のパッケージインデックスを更新し、kubectlをインストールしてください:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubectl
   ```

{{% /tab %}}

{{% tab name="Red Hatベースのディストリビューション" %}}

1. Kubernetesの`yum`リポジトリを追加してください。
{{< param "version" >}}とは異なるKubernetesバージョンを利用したい場合は、以下のコマンドの{{< param "version" >}}を目的のマイナーバージョンに置き換えてください:

   ```bash
   # これにより、/etc/yum.repos.d/kubernetes.repoにある既存の設定が上書きされます
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```

{{< note >}}
kubectlを他のマイナーリリースにアップグレードするためには、`yum update`を実行する前に、`/etc/yum.repos.d/kubernetes.repo`の中のバージョンを上げる必要があります。
この手順については[Changing The Kubernetes Package Repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/)に詳細が記載されています。
{{< /note >}}

2. `yum`を使用してkubectlをインストールしてください:

   ```bash
   sudo yum install -y kubectl
   ```

{{% /tab %}}

{{% tab name="SUSEベースのディストリビューション" %}}

1. Kubernetesの`zypper`リポジトリを追加してください。
{{< param "version" >}}とは異なるKubernetesバージョンを利用したい場合は、以下のコマンドの{{< param "version" >}}を目的のマイナーバージョンに置き換えてください。

   ```bash
   # これにより、/etc/zypp/repos.d/kubernetes.repoにある既存の設定が上書きされます
   cat <<EOF | sudo tee /etc/zypp/repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```

{{< note >}}
kubectlを他のマイナーリリースにアップグレードするためには、`zypper update`を実行する前に、`/etc/zypp/repos.d/kubernetes.repo`の中のバージョンを上げる必要があります。
この手順については[Changing The Kubernetes Package Repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/)に詳細が記載されています。
{{< /note >}}

   2. `zypper`を使用してkubectlをインストールしてください:

      ```bash
      sudo zypper install -y kubectl
      ```

{{% /tab %}}
{{< /tabs >}}

### 他のパッケージマネージャーを使用してインストールする{#install-using-other-package-management}

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
Ubuntuまたは[snap](https://snapcraft.io/docs/core/install)パッケージマネージャーをサポートする別のLinuxディストリビューションを使用している場合、kubectlは[snap](https://snapcraft.io/)アプリケーションとして使用できます。

```shell
snap install kubectl --classic
kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
Linuxで[Homebrew](https://docs.brew.sh/Homebrew-on-Linux)パッケージマネージャーを使用している場合は、kubectlを[インストール](https://docs.brew.sh/Homebrew-on-Linux#install)することが可能です。

```shell
brew install kubectl
kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}

## kubectlの設定を検証する

{{< include "included/verify-kubectl.md" >}}

## オプションのkubectlの設定とプラグイン

### シェルの自動補完を有効にする

kubectlはBash、Zsh、Fish、PowerShellの自動補完を提供しています。
これにより、入力を大幅に削減することができます。

以下にBash、Fish、Zshの自動補完の設定手順を示します。

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-linux.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### `kubectl convert`プラグインをインストールする

{{< include "included/kubectl-convert-overview.md" >}}

1. 次のコマンドを使用して最新リリースをダウンロードしてください:

   {{< tabs name="download_convert_binary_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

1. バイナリを検証してください(オプション)

   kubectl-convertのチェックサムファイルをダウンロードします:

   {{< tabs name="download_convert_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   チェックサムファイルに対してkubectl-convertバイナリを検証します:

   ```bash
   echo "$(cat kubectl-convert.sha256) kubectl-convert" | sha256sum --check
   ```

   正しければ、出力は次のようになります:

   ```console
   kubectl-convert: OK
   ```

   チェックに失敗すると、`sha256`は0以外のステータスで終了し、次のような出力を表示します:

   ```console
   kubectl-convert: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   同じバージョンのバイナリとチェックサムをダウンロードしてください。
   {{< /note >}}

1. kubectl-convertをインストールしてください

   ```bash
   sudo install -o root -g root -m 0755 kubectl-convert /usr/local/bin/kubectl-convert
   ```

1. プラグインが正常にインストールできたことを確認してください

   ```shell
   kubectl convert --help
   ```

   何もエラーが表示されない場合は、プラグインが正常にインストールされたことを示しています。

1. プラグインのインストール後、インストールファイルを削除してください:

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
