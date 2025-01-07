---
title: ユーザー名前空間
id: userns
date: 2021-07-13
full_link: https://man7.org/linux/man-pages/man7/user_namespaces.7.html
short_description: >
  非特権ユーザーに対して管理者権限をエミュレートするLinuxカーネルの機能。

aka:
- user namespace
tags:
- security
---

root権限をエミュレートするLinuxカーネルの機能。rootlessコンテナを実現するために使われます。

<!--more-->

ユーザー名前空間は、非rootユーザーが管理者(root)権限をエミュレートできるLinuxカーネルの機能です。例えば、コンテナの外部で管理者権限を持っていなくてもコンテナを実行することができます。

ユーザー名前空間は、コンテナブレークアウト攻撃による被害を軽減するのに効果的な対策です。

ここでのユーザー名前空間は、Linuxカーネルの機能を指し、Kubernetesの{{< glossary_tooltip text="Namespace" term_id="namespace" >}}とは異なります。

<!-- TODO: https://kinvolk.io/blog/2020/12/improving-kubernetes-and-container-security-with-user-namespaces/ -->
