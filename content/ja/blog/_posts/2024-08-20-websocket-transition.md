---
layout: blog
title: 'Kubernetes 1.31: SPDYからWebSocketへのストリーミングの移行'
date: 2024-08-20
slug: websockets-transition
author: >
  [Sean Sullivan](https://github.com/seans3) (Google)
  [Shannon Kularathna](https://github.com/shannonxtreme) (Google)
translator: >
  [ntkm61027](https://github.com/ntkm61027) ([3-shake](https://3-shake.com/))
---

Kubernetes 1.31では、kubectlがストリーミングする際に、SPDYに代わりWebSocketプロトコルをデフォルトで使用するようになりました。

この記事では、この変更が意味するところと、なぜこれらのストリーミングAPIが重要なのかについて説明します。

## KubernetesのストリーミングAPI

Kubernetesでは、HTTPまたはRESTfulインターフェースとして公開される特定のエンドポイントが、ストリーミングプロトコルが必要な、ストリーミング接続にアップグレードされます。
リクエスト・レスポンス型プロトコルであるHTTPとは異なり、ストリーミングプロトコルは双方向・低遅延の永続的な接続を提供し、リアルタイムでの対話を可能にします。
ストリーミングプロトコルは、クライアントとサーバー間で同一の接続を介して、双方向でのデータの読み書きをサポートします。
このタイプの接続は、例えば、ローカルワークステーションから実行中のコンテナ内にシェルを作成し、そのコンテナ内でコマンドを実行する場合などに役立ちます。

## なぜストリーミングプロトコルを変更するのか？

v1.31リリース以前は、Kubernetesはストリーミング接続をアップグレードする際に、デフォルトでSPDY/3.1プロトコルを使用していました。
SPDY/3.1は8年前に非推奨となっており、標準化されることはありませんでした。
多くの最新のプロキシ、ゲートウェイ、ロードバランサーは、このプロトコルをサポートしていません。
その結果、プロキシやゲートウェイを介してクラスターにアクセスしようとすると、`kubectl cp`、`kubectl attach`、`kubectl exec`、`kubectl port-forward`などのコマンドが機能しなくなることがあります。

Kubernetes v1.31以降、SIG API Machineryは、Kubernetesクライアント(`kubectl`など)がこれらのコマンドに使用するストリーミングプロトコルを、よりモダンな[WebSocketストリーミングプロトコル](https://datatracker.ietf.org/doc/html/rfc6455)に変更しました。
WebSocketプロトコルは、現在サポートされている標準化されたストリーミングプロトコルであり、様々なコンポーネントやプログラミング言語間の互換性と相互運用性を保証します。
WebSocketプロトコルは、SPDYよりも最新のプロキシやゲートウェイで広くサポートされています。

## ストリーミングAPIの仕組み

Kubernetesは、発信元のHTTPリクエストに特定のアップグレードヘッダーを追加することで、HTTP接続をストリーミング通信が可能な接続へと切り替えます。
例えば、クラスター内の`nginx`コンテナで`date`コマンドを実行するためのHTTPアップグレードリクエストは、以下のようになります:

```console
$ kubectl exec -v=8 nginx -- date
GET https://127.0.0.1:43251/api/v1/namespaces/default/pods/nginx/exec?command=date…
Request Headers:
    Connection: Upgrade
    Upgrade: websocket
    Sec-Websocket-Protocol: v5.channel.k8s.io
    User-Agent: kubectl/v1.31.0 (linux/amd64) kubernetes/6911225
```

コンテナランタイムがWebSocketストリーミングプロトコルと、少なくとも1つのサブプロトコルバージョン(例:`v5.channel.k8s.io`)をサポートしている場合、サーバーは成功を示す`101 Switching Protocols`ステータスと、ネゴシエートされたサブプロトコルバージョンを含めて応答します:

```console
Response Status: 101 Switching Protocols in 3 milliseconds
Response Headers:
    Upgrade: websocket
    Connection: Upgrade
    Sec-Websocket-Accept: j0/jHW9RpaUoGsUAv97EcKw8jFM=
    Sec-Websocket-Protocol: v5.channel.k8s.io
```

この時点で、HTTPプロトコルに使用されていたTCP接続はストリーミング接続に変更されています。
この対話型シェルでのSTDIN、STDOUT、STDERR(ターミナルのリサイズ情報やプロセス終了コードも含む)データは、このアップグレードされた接続を通じてストリーミングされます。

## 新しいWebSocketストリーミングプロトコルの使用方法

クラスターとkubectlがバージョン1.29以降の場合、SPDYではなくWebSocketの使用を制御するための、2つのコントロールプレーンフィーチャーゲートと2つのkubectl環境変数があります。
Kubernetes 1.31では、以下のすべてのフィーチャーゲートがベータ版であり、デフォルトで有効になっています:

- [フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)
  - `TranslateStreamCloseWebsocketRequests`
      - `.../exec`
      - `.../attach`
  - `PortForwardWebsockets`
      - `.../port-forward`
- kubectlの機能を制御する環境変数
  - `KUBECTL_REMOTE_COMMAND_WEBSOCKETS`
      - `kubectl exec`
      - `kubectl cp`
      - `kubectl attach`
  - `KUBECTL_PORT_FORWARD_WEBSOCKETS`
      - `kubectl port-forward`

古いバージョンのクラスターにおいても、フィーチャーゲート設定を管理できる場合であれば、`TranslateStreamCloseWebsocketRequests`(Kubernetes v1.29で追加)と`PortForwardWebsockets`(Kubernetes v1.30で追加)の両方を有効にして、この新しい動作を試すことができます。
バージョン1.31の`kubectl`は自動的に新しい動作を使用できますが、サーバー側の機能が明示的に有効になっているクラスターに接続する必要があります。

## ストリーミングAPIについてさらに学ぶ

- [KEP 4006 - Transitioning from SPDY to WebSockets](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/4006-transition-spdy-to-websockets)
- [RFC 6455 - The WebSockets Protocol](https://datatracker.ietf.org/doc/html/rfc6455)
- [Container Runtime Interface streaming explained](https://kubernetes.io/blog/2024/05/01/cri-streaming-explained/)
