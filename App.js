

  var texto = document.getElementById('texto').value;
  var textoFinal = document.getElementById('textoFinal').value;
  var A = document.getElementById('A').value;
  var B = document.getElementById('B').value;
  const alfabeto = {
    'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
    'K': 10, 'L': 11, 'M': 12, 'N': 13, 'Ñ': 14, 'O': 15, 'P': 16, 'Q': 17, 'R': 18,
    'S': 19, 'T': 20, 'U': 21, 'V': 22, 'W': 23, 'X': 24, 'Y': 25, 'Z': 26
  };
  
function euclideanAlgorithm(a, b) {
    // Calcula el MCD de a y b utilizando el algoritmo de Euclides
    while (b !== 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
  
function areCoprime(a, b) {
    // Comprueba si a y b son coprimos (es decir, si su MCD es igual a 1)
    return euclideanAlgorithm(a, b) === 1;
  }

function obtenerFrecuencia () {
    texto = document.getElementById("texto").value;
    const frecuencia = {};
    
    for (let i = 0; i < texto.length; i++) {
      const letra = texto[i];
      if (letra !== ' '){ // verificamos si la letra no es un espacio en blanco
        if (frecuencia[letra]) {
          frecuencia[letra]++;
        } else {
          frecuencia[letra] = 1;
        }
      }
    }
  
  
     return frecuencia; 
  
    };
  
  
const modInverse = (a, m) => {
    for (let x = 1; x < m; x++) {
      if (((a % m) * (x % m)) % m === 1) {
        return x;
      }
    }
    return 1;
  };
  
const resolverSistemaEcuaciones = (letra1, letra2, alfabeto) => {
    const x1 = alfabeto[letra1];
    const x2 = alfabeto[letra2];
    const x3 = alfabeto['E'];
    const x4 = alfabeto['A'];

    const b = x2;
    const a = (x1-b) * modInverse(x3,27) % 27; 
    // console.log(x1,b,x3,modInverse(x3))
    return [a, b];
  };

const resolverSistemaEcuaciones2 = (letra1, letra2, alfabeto) => {
    const x1 = alfabeto[letra1];
    const x2 = alfabeto[letra2];
    const x3 = alfabeto['E'];
    const x4 = alfabeto['A'];

    const b = x1;
    const a = (x2-b) * modInverse(x3,27) % 27; 
    // console.log(x1,b,x3,modInverse(x3))
    return [a, b];
  };
  
function generarTextoFinal(a,b,texto,modulo){
  let textoFinal = '';
  //console.log(a,b)
  for (let i = 0; i < texto.length; i++) {
    const letra = texto[i];
    const x = alfabeto[letra];

    if (letra !== ' ') {
      
      const aux = ( (x-b)* modInverse(a,modulo) % modulo )
      
      if ( aux < 0 ) {

        const letraDescifrada = Object.keys(alfabeto).find(key => alfabeto[key] === (aux+27));
        textoFinal += letraDescifrada;
       
      }else{

        const letraDescifrada = Object.keys(alfabeto).find(key => alfabeto[key] === aux);
        textoFinal += letraDescifrada;
        
      }
      
    }
  }

  return textoFinal;
}
function descifrar (result) {

    texto = document.getElementById('texto').value;
    console.log(texto)
    const frecuencia = obtenerFrecuencia(texto);
    let letraMayorFrecuencia1 = '';
    let mayorFrecuencia1 = 0;
    let letraMayorFrecuencia2 = '';
    let mayorFrecuencia2 = 0;

     
    for (const letra in frecuencia) {
      if (frecuencia[letra] > mayorFrecuencia1) {
        letraMayorFrecuencia2 = letraMayorFrecuencia1;
        mayorFrecuencia2 = mayorFrecuencia1;
        letraMayorFrecuencia1 = letra;
        mayorFrecuencia1 = frecuencia[letra];
      } else if (frecuencia[letra] > mayorFrecuencia2) {
        letraMayorFrecuencia2 = letra;
        mayorFrecuencia2 = frecuencia[letra];
      }
    } 

    if (result == 1){
      const [a, b] = resolverSistemaEcuaciones(letraMayorFrecuencia1,letraMayorFrecuencia2,alfabeto)
      const modulo = Object.keys(alfabeto).length;
      const textoFinal = generarTextoFinal(a,b,texto,modulo);
      document.getElementById('textoFinal').value = textoFinal;
      document.getElementById('A1').value = a;
      document.getElementById('B1').value = b;
    } else {
      const [a, b] = resolverSistemaEcuaciones2(letraMayorFrecuencia1,letraMayorFrecuencia2,alfabeto)
      const modulo = Object.keys(alfabeto).length;
      const textoFinal = generarTextoFinal(a,b,texto,modulo);
      document.getElementById('textoFinal').value = textoFinal;
      document.getElementById('A1').value = a;
      document.getElementById('B1').value = b;
    }
    
   
  }

  
function reemplazarLetrasConTilde(texto) {
    const tablaReemplazo = {
      'á': 'a',
      'é': 'e',
      'í': 'i',
      'ó': 'o',
      'ú': 'u',
      'Á': 'A',
      'É': 'E',
      'Í': 'I',
      'Ó': 'O',
      'Ú': 'U'
    };
  
    return texto.replace(/[áéíóúÁÉÍÓÚ]/g, letraConTilde => tablaReemplazo[letraConTilde]);
  }

function cifrar(){
    
    A = document.getElementById('A').value;
    B = document.getElementById('B').value;

    
    texto = document.getElementById('texto').value;
    texto = reemplazarLetrasConTilde(texto);
    texto = texto.replace(/\s/g, ""); // Remove spaces
    texto = texto.replace(/[^\w\sñ]/g, '').toUpperCase().replace(/\d+/g, '');
    document.getElementById('texto').value = texto;
    texto = document.getElementById('texto').value;
    console.log(A,B)
    if(A == "" || B == ""){
      console.log("0651")
      document.getElementById('textoFinal').value = "Necesitamos los valores de A y B";
      
    }else{
      A = parseInt(A);
      B = parseInt(B);
      console.log("cfesd")
      if (areCoprime(A,27)) {
        let textoCifrado = '';
        for (let i = 0; i < texto.length; i++) {
          const letra = texto[i];
          if (letra !== ' ') {
            const x1 = alfabeto[letra];
            const c = ((A * x1)+ B) % 27;
            console.log('A=',A,'x',x1,'B',B);
            console.log(c)
            const letraCifrada = Object.keys(alfabeto).find(key => alfabeto[key] === c);      
            textoCifrado += letraCifrada;
          } 
        }
       
        document.getElementById('textoFinal').value = textoCifrado;
      } else {
        document.getElementById('textoFinal').value = "No son coprimos";
      }

    }
    document.getElementById('texto').value = '';
    document.getElementById('A1').value = document.getElementById('A').value;
    document.getElementById('B1').value = document.getElementById('B').value;
    document.getElementById('A').value = '';
    document.getElementById('B').value = '';
}

  function grafica() {
    const texto = document.getElementById("texto").value;
    const frecuencias = obtenerFrecuencia(texto);
    
    // Convertir objeto en array de objetos
    const frecuenciasArray = Object.entries(frecuencias).map(([letra, frecuencia]) => ({ letra, frecuencia }));
    
    // Ordenar por frecuencia descendente
    frecuenciasArray.sort((a, b) => b.frecuencia - a.frecuencia);
    
    const tabla = document.getElementById("tabla-frecuencia");
    tabla.innerHTML = "";
    for (const { letra, frecuencia } of frecuenciasArray) {
        const tr = document.createElement("tr");
        const tdLetra = document.createElement("td");
        tdLetra.textContent = letra;
        const tdFrecuencia = document.createElement("td");
        tdFrecuencia.textContent = frecuencia;
        tr.appendChild(tdLetra);
        tr.appendChild(tdFrecuencia);
        tabla.appendChild(tr);
    }
    tabla = document.getElementById('tabla');
    tabla.style.display = 'table';
  }
  
  
  
  