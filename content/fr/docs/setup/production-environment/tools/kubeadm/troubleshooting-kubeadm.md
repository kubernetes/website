---
title: Dépannage de kubeadm
content_type: concept
weight: 20
---

<!-- overview -->

Comme avec n'importe quel programme, vous pourriez rencontrer une erreur lors de l'installation ou de
 l'exécution de kubeadm.
Cette page répertorie certains scénarios d’échec courants et propose des étapes pouvant vous aider à
comprendre et résoudre le problème.

Si votre problème ne figure pas dans la liste ci-dessous, procédez comme suit:

- Si vous pensez que votre problème est un bug avec kubeadm:
  - Aller à [github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues) et rechercher
 les problèmes existants.
  - Si aucune issue n'existe, veuillez [en ouvrir une](https://github.com/kubernetes/kubeadm/issues/new) et
  suivez le modèle ( template ) d'issue

- Si vous ne savez pas comment fonctionne kubeadm, vous pouvez demander sur [Slack](http://slack.k8s.io/)
dans le canal #kubeadm, ou posez une questions sur 
[StackOverflow](https://stackoverflow.com/questions/tagged/kubernetes). Merci d'ajouter les tags pertinents
comme `#kubernetes` et `#kubeadm`, ainsi on pourra vous aider.

<!-- body -->

## Impossible de joindre un nœud v1.18 à un cluster v1.17 en raison d’un RBAC manquant

Dans la version v1.18, kubeadm a ajouté une protection empêchant l’ajout d’un nœud au cluster si un nœud portant le même nom existe déjà.
Cela a nécessité l’ajout de règles RBAC permettant à l’utilisateur bootstrap-token de faire une requête GET sur un objet Node.

Cependant, cela provoque un problème : une commande `kubeadm join` depuis la version v1.18 ne peut pas rejoindre un cluster créé avec kubeadm v1.17.

Pour contourner ce problème, vous avez deux options :

Exécutez `kubeadm init phase bootstrap-token` sur un nœud du plan de contrôle avec kubeadm v1.18.
Notez que cela active également les autres permissions liées au bootstrap-token.

ou

Appliquez manuellement le contrôle d'accès basé sur les rôles (RBAC) suivant à l'aide de la commande `kubectl apply -f ...` :

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubeadm:get-nodes
rules:
  - apiGroups:
      - ""
    resources:
      - nodes
    verbs:
      - get
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kubeadm:get-nodes
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubeadm:get-nodes
subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: system:bootstrappers:kubeadm:default-node-token
```

## `ebtables` ou un exécutable similaire introuvable lors de l'installation

Si vous voyez les warnings suivants lors de l'exécution `kubeadm init`

```console
[preflight] WARNING: ebtables not found in system path
[preflight] WARNING: ethtool not found in system path
```

Ensuite, il peut vous manquer `ebtables`, `ethtool` ou un exécutable similaire sur votre nœud. Vous
pouvez l'installer avec les commandes suivantes:

- For Ubuntu/Debian users, run `apt install ebtables ethtool`.
- For CentOS/Fedora users, run `yum install ebtables ethtool`.

## kubeadm reste bloqué en attente du control plane pendant l'installation

Si vous remarquez que `kubeadm init` se bloque après la ligne suivante:

```console
[apiclient] Created API client, waiting for the control plane to become ready
```

Cela peut être causé par un certain nombre de problèmes. Les plus courants sont :

- des problèmes de connexion réseau. Vérifiez que votre machine dispose d’une connectivité réseau complète avant de continuer.
- le pilote cgroup du runtime de conteneur est différent de celui du kubelet. Pour comprendre comment le configurer correctement, consultez [Configurer un pilote cgroup](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/).
- les conteneurs du plan de contrôle sont en boucle de redémarrage (crashloop) ou bloqués. Vous pouvez le vérifier en exécutant `docker ps` et en inspectant chaque conteneur avec `docker logs`. Pour d’autres runtimes de conteneurs, voir [Déboguer les nœuds Kubernetes avec crictl](/docs/tasks/debug/debug-cluster/crictl/).

## kubeadm se bloque lors de la suppression de conteneurs gérés

Cela peut se produire si le runtime de conteneurs s’arrête et ne supprime aucun conteneur géré par Kubernetes :

```shell
sudo kubeadm reset
```

```console
[preflight] Running pre-flight checks
[reset] Stopping the kubelet service
[reset] Unmounting mounted directories in "/var/lib/kubelet"
[reset] Removing kubernetes-managed containers
(block)
```

Une solution possible consiste à redémarrer le runtime de conteneurs, puis à relancer `kubeadm reset`.
Vous pouvez également utiliser `crictl` pour déboguer l’état du runtime de conteneurs. Voir
[Déboguer les nœuds Kubernetes avec crictl](/docs/tasks/debug/debug-cluster/crictl/).

## Pods dans l'état `RunContainerError`, `CrashLoopBackOff` ou `Error`

Juste après `kubeadm init`, il ne devrait pas y avoir de pods dans ces états.

- S'il existe des pods dans l'un de ces états _juste après_ `kubeadm init`, veuillez ouvrir un
  issue dans le dépôt de Kubeadm. `coredns` (ou` kube-dns`) devrait être dans l'état `Pending`
  jusqu'à ce que vous ayez déployé la solution réseau.
- Si vous voyez des pods dans les états `RunContainerError`, `CrashLoopBackOff` ou `Error`
  après le déploiement de la solution réseau et que rien ne se passe pour `coredns` (ou` kube-dns`),
  il est très probable que la solution Pod Network que vous avez installée est en quelque sorte
endommagée. Vous devrez peut-être lui accorder plus de privilèges RBAC ou utiliser une version
plus récente. S'il vous plaît créez une issue dans le dépôt du fournisseur de réseau de Pod.

## `coredns` est bloqué à l’état `Pending`

Ceci est **prévu** et fait partie du design. kubeadm est indépendant du fournisseur
de réseau, ainsi l'administrateur devrait [installer la solution réseau pod](/docs/concepts/cluster-administration/addons/)
de son choix. Vous devez installer un réseau de pods avant que CoreDNS ne soit complètement déployé.
D'où l' état `Pending` avant la mise en place du réseau.

## Les services `HostPort` ne fonctionnent pas

Les fonctionnalités `HostPort` et `HostIP` sont disponibles en fonction de votre fournisseur
de réseau de pod. Veuillez contacter l’auteur de l’add-on réseau pour savoir si ces fonctionnalités sont prises en charge.

Les fournisseurs de CNI Calico, Canal, et Flannel sont validés pour supporter `HostPort`.

Pour plus d'informations, voir la [documentation CNI portmap](https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md).

Si votre fournisseur de réseau ne prend pas en charge le plug-in portmap CNI, vous devrez peut-être utiliser la
[fonction NodePort des services](/docs/concepts/services-networking/service/#nodeport) ou utiliser `HostNetwork=true`.

## Les pods ne sont pas accessibles via leur IP de service

- De nombreux add-ons réseau ne permettent pas encore
[mode hairpin](/docs/tasks/debug-application-cluster/debug-service/#a-pod-cannot-reach-itself-via-service-ip), qui permet aux pods d’accéder à eux-mêmes via leur IP de service. Ceci est un problème lié au [CNI](https://github.com/containernetworking/cni/issues/476). S'il vous plaît contacter le fournisseur d'add-on réseau afin d'obtenir des informations en matière de prise en charge du mode hairpin.

- Si vous utilisez VirtualBox (directement ou via Vagrant), vous devrez vous assurez que
`hostname -i` renvoie une adresse IP routable. Par défaut la première interface est connectée
à un réseau d’ `hôte uniquement` non routable. En contournement vous pouvez modifier `/etc/hosts`,
 jetez un œil à ce [Vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11) par exemple.

## Erreurs de certificats TLS

L'erreur suivante indique une possible incompatibilité de certificat.

```none
# kubectl get pods
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of
"crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

- Vérifiez que le fichier `$HOME/.kube/config` contient un certificat valide, et 
re-générer un certificat si nécessaire. Les certificats dans un fichier kubeconfig 
sont encodés en base64. La commande `base64 --decode` permet de décoder le certificat et la commande `openssl x509 -text -noout` permet d'afficher les informations du certificat.

- Désactivez la variable d’environnement `KUBECONFIG` en utilisant :

  ```sh
  unset KUBECONFIG
  ```

  Ou définissez-la vers l’emplacement par défaut de `KUBECONFIG` :

  ```sh
  export KUBECONFIG=/etc/kubernetes/admin.conf
  ```

- Une autre solution consiste à écraser le `kubeconfig` existant pour l'utilisateur " admin ":

  ```sh
  mv $HOME/.kube $HOME/.kube.bak
  mkdir $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  ```

## Échec de la rotation du certificat client kubelet {#kubelet-client-cert}

Par défaut, kubeadm configure le kubelet avec une rotation automatique des certificats clients en utilisant le lien symbolique `/var/lib/kubelet/pki/kubelet-client-current.pem` défini dans `/etc/kubernetes/kubelet.conf`.

Si ce processus de rotation échoue, vous pouvez voir des erreurs telles que `x509: certificate has expired or is not yet valid` dans les logs du kube-apiserver. Pour corriger ce problème, vous devez suivre les étapes suivantes :

1. Sauvegardez puis supprimez `/etc/kubernetes/kubelet.conf` et `/var/lib/kubelet/pki/kubelet-client*` sur le nœud concerné.
1. Depuis un nœud du plan de contrôle fonctionnel du cluster qui possède `/etc/kubernetes/pki/ca.key`, exécutez :
  `kubeadm kubeconfig user --org system:nodes --client-name system:node:$NODE > kubelet.conf`.
  `$NODE` doit être défini comme le nom du nœud défaillant existant dans le cluster.
Modifiez ensuite manuellement le fichier `kubelet.conf` généré afin d’ajuster le nom du cluster et le point de terminaison du serveur,
ou passez l’option `kubeconfig user --config` (voir [Générer des fichiers kubeconfig pour des utilisateurs supplémentaires](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users)).

Si votre cluster ne dispose pas de `ca.key`, vous devez signer les certificats intégrés dans `kubelet.conf` de manière externe.

1. Copiez ce fichier `kubelet.conf` généré vers `/etc/kubernetes/kubelet.conf` sur le nœud défaillant.
2. Redémarrez le kubelet (`systemctl restart kubelet`) sur le nœud défaillant et attendez que
   `/var/lib/kubelet/pki/kubelet-client-current.pem` soit recréé.
3. Modifiez manuellement `kubelet.conf` pour pointer vers les certificats client kubelet renouvelés, en remplaçant
   `client-certificate-data` et `client-key-data` par :

   ```yaml
   client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
   client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
   ```   

1. Redémarrez le kubelet.
1. Assurez-vous que le nœud passe à l’état `Ready`.

## Interface réseau (NIC) par défaut lors de l’utilisation de flannel comme réseau de pods dans Vagrant

L'erreur suivante peut indiquer que quelque chose n'allait pas dans le réseau de pod:

```sh
Error from server (NotFound): the server could not find the requested resource
```

- Si vous utilisez flannel comme réseau de pod dans Vagrant, vous devrez spécifier le
nom d'interface réseau par défaut pour flannel.

  Vagrant attribue généralement deux interfaces à tous les ordinateurs virtuels. La
première, pour laquel tous les hôtes se voient attribuer l’adresse IP `10.0.2.15`,
est utilisée pour le trafic externe via NAT.

  Cela peut entraîner des problèmes avec Flannel, qui utilise par défaut la première
interface sur un hôte. Cela conduit tous les hôtes à penser qu’ils ont la même adresse IP publique. Pour éviter cela, passez l'option `--iface eth1` sur Flannel pour que la deuxième interface soit choisie.

## IP non publique utilisée pour les conteneurs

Dans certaines situations, les commandes `kubectl logs` et `kubectl run` peuvent
renvoyer les erreurs suivantes dans un cluster par ailleurs fonctionnel:

```console
Error from server: Get https://10.19.0.41:10250/containerLogs/default/mysql-ddc65b868-glc5m/mysql:
dial tcp 10.19.0.41:10250: getsockopt: no route to host
```

- Cela peut être dû au fait que Kubernetes utilise une adresse IP qui ne peut pas communiquer
avec d’autres adresses IP même sous-réseau, éventuellement à cause d'une politique mise en place
par le fournisseur de la machine.
- Digital Ocean attribue une adresse IP publique à `eth0` ainsi qu’une adresse privée à
utiliser en interne comme IP d'ancrage pour leur fonction IP flottante, mais `kubelet` choisira cette
dernière comme `InternalIP` du noeud au lieu du public.

  Utilisez `ip addr show` pour verifier ce scénario au lieu de `ifconfig` car `ifconfig` n'affichera pas
  l'alias de l'adresse IP incriminée. Sinon, une API spécifique à Digital Ocean 
 permet de rechercher l'adresse IP d'ancrage à partir du droplet:

  ```sh
  curl http://169.254.169.254/metadata/v1/interfaces/public/0/anchor_ipv4/address
  ```

  La solution consiste à indiquer à la `kubelet` l'adresse IP à utiliser avec` --node-ip`. Lors de
  l'utilisation de Digital Ocean, il peut être public (assigné à `eth0`) ou privé (assigné à` eth1`)
  si vous voulez utiliser le réseau privé optionnel. la
  [`NodeRegistrationOptions` structure](/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions)
  peut être utilisée pour cela.

  Puis redémarrer `kubelet`:

  ```sh
  systemctl daemon-reload
  systemctl restart kubelet
  ```

## Les pods `coredns` sont en état` CrashLoopBackOff` ou `Error`

Si vous avez des nœuds qui exécutent SELinux avec une version plus ancienne de Docker, vous risquez
de rencontrer un problème ou les pods de `coredns` ne démarrent pas. Pour résoudre ce problème, vous pouvez essayer l'une des options suivantes:

- Mettez à niveau vers une [version plus récente de Docker](/docs/setup/production-environment/container-runtimes/#docker).

- [Désactivez SELinux](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security-enhanced_linux/sect-security-enhanced_linux-enabling_and_disabling_selinux-disabling_selinux).

- Modifiez le déploiement `coredns` pour définir `allowPrivilegeEscalation` sur `true` :

```bash
kubectl -n kube-system get deployment coredns -o yaml | \
  sed 's/allowPrivilegeEscalation: false/allowPrivilegeEscalation: true/g' | \
  kubectl apply -f -
```

une autre raison pour laquelle CoreDNS peut se retrouver dans l'état `CrashLoopBackOff` est lorsqu'un
Pod de CoreDNS déployé dans Kubernetes détecte une boucle. [Un certain nombre de solutions de contournement](https://github.com/coredns/coredns/tree/master/plugin/loop#troubleshooting-loops-in-kubernetes-clusters)
sont disponibles pour éviter que Kubernetes ne tente de redémarrer le pod CoreDNS chaque fois que CoreDNS détecte une boucle et s'arrête.

{{< warning >}}
Désactiver SELinux ou paramètrer `allowPrivilegeEscalation` sur `true` peut compromettre
la sécurité de votre cluster.
{{< /warning >}}

## Les pods etcd redémarrent continuellement

Si vous rencontrez l'erreur suivante:

```
rpc error: code = 2 desc = oci runtime error: exec failed: container_linux.go:247: starting container
process caused "process_linux.go:110: decoding init error from pipe caused \"read parent: connection
reset by peer\""
```

ce problème apparaît si vous exécutez CentOS 7 avec Docker 1.13.1.84.
Cette version de Docker peut empêcher la kubelet de s'exécuter dans le conteneur etcd.

Pour contourner le problème, choisissez l'une de ces options.:

- Revenir à une version antérieure de Docker, telle que la 1.13.1-75:
```
yum downgrade docker-1.13.1-75.git8633870.el7.centos.x86_64 docker-client-1.13.1-75.git8633870.el7.centos.x86_64 docker-common-1.13.1-75.git8633870.el7.centos.x86_64
```

- Installez l'une des versions les plus récentes recommandées, telles que la 18.06:
```bash
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install docker-ce-18.06.1.ce-3.el7.x86_64
```

## Impossible de passer une liste de valeurs séparées par des virgules dans l’argument `--component-extra-args`

Les options de `kubeadm init` telles que `--component-extra-args` permettent de passer des arguments personnalisés à un composant du plan de contrôle, comme le kube-apiserver. Cependant, ce mécanisme est limité en raison du type utilisé pour l’analyse des valeurs (`mapStringString`).

Si vous essayez de passer un argument acceptant plusieurs valeurs séparées par des virgules, comme :

`--apiserver-extra-args "enable-admission-plugins=LimitRanger,NamespaceExists"`

cela échouera avec l’erreur :

`flag: malformed pair, expect string=string`

Cela se produit car la liste d’arguments pour `--apiserver-extra-args` attend des paires `clé=valeur`, et dans ce cas `NamespaceExists` est interprété comme une clé sans valeur.

Vous pouvez également essayer de séparer les paires `clé=valeur` comme ceci :

`--apiserver-extra-args "enable-admission-plugins=LimitRanger,enable-admission-plugins=NamespaceExists"`

mais cela aura pour effet que la clé `enable-admission-plugins` ne conservera que la valeur `NamespaceExists`.

Une solution de contournement connue consiste à utiliser le [fichier de configuration kubeadm](/docs/reference/config-api/kubeadm-config.v1beta4/).

## kube-proxy programmé avant l’initialisation du nœud par le cloud-controller-manager

Dans les scénarios avec fournisseur cloud, kube-proxy peut être programmé sur de nouveaux nœuds worker avant que le cloud-controller-manager n’ait initialisé les adresses du nœud. Cela empêche kube-proxy de récupérer correctement l’adresse IP du nœud et entraîne des effets secondaires sur la gestion du load balancing par le proxy.

L’erreur suivante peut apparaître dans les Pods kube-proxy :

```
server.go:610] Failed to retrieve node IP: host IP unknown; known addresses: []
proxier.go:340] invalid nodeIP, initializing kube-proxy with 127.0.0.1 as nodeIP
```

Une solution connue consiste à patcher le DaemonSet kube-proxy afin de permettre sa planification sur les nœuds du plan de contrôle, indépendamment de leurs conditions, tout en l’empêchant de s’exécuter sur les autres nœuds jusqu’à ce que leurs conditions de protection initiales disparaissent :

```
kubectl -n kube-system patch ds kube-proxy -p='{
  "spec": {
    "template": {
      "spec": {
        "tolerations": [
          {
            "key": "CriticalAddonsOnly",
            "operator": "Exists"
          },
          {
            "effect": "NoSchedule",
            "key": "node-role.kubernetes.io/control-plane"
          }
        ]
      }
    }
  }
}'
```

Le ticket de suivi de ce problème se trouve [ici](https://github.com/kubernetes/kubeadm/issues/1027).

## `/usr` monté en lecture seule sur les nœuds {#usr-mounted-read-only}

Sur des distributions Linux comme Fedora CoreOS ou Flatcar Container Linux, le répertoire `/usr` est monté en système de fichiers en lecture seule.
Pour le [support des flex-volumes](https://github.com/kubernetes/community/blob/ab55d85/contributors/devel/sig-storage/flexvolume.md),
les composants Kubernetes comme le kubelet et le kube-controller-manager utilisent par défaut le chemin
`/usr/libexec/kubernetes/kubelet-plugins/volume/exec/`, mais le répertoire des flex-volumes _doit être accessible en écriture_
pour que la fonctionnalité fonctionne.

{{< note >}}
FlexVolume est déprécié depuis la version Kubernetes v1.23.
{{< /note >}}

Pour contourner ce problème, vous pouvez configurer le répertoire flex-volume via le fichier de configuration kubeadm :

[configuration file](/docs/reference/config-api/kubeadm-config.v1beta4/).

Sur le nœud du plan de contrôle principal (créé avec `kubeadm init`), passez le fichier suivant avec `--config` :

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
controllerManager:
  extraArgs:
  - name: "flex-volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

Sur les nœuds qui rejoignent le cluster :

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

Sinon, vous pouvez modifier `/etc/fstab` pour rendre le montage `/usr` accessible en écriture, mais veuillez noter que cela modifie un principe de conception de la distribution Linux.

## `kubeadm upgrade plan` affiche l’erreur `context deadline exceeded`

Ce message d’erreur apparaît lors de la mise à niveau d’un cluster Kubernetes avec `kubeadm` dans le cas où un etcd externe est utilisé.
Ce n’est pas un bug critique et cela se produit parce que les anciennes versions de kubeadm effectuent une vérification de version sur le cluster etcd externe.
Vous pouvez continuer avec `kubeadm upgrade apply ...`.

Ce problème est corrigé à partir de la version 1.19.

## `kubeadm reset` démonte `/var/lib/kubelet`

Si `/var/lib/kubelet` est monté, l’exécution de `kubeadm reset` le démontera effectivement.

Pour contourner ce problème, remontez le répertoire `/var/lib/kubelet` après avoir exécuté `kubeadm reset`.

Il s’agit d’une régression introduite dans kubeadm 1.15. Le problème est corrigé en version 1.20.

## Impossible d’utiliser metrics-server de manière sécurisée dans un cluster kubeadm

Dans un cluster kubeadm, le [metrics-server](https://github.com/kubernetes-sigs/metrics-server)
peut être utilisé de manière non sécurisée en passant l’option `--kubelet-insecure-tls`. Cela n’est pas recommandé pour les clusters de production.

Si vous souhaitez utiliser TLS entre metrics-server et le kubelet, un problème se pose,
car kubeadm déploie un certificat auto-signé pour le kubelet. Cela peut provoquer les erreurs suivantes du côté de metrics-server :

```
x509: certificate signed by unknown authority
x509: certificate is valid for IP-foo not IP-bar
```

Voir [Activer les certificats de service kubelet signés](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubelet-serving-certs)
pour comprendre comment configurer les kubelets dans un cluster kubeadm afin d’obtenir des certificats de service correctement signés.

Voir également [Comment exécuter metrics-server de manière sécurisée](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md#how-to-run-metrics-server-securely).

## Échec de la mise à niveau dû à un hash etcd qui ne change pas

Applicable uniquement lors de la mise à niveau d’un nœud du plan de contrôle avec un binaire kubeadm v1.28.3 ou ultérieur,
lorsque le nœud est actuellement géré par kubeadm en version v1.28.0, v1.28.1 ou v1.28.2.

Voici le message d’erreur que vous pouvez rencontrer :

```
[upgrade/etcd] Failed to upgrade etcd: couldn't upgrade control plane. kubeadm has tried to recover everything into the earlier state. Errors faced: static Pod hash for component etcd on Node kinder-upgrade-control-plane-1 did not change after 5m0s: timed out waiting for the condition
[upgrade/etcd] Waiting for previous etcd to become available
I0907 10:10:09.109104    3704 etcd.go:588] [etcd] attempting to see if all cluster endpoints ([https://172.17.0.6:2379/ https://172.17.0.4:2379/ https://172.17.0.3:2379/]) are available 1/10
[upgrade/etcd] Etcd was rolled back and is now available
static Pod hash for component etcd on Node kinder-upgrade-control-plane-1 did not change after 5m0s: timed out waiting for the condition
couldn't upgrade control plane. kubeadm has tried to recover everything into the earlier state. Errors faced
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.rollbackOldManifests
	cmd/kubeadm/app/phases/upgrade/staticpods.go:525
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.upgradeComponent
	cmd/kubeadm/app/phases/upgrade/staticpods.go:254
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.performEtcdStaticPodUpgrade
	cmd/kubeadm/app/phases/upgrade/staticpods.go:338
...
```

La raison de cet échec est que les versions concernées génèrent un fichier de manifeste etcd avec des valeurs par défaut non souhaitées dans le PodSpec. Cela entraîne une différence lors de la comparaison du manifeste, et kubeadm s’attend alors à un changement du hash du Pod, mais le kubelet ne met jamais ce hash à jour.

Il existe deux façons de contourner ce problème si vous le rencontrez dans votre cluster :

- La mise à niveau d’etcd peut être ignorée entre les versions affectées et v1.28.3 (ou ultérieure) en utilisant :

  ```shell
  kubeadm upgrade {apply|node} [version] --etcd-upgrade=false
  ```

Cette méthode n’est pas recommandée dans le cas où une nouvelle version d’etcd aurait été introduite par une version corrective ultérieure de v1.28.

- Avant la mise à niveau, corrigez le manifeste du pod statique etcd afin de supprimer les attributs par défaut problématiques :

```patch
  diff --git a/etc/kubernetes/manifests/etcd_defaults.yaml b/etc/kubernetes/manifests/etcd_origin.yaml
  index d807ccbe0aa..46b35f00e15 100644
  --- a/etc/kubernetes/manifests/etcd_defaults.yaml
  +++ b/etc/kubernetes/manifests/etcd_origin.yaml
  @@ -43,7 +43,6 @@ spec:
          scheme: HTTP
        initialDelaySeconds: 10
        periodSeconds: 10
  -      successThreshold: 1
        timeoutSeconds: 15
      name: etcd
      resources:
  @@ -59,26 +58,18 @@ spec:
          scheme: HTTP
        initialDelaySeconds: 10
        periodSeconds: 10
  -      successThreshold: 1
        timeoutSeconds: 15
  -    terminationMessagePath: /dev/termination-log
  -    terminationMessagePolicy: File
      volumeMounts:
      - mountPath: /var/lib/etcd
        name: etcd-data
      - mountPath: /etc/kubernetes/pki/etcd
        name: etcd-certs
  -  dnsPolicy: ClusterFirst
  -  enableServiceLinks: true
    hostNetwork: true
    priority: 2000001000
    priorityClassName: system-node-critical
  -  restartPolicy: Always
  -  schedulerName: default-scheduler
    securityContext:
      seccompProfile:
        type: RuntimeDefault
  -  terminationGracePeriodSeconds: 30
    volumes:
    - hostPath:
        path: /etc/kubernetes/pki/etcd
  ```

Vous trouverez plus d’informations dans le [ticket de suivi](https://github.com/kubernetes/kubeadm/issues/2927) de ce bug.  
