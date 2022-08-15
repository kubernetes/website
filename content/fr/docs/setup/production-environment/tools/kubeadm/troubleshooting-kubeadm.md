---
title: Dépanner kubeadm
description: Diagnostic pannes kubeadm debug
content_type: concept
weight: 90
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

## `ebtables` ou un exécutable similaire introuvable lors de l'installation

Si vous voyez les warnings suivants lors de l'exécution `kubeadm init`

```sh
[preflight] WARNING: ebtables not found in system path
[preflight] WARNING: ethtool not found in system path
```

Ensuite, il peut vous manquer `ebtables`, `ethtool` ou un exécutable similaire sur votre nœud. Vous
pouvez l'installer avec les commandes suivantes:

- For Ubuntu/Debian users, run `apt install ebtables ethtool`.
- For CentOS/Fedora users, run `yum install ebtables ethtool`.

## kubeadm reste bloqué en attente du control plane pendant l'installation

Si vous remarquez que `kubeadm init` se bloque après la ligne suivante:

```sh
[apiclient] Created API client, waiting for the control plane to become ready
```

Cela peut être causé par un certain nombre de problèmes. Les plus communs sont:

- problèmes de connexion réseau. Vérifiez que votre machine dispose d'une connectivité réseau
complète avant de continuer.
- la configuration du driver cgroup par défaut pour la kubelet diffère de celle utilisée par Docker.
  Vérifiez le fichier journal du système (par exemple, `/var/log/message`) ou examinez le résultat
