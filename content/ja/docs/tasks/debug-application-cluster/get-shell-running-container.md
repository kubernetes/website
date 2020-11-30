---
title: 実行中のコンテナへのシェルを取得する
content_type: task
---

<!-- overview -->


このページは`kubectl exec`を使用して実行中のコンテナへのシェルを取得する方法を説明します。




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## コンテナへのシェルの取得

このエクササイズでは、1つのコンテナを持つPodを作成します。
コンテナはnginxのイメージを実行します。以下がそのPodの設定ファイルです:

{{< codenew file="application/shell-demo.yaml" >}}

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/application/shell-demo.yaml
```

コンテナが実行中であることを確認します:

```shell
kubectl get pod shell-demo
```

実行中のコンテナへのシェルを取得します:

```shell
kubectl exec --stdin --tty shell-demo -- /bin/bash
```
{{< note >}}

ダブルダッシュの記号 `--` はコマンドに渡す引数とkubectlの引数を分離します。

{{< /note >}}

シェル内で、ルートディレクトリーのファイル一覧を表示します:

```shell
# このコマンドをコンテナ内で実行します
ls /
```

シェル内で、他のコマンドを試しましょう。以下がいくつかの例です:

```shell
# これらのサンプルコマンドをコンテナ内で実行することができます
ls /
cat /proc/mounts
cat /proc/1/maps
apt-get update
apt-get install -y tcpdump
tcpdump
apt-get install -y lsof
lsof
apt-get install -y procps
ps aux
ps aux | grep nginx
```

## nginxのルートページへの書き込み

Podの設定ファイルを再度確認します。Podは`emptyDir`ボリュームを持ち、
コンテナは`/usr/share/nginx/html`ボリュームをマウントします。

シェル内で、`/usr/share/nginx/html`ディレクトリに`index.html`を作成します。

```shell
# このコマンドをコンテナ内で実行します
echo 'Hello shell demo' > /usr/share/nginx/html/index.html
```

シェル内で、nginxサーバーにGETリクエストを送信します:

```shell
# これらのコマンドをコンテナ内のシェルで実行します
apt-get update
apt-get install curl
curl http://localhost/
```

出力に`index.html`ファイルに書き込んだ文字列が表示されます:

```
Hello shell demo
```

シェルを終了する場合、`exit`を入力します。

```shell
exit # コンテナ内のシェルを終了する
```

## コンテナ内での各コマンドの実行

シェルではない通常のコマンドウインドウ内で、実行中のコンテナの環境変数の一覧を表示します:

```shell
kubectl exec shell-demo env
```

他のコマンドを試します。以下がいくつかの例です:

```shell
kubectl exec shell-demo -- ps aux
kubectl exec shell-demo -- ls /
kubectl exec shell-demo -- cat /proc/1/mounts
```



<!-- discussion -->

## Podが1つ以上のコンテナを持つ場合にシェルを開く

Podが1つ以上のコンテナを持つ場合、`--container`か`-c`を使用して、`kubectl exec`コマンド内でコンテナを指定します。
例えば、my-podという名前のPodがあり、そのPodが _main-app_ と _helper-app_ という2つのコンテナを持つとします。
以下のコマンドは _main-app_ のコンテナへのシェルを開きます。

```shell
kubectl exec -i -t my-pod --container main-app -- /bin/bash
```

{{< note >}}
ショートオプションの`-i`と`-t`は、ロングオプションの`--stdin`と`--tty`と同様です。
{{< /note >}}

## {{% heading "whatsnext" %}}


* [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)について読む



