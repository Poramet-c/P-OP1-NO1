document.getElementById("eqInput").addEventListener('keyup', (e) => {
    if ( e.key == 'Enter')
        sunEquationToAnswer()
})
//--FOR HASHING AND FUN ----------------------------------------------------------------------------------------//
async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}
//-----------------------------------------------------------------------------------------------------------------------//

/*  THESE VALUES BASED ON THE VALUE OF THE RESISTORS OF A REAL WORLD BOARD  */
function toResistorsValue(numb){
    return [0, 100, 2500, 2600, 285.71, 95.24, 4333.33, 2333.33][numb]
}


function sunEquationToAnswer(){
    document.getElementById("eqInput").addEventListener('keyup', (e) => {
        if ( e.key == 'Enter')
            sunEquationToAnswer()
    })

    let equation = document.getElementById("eqInput").value
    //console.log(equation)

    let inputQueue = equation.split(/(\D)/)
    //outputQueue needs to be ready for compute right away. Also called postfix done.
    let outputQueue = []
    let computeStack = []
    //to test if the process is successfully done.
    let success = true

    for ( let i = 0 ; i < inputQueue.length ; i++ ){
        if ( inputQueue[i] == '(' || inputQueue[i] == '-' || inputQueue[i] == '/' )
            computeStack.push(inputQueue[i])
        else if ( inputQueue[i] == ')'){
            while ( computeStack[computeStack.length - 1] != '(' )
                outputQueue.push(computeStack.pop())

            //Remove the left parenthasis
            computeStack.pop()
        } else if ( !inputQueue[i].match(/\D/) )
            outputQueue.push(toResistorsValue(parseInt(inputQueue[i])))
        
    }

    //Empty the Stack
    while ( computeStack.length > 0 )
        outputQueue.push(computeStack.pop())

    //Compute The Postfix to an answer. This time we gonna reuse the ComputeStack again
    for ( let i = 0 ; i < outputQueue.length ; i++ ){
        if ( typeof(outputQueue[i]) == "number" )
            computeStack.push(outputQueue[i])
        else if ( outputQueue[i] == '-' ){
            let r2 = computeStack.pop()
            let r1 = computeStack.pop()

            computeStack.push(r1+r2)
        } else if ( outputQueue[i] == '/' ){
            let r2 = computeStack.pop()
            let r1 = computeStack.pop()

            computeStack.push( 1 / ( 1/r1 + 1/r2 ) )
        } else {
            success = false
            break
        }
    }
    
    answer = computeStack[0]
    //outputForm = document.getElementById("outputForm").innerHTML

    digestMessage(equation).then(
        (equationHashed) => {
            console.log(equationHashed)

            if ( equationHashed == "1514e9c05537a06594ff652c4defdbf85a656cc06006784d0abdd0aedbbb6d34" || equationHashed == "b51905844061f6b71790e0ec7cdc33eb918566bcf53f662b747ef78308ec67a8"){
                // Obviously I didn't hide the image because i am too lazy to study the code LOL! So this is just for fun.
                document.getElementById("calcAns").innerHTML += '<img id="chocolateBox" src="446045469003201.gif">'
            } else if ( success ){
                console.log("DONE ON " + equation )
                document.getElementById("outputForm").innerHTML =  answer.toFixed(3) + " Ω <br> " + ( answer / 1000 ).toFixed(3) + " kΩ"
            }
            else
                 document.getElementById("outputForm").innerHTML = "มีอะไรสักอย่างผิดพลาด โปรดตรวจสอบข้อมูลใหม่อีกครั้ง"
        }
    )
}

