---
title: Pod初期化の設定
content_type: task
weight: 170
---

<!-- overview -->

このページでは、アプリケーションコンテナが実行される前に、Initコンテナを使用してPodを初期化する方法を示します。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Initコンテナを持つPodを作成する

この演習では、アプリケーションコンテナが1つ、Initコンテナが1つのPodを作成します。
Initコンテナはアプリケーションコンテナが実行される前に完了します。

Podの設定ファイルは次の通りです:

{{% code_sample file="pods/init-containers.yaml" %}}

設定ファイルを確認すると、PodはInitコンテナとアプリケーションコンテナが共有するボリュームを持っています。

Initコンテナは共有ボリュームを`/work-dir`にマウントし、アプリケーションコンテナは共有ボリュームを`/usr/share/nginx/html`にマウントします。
Initコンテナは以下のコマンドを実行してから終了します:

```shell
wget -O /work-dir/index.html http://info.cern.ch
```

Initコンテナは、nginxサーバーのルートディレクトリの`index.html`ファイルに書き込むことに注意してください。

Podを作成します:

```shell
kubectl apply -f https://k8s.io/examples/pods/init-containers.yaml
```

nginxコンテナが実行中であることを確認します:

```shell
kubectl get pod init-demo
```

次の出力はnginxコンテナが実行中であることを示します:

```
NAME        READY     STATUS    RESTARTS   AGE
init-demo   1/1       Running   0          1m
```

init-demo Podで実行中のnginxコンテナのシェルを取得します:

```shell
kubectl exec -it init-demo -- /bin/bash
```

シェルで、nginxサーバーにGETリクエストを送信します:

```
root@nginx:~# apt-get update
root@nginx:~# apt-get install curl
root@nginx:~# curl localhost
```

出力は、Initコンテナが書き込んだウェブページをnginxが提供していることを示します:

```html
<html><head></head><body><header>
<title>http://info.cern.ch</title>
</header>

<h1>http://info.cern.ch - home of the first website</h1>
  ...
  <li><a href="http://info.cern.ch/hypertext/WWW/TheProject.html">Browse the first website</a></li>
  ...
```

## {{% heading "whatsnext" %}}

* [同じPod内で実行されているコンテナ間の通信](/ja/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/)についてもっと学ぶ。
* [Initコンテナ](/ja/docs/concepts/workloads/pods/init-containers/)についてもっと学ぶ。
* [ボリューム](/ja/docs/concepts/storage/volumes/)についてもっと学ぶ。
* [Initコンテナのデバッグ](/ja/docs/tasks/debug/debug-application/debug-init-containers/)についてもっと学ぶ。
