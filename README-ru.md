# Документация по Kubernetes

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-master-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Добро пожаловать! Данный репозиторий содержит все необходимые файлы для сборки [сайта Kubernetes и документации](https://kubernetes.io/). Мы благодарим вас за старания!

## Запуск сайта с помощью Hugo

Обратитесь к [официальной документации Hugo](https://gohugo.io/getting-started/installing/), чтобы установить Hugo. Убедитесь, что вы установили правильную версию Hugo, которая устанавливается в переменной окружения `HUGO_VERSION` в файле [`netlify.toml`](netlify.toml#L10).

После установки Hugo, чтобы запустить сайт, выполните в консоли:

```bash
git clone https://github.com/kubernetes/website.git
cd website
hugo server --buildFuture
```

Эта команда запустит сервер Hugo на порту 1313. Откройте браузер и перейдите по ссылке http://localhost:1313, чтобы открыть сайт. Если вы отредактируете исходные файлы сайта, Hugo автоматически применит изменения и обновит страницу в браузере.

## Сообщество, обсуждение, вклад и поддержка

Узнайте, как поучаствовать в жизни сообщества Kubernetes на [странице сообщества](http://kubernetes.io/community/).

Вы можете связаться с сопровождающими этого проекта по следующим ссылкам:

- [Канал в Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Рассылка](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## Вклад в документацию

Нажмите на кнопку **Fork** в правом верхнем углу, чтобы создать копию этого репозитория в ваш GitHub-аккаунт. Эта копия называется *форк-репозиторием*. Делайте любые изменения в вашем форк-репозитории, и когда вы будете готовы опубликовать изменения, откройте форк-репозиторий и создайте новый пулреквест, чтобы уведомить нас.

После того, как вы отправите пулреквест, ревьювер Kubernetes даст по нему обратную связь. Вы, как автор пулреквеста, **должны обновить свой пулреквест после его рассмотрения ревьювером Kubernetes.**

Вполне возможно, что более одного ревьювера Kubernetes оставят свои комментарии или даже может быть так, что новый комментарий ревьювера Kubernetes будет отличаться от первоначального назначенного ревьювера. Кроме того, в некоторых случаях один из ревьюверов может запросить технический обзор у [технического ревьювера Kubernetes](https://github.com/kubernetes/website/wiki/Tech-reviewers), если это будет необходимо. Ревьюверы сделают все возможное, чтобы как можно оперативно оставить свои предложения и пожелания, но время ответа может варьироваться в зависимости от обстоятельств.

Узнать подробнее о том, как поучаствовать в документации Kubernetes, вы можете по ссылкам ниже:

* [Начните вносить свой вклад](https://kubernetes.io/docs/contribute/)
* [Использование шаблонов страниц](https://kubernetes.io/docs/contribute/style/page-content-types/)
* [Руководство по оформлению документации](https://kubernetes.io/docs/contribute/style/style-guide/)
* [Руководство по локализации Kubernetes](https://kubernetes.io/docs/contribute/localization/)

## Файл `README.md` на других языках
|           другие языки        |       другие языки            |
|-------------------------------|-------------------------------|
| [Английский](README.md)       | [Французский](README-fr.md)   |
| [Корейский](README-ko.md)     | [Немецкий](README-de.md)      |
| [Португальский](README-pt.md) | [Хинди](README-hi.md)         |
| [Испанский](README-es.md)     | [Индонезийский](README-id.md) |
| [Китайский](README-zh.md)     | [Японский](README-ja.md)      |
| [Вьетнамский](README-vi.md)   | [Итальянский](README-it.md)   |
| [Польский]( README-pl.md)     | [Украинский](README-uk.md)    |

### Кодекс поведения

Участие в сообществе Kubernetes регулируется [кодексом поведения CNCF](https://github.com/cncf/foundation/blob/master/code-of-conduct.md).

## Спасибо!

Kubernetes процветает благодаря сообществу и мы ценим ваш вклад в сайт и документацию!
