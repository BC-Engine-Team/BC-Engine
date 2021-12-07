const cloneArray = require('./cloneArray');

test('properly clones array', () => {
    const array = [1, 2, 3];    

    expect(cloneArray(array)).not.toBe(array); //make sure array is cloned
    expect(cloneArray(array)).toEqual(array); // make sure both arrays have the same value
});