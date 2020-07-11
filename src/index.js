import { concat } from 'lodash/array'

var array = [1]
var other = concat(array, 2, [3], [[4]])
console.log(other)

other