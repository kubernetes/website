---
title: コンテナ環境変数
id: container-env-variables
date: 2018-04-12
full_link: /ja/docs/concepts/containers/container-environment/
short_description: >
  コンテナ環境変数は、Pod内で実行されているコンテナに関する有用な情報を提供する`name=value`のペアです。

aka:
tags:
- fundamental
---
 コンテナ環境変数は、{{< glossary_tooltip text="Pod" term_id="pod" >}}内で実行されているコンテナに関する有用な情報を提供する`name=value`のペアです。

<!--more-->

コンテナ環境変数は、{{< glossary_tooltip text="コンテナ" term_id="container" >}}にとって重要なリソースに関する情報とともに、実行中のコンテナ化されたアプリケーションが必要とする情報を提供します。たとえば、ファイルシステムの詳細、コンテナ自体の情報、あるいはサービスエンドポイントのような他のクラスターリソースです。
