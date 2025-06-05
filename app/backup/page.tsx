"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, Upload, AlertTriangle, Save, Database } from "lucide-react"
import { exportData, importData } from "@/lib/db"
import { toast } from "@/components/ui/use-toast"

export default function BackupPage() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const data = await exportData()

      // Criar um blob com os dados
      const blob = new Blob([data], { type: "application/json" })

      // Criar um link para download
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      // Nome do arquivo com data atual
      const date = new Date().toISOString().split("T")[0]
      link.download = `fisiobase_backup_${date}.json`

      // Simular clique para iniciar o download
      document.body.appendChild(link)
      link.click()

      // Limpar
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Backup realizado com sucesso",
        description: "Seus dados foram exportados com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao exportar dados:", error)
      toast({
        title: "Erro ao realizar backup",
        description: "Ocorreu um erro ao exportar seus dados. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo de backup para importar.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsImporting(true)

      // Ler o arquivo
      const reader = new FileReader()

      reader.onload = async (e) => {
        if (e.target?.result) {
          const jsonData = e.target.result as string

          // Validar o JSON
          try {
            JSON.parse(jsonData)
          } catch (error) {
            toast({
              title: "Arquivo inválido",
              description: "O arquivo selecionado não é um backup válido.",
              variant: "destructive",
            })
            setIsImporting(false)
            return
          }

          // Importar os dados
          const success = await importData(jsonData)

          if (success) {
            toast({
              title: "Restauração concluída",
              description: "Seus dados foram restaurados com sucesso.",
            })

            // Recarregar a página para refletir os novos dados
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          } else {
            toast({
              title: "Erro na restauração",
              description: "Ocorreu um erro ao restaurar seus dados. Tente novamente.",
              variant: "destructive",
            })
          }
        }

        setIsImporting(false)
      }

      reader.readAsText(importFile)
    } catch (error) {
      console.error("Erro ao importar dados:", error)
      toast({
        title: "Erro na restauração",
        description: "Ocorreu um erro ao processar o arquivo. Tente novamente.",
        variant: "destructive",
      })
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-900">Backup e Restauro de Dados</h2>

      <Alert className="bg-blue-50 border-blue-200">
        <Database className="h-4 w-4 text-blue-800" />
        <AlertTitle className="text-blue-800">Armazenamento Local</AlertTitle>
        <AlertDescription>
          Todos os dados desta aplicação são armazenados localmente no seu navegador. É altamente recomendado realizar
          backups regulares para evitar perda de dados.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-800" />
              Realizar Backup
            </CardTitle>
            <CardDescription>
              Exporte todos os seus dados para um arquivo JSON que pode ser armazenado com segurança.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">
              O backup inclui todas as fichas de pacientes, registros do diário, favoritos e outros dados armazenados na
              aplicação. O arquivo gerado pode ser usado posteriormente para restaurar seus dados.
            </p>

            <Button onClick={handleExport} className="w-full bg-green-600 hover:bg-green-700" disabled={isExporting}>
              {isExporting ? (
                "Exportando dados..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Exportar Todos os Dados
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-800" />
              Restaurar Dados
            </CardTitle>
            <CardDescription>Importe dados de um arquivo de backup previamente exportado.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Atenção</AlertTitle>
              <AlertDescription>
                A restauração substituirá todos os dados atuais. Esta ação não pode ser desfeita.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Clique para selecionar</span> ou arraste o arquivo
                    </p>
                    <p className="text-xs text-gray-500">Arquivo JSON de backup</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".json"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setImportFile(e.target.files[0])
                      }
                    }}
                  />
                </label>
              </div>

              {importFile && (
                <div className="text-sm text-center">
                  Arquivo selecionado: <span className="font-medium">{importFile.name}</span>
                </div>
              )}

              <Button onClick={handleImport} className="w-full" variant="outline" disabled={!importFile || isImporting}>
                {isImporting ? (
                  "Importando dados..."
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" /> Restaurar Dados
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dicas para Gerenciamento de Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc pl-5">
            <li>Realize backups regularmente, especialmente após adicionar muitos dados novos.</li>
            <li>Armazene seus arquivos de backup em múltiplos locais (ex: pendrive, nuvem, etc.).</li>
            <li>
              Ao trocar de computador ou reinstalar o navegador, use a função de restauração para recuperar seus dados.
            </li>
            <li>
              Lembre-se que a limpeza do cache do navegador pode resultar na perda de dados. Sempre faça backup antes.
            </li>
            <li>
              Os dados são armazenados apenas no navegador atual. Se você usar outro navegador ou dispositivo, precisará
              restaurar seus dados lá também.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
