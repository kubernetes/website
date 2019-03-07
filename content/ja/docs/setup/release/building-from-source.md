---
title: ソースからのビルド
---

あなたはソースからリリースをビルドすることもできますし、既にビルドされたリリースをダウンロードすることも可能です。もしあなたがKubernetesを開発する予定が無いのであれば、[リリースノート](/docs/setup/release/notes/)内の現在リリースされている既にビルドされたバージョンを使用することを推奨します。

Kubernetes のソースコードは[kubernetes/kubernetes](https://github.com/kubernetes/kubernetes)のリポジトリからダウンロードすることが可能です。

## ソースからのビルド

もしあなたが単にソースからリリースをビルドするだけなのであれば、完全なGOの環境を準備する必要はなく、全てのビルドはDockerコンテナの中で行われます。

リリースをビルドすることは簡単です。

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make release
```

リリース手段の詳細な情報はkubernetes/kubernetes内の[`build`](http://releases.k8s.io/{{< param "githubbranch" >}}/build/)ディレクトリを参照して下さい。
