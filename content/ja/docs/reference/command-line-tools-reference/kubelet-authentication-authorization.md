---
title: Kubelet 認証/認可
---


## 概要

kubeletのHTTPSエンドポイントは、さまざまな感度のデータへのアクセスを提供するAPIを公開し、
ノードとコンテナ内のさまざまなレベルの権限でタスクを実行できるようにします。

このドキュメントでは、kubeletのHTTPSエンドポイントへのアクセスを認証および承認する方法について説明します。

## Kubelet 認証

デフォルトでは、他の構成済み認証方法によって拒否されないkubeletのHTTPSエンドポイントへのリクエストは
匿名リクエストとして扱われ、ユーザー名は`system:anonymous`、
グループは`system:unauthenticated`になります。

匿名アクセスを無効にし、認証されていないリクエストに対して`401 Unauthorized`応答を送信するには：

* `--anonymous-auth=false`フラグでkubeletを開始します。

kubeletのHTTPSエンドポイントに対するX509クライアント証明書認証を有効にするには：

* `--client-ca-file`フラグでkubeletを起動し、クライアント証明書を確認するためのCAバンドルを提供します。
* `--kubelet-client-certificate`および`--kubelet-client-key`フラグを使用してapiserverを起動します。
* 詳細については、[apiserver認証ドキュメント](/ja/docs/reference/access-authn-authz/authentication/#x509-client-certs)を参照してください。

APIベアラートークン(サービスアカウントトークンを含む)を使用して、kubeletのHTTPSエンドポイントへの認証を行うには：

* APIサーバーで`authentication.k8s.io/v1beta1`グループが有効になっていることを確認します。
* `--authentication-token-webhook`および`--kubeconfig`フラグを使用してkubeletを開始します。
* kubeletは、構成済みのAPIサーバーで `TokenReview` APIを呼び出して、ベアラートークンからユーザー情報を判別します。

## Kubelet 承認

認証に成功した要求(匿名要求を含む)はすべて許可されます。デフォルトの認可モードは、すべての要求を許可する`AlwaysAllow`です。

kubelet APIへのアクセスを細分化するのは、次のような多くの理由が考えられます:

* 匿名認証は有効になっていますが、匿名ユーザーがkubeletのAPIを呼び出す機能は制限する必要があります。
* ベアラートークン認証は有効になっていますが、kubeletのAPIを呼び出す任意のAPIユーザー(サービスアカウントなど)の機能を制限する必要があります。
* クライアント証明書の認証は有効になっていますが、構成されたCAによって署名されたクライアント証明書の一部のみがkubeletのAPIの使用を許可されている必要があります。

kubeletのAPIへのアクセスを細分化するには、APIサーバーに承認を委任します:

* APIサーバーで`authorization.k8s.io/v1beta1` APIグループが有効になっていることを確認します。
* `--authorization-mode=Webhook`と`--kubeconfig`フラグでkubeletを開始します。
* kubeletは、構成されたAPIサーバーで`SubjectAccessReview` APIを呼び出して、各リクエストが承認されているかどうかを判断します。

kubeletは、apiserverと同じ[リクエスト属性](/docs/reference/access-authn-authz/authorization/#review-your-request-attributes)アプローチを使用してAPIリクエストを承認します。

動詞は、受けとったリクエストのHTTP動詞から決定されます:

HTTP動詞 | 要求 動詞
----------|---------------
POST      | create
GET, HEAD | get
PUT       | update
PATCH     | patch
DELETE    | delete

リソースとサブリソースは、受けとったリクエストのパスから決定されます:

Kubelet API  | リソース | サブリソース
-------------|----------|------------
/stats/\*     | nodes    | stats
/metrics/\*   | nodes    | metrics
/logs/\*      | nodes    | log
/spec/\*      | nodes    | spec
*all others* | nodes    | proxy

名前空間とAPIグループの属性は常に空の文字列であり、
リソース名は常にkubeletの`Node` APIオブジェクトの名前です。

このモードで実行する場合は、apiserverに渡される`--kubelet-client-certificate`フラグと`--kubelet-client-key`
フラグで識別されるユーザーが次の属性に対して許可されていることを確認します:

* verb=\*, resource=nodes, subresource=proxy
* verb=\*, resource=nodes, subresource=stats
* verb=\*, resource=nodes, subresource=log
* verb=\*, resource=nodes, subresource=spec
* verb=\*, resource=nodes, subresource=metrics
