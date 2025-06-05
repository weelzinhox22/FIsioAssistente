"use client"

export function BodyChartLegend() {
  const legendItems = [
    { color: "#ff0000", label: "Vermelho", description: "Dor aguda" },
    { color: "#0000ff", label: "Azul", description: "Dor crônica" },
    { color: "#ffcc00", label: "Amarelo", description: "Parestesia" },
    { color: "#00cc00", label: "Verde", description: "Melhora" },
    { color: "#9900cc", label: "Roxo", description: "Tensão" },
  ]

  const symbolItems = [
    { symbol: "linha", description: "Área de dor" },
    { symbol: "ponto", description: "Ponto específico de dor" },
    { symbol: "X", description: "Trigger point" },
    { symbol: "linha-tracejada", description: "Área de restrição" },
  ]

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-md">
      <h4 className="font-medium mb-2">Legenda</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h5 className="text-sm font-medium mb-1">Cores</h5>
          <div className="grid grid-cols-1 gap-1">
            {legendItems.map((item) => (
              <div key={item.color} className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                <span>
                  <strong>{item.label}</strong>: {item.description}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h5 className="text-sm font-medium mb-1">Símbolos</h5>
          <div className="grid grid-cols-1 gap-1">
            {symbolItems.map((item) => (
              <div key={item.symbol} className="flex items-center gap-2 text-sm">
                <div className="w-6 h-6 flex items-center justify-center">
                  {item.symbol === "linha" && <div className="w-4 h-1 bg-black rounded-full" />}
                  {item.symbol === "ponto" && <div className="w-3 h-3 bg-black rounded-full" />}
                  {item.symbol === "X" && <span className="text-black font-bold">X</span>}
                  {item.symbol === "linha-tracejada" && <div className="w-4 h-0 border border-dashed border-black" />}
                </div>
                <span>{item.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
