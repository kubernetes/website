---
title: Unité de Contrôle
id: control-plane
date: 2019-05-12
full_link:
short_description: >
  La couche d'orchestration des conteneurs qui expose l'API et les interfaces pour définir, déployer, et gérer le cycle de vie des conteneurs.

aka:
tags:
- fundamental
---
 La couche d'orchestration des conteneurs qui expose l'API et les interfaces pour définir, déployer, et gérer le cycle de vie des conteneurs.

 <!--more--> 
 
 La couche est composé par différents éléments, comme (mais n'est pas limité à):

 * {{< glossary_tooltip text="etcd" term_id="etcd" >}}
 * {{< glossary_tooltip text="serveur" term_id="kube-apiserver" >}}
 * {{< glossary_tooltip text="Planificateur" term_id="kube-scheduler" >}}
 * {{< glossary_tooltip text="Gestionnaire de contrôleurs" term_id="kube-controller-manager" >}}
 * {{< glossary_tooltip text="Gestionnaore de contrôleurs du cloud" term_id="cloud-controller-manager" >}}

 Ces éléments peuvent être exécutés en tant que services traditionnels du système d'exploitation (démons) ou dans des conteneurs. Historiquement, les hôtes exécutant ces éléments étaient appelés {{< glossary_tooltip text="masters" term_id="master" >}}.