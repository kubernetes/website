---
title: Proxy
id: proxy
short_description: >
  Une application servant d’intermédiaire entre les clients et les serveurs.

aka:
tags:
- réseau
---
En informatique, un proxy est un serveur qui agit comme intermédiaire pour un service distant.

<!--more-->

Un client interagit avec le proxy ; le proxy transmet les données du client au serveur réel ; le serveur réel répond au proxy ; le proxy renvoie la réponse au client.

[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) est un proxy réseau qui s’exécute sur chaque nœud de votre cluster et implémente une partie du concept Kubernetes de {{< glossary_tooltip term_id="service">}}.

Vous pouvez exécuter kube-proxy comme un simple service proxy utilisateur. Si votre système le permet, vous pouvez également l’exécuter en mode hybride, produisant le même effet global en utilisant moins de ressources système.
