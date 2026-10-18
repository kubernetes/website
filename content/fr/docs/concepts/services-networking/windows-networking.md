---
title: Réseau sous Windows
content_type: concept
weight: 110
---

<!-- overview -->

Kubernetes prend en charge les nœuds Linux comme les nœuds Windows, et vous pouvez mélanger
les deux dans un même cluster.
Cette page donne une vue d'ensemble des aspects réseau propres au système d'exploitation Windows.

<!-- body -->
## Le réseau des conteneurs sous Windows {#networking}

Le réseau des conteneurs Windows est fourni par des
[plugins CNI](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/).
Côté réseau, les conteneurs Windows se comportent comme des machines virtuelles.
Chaque conteneur a une carte réseau virtuelle (vNIC), reliée
à un commutateur virtuel Hyper-V (vSwitch). Le Host Networking Service (HNS) et le
Host Compute Service (HCS) collaborent pour créer les conteneurs et rattacher
leurs vNIC aux réseaux. HCS gère les conteneurs, tandis que HNS
gère les ressources réseau, comme :

* les réseaux virtuels (y compris la création des vSwitch) ;
* les points de terminaison (ou vNIC) ;
* les namespaces ;
* les politiques, notamment l'encapsulation des paquets, les règles d'équilibrage de charge, les ACL et les règles de NAT.

Le HNS et le vSwitch de Windows mettent en œuvre l'isolation par namespaces et peuvent
créer des cartes réseau virtuelles selon les besoins d'un pod ou d'un conteneur. En revanche, une grande partie
de la configuration, comme le DNS, les routes et les métriques, est stockée dans la base de registre Windows, et non
dans des fichiers sous `/etc`, comme c'est le cas sous Linux. La base de registre du conteneur
est distincte de celle de l'hôte : des pratiques comme monter le fichier `/etc/resolv.conf` de
l'hôte dans un conteneur n'ont donc pas le même effet que sous Linux. Ces réglages doivent
être faits avec les API Windows, exécutées dans le contexte du conteneur. C'est pourquoi
les implémentations CNI doivent appeler le HNS pour transmettre les informations réseau au pod ou au conteneur,
au lieu de s'appuyer sur des montages de fichiers.

## Modes réseau {#network-modes}

Windows prend en charge cinq pilotes (ou modes) réseau différents : L2bridge, L2tunnel,
Overlay (bêta), Transparent et NAT. Dans un cluster hétérogène comportant des nœuds de travail Windows et Linux,
vous devez choisir une solution réseau compatible avec
Windows et Linux. Le tableau suivant liste les plugins externes (out-of-tree) pris en charge sous Windows,
et indique quand utiliser chaque plugin CNI :

