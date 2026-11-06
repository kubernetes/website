---
reviewers:
- raelga
- electrocucaracha
title: Validar la configuración del nodo
weight: 30
---

## Prueba de conformidad del nodo

La *Prueba de conformidad del nodo* es un framework de pruebas contenedorizadas que proporcionan un sistema de
verificación y pruebas de funcionalidad para un nodo. La prueba valida que el
nodo cumpla con los requerimientos mínimos de Kubernetes; un nodo que pase la prueba
está cualificado para unirse a un clúster de Kubernetes.

## Prerrequisitos del nodo

Para ejecutar una prueba de conformidad del nodo, el nodo debe satisfacer los mismos prerrequisitos que
el nodo de Kubernetes estándar. Mínimo, el nodo debería tener los siguientes
daemons instalados:

* Runtimes de contenedores compatibles con CRI como Docker, containerd y CRI-O
* kubelet

## Ejecutar la prueba de conformidad del nodo

Para ejecutar la prueba de conformidad del nodo, realiza los siguientes pasos:

1. Establece el valor de la opción `--kubeconfig` para el kubelet; por ejemplo:
   `--kubeconfig=/var/lib/kubelet/config.yaml`.
    Dado que el framework de pruebas inicia un plano de control local para probar el kubelet,
    utiliza `http://localhost:8080` como la URL del servidor API.
    Hay otros parámetros de la línea de comandos de kubelet que quisieras utilizar:

   * `--cloud-provider`: Si estás utilizando `--cloud-provider=gce`, deberías
     quitar el flag para ejecutar la prueba.

1. Ejecuta la prueba de conformidad de nodo con el comando:

   ```shell
   # $CONFIG_DIR es la ruta del manifiesto del pod de tu kubelet.
   # $LOG_DIR es la ruta de salida de la prueba.
   sudo docker run -it --rm --privileged --net=host \
     -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
     registry.k8s.io/node-test:0.2
   ```

## Ejecutar la prueba de conformidad del nodo para otras arquitecturas

Kubernetes también proporciona imágenes de docker para la prueba de conformidad del nodo para otras
arquitecturas:

|  Arquitectura  |       Imagen      |
|----------------|:-----------------:|
|  amd64         |  node-test-amd64  |
|  arm           |   node-test-arm   |
|  arm64         |  node-test-arm64  |

## Ejecutar pruebas seleccionadas

Para ejecutar pruebas específicas, sobreescribe la variable de entorno `FOCUS` con la
expresión regular de las pruebas que quieres ejecutar.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Solo ejecuta la prueba MirrorPod
  registry.k8s.io/node-test:0.2
```

Para saltar pruebas específicas, sobreescribe la variable de entorno `SKIP` con la
expresión regular de las pruebas que quieres saltar.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Ejecuta todas las pruebas de conformidad pero omite la prueba MirrorPod
  registry.k8s.io/node-test:0.2
```

La prueba de conformidad del nodo es una versión contenedorizada de la
[prueba e2e del nodo](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-node/e2e-node-tests.md).
Por predeterminado, ejecuta todas las pruebas de conformidad.

Teóricamente, puedes ejecutar cualquier prueba e2e del nodo si configuras el contenedor y
montas los volúmenes requeridos apropiadamente. Pero **se recomienda fuertemente solo ejecutar las pruebas de
conformidad**, porque requieren configuraciones mucho más complejas que ejecutar pruebas de no conformidad.

## Advertencias

* Las pruebas dejan algunas imágenes de docker en el nodo, incluyendo la imagen de la prueba de conformidad del nodo
  e imágenes de contenedores utilizados en la prueba de
  funcionalidad.
* Las pruebas dejan contenedores inactivos en el nodo. Estos contenedores son creados
  durante la prueba de funcionalidad.
