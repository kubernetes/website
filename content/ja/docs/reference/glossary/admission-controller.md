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

アドミッションコントローラーはKubernetes APIサーバー用に構成可能で、「検証(validating)」、「変更(mutating)」、またはその両方を行うことができます。どのアドミッションコントローラーも、リクエストを拒否することができます。変更コントローラーは、自身が許可するオブジェクトを変更できますが、検証コントローラーは変更できません。

* [Admission controllers in the Kubernetes documentation](/docs/reference/access-authn-authz/admission-controllers/)