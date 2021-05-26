---
title: kubectlのインストールおよびセットアップ
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: kubectlのインストール
---

<!-- overview -->
Kubernetesのコマンドラインツールである[kubectl](/ja/docs/reference/kubectl/overview/)を使用して、Kubernetesクラスターに対してコマンドを実行することができます。kubectlによってアプリケーションのデプロイや、クラスターのリソース管理、検査およびログの表示を行うことができます。kubectlの操作に関する完全なリストは、[kubectlの概要](/ja/docs/reference/kubectl/overview/)を参照してください。


## {{% heading "prerequisites" %}}

kubectlのバージョンは、クラスターのマイナーバージョンとの差分が1つ以内でなければなりません。たとえば、クライアントがv1.2であれば、v1.1、v1.2、v1.3のマスターで動作するはずです。最新バージョンのkubectlを使うことで、不測の事態を避けることができるでしょう。


<!-- steps -->

## Linuxへkubectlをインストールする {#install-kubectl-on-linux}

### curlを使用してLinuxへkubectlのバイナリをインストールする

1. 次のコマンドにより、最新リリースをダウンロードしてください:

    ```
    curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
    ```

    特定のバージョンをダウンロードする場合、コマンドの`$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)`の部分を特定のバージョンに書き換えてください。

    たとえば、Linuxへ{{< param "fullversion" >}}のバージョンをダウンロードするには、次のコマンドを入力します:

    ```
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/linux/amd64/kubectl
    ```

2. kubectlバイナリを実行可能にしてください。

    ```
    chmod +x ./kubectl
    ```

3. バイナリをPATHの中に移動させてください。

    ```
    sudo mv ./kubectl /usr/local/bin/kubectl
    ```

4. インストールしたバージョンが最新であることを確認してください:

    ```
    kubectl version --client
    ```

### ネイティブなパッケージマネージャーを使用してインストールする

{{< tabs name="kubectl_install" >}}
{{< tab name="Ubuntu、DebianまたはHypriotOS" codelang="bash" >}}
sudo apt-get update && sudo apt-get install -y apt-transport-https gnupg2
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
{{< /tab >}}
{{< tab name="CentOS、RHELまたはFedora" codelang="bash" >}}cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
yum install -y kubectl
{{< /tab >}}
{{< /tabs >}}


### 他のパッケージマネージャーを使用してインストールする

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

## macOSへkubectlをインストールする {#install-kubectl-on-macos}

### curlを使用してmacOSへkubectlのバイナリをインストールする

1. 最新リリースをダウンロードしてください:

   ```bash
   curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl"
   ```

   特定のバージョンをダウンロードする場合、コマンドの`$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)`の部分を特定のバージョンに書き換えてください。

   たとえば、macOSへ{{< param "fullversion" >}}のバージョンをダウンロードするには、次のコマンドを入力します:

   ```bash
    curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/darwin/amd64/kubectl
   ```

2. kubectlバイナリを実行可能にしてください。

   ```bash
   chmod +x ./kubectl
   ```

3. バイナリをPATHの中に移動させてください。

   ```bash
   sudo mv ./kubectl /usr/local/bin/kubectl
   ```
4. インストールしたバージョンが最新であることを確認してください:

   ```bash
   kubectl version --client
   ```

### Homebrewを使用してmacOSへインストールする

