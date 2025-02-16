---
title: Otwieranie pull requesta
content_type: concept
weight: 10
card:
  name: contribute
  weight: 40
---

<!-- overview -->

{{< note >}}
**Deweloperzy**: Jeśli dokumentujesz nową funkcję dla
nadchodzącego wydania Kubernetesa, zobacz
[Dokumentowanie nowej funkcji](/docs/contribute/new-content/new-features/).
{{< /note >}}

Aby dodać nowe strony z treścią lub ulepszyć istniejące strony z
treścią, otwórz pull request (PR). Upewnij się, że spełniasz wszystkie
wymagania zawarte w sekcji [Zanim zaczniesz](/docs/contribute/new-content/).

Jeśli Twoja zmiana jest niewielka lub nie jesteś zaznajomiony z git, przeczytaj
[Zmiany przy użyciu GitHub](#changes-using-github), aby dowiedzieć się, jak edytować stronę.

Jeśli twoje zmiany są duże, przeczytaj
[Praca z lokalnego forka](#fork-the-repo), aby dowiedzieć się, jak wprowadzać zmiany lokalnie na swoim komputerze.

<!-- body -->

## Zmiany przy użyciu GitHub {#changes-using-github}

Jeśli masz mniejsze doświadczenie w pracy z git, oto prostsza metoda
otwierania pull requesta. Rysunek 1 przedstawia kroki, a szczegóły znajdują się poniżej.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
A([fa:fa-user Nowy<br>współtwórca]) --- id1[(kubernetes/website<br>GitHub)]
subgraph tasks[Zmiany przy użyciu GitHub]
direction TB
    0[ ] -.-
    1[1. Edytuj tę stronę] --> 2[2. Użyj edytora markdown<br>w GitHub do wprowadzenia zmian]
    2 --> 3[3. Wypełnij Propose file change]

end
subgraph tasks2[ ]
direction TB
4[4. Wybierz Propose file change] --> 5[5. Wybierz Create pull request] --> 6[6. Wypełnij Open a pull request]
6 --> 7[7. Wybierz Create pull request]
end

id1 --> tasks --> tasks2

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class A,1,2,3,4,5,6,7 grey
class 0 spacewhite
class tasks,tasks2 white
class id1 k8s
{{</ mermaid >}}

Rysunek 1. Kroki otwierania PR przy użyciu GitHub.

1. Na stronie, na której widzisz problem, wybierz opcję **Edit this page** w panelu nawigacyjnym po prawej stronie.

1. Wprowadź swoje zmiany w edytorze markdown GitHub.

1. Poniżej edytora wypełnij formularz
   **Propose file change**. W pierwszym polu nadaj tytuł swojej wiadomości
   zatwierdzającej. W drugim polu podaj opis.

   {{< note >}}
   Nie używaj żadnych [słów kluczowych GitHub](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)
   w komunikacie swojego commita. Możesz dodać je później do opisu pull requesta.
   {{< /note >}}

1. Wybierz **Propose file change**.

1. Wybierz **Create pull request**.

1. Pojawi się ekran **Open a pull request**. Wypełnij formularz:

   - Pole **Subject** w pull requeście domyślnie odpowiada
     podsumowaniu commitu. Możesz je zmienić, jeśli zajdzie taka potrzeba.
   - Pole **Body** zawiera Twoją rozszerzoną wiadomość commit,
     jeśli taką posiadasz, oraz pewien tekst szablonu. Dodaj szczegóły, o które
     prosi tekst szablonu, a następnie usuń zbędny tekst szablonu.
   - Pozostaw zaznaczone pole wyboru **Allow edits from maintainers**.

   {{< note >}}
   Opisy PR są świetnym sposobem, aby pomóc recenzentom w zrozumieniu
   twojej zmiany. Aby uzyskać więcej informacji, zobacz [Otwarcie PR](#open-a-pr).
   {{</ note >}}

1. Wybierz **Create pull request**.

### Adresowanie informacji zwrotnej na GitHub {#addressing-feedback-in-github}

Zanim zmiany z pull requesta zostaną połączone, członkowie społeczności
Kubernetesa przeglądają i zatwierdzają je. `k8s-ci-robot` sugeruje recenzentów na
podstawie najbliższego właściciela wspomnianego na stronach. Jeśli masz na
myśli konkretną osobę, zostaw komentarz z jej nazwą użytkownika na GitHubie.

Jeśli recenzent poprosi cię o wprowadzenie zmian:

1. Przejdź do karty **Files changed**.
1. Wybierz ikonę ołówka (edycji) przy plikach zmienionych przez ten pull request.
1. Wprowadź żądane zmiany.
1. Zatwierdź zmiany.

Jeśli czekasz na recenzenta, skontaktuj się raz na 7 dni.
Możesz również wysłać wiadomość na kanale Slack `#sig-docs`.

Kiedy Twoja recenzja jest kompletna, recenzent scala Twój PR, a Twoje zmiany stają się widoczne kilka minut później.

## Praca na lokalnym forku {#fork-the-repo}

Jeśli masz większe doświadczenie z git lub jeśli Twoje
zmiany są większe niż kilka linii, pracuj z lokalnego forka.

Upewnij się, że masz zainstalowany [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
na swoim komputerze. Możesz również użyć aplikacji z interfejsem graficznym dla git.

Rysunek 2 pokazuje kroki do wykonania, gdy pracujesz z lokalnym forkiem. Szczegóły dla każdego kroku znajdują się poniżej.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
1[Fork the kubernetes/website<br>repository] --> 2[Create local clone<br>and set upstream]
subgraph changes[Your changes]
direction TB
S[ ] -.-
3[Create a branch<br>example: my_new_branch] --> 3a[Make changes using<br>text editor] --> 4["Preview your changes<br>locally using Hugo<br>(localhost:1313)<br>or build container image"]
end
subgraph changes2[Commit / Push]
direction TB
T[ ] -.-
5[Commit your changes] --> 6[Push commit to<br>origin/my_new_branch]
end

2 --> changes --> changes2

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class 1,2,3,3a,4,5,6 grey
class S,T spacewhite
class changes,changes2 white
{{</ mermaid >}}

Rysunek 2. Praca z lokalnego forka w celu wprowadzenia zmian.

### Zrób fork repozytorium kubernetes/website {#fork-the-kuberneteswebsite-repository}

1. Przejdź do repozytorium [`kubernetes/website`](https://github.com/kubernetes/website/).
1. Wybierz **Fork**.

### Utwórz lokalną kopię i ustaw 'upstream' {#create-a-local-clone-and-set-the-upstream}

1. W oknie terminala, sklonuj swój fork i zaktualizuj [motyw Docsy Hugo](https://github.com/google/docsy#readme):

   ```shell
   git clone git@github.com:<github_username>/website
   cd website
   git submodule update --init --recursive --depth 1
   ```

1. Przejdź do nowego katalogu `website`. Ustaw repozytorium `kubernetes/website` jako zdalne `upstream`:

   ```shell
   cd website

   git remote add upstream https://github.com/kubernetes/website.git
   ```

1. Potwierdź swoje repozytoria `origin` i `upstream`:

   ```shell
   git remote -v
   ```

   Wyjście wygląda następująco:

   ```none
   origin	git@github.com:<github_username>/website.git (fetch)
   origin	git@github.com:<github_username>/website.git (push)
   upstream	https://github.com/kubernetes/website.git (fetch)
   upstream	https://github.com/kubernetes/website.git (push)
   ```

1. Pobierz commity z gałęzi `origin/main` swojego forka i gałęzi `upstream/main` z `kubernetes/website`:

   ```shell
   git fetch origin
   git fetch upstream
   ```

   To zapewnia, że Twoje lokalne repozytorium jest aktualne, zanim zaczniesz wprowadzać zmiany.

   {{< note >}}
   Ten przepływ pracy różni się od [Kubernetes Community GitHub Workflow](https://github.com/kubernetes/community/blob/master/contributors/guide/github-workflow.md).
   Nie
   musisz scalać swojej lokalnej kopii
   `main` z `upstream/main` przed przesłaniem aktualizacji do swojego forka.
   {{< /note >}}

### Utwórz gałąź {#create-a-branch}

1. Zdecyduj, na której gałęzi oprzeć swoją pracę:

   - W przypadku ulepszeń istniejącej treści, używaj `upstream/main`.
   - Dla nowych treści dotyczących istniejących funkcji użyj `upstream/main`.
   - Dla treści zlokalizowanej, użyj konwencji lokalizacji. Aby uzyskać więcej
     informacji, zobacz [lokalizowanie dokumentacji Kubernetes](/docs/contribute/localization/).
   - Dla nowych funkcji w nadchodzącym wydaniu Kubernetesa, użyj gałęzi funkcji. Aby uzyskać
     więcej informacji, zobacz [dokumentowanie wydania](/docs/contribute/new-content/new-features/).
   - W przypadku długoterminowych działań, nad którymi współpracuje wielu współtwórców SIG Docs, takich
     jak reorganizacja treści, użyj specjalnej gałęzi funkcji utworzonej dla tego działania.

   Jeśli potrzebujesz pomocy w wyborze gałęzi, zapytaj na kanale Slack `#sig-docs`.

1. Utwórz nową gałąź na podstawie gałęzi zidentyfikowanej w kroku 1.
   W tym przykładzie zakłada się, że bazowa gałąź to `upstream/main`:

   ```shell
   git checkout -b <my_new_branch> upstream/main
   ```

1. Wprowadź swoje zmiany za pomocą edytora tekstu.

W dowolnym momencie użyj polecenia `git status`, aby zobaczyć, które pliki zostały zmienione.

### Zatwierdż swoje zmiany {#commit-your-changes}

Gdy będziesz gotowy do złożenia pull request, zatwierdź swoje zmiany.

1. W swoim lokalnym repozytorium sprawdź, które pliki musisz zatwierdzić:

   ```shell
   git status
   ```

   Wyjście wygląda następująco:

   ```none
   On branch <my_new_branch>
   Your branch is up to date with 'origin/<my_new_branch>'.

   Changes not staged for commit:
   (use "git add <file>..." to update what will be committed)
   (use "git checkout -- <file>..." to discard changes in working directory)

   modified:   content/en/docs/contribute/new-content/contributing-content.md

   no changes added to commit (use "git add" and/or "git commit -a")
   ```

1. Dodaj pliki wymienione pod **Changes not staged for commit** do zatwierdzenia:

   ```shell
   git add <your_file_name>
   ```

   Powtórz to dla każdego pliku.

1. Po dodaniu wszystkich plików, utwórz commit:

   ```shell
   git commit -m "Your commit message"
   ```

   {{< note >}}
   Nie używaj żadnych [słów kluczowych GitHub](https://help.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)
   w
   komunikacie swojego commita. Możesz dodać je później do opisu pull requesta.
   {{< /note >}}

1. Prześlij swoją lokalną gałąź i nowy commit do zdalnego fork:

   ```shell
   git push origin <my_new_branch>
   ```

### Podglądaj zmiany lokalnie {#preview-locally}

Warto jest przejrzeć lokalnie swoje zmiany przed ich wypchnięciem lub otwarciem pull
requesta. Podgląd pozwala wyłapać błędy kompilacji lub problemy z formatowaniem markdown.

Możesz albo zbudować obraz kontenera dla strony, albo uruchomić Hugo
lokalnie. Budowanie obrazu kontenera jest wolniejsze, ale wyświetla
[skróty Hugo](/docs/contribute/style/hugo-shortcodes/), co może być przydatne do debugowania.

{{< tabs name="tab_with_hugo" >}}
{{% tab name="Hugo in a container" %}}

{{< note >}}
Poniższe polecenia używają Docker jako domyślnego silnika kontenerów.
Ustaw zmienną środowiskową `CONTAINER_ENGINE`, aby zastąpić to zachowanie.
{{< /note >}}

1. Zbuduj lokalnie obraz kontenera
   _Ten krok jest konieczny tylko wtedy, gdy testujesz zmianę w narzędziu Hugo_

   ```shell
   # Run this in a terminal (if required)
   make container-image
   ```

1. Pobierz zależności podmodułów w lokalnym repozytorium:

   ```shell
   # Run this in a terminal
   make module-init
   ```

1. Uruchom Hugo w kontenerze:

   ```shell
   # Run this in a terminal
   make container-serve
   ```

1. W przeglądarce internetowej przejdź do
   `http://localhost:1313`. Hugo monitoruje zmiany i przebudowuje stronę w razie potrzeby.

1. Aby zatrzymać lokalną instancję Hugo, wróć do
   terminala i wpisz `Ctrl+C`, lub zamknij okno terminala.

{{% /tab %}}
{{% tab name="Hugo on the command line" %}}

Alternatywnie, zainstaluj i użyj polecenia `hugo` na swoim komputerze:

1. Zainstaluj [Hugo](https://gohugo.io/getting-started/installing/) w wersji określonej w
   [`website/netlify.toml`](https://raw.githubusercontent.com/kubernetes/website/main/netlify.toml).

1. Jeśli nie zaktualizowałeś repozytorium swojej strony internetowej, katalog `website/themes/docsy`
   jest pusty. Witryna nie może się zbudować bez lokalnej kopii motywu. Aby zaktualizować motyw strony, uruchom:

   ```shell
   git submodule update --init --recursive --depth 1
   ```

1. W terminalu, przejdź do repozytorium swojej strony Kubernetesa i uruchom serwer Hugo:

   ```shell
   cd <path_to_your_repo>/website
   hugo server --buildFuture
   ```

1. W przeglądarce internetowej przejdź do
   `http://localhost:1313`. Hugo monitoruje zmiany i przebudowuje stronę w razie potrzeby.

1. Aby zatrzymać lokalną instancję Hugo, wróć do
   terminala i wpisz `Ctrl+C`, lub zamknij okno terminala.

{{% /tab %}}
{{< /tabs >}}

### Otwórz pull request z Twojego forka do kubernetes/website {#open-a-pr}

Rysunek 3 przedstawia kroki otwierania PR z Twojego forka do [kubernetes/website](https://github.com/kubernetes/website). Szczegóły poniżej.

Proszę zauważyć, że współtwórcy mogą odnosić się do `kubernetes/website` jako `k/website`.

<!-- See https://github.com/kubernetes/website/issues/28808 for live-editor URL to this figure -->
<!-- You can also cut/paste the mermaid code into the live editor at https://mermaid-js.github.io/mermaid-live-editor to play around with it -->

{{< mermaid >}}
flowchart LR
subgraph first[ ]
direction TB
1[1. Go to kubernetes/website repository] --> 2[2. Select New Pull Request]
2 --> 3[3. Select compare across forks]
3 --> 4[4. Select your fork from<br>head repository drop-down menu]
end
subgraph second [ ]
direction TB
5[5. Select your branch from<br>the compare drop-down menu] --> 6[6. Select Create Pull Request]
6 --> 7[7. Add a description<br>to your PR]
7 --> 8[8. Select Create pull request]
end

first --> second

classDef grey fill:#dddddd,stroke:#ffffff,stroke-width:px,color:#000000, font-size:15px;
classDef white fill:#ffffff,stroke:#000,stroke-width:px,color:#000,font-weight:bold
class 1,2,3,4,5,6,7,8 grey
class first,second white
{{</ mermaid >}}

Rysunek 3. Kroki otwierania PR z Twojego fork'a do [kubernetes/website](https://github.com/kubernetes/website).

1. W przeglądarce internetowej przejdź do repozytorium [`kubernetes/website`](https://github.com/kubernetes/website/).
1. Wybierz **New Pull Request**.
1. Wybierz **compare across forks**.
1. Z menu rozwijanego **head repository** wybierz swój fork.
1. Z menu rozwijanego **compare** wybierz swoją gałąź.
1. Wybierz **Create Pull Request**.
1. Dodaj opis do swojego pull requesta:

    - **Title** (maksymalnie 50 znaków): Podsumuj cel zmiany.
    - **Description**: Opisz zmianę bardziej szczegółowo.

      - Jeśli istnieje powiązany problem na GitHubie, w opisie należy zawrzeć
        `Fixes #12345` lub `Closes #12345`. Automatyzacja GitHuba zamknie wspomniany problem po
        połączeniu PR, jeśli zostanie użyta. Jeśli istnieją inne powiązane PR, również je podlinkuj.
      - Jeśli chcesz uzyskać poradę na konkretny temat, dołącz wszelkie pytania,
        które chciałbyś, aby recenzenci rozważyli w swoim opisie.

1. Wybierz przycisk **Create pull request**.

Gratulacje! Twój pull request jest dostępny w [Pull requests](https://github.com/kubernetes/website/pulls).

Po otwarciu PR, GitHub uruchamia testy automatyczne i próbuje wdrożyć
podgląd za pomocą [Netlify](https://www.netlify.com/).

- Jeśli budowa Netlify się nie powiedzie, wybierz **Details** dla uzyskania dodatkowych informacji.
- Jeśli kompilacja w Netlify powiedzie się, wybierz **Details**, aby otworzyć wstępną wersję
  strony internetowej Kubernetesa z zastosowanymi zmianami. W ten sposób recenzenci sprawdzają Twoje zmiany.

GitHub automatycznie przypisuje etykiety do PR, aby pomóc recenzentom. Możesz je również dodać, jeśli to potrzebne. Aby uzyskać
więcej informacji, zobacz [Dodawanie i usuwanie etykiet zagadnień](/docs/contribute/review/for-approvers/#adding-and-removing-issue-labels).

### Korygowanie uwag w środowisku lokalnym {#addressing-feedback-locally}

1. Po wprowadzeniu zmian, popraw swój poprzedni commit:

   ```shell
   git commit -a --amend
   ```

   - `-a`: wykonuje commit wszystkich zmian
   - `--amend`: poprawia poprzedni commit, zamiast tworzyć nowy

1. Zaktualizuj swój komunikat w commit, jeśli to konieczne.

1. Użyj `git push origin <my_new_branch>`, aby wypchnąć swoje zmiany i ponownie uruchomić testy Netlify.

   {{< note >}}
   Jeśli używasz `git commit -m` zamiast poprawiania, musisz zrobić
   [squash commit](#squashing-commits) przed scaleniem.
   {{< /note >}}

#### Zmiany od recenzentów {#changes-from-reviewers}

Zdarza się, że recenzenci dodają commit'y do twojego pull requesta. Przed wprowadzeniem kolejnych zmian pobierz je.

1. Pobierz commity ze swojego zdalnego forka i zrebasuj swoją gałąź roboczą:

   ```shell
   git fetch origin
   git rebase origin/<your-branch-name>
   ```

1. Po wykonaniu rebase, wymuś przesłanie nowych zmian do swojego fork:

   ```shell
   git push --force-with-lease origin <your-branch-name>
   ```

#### Konflikty scalania i rebasowanie {#merge-conflicts-and-rebasing}

{{< note >}}
Więcej informacji znajdziesz w [Git Branching - Podstawowe Rozgałęzienia i Scalanie](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merge_conflicts),
[Zaawansowane Scalanie](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging),
lub zapytaj na kanale `#sig-docs` w Slacku o pomoc.
{{< /note >}}

Jeśli inny współautor wprowadzi zmiany do tego samego pliku w innym PR, może to
spowodować konflikt scalania. Musisz rozwiązać wszystkie konflikty scalania w swoim PR.

1. Zaktualizuj swój fork i zrebase'uj swoją lokalną gałąź:

   ```shell
   git fetch origin
   git rebase origin/<your-branch-name>
   ```

   Następnie wymuś przesłanie zmian do swojego forka:

   ```shell
   git push --force-with-lease origin <your-branch-name>
   ```

1. Pobierz zmiany z `kubernetes/website` z `upstream/main` i zrebase'uj swoją gałąź:

   ```shell
   git fetch upstream
   git rebase upstream/main
   ```

1. Sprawdź wyniki rebase:

   ```shell
   git status
   ```

   To skutkuje oznaczeniem pewnych plików jako skonfliktowane.

1. Otwórz każdy plik z konfliktem i poszukaj znaczników
   konfliktu: `>>>`, `<<<`, i `===`. Rozwiąż konflikt i usuń znacznik konfliktu.

   {{< note >}}
   Aby uzyskać więcej informacji, zobacz [Jak przedstawiane są konflikty](https://git-scm.com/docs/git-merge#_how_conflicts_are_presented).
   {{< /note >}}

1. Dodaj pliki do zbioru zmian:

   ```shell
   git add <filename>
   ```

1. Kontynuuj rebase:

   ```shell
   git rebase --continue
   ```

1. Powtórz kroki od 2 do 5 w razie potrzeby.

   Kiedy wszystkie commity zostaną wprowadzone, polecenie `git status` potwierdzi, że rebase został zakończony.

1. Wymuś przesłanie gałęzi do swojego forka:

   ```shell
   git push --force-with-lease origin <your-branch-name>
   ```

   Teraz pull request nie pokazuje już żadnych konfliktów.

### Łączenie commitów (ang. squashing commits) {#squashing-commits}

{{< note >}}
Aby uzyskać więcej informacji, zobacz [Narzędzia Git - Przepisywanie historii](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History),
lub poproś o pomoc na kanale `#sig-docs` w Slacku.
{{< /note >}}

Jeśli Twój PR zawiera wiele commitów, musisz połączyć je w jeden
commit przed scaleniem PR. Możesz sprawdzić liczbę commitów w
zakładce **Commits** Twojego PR lub uruchamiając lokalnie polecenie `git log`.

{{< note >}}
Ten temat zakłada użycie `vim` jako edytora tekstu w wierszu poleceń.
{{< /note >}}

1. Rozpocznij interaktywny rebase:

   ```shell
   git rebase -i HEAD~<number_of_commits_in_branch>
   ```

   Scalanie commitów jest formą rebase. Przełącznik `-i` mówi gitowi, że chcesz przeprowadzić rebase
   interaktywnie. `HEAD~<number_of_commits_in_branch` wskazuje, ile commitów należy uwzględnić w procesie rebase.

   Wyjście wygląda następująco:

   ```none
   pick d875112ca Original commit
   pick 4fa167b80 Address feedback 1
   pick 7d54e15ee Address feedback 2

   # Rebase 3d18sf680..7d54e15ee onto 3d183f680 (3 commands)

   ...

   # These lines can be re-ordered; they are executed from top to bottom.
   ```

   Pierwsza sekcja wyniku wyświetla listę commitów w
   rebase. Druga sekcja wyświetla opcje dla każdego commita.
   Zmiana słowa `pick` zmienia status commita po zakończeniu rebase.

   Na potrzeby rebasowania, skup się na `squash` i `pick`.

   {{< note >}}
   Aby uzyskać więcej informacji, zobacz [Tryb interaktywny](https://git-scm.com/docs/git-rebase#_interactive_mode).
   {{< /note >}}

1. Rozpocznij edycję pliku.

   Zmień oryginalny tekst:

   ```none
   pick d875112ca Original commit
   pick 4fa167b80 Address feedback 1
   pick 7d54e15ee Address feedback 2
   ```

   na:

   ```none
   pick d875112ca Original commit
   squash 4fa167b80 Address feedback 1
   squash 7d54e15ee Address feedback 2
   ```

   Scalanie tych commitów `4fa167b80 Address feedback 1` i `7d54e15ee Address feedback 2` do
   `d875112ca Original commit`, pozostawiając tylko `d875112ca Original commit` jako część linii czasu.

1. Zapisz i zamknij swój plik.

1. Wypchnij swój scalony (ang. squashed) commit:

   ```shell
   git push --force-with-lease origin <branch_name>
   ```

## Współpraca w innych repozytoriach {#contribute-to-other-repos}

Projekt [Kubernetes](https://github.com/kubernetes) zawiera ponad 50
repozytoriów. Wiele z tych repozytoriów zawiera dokumentację: tekst pomocy dla
użytkowników, komunikaty o błędach, odniesienia do API lub komentarze w kodzie.

Jeśli widzisz tekst, który chciałbyś poprawić, użyj GitHuba, aby przeszukać wszystkie
repozytoria w organizacji Kubernetesa. To może pomóc ci zorientować się, gdzie zgłosić swój problem lub PR.

Każde repozytorium ma swoje własne procesy i procedury. Zanim zgłosisz problem lub utworzysz PR,
przeczytaj pliki `README.md`, `CONTRIBUTING.md` i `code-of-conduct.md` tego repozytorium, jeśli istnieją.

Większość repozytoriów używa szablonów zgłoszeń i PR. Przyjrzyj się
otwartym zgłoszeniom i PR, aby zrozumieć procesy danego zespołu. Upewnij
się, że wypełniasz szablony jak najdokładniej, gdy zgłaszasz problemy lub PR.

## {{% heading "whatsnext" %}}

- Przeczytaj [Przeglądanie PR](/docs/contribute/review/reviewing-prs), aby dowiedzieć się więcej o procesie przeglądu.

