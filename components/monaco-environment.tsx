"use client"

import { useEffect } from "react"

// Este componente configura o ambiente Monaco para usar web workers corretamente
export function MonacoEnvironment() {
  useEffect(() => {
    // Definir o ambiente Monaco global
    window.MonacoEnvironment = {
      getWorkerUrl: (_moduleId: string, label: string) => {
        let workerPath = ""

        if (label === "typescript" || label === "javascript") {
          workerPath = "/monaco-editor/ts.worker.js"
        } else if (label === "html" || label === "handlebars" || label === "razor") {
          workerPath = "/monaco-editor/html.worker.js"
        } else if (label === "css" || label === "scss" || label === "less") {
          workerPath = "/monaco-editor/css.worker.js"
        } else if (label === "json") {
          workerPath = "/monaco-editor/json.worker.js"
        } else {
          workerPath = "/monaco-editor/editor.worker.js"
        }

        // Retorna a URL para o worker
        return workerPath
      },
    }
  }, [])

  // Este componente não renderiza nada visível
  return null
}

// Adicionar a declaração de tipo para o objeto MonacoEnvironment no objeto window
declare global {
  interface Window {
    MonacoEnvironment: {
      getWorkerUrl: (moduleId: string, label: string) => string
    }
  }
}
