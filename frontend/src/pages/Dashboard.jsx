import { useEffect, useState } from 'react'

import { jsPDF } from 'jspdf'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

function Dashboard() {

  const [screen, setScreen] = useState('dashboard')
  const [patients, setPatients] = useState([])
  const [consultations, setConsultations] = useState([])

  const [search, setSearch] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [editingId, setEditingId] = useState(null)

  const [selectedPatient, setSelectedPatient] =
    useState('')

  const [consultationDate, setConsultationDate] =
    useState('')

  const [consultationNotes, setConsultationNotes] =
    useState('')

  const [consultationValue, setConsultationValue] =
    useState('')

  const [editingConsultationId,
    setEditingConsultationId] = useState(null)

  async function loadPatients() {

    try {

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:3333/patients',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      setPatients(data)

    } catch (error) {

      console.log(error)

    }
  }

  async function loadConsultations() {

    try {

      const token = localStorage.getItem('token')

      const response = await fetch(
        'http://localhost:3333/consultations',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()
      console.log(data)

      setConsultations(data)

    } catch (error) {

      console.log(error)

    }
  }

  useEffect(() => {

    loadPatients()
    loadConsultations()

  }, [])

  async function createPatient() {

    try {

      const token = localStorage.getItem('token')

      await fetch(
        'http://localhost:3333/patients',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            name,
            email,
            phone,
            notes
          })
        }
      )

      loadPatients()

      setName('')
      setEmail('')
      setPhone('')
      setNotes('')

    } catch (error) {

      console.log(error)

    }
  }

  function generateFinancialReport() {

    const doc = new jsPDF()

    doc.setFontSize(18)

    doc.text(
      'Relatorio Financeiro',
      20,
      20
    )

    let y = 40

    consultations.forEach(
      (consultation) => {

        doc.text(
          `Paciente: ${consultation.patient?.name
          }`,
          20,
          y
        )

        doc.text(
          `Valor: R$ ${consultation.value || 0
          }`,
          20,
          y + 10
        )

        doc.text(
          `Status: ${consultation.status
          }`,
          20,
          y + 20
        )

        y += 35

        if (y > 260) {
          doc.addPage()
          y = 20
        }
      }
    )

    doc.save(
      'relatorio-financeiro.pdf'
    )
  }

  function generateReceipt(consultation) {

    const doc = new jsPDF()

    doc.setFontSize(20)

    doc.text(
      'RECIBO DE PAGAMENTO',
      20,
      20
    )

    doc.setFontSize(12)

    doc.text(
      `Paciente: ${consultation.patient?.name
      }`,
      20,
      50
    )

    doc.text(
      `Data: ${new Date(
        consultation.date
      ).toLocaleDateString()
      }`,
      20,
      65
    )

    doc.text(
      `Valor: R$ ${consultation.value || 0
      }`,
      20,
      80
    )

    doc.text(
      'Declaro ter recebido o valor referente ao atendimento psicológico.',
      20,
      110
    )

    doc.text(
      'Assinatura:',
      20,
      160
    )

    doc.line(
      20,
      170,
      100,
      170
    )

    doc.save(
      `recibo-${consultation.patient?.name}.pdf`
    )
  }

  async function updatePatient() {

    try {

      const token = localStorage.getItem('token')

      await fetch(
        `http://localhost:3333/patients/${editingId}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            name,
            email,
            phone,
            notes
          })
        }
      )

      setEditingId(null)

      setName('')
      setEmail('')
      setPhone('')
      setNotes('')

      loadPatients()

    } catch (error) {

      console.log(error)

    }
  }

  async function deletePatient(id) {

    if (
      !window.confirm(
        'Deseja realmente excluir este paciente?'
      )
    ) {
      return
    }

    try {

      const token = localStorage.getItem('token')

      await fetch(
        `http://localhost:3333/patients/${id}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      loadPatients()

    } catch (error) {

      console.log(error)

    }
  }

  async function createConsultation() {

    try {

      const token = localStorage.getItem('token')

      await fetch(
        'http://localhost:3333/consultations',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            date: consultationDate,
            notes: consultationNotes,
            patientId: Number(selectedPatient),
            value: Number(consultationValue)
          })
        }
      )

      loadConsultations()

      setConsultationDate('')
      setConsultationNotes('')
      setSelectedPatient('')
      setConsultationValue('')

    } catch (error) {

      console.log(error)

    }
  }

  async function deleteConsultation(id) {

    if (
      !window.confirm(
        'Deseja realmente excluir esta consulta?'
      )
    ) {
      return
    }

    try {

      const token = localStorage.getItem('token')

      await fetch(
        `http://localhost:3333/consultations/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      loadConsultations()

    } catch (error) {

      console.log(error)

    }
  }

  async function updateStatus(id, status) {

    try {

      const token = localStorage.getItem('token')

      await fetch(
        `http://localhost:3333/consultations/${id}/status`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            status
          })
        }
      )

      loadConsultations()

    } catch (error) {

      console.log(error)

    }
  }

  function editPatient(patient) {

    setEditingId(patient.id)

    setName(patient.name)
    setEmail(patient.email)
    setPhone(patient.phone)
    setNotes(patient.notes)
  }

  function editConsultation(consultation) {

    setEditingConsultationId(
      consultation.id
    )

    setSelectedPatient(
      consultation.patientId
    )

    setConsultationDate(
      consultation.date.slice(0, 16)
    )

    setConsultationNotes(
      consultation.notes || ''
    )

    setConsultationValue(
      consultation.value || ''
    )
  }

  async function updateConsultation() {

    try {

      const token =
        localStorage.getItem('token')

      await fetch(
        `http://localhost:3333/consultations/${editingConsultationId}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            date: consultationDate,
            notes: consultationNotes,
            patientId: Number(selectedPatient),
            value: Number(consultationValue)
          })
        }
      )

      setEditingConsultationId(null)

      setSelectedPatient('')
      setConsultationDate('')
      setConsultationNotes('')
      setConsultationValue('')

      loadConsultations()

    } catch (error) {

      console.log(error)

    }
  }

  const chartData = [

    {
      name: 'Concluídas',
      value: consultations.filter(
        c => c.status === 'Concluída'
      ).length
    },

    {
      name: 'Agendadas',
      value: consultations.filter(
        c => c.status === 'Agendada'
      ).length
    },

    {
      name: 'Canceladas',
      value: consultations.filter(
        c => c.status === 'Cancelada'
      ).length
    }

  ]

  const COLORS = [
    '#22c55e',
    '#facc15',
    '#ef4444'
  ]

  return (
    <div className="dashboard">

      <aside className="sidebar">

        <h2>Psicologia System</h2>

        <button
          onClick={() => setScreen('dashboard')}
        >
          Dashboard
        </button>

        <button onClick={() => setScreen('patients')}>
          👥 Pacientes
        </button>

        <button onClick={() => setScreen('consultations')}>
          📅 Consultas
        </button>

        <button onClick={() => setScreen('financial')}>
          💰 Financeiro
        </button>

      </aside>

      <main className="content">

        {screen === 'dashboard' && (

          <>

            <h1>Dashboard</h1>

            <div className="stats">

              <div className="stat-card">
                <h3>👥 Pacientes</h3>
                <p>{patients.length}</p>
              </div>

              <div className="stat-card">
                <h3>📅 Consultas Totais</h3>
                <p>{consultations.length}</p>
              </div>

              <div className="stat-card">
                <h3>💰 Receita Total</h3>
                <p>
                  R$ {
                    consultations.reduce(
                      (total, consultation) =>
                        total +
                        (consultation.value || 0),
                      0
                    )
                  }
                </p>
              </div>

              <div className="stat-card">
                <h3>✅ Concluídas</h3>
                <p>
                  {
                    consultations.filter(
                      consultation =>
                        consultation.status ===
                        'Concluída'
                    ).length
                  }
                </p>



              </div>

            </div>

          </>

        )}

        {screen === 'patients' && (

          <>
            <div className="stats">

              <div className="stat-card">
                <h3>👥 Pacientes</h3>
                <p>{patients.length}</p>
              </div>

              <div className="stat-card">
                <h3>📅 Consultas</h3>
                <p>{consultations.length}</p>
              </div>

              <div className="stat-card">
                <h3>💰 Receita</h3>
                <p>
                  R$ {
                    consultations
                      .filter(
                        c => c.status === 'Concluída'
                      )
                      .reduce(
                        (total, c) =>
                          total + (c.value || 0),
                        0
                      )
                  }

                </p>
              </div>

            </div>

            <h1>Pacientes</h1>

            <input
              className="search-input"
              type="text"
              placeholder="🔍 Buscar paciente..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <div className="form">

              <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Telefone"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
              />

              <textarea
                placeholder="Prontuário Clínico"
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
              />

              <button
                onClick={
                  editingId
                    ? updatePatient
                    : createPatient
                }
              >
                {editingId
                  ? 'Salvar Alterações'
                  : 'Cadastrar Paciente'}
              </button>

            </div>

            <div className="patients-grid">

              {patients
                .filter((patient) =>
                  patient.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((patient) => (
                  <div
                    className="patient-card"
                    key={patient.id}
                  >

                    <h3>{patient.name}</h3>

                    <p>{patient.email}</p>

                    <p>{patient.phone}</p>

                    <>
                      <strong>Prontuário:</strong>

                      <br />

                      <small>{patient.notes}</small>
                    </>

                    <div className="actions">

                      <button
                        onClick={() =>
                          editPatient(patient)
                        }
                      >
                        Editar
                      </button>


                      <button
                        onClick={() =>
                          deletePatient(patient.id)
                        }
                      >
                        Excluir
                      </button>

                    </div>

                  </div>

                ))}

            </div>
          </>

        )}

        {screen === 'consultations' && (

          <>

            <h1>Consultas</h1>

            <div className="form">

              <select
                value={selectedPatient}
                onChange={(e) =>
                  setSelectedPatient(e.target.value)
                }
              >

                <option value="">
                  Selecione um paciente
                </option>

                {patients.map((patient) => (

                  <option
                    key={patient.id}
                    value={patient.id}
                  >
                    {patient.name}
                  </option>

                ))}

              </select>

              <input
                type="datetime-local"
                value={consultationDate}
                onChange={(e) =>
                  setConsultationDate(
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                placeholder="Valor da consulta"
                value={consultationValue}
                onChange={(e) =>
                  setConsultationValue(
                    e.target.value
                  )
                }
              />

              <textarea
                placeholder="Evolução Clínica da Sessão"
                value={consultationNotes}
                onChange={(e) =>
                  setConsultationNotes(
                    e.target.value
                  )
                }
              />

              <button
                onClick={
                  editingConsultationId
                    ? updateConsultation
                    : createConsultation
                }
              >

                {editingConsultationId
                  ? 'Salvar Alterações'
                  : 'Agendar Consulta'}

              </button>

            </div>

            <div className="patients-grid">

              {consultations.map((consultation) => (

                <div
                  className="patient-card"
                  key={consultation.id}
                >

                  <h3>
                    {consultation.patient?.name}
                  </h3>

                  <p>
                    {new Date(
                      consultation.date
                    ).toLocaleString()}
                  </p>

                  <p>
                    Valor: R$ {consultation.value}
                  </p>

                  <p>

                    <select
                      className={`status-select ${consultation.status}`}
                      value={consultation.status}
                      onChange={(e) =>
                        updateStatus(
                          consultation.id,
                          e.target.value
                        )
                      }
                    >

                      <option value="Agendada">
                        Agendada
                      </option>

                      <option value="Concluída">
                        Concluída
                      </option>

                      <option value="Cancelada">
                        Cancelada
                      </option>

                    </select>

                  </p>

                  <>
                    <strong>Evolução Clínica:</strong>

                    <br />

                    <small>
                      {consultation.notes}
                    </small>
                  </>

                  <div className="actions">

                    <button
                      onClick={() =>
                        editConsultation(
                          consultation
                        )
                      }
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        generateReceipt(
                          consultation
                        )
                      }
                    >
                      📄 Recibo
                    </button>

                    <button
                      onClick={() =>
                        deleteConsultation(
                          consultation.id
                        )
                      }
                    >
                      Excluir
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

        {screen === 'financial' && (

          <>

            <h1>Financeiro</h1>

            <button
              onClick={generateFinancialReport}
            >
              📄 Gerar PDF
            </button>

            <div className="stats">

              <div className="stat-card">
                <h3>💰 Receita Total</h3>
                <p>
                  R$ {
                    consultations.reduce(
                      (total, consultation) =>
                        total + (consultation.value || 0),
                      0
                    )
                  }
                </p>
              </div>

              <div className="stat-card">
                <h3>✅ Recebido</h3>
                <p>
                  R$ {
                    consultations
                      .filter(
                        consultation =>
                          consultation.status ===
                          'Concluída'
                      )
                      .reduce(
                        (total, consultation) =>
                          total +
                          (consultation.value || 0),
                        0
                      )
                  }
                </p>
              </div>

              <div className="stat-card">
                <h3>⏳ Pendente</h3>
                <p>
                  R$ {
                    consultations
                      .filter(
                        consultation =>
                          consultation.status ===
                          'Agendada'
                      )
                      .reduce(
                        (total, consultation) =>
                          total +
                          (consultation.value || 0),
                        0
                      )
                  }
                </p>
              </div>

              <div className="chart-card">

                <h2>
                  Consultas por Status
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <PieChart>

                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label
                    >

                      {chartData.map(
                        (entry, index) => (

                          <Cell
                            key={index}
                            fill={
                              COLORS[index]
                            }
                          />

                        )
                      )}

                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>

            <div className="financial-table">

              <table>

                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {consultations.map((consultation) => (

                    <tr key={consultation.id}>

                      <td>
                        {consultation.patient?.name}
                      </td>

                      <td>
                        {new Date(
                          consultation.date
                        ).toLocaleDateString()}
                      </td>

                      <td>
                        R$ {consultation.value}
                      </td>

                      <td>
                        {consultation.status}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </>

        )}

      </main>

    </div>
  )
}

export default Dashboard