
### Wymagania: {#requirements}

- Potrzebujesz maszyny z systemem operacyjnym Linux lub macOS. W systemie Windows
  użyj [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install),
  ponieważ narzędzia do budowania opierają się na `make` i skryptach Bash.

- Musisz mieć zainstalowane następujące narzędzia:

  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) - Dokumentacja opisuje, jak zainstalować i rozpocząć pracę z systemem kontroli wersji `Git`.
  - [Go](https://go.dev/dl/), dowolna aktualna wersja (Go automatycznie pobiera dokładnie taki zestaw narzędzi, jakiego potrzebuje generator)
  - [make](https://www.gnu.org/software/make/)
  - [gcc compiler/linker](https://gcc.gnu.org/)
  - [Docker](https://docs.docker.com/engine/installation/) (wymagany tylko do lokalnego podglądu strony za pomocą `make container-serve`)

- Musisz wiedzieć, jak utworzyć pull requesta do repozytorium na GitHubie.
  Wymaga to utworzenia własnego forka repozytorium. Aby uzyskać więcej informacji,
  zobacz [Praca z lokalnej kopii](/docs/contribute/new-content/open-a-pr/#fork-the-repo).
