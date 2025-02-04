---
title: Współtworzenie nowych treści
content_type: concept
main_menu: true
weight: 20
---



<!-- overview -->

Ta sekcja zawiera informacje, które
powinieneś znać przed dodaniem nowej treści. 
<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
    subgraph second[Zanim zaczniesz]
    direction TB
    S[ ] -.-
    A[Podpisz CNCF CLA] --> B[Wybierz gałąź Git]
    B --> C[Jeden język na PR]
    C --> F[Sprawdź<br>narzędzia dla współtwórców]
    end
    subgraph first[Podstawy współtworzenia]
    direction TB
       T[ ] -.-
       D[Pisz dokumentację w Markdown<br>i buduj stronę za pomocą Hugo] --- E[Kod źródłowy w GitHub]
       E --- G[Folder '/content/../docs' zawiera dokumentację<br>w wielu językach]
       G --- H[Zapoznaj się z typami stron<br>i shortcode'ami w Hugo]
    end
    

    first ----> second
     

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}

***Rysunek - Przygotowanie nowej treści***

Powyższy rysunek przedstawia informacje, które powinieneś znać przed
przesłaniem nowej treści. Szczegóły znajdują się poniżej.



<!-- body -->

## Podstawy kontrybucji {#contributing-basics}

- Napisz dokumentację Kubernetesa w formacie Markdown i
  zbuduj stronę Kubernetesa za pomocą [Hugo](https://gohugo.io/).
- Dokumentacja Kubernetesa używa [CommonMark](https://commonmark.org/) jako swojej wersji Markdown.
- Źródło znajduje się na [GitHub](https://github.com/kubernetes/website).
  Dokumentację Kubernetesa można znaleźć w
  `/content/en/docs/`. Część dokumentacji referencyjnej jest
  automatycznie generowana ze skryptów w katalogu `update-imported-docs/`.
- [Typy zawartości strony](/docs/contribute/style/page-content-types/)
  opisują sposób prezentacji treści dokumentacji w Hugo.
- Możesz użyć [kodów Docsy](https://www.docsy.dev/docs/adding-content/shortcodes/) lub [niestandardowych skrótów Hugo](/docs/contribute/style/hugo-shortcodes/), aby wspierać dokumentację Kubernetes.
- Oprócz standardowych kodów Hugo, w naszej dokumentacji
  używamy wielu [niestandardowych kodów Hugo](/docs/contribute/style/hugo-shortcodes/),
  aby kontrolować prezentację treści.
- Dokumentacja jest dostępna w wielu językach w katalogu `/content/`. Każdy język
  ma własny folder z dwuliterowym kodem określonym przez
  [standard ISO 639-1](https://www.loc.gov/standards/iso639-2/php/code_list.php) . Na
  przykład, źródło dokumentacji angielskiej jest przechowywane w `/content/en/docs/`.
- Aby uzyskać więcej informacji na temat wnoszenia wkładu
  do dokumentacji w wielu językach lub rozpoczęcia nowego
  tłumaczenia, zobacz [Lokalizowanie](/docs/contribute/localization).

## Zanim zaczniesz {#before-you-begin}

### Podpisz CNCF CLA {#sign-the-cla}

Wszyscy współtwórcy Kubernetesa **muszą** przeczytać
[Przewodnik dla Współtwórców](https://github.com/kubernetes/community/blob/master/contributors/guide/README.md) i
[podpisać Umowę Licencyjną Współtwórcy (CLA)](https://github.com/kubernetes/community/blob/master/CLA.md) .


Pull requesty od autorów, którzy nie podpisali umowy CLA, nie
przechodzą testów automatycznych. Imię i adres e-mail, które podasz,
muszą zgadzać się z tymi ustawionymi w twoim `git config`, a twoje
imię i adres e-mail w git muszą być takie same jak te używane dla CNCF CLA.

### Wybierz gałąź w Git {#choose-which-git-branch-to-use}

Podczas otwierania pull requesta musisz
wiedzieć z góry, na której gałęzi oprzeć swoją pracę.

Scenariusz | Gałąź
:---------|:------------
Istniejąca lub nowa treść w języku angielskim dla bieżącego wydania | `main`
Treść dla wydania zmiany funkcji | Gałąź, która odpowiada głównej i mniejszej wersji, w której znajduje się zmiana funkcji, używając wzorca `dev-<version>`. Na przykład, jeśli funkcja zmienia się w wydaniu `v{{< skew nextMinorVersion >}}`, należy dodać zmiany w dokumentacji do gałęzi ``dev-{{< skew nextMinorVersion >}}``.
Treść w innych językach (lokalizacje) | Użyj konwencji danej lokalizacji. Zobacz [Strategia rozgałęzień lokalizacji](/docs/contribute/localization/#branch-strategy) po więcej informacji.

Jeśli nadal nie masz pewności, którą gałąź wybrać, zapytaj na `#sig-docs` na Slacku.

{{< note >}} Jeśli już zgłosiłeś swoj pull request i wiesz, że była to
 niepoprawna gałąź bazowa, możesz ją zmienić (ty i tylko ty, zgłaszający). {{<
/note >}}

### Języki na PR {#languages-per-pr}

Ogranicz żądania pull request do jednego języka na PR.
Jeśli musisz wprowadzić identyczną zmianę w tym samym
fragmencie kodu w wielu językach, otwórz osobne PR dla każdego języka.

## Narzędzia dla współtwórców {#tools-for-contributors}

Katalog [narzędzi dla współtwórców dokumentacji](https://github.com/kubernetes/website/tree/main/content/en/docs/doc-contributor-tools)
w repozytorium
`kubernetes/website` zawiera narzędzia, wspierające proces współtworzenia dokumentacji.

