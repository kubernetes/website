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
