---
title: Kubelet 认证/授权
---
<!--
---
reviewers:
- liggitt
title: Kubelet authentication/authorization
---
-->
{{< toc >}}

<!--
## Overview
-->
## 概述

<!--
A kubelet's HTTPS endpoint exposes APIs which give access to data of varying sensitivity,
and allow you to perform operations with varying levels of power on the node and within containers.
-->
kubelet 的 HTTPS 端点公开了 API，可以访问不同敏感度的数据，
并允许您在节点和容器内执行不同权限级别的操作。

<!--
This document describes how to authenticate and authorize access to the kubelet's HTTPS endpoint.
-->
本文档介绍如何认证和授权访问 kubelet 的 HTTPS 端点。

<!--
## Kubelet authentication
-->
## Kubelet 认证

<!--
By default, requests to the kubelet's HTTPS endpoint that are not rejected by other configured
authentication methods are treated as anonymous requests, and given a username of `system:anonymous`
and a group of `system:unauthenticated`.
-->
默认情况下，未被其他已配置的身份验证方法拒绝的对 kubelet 的 HTTPS 端点的请求将被视为匿名请求，
并提供一个 `system：anonymous` 用户名和一个 `system：unauthenticated` 用户组。

<!--
To disable anonymous access and send `401 Unauthorized` responses to unauthenticated requests:
-->
禁用匿名访问并向未经身份验证的请求发送 `401 Unauthorized` 响应：

<!--
* start the kubelet with the `--anonymous-auth=false` flag
-->
* 附带 `--anonymous-auth=false` 参数启动 kubelet

<!--
To enable X509 client certificate authentication to the kubelet's HTTPS endpoint:
-->
要为 kubelet 的 HTTPS 端点启用 X509 客户端证书身份验证，请执行以下操作：

<!--
* start the kubelet with the `--client-ca-file` flag, providing a CA bundle to verify client certificates with
* start the apiserver with `--kubelet-client-certificate` and `--kubelet-client-key` flags
* see the [apiserver authentication documentation](/docs/reference/access-authn-authz/authentication/#x509-client-certs) for more details
-->
* 附带 `--client-ca-file` 参数启动 kubelet，提供 CA 包以验证客户端证书
* 附带 `--kubelet-client-certificate` 和 `--kubelet-client-key` 参数启动 apiserver
* 查看 [apiserver 认证文档](/docs/reference/access-authn-authz/authentication/#x509-client-certs)以获取更多细节

<!--
To enable API bearer tokens (including service account tokens) to be used to authenticate to the kubelet's HTTPS endpoint:
-->
启用 API bearer 令牌（包括服务帐户令牌）以用于对 kubelet 的 HTTPS 端点进行身份验证：

<!--
* ensure the `authentication.k8s.io/v1beta1` API group is enabled in the API server
* start the kubelet with the `--authentication-token-webhook` and `--kubeconfig` flags
* the kubelet calls the `TokenReview` API on the configured API server to determine user information from bearer tokens
-->
* 确保 API 服务器启用了 `authentication.k8s.io/v1beta1` API 组
* 附带 `--authentication-token-webhook` 和 `--kubeconfig` 参数启动 kubelet
* kubelet 在配置的 API 服务器上调用 `TokenReview` API，以确定来自 bearer 令牌的用户信息

<!--
## Kubelet authorization
-->
## Kubelet 授权

<!--
Any request that is successfully authenticated (including an anonymous request) is then authorized. The default authorization mode is `AlwaysAllow`, which allows all requests.
-->
任何成功经过身份验证的请求（包括匿名请求）都将得到授权。
默认授权模式是 `AlwaysAllow`，它允许所有请求。

<!--
There are many possible reasons to subdivide access to the kubelet API:
-->
有许多可能的原因来细分对 kubelet API 的访问：

<!--
* anonymous auth is enabled, but anonymous users' ability to call the kubelet API should be limited
* bearer token auth is enabled, but arbitrary API users' (like service accounts) ability to call the kubelet API should be limited
* client certificate auth is enabled, but only some of the client certificates signed by the configured CA should be allowed to use the kubelet API
-->
* 匿名身份验证被启用，但匿名用户调用 kubelet API 的能力应该受到限制
* bearer 令牌验证被启用，但应限制任意 API 用户（如服务帐户）调用 kubelet API 的能力
* 启用了客户端证书身份验证，但只允许由配置的 CA 签名的某些客户端证书使用 kubelet API

<!--
To subdivide access to the kubelet API, delegate authorization to the API server:
-->
要细分对 kubelet API 的访问权限，请将授权委派给 API 服务器：

<!--
* ensure the `authorization.k8s.io/v1beta1` API group is enabled in the API server
* start the kubelet with the `--authorization-mode=Webhook` and the `--kubeconfig` flags
* the kubelet calls the `SubjectAccessReview` API on the configured API server to determine whether each request is authorized
-->
* 确保 API 服务器启用了 `authorization.k8s.io/v1beta1` API 组
* 附带 `--authorization-mode=Webhook` 和 `--kubeconfig` 参数启动 kubelet
* kubelet 在配置的 API 服务器上调用 `SubjectAccessReview` API，以判断每个请求是否是被授权的

<!--
The kubelet authorizes API requests using the same [request attributes](/docs/reference/access-authn-authz/authorization/#review-your-request-attributes) approach as the apiserver.
-->
kubelet 使用与 apiserver 相同的[请求属性](/docs/reference/access-authn-authz/authorization/#review-your-request-attributes)方法为 API 请求授权。

<!--
The verb is determined from the incoming request's HTTP verb:
-->
动词（verb）是根据传入请求的 HTTP 动词（verb）确定的：

<!--
HTTP verb | request verb
----------|---------------
POST      | create
GET, HEAD | get
PUT       | update
PATCH     | patch
DELETE    | delete
-->
HTTP 动词 | 请求动词
----------|---------------
POST      | create
GET, HEAD | get
PUT       | update
PATCH     | patch
DELETE    | delete

<!--
The resource and subresource is determined from the incoming request's path:
-->
资源（resource）和子资源（subresource）由传入请求的路径确定：

<!--
Kubelet API  | resource | subresource
-------------|----------|------------
/stats/\*     | nodes    | stats
/metrics/\*   | nodes    | metrics
/logs/\*      | nodes    | log
/spec/\*      | nodes    | spec
*all others* | nodes    | proxy
-->
Kubelet API  | 资源 | 子资源
-------------|----------|------------
/stats/\*     | nodes    | stats
/metrics/\*   | nodes    | metrics
/logs/\*      | nodes    | log
/spec/\*      | nodes    | spec
*all others* | nodes    | proxy

<!--
The namespace and API group attributes are always an empty string, and
the resource name is always the name of the kubelet's `Node` API object.
-->
命名空间和 API 组属性始终为空字符串，资源名称始终是 kubelet 的 `Node` API 对象的名称。

<!--
When running in this mode, ensure the user identified by the `--kubelet-client-certificate` and `--kubelet-client-key`
flags passed to the apiserver is authorized for the following attributes:
-->
在此模式下运行时，请确保传递给 apiserver 的 `--kubelet-client-certificate` 和 `--kubelet-client-key` 参数所标识的用户有权使用以下属性：

* verb=\*, resource=nodes, subresource=proxy
* verb=\*, resource=nodes, subresource=stats
* verb=\*, resource=nodes, subresource=log
* verb=\*, resource=nodes, subresource=spec
* verb=\*, resource=nodes, subresource=metrics
