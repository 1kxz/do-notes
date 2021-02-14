
build:
	npm run-script build

watch:
	npm run-script build:watch

lint:
	npm run-script lint

gcloud:
	gcloud auth application-default login

login:
	firebase login

serve:
	firebase serve

serve-functions:
	firebase serve --only functions

emulators:
	firebase emulators:start

emulators-firestore:
	firebase emulators:start --only firestore

deploy:
	firebase deploy

deploy-functions:
	firebase deploy --only functions
