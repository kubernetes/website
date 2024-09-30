---
title: Contrôleurs
content_type: concept
weight: 30
---

<!-- overview -->

En robotique et automatisation, une _boucle de contrôle_ est
une boucle non terminante qui régule l'état d'un système.

Voici un exemple de boucle de contrôle : un thermostat dans une pièce.

Lorsque vous réglez la température, vous indiquez au thermostat
votre *état souhaité*. La température réelle de la pièce est l'
*état actuel*. Le thermostat agit pour rapprocher l'état actuel
de l'état souhaité, en allumant ou éteignant l'équipement.

{{< glossary_definition term_id="controller" length="short">}}




<!-- body -->

## Modèle de contrôleur

Un contrôleur suit au moins un type de ressource Kubernetes.
Ces {{< glossary_tooltip text="objets" term_id="object" >}}
ont un champ spec qui représente l'état souhaité. Les
contrôleurs de cette ressource sont responsables de rapprocher l'état
actuel de cet état souhaité.

Le contrôleur peut effectuer lui-même l'action ; plus couramment, dans Kubernetes,
un contrôleur enverra des messages au
{{< glossary_tooltip text="serveur API" term_id="kube-apiserver" >}} qui ont
des effets secondaires utiles. Vous verrez des exemples de cela ci-dessous.

{{< comment >}}
Certains contrôleurs intégrés, tels que le contrôleur de namespace, agissent sur des objets
qui n'ont pas de spécification.
Pour simplifier, cette page n'explique pas ce détail.
{{< /comment >}}

### Contrôle via le serveur API

Le contrôleur de {{< glossary_tooltip term_id="job" >}} est un exemple de contrôleur
intégré à Kubernetes. Les contrôleurs intégrés gèrent l'état en
interagissant avec le serveur API du cluster.

Job est une ressource Kubernetes qui exécute un
{{< glossary_tooltip term_id="pod" >}}, ou peut-être plusieurs Pods, pour effectuer
une tâche, puis s'arrête.

(Une fois [planifiés](/docs/concepts/scheduling-eviction/), les objets Pod font partie de l'
état souhaité pour un kubelet).

Lorsque le contrôleur de Job voit une nouvelle tâche, il s'assure que, quelque part
dans votre cluster, les kubelets sur un ensemble de nœuds exécutent le bon
nombre de Pods pour effectuer le travail.
Le contrôleur de Job n'exécute aucun Pod ou conteneur
lui-même. Au lieu de cela, le contrôleur de Job demande au serveur API de créer ou supprimer
des Pods.
D'autres composants du
{{< glossary_tooltip text="plan de contrôle" term_id="control-plane" >}}
agissent sur les nouvelles informations (il y a de nouveaux Pods à planifier et à exécuter),
et finalement le travail est terminé.

Après avoir créé un nouveau Job, l'état souhaité est que ce Job soit terminé.
Le contrôleur de Job rapproche l'état actuel de ce Job de votre
état souhaité : en créant des Pods qui effectuent le travail que vous avez demandé pour ce Job, de sorte que
le Job soit plus proche de l'achèvement.

Les contrôleurs mettent également à jour les objets qui les configurent.
Par exemple : une fois le travail terminé pour un Job, le contrôleur de Job
met à jour cet objet Job pour le marquer comme `Terminé`.

(C'est un peu comme certains thermostats éteignent une lumière pour
indiquer que votre pièce est maintenant à la température que vous avez réglée).

### Contrôle direct

Contrairement à Job, certains contrôleurs doivent apporter des modifications à
des éléments en dehors de votre cluster.

Par exemple, si vous utilisez une boucle de contrôle pour vous assurer qu'il y a
suffisamment de {{< glossary_tooltip text="nœuds" term_id="node" >}}
dans votre cluster, alors ce contrôleur a besoin de quelque chose en dehors du
cluster actuel pour configurer de nouveaux nœuds lorsque cela est nécessaire.

Les contrôleurs qui interagissent avec un état externe trouvent leur état souhaité à partir
du serveur API, puis communiquent directement avec un système externe pour rapprocher
l'état actuel en ligne.

