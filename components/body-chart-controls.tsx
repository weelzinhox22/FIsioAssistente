"use client"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Circle, Pencil, Target, Minus } from "lucide-react"

interface BodyChartControlsProps {
  drawingMode: string
  setDrawingMode: (mode: string) => void
  drawingColor: string
  setDrawingColor: (color: string) => void
  drawingSize: number
  setDrawingSize: (size: number) => void
}

export function BodyChartControls({
  drawingMode,
  setDrawingMode,
  drawingColor,
  setDrawingColor,
  drawingSize,
  setDrawingSize,
}: BodyChartControlsProps) {
  const colorOptions = [
    { value: "#ff0000", label: "Vermelho", description: "Dor aguda" },
    { value: "#0000ff", label: "Azul", description: "Dor crônica" },
    { value: "#ffcc00", label: "Amarelo", description: "Parestesia" },
    { value: "#00cc00", label: "Verde", description: "Melhora" },
    { value: "#9900cc", label: "Roxo", description: "Tensão" },
  ]

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 block">Modo de Marcação</Label>
        <RadioGroup value={drawingMode} onValueChange={setDrawingMode} className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pain" id="pain" />
            <Label htmlFor="pain" className="flex items-center gap-1">
              <Pencil className="h-4 w-4" /> Dor
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="point" id="point" />
            <Label htmlFor="point" className="flex items-center gap-1">
              <Circle className="h-4 w-4" /> Ponto
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="trigger" id="trigger" />
            <Label htmlFor="trigger" className="flex items-center gap-1">
              <Target className="h-4 w-4" /> Trigger Point
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="restriction" id="restriction" />
            <Label htmlFor="restriction" className="flex items-center gap-1">
              <Minus className="h-4 w-4" /> Restrição
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="mb-2 block">Cor</Label>
        <div className="grid grid-cols-5 gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              className={`h-8 rounded-md border-2 ${
                drawingColor === color.value ? "border-black" : "border-transparent"
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => setDrawingColor(color.value)}
              title={`${color.label} - ${color.description}`}
            />
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Tamanho: {drawingSize}px</Label>
        <Slider value={[drawingSize]} min={1} max={20} step={1} onValueChange={(value) => setDrawingSize(value[0])} />
      </div>
    </div>
  )
}
