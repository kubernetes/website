---
title: 共有ボリュームを使用して同じPod内のコンテナ間で通信する
content_type: task
weight: 110
---

<!-- overview -->

このページでは、ボリュームを使用して、同じPodで実行されている2つのコンテナ間で通信する方法を示します。
コンテナ間で[プロセス名前空間を共有する](/ja/docs/tasks/configure-pod-container/share-process-namespace/)ことにより、プロセスが通信できるようにする方法も参照してください。




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

##  2つのコンテナを実行するPodの作成

この演習では、2つのコンテナを実行するPodを作成します。
2つのコンテナは、通信に使用できるボリュームを共有します。
これがPodの設定ファイルです:

{{< codenew file="pods/two-container-pod.yaml" >}}

設定ファイルで、Podに`shared-data`という名前のボリュームがあることがわかります。

設定ファイルにリストされている最初のコンテナは、nginxサーバーを実行します。
共有ボリュームのマウントパスは`/usr/share/nginx/html`です。
2番目のコンテナはdebianイメージをベースとしており、`/pod-data`のマウントパスを持っています。
2番目のコンテナは次のコマンドを実行してから終了します。

    echo Hello from the debian container > /pod-data/index.html

2番目のコンテナがnginxサーバーのルートディレクトリに`index.html`ファイルを書き込むことに注意してください。

Podと2つのコンテナを作成します:

    kubectl apply -f https://k8s.io/examples/pods/two-container-pod.yaml

Podとコンテナに関する情報を表示します:

    kubectl get pod two-containers --output=yaml

こちらは出力の一部です:

    apiVersion: v1
    kind: Pod
    metadata:
      ...
      name: two-containers
      namespace: default
      ...
    spec:
      ...
      containerStatuses:

      - containerID: docker://c1d8abd1 ...
        image: debian
        ...
        lastState:
          terminated:
            ...
        name: debian-container
        ...

      - containerID: docker://96c1ff2c5bb ...
        image: nginx
        ...
        name: nginx-container
        ...
        state:
          running:
        ...

debianコンテナが終了し、nginxコンテナがまだ実行されていることがわかります。

nginxコンテナへのシェルを取得します:

    kubectl exec -it two-containers -c nginx-container -- /bin/bash

シェルで、nginxが実行されていることを確認します:

    root@two-containers:/# apt-get update
    root@two-containers:/# apt-get install curl procps
    root@two-containers:/# ps aux

出力はこのようになります:

    USER       PID  ...  STAT START   TIME COMMAND
    root         1  ...  Ss   21:12   0:00 nginx: master process nginx -g daemon off;

debianコンテナがnginxルートディレクトリに`index.html`ファイルを作成したことを思い出してください。
`curl`を使用して、GETリクエストをnginxサーバーに送信します:

```
root@two-containers:/# curl localhost
```

出力は、nginxがdebianコンテナによって書かれたWebページを提供することを示しています:

```
Hello from the debian container
```



<!-- discussion -->

## 議論

Podが複数のコンテナを持つことができる主な理由は、プライマリアプリケーションを支援するヘルパーアプリケーションをサポートするためです。
ヘルパーアプリケーションの典型的な例は、データプラー、データプッシャー、およびプロキシです。
多くの場合、ヘルパーアプリケーションとプライマリアプリケーションは互いに通信する必要があります。
通常、これは、この演習に示すように共有ファイルシステムを介して、またはループバックネットワークインターフェイスであるlocalhostを介して行われます。
このパターンの例は、新しい更新のためにGitリポジトリをポーリングするヘルパープログラムを伴うWebサーバーです。

この演習のボリュームは、コンテナがポッドの寿命中に通信する方法を提供します。
Podを削除して再作成すると、共有ボリュームに保存されているデータはすべて失われます。




## {{% heading "whatsnext" %}}


* [複合コンテナのパターン](https://kubernetes.io/blog/2015/06/the-distributed-system-toolkit-patterns)の詳細

* [モジュラーアーキテクチャ用の複合コンテナ](http://www.slideshare.net/Docker/slideshare-burns)について学ぶ

* [ストレージにボリュームを使用するPodの構成](/ja/docs/tasks/configure-pod-container/configure-volume-storage/)を参照

* [Pod内のコンテナ間でプロセス名前空間を共有するPodの構成](/ja/docs/tasks/configure-pod-container/share-process-namespace/)を参照

* [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)を参照

* [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)を参照





