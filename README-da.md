# Kubernetes Dokumentation

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Velkommen! Dette repository indeholder alle aktiver, der er nødvendige for at oprette [Kubernetes-webstedet og dokumentationen](https://kubernetes.io/). Vi er meget glade for, at du ønsker at bidrage!

## Bidrag til dokumentationen

Du kan klikke på knappen **Fork** øverst til højre på skærmen for at oprette en kopi af dette repository på din GitHub-konto. Denne kopi kaldes en *fork*. Foretag de ønskede ændringer i din fork. Når du er klar til at sende disse ændringer til os, skal du gå til din fork og oprette en ny pull-request for at informere os om det.

Når din pull-request er oprettet, vil en anmelder fra Kubernetes tage ansvar for at give klar, handlingsbar feedback. Som ejer af pull-requesten **er det dit ansvar at ændre din pull-request i overensstemmelse med den feedback, du har modtaget fra Kubernetes-anmelderen.** Bemærk også, at du kan ende med at få mere end én anmelder fra Kubernetes, der giver dig feedback, eller at du modtager feedback fra en anden anmelder end den, der oprindeligt blev tildelt til at give feedback. I nogle tilfælde kan en af dine anmeldere bede om en teknisk gennemgang fra en [Kubernetes Tech-Reviewer](https://github.com/kubernetes/website/wiki/tech-reviewers) om nødvendigt. Anmeldere vil gøre deres bedste for at give hurtig feedback, men svartiderne kan variere afhængigt af omstændighederne.

For mere information om at bidrage til Kubernetes-dokumentationen, se:

* [Kom i gang med at bidrage](https://kubernetes.io/docs/contribute/start/)
* [Se dine dokumentationsændringer lokalt](https://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Brug af sidemaler](https://kubernetes.io/docs/contribute/style/page-content-types/)
* [Dokumentationsstil-guide](https://kubernetes.io/docs/contribute/style/style-guide/)
* [Oversættelse af Kubernetes-dokumentationen](https://kubernetes.io/docs/contribute/localization/)

## `README.md`'s Lokalisering af Kubernetes Dokumentation

### Tysk
Du kan nå vedligeholderne af den tyske lokalisering på:

* Benedikt Rollik ([@bene2k1](https://github.com/bene2k1))
* Max Körbächer ([@mkorbi](https://github.com/mkorbi))
* [Slack Kanal](https://kubernetes.slack.com/messages/kubernetes-docs-de)

## Kørsel af websitet lokalt med Docker

For at køre Kubernetes-websitet lokalt, anbefales det at køre et specifikt [Docker](https://docker.com) image, som indeholder den statiske website-generator [Hugo](https://gohugo.io).

> På Windows skal du bruge nogle ekstra værktøjer, som du kan installere med [Chocolatey](https://chocolatey.org).
`choco install make`

> Hvis du foretrækker at køre websitet lokalt uden Docker, kan du finde flere oplysninger under [Kør websitet lokalt med Hugo](#Kør-websitet-lokalt-med-Hugo).

Det nødvendige [Docsy Hugo-tema](https://github.com/google/docsy#readme) skal installeres som et git submodule:

```
#Tilføj Docsy submodule
git submodule update --init --recursive --depth 1
```

Når du har [installeret](https://www.docker.com/get-started) Docker, skal du bygge Docker-imaget `kubernetes-hugo` lokalt:

```bash
make container-image
```

Når imaget er bygget, kan du åbne websitet lokalt:

```bash
make container-serve
```

Åbn din browser på http://localhost:1313 for at se websitet. Når du foretager ændringer i kildefilerne, opdaterer Hugo websitet og tvinger en browseropdatering.

## Kør websitet lokalt med Hugo

Hugo installationsinstruktioner kan findes i den [officielle Hugo-dokumentation](https://gohugo.io/getting-started/installing/). Sørg for at installere den Hugo-version, der er angivet i miljøvariablen `HUGO_VERSION` i filen [`netlify.toml`](netlify.toml#L9).

Det nødvendige [Docsy Hugo-tema](https://github.com/google/docsy#readme) skal installeres som et git submodule:

```
#Tilføj Docsy submodule
git submodule update --init --recursive --depth 1
```

Sådan kører du websitet lokalt, når du har installeret Hugo:

```bash
# Installer JavaScript afhængigheder
npm ci
make serve
```

Dette starter den lokale Hugo-server på port 1313. Åbn din browser på http://localhost:1313 for at se websitet. Når du foretager ændringer i kildefilerne, opdaterer Hugo websitet og tvinger en browseropdatering.

## Fællesskab, diskussion, deltagelse og support

Lær hvordan du kan interagere med Kubernetes-fællesskabet på [fællesskabssiden](https://kubernetes.io/community/).

Du kan nå vedligeholderne af dette projekt på:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

### Adfærdsregler

Deltagelse i Kubernetes-fællesskabet er underlagt [Kubernetes adfærdskodeks](code-of-conduct.md).

## Mange tak!

Kubernetes lever af fællesskabsengagement, og vi er meget glade for dine bidrag til vores website og dokumentation!
