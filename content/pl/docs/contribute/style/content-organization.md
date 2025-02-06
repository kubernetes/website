---
title: Organizacja treści
content_type: concept
weight: 90
---

<!-- overview -->

Ta strona używa Hugo. W Hugo, [organizacja treści (ang. content organization)](https://gohugo.io/content-management/organization/) jest podstawowym pojęciem.

<!-- body -->

{{% note %}}
**Wskazówka Hugo:** Uruchom Hugo z `hugo server --navigateToChanged`, aby pracować nad edycją treści.
{{% /note %}}

## Listy stron {#page-lists}

### Kolejność stron {#page-order}

Menu boczne dokumentacji, przeglądarka stron dokumentacji itd. są
wyświetlane według domyślnego porządku sortowania Hugo, który sortuje
według wagi (od 1), daty (od najnowszej) i ostatecznie według tytułu linku.

Biorąc pod uwagę, że jeśli chcesz przenieść stronę lub sekcję do góry, ustaw wagę w części _front matter_ strony:

```yaml
title: My Page
weight: 10
```

{{% note %}}
W przypadku wag stron, dobrym pomysłem jest nie używać 1, 2, 3 ..., ale
jakiegoś innego interwału, na przykład 10, 20, 30... Pozwala to na
późniejsze wstawienie stron tam, gdzie chcesz. Dodatkowo, każda waga w tym samym
katalogu (sekcji) nie powinna się nakładać z innymi wagami. Zapewnia to, że
treści zawsze są prawidłowo zorganizowane, zwłaszcza w treściach lokalizowanych.
{{% /note %}}

### Główne Menu Dokumentacji {#documentation-main-menu}

Główne menu `Documentation` generowane jest na podstawie sekcji znajdujących się w
katalogu `docs/`, które mają ustawioną flagę `main_menu` w sekcji front matter pliku _index.md.

```yaml
main_menu: true
```

Zauważ, że tytuł linku jest pobierany z `linkTitle` strony, więc jeśli
chcesz, aby był inny niż tytuł, zmień go w pliku zawartości:

```yaml
main_menu: true
title: Tytuł strony
linkTitle: Tytuł używany w linkach
```

{{% note %}}
Powyższe kroki należy wykonać dla każdego języka osobno. Jeśli
nie widzisz swojej sekcji w menu, prawdopodobnie Hugo nie
rozpoznaje jej jako sekcji. Utwórz plik `_index.md` w katalogu danej sekcji.
{{% /note %}}

### Menu boczne dokumentacji {#documentation-side-menu}

Dokumentacja w menu bocznym jest zbudowana z _bieżącego drzewa sekcji_ zaczynającego się poniżej `docs/`.

Wyświetli wszystkie sekcje i ich strony.

Jeśli nie chcesz uwzględniać sekcji lub strony, ustaw flagę `toc_hide` na `true` w sekcji front matter:

```yaml
toc_hide: true
```

Po wejściu do sekcji z treścią wyświetlana jest przypisana strona (np.
`_index.md`). Jeśli taka strona nie istnieje, Hugo wyświetli pierwszą stronę w sekcji.

### Przeglądarka Dokumentacji {#documentation-browser}

Przeglądarka stron na stronie głównej dokumentacji jest zbudowana z
wykorzystaniem wszystkich sekcji i stron, które znajdują się bezpośrednio poniżej `sekcji docs`.

Jeśli nie chcesz uwzględniać sekcji lub strony, ustaw flagę `toc_hide` na `true` w sekcji front matter:

```yaml
toc_hide: true
```

### Główne Menu {#the-main-menu}

Linki w menu w prawym górnym rogu oraz w stopce są dynamicznie generowane poprzez
wyszukiwanie stron. Pozwala to zweryfikować, czy dana strona rzeczywiście istnieje. Jeśli sekcja
`case-studies` nie jest dostępna w danej wersji językowej serwisu, link do niej nie zostanie utworzony.

## Pakiety Stron {#page-bundles}

Oprócz samodzielnych stron (pliki Markdown), Hugo obsługuje
[Pakiety Stron](https://gohugo.io/content-management/page-bundles/).

Jednym z przykładów są [niestandardowe shortcody Hugo](/docs/contribute/style/hugo-shortcodes/).
Jest to uważane za `leaf bundle`. Wszystko poniżej katalogu, włącznie z `index.md`, będzie
częścią pakietu. Dotyczy to także linków względnych do strony, obrazów, które mogą być przetwarzane, itp.:

```bash
en/docs/home/contribute/includes
├── example1.md
├── example2.md
├── index.md
└── podtemplate.json
```

Innym powszechnie używanym przykładem jest pakiet `includes`. Ustawia on `headless: true` w
metadanych front matter, co oznacza, że nie otrzymuje własnego URL-a. Jest używany tylko na innych stronach.

```bash
en/includes
├── default-storage-class-prereqs.md
├── index.md
├── partner-script.js
├── partner-style.css
├── task-tutorial-prereqs.md
├── user-guide-content-moved.md
└── user-guide-migration-notice.md
```

Niektóre ważne uwagi dotyczące plików w pakietach:

* W pakietach tłumaczeń wszelkie brakujące pliki inne niż treść zostaną
  odziedziczone z wyższych wersji językowych. Zapobiega to zbędnemu powielaniu plików.
* Każdy plik w pakiecie jest uznawany przez Hugo za `Resource`. Można do niego
  przypisać metadane dla różnych języków, takie jak parametry i tytuł, nawet
  jeśli format pliku nie obsługuje front matter (np. YAML). Zobacz
  [Metadane Zasobów Strony](https://gohugo.io/content-management/page-resources/#page-resources-metadata).
* Wartość, którą uzyskujesz z `.RelPermalink` zasobu (`Resource`), jest względna
  względem strony. Zobacz [Permalinki](https://gohugo.io/content-management/urls/#permalinks).

## Style {#styles}

Źródło arkuszy stylów [SASS](https://sass-lang.com/) dla tej strony
jest przechowywane w `assets/sass` i jest automatycznie budowane przez Hugo.

## {{% heading "whatsnext" %}}

* Dowiedz się więcej o [niestandardowych shortcodach Hugo](/docs/contribute/style/hugo-shortcodes/)
* Dowiedz się więcej o [Przewodniku stylu](/docs/contribute/style/style-guide)
* Dowiedz się więcej o [Przewodniku treści](/docs/contribute/style/content-guide)
