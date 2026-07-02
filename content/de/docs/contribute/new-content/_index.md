---
title: Neue Inhalte beitragen
content_type: concept
main_menu: true
weight: 25
simple_list: true
---

<!-- overview -->

Dieser Abschnitt enthält Informationen, die du kennen solltest, bevor du neue Inhalte beisteuern.

Es gibt auch eigene Seiten zum Einreichen von [Fallstudien](/docs/contribute/new-content/case-studies)
und [Blog-Artikeln](/docs/contribute/blog/).

<!-- body -->

## Ablauf für neue Inhalte

{{< mermaid >}}
flowchart LR 
    subgraph second[Vor dem Start]
    direction TB
    S[ ] -.-
    A[CNCF CLA unterzeichnen] --> B[Git-Branch wählen]
    B --> C[Eine Sprache pro PR]
    C --> F[Contributor-Tools<br>ansehen]
    end
    subgraph first[Grundlagen]
    direction TB
       T[ ] -.-
       D[Docs in Markdown schreiben<br>und Site mit Hugo erstellen] --- E[Quellcode auf GitHub]
       E --- G['/content/../docs' enthält Docs<br>für mehrere Sprachen]
       G --- H[Hugo-Seitentypen und<br>Shortcodes prüfen]
    end
    first ----> second
classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,B,C,D,E,F,G,H grey
class S,T spacewhite
class first,second white
{{</ mermaid >}}

***Abbildung – Vorbereitung für neue Inhalte***

## Grundlagen des Beitragens

- Kubernetes-Dokumentation wird in Markdown geschrieben und die Website wird mit [Hugo](https://gohugo.io/) erstellt.
- Kubernetes-Dokumentation verwendet [CommonMark](https://commonmark.org/) als Markdown-Variante.
- Der Quellcode liegt auf [GitHub](https://github.com/kubernetes/website). Die Kubernetes-Dokumentation findest du unter `/content/en/docs/`.
- [Seiteninhaltstypen](/docs/contribute/style/page-content-types/) beschreiben die Darstellung von Dokumentationsinhalten in Hugo.
- Du kannst [Docsy Shortcodes](https://www.docsy.dev/docs/adding-content/shortcodes/) oder [benutzerdefinierte Hugo Shortcodes](/docs/contribute/style/hugo-shortcodes/) verwenden.
- Dokumentationsquellen sind in mehreren Sprachen unter `/content/` verfügbar. Jede Sprache hat einen eigenen Ordner mit einem zweistelligen Code gemäß dem [ISO 639-1 Standard](https://www.loc.gov/standards/iso639-2/php/code_list.php).

## Vor dem Start {#before-you-begin}

### CNCF CLA unterzeichnen {#sign-the-cla}

Alle Kubernetes-Mitwirkenden **müssen** den
[Contributor-Leitfaden](https://github.com/kubernetes/community/blob/main/contributors/guide/README.md)
lesen und die [Contributor License Agreement (CLA)](https://github.com/kubernetes/community/blob/main/CLA.md) unterzeichnen.

Pull Requests von Mitwirkenden, die die CLA nicht unterzeichnet haben, schlagen bei automatisierten Tests fehl.

### Den richtigen Git-Branch wählen

Szenario | Branch
:---------|:------------
Bestehende oder neue englische Inhalte für das aktuelle Release | `main`
Inhalte für ein Feature-Change-Release | Der Branch, der zur Haupt- und Nebenversion gehört, nach dem Muster `dev-<version>`
Inhalte in anderen Sprachen (Lokalisierungen) | Konvention der Lokalisierung verwenden. Siehe [Lokalisierungs-Branch-Strategie](/docs/contribute/localization/#branch-strategy)

### Eine Sprache pro PR

Beschränke Pull Requests auf eine Sprache pro PR.

## Tools für Mitwirkende

Das Verzeichnis [doc contributors tools](https://github.com/kubernetes/website/tree/main/content/en/docs/doc-contributor-tools)
im `kubernetes/website`-Repository enthält Tools, die den Beitragsprozess erleichtern.

## {{% heading "whatsnext" %}}

* Lies mehr über das Einreichen von [Blog-Artikeln](/docs/contribute/blog/article-submission/).
