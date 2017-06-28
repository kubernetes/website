.PHONY: all build build-preview generate-redirects help serve

help: ## Show this help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

all: build ## Build site with production settings and put deliverables in _site.

build: ## Build site with production settings and put deliverables in _site.
	jekyll build

build-preview: ## Build site with drafts and future posts enabled.
	jekyll build --drafts --future

generate-redirects: ## Generate a redirects file and copy it into the _site directory.
	mkdir -p _site && REDIRECTS_PATH=_site/_redirects ruby redirects.rb

serve: ## Boot the development server.
	jekyll serve
