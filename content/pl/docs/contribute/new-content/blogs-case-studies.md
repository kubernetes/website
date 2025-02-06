---
title: Dodawanie wpisu na bloga oraz studium przypadków
linktitle: Blog oraz studium przypadków
slug: blogs-case-studies
content_type: concept
weight: 30
---


<!-- overview -->

Każdy może zrobić wpis na bloga i przesłać go do recenzji.
Studium przypadku wymaga szczegółowej weryfikacji przed zatwierdzeniem.

<!-- body -->

## Blog Kubernetes {#the-kubernetes-blog}

Blog Kubernetes jest wykorzystywany przez projekt do komunikowania nowych funkcji, raportów
społeczności oraz wszelkich wiadomości, które mogą być istotne dla społeczności Kubernetes. Dotyczy to zarówno
użytkowników końcowych, jak i deweloperów. Większość treści bloga dotyczy wydarzeń w rdzeniu projektu, ale zachęcamy
również do przesyłania informacji o wydarzeniach mających miejsce w innych częściach ekosystemu!

Każdy może napisać post na blogu i przesłać go do recenzji.

### Przesyłanie posta {#submit-a-post}

Posty na blogu nie powinny mieć charakteru komercyjnego i powinny składać się z oryginalnej
treści, która ma szerokie zastosowanie w społeczności Kubernetes. Odpowiednia zawartość bloga obejmuje:

- Nowe możliwości Kubernetes
- Aktualizacje projektów Kubernetes
- Aktualizacje od Specjalnych Grup Zainteresowań (ang. Special Interest Groups - SIG)
- Samouczki i instrukcje krok po kroku
- Przywództwo myślowe w zakresie Kubernetes
- Integracja z oprogramowaniem open source partnerów Kubernetes
- **Tylko oryginalna treść**

Treści nieodpowiednie obejmują:

- Oferty produktów dostawców
- Aktualizacje partnerów bez integracji i historii klientów
- Zduplikowane posty z innych źródeł (tłumaczenia na inne języki są w porządku).

Aby przesłać wpis na bloga, wykonaj następujące kroki:

