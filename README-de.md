# Kubernetes Dokumentation

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Herzlich willkommen! Dieses Repository enthält alle Assets, die zur Erstellung der [Kubernetes-Website und Dokumentation](https://kubernetes.io/) erforderlich sind. Wir freuen uns sehr, dass Sie dazu beitragen wollen!

## Beiträge zur Dokumentation

Sie können auf die Schaltfläche **Fork** im oberen rechten Bereich des Bildschirms klicken, um eine Kopie dieses Repositorys in Ihrem GitHub-Konto zu erstellen. Diese Kopie wird als *Fork* bezeichnet. Nehmen Sie die gewünschten Änderungen an Ihrem Fork vor. Wenn Sie bereit sind, diese Änderungen an uns zu senden, gehen Sie zu Ihrem Fork und erstellen Sie eine neue Pull-Anforderung, um uns darüber zu informieren.

Sobald Ihre Pull-Anfrage erstellt wurde, übernimmt ein Rezensent von Kubernetes die Verantwortung für klares, umsetzbares Feedback. Als Eigentümer des Pull-Request **liegt es in Ihrer Verantwortung Ihren Pull-Reqest entsprechend des Feedbacks, dass Sie vom Kubernetes-Reviewer erhalten haben abzuändern.** Beachten Sie auch, dass Sie am Ende mehr als einen Rezensenten von Kubernetes erhalten, der Ihnen Feedback gibt, oder dass Sie Rückmeldungen von einem Rezensenten von Kubernetes erhalten, der sich von demjenigen unterscheidet, der ursprünglich für das Feedback zugewiesen wurde. In einigen Fällen kann es vorkommen, dass einer Ihrer Prüfer bei Bedarf eine technische Überprüfung von einem [Kubernetes Tech-Reviewer](https://github.com/kubernetes/website/wiki/tech-reviewers) anfordert. Reviewer geben ihr Bestes, um zeitnah Feedback zu geben, die Antwortzeiten können jedoch je nach den Umständen variieren.

Weitere Informationen zum Beitrag zur Kubernetes-Dokumentation finden Sie unter:

* [Mitwirkung beginnen](https://kubernetes.io/docs/contribute/start/)
* [Ihre Dokumentationsänderungen bereitstellen](https://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Seitenvorlagen verwenden](https://kubernetes.io/docs/contribute/style/page-content-types/)
* [Dokumentationsstil-Handbuch](https://kubernetes.io/docs/contribute/style/style-guide/)
* [Übersetzung der Kubernetes-Dokumentation](https://kubernetes.io/docs/contribute/localization/)

## `README.md`'s Localizing Kubernetes Documentation

### Deutsch
Die Betreuer der deutschen Lokalisierung erreichen Sie unter:

* Benedikt Rollik ([@bene2k1](https://github.com/bene2k1))
* Max Körbächer ([@mkorbi](https://github.com/mkorbi))
* [Slack Kanal](https://kubernetes.slack.com/messages/kubernetes-docs-de)

## Site lokal mit Docker ausführen

Um die Kubernetes-Website lokal laufen zu lassen, empfiehlt es sich, ein spezielles [Docker](https://docker.com) Image auszuführen, das den statischen Site-Generator [Hugo](https://gohugo.io) enthält.

> Unter Windows benötigen Sie einige weitere Tools, die Sie mit [Chocolatey](https://chocolatey.org) installieren können.
`choco install make`

> Wenn Sie die Website lieber lokal ohne Docker ausführen möchten, finden Sie weitere Informationen unter [Website lokal mit Hugo ausführen](#Die-Site-lokal-mit-Hugo-ausführen).

Wenn Sie Docker [installiert](https://www.docker.com/get-started) haben, erstellen Sie das Docker-Image `kubernetes-hugo` lokal:

```bash
make container-image
```

Nachdem das Image erstellt wurde, können Sie die Site lokal ausführen:

```bash
make container-serve
```

Öffnen Sie Ihren Browser unter http://localhost:1313, um die Site anzuzeigen. Wenn Sie Änderungen an den Quelldateien vornehmen, aktualisiert Hugo die Site und erzwingt eine Browseraktualisierung.

## Die Site lokal mit Hugo ausführen

Hugo-Installationsanweisungen finden Sie in der [offiziellen Hugo-Dokumentation](https://gohugo.io/getting-started/installing/). Stellen Sie sicher, dass Sie die Hugo-Version installieren, die in der Umgebungsvariablen `HUGO_VERSION` in der Datei [`netlify.toml`](netlify.toml#L9) angegeben ist.

So führen Sie die Site lokal aus, wenn Sie Hugo installiert haben:

```bash
make serve
```

Dadurch wird der lokale Hugo-Server an Port 1313 gestartet. Öffnen Sie Ihren Browser unter http://localhost:1313, um die Site anzuzeigen. Wenn Sie Änderungen an den Quelldateien vornehmen, aktualisiert Hugo die Site und erzwingt eine Browseraktualisierung.

## Community, Diskussion, Beteiligung und Unterstützung

Erfahren Sie auf der [Community-Seite](https://kubernetes.io/community/) wie Sie mit der Kubernetes-Community interagieren können.

Sie können die Betreuer dieses Projekts unter folgender Adresse erreichen:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

### Verhaltensregeln

Die Teilnahme an der Kubernetes-Community unterliegt dem [Kubernetes-Verhaltenskodex](code-of-conduct.md).

## Vielen Dank!

Kubernetes lebt vom Community Engagement und wir freuen uns sehr über Ihre Beiträge zu unserer Website und unserer Dokumentation!
