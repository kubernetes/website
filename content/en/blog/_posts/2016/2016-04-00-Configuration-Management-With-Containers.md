---
title: " Configuration management with Containers "
date: 2016-04-04
slug: configuration-management-with-containers
url: /blog/2016/04/Configuration-Management-With-Containers
author: >
  Paul Morie (Red Hat)
---
_**Editor's note:** this is our seventh post in a [series of in-depth posts](/blog/2016/03/five-days-of-kubernetes-12) on what's new in Kubernetes 1.2_  

A [good practice](http://12factor.net/config) when writing applications is to separate application code from configuration. We want to enable application authors to easily employ this pattern within Kubernetes. While  the Secrets API allows separating information like credentials and keys from an application, no object existed in the past for ordinary, non-secret configuration. In [Kubernetes 1.2](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md/#v120), we've added a new API resource called ConfigMap to handle this type of configuration data.  


#### **The basics of ConfigMap**
The ConfigMap API is simple conceptually. From a data perspective, the ConfigMap type is just a set of key-value pairs. Applications are configured in different ways, so we need to be flexible about how we let users store and consume configuration data. There are three ways to consume a ConfigMap in a pod:  


- Command line arguments
- Environment variables
- Files in a volume

These different methods lend themselves to different ways of modeling the data being consumed. To be as flexible as possible, we made ConfigMap hold both fine- and/or coarse-grained data. Further, because applications read configuration settings from both environment variables and files containing configuration data, we built ConfigMap to support either method of access. Let’s take a look at an example ConfigMap that contains both types of configuration:  


```
apiVersion: v1

kind: ConfigMap

metadata:

  Name: example-configmap

data:

  # property-like keys

  game-properties-file-name: game.properties

  ui-properties-file-name: ui.properties

  # file-like keys

  game.properties: |

    enemies=aliens

    lives=3

    enemies.cheat=true

    enemies.cheat.level=noGoodRotten

    secret.code.passphrase=UUDDLRLRBABAS

    secret.code.allowed=true

    secret.code.lives=30

  ui.properties: |

    color.good=purple

    color.bad=yellow

    allow.textmode=true

    how.nice.to.look=fairlyNice
```


Users that have used Secrets will find it easy to begin using ConfigMap — they’re very similar. One major difference in these APIs is that Secret values are stored as byte arrays in order to support storing binaries like SSH keys. In JSON and YAML, byte arrays are serialized as base64 encoded strings. This means that it’s not easy to tell what the content of a Secret is from looking at the serialized form. Since ConfigMap is intended to hold only configuration information and not binaries, values are stored as strings, and thus are readable in the serialized form.



We want creating ConfigMaps to be as flexible as storing data in them. To create a ConfigMap object, we’ve added a kubectl command called `kubectl create configmap` that offers three different ways to specify key-value pairs:  


- Specify literal keys and value
- Specify an individual file
- Specify a directory to create keys for each file



These different options can be mixed, matched, and repeated within a single command:  

```
    $ kubectl create configmap my-config \

    --from-literal=literal-key=literal-value \

    --from-file=ui.properties \
    --from=file=path/to/config/dir
```
Consuming ConfigMaps is simple and will also be familiar to users of Secrets. Here’s an example of a Deployment that uses the ConfigMap above to run an imaginary game server:  

```
apiVersion: extensions/v1beta1

kind: Deployment

metadata:

  name: configmap-example-deployment

  labels:

    name: configmap-example-deployment

spec:

  replicas: 1

  selector:

    matchLabels:

      name: configmap-example

  template:

    metadata:

      labels:

        name: configmap-example

    spec:

      containers:

      - name: game-container

        image: imaginarygame

        command: ["game-server", "--config-dir=/etc/game/cfg"]

        env:

        # consume the property-like keys in environment variables

        - name: GAME\_PROPERTIES\_NAME

          valueFrom:

            configMapKeyRef:

              name: example-configmap

              key: game-properties-file-name

        - name: UI\_PROPERTIES\_NAME

          valueFrom:

            configMapKeyRef:

              name: example-configmap

              key: ui-properties-file-name

        volumeMounts:

        - name: config-volume

          mountPath: /etc/game

      volumes:

      # consume the file-like keys of the configmap via volume plugin

      - name: config-volume

        configMap:

          name: example-configmap

          items:

          - key: ui.properties

            path: cfg/ui.properties

         - key: game.properties

           path: cfg/game.properties
      restartPolicy: Never
```
In the above example, the Deployment uses keys of the ConfigMap via two of the different mechanisms available. The property-like keys of the ConfigMap are used as environment variables to the single container in the Deployment template, and the file-like keys populate a volume. For more details, please see the [ConfigMap docs](/docs/user-guide/configmap/).  

We hope that these basic primitives are easy to use and look forward to seeing what people build with ConfigMaps. Thanks to the community members that provided feedback about this feature. Special thanks also to Tamer Tas who made a great contribution to the proposal and implementation of ConfigMap.  

If you’re interested in Kubernetes and configuration, you’ll want to participate in:  

- Our Configuration [Slack channel](https://kubernetes.slack.com/messages/sig-configuration/)
- Our [Kubernetes Configuration Special Interest Group](https://groups.google.com/forum/#!forum/kubernetes-sig-config) email list
- The Configuration “Special Interest Group,” which meets weekly on Wednesdays at 10am (10h00) Pacific Time at [SIG-Config hangout](https://hangouts.google.com/hangouts/_/google.com/kube-sig-config)



And of course for more information about the project in general, go to [www.kubernetes.io](http://www.kubernetes.io/) and follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio).
