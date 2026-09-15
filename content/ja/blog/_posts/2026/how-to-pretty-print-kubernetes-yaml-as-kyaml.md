---
layout: blog
title: "Kubernetes YAMLをKYAMLとしてプリティプリントする方法、そしてなぜそうしたいのか"
date: 2026-08-11T10:00:00-08:00
slug: how-to-pretty-print-kubernetes-yaml-as-kyaml
author: >
  [Kashish Verma](https://github.com/KashishV999)
translator: >
  [Tadashi Inagaki](https://github.com/ingktds) ([Creationline, Inc.](https://www.creationline.com))
---

YAMLは長年Kubernetesマニフェストを書く標準的なやり方となっています。
読者のみなさんが目にしたそれぞれの例、チュートリアル、設定ファイルはYAMLで書かれています。
問題はYAMLが悪いフォーマットであるということではありません。
それはYAMLが多くの選択肢を与えてくれるということです。
そして、Kubernetesマニフェストを書くことに関して、選択肢のすべてが等しくいいとは言えません。
いくつかの特徴としては、ファイルがより読みにくくなったり、いくつかは誤用されやすくなったり、それ以外には驚くべき振る舞いに繋がり得るのです。

興味深いところは、Kubernetesが実際にそれらの特徴をほとんど必要としないということです。
KubernetesはYAMLのごく一部分に依存しているだけです。
これは簡単な質問へと繋がりました。
もしKubernetesがYAMLのごく一部分を必要とするだけなのなら、その部分を*標準化*して、それ以外は避けるのはどうでしょうか？
新しい設定言語を導入する代わりに、[SIG CLI](https://github.com/kubernetes/community/tree/main/sig-cli)は、YAMLを書くために、より厳格で、より一貫した方法、すなわち**KYAML**を導入しました。

## KYAMLとは？ {#what-is-kyaml}

***KYAMLは、[KEP 5295](https://www.kubernetes.dev/resources/keps/5295/)で提案されているように、何も変更することなく既存のエコシステムによって解析できるようデザインされた、標準YAMLの厳格なサブセット(もしくは「方言」)です。***
新しいフォーマットや新しいパーサーを導入しません。
YAMLを書く時に選択する範囲を狭めるだけです。
そのため、誰もが結果的に同じ選択をすることになります。

KYAMLを新しい言語というよりむしろ、合意されたスタイルとして捉えてください。
***KYAMLで有効なものはYAMLでも有効です。***

## KYAMLはどう解決するのか {#how-kyaml-solves-it}

標準YAMLにはいくつかの有名な落とし穴があり、JSONにも独自の落とし穴がないわけではありません。

**空白文字の扱いの厳密さ。**
インデントがYAMLにおいて構造を定義します。
間違えてインデントされたファイルは、構文的には有効なままでありながら、意図したものとは異なるオブジェクトを表してしまう可能性があります。
これはHelmのようなテンプレートツールにおいて特に厄介です。そうしたツールでは、YAMLの文脈の外からインデントを操作することになるためです。

**暗黙の型変換。**
YAMLでは文字列のクォートは任意です。
これは便利でなくなるまでは便利に聞こえます。
文字列のように見えるいくつかの値が、警告なしで他の型に変換されます。
定番の例は["Norway Bug"](https://hitchdev.com/strictyaml/why/implicit-typing-removed/)です。

```yaml
country: NO
```

標準YAMLでは、`NO`は文字列型の`"NO"`ではなく、ブーリアン型の`false`として解釈されます。
そしてそれが少なからぬ人々の不意を突いてきました。

**JSONもその答えではありません。**
JSONはコメントサポートが欠けており、末尾のカンマについて厳密で、すべてのキーをクォートする必要があります。
これらのことは、良い設定を書く体験に役立ちません。

***KYAMLは、構造と型を明示的にすることでこれらすべてに対処します:***

- 構造に関して空白に依存しない
- 暗黙の型変換が起こらないよう必ず値文字列をクォートする
- マップと構造体には必ず`{}`を使用する
- リストには必ず`[]`を使用する
- JSONと違ってコメントと末尾のカンマを許可する
- KYAMLとJSON両方が`{`で始まるので、一目でKYAMLとJSONを区別できるよう`---`ヘッダを含める

YAMLはこれを、多くの人が使う従来の**block style**とは対照的に、**flow style**と呼びます。
KYAMLはJSONとYAMLの中程に位置します。
デフォルトのYAMLよりも明示的で、JSONよりも親しみやすいのです。

こちらは比較のために両方のフォーマットで書かれた同じPodのマニフェストです。

### 標準YAML {#standard-yaml}
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
  labels:
    app: demo
spec:
  containers:
    - name: nginx
      image: nginx:1.20
```

### KYAML {#kyaml}
```yaml
---
{
  apiVersion: "v1",
  kind: "Pod",
  metadata: {
    name: "my-pod",
    labels: {
      app: "demo",
    },
  },
  spec: {
    containers: [{
      name: "nginx",
      image: "nginx:1.20",
    }],
  },
}
```

ダブルクォーテーションで囲まれた文字列、マップの周りの波括弧、リストの周りの角括弧と末尾のカンマには注意してください。
追加のシンタックスは、インデントに頼る代わりにドキュメント構造を明確にします。

## YAMLをKYAMLとしてプリティプリントするには {#how-to-pretty-print-yaml-as-kyaml}

KYAML出力を得るには異なるやり方があります。

### オプション1: kubectl -o kyaml {#option-1-kubectl-o-kyaml}

Kubernetes 1.34から`kubectl`はネイティブ出力フォーマットとしてKYAMLをサポートしています。
```bash
# Kubernetes 1.35+ (ベータ; デフォルトで機能が有効になっているが、まだ-o kyaml CLIパラメータは必要とする)
kubectl get deployment my-app -o kyaml

# Kubernetes 1.34 (アルファ、オプトイン)
export KUBECTL_KYAML=true
kubectl get deployment my-app -o kyaml
```

出力をファイルに保存するには:

```bash
kubectl get deployment my-app -o kyaml > my-app.yaml
```

現在、KYAMLをデフォルト出力フォーマットにする計画はありません。
もしデフォルトでKYAMLを使用したいなら、`kuberc`で好みのデフォルトを設定することが可能です。
更なる詳細については、[kuberc documentation](https://kubernetes.io/docs/reference/kubectl/kuberc/)を確認してください。

```bash
# Kubernetes 1.36+
kubectl kuberc set --section defaults --command get --option output=kyaml

# Kubernetes 1.33–1.35 (alpha接頭辞はまだ必要です)
kubectl alpha kuberc set --section defaults --command get --option output=kyaml
```

### オプション2: Kubernetesのyamlfmt {#option-2-kubernetes-yamlfmt}

[sigs.k8s.io/yaml](https://github.com/kubernetes-sigs/yaml)は、ファイルをKYAMLに変換することが可能な`yamlfmt`ツールを提供します。

Go経由のインストール:

```bash
go install sigs.k8s.io/yaml/yamlfmt@latest
```

ファイルに対して実行することは、KYAMLバージョンを**標準出力**に出力します。
それはディレクトリも受け入れます。
その場合、ディレクトリ内の各ファイルを変換し、出力します。
_そのため、変換を確実に反映させたい場合、ファイルへの出力をリダイレクトする必要があります。_

```bash
yamlfmt -o=kyaml my-deployment.yaml
```

それは完全な変換の代わりに、diffを表示することもできます:

```bash
yamlfmt -o=kyaml -d my-deployment.yaml
```

### オプション3: Googleのyamlfmt {#option-3-google-s-yamlfmt}

既存のファイルを変換するために、Googleの`yamlfmt`は専用の[`kyaml` formatter](https://github.com/google/yamlfmt/blob/main/docs/config-file.md#kyaml-formatter)をv0.21.0で追加しました。
Go経由でインストールするか、[releases page](https://github.com/google/yamlfmt/releases)からバイナリを入手してください:

```bash
go install github.com/google/yamlfmt/cmd/yamlfmt@latest
```

[pre-commit hook](https://github.com/google/yamlfmt/blob/main/docs/pre-commit.md)としても、CIパイプライン向けの[Docker image](https://github.com/google/yamlfmt#basic-usage)としても利用可能です。

プロジェクトルートに`.yamlfmt`設定を追加してください:

```yaml
formatter:
  type: kyaml
```

ファイルを変更しないで出力を事前確認してください:

```bash
yamlfmt -dry my-deployment.yaml
```

その後適用してください:

```bash
yamlfmt my-deployment.yaml
```

ディレクトリ全体を変換するには:

```bash
yamlfmt ./k8s/
```

`kyaml`フォーマッターは追加設定はなく、オプションをデフォルトフォーマッターと共有しません。
そのため、それらを混在させるとエラーになります。

利用可能なモードやフラグの詳細については、[command usage docs](https://github.com/google/yamlfmt/blob/main/docs/command-usage.md)を確認してください。

## KYAMLを採用する価値はありますか？ {#is-kyaml-worth-adopting}

それぞれの有効なKYAMLファイルは有効なYAMLファイルです。
そのため、KYAMLで書いたものは何であれ、既存のツール、`kubectl`、CIパイプラインを変更する必要はありません。
1.34以降に限らず、あらゆるバージョンの`kubectl`への入力としてKYAMLを渡すことさえ可能です。
なぜなら最終的にそれはただのYAMLなのです。

KYAMLは厳密には必須ではありません。
ブロックスタイルYAMLを書き続けることができ、うまくいきます。
しかし、特にチームや大規模なリポジトリにおいて、設定のエラーを起こしにくく、より一貫性のあるものにするための*意図的な選択*です。

*それは移行というよりも、むしろより良い習慣です。*
