const calc = require('./calc');

test('properly adds two numbers', () => {
    expect(calc.add(2, 2)).toBe(4);
});

test('properly substracting two numbers', () => {
    expect(calc.substract(5, 3)).toBe(2);
});

test('properly throw exception', () => {
    expect(() => {
        calc.badd();
    }).toThrow(new Error('it blowed up'));
});

test('properly throw exception', () => {
    expect(() => {
        calc.badd();
    }).toThrow('it blowed up');
});