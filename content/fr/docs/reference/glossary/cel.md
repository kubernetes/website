---
title: CEL (Common Expression Language)
id: cel
full_link: https://cel.dev
short_description: >
  Un langage d’expression conçu pour être sûr lors de l’exécution de code utilisateur.

tags:
- extension
- fundamental
aka:
- CEL
---
Un langage d’expression généraliste conçu pour être rapide, portable et sûr à exécuter.

<!--more-->

Dans Kubernetes, CEL peut être utilisé pour exécuter des requêtes et effectuer un filtrage fin.  
Par exemple, vous pouvez utiliser des expressions CEL avec le [contrôle d’admission dynamique](/docs/reference/access-authn-authz/extensible-admission-controllers/) pour filtrer certains champs dans les requêtes, et avec [l’allocation dynamique de ressources (DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation) pour sélectionner des ressources en fonction d’attributs spécifiques.
