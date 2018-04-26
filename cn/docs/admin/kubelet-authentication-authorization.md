---
assignees:
- liggitt
title: Kubelet 认证/授权
cn-approvers:
- rootsongjc
cn-reviewers:
- rootsongjc
---

* TOC
{:toc}

<!--
## Overview

A kubelet's HTTPS endpoint exposes APIs which give access to data of varying sensitivity,
and allow you to perform operations with varying levels of power on the node and within containers.

This document describes how to authenticate and authorize access to the kubelet's HTTPS endpoint.

-->

## 概览

Kubelet 的 HTTPS 端点对外暴露了用于访问不同敏感程度数据的 API，并允许您在节点或者容器内执行不同权限级别的操作。

本文档向您描述如何通过认证授权来访问 kubelet 的 HTTPS 端点。

<!--

## Kubelet authentication

By default, requests to the kubelet's HTTPS endpoint that are not rejected by other configured authentication methods are treated as anonymous requests, and given a username of `system:anonymous` and a group of `system:unauthenticated`.

To disable anonymous access and send `401 Unauthorized` responses to unauthenticated requests:

* start the kubelet with the `--anonymous-auth=false` flag

To enable X509 client certificate authentication to the kubelet's HTTPS endpoint:

* start the kubelet with the `--client-ca-file` flag, providing a CA bundle to verify client certificates with
* start the apiserver with `--kubelet-client-certificate` and `--kubelet-client-key` flags
* see the [apiserver authentication documentation](/docs/admin/authentication/#x509-client-certs) for more details

To enable API bearer tokens (including service account tokens) to be used to authenticate to the kubelet's HTTPS endpoint:

* ensure the `authentication.k8s.io/v1beta1` API group is enabled in the API server
* start the kubelet with the `--authentication-token-webhook`, `--kubeconfig`, and `--require-kubeconfig` flags
* the kubelet calls the `TokenReview` API on the configured API server to determine user information from bearer tokens

-->

## Kubelet 认证

默认情况下，所有未被配置的其他身份验证方法拒绝的，对 kubelet 的 HTTPS 端点的请求将被视为匿名请求，并被授予 `system:anonymous` 用户名和 `system:unauthenticated` 组。

如果要禁用匿名访问并发送 `401 Unauthorized` 的未经身份验证的请求的响应：

- 启动 kubelet 时指定 `--anonymous-auth=false` 标志

如果要对 kubelet 的 HTTPS 端点启用 X509 客户端证书身份验证：

- 启动 kubelet 时指定 `--client-ca-file` 标志，提供 CA bundle 以验证客户端证书
- 启动 apiserver 时指定  `--kubelet-client-certificate` 和 `--kubelet-client-key`  标志
- 参阅 [apiserver 认证文档](/docs/admin/authentication/#x509-client-certs) 获取更多详细信息。

启用 API bearer token（包括 service account token）用于向 kubelet 的 HTTPS 端点进行身份验证：

- 确保在 API server 中开启了 `authentication.k8s.io/v1beta1` API 组。
- 启动 kubelet 时指定  `--authentication-token-webhook`， `--kubeconfig` 和  `--require-kubeconfig` 标志
- Kubelet 在配置的 API server 上调用 `TokenReview` API 以确定来自 bearer token 的用户信息

<!--

## Kubelet authorization

Any request that is successfully authenticated (including an anonymous request) is then authorized. The default authorization mode is `AlwaysAllow`, which allows all requests.

There are many possible reasons to subdivide access to the kubelet API:

* anonymous auth is enabled, but anonymous users' ability to call the kubelet API should be limited
* bearer token auth is enabled, but arbitrary API users' (like service accounts) ability to call the kubelet API should be limited
* client certificate auth is enabled, but only some of the client certificates signed by the configured CA should be allowed to use the kubelet API

To subdivide access to the kubelet API, delegate authorization to the API server:

* ensure the `authorization.k8s.io/v1beta1` API group is enabled in the API server
* start the kubelet with the `--authorization-mode=Webhook`, `--kubeconfig`, and `--require-kubeconfig` flags
* the kubelet calls the `SubjectAccessReview` API on the configured API server to determine whether each request is authorized

The kubelet authorizes API requests using the same [request attributes](/docs/admin/authorization/#request-attributes) approach as the apiserver.

The verb is determined from the incoming request's HTTP verb:

-->

## Kubelet 授权

接着对任何成功验证的请求（包括匿名请求）授权。默认授权模式为 `AlwaysAllow`，允许所有请求。

细分访问 kubelet API 有很多原因：

- 启用匿名认证，但匿名用户调用 kubelet API 的能力应受到限制
- 启动 bearer token 认证，但是 API 用户（如 service account）调用 kubelet API 的能力应受到限制
- 客户端证书身份验证已启用，但只有那些配置了 CA 签名的客户端证书的用户才可以使用 kubelet API

如果要细分访问 kubelet API，将授权委托给 API server：

- 确保 API server 中启用了 `authorization.k8s.io/v1beta1` API 组
- 启动 kubelet 时指定 `--authorization-mode=Webhook`、 `--kubeconfig` 和  `--require-kubeconfig`  标志
- kubelet 在配置的 API server 上调用 `SubjectAccessReview` API，以确定每个请求是否被授权

kubelet 使用与 apiserver 相同的 [请求属性](/docs/admin/authorization/#request-attributes) 方法来授权 API 请求。

Verb（动词）是根据传入的请求的 HTTP 动词确定的：

| HTTP 动词   | request 动词 |
| --------- | ---------- |
| POST      | create     |
| GET, HEAD | get        |
| PUT       | update     |
| PATCH     | patch      |
| DELETE    | delete     |

<!--

The resource and subresource is determined from the incoming request's path:

-->

资源和子资源根据传入请求的路径确定：

| Kubelet API  | 资源    | 子资源     |
| ------------ | ----- | ------- |
| /stats/\*    | nodes | stats   |
| /metrics/\*  | nodes | metrics |
| /logs/\*     | nodes | log     |
| /spec/\*     | nodes | spec    |
| *all others* | nodes | proxy   |

<!--

The namespace and API group attributes are always an empty string, and
the resource name is always the name of the kubelet's `Node` API object.

When running in this mode, ensure the user identified by the `--kubelet-client-certificate` and `--kubelet-client-key`
flags passed to the apiserver is authorized for the following attributes:

-->

Namespace 和 API 组属性总是空字符串，资源的名字总是 kubelet 的 `Node` API 对象的名字。

当以该模式运行时，请确保用户为 apiserver 指定了 `--kubelet-client-certificate` 和 `--kubelet-client-key` 标志并授权了如下属性：

* verb=\*, resource=nodes, subresource=proxy
* verb=\*, resource=nodes, subresource=stats
* verb=\*, resource=nodes, subresource=log
* verb=\*, resource=nodes, subresource=spec
* verb=\*, resource=nodes, subresource=metrics

