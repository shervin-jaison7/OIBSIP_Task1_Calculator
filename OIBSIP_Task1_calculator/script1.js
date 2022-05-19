document.addEventListener('DOMContentLoaded', function () {

    var bttons = document.querySelectorAll('button');
    var input_no = document.querySelector('input');
    var bracket_c=0;
    var res='';
    bttons.forEach(function (btton) {
        btton.addEventListener('click', function () {
            strd = btton.className;
            input_no.style.display="block";
            var i = input_no.value.length - 1;
            var symbol = btton.value;
            if (strd=== "numbers" ) {
                if (input_no.value == '0') {
                    input_no.value = symbol;
                }
                
                else {
                    input_no.value += symbol;
                }
                document.querySelector('.result').innerHTML = eval(input_no.value);
            }
            else if (strd.match("two_no")) {
                if(res!=='' && input_no.value===''){
                    input_no.value+=res;   
                }
                res='';
                if (input_no.value[i]==='('){
                    input_no.value += '0';
                }
                if (input_no.value[i] === '.') {
                    input_no.value = input_no.value.slice(0, i);
                }
                input_no.value += symbol;
                input_no.value = check_sign(input_no.value, i+1, strd.match("pow"));
            }
            else if (strd.match("one_no")) {
                if (res !== '' && input_no.value === '') {
                    input_no.value += res;
                }
                res = '';
                input_no.value = one_no_expression(input_no.value, symbol);
                document.querySelector('.result').innerHTML = eval(input_no.value);
            }

            else if (strd === "ans") {
                if(bracket_c>0){
                    input_no.value += ")".repeat(bracket_c);
                    bracket_c=0;
                    bracket_no_dis(bracket_c);
                }
                if (eval(input_no.value) ===undefined){
                    return 0;
                }
                res = eval(input_no.value);
                document.querySelector('.result').innerHTML = eval(input_no.value);
                input_no.style.display = "none";
                input_no.value='';
            }
            else if (strd === "clear") {
                input_no.value = 0;
                bracket_c=0;
                document.querySelector('.result').innerHTML = "";

            }
            else if (strd === "constant") {
                let ans='';
                if (input_no.value == '0') {
                    ans = eval(`Math.${ symbol }`)
                    input_no.value = ans;
                }
                else {
                    ans = eval(`Math.${symbol}`)
                    input_no.value = input_no.value+ans;
                }
            }
            else if (strd === "backspace") {
                if (input_no.value[i]==="("){
                    bracket_c--;
                }
                else if (input_no.value[i] === ")"){
                    bracket_c++;
                }
                input_no.value = input_no.value.slice(0, i)
                document.querySelector('.result').innerHTML = "";
            }
            else if (strd === "bracket") {
                i=input_no.value.length-1;
                if(symbol==='('){
                        if ((input_no.value.length == 1 && input_no.value === '0')||input_no.value.length==0) {
                        bracket_c++;
                        input_no.value = '(';
                        bracket_no_dis(bracket_c);
                        return input_no;
                    }
                    if (input_no.value[i].match(/\d/) || input_no.value[i]===")"){
                        input_no.value=`${input_no.value}*(`;
                    }
                    else{
                        input_no.value = `${input_no.value}(`;
                    }
                    bracket_c++;
                    bracket_no_dis(bracket_c);
                }
                else if (symbol === ')'){
                    if(bracket_c>0){
                        if(!input_no.value[i].match(/\d/)){
                            input_no.value = `${input_no.value}0`;
                        }
                        else{
                            input_no.value = `${input_no.value}`;
                        }
                        input_no.value = `${input_no.value})`;
                        bracket_c--;
                    }
                    bracket_no_dis(bracket_c);
                }
            }
            
        })
    })

});


//For operation that only needs one number
function one_no_expression(first, str) {
    let c = separate_2nd_no(first);
    let feq = first.slice(0, first.length - c);
    let seq = first.slice(first.length - c);
    var ans='';
    if (str === 'inv') {
        return (first = `${feq}1/${seq}`);
    }
    else if (str === '.') {
        return (first = `${first}.`);
    }
    else if (str === 'sq') {
        return (first = `${first}**2`);
    }
    else if (str === 'cb') {
        return (first = `${first}**3`);
    }
    else if (str === 'sqrt') {
        ans = eval(`Math.sqrt(${seq})`);
        return (first = feq + ans);
    }
    else if (str === 'cbrt') {
        ans = eval(`Math.pow(${seq},(1/3))`);
        return (first = feq + ans);
    }
    else if (str === 'ex') {
        ans = eval(`Math.pow(Math.E,${seq})`);
        return (first = feq + ans);
    }
    else if (str === 'log') {
        ans = eval(`Math.log10(${seq})`)
        return (first = feq +ans);
    }
    else if (str === 'ln') {
        ans = eval(`Math.log(${seq})`)
        return (first = feq +ans );
    }
    else if (str === '10_pow') {
        ans = eval( `Math.pow(10, ${seq})`)
        return (first = feq +ans);
    } 
    else if (str === '2_pow') {
        ans = eval(`Math.pow(2, ${seq})`)
        return (first = feq + ans);
    }
    else if (str === 'fact') {
        ans=factorial(seq);
        return (first = feq + ans);
    }
    else if (str === 'neg') {
        let ans= eval(`${seq}*(-1)`);
        if (ans>=0) {  
            return (first = `${feq}${ans}`)
        }
        else{
            return (first = `${feq}(${ans})`)
        }
    }
    else if (str === 'modd') {
        ans=eval(`Math.abs(${eval(seq)})`)
        return (first = feq +ans );
    }
}

//to separate last number from the strings including decimals and brackets
function separate_2nd_no(str) {
    let check = /^\d*\.?\d*$/;
    var count = 0;
    if (str[str.length - 1] === ')') {
        for (let j = str.length - 1; j >= 0; j--) {
            count++;
            if (str[j] === '(') {
                break;
            }
        }
    }

    else{
        for (let i = str.length - 1; i >= 0; i--) {
            if (str[i].match(check)) {
                count++;
            }
            else {
                break;
            }
        }
    }
    
    console.log(str.slice(str.length - count),"#", str.slice(0, str.length - count), count);
    return (count);
}

//Factorial
function factorial(n) {
    var c = 1;
    n=eval(n);
    for (let i = n; i > 0; i--) {
        c *= i;
    }
    return c;
}

//To make sure that their aren't multiple operators except for "**" and "(*,/,%)(+,-)" in the equation 
function check_sign(str,i, bool) {
    let check1 = /[\%*]/;
    let check2 = /[+-]/;

    let j = i - 1;
    console.log(str[j], str[j].match(/\d/))
    if (!str[j].match(/\d/)) {
        console.log(str[i], str[i].match(check2), str[j], str[j].match(check1))
        if (str[j] === "(" || str[j] === ')') {     //skip if there is bracket
            return str;
        }
        else {
            if (bool) { //check for power
                return check_sign(str, i - 1, bool);
            }
            else if (str[i].match(check2) && str[j].match(check1)) {
                return check_sign(str, i - 1, bool);
            }
            else {
                return check_sign(str.slice(0, j) + str[i], i - 1, bool);
            }
        }
    }
    else{
        return str;
    } 
}

//To display the number of open brackets  
function bracket_no_dis(no){
    if (no>0){
        document.getElementById('bracket-no').style.display='block';
        document.querySelector('#bracket-no').innerHTML=no;
    }
    else{
        document.getElementById('bracket-no').style.display = 'none';
    }
}

