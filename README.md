# PatchMe

> GUI for services like https://patchbay.pub/

Live demo: https://patchme.link/

## Contributing

If https://patchbay.pub/ is down, you can run your own local patchbay server to develop against. https://github.com/patchbay-pub/patchbay-simple-server

- Install golang https://golang.org/dl/
- `git clone https://github.com/patchbay-pub/patchbay-simple-server.git`
- `cd patchbay-simple-server`
- `go run main.go`

You may want to allow CORS:

```golang
// Put this in the first handler, maybe right before `if r.Method == "GET" {`
enableCors(&w)

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}
```

See [Nuxt.js docs](https://nuxtjs.org).

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

## TODO

- Constants file https://github.com/gothinkster/vue-realworld-example-app/blob/master/src/store/actions.type.js
- Persist the URL and LinkCode on reload
- Maybe ditch the publisher entirely and allow adding a payload/POST toggle?