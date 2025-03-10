# Copyright 2025 The Kubernetes Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# This file related to the article "DevSecOps in Action: Kubernetes Secrets"
# https://kubernetes.io/blog/2025/01/15/devsecops-in-action-k8s-secrets/

FROM golang:1.21-alpine AS build

WORKDIR /src

COPY go.* .

RUN go mod tidy

COPY cmd cmd

RUN go build -o /app cmd/main.go

FROM alpine:3.19

COPY --from=build /app /

# RUN apk add --no-cache curl

ENTRYPOINT ["/app"]
