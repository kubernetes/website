---
titre: cAdvisor
id: cadvisor
date: 2024-09-12
full_link: https://github.com/google/cadvisor/
short_description: >
  Outil qui permet de comprendre l'utilisation des ressources et les caractéristiques de performance des conteneurs
aka:
tags:
- tool
---
cAdvisor (Container Advisor) offre aux utilisateurs de conteneurs une compréhension de l'utilisation des ressources et des caractéristiques de performance de leurs {{< glossary_tooltip text="conteneurs" term_id="container" >}} en cours d'exécution.

<!--more-->

C'est un démon en cours d'exécution qui collecte, agrège, traite et exporte des informations sur les conteneurs en cours d'exécution. Plus précisément, pour chaque conteneur, il conserve les paramètres d'isolation des ressources, l'historique de l'utilisation des ressources, les histogrammes de l'utilisation complète des ressources historiques et les statistiques réseau. Ces données sont exportées par conteneur et à l'échelle de la machine.

