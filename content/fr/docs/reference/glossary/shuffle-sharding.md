---
title: Shuffle-sharding
id: shuffle-sharding
full_link:
short_description: >
  Technique d’attribution de requêtes à des files offrant une meilleure isolation qu’un simple hash modulo le nombre de files.

aka:
tags:
- fundamental
---

Technique d’attribution de requêtes à des files offrant une meilleure isolation qu’un simple hash modulo le nombre de files.

<!--more-->

L’objectif est d’isoler différents flux de requêtes afin qu’un flux intense ne bloque pas des flux moins chargés.  
Une approche simple consiste à hasher certaines caractéristiques de la requête modulo le nombre de files pour obtenir l’indice de la file. Mais un flux intense peut alors monopoliser toutes les files correspondant au même hash.

Le shuffle-sharding améliore l’isolation : il produit un hash à haute entropie, simule un « mélange de cartes », puis attribue une « main » de files. La requête est placée dans la file la plus courte parmi celles examinées.  
Avec une main de taille modeste, cette technique permet aux flux faibles de contourner l’effet des flux intenses. Une main trop grande rend le processus coûteux et réduit l’efficacité de l’isolation. La taille de la main doit donc être choisie judicieusement.
