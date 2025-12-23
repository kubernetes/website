---
title: APIリソース
id: api-resource
date: 2025-02-09
full_link: /docs/reference/using-api/api-concepts/#standard-api-terminology
short_description: >
  Kubernetes APIサーバー上のエンドポイントを表すKubernetesのエンティティです。

aka:
 - リソース
tags:
- architecture
---
Kubernetesの型システムにおけるエンティティであり、{{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}上のエンドポイントに対応します。
リソースは通常、{{< glossary_tooltip text="オブジェクト" term_id="object" >}}を表します。
一部のリソースは、権限チェックなど、他のオブジェクトに対する操作を表します。
<!--more-->
各リソースはKubernetes APIサーバー上のHTTPエンドポイント(URI)を表し、そのリソース上のオブジェクトまたは操作のスキーマを定義します。