1. [Podpisz CLA](https://github.com/kubernetes/community/blob/master/CLA.md)
   jeśli jeszcze tego nie zrobiłeś.

1. Zapoznaj się z formatem Markdown dla istniejących wpisów na blogu w
   [repozytorium strony](https://github.com/kubernetes/website/tree/master/content/en/blog/_posts).

1. Napisz swój wpis na blogu w wybranym edytorze tekstu.

1. Na tym samym linku z kroku 2, kliknij przycisk **Create new file**. Wklej swoją treść do edytora. Nazwij plik,
   aby pasował do proponowanego tytułu wpisu na blogu, ale nie umieszczaj daty w nazwie pliku.
   Recenzenci bloga będą współpracować z tobą w sprawie ostatecznej nazwy pliku i daty, kiedy blog zostanie opublikowany.

1. Gdy zapiszesz plik, GitHub przeprowadzi Cię przez proces pull request.

1. Recenzent wpisu na blogu przejrzy Twoje zgłoszenie i będzie z Tobą współpracować nad opinią zwrotną oraz
   ostatecznymi szczegółami. Gdy wpis na blogu zostanie zatwierdzony, publikacja zostanie zaplanowana.

### Wytyczne i oczekiwania {#guidelines-and-expectations}

- Posty na blogu nie powinny być ofertami sprzedażowymi.

  - Artykuły muszą zawierać treści, które mają szerokie zastosowanie w społeczności Kubernetes.
    Na przykład, tekst powinien skupiać się na głównym projekcie Kubernetes, a nie na
    konfiguracjach specyficznych dla dostawców. Sprawdź [Przewodnik stylu dokumentacji](/docs/contribute/style/content-guide/#what-s-allowed)
    dla informacji, co zazwyczaj jest dozwolone w zasobach Kubernetes.
  - Linki powinny przede wszystkim prowadzić do oficjalnej dokumentacji Kubernetes.
    Podczas używania zewnętrznych odniesień, linki powinny być zróżnicowane - na przykład
    zgłoszenie nie powinno zawierać tylko linków prowadzących wyłącznie do bloga jednej firmy.
  - Czasami jest to delikatna równowaga.
    [Zespół blogowy](https://kubernetes.slack.com/messages/sig-docs-blog/) jest po to, aby udzielać wskazówek,
    czy post jest odpowiedni dla bloga Kubernetes, więc nie wahaj się skontaktować.

- Posty na blogu nie są publikowane w określonych terminach.

    - Artykuły są przeglądane przez ochotników ze społeczności. Postaramy się jak najlepiej
      dostosować do określonych terminów, ale nie dajemy żadnych gwarancji.
  - Wiele kluczowych części projektów Kubernetes wysyła posty na blogu w trakcie okienek
    wydań, opóźniając czasy publikacji. Rozważ przesłanie podczas spokojniejszego okresu cyklu wydania.
  - Jeśli chcesz lepiej skoordynować daty publikacji postów, bardziej odpowiednim wyborem będzie
    współpraca z [marketingiem CNCF](https://www.cncf.io/about/contact/) niż samo przesłanie wpisu na bloga.
  - Czasami recenzje mogą się opóźniać. Jeśli uważasz, że twoja recenzja nie otrzymuje
    odpowiedniej uwagi, możesz skontaktować się z zespołem blogowym na
    [kanale Slack `#sig-docs-blog`](https://kubernetes.slack.com/messages/sig-docs-blog/), aby zapytać w czasie rzeczywistym.

- Posty na blogu powinny być istotne dla użytkowników Kubernetes.

  - Tematy związane z uczestnictwem w działaniach SIG Kubernetes lub ich wynikami są zawsze na temat (zobacz prace
    zespołu [Contributor Comms Team](https://github.com/kubernetes/community/blob/master/communication/contributor-comms/blogging-resources/blog-guidelines.md#contributor-comms-blog-guidelines)
    w celu uzyskania wsparcia dla tych postów).
  - Komponenty Kubernetes są celowo modularne, więc narzędzia
    korzystające z istniejących punktów integracji, takich jak CNI i CSI, są na temat.
  - Posty na temat innych projektów CNCF mogą, ale nie muszą być na
    temat. Zalecamy skonsultowanie się z zespołem bloga przed przesłaniem szkicu.
    - Wiele projektów CNCF ma własne blogi. Często są one lepszym wyborem dla
      postów. Są momenty, w których główna funkcja lub kamień milowy projektu CNCF
      są na tyle interesujące dla użytkowników, że warto je opisać na blogu Kubernetes.
  - Wpisy na blogu dotyczące wkładu w projekt Kubernetes powinny
    znajdować się na [stronie Kubernetes Contributors](https://kubernetes.dev)

- Wpisy na blogu powinny być oryginalną treścią

  - Oficjalny blog nie służy do przekształcania istniejących treści pochodzących od stron trzecich w nowe treści.
  - [Licencja](https://github.com/kubernetes/website/blob/main/LICENSE) dla bloga
    pozwala na komercyjne wykorzystanie treści w celach komercyjnych, ale nie odwrotnie.

- Posty na blogu powinny być odporne na przyszłość

  - Biorąc pod uwagę tempo rozwoju projektu, chcemy mieć zawsze aktualną treść, która
    nie będzie wymagała aktualizacji, aby pozostała poprawna dla czytelnika.
  - Może być lepszym wyborem dodanie samouczka lub zaktualizowanie
    oficjalnej dokumentacji niż napisanie ogólnego przeglądu jako wpis na blogu.
    - Zastanów się nad skróceniem długiej, technicznej treści i przedstawieniem jej jako wezwania do
      działania w poście na blogu, koncentrując się na problemie lub na tym, dlaczego czytelnicy powinni to zauważyć.

### Techniczne aspekty przesyłania posta na bloga {#technical-considerations-for-submitting-a-blog-post}

Aby zgłoszenia mogły być używane przez generator [Hugo](https://gohugo.io/) do bloga,
muszą być w formacie Markdown. Istnieje
[wiele dostępnych zasobów](https://gohugo.io/documentation/) na temat korzystania z tego stosu technologicznego.

Dla ilustracji, diagramów lub wykresów można użyć
[figure shortcode](https://gohugo.io/content-management/shortcodes/#figure). Dla innych obrazów zdecydowanie zachęcamy do używania atrybutów alt;
jeśli obraz nie wymaga żadnego atrybutu alt, być może w ogóle nie jest potrzebny w artykule.

Zdajemy sobie sprawę, że ten wymóg utrudnia proces osobom mniej zaznajomionym z
tematem i nieustannie poszukujemy rozwiązań, które obniżą tę poprzeczkę.
Jeśli masz pomysły na to, jak obniżyć barierę, prosimy o zgłoszenie się do pomocy. 

Podprojekt bloga SIG Docs [blog subproject](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject)
zarządza procesem przeglądu postów na blogu. Aby uzyskać więcej informacji, zobacz [Zgłoś post](https://github.com/kubernetes/community/tree/master/sig-docs/blog-subproject#submit-a-post).


Aby zgłosić wpis na blogu, postępuj zgodnie z tymi wskazówkami:

- [Otwórz pull request](/docs/contribute/new-content/open-a-pr/#fork-the-repo) z nowym
  wpisem na blogu. Nowe wpisy na blogu trafiają do katalogu
  [`content/en/blog/_posts`](https://github.com/kubernetes/website/tree/main/content/en/blog/_posts).

- Upewnij się, że Twój wpis na blogu spełnia właściwe konwencje
  nazewnictwa oraz zawiera następujące informacje w sekcji frontmatter (metadane):

  - Nazwa pliku Markdown musi być zgodna z formatem `YYYY-MM-DD-Your-Title-Here.md`.
    Na przykład, `2020-02-07-Deploying-External-OpenStack-Cloud-Provider-With-Kubeadm.md`.
  - **Nie** umieszczaj kropek w nazwie pliku. Nazwa taka jak
    `2020-01-01-whats-new-in-1.19.md` powoduje błędy podczas budowania.
  - Front matter musi zawierać następujące elementy:

    ```yaml
    ---
    layout: blog
    title: "Your Title Here"
    date: YYYY-MM-DD
    slug: text-for-URL-link-here-no-spaces
    author: >
      Author-1 (Affiliation),
      Author-2 (Affiliation),
      Author-3 (Affiliation)
    ---
    ```

  - Pierwsza lub inicjująca wiadomość git commit powinna być krótkim podsumowaniem wykonywanej pracy i powinna być
    samodzielnym opisem wpisu na blogu. Należy zauważyć, że kolejne edycje Twojego bloga zostaną połączone
    (ang. git squash) w to główne zatwierdzenie (ang. main commit), więc powinno być ono jak najbardziej użyteczne.

    - Przykłady dobrego komunikatu commit:
      - _Add blog post on the foo kubernetes feature_
      - _blog: foobar announcement_
    - Przykłady złych komunikatów zatwierdzenia:
      - _Add blog post_
      - _._
      - _initial commit_
      - _draft post_

  - Zespół blogowy następnie przejrzy twoje PR i przekaże uwagi dotyczące rzeczy, które możesz
    potrzebować poprawić. Następnie bot połączy twoje PR, a twój wpis na blogu zostanie opublikowany.

  - Jeśli treść wpisu na blogu zawiera tylko treści, które nie wymagają aktualizacji, aby
    pozostać dokładnymi dla czytelnika, można go oznaczyć jako "evergreen" i zwolnić z
    automatycznego ostrzeżenia o nieaktualnej treści dodawanego do wpisów na blogu starszych niż rok.

    - Aby oznaczyć wpis na blogu jako wiecznie aktualny, dodaj to do nagłówka:
      
      ```yaml
      evergreen: true
      ```
    - Przykłady treści, które nie powinny być oznaczone jako zawsze aktualne:
      - **Samouczki** które dotyczą tylko określonych wydań lub wersji, a nie wszystkich przyszłych wersji
      - Odniesienia do interfejsów API lub funkcji przed dostępnością ogólną (ang. pre-GA)

### Mirroring bloga Kubernetes {#mirroring-from-the-kubernetes-contributor-blog}

Aby zrobić mirroring posta na blogu z [bloga współautorów Kubernetes](https://www.kubernetes.dev/blog/), postępuj zgodnie z tymi wytycznymi:

- Zachowaj tę samą treść bloga. Jeśli są jakieś zmiany, powinny być najpierw dokonane w oryginalnym artykule, a następnie w artykule lustrzanym.
- Zmirorowany blog powinien mieć `canonicalUrl`, czyli w zasadzie adres URL oryginalnego bloga po jego opublikowaniu.
- To samo, co w [blogach współtwórców Kubernetes](https://kubernetes.dev/blog), posty na blogu Kubernetes również wymieniają autorów w nagłówku YAML zgodnie z nowymi wytycznymi. Należy to zapewnić.
- Daty publikacji pozostają takie same jak w oryginalnym blogu.

Wszystkie pozostałe wytyczne i oczekiwania opisane powyżej również obowiązują.

## Prześlij studium przypadku {#submit-a-case-study}

Studia przypadków pokazują, jak organizacje wykorzystują Kubernetes do rozwiązywania
rzeczywistych problemów. Zespół marketingowy Kubernetes oraz członkowie
{{< glossary_tooltip text="CNCF" term_id="cncf" >}} współpracują z Tobą nad wszystkimi studiami przypadków.

Zapoznaj się z źródłem dla [istniejących studiów przypadków](https://github.com/kubernetes/website/tree/main/content/en/case-studies).


Zapoznaj się z [wytycznymi dotyczącymi studium przypadku](https://github.com/cncf/foundation/blob/master/case-study-guidelines.md)
i złóż swoje zgłoszenie zgodnie z przedstawionymi wytycznymi.

