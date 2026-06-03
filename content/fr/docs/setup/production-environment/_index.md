---
title: "Environnement de production"
description: Créer un cluster Kubernetes prêt pour la production
weight: 30
no_list: true
---
<!-- overview -->

Un cluster Kubernetes de qualité production nécessite une planification et une préparation.
Si votre cluster Kubernetes doit exécuter des charges de travail critiques, il doit être configuré pour être résilient.
Cette page explique les étapes que vous pouvez suivre pour mettre en place un cluster prêt pour la production,
ou pour faire évoluer un cluster existant vers un usage en production.
Si vous êtes déjà familier avec la mise en place en production et souhaitez accéder directement aux liens, passez à
[Étapes suivantes](#what-s-next).

<!-- body -->

## Considérations pour la production

En général, un environnement Kubernetes de production a plus d’exigences qu’un environnement personnel
d’apprentissage, de développement ou de test. Un environnement de production peut nécessiter
un accès sécurisé pour de nombreux utilisateurs, une disponibilité constante, ainsi que des ressources
capables de s’adapter à des besoins changeants.

Lorsque vous décidez où héberger votre environnement Kubernetes de production
(sur site ou dans le cloud) et du niveau de gestion que vous souhaitez assumer ou déléguer,
réfléchissez à l’impact des éléments suivants sur les exigences de votre cluster Kubernetes :

- *Disponibilité* : Un environnement Kubernetes mono-machine ([environnement d’apprentissage](/docs/setup/#learning-environment))
  présente un point unique de défaillance. Mettre en place un cluster hautement disponible implique de considérer :
  - La séparation du plan de contrôle (*control plane*) des nœuds de travail (*worker nodes*).
  - La réplication des composants du plan de contrôle sur plusieurs nœuds.
  - La répartition de charge du trafic vers le {{< glossary_tooltip term_id="kube-apiserver" text="serveur API" >}} du cluster.
  - La disponibilité d’un nombre suffisant de nœuds de travail, ou leur capacité à être rapidement provisionnés selon les besoins.

- *Mise à l’échelle* : Si vous prévoyez une demande stable pour votre environnement Kubernetes de production,
  vous pouvez dimensionner votre infrastructure une fois pour toutes. Cependant,
  si la demande est susceptible d’augmenter avec le temps ou de varier fortement (selon les saisons ou des événements),
  vous devez planifier la montée en charge pour absorber une augmentation des requêtes vers le plan de contrôle
  et les nœuds, ou au contraire réduire les ressources inutilisées.

- *Sécurité et gestion des accès* : Vous disposez de tous les privilèges administrateur sur votre cluster Kubernetes
  d’apprentissage. En revanche, les clusters partagés avec des charges critiques et plusieurs utilisateurs nécessitent
  une gestion plus fine des accès aux ressources. Vous pouvez utiliser le contrôle d’accès basé sur les rôles
  ([RBAC](/docs/reference/access-authn-authz/rbac/)) ainsi que d’autres mécanismes de sécurité
  pour garantir que les utilisateurs et les charges de travail accèdent uniquement aux ressources nécessaires,
  tout en assurant la sécurité globale du cluster.
  Vous pouvez également limiter les ressources accessibles via des [politiques](/docs/concepts/policy/)
  et la gestion des [ressources des conteneurs](/docs/concepts/configuration/manage-resources-containers/).

Avant de construire vous-même un environnement Kubernetes de production, vous pouvez envisager de déléguer
tout ou partie de cette tâche à des fournisseurs de
[solutions cloud clé en main](/docs/setup/production-environment/turnkey-solutions/)
ou à d’autres [partenaires Kubernetes](/partners/).
Les options incluent :

- *Serverless* : Exécuter simplement vos charges de travail sur une infrastructure tierce sans gérer de cluster.
  La facturation se fait généralement sur l’utilisation CPU, mémoire et stockage.
- *Plan de contrôle managé* : Le fournisseur gère la mise à l’échelle, la disponibilité, les correctifs et les mises à jour du plan de contrôle.
- *Nœuds de travail managés* : Vous définissez des groupes de nœuds selon vos besoins, et le fournisseur s’assure
  de leur disponibilité et de leur mise à jour.
- *Intégration* : Certains fournisseurs proposent une intégration avec d’autres services essentiels
  (stockage, registres de conteneurs, authentification, outils de développement, etc.).

Que vous construisiez votre cluster Kubernetes de production vous-même ou avec des partenaires,
consultez les sections suivantes pour évaluer vos besoins concernant le *plan de contrôle*, les *nœuds de travail*,
les *accès utilisateurs* et les *ressources des charges de travail*.

## Configuration du cluster de production

Dans un cluster Kubernetes de qualité production, le plan de contrôle gère le cluster à partir de services
pouvant être répartis sur plusieurs machines de différentes manières.
Chaque nœud de travail, en revanche, représente une entité unique configurée pour exécuter des pods Kubernetes.

### Plan de contrôle en production

Le cluster Kubernetes le plus simple exécute l’ensemble des services du plan de contrôle et des nœuds de travail sur une seule machine. Vous pouvez faire évoluer cet environnement en ajoutant des nœuds de travail, comme illustré dans le diagramme de
[Composants Kubernetes](/docs/concepts/overview/components/).
Si le cluster est destiné à être utilisé sur une courte période, ou peut être abandonné en cas de problème majeur, cela peut suffire à vos besoins.

Cependant, si vous avez besoin d’un cluster plus durable et hautement disponible, vous devez envisager d’étendre le plan de contrôle. Par conception, des services de plan de contrôle exécutés sur une seule machine ne sont pas hautement disponibles.
Si le maintien du cluster en fonctionnement et sa capacité à être réparé en cas de problème sont importants, envisagez les étapes suivantes :

- *Choisir des outils de déploiement* : Vous pouvez déployer un plan de contrôle à l’aide d’outils tels que kubeadm, kops et kubespray. Consultez
  [Installer Kubernetes avec des outils de déploiement](/docs/setup/production-environment/tools/)
  pour obtenir des conseils sur des déploiements de qualité production avec chacun de ces outils.
  Différents [runtimes de conteneurs](/docs/setup/production-environment/container-runtimes/)
  sont disponibles pour vos déploiements.

- *Gérer les certificats* : Les communications sécurisées entre les services du plan de contrôle reposent sur des certificats. Ceux-ci peuvent être générés automatiquement lors du déploiement ou créés via votre propre autorité de certification.
  Consultez [Certificats PKI et exigences](/docs/setup/best-practices/certificates/) pour plus de détails.

- *Configurer un équilibreur de charge pour l’API server* : Configurez un load balancer afin de répartir les requêtes API externes vers les instances du serveur API exécutées sur différents nœuds. Voir
  [Créer un load balancer externe](/docs/tasks/access-application-cluster/create-external-load-balancer/)
  pour plus d’informations.

- *Séparer et sauvegarder le service etcd* : Les services etcd peuvent s’exécuter sur les mêmes machines que les autres composants du plan de contrôle ou sur des machines distinctes pour améliorer la sécurité et la disponibilité.
  Étant donné qu’etcd stocke les données de configuration du cluster, il est recommandé d’effectuer des sauvegardes régulières afin de pouvoir restaurer ces données si nécessaire.
  Consultez la [FAQ etcd](https://etcd.io/docs/v3.5/faq/) pour plus d’informations sur sa configuration et son utilisation.
  Voir également [Exploiter des clusters etcd pour Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/)
  et [Mettre en place un cluster etcd hautement disponible avec kubeadm](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/).

- *Créer plusieurs instances du plan de contrôle* : Pour assurer la haute disponibilité, le plan de contrôle ne doit pas être limité à une seule machine. Si les services sont gérés par un système d’init (comme systemd), chaque service devrait être exécuté sur au moins trois machines.
  Toutefois, exécuter les services du plan de contrôle sous forme de pods dans Kubernetes garantit que le nombre de réplicas demandé est toujours disponible.
  Le scheduler doit être tolérant aux pannes, mais n’est pas nécessairement hautement disponible.
  Certains outils de déploiement utilisent l’algorithme de consensus [Raft](https://raft.github.io/)
  pour l’élection de leader des services Kubernetes. Si le leader principal devient indisponible, un autre service est élu pour prendre le relais.

- *S’étendre sur plusieurs zones* : Si la disponibilité continue de votre cluster est critique, envisagez de le déployer sur plusieurs centres de données, appelés zones dans les environnements cloud. Un groupe de zones constitue une région.
  Répartir un cluster sur plusieurs zones au sein d’une même région améliore sa résilience en cas de défaillance d’une zone.
  Voir [Exécution sur plusieurs zones](/docs/setup/best-practices/multiple-zones/) pour plus de détails.

- *Gérer les opérations continues* : Si vous prévoyez de maintenir votre cluster dans le temps, certaines tâches sont nécessaires pour garantir sa santé et sa sécurité.
  Par exemple, avec kubeadm, vous pouvez consulter les guides sur la
  [gestion des certificats](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
  et la [mise à niveau des clusters kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
  Consultez [Administrer un cluster](/docs/tasks/administer-cluster/)
  pour une liste plus complète des tâches d’administration Kubernetes.

Pour en savoir plus sur les options disponibles pour les services du plan de contrôle, consultez les pages des composants
[kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/),
[kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)
et [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/).

Pour des exemples de plans de contrôle hautement disponibles, consultez :
[Options de topologie hautement disponible](/docs/setup/production-environment/tools/kubeadm/ha-topology/),
[Créer des clusters hautement disponibles avec kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
et [Exploiter des clusters etcd pour Kubernetes](/docs/tasks/administer-cluster/configure-upgrade-etcd/).

Consultez également [Sauvegarder un cluster etcd](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)
pour définir une stratégie de sauvegarde adaptée.

### Nœuds de travail en production

Les charges de travail en production doivent être résilientes, et tous les composants dont elles dépendent doivent également l’être (comme CoreDNS).
Que vous gériez vous-même votre plan de contrôle ou que vous le déléguiez à un fournisseur cloud, vous devez réfléchir à la manière de gérer vos nœuds de travail (également appelés simplement *nœuds*).

- *Configurer les nœuds* : Les nœuds peuvent être des machines physiques ou virtuelles. Si vous souhaitez créer et gérer vos propres nœuds, vous pouvez installer un système d’exploitation pris en charge, puis ajouter et exécuter les
  [services de nœud](/docs/concepts/architecture/#node-components). À considérer :
  - Les exigences de vos charges de travail lors de la configuration des nœuds (mémoire, CPU, vitesse et capacité de stockage).
  - L’adéquation de machines standards ou la nécessité de ressources spécifiques (GPU, nœuds Windows, isolation par machines virtuelles).

- *Valider les nœuds* : Consultez [Validation de la configuration des nœuds](/docs/setup/best-practices/node-conformance/)
  pour savoir comment vérifier qu’un nœud répond aux exigences pour rejoindre un cluster Kubernetes.

- *Ajouter des nœuds au cluster* : Si vous gérez votre propre cluster, vous pouvez ajouter des nœuds en configurant vos machines puis en les ajoutant manuellement ou en les laissant s’enregistrer auprès du serveur API du cluster.
  Consultez la section [Nœuds](/docs/concepts/architecture/nodes/) pour plus d’informations.

- *Mettre à l’échelle les nœuds* : Prévoyez un plan pour augmenter la capacité dont votre cluster aura besoin.
  Consultez [Considérations pour les grands clusters](/docs/setup/best-practices/cluster-large/)
  pour déterminer le nombre de nœuds requis en fonction du nombre de pods et de conteneurs à exécuter.
  Si vous gérez vos nœuds vous-même, cela peut impliquer l’achat et l’installation de matériel physique.

- *Autoscaler les nœuds* : Consultez [Autoscaling des nœuds](/docs/concepts/cluster-administration/node-autoscaling)
  pour découvrir les outils permettant de gérer automatiquement vos nœuds et leur capacité.

- *Mettre en place des vérifications de santé des nœuds* : Pour des charges de travail critiques, il est important de s’assurer que les nœuds et les pods qui y sont exécutés sont en bonne santé.
  En utilisant le démon [Node Problem Detector](/docs/tasks/debug/debug-cluster/monitor-node-health/), vous pouvez surveiller et garantir la santé de vos nœuds.

  ## Gestion des utilisateurs en production

En production, vous passez généralement d’un modèle où vous ou un petit groupe de personnes accédez au cluster,
à un environnement où des dizaines voire des centaines d’utilisateurs peuvent y accéder.
Dans un environnement d’apprentissage ou un prototype, un seul compte administrateur peut suffire.
En production, vous aurez besoin de plusieurs comptes avec différents niveaux d’accès à différents espaces de noms (namespaces).

Mettre en place un cluster de qualité production implique de définir comment accorder de manière sélective
l’accès aux autres utilisateurs. En particulier, vous devez choisir des stratégies pour vérifier l’identité
des utilisateurs qui tentent d’accéder au cluster (authentification) et déterminer s’ils disposent des
autorisations nécessaires (autorisation) :

- *Authentification* : Le serveur API peut authentifier les utilisateurs à l’aide de certificats clients,
  de jetons bearer, d’un proxy d’authentification ou de l’authentification HTTP basique.
  Vous pouvez choisir les méthodes d’authentification à utiliser.
  Grâce à des plugins, le serveur API peut également s’intégrer aux systèmes d’authentification existants
  de votre organisation, tels que LDAP ou Kerberos. Consultez
  [Authentification](/docs/reference/access-authn-authz/authentication/)
  pour une description détaillée des différentes méthodes.

- *Autorisation* : Pour autoriser les utilisateurs, vous choisirez généralement entre RBAC et ABAC.
  Consultez [Présentation de l’autorisation](/docs/reference/access-authn-authz/authorization/)
  pour comparer les différents modes d’autorisation (y compris pour les comptes de service) :

  - *Contrôle d’accès basé sur les rôles* ([RBAC](/docs/reference/access-authn-authz/rbac/)) :
    Permet d’accorder des permissions spécifiques aux utilisateurs authentifiés.
    Les permissions peuvent être définies pour un namespace (Role) ou pour l’ensemble du cluster (ClusterRole).
    Les RoleBindings et ClusterRoleBindings permettent ensuite d’associer ces permissions à des utilisateurs.

  - *Contrôle d’accès basé sur les attributs* ([ABAC](/docs/reference/access-authn-authz/abac/)) :
    Permet de définir des politiques basées sur les attributs des ressources du cluster.
    L’accès est accordé ou refusé selon ces attributs.
    Chaque ligne d’un fichier de politique spécifie des propriétés de version (apiVersion et kind)
    ainsi qu’un ensemble d’attributs décrivant le sujet (utilisateur ou groupe), les ressources,
    les non-ressources (/version ou /apis) et le mode lecture seule.
    Consultez [Exemples](/docs/reference/access-authn-authz/abac/#examples) pour plus de détails.

Lors de la mise en place de l’authentification et de l’autorisation sur votre cluster Kubernetes de production,
voici quelques éléments à prendre en compte :

- *Définir le mode d’autorisation* : Lors du démarrage du serveur API Kubernetes
  ([kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/)),
  les modes d’autorisation doivent être configurés via un fichier *--authorization-config*
  ou via l’option *--authorization-mode*.
  Par exemple, dans le fichier *kube-apiserver.yaml* (dans */etc/kubernetes/manifests*),
  cette option peut être définie sur `Node,RBAC`, ce qui active les modes Node et RBAC.

- *Créer des certificats utilisateurs et des RoleBindings (RBAC)* :
  Si vous utilisez RBAC, les utilisateurs peuvent créer une CertificateSigningRequest (CSR)
  qui sera signée par l’autorité de certification du cluster.
  Vous pouvez ensuite associer des Roles et ClusterRoles à chaque utilisateur.
  Consultez [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/)
  pour plus d’informations.

- *Créer des politiques combinant des attributs (ABAC)* :
  Si vous utilisez ABAC, vous pouvez combiner différents attributs pour créer des politiques
  autorisant certains utilisateurs ou groupes à accéder à des ressources spécifiques
  (par exemple un pod), un namespace ou un apiGroup.
  Voir [Exemples](/docs/reference/access-authn-authz/abac/#examples).

- *Prendre en compte les Admission Controllers* :
  Des mécanismes supplémentaires d’autorisation peuvent être appliqués aux requêtes entrant
  via le serveur API, comme l’authentification par webhook.
  Ces mécanismes nécessitent l’activation des
  [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
  sur le serveur API.

  ## Définir des limites pour les ressources des charges de travail

Les exigences des charges de travail en production peuvent exercer une pression à la fois à l’intérieur et à l’extérieur du plan de contrôle Kubernetes. Tenez compte des éléments suivants lors de la configuration des besoins des charges de travail de votre cluster :

- *Définir des limites par espace de noms* : définissez des quotas par espace de noms pour des ressources telles que la mémoire et le CPU. Consultez [Gérer la mémoire, le CPU et les ressources de l’API](/docs/tasks/administer-cluster/manage-resources/) pour plus de détails.
- *Se préparer à la demande DNS* : si vous prévoyez que les charges de travail augmentent fortement en échelle, votre service DNS doit également être capable de monter en charge. Consultez [Mettre à l’échelle automatiquement le service DNS dans un cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/).
- *Créer des comptes de service supplémentaires* : les comptes utilisateur déterminent ce que les utilisateurs peuvent faire sur un cluster, tandis qu’un compte de service définit l’accès des pods au sein d’un espace de noms donné. Par défaut, un pod utilise le compte de service par défaut de son espace de noms. Consultez [Gestion des comptes de service](/docs/reference/access-authn-authz/service-accounts-admin/) pour savoir comment créer un nouveau compte de service. Par exemple, vous pouvez :
  - Ajouter des secrets qu’un pod peut utiliser pour récupérer des images depuis un registre de conteneurs spécifique. Consultez [Configurer des comptes de service pour les pods](/docs/tasks/configure-pod-container/configure-service-account/) pour un exemple.
  - Attribuer des permissions RBAC à un compte de service. Consultez [Permissions des ServiceAccount](/docs/reference/access-authn-authz/rbac/#service-account-permissions) pour plus de détails.

## {{% heading "whatsnext" %}}

- Décidez si vous souhaitez construire votre propre cluster Kubernetes de production ou en obtenir un à partir de [solutions cloud clés en main](/docs/setup/production-environment/turnkey-solutions/) ou de [partenaires Kubernetes](/partners/).
- Si vous choisissez de construire votre propre cluster, planifiez la gestion des [certificats](/docs/setup/best-practices/certificates/) et mettez en place la haute disponibilité pour des composants tels que [etcd](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) et le [serveur API](/docs/setup/production-environment/tools/kubeadm/ha-topology/).
- Choisissez une méthode de déploiement parmi [kubeadm](/docs/setup/production-environment/tools/kubeadm/), [kops](https://kops.sigs.k8s.io/) ou [Kubespray](https://kubespray.io/).
- Configurez la gestion des utilisateurs en définissant vos méthodes d’[authentification](/docs/reference/access-authn-authz/authentication/) et d’[autorisation](/docs/reference/access-authn-authz/authorization/).
- Préparez les charges de travail applicatives en configurant des [limites de ressources](/docs/tasks/administer-cluster/manage-resources/), l’[autoscaling DNS](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/) et les [comptes de service](/docs/reference/access-authn-authz/service-accounts-admin/).