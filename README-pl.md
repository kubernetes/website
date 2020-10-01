# Dokumentacja projektu Kubernetes

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Witamy!

W tym repozytorium znajdziesz wszystko, czego potrzebujesz do zbudowania [strony internetowej Kubernetesa wraz z dokumentacją](https://kubernetes.io/). Bardzo nam miło, że chcesz wziąć udział w jej współtworzeniu!

## Twój wkład w dokumentację

Możesz kliknąć w przycisk **Fork** w prawym górnym rogu ekranu, aby stworzyć kopię tego repozytorium na swoim koncie GitHub. Taki rodzaj kopii (odgałęzienia) nazywa się *fork*. Zmieniaj w nim, co chcesz, a kiedy będziesz już gotowy/a przesłać te zmiany do nas, przejdź do swojej kopii i stwórz nowy *pull request*, abyśmy zostali o tym poinformowani.

Po stworzeniu *pull request*, jeden z recenzentów projektu Kubernetes podejmie się przekazania jasnych wskazówek pozwalających podjąć następne działania. Na Tobie, jako właścicielu *pull requesta*, **spoczywa odpowiedzialność za wprowadzenie poprawek zgodnie z uwagami recenzenta.** Może też się zdarzyć, że swoje uwagi zgłosi więcej niż jeden recenzent, lub że recenzję będzie robił ktoś inny, niż ten, kto został przydzielony na początku. W niektórych przypadkach, jeśli zajdzie taka potrzeba, recenzent może poprosić dodatkowo o recenzję jednego z [recenzentów technicznych](https://github.com/kubernetes/website/wiki/Tech-reviewers). Recenzenci zrobią wszystko, aby odpowiedzieć sprawnie, ale konkretny czas odpowiedzi zależy od wielu czynników.

Więcej informacji na temat współpracy przy tworzeniu dokumentacji znajdziesz na stronach:

* [Jak rozpocząć współpracę](https://kubernetes.io/docs/contribute/start/)
* [Podgląd wprowadzanych zmian w dokumentacji](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Szablony stron](http://kubernetes.io/docs/contribute/style/page-templates/)
* [Styl pisania dokumentacji](http://kubernetes.io/docs/contribute/style/style-guide/)
* [Lokalizacja dokumentacji Kubernetes](https://kubernetes.io/docs/contribute/localization/)

## Różne wersje językowe `README.md`

|                                        |                                        |
|----------------------------------------|----------------------------------------|
| [README po angielsku](README.md)       | [README po francusku](README-fr.md)    |
| [README po koreańsku](README-ko.md)    | [README po niemiecku](README-de.md)    |
| [README po portugalsku](README-pt.md)  | [README w hindi](README-hi.md)        |
| [README po hiszpańsku](README-es.md)   | [README po indonezyjsku](README-id.md) |
| [README po chińsku](README-zh.md)      | [README po japońsku](README-ja.md)     |
| [README po wietnamsku](README-vi.md)   | [README po rosyjsku](README-ru.md)     |
| [README po włosku](README-it.md)       | [README po ukraińsku](README-uk.md)    |
|                                        |                                        |

## Jak uruchomić lokalną kopię strony przy pomocy Dockera?

Zalecaną metodą uruchomienia serwisu internetowego Kubernetesa lokalnie jest użycie specjalnego obrazu [Dockera](https://docker.com), który zawiera generator stron statycznych [Hugo](https://gohugo.io).

> Użytkownicy Windows będą potrzebowali dodatkowych narzędzi, które mogą zainstalować przy pomocy [Chocolatey](https://chocolatey.org).

```bash
choco install make
```

> Jeśli wolisz uruchomić serwis lokalnie bez Dockera, przeczytaj [jak uruchomić serwis lokalnie przy pomocy Hugo](#jak-uruchomić-lokalną-kopię-strony-przy-pomocy-hugo) poniżej.

Jeśli [zainstalowałeś i uruchomiłeś](https://www.docker.com/get-started) już Dockera, zbuduj obraz `kubernetes-hugo` lokalnie:

```bash
make container-image
```

Po zbudowaniu obrazu, możesz uruchomić serwis lokalnie:

```bash
make container-serve
```

Aby obejrzeć zawartość serwisu otwórz w przeglądarce adres http://localhost:1313. Po każdej zmianie plików źródłowych, Hugo automatycznie aktualizuje stronę i odświeża jej widok w przeglądarce.

## Jak uruchomić lokalną kopię strony przy pomocy Hugo?

Zajrzyj do [oficjalnej dokumentacji Hugo](https://gohugo.io/getting-started/installing/) po instrukcję instalacji. Upewnij się, że instalujesz rozszerzoną wersję Hugo, określoną przez zmienną środowiskową `HUGO_VERSION` w pliku [`netlify.toml`](netlify.toml#L9).

Aby uruchomić serwis lokalnie po instalacji Hugo, napisz:

```bash
make serve
```

Zostanie uruchomiony lokalny serwer Hugo na porcie 1313. Otwórz w przeglądarce adres http://localhost:1313, aby obejrzeć zawartość serwisu. Po każdej zmianie plików źródłowych, Hugo automatycznie aktualizuje stronę i odświeża jej widok w przeglądarce.

## Społeczność, listy dyskusyjne, uczestnictwo i wsparcie

Zajrzyj na stronę [społeczności](http://kubernetes.io/community/), aby dowiedzieć się, jak możesz zaangażować się w jej działania.

Możesz kontaktować się z gospodarzami projektu za pomocą:

* [Komunikatora Slack](https://kubernetes.slack.com/messages/sig-docs)
* [List dyskusyjnych](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

### Zasady postępowania

Udział w działaniach społeczności Kubernetes jest regulowany przez [Kodeks postępowania](code-of-conduct.md).

## Dziękujemy!

Kubernetes rozkwita dzięki zaangażowaniu społeczności — doceniamy twój wkład w tworzenie naszego serwisu i dokumentacji!
