import { useState, useEffect } from 'react'
import axios from 'axios'
import noteService from './services/persons'

const Person = ({person, del}) => {
  return(
    <li>
      {person.name} {person.number}
      <button onClick={del}>delete</button> 
    </li>
  )
}

const PersonsList = ({persons, del}) => {
  return(
    <ul>
      {persons.map((person)=> 
      <Person key = {person.name} person={person} del={()=>del(person.id)}/>)}
    </ul>
  )
  
}

const Filter = ({persons, filterval, handleFiltervalChange, del}) => {
  const newPersons = persons.filter(
    (person)=>person.name.toLowerCase()===filterval.toLowerCase())
  
  return (
    <div>
        input shown with <input value={filterval} onChange={handleFiltervalChange}/>
      <PersonsList persons={newPersons} del={del}/>
    </div>
  )
}

const PersonForm = ({addPerson, newName, newNumber, handlePersonChange, handleNumberChange }) =>{
  return(
  <div>
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handlePersonChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </div>
  )
  
}

const Notification=({message})=>{
  if(message===null){
    return null
  }
    return(
      <div className='error'>
        {message}
      </div>
    )
}
const SuccessNotification=({message})=>{
  if(message===null){
    return null
  }
    return(
      <div className='success'>
        {message}
      </div>
    )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterval, setFilterval] = useState('')
  const [NotificationMessage, setMessage] = useState(null)
  const [SuccessMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    noteService.getAll()
      .then(allpeople => {
        console.log('promise fulfilled')
        setPersons(allpeople)
      })
  }, [])
  console.log('render', persons.length, 'notes')

  const addPerson = (event) =>{
    event.preventDefault()
    console.log('button clicked', event.target)
    const nameObject = {
      name: newName,
      number: newNumber
    }
    
    const CurrName = persons.filter((person)=> person.name===newName)
    if (CurrName.length>0){ 
      
      const res = window.confirm(`${newName} is already added to phonebook. update number?`)
      if (res){
        const id = CurrName[0].id
        noteService.update(id, nameObject)
        .then(NameNumber => {
        setPersons(persons.map(p => p.id !== id ? p : NameNumber))
        setNewName('')
        setNewNumber('')
        console.log(NameNumber)
        const message = `${newName} updated number`
        setSuccessMessage(message)
        setTimeout(()=>{setSuccessMessage(null)}, 5000)
      })
      .catch(error=>{
        setMessage(`info of ${newName} has already been removed`)
        setTimeout(()=>{setMessage(null)}, 5000)
      })
      }
      return
    }
    noteService.create(nameObject)
    .then(name => {
      setPersons(persons.concat(name))
      setNewName('')
      setNewNumber('')
      console.log(name)
      const message = `${newName} added`
      setSuccessMessage(message)
      setTimeout(()=>{setSuccessMessage(null)}, 5000)
      
    })
  }

  const handleDeletePerson=(id)=>{
    const person = persons.find(n => n.id === id)
    const changedPersonslist = persons.filter(p=>p !== person)
    const newName = person.name
    const res = window.confirm(`${newName} delete?`)
    if(res){
      noteService.del(id).then(response=>{
        console.log(`deleting person with id ${id}`)
        setPersons(changedPersonslist)
      })
    }
  }

  const handlePersonChange = (event) =>{
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event)=> {
    setNewNumber(event.target.value)
  }

  const handleFiltervalChange = (event)=> {
    setFilterval(event.target.value)
  }

  

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={NotificationMessage}/>
      <SuccessNotification message={SuccessMessage}/>

      <Filter persons={persons} filterval={filterval} handleFiltervalChange={handleFiltervalChange} 
      del={handleDeletePerson}/>

      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} 
        handlePersonChange={handlePersonChange} handleNumberChange={handleNumberChange}/>

      <h2>Numbers</h2>
      <PersonsList persons={persons} del={handleDeletePerson}/>
      
    </div>
  )
}

export default App