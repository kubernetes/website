---
title: Проверка настройки узла
weight: 30
---

## Тест соответствия узла {#node-conformance-test}

*Тест соответствия узла* — это работающая в контейнере среда тестирования, которая
выполняет системную и функциональную проверку узла. Тест проверяет, соответствует ли
узел минимальным требованиям Kubernetes. Узел, прошедший тест, пригоден для присоединения
к кластеру Kubernetes.

## Требования к узлу {#node-prerequisite}

Для запуска теста соответствия узел должен удовлетворять тем же требованиям,
что и обычный узел Kubernetes. Как минимум на нём должны быть установлены следующие службы:

* Совместимая с CRI среда выполнения контейнеров, например Docker, containerd или CRI-O.
* kubelet.

## Запуск теста соответствия узла {#running-node-conformance-test}

Чтобы запустить тест соответствия узла, выполните следующие шаги:

1. Определите значение параметра `--kubeconfig` для kubelet, например:
   `--kubeconfig=/var/lib/kubelet/config.yaml`.
   Поскольку среда тестирования запускает локальный управляющий слой для проверки kubelet,
   используйте `http://localhost:8080` в качестве URL сервера API.
   Также обратите внимание на другие параметры командной строки kubelet:

   * `--cloud-provider`: если вы используете `--cloud-provider=gce`, удалите этот флаг
     для запуска теста.

1. Запустите тест соответствия узла командой:

   ```shell
   # $CONFIG_DIR is the pod manifest path of your kubelet.
   # $LOG_DIR is the test output path.
   sudo docker run -it --rm --privileged --net=host \
     -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
     registry.k8s.io/node-test:0.2
   ```

## Запуск теста соответствия узла на других архитектурах {#running-node-conformance-test-for-other-architectures}

Kubernetes также предоставляет образы Docker теста соответствия узла для других архитектур:

| Архитектура | Образ |
|--------|:-----------------:|
| amd64 | node-test-amd64 |
| arm | node-test-arm |
| arm64 | node-test-arm64 |

## Запуск выбранных тестов {#running-selected-test}

Чтобы запустить определённые тесты, задайте переменной окружения `FOCUS`
регулярное выражение, соответствующее нужным тестам.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Only run MirrorPod test
  registry.k8s.io/node-test:0.2
```

Чтобы пропустить определённые тесты, задайте переменной окружения `SKIP`
регулярное выражение, соответствующее исключаемым тестам.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Run all conformance tests but skip MirrorPod test
  registry.k8s.io/node-test:0.2
```

Тест соответствия узла — это версия
[сквозного теста узла](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-node/e2e-node-tests.md),
работающая в контейнере. По умолчанию выполняются все тесты соответствия.

Теоретически можно запустить любой сквозной тест узла, правильно настроив контейнер
и подключив необходимые тома. Однако **настоятельно рекомендуется запускать только
тесты соответствия**, поскольку остальные тесты требуют гораздо более сложной настройки.

## Особенности {#caveats}

* После теста на узле остаются некоторые образы Docker, включая образ теста соответствия
  узла и образы контейнеров, использованных в функциональном тесте.
* После теста на узле остаются завершённые контейнеры, созданные в ходе функционального теста.
