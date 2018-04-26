---
title: Annotations
---

{% capture overview %}
<!--You can use Kubernetes annotations to attach arbitrary non-identifying metadata
to objects. Clients such as tools and libraries can retrieve this metadata.-->
Annotations可以用于为Kubernetes资源对象关联任意的非标识性元数据。使用客户端（如工具和库）可以检索到这些元数据。
{% endcapture %}

{% capture body %}
<!--## Attaching metadata to objects-->
##关联元数据到对象

<!--You can use either labels or annotations to attach metadata to Kubernetes
objects. Labels can be used to select objects and to find
collections of objects that satisfy certain conditions. In contrast, annotations
are not used to identify and select objects. The metadata
in an annotation can be small or large, structured or unstructured, and can
include characters not permitted by labels.-->
Labels和Annotations都可以将元数据关联到Kubernetes资源对象。Labels主要用于选择对象，可以挑选出满足特定条件的对象。相比之下，annotations不能用于标识及选择对象。annotation中的元数据可多可少，可以是结构化的或非结构化的，也可以包含labels中不允许出现的字符。


<!--Annotations, like labels, are key/value maps:-->
annotations和labels一样都是key/value键值对映射结构：

    "annotations": {
      "key1" : "value1",
      "key2" : "value2"
    }

<!--Here are some examples of information that could be recorded in annotations:-->
以下列出了一些可以记录在annotations中的对象信息：
<!--* Fields managed by a declarative configuration layer. Attaching these fields
  as annotations distinguishes them from default values set by clients or
  servers, and from auto-generated fields and fields set by
  auto-sizing or auto-scaling systems.-->
  * 声明配置层管理的字段。使用annotations关联这类字段可以用于区分以下几种配置来源
    1.客户端或服务器设置的默认值
    2.自动生成的字段
    3.自动弹性伸缩系统配置配置的字段

<!--* Build, release, or image information like timestamps, release IDs, git branch,
  PR numbers, image hashes, and registry address.-->
  * 创建信息、版本信息或镜像信息。例如时间戳、版本号、git分支、PR序号、镜像哈希值以及仓库地址。

<!--* Pointers to logging, monitoring, analytics, or audit repositories.-->
*记录日志、监控、分析或审计存储仓库的指针。

<!--* Client library or tool information that can be used for debugging purposes:
  for example, name, version, and build information.-->
  * 可以用于debug的客户端（库或工具）信息，例如名称、版本和创建信息。

<!--* User or tool/system provenance information, such as URLs of related objects
  from other ecosystem components.-->
  * 用户信息，以及工具或系统来源信息、例如来自非Kubernetes生态的相关对象的URL信息。
  

<!--* Lightweight rollout tool metadata: for example, config or checkpoints.-->
* 轻量级部署工具元数据，例如配置或检查点。
<!--* Phone or pager numbers of persons responsible, or directory entries that
  specify where that information can be found, such as a team web site.-->
  * 负责人的电话或联系方式，或能找到相关信息的目录条目信息，例如团队网站。

<!--Instead of using annotations, you could store this type of information in an
external database or directory, but that would make it much harder to produce
shared client libraries and tools for deployment, management, introspection,
and the like.-->
如果不使用annotations，使用者也可以将以上类型的信息存放在外部数据库或目录中，但这样做不利于创建用于部署、管理、内部检查的共享客户端库和工具。

{% endcapture %}

{% capture whatsnext %}
<!--Learn more about [Labels and Selectors](/docs/user-guide/labels/).-->
了解更多关于[Labels and Selectors](/docs/user-guide/labels/).
{% endcapture %}

{% include templates/concept.md %}
