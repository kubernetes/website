---
title: Windows上でのkubectlのインストールおよびセットアップ
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

kubectlのバージョンは、クラスターのマイナーバージョンとの差分が1つ以内でなければなりません。
たとえば、クライアントがv{{< skew currentVersion >}}であれば、v{{< skew currentVersionAddMinor -1 >}}、v{{< skew currentVersionAddMinor 0 >}}、v{{< skew currentVersionAddMinor 1 >}}のコントロールプレーンと通信できます。
最新の互換性のあるバージョンのkubectlを使うことで、不測の事態を避けることができるでしょう。

## Windowsへkubectlをインストールする

Windowsへkubectlをインストールするには、次の方法があります:

- [curlを使用してWindowsへkubectlのバイナリをインストールする](#install-kubectl-binary-with-curl-on-windows)
- [Chocolatey、Scoopまたはwingetを使用してWindowsへインストールする](#install-nonstandard-package-tools)

### curlを使用してWindowsへkubectlのバイナリをインストールする{#install-kubectl-binary-with-curl-on-windows}

1. 最新の{{< skew currentVersion >}}のパッチリリースをダウンロードしてください:
   [kubectl {{< skew currentPatchVersion >}}](https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe)。

   または、`curl`がインストールされていれば、次のコマンドも使用できます:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe"
   ```

   {{< note >}}
   最新の安定版を入手する際は(たとえばスクリプトで使用する場合)、[https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt)を参照してください。
   {{< /note >}}

1. バイナリを検証してください(オプション)

   `kubectl`のチェックサムファイルをダウンロードします:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe.sha256"
   ```

   チェックサムファイルに対して`kubectl`バイナリを検証します:

   - コマンドプロンプトを使用して、`CertUtil`の出力とダウンロードしたチェックサムファイルを手動で比較します:

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   - PowerShellにて`-eq`オペレーターを使用して自動で検証を行い、`True`または`False`で結果を取得します:

     ```powershell
      $(Get-FileHash -Algorithm SHA256 .\kubectl.exe).Hash -eq $(Get-Content .\kubectl.exe.sha256)
     ```

1. `kubectl`バイナリのフォルダーを`PATH`環境変数に追加します。

1. `kubectl`のバージョンがダウンロードしたものと同じであることを確認してください:

   ```cmd
   kubectl version --client
   ```
   
   または、バージョンの詳細を表示するために次を使用します:

   ```cmd
   kubectl version --client --output=yaml
   ```



{{< note >}}
[Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/#kubernetes)は、それ自身のバージョンの`kubectl`を`PATH`に追加します。
Docker Desktopをすでにインストールしている場合、Docker Desktopインストーラーによって追加された`PATH`の前に追加するか、Docker Desktopの`kubectl`を削除してください。
{{< /note >}}

### Chocolatey、Scoopまたはwingetを使用してWindowsへインストールする{#install-nonstandard-package-tools}

1. Windowsへkubectlをインストールするために、[Chocolatey](https://chocolatey.org)パッケージマネージャーや[Scoop](https://scoop.sh)コマンドラインインストーラー、[winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/)パッケージマネージャーを使用することもできます。

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
   {{% tab name="winget" %}}
   ```powershell
   winget install -e --id Kubernetes.kubectl
   ```
   {{% /tab %}}
   {{< /tabs >}}

1. インストールしたバージョンが最新であることを確認してください:

   ```powershell
   kubectl version --client
   ```

1. ホームディレクトリへ移動してください:

   ```powershell
   # cmd.exeを使用している場合はcd %USERPROFILE%を実行してください。
   cd ~
   ```

1. `.kube`ディレクトリを作成してください:

   ```powershell
   mkdir .kube
   ```

1. 作成した`.kube`ディレクトリへ移動してください:

   ```powershell
   cd .kube
   ```

1. リモートのKubernetesクラスターを使うために、kubectlを設定してください:

   ```powershell
   New-Item config -type file
   ```

{{< note >}}
Notepadなどの選択したテキストエディターから設定ファイルを編集してください。
{{< /note >}}

## kubectlの設定を検証する

{{< include "included/verify-kubectl.md" >}}

## オプションのkubectlの設定とプラグイン

### シェルの自動補完を有効にする

kubectlはBash、Zsh、Fish、PowerShellの自動補完を提供しています。
これにより、入力を大幅に削減することができます。

以下にPowerShellの自動補完の設定手順を示します。

{{< include "included/optional-kubectl-configs-pwsh.md" >}}

### `kubectl convert`プラグインをインストールする

{{< include "included/kubectl-convert-overview.md" >}}

1. 次のコマンドを使用して最新リリースをダウンロードしてください:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe"
   ```

1. バイナリを検証してください(オプション)。

   `kubectl-convert`のチェックサムファイルをダウンロードします:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe.sha256"
   ```

   チェックサムファイルに対して`kubectl-convert`バイナリを検証します:

   - コマンドプロンプトを使用して、`CertUtil`の出力とダウンロードしたチェックサムファイルを手動で比較します:

     ```cmd
     CertUtil -hashfile kubectl-convert.exe SHA256
     type kubectl-convert.exe.sha256
     ```

   - PowerShellにて`-eq`オペレーターを使用して自動で検証を行い、`True`または`False`で結果を取得します:

     ```powershell
     $($(CertUtil -hashfile .\kubectl-convert.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl-convert.exe.sha256)
     ```

1. `kubectl-convert`バイナリのフォルダーを`PATH`環境変数に追加します。

1. プラグインが正常にインストールされたことを確認してください。

   ```shell
   kubectl convert --help
   ```

   何もエラーが表示されない場合は、プラグインが正常にインストールされたことを示しています。

1. プラグインのインストール後、インストールファイルを削除してください:

   ```powershell
   del kubectl-convert.exe
   del kubectl-convert.exe.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
