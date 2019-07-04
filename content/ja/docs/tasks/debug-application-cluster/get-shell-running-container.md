---
title: 実行中のコンテナへのシェルを取得する
content_template: templates/task
---

{{% capture overview %}}


このページは`kubectl exec`を使用して実行中のコンテナへのシェルを取得する方法を説明します。

{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}


{{% capture steps %}}

## コンテナへのシェルの取得

このエクササイズでは、1つのコンテナを持つPodを作成します。
コンテナはnginxのイメージを実行します。以下がそのPodの設定ファイルです:

{{< codenew file="application/shell-demo.yaml" >}}

Podを作成します:

```shell
kubectl create -f https://k8s.io/examples/application/shell-demo.yaml
```

コンテナが実行中であることを確認します:

```shell
kubectl get pod shell-demo
```

実行中のコンテナへのシェルを取得します:

```shell
kubectl exec -it shell-demo -- /bin/bash
```
{{< note >}}

ダブルダッシュの記号 "--" はコマンドに渡す引数とkubectlの引数を分離します。

{{< /note >}}

シェル内で、ルートディレクトリーのファイル一覧を表示します:

```shell
root@shell-demo:/# ls /
```

シェル内で、他のコマンドを試しましょう。以下がいくつかの例です:

```shell
root@shell-demo:/# ls /
root@shell-demo:/# cat /proc/mounts
root@shell-demo:/# cat /proc/1/maps
root@shell-demo:/# apt-get update
root@shell-demo:/# apt-get install -y tcpdump
root@shell-demo:/# tcpdump
root@shell-demo:/# apt-get install -y lsof
root@shell-demo:/# lsof
root@shell-demo:/# apt-get install -y procps
root@shell-demo:/# ps aux
root@shell-demo:/# ps aux | grep nginx
```

## nginxのルートページへの書き込み

Podの設定ファイルを再度確認します。Podは`emptyDir`ボリュームを持ち、
コンテナは`/usr/share/nginx/html`ボリュームをマウントします。

シェル内で、`/usr/share/nginx/html`ディレクトリに`index.html`を作成します。

```shell
root@shell-demo:/# echo Hello shell demo > /usr/share/nginx/html/index.html
```

シェル内で、nginxサーバーにGETリクエストを送信します:

```shell
root@shell-demo:/# apt-get update
root@shell-demo:/# apt-get install curl
root@shell-demo:/# curl localhost
```

出力に`index.html`ファイルに書き込んだ文字列が表示されます:

```shell
Hello shell demo
```

シェルを終了する場合、`exit`を入力します。

## コンテナ内での各コマンドの実行

シェルではない通常のコマンドウインドウ内で、実行中のコンテナの環境変数の一覧を表示します:

```shell
kubectl exec shell-demo env
```

他のコマンドを試します。以下がいくつかの例です:

```shell
kubectl exec shell-demo ps aux
kubectl exec shell-demo ls /
kubectl exec shell-demo cat /proc/1/mounts
```

{{% /capture %}}

{{% capture discussion %}}

## Podが1つ以上のコンテナを持つ場合にシェルを開く

Podが1つ以上のコンテナを持つ場合、`--container`か`-c`を使用して、`kubectl exec`コマンド内でコンテナを指定します。
例えば、my-podという名前のPodがあり、そのPodがmain-appとhelper-appという2つのコンテナを持つとします。
以下のコマンドはmain-appのコンテナへのシェルを開きます。

```shell
kubectl exec -it my-pod --container main-app -- /bin/bash
```

{{% /capture %}}


{{% capture whatsnext %}}

* [kubectl exec](/docs/reference/generated/kubectl/kubectl-commands/#exec)

{{% /capture %}}



