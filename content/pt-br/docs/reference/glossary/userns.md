---
title: Namespace do usuário
id: userns
date: 2021-07-13
full_link: https://man7.org/linux/man-pages/man7/user_namespaces.7.html
short_description: >
  Um recurso do kernel Linux para emular privilégios de superusuário para usuários sem privilégios.

aka:
tags:
- security
---

Um recurso do kernel para emular o root. Usado para "contêineres sem root".

<!--more-->

Os namespaces do usuário são um recurso do kernel Linux que permite que um usuário não root emule privilégios de superusuário ("root"), por exemplo, para executar contêineres sem ser um superusuário fora do contêiner.

O namespace do usuário é eficaz para mitigar os danos de um potencial ataque em que o adversário escapa dos limites do contêiner.

No contexto de namespaces de usuário, o namespace é um recurso do kernel Linux, e não um {{< glossary_tooltip text="namespace" term_id="namespace" >}} no sentido do termo Kubernetes.

<!-- TODO: https://kinvolk.io/blog/2020/12/improving-kubernetes-and-container-security-with-user-namespaces/ -->
