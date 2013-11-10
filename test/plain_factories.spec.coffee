expect    = require('chai').expect
fibrous   = require 'fibrous'
Sweatshop = require '..'

describe 'a sweatshop for plain objects', ->
  {factory} = {}

  beforeEach ->
    factory = Sweatshop.define fibrous ->
      @foo ?= 10
      @biz ?=
        fizz: 10
        faz: 10

  it 'creates an object', fibrous ->
    result = factory.sync.create()
    expect(result.foo).to.equal 10
    expect(result.biz).to.deep.equal fizz: 10, faz: 10

  it 'builds an object', fibrous ->
    result = factory.sync.build()
    expect(result.foo).to.equal 10
    expect(result.biz).to.deep.equal fizz: 10, faz: 10

  it 'JSONs up an object', fibrous ->
    result = factory.sync.json()
    expect(result.foo).to.equal 10
    expect(result.biz).to.deep.equal fizz: 10, faz: 10

  it 'adds a new property', fibrous ->
    result = factory.sync.create {baz: 20}
    expect(result.baz).to.equal 20
    expect(result.foo).to.equal 10
    expect(result.biz).to.deep.equal fizz: 10, faz: 10

  it 'changes a property', fibrous ->
    result = factory.sync.create {foo: 20}
    expect(result.foo).to.equal 20
    expect(result.biz).to.deep.equal fizz: 10, faz: 10

  it 'changes a nested property', fibrous ->
    result = factory.sync.create {}, {'biz.faz': 20}
    expect(result.foo).to.equal 10
    expect(result.biz).to.deep.equal fizz: 10, faz: 20
