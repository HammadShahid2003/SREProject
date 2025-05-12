class Production {
    constructor(symbol, handle, id) {
        this.symbol = symbol;
        this.handle = handle;
        this.nullable = false;
        this.id = id;
        this.first = [];
        this.precedence = 0;
        this.action = null;
    }

    setAction(action) {
        this.action = action;
    }

    setPrecedence(precedence) {
        this.precedence = precedence;
    }

    addToFirst(symbol) {
        if (!this.first.includes(symbol)) {
            this.first.push(symbol);
        }
    }

    setNullable(nullable) {
        this.nullable = nullable;
    }

    getLength() {
        return this.handle.length;
    }

    getHandleAt(index) {
        return this.handle[index];
    }

    toString() {
        return this.symbol + " -> " + this.handle.join(' ');
    }
}

export default Production; 