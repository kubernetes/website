DOCKER       = docker
HUGO_VERSION = 0.53
DOCKER_IMAGE = kubernetes-hugo
DOCKER_RUN   = $(DOCKER) run --rm --interactive --tty --volume $(CURDIR):/src
NODE_BIN     = node_modules/.bin
NETLIFY_FUNC = $(NODE_BIN)/netlify-lambda

.PHONY: all build build-preview help serve

help: ## Show this help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

all: build ## Build site with production settings and put deliverables in ./public

build: ## Build site with production settings and put deliverables in ./public
	hugo --minify

build-preview: ## Build site with drafts and future posts enabled
	hugo --buildDrafts --buildFuture

functions-build:
	$(NETLIFY_FUNC) build functions-src

check-headers-file:
	scripts/check-headers-file.sh

production-build: check-hugo-versions build check-headers-file ## Build the production site and ensure that noindex headers aren't added

non-production-build: check-hugo-versions ## Build the non-production site, which adds noindex headers to prevent indexing
	hugo --enableGitInfo

serve: ## Boot the development server.
	hugo server --buildFuture

docker-image:
	$(DOCKER) build . --tag $(DOCKER_IMAGE) --build-arg HUGO_VERSION=$(HUGO_VERSION)

docker-build:
	$(DOCKER_RUN) $(DOCKER_IMAGE) hugo

docker-serve:
	$(DOCKER_RUN) -p 1313:1313 $(DOCKER_IMAGE) hugo server --buildFuture --bind 0.0.0.0

test-examples:
	scripts/test_examples.sh install
	scripts/test_examples.sh run

check-hugo-versions:
	scripts/hugo-version-check.sh $(HUGO_VERSION)
