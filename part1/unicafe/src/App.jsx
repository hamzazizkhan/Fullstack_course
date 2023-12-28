import { useState } from 'react'
const Statisticline = ({text, stat}) => {
  return(
    <tr>
      <td>{text}</td>
      <td>{stat}</td>
    </tr>
    
  )
}

const Statistics = (props) => {
  if (props.allClicks.length===0){
    return(
      <div>
        No feedback given.
      </div>
    )
    
  }
  return(
  <div>
    <header>
        <h1>statistics</h1>
    </header>

    <table>
      <tbody>
      <Statisticline text='good' stat={props.good}/>
      <Statisticline text='neutral' stat={props.neutral}/>
      <Statisticline text='bad' stat={props.bad}/>
      <Statisticline text='all' stat={props.total}/>
      <Statisticline text='average' stat={props.ave}/>
      <Statisticline text='positive' stat={props.pos}/>
      </tbody>
    </table>

  </div>
  )
  
}

const Button = ({handleClick, text}) => {
  return(
    <button onClick={handleClick}> {text}</button>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)

  const ave = (good - bad)/total
  const pos = (good/total)*100

  const statvals = {good : good,
    neutral:neutral,
    bad:bad,
    total:total,
    ave:ave,
    pos:pos,
    allClicks:allClicks}
  
  const handleGoodClick = () =>{
    setAll(allClicks.concat('G'))
    const g= good +1
    setGood(g)
    setTotal(total +1)
  }
  const handleBadClick = () =>{
    setAll(allClicks.concat('B'))
    const b=bad+1
    setBad(b)
    setTotal(total +1)
  }
  const handleNeutralClick = () =>{
    setAll(allClicks.concat('N'))
    const n=neutral+1
    setNeutral(n)
    setTotal(total +1)
  }

  return (
    <div>
      <header>
        <h1>give feedback</h1>
      </header>

      <Button handleClick={handleGoodClick} text='good'/>
      <Button handleClick={handleNeutralClick} text = 'neutral'/>
      <Button handleClick={handleBadClick} text = 'bad'/>

      <Statistics {...statvals}/> 

    </div>
  )
}

export default App