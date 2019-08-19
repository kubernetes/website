---
title: Admission Controller
id: admission-controller
date: 2019-06-28
full_link: fr/docs/reference/access-authn-authz/admission-controllers/
short_description: >
  Un morceau de code qui intercepte les requêtes adressées au serveur API de Kubernetes avant la persistance de l'objet.

aka:
tags:
- extension
- security
---
Un morceau de code qui intercepte les requêtes adressées au serveur API de Kubernetes avant la persistance de l'objet.

<!--more-->

Les contrôleurs d'accès sont configurables pour le serveur API de Kubernetes. Un contrôleur d'accès peut être "validant"  ("validating"), "mutant" ("mutating"), ou
les deux. Tout contrôleur d'accès peut rejeter la demande. Les contrôleurs mutant peuvent modifier les objets qu'ils admettent ;
alors que les contrôleurs validant ne le peuvent pas.

* ["Contrôleurs d'accès" dans la documentation de Kubernetes](fr/docs/reference/access-authn-authz/admission-controllers/)
