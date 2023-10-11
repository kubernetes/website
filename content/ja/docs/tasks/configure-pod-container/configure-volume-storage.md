---
title: ストレージにボリュームを使用するPodを構成する
content_type: task
weight: 80
---

<!-- overview -->

このページでは、ストレージにボリュームを使用するPodを構成する方法を示します。

コンテナのファイルシステムは、コンテナが存在する間のみ存続します。
そのため、コンテナが終了して再起動すると、ファイルシステムの変更は失われます。
コンテナに依存しない、より一貫したストレージを実現するには、[ボリューム](/docs/concepts/storage/volumes/)を使用できます。
これは、キーバリューストア(Redisなど)やデータベースなどのステートフルアプリケーションにとって特に重要です。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Podのボリュームを構成する

この演習では、1つのコンテナを実行するPodを作成します。
今回作成するPodには、コンテナが終了して再起動した場合でもPodの寿命が続く[emptyDir](/docs/concepts/storage/volumes/#emptydir)タイプのボリュームがあります。
これがPodの設定ファイルです:

{{% codenew file="pods/storage/redis.yaml" %}}

1. Podを作成します:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/storage/redis.yaml
    ```

1. Podのコンテナが実行されていることを確認し、Podへの変更を監視します:

    ```shell
    kubectl get pod redis --watch
    ```

    出力は次のようになります:

    ```console
    NAME      READY     STATUS    RESTARTS   AGE
    redis     1/1       Running   0          13s
    ```

1. 別のターミナルで、実行中のコンテナへのシェルを取得します:

    ```shell
    kubectl exec -it redis -- /bin/bash
    ```

1. シェルで、`/data/redis`に移動し、ファイルを作成します:

    ```shell
    root@redis:/data# cd /data/redis/
    root@redis:/data/redis# echo Hello > test-file
    ```

1. シェルで、実行中のプロセスを一覧表示します:

    ```shell
    root@redis:/data/redis# apt-get update
    root@redis:/data/redis# apt-get install procps
    root@redis:/data/redis# ps aux
    ```

    出力はこのようになります:

    ```console
    USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
    redis        1  0.1  0.1  33308  3828 ?        Ssl  00:46   0:00 redis-server *:6379
    root        12  0.0  0.0  20228  3020 ?        Ss   00:47   0:00 /bin/bash
    root        15  0.0  0.0  17500  2072 ?        R+   00:48   0:00 ps aux
    ```

1. シェルで、Redisプロセスを終了します:

    ```shell
    root@redis:/data/redis# kill <pid>
    ```

    ここで`<pid>`はRedisプロセスID(PID)です。

1. 元の端末で、Redis Podへの変更を監視します。最終的には、このようなものが表示されます:

    ```console
    NAME      READY     STATUS     RESTARTS   AGE
    redis     1/1       Running    0          13s
    redis     0/1       Completed  0         6m
    redis     1/1       Running    1         6m
    ```

この時点で、コンテナは終了して再起動しました。
これは、Redis Podの[restartPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)が`Always`であるためです。

1. 再起動されたコンテナへのシェルを取得します:

    ```shell
    kubectl exec -it redis -- /bin/bash
    ```

1. シェルで`/data/redis`に移動し、`test-file`がまだ存在することを確認します。

    ```shell
    root@redis:/data/redis# cd /data/redis/
    root@redis:/data/redis# ls
    test-file
    ```

1. この演習用に作成したPodを削除します:

    ```shell
    kubectl delete pod redis
    ```



## {{% heading "whatsnext" %}}


* [Volume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)参照

* [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)参照

* `emptyDir`によって提供されるローカルディスクストレージに加えて、Kubernetesは、GCEのPDやEC2のEBSなど、さまざまなネットワーク接続ストレージソリューションをサポートします。これらは、重要なデータに好ましく、ノード上のデバイスのマウントやアンマウントなどの詳細を処理します。詳細は[ボリューム](/docs/concepts/storage/volumes/)を参照してください。




