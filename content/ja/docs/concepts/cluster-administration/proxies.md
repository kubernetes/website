---
title: Kubernetesのプロキシー
content_type: concept
weight: 90
---

<!-- overview -->
このページではKubernetesと併用されるプロキシーについて説明します。


<!-- body -->

## プロキシー

Kubernetesを使用する際に、いくつかのプロキシーを使用する場面があります。

1. [kubectlのプロキシー](/docs/tasks/access-application-cluster/access-cluster/#directly-accessing-the-rest-api):

    - ユーザーのデスクトップ上かPod内で稼働します
    - ローカルホストのアドレスからKubernetes api-serverへのプロキシーを行います
    - クライアントからプロキシー間ではHTTPを使用します
    - プロキシーからapi-serverへはHTTPSを使用します
    - api-serverの場所を示します
    - 認証用のヘッダーを追加します

1. [api-serverのプロキシー](/docs/tasks/access-application-cluster/access-cluster/#discovering-builtin-services):

    - api-server内で動作する防壁となります
    - これがなければ到達不可能であるクラスターIPへ、クラスターの外部からのユーザーを接続します
    - api-serverのプロセス内で稼働します
    - クライアントからプロキシー間ではHTTPSを使用します(api-serverの設定により、HTTPを使用します)
    - プロキシーからターゲット間では利用可能な情報を使用して、プロキシーによって選択されたHTTPかHTTPSのいずれかを使用します
    - Node、Pod、Serviceへ到達可能です
    - Serviceへ到達するとき負荷分散を行います

1.  [kube proxy](/ja/docs/concepts/services-networking/service/#ips-and-vips):

    - 各Node上で稼働します
    - UDP、TCP、SCTPをプロキシーします
    - HTTPを解釈しません
    - 負荷分散機能を提供します
    - Serviceへ到達させるためのみに使用されます

1.  api-serverの前段にあるプロキシー/ロードバランサー:

    - 実際に存在するかどうかと実装はクラスターごとに異なります(例: nginx)
    - 全てのクライアント間と、1つ以上のapi-serverの間に位置します
    - 複数のapi-serverがあるときロードバランサーとして稼働します

1.  外部サービス上で稼働するクラウドロードバランサー:

    - いくつかのクラウドプロバイダーによって提供されます(例: AWS ELB、Google Cloud Load Balancer)
    - `LoadBalancer`というtypeのKubernetes Serviceが作成されたときに自動で作成されます
    - たいていのクラウドロードバランサーはUDP/TCPのみサポートしています
    - SCTPのサポートはクラウドプロバイダーのロードバランサーの実装によって異なります
    - ロードバランサーの実装はクラウドプロバイダーによって異なります

Kubernetesユーザーのほとんどは、最初の2つのタイプ以外に心配する必要はありません。クラスター管理者は最後のタイプのロードバランサーを正しくセットアップすることを保証します。

## リダイレクトの要求 Requesting redirects

プロキシーはリダイレクトの機能を置き換えました。リダイレクトの使用は非推奨となります。




