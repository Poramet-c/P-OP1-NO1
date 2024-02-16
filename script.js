function toResistorsValue(numb){
    arr = [0,100,2500,2600,285.71,95.24,4333.33,2333.33]
    return arr[parseInt(numb)]
}

function calc(){
    equation = document.getElementById("eqInput").value
    console.log(equation)

    inputStack = []
    outputQueue = []
    computeStack = []

    for ( let i = 0 ; i < equation.length ; i++ ){
        if ( equation[i] >= '0' && equation[i] <= '9' ){
            outputQueue.push(equation[i])
        } else if ( equation[i] == ')' ) {
            while ( inputStack[inputStack.length-1] != '('){
                outputQueue.push(inputStack.pop())
            }

            inputStack.pop()
        } else {
            inputStack.push(equation[i])
        }
    }

    while ( inputStack.length > 0 ){
        outputQueue.push(inputStack.pop())
    }

    for ( let i = 0 ; i < outputQueue.length; i++ ){
        if ( outputQueue[i] >= '0' && outputQueue[i] <= '9' ){
            computeStack.push(toResistorsValue(outputQueue[i]))
        } else if ( outputQueue[i] == '-' ) {
            r1 = computeStack.pop()
            r2 = computeStack.pop()

            computeStack.push(r1+r2)
        } else if ( outputQueue[i] == '/' ) {
            r1 = computeStack.pop()
            r2 = computeStack.pop()

            computeStack.push(1/(1/r1+1/r2))
        }
    }
    
    answer = computeStack[0]
    console.log(answer)

    document.getElementById("outputForm").innerHTML =  answer.toFixed(2) + " Ω <br> " + (answer / 1000).toFixed(2) + " kΩ"
}