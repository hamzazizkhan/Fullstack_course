const Course = ({course}) =>{
    const Header = ({ course }) => <h2>{course}</h2>
    const Content = ({ parts }) => 
    <>
      {parts.map(part => 
        <Part key={part.id} part={part}/>
      )}
    </>
  
    const Part = ({ part }) => 
    <p>
      {part.name} {part.exercises}
    </p>
  
    const Total = ({ parts }) => {
      const total = parts.reduce(function(sum, part){
        return sum + part.exercises
      }, 0)
      return(<p><b>Total of {total} exercises</b></p>)
    }
  
    return(
      <>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
  
      </>
    )
    
  }
  
export default Course