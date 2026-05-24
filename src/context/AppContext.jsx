// ============================================
// CONTEXT — Estado global de la aplicación
// ============================================

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { loadGastos, saveGastos } from '../utils/storage.js'
import { generateId, todayISO } from '../utils/helpers.js'
import { VIEWS } from '../utils/constants.js'

// ---- State shape ----
const initialState = {
  gastos: [],
  view: VIEWS.DASHBOARD,
  editingGasto: null,   // gasto que se está editando
  loading: false,
}

// ---- Reducer ----
function reducer(state, action) {
  switch (action.type) {

    case 'INIT_GASTOS':
      return { ...state, gastos: action.payload }

    case 'ADD_GASTO': {
      const nuevo = { ...action.payload, id: generateId() }
      const gastos = [nuevo, ...state.gastos]
      saveGastos(gastos)
      return { ...state, gastos, editingGasto: null }
    }

    case 'UPDATE_GASTO': {
      const gastos = state.gastos.map(g =>
        g.id === action.payload.id ? { ...g, ...action.payload } : g
      )
      saveGastos(gastos)
      return { ...state, gastos, editingGasto: null }
    }

    case 'DELETE_GASTO': {
      const gastos = state.gastos.filter(g => g.id !== action.payload)
      saveGastos(gastos)
      return { ...state, gastos }
    }

    case 'SET_VIEW':
      return { ...state, view: action.payload, editingGasto: null }

    case 'SET_EDITING':
      return { ...state, editingGasto: action.payload, view: VIEWS.AGREGAR }

    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    default:
      return state
  }
}

// ---- Context ----
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Cargar gastos desde localStorage al inicio
  useEffect(() => {
    const stored = loadGastos()
    dispatch({ type: 'INIT_GASTOS', payload: stored })
  }, [])

  // Actions
  const addGasto = (data) => dispatch({ type: 'ADD_GASTO', payload: data })
  const updateGasto = (data) => dispatch({ type: 'UPDATE_GASTO', payload: data })
  const deleteGasto = (id) => dispatch({ type: 'DELETE_GASTO', payload: id })
  const setView = (view) => dispatch({ type: 'SET_VIEW', payload: view })
  const setEditing = (gasto) => dispatch({ type: 'SET_EDITING', payload: gasto })
  const setLoading = (v) => dispatch({ type: 'SET_LOADING', payload: v })

  return (
    <AppContext.Provider value={{
      ...state,
      addGasto,
      updateGasto,
      deleteGasto,
      setView,
      setEditing,
      setLoading,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
