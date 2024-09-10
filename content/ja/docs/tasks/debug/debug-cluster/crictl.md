---
title: crictlによるKubernetesノードのデバッグ
content_type: task
weight: 30
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

`crictl`はCRI互換のコンテナランタイム用のコマンドラインインターフェースです。

これを使って、Kubernetesノード上のコンテナランタイムやアプリケーションの検査やデバッグを行うことができます。
`crictl`とそのソースコードは[cri-tools](https://github.com/kubernetes-sigs/cri-tools)リポジトリにホストされています。

## {{% heading "prerequisites" %}}


`crictl`にはCRIランタイムを搭載したLinuxが必要です。



<!-- steps -->

## crictlのインストール

cri-toolsの[リリースページ](https://github.com/kubernetes-sigs/cri-tools/releases)から、いくつかの異なるアーキテクチャ用の圧縮アーカイブ`crictl`をダウンロードできます。

お使いのKubernetesのバージョンに対応するバージョンをダウンロードしてください。
それを解凍してシステムパス上の`/usr/local/bin/`などの場所に移動します。

## 一般的な使い方

`crictl`コマンドにはいくつかのサブコマンドとランタイムフラグがあります。
詳細は`crictl help`または`crictl <subcommand> help`を参照してください。
`crictl`はデフォルトでは`unix:///var/run/dockershim.sock`に接続します。

他のランタイムの場合は、複数の異なる方法でエンドポイントを設定することができます:

- フラグ`--runtime-endpoint`と`--image-endpoint`の設定により
- 環境変数`CONTAINER_RUNTIME_ENDPOINT`と`IMAGE_SERVICE_ENDPOINT`の設定により
- 設定ファイル`--config=/etc/crictl.yaml`でエンドポイントの設定により

また、サーバーに接続する際のタイムアウト値を指定したり、デバッグを有効／無効にしたりすることもできます。
これには、設定ファイルで`timeout`や`debug`を指定するか、`--timeout`や`--debug`のコマンドラインフラグを使用します。

現在の設定を表示または編集するには、`/etc/crictl.yaml`の内容を表示または編集します。


```shell
cat /etc/crictl.yaml
runtime-endpoint: unix:///var/run/dockershim.sock
image-endpoint: unix:///var/run/dockershim.sock
timeout: 10
debug: true
```

## crictlコマンドの例

以下の例では、いくつかの`crictl`コマンドとその出力例を示しています。

{{< warning >}}
実行中のKubernetesクラスターに`crictl`を使ってポッドのサンドボックスやコンテナを作成しても、Kubeletは最終的にそれらを削除します。`crictl` は汎用のワークフローツールではなく、デバッグに便利なツールです。
{{< /warning >}}

### podsの一覧

すべてのポッドをリストアップ:

```shell
crictl pods
```

出力はこのようになります:

```
POD ID              CREATED              STATE               NAME                         NAMESPACE           ATTEMPT
926f1b5a1d33a       About a minute ago   Ready               sh-84d7dcf559-4r2gq          default             0
4dccb216c4adb       About a minute ago   Ready               nginx-65899c769f-wv2gp       default             0
a86316e96fa89       17 hours ago         Ready               kube-proxy-gblk4             kube-system         0
919630b8f81f1       17 hours ago         Ready               nvidia-device-plugin-zgbbv   kube-system         0
```

Podを名前でリストアップします:

```shell
crictl pods --name nginx-65899c769f-wv2gp
```

出力はこのようになります:

```
POD ID              CREATED             STATE               NAME                     NAMESPACE           ATTEMPT
4dccb216c4adb       2 minutes ago       Ready               nginx-65899c769f-wv2gp   default             0
```

Podをラベルでリストアップします:

```shell
crictl pods --label run=nginx
```

出力はこのようになります:

```
POD ID              CREATED             STATE               NAME                     NAMESPACE           ATTEMPT
4dccb216c4adb       2 minutes ago       Ready               nginx-65899c769f-wv2gp   default             0
```

### イメージの一覧

すべてのイメージをリストアップします:

```shell
crictl images
```

出力はこのようになります:

```
IMAGE                                     TAG                 IMAGE ID            SIZE
busybox                                   latest              8c811b4aec35f       1.15MB
k8s-gcrio.azureedge.net/hyperkube-amd64   v1.10.3             e179bbfe5d238       665MB
k8s-gcrio.azureedge.net/pause-amd64       3.1                 da86e6ba6ca19       742kB
nginx                                     latest              cd5239a0906a6       109MB
```

イメージをリポジトリでリストアップします:

```shell
crictl images nginx
```

出力はこのようになります:

```
IMAGE               TAG                 IMAGE ID            SIZE
nginx               latest              cd5239a0906a6       109MB
```

イメージのIDのみをリストアップします:

```shell
crictl images -q
```

出力はこのようになります:

```
sha256:8c811b4aec35f259572d0f79207bc0678df4c736eeec50bc9fec37ed936a472a
sha256:e179bbfe5d238de6069f3b03fccbecc3fb4f2019af741bfff1233c4d7b2970c5
sha256:da86e6ba6ca197bf6bc5e9d900febd906b133eaa4750e6bed647b0fbe50ed43e
sha256:cd5239a0906a6ccf0562354852fae04bc5b52d72a2aff9a871ddb6bd57553569
```

### List containers

すべてのコンテナをリストアップします:

```shell
crictl ps -a
```

出力はこのようになります:

```
CONTAINER ID        IMAGE                                                                                                             CREATED             STATE               NAME                       ATTEMPT
1f73f2d81bf98       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   7 minutes ago       Running             sh                         1
9c5951df22c78       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   8 minutes ago       Exited              sh                         0
87d3992f84f74       nginx@sha256:d0a8828cccb73397acb0073bf34f4d7d8aa315263f1e7806bf8c55d8ac139d5f                                     8 minutes ago       Running             nginx                      0
1941fb4da154f       k8s-gcrio.azureedge.net/hyperkube-amd64@sha256:00d814b1f7763f4ab5be80c58e98140dfc69df107f253d7fdd714b30a714260a   18 hours ago        Running             kube-proxy                 0
```

ランニングコンテナをリストアップします:

```
crictl ps
```

出力はこのようになります:

```
CONTAINER ID        IMAGE                                                                                                             CREATED             STATE               NAME                       ATTEMPT
1f73f2d81bf98       busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47                                   6 minutes ago       Running             sh                         1
87d3992f84f74       nginx@sha256:d0a8828cccb73397acb0073bf34f4d7d8aa315263f1e7806bf8c55d8ac139d5f                                     7 minutes ago       Running             nginx                      0
1941fb4da154f       k8s-gcrio.azureedge.net/hyperkube-amd64@sha256:00d814b1f7763f4ab5be80c58e98140dfc69df107f253d7fdd714b30a714260a   17 hours ago        Running             kube-proxy                 0
```

### 実行中のコンテナでコマンドの実行

```shell
crictl exec -i -t 1f73f2d81bf98 ls
```

出力はこのようになります:

```
bin   dev   etc   home  proc  root  sys   tmp   usr   var
```

### コンテナログの取得

すべてのコンテナログを取得します:

```shell
crictl logs 87d3992f84f74
```

出力はこのようになります:

```
10.240.0.96 - - [06/Jun/2018:02:45:49 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.96 - - [06/Jun/2018:02:45:50 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.96 - - [06/Jun/2018:02:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

最新の`N`行のログのみを取得します:

```shell
crictl logs --tail=1 87d3992f84f74
```

出力はこのようになります:

```
10.240.0.96 - - [06/Jun/2018:02:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

### Podサンドボックスの実行

`crictl`を使ってPodサンドボックスを実行することは、コンテナのランタイムをデバッグするのに便利です。
稼働中のKubernetesクラスターでは、サンドボックスは最終的にKubeletによって停止され、削除されます。

1. 以下のようなJSONファイルを作成します:

      ```json
      {
          "metadata": {
              "name": "nginx-sandbox",
              "namespace": "default",
              "attempt": 1,
              "uid": "hdishd83djaidwnduwk28bcsb"
          },
          "logDirectory": "/tmp",
          "linux": {
          }
      }
      ```

2. JSONを適用してサンドボックスを実行するには、`crictl runp`コマンドを使用します:

      ```shell
      crictl runp pod-config.json
      ```

      サンドボックスのIDが返されます。

### コンテナの作成

コンテナの作成に`crictl`を使うと、コンテナのランタイムをデバッグするのに便利です。
稼働中のKubernetesクラスターでは、サンドボックスは最終的にKubeletによって停止され、削除されます。

1. busyboxイメージをプルします:

      ```shell
      crictl pull busybox
      Image is up to date for busybox@sha256:141c253bc4c3fd0a201d32dc1f493bcf3fff003b6df416dea4f41046e0f37d47
      ```

2. Podとコンテナのコンフィグを作成します:

      **Pod config**:
      ```yaml
      {
          "metadata": {
              "name": "nginx-sandbox",
              "namespace": "default",
              "attempt": 1,
              "uid": "hdishd83djaidwnduwk28bcsb"
          },
          "log_directory": "/tmp",
          "linux": {
          }
      }
      ```

      **Container config**:
      ```yaml
      {
        "metadata": {
            "name": "busybox"
        },
        "image":{
            "image": "busybox"
        },
        "command": [
            "top"
        ],
        "log_path":"busybox.log",
        "linux": {
        }
      }
      ```

3. 先に作成されたPodのID、コンテナの設定ファイル、Podの設定ファイルを渡して、コンテナを作成します。コンテナのIDが返されます。

      ```shell
      crictl create f84dd361f8dc51518ed291fbadd6db537b0496536c1d2d6c05ff943ce8c9a54f container-config.json pod-config.json
      ```

4.  すべてのコンテナをリストアップし、新しく作成されたコンテナの状態が`Created`に設定されていることを確認します:

      ```shell
      crictl ps -a
      ```

      出力はこのようになります:
      ```
      CONTAINER ID        IMAGE               CREATED             STATE               NAME                ATTEMPT
      3e025dd50a72d       busybox             32 seconds ago      Created             busybox             0
      ```

### コンテナの起動

コンテナを起動するには、そのコンテナのIDを`crictl start`に渡します:

```shell
crictl start 3e025dd50a72d956c4f14881fbb5b1080c9275674e95fb67f965f6478a957d60
```

出力はこのようになります:

```
3e025dd50a72d956c4f14881fbb5b1080c9275674e95fb67f965f6478a957d60
```

コンテナの状態が「Running」に設定されていることを確認します:

```shell
crictl ps
```

出力はこのようになります:

```
CONTAINER ID        IMAGE               CREATED              STATE               NAME                ATTEMPT
3e025dd50a72d       busybox             About a minute ago   Running             busybox             0
```

<!-- discussion -->

詳しくは[kubernetes-sigs/cri-tools](https://github.com/kubernetes-sigs/cri-tools)をご覧ください。

## docker cliからcrictlへのマッピング

以下のマッピング表の正確なバージョンは、`docker cli v1.40`と`crictl v1.19.0`のものです。
この一覧はすべてを網羅しているわけではないことに注意してください。
たとえば、`docker cli`の実験的なコマンドは含まれていません。

{{< note >}}
CRICTLの出力形式はDocker CLIと似ていますが、いくつかのCLIでは列が欠けています。
{{< /note >}}

### デバッグ情報の取得

{{< table caption="mapping from docker cli to crictl - retrieve debugging information" >}}
docker cli | crictl | 説明 | サポートされていない機能
-- | -- | -- | --
`attach` | `attach` | 実行中のコンテナにアタッチ | `--detach-keys`, `--sig-proxy`
`exec` | `exec` | 実行中のコンテナでコマンドの実行 | `--privileged`, `--user`, `--detach-keys`
`images` | `images` | イメージのリストアップ |  
`info` | `info` | システム全体の情報の表示 |  
`inspect` | `inspect`, `inspecti` | コンテナ、イメージ、タスクの低レベルの情報を返します |  
`logs` | `logs` | コンテナのログを取得します | `--details`
`ps` | `ps` | コンテナのリストアップ |  
`stats` | `stats` | コンテナのリソース使用状況をライブで表示 | Column: NET/BLOCK I/O, PIDs
`version` | `version` | ランタイム(Docker、ContainerD、その他)のバージョン情報を表示します |  
{{< /table >}}

### 変更を行います

{{< table caption="mapping from docker cli to crictl - perform changes" >}}
docker cli | crictl | 説明 | サポートされていない機能
-- | -- | -- | --
`create` | `create` | 新しいコンテナを作成します |  
`kill` | `stop` (timeout = 0) | 1つ以上の実行中のコンテナを停止します | `--signal`
`pull` | `pull` | レジストリーからイメージやリポジトリをプルします | `--all-tags`, `--disable-content-trust`
`rm` | `rm` | 1つまたは複数のコンテナを削除します |  
`rmi` | `rmi` | 1つまたは複数のイメージを削除します |  
`run` | `run` | 新しいコンテナでコマンドを実行 |  
`start` | `start` | 停止した1つまたは複数のコンテナを起動 | `--detach-keys`
`stop` | `stop` | 実行中の1つまたは複数のコンテナの停止 |  
`update` | `update` | 1つまたは複数のコンテナの構成を更新 | `--restart`、`--blkio-weight`とその他
{{< /table >}}

### crictlでのみ対応

{{< table caption="mapping from docker cli to crictl - supported only in crictl" >}}
crictl | 説明
-- | --
`imagefsinfo` | イメージファイルシステムの情報を返します
`inspectp` | 1つまたは複数のPodの状態を表示します
`port-forward` | ローカルポートをPodに転送します
`runp` | 新しいPodを実行します
`rmp` | 1つまたは複数のPodを削除します
`stopp` | 稼働中の1つまたは複数のPodを停止します
{{< /table >}}
