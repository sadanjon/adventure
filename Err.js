var Err = function(msg) {
    this.msg = msg;
};

Err.prototype.getMessage = function() {
    return msg;
};

Err.prototype.printMessage = function() {
    console.log(this.msg);
};

Err.ABSTRACT_METHOD = new Err("Illegal invocation of abstract method");


