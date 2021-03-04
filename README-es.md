# La documentación de Kubernetes

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Bienvenido!
Este repositorio contiene todos los recursos necesarios para construir el [sitio web de Kubernetes y su documentación](https://kubernetes.io/). ¡Estamos encantados de que quiera contribuir!

## Contribuyendo con la documentación

Puede hacer clic en el botón **Fork** situado en la esquina superior derecha de la pantalla para crear una copia de este repositorio en su cuenta de GitHub. A ese tipo de copia se le llama **Fork** (bifurcación) y le permite editar el contenido del repositorio en su copia personal. Realice los cambios que quiera en su **fork** y, cuando esté listo para enviarnos esos cambios, vaya a **fork** en repositorio en su GitHub y cree una nueva **pull request** para que tengamos constancia de la propuesta de cambios.

Una vez la **pull request** ha sido creada, un revisor de Kubernetes asumirá la responsabilidad de proporcionar comentarios claros y prácticos sobre como continuar. Como propietario de la PR, **es su responsabilidad modificar la pull request para abordar los comentarios proporcionados por el revisor de Kubernetes.** Tenga en cuenta que algunas veces puede terminar teniendo más de un revisor de Kubernetes participando en la revisión, por lo que es posible que reciba comentarios de más revisores a parte del asignado originalmente en la creación de la **pull request**. Además, en algunas ocasiones, es posible que uno de sus revisores solicite una revisión técnica por parte de un [revisor técnico de Kubernetes](https://github.com/kubernetes/website/wiki/Tech-reviewers) si lo considera necesario.

Los revisores harán todo lo posible para proporcionar toda la información necesaria para que la **pull request** siga adelante en un tiempo razonable, pero este tiempo de respuesta puede variar según las circunstancias.

Para obtener más información sobre cómo contribuir a la documentación de Kubernetes, puede consultar:

* [Empezando a contribuir](https://kubernetes.io/docs/contribute/start/)
* [Visualizando sus cambios en su entorno local](https://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [Utilizando las plantillas de las páginas](https://kubernetes.io/docs/contribute/style/page-content-types/)
* [Guía de estilo de la documentación](https://kubernetes.io/docs/contribute/style/style-guide/)
* [Traduciendo la documentación de Kubernetes](https://kubernetes.io/docs/contribute/localization/)

## Levantando el sitio web kubernetes.io en su entorno local con Docker

El método recomendado para levantar una copia local del sitio web kubernetes.io es utilizando la imagen de [Docker](https://docker.com) que incluye el generador de sitios estáticos [Hugo](https://gohugo.io).

> Para Windows, algunas otras herramientas como Make son necesarias. Puede instalarlas utilizando el gestor [Chocolatey](https://chocolatey.org). `choco install make` o siguiendo las instrucciones de [Make for Windows](http://gnuwin32.sourceforge.net/packages/make.htm).

> Si prefiere levantar el sitio web sin utilizar **Docker**, puede seguir las instrucciones disponibles en la sección [Levantando kubernetes.io en local con Hugo](#levantando-kubernetesio-en-local-con-hugo).

Una vez tenga Docker [configurado en su máquina](https://www.docker.com/get-started), puede construir la imagen de Docker `kubernetes-hugo` localmente ejecutando el siguiente comando en la raíz del repositorio:

```bash
make container-image
```

Una vez tenga la imagen construida, puede levantar el sitio web ejecutando:

```bash
make container-serve
```

Abra su navegador y visite http://localhost:1313 para acceder a su copia local del sitio. A medida que vaya haciendo cambios en el código fuente, Hugo irá actualizando la página y forzará la actualización en el navegador.

## Levantando kubernetes.io en local con Hugo

Revise la [documentación oficial de Hugo](https://gohugo.io/getting-started/installing/) para obtener las instrucciones de instalación en su sistema operativo. Asegúrese de instalar la versión de Hugo especificada en la variable de entorno  `HUGO_VERSION` del fichero [`netlify.toml`](netlify.toml#L9).

Para levantar el sitio localmente una vez Hugo está instalado en su sistema, puede ejecutar el siguiente comando:

```bash
make serve
```

Este comando levantará un servidor de Hugo en el puerto **1313** al que podrá acceder visitando http://localhost:1313 y dónde podrá visualizar su copia local del sitio web. A medida que vaya haciendo cambios en el código fuente, Hugo irá actualizando la página y forzará la actualización en el navegador.

## Comunidad, discusión, contribuir y soporte

Aprenda como participar en la comunidad de Kubernetes visitando la [página de comunidad](http://kubernetes.io/community/).

Puede ponerse en contacto con los mantenedores de este proyecto en:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

### Código de conducta

La participación en la comunidad de Kubernetes está regulada por el [Código de Conducta de Kubernetes](code-of-conduct.md).

## ¡Muchas gracias!

Kubernetes es posible gracias a la participación de la comunidad y la documentación es vital para facilitar el acceso al proyecto.

Agradecemos muchísimo sus contribuciones a nuestro sitio web y nuestra documentación.