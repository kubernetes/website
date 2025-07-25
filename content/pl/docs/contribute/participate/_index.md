---
title: Współpraca z SIG Docs
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
---

<!-- overview -->

SIG Docs jest jedną z [special interest group](https://github.com/kubernetes/community/blob/master/sig-list.md)
w ramach
projektu Kubernetes, skoncentrowaną na pisaniu, aktualizowaniu i
utrzymywaniu dokumentacji dla całego Kubernetesa. Zobacz
[SIG Docs z repozytorium społeczności na GitHubie](https://github.com/kubernetes/community/tree/master/sig-docs) aby
uzyskać więcej informacji o SIG.

SIG Docs zaprasza do współpracy nad treścią i recenzjami wszystkich współtwórców. Każdy
może otworzyć pull request (PR) i każdy jest mile widziany do zgłaszania
problemów dotyczących treści lub komentowania pull requestów w trakcie ich realizacji.

Możesz również zostać [członkiem](/docs/contribute/participate/roles-and-responsibilities/#members),
[recenzentem](/docs/contribute/participate/roles-and-responsibilities/#reviewers)
lub [zatwierdzającym](/docs/contribute/participate/roles-and-responsibilities/#approvers).
Te role wymagają większego dostępu i wiążą się z pewnymi
obowiązkami w zakresie zatwierdzania i wprowadzania zmian. Zobacz
[community-membership](https://github.com/kubernetes/community/blob/master/community-membership.md),
aby uzyskać więcej informacji na temat tego, jak działa członkostwo w społeczności Kubernetesa.

Reszta tego dokumentu przedstawia unikalne sposoby, w jakie te role funkcjonują
w ramach SIG Docs, które odpowiada za utrzymanie jednego z najbardziej
widocznych publicznie aspektów Kubernetesa -- strony internetowej i dokumentacji Kubernetes.

<!-- body -->

## SIG Docs przewodniczący {#sig-docs-chairperson}

Każda SIG, w tym SIG Docs, wybiera jednego lub więcej członków SIG do
pełnienia roli przewodniczących. Są oni punktami kontaktowymi pomiędzy SIG
Docs a innymi częściami organizacji Kubernetesa. Wymagają szerokiej wiedzy na
temat struktury projektu Kubernetes jako całości oraz tego, jak SIG
Docs działa w jej ramach. Zobacz [Kierownictwo](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)
z aktualną listą przewodniczących.

## Zespoły i automatyzacja SIG Docs {#sig-docs-teams-and-automation}

Automatyzacja w SIG Docs opiera się na dwóch
różnych mechanizmach: zespołach GitHub i plikach OWNERS.

### Zespoły GitHub {#github-teams}

Istnieją dwie kategorie [zespołów](https://github.com/orgs/kubernetes/teams?query=sig-docs) SIG Docs na GitHubie:

- `@sig-docs-{language}-owners` są zatwierdzającymi i liderami
- `@sig-docs-{language}-reviews` są recenzentami

Każdy z nich może być przywoływany za pomocą `@nazwa` w
komentarzach na GitHubie, aby komunikować się z wszystkimi w tej grupie.

Czasami zespoły Prow i GitHub nakładają się na siebie, ale nie
dokładnie pasują. W celu przypisywania problemów, pull requestów i
wsparcia zatwierdzeń PR, automatyzacja korzysta z informacji z plików `OWNERS`.

### pliki OWNERS i front-matter {#owners-files-and-front-matter}

Projekt Kubernetesa wykorzystuje narzędzie automatyzacji o nazwie prow do
automatyzacji związanej z problemami i pull requestami w GitHub.
[Repozytorium strony internetowej Kubernetesa](https://github.com/kubernetes/website) używa
dwóch [wtyczek prow](https://github.com/kubernetes-sigs/prow/tree/main/pkg/plugins):

- blunderbuss
- approve

Te dwie wtyczki używają plików
[OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) i
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES) w
głównym katalogu repozytorium `kubernetes/website` na
GitHubie, aby kontrolować jak prow działa w ramach tego repozytorium.

Plik OWNERS zawiera listę osób, które są recenzentami i zatwierdzającymi SIG
Docs. Pliki OWNERS mogą również istnieć w podkatalogach i mogą nadpisywać osoby,
które mogą działać jako recenzent lub zatwierdzający dla plików w tym podkatalogu
i jego potomnych. Więcej informacji na temat plików OWNERS można znaleźć w
[OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md).

Ponadto, pojedynczy plik Markdown może wymieniać osoby przeglądające i zatwierdzające w swojej
sekcji front-matter, albo poprzez wymienienie indywidualnych nazw użytkowników GitHub, albo grup GitHub.

Połączenie plików OWNERS i danych front-matter w plikach Markdown
determinuje porady, jakie właściciele PR otrzymują od zautomatyzowanych
systemów, dotyczące tego, kogo poprosić o techniczny i redakcyjny przegląd ich PR.

## Jak działa scalanie (ang. merging) {#how-merging-works}

Kiedy pull request zostanie scalony z gałęzią używaną do publikowania treści, ta treść
jest publikowana na https://kubernetes.io. Aby zapewnić wysoką jakość naszych publikowanych treści,
ograniczamy scalanie pull requestów do zatwierdzających SIG Docs. Oto jak to działa.

- Gdy pull request ma zarówno etykiety `lgtm`, jak i `approve`, nie ma etykiet
  `hold`, i wszystkie testy przechodzą pomyślnie, pull request łączy się automatycznie.
- Członkowie organizacji Kubernetesa i zatwierdzający z SIG Docs mogą
  dodawać komentarze w celu wstrzymania automatycznemu scaleniu danego pull
  requesta (poprzez dodanie komentarza `/hold` lub wstrzymanie komentarza `/lgtm`).
- Każdy członek Kubernetesa może dodać etykietę `lgtm`, dodając komentarz `/lgtm`.
- Tylko zatwierdzający SIG Docs mogą scalić pull request dodając
  komentarz `/approve`. Niektórzy zatwierdzający pełnią również dodatkowe specyficzne
  role, takie jak [PR Wrangler](/docs/contribute/participate/pr-wranglers/)
  lub [przewodniczący SIG Docs](#sig-docs-chairperson).



## {{% heading "whatsnext" %}}


Więcej informacji na temat wnoszenia wkładu w dokumentację Kubernetesa można znaleźć w:

- [Wnoszenie nowej treści](/docs/contribute/new-content/)
- [Przeglądanie treści](/docs/contribute/review/reviewing-prs)
- [Przewodnik stylu dokumentacji](/docs/contribute/style/)
