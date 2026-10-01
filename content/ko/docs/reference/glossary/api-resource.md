---
title: API 리소스 (원문, API resource)
id: api-resource
full_link: /docs/reference/using-api/api-concepts/#standard-api-terminology
short_description: >
  쿠버네티스 API 서버의 엔드포인트를 나타내는 쿠버네티스 엔티티.

aka:
 - Resource
tags:
- architecture
---
쿠버네티스 타입 시스템에서 엔티티는 {{< glossary_tooltip text="쿠버네티스 API" term_id="kubernetes-api" >}}의 엔드포인트에 해당한다.
리소스는 일반적으로 {{< glossary_tooltip text="오브젝트" term_id="object" >}}를 나타낸다.
일부 리소스는 권한 확인과 같이 다른 오브젝트에 대한 작업을 나타낸다.
<!--more-->
각 리소스는 쿠버네티스 API 서버의 HTTP 엔드포인트(URI)를 나타내며, 해당 리소스에 대한 오브젝트 또는 작업의 스키마를 정의한다.
