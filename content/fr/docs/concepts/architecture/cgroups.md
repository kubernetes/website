---
title: À propos de cgroup v2
content_type: concept
weight: 50
---

<!-- overview -->

Sur Linux, les {{< glossary_tooltip text="groupes de contrôle" term_id="cgroup" >}}
limitent les ressources allouées aux processus.

Le {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} et le
runtime de conteneur sous-jacent doivent interagir avec les cgroups pour appliquer
[la gestion des ressources pour les pods et les conteneurs](/docs/concepts/configuration/manage-resources-containers/), ce qui
inclut les demandes et les limites de CPU/mémoire pour les charges de travail conteneurisées.

Il existe deux versions de cgroups sur Linux : cgroup v1 et cgroup v2. cgroup v2 est
la nouvelle génération de l'API `cgroup`.

<!-- body -->


## Qu'est-ce que cgroup v2 ? {#cgroup-v2}
{{< feature-state for_k8s_version="v1.25" state="stable" >}}

cgroup v2 est la prochaine version de l'API `cgroup` de Linux. cgroup v2 offre un
système de contrôle unifié avec des capacités de gestion des ressources améliorées.


cgroup v2 propose plusieurs améliorations par rapport à cgroup v1, telles que :

- Conception d'une hiérarchie unifiée unique dans l'API
- Délégation plus sûre des sous-arbres aux conteneurs
- Nouvelles fonctionnalités telles que [Pressure Stall Information](https://www.kernel.org/doc/html/latest/accounting/psi.html)
- Gestion améliorée de l'allocation des ressources et de l'isolation sur plusieurs ressources
  - Comptabilité unifiée pour différents types d'allocations de mémoire (mémoire réseau, mémoire du noyau, etc.)
  - Comptabilité des modifications de ressources non immédiates, telles que les écritures de cache de pages

Certaines fonctionnalités de Kubernetes utilisent exclusivement cgroup v2 pour une 
gestion des ressources et une isolation améliorées. Par exemple, la fonctionnalité
[MemoryQoS](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) améliore la QoS de la mémoire
et repose sur les primitives cgroup v2.


## Utilisation de cgroup v2 {#using-cgroupv2}

La manière recommandée d'utiliser cgroup v2 est d'utiliser une distribution Linux qui
active et utilise cgroup v2 par défaut.

Pour vérifier si votre distribution utilise cgroup v2, consultez [Identifier la version de cgroup sur les nœuds Linux](#check-cgroup-version).

### Exigences

cgroup v2 a les exigences suivantes :

* La distribution OS active cgroup v2
* La version du noyau Linux est 5.8 ou ultérieure
* Le runtime de conteneur prend en charge cgroup v2. Par exemple :
  * [containerd](https://containerd.io/) v1.4 et ultérieur
  * [cri-o](https://cri-o.io/) v1.20 et ultérieur
* Le kubelet et le runtime de conteneur sont configurés pour utiliser le [driver cgroup systemd](/docs/setup/production-environment/container-runtimes#systemd-cgroup-driver)

### Prise en charge de cgroup v2 par les distributions Linux

Pour une liste des distributions Linux qui utilisent cgroup v2, consultez la [documentation cgroup v2](https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md)

<!-- la liste doit être synchronisée avec https://github.com/opencontainers/runc/blob/main/docs/cgroup-v2.md -->
* Container Optimized OS (depuis M97)
* Ubuntu (depuis 21.10, 22.04+ recommandé)
* Debian GNU/Linux (depuis Debian 11 bullseye)
* Fedora (depuis 31)
* Arch Linux (depuis avril 2021)
* RHEL et les distributions similaires à RHEL (depuis 9)

Pour vérifier si votre distribution utilise cgroup v2, consultez la
documentation de votre distribution ou suivez les instructions de [Identifier la version de cgroup sur les nœuds Linux](#check-cgroup-version).

Vous pouvez également activer manuellement cgroup v2 sur votre distribution Linux en modifiant
les arguments de démarrage de la ligne de commande du noyau. Si votre distribution utilise GRUB,
`systemd.unified_cgroup_hierarchy=1` doit être ajouté dans `GRUB_CMDLINE_LINUX`
sous `/etc/default/grub`, suivi de `sudo update-grub`. 
Cependant, l'approche recommandée est d'utiliser une distribution qui active déjà cgroup v2 par
défaut.

### Migration vers cgroup v2 {#migrating-cgroupv2}

Pour migrer vers cgroup v2, assurez-vous de respecter les [exigences](#requirements), puis mettez à jour
vers une version du noyau qui active cgroup v2 par défaut.

Le kubelet détecte automatiquement si le système d'exploitation utilise cgroup v2 et
agit en conséquence, sans nécessiter de configuration supplémentaire.

Il ne devrait pas y avoir de différence perceptible dans l'expérience utilisateur lors du
passage à cgroup v2, sauf si les utilisateurs accèdent directement au système de fichiers cgroup
soit sur le nœud, soit depuis les conteneurs.

cgroup v2 utilise une API différente de cgroup v1, donc si des
applications accèdent directement au système de fichiers cgroup, elles doivent être
mises à jour vers des versions plus récentes qui prennent en charge cgroup v2. Par exemple :

* Certains agents de surveillance et de sécurité tiers peuvent dépendre du système de fichiers cgroup.
 Mettez à jour ces agents vers des versions qui prennent en charge cgroup v2.
* Si vous exécutez [cAdvisor](https://github.com/google/cadvisor) en tant que DaemonSet autonome 
pour surveiller les pods et les conteneurs, mettez-le à jour vers la version 0.43.0 ou ultérieure.
* Si vous déployez des applications Java, préférez utiliser des versions qui prennent en charge pleinement cgroup v2 :
    * [OpenJDK / HotSpot](https://bugs.openjdk.org/browse/JDK-8230305) : jdk8u372, 11.0.16, 15 et ultérieures
    * [IBM Semeru Runtimes](https://www.ibm.com/support/pages/apar/IJ46681) : 8.0.382.0, 11.0.20.0, 17.0.8.0 et ultérieures
    * [IBM Java](https://www.ibm.com/support/pages/apar/IJ46681) : 8.0.8.6 et ultérieures
* Si vous utilisez le package [uber-go/automaxprocs](https://github.com/uber-go/automaxprocs), assurez-vous
  d'utiliser la version v1.5.1 ou supérieure.

## Identifier la version de cgroup sur les nœuds Linux {#check-cgroup-version}

La version de cgroup dépend de la distribution Linux utilisée et de la
version de cgroup par défaut configurée sur le système d'exploitation. Pour vérifier quelle version de cgroup votre
distribution utilise, exécutez la commande `stat -fc %T /sys/fs/cgroup/` sur
le nœud :

```shell
stat -fc %T /sys/fs/cgroup/
```

Pour cgroup v2, la sortie est `cgroup2fs`.

Pour cgroup v1, la sortie est `tmpfs.`

## {{% heading "whatsnext" %}}

- En savoir plus sur [cgroups](https://man7.org/linux/man-pages/man7/cgroups.7.html)
- En savoir plus sur [le runtime de conteneur](/docs/concepts/architecture/cri)
- En savoir plus sur [les drivers cgroup](/docs/setup/production-environment/container-runtimes#cgroup-drivers)
