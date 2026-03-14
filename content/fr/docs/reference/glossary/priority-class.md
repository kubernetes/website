---
title: PriorityClass
id: priority-class
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass
short_description: >
  Une correspondance entre un nom de classe et la priorité d’ordonnancement qu’un Pod doit avoir.

aka:
tags:
- core-object
---

Une PriorityClass est une classe nommée représentant la priorité d’ordonnancement qui doit être attribuée à un Pod appartenant à cette classe.

<!--more-->

Une [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#how-to-use-priority-and-preemption)
est un objet non associé à un namespace qui associe un nom à une priorité entière, utilisée pour un Pod. Le nom est
spécifié dans le champ `metadata.name`, et la valeur de priorité dans le champ `value`. Les priorités vont de
-2147483648 à 1000000000 inclus. Des valeurs plus élevées indiquent une priorité plus élevée.