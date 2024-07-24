---
title: macOS上でのkubectlのインストールおよびセットアップ
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

kubectlのバージョンは、クラスターのマイナーバージョンとの差分が1つ以内でなければなりません。
たとえば、クライアントがv{{< skew currentVersion >}}であれば、v{{< skew currentVersionAddMinor -1 >}}、v{{< skew currentVersionAddMinor 0 >}}、v{{< skew currentVersionAddMinor 1 >}}のコントロールプレーンと通信できます。
最新の互換性のあるバージョンのkubectlを使うことで、不測の事態を避けることができるでしょう。


## macOSへkubectlをインストールする{#install-kubectl-on-macos}

macOSへkubectlをインストールするには、次の方法があります:

- [macOSへkubectlをインストールする](#install-kubectl-on-macos)
  - [curlを使用してmacOSへkubectlのバイナリをインストールする](#install-kubectl-binary-with-curl-on-macos)
  - [Homebrewを使用してmacOSへインストールする](#install-with-homebrew-on-macos)
  - [MacPortsを使用してmacOSへインストールする](#install-with-macports-on-macos)
- [kubectlの設定を検証する](#verify-kubectl-configuration)
- [オプションのkubectlの設定とプラグイン](#optional-kubectl-configurations-and-plugins)
  - [シェルの自動補完を有効にする](#enable-shell-autocompletion)
  - [`kubectl convert`プラグインをインストールする](#install-kubectl-convert-plugin)

### curlを使用してmacOSへkubectlのバイナリをインストールする{#install-kubectl-binary-with-curl-on-macos}

1. 最新リリースをダウンロードしてください:

   {{< tabs name="download_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="Appleシリコン" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   特定のバージョンをダウンロードする場合、コマンドの`$(curl -L -s https://dl.k8s.io/release/stable.txt)`の部分を特定のバージョンに置き換えてください。

   例えば、Intel macOSへ{{< skew currentPatchVersion >}}のバージョンをダウンロードするには、次のコマンドを入力します:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/amd64/kubectl"
   ```

   Appleシリコン上のmacOSに対しては、次を入力します:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/arm64/kubectl"
   ```

   {{< /note >}}

1. バイナリを検証してください(オプション)

   kubectlのチェックサムファイルをダウンロードします:

   {{< tabs name="download_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="Appleシリコン" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}
  
   チェックサムファイルに対してkubectlバイナリを検証します:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | shasum -a 256 --check
   ```

   正しければ、出力は次のようになります:

   ```console
   kubectl: OK
   ```

   チェックに失敗すると、`shasum`は0以外のステータスで終了し、次のような出力を表示します:

   ```console
   kubectl: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   同じバージョンのバイナリとチェックサムをダウンロードしてください。
   {{< /note >}}

1. kubectlバイナリを実行可能にしてください。

   ```bash
   chmod +x ./kubectl
   ```

1. kubectlバイナリを`PATH`の中に移動させてください。

   ```bash
   sudo mv ./kubectl /usr/local/bin/kubectl
   sudo chown root: /usr/local/bin/kubectl
   ```

   {{< note >}}
   `/usr/local/bin`がPATH環境変数の中に含まれるようにしてください。
   {{< /note >}}

1. インストールしたバージョンが最新であることを確認してください:

   ```bash
   kubectl version --client
   ```
   
   または、バージョンの詳細を表示するために次を使用します:

   ```cmd
   kubectl version --client --output=yaml
   ```

1. kubectlをインストールし、検証した後は、チェックサムファイルを削除してください:

   ```bash
   rm kubectl.sha256
   ```

### Homebrewを使用してmacOSへインストールする{#install-with-homebrew-on-macos}

macOSで[Homebrew](https://brew.sh/)パッケージマネージャーを使用していれば、Homebrewでkubectlをインストールできます。

1. インストールコマンドを実行してください:

   ```bash
   brew install kubectl
   ```

   または

   ```bash
   brew install kubernetes-cli
   ```

1. インストールしたバージョンが最新であることを確認してください:

   ```bash
   kubectl version --client
   ```

### MacPortsを使用してmacOSへインストールする{#install-with-macports-on-macos}

macOSで[MacPorts](https://macports.org/)パッケージマネージャーを使用していれば、MacPortsでkubectlをインストールできます。

1. インストールコマンドを実行してください:

   ```bash
   sudo port selfupdate
   sudo port install kubectl
   ```

1. インストールしたバージョンが最新であることを確認してください:

   ```bash
   kubectl version --client
   ```

## kubectlの設定を検証する{#verify-kubectl-configuration}

{{< include "included/verify-kubectl.md" >}}

## オプションのkubectlの設定とプラグイン{#optional-kubectl-configurations-and-plugins}

### シェルの自動補完を有効にする{#enable-shell-autocompletion}

kubectlはBash、Zsh、Fish、PowerShellの自動補完を提供しています。
これにより、入力を大幅に削減することができます。

以下にBash、Fish、Zshの自動補完の設定手順を示します。

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-mac.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### `kubectl convert`プラグインをインストールする{#install-kubectl-convert-plugin}

{{< include "included/kubectl-convert-overview.md" >}}

1. 次のコマンドを使用して最新リリースをダウンロードしてください:

   {{< tabs name="download_convert_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="Appleシリコン" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

1. バイナリを検証してください(オプション)

   kubectl-convertのチェックサムファイルをダウンロードします:

   {{< tabs name="download_convert_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="Appleシリコン" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   チェックサムファイルに対してkubectl-convertバイナリを検証します:

   ```bash
   echo "$(cat kubectl-convert.sha256)  kubectl-convert" | shasum -a 256 --check
   ```

   正しければ、出力は次のようになります:

   ```console
   kubectl-convert: OK
   ```

   チェックに失敗すると、`shasum`は0以外のステータスで終了し、次のような出力を表示します:

   ```console
   kubectl-convert: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   同じバージョンのバイナリとチェックサムをダウンロードしてください。
   {{< /note >}}

1. kubectl-convertバイナリを実行可能にしてください。

   ```bash
   chmod +x ./kubectl-convert
   ```

1. kubectl-convertバイナリを`PATH`の中に移動してください。

   ```bash
   sudo mv ./kubectl-convert /usr/local/bin/kubectl-convert
   sudo chown root: /usr/local/bin/kubectl-convert
   ```

   {{< note >}}
   `/usr/local/bin`がPATH環境変数の中に含まれるようにしてください。
   {{< /note >}}

1. インストールしたバージョンが最新であることを確認してください

   ```shell
   kubectl convert --help
   ```

   何もエラーが表示されない場合は、プラグインが正常にインストールされたことを示しています。

1. プラグインのインストール後、インストールファイルを削除してください:

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

### macOS上のkubectlをアンインストールする

`kubectl`のインストール方法に応じて、次の方法を使用してください。

### コマンドラインを使用してkubectlをアンインストールする

1.  システム上の`kubectl`バイナリの場所を特定してください:

    ```bash
    which kubectl
    ```

1.  `kubectl`バイナリを削除してください:

    ```bash
    sudo rm <path>
    ```
    `<path>`を前のステップの`kubectl`バイナリのパスに置き換えてください。
    例えば`sudo rm /usr/local/bin/kubectl`。

### Homebrewを使用してkubectlをアンインストールする

Homebrewを使用して`kubectl`をインストールした場合は、次のコマンドを実行してください:

```bash
brew remove kubectl
```
  
## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}


