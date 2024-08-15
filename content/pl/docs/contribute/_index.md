---
content_type: concept
title: Współtwórz dokumentację K8s
linktitle: Weź udział
main_menu: true
weight: 80
card:
  name: contribute
  weight: 10
  title: Współtwórz K8s
---

<!-- overview -->

*Kubernetes zaprasza do współpracy wszystkich - zarówno nowicjuszy, jak i doświadczonych!*

{{< note >}}
Aby dowiedzieć się więcej ogólnych informacji o współpracy przy tworzeniu Kubernetesa, zajrzyj
do [contributor documentation](https://www.kubernetes.dev/docs/).

Warto także zapoznać się z 
[informacjami](https://contribute.cncf.io/contributors/projects/#kubernetes)
{{< glossary_tooltip text="CNCF" term_id="cncf" >}}
na temat współpracy w ramach projektu Kubernetes.
{{< /note >}}

---

Tym serwisem www opiekuje się [Kubernetes SIG Docs](/docs/contribute/#get-involved-with-sig-docs).

Współtwórcy dokumentacji Kubernetesa:

- Ulepszają istniejącą zawartość
- Tworzą nowe treści
- Tłumaczą dokumentację
- Zarządzają i publikują dokumentację w ramach cyklu wydawniczego Kubernetesa

<!-- body -->

## Jak zacząć?

Każdy może otworzyć zgłoszenie dotyczące dokumentacji lub zaproponować zmianę poprzez
*pull request* (PR) do
[repozytorium GitHub `kubernetes/website`](https://github.com/kubernetes/website).
Aby móc sprawnie funkcjonować w społeczności Kubernetes,
wymagana jest pewna biegłość w korzystaniu z
[git-a](https://git-scm.com/) i
[GitHub-a](https://skills.github.com/).

Aby zaangażować się w prace nad dokumentacją należy:

1. Podpisać [Contributor License Agreement](https://github.com/kubernetes/community/blob/master/CLA.md) CNCF.
2. Zapoznać się z [repozytorium dokumentacji](https://github.com/kubernetes/website)
   i z [generatorem statycznej strony](https://gohugo.io) www.
3. Zrozumieć podstawowe procesy [otwierania *pull request*](/docs/contribute/new-content/new-content/) oraz
   [recenzowania zmian](/docs/contribute/review/reviewing-prs/).

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart TB
subgraph third[Otwórz PR]
direction TB
U[ ] -.-
Q[Ulepsz zawartość] --- N[Dodaj nową]
N --- O[Przetłumacz dokumentację]
O --- P[Zarządzaj dokumentacją<br>przy kolejnych<br>wydaniach K8s]

end

subgraph second[Recenzuj]
direction TB
   T[ ] -.-
   D[Przejrzyj<br>repozytorium<br>kubernetes/website] --- E[Pobierz generator<br>stron statycznych<br>Hugo]
   E --- F[Zrozum podstawowe<br>polecenia GitHub-a]
   F --- G[Zrecenzuj otwarty PR<br>i zmień procesy<br>recenzji]
end

subgraph first[Zapisz się]
    direction TB
    S[ ] -.-
    B[Podpisz CNCF<br>Contributor<br>License Agreement] --- C[Dołącz do Slack-a<br>sig-docs]
    C --- V[Zapisz się na listę<br>kubernetes-sig-docs]
    V --- M[Weź udział w cotygodniowych<br>spotkaniach sig-docs]
end

A([fa:fa-user Nowy<br>uczestnik]) --> first
A --> second
A --> third
A --> H[Zapytaj!!!]

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H,M,Q,N,O,P,V grey
class S,T,U spacewhite
class first,second,third white
{{</ mermaid >}}
Schemat 1. - Jak rozpocząć współpracę

Schemat 1 przeznaczony jest dla osób, które chcą zacząć współtworzyć Kubernetesa. Przejdź część lub wszystkie kroki opisane w częściach `Zapisz się` i `Recenzuj`. Teraz już możesz tworzyć nowe PR, zgodnie z sugestiami w `Otwórz PR`. I jak zawsze, pytania mile widziane!

Do realizacji niektórych zadań potrzeba wyższego poziomu zaufania i odpowiednich uprawnień w organizacji Kubernetes.
Zajrzyj do [Participating in SIG Docs](/docs/contribute/participate/) po więcej szczegółów dotyczących
ról i uprawnień.

## Pierwsze kroki

Zapoznaj się z krokami opisanymi na schemacie 2, aby się lepiej przygotować.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph second[Pierwszy wkład]
    direction TB
    S[ ] -.-
    G[Obejrzyj PR-y<br>innych uczestników K8s] -->
    A[Przejrzyj listę zgłoszonych spraw<br>na kubernetes/website<br>po pomysł na nowy PR] --> B[Otwórz PR!!]
    end
    subgraph first[Sugerowane przygotowanie]
    direction TB
       T[ ] -.-
       D[Przeczytaj wprowadzenie<br>dla współtwórców] -->E[Przeczytaj K8s content<br>and style guides]
       E --> F[Poczytaj o typach zawartości<br>stron i skrótach Hugo]
    end

    first ----> second

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,D,E,F,G grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}
Schemat 2. - Jak się przygotować

- Przeczytaj [Contribution overview](/docs/contribute/new-content/),
  aby dowiedzieć się o różnych sposobach współpracy.
- Zajrzyj do [Contribute to kubernetes/website](https://github.com/kubernetes/website/contribute),
  aby znaleźć dobre zgłoszenie na początek.
- [Otwórz *pull request* przy pomocy GitHub-a](/docs/contribute/new-content/new-content/#changes-using-github)
  dotyczący zmiany istniejącej dokumentacji i dowiedz się, jak otwierać zgłoszenia przy GitHub-ie.
- [Zrecenzuj *pull requests*](/docs/contribute/review/reviewing-prs/)
  innego członka społeczności Kubernetes pod kątem dokładności i stylu.
- Zapoznaj się z poradnikami Kubernetesa dotyczącymi [zawartości](/docs/contribute/style/content-guide/)
  i [stylu](/docs/contribute/style/style-guide/), aby twoje uwagi były zgodne z tymi wytycznymi.
- Przeczytaj o [różnych typach zawartości na stronie](/docs/contribute/style/page-content-types/)
  i [skrótach Hugo](/docs/contribute/style/hugo-shortcodes/).

## Co dalej?

- Naucz się, jak [pracować z lokalną kopią](/docs/contribute/new-content/new-content/#fork-the-repo)
  repozytorium.
- Udokumentuj [nowe funkcjonalności](/docs/contribute/new-content/new-features/).
- Włącz się w prace [SIG Docs](/docs/contribute/participating/)
  i zostań [członkiem organizacji lub recenzentem](/docs/contribute/participating/#roles-and-responsibilities).
- Pomagaj przy [tłumaczeniu](/docs/contribute/localization/).

## Włącz się w prace SIG Docs

[SIG Docs](/docs/contribute/participating/) to grupa, która publikuje
i utrzymuje dokumentację Kubernetesa i jej stronę www. Zaangażowanie się w prace SIG Docs
to doskonała okazja dla współtwórców Kubernetesa (rozwijających nowe funkcjonalności
lub działających w innych obszarach), aby wywierać wpływ na cały projekt Kubernetes.

Aby włączyć się w komunikację w ramach SIG Docs, możesz:

- [Dołączyć do kanału `#sig-docs` na komunikatorze Slack dla Kubernetesa](https://slack.k8s.io/). Nie zapomnij
  się przedstawić!
- [Zapisać się na listę `kubernetes-sig-docs`](https://groups.google.com/forum/#!forum/kubernetes-sig-docs),
  na której prowadzone są dyskusje o szerszym zasięgu i zapisywane oficjalne decyzje.
- Dołączyć do [spotkania wideo SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs) odbywającego się co dwa tygodnie. Spotkania są zawsze zapowiadane na `#sig-docs` i dodawane do [kalendarza spotkań społeczności Kubernetesa](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=Europe/Warsaw). Będziesz potrzebował komunikatora [Zoom](https://zoom.us/download) lub telefonu, aby się wdzwonić.
- Dołączyć do spotkania SIG Docs na Slacku organizowanego w tych tygodniach, kiedy nie ma spotkania na Zoomie. Informacja o spotkaniu zawsze ogłaszana jest na  `#sig-docs`. W rozmowach prowadzonych w różnych wątkach na tym kanale można brać udział do 24 godzin od chwili ogłoszenia.

## Inne sposoby współpracy

- Odwiedź [stronę społeczności Kubernetesa](/community/). Korzystaj z Twittera i Stack Overflow, dowiedz się o spotkaniach lokalnych grup Kubernetesa, różnych wydarzeniach i nie tylko.
- Przeczytaj [ściągawkę dla współtwórców](https://www.kubernetes.dev/docs/contributor-cheatsheet/contributor-cheatsheet/), aby zaangażować się w dalszy rozwój Kubernetesa.
- Odwiedź stronę [Kubernetes Contributors](https://www.kubernetes.dev/) i zajrzyj do [dodatkowych zasobów](https://www.kubernetes.dev/resources/).
- Przygotuj [wpis na blogu lub *case study*](/docs/contribute/new-content/blogs-case-studies/).
