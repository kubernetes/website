---
title: Déclarer une politique réseau (NetworkPolicy)
min-kubernetes-server-version: v1.8
content_type: task
weight: 180
---
<!-- aperçu -->
Ce document vous aide à utiliser l'[API NetworkPolicy de Kubernetes](/docs/concepts/services-networking/network-policies/) pour déclarer des politiques réseau qui gouvernent la communication entre les pods.

{{% thirdparty-content %}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Assurez-vous d'avoir configuré un fournisseur de réseau qui supporte les politiques réseau. De nombreux fournisseurs de réseau prennent en charge les NetworkPolicy, notamment :

* [Antrea](/docs/tasks/administer-cluster/network-policy-provider/antrea-network-policy/)
* [Calico](/docs/tasks/administer-cluster/network-policy-provider/calico-network-policy/)
* [Cilium](/docs/tasks/administer-cluster/network-policy-provider/cilium-network-policy/)
* [Kube-router](/docs/tasks/administer-cluster/network-policy-provider/kube-router-network-policy/)
* [Romana](/docs/tasks/administer-cluster/network-policy-provider/romana-network-policy/)
* [Weave Net](/docs/tasks/administer-cluster/network-policy-provider/weave-network-policy/)

<!-- steps -->

## Créer un Deployment `nginx` et l'exposer via un Service

Pour comprendre comment fonctionne les politiques réseau dans Kubernetes, commencez par créer un déploiement `nginx`.

```console
kubectl create deployment nginx --image=nginx
```
```none
deployment.apps/nginx created
```

Exposez le déploiement via un service appelé `nginx`.

```console
kubectl expose deployment nginx --port=80
```

```none
service/nginx exposed
```

Les commandes ci-dessus créent un déploiement avec un Pod nginx et exposent le déploiement via un service nommé `nginx`. Le Pod et le Deployment `nginx` se trouvent dans le namespace `default`.

```console
kubectl get svc,pod
```

```none
NAME                        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
service/kubernetes          10.100.0.1    <none>        443/TCP    46m
service/nginx               10.100.0.16   <none>        80/TCP     33s

NAME                        READY         STATUS        RESTARTS   AGE
pod/nginx-701339712-e0qfq   1/1           Running       0          35s
```

## Tester le Service en y accédant depuis un autre Pod

Vous devriez pouvoir accéder au nouveau service `nginx` depuis d'autres pods. Pour accéder au service `nginx` depuis un autre pod dans le namespace `default`, démarrez un conteneur busybox :

```console
kubectl run busybox --rm -ti --image=busybox:1.28 -- /bin/sh
```

Dans votre shell, exécutez la commande suivante :

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
remote file exists
```

## Limiter l'accès au Service `nginx`

Pour limiter l'accès au service `nginx` afin que seuls les pods avec le label `access: true` puissent le consulter, créez un objet NetworkPolicy comme suit :

{{% code_sample file="service/networking/nginx-policy.yaml" %}}

Le nom d'un objet NetworkPolicy doit être un [nom de sous-domaine DNS valide](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

{{< note >}}
Les NetworkPolicy incluent un `podSelector` qui sélectionne le regroupement de pods auxquels la politique s'applique. Vous pouvez voir que cette politique sélectionne les pods avec le label `app=nginx`. Ce label a été ajouté automatiquement au pod dans le déploiement `nginx`. Un `podSelector` vide sélectionne tous les pods dans le namespace.
{{< /note >}}

## Affecter la politique au Service

Utilisez kubectl pour créer une NetworkPolicy à partir du fichier `nginx-policy.yaml` ci-dessus :

```console
kubectl apply -f https://k8s.io/examples/service/networking/nginx-policy.yaml
```

```none
networkpolicy.networking.k8s.io/access-nginx created
```

## Tester l'accès au Service lorsque le label d'accès n'est pas défini
Lorsque vous tentez d'accéder au service `nginx` depuis un pod sans les bons labels, la requête échoue :

```console
kubectl run busybox --rm -ti --image=busybox:1.28 -- /bin/sh
```

Dans votre shell, exécutez la commande :

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
wget: download timed out
```

## Définir le label d'accès et tester à nouveau

Vous pouvez créer un pod avec le bon label pour voir que la requête est autorisée :

```console
kubectl run busybox --rm -ti --labels="access=true" --image=busybox:1.28 -- /bin/sh
```

Dans votre shell, exécutez la commande :

```shell
wget --spider --timeout=1 nginx
```

```none
Connecting to nginx (10.100.0.16:80)
remote file exists
```


