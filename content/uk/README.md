# Документація Kubernetes

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Цей репозиторій містить матеріали потрібні для створення [вебсайту Kubernetes та документації](https://kubernetes.io/). Ми щасливі, що ви хочете зробити свій внесок!

- [Внесок до документації](#внесок-до-документації)
- [Локалізовані файли README](#локалізовані-файли-readme)

## Користування цим репозиторієм

Ви можете запустити вебсайт локально, використовуючи [Hugo (розширена версія)](https://gohugo.io/), або ви можете запустити його в контейнерному середовищі. Ми настійно рекомендуємо використовувати контейнерне середовище, оскільки воно забезпечує однорідність розгортання порівняно з основним вебсайтом.

## Передумови

Для користування цим репозиторієм вам потрібно локально встановити наступні інструменти:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (Розширена версія)](https://gohugo.io/)
- Середовище запуску контейнерів, наприклад [Docker](https://www.docker.com/).

Перед тим як розпочати, встановіть залежності. Зробіть клон репозиторію та перейдіть в теку:

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

Сайт Kubernetes використовує  [Docsy Hugo theme](https://github.com/google/docsy#readme). Навіть якщо ви плануєте запускати вебсайт в контейнері, ми настійливо рекомендуємо встановити субмодулі та інші залежності зробивши наступне:

### Windows
```powershell
# отримання залежностей субмодулів
git submodule update --init --recursive --depth 1
```

### Linux / інші Unix
```bash
# отримання залежностей субмодулів
make module-init
```

## Запуск вебсайту використовуючи контейнер

Для збирання вебсайту з використанням контейнера, зробіть наступне:

```bash
# Ви можете встановити у $CONTAINER_ENGINE назву будь-якого Docker-подібного інструменту
make container-serve
```

Якщо ви бачите помилку, скоріш за все це означає, що контейнеру hugo не вистачило обчислювальних ресурсів. Для її розвʼязання збільште обсяг процесорних потужностей та памʼяті для Docker у себе на компʼютері ([MacOS](https://docs.docker.com/desktop/settings/mac/) та [Windows](https://docs.docker.com/desktop/settings/windows/)).

Відкрийте у себе в оглядачі адресу <http://localhost:1313> для перегляду локального вебсайту. По міри того, як ви вноситимете зміни в сирці, Hugo оновлюватиме вебсайт та перезавантажуватиме сторінку в оглядачі.

## Запуск сайт локально з використанням Hugo

Переконайтесь, що ви встановили розширену версію Hugo яку вказано у змінній оточення  `HUGO_VERSION` файлу  [`netlify.toml`](netlify.toml#L11).

Для встановлення залежностей, розгорніть та перевірте сайт локально:

- На macOS та Linux
  ```bash
  npm ci
  make serve
  ```
- На Windows (PowerShell)
  ```powershell
  npm ci
  hugo.exe server --buildFuture --environment development
  ```

Це призведе до запуску локального сервера Hugo, який відповідатиме на запити на порту 1313. Відкрийте у себе в оглядачі адресу <http://localhost:1313> для перегляду локального вебсайту. По міри того, як ви вноситимете зміни в сирці, Hugo оновлюватиме вебсайт та перезавантажуватиме сторінку в оглядачі.

## Створення довідкових сторінок API

Довідкові сторінки API, розташовані в `content/en/docs/reference/kubernetes-api`, створюються на основі специфікації Swagger, також відомої як специфікація OpenAPI, за допомогою <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>.

Для оновлення довідкових сторінок для нового випуску Kubernetes виконайте наступні кроки:

1. Отримайте субмодуль `api-ref-generator`:

   ```bash
   git submodule update --init --recursive --depth 1
   ```

2. Оновіть специфікацію Swagger:

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

3. В `api-ref-assets/config/`, змініть файли `toc.yaml` та `fields.yaml`, так щоб вони вказували на новий випуск.

4. Далі, зберіть сторінки:

   ```bash
   make api-reference
   ```

   Ви можете протестувати результати локально запустивши сайт з образу контейнера:

   ```bash
   make container-image
   make container-serve
   ```

   У вебоглядачі перейдіть до <http://localhost:1313/docs/reference/kubernetes-api/> для перегляду довідки API.

5. Коли всі зміни, щодо переходу на нову версію внесені у файли `toc.yaml` та `fields.yaml`, створіть запит на втягування (pull request) з новоствореними сторінками довідки API.

## Усунення несправностей

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

Hugo має два виконуваних файли з технічних причин. Поточний вебсайт запускається лише на **Hugo Extended**. На сторінці [release page](https://github.com/gohugoio/hugo/releases) шукайте архів з `extended`  в назві. Для перевірки запустіть  `hugo version` та шукайте слово `extended` у виводі.

### Усунення несправностей в macOS для занадто великої кількості відкритих файлів

Якщо ви запускаєте `make serve` в macOS та отримуєте наступну помилку:

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

Перевірте поточні обмеження на кількість відкритих файлів:

`launchctl limit maxfiles`

Потім виконайте наступні команди (взято з <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>):

```shell
#!/bin/sh

# These are the original gist links, linking to my gists now.
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxfiles.plist
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxproc.plist

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

Це працює як для Catalina, так і для Mojave macOS.

## Приєднуйтесь до SIG Docs

Дізнайтеся більше про спільноту SIG Docs Kubernetes та зустрічі на [сторінці спільноти](https://github.com/kubernetes/community/tree/master/sig-docs#meetings).

Ви також можете звʼязатися з супроводжуючими цього проєкту:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [Отримайте запрошення до Slack](https://slack.k8s.io/)
- [Список розсилки](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## Внесок до документації

Ви можете натиснути кнопку **Fork** у верхній правій частині екрана, щоб створити копію цього репозиторію у своєму обліковому записі GitHub. Ця копія називається _fork_ (відгалуження). Вносьте будь-які зміни, які ви хочете у своєму відгалуженні, і коли ви будете готові надіслати ці зміни нам, перейдіть до нього та створіть новий pull request (запит на втягування), щоб повідомити нас про це.

Після створення вашого запиту на втягування, рецензент Kubernetes візьме на себе відповідальність за надання чіткого та практичного відгуку. Як власник запиту на втягування, **вам належить внести зміни до вашого запиту на втягування, щоб відповісти на отриманий відгук від рецензента Kubernetes.**

Крім того, зверніть увагу, що у вас може бути більше одного рецензента Kubernetes, який надасть вам відгук, або ви можете отримати зворотний звʼязок від рецензента Kubernetes, який відрізняється від того, який спочатку був призначений для надання вам зворотного звʼязку.

Крім того, в деяких випадках один з ваших рецензентів може попросити технічний огляд у технічного рецензента Kubernetes, коли це необхідно. Рецензенти зроблять все можливе, щоб своєчасно надати відгук, але час відповіді може змінюватися залежно від обставин.

Для отримання додаткової інформації про внесок у документацію Kubernetes див.:

- [Участь в створені документації Kubernetes](https://kubernetes.io/docs/contribute/)
- [Типи вмісту сторінок](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [Посібник зі стилю документації](https://kubernetes.io/docs/contribute/style/style-guide/)
- [Локалізація документації Kubernetes](https://kubernetes.io/docs/contribute/localization/)
- [Introduction to Kubernetes Docs](https://www.youtube.com/watch?v=pprMgmNzDcw)

### Помічники для нових учасників

Якщо вам потрібна допомога в будь-який момент, коли ви робите свій внесок, [помічник для нових учасників](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) є тою особою, до якої варто звертатись. Вони затверджують роботу інших в SIG Docs, їх обов'язки включають наставництво нових учасників та допомогу їм у перших кількох запитах на злиття змін. Найкращим місцем для звʼязку з помічниками є [Kubernetes Slack](https://slack.k8s.io/). Поточні помічники в SIG Docs:

| Імʼя                       | Slack                      | GitHub                     |                   
| -------------------------- | -------------------------- | -------------------------- |
| Sreeram Venkitesh                | @sreeram.venkitesh                      | @sreeram-venkitesh              |

## Локалізовані файли README

| Мова                   | Мова                   |
| -------------------------- | -------------------------- |
| [Китайська](README-zh.md)    | [Корейська](README-ko.md)     |
| [Французька](README-fr.md)     | [Польська](README-pl.md)     |
| [Німецька](README-de.md)     | [Португальська](README-pt.md) |
| [Хінді](README-hi.md)      | [Російська](README-ru.md)    |
| [Індонезійська](README-id.md) | [Іспанська](README-es.md)    |
| [Італійська](README-it.md)    | [Українська](README-uk.md)  |
| [Японська](README-ja.md)   | [Вʼєтнамська](README-vi.md) |

## Кодекс поведінки

Участь у спільноті Kubernetes регулюється [Кодексом поведінки CNCF](https://github.com/cncf/foundation/blob/main/code-of-conduct.md).

## Дякуємо вам

Kubernetes процвітає завдяки участі спільноти, і ми цінуємо ваш внесок у наш вебсайт та нашу документацію!
