---
title: リリースのビルド
content_template: templates/concept
card:
  name: download
  weight: 20
  title: リリースのビルド
---
{{% capture overview %}}
ソースコードからリリースをビルドすることもできますし、既にビルドされたリリースをダウンロードすることも可能です。Kubernetesを開発する予定が無いのであれば、[リリースノート](/docs/setup/release/notes/)内にて既にビルドされたバージョンを使用することを推奨します。

Kubernetes のソースコードは[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes)のリポジトリからダウンロードすることが可能です。
{{% /capture %}}

{{% capture body %}}
## ソースからのビルド

単にソースからリリースをビルドするだけであれば、完全なGOの環境を準備する必要はなく、全てのビルドはDockerコンテナの中で行われます。

リリースをビルドすることは簡単です。

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make release
```

リリース手段の詳細な情報はkubernetes/kubernetes内の[`build`](http://releases.k8s.io/{{< param "githubbranch" >}}/build/)ディレクトリを参照して下さい。

{{% /capture %}}