macOSで[Homebrew](https://brew.sh/)パッケージマネージャーを使用していれば、Homebrewでkubectlをインストールすることもできます。

1. インストールコマンドを実行してください:

   ```bash
   brew install kubectl
   ```
   または

   ```bash
   brew install kubernetes-cli
   ```

2. インストールしたバージョンが最新であることを確認してください:

   ```bash
   kubectl version --client
   ```

### MacPortsを使用してmacOSへインストールする

macOSで[MacPorts](https://macports.org/)パッケージマネージャーを使用していれば、MacPortsでkubectlをインストールすることもできます。

1. インストールコマンドを実行してください:

   ```bash
   sudo port selfupdate
   sudo port install kubectl
   ```

2. インストールしたバージョンが最新であることを確認してください:

   ```bash
   kubectl version --client
   ```

## Windowsへkubectlをインストールする {#install-kubectl-on-windows}

### curlを使用してWindowsへkubectlのバイナリをインストールする

1. [こちらのリンク](https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe)から、最新リリースである{{< param "fullversion" >}}をダウンロードしてください。

   または、`curl`をインストールされていれば、次のコマンドも使用できます:

    ```bash
   curl -LO https://storage.googleapis.com/kubernetes-release/release/{{< param "fullversion" >}}/bin/windows/amd64/kubectl.exe
   ```

   最新の安定版を入手する際は(たとえばスクリプトで使用する場合)、[https://storage.googleapis.com/kubernetes-release/release/stable.txt](https://storage.googleapis.com/kubernetes-release/release/stable.txt)を参照してください。

2. バイナリをPATHに追加します
3. `kubectl`のバージョンがダウンロードしたものと同じであることを確認してください:

   ```bash
   kubectl version --client
   ```
{{< note >}}
[Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/#kubernetes)は、それ自身のバージョンの`kubectl`をPATHに追加します。Docker Desktopをすでにインストールしている場合、Docker Desktopインストーラーによって追加されたPATHの前に追加するか、Docker Desktopの`kubectl`を削除してください。
{{< /note >}}

### PSGalleryからPowerShellを使用してインストールする

Windowsで[Powershell Gallery](https://www.powershellgallery.com/)パッケージマネージャーを使用していれば、Powershellでkubectlをインストールおよびアップデートすることもできます。

1. インストールコマンドを実行してください(必ず`DownloadLocation`を指定してください):

   ```powershell
   Install-Script -Name 'install-kubectl' -Scope CurrentUser -Force
   install-kubectl.ps1 [-DownloadLocation <path>]
   ```

   {{< note >}}
   `DownloadLocation`を指定しない場合、`kubectl`はユーザのTempディレクトリにインストールされます。
   {{< /note >}}

   インストーラーは`$HOME/.kube`を作成し、設定ファイルを作成します。

2. インストールしたバージョンが最新であることを確認してください:

   ```powershell
   kubectl version --client
   ```

{{< note >}}
アップデートする際は、手順1に示した2つのコマンドを再実行してください。
{{< /note >}}

### ChocolateyまたはScoopを使用してWindowsへインストールする

1. Windowsへkubectlをインストールするために、[Chocolatey](https://chocolatey.org)パッケージマネージャーや[Scoop](https://scoop.sh)コマンドラインインストーラーを使用することもできます。

   {{< tabs name="kubectl_win_install" >}}
   {{% tab name="choco" %}}
   ```powershell
   choco install kubernetes-cli
   ```
   {{% /tab %}}
   {{% tab name="scoop" %}}
   ```powershell
   scoop install kubectl
   ```
   {{% /tab %}}
   {{< /tabs >}}

2. インストールしたバージョンが最新であることを確認してください:

   ```powershell
   kubectl version --client
   ```

3. ホームディレクトリへ移動してください:

   ```powershell
   # cmd.exeを使用している場合は cd %USERPROFILE% を実行してください。
   cd ~
   ```
4. `.kube`ディレクトリを作成してください:

   ```powershell
   mkdir .kube
   ```

5. 作成した`.kube`ディレクトリへ移動してください:

   ```powershell
   cd .kube
   ```

6. リモートのKubernetesクラスターを使うために、kubectlを設定してください:

   ```powershell
   New-Item config -type file
   ```

{{< note >}}
Notepadなどの選択したテキストエディターから設定ファイルを編集してください。
{{< /note >}}

## Google Cloud SDKの一部としてダウンロードする

Google Cloud SDKの一部として、kubectlをインストールすることもできます。

1. [Google Cloud SDK](https://cloud.google.com/sdk/)をインストールしてください。
2. `kubectl`のインストールコマンドを実行してください:

   ```shell
   gcloud components install kubectl
   ```

3. インストールしたバージョンが最新であることを確認してください:

   ```shell
   kubectl version --client
   ```

## kubectlの設定を検証する

kubectlがKubernetesクラスターを探索し接続するために、[kubeconfigファイル](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)が必要になります。これは、[kube-up.sh](https://github.com/kubernetes/kubernetes/blob/master/cluster/kube-up.sh)によりクラスターを作成した際や、Minikubeクラスターを正常にデプロイした際に自動生成されます。デフォルトでは、kubectlの設定は`~/.kube/config`に格納されています。

クラスターの状態を取得し、kubectlが適切に設定されていることを確認してください:

```shell
kubectl cluster-info
```
URLのレスポンスが表示されている場合は、kubectlはクラスターに接続するよう正しく設定されています。

以下のようなメッセージが表示されている場合は、kubectlは正しく設定されていないか、Kubernetesクラスターに接続できていません。

```
The connection to the server <server-name:port> was refused - did you specify the right host or port?
```

たとえば、ラップトップ上(ローカル環境)でKubernetesクラスターを起動するような場合、Minikubeなどのツールを最初にインストールしてから、上記のコマンドを再実行する必要があります。

kubectl cluster-infoがURLレスポンスを返したにもかかわらずクラスターにアクセスできない場合は、次のコマンドで設定が正しいことを確認してください:

```shell
kubectl cluster-info dump
```

## kubectlの任意の設定

### シェルの自動補完を有効にする

kubectlはBashおよびZshの自動補完を提供しています。これにより、入力を大幅に削減することができます。

以下にBash(LinuxとmacOSの違いも含む)およびZshの自動補完の設定手順を示します。

{{< tabs name="kubectl_autocompletion" >}}

{{% tab name="LinuxでのBash" %}}

### はじめに

Bashにおけるkubectlの補完スクリプトは`kubectl completion bash`コマンドで生成できます。シェル内で補完スクリプトをsourceすることでkubectlの自動補完が有効になります。

ただし、補完スクリプトは[**bash-completion**](https://github.com/scop/bash-completion)に依存しているため、このソフトウェアを最初にインストールしておく必要があります(`type _init_completion`を実行することで、bash-completionがすでにインストールされていることを確認できます)。

### bash-completionをインストールする

bash-completionは多くのパッケージマネージャーから提供されています([こちら](https://github.com/scop/bash-completion#installation)を参照してください)。`apt-get install bash-completion`または`yum install bash-completion`などでインストールできます。

上記のコマンドでbash-completionの主要スクリプトである`/usr/share/bash-completion/bash_completion`が作成されます。パッケージマネージャーによっては、このファイルを`~/.bashrc`にて手動でsourceする必要があります。

これを調べるには、シェルをリロードしてから`type _init_completion`を実行してください。コマンドが成功していればすでに設定済みです。そうでなければ、`~/.bashrc`に以下を追記してください:

```bash
source /usr/share/bash-completion/bash_completion
```

シェルをリロードし、`type _init_completion`を実行してbash-completionが正しくインストールされていることを検証してください。

### kubectlの自動補完を有効にする

すべてのシェルセッションにてkubectlの補完スクリプトをsourceできるようにしなければなりません。これを行うには2つの方法があります:

- 補完スクリプトを`~/.bashrc`内でsourceしてください:

   ```bash
   echo 'source <(kubectl completion bash)' >>~/.bashrc
   ```

- 補完スクリプトを`/etc/bash_completion.d`ディレクトリに追加してください:

   ```bash
   kubectl completion bash >/etc/bash_completion.d/kubectl
   ```
- kubectlにエイリアスを張っている場合は、以下のようにシェルの補完を拡張して使うことができます:

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -F __start_kubectl k' >>~/.bashrc
```

{{< note >}}
bash-completionは`/etc/bash_completion.d`内のすべての補完スクリプトをsourceします。
{{< /note >}}

どちらも同様の手法です。シェルをリロードしたあとに、kubectlの自動補完が機能するはずです。

{{% /tab %}}


{{% tab name="macOSでのBash" %}}


### はじめに

Bashにおけるkubectlの補完スクリプトは`kubectl completion bash`コマンドで生成できます。シェル内で補完スクリプトをsourceすることでkubectlの自動補完が有効になります。

ただし、補完スクリプトは[**bash-completion**](https://github.com/scop/bash-completion)に依存しているため、事前にインストールする必要があります。

{{< warning>}}
bash-completionにはv1とv2のバージョンがあり、v1はBash 3.2(macOSのデフォルト)用で、v2はBash 4.1以降向けです。kubectlの補完スクリプトはbash-completionのv1とBash 3.2では正しく**動作しません**。**bash-completion v2**および**Bash 4.1**が必要になります。したがって、macOSで正常にkubectlの補完を使用するには、Bash 4.1以降をインストールする必要があります([*手順*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba))。以下の手順では、Bash4.1以降(Bashのバージョンが4.1またはそれより新しいことを指します)を使用することを前提とします。
{{< /warning >}}

### bashのアップグレード

ここではBash 4.1以降の使用を前提としています。Bashのバージョンは下記のコマンドで調べることができます。

```bash
echo $BASH_VERSION
```

バージョンが古い場合、Homebrewを使用してインストールもしくはアップグレードできます。

```bash
brew install bash
```

シェルをリロードし、希望するバージョンを使用していることを確認してください。

```bash
echo $BASH_VERSION $SHELL
```

Homebrewは通常、`/usr/local/bin/bash`にインストールします。

### bash-completionをインストールする

{{< note >}}
前述のとおり、この手順ではBash 4.1以降であることが前提のため、bash-completion v2をインストールすることになります(これとは逆に、Bash 3.2およびbash-completion v1の場合ではkubectlの補完は動作しません)。
{{< /note >}}

`type _init_completion`を実行することで、bash-completionがすでにインストールされていることを確認できます。ない場合は、Homebrewを使用してインストールすることもできます:

```bash
brew install bash-completion@2
```

このコマンドの出力で示されたように、`~/.bash_profile`に以下を追記してください:

```bash
export BASH_COMPLETION_COMPAT_DIR="/usr/local/etc/bash_completion.d"
[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"
```

シェルをリロードし、`type _init_completion`を実行してbash-completion v2が正しくインストールされていることを検証してください。

### kubectlの自動補完を有効にする


すべてのシェルセッションにてkubectlの補完スクリプトをsourceできるようにしなければなりません。これを行うには複数の方法があります:

- 補完スクリプトを`~/.bash_profile`内でsourceする:

   ```bash
   echo 'source <(kubectl completion bash)' >>~/.bash_profile
   ```

- 補完スクリプトを`/usr/local/etc/bash_completion.d`ディレクトリに追加する:

   ```bash
   kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
   ```

- kubectlにエイリアスを張っている場合は、以下のようにシェルの補完を拡張して使うことができます:

   ```bash
   echo 'alias k=kubectl' >>~/.bash_profile
   echo 'complete -F __start_kubectl k' >>~/.bash_profile
   ```

- kubectlをHomwbrewでインストールした場合([前述](#homebrewを使用してmacosへインストールする)のとおり)、kubectlの補完スクリプトはすでに`/usr/local/etc/bash_completion.d/kubectl`に格納されているでしょう。この場合、なにも操作する必要はありません。

   {{< note >}}
   Homebrewでインストールしたbash-completion v2は`BASH_COMPLETION_COMPAT_DIR`ディレクトリ内のすべてのファイルをsourceするため、後者の2つの方法が機能します。
   {{< /note >}}

どの場合でも、シェルをリロードしたあとに、kubectlの自動補完が機能するはずです。
{{% /tab %}}

{{% tab name="Zsh" %}}

Zshにおけるkubectlの補完スクリプトは`kubectl completion zsh`コマンドで生成できます。シェル内で補完スクリプトをsourceすることでkubectlの自動補完が有効になります。

すべてのシェルセッションで使用するには、`~/.zshrc`に以下を追記してください:

```zsh
source <(kubectl completion zsh)
```

kubectlにエイリアスを張っている場合は、以下のようにシェルの補完を拡張して使うことができます:

```zsh
echo 'alias k=kubectl' >>~/.zshrc
echo 'complete -F __start_kubectl k' >>~/.zshrc
```

シェルをリロードしたあとに、kubectlの自動補完が機能するはずです。

`complete:13: command not found: compdef`のようなエラーが出力された場合は、以下を`~/.zshrc`の先頭に追記してください:

```zsh
autoload -Uz compinit
compinit
```
{{% /tab %}}
{{< /tabs >}}



## {{% heading "whatsnext" %}}

* [Minikubeをインストールする](https://minikube.sigs.k8s.io/docs/start/)
* クラスターの作成に関する詳細を[スタートガイド](/ja/docs/setup/)で確認する
* [アプリケーションを起動して公開する方法を学ぶ](/ja/docs/tasks/access-application-cluster/service-access-application-cluster/)
* あなたが作成していないクラスターにアクセスする必要がある場合は、[クラスターアクセスドキュメントの共有](/ja/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)を参照してください
* [kubectlリファレンスドキュメント](/docs/reference/kubectl/kubectl/)を参照する
