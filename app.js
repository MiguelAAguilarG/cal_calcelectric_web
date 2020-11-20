var elements = {
    cir1: {
        name: "circuito 1",
        type:"circuit",
        active: true,
        parameter: {
            voltage: 127,
            realPower: 1000,
            pf: 0.9
            }
    }, 
    cir2: {
        name: "circuito 2",
        type:"circuit",
        active: true,
        parameter: {
            voltage: 220,
            realPower: 2000,
            pf: 0.9
            }
    }, 
    cir3: {
        name: "circuito 3",
        type:"circuit",
        active: true,
        parameter: {
            voltage: 480,
            realPower: 3000,
            pf: 0.9
            }
    }
}

var funtions = {
    current: {
        name: "funtion current",
        type: "current",
        run: true,
        argument: ["realPower", "pf", "voltage"],
        fun: current,
        value: "current"
    },
    current1: {
        name: "funtion current1",
        type: "current",
        run: true,
        argument: ["real", "pf", "voltage"],
        fun: current1,
        value: "current1"
    },
    realPower: {
        name: "funtion realPower",
        type: "power",
        run: true,
        argument: ["apparentPower", "pf"],
        fun: realPower,
        value: "realPower"
    },
    apparentPower: {
        name: "funtion apparentPower",
        type: "power",
        run: true,
        argument: ["realPower", "pf"],
        fun: apparentPower,
        value: "apparentPower"
    },
    real: {
        name: "funtion real",
        type: "power",
        run: true,
        argument: [],
        fun: real,
        value: "real"
    }
}

var calculations = {
    basicCalculation: {
        name: "basic calculation",
        type: "basic",
        funs: ["current1", "current", "realPower", "apparentPower", "real"]
    }
}

calc_main(elements);
//////////////////////////////////////////
function calc_main(elements) {
    console.log(elements);
    elements = iterative(elements);
    console.log(elements);
}

function iterative(elements) {
    for (const element in elements) {
        elements[element] = primary(elements[element]);
    }

    return elements
}

function primary(element) {
    element.parameter = basicCalculation(element.parameter, calculations.basicCalculation)

    return element
}

function preparativeCalculation(parameter, funs) {
    let flag = true;
    let flagSize = 0;
    while (flag === true && flagSize < funs.length) {
        flag = false;

        for (const cal of funs) {
            parameter[cal] = runFuntion(funtions[cal]["fun"](parameter), funtions[cal], parameter);
            console.log(parameter[cal]);
        }

        /*parameter["current1"] = runFuntion(current1(parameter), funtions.current1, parameter);
        parameter["current"] = runFuntion(funtions.current.fun(parameter), funtions.current, parameter);*/

        for (const par in parameter) {
            if (parameter[par] === undefined) {
                flag = true;
                break;
            }
        }
        flagSize++;
        console.log(parameter);
    }

    return parameter;
}

function basicCalculation(parameter, basicCalculation) {

    parameter = preparativeCalculation(parameter, basicCalculation.funs);

    return parameter;
}
//////////////////////////////////////////
function validateFuntion(directory, parameter) {
    if (!!parameter[directory.value]) {
        return 1;
    } else{
        
        let directoryCheck = {};
        let directoryCheckSize = 0;
        let directoryCheckFlag = false;
        for (const dir of directory.argument) {
            if (parameter.hasOwnProperty(dir)) {
                directoryCheckFlag = true;
                directoryCheckSize++;
                directoryCheck[dir] = directoryCheckFlag;
            }
        }

        if (Object.keys(directory.argument).length === directoryCheckSize) {
            return 2;
        } else {
            return 0;
        }

    }

}

function runFuntion(fun, directory, parameter) {

    let validateFuntionFlag = validateFuntion(directory, parameter);
    if (validateFuntionFlag === 1) {
        return parameter[directory.value];
    } else if (validateFuntionFlag === 2){
        return fun;
    } else if (validateFuntionFlag === 0){
        return;
    }

}

function current(parameter) {
    let current = parameter.realPower/(parameter.pf*parameter.voltage);

    return current;
}

function current1(parameter) {

    let current1 = parameter.real/(parameter.pf*parameter.voltage);

    return current1;
}

function real(parameter) {

    let real = 100;

    return real;
}

function apparentPower(parameter) {

    let apparentPower = parameter.realPower/parameter.pf;

    return apparentPower;
}

function realPower(parameter) {

    let realPower = parameter.apparentPower*parameter.pf;

    return realPower;
}