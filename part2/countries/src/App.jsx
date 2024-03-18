import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryForm =({country, handleCountryChange})=>{
  if (country===null){
    return null
  }
  return(
    <form >
      <div>
        find countries <input value={country} onChange={handleCountryChange}/>
      </div>
    </form>
  )
  }

const CountriesList=({matchingCountries, country, dataCountries, handleCountryClick, selectedCountry})=>{
  if(country.length===0){
    return null
  }
  if(matchingCountries.length>9){
     return(
      <div>too many matches</div>
     )
   }
   if(dataCountries.length===1){
    return(
      <div>
        <header>
        <h1>{dataCountries[0].country}</h1>
        </header>
        <p>capital {dataCountries[0].capital[0]}</p>
        <p>area {dataCountries[0].area}</p>
        <img src={dataCountries[0].flag}/>
        <header>
        <h2>languages</h2>
        </header>
        <ul>
        {dataCountries[0].languages.map((l)=><li key={l}>{l}</li>)}
        </ul>
        <header>
        <h2>Weather in {dataCountries[0].country}</h2>
        </header>
        <p>temperature {dataCountries[0].temp}</p>
        <img src={dataCountries[0].img} ></img>
        <p>wind {dataCountries[0].wind}</p>

      </div>
    )
    
  }
  return(
    <div>
      <ul>
        {dataCountries.map(c=>
          <li key={c}> {c.country} 
          <button onClick={()=>handleCountryClick(c)}>show</button>
          </li> 
        )}
      </ul>
    </div>
  )
}


const App =()=>{
  const all = `https://studies.cs.helsinki.fi/restcountries/api/all`
  const single = `https://studies.cs.helsinki.fi/restcountries/api/name/`
  const api_key = import.meta.env.VITE_SOME_KEY
  //const api=`https://api.openweathermap.org/data/2.5/weather?lat=${latlng[0]}&lon=${latlng[1]}&appid=${api_key}`


  const [country, setCountry]=useState('')
  const [allCountries, setAllCountries]=useState([])
  const [matchingCountries, setMatchingCountries] = useState([]);
  const [dataCountries, setDataCountries] = useState([]);
  const [selectedCountry, setSelectedCountry]=useState(null)

  useEffect(()=>{
    console.log('effect running')
    axios.get(all).then(
      response=>{
        setAllCountries(response.data)
      }
    )
  },[])

  
  useEffect(()=>{
    const names = allCountries.filter((c)=>
    c.name.common.toLowerCase().includes(country.toLowerCase()))
    const matched=names.map((c)=>c.name.common)
    setMatchingCountries(matched)

    console.log('names')
    console.log(names)

    const dataObjects=names.map((c)=>{
      const dataObject={
        country:'',
        flag:'',
        languages:[],
        capital:'',
        area:'',
        temp:'',
        wind:'',
        img:''
      }
      //console.log(c)
      dataObject.country=c.name.common
      dataObject.flag=c.flags.png
      try{
        dataObject.languages=Object.values(c.languages)
      }catch{
        dataObject.languages=['none']
      }
      dataObject.capital=c.capital
      if(!c.capital){
        dataObject.capital=['none']
      }
      dataObject.area=c.area

      const latlng=c.latlng
      const api=`https://api.openweathermap.org/data/2.5/weather?lat=${latlng[0]}&lon=${latlng[1]}&appid=${api_key}`
      axios.get(api).then((response)=>{
        response.data
        console.log(response.data)
        dataObject.temp=response.data.main.temp - 273.15
        dataObject.wind=response.data.wind.speed
        dataObject.img=`https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
      })

      return(dataObject)
    })
    setDataCountries(dataObjects)
    console.log('data')
    console.log(dataObjects)
    
    console.log('matched')
    console.log(matched)
    console.log('all countries')
    console.log(country)
    console.log(allCountries)


  },[country])
    
  

  const handleCountryChange=(event)=>{
    setCountry(event.target.value)
    setDataCountries([])
    setMatchingCountries([])
    console.log('country ch')
    console.log(event.target.value)
  }
  const handleCountryClick=(c)=>{
    setDataCountries([c])
  }
  
  return(
    <div>
      <CountryForm country={country} handleCountryChange={handleCountryChange} />
      <CountriesList matchingCountries={matchingCountries} country={country} dataCountries={dataCountries}
      handleCountryClick={handleCountryClick} selectedCountry={selectedCountry}/>
    </div>
  )
}

export default App