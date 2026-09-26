---
title: Conteneur éphémère
id: ephemeral-container
full_link: /docs/concepts/workloads/pods/ephemeral-containers/
short_description: >
  Un type de conteneur que vous pouvez exécuter temporairement dans un Pod.

aka:
tags:
- fundamental
---

Un type de conteneur que vous pouvez exécuter temporairement dans un Pod.

<!--more-->

Si vous souhaitez analyser un Pod en cours d’exécution présentant des problèmes, vous pouvez y ajouter un conteneur éphémère afin d’effectuer des diagnostics.

Les conteneurs éphémères ne disposent pas de garanties en termes de ressources ou d’ordonnancement, et ne doivent pas être utilisés pour exécuter une partie du workload lui-même.

Les conteneurs éphémères ne sont pas pris en charge par les Pods statiques.