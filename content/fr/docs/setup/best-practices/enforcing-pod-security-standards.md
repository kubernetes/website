---
reviewers:
  - tallclair
  - liggitt
title: Application des standards de sécurité des Pods
weight: 40
---

<!-- overview -->

Cette page fournit une vue d’ensemble des bonnes pratiques concernant l’application des
[Pod Security Standards](/docs/concepts/security/pod-security-standards).

<!-- body -->

## Utilisation du contrôleur d’admission Pod Security intégré

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Le [contrôleur d’admission Pod Security](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
est destiné à remplacer les PodSecurityPolicies, désormais obsolètes.

### Configurer tous les namespaces du cluster

Les namespaces qui ne possèdent aucune configuration doivent être considérés comme des failles importantes dans le modèle de sécurité de votre cluster. Nous recommandons de prendre le temps d’analyser les types de charges de travail présents dans chaque namespace, puis, en vous basant sur les Pod Security Standards, de définir un niveau approprié pour chacun d’eux. Les namespaces non étiquetés doivent uniquement indiquer qu’ils n’ont pas encore été évalués.

Dans le cas où toutes les charges de travail de tous les namespaces ont les mêmes exigences de sécurité, nous fournissons un [exemple](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces)
illustrant comment appliquer les labels PodSecurity en masse.

### Adopter le principe du moindre privilège

Dans un monde idéal, chaque pod dans chaque namespace respecterait les exigences de la politique `restricted`. Cependant, cela n’est ni toujours possible ni pratique, car certaines charges de travail nécessitent des privilèges élevés pour des raisons légitimes.

- Les namespaces autorisant des workloads `privileged` doivent définir et appliquer des contrôles d’accès appropriés.
- Pour les workloads exécutés dans ces namespaces permissifs, il est important de maintenir une documentation sur leurs exigences de sécurité spécifiques. Lorsque cela est possible, il faut envisager de réduire davantage ces exigences.

### Adopter une stratégie multi-mode

Les modes `audit` et `warn` du contrôleur d’admission Pod Security Standards facilitent la collecte d’informations de sécurité importantes sur vos pods sans interrompre les workloads existants.

Il est recommandé d’activer ces modes pour tous les namespaces, en les configurant au niveau et à la version _cibles_ que vous souhaitez éventuellement `enforce`. Les avertissements et annotations d’audit générés à cette étape peuvent vous guider vers cet état. Si vous attendez des auteurs de workloads qu’ils adaptent leurs ressources, activez le mode `warn`. Si vous souhaitez utiliser les logs d’audit pour surveiller ou piloter les changements, activez le mode `audit`.

Lorsque le mode `enforce` est défini au niveau souhaité, ces modes restent utiles de plusieurs façons :

- En définissant `warn` au même niveau que `enforce`, les clients recevront des avertissements lorsqu’ils tenteront de créer des Pods (ou des ressources contenant des templates de Pods) qui ne respectent pas la validation. Cela les aidera à rendre leurs ressources conformes.
- Dans les namespaces qui verrouillent `enforce` à une version spécifique (non la dernière), définir `audit` et `warn` au même niveau que `enforce`, mais avec la version `latest`, permet de détecter les paramètres qui étaient autorisés dans les anciennes versions mais qui ne respectent plus les bonnes pratiques actuelles.

## Alternatives tierces

{{% thirdparty-content %}}

D’autres alternatives pour appliquer des profils de sécurité sont en cours de développement dans l’écosystème Kubernetes :

- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io/policies/)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)

Le choix entre une solution _intégrée_ (comme le contrôleur d’admission PodSecurity) et un outil tiers dépend entièrement de votre contexte. Lors de l’évaluation d’une solution, la confiance dans votre chaîne d’approvisionnement est essentielle. Au final, utiliser _n’importe laquelle_ de ces approches est toujours préférable à ne rien faire.
