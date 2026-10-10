---
title: テレプレゼンスを使用したローカルでのサービス開発・デバッグ
content_type: task
---

<!-- overview -->

Kubernetesアプリケーションは通常、複数の独立したサービスから構成され、それぞれが独自のコンテナで動作しています。これらのサービスをリモートのKubernetesクラスター上で開発・デバッグするには、[実行中のコンテナへのシェルを取得](/ja/docs/tasks/debug/debug-application/get-shell-running-container/)してリモートシェル内でツールを実行しなければならず面倒な場合があります。

`telepresence`は、リモートKubernetesクラスターにサービスをプロキシしながら、ローカルでサービスを開発・デバッグするプロセスを容易にするためのツールです。
`telepresence` を使用すると、デバッガーやIDEなどのカスタムツールをローカルサービスで使用でき、ConfigMapやsecret、リモートクラスター上で動作しているサービスへのフルアクセスをサービスに提供します。

このドキュメントでは、リモートクラスター上で動作しているサービスをローカルで開発・デバッグするために`telepresence`を使用する方法を説明します。

## {{% heading "prerequisites" %}}

* Kubernetesクラスターがインストールされていること
* クラスターと通信するために `kubectl` が設定されていること
* [telepresence](https://www.telepresence.io/reference/install)がインストールされていること

<!-- steps -->

## リモートクラスター上でシェルの取得

ターミナルを開いて、引数なしで`telepresence`を実行すると、`telepresence`シェルが表示されます。
このシェルはローカルで動作し、ローカルのファイルシステムに完全にアクセスすることができます。

この`telepresence`シェルは様々な方法で使用することができます。
例えば、ラップトップでシェルスクリプトを書いて、それをシェルから直接リアルタイムで実行することができます。これはリモートシェルでもできますが、好みのコードエディターが使えないかもしれませんし、コンテナが終了するとスクリプトは削除されます。

終了してシェルを閉じるには`exit`と入力してください。

## 既存サービスの開発・デバッグ

Kubernetes上でアプリケーションを開発する場合、通常は1つのサービスをプログラミングまたはデバッグすることになります。
そのサービスは、テストやデバッグのために他のサービスへのアクセスを必要とする場合があります。
継続的なデプロイメントパイプラインを使用することも一つの選択肢ですが、最速のデプロイメントパイプラインでさえ、プログラムやデバッグサイクルに遅延が発生します。

既存のデプロイメントとtelepresenceプロキシを交換するには、`--swap-deployment` オプションを使用します。
スワップすることで、ローカルでサービスを実行し、リモートのKubernetesクラスターに接続することができます。
リモートクラスター内のサービスは、ローカルで実行されているインスタンスにアクセスできるようになりました。

telepresenceを「--swap-deployment」で実行するには、次のように入力します。

`telepresence --swap-deployment $DEPLOYMENT_NAME`

ここで、$DEPLOYMENT_NAMEは既存のDeploymentの名前です。

このコマンドを実行すると、シェルが起動します。そのシェルで、サービスを起動します。
そして、ローカルでソースコードの編集を行い、保存すると、すぐに変更が反映されるのを確認できます。
また、デバッガーやその他のローカルな開発ツールでサービスを実行することもできます。

## {{% heading "whatsnext" %}}

もしハンズオンのチュートリアルに興味があるなら、Google Kubernetes Engine上でGuestbookアプリケーションをローカルに開発する手順を説明した[こちらのチュートリアル](https://cloud.google.com/community/tutorials/developing-services-with-k8s)をチェックしてみてください。

telepresenceには、状況に応じて[numerous proxying options](https://www.telepresence.io/reference/methods)があります。

さらに詳しい情報は、[telepresence website](https://www.telepresence.io)をご覧ください。
