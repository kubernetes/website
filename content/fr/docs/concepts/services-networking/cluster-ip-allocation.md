---
reviewers:
- sftim
- thockin
title: Allocation des ClusterIP des Services
content_type: concept
weight: 120
---


<!-- overview -->

Dans Kubernetes, les [Services](/docs/concepts/services-networking/service/) sont un moyen abstrait
d'exposer une application qui s'exécute sur un ensemble de Pods. Les Services
peuvent disposer d'une adresse IP virtuelle à l'échelle du cluster (avec un Service de `type: ClusterIP`).
Les clients peuvent se connecter à cette adresse IP virtuelle, et Kubernetes répartit alors
le trafic destiné à ce Service entre les différents Pods sous-jacents.

<!-- body -->

## Comment les ClusterIP des Services sont-elles allouées ? {#how-service-clusterips-are-allocated}

Lorsque Kubernetes doit attribuer une adresse IP virtuelle à un Service,
cette attribution se fait de l'une des deux manières suivantes :

_dynamiquement_
: le plan de contrôle du cluster choisit automatiquement une adresse IP libre dans la plage configurée pour les Services de `type: ClusterIP`.

_statiquement_
: vous indiquez l'adresse IP de votre choix, dans la plage configurée pour les Services.

Dans tout le cluster, chaque `ClusterIP` de Service doit être unique.
Tenter de créer un Service avec une `ClusterIP` précise qui a déjà
été allouée renvoie une erreur.

## Pourquoi réserver des ClusterIP des Services ? {#why-do-you-need-to-reserve-service-cluster-ips}

Il peut arriver que vous souhaitiez que des Services soient joignables à des adresses IP bien connues, afin que
d'autres composants et utilisateurs du cluster puissent les utiliser.

Le meilleur exemple est le Service DNS du cluster. Par convention informelle, certains outils d'installation de Kubernetes attribuent la 10e adresse IP
de la plage des Services au Service DNS. Si vous avez configuré votre cluster avec la plage d'adresses IP des Services
10.96.0.0/16 et que vous voulez que l'adresse IP de votre Service DNS soit 10.96.0.10, il vous faudrait créer un Service comme
celui-ci :

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    k8s-app: kube-dns
    kubernetes.io/cluster-service: "true"
    kubernetes.io/name: CoreDNS
  name: kube-dns
  namespace: kube-system
spec:
  clusterIP: 10.96.0.10
  ports:
  - name: dns
    port: 53
    protocol: UDP
    targetPort: 53
  - name: dns-tcp
    port: 53
    protocol: TCP
    targetPort: 53
  selector:
    k8s-app: kube-dns
  type: ClusterIP
```

Mais, comme expliqué précédemment, l'adresse IP 10.96.0.10 n'a pas été réservée.
Si d'autres Services sont créés avec une allocation dynamique avant lui ou en même temps que lui, l'un d'eux risque de se voir attribuer cette adresse IP.
Vous ne pourrez alors pas créer le Service DNS, car sa création échouera avec une erreur de conflit.

## Comment éviter les conflits de ClusterIP des Services ? {#avoid-ClusterIP-conflict}

La stratégie d'allocation mise en œuvre dans Kubernetes pour attribuer des ClusterIP aux Services réduit le
risque de collision.

La plage de `ClusterIP` est divisée selon la formule `min(max(16, cidrSize / 16), 256)`,
que l'on peut décrire ainsi : _jamais moins de 16 ni plus de 256, avec une progression graduelle entre les deux_.

L'attribution dynamique d'adresses IP puise par défaut dans la bande supérieure ; une fois celle-ci épuisée, elle
puise dans la bande inférieure. Les utilisateurs peuvent ainsi recourir à des allocations statiques dans la bande inférieure avec un faible
risque de collision.

## Exemples {#allocation-examples}

### Exemple 1 {#allocation-example-1}

Cet exemple utilise la plage d'adresses IP 10.96.0.0/24 (notation CIDR) pour les adresses IP
des Services.

Taille de la plage : 2<sup>8</sup> - 2 = 254  
Décalage de la bande : `min(max(16, 256/16), 256)` = `min(16, 256)` = 16  
Début de la bande statique : 10.96.0.1  
Fin de la bande statique : 10.96.0.16  
Fin de la plage : 10.96.0.254   

{{< mermaid >}}
pie showData
    title 10.96.0.0/24
    "Statique" : 16
    "Dynamique" : 238
{{< /mermaid >}}

### Exemple 2 {#allocation-example-2}

Cet exemple utilise la plage d'adresses IP 10.96.0.0/20 (notation CIDR) pour les adresses IP
des Services.

Taille de la plage : 2<sup>12</sup> - 2 = 4094  
Décalage de la bande : `min(max(16, 4096/16), 256)` = `min(256, 256)` = 256  
Début de la bande statique : 10.96.0.1  
Fin de la bande statique : 10.96.1.0  
Fin de la plage : 10.96.15.254  

{{< mermaid >}}
pie showData
    title 10.96.0.0/20
    "Statique" : 256
    "Dynamique" : 3838
{{< /mermaid >}}

### Exemple 3 {#allocation-example-3}

Cet exemple utilise la plage d'adresses IP 10.96.0.0/16 (notation CIDR) pour les adresses IP
des Services.

Taille de la plage : 2<sup>16</sup> - 2 = 65534  
Décalage de la bande : `min(max(16, 65536/16), 256)` = `min(4096, 256)` = 256  
Début de la bande statique : 10.96.0.1  
Fin de la bande statique : 10.96.1.0  
Fin de la plage : 10.96.255.254  

{{< mermaid >}}
pie showData
    title 10.96.0.0/16
    "Statique" : 256
    "Dynamique" : 65278
{{< /mermaid >}}

## {{% heading "whatsnext" %}}

* En savoir plus sur la [politique de trafic externe des Services](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* Suivre le tutoriel [Connecter des applications avec des Services](/docs/tutorials/services/connect-applications-service/)
* En savoir plus sur les [Services](/docs/concepts/services-networking/service/)
