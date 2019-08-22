# Kubernetes Русская документация
<!--
# The Kubernetes documentation
 -->

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

<!--
Welcome! This repository houses all of the assets required to build the [Kubernetes website and documentation](https://kubernetes.io/).
We're glad that you want to contribute!
 -->
Добро Пожаловать! Эта репозитория содержит все необходимое для того чтобы улучшить [Kubernetes вебсайт и документацию](https://kubernetes.io/)
Мы счастливы, что хотите помочь нам!

<!--
## Contributing to the docs
 -->
## Дополнить документы

<!--
You can click the **Fork** button in the upper-right area of the screen to create a copy of this repository in your GitHub account.
This copy is called a *fork*. Make any changes you want in your fork,
and when you are ready to send those changes to us, go to your fork and create a new pull request to let us know about it.
 -->
Вы можете кликнуть на **Fork** кнопку в верхнем левом углу для этого чтобы создать копию этой репозитории в вашем GitHub аккаунте.
Эта копия называетая *fork*. Вы можете делать любые изменения в вашем fork,
и когда вы готовы отправить эти изменения нам, ввойдите в ваш форк и поздайте pull request для того чтобы дать нам знать об этом.

<!--
Once your pull request is created, a Kubernetes reviewer will take responsibility for providing clear, actionable feedback.
As the owner of the pull request, **it is your responsibility to modify your pull request to address the feedback that has been provided to you by the Kubernetes reviewer.**
Also, note that you may end up having more than one Kubernetes reviewer provide you feedback or you may end up getting feedback from a Kubernetes reviewer that is different than the one initially assigned to provide you feedback.
Furthermore, in some cases, one of your reviewers might ask for a technical review from a [Kubernetes tech reviewer](https://github.com/kubernetes/website/wiki/Tech-reviewers) when needed.
Reviewers will do their best to provide feedback in a timely fashion but response time can vary based on circumstances.
 -->
Как только ваш  pull request сделан，Kubernetes ревьюер будет отвественен обеспечить четкую обратную связь. Вы как владелец данного pull request, **Это ваша отвественность модифицировать ваш pull request, для того чтобы адресовать обратную связь вашему Kubernetes ревьюеру.**
Кроме того, обратите внимание, что у вас может оказаться, более одного Kubernetes ревьюера которые предоставят вам обратную связь, или вы можете в конечном итоге получить отзыв от ревьюера Kubernetes, который отличается от того, который изначально был назначен для предоставления вам обратной связи.
Кроме того, в некоторых случаях один из ваших ревьюеров может запросить техническую рецензию у [Kubernetes технического рецензента] (https://github.com/kubernetes/website/wiki/Tech-reviewers) при необходимости.

<!--
For more information about contributing to the Kubernetes documentation, see:

* [Start contributing](https://kubernetes.io/docs/contribute/start/)
* [Staging Your Documentation Changes](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Using Page Templates](http://kubernetes.io/docs/contribute/style/page-templates/)
* [Documentation Style Guide](http://kubernetes.io/docs/contribute/style/style-guide/)
* [Localizing Kubernetes Documentation](https://kubernetes.io/docs/contribute/localization/)
 -->
Для большей информации для помощи в Kubernetes документацию，смотрите：

* [Начать Вкад](https://kubernetes.io/docs/contribute/start/)
* [Начать Ваш Вклад в Документации](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Использовать Шаблоны Страниц](http://kubernetes.io/docs/contribute/style/page-templates/)
* [Документация по Стиль Гайду](http://kubernetes.io/docs/contribute/style/style-guide/)
* [Локализировать Kubernetes Документацию](https://kubernetes.io/docs/contribute/localization/)

<!--
## `README.md`'s Localizing Kubernetes Documentation
 -->
## `README.md` Локализация Kubernetes Документации

<!--
### Русский

You can reach the maintainers of Korean localization at:

* [Slack channel](https://kubernetes.slack.com/messages/kubernetes-docs-ko)
 -->
### Русский язык

Вы можете найти мейнтейнеров Русской локализации по следующим ссылкам：

*  ([GitHub - @dianaabv16](https://github.com/dianaabv16))
* [Slack channel](https://kubernetes.slack.com/messages/kubernetes-docs-zh)

<!--
## Running the website locally using Docker
 -->
## Запустите сайт локально с помощью Docker

<!--
The recommended way to run the Kubernetes website locally is to run a specialized [Docker](https://docker.com) image that includes the [Hugo](https://gohugo.io) static website generator.
 -->
Рекомендуемый способ локального запуска веб-сайта Kubernetes - запуск специализированного образа [Docker] (https://docker.com), который включает генератор статических веб-сайтов [Hugo] (https://gohugo.io).

<!--
> If you are running on Windows, you'll need a few more tools which you can install with [Chocolatey](https://chocolatey.org). `choco install make`
 -->
> Если вы работаете c Windows, вам понадобится еще несколько инструментов, которые вы можете установить с помощью [Chocolatey] (https://chocolatey.org). `choco install make`

<!--
> If you'd prefer to run the website locally without Docker, see [Running the website locally using Hugo](#running-the-site-locally-using-hugo) below.
 -->
> Если вы предпочитаете запускать сайт локально без Docker, см. Раздел [Запуск сайта локально с помощью Hugo] (#running-the-site-localally using-hugo) ниже.

<!--
If you have Docker [up and running](https://www.docker.com/get-started), build the `kubernetes-hugo` Docker image locally:
 -->
Если у вас есть Docker [запущен и работает] (https://www.docker.com/get-started), локально создайте образ Docker `kubernetes-hugo`:

```bash
make docker-image
```

<!--
Once the image has been built, you can run the website locally:
 -->
一 После того, как изображение было построено, вы можете запустить сайт локально:

```bash
make docker-serve
```

<!--
Open up your browser to http://localhost:1313 to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.
 -->
Откройте браузер по адресу http://localhost:1313 для просмотра веб-сайта. При внесении изменений в исходные файлы Hugo обновляет веб-сайт и принудительно обновляет браузер.

<!--
## Running the website locally using Hugo
 -->
## 使用 Hugo 在本地运行网站

<!--
See the [official Hugo documentation](https://gohugo.io/getting-started/installing/) for Hugo installation instructions.
Make sure to install the Hugo version specified by the `HUGO_VERSION` environment variable in the [`netlify.toml`](netlify.toml#L9) file.
 -->
См. [Официальную документацию Hugo] (https://gohugo.io/getting-started/install/) для получения инструкций по установке Hugo.
Обязательно установите версию Hugo, указанную в переменной среды `HUGO_VERSION` в файле [`netlify.toml`](netlify.toml#L9).

<!--
To run the website locally when you have Hugo installed:
 -->
Чтобы запустить сайт локально, когда у вас установлен Hugo:

```bash
make serve
```

<!--
This will start the local Hugo server on port 1313. Open up your browser to http://localhost:1313 to view the website. As you make changes to the source files, Hugo updates the website and forces a browser refresh.
 -->
Это запустит локальный сервер Hugo на порту 1313. Откройте браузер по адресу http://localhost:1313 для просмотра веб-сайта. При внесении изменений в исходные файлы Hugo обновляет веб-сайт и принудительно обновляет браузер.

<!--
## Community, discussion, contribution, and support
 -->
## Сообщество, обсуждение, вклад и поддержка

<!--
Learn how to engage with the Kubernetes community on the [community page](http://kubernetes.io/community/).
 -->
Узнайте, как взаимодействовать с сообществом Kubernetes на [странице сообщества] (http://kubernetes.io/community/).


<!--
You can reach the maintainers of this project at:
 -->
Вы можете связаться с мейнтейнерами этого проекта по адресу:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

<!--
### Code of conduct

Participation in the Kubernetes community is governed by the [Kubernetes Code of Conduct](code-of-conduct.md).
 -->
### Нормы поведения

Участие в сообществе Kubernetes регулируется [Кодексом поведения Kubernetes] (code-of-conduct.md).

<!--
## Thank you!

Kubernetes thrives on community participation, and we appreciate your contributions to our website and our documentation!
 -->
## Спасибо！

Kubernetes процветает благодаря участию сообщества, и мы ценим ваш вклад в наш веб-сайт и нашу документацию!