| Pilote réseau | Description | Modifications des paquets des conteneurs | Plugins réseau | Caractéristiques des plugins réseau |
| -------------- | ----------- | ------------------------------ | --------------- | ------------------------------ |
| L2bridge       | Les conteneurs sont reliés à un vSwitch externe. Ils sont rattachés au réseau sous-jacent (underlay), mais le réseau physique n'a pas besoin de connaître leurs adresses MAC, car elles sont réécrites en entrée et en sortie. | L'adresse MAC est remplacée par celle de l'hôte ; l'adresse IP peut l'être aussi via la politique HNS OutboundNAT. | [win-bridge](https://www.cni.dev/plugins/current/main/win-bridge/), [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md), [Flannel host-gateway](https://github.com/flannel-io/flannel/blob/master/Documentation/backends.md#host-gw) (qui utilise win-bridge) | win-bridge utilise le mode réseau L2bridge et relie les conteneurs au réseau sous-jacent des hôtes, ce qui offre les meilleures performances. Nécessite des routes définies par l'utilisateur (UDR) pour la connectivité entre nœuds. |
| L2Tunnel | Cas particulier de l2bridge, utilisé uniquement sur Azure. Tous les paquets sont envoyés à l'hôte de virtualisation, où la politique SDN est appliquée. | L'adresse MAC est réécrite, l'adresse IP est visible sur le réseau sous-jacent. | [Azure-CNI](https://github.com/Azure/azure-container-networking/blob/master/docs/cni.md) | Azure-CNI intègre les conteneurs au vNET Azure et leur permet d'utiliser les [fonctionnalités d'Azure Virtual Network](https://azure.microsoft.com/en-us/services/virtual-network/). Ils peuvent par exemple se connecter de façon sécurisée aux services Azure ou utiliser les NSG Azure. Consultez [quelques exemples avec azure-cni](https://docs.microsoft.com/azure/aks/concepts-network#azure-cni-advanced-networking). |
| Overlay | Chaque conteneur reçoit une vNIC reliée à un vSwitch externe. Chaque réseau overlay a son propre sous-réseau IP, défini par un préfixe IP personnalisé. Le pilote réseau overlay utilise l'encapsulation VXLAN. | Les paquets sont encapsulés avec un en-tête externe. | [win-overlay](https://www.cni.dev/plugins/current/main/win-overlay/), [Flannel VXLAN](https://github.com/flannel-io/flannel/blob/master/Documentation/backends.md#vxlan) (qui utilise win-overlay) | win-overlay est à utiliser lorsque l'on souhaite isoler les réseaux virtuels des conteneurs du réseau sous-jacent des hôtes (par exemple pour des raisons de sécurité). Permet de réutiliser les mêmes adresses IP dans différents réseaux overlay (qui ont des étiquettes VNID différentes) si vous disposez de peu d'adresses IP dans votre datacenter. Cette option nécessite la mise à jour [KB4489899](https://support.microsoft.com/help/4489899) sur Windows Server 2019. |
| Transparent (cas d'usage particulier pour [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes)) | Nécessite un vSwitch externe. Les conteneurs sont reliés à un vSwitch externe qui permet la communication intra-pod via des réseaux logiques (commutateurs et routeurs logiques). | Les paquets sont encapsulés dans un tunnel [GENEVE](https://datatracker.ietf.org/doc/draft-gross-geneve/) ou [STT](https://datatracker.ietf.org/doc/draft-davie-stt/) pour joindre les pods qui ne sont pas sur le même hôte. <br/> Les paquets sont transmis ou rejetés selon les métadonnées de tunnel fournies par le contrôleur réseau OVN. <br/> Le NAT est appliqué pour la communication nord-sud. | [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes) | [Déploiement avec Ansible](https://github.com/openvswitch/ovn-kubernetes/tree/master/contrib). Des ACL distribuées peuvent être appliquées via les politiques Kubernetes. Prise en charge de l'IPAM. L'équilibrage de charge est possible sans kube-proxy. Le NAT se fait sans iptables ni netsh. |
| NAT (*non utilisé dans Kubernetes*) | Chaque conteneur reçoit une vNIC reliée à un vSwitch interne. Le DNS et le DHCP sont fournis par un composant interne appelé [WinNAT](https://techcommunity.microsoft.com/t5/virtualization/windows-nat-winnat-capabilities-and-limitations/ba-p/382303). | Les adresses MAC et IP sont remplacées par celles de l'hôte. | [nat](https://github.com/Microsoft/windows-container-networking/tree/master/plugins/nat) | Mentionné ici par souci d'exhaustivité. |

Comme indiqué ci-dessus, le [plugin CNI](https://github.com/flannel-io/cni-plugin)
de [Flannel](https://github.com/coreos/flannel)
est aussi [pris en charge](https://github.com/flannel-io/cni-plugin#windows-support-experimental) sous Windows, avec le
[backend réseau VXLAN](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan) (**prise en charge bêta**, délègue à win-overlay)
et le [backend réseau host-gateway](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#host-gw) (prise en charge stable, délègue à win-bridge).

Ce plugin peut déléguer à l'un des plugins CNI de référence (win-overlay,
win-bridge) afin de fonctionner avec le démon Flannel sous Windows (Flanneld), qui
attribue automatiquement un bail de sous-réseau à chaque nœud et crée le réseau HNS. Le plugin lit
son propre fichier de configuration (cni.conf) et le complète avec les variables
d'environnement du fichier subnet.env généré par FlannelD. Il confie ensuite la mise en place
du réseau à l'un des plugins CNI de référence, et transmet au plugin IPAM (par exemple `host-local`)
la configuration adéquate, qui contient le sous-réseau attribué au nœud.

Pour les objets Node, Pod et Service, les flux réseau suivants sont pris en charge pour
le trafic TCP/UDP :

* Pod → Pod (IP)
* Pod → Pod (nom)
* Pod → Service (adresse IP de cluster)
* Pod → Service (PQDN, uniquement s'il ne contient pas de « . »)
* Pod → Service (FQDN)
* Pod → externe (IP)
* Pod → externe (DNS)
* Nœud → Pod
* Pod → Nœud

## Gestion des adresses IP (IPAM) {#ipam}

Les options d'IPAM suivantes sont prises en charge sous Windows :

* [host-local](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/host-local)
* [azure-vnet-ipam](https://github.com/Azure/azure-container-networking/blob/master/docs/ipam.md) (pour azure-cni uniquement)
* [IPAM de Windows Server](https://docs.microsoft.com/windows-server/networking/technologies/ipam/ipam-top) (solution de repli si aucun IPAM n'est défini)

## Direct Server Return (DSR) {#dsr}

{{< feature-state feature_gate_name="WinDSR" >}}

Mode d'équilibrage de charge dans lequel la correction des adresses IP et le LBNAT se font directement sur le port vSwitch du conteneur :
le trafic du Service arrive avec l'adresse IP du pod d'origine comme adresse source.
Cela améliore les performances : les réponses, qui repasseraient normalement par l'équilibreur de charge,
peuvent le contourner et aller directement au client.
La charge de l'équilibreur diminue, et la latence globale aussi.
Pour en savoir plus, lisez
[Direct Server Return (DSR) in a nutshell](https://techcommunity.microsoft.com/blog/networkingblog/direct-server-return-dsr-in-a-nutshell/693710).

## Équilibrage de charge et Services {#load-balancing-and-services}

Un {{< glossary_tooltip text="Service" term_id="service" >}} Kubernetes est une abstraction
qui définit un ensemble logique de Pods et un moyen d'y accéder sur le réseau.
Dans un cluster qui comprend des nœuds Windows, vous pouvez utiliser les types de Service suivants :

* `NodePort`
* `ClusterIP`
* `LoadBalancer`
* `ExternalName`

Le réseau des conteneurs Windows diffère du réseau Linux sur plusieurs points importants.
La [documentation Microsoft sur le réseau des conteneurs Windows](https://docs.microsoft.com/en-us/virtualization/windowscontainers/container-networking/architecture)
donne plus de détails et de contexte.

Sous Windows, vous pouvez utiliser les réglages suivants pour configurer les Services et le comportement
de l'équilibrage de charge :

{{< table caption="Réglages des Services sous Windows" >}}
| Fonctionnalité | Description | Version minimale de Windows prise en charge | Comment l'activer |
| ------- | ----------- | -------------------------- | ------------- |
| Affinité de session | Garantit que les connexions d'un client donné sont toujours transmises au même Pod. | Windows Server 2022 | Donnez à `service.spec.sessionAffinity` la valeur `ClientIP` |
| Direct Server Return (DSR) | Voir la section [DSR](#dsr) ci-dessus. | Windows Server 2019 | Ajoutez l'argument de ligne de commande suivant (pour la version {{< skew currentVersion >}}) : ` --enable-dsr=true` |
| Preserve-Destination | N'applique pas de DNAT au trafic du Service, ce qui préserve l'adresse IP virtuelle du Service cible dans les paquets qui arrivent au Pod backend. Désactive aussi le transfert entre nœuds. | Windows Server, version 1903 | Ajoutez `"preserve-destination": "true"` dans les annotations du Service et activez DSR dans kube-proxy. |
| Réseau en double pile IPv4/IPv6 | Communications natives IPv4 vers IPv4, en parallèle des communications IPv6 vers IPv6, vers le cluster, depuis le cluster et au sein du cluster | Windows Server 2019 | Consultez [Double pile IPv4/IPv6](/docs/concepts/services-networking/dual-stack/#windows-support) |
| Préservation de l'adresse IP du client | Garantit que l'adresse IP source du trafic entrant est préservée. Désactive aussi le transfert entre nœuds. |  Windows Server 2019  | Donnez à `service.spec.externalTrafficPolicy` la valeur `Local` et activez DSR dans kube-proxy |
{{< /table >}}

## Limites {#limitations}

Les fonctionnalités réseau suivantes ne sont _pas_ prises en charge sur les nœuds Windows :

* le mode réseau de l'hôte (host networking) ;
* l'accès local à un NodePort depuis le nœud lui-même (cela fonctionne depuis d'autres nœuds ou des clients externes) ;
* plus de 64 pods backend (ou adresses de destination distinctes) pour un même Service ;
* la communication IPv6 entre pods Windows connectés à des réseaux overlay ;
* la politique de trafic Local hors mode DSR ;
* les communications sortantes en ICMP via les plugins `win-overlay` ou `win-bridge`, ou via le plugin Azure-CNI.
  Plus précisément, le plan de données de Windows ([VFP](https://www.microsoft.com/research/project/azure-virtual-filtering-platform/))
  ne prend pas en charge la transposition des paquets ICMP. Concrètement :
  * les paquets ICMP destinés au même réseau (par exemple un ping d'un pod à un autre)
    fonctionnent normalement ;
  * les paquets TCP/UDP fonctionnent normalement ;
  * les paquets ICMP qui doivent traverser un réseau distant (par exemple un ping d'un pod vers Internet)
    ne peuvent pas être transposés : ils ne sont donc pas réacheminés vers leur source ;
  * comme les paquets TCP/UDP peuvent, eux, être transposés, vous pouvez remplacer `ping <destination>` par
    `curl <destination>` pour diagnostiquer la connectivité avec l'extérieur.

Autres limites :

* Les plugins réseau de référence de Windows, win-bridge et win-overlay, ne mettent pas en œuvre
  la [spécification CNI](https://github.com/containernetworking/cni/blob/master/SPEC.md) v0.4.0,
  car l'opération `CHECK` n'y est pas implémentée.
* Le plugin CNI Flannel VXLAN a les limites suivantes sous Windows :
  * La connectivité nœud-pod n'est possible qu'avec les pods locaux, à partir de Flannel v0.12.0.
  * Flannel est limité au VNI 4096 et au port UDP 4789. Consultez la documentation officielle
    du backend [Flannel VXLAN](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)
    pour plus de détails sur ces paramètres.
