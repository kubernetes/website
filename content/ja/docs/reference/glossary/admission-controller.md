---
title: Admission Controller
id: admission-controller
date: 2019-06-28
full_link: /ja/docs/reference/access-authn-authz/admission-controllers/
short_description: >
  オブジェクトの永続化を行う前に、Kubernetes APIサーバーへのリクエストをインターセプトするコードの一部分。

aka:
tags:
- extension
- security
---
オブジェクトの永続化を行う前に、Kubernetes APIサーバーへのリクエストをインターセプトするコードの一部分。

<!--more-->

Admission Controllerは、Kubernetes APIサーバーに対して設定可能であり、検証、変更、またはその両方を行います。いずれのAdmission Controllerもリクエストを拒否することができます。Mutating Controllerは、受け入れたオブジェクトを変更することができますが、Validating Controllerは変更を加えることはできません。

* [Kubernetesドキュメント内のAdmission Controller](/docs/reference/access-authn-authz/admission-controllers/)
