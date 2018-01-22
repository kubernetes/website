---
layout: blog
title: " Configuration management with Containers "
date:  Tuesday, April 04, 2016 

---
_Editor’s note: this is our seventh post in a [series of in-depth posts](http://blog.kubernetes.io/2016/03/five-days-of-kubernetes-12.html) on what's new in Kubernetes 1.2_  
  
A [good practice](http://12factor.net/config) when writing applications is to separate application code from configuration. We want to enable application authors to easily employ this pattern within Kubernetes. While &nbsp;the Secrets API allows separating information like credentials and keys from an application, no object existed in the past for ordinary, non-secret configuration. In [Kubernetes 1.2](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG.md/#v120), we've added a new API resource called ConfigMap to handle this type of configuration data.  
  

#### **The basics of ConfigMap**
The ConfigMap API is simple conceptually. From a data perspective, the ConfigMap type is just a set of key-value pairs. Applications are configured in different ways, so we need to be flexible about how we let users store and consume configuration data. There are three ways to consume a ConfigMap in a pod:  
  

- Command line arguments
- Environment variables
- Files in a volume
  
These different methods lend themselves to different ways of modeling the data being consumed. To be as flexible as possible, we made ConfigMap hold both fine- and/or coarse-grained data. Further, because applications read configuration settings from both environment variables and files containing configuration data, we built ConfigMap to support either method of access. Let’s take a look at an example ConfigMap that contains both types of configuration:  

  

apiVersion: v1

kind: ConfigMap

metadata:

 &nbsp;Name: example-configmap

data:

 &nbsp;# property-like keys

 &nbsp;game-properties-file-name: game.properties

 &nbsp;ui-properties-file-name: ui.properties

 &nbsp;# file-like keys

 &nbsp;game.properties: |

 &nbsp;&nbsp;&nbsp;enemies=aliens

 &nbsp;&nbsp;&nbsp;lives=3

 &nbsp;&nbsp;&nbsp;enemies.cheat=true

 &nbsp;&nbsp;&nbsp;enemies.cheat.level=noGoodRotten

 &nbsp;&nbsp;&nbsp;secret.code.passphrase=UUDDLRLRBABAS

 &nbsp;&nbsp;&nbsp;secret.code.allowed=true

 &nbsp;&nbsp;&nbsp;secret.code.lives=30

 &nbsp;ui.properties: |

 &nbsp;&nbsp;&nbsp;color.good=purple

 &nbsp;&nbsp;&nbsp;color.bad=yellow

 &nbsp;&nbsp;&nbsp;allow.textmode=true

 &nbsp;&nbsp;&nbsp;how.nice.to.look=fairlyNice

  

Users that have used Secrets will find it easy to begin using ConfigMap — they’re very similar. One major difference in these APIs is that Secret values are stored as byte arrays in order to support storing binaries like SSH keys. In JSON and YAML, byte arrays are serialized as base64 encoded strings. This means that it’s not easy to tell what the content of a Secret is from looking at the serialized form. Since ConfigMap is intended to hold only configuration information and not binaries, values are stored as strings, and thus are readable in the serialized form.

  

We want creating ConfigMaps to be as flexible as storing data in them. To create a ConfigMap object, we’ve added a kubectl command called `kubectl create configmap` that offers three different ways to specify key-value pairs:  
  

- Specify literal keys and value
- Specify an individual file
- Specify a directory to create keys for each file

  

These different options can be mixed, matched, and repeated within a single command:  
  

 &nbsp;&nbsp;&nbsp;$ kubectl create configmap my-config \

 &nbsp;&nbsp;&nbsp;--from-literal=literal-key=literal-value \

 &nbsp;&nbsp;&nbsp;--from-file=ui.properties \
 &nbsp;&nbsp;&nbsp;--from=file=path/to/config/dir

Consuming ConfigMaps is simple and will also be familiar to users of Secrets. Here’s an example of a Deployment that uses the ConfigMap above to run an imaginary game server:  
  

apiVersion: extensions/v1beta1

kind: Deployment

metadata:

 &nbsp;name: configmap-example-deployment

 &nbsp;labels:

 &nbsp;&nbsp;&nbsp;name: configmap-example-deployment

spec:

 &nbsp;replicas: 1

 &nbsp;selector:

 &nbsp;&nbsp;&nbsp;matchLabels:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: configmap-example

 &nbsp;template:

 &nbsp;&nbsp;&nbsp;metadata:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;labels:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: configmap-example

 &nbsp;&nbsp;&nbsp;spec:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;containers:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: game-container

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image: imaginarygame

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;command: ["game-server", "--config-dir=/etc/game/cfg"]

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;env:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# consume the property-like keys in environment variables

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: GAME\_PROPERTIES\_NAME

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;valueFrom:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;configMapKeyRef:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: example-configmap

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;key: game-properties-file-name

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: UI\_PROPERTIES\_NAME

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;valueFrom:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;configMapKeyRef:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: example-configmap

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;key: ui-properties-file-name

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;volumeMounts:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: config-volume

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mountPath: /etc/game

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;volumes:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# consume the file-like keys of the configmap via volume plugin

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: config-volume

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;configMap:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: example-configmap

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;items:

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- key: ui.properties

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;path: cfg/ui.properties

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- key: game.properties

 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;path: cfg/game.properties
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;restartPolicy: Never
In the above example, the Deployment uses keys of the ConfigMap via two of the different mechanisms available. The property-like keys of the ConfigMap are used as environment variables to the single container in the Deployment template, and the file-like keys populate a volume. For more details, please see the [ConfigMap docs](http://kubernetes.io/docs/user-guide/configmap/).  
  
We hope that these basic primitives are easy to use and look forward to seeing what people build with ConfigMaps. Thanks to the community members that provided feedback about this feature. Special thanks also to Tamer Tas who made a great contribution to the proposal and implementation of ConfigMap.  
  
If you’re interested in Kubernetes and configuration, you’ll want to participate in:  

  

- Our Configuration [Slack channel](https://kubernetes.slack.com/messages/sig-configuration/)
- Our [Kubernetes Configuration Special Interest Group](https://groups.google.com/forum/#!forum/kubernetes-sig-config) email list
- The Configuration “Special Interest Group,” which meets weekly on Wednesdays at 10am (10h00) Pacific Time at [SIG-Config hangout](https://hangouts.google.com/hangouts/_/google.com/kube-sig-config)

  

And of course for more information about the project in general, go to [www.kubernetes.io](http://www.kubernetes.io/) and follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio).  
  
-- _Paul Morie, Senior Software Engineer, Red Hat_
  

  

  

  

