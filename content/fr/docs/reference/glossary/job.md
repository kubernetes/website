---
title: Job
id: job
date: 2018-04-12
full_link: /docs/concepts/workloads/controllers/job/
short_description: >
  Une tâche finie ou par lots qui s’exécute jusqu’à sa terminaison.

aka: 
tags:
- fundamental
- core-object
- workload
---
Une tâche finie ou par lots qui s’exécute jusqu’à sa terminaison.

<!--more-->

Crée un ou plusieurs objets {{< glossary_tooltip term_id="pod" >}} et garantit qu’un nombre spécifié d’entre eux se terminent correctement. À mesure que les Pods se terminent avec succès, la Job suit le nombre de terminaisons réussies.
