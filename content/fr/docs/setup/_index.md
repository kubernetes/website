---
reviewers:
- sieben
- perriea
- lledru
- awkif
- yastij
no_issue: true
title: Setup
description: Panorama de solution Kubernetes
main_menu: true
weight: 30
content_template: templates/concept
---
{{% capture overview %}}

Utilisez cette page pour trouver le type de solution qui correspond le mieux à vos besoins.

Le choix de l'emplacement de Kubernetes dépend des ressources dont vous disposez 
et de la flexibilité dont vous avez besoin. Vous pouvez executer Kubernetes presque partout, 
de votre ordinateur portable aux machines virtuelles d'un fournisseur de cloud jusqu'à un rack de serveurs en bare metal.
Vous pouvez également mettre en place un cluster entièrement géré en exécutant une seule commande ou bien créer 
votre propre cluster personnalisé sur vos serveurs bare-metal.

{{% /capture %}}

{{% capture body %}}

## Solutions locales

La solution locale, installée sur votre machine, est un moyen facile de démarrer avec Kubernetes. Vous
pouvez créer et tester des clusters Kubernetes sans vous soucier de la consommation 
des ressources et des quotas d'un cloud.

Vous devriez choisir une solution locale si vous souhaitez :

* Essayer ou commencer à apprendre Kubernetes
* Développer et réaliser des tests sur des clusters locaux

Choisissez une [solution locale] (/docs/setup/pick-right-solution/#local-machine-solutions).

## Solutions hébergées

Les solutions hébergées sont un moyen pratique de créer et de maintenir des clusters Kubernetes. Elles
permettent de gérer et d'exploiter vos clusters pour que vous n'ayez pas à le faire.  

Vous devriez choisir une solution hébergée si vous :

* Voulez une solution entièrement gérée
* Voulez vous concentrer sur le développement de vos applications ou services  
* N'avez pas d'équipe de Site Reliability Engineering (SRE) dédiée, mais que vous souhaitez une haute disponibilité.
* Vous n'avez pas les ressources pour héberger et surveiller vos clusters 

Choisissez une [solution hébergée] (/fr/docs/setup/pick-right-solution/#hosted-solutions).

## Solutions cloud clés en main

Ces solutions vous permettent de créer des clusters Kubernetes avec seulement quelques commandes et 
sont activement développées et bénéficient du soutien actif de la communauté. Elles peuvent également être hébergés sur 
un ensemble de fournisseurs de Cloud de type IaaS, mais elles offrent plus de liberté et de flexibilité en contrepartie
d'un effort à fournir plus important.

Vous devriez choisir une solution cloud clés en main si vous :

* Voulez plus de contrôle sur vos clusters que ne le permettent les solutions hébergées
* Voulez réaliser vous même un plus grand nombre d'operations

Choisissez une [solution clé en main] (/docs/setup/pick-right-solution/#turnkey-cloud-solutions)

## Solutions clés en main sur site

Ces solutions vous permettent de créer des clusters Kubernetes sur votre cloud privé, interne et sécurisé,
avec seulement quelques commandes.

Vous devriez choisir une solution de cloud clé en main sur site si vous :

* Souhaitez déployer des clusters sur votre cloud privé
* Disposez d'une équipe SRE dédiée
* Avez les ressources pour héberger et surveiller vos clusters

Choisissez une [solution clé en main sur site] (/docs/setup/pick-right-solution/#on-premises-turnkey-cloud-solutions).

## Solutions personnalisées

Les solutions personnalisées vous offrent le maximum de liberté sur vos clusters, mais elles nécessitent le plus  
d'expertise. Ces solutions vont du bare-metal aux fournisseurs de cloud sur 
différents systèmes d'exploitation.

Choisissez une [solution personnalisée] (/docs/setup/pick-right-solution/#custom-solutions).

{{% /capture %}}

{{% capture whatsnext %}}
Allez à [Choisir la bonne solution] (/docs/setup/pick-right-solution/) pour une list complète de solutions.
{{% /capture %}}
