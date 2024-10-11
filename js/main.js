window.addEventListener("load",()=>{
    const adivinar = document.getElementById("palabraAdivinar");
    const inputUsuario = document.getElementById("inputUsuario");
    const comprobar = document.getElementById("comprobar");
    const error = document.getElementById("error");
    const registro = document.getElementById("registro");
    const monigote = document.querySelectorAll("#monigote");
    const recargaJuego = document.getElementById("recarga");

    // Inicializacion variables y tablero
    let palabraClave = "";
    let intentosFallidos = 0;
    let registroFallos = [];
    inicializa();

    inputUsuario.addEventListener("keyup",()=>{
        // Hay que capar por codigo tambien que se escriba mas de una letra
        if(inputUsuario.value.length > 1){
            inputUsuario.value = inputUsuario.value[0];
        }
    });

    comprobar.addEventListener("click",()=>{
        comprobarPalabra()        
    })

    recargaJuego.addEventListener("click",()=>{
        recargar()     
    })

    // Gestiona los intentos y comprueba si la letra esta o no 
    function comprobarPalabra(){
        if(palabraClave.includes(inputUsuario.value)){
            actualizaPalabra();
        }else{
            if(registroFallos.includes(inputUsuario.value)){
                error.innerText = "LETRA REPETIDA";
                setTimeout(()=>{
                    error.innerText = "";
                },2000);
            }else{
                monigote[intentosFallidos].style.display = "block";
                intentosFallidos++;
                registroFallos.push(inputUsuario.value)
                refrescarFallos();
            }
        }

        if(intentosFallidos > 6){
            error.innerText = "HAS PERDIDO, LA PALABRA ERA " + palabraClave.toUpperCase();
            recargar();         
        }

        if(adivinar.innerText == palabraClave){
            error.innerText = "HAS GANADO";
            recargar();
        }
        // Limpia el input tras cada intento
        inputUsuario.value = "";
    }

    // Actualiza la lista de letras fallidas en la pantalla y el dibujo
    function refrescarFallos(){
        registro.innerText = "LETRAS FALLIDAS:"
        registroFallos.forEach(fallo => {
            registro.innerText += " " + fallo;
        });
    }

    // Recarga pantalla
    function recargar(){        
        setTimeout(()=>{
            window.location.reload();
        },3000);
        registro.innerText = "";
    }

    // Actualiza la palabra
    function actualizaPalabra(){
        const letra = inputUsuario.value;
        // Variable auxiliar donde almacenar lo que habia hasta ahora
        const copia = adivinar.innerText;
        adivinar.innerText = "";
        for (let i = 0; i < palabraClave.length; i++) {
            if(copia[i] == "_" & letra == palabraClave[i]){
                adivinar.innerText += letra;
            }else{
                adivinar.innerText += copia[i];
            }
        }
    }

    // Pone tantas barra baja como letras tenga la palabra a adivinar
    function formatearPalabra(){
        adivinar.innerText = "";
        for (let i = 0; i < palabraClave.length; i++) {
            adivinar.innerText += "_";
        }
    }

    // Genera una nueva palabra a resolver y pinta los huecos
    async function inicializa(){
        await inicializaPalabra();
        formatearPalabra();
        // Para poder testear
        console.log(palabraClave);
    }

    // Obtiene una palabra aleatoria
    async function inicializaPalabra(){
        await fetch("https://random-word-api.herokuapp.com/word")
            .then((data)=>data.json())
            .then((palabra)=>{
                palabraClave = palabra[0];
            })
            .catch((e)=>{
                console.log(e);
            })
    }   
});