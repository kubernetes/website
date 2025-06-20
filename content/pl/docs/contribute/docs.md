---
content_type: concept
title: Współtworzenie dokumentacji Kubernetes
weight: 09
card:
  name: contribute
  weight: 11
  title: Współtworzenie dokumentacji
---


Ta strona jest utrzymywana przez [Kubernetes SIG Docs](/docs/contribute/#get-involved-with-sig-docs).
Projekt Kubernetes chętnie przyjmie pomoc od wszystkich współtwórców, zarówno nowych, jak i doświadczonych!

Współtwórcy dokumentacji Kubernetesa:

- Ulepszają istniejącą treść
- Tworzą nowe treści
- Tłumaczą dokumentację
- Zarządzają i publikują części dokumentacji cyklu wydawniczego Kubernetesa

Zespół blogowy, będący częścią SIG Docs, pomaga zarządzać oficjalnymi blogami. Aby
dowiedzieć się więcej, przeczytaj [jak współtworzyć blogi Kubernetesa](/docs/contribute/blog/).

---

{{< note >}}
Aby dowiedzieć się więcej o kontrybucji w Kubernetesach, zobacz
ogólną [dokumentację współtwórców](https://www.kubernetes.dev/docs/).
{{< /note >}}


<!-- body -->

## Rozpoczęcie pracy {#getting-started}

Każdy może otworzyć zgłoszenie dotyczące
dokumentacji lub wnieść zmianę za pomocą pull request
(PR) w [repozytorium `kubernetes/website` na GitHubie](https://github.com/kubernetes/website).
Musisz umieć
sprawnie korzystać z
[git](https://git-scm.com/) i [GitHub](https://skills.github.com/),
aby efektywnie pracować w społeczności Kubernetesa.

Aby zaangażować się w tworzenie dokumentacji:

1. Podpisz [umowę licencyjną współtwórcy](https://github.com/kubernetes/community/blob/master/CLA.md) CNCF.
2. Zapoznaj się z [repozytorium dokumentacji](https://github.com/kubernetes/website)
   oraz [generatorem statycznych stron](https://gohugo.io) witryny.
3. Upewnij się, że rozumiesz podstawowe procesy
   [otwierania pull requesta](/docs/contribute/new-content/open-a-pr/) i [przeglądania zmian](/docs/contribute/review/reviewing-prs/).
   

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart TB
subgraph third[Otwórz PR]
direction TB
U[ ] -.-
Q[Popraw treść] --- N[Utwórz treść]
N --- O[Tłumacz dokumentację]
O --- P[Zarządzaj/publikuj części dokumentów<br>w cyklu wydania K8s]

end

subgraph second[Przegląd]
direction TB
   T[ ] -.-
   D[Przejrzyj repozytorium<br>kubernetes/website] --- E[Sprawdź generator<br>stron statycznych Hugo]
   E --- F[Zrozum podstawowe<br>komendy GitHub]
   F --- G[Przejrzyj otwarte PR<br>i procesy przeglądu zmian]
end

subgraph first[Rejestracja]
    direction TB
    S[ ] -.-
    B[Podpisz umowę o<br>licencję wniesienia<br>wkładu CNCF] --- C[Dołącz do kanału<br>Slack sig-docs]
    C --- V[Dołącz do listy<br>mailowej kubernetes-sig-docs]
    V --- M[Uczestnicz w cotygodniowych<br>spotkaniach sig-docs<br>lub spotkaniach na Slacku]
end

A([fa:fa-user Nowy<br>Współtwórca]) --> first
A --> second
A --> third
A --> H[Pytaj!!!]


classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H,M,Q,N,O,P,V grey
class S,T,U spacewhite
class first,second,third white
{{</ mermaid >}}
Rysunek 1. Jak zacząć jako nowy współtwórca.

Rysunek 1 przedstawia plan działania dla nowych współtwórców. Możesz
podążać za niektórymi lub wszystkimi krokami dotyczącymi `Sign up` i
`Review`. Teraz możesz otwierać PR spełniające Twoje cele kontrybucji -
niektóre z nich znajdziesz w sekcji `Open PR`. Jak zawsze, pytania są mile widziane!

Niektóre zadania wymagają większego zaufania i większego dostępu w
organizacji Kubernetes. Zobacz
[Udział w SIG Docs](/docs/contribute/participate/) po więcej szczegółów na temat ról i uprawnień.

## Twoja pierwsza kontrybucja {#your-first-contribution}

Aby przygotować się do twojej pierwszej kontrybucji, warto wcześniej przeanalizować
kilka kroków. Rysunek 2 przedstawia ich schemat, a szczegółowe informacje znajdują się poniżej.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph second[Pierwszy wkład]
    direction TB
    S[ ] -.-
    G[Przeglądaj PR od innych<br>członków K8s] -->
    A[Sprawdź listę zgłoszeń<br>kubernetes/website<br>dobre na pierwszy PR] --> B[Otwórz PR!!]
    end
    subgraph first[Zalecane przygotowanie]
    direction TB
       T[ ] -.-
       D[Przeczytaj współtworzenie nowych treści] -->E[Przeczytaj przewodniki<br>po treści K8s i stylach]
       E --> F[Poznaj typy treści<br>stron Hugo<br>i shortcode'y]
    end
    

    first ----> second
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,D,E,F,G grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}
Rysunek 2. Przygotowanie do twojej pierwszej kontrybucji.

- Przeczytaj [Współtworzenie nowych treści](/docs/contribute/new-content/),
  aby dowiedzieć się o różnych sposobach, w jakie możesz wnieść wkład.
- Sprawdź [listę problemów `kubernetes/website`](https://github.com/kubernetes/website/issues/),
  aby znaleźć problemy, które są dobrymi punktami wyjścia.
- [Otwórz pull request używając GitHub](/docs/contribute/new-content/open-a-pr/#changes-using-github)
  do istniejącej dokumentacji i dowiedz się więcej o zgłaszaniu problemów na GitHub.
- [Przeglądaj pull requesty](/docs/contribute/review/reviewing-prs/) od innych
  członków społeczności Kubernetesa pod kątem dokładności i języka.
- Przeczytaj [przewodnik treści](/docs/contribute/style/content-guide/) i
  [przewodniki stylu](/docs/contribute/style/style-guide/) dla Kubernetesa, aby móc zostawiać merytoryczne komentarze.
- Dowiedz się więcej o [typach treści stron](/docs/contribute/style/page-content-types/)
  i [shortcode`ach Hugo](/docs/contribute/style/hugo-shortcodes/).

## Uzyskiwanie pomocy przy współtworzeniu {#getting-help-when-contributing}

Rozpoczęcie współpracy nad projektem może być wyzwaniem.
[Ambasadorzy Nowych Współtwórców](https://github.com/kubernetes/website#new-contributor-ambassadors) pomogą Ci
przejść przez pierwsze kroki. Możesz skontaktować się z nimi na
[Kubernetes Slack](https://slack.k8s.io/), najlepiej na kanale `#sig-docs`. Istnieje również [rozmowa powitalna dla nowych współtwórców](https://www.kubernetes.dev/resources/calendar/),
która
odbywa się w pierwszy wtorek każdego miesiąca. Możesz tu
wchodzić w interakcje z Ambasadorami Nowych Współtwórców i uzyskać odpowiedzi na swoje pytania.

## Następne kroki. {#next-steps}

- Naucz się [pracować z lokalną kopią](/docs/contribute/new-content/open-a-pr/#fork-the-repo)
  repozytorium.
- Zredaguj [funkcje w wydaniu](/docs/contribute/new-content/new-features/).
- Weź udział w [SIG Docs](/docs/contribute/participate/) i zostań
  [członkiem lub recenzentem](/docs/contribute/participate/roles-and-responsibilities/).
                       
- Rozpocznij lub pomóż w [lokalizacji](/docs/contribute/localization/).

## Zaangażuj się w SIG Docs. {#get-involved-with-sig-docs}

[SIG Docs](/docs/contribute/participate/) to grupa współtwórców, którzy
publikują i utrzymują dokumentację Kubernetesa oraz stronę internetową.
Zaangażowanie się w SIG Docs to doskonały sposób dla współtwórców
Kubernetes (rozwój funkcji lub inne) na wywarcie dużego wpływu na projekt Kubernetesa.

SIG Dokumentacja komunikuje się za pomocą różnych metod:

- [Dołącz do `#sig-docs` na Slacku Kubernetes](https://slack.k8s.io/).
  I nie zapomnij się przedstawić!
- [Dołącz do listy mailingowej `kubernetes-sig-docs`](https://groups.google.com/forum/#!forum/kubernetes-sig-docs),
  gdzie odbywają się szersze dyskusje i zapisywane są oficjalne decyzje.
- Dołącz do [spotkania wideo SIG Docs](https://github.com/kubernetes/community/tree/master/sig-docs) odbywającego się
  co dwa tygodnie. Spotkania są zawsze ogłaszane na `#sig-docs` i dodawane do
  [kalendarza spotkań społeczności Kubernetes](https://calendar.google.com/calendar/embed?src=cgnt364vd8s86hr2phapfjc6uk%40group.calendar.google.com&ctz=America/Los_Angeles).
  Będziesz musiał pobrać [klienta Zoom](https://zoom.us/download) lub zadzwonić z telefonu.
- Dołącz do asynchronicznego spotkania SIG Docs na Slacku w tygodniach, kiedy
  spotkanie wideo na Zoomie na żywo się nie odbywa. Spotkania są zawsze ogłaszane na
  `#sig-docs`. Możesz wnieść swój wkład w dowolny z wątków do 24 godzin po ogłoszeniu spotkania.

## Inne sposoby wnoszenia wkładu {#other-ways-to-contribute}

- Odwiedź [stronę społeczności Kubernetesa](/community/). Skorzystaj z Twittera lub
  Stack Overflow, dowiedz się o lokalnych spotkaniach i wydarzeniach Kubernetesa i nie tylko.
- Przeczytaj [ściągawkę współtwórcy](https://www.kubernetes.dev/docs/contributor-cheatsheet/),
  aby zaangażować się w rozwój funkcji Kubernetesa.
- Odwiedź stronę dla współtwórców, aby dowiedzieć się więcej o
  [współtwórcach Kubernetesa](https://www.kubernetes.dev/) oraz [dodatkowych zasobach dla współtwórców](https://www.kubernetes.dev/resources/).
- Dowiedz się, jak [współtworzyć oficjalne blogi](/docs/contribute/blog/)
- Prześlij [studium przypadku](/docs/contribute/new-content/case-studies/)
