---
title: "Linux上でのbashの自動補完"
description: "Linux上でのbashの自動補完に対するいくつかの補助的な設定。"
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### はじめに

Bashにおけるkubectlの補完スクリプトは`kubectl completion bash`コマンドで生成できます。
補完スクリプトをシェル内に読み込ませることでkubectlの自動補完が有効になります。

ただし、補完スクリプトは[**bash-completion**](https://github.com/scop/bash-completion)に依存しているため、事前にインストールしておく必要があります(`type _init_completion`を実行することで、bash-completionがすでにインストールされていることを確認できます)。

### bash-completionをインストールする

bash-completionは多くのパッケージマネージャーから提供されています([こちら](https://github.com/scop/bash-completion#installation)を参照してください)。
`apt-get install bash-completion`または`yum install bash-completion`などでインストールできます。

上記のコマンドでbash-completionの主要スクリプトである`/usr/share/bash-completion/bash_completion`が作成されます。
パッケージマネージャーによっては、このファイルを`~/.bashrc`にて手動で読み込ませる必要があります。

これを調べるには、シェルをリロードしてから`type _init_completion`を実行してください。
コマンドが成功していればすでに設定済みです。そうでなければ、`~/.bashrc`ファイルに以下を追記してください:

```bash
source /usr/share/bash-completion/bash_completion
```

シェルをリロードし、`type _init_completion`を実行してbash-completionが正しくインストールされていることを検証してください。

### kubectlの自動補完を有効にする

#### Bash

次に、kubectl補完スクリプトがすべてのシェルセッションで読み込まれるように設定する必要があります。
これを行うには2つの方法があります:

{{< tabs name="kubectl_bash_autocompletion" >}}
{{< tab name="ユーザー" codelang="bash" >}}
echo 'source <(kubectl completion bash)' >>~/.bashrc
{{< /tab >}}
{{< tab name="システム" codelang="bash" >}}
kubectl completion bash | sudo tee /etc/bash_completion.d/kubectl > /dev/null
sudo chmod a+r /etc/bash_completion.d/kubectl
{{< /tab >}}
{{< /tabs >}}

kubectlにエイリアスを張っている場合は、エイリアスでも動作するようにシェルの補完を拡張することができます:

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -o default -F __start_kubectl k' >>~/.bashrc
```

{{< note >}}
bash-completionは`/etc/bash_completion.d`内のすべての補完スクリプトを読み込みます。
{{< /note >}}

どちらも同様の手法です。
シェルをリロードしたあとに、kubectlの自動補完が機能するはずです。
シェルの現在のセッションでbashの自動補完を有効にするには、~/.bashrcを読み込みます:

```bash
source ~/.bashrc
```
