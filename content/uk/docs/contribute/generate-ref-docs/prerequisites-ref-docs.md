
### Вимоги: {#prerequisites}

- Вам потрібна машина, що працює під управлінням Linux або macOS. У Windows використовуйте [Підсистема Windows для Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install), оскільки інструменти збірки покладаються на `make` та Bash-скрипти.

- Вам потрібно встановити ці інструменти:

  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - [Go](https://go.dev/dl/), будь-який нещодавній реліз (Go автоматично завантажує точну версію інструментарію, необхідну генератору)
  - [make](https://www.gnu.org/software/make/)
  - [gcc компілятор/лінкер](https://gcc.gnu.org/)
  - [Docker](https://docs.docker.com/engine/installation/) (Потрібен тільки для локального перегляду вебсайту за допомогою `make container-serve`)

- Вам потрібно знати, як створити pull request до репозиторію на GitHub. Це включає створення власного форку репозиторію. Для отримання додаткової інформації дивіться [Робота з локальним клоном](/docs/contribute/new-content/open-a-pr/#fork-the-repo).
