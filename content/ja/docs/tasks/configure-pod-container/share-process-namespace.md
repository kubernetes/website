---
title: Pod内のコンテナ間でプロセス名前空間を共有する
min-kubernetes-server-version: v1.10
content_type: task
weight: 200
---

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.17" >}}

このページでは、プロセス名前空間を共有するPodを構成する方法を示します。
プロセス名前空間の共有が有効になっている場合、コンテナ内のプロセスは、そのPod内の他のすべてのコンテナに表示されます。

この機能を使用して、ログハンドラーサイドカーコンテナなどの協調コンテナを構成したり、シェルなどのデバッグユーティリティを含まないコンテナイメージをトラブルシューティングしたりできます。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Podを構成する

プロセス名前空間の共有は、`v1.PodSpec`の`shareProcessNamespace`フィールドを使用して有効にします。
例:

{{% codenew file="pods/share-process-namespace.yaml" %}}

1. クラスターにPod `nginx`を作成します:

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/share-process-namespace.yaml
    ```

1. `shell`コンテナにアタッチして`ps`を実行します:

    ```shell
    kubectl attach -it nginx -c shell
    ```

    コマンドプロンプトが表示されない場合は、Enterキーを押してみてください。

    ```
    / # ps ax
    PID   USER     TIME  COMMAND
        1 root      0:00 /pause
        8 root      0:00 nginx: master process nginx -g daemon off;
       14 101       0:00 nginx: worker process
       15 root      0:00 sh
       21 root      0:00 ps ax
    ```

他のコンテナのプロセスにシグナルを送ることができます。
たとえば、ワーカープロセスを再起動するには、`SIGHUP`をnginxに送信します。
この操作には`SYS_PTRACE`機能が必要です。

```
/ # kill -HUP 8
/ # ps ax
PID   USER     TIME  COMMAND
    1 root      0:00 /pause
    8 root      0:00 nginx: master process nginx -g daemon off;
   15 root      0:00 sh
   22 101       0:00 nginx: worker process
   23 root      0:00 ps ax
```

`/proc/$pid/root`リンクを使用して別のコンテナイメージにアクセスすることもできます。

```
/ # head /proc/8/root/etc/nginx/nginx.conf

user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
```



<!-- discussion -->

## プロセス名前空間の共有について理解する

Podは多くのリソースを共有するため、プロセスの名前空間も共有することになります。
ただし、一部のコンテナイメージは他のコンテナから分離されることが期待されるため、これらの違いを理解することが重要です:

1. **コンテナプロセスは PID 1ではなくなります。**
   一部のコンテナイメージは、PID 1なしで起動することを拒否し(たとえば、`systemd`を使用するコンテナ)、`kill -HUP 1`などのコマンドを実行してコンテナプロセスにシグナルを送信します。
   共有プロセス名前空間を持つPodでは、`kill -HUP 1`はPodサンドボックスにシグナルを送ります。(上の例では`/pause`)

1. **プロセスはPod内の他のコンテナに表示されます。**
   これには、引数または環境変数として渡されたパスワードなど、`/proc`に表示されるすべての情報が含まれます。
   これらは、通常のUnixアクセス許可によってのみ保護されます。

1. **コンテナファイルシステムは、`/proc/$pid/root`リンクを介してPod内の他のコンテナに表示されます。**
   これによりデバッグが容易になりますが、ファイルシステム内の秘密情報はファイルシステムのアクセス許可によってのみ保護されることも意味します。




