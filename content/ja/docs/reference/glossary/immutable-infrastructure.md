---
title: イミュータブルインフラストラクチャ
id: immutable-infrastructure
date: 2024-03-25
full_link:
short_description: >
  イミュータブルインフラストラクチャはデプロイ後に変更できないコンピューターインフラストラクチャ(カオスマシン、コンテナー、ネットワーウアプライアンス)を指します。
aka: 
tags:
- architecture
---
イミュータブルインフラストラクチャはデプロイ後に変更をできないコンピューターインフラストラクチャ(仮想マシン、コンテナー、ネットワークアプライアンス)を指します。
<!--more-->

イミュータビリティ(不変性)は、不正な変更を自動的な上書きやそもそも変更を許可しないシステムによって強制します。

{{< glossary_tooltip text="Containers" term_id="コンテナ">}}はイミュータブルインフラストラクチャの良い例です。
コンテナーへの永続的な変更は新たなバージョンでコンテナを作成するかイメージからコンテナーを再作成する方法しかありません。
{{< glossary_tooltip text="Containers" term_id="コンテナ" >}} are a good example of immutable infrastructure because persistent changes to containers
can only be made by creating a new version of the container or recreating the existing container from its image.

不正な変更を阻止または特定することでイミュータブルインフラストラクチャーはセキュリティリスクの特定と軽減を容易にします。
このようなシステムの運用は管理者が想定できるため、より簡単になります。
結局のところ、彼らは誰もミスや伝え忘れた変更がないことを知っていいます。
イミュータブル・インフラストラクチャは、インフラストラクチャの作成に必要なすべての自動化をバージョン管理（Gitなど）に保存する、Infrastructure as Codeと密接に関係しています。
このイミュータリティとバージョン管理の組み合わせは、システムに対するすべての許可された変更の耐久性のある監査ログが存在することを意味します。