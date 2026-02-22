---
title: Participez au SIG Docs
content_type: concept
card:
  name: contribute
  weight: 40
---

<!-- overview -->

SIG Docs est l'un des [groupes d'intérêts spéciaux](https://github.com/kubernetes/community/blob/master/sig-list.md) au sein du projet Kubernetes, axé sur la rédaction, la mise à jour et la maintenance de la documentation de Kubernetes dans son ensemble.
Pour plus d'informations sur le SIG consultez [le dépôt GitHub de la communauté](https://github.com/kubernetes/community/tree/master/sig-docs).

SIG Docs accueille le contenu et les critiques de tous les contributeurs.
Tout le monde peut ouvrir une pull request (PR), et tout le monde est invité à déposer des questions sur le contenu ou à commenter les pull requests ouvertes.

Dans SIG Docs, vous pouvez aussi devenir un [membre](#membres), [relecteur](#reviewers), ou [approbateur](#approvers).
Ces rôles nécessitent un plus grand accès et impliquent certaines responsabilités pour approuver et valider les changements.
Voir [appartenance à la communauté](https://github.com/kubernetes/community/blob/master/community-membership.md) pour plus d'informations sur le fonctionnement de l'adhésion au sein de la communauté Kubernetes.
Le reste de ce document décrit certaines fonctions uniques de ces rôles au sein du SIG Docs, responsable de la gestion de l’un des aspects les plus accessibles du public de Kubernetes: le site Web et la documentation de Kubernetes.



<!-- body -->

## Rôles et responsabilités

Lorsqu'une pull request est mergée à la branche utilisée pour publier le contenu (actuellement `master`), ce contenu est publié et disponible dans le monde entier.
Pour nous assurer que la qualité de notre contenu publié est élevée, nous limitons aux approbateurs SIG Docs le droit de merger des pull requests.
Voici comment ce processus fonctionne.

- Lorsqu'une pull request a les deux labels `lgtm` et `approve` et n'a pas de label `hold`, la pull request est mergée automatiquement.
- Les membres de l'organisation Kubernetes et les approbateurs SIG Docs peuvent ajouter des commentaires à une pull request ou empêcher le merge automatique d'une pull request donnée (en ajoutant un commentaire `/hold` ou en retirant un commentaire `/lgtm`).
- Tout membre de Kubernetes peut ajouter le label `lgtm`, en ajoutant un commentaire `/lgtm`.
- Seul un approbateur membre de SIG Docs peut causer le merge d'une pull request en ajoutant un commentaire `/approve`.
  Certains approbateurs remplissent également des rôles spécifiques supplémentaires, tels que [PR Wrangler](#pr-wrangler) or [président(e) du SIG Docs](#sig-docs-chairperson).

Pour plus d'informations sur les attentes et les différences entre les rôles de membre de l'organisation Kubernetes et d'approbateurs SIG Docs, voir [Types de contributeur](/docs/contribute#types-of-contributor).
Les sections suivantes couvrent plus de détails sur ces rôles et leur fonctionnement dans SIG-Docs.

### N'importe qui

Tout le monde peut ouvrir un ticket sur n'importe quelle partie de Kubernetes, y compris la documentation.

Toute personne ayant signé le CLA peut ouvrir une Pull Request.
Si vous ne pouvez pas signer le CLA, le projet Kubernetes ne peut pas accepter votre contribution.

### Membres

Tout membre de l'[organisation Kubernetes](https://github.com/kubernetes) peut faire une revue d'une pull request, et les membres de l’équipe SIG Docs demandent fréquemment aux membres d’autres SIG d'effectuer des révisions de documents pour des raisons de précision technique.
SIG Docs accueille également des critiques et des commentaires indépendamment du statut de membre d'une personne dans l'organisation Kubernetes.
Vous pouvez indiquer votre approbation en ajoutant un commentaire de `/lgtm` à une pull request.
Si vous n'êtes pas membre de l'organisation Kubernetes, votre `/lgtm` n'a aucun effet sur les systèmes automatisés.

Tout membre de l’organisation Kubernetes peut ajouter un commentaire `/ hold` pour empêcher la pull request d'être mergée.
Tout membre peut également supprimer un commentaire `/hold` pour merger une PR s'il a déjà les deux commentaires `/lgtm` et `/approve` appliqué par les personnes appropriées.

#### Devenir membre

Après avoir soumis avec succès au moins 5 pull requests significatives, vous pouvez demander l'[adhésion](https://github.com/kubernetes/community/blob/master/community-membership.md#member) dans l'organisation Kubernetes.
Suivez ces étapes:

1. Trouvez deux relecteurs ou approbateurs pour [parrainer](/docs/contribute/advanced#sponsor-a-new-contributor) votre adhésion.

    Demander un parrainage dans le [canal #sig-docs sur l'instance de Kubernetes Slack](https://kubernetes.slack.com) ou sur la [mailing list SIG Docs](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).

    {{< note >}}
    N'envoyez pas de courrier électronique direct ou de message direct Slack à un membre individuel de SIG Docs.
    {{< /note >}}

2. Ouvrez un ticket Github dans le dépôt `kubernetes/org` pour adhérer à l'organisation.
   Remplissez le modèle en suivant les directives de l'[Adhésion à la communauté](https://github.com/kubernetes/community/blob/master/community-membership.md).

3. Informez vos sponsors du ticket Github, soit en les mentionnant dans le ticket Github (en ajoutant un commentaire avec `@<Github-username>`) ou en leur envoyant directement le lien, afin qu’ils puissent ajouter un vote `+ 1`.

4. Lorsque votre adhésion est approuvée, le membre de l'équipe d'administration github affecté à votre demande met à jour le ticket Github pour indiquer son approbation, puis ferme le ticket Github.
   Félicitations, vous êtes maintenant membre!

Si, pour une raison quelconque, votre demande d'adhésion n'est pas acceptée immédiatement, le comité des membres fournit des informations ou des mesures à prendre avant de présenter une nouvelle demande.

### Relecteurs

Les relecteurs sont membres du groupe Github [@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews).
Voir [Equipes et groupes au sein de SIG Docs](#teams-and-groups-within-sig-docs).

Les relecteurs examinent les Pull Request de documentation et font des commentaires sur les changements proposés.

L'automatisation assigne des relecteurs aux pull requests, et les contributeurs peuvent demander une revue d'un relecteur spécifique en laissant un commentaire tel que: `/assign [@_github_handle]`.
Pour indiquer qu'une pull request est techniquement exacte et ne nécessite aucune modification supplémentaire, un examinateur ajoute un commentaire `/lgtm` à la Pull Request.

Si le relecteur affecté n'a pas encore revu le contenu, un autre relecteur peut intervenir.
En outre, vous pouvez affecter des relecteurs techniques et attendre qu'ils fournissent des `/lgtm`.

Pour un changement trivial ou ne nécessitant aucun examen technique, l'[approbateur](#approvers) SIG Docs peut fournir le `/lgtm` aussi.

Un commentaire `/approve` d'un relecteur est ignoré par l'automatisation.

Pour en savoir plus sur comment devenir un relecteur SIG Docs et sur les responsabilités et l’engagement de temps que cela implique, voir [Devenir relecteur ou approbateur](#becoming-an-approver-or-reviewer).

#### Devenir relecteur

Lorsque vous remplissez les [conditions requises](https://github.com/kubernetes/community/blob/master/community-membership.md#reviewer), vous pouvez devenir un relecteur SIG Docs.
Les relecteurs d'autres SIG doivent demander séparément le statut de relecteur dans le SIG Docs.

Pour postuler, ouvrez une pull request et ajoutez vous à la section `reviewers` du fichier [top-level OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) dans le dépôt `kubernetes/website`.
Affectez la PR à un ou plusieurs approbateurs SIG Docs.

Si votre pull request est approuvée, vous êtes maintenant un relecteur SIG Docs.
[K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home) vous assignera et vous suggérera en tant que relecteur pour les nouvelles Pull Requests.

Si vous êtes approuvé, demandez qu’un approbateur SIG Docs en cours vous ajoute au groupe Github [@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews).
Seuls les membres du groupe Github `kubernetes-website-admins` peuvent ajouter de nouveaux membres à un groupe Github.

### Approbateurs

Les approbateurs sont membres du groupe Github [@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers).
Voir [Equipes et groupes au sein de SIG Docs](#teams-and-groups-within-sig-docs).

Les approbateurs ont la capacité de merger une PR, et ainsi, publier du contenu sur le site Web de Kubernetes.
Pour approuver une PR, un approbateur laisse un commentaire `/approve` sur la PR.
Si quelqu'un qui n'est pas un approbateur laisse le commentaire d'approbation, l'automatisation l'ignore.

Si la PR a déjà un `/lgtm`, ou si l'approbateur fait également des commentaires avec `/lgtm`, la PR est mergée automatiquement.
Un approbateur SIG Docs ne doit laisser qu'un `/lgtm` sur un changement qui ne nécessite pas de relecture supplémentaire.

Pour en savoir plus sur comment devenir un approbateur SIG Docs et sur les responsabilités et l’engagement de temps que cela implique, voir [Devenir relecteur ou approbateur](#becoming-an-approver-or-reviewer).

#### Devenir approbateur

Lorsque vous remplissez les [conditions requises](https://github.com/kubernetes/community/blob/master/community-membership.md#approver), vous pouvez devenir un approbateur SIG Docs.
Les approbateurs appartenant à d'autres SIG doivent demander séparément le statut d'approbateur dans SIG Docs.

Pour postuler, ouvrez une pull request pour vous ajouter à la section `approvers` du fichier [top-level OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) dans le dépot `kubernetes/website`.
Affectez la PR à un ou plusieurs approbateurs SIG Docs.

Si votre Pull Request est approuvée, vous êtes à présent approbateur SIG Docs.
Le [K8s-ci-robot](https://github.com/kubernetes/test-infra/tree/master/prow#bots-home) vous assignera et vous suggérera en tant que relecteur pour les nouvelles Pull Requests.

Si vous êtes approuvé, demandez qu’un approbateur SIG Docs en cours vous ajoute au groupe Github [@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers).
Seuls les membres du groupe Github `kubernetes-website-admins` peuvent ajouter de nouveaux membres à un groupe Github.

#### Devenir un administrateur de site Web

Les membres du groupe GitHub `kubernetes-website-admins` peuvent gérer l’appartenance au groupe Github et disposer de tous les droits administratifs sur les paramètres du dépôt, y compris la possibilité d'ajouter, de supprimer et de debugger des Webhooks.
Tous les approbateurs SIG Docs n'ont pas besoin de ce niveau d'accès.

Si vous pensez avoir besoin de ce niveau d’accès, adressez-vous à un administrateur de site Web existant ou posez la question dans le canal Slack [#sig-docs](https://kubernetes.slack.com/messages/C1J0BPD2M/).

#### Auxiliaires de traitement des Pull Requests

Les approbateurs SIG Docs sont ajoutés au [calendrier de rotations des auxiliaires de traitement des PullRequests](https://github.com/kubernetes/website/wiki/PR-Wranglers) pour les rotations hebdomadaires.
Tous les approbateurs SIG Docs devraient participer à cette rotation.
Voir [Soyez l'auxiliaire des PR pendant une semaine](/docs/contribute/advanced#be-the-pr-wrangler-for-a-week) pour plus de détails.

#### Présidence du SIG Docs

Chaque SIG, y compris SIG Docs, sélectionne un ou plusieurs membres du SIG qui assumeront les fonctions de président(e).
Ce sont des points de contact entre SIG Docs et d’autres parties de l’organisation Kubernetes.
Ils nécessitent une connaissance approfondie de la structure du projet Kubernetes dans son ensemble et du fonctionnement de SIG Docs au sein de celui-ci.
Voir [Direction](https://github.com/kubernetes/community/tree/master/sig-docs#leadership) pour la liste actuelle des président(e)s.

## Equipes SIG Docs et automatisation

L'automatisation dans SIG Docs repose sur deux mécanismes différents:
Groupes Github et fichiers OWNERS.

### Groupes Github

Le groupe SIG Docs définit deux équipes sur Github:

- [@kubernetes/sig-docs-maintainers](https://github.com/orgs/kubernetes/teams/sig-docs-maintainers)
- [@kubernetes/sig-docs-pr-reviews](https://github.com/orgs/kubernetes/teams/sig-docs-pr-reviews)

Chacun peut être référencé avec son `@name` dans Github, commentez pour communiquer avec tous les membres de ce groupe.

Ces équipes peuvent avoir des membres en commun.
Pour l'affectation des tickets, des pull requests, et aider la validation des PR, l'automatisation utilise les informations des fichiers OWNERS.

### OWNERS files et front-matter

Le projet Kubernetes utilise un outil d'automatisation appelé prow pour l'automatisation liée aux Github issues et aux pull requests.
Le [dépôt du site web Kubernetes](https://github.com/kubernetes/website) utilise deux [plugins prow](https://github.com/kubernetes-sigs/prow/tree/main/pkg/plugins):

- blunderbuss
- approve

Ces deux plugins utilisent les fichiers [OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) et [OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES) à la racine du dépôt Github `kubernetes/website` pour contrôler comment prow fonctionne.

Un fichier [OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) contient une liste de personnes qui sont des relecteurs et des approbateurs SIG Docs.
Les fichiers OWNERS existent aussi dans les sous-dossiers, et peuvent ignorer qui peut agir en tant que relecteur ou approbateur des fichiers de ce sous-répertoire et de ses descendants.
Pour plus d'informations sur les fichiers OWNERS en général, voir [OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md).

En outre, un fichier Markdown individuel peut répertorier les relecteurs et les approbateurs dans l'entête, soit en répertoriant les noms d’utilisateur ou les groupes de Github.

La combinaison des fichiers `OWNERS` et des entêtes dans les fichiers Markdown déterminent les suggestions automatiques de relecteurs dans la PullRequest.



## {{% heading "whatsnext" %}}


Pour plus d'informations sur la contribution à la documentation Kubernetes, voir:

- [Commencez à contribuer](/docs/contribute/start/)
- [Documentation style](/docs/contribute/style/)
