---
title: kubeconfigファイルを使用してクラスターアクセスを組織する
content_type: concept
weight: 60
---

<!-- overview -->

kubeconfigを使用すると、クラスターに、ユーザー、名前空間、認証の仕組みに関する情報を組織できます。`kubectl`コマンドラインツールはkubeconfigファイルを使用してクラスターを選択するために必要な情報を見つけ、クラスターのAPIサーバーと通信します。

{{< note >}}
クラスターへのアクセスを設定するために使われるファイルは*kubeconfigファイル*と呼ばれます。これは設定ファイルを指すために使われる一般的な方法です。`kubeconfig`という名前を持つファイルが存在するという意味ではありません。
{{< /note >}}

{{< warning >}}
信頼できるソースからのkubeconfigファイルのみを使用してください。特別に細工されたkubeconfigファイルを使用すると、悪意のあるコードの実行やファイルの公開につながる可能性があります。
信頼できないkubeconfigファイルを使用しなければならない場合は、シェルスクリプトを使用するのと同じように、まず最初に慎重に検査してください。
{{< /warning>}}

デフォルトでは、`kubectl`は`$HOME/.kube`ディレクトリ内にある`config`という名前のファイルを探します。`KUBECONFIG`環境変数を設定するか、[`--kubeconfig`](/docs/reference/generated/kubectl/kubectl/)フラグで指定することで、別のkubeconfigファイルを指定することもできます。

kubeconfigファイルの作成と指定に関するステップバイステップの手順を知りたいときは、[複数のクラスターへのアクセスを設定する](/ja/docs/tasks/access-application-cluster/configure-access-multiple-clusters)を参照してください。

<!-- body -->

## 複数のクラスター、ユーザ、認証の仕組みのサポート

複数のクラスターを持っていて、ユーザーやコンポーネントがさまざまな方法で認証を行う次のような状況を考えてみます。

- 実行中のkubeletが証明書を使用して認証を行う可能性がある。
- ユーザーがトークンを使用して認証を行う可能性がある。
- 管理者が個別のユーザに提供する複数の証明書を持っている可能性がある。

kubeconfigファイルを使用すると、クラスター、ユーザー、名前空間を組織化することができます。また、contextを定義することで、複数のクラスターや名前空間を素早く簡単に切り替えられます。

## Context

kubeconfigファイルの*context*要素は、アクセスパラメーターを使いやすい名前でグループ化するために使われます。各contextは3つのパラメーター、cluster、namespace、userを持ちます。デフォルトでは、`kubectl`コマンドラインツールはクラスターとの通信に*current context*のパラメーターを使用します。

current contextを選択するには、以下のコマンドを使用します。

```
kubectl config use-context
```

## KUBECONFIG環境変数

`KUBECONFIG`環境変数には、kubeconfigファイルのリストを指定できます。LinuxとMacでは、リストはコロン区切りです。Windowsでは、セミコロン区切りです。`KUBECONFIG`環境変数は必須ではありません。`KUBECONFIG`環境変数が存在しない場合は、`kubectl`はデフォルトのkubeconfigファイルである`$HOME/.kube/config`を使用します。

`KUBECONFIG`環境変数が存在する場合は、`kubectl`は`KUBECONFIG`環境変数にリストされているファイルをマージした結果を有効な設定として使用します。

## kubeconfigファイルのマージ

設定ファイルを確認するには、以下のコマンドを実行します。

```shell
kubectl config view
```

上で説明したように、出力は1つのkubeconfigファイルから作られる場合も、複数のkubeconfigファイルをマージした結果となる場合もあります。

`kubectl`がkubeconfigファイルをマージするときに使用するルールを以下に示します。