de `journalctl -u kubelet`. Si vous voyez quelque chose comme ce qui suit:

  ```shell
  error: failed to run Kubelet: failed to create kubelet:
  misconfiguration: kubelet cgroup driver: "systemd" is different from docker cgroup driver: "cgroupfs"
  ```

  Il existe deux méthodes courantes pour résoudre le problème du driver cgroup:

 1. Installez à nouveau Docker en suivant les instructions
  [ici](/fr/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-docker).
 1. Changez manuellement la configuration de la kubelet pour correspondre au driver Docker cgroup, vous pouvez vous référer à
    [Configurez le driver de cgroupe utilisé par la kubelet sur le Nœud Master](/fr/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#configure-cgroup-driver-used-by-kubelet-on-master-node)
    pour des instruction détaillées.

- Les conteneurs Docker du control plane sont en crashloop ou suspendus. Vous pouvez le vérifier en lançant `docker ps` et étudier chaque conteneur en exécutant `docker logs`.

## kubeadm bloque lors de la suppression de conteneurs gérés

Les événements suivants peuvent se produire si Docker s'arrête et ne supprime pas les conteneurs gérés
par Kubernetes:

```bash
sudo kubeadm reset
[preflight] Running pre-flight checks
[reset] Stopping the kubelet service
[reset] Unmounting mounted directories in "/var/lib/kubelet"
[reset] Removing kubernetes-managed containers
(block)
```

Une solution possible consiste à redémarrer le service Docker, puis à réexécuter `kubeadm reset`:

```bash
sudo systemctl restart docker.service
sudo kubeadm reset
```

L'inspection des journaux de Docker peut également être utile:

```sh
journalctl -ul docker
```

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
- Si vous installez une version de Docker antérieure à 1.12.1, supprimez l'option `MountFlags = slave`
  lors du démarrage de `dockerd` avec `systemd` et redémarrez `docker`. Vous pouvez voir les options
de montage dans `/usr/lib/systemd/system/docker.service`.
  Les options de montage peuvent interférer avec les volumes montés par Kubernetes et mettre les
  pods dans l'état `CrashLoopBackOff`. L'erreur se produit lorsque Kubernetes ne trouve pas les fichiers
`var/run/secrets/kubernetes.io/serviceaccount`.

## `coredns` (ou `kube-dns`) est bloqué dans l'état `Pending`

Ceci est **prévu** et fait partie du design. kubeadm est agnostique vis-à-vis du fournisseur
de réseau, ainsi l'administrateur devrait [installer la solution réseau pod](/docs/concepts/cluster-administration/addons/)
de choix. Vous devez installer un réseau de pods avant que CoreDNS ne soit complètement déployé.
D'où l' état `Pending` avant la mise en place du réseau.

## Les services `HostPort` ne fonctionnent pas

Les fonctionnalités `HostPort` et `HostIP` sont disponibles en fonction de votre fournisseur
de réseau de pod. Veuillez contacter l’auteur de la solution de réseau de Pod pour savoir si
Les fonctionnalités `HostPort` et `HostIP` sont disponibles.

Les fournisseurs de CNI Calico, Canal, et Flannel supportent HostPort.

Pour plus d'informations, voir la [CNI portmap documentation](https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md).

Si votre fournisseur de réseau ne prend pas en charge le plug-in portmap CNI, vous devrez peut-être utiliser le
[NodePort feature of services](/docs/concepts/services-networking/service/#nodeport) ou utiliser `HostNetwork=true`.

## Les pods ne sont pas accessibles via leur IP de service

- De nombreux add-ons réseau ne permettent pas encore
[hairpin mode](/docs/tasks/debug-application-cluster/debug-service/#a-pod-cannot-reach-itself-via-service-ip)
  qui permet aux pods d’accéder à eux-mêmes via leur IP de service. Ceci est un problème lié
  au [CNI](https://github.com/containernetworking/cni/issues/476). S'il vous plaît contacter
  le fournisseur d'add-on réseau afin d'obtenir des informations en matière de prise en charge du mode hairpin.

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
sont encodés en base64. La commande `base64 -d` peut être utilisée pour décoder le certificat 
et `openssl x509 -text -noout` peut être utilisé pour afficher les informations du certificat.
- Une autre solution consiste à écraser le `kubeconfig` existant pour l'utilisateur" admin ":

  ```sh
  mv  $HOME/.kube $HOME/.kube.bak
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  ```

## Carte réseau par défaut lors de l'utilisation de flannel comme réseau de pod dans Vagrant

L'erreur suivante peut indiquer que quelque chose n'allait pas dans le réseau de pod:

```sh
Error from server (NotFound): the server could not find the requested resource
```

- Si vous utilisez flannel comme réseau de pod dans Vagrant, vous devrez spécifier le
nom d'interface par défaut pour flannel.

  Vagrant attribue généralement deux interfaces à tous les ordinateurs virtuels. La
première, pour laquel tous les hôtes se voient attribuer l’adresse IP `10.0.2.15`,
est pour le trafic externe qui est NATé.

  Cela peut entraîner des problèmes avec Flannel, qui utilise par défaut la première
interface sur un hôte. Ceci conduit au fait que tous les hôtes pensent qu'ils ont la
même adresse IP publique. Pour éviter cela, passez l'option `--iface eth1` sur Flannel
pour que la deuxième interface soit choisie.

## IP non publique utilisée pour les conteneurs

Dans certaines situations, les commandes `kubectl logs` et `kubectl run` peuvent
renvoyer les erreurs suivantes dans un cluster par ailleurs fonctionnel:

```sh
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
  [la section `KubeletExtraArgs` de kubeadm `NodeRegistrationOptions` structure](https://github.com/kubernetes/kubernetes/blob/release-1.13/cmd/kubeadm/app/apis/kubeadm/v1beta1/types.go) peut être utilisé pour cela.

  Puis redémarrer la `kubelet`:

  ```sh
  systemctl daemon-reload
  systemctl restart kubelet
  ```

## Les pods `coredns` sont en état` CrashLoopBackOff` ou `Error`

Si vous avez des nœuds qui exécutent SELinux avec une version plus ancienne de Docker, vous risquez
de rencontrer un problème ou les pods de `coredns` ne démarrent pas. Pour résoudre ce problème, vous pouvez essayer l'une des options suivantes:

- Mise à niveau vers une [nouvelle version de Docker](/fr/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-docker).
- [Désactiver SELinux](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security-enhanced_linux/sect-security-enhanced_linux-enabling_and_disabling_selinux-disabling_selinux).
- Modifiez le déploiement de `coredns` pour définir` allowPrivilegeEscalation` à `true`:

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


