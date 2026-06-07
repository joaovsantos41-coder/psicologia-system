import { useState } from 'react'
import './index.css'

import Dashboard from './pages/Dashboard'

function App() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

 const [logged, setLogged] = useState(
  localStorage.getItem('token') ? true : false
)

  async function handleLogin() {

    try {

      const response = await fetch('http://localhost:3333/auth/login', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await response.json()

      if (data.token) {

        localStorage.setItem('token', data.token)

        setLogged(true)

      } else {

        alert('Email ou senha inválidos')

      }

    } catch (error) {

      console.log(error)

      alert('Erro ao fazer login')

    }
  }

  if (logged) {
    return <Dashboard />
  }

  return (
    <div className="container">

      <div className="card">

        <h1>Psicologia System</h1>

        <p>Sistema de gerenciamento para psicólogos</p>

        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Entrar
        </button>

      </div>

    </div>
  )
}

export default App