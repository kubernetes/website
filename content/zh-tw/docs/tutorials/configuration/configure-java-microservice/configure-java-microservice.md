---
title: "使用 MicroProfile、ConfigMaps、Secrets 實現外部化應用配置"
content_type: tutorial
weight: 10
---
<!-- 
---
title: "Externalizing config using MicroProfile, ConfigMaps and Secrets"
content_type: tutorial
weight: 10
---
-->

<!-- overview -->

<!-- 
In this tutorial you will learn how and why to externalize your microservice’s configuration.  Specifically, you will learn how to use Kubernetes ConfigMaps and Secrets to set environment variables and then consume them using MicroProfile Config.
-->
在本教程中，你會學到如何以及為什麼要實現外部化微服務應用配置。
具體來說，你將學習如何使用 Kubernetes ConfigMaps 和 Secrets 設定環境變數，
然後在 MicroProfile config 中使用它們。

## {{% heading "prerequisites" %}}

<!-- 
### Creating Kubernetes ConfigMaps & Secrets
There are several ways to set environment variables for a Docker container in Kubernetes, including: Dockerfile, kubernetes.yml, Kubernetes ConfigMaps, and Kubernetes Secrets.  In the tutorial, you will learn how to use the latter two for setting your environment variables whose values will be injected into your microservices.  One of the benefits for using ConfigMaps and Secrets is that they can be re-used across multiple containers, including being assigned to different environment variables for the different containers.
-->
### 建立 Kubernetes ConfigMaps 和 Secrets  {#creating-kubernetes-configmaps-secrets}
在 Kubernetes 中，為 docker 容器設定環境變數有幾種不同的方式，比如：
Dockerfile、kubernetes.yml、Kubernetes ConfigMaps、和 Kubernetes Secrets。
在本教程中，你將學到怎麼用後兩個方式去設定你的環境變數，而環境變數的值將注入到你的微服務裡。
使用 ConfigMaps 和 Secrets 的一個好處是他們能在多個容器間複用，
比如賦值給不同的容器中的不同環境變數。

<!-- 
ConfigMaps are API Objects that store non-confidential key-value pairs.  In the Interactive Tutorial you will learn how to use a ConfigMap to store the application's name.  For more information regarding ConfigMaps, you can find the documentation [here](/docs/tasks/configure-pod-container/configure-pod-configmap/).

Although Secrets are also used to store key-value pairs, they differ from ConfigMaps in that they're intended for confidential/sensitive information and are stored using Base64 encoding.  This makes secrets the appropriate choice for storing such things as credentials, keys, and tokens, the former of which you'll do in the Interactive Tutorial.  For more information on Secrets, you can find the documentation [here](/docs/concepts/configuration/secret/).
-->
ConfigMaps 是儲存非機密鍵值對的 API 物件。
在互動教程中，你會學到如何用 ConfigMap 來儲存應用名字。
ConfigMap 的更多資訊，你可以在[這裡](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)找到文件。

Secrets 儘管也用來儲存鍵值對，但區別於 ConfigMaps 的是：它針對機密/敏感資料，且儲存格式為 Base64 編碼。
secrets 的這種特性使得它適合於儲存證書、金鑰、令牌，上述內容你將在互動教程中實現。
Secrets 的更多資訊，你可以在[這裡](/zh-cn/docs/concepts/configuration/secret/)找到文件。


<!-- 
### Externalizing Config from Code
Externalized application configuration is useful because configuration usually changes depending on your environment.  In order to accomplish this, we'll use Java's Contexts and Dependency Injection (CDI) and MicroProfile Config. MicroProfile Config is a feature of MicroProfile, a set of open Java technologies for developing and deploying cloud-native microservices.
-->
### 從程式碼外部化配置
外部化應用配置之所以有用處，是因為配置常常根據環境的不同而變化。
為了實現此功能，我們用到了 Java 上下文和依賴注入（Contexts and Dependency Injection, CDI）、MicroProfile 配置。
MicroProfile config 是 MicroProfile 的功能特性，
是一組開放 Java 技術，用於開發、部署雲原生微服務。

<!-- 
CDI provides a standard dependency injection capability enabling an application to be assembled from collaborating, loosely-coupled beans.  MicroProfile Config provides apps and microservices a standard way to obtain config properties from various sources, including the application, runtime, and environment.  Based on the source's defined priority, the properties are automatically combined into a single set of properties that the application can access via an API.  Together, CDI & MicroProfile will be used in the Interactive Tutorial to retrieve the externally provided properties from the Kubernetes ConfigMaps and Secrets and get injected into your application code.

Many open source frameworks and runtimes implement and support MicroProfile Config.  Throughout the interactive tutorial, you'll be using Open Liberty, a flexible open-source Java runtime for building and running cloud-native apps and microservices.  However, any MicroProfile compatible runtime could be used instead. 
-->
CDI 提供一套標準的依賴注入能力，使得應用程式可以由相互協作的、松耦合的 beans 組裝而成。
MicroProfile Config 為 app 和微服務提供從各種來源，比如應用、執行時、環境，獲取配置引數的標準方法。
基於來源定義的優先順序，屬性可以自動的合併到單獨一組應用可以透過 API 訪問到的屬性。
CDI & MicroProfile 都會被用在互動教程中，
用來從 Kubernetes ConfigMaps 和 Secrets 獲得外部提供的屬性，並注入應用程式程式碼中。

很多開源框架、執行時支援 MicroProfile Config。
對於整個互動教程，你都可以使用開放的庫、靈活的開源 Java 執行時，去構建並運行雲原生的 apps 和微服務。
然而，任何 MicroProfile 相容的執行時都可以用來做替代品。


## {{% heading "objectives" %}}

<!-- 
* Create a Kubernetes ConfigMap and Secret
* Inject microservice configuration using MicroProfile Config
-->
* 建立 Kubernetes ConfigMap 和 Secret
* 使用 MicroProfile Config 注入微服務配置

  
<!-- lessoncontent -->

<!-- 
## Example: Externalizing config using MicroProfile, ConfigMaps and Secrets
### [Start Interactive Tutorial](/docs/tutorials/configuration/configure-java-microservice/configure-java-microservice-interactive/) 
-->
## 示例：使用 MicroProfile、ConfigMaps、Secrets 實現外部化應用配置
### [啟動互動教程](/zh-cn/docs/tutorials/configuration/configure-java-microservice/configure-java-microservice-interactive/) 
