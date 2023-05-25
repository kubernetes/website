---
title: Tableau de bord (Dashboard)
content_type: concept
weight: 10
card:
  name: tasks
  weight: 30
  title: Utiliser le tableau de bord (Dashboard)
---

<!-- overview -->

Le tableau de bord (Dashboard) est une interface web pour Kubernetes.
Vous pouvez utiliser ce tableau de bord pour déployer des applications conteneurisées dans un cluster Kubernetes, dépanner votre application conteneurisée et gérer les ressources du cluster.
Vous pouvez utiliser le tableau de bord pour obtenir une vue d'ensemble des applications en cours d'exécution dans votre cluster, ainsi que pour créer ou modifier des ressources Kubernetes individuelles. (comme des Deployments, Jobs, DaemonSets, etc).
Par exemple, vous pouvez redimensionner un Deployment, lancer une mise à jour progressive, recréer un pod ou déployez de nouvelles applications à l'aide d'un assistant de déploiement.

Le tableau de bord fournit également des informations sur l'état des ressources Kubernetes de votre cluster et sur les erreurs éventuelles.

![Tableau de bord Kubernetes](/images/docs/ui-dashboard.png)



<!-- body -->

## Déploiement du tableau de bord

L'interface utilisateur du tableau de bord n'est pas déployée par défaut.
Pour le déployer, exécutez la commande suivante:

```text
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/charts/recommended.yaml
```

## Accès à l'interface utilisateur du tableau de bord

