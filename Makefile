VERSION := $$(cat package.json | grep version | sed 's/"/ /g' | awk {'print $$3'})

PROD := env-prod.json
DEV := env-dev.json
ENV := $(DEV)

JWT_KEY := $$(cat $(ENV) | grep JWT_KEY | sed 's/"/ /g' | awk {'print $$3'})
GOOGLE_CLIENT_ID := $$(cat $(ENV) | grep GOOGLE_CLIENT_ID | sed 's/"/ /g' | awk {'print $$3'})
GOOGLE_CLIENT_SECRET := $$(cat $(ENV) | grep GOOGLE_CLIENT_SECRET | sed 's/"/ /g' | awk {'print $$3'})
PROJECT_ID := $$(cat $(ENV) | grep PROJECT_ID | sed 's/"/ /g' | awk {'print $$3'})

SVC=ioled-api
PORT=5000

version v:
	@echo $(VERSION)

init i:
	@echo "[Dependencies] Installing dependencies"
	@npm install

deploy-testing testing:
	@echo "[TESTING][App Engine Deployment] Deploying App in TESTING"
	@gcloud app deploy app-testing.yaml

deploy-dev dev:
	@echo "[DEV][App Engine Deployment] Deploying App in DEV"
	@gcloud app deploy app-dev.yaml

run r:
	@echo "[Running] Running service with $(ENV)"
	@PORT=$(PORT) GOOGLE_APPLICATION_CREDENTIALS="./google-cloud-service-account.json" JWT_KEY="$(JWT_KEY)" PROJECT_ID="$(PROJECT_ID)" GOOGLE_CLIENT_SECRET="$(GOOGLE_CLIENT_SECRET)" GOOGLE_CLIENT_ID="$(GOOGLE_CLIENT_ID)" node src/start.js

test t:
	@echo "[TEST] Testing"
	@PORT=$(PORT) GOOGLE_APPLICATION_CREDENTIALS="./google-cloud-service-account.json" JWT_KEY="$(JWT_KEY)" PROJECT_ID="$(PROJECT_ID)" GOOGLE_CLIENT_SECRET="$(GOOGLE_CLIENT_SECRET)" GOOGLE_CLIENT_ID="$(GOOGLE_CLIENT_ID)" npm test
	
.PHONY: version v init i deploy d run r