---
title: Infrastructure immuable
id: immutable-infrastructure
full_link:
short_description: >
  L’infrastructure immuable désigne une infrastructure informatique (machines virtuelles, conteneurs, équipements réseau) qui ne peut pas être modifiée une fois déployée

aka:
tags:
- architecture
---
L’infrastructure immuable désigne une infrastructure informatique (machines virtuelles, conteneurs, équipements réseau) qui ne peut pas être modifiée une fois déployée.

<!--more-->

L’immuabilité peut être appliquée via un processus automatisé qui écrase les modifications non autorisées
ou par un système qui n’autorise pas les modifications dès le départ.
Les {{< glossary_tooltip text="conteneurs" term_id="container" >}} sont un bon exemple d’infrastructure immuable
car toute modification persistante ne peut se faire qu’en créant une nouvelle version du conteneur
ou en recréant le conteneur existant à partir de son image.

En empêchant ou en détectant les modifications non autorisées, l’infrastructure immuable
facilite l’identification et la gestion des risques de sécurité.  
L’exploitation d’un tel système devient beaucoup plus simple car les administrateurs
peuvent faire des hypothèses fiables sur son état.  
Après tout, ils savent qu’aucune erreur ou modification n’a été effectuée à leur insu.
L’infrastructure immuable s’accompagne souvent de l’Infrastructure as Code (IaC),
où toute l’automatisation nécessaire à la création de l’infrastructure est stockée dans un
système de contrôle de version (comme Git).  
Cette combinaison d’immuabilité et de contrôle de version permet d’avoir un journal d’audit durable
pour chaque changement autorisé sur le système.