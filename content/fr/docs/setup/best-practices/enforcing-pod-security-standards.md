---
reviewers:
- tallclair
- liggitt
title: Application des normes de sécurité des Pods
weight: 40
---

<!-- overview -->

Cette page présente une vue d’ensemble des bonnes pratiques pour l’application des [Pod Security Standards](/docs/concepts/security/pod-security-standards).

<!-- body -->

## Utiliser le contrôleur d’admission Pod Security intégré

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Le [contrôleur d’admission Pod Security](/docs/reference/access-authn-authz/admission-controllers/#podsecurity) a vocation à remplacer les PodSecurityPolicies désormais obsolètes.

### Configurer tous les namespaces du cluster

Les namespaces sans aucune configuration doivent être considérés comme des failles importantes dans le modèle de sécurité de votre cluster. Nous recommandons de prendre le temps d’analyser les types de charges de travail présents dans chaque namespace et, en vous appuyant sur les Pod Security Standards, de définir un niveau de sécurité approprié pour chacun d’eux. Les namespaces non étiquetés doivent uniquement indiquer qu’ils n’ont pas encore été évalués.

Dans le cas où toutes les charges de travail de tous les namespaces ont les mêmes exigences de sécurité, nous proposons un [exemple](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces) montrant comment appliquer les labels PodSecurity en masse.

### Appliquer le principe du moindre privilège

Dans un monde idéal, chaque pod dans chaque namespace respecterait les exigences de la politique `restricted`. Cependant, ce n’est ni possible ni pratique, car certaines charges de travail nécessitent des privilèges élevés pour des raisons légitimes.

- Les namespaces autorisant des charges de travail `privileged` doivent mettre en place et appliquer des contrôles d’accès appropriés.
- Pour les charges de travail exécutées dans ces namespaces permissifs, maintenez une documentation décrivant leurs exigences de sécurité spécifiques. Si possible, cherchez à restreindre davantage ces exigences.

### Adopter une stratégie multi-modes

Les modes `audit` et `warn` du contrôleur d’admission des Pod Security Standards facilitent la collecte d’informations de sécurité importantes sur vos pods sans perturber les charges de travail existantes.

Il est recommandé d’activer ces modes pour tous les namespaces, en les configurant au niveau et à la version _ciblés_ que vous souhaitez finalement appliquer (`enforce`). Les avertissements et annotations d’audit générés durant cette phase peuvent vous guider vers cet objectif. Si vous attendez des développeurs qu’ils adaptent leurs charges de travail au niveau souhaité, activez le mode `warn`. Si vous prévoyez d’utiliser les logs d’audit pour suivre et piloter ces changements, activez le mode `audit`.

Une fois le mode `enforce` défini au niveau souhaité, ces modes restent utiles de plusieurs façons :

- En configurant `warn` au même niveau que `enforce`, les utilisateurs recevront des avertissements lorsqu’ils tenteront de créer des Pods (ou des ressources contenant des templates de Pod) non conformes. Cela les aidera à corriger leurs ressources.
- Dans les namespaces où `enforce` est fixé à une version spécifique non la plus récente, configurer `audit` et `warn` au même niveau que `enforce`, mais avec la version `latest`, permet de détecter les paramètres autrefois autorisés mais désormais déconseillés selon les bonnes pratiques actuelles.

## Alternatives tierces

{{% thirdparty-content %}}

D’autres solutions permettant d’appliquer des profils de sécurité sont en cours de développement dans l’écosystème Kubernetes :

- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io/policies/)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)

Le choix entre une solution _intégrée_ (comme le contrôleur PodSecurity) et un outil tiers dépend entièrement de votre contexte. Lors de l’évaluation d’une solution, la confiance dans votre chaîne d’approvisionnement est essentielle. Dans tous les cas, utiliser l’une de ces approches reste préférable à l’absence totale de contrôle.
