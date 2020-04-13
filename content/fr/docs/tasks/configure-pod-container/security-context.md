---
title: Configurer un contexte de sécurité pour un pod ou un conteneur
content_template: templates/task
weight: 80
---

{{% capture overview %}}

Un contexte de sécurité permet de définir les paramètres de privilège et de contrôle d'accès pour un pod ou un conteneur.

Les paramètres du contexte de sécurité comprennent :

* Contrôle d'accès discrétionnaire : L'autorisation d'accéder à un objet, par exemple un fichier, est basée sur
[l'ID de l'utilisateur (UID) et l'ID d'un groupe (GID)](https://wiki.archlinux.org/index.php/users_and_groups).

* [Security Enhanced Linux (SELinux)](https://en.wikipedia.org/wiki/Security-Enhanced_Linux): En attribuant des labels de sécurité aux objets.

* L'exécution en tant que privilégiée ou non privilégiée.

* [Linux Capabilities](https://linux-audit.com/linux-capabilities-hardening-linux-binaries-by-removing-setuid/): Donner à un processus certains privilèges, mais pas tous les privilèges de l'utilisateur root.

* [AppArmor](/docs/tutorials/clusters/apparmor/): Utiliser des profils pour restreindre les capacités des programmes.

* [Seccomp](https://en.wikipedia.org/wiki/Seccomp): Filtrer les appels système d'un processus.

* AllowPrivilegeEscalation: Contrôle si un processus peut obtenir plus de privilèges que son processus parent. Ce booléen détermine directement si le flag [`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt) est activé sur le processus du conteneur. AllowPrivilegeEscalation est toujours actif lorsque le conteneur est : 1) exécuté comme privilégié ou 2) possède l'autorisation `CAP_SYS_ADMIN`.

Pour plus d'informations sur les mécanismes de sécurité sur Linux, voir
[Aperçu des caractéristiques de sécurité du noyau Linux](https://www.linux.com/learn/overview-linux-kernel-security-features)

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Définir le contexte de sécurité pour un pod

Pour spécifier les paramètres de sécurité d'un pod, incluez le champ `securityContext` dans la spécification du pod. Le champ `securityContext` est un objet de [PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core).
Les paramètres de sécurité que vous spécifiez pour un pod s'appliquent pour tous les conteneurs dans le pod.
Voici un fichier de configuration pour un pod qui comporte un `securityContext` et un volume `emptyDir`:

{{< codenew file="pods/security/security-context.yaml" >}}

Dans le fichier de configuration, le champ `runAsUser` précise que pour tout conteneur dans le pod, tous les processus fonctionnent avec l'ID utilisateur 1000. Le champ `runAsGroup` spécifie l'ID de groupe primaire 3000 pour tous les processus dans tous les conteneurs du pod.
Si ce champ est ignoré, l'ID de groupe primaire des conteneurs sera root(0). Tout fichier créé sera également la propriété de l'utilisateur 1000 et du groupe 3000 quand `runAsGroup` est spécifié. 
Puisque le champ `fsGroup` est spécifié, tous les processus du conteneur font également partie de l'ID de groupe supplémentaire 2000. 
Le propriétaire du volume `/data/demo` et de tous les fichiers créés dans ce volume sera le groupe ID 2000.

Créez le pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context.yaml
```

Vérifiez que le conteneur du pod fonctionne :

```shell
kubectl get pod security-context-demo
```

Ouvrez un shell dans le conteneur en cours d'utilisation :

```shell
kubectl exec -it security-context-demo -- sh
```

Dans votre shell, listez les processus en cours :

```shell
ps
```

Le résultat montre que les processus fonctionnent en tant qu'utilisateur 1000, ce qui correspond à la valeur du champ `runAsUser`:

```shell
PID   USER     TIME  COMMAND
    1 1000      0:00 sleep 1h
    6 1000      0:00 sh
...
```

Dans votre shell, naviguez jusqu'à `/data`, et listez le répertoire :

```shell
cd /data
ls -l
```

Le résultat montre que le répertoire `/data/demo` a l'ID de groupe 2000, qui est la valeur du champ `fsGroup`.

```shell
drwxrwsrwx 2 root 2000 4096 Jun  6 20:08 demo
```

Dans votre shell, naviguez vers `/data/demo`, et créez un fichier :

```shell
cd demo
echo hello > testfile
```

Lister le fichier dans le répertoire `/data/demo` :

```shell
ls -l
```

Le résultat montre que le fichier `testfile` a l'ID de groupe 2000, qui est la valeur du champ `fsGroup`.

```shell
-rw-r--r-- 1 1000 2000 6 Jun  6 20:08 testfile
```

Exécutez la commande suivante :

```shell
$ id
uid=1000 gid=3000 groups=2000
```
Vous verrez que le gid est de 3000, ce qui correspond au champ `runAsGroup`. Si le champ `runAsGroup` était ignoré, le gid resterait à 0(root) et le processus serait capable d'interagir avec des fichiers qui appartiennent au groupe root(0) et qui ont les permissions de groupe requises pour le groupe root(0).

Sortez du shell :

```shell
exit
```

## Configurer les autorisations de volume et la politique de changement de propriétaire pour les pods

{{< feature-state for_k8s_version="v1.18" state="alpha" >}}

Par défaut, Kubernetes change récursivement la propriété et les autorisations pour le contenu de chaque volume afin de correspondre au champ `fsGroup` spécifié dans le `securityContext` d'un pod lorsque ce volume est monté.
Pour de gros volumes, la vérification et le changement de propriété et d'autorisations peuvent prendre beaucoup de temps, ce qui ralentit le démarrage du pod. Vous pouvez utiliser donc le champ `fsGroupChangePolicy` dans `securityContext` pour contrôler la façon dont Kubernetes vérifie et gère la propriété et les autorisations pour un volume.

**fsGroupChangePolicy** -  `fsGroupChangePolicy` définit le comportement à adopter pour changer la propriété et l'autorisation du volume avant d'être exposé à l'intérieur du pod. Ce champ ne s'applique qu'aux types de volumes qui supportent `fsGroup` pour propriété et autorisations contrôlées. Ce champ a deux valeurs possibles :

* _OnRootMismatch_: Modifier les permissions et la propriété uniquement si les permissions et la propriété du répertoire racine ne correspondent pas aux permissions attendues du volume. Cela pourrait aider à réduire le temps nécessaire pour changer la propriété et les autorisations d'un volume.
* _Always_: Changez toujours les permissions et la propriété du volume lorsque le volume est monté.

Par exemple:

```yaml
securityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: "OnRootMismatch"
```

Ceci est une caractéristique alpha. Pour l'utiliser, activez la [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `ConfigurableFSGroupPolicy` pour le kube-api-server, le kube-controller-manager, et le kubelet.

{{< note >}}
Ce champ n'a aucun effet sur les types de volumes éphémères tels que
[`secret`](https://kubernetes.io/docs/concepts/storage/volumes/#secret),
[`configMap`](https://kubernetes.io/docs/concepts/storage/volumes/#configmap),
and [`emptydir`](https://kubernetes.io/docs/concepts/storage/volumes/#emptydir).
{{< /note >}}


## Définir le contexte de sécurité d'un conteneur

Pour spécifier les paramètres de sécurité d'un conteneur, incluez le champ `securityContext` dans le manifeste du conteneur.
Le champ `securityContext` est un objet de [SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core).
Les paramètres de sécurité que vous spécifiez pour un conteneur s'appliquent uniquement au conteneur concerné, et ils remplacent les réglages effectués au niveau du pod lorsque il y a des chevauchements. Les paramètres du conteneur n'affectent pas les volumes du pod.

Voici le fichier de configuration pour un pod qui a un seul conteneur. Les deux pods et le conteneur possèdent un champ `securityContext` :

{{< codenew file="pods/security/security-context-2.yaml" >}}

Créez le pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-2.yaml
```

Vérifiez que le conteneur du pod fonctionne :

```shell
kubectl get pod security-context-demo-2
```

Ouvrez un shell dans le conteneur en cours d'utilisation :

```shell
kubectl exec -it security-context-demo-2 -- sh
```

Dans votre shell, listez les processus en cours :

```
ps aux
```

Les résultats montrent que les processus fonctionnent en tant qu'utilisateur 2000. C'est la valeur de `runAsUser` spécifiée pour le conteneur. Elle remplace la valeur 1000 qui est spécifiée pour le Pod.

```
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
2000         1  0.0  0.0   4336   764 ?        Ss   20:36   0:00 /bin/sh -c node server.js
2000         8  0.1  0.5 772124 22604 ?        Sl   20:36   0:00 node server.js
...
```

Sortez du shell :

```shell
exit
```

## Définir les capabilities pour un conteneur

Avec les [capabilities de Linux](http://man7.org/linux/man-pages/man7/capabilities.7.html), vous pouvez accorder certains privilèges à un processus sans en accorder tous les privilèges de l'utilisateur root. Pour ajouter ou supprimer des capabilities de Linux pour un conteneur, il faut les inclure dans le champ `capabilities` dans la section `securityContext` du manifeste du conteneur.

Tout d'abord, voyez ce qui se passe lorsque vous n'incluez pas de champ `capabilities`.
Voici le fichier de configuration qui n'ajoute ou ne supprime aucune capabilities du conteneur :

{{< codenew file="pods/security/security-context-3.yaml" >}}

Créez le pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-3.yaml
```

Vérifiez que le conteneur du pod fonctionne :

```shell
kubectl get pod security-context-demo-3
```

Ouvrez un shell dans le conteneur en cours d'utilisation :

```shell
kubectl exec -it security-context-demo-3 -- sh
```

Dans votre shell, listez les processus en cours :

```shell
ps aux
```

Le résultat montre les ID de processus (PID) pour le conteneur :

```shell
USER  PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
root    1  0.0  0.0   4336   796 ?     Ss   18:17   0:00 /bin/sh -c node server.js
root    5  0.1  0.5 772124 22700 ?     Sl   18:17   0:00 node server.js
```

Dans votre shell, visualisez l'état du processus 1 :

```shell
cd /proc/1
cat status
```

Le résultat montre les capabilities bitmap pour le processus :

```
...
CapPrm:	00000000a80425fb
CapEff:	00000000a80425fb
...
```

Prenez note des capabilities bitmap, puis quittez votre shell :

```shell
exit
```

Maintenant, lancez un conteneur qui est le même que le précédent, sauf qu'il a des capabilities supplémentaires.

Voici le fichier de configuration pour un pod qui fait fonctionner un seul conteneur. La configuration ajoute les capabilities `CAP_NET_ADMIN` et `CAP_SYS_TIME` :

{{< codenew file="pods/security/security-context-4.yaml" >}}

Créez le pod :

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-4.yaml
```

Ouvrez un shell dans le conteneur en cours d'utilisation :

```shell
kubectl exec -it security-context-demo-4 -- sh
```

Dans votre shell, visualisez les capabilities du processus 1 :

```shell
cd /proc/1
cat status
```

Le résultat montre les capabilities bitmap pour le processus :

```shell
...
CapPrm:	00000000aa0435fb
CapEff:	00000000aa0435fb
...
```

Comparez les capabilities des deux conteneurs :

```
00000000a80425fb
00000000aa0435fb
```

Dans le capability bitmap du premier conteneur, les bits 12 et 25 sont vides. Dans le deuxième conteneur,
les bits 12 et 25 sont fixés. Le bit 12 est `CAP_NET_ADMIN`, et le bit 25 est celui de `CAP_SYS_TIME`.
Voir [capability.h](https://github.com/torvalds/linux/blob/master/include/uapi/linux/capability.h)
pour les définitions des constantes des capabilities.

{{< note >}}
Les constantes de capabilities de Linux ont la forme `CAP_XXX`. Mais lorsque vous listez des capabilities dans votre manifeste de conteneur, vous devez exclure la partie `CAP_` de la constante. Par exemple, pour ajouter `CAP_SYS_TIME`, ajoutez `SYS_TIME` dans votre liste de capabilities.
{{< /note >}}

## Attribuer des labels SELinux à un conteneur

Pour attribuer des labels SELinux à un conteneur, incluez le champ `seLinuxOptions` dans la section `securityContext` section de votre manifeste du pod ou du conteneur. Le champ `seLinuxOptions` est un objet de [SELinuxOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#selinuxoptions-v1-core). Voici un exemple qui applique un niveau SELinux :

```yaml
...
securityContext:
  seLinuxOptions:
    level: "s0:c123,c456"
```

{{< note >}}
Pour attribuer des labels SELinux, le module de sécurité SELinux doit être chargé sur votre système d'exploitation hôte.
{{< /note >}}

## Discussion

Le contexte de sécurité d'un pod s'applique aux conteneurs et également aux volumes. Plus précisément, les options "fGroup" et "seLinux" s'appliquent aux volumes comme suit :

* `fsGroup`: Les volumes qui supportent la gestion de la propriété sont modifiés pour être gérés par la propriété et pouvant être écrit par le GID spécifié dans `fsGroup`. Voir
[Document de conception de la gestion de la propriété](https://git.k8s.io/community/contributors/design-proposals/storage/volume-ownership-management.md)
pour plus d'informations.

* `seLinuxOptions`: Les volumes qui supportent l'étiquetage SELinux sont relabellisés pour être accessibles par le label spécifié sous `seLinuxOptions`.  En général, vous devez seulement définir la section `level`. Ceci définit le label [Sécurité multi-catégories (MCS)](https://selinuxproject.org/page/NB_MLS) donné à tous les conteneurs du pod ainsi qu'aux Volumes.

{{< warning >}}
Après avoir spécifié un label MCS pour un Pod, tous les Pods avec le même label peuvent accéder au volume. Si vous avez besoin d'une protection entre Pods, vous devez attribuer un label MCS unique à chaque Pod.
{{< /warning >}}

## Clean up

Supprimez le pod :

```shell
kubectl delete pod security-context-demo
kubectl delete pod security-context-demo-2
kubectl delete pod security-context-demo-3
kubectl delete pod security-context-demo-4
```

{{% /capture %}}

{{% capture whatsnext %}}

* [PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core)
* [SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
* [Ajustez Docker avec les dernières améliorations de sécurité](https://opensource.com/business/15/3/docker-security-tuning)
* [Document de conception des contextes de sécurité](https://git.k8s.io/community/contributors/design-proposals/auth/security_context.md)
* [Document de conception de la gestion de la propriété](https://git.k8s.io/community/contributors/design-proposals/storage/volume-ownership-management.md)
* [Politiques de sécurité des pods](/docs/concepts/policy/pod-security-policy/)
* [Le document de conception de AllowPrivilegeEscalation](https://git.k8s.io/community/contributors/design-proposals/auth/no-new-privs.md)


{{% /capture %}}