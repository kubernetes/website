---
reviewers:
- sig-cluster-lifecycle
title: Création d’un cluster avec kubeadm
content_type: task
weight: 30
---

<!-- aperçu -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
Avec `kubeadm`, vous pouvez créer un cluster Kubernetes minimal viable conforme aux bonnes pratiques.
En fait, vous pouvez utiliser `kubeadm` pour configurer un cluster qui réussit les
[Kubernetes Conformance tests](/blog/2017/10/software-conformance-certification/).
`kubeadm` prend également en charge d’autres fonctions du cycle de vie du cluster, telles que les
[jetons d’amorçage (bootstrap tokens)](/docs/reference/access-authn-authz/bootstrap-tokens/) et les mises à niveau de cluster.

L’outil `kubeadm` est adapté si vous avez besoin de :

- Une manière simple de tester Kubernetes, éventuellement pour la première fois.
- Un moyen pour les utilisateurs existants d’automatiser la création d’un cluster et de tester leurs applications.
- Un composant de base dans d’autres outils d’écosystème et/ou installateurs ayant un périmètre plus large.

Vous pouvez installer et utiliser `kubeadm` sur différentes machines : votre ordinateur portable, un ensemble
de serveurs cloud, un Raspberry Pi, etc. Que vous déployiez dans le cloud ou sur site, vous pouvez intégrer
`kubeadm` dans des systèmes de provisionnement tels qu’Ansible ou Terraform.

## {{% heading "prerequisites" %}}

Pour suivre ce guide, vous avez besoin de :

- Une ou plusieurs machines exécutant un système Linux compatible deb/rpm ; par exemple : Ubuntu ou CentOS.
- 2 Gio ou plus de RAM par machine — moins laisserait peu de place pour vos applications.
- Au moins 2 CPU sur la machine utilisée comme nœud de plan de contrôle.
- Une connectivité réseau complète entre toutes les machines du cluster. Vous pouvez utiliser un réseau public ou privé.

Vous devez également utiliser une version de `kubeadm` capable de déployer la version
de Kubernetes que vous souhaitez utiliser dans votre nouveau cluster.

