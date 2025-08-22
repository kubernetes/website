---
title: JSON Web Token (JWT)
id: jwt
date: 2023-01-17
full_link: https://www.rfc-editor.org/rfc/rfc7519
short_description: >
  2つの通信主体間で送受信されるクレームを表現する手段。

aka:
tags:
- security
- architecture
---
 2つの通信主体間で送受信されるクレームを表現する手段。

<!--more-->

JWTはデジタル署名と暗号化をすることが可能です。Kubernetesはクラスター内で何らかの操作を実行したいエンティティの身元を確認するため、認証トークンとしてJWTを使用します。
