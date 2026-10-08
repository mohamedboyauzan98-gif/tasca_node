const http = require("http");

// Creamos el servidor
const servidor = http.createServer(function(req, res) {

    // TAREA 1: DATA

    if (req.method === "GET" && req.url === "/data") {

        const ahora = new Date();

        // Obtenemos la fecha y hora
        const data = ahora.toLocaleDateString("sv-SE");
        const hora = ahora.toLocaleTimeString("es-ES");

        // Obtenemos el timestamp
        const timeestamp = ahora.getTime();

        // Dias de la semana
        const dies = [
            "diumenge",
            "dilluns",
            "dimarts",
            "dimecres",
            "dijous",
            "divendres",
            "dissabte"
        ];

        const diaSetmana = dies[ahora.getDay()];

        const resposta = {
            data: data,
            hora: hora,
            timestamp: timeestamp,
            dia_setmana: diaSetmana
        };

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(resposta));

        return;
    }


    // TAREA 2: CREAR USUARI

    if (req.method === "POST" && req.url === "/usuari") {

        // Guardamos los datos que llegan
        let body = "";

        req.on("data", function(trozo) {
            body += trozo;
        });

        req.on("end", function() {

            let usuari;

            // Convertimos los datos a JSON
            try {
                usuari = JSON.parse(body);
            } catch (error) {

                res.writeHead(400, {"Content-Type": "application/json"});

                res.end(JSON.stringify({
                    error: "Dades invàlides",
                    data: ["El JSON no és correcte"]
                }));

                return;
            }

            const nom = usuari.nom;
            const email = usuari.email;

            const errors = [];

            // Comprobamos el nombre
            if (typeof nom !== "string" || nom.length < 2 || nom.length > 50) {
                errors.push("El nom ha de tenir entre 2 i 50 caràcters");
            }

            if (typeof nom === "string" && !/^[A-Za-z ]+$/.test(nom)) {
                errors.push("El nom només pot contenir lletres i espais");
            }

            // Comprobamos el email
            if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errors.push("L'email no és vàlid");
            }

            // Si hay errores
            if (errors.length > 0) {

                res.writeHead(400, {"Content-Type": "application/json"});

                res.end(JSON.stringify({
                    error: "Dades invàlides",
                    data: errors
                }));

                return;
            }

            // Usuario creado correctamente
            const resposta = {
                missatge: "Usuari creat correctament",
                usuari: {
                    nom: nom,
                    email: email,
                    id: Date.now(),
                    creatEl: new Date().toISOString()
                }
            };

            res.writeHead(201, {"Content-Type": "application/json"});
            res.end(JSON.stringify(resposta));

        });

        return;
    }


    // TAREA 3: INFORMACIÓN DEL SERVIDOR

    if (req.method === "GET" && req.url === "/api/info") {

        const memoria = process.memoryUsage();

        const resposta = {
            node_version: process.version,
            plataforma: process.platform,
            memoria: memoria,
            uptime: process.uptime()
        };

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(resposta));

        return;
    }


    // TAREA 4: CALCULADORA

    if (req.method === "GET" && req.url.startsWith("/api/calculadora/")) {

        const partes = req.url.split("/");

        const num1 = Number(partes[4]);
        const num2 = Number(partes[5]);

        const operacio = partes[3];

        let resultat;

        if (operacio == "suma") {
            resultat = num1 + num2;
        }
        else if (operacio == "resta") {
            resultat = num1 - num2;
        }
        else if (operacio == "multiplicacio") {
            resultat = num1 * num2;
        }
        else if (operacio == "divisio") {

            // No podemos dividir entre 0
            if (num2 == 0) {

                res.writeHead(400, {"Content-Type": "application/json"});

                res.end(JSON.stringify({
                    error: "No es pot dividir entre zero"
                }));

                return;
            }

            resultat = num1 / num2;
        }
        else {

            res.writeHead(400, {"Content-Type": "application/json"});

            res.end(JSON.stringify({
                error: "Operacio incorrecta"
            }));

            return;
        }

        // Enviamos el resultado
        res.writeHead(200, {"Content-Type": "application/json"});

        res.end(JSON.stringify({
            operacio: operacio,
            num1: num1,
            num2: num2,
            resultat: resultat
        }));

        return;
    }


    // Mostramos por consola el método y la URL
    console.log(req.method);
    console.log(req.url);

    // Respuesta para las demás rutas
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Hola, servidor");

});


// Ponemos el servidor a escuchar en el puerto 3000
servidor.listen(3000, function() {
    console.log("Brotherrrr, your server is runing in http://localhost:3000");
});
