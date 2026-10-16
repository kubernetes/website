---
title: Protocoles pour les Services
content_type: reference
weight: 10
---

<!-- overview -->
Lorsque vous configurez un {{< glossary_tooltip text="Service" term_id="service" >}},
vous pouvez choisir n'importe quel protocole réseau pris en charge par Kubernetes.

Kubernetes prend en charge les protocoles suivants pour les Services :

- [`SCTP`](#protocol-sctp)
- [`TCP`](#protocol-tcp) _(par défaut)_
- [`UDP`](#protocol-udp)

Lorsque vous définissez un Service, vous pouvez aussi indiquer le
[protocole applicatif](/docs/concepts/services-networking/service/#application-protocol)
qu'il utilise.

Ce document détaille quelques cas particuliers, qui utilisent tous en général
TCP comme protocole de transport :

- [HTTP](#protocol-http-special) et [HTTPS](#protocol-http-special)
- [Protocole PROXY](#protocol-proxy-special)
- Terminaison [TLS](#protocol-tls-special) au niveau de l'équilibreur de charge

<!-- body -->
## Protocoles pris en charge {#protocol-support}

Le champ `protocol` d'un port de Service accepte trois valeurs :

### `SCTP` {#protocol-sctp}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Si vous utilisez un plugin réseau qui prend en charge le trafic SCTP, vous pouvez
utiliser SCTP pour la plupart des Services. Pour les Services de
`type: LoadBalancer`, SCTP n'est utilisable que si le fournisseur de cloud propose
cette fonctionnalité (la plupart ne la proposent pas).

SCTP n'est pas pris en charge sur les nœuds Windows.

#### Prise en charge des associations SCTP multi-adresses (multihoming) {#caveat-sctp-multihomed}

Pour prendre en charge les associations SCTP multi-adresses, le plugin CNI doit
pouvoir attribuer plusieurs interfaces et adresses IP à un Pod.

Le NAT des associations SCTP multi-adresses nécessite une logique spécifique dans
les modules du noyau concernés.

### `TCP` {#protocol-tcp}

Vous pouvez utiliser TCP pour tous les types de Services. C'est le protocole
réseau par défaut.

### `UDP` {#protocol-udp}

Vous pouvez utiliser UDP pour la plupart des Services. Pour les Services de
`type: LoadBalancer`, UDP n'est utilisable que si le fournisseur de cloud propose
cette fonctionnalité.


## Cas particuliers {#special-cases}

### HTTP {#protocol-http-special}

Si votre fournisseur de cloud le permet, vous pouvez utiliser un Service en mode
LoadBalancer pour configurer un équilibreur de charge à l'extérieur de votre
cluster Kubernetes, dans un mode particulier où l'équilibreur de charge du
fournisseur de cloud joue le rôle de proxy inverse HTTP / HTTPS et transmet le
trafic aux points de terminaison backend de ce Service.

Habituellement, vous choisissez `TCP` comme protocole du Service et vous ajoutez une
{{< glossary_tooltip text="annotation" term_id="annotation" >}}
(généralement propre à votre fournisseur de cloud) qui configure l'équilibreur
de charge pour traiter le trafic au niveau HTTP.
Cette configuration peut aussi permettre de servir du HTTPS (HTTP sur TLS) et de
faire office de proxy inverse en HTTP simple vers votre charge de travail.

{{< note >}}
Vous pouvez aussi utiliser un {{< glossary_tooltip term_id="ingress" >}} pour
exposer des Services HTTP/HTTPS.
{{< /note >}}

Il peut aussi être utile d'indiquer que le
[protocole applicatif](/docs/concepts/services-networking/service/#application-protocol)
de la connexion est `http` ou `https`. Utilisez `http` si la session entre
l'équilibreur de charge et votre charge de travail se fait en HTTP sans TLS, et
`https` si elle est chiffrée avec TLS.

### Protocole PROXY {#protocol-proxy-special}

Si votre fournisseur de cloud le permet, vous pouvez utiliser un Service de
`type: LoadBalancer` pour configurer un équilibreur de charge, situé en dehors
de Kubernetes lui-même, qui transmet les connexions encapsulées dans le
[protocole PROXY](https://www.haproxy.org/download/2.5/doc/proxy-protocol.txt).

L'équilibreur de charge envoie alors, en préambule, une série d'octets qui décrit la
connexion entrante, comme dans cet exemple (protocole PROXY v1) :

```
PROXY TCP4 192.0.2.202 10.0.42.7 12345 7\r\n
```

Les données qui suivent ce préambule du protocole PROXY sont les données
d'origine du client. Lorsque l'un des deux côtés ferme la connexion,
l'équilibreur de charge la ferme aussi et envoie, dans la mesure du possible, les
données restantes.

Habituellement, vous définissez un Service avec le protocole `TCP`.
Vous ajoutez aussi une annotation, propre à votre fournisseur de cloud, qui
configure l'équilibreur de charge pour encapsuler chaque connexion entrante dans
le protocole PROXY.

### TLS {#protocol-tls-special}

Si votre fournisseur de cloud le permet, vous pouvez utiliser un Service de
`type: LoadBalancer` pour mettre en place un proxy inverse externe : la
connexion entre le client et l'équilibreur de charge est chiffrée avec TLS, et
c'est l'équilibreur de charge qui joue le rôle de serveur TLS.
La connexion entre l'équilibreur de charge et votre charge de travail peut aussi
être en TLS, ou bien en clair. Les options exactes dont vous disposez dépendent
de votre fournisseur de cloud ou de l'implémentation de Service personnalisée
que vous utilisez.

Habituellement, vous choisissez le protocole `TCP` et vous ajoutez une annotation
(généralement propre à votre fournisseur de cloud) qui configure l'équilibreur
de charge pour qu'il joue le rôle de serveur TLS. L'identité TLS (en tant que
serveur, et éventuellement en tant que client qui se connecte à votre charge de
travail) se configure avec des mécanismes propres à votre fournisseur de cloud.
