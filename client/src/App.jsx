// client/src/App.jsx
// ============================================ 
// FRONTEND: Dashboard Reactivo con React
// ============================================

import { useState, useEffect } from 'react'
import './App.css'

// 🔥 URL DEL BACKEND EN RENDER
const API_URL = "https://proyecto-reactivo-api.onrender.com";

function App() {

  // ===============================
  // 1️⃣ ESTADO REACTIVO
  // ===============================
  const [sensores, setSensores] = useState([])

  const [formulario, setFormulario] = useState({
    nombre: '',
    tipo: '',
    valor: ''
  })

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [filtroTipo, setFiltroTipo] = useState('todos')

  // ===============================
  // 2️⃣ EFECTOS (ciclo de vida)
  // ===============================
  useEffect(() => {
    cargarSensores()
  }, [])

  const cargarSensores = async () => {
    setCargando(true)
    setError(null)

    try {
      const respuesta = await fetch(`${API_URL}/api/sensores`)

      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`)
      }

      const datos = await respuesta.json()
      setSensores(datos)

    } catch (err) {
      console.error("❌ Error al cargar sensores:", err)
      setError("No se pudo conectar con el servidor.")
    } finally {
      setCargando(false)
    }
  }

  // ===============================
  // MANEJAR INPUTS
  // ===============================
  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    })
  }

  // ===============================
  // AGREGAR SENSOR
  // ===============================
  const agregarSensor = async (e) => {
    e.preventDefault()

    if (!formulario.nombre || !formulario.tipo || !formulario.valor) {
      alert("Por favor completa todos los campos")
      return
    }

    try {
      const respuesta = await fetch(`${API_URL}/api/sensores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formulario)
      })

      if (!respuesta.ok) {
        throw new Error("Error al crear sensor")
      }

      setFormulario({ nombre: '', tipo: '', valor: '' })
      cargarSensores()

    } catch (err) {
      console.error("❌ Error:", err)
      alert("Error al agregar el sensor")
    }
  }

  // ===============================
  // ELIMINAR SENSOR
  // ===============================
  const eliminarSensor = async (id) => {
    const sensor = sensores.find(s => s.id === id)

    if (!window.confirm(`¿Eliminar ${sensor?.nombre}?`)) {
      return
    }

    try {
      const respuesta = await fetch(`${API_URL}/api/sensores/${id}`, {
        method: 'DELETE'
      })

      if (!respuesta.ok) {
        throw new Error("Error al eliminar")
      }

      cargarSensores()

    } catch (err) {
      console.error("❌ Error al eliminar:", err)
      alert("Error al eliminar el sensor")
    }
  }

  // ===============================
  // FILTRADO REACTIVO
  // ===============================
  const sensoresFiltrados =
    filtroTipo === 'todos'
      ? sensores
      : sensores.filter(s => s.tipo === filtroTipo)

  // ===============================
  // VISTA
  // ===============================
  return (
    <div className="contenedor">
      <header>
        <h1>📡 SensorFlow Dashboard</h1>
        <p className="subtitulo">
          Programación Reactiva con React + Node.js
        </p>
      </header>

      {/* FORMULARIO */}
      <form onSubmit={agregarSensor} className="formulario">
        <input
          name="nombre"
          placeholder="Nombre (ej. Sala)"
          value={formulario.nombre}
          onChange={manejarCambio}
          required
        />

        <select
          name="tipo"
          value={formulario.tipo}
          onChange={manejarCambio}
          required
        >
          <option value="">Tipo...</option>
          <option value="Temperatura">🌡️ Temperatura</option>
          <option value="Humedad">💧 Humedad</option>
          <option value="Luz">☀️ Luz</option>
        </select>

        <input
          name="valor"
          type="number"
          placeholder="Valor"
          value={formulario.valor}
          onChange={manejarCambio}
          required
        />

        <button type="submit" disabled={cargando}>
          {cargando ? 'Cargando...' : '➕ Agregar'}
        </button>
      </form>

      {/* FILTROS */}
      <div className="filtros">
        <label>Filtrar por tipo: </label>
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="Temperatura">Temperatura</option>
          <option value="Humedad">Humedad</option>
          <option value="Luz">Luz</option>
        </select>
      </div>

      {/* MENSAJES */}
      {error && <div className="error">⚠️ {error}</div>}

      {cargando && !sensores.length && (
        <div className="cargando">⏳ Cargando sensores...</div>
      )}

      {/* LISTA */}
      <div className="grid-sensores">
        {sensoresFiltrados.map((sensor) => (
          <article key={sensor.id} className="tarjeta-sensor">
            <h3>{sensor.nombre}</h3>
            <p className="tipo">🏷️ {sensor.tipo}</p>
            <p className="valor">
              📊 {sensor.valor}{' '}
              {sensor.tipo === 'Temperatura'
                ? '°C'
                : sensor.tipo === 'Humedad'
                ? '%'
                : 'lux'}
            </p>

            <button
              onClick={() => eliminarSensor(sensor.id)}
              className="btn-eliminar"
            >
              🗑️ Eliminar
            </button>
          </article>
        ))}
      </div>

      {/* MENSAJE VACÍO */}
      {sensoresFiltrados.length === 0 && !cargando && (
        <p className="vacio">
          {filtroTipo === 'todos'
            ? 'No hay sensores registrados. ¡Agrega uno!'
            : `No hay sensores de tipo "${filtroTipo}"`}
        </p>
      )}
    </div>
  )
}

export default App