La [politique de support des versions et du décalage de versions de Kubernetes](/docs/setup/release/version-skew-policy/#supported-versions)
s’applique à `kubeadm` ainsi qu’à Kubernetes dans son ensemble.
Consultez cette politique pour connaître les versions de Kubernetes et de `kubeadm` prises en charge.
Cette page est écrite pour Kubernetes {{< param "version" >}}.

L’état global des fonctionnalités de `kubeadm` est en disponibilité générale (GA). Certaines sous-fonctionnalités sont encore en cours de développement.
L’implémentation de la création de cluster peut légèrement évoluer au fil du temps, mais l’approche globale reste stable.

{{< note >}}
Toutes les commandes sous `kubeadm alpha` sont, par définition, prises en charge au niveau alpha.
{{< /note >}}

<!-- étapes -->

## Objectifs

* Installer un cluster Kubernetes avec un seul nœud de plan de contrôle
* Installer un réseau de Pods sur le cluster afin que vos Pods puissent communiquer entre eux

## Instructions

### Préparation des hôtes

#### Installation des composants

Installez un {{< glossary_tooltip term_id="container-runtime" text="runtime de conteneur" >}}
et kubeadm sur tous les hôtes. Pour les instructions détaillées et autres prérequis, voir
[Installer kubeadm](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/).

{{< note >}}
Si vous avez déjà installé kubeadm, consultez les deux premières étapes du document
[Mise à niveau des nœuds Linux](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes)
pour savoir comment mettre kubeadm à jour.

Lors d’une mise à niveau, le kubelet redémarre toutes les quelques secondes en attendant dans une boucle de crash que
kubeadm lui indique quoi faire. Ce comportement est attendu et normal.
Après l’initialisation du plan de contrôle, le kubelet fonctionne normalement.
{{< /note >}}

#### Configuration réseau

Comme les autres composants Kubernetes, kubeadm essaie de trouver une adresse IP utilisable sur les interfaces réseau
associées à une passerelle par défaut sur l’hôte. Cette adresse IP est ensuite utilisée pour l’annonce et/ou l’écoute
effectuée par un composant.

Pour trouver cette adresse sur un hôte Linux, vous pouvez utiliser :

```shell
ip route show # Rechercher une ligne commençant par "default via"
```

{{< note >}}
Si deux passerelles par défaut ou plus sont présentes sur l’hôte, un composant Kubernetes
essaiera d’utiliser la première qu’il rencontre ayant une adresse IP unicast globale adaptée.
Lors de ce choix, l’ordre exact des passerelles peut varier selon les systèmes d’exploitation
et les versions du noyau.
{{< /note >}}

Les composants Kubernetes n’acceptent pas la sélection d’une interface réseau personnalisée
comme option. Par conséquent, une adresse IP personnalisée doit être passée en argument à toutes
les instances de composants nécessitant une telle configuration.

{{< note >}}
Si l’hôte ne possède pas de passerelle par défaut et qu’aucune adresse IP personnalisée n’est fournie
à un composant Kubernetes, celui-ci peut se terminer avec une erreur.
{{< /note >}}

Pour configurer l’adresse d’annonce de l’API server sur les nœuds de plan de contrôle créés avec
`init` et `join`, le flag `--apiserver-advertise-address` peut être utilisé.
Idéalement, cette option peut être définie dans l’[API kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4)
via `InitConfiguration.localAPIEndpoint` et `JoinConfiguration.controlPlane.localAPIEndpoint`.

Pour les kubelets sur tous les nœuds, l’option `--node-ip` peut être passée dans
`.nodeRegistration.kubeletExtraArgs` dans un fichier de configuration kubeadm
(`InitConfiguration` ou `JoinConfiguration`).

Pour le support dual-stack, voir :
[Support dual-stack avec kubeadm](/docs/setup/production-environment/tools/kubeadm/dual-stack-support).

Les adresses IP assignées aux composants du plan de contrôle font partie des champs SAN
(subject alternative name) des certificats X.509. Modifier ces adresses IP nécessiterait
de signer de nouveaux certificats et de redémarrer les composants concernés afin que les changements
soient pris en compte. Voir
[Régénération manuelle des certificats](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal)
pour plus de détails.

{{< warning >}}
Le projet Kubernetes déconseille cette approche (configurer toutes les instances de composants
avec des adresses IP personnalisées). Les mainteneurs recommandent plutôt de configurer le réseau
de l’hôte afin que la passerelle par défaut soit celle détectée automatiquement et utilisée par Kubernetes.
Sur les nœuds Linux, vous pouvez utiliser des commandes comme `ip route` pour configurer le réseau ;
votre système d’exploitation peut également fournir des outils de gestion réseau plus avancés.
Si la passerelle par défaut de votre nœud est une adresse IP publique, vous devez configurer un filtrage
de paquets ou d’autres mesures de sécurité pour protéger les nœuds et le cluster.
{{< /warning >}}

### Préparation des images de conteneurs requises

Cette étape est optionnelle et ne s’applique que si vous souhaitez que `kubeadm init` et `kubeadm join`
ne téléchargent pas les images de conteneurs par défaut hébergées sur `registry.k8s.io`.

Kubeadm fournit des commandes permettant de pré-télécharger les images nécessaires
lors de la création d’un cluster sans connexion Internet sur les nœuds.
Voir [Exécuter kubeadm sans connexion Internet](/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection)
pour plus de détails.

Kubeadm permet également d’utiliser un registre d’images personnalisé pour les images requises.
Voir [Utilisation d’images personnalisées](/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images)
pour plus de détails.

### Initialisation du nœud de plan de contrôle

Le nœud de plan de contrôle est la machine où s’exécutent les composants du plan de contrôle, notamment
{{< glossary_tooltip term_id="etcd" >}} (la base de données du cluster) et le
{{< glossary_tooltip text="serveur API" term_id="kube-apiserver" >}},
avec lequel l’outil en ligne de commande {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}
communique.

1. (Recommandé) Si vous prévoyez de faire évoluer ce cluster kubeadm à nœud unique vers une
   [haute disponibilité](/docs/setup/production-environment/tools/kubeadm/high-availability/),
   vous devez spécifier `--control-plane-endpoint` pour définir un endpoint partagé pour tous les nœuds de plan de contrôle.
   Cet endpoint peut être un nom DNS ou une adresse IP d’un load balancer.

2. Choisissez un add-on de réseau de Pods et vérifiez s’il nécessite des arguments supplémentaires
   à passer à `kubeadm init`. Selon le fournisseur tiers choisi, vous devrez peut-être définir
   `--pod-network-cidr` avec une valeur spécifique. Voir
   [Installation d’un add-on réseau de Pods](#pod-network).

3. (Optionnel) `kubeadm` tente de détecter le runtime de conteneur via une liste de points de terminaison connus.
   Pour utiliser un runtime différent ou s’il y en a plusieurs installés sur le nœud provisionné,
   spécifiez l’argument `--cri-socket` à `kubeadm`. Voir
   [Installation d’un runtime](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime).

Pour initialiser le nœud de plan de contrôle, exécutez :

```bash
kubeadm init <args>
```

### Considérations sur `apiserver-advertise-address` et `ControlPlaneEndpoint`

Alors que `--apiserver-advertise-address` peut être utilisé pour définir l’adresse annoncée par le serveur API de ce nœud de plan de contrôle spécifique,
`--control-plane-endpoint` peut être utilisé pour définir un endpoint partagé pour tous les nœuds du plan de contrôle.

`--control-plane-endpoint` accepte à la fois des adresses IP et des noms DNS pouvant être résolus en adresses IP.
Veuillez contacter votre administrateur réseau pour évaluer les solutions possibles concernant ce type de résolution.

Voici un exemple de correspondance :

```
192.168.0.102 cluster-endpoint
```

Dans cet exemple, `192.168.0.102` est l’adresse IP de ce nœud et `cluster-endpoint` est un nom DNS personnalisé qui pointe vers cette adresse IP.
Cela vous permet de passer `--control-plane-endpoint=cluster-endpoint` à `kubeadm init` et d’utiliser le même nom DNS pour
`kubeadm join`. Plus tard, vous pouvez modifier `cluster-endpoint` pour qu’il pointe vers l’adresse de votre load balancer dans un scénario
de haute disponibilité.

Transformer un cluster à un seul plan de contrôle créé sans `--control-plane-endpoint` en un cluster hautement disponible
n’est pas pris en charge par kubeadm.

### Plus d’informations

Pour plus d’informations sur les arguments de `kubeadm init`, consultez le [guide de référence kubeadm](/docs/reference/setup-tools/kubeadm/).

Pour configurer `kubeadm init` avec un fichier de configuration, voir
[Utiliser kubeadm init avec un fichier de configuration](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file).

Pour personnaliser les composants du plan de contrôle, y compris l’ajout optionnel d’IPv6 pour les probes de liveness
des composants du plan de contrôle et du serveur etcd, fournissez des arguments supplémentaires à chaque composant comme décrit dans
[arguments personnalisés](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/).

Pour reconfigurer un cluster déjà créé, voir
[Reconfiguration d’un cluster kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure).

Pour relancer `kubeadm init`, vous devez d’abord [supprimer le cluster](#tear-down).

Si vous ajoutez un nœud d’une architecture différente à votre cluster, assurez-vous que vos DaemonSets déployés
prennent en charge les images de conteneurs pour cette architecture.

`kubeadm init` exécute d’abord une série de vérifications préalables pour s’assurer que la machine
est prête à exécuter Kubernetes. Ces vérifications affichent des avertissements et arrêtent l’exécution en cas d’erreur. Ensuite, `kubeadm init`
télécharge et installe les composants du plan de contrôle du cluster. Cela peut prendre plusieurs minutes.
Une fois terminé, vous devriez voir :

```none
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

Pour que kubectl fonctionne avec un utilisateur non root, exécutez les commandes suivantes, qui font également partie de la sortie de `kubeadm init` :

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Sinon, si vous êtes l'utilisateur `root`, vous pouvez exécuter :

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

{{< warning >}}
Le fichier kubeconfig `admin.conf` généré par `kubeadm init` contient un certificat avec
`Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`. Le groupe `kubeadm:cluster-admins`
est lié au ClusterRole intégré `cluster-admin`.
Ne partagez pas le fichier `admin.conf` avec qui que ce soit.

`kubeadm init` génère également un fichier kubeconfig `super-admin.conf` qui contient un certificat avec
`Subject: O = system:masters, CN = kubernetes-super-admin`.
`system:masters` est un groupe super-utilisateur de type “break-glass” qui contourne la couche d’autorisation (par exemple RBAC).
Ne partagez pas le fichier `super-admin.conf`. Il est recommandé de le déplacer vers un emplacement sécurisé.

Voir
[Générer des fichiers kubeconfig pour des utilisateurs supplémentaires](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users)
pour savoir comment utiliser `kubeadm kubeconfig user` afin de générer des kubeconfig pour des utilisateurs additionnels.
{{< /warning >}}

Conservez une copie de la commande `kubeadm join` affichée par `kubeadm init`. Vous
en aurez besoin pour [ajouter des nœuds à votre cluster](#join-nodes).

Le token est utilisé pour l’authentification mutuelle entre le nœud du plan de contrôle et les nœuds rejoignant le cluster.
Le token inclus ici est secret. Conservez-le en lieu sûr, car toute personne disposant de ce token peut ajouter
des nœuds authentifiés à votre cluster. Ces tokens peuvent être listés, créés et supprimés avec la commande
`kubeadm token`. Voir le [guide de référence kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-token/).

### Installation d’un add-on réseau de Pods {#pod-network}

{{< caution >}}
Cette section contient des informations importantes sur la configuration réseau et
l’ordre de déploiement.
Lisez attentivement ces recommandations avant de continuer.

**Vous devez déployer un add-on réseau de Pods basé sur
{{< glossary_tooltip text="Container Network Interface" term_id="cni" >}}
(CNI) afin que vos Pods puissent communiquer entre eux.
Le DNS du cluster (CoreDNS) ne démarrera pas tant qu’un réseau n’est pas installé.**

- Assurez-vous que votre réseau de Pods ne chevauche aucun réseau hôte :
  des problèmes peuvent survenir en cas de chevauchement.
  (Si vous détectez une collision entre le CIDR réseau de votre plugin et un réseau hôte,
  choisissez un autre bloc CIDR et utilisez-le avec `--pod-network-cidr` lors de `kubeadm init`,
  ainsi que dans la configuration YAML du plugin réseau.)

- Par défaut, `kubeadm` configure votre cluster pour utiliser et appliquer
  [RBAC](/docs/reference/access-authn-authz/rbac/) (contrôle d’accès basé sur les rôles).
  Assurez-vous que votre plugin réseau de Pods supporte RBAC, ainsi que tous les manifestes utilisés pour le déployer.

- Si vous souhaitez utiliser IPv6 (réseau dual-stack ou IPv6 uniquement),
  assurez-vous que votre plugin réseau de Pods le supporte.
  Le support IPv6 a été ajouté à CNI en [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0).
{{< /caution >}}

{{< note >}}
Kubeadm doit rester agnostique vis-à-vis de CNI et la validation des fournisseurs CNI est hors du périmètre des tests e2e actuels.
Si vous rencontrez un problème lié à un plugin CNI, veuillez ouvrir un ticket dans son tracker respectif
plutôt que dans les trackers kubeadm ou Kubernetes.
{{< /note >}}

Plusieurs projets externes fournissent des réseaux de Pods Kubernetes via CNI, certains prenant également en charge les
[politiques réseau](/docs/concepts/services-networking/network-policies/).

Voir la liste des add-ons qui implémentent le
[modèle réseau Kubernetes](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model).

Veuillez consulter la page [Installation des add-ons](/docs/concepts/cluster-administration/addons/#networking-and-network-policy)
pour une liste non exhaustive des plugins réseau supportés par Kubernetes.

Vous pouvez installer un add-on réseau de Pods avec la commande suivante sur le
nœud du plan de contrôle ou sur un nœud disposant des identifiants kubeconfig :

```bash
kubectl apply -f <add-on.yaml>
```

{{< note >}}
Seuls quelques plugins CNI prennent en charge Windows. Plus de détails et des instructions de configuration sont disponibles dans
[Ajout de nœuds workers Windows](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/#network-config).
{{< /note >}}

Vous ne pouvez installer qu’un seul réseau de Pods par cluster.

Une fois un réseau de Pods installé, vous pouvez vérifier qu’il fonctionne en contrôlant que le Pod CoreDNS est à l’état `Running`
dans la sortie de `kubectl get pods --all-namespaces`.
Une fois le Pod CoreDNS en cours d’exécution, vous pouvez continuer en ajoutant vos nœuds au cluster.

Si votre réseau ne fonctionne pas ou si CoreDNS n’est pas à l’état `Running`, consultez le
[guide de dépannage](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)
pour `kubeadm`.

### Labels des nœuds gérés

Par défaut, kubeadm active le contrôleur d’admission
[NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
qui limite les labels pouvant être appliqués automatiquement par les kubelets lors de l’enregistrement d’un nœud.
La documentation du contrôleur d’admission décrit les labels autorisés avec l’option kubelet `--node-labels`.

Le label `node-role.kubernetes.io/control-plane` fait partie des labels restreints et kubeadm l’applique manuellement
à l’aide d’un client privilégié après la création d’un nœud. Pour faire cela manuellement, vous pouvez utiliser `kubectl label`
et vous assurer d’utiliser un kubeconfig privilégié tel que celui géré par kubeadm : `/etc/kubernetes/admin.conf`.

### Isolation du nœud de plan de contrôle

Par défaut, votre cluster ne planifie pas de Pods sur les nœuds du plan de contrôle pour des raisons de sécurité.
Si vous souhaitez autoriser l’exécution de Pods sur les nœuds du plan de contrôle, par exemple pour un cluster Kubernetes sur une seule machine,
exécutez :

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

Le résultat ressemblera à ceci :

```
node "test-01" untainted
...
```

Cela supprimera le taint `node-role.kubernetes.io/control-plane:NoSchedule`
sur tous les nœuds qui le possèdent, y compris les nœuds du plan de contrôle, ce qui permettra ensuite au planificateur (scheduler)
de planifier des Pods sur tous les nœuds.

De plus, vous pouvez exécuter la commande suivante pour supprimer le label
[`node.kubernetes.io/exclude-from-external-load-balancers`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-exclude-from-external-load-balancers)
du nœud du plan de contrôle, ce qui l’exclut de la liste des serveurs backend :

```bash
kubectl label nodes --all node.kubernetes.io/exclude-from-external-load-balancers-
```

### Ajout de nœuds de plan de contrôle supplémentaires

Voir [Créer des clusters hautement disponibles avec kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
pour les étapes permettant de créer un cluster kubeadm hautement disponible en ajoutant plusieurs nœuds de plan de contrôle.

### Ajout de nœuds workers {#join-nodes}

Les nœuds workers sont ceux où s’exécutent vos workloads.

Les pages suivantes expliquent comment ajouter des nœuds workers Linux et Windows au cluster en utilisant
la commande `kubeadm join` :

* [Ajout de nœuds workers Linux](/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/)
* [Ajout de nœuds workers Windows](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)

### (Optionnel) Contrôler votre cluster depuis des machines autres que le nœud de plan de contrôle

Afin d’utiliser `kubectl` depuis une autre machine (par exemple un ordinateur portable) pour communiquer avec votre
cluster, vous devez copier le fichier kubeconfig administrateur depuis votre nœud de plan de contrôle
vers votre poste de travail comme ceci :

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
L’exemple ci-dessus suppose que l’accès SSH est activé pour l’utilisateur root. Si ce n’est pas le cas,
vous pouvez copier le fichier `admin.conf` pour qu’il soit accessible par un autre utilisateur,
puis utiliser `scp` avec cet autre utilisateur.

Le fichier `admin.conf` donne à l’utilisateur des privilèges _superutilisateur_ sur le cluster.
Ce fichier doit être utilisé avec précaution. Pour les utilisateurs normaux, il est recommandé de générer
des identifiants uniques auxquels vous accordez des permissions spécifiques. Vous pouvez le faire avec la commande
`kubeadm kubeconfig user --client-name <CN>`.
Cette commande affiche un fichier KubeConfig sur la sortie standard (STDOUT) que vous devez enregistrer dans un fichier
et distribuer à l’utilisateur. Ensuite, accordez les privilèges avec `kubectl create (cluster)rolebinding`.
{{< /note >}}

### (Optionnel) Proxy du serveur API vers localhost

Si vous souhaitez vous connecter au serveur API depuis l’extérieur du cluster, vous pouvez utiliser
`kubectl proxy` :

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

Vous pouvez désormais accéder au serveur API localement à l’adresse `http://localhost:8001/api/v1`

## Nettoyage {#tear-down}

Si vous avez utilisé des serveurs jetables pour votre cluster de test, vous pouvez simplement les éteindre sans effectuer de nettoyage supplémentaire.
Vous pouvez utiliser `kubectl config delete-cluster` pour supprimer vos références locales au cluster.

Cependant, si vous souhaitez désactiver votre cluster de manière plus propre, vous devez d’abord
[drainer le nœud](/docs/reference/generated/kubectl/kubectl-commands#drain)
et vous assurer que le nœud est vide, puis désconfigurer le nœud.

### Supprimer le nœud

En vous connectant au nœud du plan de contrôle avec les identifiants appropriés, exécutez :

```bash
kubectl drain <node name> --delete-emptydir-data --force --ignore-daemonsets
```

Avant de supprimer le nœud, réinitialisez l'état installé par `kubeadm` :

```bash
kubeadm reset
```

La procédure de réinitialisation ne supprime ni ne réinitialise les règles iptables ni les tables IPVS.
Pour réinitialiser iptables, vous devez le faire manuellement.

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

Pour réinitialiser les tables IPVS, vous devez exécuter la commande suivante :

```bash
ipvsadm -C
```

Supprimez maintenant le nœud :

```bash
kubectl delete node <node name>
```

Si vous souhaitez recommencer, exécutez `kubeadm init` ou `kubeadm join` avec les arguments appropriés.

### Nettoyage du plan de contrôle

Vous pouvez utiliser `kubeadm reset` sur l’hôte du plan de contrôle pour effectuer un nettoyage au mieux des efforts.

Voir la documentation de référence [`kubeadm reset`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
pour plus d’informations sur cette sous-commande et ses options.

## Politique de décalage de versions {#version-skew-policy}

Bien que kubeadm autorise un décalage de versions avec certains composants qu’il gère, il est recommandé de faire correspondre
la version de kubeadm avec celles des composants du plan de contrôle, de kube-proxy et du kubelet.

### Décalage de kubeadm par rapport à la version de Kubernetes

kubeadm peut être utilisé avec des composants Kubernetes ayant la même version que kubeadm ou une version plus ancienne.
La version de Kubernetes peut être spécifiée à kubeadm via le flag `--kubernetes-version` de `kubeadm init`
ou via le champ `ClusterConfiguration.kubernetesVersion` lorsque vous utilisez `--config`.

Cette option contrôle les versions de kube-apiserver, kube-controller-manager, kube-scheduler et kube-proxy.

Exemple :

* kubeadm est en version {{< skew currentVersion >}}
* `kubernetesVersion` doit être en {{< skew currentVersion >}} ou {{< skew currentVersionAddMinor -1 >}}

### Décalage de kubeadm par rapport au kubelet

De manière similaire à la version de Kubernetes, kubeadm peut être utilisé avec une version de kubelet identique
ou jusqu’à trois versions mineures plus anciennes.

Exemple :

* kubeadm est en version {{< skew currentVersion >}}
* le kubelet sur l’hôte doit être en {{< skew currentVersion >}}, {{< skew currentVersionAddMinor -1 >}},
  {{< skew currentVersionAddMinor -2 >}} ou {{< skew currentVersionAddMinor -3 >}}

### Décalage de kubeadm par rapport à kubeadm

Il existe certaines limitations sur la manière dont les commandes kubeadm peuvent opérer sur des nœuds existants ou des clusters
entièrement gérés par kubeadm.

Si de nouveaux nœuds rejoignent le cluster, le binaire kubeadm utilisé pour `kubeadm join` doit correspondre
à la dernière version de kubeadm utilisée pour créer le cluster avec `kubeadm init` ou pour mettre à jour
ce même nœud avec `kubeadm upgrade`. Des règles similaires s’appliquent aux autres commandes kubeadm,
à l’exception de `kubeadm upgrade`.

Exemple pour `kubeadm join` :

* kubeadm en version {{< skew currentVersion >}} a été utilisé pour créer un cluster avec `kubeadm init`
* Les nœuds rejoignant le cluster doivent utiliser kubeadm en version {{< skew currentVersion >}}

Les nœuds en cours de mise à jour doivent utiliser une version de kubeadm correspondant à la même version MINOR
ou à une version MINOR supérieure à celle utilisée pour gérer le nœud.

Exemple pour `kubeadm upgrade` :

* kubeadm en version {{< skew currentVersionAddMinor -1 >}} a été utilisé pour créer ou mettre à jour le nœud
* La version de kubeadm utilisée pour la mise à jour doit être en {{< skew currentVersionAddMinor -1 >}}
  ou {{< skew currentVersion >}}

Pour en savoir plus sur le décalage de versions entre les différents composants Kubernetes, voir la
[politique de décalage de versions](/releases/version-skew-policy/).

## Limitations {#limitations}

### Résilience du cluster {#resilience}

Le cluster créé ici possède un seul nœud de plan de contrôle, avec une seule base de données etcd
qui y est exécutée. Cela signifie que si le nœud du plan de contrôle tombe en panne, votre cluster peut perdre
des données et devoir être recréé depuis zéro.

Solutions possibles :

* Effectuer régulièrement des [sauvegardes etcd](https://etcd.io/docs/v3.5/op-guide/recovery/).
  Le répertoire de données etcd configuré par kubeadm se trouve sur le nœud du plan de contrôle à `/var/lib/etcd`.

* Utiliser plusieurs nœuds de plan de contrôle. Vous pouvez consulter
  [Options de topologie hautement disponible](/docs/setup/production-environment/tools/kubeadm/ha-topology/)
  pour choisir une topologie de cluster offrant une
  [haute disponibilité](/docs/setup/production-environment/tools/kubeadm/high-availability/).

### Compatibilité des plateformes {#multi-platform}

Les packages deb/rpm et les binaires kubeadm sont construits pour amd64, arm (32 bits), arm64, ppc64le et s390x
conformément à la [proposition multi-plateforme](https://git.k8s.io/design-proposals-archive/multi-platform.md).

Les images de conteneurs multiplateformes pour le plan de contrôle et les add-ons sont également prises en charge depuis la version v1.12.

Seuls certains fournisseurs réseau proposent des solutions pour toutes les plateformes. Veuillez consulter la liste des fournisseurs réseau
ou leur documentation pour vérifier la compatibilité avec votre plateforme.

## Dépannage {#troubleshooting}

Si vous rencontrez des difficultés avec kubeadm, veuillez consulter la
[documentation de dépannage](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/).

## {{% heading "whatsnext" %}}

* Vérifiez que votre cluster fonctionne correctement avec [Sonobuoy](https://github.com/heptio/sonobuoy)
* Consultez [Mise à niveau des clusters kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
  pour mettre à jour votre cluster avec `kubeadm`
* Apprenez l’utilisation avancée de `kubeadm` dans la [documentation de référence kubeadm](/docs/reference/setup-tools/kubeadm/)
* Découvrez les [concepts Kubernetes](/docs/concepts/) et [`kubectl`](/docs/reference/kubectl/)
* Consultez la page [Réseau du cluster](/docs/concepts/cluster-administration/networking/) pour une liste complète
  des add-ons réseau de Pods
* Consultez la [liste des add-ons](/docs/concepts/cluster-administration/addons/) pour explorer d’autres add-ons
  (logs, monitoring, politiques réseau, visualisation et contrôle du cluster)
* Configurez la gestion des logs des événements du cluster et des applications dans les Pods.
  Voir [Architecture de logging](/docs/concepts/cluster-administration/logging/)

### Feedback {#feedback}

* Pour les bugs, visitez le [tracker GitHub kubeadm](https://github.com/kubernetes/kubeadm/issues)
* Pour du support, rejoignez le canal Slack [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/)
* Canal Slack SIG Cluster Lifecycle : [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* Informations SIG Cluster Lifecycle : https://github.com/kubernetes/community/tree/main/sig-cluster-lifecycle#readme
* Liste de diffusion SIG Cluster Lifecycle :
  https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle
  