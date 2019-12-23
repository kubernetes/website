# Dokumentacja Kubernetes

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Witamy!

W tym repozytorium znajdziesz wszystko, co potrzebujesz do zbudowania [strony internetowej Kubernetes wraz z dokumentacją](https://kubernetes.io/). Bardzo nam miło, że chcesz wziąć w tym udział!

## Twój wkład w dokumentację

Możesz kliknąć w przycisk **Fork** w prawym górnym rogu ekranu, aby stworzyć kopię tego repozytorium na swoim koncie GitHub. Taki rodzaj kopii (odgałęzienia) nazywa się *fork*. Zmieniaj w nim, co chcesz, a kiedy będziesz już gotowy/a przesłać te zmiany do nas, przejdź do swojej kopii i stwórz nowy *pull request*, abyśmy zostali o tym poinformowani.

Po stworzeniu *pull request*, jeden z recenzentów Kubernetes podejmie się zadania przekazania jasnych wskazówek pozwalających podjąć konkretne działania. Na Tobie, jako właścicielu *pull request*, **spoczywa odpowiedzialność za wprowadzenie poprawek zgodnie z uwagami recenzenta Kubernetes.** Może też się zdarzyć, że swoje uwagi zgłosi więcej niż jeden recenzent, lub że recenzję będzie robił ktoś inny, niż ten, kto został przydzielony na początku. W niektórych przypadkach, jeśli zajdzie taka potrzeba, recenzent może poprosić dodatkowo o recenzję jednego z [recenzentów technicznych Kubernetes](https://github.com/kubernetes/website/wiki/Tech-reviewers). Recenzenci zrobią wszystko, aby odpowiedzieć sprawnie, ale konkretny czas odpowiedzi zależy do różnych czynników.

Więcej informacji na temat współpracy przy tworzeniu dokumentacji znajdziesz na stronach:

* [Start contributing](https://kubernetes.io/docs/contribute/start/)
* [Staging Your Documentation Changes](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Using Page Templates](http://kubernetes.io/docs/contribute/style/page-templates/)
* [Documentation Style Guide](http://kubernetes.io/docs/contribute/style/style-guide/)
* [Localizing Kubernetes Documentation](https://kubernetes.io/docs/contribute/localization/)

## Różne wersje językowe `README.md`
|  |  |
|---|---|
|[French README](README-fr.md)|[Korean README](README-ko.md)|
|[German README](README-de.md)|[Portuguese README](README-pt.md)|
|[Hindi README](README-hi.md)|[Spanish README](README-es.md)|
|[Indonesian README](README-id.md)|[Chinese README](README-zh.md)|
|[Japanese README](README-ja.md)|[Polish README](README-pl.md)|
|||

## Jak uruchomić serwis internetowy lokalnie przy pomocy Dockera

Zalecaną metodą uruchomienia serwisu internetowego Kubernetes lokalnie jest użycie specjalnego obrazu [Dockera](https://docker.com), który zawiera generator stron statycznych [Hugo](https://gohugo.io).

> Użytkownicy Windows będą potrzebowali dodatkowych narzędzi, które mogą zainstalować przy pomocy [Chocolatey](https://chocolatey.org). `choco install make`

> Jeśli wolisz uruchomić serwis lokalnie bez Dockera, przeczytaj [jak uruchomić serwis lokalnie przy pomocy Hugo](#jak-uruchomić-serwis-lokalnie-przy-pomocy-hugo) poniżej.

Jeśli [zainstalowałeś i uruchomiłeś](https://www.docker.com/get-started) już Dockera, zbuduj obraz `kubernetes-hugo` Dockera lokalnie:

```bash
make docker-image
```

Po zbudowaniu obrazu, możesz uruchomić serwis lokalnie:

```bash
make docker-serve
```

Otwórz w przeglądarce adres http://localhost:1313, aby obejrzeć zawartość serwisu. Po każdej zmianie plików źródłowych, Hugo automatycznie aktualizuje stronę i odświeża jej widok w przeglądarce.

## Jak uruchomić serwis lokalnie przy pomocy Hugo

Zajrzyj do [oficjalnej dokumentacji Hugo](https://gohugo.io/getting-started/installing/) po instrukcję instalacji. Upewnij się, że instalujesz rozszerzoną wersję Hugo, określoną przez zmienną środowiskową `HUGO_VERSION` w pliku [`netlify.toml`](netlify.toml#L9).

Aby uruchomić serwis lokalnie po instalacji Hugo, napisz:

```bash
make serve
```

Zostanie uruchomiony lokalny serwer Hugo na porcie 1313. Otwórz przeglądarkę na stronie http://localhost:1313, aby obejrzeć zawartość serwisu. Po każdej zmianie plików źródłowych, Hugo automatycznie aktualizuje stronę i odświeża jej widok w przeglądarce.

## Społeczność, listy dyskusyjne, uczestnictwo i wsparcie

Zajrzyj na stronę [społeczności](http://kubernetes.io/community/), aby dowiedzieć się, jak możesz się zaangażować w jej działania.

Możesz kontaktować się z gospodarzami projektu za pomocą:

* [Slack-a](https://kubernetes.slack.com/messages/sig-docs)
* [List dyskusyjnych](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

### Zasady postępowania

Udział w działaniach społeczności Kubernetes jest regulowany przez [Zasady postępowania Kubernetes](code-of-conduct.md).

## Dziękujemy!

Kubernetes rozkwita dzięki zaangażowaniu społeczności — doceniamy twój wkład w tworzenie naszego serwisu i dokumentacji!