1. もし`--kubeconfig`フラグが設定されていた場合、指定したファイルだけが使用されます。マージは行いません。このフラグに指定できるのは1つのファイルだけです。

   そうでない場合、`KUBECONFIG`環境変数が設定されていた場合には、それをマージするべきファイルのリストとして使用します。`KUBECONFIG`環境変数にリストされたファイルのマージは、次のようなルールに従って行われます。

   * 空のファイルを無視する。
   * デシリアライズできない内容のファイルに対してエラーを出す。
   * 特定の値やmapのキーを設定する最初のファイルが勝つ。
   * 値やmapのキーは決して変更しない。
     例: 最初のファイルが指定した`current-context`を保持する。
     例: 2つのファイルが`red-user`を指定した場合、1つ目のファイルの`red-user`だけを使用する。もし2つ目のファイルの`red-user`以下に競合しないエントリーがあったとしても、それらは破棄する。

   `KUBECONFIG`環境変数を設定する例については、[KUBECONFIG環境変数を設定する](/ja/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable)を参照してください。

   それ以外の場合は、デフォルトのkubeconfigファイル`$HOME/.kube/config`をマージせずに使用します。

1. 以下のチェーンで最初に見つかったものをもとにして、使用するcontextを決定する。

    1. `--context`コマンドラインフラグが存在すれば、それを使用する。
    1. マージしたkubeconrfigファイルから`current-context`を使用する。

   この時点では、空のcontextも許容されます。

1. クラスターとユーザーを決定する。この時点では、contextである場合もそうでない場合もあります。以下のチェーンで最初に見つかったものをもとにして、クラスターとユーザーを決定します。この手順はユーザーとクラスターについてそれぞれ1回ずつ、合わせて2回実行されます。

   1. もし存在すれば、コマンドラインフラグ`--user`または`--cluster`を使用する。
   1. もしcontextが空でなければ、contextからユーザーまたはクラスターを取得する。

   この時点では、ユーザーとクラスターは空である可能性があります。

1. 使用する実際のクラスター情報を決定する。この時点では、クラスター情報は存在しない可能性があります。以下のチェーンで最初に見つかったものをもとにして、クラスター情報の各パーツをそれぞれを構築します。

   1. もし存在すれば、`--server`、`--certificate-authority`、`--insecure-skip-tls-verify`コマンドラインフラグを使用する。
   1. もしマージしたkubeconfigファイルにクラスター情報の属性が存在すれば、それを使用する。
   1. もしサーバーの場所が存在しなければ、マージは失敗する。

1. 使用する実際のユーザー情報を決定する。クラスター情報の場合と同じルールを使用して、ユーザー情報を構築します。ただし、ユーザーごとに許可される認証方法は1つだけです。

   1. もし存在すれば、`--client-certificate`、`--client-key`、`--username`、`--password`、`--token`コマンドラインフラグを使用する。
   1. マージしたkubeconfigファイルの`user`フィールドを使用する。
   1. もし2つの競合する方法が存在する場合、マージは失敗する。

1. もし何らかの情報がまだ不足していれば、デフォルトの値を使用し、認証情報については場合によってはプロンプトを表示する。

## ファイルリファレンス

kubeconfigファイル内のファイルとパスのリファレンスは、kubeconfigファイルの位置からの相対パスで指定します。コマンドライン上のファイルのリファレンスは、現在のワーキングディレクトリからの相対パスです。`$HOME/.kube/config`内では、相対パスは相対のまま、絶対パスは絶対のまま保存されます。

## プロキシ

kubeconfigファイルで`proxy-url`を使用すると、以下のようにクラスターごとにプロキシを使用するように`kubectl`を設定することができます。

```yaml
apiVersion: v1
kind: Config

clusters:
- cluster:
    proxy-url: http://proxy.example.org:3128
    server: https://k8s.example.org/k8s/clusters/c-xxyyzz
  name: development

users:
- name: developer

contexts:
- context:
  name: development
```


## {{% heading "whatsnext" %}}


* [複数のクラスターへのアクセスを設定する](/ja/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
* [`kubectl config`](/docs/reference/generated/kubectl/kubectl-commands#config)