(Il existe en fait un [contrôleur](https://github.com/kubernetes/autoscaler/)
qui met à l'échelle horizontalement les nœuds de votre cluster.)

Le point important ici est que le contrôleur apporte certaines modifications pour atteindre
votre état souhaité, puis rapporte l'état actuel à votre serveur API de cluster.
D'autres boucles de contrôle peuvent observer ces données rapportées et prendre leurs propres mesures.

Dans l'exemple du thermostat, si la pièce est très froide, un autre contrôleur
pourrait également allumer un radiateur de protection contre le gel. Avec les clusters Kubernetes, le plan de contrôle
fonctionne indirectement avec des outils de gestion des adresses IP, des services de stockage,
des API de fournisseurs de cloud et d'autres services en
[étendant Kubernetes](/docs/concepts/extend-kubernetes/) pour les implémenter.

## État souhaité par rapport à l'état actuel {#desired-vs-current}

Kubernetes adopte une vision nativement cloud des systèmes et est capable de gérer
un changement constant.

Votre cluster peut changer à tout moment à mesure que le travail se déroule et que
les boucles de contrôle corrigent automatiquement les défaillances. Cela signifie que,
potentiellement, votre cluster n'atteint jamais un état stable.

Tant que les contrôleurs de votre cluster sont en cours d'exécution et capables de
effectuer des modifications utiles, il n'importe pas si l'état global est stable ou non.

## Conception

En tant que principe de sa conception, Kubernetes utilise de nombreux contrôleurs qui gèrent chacun
un aspect particulier de l'état du cluster. Le plus souvent, une boucle de contrôle
(contrôleur) utilise un type de ressource comme état souhaité et gère un autre type
de ressource pour réaliser cet état souhaité. Par exemple,
un contrôleur pour les Jobs suit les objets Job (pour découvrir un nouveau travail) et les objets Pod
(pour exécuter les Jobs, puis voir quand le travail est terminé). Dans ce cas,
quelque chose d'autre crée les Jobs, tandis que le contrôleur de Job crée les Pods.

Il est utile d'avoir des contrôleurs simples plutôt qu'un ensemble monolithique de 
boucles de contrôle interconnectées. Les contrôleurs peuvent échouer, 
c'est pourquoi Kubernetes est conçu pour le permettre.

{{< note >}}
Il peut y avoir plusieurs contrôleurs qui créent ou mettent à jour le même type d'objet.
En coulisses, les contrôleurs Kubernetes s'assurent qu'ils ne prêtent attention qu'aux ressources
 liées à leur ressource de contrôle.

Par exemple, vous pouvez avoir des Déploiements et des Jobs ; ceux-ci créent tous deux des Pods.
Le contrôleur de Job ne supprime pas les Pods créés par votre Déploiement,
car il existe des informations ({{< glossary_tooltip term_id="label" text="étiquettes" >}})
que les contrôleurs peuvent utiliser pour distinguer ces Pods.
{{< /note >}}

## Modes d'exécution des contrôleurs {#running-controllers}

Kubernetes est livré avec un ensemble de contrôleurs intégrés qui s'exécutent à l'intérieur
du {{< glossary_tooltip term_id="kube-controller-manager" >}}. Ces
contrôleurs intégrés fournissent des comportements de base importants.

Le contrôleur de Déploiement et le contrôleur de Job sont des exemples de contrôleurs qui
font partie de Kubernetes lui-même (contrôleurs "intégrés").
Kubernetes vous permet d'exécuter un plan de contrôle résilient, de sorte que si l'un des contrôleurs intégrés
venait à échouer, une autre partie du plan de contrôle prendra en charge le travail.

Vous pouvez trouver des contrôleurs qui s'exécutent en dehors du plan de contrôle pour étendre Kubernetes.
Ou, si vous le souhaitez, vous pouvez écrire vous-même un nouveau contrôleur.
Vous pouvez exécuter votre propre contrôleur sous la forme d'un ensemble de Pods, ou en dehors de Kubernetes.
Ce qui convient le mieux dépendra de ce que ce contrôleur particulier fait.

## {{% heading "whatsnext" %}}

* Lisez à propos du [plan de contrôle Kubernetes](/fr/docs/concepts/architecture/#control-plane-components)
* Découvrez certains des [objets Kubernetes de base](/fr/docs/concepts/overview/working-with-objects/)
* En savoir plus sur l'[API Kubernetes](/fr/docs/concepts/overview/kubernetes-api/)
* Si vous souhaitez écrire votre propre contrôleur, consultez
  les [modèles d'extension Kubernetes](/docs/concepts/extend-kubernetes/#extension-patterns)
  et le référentiel [sample-controller](https://github.com/kubernetes/sample-controller).


