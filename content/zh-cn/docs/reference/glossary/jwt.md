---
title: JSON Web 令牌 (JWT)
id: jwt
date: 2023-01-17
full_link: https://www.rfc-editor.org/rfc/rfc7519
short_description: >
  JWT 是用来表示在两方之间所转移的权限声明的一种方式。

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
JWT 是用来表示在两方之间所转移的权限声明的一种方式。

<!--more-->

<!--
JWTs can be digitally signed and encrypted. Kubernetes uses JWTs as
authentication tokens to verify the identity of entities that want to perform
actions in a cluster.
-->
JWT 可以用数字方式签名和加密。
Kubernetes 将 JWT 用作身份验证令牌，以验证想要在集群中执行一些操作的实体的身份。
