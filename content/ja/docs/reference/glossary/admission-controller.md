---
title: アドミッションコントローラー
id: admission-controller
date: 2019-06-28
full_link: /docs/reference/access-authn-authz/admission-controllers/
short_description: >
  オブジェクトを永続化する前に、Kubernetes APIサーバーへのリクエストをインターセプトするコード。

aka:
tags:
- extension
- security
---
  オブジェクトを永続化する前に、Kubernetes APIサーバーへのリクエストをインターセプトするコード。

<!--more-->

アドミッションコントローラーはKubernetes APIサーバー用に構成可能で、検証・変更、またはその両方を行うことができます。アドミッションコントローラーはリクエストを拒否する可能性があります。変更コントローラーは、許可するオブジェクトを変更する可能性があります。コントローラーの検証ではできない場合があります。

* [Admission controllers in the Kubernetes documentation](/docs/reference/access-authn-authz/admission-controllers/)