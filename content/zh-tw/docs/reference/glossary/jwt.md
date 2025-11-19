---
title: JSON Web 令牌 (JWT)
id: jwt
date: 2023-01-17
full_link: https://www.rfc-editor.org/rfc/rfc7519
short_description: >
  JWT 是用來表示在兩方之間所轉移的權限聲明的一種方式。

aka:
tags:
- security
- architecture
---
<!--
title: JSON Web Token (JWT)
id: jwt
date: 2023-01-17
full_link: https://www.rfc-editor.org/rfc/rfc7519
short_description: >
  A means of representing claims to be transferred between two parties.

aka:
tags:
- security
- architecture
-->

<!--
A means of representing claims to be transferred between two parties.
-->
JWT 是用來表示在兩方之間所轉移的權限聲明的一種方式。

<!--more-->

<!--
JWTs can be digitally signed and encrypted. Kubernetes uses JWTs as
authentication tokens to verify the identity of entities that want to perform
actions in a cluster.
-->
JWT 可以用數字方式簽名和加密。
Kubernetes 將 JWT 用作身份驗證令牌，以驗證想要在集羣中執行一些操作的實體的身份。
