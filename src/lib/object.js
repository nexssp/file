// config.push -- below cannot be implemented as push in the global scope!!!
// It will show an error Readable push cannot be assigned
// So it cannot name as .push
Object.defineProperty(Object.prototype, 'add', {
  enumerable: false,
  value: function (location, what) {
    if (!this[location]) {
      this[location] = []
    }

    if (!Array.isArray(this[location])) {
      // if this is not array convert to array to add new value
      this[location] = [this[location]]
    }

    this[location].push(what)
  },
})
