---
reviewers:
- Random-Liu
title: Validar la configuración del nodo
weight: 30
---

## Prueba de conformidad del nodo

La *prueba de conformidad del nodo* es un marco de pruebas contenedorizado que proporciona una verificación del
sistema y una prueba de funcionalidad para un nodo. La prueba valida si el nodo cumple con los requisitos mínimos
para Kubernetes; un nodo que pasa la prueba está calificado para unirse a un clúster de Kubernetes.

## Requisitos previos del nodo

Para ejecutar la prueba de conformidad del nodo, un nodo debe satisfacer los mismos requisitos previos que un
nodo estándar de Kubernetes. Como mínimo, el nodo debe tener instalados los siguientes demonios:

* Entornos de ejecución de contenedores compatibles con CRI, tales como Docker, containerd y CRI-O
* kubelet

## Ejecución de la prueba de conformidad del nodo

Para ejecutar la prueba de conformidad del nodo, sigue estos pasos:

1. Determina el valor de la opción `--kubeconfig` para el kubelet; por ejemplo:
   `--kubeconfig=/var/lib/kubelet/config.yaml`.
   Debido a que el marco de pruebas inicia un plano de control local para probar el kubelet,
   utiliza `http://localhost:8080` como la URL del servidor API.
   Existen algunos otros parámetros de línea de comandos de kubelet que podrías querer usar:

   * `--cloud-provider`: Si estás usando `--cloud-provider=gce`, debes
     eliminar este parámetro para ejecutar la prueba.

1. Ejecuta la prueba de conformidad del nodo con el comando:

   ```shell
   # $CONFIG_DIR es la ruta del manifiesto de pod de tu kubelet.
   # $LOG_DIR es la ruta de salida de la prueba.
   sudo docker run -it --rm --privileged --net=host \
     -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
     registry.k8s.io/node-test:0.2
   ```

## Ejecución de la prueba de conformidad del nodo para otras arquitecturas

Kubernetes también proporciona imágenes de docker para la prueba de conformidad del nodo en otras
arquitecturas:

|  Arch  |       Imagen      |
|--------|:-----------------:|
|  amd64 |  node-test-amd64  |
|  arm   |   node-test-arm   |
| arm64  |  node-test-arm64  |

## Ejecución de pruebas seleccionadas

Para ejecutar pruebas específicas, sobrescribe la variable de entorno `FOCUS` con la
expresión regular de las pruebas que deseas ejecutar.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Ejecutar únicamente la prueba MirrorPod
  registry.k8s.io/node-test:0.2
```

Para omitir pruebas específicas, sobrescribe la variable de entorno `SKIP` con la
expresión regular de las pruebas que deseas omitir.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Ejecutar todas las pruebas de conformidad pero omitir la prueba MirrorPod
  registry.k8s.io/node-test:0.2
```

La prueba de conformidad del nodo es una versión contenedorizada de la
[prueba e2e de nodo](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-node/e2e-node-tests.md).
De forma predeterminada, ejecuta todas las pruebas de conformidad.

Teóricamente, puedes ejecutar cualquier prueba e2e de nodo si configuras el contenedor y
montas los volúmenes requeridos correctamente. Sin embargo, **se recomienda encarecidamente ejecutar únicamente
la prueba de conformidad**, ya que ejecutar pruebas de no conformidad requiere una configuración mucho más compleja.

## Advertencias

* La prueba deja algunas imágenes de docker en el nodo, incluyendo la imagen de la prueba
  de conformidad del nodo e imágenes de contenedores utilizados durante la prueba
  de funcionalidad.
* La prueba deja contenedores terminados en el nodo. Estos contenedores se crean
  durante la prueba de funcionalidad.
