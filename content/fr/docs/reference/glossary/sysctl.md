---
title: sysctl
id: sysctl
full_link: /docs/tasks/administer-cluster/sysctl-cluster/
short_description: >
  Une interface permettant de lire et modifier les paramètres du noyau Unix.

aka:
tags:
- tool
---

`sysctl` est une interface standardisée permettant de lire ou de modifier les paramètres du noyau Unix en cours d’exécution.

<!--more-->

Sur les systèmes de type Unix, `sysctl` désigne à la fois l’outil utilisé par les administrateurs pour consulter et modifier ces paramètres, ainsi que l’appel système utilisé par cet outil.

Les runtimes de conteneurs et les plugins réseau peuvent dépendre de certaines valeurs `sysctl` correctement configurées.
