---
title: Commencez à contribuer
description: Démarrage contribution Kubernetes
slug: start
content_template: templates/concept
weight: 10
card:
  name: contribute
  weight: 10
---

{{% capture overview %}}

Si vous souhaitez commencer à contribuer à la documentation de Kubernetes, cette page et les rubriques associées peuvent vous aider à démarrer.
Vous n'avez pas besoin d'être un développeur ou un rédacteur technique pour avoir un impact important sur la documentation et l'expérience utilisateur de Kubernetes !
Tout ce dont vous avez besoin pour les sujets de cette page est un compte [GitHub](https://github.com/join) et un navigateur web.

Si vous recherchez des informations sur la façon de commencer à contribuer aux référentiels de code Kubernetes, reportez-vous à la section sur [les directives de la communauté Kubernetes](https://github.com/kubernetes/community/blob/master/governance.md).

{{% /capture %}}

{{% capture body %}}

## Les bases de notre documentation

La documentation de Kubernetes est écrite en Markdown puis traitée et déployée à l’aide de Hugo.
Le code source est sur GitHub: [https://github.com/kubernetes/website](https://github.com/kubernetes/website).
La majeure partie de la documentation anglaise est stockée dans `/content/en/docs/`.
Une partie de la documentation de référence est automatiquement générée à partir de scripts du répertoire `update-imported-docs/`.

Vous pouvez trier les demandes, modifier le contenu et passer en revue les modifications des autres, le tout à partir du site Web de GitHub.
Vous pouvez également utiliser l'historique intégré et les outils de recherche de GitHub.

Toutes les tâches ne peuvent pas être effectuées dans l’interface utilisateur GitHub, mais elles sont décrites dans les guides de contribution [intermédiaire](/docs/contribute/intermediate/) et [avancé](/docs/contribute/advanced/).

### Participer à SIG Docs

La documentation de Kubernetes est gérée par un groupe d'intérêt spécial (Special Interest Group (SIG)) appelé SIG Docs.
Nous communiquons via un canal Slack, une liste de diffusion et des réunions vidéo hebdomadaires.
Les nouveaux participants sont les bienvenus.
Pour plus d'informations, voir [Participer au SIG-docs](/docs/contribute/participating/).

### Guides de style

Nous maintenons un [guide de style](/docs/contribute/style/style-guide/) avec des informations sur les choix de la communauté SIG Docs concernant la grammaire, la syntaxe, le format des sources et les conventions typographiques.
Avant de faire votre première contribution, parcourez le guide de style et utilisez-le lorsque vous avez des questions.

Les modifications apportées au guide de style sont effectuées par SIG Docs en tant que groupe.
Pour proposer un changement ou un ajout, [ajoutez-le à l'ordre du jour](https://docs.google.com/document/d/1Ds87eRiNZeXwRBEbFr6Z7ukjbTow5RQcNZLaSvWWQsE/edit#) pour une réunion à venir sur les documents SIG et assister à la réunion pour participer à la discussion.
Voir le sujet [contribution avancée](/docs/contribute/advanced/) pour plus d'informations.

### Modèle de page

Nous utilisons des modèles de page pour contrôler la présentation de nos pages de documentation.
Assurez-vous de comprendre le fonctionnement de ces modèles en consultant [Utilisation de modèles de page](/docs/contribute/style/page-templates/).

### Shortcodes Hugo 

La documentation de Kubernetes est convertie de Markdown à HTML avec Hugo.
Nous utilisons les shortcodes standard Hugo, ainsi que quelques-uns qui sont personnalisés dans la documentation Kubernetes.
Voyez "[Shortcodes Hugo personnalisés](/docs/contribute/style/hugo-shortcodes/)" pour savoir comment les utiliser.

### Multilingue

La source de la documentation est disponible en plusieurs langues dans `/content/`.
Chaque langue a son propre dossier avec un code à deux lettres déterminé par le [standard ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php).
Par exemple, la source de la documentation anglaise est stockée dans `/content/en/docs/`.

Pour plus d'informations sur la contribution à la documentation dans plusieurs langues, consultez ["Traduire le contenu"](/docs/contribute/intermediate#localize-content) dans le guide de contribution intermédiaire.

Si vous souhaitez démarrer une nouvelle traduction, voir ["Traduction"](/docs/contribute/localization/).

## Créer des demander recevables

Toute personne possédant un compte GitHub peut soumettre un problème (rapport de bogue) à la documentation de Kubernetes.
Si vous voyez quelque chose qui ne va pas, même si vous ne savez pas comment le réparer, [ouvrez un ticket](#how-to-file-an-issue).
L'exception à cette règle est un petit bug, comme une faute de frappe, que vous souhaitez réparer vous-même.
Dans ce cas, vous pouvez plutôt [le réparer](#improve-existing-content) sans déposer un bogue d'abord.

### Comment ouvrir un ticket

- **Sur une page existante**

    Si vous voyez un problème dans une page existante de [la documentation Kubernetes](/docs/), allez au bas de la page et cliquez sur le bouton **Create an Issue**.
    Si vous n'êtes pas actuellement connecté à GitHub, connectez-vous.
    Un formulaire de ticket GitHub apparaît avec du contenu pré-rempli.

    À l’aide de Markdown, renseignez autant de détails que possible.
    Aux endroits où vous voyez des crochets vides (`[ ]`), mettre un `x` entre les crochets qui représente le choix approprié.
    Si vous avez une solution proposée pour résoudre le problème, ajoutez-la.

- **Demander une nouvelle page**

    Si vous pensez que du contenu est manquant, mais que vous ne savez pas où il doit aller ou si vous pensez qu'il ne correspond pas aux pages existantes, vous pouvez toujours ouvrir un ticket.
    Vous pouvez soit choisir une page existante à proximité du lieu où le nouveau contenu doit aller et classer le problème à partir de cette page, soit aller directement à [https://github.com/kubernetes/website/issues/new/](https://github.com/kubernetes/website/issues/new/) et déposer le problème à partir de là.

### Comment créer de bons tickets

Pour nous assurer que nous comprenons votre problème et pouvons y donner suite, gardez à l’esprit ces directives:

- Utilisez le modèle de ticket et renseignez autant de détails que possible.
- Expliquez clairement l’impact spécifique du problème sur les utilisateurs.
- Limiter la portée d'un problème à une unité de travail raisonnable.
  Pour les problèmes de grande envergure, décomposez-les en problèmes plus petits.

    Par exemple, "Corriger les docs de sécurité" n'est pas une question pouvant donner lieu à une action, mais "Ajouter des détails au thème 'Restreindre l'accès au réseau'" pourrait l'être.
- Si la demande concerne un autre problème ou une pull request, vous pouvez y faire référence soit par son URL complète, soit par le problème ou par un numéro de demande d'extraction précédé du caractère "#".
  Par exemple, `Introduced by #987654`.
- Soyez respectueux et restez constructif.
  Par exemple, "La documentation sur X est nulle" n'est ni utile ni constructif.
  Le [Code de conduite](/community/code-of-conduct/) s'applique également aux interactions sur les dépôts Kubernetes GitHub.

## Participer aux discussions SIG Docs

L'équipe SIG Docs communique à l'aide des mécanismes suivants:

- [Rejoindre l'instance Slack de Kubernetes](http://slack.k8s.io/), puis rejoignez le canal `#sig-docs`, où nous discutons des problèmes de documentation en temps réel.
  Présentez-vous quand vous arrivez!
- [Rejoignez la liste de diffusion `kubernetes-sig-docs`](https://groups.google.com/forum/#!forum/kubernetes-sig-docs), où des discussions plus larges ont lieu et où les décisions officielles sont enregistrées.
- Participer à l'[hebdomadaire SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs), une réunion vidéo, qui est annoncée sur le canal Slack et la liste de diffusion.
  Actuellement, ces réunions ont lieu sur Zoom.
  Vous devez donc télécharger le logiciel [Zoom](https://zoom.us/download) ou rejoindre la conférence par téléphone.
- Pour les utilisateurs francophones, vous pouvez également rejoindre le canal Slack [`#kubernetes-docs-fr`](https://kubernetes.slack.com/messages/CG838BFT9/), où nous discutons des traductions en Français de la documentation de Kubernetes.

{{< note >}}
Vous pouvez également consulter la réunion hebdomadaire de SIG Docs sur [Calendrier des réunions de la communauté Kubernetes](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles).
{{< /note >}}

## Améliorer le contenu existant

Pour améliorer le contenu existant, vous déposez une _pull request (PR)_ après avoir créé un _fork_.
Ces deux termes sont [spécifiques à GitHub](https://help.github.com/categories/collaborating-with-issues-and-pull-requests/).
Pour les besoins de cette rubrique, vous n'avez pas besoin de tout savoir à leur sujet, car vous pouvez tout faire à l'aide de votre navigateur Web.
Quand vous passerez au [Guide des contributeurs docs intermédiaires](/docs/contribute/intermediate/), vous aurez besoin de plus de connaissances en terminologie Git.

{{< note >}}
**Développeurs Kubernetes**: Si vous documentez une nouvelle fonctionnalité pour une prochaine version de Kubernetes, votre processus est un peu différent.
Voir [Documenter une fonctionnalité](/docs/contribute/intermediate/#sig-members-documenting-new-features) pour des instructions sur le processus et pour des des informations à propos des échéances.
{{< /note >}}

### Signer le CLA

Avant de pouvoir apporter du code ou de la documentation à Kubernetes, vous **devez** lire le [Guide du contributeur](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md) et [signer le Contributor License Agreement (CLA)](https://github.com/kubernetes/community/blob/master/CLA.md).
Ne vous inquiétez pas, cela ne prend pas longtemps !

### Trouvez quelque chose sur lequel travailler

Si vous voyez quelque chose que vous souhaitez réparer immédiatement, suivez simplement les instructions ci-dessous.
Vous n'avez pas besoin d'[ouvrir un ticket](#file-actionable-issues) (bien que vous puissiez aussi).

Si vous souhaitez commencer par trouver un problème existant sur lequel travailler, allez à [https://github.com/kubernetes/website/issues](https://github.com/kubernetes/website/issues) et chercher des problèmes avec le label `good first issue` (vous pouvez utiliser [ce](https://github.com/kubernetes/website/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) raccourci).
Lisez tous les commentaires et assurez-vous qu’il n’y a pas de pull request existante pour ce même problème et que personne n’a laissé de commentaire indiquant qu’ils travaillent sur le problème récemment (une durée de 3 jours est une bonne règle).
Laissez un commentaire indiquant que vous souhaitez travailler sur la question.

### Choisissez quelle branche Git utiliser

L'aspect le plus important de la soumission d'une pull request c'est choisir la branche sur laquelle baser votre travail.
Utilisez ces directives pour prendre la décision:

- Utilisez `master` pour résoudre les problèmes de contenu déjà publié ou pour améliorer le contenu déjà existant.
  - Utiliser une branche de publication (tel que `dev-{{< release-branch >}}` pour le {{< release-branch >}} release) pour documenter les fonctionnalités ou modifications à venir pour une version à venir non encore publiée.
- Utilisez une branche de fonctionnalités approuvée par SIG Docs pour collaborer à de grandes améliorations ou modifications de la documentation existante, y compris la réorganisation du contenu ou des modifications apportées à l'apparence du site Web.

Si vous ne savez toujours pas quelle branche choisir, demandez `#sig-docs` sur Slack ou assistez à une réunion hebdomadaire de documents SIG pour obtenir des précisions.

### Soumettre une pull request

Suivez ces étapes pour soumettre une pull request afin d'améliorer la documentation de Kubernetes.

1.  Sur la page où vous voyez le problème, cliquez sur l'icône en forme de crayon en haut à gauche.
    Une nouvelle page apparaît avec un texte d'aide.
2.  Cliquez sur le premier bouton bleu, qui a le texte **Edit &lt;page name&gt;**.

    Si vous n'avez jamais créé de fork du dépôt de documentation Kubernetes, vous êtes invité à le faire.
    Créez le fork sous votre nom d'utilisateur GitHub, plutôt que celui d'une autre organisation dont vous pourriez être membre.
    Le fork a généralement une URL telle que `https://github.com/<nom d'utilisateur>/website`, à moins que vous n'ayez déjà un dépôt avec un nom en conflit (website).

    La raison pour laquelle vous êtes invité à créer un fork est que vous n'avez pas le droit de pousser une branche directement vers le dépôt Kubernetes officiel.

3.  L'éditeur GitHub Markdown apparaît avec le fichier source Markdown chargé.
    Faites vos changements.
    Sous l'éditeur, remplissez le formulaire **Propose file change**.
    Le premier champ est le résumé de votre message de validation et ne doit pas dépasser 50 caractères.
    Le deuxième champ est facultatif, mais peut inclure plus de détails si nécessaire.

    {{< note >}}
    Ne pas inclure de références à d’autres demandes GitHub ou pull requests dans votre message de commit.
    Vous pouvez les ajouter ultérieurement à la description de la demande d'extraction.
    {{< /note >}}

    Cliquez sur **Propose file change**.
    La modification est enregistrée en tant que commit dans une nouvelle branche de votre fork, qui porte automatiquement le nom suivant: `patch-1`.

4.  L’écran suivant récapitule les modifications que vous avez apportées en comparant votre nouvelle branche (les boîtes de sélection **head fork** et **compare**) à l'état actuel de **base fork** et **base** branche (`master` sur le dépôt `kubernetes/website` par défaut).
    Vous pouvez modifier n'importe quelle boîte de sélection, mais ne le faites pas maintenant.
    Jetez un coup d’œil à la visionneuse de différences en bas de l’écran et, si tout se présente bien, cliquez sur **Create pull request**.

    {{< note >}}
    Si vous ne voulez pas créer la pull request maintenant, vous pouvez le faire plus tard, en accédant à l'URL principale du référentiel de site Web Kubernetes ou du référentiel de votre fork.
    Le site Web GitHub vous invitera à créer la pull request s'il détecte que vous avez poussé une nouvelle branche vers votre fork.
    {{< /note >}}

5.  L'écran **Open a pull request** apparaît.
    Le sujet de la pull request est identique au message du commit, mais vous pouvez le modifier si nécessaire.
    Le corps est rempli par le reste du message du commit (s'il est présent) et par un modèle.
    Lisez le modèle et remplissez les informations demandées, puis supprimez le texte supplémentaire.
    Laissez la case à cocher sélectionnée **Allow edits from maintainers**.
    Cliquez sur **Create pull request**.

    Toutes nos félicitations !
    Votre pull request est disponible dans [Pull requests](https://github.com/kubernetes/website/pulls).

    Après quelques minutes, vous pouvez prévisualiser le site Web contenant les modifications apportées par votre PR.
    Aller sur l'onglet **Conversation** de votre PR et cliquez sur le lien **Details** pour le déploiement `deploy/netlify`, près du bas de la page.
    Il s'ouvrira dans la même fenêtre.

6.  Attendez la revue.
    En général, les relecteurs sont suggérés par le `k8s-ci-robot`.
    Si un relecteur vous demande d’apporter des modifications, vous pouvez aller à l'onglet **Files changed** et cliquez sur l'icône en forme de crayon sur les fichiers modifiés par la pull request.
    Lorsque vous enregistrez le fichier modifié, un nouveau commit est créé dans la branche surveillée par la pull request.

7.  Si votre modification est acceptée, un relecteur fusionnera votre pull request, et le changement sera visible sur le site Web de Kubernetes quelques minutes plus tard.

Ce n’est qu’un des différents moyens de soumettre une pull request.
Si vous êtes déjà un utilisateur expérimenté de Git et GitHub, vous pouvez utiliser une interface graphique locale ou un client Git en ligne de commande au lieu d'utiliser l'interface utilisateur de GitHub.
Quelques notions de base sur l’utilisation du client Git en ligne de commande sont abordées dans la section [intermédiaire](/docs/contribute/intermediate/) du guide des contributeurs.

## Relecture des pull requests de documentation

Les personnes qui ne sont pas encore des approbateurs ou des relecteurs peuvent quand même relire des pull requests.
Leurs avis ne font pas autorité, ce qui signifie que ces avis seuls ne causeront pas une fusion de la pull request.
Cependant, cela peut toujours être utile.
Même si vous ne laissez aucun commentaire, vous pourrez avoir une idée des conventions des pull requests, de l'étiquette des interactions entre les différents membres et ainsi vous habituer au processus.

1.  Allez à [https://github.com/kubernetes/website/pulls](https://github.com/kubernetes/website/pulls).
    Vous verrez une liste de toutes les pull requests ouvertes visant site web Kubernetes et la documentation.

2.  Par défaut, le seul filtre appliqué est `open`, donc vous ne voyez pas les pull requests qui ont déjà été fermées ou fusionnées.
    C'est une bonne idée d'appliquer le filtre `cncf-cla: yes`, et pour votre premier examen, c'est une bonne idée d'ajouter `size/S` ou `size/XS`.
    Le label `size` est appliqué automatiquement en fonction du nombre de lignes de code que la PR modifie.
    Vous pouvez appliquer des filtres en utilisation les boites de sélection en haut de la page, ou utilisez directement [ce raccourci](https://github.com/kubernetes/website/pulls?q=is%3Aopen+is%3Apr+label%3A%22cncf-cla%3A+yes%22+label%3Asize%2FS) pour voir seulement les petites PRs.
    Tous les filtres sont combinés (opérateur `AND`), de sorte que vous ne pouvez pas rechercher `size/XS` et `size/S` dans la même requête.

3.  Allez à l'onglet **Files changed**.
    Parcourez les modifications introduites dans la PR et, le cas échéant, les problèmes liés.
    Si vous constatez un problème ou des améliorations à apporter, passez la souris sur la ligne et cliquez sur le symbole `+` qui apparaît.

      Vous pouvez taper un commentaire et choisir soit **Add single comment** ou **Start a review**.
      En règle générale, il est préférable de commencer une revue, car elle vous permet de laisser plusieurs commentaires et d’avertir le propriétaire de la PR uniquement lorsque vous avez terminé la revue, plutôt qu'envoyer une notification distincte pour chaque commentaire.

4.  Lorsque vous avez terminé, cliquez sur **Review changes** en haut de la page.
    Vous pouvez résumer votre avis et choisir de commenter, approuver ou demander des modifications.
    Les nouveaux contributeurs doivent toujours choisir **Comment**.

Merci d'avoir commenté une pull request !
Lorsque vous débutez dans le projet, il est judicieux de demander votre avis sur votre pull request.
Le canal Slack `#sig-docs` est un excellent endroit pour faire cela.

## Écrire un article dans le blog

Tout le monde peut écrire un article et le soumettre pour examen.
Les articles ne doivent pas être de nature commerciale et doivent comporter un contenu qui s’appliquera de manière large à la communauté Kubernetes.

Pour soumettre un article, vous pouvez soit le soumettre en utilisant le [Formulaire de soumission de blog Kubernetes](https://docs.google.com/forms/d/e/1FAIpQLSch_phFYMTYlrTDuYziURP6nLMijoXx_f7sLABEU5gWBtxJHQ/viewform), soit en suivant les étapes ci-dessous :

1.  [Signez le CLA](#sign-the-cla) si vous ne l'avez pas encore fait.
2.  Consultez le format Markdown pour les articles de blog existants dans le [dépôt du site web](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts).
3.  Rédigez votre article dans l'éditeur de texte de votre choix.
4.  Sur le même lien à partir de l'étape 2, cliquez sur le bouton **Create new file**.
    Collez votre contenu dans l'éditeur.
    Nommez le fichier pour qu'il corresponde au titre proposé de l'article, mais ne mettez pas la date dans le nom du fichier.
    Les réviseurs de blog travailleront avec vous sur le nom de fichier final et la date de publication du blog.
1.  Lorsque vous enregistrez le fichier, GitHub vous guidera à travers le processus d'une pull request.
1.  Un critique de publication de blog examinera votre soumission et travaillera avec vous sur les commentaires et les détails finaux.
    Lorsque l'article du blog est approuvé, la publication du blog est planifiée.

## Soumettre une étude de cas

Des études de cas montrent comment les entreprises utilisent Kubernetes pour résoudre des problèmes concrets.
Elles sont écrites en collaboration avec l'équipe marketing de Kubernetes, qui est gérée par la CNCF.

Regardez la source des [études de cas existantes](https://github.com/kubernetes/website/tree/master/content/en/case-studies).
Utilisez le [Formulaire de soumission d'étude de cas Kubernetes](https://www.cncf.io/people/end-user-community/) pour soumettre votre proposition.

{{% /capture %}}

{{% capture whatsnext %}}

Si vous êtes à l'aise avec toutes les tâches décrites dans cette rubrique et que vous souhaitez vous engager plus profondément dans l'équipe de documentation de Kubernetes, lisez le [guide de contribution de la documentation intermédiaire](/docs/contribute/intermediate/).

{{% /capture %}}
