require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/person')
const express=require('express')
const morgan = require('morgan')
const app = express()
const cors=require('cors')
const bodyParser = require('body-parser')
const person = require('./models/person')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))


app.use(morgan(':method :url :status :res[header] - :response-time ms :data'))
morgan.token('data', function getId (req) {
  return JSON.stringify({ 'name': req.body.name || '-','number':req.body.number || '-' })
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })

})
app.get('/api/info',(request,response) => {
  var dateObject=new Date()
  Person.count({}, function(err, count){
    var info='Phonebook has ' + count +' people' + dateObject
    response.json(info)
  })

})
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id',(req,res,next) => {
  Person.findById( req.params.id).then(person => {if(person){res.json(person.toJSON())} else res.status(404).end()}).catch(error => next(error))
})
app.put('/api/persons/:id',(request,response,next) => {
  const body=request.body
  const p={
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id,p, { new: true }).then(updatedPerson => {
    response.json(updatedPerson.toJSON())
  })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (body.name === undefined) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  if (body.number === undefined) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedNote => savedNote.toJSON())
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({
      error: 'malformatted id'
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT ||  3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)