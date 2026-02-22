---
title: Contributions avancées
slug: advanced
content_type: concept
weight: 30
---

<!-- overview -->

Cette page suppose que vous avez lu et maîtrisé les sujets suivants : [Commencez à contribuer](/docs/contribute/start/) et [Contribution Intermédiaire](/docs/contribute/intermediate/) et êtes prêts à apprendre plus de façons de contribuer.
Vous devez utiliser Git et d'autres outils pour certaines de ces tâches.



<!-- body -->

## Soyez le trieur de PR pendant une semaine

Les [approbateurs SIG Docs](/docs/contribute/participating/#approvers) peuvent être trieurs de Pull Request (PR).

Les approbateurs SIG Docs sont ajoutés au [PR Wrangler rotation scheduler](https://github.com/kubernetes/website/wiki/PR-Wranglers) pour les rotations hebdomadaires.
Les fonctions de trieur de PR incluent:

- Faire une revue quotidienne des nouvelles pull requests.
  - Aidez les nouveaux contributeurs à signer le CLA et fermez toutes les PR où le CLA n'a pas été signé depuis deux semaines.
    Les auteurs de PR peuvent rouvrir la PR après avoir signé le CLA, c’est donc un moyen à faible risque de s’assurer que rien n’est merged sans un CLA signé.
  - Fournir des informations sur les modifications proposées, notamment en facilitant les examens techniques des membres d'autres SIGs.
  - Faire un merge des PRs quand elles sont prêtes, ou fermer celles qui ne devraient pas être acceptées.
- Triez et étiquetez les tickets entrants (Github Issues) chaque jour.
  Consultez [Contributions Intermédiaires](/docs/contribute/intermediate/) pour obtenir des instructions sur la manière dont SIG Docs utilise les métadonnées.

### Requêtes Github utiles pour les trieurs

Les requêtes suivantes sont utiles lors des opérations de triage.
Après avoir utilisé ces trois requêtes, la liste restante de PRs devant être examinées est généralement petite.
Ces requêtes excluent spécifiquement les PRs de localisation, et n'incluent que la branche `master` (sauf la derniere).

- [Pas de CLA, non éligible au merge](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+no%22+-label%3Ado-not-merge+label%3Alanguage%2Fen):
  Rappelez au contributeur de signer le CLA. S’ils ont déjà été rappelés à la fois par le bot et par un humain, fermez la PR et rappelez-leur qu'ils peuvent l'ouvrir après avoir signé le CLA.
  **Nous ne pouvons même pas passer en revue les PR dont les auteurs n'ont pas signé le CLA !**
- [A besoin de LGTM](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+-label%3Algtm+):
  Si cela nécessite une révision technique, contactez l'un des réviseurs proposés par le bot.
  Si cela nécessite une révision de la documentation ou une édition, vous pouvez soit suggérer des modifications, soit ajouter un commit d'édition à la PR pour la faire avancer.
- [A des LGTM, a besoin de docs approval](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+label%3Algtm):
  Voyez si vous pouvez comprendre ce qui doit se passer pour que la PR soit mergée.
- [Not against master](https://github.com/kubernetes/website/pulls?utf8=%E2%9C%93&q=is%3Aopen+is%3Apr+-label%3Ado-not-merge+label%3Alanguage%2Fen+-base%3Amaster): Si c'est basé sur une branche `dev-`, c'est pour une release prochaine.
  Assurez vous que le [release meister](https://github.com/kubernetes/sig-release/tree/master/release-team) est au courant.
  Si elle se base sur une branche obsolète, aidez l'auteur de la PR à comprendre comment choisir la meilleure branche.

## Proposer des améliorations

Les [membres](/docs/contribute/participating/#members) SIG Docs peuvent proposer des améliorations.

Après avoir contribué à la documentation de Kubernetes pendant un certain temps, vous pouvez avoir des idées pour améliorer le guide de style, les outils utilisés pour construire la documentation, le style du site, les processus de révision et faire un merge de pull requests, ou d'autres aspects de la documentation.
Pour une transparence maximale, ces types de propositions doivent être discutées lors d’une réunion SIG Docs ou sur la [liste de diffusion kubernetes-sig-docs](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
En outre, il peut être vraiment utile de situer le fonctionnement actuel et de déterminer les raisons pour lesquelles des décisions antérieures ont été prises avant de proposer des changements radicaux.
Le moyen le plus rapide d’obtenir des réponses aux questions sur le fonctionnement actuel de la documentation est de le demander dans le canal `#sig-docs` sur le Slack officiel [kubernetes.slack.com](https://kubernetes.slack.com)

Une fois que la discussion a eu lieu et que le SIG est d'accord sur le résultat souhaité, vous pouvez travailler sur les modifications proposées de la manière la plus appropriée.
Par exemple, une mise à jour du guide de style ou du fonctionnement du site Web peut impliquer l’ouverture d’une pull request, une modification liée aux tests de documentation peut impliquer de travailler avec sig-testing.

## Coordonner la documentation pour une version de Kubernetes

[Les approbateurs](/docs/contribute/participating/#approvers) SIG Docs peuvent coordonner les tâches liées à la documentation pour une release de Kubernetes.

Chaque release de Kubernetes est coordonnée par une équipe de personnes participant au sig-release Special Interest Group (SIG).
Les autres membres de l'équipe de publication pour une release donnée incluent un responsable général de la publication, ainsi que des représentants de sig-pm, de sig-testing et d'autres.
Pour en savoir plus sur les processus de release de Kubernetes, reportez-vous à la section [https://github.com/kubernetes/sig-release](https://github.com/kubernetes/sig-release).

Le représentant de SIG Docs pour une release donnée coordonne les tâches suivantes:

- Surveillez le feature-tracking spreadsheet pour les fonctionnalités nouvelles ou modifiées ayant un impact sur la documentation.
  Si la documentation pour une fonctionnalité donnée ne sera pas prête pour la release, la fonctionnalité peut ne pas être autorisée à entrer dans la release.
- Assistez régulièrement aux réunions de sig-release et donnez des mises à jour sur l'état de la documentation pour la release.
- Consultez et copiez la documentation de la fonctionnalité rédigée par le SIG responsable de la mise en œuvre de la fonctionnalité.
- Mergez les pull requests liées à la release et maintenir la branche de fonctionnalité Git pour la version.
- Encadrez d'autres contributeurs SIG Docs qui souhaitent apprendre à jouer ce rôle à l'avenir.
  Ceci est connu comme "l'observation" (shadowing en anglais).
- Publiez les modifications de la documentation relatives à la version lorsque les artefacts de la version sont publiés.

La coordination d'une publication est généralement un engagement de 3 à 4 mois et les tâches sont alternées entre les approbateurs SIG Docs.

## Parrainez un nouveau contributeur

Les [relecteurs](/docs/contribute/participating/#reviewers) SIG Docs peuvent parrainer de nouveaux contributeurs.

Après que les nouveaux contributeurs aient soumis avec succès 5 pull requests significatives vers un ou plusieurs dépôts Kubernetes, ils/elles sont éligibles pour postuler à l'[adhésion](/docs/contribute/participating#members) dans l'organisation Kubernetes.
L'adhésion des contributeurs doit être soutenue par deux sponsors qui sont déjà des réviseurs.

Les nouveaux contributeurs docs peuvent demander des sponsors dans le canal #sig-docs sur le [Slack Kubernetes](https://kubernetes.slack.com) ou sur la [mailing list SIG Docs](https://groups.google.com/forum/#!forum/kubernetes-sig-docs).
Si vous vous sentez confiant dans le travail des candidats, vous vous portez volontaire pour les parrainer.
Lorsqu’ils soumettent leur demande d’adhésion, répondez-y avec un "+1" et indiquez les raisons pour lesquelles vous estimez que les demandeurs sont des candidat(e)s valables pour devenir membre de l’organisation Kubernetes.


