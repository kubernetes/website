---
title: "macOS上でのbashの自動補完"
description: "macOS上でのbashの自動補完に対するいくつかの補助的な設定。"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### はじめに

Bashにおけるkubectlの補完スクリプトは`kubectl completion bash`コマンドで生成できます。
補完スクリプトをシェル内に読み込ませることでkubectlの自動補完が有効になります。

ただし、補完スクリプトは[**bash-completion**](https://github.com/scop/bash-completion)に依存しているため、事前にインストールしておく必要があります。

{{< warning>}}
bash-completionにはv1とv2の2つのバージョンがあります。
v1はBash 3.2(macOSのデフォルト)用で、v2はBash 4.1以降向けです。
kubectlの補完スクリプトはbash-completionのv1とBash 3.2では正しく**動作しません**。
**bash-completion v2**と**Bash 4.1以降**が必要になります。
したがって、macOSで正常にkubectlの補完を使用するには、Bash 4.1以降をインストールする必要があります([*手順*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba))。
以下の手順では、Bash4.1以降(Bashのバージョンが4.1またはそれより新しいことを指します)を使用することを前提とします。
{{< /warning >}}

### Bashのアップグレード

ここではBash 4.1以降の使用を前提としています。
Bashのバージョンは下記のコマンドで調べることができます:

```bash
echo $BASH_VERSION
```

バージョンが古い場合、Homebrewを使用してインストールもしくはアップグレードできます:

```bash
brew install bash
```

シェルをリロードし、希望するバージョンを使用していることを確認してください:

```bash
echo $BASH_VERSION $SHELL
```

Homebrewは通常、`/usr/local/bin/bash`にインストールします。

### bash-completionをインストールする

{{< note >}}
前述のとおり、この手順ではBash 4.1以降であることが前提のため、bash-completion v2をインストールすることになります(これとは逆に、Bash 3.2およびbash-completion v1の場合ではkubectlの補完は動作しません)。
{{< /note >}}


`type _init_completion`を実行することで、bash-completionがすでにインストールされていることを確認できます。
ない場合は、Homebrewを使用してインストールすることができます:

```bash
brew install bash-completion@2
```

このコマンドの出力で示されたように、`~/.bash_profile`に以下を追記してください:

```bash
brew_etc="$(brew --prefix)/etc" && [[ -r "${brew_etc}/profile.d/bash_completion.sh" ]] && . "${brew_etc}/profile.d/bash_completion.sh"
```

シェルをリロードし、`type _init_completion`を実行してbash-completion v2が正しくインストールされていることを検証してください。

### kubectlの自動補完を有効にする

次に、kubectl補完スクリプトがすべてのシェルセッションで読み込まれるように設定する必要があります。
これを行うには複数の方法があります:

- 補完スクリプトを`~/.bash_profile`内で読み込ませる:

    ```bash
    echo 'source <(kubectl completion bash)' >>~/.bash_profile
    ```

- 補完スクリプトを`/usr/local/etc/bash_completion.d`ディレクトリに追加する:

    ```bash
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- kubectlにエイリアスを張っている場合は、エイリアスでも動作するようにシェルの補完を拡張することができます:

    ```bash
    echo 'alias k=kubectl' >>~/.bash_profile
    echo 'complete -o default -F __start_kubectl k' >>~/.bash_profile
    ```

- kubectlをHomebrewでインストールした場合([前述](/ja/docs/tasks/tools/install-kubectl-macos/#install-with-homebrew-on-macos)の通り)、kubectlの補完スクリプトはすでに`/usr/local/etc/bash_completion.d/kubectl`に格納されているでしょうか。
  この場合、なにも操作する必要はありません。

   {{< note >}}
   Homebrewでインストールしたbash-completion v2は`BASH_COMPLETION_COMPAT_DIR`ディレクトリ内のすべてのファイルを読み込むため、後者の2つの方法が機能します。
   {{< /note >}}

どの場合でも、シェルをリロードしたあとに、kubectlの自動補完が機能するはずです。
