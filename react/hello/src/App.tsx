import './App.css'

interface Props {
  /** Imię osoby do powitania */
  name:  string;
  /** Wiek osoby */
  age?:   number;
}

function Greeter({age = 22, name}: Props) {
  return (
    <p>Witaj {name}! Aged {age}</p>
  )
}

function App() {
  return (
    <div>
      <Greeter name="Luigi"/>
    </div>
  )
}

export default App
