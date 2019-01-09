function testCall(a, b){
    console.log(a, b)
    console.log(a+b)
}

testCall.apply(this, [1,2])
testCall.call(this, 2,3)