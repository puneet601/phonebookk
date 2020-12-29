const mongoose = require('mongoose')
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
const password = process.argv[2]

const url =
`mongodb+srv://admin-Puneet:${password}@cluster0.jtfpp.mongodb.net/phonebook?retryWrites=true`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
const personSchema=new mongoose.Schema({
  name:String,
  number:String,

})
const Person=mongoose.model('Person',personSchema)
if (process.argv.length > 3) {
  const newName=process.argv[3]
  const newNumber=process.argv[4]
  const person=new person({
    name: newName,
    number: newNumber,
    // id: Math.floor(Math.random() * 101)
  })
  person.save().then(result => {
    console.log(`Added ${newName} number ${newNumber} to phonebook.`)
    mongoose.connection.close()
  })

}

else if(process.argv.length === 3){

  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(record => {
      console.log(record.name +' ' + record.number)
    },
    mongoose.connection.close())

  })
}
