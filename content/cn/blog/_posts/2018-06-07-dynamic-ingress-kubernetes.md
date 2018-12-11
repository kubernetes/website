---

title: 'Kubernetes内的动态Ingress  '

cn-approvers:

- congfairy

layout: blog

title: Dynamic Ingress in Kubernetes

date:  2018-06-07

---



<!--

Author: Richard Li (Datawire)

-->

 

作者: Richard Li (Datawire)

 

<!--

Kubernetes makes it easy to deploy applications that consist of many microservices, but one of the key challenges with this type of architecture is dynamically routing ingress traffic to each of these services.  One approach is Ambassador, a Kubernetes-native open source API Gateway built on the Envoy Proxy. Ambassador is designed for dynamic environment where services may come and go frequently.

 

Ambassador is configured using Kubernetes annotations. Annotations are used to configure specific mappings from a given Kubernetes service to a particular URL. A mapping can include a number of annotations for configuring a route. Examples include rate limiting, protocol, cross-origin request sharing, traffic shadowing, and routing rules.

-->

 

Kubernetes可以轻松部署由许多微服务组成的应用程序，但这种架构的关键挑战之一是动态地将流量路由到这些服务中的每一个。 一种方法是[Ambassador]（https://www.getambassador.io ），这是一个基于[Envoy Proxy]（https://www.envoyproxy.io ）构建的Kubernetes本地开源API网关。Ambassador专为动态环境而设计，服务可能频繁出入访问。

 

Ambassador使用Kubernetes注释进行配置。 注释用于配置从给定Kubernetes服务到特定URL的特定映射。 映射可以包括用于配置路由的多个注释。 示例包括速率限制，协议，跨源请求共享，流量映射和路由规则。

 

<!--

## A Basic Ambassador Example

 

Ambassador is typically installed as a Kubernetes deployment, and is also available as a Helm chart. To configure Ambassador, create a Kubernetes service with the Ambassador annotations. Here is an example that configures Ambassador to route requests to /httpbin/ to the public httpbin.org service:

-->

##基本的Ambassador例子

 

Ambassador通常作为Kubernetes部署安装，也可以作为Helm图表使用。 要配置Ambassador，请使用Ambassador注释创建Kubernetes服务。 这是一个配置Ambassador，将请求路由到/ httpbin /公共httpbin.org服务的示例：

 

```

apiVersion: v1

kind: Service

metadata:

  name: httpbin

  annotations:

    getambassador.io/config: |

      ---

      apiVersion: ambassador/v0

      kind:  Mapping

      name:  httpbin_mapping

      prefix: /httpbin/

      service: httpbin.org:80

      host_rewrite: httpbin.org

spec:

  type: ClusterIP

  ports:

    - port: 80

```

<!--

A mapping object is created with a prefix of /httpbin/ and a service name of httpbin.org. The host_rewrite annotation specifies that the HTTP host header should be set to httpbin.org.

 

## Kubeflow

 

Kubeflow provides a simple way to easily deploy machine learning infrastructure on Kubernetes. The Kubeflow team needed a proxy that provided a central point of authentication and routing to the wide range of services used in Kubeflow, many of which are ephemeral in nature.

 



<center><i>Kubeflow architecture, pre-Ambassador</center></i>

-->

 

创建映射对象，前缀为/ httpbin /，服务名称为httpbin.org。 host_rewrite注释指定HTTPhost头应设置为httpbin.org。

 

## Kubeflow

 

[Kubeflow]（https://github.com/kubeflow/kubeflow）提供了一种在Kubernetes上轻松部署机器学习基础架构的简单方法。 Kubeflow团队需要一个代理，为Kubeflow中使用的各种服务提供认证和路由的中心点，其中许多服务本质上都是短暂的。

 



<center><i>Kubeflow architecture, pre-Ambassador</center></i>

 

<!--

## Service configuration

 

With Ambassador, Kubeflow can use a distributed model for configuration. Instead of a central configuration file, Ambassador allows each service to configure its route in Ambassador via Kubernetes annotations. Here is a simplified example configuration:

-->

 

##服务配置

 

使用Ambassador，Kubeflow可以使用分布式模型进行配置。 Ambassador不是使用中央配置文件，而是允许每个服务通过Kubernetes注释在Ambassador中配置其路由。 这是一个简化的示例配置：

 

```

---

apiVersion: ambassador/v0

kind:  Mapping

name: tfserving-mapping-test-post

prefix: /models/test/

rewrite: /model/test/:predict

method: POST

service: test.kubeflow:8000

```

<!--

In this example, the “test” service uses Ambassador annotations to dynamically configure a route to the service, triggered only when the HTTP method is a POST, and the annotation also specifies a rewrite rule.

 

## Kubeflow and Ambassador

-->

 

在此示例中，“test”服务使用Ambassador注释来动态配置到服务的路由，仅在HTTP方法是POST时触发，并且注释还指定重写规则。

 

## Kubeflow和Ambassador

 



 

<!--

With Ambassador, Kubeflow manages routing easily with Kubernetes annotations. Kubeflow configures a single ingress object that directs traffic to Ambassador, then creates services with Ambassador annotations as needed to direct traffic  to specific backends. For example, when deploying TensorFlow services,  Kubeflow creates and and annotates a K8s service so that the model will be served at https://<ingress host>/models/<model name>/. Kubeflow can also use the Envoy Proxy to do the actual L7 routing. Using Ambassador, Kubeflow takes advantage of additional routing configuration like URL rewriting and method-based routing.

 

If you’re interested in using Ambassador with Kubeflow, the standard Kubeflow install automatically installs and configures Ambassador.

 

If you’re interested in using Ambassador as an API Gateway or Kubernetes ingress solution for your non-Kubeflow services, check out the Getting Started with Ambassador guide.

-->

 

通过Ambassador，Kubeflow可以使用Kubernetes注释轻松管理路由。 Kubeflow配置单个入口对象，将流量定向到Ambassador，然后根据需要创建具有Ambassador注释的服务，以将流量定向到特定后端。例如，在部署TensorFlow服务时，Kubeflow会创建并注释K8s服务，以便在https：// <ingress host> / models / <model name> /中建立模型。 Kubeflow还可以使用Envoy Proxy来进行实际的L7路由。Ambassador，Kubeflow利用了URL重写和基于方法的路由等额外的路由配置。

 

如果您对使用Kubeflow Ambassador感兴趣，标准的Kubeflow安装会自动安装和配置Ambassador。

 

如果您有兴趣将Ambassador用作API网关或Kubernetes入口解决方案，请查看[Ambassador入门指南]（https://www.getambassador.io/user-guide/getting--启动 ）。

 
