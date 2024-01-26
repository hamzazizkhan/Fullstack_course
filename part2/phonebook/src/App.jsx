import { useState, useEffect } from 'react'
import axios from 'axios'

const Person = ({person}) => {
  return(
    <li>
      {person.name} {person.number}
    </li>
  )
}

const PersonsList = ({persons}) => {
  return(
    <ul>
      {persons.map((person)=> 
      <Person key = {person.name} person={person}/>)}
    </ul>
  )
  
}

const Filter = ({persons, filterval, handleFiltervalChange}) => {
  const newPersons = persons.filter(
    (person)=>person.name.toLowerCase()===filterval.toLowerCase())
  
  return (
    <div>
        input shown with <input value={filterval} onChange={handleFiltervalChange}/>
      <PersonsList persons={newPersons}/>
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

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterval, setFilterval] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
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
    
    const result = persons.filter((person)=> person.name===newName)
    if (result.length>0){ 
      setNewName('')
      setNewNumber('')
      return(window.alert(`${newName} is already added to phonebook`))
    }
    
    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
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
      <Filter persons={persons} filterval={filterval} handleFiltervalChange={handleFiltervalChange}/>

      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} 
        handlePersonChange={handlePersonChange} handleNumberChange={handleNumberChange}/>

      <h2>Numbers</h2>
      <PersonsList persons={persons} />
      
    </div>
  )
}

export default App