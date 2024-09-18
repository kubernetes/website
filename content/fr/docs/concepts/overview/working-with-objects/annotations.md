---
title: Annotations
content_type: concept
weight: 60
---

<!-- aperçu -->
Vous pouvez utiliser les annotations Kubernetes pour attacher des métadonnées non identifiantes arbitraires aux {{< glossary_tooltip text="objets" term_id="object" >}}.
Les clients tels que les outils et les bibliothèques peuvent récupérer ces métadonnées.

<!-- corps -->
## Attacher des métadonnées aux objets

Vous pouvez utiliser des labels ou des annotations pour attacher des métadonnées aux objets Kubernetes. Les labels peuvent être utilisées pour sélectionner des objets et trouver des collections d'objets qui satisfont certaines conditions. En revanche, les annotations ne sont pas utilisées pour identifier et sélectionner des objets. Les métadonnées dans une annotation peuvent être petites ou grandes, structurées ou non structurées, et peuvent inclure des caractères non autorisés par les labels. Il est possible d'utiliser des labels ainsi que des annotations dans les métadonnées du même objet.

Les annotations, comme les labels, sont des cartes clé/valeur :

```json
"metadata": {
  "annotations": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

{{< note >}} Les clés et les valeurs dans la carte doivent être des chaînes de caractères. En d'autres termes, vous ne pouvez pas utiliser des types numériques, booléens, listes ou autres pour les clés ou les valeurs. {{< /note >}}

Voici quelques exemples d'informations qui pourraient être enregistrées dans les annotations :

* Champs gérés par une couche de configuration déclarative. Attacher ces champs en tant qu'annotations les distingue des valeurs par défaut définies par les clients ou les serveurs, et des champs générés automatiquement et des champs définis par des systèmes de dimensionnement ou de mise à l'échelle automatique.

* Informations de build, de version ou d'image comme les horodatages, les identifiants de version, les branches git, les numéros de PR, les hachages d'image et l'adresse du registre.

* Pointeurs vers des dépôts de journalisation, de surveillance, d'analyse ou d'audit.

* Informations sur la bibliothèque cliente ou l'outil qui peuvent être utilisées à des fins de débogage : par exemple, nom, version et informations de build.

* Informations de provenance de l'utilisateur ou de l'outil/système, telles que les URL d'objets connexes provenant d'autres composants de l'écosystème.

* Métadonnées d'outil de déploiement léger : par exemple, configuration ou points de contrôle.

* Numéros de téléphone ou de pager des personnes responsables, ou entrées d'annuaire spécifiant où ces informations peuvent être trouvées, comme un site web d'équipe.

* Directives de l'utilisateur final aux implémentations pour modifier le comportement ou activer des fonctionnalités non standard.

Au lieu d'utiliser des annotations, vous pourriez stocker ce type d'informations dans une base de données ou un annuaire externe, mais cela rendrait beaucoup plus difficile la production de bibliothèques clientes et d'outils partagés pour le déploiement, la gestion, l'introspection, etc.

## Syntaxe et jeu de caractères

Les _Annotations_ sont des paires clé/valeur. Les clés d'annotation valides ont deux segments : un préfixe optionnel et un nom, séparés par une barre oblique (`/`). Le segment de nom est requis et doit comporter 63 caractères ou moins, commencer et se terminer par un caractère alphanumérique (`[a-z0-9A-Z]`) avec des tirets (`-`), des underscores (`_`), des points (`.`), et des alphanumériques entre. Le préfixe est optionnel. S'il est spécifié, le préfixe doit être un sous-domaine DNS : une série de labels DNS séparées par des points (`.`), ne dépassant pas 253 caractères au total, suivie d'une barre oblique (`/`).

Si le préfixe est omis, la clé d'annotation est présumée être privée pour l'utilisateur. Les composants système automatisés (par exemple, `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubect`l`, ou autre automatisation tierce) qui ajoutent des annotations aux objets des utilisateurs finaux doivent spécifier un préfixe.

Les préfixes `kubernetes.io/` et `k8s.io/` sont réservés aux composants de base de Kubernetes.

Par exemple, voici un manifeste pour un Pod qui a l'annotation `imageregistry: https://hub.docker.com/` :

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: annotations-demo
  annotations:
    imageregistry: "https://hub.docker.com/"
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

## {{% heading "whatsnext" %}}

- En savoir plus sur [Les labels et les sélecteurs](/fr/docs/concepts/overview/working-with-objects/labels/).
- Trouver [Les labels, annotations et taints bien connus](/docs/reference/labels-annotations-taints/)

