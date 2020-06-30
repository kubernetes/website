---
title: Ephemeral Container
id: ephemeral-container
date: 2019-08-26
full_link: /docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  Un type de conteneur que vous pouvez exécuter temporairement à l'intérieur d'un pod

aka:
tags:
- fundamental
---
Un type de {{< glossary_tooltip term_id="container" >}} que vous pouvez exécuter temporairement à l'intérieur d'un {{< glossary_tooltip term_id="pod" >}}.

<!--more-->

Si vous souhaitez analyser un pod qui a des problèmes de fonctionnement, vous pouvez ajouter un conteneur éphémère à ce pod et effectuer des diagnostics. Les conteneurs éphémères n'ont aucune garantie de ressources ou de planification, et vous ne devez pas les utiliser pour exécuter une partie de la charge de travail elle-même.