Pour protéger vos données dans le cluster, le tableau de bord se déploie avec une configuration RBAC minimale par défaut.
Actuellement, le tableau de bord prend uniquement en charge la connexion avec un jeton de support.
Pour créer un jeton pour cette démo, vous pouvez suivre notre guide sur [créer un exemple d'utilisateur](https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md).

{{< warning >}}
L’exemple d’utilisateur créé dans le didacticiel disposera de privilèges d’administrateur et servira uniquement à des fins pédagogiques.
{{< /warning >}}

### Proxy en ligne de commande

Vous pouvez accéder au tableau de bord à l'aide de l'outil en ligne de commande kubectl en exécutant la commande suivante:

```text
kubectl proxy
```

Kubectl mettra le tableau de bord à disposition à l'adresse suivante: <http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/>.

Vous ne pouvez accéder à l'interface utilisateur _que_ depuis la machine sur laquelle la commande est exécutée.
Voir `kubectl proxy --help` pour plus d'options.

{{< note >}}
La méthode d'authentification Kubeconfig ne prend pas en charge les fournisseurs d'identité externes ni l'authentification basée sur un certificat x509.
{{< /note >}}

## Page de bienvenue

Lorsque vous accédez au tableau de bord sur un cluster vide, la page d'accueil s'affiche.
Cette page contient un lien vers ce document ainsi qu'un bouton pour déployer votre première application.
De plus, vous pouvez voir quelles applications système sont exécutées par défaut dans le [namespace](/docs/tasks/administer-cluster/namespaces/) `kubernetes-dashboard` de votre cluster, par exemple le tableau de bord lui-même.

![Page d'accueil du tableau de bord Kubernetes](/images/docs/ui-dashboard-zerostate.png)

## Déploiement d'applications conteneurisées

Le tableau de bord vous permet de créer et de déployer une application conteneurisée en tant que Deployment et optionnellement un Service avec un simple assistant.
Vous pouvez spécifier manuellement les détails de l'application ou charger un fichier YAML ou JSON contenant la configuration de l'application.

Cliquez sur le bouton **CREATE** dans le coin supérieur droit de n’importe quelle page pour commencer.

### Spécifier les détails de l'application

L'assistant de déploiement s'attend à ce que vous fournissiez les informations suivantes:

- **App name** (obligatoire): Nom de votre application.
  Un [label](/docs/concepts/overview/working-with-objects/labels/) avec le nom sera ajouté au Deployment et Service, le cas échéant, qui sera déployé.

  Le nom de l'application doit être unique dans son [namespace](/docs/tasks/administer-cluster/namespaces/) Kubernetes.
  Il doit commencer par une lettre minuscule et se terminer par une lettre minuscule ou un chiffre et ne contenir que des lettres minuscules, des chiffres et des tirets (-).
  Il est limité à 24 caractères.
  Les espaces de début et de fin sont ignorés.

- **Container image** (obligatoire): L'URL d'une [image de conteneur](/docs/concepts/containers/images/) sur n'importe quel registre, ou une image privée (généralement hébergée sur le registre de conteneurs Google ou le hub Docker).
  La spécification d'image de conteneur doit se terminer par un deux-points.

- **Number of pods** (obligatoire): Nombre cible de pods dans lesquels vous souhaitez déployer votre application.
  La valeur doit être un entier positif.

  Un objet [Deployment](/docs/concepts/workloads/controllers/deployment/) sera créé pour maintenir le nombre souhaité de pods dans votre cluster.

- **Service** (optionnel): Pour certaines parties de votre application (par exemple les serveurs frontaux), vous souhaiterez peut-être exposer un [Service](/docs/concepts/services-networking/service/) sur une adresse IP externe, peut-être publique, en dehors de votre cluster (Service externe).
  Pour les Services externes, vous devrez peut-être ouvrir un ou plusieurs ports pour le faire.
  Trouvez plus de détails [ici](/docs/tasks/access-application-cluster/configure-cloud-provider-firewall/).

  Les autres services visibles uniquement de l'intérieur du cluster sont appelés Services internes.

  Quel que soit le type de service, si vous choisissez de créer un service et que votre conteneur écoute sur un port (entrant), vous devez spécifier deux ports.
  Le Service sera créé en mappant le port (entrant) sur le port cible vu par le conteneur.
  Ce Service acheminera le trafic vers vos pods déployés.
  Les protocoles pris en charge sont TCP et UDP.
  Le nom DNS interne de ce service sera la valeur que vous avez spécifiée comme nom d'application ci-dessus.

Si nécessaire, vous pouvez développer la section **Options avancées** dans laquelle vous pouvez spécifier davantage de paramètres:

- **Description**: Le texte que vous entrez ici sera ajouté en tant qu'[annotation](/docs/concepts/overview/working-with-objects/annotations/) au Deployment et affiché dans les détails de l'application.

- **Labels**: Les [labels](/docs/concepts/overview/working-with-objects/labels/) par défaut à utiliser pour votre application sont le nom et la version de l’application.
  Vous pouvez spécifier des labels supplémentaires à appliquer au Deployment, Service (le cas échéant), et Pods, tels que la release, l'environnement, le niveau, la partition et la piste d'édition.

  Exemple:

  ```conf
  release=1.0
  tier=frontend
  environment=pod
  track=stable
  ```

- **Namespace**: Kubernetes prend en charge plusieurs clusters virtuels s'exécutant sur le même cluster physique.
  Ces clusters virtuels sont appelés [namespaces](/docs/tasks/administer-cluster/namespaces/).
  Ils vous permettent de partitionner les ressources en groupes nommés de manière logique.

  Le tableau de bord propose tous les namespaces disponibles dans une liste déroulante et vous permet de créer un nouveau namespace.
  Le nom du namespace peut contenir au maximum 63 caractères alphanumériques et des tirets (-), mais ne peut pas contenir de lettres majuscules.
  Les noms de Namespace ne devraient pas être composés uniquement de chiffres.
  Si le nom est défini sous la forme d’un nombre, tel que 10, le pod sera placé dans le namespace par défaut.

  Si la création du namespace réussit, celle-ci est sélectionnée par défaut.
  Si la création échoue, le premier namespace est sélectionné.

- **Image Pull Secret**: Si l'image de conteneur spécifiée est privée, il peut être nécessaire de configurer des identifiants de [pull secret](/docs/concepts/configuration/secret/).

  Le tableau de bord propose tous les secrets disponibles dans une liste déroulante et vous permet de créer un nouveau secret.
  Le nom de secret doit respecter la syntaxe du nom de domaine DNS, par exemple. `new.image-pull.secret`.
  Le contenu d'un secret doit être codé en base64 et spécifié dans un fichier [`.dockercfg`](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).
  Le nom du secret peut contenir 253 caractères maximum.

  Si la création du secret d’extraction d’image est réussie, celle-ci est sélectionnée par défaut.
  Si la création échoue, aucun secret n'est appliqué.

- **CPU requirement (cores)** et **Memory requirement (MiB)**: Vous pouvez spécifier les [limites de ressource](/docs/tasks/configure-pod-container/limit-range/) minimales pour le conteneur.
  Par défaut, les pods fonctionnent avec des limites de CPU et de mémoire illimitées.

- **Run command** et **Run command arguments**: Par défaut, vos conteneurs exécutent les valeurs par défaut de la [commande d'entrée](/docs/user-guide/containers/#containers-and-commands) de l'image spécifiée.
  Vous pouvez utiliser les options de commande et les arguments pour remplacer la valeur par défaut.

- **Run as privileged**: Ce paramètre détermine si les processus dans [conteneurs privilégiés](/docs/user-guide/pods/#privileged-mode-for-pod-containers) sont équivalents aux processus s'exécutant en tant que root sur l'hôte.
  Les conteneurs privilégiés peuvent utiliser des fonctionnalités telles que la manipulation de la pile réseau et l'accès aux périphériques.

- **Environment variables**: Kubernetes expose ses Services via des [variables d'environnement](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
  Vous pouvez composer une variable d'environnement ou transmettre des arguments à vos commandes en utilisant les valeurs des variables d'environnement.  
  Ils peuvent être utilisés dans les applications pour trouver un Service.
  Les valeurs peuvent référencer d'autres variables à l'aide de la syntaxe `$(VAR_NAME)`.

### Téléchargement d'un fichier YAML ou JSON

Kubernetes supporte la configuration déclarative.
Dans ce style, toute la configuration est stockée dans des fichiers de configuration YAML ou JSON à l'aide des schémas de ressources de l'[API](/docs/concepts/overview/kubernetes-api/) de Kubernetes.

Au lieu de spécifier les détails de l'application dans l'assistant de déploiement, vous pouvez définir votre application dans des fichiers YAML ou JSON et télécharger les fichiers à l'aide du tableau de bord.

## Utilisation du tableau de bord

Les sections suivantes décrivent des vues du tableau de bord de Kubernetes; ce qu'elles fournissent et comment peuvent-elles être utilisées.

### Navigation

Lorsque des objets Kubernetes sont définis dans le cluster, le tableau de bord les affiche dans la vue initiale.
Par défaut, seuls les objets du namespace _default_ sont affichés, ce qui peut être modifié à l'aide du sélecteur d'espace de nom situé dans le menu de navigation.

Le tableau de bord montre la plupart des types d'objets Kubernetes et les regroupe dans quelques catégories de menus.

#### Vue d'ensemble de l'administrateur

Pour les administrateurs de cluster et de namespace, le tableau de bord répertorie les noeuds, les namespaces et les volumes persistants et propose des vues de détail pour ceux-ci.
La vue Liste de nœuds contient les mesures d'utilisation de CPU et de la mémoire agrégées sur tous les nœuds.
La vue détaillée affiche les métriques d'un nœud, ses spécifications, son statut, les ressources allouées, les événements et les pods s'exécutant sur le nœud.

#### Charges de travail

Affiche toutes les applications en cours d'exécution dans le namespace selectionné.
La vue répertorie les applications par type de charge de travail. (e.g., Deployments, Replica Sets, Stateful Sets, etc.) et chaque type de charge de travail peut être visualisé séparément.
Les listes récapitulent les informations exploitables sur les charges de travail, telles que le nombre de Pods prêts pour un Replica Set ou l'utilisation actuelle de la mémoire pour un Pod.

Les vues détaillées des charges de travail affichent des informations sur l'état et les spécifications, ainsi que les relations de surface entre les objets.
Par exemple, les Pods qu'un Replica Set controle ou bien les nouveaux Replica Sets et Horizontal Pod Autoscalers pour les Deployments.

#### Services

Affiche les ressources Kubernetes permettant d’exposer les services au monde externe et de les découvrir au sein d’un cluster.
Pour cette raison, les vues Service et Ingress montrent les Pods ciblés par eux, les points de terminaison internes pour les connexions au cluster et les points de terminaison externes pour les utilisateurs externes.

#### Stockage

La vue de stockage montre les ressources Persistent Volume Claim qui sont utilisées par les applications pour stocker des données.

#### Config Maps et Secrets

Affiche toutes les ressources Kubernetes utilisées pour la configuration en temps réel d'applications s'exécutant dans des clusters.
La vue permet d’éditer et de gérer des objets de configuration et d’afficher les secrets cachés par défaut.

#### Visualisation de journaux

Les listes de Pod et les pages de détail renvoient à une visionneuse de journaux intégrée au tableau de bord.
Le visualiseur permet d’exploiter les logs des conteneurs appartenant à un seul Pod.

![Visualisation de journaux](/images/docs/ui-dashboard-logs-view.png)



## {{% heading "whatsnext" %}}


Pour plus d'informations, voir la page du projet [Kubernetes Dashboard](https://github.com/kubernetes/dashboard).


