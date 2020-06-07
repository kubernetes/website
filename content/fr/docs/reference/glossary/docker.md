---
title: Docker
id: docker
date: 2018-04-12
full_link: https://docs.docker.com/engine/
short_description: >
  Docker est un logiciel fournissant une virtualisation au niveau du système d'exploitation, également connue sous le nom de conteneurs.

aka:
tags:
- fundamental
---
Docker (spécifiquement, Docker Engine) est un logiciel fournissant une virtualisation au niveau du système d'exploitation également connue sous le nom {{< glossary_tooltip text="conteneurs" term_id="container" >}}}.

<!--more-->

Docker utilise les fonctionnalités d'isolation du kernel Linux telles que les cgroups et les kernel namespaces, ainsi qu'un système de fichiers compatible union comme OverlayFS et d'autres pour permettre aux conteneurs de fonctionner indépendamment dans une seule instance Linux, évitant ainsi le démarrage et la maintenance des machines virtuelles (VMs).
