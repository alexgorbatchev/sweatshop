// Generated by CoffeeScript 1.6.3
/*
@name Sweatshop

@fileOverview
Lightweight test factories, optimized for
[CoffeeScript](http://coffeescript.org/).
*/

var Sweatshop, dot, fn, _, _fn, _i, _len, _ref,
  __slice = [].slice;

_ = require('lodash');

dot = require('dot-component');

Sweatshop = (function() {
  function Sweatshop() {
    var args, _ref;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (typeof _(args).last() === 'object') {
      this.parent = args.pop();
    }
    this.factoryFn = args.pop();
    this.model = (_ref = args.pop()) != null ? _ref : Object;
    this.children = [];
  }

  /*
  Builds a plain, JSON-compatible object from your factory
  
  @param {string} [name] - Name of the child factory to use
    (or, just use this one if a name is not supplied)
  @param {object} [factoryParams] - Parameters to send to the factory function
  @param {object} [overrides] - Overrides to apply after the factory function
    is done
  
  @returns {object} A plain old JavaScript object
  @async
  */


  Sweatshop.prototype.json = function(attrs, overrides, mode, callback) {
    var _this = this;
    attrs = _.clone(attrs != null ? attrs : {});
    return this.factoryFn.call(attrs, mode, function(err) {
      if (err != null) {
        return callback(err);
      }
      return _this.parent.factoryFn.call(attrs, function(err) {
        var key, result, val;
        if (err != null) {
          return callback(err);
        }
        result = _.merge({}, attrs);
        for (key in overrides) {
          val = overrides[key];
          dot.set(result, key, val, true);
        }
        return callback(null, result);
      });
    });
  };

  /*
  Creates an instance of the model with the parameters defined when you created
  the factory
  
  @param {string} [name] - Name of the child factory to use
    (or, just use this one if a name is not supplied)
  @param {object} [factoryParams] - Parameters to send to the factory function
  @param {object} [overrides] - Overrides to apply after the factory function
    is done
  
  @returns {object} An instance of the factory model
  @async
  */


  Sweatshop.prototype.build = function(attrs, overrides, mode, callback) {
    var _this = this;
    return this.json(attrs, overrides, mode, function(err, result) {
      var model;
      if (err != null) {
        return callback(err);
      }
      model = _this.modelInstanceWith(result);
      return callback(null, model);
    });
  };

  /*
  Creates and saves an instance of the model with the parameters defined when
  you created the factory
  
  @param {string} [name] - Name of the child factory to use
    (or, just use this one if a name is not supplied)
  @param {object} [factoryParams] - Parameters to send to the factory function
  @param {object} [overrides] - Overrides to apply after the factory function
    is done
  
  @returns {object} An instance of the factory model, after `#saveModel` has
    been called on it.
  @async
  */


  Sweatshop.prototype.create = function(attrs, overrides, mode, callback) {
    var _this = this;
    return this.build(attrs, overrides, mode, function(err, model) {
      if (err != null) {
        return callback(err);
      }
      return _this.saveModel(model, callback);
    });
  };

  /*
  Define a sub-factory that shares the factory function, model, and overwritten
  options of this factory. The sub-factory can optionally be referred to by a
  name so it can be accessed later using the `#child` function.
  
  @param {string} [name] - Optional name of the child factory to use
  @param {object} [model] - Optional model for the child factory to use
  @param {function} factoryFn - Factory function for the child factory. Will be
    applied before the factory function of the parent factory.
  
  @returns {Sweatshop} A new factory that descends from the current one.
  */


  Sweatshop.prototype.define = function() {
    var args, name;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    name = typeof args[0] === 'string' ? args.shift() : this.children.length;
    return this.children[name] = (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Sweatshop, __slice.call(args).concat([this]), function(){});
  };

  /*
  Find a descendant factory by name
  
  @param {string} name - Name of the descendant factory
  
  @returns {Sweatshop} The descendant factory with the supplied name
  
  @throws Complains if there is no descendant factory with the supplied name
  */


  Sweatshop.prototype.child = function(name) {
    return this.children[name] || (function() {
      throw "Unknown factory `" + name + "`";
    })();
  };

  /*
  Create a new instance of the factory model, given a set of attributes
  
  @param {object} attrs A set of attributes to pass to the factory model
  
  @returns {object} A copy of the factory model with the attributes set
  */


  Sweatshop.prototype.modelInstanceWith = function(attrs) {
    return new this.model(attrs);
  };

  /*
  Persists a copy of the factory model
   
  @param {object} An instance of the factory model to persist
  
  @returns {*} Whatever the persistance function for the model returns
  @async
  */


  Sweatshop.prototype.saveModel = function(model, callback) {
    if (_.isFunction(model.save)) {
      return model.save(callback);
    } else {
      return _.defer(callback, null, model);
    }
  };

  return Sweatshop;

})();

_ref = ['json', 'build', 'create'];
_fn = function(fn) {
  var fnWithSaneArgs;
  fnWithSaneArgs = Sweatshop.prototype[fn];
  return Sweatshop.prototype[fn] = function() {
    var args, attrs, callback, instance, mode, overrides;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    instance = typeof args[0] === 'string' ? this.child(args.shift()) : this;
    callback = args.pop();
    attrs = args.shift();
    overrides = args.shift() || {};
    mode = args.shift() || fn;
    return fnWithSaneArgs.call(instance, attrs, overrides, mode, callback);
  };
};
for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  fn = _ref[_i];
  _fn(fn);
}

module.exports = new Sweatshop(_.defer);
