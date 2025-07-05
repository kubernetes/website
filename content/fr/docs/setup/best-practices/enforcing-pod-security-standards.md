---
reviewers:
- tallclair
- liggitt
title: Renforcer les normes de sécurité d'un Pod
weight: 40
---

<!-- overview -->

Cette page vous donne un aperçu des bonnes pratiques lorsqu'il s'agit de renforcer les
[Normes de Sécurité d'un Pod](/docs/concepts/security/pod-security-standards).

<!-- body -->

## Utilsation du Contrôleur de Validation *Pod Security*

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Le [Contrôleur de Validation *Pod Security*](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
tend à remplacer *PodSecurityPolicies* qui est obsolète. 

### Configurer tous les *namespaces* d'une grappe

Les *namespaces* dépourvus de toute configuration doivent être considérés comme des lacunes importantes dans 
le modèle de sécurité de votre cluster. Nous recommandons de prendre le temps d'analyser les types de charges de travail qui 
se produisent dans chaque *namespace*, et en se référant aux Normes de Sécurité des Pods, de décider du niveau approprié pour
chacun d'entre eux. Les *namespaces* non étiquetés doivent uniquement indiquer qu'ils n'ont pas encore été étudiés.

Dans le scénario où toutes les charges de travail dans tous les *namespaces* ont les mêmes prérequis,
nous fournissons un [exemple](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces)
qui illustre comment les étiquettes *PodSecurity* peuvent être appliquées en vrac.

### Adoptez le principe du moindre privilège

Dans un monde idéal, chaque *pod* dans chaque *namespace* répondrait aux exigences de la politique de restriction. 
Toutefois, cela n'est ni possible ni pratique, 
car certaines charges de travail nécessitent des privilèges élevés pour des raisons légitimes.
- Les *Namespaces* autorisant les charges de travail avec des privilèges élevés devraient établir et appliquer des contrôles d'accès appropriés. 
- Pour les charges de travail s'exécutant dans ces *namespaces* permissifs, 
  maintenez à jour une documentation sur leurs exigences de sécurité uniques. 
  Si possible, envisagez comment ces exigences pourraient être encore plus strictes.


### Adopter une stratégie à plusieurs modes

Le modes `audit` and `warn` des du contrôleur de validation des Normes de Sécurité de *Pod* facilitent la 
collecte d'informations importantes sur la sécurité de vos *pods* sans interrompre les charges de travail existantes.

C'est une bonne pratique d'activer ces modes pour tous les *namespaces*, en choisissant 
le niveau *désiré* et la version que vous souhaiteriez éventuellement __appliquer__. Les avertissements et les annotations d'audit générés dans 
cette phase peuvent vous guider vers cet état. Si vous vous attendez à ce que les auteurs de la charge de travail apportent des 
modifications pour être en cohérence avec le niveau souhaité, utilisez le mode `warn`. 
Si vous prévoyez d'utiliser les journaux d'audit pour suivre/faire avancer les changements afin qu'ils correspondent au niveau souhaité, utilisez le mode `audit`.

Lorsque vous avez le mode `enforce` choisi en tant que valeur désiré, ces autres modes peuvent tout aussi être utiles dans
certains cas:

- En choisissant le même niveau utilisé avec le mode `enforce` pour le mode `warn`, les clients recevront des avertissements lors
  de la création des *Pods* (ou des ressources qui contiennent des structures de *Pod*) qui n'ont pas été validés. Cela les aidera
  à les mettre à jour afin qu'ils soient conformes.
- Dans les *Namespaces* qui utilisent le mode `enforce` d'une version spécifique qui n'est pas la plus récente, 
  le fait de mettre le meme niveau que `enforce` pour les modes `audit` et `warn`, mais en utilisant la dernière version, permet de connaître les 
  paramètres qui étaient autorisés par les versions précédentes, mais qui ne le sont plus selon les bonnes pratiques actuelles.

## Alterntives tierces

{{% thirdparty-content %}}

D'autres alternatives pour renforcer les profiles de sécurité sont en cours de développement dans 
l'écosystem de Kubernetes:

- [Kubewarden](https://github.com/kubewarden).
- [Kyverno](https://kyverno.io/policies/).
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper).

La décision de partir sur une solution _interne_ (ex: le contrôleur de validation *PodSecurity* ) plutôt
qu'un outil tiers dépend complètement de votre situation. Lors de l'évaluation de toute solution, 
la confiance de votre chaîne d'approvisionnement est cruciale. 
En fin de compte, il est préférable d'opter l'une des approches susmentionnées plutôt que de ne rien faire.