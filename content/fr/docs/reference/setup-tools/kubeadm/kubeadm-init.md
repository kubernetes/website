---
title: kubeadm init
content_type: concept
weight: 20
---
<!-- overview -->
Cette commande initialise un noeud Kubernetes control-plane.


<!-- body -->

{{< include "generated/kubeadm_init.md" >}}

### Séquence d'initialisation {#init-workflow}
`kubeadm init` assemble un noeud Kubernetes control-plane en effectuant les étapes suivantes :

1. Exécute une série de contrôles pour valider l'état du système avant d'y apporter des changements.
   Certaines validations peuvent émettre seulement des avertissements (warnings),
   d'autres peuvent générer des erreurs qui forceront l'interruption de kubeadm
   jusqu'à ce que le problème soit résolu
   ou jusqu'à ce que l'utilisateur spécifie `--ignore-preflight-errors=<list-des-erreurs>`.

1. Génère une autorité de certification (CA) auto signée (ou utilise une existante si spécifiée) pour
   installer les identités de chaque composant du cluster. Si l'utilisateur a fourni son propre certificat
   et/ou clef de CA en le (la) copiant dans le répertoire des certificats, configuré avec  `--cert-dir`
   (`/etc/kubernetes/pki` par défaut) cette étape est sautée comme expliqué dans le document
   [utiliser ses propres certificats](#custom-certificates).
   Les certificats de l'API Server auront des entrées SAN additionnelles pour chaque argument `--apiserver-cert-extra-sans`.

1. Ecrit les fichiers kubeconfig dans `/etc/kubernetes/` pour
   kubelet, le controller-manager et l'ordonnanceur (scheduler)
   qui seront utlisés pour les connexions à l'API server, chacun avec sa propre identité,
   ainsi qu'un fichier kubeconfig supplémentaire pour l'administration, nommé `admin.conf`.

1. Génère des manifestes statiques de Pod pour l'API server,
   le controller manager et l'ordonnanceur. Au cas où aucun etcd externe n'est fourni,
   un manifeste statique de Pod pour etcd est généré.

   Les manifestes statiques de Pod sont écrits dans `/etc/kubernetes/manifestes`;
   kubelet surveille ce répertoire afin que les Pods soient créés au démarrage.

   Dès lors que les pods de control-plane sont démarrés, la séquence de `kubeadm init` peut alors continuer.

1. Applique les étiquettes (labels) et marques (taints) au noeud control-plane afin qu'aucune charge de travail additionnelle ne s'y exécute.

1. Génère le jeton que les noeuds additionnels peuvent utiliser pour s'enregistrer avec un control-plane. Il est possible que l'utilisateur fournisse un jeton en utilisant `--token`,
   comme décrit dans la documentation [à propos du jeton kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm-token/).

1. Produit tous les fichiers de configuration requis pour autoriser les noeuds à rejoindre le cluster avec les
   [jetons d'assemblage](/docs/reference/access-authn-authz/bootstrap-tokens/) et le mécanisme
   [d'assemblage TLS](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/) :

   - Ecrit une ConfigMap pour produire toute la configuration nécessaire
     pour rejoindre le cluster et installer les règles d'accès RBAC sous jacentes.

   - Permet aux jetons d'assemblage d'accéder à l'API CSR (Certificate Signing Request, requête de signature de certificat).

   - Configure l'acceptation automatique des nouvelles requêtes CSR.

   Voir [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) pour de l'information complémentaire.

1. Installe un serveur DNS (CoreDNS) et les modules de l'extension kube-proxy en utilisant l'API Server.
   Dans la version 1.11 (et au delà) de Kubernetes, CoreDNS est le serveur DNS par défaut.
   Pour installer kube-dns au lieu de CoreDNS, l'extension DNS doit être configurée dans la `ClusterConfiguration` de kubeadm.
   Pour plus d'information, se référer à la section ci-dessous intitulée :
   `Utiliser kubeadm init avec un fichier de configuration`.
   Vous remarquerez que bien que le serveur DNS soit déployé, il ne sera pas programmé pour exécution avant que le CNI soit installé.

### Utiliser les phases d'initialisation avec kubeadm {#init-phases}

Kubeadm vous permet de créer un noeud de type control-plane en plusieurs phases. Dans 1.13 la commande `kubeadm init phase` a été promue GA (disponibilité générale) alors que précédemment ce n'était qu'une commande alpha : `kubeadm alpha phase`.

Pour voir la liste des phases et sous phases dans l'ordre, vous pouvez utiliser `kubeadm init --help`. La liste sera affichée en haut de l'écran d'aide et chaque phase aura une description associée.
Bon à savoir : en appelant `kubeadm init` toutes les phases et sous phases seront executées dans cet ordre.

Certaines phases ont des options uniques, si vous désirez consulter la liste de ces options, ajoutez `--help`, par exemple :

```shell
sudo kubeadm init phase control-plane controller-manager --help
```

Vous pouvez aussi utiliser `--help` pour voir la liste des sous-phases pour une phase parent :

```shell
sudo kubeadm init phase control-plane --help
```

`kubeadm init` a aussi une option nommée `--skip-phases` qui peut être utilisée pour passer outre. Cette option accepte une liste de noms de phases, qui peuvent être retrouvées à partir de la liste ordonée précédente.

Par exemple :

```shell
sudo kubeadm init phase control-plane all --config=configfile.yaml
sudo kubeadm init phase etcd local --config=configfile.yaml
# vous pouvez modifier les fichiers manifestes du control-plane et d'etcd
sudo kubeadm init --skip-phases=control-plane,etcd --config=configfile.yaml
```

Cet exemple écrirait les fichiers manifestes pour le control plane et etcd dans `/etc/kubernetes/manifestes` à partir de la configuration dans `configfile.yaml`. Cela permet de modifier les fichiers et d'ensuite sauter ces phases en utilisant `--skip-phases`. En invoquant la dernière commande, vous créerez un noeud de type control plane avec les les fichiers manifestes personnalisés.

### Utiliser kubeadm init avec un fichier de configuration {#config-file}

{{< caution >}}
L'utilisation d'un fichier de configuration est toujours considérée beta et le format du fichier pourrait changer dans les prochaines versions.
{{< /caution >}}

C'est possible de configurer `kubeadm init` avec un fichier de configuration plutôt qu'avec des options en ligne de commande, et certaines fonctionnalités avancées sont d'ailleurs uniquement disponibles en tant qu'options du fichier de configuration. Ce fichier est passé à kubeadm avec l'option `--config`.

Dans Kubernetes 1.11 et au delà, la configuration par défaut peut être affichée en utilisant la commande
[kubeadm config print](/docs/reference/setup-tools/kubeadm/kubeadm-config/).

Il est **recommandé** que vous migriez votre configuration `v1alpha3` vers `v1beta1` en utilisant
la commande [kubeadm config migrate](/docs/reference/setup-tools/kubeadm/kubeadm-config/),
car le support de `v1alpha3` sera supprimé dans Kubernetes 1.15.

Pour plus de détails à propos de chaque option de la configuration `v1beta1` vous pouvez consulter la
[référence de l'API](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta1).

### Ajouter des paramètres kube-proxy {#kube-proxy}

Pour de l'information à propos des paramètres kube-proxy dans la configuration kubeadm, se référer à :
[kube-proxy](https://godoc.org/k8s.io/kubernetes/pkg/proxy/apis/config#KubeProxyConfiguration)

Pour de l'information sur comment activer le mode IPVS avec kubeadm, se référer à :
[IPVS](https://github.com/kubernetes/kubernetes/blob/master/pkg/proxy/ipvs/README.md)

### Passer des options personnalisées aux composants du control plane {#control-plane-flags}

Pour de l'information sur comment passer des options aux composants du control plane, se référer à :
[control-plane-flags](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)

### Utiliser des images personnalisées {#custom-images}

Par défaut, kubeadm télécharge les images depuis `registry.k8s.io`, à moins que la version demandée de Kubernetes soit une version Intégration Continue (CI). Dans ce cas, `gcr.io/k8s-staging-ci-images` est utilisé.

Vous pouvez outrepasser ce comportement en utilisant [kubeadm avec un fichier de configuration](#config-file).
Les personnalisations permises sont :

* fournir un `imageRepository` à utiliser à la place de `registry.k8s.io`.
* régler `useHyperKubeImage` à `true` pour utiliser l'image HyperKube.
* fournir un `imageRepository` et un `imageTag` pour etcd et l'extension (add-on) DNS.

Notez que le champ de configurtation `kubernetesVersion` ou l'option ligne de commande `--kubernetes-version` affectent la version des images.

### Utiliser des certificats personnalisés {#custom-certificates}

Par défaut, kubeadm génère tous les certificats requis pour que votre cluster fonctionne.
Vous pouvez outrepasser ce comportement en fournissant vos propres certificats.

Pour ce faire, vous devez les placer dans le répertoire spécifié via l'option `--cert-dir` ou spécifié via la propriété `CertificatesDir` de votre fichier de configuration.
Par défaut, le répertoire est `/etc/kubernetes/pki`.

S'il existe un certificat et une clef privée dans ce répertoire, alors kubeadm sautera l'étape de génération et les fichiers fournis seront utilisés.
Cela signifie que vous pouvez, par exemple, copier un CA (Certificate Authority) existant vers `/etc/kubernetes/pki/ca.crt`
et `/etc/kubernetes/pki/ca.key`, et kubeadm utilisera ce CA pour signer le reste des certificats.

#### Mode CA externe {#external-ca-mode}

Il est aussi possible de fournir seulement le fichier `ca.crt` sans le fichier
`ca.key`  (seulement dans le cas d'un fichier CA racine, pas pour d'autres paires de certificats).
Si tous les certificats et fichiers kubeconfig sont en place, kubeadm activera le mode "CA externe".
Kubeadm continuera sans clef CA locale.

Ou alors, vous pouvez utiliser l'outil controller-manager avec `--controllers=csrsigner` en fournissant les emplacements du certificat CA et la clef.

### Gérer le fichier kubeadm ad-hoc pour kubelet {#kubelet-drop-in}

Le paquet kubeadm vient avec de la configuration concernant comment kubelet doit se comporter.
Vous remarquerez que la commande CLI `kubeadm` ne modifiera jamais ce fichier.
Ce fichier ad-hoc appartient au paquet deb/rpm de kubeadm.

Pour en savoir plus sur comment kubeadm gère kubelet, vous pouvez consulter
[cette page](/fr/docs/setup/production-environment/tools/kubeadm/kubelet-integration).

### Utilisation de kubeadm avec des runtimes CRI

Depuis la version v1.6.0, Kubernetes a rendu possible par défaut l'utilisation de CRI, Container Runtime Interface.
Le runtime utilisé par défaut est Docker, activé à travers l'adaptateur fourni `dockershim`, une implémentation CRI, à l'intérieur de `kubelet`.

Parmi les autres runtimes CRI, on retrouvera :

- [cri-containerd](https://github.com/containerd/cri-containerd)
- [cri-o](https://cri-o.io/)
- [frakti](https://github.com/kubernetes/frakti)
- [rkt](https://github.com/kubernetes-incubator/rktlet)

Se référer aux [instructions d'installation CRI](/docs/setup/cri) pour plus d'information.

Après avoir installé `kubeadm` et `kubelet`, exécuter ces étapes additionnelles :

1. Installer l'adaptateur runtime sur chaque noeud, en suivant les instructions d'installation du projet mentionné ci-dessus.

1. Configurer kubelet pour utiliser le runtime CRI distant. Ne pas oublier de modifier
   `RUNTIME_ENDPOINT` en utilisant la valeur adéquate `/var/run/{your_runtime}.sock`:

```shell
cat > /etc/systemd/system/kubelet.service.d/20-cri.conf <<EOF
[Service]
Environment="KUBELET_EXTRA_ARGS=--container-runtime=remote --container-runtime-endpoint=$RUNTIME_ENDPOINT"
EOF
systemctl daemon-reload
```

Maintenant `kubelet` est prête à utiliser le runtime CRI spécifié, et vous pouvez reprendre la séquence de déploiement avec `kubeadm init` et `kubeadm join`pour déployer votre cluster Kubernetes.

Il est aussi possible de configurer `--cri-socket` à `kubeadm init` et `kubeadm reset` lorsque vous utilisez une implémentation CRI externe.

### Paramétrer le nom du noeud

Par défaut, `kubeadm` donne un nom au noeud en utilisant l'adresse de la machine. Vous pouvez outrepasser ce réglage en utilisant l'option `--node-name`.
Cette option se chargera de passer la valeur appropriée pour [`--hostname-override`](/docs/reference/command-line-tools-reference/kubelet/#options) à kubelet.

Faîtes attention car forcer un nom d'hôte peut [interférer avec les fournisseurs de cloud](https://github.com/kubernetes/website/pull/8873).

### Héberger soi même le control plane Kubernetes {#self-hosting}

A partir de la version 1.8, vous pouvez expérimentalement créer un control plane Kubernetes _auto-hébergé (self-hosted)_ .
Cela signifie que des composants clefs comme le serveur d'API, le controller manager et l'ordonnanceur sont démarrés en tant que
[pods DaemonSet](/docs/concepts/workloads/controllers/daemonset/), configurés via l'API Kubernetes
plutôt qu'en tant que [pods static](/docs/tasks/administer-cluster/static-pod/) configurés avec des fichiers statiques dans kubelet.

Pour créer un cluster auto-hébergé, se référer à la commande `kubeadm alpha selfhosting`.

#### Avertissements

1. L'auto-hébergement dans la version 1.8 et au delà comporte de sérieuses limitations.
  En particulier, un cluster auto-hébergé _ne peut pas survivre au redémarrage du noeud control plane_ sans intervention manuelle.

1. Un cluster auto-hébergé ne peut pas être mis à jour via la commande `kubeadm upgrade`.

1. Par défaut, les Pods d'un control plane auto-hébergé dépendent des identifiants chargés depuis des volumes de type
  [`hostPath`](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath)
  A part pour la création initiale, ces identifiants ne sont pas gérés par kubeadm.

1. La partie auto-hébergée du control plane n'inclut pas etcd,
  qui fonctionne toujours en tant que Pod statique.

#### Procédé

Le procédé de démarrage auto-hébergé est documenté dans le [document de conception de kubeadm](https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.9.md#optional-self-hosting).

En bref, `kubeadm alpha selfhosting` fonctionne de la manière suivante :

  1. Attend que le control plane statique soit démarré correctement. C'est la même chose que le procédé `kubeadm init` lorsque non auto-hébergé.

  1. Utilise les manifestes du Pod statique du control plane pour construire un ensemble de manifestes DaemonSet qui vont lancer le control plane auto-hébergé.
    Cela modifie aussi les manifestes si nécessaires, par example pour ajouter des nouveaux volumes pour des secrets.

  1. Crée des DaemonSets dans le namespace `kube-system` et attend que les pods ainsi créés soient démarrés.

  1. Une fois que les Pods auto-hébergés sont opérationnels, les Pods statiques qui leurs sont associés sont supprimés et kubeadm installe ensuite le prochain composant.
   Cela déclenche l'arrêt par kubelet de ces Pods statiques.

  1. Quand le control plane statique d'origine s'arrête, le nouveau control plane auto-hébergé est capable d'écouter sur les mêmes ports et devenir actif.

### Utiliser kubeadm sans connexion internet

Pour utiliser kubeadm sans connexion internet, vous devez télécharger les images requises par le control plane à l'avance.

A partir de Kubernetes 1.11, vous pouvez lister et télécharger les images en utilisant les sous commandes à `kubeadm config images` :

```shell
kubeadm config images list
kubeadm config images pull
```

A partir de Kubernetes 1.12, les images prefixées par `registry.k8s.io/kube-*`, `registry.k8s.io/etcd` et `registry.k8s.io/pause`
ne nécessitent pas un suffix `-${ARCH}`.

### Automatiser kubeadm

Plutôt que copier sur chaque noeud le jeton que vous avez obtenu avec `kubeadm init`, comme décrit dans
le [tutoriel basique de kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/), vous pouvez paralléliser la distribution du jeton afin d'automatiser cette tâche.
Pour ce faire, vous devez connaître l'adresse IP que le noeud control plane obtiendra après son démarrage.

1.  Générer un jeton. Ce jeton doit avoir correspondre à la chaîne suivante : `<6 caractères>.<16
    caractères>`. Plus simplement, il doit correspondre à la regexp suivante :
    `[a-z0-9]{6}\.[a-z0-9]{16}`.

    kubeadm peut générer un jeton pour vous :

    ```shell
    kubeadm token generate
    ```

1. Démarrer en parallèle le noeud control plane et les noeuds worker nodes avec ce jeton.
   Lors de leurs démarrages, ils devraient pouvoir se trouver les uns les autres et former le cluster.
   L'option `--token`  peut être utilisée aussi bien pour `kubeadm init` que pour `kubeadm join`.

Une fois que le cluster est correctement démarré, vous pouvez obtenir les identifiants admin depuis le noeud control plane depuis le fichier `/etc/kubernetes/admin.conf`
et les utiliser pour communiquer avec le cluster.

Vous remarquerez que ce type d'installation présente un niveau de sécurité inférieur puisqu'il ne permet pas la validation du hash du certificat racine avec `--discovery-token-ca-cert-hash`
(puisqu'il n'est pas généré quand les noeuds sont provisionnés). Pour plus d'information, se référer à [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/).



## {{% heading "whatsnext" %}}

* [kubeadm init phase](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/) pour mieux comprendre les phases `kubeadm init`
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) pour amorcer un noeud Kubernetes worker node Kubernetes et le faire joindre le cluster
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) pour mettre à jour un cluster Kubernetes vers une version plus récente
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) pour annuler les changements appliqués avec `kubeadm init` ou `kubeadm join` à un noeud

