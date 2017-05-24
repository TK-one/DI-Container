DiContainer = function () {
 if (!(this instanceof DiContainer)) {
   return new DiContainer();
 }

 this.registration = {};
};

DiContainer.prototype.messages = {
  registerRequireArgs: 'this register function need three arguments. "string, Array<string>, function"'
};

DiContainer.prototype.register = function (name, dependencies, func) {
  var ix;
  
  if (typeof name !== 'string'
  ||  !Array.isArray(dependencies)
  ||  typeof func !== 'function') {
    throw new Error(this.messages.registerRequireArgs);
  }

  for (ix=0; ix<dependencies.length; ix++) {
    if (typeof dependencies[ix] !== 'string') {
      throw new Error(this.messages.registerRequireArgs);
    }
  }

  this.registration[name] = { dependencies: dependencies, func: func };
}

DiContainer.prototype.get = function (name) {
  var self = this,
      registration = this.registration[name],
      dependencies = [];
  if (registration === undefined) {
    return undefined;
  }

  registration.dependencies.forEach(function (dependencyName) {
    var dependency = self.get(dependencyName);
    dependencies.push(dependency === undefined? undefined: dependency);
  })

  return registration.func.apply(undefined, dependencies);
}