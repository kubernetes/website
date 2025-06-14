---
layout: blog
title: "Develop a Kubernetes controller in Java"
date: 2019-11-26
slug: Develop-A-Kubernetes-Controller-in-Java
author: >
  Min Kim (Ant Financial), 
  Tony Ado (Ant Financial)
---

The official [Kubernetes Java SDK](https://github.com/kubernetes-client/java) project
recently released their latest work on providing the Java Kubernetes developers
a handy Kubernetes controller-builder SDK which is helpful for easily developing
advanced workloads or systems.  

## Overall

Java is no doubt one of the most popular programming languages in the world but
it's been difficult for a period time for those non-Golang developers to build up
their customized controller/operator due to the lack of library resources in the 
community. In the world of Golang, there're already some excellent controller
frameworks, for example, [controller runtime](https://github.com/kubernetes-sigs/controller-runtime),
[operator SDK](https://github.com/operator-framework/operator-sdk). These
existing Golang frameworks are relying on the various utilities from the
[Kubernetes Golang SDK](https://github.com/kubernetes/client-go) proven to
be stable over years. Driven by the emerging need of further integration into
the platform of Kubernetes, we not only ported many essential toolings from the Golang
SDK into the kubernetes Java SDK including informers, work-queues, leader-elections,
etc. but also developed a controller-builder SDK which wires up everything into
a runnable controller without hiccups.


## Backgrounds

Why use Java to implement Kubernetes tooling? You might pick Java for:

- __Integrating legacy enterprise Java systems__: Many companies have their legacy
systems or frameworks written in Java in favor of stability. We are not able to
move everything to Golang easily.

- __More open-source community resources__: Java is mature and has accumulated abundant open-source
libraries over decades, even though Golang is getting more and more fancy and
popular for developers. Additionally, nowadays developers are able to develop
their aggregated-apiservers over SQL-storage and Java has way better support on SQLs.


## How to use?

Take maven project as example, adding the following dependencies into your dependencies:

```xml
<dependency>
    <groupId>io.kubernetes</groupId>
    <artifactId>client-java-extended</artifactId>
    <version>6.0.1</version>
</dependency>
```

Then we can make use of the provided builder libraries to write your own controller.
For example, the following one is a simple controller prints out node information
on watch notification, see complete example [here](https://github.com/kubernetes-client/java/blob/master/examples/examples-release-13/src/main/java/io/kubernetes/client/examples/ControllerExample.java):

```java
...
    Reconciler reconciler = new Reconciler() {
      @Override
      public Result reconcile(Request request) {
        V1Node node = nodeLister.get(request.getName());
        System.out.println("triggered reconciling " + node.getMetadata().getName());
        return new Result(false);
      }
    };
    Controller controller =
        ControllerBuilder.defaultBuilder(informerFactory)
            .watch(
                (workQueue) -> ControllerBuilder.controllerWatchBuilder(V1Node.class, workQueue).build())
            .withReconciler(nodeReconciler) // required, set the actual reconciler
            .withName("node-printing-controller") // optional, set name for controller for logging, thread-tracing
            .withWorkerCount(4) // optional, set worker thread count
            .withReadyFunc( nodeInformer::hasSynced) // optional, only starts controller when the cache has synced up
            .build();
```

If you notice, the new Java controller framework learnt a lot from the design of
[controller-runtime](https://github.com/kubernetes-sigs/controller-runtime) which
successfully encapsulates the complex components inside controller into several
clean interfaces. With the help of Java Generics, we even move on a bit and simply
the encapsulation in a better way.

As for more advanced usage, we can wrap multiple controllers into a controller-manager
or a leader-electing controller which helps deploying in HA setup. In a word, we can
basically find most of the equivalence implementations here from Golang SDK and
more advanced features are under active development by us.

## Future steps

The community behind the official Kubernetes Java SDK project will be focusing on
providing more useful utilities for developers who hope to program cloud native
Java applications to extend Kubernetes. If you are interested in more details,
please look at our repo [kubernetes-client/java](https://github.com/kubernetes-client/java).
Feel free to share also your feedback with us, through Issues or [Slack](http://kubernetes.slack.com/messages/kubernetes-client/).
