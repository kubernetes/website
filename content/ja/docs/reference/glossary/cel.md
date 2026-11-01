---
title: Common Expression Language
id: cel
full_link: https://cel.dev
short_description: >
  ユーザーのコードを安全に実行できるように設計された式言語。
tags:
- extension
- fundamental
aka:
- CEL
---
高速かつポータブルで、安全に実行できるように設計された汎用の式言語です。

<!--more-->

Kubernetesでは、CELを使用してクエリを実行したり、きめ細かなフィルタリングを行ったりできます。
例えば、[動的アドミッションコントロール](/docs/reference/access-authn-authz/extensible-admission-controllers/)でCEL式を使用してリクエスト内の特定のフィールドをフィルタリングしたり、[動的リソース割り当て(DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)で特定の属性に基づいてリソースを選択したりできます。
