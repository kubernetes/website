---
title: Kubernetesのプロキシ
content_type: concept
weight: 100
---

<!-- overview -->
このページではKubernetesと併用されるプロキシについて説明します。


<!-- body -->

## プロキシ

Kubernetesを使用する際に、いくつかのプロキシを使用する場面があります。

1. [kubectlのプロキシ](/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api):

    - ユーザーのデスクトップ上かPod内で稼働します
    - ローカルホストのアドレスからKubernetes apiserverへのプロキシを行います
    - クライアントからプロキシ間ではHTTPを使用します
    - プロキシからapiserverへはHTTPSを使用します
    - apiserverの場所を示します
    - 認証用のヘッダーを追加します

1. [apiserverのプロキシ](/docs/tasks/access-application-cluster/access-cluster/#discovering-builtin-services):

    - apiserver内で動作する踏み台となります
    - これがなければ到達不可能であるクラスターIPへ、クラスターの外部からのユーザーを接続します
    - apiserverのプロセス内で稼働します
    - クライアントからプロキシ間ではHTTPSを使用します(apiserverの設定により、HTTPを使用します)
    - プロキシからターゲット間では利用可能な情報を使用して、プロキシによって選択されたHTTPかHTTPSのいずれかを使用します
    - Node、Pod、Serviceへ到達するのに使えます
    - Serviceへ到達するときは負荷分散を行います

1.  [kube proxy](/ja/docs/concepts/services-networking/service/#ips-and-vips):

    - 各ノード上で稼働します
    - UDP、TCP、SCTPをプロキシします
    - HTTPを解釈しません
    - 負荷分散機能を提供します
    - Serviceへ到達させるためのみに使用されます

1.  apiserverの前段にあるプロキシ/ロードバランサー:

    - 実際に存在するかどうかと実装はクラスターごとに異なります(例: nginx)
    - 全てのクライアントと、1つ以上のapiserverの間に位置します
    - 複数のapiserverがあるときロードバランサーとして稼働します

1.  外部サービス上で稼働するクラウドロードバランサー:

    - いくつかのクラウドプロバイダーによって提供されます(例: AWS ELB、Google Cloud Load Balancer)
    - `LoadBalancer`というtypeのKubernetes Serviceが作成されたときに自動で作成されます
    - たいていのクラウドロードバランサーはUDP/TCPのみサポートしています
    - SCTPのサポートはクラウドプロバイダーのロードバランサーの実装によって異なります
    - ロードバランサーの実装はクラウドプロバイダーによって異なります

Kubernetesユーザーのほとんどは、最初の2つのタイプ以外に心配する必要はありません。クラスター管理者はそれ以外のタイプのロードバランサーを正しくセットアップすることを保証します。

## リダイレクトの要求

プロキシはリダイレクトの機能を置き換えました。リダイレクトの使用は非推奨となります。




