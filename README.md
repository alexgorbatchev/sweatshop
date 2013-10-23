# Sweatshop

Very basic factories helper to generate plain objects and scenarios for tests.

# Usage Example

```coffeescript
# Basic models
userFactory = Sweatshop.define User, (done) ->
  @username  ?= Faker.Helpers.replaceSymbolWithNumber("facebook-##########")
  @name      ?= "#{Faker.Name.firstName()} #{Faker.Name.lastName()}"
  @picture   ?= "http://www.gravatar.com/avatar/#{md5 Math.random().toString()}?d=identicon&f=y"
  @email     ?= Faker.Internet.email()
  @createdAt ?= new Date()

  done()

pageFactory = Sweatshop.define Page, (done) ->
  @identifier   ?= Faker.Internet.slug()
  @url          ?= Faker.Internet.url()
  @createdAt    ?= new Date()
  @messageCount ?= 0

  done()

# Complex model
messageFactory = Sweatshop.define Message, (done) ->
  @page       = pageFactory.sync.create @page unless @page instanceof Page
  @author     = userFactory.sync.create @author unless @author instanceof User
  @identifier ?= Faker.Internet.slug()
  @body       ?= Faker.Lorem.sentences 1 + rnd 3
  @createdAt  ?= new Date()

  done()

# Scenario example
pageWithCommentsFactory = Sweatshop.define (done) ->
  @user1         = userFactory.sync.create()
  @user2         = userFactory.sync.create()
  @user3         = userFactory.sync.create()
  @page          = pageFactory.sync.create()
  @message_1     = messageFactory.sync.create {@page, author: @user1, createdAt: new Date('2013-03-03 10:00')}
  @message_1_1   = messageFactory.sync.create {@page, author: @user2, parent: @message_1}
  @message_1_1_1 = messageFactory.sync.create {@page, author: @user3, parent: @message_1_1}
  @message_1_2   = messageFactory.sync.create {@page, author: @user3, parent: @message_1}
  @message_2     = messageFactory.sync.create {@page, author: @user2, createdAt: new Date('2013-03-03 9:00')}
  @message_2_1   = messageFactory.sync.create {@page, author: @user3, parent: @message_2}

  done()

# Basic syntax
userFactory.create (user) ->
  console.log user #=> {username, name, picture, email, createdAt}

# Creating submodels
messageFactory.create {page: {identifier, url}}, (message) ->
  console.log message #=> {page, author, identifier, body, createdAt}

# Using already created models
page = new Page attrs
messageFactory.create {page}, (message) -> 
  console.log message #=> {page, author, identifier, body, createdAt}

# Globally-defined factories
Sweatshop.define 'widget', (done) ->
  @foo = 'bar'
  done()

Sweatshop.create 'widget', (widget) ->
  console.log widget.foo #= 'bar'
```

# License

MIT
