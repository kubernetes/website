---
content_type: concept
title: Contribuer à la documentation Kubernetes
description: Contribution documentation Kubernetes
linktitle: Contribuer
main_menu: true
weight: 80
no_list: true
card:
  name: contribuer
  weight: 10
  title: Commencez à contribuer à K8s
---
---

<!-- overview -->

*Kubernetes accueille les améliorations de tous les contributeurs, nouveaux et expérimentés!*

{{< note >}}
Pour en savoir plus sur comment contribuer à Kubernetes en général, consultez la
[documentation des contributeurs](https://www.kubernetes.dev/docs/).

Vous pouvez également lire la
[page](https://contribute.cncf.io/contributors/projects/#kubernetes)
de {{< glossary_tooltip text="CNCF" term_id="cncf" >}} sur la contribution à Kubernetes.
{{< /note >}}

---

Ce site Web est maintenu par [Kubernetes SIG Docs](/docs/contribute/#get-involved-with-sig-docs).

Contributeurs à la documentation Kubernetes:

- Améliorer le contenu existant
- Créer du nouveau contenu
- Traduire la documentation
- Gérer et publier la documentation faisant partie du cycle de mise à jour de Kubernetes



<!-- body -->

## Démarrage

Tout le monde peut ouvrir un ticket concernant la documentation ou contribuer à une modification avec une pull request (PR) au 
[répertoire de GitHub `kubernetes/website`](https://github.com/kubernetes/website).
Vous devez être à l'aise avec [git](https://git-scm.com/) et [GitHub](https://skills.github.com/) pour travailler effectivement dans la communauté Kubernetes.

Pour participer à la documentation:

1. Signez le [Contributor License Agreement (CLA)](https://github.com/kubernetes/community/blob/master/CLA.md) du CNCF.
2. Familiarisez-vous avec le [répertoire de documentation](https://github.com/kubernetes/website) et le 
   [générateur de site statique](https://gohugo.io) du site Web.
3. Assurez-vous de comprendre les processus de base pour
   [soumettre un pull request](/docs/contribute/new-content/open-a-pr/) et
   [examiner les modifications](/docs/contribute/review/reviewing-prs/).

<!-- See https://github.com/kubernetes/website/issues/28808 pour live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart TB
    subgraph third[Soumettre PR]
        direction TB
        U[ ] -.-
        Q[Améliorer contenu] --- N[Créer contenu]
        N --- O[Traduire docs]
        O --- P[Gérer/publier docs faisant partie<br>du cycle de mise à jour de K8s]
 
    end

    subgraph second[Révision]
    direction TB
       T[ ] -.-
       D[Regarder<br>le site Web et<br>répertoire de K8s] --- E[Consulter le <br>générateur de<br>site statique Hugo]
       E --- F[Comprendre les commandes<br>de base de GitHub]
       F --- G[Réviser PR existantes<br>et changer les<br>procès de révision]
    end

    subgraph first[Inscription]
        direction TB
        S[ ] -.-
        B[Signer le<br>Contributor License<br>Agreement de CNCF] --- 
        C[Joindre le canal Slack<br>appelé sig-docs] --- M[Participer aux<br>réunions vidéo hebdomadaires<br>ou réunion sur Slack]
    end
    
    A([fa:fa-user Nouveau<br>Contributeur]) --> first
    A --> second
    A --> third
    A --> H[Posez des questions!!!]
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H,M,Q,N,O,P grey
class S,T,U spacewhite
class first,second,third white
{{</ mermaid >}}
Figure 1. Premiers pas pour un nouveau contributeur.

La figure 1 présente une feuille de route pour les nouveaux contributeurs.  Vous pouvez suivre certaines ou toutes les étapes pour `Inscription` et `Révision`. Vous êtes maintenant prêt à soumettre des PRs qui atteignent vos objectifs de contribution, dont certains listés sous `Soumettre PR`. Encore une fois, les questions sont toujours les bienvenues !

Certaines tâches nécessitent plus de confiance et plus d'accès dans l'organisation Kubernetes. 
Visitez [Participer à SIG Docs](/docs/contribute/participate/) pour plus de détails sur les rôles et les autorisations.


## Votre première contribution

Vous pouvez préparer votre première contribution en révisant à l'avance plusieurs étapes. La figure 2 décrit les étapes et les détails suivent.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph second[Première Contribution]
    direction TB
    S[ ] -.-
    G[Révisez les PRs des<br>autres membres de K8s] -->
    A[Vérifiez la liste de problèmes<br>de kubernetes/website pour <br>des bon premiers PRs] --> B[Soumettez une PR!!]
    end
    subgraph first[Suggested Prep]
    direction TB
       T[ ] -.-
       D[Lisez l'aperçu de contribution] -->E[Lisez le contenu de K8s<br>et guide de style]
       E --> F[Étudiez sur les types de contenu<br>et shortcodes de Hugo]
    end
    

    first ----> second
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,D,E,F,G grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}
Figure 2. Préparation pour votre première contribution.

- Lisez [l'aperçu de la contribution](/docs/contribute/new-content/) pour en savoir plus sur les différentes façons dont vous pouvez contribuer.
- Vérifiez la [liste de problèmes `kubernetes/website`](https://github.com/kubernetes/website/issues/) pour les problèmes qui constituent de bons points d'entrée.
- [Soumettez un pull request dans GitHub](/docs/contribute/new-content/open-a-pr/#changes-using-github) sur la documentation existante et apprenez-en plus sur comment créer des tickets dans GitHub.
- [Révisez des pull requests](/docs/contribute/review/reviewing-prs/) d'autres membres de la communauté Kubernetes pour en vérifier l'exactitude et la langue.
- Lisez le [contenu](/docs/contribute/style/content-guide/) et les [guides de style](/docs/contribute/style/style-guide/)de Kubernetes afin de pouvoir laisser des commentaires éclairés.
- Étudiez sur les [types de contenu de page](/docs/contribute/style/page-content-types/)
  et [shortcodes](/docs/contribute/style/hugo-shortcodes/)de Hugo.

## Prochaines étapes

- Apprenez à [travailler à partir d'un clone local](/docs/contribute/new-content/open-a-pr/#fork-the-repo) du répertoire.
- Documentez [les fonctionnalités](/docs/contribute/new-content/new-features/) d'une nouvelle version.
- Participez à [SIG Docs](/docs/contribute/participate/), et devenez un
  [membre ou réviseur](/docs/contribute/participate/roles-and-responsibilities/).
                       
- Demarrez ou aidez avec une [localisation](/docs/contribute/localization/).

## Engagez-vous dans SIG Docs

[SIG Docs](/docs/contribute/participate/) est le groupe de contributeurs qui publient et maintiennent la documentation Kubernetes et le site Web. S'impliquer dans SIG Docs est un excellent moyen pour les contributeurs Kubernetes (développement de fonctionnalités ou autre) d'avoir un impact important sur le projet Kubernetes.

SIG Docs communique avec différentes méthodes:

- [Joignez `#sig-docs` à l'instance Kubernetes sur Slack](https://slack.k8s.io/). Assurez-vous de vous présenter!
- [Joignez la liste de diffusion `kubernetes-sig-docs`](https://groups.google.com/forum/#!forum/kubernetes-sig-docs), où des discussions plus larges ont lieu et les décisions officielles sont enregistrées.
- Joignez la [réunion vidéo SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs) qui a lieu toutes les deux semaines. Les réunions sont toujours annoncées sur `#sig-docs` et ajoutées au [calendrier des réunions de la communauté Kubernetes](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles). Vous devrez télécharger [Zoom](https://zoom.us/download) ou vous connecter à l'aide d'un téléphone.
- Joignez la réunion stand-up de SIG Docs sur Slack (async) les semaines où la réunion vidéo Zoom en personne n'a pas lieu. Les rendez-vous sont toujours annoncés sur `#sig-docs`. Vous pouvez contribuer à l'un des fils de discussion jusqu'à 24 heures après l'annonce de la réunion.


## Autres façons de contribuer

- Visitez le site de la [communauté Kubernetes](/community/). Participez sur Twitter ou Stack Overflow, découvrez les meetups et événements Kubernetes locaux, et davantage encore.
- Lisez le [cheatsheet de contributor](https://www.kubernetes.dev/docs/contributor-cheatsheet/) pour vous impliquer dans le développement des fonctionnalités de Kubernetes.
- Visitez le site des contributeurs pour en savoir plus sur [les contributeurs Kubernetes](https://www.kubernetes.dev/) et des [ressources supplémentaires pour les contributeurs](https://www.kubernetes.dev/resources/).
- Soumettez un article de [blog ou une étude de cas](/docs/contribute/new-content/blogs-case-studies/).
