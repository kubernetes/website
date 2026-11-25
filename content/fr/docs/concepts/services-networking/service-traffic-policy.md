---
reviewers:
- maplain
title: Politique de trafic interne des Services
content_type: concept
weight: 120
description: >-
  Si deux Pods de votre cluster veulent communiquer et qu'ils s'exécutent effectivement
  tous les deux sur le même nœud, utilisez la _politique de trafic interne des Services_ pour que le
  trafic réseau reste sur ce nœud. Éviter un aller-retour par le réseau du cluster peut
  contribuer à la fiabilité, aux performances (latence et débit réseau) ou à la réduction
  des coûts.
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

La _politique de trafic interne des Services_ (_Service Internal Traffic Policy_)
permet de restreindre le trafic interne afin qu'il ne soit acheminé que vers les
points de terminaison situés sur le nœud d'où provient ce trafic. Le trafic
« interne » désigne ici le trafic émis par les Pods du cluster courant. Cela peut
aider à réduire les coûts et à améliorer les performances.

<!-- body -->

## Utiliser la politique de trafic interne des Services {#using-service-internal-traffic-policy}

Vous pouvez activer la politique de trafic « interne uniquement » pour un
{{< glossary_tooltip text="Service" term_id="service" >}} en définissant son champ
`.spec.internalTrafficPolicy` sur `Local`. Cela indique à kube-proxy de n'utiliser
que les points de terminaison locaux au nœud pour le trafic interne au cluster.

{{< note >}}
Pour les Pods situés sur des nœuds qui n'ont aucun point de terminaison pour un
Service donné, le Service se comporte comme s'il n'avait aucun point de terminaison
(pour les Pods de ce nœud), même s'il en possède bel et bien sur d'autres nœuds.
{{< /note >}}

L'exemple suivant montre un Service dont le champ
`.spec.internalTrafficPolicy` est défini sur `Local` :

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  internalTrafficPolicy: Local
```

## Fonctionnement {#how-it-works}

kube-proxy filtre les points de terminaison vers lesquels il achemine le trafic en
fonction du paramètre `spec.internalTrafficPolicy`. Lorsqu'il vaut `Local`, seuls
les points de terminaison locaux au nœud sont pris en compte. Lorsqu'il vaut
`Cluster` (la valeur par défaut) ou qu'il n'est pas défini, Kubernetes prend en
compte tous les points de terminaison.

## {{% heading "whatsnext" %}}

* En savoir plus sur le [routage tenant compte de la topologie (Topology Aware Routing)](/docs/concepts/services-networking/topology-aware-routing)
* En savoir plus sur la [politique de trafic externe des Services](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)
* Suivre le tutoriel [Connecter des applications avec des Services](/docs/tutorials/services/connect-applications-service/)
