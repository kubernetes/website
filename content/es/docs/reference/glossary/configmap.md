---
title: Configmap
id: configmap
date: 2020-07-11
full_link: /docs/concepts/configuration/configmap/
short_description: >
  Almacena información no sensible.

aka:
tags:
- workload
---
un objeto de la API utilizado para almacenar datos no confidenciales en el formato clave-valor. Los Pods pueden utilizar los Configmaps como variables de entorno, argumentos de la linea de comandos o como ficheros de configuración en un volumen.

Un ConfigMap te permite desacoplar la configuración de un entorno específico de una imagen de contenedor, así las aplicaciones son fácilmente portables.

<!--more-->


