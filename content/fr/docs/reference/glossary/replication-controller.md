---
title: Contrôleur de réplication
id: replication-controller
full_link:
short_description: >
  Un objet API (déprécié) qui gère une application répliquée.

aka:
tags:
- workload
- core-object
---
Un {{< glossary_tooltip text="objet" term_id="object" >}} de gestion de workload
qui gère une application répliquée, en s’assurant que
un nombre spécifique d’instances d’un {{< glossary_tooltip text="pod" term_id="pod" >}} sont en cours d’exécution.

<!--more-->

Le plan de contrôle veille à ce que le nombre défini de pods soit respecté, même si certains
pods échouent, si vous supprimez des pods manuellement, ou si trop de pods sont démarrés par erreur.

{{< note >}}
Le ReplicationController est déprécié. Consultez
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}, qui offre un fonctionnement similaire.
{{< /note >}}