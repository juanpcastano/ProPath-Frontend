
export async function heartbeat() {
    let backendUrl;
    try {
        fetch("", { method: "GET" });
        backendUrl = "";
    } 
    catch (error) {
        console.error("No se pudo conectar al backend proporcionado por el .env, url del backen en local con puerto 3000")
        if (error) backendUrl = "http://localhost:3000";
    }

    return backendUrl;
}

