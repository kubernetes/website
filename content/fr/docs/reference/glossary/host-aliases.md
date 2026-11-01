---
title: HostAliases
id: HostAliases
full_link: /docs/reference/generated/kubernetes-api/{{< param "version" >}}/#hostalias-v1-core
short_description: >
  HostAliases permet de définir une correspondance entre des adresses IP et des noms d’hôte à injecter dans le fichier hosts d’un Pod.

aka:
tags:
- operation
---

HostAliases est un mécanisme permettant de définir une correspondance entre des adresses IP et des noms d’hôte à injecter dans le fichier hosts d’un Pod.

<!--more-->

HostAliases correspond à une liste optionnelle de noms d’hôte et d’adresses IP qui seront ajoutés au fichier hosts du Pod si elle est définie.

Cette fonctionnalité est uniquement valable pour les Pods qui n’utilisent pas le mode hostNetwork.