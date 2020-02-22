---
title: コンテナ環境変数
id: container-env-variables
date: 2018-04-12
full_link: /docs/concepts/containers/container-environment-variables/
short_description: >
  コンテナ環境変数は、Pod内で実行するコンテナに対して有用な情報を提供するための名前=値の組です。

aka:
tags:
- fundamental
---
 コンテナ環境変数は、Pod内で実行するコンテナに対して有用な情報を提供するための名前=値の組です。

<!--more-->

コンテナ環境変数は、{{< glossary_tooltip text="Containers" term_id="container" >}}の重要なリソースに関する情報とともに、実行中のコンテナ化されたアプリケーションに対して必要な情報を提供します。たとえば、ファイルシステムの詳細、コンテナ自身の情報、およびサービスのエンドポイントのようなほかのクラスターリソースに関するものです。
